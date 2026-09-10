# Simulador de agentes físicos — Design Spec

**Fecha:** 2026-09-09
**Estado:** Aprobado por el usuario en brainstorming, pendiente de plan de implementación.

## 1. Objetivo

Agregar una nueva sección "Simulador" a la guía clínica (`index.html` + `js/*.js`) donde se
genera un paciente aleatorio (fase clínica + tejido/síntoma + opcionalmente una comorbilidad) y
el usuario debe:

1. Elegir qué agente físico aplicaría (entre el correcto y varios distractores clínicamente
   incorrectos para ese caso).
2. Si el agente elegido es correcto y no está contraindicado por la comorbilidad del paciente,
   ajustar sus parámetros de dosificación mediante sliders y recibir feedback (✅/❌) por
   parámetro contra el rango clínicamente válido.

No hay puntaje ni historial persistente: cada paciente es un caso independiente con botón
"Siguiente paciente".

## 2. Principio rector: no inventar clínica nueva

Toda la data del simulador (casos, agente objetivo, rangos numéricos, contraindicaciones) se
deriva textualmente de contenido que **ya existe** en `js/flujo.js` (los 12 nodos de resultado
del flujograma) y `js/referencia.js` (campo `contra` de cada agente en `REF_AGENTS`). No se
introducen dosis, rangos ni contraindicaciones que no estén ya redactadas en el proyecto.

## 3. Modelo de datos (`js/simulador.js`, nuevo archivo)

### 3.1 `SIM_CASES` — 12 casos, uno por cada nodo de resultado de `flujo.js`

Cada caso reutiliza el nodo de resultado existente (`phase`, lista completa de agentes válidos)
y agrega:
- `regions`: 3-4 nombres de zona corporal (solo texto de ambientación, no afecta la lógica),
  coherentes con el tejido/síntoma del caso.
- `target`: el agente que se pondrá a prueba en el paso de sliders — el primero/más
  representativo de la lista original de agentes válidos de ese nodo.
- `agentBase`: id del agente base en `REF_AGENTS` (`tens`, `inter`, `us`, `mag`, `rusa`, `laser`,
  `ondah`, `oc`) — se usa para cruzar contra `SIM_COMORBILIDADES`.
- `sliders`: 2-3 controles `{label, unit, min, max, step, validMin, validMax}`, extraídos del
  texto de parámetros ya existente para ese agente en ese caso.

| # | Caso (nodo `flujo.js`) | Fase | Agente objetivo | Sliders (rango válido) |
|---|---|---|---|---|
| 1 | `r_ag_dolor` | Aguda — dolor/inflamación | TENS convencional | Frecuencia 80–150 Hz · Ancho de pulso 50–80 µs · Duración 20–30 min |
| 2 | `r_ag_edema` | Aguda — edema | Interferencial 25–50 Hz | AMF 25–50 Hz · Duración 15–20 min |
| 3 | `r_ag_espasmo` | Aguda — espasmo | TENS Burst | Frec. ráfaga 2–4 Hz · Ancho de pulso 100–200 µs · Duración 18–22 min |
| 4 | `r_sub_dolor` | Subaguda — dolor residual | TENS acupuntural | Frecuencia 2–10 Hz · Ancho de pulso 200–300 µs · Duración 20–30 min |
| 5 | `r_sub_cicatriz` | Subaguda — cicatrización | US pulsado 1:1 (1 MHz fijo) | Intensidad 0.5–1 W/cm² · Duración 5–8 min |
| 6 | `r_sub_edema` | Subaguda — edema crónico | Magnetoterapia 25–50 Hz | Frecuencia 25–50 Hz · Intensidad 20–80 Gauss · Duración 20–30 min |
| 7 | `r_sub_fuerza` | Subaguda — recuperación de fuerza | Corrientes rusas | Frec. ráfaga 45–55 Hz · Duración 10–20 min |
| 8 | `r_cr_articular` | Crónica — articular/hueso | Magnetoterapia 1–25 Hz | Frecuencia 1–25 Hz · Intensidad 10–100 Gauss · Duración 20–30 min |
| 9 | `r_cr_muscular` | Crónica — muscular | Laser 830 nm | Dosis 4–6 J/cm² · Tiempo/zona 60–90 s |
| 10 | `r_cr_neuro` | Crónica — neuropático/PG | Onda H | Frecuencia 2–10 Hz · Duración 30–45 min |
| 11 | `r_tend_sub` | Tendinopatía subaguda-crónica | Interferencial 80 Hz | AMF 75–85 Hz · Duración 15–20 min |
| 12 | `r_tend_cr` | Tendinopatía crónica refractaria | Ondas de choque radiales | Presión 1.5–4 bar · Frecuencia 8–15 Hz · Nº impactos 1500–2500 |

