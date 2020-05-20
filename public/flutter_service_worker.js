'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "index.html": "53aeaaccc3454cbc0c0ee998b6f52187",
"/": "90ac0b7d5643f841fedbc4bfa147096e",
"main.dart.js": "bb136115129a9fdff2e2ad17386df7b2",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "e31f816605da483ecabb9e7f4568867a",
"api/favicon-16x16.png": "f0ae831196d55d8f4115b6c5e8ec5384",
"api/index.html": "90ac0b7d5643f841fedbc4bfa147096e",
"api/swagger-ui.js": "a6c76f2cf93d9a3b050b7e86bfc0aead",
"api/swagger-ui-standalone-preset.js.map": "62c72c275cdb020240e12966bba52064",
"api/swagger-ui.css": "8db32e4681a17f1b67d7ae8ca54724eb",
"api/swagger-ui.js.map": "8d09a77cc16cd9d07297af35b648e5d0",
"api/swagger-ui-bundle.js": "fff54563438273eb775f7c36dc5146ba",
"api/swagger-ui.css.map": "32a0d6360d88d2a04cc26b746a881122",
"api/swagger-ui-standalone-preset.js": "c2061545ca9850c89fc33183294b6a8c",
"api/swagger-ui-bundle.js.map": "04a3eab3163b9d36692bbd0b5a46d85a",
"api/oauth2-redirect.html": "29cac61cf6bb191f8df6262893bc31bd",
"api/purduehcr.json": "de14733c1715101241db13f1c082b6b4",
"api/favicon-32x32.png": "40d4f2c38d1cd854ad463f16373cbcb6",
"assets/LICENSE": "43deaed3f8e89dec0a9a8a5c53e5cb22",
"assets/AssetManifest.json": "6bbcf80c56da6e4d7ac75f346feb81ca",
"assets/FontManifest.json": "01700ba55b08a6141f33e168c4a6c22f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/LICENSE%202": "4ed3db3c29d79b33538dc6e9ad569e94",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/assets/main_icon.jpg": "102d3532e213af007658f26bb07f5993",
"assets/assets/main_icon.png": "8614ef0ff1a50cf4aad67c8bdded7eb5",
"assets/assets/flutter-firebase-config.json": "03b6db1f4135ee879a222db03944e58c"
};

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return caches.delete(cacheName);
    }).then(function (_) {
      return caches.open(CACHE_NAME);
    }).then(function (cache) {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
