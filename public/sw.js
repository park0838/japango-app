// JapanGo Service Worker
// 버전: 2.0.0

const CACHE_NAME = 'japango-v2.0.0';
const STATIC_CACHE_NAME = 'japango-static-v2.0.0';
const DYNAMIC_CACHE_NAME = 'japango-dynamic-v2.0.0';

// 캐시할 정적 자산들
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // CSS 파일들
  '/src/index.css',
  '/src/App.css',
  '/src/styles/design-system.css',
  '/src/styles/components.css',
  // JavaScript 파일들 (빌드 후 생성됨)
  // '/assets/index.js',
  // 폰트 파일들
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;900&display=swap',
  // 단어 데이터 파일들
  '/vocabulary/week1.json',
  '/vocabulary/week2.json',
  '/vocabulary/week3.json',
  '/vocabulary/week4.json',
  '/vocabulary/week5.json',
  '/vocabulary/week6.json',
];

// 동적으로 캐시할 URL 패턴들
const DYNAMIC_CACHE_PATTERNS = [
  /^https:\/\/fonts\.gstatic\.com\/.*/,
  /^https:\/\/fonts\.googleapis\.com\/.*/,
];

// 캐시 안 할 URL 패턴들
const NO_CACHE_PATTERNS = [
  /^https:\/\/.*\.google-analytics\.com\/.*/,
  /^https:\/\/.*\.googletagmanager\.com\/.*/,
  /\/api\//,
];

// 서비스 워커 설치
self.addEventListener('install', (event) => {
  console.log('🚀 JapanGo Service Worker 설치 중...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('📦 정적 자산 캐시 중...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker 설치 완료');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker 설치 실패:', error);
      })
  );
});

// 서비스 워커 활성화
self.addEventListener('activate', (event) => {
  console.log('🔄 JapanGo Service Worker 활성화 중...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // 이전 버전의 캐시 삭제
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
              console.log('🗑️ 이전 캐시 삭제:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker 활성화 완료');
        return self.clients.claim();
      })
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // HTTPS만 처리
  if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
    return;
  }
  
  // 캐시 안 할 패턴 확인
  if (NO_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    return;
  }
  
  // HTML 요청 처리 (App Shell)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // 정적 자산 및 API 요청 처리
  event.respondWith(handleResourceRequest(request));
});

// 내비게이션 요청 처리 (App Shell 전략)
async function handleNavigationRequest(request) {
  try {
    // 네트워크에서 최신 버전 시도
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 캐시에 저장
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('네트워크 응답 실패');
  } catch (error) {
    // 네트워크 실패 시 캐시에서 가져오기
    console.log('📡 네트워크 실패, 캐시에서 가져오기:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 캐시에도 없으면 기본 HTML 반환
    const cache = await caches.open(STATIC_CACHE_NAME);
    return cache.match('/') || cache.match('/index.html');
  }
}

// 리소스 요청 처리 (Cache First + Network Fallback)
async function handleResourceRequest(request) {
  const url = new URL(request.url);
  
  // 단어 데이터 파일은 Cache First
  if (request.url.includes('/vocabulary/') || request.url.endsWith('.json')) {
    return handleCacheFirst(request);
  }
  
  // 폰트는 Cache First
  if (DYNAMIC_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    return handleCacheFirst(request);
  }
  
  // 기타 정적 자산은 Stale While Revalidate
  return handleStaleWhileRevalidate(request);
}

// Cache First 전략
async function handleCacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('❌ 리소스 로드 실패:', request.url, error);
    throw error;
  }
}

// Stale While Revalidate 전략
async function handleStaleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // 네트워크 실패 시 캐시된 응답 반환
    return cachedResponse;
  });
  
  // 캐시된 응답이 있으면 즉시 반환, 없으면 네트워크 대기
  return cachedResponse || fetchPromise;
}

// 백그라운드 동기화 (Background Sync)
self.addEventListener('sync', (event) => {
  console.log('🔄 백그라운드 동기화:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// 백그라운드 동기화 작업
async function doBackgroundSync() {
  try {
    // 학습 데이터 동기화 등의 작업 수행
    console.log('📊 학습 데이터 동기화 완료');
  } catch (error) {
    console.error('❌ 백그라운드 동기화 실패:', error);
  }
}

// 푸시 알림 처리
self.addEventListener('push', (event) => {
  console.log('📱 푸시 알림 수신:', event);
  
  const options = {
    body: event.data ? event.data.text() : '새로운 단어를 학습할 시간입니다!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '학습 시작',
        icon: '/icons/action-study.png'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/icons/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('JapanGo', options)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 알림 클릭:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/weeks')
    );
  } else if (event.action === 'close') {
    // 알림만 닫기
  } else {
    // 기본 동작: 앱 열기
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// 에러 처리
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker 에러:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Service Worker Promise 거부:', event.reason);
});

// 메시지 처리 (앱과의 통신)
self.addEventListener('message', (event) => {
  console.log('💬 메시지 수신:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '2.0.0' });
  }
});

console.log('🎌 JapanGo Service Worker 로드 완료 (v2.0.0)');
