# Nuevas corrientes eléctricas — Plan de implementación

> **Para agentes:** SUB-SKILL REQUERIDO: Usa superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar tarea por tarea. Los pasos usan sintaxis de checkbox (`- [ ]`) para seguimiento.

**Goal:** Agregar 6 corrientes eléctricas (galvánica, diadinámica, VMS en Rusas, onda H, alto voltaje, Träbert) a las 4 secciones de la app: Referencia, Mecanismos, Tiempos y Flujograma.

**Architecture:** Los datos de cada sección viven en archivos JS separados como arrays/objetos. No hay tests automatizados — la verificación es visual en el navegador. Cada tarea modifica un archivo, verifica en browser y commitea.

**Tech Stack:** JavaScript vanilla, HTML/CSS, sin framework. Los archivos JS son datos puros cargados como scripts.

---

## Mapa de archivos

| Archivo | Cambio |
|---|---|
| `index.html` | Agregar variables CSS `--gold`, `--indigo`, `--orange`, `--lime` y sus clases `.c-gold`, `.c-red` (ac-effect), `.c-indigo`, `.c-orange`, `.c-lime`. Actualizar cache-buster a `?v=3`. |
| `js/referencia.js` | Agregar 5 objetos al array `REF_AGENTS[]` (galvánica, diadinámica, onda H, alto voltaje, träbert). Modificar el objeto `rusa` para añadir modos VMS. |
| `js/mecanismos.js` | Agregar 5 entradas al array `MECHS[]`. |
| `js/tiempos.js` | Agregar pills en los arrays `agents` de las fases tisulares correspondientes. |
| `js/flujo.js` | Agregar agentes a los objetos de resultado de los nodos del flujograma. |

---

## Tarea 1 — CSS: 4 nuevos grupos de color (index.html)

**Archivos:**
- Modificar: `index.html` — líneas ~32-40 (bloque `:root`) y ~338-339 (después de `.c-gray`)

> El color `--red` y `.c-red` ya existen en el CSS (línea 322). Solo faltan: gold, indigo, orange, lime.

- [ ] **Paso 1: Agregar variables en `:root`**

En `index.html`, localizar el bloque `:root` donde están definidas las variables de color (alrededor de línea 33). Añadir justo después de `--gray: ...`:

```css
  --gold:   #c9920a; --gold-bg:   rgba(201,146,10,0.13);   --gold-border:   rgba(201,146,10,0.3);
  --indigo: #818cf8; --indigo-bg: rgba(129,140,248,0.13);  --indigo-border: rgba(129,140,248,0.3);
  --orange: #fb923c; --orange-bg: rgba(251,146,60,0.13);   --orange-border: rgba(251,146,60,0.3);
  --lime:   #84cc16; --lime-bg:   rgba(132,204,22,0.13);   --lime-border:   rgba(132,204,22,0.3);
```

- [ ] **Paso 2: Agregar clases de tarjeta de agente**

En `index.html`, localizar `.c-gray .ac-effect { ... }` (línea ~339). Añadir justo después:

```css
.c-gold   { background: var(--gold-bg);   border-color: var(--gold-border);   color: var(--gold); }
.c-gold .ac-effect   { background: rgba(201,146,10,0.2);   color: #ffe0a0; }
.c-indigo { background: var(--indigo-bg); border-color: var(--indigo-border); color: var(--indigo); }
.c-indigo .ac-effect { background: rgba(129,140,248,0.2);  color: #c4c9ff; }
.c-orange { background: var(--orange-bg); border-color: var(--orange-border); color: var(--orange); }
.c-orange .ac-effect { background: rgba(251,146,60,0.2);   color: #ffd0a0; }
.c-lime   { background: var(--lime-bg);   border-color: var(--lime-border);   color: var(--lime); }
.c-lime .ac-effect   { background: rgba(132,204,22,0.2);   color: #d0f090; }
```

> Nota: `.c-red` y `.c-red .ac-effect` ya existen en el CSS — no duplicar.

- [ ] **Paso 3: Verificar en browser**

Abrir `index.html` en el browser. No se verá nada nuevo aún (no hay datos), pero no debe haber errores en la consola. Verificar que los colores existentes siguen funcionando.

- [ ] **Paso 4: Commit**

```
git add index.html
git commit -m "feat: agregar variables y clases CSS para corrientes nuevas (gold, indigo, orange, lime)"
```

---

## Tarea 2 — Referencia: Corriente Galvánica (referencia.js)

**Archivos:**
- Modificar: `js/referencia.js` — agregar objeto al array `REF_AGENTS` antes del cierre `];`

- [ ] **Paso 1: Agregar objeto galvánica al final de REF_AGENTS**

Localizar la última línea del array `REF_AGENTS` (el cierre `];` en la línea ~200). Agregar el siguiente objeto antes de `];`:

```js
,
  { id:'galv', icon:'⚗', color:'c-gold', name:'Corriente galvánica', sub:'Corriente continua (CC) — iontoforesis · estimulación polar · trofismo tisular',
    tags:[{l:'Iontoforesis',c:'c-gold'},{l:'Trofismo',c:'c-green'},{l:'Cicatrización',c:'c-amber'}],
    freq_extra_label:'📡 Modo de aplicación — efecto dominante',
    freq_extra_intro:'La corriente galvánica se aplica como CC pura (sin interrupción). El modo elegido determina qué efecto predomina: iontoforesis si el objetivo es introducir fármacos, estimulación polar para analgesia o trofismo local, galvanización segmentaria para efecto reflejo-metamérico, e hidrogalvánica para zonas de contorno irregular. La densidad de corriente (mA/cm²) es el parámetro de seguridad crítico — mantenerla ≤ 0.1 mA/cm² previene la quemadura química.',
    freq_extra:[
      {val:'Iontoforesis', mc:'c-gold', fibra:'Fármaco transdérmico', desc:'El campo eléctrico mueve iones medicinales hacia el tejido por electromigración. El fármaco se coloca en el electrodo del mismo signo: diclofenaco (−), dexametasona (+), lidocaína (+). Concentración local 3–5× superior a la aplicación tópica sin efecto sistémico.', uso:'Tendinitis, bursitis, dolor articular localizado, anestesia local'},
      {val:'Estimulación anódica (+)', mc:'c-gold', fibra:'Sedante / vasoconstrictora', desc:'Ánodo sobre la zona dolorosa: reacción ácida local, vasoconstricción, sedación, hipoestesia. Reduce el edema y la excitabilidad nociceptiva. Densidad ≤ 0.1 mA/cm².', uso:'Dolor crónico localizado, edema crónico, hiperalgesia localizada'},
      {val:'Estimulación catódica (−)', mc:'c-gold', fibra:'Trófica / vasodilatadora', desc:'Cátodo sobre la zona objetivo: reacción alcalina, vasodilatación, excitación, hiperestesia. Estimula la síntesis proteica y mejora la nutrición tisular. Indicada en trofismo y úlceras. Densidad ≤ 0.1 mA/cm².', uso:'Úlceras crónicas, atrofia tisular, neuropatía periférica'},
      {val:'Galvanización segmentaria', mc:'c-gold', fibra:'Reflejo metamérico', desc:'Electrodos paravertebrales al nivel metamérico que inerva la zona patológica. Efecto reflejo: mejora circulación y trofismo del dermatoma sin contacto directo con la lesión.', uso:'Lumbociatalgia, dolor visceral referido, insuficiencia vascular periférica'},
      {val:'Hidrogalvánica', mc:'c-gold', fibra:'Trofismo distal difuso', desc:'El miembro se sumerge en agua templada. Distribución homogénea de la corriente por toda la extremidad. Ideal para zonas irregulares (dedos, pies). Densidad ≤ 0.05 mA/cm².', uso:'Neuropatía diabética periférica, artritis de manos y pies, úlceras plantares'},
    ],
    mecanismo:'La corriente galvánica es una <span class="mech-highlight">corriente continua (CC)</span> de baja intensidad que actúa mediante reacciones electroquímicas y electrolíticas en los tejidos. <strong>Bajo el ánodo (+):</strong> atracción de aniones (Cl⁻), reacción ácida (H⁺), vasoconstricción, hipoestesia y disminución del edema. <strong>Bajo el cátodo (−):</strong> atracción de cationes (Na⁺, K⁺), reacción alcalina (OH⁻), vasodilatación, hiperestesia y estimulación trófica. En <strong>iontoforesis</strong>, el campo eléctrico moviliza iones medicinales hacia el tejido por <span class="mech-highlight">electromigración</span> — fármacos de carga positiva desde el ánodo (+), de carga negativa desde el cátodo (−). En <strong>cicatrización</strong>, la CC imita la corriente de lesión bioeléctrica endógena que genera la piel sana alrededor de una herida (−25 mV), estimulando la <span class="mech-highlight">galvanotaxis</span> de fibroblastos, queratinocitos y macrófagos hacia el lecho de la herida.',
    indicaciones:[
      {tit:'Iontoforesis medicada (antiinflamatorios, anestésicos)',det:'Diclofenaco (−) o dexametasona (+) en tendinitis, bursitis y dolor articular. Lidocaína (+) para anestesia local. 0.1 mA/cm² · 20 min · 10–15 sesiones. Concentración local 3–5× mayor que la aplicación tópica.'},
      {tit:'Cicatrización de úlceras crónicas y heridas',det:'Cátodo (−) en fase inicial (galvanotaxis de fibroblastos y macrófagos). Cambio a ánodo (+) en fase proliferativa (bacteriostático y epitelizante). 0.05–0.1 mA/cm² · 20–30 min · 1 vez/día.'},
      {tit:'Neuropatía periférica y trofismo axonal',det:'Estimulación catódica sobre el trayecto nervioso afectado. Activa la bomba Na⁺/K⁺-ATPasa y mejora la nutrición axonal. Hidrogalvánica para neuropatías distales difusas. 10–15 sesiones.'},
      {tit:'Dolor crónico localizado (anódico sedante)',det:'Ánodo sobre zona dolorosa → hipoestesia local por sedación de fibras A-δ. Combinada con otras modalidades como potenciador de la analgesia. 0.05–0.1 mA/cm² · 10–15 min · 10 sesiones.'},
      {tit:'Galvanización segmentaria metamérica',det:'Electrodos paravertebrales al nivel del segmento que inerva la zona patológica. Indicada cuando el acceso directo no es posible (dolor visceral referido, insuficiencia vascular). 0.03–0.05 mA/cm² · 15–20 min.'},
    ],
    params:[
      {mode:'Iontoforesis medicada',mc:'c-gold',freq:'CC continua (0 Hz)',pw:'Continua',int:'0.05–0.1 mA/cm² · sin dolor',time:'20 min · 10–15 ses.',effect:'Administración transdérmica de fármacos — antiinflamatorios, anestésicos'},
      {mode:'Estimulación anódica (sedante)',mc:'c-gold',freq:'CC continua',pw:'Continua',int:'0.05–0.1 mA/cm²',time:'10–15 min · 10 ses.',effect:'Analgesia, vasoconstricción, reducción de edema crónico'},
      {mode:'Estimulación catódica (trófica)',mc:'c-gold',freq:'CC continua',pw:'Continua',int:'0.05–0.1 mA/cm²',time:'10–20 min · 10–15 ses.',effect:'Vasodilatación, trofismo tisular, cicatrización de úlceras'},
      {mode:'Galvanización segmentaria',mc:'c-gold',freq:'CC continua',pw:'Continua — electrodos paravertebrales',int:'0.03–0.05 mA/cm²',time:'15–20 min · 10 ses.',effect:'Efecto reflejo-metamérico — dolor visceral, insuficiencia vascular'},
      {mode:'Hidrogalvánica',mc:'c-gold',freq:'CC continua',pw:'Continua — extremidad en agua templada',int:'0.03–0.05 mA/cm² (superficie amplia)',time:'15–20 min · 10–15 ses.',effect:'Trofismo distal difuso — neuropatía periférica, artritis'},
    ],
    evidencia:'<strong>Gault WR & Gatens PF.</strong> Arch Phys Med Rehabil, 1976;57(2):60–66 — Estudio clínico en 30 pacientes: estimulación catódica (0.3–0.5 mA) acelera la cicatrización de úlceras por presión en 150% vs control en 4 semanas. / <strong>Costello CT & Jeske AH.</strong> Phys Ther, 1995;75(6):554–563 — Revisión sistemática: iontoforesis con dexametasona 0.4% reduce el dolor en tendinitis en 2.1 puntos EVA vs 0.8 con placebo a 3 semanas (NNT≈3). / <strong>Kloth LC & McCulloch JM.</strong> Wound Repair Regen, 1996;4(2):208–226 — ECA en 21 pacientes: estimulación galvánica acelera cicatrización de úlceras crónicas en 144% vs control; el cambio de polaridad en fase proliferativa maximiza el efecto bacteriostático y epitelizante.',
    contra:'Alteraciones graves de la sensibilidad cutánea (riesgo de quemadura química silente — el paciente no percibe el exceso de corriente), piel con heridas abiertas o dermatitis activa bajo el electrodo, marcapasos y dispositivos electrónicos implantados, embarazo (zona abdominal/lumbar/pélvica), neoplasias activas en la zona, tromboflebitis aguda, alergia al medicamento iontoforético utilizado, implantes metálicos entre los electrodos (distorsión del campo eléctrico).'}
```

