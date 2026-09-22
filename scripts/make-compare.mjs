#!/usr/bin/env node
/*
 * make-compare.mjs — Generate a design-vs-actual overlay compare page for one section.
 *
 * Part of the "voya-parity" workflow. Given a cropped DESIGN image and an ACTUAL
 * section screenshot (both in the same folder), it writes a self-contained HTML with:
 *   - a drag slider that overlays design ↔ actual,
 *   - a stacked side-by-side view,
 *   - an empty AC checklist to fill in.
 * Publish it with the Artifact tool (root = that folder, files = the two images).
 *
 * Usage:
 *   node scripts/make-compare.mjs --dir .report-shots/ac \
 *     --design design-hero.png --actual actual-hero.png \
 *     --title "Hero" --out hero-compare.html
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const dir = val('--dir', '.report-shots/ac');
const design = val('--design', 'design.png');
const actual = val('--actual', 'actual.png');
const title = val('--title', 'Section');
const out = val('--out', 'compare.html');

const html = `<title>Voya ${title} Compare</title>
<style>
  :root{--green:#23452D;--ink:#171B18;--body:#454A46;--cream:#F7F5EF;--sage:#E7EEE5;--border:#DDE1DB;--ok:#2f7d4f;--gap:#b8503a;--warn:#c88a2a}
  body{margin:0;background:#eef1ec;color:var(--body);font:15px/1.55 Inter,-apple-system,sans-serif}
  .wrap{max-width:1160px;margin:0 auto;padding:22px 18px 60px}
  h1{font:800 26px/1.2 Manrope,sans-serif;color:var(--ink);margin:0 0 4px}
  h2{font:800 18px/1.2 Manrope,sans-serif;color:var(--ink);margin:26px 0 10px}
  .lbl{font:700 12px/1 Manrope,sans-serif;text-transform:uppercase;letter-spacing:.4px;padding:6px 10px;border-radius:8px;display:inline-block;margin-bottom:6px}
  .lbl.d{background:var(--cream);color:#8a6d3b}.lbl.a{background:var(--sage);color:var(--green)}
  .stack img{width:100%;display:block;border:1px solid var(--border);border-radius:10px}
  .slider{position:relative;width:100%;border:1px solid var(--border);border-radius:10px;overflow:hidden;user-select:none;touch-action:none}
  .slider img{display:block;width:100%}
  .slider .top{position:absolute;inset:0;overflow:hidden;width:50%}
  .slider .top img{position:absolute;top:0;left:0;height:100%;width:auto;max-width:none}
  .slider .handle{position:absolute;top:0;bottom:0;left:50%;width:2px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.25);cursor:ew-resize}
  .slider .handle::after{content:"\\25C4 \\25BA";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;color:var(--green);font-size:11px;font-weight:800;padding:4px 8px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.2)}
  table{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--border);border-radius:10px;overflow:hidden;font-size:13.5px;margin-top:8px}
  th,td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--border);vertical-align:top}
  th{background:var(--cream);font-weight:700;font-size:12px;text-transform:uppercase}
  tr:last-child td{border-bottom:0}
  .st{font-weight:700}.st.ok{color:var(--ok)}.st.gap{color:var(--gap)}.st.warn{color:var(--warn)}
</style>
<div class="wrap">
  <h1>${title} — Design vs Thực tế</h1>
  <div class="slider" id="sl">
    <img src="${actual}" alt="actual" id="base">
    <div class="top" id="top"><img src="${design}" alt="design" id="over"></div>
    <div class="handle" id="hd"></div>
  </div>
  <p style="font-size:12px"><span class="lbl d">\\u25C4 Design</span> <span class="lbl a">Th\\u1ef1c t\\u1ebf \\u25BA</span></p>
  <h2>Xem riêng</h2>
  <div class="stack"><span class="lbl d">Design</span><img src="${design}"><span class="lbl a" style="margin-top:12px">Thực tế</span><img src="${actual}"></div>
  <h2>AC checklist</h2>
  <table>
    <tr><th style="width:30%">Tiêu chí</th><th style="width:10%">KQ</th><th>Ghi chú</th></tr>
    <tr><td>(điền AC section này)</td><td class="st ok">✅</td><td></td></tr>
  </table>
</div>
<script>
(function(){var sl=document.getElementById('sl'),top=document.getElementById('top'),hd=document.getElementById('hd'),over=document.getElementById('over'),base=document.getElementById('base');
function setW(){over.style.width=sl.clientWidth+'px';over.style.height=sl.clientHeight+'px';}
base.addEventListener('load',setW);addEventListener('resize',setW);setW();
function mv(x){var r=sl.getBoundingClientRect(),p=Math.max(0,Math.min(1,(x-r.left)/r.width));top.style.width=(p*100)+'%';hd.style.left=(p*100)+'%';}
var d=false;sl.addEventListener('pointerdown',e=>{d=true;mv(e.clientX);});addEventListener('pointermove',e=>{if(d)mv(e.clientX);});addEventListener('pointerup',()=>d=false);})();
</script>
`;

await fs.writeFile(path.join(dir, out), html, 'utf8');
console.log(`Wrote ${path.join(dir, out)} — publish with Artifact (root=${dir}, files={${design},${actual}}). Fill the AC checklist.`);
