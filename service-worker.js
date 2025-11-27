// 캐시 이름 설정 (버전 업데이트 시 이름을 변경하여 새 캐시를 만듭니다.)
const CACHE_NAME = 'mobile-id-pass-v2';

// 캐시할 파일 목록: 'icon.png'가 추가되었습니다.
const urlsToCache = [
    '/index.html',
    '/manifest.json',
    '/icon.png', // 새로운 앱 아이콘
    // 이미지 파일은 실제로 존재해야 합니다.
    '/profile_photo.jpg', 
    '/qr_main.png',
    // Tailwind CSS CDN은 오프라인에서 사용할 수 없으므로 제외합니다.
];

// 설치 이벤트: 캐시할 파일들을 미리 다운로드하여 저장합니다.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache and pre-cached essential files');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting(); // 설치 후 바로 활성화
});

// 가져오기 (Fetch) 이벤트: 네트워크 요청 시 캐시를 먼저 확인하고, 없으면 네트워크에서 가져옵니다.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 캐시에 응답이 있으면 캐시된 응답을 반환
                if (response) {
                    return response;
                }
                // 캐시에 없으면 네트워크 요청
                return fetch(event.request);
            })
    );
});

// 활성화 이벤트: 이전 버전의 캐시를 정리합니다.
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});