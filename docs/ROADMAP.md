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

- [x] **STRAT-1 — DECIDED: keep the fork (won't un-fork).** The editor blank-state indicator is
  done (P1-11). The gate stays in the 5 Dawn sections (collection-list, featured-collection,
  multicolumn, newsletter, related-products). Rationale: the fork has **zero feature/runtime
  impact** — it only costs a manual merge *if* Dawn is upgraded, and this theme does **not** track
  new Dawn releases (each store freezes on its Dawn version). Un-forking would mean rebuilding
  those 5 sections as custom wrappers (risking Best Sellers / Shop-by / related-products) for a
  benefit we don't need. Revisit only if a decision is made to pull future Dawn updates.

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
- [x] **P1-5** Tier / cart-promo "% off": `bootstrap-store.mjs` can now create the matching
  buy-2/3/4 Automatic discounts (`BOOTSTRAP_QTY_DISCOUNTS=1`, idempotent); the tier + cart-promo
  info text warns in English that the % must match an Admin discount. Cart still shows real savings.
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
- [x] **P1-12** (Option B) `custom-image-with-text` on the product page is split into named
  `custom-problem` / `custom-solution` sections (self-contained, image-with-text untouched, block
  editing preserved). The two `collection-list` names are left as-is (renaming them would mean
  reimplementing a Dawn grid — out of scope per the STRAT-1 decision).
- [x] **P1-13** Store type warns about per-product template opt-out; "Base theme" group renamed.
- [-] **P1-14** Editor labels mix English + Vietnamese; custom sections hardcode strings.
  Migrate to `locales/*.schema.json` `t:` keys. *Large standalone i18n effort.*

## P2 — SEO & polish
- [x] **P2-1** FAQ emits `FAQPage` JSON-LD. Reviews now emit `AggregateRating` + `Review` on a
  Product node keyed to the product URL — only on product pages, only from product-metafield
  reviews (Google merges with main-product's Product node).
- [x] **P2-2** Hero heading is `h2` on the home page (no duplicate `h1`).
- [x] **P2-3** CTA overlay floored at 35%; background capped at 1600px.
- [x] **P2-4 — DECIDED: won't trim `base.css`.** On inspection base.css is Dawn's *foundation*
  (reset, typography, buttons, forms, grid, layout, utilities, cards) used on every page — not
  unused features (Dawn ships per-section/component CSS separately). A PurgeCSS trim would risk
  breaking JS-added classes (cart drawer, predictive search, form errors) that don't appear in
  static HTML. High risk, low safe reward → keep as-is.

---

## UI/UX polish audit (2026-09) — visual + code review

Found by rendering home/product/collection/cart/search/404/about in Chrome + a code sweep.
The store is on-brand and consistent everywhere (the global design system carries even bare
Dawn templates), but these polish bugs — same class as the How It Works stretch bug — remain.

### Section layout bugs (highest visual impact first)
- [x] **U1** Pricing tiers: "MOST POPULAR" badge is clipped by `.custom-card { overflow:hidden }`
  (`custom-pricing-tiers.liquid:67`, badge `top:-1.1rem`). Make the card `overflow:visible`, clip the image separately.
- [x] **U2** Pricing tiers: `align-items:center` on the desktop grid → unequal card heights, CTAs
  don't line up. Use `align-items:stretch` + `margin-top:auto` on the form.
- [x] **U3** Reviews & icon-benefits: desktop column count is hard-set from a setting, not block
  count → empty cells / "cụt" row when blocks < columns. Cap col var at `section.blocks.size` (like tiers/trust already do).
- [x] **U4** Announcement bar: 3rd message clipped between ~750–1100px (`flex-wrap:nowrap;overflow:hidden`). Allow wrap / shrink / rotate on tablet.
- [x] **U5** CTA banner: button hard-coded `justify-content:center` even when text is left-aligned. Drive from `content_alignment`.
- [x] **U6** Social proof: `justify-content:space-between` jams the cluster left when there are no press logos. Center when single child.
- [x] **U7** Size guide: product image has no `aspect-ratio` → layout shift as it loads. Reserve one.
- [x] **U8** Frequently-bought: shows "Select a product" cards + "Total $0.00" until configured; "+" separators can strand on wrap. Hide summary when unconfigured; render "+" via CSS.
- [ ] **U9** Trust badges: odd count leaves a lone off-center badge on mobile (`repeat(2,1fr)`). Center trailing item / auto-fit.
- [ ] **U10** FAQ 2-column: row-major order (1,2 / 3,4) + gap when one item expands. Use CSS `columns` or single column.
- [ ] **U11** Heading treatment inconsistent (alignment control + head margins differ across sections). Standardize.

### Pages — missing / still bare Dawn (not styled to brand beyond the global system)
- [x] **PG1** 404: dead-end (just "Page not found" + button). Add popular products + search + trust.
- [x] **PG2** Empty cart: plain, big empty area. Add recommendations / trust / free-ship progress.
- [ ] **PG3** Collection: on-brand grid but no brand sections. Optional: collection banner + trust/benefits/reviews below the grid.
- [ ] **PG4** Search: on-brand but bare; empty-state could suggest popular products.
- [ ] **PG5** Account pages (login/register/account/order): Dawn default, not brand-tuned.
- [ ] **PG6** Password page: Dawn default — this is the first impression while the store is locked. Worth branding.
- [ ] **PG7** Blog / Article: Dawn default (only if the store does content marketing).
- Note: policy pages (Privacy/Refund/Terms) are fine on Shopify's generated defaults.
