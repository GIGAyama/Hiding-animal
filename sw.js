/* =====================================================================
   しぜんの かくれんぼ ずかん — オフラインでも ひらけるようにする
   ---------------------------------------------------------------------
   学校のネットワークは、時間帯によって とても遅くなる。1クラス 35台が
   いっせいに開く場面で待たされると、それだけで 1 時間が終わる。

   ・骨組み（HTML・CSS・JS・データ）は 先に 配っておく。
   ・⚠️ 写真は 先読みしない。109 まいで 数十 MB に なるので、先読みに
     入れると 最初の 1 回が いつまでも 終わらない。見た ものだけ
     あとから ためる（上限つき）。
   ・ほかのドメインには一切手を出さない。
   ===================================================================== */

// ⚠️ この行は手で直さない。tools/build-sw.mjs が PRECACHE_URLS の中身から書き換える。
const APP_VERSION = 'vac7b3ecb'; /* __APP_VERSION__ */
const SHELL = `kakurenbo-shell-${APP_VERSION}`;
/* ⚠️ 写真の 控えは 版を 付けない。APP_VERSION は data/animals.js の 中身まで
   ふくめて 作るので、文を 1 字 直すと 名前が かわり、activate が 写真の 控えを
   まるごと 消す。71 まいで 6.5MB、35台なら 230MB を 取りなおす ことに なる。
   同じ 名前の 写真は 中身も かわらない（下の fetch も そう 書いて いる）ので、
   差しかえる ときは content/photos.json の ファイル名を かえる。 */
const PHOTOS = 'kakurenbo-photos-v1';
const PHOTO_LIMIT = 160;   // ためこむ写真の上限

const PRECACHE_URLS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './data/animals.js',
  './assets/favicon.svg',
  './giga-sw-updater.js',
  './giga-app-links.js',
  './install-hook.js',
  './manifest.webmanifest',
  './for-teachers.html',
  './terms.html',
  './privacy.html',
  './credits.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    /* 1 つ欠けても 残りは 配れるようにする。addAll は 1 つの 404 で全部落ちる。 */
    await Promise.allSettled(
      PRECACHE_URLS.map((url) => cache.add(new Request(url, { cache: 'reload' })))
    );
    /* ⚠️ ここで skipWaiting() を 呼んでは いけない。呼ぶと activate →
       clients.claim() → controllerchange と つながり、giga-sw-updater.js が
       ページを ひとりで 読みなおす。子どもが 文を 打ちはじめた ところで
       ひらいて いた カードが 閉じる。下の message ハンドラが 'SKIP_WAITING' を
       受けるので、「新しい ばんが あります／こうしん する」を おしたときだけ
       入れかわる。 */
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => k.startsWith('kakurenbo-') && k !== SHELL && k !== PHOTOS)
        .map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

/** 控えが増えすぎないよう、古いものから捨てる。 */
async function trim(cacheName, limit) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= limit) return;
  await Promise.all(keys.slice(0, keys.length - limit).map((k) => cache.delete(k)));
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // よその ドメインには 触らない

  /* 写真：まず控え。同じ名前なら中身も変わらないので、取り直さない。 */
  if (url.pathname.indexOf('/photos/') >= 0) {
    event.respondWith((async () => {
      const cache = await caches.open(PHOTOS);
      const hit = await cache.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res && res.ok && res.type === 'basic') {
          await cache.put(req, res.clone());
          trim(PHOTOS, PHOTO_LIMIT);
        }
        return res;
      } catch (e) {
        return new Response('', { status: 504 });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(SHELL);
    const hit = await cache.match(req, { ignoreSearch: true });

    const fresh = fetch(req).then((res) => {
      if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
      return res;
    }).catch(() => null);

    if (hit) return hit;

    const res = await fresh;
    if (res) return res;

    if (req.mode === 'navigate') {
      const shell = await cache.match('./index.html');
      if (shell) return shell;
    }
    return new Response('オフラインです', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  })());
});
