#!/usr/bin/env node
/* =====================================================================
 * tools/check-docs.mjs — 手で 書いた ページが、データと 合うか
 * =====================================================================
 * 使い方:
 *   node tools/check-docs.mjs
 *
 * 見るのは index.html・for-teachers.html・README.md の 3 本。
 * credits.html は tools/build-credits.mjs が 組むので ここでは 見ない
 * （組みなおせば かならず 合う）。
 *
 * ── なぜ 要るのか ────────────────────────────────────
 *
 * ① 書いた 数が、だまって 古く なる
 *
 * for-teachers.html と README.md には「75 ひき」「61 ひき」「76 枚」
 * のような 数が 直に 書いて ある。生きものを 1 ひき 足すだけで ぜんぶ
 * ずれるのに、2026-11-09 まで それを 見る 道具が 1 本も 無かった。
 * 実際、シロウオを 足した あと「75 ひき」「61 ひき」が のこって いた。
 * 先生は この ページを 読んで 授業を 組むので、ここが ずれると
 * 「にほんの 生きものだけ」を おした あとの 画面と 数が 合わなく なる。
 *
 * ② 安全の ちゅういが、片方だけ 直る
 *
 * カードの「からだの ようす」に 「さわらないで」「つかまないで」と
 * 書いた 生きものは、先生へ の ページにも ならべて ある。ところが
 * 2026-11-09 に 数えたら、ニホンアマガエル（はだに どく）・ジグモ・
 * ライチョウの 3 ひきが カードにだけ あって、先生へ の ページに
 * 無かった。実物を さがす 活動の まえに 先生が 読むのは あちらなので、
 * **カードにしか 無い ちゅういは、教室には とどかない。**
 *
 * ⚠️ ここは「書いて ある 字」と「データ」を つき合わせるだけ。
 *    文の うまさは 見ない。見られるのは ずれだけ。
 * ===================================================================== */
import { readFileSync, readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('..', import.meta.url);
const read = (f) => readFileSync(new URL(f, ROOT), 'utf8');

/** カードが 子どもに 「こう して ください」と 言って いる ことば。
 *  ⚠️ ここに 当たった 生きものは、先生へ の ページにも 名まえが
 *     要る。ことばを 足す ときは、本当に 行いを もとめて いるかを
 *     見る こと。「はさんで まもります」のような ただの 説明を
 *     入れると、ぜんぶの 生きものが ここに 来て 意味が なくなる。 */
export const CAUTION_PHRASES = [
  'さわらないで', 'さわったら', 'つかまないで', 'つかまずに',
  '見るだけに', '目で 見ます', 'よらないで', 'ひっぱらないで',
  'もとに もどして',
];

export function loadData({ readFile = read, listAnimals } = {}) {
  const dir = listAnimals
    ? listAnimals()
    : readdirSync(new URL('content/animals/', ROOT)).filter((f) => f.endsWith('.json'));
  const animals = [];
  for (const f of dir.sort()) animals.push(...JSON.parse(readFile('content/animals/' + f)));
  return {
    animals,
    photos: JSON.parse(readFile('content/photos.json')),
    places: JSON.parse(readFile('content/places.json')),
  };
}

/** データから、文に 書いて ある はずの 数を 作る。 */
export function numbersOf({ animals, photos, places }) {
  const byPlace = (key) => animals.filter((a) => a.place === key);
  return {
    all: animals.length,
    jp: animals.filter((a) => a.inJapan).length,
    notJp: animals.filter((a) => !a.inJapan).length,
    photos: Object.keys(photos).length,
    notHiding: Object.values(photos).filter((p) => p.notHiding).length,
    places: places.length,
    sabaku: byPlace('sabaku').length,
    sabakuNotJp: byPlace('sabaku').filter((a) => !a.inJapan).length,
    yuki: byPlace('yuki').length,
    yukiNotJp: byPlace('yuki').filter((a) => !a.inJapan).length,
  };
}

/* 文の 中の どの 数が、どの 数と 合って いなければ ならないか。
   ⚠️ まわりの 字ごと 書く こと。「76」だけを さがすと、たまたま
      同じ 数の べつの 話に 当たって、直しても 直しても 赤く なる。 */
export const CLAIMS = [
  ['for-teachers.html', /(\d+) 枚の うち (\d+) 枚が これに あたります/, ['photos', 'notHiding']],
  ['for-teachers.html', /(\d+) 枚で 約 \d+MB/, ['photos']],
  ['for-teachers.html', /そうすると (\d+) 枚すべてが/, ['photos']],
  ['for-teachers.html', /(\d+) ひきの うち (\d+) ひきは、にほんに いない/, ['all', 'notJp']],
  ['for-teachers.html', /さばく は (\d+) ひきの うち (\d+) ひき/, ['sabaku', 'sabakuNotJp']],
  ['for-teachers.html', /ゆき・こおり は (\d+) ひきの うち (\d+) ひき/, ['yuki', 'yukiNotJp']],
  ['for-teachers.html', /にほんで 見られる (\d+) ひきだけが/, ['jp']],
  ['index.html', /(\d+) まいの しゃしんの とった 人/, ['photos']],
  ['README.md', /生きもの \*\*(\d+) ひき\*\*/, ['all']],
  ['README.md', /^(\d+) つのばしょ/m, ['places']],
];

export function problemsIn({ readFile = read, data } = {}) {
  const d = data || loadData({ readFile });
  const n = numbersOf(d);
  const bad = [];

  for (const [file, re, keys] of CLAIMS) {
    const m = re.exec(readFile(file));
    if (!m) {
      bad.push(`${file}: 「${re.source}」に あたる 文が ありません。`
        + '文を 書きかえた なら、tools/check-docs.mjs の CLAIMS も 直して ください');
      continue;
    }
    keys.forEach((k, i) => {
      const said = Number(m[i + 1]);
      if (said !== n[k]) {
        bad.push(`${file}: 「${m[0]}」の ${said} が データと ちがいます（いまは ${n[k]}）`);
      }
    });
  }

  /* カードが 言って いる ちゅういが、先生へ の ページに ならんで いるか */
  const ft = readFile('for-teachers.html');
  for (const a of d.animals) {
    const t = (a.karada || '') + ' ' + (a.motto || []).join(' ');
    const hit = CAUTION_PHRASES.filter((p) => t.includes(p));
    if (hit.length && !ft.includes(a.name)) {
      bad.push(`for-teachers.html: ${a.name} の ちゅうい（${hit[0]}）が カードにしか ありません。`
        + '実物を さがす 活動の まえに 先生が 読むのは この ページです');
    }
  }
  return bad;
}

function main() {
  const bad = problemsIn();
  console.log('■ 手で 書いた ページ（index / 先生へ / README）が、データと 合うかを 見ました');
  if (bad.length === 0) {
    console.log('  ok   数も、安全の ちゅういの ならびも、データと そろって います');
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
