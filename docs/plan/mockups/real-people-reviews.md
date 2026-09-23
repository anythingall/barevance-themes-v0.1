# Mockup Blueprint — "Real People. Real Comfort." + Reviews (home)

- **Design source:** `docs/design/home.png` · region ≈ y 1180–1400 · crops: `/tmp/rev-left.png`, `/tmp/rev-card.png`
- **Page position:** home, directly after **Best Sellers**, before **Shoe Finder** ("Not Sure Which Voya…").
- **Base file:** extend `sections/custom-reviews.liquid` with a new `layout: split` option.

> ⚠️ **Structural change vs current build.** Today `index.json.love` renders a *centered*
> "REAL COMFORT / What Customers Love About Voya" heading with 3 plain cards. The design has
> **no centered heading** — it's a two-column split (photo-CTA left, review cards right). This
> blueprint replaces that layout.

## 2. Layout
- **Full-width section, two equal columns (50 / 50) on desktop.** Mobile: stack (photo block, then cards as 1-col or horizontal scroll).
- **Left column:** full-bleed lifestyle photo + dark scrim; content overlaid, left-aligned, vertically centered.
- **Right column:** light grey panel holding a **header row** (heading left + ← → arrows right) and a **review-card SLIDER** — 3 cards visible, 6 total, arrows scroll it.

> ⚠️ **Blueprint miss corrected 2026-09-23:** the first crop sat below the panel's header row, so it
> missed the **"What Customers Love About Voya" heading + ← → slider arrows**. Lesson (now in the
> template): crop the WHOLE section incl. its header band, and treat any arrows as a working slider.
> Also fixed a grid bug: the overflow slider needs `min-width:0` on grid child + track or it blows out the 50/50.

## 3. Element inventory
### Left column (photo-overlay CTA)
| Element | Content | Font | Weight | Color | Notes |
|---|---|---|---|---|---|
| Background | lifestyle photo (person outdoors tying barefoot shoe) | – | – | – | full-bleed, `object-fit:cover`; dark scrim left for legibility |
| Heading | "Real People.\nReal Comfort." | Manrope ExtraBold | 800 | white `#FFFFFF` | 2 lines |
| Subtext | "See how Voya fits into everyday life." | Inter | 400 | white ~90% | |
| Button | "Watch Customer Stories" | Inter | 600 | dark text on **white pill** | radius 40 (pill) |
| Play icon | ▶ in white circle | – | – | white circle / dark glyph | sits to the RIGHT of the button |

### Right column — review card (×3)
| Element | Content | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|---|
| Card | – | – | – | – | bg white `#FFFFFF` | radius ~14px, subtle shadow, padding ~2rem |
| Quote | e.g. ""I feel like I'm walking barefoot."" | Manrope | ~1.7rem | 700 | `#171B18` | curly quotes, ~2 lines |
| Stars | ★★★★★ (5) | – | ~1.4rem | – | **gold `#D99124`** | left-aligned, below quote |
| Avatar | reviewer photo | – | – | – | – | circle ~4.4rem |
| Name | "Sarah K." | Inter | 1.4rem | 700 | `#171B18` | right of avatar |
| Role | "Verified Customer" | Inter | 1.2rem | 400 | fg ~55% grey | under name |

Cards: **Sarah K.** — "I feel like I'm walking barefoot." · **Michael T.** — "So much room for my toes." · **Emily R.** — "I can wear them all day without discomfort."

## 4. Easy-to-miss checklist
- Badge/rating: **5 gold stars per card**, no numeric value here.
- Layout: **split 50/50**, NOT a centered heading section. Right panel has its own grey bg.
- Button: white pill + **separate play-icon circle** beside it (not inside).
- Avatar is a **circle image**; name bold + role muted, stacked beside it.
- Card radius 14px + soft shadow (design shows elevation on white-on-grey).
- Left text is **overlaid on the photo**, left-aligned, vertically centered — not below it.

## 5. Data requirements
- **Images (image_url CDN):** 1 lifestyle photo (left) + 3 avatar photos.
- **Button link:** target for "Watch Customer Stories" (video URL / page / `#`). Play icon decorative.
- **Review blocks:** 3 × {quote, name, role="Verified Customer", avatar image_url, rating=5}.
- **Section settings:** `layout:"split"`; left {image_url, heading, subheading, button_label, button_link}; color scheme for right panel = light (Mist).
- Remove the current centered eyebrow/heading for this instance.

## 6. Acceptance criteria (DOM-verifiable) — all ✅ (self-diff 2026-09-23)
- [x] Section full width; two columns 600/600px on ≥990px; stacks on mobile.
- [x] Left heading/subtext/button white + overlaid, left-aligned; heading breaks "Real People." / "Real Comfort." (text-wrap:balance).
- [x] Button = white pill (radius 999px, dark text); circular white play icon to its right.
- [x] Right panel bg = light neutral `rgba(fg,0.045)`; exactly 3 white cards, radius 14px, shadow.
- [x] Each card: curly-quoted quote (dark bold) → 5 gold stars → avatar circle + name (bold) + "Verified Customer".
- [x] Star color computes to gold `rgb(217,145,36)`.

## 7. Self-diff gate
`browser_evaluate`: assert column count/widths (getBoundingClientRect ~50/50), left text color=white + text-align left, `.vy-…__play` present right of button, right panel bg (getComputedStyle) = Mist, card count=3, card radius, star color, and each card's quote/name/role text.

## 8. Sign-off
- [x] **Blueprint approved by user**: 2026-09-23
- [x] Built + self-diff all-green: 2026-09-23
- [ ] User signed off on rendered result: __

## Open questions for user
1. **"Watch Customer Stories"** — link to a video (YouTube/Vimeo URL), a page, or leave as `#` placeholder for now?
2. **Avatars** — OK to use similar free stock headshots (as with product photos)?