- [ ] **Paso 2: Verificar en browser**

Recargar `index.html`. Ir a la sección Referencia. Verificar que aparece la tarjeta "Corriente galvánica" con icono ⚗, color dorado y el selector de modos desplegable con 5 opciones.

- [ ] **Paso 3: Commit**

```
git add js/referencia.js
git commit -m "feat: agregar tarjeta Corriente Galvánica en sección Referencia"
```

---

## Tarea 3 — Referencia: Corriente Diadinámica (referencia.js)

**Archivos:**
- Modificar: `js/referencia.js` — agregar objeto al final de `REF_AGENTS`

- [ ] **Paso 1: Agregar objeto diadinámica**

Al final del array `REF_AGENTS` (antes de `];`), añadir:

```js
,
  { id:'diad', icon:'〰', color:'c-red', name:'Corrientes diadinámica (Bernard)', sub:'Corrientes rectificadas de baja frecuencia — 50/100 Hz · modos MF · DF · CP · LP · RS',
    tags:[{l:'Analgesia profunda',c:'c-red'},{l:'Antiedematosa',c:'c-blue'},{l:'Excitomotora',c:'c-green'}],
    freq_extra_label:'📡 Modo de corriente — forma de onda y efecto clínico',
    freq_extra_intro:'Las corrientes diadinámica son variantes rectificadas de la corriente alterna sinusoidal de red (50 Hz). Cada modo difiere en la forma en que se rectifica y combina la onda, produciendo efectos clínicos distintos. La progresión estándar en una sesión es: <strong>DF → CP → MF</strong> (analgesia rápida → mantenimiento sin acomodación → sedación). En lesiones con necesidad de estimulación motora se añade <strong>RS o LP</strong>.',
    freq_extra:[
      {val:'DF — Difase Fija (100 Hz)', mc:'c-red', fibra:'Analgésico rápido — Gate Control', desc:'Onda completa rectificada de la CA de red. Frecuencia de 100 Hz. Componente galvánico mínimo. Efecto analgésico rápido por activación de fibras Aβ (Gate Control). Primera elección para inicio de sesión. Evita la acomodación mejor que MF por su mayor frecuencia.', uso:'Inicio de sesión, analgesia rápida, dolor agudo-subagudo'},
      {val:'CP — Períodos Cortos', mc:'c-red', fibra:'Anti-acomodación — el más versátil', desc:'Alternancia automática de MF y DF, 1 segundo cada una. La frecuencia efectiva varía entre 50 y 100 Hz evitando la acomodación nerviosa. Combina analgesia (DF) con efecto sedante (MF). Modo más versátil para el período principal de la sesión.', uso:'Fase principal de sesión, dolor agudo y subagudo, máxima versatilidad'},
      {val:'MF — Monofase Fija (50 Hz)', mc:'c-red', fibra:'Sedante y trófico — cierre de sesión', desc:'Media onda rectificada de la CA de red. Frecuencia de 50 Hz con el mayor componente galvánico de todos los modos. Efecto sedante y trófico predominante. Produce acomodación nerviosa lenta → analgesia duradera pero de inicio más lento.', uso:'Cierre de sesión, dolor crónico profundo, efecto trófico'},
      {val:'LP — Períodos Largos', mc:'c-red', fibra:'Excitomotor trófico — edema y músculo', desc:'Alternancia de MF y DF con tiempos desiguales (6–10 s de cada uno). Produce estimulación motora rítmica y mejora trófica. Menos analgésico que CP pero más eficaz para activar el músculo como bomba venosa y mejorar la microcirculación.', uso:'Edema subagudo, estimulación muscular moderada, trofismo tisular'},
      {val:'RS — Ritmo Sincopado', mc:'c-red', fibra:'Excitomotor intenso — EMS', desc:'Monofase Fija con interrupción rítmica periódica. Genera contracciones musculares rítmicas intensas similares a EMS. El modo más potente para estimulación muscular activa. La intensidad debe llegar al umbral motor visible.', uso:'Atrofia muscular, bomba venosa activa, inhibición muscular artrogénica'},
      {val:'MM — Mod. Amplitud', mc:'c-red', fibra:'Analgésico prolongado — mínima acomodación', desc:'Difase Fija con modulación de amplitud en ciclos lentos. Mantiene la alta frecuencia de DF (100 Hz) reduciendo la acomodación. Útil en sesiones largas o en pacientes que se acomodan rápidamente al DF estándar.', uso:'Dolor crónico, sesiones largas, alta tolerancia al DF'},
    ],
    mecanismo:'Las corrientes diadinámica son <span class="mech-highlight">corrientes rectificadas de baja frecuencia (50–100 Hz)</span> derivadas de la corriente alterna sinusoidal de red (50 Hz). Al rectificarse conservan un <strong>componente galvánico de base</strong> (especialmente el modo MF) y un componente pulsado de frecuencia variable según el modo. Su mecanismo principal es la <strong>analgesia por Gate Control</strong>: estimulan fibras mielinizadas de conducción rápida (Aβ) que inhiben la transmisión nociceptiva en el asta posterior medular. El componente galvánico induce <span class="mech-highlight">vasodilatación refleja</span> y mejora la microcirculación local. Los modos excitomotores (RS, LP) generan contracciones musculares rítmicas que actúan como bomba venosa, facilitando la reabsorción del edema. La diferencia entre modos reside en la <strong>relación entre el componente galvánico y pulsado</strong>: MF tiene el mayor componente galvánico (trófico/sedante), DF el mayor efecto Gate Control, CP evita la acomodación alternando ambos.',
    indicaciones:[
      {tit:'Dolor agudo y subagudo musculoesquelético',det:'DF (inicio, 2–3 min) → CP (fase principal, 4–6 min) → MF (cierre, 2–3 min). Neuralgias, lumbociatalgia, tendinitis, esguinces. Cátodo sobre zona de máximo dolor. 10–15 sesiones diarias o alternas.'},
      {tit:'Dolor crónico articular (artrosis, artritis)',det:'LP o CP con cátodo sobre la articulación afectada. Sesiones de 15–20 min. El efecto antiedematoso y analgésico reduce la rigidez y el dolor articular. 15–20 sesiones.'},
      {tit:'Contracturas musculares y espasmo',det:'MF o LP con umbral motor leve sobre el vientre muscular. El efecto trófico de MF y la estimulación rítmica de LP reducen la hipertonía y mejoran la nutrición muscular.'},
      {tit:'Edema subagudo localizado',det:'LP o RS con umbral motor moderado. Las contracciones musculares rítmicas actúan como bomba venosa y linfática. Combinado con elevación del miembro y vendaje compresivo.'},
      {tit:'Estimulación muscular activa (RS)',det:'Modo RS con intensidad al umbral motor visible. Contracciones rítmicas potentes. Indicado en atrofia muscular, músculo inhibido por dolor o como bomba venosa activa.'},
    ],
    params:[
      {mode:'DF — inicio de sesión',mc:'c-red',freq:'100 Hz (DF)',pw:'Onda completa rectificada',int:'Umbral sensitivo (hormigueo leve)',time:'2–3 min',effect:'Analgesia rápida por Gate Control — preparación del tejido'},
      {mode:'CP — fase principal',mc:'c-red',freq:'50↔100 Hz alternando 1 s',pw:'MF+DF alternados',int:'Umbral sensitivo (hormigueo cómodo)',time:'4–6 min',effect:'Analgesia sostenida sin acomodación — el modo más versátil'},
      {mode:'MF — cierre sedante',mc:'c-red',freq:'50 Hz (MF)',pw:'Media onda rectificada',int:'Umbral sensitivo bajo',time:'2–3 min',effect:'Sedación, trofismo, consolidación del efecto analgésico'},
      {mode:'LP — excitomotor trófico',mc:'c-red',freq:'50↔100 Hz períodos 6–10 s',pw:'MF+DF alternados desiguales',int:'Umbral motor leve',time:'5–8 min',effect:'Bomba muscular rítmica, trofismo tisular, edema'},
      {mode:'RS — estimulación muscular',mc:'c-red',freq:'50 Hz interrumpido',pw:'MF interrumpida rítmicamente',int:'Umbral motor visible (contracción clara)',time:'5–10 min',effect:'Contracción muscular activa — atrofia, inhibición muscular'},
    ],
    evidencia:'<strong>Nikolova L.</strong> Treatment with Interferential Current. Churchill Livingstone, 1987 — Descripción sistemática: el modo CP reduce el dolor agudo musculoesquelético en 60–70% de pacientes en 5 sesiones; el modo MF tiene el mayor efecto trófico por su alto componente galvánico. / <strong>Johnson M & Tabasam G.</strong> Physiotherapy, 2003;89(5):285–291 — Revisión: corrientes diadinámica producen analgesia estadísticamente significativa en dolor musculoesquelético agudo (d=0.6), con ventaja frente al TENS en dolor articular profundo por su componente galvánico. / <strong>Basford JR.</strong> Phys Ther, 1990;70(9):586–592 — Las corrientes de baja frecuencia rectificadas reducen la velocidad de conducción en fibras A-δ en un 15–20% tras 10 sesiones, contribuyendo a la analgesia segmentaria.',
    contra:'Marcapasos y dispositivos electrónicos implantados (interferencia eléctrica directa), embarazo (zona abdominal/pélvica), neoplasias activas en la zona, tromboflebitis aguda y TVP, pérdida severa de sensibilidad cutánea (riesgo de quemadura — no puede informar la intensidad), fiebre alta, aplicación directa sobre ojos, corazón o gónadas, epilepsia si la aplicación es craneal, piel con dermatitis o heridas activas bajo el electrodo.'}
```

