/* ============================================================
   api/_lib/http.js — helpers compartidos por los handlers estilo Vercel.
   CommonJS, sin dependencias externas.
   - readBody: obtiene el body ya parseado (Vercel/server-local lo suelen
     poblar en req.body) o lo parsea desde el stream si no vino poblado.
   - getQuery: obtiene el query ya parseado (req.query) o lo arma desde req.url.
   ============================================================ */
'use strict';

function readBody(req) {
  return new Promise(function (resolve, reject) {
    if (req.body !== undefined && req.body !== null) {
      if (typeof req.body === 'string') {
        var trimmed = req.body.trim();
        if (trimmed === '') return resolve({});
        try { return resolve(JSON.parse(trimmed)); }
        catch (e) { return reject(e); }
      }
      if (Buffer.isBuffer(req.body)) {
        var raw = req.body.toString('utf8').trim();
        if (raw === '') return resolve({});
        try { return resolve(JSON.parse(raw)); }
        catch (e) { return reject(e); }
      }
      return resolve(req.body); // ya es un objeto parseado
    }
    var chunks = [];
    req.on('data', function (c) { chunks.push(c); });
    req.on('end', function () {
      var text = Buffer.concat(chunks).toString('utf8').trim();
      if (text === '') return resolve({});
      try { resolve(JSON.parse(text)); }
      catch (e) { reject(e); }
    });
    req.on('error', function (e) { reject(e); });
  });
}

function getQuery(req) {
  if (req.query && typeof req.query === 'object') return req.query;
  var out = {};
  try {
    var u = new URL(req.url, 'http://localhost');
    u.searchParams.forEach(function (v, k) { out[k] = v; });
  } catch (e) { /* noop */ }
  return out;
}

module.exports = { readBody: readBody, getQuery: getQuery };
