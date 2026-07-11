# Fiche de référence — Leçon 3 : JavaScript Moderne (ES6+)

**Dossier :** `JS/lecon3-javascript-moderne-es6/`

---

## Chapitres et fichiers

| # | Chapitre | Fichier HTML |
|---|----------|-------------|
| 1 | Les Fonctions Fléchées | `lecon3-fonctions-flechees.html` |
| 2 | Les Objets Littéraux | `lecon3-objets-litteraux.html` |
| 3 | Déstructuration | `lecon3-destructuration.html` |
| 4 | Les Méthodes des Objets | `lecon3-methodes-objets.html` |
| 5 | Les Arrays d'Objets | `lecon3-arrays-objets.html` |
| 6 | Les Meilleures Méthodes pour Mieux Coder | `lecon3-meilleures-methodes.html` |

---

## 1. Les Fonctions Fléchées (Arrow Functions)

### Concept
Syntaxe ES6 plus courte que `function`, omniprésente dans le code moderne. Pas de fonctionnalité nouvelle, juste plus concis et lisible.

### Transformation étape par étape

```js
// Classique
function doubler(nombre) { return nombre * 2; }

// Expression de fonction
const doubler = function(nombre) { return nombre * 2; };

// Fléchée longue
const doubler = (nombre) => { return nombre * 2; };

// Fléchée courte (une expression → return implicite, pas d'accolades)
const doubler = (nombre) => nombre * 2;

// Un seul paramètre → parenthèses optionnelles
const doubler = nombre => nombre * 2;
```

### Règles de syntaxe — Paramètres

```js
const direBonjour = () => "Bonjour !";       // 0 param : () obligatoires
const carre = x => x * x;                    // 1 param : () optionnelles
const additionner = (a, b) => a + b;         // 2+ params : () obligatoires
```

### Règles de syntaxe — Corps

```js
const tripler = x => x * 3;                  // 1 expression : return implicite
const calculerTTC = (prixHT) => {             // Plusieurs instructions :
  const tva = prixHT * 0.2;                  //   accolades + return explicite
  return prixHT + tva;
};
```

### ⚠️ Piège : accolades sans `return`
Si on met des accolades, le `return` redevient **obligatoire**. Sans lui, la fonction renvoie `undefined`.

### ⚠️ Piège : renvoyer un objet littéral
JavaScript confond les `{}` de l'objet avec celles du corps de fonction. **Solution : parenthèses autour de l'objet.**

```js
// ❌ JS croit que { } est le corps de la fonction
const creerUtilisateur = nom => { nom: nom };

// ✅ Parenthèses autour de l'objet
const creerUtilisateur = nom => ({ nom: nom });
```

### Vrai atout : les callbacks

```js
const doubles = nombres.map(function(n) { return n * 2; }); // verbeux
const doubles2 = nombres.map(n => n * 2);                   // une ligne
```

### ⚠️ Piège : `this`
Une fléchée **n'a pas son propre `this`**, elle hérite du contexte englobant. On évite les fléchées comme méthodes d'objet (voir chapitre 4).

### Meilleures pratiques
- Privilégier la fléchée pour les **callbacks** et petites fonctions utilitaires.
- Version courte = une seule expression. Dès que la logique dépasse une ligne → accolades + `return` explicite.
- Rester cohérent dans un même projet.

---

## 2. Les Objets Littéraux

### Concept
Collection de paires **clé / valeur** entre accolades `{}`. Structure de données centrale de JavaScript (utilisateur, produit, réponse API…).

```js
const utilisateur = {
  nom: "Nogaro",
  prenom: "Jean-Michel",
  age: 30,
  estActif: true
};
```

Chaque ligne est une **propriété** : clé, deux-points, valeur. Les valeurs peuvent être de n'importe quel type (chaîne, nombre, booléen, tableau, fonction, objet…).

### Lire une propriété

```js
utilisateur.nom;          // Notation par point (la plus courante)
utilisateur["nom"];       // Notation par crochets (clé = chaîne)

const cle = "prenom";
utilisateur[cle];         // Crochets indispensables quand la clé est dans une variable
```

