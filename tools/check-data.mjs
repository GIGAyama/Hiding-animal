#!/usr/bin/env node
/* =====================================================================
 * tools/check-data.mjs — 生きもののデータが、教材文の型から外れていないか
 * =====================================================================
 * 使い方: リポジトリのルートで `node tools/check-data.mjs`
 *
 * ── なぜ要るのか ──────────────────────────────────
 *
 * このアプリの中身は「1年生が まねして 書ける 3 つの文」であって、
 * 生きものの知識そのものではない。型が 1 枚でも崩れていると、
 * その 1 枚を選んだ子だけが、書き写せない文を前に手が止まる。
 * 目で 109 枚を見くらべるのは無理なので、機械に見させる。
 *
 * ⚠️ 写真は 人さまの もの。CC BY / CC BY-SA は 作者と ライセンスを
 *    出すのが 条件で、出さなければ ただの 無断転載に なる。
 *    1 枚でも 欠けたら 落とす。
 *
 * ── 何を見るか ────────────────────────────────────
 *
 *   1. 欠けている項目が無いか
 *   2. こたえの 3 文が、それぞれ 決まった 終わり方に なっているか
 *   3. 1年生の 9 月に 読めない 漢字が まざって いないか
 *   4. 全角の すきまが まざって いないか（半角に そろえる）
 *   5. ばしょ・かくれ方の キーが 一覧に あるか
 *   6. 写真の ファイルが 実在するか、ライセンスと 作者と 出どころが あるか
 *   7. ばしょ ごとの 数に、ひどい かたよりが 無いか
 * ===================================================================== */
import { existsSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('..', import.meta.url);

/** window.XXX = … の形のデータファイルを Node で読む */
export function loadWindowFile(relPath, root = ROOT) {
  const src = readFileSync(new URL(relPath, root), 'utf8');
  const win = {};
  // eslint-disable-next-line no-new-func
  new Function('window', 'self', 'globalThis', src)(win, win, win);
  return win;
}

const RULES = [
  { key: 'placeS', name: '①どこに', ends: ['かくれて います。', 'かくれて いるのです。'] },
  { key: 'bodyS',  name: '②からだの とくちょう', ends: ['います。', 'できます。', 'あります。'] },
  { key: 'howS',   name: '③どのように かくれるか', ends: ['かくれます。', 'かくれるのです。'] },
];

/* 再利用して よい ライセンス。ここに 無い ものは 使わない。
   ⚠️ 「ならべて はじく」書き方に しないこと。知らない ライセンスが
      増えたとき、黙って 通る側へ 倒れる。 */
const OK_LICENSE = [
  'cc0', 'cc by', 'cc by-sa', 'public domain', 'pd', 'gfdl', 'attribution',
];

/* 作者を 書かなくて よい もの（権利を はなした もの）。それ以外は 必須。 */
const NO_ATTRIBUTION_NEEDED = ['cc0', 'public domain', 'pd'];

/* 1年生の 9 月までに 出会う 漢字だけ。それ以外は ひらがなで 書く。 */
const OK_KANJI = new Set([...'大小上下中手足木花水土石目口白赤青見日月人火気生出入子女男山川田左右先名早車空林森']);

export function problemsIn(DATA, { photoExists = () => true } = {}) {
  const bad = [];
  const add = (id, msg) => bad.push(`${id}: ${msg}`);

  const placeKeys = new Set((DATA.places || []).map((p) => p.key));
  const kindKeys = new Set((DATA.kinds || []).map((k) => k.key));
  const ids = new Set();

  if (!Array.isArray(DATA.animals) || DATA.animals.length === 0) {
    return ['data/animals.js に animals がありません'];
  }

  for (const a of DATA.animals) {
    const id = a.id || '(id なし)';

    for (const f of ['id', 'name', 'yomi', 'place', 'kind', 'placeS', 'bodyS', 'howS',
                     'naze', 'sumika', 'size', 'tabemono', 'itsu', 'nakama', 'karada',
                     'motto', 'photo']) {
      if (a[f] === undefined || a[f] === null || a[f] === '') add(id, `${f} がありません`);
    }
    if (!a.id) continue;

    if (ids.has(a.id)) add(id, 'id が ほかと 同じです');
    ids.add(a.id);

    if (!placeKeys.has(a.place)) add(id, `place "${a.place}" が places の一覧にありません`);
    if (!kindKeys.has(a.kind)) add(id, `kind "${a.kind}" が kinds の一覧にありません`);

    const texts = [a.placeS, a.bodyS, a.howS, a.naze, a.sumika, a.tabemono,
                   a.itsu, a.nakama, a.karada, ...(a.motto || [])].filter(Boolean);
    const all = texts.join('');

    /* 2. こたえの 3 文 */
    for (const rule of RULES) {
      const s = String(a[rule.key] || '');
      if (!s) continue;
      if (!rule.ends.some((e) => s.endsWith(e))) {
        add(id, `${rule.name} が「${rule.ends.join('」「')}」の どれでも 終わって いません → 「${s.slice(-16)}」`);
      }
      if (s.length > 110) add(id, `${rule.name} が ながすぎます（${s.length}字）`);
    }
    if (a.placeS && a.name && !a.placeS.startsWith(`${a.name}が、`)) add(id, `①は「${a.name}が、…」で 始めて ください`);
    if (a.bodyS && a.name && !a.bodyS.startsWith(`${a.name}は、`)) add(id, `②は「${a.name}は、…」で 始めて ください`);

    /* ③は「〜て、かくれます。」。おわり方だけでなく、その 前の て形まで 見る。
       ⚠️ 「その 中に かくれます。」でも おわり方の 判定は 通って しまう。
          子どもは この 形を そのまま まねして 書くので、1 ひきでも
          ちがう 形が まざると、それを えらんだ 子だけ 手が 止まる。
          2026-11-08、ジグモ 1 ひきが この 形から 外れて いた。 */
    if (a.howS && !/(て|で)、かくれます。$/.test(a.howS)) {
      add(id, `③は「〜て、かくれます。」の 形に して ください → 「${a.howS.slice(-14)}」`);
    }

    /* 名前を ひらがなで さがせるか。1年生は ひらがなで 打つ。
       ⚠️ yomi が 名まえと ずれて いると、その 1 ひきだけ 見つからない。 */
    if (a.yomi && !/^[ぁ-んー]+$/.test(a.yomi)) add(id, `yomi は ひらがなだけに して ください → 「${a.yomi}」`);
    if (a.yomi && a.name) {
      const hira = [...a.name].map((c) => {
        const n = c.codePointAt(0);
        return (n >= 0x30a1 && n <= 0x30f6) ? String.fromCodePoint(n - 0x60) : c;
      }).join('').replace(/\s/g, '');
      if (hira !== a.yomi) add(id, `yomi が 名まえと ずれて います（「${hira}」に なるはず）`);
    }

    if (Array.isArray(a.motto) && a.motto.length < 2) add(id, 'motto（もっと しりたい）が 2つ ありません');

    /* 3. 学年の 漢字 */
    const ng = [...new Set([...all].filter((c) => /[一-鿿]/.test(c) && !OK_KANJI.has(c)))];
    if (ng.length) add(id, `1年生に むずかしい 漢字が あります: ${ng.join(' ')}`);

    /* 4. 分かち書きの すきまは 半角で そろえる。
          ⚠️ 全角（U+3000）が まざると、見た目は 同じでも 終わり方の
             判定が 通らなく なる。どちらかに 決めて 機械で 見張る。 */
    if (/　/.test(all)) add(id, '全角の すきま（U+3000）が まざって います。半角に そろえて ください');

    /* 6. 写真 */
    const p = a.photo || {};
    if (!p.file) add(id, '写真の ファイル名が ありません');
    else if (!photoExists(p.file)) add(id, `写真 photos/${p.file} が 見つかりません`);
    const lic = String(p.license || '').toLowerCase();
    if (!lic) add(id, '写真の ライセンスが 書かれて いません');
    else if (!OK_LICENSE.some((k) => lic.startsWith(k))) {
      add(id, `つかえない ライセンスです: ${p.license}`);
    } else if (!NO_ATTRIBUTION_NEEDED.some((k) => lic.startsWith(k)) && !p.by) {
      add(id, `${p.license} は 作者を 出すのが きまりです（photo.by がありません）`);
    }
    if (!p.source || !/^https:\/\/(commons\.wikimedia\.org|upload\.wikimedia\.org)/.test(p.source)) {
      add(id, '写真の 出どころ（Wikimedia Commons の ページ）が ありません');
    }
    if (p.w && p.h && (p.w < 400 || p.h < 300)) add(id, `写真が 小さすぎます（${p.w}×${p.h}）`);
  }

  /* 7. ばしょ ごとの かたより */
  for (const p of DATA.places || []) {
    const n = DATA.animals.filter((a) => a.place === p.key).length;
    if (n < 4) bad.push(`ばしょ「${p.label}」が ${n} ひきしか ありません（4 ひき以上に して ください）`);
  }

  return bad;
}

function main() {
  const DATA = loadWindowFile('data/animals.js').KAKURENBO;
  const bad = problemsIn(DATA || {}, {
    photoExists: (f) => existsSync(new URL('photos/' + f, ROOT)),
  });

  const n = (DATA && DATA.animals && DATA.animals.length) || 0;
  console.log(`■ 生きもの ${n} ひきぶんの データを 見ました`);
  if (bad.length === 0) {
    console.log('  ok   教材文の型・写真の ライセンス・ばしょの わりふり、ずれは ありません');
    console.log('\n✅ すべて通りました');
    return 0;
  }
  for (const line of bad) console.log(`  FAIL ${line}`);
  console.log(`\n❌ ${bad.length} 件 なおして ください`);
  return 1;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  process.exit(main());
}
