# Mockup Blueprint — Hero Banner (`custom-hero`, overlay)

> Fill this **before writing any code**. Get user sign-off, THEN build.
> This cycle's driver: the desktop H1 collapses to 4–5 one-word lines because the overlay
> content box (`max-width:72rem`) has the page-gutter `padding-left` (~400px on wide screens)
> subtracted from inside it, leaving ~290px of text width. Target = the design's 2-line H1.

- **Design source:** `docs/design/home.png` · region crop: `.report-shots/ac/design-hero.png`
- **Page / position:** home, first section (butts against header, no top gap)
- **Section type / base file:** `sections/custom-hero.liquid` (media_style = `overlay`)

## 1. Crops captured
- [x] Whole-section crop — `.report-shots/ac/design-hero.png` (723×348)
- [x] Detail read: eyebrow, H1 wrap, buttons, feature icons, script accent
- [x] Colors sampled (PIL) — see §3

## 2. Layout
- **Container:** full-bleed background photo; text overlaid on a left cream scrim that fades L→R (`linear-gradient(90deg …0.94 → 0)`).
- **Columns (desktop ≥990px):** single left content column over the photo; content **left edge aligns to the page gutter** (same x as header logo + trust-bar first icon). Right ~40% stays clear photo.
- **Tablet/mobile:** photo becomes top/background, content stacks below/over; features wrap.
- **Gap above section:** 0 (hero sits flush under the sticky header).
- **Element order (top→bottom, left column):** eyebrow → H1 → subheading → buttons row → features row. **Right, vertically centered:** handwritten script accent.

## 3. Element inventory
| Element | Text / content | Font | Size (desktop) | Weight | Case / tracking | Color (sampled) | Align | Position / inset | Icon | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Eyebrow | NATURAL MOVEMENT. A HAPPIER YOU. | Inter | ~13px | 700 | UPPER, +tracking | #171B18 | left | above H1 | – | **1 line** in design |
| H1 | Give Your Feet Room to Move. | Manrope ExtraBold | ~66px @≥1440 (`clamp(3.4rem,3.2vw+2.4rem,6.6rem)`) | 800 | Title | #171B18 (stroke #161614) | left | – | – | **exactly 2 lines**: "Give Your Feet" / "Room to Move." |
| Subheading | Comfortable, stylish barefoot shoes designed for everyday life. More freedom for your feet. A healthier you. | Inter | ~16px | 400 | – | ~#454A46 (0.85 on cream) | left | max-width ~52rem | – | 3 lines |
| Button 1 | Shop Best Sellers → | Inter | ~15px | 600 | – | text cream on #23452D fill | left | pill | arrow → | solid pill |
| Button 2 | Why Barefoot? | Inter | ~15px | 600 | – | dark text, transparent fill, dark border | left | pill | none | outline pill |
| Feature ×4 | Wide Toe Box · Lightweight Design · Flexible Sole · All-Day Comfort | Inter | ~12px | 600 | – | #171B18 | center under icon | 4 in one row | line-art icons (foot, leaf, wave, heart) | label wraps to 2 lines, max ~8.5rem |
| Script accent | Move Naturally. Live Fully. | script/italic | ~28–34px | — | italic | dark #1E241A (~#171B18) | **right** | right side, vert-center | underline swoosh under "Live Fully." | 3 lines |

> Sampled: heading stroke `#161614`≈token Heading `#171B18`; pill fill `#23452D` family; script accent `#1E241A` (dark, not the green). Colors already match tokens — this cycle is **layout**, not color.

## 4. "Easy-to-miss" checklist
- **Badge / Rating / Price:** none in hero.
- **Button:** 2 CTAs, pill. #1 solid green + arrow "→"; #2 outline, no arrow. On one row.
- **Swatches:** none.
- **Icons:** 4 thin line-art glyphs (hf-foot, hf-leaf, hf-wave, hf-heart) above 2-line labels; dark `currentColor`.
- **Script accent:** present, right side, italic, **right-aligned**, 3 lines, hand-drawn underline under "Live Fully." — must not overlap the H1/eyebrow at any width (it overlaps on mobile today — fix).
- **Section header band:** hero butts the header, no gap (`padding-block:0` via `:has()`).
- **Edge alignment:** content left edge = page gutter (aligns with header logo & trust-bar icons), **not** an arbitrary inset.
- **Line wrap (the defect):** eyebrow = 1 line; H1 = 2 lines. Today both over-wrap on wide desktop.

## 5. Data requirements
- Theme settings already in `templates/index.json` hero block: eyebrow, heading, subheading, media_style=`overlay`, media_caption="Move Naturally. Live Fully.", image_url (CDN), 2 button blocks, 4 feature blocks. **No new data** — CSS-only layout fix.
- No metafields / products needed.

## 6. Acceptance criteria (DOM-verifiable)
- [ ] AC-1 **H1 renders on exactly 2 lines** at 1440 and 1920 widths (`h1.getBoundingClientRect().height / lineHeight === 2`), reading "Give Your Feet" / "Room to Move.".
- [ ] AC-2 **Eyebrow renders on 1 line** at ≥1440 (height ≈ 1 line-height).
- [ ] AC-3 Content **text area width ≥ 480px** at 1920 (no collapse): `content.clientWidth − padLeft − padRight ≥ 480`.
- [ ] AC-4 Content **left edge aligns to page gutter**: `content` text-left x ≈ header logo left x (±4px).
- [ ] AC-5 Buttons on **one row** (both buttons' `getBoundingClientRect().top` equal ±2px).
- [ ] AC-6 Features: **4 items on one row**, each with an icon + label.
- [ ] AC-7 Script accent is right-of-content, **does not overlap** the content box (rects don't intersect) at 1440 and at 375 (mobile).
- [ ] AC-8 Heading color `getComputedStyle` = rgb(23,27,24) `#171B18`; pill button bg = `#23452D`.
- [ ] AC-9 No top gap: hero `getBoundingClientRect().top` ≈ header bottom (gap ≤ 1px).

## 7. Self-diff gate (run BEFORE showing the user)
Assert AC-1…AC-9 via `browser_evaluate` on the live render (measured). Record results. Present only when all pass, then overlay-compare (design crop over live) per §5 of the skill.

## 8. Sign-off
- [x] **Blueprint approved by user** (2026-09-26): user directed "implement a" (full parity loop)
- [x] Built + self-diff all-green (2026-09-26): measured on `theme dev` @1440/1920/375 —
  H1=2 lines, eyebrow=1 line, textArea=520px (≥480), heading `#171B18`/Manrope,
  buttons+4 features single row, caption hidden on mobile (no overlap), shown ≥990 (no overlap).
- [ ] User signed off on rendered result (date): __
