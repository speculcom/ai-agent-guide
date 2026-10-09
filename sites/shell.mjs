// ============================================================================
// 统一站点骨架：header / footer / skip-link 的唯一生成处
// ----------------------------------------------------------------------------
// 为什么要有这个：五个站的导航项、页脚署名、法律链接曾是各写一份，
// 结果 www 只有 3 项导航、其余站 6 项；品牌署名有三种格式。
// 现在骨架从这一份生成，任何站的导航与页脚都不可能再分叉。
//
// 用法（build 脚本里）：
//   import { shell, HEAD, BODY_START, BODY_END } from './shell.mjs';
//   const html = shell(site, `…页面主体…`);
// ============================================================================

/** 品牌唯一真相源（改这里等于改全站） */
export const BRAND = {
  zh: '投机取巧',
  en: 'Speculative Speculation',
  short: '投机取巧',
  repo: 'https://github.com/speculcom/ai-coding-agent-atlas',
};

/** 全站导航（五项，顺序固定；各站自己那项由 current 高亮）
 *  顺序依据 `_plan/v4-三站架构.md` §2（唯一真相源）：
 *  首页 · 学 AI · Agent · 本地模型 · 导航
 *  导航放在末位：它是「去别的站」的兜底出口，不是内容层。
 *  2026-10-02 从八项改来：原IDE/CLI/MCP/Harness 四项合成 Agent 一个站，
 *  「规划中」keel 已从导航移除（站还活着，只是不再作为导航项）。 */
export const NAV = [
  { key: 'www', href: 'https://specul.com/', zh: '首页', en: 'Home' },
  { key: 'learn', href: 'https://learn.specul.com/', zh: '学 AI', en: 'Learn' },
  { key: 'agent', href: 'https://agent.specul.com/', zh: 'Agent', en: 'Agent' },
  { key: 'models', href: 'https://models.specul.com/', zh: '本地模型', en: 'Models' },
  // 2026-10-05 加「AI 做游戏」（共 6 项）—— ⚠ 本文件是 _sites/_template/shell.mjs 的**分叉副本**，
  //   改导航必须两处都改，否则 agent 站会少一项（今天已踩：只改 template，agent 站仍是 5 项）。
  { key: 'vg', href: 'https://vg.specul.com/', zh: 'AI 做游戏', en: 'Vibe Gaming' },
  { key: 'nav', href: 'https://nav.specul.com/', zh: '导航', en: 'Directory' },
];

/** header —— current 为当前站的 key */
export function header(current) {
  const items = NAV.map((n) => {
    const cur = n.key === current ? ' aria-current="page"' : '';
    return `        <a href="${n.href}"${cur}><span data-zh>${n.zh}</span><span data-en>${n.en}</span></a>`;
  }).join('\n');

  return `  <header class="site-header">
    <div class="container site-bar">
      <a class="brand" href="https://specul.com/" title="${BRAND.zh}">
        <span class="brand-dot" aria-hidden="true"></span>
        <span class="brand-text">
          <span class="brand-name" id="markName" data-zh-name="${BRAND.zh}" data-en-name="${BRAND.en}">${BRAND.zh}</span>
        </span>
      </a>
      <nav class="nav-links" aria-label="站点导航">
${items}
        <span class="nav-tools">
          <button class="icon-btn" id="themeBtn" type="button" aria-label="切换明暗主题" title="切换明暗主题">☾</button>
          <button class="icon-btn" id="langBtn" type="button" aria-label="Switch language" title="Switch language">EN</button>
        </span>
      </nav>
      <!-- B6（2026-10-09）：与共享 shell 同步加的移动端导航入口。
           ⚠ 本文件是 agent 站**自己的** shell 副本（它多一层分区切换），
             所以每次改共享 shell 的骨架，这里也要跟一次 —— 这是双份实现固有的代价。
             样式与行为都在共享 brand.css / brand.js 里，这里只出标记。 -->
      <button class="nav-burger" type="button" aria-label="打开菜单" aria-expanded="false" aria-controls="navDrawer">
        <i></i><i></i><i></i>
      </button>
    </div>
  </header>
${drawer(current)}`;
}

/** B6：站点导航抽屉（与共享 shell 同一份内容） */
export function drawer(current) {
  const items = NAV.map((n) => {
    const cur = n.key === current ? ' aria-current="page"' : '';
    return `      <a href="${n.href}"${cur}><span><span data-zh>${n.zh}</span><span data-en>${n.en}</span></span><span class="ar" aria-hidden="true">→</span></a>`;
  }).join('\n');
  return `  <div class="nav-scrim"></div>
  <aside class="nav-drawer" id="navDrawer" aria-hidden="true" aria-label="站点导航">
    <div class="nav-drawer-h">
      <span class="brand-name"><span data-zh>${BRAND.zh}</span><span data-en>${BRAND.en}</span></span>
      <button class="nav-dclose" type="button" aria-label="关闭">×</button>
    </div>
    <nav class="nav-drawer-list">
${items}
    </nav>
    <div class="nav-drawer-foot">
      <p><span data-zh>6 个站，各管一件事</span><span data-en>Six sites, one job each</span></p>
      <nav><a href="https://specul.com/legal.html"><span data-zh>法律条款</span><span data-en>Legal terms</span></a></nav>
    </div>
  </aside>`;
}

