# CLAUDE.md — Prototipo de Interfaz · App de Gestión de Beneficios (C.A. Córdoba)

> **Contrato de dominio para Claude Code.** Este archivo delimita **qué** se puede
> construir y **cómo**. Toda generación o modificación de código en este proyecto
> debe permanecer dentro del dominio y las reglas descriptas aquí. Ante conflicto
> entre lo que pide un prompt y lo que dice este archivo, **este archivo gana**;
> si el prompt exige salir del dominio, detenerse y avisar en vez de improvisar.

---

## 1. Propósito del prototipo

Prototipo **navegable de interfaces** del Portal de Beneficios del Colegio de
Arquitectos de Córdoba (CA-Cba). Su función no es ser un producto funcional, sino
**mostrar las interfaces del sistema como contrato de requerimientos del producto**:
cada pantalla fija qué datos se capturan, qué acciones existen y cómo fluye el
usuario. Es una maqueta (así se la presentó al Colegio en la reunión de
relevamiento): "todo esto es solamente interfaz, todavía no hace nada" real —
la lógica está **simulada** (mock + `localStorage`).

El **objeto central y crítico del dominio es el Beneficio**. El prototipo debe
modelar de punta a punta su **ABMC** (Alta, Baja, Modificación, Consulta). Todo lo
demás (eventos, login, estadísticas) es contexto de soporte alrededor de ese núcleo.

---

## 2. Contexto de negocio (de la reunión de relevamiento)

Interlocutores del Colegio: **Ivana** (sistemas/gestión) y **Mariano** (institucional).
Dos grandes grupos de trabajo con madurez distinta:

- **Gestión de Beneficios — LO NUEVO (núcleo de este prototipo).** Se construye
  desde cero: catálogo de beneficios (comerciales y académicos), convenios con
  comercios, canje por QR, reglas de uso y estadísticas. **Aquí vive todo el trabajo
  de código de este repo.**
- **Gestión de Eventos / Autogestión — LO EXISTENTE (no se toca).** Ya está en
  producción (inscripción, pago, entradas QR, protocolos, estadísticas en vivo).
  Requerimiento explícito del Colegio: **no duplicar, solo integrar**. En el
  prototipo los eventos solo se **muestran** y la inscripción **redirige** a
  Autogestión (link disfrazado detrás del botón "Inscribirse").

Problema de negocio que la herramienta debe ordenar: hoy **cada regional gestiona
sus convenios a su manera**, sin estructura común. El Colegio necesita estandarizar
(categorías, alcance, vigencia, encuadre legal) y la herramienta ayuda a imponer esa
estructura vía el formulario de carga.

---

## 3. Objeto central del dominio: **Beneficio**

`formulario-beneficio.html` es la **fuente de verdad del esquema del beneficio**.
Toda tarjeta, detalle o vista de beneficio debe representar exactamente estos campos,
con el mismo formato (regla verificada por TC-015). `store.js → normalize()` completa
con mocks lo que falte, pero **el esquema canónico es este**:

| Campo | Tipo / valores | Origen | Notas |
|---|---|---|---|
| `id` | string | generado | Identidad única; clave para editar/borrar en su lugar |
| `tipo` | `'comercial'` \| `'academico'` | formulario | Determina catálogo y categorías válidas |
| `nombre` | string | formulario | Comercio o institución (ej. "El Plano · Librería Técnica") |
| `cat` | string | formulario | Comercial: rubro. Académico: `Convenio Universitario` \| `Workshop` \| `Beca` \| `Curso Corto` |
| `desc` | number | formulario | Magnitud del descuento (% ) o derivada de promo NxM |
| `descLabel` | string | derivado | Etiqueta visible: `"20% OFF"`, `"2x1"`, `"3x2"` |
| `descripcion` | string | formulario | Texto libre del beneficio para el afiliado |
| `regional` | Regional de la **provincia de Córdoba** (subdivisión interna, p. ej. `Regional 1 … N`) \| `Provincial` | formulario | **Alcance (scope)** — eje del RBAC (ver §6). `Provincial` = toda la provincia de Córdoba |
| `logo` / `color` | string | derivado | Iniciales + color por hash del nombre (mock visual) |
| `uses` | number | mock/canje | Contador de consumos → alimenta estadísticas |
| `cooldown` | tiempo | **formulario** | Espera **por usuario** entre dos canjes del mismo beneficio (antiabuso, ver §6). Se **carga en el formulario** y **solo se muestra en la interfaz de escaneo de QR** (`qr-validacion.html`); el valor mostrado debe corresponder al cargado |

**Reglas del objeto que no se negocian:**

