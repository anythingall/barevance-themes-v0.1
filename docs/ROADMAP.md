# Optimization roadmap

Deep-audit findings (performance, accessibility, merchant UX, robustness/SEO/i18n) with a
priority and status. Grounded in the code — file:line references included.

Status: `[ ]` todo · `[~]` partial · `[x]` done · `[-]` deferred (needs decision / large)

**Sprint 1 + most of Sprint 2 are done** (commits `a4fb3f76`…`2d4ee7cc`). Remaining items are
the ones marked `[-]` — each needs a decision or is a large standalone effort.

---

## Strategic decision — Union vs curated templates

`templates/index.json` / `product.json` are **union** templates (one dropdown switches
V1/V2/V3). Costs: dead section CSS on every page, editor clutter, and forking 5 Dawn sections.
The curated per-type templates already exist and avoid all three.

- [-] **STRAT-1** Un-fork Dawn sections (gate only `custom-*`) + editor blank-state indicator.
  *Blank-state indicator is DONE (P1-11). Un-forking the 5 Dawn sections is the remaining piece —
  large, and it trades against the "one dropdown" UX. Needs a decision (keep union vs move to
  curated-by-default).*

## P0 — Correctness bugs  ✅ done
- [x] **P0-1** Gate no longer fails open on blank `store_type` (defaults to `v1`).
- [x] **P0-2** `brand-style` guards each Custom color swatch against blank.
- [x] **P0-3** Sticky ATC syncs price + availability on variant change.
- [x] **P0-4** `brand-style` emits `--payment-terms-background-color`.
- [x] **P0-5** Gate comments corrected to `store_type` / `type_visibility`.

## P1 — High impact
### Performance  ✅
- [x] **P1-1** Font preload is preset-aware (emitted by `brand-style`).
- [x] **P1-2** Dawn's duplicate `@font-face` disabled — single source. (~10 → 4 faces.)
- [x] **P1-3** Hero LCP image responsive `<link rel=preload as=image>`.
### Conversion & trust
- [x] **P1-4** Pricing-tiers & frequently-bought add-to-cart go through `/cart/add.js` + open the
  cart drawer (`snippets/custom-cart-ajax.liquid`), with graceful fallback.
- [-] **P1-5** Tier / cart-promo "% off" is display-only and must match an Admin Automatic
  discount by hand. *Needs product decision (single source vs. bootstrap-created discounts).*
- [x] **P1-6** Announcement bar auto-rotates on mobile (no message hidden); no-JS/reduced-motion
  shows all wrapped.
### Accessibility  ✅
- [x] **P1-7** `--color-accent-strong` (contrast-safe accent) drives text/icon uses.
- [x] **P1-8** Carousels & tables focusable + labeled; size-guide sticky row-header.
- [x] **P1-9** Footer focus ring + larger tap targets; footer muted text raised.
  *(Remaining muted-opacity spots e.g. 0.4–0.55 strikethroughs are minor — batch later.)*
### Merchant UX  ✅
- [x] **P1-10** Custom style group hidden unless `style_preset=custom`; Colors group note.
- [x] **P1-11** Hidden gated sections show an editor-only ("design_mode") notice.
- [-] **P1-12** Two `collection-list` / two `image-with-text` share editor names. Split into named
  wrappers. *Medium — needs new wrapper section files.*
- [x] **P1-13** Store type warns about per-product template opt-out; "Base theme" group renamed.
- [-] **P1-14** Editor labels mix English + Vietnamese; custom sections hardcode strings.
  Migrate to `locales/*.schema.json` `t:` keys. *Large standalone i18n effort.*

## P2 — SEO & polish
- [~] **P2-1** FAQ emits `FAQPage` JSON-LD (done). Reviews `AggregateRating/Review` deferred —
  must be nested in the Product node (main-product) to be valid; avoid a duplicate Product.
- [x] **P2-2** Hero heading is `h2` on the home page (no duplicate `h1`).
- [x] **P2-3** CTA overlay floored at 35%; background capped at 1600px.
- [-] **P2-4** Trim `base.css` (81 KB inherited Dawn). *Large / inherited.*
