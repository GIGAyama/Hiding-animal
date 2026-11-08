#!/usr/bin/env node
/* =====================================================================
 * tools/build-credits.mjs — 写真の 出どころの ページを 組み立てる
 * =====================================================================
 * 使い方:
 *   node tools/build-credits.mjs            credits.html を 書く
 *   node tools/build-credits.mjs --check    コミットされている物と くらべる
 *
 * ── なぜ 機械で 作るのか ──────────────────────────────
 *
 * CC BY / CC BY-SA は「作者と ライセンスを 出す」のが 条件で、
 * 出さなければ ただの 無断転載に なる。73 枚を 手で 書きうつすと、
 * 写真を 1 枚 差しかえた ときに 書きかえ忘れが 出る。
 * **data/animals.js の photo を 唯一の 出どころに して、ここから 作る。**
 *
 * ⚠️ 1 枚でも 作者か ライセンスか もとの ページが 欠けて いたら、
 *    ページを 作らずに 落とす。「空のまま 出す」ほうへ 倒れると、
 *    条件を 満たさない まま 公開されて しまう。
 * ===================================================================== */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { loadWindowFile } from './check-data.mjs';

const ROOT = new URL('..', import.meta.url);

/* 作者を 書かなくて よい もの（権利を はなした もの）。
   それ以外は 作者が 必ず 要る。check-data.mjs と そろえる。 */
const NO_ATTRIBUTION_NEEDED = ['cc0', 'public domain', 'pd'];

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

export function creditRows(DATA) {
  const placeLabel = new Map((DATA.places || []).map((p) => [p.key, p.label]));
  const rows = [];
  const bad = [];
  for (const a of DATA.animals || []) {
    const p = a.photo || {};
    const lic = String(p.license || '').toLowerCase();
    if (!p.file) bad.push(`${a.id}: 写真が ありません`);
    if (!p.license) bad.push(`${a.id}: ライセンスが ありません`);
    if (!p.source) bad.push(`${a.id}: もとの ページが ありません`);
    if (p.license && !NO_ATTRIBUTION_NEEDED.some((k) => lic.startsWith(k)) && !p.by) {
      bad.push(`${a.id}: ${p.license} は 作者が 必ず 要ります`);
    }
    rows.push({
      name: a.name, place: placeLabel.get(a.place) || a.place,
      by: p.by || '', license: p.license || '',
      source: p.source || '', commonsFile: p.commonsFile || '',
    });
  }
  return { rows, bad };
}

export function render(DATA) {
  const { rows, bad } = creditRows(DATA);
  if (bad.length) {
    const e = new Error('写真の 出どころが 足りません:\n  ' + bad.join('\n  '));
    e.problems = bad;
    throw e;
  }
  const body = rows.map((r) => [
    '<tr>',
    `<td class="nm">${esc(r.name)}</td>`,
    `<td>${esc(r.place)}</td>`,
    `<td>${esc(r.by) || '—'}</td>`,
    `<td>${esc(r.license)}</td>`,
    `<td><a href="${esc(r.source)}" target="_blank" rel="noopener">Commons</a></td>`,
    '</tr>',
  ].join('')).join('\n');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light">
<title>写真の 出どころ｜しぜんの かくれんぼ ずかん</title>
<meta name="description" content="このずかんで つかって いる 写真 ${rows.length} 枚の 作者・ライセンス・もとの ページの 一覧です。">
<link rel="icon" href="./assets/favicon.svg" type="image/svg+xml">
<meta name="theme-color" content="#1f7a5a">
<link rel="stylesheet" href="./style.css">
</head>
<body>
<!-- ⚠️ このファイルは tools/build-credits.mjs が 作って います。
     手で 直さないで ください。写真を 直したら content/photos.json を
     直して、node tools/build-animals.mjs → node tools/build-credits.mjs。 -->
<header class="site">
  <div class="site-inner">
    <h1>写真の 出どころ</h1>
  </div>
</header>
<main class="doc">
<a class="back" href="./">← ずかんに もどる</a>

<p>このずかんの 写真は ぜんぶ <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener">Wikimedia Commons</a>
から もらった ものです。生成した 画像は 1 枚も つかって いません。</p>

<div class="note">
<p>CC BY・CC BY-SA の 写真は、<strong>作者と ライセンスを 出すのが 条件</strong>です。
下の 一覧と、それぞれの 生きものの ページの 両方に 書いて あります。</p>
<p>写真を ここから とり出して つかう ときは、サイト全体の あつかいでは なく、
<strong>その 写真の ライセンス</strong>に したがって ください。</p>
</div>

<h2>写真 ${rows.length} 枚</h2>
<table class="credits">
<thead><tr><th>生きもの</th><th>ばしょ</th><th>とった 人</th><th>ライセンス</th><th>もとの ページ</th></tr></thead>
<tbody>
${body}
</tbody>
</table>

<h2>ライセンスの 読みかた</h2>
<ul>
<li><strong>CC0 / Public domain</strong> — だれでも じゆうに つかえます。作者を 出さなくても よい ものです。</li>
<li><strong>CC BY</strong> — つかって よいが、作者と ライセンスを 出すのが 条件。</li>
<li><strong>CC BY-SA</strong> — 同じ。さらに、なおして くばる ときは 同じ ライセンスに する のが 条件。</li>
<li><strong>GFDL</strong> — つかって よいが、作者と ライセンスを 出すのが 条件。</li>
</ul>

<a class="back" href="./">← ずかんに もどる</a>
</main>
<script src="./giga-app-links.js" defer></script>
</body>
</html>
`;
}

function main() {
  const check = process.argv.includes('--check');
  const DATA = loadWindowFile('data/animals.js').KAKURENBO;
  let text;
  try {
    text = render(DATA || {});
  } catch (e) {
    console.log('  FAIL ' + e.message.split('\n')[0]);
    for (const p of e.problems || []) console.log('       ' + p);
    console.log('\n❌ credits.html を 作れません');
    return 1;
  }
  const target = new URL('credits.html', ROOT);
  if (!check) {
    writeFileSync(target, text);
    console.log(`■ credits.html を 組み直しました（写真 ${(DATA.animals || []).length} 枚）`);
    return 0;
  }
  const now = existsSync(target) ? readFileSync(target, 'utf8') : '';
  if (now === text) {
    console.log('■ credits.html は data/animals.js と そろって います');
    console.log('\n✅ すべて通りました');
    return 0;
  }
  console.log('  FAIL credits.html が data/animals.js と ずれて います');
  console.log('       `node tools/build-credits.mjs` を 走らせて コミットして ください');
  return 1;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  process.exit(main());
}
