#!/usr/bin/env node
/*
 * parity-gate.mjs — enforce the voya-parity loop. Turns the skill's rules into a hard gate.
 *
 * A section is GREEN only when ALL of these hold:
 *   1. Blueprint exists (docs/plan/mockups/<blueprint>) AND is user-signed
 *      (a checked "- [x] **Blueprint approved by user").
 *   2. Compare artifacts exist: <shots>/design-<key>.png and <shots>/actual-<key>.png.
 *   3. Quantitative pixel-diff (scripts/parity-diff.py) mismatch% <= threshold, height ok.
 *   4. (--check-theme) `shopify theme check` reports 0 errors.
 *
 * Registry + statuses live in docs/plan/parity-sections.json.
 *   status "done"  -> ENFORCED (gate must pass; blocks the commit otherwise)
 *   status "wip"   -> WARN only (free to iterate)
 *   status "todo"  -> skipped
 *
 * Modes:
 *   node scripts/parity-gate.mjs --status            # print the board, exit 0
 *   node scripts/parity-gate.mjs --section hero      # full gate for one section
 *   node scripts/parity-gate.mjs --all               # gate every non-todo section
 *   node scripts/parity-gate.mjs --staged            # git pre-commit: enforce touched 'done' sections
 *   node scripts/parity-gate.mjs --section hero --check-theme
 *
 * Bypass (emergency only): PARITY_SKIP=1 git commit ...
 */
import { promises as fs } from 'node:fs';
import { execSync, execFileSync } from 'node:child_process';
import path from 'node:path';

const ROOT = process.cwd();
const REG = 'docs/plan/parity-sections.json';
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 && args[i + 1] ? args[i + 1] : d; };

const C = { g: '\x1b[32m', r: '\x1b[31m', y: '\x1b[33m', dim: '\x1b[2m', b: '\x1b[1m', x: '\x1b[0m' };
const exists = async (p) => !!(await fs.stat(p).catch(() => null));

async function loadReg() {
  const raw = await fs.readFile(REG, 'utf8').catch(() => null);
  if (!raw) { console.error(`${C.r}parity-gate: missing ${REG}${C.x}`); process.exit(2); }
  const reg = JSON.parse(raw);
  const rows = [];
  for (const [page, pd] of Object.entries(reg.pages || {})) {
    for (const s of pd.sections || []) rows.push({ ...s, page, threshold: s.threshold ?? reg.defaultThreshold ?? 8 });
  }
  return { reg, rows };
}

function stagedFiles() {
  try {
    return execSync('git diff --cached --name-only', { encoding: 'utf8' }).split('\n').map((s) => s.trim()).filter(Boolean);
  } catch { return []; }
}

async function blueprintSigned(mockDir, bp) {
  if (!bp) return { ok: false, why: 'no blueprint listed' };
  const p = path.join(mockDir, bp);
  if (!(await exists(p))) return { ok: false, why: `blueprint missing (${bp})` };
  const txt = await fs.readFile(p, 'utf8');
  const signed = /- \[[xX]\]\s*\*\*Blueprint approved by user/.test(txt);
  const hasTemplatePlaceholder = /<Section name>|\(điền AC section này\)|\| … \|/.test(txt);
  if (!signed) return { ok: false, why: 'blueprint NOT signed (§8 checkbox)' };
  if (hasTemplatePlaceholder) return { ok: false, why: 'blueprint still has template placeholders' };
  return { ok: true, why: 'signed' };
}

async function runDiff(shots, mockDir, s) {
  const design = path.join(shots, `design-${s.key}.png`);
  const actual = path.join(shots, `actual-${s.key}.png`);
  if (!(await exists(design))) return { ok: false, why: `missing design-${s.key}.png` };
  if (!(await exists(actual))) return { ok: false, why: `missing actual-${s.key}.png` };
  const maskPath = path.join(mockDir, `${s.key}.mask.json`);
  const maskArg = (await exists(maskPath)) ? ['--mask', maskPath] : [];
  const heat = path.join(shots, `diff-${s.key}.png`);
  try {
    const out = execFileSync('python3', [
      'scripts/parity-diff.py', '--design', design, '--actual', actual,
      '--threshold', String(s.threshold), '--heatmap', heat, '--json', ...maskArg,
    ], { encoding: 'utf8' });
    const r = JSON.parse(out.trim().split('\n').pop());
    if (r.error) return { ok: false, why: `diff error: ${r.error}` };
    return {
      ok: r.pass,
      why: `mismatch ${r.mismatch_pct}% (≤${r.threshold}%)${r.height_ok ? '' : ` height⚠${r.height_ratio}`}${r.masked_rects ? `, masked ${r.masked_rects}` : ''}`,
      r,
    };
  } catch (e) {
    return { ok: false, why: `diff failed: ${(e.stderr || e.message || '').toString().slice(0, 120)}` };
  }
}

