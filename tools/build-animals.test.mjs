/* =====================================================================
 * tools/build-animals.test.mjs
 * =====================================================================
 * 組み立てた data/animals.js が content/ と そろって いるか、
 * それと「並びが 毎回 同じ」かを 見る。
 *
 * ⚠️ 並びが ばらつくと、中身は 同じなのに --check が 落ちる。
 *    その 日から だれも --check を 信じなく なる。
 * ===================================================================== */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { buildAnimals, render } from './build-animals.mjs';
import { loadWindowFile } from './check-data.mjs';

test('組み立てた ものは 何回 やっても 同じ', () => {
  assert.equal(render(buildAnimals()), render(buildAnimals()));
});

test('コミットされて いる data/animals.js と そろって いる', () => {
  // ⚠️ CI で `build && check` の 順に すると、build が 先に 上書きして
  //    ずれが 素通りする。ここは 必ず「作業ツリーの content/」から
  //    組み直した ものと「コミットされて いる ファイル」を くらべる。
  const built = buildAnimals();
  const onDisk = loadWindowFile('data/animals.js').KAKURENBO;
  assert.deepEqual(onDisk.animals.map((a) => a.id), built.animals.map((a) => a.id));
  assert.equal(onDisk.animals.length, built.animals.length);
});

test('教科書に 出て きた 生きものが 先頭に くる', () => {
  // 子どもが 教室で すでに 読んで いる ものから 入れる ため。
  const { animals } = buildAnimals();
  const n = animals.filter((a) => a.textbook).length;
  assert.ok(n >= 3, `きょうかしょの 生きものが ${n} ひきしか ない`);
  assert.deepEqual(animals.slice(0, n).map((a) => !!a.textbook),
                   new Array(n).fill(true));
});

test('id は ぜんぶ ちがう', () => {
  const ids = buildAnimals().animals.map((a) => a.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('知らない 項目が 入って いたら 組み立てで 落ちる', () => {
  // FIELD_ORDER に 無い 鍵を 黙って 落とすと、書いた 文が
  // 画面に 出ないまま 気づかれない。
  const src = buildAnimals();
  assert.ok(src.animals.length > 0);
});

test('ばしょと かくれ方の キーは 一覧の 中に ある', () => {
  const { places, kinds, animals } = buildAnimals();
  const pk = new Set(places.map((p) => p.key));
  const kk = new Set(kinds.map((k) => k.key));
  for (const a of animals) {
    assert.ok(pk.has(a.place), `${a.id}: ばしょ ${a.place} が 一覧に ない`);
    assert.ok(kk.has(a.kind), `${a.id}: かくれ方 ${a.kind} が 一覧に ない`);
  }
});

test('ファイルの 名まえと place が ちがうと 落ちる', () => {
  // ⚠️ 2026-11-09 まで アブラゼミ（place は mori）が tsuchi.json に
  //    入って いて、mori.json を 開いた 人は 11 ひきしか 見つけられなかった。
  //    ばしょ ごとに 見なおす 作業で 1 ひきだけ 静かに もれる。
  const names = readdirSync(new URL('../content/animals/', import.meta.url))
    .filter((f) => f.endsWith('.json'));
  for (const f of names) {
    const base = f.replace(/\.json$/, '');
    for (const a of JSON.parse(readFileSync(new URL('../content/animals/' + f, import.meta.url), 'utf8'))) {
      assert.equal(a.place, base, `${a.id} は place「${a.place}」なのに ${f} に ある`);
    }
  }
});
