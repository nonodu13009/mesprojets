/* ============================================================
   Cloud Function "tuteur" — proxy sécurisé vers l'API Anthropic
   - Reçoit { lecon, messages, code? } depuis le front (rewrite /api/tuteur)
   - Charge l'agent recruté (agents/agents.json) + son savoir (agents/savoirs/)
   - La clé API reste côté serveur (secret Firebase ANTHROPIC_API_KEY)
   Les fichiers agents/ sont copiés ici au déploiement (predeploy, firebase.json).
   ============================================================ */

"use strict";

const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const fs = require("fs");
const path = require("path");

const cleApi = defineSecret("ANTHROPIC_API_KEY");

const MODELE = "claude-opus-4-6";
const MAX_MESSAGES = 20;
const MAX_CHARS_MESSAGE = 4000;
const MAX_CHARS_CODE = 8000;

/* ---- Chargement des agents recrutés (une fois par instance) ---- */

let cacheAgents = null;
const chargerAgents = () => {
    if (!cacheAgents) {
        const brut = fs.readFileSync(path.join(__dirname, "agents", "agents.json"), "utf8");
        cacheAgents = JSON.parse(brut);
    }
    return cacheAgents;
};

const chargerSavoir = (numeroLecon) =>
    fs.readFileSync(
        path.join(__dirname, "agents", "savoirs", `lecon${numeroLecon}.md`),
        "utf8"
    );

/* ---- Validation d'entrée ---- */

const validerRequete = (corps) => {
    if (!corps || typeof corps !== "object") return "Corps de requête invalide.";

    const lecon = Number(corps.lecon);
    if (!Number.isInteger(lecon)) return "Paramètre 'lecon' manquant ou invalide.";
    if (!chargerAgents().agents.some((a) => a.lecon === lecon))
        return `Aucun agent recruté pour la leçon ${lecon}.`;

    if (!Array.isArray(corps.messages) || corps.messages.length === 0)
        return "Paramètre 'messages' manquant.";
    if (corps.messages.length > MAX_MESSAGES)
        return `Historique trop long (max ${MAX_MESSAGES} messages).`;

    for (const m of corps.messages) {
        if (!m || (m.role !== "user" && m.role !== "assistant"))
            return "Chaque message doit avoir un rôle 'user' ou 'assistant'.";
        if (typeof m.content !== "string" || !m.content.trim())
            return "Chaque message doit avoir un contenu texte.";
        if (m.content.length > MAX_CHARS_MESSAGE)
            return `Message trop long (max ${MAX_CHARS_MESSAGE} caractères).`;
    }

    if (corps.code !== undefined) {
        if (typeof corps.code !== "string") return "Paramètre 'code' invalide.";
        if (corps.code.length > MAX_CHARS_CODE)
            return `Code trop long (max ${MAX_CHARS_CODE} caractères).`;
    }
    return null;
};

/* ---- Fonction HTTP ---- */

exports.tuteur = onRequest(
    { region: "europe-west1", secrets: [cleApi], maxInstances: 3, timeoutSeconds: 60, cors: true },
    async (req, res) => {
        if (req.method !== "POST") {
            res.status(405).json({ erreur: "Méthode non autorisée." });
            return;
        }

        const erreur = validerRequete(req.body);
        if (erreur) {
            res.status(400).json({ erreur });
            return;
        }

        const lecon = Number(req.body.lecon);
        const agent = chargerAgents().agents.find((a) => a.lecon === lecon);
        const savoir = chargerSavoir(lecon);

        // Dernier message enrichi du code de la console si fourni
        const messages = req.body.messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));
        if (req.body.code && req.body.code.trim()) {
            const dernier = messages[messages.length - 1];
            dernier.content +=
                "\n\nCode écrit dans la console d'exercices :\n```js\n" +
                req.body.code.trim() +
                "\n```";
        }

        try {
            const reponse = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "x-api-key": cleApi.value(),
                    "anthropic-version": "2023-06-01",
                },
                body: JSON.stringify({
                    model: MODELE,
                    max_tokens: 1024,
                    system: [
                        {
                            type: "text",
                            text:
                                agent.prompt_systeme +
                                "\n\n--- SAVOIR DE LA LEÇON (seule source autorisée) ---\n\n" +
                                savoir,
                            cache_control: { type: "ephemeral" },
                        },
                    ],
                    messages,
                }),
            });

            if (!reponse.ok) {
                console.error("API Anthropic", reponse.status, await reponse.text());
                res.status(502).json({ erreur: "Le tuteur est indisponible, réessaie dans un instant." });
                return;
            }

            const donnees = await reponse.json();
            const texte = donnees.content.find((b) => b.type === "text");
            res.json({
                agent: agent.nom,
                lecon,
                reponse: texte ? texte.text : "",
            });
        } catch (err) {
            console.error("Erreur tuteur :", err);
            res.status(500).json({ erreur: "Erreur interne du tuteur." });
        }
    }
);
