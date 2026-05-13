# Diseño: Sección "Vías del dolor"
**Fecha:** 2026-05-13  
**Proyecto:** Agentes Físicos — Guía Clínica  
**Estado:** Aprobado por el usuario

---

## Objetivo

Agregar una nueva sección "Vías del dolor" que explique el recorrido de la señal nociceptiva (anatomofisiología) y los mecanismos de modulación analgésica por nivel anatómico (medular y supramedular), conectando la teoría con los agentes físicos que actúan en cada nivel.

---

## Archivos a crear / modificar

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `js/dolor.js` | Crear | Datos de la sección (fibras, vías, mecanismos) |
| `js/app.js` | Modificar | Agregar función `buildDolor()` e inicialización |
| `index.html` | Modificar | Nueva página `page-dolor`, nav item, CSS mínimo |

---

## Navegación

- **Nueva entrada en el sidebar** entre "Mecanismos" y "Tiempos"
- **Label:** `Dolor`
- **Icono SVG:** neurona/rayo cerebral (consistente con el estilo del app)
- **ID de página:** `page-dolor`
- **onclick:** `showPage('dolor', this)`

---

## Encabezado de página

```
Eyebrow:   Neurofisiología
Título:    Vías del dolor
Subtítulo: Recorrido de la señal nociceptiva y mecanismos de modulación
           analgésica por nivel anatómico.
```

---

## Barra de progreso anatómica

Reutiliza el componente `.timeline-bar` existente. Nodos del recorrido del dolor:

```
Nociceptor → Fibras (C / A-δ / A-β) → Asta Posterior → Tracto EST → Tálamo → Corteza
    ●————————————●——————————————————●——————————————●——————————●————————●
  [red]        [red]              [amber]        [blue]   [purple] [purple]
```

Se renderiza como una barra segmentada con etiquetas debajo de cada nodo.

---

## Estructura de contenido: 3 bloques accordion

### Bloque 1 — Vías ascendentes del dolor (`c-red`)

**Header:** `01 · Vías ascendentes del dolor`  
**Contenido:**

Tabla comparativa de las 3 fibras nociceptivas:

| Fibra | Diámetro | Mielina | Velocidad | Tipo de dolor | Estímulo |
|-------|----------|---------|-----------|---------------|----------|
| C | Fino | No | 0.5–2 m/s | Quemante, difuso, crónico | Calor, presión, químico |
| A-δ | Medio | Sí (fina) | 5–30 m/s | Agudo, localizado, primario | Pinchazo, frío intenso |
| A-β | Grueso | Sí (gruesa) | 30–70 m/s | Tacto/presión (no dolor) | Tacto, vibración |

Descripción del recorrido: fibras → asta posterior (láminas I, II, IV, V de Rexed) → tracto espinotalámico lateral (cruce a lado contralateral) → tálamo (VPL) → corteza somatosensorial primaria (S1) y secundaria (S2).

Nota clínica: la percepción dolorosa también involucra la corteza cingulada anterior (componente afectivo) y la ínsula.

**Sin panel de agentes físicos** (es la vía ascendente, no un nivel de modulación).

---

### Bloque 2 — Analgesia medular (`c-blue`)

**Header:** `02 · Analgesia medular`  
**Contenido:** 2 sub-mecanismos con descripción detallada y highlights.

#### 2a. Teoría de la compuerta (Melzack & Wall, 1965)
- Fibras A-β de gran diámetro activan **interneuronas inhibitorias** en la sustancia gelatinosa de Rolando (SGR, lámina II)
- Estas interneuronas "cierran la compuerta" bloqueando la transmisión de señales nociceptivas desde fibras C y A-δ hacia las **células de transmisión (células T)** del asta posterior
- A mayor actividad A-β → mayor inhibición → menor señal de dolor transmitida al cerebro

#### 2b. Sistema opioide espinal
- Receptores opioides **μ (mu), δ (delta), κ (kappa)** se expresan densamente en el asta posterior
- **Encefalinas** y **dinorfinas** (opioides endógenos) producen hiperpolarización presináptica (menos liberación de glutamato/sustancia P) y postsináptica (menor excitabilidad de células T)
- TENS de baja frecuencia (2–10 Hz) activa fibras Aα motoras → liberación de β-endorfinas y encefalinas a nivel espinal

**Panel de agentes físicos en este nivel:**
- TENS Convencional 80–150 Hz (Gate Control) `c-blue`
- TENS Acupuntural 2–10 Hz (opioides espinales) `c-blue`
- Interferencial AMF 80–100 Hz (Gate profundo) `c-green`
- TENS Burst (mixto) `c-blue`

---

### Bloque 3 — Analgesia supramedular (`c-purple`)

**Header:** `03 · Analgesia supramedular`  
**Contenido:** 4 tarjetas internas (no accordion anidado, estilo `.mech-card` pero más compacto).

#### 3a. Sustancia Gris Periacueductal (PAG)
- Centro principal de control **descendente** del dolor en el mesencéfalo
- Contiene alta densidad de receptores opioides μ y δ
- Activada por: opioides exógenos, TENS baja frecuencia, β-endorfinas hipofisarias, estrés
- Proyecta hacia el Rafe Magnus y el Locus Coeruleus iniciando la inhibición descendente
- Agentes: TENS baja frecuencia, Interferencial baja AMF

#### 3b. Núcleo del Rafe Magnus (NRM)
- Principal fuente de **serotonina (5-HT)** en la vía inhibitoria descendente
- La 5-HT liberada en el asta posterior activa interneuronas encefalinérgicas y produce inhibición directa de neuronas nociceptivas
- Recibe señales de la PAG y de la corteza prefrontal
- Agentes: TENS baja frecuencia, ejercicio terapéutico (indirecto)

