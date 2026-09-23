# Mockup Blueprint — Best Sellers (home) + reusable Product-Card spec

> Backfilled from the section that got reworked ~5×. Every row below is something that was
> initially missed and later fixed. Use the **Product-Card** table (§3) for ANY card grid
> (collection page, PDP "you may also like", etc.) so it's never re-measured.

- **Design source:** `docs/design/home.png` (723px wide) · region ≈ y 955–1230
- **Section type / base file:** Dawn `featured-collection` + `snippets/card-product.liquid` + `snippets/custom-card-swatches.liquid`

## 2. Layout
- Container: page-width; **heading + subheading centered**; **View-all link on the right**.
- Columns: 5 desktop. Card image ratio: square. Card radius: 14px.
- View-all is vertically level with the **subheading line**, and its right edge aligns to the
  **rightmost card edge** (grid edge, inset 12rem), NOT the container padding (5rem).

## 3. Product-card inventory (reusable)
| Element | Content | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|---|
| Badge | per-product text ("Bestseller", "Most Popular") — **only some cards** | Inter | ~1.2rem | 600 | white on `#23452D` | **top-left**; NOT the auto "Sale" pill; driven by `custom.card_badge` metafield |
| Image | product photo | – | – | – | – | square, radius 14px, light bg |
| Title | product name | Manrope | ~1.6rem | 700 | `#171B18` | |
| Rating stars | ★★★★½ | – | 1.4rem | – | **gold `#D99124`** (via `--color-rating-star`, not `color`) | half-star supported |
| Rating value | "4.7" | Inter | 1.3rem | – | `#171B18` @60% | **shown before the count** (Dawn hides `.rating-text` by default) |
| Rating count | "(66)" | Inter | 1.3rem | – | muted | |
| Price — sale | "$79.99" | Inter | ~1.6rem | 600 | **brand green `#23452D`** (`--brand-primary`) | **sale shown FIRST** |
| Price — compare | "$129.99" | Inter | 1.3rem | 400 | fg @50%, line-through | after the sale price |
| Currency suffix | — | — | — | — | — | **no "USD"** (`currency_code_enabled:false`) |
| Swatches | ● ● ● +N | – | 1.6rem dots | – | mapped name→hex | round dots, "+N" overflow; `custom-card-swatches` |
| Quick-add button | — | — | — | — | — | **NOT present** — design cards have no "Choose options" (`quick_add:none`) |

## Section header
| Element | Content | Align | Notes |
|---|---|---|---|
| Heading | "Best Sellers" | center | Manrope ExtraBold |
| Subheading | "Customer favorites for a reason." | center | |
| View-all | "View All Products →" | right, edge-aligned to grid | plain link (no underline) + `→` arrow; vertical center = subheading line |

## 5. Data requirements
- Metafields: `custom.card_badge` = "Bestseller" (Mirox), "Most Popular" (Solyn); none on others.
- `reviews.rating` + `reviews.rating_count` on all 5.
- Collection `best-sellers`, 5 products, order Mirox·Solyn·Neuro·FluxTrail·Voya Slip.
- Theme settings: `show_sale_badge:false` (base setting added), `currency_code_enabled:false`.
- Template JSON (`index.json` best_sellers): `quick_add:"none"`, `show_view_all:true`, `view_all_style:"link"`, `columns_desktop:5`.

## 6. AC (DOM-verifiable)
- [x] Heading + subheading centered; view-all right edge == last card right edge (both inset 120px).
- [x] View-all vertical center == subheading vertical center; has `→`; no underline.
- [x] Badge text per metafield on cards 1–2 only; top-left; no "Sale" pill anywhere.
- [x] Stars gold; numeric value + "(66)" both visible.
- [x] Price order sale-then-compare; sale green; compare struck grey; no "USD".
- [x] Swatch dots render with mapped colors + "+N".
- [x] No quick-add button.

## 7. Self-diff snippet used
`browser_evaluate` over the section: per card read `.badge`, `.rating-text`, `.rating-count`,
`.price-item--sale`/`.price__sale s`, swatch dots, `.quick-add`; compare view-all vs subheading
`getBoundingClientRect`; assert colors via `getComputedStyle`.

## 8. Sign-off
- [x] Built + self-diff all-green (2026-09-23)
- [x] User signed off (2026-09-23)
