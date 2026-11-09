#!/usr/bin/env node
/* =====================================================================
 * tools/check-photos.mjs — 写真そのものを 見る／写真の 版を 刻む
 * =====================================================================
 * 使い方:
 *   node tools/check-photos.mjs           sw.js の PHOTOS_VERSION を 書きかえる
 *   node tools/check-photos.mjs --check   書きかえず、ずれて いたら 落ちる（CI 用）
 *
 * ── なぜ 要るのか ────────────────────────────────────
 *
 * ① 写真の 控えが 古いまま のこる
 *
 * sw.js は 写真を「名まえが 同じなら 中みも 同じ」と 見なして、
 * 一度 控えに 入れたら 二度と 取りなおさない（6.5MB を 文の 直しの たびに
 * 取りなおさない ため）。ところが 2026-11-09、写真 14 まいを
 * **名まえは そのままで 中みだけ** 入れかえた。
 * その とき 控えの 名まえ（PHOTOS）を 上げなかったので、
 * 一度でも ひらいた 端末は はく製の ユキウサギを 出しつづける。
 * sw.js 自身の 注意書きが「差しかえる ときは ファイル名を かえる」と
 * 言って いたのに、次の コミットで 書いた 本人が それを 破った。
 * **人が おぼえて おく きまりは、いつか かならず 破られる。** 機械で 刻む。
 *
 * ⚠️ APP_VERSION（骨組みの 版）に まぜない こと。あちらは data/animals.js を
 *    ふくむので、文を 1 字 直すだけで かわる。まぜると 写真 6.5MB を
 *    毎回 取りなおす ことに なり、35 台の 教室で 1 時間が 終わる。
 *
 * ② 写真の 中みを 見る 検査が 1 本も 無かった
 *
 * 2026-11-09 に ためしたら、photos/yukiusagi.jpg を 30 バイトの ごみに
 * 置きかえても、検査 7 本と 単体テスト 91 本が ぜんぶ 緑の まま だった。
 * どの 道具も photos/*.jpg を バイトとして 開いて いなかった。
 * content/photos.json の w / h も 実寸と 突き合わせて いなかった。
 * ===================================================================== */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('..', import.meta.url);
const SW = new URL('sw.js', ROOT);
const LINE = /^const PHOTOS_VERSION = '([^']*)'; \/\* __PHOTOS_VERSION__ \*\/$/m;

/* カードの いちばん 上に 大きく 出る 1 まいなので、小さすぎる ものは 出さない。
   check-data.mjs の 下限（400×300）と そろえる。 */
const MIN_W = 400;
const MIN_H = 300;

/** JPEG の 実寸を ヘッダから 読む。
 *  ⚠️ content/photos.json に 書いて ある w/h を 信じない こと。
 *     あれは 落とした ときに 書いた 数で、あとから 切りぬいたり
 *     差しかえたり すると 合わなく なる。 */
export function jpegSize(buf) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) { i += 1; continue; }
    const marker = buf[i + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
    if (marker === 0xd9 || marker === 0xda) return null;        // 画像データに 入った
    const len = buf.readUInt16BE(i + 2);
    const isSOF = (marker >= 0xc0 && marker <= 0xcf)
      && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;  // DHT / JPG / DAC は ちがう
    if (isSOF) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return null;
}

