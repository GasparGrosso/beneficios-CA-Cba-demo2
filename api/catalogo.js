/* GET /api/catalogo?regional=&rol= -> CatalogoDTO { beneficios, eventos, regionales } */
'use strict';
var data = require('./_lib/data');
var httpLib = require('./_lib/http');

module.exports = function (req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ codigo: 'METODO_NO_PERMITIDO', mensaje: 'Método no permitido.' });
  }
  var q = httpLib.getQuery(req);
  var regional = q.regional || '';
  var rol = q.rol || '';

  var beneficios = data.allBenefits();
  beneficios = data.filterByRbac(beneficios, rol, regional);

  var dto = {
    beneficios: beneficios,
    eventos: data.EVENTS,
    regionales: data.REGIONALES
  };
  return res.status(200).json(dto);
};
