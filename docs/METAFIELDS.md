# Phase 0 — Metafields & Metaobjects (Base Theme)

Định nghĩa data model để nội dung marketing gắn theo **product data** (Shopify-native),
không hard-code trong theme. Áp dụng trên store **hieu1-1**.

> Trạng thái: spec sẵn sàng. Chạy sau khi connector Shopify reconnect về store `hieu1-1`.

---

## 1. Product metafields (namespace `custom`)

| Key | Type | Dùng cho section |
|---|---|---|
| `subtitle` | `single_line_text_field` | Dòng phụ dưới tên SP (PDP, hero) |
| `badge_text` | `single_line_text_field` | Badge "BEST SELLER" |
| `size_chart` | `json` | Bảng size (custom-size-guide / how-it-works) |
| `usp` | `list.single_line_text_field` | Danh sách USP ngắn dưới giá |
| `faq` | `list.metaobject_reference` (→ `faq_item`) | custom-faq theo product |
| `reviews` | `list.metaobject_reference` (→ `review`) | custom-reviews theo product |
| `benefits` | `list.metaobject_reference` (→ `feature`) | custom-icon-benefits theo product |

## 2. Metaobject definitions

### `feature` (icon benefit)
| Field | Type |
|---|---|
| `icon` | single_line_text_field (tên icon: leaf/heart/...) |
| `title` | single_line_text_field |
| `text` | multi_line_text_field |

### `faq_item`
| Field | Type |
|---|---|
| `question` | single_line_text_field |
| `answer` | multi_line_text_field |

### `review`
| Field | Type |
|---|---|
| `author` | single_line_text_field |
| `rating` | number_decimal (0–5) |
| `text` | multi_line_text_field |
| `avatar` | file_reference (image) |
| `badge` | single_line_text_field ("Verified Buyer") |

---

## 3. GraphQL — tạo definitions

Metafield definition (lặp cho từng key). Ví dụ `subtitle`:

```graphql
mutation CreateDef($def: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $def) {
    createdDefinition { id name key namespace }
    userErrors { field message code }
  }
}
```
Variables:
```json
{ "def": { "name": "Subtitle", "namespace": "custom", "key": "subtitle",
  "type": "single_line_text_field", "ownerType": "PRODUCT" } }
```

Metaobject definition (ví dụ `feature`):
```graphql
mutation CreateMetaobjectDef($definition: MetaobjectDefinitionCreateInput!) {
  metaobjectDefinitionCreate(definition: $definition) {
    metaobjectDefinition { id type }
    userErrors { field message code }
  }
}
```

---

## 4. Test data (store hieu1-1)

Tạo dữ liệu thật để test pricing tiers / FBT / PDP / grids:

**Products** (theme mẫu ManeTote — cat totes):
1. **Lion Mane Cat Tote** — variants Size S/M, price 34.95, compare 43.69, tags `best-seller`.
2. **Kitty Peekaboo Tote** — 32.95 / 41.19.
3. **Bunny Ears Cat Tote** — 32.95 / 41.19.
4. **Black Cat Everyday Tote** — 29.95 / 37.39.

**Collections:** `Best Sellers` (manual, 4 sản phẩm trên), `Cat Totes`.

**Metafield values** (product 1 Lion Mane):
- `subtitle`: "The cutest way to take your cat everywhere."
- `badge_text`: "BEST SELLER"
- `usp`: ["Peekaboo window","Breathable mesh","Secure zipper","Lightweight"]

**Wiring sau khi có product/collection:**
- `index.one-product` → pricing tiers gắn product 1 (qty 1/2/3).
- `index.multi-style` / `multi-product` → best-sellers collection = "Best Sellers"; shop-by-style/category = collections.
- Product `Lion Mane` → Theme template `landing`.

> Ảnh product cần URL HTTPS public (MCP không upload file local). Có thể bổ sung ảnh sau
> trong Admin, hoặc dùng ảnh generate rồi host.

---

## 5. Bước wiring section → metafield (giai đoạn 2 của Phase 0)

Sau khi definitions + data sẵn sàng, cập nhật section để đọc metafield khi ở product context:
- `custom-icon-benefits`: nếu `product.metafields.custom.benefits` có giá trị → render từ metaobject
  thay cho blocks.
- `custom-faq`: tương tự với `product.metafields.custom.faq`.
- `custom-reviews`: đọc `product.metafields.custom.reviews`.
- `main-product`: thêm block hiển thị `custom.subtitle`, `custom.usp`.

Giữ fallback về blocks/settings khi metafield trống → base theme vẫn dùng được không cần metafield.
