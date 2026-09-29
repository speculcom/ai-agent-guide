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
  en: 'Speculation · Craft',
  short: '投机取巧',
  repo: 'https://github.com/speculcom/ai-coding-agent-atlas',
};

/** 全站导航（五项，顺序固定；各站自己那项由 current 高亮） */
export const NAV = [
  { key: 'www', href: 'https://specul.com/', zh: '首页', en: 'Home' },
  { key: 'nav', href: 'https://specul.com/nav.html', zh: '导航', en: 'Directory' },
  { key: 'keel', href: 'https://keel.specul.com/', zh: '基座', en: 'Keel' },
  { key: 'ide', href: 'https://ide.specul.com/', zh: 'IDE 图谱', en: 'IDE' },
  { key: 'cli', href: 'https://cli.specul.com/', zh: 'CLI 图谱', en: 'CLI' },
  { key: 'mcp', href: 'https://mcp.specul.com/', zh: 'MCP 图谱', en: 'MCP' },
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
          <span class="brand-name">${BRAND.short}</span>
          <span class="brand-sub" id="markSub" data-zh-sub="${BRAND.zh}" data-en-sub="${BRAND.en}">${BRAND.zh}</span>
        </span>
      </a>
      <nav class="nav-links" aria-label="站点导航">
${items}
        <span class="nav-tools">
          <button class="icon-btn" id="themeBtn" type="button" aria-label="切换明暗主题" title="切换明暗主题">☾</button>
          <button class="icon-btn" id="langBtn" type="button" aria-label="Switch language" title="Switch language">EN</button>
        </span>
      </nav>
    </div>
  </header>`;
}

/** footer —— repo 参数让图谱站链自己的数据仓库，其余站链 keel3d */
export function footer(repo = 'https://github.com/lifeidle/keel3d', repoLabel = 'GitHub') {
  const links = NAV.map((n) => {
    const label = n.key === 'nav' || n.key === 'www' ? '' : n.zh;
    return label
      ? `          <a href="${n.href}">${label}</a>`
      : `          <a href="${n.href}"><span data-zh>${n.zh}</span><span data-en>${n.en}</span></a>`;
  }).join('\n');

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
export function shell({ current, title, desc, canonical, accent, body, repo, repoLabel, jsonLd, headExtra = '', langBridge = false }) {
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
  <meta name="theme-color" content="#05080f" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%238b7cf8'/%3E%3Cstop offset='1' stop-color='%2322d3c5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='48' height='48' rx='12' fill='%2305080f'/%3E%3Cpath d='M14 32 L24 12 L34 32' fill='none' stroke='url(%23g)' stroke-width='2.4' stroke-linejoin='round'/%3E%3Ccircle cx='24' cy='27' r='2.4' fill='%2322d3c5'/%3E%3C/svg%3E" />
  <link rel="stylesheet" href="${depth()}brand.css" />
  <link rel="stylesheet" href="${depth()}site.css" />
${accent ? `  <style>:root { --accent: ${accent}; }${headExtra ? '\n' + headExtra : ''}</style>\n` : ''}${jsonLd ? `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n` : ''}</head>
<body class="brand-ambient"${accent ? ` style="--accent:${accent}"` : ''}>
  <a class="t-skip" href="#main">跳到主要内容</a>
${header(current)}
  <main id="main">
${body}
  </main>
${footer(repo, repoLabel)}
  <script src="${depth()}brand.js"></script>${BRIDGE}
</body>
</html>
`;
}

/** 相对 brand.css 的前缀：站点在子目录时用 ../ */
function depth() {
  return '';
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
