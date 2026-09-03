# Architecture

How the base theme is put together, and the principles that keep it reusable across many
stores. Built on **Dawn 16**; product data is **Shopify-native** (products, collections,
metafields, metaobjects) — nothing is hard-coded.

---

## 1. Core principles

1. **Mobile-first.** Base CSS targets mobile; `min-width` media queries add desktop. Reference
   designs are desktop-only, so mobile layouts are designed intentionally (single column or
   horizontal scroll carousels, sticky add-to-cart, ≥44px tap targets).
2. **No hard-coded colors or fonts in sections.** Every section reads Dawn color schemes and
   the global CSS design tokens. Change branding in one place → the whole store follows.
3. **No hard-coded product data.** Sections use product/collection pickers and metafields.
4. **Don't duplicate sections.** One configurable section + blocks + presets, not many
   near-identical sections.
5. **Don't fork Dawn.** New files are prefixed `custom-`; Dawn's files are left unmodified
   wherever possible, so upstream Dawn updates stay mergeable.

---

## 2. Layered structure

```
┌────────────────────────────────────────────────────────────────────┐
│ GLOBAL  (config/settings_schema.json + settings_data.json)          │  edit once → whole store
│  Color schemes · Typography · Branding · Radius · Spacing · Tokens   │
├────────────────────────────────────────────────────────────────────┤
│ GLOBAL CHROME  (header-group.json · footer-group.json)              │  same on every page
│  Announcement bar · Header · Footer                                  │
├────────────────────────────────────────────────────────────────────┤
│ SHARED SECTIONS  (sections/custom-*.liquid)                         │  used by all templates
│  Hero · Benefits · Story · Reviews · FAQ · Comparison · CTA · …      │
├────────────────────────────────────────────────────────────────────┤
│ TEMPLATE-SPECIFIC SECTIONS                                          │  a few, per store type
│  pricing-tiers · shop-by-style (Dawn) · frequently-bought · …        │
├────────────────────────────────────────────────────────────────────┤
│ TEMPLATES  (templates/*.json)                                       │  "configuration", not code
│  index.one-product.json · product.landing.json · page.faq.json · …   │
└────────────────────────────────────────────────────────────────────┘
```

- **Global** and **global chrome** are configured once and shared by every page and every
  store type.
- A **store type is just a set of JSON templates** — switching from One Product to Multi
  Product means swapping which template JSON is active, never editing `.liquid`.

---

## 3. Global vs. template-specific

**Global (configure once, applies everywhere):**

- Color schemes, typography, branding, button/card radius, spacing, page width — in
  `config/settings_schema.json`, with values and presets in `config/settings_data.json`.
- Header, announcement bar, footer — via Dawn **section groups** (`header-group.json`,
  `footer-group.json`), rendered on every page by `{% sections %}` in `layout/theme.liquid`.

**Template-specific (differs by store type):**

- Which sections appear, and in what order — the `templates/index.*.json` and
  `templates/product.*.json` files.
- A small number of commerce sections unique to a type (e.g. pricing tiers for One Product,
  Frequently Bought Together for Multi Product). Style/category grids reuse Dawn's
  `collection-list` and `featured-collection`.

See **[SECTIONS.md](SECTIONS.md)** for the full section list and which templates use each.

---

## 4. How store types work

Shopify chooses a template by **file**, not by code:

- **Product / collection / page** templates use the native **"Theme template"** dropdown in
  the admin. Each product can pick `landing`, `multi-style`, or `multi-product`.
- **The homepage (index) has no template picker** — Shopify always renders
  `templates/index.json`. To make the homepage a given type you make `index.json` contain that
  layout. Use the helper:

  ```bash
  scripts/use-store-type.sh v2        # copies index.multi-style.json → index.json
  ```

  This is a one-time decision at store setup; the merchant never touches it afterwards.

---

## 5. Global design system

### Color schemes (Dawn-native)

The theme standardizes Dawn's 5 color schemes by **role**, so sections reference a role rather
than a specific color:

| Scheme | Role | Typical use |
|--------|------|-------------|
| `scheme-1` | Base | Page background, most sections |
| `scheme-2` | Surface | Cards, subtle bands |
| `scheme-3` | Brand / dark | Footer, CTA banners, announcement bar |
| `scheme-4` | Accent | Badges, sale highlights |
| `scheme-5` | Inverse / darkest | Dark overlays, footer |

Highlights, buttons, stars, icons and badges all use `rgb(var(--color-button))` (the scheme's
accent), so changing a scheme updates them all. Edit schemes in **Theme settings → Colors**.

### Typography

`Theme settings → Typography`: heading font, body font, and an **accent font** (for eyebrows /
handwritten labels), plus size scales and a mobile heading scale. Applied via CSS variables
(`--font-heading-family`, `--font-accent-family`, …); sections never hard-code a font.

### Design tokens

`snippets/design-tokens.liquid` emits global CSS variables from settings — accent font, mobile
heading scale, card radius, tap-target minimum, section rhythm — included once in
`layout/theme.liquid`. `assets/base-custom.css` holds the mobile-first utilities every
`custom-*` section uses (`.custom-container`, `.custom-grid`, `.custom-scroller`, `.custom-h1`,
`.custom-tap`, …).

### Style presets

`config/settings_data.json` ships three full presets — **Warm** (brown + Playfair serif,
default), **Minimal** (monochrome + Poppins, square), **Playful** (coral/pink + Poppins,
rounded). Each carries the complete configuration; only colors, fonts and radius differ, so
switching a preset re-skins the store in one step.

---

## 6. Folder structure

```
assets/base-custom.css          Shared mobile-first CSS for custom-* sections
config/
  settings_schema.json          Global design system + branding controls
  settings_data.json            Values + 3 color/font presets
layout/theme.liquid             Includes design-tokens + base-custom.css
sections/
  custom-*.liquid               17 reusable sections (see SECTIONS.md)
  header-group.json             Global announcement bar + header
  footer-group.json             Global footer (custom-footer)
snippets/
  design-tokens.liquid          Global CSS variables from settings
  custom-*.liquid               Shared snippets (icon, stars, cart promo, pdp-*, …)
templates/
  index.one-product.json        V1 homepage
  index.multi-style.json        V2 homepage
  index.multi-product.json      V3 homepage
  product.landing.json          V1 product page (full landing)
  product.multi-style.json      V2 product page
  product.multi-product.json    V3 product page (+ Frequently Bought Together)
  page.faq.json / page.about-us.json / page.contact.json /
  page.shipping-returns.json / page.size-guide.json
scripts/
  use-store-type.sh             Switch homepage layout (one command)
  bootstrap-store.mjs           Create metafields/metaobjects/menus for a new store
docs/                           This documentation + reference designs
```

---

## 7. Notes & limitations

- **Reviews / FAQ / benefits** can be driven by product metafields (metaobjects) or by section
  blocks — each of those sections has a `source` setting and falls back to blocks. See
  [METAFIELDS.md](METAFIELDS.md).
- **Quantity discounts** (pricing tiers) show a display % that must match an **Automatic
  discount** created in the admin; the cart reads the real applied discount. See the
  "Quantity discounts" section of [SETUP-NEW-STORE.md](SETUP-NEW-STORE.md).
- **Frequently Bought Together / bundles** render the UI; the bundle logic relies on an app or
  Shopify Bundles.
- **Reference designs are desktop-only** — mobile layouts are the theme's own design.
