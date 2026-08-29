// ================================================================
// Service Worker – لتخزين الملفات مؤقتاً وتشغيل التطبيق دون اتصال
// ================================================================

const CACHE_NAME = 'hero-license-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json'
];

// تثبيت الـ Service Worker وتخزين الملفات
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('✅ تم فتح الـ Cache');
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.error('❌ فشل التخزين المؤقت:', err))
    );
});

// استرجاع الملفات من الـ Cache عند الطلب
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // إذا كان الملف موجوداً في الـ Cache، أرجع منه
                if (response) {
                    return response;
                }
                // وإلا، حمّله من الشبكة
                return fetch(event.request);
            })
            .catch(() => {
                // في حال عدم وجود اتصال، عرض صفحة خطأ (اختياري)
                return new Response('❌ لا يوجد اتصال بالإنترنت', {
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            })
    );
});

// تحديث الـ Cache عند تغيير الإصدار
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