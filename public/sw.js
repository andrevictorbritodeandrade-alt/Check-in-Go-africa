
const CACHE_NAME = 'checkin-go-v9-offline'; // Incremento de versão para forçar atualização
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
  '/styles.css'
];

// 1. INSTALAÇÃO: Cacheia o essencial imediatamente
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força o SW a assumir o controle imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching App Shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// 2. ATIVAÇÃO: Limpa caches antigos para garantir que a nova versão rode
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
  self.clients.claim(); // Controla todas as abas abertas imediatamente
});

// 3. FETCH: Estratégia "Stale-While-Revalidate" Agressiva
// Isso garante que arquivos JS/CSS gerados pelo build sejam cacheados na primeira visita
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // A. Ignorar requisições de API (Firebase, Google, etc)
  // Deixe que a lógica interna do app (que já implementamos) lide com dados offline
  if (url.protocol.startsWith('http') && (
      url.hostname.includes('googleapis') ||
      url.hostname.includes('firestore') ||
      url.hostname.includes('firebase') ||
      url.hostname.includes('identitytoolkit') ||
      url.hostname.includes('exchangerate-api') ||
      url.hostname.includes('openstreetmap')
  )) {
     return; 
  }

  // B. Navegação (HTML): Network First, Fallback to Cache
  // Se o usuário tentar navegar e estiver offline, serve o index.html (SPA)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
          return response;
        })
        .catch(() => {
          return caches.match('/index.html').then(res => res || caches.match('/'));
        })
    );
    return;
  }

  // C. Assets (JS, CSS, Imagens Locais): Cache First, depois Network (Stale-While-Revalidate)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Se tiver no cache, retorna imediatamente (velocidade nativa)
      const fetchPromise = fetch(request).then((networkResponse) => {
        // Atualiza o cache em segundo plano se a rede responder
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Se falhar rede, não faz nada (já retornamos o cache se existir)
      });

      return cachedResponse || fetchPromise;
    })
  );
});
