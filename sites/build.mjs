#!/usr/bin/env node
// ============================================================================
// ai-compare → 三分站构建脚本
// ----------------------------------------------------------------------------
// 数据源：_data/ai-compare/tracks/<track>/products/*.md（frontmatter + 正文）
// 输出：  _sites/<track>/index.html + _sites/<track>/<id>.html + assets
//
// 用法：
//   node scripts/build-sites.mjs            # 构建全部三站
//   node scripts/build-sites.mjs ide        # 只构建 ide 站
//   node scripts/build-sites.mjs --check    # 只校验数据，不出站
//
// 设计约束（来自品牌壳与数据层约定）：
//   1. 顶栏/页脚/基础 token 一律走 brand.css，页面不另起一套
//   2. 内容层只用 --accent 做分色，不改 --bg/--ink/--line 等基础色
//   3. 8 维度顺序固定，来自 axes/ 的定义顺序
//   4. 数据有缺口就不出站（校验失败即中止）
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { shell as buildShell } from './shell.mjs';

// 路径解析优先级：环境变量 > 向上查找仓库根 > 脚本位置推导
//
// 三种用法都要支持：
//   1. 本地开发：脚本在 <repo>/_sites/_template/，数据在 <repo>/_data/ai-compare
//      → 脚本上溯两级是 repo，向下拼 _data/ai-compare
//   2. CI 构建：脚本在 <data-repo>/sites/，数据同仓库
//      → 脚本上一级就是数据仓库，tracks/ 与之平级
//   3. 显式指定：DATA_DIR / OUT_DIR / BRAND_DIR 环境变量
const HERE = path.dirname(fileURLToPath(import.meta.url));

