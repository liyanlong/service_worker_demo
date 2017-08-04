var CACHE_VERSION = '20170804v1';

// 存储到 浏览器的 cache storage
var CACHE_FILE_LIST = [
  './',
  './index.html',
  './vendor/style.css',
  './vendor/app.js',
  './vendor/vue.js',
  './vendor/welcome.jpg',
  './vendor/404.jpg'
];

this.addEventListener('install', function(event) {

  // 注册缓存资源
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache) {
      return cache.addAll(CACHE_FILE_LIST);
    })
  );
});

// 只监听 scope 目录下的资源
this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (resp) {
          return resp || requestBackend(event)
      })
  );
});

// 激活状态
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

// 请求备份操作
function requestBackend(event) {  
  var req = event.request.clone();
  return fetch(req)
    .then(function(res) { // 请求线上资源
      //if not a valid response send the error
      if (!res || res.status !== 200 || res.type !== 'basic') {
        return res;
      }
      // 缓存从线上获取的资源
      var response = res.clone();
      caches.open(CACHE_VERSION).then(function(cache) { 
        cache.put(event.request, response);
      });
      return res;
    })
    .catch(function () {
      // 找不到资源 用 404图片 代替
      return caches.match('/vendor/404.jpg');
    });
}
