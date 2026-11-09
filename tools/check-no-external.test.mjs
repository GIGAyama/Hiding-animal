/* =====================================================================
 * tools/check-no-external.test.mjs
 * =====================================================================
 * Zero-CDN の 検査そのものを 見張る。
 *
 * ⚠️ ここに ならべた ものは、ぜんぶ 実際に 1 度 すりぬけた 形。
 *    「見つかるはず」だと おもって いた ものが 素通りして いたので、
 *    検査を 直したら 必ず この ファイルに 1 行 足す。
 * ===================================================================== */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadsIn, isOwn, servedFiles } from './check-no-external.mjs';

const urls = (t) => loadsIn(t).map((x) => x.url);

test('スキームを 省いた //cdn… を 外と 見る', () => {
  // ⚠️ 2026-08-28、これが 艦隊の 静的検査を 素通りして いた。
  //    http で 始まらないので「相対の道」に 見えて しまう。
  assert.equal(isOwn('//cdn.jsdelivr.net/npm/x.js'), false);
  assert.equal(isOwn('//fonts.googleapis.com/css'), false);
  assert.equal(isOwn('https://unpkg.com/x'), false);
});

test('じぶんの ドメインと 相対の 道は 自分の側', () => {
  assert.equal(isOwn('./style.css'), true);
  assert.equal(isOwn('/photos/a.jpg'), true);
  assert.equal(isOwn('photos/a.jpg'), true);
  assert.equal(isOwn('https://giga-school.com/x.css'), true);
  assert.equal(isOwn('https://www.giga-school.com/x.css'), true);
  assert.equal(isOwn('data:image/svg+xml,<svg/>'), true);
  assert.equal(isOwn('#top'), true);
});

test('にた ドメインに だまされない', () => {
  assert.equal(isOwn('https://giga-school.com.evil.example/x.js'), false);
  assert.equal(isOwn('https://notgiga-school.com/x.js'), false);
});

test('<a href> は 読み込みでは ない', () => {
  // ⚠️ href を まとめて 拾う 書き方に すると、生きものの ページから
  //    Wikimedia Commons へ はる リンクが ぜんぶ 違反に 見えて、
  //    検査が ずっと 赤に なる。見るのは「読みこむ」ものだけ。
  assert.deepEqual(urls('<a href="https://commons.wikimedia.org/wiki/File:X">もと</a>'), []);
  assert.deepEqual(urls('<a href="https://ja.wikipedia.org/wiki/ヒラメ" rel="noopener">x</a>'), []);
});

test('<img src> と <script src> は 読み込み', () => {
  assert.deepEqual(urls('<img src="./photos/a.jpg">'), ['./photos/a.jpg']);
  assert.deepEqual(urls('<script src="https://cdn.example/x.js"></script>'),
                   ['https://cdn.example/x.js']);
});

test('srcset は 1 つずつに 割る', () => {
  assert.deepEqual(urls('<img srcset="a.jpg 1x, https://cdn.example/b.jpg 2x">'),
                   ['a.jpg', 'https://cdn.example/b.jpg']);
});

test('CSS の url() と @import を 拾う', () => {
  assert.deepEqual(urls('@import "https://fonts.googleapis.com/css";'),
                   ['https://fonts.googleapis.com/css']);
  assert.deepEqual(urls('body{background:url(//cdn.example/x.png)}'),
                   ['//cdn.example/x.png']);
});

test('importScripts を 拾う（sw.js の 中）', () => {
  assert.deepEqual(urls('importScripts("https://cdn.example/workbox.js")'),
                   ['https://cdn.example/workbox.js']);
});

test('link rel=canonical は 読み込みでは ない', () => {
  assert.deepEqual(urls('<link rel="canonical" href="https://giga-school.com/x/">'), []);
});

test('知らない rel は 数える 側へ 倒れる', () => {
  // ⚠️「読みこむ rel」を ならべる 書き方に しないこと。
  //    知らない rel（preload/modulepreload など）が 増えた とき、
  //    黙って 通る 側へ 倒れる。
  assert.deepEqual(urls('<link rel="preload" as="font" href="https://cdn.example/f.woff2">'),
                   ['https://cdn.example/f.woff2']);
  assert.deepEqual(urls('<link rel="みらいの なにか" href="https://cdn.example/x">'),
                   ['https://cdn.example/x']);
});

