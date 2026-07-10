/* POST /api/sesion — LoginColegiadoRequest | LoginAfiliadoRequest -> SesionDTO */
'use strict';
var data = require('./_lib/data');
var httpLib = require('./_lib/http');

module.exports = function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ codigo: 'METODO_NO_PERMITIDO', mensaje: 'Método no permitido.' });
  }
  return httpLib.readBody(req).then(function (body) {
    var result = data.authenticate(body);
    if (!result.ok) return res.status(result.status).json(result.error);
    return res.status(200).json(result.dto);
  }).catch(function () {
    return res.status(400).json({ codigo: 'BODY_INVALIDO', mensaje: 'JSON inválido en el cuerpo de la petición.' });
  });
};
