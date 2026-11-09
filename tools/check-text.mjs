#!/usr/bin/env node
/* =====================================================================
 * tools/check-text.mjs — 子どもの 画面に 出る 字を 見る
 * =====================================================================
 * 使い方:
 *   node tools/check-text.mjs
 *
 * ── なぜ 要るのか ────────────────────────────────────
 *
 * tools/check-data.mjs が 見て いるのは data/animals.js の 中の 文だけ。
 * ところが 子どもが 画面で 読む 字は、それだけでは ない。
 *
 *   ・index.html の 字（見出し・ボタン・おしらせ・フッター）
 *   ・app.js の 中の 字（らんの 説明・ボタンの 名まえ・aria-label）
 *
 * 2026-11-09 に 数えたら、ここに
 *   「おわり方」（方 = 2年生）・「件」（5年生）・
 *   「小学1年生 国語…書く 学習」（学・年・国・語・書・習）
 * が 入って いた。文の 側は 71ひき ぜんぶ きちんと できて いたのに、
 * **画面の 字を 見る 検査が どこにも 無かった**。
 *
 * ⚠️ 読む 力が いちばん 要るのは、らんの 説明と ボタンの 名まえ。
 *    文が 正しくても、ボタンが 読めなければ 子どもは おさない。
 *
 * ⚠️ 先生に 向けた ページ（for-teachers.html・terms.html・
 *    privacy.html・credits.html）は 見ない。あれは おとなが 読む もの。
 * ===================================================================== */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { OK_KANJI } from './check-data.mjs';

const ROOT = new URL('..', import.meta.url);

/* 子どもが 読む ところ。ここを 増やす ときは、本当に 子どもが 読むかを
   考える こと。おとなの ページを 入れると 検査が 鳴りつづけて 無視される。
   ⚠️ index.html が 読みこむ もので、画面に 字を 出す ものは ぜんぶ 入れる。
      install-hook.js は document.body へ 直に バーを さしこむのに
      2026-11-09 まで ここに 無く、「ホーム画面」「共有」「追加」が
      そのまま 子どもの 画面に 出て いた。 */
export const WATCHED = ['index.html', 'app.js', 'install-hook.js', 'offline.html'];

/* 画面に 出る ことが ある 属性。alt は 読み上げ、placeholder と
   aria-label と title は 目にも 耳にも のる。 */
const TEXT_ATTRS = ['alt', 'aria-label', 'placeholder', 'title'];

const CJK = /[぀-ヿ㐀-䶿一-鿿豈-﫿]/;
/* この ことばの あとの `/` は 割り算では なく 正規表現。 */
const KEYWORD_BEFORE_RE = /(?:^|[^\w$])(?:return|typeof|instanceof|in|of|new|delete|void|throw|case|do|else|yield|await)$/;
const KANJI = /[㐀-䶿一-鿿豈-﫿]/;

const unescapeHtml = (s) => String(s)
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

/** HTML から、画面に 出る 字だけを とり出す。 */
export function visibleTextIn(html) {
  const out = [];
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title) out.push(unescapeHtml(title[1]));

  /* <head> の <meta> は 画面に 出ない（けんさくの ための 字）。
     ⚠️ ここを 入れると description の 大人の 字で 鳴りつづける。 */
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : html;

  body = body.replace(/<!--[\s\S]*?-->/g, ' ');   // コメントは 作る 人の もの

  /* ページの 中に 直に 書いた <script> は、字の とり出しかたが ちがう。
     ⚠️ ここを ただ 落とすと、画面に 出る 字が 検査の 外に 出る。 */
  body = body.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (_m, code) => {
    out.push(...jsStringsIn(code));
    return ' ';
  });
  body = body.replace(/<style[\s\S]*?<\/style>/gi, ' ');

  /* 画面に 出る 属性を 先に 拾う（タグを 落とすと 消えて しまう）。 */
  for (const name of TEXT_ATTRS) {
    const re = new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'gi');
    let m;
    while ((m = re.exec(body)) !== null) out.push(unescapeHtml(m[1]));
  }

  /* タグの あいだの 字を 1 つずつ。
     ⚠️ まとめて 1 本に すると、どこの 字が だめなのか 伝わらない。 */
  for (const piece of body.split(/<[^>]*>/)) {
    /* ⚠️ \s で つめては いけない。JavaScript の \s は 全角スペース
       （U+3000）も 当てるので、下の 全角の 見はりが 何も 見つけなく なる。 */
    const t = unescapeHtml(piece).replace(/[\t\n\r ]+/g, ' ').trim();
    if (t) out.push(t);
  }
  return out.filter((s) => CJK.test(s));
}