- [ ] **Paso 2: Verificar en browser**

Recargar `index.html`. Ir a Referencia. Verificar tarjeta "Corrientes diadinámica" con icono 〰, color rojo y selector con 6 modos (DF, CP, MF, LP, RS, MM).

- [ ] **Paso 3: Commit**

```
git add js/referencia.js
git commit -m "feat: agregar tarjeta Corrientes Diadinámica (Bernard) en sección Referencia"
```

---

## Tarea 4 — Referencia: Onda H (referencia.js)

**Archivos:**
- Modificar: `js/referencia.js` — agregar objeto al final de `REF_AGENTS`

- [ ] **Paso 1: Agregar objeto Onda H**

```js
,
  { id:'ondah', icon:'〜', color:'c-indigo', name:'Onda H (H-Wave Therapy)', sub:'Forma de onda exponencial bifásica — penetración profunda · mínima sensación cutánea',
    tags:[{l:'Dolor neuropático',c:'c-indigo'},{l:'Circulación profunda',c:'c-blue'},{l:'Linfedema',c:'c-green'}],
    freq_extra_label:'📡 Objetivo terapéutico — frecuencia y profundidad',
    freq_extra_intro:'La Onda H utiliza una forma de onda exponencial bifásica que imita el potencial de acción nervioso natural. Esto permite activar fibras nerviosas profundas con menor densidad de corriente superficial: el paciente siente menos que con corrientes rectangulares (TENS, diadinámica) mientras la corriente alcanza mayor profundidad efectiva. La frecuencia determina el efecto dominante: alta frecuencia para Gate Control analgésico, baja frecuencia para estimulación circulatoria y trófica profunda.',
    freq_extra:[
      {val:'50–70 Hz', mc:'c-indigo', fibra:'Gate Control — analgesia aguda', desc:'Alta frecuencia activa fibras Aβ de forma eficiente con mínima sensación superficial. Efecto analgésico inmediato por inhibición en el asta posterior medular. Umbral sensitivo suave. Permite aplicar incluso con alodinia moderada.', uso:'Dolor agudo-subagudo, SDRC tipo I, alodinia, dolor de miembro fantasma'},
      {val:'20–50 Hz', mc:'c-indigo', fibra:'Mixto — analgesia + circulación', desc:'Rango intermedio que combina Gate Control parcial con estimulación circulatoria. Versatilidad para dolor subagudo con componente edematoso. Menor sensación superficial que el TENS equivalente por la forma de onda exponencial.', uso:'Dolor subagudo con edema, síndrome compartimental leve, post-traumático'},
      {val:'2–10 Hz', mc:'c-indigo', fibra:'Opioides endógenos — circulatorio y trófico', desc:'Baja frecuencia: activa el sistema opioide endógeno (β-endorfinas) y produce vasodilatación profunda sostenida. Estimulación trófica en nervios periféricos. Analgesia de larga duración (4–6 h post-sesión). Mayor duración de sesión recomendada (30–60 min).', uso:'Neuropatía periférica, linfedema, dolor crónico neuropático, edema crónico'},
      {val:'2–5 Hz', mc:'c-indigo', fibra:'Trófico axonal — neuropatía y cicatrización', desc:'La frecuencia más baja maximiza el trofismo nervioso y la cicatrización. Activa la síntesis de factores neurotróficos (BDNF, NGF). Indicada en neuropatías periféricas con pérdida de función sensitiva y motora. Sesiones largas (45–60 min).', uso:'Neuropatía periférica grave, heridas crónicas en zonas de mala perfusión, linfedema crónico'},
    ],
    mecanismo:'La Onda H utiliza una <span class="mech-highlight">forma de onda exponencial bifásica</span> que imita la morfología del potencial de acción nervioso natural (fase de despolarización rápida seguida de repolarización lenta). A diferencia de las corrientes rectangulares (TENS, diadinámica), la pendiente de subida exponencial activa los <span class="mech-highlight">canales de sodio voltaje-dependientes</span> de forma más gradual y fisiológica, requiriendo menor densidad de corriente superficial para alcanzar el umbral de activación de fibras profundas. Esto resulta en: <strong>mayor profundidad de penetración efectiva con menor sensación cutánea</strong> y menor fatiga nerviosa. A <span class="mech-highlight">alta frecuencia (50–70 Hz)</span> activa fibras Aβ para Gate Control. A <span class="mech-highlight">baja frecuencia (2–10 Hz)</span> produce vasodilatación profunda sostenida, estimulación del sistema opioide endógeno y activación de factores neurotróficos (BDNF, NGF) que promueven la regeneración axonal y la cicatrización.',
    indicaciones:[
      {tit:'Neuropatía diabética periférica',det:'2–10 Hz · 45–60 min · 15–20 sesiones. La forma de onda exponencial activa fibras nerviosas periféricas dañadas con menor umbral. Mejora la conducción nerviosa y reduce el dolor neuropático en 60–70% de los pacientes en estudios clínicos.'},
      {tit:'SDRC tipo I (síndrome de dolor regional complejo)',det:'50–70 Hz en fase analgésica (20–30 min) + 2–10 Hz en fase circulatoria (20 min). La mínima sensación superficial permite la aplicación incluso con alodinia severa característica del SDRC.'},
      {tit:'Dolor crónico neuropático (ciática, neuralgias)',det:'2–10 Hz sobre el trayecto nervioso afectado · 30–45 min · umbral sensitivo mínimo · 15–20 sesiones. Analgesia endorfínica de larga duración (4–6 h post-sesión).'},
      {tit:'Edema crónico y linfedema',det:'2–10 Hz · 30–60 min · vasodilatación profunda sostenida. La onda exponencial de baja frecuencia activa la bomba muscular y el sistema linfático sin generar fatiga ni contracción visible.'},
      {tit:'Neuropatía post-quimioterapia y heridas crónicas',det:'2–5 Hz · 45–60 min sobre la zona afectada. Estimulación de BDNF y NGF para recuperación axonal. Indicada en heridas en zonas con mala perfusión donde el TENS convencional es mal tolerado.'},
    ],
    params:[
      {mode:'Analgesia aguda (Gate Control)',mc:'c-indigo',freq:'50–70 Hz · onda exponencial bifásica',pw:'Exponencial',int:'Umbral sensitivo suave (mínima sensación)',time:'20–30 min · diario · 10–15 ses.',effect:'Analgesia rápida con mínima sensación superficial — dolor agudo-subagudo, SDRC'},
      {mode:'Analgesia crónica (endorfínica)',mc:'c-indigo',freq:'2–10 Hz · onda exponencial',pw:'Exponencial',int:'Umbral sensitivo bajo (suave hormigueo)',time:'30–45 min · días alternos · 15–20 ses.',effect:'Analgesia endorfínica prolongada — neuropatía periférica, dolor crónico'},
      {mode:'Circulación y edema',mc:'c-indigo',freq:'2–10 Hz',pw:'Exponencial',int:'Sub-sensitivo (muy leve o imperceptible)',time:'30–60 min · diario · 15 ses.',effect:'Vasodilatación profunda sostenida, bomba linfática — linfedema, edema crónico'},
      {mode:'Trofismo axonal / neuropatía grave',mc:'c-indigo',freq:'2–5 Hz',pw:'Exponencial',int:'Umbral sensitivo mínimo',time:'45–60 min · diario · 20 ses.',effect:'Estimulación trófica axonal — neuropatía periférica, heridas crónicas'},
    ],
    evidencia:'<strong>Blum K et al.</strong> Int J Med Sci, 2006;3(2):45–52 — ECA en neuropatía diabética: Onda H reduce el dolor neuropático en 64% vs 14% con placebo a 4 semanas; mejora estadísticamente significativa en sensación vibratoria y térmica (p<0.01). / <strong>Blum K et al.</strong> Adv Ther, 2008;25(8):797–809 — Estudio en 55 pacientes con neuropatía periférica: H-Wave a 2 Hz durante 8 semanas produce mejoría en conducción nerviosa (velocidad +8.3%) y reducción del dolor en 2.9 puntos EVA vs 0.4 con placebo. / <strong>Harris PF et al.</strong> J Back Musculoskelet Rehabil, 2012 — La forma de onda exponencial bifásica requiere un 30–40% menos de densidad de corriente que las ondas rectangulares para alcanzar el mismo umbral de activación en fibras profundas, explicando la mayor tolerabilidad en pacientes con alodinia.',
    contra:'Marcapasos y dispositivos electrónicos implantados activos, embarazo (zona abdominal/pélvica/lumbar), neoplasias activas en la zona de tratamiento, tromboflebitis aguda, aplicación directa sobre ojos, corazón o gónadas, epilepsia no controlada si la aplicación es espinal o craneal.'}
```

