# Prototipo E5 — Portal de Beneficios · Colegio de Arquitectos

> **Este es el prototipo que manda (decisión del 18/09/2026).** Por decisión del equipo, este
> repositorio —que hasta el 18/09 contenía la maqueta `demo2` aprobada por el Colegio el 10/09—
> pasa a contener el **prototipo E5** con las nuevas decisiones (ADR-0009 eventos con doble origen,
> pedidos del 10/09: calendario, Mis beneficios, entradas, panel de eventos). La versión aprobada
> queda **preservada** en el tag `demo2-aprobada-2026-09-10` y en la rama `demo2-congelada` de este
> mismo repositorio, y sigue siendo la referencia de lo que el Colegio vio y aprobó. Lo que se publica
> en <https://www.demo-beneficioscacba.com/> desde ahora es este prototipo. Esta decisión supera a
> ADR-0001/ADR-0006 en lo que respecta a *dónde* se publica y debe registrarse en la bóveda con un ADR.

**Prototipo visual navegable del entregable E5** (ADR-0006). Nace como copia de la maqueta
`demo2` (`8067db8`) y la reemplaza en este repositorio; la copia aprobada queda en el tag y la rama
indicados arriba.

Cada diferencia respecto de demo2, con su origen, está en [`CAMBIOS.md`](CAMBIOS.md).

Prototipo navegable del flujo completo de interfaces: Login, pantallas del matriculado (Menú
Beneficios, Calendario de Eventos, Mis Beneficios, QR), del comercio adherido (Menú Afiliado,
Validación de QR) y del personal del Colegio (Panel de Gestión de eventos y beneficios, formularios).

## Cómo correr

Se recomienda un **servidor estático local** (para que `localStorage` se comparta
entre páginas y así un beneficio guardado aparezca en todos los paneles):

```powershell
# Opción A: script incluido (usa Python o npx serve automáticamente)
powershell -File serve.ps1

# Opción B: manual (sin caché, recomendado mientras el prototipo cambia)
python serve.py 5500
```

> `serve.py` es `http.server` con `Cache-Control: no-store`: evita que el navegador muestre
> un HTML o un `store.js` viejos después de un cambio (pantalla en blanco o estilos viejos).

Luego abrí **http://localhost:5500/**.

> También podés abrir `index.html` directamente (doble click). Cada pantalla
> funciona, pero en `file://` algunos navegadores aíslan `localStorage`, por lo
> que el "beneficio recién registrado" podría no verse reflejado entre páginas.

## Flujo de navegación

- **`index.html` (Login)** → según el rol:
  - **Arquitecto** → `menu-beneficios.html`
  - **Personal del Colegio** → `panel-control.html`
  - **Afiliado** → `menu-afiliado.html`
- **Arquitecto** (`menu-beneficios.html`):
  - "Solicitar Beneficio" → `qr-beneficio.html`
  - Tocar un evento del carrusel → `qr-entrada-evento.html`
- **Afiliado** (`menu-afiliado.html`):
  - "Detalle de beneficio" → detalle embebido (interno)
  - "Modificar beneficio" → `formulario-beneficio.html` (precargado)
  - "Escanear QR" → `qr-validacion.html`
  - "Agregar beneficio" → `formulario-beneficio.html`
- **Arquitecto**, navegación inferior:
  - "Eventos" → `calendario-eventos.html` (día resaltado → carta del evento → `qr-entrada-evento.html`)
  - "Mis Beneficios" → `mis-beneficios.html`: selector **"Beneficios y entradas"** →
    `?vista=beneficios` (más usados + en espera con cuenta regresiva) o `?vista=entradas`
    (tarjetas de los eventos con entrada → `qr-entrada-evento.html`)
- **Personal** (`panel-control.html`):
  - Al ingresar: **"Eventos y beneficios"**, dos tarjetas para elegir qué gestionar
  - `?vista=beneficios` → catálogo + estadísticas; "Agregar / Modificar beneficio" → `formulario-beneficio.html`
  - `?vista=eventos` → agenda; "Registrar Evento" / "Editar evento" → `formulario-evento.html`
- **Formulario de beneficio** (`formulario-beneficio.html`):
  - "Registrar Beneficio" / "Guardar Cambios" → registra y vuelve al panel de origen
  - "Cancelar" → vuelve sin cambios
  - El beneficio registrado aparece en las grillas de los paneles y del Menú Beneficios.
- **Formulario de evento** (`formulario-evento.html`, ADR-0009):
  - "Registrar evento" / "Guardar cambios" → guarda y vuelve a la agenda del panel
  - El evento aparece en la agenda del panel, en el carrusel del Menú Beneficios y en el calendario.

## Estructura

| Archivo | Rol |
|---|---|
| `index.html` | Login (entrada; rutea por rol) |
| `menu-beneficios.html` | Menú Beneficios (Arquitecto) |
| `calendario-eventos.html` | Calendario de Eventos (Arquitecto) — pedido del 10/09 |
| `mis-beneficios.html` | Mis Beneficios: selector Beneficios / Entradas; más usados, en espera y entradas (Arquitecto) — pedido del 10/09 |
| `qr-beneficio.html` | QR de beneficio comercial/académico |
| `qr-entrada-evento.html` | QR de entrada a evento |
| `menu-afiliado.html` | Menú Afiliado (bundle + `flow.js`) |
| `panel-control.html` | Panel de Gestión del Colegio: eventos y beneficios (bundle + `flow.js`) |
| `formulario-beneficio.html` | Formulario alta/edición de beneficio (bundle + `flow.js`) |
| `formulario-evento.html` | Formulario alta/edición de evento (ADR-0009) |
| `qr-validacion.html` | QR Validación (bundle + `flow.js`) |
| `store.js` | Datos mock + estado compartido (localStorage): beneficios, eventos, "mis beneficios" |
| `CAMBIOS.md` | Qué cambia respecto de demo2 y por qué (insumo de E5) |
| `flow.js` | Capa de flujo/redirecciones para las pantallas "bundle" |
| `assets/` | Logo e imágenes de eventos |
| `assets/vendor/` | React, ReactDOM y Babel locales (para correr sin internet) |



## Reset del estado

Para limpiar los beneficios registrados de la demo, en la consola del navegador:

```js
localStorage.removeItem('cac_extra_benefits');
localStorage.removeItem('cac_edit_benefit');
localStorage.removeItem('cac_deleted_benefits');
localStorage.removeItem('cac_extra_events');
localStorage.removeItem('cac_edit_event');
```

## Nota para clones en Windows

`assets/vendor/` y `assets/bundle/` deben quedar byte a byte: `dc-runtime.js` verifica React por
integridad (SRI). `.gitattributes` los marca como binarios para que `core.autocrlf` no los convierta.
