
(function () {
    "use strict";
    function isReviewPage() { return /^\/dive(?:\/|$)/.test(location.pathname); }
    if (!isReviewPage() || window.__mhDiveNavigationInstalled) return;
    window.__mhDiveNavigationInstalled = true;
    var prefix = "/dive";
    var routes = new Map([["/", prefix], ["/about", prefix + "/about"]]);
    var projects = ["gaia", "airpods", "peak-energy", "motion-connect-2025", "simon-schuster", "national-park-cards"];
    var inflightSelector = "[data-inflight-widget-host],[data-inflight-widget],[data-inflight-widget-toast],[data-inflight-picker-highlight],[data-inflight-picker-tooltip],[data-inflight-pin-marker]";
    function widgetOwnsEvent(event) {
        if (document.body && document.body.classList.contains("inflight-picking-cursor")) return true;
        var path = typeof event.composedPath === "function" ? event.composedPath() : [event.target];
        return path.some(function (node) { return node && node.nodeType === 1 && node.matches && node.matches(inflightSelector); });
    }
    function shieldInflightClick() {
        var body = document.body;
        if (!body || body.hasAttribute("data-no-lightbox")) return;
        body.setAttribute("data-no-lightbox", "");
        setTimeout(function () { body.removeAttribute("data-no-lightbox"); }, 0);
    }
    function normalizedPath(value) { return value.replace(/\/+$/, "") || "/"; }
    projects.forEach(function (slug) { var source = "/case-studies/" + slug; routes.set(source, prefix + source); });
    var reviewPaths = new Set(routes.values());
    function internalUrl(raw) {
        if (!raw || raw === "#" || raw.charAt(0) === "#") return null;
        var url;
        try { url = new URL(raw, location.href); } catch (_) { return null; }
        if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return null;
        if (/\.[a-z0-9]{1,8}$/i.test(url.pathname)) return null;
        return url;
    }
    function reviewUrl(raw) {
        var url = internalUrl(raw);
        if (!url) return null;
        var path = normalizedPath(url.pathname);
        var mapped = routes.get(path);
        if (!mapped && reviewPaths.has(path)) mapped = path;
        if (!mapped) return null;
        url.pathname = mapped;
        return url;
    }
    function elementTarget(event) {
        var target = event.target;
        return target && target.nodeType === 1 ? target : target && target.parentElement;
    }
    function removeLinkSemantics(anchor) {
        ["href", "role", "tabindex", "target", "aria-disabled"].forEach(function (name) { anchor.removeAttribute(name); });
    }
    function hideExcludedLink(anchor) {
        anchor.setAttribute("data-mh-dive-blocked", "true");
        removeLinkSemantics(anchor);
        var hidden = anchor.closest(".mh-next-projects-col") || anchor;
        if (hidden === anchor) {
            while (hidden.parentElement && hidden.parentElement.children.length === 1 && hidden.parentElement.tagName === "DIV") hidden = hidden.parentElement;
        }
        hidden.setAttribute("data-mh-dive-hidden", "true");
        hidden.hidden = true;
        hidden.style.setProperty("display", "none", "important");
    }
    function syncRelatedSections(root) {
        var rows = new Set(root.querySelectorAll(".mh-next-projects-row"));
        var ancestorRow = root.closest && root.closest(".mh-next-projects-row");
        if (ancestorRow) rows.add(ancestorRow);
        if (root.matches && root.matches(".mh-next-projects-row")) rows.add(root);
        rows.forEach(function (row) {
            var columns = Array.from(row.querySelectorAll(".mh-next-projects-col"));
            if (!columns.length) return;
            var section = row.closest('[data-framer-name="Section Next Project"],[data-framer-name="SectionNextProject"]') || row;
            var empty = columns.every(function (column) { return column.hasAttribute("data-mh-dive-hidden"); });
            if (empty) {
                section.setAttribute("data-mh-dive-hidden", "true");
                section.hidden = true;
                section.style.setProperty("display", "none", "important");
            } else if (section.hasAttribute("data-mh-dive-hidden")) {
                section.removeAttribute("data-mh-dive-hidden");
                section.hidden = false;
                section.style.removeProperty("display");
            }
        });
    }
    function prepareAnchor(anchor) {
        if (!isReviewPage() || !anchor || anchor.hasAttribute("download") || anchor.closest(inflightSelector)) return null;
        if (anchor.matches(".selected-work-tag")) {
            anchor.setAttribute("data-mh-dive-label", "true");
            removeLinkSemantics(anchor);
            return null;
        }
        var url = reviewUrl(anchor.getAttribute("href"));
        if (!url && internalUrl(anchor.getAttribute("href"))) {
            if (anchor.matches(".mh-wip-action")) {
                url = new URL(prefix, location.origin);
                anchor.setAttribute("aria-label", "Work in Progress. Return to review home");
            } else { hideExcludedLink(anchor); return null; }
        }
        if (!url) return null;
        var href = url.pathname + url.search + url.hash;
        if (anchor.getAttribute("href") !== href) anchor.setAttribute("href", href);
        return url;
    }
    function prepareEvent(event) {
        if (!isReviewPage() || widgetOwnsEvent(event)) return;
        var target = elementTarget(event);
        if (target && target.closest) prepareAnchor(target.closest("a[href]"));
    }
    function consume(event) { event.preventDefault(); event.stopImmediatePropagation(); }
    function onNavigate(event) {
        if (!isReviewPage()) return;
        if (widgetOwnsEvent(event)) { shieldInflightClick(); return; }
        if (event.defaultPrevented) return;
        var target = elementTarget(event);
        if (!target || !target.closest) return;
        var interactive = target.closest('a[href],button,input,select,textarea,label,[role="button"],[role="link"],[contenteditable="true"]');
        if (interactive) shieldInflightClick();
        if (target.closest(".selected-work-tag,[data-mh-dive-label],[data-mh-dive-blocked]")) { consume(event); return; }
        var anchor = target.closest("a[href]");
        if (anchor) {
            var url = prepareAnchor(anchor);
            if (!url) { if (anchor.hasAttribute("data-mh-dive-blocked")) consume(event); return; }
            var newContext = anchor.getAttribute("target");
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (newContext && newContext !== "_self")) { event.stopImmediatePropagation(); return; }
            if (url.pathname === normalizedPath(location.pathname) && url.search === location.search && url.hash) { event.stopImmediatePropagation(); return; }
            consume(event);
            location.assign(url.href);
        }
    }
    function scan(root) {
        if (!isReviewPage() || !root || !root.querySelectorAll) return;
        if (root.matches && root.matches("a[href]")) prepareAnchor(root);
        root.querySelectorAll("a[href]").forEach(prepareAnchor);
        syncRelatedSections(root);
    }
    function watchRenderedLinks() {
        scan(document);
        var observer = new MutationObserver(function (records) { records.forEach(function (record) { record.addedNodes.forEach(scan); }); });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }
    function installReviewStyles() {
        var style = document.createElement("style");
        style.id = "mh-dive-curation";
        var hiddenLinks = [];
        ["/index", "/play", "/case-studies", "/dive/index", "/dive/play", "/dive/case-studies"].forEach(function (path) {
            var variants = [path];
            if (path.indexOf("/dive/") !== 0) { ["./", "../", "../../", "../../../"].forEach(function (base) { variants.push(base + path.slice(1)); }); }
            variants.forEach(function (href) { hiddenLinks.push('a[href="' + href + '"]:not(.selected-work-tag):not(.mh-wip-action)'); });
        });
        style.textContent = hiddenLinks.join(",") + ",[data-mh-dive-hidden]{display:none!important;}" + ".selected-work-tag,[data-mh-dive-label]{cursor:default!important;pointer-events:none!important;}";
        document.head.appendChild(style);
    }
    ["pointerover", "pointerdown", "focusin", "contextmenu"].forEach(function (name) { window.addEventListener(name, prepareEvent, true); });
    window.addEventListener("click", onNavigate, true);
    window.addEventListener("auxclick", function (event) { if (event.button === 1) onNavigate(event); }, true);
    installReviewStyles();
    if (document.readyState === "complete") watchRenderedLinks();
    else window.addEventListener("load", watchRenderedLinks, { once: true });
})();
