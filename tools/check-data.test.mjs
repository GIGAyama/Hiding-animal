/* =====================================================================
 * tools/check-data.test.mjs
 * =====================================================================
 * 生きもののデータの 検査そのものを 見張る。
 *
 * ⚠️ 検査が ゆるんだ ことに 気づけないのが いちばん こわい。
 *    「わざと 壊した データ」を 入れて、ちゃんと 落ちるかを 見る。
 * ===================================================================== */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { problemsIn } from './check-data.mjs';

const PLACES = [{ key: 'umi', label: 'うみの 中' }];
const KINDS = [{ key: 'moguru', label: 'もぐる' }];

/** 1 ひきぶんの、どこも 壊れて いない データ */
function ok(over = {}) {
  return {
    id: 'a', name: 'テストガニ', yomi: 'てすとがに', place: 'umi', kind: 'moguru',
    placeS: 'テストガニが、すなの 中に かくれて います。',
    bodyS: 'テストガニは、ほる 足を もって います。',
    howS: 'すなを ほって、かくれます。',
    naze: 'みを まもる ためです。', sumika: 'うみの すな。', size: '3cm ぐらい。',
    tabemono: 'かいそうを たべます。', itsu: 'なつ。', nakama: 'カニの なかま',
    karada: '足が ながいです。', motto: ['ひとつ。', 'ふたつ。'],
    photo: { file: 'a.jpg', w: 760, h: 570, by: 'だれか',
             license: 'CC BY-SA 4.0',
             source: 'https://commons.wikimedia.org/wiki/File:A.jpg' },
    ...over,
  };
}
/** 4 ひき 以上 ないと「ばしょが すくない」で 落ちるので そろえる */
const four = (first) => [first, ok({ id: 'b' }), ok({ id: 'c' }), ok({ id: 'd' })];
const run = (animals) => problemsIn({ places: PLACES, kinds: KINDS, animals });

test('どこも 壊れて いなければ 何も 言わない', () => {
  assert.deepEqual(run(four(ok())), []);
});

test('animals が 空なら 落ちる', () => {
  assert.equal(run([]).length, 1);
});

/* ── 教材文の 型 ─────────────────────────────────────── */

test('①が「かくれて います。」で おわらないと 落ちる', () => {
  const bad = run(four(ok({ placeS: 'テストガニが、すなに います。' })));
  assert.ok(bad.some((m) => m.includes('①どこに')));
});

test('②が「います。」「できます。」「あります。」で おわらないと 落ちる', () => {
  const bad = run(four(ok({ bodyS: 'テストガニは、足が ながい。' })));
  assert.ok(bad.some((m) => m.includes('②からだの とくちょう')));
});

test('③が「かくれます。」で おわらないと 落ちる', () => {
  const bad = run(four(ok({ howS: 'すなを ほります。' })));
  assert.ok(bad.some((m) => m.includes('③どのように')));
});

test('①が 名前＋「が、」で 始まらないと 落ちる', () => {
  const bad = run(four(ok({ placeS: 'この カニが、すなの 中に かくれて います。' })));
  assert.ok(bad.some((m) => m.includes('①は')));
});

test('②が 名前＋「は、」で 始まらないと 落ちる', () => {
  const bad = run(four(ok({ bodyS: 'この カニは、足を もって います。' })));
  assert.ok(bad.some((m) => m.includes('②は')));
});

test('3 つの 文が ながすぎると 落ちる', () => {
  const bad = run(four(ok({ howS: 'す'.repeat(120) + 'て、かくれます。' })));
  assert.ok(bad.some((m) => m.includes('ながすぎます')));
});

/* ── 字 ──────────────────────────────────────────────── */

test('1年生の 9月に ならわない 漢字が あると 落ちる', () => {
  const bad = run(four(ok({ karada: '海の 中で 体を 隠します。' })));
  assert.ok(bad.some((m) => m.includes('むずかしい 漢字')));
});

test('9月までの 漢字は 通る', () => {
  assert.deepEqual(run(four(ok({ karada: '水の 中の 石の 上で、目を 出します。' }))), []);
});

test('全角の すきま（U+3000）が まざると 落ちる', () => {
  // ⚠️ 見た目は 同じでも、おわり方の 判定が 通らなく なる。
  const bad = run(four(ok({ sumika: 'うみの　すな。' })));
  assert.ok(bad.some((m) => m.includes('全角の すきま')));
});

/* ── 写真の ライセンス ───────────────────────────────── */

test('写真の ライセンスが 空だと 落ちる', () => {
  const bad = run(four(ok({ photo: { ...ok().photo, license: '' } })));
  assert.ok(bad.some((m) => m.includes('ライセンス')));
});

