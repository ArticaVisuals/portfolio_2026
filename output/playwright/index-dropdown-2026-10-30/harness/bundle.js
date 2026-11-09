var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// output/playwright/index-dropdown-2026-10-30/harness/framer.ts
var addPropertyControls, ControlType, RenderTarget;
var init_framer = __esm({
  "output/playwright/index-dropdown-2026-10-30/harness/framer.ts"() {
    addPropertyControls = () => {
    };
    ControlType = new Proxy({}, { get: (_, key) => key });
    RenderTarget = { canvas: "canvas", thumbnail: "thumbnail", current: () => "preview" };
  }
});

// output/playwright/index-dropdown-2026-10-30/harness/IndexPage.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
function preventHiddenCMSLinkClick(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (!target.closest(`[${HIDDEN_CMS_LINK_INERT_ATTR}="true"]`)) return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
}
function inertHiddenCMSLinks() {
  if (typeof document === "undefined") return 0;
  let count = 0;
  document.querySelectorAll(HIDDEN_CMS_LINK_SELECTOR).forEach((container) => {
    container.setAttribute("aria-hidden", "true");
    container.querySelectorAll(HIDDEN_CMS_MEDIA_SELECTOR).forEach((element) => {
      if (element instanceof HTMLVideoElement) {
        const hasAttachedSource = element.hasAttribute("src") || element.hasAttribute("poster") || Boolean(element.querySelector("source[src]"));
        if (hasAttachedSource) {
          element.pause();
          element.setAttribute("preload", "none");
          element.removeAttribute("src");
          element.removeAttribute("poster");
          element.querySelectorAll("source").forEach((source) => source.removeAttribute("src"));
          element.load();
        }
      } else {
        element.removeAttribute("src");
        element.removeAttribute("srcset");
      }
      element.setAttribute(HIDDEN_CMS_MEDIA_INERT_ATTR, "true");
    });
    container.querySelectorAll(HIDDEN_CMS_INTERACTIVE_SELECTOR).forEach((element) => {
      if (element.getAttribute(HIDDEN_CMS_LINK_INERT_ATTR) !== "true") {
        element.addEventListener("click", preventHiddenCMSLinkClick, true);
      }
      element.setAttribute("tabindex", "-1");
      element.setAttribute("aria-hidden", "true");
      element.setAttribute(HIDDEN_CMS_LINK_INERT_ATTR, "true");
      count += 1;
    });
  });
  return count;
}
function useHiddenCMSLinkInerting(enabled) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    let frame = 0;
    const timeouts = [];
    const run = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(inertHiddenCMSLinks);
    };
    run();
    [100, 350, 900, 1800, 3200].forEach((delay) => {
      timeouts.push(window.setTimeout(run, delay));
    });
    const observer = new MutationObserver(run);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: [
        "href",
        "role",
        "tabindex",
        "data-framer-name",
        "name",
        "poster",
        "preload",
        "src",
        "srcset"
      ],
      childList: true,
      subtree: true
    });
    return () => {
      window.cancelAnimationFrame(frame);
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
      observer.disconnect();
    };
  }, [enabled]);
}
function getDisciplines(p) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const raw of [p.category1, p.category2, p.category3]) {
    if (typeof raw !== "string") continue;
    const value = raw.trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}
