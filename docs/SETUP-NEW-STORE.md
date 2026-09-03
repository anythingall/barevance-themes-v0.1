# Setting up a new store

How to launch a new store with this base theme — **without editing code**. There's a fast
path (~15 minutes) and a detailed reference below it.

> See [ARCHITECTURE.md](ARCHITECTURE.md) for how the theme is structured, and
> [SECTIONS.md](SECTIONS.md) for what each section does.

---

## ⚡ Fast path (~15 minutes)

```bash
# 1. Push the theme to the store as an unpublished theme (safe — doesn't touch the live theme)
shopify theme push --store YOUR-STORE.myshopify.com --unpublished --theme "Base Theme"

# 2. Create the store's data structure (metafields, metaobjects, footer menus) — one command
SHOPIFY_STORE=YOUR-STORE.myshopify.com SHOPIFY_TOKEN=shpat_xxx \
  node scripts/bootstrap-store.mjs
```

Then, in the admin (all clicks, no code):

3. **Store type** — Theme settings → **Store type** → V1 / V2 / V3. One dropdown sets the home
   page and the default product page.
4. **Style** — Theme settings → **Theme style** → Warm / Minimal / Playful / Custom + logo.
5. **Products** — import your catalog. Leave products on the **default** product template so they
   follow the Store type; assign a specific template (`landing`/`multi-style`/`multi-product`)
   only for per-product exceptions.
6. **Sections** — connect products/collections to the pricing tiers, best-sellers, and other
   sections in the theme editor.
7. **Media** — upload your hero and lifestyle images.
8. **Discounts** — if you use the pricing tiers, create matching Automatic discounts (below).

> **`SHOPIFY_TOKEN`:** Admin → Settings → Apps and sales channels → Develop apps → create an
> app → Admin API scopes `write_products, write_content, write_online_store_navigation,
> write_metaobject_definitions, write_metaobjects` → Install → reveal the Admin API access
> token. `bootstrap-store.mjs` is safe to re-run — it skips anything that already exists.

---

## Detailed reference

### Step 1 — Choose the store type (V1 / V2 / V3)

| Type | Home page | Product page | Use when |
|------|-----------|--------------|----------|
| **V1 One Product** | Full landing | Full landing | One hero / trending product |
| **V2 Multi Style** | Shop by Style + Best Sellers | Variant-focused | One concept, many styles/variants |
| **V3 Multi Product** | Shop by Category + rows | Frequently Bought Together | Many products in one niche |

**One dropdown, no code:** Theme settings → **Store type** → V1 / V2 / V3 → Save. This drives
both the home page (`templates/index.json`) and the **default** product page
(`templates/product.json`) — they are union templates whose sections show/hide by the chosen
type. The theme editor lists every type's sections; the unused ones are hidden on the
storefront (each section has a "Show on store type" control).

**Product templates — the default follows Store type.** Products left on the default template
follow the dropdown. To give a specific product a different layout, assign it a template:
Admin → Products → open a product → **Theme template** → `landing` / `multi-style` /
`multi-product`. Those products keep that template regardless of Store type.

**Prefer a single-type template?** For a cleaner editor (only that type's sections, exact
curated order), swap the union for a curated template — and back — with the helper script:

```bash
scripts/use-store-type.sh v2 --push       # curated V2 home page (only V2 sections)
scripts/use-store-type.sh dropdown --push # restore the admin-switchable union home page
```

### Step 2 — Import products & collections

- Import your catalog (CSV / Matrixify / an app). Never hard-code products in the theme.
- V2/V3: create collections for styles or categories.
- Fill in images, prices, variants, and compare-at price (to show a strikethrough / % off).

### Step 3 — Connect products & collections to sections

In the theme editor, open each section and pick its source:

| Section | Connect to |
|---------|------------|
| Best Sellers (`featured-collection`) | a collection |
| Shop by Style / Category (`collection-list`) | a collection per tile |
| Pricing tiers (V1) | a product per tier + quantity |
| Bought together (V3) | the products in the bundle |
| Sticky Add to Cart | automatic, from the current product |

### Step 4 — Upload images & media

All in the theme editor — no code:

- **Logo / favicon** — Theme settings → Logo.
- **Hero image** (+ a separate mobile image) — the Hero section.
- **Lifestyle / story image** — the Image-with-text section.
- **Product images** — on the product (admin).
- **CTA background** — the CTA banner section.

