# Mockup Blueprint — <Section name>

> Fill this **before writing any code**. Get user sign-off on the blueprint, THEN build.
> Goal: enumerate every element + property from the mockup so no difference is discovered
> reactively later. One row here = one thing to build and one thing to self-verify.

- **Design source:** `docs/design/<file>.png` · region crop: `.report-shots/ac/design-<sec>.png`
- **Page / position in page:** <e.g. home, after "Shop by Need">
- **Section type / base file:** `custom-<sec>.liquid` (or Dawn `<section>`)

## 1. Crops captured (high zoom)
- [ ] Whole-section crop
- [ ] One repeating unit at 3–4× (card / tile / row)
- [ ] Any small detail (badge, icon, button) zoomed enough to read weight + color

## 2. Layout
- Container width / alignment: <full-bleed | page-width | narrow>
- Column count (desktop / tablet / mobile):
- Gap above section (header→section, tile→tile):
- Element order (top→bottom, left→right):

## 3. Element inventory (every visible element)
| Element | Text / content | Font family | Size | Weight | Case / tracking | Color (sampled hex) | Align | Position / inset | Icon | State / notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Heading | | Manrope | | 800 | | #171B18 | center | | – | |
| … | | | | | | | | | | |

> Sample colors, don't guess: `python3 -c "from PIL import Image; im=Image.open('...').convert('RGB'); print(im.getpixel((x,y)))"`.

## 4. "Easy-to-miss" checklist (answer ALL — these are the ones that caused rework)
- **Badge**: shown? on which items? text (per item)? position? color scheme?
- **Rating**: stars shown? star color? numeric value shown (e.g. "4.7")? review count format "(66)"?
- **Price**: sale-first or compare-first? currency suffix ("USD")? sale color? compare-at struck + color?
- **Button / CTA**: present at all? label? pill/outline/solid? arrow glyph? hover?
- **Swatches / options**: shown? shape (dot/square)? size? "+N" overflow?
- **Card**: corner radius? image ratio? shadow/border? hover lift?
- **Link**: underline? arrow? right/edge alignment (align to grid edge, not container edge)?
- **Slider/carousel**: any ← → arrows or dots = it's a SLIDER (more items off-screen than shown) — build the scroll + wire arrows, and add enough items to actually scroll.
- **Section header band**: crop the WHOLE section including its top row — a panel/column can have its own heading + controls above the visible content.
- **Spacing**: any element aligned to the product-grid edge rather than the page padding?

## 5. Data requirements (what must exist for this to render)
- Metafields: <namespace.key = value, per product>
- Products / collection / sort:
- Images (image_url CDN): <count, subjects>
- Theme settings / template JSON toggles: <e.g. quick_add:none, show_sale_badge:false, currency_code_enabled:false>

## 6. Acceptance criteria (derived from §3–§5; each must be DOM-verifiable)
- [ ] AC-1 …
- [ ] AC-2 …

## 7. Self-diff gate (run BEFORE showing the user)
Assert each AC against the live DOM with `browser_evaluate` (measured, not eyeballed):
alignment (getBoundingClientRect), colors (getComputedStyle), text content, presence/absence.
Record results here. Only present to the user when every row passes.

## 8. Sign-off
- [ ] **Blueprint approved by user** (date): __
- [ ] Built + self-diff all-green (date): __
- [ ] User signed off on rendered result (date): __
