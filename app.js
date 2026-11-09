/* =====================================================================
   しぜんの かくれんぼ ずかん — うごき
   ---------------------------------------------------------------------
   ・外から何も読まない。データは data/animals.js、写真は photos/。
   ・書いた文は localStorage にだけ置く（Local First / Zero PII）。
     名前・クラスを入れる欄は作らない。作れば必ず書かれる。
   ・読み上げは端末の Web Speech API。無い端末では ボタンごと出さない。
     押せるのに何も起きないボタンは、1年生には「こわれている」に見える。

   画面の 考え方:
     カード（写真＋名まえ）→ おすと「その 生きものの ページ」が ひらく。
     ページの 中に、写真・①②③の 文・くわしい こと・そして **書く ところ**が
     ぜんぶ 入って いる。本を 見ながら 書くのと 同じ ことを、1 つの 画面で
     できるように するため。読む 画面と 書く 画面が 別だと、1年生は
     行き来する だけで 手が 止まる。
   ===================================================================== */
(function () {
  'use strict';

  var DATA = window.KAKURENBO || { places: [], kinds: [], animals: [] };

  var state = {
    place: 'all',
    kind: 'all',
    q: '',
    jp: false,       // にほんで 見られる ものだけに する
    quiz: false,
    current: null,   // いま ひらいて いる 生きもの
  };

  /* ── 小さな道具 ───────────────────────────────────────── */

  function el(tag, props, children) {
    var node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        if (k === 'class') node.className = props[k];
        else if (k === 'text') node.textContent = props[k];
        else if (k.slice(0, 2) === 'on') node.addEventListener(k.slice(2), props[k]);
        else if (props[k] !== null && props[k] !== undefined) node.setAttribute(k, props[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function byKey(list, key) {
    for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i];
    return null;
  }

  function labelOf(list, key) { var x = byKey(list, key); return x ? x.label : key; }

  /* 分かち書きの すきまは、読み上げると 不自然な 間に なる。読ませる前に 落とす。 */
  function speakable(text) {
    return String(text).replace(/[　\s]+/g, '');
  }

  /* ── 読み上げ ─────────────────────────────────────────── */

  var speech = (function () {
    var ok = typeof window.speechSynthesis !== 'undefined' &&
             typeof window.SpeechSynthesisUtterance !== 'undefined';
    var current = null;

    function stop() {
      if (!ok) return;
      window.speechSynthesis.cancel();
      if (current) { current.classList.remove('is-speaking'); current.textContent = current.dataset.idle; }
      current = null;
    }

    function speak(text, button) {
      if (!ok) return;
      var again = current === button;
      stop();
      if (again) return;
      var u = new window.SpeechSynthesisUtterance(speakable(text));
      u.lang = 'ja-JP';
      /* 1年生の9月は、文字を追うだけでも力を使う。ふつうより ゆっくり、すこし高く。 */
      u.rate = 0.75;
      u.pitch = 1.15;
      u.onend = stop;
      u.onerror = stop;
      current = button;
      if (button) {
        button.dataset.idle = button.dataset.idle || button.textContent;
        button.classList.add('is-speaking');
        button.textContent = 'とめる';
      }
      window.speechSynthesis.speak(u);
    }
    return { ok: ok, speak: speak, stop: stop };
  })();

  /* ── 一覧 ─────────────────────────────────────────────── */

  /* しぼりこみの 判定は この 1 本だけ。
     ⚠️ visible() と countFor() で 別に 書いては いけない。
        片方だけに さがす ことばを かけ忘れると、タブに 12 と 出て いるのに
        おすと 0 まい、という ことが 起きる。 */
  function matches(a, place, kind, q) {
    if (place !== 'all' && a.place !== place) return false;
    if (kind !== 'all' && a.kind !== kind) return false;
    if (state.jp && !a.inJapan) return false;
    if (q && a.name.indexOf(q) < 0 && (a.yomi || '').indexOf(q) < 0) return false;
    return true;
  }

  function visible() {
    var q = state.q.trim();
    return DATA.animals.filter(function (a) {
      return matches(a, state.place, state.kind, q);
    });
  }

  /* タブの かっこの 中の 数。
     ⚠️ ぜんたいの 数を 出しては いけない。「うみの 中」を えらんでから
        「ひかりを つかう (3)」を おすと、3 と 書いて あるのに 2 まいしか
        出ない、という ことが 起きる。1年生には 画面が こわれたように 見える。
     ⚠️ さがす ことば（state.q）も かける。おなじ 事故が 検索欄でも 起きる。 */
  function countFor(which, value) {
    var q = state.q.trim();
    var place = which === 'place' ? value : state.place;
    var kind = which === 'kind' ? value : state.kind;
    return DATA.animals.filter(function (a) {
      return matches(a, place, kind, q);
    }).length;
  }

  var SVG_NS = 'http://www.w3.org/2000/svg';
  /* glyph に 入れて よい 図形と 属性。
     ⚠️ innerHTML に 戻さない こと。places.json の glyph を そのまま
        innerHTML で 入れて いた あいだ、外の ホストを 指す <image> の
        1 行を 足すだけで、一覧を ひらく たびに 外へ 取りに 行く
        穴が 開いて いた。
        tools/check-no-external.mjs も check-links.mjs も check-data.mjs も
        glyph を 1 字も 見て いなかったので、どの 検査も 素通りした。
        いまは tools/check-data.mjs が 形を 見る。 */
  var GLYPH_TAGS = {
    path: ['d', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'opacity'],
    circle: ['cx', 'cy', 'r', 'fill', 'stroke', 'stroke-width', 'opacity'],
    ellipse: ['cx', 'cy', 'rx', 'ry', 'fill', 'stroke', 'stroke-width', 'opacity'],
    rect: ['x', 'y', 'width', 'height', 'rx', 'ry', 'fill', 'stroke', 'stroke-width', 'opacity'],
    line: ['x1', 'y1', 'x2', 'y2', 'stroke', 'stroke-width', 'stroke-linecap', 'opacity'],
    polyline: ['points', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'opacity'],
    polygon: ['points', 'fill', 'stroke', 'stroke-width', 'fill-rule', 'opacity'],
    g: ['fill', 'stroke', 'stroke-width', 'opacity'],
  };

  function svgGlyph(inner) {
    var s = document.createElementNS(SVG_NS, 'svg');
    s.setAttribute('class', 'glyph');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');

    /* 字の ならびを 組み立てるのでは なく、読んで から ゆるす 形だけを 作る。 */
    var doc = new DOMParser().parseFromString(
      '<svg xmlns="' + SVG_NS + '">' + String(inner || '') + '</svg>', 'image/svg+xml');
    if (doc.getElementsByTagName('parsererror').length) return s;

    (function copy(from, to) {
      Array.prototype.forEach.call(from.childNodes, function (node) {
        if (node.nodeType !== 1) return;
        var tag = String(node.localName || '').toLowerCase();
        var allow = GLYPH_TAGS[tag];
        if (!allow) return;
        var out = document.createElementNS(SVG_NS, tag);
        Array.prototype.forEach.call(node.attributes, function (at) {
          var nm = String(at.name).toLowerCase();
          if (allow.indexOf(nm) < 0) return;
          if (/^(https?:|\/\/|data:|javascript:)/i.test(at.value.trim())) return;
          out.setAttribute(nm, at.value);
        });
        to.appendChild(out);
        if (tag === 'g') copy(node, out);
      });
    })(doc.documentElement, s);

    return s;
  }

  function buildTabs() {
    var placeBox = document.getElementById('place-tabs');
    var kindBox = document.getElementById('kind-tabs');
    placeBox.textContent = '';
    kindBox.textContent = '';

    /* ⚠️ 「ぜんぶ」は 0 ひきでも おせなく しない。
       2026-11-09 に 実機で ためしたら、ばしょを えらんでから どの 生きものにも
       当たらない 字を 打つと、おしらせ文が 指す その「ぜんぶ」まで おせなく なり、
       ツールバー 17 個の うち おせるのは いま えらんで いる 2 個だけ、
       という 行き止まりに なった。 */
    [{ key: 'all', label: 'ぜんぶ' }].concat(DATA.places).forEach(function (p) {
      var n = countFor('place', p.key);
      placeBox.appendChild(el('button', {
        class: 'tab' + (n === 0 ? ' is-empty' : ''),
        type: 'button',
        disabled: n === 0 && p.key !== 'all' && state.place !== p.key ? '' : null,
        'aria-pressed': state.place === p.key ? 'true' : 'false',
        onclick: function () { state.place = p.key; render(); },
      }, [
        p.glyph ? svgGlyph(p.glyph) : null,
        document.createTextNode(p.label),
        el('span', { class: 'n', text: '(' + n + ')' }),
      ]));
    });

    [{ key: 'all', label: 'ぜんぶ' }].concat(DATA.kinds).forEach(function (k) {
      var n = countFor('kind', k.key);
      kindBox.appendChild(el('button', {
        class: 'tab' + (n === 0 ? ' is-empty' : ''),
        type: 'button',
        disabled: n === 0 && k.key !== 'all' && state.kind !== k.key ? '' : null,
        'aria-pressed': state.kind === k.key ? 'true' : 'false',
        onclick: function () { state.kind = k.key; render(); },
      }, [
        document.createTextNode(k.label),
        k.teach ? el('span', { class: 'teach', text: '＝' + k.teach }) : null,
        el('span', { class: 'n', text: '(' + n + ')' }),
      ]));
    });
  }

  function buildCard(animal) {
    var photo = animal.photo || {};
    var shot = el('span', { class: 'shot' });
    if (photo.file) {
      shot.appendChild(el('img', {
        src: './photos/' + photo.file,
        /* ⚠️ 「なまえを かくす」の あいだは alt に 名まえを 入れない。
           ① 読み上げを つかう 子は、alt から 名まえを そのまま 聞いて
              しまう（見た目だけ かくしても 答えが 耳に 入る）。
           ② 写真が まだ 控えに 入って いない ところを オフラインで
              ひらくと、こわれた 画像の かわりに alt の 字が 画面に 出る。
              その 字が 答えそのものに なって いた（2026-11-09 に 実測）。 */
        alt: state.quiz ? 'かくれて いる 生きものの しゃしん' : animal.name + 'の しゃしん',
        loading: 'lazy', decoding: 'async',
        width: String(photo.w || 800), height: String(photo.h || 600),
      }));
      /* ⚠️ かくれて いない しゃしんの しるしは、一らんにも 出す こと。
         くわしい ページの 中だけに 出して いた あいだ、for-teachers.html は
         「この 行が 出て いない カードを えらんで ください」と 書いて
         いたのに、先生が 見る 一らんには その 行が どこにも 無かった。
         76 まいの うち 17 まいが これに あたるので、1 まいずつ ひらいて
         たしかめる ことに なって いた。
         ⚠️ 「なまえを かくす」の あいだも かくさない。名まえは 出さないが、
            「これは かくれて いない しゃしんだ」と わかる ことは、
            しゃしんだけを 見て 話しあう 活動の じゃまに ならない。
            むしろ かくれて いない ものを さがさせないで すむ。 */
      if (photo.notHiding) {
        shot.appendChild(el('span', { class: 'nothide', text: 'かくれて いない' }));
      }
    }
    return el('button', {
      class: 'card', type: 'button',
      onclick: function () { openSheet(animal); },
    }, [
      shot,
      el('span', { class: 'cap' }, [
        /* ⚠️ 名まえは CSS で ぬりつぶすだけでは かくれない。
           読み上げは 字を そのまま 読むので、画面では かくれて いるのに
           耳には 名まえが 入る。字そのものを 「？」に 入れかえる。
           （だから 「なまえを かくす」を おしたら 描きなおしが 要る。） */
        el('span', { class: 'nm', text: state.quiz ? '？' : animal.name }),
        el('span', { class: 'sub', text: labelOf(DATA.places, animal.place) + '／' + labelOf(DATA.kinds, animal.kind) }),
      ]),
    ]);
  }

  function render() {
    buildTabs();
    var list = visible();
    var grid = document.getElementById('grid');
    grid.textContent = '';
    list.forEach(function (a) { grid.appendChild(buildCard(a)); });
    document.getElementById('empty').hidden = list.length > 0;

    var place = state.place === 'all' ? 'ぜんぶの ばしょ' : labelOf(DATA.places, state.place);
    var kind = state.kind === 'all' ? '' : '／かくれかた：' + labelOf(DATA.kinds, state.kind);
    var q = state.q.trim() ? '／「' + state.q.trim() + '」で さがして います' : '';
    if (state.jp) place = 'にほんで 見られる もの／' + place;
    /* ⚠️ 助詞の 前に すきまを 置かない。1年生は 分かち書きの すきまを
       「ここで ことばが 切れる」と 読むので、「ばしょ の」と 離すと
       「の」が 次の ことばに ついて いるように 読める。この 行は
       aria-live で 読み上げにも のる。 */
    document.getElementById('count').textContent =
      place + kind + q + '：かくれんぼ名人が ' + list.length + 'ひき。カードを おすと くわしい ページが ひらきます。';
  }

  /* ── 生きものの ページ ───────────────────────────────── */

  var sheet = document.getElementById('sheet');
  var fields = {};
  var bodyEnd = 'motsu';
  var openId = '';   // いま ひらいて いる 生きものの id（下書きが どの ひきの ものかを 見る）

  /* 写真の 出どころの 行。
     ⚠️ ライセンスの 名まえを 字で 出すだけでは 足りない。
        CC BY 2.0/3.0 の 4(a) と CC BY 4.0 の 3(a)(1)(C) は、ライセンスの
        うつし、または その URI を いっしょに 出すように いって いる。
        licenseUrl は tools/build-animals.mjs が content/licenses.json から
        入れて いて、無ければ tools/build-credits.mjs が 落とす。
     ⚠️ すきまは 半角で そろえる。全角（U+3000）を まぜない。
        あいだの あきは style.css の .credit a に margin-left で つける。 */
  function creditLine(photo) {
    var frag = el('p', { class: 'credit' });
    frag.appendChild(document.createTextNode('しゃしん：'));
    if (photo.by) frag.appendChild(document.createTextNode(photo.by + '／'));
    if (photo.licenseUrl) {
      frag.appendChild(el('a', {
        href: photo.licenseUrl, target: '_blank', rel: 'noopener license',
        text: photo.license || '',
      }));
    } else {
      frag.appendChild(document.createTextNode(photo.license || ''));
    }
    if (photo.source) {
      frag.appendChild(el('a', { href: photo.source, target: '_blank', rel: 'noopener', text: 'Wikimedia Commons' }));
    }
    return frag;
  }

  function factsTable(a) {
    var rows = [
      ['すみか', a.sumika],
      ['大きさ', a.size],
      ['たべもの', a.tabemono],
      ['いつ 見られる', a.itsu],
      ['なかま', a.nakama],
      ['からだ', a.karada],
    ].filter(function (r) { return r[1]; });
    var t = el('table', { class: 'facts body-text' });
    rows.forEach(function (r) {
      t.appendChild(el('tr', null, [el('th', { text: r[0] }), el('td', { text: r[1] })]));
    });
    return t;
  }

  function openSheet(a) {
    speech.stop();
    state.current = a;
    document.getElementById('sheet-title').textContent = a.name;

    var body = document.getElementById('sheet-body');
    body.textContent = '';

    /* 紙に 出したときだけ 出る 見出し */
    body.appendChild(el('h2', { class: 'print-title', text: 'かくれんぼカード' }));

    var photo = a.photo || {};
    if (photo.file) {
      var hero = el('p', { class: 'hero' });
      hero.appendChild(el('img', {
        src: './photos/' + photo.file,
        alt: (photo.caption || (a.name + 'の しゃしん')),
        width: String(photo.w || 800), height: String(photo.h || 600),
      }));
      body.appendChild(hero);
      /* ⚠️ かくれて いる ところの しゃしんが どうしても 見つからない 生きものが
         いる（土の 中の モグラ、しんかいの イカ など）。その とき だまって
         ふつうの しゃしんを 出すと、「しゃしんだけを 見て どこに かくれて
         いるかを 話しあう」活動が 成りたたない。どちらなのかを 書く。 */
      if (photo.notHiding) {
        body.appendChild(el('p', { class: 'photo-note', text:
          'この しゃしんは、かくれて いない ときの ものです。' }));
      }
      body.appendChild(creditLine(photo));
    }

    var chips = el('div', { class: 'chips' });
    chips.appendChild(el('span', { class: 'chip', text: labelOf(DATA.places, a.place) }));
    chips.appendChild(el('span', { class: 'chip', text: 'かくれかた：' + labelOf(DATA.kinds, a.kind) }));
    chips.appendChild(el('span', { class: 'chip', text: a.inJapan ? 'にほんで 見られる' : 'せかいの 生きもの' }));
    if (a.textbook) chips.appendChild(el('span', { class: 'chip is-textbook', text: 'きょうかしょに 出て きた 生きもの' }));
    body.appendChild(chips);

    body.appendChild(el('h3', { class: 'sec', text: 'かくれんぼの 3つ（ここを ぶんに つかいます）' }));
    var ul = el('ul', { class: 'steps body-text' });
    [
      { n: '1', tag: 'どこに', s: a.placeS },
      { n: '2', tag: 'からだの とくちょう', s: a.bodyS },
      { n: '3', tag: 'どのように かくれるか', s: a.howS },
    ].forEach(function (row) {
      ul.appendChild(el('li', { 'data-n': row.n }, [
        el('span', { class: 'tag', text: row.tag }),
        el('span', { class: 'txt', text: row.s }),
      ]));
    });
    body.appendChild(ul);

    if (a.naze) {
      body.appendChild(el('h3', { class: 'sec', text: 'なぜ かくれるの？' }));
      body.appendChild(el('p', { class: 'why body-text', text: a.naze }));
    }

    body.appendChild(el('h3', { class: 'sec', text: 'くわしい こと' }));
    body.appendChild(factsTable(a));

    if (a.motto && a.motto.length) {
      body.appendChild(el('h3', { class: 'sec', text: 'もっと しりたい' }));
      var ol = el('ul', { class: 'motto body-text' });
      a.motto.forEach(function (m) { ol.appendChild(el('li', { text: m })); });
      body.appendChild(ol);
    }

    /* しらべた もと。
       ⚠️ 1年生は 読まない。読むのは 先生と、気に なった 子。
          だから たたんで おいて、ひらいた ときだけ 出す。
       ⚠️ 外へ 出る リンクだが、<a href> は「読みこみ」では ないので
          Zero-CDN の 検査には かからない（tools/check-no-external.test.mjs
          に その 回帰試験が ある）。 */
    if (a.sources && a.sources.length) {
      var det = el('details', { class: 'sources' });
      det.appendChild(el('summary', { text: 'しらべた もと（' + a.sources.length + 'つ）' }));
      var sl = el('ul');
      a.sources.forEach(function (u) {
        var host = String(u).replace(/^https?:\/\//, '').split('/')[0];
        sl.appendChild(el('li', {}, [
          el('a', { href: u, target: '_blank', rel: 'noopener noreferrer', text: host }),
        ]));
      });
      det.appendChild(sl);
      body.appendChild(det);
    }

    if (speech.ok) {
      var listen = el('button', { class: 'btn', type: 'button' }, ['こえで きく']);
      listen.addEventListener('click', function () {
        speech.speak([a.name + '。', a.placeS, a.bodyS, a.howS, a.naze].join(''), listen);
      });
      body.appendChild(el('div', { class: 'tools' }, [listen]));
    }

    body.appendChild(buildWriter(a));

    if (typeof sheet.showModal === 'function') sheet.showModal();
    else sheet.setAttribute('open', '');
    /* ⚠️ 紙の ための しるし。カードを ひらかないで いんさつした ときだけ
       .print-hint を 出す（style.css）。 */
    document.body.classList.add('is-sheet-open');
    sheet.scrollTop = 0;
    openId = a.id;
    /* ⚠️ もどすのは **この 生きものの** 下書きだけ。
       ほかの ひきの ①②③ を 持ちこむと、1 字も 打って いない 子の 画面に
       できあがった 文が 出て、そのまま 紙に 出る。 */
    var kept = restore(a.id);
    /* 名まえは、この ひきの 下書きが 無い ときだけ 入れる。
       下書きが あれば、子どもが 自分で しらべた 生きものの 名まえを
       書いて いる ことが あるので 上書きしない。 */
    if (!kept) fields.name.value = a.name;
    refreshPreview();
  }

  /* ── 文を かく（ページの 中に ある）──────────────────── */

  /* 下書きは **生きものごと**に 持つ。
     ⚠️ 1 本の 下書きを みんなで つかいまわしては いけない。
        2026-11-09 に 実機で ためしたら、A さんが ヒラメで 文を 書いて
        「とじる」を おしただけで、B さんが モクズショイの カードを ひらくと
        1 字も 打って いないのに ①②③ が そろって 出て、そのまま
        いんさつ できて しまった（A さんの 下書きも 消えて いた）。
        おなじ しくみで、おてほんの「おわりの ことば」も 2 ひき目から
        そろわなく なって いた（②の らんが 空に ならないため）。
     ⚠️ v1 の かたちとは 中みが ちがうので 鍵を v2 に した。
        v1 は 読まない（読むと 前の 子の 文が よみがえる）。 */
  var STORE = 'kakurenbo-bun-v2';
  var STORE_MAX = 24;   // ためて おく 生きものの 数

  function loadAll() {
    try {
      var v = JSON.parse(window.localStorage.getItem(STORE) || 'null');
      if (v && v.items && typeof v.items === 'object') {
        return { items: v.items, order: Array.isArray(v.order) ? v.order : [] };
      }
    } catch (e) { /* 壊れて いたら 空から */ }
    return { items: {}, order: [] };
  }

  function saveAll(all) {
    try { window.localStorage.setItem(STORE, JSON.stringify({ v: 2, items: all.items, order: all.order })); }
    catch (e) { /* シークレットウィンドウなど。保存できなくても書く手は止めない */ }
  }

  function field(step, id, label, howto, multiline, placeholder) {
    var input = multiline
      ? el('textarea', { id: id, rows: '2', placeholder: placeholder })
      : el('input', { type: 'text', id: id, autocomplete: 'off', placeholder: placeholder });
    input.addEventListener('input', refreshPreview);
    fields[step] = input;
    return el('div', { class: 'field', 'data-step': step }, [
      el('label', { for: id, text: label }),
      el('p', { class: 'howto', text: howto }),
      input,
      el('p', { class: 'sample', id: 's-' + step, hidden: '' }),
    ]);
  }

  function buildWriter(a) {
    var box = el('div', { class: 'writer' });
    box.appendChild(el('h3', { text: '✎ この 生きもので、じぶんの ぶんを かこう' }));
    box.appendChild(el('p', { class: 'howto', text: 'きょうかしょと おなじ ならびで かきます。①どこに → ②からだの とくちょう → ③どのように かくれるか。' }));

    box.appendChild(field('name', 'w-name', 'しらべた 生きものの 名まえ',
      '上の カードから えらぶか、じぶんで しらべた 生きものを かきます。', false, 'れい：モクズショイ'));
    box.appendChild(field('place', 'w-place', '① どこに かくれて いますか',
      '「〜に かくれて います。」で おわるように かきます。', false, 'れい：うみの そこの いわば'));

    var bodyField = field('body', 'w-body', '② からだの とくちょうは なんですか',
      '「もって いる もの」か「できる こと」を かきます。おわりの ことばは 下で えらべます。', false, 'れい：先の まがった かたい け');
    var choices = el('div', { class: 'choices', role: 'radiogroup', 'aria-label': '②の おわりの ことば' });
    [['motsu', '〜を もって います。'], ['dekiru', '〜ことが できます。']].forEach(function (c) {
      var b = el('button', {
        class: 'choice', type: 'button', 'data-end': c[0],
        'aria-pressed': bodyEnd === c[0] ? 'true' : 'false', text: c[1],
      });
      b.addEventListener('click', function () { setBodyEnd(c[0]); refreshPreview(); });
      choices.appendChild(b);
    });
    bodyField.insertBefore(choices, bodyField.querySelector('.sample'));
    box.appendChild(bodyField);

    box.appendChild(field('how', 'w-how', '③ どのように かくれますか',
      '「〜て」「〜で」で おわるように かきます。うしろに「、かくれます。」が つきます。',
      true, 'れい：その けに かいそうを つけて'));

    box.appendChild(el('div', { class: 'field' }, [
      el('label', { text: 'できあがった ぶん' }),
      el('div', { class: 'preview', id: 'preview', tabindex: '0' }),
      el('p', { class: 'sample', id: 's-full', hidden: '' }),
      el('div', { class: 'draw-box', 'aria-hidden': 'true' }, [el('span', { text: 'えを かこう' })]),
    ]));

    var tools = el('div', { class: 'tools' });
    if (speech.ok) {
      var sp = el('button', { class: 'btn primary', type: 'button', text: 'かいた ぶんを きく' });
      sp.addEventListener('click', function () { speech.speak(composed().replace(/＿+/g, ''), sp); });
      tools.appendChild(sp);
    }
    var copy = el('button', { class: 'btn', type: 'button', text: 'ぶんを コピー' });
    copy.addEventListener('click', function () { copyText(composed(), copy); });
    tools.appendChild(copy);

    var print = el('button', { class: 'btn', type: 'button', text: 'いんさつ' });
    print.addEventListener('click', function () { window.print(); });
    tools.appendChild(print);

    var sample = el('button', { class: 'btn', type: 'button', text: 'おてほんを 見る' });
    sample.addEventListener('click', function () { toggleSample(a, sample); });
    tools.appendChild(sample);

    var clear = el('button', { class: 'btn', type: 'button', text: 'ぜんぶ けす' });
    clear.addEventListener('click', function () {
      if (!window.confirm('かいた ぶんを ぜんぶ けしますか？')) return;
      Object.keys(fields).forEach(function (k) { fields[k].value = ''; });
      setBodyEnd('motsu');
      /* この ひきの 下書きも 消す。欄を 空に しただけだと、
         とじて ひらきなおした ときに もどって くる。 */
      var all = loadAll();
      delete all.items[openId];
      all.order = all.order.filter(function (k) { return k !== openId; });
      saveAll(all);
      refreshPreview();
      fields.name.value = a.name;
      fields.name.focus();
    });
    tools.appendChild(clear);
    box.appendChild(tools);

    box.appendChild(el('p', { class: 'notice', text:
      'かいた ぶんは、この たんまつの 中だけに のこります。ほかの 人には 見えません。名まえや クラスは かかないで ください。' }));
    return box;
  }

  function setBodyEnd(end) {
    bodyEnd = (end === 'dekiru') ? 'dekiru' : 'motsu';
    Array.prototype.forEach.call(document.querySelectorAll('.choice'), function (b) {
      b.setAttribute('aria-pressed', b.dataset.end === bodyEnd ? 'true' : 'false');
    });
  }

  /* おてほんは、らんに 入れる 中身だけを 見せる。
     ⚠️ 文 まるごとを 見せては いけない。らんの すぐ 下に 出るので、
        1年生は そのまま うつす。うつすと わくが 二重に なって
        「モクズショイが、モクズショイが、…に かくれて います。に かくれて います。」
        に なる。この アプリで いちばん 大事な「じぶんの ぶんを かく」が、
        おてほんを 見た 子だけ 壊れる。
     わくの かたちは tools/check-data.mjs が 守って いる
     （①は「〜に かくれて います。」、②は「〜を もって います。」か
      「〜ことが できます。」、③は「〜て、かくれます。」）。 */
  function samplePieces(a) {
    var place = a.placeS;
    if (place.indexOf(a.name + 'が、') === 0) place = place.slice(a.name.length + 2);
    place = place.replace(/に かくれて います。$/, '');

    var body = a.bodyS;
    if (body.indexOf(a.name + 'は、') === 0) body = body.slice(a.name.length + 2);
    var end = /ことが できます。$/.test(body) ? 'dekiru' : 'motsu';
    body = body.replace(/を もって います。$/, '').replace(/\s*ことが できます。$/, '');

    var how = a.howS.replace(/、かくれます。$/, '');
    return { name: a.name, place: place, body: body, how: how, end: end };
  }

  function toggleSample(a, button) {
    var piece = samplePieces(a);
    var first = document.getElementById('s-place');
    var shown = first && first.hidden === false;
    var pairs = [['name', piece.name], ['place', piece.place], ['body', piece.body], ['how', piece.how]];
    pairs.forEach(function (p) {
      var node = document.getElementById('s-' + p[0]);
      if (!node) return;
      node.textContent = 'おてほん：' + p[1];
      node.hidden = shown;
    });
    /* できあがりの 形は preview の そばで 見せる（らんの 下では ない）。 */
    var full = document.getElementById('s-full');
    if (full) {
      full.textContent = 'おてほんの ぶん：' + a.placeS + a.bodyS + a.howS;
      full.hidden = shown;
    }
    /* まだ 何も 書いて いない ときだけ、おわりの ことばも おてほんに そろえる。
       書きはじめて いる 子の えらんだ ものは 変えない。 */
    if (!shown && fields.body && !fields.body.value.trim()) {
      setBodyEnd(piece.end);
      refreshPreview();
    }
    button.textContent = shown ? 'おてほんを 見る' : 'おてほんを かくす';
  }

  function fieldValues() {
    return {
      name: fields.name.value.trim(),
      place: fields.place.value.trim(),
      body: fields.body.value.trim(),
      how: fields.how.value.trim(),
      end: bodyEnd,
    };
  }

  /* 教材文とおなじ ならびで 組み立てる。空いているところは かくれ線で見せて、
     「まだ ここが 書けていない」を 1年生にも 目で分かるようにする。

     ②の おわりは、教科書が 見せている 2 つの 型に そろえる。
       はまぐり型「大きな あしを もって います。」
       たこ型    「からだの いろを かえる ことが できます。」 */
  function composed() {
    var v = fieldValues();
    var name = v.name || '＿＿＿＿';
    var tail = v.end === 'dekiru' ? ' ことが できます。' : 'を もって います。';
    return [
      name + 'が、' + (v.place || '＿＿＿＿') + 'に かくれて います。',
      name + 'は、' + (v.body || '＿＿＿＿') + tail,
      (v.how || '＿＿＿＿') + '、かくれます。',
    ].join('\n');
  }

  function refreshPreview() {
    var box = document.getElementById('preview');
    if (!box) return;
    box.textContent = '';
    composed().split('\n').forEach(function (line, i) {
      box.appendChild(el('p', { class: 'preview-line', 'data-n': String(i + 1), text: line }));
    });
    commitDraft();
  }

  /** いま ひらいて いる 生きものの 下書きを たしかに のこす。 */
  function commitDraft() {
    if (!openId || !fields.name) return;
    var all = loadAll();
    all.items[openId] = fieldValues();
    all.order = all.order.filter(function (k) { return k !== openId; });
    all.order.push(openId);
    while (all.order.length > STORE_MAX) delete all.items[all.order.shift()];
    saveAll(all);
  }

  /** その 生きものの 下書きを もどす。無ければ 空の ままに する。
      ⚠️ ほかの 生きものの 下書きを 入れない こと。 */
  function restore(id) {
    var v = loadAll().items[id];
    if (!v) { setBodyEnd('motsu'); return null; }
    ['name', 'place', 'body', 'how'].forEach(function (k) {
      if (typeof v[k] === 'string' && fields[k]) fields[k].value = v[k];
    });
    setBodyEnd(v.end === 'dekiru' ? 'dekiru' : 'motsu');
    return v;
  }

  function copyText(text, button) {
    var done = function () { flash(button, 'コピーしました'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, button); });
    } else {
      fallbackCopy(text, button);
    }
  }

  /* クリップボードが つかえない ときの 道。
     ⚠️ つくった <textarea> を document.body へ 付けては いけない。
        この 画面は showModal() で ひらいて いるので、ダイアログの 外は
        inert に なって focus を とれない。body に 付けると ta.select() が
        写す もとに ならず、何も 写らない。ダイアログの 中へ 付ける。
     ⚠️ execCommand は 写せなかった とき throw では なく false を
        返す。返り値を 見ないと、写って いないのに「コピーしました」と
        出る。1年生は「出たのに はいらない」を 言葉に できないので、
        黙って 手が 止まる。 */
  function fallbackCopy(text, button) {
    var host = sheet && sheet.hasAttribute('open') ? sheet : document.body;
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.setAttribute('aria-hidden', 'true');
    ta.className = 'copy-helper';   /* ⚠️ style 属性は CSP の style-src で 止まる */
    host.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand('copy') === true; }
    catch (e) { ok = false; }
    host.removeChild(ta);
    flash(button, ok ? 'コピーしました' : 'コピーできません。ゆびで なぞって うつして ください');
  }

  /* ⚠️ 前の timeout を 止め、もどす 字は ボタンごとに 覚える こと。
     止めないと、1400ms の うちに 2 回 おしたとき 2 回目が 覚える 字が
     1 回目の おしらせ文に なり、ボタンの 字が もとに もどらない。
     ボタンごとに しないと、べつの ボタンの 字に なる。 */
  function flash(button, message) {
    if (!button) return;
    if (button._flashTimer) clearTimeout(button._flashTimer);
    else button._flashBase = button.textContent;
    button.textContent = message;
    button._flashTimer = setTimeout(function () {
      button.textContent = button._flashBase;
      button._flashTimer = null;
    }, 1400);
  }

  /* ── フッターのリンク ─────────────────────────────────
     giga-app-links.js は <slug>.giga-school.com でだけ出る。そうでない
     置き場では りようきやくへ たどりつけなくなるので、相対リンクを残す。 */
  /* giga-school.com では、りようきやく・こじんじょうほうは
     giga-app-links.js が 艦隊 共通の ものを 出しなおす。
     ⚠️ かくすのは #local-links（りようきやくと こじんじょうほう）だけ。
        「しゃしんの 出どころ」を ここに 入れない こと。あちらは
        manual / terms / privacy の 3 つしか 持って いないので、
        いっしょに かくすと 出どころへ 行ける 道が 1 本も なく なる。
        CC BY / CC BY-SA は 作者と ライセンスを 出すのが 条件。 */
  function tidyFooterLinks() {
    if (/\.giga-school\.com$/.test(window.location.hostname)) {
      var own = document.getElementById('local-links');
      if (own) own.hidden = true;
    }
  }

  /* ── 起動 ─────────────────────────────────────────────── */

  function start() {
    render();

    document.getElementById('q').addEventListener('input', function (ev) {
      state.q = ev.target.value;
      render();
    });

    /* にほんに いない 生きものは 76 ひきの うち 14 ひき。
       ⚠️ 実物を さがす 活動と あわせる とき、5 ひきに 1 ひきは
          日本では 見つからない。先生が えらぶ ときの ための ボタン。 */
    var jp = document.getElementById('jp-toggle');
    jp.addEventListener('click', function () {
      state.jp = !state.jp;
      jp.setAttribute('aria-pressed', state.jp ? 'true' : 'false');
      jp.textContent = state.jp ? 'せかいの 生きものも 見る' : 'にほんの 生きものだけ';
      render();
    });

    var quiz = document.getElementById('quiz-toggle');
    quiz.addEventListener('click', function () {
      state.quiz = !state.quiz;
      document.body.classList.toggle('is-quiz', state.quiz);
      quiz.setAttribute('aria-pressed', state.quiz ? 'true' : 'false');
      quiz.textContent = state.quiz ? 'なまえを 出す' : 'なまえを かくす';
      /* ⚠️ 描きなおしが 要る。名まえと alt の 字そのものを 入れかえる ので、
         クラスを つけかえる だけでは 読み上げに 名まえが のこる。 */
      render();
    });

    /* 1 だいを じゅんばんに つかう ときの「ぜんぶ けす」。
       ⚠️ カードの 中の「ぜんぶ けす」は その 1 ひきぶんだけ。
          2 人目の 子が おなじ カードを ひらくと 1 人目の 文が 出る ので、
          たんまつに のこって いる ぶんを まとめて 消す 道が 要る。 */
    var wipe = document.getElementById('wipe-drafts');
    if (wipe) {
      wipe.addEventListener('click', function () {
        if (!window.confirm('この たんまつに かいた ぶんを ぜんぶ けしますか？\nけすと もどせません。')) return;
        try { window.localStorage.removeItem(STORE); } catch (e) { /* つかえない 端末 */ }
        if (sheet.open && state.current) openSheet(state.current);   // いま ひらいて いる らんも 空に
        flash(wipe, 'けしました');
      });
    }

    document.getElementById('sheet-close').addEventListener('click', function () {
      if (typeof sheet.close === 'function') sheet.close(); else sheet.removeAttribute('open');
    });
    /* ⚠️ とじたら 中身を 空に する。のこして おくと、べつの ものを
       いんさつした つもりで さっきの カードが 紙に 出る。 */
    sheet.addEventListener('close', function () {
      speech.stop();
      document.body.classList.remove('is-sheet-open');
      var body = document.getElementById('sheet-body');
      if (body) body.textContent = '';
      document.getElementById('sheet-title').textContent = '';
      openId = '';
    });

    tidyFooterLinks();

    /* ⚠️ Chromebook は メモリが たりなく なると、ひらいて いる タブを
       だまって すてる。そのとき 'unload' は 来ない ことが あるので、
       'pagehide' で 下書きを たしかめて おく。
       入力の たびにも のこして いるが、ここは その 最後の とりで。
       （GIGA Standard v5 の C_PAGEHIDE） */
    window.addEventListener('pagehide', function () { commitDraft(); });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') commitDraft();
    });

    if ('serviceWorker' in navigator) {
      var reg = function () {
        navigator.serviceWorker.register('./sw.js').catch(function () { /* 入らなくても画面は動く */ });
      };
      /* ⚠️ load が もう 済んで いる ときの 道を 書く。app.js は defer では
         ないが、SW の 控えから 出た ときなど、ここに 来た ときには すでに
         'load' が 終わって いる ことが ある。その ときに addEventListener
         だけだと、二度と 呼ばれず **だまって 登録されない**。
         （GIGA Standard v5 の E_SW_REGISTER_READYSTATE） */
      if (document.readyState === 'complete') reg();
      else window.addEventListener('load', reg);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
