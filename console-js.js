/* ============================================================
   Console JS — moteur partagé
   - Page dédiée : console.html (monté sur #console-js-page)
   - Widget « Essaie toi-même » : injecté automatiquement en bas
     des pages de chapitre des leçons (avant le <footer>)
   Aucune dépendance externe. Code sauvegardé en localStorage.
   ============================================================ */

(() => {
    "use strict";

    /* ---- Formatage des valeurs façon console ---- */

    const formater = (valeur) => {
        if (typeof valeur === "string") return valeur;
        if (valeur === null) return "null";
        if (valeur === undefined) return "undefined";
        if (valeur instanceof Error) return valeur.toString();
        if (typeof valeur === "function") {
            return "ƒ " + (valeur.name || "anonyme") + "()";
        }
        try {
            const json = JSON.stringify(valeur, null, 1);
            if (json !== undefined) return json.replace(/\n\s*/g, " ");
        } catch {
            /* références circulaires, etc. */
        }
        return String(valeur);
    };

    /* ---- Exécution du code avec console interceptée ---- */

    const executer = (code, pousser) => {
        const fauxConsole = { clear: () => {} };
        ["log", "info", "warn", "error", "debug"].forEach((niveau) => {
            fauxConsole[niveau] = (...args) => {
                const type = niveau === "debug" ? "log" : niveau;
                pousser(type, args.map(formater).join(" "));
            };
        });
        fauxConsole.table = (donnees) => pousser("log", formater(donnees));

        try {
            const fn = new Function(
                "console",
                '"use strict";\nreturn (async () => {\n' + code + "\n})();"
            );
            fn(fauxConsole).catch((err) => pousser("error", String(err)));
        } catch (err) {
            pousser("error", String(err));
        }
    };

    /* ---- Construction de l'interface ---- */

    const creerConsole = (conteneur, cleStockage) => {
        conteneur.innerHTML = `
            <div class="cjs-grille">
                <textarea class="cjs-editeur" spellcheck="false"
                          placeholder="// Écris ton code ici, ex :\nconst prenom = &quot;Jean-Michel&quot;;\nconsole.log(\`Bonjour \${prenom} !\`);"
                          aria-label="Éditeur de code JavaScript"></textarea>
                <div class="cjs-sortie" aria-live="polite">
                    <div class="cjs-vide">La sortie console s'affichera ici…</div>
                </div>
            </div>
            <div class="cjs-actions">
                <button type="button" class="cjs-run">▶ Exécuter</button>
                <button type="button" class="cjs-clear">Effacer</button>
                <span class="cjs-astuce">⌘ + Entrée pour exécuter</span>
            </div>`;

        const editeur = conteneur.querySelector(".cjs-editeur");
        const sortie = conteneur.querySelector(".cjs-sortie");

        editeur.value = localStorage.getItem(cleStockage) || "";
        editeur.addEventListener("input", () => {
            localStorage.setItem(cleStockage, editeur.value);
        });

        const pousser = (type, texte) => {
            const videEl = sortie.querySelector(".cjs-vide");
            if (videEl) videEl.remove();
            const ligne = document.createElement("div");
            ligne.className = "cjs-ligne cjs-ligne--" + type;
            ligne.textContent = texte;
            sortie.appendChild(ligne);
            sortie.scrollTop = sortie.scrollHeight;
        };

        const vider = () => {
            sortie.innerHTML =
                '<div class="cjs-vide">La sortie console s\'affichera ici…</div>';
        };

        const lancer = () => {
            vider();
            const code = editeur.value.trim();
            if (!code) return;
            executer(code, pousser);
        };

        conteneur.querySelector(".cjs-run").addEventListener("click", lancer);
        conteneur.querySelector(".cjs-clear").addEventListener("click", () => {
            vider();
            editeur.focus();
        });

        editeur.addEventListener("keydown", (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                lancer();
            }
            if (e.key === "Tab") {
                e.preventDefault();
                const debut = editeur.selectionStart;
                editeur.setRangeText("    ", debut, editeur.selectionEnd, "end");
            }
        });
    };

    /* ---- Montage : page dédiée ou widget de chapitre ---- */

    const monter = () => {
        const pageDediee = document.querySelector("#console-js-page");
        if (pageDediee) {
            creerConsole(pageDediee, "console-js:page");
            return;
        }

        // Widget uniquement sur les pages de chapitre des leçons
        const chemin = location.pathname;
        if (!/\/JS\/lecon[^/]+\/(?!index\.html$)[^/]+\.html$/.test(chemin)) return;
        const footer = document.querySelector("footer");
        if (!footer || document.querySelector(".cjs-widget")) return;

        const widget = document.createElement("details");
        widget.className = "cjs-widget";
        widget.innerHTML = `
            <summary>Essaie toi-même — console JS</summary>
            <div class="cjs-conteneur"></div>`;
        footer.parentNode.insertBefore(widget, footer);
        creerConsole(
            widget.querySelector(".cjs-conteneur"),
            "console-js:" + chemin
        );
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", monter);
    } else {
        monter();
    }
})();
