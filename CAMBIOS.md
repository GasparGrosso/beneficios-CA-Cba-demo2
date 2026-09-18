# CAMBIOS.md — Qué cambia respecto de la maqueta demo2 y por qué

> Este artefacto es el **prototipo visual navegable de E5** (ADR-0006). Nace como copia de
> `beneficios-CA-Cba-demo2` @ `8067db8`. **Decisión del 18/09/2026:** se publica en el mismo
> repositorio y URL que demo2, reemplazándola; la versión aprobada el 10/09 queda preservada en el
> tag `demo2-aprobada-2026-09-10` y la rama `demo2-congelada`. Ver README.
> ADR-0006 exige que ningún cambio visual entre sin origen: acá se registra cada uno.
> Cuando E5 se redacte, esta lista es su sección 5.

Origen de cada cambio: **[10/09]** pedido del Colegio en la reunión del 10/09 (ALC-001 v1.1, brief
OBJ-3) · **[ADR-0009]** eventos con doble origen · **[ADR-0005]** decisiones de alcance ·
**[corrección]** defecto de demo2 detectado al construir · **[responsive]** pedido de que todas las
vistas aprovechen la pantalla del dispositivo.

## Pantallas nuevas

| Pantalla | Archivo | Origen | Notas |
|---|---|---|---|
| **Calendario de eventos** (matriculado) | `calendario-eventos.html` | [10/09] · ALC-001 M-10 | Misma agenda que el carrusel, en vista mensual. Día resaltado → carta del evento al pasar el cursor o tocar; "Obtener entrada" lleva al QR. En desktop, columna lateral con los eventos del mes. Leyenda por categoría. |
| **Mis beneficios** (matriculado) | `mis-beneficios.html` | [10/09] · ALC-001 v1.1 · pedido del 18/09 | Al entrar, selector **"Beneficios y entradas"** (mismo componente que el panel del Colegio). `?vista=beneficios`: *Top más usados* (ordenados por frecuencia de canje) y *En espera para volver a usarse* (cooldown con cuenta regresiva). `?vista=entradas`: lista desplazable de las tarjetas de evento con entrada del matriculado; tocar una abre el QR (`qr-entrada-evento.html`). Datos personales mock (`store.js → MIS_USOS / MIS_ESPERA / MIS_ENTRADAS`). |
| **Registrar / editar evento** (Colegio) | `formulario-evento.html` | [ADR-0009] | Alta y edición manual de eventos. Campos: nombre, categoría, lugar o modalidad, inicio, fin, descripción, URL de inscripción, URL de entrada, imagen de portada. Vista previa en vivo de la tarjeta que ve el matriculado. Al guardar vuelve a la agenda del panel. |

## Pantallas que cambian

| Pantalla | Qué cambia | Origen |
|---|---|---|
| **Panel del Colegio** (`panel-control.html`) | Al ingresar se ve **"Eventos y beneficios"**: dos tarjetas para elegir qué gestionar (brillo terracota desde los costados al pasar el cursor). `?vista=beneficios` muestra el catálogo y las estadísticas de siempre; `?vista=eventos` muestra la **agenda** con la misma tarjeta que ve el matriculado más el botón **"Editar evento"**, y el botón **"Registrar Evento"** en la cabecera. Cada evento lleva su origen: *Autogestión* o *Carga manual*. | [ADR-0009] · pedido del 17/09 |
| **Tarjetas de elección** (panel del Colegio y Mis beneficios) | El brillo terracota al pasar el cursor o tocar pasa a ser un velo tenue desde los costados, borde apenas teñido y sombra baja, sin halo exterior (pedido del 18/09: "más delicado y no tan invasivo"). | pedido del 18/09 |
| **Panel del Colegio** | Grilla del catálogo con columnas fluidas (antes 3 fijas: en tablet el botón "Modificar beneficio" se partía en dos líneas); informe y ranking a una columna por debajo de 960px; cabecera apilada en móvil. Reglas por clase (`pc-*`) en lugar de selectores `[style*="…"]`. | [responsive] |
| **Menú Beneficios** (matriculado) | La navegación inferior ya lleva a *Eventos* (calendario) y *Mis Beneficios*; "Ver todos" pasa a "Ver calendario". El carrusel toma la agenda real (`CAC.upcomingEvents()`: API + carga manual) y el contador "Eventos próximos" deja de ser fijo. El hero sin imagen muestra el nombre del evento (antes decía siempre "Workshop BIM 2026"). En desktop el contenido se centra a 1240px. | [10/09] · [ADR-0009] · [responsive] |
| **Menú Afiliado** (comercio) | En móvil y tablet la barra superior se rompía (título en tres líneas, pill partida, "Salir" fuera de pantalla) y el ranking quedaba recortado. Ahora: sidebar compacta con la navegación en fila hasta 900px, cabecera que envuelve, ranking en cuatro columnas que entran, detalle a una columna hasta 1150px. | [responsive] |
| **Formulario de beneficio** | En modo alta decía "Modificar Beneficio · MODO EDICIÓN" y "Guardar Cambios"; ahora el título, el subtítulo y el botón siguen al modo. Al volver, va a `panel-control.html?vista=beneficios` (no al selector). | [corrección] |
| **Validación de QR** (comercio) | Faltaba un `</div>` de cierre en la cabecera: todo el contenido quedaba dentro del header en fila y la pantalla desbordaba 552px en un móvil de 375px. | [corrección] |
| **Todas las páginas bundle** | Las interpolaciones `{{ }}` del runtime se envuelven en `<span class="sc-interp">` y el CSS tipográfico del helmet pisaba color, peso y fuente de cualquier `span`: el "%" del catálogo no era terracota, los títulos interpolados perdían la fuente display. Se agrega `.sc-interp{…:inherit}`. | [corrección] |
| **Vendor y bundles** | La copia local de demo2 tenía los archivos de `assets/vendor/` con CRLF (clon en Windows con `core.autocrlf=true`); `dc-runtime.js` verifica React por SRI y las cuatro páginas bundle quedaban en blanco. Se normalizan a LF y `.gitattributes` fija esos archivos como binarios. | [corrección] |

