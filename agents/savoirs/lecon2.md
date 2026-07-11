# Fiche de référence — Leçon 2 : Boucles, Conditions et Fonctions

**Dossier :** `JS/lecon2-boucles-conditions-fonctions/`

---

## Chapitres et fichiers

| # | Chapitre | Fichier HTML |
|---|----------|-------------|
| 1 | La boucle `for` | `01-boucle-for.html` |
| 2 | La boucle `while` et `do...while` | `02-boucle-while.html` |
| 3 | Les conditions `if` et `if...else` | `03-conditions-if-else.html` |
| 4 | Les conditions multiples `if...else if...else` | `04-conditions-multiples.html` |
| 5 | L'instruction `switch` | `05-switch.html` |
| 6 | Portée des variables, `break` et `continue` | `06-portee-break-continue.html` |
| 7 | Introduction aux fonctions | `07-fonctions.html` |

---

## 1. La boucle `for`

### Pourquoi les boucles
Les boucles (*loops*) permettent de **répéter un bloc de code** autant de fois que nécessaire, sans dupliquer manuellement les instructions.

### Anatomie
```
for (initialisation ; condition ; incrémentation) { …bloc répété… }
```

| Partie | Exemple | Rôle |
|---|---|---|
| Initialisation | `let i = 0` | Crée un compteur, exécutée **une seule fois** au début |
| Condition | `i < 5` | Testée **avant** chaque tour. Si `false`, la boucle s'arrête |
| Incrémentation | `i++` | Exécutée **après** chaque tour (modifie le compteur) |