#### 3c. Locus Coeruleus (LC)
- Principal fuente de **noradrenalina (NA)** descendente
- La NA actúa sobre receptores **α2-adrenérgicos** en el asta posterior, hiperpolarizando las neuronas de proyección nociceptiva
- También activa interneurona inhibitoria GABAérgica
- Agentes: TENS baja frecuencia, magnetoterapia (evidencia emergente)

#### 3d. Sistema límbico / Corteza prefrontal
- Modulación **emocional y cognitiva** del dolor
- La corteza prefrontal ejerce control top-down sobre la PAG y el sistema límbico
- En dolor crónico: sensibilización central → cambios estructurales en corteza cingulada anterior e ínsula → catastrofismo, hiperalgesia
- Relevancia clínica: agentes físicos con efecto en este nivel incluyen calor superficial (efecto sedante/ansiolítico), TENS baja frecuencia (β-endorfinas sistémicas), y la educación en neurociencia del dolor (PNE) como herramienta complementaria
- Agentes: calor superficial, TENS baja frecuencia, placebo activo

---

## Modelo de datos (`js/dolor.js`)

```js
const DOLOR_PATHWAY = [
  { label: 'Nociceptor', color: 'red' },
  { label: 'Fibras C / A-δ / A-β', color: 'red' },
  { label: 'Asta posterior', color: 'amber' },
  { label: 'Tracto EST', color: 'blue' },
  { label: 'Tálamo', color: 'purple' },
  { label: 'Corteza S1/S2', color: 'purple' },
];

const DOLOR_FIBRAS = [
  { fibra: 'C', diametro: 'Fino (0.2–1.5 µm)', mielina: 'No', velocidad: '0.5–2 m/s', dolor: 'Quemante, difuso, tardío', estimulo: 'Calor nocivo, presión sostenida, estímulos químicos', color: 'red' },
  { fibra: 'A-δ', diametro: 'Medio (2–5 µm)', mielina: 'Sí (fina)', velocidad: '5–30 m/s', dolor: 'Agudo, punzante, localizado', estimulo: 'Pinchazo, frío intenso, presión mecánica aguda', color: 'amber' },
  { fibra: 'A-β', diametro: 'Grueso (6–12 µm)', mielina: 'Sí (gruesa)', velocidad: '30–70 m/s', dolor: 'No nociceptivas en condiciones normales', estimulo: 'Tacto suave, vibración, presión leve', color: 'blue' },
];

const DOLOR_NIVELES = [
  {
    id: 'ascendente',
    num: '01',
    color: 'red',
    name: 'Vías ascendentes del dolor',
    intro: '...',
    mecanismos: [...],
    agentes: [],
  },
  {
    id: 'medular',
    num: '02',
    color: 'blue',
    name: 'Analgesia medular',
    intro: '...',
    mecanismos: [
      { id: 'compuerta', name: 'Teoría de la compuerta', ... },
      { id: 'opioide_espinal', name: 'Sistema opioide espinal', ... },
    ],
    agentes: [
      { name: 'TENS Convencional 80–150 Hz', c: 'c-blue', ref: 'tens' },
      { name: 'TENS Acupuntural 2–10 Hz', c: 'c-blue', ref: 'tens' },
      { name: 'Interferencial AMF 80–100 Hz', c: 'c-green', ref: 'inter' },
      { name: 'TENS Burst', c: 'c-blue', ref: 'tens' },
    ],
  },
  {
    id: 'supramedular',
    num: '03',
    color: 'purple',
    name: 'Analgesia supramedular',
    intro: '...',
    centros: [
      { id: 'pag', name: 'Sustancia Gris Periacueductal (PAG)', ... },
      { id: 'rafe', name: 'Núcleo del Rafe Magnus', ... },
      { id: 'lc', name: 'Locus Coeruleus', ... },
      { id: 'limbico', name: 'Sistema límbico / Corteza prefrontal', ... },
    ],
    agentes: [...],
  },
];
```

---

## CSS a agregar

Componentes nuevos mínimos necesarios:

```css
/* Pathway nodes */
.pathway-bar { display: flex; gap: 0; align-items: center; margin-bottom: 24px; overflow-x: auto; }
.pathway-node { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; min-width: 60px; }
.pathway-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.pathway-label { font-size: 9.5px; text-align: center; color: var(--text3); line-height: 1.3; }
.pathway-line { flex: 1; height: 2px; background: var(--border2); margin-bottom: 14px; }

/* Centros supramedulares (dentro de bloque 3) */
.centro-card { background: var(--surface); border: 1px solid var(--border2);
  border-radius: var(--radius-md); padding: 14px 16px; margin-bottom: 10px; }
.centro-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.centro-num { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
.centro-name { font-family: 'DM Serif Display', serif; font-size: 14px; color: var(--text); }
.centro-body { font-size: 12px; color: var(--text2); line-height: 1.75; }
```

---

## Integración con otras secciones

- Los chips de "Agentes físicos en este nivel" son informativos (solo texto + color). La navegación al agente específico en Referencia es una **mejora opcional** que no bloquea la implementación principal.
- No se modifica `MECHS[]` ni ninguna otra sección existente

---

## Criterios de éxito

- [ ] La página aparece en el sidebar y navega correctamente
- [ ] Los 3 bloques accordion abren/cierran correctamente
- [ ] La tabla de fibras se visualiza correctamente en móvil (con scroll horizontal vía `.table-wrap`)
- [ ] La barra de progreso anatómica es legible en pantallas pequeñas
- [ ] Los chips de agentes físicos tienen el color correcto por nivel
- [ ] El contenido es clínicamente correcto y consistente con el resto de la guía
