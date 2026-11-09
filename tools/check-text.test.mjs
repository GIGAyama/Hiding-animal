import { test } from 'node:test';
import assert from 'node:assert/strict';
import { visibleTextIn, jsStringsIn, problemsInTexts, problemsIn, WATCHED } from './check-text.mjs';

/* ── HTML から 画面に 出る 字を とり出す ───────────────────── */

test('タグの あいだの 字を 1 つずつ 拾う', () => {
  const t = visibleTextIn('<html><body><p>うみの 中</p><p>もり</p></body></html>');
  assert.deepEqual(t, ['うみの 中', 'もり']);
});

test('<title> は 画面（タブ）に 出るので 見る', () => {
  const t = visibleTextIn('<html><head><title>かくれんぼ ずかん</title></head><body></body></html>');
  assert.deepEqual(t, ['かくれんぼ ずかん']);
});

test('<meta> は 画面に 出ないので 見ない', () => {
  // ⚠️ ここを 入れると description の 大人の 字で 鳴りつづけ、
  //    検査そのものが 無視されるように なる。
  const t = visibleTextIn('<html><head><meta name="description" content="小学1年生の国語"></head><body></body></html>');
  assert.deepEqual(t, []);
});

test('コメントは 作る 人の ものなので 見ない', () => {
  const t = visibleTextIn('<html><body><!-- 学習のための 覚え書き --><p>よい</p></body></html>');
  assert.deepEqual(t, ['よい']);
});

test('<style> は 見ない', () => {
  const t = visibleTextIn('<html><body><style>.a{content:"習"}</style><p>よい</p></body></html>');
  assert.deepEqual(t, ['よい']);
});

test('画面に 出る 属性（placeholder / aria-label / alt / title）は 見る', () => {
  const t = visibleTextIn('<html><body>'
    + '<input placeholder="れい：学校">'
    + '<button aria-label="おわり方">A</button>'
    + '<img alt="砂の 中">'
    + '<span title="教科書">x</span>'
    + '</body></html>');
  assert.ok(t.includes('れい：学校'));
  assert.ok(t.includes('おわり方'));
  assert.ok(t.includes('砂の 中'));
  assert.ok(t.includes('教科書'));
});

test('ページの 中に 直に 書いた <script> も、字の 中みだけ 見る', () => {
  // ⚠️ ただ 落とすと、画面に 出る 字が 検査の 外に 出る。
  const t = visibleTextIn('<html><body><script>var a = "教科書";</script></body></html>');
  assert.deepEqual(t, ['教科書']);
});

/* ── JavaScript から 字を とり出す ─────────────────────── */

test('文字れつの 中みを 拾う', () => {
  assert.deepEqual(jsStringsIn("var a = 'うみの 中';"), ['うみの 中']);
  assert.deepEqual(jsStringsIn('var a = "もり";'), ['もり']);
  assert.deepEqual(jsStringsIn('var a = `ゆき`;'), ['ゆき']);
});

test('コメントは 見ない。アポストロフィが あっても こわれない', () => {
  // ⚠️ 正規表現で 「'…'」を さがすだけだと、コメントの don't から 先が
  //    ぜんぶ 文字れつに 見えて、本当の 字を とりこぼす。
  const js = "/* don't 学習 */\n// 教科書\nvar a = 'よい 字';";
  assert.deepEqual(jsStringsIn(js), ['よい 字']);
});

test('正規表現リテラルは 文字れつでは ない', () => {
  const js = "var a = x.replace(/に かくれて います。$/, '');\nvar b = 'のこる';";
  assert.deepEqual(jsStringsIn(js), ['のこる']);
});

test('割り算の / と 正規表現の / を とりちがえない', () => {
  const js = "var a = n / 2;\nvar b = 'のこる';";
  assert.deepEqual(jsStringsIn(js), ['のこる']);
});

/* ── 字を 見る ─────────────────────────────────────── */

test('1年生が 習わない 漢字を 見つける', () => {
  const bad = problemsInTexts('x', ['おわり方', '件）', '小学1年生 国語']);
  assert.equal(bad.length, 3);
  assert.ok(bad[0].includes('方'));
  assert.ok(bad[1].includes('件'));
});

test('つかって よい 41字は 通す', () => {
  assert.deepEqual(problemsInTexts('x', [
    '大小上下中手足木花水土石目口白赤青見日月人火気生出入子女男山川田左右先名早車空林森',
    'かくれんぼ名人が 71ひき',
    '先生へ（たんげんの どこで つかうか）',
  ]), []);
});

test('全角の すきま（U+3000）を 見つける', () => {
  const bad = problemsInTexts('x', ['しゃしん　Wikimedia Commons']);
  assert.equal(bad.length, 1);
  assert.ok(bad[0].includes('U+3000'));
});

test('半角の すきまは 通す', () => {
  assert.deepEqual(problemsInTexts('x', ['しゃしん Wikimedia Commons']), []);
});

/* ── 見る 先 ───────────────────────────────────────── */

test('見るのは 子どもの 画面だけ。先生の ページは 見ない', () => {
  // ⚠️ for-teachers.html などを 入れると、おとなの 字で 鳴りつづける。
  assert.deepEqual(WATCHED, ['index.html', 'app.js']);
});

test('ファイルの 中みを もらって 判断する（本物を 読まない）', () => {
  const bad = problemsIn({
    read: (f) => (f.endsWith('.html')
      ? '<html><body><p>おわり方</p></body></html>'
      : "var a = '件）';"),
  });
  assert.equal(bad.length, 2);
  assert.ok(bad.some((b) => b.startsWith('index.html:')));
  assert.ok(bad.some((b) => b.startsWith('app.js:')));
});
