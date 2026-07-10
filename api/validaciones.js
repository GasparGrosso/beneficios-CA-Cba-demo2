/* POST /api/validaciones/canje  { beneficioId, matricula } -> ResultadoValidacionDTO
   Simula cooldown antiabuso en memoria (module-scope, best-effort). */
'use strict';
var data = require('./_lib/data');
var httpLib = require('./_lib/http');

module.exports = function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ codigo: 'METODO_NO_PERMITIDO', mensaje: 'Método no permitido.' });
  }
  return httpLib.readBody(req).then(function (body) {
    body = body || {};
    var beneficioId = body.beneficioId;
    var matricula = body.matricula;
    if (!beneficioId || !matricula) {
      return res.status(400).json({ codigo: 'CAMPOS_FALTANTES', mensaje: 'Faltan beneficioId y/o matricula.' });
    }
    var result = data.registrarCanje(beneficioId, matricula);
    if (!result.ok) return res.status(result.status).json(result.error);
    return res.status(200).json(result.dto);
  }).catch(function () {
    return res.status(400).json({ codigo: 'BODY_INVALIDO', mensaje: 'JSON inválido en el cuerpo de la petición.' });
  });
};
