# Fiche de référence — Leçon 1 : Les bases de JavaScript

**Dossier :** `JS/lecon1-bases-variables-types/`

---

## Chapitres de la leçon

| # | Chapitre | Fichier |
|---|----------|---------|
| 1 | Script.js, variables et opérateurs | `index.html` |
| 2 | Les alertes système | `alertes.html` |
| 3 | Les types de valeurs | `types.html` |
| 4 | Les chaînes de caractères | `chaines.html` |
| 5 | Les opérateurs de comparaison | `comparaison.html` |
| 6 | Raccourcis clavier Mac pour coder | `raccourcis.html` |

---

## Chapitre 1 — Script.js, variables et opérateurs

### Les 3 façons d'ajouter du JavaScript dans une page HTML

| Méthode | Où ? | Quand l'utiliser ? |
|---------|------|-------------------|
| **1. En ligne (inline)** | Directement dans une balise HTML | Presque jamais — difficile à maintenir |
| **2. Interne (balise `<script>`)** | Dans une balise `<script>` dans le HTML | Pour des tests rapides ou des pages uniques |
| **3. Externe (fichier .js)** | Dans un fichier `.js` séparé | **La méthode recommandée** pour tous les projets |

```html
<!-- 1. Inline -->
<button onclick="alert('Bonjour')">Cliquez</button>

<!-- 2. Interne -->
<script>
  console.log("Je suis dans le HTML");
</script>

<!-- 3. Externe (recommandé) -->
<script src="script.js"></script>
```

> **Bonne pratique :** toujours utiliser un fichier externe. Cela sépare le contenu (HTML) du comportement (JS).

**Placement de la balise `<script>` :** juste avant `</body>` pour que le HTML soit entièrement chargé avant l'exécution du script.

### `console.log` — premier outil

`console.log()` affiche un message dans la **console du navigateur** (pas sur la page web). C'est l'outil de débogage n°1.

```
console  .  log  ( "Bonjour" )
objet  accès  méthode  appel + argument
```

```js
console.log("Bonjour, je suis un script JavaScript.");
```

Autres méthodes utiles : `console.error()`, `console.warn()`, `console.table()`.

### Les variables — stocker des valeurs

Une variable est une **boîte avec une étiquette**. On déclare avec `let` ou `const`.

```js
let nombre = 10;       // modifiable
const PI = 3.14159;    // non modifiable (constante)
```

| Mot-clé | Modifiable ? | Quand l'utiliser |
|---------|-------------|-----------------|
| `const` | Non | **Par défaut** — pour tout ce qui ne change pas |
| `let` | Oui | Quand la valeur doit évoluer (compteur, score…) |
| `var` | Oui | **Jamais** — ancien mot-clé, source de bugs |

### Les opérateurs arithmétiques

| Opérateur | Calcul | Exemple | Résultat |
|-----------|--------|---------|----------|
| `+` | Addition | `10 + 20` | `30` |
| `-` | Soustraction | `10 - 20` | `-10` |
| `*` | Multiplication | `10 * 20` | `200` |
| `/` | Division | `10 / 20` | `0.5` |
| `%` | Modulo (reste) | `10 % 20` | `10` |
| `**` | Puissance | `10 ** 20` | `100000000000000000000` |

> Le **modulo** (`%`) retourne le reste d'une division entière. Utile pour savoir si un nombre est pair : `n % 2 === 0`.

### Les raccourcis d'assignation

```js
let nombre = 100;
nombre += 10;  // nombre = nombre + 10 → 110
nombre -= 10;  // nombre = nombre - 10 → 100
nombre *= 10;  // nombre = nombre * 10 → 1000
nombre /= 10;  // nombre = nombre / 10 → 100
```

---

## Chapitre 2 — Les alertes système

Trois boîtes de dialogue natives du navigateur pour interagir directement avec l'utilisateur.

| Méthode | Rôle | Retourne |
|---------|------|----------|
| `alert()` | Affiche un message | `undefined` |
| `confirm()` | Pose une question OK / Annuler | `true` / `false` |
| `prompt()` | Demande une saisie texte | `string` / `null` |

### `alert()` — afficher un message

Affiche un message, attend un clic sur OK. Ne retourne rien (`undefined`).

```js
alert("Bienvenue sur le site !");
```

### `confirm()` — poser une question

Affiche OK et Annuler. Retourne `true` si OK, `false` si Annuler. Première interaction qui produit un **résultat utilisable dans le code**.

