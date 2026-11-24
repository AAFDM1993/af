# Magnetoterapia: esquemas dinámicos y marco teórico (diseño)

Fecha: 2026-11-23. Módulo: `laboratorio/js/lab-magneto.js` y `magneto-core.js`. Fuente única: `D:\agentes físicas\Magnetoterapia.pdf` / `.pptx` (clase). No se corrige con literatura (decisión del docente).

## Intención
El docente proyecta el módulo en clase mientras explica, y el alumno lo explora solo. Hoy los esquemas (corte del miembro con solenoide y plano, y las seis viñetas de tejidos) son SVG estáticos, y faltan en el módulo los temas teóricos de la clase.

## Metas
- Esquemas con movimiento ligado a los parámetros: el campo fluye de S a N, su ritmo y grosor siguen frecuencia y gauss; los arcos del plano se debilitan con la profundidad; una sonda arrastrable lee los G en cada cm.
- Cada viñeta de tejido se anima paso a paso (Na⁺ saliendo, osteoblastos, fibroblastos, flujo de glóbulos rojos, potencial de acción).
- Formas de onda (sinusoidal, rectangular, "tres cuartos") y el barrido moviéndose por el cuerpo frente a lo fijo.
- Dos modos de uso: **proyección** (corre solo, pocos botones grandes) y **exploración** (reproducir, pausar, velocidad, arrastrar).
- Pestaña nueva **Marco teórico**, primera: concepto y "conversivo", campo y unidades (gauss/tesla), sustancias dia/para/ferromagnéticas, efecto de los polos, equipo (consola, solenoide 15–20 cm y 60 cm, camilla, 2 canales, 5 posiciones), fijo vs barrido, alta intensidad (informativa).

## No metas / antimetas
- No cambiar cifras de la clase ni contrastar con literatura. No marcas ni modelos de equipos.
- No depender de internet ni de librerías: scripts clásicos, JS puro.
- Antimeta: movimiento que distraiga o que presente el modelo didáctico como medida real. Todo esquema conserva el rótulo "esquema didáctico".

## Restricciones
- Convenciones del laboratorio: `LabKit`/`LabCore`, núcleo probado con `node --test`.
- Accesible: respeta `prefers-reduced-motion` (arranca en pausa), `aria-label` actualizado, textos grandes para proyectar.
- Seis fotogramas por segundo mínimo útil; sin trabajo pesado por cuadro.

## Approaches
1. CSS/SMIL sobre los SVG actuales: simple y ligero, pero no liga el movimiento a deslizadores ni da pausa/velocidad fiable.
2. **Elegida:** controlador JS con `requestAnimationFrame` que actualiza atributos SVG a partir de funciones puras del núcleo (fase, posición del barrido, muestras de onda). Permite pausa, velocidad, arrastre y pruebas.
3. Reescribir en canvas: más fluido, pero pierde SVG accesible y escalable y exige rehacer todo.

## Cómo se construye
- `magneto-core.js` (mío): funciones puras probadas (`wavePoint`, `sweepPosition`, `fieldPhase`, datos de `THEORY`: sustancias, equipo, posiciones, formas de onda). Pruebas en `tests/magneto-core.test.js`.
- `lab-magneto-anim.js` nuevo (agente Opus): controlador de animación y los esquemas rediseñados y animados (corte, tejidos, ondas, barrido). Contrato: expone `MagnetoAnim.scheme(...)`, `.tissue(...)`, `.wave(...)`, `.sweep(...)` y `.stopAll()`.
- `lab-magneto.js` (mío): pestaña Marco teórico, integración, conmutador Proyección/Exploración, carga del script en `laboratorio/index.html`.
- Verificación: `node --test` y revisión en el navegador de cada pestaña, incluida la pausa y el modo de movimiento reducido.

## A criterio del constructor
Colores, ritmo exacto y trazado de cada animación dentro de la paleta del módulo (acento `#5B3A8C`); texto de las explicaciones del marco teórico, fiel a las láminas.
