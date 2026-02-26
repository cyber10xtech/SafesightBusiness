// Service Worker for Push Notifications - Safesight Business

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {
    title: 'Safesight Business',
    body: 'You have a new notification',
    icon: '/pwa-192x192.png',
    url: '/',
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {}
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: '/pwa-192x192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url, ...data.data },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
  );
});

self.addEventListener('sync', (event) => {});
