const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const source = fs.readFileSync(process.env.DIVE_NAVIGATION_SOURCE || __dirname + "/dive-navigation.js", "utf8");

class Element {
    constructor(tag = "div", attrs = {}, children = []) {
        this.nodeType = 1; this.tagName = tag.toUpperCase(); this.attrs = { ...attrs };
        this.children = []; this.parentElement = null; this.hidden = false;
        this.style = { values: new Map(), setProperty(name, value) { this.values.set(name, value); }, removeProperty(name) { this.values.delete(name); } };
        children.forEach(child => this.appendChild(child));
    }
    appendChild(child) { this.children.push(child); child.parentElement = this; return child; }
    getAttribute(name) { return this.attrs[name] ?? null; }
    setAttribute(name, value) { this.attrs[name] = value; }
    removeAttribute(name) { delete this.attrs[name]; }
    hasAttribute(name) { return Object.hasOwn(this.attrs, name); }
    matches(selector) {
        return selector.split(",").some(part => {
            part = part.trim();
            if (part === "a[href]") return this.tagName === "A" && this.hasAttribute("href");
            if (part.startsWith(".")) return (this.attrs.class || "").split(" ").includes(part.slice(1));
            const attr = part.match(/^\[([^=\]]+)(?:=["']([^"']*)["'])?\]$/);
            return attr ? this.hasAttribute(attr[1]) && (attr[2] === undefined || this.attrs[attr[1]] === attr[2]) : this.tagName === part.toUpperCase();
        });
    }
    closest(selector) { for (let node = this; node; node = node.parentElement) if (node.matches(selector)) return node; return null; }
    querySelectorAll(selector) { return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]); }
}
const anchor = (href, attrs = {}) => new Element("a", { href, ...attrs });

function harness(path = "/dive", content = []) {
    const listeners = new Map(), assigned = [], observations = [], bodyClasses = new Set(), timers = [];
    const location = new URL("https://micahhoang.com" + path);
    location.assign = value => assigned.push(value);
    const head = new Element("head"), body = new Element("body", {}, content);
    body.classList = { contains(value) { return bodyClasses.has(value); } };
    const root = new Element("html", {}, [head, body]);
    const document = { readyState: "loading", documentElement: root, head, body,
        createElement(tag) { return new Element(tag); }, querySelectorAll(selector) { return root.querySelectorAll(selector); } };
    const window = { addEventListener(name, callback) { if (!listeners.has(name)) listeners.set(name, []); listeners.get(name).push(callback); } };
    const context = vm.createContext({ window, document, location, URL,
        setTimeout(callback, delay) { timers.push({ callback, delay }); },
        MutationObserver: class { constructor(callback) { this.callback = callback; } observe(target, options) { observations.push({ target, options, callback: this.callback }); } },
    });
    vm.runInContext(source, context);
    function fire(name, target, options = {}) {
        const event = { target, button: 0, defaultPrevented: false, stopped: false,
            preventDefault() { this.defaultPrevented = true; }, stopImmediatePropagation() { this.stopped = true; }, ...options };
        for (const callback of listeners.get(name) || []) callback(event);
        return event;
    }
    return { fire, assigned, observations, listeners, context, bodyClasses, location, document, timers,
        flushTimers() { while (timers.length) timers.shift().callback(); } };
}

test("ordinary pages and similar prefixes install no behavior or styles", () => {
    for (const path of ["/", "/about", "/case-studies/gaia", "/diver", "/dive-other"]) {
        const h = harness(path);
        assert.equal(h.listeners.size, 0); assert.equal(h.document.head.children.length, 0);
    }
});

test("the eight curated routes retain queries, hashes and relative native navigation", () => {
    const cases = [["/dive", "./about", "/dive/about"], ["/dive/about", "./", "/dive"],
        ["/dive/case-studies/airpods", "../../", "/dive"],
        ...["gaia", "airpods", "peak-energy", "motion-connect-2025", "simon-schuster", "national-park-cards"].map(slug => ["/dive", "/case-studies/" + slug + "?review=1#process", "/dive/case-studies/" + slug + "?review=1#process"]),
        ["/dive", "/dive/case-studies/gaia", "/dive/case-studies/gaia"]];
    for (const [path, href, expected] of cases) {
        const h = harness(path), a = anchor(href), event = h.fire("click", a);
        assert.equal(a.attrs.href, expected); assert.deepEqual(h.assigned, ["https://micahhoang.com" + expected]);
        assert.ok(event.defaultPrevented && event.stopped);
    }
});