> **Rappel :** `i++` est un raccourci pour `i = i + 1` (opérateur d'assignation vu en leçon 1).

```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}
// Affiche : 0, 1, 2, 3, 4
```

### Compter de 1 à 10
On démarre à `1` et on utilise `<=` pour **inclure** 10 :
```js
for (let i = 1; i <= 10; i++) {
  console.log(`Nombre : ${i}`);
}
```

### Compter à l'envers
Décrémenter avec `i--` :
```js
for (let i = 5; i >= 1; i--) {
  console.log(`Compte à rebours : ${i}`);
}
console.log("Décollage !");
```

### Parcourir un tableau
Utilisation la plus fréquente. Les **index commencent à 0** (même principe que les chaînes) :
```js
const fruits = ["pomme", "banane", "cerise"];
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}
```

> **Piège :** on utilise `<` (pas `<=`) car les index vont de `0` à `length - 1`.

### `for...of` (syntaxe moderne)
Quand on n'a **pas besoin de l'index**, plus lisible — JS gère le compteur :
```js
for (const fruit of fruits) {
  console.log(fruit);
}
```
**Syntaxe à privilégier** quand on veut juste lire les valeurs.

### Pattern « accumulateur »
Variable déclarée **avant** la boucle pour ne pas être réinitialisée à chaque tour :
```js
const notes = [15, 12, 18, 9, 14];
let somme = 0;
for (const note of notes) {
  somme = somme + note;
}
const moyenne = somme / notes.length; // 13.6
```

---

## 2. La boucle `while` et `do...while`

### Quand utiliser `while`
Quand le **nombre de tours est inconnu** (attendre une saisie correcte, chercher une valeur…).

```js
let compteur = 0;
while (compteur < 5) {
  console.log(`Tour n°${compteur}`);
  compteur++;
}
```
Principe : **avant** chaque tour, JS vérifie la condition. `true` → exécute le bloc. `false` → sort.

### `while` vs `for`

| Boucle | Quand l'utiliser | Exemple typique |
|---|---|---|
| `for` | Nombre de tours **connu** à l'avance | Parcourir un tableau, compter de 1 à 10 |
| `while` | Nombre de tours **inconnu** | Attendre une saisie correcte, chercher une valeur |

### Exemple : deviner un nombre
```js
const secret = 7;
let tentative = 0;
while (tentative !== secret) {
  tentative = Number(prompt("Devine le nombre (1-10) :"));
}
console.log("Bravo, tu as trouvé !");
```

### `do...while`
**Différence fondamentale :** le bloc s'exécute **au moins une fois** car la condition est testée **après**.

| `while` | teste **AVANT** → peut ne jamais s'exécuter |
|---|---|
| `do...while` | teste **APRÈS** → s'exécute **au moins 1 fois** |

```js
let réponse;
do {
  réponse = prompt("Tape 'oui' pour continuer :");
} while (réponse !== "oui");
```

### Exemple : lancer un dé jusqu'à obtenir un 6
```js
let dé;
let nbLancers = 0;
do {
  dé = Math.ceil(Math.random() * 6);
  nbLancers++;
  console.log(`Lancer ${nbLancers} : ${dé}`);
} while (dé !== 6);
```
- `Math.random()` → nombre aléatoire entre 0 et 1.
- `Math.ceil(Math.random() * 6)` → entier entre 1 et 6.

### ⚠️ Piège : boucles infinies
Si la variable testée dans la condition **n'est jamais modifiée**, la boucle tourne à l'infini et **bloque le navigateur**.
```js
// DANGER :
let x = 0;
while (x < 10) { console.log(x); /* x++ oublié ! */ }

// CORRECT :
let y = 0;
while (y < 10) { console.log(y); y++; }
```
> **Astuce :** si le navigateur se fige → fermer l'onglet (ou Gestionnaire de tâches Chrome : `⇧ + Esc`).

---

## 3. Les conditions `if` et `if...else`

### Pourquoi des conditions
Les opérateurs de comparaison (`===`, `>`, `<`…) retournent `true`/`false`. Les conditions utilisent ces résultats pour **décider quel code exécuter**.

### Structure `if`
Le bloc ne s'exécute **que si** la condition est `true` :
```js
const age = 20;
if (age >= 18) {
  console.log("Tu es majeur");
}
```

### Structure `if...else`
Code alternatif quand la condition est fausse. **Un seul** des deux blocs s'exécute :
```js
if (age >= 18) {
  console.log("Tu es majeur");
} else {
  console.log("Tu es mineur");
}
```

### Opérateurs logiques
Utilisés constamment avec `if` pour **combiner** plusieurs conditions :

| Opérateur | Nom | Signification | Exemple |
|---|---|---|---|
| `&&` | ET (AND) | Les **deux** conditions vraies | `age >= 18 && age < 65` |
| `\|\|` | OU (OR) | **Au moins une** condition vraie | `jour === "samedi" \|\| jour === "dimanche"` |
| `!` | NON (NOT) | **Inverse** la condition | `!estConnecté` |

```js
// ET
if (age >= 18 && aPermis) { console.log("Tu peux conduire"); }
// OU
if (jour === "samedi" || jour === "dimanche") { console.log("Week-end !"); }
// NON
if (!estConnecté) { console.log("Veuillez vous connecter"); }
```

### Opérateur ternaire (raccourci)
Pour les conditions simples qui **assignent une valeur** :
```js
// condition ? valeurSiVrai : valeurSiFaux
const statut = age >= 18 ? "majeur" : "mineur";
```
> **Bonne pratique :** uniquement pour des conditions **simples et courtes**. Sinon préférer `if...else`. Sera revu en leçon 3 avec les opérateurs modernes.

---

## 4. Les conditions multiples `if...else if...else`

### Principe
Teste les conditions **dans l'ordre** (de haut en bas). Dès qu'une est `true`, son bloc s'exécute et **toutes les suivantes sont ignorées**.

```js
const note = 15;
if (note >= 16)        { console.log("Très bien"); }
else if (note >= 14)   { console.log("Bien"); }         // ← 15 >= 14 → "Bien"
else if (note >= 12)   { console.log("Assez bien"); }
else if (note >= 10)   { console.log("Passable"); }
else                   { console.log("Insuffisant"); }
```

### ⚠️ Piège : l'ordre des conditions compte !
Avec des intervalles numériques, commencer par la condition **la plus restrictive** (la plus grande valeur) :
```js
// MAUVAIS : note >= 10 en premier → 18 y entre déjà !
if (note >= 10) { ... }  // ← 18 >= 10 = true, on entre ici
else if (note >= 16) { ... } // ← jamais atteint pour 18

// BON : du plus restrictif au moins restrictif
if (note >= 16) { ... }
else if (note >= 10) { ... }
```

### Conditions imbriquées
Un `if` à l'intérieur d'un autre `if`. **Attention à la lisibilité** :
```js
if (age >= 18) {
  if (aPermis) {
    if (aVoiture) { console.log("Tu peux conduire ta voiture"); }
    else { console.log("Tu as le permis mais pas de voiture"); }
  } else { console.log("Passe d'abord le permis"); }
} else { console.log("Tu es trop jeune"); }
```
> **Conseil :** plus de 2 niveaux d'imbrication → simplifier avec `&&` ou des fonctions.

---

## 5. L'instruction `switch`

### Quand l'utiliser
Quand on compare **une même variable** à **plusieurs valeurs exactes** (pas des intervalles).

### Syntaxe
```js
const jour = "lundi";
switch (jour) {
  case "lundi":
    console.log("Début de semaine");
    break;
  case "mercredi":
    console.log("Milieu de semaine");
    break;
  case "samedi":
  case "dimanche":         // Regroupement de cas
    console.log("Week-end !");
    break;
  default:
    console.log("Jour ordinaire");
}
```

### Éléments clés

| Mot-clé | Rôle |
|---|---|
| `switch(expr)` | L'expression à tester |
| `case valeur:` | Compare avec `===` (égalité **stricte**) |
| `break` | Sort du `switch` — **obligatoire** après chaque cas |
| `default` | S'exécute si aucun `case` ne correspond (comme `else`) |

> **Attention :** `switch` utilise `===`. `case 5` ne correspondra **pas** à `"5"`.

### ⚠️ Piège : le `break` oublié (fall-through)
Sans `break`, le code « tombe » dans les `case` suivants :
```js
switch (fruit) {
  case "pomme":
    console.log("C'est une pomme");
    // pas de break → fall-through !
  case "banane":
    console.log("C'est une banane");
  // ...
}
// Affiche TOUTES les lignes suivantes → bug
```
> **Règle d'or :** TOUJOURS mettre un `break`, sauf regroupement volontaire de cas.

### Regrouper des cas (fall-through utile)
```js
switch (mois) {
  case 12: case 1: case 2:
    console.log("Hiver"); break;
  case 3: case 4: case 5:
    console.log("Printemps"); break;
  // ...
}
```

### `switch` vs `if...else if`

| Critère | `switch` | `if...else if` |
|---|---|---|
| Valeurs précises | ✅ Idéal | Possible mais verbeux |
| Intervalles (`>`, `<`) | ❌ Impossible | ✅ Idéal |
| Beaucoup de cas (5+) | ✅ Plus lisible | Verbeux |
| Conditions complexes (`&&`, `\|\|`) | ❌ Impossible | ✅ Idéal |

---

## 6. Portée des variables, `break` et `continue`

### Portée (scope)
Les accolades `{ }` créent un **bloc**. Les variables `let`/`const` n'existent **que dans leur bloc** :
```js
const nom = "Jean-Michel"; // Portée globale
if (true) {
  const age = 30;          // Portée locale (bloc if)
  console.log(nom);        // ✅ accessible (portée parente)
}
// console.log(age);       // ❌ ERREUR — age n'existe plus
```

> **Règle :** un bloc enfant peut lire les variables de ses **parents**, mais un parent **ne peut pas** lire celles de ses enfants.

### Portée dans les boucles
```js
for (let i = 0; i < 3; i++) {
  const message = `Tour ${i}`;
}
// i et message n'existent plus ici
```
Pour récupérer une valeur après la boucle → la déclarer **avant** :
```js
let total = 0;
for (let i = 1; i <= 5; i++) { total += i; }
console.log(total); // 15 ✅
```

### `var` vs `let`/`const` — pourquoi éviter `var`
`var` **ne respecte pas la portée de bloc** → bugs subtils :
```js
if (true) {
  var ancienne = "je fuis le bloc";  // var ignore le bloc !
  let moderne  = "je reste dans le bloc";
}
console.log(ancienne); // ✅ fonctionne (mauvais comportement)
// console.log(moderne); // ❌ ERREUR (bon comportement)
```

| Mot-clé | Portée |
|---|---|
| `var` | Portée de **fonction** (à éviter) |
| `let` / `const` | Portée de **bloc** (à utiliser) |

> **Bonne pratique :** `const` par défaut. `let` si réassignation nécessaire. **Jamais `var`.**

### `break` : sortir d'une boucle
Arrête **complètement** la boucle en cours, immédiatement :
```js
const nombres = [3, 7, 2, 9, 5, 1];
for (const n of nombres) {
  if (n > 8) {
    console.log(`Trouvé : ${n}`);
    break; // sort de la boucle, 5 et 1 jamais testés
  }
}
```
Utile quand on **cherche une valeur** et qu'on veut arrêter dès qu'elle est trouvée.

### `continue` : sauter une itération
Ne sort **pas** de la boucle — saute le reste du tour actuel et passe au **suivant** :
```js
for (let i = 1; i <= 10; i++) {
  if (i % 2 !== 0) continue; // impair → on saute
  console.log(i); // 2, 4, 6, 8, 10
}
```
> **Rappel :** `%` (modulo) donne le reste de la division. `i % 2 === 0` → `i` est pair.

### Résumé `break` vs `continue`

| Mot-clé | Effet |
|---|---|
| `break` | **Sort** de la boucle (arrête tout) |
| `continue` | **Saute** au tour suivant |

```js
const noms = ["Alice", "", "Bob", "STOP", "Charlie"];
for (const nom of noms) {
  if (nom === "STOP") { break; }    // arrête tout
  if (nom === "")     { continue; } // ignore les vides
  console.log(`Bonjour ${nom}`);
}
// Bonjour Alice → Bonjour Bob → Arrêt demandé
```

---

## 7. Introduction aux fonctions

### Le problème de la répétition
Copier-coller du code identique à plusieurs endroits → difficile à modifier et maintenir. Les fonctions permettent d'écrire le code **une seule fois**, de lui donner un **nom**, et de l'**appeler** autant de fois que nécessaire.

| Terme | Signification |
|---|---|
| **Définir** | Écrire le code de la fonction |
| **Appeler** | Exécuter la fonction |
| **Retourner** | Récupérer un résultat |

### Déclarer et appeler
La **déclaration** ne fait rien en elle-même. C'est l'**appel** (avec les parenthèses `()`) qui exécute :
```js
function direBonjour() {
  console.log("Bonjour !");
}
direBonjour(); // "Bonjour !"
direBonjour(); // appelable autant de fois qu'on veut
```

### Paramètres et arguments
Les **paramètres** rendent la fonction flexible :
```js
function direBonjour(prénom) {
  console.log(`Bonjour ${prénom} !`);
}
direBonjour("Alice"); // "Bonjour Alice !"

function addition(a, b) {
  console.log(`${a} + ${b} = ${a + b}`);
}
addition(3, 5); // "3 + 5 = 8"
```
> **Vocabulaire :** **paramètres** dans la déclaration, **arguments** dans l'appel. En pratique, souvent interchangeables.

### Valeur de retour (`return`)
`return` renvoie un résultat qu'on peut stocker ou utiliser dans une expression :
```js
function addition(a, b) { return a + b; }
const résultat = addition(3, 5); // 8
console.log(addition(1, 2) + addition(3, 4)); // 10
```
> **Important :** `return` **arrête immédiatement** la fonction. Tout code après un `return` ne sera jamais exécuté (comme `break` pour les boucles).

### Paramètres par défaut (ES6)
Valeur utilisée si aucun argument n'est fourni :
```js
function direBonjour(prénom = "inconnu") {
  console.log(`Bonjour ${prénom} !`);
}
direBonjour();        // "Bonjour inconnu !"
direBonjour("Alice"); // "Bonjour Alice !"
```

### Fonctions fléchées (*arrow functions*, ES6)
Syntaxe moderne et concise :
```js
// Classique
function carré(n) { return n * n; }

// Fléchée
const carré = (n) => { return n * n; };

// Fléchée courte (une seule expression → return implicite)
const carré = (n) => n * n;
```

| Forme | Syntaxe | Quand l'utiliser |
|---|---|---|
| Classique | `function nom() { }` | Fonctions principales, hoisting nécessaire |
| Fléchée | `const nom = () => { }` | Callbacks, fonctions courtes |
| Fléchée courte | `const nom = (x) => x * 2` | Expression unique, return implicite |

> **Pour l'instant :** utiliser la forme classique (`function`) pour les fonctions principales. Les fonctions fléchées seront adoptées en leçon 3 avec les méthodes de tableaux (`map`, `filter`).

### Exemple combiné : calculatrice (fonction + switch)
```js
function calculer(a, b, opération) {
  switch (opération) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/":
      if (b === 0) return "Erreur : division par zéro";
      return a / b;
    default: return "Opération inconnue";
  }
}
```

### Exemple : fonction qui filtre un tableau
```js
function filtrerPairs(nombres) {
  const pairs = [];
  for (const n of nombres) {
    if (n % 2 === 0) pairs.push(n);
  }
  return pairs;
}
filtrerPairs([1, 2, 3, 4, 5, 6, 7, 8]); // [2, 4, 6, 8]
```
> En leçon 3, cette opération s'écrira en une ligne : `mesNombres.filter(n => n % 2 === 0)`.

---

## Récapitulatif de la leçon 2

Les **trois piliers du contrôle de flux** :

| Pilier | Outils | Rôle |
|---|---|---|
| **Boucles** | `for`, `for...of`, `while`, `do...while` | Répéter du code |
| **Conditions** | `if`/`else if`/