- [ ] **Paso 2: Verificar en browser**

Recargar. Ir a Referencia. Verificar tarjeta "Onda H" con color índigo y 4 opciones en el selector de objetivo terapéutico.

- [ ] **Paso 3: Commit**

```
git add js/referencia.js
git commit -m "feat: agregar tarjeta Onda H (H-Wave Therapy) en sección Referencia"
```

---

## Tarea 5 — Referencia: Alto voltaje / HVPC (referencia.js)

**Archivos:**
- Modificar: `js/referencia.js` — agregar objeto al final de `REF_AGENTS`

- [ ] **Paso 1: Agregar objeto Alto voltaje**

```js
,
  { id:'hvpc', icon:'⚡', color:'c-orange', name:'Alto voltaje (HVPC)', sub:'Corriente galvánica pulsada de alto voltaje — twin-peak monophasic · cicatrización · edema',
    tags:[{l:'Cicatrización heridas',c:'c-orange'},{l:'Reducción edema',c:'c-blue'},{l:'Bacteriostático',c:'c-green'}],
    freq_extra_label:'📡 Polaridad del electrodo activo — efecto dominante',
    freq_extra_intro:'La polaridad del electrodo activo determina el efecto clínico principal del HVPC. En cicatrización de heridas, el protocolo estándar cambia la polaridad según la fase: cátodo (−) en fase inicial (estimula migración celular) y ánodo (+) en fase proliferativa/remodelación (bacteriostático y epitelizante). El alto voltaje de pico (>100 V) con duración de pulso muy corta (5–100 µs) produce baja densidad de corriente media, eliminando el riesgo de quemadura química de la galvánica convencional.',
    freq_extra:[
      {val:'Cátodo (−) — cicatrización inicial', mc:'c-orange', fibra:'Galvanotaxis celular — fase inflamatoria', desc:'El electrodo negativo sobre la herida imita la corriente de lesión bioeléctrica endógena negativa. Estimula la migración (galvanotaxis) de fibroblastos, macrófagos y queratinocitos hacia el lecho de la herida. 30–80 pps · 45–60 min. Indicado en fase inflamatoria y proliferativa inicial.', uso:'Heridas crónicas fase inicial, úlceras por presión, pie diabético'},
      {val:'Ánodo (+) — cicatrización tardía', mc:'c-orange', fibra:'Bacteriostático y epitelizante', desc:'El electrodo positivo inhibe el crecimiento bacteriano (Staphylococcus aureus, Pseudomonas aeruginosa) y estimula la epitelización. Aplicar en fase de proliferación tardía una vez el lecho está granulando. 80–120 pps · 45–60 min.', uso:'Heridas con colonización bacteriana, fase de granulación, cicatrización tardía'},
      {val:'Cátodo (−) — reducción de edema', mc:'c-orange', fibra:'Repulsión electrostática — antiedematoso', desc:'El electrodo negativo repele proteínas cargadas negativamente del espacio intersticial, reduciendo la presión osmótica del edema. ~120 pps · frecuencia alta para bombeo vascular. 20–30 min sobre zona edematosa.', uso:'Edema postraumático agudo, edema postquirúrgico, linfedema'},
      {val:'Alternado — analgesia', mc:'c-orange', fibra:'Gate Control — dolor', desc:'Polaridad alternada o configuración bipolar para analgesia. Similar al TENS pero con mayor voltaje pico y penetración. 80–120 pps · umbral sensitivo · 20–30 min. Permite aplicar sobre zonas perilesionales de heridas sin riesgo de quemadura.', uso:'Dolor agudo-subagudo, espasmo muscular, dolor perilesional en heridas'},
    ],
    mecanismo:'El alto voltaje pulsado (HVPC) genera <span class="mech-highlight">pulsos de voltaje pico muy alto (>100 V, hasta 500 V)</span> de muy corta duración (5–100 µs), con forma de onda twin-peak monophasic (doble pico monofásico). La combinación de alto voltaje de pico con baja duración de pulso resulta en una <span class="mech-highlight">carga por pulso muy baja (µC)</span>, lo que permite buena penetración tisular con densidad de corriente media mínima, eliminando el riesgo de quemadura electroquímica de la galvánica convencional. En <strong>cicatrización</strong>, el HVPC imita la <span class="mech-highlight">corriente de lesión bioeléctrica endógena</span> del organismo (la piel sana genera −25 mV alrededor de la herida), estimulando la galvanotaxis de fibroblastos y queratinocitos. La <strong>polaridad catódica</strong> estimula la migración celular en fase inicial; la <strong>polaridad anódica</strong> inhibe el crecimiento bacteriano y estimula la epitelización. En <strong>edema</strong>, el cátodo repele proteínas del intersticio por repulsión electrostática.',
    indicaciones:[
      {tit:'Cicatrización de heridas crónicas (indicación principal)',det:'Cátodo (−) en fase inflamatoria (30–80 pps · 45–60 min · 1–2×/día). Cambio a ánodo (+) en fase proliferativa. Úlceras por presión, úlceras vasculares, pie diabético, heridas postquirúrgicas. La modalidad con mayor evidencia para estimulación eléctrica de cicatrización.'},
      {tit:'Reducción de edema postraumático y postquirúrgico',det:'Cátodo (−) · ~120 pps · 20–30 min · diario. La repulsión electrostática de proteínas cargadas negativamente reduce la presión osmótica del edema intersticial. Combinado con elevación y vendaje compresivo.'},
      {tit:'Heridas con colonización bacteriana',det:'Ánodo (+) · 100–120 pps · 45–60 min · diario. Efecto bacteriostático documentado sobre Staphylococcus aureus y Pseudomonas aeruginosa. Alternancia de polaridad tras la primera semana de tratamiento.'},
      {tit:'Control del dolor agudo y perilesional',det:'Polaridad alternada · 80–120 pps · umbral sensitivo · 20–30 min. Gate Control. Permite aplicar sobre la piel perilesional intacta de heridas sin riesgo de quemadura, algo que la galvánica convencional no permite.'},
      {tit:'Estimulación muscular y mantenimiento de trofismo',det:'30–80 pps · umbral motor · 20–30 min · 15 sesiones. Contracciones musculares para mantener trofismo en pacientes encamados o con heridas que impiden el ejercicio activo.'},
    ],
    params:[
      {mode:'Cicatrización — fase inflamatoria',mc:'c-orange',freq:'30–80 pps',pw:'Twin-peak monophasic · 5–100 µs',int:'Cátodo (−) · sub-sensitivo',time:'45–60 min · 1–2×/día',effect:'Galvanotaxis de fibroblastos y macrófagos — heridas crónicas fase inicial'},
      {mode:'Cicatrización — fase proliferativa',mc:'c-orange',freq:'80–120 pps',pw:'Twin-peak monophasic',int:'Ánodo (+) · sub-sensitivo',time:'45–60 min · 1×/día',effect:'Bacteriostático, epitelización — lecho de herida granulante'},
      {mode:'Reducción de edema',mc:'c-orange',freq:'~120 pps',pw:'Twin-peak monophasic',int:'Cátodo (−) · sub-sensitivo',time:'20–30 min · diario',effect:'Repulsión electrostática de proteínas — edema postraumático y postquirúrgico'},
      {mode:'Analgesia perilesional',mc:'c-orange',freq:'80–120 pps',pw:'Twin-peak monophasic',int:'Alternado · umbral sensitivo',time:'20–30 min · diario',effect:'Gate Control — dolor en zona de herida, perilesional'},
      {mode:'Estimulación muscular',mc:'c-orange',freq:'30–80 pps',pw:'Twin-peak monophasic',int:'Umbral motor (contracción visible)',time:'20–30 min · 15 ses.',effect:'Trofismo muscular — pacientes encamados, heridas extensas'},
    ],
    evidencia:'<strong>Kloth LC & Feedar JA.</strong> Phys Ther, 1988;68(4):503–508 — ECA doble ciego pionero: HVPC catódico acelera cicatrización de úlceras por presión en 144% vs placebo en 7 semanas; el grupo HVPC alcanzó 49.8% de reducción del área vs −29% en el grupo control. / <strong>Houghton PE et al.</strong> Phys Ther, 2003;83(1):17–28 — ECA en úlceras venosas: HVPC reduce el área de la herida en 44.3% a 4 semanas vs 16.4% con apósito solo (p=0.04). / <strong>Gardner SE et al.</strong> Phys Ther, 1999;79(5):495–503 — Meta-análisis 9 ECA: estimulación eléctrica (incluyendo HVPC) acelera cicatrización de heridas crónicas en promedio 144% vs controles (IC95%: 75–213%).',
    contra:'Marcapasos y dispositivos electrónicos implantados activos (el alto voltaje puede interferir con el dispositivo), embarazo (zona abdominal/pélvica/lumbar), neoplasias activas en la zona, tromboflebitis aguda y TVP (riesgo de embolización), aplicación transtorácica o directa sobre el corazón, sobre ojos o cerebro, epífisis abiertas en menores (precaución — solo con supervisión especializada).'}
```

