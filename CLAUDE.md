# CLAUDE.md — FormationJS

Mémoire du projet pour Claude Code. À lire au début de chaque session.

## Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Structure](#structure)
- [Charte design](#charte-design)
- [Conventions](#conventions)
- [Générateur de Brief](#générateur-de-brief)
- [Lancer le site](#lancer-le-site)

## Vue d'ensemble

Site pédagogique **statique** (HTML/CSS/JS pur, sans build ni framework) qui
regroupe deux formations :

- **JavaScript** : 4 leçons, 22 chapitres (bases → ES6 moderne → DOM).
- **Méthode & Projet** : pipeline en 7 étapes pour piloter un projet web avec l'IA,
  plus un **Générateur de Brief** dynamique avec export PDF.

## Structure

```text
FormationJS/
├── index.html              → Hub d'accueil
├── style.css               → CSS du hub uniquement
├── CLAUDE.md               → Ce fichier
├── 0_INDEX.md              → Plan du site
├── JS/
│   ├── style.css           → CSS PARTAGÉ par les 4 leçons
│   ├── lecon1-bases-variables-types/     (index + 6 chapitres, script.js)
│   ├── lecon2-boucles-conditions-fonctions/ (index + 7 chapitres, script.js)
│   ├── lecon3-javascript-moderne-es6/    (index + 6 chapitres, ch. 24-29)
│   └── lecon4-manipulation-dom/          (index + 3 chapitres, ch. 30-32)
└── methode-projet/
    ├── style.css           → CSS des pages méthode
    ├── generateur.css      → Styles du générateur de brief
    ├── generateur.js       → Logique du générateur
    ├── generateur-brief.html
    └── index + 7 étapes (idee-brief, recherche-cadrage, design,
        developpement, tests, deploiement, maintenance)
```

## Charte design

Style **Apple HIG / iOS**, light mode. La charte complète (couleurs, typo,
espacements, rayons) est documentée en commentaire en tête de `style.css`.

Points clés :

- Police système `-apple-system`, accent bleu `#0071e3`, surfaces `#f5f5f7`.
- Rayons : pills `980px`, cards `12px`.
- Effets **wow subtils** : reveal au scroll natif (`animation-timeline: view()`),
  entrée du hero, halo lumineux, hover ressort (`cubic-bezier(0.22, 1, 0.36, 1)`).
- Toujours respecter `prefers-reduced-motion` (bloc dédié dans chaque CSS).

## Conventions

- Un seul CSS par zone : ne pas dupliquer. Le CSS des leçons est `JS/style.css`
  (référencé en `../style.css` depuis chaque page).
- Chaque page a : `<meta name="description">`, favicon SVG inline, footer avec
  pager précédent/suivant et crédit + retour hub.
- L'ordre des chapitres est défini par la `<nav>` de chaque section : garder
  cohérence nav ↔ pager du footer.
- Français, ton concis et pédagogique.

## Générateur de Brief

`methode-projet/generateur-brief.html` — formulaire réutilisable pour cadrer
tout nouveau projet.

- Sections : projet, problème/solution, personas (dynamiques), fonctionnalités
  MoSCoW (dynamiques), stack, cadrage.
- Aperçu du document mis à jour en direct.
- Sauvegarde locale via `localStorage` (clé `methode-brief-v1`).
- **Export PDF** = `window.print()` + feuille `@media print` qui n'imprime que
  l'aperçu (`#brief-doc`). Aucune dépendance externe.

## Lancer le site

Site 100 % statique. Ouvrir `index.html` dans le navigateur, ou servir en local :

```bash
python3 -m http.server 8000
```
