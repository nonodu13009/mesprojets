# Fiche de référence — Leçon 4 : Manipulation du DOM

> **Dossier** : `JS/lecon4-manipulation-dom/`

---

## Chapitres et fichiers

| # | Chapitre | Fichier |
|---|----------|---------|
| 1 | Introduction au DOM | `index.html` |
| 2 | Obtenir et manipuler des éléments | `obtenir-manipuler-elements.html` |
| 3 | Manipuler le CSS avec le DOM | `manipuler-css.html` |

---

## 1. Introduction au DOM

### Définition du DOM

- Quand le navigateur charge une page HTML, il la transforme en une **structure d'objets JavaScript** appelée le **DOM** (Document Object Model).
- Chaque balise HTML devient un **objet** (un **nœud**).
- Le HTML est le **plan de départ** ; le DOM est la **version vivante** de la page, en mémoire.
- On parle d'**arbre DOM** : chaque élément a un **parent** et éventuellement des **enfants**, exactement comme l'imbrication des balises HTML.

```
document
└── body
    ├── h1 → "Bienvenue"
    └── p  → "Bonjour à tous"
```

### L'objet `document`

Point d'entrée global représentant la page entière. Comme tout objet, il possède **propriétés** et **méthodes** (cf. leçon 3).

```js
console.log(document.title);          // titre de l'onglet
console.log(document.URL);            // adresse de la page
console.log(document.body);           // élément <body> complet
console.log(document.body.children);  // enfants directs du body
```

> **Astuce** : dans la console, taper `document` puis explorer l'objet en dépliant les flèches pour voir toute la structure.

### Première manipulation

Modifier un objet du DOM met à jour la page **instantanément** :

```js
document.title = "Mon nouveau titre";
document.body.style.backgroundColor = "lightyellow";
document.querySelector("h1").textContent = "Le DOM, c'est moi !";
```

> **Point clé** : recharger la page (F5) remet tout à zéro — on a modifié le DOM (mémoire), **pas** le fichier HTML.

### Navigation dans l'arbre (nœuds)

Chaque élément connaît sa position dans l'arbre :

```js
const titre = document.querySelector("h1");
titre.parentElement;                    // élément parent
titre.nextElementSibling;              // élément frère suivant
document.body.firstElementChild;       // premier enfant du body
```

> Rarement utilisé directement (les sélecteurs sont plus pratiques), mais illustre la logique : **parent → enfants → frères et sœurs**.

### Pourquoi c'est fondamental

- Tout ce qui bouge sur un site (menu, compteur, formulaire, panier) = JavaScript qui manipule le DOM.
- Les frameworks (React, Vue) ne font « que » manipuler le DOM de façon optimisée. Comprendre le DOM = comprendre le fonctionnement réel du web.

---

## 2. Obtenir et manipuler des éléments

Trois compétences dans l'ordre logique : **sélectionner → lire/modifier → créer/insérer**.

### 2.1 Sélectionner un élément : `querySelector`

Accepte **n'importe quel sélecteur CSS** :

```js
document.querySelector("h2");          // par balise (le PREMIER h2)
document.querySelector(".lesson-card"); // par classe (avec le point)
document.querySelector("#menu");       // par id (avec le dièse)
document.querySelector("footer a");    // sélecteurs combinés
```

> **Important** : renvoie le **premier** élément trouvé, ou **`null`** si aucun ne correspond. Toujours vérifier dans la console avant de manipuler.

### Sélectionner plusieurs éléments : `querySelectorAll`

Renvoie une **NodeList**, parcourable avec `forEach` :

```js
const paragraphes = document.querySelectorAll("p");
console.log(paragraphes.length);

paragraphes.forEach(p => {
  console.log(p.textContent);
});
```

> **Anciennes méthodes** : `getElementById("menu")`, `getElementsByClassName("carte")` existent dans du code existant mais `querySelector` / `querySelectorAll` les remplacent avantageusement — **une seule syntaxe pour tous les cas**.

