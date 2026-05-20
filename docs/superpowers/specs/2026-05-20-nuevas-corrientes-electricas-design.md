# Diseño: Nuevas corrientes eléctricas

**Fecha:** 2026-05-20
**Estado:** Aprobado por usuario — pendiente de implementación

---

## Resumen

Agregar 6 nuevas corrientes eléctricas a la app de Agentes Físicos:

| Corriente | Tipo | Color CSS |
|---|---|---|
| Galvánica | Tarjeta nueva | `c-gold` (nuevo) |
| Diadinámica (Bernard) | Tarjeta nueva | `c-red` (repurposado para agentes) |
| VMS | Ampliación en Corrientes Rusas | `c-purple` (existente) |
| Onda H | Tarjeta nueva | `c-indigo` (nuevo) |
| Alto voltaje (HVPC) | Tarjeta nueva | `c-orange` (nuevo) |
| Träbert (corriente 2/5) | Tarjeta nueva | `c-lime` (nuevo) |

Cada corriente nueva aparece en 4 secciones: **Referencia**, **Mecanismos**, **Tiempos** y **Flujograma**.
VMS se incorpora como modo adicional dentro de la tarjeta existente de Corrientes Rusas.

---

## Sección 1 — Referencia (`js/referencia.js`)

Cada tarjeta nueva sigue la estructura exacta de TENS e Interferencial:
- `id`, `icon`, `color`, `name`, `sub`
- `tags[]` — efectos principales (2-3 pills)
- `freq_extra_label` + `freq_extra_intro` + `freq_extra[]` — selector de parámetro secundario interactivo
- `mecanismo` — texto con `<span class="mech-highlight">` para términos clave
- `indicaciones[]` — 4-5 indicaciones con título y detalle
- `params[]` — tabla de modos clínicos (mode, mc, freq, pw, int, time, effect)
- `evidencia` — referencias bibliográficas
- `contra` — contraindicaciones en texto corrido

### 1.1 Corriente Galvánica

**Parámetro secundario:** Modo de aplicación (iontoforesis, estimulación directa, hidrogalvánica, galvanización segmentaria)

**Parámetros clínicos:**
- Corriente continua (CC), 0 Hz
- Densidad de corriente: ≤0.1 mA/cm² (límite de seguridad para evitar quemadura química)
- Electrodos siempre con paño húmedo o gel conductor
- Duración: 10-20 min · ciclos de 10-15 sesiones

**Efectos polares:**
- Ánodo (+): vasoconstricción, sedación, hipoestesia, disminución edema, reacción ácida
- Cátodo (−): vasodilatación, excitación, hiperestesia, aumento edema, reacción alcalina

**Modos clínicos:**
| Modo | Parámetros | Efecto |
|---|---|---|
| Iontoforesis | 0.1 mA/cm² · 20 min · electrodo medicado | Introducción de iones medicinales transdérmicos |
| Estimulación directa anódica | 0.05-0.1 mA/cm² · ánodo sobre zona · 10-15 min | Sedación, reducción edema crónico |
| Estimulación directa catódica | 0.05-0.1 mA/cm² · cátodo sobre zona · 10-15 min | Excitación, vasodilatación, trofismo |
| Galvanización segmentaria | 0.05 mA/cm² · electrodo paravertebral · 15-20 min | Efecto reflejo-segmentario, analgesia metamérica |
| Hidrogalvánica (baño) | 0.03-0.05 mA/cm² · agua templada · 15-20 min | Trofismo distal, úlceras, neuropatía periférica |

**Indicaciones:** iontoforesis medicada, úlceras crónicas/trofismo, dolor crónico, contracturas, edema crónico residual

**Contraindicaciones:** marcapasos/implantes, embarazo, pérdida severa de sensibilidad (riesgo quemadura química), neoplasias, tromboflebitis, piel lesionada bajo electrodo

---

### 1.2 Corriente Diadinámica (Bernard)

**Parámetro secundario:** Modo de corriente (MF, DF, CP, LP, RS, MM)

