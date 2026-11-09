# つかいかた — しぜんの かくれんぼ ずかん

小学1年生 国語「うみのかくれんぼ」の**ひろげる・かく**場面で、
図書室の図鑑のかわりに材料を集めるための Web アプリです。

子ども向けの案内は画面の中にあります。ここは**先生と、直す人**のための手引きです。
授業での位置づけ・安全の注意・にほんにいる生きものの数は
[`for-teachers.html`](./for-teachers.html)（アプリの中の「先生へ」）が正本です。

---

## 1. 1 時間の流れ（35 人・1 人 1 台）

| | 画面ですること | ボタン |
| --- | --- | --- |
| ① えらぶ | ばしょ（8 つ）とかくれ方（6 つ）でしぼる。ひらがなで名前さがしもできる | 上のタブ／さがすらん |
| ② 見る | カードをおすと、写真・3 つの文・図鑑と同じくわしい情報が出る | カード |
| ③ 聞く | 名前と 3 つの文と「なぜ かくれるの？」を読みあげる | こえで きく |
| ④ 書く | 同じ画面の下のらんに、まねして書く | おてほんを 見る |
| ⑤ 出す | できた文をコピー、または紙に出す | コピー／いんさつ |

**いんさつ**すると「かくれんぼカード」（書いた 3 つの文＋絵をかくらん）になります。
カードをひらかずに `Ctrl+P` を押したときは、白紙ではなく案内の 1 行が出ます。

---

## 2. 画面のボタン

| ボタン | 何が起きるか |
| --- | --- |
| **① どこの かくれんぼ** | ばしょでしぼる。「ぜんぶ」はいつでも押せる |
| **② かくれかた** | かくれ方でしぼる。はじめの 3 つが教材文に出てくる型 |
| **にほんの 生きものだけ** | 76 → 62 ひき。実物をさがす活動につなげるとき |
| **なまえを かくす** | 名前・ばしょ・かくれ方をかくす。**読みあげにも名前が出ません** |
| **こえで きく** | 名前＋3 つの文＋「なぜ」。表と「もっと しりたい」は読みません |
| **おてほんを 見る** | らんに入れる中身だけを出す（わくの文は入れない） |
| **ぜんぶ けす**（カードの中） | **その 1 ひきぶん**の下書きを消す |
| **かいた ぶんを ぜんぶ けす**（いちばん下） | **この端末の下書きを全部**消す。次の子にわたす前に |

### 「かくれて いない」のしるし

かくれたすがたの写真が Wikimedia Commons にない生きもの（土の中のアズマモグラ、
ふかい海のホタルイカなど）が **76 枚中 17 枚**あります。
その写真には一覧の左下に「かくれて いない」のしるしが付き、
ひらいたページにも 1 行出ます。**しるしは「なまえを かくす」の最中も消えません**
（名前は出ないので、話しあいの答えにはなりません）。

---

## 3. 教室に出す前に

- **オフラインで使う日の前に、一覧をいちばん下までスクロールしておく。**
  画面（文字・レイアウト・データ）は 1 回ひらけばオフラインで動きますが、
  **写真は一度画面に出したぶんだけ**端末に残ります（76 枚で約 6MB。
  更新のたびに全部取りなおさない作りです）。
- **1 台を順番に使うときは、「かいた ぶんを ぜんぶ けす」を押してからわたす。**
- 書いたものは**その端末の中だけ**に残ります。外へは何も送りません。
  名前・クラスを書かせないでください（画面にもその注意が出ます）。
- 校内のフィルタリング: アプリ自体は**外から 1 つも読み込みません**。
  ただし「しゃしんの 出どころ」のリンク（Wikimedia Commons、Wikipedia など
  66 ホスト）を子どもがひらくときは、そちらの許可が要ります。
  一覧は `for-teachers.html` の「出どころのリンク」にあります。

---

## 4. 直す人へ

### 中身を直す

| 直すもの | ファイル |
| --- | --- |
| 生きものの文・数・出どころ | `content/animals/<ばしょ>.json` |
| 写真のライセンス・作者・せつめい | `content/photos.json` |
| ばしょ・かくれ方のラベルと絵 | `content/places.json` / `content/kinds.json` |
| つかってよいライセンス | `content/licenses.json` |

`data/animals.js` と `credits.html` は**生成物**です。手で直さないでください。

### 直したあとに走らせる順

⚠️ **`build-sw.mjs` はいちばん最後。** 版は配信物の中身から作るので、
通したあとに 1 文字直すと合わなくなります。

```bash
node tools/build-animals.mjs          # content/ → data/animals.js
node tools/build-credits.mjs          # content/ → credits.html
node tools/check-photos.mjs           # photos/ の中身 → sw.js の PHOTOS_VERSION

node --test tools/*.test.mjs          # 検査そのものの単体テスト
node tools/check-data.mjs             # 文の型・学年の漢字・写真のライセンス
node tools/check-text.mjs             # 子どもの画面に出る字
node tools/check-docs.mjs             # 先生へのページと README の数
node tools/check-no-external.mjs      # Zero-CDN
node tools/check-links.mjs            # ページの中のリンク
node scripts/check-standard.mjs       # GIGA Standard v5（正本の共通ゲート）

node ../GIGAyama.github.io/standards/check-drift.mjs \
     --standards ../GIGAyama.github.io/standards

node tools/build-sw.mjs               # ⚠️ いちばん最後
```

### 公開するとき

アドレスは **`https://hiding-animal.giga-school.com/`** です。

| | すること | 状態 |
| --- | --- | --- |
| 1 | `CNAME`（`hiding-animal.giga-school.com` の 1 行）を置く | ✅ 済み |
| 2 | ポータルの `data/apps.json` に 1 行足す（`hosts` は `[]`。出どころの `<a href>` は読み込みではないので入れない） | ✅ ポータルの PR |
| 3 | ポータルのトップにカードを足し、件数をそろえて `node tools/check-cards.mjs` を通す | ✅ ポータルの PR |
| 4 | **GitHub Pages を有効にする**（このリポジトリの Settings → Pages → Source: *Deploy from a branch*、Branch: 既定ブランチ／`/ (root)`） | ⏳ 手で |
| 5 | **DNS に CNAME レコードを足す**（`hiding-animal` → `gigayama.github.io`） | ⏳ 手で |
| 6 | Pages の画面で Custom domain が `hiding-animal.giga-school.com` になり、**Enforce HTTPS** に チェックが入るのを待つ | ⏳ 手で |

⚠️ **giga-school.com の DNS にワイルドカードはありません**（2026-11-09 に
`zz-no-such-app-xyz.giga-school.com` が NXDOMAIN になることで確かめた）。
アプリごとに CNAME レコードが 1 本ずつ要ります。

⚠️ **4〜6 が済むまで、ポータルの PR はマージしないでください。** 先にマージすると、
giga-school.com のトップに「開く」を押しても開かないカードが出ます。

たしかめ方（4〜6 のあと）:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://hiding-animal.giga-school.com/   # 200
curl -sS https://hiding-animal.giga-school.com/sw.js | grep APP_VERSION            # 手元と同じ版
```
