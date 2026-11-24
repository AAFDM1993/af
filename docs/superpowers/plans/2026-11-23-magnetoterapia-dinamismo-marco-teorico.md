# Magnetoterapia: esquemas dinámicos y marco teórico Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Animar los esquemas del módulo de magnetoterapia (modo Proyección y modo Exploración) y agregar la pestaña "Marco teórico" con el contenido de la clase.

**Architecture:** Funciones puras y datos teóricos en `magneto-core.js` (probados con `node --test`). Un archivo nuevo, `lab-magneto-anim.js`, con un controlador `requestAnimationFrame` y los esquemas animados (corte del miembro, tejidos, ondas, barrido). `lab-magneto.js` solo integra: pestaña nueva, deslizadores, conmutador de modo y limpieza al cambiar de pestaña.

**Tech Stack:** JS puro con scripts clásicos (sin módulos ni librerías ni internet), SVG inline, `node --test`.

**Spec:** `docs/superpowers/specs/2026-11-23-magnetoterapia-dinamismo-marco-teorico-design.md`. Fuente de contenido: `D:\agentes físicas\Magnetoterapia.pdf` (láminas 2, 4–8, 14–20, 29–30). Para leerla: `PYTHONUTF8=1 python <scratchpad>/pdftxt.py "D:/agentes físicas/Magnetoterapia.pdf"` (usa `pypdf`).

## Global Constraints

- Solo la clase como fuente; no corregir cifras ni contrastar con literatura.
- Sin marcas ni modelos de equipos, sin nombres de personas.
- Scripts clásicos, JS puro, sin internet. Convenciones del laboratorio: `LabKit`, `LabCore`, `U.build`, `U.seg`, `U.slider`.
- Acento `#5B3A8C`; textos grandes para proyectar; todo esquema conserva el rótulo "esquema didáctico".
- Respetar `prefers-reduced-motion`: las animaciones arrancan en pausa.
- Cada `aria-label` de un esquema se actualiza con los valores que muestra.
- Rango del equipo: 1–100 Hz, 1–100 G (hasta 200 G) (`MagnetoCore.DEVICE`).

## Review Focus

- Frecuencia o gauss fuera de rango (0, negativos, 1000): se acotan, sin NaN en los atributos del SVG.
- Gauss = 0: el campo se dibuja casi apagado, sin romperse ni dividir por cero.
- Cambiar de pestaña o de modo repetidamente: no quedan bucles `requestAnimationFrame` huérfanos.
- Movimiento reducido activo: arranca en pausa y el botón de reproducir funciona.
- Pantalla angosta (teléfono, 360 px): sin scroll horizontal; la sonda se arrastra con el dedo y con el teclado (flechas).
- Con 50 Hz exactos no hay perfil: la animación y el texto siguen funcionando.

---

### Task 1: Núcleo — funciones puras y datos del marco teórico

**Files:**
- Modify: `laboratorio/js/magneto-core.js`
- Test: `laboratorio/tests/magneto-core.test.js`

**Interfaces:**
- Produces (todas exportadas en `MagnetoCore`):
  - `visualHz(hz: number): number` — ciclos por segundo visibles: 1 Hz → 0.5, 100 Hz → 3.0, lineal; `hz` se acota a 1–100; no finito → 1 Hz.
  - `fieldStrength(gauss: number): number` — gauss acotado a 0–200, dividido entre 200 → 0 a 1.
  - `fieldPhase(tMs: number, hz: number, speed: number): number` — fase en [0,1): `((tMs/1000) * visualHz(hz) * speed) mod 1`; `speed` se acota a 0–4.
  - `wavePoint(shape: 'sinusoidal'|'rectangular'|'tres-cuartos', phase: number): number` en [-1,1]. Sinusoidal: `sin(2π·phase)`. Rectangular: +1 si `phase mod 1 < 0.5`, si no −1. Tres cuartos: `sin(2π·phase)` para `phase mod 1 < 0.75`, 0 en el último cuarto (criterio didáctico: la clase solo nombra la forma, sin definirla). Forma desconocida: lanza `Error`.
  - `sweepPosition(tMs: number, periodMs: number): { x: number, index: number }` — `x` en [0,1] con onda triangular (0 en t=0, 1 en t=periodMs/2, vuelve a 0 en periodMs); `index` = posición más cercana de `THEORY.posiciones` (0–4).
  - `THEORY`: objeto con `concepto: string[]`, `sustancias: {id, nombre, susceptibilidad, comportamiento, ejemplos}[]` (3, en el orden diamagnéticas, paramagnéticas, ferromagnéticas), `unidades: string[]`, `polos: {N, S}`, `partes: {consola: string[], solenoide: string[], camilla: string[]}` (se llama `partes`, no `equipo`: el guardia `no-brands.test.js` bloquea la cadena `equipo:`), `formasOnda: {id, nombre}[]` (3, ids como arriba), `posiciones: string[]` (5: pie, rodilla, cadera, dorsal baja, cabeza y cuello), `tecnica: {fijo: string, barrido: string}`.

