---
name: voya-parity
description: Build/rework any Voya store section to 100% match the design in docs/design, using a strict measure→build→capture→overlay-compare→lock loop. Use for every remaining section (Problem, Benefits, Shop by Need, product cards, PDP, Collection, etc.) and any future design-parity work so results match the mockup on the first pass and avoid rework.
---

# Voya Design-Parity Workflow

Proven on the Hero. Apply this **exact loop to every section**. Do NOT eyeball-and-hope —
extract measurable AC from the design first, build to it, then verify by overlaying the
actual screenshot on the design. Only move to the next section when all AC pass.

## Context (fixed facts)

- **Repos:** `shopify-one-product` = canonical base (`custom-` prefix). `shopify-Voya` = base + `vy-` namespace + templates/settings/content. Build section code in **base**, then sync.
- **Store / theme:** `hieu1-1.myshopify.com`, theme **"Voya Barefoot" #145358455018** (unpublished). Preview via `shopify theme dev` at `http://127.0.0.1:9292` (bypasses the store password).
- **Design source of truth:** `docs/design/{home,product,collection,collection-detail}.png` + the SPEC docx. Token AC lives in [docs/plan/voya-build-spec.md](../../docs/plan/voya-build-spec.md) §2.
- **Design tokens = AC for color/type** (never guess):
  - Primary/CTA `#23452D` · Dark `#193722` · **Heading `#171B18`** · Body `#454A46`
  - Cream `#F7F5EF` · Sage `#E7EEE5` · Sand `#E9E0D0` · Mist `#F3F4F1` · Border `#DDE1DB`
  - Sale `#B85C3A` · Rating `#D99124`
  - **Headings = Manrope ExtraBold (manrope_n8)** · Body/UI = Inter · card radius 14px · buttons = pill.

## Enforcement (installed — the gate makes this mandatory, not advisory)
This loop is now backed by a **commit gate** so a section can't be declared done while wrong.
See [docs/plan/parity-status.md](../../docs/plan/parity-status.md). Registry of sections +
`status` (todo/wip/done) + thresholds: [docs/plan/parity-sections.json](../../docs/plan/parity-sections.json).
- **Objective match score:** `node scripts/parity-gate.mjs --section <key>` runs
  `scripts/parity-diff.py` (design crop vs live render) and prints **mismatch %** (AI-gen photo
  regions masked via `docs/plan/mockups/<key>.mask.json`). A section passes only when mismatch ≤
  threshold (default 8%) — this replaces "so bằng mắt" for the numeric AC.
- **`done` = enforced:** the `scripts/hooks/pre-commit` hook (installed via
  `git config core.hooksPath scripts/hooks`) blocks any commit that touches a `status:"done"`
  section whose gate fails. Promote a section to `done` only in the commit that passes its gate.
  Emergency bypass: `PARITY_SKIP=1 git commit`.

## The loop (per section)

### 0. Mockup Blueprint FIRST — get sign-off before any code  ⟵ prevents rework
> Best Sellers was reworked ~5× because the AC wasn't exhaustive and I verified by eyeball
> *after* showing the user. Fix: enumerate everything up front, user approves the blueprint,
> then build. **Do not skip to code.**

- Copy `docs/plan/mockups/_TEMPLATE.md` → `docs/plan/mockups/<sec>.md` and fill it:
  - **High-zoom crops** of the whole section AND one repeating unit at 3–4× (read weight+color).
  - **Element inventory table** — every element × {text, font, size, weight, case, **sampled** color hex, align, position/inset, icon, state, data source}. Sample colors with PIL, never guess.
  - The **"easy-to-miss" checklist** (badges/rating/price/button/swatches/card/link/edge-alignment) — answer every item. These are exactly the things that caused rework.
  - **Data requirements**: metafields, products, images, theme settings, template-JSON toggles.
- For any card grid, reuse the **Product-Card spec** in [best-sellers.md](../../docs/plan/mockups/best-sellers.md) §3 instead of re-measuring.
- **Present the blueprint to the user and get explicit sign-off** before building.