test('知らない ライセンスは 通らない 側へ 倒れる', () => {
  // ⚠️「だめな ものを ならべて はじく」書き方に しないこと。
  //    知らない ものが 増えた とき、黙って 通る 側へ 倒れる。
  const bad = run(four(ok({ photo: { ...ok().photo, license: 'みらいの ライセンス 9.9' } })));
  assert.ok(bad.some((m) => m.includes('つかえない ライセンス')));
});

test('CC BY-SA なのに 作者が ないと 落ちる', () => {
  const bad = run(four(ok({ photo: { ...ok().photo, by: '' } })));
  assert.ok(bad.some((m) => m.includes('作者')));
});

test('CC0 は 作者が なくても 通る', () => {
  const photo = { ...ok().photo, by: '', license: 'CC0' };
  assert.deepEqual(run(four(ok({ photo }))), []);
});

test('Public domain は 作者が なくても 通る', () => {
  const photo = { ...ok().photo, by: '', license: 'Public domain' };
  assert.deepEqual(run(four(ok({ photo }))), []);
});

test('出どころが Commons でないと 落ちる', () => {
  const photo = { ...ok().photo, source: 'https://example.com/a.jpg' };
  assert.ok(run(four(ok({ photo }))).some((m) => m.includes('出どころ')));
});

test('写真の ファイルが 無いと 落ちる', () => {
  const bad = problemsIn({ places: PLACES, kinds: KINDS, animals: four(ok()) },
                         { photoExists: () => false });
  assert.ok(bad.some((m) => m.includes('見つかりません')));
});

test('写真が 小さすぎると 落ちる', () => {
  const photo = { ...ok().photo, w: 200, h: 150 };
  assert.ok(run(four(ok({ photo }))).some((m) => m.includes('小さすぎます')));
});

/* ── わりふり ────────────────────────────────────────── */

test('知らない ばしょ・かくれ方は 落ちる', () => {
  assert.ok(run(four(ok({ place: 'uchuu' }))).some((m) => m.includes('places')));
  assert.ok(run(four(ok({ kind: 'kieru' }))).some((m) => m.includes('kinds')));
});

test('id が ダブると 落ちる', () => {
  const bad = run([ok(), ok(), ok({ id: 'c' }), ok({ id: 'd' })]);
  assert.ok(bad.some((m) => m.includes('id が ほかと 同じ')));
});

test('ばしょに 4 ひき いないと 落ちる', () => {
  assert.ok(run([ok()]).some((m) => m.includes('4 ひき以上')));
});

test('いる はずの 項目が 欠けると 落ちる', () => {
  for (const f of ['name', 'place', 'kind', 'naze', 'sumika', 'size',
                   'tabemono', 'itsu', 'nakama', 'photo']) {
    const bad = run(four(ok({ [f]: '' })));
    assert.ok(bad.some((m) => m.includes(`${f} がありません`)), `${f} が 見のがされた`);
  }
});

/* ── 教材文の 形を もっと きつく 見る ────────────────── */

test('③が 「〜て、かくれます。」で ないと 落ちる', () => {
  // ⚠️ 「その 中に かくれます。」は おわり方だけなら 通って しまう。
  //    2026-11-08、ジグモ 1 ひきが この 形から 外れて いた。
  const bad = run(four(ok({ howS: 'あなの 中に かくれます。' })));
  assert.ok(bad.some((m) => m.includes('〜て、かくれます。')));
});

test('「〜で、かくれます。」も 通る', () => {
  assert.deepEqual(run(four(ok({ howS: 'すなを かぶって、からだ ぜんぶを すなで、かくれます。' }))), []);
});

test('①②は 名まえ＋「が、」「は、」まで 見る', () => {
  // 名まえで 始まって いても、助詞が ちがえば 教材文の 形では ない。
  assert.ok(run(four(ok({ placeS: 'テストガニは、すなの 中に かくれて います。' })))
    .some((m) => m.includes('①は')));
  assert.ok(run(four(ok({ bodyS: 'テストガニが、ほる 足を もって います。' })))
    .some((m) => m.includes('②は')));
});

test('yomi が ひらがなで ないと 落ちる', () => {
  assert.ok(run(four(ok({ yomi: 'テストガニ' }))).some((m) => m.includes('ひらがな')));
});

test('yomi が 名まえと ずれると 落ちる', () => {
  // 1年生は ひらがなで 打つ。ずれると その 1 ひきだけ 見つからない。
  assert.ok(run(four(ok({ yomi: 'ちがうなまえ' }))).some((m) => m.includes('ずれて')));
});

test('yomi が 名まえと あって いれば 通る', () => {
  assert.deepEqual(run(four(ok({ name: 'テストガニ', yomi: 'てすとがに' }))), []);
});

test('motto が 2つ ないと 落ちる', () => {
  assert.ok(run(four(ok({ motto: ['ひとつだけ。'] }))).some((m) => m.includes('motto')));
});
