/*
 * Micah Hoang components: behavior layer. Vanilla, no dependencies.
 * Everything is progressive enhancement keyed off classes / data attributes,
 * so the markup in content/components/*.md works with or without this file
 * (except the lightbox, loader and testimonial controls, which need it).
 *
 * In Framer these behaviors already exist as code components. See each
 * component doc's "Framer mapping" section before porting anything.
 */
;(() => {
    const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ms = (name) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0

    // ---- Reveal + line draw on viewport entry ----------------------------
    const io = new IntersectionObserver(
        (entries) => {
            for (const e of entries) {
                if (!e.isIntersecting) continue
                e.target.classList.add("is-in")
                io.unobserve(e.target)
            }
        },
        { rootMargin: "0px 0px -10% 0px" },
    )
    const observeReveals = (root = document) => root.querySelectorAll(".mh-reveal, .mh-rule[data-draw]").forEach((el) => io.observe(el))

    // ---- Filter group ----------------------------------------------------
    document.addEventListener("click", (ev) => {
        const item = ev.target.closest(".mh-filter__item")
        if (item) {
            item.setAttribute("aria-pressed", String(item.getAttribute("aria-pressed") !== "true"))
            syncFilter(item.closest(".mh-filter"))
            return
        }
        const clear = ev.target.closest(".mh-filter__clear")
        if (clear) {
            const filter = clear.closest(".mh-filter")
            filter.querySelectorAll('.mh-filter__item[aria-pressed="true"]').forEach((b) => b.setAttribute("aria-pressed", "false"))
            syncFilter(filter)
        }
    })
    function syncFilter(filter) {
        if (!filter) return
        const active = filter.querySelector('.mh-filter__item[aria-pressed="true"]')
        filter.toggleAttribute("data-active", Boolean(active))
        filter.dispatchEvent(new CustomEvent("mh:filter", { bubbles: true, detail: { values: [...filter.querySelectorAll('.mh-filter__item[aria-pressed="true"]')].map((b) => b.value || b.textContent.trim()) } }))
    }

    // ---- View toggle -----------------------------------------------------
    document.addEventListener("click", (ev) => {
        const btn = ev.target.closest(".mh-view-toggle button")
        if (!btn) return
        const group = btn.closest(".mh-view-toggle")
        group.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)))
        const target = group.dataset.target && document.querySelector(group.dataset.target)
        if (target) target.dataset.view = btn.value
    })

    // ---- Tag toggles (tags rendered as <button aria-pressed>) -------------
    document.addEventListener("click", (ev) => {
        const tag = ev.target.closest("button.mh-tag[aria-pressed]")
        if (tag) tag.setAttribute("aria-pressed", String(tag.getAttribute("aria-pressed") !== "true"))
    })

    // ---- Scroll to top ---------------------------------------------------
    document.addEventListener("click", (ev) => {
        const btn = ev.target.closest(".mh-scroll-top")
        if (!btn) return
        ev.preventDefault()
        const target = btn.dataset.target ? document.querySelector(btn.dataset.target) : null
        const scroller = target || document.scrollingElement
        const start = scroller.scrollTop
        if (reduceMotion() || !start) return void (scroller.scrollTop = 0)
        const duration = ms("--mh-duration-reveal") || 900
        const ease = (t) => 1 - Math.pow(1 - t, 4) // close to Snappy for a scroll curve
        const t0 = performance.now()
        const step = (now) => {
            const p = Math.min(1, (now - t0) / duration)
            scroller.scrollTop = start * (1 - ease(p))
            if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    })

    // ---- Testimonial -----------------------------------------------------
    document.querySelectorAll(".mh-testimonial[data-items]").forEach((el) => {
        let items
        try {
            items = JSON.parse(el.dataset.items)
        } catch {
            return
        }
        let i = 0
        const quote = el.querySelector(".mh-testimonial__quote")
        const name = el.querySelector(".mh-testimonial__name")
        const role = el.querySelector(".mh-testimonial__role")
        const show = (next) => {
            i = (next + items.length) % items.length
            el.setAttribute("data-changing", "")
            setTimeout(() => {
                quote.textContent = items[i].quote
                name.textContent = items[i].name
                role.textContent = items[i].role
                el.removeAttribute("data-changing")
            }, reduceMotion() ? 0 : ms("--mh-duration-base") * 0.6)
        }
        el.addEventListener("click", (ev) => {
            const dir = ev.target.closest("[data-dir]")?.dataset.dir
            if (dir === "prev") show(i - 1)
            if (dir === "next") show(i + 1)
        })
    })

    // ---- Lightbox --------------------------------------------------------
    let box
    function ensureLightbox() {
        if (box) return box
        box = document.createElement("div")
        box.className = "mh-lightbox"
        box.setAttribute("role", "dialog")
        box.setAttribute("aria-modal", "true")
        box.setAttribute("aria-label", "Image viewer")
        box.innerHTML =
            '<img class="mh-lightbox__media" alt="">' +
            '<button type="button" class="mh-lightbox__btn" data-dir="prev" aria-label="Previous">←</button>' +
            '<button type="button" class="mh-lightbox__btn" data-dir="next" aria-label="Next">→</button>' +
            '<button type="button" class="mh-lightbox__btn" data-dir="close" aria-label="Close">×</button>'
        document.body.appendChild(box)
        box.addEventListener("click", (ev) => {
            const dir = ev.target.closest("[data-dir]")?.dataset.dir
            if (dir === "close" || ev.target === box) return close()
            if (dir === "prev") return step(-1)
            if (dir === "next" || ev.target.classList.contains("mh-lightbox__media")) step(1)
        })
        document.addEventListener("keydown", (ev) => {
            if (!box.hasAttribute("data-open")) return
            if (ev.key === "Escape") close()
            if (ev.key === "ArrowLeft") step(-1)
            if (ev.key === "ArrowRight") step(1)
        })
        return box
    }
    let gallery = []
    let index = 0
    let returnFocus = null
    function open(imgs, i) {
        ensureLightbox()
        gallery = imgs
        returnFocus = document.activeElement
        render(i)
        box.setAttribute("data-open", "")
        document.documentElement.style.overflow = "hidden"
        box.querySelector('[data-dir="close"]').focus()
    }
    function render(i) {
        index = (i + gallery.length) % gallery.length
        const media = box.querySelector(".mh-lightbox__media")
        media.src = gallery[index].currentSrc || gallery[index].src
        media.alt = gallery[index].alt
    }
    function step(d) {
        render(index + d)
    }
    function close() {
        box.removeAttribute("data-open")
        document.documentElement.style.overflow = ""
        returnFocus?.focus?.()
    }
    document.addEventListener("click", (ev) => {
        const img = ev.target.closest("[data-mh-lightbox] img")
        if (!img) return
        ev.preventDefault()
        const imgs = [...img.closest("[data-mh-lightbox]").querySelectorAll("img")]
        open(imgs, imgs.indexOf(img))
    })

    // ---- Page loader -----------------------------------------------------
    // Sequence: bar fills (page duration) → identity fades → curtain lifts.
    window.mhPlayLoader = (el) => {
        if (!el) return
        el.dataset.state = "idle"
        void el.offsetWidth
        const page = reduceMotion() ? 0 : ms("--mh-duration-page") || 1200
        el.dataset.state = "loading"
        setTimeout(() => (el.dataset.state = "done"), page)
        setTimeout(() => (el.dataset.state = "lifted"), page + 300)
    }
    document.querySelectorAll(".mh-loader[data-autoplay]").forEach((el) => window.mhPlayLoader(el))

    // ---- Grain shimmer ---------------------------------------------------
    document.querySelectorAll('.mh-grain[data-animate] feTurbulence').forEach((turb) => {
        if (reduceMotion()) return
        const fps = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--mh-grain-shimmer-fps")) || 16
        let seed = 7
        setInterval(() => turb.setAttribute("seed", String((seed = (seed % 997) + 1))), 1000 / fps)
    })

    document.querySelectorAll(".mh-filter").forEach(syncFilter)
    observeReveals()
    window.mhObserveReveals = observeReveals
})()
