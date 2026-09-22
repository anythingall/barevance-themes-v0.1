# Voya Barefoot — project rules

Voya is a barefoot-shoe store cloned from the canonical base theme **`shopify-one-product`**
(Dawn 16). This repo = base + a per-store `vy-` namespace + templates/settings/content.

## Standard process — always use it
Any work that must match the design in `docs/design/` MUST follow the **`voya-parity` skill**
(`.claude/skills/voya-parity/SKILL.md`): measure the design → write measurable AC → build the
section generically in **base** → sync with `scripts/namespace-store.mjs` → capture the actual
section (Playwright **element** screenshot) → **overlay-compare** (`scripts/make-compare.mjs`
+ Artifact) → user signs off → next section. One section at a time. Do not eyeball-and-hope.

Design AC (tokens, per-page section order, parity checklist): `docs/plan/voya-build-spec.md`.

## Hard rules (avoid rework)
- **Build shared code in base** (`../shopify-one-product`, `custom-` prefix), then `cp` into this
  repo and run `node scripts/namespace-store.mjs --apply --paths <file>`. **Never hand-edit the
  `vy-` prefix** — it is generated. Common improvements flow back to base.
- **Colors/fonts** come from the design tokens + color schemes (Primary `#23452D`, Heading
  `#171B18`, Manrope ExtraBold headings, Inter body). Never hard-code hex in a section.
- **Section photos**: use an `image_url` text setting (Shopify CDN URL), not `image_picker`
  (its `shopify://shop_images/…` refs don't resolve for uploaded Files). Missing glyph icons →
  create line-art `assets/icon-*.svg` and render via `custom-icon`.
- **Preview**: `shopify theme dev --store hieu1-1.myshopify.com` → `http://127.0.0.1:9292`.
  Deployed theme = **"Voya Barefoot" #145358455018** (unpublished). Keep `shopify theme check`
  at **0 errors** on every push.
- **Images can't reach 100%** vs the mockup without the original assets (AI-gen is plan-gated).
  Layout/color/font/spacing do — treat the photo-content gap as known.