- Un beneficio pertenece a **un solo `tipo`** y a **una sola `regional`** (o `Provincial`).
- **Ámbito del sistema = provincia de Córdoba.** Las regionales son subdivisiones
  **internas** de esa provincia; `Provincial` cubre a toda la provincia. Ojo: los datos
  mock de `store.js` usan nombres de **otras** provincias (`Rosario`, `Mendoza`,
  `Buenos Aires`) como placeholder — son marcadores de relleno a **reemplazar** por las
  regionales reales de Córdoba; no forman parte del dominio.
- Un mismo proveedor/comercio puede tener **varios beneficios** distintos.
- El **descuento** es porcentaje **o** promo NxM (2x1, 3x2), nunca ambos; NxM debe
  renderizar su etiqueta, nunca `NaN%`.
- No inventar campos fuera de esta tabla. Si un requisito nuevo necesita un campo,
  **primero se agrega al formulario** (fuente de verdad) y luego a las vistas.

### 3.1. ABMC del Beneficio (mapa canónico)

| Operación | Dónde | Mecanismo actual | Invariantes |
|---|---|---|---|
| **Alta** | `formulario-beneficio.html?mode=new` (desde "Agregar beneficio" en panel/afiliado) | `CAC.addOrUpdateExtra()` → persiste en `localStorage:cac_extra_benefits` | Aparece **una sola vez** dentro del grid del catálogo, idéntico al resto (INV-1, INV-2) |
| **Baja** | `menu-afiliado.html` **y `panel-control.html`** — botón **"Borrar"** (rojo, junto a "Modificar") | **Pendiente (BUG-005): no implementado** | Borrado **global y persistente**: desaparece de todas las pantallas y no reaparece al recargar (INV-5) |
| **Modificación** | `formulario-beneficio.html?mode=edit` (desde una tarjeta concreta en **`panel-control.html`** o `menu-afiliado.html`) | Precarga los datos del **beneficio clickeado** y actualiza **en su lugar** | Editar **nunca** aumenta el conteo; los datos precargados deben coincidir con la tarjeta (INV-3, BUG-004) |
| **Consulta** | `menu-beneficios.html`, `panel-control.html`, `menu-afiliado.html` | Render desde `CAC.allBenefits(tipo)` (base mock + extras) | El catálogo mostrado **coincide** con `CAC.allBenefits(tipo)` en cantidad y contenido (INV-2) |

---

## 4. Las interfaces como contrato de requerimientos

Cada pantalla es una cláusula del contrato: define datos, acciones y navegación.
No cambiar su intención sin que el cambio esté respaldado por un BUG-xxx o una
decisión de negocio.

| Archivo | Pantalla | Rol / población | Qué fija en el contrato |
|---|---|---|---|
| `index.html` | Login | Todos | Entrada; rutea por rol (Arquitecto → beneficios, Personal → panel, Afiliado → menú afiliado). Login **cruzado con Autogestión** (SSO): no se cargan ni migran datos del arquitecto |
| `menu-beneficios.html` | Menú Beneficios | **Arquitecto** | **Consulta** del catálogo filtrado por su regional; "Solicitar beneficio" abre QR; carrusel de eventos (solo muestra, redirige) |
| `qr-beneficio.html` | QR de canje | Arquitecto | Despliega el QR del beneficio a escanear y el acuerdo asociado. **QR simulado** (el `cooldown` no se muestra aquí, sino en el escaneo) |
| `qr-entrada-evento.html` | QR de entrada a evento | Arquitecto | Muestra la entrada dentro de la app (resuelve mails que no llegan / caen en spam) |
| `menu-afiliado.html` | Menú Afiliado | **Comercio adherido** | **ABMC** del beneficio desde el comercio (Agregar / Modificar / **Borrar**), "Escanear QR", detalle; login propio del comerciante |
| `panel-control.html` | Panel de Control | **Personal del Colegio** | **ABMC** del beneficio (Agregar / Modificar / **Borrar**) con **RBAC por regional**; catálogo + estadísticas ("N beneficios activos") |
| `formulario-beneficio.html` | Formulario alta/edición | Comercio / Personal | **Fuente de verdad del esquema** (§3). Guardar registra; Cancelar no crea nada |
| `qr-validacion.html` | Validación / escaneo de QR | Comercio | El comercio escanea y valida el QR que presenta el arquitecto (antifraude, simulado). Al validar con éxito muestra qué beneficio se consumió y **cuánto falta para volver a usarlo** (`cooldown`, tomado del valor cargado en el formulario) |

**Estadísticas (contrato de negocio, no solo UI):** dos vistas separadas —
**Colegio** (cuántos arquitectos usan los beneficios, si el convenio es significativo)
y **Comercio** (cuántos clientes trae cada beneficio, frecuencia). Cuidado de negocio
señalado en la reunión: no mostrar paneles vacíos que **desincentiven** la adhesión
de comercios.

