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
vistas aprovechen la pantalla del dispositivo · **[marca]** recursos gráficos oficiales del Colegio
(`02-producto/marca/CAPC - Gestion 2024-26 - Recursos graficos.pdf`, recibidos el 21/09/2026) y efecto de
selección de Autogestión CAPC (video de referencia del 21/09).

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

## Identidad visual (21/09/2026) — [marca]

Toda la maqueta adopta los recursos gráficos oficiales de la Gestión 2024-26. Ninguna pantalla cambia
de contenido ni de flujo: cambia cómo se ve. La hoja `assets/marca-capc.css` es la fuente de verdad de
la marca dentro del prototipo y documenta cada tono.

| Qué cambia | Antes (demo2) | Ahora | Origen |
|---|---|---|---|
| **Color de acento** | Terracota `#E05A36` (y sus tonos) | Naranja CAPC `#E9500E`; oscuro `#C8440B` y claro `#F17A42` derivados para hover y acentos | PDF · paleta principal |
| **Superficies oscuras** | Pizarra azulada `#0F172A` con textura punteada y grises fríos (slate) | Negro `#161616` plano; grises cálidos `#E7E2E1` · `#E2DBD7` · `#CCC5BE` para bordes y fondos, con neutros intermedios interpolados para texto secundario | PDF · paleta principal |
| **Fondo de página** | `#F8FAFC` | `#F5F2F0` (derivado del gris cálido) | PDF · paleta principal |
| **Colores de categoría y de iniciales** | Azul/violeta/ámbar/verde genéricos | Paleta secundaria (regionales): azul oscuro `#1D3354`, azul `#5B93CE`, rosa `#E8376F`, violeta `#B472AD`, más el naranja y el negro. Verde `#96C66F` y amarillo `#EFCE44` quedan para estados (éxito / aviso) porque no soportan texto blanco encima | PDF · paleta secundaria |
| **Estados** | Verde/ámbar/rojo Tailwind | Éxito en verde regional oscurecido, aviso en amarillo regional, destructivo ("Borrar") en rosa regional `#E8376F` | PDF · paleta secundaria |
| **Tipografía** | Inter (cuerpo) + Plus Jakarta Sans (títulos), servidas en local | **Work Sans** desde Google Fonts: regular para texto, *regular italic*, semibold (600) para subtítulos, botones y etiquetas, extra bold (800) para títulos. Los pesos 500 y 700 de demo2 pasan a 400 y 600 para quedarse en los cuatro estilos del manual. Se eliminan las `@font-face` y los `.woff2` de Inter/Jakarta | PDF · tipografía |
| **Isologo** | Cuadrado naranja con "CA" blanco (`logo-ca-blanco.png`) | Isologo oficial extraído del PDF (vectorial, fondo transparente): isotipo a color en las cabeceras oscuras y en la barra lateral del comercio; isologo horizontal completo (versión para fondo oscuro) en el login. Todas las variantes quedan en `assets/marca/` | PDF · usos de isologo |
| **Filete superior** | Degradé terracota | Degradé del isotipo (azul → violeta → rosa → amarillo → verde), 3–4 px | PDF · isologo |
| **Componentes seleccionables** (tarjetas de beneficio y de evento, tarjetas de elección del panel y de Mis beneficios, entradas, opciones "Comercial / Académico" del formulario, pestañas de tipo de cuenta del login) | Elevación leve o brillo lateral terracota | Efecto de Autogestión CAPC: el contorno pasa a naranja, el fondo toma un velo cálido `#FEF9F6` y la pieza se eleva 4 px, en ~180 ms; vale para hover, toque, foco de teclado y estado seleccionado (`.capc-sel`). Reemplaza al brillo lateral del 18/09 | Video de Autogestión (21/09) |
| **Campos de formulario** | Foco azul del navegador | Foco con contorno naranja y halo suave | Video de Autogestión (21/09) |

Decisiones tomadas al aplicar la marca (a ratificar en E5):

- **Tonos derivados.** El PDF trae 5 + 6 colores; hover, texto secundario y estados necesitan más. Se
  interpolaron a partir de la paleta y están listados en `assets/marca-capc.css` con su uso.
- **Verde y amarillo no llevan texto blanco.** Se los reserva para estados; iniciales y categorías usan
  el resto de la secundaria. Si el Colegio quiere colorear por regional con la paleta secundaria (el PDF
  la llama "regionales"), es un cambio de producto que se decide en E5.
- **Work Sans por CDN.** Igual que demo2 con Inter/Jakarta en las páginas "limpias"; si hace falta que
  todo corra sin internet se pueden empaquetar los `.woff2` en `assets/`.
- **Radios y espaciados** no cambian: el PDF no los define.

## Correcciones (25/09/2026)

- **Isotipo recortado.** `assets/marca/isotipo-{color,negro,claro}.png` habían salido del PDF sin la
  pata de la "A": en las cabeceras de todas las vistas posteriores al login se veía solo la "C". Se
  regeneraron recortando el símbolo del isologo horizontal correspondiente, que está completo.
