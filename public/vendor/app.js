if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', { scope: './' }).then(function(reg) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}

fetch('./api/default.json')
  .then(function (res) {
    res.json().then(function(data) {
      var vm = new Vue({
        template: '#template',
        data: data
      });
      vm.$mount('#app');
    })
  })

function loadHotLinkImg (url, callback) {
  var iframe = document.querySelector('#my-iframe');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }
  var fetch = iframe.contentWindow.fetch;

  var img = iframe.contentWindow.document.createElement('img');
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = url;
  img.onload = function (event) {
    callback(getBase64Image(img));
  };
}

function getBase64Image (img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/jpeg");
    return dataURL;
}