**Règle :** point par défaut ; crochets si la clé est dans une variable ou contient des caractères spéciaux.

### Modifier, ajouter, supprimer
`const` empêche la réassignation de la référence, **pas la modification du contenu**.

```js
utilisateur.age = 31;              // modifier
utilisateur.ville = "Marseille";   // ajouter
delete utilisateur.estActif;       // supprimer
```

### Objets imbriqués

```js
const agence = {
  nom: "Nogaro & Boetti",
  adresse: { ville: "Marseille", codePostal: "13008" },
  activites: ["auto", "habitation", "santé"]
};
agence.adresse.ville;    // "Marseille"
agence.activites[0];     // "auto"
```

### Raccourcis ES6

**Propriétés raccourcies** — quand variable et clé ont le même nom :

```js
const nom = "Nogaro";
const age = 30;
const personne = { nom, age };  // équivaut à { nom: nom, age: age }
```

**Clés calculées** — expression entre crochets comme nom de clé :

```js
const champ = "email";
const formulaire = { [champ]: "jm@exemple.fr" };
formulaire.email; // "jm@exemple.fr"
```

### Parcourir un objet

```js
Object.keys(scores);     // ["maths", "anglais", "sport"]
Object.values(scores);   // [15, 12, 18]
Object.entries(scores);  // [["maths", 15], ["anglais", 12], …]

for (const [matiere, note] of Object.entries(scores)) {
  console.log(`${matiere} : ${note}/20`);
}
```

---

## 3. Déstructuration

### Concept
Extraire des propriétés d'un objet (ou éléments d'un tableau) directement dans des variables, en une seule ligne.

### Déstructuration d'objet (`{}` à gauche de `=`)

```js
const utilisateur = { nom: "Nogaro", prenom: "Jean-Michel", age: 30 };

// Sans : trois lignes répétitives
const nom = utilisateur.nom;
const prenom = utilisateur.prenom;

// Avec : une seule ligne
const { nom, prenom, age } = utilisateur;
```

### ⚠️ Règle importante
Les noms des variables doivent correspondre **exactement** aux noms des propriétés. `{ name }` au lieu de `{ nom }` → `undefined`.

### Renommer et valeurs par défaut

```js
const { nom: nomFamille } = utilisateur;      // renommage : propriété: nouveauNom
console.log(nomFamille); // "Nogaro"

const { ville = "Marseille" } = utilisateur;  // valeur par défaut si absent
console.log(ville); // "Marseille"
```

### Déstructuration de tableau (`[]` à gauche de `=`)
C'est **l'ordre** qui compte (pas les noms).

```js
const couleurs = ["rouge", "vert", "bleu"];
const [première, deuxième, troisième] = couleurs;

// Ignorer des éléments avec des virgules vides
const [, , dernière] = couleurs; // "bleu"
```

Syntaxe très fréquente avec React : `const [count, setCount] = useState(0)`.

### Application puissante : dans les paramètres de fonction

```js
// Avant
const afficher = (utilisateur) => {
  console.log(utilisateur.prenom + " " + utilisateur.nom);
};

// Après : destructuration dans les paramètres
const afficher2 = ({ prenom, nom }) => {
  console.log(`${prenom} ${nom}`);
};
```

**Avantage :** la signature `({ prenom, nom })` documente quelles propriétés la fonction utilise, sans lire le corps.

---

## 4. Les Méthodes des Objets

### Concept
Une **méthode** est une fonction stockée dans un objet. Exemples déjà connus : `console.log()`, `"abc".toUpperCase()`.

```js
const utilisateur = {
  prenom: "Jean-Michel",
  saluer: function() { console.log("Bonjour !"); }
};
utilisateur.saluer(); // appel : point + parenthèses
```

### Syntaxe raccourcie ES6
Pas de mot-clé `function` → forme standard du code moderne.

```js
const utilisateur = {
  prenom: "Jean-Michel",
  saluer() { console.log("Bonjour !"); }  // raccourci ES6
};
```

### Le mot-clé `this`
`this` désigne **l'objet avant le point** lors de l'appel. Permet à une méthode d'accéder aux autres propriétés/méthodes de son objet.

