var CACHE_VERSION = 'v1';

var CACHE_FILE_LIST = [
  './',
  './index.html',
  './vendor/style.css',
  './vendor/app.js',
  './vendor/vue.js',
  './vendor/welcome.jpg',
  './vendor/404.jpg',
  './api/default.json'  
];

this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache) {
      return cache.addAll(CACHE_FILE_LIST);
    })
  );
});

this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (resp) {
          return resp || requestBackend(event)
      })
  );
});

this.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_VERSION];
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );

});

function requestBackend(event) {  // 请求备份操作
  var url = event.request.clone();
  return fetch(url)
    .then(function(res) { // 请求线上资源
      //if not a valid response send the error
      if (!res || res.status !== 200 || res.type !== 'basic') {
        return res;
      }
      var response = res.clone();
      caches.open(CACHE_VERSION).then(function(cache) { // 缓存从线上获取的资源
        cache.put(event.request, response);
      });
      return res;
    })
    .catch(function () {
      return caches.match('/vendor/404.jpg');
    });
}