async function gateSection(reg, s, { enforce, checkTheme }) {
  const shots = reg.shots || '.report-shots/ac';
  const mockDir = reg.mockups || 'docs/plan/mockups';
  const checks = [];
  const bp = await blueprintSigned(mockDir, s.blueprint);
  checks.push({ name: 'blueprint', ...bp });
  const diff = await runDiff(shots, mockDir, s);
  checks.push({ name: 'pixel-diff', ok: diff.ok, why: diff.why });
  const failed = checks.filter((c) => !c.ok);
  return { section: s, checks, ok: failed.length === 0, enforce, diff: diff.r };
}

async function checkTheme() {
  try {
    const out = execSync('shopify theme check 2>&1 || true', { encoding: 'utf8' });
    const m = out.match(/(\d+)\s+error/i);
    const errs = m ? parseInt(m[1], 10) : (/0 errors|no offenses|checked/i.test(out) ? 0 : null);
    return { ok: errs === 0, why: errs === null ? 'could not parse theme-check output' : `${errs} errors` };
  } catch (e) { return { ok: false, why: 'theme check failed to run' }; }
}

function icon(st) { return st === 'done' ? '🔒' : st === 'wip' ? '🚧' : '·'; }

async function main() {
  const { reg, rows } = await loadReg();

  if (has('--status') || args.length === 0) {
    console.log(`${C.b}Voya parity board${C.x}  ${C.dim}(🔒 done=enforced · 🚧 wip=warn · · todo)${C.x}`);
    for (const s of rows) console.log(`  ${icon(s.status)} ${s.page}/${s.key.padEnd(10)} ${C.dim}${s.name}${C.x}`);
    console.log(`\nRun a gate:  ${C.b}node scripts/parity-gate.mjs --section <key>${C.x}`);
    return 0;
  }

  let targets, enforceMap = new Map();
  if (has('--staged')) {
    const staged = new Set(stagedFiles());
    targets = rows.filter((s) => staged.has(s.file) || staged.has(`sections/${path.basename(s.file)}`));
    // enforce only 'done' sections; warn for wip
    targets.forEach((s) => enforceMap.set(s.key, s.status === 'done'));
    targets = targets.filter((s) => s.status !== 'todo');
    if (targets.length === 0) { console.log(`${C.dim}parity-gate: no tracked section files staged — nothing to gate${C.x}`); return 0; }
  } else if (has('--section')) {
    const k = val('--section', '');
    targets = rows.filter((s) => s.key === k);
    if (!targets.length) { console.error(`${C.r}unknown section '${k}'${C.x}`); return 2; }
    targets.forEach((s) => enforceMap.set(s.key, true));
  } else if (has('--all')) {
    targets = rows.filter((s) => s.status !== 'todo');
    targets.forEach((s) => enforceMap.set(s.key, s.status === 'done'));
  } else {
    console.error('usage: --status | --section <key> | --all | --staged  [--check-theme]');
    return 2;
  }

  let hardFail = 0, softFail = 0;
  for (const s of targets) {
    const enforce = enforceMap.get(s.key);
    const res = await gateSection(reg, s, { enforce });
    const head = res.ok ? `${C.g}✅` : (enforce ? `${C.r}❌` : `${C.y}⚠`);
    console.log(`${head} ${s.page}/${s.key}${C.x} ${C.dim}(${enforce ? 'enforced' : 'warn'})${C.x}`);
    for (const c of res.checks) console.log(`    ${c.ok ? C.g + '✓' : C.r + '✗'} ${c.name}${C.x} — ${c.why}`);
    if (!res.ok) { if (enforce) hardFail++; else softFail++; }
  }

  if (has('--check-theme')) {
    const t = await checkTheme();
    console.log(`${t.ok ? C.g + '✅' : C.r + '❌'} theme-check${C.x} — ${t.why}`);
    if (!t.ok) hardFail++;
  }

  if (hardFail) {
    console.error(`\n${C.r}${C.b}parity-gate: ${hardFail} enforced section(s) failed.${C.x} Fix, or mark status "wip" while iterating. Emergency bypass: ${C.b}PARITY_SKIP=1 git commit${C.x}`);
    return 1;
  }
  if (softFail) console.log(`\n${C.y}parity-gate: ${softFail} wip section(s) not yet passing (warn only).${C.x}`);
  else console.log(`\n${C.g}parity-gate: all checked sections green.${C.x}`);
  return 0;
}

main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(2); });
