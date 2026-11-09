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

/* ライセンスの 正本は content/licenses.json。
   ⚠️ 名まえの あたまの もじ あわせ（startsWith）に 戻さない こと。
      "CC BY-SA 2.0 de" は CC BY-SA 2.0 とは べつの ライセンスなのに、
      あたま あわせだと 同じ ものとして 通って しまう。 */
const LICENSES = JSON.parse(readFileSync(new URL('content/licenses.json', ROOT), 'utf8'));

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

export function creditRows(DATA) {
  const placeLabel = new Map((DATA.places || []).map((p) => [p.key, p.label]));
  const rows = [];
  const bad = [];
  for (const a of DATA.animals || []) {
    const p = a.photo || {};
    const L = LICENSES[p.license];
    if (!p.file) bad.push(`${a.id}: 写真が ありません`);
    if (!p.license) bad.push(`${a.id}: ライセンスが ありません`);
    else if (!L) bad.push(`${a.id}: 知らない ライセンスです: ${p.license}`);
    if (!p.source) bad.push(`${a.id}: もとの ページが ありません`);
    if (!p.licenseUrl) bad.push(`${a.id}: ライセンス本文の URL が ありません`);
    if (L && L.attribution && !p.by) {
      bad.push(`${a.id}: ${p.license} は 作者が 必ず 要ります`);
    }
    rows.push({
      name: a.name, place: placeLabel.get(a.place) || a.place,
      by: p.by || '', license: p.license || '', licenseUrl: p.licenseUrl || '',
      source: p.source || '', commonsFile: p.commonsFile || '',
    });
  }
  return { rows, bad };
}

/** カードから 外へ 出て いく リンクの 行き先を、ホストごとに かぞえる。
 *
 * ⚠️ これは「アプリが 読みこむ もの」では ない。アプリ自身は 外から
 *    1 つも 読まない（Zero-CDN）。ここに 出るのは、子どもや 先生が
 *    「出どころ」を おした ときに ひらく 先。
 *    だから ポータルの data/apps.json の hosts には 入れない
 *    （あちらは 読みこみだけを ならべる 台帳）。
 * ⚠️ けれども 校内の フィルタリングから 見れば、ふさがれて いれば
 *    やはり ひらかない。先生が 情報担当に 出せる 形で ならべて おく。
 *    手で 書くと 出どころを 1 本 足した 日に ずれるので、機械で 作る。 */
export function linkHosts(DATA) {
  const count = new Map();
  const add = (u) => {
    let h;
    try { h = new URL(String(u)).hostname; } catch (e) { return; }
    count.set(h, (count.get(h) || 0) + 1);
  };
  for (const a of DATA.animals || []) {
    for (const u of a.sources || []) add(u);
    const p = a.photo || {};
    for (const u of [p.source, p.licenseUrl]) if (u) add(u);
  }
  return [...count.entries()]
    .sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]))
    .map(([host, n]) => ({ host, n }));
}

export function render(DATA) {
  const { rows, bad } = creditRows(DATA);
  const hosts = linkHosts(DATA);
  const links = hosts.reduce((a, h) => a + h.n, 0);
  const hostRows = hosts.map((h) =>
    `<tr><td class="nm">${esc(h.host)}</td><td>${h.n}</td></tr>`).join('\n');
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
    `<td><a href="${esc(r.licenseUrl)}" target="_blank" rel="noopener">${esc(r.license)}</a></td>`,
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
<body class="doc-page">
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
</ul>
<p>上の 一覧の ライセンスの 名まえは、その ライセンスの 本文へ つながって います。
<strong>条件の 中身は、かならず その 本文で たしかめて ください。</strong></p>

<h2 id="filtering">出どころの リンクの 行き先（校内の フィルタリング用）</h2>
<p>このアプリ自身は、<strong>外の サーバーから 何も 読みこみません</strong>
（写真も 書体も この サイトの 中に あります）。
ふさがれて いても 画面は くずれません。</p>
<p>ただし、生きものの ページの いちばん 下に ある
<strong>「しらべた もと」</strong>と、写真の <strong>「もとの ページ」</strong>を
おすと、よその サイトが ひらきます。その 行き先は
<strong>${hosts.length} ホスト・${links} 本</strong>です。
子どもに 出どころを たどらせる 活動を する ときは、
下の 一覧を 情報担当に わたして ください。</p>
<table class="credits">
<thead><tr><th>ホスト</th><th>リンクの 数</th></tr></thead>
<tbody>
${hostRows}
</tbody>
</table>
<p>この 表は <code>data/animals.js</code> から 機械で 作って います。
出どころを 足したり 減らしたり すると、ここも いっしょに かわります。</p>

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
