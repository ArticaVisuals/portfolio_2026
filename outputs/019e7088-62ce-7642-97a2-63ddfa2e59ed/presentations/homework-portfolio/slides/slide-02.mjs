import { specs } from "./specs.mjs";
import { buildSlide } from "./helpers.mjs";

export async function slide02(presentation, ctx) {
  return buildSlide(presentation, ctx, specs[1]);
}
