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

  function visible() {
    var q = state.q.trim();
    return DATA.animals.filter(function (a) {
      if (state.place !== 'all' && a.place !== state.place) return false;
      if (state.kind !== 'all' && a.kind !== state.kind) return false;
      if (q && a.name.indexOf(q) < 0 && (a.yomi || '').indexOf(q) < 0) return false;
      return true;
    });
  }

  /* タブの かっこの 中の 数。
     ⚠️ ぜんたいの 数を 出しては いけない。「うみの 中」を えらんでから
        「ひかりを つかう (3)」を おすと、3 と 書いて あるのに 2 まいしか
        出ない、という ことが 起きる。1年生には 画面が こわれたように 見える。 */
  function countFor(which, value) {
    return DATA.animals.filter(function (a) {
      if (which === 'place') {
        if (state.kind !== 'all' && a.kind !== state.kind) return false;
        return value === 'all' ? true : a.place === value;
      }
      if (state.place !== 'all' && a.place !== state.place) return false;
      return value === 'all' ? true : a.kind === value;
    }).length;
  }

  function svgGlyph(inner) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('class', 'glyph');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = inner;
    return s;
  }

  function buildTabs() {
    var placeBox = document.getElementById('place-tabs');
    var kindBox = document.getElementById('kind-tabs');
    placeBox.textContent = '';
    kindBox.textContent = '';

    [{ key: 'all', label: 'ぜんぶ' }].concat(DATA.places).forEach(function (p) {
      var n = countFor('place', p.key);
      placeBox.appendChild(el('button', {
        class: 'tab' + (n === 0 ? ' is-empty' : ''),
        type: 'button',
        disabled: n === 0 && state.place !== p.key ? '' : null,
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
        disabled: n === 0 && state.kind !== k.key ? '' : null,
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
        alt: animal.name + 'の しゃしん',
        loading: 'lazy', decoding: 'async',
        width: String(photo.w || 800), height: String(photo.h || 600),
      }));
    }
    return el('button', {
      class: 'card', type: 'button',
      onclick: function () { openSheet(animal); },
    }, [
      shot,
      el('span', { class: 'cap' }, [
        el('span', { class: 'nm', text: animal.name }),
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
    var kind = state.kind === 'all' ? '' : '／かくれ方：' + labelOf(DATA.kinds, state.kind);
    var q = state.q.trim() ? '／「' + state.q.trim() + '」で さがして います' : '';
    document.getElementById('count').textContent =
      place + kind + q + ' の かくれんぼ名人が ' + list.length + 'ひき。カードを おすと くわしい ページが ひらきます。';
  }

  /* ── 生きものの ページ ───────────────────────────────── */

  var sheet = document.getElementById('sheet');
  var fields = {};
  var bodyEnd = 'motsu';

  function creditLine(photo) {
    var frag = el('p', { class: 'credit' });
    frag.appendChild(document.createTextNode('しゃしん：'));
    if (photo.by) frag.appendChild(document.createTextNode(photo.by + '／'));
    frag.appendChild(document.createTextNode(photo.license || ''));
    if (photo.source) {
      frag.appendChild(document.createTextNode('　'));
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
      body.appendChild(creditLine(photo));
    }

    var chips = el('div', { class: 'chips' });
    chips.appendChild(el('span', { class: 'chip', text: labelOf(DATA.places, a.place) }));
    chips.appendChild(el('span', { class: 'chip', text: 'かくれ方：' + labelOf(DATA.kinds, a.kind) }));
    chips.appendChild(el('span', { class: 'chip', text: a.inJapan ? '日本で 見られる' : 'せかいの 生きもの' }));
    if (a.textbook) chips.appendChild(el('span', { class: 'chip is-textbook', text: 'きょうかしょに 出て きた 生きもの' }));
    body.appendChild(chips);

    body.appendChild(el('h3', { class: 'sec', text: 'かくれんぼの 3つ（ここを 文に つかいます）' }));
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
    sheet.scrollTop = 0;
    restore();
    if (!fields.name.value.trim()) fields.name.value = a.name;
    refreshPreview();
  }

  /* ── 文を かく（ページの 中に ある）──────────────────── */

  var STORE = 'kakurenbo-bun-v1';

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
    box.appendChild(el('h3', { text: '✎ この 生きもので、じぶんの 文を かこう' }));
    box.appendChild(el('p', { class: 'howto', text: 'きょうかしょと おなじ ならびで かきます。①どこに → ②からだの とくちょう → ③どのように かくれるか。' }));

    box.appendChild(field('name', 'w-name', 'しらべた 生きものの 名まえ',
      '上の カードから えらぶか、じぶんで しらべた 生きものを かきます。', false, 'れい：モクズショイ'));
    box.appendChild(field('place', 'w-place', '① どこに かくれて いますか',
      '「〜に かくれて います。」で おわるように かきます。', false, 'れい：うみの そこの いわば'));

    var bodyField = field('body', 'w-body', '② からだの とくちょうは なんですか',
      '「もって いる もの」か「できる こと」を かきます。おわり方は 下で えらべます。', false, 'れい：先の まがった かたい け');
    var choices = el('div', { class: 'choices', role: 'radiogroup', 'aria-label': '②の おわり方' });
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
      el('label', { text: 'できあがった 文' }),
      el('div', { class: 'preview', id: 'preview', tabindex: '0' }),
      el('div', { class: 'draw-box', 'aria-hidden': 'true' }, [el('span', { text: 'えを かこう' })]),
    ]));

    var tools = el('div', { class: 'tools' });
    if (speech.ok) {
      var sp = el('button', { class: 'btn primary', type: 'button', text: 'かいた 文を きく' });
      sp.addEventListener('click', function () { speech.speak(composed().replace(/＿+/g, ''), sp); });
      tools.appendChild(sp);
    }
    var copy = el('button', { class: 'btn', type: 'button', text: '文を コピー' });
    copy.addEventListener('click', function () { copyText(composed(), copy); });
    tools.appendChild(copy);

    var print = el('button', { class: 'btn', type: 'button', text: 'いんさつ' });
    print.addEventListener('click', function () { window.print(); });
    tools.appendChild(print);

    var sample = el('button', { class: 'btn', type: 'button', text: 'お手本を 見る' });
    sample.addEventListener('click', function () { toggleSample(a, sample); });
    tools.appendChild(sample);

    var clear = el('button', { class: 'btn', type: 'button', text: 'ぜんぶ けす' });
    clear.addEventListener('click', function () {
      if (!window.confirm('かいた 文を ぜんぶ けしますか？')) return;
      Object.keys(fields).forEach(function (k) { fields[k].value = ''; });
      refreshPreview();
      fields.name.focus();
    });
    tools.appendChild(clear);
    box.appendChild(tools);

    box.appendChild(el('p', { class: 'notice', text:
      'かいた 文は、この たんまつの 中だけに のこります。ほかの 人には 見えません。名まえや クラスは かかないで ください。' }));
    return box;
  }

  function setBodyEnd(end) {
    bodyEnd = (end === 'dekiru') ? 'dekiru' : 'motsu';
    Array.prototype.forEach.call(document.querySelectorAll('.choice'), function (b) {
      b.setAttribute('aria-pressed', b.dataset.end === bodyEnd ? 'true' : 'false');
    });
  }

  function toggleSample(a, button) {
    var pairs = [['place', a.placeS], ['body', a.bodyS], ['how', a.howS]];
    var first = document.getElementById('s-place');
    var shown = first && first.hidden === false;
    pairs.forEach(function (p) {
      var node = document.getElementById('s-' + p[0]);
      if (!node) return;
      node.textContent = 'お手本（' + a.name + '）：' + p[1];
      node.hidden = shown;
    });
    button.textContent = shown ? 'お手本を 見る' : 'お手本を かくす';
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
    try { window.localStorage.setItem(STORE, JSON.stringify(fieldValues())); }
    catch (e) { /* シークレットウィンドウなど。保存できなくても書く手は止めない */ }
  }

  function restore() {
    try {
      var raw = window.localStorage.getItem(STORE);
      if (!raw) return;
      var v = JSON.parse(raw);
      ['name', 'place', 'body', 'how'].forEach(function (k) {
        if (typeof v[k] === 'string' && fields[k]) fields[k].value = v[k];
      });
      if (v.end === 'motsu' || v.end === 'dekiru') setBodyEnd(v.end);
    } catch (e) { /* 壊れていたら、だまって空から始める */ }
  }

  function copyText(text, button) {
    var done = function () { flash(button, 'コピーしました'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, button); });
    } else {
      fallbackCopy(text, button);
    }
  }

  function fallbackCopy(text, button) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-1000px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); flash(button, 'コピーしました'); }
    catch (e) { flash(button, 'コピーできません'); }
    document.body.removeChild(ta);
  }

  function flash(button, message) {
    if (!button) return;
    var back = button.textContent;
    button.textContent = message;
    window.setTimeout(function () { button.textContent = back; }, 1400);
  }

  /* ── フッターのリンク ─────────────────────────────────
     giga-app-links.js は <slug>.giga-school.com でだけ出る。そうでない
     置き場では りようきやくへ たどりつけなくなるので、相対リンクを残す。 */
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

    var quiz = document.getElementById('quiz-toggle');
    quiz.addEventListener('click', function () {
      state.quiz = !state.quiz;
      document.body.classList.toggle('is-quiz', state.quiz);
      quiz.setAttribute('aria-pressed', state.quiz ? 'true' : 'false');
      quiz.textContent = state.quiz ? 'なまえを 出す' : 'なまえを かくす';
    });

    document.getElementById('sheet-close').addEventListener('click', function () {
      if (typeof sheet.close === 'function') sheet.close(); else sheet.removeAttribute('open');
    });
    sheet.addEventListener('close', function () { speech.stop(); });

    tidyFooterLinks();

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('./sw.js').catch(function () { /* 入らなくても画面は動く */ });
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
