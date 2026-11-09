#!/usr/bin/env node
/* =====================================================================
 * tools/build-animals.mjs — content/ から data/animals.js を 組み立てる
 * =====================================================================
 * 使い方:
 *   node tools/build-animals.mjs            組み直して data/animals.js へ書く
 *   node tools/build-animals.mjs --check    コミットされている物と見くらべる
 *
 * ── なぜ 2 つに 分けるのか ────────────────────────────
 *
 * 文（content/animals/*.json）と 写真（content/photos.json）は
 * 出どころが ちがう。文は 人が 書き、写真は Wikimedia Commons から
 * 落として ライセンスを 機械で 読みとる。これを 1 つの ファイルに
 * 手で まぜると、写真を 1 枚 差しかえる たびに 文の ある ファイルを
 * 触る ことに なり、事故が おきる。
 *
 * 配信するのは 組み上がった data/animals.js（ブラウザは 1 回の
 * 読みこみで すむ）。その かわり、**組み上がった物も コミットする**。
 *
 * ⚠️ `--check` は「作業ツリーの content/」から 組み直した物を
 *    「コミットされている data/animals.js」と 見くらべる。
 *    CI で `build && check` の 順に 走らせると、build が 先に
 *    上書きして しまい、ずれが 素通りする。
 *    （portal の standards/vendor/verify-generated.mjs と 同じ 教訓。
 *      2026-08-28 に 10 本 すべてで 素通りした。）
 *    .github/workflows/ci.yml では --check だけを 呼ぶ こと。
 * ===================================================================== */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('..', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, ROOT), 'utf8'));

/* 生きもの 1 ひきぶんの、書きだす 順番。
   ⚠️ 並びを 固定して おかないと、鍵の 順が ばらついて
      --check が 中身は 同じなのに 落ちる。 */
const FIELD_ORDER = [
  'id', 'name', 'yomi', 'place', 'kind', 'textbook', 'inJapan',
  'placeS', 'bodyS', 'howS',
  'naze', 'sumika', 'size', 'tabemono', 'itsu', 'nakama', 'karada',
  'motto', 'sources', 'photo',
];

export function buildAnimals() {
  const places = read('content/places.json');
  const kinds = read('content/kinds.json');
  const photos = existsSync(new URL('content/photos.json', ROOT))
    ? read('content/photos.json') : {};
  /* ライセンスの 名まえ → 本文の URL。CC BY 2.0/3.0 の 4(a) と
     CC BY 4.0 の 3(a)(1)(C) は「ライセンスの うつし、または その URI」を
     いっしょに 出すように いって いる。名まえを 字で 出すだけでは
     条件を みたさない ので、ここで URL を 配信物へ 入れる。 */
  const licenses = read('content/licenses.json');

  const dir = new URL('content/animals/', ROOT);
  const byId = new Map();
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
    const base = f.replace(/\.json$/, '');
    for (const a of JSON.parse(readFileSync(new URL(f, dir), 'utf8'))) {
      if (byId.has(a.id)) throw new Error(`id が ダブって います: ${a.id}`);
      /* ⚠️ ファイルの 名まえと place が ちがうと、ばしょ ごとに 文を
            見なおす 作業で 1 ひきだけ 静かに もれる。
            2026-11-09 まで アブラゼミ（place は mori）が tsuchi.json に
            入って いて、README の 表の とおりに mori.json を 開いた 人は
            11 ひきしか 見つけられなかった。 */
      if (a.place !== base) {
        throw new Error(
          `${a.id}: place「${a.place}」なのに ${f} に 入って います。`
          + ` content/animals/${a.place}.json へ うつして ください`);
      }
      byId.set(a.id, a);
    }
  }

  /* 並び: ①教科書に 出て きた 3 つ ②ばしょの 一覧の 順
     ⚠️ 教科書の 3 つを 先頭に 置く のは、子どもが 教室で すでに
        読んで いる ものから 入れる ため。places の 順を 変えても
        この 3 つは 先頭の まま。 */
  const order = new Map(places.map((p, i) => [p.key, i]));
  const animals = [...byId.values()].sort((a, b) => {
    if (!!b.textbook !== !!a.textbook) return b.textbook ? 1 : -1;
    const d = (order.get(a.place) ?? 99) - (order.get(b.place) ?? 99);
    return d || a.id.localeCompare(b.id);
  });

  const out = animals.map((a) => {
    const rec = {};
    for (const k of FIELD_ORDER) {
      if (k === 'photo') {
        const ph = { ...(photos[a.id] || {}) };
        const L = licenses[ph.license];
        if (L) ph.licenseUrl = L.url;
        rec.photo = ph;
        continue;
      }
      if (a[k] !== undefined) rec[k] = a[k];
    }
    const extra = Object.keys(a).filter((k) => !FIELD_ORDER.includes(k));
    if (extra.length) throw new Error(`${a.id}: 知らない 項目: ${extra.join(' ')}`);
    return rec;
  });

  return { places, kinds, animals: out };
}

