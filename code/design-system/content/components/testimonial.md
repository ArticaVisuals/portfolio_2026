---
title: Testimonial
section: Components
order: 18
description: A large quote with name and role, stepped with typed arrows. Used inside case studies.
status: live
framer: TestimonialLineReveal (tpDdaaJ)
codeFileId: tpDdaaJ
classes: [mh-testimonial, mh-testimonial__quote, mh-testimonial__cite, mh-testimonial__name, mh-testimonial__role, mh-testimonial__controls]
tokens: [font.family.sans, type.label, color.*.text.muted, motion.duration.base]
---

# Testimonial

## Examples

```html example
<figure class="mh-testimonial" data-items='[{"quote":"Micah turned a loose brief into a system the whole team could build on.","name":"Client Name","role":"Creative Director, Studio"},{"quote":"Every decision came with a reason, and every reason held up.","name":"Second Client","role":"Head of Brand, Company"}]'>
  <p class="mh-label">What our clients say:</p>
  <blockquote class="mh-testimonial__quote">Micah turned a loose brief into a system the whole team could build on.</blockquote>
  <figcaption class="mh-testimonial__cite">
    <span class="mh-testimonial__name">Client Name</span>
    <span class="mh-testimonial__role">Creative Director, Studio</span>
  </figcaption>
  <div class="mh-testimonial__controls mh-label">
    <button class="mh-action" type="button" data-dir="prev" aria-label="Previous testimonial">←</button>
    <button class="mh-action" type="button" data-dir="next" aria-label="Next testimonial">→</button>
  </div>
</figure>
```

The quotes above are placeholders. Use only real, attributed quotes.

## Usage

- Quote in GT Standard Regular, 48px with 1.12 leading (×0.8 on tablet, ×0.62 on mobile), max 820px wide.
- Name 20px, role 16px muted. Label 13px mono above.
- Arrows are typed characters (← →) in mono, not icons. Autoplay is off.
- On mobile the live component clamps long quotes to 6 lines with a "Read more".
- Lines reveal one by one (mask rise) when the quote changes.

## API

| Class / attribute | Notes |
| --- | --- |
| `mh-testimonial` | `figure`; `data-items` JSON array of `{quote, name, role}` enables stepping |
| `mh-testimonial__quote` | `blockquote` |
| `mh-testimonial__cite` | `figcaption` with `__name` and `__role` |
| `[data-dir="prev" \| "next"]` | Step buttons |

## Framer mapping

- `TestimonialLineReveal` (`tpDdaaJ`). Controls: Label ("What our clients say:"), Arrows (← →), Autoplay off / 5s, Align left, Mobile Read More on, Clamp Lines 6, Max Width 820, Quote Size 48, Tablet Scale 0.8, Mobile Scale 0.62, Quote Leading 1.12, Name Size 20, Role Size 16, Label Size 13.

## Don't

- Don't use quotation-mark graphics, avatars or star ratings.
- Don't invent or paraphrase testimonials.
