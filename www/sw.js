// Service worker sederhana: network-first, jatuh ke cache saat offline.
// Naikkan VERSION setiap kali merilis versi baru.
var VERSION='elyndor-v5';
var CORE=['./','index.html','style.css','game.js','claude-shim.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',function(e){ e.waitUntil(caches.open(VERSION).then(function(c){ return c.addAll(CORE); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener('activate',function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==VERSION; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch',function(e){
  var r=e.request; if(r.method!=='GET'||new URL(r.url).origin!==location.origin) return;
  e.respondWith(fetch(r).then(function(res){ var cp=res.clone(); caches.open(VERSION).then(function(c){ c.put(r,cp); }); return res; }).catch(function(){ return caches.match(r); }));
});
