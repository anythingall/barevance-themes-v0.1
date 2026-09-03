# Sections & snippets reference

Every component the base theme adds is prefixed **`custom-`**. Sections are added, removed and
configured in the theme editor; nothing here needs code to use.

Legend for "Used by": **V1** One Product · **V2** Multi Style · **V3** Multi Product ·
**PDP** product pages · **Pages** standalone pages · **Global** every page.

---

## Sections (`sections/custom-*.liquid`)

| Section | Purpose | Key settings / blocks | Used by |
|---------|---------|-----------------------|---------|
| **custom-announcement** | Top bar with 2–3 static messages + icons | color scheme; `message` blocks (icon + text) | Global |
| **custom-footer** | Brand-first footer: logo/tagline + social, menu columns, newsletter, payment, policy | logo, tagline, newsletter, payment/policy toggles; `menu` blocks | Global |
| **custom-hero** | Hero: eyebrow, two-tone heading, features, rating, CTAs, image + badge | image (+ mobile), heading + highlight, alignment; `feature` / `rating` / `button` / `badge` blocks | V1 V2 V3 |
| **custom-icon-benefits** | "Why customers love it" icon grid | columns, mobile layout (stack/carousel), card container, `source` (blocks / product metafield); `benefit` blocks | V1 V2 V3 PDP Pages |
| **custom-image-with-text** | Story / problem–solution: media + checklist + button | image, placement, eyebrow/heading/text, button; `list_item` blocks (check/cross) | V1 V2 V3 PDP Pages |
| **custom-how-it-works** | Numbered steps (+ optional media/video) | heading, image, video link; `step` blocks | PDP |
| **custom-comparison-table** | "Us vs others" with optional product image | optional image, us/others labels; `row` blocks (check/partial/cross) | V1 PDP |
| **custom-reviews** | Testimonial cards (carousel on mobile) | columns, `source` (blocks / product metafield); `review` blocks | V1 V2 V3 PDP |
| **custom-faq** | Accordion FAQ + optional money-back panel | columns, `source`, guarantee panel (badge/heading/text/image); `item` blocks | V1 V2 V3 PDP Pages |
| **custom-trust-badges** | Row of trust signals | padding; `badge` blocks (icon + title + subtitle) | V1 V2 V3 Pages |
| **custom-cta-banner** | Full-width CTA with optional background image | image, overlay, heading/text, button, alignment | V1 V2 V3 Pages |
| **custom-pricing-tiers** | "Buy more save more" bundles (image + tab link to product) | heading, button label; `tier` blocks (product, quantity, discount %, badge, highlight) | V1 |
| **custom-sticky-atc** | Mobile sticky Add-to-Cart bar | button label (toggle in Base theme settings) | PDP |
| **custom-frequently-bought** | Bundle: products + total + add all | heading, button; `product` blocks | V3 PDP |
| **custom-size-guide** | "Will it fit?" image + size table + perfect-for box | image, size labels, perfect-for; `row` blocks | PDP Pages |
| **custom-social-proof** | "N happy customers" + rating + "as seen on" logos | avatars, count, rating, as-seen label; `logo` blocks | PDP |

### Reused Dawn sections (configured in templates)

- `featured-collection` — Best Sellers grids.
- `collection-list` — Shop by Style / Shop by Category.
- `multicolumn` — promo columns (V3).
- `related-products` — "You may also love".
- `newsletter`, `contact-form`, `rich-text`, `main-product`, `main-page` — used in templates/pages.

---

## Snippets (`snippets/custom-*.liquid`)

| Snippet | Purpose |
|---------|---------|
| **brand-style** | **Style engine / single source of truth.** Reads the `Theme style` dropdown (Warm/Minimal/Playful/Custom) and maps ~9 brand role colors + 3 fonts + 2 radii onto Dawn's 5 color schemes + `--font-*` / radius variables. Rendered after Dawn's scheme block so it drives the whole store's look. Add a preset = one `{% when %}` branch here. |
| **design-tokens** | Emits global CSS variables from theme settings (mobile heading scale, content width, tap target, section rhythm). Included in `layout/theme.liquid`. |
| **custom-icon** | Renders a Dawn icon SVG by name (shared icon list for `custom-*` sections). |
| **custom-stars** | 5-star rating (supports halves), colored by the scheme accent. |
| **custom-compare-mark** | Check / partial / cross mark for the comparison table. |
| **custom-cart-savings** | Total cart savings ("X% OFF −$amount") from `cart.total_discount`. Injected into the cart drawer + cart page. |
| **custom-cart-promo** | Tiered "buy more save more" progress bar for the cart. Configured in Theme settings → "Cart discount promo". |
| **custom-pdp-rating** | Star rating + review count line for the product buy area. |
| **custom-pdp-features** | 4-up feature icon row for the buy area (reads `custom.benefits`, falls back to defaults). |
| **custom-pdp-trust** | Trust-icon row (Free Shipping / Guarantee / Secure) under the buy buttons. |

The buy-area snippets are injected into `main-product` via `custom_liquid` blocks in the
product templates (e.g. `{% render 'custom-pdp-features' %}`).

---

## Styling

- **`assets/base-custom.css`** — mobile-first utility classes every section uses:
  `.custom-section`, `.custom-container`, `.custom-grid`, `.custom-scroller` (carousel),
  `.custom-h1` / `.custom-h2` (fluid headings), `.custom-tap` (≥44px), `.custom-card`,
  `.custom-table-scroll`. Also the header tagline/CTA and adaptive commerce-grid rules.
- Section-specific CSS lives in each section's `{% stylesheet %}` block.
- **Never hard-code colors or fonts** — use `rgb(var(--color-*))` (scheme) and
  `var(--font-*)` / design tokens so branding stays global.