```js
const réponse = confirm("Voulez-vous continuer ?");
if (réponse) {
  console.log("L'utilisateur a dit oui");
} else {
  console.log("L'utilisateur a dit non");
}
```

### `prompt()` — demander une saisie

Affiche un champ de texte. Retourne la valeur saisie (**un string**), ou `null` si annulation. Seule alerte qui permet de **récupérer une donnée**.

```js
const nom = prompt("Comment tu t'appelles ?");
if (nom !== null) {
  console.log("Bonjour " + nom);
} else {
  console.log("L'utilisateur a annulé");
}
```

Valeur par défaut possible en second argument :

```js
const ville = prompt("Ta ville ?", "Marseille");
```

### Pourquoi éviter les alertes système en production

- Elles **bloquent** toute interaction avec la page
- Leur apparence **dépend du navigateur** — non stylisables
- Mauvaise expérience utilisateur

→ En pratique, on les remplace par des composants HTML/CSS (modales, toasts, notifications). Mais parfaites pour **apprendre et tester**.

---

## Chapitre 3 — Les types de valeurs

### Piège fondateur

`prompt()` retourne toujours un **string**. `"5" + 3` donne `"53"` (concaténation) au lieu de `8` (addition). Il faut comprendre les types.

### Deux grandes familles

- **Primitifs (6)** — valeurs simples, immuables
- **Object (1)** — valeurs complexes, modifiables

### Les 6 types primitifs

| Type | Description | Exemple |
|------|-------------|---------|
| `string` | Chaîne de caractères (texte) | `"Bonjour"` |
| `number` | Nombre entier ou décimal | `42`, `3.14` |
| `boolean` | Vrai ou faux | `true`, `false` |
| `undefined` | Variable déclarée mais sans valeur | `undefined` |
| `null` | Absence intentionnelle de valeur | `null` |
| `symbol` | Identifiant unique (avancé) | `Symbol("id")` |

> Les trois premiers (`string`, `number`, `boolean`) sont utilisés **90% du temps**.

### `undefined` vs `null`

| | `undefined` | `null` |
|---|-----------|------|
| Qui décide ? | JavaScript (automatique) | Le développeur (volontaire) |
| Signification | "Aucune valeur n'a été donnée" | "La valeur est volontairement vide" |
| Analogie | Champ de formulaire jamais rempli | Champ effacé volontairement |

```js
let prénom;
console.log(prénom);          // undefined (déclarée, pas de valeur)

let utilisateur = null;
console.log(utilisateur);     // null (volontairement vide)
```

> Utiliser `=== null` ou `=== undefined` (triple égal) pour les distinguer.

### Le type Object

Tout ce qui n'est pas primitif est un objet. Collections de paires clé/valeur.

| Structure | Description | Exemple |
|-----------|-------------|---------|
| `Object` | Collection de propriétés | `{ nom: "Alice" }` |
| `Array` | Liste ordonnée de valeurs | `[1, 2, 3]` |
| `Function` | Bloc de code réutilisable | `function() {}` |
| `Date` | Date et heure | `new Date()` |

### `typeof` — connaître le type d'une valeur

```js
typeof "Bonjour"    // "string"
typeof 42           // "number"
typeof true         // "boolean"
typeof undefined    // "undefined"
typeof null         // "object"  ⚠️ bug historique !
typeof [1, 2]       // "object"
typeof {}           // "object"
```

> **Piège classique :** `typeof null` retourne `"object"`. Bug historique de JavaScript jamais corrigé pour ne pas casser le web existant.

### Primitif vs Objet — la différence clé

| | Primitif | Objet |
|---|---------|-------|
| Modifiable ? | Non (immuable) | Oui (modifiable) |
| Copie | Duplique la valeur | Copie la **référence** |

```js
// Primitif : copie indépendante
let a = 5;
let b = a;
b = 10;
console.log(a);       // 5 (inchangé)

// Objet : même référence
let obj1 = { nom: "Alice" };
let obj2 = obj1;
obj2.nom = "Bob";
console.log(obj1.nom); // "Bob" (modifié aussi !)
```

---

## Chapitre 4 — Les chaînes de caractères

### Trois façons de créer une chaîne

| Syntaxe | Type |
|---------|------|
| `"Bonjour"` | Guillemets doubles |
| `'Bonjour'` | Guillemets simples |
| `` `Bonjour` `` | Backticks (template) |

Guillemets doubles et simples sont équivalents. Les **backticks** offrent des fonctionnalités supplémentaires.

