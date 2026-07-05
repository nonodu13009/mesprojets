/* ============================================
   Générateur de Brief projet — logique
   Sans dépendance. Sauvegarde locale + export PDF (impression).
   ============================================ */

(function () {
    "use strict";

    const STORAGE_KEY = "methode-brief-v1";

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    // Champs texte simples pilotés par leur id
    const SIMPLE_FIELDS = [
        "projet-nom", "projet-pitch", "projet-auteur", "projet-date",
        "probleme", "solution", "cible", "valeur",
        "contraintes", "risques", "objectifs", "stack-libre"
    ];

    const MOSCOW = {
        must:   { label: "Must",   cls: "moscow-must" },
        should: { label: "Should", cls: "moscow-should" },
        could:  { label: "Could",  cls: "moscow-could" },
        wont:   { label: "Won't",  cls: "moscow-wont" }
    };

    const esc = (s) => String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    /* ---------- Lecture de l'état depuis le DOM ---------- */

    function readState() {
        const state = { personas: [], features: [], stack: [] };
        SIMPLE_FIELDS.forEach((id) => {
            const el = document.getElementById(id);
            state[id] = el ? el.value.trim() : "";
        });
        $$("#personas-list .dyn-row").forEach((row) => {
            const nom = $(".persona-nom", row).value.trim();
            const besoin = $(".persona-besoin", row).value.trim();
            if (nom || besoin) state.personas.push({ nom, besoin });
        });
        $$("#features-list .dyn-row").forEach((row) => {
            const nom = $(".feature-nom", row).value.trim();
            const prio = $(".feature-prio", row).value;
            if (nom) state.features.push({ nom, prio });
        });
        $$("input[name='stack']:checked").forEach((c) => state.stack.push(c.value));
        return state;
    }

    /* ---------- Aperçu ---------- */

    function block(title, value) {
        const body = value
            ? `<p>${esc(value)}</p>`
            : `<p class="doc-empty">À compléter…</p>`;
        return `<h3>${esc(title)}</h3>${body}`;
    }

    function renderPreview(s) {
        const doc = $("#brief-doc");
        const parts = [];

        parts.push(`<div class="doc-title">${esc(s["projet-nom"]) || "Nouveau projet"}</div>`);
        if (s["projet-pitch"]) parts.push(`<p class="doc-pitch">${esc(s["projet-pitch"])}</p>`);

        const meta = [];
        if (s["projet-auteur"]) meta.push(esc(s["projet-auteur"]));
        if (s["projet-date"]) meta.push(esc(s["projet-date"]));
        meta.push("Document de brief");
        parts.push(`<div class="doc-meta">${meta.join(" · ")}</div>`);

        parts.push(block("Problème", s.probleme));
        parts.push(block("Solution", s.solution));
        parts.push(block("Public cible", s.cible));
        parts.push(block("Proposition de valeur", s.valeur));

        // Personas
        parts.push(`<h3>Personas</h3>`);
        if (s.personas.length) {
            parts.push("<ul>" + s.personas.map((p) =>
                `<li><strong>${esc(p.nom) || "?"}</strong>&nbsp;—&nbsp;${esc(p.besoin)}</li>`
            ).join("") + "</ul>");
        } else {
            parts.push(`<p class="doc-empty">Aucun persona défini.</p>`);
        }

        // Fonctionnalités MoSCoW
        parts.push(`<h3>Fonctionnalités (MoSCoW)</h3>`);
        if (s.features.length) {
            const order = ["must", "should", "could", "wont"];
            const sorted = s.features.slice().sort(
                (a, b) => order.indexOf(a.prio) - order.indexOf(b.prio)
            );
            parts.push("<ul>" + sorted.map((f) => {
                const m = MOSCOW[f.prio] || MOSCOW.should;
                return `<li><span class="moscow-tag ${m.cls}">${m.label}</span>${esc(f.nom)}</li>`;
            }).join("") + "</ul>");
        } else {
            parts.push(`<p class="doc-empty">Aucune fonctionnalité définie.</p>`);
        }

        // Stack
        parts.push(`<h3>Stack technique</h3>`);
        const stack = s.stack.slice();
        if (s["stack-libre"]) {
            s["stack-libre"].split(",").map((t) => t.trim()).filter(Boolean)
                .forEach((t) => stack.push(t));
        }
        if (stack.length) {
            parts.push(`<div class="doc-tags">${stack.map((t) => `<span>${esc(t)}</span>`).join("")}</div>`);
        } else {
            parts.push(`<p class="doc-empty">Stack non définie.</p>`);
        }

        parts.push(block("Contraintes", s.contraintes));
        parts.push(block("Risques", s.risques));
        parts.push(block("Objectifs / KPIs", s.objectifs));

        doc.innerHTML = parts.join("");
    }

    /* ---------- Lignes dynamiques ---------- */

    function addPersona(data = {}) {
        const list = $("#personas-list");
        const row = document.createElement("div");
        row.className = "dyn-row";
        row.innerHTML =
            `<input type="text" class="persona-nom" placeholder="Qui ? (ex : Freelance débordé)" value="${esc(data.nom || "")}">` +
            `<input type="text" class="persona-besoin" placeholder="Son besoin principal" value="${esc(data.besoin || "")}">` +
            `<button type="button" class="btn-icon" aria-label="Supprimer">×</button>`;
        list.appendChild(row);
        wireRow(row);
    }

    function addFeature(data = {}) {
        const list = $("#features-list");
        const row = document.createElement("div");
        row.className = "dyn-row";
        const opts = Object.keys(MOSCOW).map((k) =>
            `<option value="${k}"${(data.prio || "must") === k ? " selected" : ""}>${MOSCOW[k].label}</option>`
        ).join("");
        row.innerHTML =
            `<input type="text" class="feature-nom" placeholder="Fonctionnalité" value="${esc(data.nom || "")}">` +
            `<select class="feature-prio">${opts}</select>` +
            `<button type="button" class="btn-icon" aria-label="Supprimer">×</button>`;
        list.appendChild(row);
        wireRow(row);
    }

    function wireRow(row) {
        $(".btn-icon", row).addEventListener("click", () => {
            row.remove();
            update();
        });
        $$("input, select", row).forEach((el) =>
            el.addEventListener("input", update));
    }

    /* ---------- Sauvegarde locale ---------- */

    let savedTimer;
    function flash(msg) {
        const el = $("#gen-saved");
        el.textContent = msg;
        el.classList.add("show");
        clearTimeout(savedTimer);
        savedTimer = setTimeout(() => el.classList.remove("show"), 2000);
    }

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(readState()));
        flash("Brouillon sauvegardé ✓");
    }

    function load(silent) {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            if (!silent) flash("Aucun brouillon enregistré");
            return;
        }
        const s = JSON.parse(raw);
        SIMPLE_FIELDS.forEach((id) => {
            const el = document.getElementById(id);
            if (el && s[id] != null) el.value = s[id];
        });
        $("#personas-list").innerHTML = "";
        (s.personas || []).forEach(addPersona);
        if (!s.personas || !s.personas.length) addPersona();
        $("#features-list").innerHTML = "";
        (s.features || []).forEach(addFeature);
        if (!s.features || !s.features.length) addFeature();
        $$("input[name='stack']").forEach((c) => {
            c.checked = (s.stack || []).includes(c.value);
            c.closest(".chip").classList.toggle("is-on", c.checked);
        });
        update();
        if (!silent) flash("Brouillon chargé ✓");
    }

    function reset() {
        if (!confirm("Effacer tous les champs et repartir de zéro ?")) return;
        $("#brief-form").reset();
        $("#personas-list").innerHTML = "";
        $("#features-list").innerHTML = "";
        addPersona();
        addFeature();
        $$(".chip").forEach((c) => c.classList.remove("is-on"));
        update();
        flash("Formulaire réinitialisé");
    }

    /* ---------- Boucle de mise à jour ---------- */

    function update() {
        renderPreview(readState());
    }

    /* ---------- Init ---------- */

    document.addEventListener("DOMContentLoaded", () => {
        // Chips stack
        $$(".chip").forEach((chip) => {
            const input = $("input", chip);
            chip.addEventListener("click", (e) => {
                if (e.target.tagName !== "INPUT") input.checked = !input.checked;
                chip.classList.toggle("is-on", input.checked);
                update();
            });
        });

        // Champs simples
        SIMPLE_FIELDS.forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener("input", update);
        });

        // Boutons
        $("#add-persona").addEventListener("click", () => { addPersona(); update(); });
        $("#add-feature").addEventListener("click", () => { addFeature(); update(); });
        $("#btn-save").addEventListener("click", save);
        $("#btn-load").addEventListener("click", () => load(false));
        $("#btn-reset").addEventListener("click", reset);
        $("#btn-pdf").addEventListener("click", () => window.print());

        // État initial
        if (localStorage.getItem(STORAGE_KEY)) {
            load(true);
        } else {
            addPersona();
            addFeature();
            update();
        }
    });
})();
