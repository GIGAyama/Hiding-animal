/* =====================================================================
   install-hook.js — 「ホーム画面に いれる」の 出しかた
   ---------------------------------------------------------------------
   ・外から 何も 読まない。何も 送らない。
   ・1 回 ことわられたら、もう 出さない（その 端末の 中だけに おぼえる）。
     ⚠️ 毎回 出すと、1年生が 画面を おす たびに 出て きて、
        さがす 手が 止まる。
   ・iPhone / iPad は beforeinstallprompt が 来ない。こちらは
     「共有ボタンから ついか」する しかないので、やり方だけ 出す。
   ===================================================================== */
(function () {
  'use strict';

  var KEY = 'kakurenbo-install-v1';
  var deferred = null;

  function remembered() {
    try { return localStorage.getItem(KEY) === 'no'; } catch (e) { return false; }
  }
  function remember() {
    try { localStorage.setItem(KEY, 'no'); } catch (e) { /* つかえなくても よい */ }
  }

  /* すでに ホーム画面から ひらいて いる ときは 出さない */
  function standalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
           window.navigator.standalone === true;
  }

  function bar(text, actionLabel, onAction) {
    var box = document.createElement('div');
    box.className = 'install-bar';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'ホーム画面に いれる');

    var p = document.createElement('p');
    p.textContent = text;
    box.appendChild(p);

    var btns = document.createElement('div');
    btns.className = 'install-btns';

    if (onAction) {
      var go = document.createElement('button');
      go.type = 'button';
      go.className = 'install-go';
      go.textContent = actionLabel;
      go.addEventListener('click', function () {
        box.remove();
        onAction();
      });
      btns.appendChild(go);
    }

    var no = document.createElement('button');
    no.type = 'button';
    no.className = 'install-no';
    no.textContent = 'いらない';
    no.addEventListener('click', function () {
      remember();
      box.remove();
    });
    btns.appendChild(no);

    box.appendChild(btns);
    document.body.appendChild(box);
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    if (remembered() || standalone()) return;
    deferred = e;
    bar('この ずかんを ホーム画面に いれると、つぎから すぐ ひらけます。',
        'いれる', function () {
          if (!deferred) return;
          deferred.prompt();
          deferred = null;
        });
  });

  /* iPhone / iPad。上の しくみが ない ので、やり方を 言うだけ。 */
  document.addEventListener('DOMContentLoaded', function () {
    if (remembered() || standalone() || deferred) return;
    var ua = navigator.userAgent || '';
    var ios = /iPad|iPhone|iPod/.test(ua) ||
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (!ios) return;
    bar('下の 「共有」ボタン →「ホーム画面に 追加」で、つぎから すぐ ひらけます。',
        null, null);
  });
})();
