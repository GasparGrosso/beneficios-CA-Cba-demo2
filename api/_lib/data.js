/* ============================================================
   api/_lib/data.js — Fuente única de datos mock del lado servidor.
   CommonJS, sin dependencias externas. Replica 1:1 (mismos ids,
   campos y valores) los datasets de store.js para que la hidratación
   del cliente no cambie lo que el cliente ya aceptó (ver contrato §1.3).
   ============================================================ */
'use strict';

/* ---------- Datos mock (copia exacta de store.js) ---------- */
var EVENTS = [
  { id: 'e1', title: 'Visitá Casa FOA',        subtitle: 'Solicitá entrada gratuita vía tu regional', date: 'Hasta 30 jun',      tag: 'Cultura',       tagBg: '#E05A36', img: 'assets/evento-gala40.png' },
  { id: 'e2', title: 'Gala 40 Años C.A.C.',    subtitle: 'Transmisión en vivo · YouTube',             date: '25 mar · 19:30 hs', tag: 'Institucional', tagBg: '#0F172A', img: 'assets/evento-casafoa.png' },
  { id: 'e3', title: 'Workshop BIM Avanzado',  subtitle: 'Online · Certificación oficial CPAU',       date: '12 jul · 9:00 hs',  tag: 'Formación',     tagBg: '#10B981', img: null },
];

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
var REGIONALES = CITIES.filter(function (c) { return c !== 'Todas'; });

var PALETTE = ['#3B82F6', '#8B5CF6', '#E05A36', '#F59E0B', '#10B981', '#06B6D4', '#EC4899', '#0F172A'];

/* ---------- Usuarios mock (§5 del contrato) ---------- */
var USERS = {
  arquitectos: [
    { nombre: 'Carlos',  apellido: 'Rodríguez', matricula: '12458', password: 'cac12458', regional: 'Regional 1' },
    { nombre: 'Ana',     apellido: 'Pereyra',    matricula: '20011', password: 'cac20011', regional: 'Regional 2' },
    { nombre: 'Luis',    apellido: 'Gómez',      matricula: '20022', password: 'cac20022', regional: 'Regional 3' },
    { nombre: 'Marta',   apellido: 'Sosa',       matricula: '20033', password: 'cac20033', regional: 'Regional 4' },
    { nombre: 'Jorge',   apellido: 'Paz',        matricula: '20044', password: 'cac20044', regional: 'Regional 5' },
  ],
  personal: [
    { nombre: 'María',   apellido: 'González', matricula: '8842',  password: 'cac8842',  regional: 'Provincial' },
    { nombre: 'Pedro',   apellido: 'Ibáñez',   matricula: '30011', password: 'cac30011', regional: 'Regional 1' },
    { nombre: 'Lucía',   apellido: 'Farías',   matricula: '30022', password: 'cac30022', regional: 'Regional 2' },
    { nombre: 'Diego',   apellido: 'Molina',   matricula: '30033', password: 'cac30033', regional: 'Regional 3' },
    { nombre: 'Valeria', apellido: 'Ortiz',    matricula: '30044', password: 'cac30044', regional: 'Regional 4' },
    { nombre: 'Sergio',  apellido: 'Vega',     matricula: '30055', password: 'cac30055', regional: 'Regional 5' },
    { nombre: 'Roberto', apellido: 'Díaz',     matricula: '30066', password: 'cac30066', regional: 'Provincial' },
  ],
  afiliados: [
    { comercio: 'El Plano · Librería Técnica', email: 'contacto@elplano.com',     codigo: 'COM-0001', password: 'plano2026' },
    { comercio: 'Casa Central Materiales',      email: 'contacto@casacentral.com', codigo: 'COM-0002', password: 'central2026' },
    { comercio: 'Studio Render Pro',            email: 'contacto@studiorender.com',codigo: 'COM-0003', password: 'render2026' },
  ]
};

/* ---------- Helpers de mock (misma semántica que store.js) ---------- */
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

/* Normaliza un beneficio (completa con mocks lo que falte). Idéntico a store.js.
   opts.nuevo controla el flag `nuevo` del DTO: true (default) para altas reales
   vía addOrUpdateBenefit; false cuando se usa para completar el DTO de salida
   de los ítems base (c1..c8, a1..a6) — ver BUG-201, no son altas nuevas. */
function normalize(b, opts) {
  b = b || {};
  opts = opts || {};
  var markNuevo = Object.prototype.hasOwnProperty.call(opts, 'nuevo') ? opts.nuevo : true;
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
    nuevo: markNuevo
  };
}