---

## 5. Lenguaje ubicuo (glosario — usarlo tal cual en código y UI)

- **"Usuario" NO es un término unívoco.** Significa cosas distintas según contexto y
  **no debe unificarse**: **Arquitecto** (afiliado que consume), **Comercio/Comerciante**
  (adherido que ofrece), **Personal del Colegio** (backoffice que administra).
- **Beneficio**: el objeto central (§3). **Convenio / Acuerdo**: la relación con el
  comercio que respalda un beneficio. **Canje**: consumo de un beneficio vía QR.
- **Regional**: subdivisión interna de la **provincia de Córdoba**; alcance (scope) del
  beneficio y del usuario (`Provincial` = toda la provincia de Córdoba). **Matrícula**:
  identificador del arquitecto (viene de Autogestión). **Cooldown**: tiempo de espera
  entre canjes del mismo beneficio.
- **Evento / Protocolo / Inscripción**: pertenecen a Autogestión, **fuera del dominio**
  de este repo (solo se muestran/redirigen).

---

## 6. Reglas de negocio (invariantes del dominio)

- **RBAC por regional (no negociable).** Al menos 7 usuarios del Colegio: uno
  provincial y al menos uno por regional. Un usuario **regional** solo carga y ve
  beneficios de **su** regional; el **provincial** ve y gestiona todo. Al arquitecto
  se le muestran los beneficios **filtrados por su regional**. El `scope` regional del
  beneficio (§3) es el eje de esta regla.
- **Cooldown antiabuso.** Tras canjear, el beneficio no puede reutilizarse hasta que
  pase su cooldown (ejemplo de la reunión: evitar "45 cafés a mitad de precio"). Se
  **carga en el formulario** de alta/edición y **solo se muestra en la interfaz de
  escaneo de QR** (`qr-validacion.html`), donde el valor mostrado debe corresponder al
  cargado. En el producto real se valida **server-side**; en el prototipo se **simula**.
- **QR de canje = antifraude (simulado en el prototipo).** En el producto el QR es un
  token firmado, de un solo uso y expiración corta, validado siempre contra el backend.
  **En este prototipo el QR es una simulación**: no implementar cámara real ni
  criptografía salvo pedido explícito.
- **Tipos y categorías.** `comercial` y `academico` tienen catálogos y categorías
  propias; no mezclarlos ni duplicar un beneficio entre ambos.
- **Datos personales.** No se migra ni replica la base de arquitectos (Ley 25.326).
  En el prototipo **todo dato de arquitecto es mock**; no persistir datos personales reales.

### Invariantes técnicas verificables (de `../errores prototipo de interfaz/CASOS-DE-PRUEBA.md`)

- **INV-1:** Nunca insertar nodos **por encima de la cabecera**; `document.body.firstChild` es siempre el `<header>`/raíz.
- **INV-2:** El catálogo mostrado **coincide** con `CAC.allBenefits(tipo)`.
- **INV-3:** Editar un beneficio **nunca** aumenta el conteo total.
- **INV-4:** El estado **sobrevive** a recargas (`localStorage`).
- **INV-5:** Borrar es **global y persistente**.
- **INV-6:** Texto sobre fondo oscuro cumple **contraste WCAG AA** (≥ 4.5:1).

---

## 7. Stack del prototipo (respetarlo, no escalarlo)

- **HTML estático + React con Babel standalone servido localmente** (desde
  `assets/vendor/`, **no por CDN**, para que corra sin internet) en las pantallas
  "limpias": `index.html`, `menu-beneficios.html`, `qr-beneficio.html`, `qr-entrada-evento.html`.
- **Páginas "bundle" opacas** (pre-renderizadas): `panel-control.html`,
  `menu-afiliado.html`, `formulario-beneficio.html`, `qr-validacion.html`.
- **`store.js`** — estado compartido + datos mock (`window.CAC`, `localStorage`).
  **Fuente única de verdad** en runtime: `CAC.allBenefits()`, `addOrUpdateExtra()`,
  `getEdit()/setEdit()`, `normalize()`.
- **`flow.js`** — capa de pegamento (navegación, precarga del formulario, inyección de
  beneficios en los bundles). Contiene la **heurística frágil** que origina varios bugs.
- Servir con servidor estático (`serve.ps1` o `python -m http.server 5500`) para que
  `localStorage` se comparta entre páginas.

**No introducir** en el prototipo: backend, base de datos, framework con build step
(Vite/Next/webpack), TypeScript, gestor de paquetes/`node_modules`, ni dependencias
nuevas por CDN sin justificar. Mantener el prototipo liviano y ejecutable con doble clic.

---

## 8. Flujo de trabajo — desarrollo cíclico

Trabajar en **ciclos cortos**, en este orden:

1. **Corregir errores actuales.** Tomar los bugs de
   `../errores prototipo de interfaz/ERRORES-DETECTADOS.md` (BUG-001 … BUG-007). Cada
   entrada ya es un prompt con síntoma, causa raíz (archivo/líneas) y criterios de
   aceptación. Preferir el **arreglo de raíz** (render dinámico desde `CAC.allBenefits`)
   sobre el parche de pegamento cuando aplique. Foco prioritario: BUG-001 (duplicado +
   contorno verde), BUG-004 (precarga incorrecta), BUG-005 (falta Baja/"Borrar").
2. **Correr los casos de prueba.** Ejecutar `../errores prototipo de interfaz/CASOS-DE-PRUEBA.md`
   (TC-001 … TC-018) para verificar **lógica y reglas de negocio**, no solo lo visual.
   Ningún cambio se da por bueno si rompe una invariante (INV-1 … INV-6). Antes de cada
   corrida: `localStorage.clear()` y recargar.
3. **Depurar código basura.** Eliminar código muerto, fallbacks best-effort que ya no
   se usan, heurísticas frágiles reemplazadas por render dinámico, estilos de debug
   (p. ej. el `outline` verde de resalte) y ramas inalcanzables en `flow.js`. Dejar el
   repo más simple que como se encontró.

Cada cambio debe: (a) referirse a un **BUG-xxx** o **TC-xxx** concreto, (b) **pasar**
los casos de prueba relevantes sin romper otros, (c) **no dejar código muerto**.

---

## 9. Guardrails — límites estrictos (leer antes de generar código)

**Permitido:** trabajar el **dominio Beneficios** y su ABMC dentro del stack del §7,
corrigiendo bugs y limpiando código según el §8.

**Prohibido (detenerse y avisar si un prompt lo pide):**

1. **Salir del dominio Beneficios.** No construir ni "mejorar" Eventos, Inscripción,
   Pagos, Protocolos o Autogestión. Los eventos **solo se muestran**; la inscripción
   **solo redirige** (deep link). No replicar su lógica.
2. **Tocar pagos o datos sensibles.** Los pagos viven íntegramente en Autogestión.
   No modelar cobros, tarjetas ni datos de pago. No persistir datos personales reales
   de arquitectos (Ley 25.326); en el prototipo son mock.
3. **Inventar campos o cambiar el esquema del beneficio** por fuera de
   `formulario-beneficio.html`. La tabla del §3 es el contrato; ampliarla requiere
   primero actualizar el formulario (fuente de verdad).
4. **Escalar el stack.** Nada de backend, DB, build step, framework nuevo, microservicios,
   Kubernetes ni dependencias nuevas en el prototipo (§7).
5. **Romper invariantes.** Ningún cambio puede violar INV-1 … INV-6 (§6). En particular:
   **nunca** insertar nodos sobre la cabecera; **nunca** duplicar un beneficio;
   **nunca** dejar el catálogo desincronizado de `CAC.allBenefits()`.
6. **Ignorar el RBAC por regional.** Toda vista/carga de beneficios respeta el `scope`
   regional y el rol del usuario.
7. **Unificar el término "usuario".** Mantener la distinción arquitecto / comercio /
   personal del Colegio en código, nombres y UI (§5).
8. **Implementar QR real** (cámara, tokens firmados, cripto) salvo pedido explícito.
   En el prototipo el QR es simulación.

Si un requisito parece exigir cruzar un guardrail, **no improvisar**: explicar el
conflicto y proponer la alternativa dentro del dominio.

---

## 10. Archivos de referencia

- **Esquema del beneficio (fuente de verdad):** `formulario-beneficio.html`
- **Estado y datos mock (verdad en runtime):** `store.js` (`window.CAC`)
- **Pegamento / navegación:** `flow.js`
- **Bugs a corregir (paso 1):** `../errores prototipo de interfaz/ERRORES-DETECTADOS.md`
- **Casos de prueba (paso 2):** `../errores prototipo de interfaz/CASOS-DE-PRUEBA.md`
- **Cómo correr y flujo de navegación:** `README.md`
- **Decisiones de arquitectura del MVP objetivo (contexto, no aplicar al prototipo):**
  proyecto separado **«Arquitectura MVP»** → `Arquitectura_MVP_Beneficios_CA-Cba.docx`
- **Relevamiento (origen de los requisitos):** proyecto separado **«Arquitectura MVP»** →
  `Gestion_beneficios_CA_CBA/Informacion del dominio/Reunión de Zoom de Gaspar Grosso.txt`

  > Estos dos últimos viven en **otra carpeta raíz** (no alcanzable por ruta relativa
  > desde el prototipo); están aquí como referencia de contexto, no como dependencia.