/* ── SVG の 中の 読み込み ─────────────────────────────── */

test('<image href> を 数える', () => {
  // ⚠️ 2026-11-09 に 実際に 試したら、src / srcset / link / url() /
  //    @import / importScripts の どれにも 当たらず 素通りして いた。
  assert.deepEqual(loadsIn('<image href="https://evil.example.com/t.png"/>'),
    [{ url: 'https://evil.example.com/t.png', how: '<image href>' }]);
});

test('<use xlink:href> を 数える。1 件を 二重に 数えない', () => {
  assert.deepEqual(loadsIn('<use xlink:href="//cdn.example.com/s.svg#a"/>'),
    [{ url: '//cdn.example.com/s.svg#a', how: 'xlink:href' }]);
});

test('<a href> は 読み込みでは ない', () => {
  assert.deepEqual(loadsIn('<a href="https://commons.wikimedia.org/x">x</a>'), []);
});

test('link rel=license は 読み込みでは ない', () => {
  assert.deepEqual(loadsIn('<link rel="license" href="https://creativecommons.org/licenses/by-sa/3.0/">'), []);
});

/* ── JSON の 中（引用符が \" に なって いる）──────────── */

test('JSON の 中の \\" を こえて 外からの 読み込みを 見つける', () => {
  /* ⚠️ 2026-11-09 に 実測。content/places.json の glyph は
     "<path d=\"…\"/>" の 形で 入って いて、そこへ 外の ホストを
     1 行 足しても この 検査は 黙って 通した（0 件）。
     glyph は app.js が 画面へ 入れる ので、ほんとうに 取りに 行く。 */
  const json = '{"glyph": "<image href=\\"https://evil.example.com/t.png\\"/>"}';
  assert.ok(loadsIn(json).some((x) => x.url === 'https://evil.example.com/t.png'),
    'JSON の 中の <image href> が 見つからない');
});

test('エスケープの 無い 字は、二重に 数えない', () => {
  assert.deepEqual(loadsIn('<image href="https://evil.example.com/t.png"/>').length, 1);
});

test('JSON を ほどいても、自分の 側は 自分の 側の まま', () => {
  const json = '{"glyph": "<path d=\\"M0 0\\" fill=\\"none\\"/>"}';
  assert.deepEqual(loadsIn(json).filter((x) => !isOwn(x.url)), []);
});

/* ── どの ファイルを 見るか ───────────────────────── */

test('.svg も 配信物と して 見る', () => {
  /* ⚠️ <image href> / <use href> / xlink:href の 見はりを 足したのに、
     その タグが いちばん 入りやすい .svg を 1 本も 開いて いなかった。
     assets/favicon.svg は git に 追跡されて 配信される。 */
  const files = servedFiles();
  assert.ok(files.some((f) => f.endsWith('.svg')), '.svg が 1 本も 入って いません');
});

test('見る ファイルは、git が 追跡して いる 配信物だけ', () => {
  const files = servedFiles();
  assert.ok(files.includes('index.html'));
  assert.ok(files.includes('app.js'));
  assert.ok(files.includes('content/places.json'));
  assert.ok(!files.some((f) => f.endsWith('.jpg')), '写真は 字を 持たない ので 見ない');
});

test('ブラウザへ 配らない ものは 見ない（道具と 共通ゲートの 写し）', () => {
  /* ⚠️ ここに 足して よいのは「ブラウザが 1 度も 読まない もの」だけ。
     配る ものを 足すと、その 道は 二度と 見られなく なる。 */
  const files = servedFiles();
  assert.equal(files.filter((f) => f.startsWith('tools/')).length, 0);
  assert.equal(files.filter((f) => f.startsWith('scripts/')).length, 0);
  assert.ok(files.includes('index.html'), '配る ものは 見る');
  assert.ok(files.includes('offline.html'), '圏外の ページも 配る もの');
});
