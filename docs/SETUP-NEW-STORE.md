# Tạo store mới từ Base Theme

Quy trình tạo một store mới **không cần sửa source code**. Ước tính 30–60 phút.

> Xem kiến trúc tổng thể ở [ARCHITECTURE.md](ARCHITECTURE.md). Base theme là Dawn 16 +
> các section `custom-*`, mobile-first.

---

## Bước 1 — Chọn loại template

Có 3 loại, khác nhau bởi **file JSON template** (không phải code):

| Loại | Homepage | Product page | Dùng khi |
|---|---|---|---|
| **V1 One Product** | `index.one-product` | `product.landing` | 1 sản phẩm chính / trending product |
| **V2 Multi Style** | `index.multi-style` | `product.multi-style` | 1 concept, nhiều màu/style/variant |
| **V3 Multi Product** | `index.multi-product` | `product.multi-product` | Nhiều sản phẩm cùng niche |

**Gán homepage:** Theme Editor → dropdown chọn template ở trên cùng → chọn 1 trong 3 `index.*`.
Hoặc đặt làm mặc định: copy nội dung file `templates/index.<loại>.json` vào `templates/index.json`.

**Gán product page:** Admin → Products → mở product → **Theme template** → chọn `landing` /
`multi-style` / `multi-product`. Mỗi product có thể dùng layout khác nhau.

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

## Ghi chú

- **Reviews**: hiện dùng block nhập tay. Có thể thay bằng app (Judge.me/Loox) sau.
- **Metafields** (Phase 0 — làm sau): khi bật, nội dung như benefits/FAQ/size chart có thể
  gắn theo product data thay vì nhập trong section. Xem `docs/METAFIELDS.md` (sẽ bổ sung).
- **Không sửa file Dawn gốc**; mọi thành phần base theme có prefix `custom-`.
