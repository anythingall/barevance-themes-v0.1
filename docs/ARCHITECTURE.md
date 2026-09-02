# Shopify Base Theme — Kiến trúc (Dawn 16)

> Base Theme tái sử dụng cho nhiều store. 1 codebase → 3 loại store (One Product / Multi
> Style / Multi Product). Tạo store mới = chọn template + gắn product + đổi media + đổi
> color scheme + đổi font + branding. **Không sửa `.liquid`.**

Tài liệu này bao phủ Bước 3–7 trong yêu cầu. Dữ liệu sản phẩm dùng **Shopify-native +
Metafields/Metaobjects** (không hard-code).

> ⚠️ **MOBILE-FIRST là ưu tiên số 1.** Phần lớn traffic/khách mua trên mobile. Design
> reference hiện chỉ có desktop → **mobile layout do chúng ta tự thiết kế**, và phải làm
> **trước** desktop. Xem [Mục 7 — Mobile-First Strategy](#7-mobile-first-strategy-ưu-tiên-số-1).
> Mọi section chỉ được coi là "done" khi đạt DoD mobile.

---

## 0. Kết quả phân tích design (tóm tắt)

3 design dùng **chung 1 design system** (brand mẫu "ManeTote"): cùng palette nâu/kem +
accent cam, cùng typography (serif heading + script accent + sans body), cùng announcement
bar / trust badges / review card / footer. Khác biệt **không nằm ở visual** mà ở **cấu trúc
commerce**:

| | V1 One Product | V2 Multi Style | V3 Multi Product |
|---|---|---|---|
| Trọng tâm | 1 sản phẩm | 1 concept, nhiều style/variant | Nhiều sản phẩm 1 niche |
| Nav | Landing (Home/Features/FAQ) | Shop/Collections/Best Sellers | Mega menu + Categories |
| Homepage đặc thù | Pricing tiers, comparison | "Shop by Style" grid + swatch | "Shop by Category" + Best Sellers grid |
| Product page | Full landing (problem→solution→how it works) | Variant selector + "You may also love" | Standard + "Frequently Bought Together" |

→ ~80% section **dùng chung**. Chỉ khác: (a) commerce grids, (b) layout product page,
(c) nav structure. Đây là nền tảng để tách **Global** vs **Template-specific**.

---

## 1. Bước 3 — Kiến trúc Base Theme

### 1.1 Nguyên tắc phân tầng

```
┌─────────────────────────────────────────────────────────────┐
│ GLOBAL (config/settings_schema.json + settings_data.json)    │
│  Color schemes · Typography · Branding · Button/Radius · Grid │  ← đổi 1 lần, áp cả store
├─────────────────────────────────────────────────────────────┤
│ SHARED SECTIONS (sections/*.liquid) — configurable + blocks  │  ← 1 code, mọi template dùng
│  Hero · Benefits · Story · Reviews · FAQ · Compare · CTA ...  │
├─────────────────────────────────────────────────────────────┤
│ TEMPLATE-SPECIFIC SECTIONS — chỉ khác commerce grid & layout │  ← ít, riêng theo loại store
│  shop-by-style · shop-by-category · pricing-tiers · FBT ...   │
├─────────────────────────────────────────────────────────────┤
│ TEMPLATES (templates/*.json + section groups) = "cấu hình"   │  ← chuyển loại store = đổi file JSON
│  index.one-product.json · index.multi-style.json · ...        │
└─────────────────────────────────────────────────────────────┘
```

**Quy tắc vàng:**
- **Mobile-first**: viết CSS mobile trước, dùng `min-width` media query để "cộng thêm" cho
  desktop (không phải `max-width` để cắt bớt). Thiết kế mobile trước, desktop sau.
- Không hard-code màu/font trong section → luôn qua `settings.color_scheme` + biến CSS global.
- Không hard-code product data → luôn qua `section.settings` product/collection picker + metafields.
- Không duplicate section chỉ vì khác vài config → gộp thành 1 section + **blocks** + preset.
- **Không sửa/fork code Dawn** nếu có thể mở rộng. Section mới đặt prefix `custom-` để dễ phân biệt với Dawn upstream (dễ merge khi Dawn update).

### 1.2 Phần nào Global / phần nào Template-specific

**GLOBAL (1 lần cho mọi store):**
- Color schemes (5→mở rộng), typography, branding (logo/favicon), button style, border-radius,
  page width, spacing, animation — tất cả trong `settings_schema.json`.
- Header, Announcement bar, Footer → dùng **section groups** (`header-group.json`,
  `footer-group.json`), chung mọi template, chỉ đổi menu/nội dung trong Theme Editor.

**TEMPLATE-SPECIFIC (khác theo loại store):**
- File `templates/index.*.json` và `templates/product.*.json` — quyết định section nào xuất hiện.
- Vài section commerce grid đặc thù (xem 1.4).

### 1.3 Section DÙNG CHUNG (~80%) — build 1 lần

| Section (file) | Xuất hiện ở | Cấu hình chính |
|---|---|---|
| `custom-hero.liquid` | V1,V2,V3 homepage + PDP | Image/video, heading, sub, badges, 1–2 CTA, color_scheme, product picker (optional) |
| `custom-icon-benefits.liquid` | Tất cả ("Why cat parents love…") | Blocks: icon + title + text. Số cột tuỳ chỉnh |
| `custom-image-with-text.liquid` | Tất cả (story / problem-solution) | Dawn có sẵn `image-with-text`; mở rộng thêm checklist blocks |
| `custom-how-it-works.liquid` | V1,V2,V3 PDP | Blocks step (số + text) + video thumbnail |
| `custom-reviews.liquid` | Tất cả | Nguồn: metaobject `review` hoặc app (Judge.me/Loox) hoặc blocks |
| `custom-comparison-table.liquid` | V1,V2 | Blocks row (feature + us ✓ / others ✗) |
| `custom-faq.liquid` | Tất cả | Blocks Q/A hoặc metaobject `faq` |
| `custom-trust-badges.liquid` | Tất cả | Blocks: icon + title + subtitle (Free ship/Guarantee/Secure/Support) |
| `custom-size-guide.liquid` | Tất cả PDP | Table từ metafield product |
| `custom-lifestyle-gallery.liquid` | Tất cả | Grid ảnh + video, "Real cat parents" |
| `custom-cta-banner.liquid` | Tất cả | Background image + heading + CTA |
| `newsletter` (Dawn) | Tất cả footer | Dùng nguyên Dawn |
| `announcement-bar` (Dawn) | Tất cả | 3 message blocks |

### 1.4 Section RIÊNG theo template (ít)

| Section | V1 | V2 | V3 | Ghi chú |
|---|:-:|:-:|:-:|---|
| `custom-pricing-tiers.liquid` (1×/2×/3× bundle) | ✓ | | | Variant/bundle picker |
| `custom-shop-by-style.liquid` (grid collection theo style) | | ✓ | | Nguồn: list collections |
| `custom-best-sellers.liquid` (product card + swatch) | | ✓ | ✓ | Dawn `featured-collection` mở rộng swatch |
| `custom-shop-by-category.liquid` | | | ✓ | Grid category (collection) |
| `custom-category-blocks.liquid` (3 block: For your cat/lovers/gifts) | | | ✓ | Blocks image+text+CTA |
| `custom-frequently-bought.liquid` | | | ✓ | Product picker + bundle |
| Product page layout | Landing | Standard+ | Standard | Khác nhau qua `product.*.json`, cùng section |

> Lưu ý: nhiều "section riêng" thực chất là **Dawn `featured-collection`/`collection-list`
> được mở rộng thêm block swatch/badge**, không phải viết mới hoàn toàn.

---

## 2. Bước 4 — Folder Structure sau customize

```
shopify-one-product/
├── config/
│   ├── settings_schema.json      ← ★ Global Design System (color/typo/branding/tokens)
│   └── settings_data.json        ← preset mặc định + 8–10 color schemes
├── layout/
│   └── theme.liquid              ← inject CSS design tokens (giữ gần Dawn)
├── templates/
│   ├── index.json                ← default (trỏ tới 1 trong 3, hoặc dùng trực tiếp)
│   ├── index.one-product.json    ← ★ V1 homepage
│   ├── index.multi-style.json    ← ★ V2 homepage
│   ├── index.multi-product.json  ← ★ V3 homepage
│   ├── product.json              ← default PDP
│   ├── product.landing.json      ← ★ V1 PDP (full landing)
│   ├── product.multi-style.json  ← ★ V2 PDP (variant + recommend)
│   ├── product.default.json      ← ★ V3 PDP (standard + FBT)
│   ├── collection.json / list-collections.json / page.json ... (Dawn)
├── sections/
│   ├── header-group.json / footer-group.json   ← Global (Dawn)
│   ├── custom-hero.liquid                        ← ★ shared
│   ├── custom-icon-benefits.liquid               ← ★ shared
│   ├── custom-how-it-works.liquid                ← ★ shared
│   ├── custom-comparison-table.liquid            ← ★ shared
│   ├── custom-faq.liquid                          ← ★ shared
│   ├── custom-trust-badges.liquid                ← ★ shared
│   ├── custom-reviews.liquid                      ← ★ shared
│   ├── custom-pricing-tiers.liquid               ← ★ V1
│   ├── custom-shop-by-style.liquid               ← ★ V2
│   ├── custom-shop-by-category.liquid            ← ★ V3
│   ├── custom-frequently-bought.liquid           ← ★ V3
│   └── (Dawn sections giữ nguyên: main-product, featured-collection...)
├── snippets/
│   ├── design-tokens.liquid      ← ★ render CSS var từ settings (radius, spacing, shadow)
│   ├── product-badges.liquid     ← ★ reusable
│   ├── icon-picker.liquid        ← ★ map tên icon → SVG
│   ├── star-rating.liquid        ← ★ reusable
│   ├── color-swatch.liquid       ← ★ reusable (V2)
│   └── (Dawn snippets giữ nguyên)
├── assets/
│   ├── base-custom.css           ← ★ style cho custom sections (dùng CSS var, KHÔNG hard-code màu)
│   └── (Dawn assets giữ nguyên)
├── blocks/                        ← (nếu dùng theme blocks mới của Shopify — optional)
├── locales/                       ← thêm key cho custom sections (en.default + vi nếu cần)
└── docs/
    ├── ARCHITECTURE.md           ← file này
    ├── SETUP-NEW-STORE.md        ← ★ checklist tạo store mới (viết ở Phase cuối)
    ├── METAFIELDS.md             ← ★ định nghĩa metafield/metaobject
    └── design/                   ← reference (đã có)
```

Prefix `custom-` giúp: (1) phân biệt với Dawn để merge upstream an toàn, (2) grep nhanh, (3)
biết section nào là của base theme.

---

## 3. Bước 5 — Global Design System

### 3.1 Color Scheme strategy (dùng cơ chế native của Dawn)

Dawn có sẵn hệ **Color Schemes** (`color_scheme_group` trong `settings_schema.json`). Mỗi
scheme định nghĩa: background, background-gradient, text, button, button-label, secondary-button-label,
shadow. Section chỉ cần setting `color_scheme` → tự áp. **Đây chính là cơ chế "đổi 1 chỗ, đổi cả store".**

Chiến lược cho base theme — chuẩn hoá bộ scheme theo **vai trò**, không theo màu cụ thể:

| Scheme | Vai trò | Dùng ở |
|---|---|---|
| `scheme-1` Background/Base | Nền sáng chủ đạo (cream) | Body, đa số section |
| `scheme-2` Surface | Card/box nhạt hơn nền | Benefits, comparison box |
| `scheme-3` Primary/Brand | Nâu đậm — nút chính, footer, CTA | Footer, CTA banner, announcement |
| `scheme-4` Accent | Cam highlight — badge "MOST POPULAR", sale | Pricing highlight, badge |
| `scheme-5` Inverse/Dark | Text sáng trên nền tối | Hero overlay, dark CTA |

Khi tạo store mới: chỉ đổi giá trị màu trong 5 scheme này ở Theme Editor → toàn bộ store đổi
theo. Section KHÔNG bao giờ hard-code hex; luôn `{{ section.settings.color_scheme }}`.

> Primary/Secondary/Accent "color" mà yêu cầu nhắc tới được map vào scheme-3/scheme-1/scheme-4.
> Không tạo setting màu rời rạc ngoài scheme (tránh phân mảnh).

### 3.2 Typography strategy

Dùng `font_picker` native của Dawn + font scale. Bổ sung so với Dawn mặc định:

```
settings:
  type_header_font        (Heading font — serif đậm)
  type_body_font          (Body font — sans)
  type_accent_font        ★ THÊM (script "Made for Cats" — dùng ở eyebrow/label)
  heading_scale           (%)  — điều khiển H1..H6 qua clamp()
  body_scale              (%)
```

Áp qua CSS var global (`--font-heading-family`, `--font-body-family`, `--font-accent-family`,
`--font-heading-scale`). Section dùng `var(--...)`, không set font-family cứng. Đổi font ở
Branding → cả store đổi.

### 3.3 Branding & Design Tokens (global settings mới cần thêm)

Thêm nhóm settings trong `settings_schema.json`, render ra CSS var qua
`snippets/design-tokens.liquid` (include trong `theme.liquid`):

| Setting | CSS var | Ảnh hưởng |
|---|---|---|
| Logo, Favicon | (Dawn có sẵn) | Header, tab |
| Button style: solid/outline | `--btn-style` | Mọi nút |
| Button radius (0–40px) | `--btn-radius` | Nút, input |
| Card/Image radius | `--card-radius`, `--media-radius` | Card, ảnh (bo góc lớn như design) |
| Section spacing scale | `--space-scale` | Padding dọc section |
| Page width | `--page-width` (Dawn) | Container |
| Shadow intensity | `--shadow-1..3` | Card |
| Badge style | `--badge-radius` | Pill "BEST SELLER" |

→ Toàn bộ "vibe" của brand (bo góc mềm, shadow nhẹ, pill button) điều khiển từ 1 nơi.

---

## 4. Bước 6 — Chọn Template khi tạo store (không sửa code)

Shopify chọn template theo **file JSON**, không theo code. 3 cách kết hợp:

**A. Homepage — dùng "Theme template" trên `index`:**
Tạo sẵn 3 file: `templates/index.one-product.json`, `index.multi-style.json`,
`index.multi-product.json`. Merchant vào Theme Editor → dropdown chọn template cho trang chủ
(hoặc set `templates/index.json` copy từ 1 trong 3 khi setup store). Chuyển loại store = đổi
file được active, **0 dòng code**.

**B. Product page — Shopify native template selector:**
Tạo `product.landing.json` / `product.multi-style.json` / `product.default.json`. Trong
Admin → mỗi product chọn **Theme template** phù hợp (dropdown "Theme template" ở product page).
Product khác nhau có thể dùng layout khác nhau trong cùng store.

**C. Onboarding preset:**
`settings_data.json` chứa preset mặc định (màu + font mẫu). Kèm `docs/SETUP-NEW-STORE.md`
hướng dẫn 8 bước (chọn template → import product → gắn product vào section → upload media →
color scheme → font → branding → publish).

> Kết quả: chuyển One Product ↔ Multi Style ↔ Multi Product = thao tác **chọn template + gắn
> lại product/collection** trong Theme Editor. Không đụng source.

### 4.1 Data model — Metafields / Metaobjects (đã chọn Shopify-native)

Để "chọn product → data tự hiển thị", định nghĩa metafields (chi tiết ở `docs/METAFIELDS.md`
sẽ viết ở Phase 1):

**Product metafields (namespace `custom`):**
- `subtitle` (single line) — dòng dưới tên SP
- `benefits` (list / metaobject ref) — icon benefits
- `size_chart` (JSON / metaobject) — bảng size
- `how_it_works` (metaobject list) — step
- `comparison_rows` (JSON) — bảng so sánh
- `faq` (metaobject list ref) — FAQ theo product

**Metaobjects (định nghĩa 1 lần, tái dùng):**
- `review` — author, avatar, rating, text, product ref, image
- `faq_item` — question, answer
- `feature` — icon, title, text
- `usp_badge` — icon, label

→ Section đọc từ product được chọn/current product → data tự đổ. Import store mới chỉ cần
điền metafield (có thể qua CSV/Matrixify).

---

## 5. Bước 7 — Development Roadmap (theo phase)

> Nguyên tắc: **shared foundation trước, template sau, đặc thù sau cùng**. Test ship được từng phase.
> **Mobile-first xuyên suốt**: mỗi section build & test mobile TRƯỚC desktop; DoD phải đạt mobile
> (xem [Mục 7](#7-mobile-first-strategy-ưu-tiên-số-1)). Không dồn "responsive" về Phase cuối.

> **Trạng thái hiện tại:** ✅ Phase 0 (metafields + test data trên hieu1-1) · ✅ Phase 1 ·
> ✅ Phase 2 · ✅ Phase 3 (V1) · ✅ Phase 4 (V2) · ✅ Phase 5 (V3) · ✅ Phase 6 (docs + validate).
> Đã verify trên store hieu1-1: PDP landing (Sale badge, benefits từ metaobject), pricing tiers
> tính giá bundle thật. Việc còn lại: ảnh product (cần URL HTTPS), áp color scheme nâu ManeTote,
> QA mobile trên thiết bị thật, wire thêm section đọc metafield (faq/reviews).

### Phase 0 — Chuẩn bị (0.5 ngày)
- Baseline Dawn 16 (đã có). Tạo branch `feat/base-theme`.
- Viết `docs/METAFIELDS.md` + tạo metafield/metaobject definitions trên Shopify (qua Admin/MCP).

### Phase 1 — Global Design System (nền tảng) ⭐ quan trọng nhất
- Mở rộng `settings_schema.json`: color schemes (5→theo 3.1), typography (+accent font),
  branding tokens (radius/shadow/spacing/button).
- `snippets/design-tokens.liquid` + include trong `theme.liquid`.
- `assets/base-custom.css` khung biến CSS.
- Cấu hình `settings_data.json` = preset "ManeTote" mẫu từ design (để demo khớp reference).
- **Token mobile**: `--space-scale`, `--font-heading-scale` có giá trị riêng cho mobile (clamp);
  chuẩn hoá touch-target ≥44px trong `base-custom.css`.
- **DoD:** đổi 1 color scheme / font → đổi toàn store; heading co giãn hợp lý trên 375px.

### Phase 2 — Shared Sections (dùng lại nhiều nhất)
Build theo thứ tự tần suất: `custom-hero` → `custom-icon-benefits` →
`custom-image-with-text` (story/problem-solution) → `custom-trust-badges` → `custom-reviews` →
`custom-faq` → `custom-how-it-works` → `custom-comparison-table` → `custom-lifestyle-gallery` →
`custom-cta-banner`.
- Mỗi section: blocks + product/collection picker + image picker + `color_scheme` + preset.
- Reusable snippets: `star-rating`, `icon-picker`, `product-badges`.
- **Mỗi section build mobile trước** (1 cột / carousel scroll-snap) rồi mới `min-width` cho desktop.
- **DoD:** section thêm/xoá/sắp xếp được trong Theme Editor, không hard-code, **đạt mobile
  375–768px** (touch target, không tràn ngang, không CLS).

### Phase 3 — V1 One Product
- `custom-pricing-tiers` (bundle 1×/2×/3× — mobile stack dọc, tier nổi bật lên đầu).
- **Sticky Add-to-Cart bar** cho PDP mobile (dùng chung mọi template).
- `templates/index.one-product.json` + `templates/product.landing.json` (ghép shared sections
  theo design One Product).
- **DoD:** homepage + PDP khớp `docs/design/One Product` **và** mobile đạt (sticky ATC, gallery swipe).

### Phase 4 — V2 Multi Style
- `custom-shop-by-style`, `custom-best-sellers` (+ `color-swatch` snippet), variant selector nâng cao.
- `templates/index.multi-style.json` + `templates/product.multi-style.json`.
- **DoD:** khớp `docs/design/Multi Style`.

### Phase 5 — V3 Multi Product
- `custom-shop-by-category`, `custom-category-blocks`, `custom-frequently-bought`, mega menu.
- `templates/index.multi-product.json` + `templates/product.default.json`.
- **DoD:** khớp `docs/design/Multi Product`.

### Phase 6 — Polish & Handoff
- Mobile QA cuối trên real device (mobile đã làm từng phase, đây là pass kiểm tra tổng thể).
- Accessibility, `validate_theme`, performance mobile (LCP<2.5s, CLS<0.1 trên 4G throttle).
- `docs/SETUP-NEW-STORE.md` (checklist tạo store mới) + demo data.
- **DoD:** tạo 1 store mới thử — chỉ đổi product/media/color/font, không sửa code; Lighthouse
  mobile đạt ngưỡng.

---

## 7. Mobile-First Strategy (ưu tiên số 1)

> Design reference **chỉ có desktop**. Mobile layout **chúng ta tự thiết kế** và build **trước**.
> Đây không phải "responsive cho có" — mobile là trải nghiệm chính, desktop là bổ sung.

### 7.1 Breakpoints (theo Dawn, mobile-first)

```
base   : 0–749px    → MOBILE (thiết kế & code trước tiên)
750px+ : tablet
990px+ : desktop
1200px+: wide
```
CSS luôn viết cho base (mobile) trước, rồi `@media (min-width: 750px)` / `990px` để nâng cấp.
**Không** dùng desktop làm mặc định rồi `max-width` để thu nhỏ.

### 7.2 Quy tắc mobile bắt buộc (mọi section)

- **Touch target ≥ 44×44px**: nút, swatch, +/- quantity, link nav, accordion header.
- **1 cột mặc định trên mobile**: mọi grid (benefits, category, product) xếp dọc hoặc
  **horizontal scroll** (carousel) thay vì bóp nhỏ nhiều cột. Product/collection grid →
  scroll ngang có snap; benefits → 1–2 cột.
- **Typography scale theo viewport**: heading dùng `clamp()` để không quá to trên mobile
  (design desktop có H1 rất lớn — phải giảm mạnh trên mobile).
- **Ảnh**: `srcset`/`sizes` đúng, ưu tiên ảnh mobile nhẹ; ratio ổn định tránh layout shift (CLS).
- **Spacing scale**: `--space-scale` giảm trên mobile (padding dọc section nhỏ hơn desktop).
- **Ẩn/rút gọn có chủ đích**: bảng so sánh & size chart → cho scroll ngang hoặc chuyển dạng
  card/stacked; KHÔNG để tràn màn hình.

### 7.3 Pattern mobile theo loại section

| Section | Desktop (reference) | Mobile (tự thiết kế) |
|---|---|---|
| Header | Menu ngang | **Hamburger drawer** (Dawn có sẵn) + logo + cart + search |
| Hero | 2 cột (text \| ảnh) | Stack: ảnh trên / text dưới (hoặc overlay), CTA full-width |
| Benefits / feature grid | 4–5 cột | 1–2 cột hoặc scroll ngang |
| Shop by Style/Category | 6 ô ngang | **Carousel scroll-snap** ngang |
| Best sellers / product grid | 5 card/hàng | 2 card/hàng hoặc scroll ngang |
| Pricing tiers (V1) | 3 cột cạnh nhau | Stack dọc, tier "MOST POPULAR" nổi bật trên cùng |
| Comparison table | Bảng rộng | Scroll ngang có sticky cột đầu, hoặc stacked card |
| Reviews | 4 card/hàng | Carousel scroll-snap 1–1.2 card |
| Size chart | Bảng | Scroll ngang / accordion |
| FAQ | 2 cột | 1 cột accordion |
| Footer | 4 cột | Accordion cột (Dawn có sẵn) |

### 7.4 Product page (PDP) mobile — quan trọng nhất cho conversion

- **Sticky Add-to-Cart bar** dưới màn hình khi cuộn qua nút chính (giá + variant + ATC).
- Gallery: **swipe carousel** full-width + dots, thumbnail nằm dưới (không phải cột dọc như desktop).
- Variant/size selector: nút to, dễ chạm; quantity stepper lớn.
- Các block landing (problem→solution→how it works) stack dọc, ảnh trước text.

### 7.5 Performance mobile (ảnh hưởng trực tiếp doanh thu)

- Lazy-load ảnh dưới màn đầu; hero ảnh `fetchpriority="high"`, không lazy.
- Hạn chế JS; tận dụng CSS scroll-snap thay vì carousel JS nặng khi có thể.
- Target Lighthouse mobile: LCP < 2.5s, CLS < 0.1. Kiểm tra trên **4G throttling**.

### 7.6 Kiểm thử
Mỗi section test ở **375px (iPhone SE), 390px, 768px, 990px+**. Dùng preview Shopify + real
device. Section chưa đạt mobile = chưa "done".

---

## 8. Rủi ro & lưu ý

- **Reviews**: chọn giữa metaobject (tự quản) vs app (Judge.me/Loox). Base theme hỗ trợ cả 2
  nguồn qua setting "source".
- **Giữ khả năng update Dawn**: không sửa file Dawn; chỉ thêm `custom-*`. Nếu buộc phải sửa
  file Dawn, ghi lại trong doc này.
- **"Frequently Bought Together" / bundle**: cần app hoặc Shopify Bundles; base theme render UI,
  logic bundle tuỳ app.
- **Mobile layout = tự thiết kế** (design chỉ có desktop) → cần bạn review nhanh mobile của
  vài section chủ chốt (hero, PDP, pricing) trước khi nhân rộng.
