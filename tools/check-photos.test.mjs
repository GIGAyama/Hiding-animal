/* =====================================================================
 * tools/check-photos.test.mjs
 * =====================================================================
 * 写真の 検査そのものを 見張る。
 *
 * ⚠️ 2026-11-09 に ためしたら、photos/yukiusagi.jpg を 30 バイトの ごみに
 *    置きかえても 検査 7 本と 単体テスト 91 本が ぜんぶ 緑の まま だった。
 *    どの 道具も photos/*.jpg を バイトとして 開いて いなかった。
 *    だから ここは「わざと 壊した バイト」を 入れて、落ちるかを 見る。
 * ===================================================================== */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jpegSize, problemsIn, versionOf } from './check-photos.mjs';

/** ほんものの 形を した JPEG の あたま（SOF0 に w/h を 書く）。
 *  ⚠️ 中みは でたらめで よい。見たいのは「ヘッダを 読んで 大きさが
 *     取れるか」と「取れない ものを はじくか」だけ。 */
function fakeJpeg(w, h, bytes = 8000) {
  const head = Buffer.from([
    0xff, 0xd8,                               // SOI
    0xff, 0xe0, 0x00, 0x04, 0x00, 0x00,       // APP0（len=4、中み 2 バイト）
    0xff, 0xc0, 0x00, 0x11, 0x08,             // SOF0（len=17、精度 8）
    (h >> 8) & 0xff, h & 0xff,
    (w >> 8) & 0xff, w & 0xff,
    0x03,                                     // 成分 3
  ]);
  return Buffer.concat([head, Buffer.alloc(Math.max(0, bytes - head.length), 0x5a)]);
}

const photo = (over = {}) => ({ file: 'a.jpg', w: 900, h: 600, ...over });
const run = (photos, files) => problemsIn(photos, {
  readPhoto: (f) => {
    if (!(f in files)) throw new Error('ENOENT');
    return files[f];
  },
  listPhotos: () => Object.keys(files),
});

/* ── 大きさを ヘッダから 読む ───────────────────────── */

test('JPEG の ヘッダから 実寸を 読む', () => {
  assert.deepEqual(jpegSize(fakeJpeg(900, 600)), { w: 900, h: 600 });
});

test('JPEG で ない ものは null', () => {
  assert.equal(jpegSize(Buffer.from('<!DOCTYPE html><html>Wikimedia Error')), null);
  assert.equal(jpegSize(Buffer.alloc(2)), null);
});

test('DHT（0xc4）を SOF と まちがえない', () => {
  /* ⚠️ 0xc0〜0xcf の うち c4 / c8 / cc は SOF では ない。
     ならべて 見る 書き方に すると、DHT の 中の 数を 大きさと 読む。 */
  const buf = Buffer.concat([
    Buffer.from([0xff, 0xd8, 0xff, 0xc4, 0x00, 0x06, 0x00, 0x11, 0x22, 0x33]),
    fakeJpeg(800, 500).subarray(2),
  ]);
  assert.deepEqual(jpegSize(buf), { w: 800, h: 500 });
});

/* ── 1 まいずつ 見る ───────────────────────────────── */

test('どこも 壊れて いなければ 何も 言わない', () => {
  assert.deepEqual(run({ a: photo() }, { 'a.jpg': fakeJpeg(900, 600) }), []);
});

test('30 バイトの ごみは 落ちる', () => {
  const bad = run({ a: photo() }, { 'a.jpg': Buffer.alloc(30) });
  assert.equal(bad.length, 1);
  assert.ok(bad[0].includes('小さすぎます'));
});

test('HTTP 200 で かえって くる Wikimedia Error の HTML も 落ちる', () => {
  // ⚠️ 大きさだけで 見ると 3267 バイト あるので 通って しまう。
  const html = Buffer.from('<!DOCTYPE html>'.padEnd(5000, 'x'));
  const bad = run({ a: photo() }, { 'a.jpg': html });
  assert.equal(bad.length, 1);
  assert.ok(bad[0].includes('JPEG に なって いません'));
});

test('content/photos.json の w/h と ちがうと 落ちる', () => {
  const bad = run({ a: photo({ w: 900, h: 600 }) }, { 'a.jpg': fakeJpeg(900, 601) });
  assert.equal(bad.length, 1);
  assert.ok(bad[0].includes('ちがいます'));
});

test('400×300 を 下まわると 落ちる', () => {
  const bad = run({ a: photo({ w: 399, h: 300 }) }, { 'a.jpg': fakeJpeg(399, 300) });
  assert.ok(bad.some((b) => b.includes('小さすぎます（399×300）')));
});

test('読めない ファイルは 落ちる', () => {
  const bad = run({ a: photo({ file: 'none.jpg' }) }, {});
  assert.equal(bad.length, 1);
  assert.ok(bad[0].includes('読めません'));
});

test('file が 無いと 落ちる', () => {
  const bad = run({ a: { w: 900, h: 600 } }, {});
  assert.equal(bad.length, 1);
  assert.ok(bad[0].includes('file が ありません'));
});

test('つかって いない 写真が のこって いたら 落ちる', () => {
  const bad = run({ a: photo() },
    { 'a.jpg': fakeJpeg(900, 600), 'old.jpg': fakeJpeg(900, 600) });
  assert.equal(bad.length, 1);
  assert.ok(bad[0].includes('つかわれて いません'));
});

/* ── 写真の 版 ─────────────────────────────────────── */

test('名まえが 同じで 中みだけ かわったら、版も かわる', () => {
  /* ⚠️ ここが 今回の 事故。sw.js は「名まえが 同じなら 中みも 同じ」と
     見なして 控えを 取りなおさない。名まえだけを 混ぜた 版では、
     差しかえた 14 まいが 端末に 一生 とどかない。 */
  const photos = { a: photo() };
  const v1 = versionOf(photos, () => fakeJpeg(900, 600, 8000));
  const v2 = versionOf(photos, () => fakeJpeg(900, 600, 8001));
  assert.notEqual(v1, v2);
});

test('名まえが かわったら、版も かわる', () => {
  const buf = fakeJpeg(900, 600);
  const v1 = versionOf({ a: photo({ file: 'a.jpg' }) }, () => buf);
  const v2 = versionOf({ a: photo({ file: 'b.jpg' }) }, () => buf);
  assert.notEqual(v1, v2);
});

test('何も かわって いなければ、版は 同じ（毎回 6.5MB を 取りなおさない）', () => {
  const photos = { a: photo(), b: photo({ file: 'b.jpg' }) };
  const read = () => fakeJpeg(900, 600);
  assert.equal(versionOf(photos, read), versionOf(photos, read));
});

test('版は ならべる 順に よらない', () => {
  const read = (f) => fakeJpeg(900, f === 'a.jpg' ? 600 : 601);
  const v1 = versionOf({ a: photo({ file: 'a.jpg' }), b: photo({ file: 'b.jpg' }) }, read);
  const v2 = versionOf({ b: photo({ file: 'b.jpg' }), a: photo({ file: 'a.jpg' }) }, read);
  assert.equal(v1, v2);
});

test('版は p で はじまる 短い 字', () => {
  assert.match(versionOf({ a: photo() }, () => fakeJpeg(900, 600)), /^p[0-9a-f]{8}$/);
});