El control de cada slider se muestra con un rango de arrastre más amplio que el rango válido
(aprox. 2× o hasta el máximo fisiológico razonable) para que el usuario deba realmente elegir,
no adivinar por los extremos del control.

### 3.2 `SIM_COMORBILIDADES` — 6 condiciones

Cada una excluye como respuesta válida los `agentBase` cuyo campo `contra` en `referencia.js`
menciona explícitamente esa condición (cita exacta entre paréntesis):

| Comorbilidad | `agentBase` excluidos | Casos afectados |
|---|---|---|
| Marcapasos / dispositivo electrónico implantado | tens, inter, us, mag, rusa, ondah | 1,2,3,4,5,6,7,8,10,11 |
| Embarazo (zona abd./lumbar/pélvica) | tens, inter, us, mag, laser, rusa, oc, ondah | 1–12 (todos) |
| Implante metálico en la zona | inter, us | 2,5,11 |
| Trombosis venosa activa / TVP | tens, inter, us, rusa, ondah, oc | 1,2,3,4,5,7,10,11,12 |
| Piel lesionada / herida abierta en la zona | tens, us ("infección activa en la zona") | 1,5 |
| Neoplasia activa en la zona | tens, inter, us, mag, laser, rusa, ondah, oc | 1–12 (todos) |