### Concaténation — assembler des chaînes

Opérateur `+` pour coller des chaînes :

```js
const message = "Bonjour " + prénom + " !";
```

> **Attention aux espaces :** `"Bonjour" + "Jean"` donne `"BonjourJean"`.

### Template literals — la méthode moderne

Backticks (`` ` ``) + `${...}` pour insérer des variables/expressions :

```js
const msg = `Je m'appelle ${prénom} et j'ai ${age} ans.`;
console.log(`Dans 10 ans, j'aurai ${age + 10} ans.`);
```

> **Règle :** dès qu'on mélange texte et variables, utiliser les backticks. Méthode recommandée en JavaScript moderne (ES6+).

### Longueur et accès aux caractères

- `.length` donne le nombre de caractères
- Chaque caractère a un **index commençant à 0**

```
B  o  n  j  o  u  r
0  1  2  3  4  5  6
```

```js
const mot = "Bonjour";
mot.length;            // 7
mot[0];                // "B" (premier)
mot[3];                // "j"
mot[mot.length - 1];   // "r" (dernier)
```

> **Piège :** l'index commence à **0**, pas à 1.

### Méthodes utiles sur les chaînes

| Méthode | Rôle | Exemple | Résultat |
|---------|------|---------|----------|
| `.toUpperCase()` | Tout en majuscules | `"bonjour".toUpperCase()` | `"BONJOUR"` |
| `.toLowerCase()` | Tout en minuscules | `"BONJOUR".toLowerCase()` | `"bonjour"` |
| `.trim()` | Supprime espaces aux extrémités | `"  hello  ".trim()` | `"hello"` |
| `.includes()` | Vérifie si texte présent | `"Bonjour".includes("jour")` | `true` |
| `.indexOf()` | Position première occurrence | `"Bonjour".indexOf("j")` | `3` |
| `.slice()` | Extrait une partie | `"Bonjour".slice(0, 3)` | `"Bon"` |
| `.replace()` | Remplace du texte | `"Bonjour".replace("jour", "soir")` | `"Bonsoir"` |
| `.split()` | Découpe en tableau | `"a,b,c".split(",")` | `["a","b","c"]` |

**Exemple concret — nettoyer un email :**

```js
const email = "  Jean@Gmail.COM  ";
const clean = email.trim().toLowerCase();  // "jean@gmail.com"
clean.includes("gmail");                    // true
const nom = clean.slice(0, clean.indexOf("@")); // "jean"
```

> **Important :** les méthodes de chaînes **ne modifient jamais la chaîne d'origine** (strings immuables). Elles retournent toujours une **nouvelle chaîne**.

### Caractères spéciaux (séquences d'échappement)

| Séquence | Caractère |
|----------|-----------|
| `\n` | Retour à la ligne |
| `\t` | Tabulation |
| `\\` | Antislash |
| `\"` | Guillemet dans une chaîne |

```js
console.log("Ligne 1\nLigne 2");
// Avec backticks, le retour à la ligne est naturel :
console.log(`Ligne 1
Ligne 2`);
```

---

## Chapitre 5 — Les opérateurs de comparaison

Le résultat d'une comparaison est toujours un **booléen** : `true` ou `false`.

| Opérateur | Signification | Exemple | Résultat |
|-----------|--------------|---------|----------|
| `==` | Égal à (valeur) | `5 == "5"` | `true` |
| `===` | Strictement égal (valeur + type) | `5 === "5"` | `false` |
| `!=` | Différent de (valeur) | `5 != "5"` | `false` |
| `!==` | Strictement différent (valeur + type) | `5 !== "5"` | `true` |
| `>` | Supérieur à | `10 > 5` | `true` |
| `<` | Inférieur à | `10 < 5` | `false` |
| `>=` | Supérieur ou égal à | `5 >= 5` | `true` |
| `<=` | Inférieur ou égal à | `3 <= 5` | `true` |

### `==` vs `===` — la différence cruciale

- `==` compare uniquement la **valeur** en convertissant les types si besoin (**coercion**)
- `===` compare la **valeur ET le type**, sans conversion

```js
// == fait de la conversion de type (coercion)
5 == "5"       // true (string "5" converti en number)
0 == false     // true (false converti en 0)
"" == false    // true (les deux convertis en 0)

// === ne convertit rien
5 === "5"      // false (number vs string)
0 === false    // false (number vs boolean)
"" === false   // false (string vs boolean)
```

> **Bonne pratique :** utiliser **TOUJOURS `===` et `!==`**. L'égalité lâche (`==`) donne des résultats surprenants et est source de bugs difficiles à trouver.

### Comparer des chaînes

Comparaison caractère par caractère selon l'**ordre Unicode**. Attention à la casse : majuscules ≠ minuscules.

```js
"a" < "b"                // true
"Z" < "a"                // true (majuscules avant minuscules)
"Bonjour" === "bonjour"  // false

// Comparer sans casse :
mot1.toLowerCase() === mot2.toLowerCase()  // true
```

### Exemple concret : vérification d'âge

```js
const age = 17;
if (age >= 18) {
  console.log("Accès autorisé");
} else {
  console.log(`Accès refusé, tu as ${age} ans`);
}
// "Accès refusé, tu as 17 ans"
```

---

## Chapitre 6 — Raccourcis clavier Mac pour coder

### Touches spéciales du Mac

| Symbole | Nom | Position |
|---------|-----|----------|
| `⌘` | Command (Cmd) | À côté de la barre d'espace |
| `⌥` | Option (Alt) | À côté de Command |
| `⇧` | Shift (Maj) | Au-dessus de Ctrl |
| `⌃` | Control (Ctrl) | En bas à gauche |
| `fn` | Function | Tout en bas à gauche |

### Caractères spéciaux pour coder (Mac AZERTY)

| Caractère | Nom | Raccourci | Usage en JS |
|-----------|-----|-----------|-------------|
| `` ` `` | Backtick | `⌥ + \` | Template literals |
| `{` | Accolade ouvrante | `⌥ + (` | Objets, blocs if/for |
| `}` | Accolade fermante | `⌥ + )` | Fermer un bloc |
| `[` | Crochet ouvrant | `⌥ + ⇧ + (` | Tableaux, index |
| `]` | Crochet fermant | `⌥ + ⇧ + )` | Fermer un tableau |
| `\|` | Pipe | `⌥ + ⇧ + L` | OR logique `\|\|` |
| `\` | Antislash | `⌥ + ⇧ + /` | Caractères d'échappement |
| `~` | Tilde | `⌥ + N` | Chemin home, NOT binaire |

> **Astuce mémo :** la touche `⌥` (Option) est la clé pour presque tous les caractères spéciaux. Retenir surtout `⌥ + (` pour `{` et `⌥ + )` pour `}`.

### Raccourcis navigateur (Chrome / Safari)

| Action | Raccourci |
|--------|-----------|
| Ouvrir les DevTools | `⌘ + ⌥ + I` |
| Ouvrir directement la Console | `⌘ + ⌥ + J` |
| Rafraîchir la page | `⌘ + R` |
| Rafraîchir sans cache | `⌘ + ⇧ + R` |
| Inspecter un élément | `⌘ + ⌥ + C` |

### Raccourcis VS Code

| Action | Raccourci |
|--------|-----------|
| Sauvegarder | `⌘ + S` |
| Annuler | `⌘ + Z` |
| Commenter une ligne | `⌘ + /` |
| Dupliquer une ligne | `⌥ + ⇧ + ↓` |
| Déplacer une ligne | `⌥ + ↑/↓` |
| Ouvrir le terminal intégré | `⌃ + `` ` `` |
| Rechercher dans le fichier | `⌘ + F` |
| Rechercher dans tout le projet | `⌘ + ⇧ + F` |
| Ouvrir un fichier rapidement | `⌘ + P` |
| Palette de commandes | `⌘ + ⇧ + P` |

---

## Résumé des pièges signalés

| Piège | Détail |
|-------|--------|
| `prompt()` retourne toujours un `string` | `"5" + 3` → `"53"` et non `8` |
| `typeof null` → `"object"` | Bug historique jamais corrigé |
| `==` vs `===` | Toujours utiliser `===` / `!==` pour éviter la coercion |
| Index commence à **0** | Le premier caractère est `mot[0]`, pas `mot[1]` |
| Espaces en concaténation | `"Bonjour" + "Jean"` → `"BonjourJean"` (espace manquant) |
| Strings immuables | Les méthodes retournent une nouvelle chaîne, ne modifient pas l'originale |
| Copie d'objet = copie de référence | Modifier la copie modifie aussi l'original |
| `var` | Ancien mot-clé à ne jamais utiliser — source de bugs |
| Casse dans les comparaisons de chaînes | `"Bonjour" === "bonjour"` → `false` |
