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

/* ⚠️ わくの かたちを ここで しめて おく。
      app.js の samplePieces() は、おてほんを 見せる ときに
      この わく（あたまの「〇〇が、」「〇〇は、」と、おわりの ことば）を
      ちょうど この 字で はずして、中みだけを らんの 下に 出す。
      1 ひきでも わくから 外れると、その ひきだけ おてほんが
      文 まるごとに なり、うつした 子の ぶんが 二重に なる。
      ゆるい 判定（'います。' だけ 見る など）に 戻さない こと。 */
const RULES = [
  { key: 'placeS', name: '①どこに', ends: ['に かくれて います。'] },
  { key: 'bodyS',  name: '②からだの とくちょう', ends: ['を もって います。', 'ことが できます。'] },
  { key: 'howS',   name: '③どのように かくれるか', ends: ['かくれます。'] },
];

/* 再利用して よい ライセンスの 正本は content/licenses.json。
   名まえ ぴったりで 見る（ばんごうまで ふくめて）。
   ⚠️ あたまの もじ あわせ（startsWith）に 戻さない こと。
      "CC BY-SA 2.0 de" は CC BY-SA 2.0 とは べつの ライセンスなのに、
      あたま あわせだと 同じ ものとして 通る。2026-11-09 まで そう なって
      いて、ドイツ版の 条件を 本家の 条件として 出して いた。
   ⚠️ GFDL は ここに 入れない。GFDL は「ライセンスの 全文を いっしょに
      くばる」のが 条件で、この repo に 全文は 入って いない。
      入れたい ときは まず 全文を 置く。 */
export const LICENSES = JSON.parse(
  readFileSync(new URL('content/licenses.json', ROOT), 'utf8'),
);

/* 作者の 欄に まざって いたら 落とす もの。
   ⚠️ どれも Commons の テンプレートの のこりかすで、人の 名まえでは ない。
      2026-11-09 に 「Stefan.Kuemmel ( )」「Koolah ( talk )」「:ja:user:Dieno」
      の 3 件が 画面に 出て いた。作者を 出すのが 条件の 写真で、その
      名まえが こわれて いる のは 条件を みたして いない のと 同じ。 */
const BY_JUNK = [
  { re: /\(\s*\)/, why: '中みの ない かっこ' },
  { re: /\(\s*talk\s*\)/i, why: 'しょめいテンプレートの のこり（talk）' },
  { re: /\buser\s*:/i, why: 'ウィキの つなぎ（user:）' },
  { re: /\[\[|\]\]/, why: 'ウィキの かっこ' },
  { re: /[<>]/, why: 'HTML の のこり' },
  { re: /^\s*(self|own work|assumed)\s*$/i, why: '人の 名まえでは ない' },
];

