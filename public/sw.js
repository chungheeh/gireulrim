const CACHE_NAME = "gireulrim-v2";

// 캐시할 정적 에셋만 명시 (페이지 HTML은 절대 캐시 안 함)
const STATIC_ASSETS = [
  "/icon-192x192.png",
  "/icon-512x512.png",
];

self.addEventListener("install", (event) => {
  // 정적 이미지만 pre-cache (없어도 무방)
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_ASSETS).catch(() => {})
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // ── 캐시하지 않는 것들 (항상 네트워크) ──────────────────
  // 1. GET 이외 요청
  if (event.request.method !== "GET") return;
  // 2. HTML 페이지 (네비게이션) — 리다이렉트 포함, 절대 캐시 금지
  if (event.request.mode === "navigate") return;
  // 3. API 호출
  if (url.pathname.startsWith("/api/")) return;
  // 4. Supabase
  if (url.hostname.includes("supabase")) return;
  // 5. Next.js 내부 (_next/data 등)
  if (url.pathname.startsWith("/_next/data")) return;
  // 6. 리다이렉트 응답은 캐시 금지 (307/301/302)
  // → respondWith 자체를 호출하지 않으면 브라우저가 직접 처리

  // ── 정적 에셋만 캐시-first ────────────────────────────
  // _next/static (JS/CSS 번들), 이미지 파일만
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|woff2?)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then((response) => {
            // 200 OK 만 캐시
            if (response.ok && response.status === 200) {
              const cloned = response.clone();
              caches.open(CACHE_NAME).then((cache) =>
                cache.put(event.request, cloned)
              );
            }
            return response;
          })
      )
    );
  }
  // 그 외 모든 요청은 서비스워커가 개입하지 않음 (브라우저 기본 동작)
});

self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || "/icon-192x192.png",
      badge: "/icon-192x192.png",
      vibrate: [100, 50, 100],
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || "/")
  );
});