/* ---------- Helpers de presentación (derivados del esquema §3) ---------- */
function discountText(b) {
  b = b || {};
  if (b.descLabel && !/%/.test(b.descLabel)) return String(b.descLabel).replace(/\s*OFF\s*$/i, '');
  if (typeof b.desc === 'number') return b.desc + '%';
  var n = parseInt(b.desc, 10);
  return isNaN(n) ? '—' : n + '%';
}
function deriveUsages(uses) {
  uses = (typeof uses === 'number' && uses >= 0) ? uses : 0;
  return {
    semanal: Math.max(1, Math.round(uses * 0.22)),
    mensual: uses,
    anual: uses * 12,
  };
}
function deriveTrend(b, period) {
  var s = String((b && b.id) || '') + '|' + (period || '');
  var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  var arr = ['+12%', '+8%', '+5%', '+3%', '+15%', '+1%', '-2%', '+6%', '+9%', '+4%'];
  return arr[h % arr.length];
}

/* ---------- Overlay en memoria module-scope (best-effort, stateless entre cold starts) ---------- */
var extraBenefits = [];   // altas/ediciones (normalizadas)
var deletedIds = {};      // ids dados de baja (base o extra)
var canjes = {};          // key `${beneficioId}|${matricula}` -> proximoUso (epoch ms)

function baseFor(tipo) { return tipo === 'academico' ? ACADEMICOS : COMERCIALES; }

/* Igual semántica que store.js allBenefits(): base + extras, extras reemplazan
   base con mismo id (edición en su lugar, nunca duplica), menos los borrados. */
function allBenefits(tipo) {
  var extras = extraBenefits
    .filter(function (b) { return !tipo || b.tipo === tipo; })
    .filter(function (b) { return !deletedIds[String(b.id)]; });
  var overrideIds = {};
  extras.forEach(function (b) { overrideIds[String(b.id)] = true; });
  var bases = tipo ? baseFor(tipo) : COMERCIALES.concat(ACADEMICOS);
  var base = bases
    .filter(function (b) {
      var id = String(b.id);
      return !deletedIds[id] && !overrideIds[id];
    })
    /* BUG-201: los ítems base viven en COMERCIALES/ACADEMICOS sin descLabel/
       descripcion/cooldown (salvo c9). Se normalizan acá, en el único punto
       de salida usado por catalogo.js y beneficios.js, para servir el DTO
       completo (contrato §3.2) sin marcarlos como altas nuevas. */
    .map(function (b) { return normalize(b, { nuevo: false }); });
  return base.concat(extras);
}

function findBenefitById(id) {
  if (!id) return null;
  var sid = String(id);
  if (deletedIds[sid]) return null;
  var found = extraBenefits.filter(function (b) { return String(b.id) === sid; })[0];
  if (found) return found;
  var base = COMERCIALES.concat(ACADEMICOS).filter(function (b) { return String(b.id) === sid; })[0];
  return base || null;
}

function addOrUpdateBenefit(partial) {
  var nb = normalize(partial);
  delete deletedIds[String(nb.id)];
  var idx = -1;
  for (var i = 0; i < extraBenefits.length; i++) {
    if (String(extraBenefits[i].id) === String(nb.id)) { idx = i; break; }
  }
  if (idx >= 0) extraBenefits[idx] = nb; else extraBenefits.push(nb);
  return nb;
}

function deleteBenefit(id) {
  if (!id) return false;
  deletedIds[String(id)] = true;
  extraBenefits = extraBenefits.filter(function (b) { return String(b.id) !== String(id); });
  return true;
}

/* ---------- RBAC (dato, no UI) ----------
   arquitecto → su regional + Provincial
   personal (regional propio) → solo su regional
   personal (regional === 'Provincial') y afiliado → todo */
function filterByRbac(list, rol, regional) {
  if (!rol || rol === 'afiliado') return list;
  if (rol === 'arquitecto') {
    if (!regional) return list;
    return list.filter(function (b) { return b.regional === regional || b.regional === 'Provincial'; });
  }
  if (rol === 'personal') {
    if (!regional || regional === 'Provincial') return list;
    return list.filter(function (b) { return b.regional === regional; });
  }
  return list;
}

