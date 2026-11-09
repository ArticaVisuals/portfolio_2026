const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('code/components/CaseStudyLightbox.tsx', 'utf8');
let fn = source.slice(source.indexOf('function scheduleFramerRouteFallback('), source.indexOf('function stabilizeTopScrollAfterRoute('));
fn = fn.replace('router: FramerRouter | undefined', 'router').replace('match: RouterMatch', 'match').replace('href: string', 'href').replace('fromHref: string', 'fromHref').replace('const timers: number[]', 'const timers');
function harness() {
  const timers = new Map(), listeners = new Map();
  let next = 0, navigations = 0;
  const window = {
    location: { href: 'https://micahhoang.com/case-studies/gaia', assign() { navigations++; } },
    setTimeout(cb, time) { timers.set(++next, {cb, time}); return next; },
    clearTimeout(id) { timers.delete(id); },
    addEventListener(name, cb) { listeners.set(name, cb); },
    removeEventListener(name, cb) { if (listeners.get(name) === cb) listeners.delete(name); },
  };
  const ctx = vm.createContext({window, URL, getSameOriginUrl: href => new URL(href, window.location.href), stripTrailingSlash: s => s.replace(/\/+$/, ''), navigateFramerRoute: () => { navigations++; return true; }});
  vm.runInContext(fn + '\nscheduleFramerRouteFallback({}, {}, "/about", window.location.href)', ctx);
  return {window, timers, listeners, count: () => navigations, emit: name => listeners.get(name)?.(), run: time => { for (const [id, task] of [...timers]) if (task.time <= time && timers.has(id)) { timers.delete(id); task.cb(); } }};
}
for (const event of ['popstate','pagehide']) {
  const h = harness(); h.run(180); assert.equal(h.count(), 1); h.emit(event); h.run(900);
  assert.equal(h.count(), 1, event + ' must cancel the delayed replay'); assert.equal(h.listeners.size, 0);
}
{
  const h = harness(); h.emit('pagehide'); h.run(900); assert.equal(h.count(), 0); assert.equal(h.timers.size, 0);
}
{
  const h = harness(); h.window.location.href='https://micahhoang.com/about'; h.run(180); h.window.location.href='https://micahhoang.com/case-studies/gaia'; h.run(900); assert.equal(h.count(), 0); assert.equal(h.listeners.size, 0);
}
{
  const h = harness(); h.run(900); assert.equal(h.count(), 2); assert.equal(h.listeners.size, 0); assert.equal(h.timers.size, 0);
}
console.log('Route fallback: Back, pagehide, arrival, and retry cleanup checks passed.');
