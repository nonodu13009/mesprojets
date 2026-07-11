/* ============================================
   RECHERCHE — index des pages du site
   Filtrage en direct, insensible aux accents.
   ============================================ */

const PAGES = [
    // --- JS Leçon 1 : Bases, variables & types ---
    { titre: "Leçon 1 — Bases, Variables & Types", contexte: "JavaScript · Leçon 1", url: "JS/lecon1-bases-variables-types/index.html", mots: "accueil sommaire debuter bases" },
    { titre: "Explications & premiers pas", contexte: "JavaScript · Leçon 1", url: "JS/lecon1-bases-variables-types/explications.html", mots: "console log script balise premiers pas introduction" },
    { titre: "Alert, prompt et interactions", contexte: "JavaScript · Leçon 1", url: "JS/lecon1-bases-variables-types/alert.html", mots: "alert prompt confirm popup interaction" },
    { titre: "Les types de données", contexte: "JavaScript · Leçon 1", url: "JS/lecon1-bases-variables-types/types.html", mots: "string number boolean typeof undefined null variables let const" },
    { titre: "Les chaînes de caractères", contexte: "JavaScript · Leçon 1", url: "JS/lecon1-bases-variables-types/chaines.html", mots: "string chaine concatenation length uppercase lowercase template literals backticks" },
    { titre: "Les comparaisons", contexte: "JavaScript · Leçon 1", url: "JS/lecon1-bases-variables-types/comparaisons.html", mots: "egalite stricte === == superieur inferieur booleen comparaison" },
    { titre: "Les raccourcis d'écriture", contexte: "JavaScript · Leçon 1", url: "JS/lecon1-bases-variables-types/raccourcis.html", mots: "increment decrement += -= ++ -- operateurs raccourcis" },

    // --- JS Leçon 2 : Boucles, conditions & fonctions ---
    { titre: "Leçon 2 — Boucles, Conditions & Fonctions", contexte: "JavaScript · Leçon 2", url: "JS/lecon2-boucles-conditions-fonctions/index.html", mots: "accueil sommaire" },
    { titre: "La boucle for", contexte: "JavaScript · Leçon 2", url: "JS/lecon2-boucles-conditions-fonctions/boucle-for.html", mots: "boucle for iteration compteur repetition loop" },
    { titre: "La boucle while", contexte: "JavaScript · Leçon 2", url: "JS/lecon2-boucles-conditions-fonctions/boucle-while.html", mots: "boucle while do while condition repetition loop" },
    { titre: "Les conditions if / else", contexte: "JavaScript · Leçon 2", url: "JS/lecon2-boucles-conditions-fonctions/conditions.html", mots: "if else condition test logique" },
    { titre: "Conditions multiples", contexte: "JavaScript · Leçon 2", url: "JS/lecon2-boucles-conditions-fonctions/conditions-multiples.html", mots: "else if et ou && || operateurs logiques conditions multiples" },
    { titre: "Le switch", contexte: "JavaScript · Leçon 2", url: "JS/lecon2-boucles-conditions-fonctions/switch.html", mots: "switch case break default aiguillage" },
    { titre: "Portée et break", contexte: "JavaScript · Leçon 2", url: "JS/lecon2-boucles-conditions-fonctions/portee-break.html", mots: "portee scope break continue bloc variable globale locale" },
    { titre: "Les fonctions", contexte: "JavaScript · Leçon 2", url: "JS/lecon2-boucles-conditions-fonctions/fonctions.html", mots: "function fonction parametres arguments return declaration" },

    // --- JS Leçon 3 : JavaScript moderne (ES6+) ---
    { titre: "Leçon 3 — JavaScript Moderne (ES6+)", contexte: "JavaScript · Leçon 3", url: "JS/lecon3-javascript-moderne-es6/index.html", mots: "accueil sommaire es6 moderne ecmascript" },
    { titre: "Les fonctions fléchées", contexte: "JavaScript · Leçon 3 · Ch. 24", url: "JS/lecon3-javascript-moderne-es6/fonctions-flechees.html", mots: "arrow function fleche => callback return implicite syntaxe courte" },
    { titre: "Les objets littéraux", contexte: "JavaScript · Leçon 3 · Ch. 25", url: "JS/lecon3-javascript-moderne-es6/objets-litteraux.html", mots: "objet object propriete cle valeur notation point crochets object keys values entries" },
    { titre: "Déstructuration", contexte: "JavaScript · Leçon 3 · Ch. 26", url: "JS/lecon3-javascript-moderne-es6/destructuration.html", mots: "destructuring destructuration extraire accolades renommer valeur par defaut" },
    { titre: "Les méthodes des objets", contexte: "JavaScript · Leçon 3 · Ch. 27", url: "JS/lecon3-javascript-moderne-es6/methodes-objets.html", mots: "methode this comportement objet panier oriente objet" },
    { titre: "Les arrays d'objets", contexte: "JavaScript · Leçon 3 · Ch. 28", url: "JS/lecon3-javascript-moderne-es6/arrays-objets.html", mots: "tableau array map filter find reduce foreach liste chainage" },
    { titre: "Les meilleures méthodes pour mieux coder", contexte: "JavaScript · Leçon 3 · Ch. 29", url: "JS/lecon3-javascript-moderne-es6/meilleures-methodes.html", mots: "bonnes pratiques clean code dry early return const nommage qualite checklist" },

    // --- JS Leçon 4 : Manipulation du DOM ---
    { titre: "Leçon 4 — Manipulation du DOM", contexte: "JavaScript · Leçon 4", url: "JS/lecon4-manipulation-dom/index.html", mots: "accueil sommaire dom document" },
    { titre: "Introduction au DOM", contexte: "JavaScript · Leçon 4 · Ch. 30", url: "JS/lecon4-manipulation-dom/introduction-dom.html", mots: "dom document object model arbre noeud body title page dynamique" },
    { titre: "Obtenir et manipuler des éléments", contexte: "JavaScript · Leçon 4 · Ch. 31", url: "JS/lecon4-manipulation-dom/obtenir-manipuler-elements.html", mots: "queryselector queryselectorall getelementbyid textcontent innerhtml createelement appendchild remove attributs selectionner" },
    { titre: "Manipuler le CSS avec le DOM", contexte: "JavaScript · Leçon 4 · Ch. 32", url: "JS/lecon4-manipulation-dom/manipuler-css.html", mots: "style classlist add remove toggle getcomputedstyle hidden cacher afficher css dynamique" },

    // --- JS Leçon 5 : Le JavaScript asynchrone ---
    { titre: "Leçon 5 — Le JavaScript Asynchrone", contexte: "JavaScript · Leçon 5", url: "JS/lecon5-javascript-asynchrone/index.html", mots: "accueil sommaire asynchrone" },
    { titre: "Les fonctions de rappel (callbacks)", contexte: "JavaScript · Leçon 5 · Ch. 33", url: "JS/lecon5-javascript-asynchrone/callbacks.html", mots: "callback rappel settimeout addeventlistener callback hell pyramide asynchrone" },
    { titre: "Les promesses (Promises)", contexte: "JavaScript · Leçon 5 · Ch. 34", url: "JS/lecon5-javascript-asynchrone/promesses.html", mots: "promise promesse then catch finally fetch resolve reject pending promise all chainage" },
    { titre: "Async / Await", contexte: "JavaScript · Leçon 5 · Ch. 35", url: "JS/lecon5-javascript-asynchrone/async-await.html", mots: "async await try catch fetch erreur reponse ok parallele" },

    // --- JS Leçon 6 : Projets pratiques & API Web ---
    { titre: "Leçon 6 — Projets Pratiques et API Web", contexte: "JavaScript · Leçon 6", url: "JS/lecon6-projets-pratiques-api/index.html", mots: "accueil sommaire projets api web portfolio" },
    { titre: "Application météo — Partie 1", contexte: "JavaScript · Leçon 6 · Projet 36", url: "JS/lecon6-projets-pratiques-api/meteo-partie1.html", mots: "meteo weather api openweathermap fetch cle api temperature ville projet" },
    { titre: "Application météo — Partie 2", contexte: "JavaScript · Leçon 6 · Projet 37", url: "JS/lecon6-projets-pratiques-api/meteo-partie2.html", mots: "meteo interface icone humidite vent chargement spinner localstorage geolocalisation projet" },
    { titre: "Générateur de mots de passe", contexte: "JavaScript · Leçon 6 · Projet 38", url: "JS/lecon6-projets-pratiques-api/generateur-mots-de-passe.html", mots: "mot de passe password generateur aleatoire math random clipboard copier presse-papiers projet" },
    { titre: "Calculatrice moderne", contexte: "JavaScript · Leçon 6 · Projet 39", url: "JS/lecon6-projets-pratiques-api/calculatrice.html", mots: "calculatrice calculator grid etat state delegation evenements operations projet" },
    { titre: "Générateur de QR Code", contexte: "JavaScript · Leçon 6 · Projet 40", url: "JS/lecon6-projets-pratiques-api/generateur-qr-code.html", mots: "qr code qrcode generateur image encodeuricomponent blob telecharger projet" },
    { titre: "Convertisseur texte-en-audio", contexte: "JavaScript · Leçon 6 · Projet 41", url: "JS/lecon6-projets-pratiques-api/texte-en-audio.html", mots: "texte audio voix speech synthesis parler lecture vocale text to speech projet" },
    { titre: "Formulaire de connexion / inscription animé", contexte: "JavaScript · Leçon 6 · Projet 42", url: "JS/lecon6-projets-pratiques-api/formulaire-connexion.html", mots: "formulaire form login inscription validation email mot de passe submit preventdefault projet" },

    // --- Méthode & Projet ---
    { titre: "Méthode & Projet — Le pipeline en 7 étapes", contexte: "Méthode & Projet", url: "methode-projet/index.html", mots: "methode pipeline projet vue ensemble guide" },
    { titre: "Étape 1 — De l'idée au brief", contexte: "Méthode & Projet · Étape 1", url: "methode-projet/idee-brief.html", mots: "idee brief probleme solution personas moscow cadrage" },
    { titre: "Étape 2 — Recherche & cadrage", contexte: "Méthode & Projet · Étape 2", url: "methode-projet/recherche-cadrage.html", mots: "recherche cadrage concurrence benchmark specifications" },
    { titre: "Étape 3 — Design & maquettes", contexte: "Méthode & Projet · Étape 3", url: "methode-projet/design.html", mots: "design maquette ui ux claude design wireframe" },
    { titre: "Étape 4 — Développement", contexte: "Méthode & Projet · Étape 4", url: "methode-projet/developpement.html", mots: "developpement code claude code vibe coding" },
    { titre: "Étape 5 — Tests & QA", contexte: "Méthode & Projet · Étape 5", url: "methode-projet/tests.html", mots: "tests qa qualite bugs verification" },
    { titre: "Étape 6 — Déploiement", contexte: "Méthode & Projet · Étape 6", url: "methode-projet/deploiement.html", mots: "deploiement vercel production mise en ligne hosting" },
    { titre: "Étape 7 — Maintenance & évolution", contexte: "Méthode & Projet · Étape 7", url: "methode-projet/maintenance.html", mots: "maintenance evolution suivi ameliorations apres" },
    { titre: "Générateur de Brief", contexte: "Méthode & Projet · Outil", url: "methode-projet/generateur-brief.html", mots: "generateur brief formulaire pdf export personas moscow outil" },
    { titre: "Console JS", contexte: "Outil · Exercices", url: "console.html", mots: "console js code executer tester exercices bac a sable playground editeur" }
];

