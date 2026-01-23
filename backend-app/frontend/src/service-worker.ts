/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

export {};

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event: PushEvent) => {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: data.icon || "/vite.svg",
        badge: "/vite.svg",
        data: {
          url: data.url || "/dashboard/uploads",
        },
        tag: data.tag || "notification-sync",
        renotify: true,
        requireInteraction: true,
        actions: [
          {
            action: "open",
            title: "View Now",
          },
        ],
      } as NotificationOptions;

      event.waitUntil(self.registration.showNotification(data.title, options));
    } catch (err) {
      // Silent fail - notification display is best-effort
    }
  }
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  const notification = event.notification;
  const action = event.action;

  notification.close();

  if (action === "open" || !action) {
    const urlToOpen = new URL(notification.data.url, self.location.origin).href;

    event.waitUntil(
      self.clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((windowClients) => {
          // Try to focus existing window
          for (const client of windowClients) {
            if (client.url === urlToOpen && "focus" in client) {
              return (client as WindowClient).focus();
            }
          }
          // If no window found, open new one
          if (self.clients.openWindow) {
            return self.clients.openWindow(urlToOpen);
          }
        }),
    );
  }
});
