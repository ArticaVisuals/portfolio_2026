
import fs from "node:fs/promises";
import { theme } from "./specs.mjs";

const W = 1280;
const H = 720;
const margin = 58;
const font = "Inter";

async function dataUrl(filePath) {
  const ext = filePath.toLowerCase().endsWith(".png") ? "png" : "jpeg";
  const buf = await fs.readFile(filePath);
  return "data:image/" + ext + ";base64," + buf.toString("base64");
}

function projectTheme(id) {
  return theme.projects[id] || { accent: theme.ink, bg: theme.bg, name: "" };
}

function shape(slide, position, fill = { type: "none" }, line = { width: 0, fill: theme.bg }) {
  return slide.shapes.add({ geometry: "rect", position, fill, line });
}

function addText(slide, text, position, style = {}) {
  const s = shape(slide, position, { type: "none" }, { width: 0, fill: theme.bg });
  s.text.style = {
    typeface: font,
    fontSize: style.size ?? 28,
    color: style.color ?? theme.ink,
    bold: style.bold ?? false,
    italic: style.italic ?? false,
    alignment: style.align ?? "left",
    verticalAlignment: style.valign ?? "top",
  };
  s.text = Array.isArray(text) ? text.join("\n") : String(text || "");
  return s;
}

function addPill(slide, text, x, y, color, textColor = theme.light) {
  shape(slide, { left: x, top: y, width: 220, height: 34 }, { type: "solid", color }, { width: 0, fill: color });
  addText(slide, text, { left: x + 14, top: y + 7, width: 192, height: 20 }, { size: 13, color: textColor, bold: true });
}

function bg(slide, color = theme.bg) {
  shape(slide, { left: 0, top: 0, width: W, height: H }, { type: "solid", color }, { width: 0, fill: color });
}

function header(slide, spec) {
  const pt = projectTheme(spec.id);
  const label = [pt.name, spec.stage].filter(Boolean).join(" / ");
  addText(slide, label, { left: margin, top: 26, width: 600, height: 22 }, { size: 13, color: theme.muted, bold: true });
  shape(slide, { left: margin, top: 55, width: W - margin * 2, height: 1 }, { type: "solid", color: theme.hairline }, { width: 0, fill: theme.hairline });
  shape(slide, { left: margin, top: 55, width: 138, height: 3 }, { type: "solid", color: pt.accent }, { width: 0, fill: pt.accent });
}

async function addImage(slide, filePath, position, fit = "cover", alt = "") {
  if (!filePath) return null;
  try {
    const image = slide.images.add({
      dataUrl: await dataUrl(filePath),
      alt,
      position,
      fit,
    });
    return image;
  } catch {
    const box = shape(slide, position, { type: "solid", color: "#e5e0d6" }, { width: 0, fill: "#e5e0d6" });
    box.text.style = { typeface: font, fontSize: 14, color: theme.muted, alignment: "center", verticalAlignment: "middle" };
    box.text = "Missing asset";
    return box;
  }
}

function bullets(slide, items, x, y, width, color = theme.ink) {
  const text = items.map((item) => "• " + item).join("\n");
  return addText(slide, text, { left: x, top: y, width, height: Math.max(80, items.length * 36) }, { size: 22, color });
}

async function cover(slide, spec) {
  bg(slide, theme.dark);
  const frames = [
    { left: 692, top: 62, width: 236, height: 596 },
    { left: 940, top: 116, width: 248, height: 238 },
    { left: 940, top: 374, width: 248, height: 238 },
  ];
  for (let i = 0; i < Math.min(spec.images.length, frames.length); i++) {
    await addImage(slide, spec.images[i], frames[i], "cover", "portfolio project image");
  }
  shape(slide, { left: 58, top: 70, width: 110, height: 6 }, { type: "solid", color: "#f05b34" }, { width: 0, fill: "#f05b34" });
  addText(slide, spec.title, { left: 58, top: 138, width: 560, height: 154 }, { size: 72, color: theme.light, bold: true });
  addText(slide, spec.subtitle, { left: 62, top: 333, width: 540, height: 80 }, { size: 23, color: "#d4cab8" });
  addText(slide, "Micah Hoang", { left: 62, top: 596, width: 300, height: 36 }, { size: 24, color: theme.light, bold: true });
  addText(slide, "Homework compilation draft", { left: 62, top: 632, width: 360, height: 28 }, { size: 15, color: "#a99f91" });
}