### 1. Crop + confirm AC are measurable
- Crop the section from the design: `sips -c <H> <W> --cropOffset <offY> <offX> docs/design/home.png --out .report-shots/ac/design-<sec>.png` (design PNGs are 723 wide; find offY by eye).
- Every AC row must be **DOM-verifiable** (a `getBoundingClientRect`, `getComputedStyle`, or text assertion) — if you can't verify it objectively, rewrite it. Spacing gap header→section = 0 unless the design shows one.

### 2. Build to AC — in BASE, keep it generic
- Edit `shopify-one-product/sections/custom-<sec>.liquid`. Add **layout options** (a `select`) rather than hard-coding Voya's look, so the base stays reusable (e.g. hero got `media_style: boxed|fullbleed|overlay`). Voya picks the option in its template JSON.
- **Colors/fonts** come from the color scheme + tokens — never hard-code hex in the section; set the scheme/preset. Headings inherit `--font-heading-family` (Manrope) + `--color-foreground` (#171B18).
- **Icons:** if the design uses a glyph Dawn/`custom-icon` lacks (foot, wavy sole…), create a line-art SVG `assets/icon-<name>.svg` (stroke `currentColor`, weight ~1.6, no fill) and render via `{% render 'custom-icon', icon: '<name>' %}`. Match the design's thin-outline style and color it with `--color-foreground`.

### 3. Sync base → Voya + push
```
cp sections/custom-<sec>.liquid ../shopify-Voya/sections/custom-<sec>.liquid   # from base
cd ../shopify-Voya && node scripts/namespace-store.mjs --apply --paths sections/custom-<sec>.liquid
# also cp any new assets/icon-*.svg into shopify-Voya/assets/
shopify theme check           # must stay 0 errors
shopify theme push --store hieu1-1.myshopify.com --theme 145358455018
```
- Section content/settings live in `templates/*.json` (Voya). **Never hand-edit the `vy-` prefix** — it is the output of `namespace-store.mjs`.

### 4. Capture the ACTUAL section (reliable method)
- Preview must be running: `shopify theme dev --store hieu1-1.myshopify.com` (background).
- Use **Playwright ELEMENT screenshots** — full-page/viewport screenshots hang on font-load in this env:
  - `browser_resize 1440x900` → `browser_navigate http://127.0.0.1:9292/<path>` → `browser_take_screenshot target=".vy-<sec>" filename=".report-shots/ac/actual-<sec>.png"`.
- Read the PNG and eyeball vs the design crop.

### 4a. RESTART `theme dev` before verifying (it serves stale renders)
- `shopify theme dev` does NOT reliably hot-reload changes to a section's `{% schema %}` **or**
  its `{% stylesheet %}` — you will verify against OLD css/settings and "pass" a broken section
  (this is what made testing look green while the page was wrong). After editing a section's
  schema or stylesheet: `pkill -f "shopify theme dev"` → restart → wait for `127.0.0.1:9292` →
  hard-reload. Symptoms of a stale render: a section's grid/bg/spacing missing (its whole
  `{% stylesheet %}` absent), or new block settings rendering blank. When in doubt, restart.

### 4b. Self-diff gate — DOM checks (necessary, NOT sufficient)
- Run `browser_evaluate` over the rendered section and assert each AC objectively:
  positions via `getBoundingClientRect`, colors via `getComputedStyle`, text via `textContent`,
  and **absence** checks. This catches wiring bugs but it only verifies the AC *you wrote* — if
  your reading of the design was incomplete, DOM checks pass while the visual still differs.
  **DOM checks alone are never enough to claim a section done.**

### 5. VISUAL side-by-side vs the design — the REAL gate (mandatory, do EVERY time)
> This step is non-negotiable. Skipping it is why sections shipped "passing" but wrong
> (finder phone, bundle images/bg/heading/arrow were all missed by DOM-only checks).
- Element-screenshot the actual section, then stack the **design crop (top) over the actual
  (bottom) at the same width** and OPEN the image and LOOK:
  ```
  # design crop full-width from home.png at the section's y-range, actual from Playwright element shot
  python3 -c "from PIL import Image; d=Image.open('design-crop.png'); a=Image.open('act.png'); W=1200; \
    d=d.resize((W,int(d.height*W/d.width))); a=a.resize((W,int(a.height*W/a.width))); \
    c=Image.new('RGB',(W,d.height+a.height+14),(200,200,200)); c.paste(d,(0,0)); c.paste(a,(0,d.height+14)); c.save('cmp.png')"
  ```
  (or `scripts/make-compare.mjs` for the slider version). Read `cmp.png` and enumerate EVERY
  difference: background color, image subject/style, heading line-wrap, button arrow, icon
  size/shape, spacing. Fix, re-render, re-compare. Only when the two halves look the same do
  you present — and publish `cmp.png` with the Artifact tool for the user to see.
