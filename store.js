/* ============================================================
   store.js — Estado compartido del prototipo (localStorage) + datos mock
   Cargado por TODAS las páginas (autoría + bundles vía flow.js).
   Expone window.CAC. Sin dependencias.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Datos mock (fuente única de verdad) ---------- */
  /* Eventos (ADR-0009: doble origen). `origen` = 'api' (llegó por Autogestión) o
     'manual' (cargado por personal del Colegio en el panel). `inicio`/`fin` son
     fecha-hora local ISO (sin zona); `tag`, `tagBg` y `date` se derivan en
     normalizeEvent() a partir de `categoria` e `inicio`. */
  var EVENTS = [
    { id: 'e1', title: 'Visitá Casa FOA',               subtitle: 'Solicitá entrada gratuita vía tu regional', categoria: 'Cultura',       inicio: '2026-09-25T10:00', fin: '2026-09-25T18:00', descripcion: 'Muestra de arquitectura, diseño e interiorismo. Entrada sin cargo para matriculados gestionada a través de tu regional.', urlInscripcion: '', urlEntrada: 'https://autogestion.colegio-arquitectos.com.ar/entradas/casa-foa', img: 'assets/evento-gala40.png', origen: 'api',    regional: 'Provincial' },
    { id: 'e2', title: 'Gala 40 Años C.A.C.',           subtitle: 'Teatro del Libertador · Córdoba',           categoria: 'Institucional', inicio: '2026-10-09T20:00', fin: '2026-10-09T23:30', descripcion: 'Celebración por los 40 años del Colegio. Transmisión en vivo por YouTube para quienes no puedan asistir.', urlInscripcion: 'https://autogestion.colegio-arquitectos.com.ar/inscripcion/gala-40', urlEntrada: 'https://autogestion.colegio-arquitectos.com.ar/entradas/gala-40', img: 'assets/evento-casafoa.png', origen: 'api', regional: 'Provincial' },
    { id: 'e3', title: 'Workshop BIM Avanzado',         subtitle: 'Online · Certificación oficial CPAU',       categoria: 'Formación',     inicio: '2026-09-22T09:00', fin: '2026-09-22T13:00', descripcion: 'Modelado colaborativo, familias paramétricas y coordinación de disciplinas. Cupo limitado, con certificación.', urlInscripcion: 'https://autogestion.colegio-arquitectos.com.ar/inscripcion/bim-avanzado', urlEntrada: '', img: null, origen: 'api', regional: 'Provincial' },
    { id: 'e4', title: 'Bienal Sostenible 2026',        subtitle: 'Pabellón Argentina · Córdoba',              categoria: 'Cultura',       inicio: '2026-10-02T09:00', fin: '2026-10-04T19:00', descripcion: 'Tres jornadas de charlas, muestra de proyectos y recorridos por obras con criterios de sostenibilidad.', urlInscripcion: 'https://bienalsostenible.org/inscripcion', urlEntrada: '', img: null, origen: 'manual', regional: 'Regional 1' },
    { id: 'e5', title: 'Taller de Cómputo y Presupuesto', subtitle: 'Sede Regional 5 · Laprida 40',            categoria: 'Formación',     inicio: '2026-09-29T18:00', fin: '2026-09-29T21:00', descripcion: 'Taller práctico de cómputo métrico y armado de presupuestos de obra. Traer notebook.', urlInscripcion: '', urlEntrada: '', img: null, origen: 'manual', regional: 'Regional 5' },
  ];

  /* Categorías de evento y su color de etiqueta: paleta CAPC (naranja principal +
     secundaria). Se excluyen verde y amarillo porque la etiqueta lleva texto blanco. */
  var CATEGORIAS_EVENTO = [
    { nombre: 'Cultura',        color: '#E9500E' },
    { nombre: 'Formación',      color: '#5B93CE' },
    { nombre: 'Institucional',  color: '#1D3354' },
    { nombre: 'Concurso',       color: '#B472AD' },
    { nombre: 'Visita de obra', color: '#E8376F' },
  ];

  // Regionales = subdivisiones internas de la provincia de Córdoba (§3). Los
  // nombres de otras provincias eran placeholders; se reemplazan por regionales
  // reales de Córdoba. `Provincial` cubre toda la provincia.
  var COMERCIALES = [
    { id:'c1', logo:'EP', color:'#5B93CE', nombre:'El Plano · Librería Técnica',  cat:'Papelería & Técnica',        desc:20, regional:'Regional 1', tipo:'comercial', uses:84 },
    { id:'c2', logo:'CM', color:'#B472AD', nombre:'Casa Central Materiales',       cat:'Materiales de Construcción',  desc:15, regional:'Regional 2', tipo:'comercial', uses:61 },
    { id:'c3', logo:'SR', color:'#E9500E', nombre:'Studio Render Pro',             cat:'Software & Visualización 3D', desc:30, regional:'Provincial', tipo:'comercial', uses:45 },
    { id:'c4', logo:'FO', color:'#1D3354', nombre:'Ferretería Obra Plus',          cat:'Herramientas Profesionales',  desc:10, regional:'Regional 3', tipo:'comercial', uses:39 },
    { id:'c5', logo:'PI', color:'#E8376F', nombre:'Ploteo & Impresión Digital',    cat:'Planos e Impresión Técnica',  desc:25, regional:'Regional 1', tipo:'comercial', uses:33 },
    { id:'c6', logo:'MD', color:'#5B93CE', nombre:'Mobiliario Diseño Urbano',      cat:'Mobiliario & Decoración',     desc:18, regional:'Regional 4', tipo:'comercial', uses:27 },
    { id:'c7', logo:'CS', color:'#161616', nombre:'CAD & BIM Soluciones',          cat:'Licencias Software BIM',      desc:40, regional:'Provincial', tipo:'comercial', uses:22 },
    { id:'c8', logo:'LS', color:'#B472AD', nombre:'Librería Técnica Sur',          cat:'Libros & Revistas',           desc:15, regional:'Regional 5', tipo:'comercial', uses:17 },
    { id:'c9', logo:'LS', color:'#B472AD', nombre:'Librería Técnica Sur',          cat:'Planos e Impresión Técnica',  desc:50, descLabel:'2x1', regional:'Regional 5', tipo:'comercial', uses:9 },
  ];

  var ACADEMICOS = [
    { id:'a1', logo:'UN', color:'#5B93CE', nombre:'UNC · Fac. de Arquitectura', cat:'Posgrado & Especialización', desc:50, regional:'Regional 1', tipo:'academico', uses:52 },
    { id:'a2', logo:'FA', color:'#B472AD', nombre:'FADU · UBA',                 cat:'Diseño Sustentable',         desc:30, regional:'Regional 4', tipo:'academico', uses:40 },
    { id:'a3', logo:'CP', color:'#E8376F', nombre:'CPAU · Cursos Online',       cat:'Capacitación Profesional',   desc:25, regional:'Provincial', tipo:'academico', uses:31 },
    { id:'a4', logo:'UA', color:'#1D3354', nombre:'Universidad Austral',        cat:'Management en Obras',        desc:20, regional:'Regional 2', tipo:'academico', uses:24 },
    { id:'a5', logo:'IS', color:'#B472AD', nombre:'ISU · Urbanismo',            cat:'Planificación & Urbanismo',  desc:35, regional:'Regional 3', tipo:'academico', uses:18 },
    { id:'a6', logo:'PH', color:'#E9500E', nombre:'Patrimonio Histórico',      cat:'Conservación Patrimonial',   desc:40, regional:'Regional 5', tipo:'academico', uses:12 },
  ];

  var CITIES = ['Todas', 'Regional 1', 'Regional 2', 'Regional 3', 'Regional 4', 'Regional 5', 'Provincial'];

  /* Color de las iniciales del comercio (mock visual): paleta CAPC con contraste para texto blanco. */
  var PALETTE = ['#5B93CE', '#B472AD', '#E9500E', '#1D3354', '#E8376F', '#161616'];

  /* ---------- localStorage seguro ---------- */
  var K_EXTRA   = 'cac_extra_benefits';
  var K_EDIT    = 'cac_edit_benefit';
  var K_DELETED = 'cac_deleted_benefits';   // ids dados de baja (base o extra)
  var K_EVENTS  = 'cac_extra_events';       // eventos cargados/editados a mano (ADR-0009)
  var K_EDIT_EV = 'cac_edit_event';         // evento en edición (precarga del formulario)
  var K_DEL_EV  = 'cac_deleted_events';     // ids de eventos manuales dados de baja
  var K_CAT_BEN = 'cac_categorias_beneficio'; // categorías de beneficio dadas de alta desde el formulario
  var K_CAT_EV  = 'cac_categorias_evento';  // categorías de evento dadas de alta desde el formulario

  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch (e) { return false; }
  }

  /* ---------- Categorías administrables (RN-07, ampliada el 18/09) ----------
     El Colegio pidió dar de alta categorías nuevas desde el panel, para beneficios
     y para eventos. Las de base quedan fijas; las nuevas se guardan en localStorage.
     Los tipos de beneficio siguen siendo dos: comercial y académico. */
  var CATEGORIAS_BENEFICIO = {
    comercial: COMERCIALES.map(function (b) { return b.cat; })
      .filter(function (c, i, a) { return c && a.indexOf(c) === i; }),
    academico: ['Convenio Universitario', 'Workshop', 'Beca', 'Curso Corto'],
  };
  var COLORES_CATEGORIA = ['#E9500E', '#5B93CE', '#1D3354', '#B472AD', '#E8376F', '#161616'];

  function slugOf(nombre) {
    return String(nombre).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'tipo';
  }
  function mismoNombre(a, b) { return slugOf(a) === slugOf(b); }

  var categoriasNuevasBen = read(K_CAT_BEN, []) || [];
  categoriasNuevasBen.forEach(function (c) {
    var lista = c && CATEGORIAS_BENEFICIO[c.tipo];
    if (lista && c.nombre && !lista.some(function (x) { return mismoNombre(x, c.nombre); })) lista.push(c.nombre);
  });
  (read(K_CAT_EV, []) || []).forEach(function (c) {
    if (c && c.nombre && !CATEGORIAS_EVENTO.some(function (x) { return mismoNombre(x.nombre, c.nombre); })) CATEGORIAS_EVENTO.push(c);
  });

  function categoriasBeneficio(tipo) {
    return (CATEGORIAS_BENEFICIO[tipo === 'academico' ? 'academico' : 'comercial']).slice();
  }
  // Devuelve el nombre de la categoría creada, o el de la existente si ya había una igual.
  function addCategoriaBeneficio(tipo, nombre) {
    tipo = tipo === 'academico' ? 'academico' : 'comercial';
    nombre = String(nombre || '').trim();
    if (!nombre) return null;
    var lista = CATEGORIAS_BENEFICIO[tipo];
    for (var i = 0; i < lista.length; i++) if (mismoNombre(lista[i], nombre)) return lista[i];
    lista.push(nombre);
    categoriasNuevasBen.push({ tipo: tipo, nombre: nombre });
    write(K_CAT_BEN, categoriasNuevasBen);
    return nombre;
  }
  function addCategoriaEvento(nombre) {
    nombre = String(nombre || '').trim();
    if (!nombre) return null;
    for (var i = 0; i < CATEGORIAS_EVENTO.length; i++) if (mismoNombre(CATEGORIAS_EVENTO[i].nombre, nombre)) return CATEGORIAS_EVENTO[i];
    var c = { nombre: nombre, color: COLORES_CATEGORIA[CATEGORIAS_EVENTO.length % COLORES_CATEGORIA.length], nueva: true };
    CATEGORIAS_EVENTO.push(c);
    write(K_CAT_EV, CATEGORIAS_EVENTO.filter(function (x) { return x.nueva; }));
    return c;
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

  /* ---------- Eventos: normalización y fechas ---------- */
  var MESES_CORTO = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  var MESES_LARGO = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  // Parsea 'YYYY-MM-DDTHH:mm' como hora local. Devuelve null si no es válido.
  function parseLocal(iso) {
    if (!iso) return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(String(iso));
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  // Etiqueta corta de fecha: '25 sep · 10:00 hs'. Si el evento dura más de un
  // día: '2 – 4 oct'. Es la que muestran las tarjetas.
  function eventDateLabel(ev) {
    var a = parseLocal(ev && ev.inicio), b = parseLocal(ev && ev.fin);
    if (!a) return (ev && ev.date) || 'Fecha a confirmar';
    var multi = b && (b.getFullYear() !== a.getFullYear() || b.getMonth() !== a.getMonth() || b.getDate() !== a.getDate());
    if (multi) {
      if (b.getMonth() === a.getMonth()) return a.getDate() + ' \u2013 ' + b.getDate() + ' ' + MESES_CORTO[a.getMonth()];
      return a.getDate() + ' ' + MESES_CORTO[a.getMonth()] + ' \u2013 ' + b.getDate() + ' ' + MESES_CORTO[b.getMonth()];
    }
    return a.getDate() + ' ' + MESES_CORTO[a.getMonth()] + ' \u00b7 ' + a.getHours() + ':' + pad2(a.getMinutes()) + ' hs';
  }
  function categoriaColor(nombre) {
    for (var i = 0; i < CATEGORIAS_EVENTO.length; i++) if (CATEGORIAS_EVENTO[i].nombre === nombre) return CATEGORIAS_EVENTO[i].color;
    return '#7A736E';
  }
  /* Normaliza un evento: completa derivados (tag, tagBg, date) y defaults. */
  function normalizeEvent(e) {
    e = e || {};
    var categoria = e.categoria || e.tag || 'Institucional';
    var ev = {
      id: e.id || ('ev' + Date.now() + Math.floor(Math.random() * 1000)),
      title: e.title || e.nombre || 'Evento sin nombre',
      subtitle: e.subtitle || '',
      categoria: categoria,
      inicio: e.inicio || '',
      fin: e.fin || '',
      descripcion: e.descripcion || '',
      urlInscripcion: e.urlInscripcion || '',
      urlEntrada: e.urlEntrada || '',
      img: e.img || null,
      origen: e.origen === 'manual' ? 'manual' : 'api',
      regional: e.regional || 'Provincial',
      tag: e.tag || categoria,
      tagBg: e.tagBg || categoriaColor(categoria),
    };
    ev.date = (e.date && !e.inicio) ? e.date : eventDateLabel(ev);
    if (!ev.subtitle) ev.subtitle = ev.descripcion ? ev.descripcion.slice(0, 48) + (ev.descripcion.length > 48 ? '\u2026' : '') : '';
    return ev;
  }
  for (var ei = 0; ei < EVENTS.length; ei++) EVENTS[ei] = normalizeEvent(EVENTS[ei]);

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
        replaceArrayInPlace(EVENTS, dto.eventos.map(normalizeEvent));
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
    // Todos los extras, no solo los de este tipo: si una edición cambió el tipo,
    // el ítem base no debe seguir apareciendo en la pestaña anterior.
    getExtra().forEach(function (b) { over[String(b.id)] = true; });
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
  /* ---------- Eventos (ADR-0009): base (API) + carga manual (localStorage) ---------- */
  function getDeletedEvents() {
    var arr = read(K_DEL_EV, []);
    return Array.isArray(arr) ? arr.map(String) : [];
  }
  function getExtraEvents() {
    var arr = read(K_EVENTS, []);
    var del = getDeletedEvents();
    return Array.isArray(arr)
      ? arr.map(normalizeEvent).filter(function (e) { return del.indexOf(String(e.id)) < 0; })
      : [];
  }
  // Un extra con el mismo id que un evento base lo REEMPLAZA (edición en su lugar).
  // Orden: por fecha de inicio ascendente; sin fecha, al final.
  function allEvents() {
    var extras = getExtraEvents(), over = {};
    extras.forEach(function (e) { over[String(e.id)] = true; });
    var del = getDeletedEvents();
    var base = EVENTS.filter(function (e) { var id = String(e.id); return !over[id] && del.indexOf(id) < 0; });
    return base.concat(extras).sort(function (a, b) {
      var da = parseLocal(a.inicio), db = parseLocal(b.inicio);
      if (!da && !db) return 0; if (!da) return 1; if (!db) return -1;
      return da - db;
    });
  }
  // Eventos cuyo fin (o inicio) es hoy o posterior: lo que ve el matriculado.
  function upcomingEvents(now) {
    var ref = now || new Date();
    var hoy = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
    return allEvents().filter(function (e) {
      var d = parseLocal(e.fin) || parseLocal(e.inicio);
      return !d || d >= hoy;
    });
  }
  function addOrUpdateEvent(e) {
    var ne = normalizeEvent(e);
    var arr = read(K_EVENTS, []);
    if (!Array.isArray(arr)) arr = [];
    var i = arr.findIndex(function (x) { return String(x.id) === String(ne.id); });
    if (i >= 0) arr[i] = ne; else arr.push(ne);
    write(K_EVENTS, arr);
    return ne;
  }
  function findEventById(id) {
    if (!id) return null;
    var sid = String(id);
    if (getDeletedEvents().indexOf(sid) >= 0) return null;
    var extras = getExtraEvents();            // la edición manual tiene prioridad
    for (var i = 0; i < extras.length; i++) if (String(extras[i].id) === sid) return extras[i];
    for (var j = 0; j < EVENTS.length; j++) if (String(EVENTS[j].id) === sid) return EVENTS[j];
    return null;
  }
  // Baja de un evento. Solo los de carga manual: los de Autogestión son de
  // solo lectura en el Portal (ADR-0011).
  function removeEvent(id) {
    var ev = findEventById(id);
    if (!ev || ev.origen !== 'manual') return false;
    var sid = String(id);
    var arr = read(K_EVENTS, []); if (!Array.isArray(arr)) arr = [];
    write(K_EVENTS, arr.filter(function (e) { return String(e.id) !== sid; }));
    var del = getDeletedEvents();
    if (del.indexOf(sid) < 0) { del.push(sid); write(K_DEL_EV, del); }
    return true;
  }
  function getEditEvent()  { return read(K_EDIT_EV, null); }
  function setEditEvent(e) { return write(K_EDIT_EV, e || null); }
  function clearEditEvent(){ try { localStorage.removeItem(K_EDIT_EV); } catch (err) {} }

  /* ---------- "Mis beneficios" del matriculado demo (mock) ----------
     Pedido del 10/09: los más usados por el matriculado, ordenados por
     frecuencia, y los que están en espera (cooldown) con cuenta regresiva.
     Los tiempos de espera se expresan en minutos desde la carga de la página. */
  var MIS_USOS   = { c7: 12, c1: 9, c5: 7, c3: 5 };
  var MIS_ESPERA = { c2: 3 * 1440 + 7 * 60 + 42, c4: 19 * 60 + 15, a1: 11 * 1440 + 2 * 60 };
  // Eventos para los que el matriculado demo ya tiene entrada (la emite Autogestión;
  // el Portal solo la muestra, RN-13). Orden: por fecha del evento.
  var MIS_ENTRADAS = ['e1', 'e3', 'e2'];
  var LOAD_TIME  = Date.now();
  function myBenefits() {
    var todos = allBenefits('comercial').concat(allBenefits('academico'));
    var top = [], espera = [];
    todos.forEach(function (b) {
      var id = String(b.id);
      if (MIS_USOS[id] != null)   top.push(Object.assign({}, b, { usos: MIS_USOS[id] }));
      if (MIS_ESPERA[id] != null) espera.push(Object.assign({}, b, { hasta: LOAD_TIME + MIS_ESPERA[id] * 60000 }));
    });
    top.sort(function (a, b) { return b.usos - a.usos; });
    espera.sort(function (a, b) { return a.hasta - b.hasta; });
    return { top: top, espera: espera };
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

  function myTickets() {
    var ids = {};
    MIS_ENTRADAS.forEach(function (id) { ids[String(id)] = true; });
    return allEvents().filter(function (e) { return ids[String(e.id)]; });
  }

  window.CAC = {
    EVENTS: EVENTS, COMERCIALES: COMERCIALES, ACADEMICOS: ACADEMICOS, CITIES: CITIES,
    CATEGORIAS_EVENTO: CATEGORIAS_EVENTO, MESES_LARGO: MESES_LARGO,
    categoriasBeneficio: categoriasBeneficio, addCategoriaBeneficio: addCategoriaBeneficio,
    addCategoriaEvento: addCategoriaEvento,
    getExtra: getExtra, allBenefits: allBenefits, addOrUpdateExtra: addOrUpdateExtra,
    removeBenefit: removeBenefit, isDeleted: isDeleted, getDeleted: getDeleted,
    findBenefitById: findBenefitById,
    getEdit: getEdit, setEdit: setEdit, clearEdit: clearEdit,
    // eventos (ADR-0009)
    allEvents: allEvents, upcomingEvents: upcomingEvents, findEventById: findEventById,
    addOrUpdateEvent: addOrUpdateEvent, normalizeEvent: normalizeEvent, removeEvent: removeEvent,
    getEditEvent: getEditEvent, setEditEvent: setEditEvent, clearEditEvent: clearEditEvent,
    eventDateLabel: eventDateLabel, parseLocal: parseLocal, categoriaColor: categoriaColor,
    // mis beneficios (matriculado)
    myBenefits: myBenefits, myTickets: myTickets,
    initialsOf: initialsOf, colorFor: colorFor, normalize: normalize, qp: qp,
    discountText: discountText, deriveUsages: deriveUsages, deriveTrend: deriveTrend,
    hydrated: HYDRATED
  };
})();