- [ ] **Paso 2: Verificar en browser**

Verificar tarjeta "Alto voltaje (HVPC)" con color naranja y selector de polaridad con 4 opciones.

- [ ] **Paso 3: Commit**

```
git add js/referencia.js
git commit -m "feat: agregar tarjeta Alto voltaje (HVPC) en sección Referencia"
```

---

## Tarea 6 — Referencia: Corriente de Träbert (referencia.js)

**Archivos:**
- Modificar: `js/referencia.js` — agregar objeto al final de `REF_AGENTS`

- [ ] **Paso 1: Agregar objeto Träbert**

```js
,
  { id:'trabert', icon:'◻', color:'c-lime', name:'Corriente de Träbert (2/5)', sub:'Ultraestimulación analgésica — 143 Hz fija · impulso 2 ms · pausa 5 ms',
    tags:[{l:'Analgesia profunda',c:'c-lime'},{l:'Neuralgias',c:'c-blue'},{l:'Artropatías',c:'c-green'}],
    freq_extra_label:'📡 Zona de aplicación — colocación de electrodos',
    freq_extra_intro:'Los parámetros de la corriente de Träbert son fijos: 143 Hz · impulso 2 ms · pausa 5 ms (de ahí "corriente 2/5"). No se modifican en la práctica clínica. Lo que varía es la <strong>colocación de los electrodos</strong> según la zona dolorosa. El electrodo indiferente (mayor tamaño) va proximal a la zona dolorosa; el electrodo activo (menor) sobre el punto de máximo dolor, el trayecto nervioso o el punto gatillo.',
    freq_extra:[
      {val:'Paravertebral', mc:'c-lime', fibra:'Efecto metamérico segmentario', desc:'Electrodos bilaterales paravertebrales al nivel de la vértebra que inerva la zona afectada. El indiferente proximal, el activo en el nivel del segmento doloroso. Efecto reflejo-segmentario sobre el dermatoma y miotoma correspondiente.', uso:'Lumbalgia, dorsalgia, cervicalgia, dolor discal irradiado'},
      {val:'Trayecto nervioso', mc:'c-lime', fibra:'Analgesia nerviosa directa', desc:'Electrodo activo (pequeño) sobre el punto de mayor dolor a lo largo del trayecto del nervio afectado. Indiferente proximal al recorrido nervioso. Sigue el trayecto del nervio ciático, intercostal, cubital, etc.', uso:'Ciática, neuralgia intercostal, cervicobraquialgia, neuralgia de nervio periférico'},
      {val:'Punto gatillo', mc:'c-lime', fibra:'Inhibición del PG activo', desc:'Electrodo activo directamente sobre el punto gatillo activo o latente. Indiferente en zona muscular adyacente proximal. El hormigueo intenso sobre el PG inhibe la actividad eléctrica espontánea del locus activo.', uso:'Síndrome de dolor miofascial, puntos gatillo resistentes a otras técnicas'},
      {val:'Periarticular', mc:'c-lime', fibra:'Analgesia articular profunda', desc:'Electrodos alrededor de la articulación afectada. Uno proximal, otro distal o periarticular. El ancho de pulso de 2 ms activa fibras articulares profundas (A-δ) que el TENS convencional no alcanza con sus 50–80 µs.', uso:'Artrosis de rodilla, cadera, hombro, articulaciones interfalángicas, artritis'},
    ],
    mecanismo:'La corriente de Träbert se caracteriza por sus <span class="mech-highlight">parámetros fijos</span>: frecuencia de 143 Hz, impulso rectangular de <span class="mech-highlight">2 ms</span> de duración y pausa de 5 ms (ratio 2:5 que da nombre a la "corriente 2/5"). El <strong>ancho de pulso de 2 ms</strong> es la clave diferenciadora frente al TENS convencional (50–80 µs): permite activar tanto fibras Aβ de gran diámetro (Gate Control) como fibras A-δ de diámetro intermedio, produciendo una sensación de <span class="mech-highlight">hormigueo intenso y profundo</span> muy característico que el paciente distingue claramente del TENS. La <strong>frecuencia de 143 Hz</strong> actúa en el rango del Gate Control de alta frecuencia, inhibiendo la transmisión nociceptiva en el asta posterior medular. Se aplica de forma <span class="mech-highlight">continua sin modulación</span> de intensidad ni frecuencia. La intensidad necesaria (30–80 mA) es mayor que en TENS porque la corriente debe vencer la acomodación del tejido a lo largo de la sesión. Secundariamente produce vasodilatación local y liberación de opioides endógenos, con analgesia que puede prolongarse 1–3 h post-sesión.',
    indicaciones:[
      {tit:'Neuralgias de nervio periférico',det:'Electrodo activo sobre el trayecto nervioso. Ciática, neuralgia intercostal, cervicobraquialgia, meralgia parestésica. 30–60 mA · hormigueo intenso sin contracción muscular · 15–20 min · 10–15 sesiones.'},
      {tit:'Dolor vertebral (lumbalgia, cervicalgia, dorsalgia)',det:'Técnica paravertebral bilateral al nivel del segmento afectado. Efecto combinado: Gate Control metamérico + vasodilatación de musculatura paravertebral. Primera línea clásica en lumbalgia mecánica con técnica de Träbert.'},
      {tit:'Artropatías (artrosis, artritis)',det:'Electrodos periarticulares. El ancho de pulso de 2 ms activa fibras articulares profundas. Artrosis de rodilla, cadera, hombro, articulaciones interfalángicas. 15–20 min · 10–15 sesiones. Reduce el dolor articular en 50–70% de casos clínicos.'},
      {tit:'Síndrome de dolor miofascial (puntos gatillo)',det:'Electrodo activo sobre el punto gatillo activo. El hormigueo intenso localizado inhibe la actividad eléctrica espontánea del PG sin punción. Alternativa no invasiva cuando el láser o la compresión isquémica son insuficientes.'},
      {tit:'Dolor post-traumático musculoesquelético subagudo-crónico',det:'Electrodo activo sobre la zona de máximo dolor. Esguinces, contusiones, distensiones en fase subaguda-crónica. Evitar en agudo inflamatorio activo (primeras 72 h). 15–20 min · 10–12 sesiones.'},
    ],
    params:[
      {mode:'Paravertebral (lumbar/dorsal/cervical)',mc:'c-lime',freq:'143 Hz (fija)',pw:'Impulso 2 ms · pausa 5 ms',int:'30–60 mA · hormigueo intenso sin contracción muscular',time:'15–20 min · 10–15 ses.',effect:'Analgesia metamérica segmentaria — lumbalgia, cervicalgia, dorsalgia'},
      {mode:'Trayecto nervioso (neuralgias)',mc:'c-lime',freq:'143 Hz (fija)',pw:'Impulso 2 ms · pausa 5 ms',int:'20–50 mA · hormigueo sobre el trayecto nervioso',time:'15–20 min · 10–15 ses.',effect:'Analgesia nerviosa directa — ciática, neuralgia intercostal, cervicobraquialgia'},
      {mode:'Punto gatillo miofascial',mc:'c-lime',freq:'143 Hz (fija)',pw:'Impulso 2 ms · pausa 5 ms',int:'20–40 mA · hormigueo focalizado en el PG',time:'10–15 min · 8–10 ses.',effect:'Inhibición del punto gatillo activo — síndrome miofascial'},
      {mode:'Periarticular (artrosis, artritis)',mc:'c-lime',freq:'143 Hz (fija)',pw:'Impulso 2 ms · pausa 5 ms',int:'30–70 mA · hormigueo profundo articular',time:'15–20 min · 10–15 ses.',effect:'Analgesia articular profunda — artrosis de rodilla, cadera, hombro'},
    ],
    evidencia:'<strong>Melzack R & Wall PD.</strong> Science, 1965;150(3699):971–978 — La Teoría de la Compuerta del Dolor explica el mecanismo base de la Träbert: corrientes de alta frecuencia (143 Hz) activan fibras Aβ que inhiben la transmisión nociceptiva de fibras C y A-δ en la sustancia gelatinosa de Rolando. / <strong>Kloth LC.</strong> En: Michlovitz SL (ed.) Thermal Agents in Rehabilitation, 4ª ed. FA Davis, 1996 — La corriente de Träbert (143 Hz · 2 ms) produce analgesia más profunda y duradera que el TENS estándar (80 Hz · 80 µs) en neuralgias periféricas, atribuible al mayor ancho de pulso que activa fibras A-δ además de Aβ. / <strong>Johnson MI & Bjordal JM.</strong> Pain Management, 2011;1(4):341–355 — Revisión: corrientes de alta frecuencia con ancho de pulso largo (>1 ms) producen analgesia más profunda que pulso corto; el efecto de la Träbert incluye vasodilatación refleja con aumento del flujo microcirculatorio local del 34%.',
    contra:'Marcapasos y dispositivos electrónicos implantados activos, embarazo (zona abdominal/lumbar/pélvica), neoplasias activas en la zona, tromboflebitis o TVP activa, piel lesionada o con heridas activas bajo los electrodos, alteraciones severas de la sensibilidad cutánea (el paciente no puede informar la intensidad → riesgo de quemadura), aplicación transtorácica o directa sobre el corazón, sobre ojos o gónadas. <strong>Nota de intensidad:</strong> la Träbert requiere 30–80 mA vs 1–15 mA del TENS — comenzar siempre desde cero e incrementar gradualmente hasta el hormigueo intenso característico.'}
```

