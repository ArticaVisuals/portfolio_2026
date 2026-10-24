import * as THREE from 'three';

// The Vanish full canvas: V1..V4 laid side by side in pixel columns (224 + 560 + 560 + 224).
export const VANISH_CANVAS = [1568, 560];

const vert = /* glsl */`
varying vec2 vUv;
varying vec3 vWorld;
void main() {
  vUv = uv;
  vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// uvXform maps the surface UV to media UV: media = uv * xy + zw. Outside 0..1 is black (letterbox).
//
// Media is sampled with textureGrad from the continuous UV, outside any branch, so mipmapped
// filtering stays stable (no dark speckle when fine detail is shrunk at a distance).
//
// Vanish mesh LED (isMesh) composites like Photoshop "Lighten": the blend takes max(screen, room)
// per channel, so dark content is fully transparent and bright content glows over what is behind.
// Up close the drawing's module structure shows: 14 pixel slats per 125 mm row (8.9 mm pitch),
// LED dots on the real pixel grid, rails every 250 mm and 6 mm module gaps. The pattern is
// normalised and box-filtered, so at distance it averages to the content itself.
const frag = /* glsl */`
uniform sampler2D map;
uniform float hasMap;
uniform vec4 uvXform;
uniform float brightness;
uniform float isMesh;
uniform float highlight;
// Second output drawn on top (e.g. a 16:9 Keynote box over the widescreen background).
// ovRect: content rectangle in surface UV (x, y, w, h). ovBorder: frame width in UV around it.
uniform float ovOn;
uniform sampler2D ovMap;
uniform float ovHas;
uniform vec4 ovRect;
uniform vec4 ovXform;
uniform vec2 ovBorder;
uniform vec3 ovBorderColor;
uniform vec2 sizeMM;   // active area in mm
uniform vec2 pxCount;  // LED pixels across the active area
uniform float meshGain;     // Vanish brightness boost
uniform float meshDetail;   // 0 = smooth glow, 1 = full slat / dot structure
varying vec2 vUv;
varying vec3 vWorld;
bool in01(vec2 p) { return p.x >= 0.0 && p.x <= 1.0 && p.y >= 0.0 && p.y <= 1.0; }

// Box-filtered periodic pulse: fraction of the pixel footprint (w, in periods) covered by a
// pulse of duty d centred in each period of x.
float F(float x, float d) { return floor(x) * d + clamp(fract(x) - (1.0 - d) * 0.5, 0.0, d); }
float pulse(float x, float d, float w) { w = max(w, 1e-4); return (F(x + 0.5 * w, d) - F(x - 0.5 * w, d)) / w; }

