#!/usr/bin/env node
// ai-compare schema 校验器
// 用法：node scripts/validate.mjs [--strict]
// 任一硬失败即退出码 1。软规则失败只警告（--strict 时升级为失败）。

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');

const AXES = [
  'model_access', 'runtime', 'local_files', 'background',
  'tools', 'context', 'permissions', 'fit',
];
const AXES_FILE = {
  model_access: 'model-access', runtime: 'runtime',
  local_files: 'local-files', background: 'background',
  tools: 'tools', context: 'context',
  permissions: 'permissions', fit: 'fit',
};
const MCP_AXES = ['transport', 'auth', 'scope'];
const CONFIDENCE = ['verified', 'partial', 'stale'];
const LIFECYCLE = ['active', 'maintenance', 'archived', 'unknown'];
const PRICING_MODEL = ['freemium', 'paid', 'open-source', 'unknown'];

const errors = [];
const warnings = [];
const stats = { tracks: {}, files: 0 };

// ── YAML 子集解析器 ──────────────────────────────
// 支持：key: value / key:（嵌套 map 或数组）/ key: >- | | （折叠/字面量块）
/* 判断一个块是**数组**还是**嵌套 map**：看它的**第一行**，不看「有没有列表行」。
 *
 * ⚠ 这里原先写的是 `blockLines.some(l => l.trim().startsWith('- '))` —— 只要块里
 *   出现任何一行以 `- ` 开头就判成数组。于是 2026-10-09 改文风时踩到了：
 *   为了让读者好读，我在 `axes.model_access` 里把模型清单改成了 markdown 列表，
 *   结果**整个 `axes` 被当成数组**，8 个维度全部「缺失」。
 *
 *   两者其实有明确的判别特征：数组块的**第一行**就是 `- `；
 *   而嵌套 map 的第一行一定是 `key:`（列表只可能出现在某个子键的块标量内部）。
 *   按第一行判断，两种写法都能正确解析。 */
function isListBlock(blockLines) {
  const first = blockLines.find((l) => l.trim());
  return !!first && (first.trim().startsWith('- ') || first.trim() === '-');
}

