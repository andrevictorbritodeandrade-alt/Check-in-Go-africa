
const CACHE_NAME = 'checkin-go-v11-offline'; // Versão atualizada
const BASE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

// 1. INSTALAÇÃO: Cacheia o essencial imediatamente (App Shell)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching App Shell');
      return cache.addAll(BASE_ASSETS);
    })
  );
});

// 2. ATIVAÇÃO: Limpa caches antigos para garantir atualização
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. FETCH: Estratégia Híbrida Robustas
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // A. Ignorar APIs Externas (Deixar o app lidar com erro ou cache interno)
  if (url.protocol.startsWith('http') && (
      url.hostname.includes('googleapis') ||
      url.hostname.includes('firebase') ||
      url.hostname.includes('identitytoolkit') ||
      url.hostname.includes('exchangerate-api') || 
      url.hostname.includes('nominatim') ||
      url.hostname.includes('open-meteo')
  )) {
     return; 
  }

  // B. Navegação (HTML): Network First -> Cache -> Fallback Offline
  // Garante que o app abra mesmo sem internet
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
          return response;
        })
        .catch(() => {
          return caches.match('/index.html')
            .then((res) => res || caches.match('/'));
        })
    );
    return;
  }

  // C. Assets Estáticos (JS, CSS, Images, Fonts)
  // Estratégia: Cache First, falling back to Network, then caching network response
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Falha silenciosa para assets não críticos offline
      });
    })
  );
});
