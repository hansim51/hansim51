// 다들 어디로 갔나? — 오프라인에서도 어플이 열리게 해 주는 서비스워커
// 어플을 고쳐서 다시 올릴 때는 아래 CACHE_NAME의 숫자를 하나 올리세요 (v1 → v2 …)
// 그래야 폰이 예전 것을 지우고 새 것을 받아 옵니다.
const CACHE_NAME = "dadeul-cache-v2";
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const fetchP = fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => hit);
      return hit || fetchP;
    })
  );
});
