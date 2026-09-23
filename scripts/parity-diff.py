#!/usr/bin/env python3
"""
parity-diff.py — Quantitative design-vs-actual comparator for the voya-parity loop.

Given a cropped DESIGN image and an ACTUAL section screenshot, it normalises them to a
common width, compares them pixel-by-pixel (ignoring masked regions — e.g. AI-generated
photos that can never match), and reports an objective MISMATCH % plus a height-ratio
sanity check. This turns "so bằng mắt" into a number a gate can enforce.

  match% high + mismatch% low  = layout/color/text/spacing are the same
  masked regions               = photo content that is allowed to differ (excluded)

Usage:
  python3 scripts/parity-diff.py --design .report-shots/ac/design-hero.png \
      --actual .report-shots/ac/actual-hero.png \
      [--mask docs/plan/mockups/hero.mask.json] \
      [--threshold 8] [--heatmap .report-shots/ac/diff-hero.png] [--json]

Mask file = JSON array of {x,y,w,h} in FRACTIONS (0..1) of the design crop, regions to IGNORE.
Exit code: 0 = pass (mismatch <= threshold and height ratio in [0.90,1.10]), 1 = fail, 2 = error.
"""
import argparse, json, sys
from PIL import Image

PER_PIXEL_TOL = 0.12        # per-pixel color distance (0..1) below which pixels count as "same"
HEIGHT_LO, HEIGHT_HI = 0.90, 1.10  # allowed actual/design height ratio after width-normalisation


def load_rgb(path):
    return Image.open(path).convert("RGB")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--design", required=True)
    ap.add_argument("--actual", required=True)
    ap.add_argument("--mask", default=None, help="JSON array of {x,y,w,h} fractions to ignore")
    ap.add_argument("--threshold", type=float, default=8.0, help="max mismatch %% to still pass")
    ap.add_argument("--heatmap", default=None, help="write a red diff-heatmap PNG here")
    ap.add_argument("--json", action="store_true", help="print machine-readable JSON only")
    a = ap.parse_args()

    try:
        d = load_rgb(a.design)
        act = load_rgb(a.actual)
    except Exception as e:
        print(json.dumps({"error": f"load: {e}"}))
        return 2

    W = d.width
    # height the actual would take at the design's width (before we force-fit) -> layout sanity
    act_h_at_w = act.height * (W / act.width)
    height_ratio = act_h_at_w / d.height if d.height else 0.0

    # Normalise both to the design's exact box so pixels line up 1:1.
    dn = d
    an = act.resize((W, d.height), Image.BILINEAR)
    H = d.height

    # Build ignore mask (True = compare this pixel, False = ignore).
    rects = []
    if a.mask:
        try:
            rects = json.load(open(a.mask))
        except Exception as e:
            print(json.dumps({"error": f"mask: {e}"}))
            return 2

    dp = dn.load()
    apx = an.load()
    heat = Image.new("RGB", (W, H)) if a.heatmap else None
    hp = heat.load() if heat else None

    def ignored(x, y):
        for r in rects:
            rx, ry, rw, rh = r.get("x", 0), r.get("y", 0), r.get("w", 0), r.get("h", 0)
            if rx * W <= x < (rx + rw) * W and ry * H <= y < (ry + rh) * H:
                return True
        return False

    considered = 0
    diff_pixels = 0
    sum_dist = 0.0
    INV = 1.0 / 441.6729559300637  # sqrt(3*255^2)
    step = 1  # every pixel; crops are small enough

    for y in range(0, H, step):
        for x in range(0, W, step):
            if rects and ignored(x, y):
                if hp:
                    hp[x, y] = (40, 40, 46)  # masked = dark grey
                continue
            r1, g1, b1 = dp[x, y]
            r2, g2, b2 = apx[x, y]
            dist = ((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2) ** 0.5 * INV
            considered += 1
            sum_dist += dist
            if dist > PER_PIXEL_TOL:
                diff_pixels += 1
                if hp:
                    inten = min(255, int(120 + dist * 255))
                    hp[x, y] = (inten, 30, 30)
            elif hp:
                g = (r1 + g1 + b1) // 3
                hp[x, y] = (g, g, g)

    if considered == 0:
        print(json.dumps({"error": "all pixels masked"}))
        return 2

    mismatch = 100.0 * diff_pixels / considered
    match = 100.0 - mismatch
    mean = sum_dist / considered
    height_ok = HEIGHT_LO <= height_ratio <= HEIGHT_HI
    passed = mismatch <= a.threshold and height_ok

    if heat:
        heat.save(a.heatmap)

    result = {
        "match_pct": round(match, 2),
        "mismatch_pct": round(mismatch, 2),
        "mean_dist": round(mean, 4),
        "height_ratio": round(height_ratio, 3),
        "height_ok": height_ok,
        "threshold": a.threshold,
        "considered_px": considered,
        "masked_rects": len(rects),
        "pass": passed,
        "heatmap": a.heatmap or None,
    }

    if a.json:
        print(json.dumps(result))
    else:
        mark = "✅ PASS" if passed else "❌ FAIL"
        print(f"{mark}  mismatch={mismatch:.2f}% (≤{a.threshold}%)  match={match:.2f}%  "
              f"mean={mean:.3f}  height_ratio={height_ratio:.3f}{'' if height_ok else ' ⚠OUT'}"
              f"  masked={len(rects)}")
        if a.heatmap:
            print(f"   heatmap → {a.heatmap}")
    return 0 if passed else 1


if __name__ == "__main__":
    sys.exit(main())