- **Borrar eventos desde el panel.** La vista *Gestión de Eventos* solo permitía editar. Se agrega
  "Borrar" (con confirmación) **solo en los eventos de carga manual**: los de Autogestión son de solo
  lectura en el Portal ([ADR-0011]). La baja se guarda en `cac_deleted_events` y oculta el evento en
  toda la agenda (panel, menú, calendario). `store.js` expone `removeEvent(id)`.
- **Alcance en los formularios de alta.** `formulario-beneficio.html` y `formulario-evento.html` suman
  el campo **Alcance: Regional / Provincial** (RN-08, acordado 10/09; para eventos, tabla de permisos de
  la minuta MIN-P01 del 10/09). Si es regional se elige cuál; por defecto, la regional de la sesión, y
  provincial si el gestor es provincial. El valor se guarda en `regional` (`Regional N` | `Provincial`),
  el mismo campo que ya usaban el catálogo y el RBAC. Antes el beneficio nuevo quedaba fijo en
  `Regional 5` y el evento tomaba siempre la regional de la sesión. **No** se restringe qué alcance
  puede elegir cada gestor (el provincial no edita lo regional): eso queda para el RBAC del panel. La
  jurisdicción de los eventos de origen API sigue abierta (Q-034).
- **Agregar categoría de evento.** `formulario-evento.html` suma el chip "+ Agregar categoría": se
  escribe el nombre, queda seleccionada y aparece en toda la agenda con un color de la paleta. Origen:
  RN-07, ampliada el 18/09 (el Colegio pidió dar de alta categorías desde el panel). Se guardan en
  `cac_categorias_evento`; `store.js` expone `addCategoriaEvento(nombre)`.
- **Categoría del beneficio y alta de categorías.** `formulario-beneficio.html` suma el campo
  **Categoría** después del tipo, con la lista del tipo elegido y "+ Agregar categoría" (queda
  seleccionada). Origen: RN-07, ampliada el 18/09. Comercial: los rubros del catálogo (antes el alta
  quedaba fija en "Comercio Adherido"); Académico: las cuatro de siempre, que antes estaban en el
  select "Subtipo Académico" de abajo. Se guardan en `cac_categorias_beneficio`; `store.js` expone
  `categoriasBeneficio(tipo)` y `addCategoriaBeneficio(tipo, nombre)`. **Los tipos siguen siendo dos**
  (Comercial y Académico): la opción de agregar tipos que se probó el mismo día se quitó (Q-044,
  descartada).
- `store.js?v=` pasa a `20260925` en todas las páginas para que el navegador no use el store anterior.

## Rediseño del inicio y redondeo general (01/10/2026)

Pedido del usuario el 01/10, sobre una imagen de referencia (variante "izquierda").

- **Inicio del arquitecto (`menu-beneficios.html`).** La franja oscura con los datos del matriculado
  (saludo, matrícula, regional, estado y los tres indicadores) queda **plegada** y se despliega al
  tocar el ícono de perfil de la cabecera; Escape la cierra. "Perfil" sale de la barra inferior en
  todas las pantallas que la tienen (inicio, calendario, Mis beneficios): el perfil vive solo arriba. "Salir"
  pasa a "Cerrar sesión" dentro de ese panel. La cabecera queda con el isotipo, notificaciones y
  perfil en botones circulares, y bordes inferiores redondeados.
- **Tarjetas de "Próximos eventos".** Imagen a sangre con la categoría (píldora) arriba a la izquierda,
  ficha de fecha (día y mes) arriba a la derecha, título y lugar sobre un degradé oscuro, y el botón
  "Obtener entrada" a todo el ancho debajo. Estado "Habilitado" en verde de marca sobre fondo oscuro
  (sin texto blanco sobre verde).
- **Radios.** Se sube la escala en todas las pantallas para que ninguna pieza quede en ángulo recto:
  0–4 px → 8 px, 5–7 → 10, 8–9 → 12, 10–12 → 16 (incluye los tokens `--radius-*` de las páginas de
  panel). Las tarjetas principales usan 20–24 px. Colores y tipografía no cambian (`marca-capc.css`).
- **Login (`index.html`).** Se quita el aviso amarillo "Maqueta de demostración". Se conserva el
  recuadro "Credenciales de prueba · ficticias" para poder reingresar si se borran los campos. El título de la
  pestaña deja de decir "(maqueta de demostración)".

## Pendientes que no entran acá

- **Pantalla de ingreso**: bloqueada hasta la reunión técnica (ADR-0006 §5, SP1-50).
- **Club La Voz**, **bandeja de revisión por jurisdicción**, **formulario de alta de comercio**,
  **filtro "todos / regional X"** del panel: pantallas del brief OBJ-3 todavía sin construir.
- **Perfil** en la navegación inferior del matriculado: sin destino, como en demo2.