const HEAD = `/* =====================================================================
   data/animals.js — かくれんぼ名人の データ
   ---------------------------------------------------------------------
   ⚠️ このファイルは 組み立てた ものです。手で 直さないで ください。
      文を 直すとき   → content/animals/<ばしょ>.json
      写真を 直すとき → content/photos.json
      ばしょ・かくれ方 → content/places.json / content/kinds.json
      直したら \`node tools/build-animals.mjs\` を 走らせる。

   ⚠️ 文は すべて 書きおろし。教科書の 本文は 1 文も 入れない。
   ⚠️ 写真は Wikimedia Commons の、だれでも つかえる ライセンスの ものだけ。
      CC BY / CC BY-SA は 作者と ライセンスを 出すのが 条件なので、
      photo.by と photo.license と photo.source を 欠かさない。
      tools/check-data.mjs が 1 枚でも 欠けたら 落とす。

   文の 型（教材文と 同じ ならび）:
     placeS  〇〇が、〜に かくれて います。        ① どこに
     bodyS   〇〇は、〜を もって います／できます。 ② からだの とくちょう
     howS    〜て、かくれます。                    ③ どのように かくれるか
   ===================================================================== */
`;

export function render(data) {
  const j = (v) => JSON.stringify(v, null, 2);
  const lines = [];
  lines.push(HEAD);
  lines.push("(function (win) {");
  lines.push("  'use strict';\n");
  lines.push('  var places = ' + j(data.places).replace(/\n/g, '\n  ') + ';\n');
  lines.push('  var kinds = ' + j(data.kinds).replace(/\n/g, '\n  ') + ';\n');
  lines.push('  var animals = ' + j(data.animals).replace(/\n/g, '\n  ') + ';\n');
  lines.push('  win.KAKURENBO = { places: places, kinds: kinds, animals: animals };');
  lines.push("})(typeof window !== 'undefined' ? window : this);");
  return lines.join('\n') + '\n';
}

function main() {
  const check = process.argv.includes('--check');
  const text = render(buildAnimals());
  const target = new URL('data/animals.js', ROOT);

  if (!check) {
    writeFileSync(target, text);
    const n = buildAnimals().animals.length;
    console.log(`■ data/animals.js を 組み直しました（生きもの ${n} ひき）`);
    return 0;
  }

  const now = existsSync(target) ? readFileSync(target, 'utf8') : '';
  if (now === text) {
    console.log('■ data/animals.js は content/ と そろって います');
    console.log('\n✅ すべて通りました');
    return 0;
  }
  console.log('  FAIL data/animals.js が content/ と ずれて います');
  console.log('       `node tools/build-animals.mjs` を 走らせて、');
  console.log('       組み上がった data/animals.js も コミットして ください');
  return 1;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  process.exit(main());
}
