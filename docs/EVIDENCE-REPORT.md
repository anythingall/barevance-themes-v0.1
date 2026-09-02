# Evidence Report — Base Theme V1 / V2 / V3

**Store:** GleamGarage (`hieu1-1.myshopify.com`) · **Ngày:** 2026-09-02
**Theme:** Dawn 16 + base theme (`custom-*`) · **Trạng thái:** theme-check 0 error

Report này ghi nhận bằng chứng thực tế cho cả 3 loại store, chụp trực tiếp trên preview
(`shopify theme dev` → store hieu1-1), full-page mỗi trang.

## Phương pháp thu thập
1. Đổi loại homepage bằng **1 lệnh**: `scripts/use-store-type.sh v1|v2|v3`.
2. Reload preview, force-reveal animation, chụp **full-page** (viewport = chiều cao trang thật).
3. Chụp homepage + product page cho từng loại (product dùng `?view=<template>` trên cùng 1
   sản phẩm Lion Mane Cat Tote).

> Đã chụp 6 ảnh full-page (V1/V2/V3 homepage + V1/V2/V3 product) — xem trong hội thoại.

---

## Tổng quan 3 loại (at a glance)

| | **V1 One Product** | **V2 Multi Style** | **V3 Multi Product** |
|---|---|---|---|
| Hero heading | "The Cutest Way To Take Your Cat **Everywhere.**" | "Loved by **Everyone.**" | "Made for You. **Loved by Everyone.**" |
| CTA | 1 nút (Shop Now) | 2 nút (Shop All Styles / Explore) | 2 nút (Shop Now / Explore) |
| Trọng tâm homepage | 1 sản phẩm + bán hàng | Style grid + best sellers | Category + nhiều product section |
| Chiều cao trang | 4562px (9 sections) | 3196px | 3123px |
| Product page | Full landing | Variant-focused | Standard + Bought Together |
| Footer | ✅ giống hệt (global) | ✅ giống hệt | ✅ giống hệt |

---

## V1 — One Product

**Lệnh:** `scripts/use-store-type.sh v1`

### Homepage (9 sections, 4562px)
| # | Section | Nội dung ghi nhận |
|---|---|---|
| 1 | Hero | Eyebrow "The Peekaboo Cat Tote" + heading 2 màu + 4 feature icon + rating 4.9/5 + Shop Now + "Free shipping today!" |
| 2 | Why Customers Love It | 5 benefit (Cozy & Comfy / Breathe Easy / Built for Safety / Lightweight / Super Adorable) |
| 3 | From coffee runs to weekend getaways | Story + 4 checklist ✓ + "See It In Action" |
| 4 | Loved by Thousands of Customers | 4 review card (Jessica/Daniel/Sophie/Ethan) + sao |
| 5 | Why Choose Us Over Others? | Bảng so sánh 6 dòng (Our Brand ✓ vs Others ✗/△) |
| 6 | Choose Your Set | **Pricing tiers 1×/2×/3× Lion Mane** — ảnh thật + $34.95/$69.90/$104.85 + compare + Save 20% + "MOST POPULAR" |
| 7 | Trust badges | Free Shipping / 30-Day / Secure / 24/7 |
| 8 | Frequently Asked Questions | 5 câu accordion |
| 9 | CTA banner | "Ready for Your Next Adventure?" (nâu) |

### Product page — `product.landing` (4057px)
Full landing: Product info (ảnh Lion Mane thật, $34.95 ~~$43.69~~ Sale, variant S/M, Add to cart / Buy it now) →
**Why Customers Love It (3 benefit từ METAFIELD)** → The Problem → The Solution → How It Works →
Why Choose Us? → **Real Reviews (2 từ METAFIELD)** → **FAQ (3 từ METAFIELD)**.

**Đặc thù V1:** section `custom-pricing-tiers` (bundle), layout landing dài, PDP có sticky Add-to-Cart (mobile).

---

## V2 — Multi Style

**Lệnh:** `scripts/use-store-type.sh v2`