function findDataDir() {
  if (process.env.DATA_DIR) return path.resolve(process.env.DATA_DIR);
  // 从脚本位置向上找带 tracks/ 的目录（即数据仓库根）
  let dir = HERE;
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(dir, 'tracks'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // 回退：按本地开发布局推断（2026-10-02 起内容仓改名为 _data/agent-guide）
  return path.resolve(HERE, '..', '..', '_data', 'agent-guide');
}

function findOutDir(dataDir) {
  if (process.env.OUT_DIR) return path.resolve(process.env.OUT_DIR);
  /* 判定依据是「脚本是否落在 monorepo 的 _data/<内容仓>/sites/ 下」，
   * 而不是「_sites 目录是否存在」——后者会误判：CI 里上溯路径可能是任意位置，
   * 恰好存在 _sites 就被当成本地布局。
   *
   * 上溯层数别数错：脚本在 <repo>/_data/agent-guide/sites/ 下，
   * 要上溯 **三层** 才到 <repo>（sites → agent-guide → _data → repo）。
   * 数成两层会拿到 <repo>/_data，然后去比 _data/_data/agent-guide —— 永远不成立，
   * 于是本地构建悄悄落到 <内容仓>/dist/ 而不是 _sites/（2026-10-02 实际踩到）。
   */
  const repoRoot = path.resolve(HERE, '..', '..', '..');
  const isLocalLayout = dataDir === path.join(repoRoot, '_data', 'agent-guide');
  return isLocalLayout
    ? path.join(repoRoot, '_sites', 'agent.specul')
    : path.join(dataDir, 'dist');
}

function findBrandDir() {
  if (process.env.BRAND_DIR) return path.resolve(process.env.BRAND_DIR);
  // 本地布局：品牌壳在 <repo>/www.specul/（上溯三层到 repo，见 findOutDir）
  const repoGuess = path.resolve(HERE, '..', '..', '..', 'www.specul');
  if (fs.existsSync(path.join(repoGuess, 'brand.css'))) return repoGuess;
  return '.build'; // CI 约定
}

const DATA = findDataDir();
const OUT = findOutDir(DATA);
const BRAND_DIR = findBrandDir();
const BRAND = path.join(BRAND_DIR, 'brand.css');
const BRANDJS = path.join(BRAND_DIR, 'brand.js');

const AXES = [
  ['model_access', '模型与开放条件'],
  ['runtime', '运行位置'],
  ['local_files', '本地文件'],
  ['background', '关机后的任务'],
  ['tools', '工具与扩展'],
  ['context', '上下文与记忆'],
  ['permissions', '权限与限制'],
  ['fit', '适合什么任务'],
];
const MCP_AXES = [
  ['transport', '传输方式'],
  ['auth', '认证机制'],
  ['scope', '权限范围'],
];

// 每个维度「问的是什么」—— 首页展示用，让读者一眼理解坐标系
const AXIS_DESC = {
  model_access: '用谁的模型？能不能换第三方？多模型路由怎么配？',
  runtime: '本地 / 云端 / 混合？索引在本地还是云端？远程控制不等于云端执行。',
  local_files: '能访问多大范围？未打开的大文件怎么读？符号级能力如何？',
  background: '电脑关了还能继续跑吗？这是本地形态最常见的误解来源。',
  tools: '工具链有多宽：MCP · LSP · 插件 · Hooks · 自定义指令。',
  context: '索引算法、上下文窗口、会话恢复与分叉、跨会话记忆边界。',
  permissions: '沙箱与审批边界、凭据管理、数据是否出境、额度如何计算。',
  fit: '最擅长什么任务？什么情况下别用它？',
  transport: '客户端怎么连上它：stdio / SSE / Streamable HTTP / 远程。',
  auth: '怎么证明身份。注意认证 ≠ 授权，前者是「你是谁」，后者是「你能做什么」。',
  scope: '能碰到多少东西？能改吗？能删吗？能收紧吗？这是 MCP 赛道第一优先级。',
};

/* ============================================================
 * 站点 + 分区配置：agent.specul.com 一个站，三个分区
 * ============================================================
 * 2026-10-02 重构：原来 ide/cli/mcp/harness 四个独立站（四个域名），
 * 合成**一站三分区**。理由：
 *   - 「IDE vs CLI」这个轴 2026 年已失效（Claude Code / Copilot / Cursor
 *     三者全部有 CLI、全部 agent 式执行代码、全部支持 MCP）
 *   - 四站分散会让「同一个产品的两种装法」看起来像两个产品在竞争
 *
 * **三个分区不能合成一张表**（这是本页最重要的渲染约束）：
 *   agents  关心「装在哪、连什么模型、沙箱边界」—— 8 个通用维度
 *   harness 关心「状态持久化 vs 上下文压缩」—— 同8 维但核心分野在 family
 *   tools   关心「缺什么能力 → 装哪个」—— 坐标系是 MCP 三维，不是八维
 *
 * ── URL 与CNAME 的分工（曾踩过的坑）────────────────────────────────
 * `domain` 一律是**根域名**，不带路径：CNAME 文件只接受域名，
 * 写 `agent.specul.com/harness/` 会让 Pages 绑定失败。
 * 分区路径由 `dir` 单独表达（'' 表示落在根）。
 */
const SITE = {
  domain: 'agent.specul.com',
  name: 'Agent 图谱',
  tagline: '让 AI 替你干活 —— 装在哪、连什么、边界在哪',
  desc: '按角色分三层：自己跑的成品 agent、自己搭的运行时与 SDK、给 agent 装的 MCP 工具。三层的坐标系不同，不做横向排名。',
  repo: 'https://github.com/speculcom/ai-agent-guide',
  // 站内分区导航（跨站导航在 shell.mjs 的 NAV 里，那是全站唯一定义处）
  partitions: ['agents', 'harness', 'tools'],
};

const SITES = {
  agents: {
    key: 'agents',
    navKey: 'agent',   // 跨站导航的 key：三分区共用一个导航项
    dir: '',              // 落站点根：导航「Agent」指的就是它，不该让访客多点一次
    domain: SITE.domain,
    name: '成品 Agent',
    short: 'Agents',
    accent: '#8b7cf8',
    tagline: '装在编辑器、终端，或厂商云里',
    // desc 只说「本分区比较什么维度」，不逐个列对象名——
    // 逐个列会在档案分期补齐时与实际数量不一致（曾出现「3 个对象」却列了 10 个名字）
    desc: '自己能跑的成品 AI agent，共用八维（模型接入 / 运行位置 / 本地文件 / 关机后任务 / 工具扩展 / 上下文 / 权限 / 适合场景）。按形态分三列——IDE 形态、CLI 形态、厂商云形态。前两者是同一产品的不同装法、不是竞争关系；厂商云形态则是另一个方向：不需要自己装，工作在别人的机器上做。',
    // cloud 是 2026-10-03 新增的第三种形态（OpenAI Dot / Meta Muse / xAI Grok Bot）。
    // 它们既不是 IDE 也不是终端 CLI —— 装在厂商的云上，本机不装任何东西。
    // 归agents 分区是因为它们和 ide/cli 共享同一套八维坐标系；
    // **不新开分区**是因为新开分区会让「八维对比」这件事跨站分裂。
    owns: ['ide', 'cli', 'cloud'],
    // agents 分区额外按形态分三组呈现（ide/cli/cloud）——因为三组产品各有两份档案，不能合成一张表
    splitBy: 'form',
  },
  harness: {
    key: 'harness',
    navKey: 'agent',   // 跨站导航的 key：三分区共用一个导航项
    dir: 'harness',
    domain: SITE.domain,
    name: '自己搭的底座',
    short: 'Harness',
    accent: '#3b82f6',
    tagline: '运行时、编排框架、SDK',
    desc: 'Agent 运行时 / 编排框架 / SDK 的责任边界、状态持久化能力与权限模型。收录标准：提供 Agent 运行时或编排层、有官方文档可回溯、近 30 天有实质更新。',
    owns: ['harness'],
    splitBy: 'family',   // 按抽象层分组：原语型 / 编排型 / 开箱型
  },
  tools: {
    key: 'tools',
    navKey: 'agent',   // 跨站导航的 key：三分区共用一个导航项
    dir: 'tools',
    domain: SITE.domain,
    name: '给 agent 装的工具',
    short: 'Tools',
    accent: '#22d3c5',
    // 「你装，它调」——用户动作是装不是调，这是这站正确的表述
    tagline: '缺什么，装什么 —— 给 agent 装的 MCP 工具',
    desc: 'MCP server 的权限范围、传输方式与输出可用性。收录标准：已发布为可安装的 MCP server、有官方仓库或文档可回溯、近 30 天有实质更新。这里是能力缺口查表，不是选型对比。',
    owns: ['mcp'],
    splitBy: null,
  },
};

const args = process.argv.slice(2);
const CHECK_ONLY = args.includes('--check');
const only = args.filter(a => !a.startsWith('--'));
const targets = only.length ? only : Object.keys(SITES);

// ── YAML 子集解析（与 validate.mjs 同源，避免两套解析逻辑漂移）──────────────
function parseFrontmatter(text) {
  if (!text.startsWith('---\n')) return null;
  const end = text.indexOf('\n---\n', 4);
  if (end === -1) return null;
  const lines = text.slice(4, end).split('\n');
  const data = {};
  let i = 0;
  const indentOf = s => s.length - s.trimStart().length;
  const clean = (s) => {
    const v = s.trim();
    if (v === '>' || v === '>-' || v === '|' || v === '|-') return { block: true, fold: v[0] === '>' };
    return { block: false, val: v === 'null' ? null : v.replace(/^["']|["']$/g, '') };
  };
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith('#') || indentOf(line) > 0) { i++; continue; }
    const m = /^([A-Za-z_][A-Za-z0-9_]*):\s?(.*)$/.exec(line);
    if (!m) { i++; continue; }
    const key = m[1];
    const info = clean(m[2]);
    if (!info.block && m[2].trim() !== '') {
      if (m[2].trim().startsWith('[')) {
        data[key] = m[2].trim().replace(/[[\]]/g, '').split(',')
          .map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      } else data[key] = info.val;
      i++; continue;
    }
    const blockLines = [];
    let j = i + 1;
    while (j < lines.length) {
      const l = lines[j];
      if (!l.trim()) { blockLines.push(''); j++; continue; }
      if (indentOf(l) === 0) break;
      blockLines.push(l); j++;
    }
    while (blockLines.length && !blockLines[blockLines.length - 1].trim()) blockLines.pop();
    if (info.block) {
      data[key] = info.fold ? blockLines.map(l => l.trim()).join(' ').trim() : blockLines.map(l => l.trim()).join('\n').trim();
    } else if (blockLines.some(l => l.trim().startsWith('- ') || l.trim() === '-')) {
      data[key] = blockLines.map(l => l.trim().replace(/^-\s*/, '').trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else {
      const sub = {};
      for (const l of blockLines) {
        const sm = /^([A-Za-z_][A-Za-z0-9_]*):\s?(.*)$/.exec(l.trim());
        if (!sm) continue;
        const cinfo = clean(sm[2]);
        if (cinfo.block) {
          const parts = [];
          let k = blockLines.indexOf(l) + 1;
          while (k < blockLines.length) {
            const nl = blockLines[k];
            if (!nl.trim()) { parts.push(''); k++; continue; }
            if (indentOf(nl) <= indentOf(l)) break;
            parts.push(nl.trim()); k++;
          }
          sub[sm[1]] = cinfo.fold ? parts.filter(Boolean).join(' ') : parts.join('\n').trim();
        } else sub[sm[1]] = cinfo.val;
      }
      data[key] = sub;
    }
    i = j;
  }
  return data;
}

// 数据完整度快照：来自数据层 `node scripts/audit-gaps.mjs` 的输出。
// 写死而非运行时计算，有两个原因：
//   1. 站点构建不必再跑一次解析
//   2. 这个数字本身就是「上一次人工核验的快照」，带 last_verified 语义，
//      动态计算反而会掩盖「数据多久没动了」
// 更新方式：跑 audit-gaps 后同步这里。
const COVERAGE = { done: 120, total: 211 };
/* 键是 **track 值**（内容分类四取值），不是分区名。
 * 分区只是打包：agents 分区 = ide + cli 两行，tools 分区 = mcp 一行，
 * harness 分区没有 COVERAGE 快照（audit-gaps 脚本当时只覆盖了前三类）。
 * 别把这里当成分区清单读—— 那样会把harness 漏掉。*/
const COVERAGE_BY_TRACK = {
  mcp: { done: 69, total: 99, note: '官方 README 信息充分，70% 维度已核验' },
  cli: { done: 22, total: 48, note: '部分对象的官方文档不完整' },
  ide: { done: 29, total: 64, note: '多为闭源产品，索引策略等细节官方不公开' },
};
// 分区 → 该分区要展示的 track 行
const COVERAGE_ROWS = { agents: ['ide', 'cli'], harness: [], tools: ['mcp'] };
const TRACK_LABEL = { mcp: 'MCP 服务器', cli: 'CLI 形态', ide: 'IDE 形态' };

// ── 读取一个赛道 ───────────────────────────────────────────────────────────
/* 站点 → 赛道目录的映射。
 * 2026-10-02 重构：4 站（ide/cli/mcp/harness）合成 1 站 3 分区。
 * 但**档案的 track: 字段没变**（仍是 ide/cli/mcp/harness 四种取值）——
 * 它是内容分类，validate 与 familyGroups 都依赖它，不要改成 agents/tools。
 * 这里只解决「文件在哪」的问题：
 *   agents 分区 ← tracks/agents（内含 track:ide 8 份 + track:cli 6 份）
 *   harness 分区 ← tracks/harness（track:harness 10 份）
 *   tools  分区 ← tracks/tools（track:mcp 9 份）
 */
const TRACK_DIRS = { agents: 'agents', harness: 'harness', tools: 'tools' };

function loadTrack(partKey) {
  /* 按分区读档案。ide 与 cli 的档案现在同处 tracks/agents/，
   * 但 track: 值不同 —— 不能只按目录过滤，否则会丢三组里各一份的一半。
   * 做法：读该分区目录下的products，用 frontmatter 的 track 判归属
   *（SITES[partKey].owns），目录外的档案自然不会被读到。 */
  const site = SITES[partKey];
  const dir = path.join(DATA, 'tracks', TRACK_DIRS[partKey], 'products');
  if (!fs.existsSync(dir)) return { entries: [], errors: [`目录不存在: ${dir}`] };
  const entries = [];
  const errors = [];
  const seen = new Set();
  // 归属：分区 → 它收哪些 track 值的档案
  const OWNED = site.owns;

  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.md')).sort()) {
    const abs = path.join(dir, f);
    const raw = fs.readFileSync(abs, 'utf8');
    const fm = parseFrontmatter(raw);
    const rel = path.relative(DATA, abs).replace(/\\/g, '/');
    if (!fm) { errors.push(`${rel} · frontmatter 解析失败`); continue; }
    if (OWNED && !OWNED.includes(fm.track)) continue;

    const id = fm.id || f.replace('.md', '');
    if (f.replace('.md', '') !== id) errors.push(`${rel} · 文件名与 id 不符`);
    if (seen.has(id)) errors.push(`${rel} · id 重复: ${id}`);
    seen.add(id);
    // 断言改成「track 值必须属于该分区收的集合」——
    // 原来比的是 `fm.track !== track`，那时 track 恰好等于 track 值；
    // 一站三分区后 track 是分区名（agents/tools），直接比会全库报错。
    if (!OWNED.includes(fm.track)) errors.push(`${rel} · track 字段(${fm.track})不属于分区 ${partKey}`);

    const need = ['id','name','vendor','homepage','last_verified','confidence','lifecycle'];
    for (const k of need) if (!fm[k]) errors.push(`${rel} · 缺必填 ${k}`);

    const axes = fm.axes || {};
    // MCP 档案另有 3 个特有维度，在 mcp: 块下（见 SCHEMA 2.4）
    const mcpBlock = fm.mcp || {};
    const mcpKeys = OWNED.includes('mcp') ? MCP_AXES.map(x => x[0]) : [];
    for (const k of AXES.map(x => x[0])) {
      if (!axes[k]) errors.push(`${rel} · 缺维度 axes.${k}`);
    }
    for (const k of mcpKeys) {
      if (!mcpBlock[k]) errors.push(`${rel} · 缺 MCP 维度 mcp.${k}`);
    }

    const srcs = Array.isArray(fm.sources) ? fm.sources : [];
    if (srcs.length < 2) errors.push(`${rel} · sources 少于 2 条`);

    // sources 是 frontmatter 里的对象数组，需要单独解析
    const sourceBlock = /sources:\n([\s\S]*?)(?=\n[a-z_]+:)/.exec(fm.__raw || raw);
    const sources = [];
    if (sourceBlock) {
      const sm = /- label:\s*`?([^`\n]+)`?\s*\n\s*url:\s*(\S+)\s*\n\s*kind:\s*(\S+)/g;
      let mm;
      while ((mm = sm.exec(sourceBlock[1])) !== null) sources.push({ label: mm[1].trim(), url: mm[2].trim(), kind: mm[3].trim() });
    }

    // 正文：frontmatter 之后
    const bodyStart = raw.indexOf('\n---\n', 4) + 5;
    const body = raw.slice(bodyStart);
    /* 章节正文要匹配到**下一个二级标题或文件真正末尾**。这里有两种写法都会静默丢内容：
     *  ① 收尾 `|\s*$` —— `\s` 含 `\n\n`，匹配到**第一个空行**就停；
     *  ② 收尾 `|$` 配非贪婪 `[\s\S]*?` —— m 模式下 `$` 匹配**每个行尾**，
     *     于是非贪婪在第一行末就满足条件。
     * 两者都让「适合与不适合」这类多段章节只剩首段，**而且不报错** ——
     * 页面照常渲染，只是内容悄悄少了一半。copilot.md 等既有档案同样中招，
     * 说明这个 bug 存在整个仓库生命周期，只是没人核对章节完整性
     * （2026-10-03 补云上agent 档案、核对渲染结果时才发现）。
     * EOF 用「后面什么都没有」的否定前瞻 `(?!\s*\z)` 才准确。 */
    const section = (name) => {
      const m = new RegExp(`^##\\s+${name}\\s*\\r?\\n([\\s\\S]*?)(?=\\r?\\n##\\s|$(?![\\s\\S]))`, 'm').exec(body);
      return m ? m[1].trim() : '';
    };

    entries.push({
      id, name: fm.name, vendor: fm.vendor, homepage: fm.homepage,
      mark: fm.mark || '', accent: fm.accent || '',
      tagline: fm.tagline || '', summary: fm.summary || '',
      tags: fm.tags || [], related: fm.related || [],
      pricing: fm.pricing || {}, pricingPitfalls: fm.pricing_pitfalls || [],
      axes, mcp: mcpBlock, sources,
      pitfalls: fm.pitfalls || [],
      lastVerified: fm.last_verified, lastUpdated: fm.last_updated,
      lifecycle: fm.lifecycle, confidence: fm.confidence,
      family: fm.family || '',  // harness 分层；validate 强制必填，页面需按它分组呈现
      track: fm.track,// 仍是内容分类四取值（ide/cli/harness/mcp），首页按它分形态
      axesKeys: [...AXES.map(x => x[0]), ...mcpKeys],
      body,
      sec: {
        oneline: section('一句话定位'),
        fit: section('适合与不适合'),
        runs: section('实测记录'),
        unknowns: section('未知项清单'),
        related: section('相关条目'),
      },
      url: fm.link && fm.link.url,
      linkKind: fm.link && fm.link.kind,
    });
  }
  return { entries, errors };
}

// ── 校验 ─────────────────────────────────────────────────────────────────
function validate(partKey, entries, errors) {
  const errs = [...errors];
  const seen = new Set();
  for (const e of entries) {
    if (seen.has(e.id)) errs.push(`${partKey}/${e.id} · id 重复`);
    seen.add(e.id);
    if (!e.sec.oneline) errs.push(`${partKey}/${e.id} · 正文缺「一句话定位」`);
    if (!e.sec.fit) errs.push(`${partKey}/${e.id} · 正文缺「适合与不适合」`);
    if (!e.sec.runs) errs.push(`${partKey}/${e.id} · 正文缺「实测记录」`);
    if (!e.sec.unknowns) errs.push(`${partKey}/${e.id} · 正文缺「未知项清单」`);
    if (e.confidence === 'verified' && e.lifecycle !== 'active') {
      errs.push(`${partKey}/${e.id} · confidence=verified 但 lifecycle=${e.lifecycle}`);
    }
  }
  return errs;
}

// ── HTML 工具 ────────────────────────────────────────────────────────────
const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// 保留 Markdown 里的 **加粗** 与 `代码`
function mdInline(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/&gt;(.+?)&lt;/g, '<strong>$1</strong>');
}