**Parámetros clínicos:**
- Derivadas de CA de red 50 Hz, rectificada. Frecuencias resultantes: 50 Hz (MF) o 100 Hz (DF) y combinaciones
- Duración sesión: 10-20 min total · ciclos de 10-12 sesiones · diario o en días alternos
- Intensidad: umbral sensitivo (hormigueo cómodo sin contracción muscular, salvo RS/LP)
- Cátodo (electrodo activo menor) sobre zona de mayor dolor o punto gatillo

**Modos (formas de onda):**
| Modo | Descripción | Hz | Efecto principal |
|---|---|---|---|
| MF (Monofase Fija) | Media onda rectificada | 50 | Sedante, trófico, muy analgésico |
| DF (Difase Fija) | Onda completa rectificada | 100 | Analgésico rápido, excitomotor leve |
| CP (Períodos Cortos) | Alternancia MF↔DF, 1 s cada una | 50↔100 | Analgésico sin acomodación nerviosa |
| LP (Períodos Largos) | Alternancia MF/DF tiempos desiguales 6-10 s | variable | Excitomotor + trofismo |
| RS (Ritmo Sincopado) | MF con interrupción rítmica | 50 interrupt. | Excitomotor intenso (EMS) |
| MM (Mod. Amplitud) | DF con modulación de amplitud | 100 modulado | Analgésico, mínima acomodación |

**Protocolo progresivo estándar en sesión:**
1. DF 2-3 min → reducción del umbral, analgesia rápida
2. CP 4-6 min → mantenimiento analgésico sin acomodación
3. MF 2-3 min → sedación, efecto trófico de cierre

**Indicaciones:** neuralgias, lumbalgia, ciática, tendinitis, esguinces subagudos, artrosis, artritis, contracturas, edema subagudo, estimulación muscular

**Contraindicaciones:**
- Absolutas: marcapasos, embarazo zona abdomino-pélvica, neoplasias, tromboflebitis/TVP, pérdida severa de sensibilidad, fiebre alta, sobre ojos/corazón/gónadas
- Relativas: piel con heridas/dermatitis, implantes metálicos en zona, epilepsia con aplicación craneal

---

### 1.3 VMS (Variable Muscle Stimulation) — ampliación en Corrientes Rusas

Se añade una nueva sección "VMS" dentro de la tarjeta existente de Corrientes Rusas, presentada como un modo adicional.

**Diferencia clave con Rusas clásicas:**
- Rusas: portadora fija 2500 Hz · modulación 50 Hz · ciclo 50%
- VMS: variación automática de la frecuencia portadora (2500 Hz → 10000 Hz) y/o de la frecuencia de modulación durante la sesión, para reducir la acomodación neuromuscular y simular patrones fisiológicos de activación motora

**Protocolos VMS:**
| Protocolo | Frecuencia base | ON/OFF | AW | Objetivo |
|---|---|---|---|---|
| Fuerza | 50-80 Hz | 6-10 s / 12-20 s | 200-400 µs | Reclutamiento tipo II, hipertrofia |
| Resistencia | 20-35 Hz | ON prolongado | 200-300 µs | Fibras tipo I, endurance |
| Fatiga adaptativa | 80-100 Hz | ciclos cortos | 300-400 µs | Adaptación atlética |
| Calentamiento previo | 1-10 Hz | continuo | 200 µs | Contracciones twitch, preparación |

**Rampa:** 1-3 s de subida siempre (evitar contracciones bruscas)
**Forma de onda:** bifásica simétrica o asimétrica compensada (sin componente galvánico neto)

---

### 1.4 Onda H (H-Wave Therapy)

**Parámetro secundario:** Objetivo terapéutico (analgesia, circulación/edema, cicatrización/neuropatía)

**Parámetros clínicos:**
- Forma de onda: exponencial de doble fase (simula potencial de acción nervioso natural)
- Frecuencia: 2-70 Hz según objetivo
- Baja frecuencia (2-10 Hz): efecto circulatorio y trófico profundo
- Alta frecuencia (50-70 Hz): analgesia por Gate Control
- Intensidad: umbral sensitivo bajo (el paciente debe notar suave hormigueo; la forma exponencial permite mayor profundidad con menor incomodidad)
- Duración: 30-60 min · ciclos de 15-20 sesiones

