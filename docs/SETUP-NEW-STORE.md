# Tạo store mới từ Base Theme

Quy trình tạo một store mới **không cần sửa source code**. Ước tính 30–60 phút.

> Xem kiến trúc tổng thể ở [ARCHITECTURE.md](ARCHITECTURE.md). Base theme là Dawn 16 +
> các section `custom-*`, mobile-first.

---

## Bước 1 — Chọn loại store (V1 / V2 / V3)

Có 3 loại, khác nhau bởi **file JSON template**:

| Loại | Homepage | Product page | Dùng khi |
|---|---|---|---|
| **V1 One Product** | `index.one-product` | `product.landing` | 1 sản phẩm chính / trending product |
| **V2 Multi Style** | `index.multi-style` | `product.multi-style` | 1 concept, nhiều màu/style/variant |
| **V3 Multi Product** | `index.multi-product` | `product.multi-product` | Nhiều sản phẩm cùng niche |

> ⚠️ **Quan trọng — Shopify dùng 2 cơ chế KHÁC nhau:**
> Trang chủ (index) và cart **không hỗ trợ** "alternate template" chọn qua UI — trang chủ luôn
> render `templates/index.json`. Còn **product / collection / page** thì chọn template qua
> dropdown **Theme template** trong Admin (native, không cần code).

### A. Product page — chọn qua dropdown (native, no-code) ✅
Admin → **Products** → mở product → panel bên phải mục **Theme template** → chọn `landing` /
`multi-style` / `multi-product` → **Save**. Mỗi product có thể dùng layout khác nhau.
(Tương tự cho Collection và Page: mỗi resource có dropdown Theme template riêng.)

### B. Homepage — set 1 lần lúc setup (KHÔNG dán JSON)
Trang chủ không có dropdown template. Nhưng **không cần dán JSON** — dùng script 1 lệnh:

```bash
scripts/use-store-type.sh v2          # v1=One Product · v2=Multi Style · v3=Multi Product
scripts/use-store-type.sh v2 --push   # kèm push lên theme luôn
```
Script tự set `templates/index.json` = layout đúng loại + nhắc bước còn lại. Chạy không tham số
để xem loại hiện tại. Đây là **quyết định 1 lần khi tạo store**; user cuối không đụng tới.

Các cách thay thế (nếu không dùng terminal):
- **Theme Editor (thuần click):** Customize → Home → thêm/xoá/kéo section (mọi section có preset).
- **Admin Edit code:** Online Store → Themes → ⋯ → Edit code → `templates/index.json` → dán nội
  dung `templates/index.<loại>.json`.

→ Sau khi chọn xong (1 lần), **mọi thứ còn lại là settings/menu/media** (Bước 3–8) — 100% click.

---

## Bước 2 — Import / tạo Product & Collection

- Tạo hoặc import product (CSV / Matrixify / app). **Không hard-code trong theme.**
- V2/V3: tạo Collections theo style/category (vd Lion / Kitty / Bunny hoặc Toys / Beds…).
- Điền ảnh, giá, variant, compare-at price (để hiện % giảm giá).

---

## Bước 3 — Gắn Product / Collection vào section

Trong Theme Editor, mở từng section và chọn nguồn dữ liệu:

| Section | Cần chọn |
|---|---|
| Best Sellers (`featured-collection`) | 1 collection |
| Shop by Style / Category (`collection-list`) | các collection cho từng ô |
| Pricing tiers (V1) | product cho mỗi tier + số lượng |
| Bought together (V3) | các product mua kèm |
| Sticky Add to Cart | tự động theo product hiện tại |

---

## Bước 4 — Upload Image & Media

Đổi trong Theme Editor (không cần code):
- **Logo / Favicon**: Theme settings → Logo.
- **Hero image** (+ ảnh mobile riêng): section Hero.
- **Lifestyle / story image**: section Image with text.
- **Product images**: trong product (Admin).
- **CTA background**: section CTA banner.

> Mẹo mobile: Hero có ô "Image (mobile)" riêng — dùng ảnh khung dọc/nhẹ hơn cho mobile.

---

## Bước 5 — Color Scheme