async function contents(slide, spec) {
  bg(slide);
  addText(slide, spec.title, { left: margin, top: 64, width: 480, height: 62 }, { size: 52, bold: true });
  addText(slide, "Five selected projects, each organized by introduction, process, and outcomes.", { left: margin, top: 134, width: 540, height: 48 }, { size: 20, color: theme.muted });
  const startY = 225;
  for (let i = 0; i < spec.items.length; i++) {
    const item = spec.items[i];
    const pt = projectTheme(item.id);
    const y = startY + i * 78;
    addText(slide, String(item.index).padStart(2, "0"), { left: 64, top: y, width: 54, height: 34 }, { size: 21, color: pt.accent, bold: true });
    addText(slide, pt.name, { left: 130, top: y - 4, width: 270, height: 34 }, { size: 26, bold: true });
    addText(slide, item.metadata, { left: 410, top: y + 1, width: 530, height: 26 }, { size: 15, color: theme.muted });
    addText(slide, item.oneLine, { left: 130, top: y + 33, width: 870, height: 28 }, { size: 16, color: theme.muted });
    shape(slide, { left: 1060, top: y + 10, width: 96, height: 16 }, { type: "solid", color: pt.accent }, { width: 0, fill: pt.accent });
  }
}

async function statement(slide, spec) {
  bg(slide, "#f8f5ef");
  addText(slide, spec.title, { left: margin, top: 64, width: 520, height: 66 }, { size: 54, bold: true });
  let y = 188;
  for (const paragraph of spec.body) {
    addText(slide, paragraph, { left: margin, top: y, width: 810, height: 74 }, { size: 26, color: theme.ink });
    y += 116;
  }
  shape(slide, { left: 972, top: 100, width: 140, height: 500 }, { type: "solid", color: "#151515" }, { width: 0, fill: "#151515" });
  addText(slide, "Intro\nProcess\nOutcomes", { left: 1000, top: 172, width: 110, height: 280 }, { size: 28, color: theme.light, bold: true });
}

async function projectDivider(slide, spec) {
  const pt = projectTheme(spec.id);
  bg(slide, pt.bg);
  shape(slide, { left: 0, top: 0, width: 32, height: H }, { type: "solid", color: pt.accent }, { width: 0, fill: pt.accent });
  await addImage(slide, spec.image, { left: 690, top: 0, width: 590, height: 720 }, "cover", spec.project);
  addText(slide, spec.project, { left: 70, top: 96, width: 530, height: 90 }, { size: 68, bold: true, color: theme.ink });
  addText(slide, spec.metadata, { left: 76, top: 198, width: 560, height: 26 }, { size: 15, bold: true, color: pt.accent });
  addText(slide, spec.subtitle, { left: 76, top: 288, width: 520, height: 132 }, { size: 28, color: theme.ink });
  addPill(slide, "Introduction", 76, 564, pt.accent);
  addPill(slide, "Process", 306, 564, pt.accent);
  addPill(slide, "Outcomes", 536, 564, pt.accent);
}

async function split(slide, spec) {
  const pt = projectTheme(spec.id);
  bg(slide);
  header(slide, spec);
  const imagePos = spec.reverse
    ? { left: margin, top: 112, width: 498, height: 530 }
    : { left: 724, top: 112, width: 498, height: 530 };
  const textX = spec.reverse ? 638 : margin;
  await addImage(slide, spec.image, imagePos, "cover", spec.title);
  addText(slide, spec.title, { left: textX, top: 122, width: 540, height: 86 }, { size: 46, bold: true });
  addText(slide, spec.body, { left: textX + 2, top: 236, width: 520, height: 260 }, { size: 25, color: theme.ink });
  shape(slide, { left: textX + 2, top: 540, width: 132, height: 6 }, { type: "solid", color: pt.accent }, { width: 0, fill: pt.accent });
}