Cuando la comorbilidad excluye el `agentBase` del caso generado, la respuesta correcta del paso
1 pasa a ser la opción fija **"Ninguno de estos — contraindicado, derivar o posponer"**, y el
simulador no avanza al paso de sliders (se muestra la explicación y el botón "Siguiente
paciente").

Simplificación explícita (documentada, no oculta): el cruce agente↔comorbilidad es por
coincidencia textual del campo `contra` existente, no un motor de reglas clínicas completo; la
`region` del paciente es solo texto de ambientación y no condiciona si la comorbilidad aplica.

## 4. Algoritmo de generación del paciente

1. Elegir un `SIM_CASES[i]` al azar.
2. Elegir una `region` al azar de `SIM_CASES[i].regions`.
3. Elegir una `edad` al azar entre 18 y 75.
4. Con 40% de probabilidad, elegir una `SIM_COMORBILIDADES[j]` al azar y asignarla al paciente.
5. Calcular `bloqueado = comorbilidad presente && comorbilidad.excludes.includes(caso.agentBase)`.

## 5. Distractores (paso 1 — elección de agente)

Se arma un pool `ALL_TARGET_NAMES` con los 12 nombres de agente objetivo. Para el caso actual,
el pool de distractores válidos = `ALL_TARGET_NAMES` menos el propio objetivo, menos cualquier
nombre que ya figure en la lista completa de agentes válidos de ese nodo en `flujo.js` (para no
marcar como "incorrecta" una opción que en realidad también sería válida para ese cuadro). De
ese pool filtrado se toman 3 al azar.

Opciones mostradas (mezcladas al azar):
- Sin comorbilidad bloqueante: `[objetivo, distractor1, distractor2, distractor3]` (4 opciones).
- Con comorbilidad bloqueante: `[distractor1, distractor2, distractor3, "Ninguno de estos…"]`
  (4 opciones; el objetivo real no se ofrece porque sería tramposo mostrarlo como "correcto" y
  luego decir que está contraindicado — la comorbilidad se explica en la tarjeta del paciente y
  en el feedback).
- Con comorbilidad presente pero que **no** bloquea el objetivo de este caso: se agrega
  igualmente `"Ninguno de estos…"` como quinta opción (siempre incorrecta en ese caso), para que
  el usuario aprenda a evaluarla y descartarla activamente en vez de asumir que su sola presencia
  ya invalida el tratamiento.

## 6. Flujo de interacción (nueva página `page-sim`, nav "Simulador")

1. Al entrar a la página (o al hacer clic en "Nuevo paciente"), se genera un paciente y se
   renderiza la tarjeta: edad, región, fase (pill de color ya existente), síntoma/tejido,
   badge de comorbilidad si aplica, frase clínica breve compuesta por plantilla.
2. **Paso 1 — Elegir agente**: botones tipo `opt-btn`/`agent-card` (estilo ya usado en el
   flujograma). Al hacer clic se bloquean las opciones, se resalta en verde la correcta y en
   rojo la elegida si fue incorrecta, y aparece una explicación de 1-2 líneas (por qué es
   correcta/incorrecta, citando la contraindicación concreta cuando aplica).
3. Si la elección fue correcta y hay agente que dosificar → aparece el **Paso 2 — Ajustar
   parámetros**: un slider por parámetro definido en `SIM_CASES[i].target.sliders`, cada uno
   arrancando en un valor aleatorio dentro de su rango de control (no en el valor correcto).
   Un botón "Aplicar tratamiento" revela, por cada slider, ✅/❌ contra `[validMin, validMax]`,
   más un veredicto global y una nota mecanística corta (se reutiliza el texto `mech` del agente
   en el nodo original de `flujo.js` cuando existe).
4. Si la elección fue incorrecta, o correspondía "Ninguno de estos", no hay paso 2: se muestra
   la explicación y el botón "Siguiente paciente".
5. "Siguiente paciente" reinicia el ciclo desde el paso 1 con un nuevo caso generado.

## 7. Archivos afectados

- **Nuevo** `js/simulador.js`: `SIM_CASES`, `SIM_COMORBILIDADES`, generador de paciente, y
  funciones de render (`buildSim()`, manejo de los dos pasos, sliders, feedback).
- **`index.html`**:
  - Nuevo bloque de estilos `/* ─── SIMULADOR ─── */` (reutiliza `.opt-btn`, `.agent-card`,
    `.phase-pill`, `.note-box`; agrega clases nuevas acotadas a tarjeta de paciente, badge de
    comorbilidad y sliders con su etiqueta de valor en vivo).
  - Nueva `<div class="page" id="page-sim">…</div>` en `.main`.
  - Nuevo `<div class="nav-item" onclick="showPage('sim',this)">…</div>` en `<nav
    class="bottom-nav">` (al final de la lista, junto a "Pruebas").
  - Nuevo `<script src="js/simulador.js?v=1"></script>` antes de `app.js`.
- **`js/app.js`**: agregar `buildSim();` a la lista de llamadas en `/* ===== INIT ===== */`. No
  se requieren más cambios: `showPage()` ya es genérico por id.

## 8. Fuera de alcance (explícito)

- Puntaje, racha o historial persistente entre sesiones.
- Generación de casos fuera de los 12 nodos existentes (no se combinan variables libres).
- Motor de reglas clínicas para comorbilidad↔agente más allá de la coincidencia textual descrita
  en la sección 3.2.
- Validación de la región corporal contra la comorbilidad (embarazo/zona tratada) — la región es
  solo ambientación.
- Tests automatizados (la app no tiene test runner; se verifica manualmente).

## 9. Plan de verificación manual

Abrir `index.html` en el navegador y, en la pestaña "Simulador":
1. Generar ≥15 pacientes y confirmar que aparecen los 12 casos con variedad de regiones y
   edades, y que la comorbilidad aparece aproximadamente en 4 de cada 10 pacientes.
2. Para al menos un paciente con comorbilidad bloqueante, confirmar que "Ninguno de estos…" es
   la opción marcada correcta y que el flujo no ofrece el paso de sliders.
3. Para al menos un paciente sin comorbilidad, elegir el agente correcto y verificar que los 2-3
   sliders muestran ✅/❌ coherente con los rangos de la tabla de la sección 3.1.
4. Elegir deliberadamente un distractor y confirmar que la explicación mostrada tiene sentido
   clínico (no es un texto genérico).
5. Probar en viewport móvil (~400px) que la tarjeta de paciente, los botones de opción y los
   sliders no producen scroll horizontal y son usables con el pulgar.
