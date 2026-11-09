/* =====================================================================
   data/animals.js — かくれんぼ名人の データ
   ---------------------------------------------------------------------
   ⚠️ このファイルは 組み立てた ものです。手で 直さないで ください。
      文を 直すとき   → content/animals/<ばしょ>.json
      写真を 直すとき → content/photos.json
      ばしょ・かくれ方 → content/places.json / content/kinds.json
      直したら `node tools/build-animals.mjs` を 走らせる。

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

(function (win) {
  'use strict';

  var places = [
    {
      "key": "umi",
      "label": "うみの 中",
      "glyph": "<path d=\"M2 15c4-2 6-2 10 0s6 2 10 0M2 19c4-2 6-2 10 0s6 2 10 0\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M9 5c3 0 5 3 5 6 0 2-2 4-5 4s-5-2-5-4c0-3 2-6 5-6z\" fill=\"currentColor\"/>"
    },
    {
      "key": "iso",
      "label": "うみべ・いそ",
      "glyph": "<path d=\"M2 18h20M4 18l4-7 3 4 3-6 4 9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linejoin=\"round\"/><circle cx=\"19\" cy=\"5\" r=\"2.5\" fill=\"currentColor\"/>"
    },
    {
      "key": "mizube",
      "label": "かわ・みずべ",
      "glyph": "<path d=\"M2 17c4-2 6-2 10 0s6 2 10 0\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M7 14V5M11 14V7M15 14V4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>"
    },
    {
      "key": "kusamura",
      "label": "くさむら",
      "glyph": "<path d=\"M4 21c0-7 2-11 4-14M12 21c0-8 0-13 0-16M20 21c0-7-2-11-4-14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\"/>"
    },
    {
      "key": "mori",
      "label": "もり・はやし",
      "glyph": "<path d=\"M12 21v-6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><path d=\"M12 2l6 9H6zM12 8l5 7H7z\" fill=\"currentColor\"/>"
    },
    {
      "key": "tsuchi",
      "label": "つち・おちば",
      "glyph": "<path d=\"M2 20h20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><path d=\"M6 16c0-4 3-7 7-7 0 4-3 7-7 7zM18 16c0-3-2-5-5-5 0 3 2 5 5 5z\" fill=\"currentColor\"/>"
    },
    {
      "key": "yuki",
      "label": "ゆき・こおり",
      "glyph": "<path d=\"M12 2v20M3 7l18 10M21 7L3 17\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\"/>"
    },
    {
      "key": "sabaku",
      "label": "さばく・かわら",
      "glyph": "<path d=\"M2 20h20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><path d=\"M3 17c3-5 6-8 9-8s6 3 9 8z\" fill=\"currentColor\"/>"
    }
  ];

  var kinds = [
    {
      "key": "moguru",
      "label": "もぐる・かくれ家",
      "teach": "はまぐりの なかま"
    },
    {
      "key": "iro",
      "label": "いろを かえる",
      "teach": "たこの なかま"
    },
    {
      "key": "tsukeru",
      "label": "まわりの ものを つける",
      "teach": "もくずしょいの なかま"
    },
    {
      "key": "sokkuri",
      "label": "まわりと おなじ いろ"
    },
    {
      "key": "katachi",
      "label": "かたちを まねる"
    },
    {
      "key": "hikari",
      "label": "ひかりを つかう"
    },
    {
      "key": "sukitoru",
      "label": "すきとおる"
    }
  ];

  var animals = [
    {
      "id": "mokuzushoi",
      "name": "モクズショイ",
      "yomi": "もくずしょい",
      "place": "umi",
      "kind": "tsukeru",
      "textbook": true,
      "inJapan": true,
      "placeS": "モクズショイが、うみの そこの いわの あいだに かくれて います。",
      "bodyS": "モクズショイは、こうらや あしに はえた こまかい けを もって います。",
      "howS": "かいそうや かいめんを はさみで きりとって、せなかの けに ひっかけて、かくれます。",
      "naze": "てきから みを まもる ためです。",
      "sumika": "あたたかい うみの いわばや さんごの ある ところ。にほんでは みなみの うみで 見られます。",
      "size": "こうらは 3cm ぐらい。でも あしを ひろげると 10cm ぐらいに なります。",
      "tabemono": "すいぞくかんでは、えびを 小さく きった ものを たべます。うみで なにを たべるのかは、まだ よく わかって いません。",
      "itsu": "いちねんじゅう。すいぞくかんで 見られます。",
      "nakama": "カニの なかま（クモガニの なかま）",
      "karada": "あしが とても ながく、くもの ように 見えます。からだの けは かぎの ように まがって いるので、つけた ものが おちません。",
      "motto": [
        "名まえは 「もくず（かいそうの くず）を しょって いる」から つきました。",
        "すいそうに 入れると、入れた ものを すぐ からだに つけはじめます。",
        "うごく ときも つけた ものは そのまま。あるく かいそうの ように 見えます。"
      ],
      "sources": [
        "https://en.wikipedia.org/wiki/Camposcia_retusa",
        "https://museum.wa.gov.au/online-collections/names/Camposcia-retusa"
      ],
      "photo": {
        "by": "Philippe Bourjon",
        "caption": "モクズショイの しゃしん",
        "commonsFile": "File:Camposcia retusa Réunion.JPG",
        "file": "mokuzushoi.jpg",
        "h": 662,
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Camposcia_retusa_Réunion.JPG",
        "w": 900
      }
    },
    {
      "id": "hamaguri",
      "name": "ハマグリ",
      "yomi": "はまぐり",
      "place": "iso",
      "kind": "moguru",
      "textbook": true,
      "inJapan": true,
      "placeS": "ハマグリが、うみべの すなの 中に かくれて います。",
      "bodyS": "ハマグリは、すなを ほる ための じょうぶな 足を もって います。",
      "howS": "足を のばして すなを ほり、からだを すなの 中に 入れて、かくれます。",
      "naze": "とりや さかなに 見つからない ように する ためです。すなの 中は なみにも ながされません。",
      "sumika": "にほんの あさい うみの、すなや どろの そこ。かわの 水が まざる いりえに すんで います。むかしは たくさん いましたが、いまは ずいぶん へりました。",
      "size": "からの 大きさは 4cm から 6cm ぐらい。大きく そだつと 8cm ぐらいに なります。手の ひらに のる 大きさです。",
      "tabemono": "水を すいこんで、水の 中の 小さな プランクトンだけを こしとって たべます。",
      "itsu": "いちねんじゅう います。でも かずが へって いて、しおひがりで 見つかる かいは、よく にた べつの かいの ことが おおいです。",
      "nakama": "かいの なかま（からが 2まい ある なかま）",
      "karada": "2まいの かたい からで からだを はさんで まもります。すなの 中からは 2つの くだを 出して、水を すったり はいたり します。",
      "motto": [
        "からの もようは 1まい 1まい ちがって、おなじ ものは ありません。",
        "ねばねばした ながい ひもを 出して、しおの ながれに うかび、とおくへ はこばれる ことが あります。",
        "すなの 上に 小さな あなが 2つ ならんで いたら、その 下に いる かもしれません。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/%E3%83%8F%E3%83%9E%E3%82%B0%E3%83%AA",
        "https://www.zukan-bouz.com/syu/%E3%83%8F%E3%83%9E%E3%82%B0%E3%83%AA",
        "https://en.wikipedia.org/wiki/Meretrix_lusoria"
      ],
      "photo": {
        "by": "Almandine",
        "caption": "ハマグリの しゃしん",
        "commonsFile": "File:Meretrix_lusoria.jpg",
        "file": "hamaguri.jpg",
        "h": 675,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Meretrix_lusoria.jpg",
        "w": 900
      }
    },
    {
      "id": "madako",
      "name": "マダコ",
      "yomi": "まだこ",
      "place": "iso",
      "kind": "iro",
      "textbook": true,
      "inJapan": true,
      "placeS": "マダコが、うみべの いわの あいだに かくれて います。",
      "bodyS": "マダコは、からだの いろを まわりと おなじに かえる ことが できます。",
      "howS": "いわや かいそうの いろに あわせて からだの いろを かえて、かくれます。",
      "naze": "てきから みを まもる ためです。かにに きづかれないで ちかづく ためでも あります。",
      "sumika": "にほんの いわばの うみ。あさい ところの いわの あなや すきまに すんで います。",
      "size": "あしの さきまで 入れて、ぜんぶで 60cm ぐらいに なります。",
      "tabemono": "かにや えび、かいを たべます。かたい からも あしで あけて しまいます。",
      "itsu": "いちねんじゅう。なつから あきに よく とれます。",
      "nakama": "タコの なかま",
      "karada": "8ほんの あしに たくさんの きゅうばんが ならんで います。かたい ほねが ないので、目が とおる くらいの すきまなら、からだを 入れられます。",
      "motto": [
        "いわの あなや すきまに 手を 入れては いけません。かみつく ことが あり、どくを もつ ヒョウモンダコが いる ことも あります。",
        "あぶない ときは すみを はいて、すみを じぶんの かわりに のこして にげます。",
        "あしの きゅうばんで あじが わかります。手で さわって あじみを して いる ような ものです。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/%E3%83%9E%E3%83%80%E3%82%B3",
        "https://en.wikipedia.org/wiki/Octopus_sinensis",
        "https://www.zukan-bouz.com/syu/%E3%83%9E%E3%83%80%E3%82%B3"
      ],
      "photo": {
        "by": "Daiju Azuma",
        "caption": "マダコの しゃしん",
        "commonsFile": "File:Octopus_sinensis.jpg",
        "file": "madako.jpg",
        "h": 760,
        "license": "CC BY-SA 2.5",
        "source": "https://commons.wikimedia.org/wiki/File:Octopus_sinensis.jpg",
        "w": 761
      }
    },
    {
      "id": "chinanago",
      "name": "チンアナゴ",
      "yomi": "ちんあなご",
      "place": "umi",
      "kind": "moguru",
      "inJapan": true,
      "placeS": "チンアナゴが、うみの そこの すなの 中に かくれて います。",
      "bodyS": "チンアナゴは、ほそながい からだと、かたい しっぽの さきを もって います。",
      "howS": "しっぽから すなに もぐって あなを つくり、あぶなく なると すっと ひっこんで、かくれます。",
      "naze": "てきから みを まもる ためです。",
      "sumika": "あたたかい うみの、ながれの ある すなの そこ。にほんでは みなみの しまの あたりに おおく、しずおかや こうちの うみでも 見つかって います。",
      "size": "30cm ぐらい。でも すなから 出て いるのは、からだの まえの ほうだけです。",
      "tabemono": "ながれて くる プランクトンを たべます。",
      "itsu": "いちねんじゅう。すいぞくかんで よく 見られます。",
      "nakama": "さかなの なかま（アナゴの なかま）",
      "karada": "白い からだに くろい てんが ならんで います。目が 大きく、ながれて くる えさを 見つけます。",
      "motto": [
        "名まえの 「チン」は、かおが いぬの 「ちん」に にて いる ことから つきました。",
        "ながれの くる ほうへ かおを むけるので、みんな おなじ むきに ならびます。",
        "すいぞくかんでは、11月11日を 「チンアナゴの日」に して います。すなから 出た すがたが 1に にて いるからです。"
      ],
      "sources": [
        "https://marine-world.jp/wp-content/uploads/2022/11/f6ca0f8452a09a8bbb58b3bc7a1b81bf.pdf"
      ],
      "photo": {
        "by": "Wisnia6522",
        "caption": "チンアナゴの しゃしん",
        "commonsFile": "File:Węgorz_ogrodowy.jpg",
        "file": "chinanago.jpg",
        "h": 760,
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:W%C4%99gorz_ogrodowy.jpg",
        "w": 647
      }
    },
    {
      "id": "hanaokoze",
      "name": "ハナオコゼ",
      "yomi": "はなおこぜ",
      "place": "umi",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "ハナオコゼが、うみに ういた かいそうの 中に かくれて います。",
      "bodyS": "ハナオコゼは、かいそうに そっくりな もようと、ふさふさの はだを もって います。",
      "howS": "ういた かいそうに まぎれこんで、ゆれに あわせて うごいて、かくれます。",
      "naze": "ちかづいて きた さかなを つかまえる ためです。とりや 大きな さかなからも みを まもれます。",
      "sumika": "あたたかい うみに ういた 「ホンダワラ」の かたまりの 中。にほんでは みなみから ながれて きた かいそうに ついて やって きます。",
      "size": "10cm から 15cm ぐらい。",
      "tabemono": "小さな さかなや えびを たべます。",
      "itsu": "はるから なつ。ながれもに ついて きます。",
      "nakama": "さかなの なかま（カエルアンコウの なかま）",
      "karada": "むねの ひれが 手の ように なって いて、かいそうを つかんで あるきます。あたまに つりざおの ような ひれが あります。",
      "motto": [
        "じぶんと おなじ 大きさの さかなまで のみこみます。",
        "ながれもと いっしょに、うみを とおくまで たびします。",
        "すくいあげると、かいそうを はなさないで いっしょに 上がって くる ことが あります。"
      ],
      "sources": [
        "https://www.pref.kagawa.lg.jp/documents/19778/tp078hanaokoze.pdf",
        "https://www.pref.tottori.lg.jp/item/222484.htm"
      ],
      "photo": {
        "by": "Totti",
        "caption": "ハナオコゼの しゃしん",
        "commonsFile": "File:Histrio_histrio_Shimoda.jpg",
        "file": "hanaokoze.jpg",
        "h": 617,
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Histrio_histrio_Shimoda.jpg",
        "w": 900
      }
    },
    {
      "id": "hirame",
      "name": "ヒラメ",
      "yomi": "ひらめ",
      "place": "umi",
      "kind": "moguru",
      "inJapan": true,
      "placeS": "ヒラメが、うみの そこの すなの 中に かくれて います。",
      "bodyS": "ヒラメは、ひらたい からだと、かたほうに よった 目を もって います。",
      "howS": "ひれで すなを かけて からだを うめ、目だけ 出して、かくれます。",
      "naze": "すなの 中で まって、上を とおる 小さな さかなを つかまえる ためです。てきからも みを まもれます。",
      "sumika": "にほんの うみの、すなや どろの そこ。あさい ところから 200m ぐらい ふかい ところまで すんで います。",
      "size": "大きい ものは 80cm ぐらい。おおくは 40cm から 60cm です。",
      "tabemono": "小さな さかなや えび、いかを たべます。",
      "itsu": "いちねんじゅう。ふゆに あじが よいと いわれます。",
      "nakama": "さかなの なかま（カレイに ちかい なかま）",
      "karada": "生まれた ときは ふつうの さかなの かたちで、目は 左と 右に 1つずつ あります。大きく なる あいだに、右の 目が 左がわへ うごいて いきます。はだの いろも すなに あわせて かわります。",
      "motto": [
        "おなかを 下に して ならべると、ヒラメは 目が 左に あります。「左ヒラメに 右カレイ」と おぼえます。",
        "すなに もぐると 目だけが 出て いるので、目を さがすと 見つけられます。",
        "口が 大きく、ならんだ はが するどいのが カレイとの ちがいです。"
      ],
      "sources": [
        "https://www.pref.chiba.lg.jp/lab-suisan/suisan/soshiki/futtsu/hirame.html",
        "https://kotobank.jp/word/%E3%81%B2%E3%82%89%E3%82%81-1582929",
        "https://nh.kanagawa-museum.jp/assets/icp/contents/1599802908346/simple/tobira79_1iwasaki.pdf"
      ],
      "photo": {
        "by": "Daiju Azuma",
        "caption": "ヒラメの しゃしん",
        "commonsFile": "File:Paralichthys_olivaceus.jpg",
        "file": "hirame.jpg",
        "h": 760,
        "license": "CC BY-SA 2.5",
        "source": "https://commons.wikimedia.org/wiki/File:Paralichthys_olivaceus.jpg",
        "w": 760
      }
    },
    {
      "id": "hotaruika",
      "name": "ホタルイカ",
      "yomi": "ほたるいか",
      "place": "umi",
      "kind": "hikari",
      "inJapan": true,
      "placeS": "ホタルイカが、ふかい うみの 中に かくれて います。",
      "bodyS": "ホタルイカは、おなかに ひかる 小さな つぶを たくさん もって います。",
      "howS": "おなかを ひからせて、上から さして くる ひかりと おなじ あかるさに なって、かくれます。",
      "naze": "下に いる てきから みを まもる ためです。",
      "sumika": "にほんかいの ふかい うみ。はるに なると、とやまわんの あさい ところへ 上がって きます。",
      "size": "どうの ながさは、オスが 4cm、メスが 6cm ぐらいです。",
      "tabemono": "小さな プランクトンや えびを たべます。",
      "itsu": "はるの よる。とやまわんでは 3月から 5月に 見られます。",
      "nakama": "いかの なかま",
      "karada": "ひかる つぶは おなかと 目の まわり、あしの さきに あります。あしの さきの 3つは とくに 大きく ひかります。",
      "motto": [
        "下から 見上げる てきには、うみの 上の あかるさと おなじに 見えるので 見つかりません。",
        "ひかるのは、なかまに いる ばしょを しらせる ためでも あります。",
        "ひかる つぶは、ぜんぶで 1000こ ちかくも あります。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/ホタルイカ",
        "https://en.wikipedia.org/wiki/Watasenia_scintillans"
      ],
      "photo": {
        "by": ":ja:user:Dieno",
        "caption": "ホタルイカの しゃしん",
        "commonsFile": "File:Watasenia_scintillans.jpg",
        "file": "hotaruika.jpg",
        "h": 1100,
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Watasenia_scintillans.jpg",
        "w": 550
      }
    },
    {
      "id": "kaeruankou",
      "name": "カエルアンコウ",
      "yomi": "かえるあんこう",
      "place": "umi",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "カエルアンコウが、うみの そこの いわの あいだに かくれて います。",
      "bodyS": "カエルアンコウは、いわや かいめんに そっくりな ざらざらの はだを もって います。",
      "howS": "いわに よりそって、じっと うごかないで、かくれます。",
      "naze": "ちかづいて きた さかなを つかまえる ためです。じぶんも てきに 見つからなく なります。",
      "sumika": "にほんでは ほっかいどうから みなみの うみ。あさい いわばや さんごの ある ところに います。",
      "size": "5cm から 20cm ぐらい。おなじ なかまには もっと 大きく なる しゅるいも います。",
      "tabemono": "小さな さかなや えびを たべます。じぶんと おなじ 大きさの さかなも のみこみます。",
      "itsu": "いちねんじゅう います。ダイビングで 見つかります。",
      "nakama": "さかなの なかま（アンコウの なかま）",
      "karada": "あたまの 上に つりざおの ような ひれが あり、さきに ふさが ついて います。むねの ひれは 手の ようで、うみの そこを あるきます。はだの いろは、なんしゅうかも かけて ゆっくり かわります。",
      "motto": [
        "つりざおを ひらひら ふって、さかなを じぶんの 口の すぐ そばまで おびきよせます。",
        "口を あける はやさは、人が まばたきを する よりも ずっと はやいです。",
        "およぐのが とても にがてで、ほとんど あるいて うごきます。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/カエルアンコウ",
        "https://en.wikipedia.org/wiki/Antennarius_striatus"
      ],
      "photo": {
        "by": "Christian Gloor from Wakatobi Dive Resort, Indonesia",
        "caption": "カエルアンコウの しゃしん",
        "commonsFile": "File:Antennarius_striatus_(14911110794).jpg",
        "file": "kaeruankou.jpg",
        "h": 600,
        "license": "CC BY 2.0",
        "source": "https://commons.wikimedia.org/wiki/File:Antennarius_striatus_%2814911110794%29.jpg",
        "w": 900
      }
    },
    {
      "id": "kakurekumanomi",
      "name": "カクレクマノミ",
      "yomi": "かくれくまのみ",
      "place": "umi",
      "kind": "moguru",
      "inJapan": true,
      "placeS": "カクレクマノミが、うみの 中の イソギンチャクの あいだに かくれて います。",
      "bodyS": "カクレクマノミは、イソギンチャクに さされなく なる ねんえきの はだを もって います。",
      "howS": "イソギンチャクの ゆれる しょくしゅの あいだに 入って、かくれます。",
      "naze": "てきから みを まもる ためです。ほかの さかなは イソギンチャクに さされるので、入って こられません。",
      "sumika": "あたたかい うみの さんごの ある ところ。にほんでは みなみの しまの あたりで 見られます。",
      "size": "8cm から 11cm ぐらい。",
      "tabemono": "小さな プランクトンや かいそうを たべます。",
      "itsu": "いちねんじゅう。すいぞくかんで よく 見られます。",
      "nakama": "さかなの なかま（スズメダイの なかま）",
      "karada": "だいだいいろの からだに 白い おびが 3ぼん あります。ひれの ふちには ほそい くろい せんが あります。",
      "motto": [
        "カクレクマノミが さされない わけは、はだの ねんえきに あると いわれて いますが、まだ しらべて いる ところです。",
        "むれの 中で いちばん 大きい ものが メスに なります。",
        "イソギンチャクを たべに くる さかなを カクレクマノミが おいはらうので、イソギンチャクも たすかって います。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/カクレクマノミ",
        "https://en.wikipedia.org/wiki/Amphiprion_ocellaris"
      ],
      "photo": {
        "by": "Metatron",
        "caption": "カクレクマノミの しゃしん",
        "commonsFile": "File:Ocellaris_clownfish.JPG",
        "file": "kakurekumanomi.jpg",
        "h": 675,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Ocellaris_clownfish.JPG",
        "w": 900
      }
    },
    {
      "id": "kamisoriuo",
      "name": "カミソリウオ",
      "yomi": "かみそりうお",
      "place": "umi",
      "kind": "katachi",
      "inJapan": true,
      "placeS": "カミソリウオが、うみの 中の かいそうの あいだに かくれて います。",
      "bodyS": "カミソリウオは、かいそうに そっくりな ひらたい からだを もって います。",
      "howS": "あたまを 下に して、かいそうと いっしょに ゆらゆら ゆれて、かくれます。",
      "naze": "てきに 見つからない ように する ためです。それに、ちかづいて きた 小さな えびを つかまえる ためでも あります。",
      "sumika": "あたたかい うみの、しずかな いわばや かいそうの はえた ところ。にほんでは みなみの うみで 見られます。",
      "size": "大きく なっても 15cm ぐらい。見つかる ものは もっと 小さい ことが おおいです。",
      "tabemono": "小さな えびや、水の 中を ただよう プランクトンを すいこんで たべます。",
      "itsu": "あたたかい うみでは いちねんじゅう います。ひるまも うごきません。",
      "nakama": "さかなの なかま（ヨウジウオの なかま）",
      "karada": "口が つつの ように ほそく とがって いて、えものを いっきに すいこみます。からだの いろは、すんで いる ところに あわせて ちがいます。",
      "motto": [
        "名まえは、からだが かみそりの ように うすい ことから つきました。",
        "2ひきで ならんで いる ことが おおく、大きい ほうが メスです。",
        "メスは おなかの ひれを ふくろの ように して、たまごを まもります。"
      ],
      "sources": [
        "https://www.fishbase.se/summary/Solenostomus-cyanopterus.html",
        "https://australian.museum/learn/animals/fishes/robust-ghostpipefish-solenostomus-cyanopterus/",
        "https://fishesofaustralia.net.au/Home/species/1512",
        "https://koreascience.or.kr/article/JAKO200710103447222.pub?lang=en"
      ],
      "photo": {
        "by": "Jenny (JennyHuang)",
        "caption": "カミソリウオの しゃしん",
        "commonsFile": "File:Solenostomus_cyanopterus.jpg",
        "file": "kamisoriuo.jpg",
        "h": 607,
        "license": "CC BY 2.0",
        "source": "https://commons.wikimedia.org/wiki/File:Solenostomus_cyanopterus.jpg",
        "w": 900
      }
    },
    {
      "id": "kasago",
      "name": "カサゴ",
      "yomi": "かさご",
      "place": "umi",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "カサゴが、うみの いわの あいだに かくれて います。",
      "bodyS": "カサゴは、いわに そっくりな まだらの はだを もって います。",
      "howS": "いわに よりそって、じっと うごかないで、かくれます。",
      "naze": "ちかづいて きた えびや さかなを つかまえる ためです。じぶんも 見つかりません。",
      "sumika": "にほんの いわばの うみ。あさい ところの いわの あなや すきまに います。",
      "size": "10cm から 20cm ぐらい。大きい ものは 30cm ぐらいに なります。",
      "tabemono": "小さな さかなや えび、かにを たべます。",
      "itsu": "いちねんじゅう。ふゆから はるに よく つれます。",
      "nakama": "さかなの なかま（メバルの なかま）",
      "karada": "せなかの ひれに とがった とげが ならんで います。この とげで さされると とても いたいので、見つけても さわりません。目が 大きく、くらい いわの あなの 中でも よく 見えます。",
      "motto": [
        "すんで いる ところで いろが ちがい、あかっぽい ものや くろっぽい ものが います。",
        "たまごでは なく、小さな 子どもを うみます。",
        "うごかないので、いわだと おもって 手を ついて しまう ことが あります。いその 水たまりでは 気を つけます。"
      ],
      "sources": [
        "https://www.pref.kyoto.jp/kaiyo/kasago.html",
        "https://www.pref.yamaguchi.lg.jp/uploaded/attachment/59676.pdf"
      ],
      "photo": {
        "by": "OpenCage",
        "caption": "カサゴの しゃしん",
        "commonsFile": "File:Sebastiscus_marmoratus_by_OpenCage.jpg",
        "file": "kasago.jpg",
        "h": 760,
        "license": "CC BY-SA 2.5",
        "source": "https://commons.wikimedia.org/wiki/File:Sebastiscus_marmoratus_by_OpenCage.jpg",
        "w": 759
      }
    },
    {
      "id": "kouika",
      "name": "コウイカ",
      "yomi": "こういか",
      "place": "umi",
      "kind": "iro",
      "inJapan": true,
      "placeS": "コウイカが、うみの そこの すなの ところに かくれて います。",
      "bodyS": "コウイカは、はだの いろと もようを かえる ことが できます。",
      "howS": "すなや いわと おなじ いろに なって、かくれます。",
      "naze": "てきから みを まもる ためです。えびや かにに きづかれないで ちかづく ためでも あります。",
      "sumika": "にほんの あさい うみ。すなや どろの そこに すんで います。",
      "size": "どうの ながさは 15cm から 18cm ぐらい。",
      "tabemono": "えびや かに、小さな さかなを たべます。",
      "itsu": "はるに あさい ところへ 上がって きて、たまごを うみます。",
      "nakama": "いかの なかま",
      "karada": "からだの 中に 「こう」と よばれる かたい ふねの ような ものが 入って います。10ぽんの あしの うち 2ほんが とくに ながく、さっと のばして えものを つかみます。",
      "motto": [
        "名まえの 「コウ」は、からだの 中の かたい 「こう」から きて います。",
        "あぶない ときは すみを はいて、すみを じぶんの かわりに のこして にげます。",
        "はだの いろや もようは、見て いる あいだに さっと かわります。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/コウイカ",
        "https://www.pref.wakayama.lg.jp/prefg/070100/syokuzai/index_d/fil/8kouika_1.pdf",
        "https://www.natureasia.com/ja-jp/life-sci/research/12736"
      ],
      "photo": {
        "by": "Kuribo",
        "caption": "コウイカの しゃしん",
        "commonsFile": "File:Sepia_esculenta_Osaka.jpg",
        "file": "kouika.jpg",
        "h": 598,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Sepia_esculenta_Osaka.jpg",
        "w": 900
      }
    },
    {
      "id": "leafyseadragon",
      "name": "リーフィーシードラゴン",
      "yomi": "りーふぃーしーどらごん",
      "place": "umi",
      "kind": "katachi",
      "inJapan": false,
      "placeS": "リーフィーシードラゴンが、うみの 中の かいそうの あいだに かくれて います。",
      "bodyS": "リーフィーシードラゴンは、かいそうの はの ような ひらひらを からだに もって います。",
      "howS": "かいそうに まぎれこんで、ゆれに あわせて ゆらゆら うごいて、かくれます。",
      "naze": "てきから みを まもる ためです。小さな えびに きづかれないで ちかづく ためでも あります。",
      "sumika": "オーストラリアの みなみの うみ。かいそうの はえた いわばや すなの ところに います。",
      "size": "35cm ぐらい。30cm の ものさしより すこし ながいです。",
      "tabemono": "小さな えびや プランクトンを すいこんで たべます。",
      "itsu": "オーストラリアでは いちねんじゅう 見られます。",
      "nakama": "さかなの なかま（タツノオトシゴの なかま）",
      "karada": "ひらひらは およぐ ための ものでは なく、かくれる ための ものです。およぐのは せなかに ある とても 小さな ひれです。",
      "motto": [
        "ゆれる はやさを まわりの かいそうと あわせるので、ならんで いても 見つけられません。",
        "オスが しっぽの うらに たまごを 250こ ぐらい つけて、生まれるまで まもります。",
        "ひらひらは かくれる ための もの。およぐのは とても おそいです。"
      ],
      "sources": [
        "https://www.fishbase.se/summary/Phycodurus-eques.html",
        "https://aquariumofpacific.org/onlinelearningcenter/species/leafy_seadragon",
        "https://reeflifesurvey.com/species/Phycodurus-eques",
        "https://cdn.environment.sa.gov.au/landscape/docs/hf/leafy-seadragon-poster-2020.pdf"
      ],
      "photo": {
        "by": "James Rosindell",
        "caption": "リーフィーシードラゴンの しゃしん",
        "commonsFile": "File:Leafy_Seadragon_on_Kangaroo_Island.jpg",
        "file": "leafyseadragon.jpg",
        "h": 599,
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Leafy_Seadragon_on_Kangaroo_Island.jpg",
        "w": 900
      }
    },
    {
      "id": "mizukurage",
      "name": "ミズクラゲ",
      "yomi": "みずくらげ",
      "place": "umi",
      "kind": "sukitoru",
      "inJapan": true,
      "placeS": "ミズクラゲが、うみの 中を ただよいながら かくれて います。",
      "bodyS": "ミズクラゲは、水の ように すきとおった からだを もって います。",
      "howS": "からだの ほとんどが 水なので、まわりの 水に とけこむように 見えて、かくれます。",
      "naze": "てきに 見つからない ように する ためです。",
      "sumika": "にほんの うみの、あさくて しずかな ところ。みなとや いりえに たくさん あつまります。",
      "size": "かさの 大きさは 15cm から 30cm ぐらい。",
      "tabemono": "水の 中の 小さな プランクトンを、しょくしゅで つかまえて たべます。",
      "itsu": "いちねんじゅう いますが、なつに とくに たくさん 見られます。",
      "nakama": "クラゲの なかま",
      "karada": "からだの ほとんどが 水で できて います。かさの まん中に、よつばの ような かたちの ものが 4つ すけて 見えます。",
      "motto": [
        "すけて 見える よつばの かたちは、たまごや せいしを つくる ところです。",
        "からだの ほとんどが 水なので、うちあげられると とけた ように なく なって しまいます。",
        "すきとおって いても、ウミガメや マンボウには 見つかって たべられます。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/ミズクラゲ"
      ],
      "photo": {
        "by": "Yosemite",
        "caption": "ミズクラゲの しゃしん",
        "commonsFile": "File:Aurelia_aurita_001.JPG",
        "file": "mizukurage.jpg",
        "h": 675,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Aurelia_aurita_001.JPG",
        "w": 900
      }
    },
    {
      "id": "somenyadokari",
      "name": "ソメンヤドカリ",
      "yomi": "そめんやどかり",
      "place": "umi",
      "kind": "tsukeru",
      "inJapan": true,
      "placeS": "ソメンヤドカリが、うみの そこの すなの ところに かくれて います。",
      "bodyS": "ソメンヤドカリは、イソギンチャクを つけた かいの からを もって います。",
      "howS": "かいの からに イソギンチャクを つけて、イソギンチャクの かたまりに 見えるように なって、かくれます。",
      "naze": "てきから みを まもる ためです。イソギンチャクの 手には さす ものが あるので、タコなども ちかづけません。",
      "sumika": "あたたかい うみの、すなの そこや かいそうの 中。にほんでは みなみの うみで 見られます。",
      "size": "かいの からを 入れて 10cm ぐらい。",
      "tabemono": "うみの そこの かいそうや、しんだ 生きものの かけらを たべます。",
      "itsu": "いちねんじゅう。すいぞくかんで 見られます。",
      "nakama": "ヤドカリの なかま（えびや かにの なかま）",
      "karada": "やわらかい おなかを まもる ため、まきがいの からの 中に からだを 入れて います。目は ぼうの 先に ついて いて、からの 中からでも まわりが 見えます。",
      "motto": [
        "ヤドカリの なかまは、ひっこしの ときに イソギンチャクを あたらしい からへ つけなおします。",
        "イソギンチャクも、うごいて えさの ある ところへ はこんで もらえるので たすかります。",
        "えさが たりない ときは、せなかの イソギンチャクを たべて しまう ことも あります。"
      ],
      "sources": [
        "https://www.sealifebase.se/summary/Dardanus-pedunculatus.html",
        "https://en.wikipedia.org/wiki/Dardanus_pedunculatus",
        "https://www.seto.kyoto-u.ac.jp/shirahama_aqua/wp-content/uploads/2023/03/isoginchaku-riyou.pdf"
      ],
      "photo": {
        "by": "Nhobgood Nick Hobgood",
        "caption": "ソメンヤドカリの しゃしん",
        "commonsFile": "File:Dardanus pedunculatus (Hermit crab).jpg",
        "file": "somenyadokari.jpg",
        "h": 675,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Dardanus_pedunculatus_(Hermit_crab).jpg",
        "w": 900
      }
    },
    {
      "id": "agohaze",
      "name": "アゴハゼ",
      "yomi": "あごはぜ",
      "place": "iso",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "アゴハゼが、いその 水たまりの 石の あいだに かくれて います。",
      "bodyS": "アゴハゼは、石と おなじ まだらの からだを もって います。",
      "howS": "石の いろに あわせて、石の そばで じっと して、かくれます。",
      "naze": "とりや 大きな さかなから みを まもる ためです。",
      "sumika": "にほんの いそ。しおが ひいた あとに のこる 水たまりに、たくさん います。",
      "size": "5cm から 8cm ぐらい。",
      "tabemono": "小さな えびや かいそう、生きものの かけらを たべます。",
      "itsu": "いちねんじゅう。はるから なつの しおひの ときが 見つけやすいです。",
      "nakama": "さかなの なかま（ハゼの なかま）",
      "karada": "おなかの ひれが くっついて きゅうばんの ように なって いて、石に ぺたりと はりつけます。",
      "motto": [
        "いその 水たまりで いちばん よく 見つかる さかなです。",
        "からだの いろは、いる ところに あわせて こく なったり うすく なったり します。",
        "水が すくなく なっても、しばらくは いきて いられます。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/%E3%82%A2%E3%82%B4%E3%83%8F%E3%82%BC",
        "https://en.wikipedia.org/wiki/Chaenogobius_annularis",
        "https://www.zukan-bouz.com/syu/%E3%82%A2%E3%82%B4%E3%83%8F%E3%82%BC",
        "https://www.fishbase.se/summary/Chaenogobius-annularis.html"
      ],
      "photo": {
        "by": "A. C. Tatarinov",
        "caption": "アゴハゼの しゃしん",
        "commonsFile": "File:Chaenogobius_annularis.JPG",
        "file": "agohaze.jpg",
        "h": 455,
        "license": "CC0",
        "source": "https://commons.wikimedia.org/wiki/File:Chaenogobius_annularis.JPG",
        "w": 900
      }
    },
    {
      "id": "kamenote",
      "name": "カメノテ",
      "yomi": "かめのて",
      "place": "iso",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "カメノテが、うみべの いわの すきまに かくれて います。",
      "bodyS": "カメノテは、いわと おなじ いろの かたい からを もって います。",
      "howS": "いわの すきまに ぴったり 入って、いわの ように 見えるように なって、かくれます。",
      "naze": "なみに ながされない ように する ためです。とりにも 見つかりません。",
      "sumika": "にほんの いわばの うみべ。なみの かかる いわの すきまに、たくさん かたまって ついて います。",
      "size": "3cm から 5cm ぐらい。",
      "tabemono": "ふさの ような 手を 出して、水の 中の プランクトンを つかまえて たべます。",
      "itsu": "いちねんじゅう。しおが ひいた ときに 見られます。",
      "nakama": "えびや かにの なかま（フジツボの なかま）",
      "karada": "かめの 手の ような かたい からの 中に、ふさの ような 手が しまわれて います。水が かかると その 手を さっと ひろげます。",
      "motto": [
        "名まえは、かたちが かめの 手に にて いる ことから つきました。",
        "かいの ように 見えますが、じつは えびや かにと おなじ なかまです。",
        "生まれた ときは 水の 中を およいで いて、いわに ついてから うごかなく なります。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/%E3%82%AB%E3%83%A1%E3%83%8E%E3%83%86",
        "https://en.wikipedia.org/wiki/Capitulum_mitella",
        "https://www.zukan-bouz.com/syu/%E3%82%AB%E3%83%A1%E3%83%8E%E3%83%86"
      ],
      "photo": {
        "by": "Harum Koh",
        "caption": "カメノテの しゃしん",
        "commonsFile": "File:Capitulum mitella koh.jpg",
        "file": "kamenote.jpg",
        "h": 600,
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Capitulum_mitella_koh.jpg",
        "w": 900
      }
    },
    {
      "id": "shirochidori",
      "name": "シロチドリ",
      "yomi": "しろちどり",
      "place": "iso",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "シロチドリが、すなはまの すなの 上に かくれて います。",
      "bodyS": "シロチドリは、すなと おなじ いろの せなかを もって います。",
      "howS": "すなの 上に うずくまって じっと して、すなと 見わけが つかないように して、かくれます。",
      "naze": "てきから たまごと ひなを まもる ためです。",
      "sumika": "にほんの すなはまや、かわらの ひろい ところ。すなの 上に すを つくります。",
      "size": "17cm ぐらい。スズメより すこし 大きいぐらいです。",
      "tabemono": "すなの 中の ごかいや、小さな 生きものを たべます。",
      "itsu": "いちねんじゅう にほんに います。たまごを うむのは 4月から 7月。",
      "nakama": "とりの なかま（チドリの なかま）",
      "karada": "足が ほそく ながく、すなの 上を すばやく はしります。くちばしは みじかくて まっすぐです。",
      "motto": [
        "たまごは すなと おなじ いろと もようで、そばに あっても 見つけられません。",
        "すは すなに くぼみを つけただけの かんたんな ものです。",
        "人が ちかづくと、おやどりは けがを した ふりを して、すから とおざけます。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/%E3%82%B7%E3%83%AD%E3%83%81%E3%83%89%E3%83%AA",
        "https://en.wikipedia.org/wiki/Kentish_plover"
      ],
      "photo": {
        "by": "Bogbumper",
        "caption": "シロチドリの しゃしん",
        "commonsFile": "File:Charadrius_alexandrinus_0711.jpg",
        "file": "shirochidori.jpg",
        "h": 655,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Charadrius_alexandrinus_0711.jpg",
        "w": 900
      }
    },
    {
      "id": "sunagani",
      "name": "スナガニ",
      "yomi": "すながに",
      "place": "iso",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "スナガニが、すなはまの すなの 上に かくれて います。",
      "bodyS": "スナガニは、すなと そっくりな いろの こうらを もって います。",
      "howS": "すなの 上で じっと うごかないで、すなと 見わけが つかないように して、かくれます。",
      "naze": "とりに 見つからない ように する ためです。",
      "sumika": "にほんの すなはま。しおが ひく あたりの すなに、ふかい あなを ほって すんで います。",
      "size": "こうらの はばは 2cm から 3cm ぐらい。",
      "tabemono": "すなの 中の 小さな 生きものや、なみで うちあげられた ものを たべます。",
      "itsu": "なつの よるに よく うごきます。ひるまは あなの 中に います。",
      "nakama": "カニの なかま",
      "karada": "目が ぼうの ように 上へ とび出て いて、すなに ふせたままでも まわりを 見わたせます。足が ながく、カニの 中で いちばん はやく はしります。",
      "motto": [
        "はしる はやさは、人が あるく はやさより はやいと いわれます。",
        "あなの ふかさは 50cm を こえる ことも あります。",
        "すなはまが すくなく なって、見られる ところが へって います。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/スナガニ",
        "https://www.zukan-bouz.com/syu/スナガニ"
      ],
      "photo": {
        "by": "ふうけ",
        "caption": "スナガニの しゃしん",
        "commonsFile": "File:Sunagani060612.jpg",
        "file": "sunagani.jpg",
        "h": 675,
        "license": "GFDL",
        "source": "https://commons.wikimedia.org/wiki/File:Sunagani060612.jpg",
        "w": 900
      }
    },
    {
      "id": "umihotaru",
      "name": "ウミホタル",
      "yomi": "うみほたる",
      "place": "iso",
      "kind": "hikari",
      "inJapan": true,
      "placeS": "ウミホタルが、うみべの すなの 中に かくれて います。",
      "bodyS": "ウミホタルは、青く ひかる しるを 出す ことが できます。",
      "howS": "おそわれると 青く ひかる しるを はき出し、てきの 目が ひかりに とられて いる あいだに にげて、かくれます。",
      "naze": "てきの 目を ひかりに むけさせて、その あいだに にげる ためです。",
      "sumika": "にほんの あさい うみの すなの 中。ひるまは すなに もぐって います。",
      "size": "3mm ぐらい。こめつぶより 小さいです。",
      "tabemono": "しんだ さかなや 生きものの かけらを たべます。",
      "itsu": "なつの よるに よく 見られます。うみべで すくうと ひかります。",
      "nakama": "えびや かにの なかま（ミジンコに ちかい なかま）",
      "karada": "2まいの すきとおった からで からだを つつんで います。小さいのに、水を 青く そめる ほど つよく ひかります。",
      "motto": [
        "はき出された ひかりは、水の 中に 青い けむりの ように ひろがります。",
        "かわかして おいた ものに 水を かけると、また ひかります。",
        "ひるまは すなの 中。よるに 出て きて、えさを さがします。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/ウミホタル",
        "https://en.wikipedia.org/wiki/Vargula_hilgendorfii"
      ],
      "photo": {
        "by": "Almandine",
        "caption": "ウミホタルの しゃしん",
        "commonsFile": "File:Vargula_hilgendorfii.jpg",
        "file": "umihotaru.jpg",
        "h": 760,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Vargula_hilgendorfii.jpg",
        "w": 706
      }
    },
    {
      "id": "dojou",
      "name": "ドジョウ",
      "yomi": "どじょう",
      "place": "mizube",
      "kind": "moguru",
      "inJapan": true,
      "placeS": "ドジョウが、田の どろの 中に かくれて います。",
      "bodyS": "ドジョウは、ほそながい からだと、口の まわりの ひげを もって います。",
      "howS": "あたまから どろに もぐりこんで、からだを すっかり うめて、かくれます。",
      "naze": "とりや さかなから みを まもる ためです。水が へっても どろの 中なら いきのびられます。",
      "sumika": "にほんの 田や 水ろ、ぬま。どろの そこが ある しずかな 水べに すんで います。",
      "size": "10cm から 15cm ぐらい。",
      "tabemono": "どろの 中の 小さな 生きものや、くさの かけらを たべます。",
      "itsu": "いちねんじゅう。はるから なつに よく うごきます。",
      "nakama": "さかなの なかま（コイの なかま）",
      "karada": "口の まわりに 10ぽんの ひげが あり、まっくらな どろの 中でも えさを さがせます。",
      "motto": [
        "水が すくない ときは、口から 空気を すって、おなかで いきを します。",
        "田が すくなく なって、見られる ところが へって います。",
        "ひげで さぐるので、よるでも えさを 見つけられます。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/%E3%83%89%E3%82%B8%E3%83%A7%E3%82%A6",
        "https://en.wikipedia.org/wiki/Pond_loach",
        "https://www.fishbase.se/summary/Misgurnus-anguillicaudatus.html"
      ],
      "photo": {
        "by": "",
        "caption": "ドジョウの しゃしん",
        "commonsFile": "File:Misgurnus_anguillicaudatus.jpg",
        "file": "dojou.jpg",
        "h": 613,
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Misgurnus_anguillicaudatus.jpg",
        "w": 900
      }
    },
    {
      "id": "kajika",
      "name": "カジカ",
      "yomi": "かじか",
      "place": "mizube",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "カジカが、川の そこの 石の あいだに かくれて います。",
      "bodyS": "カジカは、石と おなじ まだらの はだと、大きな あたまを もって います。",
      "howS": "石の あいだに からだを 入れて、じっと うごかないで、かくれます。",
      "naze": "ちかづいて きた えものを つかまえる ためです。とりにも 見つかりません。",
      "sumika": "にほんの きれいな 川の 上の ほう。水が つめたく、石が ごろごろ した ところに すんで います。",
      "size": "10cm から 17cm ぐらい。おおくは 15cm ぐらいです。",
      "tabemono": "水の 中の 小さな 生きものや、小さな さかなを たべます。",
      "itsu": "いちねんじゅう。たまごを うむのは はるです。",
      "nakama": "さかなの なかま（カジカの なかま）",
      "karada": "ういぶくろが ないので、ういて こないで いつも そこに います。むねの ひれが 大きく、はやい ながれの 中でも 石に とまって いられます。",
      "motto": [
        "石を そっと もちあげると、下から とび出して きます。",
        "オスが たまごの そばに のこって まもります。",
        "きれいな 水の ある ところにしか すめないので、川の ようすを しらせて くれます。"
      ],
      "sources": [
        "https://www.honda.co.jp/fishing/picture-book/kajika/",
        "https://www.pref.nagano.lg.jp/suisan/joho/sakanatachi/kajika.html",
        "https://www.pref.ibaraki.jp/nourinsuisan/naisuishi/gyogancho/documents/026_kajika.pdf"
      ],
      "photo": {
        "by": "Seotaro",
        "caption": "カジカの しゃしん",
        "commonsFile": "File:Cottus_reinii(Hamamatsu,Shizuoka,Japan).jpg",
        "file": "kajika.jpg",
        "h": 598,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Cottus_reinii%28Hamamatsu%2CShizuoka%2CJapan%29.jpg",
        "w": 900
      }
    },
    {
      "id": "matamata",
      "name": "マタマタ",
      "yomi": "またまた",
      "place": "mizube",
      "kind": "katachi",
      "inJapan": false,
      "placeS": "マタマタが、水の そこの おちばの 中に かくれて います。",
      "bodyS": "マタマタは、かれた はに そっくりな ひらたい あたまを もって います。",
      "howS": "おちばに まぎれて うごかないで、おちばの ように 見えるように なって、かくれます。",
      "naze": "ちかづいて きた さかなを つかまえる ためです。",
      "sumika": "みなみアメリカの アマゾン川など。水が くらくて、おちばが たまった しずかな ところに います。",
      "size": "こうらの ながさは 40cm から 50cm ぐらい。",
      "tabemono": "さかなを たべます。",
      "itsu": "アマゾンでは いちねんじゅう。よるに よく うごきます。",
      "nakama": "カメの なかま",
      "karada": "あたまに ひらひらした かわが たくさん ついて いて、水くさの ように 見えます。口が とても 大きく ひろがります。",
      "motto": [
        "さかなを かまないで、口を さっと ひろげて、水ごと すいこみます。",
        "こうらに そうるいが はえて、もっと 見つけにくく なります。",
        "ほとんど およがないで、水の そこを あるきます。"
      ],
      "sources": [
        "https://www.worldwildlife.org/magazine/issues/spring-2022/articles/nocturnal-and-camoflagued-mata-mata-turtles-hide-in-plain-sight",
        "https://www.adventureaquarium.com/Explore/Animals/Mata-Mata-Turtle",
        "https://en.wikipedia.org/wiki/Mata_mata",
        "https://ppbio.inpa.gov.br/en/node/1136"
      ],
      "photo": {
        "by": "",
        "caption": "マタマタの しゃしん",
        "commonsFile": "File:Matamata_turtle_2048x1536.jpg",
        "file": "matamata.jpg",
        "h": 675,
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Matamata_turtle_2048x1536.jpg",
        "w": 900
      }
    },
    {
      "id": "mizukamakiri",
      "name": "ミズカマキリ",
      "yomi": "みずかまきり",
      "place": "mizube",
      "kind": "katachi",
      "inJapan": true,
      "placeS": "ミズカマキリが、水べの くさの あいだに かくれて います。",
      "bodyS": "ミズカマキリは、かれた くきに そっくりな ほそながい からだを もって います。",
      "howS": "水の 中の くきに つかまって じっと して、くきの ように 見えるように なって、かくれます。",
      "naze": "ちかづいて きた えものを つかまえる ためです。さかなからも みを まもれます。",
      "sumika": "にほんの ぬまや いけ、田。水くさが たくさん ある しずかな ところに すんで います。",
      "size": "からだは 4cm から 5cm。おしりの くだを 入れると 6cm ぐらいです。",
      "tabemono": "おたまじゃくしや 小さな さかな、水の 中の 生きものを たべます。",
      "itsu": "はるから あきに よく 見られます。ふゆは 水の そばで ねて います。",
      "nakama": "こんちゅうの なかま（カメムシの なかま）",
      "karada": "おしりに ながい くだが あって、水の 上に 出して いきを します。まえあしは かまの ように まがって いて、えものを はさみます。",
      "motto": [
        "名まえは、まえあしが カマキリに にて いる ことから。でも カマキリの なかまでは ありません。",
        "はねが あるので、とんで ほかの いけへ うつります。",
        "おしりの くだは いきを する ための もので、はりでは ありません。"
      ],
      "sources": [
        "https://www.honda.co.jp/outdoor/knowledge/adventure/picture-book/mizukamakiri/",
        "https://mdc.mo.gov/discover-nature/field-guide/water-scorpions",
        "https://www.kentwildlifetrust.org.uk/wildlife-explorer/invertebrates/bugs/water-stick-insect",
        "https://kotobank.jp/word/%E3%81%BF%E3%81%9A%E3%81%8B%E3%81%BE%E3%81%8D%E3%82%8A-3172114"
      ],
      "photo": {
        "by": "Daiju Azuma",
        "caption": "ミズカマキリの しゃしん",
        "commonsFile": "File:Ranatra_chinensis.jpg",
        "file": "mizukamakiri.jpg",
        "h": 760,
        "license": "CC BY-SA 2.5",
        "source": "https://commons.wikimedia.org/wiki/File:Ranatra_chinensis.jpg",
        "w": 760
      }
    },
    {
      "id": "nihonamagaeru",
      "name": "ニホンアマガエル",
      "yomi": "にほんあまがえる",
      "place": "mizube",
      "kind": "iro",
      "inJapan": true,
      "placeS": "ニホンアマガエルが、田の くさの はの 上に かくれて います。",
      "bodyS": "ニホンアマガエルは、からだの いろを みどりから ちゃいろに かえる ことが できます。",
      "howS": "いる ところの いろに あわせて からだの いろを かえて、かくれます。",
      "naze": "とりや へびから みを まもる ためです。",
      "sumika": "にほんの ほとんど どこでも 見られます。田や 水べの くさむら、にわの 木の 上に います。",
      "size": "2cm から 4.5cm ぐらい。おとなの おやゆびぐらいの 小さな カエルです。",
      "tabemono": "小さな こんちゅうや くもを たべます。",
      "itsu": "はるから あきに 見られます。ふゆは 土の 中で ねて います。",
      "nakama": "カエルの なかま",
      "karada": "手足の 先に まるい きゅうばんが あって、つるつるの はや まどガラスにも はりつけます。はだから よわい しるが 出るので、さわったら 手を あらいます。",
      "motto": [
        "みどりの 上では みどりに、土の 上では ちゃいろに なります。かわるまで 30ぷんから 2じかんぐらい かかります。",
        "あめが ふりそうな とき、よく なきます。",
        "オスは のどを ふくろの ように ふくらませて なきます。"
      ],
      "sources": [
        "https://www.honda.co.jp/outdoor/adventure/nihonamagaeru.html",
        "https://www.cbr.mlit.go.jp/tenjyo/jimusyo/publication/pbl_vertebrate/pdf/009_04.pdf",
        "https://www.nagoya-u.ac.jp/about-nu/public-relations/researchinfo/upload_images/20180628_engg_1.pdf",
        "https://www.city.kawaguchi.lg.jp/material/files/group/228/14.pdf"
      ],
      "photo": {
        "by": "池田正樹 ( talk )masaki ikeda",
        "caption": "ニホンアマガエルの しゃしん",
        "commonsFile": "File:Tree_frog2.jpg",
        "file": "nihonamagaeru.jpg",
        "h": 760,
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Tree_frog2.jpg",
        "w": 466
      }
    },
    {
      "id": "oniyanma_yago",
      "name": "オニヤンマの ヤゴ",
      "yomi": "おにやんまのやご",
      "place": "mizube",
      "kind": "moguru",
      "inJapan": true,
      "placeS": "オニヤンマの ヤゴが、川の そこの すなや おちばの 下に かくれて います。",
      "bodyS": "オニヤンマの ヤゴは、さっと のびる 下あごを もって います。",
      "howS": "すなや おちばに もぐって 目だけ 出して、えものを まって、かくれます。",
      "naze": "ちかづいて きた えものを つかまえる ためです。じぶんも さかなに 見つかりません。",
      "sumika": "にほんの、きれいな 水が ながれる 小川や しみ水の ある ところ。そこの すなや おちばの 中に います。",
      "size": "大きく なった ヤゴは 5cm ぐらい。",
      "tabemono": "おたまじゃくしや 小さな さかな、水の 中の 生きものを たべます。",
      "itsu": "いちねんじゅう 水の 中に います。おとなに なるのは なつ。",
      "nakama": "トンボの 子ども（こんちゅうの なかま）",
      "karada": "下あごが さっと 手の ように のびて、さきの はさみで えものを つかみます。からだ ぜんたいに こまかい けが はえて いて、すなや どろが つきやすく なって います。",
      "motto": [
        "ヤゴの まま 5ねんぐらい 水の 中で すごし、その あいだに 10かいぐらい かわを ぬぎます。",
        "ほかの トンボの ヤゴの ように、おしりから 水を 出して およぐ ことは できません。",
        "よく はれた なつの よる、どろを かぶったまま 水から 上がって おとなに なります。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/オニヤンマ"
      ],
      "photo": {
        "by": "OpenCage",
        "caption": "オニヤンマの ヤゴの しゃしん",
        "commonsFile": "File:Anotogaster sieboldii larva.jpg",
        "file": "oniyanma_yago.jpg",
        "h": 900,
        "license": "CC BY-SA 2.5",
        "source": "https://commons.wikimedia.org/wiki/File:Anotogaster_sieboldii_larva.jpg",
        "w": 900
      }
    },
    {
      "id": "suppon",
      "name": "スッポン",
      "yomi": "すっぽん",
      "place": "mizube",
      "kind": "moguru",
      "inJapan": true,
      "placeS": "スッポンが、水の そこの すなや どろの 中に かくれて います。",
      "bodyS": "スッポンは、ひらたい こうらと、とても ながい くびを もって います。",
      "howS": "すなや どろに からだを うめて、ながい くびだけ のばして、かくれます。",
      "naze": "ちかづいて きた さかなを つかまえる ためです。じぶんも 見つかりません。",
      "sumika": "にほんの 川や いけ、ぬま。すなや どろの そこが ある しずかな ところに すんで います。",
      "size": "こうらの ながさは 20cm から 35cm ぐらい。",
      "tabemono": "さかなや えび、かいや 水の 中の 生きものを たべます。",
      "itsu": "はるから あきに 見られます。ふゆは どろの 中で ねて います。",
      "nakama": "カメの なかま",
      "karada": "こうらは かたく なくて、かわの ように やわらかいです。はなの 先が くだの ように のびて いて、水の 上に 出して いきが できます。",
      "motto": [
        "どろに うまって いても、はなの 先だけ 出して いきが できます。",
        "くびが とても ながく のびるので、こうらの うしろの ほうまで とどきます。",
        "足に みずかきが あって、はやく およげます。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/%E3%82%B9%E3%83%83%E3%83%9D%E3%83%B3",
        "https://en.wikipedia.org/wiki/Chinese_softshell_turtle"
      ],
      "photo": {
        "by": "Clunio",
        "caption": "スッポンの しゃしん",
        "commonsFile": "File:Pelodiscus.jpg",
        "file": "suppon.jpg",
        "h": 760,
        "license": "GFDL",
        "source": "https://commons.wikimedia.org/wiki/File:Pelodiscus.jpg",
        "w": 570
      }
    },
    {
      "id": "taikouchi",
      "name": "タイコウチ",
      "yomi": "たいこうち",
      "place": "mizube",
      "kind": "tsukeru",
      "inJapan": true,
      "placeS": "タイコウチが、水の そこの おちばの 中に かくれて います。",
      "bodyS": "タイコウチは、どろが つきやすい ざらざらの からだを もって います。",
      "howS": "あさい 水の そこで、からだに どろを つけたまま じっと して、かくれます。",
      "naze": "ちかづいて きた えものを つかまえる ためです。",
      "sumika": "にほんの 田や いけ、ぬま。水が あさく、おちばが たまった ところに すんで います。",
      "size": "からだは 3cm から 3.5cm。おしりの くだは 入れないで はかります。",
      "tabemono": "おたまじゃくしや 小さな さかなを たべます。",
      "itsu": "はるから あきに 見られます。ふゆは 水の そばの 土の 中に います。",
      "nakama": "こんちゅうの なかま（カメムシの なかま）",
      "karada": "まえあしが かまの ように なって いて、えものを はさみます。おしりの ながい くだを 水の 上に 出して いきを します。",
      "motto": [
        "名まえは、まえあしを うごかす すがたが たいこを たたく ように 見える ことから。",
        "そとの くにでは 「水の サソリ」と よばれます。ながい くだが しっぽの とげに 見えるからです。",
        "田の 水が なく なると すめなく なるので、田の 水は とても 大せつです。"
      ],
      "sources": [
        "https://www.honda.co.jp/outdoor/adventure/taikouchi.html",
        "https://kotobank.jp/word/%E3%81%9F%E3%81%84%E3%81%93%E3%81%86%E3%81%A1-3157824",
        "https://www.pref.mie.lg.jp/common/content/000968001.pdf"
      ],
      "photo": {
        "by": "Totti",
        "caption": "タイコウチの しゃしん",
        "commonsFile": "File:Laccotrephes_japonensis_Kyoto_aquarium.jpg",
        "file": "taikouchi.jpg",
        "h": 760,
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Laccotrephes_japonensis_Kyoto_aquarium.jpg",
        "w": 558
      }
    },
    {
      "id": "awafukimushi",
      "name": "アワフキムシ",
      "yomi": "あわふきむし",
      "place": "kusamura",
      "kind": "moguru",
      "inJapan": true,
      "placeS": "アワフキムシが、くさむらの くきの あわの 中に かくれて います。",
      "bodyS": "アワフキムシは、あわを つくる ための おしりの しくみを もって います。",
      "howS": "くさの しるを すって、おしりから あわを 出し、あわの 中に 入って、かくれます。",
      "naze": "てきから みを まもる ためです。あわの 中は かわかないので、からだも まもれます。",
      "sumika": "にほんの くさむらや 林の まわり。くさや 木の わかい くきに ついて います。",
      "size": "子どもは 5mm ぐらい。おとなも 1cm ぐらいです。",
      "tabemono": "くさや 木の くきから、しるを すって たべます。",
      "itsu": "はるから はじめの なつ。あわは 5月から 6月に よく 見られます。",
      "nakama": "こんちゅうの なかま（セミに ちかい なかま）",
      "karada": "子どもの あいだは はねが なく、やわらかい からだです。おとなに なると はねが はえて、バッタの ように とびます。",
      "motto": [
        "くきに ついた 白い あわは 「カッコウの つば」とも よばれますが、つばでは ありません。",
        "あわを そっと とると、中に みどりいろの 小さな 子どもが います。",
        "あわは しるの あまった 水と 空気で できて いるので、あまい においが します。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%AF%E3%83%95%E3%82%AD%E3%83%A0%E3%82%B7",
        "https://kotobank.jp/word/%E3%81%82%E3%82%8F%E3%81%B5%E3%81%8D%E3%82%80%E3%81%97-3142325"
      ],
      "photo": {
        "by": "Katja Schulz from Washington, D. C., USA",
        "caption": "アワフキムシの しゃしん",
        "commonsFile": "File:Spittle Bug Nymph - Flickr - treegrow.jpg",
        "file": "awafukimushi.jpg",
        "h": 675,
        "license": "CC BY 2.0",
        "source": "https://commons.wikimedia.org/wiki/File:Spittle_Bug_Nymph_-_Flickr_-_treegrow.jpg",
        "w": 900
      }
    },
    {
      "id": "hanagumo",
      "name": "ハナグモ",
      "yomi": "はなぐも",
      "place": "kusamura",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "ハナグモが、くさむらの 花の 中に かくれて います。",
      "bodyS": "ハナグモは、花と おなじ みどりや 白の からだを もって います。",
      "howS": "花びらの あいだで 足を ひろげて じっと して、花に まぎれて、かくれます。",
      "naze": "花に くる こんちゅうを つかまえる ためです。とりにも 見つかりません。",
      "sumika": "にほんの くさむらや のはら、にわ。くさの 花や はの 上に います。",
      "size": "メスは 6mm から 7mm、オスは 3mm から 4mm。こめつぶぐらいです。",
      "tabemono": "花に あつまる ハチや アブ、小さな こんちゅうを たべます。",
      "itsu": "はるから なつに よく 見られます。ひるまに 花の 上に います。",
      "nakama": "クモの なかま（カニグモの なかま）",
      "karada": "あみを はらないで えものを まちます。まえの 2くみの 足が ながく、カニの ように よこに ひろげます。",
      "motto": [
        "あみを はらないので、花を 見て さがさないと 見つかりません。",
        "じぶんより 大きな ハチも つかまえます。",
        "足を ひろげた すがたが カニに にて いるので、カニグモの なかまと よばれます。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/%E3%83%8F%E3%83%8A%E3%82%B0%E3%83%A2",
        "https://www.higashiyama.city.nagoya.jp/document/education/selfguide_botanical4.pdf",
        "https://www.insects.ch/art/ebrechtelle-tricuspidata-misumenops-tricuspidatus"
      ],
      "photo": {
        "by": "Andreas Eichler",
        "caption": "ハナグモの しゃしん",
        "commonsFile": "File:2013.06.04.-14-Viernheimer_Heide_Viernheim--Dreieck-Krabbenspinne-Weibchen.jpg",
        "file": "hanagumo.jpg",
        "h": 760,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:2013.06.04.-14-Viernheimer_Heide_Viernheim--Dreieck-Krabbenspinne-Weibchen.jpg",
        "w": 899
      }
    },
    {
      "id": "hibari",
      "name": "ヒバリ",
      "yomi": "ひばり",
      "place": "kusamura",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "ヒバリが、くさむらの 土の 上に かくれて います。",
      "bodyS": "ヒバリは、かれくさと おなじ いろの せなかを もって います。",
      "howS": "くさの ねもとで からだを ふせて じっと して、かれくさに まぎれて、かくれます。",
      "naze": "てきから たまごと ひなを まもる ためです。",
      "sumika": "にほんの かわらや のはら、田や はたけの まわり。ひろくて ひの あたる ところに います。",
      "size": "17cm ぐらい。スズメより すこし 大きいぐらいです。",
      "tabemono": "くさの たねや 小さな こんちゅうを たべます。",
      "itsu": "はるに よく 空へ 上がって なきます。いちねんじゅう にほんに います。",
      "nakama": "とりの なかま（ヒバリの なかま）",
      "karada": "あたまの はねを ぴんと おこす ことが できます。あしは じょうぶで、土の 上を あるきまわります。",
      "motto": [
        "すは 土に くぼみを つくって、かれくさで かくします。上から 見ても わかりません。",
        "はるに 空の ずっと 上の ほうで なきながら とまって いる ように 見えるのを 「あげひばり」と いいます。",
        "すに もどる ときは、わざと すから はなれた ところに おりて、あるいて もどります。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/%E3%83%92%E3%83%90%E3%83%AA",
        "https://kotobank.jp/word/%E3%81%B2%E3%81%B0%E3%82%8A-732632"
      ],
      "photo": {
        "by": "Diliff",
        "caption": "ヒバリの しゃしん",
        "commonsFile": "File:Skylark_2,_Lake_District,_England_-_June_2009.jpg",
        "file": "hibari.jpg",
        "h": 675,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Skylark_2%2C_Lake_District%2C_England_-_June_2009.jpg",
        "w": 900
      }
    },
    {
      "id": "kayanezumi",
      "name": "カヤネズミ",
      "yomi": "かやねずみ",
      "place": "kusamura",
      "kind": "moguru",
      "inJapan": true,
      "placeS": "カヤネズミが、くさむらの ススキの あいだに かくれて います。",
      "bodyS": "カヤネズミは、くきに まきつく ための ながい しっぽを もって います。",
      "howS": "くさの はを さいて まるい すを つくり、その 中に 入って、かくれます。",
      "naze": "とりや へびから みを まもる ためです。",
      "sumika": "にほんの ススキや ヨシの しげった くさむら。かわらや 田の まわりに います。",
      "size": "からだは 5cm から 8cm ぐらい。しっぽも おなじくらい ながいです。",
      "tabemono": "くさの たねや 小さな こんちゅうを たべます。",
      "itsu": "いちねんじゅう います。すを つくるのは なつから あき。",
      "nakama": "けものの なかま（ネズミの なかま）",
      "karada": "しっぽを くきに まきつけて、からだを ささえながら くさを のぼります。おもさは 7g から 14g で、にほんの ネズミの 中で いちばん かるい なかまです。",
      "motto": [
        "すは 土の 上では なく、くさの くきの とちゅうに つくります。",
        "すの 大きさは こぶしぐらい。中は やわらかい はで しきつめて あります。",
        "くさむらが へって、見られる ところが すくなく なって います。"
      ],
      "sources": [
        "https://kotobank.jp/word/%E3%82%AB%E3%83%A4%E3%83%8D%E3%82%BA%E3%83%9F-46979",
        "https://www.pref.ishikawa.lg.jp/sizen/reddata/rdb_2009/4_ato/kennsaku2/documents/1-19kayanezumi.pdf",
        "https://www.ses.usp.ac.jp/nenpou/np16/04-05np16gakuironnbunn.pdf",
        "https://www.bunka.pref.mie.lg.jp/common/content/001186017.pdf"
      ],
      "photo": {
        "by": "Hecke",
        "caption": "カヤネズミの しゃしん",
        "commonsFile": "File:Micromysminutus1.jpg",
        "file": "kayanezumi.jpg",
        "h": 623,
        "license": "GFDL",
        "source": "https://commons.wikimedia.org/wiki/File:Micromysminutus1.jpg",
        "w": 900
      }
    },
    {
      "id": "kera",
      "name": "ケラ",
      "yomi": "けら",
      "place": "kusamura",
      "kind": "moguru",
      "inJapan": true,
      "placeS": "ケラが、くさむらの 土の 中に かくれて います。",
      "bodyS": "ケラは、土を ほる ための シャベルの ような まえあしを もって います。",
      "howS": "まえあしで 土を かき出して あなを ほり、土の 中へ もぐって、かくれます。",
      "naze": "とりに 見つからない ように する ためです。土の 中は すずしくて かわきません。",
      "sumika": "にほんの 田の まわりや くさむら、はたけ。しめった やわらかい 土の ある ところに います。",
      "size": "3cm ぐらい。",
      "tabemono": "土の 中の くさの ねや、小さな 生きものを たべます。",
      "itsu": "はるから あきに 見られます。よるに 土から 出て きます。",
      "nakama": "こんちゅうの なかま（コオロギの なかま）",
      "karada": "からだに こまかい けが たくさん はえて いて、土が つきません。はねが あって とべますし、水の 上を およぐ ことも できます。",
      "motto": [
        "土を ほる、とぶ、およぐ、はしる、なく。ぜんぶ できるので、むかしから 「わざの おおい むし」と いわれて きました。",
        "よるに 田から きこえる 「ビー」と いう ながい おとは、ケラの こえです。",
        "手で つかむと、まえあしを ふって 「おて」を する ように 見えます。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/%E3%82%B1%E3%83%A9",
        "https://kotobank.jp/word/%E3%81%91%E3%82%89-1310610"
      ],
      "photo": {
        "by": "辻畠",
        "caption": "ケラの しゃしん",
        "commonsFile": "File:Mole_cricket03.jpg",
        "file": "kera.jpg",
        "h": 397,
        "license": "GFDL",
        "source": "https://commons.wikimedia.org/wiki/File:Mole_cricket03.jpg",
        "w": 900
      }
    },
    {
      "id": "ookamakiri",
      "name": "オオカマキリ",
      "yomi": "おおかまきり",
      "place": "kusamura",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "オオカマキリが、くさむらの くさの 中に かくれて います。",
      "bodyS": "オオカマキリは、くさと おなじ いろの からだと、かまの ような まえあしを もって います。",
      "howS": "くさに そっくりな いろで じっと して、えものが くるまで うごかないで、かくれます。",
      "naze": "ちかづいて きた えものを つかまえる ためです。とりからも みを まもれます。",
      "sumika": "にほんの くさむらや 林の まわり。くさや 小さな 木の はの 上に います。",
      "size": "7cm から 10cm ぐらい。にほんの カマキリで いちばん 大きいです。",
      "tabemono": "バッタや チョウ、ほかの こんちゅうを たべます。",
      "itsu": "なつから あきに 見られます。ふゆは たまごの ふくろで すごします。",
      "nakama": "こんちゅうの なかま（カマキリの なかま）",
      "karada": "あたまだけを ぐるりと まわして うしろまで 見られます。目が 大きく、うごく ものを よく 見つけます。",
      "motto": [
        "みどりの ものと ちゃいろの ものが いて、おなじ しゅるいでも いろが ちがいます。",
        "えものを つかまえる はやさは、まばたきより はやいです。",
        "あきに、あわの ような たまごの ふくろを くさの くきに つけます。"
      ],
      "sources": [
        "https://www.honda.co.jp/outdoor/adventure/ookamakiri.html",
        "https://www.cbr.mlit.go.jp/tenjyo/jimusyo/publication/pbl_insect/pdf/054_065.pdf",
        "https://www.pref.tottori.lg.jp/secure/1072938/1394.pdf"
      ],
      "photo": {
        "by": "Yasunori Koide",
        "caption": "オオカマキリの しゃしん",
        "commonsFile": "File:Tenodera_aridifolia_DSCN9675.jpg",
        "file": "ookamakiri.jpg",
        "h": 675,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Tenodera_aridifolia_DSCN9675.jpg",
        "w": 900
      }
    },
    {
      "id": "shouryoubatta",
      "name": "ショウリョウバッタ",
      "yomi": "しょうりょうばった",
      "place": "kusamura",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "ショウリョウバッタが、くさむらの くさの あいだに かくれて います。",
      "bodyS": "ショウリョウバッタは、くさの はに そっくりな ほそながい からだを もって います。",
      "howS": "くさの くきに そって たてに とまり、くさの はの ように 見えるように なって、かくれます。",
      "naze": "とりや カマキリから みを まもる ためです。",
      "sumika": "にほんの ひの あたる くさむら。かわらや のはら、こうえんの くさの ところに います。",
      "size": "オスは 5cm、メスは 8cm ぐらい。うしろ足を 入れると 15cm ちかくに なります。",
      "tabemono": "イネや ススキなど、はばの せまい くさの はを たべます。",
      "itsu": "なつから あきに 見られます。ひるまに うごきます。",
      "nakama": "こんちゅうの なかま（バッタの なかま）",
      "karada": "あたまが 先に とがって いて、はに にた かたちです。うしろの 足が とても ながく、ぴょんと とびます。",
      "motto": [
        "みどりいろの ものと ちゃいろの ものが いて、いる ところに あわせて ちがいます。",
        "オスは とぶ ときに 「キチキチ」と おとを たてます。",
        "うしろ足を 2ほん そろえて もつと、おじぎを する ように からだを ふります。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/%E3%82%B7%E3%83%A7%E3%82%A6%E3%83%AA%E3%83%A7%E3%82%A6%E3%83%90%E3%83%83%E3%82%BF",
        "https://www.honda.co.jp/outdoor/adventure/shouryoubatta.html",
        "https://www.pref.aichi.jp/uploaded/attachment/506306.pdf"
      ],
      "photo": {
        "by": "cory",
        "caption": "ショウリョウバッタの しゃしん",
        "commonsFile": "File:Shoryobatta_06z1482sv.jpg",
        "file": "shouryoubatta.jpg",
        "h": 760,
        "license": "GFDL",
        "source": "https://commons.wikimedia.org/wiki/File:Shoryobatta_06z1482sv.jpg",
        "w": 570
      }
    },
    {
      "id": "tonosamabatta",
      "name": "トノサマバッタ",
      "yomi": "とのさまばった",
      "place": "kusamura",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "トノサマバッタが、くさむらの かれくさの 中に かくれて います。",
      "bodyS": "トノサマバッタは、くさと おなじ いろに なる からだを もって います。",
      "howS": "くさの あいだで じっと して、くさと 見わけが つかないように なって、かくれます。",
      "naze": "とりや カマキリから みを まもる ためです。",
      "sumika": "にほんの ひろい くさむらや かわら、うみべの すなはまの くさの ところ。ひの よく あたる ひろい ところに います。",
      "size": "3.5cm から 6.5cm ぐらい。メスの ほうが 大きいです。",
      "tabemono": "イネや ススキなどの くさの はを たべます。",
      "itsu": "なつから あきに 見られます。ひるまに うごきます。",
      "nakama": "こんちゅうの なかま（バッタの なかま）",
      "karada": "うしろ足が とても ふとく、じぶんの からだの 20ばいも とべます。はねが ながく、とおくまで とんで いけます。",
      "motto": [
        "そだつ ときの まわりの こみぐあいで、みどりいろに なるか ちゃいろに なるか かわります。",
        "こみあった ところで そだつと、はねが ながく、とおくまで とぶ すがたに なります。",
        "とぶ ときに はねを ひろげると、いろが かわって 見えて、てきを まどわせます。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/トノサマバッタ",
        "https://en.wikipedia.org/wiki/Locusta_migratoria"
      ],
      "photo": {
        "by": "Matsumomushi",
        "caption": "トノサマバッタの しゃしん",
        "commonsFile": "File:Locusta_migratoria.jpg",
        "file": "tonosamabatta.jpg",
        "h": 675,
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Locusta_migratoria.jpg",
        "w": 900
      }
    },
    {
      "id": "aburazemi",
      "name": "アブラゼミ",
      "yomi": "あぶらぜみ",
      "place": "mori",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "アブラゼミが、林の 木の みきに かくれて います。",
      "bodyS": "アブラゼミは、木の かわと おなじ ちゃいろの はねを もって います。",
      "howS": "木の みきに とまって じっと して、かわと 見わけが つかないように なって、かくれます。",
      "naze": "とりに 見つからない ように する ためです。",
      "sumika": "にほんの 林や こうえん、まちの 木。子どもの あいだは 土の 中で くらします。",
      "size": "はねを ふくめた ながさは 5cm から 6cm ぐらい。",
      "tabemono": "木の みきに 口を さして、しるを すいます。",
      "itsu": "なつ。7月から 9月に なきます。",
      "nakama": "こんちゅうの なかま（セミの なかま）",
      "karada": "はねが すきとおらないで ちゃいろなのは、セミの 中では めずらしい ことです。だから 木の かわと よく あいます。",
      "motto": [
        "子どもの あいだは、土の 中で 3ねんから 4ねん すごします。",
        "はねが すきとおらないので、木に とまると どこに いるか わかりません。",
        "「ジリジリ」と なく こえが、あぶらを あげる ときの おとに にて いるので この 名まえです。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/アブラゼミ",
        "https://en.wikipedia.org/wiki/Graptopsaltria_nigrofuscata",
        "https://www.insects.jp/kon-semiabura.htm"
      ],
      "photo": {
        "by": "池田正樹",
        "caption": "アブラゼミの しゃしん",
        "commonsFile": "File:Large_Brown_Cicada_23aug12.jpg",
        "file": "aburazemi.jpg",
        "h": 760,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Large_Brown_Cicada_23aug12.jpg",
        "w": 461
      }
    },
    {
      "id": "akebikonoha",
      "name": "アケビコノハ",
      "yomi": "あけびこのは",
      "place": "mori",
      "kind": "katachi",
      "inJapan": true,
      "placeS": "アケビコノハが、林の おちばの 上に かくれて います。",
      "bodyS": "アケビコノハは、かれはに そっくりな かたちと もようの はねを もって います。",
      "howS": "はねを とじて おちばの 上に とまり、かれはの ように 見えるように なって、かくれます。",
      "naze": "とりに 見つからない ように する ためです。",
      "sumika": "にほんの 林や もりの まわり。アケビや ムベの つるが ある ところに います。",
      "size": "はねを ひろげると 9cm から 10cm ぐらい。",
      "tabemono": "おとなは くだものの しるを すいます。子どもは アケビの はを たべます。",
      "itsu": "はるから あきに 見られます。よるに とびます。",
      "nakama": "ガの なかま（こんちゅうの なかま）",
      "karada": "とじた はねには、かれはの すじまで もようで えがかれて います。うしろの はねは あざやかな きいろで、ふだんは かくれて います。",
      "motto": [
        "おどろかすと、きいろの うしろばねを ぱっと 見せて、てきを びっくりさせます。",
        "子どもは からだの よこに 大きな 目の ような もようが あって、へびの ように 見えます。",
        "とじた はねの かたちは、まるく まるまった かれはと そっくりです。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/アケビコノハ",
        "https://www.insects.jp/kon-gaakebikonoha.htm"
      ],
      "photo": {
        "by": "森津",
        "caption": "アケビコノハの しゃしん",
        "commonsFile": "File:アケビコノハ_Eudocima_tyrannus_成虫,_高知県.jpg",
        "file": "akebikonoha.jpg",
        "h": 600,
        "license": "CC0",
        "source": "https://commons.wikimedia.org/wiki/File:%E3%82%A2%E3%82%B1%E3%83%93%E3%82%B3%E3%83%8E%E3%83%8F_Eudocima_tyrannus_%E6%88%90%E8%99%AB%2C_%E9%AB%98%E7%9F%A5%E7%9C%8C.jpg",
        "w": 900
      }
    },
    {
      "id": "arigumo",
      "name": "アリグモ",
      "yomi": "ありぐも",
      "place": "mori",
      "kind": "katachi",
      "inJapan": true,
      "placeS": "アリグモが、林の はの 上に かくれて います。",
      "bodyS": "アリグモは、アリに そっくりな くびれた からだを もって います。",
      "howS": "まえの 足を 2ほん 上げて しょっかくの ように ふり、アリの ふりを して、かくれます。",
      "naze": "アリを こわがる てきに 「アリだ」と おもわせて、みを まもる ためです。",
      "sumika": "にほんの 林や こうえん、にわ。木や くさの はの 上を あるきまわって います。",
      "size": "アリと おなじくらいで、ゆびの つめより 小さいです。",
      "tabemono": "小さな こんちゅうを つかまえて たべます。",
      "itsu": "はるから あきに 見られます。ひるまに うごきます。",
      "nakama": "クモの なかま（ハエトリグモの なかま）",
      "karada": "からだが アリの ように 2つに くびれて 見えます。足は 8ほん ありますが、2ほんを しょっかくの ように つかうので 6ぽんに 見えます。",
      "motto": [
        "足を かぞえると わかります。アリは 6ぽん、アリグモは 8ほんです。",
        "アリの そばを あるいて いても、見わけが つきません。",
        "オスは 大きな あごを もって いて、アリよりも 目だちます。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/アリグモ",
        "https://en.wikipedia.org/wiki/Myrmarachne"
      ],
      "photo": {
        "by": "spidereyes",
        "caption": "アリグモの しゃしん",
        "commonsFile": "File:Myrmarachne_formicaria_76645969.jpg",
        "file": "arigumo.jpg",
        "h": 675,
        "license": "CC0",
        "source": "https://commons.wikimedia.org/wiki/File:Myrmarachne_formicaria_76645969.jpg",
        "w": 900
      }
    },
    {
      "id": "glassfrog",
      "name": "グラスフロッグ",
      "yomi": "ぐらすふろっぐ",
      "place": "mori",
      "kind": "sukitoru",
      "inJapan": false,
      "placeS": "グラスフロッグが、もりの はの うらに かくれて います。",
      "bodyS": "グラスフロッグは、すきとおった おなかの かわを もって います。",
      "howS": "はの うらに はりついて、ひかりを すかして はの いろに 見えるように なって、かくれます。",
      "naze": "下から 見上げる へびや とりに 見つからない ように する ためです。",
      "sumika": "中アメリカや みなみアメリカの あたたかい もり。川の そばの 木の はの うらに います。",
      "size": "2cm から 3cm ぐらい。おとなの つめぐらいの 大きさです。",
      "tabemono": "小さな こんちゅうや くもを たべます。",
      "itsu": "あたたかい ところでは いちねんじゅう。よるに うごきます。",
      "nakama": "カエルの なかま",
      "karada": "おなかの かわが すきとおって いて、下から 見ると からだの 中の しくみが 見えます。せなかは うすい みどりいろです。",
      "motto": [
        "ねむる あいだは、からだの 中の あかい ものを きもに あつめて、もっと すきとおります。",
        "すきとおった もけいを 木の はに おくと、とりに ねらわれる ことが ずっと すくなかった と いう しらべが あります。",
        "オスは たまごの そばに のこって、生まれるまで まもります。"
      ],
      "sources": [
        "https://en.wikipedia.org/wiki/Glass_frog",
        "https://doi.org/10.1126/science.abl6620"
      ],
      "photo": {
        "by": "Carlos Funes",
        "caption": "グラスフロッグの しゃしん",
        "commonsFile": "File:Hyalinobatrachium fleischmanni 246060834.jpg",
        "file": "glassfrog.jpg",
        "h": 1100,
        "license": "CC BY 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Hyalinobatrachium_fleischmanni_246060834.jpg",
        "w": 825
      }
    },
    {
      "id": "heraoyamori",
      "name": "ヘラオヤモリ",
      "yomi": "へらおやもり",
      "place": "mori",
      "kind": "sokkuri",
      "inJapan": false,
      "placeS": "ヘラオヤモリが、もりの 木の みきに かくれて います。",
      "bodyS": "ヘラオヤモリは、木の かわと おなじ もようの はだを もって います。",
      "howS": "みきに ぺたりと はりついて、からだの ふちの かわを ひろげて かげを けして、かくれます。",
      "naze": "とりや へびに 見つからない ように する ためです。",
      "sumika": "マダガスカルの もり。木の みきや えだに はりついて くらして います。",
      "size": "しゅるいに よって 10cm から 30cm ぐらい。",
      "tabemono": "こんちゅうや くもを たべます。",
      "itsu": "マダガスカルでは いちねんじゅう。よるに うごきます。",
      "nakama": "ヤモリの なかま",
      "karada": "からだの ふちに ひらひらした かわが あって、みきに はりつくと かげが できません。しっぽは はっぱの ように ひらたいです。",
      "motto": [
        "かげが できないので、あかるい ひるまでも 見つけられません。",
        "目は うごかさなくても、まわりを ひろく 見られます。",
        "マダガスカルにだけ すんで いる 生きものです。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/ヘラオヤモリ",
        "https://en.wikipedia.org/wiki/Uroplatus"
      ],
      "photo": {
        "by": "Frank Vassen from Brussels, Belgium",
        "caption": "ヘラオヤモリの しゃしん",
        "commonsFile": "File:Giant_Leaf-tailed_Gecko,_Nosy_Mangabe,_Madagascar_(4023062244).jpg",
        "file": "heraoyamori.jpg",
        "h": 675,
        "license": "CC BY 2.0",
        "source": "https://commons.wikimedia.org/wiki/File:Giant_Leaf-tailed_Gecko%2C_Nosy_Mangabe%2C_Madagascar_%284023062244%29.jpg",
        "w": 900
      }
    },
    {
      "id": "kinokawaga",
      "name": "キノカワガ",
      "yomi": "きのかわが",
      "place": "mori",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "キノカワガが、林の 木の かわの 上に かくれて います。",
      "bodyS": "キノカワガは、木の かわと おなじ もようの はねを もって います。",
      "howS": "木の かわに ぺたりと はりついて じっと して、かわと 見わけが つかないように なって、かくれます。",
      "naze": "とりに 見つからない ように する ためです。",
      "sumika": "にほんの 林や こうえん。カキや サクラの 木の かわの 上に とまって います。",
      "size": "はねを ひろげると 4cm ぐらい。",
      "tabemono": "おとなは 木の しるを すいます。子どもは カキの はを たべます。",
      "itsu": "あきから ふゆに、木の かわに とまって いる ところが 見つかります。",
      "nakama": "ガの なかま（こんちゅうの なかま）",
      "karada": "はねの もようは 1ぴき 1ぴき ちがいます。こけの ついた かわに あう ものも、つるつるの かわに あう ものも います。",
      "motto": [
        "ふゆの あいだ、木の かわに とまったまま うごかないで すごします。",
        "目の 先に いても、もようが かわと おなじなので 気づきません。",
        "「木の かわの ガ」と いう 名まえの とおりの すがたです。"
      ],
      "sources": [
        "https://en.wikipedia.org/wiki/Blenina_senex",
        "https://www.insects.jp/kon-gakinokawa.htm",
        "https://ja.wikipedia.org/wiki/コブガ科"
      ],
      "photo": {
        "by": "LiCheng Shih",
        "caption": "キノカワガの しゃしん",
        "commonsFile": "File:Blenina senex (35533165746).jpg",
        "file": "kinokawaga.jpg",
        "h": 600,
        "license": "CC BY 2.0",
        "source": "https://commons.wikimedia.org/wiki/File:Blenina_senex_(35533165746).jpg",
        "w": 900
      }
    },
    {
      "id": "konohachou",
      "name": "コノハチョウ",
      "yomi": "このはちょう",
      "place": "mori",
      "kind": "katachi",
      "inJapan": true,
      "placeS": "コノハチョウが、林の 木の みきに かくれて います。",
      "bodyS": "コノハチョウは、かれはに そっくりな はねの うらがわを もって います。",
      "howS": "はねを とじて みきに とまり、かれはの ように 見えるように なって、かくれます。",
      "naze": "とりに 見つからない ように する ためです。",
      "sumika": "にほんでは おきなわなどの みなみの しまの 林。あたたかい もりの 中に います。",
      "size": "はねを ひろげると 7cm から 9cm ぐらい。",
      "tabemono": "おとなは くだものの しるを すいます。子どもは くさの はを たべます。",
      "itsu": "いちねんじゅう 見られます。おとなの まま ふゆを こします。",
      "nakama": "チョウの なかま（タテハチョウの なかま）",
      "karada": "はねの うらは かれはの いろで、まん中に はの すじの ような せんが 1ぽん はいって います。ひらくと あざやかな だいだいいろと 青が 出て きます。",
      "motto": [
        "とじた はねには、かれはの すじだけで なく、かびの しみまで もようで えがかれて います。",
        "とまる ときは、かれはの ように あたまを 下に むけます。",
        "おきなわでは 大せつな 生きものとして まもられて います。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/コノハチョウ",
        "https://en.wikipedia.org/wiki/Kallima_inachus"
      ],
      "photo": {
        "by": "Opencage",
        "caption": "コノハチョウの しゃしん",
        "commonsFile": "File:Kallima_inachus.jpg",
        "file": "konohachou.jpg",
        "h": 760,
        "license": "CC BY-SA 2.5",
        "source": "https://commons.wikimedia.org/wiki/File:Kallima_inachus.jpg",
        "w": 759
      }
    },
    {
      "id": "konohamushi",
      "name": "コノハムシ",
      "yomi": "このはむし",
      "place": "mori",
      "kind": "katachi",
      "inJapan": false,
      "placeS": "コノハムシが、もりの はの あいだに かくれて います。",
      "bodyS": "コノハムシは、はに そっくりな ひらたい からだを もって います。",
      "howS": "はの あいだで じっと して、かぜに あわせて ゆれて、かくれます。",
      "naze": "とりや サルに 見つからない ように する ためです。",
      "sumika": "アジアの あたたかい もり。マレーシアや インドネシアなどの 木の 上で くらして います。",
      "size": "メスは 7cm から 9cm、オスは 5cm から 6cm ぐらいです。",
      "tabemono": "木の はを たべます。",
      "itsu": "あたたかい ところでは いちねんじゅう 見られます。",
      "nakama": "こんちゅうの なかま（ナナフシに ちかい なかま）",
      "karada": "からだだけで なく、足にも はの ような ひらひらが ついて います。はの すじや、かじられた あとまで もようで できて います。",
      "motto": [
        "かれた ところや あなの あいた ところまで もようで できて いて、ほんものの はと 見わけが つきません。",
        "あるく ときは、かぜに ゆれる はの ように からだを ゆらします。",
        "たまごは くさの たねに そっくりで、土に おちると わかりません。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/コノハムシ",
        "https://en.wikipedia.org/wiki/Phyllium"
      ],
      "photo": {
        "by": "Drägüs",
        "caption": "コノハムシの しゃしん",
        "commonsFile": "File:Phyllium_siccifolium_-_female_larva_L4.JPG",
        "file": "konohamushi.jpg",
        "h": 641,
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Phyllium_siccifolium_-_female_larva_L4.JPG",
        "w": 900
      }
    },
    {
      "id": "minomushi",
      "name": "ミノムシ",
      "yomi": "みのむし",
      "place": "mori",
      "kind": "tsukeru",
      "inJapan": true,
      "placeS": "ミノムシが、林の 木の えだに かくれて います。",
      "bodyS": "ミノムシは、いとを 出す 口を もって います。",
      "howS": "木の えだや はを いとで つなぎあわせて みのを つくり、その 中に 入って、かくれます。",
      "naze": "とりに 見つからない ように する ためです。ふゆの さむさからも みを まもれます。",
      "sumika": "にほんの 林や こうえん、にわの 木。えだや かきねに ぶらさがって います。",
      "size": "みのの ながさは 2cm から 5cm ぐらい。",
      "tabemono": "木の はを たべます。みのから あたまだけ 出して たべます。",
      "itsu": "いちねんじゅう 見られます。はが おちた ふゆは とくに 見つけやすいです。",
      "nakama": "ガの 子ども（こんちゅうの なかま）",
      "karada": "みのの そとがわは えだや はで できて いて、中は やわらかい いとで できて います。あたまと まえあしだけ 出して うごきます。",
      "motto": [
        "みのは その 木の えだと はで できて いるので、ついて いる 木に いちばん よく あいます。",
        "メスは おとなに なっても はねが なく、みのから 出ないで すごします。",
        "しゅるいに よって みのの かたちが ちがうので、みのを 見ると だれの みのか わかります。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/ミノムシ",
        "https://en.wikipedia.org/wiki/Bagworm_moth"
      ],
      "photo": {
        "by": "Kyu3a",
        "caption": "ミノムシの しゃしん",
        "commonsFile": "File:Eumeta variegata on the window of convenience store.jpg",
        "file": "minomushi.jpg",
        "h": 760,
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Eumeta_variegata_on_the_window_of_convenience_store.jpg",
        "w": 570
      }
    },
    {
      "id": "murasakishachihoko",
      "name": "ムラサキシャチホコ",
      "yomi": "むらさきしゃちほこ",
      "place": "mori",
      "kind": "katachi",
      "inJapan": true,
      "placeS": "ムラサキシャチホコが、林の 木の えだに かくれて います。",
      "bodyS": "ムラサキシャチホコは、まるまった かれはに 見える もようの はねを もって います。",
      "howS": "はねを ひらいたまま とまって、くるりと まるまった かれはの ように 見せて、かくれます。",
      "naze": "とりに 見つからない ように する ためです。",
      "sumika": "にほんの 林や もり。オニグルミなどの 木が ある ところに います。",
      "size": "はねを ひろげると 4.5cm から 5.5cm ぐらい。",
      "tabemono": "子どもは オニグルミや サワグルミの はを たべます。",
      "itsu": "なつに 見られます。よるに とびます。",
      "nakama": "ガの なかま（シャチホコガの なかま）",
      "karada": "はねは ほんとうは たいらなのに、もようの かげだけで 「まるまって いる」ように 見えます。さわると たいらで おどろきます。",
      "motto": [
        "まるまった かれはに 見えるのは かたちでは なく、かきこまれた かげの もようです。",
        "よこから 見ると たいらだと わかりますが、上から 見ると わかりません。",
        "「だましえ」の ような すがたで、せかいでも 名だかい ガです。"
      ],
      "sources": [
        "https://en.wikipedia.org/wiki/Uropyia_meticulodina",
        "https://ja.wikipedia.org/wiki/擬態"
      ],
      "photo": {
        "by": "Hsu Hong Lin",
        "caption": "ムラサキシャチホコの しゃしん",
        "commonsFile": "File:Uropyia_meticulodina.jpg",
        "file": "murasakishachihoko.jpg",
        "h": 600,
        "license": "CC BY-SA 2.0",
        "source": "https://commons.wikimedia.org/wiki/File:Uropyia_meticulodina.jpg",
        "w": 900
      }
    },
    {
      "id": "nanafushi",
      "name": "ナナフシ",
      "yomi": "ななふし",
      "place": "mori",
      "kind": "katachi",
      "inJapan": true,
      "placeS": "ナナフシが、林の 木の えだに かくれて います。",
      "bodyS": "ナナフシは、木の えだに そっくりな ほそながい からだを もって います。",
      "howS": "えだに そって 足を まっすぐ のばし、えだの ように 見えるように なって、かくれます。",
      "naze": "とりに 見つからない ように する ためです。",
      "sumika": "にほんの 林や もり、こうえんの 木。はを たべる 木の 上で くらして います。",
      "size": "7cm から 11cm ぐらい。",
      "tabemono": "サクラや ケヤキ、コナラなどの 木の はを たべます。",
      "itsu": "なつから あきに 見られます。ひるまは うごきません。",
      "nakama": "こんちゅうの なかま（ナナフシの なかま）",
      "karada": "足が 6ぽん とも 木の えだの ように ほそく、1ぽん とれても また はえて きます。かぜが ふくと、えだの ように からだを ゆらします。",
      "motto": [
        "にほんに おおい しゅるいは メスだけで たまごを うみ、オスは ほとんど 見つかりません。",
        "たまごは くさの たねに そっくりで、土の 上に おちると 見わけが つきません。",
        "じっと して いるので、えだと おもって つかんで しまう ことが あります。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/ナナフシ",
        "https://en.wikipedia.org/wiki/Phasmatodea"
      ],
      "photo": {
        "by": "Frank Hennemann",
        "caption": "ナナフシの しゃしん",
        "commonsFile": "File:Myronides_glaucus_Hennemann,_2021_female.jpg",
        "file": "nanafushi.jpg",
        "h": 676,
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Myronides_glaucus_Hennemann%2C_2021_female.jpg",
        "w": 900
      }
    },
    {
      "id": "yotaka",
      "name": "ヨタカ",
      "yomi": "よたか",
      "place": "mori",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "ヨタカが、林の おちばの 上に かくれて います。",
      "bodyS": "ヨタカは、かれはと おちばに そっくりな もようの はねを もって います。",
      "howS": "ひるまは 木の えだや 土の 上で 目を とじて じっと して、おちばに まぎれて、かくれます。",
      "naze": "ひるまに ねむる あいだ、てきに 見つからない ように する ためです。",
      "sumika": "にほんの 林や もりの、すこし ひらけた ところ。土の 上で たまごを そだてます。",
      "size": "25cm から 30cm ぐらい。30cm の ものさしと おなじくらいです。",
      "tabemono": "とびながら 口を 大きく あけて、ガや こんちゅうを すくいとります。",
      "itsu": "なつに にほんへ きます。よるに うごきます。",
      "nakama": "とりの なかま（ヨタカの なかま）",
      "karada": "口が とても 大きく ひらきます。目が 大きいので、くらい よるでも えものが 見えます。",
      "motto": [
        "すを つくらないで、土の 上に そのまま たまごを うみます。",
        "木の えだに よこむきに とまるので、えだの こぶの ように 見えます。",
        "よるに 「キョキョキョキョ」と ずっと つづけて なきます。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/ヨタカ",
        "https://en.wikipedia.org/wiki/Grey_nightjar"
      ],
      "photo": {
        "by": "Koshy Koshy",
        "caption": "ヨタカの しゃしん",
        "commonsFile": "File:Grey_Nightjar.jpg",
        "file": "yotaka.jpg",
        "h": 562,
        "license": "CC BY 2.0",
        "source": "https://commons.wikimedia.org/wiki/File:Grey_Nightjar.jpg",
        "w": 900
      }
    },
    {
      "id": "arijigoku",
      "name": "アリジゴク",
      "yomi": "ありじごく",
      "place": "tsuchi",
      "kind": "moguru",
      "inJapan": true,
      "placeS": "アリジゴクが、かわいた すなの すりばちの 中に かくれて います。",
      "bodyS": "アリジゴクは、えものを はさむ 大きな あごを もって います。",
      "howS": "すなを はねとばして すりばちの ような あなを つくり、その そこに うまって、かくれます。",
      "naze": "すべりおちて きた アリを つかまえる ためです。",
      "sumika": "にほんの、あめの かからない かわいた すな。おてらの のき下や、大きな 木の 下の すなに あります。",
      "size": "あなの ふかさは 5cm、ひろさは 7cm ぐらい。からだは それより ずっと 小さいです。",
      "tabemono": "あなに おちて きた アリや、小さな こんちゅうを たべます。",
      "itsu": "はるから あきに 見られます。あなは いちねんじゅう あります。",
      "nakama": "ウスバカゲロウの 子ども（こんちゅうの なかま）",
      "karada": "からだは すなと おなじ いろで、すなに うまると 見えません。足の つきかたの せいで、うしろむきにしか あるけません。",
      "motto": [
        "おとなに なると、トンボに にた ウスバカゲロウと いう すがたに なります。",
        "おとなに なるまで、からだの 中に いらない ものを ずっと ためて います。",
        "すなを そっと ほると、まるい からだが 出て きます。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/アリジゴク",
        "https://en.wikipedia.org/wiki/Antlion"
      ],
      "photo": {
        "by": "LoKiLeCh",
        "caption": "アリジゴクの しゃしん",
        "commonsFile": "File:Ameisenlöwe.jpg",
        "file": "arijigoku.jpg",
        "h": 494,
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Ameisenlöwe.jpg",
        "w": 900
      }
    },
    {
      "id": "azumahikigaeru",
      "name": "アズマヒキガエル",
      "yomi": "あずまひきがえる",
      "place": "tsuchi",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "アズマヒキガエルが、林の おちばの 中に かくれて います。",
      "bodyS": "アズマヒキガエルは、土と おちばに そっくりな ざらざらの はだを もって います。",
      "howS": "おちばの 中に からだを うずめて、ひるまは じっと して、かくれます。",
      "naze": "てきに 見つからない ように する ためです。からだが かわくのも ふせげます。",
      "sumika": "にほんの、とうほくから きんきの あたりまで。林や こうえん、にわの 土や おちばの 下に います。",
      "size": "6cm から 18cm ぐらい。にほんの カエルの 中で とても 大きい ほうです。",
      "tabemono": "アリや ミミズ、こんちゅうを たべます。",
      "itsu": "はるの はじめに 水に あつまって たまごを うみます。ふゆは 土の 中です。",
      "nakama": "カエルの なかま",
      "karada": "足が みじかいので、ぴょんぴょん とばないで のこのこ あるきます。目の うしろに 大きな こぶが あって、そこから つよい しるが 出ます。",
      "motto": [
        "さわったら かならず 手を あらいます。しるが ついた 手で 目を こすっては いけません。",
        "たまごは ひもの ように ながく つながって いて、2000こ いじょうも あります。",
        "はやく にげられないので、かくれる ことで みを まもって います。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/アズマヒキガエル"
      ],
      "photo": {
        "by": "Yasunori Koide",
        "caption": "アズマヒキガエルの しゃしん",
        "commonsFile": "File:Bufo_japonicus_DSCN9873.jpg",
        "file": "azumahikigaeru.jpg",
        "h": 675,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Bufo_japonicus_DSCN9873.jpg",
        "w": 900
      }
    },
    {
      "id": "azumamogura",
      "name": "アズマモグラ",
      "yomi": "あずまもぐら",
      "place": "tsuchi",
      "kind": "moguru",
      "inJapan": true,
      "placeS": "アズマモグラが、土の 中の トンネルに かくれて います。",
      "bodyS": "アズマモグラは、土を かき出す ための 大きな 手を もって います。",
      "howS": "大きな 手で 土を ほって トンネルを つくり、その 中で くらして、かくれます。",
      "naze": "とりや キツネに 見つからない ように する ためです。",
      "sumika": "にほんの ひがしがわ。はたけや 田の まわり、林の やわらかい 土の 中に います。",
      "size": "からだは 12cm から 16cm ぐらい。しっぽは 1cm から 2cm で とても みじかいです。",
      "tabemono": "土の 中の ミミズや こんちゅうの 子どもを たべます。",
      "itsu": "いちねんじゅう。土の もりあがりで いる ことが わかります。",
      "nakama": "けものの なかま（モグラの なかま）",
      "karada": "目は ほとんど 見えませんが、はなの 先と けで 土の うごきを かんじとります。けは どちらに なでても ねるので、トンネルの 中を さきにも うしろにも すすめます。",
      "motto": [
        "1日に、じぶんの おもさの はんぶん ちかくの ミミズを たべます。",
        "土が すじの ように もりあがって いる ところが、トンネルの しるしです。",
        "目が 見えなくても、ミミズが うごく ゆれを かんじとります。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/アズマモグラ",
        "https://en.wikipedia.org/wiki/Mole_(animal)"
      ],
      "photo": {
        "by": "Koolah ( talk )",
        "caption": "アズマモグラの しゃしん",
        "commonsFile": "File:Mogera_imaizumii.jpg",
        "file": "azumamogura.jpg",
        "h": 675,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Mogera_imaizumii.jpg",
        "w": 900
      }
    },
    {
      "id": "jigumo",
      "name": "ジグモ",
      "yomi": "じぐも",
      "place": "tsuchi",
      "kind": "moguru",
      "inJapan": true,
      "placeS": "ジグモが、土の 中の いとの ふくろに かくれて います。",
      "bodyS": "ジグモは、いとで ながい ふくろを つくる しくみを もって います。",
      "howS": "土の 中に いとの ふくろを つくり、そとがわに 土を つけて、その 中に 入って、かくれます。",
      "naze": "とりに 見つからない ように する ためです。そばを とおる こんちゅうを つかまえる ためでも あります。",
      "sumika": "にほんの おてらの かべの そばや、大きな 木の ねもと、石がきの すきま。",
      "size": "メスは 1.8cm、オスは 1.3cm ぐらい。おとなの ゆびの つめぐらいです。",
      "tabemono": "ふくろの そばを あるく アリや ダンゴムシを たべます。",
      "itsu": "いちねんじゅう。はるから なつに よく 見つかります。",
      "nakama": "クモの なかま",
      "karada": "あごが 大きく、ふくろの 中から えものを はさみます。ふくろの そとがわに 土が ついて いるので、かべと 見わけが つきません。",
      "motto": [
        "ふくろを そっと ひっぱると、土の 中から ながい ふくろが 出て きます。",
        "ふくろの 中から、そとを とおる こんちゅうの ゆれを かんじて つかまえます。",
        "子どもは 大きく なるまで、おやの ふくろの 中で すごします。"
      ],
      "sources": [
        "https://kotobank.jp/word/%E3%81%98%E3%81%90%E3%82%82-3155349",
        "https://www.pref.okayama.jp/uploaded/attachment/387130.pdf",
        "https://www.jstage.jst.go.jp/article/asjaa1936/19/1/19_1_10/_article/-char/ja"
      ],
      "photo": {
        "by": "Daiju Azuma",
        "caption": "ジグモの しゃしん",
        "commonsFile": "File:Atypus_karschi.jpg",
        "file": "jigumo.jpg",
        "h": 760,
        "license": "CC BY-SA 2.5",
        "source": "https://commons.wikimedia.org/wiki/File:Atypus_karschi.jpg",
        "w": 759
      }
    },
    {
      "id": "mitsuzunokonohagaeru",
      "name": "ミツヅノコノハガエル",
      "yomi": "みつづのこのはがえる",
      "place": "tsuchi",
      "kind": "katachi",
      "inJapan": false,
      "placeS": "ミツヅノコノハガエルが、もりの おちばの 中に かくれて います。",
      "bodyS": "ミツヅノコノハガエルは、かれはに そっくりな かたちと もようの からだを もって います。",
      "howS": "おちばの 上で じっと して、かれはの ように 見えるように なって、かくれます。",
      "naze": "ちかづいて きた えものを つかまえる ためです。てきにも 見つかりません。",
      "sumika": "アジアの あたたかい もり。マレーシアや インドネシアの、川の そばの おちばの ところに います。",
      "size": "メスは 16cm、オスは 10cm ぐらい。おとなの 手の ひらぐらいです。",
      "tabemono": "こんちゅうや くも、小さな カエルを たべます。",
      "itsu": "あたたかい ところでは いちねんじゅう。よるに うごきます。",
      "nakama": "カエルの なかま",
      "karada": "目の 上と はなの 先が つのの ように とがって いて、かれはの さきに 見えます。せなかの すじは、はの すじの ようです。",
      "motto": [
        "名まえの 「ミツヅノ」は、つのの ように 見える ところが 3つ ある ことから。",
        "口が とても 大きく、じぶんの あたまと おなじくらい ひろがります。",
        "おちばの 上に いると、どこに いるか ほんとうに わかりません。"
      ],
      "sources": [
        "https://www.nparks.gov.sg/florafaunaweb/fauna/1/2/1236",
        "https://biome.nparks.gov.sg/Help/SpeciesDetail/?sId=332",
        "https://singapore.biodiversity.online/taxo4254/mainSpace/Megophrys%20nasuta.html",
        "https://www.mybis.gov.my/art/100"
      ],
      "photo": {
        "by": "Olei",
        "caption": "ミツヅノコノハガエルの しゃしん",
        "commonsFile": "File:Megophrys.nasuta.7034.jpg",
        "file": "mitsuzunokonohagaeru.jpg",
        "h": 585,
        "license": "CC BY-SA 2.5",
        "source": "https://commons.wikimedia.org/wiki/File:Megophrys.nasuta.7034.jpg",
        "w": 900
      }
    },
    {
      "id": "nihontokage",
      "name": "ニホントカゲ",
      "yomi": "にほんとかげ",
      "place": "tsuchi",
      "kind": "moguru",
      "inJapan": true,
      "placeS": "ニホントカゲが、土の 中や 石の 下に かくれて います。",
      "bodyS": "ニホントカゲは、土を ほる ための じょうぶな 手足を もって います。",
      "howS": "あぶなく なると、石の 下や 土の あなに すばやく もぐって、かくれます。",
      "naze": "とりや へびから みを まもる ためです。",
      "sumika": "にほんの、日の あたる 石がきや かわら、林の ふち。日なたの ある ところに います。",
      "size": "しっぽを 入れて 17cm から 22cm ぐらい。しっぽが はんぶんぐらい あります。",
      "tabemono": "こんちゅうや くも、ミミズを たべます。",
      "itsu": "はるから あきに 見られます。ふゆは 土の 中で ねて います。",
      "nakama": "トカゲの なかま",
      "karada": "からだは つるつるで、石の せまい すきまにも すっと 入れます。しっぽは つかまれると きれて、きれた しっぽは しばらく うごきます。",
      "motto": [
        "子どもの しっぽは あざやかな 青で、おとなに なると ちゃいろに なります。",
        "きれた しっぽは あとから はえて きますが、もとと おなじには なりません。",
        "ひがしの にほんに いる ものは、よく にた ヒガシニホントカゲと いう べつの しゅるいです。"
      ],
      "sources": [
        "https://www.pref.kyoto.jp/kankyo/rdb/bio/db/craw0005.html",
        "https://www.qsr.mlit.go.jp/osumi/river/ikimono/hacyurui.htm"
      ],
      "photo": {
        "by": "ふうけ",
        "caption": "ニホントカゲの しゃしん",
        "commonsFile": "File:Nihontokage060920-1.jpg",
        "file": "nihontokage.jpg",
        "h": 675,
        "license": "GFDL",
        "source": "https://commons.wikimedia.org/wiki/File:Nihontokage060920-1.jpg",
        "w": 900
      }
    },
    {
      "id": "okadangomushi",
      "name": "オカダンゴムシ",
      "yomi": "おかだんごむし",
      "place": "tsuchi",
      "kind": "moguru",
      "inJapan": true,
      "placeS": "オカダンゴムシが、土の 上の 石の 下に かくれて います。",
      "bodyS": "オカダンゴムシは、からだを まるめる ことが できます。",
      "howS": "石や おちばの 下に もぐりこみ、さわられると まるく なって、かくれます。",
      "naze": "とりや アリから みを まもる ためです。日ざしで からだが かわくのを ふせぐ ためでも あります。",
      "sumika": "にほんの どこでも 見られます。にわや こうえんの 石の 下、おちばの 下、はちの 下に います。",
      "size": "1cm ぐらい。大きい ものでも 1.8cm ぐらいです。",
      "tabemono": "おちばや かれた くさ、しんだ 生きものを たべます。",
      "itsu": "はるから あきに よく 見られます。しめった 日に 出て きます。",
      "nakama": "えびや かにの なかま（ワラジムシの なかま）",
      "karada": "かたい からが いくつにも わかれて いるので、きれいに まるく なれます。えらで いきを するので、しめった ところでないと くらせません。",
      "motto": [
        "えびや かにと おなじ なかまなので、うみの 生きものの しんせきです。",
        "おちばを たべて 土に かえすので、土を つくる てつだいを して います。",
        "かべに あたると、つぎは ぎゃくの ほうへ まがる ことが おおいです。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/オカダンゴムシ",
        "https://en.wikipedia.org/wiki/Armadillidium_vulgare"
      ],
      "photo": {
        "by": "Glenn",
        "caption": "オカダンゴムシの しゃしん",
        "commonsFile": "File:ArmadillidiumVulgare.jpg",
        "file": "okadangomushi.jpg",
        "h": 760,
        "license": "GFDL",
        "source": "https://commons.wikimedia.org/wiki/File:ArmadillidiumVulgare.jpg",
        "w": 868
      }
    },
    {
      "id": "yamashigi",
      "name": "ヤマシギ",
      "yomi": "やましぎ",
      "place": "tsuchi",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "ヤマシギが、林の おちばの 上に かくれて います。",
      "bodyS": "ヤマシギは、おちばに そっくりな もようの はねを もって います。",
      "howS": "おちばの 上に うずくまって じっと して、おちばに まぎれて、かくれます。",
      "naze": "てきに 見つからない ように する ためです。",
      "sumika": "にほんの 林や もりの、しめった おちばの ある ところ。さむく なると みなみへ うつります。",
      "size": "34cm ぐらい。くちばしだけで 6cm から 8cm あります。",
      "tabemono": "ながい くちばしを 土に さして、ミミズを とって たべます。",
      "itsu": "あきから はるに 見られます。よるに うごきます。",
      "nakama": "とりの なかま（シギの なかま）",
      "karada": "目が あたまの ずっと うしろに ついて いるので、下を むいて えさを とりながら、うしろまで 見わたせます。",
      "motto": [
        "おちばの 上に いると、人が すぐ そばを とおっても とびたちません。",
        "くちばしの 先だけを うごかせるので、土の 中で ミミズを はさめます。",
        "うしろまで 見えるので、ほとんど ぜんぶ 見えて いると いわれます。"
      ],
      "sources": [
        "https://kotobank.jp/word/%E3%82%84%E3%81%BE%E3%81%97%E3%81%8E-3173791",
        "https://www.pref.kyoto.jp/kankyo/rdb/bio/db/bird0037.html",
        "https://www.env.go.jp/nature/choju/docs/docs5/docs5-yamashigi.pdf",
        "https://gwct.org.uk/wildlife/species-of-the-month/2011/march/"
      ],
      "photo": {
        "by": "Stephan Sprinz",
        "caption": "ヤマシギの しゃしん",
        "commonsFile": "File:Waldschnepfe (scolopax rusticola) - Spiekeroog, Nationalpark Niedersächsisches Wattenmeer.jpg",
        "file": "yamashigi.jpg",
        "h": 600,
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Waldschnepfe_%28scolopax_rusticola%29_-_Spiekeroog%2C_Nationalpark_Nieders%C3%A4chsisches_Wattenmeer.jpg",
        "w": 900
      }
    },
    {
      "id": "gomafuazarashi",
      "name": "ゴマフアザラシ",
      "yomi": "ごまふあざらし",
      "place": "yuki",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "ゴマフアザラシが、ゆきと こおりの 上に かくれて います。",
      "bodyS": "ゴマフアザラシは、生まれた ときは ゆきと おなじ まっ白な けを もって います。",
      "howS": "生まれた ばかりの 子どもは、白い けで ゆきに まぎれて、かくれます。",
      "naze": "キツネや ワシから 子どもを まもる ためです。",
      "sumika": "きたの つめたい うみ。にほんでは ふゆに ほっかいどうの まわりで 見られます。",
      "size": "おとなは 1.6m ぐらい。生まれた ばかりの 子どもは 80cm ぐらいです。",
      "tabemono": "さかなや いか、えびを たべます。",
      "itsu": "ふゆから はる。ほっかいどうの うみべで 見られます。",
      "nakama": "けものの なかま（アザラシの なかま）",
      "karada": "生まれた ときは まっ白で、2しゅうかんぐらいで ごまの ような てんの ある けに かわります。",
      "motto": [
        "名まえの 「ゴマフ」は、ごまを まいた ような てんの もようから つきました。",
        "白い けの あいだは まだ およげないので、こおりの 上で ゆきに まぎれて まって います。",
        "こおりが すくなく なると、子どもが かくれる ところも なく なって しまいます。"
      ],
      "sources": [
        "https://www.jaza.jp/storage/enkan-news/V29lpHiZRw0IXwiFcWFzlnru0lE0J58i8SAUE1DE.pdf",
        "https://kotobank.jp/word/%E3%82%B4%E3%83%9E%E3%83%95%E3%82%A2%E3%82%B6%E3%83%A9%E3%82%B7-3152574"
      ],
      "photo": {
        "by": "コムケ",
        "caption": "ゴマフアザラシの しゃしん",
        "commonsFile": "File:Spotted_Seal_mombestu2.jpg",
        "file": "gomafuazarashi.jpg",
        "h": 675,
        "license": "CC BY-SA 1.0",
        "source": "https://commons.wikimedia.org/wiki/File:Spotted_Seal_mombestu2.jpg",
        "w": 900
      }
    },
    {
      "id": "hokkyokugitsune",
      "name": "ホッキョクギツネ",
      "yomi": "ほっきょくぎつね",
      "place": "yuki",
      "kind": "iro",
      "inJapan": false,
      "placeS": "ホッキョクギツネが、ゆきの つもった のはらに かくれて います。",
      "bodyS": "ホッキョクギツネは、きせつに あわせて けの いろを かえる ことが できます。",
      "howS": "ふゆは まっ白に なって、ゆきに まぎれて、かくれます。",
      "naze": "えものに きづかれないで ちかづく ためです。ホッキョクグマからも みを まもれます。",
      "sumika": "きたの さむい ところの ひろい のはら。ゆきや 土の 下に あなを ほって すみます。",
      "size": "からだは 50cm から 60cm ぐらい。",
      "tabemono": "レミングや とり、たまご、うみべに うちあげられた ものを たべます。",
      "itsu": "いちねんじゅう います。ふゆに 白く なります。",
      "nakama": "けものの なかま（イヌの なかま）",
      "karada": "みみが 小さく、はなも みじかいので、からだの あたたかさが にげません。足の うらまで けが はえて います。",
      "motto": [
        "なつは ちゃいろ、ふゆは まっ白に なります。おなじ 生きものとは 見えない ほどです。",
        "ゆきの 下の おとを きいて、下を あるく レミングを 見つけます。",
        "マイナス 50どの さむさでも へいきで いられます。"
      ],
      "sources": [
        "https://animaldiversity.org/accounts/Vulpes_lagopus/",
        "https://kotobank.jp/word/%E3%81%BB%E3%81%A4%E3%81%8D%E3%82%88%E3%81%8F%E3%81%8E%E3%81%A4%E3%81%AD-3169957",
        "https://www.city.asahikawa.hokkaido.jp/asahiyamazoo/2200/p008801_d/fil/dayori207.pdf"
      ],
      "photo": {
        "by": "欅 (Keyaki)",
        "caption": "ホッキョクギツネの しゃしん",
        "commonsFile": "File:Alopex_lagopus,_Asahikawa_Asahiyama_Zoological_Park.jpg",
        "file": "hokkyokugitsune.jpg",
        "h": 674,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Alopex_lagopus%2C_Asahikawa_Asahiyama_Zoological_Park.jpg",
        "w": 900
      }
    },
    {
      "id": "hokkyokuguma",
      "name": "ホッキョクグマ",
      "yomi": "ほっきょくぐま",
      "place": "yuki",
      "kind": "sokkuri",
      "inJapan": false,
      "placeS": "ホッキョクグマが、ゆきと こおりの 上に かくれて います。",
      "bodyS": "ホッキョクグマは、ゆきと おなじ 白く 見える けを もって います。",
      "howS": "こおりの 上で うごかないで まって、ゆきと 見わけが つかないように なって、かくれます。",
      "naze": "アザラシに きづかれないで ちかづく ためです。",
      "sumika": "きたの こおりの うみ。こおりの 上を あるいて えさを さがして います。",
      "size": "オスは 大きい ものは 2.5m ちかくに なります。",
      "tabemono": "おもに アザラシを たべます。",
      "itsu": "いちねんじゅう。こおりの ある あいだに よく えさを とります。",
      "nakama": "けものの なかま（クマの なかま）",
      "karada": "けは ほんとうは 白く なくて、1ぽん 1ぽんが すきとおって います。日の ひかりが 中で はねかえるので 白く 見えます。はだは くろいです。",
      "motto": [
        "すきとおった けが 白く 見えるのは、ゆきが 白く 見えるのと おなじ しくみです。",
        "アザラシが いきを しに 出て くる あなの そばで、うごかないで ずっと まちます。",
        "足の うらに けが はえて いるので、こおりの 上でも すべりません。"
      ],
      "sources": [
        "https://animaldiversity.org/accounts/Ursus_maritimus/",
        "https://www.city.sapporo.jp/zoo/103-l.html",
        "https://www.nipr.ac.jp/science-museum/archive/aiueo/201601.pdf"
      ],
      "photo": {
        "by": "Alan D. Wilson",
        "caption": "ホッキョクグマの しゃしん",
        "commonsFile": "File:Polar_Bear_ANWR_1.jpg",
        "file": "hokkyokuguma.jpg",
        "h": 600,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Polar_Bear_ANWR_1.jpg",
        "w": 900
      }
    },
    {
      "id": "okojo",
      "name": "オコジョ",
      "yomi": "おこじょ",
      "place": "yuki",
      "kind": "iro",
      "inJapan": true,
      "placeS": "オコジョが、ゆきの つもった いわの すきまに かくれて います。",
      "bodyS": "オコジョは、きせつに あわせて けの いろを かえる ことが できます。",
      "howS": "ふゆは まっ白に なって、ゆきに まぎれて、かくれます。",
      "naze": "ワシや キツネから みを まもる ためです。ネズミに きづかれないで ちかづく ためでも あります。",
      "sumika": "にほんでは ほっかいどうと、ほんしゅうの たかい 山。いわの すきまや 木の ねもとに すんで います。",
      "size": "オスは 20cm から 30cm ぐらい。メスは すこし 小さいです。",
      "tabemono": "ネズミや 小さな とり、こんちゅうを たべます。",
      "itsu": "いちねんじゅう 山に います。ふゆに 白く なります。",
      "nakama": "けものの なかま（イタチの なかま）",
      "karada": "からだが ほそながいので、ネズミの あなの 中にも 入って いけます。しっぽの 先は ふゆも くろい ままです。",
      "motto": [
        "ふゆの 白い けは 「エルミン」と よばれ、むかしから 大せつに されて きました。",
        "しっぽの 先の くろは、わざと 目だたせて てきの 目を そこへ むける ためと いわれます。",
        "じぶんの からだより 大きな えものも つかまえます。"
      ],
      "sources": [
        "https://kotobank.jp/word/%E3%82%AA%E3%82%B3%E3%82%B8%E3%83%A7"
      ],
      "photo": {
        "by": "Sasha Sanbith",
        "caption": "オコジョの しゃしん",
        "commonsFile": "File:Hermine et son pelage hivernal.jpg",
        "file": "okojo.jpg",
        "h": 645,
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Hermine_et_son_pelage_hivernal.jpg",
        "w": 900
      }
    },
    {
      "id": "raichou",
      "name": "ライチョウ",
      "yomi": "らいちょう",
      "place": "yuki",
      "kind": "iro",
      "inJapan": true,
      "placeS": "ライチョウが、ゆきの つもった 山の いわの あいだに かくれて います。",
      "bodyS": "ライチョウは、きせつに あわせて はねの いろを かえる ことが できます。",
      "howS": "ふゆは まっ白に、なつは 山の いわと おなじ いろに なって、かくれます。",
      "naze": "キツネや とりから みを まもる ためです。",
      "sumika": "にほんでは、とても たかい 山の 上。木が はえない、いわと くさの ところに すんで います。",
      "size": "37cm ぐらい。ニワトリより 小さいぐらいです。",
      "tabemono": "くさの めや は、み、花を たべます。",
      "itsu": "いちねんじゅう 山に います。ふゆも 山から おりて きません。",
      "nakama": "とりの なかま（キジの なかま）",
      "karada": "ふゆは 足の うらまで はねが はえて、ゆきの 上を しずまないで あるけます。オスは 目の 上が あかく なります。",
      "motto": [
        "ふゆは まっ白、なつは ちゃいろと くろの まだら。はねは 1ねんに 3かいも かわります。",
        "人を あまり こわがらないので、すぐ そばで 見られる ことが あります。",
        "にほんの ライチョウは、せかいで いちばん みなみに すむ ライチョウです。"
      ],
      "sources": [
        "https://www.env.go.jp/content/900521280.pdf",
        "https://chubu.env.go.jp/shinetsu/content/900117626.pdf",
        "https://www.suntory.co.jp/eco/birds/encyclopedia/detail/1350.html",
        "https://www.pref.nagano.lg.jp/koho/kids/menu01/symbol03.html"
      ],
      "photo": {
        "by": "Jan Frode Haugseth",
        "caption": "ライチョウの しゃしん",
        "commonsFile": "File:Rock_Ptarmigan_(Lagopus_Muta).jpg",
        "file": "raichou.jpg",
        "h": 600,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Rock_Ptarmigan_%28Lagopus_Muta%29.jpg",
        "w": 900
      }
    },
    {
      "id": "shirofukurou",
      "name": "シロフクロウ",
      "yomi": "しろふくろう",
      "place": "yuki",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "シロフクロウが、ゆきの つもった ひろい のはらに かくれて います。",
      "bodyS": "シロフクロウは、ゆきと おなじ 白い はねを もって います。",
      "howS": "ゆきの 上で じっと して、ゆきと 見わけが つかないように なって、かくれます。",
      "naze": "えものに きづかれないで まつ ためです。てきからも みを まもれます。",
      "sumika": "きたの さむい ところの、木の ない ひろい のはら。ふゆに みなみへ おりて きます。",
      "size": "55cm から 65cm ぐらい。はねを ひろげると 1.5m ちかくに なります。",
      "tabemono": "レミングや ネズミ、小さな とりを たべます。",
      "itsu": "きたの ところでは いちねんじゅう。ひるまも うごきます。",
      "nakama": "とりの なかま（フクロウの なかま）",
      "karada": "オスは ほとんど まっ白で、メスは くろい まだらが あります。足の 先まで はねが はえて いて、さむさに つよいです。",
      "motto": [
        "フクロウの なかまでは めずらしく、ひるまも えさを さがします。",
        "レミングが おおい ときは たまごを たくさん うみ、すくない ときは すこしだけ うみます。",
        "なにも ない ゆきの 上では、白さが いちばんの かくれみのに なります。"
      ],
      "sources": [
        "https://www.city.sapporo.jp/zoo/099-k.html",
        "https://audubon.org/field-guide/bird/Snowy-owl",
        "https://www.pref.ishikawa.lg.jp/kisya/h28/documents/0420furekou.pdf"
      ],
      "photo": {
        "by": "",
        "caption": "シロフクロウの しゃしん",
        "commonsFile": "File:Snowy.owl.overall.arp.750pix.jpg",
        "file": "shirofukurou.jpg",
        "h": 760,
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Snowy.owl.overall.arp.750pix.jpg",
        "w": 678
      }
    },
    {
      "id": "yukihyou",
      "name": "ユキヒョウ",
      "yomi": "ゆきひょう",
      "place": "yuki",
      "kind": "sokkuri",
      "inJapan": false,
      "placeS": "ユキヒョウが、ゆきの つもった 山の いわの あいだに かくれて います。",
      "bodyS": "ユキヒョウは、いわと ゆきに そっくりな はいいろの けを もって います。",
      "howS": "いわの あいだに ふせて じっと して、いわと 見わけが つかないように なって、かくれます。",
      "naze": "えものに きづかれないで ちかづく ためです。",
      "sumika": "アジアの たかい 山。ヒマラヤや モンゴルの、いわの ごろごろ した ところに すんで います。",
      "size": "からだは 1m から 1.3m ぐらい。しっぽも 1m ちかく あります。",
      "tabemono": "ヤギや ヒツジの なかま、ウサギや とりを たべます。",
      "itsu": "いちねんじゅう。あさと ゆうがたに よく うごきます。",
      "nakama": "けものの なかま（ネコの なかま）",
      "karada": "しっぽが とても ふとく ながく、いわ山を はしる ときに からだの つりあいを とります。ねむる ときは しっぽを まきつけます。",
      "motto": [
        "けの もようが いわの かげと そっくりなので、「山の まぼろし」と よばれます。",
        "足が 大きいので、ゆきの 上を しずまないで あるけます。",
        "大きな ネコの なかまでは めずらしく、ほえないで みゃあと なきます。"
      ],
      "sources": [
        "https://www.jaza.jp/assets/document/about-jaza/guideline2020/guideline2021-03-06.pdf",
        "https://www.worldwildlife.org/species/snow-leopard",
        "https://www.nationalgeographic.com/animals/mammals/facts/snow-leopard",
        "https://snowleopard.org/what-do-snow-leopards-eat/"
      ],
      "photo": {
        "by": "Aaron Logan",
        "caption": "ユキヒョウの しゃしん",
        "commonsFile": "File:Lightmatter_snowleopard.jpg",
        "file": "yukihyou.jpg",
        "h": 600,
        "license": "CC BY 2.0",
        "source": "https://commons.wikimedia.org/wiki/File:Lightmatter_snowleopard.jpg",
        "w": 900
      }
    },
    {
      "id": "yukiusagi",
      "name": "ユキウサギ",
      "yomi": "ゆきうさぎ",
      "place": "yuki",
      "kind": "iro",
      "inJapan": true,
      "placeS": "ユキウサギが、ゆきの つもった 林の 中に かくれて います。",
      "bodyS": "ユキウサギは、きせつに あわせて けの いろを かえる ことが できます。",
      "howS": "ふゆは まっ白に なって、ゆきと 見わけが つかないように なって、かくれます。",
      "naze": "キツネや ワシから みを まもる ためです。",
      "sumika": "にほんでは ほっかいどう。林や くさむら、はたけの まわりに すんで います。",
      "size": "からだは 50cm ぐらい。",
      "tabemono": "くさや 木の えだを たべます。ふゆは 木の かわを かじります。",
      "itsu": "いちねんじゅう います。ふゆに まっ白く なります。",
      "nakama": "けものの なかま（ウサギの なかま）",
      "karada": "うしろ足が 大きく ひろがるので、ゆきの 上を しずまないで はしれます。みみは ほかの ウサギより みじかく、さむさに つよいです。",
      "motto": [
        "ゆきが ふらない ふゆは、白く なっても かえって 目だって しまいます。",
        "ふゆに 木の かわを かじるので、はの あとが 木に のこります。",
        "みみの 先だけは、ふゆも くろい ままです。"
      ],
      "sources": [
        "https://www.city.sapporo.jp/zoo/045-f.html",
        "https://kotobank.jp/word/%E3%83%A6%E3%82%AD%E3%82%A6%E3%82%B5%E3%82%AE-3173946"
      ],
      "photo": {
        "by": "H. Zell",
        "caption": "ユキウサギの しゃしん",
        "commonsFile": "File:Lepus_timidus_01.JPG",
        "file": "yukiusagi.jpg",
        "h": 675,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Lepus_timidus_01.JPG",
        "w": 900
      }
    },
    {
      "id": "chakuwara",
      "name": "チャクワラ",
      "yomi": "ちゃくわら",
      "place": "sabaku",
      "kind": "moguru",
      "inJapan": false,
      "placeS": "チャクワラが、さばくの いわの すきまに かくれて います。",
      "bodyS": "チャクワラは、からだを ふくらませる ことが できます。",
      "howS": "いわの すきまに 入って からだを ふくらませ、ぬけなく なって、かくれます。",
      "naze": "とりや けものに ひっぱり出されない ように する ためです。",
      "sumika": "きたアメリカの さばく。いわが ごろごろ した かわいた ところに すんで います。",
      "size": "40cm から 45cm ぐらい。",
      "tabemono": "さばくに はえる くさの はや 花を たべます。",
      "itsu": "はるから あきに 見られます。あさの 日なたで からだを あたためます。",
      "nakama": "トカゲの なかま（イグアナの なかま）",
      "karada": "からだの かわが ゆったりして いて、空気を すいこんで ふくらませられます。しっぽは ふとく、さきが まるいです。",
      "motto": [
        "いわの すきまで ふくらむと、どんなに ひっぱっても 出て きません。",
        "くさしか たべないので、こんちゅうを たべる ほかの トカゲとは ちがいます。",
        "あさは くろっぽく、あつく なると いろが うすく なります。"
      ],
      "sources": [
        "https://en.wikipedia.org/wiki/Common_chuckwalla",
        "https://www.californiaherps.com/lizards/pages/s.ater.html",
        "https://www.nps.gov/jotr/learn/nature/lizards.htm"
      ],
      "photo": {
        "by": "Kaldari",
        "caption": "チャクワラの しゃしん",
        "commonsFile": "File:Sauromalus_ater_Phoenix.jpg",
        "file": "chakuwara.jpg",
        "h": 760,
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Sauromalus_ater_Phoenix.jpg",
        "w": 507
      }
    },
    {
      "id": "kawarabatta",
      "name": "カワラバッタ",
      "yomi": "かわらばった",
      "place": "sabaku",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "カワラバッタが、川の かわらの 石の 上に かくれて います。",
      "bodyS": "カワラバッタは、かわらの 石と おなじ はいいろの からだを もって います。",
      "howS": "石の 上で じっと して、石と 見わけが つかないように なって、かくれます。",
      "naze": "とりに 見つからない ように する ためです。",
      "sumika": "にほんの、石が ごろごろ した 川の かわら。くさの すくない、日の あたる ところに います。",
      "size": "オスは 2.5cm、メスは 3.5cm ぐらい。",
      "tabemono": "かわらに はえる くさの はを たべます。",
      "itsu": "なつから あきに 見られます。ひるまに うごきます。",
      "nakama": "こんちゅうの なかま（バッタの なかま）",
      "karada": "からだは 石と おなじ はいいろですが、とぶと うしろの はねが あざやかな 青で 目だちます。",
      "motto": [
        "とんだ ときだけ 青い はねが 見え、おりると きえた ように 見えなく なります。",
        "川の こうじで かわらが すくなく なり、見られる ところが へって います。",
        "石の 上を 1つ 1つ 見ないと 見つけられません。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/カワラバッタ",
        "https://www.insects.jp/kon-battakawara.htm"
      ],
      "photo": {
        "by": "WATANABE Hitoshi 渡辺仁 (tbc_watanabe)",
        "caption": "カワラバッタの しゃしん",
        "commonsFile": "File:Eusphingonotus_japonicus_from_iNaturalist_photo_146087354.jpg",
        "file": "kawarabatta.jpg",
        "h": 600,
        "license": "CC BY 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Eusphingonotus_japonicus_from_iNaturalist_photo_146087354.jpg",
        "w": 900
      }
    },
    {
      "id": "kochidori",
      "name": "コチドリ",
      "yomi": "こちどり",
      "place": "sabaku",
      "kind": "sokkuri",
      "inJapan": true,
      "placeS": "コチドリが、川の かわらの 石の 上に かくれて います。",
      "bodyS": "コチドリは、かわらの 石と おなじ いろの せなかを もって います。",
      "howS": "石の あいだに うずくまって じっと して、石に まぎれて、かくれます。",
      "naze": "てきから たまごと ひなを まもる ためです。",
      "sumika": "にほんの 川の かわらや、うめたての ひろい ところ、はたけ。石や すなの ある ところに すを つくります。",
      "size": "16cm ぐらい。スズメと おなじくらいです。",
      "tabemono": "こんちゅうや くもを たべます。",
      "itsu": "はるに にほんへ きて、なつに たまごを うみます。",
      "nakama": "とりの なかま（チドリの なかま）",
      "karada": "目の まわりに きいろい わが あって、よく 目だちます。足が ほそく、石の 上を すばやく はしります。",
      "motto": [
        "たまごは かわらの 石と そっくりで、すぐ そばに あっても 見つけられません。",
        "人が すに ちかづくと、おやどりは はねを ひきずる ふりを して、すから とおざけます。",
        "すは 石を すこし よけただけの、くぼみだけの かんたんな ものです。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/コチドリ",
        "https://www.birdfan.net/charadrius_dubius/",
        "https://en.wikipedia.org/wiki/Little_ringed_plover",
        "https://www.wildlifetrusts.org/wildlife-explorer/birds/wading-birds/little-ringed-plover"
      ],
      "photo": {
        "by": "Alpsdake",
        "caption": "コチドリの しゃしん",
        "commonsFile": "File:Charadrius_dubius_curonicus_s8.JPG",
        "file": "kochidori.jpg",
        "h": 630,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Charadrius_dubius_curonicus_s8.JPG",
        "w": 900
      }
    },
    {
      "id": "mizukakiyamori",
      "name": "ミズカキヤモリ",
      "yomi": "みずかきやもり",
      "place": "sabaku",
      "kind": "moguru",
      "inJapan": false,
      "placeS": "ミズカキヤモリが、さばくの すなの 中に かくれて います。",
      "bodyS": "ミズカキヤモリは、すなを かく ための みずかきの ついた 足を もって います。",
      "howS": "みずかきの 足で すなを かき出して あなを ほり、ひるまは その 中に 入って、かくれます。",
      "naze": "とりや へびから みを まもる ためです。ひるまの あつさからも にげられます。",
      "sumika": "アフリカの ナミブさばく。さらさらの すなの ところに すんで います。",
      "size": "10cm から 14cm ぐらい。",
      "tabemono": "こんちゅうや くもを たべます。",
      "itsu": "さばくでは いちねんじゅう。よるに うごきます。",
      "nakama": "ヤモリの なかま",
      "karada": "足の ゆびの あいだに みずかきが あって、さらさらの すなでも しずまないで はしれます。はだは うすくて、中が すこし すけて 見えます。",
      "motto": [
        "みずかきが あるのに、水では なく すなの 上を あるく ために つかいます。",
        "目を したで なめて、すなを おとします。まぶたが ないからです。",
        "よるの きりから おりた 水を、かおに ついた つぶを なめて のみます。"
      ],
      "sources": [
        "https://en.wikipedia.org/wiki/Pachydactylus_rangei",
        "https://animaldiversity.org/accounts/Pachydactylus_rangei/"
      ],
      "photo": {
        "by": "Stefan.Kuemmel ( )",
        "caption": "ミズカキヤモリの しゃしん",
        "commonsFile": "File:Pachydactylus-rangei.jpg",
        "file": "mizukakiyamori.jpg",
        "h": 609,
        "license": "GFDL",
        "source": "https://commons.wikimedia.org/wiki/File:Pachydactylus-rangei.jpg",
        "w": 900
      }
    },
    {
      "id": "sabakutsunotokage",
      "name": "サバクツノトカゲ",
      "yomi": "さばくつのとかげ",
      "place": "sabaku",
      "kind": "moguru",
      "inJapan": false,
      "placeS": "サバクツノトカゲが、さばくの すなの 中に かくれて います。",
      "bodyS": "サバクツノトカゲは、ひらたい からだと、あたまの つのを もって います。",
      "howS": "からだを よこに ふるわせて すなに しずみこみ、すなに うまって、かくれます。",
      "naze": "とりや へびから みを まもる ためです。ひるまの あつさから にげる ためでも あります。",
      "sumika": "きたアメリカの さばく。すなや 小石の ある かわいた ところに すんで います。",
      "size": "7cm から 13cm ぐらい。",
      "tabemono": "おもに アリを たべます。1日に なんびゃくびきも たべます。",
      "itsu": "はるから あきに 見られます。あつい ひるまは すなの 中に います。",
      "nakama": "トカゲの なかま",
      "karada": "からだが ひらたいので、すなに しずむのが はやいです。あたまと せなかの ふちに、つのの ような とげが ならんで います。",
      "motto": [
        "からだを よこに ふるわせると、すなの 中へ すっと しずんで いきます。",
        "すなの いろに あわせて、からだの いろが すこし かわります。",
        "アリの みちの そばで まって、とおる アリを たべます。"
      ],
      "sources": [
        "https://en.wikipedia.org/wiki/Desert_horned_lizard",
        "https://www.californiaherps.com/lizards/pages/p.p.calidiarum.html"
      ],
      "photo": {
        "by": "Churnice",
        "caption": "サバクツノトカゲの しゃしん",
        "commonsFile": "File:Desert_Horned_Lizard.jpg",
        "file": "sabakutsunotokage.jpg",
        "h": 600,
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Desert_Horned_Lizard.jpg",
        "w": 900
      }
    },
    {
      "id": "sandfish",
      "name": "サンドフィッシュ",
      "yomi": "さんどふぃっしゅ",
      "place": "sabaku",
      "kind": "moguru",
      "inJapan": false,
      "placeS": "サンドフィッシュが、さばくの すなの 中に かくれて います。",
      "bodyS": "サンドフィッシュは、すなを かきわける つるつるの うろこを もって います。",
      "howS": "すなの 中へ もぐりこみ、すなの 中を およぐように すすんで、かくれます。",
      "naze": "とりや へびから みを まもる ためです。あつい すなの 上から にげる ためでも あります。",
      "sumika": "アフリカの きたの さばく。サハラさばくの、さらさらの すなの ところに すんで います。",
      "size": "15cm から 20cm ぐらい。",
      "tabemono": "こんちゅうや くもを たべます。",
      "itsu": "さばくでは いちねんじゅう。あさと ゆうがたに うごきます。",
      "nakama": "トカゲの なかま（スキンクの なかま）",
      "karada": "うろこが つるつるなので、すなの 中を すべるように すすめます。はなと みみに ふたの ような しくみが あって、すなが 入りません。",
      "motto": [
        "すなの 中を およぐように すすむので、「すなの さかな」と よばれます。",
        "すなの ゆれを かんじて、上を あるく こんちゅうを 見つけます。",
        "すなの 中から とび出して、えものを つかまえます。"
      ],
      "sources": [
        "https://en.wikipedia.org/wiki/Scincus_scincus",
        "https://animaldiversity.org/accounts/Scincus_scincus/",
        "https://reptile-database.reptarium.cz/species?genus=Scincus&species=scincus"
      ],
      "photo": {
        "by": "Wilfried Berns",
        "caption": "サンドフィッシュの しゃしん",
        "commonsFile": "File:Apothekerskink01.jpg",
        "file": "sandfish.jpg",
        "h": 623,
        "license": "CC BY-SA 2.0",
        "source": "https://commons.wikimedia.org/wiki/File:Apothekerskink01.jpg",
        "w": 900
      }
    },
    {
      "id": "sunaneko",
      "name": "スナネコ",
      "yomi": "すなねこ",
      "place": "sabaku",
      "kind": "sokkuri",
      "inJapan": false,
      "placeS": "スナネコが、さばくの すなの 上に かくれて います。",
      "bodyS": "スナネコは、すなと おなじ いろの けを もって います。",
      "howS": "すなの 上に ふせて じっと して、すなと 見わけが つかないように なって、かくれます。",
      "naze": "えものに きづかれないで ちかづく ためです。ワシからも みを まもれます。",
      "sumika": "アフリカや アジアの さばく。すなや 小石の ある かわいた ところに すんで います。",
      "size": "からだは 40cm から 50cm ぐらい。イエネコより 小さいです。",
      "tabemono": "ネズミや とり、トカゲ、こんちゅうを たべます。",
      "itsu": "さばくでは いちねんじゅう。よるに うごきます。",
      "nakama": "けものの なかま（ネコの なかま）",
      "karada": "足の うらに こまかい けが たくさん はえて いて、やけるほど あつい すなの 上でも へいきです。みみが 大きく 下の ほうに ついて います。",
      "motto": [
        "足の うらの けの せいで、あるいた あとが すなに のこりにくいです。",
        "みみが 大きいので、すなの 下を あるく ネズミの おとまで きこえます。",
        "ほとんど 水を のまないで、えものから とれる 水だけで くらせます。"
      ],
      "sources": [
        "https://ja.wikipedia.org/wiki/スナネコ",
        "https://en.wikipedia.org/wiki/Sand_cat"
      ],
      "photo": {
        "by": "DocTaxon",
        "caption": "スナネコの しゃしん",
        "commonsFile": "File:Felis_margarita.jpg",
        "file": "sunaneko.jpg",
        "h": 663,
        "license": "Public domain",
        "source": "https://commons.wikimedia.org/wiki/File:Felis_margarita.jpg",
        "w": 900
      }
    }
  ];

  win.KAKURENBO = { places: places, kinds: kinds, animals: animals };
})(typeof window !== 'undefined' ? window : this);
