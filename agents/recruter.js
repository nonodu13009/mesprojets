#!/usr/bin/env node
/* ============================================================
   Recruteur d'agents — étape "build-time"
   1. Inventaire : scanne JS/lecon*\/ et extrait le contenu pédagogique
   2. Savoirs : condense chaque leçon en agents/savoirs/leconN.md (Claude)
   3. Recrutement : l'orchestrateur (Claude) génère agents/agents.json
      (un agent tuteur spécialisé par leçon)

   Usage :
     node agents/recruter.js            → recrute les leçons manquantes
     node agents/recruter.js --force    → régénère tout
     node agents/recruter.js --lecon 4  → régénère uniquement la leçon 4
     node agents/recruter.js --dry      → inventaire seul, aucun appel API

   Clé API lue dans .env (ANTHROPIC_API_KEY). Aucune dépendance npm.
   ============================================================ */

"use strict";

const fs = require("fs");
const path = require("path");

const RACINE = path.resolve(__dirname, "..");
const DOSSIER_SAVOIRS = path.join(__dirname, "savoirs");
const FICHIER_AGENTS = path.join(__dirname, "agents.json");
const MODELE = "claude-opus-4-6";
const API_URL = "https://api.anthropic.com/v1/messages";

/* ---- Clé API depuis .env ---- */

const lireCleApi = () => {
    const cheminEnv = path.join(RACINE, ".env");
    if (!fs.existsSync(cheminEnv)) {
        console.error("Fichier .env introuvable à la racine du projet.");
        process.exit(1);
    }
    const ligne = fs
        .readFileSync(cheminEnv, "utf8")
        .split("\n")
        .find((l) => l.startsWith("ANTHROPIC_API_KEY="));
    if (!ligne) {
        console.error("ANTHROPIC_API_KEY absente du .env.");
        process.exit(1);
    }
    return ligne.slice("ANTHROPIC_API_KEY=".length).trim();
};

/* ---- Extraction HTML → texte pédagogique ---- */

const decoderEntites = (texte) =>
    texte
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&");

const htmlVersTexte = (html) => {
    // Isole <main>, ignore nav/footer/scripts
    const main = (html.match(/<main>([\s\S]*?)<\/main>/) || [null, html])[1];

    let texte = main
        // Blocs de code → fences markdown (contenu préservé, spans retirés)
        .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (_, code) => {
            const brut = decoderEntites(code.replace(/<[^>]+>/g, ""));
            return "\n```js\n" + brut + "\n```\n";
        })
        // Titres → markdown
        .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, (_, t) => "\n## " + t.replace(/<[^>]+>/g, "") + "\n")
        .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, (_, t) => "\n### " + t.replace(/<[^>]+>/g, "") + "\n")
        // Cellules et items → séparateurs lisibles
        .replace(/<\/(td|th)>/g, " | ")
        .replace(/<\/tr>/g, "\n")
        .replace(/<li[^>]*>/g, "\n- ")
        // Le reste des balises disparaît
        .replace(/<[^>]+>/g, "");

    return decoderEntites(texte)
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
};

const extraireTitre = (html) =>
    (html.match(/<title>([\s\S]*?)<\/title>/) || [null, "Sans titre"])[1].trim();

/* ---- Inventaire des leçons ---- */

const inventorier = () => {
    const dossierJS = path.join(RACINE, "JS");
    const lecons = fs
        .readdirSync(dossierJS)
        .filter((d) => /^lecon\d+/.test(d))
        .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

    return lecons.map((dossier) => {
        const numero = parseInt(dossier.match(/\d+/)[0]);
        const chemin = path.join(dossierJS, dossier);
        const pages = fs.readdirSync(chemin).filter((f) => f.endsWith(".html"));

        const index = fs.readFileSync(path.join(chemin, "index.html"), "utf8");
        const chapitres = pages
            .filter((p) => p !== "index.html")
            .map((p) => {
                const html = fs.readFileSync(path.join(chemin, p), "utf8");
                return {
                    fichier: p,
                    titre: extraireTitre(html),
                    contenu: htmlVersTexte(html),
                };
            });

        return {
            numero,
            dossier,
            titre: extraireTitre(index),
            chapitres,
        };
    });
};

/* ---- Appel API Anthropic (fetch natif Node 18+) ---- */

const appelerClaude = async (cleApi, options) => {
    const MAX_ESSAIS = 4;
    for (let essai = 1; essai <= MAX_ESSAIS; essai++) {
        try {
            const reponse = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "x-api-key": cleApi,
                    "anthropic-version": "2023-06-01",
                },
                body: JSON.stringify({ model: MODELE, ...options }),
            });
            if (!reponse.ok) {
                const corps = await reponse.text();
                // 429/5xx : on retente ; 4xx : erreur définitive
                if (reponse.status !== 429 && reponse.status < 500)
                    throw Object.assign(new Error(`API ${reponse.status} : ${corps}`), {
                        definitive: true,
                    });
                throw new Error(`API ${reponse.status}`);
            }
            const donnees = await reponse.json();
            return donnees.content.find((b) => b.type === "text").text;
        } catch (err) {
            if (err.definitive || essai === MAX_ESSAIS) throw err;
            const attente = 2000 * essai;
            process.stdout.write(`(retry ${essai}/${MAX_ESSAIS - 1} dans ${attente / 1000}s) `);
            await new Promise((r) => setTimeout(r, attente));
        }
    }
};

/* ---- Étape savoirs : condensation d'une leçon ---- */