function parseFrontmatter(text) {
  if (!text.startsWith('---\n')) return null;
  const end = text.indexOf('\n---\n', 4);
  if (end === -1) return null;
  const lines = text.slice(4, end).split('\n');
  const data = {};
  let i = 0;

  const indentOf = (s) => s.length - s.trimStart().length;
  const clean = (s) => {
    let v = s.trim();
    if (v === '>' || v === '>-' || v === '|' || v === '|-' || v === '>+' || v === '|+') return { block: true, fold: v[0] === '>' };
    return { block: false, fold: false, val: v === 'null' ? null : v.replace(/^["']|["']$/g, '') };
  };

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith('#')) { i++; continue; }
    if (indentOf(line) > 0) { i++; continue; } // 孤立缩进行，跳过

    const m = /^([A-Za-z_][A-Za-z0-9_]*):\s?(.*)$/.exec(line);
    if (!m) { i++; continue; }
    const key = m[1];
    const info = clean(m[2]);

    // 行内值
    if (!info.block && m[2].trim() !== '') {
      if (m[2].trim().startsWith('[')) {
        data[key] = m[2].trim().replace(/[[\]]/g, '').split(',')
          .map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      } else {
        data[key] = info.val;
      }
      i++;
      continue;
    }

    // 块：收集所有缩进行
    const blockLines = [];
    let j = i + 1;
    while (j < lines.length) {
      const l = lines[j];
      if (!l.trim()) { blockLines.push(''); j++; continue; }
      if (indentOf(l) === 0) break;
      blockLines.push(l);
      j++;
    }
    // 去掉尾部空行
    while (blockLines.length && !blockLines[blockLines.length - 1].trim()) blockLines.pop();

    if (info.block) {
      // 折叠/字面量标量：把所有行 trim 后拼接
      const body = info.fold
        ? blockLines.map(l => l.trim()).join(' ').trim()
        : blockLines.map(l => l.trim()).join('\n').trim();
      data[key] = body;
    } else if (isListBlock(blockLines)) {
      // 数组
      data[key] = blockLines
        .map(l => l.trim().replace(/^-\s*/, '').trim())
        .map(s => s.replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      // 嵌套 map（支持两级：pricing.model、axes.model_access、mcp.transport）
      const sub = {};
      for (const l of blockLines) {
        const sm = /^([A-Za-z_][A-Za-z0-9_]*):\s?(.*)$/.exec(l.trim());
        if (!sm) continue;
        const cinfo = clean(sm[2]);
        if (cinfo.block) {
          // 该子键也是块标量：向后收集更深缩进的行
          const parts = [];
          let k = blockLines.indexOf(l) + 1;
          while (k < blockLines.length) {
            const nl = blockLines[k];
            if (!nl.trim()) { parts.push(''); k++; continue; }
            if (indentOf(nl) <= indentOf(l)) break;
            parts.push(nl.trim()); k++;
          }
          /* ⚠ 折叠标量的解折叠方式必须与**渲染器一致**（2026-10-09 修）。
           *   旧写法是 `parts.filter(Boolean).join(' ')` —— 把空行过滤掉、段内换行折成空格，
           *   于是「一个意思一段」与「- 清单」两个信息在校验阶段就没了 ✗。
           *   后果：**校验器看的是压平后的文本，渲染器看的是保留分段的文本** ——
           *   两边对同一份内容的理解不一致（这正是 v6 第 ㉑ 节那个渲染层缺陷的同源残留）。
           *   现在与 `sites/build.mjs` 的 `parseFrontmatter` 保持一致：
           *   **空行保留为段落边界，段内换行也保留**。 */
          sub[sm[1]] = parts.join('\n');
        } else {
          sub[sm[1]] = cinfo.val;
        }
      }
      data[key] = sub;
    }
    i = j;
  }
  return data;
}

// ── 校验 ─────────────────────────────────────────
function collect(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap(f => {
    const p = path.join(dir, f);
    return fs.statSync(p).isDirectory() ? collect(p) : [p];
  });
}

function validateEntry(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const text = fs.readFileSync(file, 'utf8');
  const fm = parseFrontmatter(text);
  if (!fm) { errors.push(`${rel} · 缺少 frontmatter`); return null; }

  const fail = (m) => errors.push(`${rel} · ${m}`);
  const warn = (m) => warnings.push(`${rel} · ${m}`);

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.id || '')) fail(`id 格式非法: ${fm.id}`);
  const base = path.basename(file, '.md');
  if (fm.id !== base) fail(`文件名(${base}) != id(${fm.id})`);

  for (const k of ['id', 'track', 'name', 'vendor', 'homepage']) {
    if (!fm[k]) fail(`缺必填字段: ${k}`);
  }
  // cloud = 厂商云形态（2026-10-03 新增）：OpenAI Dot / Meta Muse / xAI Grok Bot 这类
  // 本机不装任何东西、在厂商云上持续工作的成品 agent。
  // 它归agents 分区（不是新分区）—— 与 ide/cli 共享同一套八维坐标系，
  // 拆到新分区会让「八维对比」跨站分裂。
  if (fm.track && !['ide', 'cli', 'cloud', 'mcp', 'harness'].includes(fm.track)) fail(`track 枚举非法: ${fm.track}`);

  const p = fm.pricing || {};
  if (!p.model) fail('缺 pricing.model');
  else if (!PRICING_MODEL.includes(p.model)) fail(`pricing.model 枚举非法: ${p.model}`);
  if (p.annual_usd === null && !p.annual_label) fail('annual_usd 为 null 时必须有 annual_label');

  const ax = fm.axes || {};
  for (const a of AXES) {
    const v = ax[a];
    if (v === undefined || v === null || v === '') fail(`缺维度: axes.${a}`);
    else if (String(v).length < 10) warn(`axes.${a} 过短(<10字)，可能没查清`);
  }

  if (fm.track === 'mcp') {
    const m = fm.mcp || {};
    for (const a of MCP_AXES) {
      const v = m[a];
      if (v === undefined || v === null || v === '') fail(`缺 MCP 维度: mcp.${a}`);
    }
  } else if (fm.mcp) {
    // 非 MCP 赛道的对象不是 server，不该有 mcp 字段
    fail(`track=${fm.track} 的条目不应有 mcp 字段（只有 track=mcp 的 server 才有）`);
  }

  if (fm.track === 'harness') {
    // harness 站的四条硬约束（v3 计划 §7.1）：
    //  1. family 必填且是四个分层之一 —— 它决定首页矩阵怎么分组
    //  2. provider 必填 —— 「支持哪些模型」是本站第一决策点
    //  3. sources 至少 1 条 official —— 竞品研究不可作数据来源（v3 §0.2）
    //  4. 必须有 decide_how —— 「要不要自己搭」是本站存在理由
    const FAMILIES = ['coding-base', 'general-harness', 'orchestration'];
    if (!fm.family) fail('harness 条目缺 family');
    else if (!FAMILIES.includes(fm.family)) {
      fail(`harness family 非法: ${fm.family}（允许 ${FAMILIES.join(' / ')}）`);
    }
    if (!fm.providers) fail('harness 条目缺 providers（支持哪些模型 provider 是第一决策点）');
    // sources 是 frontmatter 里的对象数组，YAML 子集解析器读不出嵌套结构
    // （build.mjs 也是用正则单独解析的），所以这里复用同样的方式。
    const rawText = fs.readFileSync(file, 'utf8');
    const srcBlock = /sources:\n([\s\S]*?)(?=\n[a-z_]+:)/.exec(rawText);
    const parsedSrc = [];
    if (srcBlock) {
      const sm = /-\s+label:\s*(.+)\n\s+url:\s*(.+)\n\s+kind:\s*(\S+)/g;
      let mm;
      while ((mm = sm.exec(srcBlock[1])) !== null) parsedSrc.push({ label: mm[1].trim(), url: mm[2].trim(), kind: mm[3].trim() });
    }
    if (!parsedSrc.some((s) => s.kind === 'repo' || s.kind === 'docs')) {
      fail('harness 条目 sources 至少 1 条 kind: repo 或 docs（官方源）');
    }
  }

  const pits = Array.isArray(fm.pitfalls) ? fm.pitfalls : [];
  if (pits.length === 0) fail('pitfalls 为空（至少 1 条）');

  const list = Array.isArray(fm.sources) ? fm.sources : [];
  if (list.length < 2) fail(`sources 不足 2 条（实际 ${list.length}）`);
  // changelog 或 repo(带 releases/commits 链接) 至少其一，后者视为等价变更记录
  const srcStr = JSON.stringify(list);
  const hasChangeLog = srcStr.includes('changelog');
  const hasRepo = srcStr.includes('repo');
  if (!hasChangeLog && !hasRepo) {
    fail('sources 缺少变更记录（需 kind: changelog，或 repo + releases/commits 链接）');
  }
  if (hasRepo && !hasChangeLog) {
    // 无独立 changelog 页时，必须补一条指向 releases / commits 的 changelog 记录
    const hasHistory = /releases|commits/i.test(srcStr);
    if (!hasHistory) {
      warn('用了 repo 作变更记录，建议补一条指向 releases 或 commits 的 changelog 条目');
    }
  }

  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  for (const k of ['last_verified', 'last_updated']) {
    if (!fm[k]) fail(`缺 ${k}`);
    else if (!dateRe.test(String(fm[k]))) fail(`${k} 格式非法: ${fm[k]}（需 YYYY-MM-DD）`);
  }

  if (!CONFIDENCE.includes(fm.confidence)) fail(`confidence 枚举非法: ${fm.confidence}`);
  if (!LIFECYCLE.includes(fm.lifecycle)) fail(`lifecycle 枚举非法: ${fm.lifecycle}（需 active/maintenance/archived/unknown）`);

  // lifecycle × confidence 组合约束
  if (fm.lifecycle === 'archived' && fm.confidence === 'verified') {
    fail('lifecycle=archived 时 confidence 不得为 verified（最高 partial）');
  }
  if (fm.lifecycle === 'unknown' && fm.confidence === 'verified') {
    fail('lifecycle=unknown 时 confidence 不得为 verified（最高 partial）');
  }

  if (fm.confidence === 'verified') {
    const all = AXES.map(a => String(ax[a] || '')).join(' ');
    if (all.includes('未知')) warn('confidence=verified 但维度里有「未知」');
    if (fm.last_verified && dateRe.test(String(fm.last_verified))) {
      const age = (Date.now() - new Date(fm.last_verified).getTime()) / 86400000;
      if (age > 90) warn(`核验日距今 ${Math.round(age)} 天，verified 应降级为 partial`);
    }
  }
  // 归档状态：仅当**条目自身**归档时降级 confidence。
  // 注意：正文提到「其他对象已归档」不应触发本规则——
  // 例如 git.md 正文会说明 github server 已归档，但 git 本身是 active。
  // 判定方式：看 lifecycle 字段，以及正文开头是否声明本对象归档。
  const head400 = text.slice(text.indexOf('\n---\n', 4) + 5, text.indexOf('\n---\n', 4) + 405);
  const selfArchived = fm.lifecycle === 'archived'
    || /^#{1,3}\s*.*(本 (server|对象|条目).*(已归档|已停止)|已归档\s*→)/m.test(head400)
    || /^(>|\s)*(已归档|Archived)\s*$/m.test(head400);
  if (selfArchived && fm.confidence === 'verified') {
    fail('本对象声明已归档，confidence 不得为 verified（最高 partial）');
  }

  if (fm.link && fm.link.kind === 'invitation' && !fm.link.incentive) {
    fail('link.kind=invitation 时必须有 incentive');
  }

  // 正文必备小节（见 SCHEMA 第三节）
  const bodyStart = text.indexOf('\n---\n', 4) + 5;
  const body = text.slice(bodyStart);
  // 正文里不得再用 --- 作分隔线（会与 frontmatter 结束标记混淆）
  if (/^\s*---\s*$/m.test(body)) {
    fail('正文里出现 `---` 分隔线，与 frontmatter 结束标记同形，会干扰解析（见 SCHEMA 第三节）');
  }
  for (const sec of ['一句话定位', '适合与不适合', '实测记录', '未知项清单', '相关条目']) {
    if (!new RegExp(`^##\\s+${sec}\\s*$`, 'm').test(body)) {
      fail(`正文缺必备小节: ## ${sec}`);
    }
  }
  // 「适合与不适合」不应是空壳
  const lines = body.split(/\r?\n/);
  const fitStart = lines.findIndex(l => /^##\s+适合与不适合\s*$/.test(l));
  if (fitStart >= 0) {
    let content = '';
    for (let i = fitStart + 1; i < lines.length; i++) {
      if (/^##\s+/.test(lines[i])) break;
      content += lines[i];
    }
    const c = content.replace(/\s+/g, '');
    if (c.length < 30) {
      warn(`正文「适合与不适合」内容过短(${c.length}字)，可能只是占位`);
    }
  }

  stats.tracks[fm.track] = (stats.tracks[fm.track] || 0) + 1;
  stats.files++;
  return fm;
}

function crossCheck(entries) {
  const byId = new Map();
  for (const [rel, fm] of entries) {
    if (!fm.id) continue;
    if (byId.has(fm.id)) errors.push(`id 重复: ${fm.id} (${byId.get(fm.id)} vs ${rel})`);
    else byId.set(fm.id, rel);
  }
  // 同名对象跨赛道：vendor + name 相同则 homepage 必须一致。
  // 注意：同一 vendor 下的**不同对象**（如 MCP servers 仓库里的多个 server）
  // 本来就该有不同 homepage，不做一致性要求。
  const byName = new Map();
  for (const [rel, fm] of entries) {
    if (!fm.vendor || !fm.name) continue;
    const key = `${fm.vendor}::${fm.name}`;
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key).push({ rel, fm });
  }
  for (const [key, list] of byName) {
    if (list.length < 2) continue;
    const homes = new Set(list.map(x => x.fm.homepage));
    if (homes.size > 1) {
      errors.push(`同名对象 ${key} 的 homepage 不一致：${[...homes].join(' / ')}`);
    }
  }
  // 同一底层仓库被多个条目引用属正常（如多个 MCP server 共用 servers 仓库），
  // 仅提示，不计入 strict 模式的失败条件。
  const repoRoots = new Map();
  for (const [, fm] of entries) {
    const m = /^https:\/\/github\.com\/([^/]+)\/([^/]+)/.exec(fm.homepage || '');
    if (!m) continue;
    const repo = `${m[1]}/${m[2]}`;
    if (!repoRoots.has(repo)) repoRoots.set(repo, []);
    repoRoots.get(repo).push(fm.id);
  }
  const INFO_ONLY = /被 \d+ 个条目引用/;
  for (const [repo, ids] of repoRoots) {
    if (ids.length > 1) {
      const msg = `仓库 ${repo} 被 ${ids.length} 个条目引用：${ids.join(', ')}`;
      if (INFO_ONLY.test(msg)) console.log(`  i ${msg}`);
      else warnings.push(msg);
    }
  }
}

// ── 主流程 ───────────────────────────────────────
const entries = [];
if (fs.existsSync(path.join(ROOT, 'tracks'))) {
  for (const f of collect(path.join(ROOT, 'tracks'))) {
    if (!/\.md$/.test(f)) continue;
    if (path.basename(f).startsWith('_')) continue;
    const norm = f.replace(/\\/g, '/');
    if (/\/tasks\//.test(norm) || /\/runs\//.test(norm) || /\/taxonomy\//.test(norm)) continue;
    const fm = validateEntry(f);
    if (fm) entries.push([path.relative(ROOT, f).replace(/\\/g, '/'), fm]);
  }
}
crossCheck(entries);

for (const req of ['README.md', 'METHODOLOGY.md', 'SCHEMA.md', 'CONTRIBUTING.md', 'SOURCES.md', 'LICENSE']) {
  if (!fs.existsSync(path.join(ROOT, req))) errors.push(`缺必需文档: ${req}`);
}
for (const a of AXES) {
  const f = `${AXES_FILE[a]}.md`;
  if (!fs.existsSync(path.join(ROOT, 'axes', f))) errors.push(`缺维度定义: axes/${f}`);
}
/* 分区目录 → 分区定义的映射。
 * 2026-10-02 重构：ide + cli 合并为 agents 分区（档案仍按 track: ide/cli 分类，
 * **不合并档案**——三组产品各有两份，runtime/permissions 等维度取值不同）。
 * 所以「分区目录」是三个（agents/harness/tools），而「track 形态枚举」是五个
 * （ide/cli/cloud/harness/mcp，见下方 154 行的枚举校验；cloud 是 2026-10-03 新增）。
 * 两级命名别混：**分区由目录决定，形态由 frontmatter 决定** —— SCHEMA §2.5.1。*/
const TRACK_DIRS = {
  agents: '_track.md',
  harness: '_track.md',
  tools: '_track.md',
};
for (const [d, f] of Object.entries(TRACK_DIRS)) {
  if (!fs.existsSync(path.join(ROOT, 'tracks', d, f))) errors.push(`缺赛道定义: tracks/${d}/${f}`);
}

console.log('=== ai-compare schema 校验 ===');
console.log(`条目数: ${stats.files}`);
console.log(`分赛道: ${JSON.stringify(stats.tracks)}`);
console.log(`错误: ${errors.length}  警告: ${warnings.length}`);
if (errors.length) {
  console.log('\n--- 错误 ---');
  errors.forEach(e => console.log('  ✗ ' + e));
}
if (warnings.length) {
  console.log('\n--- 警告 ---');
  warnings.slice(0, 40).forEach(w => console.log('  ! ' + w));
  if (warnings.length > 40) console.log(`  ... 还有 ${warnings.length - 40} 条`);
}
const hardFail = errors.length > 0;
const softFail = STRICT && warnings.length > 0;
console.log(`\n结果: ${hardFail ? '❌ 失败' : softFail ? '⚠️ 严格模式失败' : '✅ 通过'}`);
process.exit(hardFail || softFail ? 1 : 0);