- [ ] **Step 1: Escribir las pruebas que fallan** en `tests/magneto-core.test.js`, con estos nombres y aserciones:
  - `visualHz acota y mapea`: `visualHz(1)===0.5`, `visualHz(100)===3`, `visualHz(0)===0.5`, `visualHz(1000)===3`, `visualHz(NaN)===0.5`, `near(visualHz(50.5), 1.75)`.
  - `fieldStrength`: `fieldStrength(0)===0`, `fieldStrength(200)===1`, `fieldStrength(500)===1`, `fieldStrength(-5)===0`, `near(fieldStrength(100), 0.5)`.
  - `fieldPhase es periódica y acotada`: `fieldPhase(0,30,1)===0`; siempre en [0,1) para t=1e9; `speed` negativo se trata como 0 (resultado 0).
  - `wavePoint por forma`: sinusoidal `near(wavePoint('sinusoidal',0.25),1)` y `near(...,0.75), -1)`; rectangular `wavePoint('rectangular',0.1)===1`, `(…,0.6)===-1`; tres cuartos `near(wavePoint('tres-cuartos',0.25),1)`, `wavePoint('tres-cuartos',0.9)===0`; `assert.throws(() => M.wavePoint('zzz',0))`; fase 1.25 equivale a 0.25.
  - `sweepPosition triangular`: `sweepPosition(0,4000).x===0`, `(2000,4000).x===1`, `(4000,4000).x===0`, `index` es 0 en x=0 y 4 en x=1.
  - `THEORY completo`: 3 sustancias con los ids `diamagneticas`, `paramagneticas`, `ferromagneticas`; 5 posiciones en el orden indicado; 3 formas de onda; `tecnica.fijo` y `tecnica.barrido` no vacíos; cada texto es string no vacío.

- [ ] **Step 2: Ejecutar** `cd D:/AF/laboratorio && node --test tests/magneto-core.test.js`. Esperado: FALLA (funciones sin definir).

- [ ] **Step 3: Implementar** las funciones y `THEORY` en `magneto-core.js`, y exportarlas en el `return` del módulo. El texto de `THEORY` sale de las láminas 2, 4–8, 14–20 de la clase, copiado con las mismas ideas y palabras (sin añadir cifras ni fuentes externas). Marcar con comentario la definición didáctica de "tres cuartos".

- [ ] **Step 4: Ejecutar** `node --test tests/magneto-core.test.js` y luego `node --test tests/`. Esperado: todo en verde.

- [ ] **Step 5: Commit** (en la rama `magneto-dinamismo`, creada con `git switch -c magneto-dinamismo` antes del Step 1)
```bash
git add laboratorio/js/magneto-core.js laboratorio/tests/magneto-core.test.js
git commit -m "feat: funciones puras de animación y datos del marco teórico de magnetoterapia"
```

---

### Task 2: Esquemas animados (lo construye el agente Opus)

**Files:**
- Create: `laboratorio/js/lab-magneto-anim.js`
- No tocar `lab-magneto.js` ni `magneto-core.js` (los otros dos archivos son de las Tasks 1 y 3).

