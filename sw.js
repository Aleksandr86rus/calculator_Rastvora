// sw.js — минимальный сервис-воркер для кэширования приложения (offline-доступ)

const CACHE_NAME = 'ceh4-calculator-v1';
const urlsToCache = [
  '/',
  '/index.html',           // или имя вашего HTML-файла, если не index.html
  'icons/icon-192.png',
  'icons/icon-512.png'
  // Добавьте сюда другие файлы, если они есть: CSS, внешние шрифты и т.д.
  // Например: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэшируем статические файлы');
        return cache.addAll(urlsToCache);
      })
  );
  // Пропустить ожидание, чтобы новый SW сразу активировался
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  // Взять контроль над страницами сразу
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Если в кэше — отдаём оттуда (быстро и оффлайн)
        if (response) {
          return response;
        }
        // Иначе — идём в сеть
        return fetch(event.request);
      })
  );
});