### 2.2 Lire et modifier le contenu

Deux propriétés principales :

| Propriété | Rôle | Usage |
|-----------|------|-------|
| `textContent` | Texte brut | **Sûr et rapide** — choix par défaut |
| `innerHTML` | Contenu avec balises HTML | Permet d'injecter du HTML |

```js
const titre = document.querySelector("h1");
console.log(titre.textContent);
titre.textContent = "Nouveau titre";

const section = document.querySelector("section");
section.innerHTML = "<strong>Texte en gras</strong>";
```

> ⚠️ **Sécurité** : ne **jamais** utiliser `innerHTML` avec du contenu saisi par un utilisateur (formulaire, URL…) → risque d'injection de code (**attaque XSS**). Pour du texte, `textContent` est toujours le bon choix.

### Lire et modifier les attributs

Attributs HTML (`href`, `src`, `alt`…) accessibles directement ou via `getAttribute` / `setAttribute` :

```js
const lien = document.querySelector("a");

// Lecture
console.log(lien.href);
console.log(lien.getAttribute("href"));

// Modification
lien.href = "https://developer.mozilla.org";
lien.setAttribute("target", "_blank");
```

### 2.3 Créer et insérer des éléments

Processus en trois temps : **créer → remplir → insérer**.

```js
const nouveauParagraphe = document.createElement("p");
nouveauParagraphe.textContent = "Je suis né en JavaScript !";
document.body.appendChild(nouveauParagraphe); // à la fin du body
```

Méthodes d'insertion complémentaires :

| Méthode | Position |
|---------|----------|
| `appendChild(el)` | À la **fin** de l'élément parent |
| `prepend(el)` | Au **début** de l'élément parent |
| `before(el)` / `after(el)` | **Avant** / **après** un élément existant |

Suppression :

```js
nouveauParagraphe.remove();
```

### Exemple complet : générer une liste à partir de données

Combine array d'objets, fléchées, destructuration, ternaire, template literals, `forEach` (leçon 3) au service du DOM :

```js
const taches = [
  { titre: "Réviser la leçon 3", faite: true },
  { titre: "Tester le DOM",      faite: false },
  { titre: "Créer un mini-projet", faite: false }
];

const liste = document.createElement("ul");

taches.forEach(({ titre, faite }) => {
  const item = document.createElement("li");
  item.textContent = faite ? `✔ ${titre}` : titre;
  liste.appendChild(item);
});

document.body.appendChild(liste);
```

---

## 3. Manipuler le CSS avec le DOM

Deux approches pour styler en JavaScript : **`style`** et **`classList`**.

### 3.1 La propriété `style`

Reflète les **styles inline** (`style=""` du HTML). Modification propriété par propriété :

```js
const titre = document.querySelector("h1");
titre.style.color = "crimson";
titre.style.fontSize = "3rem";
titre.style.backgroundColor = "lightyellow";
titre.style.padding = "1rem";
```

**Règle de conversion** : propriétés CSS à tiret → **camelCase** en JS.

| CSS | JavaScript |
|-----|-----------|
| `font-size` | `fontSize` |
| `background-color` | `backgroundColor` |
| `border-radius` | `borderRadius` |

> Les valeurs sont toujours des **chaînes**, unité comprise : `"3rem"`, pas `3`.

#### Lire les styles réellement appliqués : `getComputedStyle`

`element.style` ne voit que l'inline. Pour les styles venant des feuilles CSS :

```js
const stylesReels = getComputedStyle(titre);
console.log(stylesReels.fontSize); // ex. "40px"
console.log(stylesReels.color);    // ex. "rgb(29, 29, 31)"
```

### 3.2 `classList` : la méthode propre

**Bonne pratique** : définir une classe CSS et la brancher/débrancher depuis JS. Sépare le design (CSS) de la logique (JS).

