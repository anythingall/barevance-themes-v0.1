# Voya Barefoot — Build Spec & Parity Checklist

> Nguồn chân lý cho việc dựng store Voya từ base theme (`shopify-one-product`).
> Bám theo `docs/design/Voya_Barefoot_Store_Redesign_SPEC_v2_Visual.docx` + 4 ảnh thiết kế
> (`home.png`, `product.png`, `collection.png`, `collection-detail.png`).
>
> Mục tiêu quy trình: **build 1 lần ở base — cấu hình per-store — không rework.**

---

## 0. Quyết định nền tảng (đã chốt với khách)

| Chủ đề | Quyết định |
|---|---|
| Chống fingerprint | **Mức Vừa** — đổi prefix class CSS + tên file custom asset + section-id keys trong JSON. Prefix Voya = `vy`. |
| Section mới | Build **generic ở base** (`shopify-one-product`), Voya chỉ cấu hình qua settings/nội dung. |
| Ưu tiên giao hàng | **P0 = Collection + PDP** trước → sau đó Home + Collection-detail. |
| Quan hệ repo | Base = canonical (`custom-`). Voya = base + namespace (`vy-`) + templates/settings/nội dung. Cải tiến generic **sync ngược về base**. |

---

## 1. Kiến trúc & quan hệ repo

```
shopify-one-product (BASE, canonical, prefix custom-)
   │  ├─ sections/ snippets/ assets/  ← code tái dùng, generic
   │  └─ scripts/namespace-store.mjs  ← tooling chung (fingerprint)
   │
   └──(clone + overlay)──► shopify-Voya
                              ├─ prefix vy-  (sinh bởi namespace-store.mjs)
                              ├─ templates/*.json  (lắp ráp trang Voya)
                              ├─ config/settings_data.json  (Voya style preset)
                              └─ nội dung/ảnh/metafields (bootstrap-store.mjs)
```

**Nguyên tắc vàng chống rework:**
- Sửa **code component** → sửa ở **base**, rồi copy file canonical sang Voya và chạy lại `namespace-store.mjs` trên file đó (không merge tay).
- Sửa **nội dung/bố cục/màu** của riêng Voya → chỉ đụng `templates/*.json`, `config/settings_data.json`, metafields. Không đụng `.liquid`.
- Không bao giờ hand-edit prefix `vy-` — nó là **output của tool**.

---

## 2. Design tokens (từ SPEC §9.1 + bảng màu)

Map thẳng vào một **Voya style preset** (Theme settings → style = Custom, hoặc thêm preset "Voya").
Không hard-code màu trong `.liquid`; đổ vào color schemes + design tokens.

### 2.1 Màu

| Token | Value | Dùng cho |
|---|---|---|
| Primary | `#23452D` | CTA chính, active, accent chính |
| Dark Primary | `#193722` | Hover, nền đậm (footer, final CTA) |
| Heading | `#171B18` | Tiêu đề / tên sản phẩm |
| Body | `#454A46` | Body / UI text |
| Cream | `#F7F5EF` | Section giáo dục/editorial |
| Sage | `#E7EEE5` | Benefits / wellness |
| Sand | `#E9E0D0` | Lifestyle / offer |
| Mist | `#F3F4F1` | Card / UI surface |
| White | `#FFFFFF` | Bề mặt shopping |
| Border | `#DDE1DB` | Viền / divider |
| Sale | `#B85C3A` | **Chỉ** dùng cho giá sale |
| Rating | `#D99124` | Sao / rating |

**Quy tắc màu (SPEC §9.2):** Green = action · Cream/Sage = education/wellness · White = shopping ·
Lifestyle photo = cảm xúc · Product photo = bằng chứng. Shadow tiết chế, radius ảnh/card **8–16px**.
Pill button OK cho filter/secondary. **Một** bộ icon nhất quán (không trộn emoji).

### 2.2 Typography

| Vai trò | Font | Size |
|---|---|---|
| Heading / tên SP / button | **Manrope** | — |
| Body / UI | **Inter** | — |
| H1 | Manrope ExtraBold | 56–64px desktop / **38px mobile** |
| H2 | Manrope Bold | 38–44px desktop / **30–32px mobile** |
| H3 | Manrope SemiBold | 22–26px |
| Body | Inter | 16–18px desktop / **15–16px mobile** |
| Small UI | Inter Medium | 12–14px |
| Eyebrow | uppercase, tracking | 12–14px |
| Price | Bold | 20–22px |
| Button | SemiBold | 14–15px |

---

## 3. Component map (SPEC §13, Table 22) → section base

Trạng thái: ✅ có sẵn (chỉ restyle/config) · 🟡 nâng cấp section có sẵn · 🔴 build mới (generic ở base).