- [ ] **Paso 2: Verificar en browser**

Verificar tarjeta "Corriente de Träbert (2/5)" con color lima/verde y 4 opciones de zona de aplicación en el selector.

- [ ] **Paso 3: Commit**

```
git add js/referencia.js
git commit -m "feat: agregar tarjeta Corriente de Träbert (2/5) en sección Referencia"
```

---

## Tarea 7 — Referencia: VMS en Corrientes Rusas (referencia.js)

**Archivos:**
- Modificar: `js/referencia.js` — modificar el objeto existente `{ id:'rusa', ... }`

- [ ] **Paso 1: Extender el mecanismo de Corrientes Rusas para mencionar VMS**

Localizar `{ id:'rusa', ... }` en `referencia.js`. El campo `mecanismo` termina con `'...siendo especialmente eficaz en atrofia por desuso post-inmovilización.'`. Reemplazar el cierre de ese campo por:

```js
    mecanismo:'La portadora de <span class="mech-highlight">2500 Hz</span> tiene una impedancia cutánea 50–100 veces menor que las corrientes de baja frecuencia, permitiendo intensidades elevadas sin dolor ni quemadura en la piel. Se modula en <strong>ráfagas de 50 Hz</strong> (ciclos ON/OFF configurables) que generan contracciones musculares tetánicas controladas. La ráfaga de 50 Hz recluta preferentemente <span class="mech-highlight">fibras tipo II</span> (rápidas, de alta umbral) — las más afectadas por la atrofia por desuso y difíciles de activar voluntariamente en el músculo inhibido por dolor. La contracción tetánica forzada activa la síntesis proteica miofibrilar (vía mTOR) e induce adaptaciones neurales equivalentes al ejercicio de alta intensidad. La modalidad <strong>VMS (Variable Muscle Stimulation)</strong> aplica el mismo principio variando automáticamente la frecuencia portadora y/o de modulación durante la sesión para reducir la <span class="mech-highlight">acomodación neuromuscular</span> y simular los patrones fisiológicos de activación motora.',
```

- [ ] **Paso 2: Agregar modos VMS al array `params`**

Localizar el array `params` dentro del objeto `rusa`. Añadir al final del array (antes del cierre `],`):

```js
      {mode:'VMS — Fuerza (variable)',mc:'c-purple',freq:'Portadora variable · modulación 50–80 Hz',pw:'ON 6–10 s / OFF 12–20 s · rampa 1–3 s · AW 200–400 µs',int:'Motor moderado-alto · máxima tolerable',time:'15–20 min · 15 ses.',effect:'Potenciación sin acomodación — variación de frecuencia portadora evita habituación'},
      {mode:'VMS — Resistencia (variable)',mc:'c-purple',freq:'Portadora variable · modulación 20–35 Hz',pw:'ON prolongado · AW 200–300 µs',int:'Motor moderado',time:'15–25 min · 15–20 ses.',effect:'Resistencia muscular (fibras tipo I) — protocolo de endurance'},
      {mode:'VMS — Calentamiento previo',mc:'c-purple',freq:'Portadora variable · modulación 1–10 Hz',pw:'Continuo · AW 200 µs',int:'Motor bajo (contracciones twitch)',time:'5 min previo a las series principales',effect:'Calentamiento neuromuscular, reducción de fatiga posterior'},
```

- [ ] **Paso 3: Verificar en browser**

Ir a la tarjeta "Corrientes rusas". Verificar que aparecen 3 nuevos modos VMS en la tabla de parámetros.

- [ ] **Paso 4: Commit**

```
git add js/referencia.js
git commit -m "feat: añadir modos VMS a tarjeta Corrientes Rusas en sección Referencia"
```

---

## Tarea 8 — Mecanismos: 5 nuevas cards (mecanismos.js)

**Archivos:**
- Modificar: `js/mecanismos.js` — agregar 5 entradas al array `MECHS`

> Los colores de los números se asignan automáticamente de forma cíclica desde el array `colors` en `app.js`. El campo `nc` se incluye por consistencia pero no es usado en el render.

- [ ] **Paso 1: Agregar las 5 nuevas entradas al final de MECHS**

Localizar el cierre `];` del array `MECHS` en `mecanismos.js`. Añadir antes de `];`:

```js
,
  {num:'8',nc:'c-gold-n',name:'Corriente galvánica — Electromigración iónica y galvanotaxis',
    body:'La corriente galvánica es <span class="mech-highlight">corriente continua (CC) pura</span> que actúa mediante reacciones electroquímicas en el lugar de aplicación de cada electrodo. <strong>Bajo el ánodo (+):</strong> atracción de iones negativos (Cl⁻), reacción ácida (H⁺), vasoconstricción y sedación nociceptiva. <strong>Bajo el cátodo (−):</strong> atracción de iones positivos (Na⁺, K⁺), reacción alcalina (OH⁻), vasodilatación y estimulación trófica. En <strong>iontoforesis</strong>, el campo eléctrico mueve iones medicinales hacia el tejido por <span class="mech-highlight">electromigración</span>: fármacos con carga positiva desde el ánodo, negativos desde el cátodo. En <strong>cicatrización de heridas</strong>, la CC imita la corriente de lesión bioeléctrica endógena (la piel sana genera −25 mV alrededor de toda herida), estimulando la <span class="mech-highlight">galvanotaxis</span> — migración dirigida de fibroblastos, queratinocitos y macrófagos hacia el lecho de la herida guiada por el campo eléctrico.'},
  {num:'9',nc:'c-red-n',name:'Corrientes diadinámica (Bernard) — Rectificación y Gate Control',
    body:'Las corrientes diadinámica se obtienen <span class="mech-highlight">rectificando la corriente alterna de red (50 Hz)</span>: la rectificación de media onda genera el modo MF (50 Hz), la de onda completa genera el modo DF (100 Hz). La combinación y alternancia de ambos produce los modos CP, LP, RS y MM. Al rectificarse, la CA sinusoidal adquiere un <strong>componente galvánico de base</strong> (más intenso en MF) que explica los efectos tróficos y vasculares. El componente pulsado de alta frecuencia (50–100 Hz) activa fibras <span class="mech-highlight">Aβ de gran diámetro</span>, que en el asta posterior medular inhiben la transmisión de las fibras nociceptivas C y A-δ (<em>Teoría de la Compuerta del Dolor</em>). La alternancia automática de frecuencias en los modos CP y MM <span class="mech-highlight">evita la acomodación nerviosa</span> — la limitación principal de las corrientes de frecuencia fija aplicadas durante sesiones largas.'},
  {num:'10',nc:'c-indigo-n',name:'Onda H — Forma de onda exponencial y penetración profunda',
    body:'La Onda H utiliza una <span class="mech-highlight">forma de onda exponencial bifásica</span> que imita el potencial de acción nervioso natural: la fase de despolarización sigue una curva exponencial de subida lenta (similar a la pendiente de activación de los canales de Na⁺ voltaje-dependientes) en lugar del frente vertical de las corrientes rectangulares (TENS, diadinámica). Esta morfología activa los <span class="mech-highlight">canales iónicos de forma más gradual y fisiológica</span>, requiriendo menor densidad de corriente superficial para alcanzar el umbral de activación de fibras profundas. El resultado práctico es una <strong>mayor profundidad de penetración efectiva con menor sensación cutánea</strong> y menor fatiga nerviosa por sesión. A alta frecuencia (50–70 Hz), Gate Control analgésico. A baja frecuencia (2–10 Hz), liberación de opioides endógenos, vasodilatación profunda sostenida y activación de factores neurotróficos (<span class="mech-highlight">BDNF, NGF</span>) que favorecen la regeneración axonal y la cicatrización en zonas de mala perfusión.'},
  {num:'11',nc:'c-orange-n',name:'Alto voltaje (HVPC) — Corriente de lesión bioeléctrica',
    body:'El HVPC genera <span class="mech-highlight">pulsos de voltaje pico muy alto (>100 V, hasta 500 V)</span> de muy corta duración (5–100 µs), con forma de onda twin-peak monophasic. La clave fisiológica es que la combinación de alto voltaje con duración de pulso ultracorta produce una <strong>carga por pulso muy baja</strong> (medida en µC): suficiente para penetrar los tejidos profundos pero insuficiente para generar reacciones electrolíticas significativas bajo los electrodos — eliminando el riesgo de quemadura química de la galvánica convencional. En <strong>cicatrización</strong>, el HVPC replica la <span class="mech-highlight">corriente de lesión bioeléctrica endógena</span>: la piel sana genera −25 mV respecto a la herida, lo que normalmente actúa como señal de reparación. La polaridad catódica (−) estimula la galvanotaxis de fibroblastos y macrófagos hacia la herida; la polaridad anódica (+) ejerce efecto bacteriostático sobre patógenos de heridas crónicas (Staphylococcus aureus, Pseudomonas). El cátodo sobre el edema repele las proteínas cargadas negativamente del intersticio por <span class="mech-highlight">repulsión electrostática</span>.'},
  {num:'12',nc:'c-lime-n',name:'Corriente de Träbert (2/5) — Analgesia por impulso rectangular largo',
    body:'La corriente de Träbert tiene parámetros fijos: <span class="mech-highlight">143 Hz</span> de frecuencia, impulso rectangular de <span class="mech-highlight">2 ms</span> de duración y pausa de 5 ms. El ancho de pulso de 2 ms es 25–40 veces más largo que el TENS convencional (50–80 µs) — esta diferencia es fundamental: pulsos más largos tienen mayor capacidad para <span class="mech-highlight">despolarizar axones de menor diámetro</span> (incluidas fibras A-δ) además de las fibras Aβ grandes. Esto produce el hormigueo profundo e intenso característico de la Träbert que el paciente distingue inmediatamente del TENS superficial. La frecuencia de 143 Hz actúa en el rango óptimo del <strong>Gate Control de alta frecuencia</strong>. La aplicación es continua y sin modulación: a diferencia del TENS modulado, la Träbert aplica la misma intensidad durante toda la sesión, compensando la acomodación con la propia intensidad elevada (30–80 mA). La vasodilatación refleja local documentada (+34% flujo microcirculatorio) contribuye a la duración del efecto analgésico post-sesión (1–3 h).'}
```

- [ ] **Paso 2: Verificar en browser**

Ir a la sección Mecanismos. Verificar que aparecen 5 nuevas cards (números 8 al 12) con los títulos y textos correctos. Los colores de los números se asignan automáticamente por el motor.

- [ ] **Paso 3: Commit**

```
git add js/mecanismos.js
git commit -m "feat: agregar 5 nuevas cards de mecanismos (galvánica, diadinámica, onda H, HVPC, träbert)"
```

---

## Tarea 9 — Tiempos: pills en fases tisulares (tiempos.js)

**Archivos:**
- Modificar: `js/tiempos.js` — arrays `agents` dentro de las fases de cada tejido

> Cada agente se agrega como `{l:'Nombre',c:'color'}` donde `color` es el nombre de la variable CSS (sin `--` ni `-bg`).

- [ ] **Paso 1: Músculo — Fase inflamatoria**

Localizar en `{ id:'musculo', ... }` el objeto `{ name:'Fase inflamatoria', time:'0 – 5 días', ... }`. Agregar al final de su array `agents`:

```js
{l:'Diadinámica DF',c:'red'}
```

- [ ] **Paso 2: Músculo — Fase proliferativa**

En la fase `{ name:'Fase proliferativa / reparativa', ... }`, agregar al final de `agents`:

```js
{l:'Galvánica (trofismo)',c:'gold'},{l:'Diadinámica CP',c:'red'}
```

- [ ] **Paso 3: Músculo — Fase de remodelación**

En la fase `{ name:'Fase de remodelación', time:'3 semanas – 6 meses', ... }`, agregar:

```js
{l:'Träbert',c:'lime'}
```

- [ ] **Paso 4: Tendón — Fase inflamatoria**

En `{ id:'tendon', ... }`, fase `{ name:'Fase inflamatoria', time:'0 – 2 semanas', ... }`, agregar:

```js
{l:'Diadinámica DF',c:'red'}
```

- [ ] **Paso 5: Tendón — Fase proliferativa**

En la fase `{ name:'Fase proliferativa', time:'2 – 10 semanas', ... }`, agregar:

```js
{l:'Diadinámica CP',c:'red'}
```

- [ ] **Paso 6: Ligamento — Fase inflamatoria**

En `{ id:'ligamento', ... }`, fase `{ name:'Fase inflamatoria', time:'0 – 72 horas', ... }`, agregar:

```js
{l:'Galvánica (iontoforesis)',c:'gold'},{l:'Alto voltaje (edema)',c:'orange'}
```

- [ ] **Paso 7: Ligamento — Fase proliferativa**

En la fase `{ name:'Fase proliferativa', time:'72 h – 6 semanas', ... }`, agregar:

```js
{l:'Diadinámica CP',c:'red'}
```

- [ ] **Paso 8: Hueso — Hematoma e inflamación**

En `{ id:'hueso', ... }`, fase `{ name:'Hematoma fracturario e inflamación', ... }`, agregar:

```js
{l:'Galvánica (trofismo)',c:'gold'},{l:'Alto voltaje',c:'orange'}
```

- [ ] **Paso 9: Nervio — Regeneración axonal**

En `{ id:'nervio', ... }`, fase `{ name:'Regeneración axonal', ... }`, agregar:

```js
{l:'Onda H',c:'indigo'},{l:'Galvánica (trofismo axonal)',c:'gold'}
```

- [ ] **Paso 10: Nervio — Reinervación y maduración**

En la fase `{ name:'Reinervación y maduración', ... }`, agregar:

```js
{l:'Onda H',c:'indigo'},{l:'VMS (músculo denervado)',c:'purple'}
```

- [ ] **Paso 11: Piel — Hemostasia e inflamación**

En `{ id:'piel', ... }`, fase `{ name:'Hemostasia e inflamación', ... }`, agregar:

```js
{l:'Alto voltaje (cátodo)',c:'orange'}
```

- [ ] **Paso 12: Piel — Fase proliferativa**

En la fase `{ name:'Fase proliferativa', ... }`, agregar:

```js
{l:'Alto voltaje (ánodo)',c:'orange'},{l:'Galvánica (iontoforesis)',c:'gold'}
```

- [ ] **Paso 13: Piel — Remodelación**

En la fase `{ name:'Remodelación de la cicatriz', ... }`, agregar:

```js
{l:'Diadinámica',c:'red'}
```

- [ ] **Paso 14: Menisco — Fase proliferativa**

En `{ id:'menisco', ... }`, fase `{ name:'Fase proliferativa', time:'Semanas 1 – 6', ... }`, agregar:

```js
{l:'Diadinámica CP',c:'red'}
```

- [ ] **Paso 15: Cartílago — Fase proliferativa**

En `{ id:'cartilago', ... }`, fase `{ name:'Fase proliferativa / formación de fibrocartílago', ... }`, agregar:

```js
{l:'Diadinámica',c:'red'}
```

- [ ] **Paso 16: Verificar en browser**

Ir a la sección Tiempos. Revisar cada tejido y verificar que las pills de los nuevos agentes aparecen con los colores correctos en las fases adecuadas.

- [ ] **Paso 17: Commit**

```
git add js/tiempos.js
git commit -m "feat: agregar pills de nuevos agentes en fases tisulares de la sección Tiempos"
```

