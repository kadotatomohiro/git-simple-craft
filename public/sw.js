const CACHE_NAME = 'gitcraft-cache-v1';

// インストール時に即時アクティブ化
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 古いキャッシュのクリーンアップ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ネットワークファースト（失敗時はキャッシュにフォールバック）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // GETリクエストで成功したものだけをキャッシュする
        if (event.request.method === 'GET' && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request)) // オフライン時はキャッシュを返す
  );
});