| # | Component (spec) | Section base | Trạng thái | Ghi chú |
|---|---|---|---|---|
| 1 | AnnouncementBar | `custom-announcement` | ✅ | Free ship / 30-day / trust |
| 2 | HeaderNavigation | `header` | 🟡 | Menu: Shop, Best Sellers, New, Shop by Need, Why Barefoot?, Reviews, About, Help |
| 3 | HeroBanner | `custom-hero` | ✅ | Eyebrow + H1 + 2 CTA + trust icons dưới hero |
| 4 | TrustBar | `custom-trust-badges` / `custom-icon-benefits` | ✅ | 4 mục: Free Ship / 30-Day / Secure / 10k+ |
| 5 | ProblemSolution | `custom-problem` + `custom-solution` | ✅ | "Your Feet Weren't Made to Be Squeezed" + 3 card |
| 6 | BarefootBenefits | `custom-icon-benefits` | 🟡 | 4 icon: Wide Toe / Flexible / Zero Drop / Lightweight (bản education) |
| 7 | ShopByNeed | — | 🔴 | Grid 5–6 card use-case có ảnh + arrow (routing collection) |
| 8 | BestSellerCarousel | `custom-frequently-bought`/collection featured | 🟡 | 4–5 hero + badge + rating + swatch |
| 9 | ProductFamilyNav | `card-product` (swatch row) | 🟡 | **Bỏ section riêng.** "1 dòng SP, nhiều mẫu mã" = mỗi model là 1 product, màu = variant → gom sẵn. Chỉ cần thêm **hàng color-swatch trên card** (●●● +N như thiết kế). Xem §9. |
| 10 | CollectionProductGrid | `main-collection-product-grid` | ✅ | Dawn grid + card chuẩn |
| 11 | SmartFilter | `facets` (Dawn) | 🟡 | Use/Style/Fit/Features/Season/Price |
| 12 | ProductCard | `card-product` snippet | 🟡 | Badge + tên + 1-line benefit + rating + swatch + Quick Add |
| 13 | ProductQuickView | — | 🔴 | Quick view low-friction (P2) |
| 14 | ProductComparison | `custom-comparison-table` | ✅ | Mirox/Solyn/Neuro/FluxTrail |
| 15 | ShoeFinder | — | 🔴 | Quiz ~30s → gợi ý sản phẩm |
| 16 | UGCCarousel | `custom-social-proof` | 🟡 | Ảnh/video khách + quote thật |
| 17 | ReviewHighlights | `custom-reviews` | 🟡 | Theme filter: Comfort/Fit/Walking/Style |
| 18 | ReviewGrid | `custom-reviews` | 🟡 | Full review + filter |
| 19 | FitGuide | `custom-size-guide` | ✅ | Đo chân + toe-room |
| 20 | UseCaseCards | `custom-image-with-text`/grid | 🟡 | "Made for Your Everyday" 5 card |
| 21 | EducationCards | — | 🔴 | "New to Barefoot Shoes?" 3 card blog |
| 22 | BundleOffer | `custom-pricing-tiers` | ✅ | 1/2/3 pair value |
| 23 | ShippingReturns | `custom-trust-badges` | ✅ | Gần CTA |
| 24 | FAQAccordion | `custom-faq` | ✅ | 2-cột trên desktop |
| 25 | FinalCTA | `custom-cta-banner` | ✅ | "Ready to Give Your Feet More Room?" |

**Cần build mới (generic ở base):** ~~ShopByNeed (7)~~ ✅, ShoeFinder (15), ~~EducationCards (21)~~ ✅.
QuickView (13) là P2. ProductFamilyNav (9) → nâng cấp card swatch (§9), không phải section mới. Còn lại là nâng cấp/config.

### 3.1 Data model — "1 dòng sản phẩm, nhiều mẫu mã" (chốt với khách)

- Store = **1 dòng** barefoot shoes (niche tập trung) → base **store type V3 (Multi Product)**.
- **Mỗi mẫu mã (model) = 1 Shopify product** (Mirox, Solyn, Neuro… ~69 model).
- **Màu = variant** (option "Color") + **Size = variant** (option "Size") của model đó.
- Gom nhóm 2 tầng: màu của cùng model → **swatch trên 1 card**; model khác nhau → **card riêng**.
- ⚠️ Anti-pattern cần tránh (spec Table 3): KHÔNG upload mỗi màu thành 1 product riêng → grid phình, choice overload.

### 3.2 Phase 2 — TRẠNG THÁI: HOÀN TẤT ✅

Tất cả build generic ở base → sync sang Voya (`vy-`) → theme-check 0 error cả hai repo.

