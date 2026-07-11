# Fiche de référence — Leçon 6 : Projets Pratiques et API Web

**Dossier :** `JS/lecon6-projets-pratiques-api/`

---

## Chapitres et fichiers

| # | Projet | Fichier HTML |
|---|--------|-------------|
| 1 | Application Météo — Partie 1 | `lecon6-projets-pratiques-api` |
| 2 | Application Météo — Partie 2 | `lecon6-projets-pratiques-api` |
| 3 | Générateur de Mots de Passe | `lecon6-projets-pratiques-api` |
| 4 | Calculatrice Moderne | `lecon6-projets-pratiques-api` |
| 5 | Générateur de QR Code | `lecon6-projets-pratiques-api` |
| 6 | Convertisseur Texte-en-Audio | `lecon6-projets-pratiques-api` |
| 7 | Formulaire de Connexion et Inscription Animé | `lecon6-projets-pratiques-api` |

---

## 1. Application Météo — Partie 1

### Brief
Application affichant la météo actuelle d'une ville saisie : température, description, humidité, vent. Partie 1 = fondations : structure HTML, appel API, affichage des données brutes. **Projet-type du développeur web : formulaire → appel API → affichage dynamique (80 % des applications web).**

### Compétences mobilisées
- `fetch` + `async/await` + `try/catch` (leçon 5)
- Lecture d'un objet JSON complexe renvoyé par une API (leçon 3)
- `querySelector`, `textContent`, `addEventListener` (leçon 4)
- Template literals pour composer URL et textes

### L'API météo (type OpenWeatherMap)
- Compte gratuit → clé API
- URL type : `https://api.openweathermap.org/data/2.5/weather?q=Marseille&appid=TA_CLE&units=metric&lang=fr`
- Tester l'URL dans le navigateur pour voir le JSON brut
- Données utiles : `main.temp`, `weather[0].description`, `main.humidity`, `wind.speed`
- **Sécurité :** une clé API en JS front est visible par tous. Acceptable pour apprentissage avec clé gratuite, jamais avec clé payante/sensible.

### Plan de construction
1. **HTML :** `<input>` ville, `<button>` Rechercher, `<div id="resultat">` vide
2. **Événement :** au clic → récupérer la valeur de l'input → `console.log` d'abord
3. **Fonction `obtenirMeteo(ville)` :** `async`, compose l'URL, `fetch`, teste `reponse.ok`, renvoie le JSON
4. **Console :** explorer l'objet reçu, repérer température et description
5. **Affichage dans la page :** injecter ville, température arrondie, description dans `#resultat`
6. **Erreurs :** ville inexistante → message clair, pas écran vide

### Pièges classiques
- **Température en Kelvin** sans `units=metric` dans l'URL
- **`weather` est un tableau :** `donnees.weather[0].description`, pas `donnees.weather.description`
- **404 silencieux :** `fetch` ne lève pas d'erreur pour ville inconnue → vérifier `if (!reponse.ok)`
- **Input vide :** vérifier avant d'appeler l'API

### Checklist fin de Partie 1
- Saisir "Marseille" → température s'affiche
- Saisir "Zzzville" → message d'erreur clair
- Saisir rien → l'application ne plante pas
- Code utilise `async/await` avec `try/catch`

---

## 2. Application Météo — Partie 2

### Brief
Transformer le prototype en application aboutie : carte météo design, icône, détails complets (ressenti, humidité, vent), état de chargement. **Plus gros chapitre du cours (1 h 38).**

### Compétences mobilisées
- Générer du HTML depuis des données : `createElement` ou template literals (leçon 4)
- `classList` pour états visuels : chargement, erreur, succès (leçon 4)
- **Destructuration d'objets imbriqués** pour extraire les données API (leçon 3)
- CSS : carte centrée, ombres douces, transitions