const genererSavoir = async (cleApi, lecon) => {
    const contenu = lecon.chapitres
        .map((c) => `# ${c.titre}\n\n${c.contenu}`)
        .join("\n\n---\n\n");

    return appelerClaude(cleApi, {
        max_tokens: 6000,
        thinking: { type: "adaptive" },
        system:
            "Tu es documentaliste pédagogique. Tu condenses le contenu d'une leçon " +
            "de formation JavaScript en une fiche de référence Markdown fidèle et " +
            "complète, destinée à servir de base de connaissances à un agent tuteur IA. " +
            "Conserve : tous les concepts, la terminologie exacte de la formation, " +
            "les exemples de code clés (raccourcis si longs), les pièges signalés, " +
            "et la liste des chapitres avec leurs fichiers HTML. " +
            "N'invente rien qui ne soit pas dans la leçon. Réponds uniquement avec le Markdown.",
        messages: [
            {
                role: "user",
                content:
                    `Leçon ${lecon.numero} — ${lecon.titre}\n` +
                    `Dossier : JS/${lecon.dossier}/\n\n${contenu}`,
            },
        ],
    });
};

/* ---- Étape recrutement : l'orchestrateur génère agents.json ---- */

const recruterAgents = async (cleApi, lecons, savoirs) => {
    const inventaire = lecons
        .map(
            (l) =>
                `Leçon ${l.numero} — ${l.titre}\n` +
                l.chapitres.map((c) => `  - ${c.titre} (${c.fichier})`).join("\n") +
                `\nRésumé du savoir :\n${savoirs[l.numero].slice(0, 1500)}`
        )
        .join("\n\n");

    const texte = await appelerClaude(cleApi, {
        max_tokens: 8000,
        thinking: { type: "adaptive" },
        system:
            "Tu es un orchestrateur RH d'agents IA. À partir de l'inventaire des leçons " +
            "d'une formation JavaScript, tu recrutes UN agent tuteur spécialisé PAR leçon. " +
            "Chaque agent a un double rôle : (1) tuteur Q&A qui répond aux questions de " +
            "l'apprenant sur sa leçon, (2) correcteur qui relit le code écrit dans la " +
            "console d'exercices. Les agents tutoient l'apprenant (Jean-Michel, dev junior), " +
            "répondent en français, citent les chapitres de la formation, restent dans le " +
            "périmètre de leur leçon (ils renvoient vers la bonne leçon sinon) et refusent " +
            "tout sujet hors formation. Réponds UNIQUEMENT avec un JSON valide, sans " +
            "backticks, au format :\n" +
            '{ "version": 1, "genere_le": "<date ISO>", "agents": [ { "lecon": <numero>, ' +
            '"id": "tuteur-leconN", "nom": "<nom court et sympathique>", ' +
            '"perimetre": "<1 phrase>", "prompt_systeme": "<prompt complet en français, ' +
            "300-500 mots, structuré : rôle, périmètre, méthode pédagogique, règles de " +
            'correction de code, garde-fous, format de réponse>" } ] }',
        messages: [
            {
                role: "user",
                content:
                    "Voici l'inventaire des compétences de la formation. Recrute les agents.\n\n" +
                    inventaire,
            },
        ],
    });

    // L'API peut entourer le JSON de texte : on isole le premier objet complet
    const debut = texte.indexOf("{");
    const fin = texte.lastIndexOf("}");
    return JSON.parse(texte.slice(debut, fin + 1));
};

/* ---- Programme principal ---- */

const principal = async () => {
    const args = process.argv.slice(2);
    const force = args.includes("--force");
    const indexLecon = args.indexOf("--lecon");
    const leconCible = indexLecon !== -1 ? parseInt(args[indexLecon + 1]) : null;

    console.log("1/3 Inventaire des leçons…");
    const lecons = inventorier();
    console.log(
        lecons.map((l) => `    Leçon ${l.numero} : ${l.chapitres.length} chapitres`).join("\n")
    );

    if (args.includes("--dry")) {
        const exemple = lecons[0].chapitres[0];
        console.log(`\nExtrait témoin (${exemple.titre}) :\n`);
        console.log(exemple.contenu.slice(0, 1200));
        return;
    }

    const cleApi = lireCleApi();
    fs.mkdirSync(DOSSIER_SAVOIRS, { recursive: true });

    console.log("2/3 Génération des savoirs…");
    const savoirs = {};
    for (const lecon of lecons) {
        const fichier = path.join(DOSSIER_SAVOIRS, `lecon${lecon.numero}.md`);
        const doitGenerer =
            force || leconCible === lecon.numero || !fs.existsSync(fichier);

        if (doitGenerer && (leconCible === null || leconCible === lecon.numero)) {
            process.stdout.write(`    Leçon ${lecon.numero} : condensation… `);
            savoirs[lecon.numero] = await genererSavoir(cleApi, lecon);
            fs.writeFileSync(fichier, savoirs[lecon.numero] + "\n");
            console.log("ok →", path.relative(RACINE, fichier));
        } else if (fs.existsSync(fichier)) {
            savoirs[lecon.numero] = fs.readFileSync(fichier, "utf8");
            console.log(`    Leçon ${lecon.numero} : savoir existant conservé`);
        } else {
            console.log(`    Leçon ${lecon.numero} : ignorée (--lecon ${leconCible})`);
            savoirs[lecon.numero] = "";
        }
    }

    console.log("3/3 Recrutement des agents par l'orchestrateur…");
    const agents = await recruterAgents(cleApi, lecons, savoirs);
    fs.writeFileSync(FICHIER_AGENTS, JSON.stringify(agents, null, 2) + "\n");
    console.log(
        `    ${agents.agents.length} agents recrutés → ${path.relative(RACINE, FICHIER_AGENTS)}`
    );
    agents.agents.forEach((a) =>
        console.log(`      Leçon ${a.lecon} : ${a.nom} — ${a.perimetre}`)
    );
    console.log("Terminé.");
};

principal().catch((err) => {
    console.error("Échec :", err.message);
    process.exit(1);
});