test("Index, Play, hub and unselected or unknown study links cannot escape or hit removed clones", () => {
    for (const href of ["/index", "/play", "./index", "/case-studies", "/case-studies/yomo", "/case-studies/new-project", "/dive/index", "/dive/play", "/dive/case-studies/caliper"]) {
        const h = harness(), a = anchor(href), event = h.fire("click", a);
        assert.equal(a.hasAttribute("href"), false, href); assert.ok(a.hidden, href);
        assert.ok(event.defaultPrevented && event.stopped, href); assert.equal(h.assigned.length, 0);
    }
});

test("Home services become plain labels with no link, role, tab stop or navigation", () => {
    const a = anchor("/index#service=motion-design", { class: "selected-work-tag", role: "link", tabindex: "0", target: "_blank" });
    const h = harness("/dive", [a]); h.fire("load", null);
    for (const name of ["href", "role", "tabindex", "target"]) assert.equal(a.hasAttribute(name), false);
    assert.equal(a.getAttribute("data-mh-dive-label"), "true"); assert.equal(a.hidden, false);
    const event = h.fire("click", a); assert.ok(event.defaultPrevented && event.stopped); assert.equal(h.assigned.length, 0);
});

test("external URLs, protocols, assets and explicit downloads stay untouched", () => {
    for (const href of ["https://inflight.co/portfolio", "https://example.com/index", "https://example.com/case-studies/yomo", "mailto:micah.hoang@hey.com", "tel:123", "#process", "/resume.pdf"]) {
        const h = harness(), a = anchor(href), event = h.fire("click", a);
        assert.equal(a.attrs.href, href); assert.equal(event.stopped, false); assert.equal(h.assigned.length, 0);
    }
    const h = harness(), a = anchor("/index", { download: "" }); h.fire("click", a); assert.equal(a.attrs.href, "/index");
});

test("modified, middle and blank-target clicks retain native behavior on allowed review links", () => {
    for (const [type, options, attrs] of [["click", { metaKey: true }, {}], ["click", { ctrlKey: true }, {}], ["click", { shiftKey: true }, {}], ["auxclick", { button: 1 }, {}], ["click", {}, { target: "_blank" }]]) {
        const h = harness(), a = anchor("/case-studies/gaia", attrs), event = h.fire(type, a, options);
        assert.equal(a.attrs.href, "/dive/case-studies/gaia"); assert.equal(event.defaultPrevented, false); assert.equal(event.stopped, true); assert.equal(h.assigned.length, 0);
    }
    for (const type of ["contextmenu", "pointerdown", "pointerover", "focusin"]) {
        const h = harness(), a = anchor("/about"); h.fire(type, a); assert.equal(a.attrs.href, "/dive/about"); assert.equal(h.assigned.length, 0);
    }
});

test("excluded related columns collapse, and a wholly excluded section including its heading disappears", () => {
    const included = anchor("/case-studies/gaia"), excluded = anchor("/case-studies/yomo");
    const allowedCol = new Element("div", { class: "mh-next-projects-col" }, [included]);
    const blockedCol = new Element("div", { class: "mh-next-projects-col" }, [excluded]);
    const row = new Element("div", { class: "mh-next-projects-row" }, [allowedCol, blockedCol]);
    const section = new Element("section", { "data-framer-name": "Section Next Project" }, [new Element("h2"), row]);
    const h = harness("/dive/case-studies/airpods", [section]); h.fire("load", null);
    assert.equal(blockedCol.hidden, true); assert.equal(allowedCol.hidden, false); assert.equal(section.hidden, false);
    included.attrs.href = "/case-studies/caliper";
    h.observations[0].callback([{ addedNodes: [included] }]);
    assert.equal(section.hidden, true); assert.equal(section.style.values.get("display"), "none");
});

test("empty native navigation wrappers collapse without hiding sibling links", () => {
    const blocked = anchor("./play"), work = anchor("./");
    const wrapper = new Element("div", {}, [new Element("div", {}, [blocked])]);
    const nav = new Element("nav", {}, [work, wrapper]); const h = harness("/dive", [nav]); h.fire("load", null);
    assert.equal(wrapper.hidden, true); assert.equal(nav.hidden, false); assert.equal(work.attrs.href, "/dive");
});

test("WIP action returns to review home and same-document fragment navigation remains native", () => {
    const h = harness("/dive/case-studies/peak-energy"), a = anchor("/index", { class: "mh-wip-action" });
    h.fire("click", a); assert.equal(h.assigned[0], "https://micahhoang.com/dive"); assert.match(a.attrs["aria-label"], /review home/);
    const fragment = h.fire("click", anchor("/case-studies/peak-energy#process")); assert.equal(fragment.defaultPrevented, false); assert.equal(fragment.stopped, true);
});