1. ✅ `custom-shop-by-need` (Voya: `vy-sbn`) — grid use-case routing.
2. ✅ `custom-education-cards` (Voya: `vy-edu`) — guide cards.
3. ✅ `custom-card-swatches` (Voya: `vy-card-swatches`) — hàng màu trên card, đọc option có swatch, "+N".
4. ✅ `custom-shoe-finder` (Voya: `vy-shoe-finder`) — quiz nhiều bước, custom element, mỗi đáp án gắn URL kết quả cấu hình được, fallback default.

---

## 4. Parity checklist theo trang

> Dùng làm **QA gate**: tick khi render khớp thiết kế ở **cả mobile (375px) và desktop**.
> Ảnh gốc trong `docs/design/`.

### 4.1 PDP — `product.png` (P0, target 68→90)

Thứ tự section từ trên xuống:
- [ ] Announcement bar (green) + header
- [ ] Breadcrumb: Home / Walking Shoes / Mirox
- [ ] Gallery trái (thumbnail dọc + zoom + video) · Buy box phải
- [ ] Buy box: tên + tagline "Feels Like Barefoot. Looks Like a Sneaker." + rating 4.7 (66) + giá + compare-at + %OFF badge + 4 benefit icon + Color swatch + Size 36–46 + qty + **Add to Cart — $79.99** + Buy Now + 3 trust icon
- [ ] TrustBar 4 mục (Wide Toe / Flexible / Zero Drop / Lightweight)
- [ ] Problem→Solution + so sánh Traditional vs Mirox (2 ảnh)
- [ ] "Why Mirox Feels Different" — 4 card benefit
- [ ] "See Mirox in Motion" — 5 video thumbnail
- [ ] "Real People. Real Comfort." — 5 UGC card + quote
- [ ] Product Details (bảng specs) · How Should Mirox Fit (foot diagram) · Mirox Fit (bar meters)
- [ ] "Made for Your Everyday" — 5 use-case card
- [ ] "Compare with Other Voya Shoes" — bảng + bundle 1/2/3 pair
- [ ] "What Customers Are Saying" — 4.7/5 + review filter + card
- [ ] FAQ 2-cột
- [ ] Final CTA banner "Give Your Feet Room to Move" + Add to Cart + trust
- [ ] **Mobile**: sticky ATC hiện khi cuộn · gallery swipe 1 tay · size/qty chạm dễ

### 4.2 Collection detail (intent-specific) — `collection-detail.png` (P0)

- [ ] Hero: "WALKING BAREFOOT SHOES / Walk Further. Feel Lighter." + rating + 2 CTA + handwritten accent
- [ ] TrustBar 4 (Roomy Toe / Flexible / Lightweight / All-Day)
- [ ] "Best Walking Shoes" — 4 hero card
- [ ] "All Walking Shoes (24 styles)" — sidebar filter (Use/Style/Fit/Features/Season/Price) + grid card
- [ ] "Which Walking Shoe Is Right for You?" — bảng compare (Best For/Lightweight/Wide Toe/Outdoor/Cushion)
- [ ] "Made for Miles. Loved by Walkers." — 5 UGC + CTA video
- [ ] "Why Barefoot Shoes Feel Different When You Walk" — 4 benefit
- [ ] FAQ + Final CTA (green) "Ready to Walk More Naturally?"
- [ ] **Mobile**: filter collapse thành drawer · grid 2 cột

### 4.3 Homepage — `home.png` (P1)

- [ ] Hero: eyebrow "NATURAL MOVEMENT. A HAPPIER YOU." + H1 "Give Your Feet Room to Move." + 2 CTA + 4 trust icon
- [ ] TrustBar 4 (Free Ship / 30-Day / Secure / 10k+ 4.7★)
- [ ] Problem "Your Feet Weren't Made to Be Squeezed" + 3 card (Cramped/Stiff/Heavy)
- [ ] "What Makes a Barefoot Shoe Different?" — 4 icon (Wide Toe/Flexible/Zero Drop/Lightweight) trên nền Sage
- [ ] "Shop by What You Need" — 6 card use-case ảnh
- [ ] Best Sellers — 5 card + "View All Products"
- [ ] "Real People. Real Comfort." (UGC video trái) + "What Customers Love" (3 quote card)
- [ ] ShoeFinder "Not Sure Which Voya Is Right for You?" (mockup phone) + "Why Voya?" 4 điểm
- [ ] Bundle "One Pair Is Good. Two Makes Life Easier." — 1/2/3 pair
- [ ] FAQ 2-cột + Final CTA "Ready to Give Your Feet More Room?"
- [ ] Footer green: Shop/About/Help + newsletter + social

