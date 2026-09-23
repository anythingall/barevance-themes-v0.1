# Voya Parity — enforced workflow (installed)

The `voya-parity` skill is now **enforced by a gate**, not just documented. This is the fix for
repeated rework: a section can't be silently "declared done while still wrong" anymore — the
gate measures the match with a number and blocks the commit if it's off.

## The pieces
| File | Role |
|---|---|
| `docs/plan/parity-sections.json` | Registry + per-section `status` + threshold. **Source of truth.** |
| `scripts/parity-diff.py` | Quantitative comparator: design crop vs actual render → **mismatch %** (ignores masked AI-gen photo regions) + height sanity. |
| `scripts/parity-gate.mjs` | Orchestrator: blueprint-signed? + compare artifacts? + pixel-diff ≤ threshold? + optional `theme check`. |
| `scripts/hooks/pre-commit` | Runs the gate on staged sections. Installed via `git config core.hooksPath scripts/hooks`. |

## Status model (in `parity-sections.json`)
- `todo` — not started. Gate skips it.
- `wip`  — building. Gate **warns** but lets you commit freely (iterate).
- `done` — locked. Gate **enforces**: blueprint signed + `design-<key>.png`/`actual-<key>.png` exist + mismatch ≤ threshold. Fails → **commit blocked**.

> You promote a section to `done` **only in the commit that makes its gate pass.** Any later
> edit to a `done` section must keep it passing, so parity can't silently regress.

## Per-section loop (unchanged from the skill, now gated)
1. **Blueprint** `docs/plan/mockups/<blueprint>.md` from `_TEMPLATE.md` — full element inventory + sampled colors + easy-to-miss checklist. **User signs §8** (`- [x] **Blueprint approved by user`).
2. Build in **base** → sync with `namespace-store.mjs`.
3. Crop the design region → `.report-shots/ac/design-<key>.png`. Element-screenshot the live render → `.report-shots/ac/actual-<key>.png` (both at the same width).
4. `node scripts/parity-gate.mjs --section <key>` → get the mismatch %. Fix until it passes.
5. Publish the compare (`make-compare.mjs` + Artifact), user signs off, flip `status` → `done`, commit (hook enforces).

## Masking AI-gen photos (the "except images" rule)
Layout/color/text/spacing must match; AI-gen photos can't. Exclude photo regions so they don't
count against the score: create `docs/plan/mockups/<key>.mask.json` — a JSON array of
`{x,y,w,h}` in **fractions (0..1)** of the design crop. The gate ignores those rects.

## Commands
```bash
node scripts/parity-gate.mjs --status            # the board
node scripts/parity-gate.mjs --section hero      # gate one section (prints mismatch %)
node scripts/parity-gate.mjs --all               # gate every non-todo section
node scripts/parity-gate.mjs --section hero --check-theme
PARITY_SKIP=1 git commit ...                     # emergency bypass only
```

## Tuning
Default pass threshold = **8% mismatch** (`defaultThreshold` in the registry; per-section override
via a `"threshold"` field). Tighten toward 4–5% once a section is clean. Per-pixel color tolerance
lives in `parity-diff.py` (`PER_PIXEL_TOL`).