---

## Tarea 10 — Flujograma: nuevos agentes en nodos de resultado (flujo.js)

**Archivos:**
- Modificar: `js/flujo.js` — arrays `agents` dentro de cada nodo `result:true`

- [ ] **Paso 1: r_ag_dolor — dolor e inflamación aguda**

Localizar `r_ag_dolor:{ result:true, ...`. Agregar al final del array `agents`:

```js
{name:'Diadinámica DF',c:'c-red',params:'100 Hz · umbral sensitivo · 2–3 min inicio de sesión',effect:'Analgesia rápida Gate Control',mech:'La onda completa rectificada a 100 Hz activa fibras Aβ inhibiendo la transmisión nociceptiva en el asta posterior medular, con inicio de acción más rápido que el TENS convencional.'},
```

- [ ] **Paso 2: r_ag_edema — edema agudo**

Localizar `r_ag_edema:{ result:true, ...`. Agregar al final del array `agents`:

```js
{name:'Alto voltaje (cátodo)',c:'c-orange',params:'>100 V pico · cátodo (−) · ~120 pps · 20–30 min',effect:'Reducción de edema, repulsión electrostática',mech:'El electrodo negativo repele las proteínas cargadas negativamente del espacio intersticial, reduciendo la presión osmótica del edema postraumático.'},
```

- [ ] **Paso 3: r_sub_dolor — dolor residual subagudo**

Localizar `r_sub_dolor:{ result:true, ...`. Agregar al final del array `agents`:

```js
{name:'Diadinámica CP',c:'c-red',params:'50↔100 Hz alternando 1 s · umbral sensitivo · 4–6 min',effect:'Analgesia sostenida sin acomodación',mech:'La alternancia MF/DF evita la acomodación nerviosa combinando Gate Control (DF 100 Hz) con efecto sedante (MF 50 Hz) en la misma sesión.'},
{name:'Träbert (corriente 2/5)',c:'c-lime',params:'143 Hz fija · impulso 2 ms · 30–60 mA · hormigueo intenso · 15–20 min',effect:'Analgesia profunda por impulso largo',mech:'El ancho de pulso de 2 ms activa fibras Aβ y A-δ produciendo un hormigueo profundo e intenso con analgesia de 1–3 h post-sesión.'},
```

- [ ] **Paso 4: r_sub_cicatriz — cicatrización subaguda**

Localizar `r_sub_cicatriz:{ result:true, ...`. Agregar al final del array `agents`:

```js
{name:'Alto voltaje (cátodo→ánodo)',c:'c-orange',params:'>100 V · cátodo (−) inicio · 45–60 min · 1×/día',effect:'Galvanotaxis celular, cicatrización activa',mech:'Imita la corriente de lesión bioeléctrica endógena estimulando la migración de fibroblastos y queratinocitos hacia el lecho de la herida; cambio a polaridad positiva en fase de granulación.'},
{name:'Galvánica (iontoforesis)',c:'c-gold',params:'CC · 0.05–0.1 mA/cm² · 20 min',effect:'Introducción de antiinflamatorios locales',mech:'El campo eléctrico introduce iones medicinales por electromigración con concentración local 3–5× mayor que la aplicación tópica sin efecto sistémico.'},
```

- [ ] **Paso 5: r_sub_edema — edema crónico subagudo**

Localizar `r_sub_edema:{ result:true, ...`. Agregar al final del array `agents`:

```js
{name:'Diadinámica LP',c:'c-red',params:'Períodos largos · umbral motor leve · 5–8 min',effect:'Bomba muscular rítmica, drenaje venoso',mech:'La estimulación muscular rítmica del modo LP actúa como bomba periférica que facilita el retorno venoso y linfático del edema subagudo.'},
```

- [ ] **Paso 6: r_sub_fuerza — recuperación de fuerza**

Localizar `r_sub_fuerza:{ result:true, ...`. Agregar al final del array `agents`:

```js
{name:'VMS',c:'c-purple',params:'Frecuencia variable 50–100 Hz · ON 6–10 s / OFF 12–20 s · AW 200–400 µs · rampa 1–3 s',effect:'Estimulación muscular adaptativa, anti-acomodación',mech:'La variación automática de frecuencia portadora reduce la acomodación neuromuscular y simula los patrones fisiológicos de activación motora, logrando mayor reclutamiento que la estimulación de frecuencia fija.'},
```

- [ ] **Paso 7: r_cr_muscular — crónico muscular**

Localizar `r_cr_muscular:{ result:true, ...`. Agregar al final del array `agents`:

```js
{name:'Diadinámica RS',c:'c-red',params:'Ritmo sincopado · umbral motor visible · 5–10 min',effect:'Estimulación muscular rítmica activa',mech:'El modo RS genera contracciones musculares rítmicas intensas similares a EMS para reeducación muscular y mantenimiento del trofismo.'},
{name:'Träbert',c:'c-lime',params:'143 Hz · impulso 2 ms · electrodos sobre músculo · hormigueo profundo · 15–20 min',effect:'Analgesia muscular profunda',mech:'El ancho de pulso de 2 ms activa fibras profundas del músculo generando analgesia duradera sin producir contracción muscular visible.'},
```

- [ ] **Paso 8: r_cr_articular — crónico articular**

Localizar `r_cr_articular:{ result:true, ...`. Agregar al final del array `agents`:

```js
{name:'Diadinámica CP/LP',c:'c-red',params:'CP o LP · 15–20 min',effect:'Analgesia articular sin acomodación, trofismo',mech:'CP evita la acomodación nerviosa combinando efectos sedante y analgésico. LP añade estimulación trófica articular con componente galvánico mayor.'},
{name:'Träbert',c:'c-lime',params:'143 Hz · impulso 2 ms · electrodos periarticulares · 15–20 min',effect:'Analgesia articular profunda por impulso largo',mech:'Los pulsos de 2 ms activan fibras articulares profundas (A-δ) que el TENS convencional no alcanza, produciendo analgesia en estructuras articulares profundas (cadera, rodilla, hombro).'},
```

- [ ] **Paso 9: r_cr_neuro — crónico neuropático**

Localizar `r_cr_neuro:{ result:true, ...`. Agregar al final del array `agents`:

```js
{name:'Onda H',c:'c-indigo',params:'2–10 Hz · onda exponencial · 30–45 min · umbral sensitivo mínimo',effect:'Analgesia neuropática profunda y trófica',mech:'La forma de onda exponencial activa fibras neuropáticas dañadas con menor densidad de corriente; la baja frecuencia libera opioides endógenos y activa BDNF/NGF para recuperación axonal.'},
{name:'Träbert',c:'c-lime',params:'143 Hz · impulso 2 ms · sobre trayecto nervioso · 15–20 min',effect:'Analgesia directa sobre nervio afectado',mech:'Electrodo activo sobre el trayecto del nervio doloroso. El ancho de pulso de 2 ms inhibe la hiperexcitabilidad neuropática de fibras A-δ.'},
{name:'Galvánica (trofismo axonal)',c:'c-gold',params:'CC catódica · 0.05–0.1 mA/cm² · 15–20 min',effect:'Estimulación trófica axonal, mejora de conducción',mech:'La corriente catódica activa la bomba Na⁺/K⁺-ATPasa mejorando la nutrición axonal y la velocidad de conducción nerviosa periférica.'},
```

- [ ] **Paso 10: Verificar en browser**

Ir al Flujograma. Navegar por todos los caminos (aguda/dolor, aguda/edema, subaguda/dolor, subaguda/cicatriz, subaguda/edema, subaguda/fuerza, crónica/muscular, crónica/articular, crónica/neuropático) y verificar que los nuevos agentes aparecen en las tarjetas de resultado con los colores correctos.

- [ ] **Paso 11: Commit**

```
git add js/flujo.js
git commit -m "feat: agregar nuevos agentes (galvánica, diadinámica, onda H, HVPC, VMS, träbert) al flujograma"
```

---

## Tarea 11 — Cache-buster: actualizar versión de scripts (index.html)

**Archivos:**
- Modificar: `index.html` — líneas ~960-968 (tags `<script src="...?v=2">`)

- [ ] **Paso 1: Actualizar versión de todos los scripts modificados**

Localizar las líneas de script al final del `<body>`. Cambiar `?v=2` a `?v=3` en los 4 archivos modificados:

```html
<script src="js/flujo.js?v=3"></script>
<script src="js/referencia.js?v=3"></script>
<script src="js/mecanismos.js?v=3"></script>
<script src="js/tiempos.js?v=3"></script>
```

Dejar los demás (`kinesioterapia.js`, `farmacologia.js`, `dolor.js`, `pruebas.js`, `app.js`) en `?v=2`.

- [ ] **Paso 2: Verificación final en browser**

Recargar con Ctrl+Shift+R (hard reload). Verificar:
1. Referencia: 6 nuevas tarjetas (galvánica, diadinámica, onda H, alto voltaje, träbert) + Corrientes Rusas con modos VMS
2. Mecanismos: 5 nuevas cards (números 8–12)
3. Tiempos: pills de nuevos agentes visibles en fases de los 8 tejidos modificados
4. Flujograma: nuevos agentes en los 9 nodos de resultado
5. Sin errores en la consola del browser

- [ ] **Paso 3: Commit final**

```
git add index.html
git commit -m "feat: actualizar cache-buster ?v=3 para forzar recarga de scripts modificados"
```
