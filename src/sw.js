import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener('push', (event) => {
  let title = 'تنبيه';
  let body = '';
  try {
    if (event.data) {
      const d = event.data.json();
      title = d.title || title;
      body = d.body || body;
    }
  } catch (_) {}
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      dir: 'rtl',
      lang: 'ar'
    })
  );
});
