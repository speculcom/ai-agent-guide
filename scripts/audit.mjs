// 内部一致性审计：_track 声明 vs 实际文件 / 标签池 / 链接
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 用法：node scripts/audit.mjs [--plan]
// 默认检查一致性；--plan 额外把「声明但缺文件」当正常（Phase 2 建设期）
const PLAN_MODE = process.argv.includes('--plan');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const R = (p) => path.join(ROOT, p);

console.log('=== 1. 赛道声明 vs 实际文件 ===');
for (const t of ['ide', 'cli', 'mcp']) {
  const txt = fs.readFileSync(R(`tracks/${t}/_track.md`), 'utf8');
  const ids = [...txt.matchAll(/^\| `([a-z0-9-]+)`/gm)].map((m) => m[1]);
  const dir = R(`tracks/${t}/products`);
  const have = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace('.md', ''))
    : [];
  const missing = ids.filter((i) => !have.includes(i));
  const extra = have.filter((h) => !ids.includes(h));
  console.log(`\n[${t}] 声明 ${ids.length} / 现有 ${have.length}`);
  console.log('  已建: ' + (have.join(', ') || '(无)'));
  if (missing.length) {
    const label = PLAN_MODE ? '⏳ 待建' : '❌ 声明但缺文件';
    console.log(`  ${label} (${missing.length}): ` + missing.join(', '));
  }
  if (extra.length) console.log('  ⚠️ 存在但未声明: ' + extra.join(', '));
  // 重复声明
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) console.log('  ❌ 声明重复: ' + [...new Set(dup)].join(', '));
}

console.log('\n=== 2. 标签池一致性 ===');
const schema = fs.readFileSync(R('SCHEMA.md'), 'utf8');
const secIdx = schema.indexOf('## 六、标签池');
const poolSection = secIdx >= 0 ? schema.slice(secIdx, schema.indexOf('## 七、', secIdx)) : '';
const pools = {};
let cur = null;
for (const l of poolSection.split('\n')) {
  const h = l.match(/^###\s*(.+)$/);
  if (h) { cur = h[1]; pools[cur] = []; continue; }
  // 池内容行：形如 "编程 · 办公 · 研究"
  if (cur && l.trim() && l.includes('·') && !l.trim().startsWith('#') && !l.includes('|')) {
    pools[cur].push(...l.trim().split('·').map((s) => s.trim()).filter(Boolean));
  }
}
const allPoolTags = new Set(Object.values(pools).flat());
console.log('  池: ' + (Object.keys(pools).join(' / ') || '(未解析到)'));
console.log('  池内标签数: ' + allPoolTags.size);
if (allPoolTags.size === 0) {
  console.log('  ⚠️ 标签池解析失败，检查 SCHEMA.md 第六节格式');
}

const tagIssues = [];
for (const t of ['ide', 'cli', 'mcp']) {
  const dir = R(`tracks/${t}/products`);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    const txt = fs.readFileSync(path.join(dir, f), 'utf8');
    const m = /^tags:\s*\[(.*)\]$/m.exec(txt.split('\n---\n')[0] || txt);
    if (!m) continue;
    const tags = m[1].split(',').map((s) => s.trim()).filter(Boolean);
    const outside = tags.filter((x) => !allPoolTags.has(x));
    if (outside.length) tagIssues.push(`${t}/${f}: ${outside.join(', ')}`);
  }
}
if (tagIssues.length) {
  console.log('  ❌ 池外标签:');
  tagIssues.forEach((i) => console.log('     ' + i));
} else {
  console.log('  ✅ 所有条目标签都在池内');
}

console.log('\n=== 3. 赛道文件引用的 taxonomy 路径 ===');
const mcpTrack = fs.readFileSync(R('tracks/mcp/_track.md'), 'utf8');
for (const m of mcpTrack.matchAll(/\]\((\.\/[^)]+)\)/g)) {
  const tp = path.join(R('tracks/mcp'), m[1]);
  console.log(`  ${fs.existsSync(tp) ? 'OK  ' : 'MISS'} ${m[1]}`);
}

console.log('\n=== 4. SOURCES.md 域名清单 ===');
const src = fs.readFileSync(R('SOURCES.md'), 'utf8');
const doms = [...new Set([...src.matchAll(/https:\/\/([a-z0-9.-]+)\//g)].map((m) => m[1]))].sort();
console.log('  ' + doms.join('\n  '));

console.log('\n=== 5. 各条目 sources 域名 ===');
for (const t of ['ide', 'cli', 'mcp']) {
  const dir = R(`tracks/${t}/products`);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    const txt = fs.readFileSync(path.join(dir, f), 'utf8');
    const fm = (txt.split('\n---\n')[0] || txt);
    const us = [...fm.matchAll(/url:\s*(https:\/\/[^\s]+)/g)].map((m) => m[1]);
    const ds = [...new Set(us.map((u) => { try { return new URL(u).hostname; } catch { return '?'; } }))];
    console.log(`  [${t}/${f.replace('.md', '')}] ${ds.join(', ')}`);
  }
}
