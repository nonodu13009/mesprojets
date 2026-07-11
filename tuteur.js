/* ============================================================
   Tuteur IA — bulle de chat flottante
   - Pages de leçon (JS/leconN/…) : agent spécialisé de la leçon courante
   - Console JS : sélecteur de leçon + bouton « Joindre mon code »
   Appelle la Cloud Function via /api/tuteur (clé API côté serveur).
   Aucune dépendance externe. Historique en sessionStorage.
   ============================================================ */

(() => {
    "use strict";

    /* ---- Contexte : leçon courante ---- */

    const detecterLecon = () => {
        const m = location.pathname.match(/\/JS\/lecon(\d+)/);
        return m ? parseInt(m[1]) : null;
    };

    const API_URL =
        location.hostname === "localhost" || location.hostname === "127.0.0.1"
            ? "https://mesprojets-nogaro.web.app/api/tuteur"
            : "/api/tuteur";

    const NOMS_LECONS = {
        1: "Bases, variables & types",
        2: "Boucles, conditions & fonctions",
        3: "JavaScript moderne (ES6)",
        4: "Manipulation du DOM",
        5: "JavaScript asynchrone",
        6: "Projets pratiques & API",
    };

    const MAX_HISTORIQUE = 12;

    /* ---- État ---- */

    let leconActive = detecterLecon() || 1;
    const cleStockage = () => "tuteur:lecon" + leconActive;

    const lireHistorique = () => {
        try {
            return JSON.parse(sessionStorage.getItem(cleStockage())) || [];
        } catch {
            return [];
        }
    };

    const ecrireHistorique = (messages) => {
        sessionStorage.setItem(
            cleStockage(),
            JSON.stringify(messages.slice(-MAX_HISTORIQUE))
        );
    };

    /* ---- Rendu Markdown minimal (code, gras, inline code) ---- */

    const echapper = (t) =>
        t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const rendre = (texte) => {
        let html = echapper(texte);
        html = html.replace(
            /```[a-z]*\n([\s\S]*?)```/g,
            (_, code) => "<pre>" + code.trim() + "</pre>"
        );
        html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");
        html = html.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
        return html.replace(/\n/g, "<br>");
    };

    /* ---- Interface ---- */

    const construire = () => {
        const conteneur = document.createElement("div");
        conteneur.className = "tuteur";
        const surConsole = !!document.querySelector("#console-js-page");

        conteneur.innerHTML = `
            <button type="button" class="tuteur-bulle" aria-label="Ouvrir le tuteur IA">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7
                             8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8
                             8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
            </button>
            <div class="tuteur-panneau" hidden>
                <div class="tuteur-entete">
                    <div>
                        <strong class="tuteur-nom">Tuteur IA</strong>
                        <span class="tuteur-sous-titre"></span>
                    </div>
                    <button type="button" class="tuteur-fermer" aria-label="Fermer">✕</button>
                </div>
                ${
                    detecterLecon()
                        ? ""
                        : `<select class="tuteur-selecteur" aria-label="Choisir la leçon">
                            ${Object.entries(NOMS_LECONS)
                                .map(([n, t]) => `<option value="${n}">Leçon ${n} — ${t}</option>`)
                                .join("")}
                           </select>`
                }
                <div class="tuteur-messages" aria-live="polite"></div>
                <form class="tuteur-form">
                    ${
                        surConsole || document.querySelector(".cjs-editeur")
                            ? `<label class="tuteur-code"><input type="checkbox" class="tuteur-joindre">
                               Joindre mon code de la console</label>`
                            : ""
                    }
                    <div class="tuteur-saisie">
                        <textarea rows="2" placeholder="Pose ta question sur la leçon…"
                                  aria-label="Question au tuteur"></textarea>
                        <button type="submit">Envoyer</button>
                    </div>
                </form>
            </div>`;
        document.body.appendChild(conteneur);

        const bulle = conteneur.querySelector(".tuteur-bulle");
        const panneau = conteneur.querySelector(".tuteur-panneau");
        const zone = conteneur.querySelector(".tuteur-messages");
        const form = conteneur.querySelector(".tuteur-form");
        const textarea = form.querySelector("textarea");
        const sousTitre = conteneur.querySelector(".tuteur-sous-titre");
        const selecteur = conteneur.querySelector(".tuteur-selecteur");
        const joindre = conteneur.querySelector(".tuteur-joindre");

        const majSousTitre = () => {
            sousTitre.textContent = "Leçon " + leconActive + " · " + NOMS_LECONS[leconActive];
        };

        const afficher = (role, texte) => {
            const div = document.createElement("div");
            div.className = "tuteur-msg tuteur-msg--" + role;
            div.innerHTML = rendre(texte);
            zone.appendChild(div);
            zone.scrollTop = zone.scrollHeight;
            return div;
        };

        const restaurer = () => {
            zone.innerHTML = "";
            const historique = lireHistorique();
            if (historique.length === 0) {
                afficher(
                    "assistant",
                    "Salut Jean-Michel ! Je suis ton tuteur pour la leçon " +
                        leconActive +
                        ". Pose-moi une question ou envoie-moi ton code à corriger."
                );
            } else {
                historique.forEach((m) => afficher(m.role, m.content));
            }
        };

        bulle.addEventListener("click", () => {
            panneau.hidden = !panneau.hidden;
            if (!panneau.hidden) {
                majSousTitre();
                restaurer();
                textarea.focus();
            }
        });
        conteneur.querySelector(".tuteur-fermer").addEventListener("click", () => {
            panneau.hidden = true;
        });

        if (selecteur) {
            selecteur.value = String(leconActive);
            selecteur.addEventListener("change", () => {
                leconActive = parseInt(selecteur.value);
                majSousTitre();
                restaurer();
            });
        }

        textarea.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                form.requestSubmit();
            }
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const question = textarea.value.trim();
            if (!question) return;

            const historique = lireHistorique();
            historique.push({ role: "user", content: question });
            afficher("user", question);
            textarea.value = "";

            let code;
            if (joindre && joindre.checked) {
                const editeur = document.querySelector(".cjs-editeur");
                if (editeur && editeur.value.trim()) code = editeur.value;
            }

            const attente = afficher("assistant", "…");
            form.querySelector("button").disabled = true;

            try {
                const reponse = await fetch(API_URL, {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        lecon: leconActive,
                        messages: historique.slice(-MAX_HISTORIQUE),
                        code,
                    }),
                });
                const donnees = await reponse.json();
                if (!reponse.ok) throw new Error(donnees.erreur || "Erreur serveur");

                attente.innerHTML = rendre(donnees.reponse);
                conteneur.querySelector(".tuteur-nom").textContent = donnees.agent;
                historique.push({ role: "assistant", content: donnees.reponse });
                ecrireHistorique(historique);
            } catch (err) {
                attente.innerHTML = rendre("Oups : " + err.message);
                historique.pop(); // question non aboutie, on la retire
                ecrireHistorique(historique);
            } finally {
                form.querySelector("button").disabled = false;
                zone.scrollTop = zone.scrollHeight;
            }
        });
    };

    /* ---- Montage : leçons + console uniquement ---- */

    const monter = () => {
        const surLecon = /\/JS\/lecon\d+/.test(location.pathname);
        const surConsole = !!document.querySelector("#console-js-page");
        if (!surLecon && !surConsole) return;
        if (document.querySelector(".tuteur")) return;
        construire();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", monter);
    } else {
        monter();
    }
})();