function normalizeProjectDisciplines(p) {
  const [category1 = "", category2 = "", category3 = ""] = getDisciplines(p);
  if (p.category1 === category1 && (p.category2 ?? "") === category2 && (p.category3 ?? "") === category3) {
    return p;
  }
  return { ...p, category1, category2, category3 };
}
function getDisciplineDisplay(p) {
  return getDisciplines(p).join(", ");
}
function sortProjectsByDisplayOrder(projects) {
  return [...projects].sort((a, b) => {
    const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder || a.title.localeCompare(b.title);
  });
}
function getTaxonomyNavItems(projects) {
  const disciplineItems = [];
  const industryItems = [];
  const seenDisciplines = /* @__PURE__ */ new Set();
  const seenIndustries = /* @__PURE__ */ new Set();
  for (const p of sortProjectsByDisplayOrder(projects)) {
    for (const raw of getDisciplines(p)) {
      const value = raw.trim();
      if (!value || seenDisciplines.has(value)) continue;
      seenDisciplines.add(value);
      disciplineItems.push(value);
    }
    const industry = String(p.industry ?? "").trim();
    if (industry && !seenIndustries.has(industry)) {
      seenIndustries.add(industry);
      industryItems.push(industry);
    }
  }
  return {
    disciplines: sortTaxonomyLabels(disciplineItems),
    industries: sortTaxonomyLabels(industryItems),
    years: getYearNavItems(projects)
  };
}
function getYearNavItems(projects) {
  const seen = /* @__PURE__ */ new Set();
  for (const p of projects) {
    const y = normalizeYear(p.year);
    if (y > 0) seen.add(y);
  }
  return Array.from(seen).sort((a, b) => b - a);
}
function sortTaxonomyLabels(items) {
  return [...items].sort(
    (a, b) => a.localeCompare(b, void 0, {
      numeric: true,
      sensitivity: "base"
    })
  );
}
function getCaseStudyUrl(p) {
  return p.slug ? `/case-studies/${p.slug}` : "";
}
function getThumbnailVideoLink(project) {
  return normalizeIndexMediaSource(project.thumbnailVideoLink);
}
function isLoopingImageMediaSource(source) {
  const cleanSource = source.split(/[?#]/)[0]?.toLowerCase() || "";
  return /\.(gif|webp|apng)$/.test(cleanSource);
}
function normalizeYear(raw) {
  if (raw === null || raw === void 0) return 0;
  if (typeof raw === "number") {
    return Number.isFinite(raw) && raw > 1900 ? Math.floor(raw) : 0;
  }
  if (typeof raw === "object") {
    if (raw instanceof Date) {
      const y = raw.getFullYear();
      return Number.isFinite(y) && y > 1900 ? y : 0;
    }
    const r = raw;
    if ("value" in r) return normalizeYear(r.value);
    if ("year" in r) return normalizeYear(r.year);
    return 0;
  }
  const str = String(raw).trim();
  if (!str) return 0;
  const direct = Number(str);
  if (Number.isFinite(direct) && direct > 1900) return Math.floor(direct);
  const match = str.match(/(?:19|20)\d{2}/);
  return match ? Number(match[0]) : 0;
}
function normalizeThumbnailUrl(raw) {
  if (!raw) return void 0;
  if (typeof raw === "string") return raw || void 0;
  if (typeof raw === "object") {
    const r = raw;
    if (typeof r.src === "string") return r.src || void 0;
    if (typeof r.url === "string") return r.url || void 0;
  }
  return void 0;
}
function normalizeMediaSource(raw) {
  if (!raw) return "";
  if (typeof raw === "string") return raw.trim();
  if (Array.isArray(raw)) {
    return raw.map(normalizeMediaSource).find(Boolean) || "";
  }
  if (typeof raw === "object") {
    const record = raw;
    if ("value" in record) return normalizeMediaSource(record.value);
    for (const key of ["src", "url", "href", "file"]) {
      const source = normalizeMediaSource(record[key]);
      if (source) return source;
    }
  }
  return "";
}
function normalizeIndexMediaSource(raw) {
  return normalizeMediaSource(raw);
}
function normalizeIndexThumbnailUrl(raw) {
  return normalizeMediaSource(raw) || normalizeThumbnailUrl(raw) || "";
}
function splitFieldIds(value) {
  return String(value || "").split(/[\n,]/).map((fieldId) => fieldId.trim()).filter(Boolean);
}
function readFirstCMSMediaField(data, fieldIds) {
  for (const fieldId of splitFieldIds(fieldIds)) {
    const source = normalizeIndexMediaSource(readCMSField(data, fieldId));
    if (source) return source;
  }
  return "";
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function uniqueStrings(values) {
  return Array.from(new Set(values.filter(Boolean)));
}
function readCMSField(data, fieldId) {
  const field = data?.[fieldId];
  if (field && typeof field === "object" && "value" in field) {
    return field.value;
  }
  return field;
}
function normalizeCMSText(value) {
  return String(value ?? "").trim();
}
function normalizeCMSNumber(value) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function normalizeCMSBoolean(value) {
  if (value && typeof value === "object" && "value" in value) {
    return normalizeCMSBoolean(value.value);
  }
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (!normalized || normalized === "false" || normalized === "0") return false;
    return true;
  }
  return Boolean(value);
}
function isCMSModuleUrl(url, collectionId) {
  const collectionPattern = escapeRegExp(collectionId);
  return new RegExp(
    `/${collectionPattern}(?:\\.[^/?#]+)?\\.(?:js|mjs)(?:[?#].*)?$`
  ).test(url);
}
function findCMSModuleUrlInMarkup(markup, collectionId) {
  const collectionPattern = escapeRegExp(collectionId);
  const match = markup.match(
    new RegExp(
      `https://framerusercontent\\.com/(?:sites|modules)/[^"']+/${collectionPattern}(?:\\.[^"'/]+)?\\.(?:js|mjs)`,
      "i"
    )
  );
  return match?.[0];
}
function getDocumentResourceUrls() {
  if (typeof document === "undefined") return [];
  const elementUrls = Array.from(
    document.querySelectorAll("link[href], script[src], img[src], source[src]")
  ).map((element) => {
    if ("href" in element && element.href) return element.href;
    if ("src" in element && element.src) return element.src;
    return "";
  });
  const performanceUrls = typeof performance !== "undefined" && typeof performance.getEntriesByType === "function" ? performance.getEntriesByType("resource").map((entry) => entry.name) : [];
  return uniqueStrings([...elementUrls, ...performanceUrls]);
}
function findCMSModuleUrlInDocument(collectionId) {
  const fromResources = getDocumentResourceUrls().find(
    (url) => isCMSModuleUrl(url, collectionId)
  );
  if (fromResources) return fromResources;
  if (typeof document !== "undefined" && document.documentElement) {
    return findCMSModuleUrlInMarkup(
      document.documentElement.outerHTML,
      collectionId
    );
  }
  return void 0;
}
function getCurrentDocumentPath() {
  if (typeof window === "undefined" || !window.location) return "";
  return window.location.pathname || "";
}
async function findCMSModuleUrlByFetchingPaths(paths, collectionId) {
  for (const path of paths) {
    if (!path) continue;
    try {
      const response = await fetch(path, {
        credentials: "same-origin",
        cache: "no-store"
      });
      if (!response.ok) continue;
      const html = await response.text();
      const found = findCMSModuleUrlInMarkup(html, collectionId);
      if (found) return found;
    } catch {
    }
  }
  return void 0;
}
async function resolveCMSModuleUrl(collectionId, preferredModuleUrl) {
  const preferred = normalizeCMSText(preferredModuleUrl);
  if (preferred) return preferred;
  const cached = cmsModuleUrlCache.get(collectionId);
  if (cached) return cached;
  const fromLiveMarkup = await findCMSModuleUrlByFetchingPaths(
    uniqueStrings([getCurrentDocumentPath(), ...INDEX_CMS_LIVE_SCAN_PATHS]),
    collectionId
  );
  if (fromLiveMarkup) {
    cmsModuleUrlCache.set(collectionId, fromLiveMarkup);
    return fromLiveMarkup;
  }
  const inDocument = findCMSModuleUrlInDocument(collectionId);
  if (inDocument) {
    cmsModuleUrlCache.set(collectionId, inDocument);
    return inDocument;
  }
  return void 0;
}
function initializeCMSModule(module) {
  const candidates = [module.t, module.r, module.default, ...Object.values(module)];
  candidates.forEach((candidate) => {
    try {
      if (typeof candidate === "function") candidate();
    } catch {
    }
  });
}
function isCMSCollectionExport(value) {
  const collection = value?.collectionByLocaleId?.default;
  return !!collection && typeof collection.scanItems === "function";
}
function getCMSCollection(module) {
  const candidates = [module.a, module.r, module.default, ...Object.values(module)];
  for (const candidate of candidates) {
    let resolved = candidate;
    if (typeof resolved === "function") {
      try {
        resolved = resolved();
      } catch {
        resolved = void 0;
      }
    }
    if (isCMSCollectionExport(resolved)) {
      return resolved.collectionByLocaleId?.default;
    }
  }
  return void 0;
}
function cmsItemToProject(item, thumbnailVideoFieldIds) {
  const data = item.data;
  const fields = INDEX_CMS_FIELD_IDS;
  const title = normalizeCMSText(readCMSField(data, fields.title));
  if (!title) return null;
  const slug = normalizeCMSText(readCMSField(data, fields.slug)) || normalizeCMSText(item.slug);
  return {
    title,
    slug,
    sortOrder: normalizeCMSNumber(readCMSField(data, fields.sortOrder)),
    category1: normalizeCMSText(readCMSField(data, fields.category1)),
    category2: normalizeCMSText(readCMSField(data, fields.category2)),
    category3: normalizeCMSText(readCMSField(data, fields.category3)),
    industry: normalizeCMSText(readCMSField(data, fields.industry)),
    year: normalizeCMSText(readCMSField(data, fields.year)),
    thumbnail: normalizeIndexThumbnailUrl(readCMSField(data, fields.thumbnail)),
    thumbnailVideoLink: readFirstCMSMediaField(data, thumbnailVideoFieldIds),
    thumbnailStroke: normalizeCMSBoolean(readCMSField(data, fields.thumbnailStroke)),
    isHomepage: Boolean(readCMSField(data, fields.isHomepage))
  };
}
async function loadCMSProjects(preferredModuleUrl, thumbnailVideoFieldIds = DEFAULT_THUMBNAIL_VIDEO_FIELD_IDS) {
  const moduleUrl = await resolveCMSModuleUrl(
    INDEX_CMS_COLLECTION_ID,
    preferredModuleUrl
  );
  if (!moduleUrl) return [];
  const module = await import(
    /* @vite-ignore */
    moduleUrl
  );
  initializeCMSModule(module);
  const collection = getCMSCollection(module);
  if (typeof collection?.scanItems !== "function") return [];
  const items = await collection.scanItems();
  return items.map((item) => cmsItemToProject(item, thumbnailVideoFieldIds)).filter((project) => Boolean(project));
}
function groupByYear(projects) {
  const map = /* @__PURE__ */ new Map();
  for (const p of projects) {
    const year = normalizeYear(p.year);
    const bucket = map.get(year);
    if (bucket) bucket.push(p);
    else map.set(year, [p]);
  }
  return Array.from(map.entries()).sort(([a], [b]) => {
    if (a === 0) return 1;
    if (b === 0) return -1;
    return b - a;
  }).map(([year, items]) => ({
    year,
    items: [...items].sort((a, b) => a.title.localeCompare(b.title))
  }));
}
function filterProjects(projects, filters, query) {
  const normalizedQuery = query.trim().toLowerCase();
  const hasDisciplineFilters = filters.disciplines.length > 0;
  const hasIndustryFilters = filters.industries.length > 0;
  const hasYearFilters = filters.years.length > 0;
  if (!hasDisciplineFilters && !hasIndustryFilters && !hasYearFilters && !normalizedQuery) {
    return projects;
  }
  const disciplineFilters = hasDisciplineFilters ? new Set(filters.disciplines) : null;
  const industryFilters = hasIndustryFilters ? new Set(filters.industries) : null;
  const yearFilters = hasYearFilters ? new Set(filters.years) : null;
  return projects.filter((p) => {
    const pDisciplines = getDisciplines(p);
    const matchDiscipline = !disciplineFilters || filters.disciplines.every((d) => pDisciplines.includes(d));
    const matchIndustry = !industryFilters || industryFilters.has(p.industry);
    const matchYear = !yearFilters || yearFilters.has(normalizeYear(p.year));
    const matchSearch = !normalizedQuery || p.title.toLowerCase().includes(normalizedQuery);
    return matchDiscipline && matchIndustry && matchYear && matchSearch;
  });
}
function toggleFilterValue(items, value) {
  return items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
}
function slugifyTaxonomyValue(value) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function readUrlFilterParams() {
  try {
    if (typeof window === "undefined") return null;
    const hash = String(window.location.hash || "").replace(/^#/, "");
    const raw = hash.includes("=") ? hash : String(window.location.search || "").replace(/^\?/, "");
    if (!raw) return null;
    return new URLSearchParams(raw);
  } catch {
    return null;
  }
}
function parseUrlFilterSelection() {
  try {
    const params = readUrlFilterParams();
    if (!params) return null;
    const readKey = (key) => String(params.get(key) ?? "").split(",").map((part) => part.trim()).filter(Boolean);
    const selection = {
      disciplines: readKey(URL_FILTER_KEYS.disciplines),
      industries: readKey(URL_FILTER_KEYS.industries),
      years: readKey(URL_FILTER_KEYS.years)
    };
    if (selection.disciplines.length === 0 && selection.industries.length === 0 && selection.years.length === 0) {
      return null;
    }
    return selection;
  } catch {
    return null;
  }
}
function resolveTaxonomySlugs(slugs, labels) {
  const bySlug = /* @__PURE__ */ new Map();
  for (const label of labels) {
    const slug = slugifyTaxonomyValue(label);
    if (slug && !bySlug.has(slug)) bySlug.set(slug, label);
  }
  const resolved = [];
  for (const raw of slugs) {
    const label = bySlug.get(slugifyTaxonomyValue(raw));
    if (label && !resolved.includes(label)) resolved.push(label);
  }
  return resolved;
}
function resolveTaxonomyYears(slugs, years) {
  const available = new Set(years);
  const resolved = [];
  for (const raw of slugs) {
    const year = Number.parseInt(String(raw).trim(), 10);
    if (!Number.isFinite(year)) continue;
    if (!available.has(year) || resolved.includes(year)) continue;
    resolved.push(year);
  }
  return resolved;
}
function serializeFiltersToQuery(filters) {
  const parts = [];
  const pushValues = (key, values) => {
    if (values.length === 0) return;
    parts.push(`${key}=${values.join(",")}`);
  };
  pushValues(
    URL_FILTER_KEYS.disciplines,
    filters.disciplines.map(slugifyTaxonomyValue).filter(Boolean)
  );
  pushValues(
    URL_FILTER_KEYS.industries,
    filters.industries.map(slugifyTaxonomyValue).filter(Boolean)
  );
  pushValues(
    URL_FILTER_KEYS.years,
    filters.years.map((year) => String(year)).filter(Boolean)
  );
  return parts.join("&");
}
function writeFiltersToUrl(filters) {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.history?.replaceState !== "function") return;
    const query = serializeFiltersToQuery(filters);
    const next = `${window.location.pathname}${query ? `?${query}` : ""}`;
    const current = `${window.location.pathname}${window.location.search}`;
    if (next === current && !window.location.hash) return;
    window.history.replaceState(window.history.state, "", next);
  } catch {
  }
}
function urlFilterSyncEnabled() {
  if (!ENABLE_URL_FILTER_SYNC) return false;
  try {
    return RenderTarget.current() !== RenderTarget.canvas;
  } catch {
    return true;
  }
}
function shouldProgressivelyMountIndexContent() {
  if (typeof window === "undefined") return true;
  try {
    return RenderTarget.current() !== RenderTarget.canvas;
  } catch {
    return true;
  }
}
function prefersReducedIndexMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}
function indexViewTransitionActive() {
  try {
    return typeof document !== "undefined" && document.documentElement.matches(":active-view-transition");
  } catch (error) {
    return false;
  }
}
function getIndexStaggerIndex(index) {
  return Math.max(0, Math.min(index, INDEX_APPEAR_PRESET.maxStaggerIndex));
}
function getIndexMaskRevealDelayMs(index) {
  return INDEX_MASK_REVEAL_PRESET.baseDelayMs + getIndexStaggerIndex(index) * INDEX_MASK_REVEAL_PRESET.staggerMs;
}
function getIndexFadeDelayMs(index) {
  return getIndexStaggerIndex(index) * INDEX_APPEAR_PRESET.staggerMs;
}
function getIndexNavFadeDelayMs(rowIndex, columnIndex = 0) {
  const row = Math.max(
    0,
    Math.min(rowIndex, INDEX_NAV_FADE_PRESET.maxRowIndex)
  );
  const column = Math.max(0, columnIndex);
  return INDEX_NAV_FADE_PRESET.baseDelayMs + row * INDEX_NAV_FADE_PRESET.rowStaggerMs + column * INDEX_NAV_FADE_PRESET.columnStaggerMs;
}
function getIndexContentRevealDelayMs(rowIndex, columnIndex = 0) {
  const row = Math.max(
    0,
    Math.min(rowIndex, INDEX_CONTENT_REVEAL_PRESET.maxRowIndex)
  );
  const column = Math.max(0, columnIndex);
  return INDEX_CONTENT_REVEAL_PRESET.baseDelayMs + row * INDEX_CONTENT_REVEAL_PRESET.rowStaggerMs + column * INDEX_CONTENT_REVEAL_PRESET.columnStaggerMs;
}
function getIndexMediaFadeDelayMs(index) {
  return INDEX_MEDIA_FADE_PRESET.baseDelayMs + Math.max(
    0,
    Math.min(index, INDEX_MEDIA_FADE_PRESET.maxItemIndex)
  ) * INDEX_MEDIA_FADE_PRESET.itemStaggerMs;
}
function useIndexAppearTrigger() {
  const ref = useRef(null);
  const [appeared, setAppeared] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") return;
    const shouldReduce = prefersReducedIndexMotion();
    if (shouldReduce || !("IntersectionObserver" in window)) {
      setAppeared(true);
      return;
    }
    let firstFrame = 0;
    let secondFrame = 0;
    let transitionPoll = 0;
    let pageRevealTimer = 0;
    let revealed = false;
    let waitingForTransition = false;
    let waitingRequiresVisible = true;
    let observer = null;
    const isVisible = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      return rect.bottom >= 0 && rect.top <= viewportHeight;
    };
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      waitingForTransition = false;
      window.clearTimeout(transitionPoll);
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      observer?.disconnect();
      setAppeared(false);
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          setAppeared(true);
        });
      });
    };
    const waitForTransitionThenReveal = (requireVisible) => {
      if (revealed) return;
      if (waitingForTransition) {
        waitingRequiresVisible = waitingRequiresVisible && requireVisible;
        return;
      }
      waitingForTransition = true;
      waitingRequiresVisible = requireVisible;
      const poll = () => {
        if (revealed) return;
        if (indexViewTransitionActive()) {
          transitionPoll = window.setTimeout(poll, 50);
          return;
        }
        const shouldRequireVisible = waitingRequiresVisible;
        waitingForTransition = false;
        if (!shouldRequireVisible || isVisible()) reveal();
      };
      transitionPoll = window.setTimeout(poll, 50);
    };
    const revealIfVisible = () => {
      if (revealed || !isVisible()) return;
      if (indexViewTransitionActive()) {
        waitForTransitionThenReveal(true);
        return;
      }
      observer?.disconnect();
      reveal();
    };
    const revealForPageTransition = () => {
      if (revealed) return;
      window.clearTimeout(pageRevealTimer);
      observer?.disconnect();
      reveal();
    };
    const revealForPageFallback = () => {
      if (revealed) return;
      observer?.disconnect();
      if (indexViewTransitionActive()) {
        waitForTransitionThenReveal(false);
        return;
      }
      reveal();
    };
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        revealIfVisible();
      },
      {
        rootMargin: INDEX_APPEAR_PRESET.rootMargin,
        threshold: INDEX_APPEAR_PRESET.threshold
      }
    );
    observer.observe(element);
    window.addEventListener("pt:reveal", revealForPageTransition);
    pageRevealTimer = window.setTimeout(revealForPageFallback, 220);
    const recentPageRevealAt = Number(window.__ptRevealedAt || 0);
    const recentPageRevealPath = String(
      window.__ptRevealedPath || ""
    );
    if (recentPageRevealPath === window.location.pathname && recentPageRevealAt > 0 && Date.now() - recentPageRevealAt < 2e3) {
      revealForPageTransition();
    }
    return () => {
      window.clearTimeout(transitionPoll);
      window.clearTimeout(pageRevealTimer);
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      observer?.disconnect();
      window.removeEventListener("pt:reveal", revealForPageTransition);
    };
  }, []);
  return { ref, appeared };
}
function buildGlobalCss() {
  return `
  ${HIDDEN_CMS_LINK_SELECTOR} {
    position: fixed !important;
    left: -10000px !important;
    top: 0 !important;
    width: 1px !important;
    height: 1px !important;
    max-width: 1px !important;
    max-height: 1px !important;
    opacity: 0 !important;
    overflow: hidden !important;
    pointer-events: none !important;
    visibility: hidden !important;
    clip-path: inset(50%) !important;
  }

  ${HIDDEN_CMS_LINK_SELECTOR} * {
    pointer-events: none !important;
  }

  .idx-fade-appear {
    display: inline-block;
    max-width: 100%;
    opacity: 0;
    will-change: opacity;
  }

  .idx-fade-appear-block {
    display: block;
    width: 100%;
  }

  .idx-fade-appear[data-idx-appeared="true"] {
    opacity: 1;
  }

  .idx-mask-appear {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    vertical-align: top;
    line-height: inherit;
  }

  .idx-mask-appear-block {
    display: block;
    width: 100%;
  }

  .idx-mask-reveal-text {
    display: inline-block;
    max-width: 100%;
    transform: translate3d(0, var(--idx-mask-distance, ${INDEX_MASK_REVEAL_PRESET.distancePx}px), 0);
    will-change: transform;
    line-height: inherit;
    color: inherit;
    -webkit-text-fill-color: inherit;
    text-decoration: inherit;
    text-underline-offset: inherit;
    text-transform: inherit;
  }

  .idx-mask-appear-block > .idx-mask-reveal-text {
    display: block;
    width: 100%;
  }

  .idx-mask-appear[data-idx-appeared="true"] > .idx-mask-reveal-text {
    transform: translate3d(0, 0, 0);
  }

  .idx-rule {
    transform: scaleX(0);
    transform-origin: left center;
    will-change: transform;
  }

  .idx-rule[data-idx-appeared="true"] {
    transform: scaleX(1);
  }

  .idx-tax-item {
    cursor: pointer;
    transition: opacity 150ms ${SMOOTH_EASE};
    user-select: none;
  }
  .idx-tax-item:hover { opacity: 0.55; }
  .idx-tax-item:focus-visible {
    outline: 1px solid ${tokens.textPrimary};
    outline-offset: 3px;
  }

  .idx-tax-item[aria-pressed="true"] .idx-mask-reveal-text,
  .idx-tax-item[aria-pressed="true"] .idx-fade-appear,
  .idx-clear-filters .idx-mask-reveal-text,
  .idx-clear-filters .idx-fade-appear,
  .idx-view-toggle-option[data-active="true"] .idx-mask-reveal-text,
  .idx-view-toggle-option[data-active="true"] .idx-fade-appear {
    text-decoration: underline;
    text-underline-offset: 3px;
  }


  .idx-list-row {
    transition: background 150ms ${SMOOTH_EASE};
    border-radius: 2px;
  }
  .idx-hover-highlight .idx-list-row:hover { background: rgba(20, 20, 20, 0.035); }

  .idx-flip-text {
    display: block;
    width: 100%;
    min-width: 0;
    height: var(--idx-flip-height);
    line-height: var(--idx-flip-height);
    overflow: hidden;
    color: inherit;
  }
  .idx-flip-track {
    display: flex;
    flex-direction: column;
    gap: 5px;
    transform: translateY(0);
    transition: transform 620ms cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform;
  }
  .idx-flip-copy {
    display: block;
    flex: 0 0 var(--idx-flip-height);
    height: var(--idx-flip-height);
    line-height: var(--idx-flip-height);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .idx-hover-flip .idx-list-row:hover .idx-flip-track,
  .idx-hover-flip .idx-list-row:focus-visible .idx-flip-track {
    transform: translateY(calc((var(--idx-flip-height) + 5px) * -1));
  }

  .idx-rule,
  .idx-row-divider,
  .idx-year-rule,
  .idx-grid-top-rule,
  .idx-list-bottom-rule {
    background-color: ${tokens.dividerSubtle} !important;
    border-color: ${tokens.dividerSubtle} !important;
    opacity: 1 !important;
  }

  .idx-view-toggle {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    gap: 8px;
    width: 100%;
    margin: -46px 0 24px;
    font-family: ${tokens.fontMono};
    font-size: 13px;
    font-weight: 400;
    line-height: 28px;
    text-transform: uppercase;
    letter-spacing: 0;
    color: ${tokens.textPrimary} !important;
    -webkit-text-fill-color: ${tokens.textPrimary} !important;
    opacity: 1 !important;
  }

  .idx-taxonomy-shell + .idx-tax-item {
    display: block;
    margin-top: 12px !important;
    line-height: 28px !important;
  }

  .idx-view-toggle-option {
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    font: inherit;
    line-height: inherit;
    text-transform: inherit;
    letter-spacing: inherit;
    color: ${tokens.textPrimary} !important;
    -webkit-text-fill-color: ${tokens.textPrimary} !important;
    cursor: pointer;
    text-decoration: none;
    text-underline-offset: 3px;
    transition:
      color 150ms ${SMOOTH_EASE},
      -webkit-text-fill-color 150ms ${SMOOTH_EASE};
  }

  .idx-view-toggle-option[data-active="true"] {
    text-decoration: underline;
    color: ${tokens.textPrimary} !important;
    -webkit-text-fill-color: ${tokens.textPrimary} !important;
    opacity: 1 !important;
  }

  .idx-view-toggle-option:hover {
    color: ${tokens.textTertiary} !important;
    -webkit-text-fill-color: ${tokens.textTertiary} !important;
    opacity: 1;
  }

  .idx-view-toggle-option:focus-visible {
    outline: 1px solid ${tokens.textPrimary};
    outline-offset: 3px;
  }

  .idx-view-toggle-divider {
    font: inherit;
    line-height: inherit;
    color: ${tokens.textPrimary} !important;
    -webkit-text-fill-color: ${tokens.textPrimary} !important;
    opacity: 1 !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .idx-fade-appear,
    .idx-fade-appear[data-idx-appeared="true"],
    .idx-mask-appear,
    .idx-mask-appear[data-idx-appeared="true"],
	    .idx-mask-reveal-text,
	    .idx-row,
	    .idx-grid-card,
	    .idx-grid-card-media,
	    .idx-rule {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
      will-change: auto !important;
    }
    .idx-flip-track {
      transition: none !important;
      transform: none !important;
    }
    .idx-grid-title-stack {
      transition: none !important;
      transform: none !important;
    }
    .idx-grid-card-img,
    .idx-grid-card-video,
    .idx-grid-card-media > img,
    .idx-grid-card-media > video {
      transform: scale(1) !important;
      transition: none !important;
      will-change: auto !important;
    }
  }

  .idx-project-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: var(--idx-grid-gap, 20px);
    row-gap: 56px;
    width: 100%;
  }
  .idx-project-grid[data-grid-layout="figma"] {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    justify-content: stretch;
    max-width: none;
    row-gap: 52px;
  }
  .idx-grid-card {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-decoration: none;
    color: inherit;
  }
  .idx-grid-card-link {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }
  .idx-grid-card[data-grid-layout="figma"],
  .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-link {
    gap: 14px;
  }
  .idx-grid-card-link:focus-visible {
    outline: 1px solid ${tokens.textPrimary};
    outline-offset: 4px;
  }
  .idx-grid-card-heading {
    align-items: start;
    color: ${tokens.textPrimary};
    display: grid;
    font-family: ${tokens.fontMono};
    font-size: 13px;
    font-weight: 400;
    grid-template-columns: 24px 11px minmax(0, 1fr);
    letter-spacing: 0;
    line-height: 100%;
    min-height: 13px;
    overflow: hidden;
    text-transform: uppercase;
    white-space: nowrap;
    width: 100%;
  }
  .idx-grid-card-order {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .idx-grid-title-frame {
    display: block;
    height: 13px;
    min-width: 0;
    overflow: hidden;
  }
  .idx-grid-title-stack {
    display: flex;
    flex-direction: column;
    gap: 5px;
    transform: translateY(0);
    transition: transform 420ms ${SNAPPY_EASE};
    will-change: transform;
  }
  .idx-grid-title-stack > span {
    display: block;
    height: 13px;
    line-height: 100%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .idx-grid-card-title {
    width: 100%;
    min-width: 0;
  }
  .idx-grid-card-media {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    clip-path: inset(0);
    contain: paint;
    isolation: isolate;
    background: ${tokens.surfaceActive};
    opacity: 0;
    will-change: opacity;
  }
  .idx-grid-card-media[data-idx-media-appeared="true"] {
    opacity: 1;
  }
  .idx-grid-card-media[data-thumbnail-stroke="true"]::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 3;
    box-sizing: border-box;
    border: 1px solid ${tokens.textTertiary};
    border-radius: inherit;
    pointer-events: none;
    background: transparent;
  }
  .idx-grid-card-meta {
    margin-top: -2px;
    font-family: ${tokens.fontMono};
    font-size: 13px;
    line-height: 20px;
    letter-spacing: 0;
    text-transform: uppercase;
    color: ${tokens.textTertiary};
  }
  .idx-grid-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    min-width: 0;
    width: 100%;
  }
  .idx-grid-card-tag {
    appearance: none;
    -webkit-appearance: none;
    align-items: center;
    background: transparent;
    border: 1px solid ${tokens.textTertiary};
    border-radius: 999px;
    box-sizing: border-box;
    color: ${tokens.textTertiary};
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    font-family: ${tokens.fontMono};
    font-size: 13px;
    font-weight: 400;
    justify-content: center;
    letter-spacing: 0;
    line-height: 1;
    margin: 0;
    max-width: 100%;
    min-height: 23px;
    overflow: hidden;
    padding: 5px 10px 6px;
    text-overflow: ellipsis;
    text-transform: uppercase;
    transition:
      color 250ms ${SMOOTH_EASE},
      border-color 250ms ${SMOOTH_EASE};
    white-space: nowrap;
  }
  @media (hover: hover) {
    .idx-grid-card-tag:hover {
      color: #25593a;
      border-color: #25593a;
    }
  }
  .idx-grid-card-tag[data-active="true"] {
    color: #25593a;
    border-color: #25593a;
  }
  .idx-grid-card-tag:focus-visible {
    outline: 1px solid #25593a;
    outline-offset: 3px;
  }
  .idx-grid-card-img,
  .idx-grid-card-video,
  .idx-grid-card-media > img,
  .idx-grid-card-media > video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border: 0;
    transform: scale(1);
    transform-origin: center center;
    transition: transform 420ms ${SNAPPY_EASE};
    backface-visibility: hidden;
    will-change: transform;
  }
  .idx-grid-card-video,
  .idx-grid-card-media > video {
    pointer-events: none;
  }
  @media (prefers-reduced-motion: no-preference) {
    .idx-grid-card-link:hover .idx-grid-card-img,
    .idx-grid-card-link:focus-visible .idx-grid-card-img,
    .idx-grid-card-link:focus-within .idx-grid-card-img,
    .idx-grid-card-link:hover .idx-grid-card-video,
    .idx-grid-card-link:focus-visible .idx-grid-card-video,
    .idx-grid-card-link:focus-within .idx-grid-card-video,
    .idx-grid-card-link:hover .idx-grid-card-media > img,
    .idx-grid-card-link:focus-visible .idx-grid-card-media > img,
    .idx-grid-card-link:focus-within .idx-grid-card-media > img,
    .idx-grid-card-link:hover .idx-grid-card-media > video,
    .idx-grid-card-link:focus-visible .idx-grid-card-media > video,
    .idx-grid-card-link:focus-within .idx-grid-card-media > video {
      transform: scale(1.02) !important;
    }
  }
  .idx-grid-card-link:hover .idx-flip-track,
  .idx-grid-card-link:focus-visible .idx-flip-track {
    transform: translateY(calc((var(--idx-flip-height) + 5px) * -1));
  }
  .idx-grid-card-link:hover .idx-grid-title-stack,
  .idx-grid-card-link:focus-visible .idx-grid-title-stack {
    transform: translateY(-18px);
  }

  .idx-tax-label-year { grid-column: 1 / span 1; grid-row: 1; }
  .idx-tax-items-year { grid-column: 2 / span 1; grid-row: 1; }
  .idx-tax-label-discipline { grid-column: 3 / span 1; grid-row: 1; }
  .idx-tax-items-discipline { grid-column: 4 / span 1; grid-row: 1; }
  .idx-tax-label-industry { grid-column: 5 / span 1; grid-row: 1; }
  .idx-tax-items-industry { grid-column: 6 / span 1; grid-row: 1; }

  .idx-list-title { grid-column: 1 / span 2; }
  .idx-list-discipline { grid-column: 3 / span 2; }
  .idx-list-industry { grid-column: 5 / span 1; }

  @media (max-width: 1199px) {
    .idx-project-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    .idx-project-grid[data-grid-layout="figma"] {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      max-width: none !important;
    }
  }
  @media (max-width: 899px) {
    .idx-project-grid[data-grid-layout="figma"] {
      grid-template-columns: 1fr !important;
      row-gap: 52px !important;
    }
  }
  @media (max-width: 809px) {
    .idx-project-grid { grid-template-columns: 1fr !important; row-gap: 40px !important; }
    .idx-project-grid[data-grid-layout="figma"] {
      grid-template-columns: 1fr !important;
      row-gap: 52px !important;
    }
    .idx-grid-card-link:hover .idx-flip-track,
    .idx-grid-card-link:focus-visible .idx-flip-track,
    .idx-grid-card-link:hover .idx-grid-title-stack,
    .idx-grid-card-link:focus-visible .idx-grid-title-stack {
      transform: none !important;
    }
  }

  @media (max-width: 1199px) {
    .idx-container {
      --idx-grid-gap: 16px !important;
      padding: 0 20px !important;
    }

    .idx-year-group {
      grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      column-gap: var(--idx-grid-gap, 16px) !important;
      row-gap: 0 !important;
    }

    .idx-year-label {
      grid-column: 1 / span 1 !important;
      padding-top: 15px !important;
    }

    .idx-list-content {
      grid-column: 2 / span 5 !important;
      min-width: 0 !important;
    }

    .idx-list-row-grid {
      grid-template-columns: minmax(0, 1fr) max-content !important;
      align-items: center !important;
      column-gap: var(--idx-grid-gap, 16px) !important;
      row-gap: 0 !important;
      min-height: 56px !important;
      padding: 9px 0 !important;
    }

    .idx-list-title {
      grid-column: 1 / span 1 !important;
      font-size: inherit !important;
    }

    .idx-list-discipline,
    .idx-col-discipline {
      display: none !important;
    }

    .idx-list-industry {
      grid-column: 2 / span 1 !important;
      justify-self: end !important;
      text-align: right !important;
      max-width: min(180px, 34vw) !important;
    }

    .idx-title-cell {
      min-width: 0 !important;
      overflow: hidden !important;
      overflow-wrap: normal !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }

    .idx-col-industry {
      min-width: 0 !important;
      overflow: visible !important;
      overflow-wrap: normal !important;
      text-overflow: clip !important;
      white-space: normal !important;
    }

    .idx-year-number,
    .idx-list-standard .idx-title-cell > span,
    .idx-list-standard .idx-flip-copy {
      font-size: 22px !important;
      line-height: 1.2 !important;
    }

    .idx-list-standard .idx-flip-text {
      --idx-flip-height: 27px !important;
      height: 27px !important;
      line-height: 27px !important;
      overflow: hidden !important;
    }

    .idx-list-standard .idx-flip-copy {
      flex: 0 0 var(--idx-flip-height) !important;
      height: var(--idx-flip-height) !important;
      line-height: var(--idx-flip-height) !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }

    .idx-col-industry span {
      display: block !important;
      font-size: 13px !important;
      line-height: 14px !important;
      overflow: visible !important;
      text-overflow: clip !important;
      white-space: normal !important;
    }
  }

  @media (max-width: 899px) {
    .idx-taxonomy-shell {
      grid-template-columns: minmax(112px, 24%) minmax(0, 1fr) !important;
      column-gap: 20px !important;
      row-gap: 28px !important;
      align-items: start !important;
    }

    .idx-tax-label-discipline,
    .idx-tax-label-industry,
    .idx-tax-label-year {
      grid-column: 1 / span 1 !important;
      margin-top: 0 !important;
      min-width: 0 !important;
    }

    .idx-tax-items-discipline,
    .idx-tax-items-industry,
    .idx-tax-items-year {
      grid-column: 2 / span 1 !important;
      min-width: 0 !important;
      overflow: visible !important;
    }

    .idx-tax-label-year,
    .idx-tax-items-year {
      grid-row: 1 !important;
    }

    .idx-tax-label-discipline,
    .idx-tax-items-discipline {
      grid-row: 2 !important;
    }

    .idx-tax-label-industry,
    .idx-tax-items-industry {
      grid-row: 3 !important;
    }

    .idx-taxonomy-items {
      align-items: flex-start !important;
      overflow: visible !important;
    }

    .idx-tax-item {
      white-space: normal !important;
      overflow-wrap: break-word !important;
    }
  }

  @media (max-width: 809px) {
    .idx-container {
      --idx-grid-gap: 10px !important;
      padding: 0 20px !important;
    }

    .idx-taxonomy-shell {
      grid-template-columns: minmax(96px, 28%) minmax(0, 1fr) !important;
      column-gap: 18px !important;
      row-gap: 28px !important;
    }

    .idx-year-group {
      grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      column-gap: var(--idx-grid-gap, 10px) !important;
      row-gap: 0 !important;
    }

    .idx-year-label {
      grid-column: 1 / span 1 !important;
      padding-top: 15px !important;
    }

    .idx-list-content {
      grid-column: 2 / span 5 !important;
    }

    .idx-list-row-grid {
      grid-template-columns: minmax(0, 1fr) max-content !important;
      align-items: center !important;
      column-gap: var(--idx-grid-gap, 10px) !important;
      row-gap: 0 !important;
      min-height: 56px !important;
      padding: 9px 0 !important;
    }

    .idx-list-title {
      grid-column: 1 / span 1 !important;
    }

    .idx-list-discipline,
    .idx-col-discipline {
      display: none !important;
    }

    .idx-list-industry {
      grid-column: 2 / span 1 !important;
      max-width: min(150px, 34vw) !important;
    }

    .idx-flip-text {
      --idx-flip-height: 27px !important;
      height: 27px !important;
      line-height: 27px !important;
      overflow: hidden !important;
    }

    .idx-flip-track {
      display: flex !important;
      flex-direction: column !important;
      gap: 5px !important;
      transform: translateY(0) !important;
      transition: transform 620ms cubic-bezier(0.16, 1, 0.3, 1) !important;
      will-change: transform !important;
    }

    .idx-flip-copy,
    .idx-flip-copy + .idx-flip-copy {
      display: block !important;
      flex: 0 0 var(--idx-flip-height) !important;
      height: var(--idx-flip-height) !important;
      line-height: var(--idx-flip-height) !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }
  }

  @media (max-width: 809px) and (prefers-reduced-motion: reduce) {
    .idx-flip-track {
      transition: none !important;
      transform: none !important;
      will-change: auto !important;
    }
  }

  @media (max-width: 520px) {
    .idx-container {
      --idx-grid-gap: 8px !important;
      padding: 0 14px !important;
    }

    .idx-taxonomy-shell {
      grid-template-columns: minmax(84px, 32%) minmax(0, 1fr) !important;
      column-gap: 16px !important;
      row-gap: 26px !important;
      align-items: start !important;
    }

    .idx-tax-label-discipline,
    .idx-tax-label-industry,
    .idx-tax-label-year {
      grid-column: 1 / span 1 !important;
      margin-top: 0 !important;
      min-width: 0 !important;
    }

    .idx-tax-items-discipline,
    .idx-tax-items-industry,
    .idx-tax-items-year {
      grid-column: 2 / span 1 !important;
      min-width: 0 !important;
      overflow: visible !important;
    }

    .idx-tax-label-year,
    .idx-tax-items-year {
      grid-row: 1 !important;
    }

    .idx-tax-label-discipline,
    .idx-tax-items-discipline {
      grid-row: 2 !important;
    }

    .idx-tax-label-industry,
    .idx-tax-items-industry {
      grid-row: 3 !important;
    }

    .idx-tax-item {
      white-space: normal !important;
      overflow-wrap: break-word !important;
    }

    .idx-year-group {
      grid-template-columns: 1fr !important;
      column-gap: 0 !important;
    }

    .idx-year-label {
      display: none !important;
    }

    .idx-list-content {
      grid-column: 1 / -1 !important;
      width: 100% !important;
    }

    .idx-list-row-grid {
      grid-template-columns: minmax(0, 1fr) !important;
      column-gap: 0 !important;
    }

    .idx-list-title {
      grid-column: 1 / -1 !important;
      justify-self: stretch !important;
      text-align: left !important;
      width: 100% !important;
    }

    .idx-list-discipline,
    .idx-col-discipline,
    .idx-list-industry,
    .idx-col-industry {
      display: none !important;
    }

    .idx-list-view .idx-year-rule,
    .idx-list-view .idx-row-divider,
    .idx-list-bottom-rule {
      grid-column: 1 / -1 !important;
      width: 100% !important;
    }
  }
  .idx-mobile-filters, .idx-mobile-project-year { display: none; }
  @media (max-width: 809px) {
    .idx-desktop-filters { display: none; }
    .idx-mobile-filters {
      display: block;
      font-family: ${tokens.fontMono};
      font-size: 13px;
      line-height: 1.3;
      text-transform: uppercase;
      color: ${tokens.textPrimary};
    }
    .idx-mobile-filters button {
      appearance: none;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      text-transform: inherit;
      letter-spacing: inherit;
      cursor: pointer;
      min-width: 44px;
      min-height: 44px;
      padding: 8px 0;
      touch-action: manipulation;
    }
    .idx-list-row-grid:focus-visible, .idx-mobile-filters button:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
    .idx-mobile-dropdowns { position: relative; z-index: 4; }
    .idx-mobile-triggers {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      border-block: 1px solid ${tokens.dividerSubtle};
    }
    .idx-mobile-filters .idx-mobile-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      min-width: 0;
      min-height: 48px;
      text-align: left;
    }
    .idx-mobile-trigger > span { min-width: 0; overflow-wrap: anywhere; }
    .idx-mobile-filters svg { flex: 0 0 12px; }
    .idx-mobile-trigger[aria-expanded="true"] > svg { transform: rotate(180deg); }
    .idx-mobile-trigger[aria-expanded="true"],
    .idx-mobile-filters button[aria-pressed="true"], .idx-mobile-clear {
      text-decoration: underline;
      text-underline-offset: 4px;
    }
    .idx-mobile-panel {
      position: absolute;
      top: 100%;
      inset-inline: 0;
      background: ${tokens.bg};
      border: 1px solid ${tokens.dividerSubtle};
      padding: 8px 16px 0;
    }
    .idx-mobile-panel[hidden] { display: none; }
    .idx-mobile-choices {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 12px;
      max-height: min(50dvh, 360px);
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 4px;
      margin-inline: -4px;
    }
    .idx-mobile-choices button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      text-align: left;
      overflow-wrap: anywhere;
    }
    .idx-mobile-panel-footer, .idx-mobile-toolbar, .idx-mobile-filter-status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .idx-mobile-panel-footer { border-top: 1px solid ${tokens.dividerSubtle}; }
    .idx-mobile-toolbar { min-height: 56px; border-bottom: 1px solid ${tokens.dividerSubtle}; }
    .idx-mobile-view { display: flex; align-items: center; gap: 8px; margin-left: auto; }
    .idx-mobile-clear:disabled { visibility: hidden; pointer-events: none; }
    .idx-mobile-filter-status { min-height: 48px; }
    .idx-mobile-filter-status[data-view="grid"] {
      border-bottom: 1px solid ${tokens.dividerSubtle};
      margin-bottom: ${tokens.dividerGap};
    }
    .idx-mobile-filter-status > :last-child { text-align: right; }
    .idx-grid-preview-locked .idx-list-view .idx-list-row-grid {
      grid-template-columns: minmax(0, 1fr) auto !important;
      column-gap: 12px !important;
    }
    .idx-grid-preview-locked .idx-list-view .idx-list-title { grid-column: 1 !important; }
    .idx-mobile-project-year {
      display: block;
      grid-column: 2;
      font-family: ${tokens.fontMono};
      font-size: 13px;
      line-height: 1.3;
      color: ${tokens.textSecondary};
    }
  }

`;
}
function MaskedSlideText({
  children,
  index,
  delayMs,
  block = false,
  className,
  style
}) {
  const { ref, appeared } = useIndexAppearTrigger();
  const textRef = useRef(null);
  useEffect(() => {
    const element = textRef.current;
    if (!element || typeof window === "undefined") return;
    const hiddenTransform = `translate3d(0, ${INDEX_MASK_REVEAL_PRESET.distancePx}px, 0)`;
    element.getAnimations().forEach((animation2) => animation2.cancel());
    if (!appeared) {
      element.style.transform = hiddenTransform;
      return;
    }
    if (prefersReducedIndexMotion() || typeof element.animate !== "function") {
      element.style.transform = "translate3d(0, 0, 0)";
      return;
    }
    element.style.transform = hiddenTransform;
    const animation = element.animate(
      [
        { transform: hiddenTransform },
        { transform: "translate3d(0, 0, 0)" }
      ],
      {
        duration: INDEX_MASK_REVEAL_PRESET.durationMs,
        delay: delayMs ?? getIndexMaskRevealDelayMs(index),
        easing: INDEX_MASK_REVEAL_PRESET.easing,
        fill: "both"
      }
    );
    return () => {
      animation.cancel();
    };
  }, [appeared, delayMs, index]);
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      ref,
      className: [
        "idx-mask-appear",
        block ? "idx-mask-appear-block" : "",
        className ?? ""
      ].filter(Boolean).join(" "),
      "data-idx-appeared": appeared ? "true" : "false",
      style
    },
    /* @__PURE__ */ React.createElement("span", { ref: textRef, className: "idx-mask-reveal-text" }, children)
  );
}
function FadeInText({
  children,
  index = 0,
  delayMs,
  durationMs,
  easing,
  block = false,
  className,
  style
}) {
  const { ref, appeared } = useIndexAppearTrigger();
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") return;
    element.getAnimations().forEach((animation2) => animation2.cancel());
    if (!appeared) {
      element.style.opacity = "0";
      return;
    }
    if (prefersReducedIndexMotion() || typeof element.animate !== "function") {
      element.style.opacity = "1";
      return;
    }
    element.style.opacity = "0";
    const animation = element.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: durationMs ?? INDEX_APPEAR_PRESET.durationMs,
      delay: delayMs ?? getIndexFadeDelayMs(index),
      easing: easing ?? INDEX_APPEAR_PRESET.easing,
      fill: "both"
    });
    return () => {
      animation.cancel();
    };
  }, [appeared, delayMs, durationMs, easing, index]);
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      ref,
      className: [
        "idx-fade-appear",
        block ? "idx-fade-appear-block" : "",
        className ?? ""
      ].filter(Boolean).join(" "),
      "data-idx-appeared": appeared ? "true" : "false",
      style
    },
    children
  );
}
function IndexRule({
  className,
  style,
  delayMs = 0
}) {
  const { ref, appeared } = useIndexAppearTrigger();
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") return;
    element.getAnimations().forEach((animation2) => animation2.cancel());
    if (!appeared) {
      element.style.transform = "scaleX(0)";
      return;
    }
    if (prefersReducedIndexMotion() || typeof element.animate !== "function") {
      element.style.transform = "scaleX(1)";
      return;
    }
    element.style.transform = "scaleX(0)";
    const animation = element.animate(
      [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      {
        duration: INDEX_APPEAR_PRESET.ruleDurationMs,
        delay: delayMs,
        easing: INDEX_APPEAR_PRESET.ruleEasing,
        fill: "both"
      }
    );
    return () => {
      animation.cancel();
    };
  }, [appeared, delayMs]);
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref,
      className: ["idx-rule", className ?? ""].filter(Boolean).join(" "),
      "data-idx-appeared": appeared ? "true" : "false",
      style
    }
  );
}
function MobileTaxonomyControls({
  filters,
  disciplineNavItems,
  industryNavItems,
  yearNavItems,
  onFilterToggle,
  onFilterClear,
  onClearFilters,
  activeView,
  onViewChange,
  resultCount
}) {
  const [open, setOpen] = useState(null);
  const rootRef = useRef(null);
  const triggerRefs = useRef({});
  const id = React.useId();
  const groups = [
    { key: "years", label: "Year", values: yearNavItems },
    { key: "disciplines", label: "Service", values: disciplineNavItems },
    { key: "industries", label: "Industry", values: industryNavItems }
  ];
  const activeCount = filters.years.length + filters.disciplines.length + filters.industries.length;
  const close = () => {
    if (open) triggerRefs.current[open]?.focus({ preventScroll: true });
    setOpen(null);
  };
  useEffect(() => {
    if (!open) return;
    const outside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(null);
    };
    const query = window.matchMedia("(max-width: 809px)");
    const onResize = () => {
      if (!query.matches) setOpen(null);
    };
    document.addEventListener("pointerdown", outside);
    query.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("pointerdown", outside);
      query.removeEventListener("change", onResize);
    };
  }, [open]);
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "idx-mobile-filters",
      ref: rootRef,
      onBlur: (event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(null);
      },
      onKeyDown: (event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "idx-mobile-dropdowns" }, /* @__PURE__ */ React.createElement("div", { className: "idx-mobile-triggers" }, groups.map(({ key, label }) => /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        key,
        className: "idx-mobile-trigger",
        id: `${id}-${key}-trigger`,
        ref: (node) => {
          if (node) triggerRefs.current[key] = node;
        },
        "aria-expanded": open === key,
        "aria-controls": `${id}-${key}-panel`,
        "aria-label": `${label} filters, ${filters[key].length ? `${filters[key].length} selected` : "all"}`,
        onClick: () => setOpen(open === key ? null : key),
        onKeyDown: (event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(key);
            requestAnimationFrame(() => document.getElementById(`${id}-${key}-panel`)?.querySelector("button")?.focus());
          }
        }
      },
      /* @__PURE__ */ React.createElement("span", null, label, filters[key].length > 0 && /* @__PURE__ */ React.createElement("span", { className: "idx-mobile-selection-count" }, " (", filters[key].length, ")")),
      /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 12 12", width: "12", height: "12", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "m2 4 4 4 4-4", stroke: "currentColor" }))
    ))), groups.map(({ key, label, values }) => /* @__PURE__ */ React.createElement(
      "section",
      {
        key,
        id: `${id}-${key}-panel`,
        hidden: open !== key,
        className: "idx-mobile-panel",
        "aria-labelledby": `${id}-${key}-trigger`
      },
      /* @__PURE__ */ React.createElement("div", { className: "idx-mobile-choices", role: "group", "aria-label": `${label} options` }, [null, ...values].map((value) => {
        const selected = value === null ? filters[key].length === 0 : filters[key].includes(value);
        return /* @__PURE__ */ React.createElement(
          "button",
          {
            type: "button",
            key: value ?? "all",
            "aria-pressed": selected,
            onClick: () => value === null ? onFilterClear(key) : onFilterToggle(key, value)
          },
          /* @__PURE__ */ React.createElement("span", null, value ?? "All"),
          selected && /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 12 12", width: "12", height: "12", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "m1.5 6 3 3 6-6", stroke: "currentColor" }))
        );
      })),
      /* @__PURE__ */ React.createElement("div", { className: "idx-mobile-panel-footer" }, /* @__PURE__ */ React.createElement("button", { type: "button", "aria-label": `Reset ${label.toLowerCase()} filters`, onClick: () => onFilterClear(key) }, "Reset"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: close }, "Done"))
    ))),
    /* @__PURE__ */ React.createElement("div", { className: "idx-mobile-toolbar" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "idx-mobile-clear",
        disabled: !activeCount,
        onClick: () => {
          onClearFilters();
          setOpen(null);
          triggerRefs.current.years?.focus({ preventScroll: true });
        }
      },
      "Clear filters"
    ), /* @__PURE__ */ React.createElement("div", { className: "idx-mobile-view", role: "group", "aria-label": "Project view" }, /* @__PURE__ */ React.createElement("button", { type: "button", "aria-pressed": activeView === "grid", onClick: () => {
      setOpen(null);
      onViewChange("grid");
    } }, "Grid"), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "/"), /* @__PURE__ */ React.createElement("button", { type: "button", "aria-pressed": activeView === "list", onClick: () => {
      setOpen(null);
      onViewChange("list");
    } }, "List"))),
    /* @__PURE__ */ React.createElement("div", { className: "idx-mobile-filter-status", "data-view": activeView, role: "status", "aria-live": "polite", "aria-atomic": "true" }, /* @__PURE__ */ React.createElement("span", null, resultCount, " ", resultCount === 1 ? "project" : "projects"), /* @__PURE__ */ React.createElement("span", null, activeCount ? `${activeCount} active ${activeCount === 1 ? "filter" : "filters"}` : ""))
  );
}
function TaxonomySection({
  filters,
  disciplineNavItems,
  industryNavItems,
  yearNavItems,
  onFilterToggle,
  onFilterClear,
  onClearFilters
}) {
  const hasActive = filters.disciplines.length > 0 || filters.industries.length > 0 || filters.years.length > 0;
  const shellStyle = {
    ...indexGridStyle,
    alignItems: "flex-start",
    fontFamily: tokens.fontMono,
    fontSize: 13,
    lineHeight: TAXONOMY_LINE_HEIGHT,
    textTransform: "uppercase",
    color: tokens.textPrimary,
    letterSpacing: 0
  };
  const labelStyle = {
    minWidth: 0,
    font: "inherit",
    lineHeight: TAXONOMY_LINE_HEIGHT,
    color: tokens.textPrimary,
    whiteSpace: "nowrap"
  };
  const itemsStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minWidth: 0,
    overflow: "hidden"
  };
  const itemStyle = (active) => ({
    display: "block",
    width: "100%",
    margin: 0,
    padding: 0,
    border: "none",
    background: "transparent",
    font: "inherit",
    lineHeight: TAXONOMY_LINE_HEIGHT,
    textAlign: "left",
    textTransform: "inherit",
    color: tokens.textPrimary,
    letterSpacing: 0,
    fontWeight: 400,
    textDecoration: active ? "underline" : "none",
    textUnderlineOffset: "3px",
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none"
  });
  const navFadeProps = (rowIndex, columnIndex = 0) => ({
    delayMs: getIndexNavFadeDelayMs(rowIndex, columnIndex),
    durationMs: INDEX_NAV_FADE_PRESET.durationMs,
    easing: INDEX_NAV_FADE_PRESET.easing
  });
  const clearFiltersRow = Math.max(
    yearNavItems.length,
    disciplineNavItems.length,
    industryNavItems.length
  ) + 2;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "idx-taxonomy-shell", style: shellStyle }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "idx-taxonomy-label idx-tax-label-year",
      style: labelStyle
    },
    /* @__PURE__ */ React.createElement(FadeInText, { ...navFadeProps(0, 0) }, "/ Year")
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "idx-taxonomy-items idx-tax-items-year",
      style: itemsStyle
    },
    /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "idx-tax-item",
        style: itemStyle(filters.years.length === 0),
        "aria-pressed": filters.years.length === 0,
        "aria-label": "Show all years",
        onClick: () => onFilterClear("years")
      },
      /* @__PURE__ */ React.createElement(FadeInText, { ...navFadeProps(0, 0) }, "All")
    ),
    yearNavItems.map((y, rowIndex) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: y,
        type: "button",
        className: "idx-tax-item idx-tax-value",
        style: itemStyle(filters.years.includes(y)),
        "aria-pressed": filters.years.includes(y),
        onClick: () => onFilterToggle("years", y)
      },
      /* @__PURE__ */ React.createElement(FadeInText, { ...navFadeProps(rowIndex + 1, 0) }, y)
    ))
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "idx-taxonomy-label idx-tax-label-discipline",
      style: labelStyle
    },
    /* @__PURE__ */ React.createElement(FadeInText, { ...navFadeProps(0, 1) }, "/ Service")
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "idx-taxonomy-items idx-tax-items-discipline",
      style: itemsStyle
    },
    /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "idx-tax-item",
        style: itemStyle(filters.disciplines.length === 0),
        "aria-pressed": filters.disciplines.length === 0,
        "aria-label": "Show all services",
        onClick: () => onFilterClear("disciplines")
      },
      /* @__PURE__ */ React.createElement(FadeInText, { ...navFadeProps(0, 1) }, "All")
    ),
    disciplineNavItems.map((d, rowIndex) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: d,
        type: "button",
        className: "idx-tax-item idx-tax-value",
        style: itemStyle(filters.disciplines.includes(d)),
        "aria-pressed": filters.disciplines.includes(d),
        onClick: () => onFilterToggle("disciplines", d)
      },
      /* @__PURE__ */ React.createElement(FadeInText, { ...navFadeProps(rowIndex + 1, 1) }, d)
    ))
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "idx-taxonomy-label idx-tax-label-industry",
      style: labelStyle
    },
    /* @__PURE__ */ React.createElement(FadeInText, { ...navFadeProps(0, 2) }, "/ Industry")
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "idx-taxonomy-items idx-tax-items-industry",
      style: itemsStyle
    },
    /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "idx-tax-item",
        style: itemStyle(filters.industries.length === 0),
        "aria-pressed": filters.industries.length === 0,
        "aria-label": "Show all industries",
        onClick: () => onFilterClear("industries")
      },
      /* @__PURE__ */ React.createElement(FadeInText, { ...navFadeProps(0, 2) }, "All")
    ),
    industryNavItems.map((i, rowIndex) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: i,
        type: "button",
        className: "idx-tax-item idx-tax-value",
        style: itemStyle(filters.industries.includes(i)),
        "aria-pressed": filters.industries.includes(i),
        onClick: () => onFilterToggle("industries", i)
      },
      /* @__PURE__ */ React.createElement(FadeInText, { ...navFadeProps(rowIndex + 1, 2) }, i)
    ))
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "idx-tax-item idx-clear-filters",
      onClick: onClearFilters,
      "aria-hidden": hasActive ? void 0 : "true",
      tabIndex: hasActive ? void 0 : -1,
      style: {
        marginTop: 4,
        padding: 0,
        border: "none",
        background: "transparent",
        fontFamily: tokens.fontMono,
        fontSize: 13,
        lineHeight: "28px",
        textTransform: "uppercase",
        color: tokens.textSecondary,
        letterSpacing: 0,
        cursor: "pointer",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        appearance: "none",
        WebkitAppearance: "none",
        visibility: hasActive ? "visible" : "hidden",
        pointerEvents: hasActive ? "auto" : "none"
      }
    },
    /* @__PURE__ */ React.createElement(FadeInText, { ...navFadeProps(clearFiltersRow, 0) }, "Clear filters")
  ));
}
function HoverFlipText({
  text,
  activeText,
  style,
  activeStyle,
  height
}) {
  const flipStyle = {
    ...style,
    ["--idx-flip-height"]: height
  };
  return /* @__PURE__ */ React.createElement("span", { className: "idx-flip-text", style: flipStyle, "aria-label": text }, /* @__PURE__ */ React.createElement("span", { className: "idx-flip-track", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("span", { className: "idx-flip-copy" }, text), /* @__PURE__ */ React.createElement("span", { className: "idx-flip-copy", style: activeStyle }, activeText ?? text)));
}
function ListView({
  projects,
  hoverVariant = "flip",
  progressiveMounting = false
}) {
  const groups = useMemo(() => groupByYear(projects), [projects]);
  const metaTextStyle = {
    fontFamily: tokens.fontMono,
    fontSize: 13,
    fontWeight: 400,
    lineHeight: "28px",
    textTransform: "uppercase",
    color: tokens.textPrimary,
    letterSpacing: 0
  };
  const titleTextStyle = {
    fontFamily: tokens.fontHeading,
    fontSize: 22,
    fontWeight: 500,
    textTransform: "uppercase",
    color: tokens.textPrimary,
    lineHeight: 1.2
  };
  const projectCtaTextStyle = {
    ...titleTextStyle,
    fontFamily: tokens.fontProjectCta,
    fontWeight: 400,
    color: tokens.textTertiary,
    WebkitTextFillColor: tokens.textTertiary
  };
  if (groups.length === 0) {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          padding: "64px 0",
          textAlign: "center",
          fontFamily: tokens.fontMono,
          fontSize: 13,
          lineHeight: "28px",
          textTransform: "uppercase",
          color: tokens.textTertiary
        }
      },
      "No work matches those filters."
    );
  }
  const totalRevealRows = groups.reduce(
    (count, group) => count + 1 + group.items.length,
    0
  );
  const closingRuleDelay = progressiveMounting ? 0 : getIndexContentRevealDelayMs(totalRevealRows, 0);
  let rowRevealIndex = 0;
  let projectRevealIndex = 0;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `idx-list-view idx-list-standard idx-hover-${hoverVariant}`
    },
    groups.map(({ year, items }) => {
      const yearRevealRow = rowRevealIndex++;
      const skipYearRevealDelay = progressiveMounting && projectRevealIndex >= INDEX_INITIAL_MOUNT_COUNT;
      const yearRevealDelay = skipYearRevealDelay ? 0 : getIndexContentRevealDelayMs(yearRevealRow, 0);
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          key: year,
          className: "idx-year-group",
          style: indexGridStyle
        },
        /* @__PURE__ */ React.createElement(
          IndexRule,
          {
            className: "idx-year-rule",
            delayMs: yearRevealDelay,
            style: {
              gridColumn: "1 / -1",
              height: 1,
              backgroundColor: tokens.dividerStrong
            }
          }
        ),
        /* @__PURE__ */ React.createElement(
          "div",
          {
            className: "idx-year-label",
            style: {
              gridColumn: "1 / span 1",
              minWidth: 0,
              paddingTop: 15
            }
          },
          /* @__PURE__ */ React.createElement(
            "div",
            {
              className: "idx-year-number",
              style: titleTextStyle
            },
            /* @__PURE__ */ React.createElement(
              MaskedSlideText,
              {
                index: yearRevealRow,
                delayMs: yearRevealDelay,
                block: true
              },
              year > 0 ? year : "\u2014"
            )
          )
        ),
        /* @__PURE__ */ React.createElement(
          "div",
          {
            className: "idx-list-content",
            style: { gridColumn: "2 / span 5", minWidth: 0 }
          },
          items.map((p, ri) => {
            const url = getCaseStudyUrl(p);
            const disciplineText = getDisciplineDisplay(p);
            const useFlipHover = hoverVariant === "flip";
            const itemRevealRow = rowRevealIndex++;
            const projectMountIndex = projectRevealIndex++;
            const skipItemRevealDelay = progressiveMounting && projectMountIndex >= INDEX_INITIAL_MOUNT_COUNT;
            const titleRevealDelay = skipItemRevealDelay ? 0 : getIndexContentRevealDelayMs(itemRevealRow, 0);
            const disciplineRevealDelay = skipItemRevealDelay ? 0 : getIndexContentRevealDelayMs(itemRevealRow, 1);
            const industryRevealDelay = skipItemRevealDelay ? 0 : getIndexContentRevealDelayMs(itemRevealRow, 2);
            return /* @__PURE__ */ React.createElement("div", { key: p.slug || p.title }, /* @__PURE__ */ React.createElement(
              "a",
              {
                href: url || void 0,
                className: "idx-list-row idx-row idx-list-row-grid",
                style: {
                  display: "grid",
                  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                  columnGap: INDEX_GRID_GAP,
                  alignItems: "center",
                  minHeight: 56,
                  padding: "9px 0",
                  cursor: url ? "pointer" : "default",
                  color: "inherit",
                  textDecoration: "none"
                }
              },
              /* @__PURE__ */ React.createElement(
                "div",
                {
                  className: "idx-title-cell idx-list-title",
                  style: {
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }
                },
                useFlipHover ? /* @__PURE__ */ React.createElement(
                  MaskedSlideText,
                  {
                    index: itemRevealRow,
                    delayMs: titleRevealDelay,
                    block: true
                  },
                  /* @__PURE__ */ React.createElement(
                    HoverFlipText,
                    {
                      text: p.title,
                      activeText: url ? "View Project \u2192" : p.title,
                      style: titleTextStyle,
                      activeStyle: url ? projectCtaTextStyle : void 0,
                      height: "27px"
                    }
                  )
                ) : /* @__PURE__ */ React.createElement(
                  MaskedSlideText,
                  {
                    index: itemRevealRow,
                    delayMs: titleRevealDelay,
                    block: true,
                    style: titleTextStyle
                  },
                  p.title
                )
              ),
              /* @__PURE__ */ React.createElement("span", { className: "idx-mobile-project-year" }, year > 0 ? year : "\u2014"),
              /* @__PURE__ */ React.createElement(
                "div",
                {
                  className: "idx-col-discipline idx-list-discipline",
                  style: {
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }
                },
                /* @__PURE__ */ React.createElement(
                  FadeInText,
                  {
                    index: itemRevealRow,
                    delayMs: disciplineRevealDelay,
                    block: true,
                    style: metaTextStyle
                  },
                  disciplineText
                )
              ),
              /* @__PURE__ */ React.createElement(
                "div",
                {
                  className: "idx-col-industry idx-list-industry",
                  style: {
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }
                },
                /* @__PURE__ */ React.createElement(
                  FadeInText,
                  {
                    index: itemRevealRow,
                    delayMs: industryRevealDelay,
                    block: true,
                    style: metaTextStyle
                  },
                  p.industry
                )
              )
            ), ri < items.length - 1 && /* @__PURE__ */ React.createElement(
              IndexRule,
              {
                className: "idx-row-divider",
                delayMs: progressiveMounting ? 0 : titleRevealDelay,
                style: {
                  height: 1,
                  backgroundColor: tokens.dividerSubtle
                }
              }
            ));
          })
        )
      );
    }),
    /* @__PURE__ */ React.createElement(
      IndexRule,
      {
        className: "idx-list-bottom-rule",
        delayMs: closingRuleDelay,
        style: {
          height: 1,
          width: "100%",
          backgroundColor: tokens.dividerStrong
        }
      }
    )
  );
}
function GridMediaFrame({
  children,
  index,
  delayMs,
  thumbnailStroke
}) {
  const { ref, appeared } = useIndexAppearTrigger();
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") return;
    element.getAnimations().forEach((animation2) => animation2.cancel());
    if (!appeared) {
      element.style.opacity = "0";
      return;
    }
    if (prefersReducedIndexMotion() || typeof element.animate !== "function") {
      element.style.opacity = "1";
      return;
    }
    element.style.opacity = "0";
    const animation = element.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: INDEX_MEDIA_FADE_PRESET.durationMs,
      delay: delayMs ?? getIndexMediaFadeDelayMs(index),
      easing: INDEX_MEDIA_FADE_PRESET.easing,
      fill: "both"
    });
    return () => {
      animation.cancel();
    };
  }, [appeared, delayMs, index]);
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref,
      className: "idx-grid-card-media",
      "data-thumbnail-stroke": thumbnailStroke ? "true" : void 0,
      "data-idx-media-appeared": appeared ? "true" : "false"
    },
    children
  );
}
function GridProjectMedia({ project }) {
  const thumbSrc = normalizeIndexThumbnailUrl(project.thumbnail);
  const videoSrc = getThumbnailVideoLink(project);
  const usesLoopingImage = isLoopingImageMediaSource(videoSrc);
  if (videoSrc && usesLoopingImage) {
    return /* @__PURE__ */ React.createElement(
      "img",
      {
        className: "idx-grid-card-img",
        src: videoSrc,
        alt: `${project.title} motion thumbnail`,
        loading: "lazy",
        decoding: "async"
      }
    );
  }
  if (videoSrc) {
    return /* @__PURE__ */ React.createElement(
      "video",
      {
        className: "idx-grid-card-video",
        src: videoSrc,
        poster: thumbSrc || void 0,
        muted: true,
        loop: true,
        playsInline: true,
        autoPlay: true,
        preload: "metadata"
      }
    );
  }
  if (thumbSrc) {
    return /* @__PURE__ */ React.createElement(
      "img",
      {
        className: "idx-grid-card-img",
        src: thumbSrc,
        alt: `${project.title} thumbnail`,
        loading: "lazy",
        decoding: "async"
      }
    );
  }
  return null;
}
function getGridProjectOrder(project, index) {
  const sortOrder = Number(project.sortOrder);
  if (Number.isFinite(sortOrder) && sortOrder > 0) {
    return String(Math.floor(sortOrder));
  }
  return String(index + 1);
}
function ClassicGridProjectCard({
  project,
  index,
  skipRevealDelay = false
}) {
  const href = getCaseStudyUrl(project);
  const serviceText = getDisciplineDisplay(project);
  const yearText = normalizeYear(project.year);
  const metaLineTwo = [project.industry, yearText > 0 ? String(yearText) : ""].filter(Boolean).join(" / ");
  const titleStyle = {
    fontFamily: tokens.fontHeading,
    fontSize: 22,
    fontWeight: 500,
    textTransform: "uppercase",
    color: tokens.textPrimary,
    lineHeight: 1.2
  };
  const projectCtaStyle = {
    ...titleStyle,
    fontFamily: tokens.fontProjectCta,
    fontWeight: 400,
    color: tokens.textTertiary,
    WebkitTextFillColor: tokens.textTertiary
  };
  return /* @__PURE__ */ React.createElement(
    "a",
    {
      className: "idx-grid-card",
      href: href || void 0,
      "aria-label": project.title
    },
    /* @__PURE__ */ React.createElement(
      GridMediaFrame,
      {
        index,
        delayMs: skipRevealDelay ? 0 : void 0,
        thumbnailStroke: project.thumbnailStroke
      },
      /* @__PURE__ */ React.createElement(GridProjectMedia, { project })
    ),
    /* @__PURE__ */ React.createElement("div", { className: "idx-grid-card-title" }, /* @__PURE__ */ React.createElement(
      MaskedSlideText,
      {
        index,
        delayMs: skipRevealDelay ? 0 : void 0,
        block: true
      },
      /* @__PURE__ */ React.createElement(
        HoverFlipText,
        {
          text: project.title,
          activeText: href ? "View Project \u2192" : project.title,
          style: titleStyle,
          activeStyle: href ? projectCtaStyle : void 0,
          height: "27px"
        }
      )
    )),
    /* @__PURE__ */ React.createElement("div", { className: "idx-grid-card-meta" }, /* @__PURE__ */ React.createElement(
      FadeInText,
      {
        index: index + 1,
        delayMs: skipRevealDelay ? 0 : void 0,
        block: true
      },
      serviceText,
      serviceText && metaLineTwo ? /* @__PURE__ */ React.createElement("br", null) : null,
      metaLineTwo
    ))
  );
}
function FigmaGridProjectCard({
  project,
  index,
  skipRevealDelay = false
}) {
  const href = getCaseStudyUrl(project);
  const tags = getDisciplines(project).slice(0, 3);
  const order = getGridProjectOrder(project, index);
  const filterContext = React.useContext(IndexFilterContext);
  return /* @__PURE__ */ React.createElement("div", { className: "idx-grid-card", "data-grid-layout": "figma" }, /* @__PURE__ */ React.createElement(
    "a",
    {
      className: "idx-grid-card-link",
      href: href || void 0,
      "aria-label": project.title
    },
    /* @__PURE__ */ React.createElement("div", { className: "idx-grid-card-heading", "aria-label": `${order} / ${project.title}` }, /* @__PURE__ */ React.createElement("span", { className: "idx-grid-card-order" }, order), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "/"), /* @__PURE__ */ React.createElement("span", { className: "idx-grid-title-frame" }, /* @__PURE__ */ React.createElement("span", { className: "idx-grid-title-stack", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("span", null, project.title), /* @__PURE__ */ React.createElement("span", null, "VIEW PROJECT")))),
    /* @__PURE__ */ React.createElement(
      GridMediaFrame,
      {
        index,
        delayMs: skipRevealDelay ? 0 : void 0,
        thumbnailStroke: project.thumbnailStroke
      },
      /* @__PURE__ */ React.createElement(GridProjectMedia, { project })
    )
  ), tags.length > 0 && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "idx-grid-card-tags",
      "aria-label": `${project.title} services`
    },
    tags.map((tag) => {
      if (!filterContext) {
        return /* @__PURE__ */ React.createElement("span", { className: "idx-grid-card-tag", key: tag }, tag);
      }
      const active = filterContext.disciplines.includes(tag);
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          className: "idx-grid-card-tag",
          key: tag,
          "data-active": active ? "true" : void 0,
          "aria-pressed": active,
          onClick: () => filterContext.onToggleDiscipline(tag)
        },
        tag
      );
    })
  ));
}
function GridView({
  projects,
  layoutVariant = "classic",
  progressiveMounting = false
}) {
  if (projects.length === 0) {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          padding: "64px 0",
          textAlign: "center",
          fontFamily: tokens.fontMono,
          fontSize: 13,
          lineHeight: "28px",
          textTransform: "uppercase",
          color: tokens.textTertiary
        }
      },
      "No work matches those filters."
    );
  }
  const isFigmaLayout = layoutVariant === "figma";
  return /* @__PURE__ */ React.createElement(React.Fragment, null, !isFigmaLayout && /* @__PURE__ */ React.createElement(
    IndexRule,
    {
      className: "idx-grid-top-rule",
      style: {
        height: 1,
        width: "100%",
        backgroundColor: tokens.dividerStrong,
        marginBottom: 24
      }
    }
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "idx-project-grid",
      "data-grid-layout": layoutVariant,
      "aria-label": "Filtered project grid"
    },
    projects.map(
      (project, index) => isFigmaLayout ? /* @__PURE__ */ React.createElement(
        FigmaGridProjectCard,
        {
          key: project.slug || project.title,
          project,
          index,
          skipRevealDelay: progressiveMounting && index >= INDEX_INITIAL_MOUNT_COUNT
        }
      ) : /* @__PURE__ */ React.createElement(
        ClassicGridProjectCard,
        {
          key: project.slug || project.title,
          project,
          index,
          skipRevealDelay: progressiveMounting && index >= INDEX_INITIAL_MOUNT_COUNT
        }
      )
    )
  ));
}
function ViewToggle({
  activeView,
  onViewChange,
  revealStartRow = 0
}) {
  const navFadeProps = (rowIndex, columnIndex = 0) => ({
    delayMs: getIndexNavFadeDelayMs(rowIndex, columnIndex),
    durationMs: INDEX_NAV_FADE_PRESET.durationMs,
    easing: INDEX_NAV_FADE_PRESET.easing
  });
  return /* @__PURE__ */ React.createElement("div", { className: "idx-view-toggle", "aria-label": "Project view" }, VIEW_TOGGLE_OPTIONS.map((v, index) => {
    const active = activeView === v;
    const revealColumn = index * 2;
    return /* @__PURE__ */ React.createElement(React.Fragment, { key: v }, index > 0 && /* @__PURE__ */ React.createElement(
      "span",
      {
        className: "idx-view-toggle-divider",
        "aria-hidden": "true"
      },
      /* @__PURE__ */ React.createElement(
        FadeInText,
        {
          ...navFadeProps(
            revealStartRow,
            revealColumn - 1
          )
        },
        "/"
      )
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "idx-view-toggle-option",
        "data-active": active ? "true" : "false",
        "aria-pressed": active,
        onClick: () => onViewChange(v)
      },
      /* @__PURE__ */ React.createElement(
        FadeInText,
        {
          ...navFadeProps(revealStartRow, revealColumn)
        },
        v
      )
    ));
  }));
}
function IndexPage({
  projects: projectsProp,
  useCMS = true,
  cmsModuleUrl = "",
  thumbnailVideoFieldIds = DEFAULT_THUMBNAIL_VIDEO_FIELD_IDS,
  defaultView = "list",
  listHoverVariant = "flip",
  gridLayoutVariant = "classic",
  advanced,
  textPrimary,
  textSecondary,
  textTertiary,
  bg,
  dividerStrong,
  dividerSubtle,
  surfaceActive
}) {
  const resolvedCmsModuleUrl = cmsModuleUrl;
  const resolvedThumbnailVideoFieldIds = thumbnailVideoFieldIds ?? DEFAULT_THUMBNAIL_VIDEO_FIELD_IDS;
  const resolvedDefaultView = advanced?.defaultView ?? defaultView;
  const resolvedListHoverVariant = advanced?.listHoverVariant ?? listHoverVariant;
  const resolvedGridLayoutVariant = advanced?.gridLayoutVariant ?? gridLayoutVariant;
  tokens.textPrimary = advanced?.textPrimary || textPrimary || DEFAULT_TOKENS.textPrimary;
  tokens.textSecondary = advanced?.textSecondary || textSecondary || DEFAULT_TOKENS.textSecondary;
  tokens.textTertiary = advanced?.textTertiary || textTertiary || DEFAULT_TOKENS.textTertiary;
  tokens.bg = advanced?.bg || bg || DEFAULT_TOKENS.bg;
  tokens.dividerStrong = advanced?.dividerStrong || dividerStrong || DEFAULT_TOKENS.dividerStrong;
  tokens.dividerSubtle = advanced?.dividerSubtle || dividerSubtle || DEFAULT_TOKENS.dividerSubtle;
  tokens.surfaceActive = advanced?.surfaceActive || surfaceActive || DEFAULT_TOKENS.surfaceActive;
  const globalCss = useMemo(
    () => buildGlobalCss(),
    [
      advanced,
      textPrimary,
      textSecondary,
      textTertiary,
      bg,
      dividerStrong,
      dividerSubtle,
      surfaceActive
    ]
  );
  useHiddenCMSLinkInerting(useCMS);
  const [cmsModuleProjects, setCMSModuleProjects] = useState([]);
  const [cmsModuleLoaded, setCMSModuleLoaded] = useState(false);
  useEffect(() => {
    if (!useCMS) {
      setCMSModuleProjects([]);
      setCMSModuleLoaded(false);
      return;
    }
    let cancelled = false;
    setCMSModuleLoaded(false);
    loadCMSProjects(resolvedCmsModuleUrl, resolvedThumbnailVideoFieldIds).then((items) => {
      if (!cancelled) {
        setCMSModuleProjects(items);
        setCMSModuleLoaded(true);
      }
    }).catch(() => {
      if (!cancelled) {
        setCMSModuleProjects([]);
        setCMSModuleLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [useCMS, resolvedCmsModuleUrl, resolvedThumbnailVideoFieldIds]);
  const allProjects = useMemo(() => {
    const fromCMSModule = useCMS && cmsModuleProjects.length > 0 ? cmsModuleProjects : null;
    const fromProps = projectsProp && projectsProp.length > 0 ? projectsProp : null;
    const sourceProjects = useCMS ? fromCMSModule ?? [] : fromProps ?? [];
    return sourceProjects.map(normalizeProjectDisciplines);
  }, [
    useCMS,
    cmsModuleProjects,
    projectsProp
  ]);
  const initialView = resolvedDefaultView === "grid" ? "grid" : "list";
  const progressivelyMountContent = shouldProgressivelyMountIndexContent();
  const [activeView, setActiveView] = useState(initialView);
  const [renderKey, setRenderKey] = useState(0);
  const [progressiveMountState, setProgressiveMountState] = useState({ projects: null, view: initialView, count: 0 });
  const hasCompletedInitialProgressiveMountRef = useRef(
    !progressivelyMountContent
  );
  if (!progressivelyMountContent) {
    hasCompletedInitialProgressiveMountRef.current = true;
  }
  const [filters, setFilters] = useState({
    disciplines: [],
    industries: [],
    years: []
  });
  const indexContainerRef = useRef(null);
  const taxonomyNavItems = useMemo(
    () => getTaxonomyNavItems(allProjects),
    [allProjects]
  );
  const pendingUrlFiltersRef = useRef(null);
  const [urlFilterTick, setUrlFilterTick] = useState(0);
  const [urlFilterReady, setUrlFilterReady] = useState(false);
  useEffect(() => {
    if (!urlFilterSyncEnabled()) return;
    const captureFromUrl = () => {
      setUrlFilterReady(false);
      pendingUrlFiltersRef.current = parseUrlFilterSelection();
      setUrlFilterTick((tick) => tick + 1);
    };
    captureFromUrl();
    window.addEventListener("hashchange", captureFromUrl);
    return () => window.removeEventListener("hashchange", captureFromUrl);
  }, []);
  useEffect(() => {
    if (!urlFilterSyncEnabled() || urlFilterTick === 0) return;
    const pending = pendingUrlFiltersRef.current;
    if (!pending) {
      setUrlFilterReady(true);
      return;
    }
    const hasTaxonomy = taxonomyNavItems.disciplines.length > 0 || taxonomyNavItems.industries.length > 0 || taxonomyNavItems.years.length > 0;
    if (!hasTaxonomy) return;
    pendingUrlFiltersRef.current = null;
    setUrlFilterReady(true);
    const resolved = {
      disciplines: resolveTaxonomySlugs(
        pending.disciplines,
        taxonomyNavItems.disciplines
      ),
      industries: resolveTaxonomySlugs(
        pending.industries,
        taxonomyNavItems.industries
      ),
      years: resolveTaxonomyYears(
        pending.years,
        taxonomyNavItems.years
      )
    };
    if (resolved.disciplines.length === 0 && resolved.industries.length === 0 && resolved.years.length === 0) {
      return;
    }
    setFilters(resolved);
  }, [urlFilterTick, taxonomyNavItems]);
  useEffect(() => {
    if (!urlFilterSyncEnabled() || !urlFilterReady) return;
    writeFiltersToUrl(filters);
  }, [filters, urlFilterTick, urlFilterReady]);
  const handleViewChange = useCallback(
    (v) => {
      if (v === activeView) return;
      setActiveView(v);
      setRenderKey((k) => k + 1);
    },
    [activeView]
  );
  const handleFilterToggle = useCallback(
    (type, value) => {
      setFilters((prev) => {
        if (type === "years") {
          return {
            ...prev,
            years: toggleFilterValue(prev.years, Number(value))
          };
        }
        if (type === "industries") {
          return {
            ...prev,
            industries: toggleFilterValue(
              prev.industries,
              String(value)
            )
          };
        }
        return {
          ...prev,
          disciplines: toggleFilterValue(
            prev.disciplines,
            String(value)
          )
        };
      });
    },
    []
  );
  const indexFilterContextValue = useMemo(
    () => ({
      disciplines: filters.disciplines,
      onToggleDiscipline: (value) => handleFilterToggle("disciplines", value)
    }),
    [filters.disciplines, handleFilterToggle]
  );
  const handleFilterClear = useCallback((type) => {
    setFilters((prev) => {
      if (prev[type].length === 0) return prev;
      return { ...prev, [type]: [] };
    });
  }, []);
  const handleClearFilters = useCallback(
    () => setFilters((prev) => {
      if (prev.disciplines.length === 0 && prev.industries.length === 0 && prev.years.length === 0) {
        return prev;
      }
      return { disciplines: [], industries: [], years: [] };
    }),
    []
  );
  const filteredProjects = useMemo(
    () => filterProjects(allProjects, filters, ""),
    [allProjects, filters]
  );
  const hasActiveFilters = filters.disciplines.length > 0 || filters.industries.length > 0 || filters.years.length > 0;
  const isCMSLoading = useCMS && !cmsModuleLoaded;
  const projectsForActiveView = useMemo(
    () => activeView === "list" ? groupByYear(filteredProjects).flatMap((group) => group.items) : filteredProjects,
    [activeView, filteredProjects]
  );
  if (!hasCompletedInitialProgressiveMountRef.current && progressiveMountState.projects !== null && (progressiveMountState.projects !== projectsForActiveView || progressiveMountState.view !== activeView)) {
    hasCompletedInitialProgressiveMountRef.current = true;
  }
  const isInitialProgressiveMountActive = progressivelyMountContent && !hasCompletedInitialProgressiveMountRef.current;
  const mountedProjectCount = isInitialProgressiveMountActive && progressiveMountState.projects === projectsForActiveView && progressiveMountState.view === activeView ? progressiveMountState.count : isInitialProgressiveMountActive ? 0 : projectsForActiveView.length;
  const mountedProjects = mountedProjectCount >= projectsForActiveView.length ? projectsForActiveView : projectsForActiveView.slice(0, mountedProjectCount);
  const isFirstContentBatchPending = isInitialProgressiveMountActive && !isCMSLoading && filteredProjects.length > 0 && mountedProjects.length === 0;
  useEffect(() => {
    if (hasCompletedInitialProgressiveMountRef.current || !progressivelyMountContent || isCMSLoading || filteredProjects.length === 0 || typeof window === "undefined") {
      return;
    }
    const batchProjects = projectsForActiveView;
    const batchView = activeView;
    const totalProjects = batchProjects.length;
    let cancelled = false;
    let frameId = 0;
    let idleId = 0;
    let nextCount = 0;
    const commitNextBatch = () => {
      if (cancelled) return;
      nextCount = Math.min(
        totalProjects,
        nextCount === 0 ? INDEX_INITIAL_MOUNT_COUNT : nextCount + INDEX_MOUNT_BATCH_SIZE
      );
      if (nextCount >= totalProjects) {
        hasCompletedInitialProgressiveMountRef.current = true;
      }
      setProgressiveMountState({
        projects: batchProjects,
        view: batchView,
        count: nextCount
      });
      if (nextCount < totalProjects) scheduleNextBatch();
    };
    const scheduleNextBatch = () => {
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        if (cancelled) return;
        if (typeof window.requestIdleCallback === "function") {
          idleId = window.requestIdleCallback(
            () => {
              idleId = 0;
              commitNextBatch();
            },
            { timeout: 100 }
          );
          return;
        }
        commitNextBatch();
      });
    };
    frameId = window.requestAnimationFrame(() => {
      frameId = 0;
      commitNextBatch();
    });
    return () => {
      cancelled = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      if (idleId && typeof window.cancelIdleCallback === "function") {
        ;
        window.cancelIdleCallback(idleId);
      }
    };
  }, [
    activeView,
    isCMSLoading,
    projectsForActiveView,
    progressivelyMountContent
  ]);
  const viewToggleRevealRow = Math.max(
    10,
    Math.max(
      taxonomyNavItems.years.length,
      taxonomyNavItems.disciplines.length,
      taxonomyNavItems.industries.length
    ) + 2
  );
  return /* @__PURE__ */ React.createElement(IndexFilterContext.Provider, { value: indexFilterContextValue }, /* @__PURE__ */ React.createElement("style", { "data-index-global-css": "true", suppressHydrationWarning: true }, globalCss), /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: indexContainerRef,
      className: "idx-container",
      "data-media-priority": "video",
      style: {
        width: "100%",
        color: tokens.textPrimary,
        fontFamily: tokens.fontMono,
        boxSizing: "border-box",
        minHeight: "60vh",
        padding: "0 20px",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale"
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "idx-index-nav" }, /* @__PURE__ */ React.createElement(
      MobileTaxonomyControls,
      {
        filters,
        disciplineNavItems: taxonomyNavItems.disciplines,
        industryNavItems: taxonomyNavItems.industries,
        yearNavItems: taxonomyNavItems.years,
        onFilterToggle: handleFilterToggle,
        onFilterClear: handleFilterClear,
        onClearFilters: handleClearFilters,
        activeView,
        onViewChange: handleViewChange,
        resultCount: filteredProjects.length
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "idx-desktop-filters" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          opacity: 1,
          pointerEvents: "auto",
          transition: `opacity 200ms ${SMOOTH_EASE}`,
          marginBottom: 18
        }
      },
      /* @__PURE__ */ React.createElement(
        TaxonomySection,
        {
          filters,
          disciplineNavItems: taxonomyNavItems.disciplines,
          industryNavItems: taxonomyNavItems.industries,
          yearNavItems: taxonomyNavItems.years,
          onFilterToggle: handleFilterToggle,
          onFilterClear: handleFilterClear,
          onClearFilters: handleClearFilters
        }
      )
    ), /* @__PURE__ */ React.createElement(
      ViewToggle,
      {
        activeView,
        onViewChange: handleViewChange,
        revealStartRow: viewToggleRevealRow
      }
    ))),
    /* @__PURE__ */ React.createElement("div", { key: renderKey }, isCMSLoading ? /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          padding: "64px 0",
          textAlign: "center",
          fontFamily: tokens.fontMono,
          fontSize: 13,
          lineHeight: "28px",
          textTransform: "uppercase",
          color: tokens.textTertiary
        }
      },
      "Loading work..."
    ) : isFirstContentBatchPending ? null : activeView === "grid" ? /* @__PURE__ */ React.createElement(
      GridView,
      {
        projects: mountedProjects,
        layoutVariant: resolvedGridLayoutVariant,
        progressiveMounting: progressivelyMountContent
      }
    ) : /* @__PURE__ */ React.createElement(
      ListView,
      {
        projects: mountedProjects,
        hoverVariant: resolvedListHoverVariant,
        progressiveMounting: progressivelyMountContent
      }
    )),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          marginTop: 16,
          paddingBottom: 160,
          fontFamily: tokens.fontMono,
          fontSize: 13,
          lineHeight: "28px",
          textTransform: "uppercase",
          color: tokens.textPrimary
        }
      },
      filteredProjects.length,
      " ",
      filteredProjects.length === 1 ? "Project" : "Projects"
    )
  ));
}
var HIDDEN_CMS_LINK_SELECTOR, HIDDEN_CMS_INTERACTIVE_SELECTOR, HIDDEN_CMS_MEDIA_SELECTOR, HIDDEN_CMS_LINK_INERT_ATTR, HIDDEN_CMS_MEDIA_INERT_ATTR, INDEX_GRID_GAP, INDEX_GRID_TEMPLATE, INDEX_INITIAL_MOUNT_COUNT, INDEX_MOUNT_BATCH_SIZE, VIEW_TOGGLE_OPTIONS, SNAPPY_EASE, SMOOTH_EASE, INDEX_APPEAR_PRESET, INDEX_NAV_FADE_PRESET, INDEX_CONTENT_REVEAL_PRESET, INDEX_MEDIA_FADE_PRESET, INDEX_MASK_REVEAL_PRESET, indexGridStyle, DEFAULT_TOKENS, tokens, IndexFilterContext, TAXONOMY_LINE_HEIGHT, INDEX_CMS_COLLECTION_ID, INDEX_CMS_FIELD_IDS, INDEX_CMS_LIVE_SCAN_PATHS, DEFAULT_THUMBNAIL_VIDEO_FIELD_IDS, DEFAULT_ADVANCED_SETTINGS, cmsModuleUrlCache, ENABLE_URL_FILTER_SYNC, URL_FILTER_KEYS;
var init_IndexPage = __esm({
  "output/playwright/index-dropdown-2026-10-30/harness/IndexPage.tsx"() {
    init_framer();
    HIDDEN_CMS_LINK_SELECTOR = '[data-framer-name="CmsLink"], [name="CmsLink"]';
    HIDDEN_CMS_INTERACTIVE_SELECTOR = 'a[href], [role="link"], [tabindex]';
    HIDDEN_CMS_MEDIA_SELECTOR = "img, video, source";
    HIDDEN_CMS_LINK_INERT_ATTR = "data-index-hidden-cms-link-inert";
    HIDDEN_CMS_MEDIA_INERT_ATTR = "data-index-hidden-cms-media-inert";
    INDEX_GRID_GAP = "var(--idx-grid-gap, 20px)";
    INDEX_GRID_TEMPLATE = "repeat(6, minmax(0, 1fr))";
    INDEX_INITIAL_MOUNT_COUNT = 6;
    INDEX_MOUNT_BATCH_SIZE = 12;
    VIEW_TOGGLE_OPTIONS = ["grid", "list"];
    SNAPPY_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
    SMOOTH_EASE = "cubic-bezier(0.12, 0.23, 0.5, 1)";
    INDEX_APPEAR_PRESET = {
      durationMs: 620,
      easing: SNAPPY_EASE,
      ruleDurationMs: 2200,
      ruleEasing: SMOOTH_EASE,
      staggerMs: 70,
      maxStaggerIndex: 12,
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.01
    };
    INDEX_NAV_FADE_PRESET = {
      durationMs: 820,
      easing: SNAPPY_EASE,
      baseDelayMs: 120,
      rowStaggerMs: 92,
      columnStaggerMs: 0,
      maxRowIndex: 12
    };
    INDEX_CONTENT_REVEAL_PRESET = {
      baseDelayMs: 130,
      rowStaggerMs: 64,
      columnStaggerMs: 24,
      // Caps the cumulative arrival stagger. At 34 the last row waited
      // 130 + 64*34 = 2306ms before it even started animating, which read as a
      // dead gap between the hero title and the content on client-side
      // navigation (the DOM lands at ~1155ms; the rest was pure delay).
      // 16 keeps the cascade but halves the tail to 130 + 64*16 = 1154ms.
      maxRowIndex: 16
    };
    INDEX_MEDIA_FADE_PRESET = {
      durationMs: 620,
      easing: SNAPPY_EASE,
      baseDelayMs: 140,
      itemStaggerMs: 58,
      maxItemIndex: 24
    };
    INDEX_MASK_REVEAL_PRESET = {
      durationMs: 900,
      easing: SNAPPY_EASE,
      baseDelayMs: 90,
      staggerMs: 90,
      distancePx: 115
    };
    indexGridStyle = {
      display: "grid",
      gridTemplateColumns: INDEX_GRID_TEMPLATE,
      columnGap: INDEX_GRID_GAP,
      width: "100%"
    };
    DEFAULT_TOKENS = {
      textPrimary: "#26211f",
      textSecondary: "#141414",
      textTertiary: "#979797",
      bg: "#F7F5F0",
      dividerStrong: "#141414",
      dividerSubtle: "#141414",
      dividerGap: "10px",
      // global.spacing.divider-gap in micahhoang-tokens.json
      surfaceOverlay: "rgba(215, 213, 207, 0.72)",
      surfaceActive: "#EAE8E3",
      fontDisplay: "'GT Standard Trial', 'Inter', sans-serif",
      fontHeading: "'GT Standard Trial', 'Inter', sans-serif",
      fontProjectCta: "'GT Standard', 'GT Standard L Regular', 'GT Standard Trial', 'Inter', sans-serif",
      fontMono: "'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace"
    };
    tokens = { ...DEFAULT_TOKENS };
    IndexFilterContext = React.createContext(null);
    TAXONOMY_LINE_HEIGHT = "24px";
    INDEX_CMS_COLLECTION_ID = "yTHrQWMIY";
    INDEX_CMS_FIELD_IDS = {
      title: "oeXZcmPna",
      slug: "pdXVG_fBO",
      sortOrder: "DLBifmgp1",
      category1: "kuvJcmOFr",
      category2: "VV1CggU2J",
      category3: "E6OpH0hSs",
      thumbnail: "Jy7hBJady",
      thumbnailVideoLink: "SvOqFqdby",
      thumbnailStroke: "OHdUYs6Mo",
      year: "QZqSK_3OF",
      industry: "mBIilFqVM",
      isHomepage: "myUIfK0j7"
    };
    INDEX_CMS_LIVE_SCAN_PATHS = [
      "/",
      "/case-studies",
      "/index"
    ];
    DEFAULT_THUMBNAIL_VIDEO_FIELD_IDS = INDEX_CMS_FIELD_IDS.thumbnailVideoLink;
    DEFAULT_ADVANCED_SETTINGS = {
      defaultView: "list",
      listHoverVariant: "flip",
      gridLayoutVariant: "classic",
      textPrimary: "#141414",
      textSecondary: "#141414",
      textTertiary: "#979797",
      bg: "#F7F5F0",
      dividerStrong: "#141414",
      dividerSubtle: "#141414",
      surfaceActive: "#EAE8E3"
    };
    cmsModuleUrlCache = /* @__PURE__ */ new Map();
    ENABLE_URL_FILTER_SYNC = true;
    URL_FILTER_KEYS = {
      disciplines: "service",
      industries: "industry",
      years: "year"
    };
    addPropertyControls(IndexPage, {
      useCMS: {
        type: ControlType.Boolean,
        title: "Use CMS",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off"
      },
      projects: {
        type: ControlType.Array,
        title: "Projects",
        hidden: (props) => props.useCMS === true,
        control: {
          type: ControlType.Object,
          controls: {
            title: { type: ControlType.String, title: "Title" },
            category1: { type: ControlType.String, title: "Service 1" },
            category2: { type: ControlType.String, title: "Service 2" },
            category3: { type: ControlType.String, title: "Service 3" },
            industry: { type: ControlType.String, title: "Industry" },
            year: { type: ControlType.String, title: "Year" },
            thumbnail: { type: ControlType.Image, title: "Thumbnail" },
            thumbnailVideoLink: {
              type: ControlType.File,
              title: "Thumbnail Video",
              allowedFileTypes: ["mp4", "mov", "m4v", "webm"]
            },
            thumbnailStroke: {
              type: ControlType.Boolean,
              title: "Thumbnail Stroke",
              defaultValue: false
            },
            slug: { type: ControlType.String, title: "Slug" },
            sortOrder: {
              type: ControlType.Number,
              title: "Sorting Number"
            },
            isHomepage: { type: ControlType.Boolean, title: "Is Homepage" }
          }
        }
      },
      advanced: {
        type: ControlType.Object,
        title: "Advanced",
        buttonTitle: "Edit",
        icon: "effect",
        defaultValue: DEFAULT_ADVANCED_SETTINGS,
        controls: {
          defaultView: {
            type: ControlType.Enum,
            title: "Default View",
            options: ["list", "grid"],
            optionTitles: ["List", "Grid"],
            defaultValue: "list"
          },
          listHoverVariant: {
            type: ControlType.Enum,
            title: "List Hover",
            options: ["flip", "highlight"],
            optionTitles: ["Flip", "Highlight"],
            defaultValue: "flip",
            displaySegmentedControl: true
          },
          gridLayoutVariant: {
            type: ControlType.Enum,
            title: "Grid Layout",
            options: ["classic", "figma"],
            optionTitles: ["Current", "Figma"],
            defaultValue: "classic",
            displaySegmentedControl: true
          },
          textPrimary: {
            type: ControlType.Color,
            title: "Text Primary",
            defaultValue: DEFAULT_ADVANCED_SETTINGS.textPrimary
          },
          textSecondary: {
            type: ControlType.Color,
            title: "Text Secondary",
            defaultValue: DEFAULT_ADVANCED_SETTINGS.textSecondary
          },
          textTertiary: {
            type: ControlType.Color,
            title: "Text Tertiary",
            defaultValue: DEFAULT_ADVANCED_SETTINGS.textTertiary
          },
          bg: {
            type: ControlType.Color,
            title: "Background",
            defaultValue: DEFAULT_ADVANCED_SETTINGS.bg
          },
          dividerStrong: {
            type: ControlType.Color,
            title: "Divider Strong",
            defaultValue: DEFAULT_ADVANCED_SETTINGS.dividerStrong
          },
          dividerSubtle: {
            type: ControlType.Color,
            title: "Divider Subtle",
            defaultValue: DEFAULT_ADVANCED_SETTINGS.dividerSubtle
          },
          surfaceActive: {
            type: ControlType.Color,
            title: "Surface Active",
            defaultValue: DEFAULT_ADVANCED_SETTINGS.surfaceActive
          }
        }
      }
    });
  }
});