async function mosaic(slide, spec) {
  const pt = projectTheme(spec.id);
  bg(slide);
  header(slide, spec);
  addText(slide, spec.title, { left: margin, top: 84, width: 550, height: 94 }, { size: 35, bold: true });
  addText(slide, spec.body, { left: margin, top: 190, width: 486, height: 128 }, { size: 18, color: theme.muted });
  shape(slide, { left: margin, top: 344, width: 120, height: 5 }, { type: "solid", color: pt.accent }, { width: 0, fill: pt.accent });
  const images = spec.images || [];
  const layout = imageLayout(images.length);
  for (let i = 0; i < images.length; i++) {
    await addImage(slide, images[i], layout[i], i === 0 && images.length <= 3 ? "cover" : "contain", spec.title);
  }
}

function imageLayout(count) {
  if (count <= 3) {
    return [
      { left: 584, top: 96, width: 638, height: 392 },
      { left: 584, top: 506, width: 306, height: 126 },
      { left: 916, top: 506, width: 306, height: 126 },
    ].slice(0, count);
  }
  if (count <= 5) {
    return [
      { left: 552, top: 96, width: 314, height: 250 },
      { left: 886, top: 96, width: 314, height: 250 },
      { left: 552, top: 366, width: 204, height: 266 },
      { left: 774, top: 366, width: 204, height: 266 },
      { left: 996, top: 366, width: 204, height: 266 },
    ].slice(0, count);
  }
  return [
    { left: 536, top: 92, width: 220, height: 168 },
    { left: 774, top: 92, width: 220, height: 168 },
    { left: 1012, top: 92, width: 220, height: 168 },
    { left: 536, top: 282, width: 220, height: 168 },
    { left: 774, top: 282, width: 220, height: 168 },
    { left: 1012, top: 282, width: 220, height: 168 },
    { left: 536, top: 472, width: 220, height: 168 },
    { left: 774, top: 472, width: 220, height: 168 },
    { left: 1012, top: 472, width: 220, height: 168 },
  ].slice(0, count);
}

async function reflection(slide, spec) {
  const pt = projectTheme(spec.id);
  bg(slide, pt.bg);
  header(slide, spec);
  addText(slide, spec.title, { left: margin, top: 96, width: 520, height: 62 }, { size: 42, bold: true });
  addText(slide, spec.body, { left: margin, top: 182, width: 520, height: 122 }, { size: 22, color: theme.ink });
  bullets(slide, spec.bullets || [], margin, 352, 514, theme.ink);
  await addImage(slide, spec.image, { left: 690, top: 96, width: 488, height: 516 }, "contain", spec.title);
  shape(slide, { left: 646, top: 96, width: 10, height: 516 }, { type: "solid", color: pt.accent }, { width: 0, fill: pt.accent });
}

async function closing(slide, spec) {
  bg(slide, theme.dark);
  addText(slide, spec.title, { left: margin, top: 86, width: 600, height: 70 }, { size: 54, bold: true, color: theme.light });
  let y = 206;
  for (const paragraph of spec.body) {
    addText(slide, paragraph, { left: margin, top: y, width: 780, height: 76 }, { size: 25, color: "#e8dfcf" });
    y += 108;
  }
  shape(slide, { left: 956, top: 102, width: 166, height: 470 }, { type: "solid", color: "#f05b34" }, { width: 0, fill: "#f05b34" });
  addText(slide, "PDF\nPPTX\nFigma", { left: 988, top: 170, width: 120, height: 240 }, { size: 36, bold: true, color: theme.light });
}

export async function buildSlide(presentation, ctx, spec) {
  const slide = presentation.slides.add();
  if (spec.type === "cover") await cover(slide, spec);
  else if (spec.type === "contents") await contents(slide, spec);
  else if (spec.type === "statement") await statement(slide, spec);
  else if (spec.type === "projectDivider") await projectDivider(slide, spec);
  else if (spec.type === "split") await split(slide, spec);
  else if (spec.type === "mosaic") await mosaic(slide, spec);
  else if (spec.type === "reflection") await reflection(slide, spec);
  else if (spec.type === "closing") await closing(slide, spec);
  return slide;
}
