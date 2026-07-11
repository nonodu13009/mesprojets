# Fiche de référence — Leçon 5 : Le JavaScript Asynchrone

> **Dossier** : `JS/lecon5-javascript-asynchrone/`

---

## Structure de la leçon

| # | Chapitre | Fichier |
|---|----------|---------|
| 1 | Les Fonctions de Rappel (Callbacks) | `index.html` (callbacks) |
| 2 | Les Promesses (Promises) | `index.html` (promesses) |
| 3 | Async / Await | `index.html` (async-await) |

---

## Chapitre 1 — Les Fonctions de Rappel (Callbacks)

### Définition

Un **callback** (fonction de rappel) est une **fonction passée en argument à une autre fonction**, pour être **exécutée plus tard**. On ne l'appelle pas soi-même (pas de parenthèses), on la confie à une autre fonction qui l'appellera au bon moment.

Déjà utilisés implicitement depuis la leçon 3 :

```js
[1, 2, 3].forEach(n => console.log(n));   // la fléchée est un callback
const doubles = [1, 2, 3].map(n => n * 2); // idem pour map, filter, find…
```

### Le temps entre en jeu : `setTimeout`

`setTimeout` exécute un callback après un délai (en millisecondes). C'est l'exemple le plus simple d'**asynchrone** :

```js
console.log("1. Je commence");

setTimeout(() => {
  console.log("3. Deux secondes plus tard...");
}, 2000);

console.log("2. Je continue sans attendre !");
// Ordre d'affichage : 1, 2, puis 3
```

**Comportement clé** : JavaScript n'attend pas les 2 secondes. Il note le rendez-vous, continue son travail, et exécute le callback quand le minuteur sonne. **C'est ça, l'asynchrone.**

> ⚠️ **Piège classique** : écrire `setTimeout(maFonction(), 2000)` avec des parenthèses **exécute la fonction immédiatement**. On passe la fonction elle-même : `setTimeout(maFonction, 2000)`.

### Les callbacks d'événements (DOM)

Le DOM (leçon 4) utilise aussi les callbacks via `addEventListener` :

```js
const titre = document.querySelector("h1");
titre.addEventListener("click", () => {
  titre.textContent = "Tu m'as cliqué !";
});
```

Même logique que `setTimeout` : on ne sait pas quand le clic arrivera, alors on confie un callback qui sera appelé à ce moment-là.

### Simuler une opération lente

```js
const chargerUtilisateur = (id, callback) => {
  console.log(`Chargement de l'utilisateur ${id}...`);
  setTimeout(() => {
    const utilisateur = { id, nom: "Nogaro", prenom: "Jean-Michel" };
    callback(utilisateur); // on "rappelle" avec le résultat
  }, 1500);
};

chargerUtilisateur(1, (utilisateur) => {
  console.log(`Reçu : ${utilisateur.prenom} ${utilisateur.nom}`);
});
```

**Contrat d'un callback asynchrone** : « lance l'opération, et quand c'est prêt, appelle cette fonction avec le résultat ».

### La limite : le Callback Hell

Quand les opérations s'enchaînent (chaque étape dépend de la précédente), chaque étape s'imbrique → **pyramide de la mort** :

```js
chargerUtilisateur(1, (utilisateur) => {
  chargerCommandes(utilisateur.id, (commandes) => {
    chargerDetail(commandes[0].id, (detail) => {
      chargerFacture(detail.id, (facture) => {
        console.log(facture);
      });
    });
  });
});
```

Difficile à lire, difficile à modifier, cauchemardesque pour gérer les erreurs. → C'est pour résoudre ça qu'ES6 a introduit les **promesses**.

---

## Chapitre 2 — Les Promesses (Promises)

### Définition

Une **promesse** est un **objet** qui représente le **résultat futur** d'une opération asynchrone. Analogie : un ticket de retrait au pressing (promesse de récupérer sa veste, ou d'être prévenu s'il y a un problème).

### Les trois états d'une promesse

| État | Signification |
|------|---------------|
| **`pending`** (en attente) | L'opération est en cours |
| **`fulfilled`** (tenue) | Succès, le résultat est disponible |
| **`rejected`** (rompue) | Échec, une erreur est disponible |

### Consommer une promesse : `.then`, `.catch`, `.finally`

Dans 95 % des cas, on **consomme** des promesses créées par d'autres (le navigateur, une bibliothèque). Exemple parfait : **`fetch`**, qui appelle une URL et renvoie une promesse.

```js
fetch("https://api.github.com/users/github")
  .then(reponse => reponse.json())   // convertit la réponse en objet JS
  .then(donnees => {
    console.log(donnees.name);        // "GitHub"
  })
  .catch(erreur => {
    console.error("Ça a échoué :", erreur);
  });
