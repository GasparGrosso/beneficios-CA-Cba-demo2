/* GET /api/beneficios?tipo=&regional=  -> BeneficioDTO[]
   POST /api/beneficios (BeneficioDTO parcial) -> BeneficioDTO normalizado
   DELETE /api/beneficios?id= -> 204
   Overlay en memoria (module-scope), best-effort (ver _lib/data.js). */
'use strict';
var data = require('./_lib/data');
var httpLib = require('./_lib/http');

module.exports = function (req, res) {
  if (req.method === 'GET') {
    var q = httpLib.getQuery(req);
    var tipo = q.tipo || undefined;
    var regional = q.regional || undefined;
    var list = data.allBenefits(tipo);
    if (regional) list = list.filter(function (b) { return b.regional === regional; });
    return res.status(200).json(list);
  }

  if (req.method === 'POST') {
    return httpLib.readBody(req).then(function (body) {
      var nb = data.addOrUpdateBenefit(body);
      return res.status(200).json(nb);
    }).catch(function () {
      return res.status(400).json({ codigo: 'BODY_INVALIDO', mensaje: 'JSON inválido en el cuerpo de la petición.' });
    });
  }

  if (req.method === 'DELETE') {
    var q2 = httpLib.getQuery(req);
    var id = q2.id;
    if (!id) {
      return res.status(400).json({ codigo: 'ID_REQUERIDO', mensaje: 'Falta el parámetro id.' });
    }
    data.deleteBenefit(id);
    res.status(204);
    return res.end();
  }

  return res.status(405).json({ codigo: 'METODO_NO_PERMITIDO', mensaje: 'Método no permitido.' });
};