```js
titre.classList.add("surbrillance");       // ajoute la classe
titre.classList.remove("surbrillance");    // la retire
titre.classList.toggle("surbrillance");    // ajoute si absente, retire si présente
titre.classList.contains("surbrillance");  // true / false
```

> `toggle` est parfait pour tout ce qui **s'ouvre et se ferme** : menu burger, mode sombre, accordéon, modale…

### `style` ou `classList` : que choisir ?

| Situation | Outil |
|-----------|-------|
| État visuel prédéfini (actif, caché, erreur, mode sombre) | `classList` ✅ |
| Valeur calculée en JS (position, largeur d'une barre de progression) | `style` |
| Tout le reste | `classList` par défaut |

> **Résumé** : le CSS décrit les apparences possibles, le JS décide **laquelle** s'applique et **quand**. Chacun son métier.

### Exemple : barre de progression (combinaison des deux approches)

La classe CSS définit l'apparence générale ; le JS calcule la largeur (impossible à prévoir en CSS) :

```js
const barre = document.createElement("div");
barre.classList.add("barre-progression");   // apparence → classList

const pourcentage = (3 / 32) * 100;
barre.style.width = `${pourcentage}%`;      // valeur calculée → style

document.body.prepend(barre);
```

### Cacher / afficher un élément

Trois options :

```js
const encart = document.querySelector(".note");

// Option 1 : display none (disparaît, libère sa place)
encart.style.display = "none";
encart.style.display = "";      // retour au style de la feuille CSS

// Option 2 : attribut hidden (équivalent, plus sémantique)
encart.hidden = true;
encart.hidden = false;

// Option 3 : classe .cache { display: none; } + toggle
encart.classList.toggle("cache");
```

---

## Récapitulatif des méthodes et propriétés clés

| Catégorie | API | Rôle |
|-----------|-----|------|
| **Sélection** | `document.querySelector(css)` | Premier élément correspondant (ou `null`) |
| | `document.querySelectorAll(css)` | Tous les éléments → `NodeList` |
| **Contenu** | `el.textContent` | Texte brut (lecture/écriture, **sûr**) |
| | `el.innerHTML` | HTML (⚠️ jamais avec input utilisateur) |
| **Attributs** | `el.getAttribute(nom)` / `el.setAttribute(nom, val)` | Lecture/écriture d'attributs HTML |
| | `el.href`, `el.src`, etc. | Accès direct aux attributs courants |
| **Création** | `document.createElement(tag)` | Crée un nœud |
| **Insertion** | `parent.appendChild(el)` | Fin du parent |
| | `parent.prepend(el)` | Début du parent |
| | `el.before(autre)` / `el.after(autre)` | Avant/après un élément |
| **Suppression** | `el.remove()` | Retire l'élément du DOM |
| **Navigation** | `el.parentElement`, `el.nextElementSibling`, `el.firstElementChild` | Parcours de l'arbre |
| **Style inline** | `el.style.propriétéCamelCase` | Modifie un style inline |
| | `getComputedStyle(el)` | Lit les styles réellement appliqués |
| **Classes CSS** | `el.classList.add / remove / toggle / contains` | Gestion des classes |
| **Visibilité** | `el.hidden` | Masque/affiche (sémantique) |
| **Page** | `document.title`, `document.URL`, `document.body` | Propriétés globales |

---

## Pièges signalés

1. **`querySelector` renvoie `null`** si aucun élément ne correspond → vérifier avant de manipuler.
2. **`innerHTML` + contenu utilisateur = faille XSS** → utiliser `textContent` pour du texte.
3. **`element.style` ne lit que l'inline** → utiliser `getComputedStyle` pour les styles issus des feuilles CSS.
4. **Valeurs `style` = chaînes avec unité** : `"3rem"`, pas `3`.
5. **Tirets → camelCase** : `font-size` → `fontSize`.
6. **Modification du DOM ≠ modification du fichier HTML** : un rechargement (F5) annule tout.