### 4.4 Collection chính (69 sp) — `collection.png` (P1)

- [ ] Hero "Made to Move Naturally" + trust 4
- [ ] "What Are You Looking For?" — 6 card category
- [ ] "Customer Favorites" — 5 hero card
- [ ] "All Barefoot Shoes (69 styles)" — filter sidebar + grid + sort
- [ ] "Compare Our Best Sellers" — bảng compact
- [ ] ShoeFinder strip + reviews + Education cards (3) + FAQ + Final CTA

---

## 5. Chiến lược chống fingerprint (Mức Vừa)

**Vấn đề:** platform quảng cáo/anti-multistore fingerprint qua tên class CSS + cấu trúc DOM +
tên/hàm băm file asset + section-id. Voya clone base → đang trùng 100%.

**Giải pháp — `scripts/namespace-store.mjs`** (chi tiết trong header script):

| Bề mặt fingerprint | Xử lý |
|---|---|
| Class CSS `custom-*` | Đổi token `custom-` → `vy-` trong mọi `.css` + `.liquid` (class attr, `{% style %}`, inline `<script>` selector, `--custom-` var). **Ngoại lệ duy nhất:** `custom-liquid` (section Dawn) qua regex lookahead. |
| Tên file custom asset | `base-custom.css` → `vy-custom.css` (+ ref trong `layout/theme.liquid`). Hash nội dung đổi theo. |
| Section-id trong DOM | JSON template: rename object key + `order[]` (giữ `"type"`). DOM id `...__custom-hero` → `...__vy-hero`. |
| `base.css` (Dawn) | **Giữ nguyên** — giống hàng triệu store Dawn, không phải dấu hiệu phân biệt. |

**An toàn (đã verify):** không `.js` nào dùng `custom-`; locale `custom-*` duy nhất là `custom-liquid`;
`"type"` giữ nguyên nên vẫn trỏ đúng file section; setting Shopify `custom_liquid` dùng gạch dưới nên không dính.

**Quy trình re-sync (giữ đồng bộ base):** khi base cập nhật 1 section →
`cp base/sections/X.liquid Voya/sections/X.liquid && node scripts/namespace-store.mjs --apply --paths sections/X.liquid`.
Không merge tay → không rework.

**Verify sau apply:** `shopify theme check` sạch + grep DOM render không còn class trùng base + so ảnh parity.

---

## 6. Quy trình & cổng kiểm soát (chống rework)

| Phase | Việc | Cổng (gate) |
|---|---|---|
| 0 | Build-spec + parity checklist (tài liệu này) | Khớp thiết kế trên giấy trước khi code |
| 1 | `namespace-store.mjs` ở base | Dry-run sạch + theme-check pass sau apply |
| 2 | Build 4 section generic mới ở base (ShopByNeed, ProductFamilyNav, ShoeFinder, EducationCards) | Mobile-first, theme-check, có preset demo |
| 3 | Lắp ráp Voya: style preset + JSON templates (PDP+Collection trước) + nội dung | So ảnh parity từng trang |
| 4 | QA: mobile 375px + desktop, one-handed, theme-check, fingerprint verify | Tất cả checklist §4 tick xanh |
| 5 | Sync section generic về base, tag release | Base build được cho clone kế tiếp |

---

## 7. Definition of Done (SPEC §16)

- [ ] **Brand**: khách nói được Voya là gì trong 1 câu.
- [ ] **Home**: hiểu problem/category/benefit/next action không cần đọc hết.
- [ ] **Collection**: lọc 69 sp theo need/use/fit không ngợp.
- [ ] **PDP**: hiểu khác biệt / vừa chân / dùng để làm gì / vì sao tin.
- [ ] **Reviews**: proof cấu trúc theo mối lo khách, vẫn thật.
- [ ] **Paid**: ad message khớp hero landing trong viewport đầu.
- [ ] **Offer**: bundle minh bạch, không thay thế value prop.
- [ ] **Analytics**: đo được funnel theo page/product/angle.
- [ ] **Mobile**: mọi thao tác mua dùng 1 tay được; proof hiện trước friction.
- [ ] **Fingerprint**: DOM/CSS/asset Voya không trùng base (verify).

---

## 8. Ghi chú dữ liệu (SPEC §17)

- Giá/tồn/review là **dữ liệu Shopify động** — kéo live, không hard-code vào thiết kế.
- Product handle/URL: audit tránh mâu thuẫn (spec ghi `starstride` hiện resolve ra "Mirox").
- Dùng asset/UGC có bản quyền của brand; claim sức khỏe phải gắn với review khách, không tự chế claim y tế.