/* 1年生の 9 月までに 出会う 漢字だけ。それ以外は ひらがなで 書く。 */
export const OK_KANJI = new Set([...'大小上下中手足木花水土石目口白赤青見日月人火気生出入子女男山川田左右先名早車空林森']);

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
                     'motto', 'sources', 'photo']) {
      if (a[f] === undefined || a[f] === null || a[f] === '') add(id, `${f} がありません`);
    }
    if (!a.id) continue;

    if (ids.has(a.id)) add(id, 'id が ほかと 同じです');
    ids.add(a.id);

    if (!placeKeys.has(a.place)) add(id, `place "${a.place}" が places の一覧にありません`);
    if (!kindKeys.has(a.kind)) add(id, `kind "${a.kind}" が kinds の一覧にありません`);

    /* ⚠️ 画面に 出る 欄を 1 つ でも 外さない。
          size は くわしい ページの 表に かならず 出る 欄で、
          photo.caption は 写真の alt（読み上げに のる）。
          2026-11-09 まで この 2 つが 漢字検査の 外に あり、
          「体長」「全長」と 書いても 黙って 通る 形に なって いた。 */
    const texts = [a.placeS, a.bodyS, a.howS, a.naze, a.sumika, a.size, a.tabemono,
                   a.itsu, a.nakama, a.karada, (a.photo || {}).caption,
                   ...(a.motto || [])].filter(Boolean);
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

    /* 出どころは 2 つ 以上。
       ⚠️ README.md と for-teachers.html と terms.html の 3 か所が
          「数は、2 つ以上の 出どころで そろった ものだけ」と 読む 人に
          約束して いる。1 つしか 無い カードでは、その 約束が 果たせない。
          2026-11-09 に 数えたら 5 ひきが 1 つだけ で、しかも 5 ひき とも
          数を のせて いた。 */
    if (!Array.isArray(a.sources) || a.sources.length < 2) {
      add(id, `しらべた もとが ${(a.sources || []).length} つ しか ありません（2 つ 以上に して ください）`);
    }
    for (const u of a.sources || []) {
      if (!/^https:\/\//.test(String(u))) add(id, `しらべた もとは https:// から 始めて ください → ${u}`);
    }

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
    const L = LICENSES[p.license];
    if (!p.license) add(id, '写真の ライセンスが 書かれて いません');
    else if (!L) {
      add(id, `つかえない ライセンスです: ${p.license}（content/licenses.json に 無い）`);
    } else {
      if (L.attribution && !p.by) {
        add(id, `${p.license} は 作者を 出すのが きまりです（photo.by がありません）`);
      }
      if (!p.licenseUrl) add(id, `${p.license} の 本文の URL が ありません（licenses.json から 入ります）`);
      else if (p.licenseUrl !== L.url) add(id, `licenseUrl が licenses.json と ちがいます: ${p.licenseUrl}`);
    }
    for (const j of BY_JUNK) {
      if (p.by && j.re.test(p.by)) add(id, `作者の 欄に ${j.why} が のこって います → 「${p.by}」`);
    }
    /* かくれて いる ところの しゃしんが 見つからなかった ものは、
       photo.notHiding: true と 書いて、カードに その ことを 出す。
       ⚠️ 文字れつや 1 を 書くと、見た目は 通るのに 画面には 出ない。 */
    if (p.notHiding !== undefined && typeof p.notHiding !== 'boolean') {
      add(id, 'photo.notHiding は true か false だけに して ください');
    }
    if (!p.source || !/^https:\/\/(commons\.wikimedia\.org|upload\.wikimedia\.org)/.test(p.source)) {
      add(id, '写真の 出どころ（Wikimedia Commons の ページ）が ありません');
    }
    if (p.w && p.h && (p.w < 400 || p.h < 300)) add(id, `写真が 小さすぎます（${p.w}×${p.h}）`);
  }

  /* 7. ばしょ・かくれかた ごとの かたより
        ⚠️ かくれかたにも 同じ 下限を かける。ばしょだけに かけて いた あいだ、
           「ひかりを つかう」と「すきとおる」が 2 ひきずつ しか なかった。
           1クラス 30 人が そこを えらぶと、2 ひきを とりあう ことに なる。 */
  for (const [what, list, key] of [['ばしょ', DATA.places, 'place'],
                                   ['かくれかた', DATA.kinds, 'kind']]) {
    for (const p of list || []) {
      const n = DATA.animals.filter((a) => a[key] === p.key).length;
      if (n < 4) bad.push(`${what}「${p.label}」が ${n} ひきしか ありません（4 ひき以上に して ください）`);
    }
  }

  /* 8. ばしょ・かくれ方の 名まえ。
        ⚠️ ここは 子どもが 自分で おす ボタンの 字。2026-11-09 まで
           漢字検査の 外に あり、「もぐる・かくれ家」（家 = 2年生）が
           19 ひきぶんの ボタンと カードに 出て いた。
           読めない 字の ボタンは 子どもが おさない。 */
  /* 9. ばしょの 絵（glyph）。
        ⚠️ app.js が 画面へ 入れる SVG の 中み。2026-11-09 まで
           innerHTML で そのまま 入れて いて、どの 検査も glyph を
           1 字も 見て いなかった。`<image href="https://…">` の 1 行で
           一覧を ひらく たびに 外の ホストを 取りに 行く 形に なる。
           app.js は いま ゆるす 形だけを 作りなおすが、
           **データの 側でも 止める**（検査が 2 か所に あるのが 正しい）。 */
  const GLYPH_TAGS = new Set(['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'g']);
  for (const p of DATA.places || []) {
    const g = String(p.glyph || '');
    if (!g) { bad.push(`ばしょ「${p.label}」に glyph が ありません`); continue; }
    for (const m of g.matchAll(/<\s*\/?\s*([a-zA-Z][\w:-]*)/g)) {
      if (!GLYPH_TAGS.has(m[1].toLowerCase())) {
        bad.push(`ばしょ「${p.label}」の glyph に つかえない タグが あります: <${m[1]}>`);
      }
    }
    if (/\b(href|xlink:href|src|srcset|style)\s*=/i.test(g)) {
      bad.push(`ばしょ「${p.label}」の glyph に href / src / style は 書けません`);
    }
    if (/\bon[a-z]+\s*=/i.test(g)) {
      bad.push(`ばしょ「${p.label}」の glyph に on… の しかけは 書けません`);
    }
    if (/https?:|\/\/|data:|javascript:/i.test(g)) {
      bad.push(`ばしょ「${p.label}」の glyph に 外への つなぎが あります`);
    }
  }

  for (const [label, list] of [['ばしょ', DATA.places], ['かくれ方', DATA.kinds]]) {
    for (const k of list || []) {
      const t = [k.label, k.teach].filter(Boolean).join('');
      const ng = [...new Set([...t].filter((c) => /[一-鿿]/.test(c) && !OK_KANJI.has(c)))];
      if (ng.length) bad.push(`${label}「${k.label}」に 1年生に むずかしい 漢字が あります: ${ng.join(' ')}`);
      if (/　/.test(t)) bad.push(`${label}「${k.label}」に 全角の すきま（U+3000）が あります`);
    }
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
