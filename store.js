/* ============================================================
   store.js — Estado compartido del prototipo (localStorage) + datos mock
   Cargado por TODAS las páginas (autoría + bundles vía flow.js).
   Expone window.CAC. Sin dependencias.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Datos mock (fuente única de verdad) ---------- */
  var EVENTS = [
    { id: 'e1', title: 'Visitá Casa FOA',        subtitle: 'Solicitá entrada gratuita vía tu regional', date: 'Hasta 30 jun',      tag: 'Cultura',       tagBg: '#E05A36', img: 'assets/evento-gala40.png' },
    { id: 'e2', title: 'Gala 40 Años C.A.C.',    subtitle: 'Transmisión en vivo · YouTube',             date: '25 mar · 19:30 hs', tag: 'Institucional', tagBg: '#0F172A', img: 'assets/evento-casafoa.png' },
    { id: 'e3', title: 'Workshop BIM Avanzado',  subtitle: 'Online · Certificación oficial CPAU',       date: '12 jul · 9:00 hs',  tag: 'Formación',     tagBg: '#10B981', img: null },
  ];

  // Regionales = subdivisiones internas de la provincia de Córdoba (§3). Los
  // nombres de otras provincias eran placeholders; se reemplazan por regionales
  // reales de Córdoba. `Provincial` cubre toda la provincia.
  var COMERCIALES = [
    { id:'c1', logo:'EP', color:'#3B82F6', nombre:'El Plano · Librería Técnica',  cat:'Papelería & Técnica',        desc:20, regional:'Regional 1', tipo:'comercial', uses:84 },
    { id:'c2', logo:'CM', color:'#8B5CF6', nombre:'Casa Central Materiales',       cat:'Materiales de Construcción',  desc:15, regional:'Regional 2', tipo:'comercial', uses:61 },
    { id:'c3', logo:'SR', color:'#E05A36', nombre:'Studio Render Pro',             cat:'Software & Visualización 3D', desc:30, regional:'Provincial', tipo:'comercial', uses:45 },
    { id:'c4', logo:'FO', color:'#F59E0B', nombre:'Ferretería Obra Plus',          cat:'Herramientas Profesionales',  desc:10, regional:'Regional 3', tipo:'comercial', uses:39 },
    { id:'c5', logo:'PI', color:'#10B981', nombre:'Ploteo & Impresión Digital',    cat:'Planos e Impresión Técnica',  desc:25, regional:'Regional 1', tipo:'comercial', uses:33 },
    { id:'c6', logo:'MD', color:'#06B6D4', nombre:'Mobiliario Diseño Urbano',      cat:'Mobiliario & Decoración',     desc:18, regional:'Regional 4', tipo:'comercial', uses:27 },
    { id:'c7', logo:'CS', color:'#0F172A', nombre:'CAD & BIM Soluciones',          cat:'Licencias Software BIM',      desc:40, regional:'Provincial', tipo:'comercial', uses:22 },
    { id:'c8', logo:'LS', color:'#EC4899', nombre:'Librería Técnica Sur',          cat:'Libros & Revistas',           desc:15, regional:'Regional 5', tipo:'comercial', uses:17 },
    { id:'c9', logo:'LS', color:'#EC4899', nombre:'Librería Técnica Sur',          cat:'Planos e Impresión Técnica',  desc:50, descLabel:'2x1', regional:'Regional 5', tipo:'comercial', uses:9 },
  ];

  var ACADEMICOS = [
    { id:'a1', logo:'UN', color:'#3B82F6', nombre:'UNC · Fac. de Arquitectura', cat:'Posgrado & Especialización', desc:50, regional:'Regional 1', tipo:'academico', uses:52 },
    { id:'a2', logo:'FA', color:'#8B5CF6', nombre:'FADU · UBA',                 cat:'Diseño Sustentable',         desc:30, regional:'Regional 4', tipo:'academico', uses:40 },
    { id:'a3', logo:'CP', color:'#10B981', nombre:'CPAU · Cursos Online',       cat:'Capacitación Profesional',   desc:25, regional:'Provincial', tipo:'academico', uses:31 },
    { id:'a4', logo:'UA', color:'#F59E0B', nombre:'Universidad Austral',        cat:'Management en Obras',        desc:20, regional:'Regional 2', tipo:'academico', uses:24 },
    { id:'a5', logo:'IS', color:'#EC4899', nombre:'ISU · Urbanismo',            cat:'Planificación & Urbanismo',  desc:35, regional:'Regional 3', tipo:'academico', uses:18 },
    { id:'a6', logo:'PH', color:'#E05A36', nombre:'Patrimonio Histórico',      cat:'Conservación Patrimonial',   desc:40, regional:'Regional 5', tipo:'academico', uses:12 },
  ];

  var CITIES = ['Todas', 'Regional 1', 'Regional 2', 'Regional 3', 'Regional 4', 'Regional 5', 'Provincial'];

  var PALETTE = ['#3B82F6', '#8B5CF6', '#E05A36', '#F59E0B', '#10B981', '#06B6D4', '#EC4899', '#0F172A'];

  /* ---------- localStorage seguro ---------- */
  var K_EXTRA   = 'cac_extra_benefits';
  var K_EDIT    = 'cac_edit_benefit';
  var K_DELETED = 'cac_deleted_benefits';   // ids dados de baja (base o extra)

  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch (e) { return false; }
  }

  /* ---------- Helpers de mock ---------- */
  function initialsOf(name) {
    if (!name) return 'CA';
    var words = String(name).replace(/[·|-].*$/, '').trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return 'CA';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  function colorFor(name) {
    var h = 0, s = String(name || '');
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return PALETTE[h % PALETTE.length];
  }

  /* Normaliza un beneficio (completa con mocks lo que falte). */
  function normalize(b) {
    b = b || {};
    var nombre = b.nombre || b.name || 'Beneficio sin nombre';
    var tipo = (b.tipo === 'academico') ? 'academico' : 'comercial';
    var desc = (typeof b.desc === 'number') ? b.desc
             : (parseInt(b.desc, 10) || (tipo === 'academico' ? 20 : 15));
    return {
      id: b.id || ('x' + Date.now() + Math.floor(Math.random() * 1000)),
      tipo: tipo,
      logo: b.logo || initialsOf(nombre),
      color: b.color || colorFor(nombre),
      nombre: nombre,
      cat: b.cat || (tipo === 'academico' ? 'Formación & Capacitación' : 'Comercio Adherido'),
      desc: desc,
      descLabel: b.descLabel || (desc + '% OFF'),
      descripcion: b.descripcion || '',
      regional: b.regional || 'Regional 1',
      cooldown: b.cooldown || '',
      uses: (typeof b.uses === 'number') ? b.uses : Math.floor(20 + Math.random() * 180),
      nuevo: true
    };
  }

  /* ---------- Hidratación desde la API mock (best-effort, con fallback) ----------
     XHR síncrono same-origin a GET /api/catalogo antes de que cualquier página lea
     window.CAC. Si responde 200, reemplaza el contenido de EVENTS/COMERCIALES/
     ACADEMICOS/CITIES IN PLACE (splice+push, sin romper referencias). Si falla
     (sin API, CORS, timeout, archivo estático, etc.) quedan los mocks embebidos. */

  // Normaliza un item de catálogo SIN forzar `nuevo:true` (eso es solo para altas
  // reales vía addOrUpdateExtra); respeta el `nuevo` que venga en el DTO o false.
  function normalizeCatalogItem(b) {
    var nb = normalize(b);
    nb.nuevo = !!(b && b.nuevo === true);
    return nb;
  }

  function sessionInfo() {
    try {
      var s = JSON.parse(localStorage.getItem('cac_session') || 'null');
      return (s && typeof s === 'object') ? s : {};
    } catch (e) { return {}; }
  }

  function replaceArrayInPlace(arr, next) {
    if (!Array.isArray(arr) || !Array.isArray(next)) return;
    arr.splice(0, arr.length);
    for (var i = 0; i < next.length; i++) arr.push(next[i]);
  }

  // Devuelve true/false según haya podido hidratar desde la API.
  function hydrateFromApi() {
    try {
      var sesion = sessionInfo();
      var qs = [];
      if (sesion.regional) qs.push('regional=' + encodeURIComponent(sesion.regional));
      if (sesion.rol)      qs.push('rol=' + encodeURIComponent(sesion.rol));
      var url = '/api/catalogo' + (qs.length ? ('?' + qs.join('&')) : '');

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false); // síncrono: debe completar antes de que las páginas lean CAC
      try { xhr.timeout = 1500; } catch (e) { /* timeout no aplica a XHR síncrono en algunos navegadores */ }
      xhr.send(null);

      if (xhr.status !== 200 || !xhr.responseText) return false;
      var dto = JSON.parse(xhr.responseText);
      if (!dto || typeof dto !== 'object') return false;

      var didHydrate = false;
      if (Array.isArray(dto.beneficios)) {
        var comerciales = [], academicos = [];
        dto.beneficios.forEach(function (b) {
          var nb = normalizeCatalogItem(b);
          if (nb.tipo === 'academico') academicos.push(nb); else comerciales.push(nb);
        });
        replaceArrayInPlace(COMERCIALES, comerciales);
        replaceArrayInPlace(ACADEMICOS, academicos);
        didHydrate = true;
      }
      if (Array.isArray(dto.eventos)) {
        replaceArrayInPlace(EVENTS, dto.eventos);
      }
      if (Array.isArray(dto.regionales) && dto.regionales.length) {
        replaceArrayInPlace(CITIES, ['Todas'].concat(dto.regionales));
      }
      return didHydrate;
    } catch (e) {
      return false; // fallback: quedan los mocks embebidos
    }
  }

  /* ---------- Sync best-effort de mutaciones hacia la API (fire-and-forget) ----------
     No cambia el comportamiento existente basado en localStorage (INV-4/INV-5 intactos);
     solo intenta reflejar la mutación en la API mock, sin bloquear ni depender del éxito. */
  function syncUpsertToApi(b) {
    try {
      var payload = JSON.stringify(b);
      if (typeof fetch === 'function') {
        fetch('/api/beneficios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        }).catch(function () {});
      } else if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/beneficios', new Blob([payload], { type: 'application/json' }));
      }
    } catch (e) { /* best-effort: se ignora */ }
  }
  function syncDeleteToApi(id) {
    try {
      var url = '/api/beneficios?id=' + encodeURIComponent(id);
      if (typeof fetch === 'function') {
        fetch(url, { method: 'DELETE', keepalive: true }).catch(function () {});
      }
      // sendBeacon no soporta DELETE; sin fetch no hay sync de borrado (best-effort).
    } catch (e) { /* best-effort: se ignora */ }
  }

  /* ---------- Helpers de presentación (derivados del esquema §3) ---------- */
  // Etiqueta de descuento: soporta % OFF y promos NxM (2x1 / 3x2). Nunca "NaN%".
  function discountText(b) {
    b = b || {};
    if (b.descLabel && !/%/.test(b.descLabel)) return String(b.descLabel).replace(/\s*OFF\s*$/i, '');
    if (typeof b.desc === 'number') return b.desc + '%';
    var n = parseInt(b.desc, 10);
    return isNaN(n) ? '—' : n + '%';
  }
  // Usos por período derivados de un único `uses` (mock determinista y estable).
  function deriveUsages(uses) {
    uses = (typeof uses === 'number' && uses >= 0) ? uses : 0;
    return {
      semanal: Math.max(1, Math.round(uses * 0.22)),
      mensual: uses,
      anual:   uses * 12,
    };
  }
  // Tendencia mock determinista (misma entrada → misma salida).
  function deriveTrend(b, period) {
    var s = String((b && b.id) || '') + '|' + (period || '');
    var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    var arr = ['+12%', '+8%', '+5%', '+3%', '+15%', '+1%', '-2%', '+6%', '+9%', '+4%'];
    return arr[h % arr.length];
  }

  /* ---------- Baja (global y persistente) ---------- */
  function getDeleted() {
    var arr = read(K_DELETED, []);
    return Array.isArray(arr) ? arr.map(String) : [];
  }
  function isDeleted(id) { return getDeleted().indexOf(String(id)) >= 0; }
  // Da de baja un beneficio en todo el sistema: lo quita de extras (si estaba)
  // y registra su id como borrado para ocultar también los beneficios base.
  function removeBenefit(id) {
    if (!id) return false;
    var sid = String(id);
    var extra = read(K_EXTRA, []); if (!Array.isArray(extra)) extra = [];
    write(K_EXTRA, extra.filter(function (b) { return String(b.id) !== sid; }));
    var del = getDeleted();
    if (del.indexOf(sid) < 0) { del.push(sid); write(K_DELETED, del); }
    syncDeleteToApi(sid);
    return true;
  }

  /* ---------- API pública ---------- */
  function getExtra(tipo) {
    var arr = read(K_EXTRA, []);
    if (!Array.isArray(arr)) arr = [];
    var del = getDeleted();
    arr = arr.filter(function (b) { return del.indexOf(String(b.id)) < 0; });
    return tipo ? arr.filter(function (b) { return b.tipo === tipo; }) : arr;
  }
  function addOrUpdateExtra(b) {
    var nb = normalize(b);
    var arr = read(K_EXTRA, []);
    if (!Array.isArray(arr)) arr = [];
    var i = arr.findIndex(function (x) { return x.id === nb.id; });
    if (i >= 0) arr[i] = nb; else arr.push(nb);
    write(K_EXTRA, arr);
    syncUpsertToApi(nb);
    return nb;
  }
  function baseFor(tipo) { return tipo === 'academico' ? ACADEMICOS : COMERCIALES; }
  // Un extra con el mismo id que un beneficio base lo REEMPLAZA (edición en su
  // lugar), no lo duplica → editar nunca aumenta el conteo (INV-2, INV-3).
  function allBenefits(tipo) {
    var del = getDeleted();
    var extras = getExtra(tipo);
    var over = {};
    extras.forEach(function (b) { over[String(b.id)] = true; });
    var base = baseFor(tipo).filter(function (b) {
      var id = String(b.id);
      return del.indexOf(id) < 0 && !over[id];
    });
    return base.concat(extras);
  }

  function findBenefitById(id) {
    if (!id || isDeleted(id)) return null;
    var sid = String(id);
    var extras = getExtra();               // el override (edición) tiene prioridad
    for (var i = 0; i < extras.length; i++) if (String(extras[i].id) === sid) return extras[i];
    var base = COMERCIALES.concat(ACADEMICOS);
    for (var j = 0; j < base.length; j++) if (String(base[j].id) === sid) return base[j];
    return null;
  }
  function findEventById(id) {
    for (var i = 0; i < EVENTS.length; i++) if (String(EVENTS[i].id) === String(id)) return EVENTS[i];
    return null;
  }

  function getEdit()  { return read(K_EDIT, null); }
  function setEdit(b) { return write(K_EDIT, b || null); }
  function clearEdit(){ try { localStorage.removeItem(K_EDIT); } catch (e) {} }

  function qp(name) {
    try { return new URLSearchParams(window.location.search).get(name); }
    catch (e) { return null; }
  }

  // Hidratación automática al cargar CUALQUIER página, antes de exponer window.CAC.
  var HYDRATED = hydrateFromApi();

  window.CAC = {
    EVENTS: EVENTS, COMERCIALES: COMERCIALES, ACADEMICOS: ACADEMICOS, CITIES: CITIES,
    getExtra: getExtra, allBenefits: allBenefits, addOrUpdateExtra: addOrUpdateExtra,
    removeBenefit: removeBenefit, isDeleted: isDeleted, getDeleted: getDeleted,
    findBenefitById: findBenefitById, findEventById: findEventById,
    getEdit: getEdit, setEdit: setEdit, clearEdit: clearEdit,
    initialsOf: initialsOf, colorFor: colorFor, normalize: normalize, qp: qp,
    discountText: discountText, deriveUsages: deriveUsages, deriveTrend: deriveTrend,
    hydrated: HYDRATED
  };
})();
