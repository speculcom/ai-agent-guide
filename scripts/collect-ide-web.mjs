// 采集三家闭源 IDE 的官网信息（curl 拿不到，用浏览器渲染）
import path from 'node:path';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { createRequire as _cr } from 'node:module';

const ROOT = 'C:/Users/chenhua/Desktop/specul/_data/ai-compare';
const OUT = path.join(ROOT, 'raw');
fs.mkdirSync(OUT, { recursive: true });

// 用 specul 工作区里 keel3d 的 playwright
const req = createRequire('C:/Users/chenhua/Desktop/specul/keel3d/package.json');
const { chromium } = req('playwright');

const targets = [
  { name: 'cursor', urls: ['https://cursor.com/pricing', 'https://cursor.com/docs', 'https://cursor.com/changelog'] },
  { name: 'windsurf', urls: ['https://windsurf.com/pricing', 'https://docs.windsurf.com', 'https://windsurf.com/changelog'] },
  { name: 'copilot', urls: ['https://github.com/features/copilot/plans', 'https://docs.github.com/en/copilot', 'https://github.blog/changelog/label/copilot/'] },
];

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });

for (const t of targets) {
  const merged = [];
  for (const u of t.urls) {
    const page = await ctx.newPage();
    const rec = { url: u, ok: false, title: '', text: '' };
    try {
      await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(3000);
      rec.title = await page.title();
      rec.text = await page.evaluate(() => {
        const out = [];
        const walk = (el) => {
          for (const n of el.childNodes) {
            if (n.nodeType === 3) { const s = n.textContent.trim(); if (s) out.push(s); }
            else if (n.nodeType === 1 && !['SCRIPT','STYLE','NOSCRIPT'].includes(n.tagName)) walk(n);
          }
        };
        walk(document.body);
        return out.join('\n');
      });
      rec.ok = rec.text.length > 200;
    } catch (e) {
      rec.error = String(e).slice(0, 200);
    }
    await page.close();
    merged.push(rec);
    console.log(`${t.name} | ${rec.ok ? 'OK' : 'FAIL'} | ${rec.text.length} chars | ${u}`);
  }
  fs.writeFileSync(path.join(OUT, `web-${t.name}.json`), JSON.stringify(merged, null, 2), 'utf8');
  fs.writeFileSync(path.join(OUT, `web-${t.name}.txt`),
    merged.map(r => `=== ${r.url} ===\n${r.text}`).join('\n\n'), 'utf8');
}

await browser.close();
console.log('DONE');
