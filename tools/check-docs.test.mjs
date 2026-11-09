/* =====================================================================
 * tools/check-docs.test.mjs
 * =====================================================================
 * 「文に 書いた 数」と「データ」の つき合わせ そのものを 見張る。
 *
 * ⚠️ ここが ゆるむと、生きものを 1 ひき 足した 日に 先生へ の ページが
 *    だまって 古く なる。わざと ずらして、落ちるかを 見る。
 * ===================================================================== */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { problemsIn, numbersOf, CLAIMS, CAUTION_PHRASES } from './check-docs.mjs';

/* ── 小さな にせデータ ───────────────────────────────── */

const animal = (over = {}) => ({
  id: 'a', name: 'テストガニ', place: 'umi', inJapan: true,
  karada: '足が ながいです。', motto: [], ...over,
});

const DATA = {
  animals: [
    animal({ id: 'a', name: 'テストガニ' }),
    animal({ id: 'b', name: 'テストエビ', place: 'sabaku', inJapan: false }),
    animal({ id: 'c', name: 'テストガエル', place: 'yuki' }),
  ],
  photos: { a: { file: 'a.jpg' }, b: { file: 'b.jpg', notHiding: true }, c: { file: 'c.jpg' } },
  places: [{ key: 'umi' }, { key: 'sabaku' }, { key: 'yuki' }],
};

/** その データに ぴったり 合う 文を 作る。
 *  ⚠️ 手で 数を 書くと、生きものを 1 ひき 足す テストを 書いた とたん
 *     べつの 行まで 赤く なって、何を 見て いるのか わからなく なる。 */
function docsFor(data) {
  const n = numbersOf(data);
  return {
    ft: [
      `${n.photos} 枚の うち ${n.notHiding} 枚が これに あたります。`,
      `${n.photos} 枚で 約 6MB あります。`,
      `そうすると ${n.photos} 枚すべてが 入ります。`,
      `${n.all} ひきの うち ${n.notJp} ひきは、にほんに いない 生きものです。`,
      `さばく は ${n.sabaku} ひきの うち ${n.sabakuNotJp} ひき、`
        + `ゆき・こおり は ${n.yuki} ひきの うち ${n.yukiNotJp} ひきが そうです。`,
      `にほんで 見られる ${n.jp} ひきだけが のこります。`,
    ].join('\n'),
    rd: `生きもの **${n.all} ひき**。\n${n.places} つのばしょ から えらべます。\n`,
    ix: `${n.photos} まいの しゃしんの とった 人`,
  };
}

const OK = docsFor(DATA);
const FT_OK = OK.ft;
const README_OK = OK.rd;

const files = (ft = FT_OK, rd = README_OK, ix = null) => (f) => {
  if (f === 'for-teachers.html') return ft;
  if (f === 'README.md') return rd;
  if (f === 'index.html') return ix == null ? `${numbersOf(DATA).photos} まいの しゃしんの とった 人` : ix;
  throw new Error('よまない ファイル: ' + f);
};
const run = (ft, rd) => problemsIn({ readFile: files(ft, rd), data: DATA });

/** 生きものを 1 ひき 足した うえで、文の 数は 正しく しておく */
function withExtra(extra) {
  const data = { ...DATA, animals: [...DATA.animals, extra] };
  const d = docsFor(data);
  return { data, files: (more = '') => files(d.ft + more, d.rd, d.ix) };
}

/* ── かぞえかた ───────────────────────────────────── */

test('データから 数を 作る', () => {
  assert.deepEqual(numbersOf(DATA), {
    all: 3, jp: 2, notJp: 1, photos: 3, notHiding: 1, places: 3,
    sabaku: 1, sabakuNotJp: 1, yuki: 1, yukiNotJp: 0,
  });
});

/* ── 数の つき合わせ ───────────────────────────────── */

test('ぜんぶ 合って いれば 何も 言わない', () => {
  assert.deepEqual(run(), []);
});

test('生きものの 数が 1 ずれたら 落ちる', () => {
  // ⚠️ 2026-11-09、シロウオを 足した あと「75 ひき」が のこって いた。
  const bad = run(FT_OK.replace('3 ひきの うち', '4 ひきの うち'));
  assert.equal(bad.length, 1);
  assert.ok(bad[0].includes('データと ちがいます（いまは 3）'));
});