/* 档案正文里的相对链接是按**内容仓**的目录关系写的，站点里没有这些目录，
 * 直接搬过去必然死链。渲染时按三种形态重写（前两种只有在一站三分区后
 * 才可能做对——原先四站各管一个目录，跨分区根本指不到）：
 *   ../../<track>/products/<id>.md  →  站内详情页 /<分区>/<id>.html（跨分区）
 *   ./<id>.md 或 <id>.md            →  同分区详情页 ./<id>.html（同分区互引）
 *   ../tasks/_protocol.md          →  内容仓 GitHub 链接（协议文档不是站点内容）
 * 前缀有 ../../ 和 ../ 两种写法（取决于链接发起方所在的赛道目录），正则不能只认一种。
 */
const TRACK_TO_PART = { ide: 'agents', cli: 'agents', harness: 'harness', mcp: 'tools' };
function rewriteInternal(href) {
  // 1. 跨分区：指向另一个赛道的档案
  let m = /^(?:\.\.\/)+(ide|cli|harness|mcp)\/products\/([A-Za-z0-9._-]+)\.md$/.exec(href);
  if (m) {
    const s = SITES[TRACK_TO_PART[m[1]]];
    return s.dir ? `/${s.dir}/${m[2]}.html` : `/${m[2]}.html`;
  }
  // 2. 同分区互引：./x.md 与裸 x.md 两种写法都见过
  m = /^(?:\.\/)?([A-Za-z0-9._-]+)\.md$/.exec(href);
  if (m) return `./${m[1]}.html`;
  // 3. 实测协议文档 —— 站内没有，链到内容仓
  m = /^(?:\.\.\/)+tasks\/(_protocol\.md)$/.exec(href);
  if (m) return `${SITE.repo}/blob/main/tracks/agents/tasks/${m[1]}`;
  return href;
}

// 把段落里的 Markdown 链接转成 a（先转义再处理，避免注入）
function mdLinks(s, base = '') {
  let out = mdInline(s);
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, text, rawHref) => {
    const href = rewriteInternal(rawHref);
    if (/^https?:/.test(href)) return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
    return `<a href="${href}">${text}</a>`;
  });
  return out;
}

function renderList(items, cls = '') {
  if (!items || !items.length) return '';
  return `<ul class="${cls}">${items.map(i => `<li>${mdInline(i)}</li>`).join('')}</ul>`;
}