/** JavaScript から、文字れつの 中みだけを とり出す（コメントは のぞく）。
 *
 * ⚠️ 正規表現を 使って 「'…'」を さがすだけでは だめ。コメントの 中の
 *    アポストロフィから 先が ぜんぶ 文字れつに 見えて、本当の 字を
 *    とりこぼす。1 字ずつ 読んで、いまが どこなのかを 持って あるく。
 */
export function jsStringsIn(js) {
  const out = [];
  const n = js.length;
  let i = 0;
  let prev = '';       // 直前の、すきまと コメントを のぞいた 1 字
  let prevWord = '';   // 直前の ことば（return / typeof など）
  while (i < n) {
    const c = js[i];
    // 行コメント
    if (c === '/' && js[i + 1] === '/') {
      while (i < n && js[i] !== '\n') i += 1;
      continue;
    }
    // ブロックコメント
    if (c === '/' && js[i + 1] === '*') {
      i += 2;
      while (i < n && !(js[i] === '*' && js[i + 1] === '/')) i += 1;
      i += 2;
      continue;
    }
    /* 正規表現リテラル。直前が 値を とる ところなら 割り算では ない。
       ⚠️ 記号だけで 見ては いけない。`return /["']/` の ように
          ことばの あとに くる 正規表現は 割り算と 読まれ、その 中の
          引用符から 先が ぜんぶ 文字れつに 見えて、本当の 字を 取りこぼす。
          2026-11-09 に 実測: `return /["']/.test(x)` の あとの
          `var a = "みつかるはず"` が 1 件も 返らなかった。 */
    if (c === '/' && (prev === '' || '=(,:[!&|?{};+~*%<>^'.includes(prev)
        || KEYWORD_BEFORE_RE.test(prevWord))) {
      i += 1;
      let cls = false;
      while (i < n) {
        if (js[i] === '\\') { i += 2; continue; }
        if (js[i] === '[') cls = true;
        else if (js[i] === ']') cls = false;
        else if (js[i] === '/' && !cls) break;
        else if (js[i] === '\n') break;
        i += 1;
      }
      i += 1;
      while (i < n && /[a-z]/.test(js[i])) i += 1;   // dgimsuy
      prev = '/';
      prevWord = '';
      continue;
    }
    // 文字れつ
    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      let buf = '';
      i += 1;
      while (i < n && js[i] !== quote) {
        if (js[i] === '\\') {
          const e = js[i + 1];
          buf += e === 'n' ? '\n' : e === 't' ? '\t' : e === 'u' ? '' : e;
          if (e === 'u') i += (js[i + 2] === '{' ? 0 : 4);
          i += 2;
          continue;
        }
        buf += js[i];
        i += 1;
      }
      i += 1;
      out.push(buf);
      prev = quote;
      prevWord = '';
      continue;
    }
    if (!/\s/.test(c)) {
      prev = c;
      prevWord = /[A-Za-z_$0-9]/.test(c) ? prevWord + c : '';
    }
    i += 1;
  }
  return out.filter((s) => CJK.test(s));
}

/** 1 本ぶんの 字の ならびを 見る。 */
export function problemsInTexts(label, texts) {
  const bad = [];
  for (const t of texts) {
    const ng = [...new Set([...t].filter((ch) => KANJI.test(ch) && !OK_KANJI.has(ch)))];
    if (ng.length) {
      bad.push(`${label}: 1年生が まだ 習わない 漢字です: ${ng.join(' ')}  → 「${t.trim().slice(0, 44)}」`);
    }
    if (/　/.test(t)) {
      bad.push(`${label}: 全角の すきま（U+3000）が まざって います → 「${t.trim().slice(0, 44)}」`);
    }
  }
  return bad;
}

export function problemsIn({ read }) {
  const bad = [];
  for (const f of WATCHED) {
    const src = read(f);
    const texts = f.endsWith('.html') ? visibleTextIn(src) : jsStringsIn(src);
    bad.push(...problemsInTexts(f, texts));
  }
  return bad;
}

function main() {
  const bad = problemsIn({ read: (f) => readFileSync(new URL(f, ROOT), 'utf8') });
  console.log(`■ 子どもの 画面に 出る 字を 見ました（${WATCHED.join(' / ')}）`);
  if (bad.length === 0) {
    console.log('  ok   つかって よい 漢字だけで できて います');
    console.log('\n✅ すべて通りました');
    return 0;
  }
  for (const b of bad) console.log('  FAIL ' + b);
  console.log(`\n❌ ${bad.length} 件`);
  return 1;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  process.exit(main());
}
