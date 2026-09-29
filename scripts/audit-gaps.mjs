// 审计：逐条目列出 confidence、lifecycle 与标了未知的维度
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AXES = ['model_access','runtime','local_files','background','tools','context','permissions','fit'];
const MCP_AXES = ['transport','auth','scope'];
const PAT = /(未核验|未知|未声明|未逐条|本次未能|未能逐)/;

const only = process.argv.slice(2).length ? process.argv.slice(2) : ['ide','cli','mcp'];

for (const t of only) {
  const dir = path.join(ROOT, 'tracks', t, 'products');
  if (!fs.existsSync(dir)) continue;
  console.log(`\n=== ${t} ===`);
  const rows = [];
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.md')).sort()) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const fm = raw.split('\n---\n')[0];
    const conf = (/^confidence:\s*(\S+)/m.exec(fm) || [])[1] || '-';
    const life = (/^lifecycle:\s*(\S+)/m.exec(fm) || [])[1] || '-';

    // 抽出 axes 与 mcp 块
    const grab = (key) => {
      const i = fm.indexOf(`\n${key}:`);
      if (i < 0) return '';
      const rest = fm.slice(i + 1);
      const nxt = rest.slice(1).search(/\n[a-z_]+:/);
      return nxt < 0 ? rest.slice(1) : rest.slice(1, 1 + nxt);
    };
    const axesSeg = grab('axes');
    const mcpSeg = grab('mcp');

    const unknowns = [];
    const scan = (seg, keys) => {
      for (const k of keys) {
        const i = seg.indexOf(`  ${k}:`);
        if (i < 0) continue;
        const after = seg.slice(i + `  ${k}:`.length);
        const m = after.match(/\n(  [a-z_]+:|\n)/);
        const body = (m ? after.slice(0, m.index) : after);
        if (PAT.test(body)) unknowns.push(k);
      }
    };
    scan(axesSeg, AXES);
    scan(mcpSeg, MCP_AXES);

    // 正文里的未知项清单条数
    const body = raw.split('\n---\n')[1] || '';
    const sec = /##\s*未知项清单\s*\r?\n([\s\S]*?)(?=\r?\n##\s|$)/.exec(body);
    const unkList = sec ? (sec[1].match(/^\s*[-*]/gm) || []).length : 0;

    rows.push({ id: f.replace('.md',''), conf, life, unknowns, unkList });
  }
  rows.forEach(r => {
    const flag = r.conf === 'partial' ? '⚠' : ' ';
    console.log(`  ${flag} ${r.id.padEnd(16)} ${r.conf.padEnd(9)} ${r.life.padEnd(12)} 未知维度 ${String(r.unknowns.length).padStart(2)}  正文清单 ${String(r.unkList).padStart(2)}  ${r.unknowns.join(',')}`);
  });
}
