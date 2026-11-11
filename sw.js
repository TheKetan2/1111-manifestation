// ─── Cache ────────────────────────────────────────────────────────────────────
const CACHE = "manifestation-1111-v4";
const FILES = ["./","./index.html","./styles.css","./app.js","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png"];

self.addEventListener("install", event =>
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()))
);
self.addEventListener("activate", event =>
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
);
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(c => c.put(event.request, copy));
        return response;
      }).catch(() => caches.match("./index.html"))
    )
  );
});

// ─── Alarm helpers ────────────────────────────────────────────────────────────
const ALARM_TAG = "1111-alarm";

function fireAlarm(label) {
  return self.registration.showNotification("🔔 11:11 Manifestation", {
    body: label || "Time for your daily intentions. Open the app and begin.",
    icon: "./icons/icon-192.png",
    badge: "./icons/icon-192.png",
    tag: ALARM_TAG,
    renotify: true,
    requireInteraction: true,
    vibrate: [300, 150, 300, 150, 600],
    actions: [
      { action: "open",  title: "Open app" },
      { action: "snooze", title: "Snooze 5 min" }
    ]
  });
}

// ─── Periodic Background Sync (fires even when app is closed) ─────────────────
self.addEventListener("periodicsync", event => {
  if (event.tag !== ALARM_TAG) return;
  event.waitUntil(fireAlarm());
});

// ─── Message from app: schedule an in-SW alarm via setTimeout ─────────────────
// The app posts { type:"SCHEDULE_ALARM", alarms:[{time:"07:30", label:"..."}, ...] }
// The SW keeps timers alive while the SW itself is alive (best-effort background).
let alarmTimers = [];

self.addEventListener("message", event => {
  if (!event.data) return;

  if (event.data.type === "SCHEDULE_ALARM") {
    // Clear any previous timers
    alarmTimers.forEach(t => clearTimeout(t));
    alarmTimers = [];

    const alarms = event.data.alarms || [];
    alarms.forEach(({ time, label, enabled }) => {
      if (!enabled) return;
      const ms = msUntilTime(time);
      const t = setTimeout(() => {
        fireAlarm(label || "Time for your daily intentions.");
        // Re-schedule for next day automatically
        const t2 = setTimeout(() => fireAlarm(label), 24 * 60 * 60 * 1000);
        alarmTimers.push(t2);
      }, ms);
      alarmTimers.push(t);
    });

    // Acknowledge
    if (event.source) event.source.postMessage({ type: "ALARMS_SCHEDULED", count: alarms.filter(a => a.enabled).length });
  }

  if (event.data.type === "FIRE_TEST") {
    fireAlarm(event.data.label || "🔔 Test alarm — your daily intentions await!");
  }
});

// ─── Notification click / action ──────────────────────────────────────────────
self.addEventListener("notificationclick", event => {
  event.notification.close();

  if (event.action === "snooze") {
    event.waitUntil(
      new Promise(resolve => {
        setTimeout(() => { fireAlarm("Snoozed reminder: start your intentions now.").then(resolve); }, 5 * 60 * 1000);
      })
    );
    return;
  }

  // "open" action or tap on notification body → focus / open the app
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clients => {
      const existing = clients.find(c => c.url.includes("index.html") || c.url.endsWith("/"));
      if (existing) return existing.focus();
      return self.clients.openWindow("./");
    })
  );
});

// ─── Utility ──────────────────────────────────────────────────────────────────
function msUntilTime(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target - now;
}