// ── 「从这里开始」引导区 ─────────────────────────────────────────────
// 为什么要它：访客落地后第一眼看到的是一张 8~11 行的密集表格，
// 没有任何「我该从哪看起」的指引 —— 数据再准，读者不知道用途就等于没用。
// 每站回答该赛道客户最关心的那个问题，并给出明确的下一跳。
// 分赛道写，因为「客户来这个站要解决什么」本来就不同。
const GUIDE = {
  /* agents 分区的引导由原ide + cli 两份合并而成。
   * 合并的关键：**分类轴从「形态」换成「你要它替你干多少事」**——
   * 原来 ide 站按形态分、cli 站按权限确认粒度分，两套轴放在一个站里会打架。
   * 新轴的好处：IDE 形态与 CLI 形态都能落进去，且回答的是访客真正在问的问题。 */
  agents: {
    title: '先回答一件事：你要它替你干多少事',
    lede: '这一分区 17 份档案，<strong>分三个方向</strong>：14 份是装在自己机器上的（IDE 形态 8 + CLI 形态 6，其中<strong>三组是同一个产品的两种装法</strong>——Aider、Claude Code、Codex 各有一份 IDE 形态和一份 CLI 形态，它们不是竞品，差别在<strong>装在哪、怎么被唤起、能不能塞进脚本</strong>）；另 3 份是<strong>厂商云形态</strong>——本机什么都不装，工作在别人的机器上做。',
    steps: [
      ['我要一个自己能开的编辑器', '看 <strong>IDE · 独立编辑器</strong>', 'Cursor、已改称 Devin Desktop 的 Windsurf、Zed 都在这一类。'],
      ['我已经在用 VS Code / Cursor 了', '看 <strong>IDE · 扩展形态</strong>', 'Claude Code、Codex、Copilot、Cline都是在既有编辑器里装。注意前两者<strong>另有 CLI 形态</strong>，别当成两个产品比。'],
      ['我不想换编辑器，也不想装插件', '看 Aider（Watch 模式）', '它不是编辑器插件而是后台常驻进程，你在任意编辑器里加 AI 注释它就响应。'],
      ['我要它每一步都问我', '看<strong>默认逐次确认</strong>的那几个 CLI', 'Crush 默认每次工具调用都问；Aider 有自动提交但沙箱机制未核验。'],
      ['我要它在指定范围内自己跑', '看<strong>有明确沙箱 / 可信目录</strong>的那几个', 'Gemini CLI 的沙箱与 Trusted Folders 都有独立官方文档；Claude Code CLI 的权限粒度最细，还有「允许这一次」。'],
      ['我要它能塞进 CI / 脚本里跑', '<strong>有两个有官方证据的落点</strong>', 'Gemini CLI 明确支持非交互模式；Codex CLI 的 <code>docs/exec.md</code> 标题即 Non-interactive mode（正文为外链）。其余未核验。'],
      ['我要<strong>关掉客户端后它还在干活</strong>', '看<strong>厂商云形态那3 份</strong>', '<strong>这一层只有它们</strong>：14 份本地形态的 <code>background</code> 维度一致写着不支持后台长任务。Dot / Muse / Grok Bot 的差别在<strong>审批机制怎么设计</strong>——Muse 有独立的 Sentinel agent，Dot 是自动审核，Grok Bot 官方页<strong>没写</strong>。'],
      ['我要数据完全不离开本机', '<strong>这一层也没有合适的</strong>', '厂商云形态的机器在别人那里（Dot 默认与本机隔离、授权后才碰）；本地形态里只有 sandbox / 可信目录那一档能限制写入范围。'],
    ],
    foot: '⚠ 两个最容易踩的误解：<strong>「AI 原生编辑器」不等于「模型可自选」</strong>——形态看 <code>runtime</code>，模型接入看 <code>model_access</code>，两个维度是分开的；<strong>Codex CLI 的审批模式与沙箱档位在 CLI 文档里查不到，在它 SDK 的源码里有</strong>——四种审批 × 三档沙箱（read-only / workspace-write / danger-full-access），还能按路径 deny 掉读 <code>.env</code>，跨平台差异仍未核验。',
  },
  tools: {
    title: '先回答一件事：你到底缺什么能力',
    lede: 'MCP 不是「让 AI 更聪明」，是<strong>给 AI 接上它本来够不到的东西</strong>。如果你要的只是聊天和写代码，你不需要它。<strong>你装，它调</strong>——9 个条目全是官方 reference server，不含第三方。',
    steps: [
      ['我要读写本地文件 / 操作 Git', 'filesystem、git', '两个都是读写权限，git 那一类值得先看 scope 里能限制到哪些目录。'],
      ['我要它记住东西、跨会话召回', 'memory', '这是最容易被误解的一类——<strong>它不是「模型记忆」</strong>，是外部知识图谱存储。'],
      ['我要让 AI 上网拿资料', 'context7、fetch', '风险最高的一类是 fetch：档案里引了官方警告——<strong>可访问本地与内网 IP，无地址白名单、无审批机制</strong>。'],
      ['我要控制真实浏览器', 'playwright', '注意官方<strong>明确声明来源限制不是安全边界</strong>，需要真隔离得用 <code>--isolated</code> 或容器化网络策略。'],
      ['我要点时间 / 拆解推理 / 跨平台搜文件', 'time、sequential-thinking、everything', '三个都是只读，风险最低。'],
    ],
    foot: '⚠ 一个容易忽略的维度：<strong>数据出境</strong>。Context7 是本分区唯一以远程服务为默认形态的条目，查询内容会发到 Upstash 服务器；其余八个都是本地 stdio 进程。另外——<strong>装 MCP 需要你手动做，调用不需要</strong>：server 启动后自动把工具清单报给你的客户端，之后调不调、什么时候调，由 agent 自己判断，你只在审批环节介入。',
  },
  harness: {
    title: '先回答一件事：你要不要自己搭',
    lede: '这是本分区存在的唯一理由。<strong>如果现成产品已经够用，正确答案是「不要搭」</strong>——那就去 <a href="/">成品 Agent</a>，不用往下看。真要自己搭，第一步是认清你要的抽象层。',
    steps: [
      ['我要最细的控制权，文件系统我自己管', '<strong>原语型</strong>（primitives-only）', '只给你 agent loop 的原语，不替你决定文件系统 / 规划 / 记忆怎么做 —— OpenAI Agents SDK 是这一类。'],
      ['我要一个成熟 CLI 直接变成 API 对象', '<strong>包装既有 CLI</strong>', 'Claude Agent SDK 捆绑完整 CLI，默认给全工具无沙箱 —— 你省了造轮子，但权限模型是继承来的。'],
      ['我要开箱即跑的通用长任务助手', '<strong>batteries-included</strong>', 'Deep Agents 官方自述 opinionated：预置更多东西，也替你做了更多决定。'],
      ['流程要图、要能中断恢复、要多 Agent 协作', '<strong>编排框架</strong>：LangGraph / Google ADK / CrewAI', 'LangGraph 的落盘粒度最明确（每 superstep 存一次图状态），ADK 的图执行引擎最完整，CrewAI 用「角色分工 + 事件流程」两套抽象。'],
      ['我要它常驻、跨平台、能定时跑', '<strong>平台型 / 常驻型</strong>：OpenHands / Hermes Agent', 'OpenHands 是带 Web UI 的自托管控制中心；Hermes 更进一步——能挂 Telegram/Discord/Slack/WhatsApp/Signal/Email 六平台，还能 cron 无人值守。'],
      ['我只想要个工具用，不想维护', '不该来这个分区', '这属于「不自建」那一侧，见 <a href="/">成品 Agent</a>。'],
    ],
    foot: '⚠ 三个最容易踩的坑：<strong>「状态」和「上下文」不是一回事</strong>——压缩上下文会丢信息，状态持久化才是长期可靠运行的前提（各家在这两层的完备程度差别很大）；<strong>「provider 无关」不等于「本地模型可用」</strong>（Claude Agent SDK 只支持 Claude，CrewAI 则点名支持 Ollama）；<strong>编排框架不给沙箱</strong>——权限边界要自己确认。',
  },
};

function guideSection(partKey, site, entries) {
  const g = GUIDE[partKey];
  if (!g) return '';
  return `
    <section class="section guide-band">
      <div class="container">
        <h2>${g.title}</h2>
        <p class="section-desc">${g.lede}</p>
        <ol class="guide-list">
${g.steps
  .map(
    ([when, what, why], i) => `          <li class="guide-step">
            <div class="guide-q"><span class="guide-n">${i + 1}</span>${when}</div>
            <div class="guide-a"><strong>${what}</strong><span class="guide-why">${why}</span></div>
          </li>`,
  )
  .join('\n')}
        </ol>
        <p class="guide-foot">${g.foot}</p>
      </div>
    </section>`;
}

// header / footer / page 骨架统一由 shell.mjs 提供（全站唯一真相源）。
// 品牌名、品牌英文名、导航项全部在 shell.mjs 里，本文件**不再重复定义**——
// 之前这里有一份 BRAND_ZH / BRAND_EN 副本，其中 BRAND_EN 还停留在旧的
// 「Speculation · Craft」，与shell.mjs 的「Speculative Speculation」分叉。
// 已删除：品牌文案有两份定义就一定会漂移。

// 内容层样式已抽到 site.css（与 brand.css 分开：前者是站点特有结构，后者是全站设计系统）
// 见 _template/site.css —— 那里用 var(--brand)/var(--accent)/var(--fs-*) 引用 brand.css 的 token
const SITE_CSS = '';

// ── 渲染 ─────────────────────────────────────────────────────────────────
// 站内分区导航
// 三分区在一站之内，跨站导航（shell.mjs 的 NAV）只解决「去别的站」，
// 这里解决「在本站换层」。两条导航各管一件事，不要合并。
//
// **链接必须用绝对路径**（/harness/）：分区首页分布在不同深度
// （agents 在根、harness/ 与 tools/ 在子目录），相对路径在子目录页面上会指错。
function partitionBar(current) {
  return `    <nav class="part-bar" aria-label="站内分区">
      <div class="container">
${SITE.partitions.map(k => {
    const s = SITES[k];
    const cur = k === current ? ' aria-current="page"' : '';
    return `        <a href="/${pfx(s)}"${cur} style="--pa:${s.accent}"><b>${esc(s.short)}</b><span>${esc(s.tagline)}</span></a>`;
  }).join('\n')}
      </div>
    </nav>`;
}

