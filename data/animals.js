/* =====================================================================
   data/animals.js — かくれんぼ名人の データ
   ---------------------------------------------------------------------
   ⚠️ 文は すべて 書きおろし。教科書の 本文は 1 文も 入れない。
   ⚠️ 写真は Wikimedia Commons の、だれでも つかえる ライセンスの ものだけ。
      CC BY / CC BY-SA は 作者と ライセンスを 出すのが 条件なので、
      photo.by と photo.license と photo.source を 欠かさない。
      tools/check-data.mjs が 1 枚でも 欠けたら 落とす。

   文の 型（教材文と 同じ ならび）:
     placeS  〇〇が、〜に かくれて います。        ① どこに
     bodyS   〇〇は、〜を もって います／できます。 ② からだの とくちょう
     howS    〜て、かくれます。                    ③ どのように かくれるか

   ①②③ だけでは 図鑑の かわりに ならない。単元の おわりに 子どもが
   材料を 集める ところを 引きうける ので、すみか・大きさ・たべもの・
   いつ 見られるか・なかま・からだ・もっと しりたい まで そろえる。
   ===================================================================== */
(function (win) {
  'use strict';

  var places = [
    {
      key: 'umi', label: 'うみの 中',
      glyph: '<path d="M2 15c4-2 6-2 10 0s6 2 10 0M2 19c4-2 6-2 10 0s6 2 10 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
             '<path d="M9 5c3 0 5 3 5 6 0 2-2 4-5 4s-5-2-5-4c0-3 2-6 5-6z" fill="currentColor"/>',
    },
    {
      key: 'iso', label: 'うみべ・いそ',
      glyph: '<path d="M2 18h20M4 18l4-7 3 4 3-6 4 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
             '<circle cx="19" cy="5" r="2.5" fill="currentColor"/>',
    },
    {
      key: 'mizube', label: 'かわ・みずべ',
      glyph: '<path d="M2 17c4-2 6-2 10 0s6 2 10 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
             '<path d="M7 14V5M11 14V7M15 14V4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    },
    {
      key: 'kusamura', label: 'くさむら',
      glyph: '<path d="M4 21c0-7 2-11 4-14M12 21c0-8 0-13 0-16M20 21c0-7-2-11-4-14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    },
    {
      key: 'mori', label: 'もり・はやし',
      glyph: '<path d="M12 21v-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>' +
             '<path d="M12 2l6 9H6zM12 8l5 7H7z" fill="currentColor"/>',
    },
    {
      key: 'tsuchi', label: 'つち・おちば',
      glyph: '<path d="M2 20h20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>' +
             '<path d="M6 16c0-4 3-7 7-7 0 4-3 7-7 7zM18 16c0-3-2-5-5-5 0 3 2 5 5 5z" fill="currentColor"/>',
    },
    {
      key: 'yuki', label: 'ゆき・こおり',
      glyph: '<path d="M12 2v20M3 7l18 10M21 7L3 17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    },
    {
      key: 'sabaku', label: 'さばく・かわら',
      glyph: '<path d="M2 20h20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>' +
             '<path d="M3 17c3-5 6-8 9-8s6 3 9 8z" fill="currentColor"/>',
    },
  ];

  /* かくれ方の 七つの 型。教材文の ③ を なかまわけ したもの。

     ⚠️ はじめの 3 つの ならびを 変えないこと。教科書に 出てくる
        はまぐり・たこ・もくずしょい が ちょうど この 3 つで、
        並行読書の 『うみの かくれんぼ』（金の星社）も
        ①もぐって ②いろを かえて ③かたちを かえて の 3 巻に なって いる。
        子どもは この 3 つを 教室で すでに 読んで いるので、
        それを 先頭に 置くと「じぶんのは どれかな」が すぐ つながる。 */
  var kinds = [
    { key: 'moguru', label: 'もぐる・かくれ家', teach: 'はまぐりの なかま' },
    { key: 'iro', label: 'いろを かえる', teach: 'たこの なかま' },
    { key: 'tsukeru', label: 'まわりの ものを つける', teach: 'もくずしょいの なかま' },
    { key: 'sokkuri', label: 'まわりと おなじ いろ' },
    { key: 'katachi', label: 'かたちを まねる' },
    { key: 'hikari', label: 'ひかりを つかう' },
    { key: 'sukitoru', label: 'すきとおる' },
  ];

  var animals = [];

  win.KAKURENBO = { places: places, kinds: kinds, animals: animals };
})(typeof window !== 'undefined' ? window : this);
