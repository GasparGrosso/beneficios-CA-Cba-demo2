# Prototipo de Interfaz — Portal de Beneficios · Colegio de Arquitectos (MVP)

Prototipo navegable del flujo completo de interfaces. Modulariza en archivos
independientes las vistas que estaban embebidas en un único `index.html`
(Login, Menú Beneficios y QR) y las cablea con las 4 pantallas para los distintos tipos de usuarios

## Cómo correr

Se recomienda un **servidor estático local** (para que `localStorage` se comparta
entre páginas y así un beneficio guardado aparezca en todos los paneles):

```powershell
# Opción A: script incluido (usa Python o npx serve automáticamente)
powershell -File serve.ps1

# Opción B: manual con Python o Node
python -m http.server 5500 --directory frontend
# o bien: node server-local.js
```

Luego abrí **http://localhost:5500/** (o el puerto que corresponda).

> También podés abrir `frontend/index.html` directamente (doble click). Cada pantalla
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
- **Personal** (`panel-control.html`):
  - "Agregar / Modificar beneficio" → `formulario-beneficio.html`
- **Formulario** (`formulario-beneficio.html`):
  - "Guardar Cambios" → registra el beneficio y vuelve al panel de origen
  - "Cancelar" → vuelve sin cambios
  - El beneficio registrado aparece en las grillas de los paneles y del Menú Beneficios.

## Estructura

| Archivo (`frontend/`) | Rol |
|---|---|
| `frontend/index.html` | Login (entrada; rutea por rol) |
| `frontend/menu-beneficios.html` | Menú Beneficios (Arquitecto) |
| `frontend/qr-beneficio.html` | QR de beneficio comercial/académico |
| `frontend/qr-entrada-evento.html` | QR de entrada a evento (nueva) |
| `frontend/menu-afiliado.html` | Menú Afiliado (bundle + `flow.js`) |
| `frontend/panel-control.html` | Panel de Control (bundle + `flow.js`) |
| `frontend/formulario-beneficio.html` | Formulario registro/modificación (bundle + `flow.js`) |
| `frontend/qr-validacion.html` | QR Validación (bundle + `flow.js`) |
| `frontend/store.js` | Datos mock + estado compartido (localStorage) |
| `frontend/flow.js` | Capa de flujo/redirecciones para las pantallas "bundle" |
| `frontend/assets/` | Logo e imágenes de eventos |
| `frontend/assets/vendor/` | React, ReactDOM y Babel locales (para correr sin internet) |



## Reset del estado

Para limpiar los beneficios registrados de la demo, en la consola del navegador:

```js
localStorage.removeItem('cac_extra_benefits');
localStorage.removeItem('cac_edit_benefit');
```
