/* ============================================================
   flow.js — Pegamento mínimo para las pantallas "bundle".
   ------------------------------------------------------------
   Antes esta capa raspaba el DOM para inyectar/editar beneficios
   (heurística frágil, origen de BUG-001 y BUG-004). Ese trabajo
   ahora lo hace cada pantalla de forma nativa: sus componentes
   DCLogic leen el estado desde `store.js` (window.CAC), única
   fuente de verdad, y cablean Agregar/Modificar/Borrar/Guardar.

   Lo único que queda aquí es una redirección que el bundle de
   `qr-validacion.html` no resuelve por sí mismo: el botón
   "Volver al Portal" (su handler DC sólo reinicia la pantalla).
   ============================================================ */
(function () {
  'use strict';

  var file = (location.pathname.split('/').pop() || '').toLowerCase();
  if (file.indexOf('qr-validacion') !== 0) return;

  function norm(s) { return (s || '').replace(/\s+/g, ' ').trim(); }

  document.addEventListener('click', function (e) {
    try {
      for (var el = e.target; el && el !== document.body; el = el.parentElement) {
        if (el.tagName === 'BUTTON') {
          if (/^Volver al Portal/i.test(norm(el.textContent))) {
            e.preventDefault();
            window.location.href = 'menu-afiliado.html';
          }
          return;
        }
      }
    } catch (err) { /* defensivo: nunca romper la pantalla */ }
  }, true);
})();
