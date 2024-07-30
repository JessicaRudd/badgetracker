'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "d66f875b13eb095eddc6a9438fc9d140",
"version.json": "421ec4e210bdd011349c630ce0aee01a",
"index.html": "f46b419b48fa36aeae75d415d8edad47",
"/": "f46b419b48fa36aeae75d415d8edad47",
"main.dart.js": "e306af2efbb270807cb41a2099e82db5",
"flutter.js": "383e55f7f3cce5be08fcf1f3881f585c",
"favicon.png": "d9b39e9a372b9ee6bf86e4a3d9869610",
"icons/Icon-192.png": "ffbe9d2d6f1fe0aa3f48a012be13cce4",
"icons/Icon-maskable-192.png": "ffbe9d2d6f1fe0aa3f48a012be13cce4",
"icons/Icon-maskable-512.png": "fd216239f11915571f4649c631e11a6f",
"icons/Icon-512.png": "fd216239f11915571f4649c631e11a6f",
"manifest.json": "a0edbd3d99e5aa6c94d5e9a76d77c4a2",
"assets/AssetManifest.json": "5ac7529ccbfdb5f697439e16ded8f778",
"assets/NOTICES": "0c139ef3c1ad477d561affed22e6d8b6",
"assets/FontManifest.json": "0102f7db034a27ac2e161fb782e51e34",
"assets/AssetManifest.bin.json": "f8a2b029ccefa5ee92675d23917d4976",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "645103e9e5a969559de0d187745989be",
"assets/fonts/MaterialIcons-Regular.otf": "afad1caaa9c183f0bad551b1ead57eaa",
"assets/assets/imgs/gcloud.svg": "e74e2ce182c10d0a87d94e80e5f1e90e",
"assets/assets/imgs/gcloud.png": "2db9f8ddfd1bdcea940dfc42257bc853",
"assets/assets/imgs/gcloud1c.svg": "8dd5ae8e4b91026913be802c616cc0cd",
"assets/assets/imgs/gcloudmono.svg": "b7499201153636a0b0de5554a140cf83",
"assets/assets/imgs/gcloud2c.svg": "4c959fb25c6d4efd119d1647aeabbe2a",
"assets/assets/imgs/flutterlogo.png": "43b437d2fc2c13c5edda6b36ad95a2b6",
"assets/assets/imgs/gcloud3c.svg": "04d9492ca81bfe5191a6f49006e4e60c",
"assets/assets/imgs/gcloud4.svg": "6897583cba12a44f6e2781c93ae9646b",
"assets/assets/imgs/gcloud4c.svg": "fed7df906ac61b19966aab39c1d9176b",
"assets/assets/imgs/gcloud2.svg": "19440c8de4c41dddb1af76f852e4e317",
"assets/assets/imgs/gcloud3.svg": "2564e5786128b910d6c0165cd3117def",
"assets/assets/imgs/flutterlogo.svg": "55797ebf50e61c6b512989d016a86f58",
"assets/assets/imgs/gcloud1.svg": "39a2de9415fc9dd55fe33b2a13588625",
"assets/assets/config/badgeconfig.json": "721cdfdd26caa72cfc538f5c05526778",
"assets/assets/fonts/Product%2520Sans%2520Regular.ttf": "eae9c18cee82a8a1a52e654911f8fe83",
"launch_img.png": "46e7bdfaa24d4caea84bff9a2e02918e",
"canvaskit/skwasm.js": "5d4f9263ec93efeb022bb14a3881d240",
"canvaskit/skwasm.js.symbols": "c3c05bd50bdf59da8626bbe446ce65a3",
"canvaskit/canvaskit.js.symbols": "74a84c23f5ada42fe063514c587968c6",
"canvaskit/skwasm.wasm": "4051bfc27ba29bf420d17aa0c3a98bce",
"canvaskit/chromium/canvaskit.js.symbols": "ee7e331f7f5bbf5ec937737542112372",
"canvaskit/chromium/canvaskit.js": "901bb9e28fac643b7da75ecfd3339f3f",
"canvaskit/chromium/canvaskit.wasm": "399e2344480862e2dfa26f12fa5891d7",
"canvaskit/canvaskit.js": "738255d00768497e86aa4ca510cce1e1",
"canvaskit/canvaskit.wasm": "9251bb81ae8464c4df3b072f84aa969b",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