### Fonctionnalités attendues
- Carte météo : ville + pays, grande température, description
- **Icône météo** (l'API fournit un code icône : `https://openweathermap.org/img/wn/CODE@2x.png`)
- Trois détails : ressenti (`feels_like`), humidité, vitesse du vent
- Indicateur de chargement pendant l'appel API
- Message d'erreur stylé (ville inconnue, réseau coupé)
- **Recherche au clavier :** touche Entrée déclenche la recherche

### Plan de construction
1. **Maquette statique d'abord :** carte en HTML/CSS avec données en dur, peaufiner le design sans JS
2. **Fonction `afficherMeteo(donnees)` :** remplacer les données en dur par celles de l'objet API ; destructurer dès l'entrée de la fonction
3. **Icône :** récupérer `weather[0].icon`, composer l'URL dans un `<img>`
4. **États d'interface :** trois classes CSS (`.chargement`, `.erreur`, `.succes`) + fonction qui bascule avec `classList`
5. **Touche Entrée :** `keydown` sur l'input, tester `event.key === "Enter"`
6. **Finitions :** vider l'input après recherche, `Math.round` pour les températures, première lettre description en majuscule

### Pièges classiques
- **Afficher avant d'avoir reçu :** tout affichage après le `await`, jamais avant
- **Résultats qui s'empilent :** vider la zone (`innerHTML = ""` ou `replaceChildren()`) avant chaque recherche
- **`innerHTML` + saisie utilisateur :** le nom de ville vient de l'utilisateur → préférer `textContent` (réflexe anti-XSS)
- **Spinner fantôme :** masquer le chargement aussi en cas d'erreur → rôle de `finally`

### Pour aller plus loin
- Dernière ville dans `localStorage`, rechargée à l'ouverture
- Fond de carte selon la météo (bleu = pluie, jaune = soleil…)
- Géolocalisation avec `navigator.geolocation`
- Prévisions sur 5 jours (endpoint `/forecast`)

---

## 3. Générateur de Mots de Passe

### Brief
Outil générant des mots de passe aléatoires robustes : choix de longueur et types de caractères (majuscules, minuscules, chiffres, symboles), copie en un clic. **Projet de logique pure, pas d'API.**

### Compétences mobilisées
- `Math.random()` et accès aux caractères d'une chaîne par index
- Checkboxes : lire l'état `checked` d'un input (leçon 4)
- Composer une **fonction pure** : options en entrée → mot de passe en sortie
- **API presse-papiers :** `navigator.clipboard.writeText()` (asynchrone, leçon 5)

### Plan de construction
1. **HTML :** formulaire d'options + zone résultat + deux boutons (Générer / Copier)
2. **Alphabets :** quatre constantes — `const MINUSCULES = "abcdefghijklmnopqrstuvwxyz"`, idem pour majuscules, chiffres, symboles
3. **Caractère aléatoire :**
   ```js
   const caractereAleatoire = chaine => chaine[Math.floor(Math.random() * chaine.length)];
   ```
4. **Alphabet actif :** selon les cases cochées, concaténer les alphabets dans une seule chaîne
5. **Boucle de génération :** `for` de la longueur choisie, ajout d'un caractère aléatoire à chaque tour
6. **Affichage + copie :** injecter le résultat, brancher `navigator.clipboard.writeText(motDePasse)` sur le bouton copier (avec `await`)

### Pièges classiques
- **Valeur d'input = chaîne :** la longueur lue vaut `"12"`, pas `12` → convertir avec `Number()`
- **Aucune case cochée :** alphabet vide → boucle produit `undefined`. Valider avant de générer
- **`clipboard` est asynchrone :** c'est une promesse → `await` et `try/catch`
- **Feedback copie :** remettre le texte du bouton à l'état initial après 2 secondes (`setTimeout`)

### Pour aller plus loin
- Indicateur de force (faible / moyen / fort) selon longueur et variété
- Garantir au moins un caractère de chaque type coché
- Historique des 5 derniers mots de passe générés
- **Vrai usage sécurité :** remplacer `Math.random()` par `crypto.getRandomValues()` (aléatoire cryptographique du navigateur)

---

## 4. Calculatrice Moderne

### Brief
Calculatrice complète façon iOS/Android : écran d'affichage, grille de touches (chiffres, opérateurs, égal, effacer), quatre opérations. **Le défi est logique, pas visuel : gérer l'état de la calculatrice sans s'emmêler.**

### Compétences mobilisées
- **Gestion d'état :** un objet qui mémorise où en est le calcul (leçon 3)
- **Délégation d'événements :** UN écouteur sur la grille plutôt que 20 sur les touches
- CSS Grid pour la grille de touches
- `switch` pour dispatcher les opérateurs (leçon 2)

### Le cœur du projet : l'objet d'état
La calculatrice doit se souvenir de trois choses :
```js
const etat = {
  premierNombre: null,      // le nombre avant l'opérateur
  operateur: null,           // "+", "-", "×", "÷"
  saisieCourante: "0"        // ce qui s'affiche (une CHAÎNE)
};
```
**Discipline :** chaque touche ne fait qu'une chose — mettre à jour cet état, puis rafraîchir l'écran.

### Plan de construction
1. **HTML/CSS :** écran + grille en CSS Grid (`grid-template-columns: repeat(4, 1fr)`)
2. **Délégation :** un seul `addEventListener("click")` sur la grille ; identifier la touche avec `event.target` et attribut `data-touche`
3. **Saisie chiffres :** concaténer à `saisieCourante` (chaîne : `"1" + "2" = "12"` — voulu !) et rafraîchir l'écran
4. **Touche opérateur :** stocker `saisieCourante` dans `premierNombre`, mémoriser l'opérateur, réinitialiser la saisie
5. **Touche égal :** convertir avec `Number()`, calculer selon l'opérateur (un `switch`), afficher le résultat
6. **Touche C :** remettre l'état à ses valeurs initiales
7. **Cas limites :** double virgule interdite, division par zéro, appui sur `=` sans opérateur

### Pièges classiques
- **Piège n°1 :** oublier `Number()` → `"2" + "3" = "23"`. **Chaîne pour l'affichage, nombre pour le calcul**
- **Flottants :** `0.1 + 0.2 = 0.30000000000000004` → arrondir avec `parseFloat(resultat.toFixed(10))`
- **Ne JAMAIS utiliser `eval()`** pour calculer : faille de sécurité majeure. Le `switch` fait le travail proprement
- **Enchaîner après `=` :** décider quoi faire si l'utilisateur tape un chiffre juste après un résultat

### Pour aller plus loin
- Support du clavier physique (événement `keydown`)
- Touche `±` (inverser le signe) et `%`
- Historique des calculs affiché au-dessus de l'écran
- Calculs en chaîne : `2 + 3 + 4` sans appuyer sur `=` entre chaque

---

## 5. Générateur de QR Code

### Brief
Outil transformant texte ou URL en QR Code, téléchargeable en image. **Projet court mais très gratifiant.** Occasion de découvrir les API qui renvoient des images plutôt que du JSON.

### Compétences mobilisées
- **API par URL :** composer une URL de génération avec des paramètres
- `encodeURIComponent()` : encoder proprement la saisie utilisateur dans une URL
- Manipuler des `<img>` dynamiquement : `src`, événement `load` (leçon 4)
- **États d'interface :** vide → chargement → affiché (classes CSS)

### L'API QR Code
```js
const texte = encodeURIComponent(saisie);
const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${texte}`;
image.src = url; // Pas de fetch : le navigateur charge l'image via le src
```
**Point clé :** pas de `fetch` ici — c'est l'événement `load` de l'image qui signale que c'est prêt.

### Plan de construction
1. **HTML/CSS :** carte centrée avec input, select de taille, bouton et zone d'image (cachée au départ)
2. **Génération :** au clic, valider la saisie, composer l'URL avec `encodeURIComponent`, affecter au `src`
3. **État de chargement :** afficher "Génération…", masquer dans `image.addEventListener("load", ...)`
4. **Animation :** classe CSS `.visible` avec transition d'opacité, ajoutée au `load`
5. **Téléchargement :** `fetch` l'URL de l'image → convertir en blob (`await reponse.blob()`) → créer un lien avec `URL.createObjectURL(blob)` et attribut `download` → déclencher son `click()`

### Pièges classiques
- **Caractères spéciaux :** sans `encodeURIComponent`, un texte avec `&`, `?` ou espaces casse l'URL
- **Ancien QR affiché :** pendant le chargement du nouveau, l'ancien reste visible → le masquer d'abord
- **Téléchargement direct par lien simple ne marche pas :** l'attribut `download` est ignoré pour images d'un autre domaine → passage par blob obligatoire
- **Événement `load` jamais déclenché si URL invalide :** écouter aussi `error` sur l'image

### Pour aller plus loin
- Génération en direct pendant la frappe (avec délai — « debounce »)
- Choix des couleurs du QR Code (paramètres `color` et `bgcolor` de l'API)
- Historique des derniers QR Codes dans `localStorage`
- Bouton "Copier l'image" dans le presse-papiers

---

## 6. Convertisseur Texte-en-Audio

### Brief
Application qui lit à voix haute un texte saisi : choix de voix, réglage vitesse et ton, boutons lecture/pause/stop. **Sans aucun serveur : le navigateur embarque nativement un moteur de synthèse vocale (Web Speech API).**

### Compétences mobilisées
- Découvrir une **API navigateur** par sa documentation (MDN) — compétence clé de développeur
- Objets et propriétés : configurer un `SpeechSynthesisUtterance` (leçon 3)
- Remplir un `<select>` dynamiquement à partir d'un tableau d'objets (leçons 3 et 4)
- Inputs `range` (sliders) et leur événement `input`

### L'API Web Speech
```js
const enonce = new SpeechSynthesisUtterance("Bonjour Jean-Michel !");
enonce.lang = "fr-FR";
enonce.rate = 1;   // vitesse (0.1 à 10)
enonce.pitch = 1;  // ton (0 à 2)

speechSynthesis.speak(enonce);         // le moteur global du navigateur
console.log(speechSynthesis.getVoices()); // array d'objets voix
```

### Plan de construction
1. **Console d'abord :** jouer avec `speechSynthesis` → `speak`, `pause`, `resume`, `cancel`
2. **HTML/CSS :** `<textarea>`, `<select>`, deux sliders, barre de boutons
3. **Charger les voix :** `getVoices()` renvoie un array d'objets → `forEach` pour créer les `<option>` du select
4. **Lecture :** au clic sur Lire, créer l'énoncé, appliquer voix/vitesse/ton depuis les contrôles, lancer `speak`
5. **Contrôles :** brancher `pause()`, `resume()` et `cancel()` sur les autres boutons
6. **État visuel :** événements `start` et `end` de l'énoncé → activer/désactiver l'indicateur de lecture

### Pièges classiques
- **Liste de voix vide :** `getVoices()` se charge de façon **asynchrone**. Écouter `speechSynthesis.onvoiceschanged` pour remplir le select au bon moment
- **Lectures qui s'empilent :** appeler `speechSynthesis.cancel()` **avant** chaque nouveau `speak`
- **Slider = chaîne :** comme toujours, `Number()` avant d'affecter à `rate` ou `pitch`
- **Voix selon l'OS :** chaque machine a des voix différentes → le select doit s'adapter, ne pas coder les noms en dur

### Pour aller plus loin
- Surligner le mot en cours de lecture (événement `boundary` de l'énoncé)
- Mémoriser les réglages préférés dans `localStorage`
- Compteur de caractères sous le textarea
- Explorer l'autre moitié de la Web Speech API : la reconnaissance vocale (`SpeechRecognition`)

---

## 7. Formulaire de Connexion et Inscription Animé

### Brief
Double formulaire connexion / inscription avec bascule animée, validation en temps réel et messages d'erreur élégants. **Pas de serveur : tout côté interface.** Composant le plus universel du web.

### Compétences mobilisées
- Événements de formulaire : `submit`, `input`, `blur` (leçon 4)
- Validation : expressions conditionnelles, longueur, format email (leçon 2)
- `classList.toggle` pour la bascule animée entre panneaux (leçon 4)
- Transitions et animations CSS déclenchées par JavaScript

### Fonctionnalités attendues
- Deux formulaires : connexion (email, mot de passe) et inscription (nom, email, mot de passe, confirmation)
- Bascule animée (glissement ou fondu) via lien "Pas encore de compte ?"
- Validation en temps réel : bordure rouge + message sous le champ invalide, vert quand OK
- Règles : email au bon format, mot de passe ≥ 8 caractères, confirmation identique
- Bouton "voir le mot de passe" (œil qui bascule le `type` de l'input)
- Soumission bloquée tant que tout n'est pas valide

### Le cœur : la validation
**Réflexe pro :** une fonction de validation par règle, avec **early return** (leçon 3, chapitre 29) :
```js
const validerEmail = (valeur) => {
  if (valeur.trim() === "") return "L'email est requis";
  if (!valeur.includes("@") || !valeur.includes(".")) return "Format d'email invalide";
  return null; // null = tout va bien
};

const validerMotDePasse = (valeur) => {
  if (valeur.length < 8) return "8 caractères minimum";
  return null;
};
```

### Plan de construction
1. **HTML :** deux `<form>` dans un conteneur, chaque champ accompagné d'un `<small>` vide pour le message d'erreur
2. **CSS :** carte, états `.champ-erreur` / `.champ-valide` (bordures), animation de bascule
3. **Bascule :** liens "Créer un compte" / "Déjà inscrit ?" font un `classList.toggle` sur le conteneur — le CSS fait le reste
