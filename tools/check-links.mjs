#!/usr/bin/env node
/* =====================================================================
 * tools/check-links.mjs — 配るページの中のリンクが生きているか
 * =====================================================================
 * 使い方: リポジトリのルートで `node tools/check-links.mjs`
 *
 * ── なぜ要るのか ──────────────────────────────────
 *
 * 1年生は、リンクが切れていても「切れている」と言えない。黙って手が止まる。
 * ページを 1 枚足すたびに、どこかの ./〜 が外れていないかを目で追うのは無理。
 *
 * ⚠️ 外（https://）へのリンクはここでは見ない。見に行けば通信が要るし、
 *    相手が落ちている日に CI が赤くなる。外へのリンクが「読み込み」に
 *    なっていないかは tools/check-no-external.mjs の担当。
 * ===================================================================== */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('..', import.meta.url);

/** html の中の、自分の側を指す道をぜんぶ返す */
export function localTargets(html) {
  const out = [];
  for (const re of [/\bhref\s*=\s*["']([^"']+)["']/g, /\bsrc\s*=\s*["']([^"']+)["']/g]) {
    for (const m of html.matchAll(re)) {
      const u = m[1].trim();
      /* ⚠️ スキームを省いた //cdn… を「自分の側」に数えないこと。
            数えると、外部CDN がここでは見逃され、しかも「ファイルが無い」
            としか出ないので、Zero-CDN 違反だと気づけない。 */
      if (/^(https?:)?\/\//.test(u)) continue;
      if (/^(data:|mailto:|tel:|#|blob:)/.test(u)) continue;
      const rel = u.replace(/^\.\//, '').split('#')[0].split('?')[0];
      if (rel === '') { out.push('index.html'); continue; }
      out.push(rel);
    }
  }
  return out;
}

export function problemsIn(pages, { exists, listPage }) {
  const bad = [];
  for (const p of pages) {
    if (!exists(p)) { bad.push(`${p}: ページが ありません`); continue; }
    for (const t of localTargets(listPage(p))) {
      if (!exists(t)) bad.push(`${p} → ${t}: 行き先が ありません`);
    }
  }
  return bad;
}

/** 配信される html を拾う（tools/ や docs/ は配られないので見ない） */
export function servedPages(root = ROOT) {
  return readdirSync(root).filter((f) => f.endsWith('.html')).sort();
}

function main() {
  const dir = new URL('.', ROOT);
  /* ⚠️ URL を 字の 道に 落とさない こと。pathname は 百分率で くるんで
        あるので、すきまを ふくむ 道（「My Repo」など）では %20 の まま
        のこり、existsSync が ぜんぶ false に なる。直す ところが 何も
        無いのに 5 枚 ぜんぶ「ページが ありません」で 落ちた。
        node:fs は URL を そのまま 受ける。
        （tools/build-sw.mjs も 同じ 型の 事故の 注意書きを もって いる。） */
  const abs = (p) => new URL(p, dir);
  const pages = servedPages(dir);
  const bad = problemsIn(pages, {
    exists: (p) => existsSync(abs(p)),
    listPage: (p) => readFileSync(abs(p), 'utf8'),
  });
  console.log(`■ ページ ${pages.length} 枚の 中の リンクを 見ました`);
  if (!bad.length) {
    console.log('  ok   きれて いる リンクは ありません');
    console.log('\n✅ すべて通りました');
    return 0;
  }
  for (const b of bad) console.log(`  FAIL ${b}`);
  console.log(`\n❌ ${bad.length} 件 なおして ください`);
  return 1;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  process.exit(main());
}