// output/playwright/index-dropdown-2026-10-30/harness/Wrapper.tsx
import React2 from "react";
function IndexPage2(props) {
  const { view, advanced, projects, useCMS = true, ...baseProps } = props;
  const selectedView = view === "grid" ? "grid" : "list";
  return /* @__PURE__ */ React2.createElement(
    "div",
    {
      className: "idx-grid-preview-locked",
      "data-cms-source": useCMS ? "cms" : "manual",
      "data-media-priority": "video",
      style: { width: "100%" }
    },
    /* @__PURE__ */ React2.createElement(
      "style",
      {
        "data-index-grid-preview-css": "true",
        suppressHydrationWarning: true
      },
      GRID_LOCK_CSS
    ),
    /* @__PURE__ */ React2.createElement(
      IndexPage,
      {
        key: `index-${selectedView}`,
        ...baseProps,
        useCMS,
        projects: useCMS ? [] : projects,
        defaultView: selectedView,
        gridLayoutVariant: "figma",
        advanced: {
          ...advanced,
          defaultView: selectedView,
          gridLayoutVariant: "figma"
        }
      }
    )
  );
}
var PREVIEW_ADVANCED_DEFAULT, GRID_LOCK_CSS;
var init_Wrapper = __esm({
  "output/playwright/index-dropdown-2026-10-30/harness/Wrapper.tsx"() {
    init_framer();
    init_IndexPage();
    PREVIEW_ADVANCED_DEFAULT = {
      defaultView: "list",
      listHoverVariant: "flip",
      gridLayoutVariant: "figma",
      textPrimary: "#141414",
      textSecondary: "#141414",
      textTertiary: "#979797",
      bg: "#F7F5F0",
      dividerStrong: "#141414",
      dividerSubtle: "#141414",
      surfaceActive: "#EAE8E3"
    };
    GRID_LOCK_CSS = `
.idx-grid-preview-locked {
    container-type: inline-size;
}

.idx-grid-preview-locked .idx-project-grid[data-grid-layout="figma"] {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    justify-content: stretch !important;
    max-width: none !important;
    row-gap: 52px !important;
}

.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] {
    gap: 14px !important;
}

.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-heading,
.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-title {
    color: #141414 !important;
    display: grid !important;
    font-family: 'GT Standard Mono Trial', 'Azeret Mono', 'SF Mono', monospace !important;
    font-size: 13px !important;
    font-weight: 400 !important;
    grid-template-columns: 24px 11px minmax(0, 1fr) !important;
    letter-spacing: 0 !important;
    line-height: 13px !important;
    margin: 0 !important;
    min-height: 13px !important;
    overflow: hidden !important;
    text-transform: uppercase !important;
    white-space: nowrap !important;
    width: 100% !important;
}

.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-heading *,
.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-title * {
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    letter-spacing: inherit !important;
    line-height: inherit !important;
    text-transform: inherit !important;
}

.idx-grid-preview-locked .idx-grid-title-frame,
.idx-grid-preview-locked .idx-grid-title-stack > span {
    height: 13px !important;
    line-height: 13px !important;
}

.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-link:hover .idx-grid-title-stack,
.idx-grid-preview-locked .idx-grid-card[data-grid-layout="figma"] .idx-grid-card-link:focus-visible .idx-grid-title-stack {
    transform: translate3d(0, -18px, 0) !important;
}

.idx-grid-preview-locked .idx-grid-card-tag {
    font-size: 13px !important;
    line-height: 1 !important;
    min-height: 23px !important;
    padding: 5px 10px 6px !important;
}

.idx-grid-preview-locked .idx-list-row-grid {
    min-height: 56px !important;
    padding: 9px 0 !important;
}

.idx-grid-preview-locked .idx-year-label {
    padding-top: 15px !important;
}

.idx-grid-preview-locked .idx-list-standard .idx-flip-text {
    --idx-flip-height: 27px !important;
    height: 27px !important;
    line-height: 27px !important;
}

.idx-grid-preview-locked .idx-list-standard .idx-flip-copy {
    flex: 0 0 var(--idx-flip-height) !important;
    height: var(--idx-flip-height) !important;
    line-height: var(--idx-flip-height) !important;
}

@container (max-width: 1199px) {
    .idx-grid-preview-locked .idx-project-grid[data-grid-layout="figma"] {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        max-width: none !important;
    }
}

@container (max-width: 899px) {
    .idx-grid-preview-locked .idx-project-grid[data-grid-layout="figma"] {
        grid-template-columns: 1fr !important;
        max-width: none !important;
        row-gap: 52px !important;
    }
}

@container (max-width: 899px) {
    .idx-grid-preview-locked .idx-list-view .idx-year-group {
        grid-template-columns: 1fr !important;
        column-gap: 0 !important;
    }

    .idx-grid-preview-locked .idx-list-view .idx-year-label,
    .idx-grid-preview-locked .idx-list-view .idx-list-discipline,
    .idx-grid-preview-locked .idx-list-view .idx-col-discipline,
    .idx-grid-preview-locked .idx-list-view .idx-list-industry,
    .idx-grid-preview-locked .idx-list-view .idx-col-industry {
        display: none !important;
    }

    .idx-grid-preview-locked .idx-list-view .idx-list-content,
    .idx-grid-preview-locked .idx-list-view .idx-list-title {
        grid-column: 1 / -1 !important;
        min-width: 0 !important;
        width: 100% !important;
    }

    .idx-grid-preview-locked .idx-list-view .idx-list-row-grid {
        grid-template-columns: minmax(0, 1fr) !important;
        column-gap: 0 !important;
    }

    .idx-grid-preview-locked .idx-list-view .idx-title-cell {
        justify-self: stretch !important;
        text-align: left !important;
    }

    .idx-grid-preview-locked .idx-list-view .idx-year-rule,
    .idx-grid-preview-locked .idx-list-view .idx-row-divider,
    .idx-grid-preview-locked .idx-list-view .idx-list-bottom-rule {
        grid-column: 1 / -1 !important;
        width: 100% !important;
    }
}
`;
    IndexPage2.displayName = "IndexPage";
    addPropertyControls(IndexPage2, {
      view: {
        type: ControlType.Enum,
        title: "View",
        options: ["grid", "list"],
        optionTitles: ["Grid", "List"],
        defaultValue: "list",
        displaySegmentedControl: true
      },
      useCMS: {
        type: ControlType.Boolean,
        title: "Use CMS",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off"
      },
      cmsModuleUrl: {
        type: ControlType.String,
        title: "CMS Module",
        defaultValue: "",
        placeholder: "Optional module URL"
      },
      thumbnailVideoFieldIds: {
        type: ControlType.String,
        title: "Video Field",
        defaultValue: "SvOqFqdby"
      },
      projects: {
        type: ControlType.Array,
        title: "Projects",
        hidden: (props) => props.useCMS === true,
        control: {
          type: ControlType.Object,
          controls: {
            title: { type: ControlType.String, title: "Title" },
            category1: { type: ControlType.String, title: "Service 1" },
            category2: { type: ControlType.String, title: "Service 2" },
            category3: { type: ControlType.String, title: "Service 3" },
            industry: { type: ControlType.String, title: "Industry" },
            year: { type: ControlType.String, title: "Year" },
            thumbnail: { type: ControlType.Image, title: "Thumbnail" },
            thumbnailVideoLink: {
              type: ControlType.File,
              title: "Thumbnail Video",
              allowedFileTypes: ["mp4", "mov", "m4v", "webm"]
            },
            thumbnailStroke: {
              type: ControlType.Boolean,
              title: "Thumbnail Stroke",
              defaultValue: false
            },
            slug: { type: ControlType.String, title: "Slug" },
            sortOrder: {
              type: ControlType.Number,
              title: "Sorting Number"
            },
            isHomepage: { type: ControlType.Boolean, title: "Is Homepage" }
          }
        }
      },
      advanced: {
        type: ControlType.Object,
        title: "Advanced",
        buttonTitle: "Edit",
        icon: "effect",
        defaultValue: PREVIEW_ADVANCED_DEFAULT,
        controls: {
          textPrimary: {
            type: ControlType.Color,
            title: "Text Primary",
            defaultValue: PREVIEW_ADVANCED_DEFAULT.textPrimary
          },
          textSecondary: {
            type: ControlType.Color,
            title: "Text Secondary",
            defaultValue: PREVIEW_ADVANCED_DEFAULT.textSecondary
          },
          textTertiary: {
            type: ControlType.Color,
            title: "Text Tertiary",
            defaultValue: PREVIEW_ADVANCED_DEFAULT.textTertiary
          },
          bg: {
            type: ControlType.Color,
            title: "Background",
            defaultValue: PREVIEW_ADVANCED_DEFAULT.bg
          },
          dividerStrong: {
            type: ControlType.Color,
            title: "Divider Strong",
            defaultValue: PREVIEW_ADVANCED_DEFAULT.dividerStrong
          },
          dividerSubtle: {
            type: ControlType.Color,
            title: "Divider Subtle",
            defaultValue: PREVIEW_ADVANCED_DEFAULT.dividerSubtle
          },
          surfaceActive: {
            type: ControlType.Color,
            title: "Surface Active",
            defaultValue: PREVIEW_ADVANCED_DEFAULT.surfaceActive
          }
        }
      }
    });
  }
});