**Modos clínicos:**
| Modo | Hz | Efecto |
|---|---|---|
| Analgesia aguda | 50-70 Hz | Gate Control, umbral sensitivo · 20-30 min |
| Analgesia crónica | 2-10 Hz | Opioides endógenos, umbral motor suave · 30-45 min |
| Circulación / edema | 2-10 Hz | Vasodilatación profunda, bomba muscular suave · 30-60 min |
| Neuropatía / cicatrización | 2-5 Hz | Estimulación axonal, trofismo nervioso · 45-60 min |

**Mecanismo diferenciador:** La forma de onda exponencial bifásica imita el potencial de acción natural del nervio periférico, lo que permite activar fibras nerviosas con menor densidad de corriente superficial → mayor profundidad de penetración efectiva con menor sensación cutánea, y potencialmente menor fatiga nerviosa que corrientes rectangulares.

**Indicaciones:** neuropatía diabética periférica, síndrome de dolor regional complejo (SDRC), dolor crónico neuropático, edema crónico, neuropatía post-quimioterapia, linfedema, cicatrización de heridas

**Contraindicaciones:** marcapasos, embarazo, neoplasias, tromboflebitis, sobre órganos vitales

---

### 1.5 Alto Voltaje (HVPC)

**Parámetro secundario:** Polaridad del electrodo activo (negativa/edema-cicatrización inicial, positiva/bactericida-remodelación, alternada/analgesia)

**Parámetros clínicos:**
- Voltaje pico: >100V (equipos típicos 100-500V)
- Forma de onda: twin-peak monophasic pulse (doble pico monofásico)
- Ancho de pulso: 5-100 µs (<200 µs) — muy corto → baja densidad de corriente → menor riesgo de quemadura que galvánica
- Frecuencia: 1-120 Hz (pps)
- Duración: 20-60 min · 1-2 sesiones/día en heridas crónicas

**Protocolos por objetivo:**
| Objetivo | Polaridad | Hz | Duración | Mecanismo |
|---|---|---|---|---|
| Cicatrización fase inicial | Cátodo (−) sobre herida | 30-80 pps | 45-60 min · 1-2×/día | Estimula migración celular (fibroblastos, macrófagos), imita corriente de lesión bioeléctrica |
| Cicatrización fase proliferación/remodelación | Ánodo (+) sobre herida | 80-120 pps | 45-60 min · 1×/día | Bacteriostático, estimula epitelización |
| Reducción de edema | Cátodo (−) sobre edema | ~120 pps | 20-30 min | Repulsión electrostática de proteínas cargadas negativamente |
| Analgesia | Alternado o según zona | 80-120 pps | 20-30 min | Gate Control, umbral sensitivo |

**Ventaja diferenciadora frente a galvánica:** el alto voltaje de pico permite buena penetración tisular con corriente media muy baja → ausencia práctica de quemadura química (no hay acumulación electrolítica significativa).

**Indicaciones:** úlceras por presión, úlceras vasculares (venosas/arteriales), heridas de difícil cicatrización, edema postraumático/postquirúrgico, dolor agudo y crónico, espasmo muscular

**Contraindicaciones:** marcapasos/dispositivos implantados, embarazo, neoplasias, tromboflebitis, sobre ojos/corazón, aplicación transtorácica

---

### 1.6 Corriente de Träbert (Corriente 2/5 — Ultraestimulación)

**Parámetro secundario:** Zona de aplicación / localización anatómica (paravertebral, trayecto nervioso, punto gatillo, articular)