// 分区路径前缀：agents 分区落在站点根（''），其余为 'harness/'、'tools/'
function pfx(site) { return site.dir ? site.dir + '/' : ''; }

// 横向表里的「形态」列：agents 分区用 track 值，harness 用 family 值，tools 无形态概念
const FORM_LABEL = { ide: 'IDE 形态', cli: 'CLI 形态', cloud: '厂商云形态', mcp: 'MCP' };
const FAMILY_SHORT = { 'coding-base': '编程底座', orchestration: '编排框架', 'general-harness': '通用 Harness' };

function renderIndex(site, partKey, entries) {
  const base = pfx(site);
  const isTools = site.owns.includes('mcp');
  const axisKeys = isTools ? [...AXES, ...MCP_AXES] : AXES;
  const axisNames = axisKeys.map(x => x[1]);
  const verified = entries.filter(e => e.confidence === 'verified').length;
  // 「最后核验日」从数据算出，不能硬编码 —— 硬编码会在每次核验后变成过期信息
  const latestVerified = entries
    .map(e => e.lastVerified)
    .filter(Boolean)
    .sort()
    .pop() || '未标注';

  // 卡片信息刻意精简：标识 + 名称/厂商 + 一句定位 + 状态 + 入口。
  // 原设计有 tagline / summary / 标签 / 状态 / 链接 五块，视觉上糊成一片；
  // 标签信息价值低（详情页有完整标签），首页不需要重复。
  const cardFor = (e) => {
    const line = plain(e.tagline || e.sec.oneline || '', 62);
    return `        <article class="card" style="--card-accent:${esc(e.accent || site.accent)}">
          <div class="card-top">
            <div class="mark" aria-hidden="true">${esc(e.mark || e.name.slice(0,2))}</div>
            <div class="card-id">
              <h3><a href="./${esc(e.id)}.html">${esc(e.name)}</a></h3>
              <div class="vendor">${esc(e.vendor)}</div>
            </div>
          </div>
          <p class="tagline">${esc(line)}</p>
          <div class="card-foot">
            <span class="t-state ${e.confidence === 'verified' ? 'is-ok' : e.confidence === 'stale' ? 'is-stop' : 'is-warn'}">${esc(e.confidence === 'verified' ? '已核验' : e.confidence === 'stale' ? '待复核' : '部分核验')}</span>
            <a class="more" href="./${esc(e.id)}.html" aria-label="${esc(e.name)} 详情">详情 →</a>
          </div>
        </article>`;
  };

  /* 分组渲染：三个分区的分组轴不同，所以做成一张映射表而不是一堆 if。
   *   agents → 按形态（track: ide/cli/cloud）分。**必须分**，因为三组产品各有两份
   *            档案（Aider / Claude Code / Codex），混在一张表里会让人
   *            以为「Aider」和「Aider Watch 模式」是两个产品在竞争。
   *   harness→ 按抽象层（family）分，validate 把它列为必填枚举，
   *            不渲染就等于这个字段只活在数据层。
   *   tools  → 不分组。9 份是能力缺口查表，再切一层反而增加认知成本。 */
  const SPLIT_META = {
    form: [
      { key: 'ide', name: 'IDE 形态', desc: '装进编辑器，或本身就是独立编辑器。看得见界面，权限多在对话里给。' },
      { key: 'cli', name: 'CLI 形态', desc: '在终端里跑。能进脚本与 CI，权限确认粒度是最细的一层。' },
      // cloud 组是 2026-10-03 新增。第三组必须写清「与前两组的差别在装在哪」——
      // 前两组你本机装东西，这一组你什么都不装、工作在厂商的机器上做，
      // 这个差别直接决定了 permissions 维度的可比性。
      { key: 'cloud', name: '厂商云形态', desc: '本机不装任何东西，在厂商的云端机器上持续工作（OpenAI Dot / Meta Muse / xAI Grok Bot）。差别不在功能多寡，而在<strong>机器归谁</strong> —— 代价是本地文件与离线能力基本让出，收益是关机后仍在跑。' },
    ],
    family: [
      {
        key: 'coding-base',
        name: '编程底座',
        desc: '给你 agent loop 或现成 CLI 的编程接口。这层的差别不在功能多少，而在<strong>它替你做多少决定</strong> —— 一个只给原语，一个把整套 CLI 连权限模型一起打包给你。',
      },
      {
        key: 'orchestration',
        name: '编排框架',
        desc: '把多步骤、多 Agent、要中断恢复的流程显式建成图。给的是控制力，代价是接线与状态管理都归你。',
      },
      {
        key: 'general-harness',
        name: '通用 Harness',
        desc: '预置了规划、文件系统、记忆等一整套，面向通用长任务。开箱程度最高，可改性最低。',
      },
    ],
  };

  const splitBy = site.splitBy;
  const groupBlocks = () => {
    if (!splitBy) {
      return `        <div class="grid">
${entries.map(cardFor).join('\n')}
        </div>`;
    }
    const meta = SPLIT_META[splitBy];
    const pick = (e) => (splitBy === 'form' ? e.track : e.family);
    const blocks = [];
    for (const m of meta) {
      const inG = entries.filter(e => pick(e) === m.key);
      if (!inG.length) continue;
      blocks.push(`        <div class="fam-block">
          <div class="fam-head">
            <h3>${m.name} <span class="fam-n">${inG.length}</span></h3>
            <p>${m.desc}</p>
          </div>
          <div class="grid">
${inG.map(cardFor).join('\n')}
          </div>
        </div>`);
    }
    // 兜底：分组轴上没有落点的档案也要显示出来，不能静默丢
    const known = new Set(meta.map(m => m.key));
    const orphan = entries.filter(e => !known.has(pick(e)));
    if (orphan.length) {
      blocks.push(`        <div class="fam-block">
          <div class="grid">
${orphan.map(cardFor).join('\n')}
          </div>
        </div>`);
    }
    return blocks.join('\n');
  };

  const groupHeading = {
    form: ['按装法分', '同一产品常有 IDE 与 CLI 两种装法，<strong>它们不是竞品</strong>——装在哪、怎么被唤起、能不能进脚本都不同。选你实际要用的那个。'],
    family: ['按抽象层分组', '同一层里也能差很远 —— 两个「编程底座」一个是纯原语、一个是全托管包装 CLI，所以先按抽象层分，再看具体对象。'],
  }[splitBy] || ['全部对象', `按统一坐标系排列。点开任一对象可看到 ${axisNames.join(' / ')} 的完整记录、证据链接与未知项清单。`];

  // 完整度表按分区取对应 track 行；harness 没有快照则整块不出
  const covRows = (COVERAGE_ROWS[partKey] || []).filter(t => COVERAGE_BY_TRACK[t]);
  const covTable = covRows.length ? `          <table class="src is-flush mb-3">
            <thead><tr><th>形态</th><th>已补齐</th><th>说明</th></tr></thead>
            <tbody>
${covRows.map(t => {
    const c = COVERAGE_BY_TRACK[t];
    return `              <tr><td class="nw">${esc(TRACK_LABEL[t])}</td>
                <td class="nw"><strong>${c.done}/${c.total}</strong></td>
                <td class="td-vendor">${esc(c.note)}</td></tr>`;
  }).join('\n')}
            </tbody>
          </table>
` : '';

  const body = `    <section class="hero">
      <div class="container">
        <p class="kicker">${esc(SITE.name)} · ${esc(site.short)}</p>
        <h1 class="t-hero">${esc(site.name)}</h1>
        <p class="lede">${esc(site.desc)}</p>
        <div class="hero-meta">
          <span><b>${entries.length}</b> 个对象</span>
          <span><b>${axisNames.length}</b> 个固定维度</span>
          <span><b>${verified}</b> 个已完整核验</span>
          <span>最后核验 <b>${latestVerified}</b></span>
        </div>
      </div>
    </section>

${partitionBar(partKey)}

    ${guideSection(partKey, site, entries)}

    <section class="section">
      <div class="container">
        <h2>${groupHeading[0]}</h2>
        <p class="section-desc">${groupHeading[1]}</p>
${groupBlocks()}
      </div>
    </section>

    <section class="section status-band">
      <div class="container">
        <div class="status-inner">
          <div class="status-mark" aria-hidden="true">!</div>
          <div>
            <h2>本站目前是「核验快照」，还没有实测数据</h2>
            <p>
              ${isTools
                ? '下面每个 server 的权限范围、传输方式与工具清单都能回到官方 README 核对，但<strong>我们还没有在真实客户端里跑过它们</strong>。'
                : '下面每一个字段都能回到官方原文核对，但<strong>我们还没有在同一批任务上跑过这些工具</strong>。'}
              实测协议已经写好（统一任务、统一验收、记录人工介入与返工次数），任务清单也已就绪，
              <strong>尚未执行</strong>。
            </p>
            <p class="t-sm">
              ${isTools
                ? 'MCP server 的风险不在「能不能干活」，而在<strong>权限边界是否清楚、越界是否被拒</strong>。'
                : '所以本站给的是<strong>能力边界与证据</strong>，不是「哪个更好用」的结论。'}
              真正的选型请用你自己的输入、预算与验收标准跑一遍。
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>${axisNames.length} 个维度，每格都能回溯</h2>
        <p class="section-desc">
          所有对象在同一坐标系下被描述${isTools ? '（MCP 服务器另有 3 个特有维度）' : ''}。
          点开任一对象，每一格下面都有官方源链接与核验日期——不认同可以自己回去查。
        </p>
        <div class="t-mesh axis-mesh">
${axisKeys.map(([k, label], i) => `          <div class="axis-cell">
            <span class="t-index">${String(i + 1).padStart(2, '0')}</span>
            <h3 class="axis-name">${esc(label)}</h3>
            <p class="axis-ask">${esc(AXIS_DESC[k] || '')}</p>
          </div>`).join('\n')}
        </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>全部数据一览</h2>
        <p class="section-desc">同一张表横向对比。点对象名进详情页看逐格证据。</p>
        <div class="table-wrap">
          <table class="cmp">
            <thead>
              <tr>
                <th>对象</th><th>形态</th><th>厂商</th><th>适合</th><th>核验日</th><th>状态</th>
              </tr>
            </thead>
            <tbody>
${entries.map(e => `              <tr>
                <td><a href="./${esc(e.id)}.html"><span class="td-mark" style="--card-accent:${esc(e.accent || site.accent)}">${esc(e.mark || e.name.slice(0, 2))}</span>${esc(e.name)}</a></td>
                <td class="td-vendor">${esc(FORM_LABEL[e.track] || FAMILY_SHORT[e.family] || e.track)}</td>
                <td class="td-vendor">${esc(e.vendor)}</td>
                <td class="td-fit">${plain(e.fit || e.axes.fit || '', 70)}</td>
                <td class="td-date">${esc(e.lastVerified)}</td>
                <td><span class="td-conf ${esc(e.confidence)}">${esc(e.confidence)}</span></td>
              </tr>`).join('\n')}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>为什么这里不给总分排名</h2>
        <p class="section-desc">这不是省略，是方法上的明确取舍。</p>
        <div class="panel">
          <ul>
            <li><strong>缺统一实测，就不给分。</strong>跨工具的跑分口径不同——题目、预算、执行环境都不一样，A 的 90 分和 B 的 88 分不可比。</li>
            <li><strong>「未知」是合法答案。</strong>查不到就写「未知」并说明为什么，不用推测填充。缺信息本身也是信息。</li>
            <li><strong>每条判断挂官方源。</strong>来源链接、类型与核验日都在详情页里，可以逐条回去复核。</li>
            <li><strong>lifecycle 单独标注。</strong>核验日新不等于数据有效——上游归档后数据会失效，所以单独标 <code>active</code> / <code>maintenance</code> / <code>archived</code>。</li>
            <li><strong>不同层不混排。</strong>成品 agent、自己搭的底座、给 agent 装的工具是三种角色，坐标系不同；硬合成一张 33 行的表只会制造假的可比性。</li>
          </ul>
        </div>
        <div class="panel">
          <h2>可信度标记怎么读</h2>
          <p class="t-sm mb-3">详情页与上表都带 <code>confidence</code>，它反映<strong>本站数据的完整度</strong>，不是对产品的评价。</p>
          <table class="src is-flush">
            <tbody>
              <tr><th class="w-24"><span class="td-conf verified">verified</span></th><td>${axisNames.length} 个维度均有官方源支撑，且核验日在 90 天内</td></tr>
              <tr><th><span class="td-conf partial">partial</span></th><td>部分维度标为未知，或官方文档不可访问，或核验日超过 90 天</td></tr>
              <tr><th><span class="td-conf stale">stale</span></th><td>官方已发布重大变化，本站尚未核验</td></tr>
            </tbody>
          </table>
        </div>
        <div class="panel">
          <h2>本站当前的完整度</h2>
          <p class="t-sm mb-2">
            数据层用 <code>node scripts/audit-gaps.mjs</code> 可随时复核这个数字。
            以下是最近一次核验的快照（核验日 2026-09-29）：
          </p>
${covTable}          <p><strong class="em">全站合计 ${COVERAGE.done}/${COVERAGE.total} 维度已补齐（${Math.round(COVERAGE.done / COVERAGE.total * 100)}%）</strong></p>
          <p class="t-sm">
            剩余未补齐项分三类：<strong>官方未公开</strong>（索引算法、沙箱实现细节本就不对外说明）、
            <strong>需实测才能确定</strong>（大仓库表现、CI 无 TTY 行为）、
            <strong>客观渠道不可达</strong>。
          </p>
          <p class="t-sm">
            我们选择留白而不是填「已支持」——错误的成本最终由使用者承担。
          </p>
        </div>
        <div class="panel">
          <h2>数据来源与复核方式</h2>
          <p>全部数据来自开源仓库 <a href="${SITE.repo}" target="_blank" rel="noopener" class="link-brand">speculcom/ai-agent-guide</a>（CC BY 4.0）。</p>
          <p>每个条目都是纯 Markdown + frontmatter，含 8 个维度、证据链接、核验日与可信度标记。仓库内含：</p>
          <ul>
            <li><code>METHODOLOGY.md</code> —— 方法论总纲与四条核心规则</li>
            <li><code>axes/</code> —— 每个维度的定义与判定标准（含正反例）</li>
            <li><code>SCHEMA.md</code> —— 数据格式规范与构建校验规则</li>
            <li><code>tracks/*/tasks/_protocol.md</code> —— 实测协议（<strong>尚未执行</strong>，故本站暂无实测结论）</li>
          </ul>
          <p class="t-sm">发现错误或有新证据，欢迎提 Issue 或 PR——每条修正都会注明依据与影响范围。</p>
        </div>
      </div>
    </section>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: site.name,
    description: site.desc,
    url: `https://${site.domain}/${base}`,
    isPartOf: { '@type': 'WebSite', name: 'Specul', url: 'https://specul.com/' },
    about: entries.map(e => ({
      '@type': 'SoftwareApplication',
      name: e.name,
      applicationCategory: 'DeveloperApplication',
      ...(e.url ? { url: e.url } : {}),
    })),
  };

  return buildShell({
    current: site.navKey,
    title: `${site.name} — ${site.tagline} | 投机取巧`,
    desc: site.desc,
    body,
    jsonLd,
    canonical: `https://${site.domain}/${base}`,
    assetPrefix: site.dir ? '../' : '',
  });
}