**Interfaces:**
- Consumes: `MagnetoCore.fieldAtDepth`, `.LAYERS`, `.TISSUES`, `.DEVICE`, `.visualHz`, `.fieldStrength`, `.fieldPhase`, `.wavePoint`, `.sweepPosition`, `.THEORY` (Task 1); `LabKit` (`K.fx`, `K.ui`). Punto de partida del dibujo: las funciones `scheme(apl)` y `DRAW`/`scene()` de `lab-magneto.js` (pestañas "Campo y aplicador" y "Polaridad y efectos"); copiar su geometría y paleta, no importarlas. Patrón de bucle y de movimiento reducido: `lab-analgesia.js:360-410`.
- Produces: objeto global `MagnetoAnim` con
  - `setMode(m: 'proyeccion'|'exploracion'): void` y `mode: string` (por defecto `'proyeccion'`); al cambiar, las piezas vivas reconstruyen sus controles.
  - `scheme(el: HTMLElement, o: {applicator: 'solenoide'|'plano', gauss: number, hz: number}): {update(p: {gauss?: number, hz?: number}): void, destroy(): void}` — corte del miembro: líneas del campo que fluyen de S a N con ritmo (`visualHz`) y grosor/opacidad (`fieldStrength`) según los parámetros; arcos del plano que se debilitan con la profundidad; medidor de G por cm; **sonda arrastrable** (ratón, dedo y flechas del teclado) que lee los G y la capa a la profundidad elegida.
  - `tissue(el, o: {tissueId: string}): {setTissue(id: string): void, destroy(): void}` — las seis viñetas de `TISSUES` (la escena de 690×500 existente) con el tejido seleccionado animado paso a paso (iones Na⁺ saliendo, osteoblastos, fibroblastos, glóbulos rojos que fluyen, impulso en el nervio), y clic en una viñeta que dispara `el.dispatchEvent(new CustomEvent('tissue-select', {detail: id}))`.
  - `wave(el, o: {shape: string, hz: number}): {update(p: {shape?: string, hz?: number}): void, destroy(): void}` — traza viva de la forma de onda con `wavePoint`, con el ritmo de `visualHz`.
  - `sweep(el, o?: {}): {destroy(): void}` — silueta del cuerpo con las 5 posiciones de `THEORY.posiciones` y el solenoide desplazándose con `sweepPosition` (barrido), junto a un panel "fijo" estático para contrastar.
  - `stopAll(): void` — cancela todos los bucles y desmonta las piezas vivas.
- Reglas de las piezas: cada una crea sus propios controles — en `proyeccion` un único botón grande de pausa/reproducir y corre sola; en `exploracion` además velocidad (0.25×, 0.5×, 1×, 2×) y, donde aplique, el arrastre de la sonda; todas arrancan en pausa con `prefers-reduced-motion: reduce` y se quedan dibujando un cuadro estático correcto; un solo `requestAnimationFrame` por pieza, cancelado en `destroy()`; `aria-label` del SVG actualizado con los valores vigentes; rótulo "Esquema didáctico" visible; textos de 16 px o más; ancho fluido (`viewBox`), sin scroll horizontal a 360 px; sin dependencias externas.

- [ ] **Step 1:** Leer `lab-magneto.js` (pestañas "Campo y aplicador" y "Polaridad y efectos"), `lab-analgesia.js:340-420` y `Task 1` ya integrado en `magneto-core.js`. Anotar la paleta y las medidas del dibujo actual.

- [ ] **Step 2:** Implementar el controlador interno y `scheme` + `wave`. Verificar a mano abriendo una página temporal en el scratchpad que cargue `lab-core`, `lab-kit`, `magneto-core.js` y `lab-magneto-anim.js` (no dentro de `D:\AF`): movimiento correcto, pausa, velocidad, sonda con ratón y flechas, gauss = 0 y hz = 1000 sin NaN.

- [ ] **Step 3:** Implementar `tissue` (seis viñetas, animación del tejido seleccionado, selección por clic) y `sweep`. Verificar a mano igual que en el Step 2, y con `prefers-reduced-motion` forzado en las herramientas del navegador.

- [ ] **Step 4:** Implementar `setMode` y `stopAll`; comprobar que 20 llamadas seguidas de crear y `destroy()` no dejan bucles activos (contar los `requestAnimationFrame` pendientes) y que cambiar de modo reconstruye los controles.

