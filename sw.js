self.addEventListener("push", (event) => {
let data = {
title: "LIFEOS Reminder",
body: "তোমার লক্ষ্যগুলোর অগ্রগতি একবার দেখে নাও।",
url: "/dashboard.html"
};

if (event.data) {
try {
data = { ...data, ...event.data.json() };
} catch (error) {
data.body = event.data.text();
}
}

event.waitUntil(
self.registration.showNotification(data.title, {
body: data.body,
icon: "/favicon.ico",
badge: "/favicon.ico",
data: {
url: data.url || "/dashboard.html"
}
})
);
});

self.addEventListener("notificationclick", (event) => {
event.notification.close();

const targetUrl = new URL(
event.notification.data?.url || "/dashboard.html",
self.location.origin
).href;

event.waitUntil(
clients.matchAll({
type: "window",
includeUncontrolled: true
}).then((windowClients) => {
for (const client of windowClients) {
if (client.url.startsWith(self.location.origin)) {
return client.navigate(targetUrl).then((windowClient) => {
return windowClient ? windowClient.focus() : clients.openWindow(targetUrl);
});
}
}

  return clients.openWindow(targetUrl);
})

);
});
