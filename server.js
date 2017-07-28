var http = require('http');
var url = require('url');
var serveStatic = require('serve-static');
var finalhandler = require('finalhandler');
var serve = serveStatic('public/', {
  'index': ['index.html', 'index.htm']
});

const server = http.createServer((req, res) => {
  serve(req, res, finalhandler(req, res));
});

server.listen(8080, '127.0.0.1', () => {
  console.log('listen...');
});