## Modelo de evento (`store.js`)

`formulario-evento.html` es la fuente de verdad del esquema del evento, como `formulario-beneficio.html` lo es del beneficio.

| Campo | Origen | Notas |
|---|---|---|
| `id`, `title`, `categoria`, `subtitle` (lugar o modalidad), `inicio`, `fin`, `descripcion`, `urlInscripcion`, `urlEntrada`, `img` | formulario | `inicio`/`fin` en fecha-hora local ISO |
| `origen` = `'api'` \| `'manual'` | [ADR-0009] | Los eventos base son `api` (llegaron por Autogestión) o `manual`; los cargados desde el panel son `manual` |
| `regional` | sesión del personal | Jurisdicción del evento cargado a mano (ADR-0009: cada regional carga los suyos) |
| `tag`, `tagBg`, `date` | derivados | Color por categoría y etiqueta corta de fecha (`eventDateLabel`) |

Persistencia mock: `localStorage.cac_extra_events` (altas y ediciones), `cac_edit_event` (precarga).
Un extra con el mismo `id` que un evento base lo **reemplaza**: editar nunca duplica. La API mock
(`api/_lib/data.js`) replica el dataset base 1:1.

## Decisiones tomadas al construir (a ratificar en E5)

- **Imagen de portada opcional.** El mock del formulario la exigía; los eventos de Autogestión pueden
  llegar sin imagen y la maqueta ya tenía un hero por defecto (nombre sobre fondo pizarra). Se mantiene
  ese criterio de imagen por defecto (OBJ-3 §2) y se avisa en el campo.
- **Campo "Lugar o modalidad".** No estaba en el mock del formulario, pero la tarjeta del evento lo
  muestra desde demo2 (`subtitle`). Se agrega al formulario para que la tarjeta no invente texto.
- **Evento de origen API editable.** ADR-0009 dice que ante conflicto manda la API. En el prototipo se
  muestra el aviso y se dejan los campos editables; qué campos bloquear se define cuando exista el
  contrato de datos (RTC-001 S-4).
- **Sin baja de eventos.** El pedido fue alta y edición; borrar queda para cuando el Colegio confirme
  las cuatro operaciones de la grilla de permisos (PLA-001).
- **Imagen redimensionada en el navegador** (máx. 1200 px, JPEG) para que entre en `localStorage`. Es
  simulación: en el producto va al almacenamiento propio de eventos (ADR-0009).

## Pendientes que no entran acá

- **Pantalla de ingreso**: bloqueada hasta la reunión técnica (ADR-0006 §5, SP1-50).
- **Club La Voz**, **bandeja de revisión por jurisdicción**, **formulario de alta de comercio**,
  **filtro "todos / regional X"** del panel: pantallas del brief OBJ-3 todavía sin construir.
- **Perfil** en la navegación inferior del matriculado: sin destino, como en demo2.
