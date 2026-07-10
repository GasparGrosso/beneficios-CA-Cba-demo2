/* GET /api/estadisticas -> EstadisticasDTO { beneficiosActivos, porBeneficio } */
'use strict';
var data = require('./_lib/data');

module.exports = function (req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ codigo: 'METODO_NO_PERMITIDO', mensaje: 'Método no permitido.' });
  }
  return res.status(200).json(data.buildEstadisticas());
};