Theme settings → **Colors**. Chỉnh 5 scheme theo vai trò:

| Scheme | Vai trò | Gợi ý |
|---|---|---|
| scheme-1 | Nền chính | Sáng (cream/white) |
| scheme-2 | Surface | Nhạt hơn nền một chút |
| scheme-3 | Primary/Brand | Màu đậm (nút, footer, CTA) |
| scheme-4 | Accent | Màu nhấn (badge, sale) |
| scheme-5 | Inverse/Dark | Text sáng trên nền tối |

Đổi màu ở đây → **toàn bộ store đổi theo** (highlight heading, icon, sao, badge, nút…).
Không cần vào từng section.

---

## Bước 6 — Font

Theme settings → **Typography**:
- **Heading font** (tiêu đề)
- **Body font** (nội dung)
- **Accent font** (eyebrow kiểu viết tay, vd "Made for Cats")
- Heading/Body scale, và **"Heading size trên mobile"** (Base theme) để chỉnh độ to heading mobile.

---

## Bước 7 — Branding (Base theme settings)

Theme settings → **Base theme**:
- `Heading size trên mobile` — thu nhỏ heading trên mobile.
- `Sticky Add to Cart trên mobile` — bật/tắt thanh mua cố định ở PDP.
- `Bề rộng nội dung text` / `Bo góc card` — tinh chỉnh hình khối chung.

Ngoài ra Dawn cho chỉnh: button radius, card/media radius, shadow, spacing, page width.

---

## Bước 8 — Kiểm tra & Publish

- **Bắt buộc test mobile** (375px/390px): hero, PDP (sticky ATC + gallery swipe), pricing,
  bảng so sánh (scroll ngang), reviews (carousel).
- Kiểm tra menu (Header), Announcement bar, Footer trong section groups.
- Preview → **Publish**.

---

## Global chrome — Header & Footer (giống nhau trên MỌI page)

Header và Footer là **section groups** (`header-group.json`, `footer-group.json`) được Dawn
render tự động trên **mọi trang** qua `{% sections 'header-group' %}` / `{% sections 'footer-group' %}`
trong `theme.liquid`. → Không cần cấu hình lại từng page; sửa 1 lần áp toàn site.

**Footer** — section tuỳ biến `custom-footer` (đẹp, brand-first), đặt trong `footer-group`:
- Cột **Brand**: logo (settings `logo`, fallback tên store) + tagline + description + social
  icons (từ Theme settings → Social media links).
- 3 cột menu (block `menu`) trỏ tới **navigation menu**: `footer-shop`, `footer-help`,
  `footer-company`. Đổi link = sửa menu trong **Online Store → Navigation** (KHÔNG sửa code).
  Thêm/bớt cột = thêm/xoá block `menu` trong Theme Editor.
- Newsletter "Join the Family" + Payment icons + Policy links: bật/tắt trong settings.
  (Payment icons hiện theo cổng thanh toán bật trong Admin; Policy links theo Store policies.)
- Màu: `scheme-5` (nâu đậm nhất) để tách khỏi CTA phía trên.

**Header:** menu chính = navigation menu `main-menu`. Sửa items trong Navigation.

**→ Tạo store mới, phần footer/header chỉ cần:**
1. Sửa 3–4 menu trong **Navigation** (main-menu, footer-shop, footer-help, footer-company).
2. Set **Logo** + **Social media links** trong Theme settings.
3. Xong — footer/header giống nhau trên mọi page, đúng brand, không đụng code.

> Các menu trên là **store data** (như product/collection), nằm ở Admin → Navigation — đúng
> nguyên tắc Shopify-native, tách khỏi theme code.

## Ghi chú

- **Reviews**: hiện dùng block nhập tay. Có thể thay bằng app (Judge.me/Loox) sau.
- **Metafields** (Phase 0 — làm sau): khi bật, nội dung như benefits/FAQ/size chart có thể
  gắn theo product data thay vì nhập trong section. Xem `docs/METAFIELDS.md` (sẽ bổ sung).
- **Không sửa file Dawn gốc**; mọi thành phần base theme có prefix `custom-`.