```

| Méthode | Rôle |
|---------|------|
| **`.then(callback)`** | Exécuté quand la promesse **réussit** |
| **`.catch(callback)`** | Exécuté si n'importe quelle étape **échoue** |
| **`.finally(callback)`** | Exécuté **dans tous les cas** (pratique pour masquer un spinner) |

### La fin du callback hell : le chaînage

Chaque `.then` renvoie une **nouvelle promesse**. Les opérations en série s'écrivent **à plat** :

```js
chargerUtilisateur(1)
  .then(utilisateur => chargerCommandes(utilisateur.id))
  .then(commandes  => chargerDetail(commandes[0].id))
  .then(detail     => console.log(detail))
  .catch(erreur    => console.error(erreur)); // UN SEUL catch pour tout !
```

Le code se lit de haut en bas, et **un seul `.catch` final** attrape l'erreur de n'importe quelle étape.

### Créer sa propre promesse : `new Promise`

Le constructeur reçoit un callback avec deux fonctions : **`resolve`** (succès) et **`reject`** (échec) :

```js
const chargerUtilisateur = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, nom: "Nogaro" });       // promesse tenue
      } else {
        reject(new Error("Id invalide"));      // promesse rompue
      }
    }, 1000);
  });
};

chargerUtilisateur(1).then(u => console.log(`Bienvenue ${u.nom}`));
chargerUtilisateur(-5).catch(e => console.error(e.message)); // "Id invalide"
```

### Plusieurs promesses en parallèle : `Promise.all`

Quand des opérations sont **indépendantes**, les lancer en même temps et attendre qu'elles soient toutes terminées :

```js
const profil = fetch("https://api.github.com/users/github").then(r => r.json());
const depots = fetch("https://api.github.com/users/github/repos").then(r => r.json());

Promise.all([profil, depots])
  .then(([utilisateur, repos]) => {  // destructuration de tableau
    console.log(utilisateur.name);
    console.log(`${repos.length} dépôts chargés`);
  })
  .catch(e => console.error(e));
```

> **Règle** : opérations **dépendantes** → chaînage `.then`. Opérations **indépendantes** → `Promise.all` (plus rapide : tout part en même temps).

---

## Chapitre 3 — Async / Await

### Principe fondamental

`async/await` **n'est pas un nouveau système** : c'est une **écriture plus confortable des promesses**. Sous le capot, ce sont exactement les mêmes mécanismes — mais le code se lit de haut en bas, comme du code synchrone.

```js
// Avec .then
const chargerProfil = () => {
  fetch("https://api.github.com/users/github")
    .then(reponse => reponse.json())
    .then(donnees => console.log(donnees.name));
};

// Avec async/await : la même chose, lisible ligne par ligne
const chargerProfil2 = async () => {
  const reponse = await fetch("https://api.github.com/users/github");
  const donnees = await reponse.json();
  console.log(donnees.name);
};
```

### Les deux mots-clés

| Mot-clé | Rôle |
|---------|------|
| **`async`** devant une fonction | Elle **renvoie automatiquement une promesse** et a le droit d'utiliser `await` à l'intérieur |
| **`await`** devant une promesse | « Mets cette fonction en pause ici, et reprends quand le résultat est arrivé ». La valeur récupérée est le résultat de la promesse, plus besoin de `.then` |

```js
const direBonjour = async () => {
  return "Bonjour !";  // enveloppé automatiquement dans une promesse
};

console.log(direBonjour());              // Promise { "Bonjour !" }
direBonjour().then(m => console.log(m)); // "Bonjour !"
```

> **Règle d'or** : `await` ne fonctionne que dans une fonction `async` (ou directement dans la console, qui l'autorise au niveau global — pratique pour tester).

### Gérer les erreurs : `try / catch`

Avec `async/await`, fini le `.catch` : on utilise le bloc **`try / catch`** classique de JavaScript.

```js
const chargerUtilisateur = async (pseudo) => {
  try {
    const reponse = await fetch(`https://api.github.com/users/${pseudo}`);

    if (!reponse.ok) {
      throw new Error(`Utilisateur introuvable (${reponse.status})`);
    }

    const donnees = await reponse.json();
    console.log(`${donnees.name} — ${donnees.public_repos} dépôts`);
  } catch (erreur) {
    console.error("Erreur :", erreur.message);
  }
};