void main() {
  vec2 uv = vUv;
  if (isMesh > 0.5) uv = (floor(vUv * pxCount) + 0.5) / pxCount; // sample at LED pixel centres
  vec2 mc = vUv * uvXform.xy + uvXform.zw;                        // continuous, for filtering
  vec2 m = uv * uvXform.xy + uvXform.zw;
  vec4 t = textureGrad(map, m, dFdx(mc), dFdy(mc));
  vec3 c = (hasMap > 0.5 && in01(m)) ? t.rgb * t.a : vec3(0.0);   // transparent areas read as black
  vec2 q = (vUv - ovRect.xy) / ovRect.zw;
  vec2 mo = q * ovXform.xy + ovXform.zw;
  vec2 mdx = dFdx(mo), mdy = dFdy(mo);                            // gradients outside the branch
  if (ovOn > 0.5) {
    vec2 lo = ovRect.xy - ovBorder, hi = ovRect.xy + ovRect.zw + ovBorder;
    if (vUv.x >= lo.x && vUv.x <= hi.x && vUv.y >= lo.y && vUv.y <= hi.y) {
      vec4 to = textureGrad(ovMap, mo, mdx, mdy);
      if (in01(q)) c = (ovHas > 0.5 && in01(mo)) ? to.rgb * to.a : vec3(0.0);
      else c = ovBorderColor;
    }
  }
  c *= brightness;
  float a = 1.0;
  if (isMesh > 0.5) {
    vec2 mm = vUv * sizeMM;
    float pitch = 125.0 / 14.0;                         // slat pitch, mm
    float sz = mm.y / pitch;
    float slat = pulse(sz, 0.34, fwidth(sz));            // dark slat body
    float dx = mm.x / (sizeMM.x / pxCount.x);
    float dots = pulse(dx, 0.45, fwidth(dx));            // LED packages along the slat
    float gx = pulse((mm.x - 497.0) / 500.0 + 0.5, 6.0 / 500.0, fwidth(mm.x / 500.0));
    float gz = pulse((mm.y - 122.0) / 125.0 + 0.5, 6.0 / 125.0, fwidth(mm.y / 125.0));
    float fx = fwidth(mm.x / 500.0);
    float rails = pulse((mm.x - 14.0) / 500.0 + 0.5, 28.0 / 500.0, fx)
                + pulse((mm.x - 247.0) / 500.0 + 0.5, 8.0 / 500.0, fx)
                + pulse((mm.x - 490.0) / 500.0 + 0.5, 7.0 / 500.0, fx);
    float open = (1.0 - gx) * (1.0 - gz);
    // Emitting area, normalised so its average over a module is 1 (the content's own brightness).
    float lit = slat * dots * open * (1.0 - clamp(rails, 0.0, 1.0)) / (0.34 * 0.45 * 0.85);
    c *= meshGain * mix(1.0, lit, meshDetail);
    c /= max(1.0, max(c.r, max(c.g, c.b)));               // limit brightness without losing hue
  }
  gl_FragColor = vec4(c, a);
  #include <colorspace_fragment>
}`;

export function makeScreen(def) {
  const [w, h] = def.size;
  const mat = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      map: { value: null },
      hasMap: { value: 0 },
      uvXform: { value: new THREE.Vector4(1, 1, 0, 0) },
      brightness: { value: 1 },
      isMesh: { value: def.kind === 'mesh' ? 1 : 0 },
      highlight: { value: 0 },
      ovOn: { value: 0 },
      ovMap: { value: null },
      ovHas: { value: 0 },
      ovRect: { value: new THREE.Vector4(0, 0, 1, 1) },
      ovXform: { value: new THREE.Vector4(1, 1, 0, 0) },
      ovBorder: { value: new THREE.Vector2(0, 0) },
      ovBorderColor: { value: new THREE.Color(0, 0, 0) },
      sizeMM: { value: new THREE.Vector2(def.size[0] * 1000, def.size[1] * 1000) },
      pxCount: { value: new THREE.Vector2(def.pixels[0], def.pixels[1]) },
      meshGain: { value: 1.35 },
      meshDetail: { value: 0.6 },
    },
    toneMapped: false,
    // Win depth ties against anything left near the LED face.
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -4,
  });
  if (def.kind === 'mesh') {
    // Lighten: result = max(screen, what is behind), per channel.
    mat.transparent = true;
    mat.depthWrite = false;
    mat.blending = THREE.CustomBlending;
    mat.blendEquation = THREE.MaxEquation;
    mat.blendSrc = THREE.OneFactor;
    mat.blendDst = THREE.OneFactor;
  }
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  mesh.position.fromArray(def.center);
  mesh.rotation.y = Math.atan2(def.normal[0], def.normal[2]);
  mesh.name = def.id;
  mesh.userData.screen = def;
  mesh.renderOrder = def.kind === 'mesh' ? 2 : 0;
  return mesh;
}

// Selection frame, drawn just proud of the surface.
export function makeOutline(def) {
  const [w, h] = def.size;
  const g = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-w / 2, -h / 2, 0), new THREE.Vector3(w / 2, -h / 2, 0),
    new THREE.Vector3(w / 2, h / 2, 0), new THREE.Vector3(-w / 2, h / 2, 0), new THREE.Vector3(-w / 2, -h / 2, 0),
  ]);
  const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xE5FE52, depthTest: false, transparent: true }));
  line.renderOrder = 10;
  return line;
}

// canvas-UV -> media-UV for a fit mode. Returns {sx, sy, ox, oy}: media = (canvas - o) / s.
function fitRect(cw, ch, mw, mh, fit) {
  if (fit === 'stretch' || !mw || !mh) return { sx: 1, sy: 1, ox: 0, oy: 0 };
  const as = cw / ch, am = mw / mh;
  const wider = am > as;
  if ((fit === 'fit') === wider) { const f = as / am; return { sx: 1, sy: f, ox: 0, oy: (1 - f) / 2 }; }
  const f = am / as; return { sx: f, sy: 1, ox: (1 - f) / 2, oy: 0 };
}

// panel: sub-rectangle of the canvas this surface shows ({x, y, w, h} in 0..1), canvas = [px w, px h].
export function applyMedia(mesh, texture, mediaSize, fit, canvas, panel = { x: 0, y: 0, w: 1, h: 1 }) {
  const u = mesh.material.uniforms;
  u.map.value = texture || null;
  u.hasMap.value = texture ? 1 : 0;
  const r = fitRect(canvas[0], canvas[1], mediaSize?.[0], mediaSize?.[1], fit);
  u.uvXform.value.set(panel.w / r.sx, panel.h / r.sy, (panel.x - r.ox) / r.sx, (panel.y - r.oy) / r.sy);
}

// Overlay a second output on a surface. o = null turns it off, otherwise
// { texture, mediaSize, fit, rect: {x, y, w, h} in canvas px from the top-left, borderPx, canvas: [w, h] }.
export function applyOverlay(mesh, o) {
  const u = mesh.material.uniforms;
  u.ovOn.value = o ? 1 : 0;
  if (!o) return;
  const [cw, ch] = o.canvas;
  const { x, y, w, h } = o.rect;
  u.ovRect.value.set(x / cw, 1 - (y + h) / ch, w / cw, h / ch);
  u.ovBorder.value.set(o.borderPx / cw, o.borderPx / ch);
  u.ovMap.value = o.texture || null;
  u.ovHas.value = o.texture ? 1 : 0;
  const r = fitRect(w, h, o.mediaSize?.[0], o.mediaSize?.[1], o.fit);
  u.ovXform.value.set(1 / r.sx, 1 / r.sy, -r.ox / r.sx, -r.oy / r.sy);
}

// ------------------------------------------------------------ test cards
function cardSize(def) {
  const [pw, ph] = def.pixels;
  const k = def.kind === 'mesh' ? 2 : def.kind === 'tv' ? 0.5 : 1;
  return [Math.round(pw * k), Math.round(ph * k)];
}

export function makeTestCard(def) {
  const [W, H] = cardSize(def);
  const k = W / def.pixels[0];
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#0F2230'; g.fillRect(0, 0, W, H);

  // Pixel grid every 80 px of the real canvas; brighter every 320.
  for (let px = 0; px <= def.pixels[0]; px += 80) {
    g.fillStyle = px % 320 === 0 ? 'rgba(233,232,225,0.28)' : 'rgba(233,232,225,0.10)';
    g.fillRect(Math.round(px * k), 0, Math.max(1, k), H);
  }
  for (let py = 0; py <= def.pixels[1]; py += 80) {
    g.fillStyle = py % 320 === 0 ? 'rgba(233,232,225,0.28)' : 'rgba(233,232,225,0.10)';
    g.fillRect(0, Math.round(py * k), W, Math.max(1, k));
  }

  if (def.guides) {
    const ob = def.guides.obstructed * k;
    g.fillStyle = 'rgba(240,96,60,0.28)';
    g.fillRect(0, 0, ob, H); g.fillRect(W - ob, 0, ob, H);
    g.strokeStyle = '#E5FE52'; g.lineWidth = 6 * k;
    g.strokeRect(ob, 3 * k, W - 2 * ob, H - 6 * k);
    g.save(); g.fillStyle = 'rgba(233,232,225,0.8)'; g.font = `500 ${28 * k}px "IBM Plex Mono"`;
    g.translate(ob / 2, H / 2); g.rotate(-Math.PI / 2); g.textAlign = 'center'; g.fillText('OBSTRUCTED 352 PX', 0, 10 * k);
    g.restore();
    g.save(); g.fillStyle = 'rgba(233,232,225,0.8)'; g.font = `500 ${28 * k}px "IBM Plex Mono"`;
    g.translate(W - ob / 2, H / 2); g.rotate(Math.PI / 2); g.textAlign = 'center'; g.fillText('OBSTRUCTED 352 PX', 0, 10 * k);
    g.restore();
    // 16:9 slide zone (1920x1080 scaled to 1280 tall = 2276 px wide)
    const sw = 2276 * k;
    g.setLineDash([20 * k, 14 * k]); g.strokeStyle = 'rgba(233,232,225,0.6)'; g.lineWidth = 3 * k;
    g.strokeRect((W - sw) / 2, 0, sw, H); g.setLineDash([]);
  }

  // Border and centre cross.
  g.strokeStyle = '#E9E8E1'; g.lineWidth = 4 * Math.max(k, 0.5);
  g.strokeRect(2, 2, W - 4, H - 4);
  g.beginPath(); g.moveTo(W / 2, H / 2 - 40 * k); g.lineTo(W / 2, H / 2 + 40 * k);
  g.moveTo(W / 2 - 40 * k, H / 2); g.lineTo(W / 2 + 40 * k, H / 2); g.stroke();

  // Labels, sized to the canvas height.
  const narrow = W / H < 0.6;
  const big = narrow ? W * 0.28 : H * 0.16;
  g.fillStyle = '#E9E8E1'; g.textAlign = 'center';
  g.font = `500 ${big}px "Inter Tight"`;
  g.fillText(def.id, W / 2, H * 0.34);
  g.font = `500 ${big * 0.26}px "IBM Plex Mono"`;
  g.fillStyle = 'rgba(233,232,225,0.75)';
  const lines = narrow
    ? [`${def.pixels[0]}×${def.pixels[1]}`, `${(def.size[0]).toFixed(2)}×${def.size[1].toFixed(2)} M`,
       def.canvasColumn != null ? `COL ${def.canvasColumn}–${def.canvasColumn + def.pixels[0] - 1}` : '']
    : [def.name.toUpperCase(), def.size ? `${def.pixels[0]} × ${def.pixels[1]} PX · ${def.size[0].toFixed(2)} × ${def.size[1].toFixed(2)} M` : `${def.pixels[0]} × ${def.pixels[1]} PX SIGNAL`];
  lines.forEach((t, i) => t && g.fillText(t, W / 2, H * 0.62 + i * big * 0.36));

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return { texture: tex, size: [W, H], thumb: c };
}

// Transparent overlay for the Center LED: obstructed bands + safe-area and 16:9 lines.
export function makeGuides(def) {
  const [W, H] = [1840, 640];
  const k = W / def.pixels[0];
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  const ob = def.guides.obstructed * k;
  g.fillStyle = 'rgba(8,18,25,0.55)';
  g.fillRect(0, 0, ob, H); g.fillRect(W - ob, 0, ob, H);
  g.strokeStyle = '#E5FE52'; g.lineWidth = 3;
  g.strokeRect(ob, 1.5, W - 2 * ob, H - 3);
  g.setLineDash([12, 9]); g.strokeStyle = 'rgba(233,232,225,0.8)'; g.lineWidth = 2;
  const sw = 2276 * k; g.strokeRect((W - sw) / 2, 1, sw, H - 2);
  g.setLineDash([]);
  g.fillStyle = 'rgba(233,232,225,0.9)'; g.font = '500 16px "IBM Plex Mono"';
  g.fillText('SAFE 2976×1280', ob + 10, 26);
  g.textAlign = 'right'; g.fillText('16:9 · 2276×1280', (W + sw) / 2 - 10, H - 14);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(...def.size),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
  m.renderOrder = 5;
  return m;
}