// output/playwright/index-dropdown-2026-10-30/harness/entry.tsx
import React3 from "react";
import { createRoot } from "react-dom/client";
var require_entry = __commonJS({
  "output/playwright/index-dropdown-2026-10-30/harness/entry.tsx"() {
    init_Wrapper();
    var projects = [{ "title": "Gaia", "category1": "Visual Identity", "category2": "UX/UI", "industry": "Nature", "year": "2026", "thumbnail": "https://framerusercontent.com/images/I8gYcpaNfASGUI6TqjkW8OpxW8I.png?width=3236&height=1810", "slug": "gaia" }, { "title": "AirPods Pro 3", "category1": "Visual Identity", "category2": "2D Motion", "industry": "Technology", "year": "2025", "thumbnail": "https://framerusercontent.com/images/JITjBIRyOd5DdC7juV7X5RwU9I.jpg?width=1600&height=900", "slug": "airpods" }, { "title": "Peak Energy", "category1": "2D Motion", "category2": "3D Motion", "industry": "Technology", "year": "2026", "thumbnail": "https://framerusercontent.com/images/JcoGr4ds2RlrOT9CCbYE5gnkvpY.jpg?width=1280&height=720", "slug": "peak-energy" }, { "title": "Motion Connect 2025", "category1": "2D Motion", "category2": "3D Motion", "industry": "Education", "year": "2025", "thumbnail": "https://framerusercontent.com/images/W592y16ERqrZ1qFuxRe3dcsv8I.jpg?width=1920&height=1080", "slug": "motion-connect-2025" }, { "title": "Simon & Schuster", "category1": "Strategy", "category2": "Visual Identity", "industry": "Literature", "year": "2024", "thumbnail": "https://framerusercontent.com/images/ZViKn9ASVVsE90tOfnWU7sW0U.png?width=1600&height=900", "slug": "simon-schuster" }, { "title": "National Park Playing Cards", "category1": "Product", "category2": "Packaging", "industry": "Nature", "year": "2019", "thumbnail": "https://framerusercontent.com/images/YdGKidrUlzOXfODfaQNqfCx5dM.png?width=1600&height=900", "slug": "national-park-cards" }, { "title": "Yomo", "category1": "Visual Identity", "category2": "UX/UI", "industry": "Health", "year": "2024", "thumbnail": "https://framerusercontent.com/images/PXsrzy7ezkkjSfUrVHhUuP2sk4k.jpg?width=1600&height=900", "slug": "yomo" }, { "title": "Highland Harvests", "category1": "Visual Identity", "category2": "Packaging", "industry": "Nature", "year": "2024", "thumbnail": "https://framerusercontent.com/images/jJW0KifU2kfkhlHdh7akkmu0XU.jpg?width=1600&height=893", "slug": "highland-harvests" }, { "title": "Weaponized Innocence", "category1": "Editorial", "category2": "Product", "industry": "Human Rights", "year": "2024", "thumbnail": "https://framerusercontent.com/images/BRh73XzVlRBoYNh03pKXVIYYPw.png?width=1600&height=900", "slug": "weaponized-innocence" }, { "title": "Wolff Olins x ArtCenter", "category1": "Visual Identity", "category2": "2D Motion", "industry": "Education", "year": "2024", "thumbnail": "https://framerusercontent.com/images/8fV7L1MlzeOAlHSxXchHzUHO7c.jpg?width=1600&height=900", "slug": "wolff-olins-x-artcenter" }, { "title": "Cellular Symphony", "category1": "3D Motion", "category2": "", "industry": "Science", "year": "2024", "thumbnail": "https://framerusercontent.com/images/j9uS8SZ6aEBOUihZfXOWVeSrVs8.jpg?width=1600&height=900", "slug": "cellular-symphony" }, { "title": "Seek Truth", "category1": "Editorial", "category2": "Visual Identity", "industry": "Human Rights", "year": "2023", "thumbnail": "https://framerusercontent.com/images/ZUrXNdcJocPWJF6jCmu0QBr2yEs.webp?width=1280&height=720", "slug": "seek-truth" }, { "title": "Independent Lens", "category1": "Editorial", "category2": "Visual Identity", "industry": "Human Rights", "year": "2023", "thumbnail": "https://framerusercontent.com/images/xgjosOS16LZVpd3huScx2lW1g.jpg?width=1600&height=893", "slug": "independent-lens" }, { "title": "TYPLDN", "category1": "Visual Identity", "category2": "", "industry": "Education", "year": "2023", "thumbnail": "https://framerusercontent.com/images/jchJlOWt16iY8J0NEXEfm3G8cTE.png?width=4438&height=2496", "slug": "typldn" }, { "title": "WhatsApp", "category1": "2D Motion", "category2": "Social Media", "industry": "Technology", "year": "2026", "thumbnail": "https://framerusercontent.com/images/mkLySgu9nIi7dlpTac2Q3InIU.png?width=1920&height=1080", "slug": "whatsapp" }, { "title": "Caliper Sans", "category1": "Type Design", "category2": "Visual Identity", "industry": "Technology", "year": "2026", "thumbnail": "https://framerusercontent.com/images/03ONMMvWNiSZ9RkcgL2UNqKiYQE.png?width=4096&height=2304", "slug": "caliper" }, { "title": "Optro CRX", "category1": "2D Motion", "category2": "", "industry": "Technology", "year": "2026", "thumbnail": "https://framerusercontent.com/images/Y0QyDkheHTHPUcxQIQ3PYc6lWKk.jpg?width=1920&height=1080", "slug": "optro" }];
    createRoot(document.getElementById("root")).render(/* @__PURE__ */ React3.createElement(IndexPage2, { useCMS: false, projects, view: "list" }));
  }
});
export default require_entry();