/** 写真 1 まいずつを 見る。 */
export function problemsIn(photos, { readPhoto, listPhotos }) {
  const bad = [];
  const used = new Set();
  for (const [id, p] of Object.entries(photos)) {
    const f = p.file;
    if (!f) { bad.push(`${id}: file が ありません`); continue; }
    used.add(f);
    let buf;
    try { buf = readPhoto(f); }
    catch (e) { bad.push(`${id}: photos/${f} が 読めません`); continue; }
    if (buf.length < 4000) {
      bad.push(`${id}: photos/${f} が 小さすぎます（${buf.length} バイト）。こわれて いませんか`);
      continue;
    }
    const size = jpegSize(buf);
    if (!size) {
      /* ⚠️ 大きさだけで 見ない こと。Wikimedia は 上限や 400 の とき
         「Wikimedia Error」の HTML を HTTP 200 で 返す（3267 バイトほど）。 */
      bad.push(`${id}: photos/${f} が JPEG に なって いません（中みを 見ました）`);
      continue;
    }
    if (p.w !== size.w || p.h !== size.h) {
      bad.push(`${id}: photos/${f} の 大きさが content/photos.json と ちがいます`
        + `（ファイルは ${size.w}×${size.h} / 書いて あるのは ${p.w}×${p.h}）`);
    }
    if (size.w < MIN_W || size.h < MIN_H) {
      bad.push(`${id}: photos/${f} が 小さすぎます（${size.w}×${size.h}）`);
    }
  }
  /* つかって いない 写真が のこって いないか。
     のこすと 配信物が ふくらみ、出どころの 一覧とも 合わなく なる。 */
  for (const f of listPhotos()) {
    if (!used.has(f)) bad.push(`photos/${f} は content/photos.json の どこからも つかわれて いません`);
  }
  return bad;
}

/** 写真の 版。名まえと 中みの 両方を 混ぜる。
 *  ⚠️ 名まえだけ では だめ。今回の 事故は「名まえは そのままで 中みだけ
 *     かえた」ので、名まえだけ 混ぜても 版は かわらない。 */
export function versionOf(photos, readPhoto) {
  const hash = createHash('sha256');
  for (const f of Object.values(photos).map((p) => p.file).filter(Boolean).sort()) {
    hash.update(f);
    hash.update('\0');
    hash.update(readPhoto(f));
    hash.update('\0');
  }
  return `p${hash.digest('hex').slice(0, 8)}`;
}

function main() {
  const check = process.argv.includes('--check');
  const photos = JSON.parse(readFileSync(new URL('content/photos.json', ROOT), 'utf8'));
  const readPhoto = (f) => readFileSync(new URL('photos/' + f, ROOT));
  const listPhotos = () => readdirSync(new URL('photos/', ROOT)).filter((f) => !f.startsWith('.'));

  console.log(`■ 写真 ${Object.keys(photos).length} 枚の 中みを 見ました`);
  const bad = problemsIn(photos, { readPhoto, listPhotos });
  if (bad.length) {
    for (const b of bad) console.log('  FAIL ' + b);
    console.log(`\n❌ ${bad.length} 件`);
    return 1;
  }
  console.log('  ok   ぜんぶ JPEG で、大きさも content/photos.json と そろって います');

  const version = versionOf(photos, readPhoto);
  const source = readFileSync(SW, 'utf8');
  const now = LINE.exec(source);
  if (!now) {
    console.log("  FAIL sw.js に 版の 行が ありません。次の 形で 入れて ください:");
    console.log("       const PHOTOS_VERSION = 'p0'; /* __PHOTOS_VERSION__ */");
    return 1;
  }
  if (now[1] === version) {
    console.log(`  ok   写真の 版は 最新です（${version}）`);
    console.log('\n✅ すべて通りました');
    return 0;
  }
  if (check) {
    console.log(`  FAIL 写真の 版が 中みと 合って いません（いま ${now[1]} / あるべき ${version}）`);
    console.log('       `node tools/check-photos.mjs` を 走らせてから コミットして ください。');
    console.log('       ここが ずれた ままだと、入れかえた 写真が 端末に 届きません。');
    return 1;
  }
  writeFileSync(SW, source.replace(LINE, `const PHOTOS_VERSION = '${version}'; /* __PHOTOS_VERSION__ */`), 'utf8');
  console.log(`  ok   写真の 版を 上げました: ${now[1]} → ${version}`);
  console.log('\n✅ すべて通りました');
  return 0;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  process.exit(main());
}

export { ROOT, MIN_W, MIN_H };
export const _existsSync = existsSync;
