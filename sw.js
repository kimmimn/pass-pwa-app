// sw.js (Service Worker 파일)

const CACHE_NAME = 'pass-pwa-cache-v1';
// 캐시할 파일 목록: GitHub Pages에서 접근 가능한 경로를 지정해야 합니다.
const urlsToCache = [
    '/',
    '/index.html',
    // 실제 배포 시, 저장소 이름이 포함된 경로를 사용할 수도 있습니다.
    // 예: '/your-repo-name/'
];

// Service Worker 설치 및 필수 파일 캐싱
self.addEventListener('install', event => {
  console.log('[Service Worker] 설치 시작...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] 캐시에 파일 추가 중:', urlsToCache);
        return cache.addAll(urlsToCache).catch(err => {
            console.error('[Service Worker] 캐싱 실패:', err);
        });
      })
  );
});

// fetch 이벤트: 네트워크 요청 시 캐시에서 파일을 먼저 찾습니다.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 요청한 파일이 있다면 캐시된 응답을 반환합니다.
        if (response) {
          return response;
        }
        // 캐시에 없으면 네트워크로 요청합니다.
        return fetch(event.request);
      }
    )
  );
});

// 기존 Service Worker 제거 및 업데이트
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