test("Inflight picking, widget shadow events and previously handled clicks stay with their owner", () => {
    const h = harness(), a = anchor("/about"); h.bodyClasses.add("inflight-picking-cursor");
    for (const type of ["pointerover", "click", "contextmenu"]) { assert.equal(h.fire(type, a).stopped, false); assert.equal(a.attrs.href, "/about"); }
    h.bodyClasses.delete("inflight-picking-cursor");
    const host = new Element("div", { "data-inflight-widget-host": "" });
    assert.equal(h.fire("click", a, { composedPath() { return [a, host]; } }).stopped, false);
    assert.equal(h.fire("click", a, { defaultPrevented: true }).stopped, false);
    h.location.pathname = "/about"; assert.equal(h.fire("click", a).stopped, false); assert.equal(a.attrs.href, "/about");
});

test("Inflight clicks opt underlying media out of capture lightbox hit-testing without cancelling controls", () => {
    const media = new Element("img"), h = harness("/dive/case-studies/gaia", [media]);
    const host = new Element("div", { "data-inflight-widget-host": "" });
    const send = new Element("button");
    const event = h.fire("click", host, { composedPath() { return [send, host]; } });
    // The lightbox's subsequent document-capture handler uses this ancestor check.
    assert.equal(media.closest("[data-no-lightbox]"), h.document.body);
    assert.equal(event.defaultPrevented, false); assert.equal(event.stopped, false);
    assert.equal(h.timers.length, 1); assert.equal(h.timers[0].delay, 0);
    h.flushTimers(); assert.equal(media.closest("[data-no-lightbox]"), null);

    h.bodyClasses.add("inflight-picking-cursor");
    h.fire("click", media); assert.equal(media.closest("[data-no-lightbox]"), h.document.body);
    h.flushTimers(); h.bodyClasses.delete("inflight-picking-cursor");
    h.fire("click", media); assert.equal(media.closest("[data-no-lightbox]"), null);

    h.document.body.setAttribute("data-no-lightbox", "existing-owner");
    h.fire("click", host); h.flushTimers();
    assert.equal(h.document.body.getAttribute("data-no-lightbox"), "existing-owner");
    h.document.body.removeAttribute("data-no-lightbox");
    h.location.pathname = "/case-studies/gaia";
    h.fire("click", host); assert.equal(media.closest("[data-no-lightbox]"), null);
});

test("native controls and preserved external links over media keep their behavior without opening the lightbox", () => {
    const controls = [anchor("https://example.com/project"), new Element("button"), new Element("input"),
        new Element("select"), new Element("textarea"), new Element("label"),
        new Element("div", { role: "button" }), new Element("div", { role: "link" }),
        new Element("div", { contenteditable: "true" })];
    for (const control of controls) {
        const media = new Element("img"), icon = new Element("span");
        control.appendChild(icon);
        const h = harness("/dive/case-studies/gaia", [media, control]);
        const event = h.fire("click", icon);
        assert.equal(media.closest("[data-no-lightbox]"), h.document.body);
        assert.equal(event.defaultPrevented, false); assert.equal(event.stopped, false);
        assert.equal(h.assigned.length, 0);
        h.flushTimers();
        assert.equal(media.closest("[data-no-lightbox]"), null);
        h.fire("click", media); assert.equal(media.closest("[data-no-lightbox]"), null);
    }
    assert.equal(controls[0].getAttribute("href"), "https://example.com/project");
});

test("post-load observer watches child additions only, and duplicate installation is prevented", () => {
    const a = anchor("/about"), h = harness("/dive", [a]); assert.equal(a.attrs.href, "/about"); assert.equal(h.observations.length, 0);
    h.fire("load", null); assert.equal(a.attrs.href, "/dive/about");
    assert.deepEqual(JSON.parse(JSON.stringify(h.observations[0].options)), { childList: true, subtree: true });
    a.attrs.href = "/about"; h.fire("click", a); assert.equal(h.assigned[0], "https://micahhoang.com/dive/about");
    vm.runInContext(source, h.context); assert.equal(h.listeners.get("click").length, 1);
    assert.equal(source.includes("__mhGlobalLenisState"), false);
});

test("deployable head preserves bridge source and one exact scoped widget tag", () => {
    const head = fs.readFileSync(process.env.DIVE_HEAD_SOURCE || __dirname + "/dive-head.html", "utf8");
    const widget = '<script src="https://inflight.co/widget.js" data-org="aius9qpt" data-path="/dive" async></script>';
    const embedded = head.match(/<script id="mh-dive-navigation">([\s\S]*?)<\/script>/);
    assert.ok(embedded);
    assert.equal(embedded[1].trim(), source.trim());
    assert.ok(head.includes(widget));
    assert.equal((head.match(/https:\/\/inflight\.co\/widget\.js/g) || []).length, 1);
});