### Homepage (3196px)
| # | Section | Nội dung ghi nhận |
|---|---|---|
| 1 | Hero | "Loved by Everyone." + 4 feature + rating + **2 CTA** (Shop All Styles / Explore Collections) |
| 2 | **Shop by Style** (`collection-list`) | 3 collection card (Best Sellers có ảnh thật + 2 placeholder) + View all |
| 3 | **Best Sellers** (`featured-collection`) | **4 product thật** (Black Cat / Bunny / Kitty / Lion Mane) — ảnh + "From $X" + Sale + Choose options |
| 4 | Why Customers Love Us | 5 benefit |
| 5 | Trust badges | 4 badge |
| 6 | Our Story — Built with love for you | Image-with-text + 3 checklist + "Learn More About Us" |

### Product page — `product.multi-style` (2173px)
Gọn, variant-focused: Product info (ảnh lớn, variant S/M nổi bật, Share) →
Why Customers Love It (4 blocks) → See It In Action (3 steps) → Real Reviews (4).

**Đặc thù V2:** tái dùng Dawn `collection-list` + `featured-collection` cho commerce grid (Shop by Style, Best Sellers với product thật).

---

## V3 — Multi Product

**Lệnh:** `scripts/use-store-type.sh v3`

### Homepage (3123px)
| # | Section | Nội dung ghi nhận |
|---|---|---|
| 1 | Hero | "Made for You. Loved by Everyone." + rating + 2 CTA |
| 2 | **Shop the Collection** (`multicolumn`) | 3 promo card (For You / For Gifts / For Every Occasion) |
| 3 | Trust row | Loved by 10,000+ / 4.9 Rating / Designed with Care / Safe & High Quality |
| 4 | **Best Sellers** (`featured-collection`) | 4 product thật + Sale + Choose options |
| 5 | **Shop by Category** (`collection-list`) | **6 category card** + View all |
| 6 | Real Stories from Real Customers | 4 review |
| 7 | Join the Family (`newsletter`) | Email signup |

### Product page — `product.multi-product` (2551px)
Standard: Product info (vendor + title + variant + Share) → Why Customers Love It (5 blocks) →
How It Works → **Frequently Bought Together** (Lion $34.95 + Kitty $32.95 + Black $29.95 =
**Total $97.85 ~~$122.27~~ Save 19% + Add All to Cart**) → Real Reviews (4).

**Đặc thù V3:** section `custom-frequently-bought` (bundle nhiều sản phẩm), nhiều commerce section nhất (giống store hoàn chỉnh).

---

## Bằng chứng các yếu tố dùng chung (cross-cutting)

| Yếu tố | Bằng chứng |
|---|---|
| **Footer global** | Đo trên V1/V2/V3: đều `custom-footer`, nền `rgb(58,42,30)`, 4 cột (Brand + Shop + Customer Care + About) + newsletter "Join the Family" + social + copyright — **giống hệt** |
| **Spacing đồng bộ** | Mọi section (custom + Dawn) = **36px/36px** padding trên cả 3 loại → rhythm 72px nhất quán |
| **Color scheme** | Palette nâu ManeTote (scheme nâu/kem/terracotta) áp toàn bộ: heading highlight, nút, sao, badge, footer — đổi 1 chỗ đổi cả store |
| **Typography** | Heading Playfair serif + eyebrow italic (accent font) trên cả 3 |
| **Product data** | Shopify-native: 4 product thật (ảnh AI + giá + compare-at), collection Best Sellers |
| **Metafields (V1 PDP)** | Benefits/Reviews/FAQ đọc từ product metafield (metaobject) thay cho blocks |
| **Đổi loại** | 1 lệnh `use-store-type.sh` — không dán JSON |

---

## Kết luận
- ✅ 3 loại store **hoạt động thực tế** trên store hieu1-1, mỗi loại có layout đặc thù đúng mục tiêu.
- ✅ Chuyển đổi loại chỉ bằng **1 lệnh**; user cuối vận hành hoàn toàn bằng click (settings/menu/media).
- ✅ Footer, spacing, color, typography, data **đồng bộ** trên cả 3.
- ✅ theme-check 0 error; không sửa code Dawn; mọi thành phần base theme prefix `custom-`.