/* ---------- Autenticación (§3.1, §5) ---------- */
function authenticate(payload) {
  payload = payload || {};
  var tipoCuenta = payload.tipoCuenta;

  if (tipoCuenta === 'arquitecto' || tipoCuenta === 'personal') {
    var nombre = payload.nombre, apellido = payload.apellido, matricula = payload.matricula, password = payload.password;
    if (!nombre || !apellido || !matricula || !password) {
      return { ok: false, status: 400, error: { codigo: 'CAMPOS_FALTANTES', mensaje: 'Faltan campos requeridos (nombre, apellido, matrícula, contraseña).' } };
    }
    var pool = tipoCuenta === 'arquitecto' ? USERS.arquitectos : USERS.personal;
    var match = null;
    for (var i = 0; i < pool.length; i++) {
      var u = pool[i];
      if (u.nombre.toLowerCase() === String(nombre).toLowerCase() &&
          u.apellido.toLowerCase() === String(apellido).toLowerCase() &&
          u.matricula === String(matricula) &&
          u.password === password) { match = u; break; }
    }
    if (!match) {
      return { ok: false, status: 401, error: { codigo: 'CREDENCIALES_INVALIDAS', mensaje: 'Usuario o contraseña incorrectos.' } };
    }
    var scope = match.regional === 'Provincial' ? 'provincial' : 'regional';
    var landing = tipoCuenta === 'arquitecto' ? 'menu-beneficios.html' : 'panel-control.html';
    return {
      ok: true,
      dto: {
        rol: tipoCuenta,
        nombre: match.nombre,
        apellido: match.apellido,
        matricula: match.matricula,
        regional: match.regional,
        scope: scope,
        landing: landing
      }
    };
  }

  if (tipoCuenta === 'afiliado') {
    var email = payload.email, codigo = payload.codigo, password2 = payload.password;
    if (!email || !codigo || !password2) {
      return { ok: false, status: 400, error: { codigo: 'CAMPOS_FALTANTES', mensaje: 'Faltan campos requeridos (email, código, contraseña).' } };
    }
    var m = null;
    for (var j = 0; j < USERS.afiliados.length; j++) {
      var a = USERS.afiliados[j];
      if (a.email.toLowerCase() === String(email).toLowerCase() && a.codigo === codigo && a.password === password2) { m = a; break; }
    }
    if (!m) {
      return { ok: false, status: 401, error: { codigo: 'CREDENCIALES_INVALIDAS', mensaje: 'Usuario o contraseña incorrectos.' } };
    }
    return {
      ok: true,
      dto: {
        rol: 'afiliado',
        comercio: m.comercio,
        codigo: m.codigo,
        regional: 'Provincial',
        scope: 'provincial',
        landing: 'menu-afiliado.html'
      }
    };
  }

  return { ok: false, status: 400, error: { codigo: 'CAMPOS_FALTANTES', mensaje: 'tipoCuenta inválido o faltante.' } };
}

/* ---------- Validación de canje (cooldown simulado, §3.4, §6) ---------- */
function parseCooldownMs(cooldown) {
  var s = String(cooldown || '').trim();
  var m = s.match(/(\d+(?:[.,]\d+)?)\s*(d[ií]as?|d|h(?:oras?)?|m(?:in(?:utos?)?)?)/i);
  if (!m) return 24 * 60 * 60 * 1000; // default 24h si no hay cooldown cargado
  var n = parseFloat(m[1].replace(',', '.'));
  var unit = m[2].toLowerCase();
  if (unit.indexOf('d') === 0) return n * 24 * 60 * 60 * 1000;
  if (unit.indexOf('h') === 0) return n * 60 * 60 * 1000;
  return n * 60 * 1000; // minutos
}

function registrarCanje(beneficioId, matricula) {
  var b = findBenefitById(beneficioId);
  if (!b) {
    return { ok: false, status: 404, error: { codigo: 'BENEFICIO_NO_ENCONTRADO', mensaje: 'Beneficio no encontrado.' } };
  }
  var key = String(beneficioId) + '|' + String(matricula || '');
  var now = Date.now();
  var cooldownMs = parseCooldownMs(b.cooldown);
  var prev = canjes[key];
  var resultado, proximoUso;
  if (prev && prev > now) {
    resultado = 'RECHAZADO_COOLDOWN';
    proximoUso = prev;
  } else {
    resultado = 'APROBADO';
    proximoUso = now + cooldownMs;
    canjes[key] = proximoUso;
  }
  return {
    ok: true,
    dto: {
      resultado: resultado,
      beneficioNombre: b.nombre,
      descLabel: discountText(b),
      cooldown: b.cooldown || (Math.round(cooldownMs / 3600000) + 'h'),
      proximoUso: new Date(proximoUso).toISOString()
    }
  };
}

/* ---------- Estadísticas (§3.4) ---------- */
function buildEstadisticas() {
  var all = allBenefits();
  var porBeneficio = all.map(function (b) {
    return {
      id: b.id,
      nombre: b.nombre,
      usos: deriveUsages(b.uses),
      tendencia: deriveTrend(b, 'mensual')
    };
  });
  return {
    beneficiosActivos: all.length,
    porBeneficio: porBeneficio
  };
}

module.exports = {
  EVENTS: EVENTS,
  COMERCIALES: COMERCIALES,
  ACADEMICOS: ACADEMICOS,
  CITIES: CITIES,
  REGIONALES: REGIONALES,
  USERS: USERS,
  normalize: normalize,
  initialsOf: initialsOf,
  colorFor: colorFor,
  discountText: discountText,
  deriveUsages: deriveUsages,
  deriveTrend: deriveTrend,
  allBenefits: allBenefits,
  findBenefitById: findBenefitById,
  addOrUpdateBenefit: addOrUpdateBenefit,
  deleteBenefit: deleteBenefit,
  filterByRbac: filterByRbac,
  authenticate: authenticate,
  registrarCanje: registrarCanje,
  buildEstadisticas: buildEstadisticas
};
