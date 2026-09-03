# Base Theme — Reusable Shopify Theme

A production-ready Shopify base theme, built on **Dawn 16**, that you can reuse to launch
many stores fast. One codebase powers **three store types**, and every store is set up by
picking a template, importing products, and changing settings — **no code changes required**.

- **One codebase → 3 store types**: One Product, Multi Style, Multi Product.
- **Global design system**: change colors, fonts and branding in one place and the whole
  store follows. Ships with 3 ready-made style presets.
- **Mobile-first**: every section is designed for mobile first, then enhanced for desktop.
- **Shopify-native**: real products, collections, metafields, metaobjects and menus — no
  hard-coded content.
- **Fast setup**: push the theme, run one bootstrap command, pick a store type, choose a
  preset. ~15 minutes to a working store.

---

## The 3 store types

| Type | Best for | Homepage template | Product template |
|------|----------|-------------------|------------------|
| **V1 — One Product** | A single hero/trending product | `index.one-product` | `product.landing` |
| **V2 — Multi Style** | One concept, many styles/variants | `index.multi-style` | `product.multi-style` |
| **V3 — Multi Product** | Many products in one niche | `index.multi-product` | `product.multi-product` |

They share ~80% of their sections and all of the global chrome (announcement bar, header,
footer). They differ mainly in the commerce structure (single product vs. style grid vs.
category browsing). See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

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
# 1. Create the store's data structure (metafields, metaobjects, footer menus) — one command
SHOPIFY_STORE=your-store.myshopify.com SHOPIFY_TOKEN=shpat_xxx \
  node scripts/bootstrap-store.mjs

# 2. Choose the store type (sets the homepage layout)
scripts/use-store-type.sh v1        # v1 = One Product · v2 = Multi Style · v3 = Multi Product
```

Then, in the Shopify admin (all clicks, no code):

1. **Branding** — Theme settings → pick a color **preset** (Warm / Minimal / Playful), set the logo.
2. **Products** — import your catalog, then set each product's **Theme template**.
3. **Sections** — connect products/collections to sections in the theme editor.
4. **Media** — upload your hero and lifestyle images.
5. **Discounts** — if you use the pricing tiers, add matching Automatic discounts.

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
│   ├── design-tokens.liquid   # Emits global CSS variables from settings
│   └── custom-*.liquid        # Shared snippets (icons, stars, cart promo, …)
├── templates/
│   ├── index.one-product.json / index.multi-style.json / index.multi-product.json
│   ├── product.landing.json / product.multi-style.json / product.multi-product.json
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

Colors and fonts are defined **once** (Theme settings → Colors / Typography) and consumed by
every section through Dawn's color schemes and CSS design tokens. Change a preset — or a
single color/font — and the whole store (headings, buttons, badges, icons, footer,
announcement bar) updates together. Never edit colors or fonts inside a section.

---

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/use-store-type.sh <v1\|v2\|v3>` | Set the homepage layout for a store type. Add `--push` to push it. |
| `scripts/bootstrap-store.mjs` | Create the metaobject/metafield definitions and footer menus a new store needs (idempotent). |

Built on [Shopify Dawn](https://github.com/Shopify/dawn).
