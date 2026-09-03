# Base Theme — Reusable Shopify Theme

A production-ready Shopify base theme, built on **Dawn 16**, that you can reuse to launch
many stores fast. One codebase powers **three store types**, and every store is set up by
picking a template, importing products, and changing settings — **no code changes required**.

- **One codebase → 3 store types**: One Product, Multi Style, Multi Product — switch the whole
  store (home page + product pages) with **one dropdown** in Theme settings.
- **Global design system**: pick a look (**Warm / Minimal / Playful / Custom**) from one
  dropdown and the whole store re-skins — colors, fonts and corners in one place.
- **Mobile-first**: every section is designed for mobile first, then enhanced for desktop.
- **Shopify-native**: real products, collections, metafields, metaobjects and menus — no
  hard-coded content.
- **Fast setup**: push the theme, run one bootstrap command, then pick a store type and a
  style from two dropdowns. ~15 minutes to a working store.

---

## The 3 store types

| Type | Best for | Home page | Product page |
|------|----------|-----------|--------------|
| **V1 — One Product** | A single hero/trending product | Full landing | Full landing (story, comparison, FAQ) |
| **V2 — Multi Style** | One concept, many styles/variants | Shop by Style + Best Sellers | Variant-focused |
| **V3 — Multi Product** | Many products in one niche | Shop by Category + product rows | Frequently Bought Together |

Pick the type from **Theme settings → Store type** — one dropdown controls the home page AND
the default product page. They share all of the global chrome (announcement bar, header,
footer) and most sections, differing mainly in commerce structure (single product vs. style
grid vs. category browsing). See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Quick start

Requirements: [Shopify CLI](https://shopify.dev/docs/api/shopify-cli), Node 18+.

```bash
# Preview locally against a store
shopify theme dev --store your-store.myshopify.com

# Push to the store as an unpublished theme (safe to test, doesn't touch the live theme)
shopify theme push --store your-store.myshopify.com --unpublished --theme "Base Theme"
```

### Set up a brand-new store (~15 min)

```bash
# Create the store's data structure (metafields, metaobjects, footer menus) — one command
SHOPIFY_STORE=your-store.myshopify.com SHOPIFY_TOKEN=shpat_xxx \
  node scripts/bootstrap-store.mjs
```

Then, in the Shopify admin (all clicks, no code):

1. **Store type** — Theme settings → **Store type** → V1 / V2 / V3. One dropdown sets the home
   page and the default product page.
2. **Style** — Theme settings → **Theme style** → Warm / Minimal / Playful / Custom (+ logo).
3. **Products** — import your catalog. Leave products on the default template so they follow
   the Store type, or assign a specific template per product for exceptions.
4. **Sections** — connect products/collections to sections in the theme editor.
5. **Media** — upload your hero and lifestyle images.
6. **Discounts** — if you use the pricing tiers, add matching Automatic discounts.

Full walkthrough: **[docs/SETUP-NEW-STORE.md](docs/SETUP-NEW-STORE.md)**.

---

## Documentation

| Doc | What's inside |
|-----|---------------|
| **[SETUP-NEW-STORE.md](docs/SETUP-NEW-STORE.md)** | Step-by-step guide to launch a new store (fast path + details). |
| **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** | How the theme is structured: global vs. template-specific, the design system, folder layout. |
| **[SECTIONS.md](docs/SECTIONS.md)** | Reference for every `custom-*` section and snippet — settings, blocks, and where each is used. |
| **[METAFIELDS.md](docs/METAFIELDS.md)** | The metafield/metaobject data model and how sections read it. |
| **[design/](docs/design/)** | The reference designs (One Product / Multi Style / Multi Product). |

---

## Repository layout

```
├── assets/
│   └── base-custom.css        # Shared mobile-first utilities for custom-* sections
├── config/
│   ├── settings_schema.json   # Global design system + branding settings
│   └── settings_data.json     # Values + color presets (Warm / Minimal / Playful)
├── sections/
│   ├── custom-*.liquid        # 17 reusable sections (hero, benefits, pricing tiers, …)
│   ├── header-group.json      # Global announcement bar + header
│   └── footer-group.json      # Global footer
├── snippets/
│   ├── brand-style.liquid     # Style engine — maps Theme style/Custom onto color schemes + fonts
│   ├── design-tokens.liquid   # Emits global CSS variables from settings
│   └── custom-*.liquid        # Shared snippets (icons, stars, cart promo, …)
├── templates/
│   ├── index.json / product.json           # Union templates driven by the Store type dropdown
│   ├── index.{one-product,multi-style,multi-product}.json    # Curated single-type home pages
│   ├── product.{landing,multi-style,multi-product}.json      # Curated single-type product pages
│   └── page.faq.json / page.about-us.json / page.contact.json / …
├── scripts/
│   ├── use-store-type.sh      # Switch the homepage between V1/V2/V3 (one command)
│   └── bootstrap-store.mjs    # Create metafields/metaobjects/menus for a new store
└── docs/                      # Documentation + reference designs
```

Everything the base theme adds is prefixed **`custom-`** so it never collides with Dawn and
stays easy to merge when Dawn updates. Dawn's own files are left unmodified wherever possible.

---

## Design system in one line

Pick a look from **Theme settings → Theme style** (Warm / Minimal / Playful, or Custom for your
own 8 brand colors + fonts). `snippets/brand-style.liquid` maps that choice onto Dawn's color
schemes and the global CSS tokens, so the whole store (headings, buttons, badges, icons,
footer, announcement bar) re-skins together. Never edit colors or fonts inside a section.

---

## Store type: dropdown vs. curated

The default `index.json` / `product.json` are **union** templates driven by the **Store type**
dropdown — switch V1/V2/V3 in the admin, no code. The editor lists every type's sections
(unused ones hide on the storefront). For a **cleaner, single-type** template (only that type's
sections, exact order), use the script below to swap in a curated template instead; run
`dropdown` to restore the admin-switchable version.

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/use-store-type.sh <v1\|v2\|v3\|dropdown>` | Swap the home page to a curated single-type template, or `dropdown` to restore the admin-switchable union. Add `--push` to push it. |
| `scripts/bootstrap-store.mjs` | Create the metaobject/metafield definitions and footer menus a new store needs (idempotent). |

Built on [Shopify Dawn](https://github.com/Shopify/dawn).
