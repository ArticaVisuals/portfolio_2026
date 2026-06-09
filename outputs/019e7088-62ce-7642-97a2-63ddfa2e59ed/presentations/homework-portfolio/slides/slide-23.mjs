import { specs } from "./specs.mjs";
import { buildSlide } from "./helpers.mjs";

export async function slide23(presentation, ctx) {
  return buildSlide(presentation, ctx, specs[22]);
}