**Parámetros clínicos (fijos — característica definitoria):**
- Frecuencia: 143 Hz (fija, no modificable)
- Ancho de pulso (impulso): 2 ms
- Duración de la pausa: 5 ms → ratio 2:5, de ahí el nombre "corriente 2/5"
- Forma de onda: impulsos rectangulares monofásicos (o bifásicos en equipos modernos)
- Intensidad: 30-80 mA según zona; hormigueo intenso pero tolerable, sin contracción muscular visible
- Aplicación: continua (sin modulación de intensidad ni frecuencia durante la sesión)
- Duración: 10-20 min · ciclos de 10-15 sesiones · diario o días alternos

**Técnica de electrodo:**
- Electrodo indiferente (mayor tamaño): posición proximal a la zona dolorosa
- Electrodo activo (menor tamaño): sobre el punto de máximo dolor, trayecto nervioso o punto gatillo
- Electrodos con esponja húmeda o autoadhesivos

**Modos / zonas de aplicación:**
| Zona | Colocación | Indicación |
|---|---|---|
| Paravertebral | Bilateral, nivel metamérico afectado | Lumbalgia, dorsalgia, cervicalgia |
| Trayecto nervioso | A lo largo del nervio (proximal→distal) | Neuralgias, ciática, neuralgia intercostal |
| Punto gatillo | Electrodo activo sobre trigger point | Síndrome de dolor miofascial |
| Periarticular | Alrededor de la articulación afectada | Artrosis, artritis, dolor articular |

**Diferencias frente a TENS convencional:**
- Träbert: 143 Hz fija, AW 2 ms (largo), continua, no modulada → hormigueo profundo e intenso
- TENS convencional: 80-150 Hz variable, AW 50-80 µs (corto), modulable → hormigueo superficial

**Indicaciones:** dolor agudo y subagudo, neuralgias (intercostal, ciática, cervicobraquialgia), lumbalgia, cervicalgia, artropatías (artrosis), síndrome de dolor miofascial, dolores post-traumáticos

**Contraindicaciones:** marcapasos, implantes metálicos en zona, embarazo (zona abdominal/lumbar), neoplasias, tromboflebitis, piel dañada bajo electrodo, alteraciones severas de sensibilidad, aplicación transtorácica/sobre ojos/gónadas

---

## Sección 2 — Mecanismos (`js/mecanismos.js`)

Se agregan 5 nuevas cards al array `MECHS` (VMS no necesita card propia ya que amplía Corrientes Rusas).

### Cards nuevas:
1. **Galvánica** (`c-gold-n`) — Electroquímica iónica polar: reacciones ácido/base bajo los electrodos, migración de iones medicados (iontoforesis), corriente de lesión bioeléctrica que regula proliferación celular
2. **Diadinámica** (`c-red-n`) — Corriente rectificada de baja frecuencia: Gate Control (fibras Aβ inhiben transmisión C y Aδ), efecto galvánico de base modulable por modo, vasodilatación refleja
3. **Onda H** (`c-indigo-n`) — Forma de onda exponencial bifásica que imita el potencial de acción nervioso: activa fibras nerviosas con menor densidad de corriente superficial, mayor profundidad de penetración, menor fatiga nerviosa
4. **Alto Voltaje** (`c-orange-n`) — Twin-peak monophasic de alto voltaje de pico: imita la corriente de lesión bioeléctrica endógena, polaridad catódica estimula migración celular hacia la herida, polaridad anódica bacteriostática; bajo riesgo de quemadura por densidad de corriente media muy baja
5. **Träbert** (`c-lime-n`) — Impulso rectangular largo (2 ms) a 143 Hz fija: activa fibras Aβ de gran diámetro por Gate Control, libera opioides endógenos, mejora microcirculación local; el ancho de pulso largo (2 ms vs 50-80 µs del TENS) produce un hormigueo profundo e intenso distintivo

---

## Sección 3 — Tiempos (`js/tiempos.js`)

Se agregan pills de los nuevos agentes en las fases tisulares donde tienen indicación clínica:

| Tejido | Fase | Agentes nuevos a agregar |
|---|---|---|
| Músculo | Inflamatoria | `Diadinámica DF` |
| Músculo | Proliferativa | `Galvánica (trofismo)`, `Diadinámica CP` |
| Músculo | Remodelación | `Träbert` |
| Tendón | Inflamatoria | `Diadinámica DF` |
| Tendón | Proliferativa | `Diadinámica CP` |
| Ligamento | Inflamatoria | `Galvánica (iontoforesis AINEs)`, `Alto voltaje (edema)` |
| Ligamento | Proliferativa | `Diadinámica CP` |
| Hueso | Inflamatoria | `Galvánica (trofismo)`, `Alto voltaje` |
| Nervio | Regeneración axonal | `Onda H`, `Galvánica (trofismo)` |
| Nervio | Reinervación | `Onda H`, `VMS (músculo denervado)` |
| Piel | Hemostasia/Inflamación | `Alto voltaje (cátodo)` |
| Piel | Proliferativa | `Alto voltaje (cátodo→ánodo)`, `Galvánica (iontoforesis)` |
| Piel | Remodelación | `Alto voltaje (ánodo)` |
| Menisco | Proliferativa | `Diadinámica CP` |
| Cartílago | Proliferativa | `Diadinámica` |

---

## Sección 4 — Flujograma (`js/flujo.js`)

Se incorporan los nuevos agentes en los nodos de resultado donde son clínicamente apropiados:

| Nodo | Agentes nuevos |
|---|---|
| `r_ag_dolor` (agudo — dolor e inflamación) | `Diadinámica DF` |
| `r_ag_edema` (agudo — edema) | `Alto voltaje (cátodo, 120 Hz)` |
| `r_sub_dolor` (subagudo — dolor residual) | `Diadinámica CP`, `Träbert` |
| `r_sub_cicatriz` (subagudo — cicatrización) | `Alto voltaje`, `Galvánica (iontoforesis)` |
| `r_sub_edema` (subagudo — reabsorción edema) | `Diadinámica LP` |
| `r_sub_fuerza` (subagudo — recuperación fuerza) | `VMS` |
| `r_cr_muscular` (crónico — músculo/tejido blando) | `Träbert`, `VMS`, `Diadinámica RS` |
| `r_cr_articular` (crónico — articulación/hueso) | `Diadinámica CP/LP`, `Träbert` |
| `r_cr_neuro` (crónico — neuropático/punto gatillo) | `Onda H`, `Träbert`, `Galvánica` |

---

## Sección 5 — CSS (`index.html`)

Se agregan 5 nuevas variables de color y sus clases de tarjeta:

```css
/* Nuevas variables */
--gold:   #d4a017; --gold-bg:   rgba(212,160,23,0.13);   --gold-border:   rgba(212,160,23,0.3);
--red:    #f06b6b; /* ya existe como variable, añadir clases .c-red */
--indigo: #818cf8; --indigo-bg: rgba(129,140,248,0.13);  --indigo-border: rgba(129,140,248,0.3);
--orange: #fb923c; --orange-bg: rgba(251,146,60,0.13);   --orange-border: rgba(251,146,60,0.3);
--lime:   #84cc16; --lime-bg:   rgba(132,204,22,0.13);   --lime-border:   rgba(132,204,22,0.3);
```

Clases de tarjeta a agregar: `.c-gold`, `.c-red`, `.c-indigo`, `.c-orange`, `.c-lime` y sus equivalentes `-n` para mecanismos.

---

## Orden de implementación

1. CSS — agregar variables y clases de color nuevas
2. `js/referencia.js` — 5 tarjetas nuevas + ampliación VMS en Rusas
3. `js/mecanismos.js` — 5 cards nuevas
4. `js/tiempos.js` — pills en fases tisulares
5. `js/flujo.js` — agentes en nodos de resultado

---

## Notas de implementación

- Seguir exactamente la estructura de objetos existente (sin abstracciones nuevas)
- Todos los textos en español; solo términos técnicos en latín/inglés cuando no hay equivalente
- Las referencias bibliográficas deben mencionar autores, revista, año y tamaño de efecto cuando disponible
- Respetar el patrón de cache-buster `?v=N` en el HTML al modificar JS