/** footer —— repo 参数让图谱站链自己的数据仓库（默认图谱仓库，不再链 keel3d） */
export function footer(repo = 'https://github.com/speculcom/ai-coding-agent-atlas', repoLabel = 'GitHub') {
  // 2026-10-04 修：与 _sites/_template/shell.mjs 同一个问题 ——
  // 原先对 nav / www 特殊处理，输出纯中文 `${n.zh}`（无 data-en），
  // 结果英文态的页脚露出「学 AI」「本地模型」等中文（实测 2 处/页 × 42 页）。
  // 现在统一走双节点。**两个 shell 都要改** —— agent 用的是这个文件，不是模板。
  const links = NAV.map((n) =>
    `          <a href="${n.href}"><span data-zh>${n.zh}</span><span data-en>${n.en}</span></a>`
  ).join('\n');

  return `  <footer class="site-footer">
    <div class="container foot-row">
      <div class="foot-brand">
        <span class="brand-dot" aria-hidden="true"></span>
        <span class="foot-copy">© 2026 ${BRAND.zh} · <span data-zh>Specul</span><span data-en>Specul</span></span>
      </div>
      <nav class="foot-links" aria-label="页脚导航">
${links}
          <a href="${repo}" target="_blank" rel="noopener">${repoLabel}</a>
      </nav>
      <nav class="foot-legal-links" aria-label="法律">
        <a href="https://specul.com/legal.html"><span data-zh>法律条款</span><span data-en>Legal terms</span></a>
        <a href="https://specul.com/legal.html#s6"><span data-zh>免责声明</span><span data-en>Disclaimer</span></a>
        <a href="https://specul.com/legal.html#s8"><span data-zh>隐私与本地存储</span><span data-en>Privacy</span></a>
      </nav>
    </div>
  </footer>`;
}

/** 完整页面外壳 */
export function shell({ current, title, desc, canonical, accent, body, repo, repoLabel, jsonLd, headExtra = '', langBridge = false, assetPrefix = '' }) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${esc(title.split(' — ')[0] || '投机取巧')}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta name="theme-color" content="#16121f" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%238b7cf8'/%3E%3Cstop offset='1' stop-color='%2322d3c5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='48' height='48' rx='12' fill='%2305080f'/%3E%3Cpath d='M14 32 L24 12 L34 32' fill='none' stroke='url(%23g)' stroke-width='2.4' stroke-linejoin='round'/%3E%3Ccircle cx='24' cy='27' r='2.4' fill='%2322d3c5'/%3E%3C/svg%3E" />
  <link rel="stylesheet" href="${depth(assetPrefix)}brand.css" />
  <link rel="stylesheet" href="${depth(assetPrefix)}site.css" />
${accent ? `  <style>:root { --accent: ${accent}; }${headExtra ? '\n' + headExtra : ''}</style>\n` : ''}${jsonLd ? `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n` : ''}</head>
<body class="brand-ambient"${accent ? ` style="--accent:${accent}"` : ''}>
  <a class="t-skip" href="#main"><span data-zh>跳到主要内容</span><span data-en>Skip to main content</span></a>
${header(current)}
  <main id="main">
${body}
  </main>
${footer(repo, repoLabel)}
  <script src="${depth(assetPrefix)}brand.js"></script>${BRIDGE}
</body>
</html>
`;
}

/**
 * 相对 brand.css 的前缀：站点在子目录时用 ../。
 * 全站大多数站点都部署在域名根目录，所以默认空串。
 * 只有当页面被放在子目录（如 models.specul.com/series/gemma-4/）时，
 * 调用方需传 assetPrefix: '../'，否则子页会 404 掉 brand.css / site.css / brand.js。
 */
function depth(assetPrefix) {
  return assetPrefix || '';
}

/** 语言桥接：brand.js 只切 <html lang>，而 data-zh/data-en 显隐需要 html[data-lang] */
export const BRIDGE = `
  <script>
    (function () {
      var root = document.documentElement;
      function sync() { root.setAttribute('data-lang', root.lang === 'en' ? 'en' : 'zh'); }
      new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['lang'] });
      sync();
    })();
  </script>`;

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
