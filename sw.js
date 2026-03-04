const CACHE_NAME = 'ceh4-v1';
const ASSETS = [
  'index.html',
  'manifest.json'
  // Сюда можно добавить иконки, если они есть
];

// Установка: кешируем ресурсы
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Работа в офлайне: берем данные из кеша
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