- Images are "similar" by agreement, but a stock photo that reads as a *different kind of thing*
  than the mockup (e.g. a dashboard photo where the design shows a quiz mockup) is a MISS, not an
  acceptable image gap — flag it and fix (CSS mockup, better asset, or ask).
```
node scripts/make-compare.mjs --dir .report-shots/ac --design design-<sec>.png --actual actual-<sec>.png --title "<Sec>" --out <sec>-compare.html
```
- Fill its AC checklist, publish with the **Artifact** tool (`root=.report-shots/ac`, `files={design-<sec>.png, actual-<sec>.png}`), and share the link. The drag-slider shows every mismatch.
- Iterate steps 2–5 until **every AC row is ✅** (except the irreducible photo-content gap — see Images).

### 6. Lock + commit + next
- On user OK: commit base (feature branch) + Voya (`feat/voya-build`), then start the next section.

## Images (the one hard limit)
- **Set section photos via a `image_url` text setting** rendering `<img src="{{ image_url }}" width=.. height=..>` — NOT `image_picker`, whose `shopify://shop_images/…` refs don't resolve for uploaded Files. Add `image_url` to any section needing a photo.
- Host the file on Shopify: `fileCreate(files:[{originalSource:"<url>", contentType:IMAGE}])` (Unsplash/Pexels URL, or a staged-upload for a local file), then query `node(id){... on MediaImage{image{url}}}` and use that `cdn.shopify.com/...` URL as `image_url`. Products: `productCreateMedia`.
- **Photo content cannot reach 100%** with free stock (subject matches, exact frame won't) and **AI-gen is plan-gated (blocked)**. To make a photo identical to the mockup, the user must provide the original asset (or upgrade the AI-gen plan). Layout/color/font/spacing still reach ~100% regardless.

## Remaining sections + where their design lives
Work top-to-bottom per page; one section per compare cycle.

**Home** (`docs/design/home.png`): Problem (3 foot-photo cards) · Barefoot benefits (4, sage) · Shop by Need (6 photo tiles) · Best Sellers (cards: badge + rating + **swatch** + price) · Reviews (3) · Shoe Finder · Bundle (done: split) · FAQ · Final CTA · Footer.
**PDP** (`product.png`): gallery+buy box · trust bar · problem/compare · "Why Mirox" · "See Mirox in Motion" (video grid — new) · UGC · fit table + **Mirox Fit bars** · "Made for Your Everyday" (new) · compare · bundle · reviews · FAQ · CTA.
**Collection** (`collection.png`) & **Collection-detail** (`collection-detail.png`): hero · trust · categories · favorites · grid+filter · compare · finder · reviews · education · FAQ · CTA.

Per-page section order and content AC are in [docs/plan/voya-build-spec.md](../../docs/plan/voya-build-spec.md) §4.

## Non-negotiables (avoid rework)
1. **Blueprint FIRST** (`docs/plan/mockups/<sec>.md`) with the full element inventory + easy-to-miss checklist + **user sign-off**, before touching code. Reuse the Product-Card spec for card grids.
2. Build generic in **base**, sync via `namespace-store.mjs`, never hand-edit `vy-`.
3. Colors/fonts from tokens (sample the mockup, never guess); custom icons as line-art SVG when the glyph is missing.
4. **Two gates, in order:** (a) DOM self-diff (`browser_evaluate`) for wiring, then (b) the **mandatory VISUAL side-by-side** (design crop stacked over the live render) — LOOK at it and fix every visible difference. DOM-passing is NOT done; the stacked image is the source of truth. One section at a time; user signs off before moving on.
5. theme-check stays at **0 errors** every push.
