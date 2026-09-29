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
  // 回退：按本地开发布局推断
  return path.resolve(HERE, '..', '..', '_data', 'ai-compare');
}

function findOutDir(dataDir) {
  if (process.env.OUT_DIR) return path.resolve(process.env.OUT_DIR);
  // 判定依据是「脚本是否与数据仓库同级布局」，而不是「_sites 目录是否存在」——
  // 后者会误判：CI 里脚本上一级的上一级可能是任意路径，恰好存在 _sites 就会被当成本地布局。
  // 特征：脚本在 <repo>/_sites/_template/ 下时，其上溯两级是 monorepo 根，
  //       而数据仓库 <repo>/_data/ai-compare 与 monorepo 根不是同一个目录。
  const localSites = path.resolve(HERE, '..', '..', '_sites');
  const monorepoRoot = path.resolve(HERE, '..', '..');
  const isLocalLayout = dataDir === path.join(monorepoRoot, '_data', 'ai-compare');
  return isLocalLayout ? localSites : path.join(dataDir, 'dist');
}

function findBrandDir() {
  if (process.env.BRAND_DIR) return path.resolve(process.env.BRAND_DIR);
  const repoGuess = path.resolve(HERE, '..', '..', 'www.specul');
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

// 三站配置：域名、主色、定位文案
const SITES = {
  ide: {
    domain: 'ide.specul.com',
    name: 'AI 编程 IDE 图谱',
    short: 'IDE',
    accent: '#f5c542',
    tagline: 'AI 编程 IDE / 编码工具对比',
    desc: 'Cursor、Claude Code、Copilot、Windsurf、Zed、Cline、Aider、Codex 的能力边界、运行位置与价格。',
    repo: 'https://github.com/speculcom/ai-coding-agent-atlas',
  },
  cli: {
    domain: 'cli.specul.com',
    name: '终端 AI 编码工具图谱',
    short: 'CLI',
    accent: '#22d3c5',
    tagline: '终端 AI 编码工具对比',
    desc: 'Claude Code CLI、Codex CLI、Gemini CLI、OpenCode、Aider、Crush 的能力边界、Git 集成与自动化程度。',
    repo: 'https://github.com/speculcom/ai-coding-agent-atlas',
  },
  mcp: {
    domain: 'mcp.specul.com',
    name: 'MCP 服务器图谱',
    short: 'MCP',
    accent: '#8b7cf8',
    tagline: 'MCP 服务器 / 工具生态对比',
    desc: 'filesystem、git、memory、fetch、playwright、context7 等 MCP server 的权限范围、传输方式与输出可用性。',
    repo: 'https://github.com/speculcom/ai-coding-agent-atlas',
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

// ── 读取一个赛道 ───────────────────────────────────────────────────────────
function loadTrack(track) {
  const dir = path.join(DATA, 'tracks', track, 'products');
  if (!fs.existsSync(dir)) return { entries: [], errors: [`目录不存在: ${dir}`] };
  const entries = [];
  const errors = [];
  const seen = new Set();

  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.md')).sort()) {
    const abs = path.join(dir, f);
    const raw = fs.readFileSync(abs, 'utf8');
    const fm = parseFrontmatter(raw);
    const rel = `tracks/${track}/products/${f}`;
    if (!fm) { errors.push(`${rel} · frontmatter 解析失败`); continue; }

    const id = fm.id || f.replace('.md', '');
    if (f.replace('.md', '') !== id) errors.push(`${rel} · 文件名与 id 不符`);
    if (seen.has(id)) errors.push(`${rel} · id 重复: ${id}`);
    seen.add(id);
    if (fm.track !== track) errors.push(`${rel} · track 字段(${fm.track})与所在赛道(${track})不符`);

    const need = ['id','name','vendor','homepage','last_verified','confidence','lifecycle'];
    for (const k of need) if (!fm[k]) errors.push(`${rel} · 缺必填 ${k}`);

    const axes = fm.axes || {};
    // MCP 赛道另有 3 个特有维度，在 mcp: 块下（见 SCHEMA 2.4）
    const mcpBlock = fm.mcp || {};
    const mcpKeys = track === 'mcp' ? MCP_AXES.map(x => x[0]) : [];
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
    const section = (name) => {
      const m = new RegExp(`^##\\s+${name}\\s*\\r?\\n([\\s\\S]*?)(?=\\r?\\n##\\s|\\s*$)`, 'm').exec(body);
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
function validate(track, entries, errors) {
  const errs = [...errors];
  const seen = new Set();
  for (const e of entries) {
    if (seen.has(e.id)) errs.push(`${track}/${e.id} · id 重复`);
    seen.add(e.id);
    if (!e.sec.oneline) errs.push(`${track}/${e.id} · 正文缺「一句话定位」`);
    if (!e.sec.fit) errs.push(`${track}/${e.id} · 正文缺「适合与不适合」`);
    if (!e.sec.runs) errs.push(`${track}/${e.id} · 正文缺「实测记录」`);
    if (!e.sec.unknowns) errs.push(`${track}/${e.id} · 正文缺「未知项清单」`);
    if (e.confidence === 'verified' && e.lifecycle !== 'active') {
      errs.push(`${track}/${e.id} · confidence=verified 但 lifecycle=${e.lifecycle}`);
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

// 把段落里的 Markdown 链接转成 a（先转义再处理，避免注入）
function mdLinks(s, base = '') {
  let out = mdInline(s);
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, text, href) => {
    if (/^https?:/.test(href)) return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
    return `<a href="${href}">${text}</a>`;
  });
  return out;
}

function renderList(items, cls = '') {
  if (!items || !items.length) return '';
  return `<ul class="${cls}">${items.map(i => `<li>${mdInline(i)}</li>`).join('')}</ul>`;
}

// ── 品牌壳（严格照 brand.css 约定的结构，见 brand.css 头部注释）───────────
function header(site, active) {
  const nav = [
    ['https://specul.com/', '首页', 'Home'],
    ['https://specul.com/nav.html', '导航', 'Directory'],
    ['https://ide.specul.com/', 'IDE 图谱', 'IDE'],
    ['https://cli.specul.com/', 'CLI 图谱', 'CLI'],
    ['https://mcp.specul.com/', 'MCP 图谱', 'MCP'],
  ];
  return `  <header class="site-header">
    <div class="container site-bar">
      <a class="brand" href="https://specul.com/" title="Specul">
        <span class="brand-dot" aria-hidden="true"></span>
        <span class="brand-text">
          <span class="brand-name">SPECUL</span>
          <span class="brand-sub">投机 · 推演</span>
        </span>
      </a>
      <nav class="nav-links" aria-label="站点导航">
        ${nav.map(([href, zh, en], i) => `<a href="${href}"${href === `https://${site.domain}/` ? ' aria-current="page"' : ''}><span data-zh>${zh}</span><span data-en>${en}</span></a>`).join('\n        ')}
        <span class="nav-tools">
          <button class="icon-btn" id="themeBtn" type="button" aria-label="切换明暗主题">☾</button>
          <button class="icon-btn" id="langBtn" type="button" aria-label="Switch language">EN</button>
        </span>
      </nav>
    </div>
  </header>`;
}

function footer(site) {
  return `  <footer class="site-footer">
    <div class="container foot-row">
      <div class="foot-brand">
        <span class="brand-dot" aria-hidden="true"></span>
        <span class="foot-copy">© 2026 Specul · <span data-zh>投机 · 推演</span><span data-en>Speculation · Speculate</span></span>
      </div>
      <nav class="foot-links" aria-label="页脚导航">
        <a href="https://specul.com/"><span data-zh>首页</span><span data-en>Home</span></a>
        <a href="https://specul.com/nav.html"><span data-zh>导航</span><span data-en>Directory</span></a>
        <a href="https://ide.specul.com/">IDE</a>
        <a href="https://cli.specul.com/">CLI</a>
        <a href="https://mcp.specul.com/">MCP</a>
        <a href="${site.repo}" target="_blank" rel="noopener">GitHub</a>
      </nav>
      <nav class="foot-legal-links" aria-label="法律">
        <a href="https://specul.com/legal.html"><span data-zh>法律条款</span><span data-en>Legal terms</span></a>
        <a href="https://specul.com/legal.html#s6"><span data-zh>免责声明</span><span data-en>Disclaimer</span></a>
        <a href="https://specul.com/legal.html#s8"><span data-zh>隐私与本地存储</span><span data-en>Privacy</span></a>
        <a href="${site.repo}/blob/main/LICENSE"><span data-zh>许可</span><span data-en>License</span></a>
      </nav>
    </div>
  </footer>`;
}

function page({ site, title, desc, body, jsonLd, canonical }) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${esc(site.name)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <link rel="stylesheet" href="./brand.css" />
  <style>
    :root { --accent: ${site.accent}; }
${SITE_CSS}
  </style>
${jsonLd ? `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n` : ''}</head>
<body class="brand-ambient" style="--accent:${site.accent}">
  <a class="skip" href="#main">跳到主要内容</a>
${header(site, site.domain)}
  <main id="main">
${body}
  </main>
${footer(site)}
  <script src="./brand.js"></script>
</body>
</html>
`;
}

const SITE_CSS = `    /* ---- 内容层（只用 --accent，不用品牌基础色）---- */
    .hero { padding: 64px 0 40px; border-bottom: 1px solid var(--line); }
    .kicker { font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
    h1 { font-size: clamp(30px, 5vw, 46px); font-weight: 800; line-height: 1.14; letter-spacing: -.02em; margin: 0 0 14px; }
    .lede { color: var(--dim); font-size: 16px; line-height: 1.75; max-width: 62ch; margin: 0; }
    .hero-meta { display: flex; flex-wrap: wrap; gap: 10px 18px; margin-top: 22px; font-size: 12px; color: var(--dim); }
    .hero-meta b { color: var(--accent); font-weight: 600; }

    .section { padding: 46px 0; border-bottom: 1px solid var(--line); }
    .section > h2 { font-size: 24px; font-weight: 700; margin: 0 0 6px; letter-spacing: -.01em; }
    .section > .section-desc { color: var(--dim); font-size: 14px; line-height: 1.7; margin: 0 0 26px; max-width: 70ch; }

    /* 状态声明带：诚实边界必须显眼 */
    .status-band { background: color-mix(in srgb, var(--accent) 5%, transparent); }
    .status-inner { display: flex; gap: 16px; align-items: flex-start; max-width: 78ch; }
    .status-mark {
      width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0; margin-top: 2px;
      display: grid; place-items: center; font-weight: 700; font-size: 15px;
      color: var(--accent);
      border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
      background: color-mix(in srgb, var(--accent) 12%, transparent);
    }
    .status-inner h2 { font-size: 17px; font-weight: 700; margin: 0 0 8px; }
    .status-inner p { font-size: 14px; line-height: 1.75; color: var(--ink); margin: 0 0 8px; }
    .status-inner p:last-child { margin-bottom: 0; }

    .grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
    .card {
      background: var(--panel); border: 1px solid var(--line);
      border-radius: 12px; padding: 20px; min-width: 0;
      display: flex; flex-direction: column; gap: 12px;
    }
    .card:hover { border-color: var(--line-strong); }
    .card-top { display: flex; align-items: flex-start; gap: 11px; }
    .mark {
      width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
      display: grid; place-items: center; font-weight: 700; font-size: 14px;
      background: color-mix(in srgb, var(--card-accent, var(--accent)) 16%, transparent);
      color: var(--card-accent, var(--accent));
      border: 1px solid color-mix(in srgb, var(--card-accent, var(--accent)) 34%, transparent);
    }
    .card h3 { font-size: 18px; font-weight: 700; margin: 0 0 2px; }
    .card .vendor { font-size: 11px; color: var(--dim); letter-spacing: .08em; text-transform: uppercase; }
    .card .tagline { font-size: 14px; line-height: 1.6; color: var(--ink); }
    .card .summary { font-size: 13px; line-height: 1.65; color: var(--dim); }

    .tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .tag {
      font-size: 10px; padding: 3px 8px; border-radius: 20px;
      border: 1px solid var(--line); color: var(--dim);
    }
    .tag.on { color: var(--accent); border-color: color-mix(in srgb, var(--accent) 42%, transparent); }

    .conf {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 11px; color: var(--dim); margin-top: auto; padding-top: 4px;
    }
    .conf .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--dim); }
    .conf.verified .dot { background: #34d399; }
    .conf.partial .dot { background: var(--accent); }
    .conf.stale .dot { background: #f87171; }

    .more { font-size: 12px; color: var(--accent); text-decoration: none; margin-top: 10px; }
    .more:hover { text-decoration: underline; }

    /* 对比表 */
    .table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 12px; background: var(--panel); }
    table.cmp { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 640px; }
    table.cmp th, table.cmp td { text-align: left; padding: 12px 14px; border-bottom: 1px solid var(--line); vertical-align: top; }
    table.cmp thead th { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--dim); font-weight: 500; background: rgba(255,255,255,.02); }
    table.cmp tbody tr:last-child td { border-bottom: 0; }
    table.cmp tbody tr:hover { background: rgba(255,255,255,.025); }
    table.cmp td a { color: var(--ink); text-decoration: none; display: flex; align-items: center; gap: 9px; white-space: nowrap; }
    table.cmp td a:hover { color: var(--accent); }
    .td-mark {
      width: 24px; height: 24px; border-radius: 6px; flex-shrink: 0;
      display: grid; place-items: center; font-size: 11px; font-weight: 700;
      background: color-mix(in srgb, var(--card-accent, var(--accent)) 16%, transparent);
      color: var(--card-accent, var(--accent));
      border: 1px solid color-mix(in srgb, var(--card-accent, var(--accent)) 34%, transparent);
    }
    .td-vendor, .td-date { color: var(--dim); font-size: 12px; white-space: nowrap; }
    .td-fit { color: var(--dim); font-size: 12px; line-height: 1.6; min-width: 200px; }
    .td-conf { font-size: 11px; padding: 2px 8px; border-radius: 4px; border: 1px solid var(--line); color: var(--dim); white-space: nowrap; }
    .td-conf.verified { color: #34d399; border-color: color-mix(in srgb, #34d399 40%, transparent); }
    .td-conf.partial { color: var(--accent); border-color: color-mix(in srgb, var(--accent) 40%, transparent); }
    .td-conf.stale { color: #f87171; border-color: color-mix(in srgb, #f87171 40%, transparent); }

    /* 详情页 */
    .detail { padding: 44px 0 60px; }
    .back { font-size: 12px; color: var(--dim); text-decoration: none; display: inline-block; margin-bottom: 20px; }
    .detail-head { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px; }
    .detail-head .mark { width: 46px; height: 46px; font-size: 18px; border-radius: 11px; }
    .detail-head h1 { font-size: clamp(26px, 4vw, 38px); margin: 0 0 4px; }
    .badges { display: flex; flex-wrap: wrap; gap: 7px; margin: 16px 0 26px; }
    .badge {
      font-size: 11px; padding: 4px 10px; border-radius: 6px;
      border: 1px solid var(--line); color: var(--dim);
    }
    .badge.accent { color: var(--accent); border-color: color-mix(in srgb, var(--accent) 40%, transparent); }

    .axis { padding: 18px 0; border-bottom: 1px solid var(--line); }
    .axis:last-of-type { border-bottom: 0; }
    .axis dt { font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
    .axis dd { margin: 0; font-size: 14px; line-height: 1.78; color: var(--ink); }
    .axis dd code { background: var(--panel-solid); padding: 1px 5px; border-radius: 4px; font-size: 12px; }

    .panel { margin: 28px 0; padding: 20px 22px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel); }
    .panel h2 { font-size: 16px; font-weight: 700; margin: 0 0 12px; }
    .panel.warn { border-color: color-mix(in srgb, var(--accent) 40%, transparent); }
    .panel h2.warn { color: var(--accent); }
    .panel p { font-size: 14px; line-height: 1.75; margin: 0 0 10px; }
    .panel p:last-child { margin-bottom: 0; }
    .panel p.warn-p { color: var(--accent); }
    .panel ul { margin: 0; padding-left: 20px; }
    .panel li { font-size: 14px; line-height: 1.72; margin-bottom: 7px; }
    .panel li::marker { color: var(--accent); }

    table.src { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
    table.src th, table.src td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
    table.src th { color: var(--dim); font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; }
    table.src td a { color: var(--accent); word-break: break-all; }

    .unknown { color: var(--accent); font-weight: 500; }

    .skip {
      position: absolute; left: -9999px; top: 8px; z-index: 100;
      background: var(--accent); color: #0b0e12; padding: 10px 14px; border-radius: 6px;
    }
    .skip:focus { left: 12px; }

    @media (max-width: 640px) {
      .hero { padding: 40px 0 30px; }
      .grid { grid-template-columns: 1fr; }
      .section { padding: 34px 0; }
      .detail { padding: 28px 0 44px; }
    }
`;

// ── 渲染 ─────────────────────────────────────────────────────────────────
function renderIndex(site, track, entries) {
  const axisKeys = track === 'mcp' ? [...AXES, ...MCP_AXES] : AXES;
  const axisNames = axisKeys.map(x => x[1]);
  const verified = entries.filter(e => e.confidence === 'verified').length;

  const cards = entries.map(e => {
    const marks = [...new Set((e.tags || []).slice(0, 4))];
    return `        <article class="card" style="--card-accent:${esc(e.accent || site.accent)}">
          <div class="card-top">
            <div class="mark" aria-hidden="true">${esc(e.mark || e.name.slice(0,2))}</div>
            <div>
              <h3><a href="./${esc(e.id)}.html" style="color:inherit;text-decoration:none">${esc(e.name)}</a></h3>
              <div class="vendor">${esc(e.vendor)}</div>
            </div>
          </div>
          <p class="tagline">${mdInline((e.tagline || e.sec.oneline).split('\n')[0].slice(0, 80))}</p>
          <div class="tags">${marks.map(t => `<span class="tag on">${esc(t)}</span>`).join('')}</div>
          <div class="conf ${esc(e.confidence)}"><span class="dot" aria-hidden="true"></span>${esc(e.confidence)} · 核验 ${esc(e.lastVerified)}</div>
          <a class="more" href="./${esc(e.id)}.html">${axisNames.length} 个维度 →</a>
        </article>`;
  }).join('\n');

  const body = `    <section class="hero">
      <div class="container">
        <p class="kicker">${esc(site.short)} · AI coding agent atlas</p>
        <h1>${esc(site.name)}</h1>
        <p class="lede">${esc(site.desc)}</p>
        <div class="hero-meta">
          <span><b>${entries.length}</b> 个对象</span>
          <span><b>${axisNames.length}</b> 个固定维度</span>
          <span><b>${verified}</b> 个已完整核验</span>
          <span>最后核验 <b>2026-09-28</b></span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>全部对象</h2>
        <p class="section-desc">按统一坐标系排列。点开任一对象可看到 ${axisNames.join(' / ')} 的完整记录、证据链接与未知项清单。</p>
        <div class="grid">
${cards}
        </div>
      </div>
    </section>

    <section class="section status-band">
      <div class="container">
        <div class="status-inner">
          <div class="status-mark" aria-hidden="true">!</div>
          <div>
            <h2>本站目前是「核验快照」，还没有实测数据</h2>
            <p>
              ${track === 'mcp'
                ? '下面每个 server 的权限范围、传输方式与工具清单都能回到官方 README 核对，但<strong>我们还没有在真实客户端里跑过它们</strong>。'
                : '下面每一个字段都能回到官方原文核对，但<strong>我们还没有在同一批任务上跑过这些工具</strong>。'}
              实测协议已经写好（统一任务、统一验收、记录人工介入与返工次数），任务清单也已就绪，
              <strong>尚未执行</strong>。
            </p>
            <p style="color:var(--dim);font-size:13px">
              ${track === 'mcp'
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
          所有对象在同一坐标系下被描述${track === 'mcp' ? '（MCP 服务器另有 3 个特有维度）' : ''}。
          点开任一对象，每一格下面都有官方源链接与核验日期——不认同可以自己回去查。
        </p>
        <div class="panel">
          <dl style="margin:0;display:grid;gap:0">
${axisKeys.map(([k, label]) => `            <div style="padding:12px 0;border-bottom:1px solid var(--line)">
              <dt style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:4px">${esc(label)}</dt>
              <dd style="margin:0;font-size:13px;color:var(--dim);line-height:1.7">${esc(AXIS_DESC[k] || '')}</dd>
            </div>`).join('\n')}
          </dl>
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
                <th>对象</th><th>厂商</th><th>适合</th><th>核验日</th><th>状态</th>
              </tr>
            </thead>
            <tbody>
${entries.map(e => `              <tr>
                <td><a href="./${esc(e.id)}.html"><span class="td-mark" style="--card-accent:${esc(e.accent || site.accent)}">${esc(e.mark || e.name.slice(0, 2))}</span>${esc(e.name)}</a></td>
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
            <li><strong>不同层级不混排。</strong>面向使用者的产品（IDE / CLI）与面向开发者的框架（MCP server）分开两个站，各按自己的坐标系。</li>
          </ul>
        </div>
        <div class="panel">
          <h2>可信度标记怎么读</h2>
          <p style="color:var(--dim);font-size:13px;margin-bottom:12px">详情页与上表都带 <code>confidence</code>，它反映本站数据的完整度，不是对产品的评价。</p>
          <table class="src" style="margin:0">
            <tbody>
              <tr><th style="width:90px"><span class="td-conf verified">verified</span></th><td>${axisNames.length} 个维度均有官方源支撑，且核验日在 90 天内</td></tr>
              <tr><th><span class="td-conf partial">partial</span></th><td>部分维度标为未知，或官方文档不可访问，或核验日超过 90 天</td></tr>
              <tr><th><span class="td-conf stale">stale</span></th><td>官方已发布重大变化，本站尚未核验</td></tr>
            </tbody>
          </table>
        </div>
        <div class="panel">
          <h2>数据来源与复核方式</h2>
          <p>全部数据来自开源仓库 <a href="${site.repo}" target="_blank" rel="noopener" style="color:var(--accent)">speculcom/ai-coding-agent-atlas</a>（CC BY 4.0）。</p>
          <p>每个条目都是纯 Markdown + frontmatter，含 8 个维度、证据链接、核验日与可信度标记。仓库内含：</p>
          <ul>
            <li><code>METHODOLOGY.md</code> —— 方法论总纲与四条核心规则</li>
            <li><code>axes/</code> —— 每个维度的定义与判定标准（含正反例）</li>
            <li><code>SCHEMA.md</code> —— 数据格式规范与构建校验规则</li>
            <li><code>tracks/*/tasks/_protocol.md</code> —— 实测协议（<strong>尚未执行</strong>，故本站暂无实测结论）</li>
          </ul>
          <p style="color:var(--dim);font-size:13px">发现错误或有新证据，欢迎提 Issue 或 PR——每条修正都会注明依据与影响范围。</p>
        </div>
      </div>
    </section>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: site.name,
    description: site.desc,
    url: `https://${site.domain}/`,
    isPartOf: { '@type': 'WebSite', name: 'Specul', url: 'https://specul.com/' },
    about: entries.map(e => ({
      '@type': 'SoftwareApplication',
      name: e.name,
      applicationCategory: 'DeveloperApplication',
      ...(e.url ? { url: e.url } : {}),
    })),
  };

  return page({
    site,
    title: `${site.name} — ${site.tagline} | Specul`,
    desc: site.desc,
    body,
    jsonLd,
    canonical: `https://${site.domain}/`,
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

function renderDetail(site, track, e) {
  // 8 维度读 axes 块；MCP 特有 3 维度读 mcp 块
  const axisKeys = AXES.map(([k, label]) => ({ k, label, v: e.axes[k] }));
  if (track === 'mcp') {
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

  const body = `    <div class="container detail">
      <a class="back" href="./">← ${esc(site.short)} 图谱</a>

      <div class="detail-head">
        <div class="mark" style="--card-accent:${esc(e.accent || site.accent)}" aria-hidden="true">${esc(e.mark || e.name.slice(0,2))}</div>
        <div>
          <h1>${esc(e.name)}</h1>
          <div class="vendor" style="font-size:12px;color:var(--dim);letter-spacing:.08em;text-transform:uppercase">${esc(e.vendor)}</div>
        </div>
      </div>

      <div class="badges">
        ${(e.tags || []).map(t => `<span class="tag on">${esc(t)}</span>`).join('\n        ')}
        <span class="badge accent">${esc(e.confidence)}</span>
        <span class="badge">lifecycle: ${esc(e.lifecycle)}</span>
        <span class="badge">核验 ${esc(e.lastVerified)}</span>
      </div>

      ${e.sec.oneline ? `      <div class="panel"><p style="margin:0;font-size:15px;line-height:1.75">${mdLinks(e.sec.oneline)}</p></div>\n` : ''}
      ${e.sec.fit ? (() => {
        // 段落以空行分隔；「不适合」段用警示色
        const paras = e.sec.fit.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
        const body = paras.map(p => {
          const isWarn = /^(\*\*)?不适合/.test(p);
          const cls = isWarn ? ' class="warn-p"' : '';
          return `        <p${cls}>${mdLinks(p)}</p>`;
        }).join('\n');
        return `      <div class="panel">
        <h2>适合与不适合</h2>
${body}
      </div>\n`;
      })() : ''}

      <h2 style="font-size:18px;font-weight:700;margin:34px 0 4px">固定坐标系</h2>
      <p style="color:var(--dim);font-size:13px;margin:0 0 10px">${axisKeys.length} 个维度，与同赛道其他对象逐项可比。</p>
      <dl style="margin:0">
${axesHtml}
      </dl>

      ${e.pitfalls.length ? `      <div class="panel warn">
        <h2 class="warn">头号误解</h2>
        <ul>
${e.pitfalls.map(p => `          <li>${mdLinks(p)}</li>`).join('\n')}
        </ul>
      </div>\n` : ''}

      ${priceRows.length ? `      <div class="panel">
        <h2>价格</h2>
        <table class="src">
          <tbody>
${priceRows.map(([k, v]) => `            <tr><th style="width:110px">${esc(k)}</th><td>${mdLinks(v)}</td></tr>`).join('\n')}
          </tbody>
        </table>
        <p style="margin-top:12px;font-size:12px;color:var(--dim)">不同币种不做折算。优惠、地区、税费与登录后报价可能变化，购买前请到官方页面确认。</p>
      </div>\n` : ''}

      ${e.sec.unknowns && /^\s*[-*]/m.test(e.sec.unknowns) ? `      <div class="panel">
        <h2>未知项清单</h2>
        <ul>
${e.sec.unknowns.split('\n').filter(l => /^\s*[-*]/.test(l)).map(l => `          <li>${mdLinks(l.replace(/^\s*[-*]\s*/, ''))}</li>`).join('\n')}
        </ul>
      </div>\n` : ''}

      <div class="panel">
        <h2>证据来源</h2>
        <p style="color:var(--dim);font-size:13px">判断可回到以下一手源复核。本站核验日 ${esc(e.lastVerified)}，内容更新日 ${esc(e.lastUpdated)}。</p>
        <table class="src">
          <thead><tr><th style="width:80px">类型</th><th style="width:200px">名称</th><th>链接</th></tr></thead>
          <tbody>
${srcRows}
          </tbody>
        </table>
      </div>

      ${e.sec.runs ? `      <div class="panel">
        <h2>实测记录</h2>
        <p>${mdLinks(e.sec.runs)}</p>
      </div>\n` : ''}

      <p style="margin-top:32px;font-size:12px;color:var(--dim);line-height:1.7">
        本页由 <a href="${site.repo}" target="_blank" rel="noopener" style="color:var(--accent)">ai-coding-agent-atlas</a> 数据层生成（CC BY 4.0）。
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

  return page({
    site,
    title: `${e.name} — ${site.short} 图谱 | Specul`,
    desc: plain(`${e.name}（${e.vendor}）：${e.tagline || e.sec.oneline}`, 150),
    body,
    jsonLd,
    canonical: `https://${site.domain}/${e.id}.html`,
  });
}

// ── 主流程 ───────────────────────────────────────────────────────────────
// 品牌壳复制到每个站目录。
// 关键：三个站是**三个独立仓库**，各自根目录就是站点根，
// 所以 brand.css / brand.js 必须在每站目录内，页面才能用 ./brand.css 引用到。
function copyBrand(track) {
  const dir = track ? path.join(OUT, track) : OUT;
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(BRAND, path.join(dir, 'brand.css'));
  fs.copyFileSync(BRANDJS, path.join(dir, 'brand.js'));
}

let totalErr = 0;
const summary = [];

for (const track of targets) {
  const site = SITES[track];
  if (!site) { console.error(`未知赛道: ${track}`); process.exit(1); }

  const { entries, errors } = loadTrack(track);
  const errs = validate(track, entries, errors);

  if (errs.length) {
    console.error(`\n[${track}] 校验失败 ${errs.length} 项，未出站：`);
    errs.forEach(e => console.error('  ✗ ' + e));
    totalErr += errs.length;
    continue;
  }
  if (CHECK_ONLY) {
    summary.push(`[${track}] ${entries.length} 个对象，校验通过（未出站）`);
    continue;
  }

  const dir = path.join(OUT, track);
  fs.mkdirSync(dir, { recursive: true });
  // 清旧页面
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.html'))) fs.unlinkSync(path.join(dir, f));

  fs.writeFileSync(path.join(dir, 'index.html'), renderIndex(site, track, entries), 'utf8');
  for (const e of entries) {
    fs.writeFileSync(path.join(dir, `${e.id}.html`), renderDetail(site, track, e), 'utf8');
  }

  // CNAME：Pages 绑自定义域名必需（见 keel 仓库同款做法）
  fs.writeFileSync(path.join(dir, 'CNAME'), site.domain + '\n', 'utf8');

  // sitemap：三个站互链，便于搜索引擎发现同族内容
  const pages = [
    { loc: `https://${site.domain}/`, pri: '1.0' },
    ...entries.map(e => ({ loc: `https://${site.domain}/${e.id}.html`, pri: '0.7' })),
  ];
  fs.writeFileSync(path.join(dir, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>${p.loc}</loc><priority>${p.pri}</priority></url>`).join('\n')}
</urlset>
`, 'utf8');

  // robots：允许索引，只禁掉构建产物目录
  fs.writeFileSync(path.join(dir, 'robots.txt'),
`User-agent: *
Allow: /

Sitemap: https://${site.domain}/sitemap.xml
`, 'utf8');

  // 仓库 README（GitHub 落地页，说明这个站是什么、数据从哪来）
  const axisNames = (track === 'mcp' ? [...AXES, ...MCP_AXES] : AXES).map(x => x[1]);
  const verifiedCount = entries.filter(e => e.confidence === 'verified').length;
  fs.writeFileSync(path.join(dir, 'README.md'),
`# ${site.name}

> ${site.tagline}

**${site.domain}** · 独立信息项目（非厂商官方榜单）

${site.desc}

## 这个站提供什么

- **${entries.length} 个对象**，按固定 ${axisNames.length} 个维度记录${track === 'mcp' ? '（8 个通用维度 + 3 个 MCP 特有维度）' : ''}
- 每个维度都能回溯到官方一手源，附来源类型与核验日期
- **不给总分排名**——缺少跨工具的统一实测，排名会误导
- **「未知」是合法答案**——查不到就写未知并说明原因，不用推测填充

## 收录对象

${entries.map(e => `| [${e.name}](./${e.id}.html) | ${e.vendor} | ${e.confidence} | ${e.lastVerified} |`).join('\n')}

## 可信度标记

| 标记 | 含义 |
|---|---|
| \`verified\` | ${axisNames.length} 个维度均有官方源支撑，核验日在 90 天内 |
| \`partial\` | 部分维度标为未知，或官方文档不可访问，或核验日超过 90 天 |
| \`stale\` | 官方已发布重大变化，本站尚未核验 |

当前 ${entries.length} 个对象中，**${verifiedCount} 个为 verified**。

## 数据来源

全部数据来自 **[speculcom/ai-coding-agent-atlas](https://github.com/speculcom/ai-coding-agent-atlas)**（CC BY 4.0），
由 \`build.mjs\` 从该仓库的 Markdown + frontmatter 构建，本仓库只存产物。

发现错误或有新证据，欢迎去数据仓库提 Issue 或 PR。

## 站点关系

| 站点 | 主题 |
|---|---|
| [ide.specul.com](https://ide.specul.com/) | AI 编程 IDE / 编码工具 |
| [cli.specul.com](https://cli.specul.com/) | 终端 AI 编码工具 |
| [mcp.specul.com](https://mcp.specul.com/) | MCP 服务器 / 工具生态 |
| [specul.com](https://specul.com/) | 品牌站 |

---

© 2026 Specul · 投机 · 推演
`, 'utf8');

  const v = entries.filter(e => e.confidence === 'verified').length;
  // 品牌壳必须在本站内（三站是三个独立仓库）
  copyBrand(track);
  summary.push(`[${track}] ${entries.length} 个对象（${v} verified）→ _sites/${track}/`);
}

summary.forEach(s => console.log(s));
if (totalErr) { console.error(`\n共 ${totalErr} 个错误`); process.exit(1); }
if (!CHECK_ONLY) console.log('\n✅ 构建完成（brand.css / brand.js 已同步到各站目录）');
