import { precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

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
    } catch (err) {}
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
          for (const client of windowClients) {
            if (client.url === urlToOpen && "focus" in client) {
              return (client as WindowClient).focus();
            }
          }

          if (self.clients.openWindow) {
            return self.clients.openWindow(urlToOpen);
          }
        }),
    );
  }
});