```js
const utilisateur = {
  prenom: "Jean-Michel",
  nom: "Nogaro",
  nomComplet() { return `${this.prenom} ${this.nom}`; },
  sePresenter() { console.log(`Bonjour, je suis ${this.nomComplet()}`); }
};
```

### ⚠️ Piège : pas de fléchée pour les méthodes
Les fléchées n'ont **pas leur propre `this`**. Une méthode en fléchée ne peut pas accéder aux propriétés de son objet.

```js
const compteur = {
  valeur: 10,
  afficherMal: () => { console.log(this.valeur); },  // ❌ undefined
  afficherBien() { console.log(this.valeur); }        // ✅ 10
};
```

**Règle :** fléchées pour les **callbacks**, syntaxe raccourcie `nomMethode() {}` pour les **méthodes d'objet** qui utilisent `this`.

### Exemple concret : panier d'achat

```js
const panier = {
  articles: [],
  ajouter(nom, prix) {
    this.articles.push({ nom, prix }); // raccourci de propriété ES6
    console.log(`${nom} ajouté au panier`);
  },
  total() {
    let somme = 0;
    for (const article of this.articles) { somme += article.prix; }
    return somme;
  }
};
panier.ajouter("Clavier", 49);
panier.ajouter("Souris", 29);
console.log(panier.total()); // 78
```

**Principe de base de la POO :** regrouper les **données** (`articles`) et les **actions** qui les manipulent (`ajouter`, `total`) au même endroit.

---

## 5. Les Arrays d'Objets

