/* ============================================================
   server-local.js — servidor de desarrollo/QA sin dependencias externas.
   Sirve los estáticos del prototipo (html/css/js/assets) y monta los
   MISMOS handlers de api/ (adaptador req/res mínimo: query parseada,
   body JSON, res.status().json()). Puerto: process.env.PORT || 3000.
   ============================================================ */
'use strict';

var http = require('http');
var fs = require('fs');
var path = require('path');

var ROOT = __dirname;
var PORT = process.env.PORT || 3000;

var MIME = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

/* Rutas de API -> handlers estilo Vercel (module.exports = (req,res)=>{...}) */
var ROUTES = {
  '/api/sesion': require('./api/sesion'),
  '/api/catalogo': require('./api/catalogo'),
  '/api/beneficios': require('./api/beneficios'),
  '/api/validaciones/canje': require('./api/validaciones'),
  '/api/estadisticas': require('./api/estadisticas')
};

/* Adapta res a la sugar API de Vercel (res.status(code).json(obj)/.send(x)) */
function augmentResponse(res) {
  res.status = function (code) { res.statusCode = code; return res; };
  res.json = function (obj) {
    var body = JSON.stringify(obj === undefined ? null : obj);
    if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(body);
    return res;
  };
  res.send = function (data) {
    if (data && typeof data === 'object') return res.json(data);
    res.end(data === undefined ? '' : String(data));
    return res;
  };
  return res;
}

/* Lee y parsea el body crudo para métodos que pueden llevarlo. Deja el
   trabajo fino (validación/segundo intento) al helper compartido de
   api/_lib/http.js dentro de cada handler. */
function readRawBody(req) {
  return new Promise(function (resolve) {
    if (req.method === 'GET' || req.method === 'HEAD') return resolve(undefined);
    var chunks = [];
    req.on('data', function (c) { chunks.push(c); });
    req.on('end', function () {
      var raw = Buffer.concat(chunks).toString('utf8').trim();
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); }
      catch (e) { resolve(raw); } // crudo: el handler decide (400 si no parsea)
    });
    req.on('error', function () { resolve({}); });
  });
}

function safeJoin(root, urlPath) {
  var decoded = decodeURIComponent(urlPath.split('?')[0]);
  var normalized = path.normalize(decoded).replace(/^([.]{2}[/\\])+/, '');
  var full = path.join(root, normalized);
  if (full.indexOf(root) !== 0) return null; // evita path traversal
  return full;
}

function serveStatic(req, res, pathname) {
  var targetPath = pathname === '/' ? '/index.html' : pathname;
  var filePath = safeJoin(path.join(ROOT, 'frontend'), targetPath);
  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    filePath = safeJoin(ROOT, targetPath);
  }
  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('Not found: ' + pathname);
  }
  var ext = path.extname(filePath).toLowerCase();
  res.statusCode = 200;
  res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
  fs.createReadStream(filePath).pipe(res);
}

var server = http.createServer(function (req, res) {
  var pathname = '/';
  try { pathname = new URL(req.url, 'http://localhost').pathname; } catch (e) { /* noop */ }

  augmentResponse(res);

  var handler = ROUTES[pathname];
  if (handler) {
    // Query parseada
    req.query = {};
    try {
      var u = new URL(req.url, 'http://localhost');
      u.searchParams.forEach(function (v, k) { req.query[k] = v; });
    } catch (e) { /* noop */ }

    readRawBody(req).then(function (body) {
      req.body = body;
      try {
        var maybePromise = handler(req, res);
        if (maybePromise && typeof maybePromise.catch === 'function') {
          maybePromise.catch(function (err) {
            if (!res.writableEnded) res.status(500).json({ codigo: 'ERROR_INTERNO', mensaje: String((err && err.message) || err) });
          });
        }
      } catch (err) {
        if (!res.writableEnded) res.status(500).json({ codigo: 'ERROR_INTERNO', mensaje: String((err && err.message) || err) });
      }
    });
    return;
  }

  if (pathname.indexOf('/api/') === 0) {
    res.status(404).json({ codigo: 'RUTA_NO_ENCONTRADA', mensaje: 'Endpoint no encontrado: ' + pathname });
    return;
  }

  serveStatic(req, res, pathname);
});

server.listen(PORT, function () {
  console.log('demo2-vercel local server escuchando en http://localhost:' + PORT);
});

module.exports = server;