// meta / JSON-LD 用纯文本：去掉 Markdown 标记，避免 ** ` [x](y) 漏进搜索结果
function plain(s, max = 160) {
  return String(s ?? '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // [text](url) → text
    .replace(/\*\*([^*]+)\*\*/g, '$1')          // **bold** → bold
    .replace(/`([^`]+)`/g, '$1')                // `code` → code
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function renderDetail(site, partKey, e) {
  const base = pfx(site);
  const isTools = site.owns.includes('mcp');
  // 8 维度读 axes 块；MCP 特有 3 维度读 mcp 块
  const axisKeys = AXES.map(([k, label]) => ({ k, label, v: e.axes[k] }));
  if (isTools) {
    for (const [k, label] of MCP_AXES) axisKeys.push({ k, label, v: e.mcp[k] });
  }
  const axesHtml = axisKeys.map(({ label, v }) => {
    return `        <div class="axis">
          <dt>${esc(label)}</dt>
          <dd>${mdLinks(v)}</dd>
        </div>`;
  }).join('\n');

  const srcRows = e.sources.map(s =>
    `            <tr><td>${esc(s.kind)}</td><td>${esc(s.label)}</td><td><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.url)}</a></td></tr>`
  ).join('\n');

  const priceRows = [];
  if (e.pricing.monthly_label) priceRows.push(['月度入口', e.pricing.monthly_label]);
  if (e.pricing.monthly_usd) priceRows.push(['月度数值', `$${e.pricing.monthly_usd}`]);
  if (e.pricing.annual_label) priceRows.push(['年付', e.pricing.annual_label]);
  if (e.pricing.note) priceRows.push(['额度说明', e.pricing.note]);

  /* 「相关条目」渲染 —— 36 份档案全都有这一章，是访客在同一赛道横向对比的入口。
   *
   * 这一章**曾经采集了却从不渲染**（第二个「静默丢内容」）：
   * 数据层 section('相关条目') 一直在跑，模板里却没有它的位置，
   * 于是36 份档案的横向互引全部不出现在页面上 —— 不报错、构建成功、只是没人看见。
   *
   * 格式：`- [显示名](./x.md 或 ../../<track>/products/x.md) — 一句话说清为什么值得对照`
   * 末段的破折号是关键 —— 只给名字等于让访客自己再点一次，
   * 写清「哪一维不同」才构成对照（同赛道的相似度越高，这句话越重要）。
   * mdLinks() 里的 rewriteInternal 会把两种 .md 写法都转成站内 .html 绝对路径。*/
  const relatedHtml = (() => {
    // 捕获完整的 `[名](href)` —— mdLinks() 要靠 href 才能经 rewriteInternal 转成站内 .html，
    // 只把显示名传进去会得到一段没有链接的纯文本（第一版就这么写错了）。
    const items = (e.sec.related || '').split(/\r?\n/)
      .map(l => /^\s*[-*]\s*(\[[^\]]+\]\([^)]+\.md\))\s*—\s*(.+)$/.exec(l))
      .filter(Boolean);
    if (!items.length) return '';
    const lis = items.map(m => {
      // 显示名进 <a>、理由进 <span> —— 不能把整行塞进 <a>：
      // 嵌套 <a> 会被 HTML 解析器静默吞掉后续兄弟节点（这坑全站踩过）。
      return`          <li><span class="rel-t">${mdLinks(m[1])}</span><span class="rel-n">${mdLinks(m[2])}</span></li>`;
    }).join('\n');
    return `      <div class="panel is-slim">
        <h2>相关条目</h2>
        <ul class="rel-list">
