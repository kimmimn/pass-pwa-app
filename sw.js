// sw.js (Service Worker 파일)

const CACHE_NAME = 'pass-mobile-id-pwa-cache-v5'; // 캐시 버전을 V5로 복구
// 캐시할 파일 목록을 상대 경로('./')로 수정합니다.
const urlsToCache = [
    './', // index.html을 의미합니다.
    './index.html',
    './manifest.json',
    // 여기에 앱에 필요한 모든 CSS, JS, 이미지 파일 경로를 추가하세요.
];

// Service Worker 설치 및 필수 파일 캐싱
self.addEventListener('install', event => {
  console.log('[Service Worker] V5 설치 시작...');
  // 새로운 캐시 버전을 열어 파일들을 캐시에 추가합니다.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] V5 캐시에 파일 추가 중:', urlsToCache);
        return cache.addAll(urlsToCache).catch(err => {
            console.error('[Service Worker] V5 캐싱 실패. 경로를 확인하세요:', err);
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
                    // 현재 버전이 아닌 오래된 캐시를 삭제합니다.
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log(`[Service Worker] 오래된 캐시 삭제: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
