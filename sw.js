const CACHE_NAME = '54hs-quiz-embed-v2';
const ASSETS = ['./','index.html','style.css','script.js','manifest.json','emblem.jpg','uh1n-action.jpg'];
self.addEventListener('install', e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate', e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k===CACHE_NAME?null:caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch', e=>{e.respondWith(caches.match(e.request).then(cached=> cached || fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request, copy));return res;})));});