// Racine du site, déduite de l'emplacement de ce script :
// les URLs de PAGES fonctionnent ainsi depuis n'importe quelle page.
const RACINE = new URL(".", document.currentScript.src);

// Supprime les accents et met en minuscules pour comparer sans surprise
const normaliser = (texte) =>
    texte.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const rechercherPages = (requete) => {
    const termes = normaliser(requete).split(/\s+/).filter(t => t.length > 0);
    if (termes.length === 0) return [];

    return PAGES.filter(page => {
        const contenu = normaliser(`${page.titre} ${page.contexte} ${page.mots}`);
        return termes.every(terme => contenu.includes(terme));
    });
};

// Sur les pages sans barre de recherche (leçons, méthode),
// on l'injecte automatiquement à droite de la nav.
const injecterBarre = () => {
    if (document.querySelector("#recherche-champ")) return;
    const nav = document.querySelector("nav");
    if (!nav) return;

    const conteneur = document.createElement("div");
    conteneur.className = "recherche recherche--nav";
    conteneur.innerHTML = `
        <div class="recherche-barre">
            <svg class="recherche-loupe" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="6.5" stroke="currentColor" stroke-width="1.8"/>
                <line x1="14" y1="14" x2="18" y2="18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <input type="search" id="recherche-champ" placeholder="Rechercher…"
                   autocomplete="off" aria-label="Rechercher dans les formations">
        </div>
        <div id="recherche-resultats" class="recherche-panneau" hidden></div>`;
    // Ligne "cours" (leçons) si la nav a deux niveaux, sinon la nav elle-même
    (nav.querySelector(".nav-lecons") || nav).appendChild(conteneur);
};

