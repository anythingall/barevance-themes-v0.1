# Metafields & metaobjects

The data model that lets marketing content (benefits, FAQs, reviews, subtitle, size chart)
live on **product data** instead of being hard-coded in the theme. Create it in one command
with [`scripts/bootstrap-store.mjs`](../scripts/bootstrap-store.mjs), or set it up manually as
described below.

---

## 1. Metaobject definitions

Reusable content objects, defined once per store:

### `feature`
| Field | Type |
|-------|------|
| `icon` | single line text (icon name, e.g. `leaf`, `heart`, `padlock`) |
| `title` | single line text |
| `text` | multi-line text |

### `faq_item`
| Field | Type |
|-------|------|
| `question` | single line text |
| `answer` | multi-line text |

### `review`
| Field | Type |
|-------|------|
| `author` | single line text |
| `rating` | number (decimal, 0–5) |
| `text` | multi-line text |
| `avatar` | file reference (image) |
| `badge` | single line text (e.g. "Verified Buyer") |

## 2. Product metafields (namespace `custom`)

| Key | Type | Used by |
|-----|------|---------|
| `subtitle` | single line text | Product subtitle |
| `badge_text` | single line text | "Best Seller" badge |
| `size_chart` | json | Size guide |
| `usp` | list of single line text | USP list under the price |
| `benefits` | list of `feature` references | `custom-icon-benefits`, PDP feature icons |
| `faq` | list of `faq_item` references | `custom-faq` |
| `reviews` | list of `review` references | `custom-reviews` |

---

## 3. How sections read metafields

The `custom-icon-benefits`, `custom-faq`, and `custom-reviews` sections each have a **`source`**
setting:

- **Blocks** (default) — content is entered directly in the section (works with no metafields).
- **Product metafield** — on a product page, the section reads the product's metaobjects
  (`product.metafields.custom.benefits` / `.faq` / `.reviews`) and falls back to blocks if the
  metafield is empty.

This means the same section works on the homepage (blocks) and on the product page (per-product
metafield content) with no code changes. The PDP buy-area feature icons
(`snippets/custom-pdp-features.liquid`) also read `custom.benefits`.

---

## 4. Create the definitions

### Option A — one command (recommended)

```bash
SHOPIFY_STORE=your-store.myshopify.com SHOPIFY_TOKEN=shpat_xxx \
  node scripts/bootstrap-store.mjs
```

Creates the three metaobject definitions and the seven product metafield definitions (and the
footer menus). Idempotent — safe to re-run.

### Option B — GraphQL (manual)

Metaobject definition (repeat per type):

```graphql
mutation CreateMetaobjectDef($definition: MetaobjectDefinitionCreateInput!) {
  metaobjectDefinitionCreate(definition: $definition) {
    metaobjectDefinition { id type }
    userErrors { field message code }
  }
}
```

Metafield definition (the reference ones need the metaobject definition's id):

```graphql
mutation CreateDef($def: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $def) {
    createdDefinition { id key }
    userErrors { field message code }
  }
}
```

Example variables for a reference metafield:

```json
{
  "def": {
    "name": "Benefits", "namespace": "custom", "key": "benefits",
    "type": "list.metaobject_reference", "ownerType": "PRODUCT",
    "validations": [
      { "name": "metaobject_definition_id", "value": "gid://shopify/MetaobjectDefinition/…" }
    ]
  }
}
```

---

## 5. Populate content

- **Metaobjects** — Admin → Content → Metaobjects → add `feature` / `faq_item` / `review`
  entries.
- **Product metafields** — on a product, fill `custom.subtitle`, `custom.benefits`, etc.
  (reference the metaobjects you created). Bulk-editable via CSV / Matrixify.

Sections without metafield content simply fall back to their block content, so a store can go
live before any metafields are filled in.