chargerUtilisateur("github");               // "GitHub — ... dépôts"
chargerUtilisateur("zzz-inexistant-999");   // "Erreur : Utilisateur introuvable (404)"
```

> ⚠️ **Piège `fetch`** : une réponse **404 ou 500 ne déclenche pas le `catch`** (la requête a techniquement « réussi »). D'où le test **`if (!reponse.ok)`** — un réflexe à prendre systématiquement.

### Enchaîner des opérations dépendantes

Le callback hell du chapitre 1, version finale — chaque ligne utilise le résultat de la précédente :

```js
const chargerFacture = async () => {
  const utilisateur = await chargerUtilisateur(1);
  const commandes   = await chargerCommandes(utilisateur.id);
  const detail      = await chargerDetail(commandes[0].id);
  return detail.facture;
};
```

Mêmes étapes que la pyramide, mais on dirait du code synchrone ordinaire.

### Parallèle : `await` + `Promise.all`

> ⚠️ **Piège de débutant** : `await` en série **ralentit** les opérations indépendantes.

```js
// ❌ Série : 2 × le temps de réponse (le 2e fetch attend le 1er)
const profil = await fetch(url1).then(r => r.json());
const depots = await fetch(url2).then(r => r.json());

// ✅ Parallèle : les deux partent en même temps
const [profil2, depots2] = await Promise.all([
  fetch(url1).then(r => r.json()),
  fetch(url2).then(r => r.json())
]);
```

---

## Récapitulatif — Progression de l'asynchrone

| Étape | Mécanisme | Problème résolu | Limite restante |
|-------|-----------|-----------------|-----------------|
| **Callbacks** | Fonction passée en argument, exécutée plus tard | Réagir à des événements / opérations différées | Callback hell (pyramide d'imbrications) |
| **Promesses** | Objet représentant un résultat futur ; chaînage `.then` | Aplatit la pyramide, un seul `.catch` | Code encore truffé de `.then(…)` |
| **Async/Await** | Sucre syntaxique sur les promesses ; `try/catch` | Le code se lit comme du synchrone | Penser à `Promise.all` pour le parallèle |

---

## Pièges signalés dans la leçon

| Piège | Détail |
|-------|--------|
| Parenthèses dans `setTimeout` | `setTimeout(fn(), 2000)` exécute immédiatement ; écrire `setTimeout(fn, 2000)` |
| `fetch` et les erreurs HTTP | Une 404 / 500 ne déclenche **pas** `.catch` ni le bloc `catch` ; tester **`if (!reponse.ok)`** systématiquement |
| `await` en série inutile | Deux `await` successifs sur des opérations **indépendantes** doublent le temps ; utiliser **`Promise.all`** |
| `await` hors `async` | `await` ne fonctionne que dans une fonction `async` (ou dans la console navigateur au niveau global) |

---

## Concepts et terminologie clés

- **Asynchrone** : JavaScript n'attend pas la fin d'une opération lente ; il note le rendez-vous, continue, et exécute le callback/résout la promesse quand le résultat arrive.
- **`setTimeout(callback, ms)`** : exécute le callback après un délai.
- **`addEventListener(event, callback)`** : callback d'événement DOM.
- **`fetch(url)`** : appel réseau, renvoie une promesse.
- **`reponse.json()`** : convertit la réponse `fetch` en objet JS (renvoie aussi une promesse).
- **`new Promise((resolve, reject) => { … })`** : créer sa propre promesse.
- **`Promise.all([p1, p2, …])`** : attend que toutes les promesses soient résolues, renvoie un tableau de résultats.
- **Destructuration de tableau** dans `.then` / `await` : `const [a, b] = await Promise.all([…])`.
- **`try / catch`** : gestion d'erreurs classique, remplace `.catch` avec `async/await`.
- **`throw new Error(message)`** : lever une erreur manuellement (ex. sur `!reponse.ok`).