const initRecherche = () => {
    const champ = document.querySelector("#recherche-champ");
    const panneau = document.querySelector("#recherche-resultats");
    if (!champ || !panneau) return;

    const afficherResultats = () => {
        const requete = champ.value.trim();
        panneau.replaceChildren();

        if (requete.length < 2) {
            panneau.hidden = true;
            return;
        }

        const resultats = rechercherPages(requete).slice(0, 8);
        panneau.hidden = false;

        if (resultats.length === 0) {
            const vide = document.createElement("p");
            vide.className = "recherche-vide";
            vide.textContent = `Aucun résultat pour « ${requete} »`;
            panneau.appendChild(vide);
            return;
        }

        resultats.forEach(({ titre, contexte, url }) => {
            const lien = document.createElement("a");
            lien.className = "recherche-resultat";
            lien.href = new URL(url, RACINE).href;

            const spanTitre = document.createElement("span");
            spanTitre.className = "recherche-titre";
            spanTitre.textContent = titre;

            const spanContexte = document.createElement("span");
            spanContexte.className = "recherche-contexte";
            spanContexte.textContent = contexte;

            lien.append(spanTitre, spanContexte);
            panneau.appendChild(lien);
        });
    };

    champ.addEventListener("input", afficherResultats);

    champ.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            champ.value = "";
            panneau.hidden = true;
        }
        // Entrée : ouvre le premier résultat
        if (event.key === "Enter") {
            const premier = panneau.querySelector(".recherche-resultat");
            if (premier) premier.click();
        }
    });

    // Ferme le panneau si on clique ailleurs
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".recherche")) {
            panneau.hidden = true;
        }
    });

    // Rouvre les résultats quand on revient dans le champ
    champ.addEventListener("focus", afficherResultats);
};

injecterBarre();
initRecherche();
