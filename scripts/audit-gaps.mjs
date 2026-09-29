// 审计：逐条目列出 confidence、lifecycle 与标了未知的维度
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AXES = ['model_access','runtime','local_files','background','tools','context','permissions','fit'];
const MCP_AXES = ['transport','auth','scope'];
const PAT = /(未核验|未知|未声明|未逐条|本次未能|未能逐)/;

const only = process.argv.slice(2).length ? process.argv.slice(2) : ['ide','cli','mcp'];

console.log('\n（未知维度 = 该维度正文里仍有「未核验/未知/未声明」字样；已补齐 = 该维度内容完整）\n');

let tTotal = 0, tDone = 0, tUnknown = 0;
for (const t of only) {
  const dir = path.join(ROOT, 'tracks', t, 'products');
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const fm = raw.split('\n---\n')[0];
    const isMcp = /^track:\s*mcp/m.test(fm);
    const keys = isMcp ? [...AXES, ...MCP_AXES] : AXES;
    const ai = fm.indexOf('\naxes:');
    const mi = fm.indexOf('\nmcp:');
    const pi = fm.indexOf('\npitfalls:');
    const axesSeg = ai >= 0 ? fm.slice(ai, mi > ai ? mi : pi) : '';
    const mcpSeg = mi >= 0 ? fm.slice(mi, pi) : '';
    for (const k of keys) {
      tTotal++;
      const seg = (k === 'transport' || k === 'auth' || k === 'scope') ? mcpSeg : axesSeg;
      const i = seg.indexOf(`  ${k}:`);
      if (i < 0) continue;
      const after = seg.slice(i + `  ${k}:`.length);
      const m = after.match(/\n(?=  [a-z_]+:)|\n(?=\S)/);
      const body = m ? after.slice(0, m.index) : after;
      if (PAT.test(body)) tUnknown++; else tDone++;
    }
  }
}
const pct = tTotal ? Math.round(tDone / tTotal * 100) : 0;
console.log(`全赛道维度补齐率：${tDone}/${tTotal} = ${pct}%  （未核验 ${tUnknown}）`);
if (pct >= 60) console.log('  → 已过半，继续补齐可显著提升 confidence 分布');
if (pct >= 85) console.log('  → 接近完整，剩余多为实测才能补的项');