${lis}
        </ul>
      </div>\n`;
  })();

  // 面包屑：站 → 分区 → 本页。
  // 分区链接写绝对路径（/harness/），因为本页可能在子目录里。
  // 注意 agents 的 dir 是空串，拼接必须走 pfx() —— 直接写 `/${s.dir}/`
  // 会拼出 `//`，而 `//` 在页面里是协议相对URL，会指到站外的 evil.com。
  const crumb = `      <nav class="crumbs" aria-label="面包屑">
        <a href="https://${SITE.domain}/">${esc(SITE.name)}</a>
${SITE.partitions.map(k => {
    const s = SITES[k];
    return k === partKey
      ? `        <span aria-current="page">${esc(s.short)}</span>`
      : `        <a href="/${pfx(s)}">${esc(s.short)}</a>`;
  }).join('\n')}
      </nav>`;

  const body = `    <div class="container detail">
${crumb}
      <a class="back" href="./">← ${esc(site.short)}</a>

      <div class="detail-head">
        <div class="mark" style="--card-accent:${esc(e.accent || site.accent)}" aria-hidden="true">${esc(e.mark || e.name.slice(0,2))}</div>
        <div>
          <h1>${esc(e.name)}</h1>
          <div class="vendor is-caps">${esc(e.vendor)}</div>
        </div>
      </div>

      <div class="badges">
        ${(e.tags || []).map(t => `<span class="tag on">${esc(t)}</span>`).join('\n        ')}
        <span class="badge accent">${esc(e.confidence)}</span>
        <span class="badge">lifecycle: ${esc(e.lifecycle)}</span>
        <span class="badge">核验 ${esc(e.lastVerified)}</span>
      </div>

      ${e.sec.oneline ? `      <p class="panel-lead">${mdLinks(e.sec.oneline)}</p>\n` : ''}
      ${e.sec.fit ? (() => {
        // 段落以空行分隔；「不适合」段用警示色
        const paras = e.sec.fit.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
        const body = paras.map(p => {
          const isWarn = /^(\*\*)?不适合/.test(p);
          const cls = isWarn ? ' class="warn-p"' : '';
          return `        <p${cls}>${mdLinks(p)}</p>`;
        }).join('\n');
        return `      <div class="panel is-slim">
        <h2>适合与不适合</h2>
${body}
      </div>\n`;      })() : ''}

      <div class="block-head">
        <h2 class="t-h2">固定坐标系</h2>
        <p class="t-section-lead">${axisKeys.length} 个维度，与同赛道其他对象逐项可比。</p>
      </div>
      <dl class="axes">
${axesHtml}
      </dl>

      ${e.pitfalls.length ? `      <div class="panel warn">
        <h2 class="warn">头号误解</h2>
        <ul>
${e.pitfalls.map(p => `          <li>${mdLinks(p)}</li>`).join('\n')}
        </ul>
      </div>\n` : ''}

      ${priceRows.length ? `      <div class="panel is-slim">
        <h2>价格</h2>
        <table class="src">
          <tbody>
${priceRows.map(([k, v]) => `            <tr><th class="w-28">${esc(k)}</th><td>${mdLinks(v)}</td></tr>`).join('\n')}
          </tbody>
        </table>
        <p class="fine mt-3">不同币种不做折算。优惠、地区、税费与登录后报价可能变化，购买前请到官方页面确认。</p>
      </div>\n` : ''}

      ${e.sec.unknowns && /^\s*[-*]/m.test(e.sec.unknowns) ? `      <div class="panel is-slim">
        <h2>未知项清单</h2>
        <ul>
${(() => {
          /* 列表项的**缩进续行**必须并入上一项。
           * 原写法 `filter(l => /^\s*[-*]/.test(l))`只留列表行、丢掉所有续行 ——
           * 像「未知项清单」这种「一句结论 + 缩进补充条件」的写法（本次实测 google-adk
           * 命中：`- Gemini 单价…的实际费率`后面跟着缩进行
           * `（GOOGLE_GENAI_USE_ENTERPRISE 的含义已核验，费率未核验）`），
           * 那句补充就整段消失，**页面照常渲染、不报错**。
           * 判据用「有没有 `- ` 前缀」而不是「有没有缩进」——
           * 缩进续行与顶层列表项的缩进层级不一定一致（嵌套列表也会缩进）。*/
          const items = [];
          for (const raw of e.sec.unknowns.split(/\r?\n/)) {
            const li = /^\s*[-*]\s+(.*)$/.exec(raw);
            if (li) { items.push(li[1]); continue; }
            if (items.length && raw.trim()) items[items.length - 1] += ' ' + raw.trim();
          }
          return items.map(t => `          <li>${mdLinks(t)}</li>`).join('\n');
        })()}
        </ul>
      </div>\n` : ''}

      <div class="panel">
        <h2>证据来源</h2>
        <p class="t-sm">判断可回到以下一手源复核。本站核验日 ${esc(e.lastVerified)}，内容更新日 ${esc(e.lastUpdated)}。</p>
        <table class="src">
          <thead><tr><th class="w-20">类型</th><th class="w-52">名称</th><th>链接</th></tr></thead>
          <tbody>
${srcRows}
          </tbody>
        </table>
      </div>

      ${e.sec.runs ? `      <div class="panel is-slim">
        <h2>实测记录</h2>
        <p>${mdLinks(e.sec.runs)}</p>
      </div>\n` : ''}

      ${relatedHtml}

      <p class="fine mt-6">
        本页由 <a href="${SITE.repo}" target="_blank" rel="noopener" class="link-brand">ai-agent-guide</a> 数据层生成（CC BY 4.0）。
        方法论与坐标系定义见仓库内 <code>METHODOLOGY.md</code>。
      </p>
    </div>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: e.name,
    applicationCategory: 'DeveloperApplication',
    ...(e.url ? { url: e.url } : {}),
    ...(e.homepage ? { sameAs: e.homepage } : {}),
    description: plain(e.tagline || e.sec.oneline, 300),
    dateModified: e.lastVerified,
    ...(e.pricing.monthly_usd ? {
      offers: { '@type': 'Offer', price: e.pricing.monthly_usd, priceCurrency: 'USD' },
    } : {}),
  };

  return buildShell({
    current: site.navKey,
    repo: SITE.repo,
    repoLabel: 'GitHub',
    title: `${e.name} — ${site.short} | 投机取巧`,
    desc: plain(`${e.name}（${e.vendor}）：${e.tagline || e.sec.oneline}`, 150),
    body,
    jsonLd,
    canonical: `https://${site.domain}/${base}${e.id}.html`,
    assetPrefix: site.dir ? '../' : '',
  });
}

// ── 主流程 ───────────────────────────────────────────────────────────────
/* 输出布局（一站三分区）：
 *   OUT/                ← 站点根 = agent.specul.com，CNAME / robots / sitemap 都在这里
 *     index.html        ← agents 分区（17 份档案的首页 + 详情）
 *     brand.css brand.js site.css
 *     harness/index.html + 10 份详情
 *     tools/index.html   + 9 份详情
 *
 * 为什么 agents 分区落在根而不是 /agents/：
 *   它是本站默认落点（导航「Agent」指的就是它），也是三者里唯一
 *   不该让访客多点一次的。其余两个分区作为子目录，天然是「次级内容」。
 *
 * **CNAME 只写一次、只写根域名**（曾差点写成 agent.specul.com/harness/）：
 *   Pages 的自定义域名绑定只接受域名，带路径会让绑定失败。
 */