test('にほんで 見られる 数が ずれたら 落ちる', () => {
  const bad = run(FT_OK.replace('見られる 2 ひき', '見られる 1 ひき'));
  assert.equal(bad.length, 1);
  assert.ok(bad[0].includes('にほんで 見られる 1 ひきだけが'));
});

test('写真の 数と、かくれて いない 写真の 数が ずれたら 落ちる', () => {
  const bad = run(FT_OK.replace('3 枚の うち 1 枚', '9 枚の うち 7 枚'));
  assert.equal(bad.length, 2, '2 つの 数を べつべつに 見る');
});

test('README の 数が ずれたら 落ちる', () => {
  const bad = run(FT_OK, README_OK.replace('**3 ひき**', '**75 ひき**'));
  assert.equal(bad.length, 1);
  assert.ok(bad[0].startsWith('README.md:'));
});

test('文ごと 消したら、だまって 通さないで 落ちる', () => {
  /* ⚠️ ここが いちばん こわい。文を 書きかえた だけで 検査が
     「見つからない から 合って いる」に 倒れると、二度と 鳴らない。 */
  const bad = run(FT_OK.replace('にほんで 見られる 2 ひきだけが のこります。', ''));
  assert.equal(bad.length, 1);
  assert.ok(bad[0].includes('あたる 文が ありません'));
});

/* ── 安全の ちゅうい ───────────────────────────────── */

test('カードに ちゅういが あるのに 先生へ の ページに 無ければ 落ちる', () => {
  // ⚠️ 2026-11-09、ニホンアマガエル（はだに どく）が この すきまに いた。
  const { data, files: f } = withExtra(
    animal({ id: 'd', name: 'テストカエル', karada: 'どくが 出ます。さわったら 手を あらいます。' }));
  const bad = problemsIn({ readFile: f(), data });
  assert.equal(bad.length, 1);
  assert.ok(bad[0].includes('テストカエル'));
  assert.ok(bad[0].includes('さわったら'));
});

test('先生へ の ページに 名まえが あれば 通る', () => {
  const { data, files: f } = withExtra(
    animal({ id: 'd', name: 'テストカエル', karada: 'さわったら 手を あらいます。' }));
  assert.deepEqual(
    problemsIn({ readFile: f('\nテストカエルは はだに どくが あります。'), data }), []);
});

test('motto の 中の ちゅういも 見る', () => {
  const { data, files: f } = withExtra(
    animal({ id: 'd', name: 'テストグモ', motto: ['ふくろは ひっぱらないで 見ます。'] }));
  assert.ok(problemsIn({ readFile: f(), data }).some((b) => b.includes('テストグモ')));
});

test('ただの 説明は ちゅういに しない', () => {
  const { data, files: f } = withExtra(
    animal({ id: 'd', name: 'テストガイ', karada: 'からで からだを はさんで まもります。' }));
  assert.deepEqual(problemsIn({ readFile: f(), data }), []);
});

/* ── 見はりの 形そのもの ───────────────────────────── */

test('見るのは 手で 書く ページだけ（生成物は 見ない）', () => {
  /* credits.html は tools/build-credits.mjs が 組むので、ここでは 見ない。
     組みなおせば かならず 合う。 */
  assert.deepEqual([...new Set(CLAIMS.map((c) => c[0]))].sort(),
    ['README.md', 'for-teachers.html', 'index.html']);
});

test('index.html の 写真の 数が ずれたら 落ちる', () => {
  const bad = run(FT_OK, README_OK);
  assert.deepEqual(bad, []);
  const bad2 = problemsIn({ readFile: files(FT_OK, README_OK, '99 まいの しゃしんの とった 人'), data: DATA });
  assert.equal(bad2.length, 1);
  assert.ok(bad2[0].startsWith('index.html:'));
});

test('事故に なった ことばは、ならびから 落とさない', () => {
  /* ⚠️ ここに ならんだ 3 つは、どれも 実際に 先生へ の ページから
     もれて いた もの（ニホンアマガエル・ジグモ・ライチョウ）。
     ならびを 短く する ときに この 3 つを 落とさない。 */
  for (const p of ['さわったら', 'ひっぱらないで', 'よらないで']) {
    assert.ok(CAUTION_PHRASES.includes(p), p + ' が ならびから 消えて います');
  }
  assert.equal(new Set(CAUTION_PHRASES).size, CAUTION_PHRASES.length, '同じ ことばが 2 回');
});