### Step 5 — Colors & fonts (Theme style)

Theme settings → **Theme style** dropdown. This is the main branding control:

- **Warm / Minimal / Playful** — a ready-made look (colors + fonts + corner radius). Pick one
  and the whole store re-skins instantly. No code, no theme push.
- **Custom** — set your own: fill the simple **Custom style** group (8 labelled brand colors —
  Background, Text, Primary, Dark sections, Accent…) and choose fonts in **Typography**. The
  theme derives all five Dawn color schemes from those 8 colors for you.

Either way, one control updates the whole store — highlights, buttons, stars, badges, icons,
footer. You never edit colors inside a section, and you don't need Dawn's raw 5-scheme editor.

> **Adding your own preset (developer):** add one `{% when %}` branch in
> `snippets/brand-style.liquid` and one option to the `style_preset` select in
> `config/settings_schema.json`. It then appears in the dropdown for everyone — no extra theme.

### Step 6 — Fonts

Theme settings → **Typography**: heading font, body font, **accent font** (eyebrow labels),
size scales, and "Mobile heading size" (Base theme group).

### Step 7 — Branding (Base theme settings)

Theme settings → **Base theme**:

- Header tagline + "SHOP NOW" CTA button.
- Mobile heading scale, sticky Add-to-Cart toggle.
- Card radius, content width. (Dawn also controls button radius, shadows, spacing, page width.)

### Step 8 — Global chrome (header & footer)

Header and footer are **section groups** rendered on every page — so they're identical
everywhere and you configure them once.

**Footer** (`custom-footer`, in `footer-group`):

- Brand column: logo + tagline + description + social icons (Theme settings → Social media).
- Three menu columns (`Shop`, `Customer Care`, `About`) point at navigation menus
  `footer-shop`, `footer-help`, `footer-company`. Edit links in **Online Store → Navigation** —
  never in code. `bootstrap-store.mjs` creates these menus for you.
- "Join the Family" newsletter, payment icons, policy links — toggled in the section settings.

**Header**: the main menu is the `main-menu` navigation menu; edit its items in Navigation.

### Step 9 — Test & publish

- **Test on mobile** (375–768px): hero, product page (sticky ATC + swipe gallery), pricing,
  comparison table (horizontal scroll), reviews (carousel).
- Check the header, announcement bar and footer.
- Preview → **Publish**.

---

## Quantity discounts (pricing tiers)

The **pricing tiers** section shows "buy more, save more" (2× / 3× / 4×). For the discount to
actually apply at checkout and show in the cart drawer:

1. **Admin → Discounts → Create automatic discount** for each tier, e.g.:
   - "Buy 2+ Save 10%" — Amount off products, 10%, minimum quantity of items = 2
   - "Buy 3+ Save 15%" — 15%, minimum quantity = 3
   - "Buy 4+ Save 20%" — 20%, minimum quantity = 4
   - Set them **not combinable** — Shopify applies the highest qualifying tier automatically.
2. In the Pricing tiers section, set each tier's **discount %** to match the admin discount
   (2 → 10, 3 → 15, 4 → 20). This is a display value; the admin discount does the real work.
3. The cart drawer shows total savings automatically via `cart.total_discount` — no config.
   The optional "Cart discount promo" progress bar (Theme settings) nudges shoppers toward the
   next tier; its tier quantities must match the admin discounts.

> Compare-at price and quantity discounts are two different mechanisms. If you use quantity
> discounts, remove compare-at prices from the products so you don't show two "Save %" badges.

---

## Standalone pages

The theme ships styled page templates. Each store page just needs its **Theme template**
(page dropdown in the admin) set to the matching suffix:

| Page | Template suffix |
|------|-----------------|
| FAQ | `faq` |
| About Us | `about-us` |
| Contact | `contact` |
| Shipping & Returns | `shipping-returns` |
| Size Guide | `size-guide` |

The content lives in the template's sections (edit in the theme editor). Policy pages
(Privacy / Refund / Terms) are best left on Shopify's default, generated from Store policies.

---

## Notes

- **Reviews** can come from section blocks (manual) or product metafields (metaobjects), or a
  reviews app — the sections support a `source` setting. See [METAFIELDS.md](METAFIELDS.md).
- **Frequently Bought Together / bundles** render the UI; the bundle logic relies on an app or
  Shopify Bundles.
- The base theme never modifies Dawn's core files; everything it adds is prefixed `custom-`.
