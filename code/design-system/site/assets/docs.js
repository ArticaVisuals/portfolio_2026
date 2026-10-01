/* Docs-site chrome behavior (hand-written; build.mjs does not touch this file). */
;(() => {
    const prefix = (() => {
        const self = document.querySelector('script[src$="assets/docs.js"]').getAttribute("src")
        return self.replace(/assets\/docs\.js$/, "")
    })()

    // ---- Surface toggle (whole page Cream ↔ Green), remembered per viewer --
    const themeBtn = document.querySelector("[data-ds-theme]")
    const applyTheme = (green) => {
        document.body.dataset.surface = green ? "green" : "cream"
        themeBtn.setAttribute("aria-pressed", String(green))
        document.querySelectorAll(".ds-preview").forEach((p) => {
            if (p.dataset.locked) return
            p.dataset.surface = green ? "green" : p.dataset.initialSurface
            syncSurfaceButtons(p.closest(".ds-example"), p.dataset.surface)
        })
    }
    document.querySelectorAll(".ds-preview").forEach((p) => (p.dataset.initialSurface = p.dataset.surface))
    try {
        if (localStorage.getItem("ds-surface") === "green") applyTheme(true)
    } catch {}
    themeBtn.addEventListener("click", () => {
        const green = document.body.dataset.surface !== "green"
        applyTheme(green)
        try {
            localStorage.setItem("ds-surface", green ? "green" : "cream")
        } catch {}
    })

    // ---- Per-example surface buttons --------------------------------------
    function syncSurfaceButtons(example, surface) {
        example?.querySelectorAll("[data-set-surface]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setSurface === surface)))
    }
    document.addEventListener("click", (ev) => {
        const btn = ev.target.closest("[data-set-surface]")
        if (!btn) return
        const example = btn.closest(".ds-example")
        const preview = example.querySelector(".ds-preview")
        preview.dataset.surface = btn.dataset.setSurface
        preview.dataset.locked = "1"
        syncSurfaceButtons(example, btn.dataset.setSurface)
    })

    // ---- Copy buttons ------------------------------------------------------
    document.addEventListener("click", async (ev) => {
        const btn = ev.target.closest(".ds-copy")
        if (!btn) return
        const code = btn.parentElement.querySelector("pre code").textContent
        try {
            await navigator.clipboard.writeText(code)
            btn.textContent = "Copied"
        } catch {
            btn.textContent = "Select + copy"
        }
        setTimeout(() => (btn.textContent = "Copy"), 1400)
    })

    // ---- Easing demo -------------------------------------------------------
    document.addEventListener("click", (ev) => {
        const row = ev.target.closest(".ds-ease__row")
        if (row) row.classList.toggle("is-on")
    })

    // ---- Loader demo -------------------------------------------------------
    document.addEventListener("click", (ev) => {
        const btn = ev.target.closest("[data-play-loader]")
        if (btn) window.mhPlayLoader(btn.closest(".ds-preview").querySelector(".mh-loader"))
    })

    // ---- Mobile menu -------------------------------------------------------
    const menu = document.querySelector(".ds-menu")
    const sidebar = document.getElementById("ds-sidebar")
    menu.addEventListener("click", () => {
        const open = !sidebar.hasAttribute("data-open")
        sidebar.toggleAttribute("data-open", open)
        menu.setAttribute("aria-expanded", String(open))
    })

    // ---- Search (⌘K / Ctrl-K / "/") ----------------------------------------
    const input = document.querySelector("[data-ds-search]")
    const results = document.querySelector("[data-ds-results]")
    let selected = 0
    const render = () => {
        const q = input.value.trim().toLowerCase()
        if (!q) return void (results.hidden = true)
        const hits = window.DS_INDEX.map((p) => {
            const t = p.t.toLowerCase()
            const score = t.startsWith(q) ? 3 : t.includes(q) ? 2 : (p.d + " " + p.s).toLowerCase().includes(q) ? 1 : 0
            return { p, score }
        })
            .filter((h) => h.score)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8)
        selected = 0
        results.innerHTML = hits.length
            ? hits.map((h, i) => `<a href="${prefix}${h.p.h}" aria-selected="${i === 0}"><strong>${h.p.t}</strong><span>${h.p.s} · ${h.p.d}</span></a>`).join("")
            : '<a aria-disabled="true"><span>No matches</span></a>'
        results.hidden = false
    }
    input.addEventListener("input", render)
    input.addEventListener("keydown", (ev) => {
        const links = [...results.querySelectorAll("a[href]")]
        if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
            ev.preventDefault()
            selected = (selected + (ev.key === "ArrowDown" ? 1 : -1) + links.length) % links.length
            links.forEach((a, i) => a.setAttribute("aria-selected", String(i === selected)))
        }
        if (ev.key === "Enter" && links[selected]) location.href = links[selected].href
        if (ev.key === "Escape") {
            input.value = ""
            results.hidden = true
            input.blur()
        }
    })
    input.addEventListener("blur", () => setTimeout(() => (results.hidden = true), 150))
    document.addEventListener("keydown", (ev) => {
        if ((ev.key === "k" && (ev.metaKey || ev.ctrlKey)) || (ev.key === "/" && !/input|textarea/i.test(document.activeElement.tagName))) {
            ev.preventDefault()
            input.focus()
            input.select()
        }
    })
})()