### Concept
Structure la plus courante du web (liste de produits, résultats de recherche, réponse d'API…) : un tableau dont chaque élément est un objet avec la même structure.

```js
const produits = [
  { nom: "Clavier", prix: 49, stock: 12 },
  { nom: "Souris", prix: 29, stock: 0 },
  { nom: "Écran", prix: 199, stock: 5 },
  { nom: "Casque", prix: 89, stock: 3 }
];

produits[0];       // { nom: "Clavier", prix: 49, stock: 12 }
produits[0].nom;   // "Clavier" (index + propriété)
produits[2].prix;  // 199
```

### Parcourir : `for...of` et `forEach`

```js
for (const produit of produits) {
  console.log(`${produit.nom} : ${produit.prix} €`);
}

produits.forEach(({ nom, prix }) => {       // forEach + fléchée + destructuration
  console.log(`${nom} : ${prix} €`);
});
```

### `find` — trouver UN objet
Renvoie le **premier** élément satisfaisant la condition, ou `undefined`.

```js
const ecran = produits.find(p => p.nom === "Écran");
const introuvable = produits.find(p => p.prix > 500); // undefined
```

### `filter` — garder PLUSIEURS objets
Renvoie un **nouveau tableau** avec tous les éléments passant le test.

```js
const enStock = produits.filter(p => p.stock > 0);     // 3 résultats
const abordables = produits.filter(p => p.prix < 100); // Clavier, Souris, Casque
```

### `map` — transformer chaque objet
Renvoie un **nouveau tableau de même taille**, chaque élément transformé.

```js
const noms = produits.map(p => p.nom);
// ["Clavier", "Souris", "Écran", "Casque"]

const avecTTC = produits.map(p => ({   // ⚠️ parenthèses autour de l'objet !
  nom: p.nom,
  prixTTC: p.prix * 1.2
}));
```

### Chaîner les méthodes
`filter` et `map` renvoient des tableaux → on peut les enchaîner.

```js
const resultat = produits
  .filter(p => p.stock > 0)
  .filter(p => p.prix < 100)
  .map(p => p.nom);
// ["Clavier", "Casque"]
```

### Bonus : `reduce`

```js
produits.reduce((total, p) => total + p.prix, 0); // 366 (somme des prix)
```

**Retenir surtout `find`, `filter` et `map`** : les trois méthodes quotidiennes.

---

## 6. Les Meilleures Méthodes pour Mieux Coder

### Checklist qualité complète

#### 1. `const` par défaut, `let` si nécessaire, jamais `var`

```js
const TAUX_TVA = 0.2;        // ✅ ne changera pas
let compteur = 0;             // ✅ doit être réassigné
var ancien = "non merci";     // ❌ portée confuse, hissage surprenant
```

`const` documente l'intention : on sait quelles valeurs peuvent bouger.

#### 2. Noms explicites

```js
// ❌
const d = 30;
const fn = (a, b) => a * b;

// ✅
const dureeEnJours = 30;
const calculerSurface = (largeur, hauteur) => largeur * hauteur;
```

Conventions :
- Variables/fonctions en **camelCase** : `prixTotal`, `calculerTTC`
- Booléens → question : `estActif`, `aUnCompte`
- Fonctions → verbe : `obtenirUtilisateur`, `afficherPanier`
- Constantes "magiques" → **MAJUSCULES** : `TAUX_TVA`, `MAX_TENTATIVES`

#### 3. Égalité stricte `===` toujours (jamais `==`)

```js
5 == "5";     // true 😱 (conversion implicite)
5 === "5";    // false ✅ (types différents)
0 == false;   // true 😱
0 === false;  // false ✅
```

#### 4. Template literals plutôt que concaténation

```js
// ❌
const phrase = "Je suis " + prenom + " et j'ai " + age + " ans.";
// ✅
const phrase2 = `Je suis ${prenom} et j'ai ${age} ans.`;
```

#### 5. Fonctions courtes qui font UNE chose

```js
const validerPrix = prix => prix > 0;
const calculerTTC = prixHT => prixHT * 1.2;
const formaterPrix = prix => `${prix.toFixed(2)} €`;

if (validerPrix(prixHT)) {
  console.log(formaterPrix(calculerTTC(prixHT))); // "58.80 €"
}
```

#### 6. Early return (sortir tôt)
Traiter les cas d'erreur en premier et sortir, plutôt qu'imbriquer des `if`.

```js
// ❌ Imbrication profonde
const traiterCommande = (commande) => {
  if (commande) {
    if (commande.articles.length > 0) {
      if (commande.paiementValide) { return "Commande expédiée"; }
    }
  }
  return "Erreur";
};

// ✅ Early return
const traiterCommande2 = (commande) => {
  if (!commande) return "Commande manquante";
  if (commande.articles.length === 0) return "Panier vide";
  if (!commande.paiementValide) return "Paiement refusé";
  return "Commande expédiée";
};
```

#### 7. DRY (Don't Repeat Yourself)
Si on copie-colle un bloc une 3e fois → en faire une fonction.

```js
// ❌ Logique copiée-collée
console.log(`Clavier : ${(49 * 1.2).toFixed(2)} €`);
console.log(`Souris : ${(29 * 1.2).toFixed(2)} €`);

// ✅ Fonction réutilisable
const afficherPrixTTC = (nom, prixHT) =>
  console.log(`${nom} : ${(prixHT * 1.2).toFixed(2)} €`);
```

#### 8. Méthodes de tableaux plutôt que boucles
`find` / `filter` / `map` expriment l'intention par leur nom, mieux qu'un `for`.

```js
// ❌ Boucle : il faut lire le corps pour comprendre
const bonnesNotes = [];
for (let i = 0; i < notes.length; i++) {
  if (notes[i] >= 10) bonnesNotes.push(notes[i]);
}

// ✅ filter : l'intention est dans le nom
const bonnesNotes2 = notes.filter(note => note >= 10);
```

---

## Récapitulatif des pièges signalés

| Piège | Détail |
|-------|--------|
| Fléchée + accolades sans `return` | Renvoie `undefined` |
| Fléchée retournant un objet littéral | Entourer de `()` : `=> ({ clé: val })` |
| Fléchée comme méthode d'objet | `this` ne désigne pas l'objet → `undefined` |
| Déstructuration : nom incorrect | `{ name }` au lieu de `{ nom }` → `undefined` |
| `==` au lieu de `===` | Conversion implicite, résultats surprenants |
| `var` | Portée confuse, hissage surprenant → bannir |
| `const` sur un objet ≠ objet figé | La référence est constante, le contenu est modifiable |
