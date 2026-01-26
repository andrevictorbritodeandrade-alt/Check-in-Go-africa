
const CACHE_NAME = 'checkin-go-v7-offline';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './favicon.svg',
  './manifest.json',
  './styles.css'
];

// 1. Instalação: Cacheia o "App Shell" básico imediatamente
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força o SW a ativar imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching App Shell');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// 2. Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Controla a página imediatamente
});

// 3. Interceptação de Rede (Fetch): Estratégia Híbrida
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // A. Ignorar chamadas de API (Firebase, Gemini, Analytics) para não cachear dados dinâmicos/auth
  // Deixamos o app lidar com o offline dessas partes (localStorage, etc)
  if (url.protocol.startsWith('http') && (
      url.hostname.includes('googleapis') ||
      url.hostname.includes('firestore') ||
      url.hostname.includes('firebase') ||
      url.hostname.includes('identitytoolkit')
  )) {
     return; 
  }

  // B. Navegação (HTML): Network First, Fallback to Cache
  // Tenta pegar a versão mais nova do site, se cair a net, mostra o cache.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match('./index.html') || caches.match('./');
        })
    );
    return;
  }

  // C. Assets (JS, CSS, Imagens, Fontes, CDN Tailwind): Stale-While-Revalidate
  // Retorna o cache rápido, mas atualiza em segundo plano.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        // Verifica se a resposta é válida antes de cachear
        if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors' && networkResponse.type !== 'opaque')) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      }).catch((err) => {
         // Se falhar a rede e não tiver cache, falha silenciosamente (ou retorna placeholder se fosse imagem)
      });

      return cachedResponse || fetchPromise;
    })
  );
});