- [ ] **Step 5: Commit**
```bash
git add laboratorio/js/lab-magneto-anim.js
git commit -m "feat: esquemas animados de magnetoterapia (campo, tejidos, ondas, barrido)"
```

---

### Task 3: Integración y pestaña Marco teórico

**Files:**
- Modify: `laboratorio/js/lab-magneto.js` (pestañas, deslizadores, conmutador de modo; borrar el dibujo estático que ya reemplaza `MagnetoAnim`)
- Modify: `laboratorio/index.html:17-18` (agregar `<script src="js/lab-magneto-anim.js"></script>` entre `magneto-core.js` y `lab-magneto.js`)

**Interfaces:**
- Consumes: `MagnetoAnim` (`setMode`, `scheme`, `tissue`, `wave`, `sweep`, `stopAll`) y `MagnetoCore.THEORY` (Tasks 1 y 2).
- Produces: pestañas, en este orden: **Marco teórico** (nueva, primera), Campo y aplicador, Polaridad y efectos, Protocolo, Patologías, Seguridad, Caso clínico.

- [ ] **Step 1:** Cargar el script nuevo en `index.html` y confirmar en el navegador que el laboratorio abre sin errores de consola.

- [ ] **Step 2:** Agregar la pestaña **Marco teórico** con secciones tomadas de `THEORY`: Concepto, Campo y unidades (gauss/tesla, con `gaussToTesla`), Sustancias (tres tarjetas dia/para/ferromagnéticas), Polos (N y S), Equipo (consola, solenoide, camilla, formas de onda con `MagnetoAnim.wave` y selector de forma), Técnica (fijo frente a barrido con `MagnetoAnim.sweep`), Alta intensidad (`HIGH_INTENSITY_NOTE`, solo informativa).

- [ ] **Step 3:** En "Campo y aplicador": reemplazar los dos `scheme()` estáticos por `MagnetoAnim.scheme` y añadir deslizadores de intensidad (1–200 G) y frecuencia (1–100 Hz) que llaman a `update`. En "Polaridad y efectos": reemplazar `scene()` por `MagnetoAnim.tissue`, conectando `tissue-select` con la selección existente (`sel`, `upd()`). En "Protocolo" (perfiles): `MagnetoAnim.wave` junto al deslizador `mgf`.

- [ ] **Step 4:** Añadir el conmutador **Proyección / Exploración** (usar `U.seg`) en la cabecera del módulo, que llame a `MagnetoAnim.setMode`; llamar a `MagnetoAnim.stopAll()` al salir de la pestaña o del módulo y reconstruir al volver.

- [ ] **Step 5:** Borrar de `lab-magneto.js` el código de dibujo (`scheme`, `DRAW`, `scene` y sus constantes) que ya no se usa, y actualizar los textos "Cómo leer el dibujo" y la nota de la escena para describir el movimiento y la sonda.

- [ ] **Step 6:** `node --test tests/` en `D:/AF/laboratorio`. Esperado: todo en verde. Commit:
```bash
git add laboratorio/js/lab-magneto.js laboratorio/index.html
git commit -m "feat: pestaña Marco teórico y esquemas animados integrados en el módulo de magnetoterapia"
```

---

### Task 4: Verificación en el navegador y revisión

**Files:** ninguno nuevo (correcciones menores si aparecen).

- [ ] **Step 1:** Abrir `laboratorio/index.html` en el navegador (Chrome) y recorrer las 7 pestañas en modo Proyección y en modo Exploración: animaciones, pausa, velocidad, sonda con ratón y teclado, selección de tejidos, forma de onda y barrido. Consola sin errores.

- [ ] **Step 2:** Verificar cada línea de **Review Focus**: acotar valores extremos, gauss = 0, 20 cambios rápidos de pestaña sin bucles huérfanos, movimiento reducido (arranca en pausa), ancho de 360 px sin scroll horizontal, 50 Hz.

- [ ] **Step 3:** Revisar todo el diff de la rama (`git diff main...magneto-dinamismo`) contra el diseño y corregir lo que falte; ejecutar `node --test tests/`. Esperado: verde. Commit de las correcciones, si las hay:
```bash
git commit -am "fix: ajustes tras la verificación de los esquemas dinámicos de magnetoterapia"
```
