# Mockup Blueprint — Shoe Finder + Why Voya (merged side-by-side band)

- **Design:** `docs/design/home.png` region ≈ y1395–1560 · crop `/tmp/design-finder-row.png`
- **Decision (user):** MERGE the two into one side-by-side band; phone = similar stock image.
- **New base section:** `sections/custom-finder-why.liquid` (replaces stacked `shoe_finder` + `why_voya`).

## 2. Layout
- Full-width band; desktop two columns ~46% / ~54%. Mobile: stack (finder, then why).
- **Left (~46%, sage-green `--brand-surface`):** heading + subtext + dark-green pill button "Find My Voya →"; phone image framed on the right of this panel.
- **Right (~54%, white `--brand-bg`):** centered "Why Voya?" + 4 benefit columns.

## 3. Element inventory
### Left — finder (green)
| Element | Content | Font | Weight | Color |
|---|---|---|---|---|
| Heading | "Not Sure Which Voya Is Right for You?" | Manrope | 800 | `--brand-text` #171B18 |
| Subtext | "Take our 30-second shoe finder and get a personalized recommendation." | Inter | 400 | text ~70% |
| Button | "Find My Voya →" | Inter | 600 | white on `--brand-primary` #23452D, pill |
| Phone | similar stock app photo | – | – | framed rounded card |

### Right — why (white)
| Element | Content | Notes |
|---|---|---|
| Title | "Why Voya?" | Manrope ExtraBold, centered |
| Benefit ×4 | icon + title + text | line-art icon (`currentColor`), title bold, text muted |

Benefits (icon → title → text):
1. **hf_foot** — Foot-Shaped Design — "More room where you need it."
2. **hf_leaf** — Natural Movement — "Flexible construction designed for you."
3. **diamond** — Everyday Comfort — "Made for long days and real life."
4. **hf_heart** — Modern Style — "Barefoot function without sacrificing style."

## 4. Easy-to-miss checklist
- Two columns share ONE row (merge); green only under the left column.
- Button has a **→ arrow**, dark-green pill.
- Icons are **thin line-art** matching design (foot, leaf, gem, heart) — NOT the current leaf/check/heart/star.
- 4 benefits in a single row within the right half on desktop (2×2 tablet, 2-col/scroll mobile).
- min-width:0 on grid children (avoid the overflow blow-out learned in reviews).

## 5. Data requirements
- Phone image (image_url CDN): uploaded → `.../photo-1551650975-87deedd944c3.jpg`.
- Icons: need `icon-diamond.svg` (created); hf_foot/hf_leaf/hf_heart exist.
- Button link: finder page / collection (reuse existing `default_result_url` → /collections/best-sellers or a finder page).
- Section settings: color_scheme (text tokens), finder heading/text/button, why heading, 4 benefit blocks.
- index.json: replace `shoe_finder` + `why_voya` with one `finder_why`; update `order`.

## 6. AC (DOM-verifiable)
- [ ] One section; desktop 2 cols ~46/54; left bg = sage `--brand-surface`, right bg white.
- [ ] Left: heading/subtext/button(pill, → , green) + phone image framed on the right.
- [ ] Right: "Why Voya?" centered + 4 benefits (icon+title+text), line-art icons foot/leaf/gem/heart.
- [ ] Mobile: stacks; no horizontal overflow.

## 7. Sign-off
- [x] Structure approved by user (merge + image): 2026-09-23
- [x] Built + self-diff all-green: 2026-09-23 (46/54 split, sage/white, green pill+arrow, phone, 4 line-art icons, 2-line heading)
- [ ] User signed off on rendered result