function copyBrand(dir) {
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(BRAND, path.join(dir, 'brand.css'));
  fs.copyFileSync(BRANDJS, path.join(dir, 'brand.js'));
  // 内容层样式（与 brand.css 分开：前者是站点特有结构，后者是全站设计系统）
  fs.copyFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'site.css'), path.join(dir, 'site.css'));
}

let totalErr = 0;
const summary = [];
const allPages = [];   // 汇总给站点级sitemap 用

// 先把所有分区都读一遍+ 校验，任何一个分区出错就不出站（避免半成品上线）
const loaded = [];
for (const partKey of targets) {
  const site = SITES[partKey];
  if (!site) { console.error(`未知分区: ${partKey}`); process.exit(1); }
  const { entries, errors } = loadTrack(partKey);
  const errs = validate(partKey, entries, errors);
  loaded.push({ partKey, site, entries, errs });
  totalErr += errs.length;
}

for (const { partKey, site, entries, errs } of loaded) {
  if (errs.length) {
    console.error(`\n[${partKey}] 校验失败 ${errs.length} 项，未出站：`);
    errs.forEach(e => console.error('  ✗ ' + e));
  }
}
if (totalErr) { console.error(`\n共 ${totalErr} 项校验错误，未出站。`); process.exit(1); }

if (CHECK_ONLY) {
  for (const { partKey, entries } of loaded) {
    const v = entries.filter(e => e.confidence === 'verified').length;
    summary.push(`[${partKey}] ${entries.length} 个对象（${v} verified），校验通过（未出站）`);
  }
  summary.forEach(s => console.log(s));
  process.exit(0);
}

fs.mkdirSync(OUT, { recursive: true });
copyBrand(OUT);

// CNAME：只写一次，只写根域名
fs.writeFileSync(path.join(OUT, 'CNAME'), SITE.domain + '\n', 'utf8');

// .nojekyll：让 GitHub Pages 跳过 Jekyll 处理，直接原样发布静态文件。
// 缺它时 Jekyll 会把带下划线开头或方括号的内容当 Liquid 模板解析，构建报
// "Page build failed."（2026-09-30 在 cli 站实际踩到：连续 3 次构建 errored，
//  而线上还能访问 —— 因为服务的是上一次成功的旧产物）。
fs.writeFileSync(path.join(OUT, '.nojekyll'), '', 'utf8');

for (const { partKey, site, entries } of loaded) {
  const dir = site.dir ? path.join(OUT, site.dir) : OUT;
  fs.mkdirSync(dir, { recursive: true });
  // 清旧页面（只清 .html，不动 brand 壳与 .nojekyll）
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.html'))) fs.unlinkSync(path.join(dir, f));

  const base = pfx(site);
  fs.writeFileSync(path.join(dir, 'index.html'), renderIndex(site, partKey, entries), 'utf8');
  allPages.push({ loc: `https://${SITE.domain}/${base}`, pri: partKey === 'agents' ? '1.0' : '0.9' });

  for (const e of entries) {
    fs.writeFileSync(path.join(dir, `${e.id}.html`), renderDetail(site, partKey, e), 'utf8');
    allPages.push({ loc: `https://${SITE.domain}/${base}${e.id}.html`, pri: '0.7' });
  }

  // 仓库 README（GitHub 落地页，说明这个分区是什么、数据从哪来）
  const isTools = site.owns.includes('mcp');
  const axisNames = (isTools ? [...AXES, ...MCP_AXES] : AXES).map(x => x[1]);
  const verifiedCount = entries.filter(e => e.confidence === 'verified').length;
  fs.writeFileSync(path.join(dir, 'README.md'),
`# ${SITE.name} · ${site.name}

> ${site.tagline}

**${SITE.domain}/${base}** · 独立信息项目（非厂商官方榜单）

${site.desc}

本站共 ${SITE.partitions.length} 个分区（\`${SITE.partitions.join('` / `')}\`），本 README 描述「${site.short}」这一个。

## 这个分区提供什么

- **${entries.length} 个对象**，按固定 ${axisNames.length} 个维度记录${isTools ? '（8 个通用维度 + 3 个 MCP 特有维度）' : ''}
- 每个维度都能回溯到官方一手源，附来源类型与核验日期
- **不给总分排名**——缺少跨工具的统一实测，排名会误导
- **「未知」是合法答案**——查不到就写未知并说明原因，不用推测填充

## 收录对象

| 对象 | 形态 | 厂商 | 可信度 | 核验日 |
|---|---|---|---|---|
${entries.map(e => `| [${e.name}](./${e.id}.html) | ${esc(FORM_LABEL[e.track] || FAMILY_SHORT[e.family] || e.track)} | ${esc(e.vendor)} | ${e.confidence} | ${e.lastVerified} |`).join('\n')}

## 可信度标记

| 标记 | 含义 |
|---|---|
| \`verified\` | ${axisNames.length} 个维度均有官方源支撑，核验日在 90 天内 |
| \`partial\` | 部分维度标为未知，或官方文档不可访问，或核验日超过 90 天 |
| \`stale\` | 官方已发布重大变化，本站尚未核验 |

当前 ${entries.length} 个对象中，**${verifiedCount} 个为 verified**。

## 数据来源

全部数据来自 **[speculcom/ai-agent-guide](https://github.com/speculcom/ai-agent-guide)**（CC BY 4.0），
由 \`sites/build.mjs\` 从该仓库的 Markdown + frontmatter 构建，本仓库只存产物。

发现错误或有新证据，欢迎去数据仓库提 Issue 或 PR。

## 站内分区

| 分区 | 主题 | 对象数 |
|---|---|---|
${SITE.partitions.map(k => {
    const s = SITES[k];
    const n = k === partKey ? entries.length : (loaded.find(x => x.partKey === k)?.entries.length ?? '—');
    return `| [${s.short}](/${s.dir ? s.dir + '/' : ''}) | ${s.tagline} | ${n} |`;
  }).join('\n')}

---

© 2026 Specul · 投机 · 推演
`, 'utf8');

  const v = verifiedCount;
  summary.push(`[${partKey}] ${entries.length} 个对象（${v} verified）→ ${site.dir ? site.dir + '/' : '(站点根)'}`);
}

// sitemap：一个站一份，覆盖三个分区（原先是每站一份）
fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url><loc>${p.loc}</loc><priority>${p.pri}</priority></url>`).join('\n')}
</urlset>
`, 'utf8');

// robots：允许索引
fs.writeFileSync(path.join(OUT, 'robots.txt'),
`User-agent: *
Allow: /

Sitemap: https://${SITE.domain}/sitemap.xml
`, 'utf8');

// 站点根 README：介绍整站三分区
fs.writeFileSync(path.join(OUT, 'README.md'),
`# ${SITE.name}

> ${SITE.tagline}

**${SITE.domain}** · 独立信息项目（非厂商官方榜单）

${SITE.desc}

## 三个分区，坐标系不同

| 分区 | 主题 | 对象数 | 主要坐标系 |
|---|---|---|---|
${loaded.map(({ partKey, site, entries }) => {
    const isT = site.owns.includes('mcp');
    return `| [${site.short}](${partKey === 'agents' ? './' : './' + site.dir + '/'}) | ${site.tagline} | ${entries.length} | ${isT ? '8 通用 + 3 MCP 特有' : '8 通用维度'}${site.splitBy === 'form' ? '，按形态分组' : site.splitBy === 'family' ? '，按抽象层分组' : ''} |`;
  }).join('\n')}

**为什么不给一张 33 行的总表**：三层的坐标系不同，混排会制造假的可比性。
成品 agent 与自己搭的底座都能进同一个八维坐标系，但它们解决的不是同一个问题；
MCP 工具层用的是另外三个维度（传输 / 认证 / 权限范围），八维套不上去。

## 方法

- **不给总分排名**——缺少跨工具的统一实测，排名会误导
- **「未知」是合法答案**——查不到就写未知并说明原因，不用推测填充
- **不同层不混排**——三条铁律都写在数据仓 \`METHODOLOGY.md\` 里

## 数据来源

全部数据来自 **[speculcom/ai-agent-guide](https://github.com/speculcom/ai-agent-guide)**（CC BY 4.0），
由 \`sites/build.mjs\` 构建，本仓库只存产物。

---

© 2026 Specul · 投机 · 推演
`, 'utf8');

summary.forEach(s => console.log(s));
console.log(`\n共 ${allPages.length} 个页面 → ${path.basename(OUT)}/（含 brand.css / brand.js / site.css）`);
