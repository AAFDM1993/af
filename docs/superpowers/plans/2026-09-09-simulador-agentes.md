# Simulador de Agentes Físicos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Simulador" section to the clinical guide where a randomly generated patient
(phase + tissue/symptom + optional comorbidity) is treated by the user: pick the indicated
physical agent, then dose it correctly on sliders, with immediate right/wrong feedback.

**Architecture:** Pure, Node-testable data/logic functions live at the top of a new
`js/simulador.js` (data tables + patient generator + choice/validation functions), with a thin
DOM-rendering layer at the bottom of the same file that mirrors the existing pattern used by
`js/flujo.js`. The page is wired into `index.html`/`js/app.js` exactly like every other section
(`page-<id>` div + `nav-item` + `build<Name>()` called from the init block).

**Tech Stack:** Vanilla JS (no build step, no framework, globals via `<script>` tags — matches
the rest of the repo). Tests for the pure logic run with Node's built-in `node:test` +
`node:assert/strict` (Node v20 is available; no new dependency).

**Spec:** `docs/superpowers/specs/2026-09-09-simulador-agentes-design.md`

## Global Constraints

- Exactly 12 cases in `SIM_CASES`, one per existing `flujo.js` result node — no new clinical
  combinations are invented (spec §3.1, §8).
- Exactly 6 entries in `SIM_COMORBILIDADES`, each `excludes` list derived from the literal
  `contra` text already in `js/referencia.js` (spec §3.2).
- Comorbidity roll probability is exactly 40% (spec §4 step 4).
- Distractor filtering is exact-string matching against a case's `validAgentNames` — no fuzzy/
  synonym matching (spec §5, documented simplification).
- No score, streak, or persisted history anywhere (spec §1, §8).
- No automated DOM/browser tests are introduced — this repo has none and adding a headless
  browser harness for one feature is out of scope; DOM behavior is verified manually per spec §9
  (spec §8).
- New script tag uses a cache-buster query string (`?v=1`), matching every existing `<script>`
  tag in `index.html`.
- Reuse existing CSS classes (`.opt-btn`, `.opt-grid`, `.phase-pill`, `.question-card`,
  `.note-box`, `.restart-btn`, `.tag`, `.result-label`, `.q-hint`) wherever the visual need
  matches; only add new CSS for things that don't already exist (sliders, patient badges,
  parameter result rows, correct/incorrect option states).

---

## File Structure

- **Create** `js/simulador.js` — all simulator data and logic:
  - `SIM_CASES`, `SIM_COMORBILIDADES`, `NONE_OPTION` (data + constants)
  - `pickRandomItem`, `pickRandomInt`, `generatePatient` (patient generation)
  - `pickDistractors`, `buildChoices` (choice-set construction)
  - `findHomeCase`, `evaluateAgentChoice` (step 1 validation)
  - `evaluateSliders` (step 2 validation)
  - `randomSliderStart`, `buildSim`, `newSimPatient`, `renderSim`, `renderPatientCard`,
    `renderStep1`, `handleAgentChoice`, `renderStep2`, `renderStep3` (DOM layer)
  - A trailing `if (typeof module !== 'undefined' && module.exports) { module.exports = {...} }`
    guard so the pure functions/data are `require()`-able from Node tests without affecting the
    browser (where `module` is undefined and the file behaves like every other sibling script).
- **Create** `tests/simulador.test.js` — grows across Tasks 1-5, one `node:test` block per pure
  function/data table.
- **Modify** `index.html`:
  - New CSS block `/* ─── SIMULADOR ─── */` (Task 6).
  - New `<div class="page" id="page-sim">` in `.main` (Task 6).
  - New `<div class="nav-item">` in `<nav class="bottom-nav">` (Task 6).
  - New `<script src="js/simulador.js?v=1"></script>` before `app.js` (Task 6).
- **Modify** `js/app.js` — add `buildSim();` to the `/* ===== INIT ===== */` block (Task 9).

---

### Task 1: Data tables — `SIM_CASES` and `SIM_COMORBILIDADES`

**Files:**
- Create: `js/simulador.js`
- Create: `tests/simulador.test.js`

**Interfaces:**
- Produces: `SIM_CASES` (array of 12 case objects, shape below), `SIM_COMORBILIDADES` (array of
  6 objects, shape below). Every later task reads these two constants.

Case object shape:
```js
{
  id: 'ag_dolor',                       // unique slug
  phaseLabel: 'Aguda — dolor e inflamación',
  phasePill: 'pill-red',                // one of the existing pill-* CSS classes
  tissueLabel: 'dolor agudo con inflamación',
  regions: ['tobillo','rodilla','zona lumbar','hombro'],
  validAgentNames: ['TENS convencional','US pulsado 1:4','Laser 830 nm','Magnetoterapia','Diadinámica DF'],
  agentBase: 'tens',                    // REF_AGENTS id this case's target belongs to
  target: {
    name: 'TENS convencional',
    mech: 'Activa fibras A-β que bloquean la transmisión del dolor a nivel medular (Gate Control).',
    sliders: [
      { label:'Frecuencia', unit:'Hz', min:0, max:250, step:5, validMin:80, validMax:150 },
      { label:'Ancho de pulso', unit:'µs', min:0, max:400, step:10, validMin:50, validMax:80 },
      { label:'Duración', unit:'min', min:0, max:60, step:5, validMin:20, validMax:30 },
    ],
  },
}
```

Comorbidity object shape:
```js
{ id:'marcapasos', label:'Marcapasos / dispositivo electrónico implantado', excludes:['tens','inter','us','mag','rusa','ondah'] }
```

- [ ] **Step 1: Write the failing test**

Create `tests/simulador.test.js`:

```js
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { SIM_CASES, SIM_COMORBILIDADES } = require('../js/simulador.js');

test('SIM_CASES has exactly 12 well-formed cases', () => {
  assert.equal(SIM_CASES.length, 12);
  const ids = new Set();
  SIM_CASES.forEach(c => {
    assert.ok(c.id && !ids.has(c.id), `id duplicado o vacío: ${c.id}`);
    ids.add(c.id);
    assert.ok(c.phaseLabel && c.phasePill && c.tissueLabel);
    assert.ok(Array.isArray(c.regions) && c.regions.length >= 3);
    assert.ok(Array.isArray(c.validAgentNames) && c.validAgentNames.length >= 3);
    assert.ok(c.validAgentNames.includes(c.target.name),
      `${c.id}: el agente objetivo debe estar en validAgentNames`);
    assert.ok(c.target.sliders.length >= 2 && c.target.sliders.length <= 3,
      `${c.id}: debe tener 2 o 3 sliders`);
    c.target.sliders.forEach(s => {
      assert.ok(s.min <= s.validMin && s.validMin <= s.validMax && s.validMax <= s.max,
        `${c.id}/${s.label}: el rango de control debe contener el rango válido`);
    });
  });
});

test('SIM_COMORBILIDADES has exactly 6 entries referencing known agent bases', () => {
  const knownBases = new Set(SIM_CASES.map(c => c.agentBase));
  assert.equal(SIM_COMORBILIDADES.length, 6);
  SIM_COMORBILIDADES.forEach(m => {
    assert.ok(m.id && m.label);
    assert.ok(Array.isArray(m.excludes) && m.excludes.length >= 1);
    m.excludes.forEach(base => assert.ok(knownBases.has(base), `${m.id}: base desconocida "${base}"`));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/simulador.test.js`
Expected: FAIL — `Cannot find module '../js/simulador.js'`

- [ ] **Step 3: Write the data file**

Create `js/simulador.js` with exactly this content:

```js
/* ===== SIMULADOR — DATOS ===== */
const SIM_CASES = [
  { id:'ag_dolor', phaseLabel:'Aguda — dolor e inflamación', phasePill:'pill-red',
    tissueLabel:'dolor agudo con inflamación',
    regions:['tobillo','rodilla','zona lumbar','hombro'],
    validAgentNames:['TENS convencional','US pulsado 1:4','Laser 830 nm','Magnetoterapia','Diadinámica DF'],
    agentBase:'tens',
    target:{ name:'TENS convencional',
      mech:'Activa fibras A-β que bloquean la transmisión del dolor a nivel medular (Gate Control).',
      sliders:[
        { label:'Frecuencia', unit:'Hz', min:0, max:250, step:5, validMin:80, validMax:150 },
        { label:'Ancho de pulso', unit:'µs', min:0, max:400, step:10, validMin:50, validMax:80 },
        { label:'Duración', unit:'min', min:0, max:60, step:5, validMin:20, validMax:30 },
      ]}},

  { id:'ag_edema', phaseLabel:'Aguda — edema prominente', phasePill:'pill-red',
    tissueLabel:'edema postraumático agudo',
    regions:['tobillo','rodilla','mano','pie'],
    validAgentNames:['Interferencial 25–50 Hz','Magnetoterapia','TENS convencional','Laser 830 nm','Alto voltaje (cátodo)'],
    agentBase:'inter',
    target:{ name:'Interferencial 25–50 Hz',
      mech:'Efecto simpaticolítico: vasodilatación y mejora del retorno venoso y linfático.',
      sliders:[
        { label:'AMF', unit:'Hz', min:0, max:150, step:5, validMin:25, validMax:50 },
        { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:15, validMax:20 },
      ]}},

  { id:'ag_espasmo', phaseLabel:'Aguda — espasmo muscular', phasePill:'pill-red',
    tissueLabel:'espasmo muscular agudo',
    regions:['zona lumbar','cuello','gemelo','trapecio'],
    validAgentNames:['TENS Burst','US pulsado 1:4','Magnetoterapia 50–100 Hz','Laser 830 nm'],
    agentBase:'tens',
    target:{ name:'TENS Burst',
      mech:'Combina Gate Control y liberación endorfínica: reduce el tono muscular por vía refleja espinal.',
      sliders:[
        { label:'Frecuencia de ráfaga', unit:'Hz', min:0, max:20, step:1, validMin:2, validMax:4 },
        { label:'Ancho de pulso', unit:'µs', min:0, max:400, step:10, validMin:100, validMax:200 },
        { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:18, validMax:22 },
      ]}},

  { id:'sub_dolor', phaseLabel:'Subaguda — dolor residual', phasePill:'pill-amber',
    tissueLabel:'dolor residual subagudo',
    regions:['hombro','rodilla','zona lumbar','cadera'],
    validAgentNames:['TENS acupuntural','Interferencial 80–100 Hz','Laser 830 nm','Terapia combinada','Diadinámica CP','Träbert (corriente 2/5)'],
    agentBase:'tens',
    target:{ name:'TENS acupuntural',
      mech:'Estimula la liberación de β-endorfinas y encefalinas en el asta posterior medular y a nivel sistémico.',
      sliders:[
        { label:'Frecuencia', unit:'Hz', min:0, max:30, step:1, validMin:2, validMax:10 },
        { label:'Ancho de pulso', unit:'µs', min:0, max:400, step:10, validMin:200, validMax:300 },
        { label:'Duración', unit:'min', min:0, max:60, step:5, validMin:20, validMax:30 },
      ]}},

  { id:'sub_cicatriz', phaseLabel:'Subaguda — cicatrización', phasePill:'pill-amber',
    tissueLabel:'tejido en fase de cicatrización',
    regions:['antebrazo','pierna','abdomen','muslo'],
    validAgentNames:['US pulsado 1:1','Laser 830 nm','Magnetoterapia 10–25 Hz','Terapia combinada','Alto voltaje (cátodo→ánodo)','Galvánica (iontoforesis)'],
    agentBase:'us',
    target:{ name:'US pulsado 1:1',
      mech:'La cavitación estable y las microcorrientes de fluido estimulan directamente los fibroblastos, aumentando la síntesis de colágeno tipo I.',
      sliders:[
        { label:'Intensidad', unit:'W/cm²', min:0, max:3, step:0.1, validMin:0.5, validMax:1 },
        { label:'Duración', unit:'min', min:0, max:20, step:1, validMin:5, validMax:8 },
      ]}},

  { id:'sub_edema', phaseLabel:'Subaguda — edema crónico', phasePill:'pill-amber',
    tissueLabel:'edema subagudo persistente',
    regions:['tobillo','rodilla','muñeca','mano'],
    validAgentNames:['Interferencial 25–50 Hz','Magnetoterapia 25–50 Hz','US pulsado 1:4','Laser 830 nm','Diadinámica LP'],
    agentBase:'mag',
    target:{ name:'Magnetoterapia 25–50 Hz',
      mech:'Incrementa la velocidad de flujo capilar y reduce la viscosidad sanguínea por efecto electromagnético.',
      sliders:[
        { label:'Frecuencia', unit:'Hz', min:0, max:100, step:5, validMin:25, validMax:50 },
        { label:'Intensidad', unit:'Gauss', min:0, max:150, step:5, validMin:20, validMax:80 },
        { label:'Duración', unit:'min', min:0, max:45, step:5, validMin:20, validMax:30 },
      ]}},

  { id:'sub_fuerza', phaseLabel:'Subaguda — recuperación de fuerza', phasePill:'pill-amber',
    tissueLabel:'debilidad muscular por desuso',
    regions:['cuádriceps','hombro','gemelo','isquiotibiales'],
    validAgentNames:['Corrientes rusas','TENS Burst / EMS','US continuo previo','Laser 830 nm','VMS'],
    agentBase:'rusa',
    target:{ name:'Corrientes rusas',
      mech:'La media frecuencia (2500 Hz) supera la resistencia cutánea sin dolor; las ráfagas a 50 Hz generan contracción tetánica fuerte, estimulando fibras tipo II.',
      sliders:[
        { label:'Frecuencia de ráfaga', unit:'Hz', min:0, max:100, step:5, validMin:45, validMax:55 },
        { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:10, validMax:20 },
      ]}},

  { id:'cr_articular', phaseLabel:'Crónica — articular / hueso', phasePill:'pill-green',
    tissueLabel:'afección articular crónica',
    regions:['rodilla','cadera','hombro','mano'],
    validAgentNames:['Magnetoterapia 1–25 Hz','US continuo','Interferencial 0–100 Hz','Laser 830 nm','Diadinámica CP/LP','Träbert'],
    agentBase:'mag',
    target:{ name:'Magnetoterapia 1–25 Hz',
      mech:'Estimula osteoblastos y activa la síntesis de colágeno óseo.',
      sliders:[
        { label:'Frecuencia', unit:'Hz', min:0, max:50, step:1, validMin:1, validMax:25 },
        { label:'Intensidad', unit:'Gauss', min:0, max:150, step:5, validMin:10, validMax:100 },
        { label:'Duración', unit:'min', min:0, max:45, step:5, validMin:20, validMax:30 },
      ]}},

  { id:'cr_muscular', phaseLabel:'Crónica — músculo / tejido blando', phasePill:'pill-green',
    tissueLabel:'fibrosis muscular crónica',
    regions:['isquiotibiales','trapecio','gemelo','zona lumbar'],
    validAgentNames:['Corrientes rusas','US continuo','TENS acupuntural','Laser 830 nm','Diadinámica RS','Träbert'],
    agentBase:'laser',
    target:{ name:'Laser 830 nm',
      mech:'Inhibe la activación de miofibroblastos y reduce la producción de TGF-β1, previniendo la fibrosis muscular crónica.',
      sliders:[
        { label:'Dosis', unit:'J/cm²', min:0, max:10, step:0.5, validMin:4, validMax:6 },
        { label:'Tiempo por zona', unit:'s', min:0, max:150, step:5, validMin:60, validMax:90 },
      ]}},

  { id:'cr_neuro', phaseLabel:'Crónica — dolor neuropático / punto gatillo', phasePill:'pill-blue',
    tissueLabel:'dolor neuropático / punto gatillo miofascial',
    regions:['trapecio superior','glúteo','cervical','antebrazo'],
    validAgentNames:['TENS acupuntural','Laser 830 nm sobre PG','Interferencial 1–10 Hz','Magnetoterapia 10–25 Hz','Onda H','Träbert','Galvánica (trofismo axonal)'],
    agentBase:'ondah',
    target:{ name:'Onda H',
      mech:'La forma de onda exponencial activa fibras neuropáticas dañadas con menor densidad de corriente; la baja frecuencia libera opioides endógenos.',
      sliders:[
        { label:'Frecuencia', unit:'Hz', min:0, max:30, step:1, validMin:2, validMax:10 },
        { label:'Duración', unit:'min', min:0, max:60, step:5, validMin:30, validMax:45 },
      ]}},

  { id:'tend_sub', phaseLabel:'Tendinopatía subaguda-crónica', phasePill:'pill-amber',
    tissueLabel:'tendinopatía subaguda-crónica',
    regions:['tendón de Aquiles','manguito rotador','tendón rotuliano','epicóndilo'],
    validAgentNames:['US continuo/pulsado','Laser 830 nm','Terapia combinada','Interferencial 80 Hz'],
    agentBase:'inter',
    target:{ name:'Interferencial 80 Hz',
      mech:'Alta frecuencia interferencial activa Gate Control en profundidad, apropiado para tendones profundos.',
      sliders:[
        { label:'AMF', unit:'Hz', min:0, max:150, step:5, validMin:75, validMax:85 },
        { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:15, validMax:20 },
      ]}},

  { id:'tend_cr', phaseLabel:'Tendinopatía crónica refractaria', phasePill:'pill-red',
    tissueLabel:'tendinopatía crónica refractaria (>3 meses)',
    regions:['tendón de Aquiles','tendón rotuliano','fascia plantar','epicóndilo'],
    validAgentNames:['Ondas de choque radiales','Laser 830 nm','US continuo','Magnetoterapia'],
    agentBase:'oc',
    target:{ name:'Ondas de choque radiales',
      mech:'Generan microtraumatismo controlado que reinicia la cascada de reparación: estimulan VEGF, IGF-1 y TGF-β1.',
      sliders:[
        { label:'Presión', unit:'bar', min:0, max:6, step:0.5, validMin:1.5, validMax:4 },
        { label:'Frecuencia', unit:'Hz', min:0, max:25, step:1, validMin:8, validMax:15 },
        { label:'Nº de impactos', unit:'impactos', min:0, max:3000, step:100, validMin:1500, validMax:2500 },
      ]}},
];

const SIM_COMORBILIDADES = [
  { id:'marcapasos', label:'Marcapasos / dispositivo electrónico implantado',
    excludes:['tens','inter','us','mag','rusa','ondah'] },
  { id:'embarazo', label:'Embarazo (zona tratada abdominal/lumbar/pélvica)',
    excludes:['tens','inter','us','mag','laser','rusa','oc','ondah'] },
  { id:'metal', label:'Implante metálico en la zona tratada',
    excludes:['inter','us'] },
  { id:'trombosis', label:'Trombosis venosa activa / TVP',
    excludes:['tens','inter','us','rusa','ondah','oc'] },
  { id:'piel', label:'Piel lesionada / herida abierta en la zona',
    excludes:['tens','us'] },
  { id:'neoplasia', label:'Neoplasia activa en la zona tratada',
    excludes:['tens','inter','us','mag','laser','rusa','oc','ondah'] },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SIM_CASES, SIM_COMORBILIDADES };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/simulador.test.js`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add js/simulador.js tests/simulador.test.js
git commit -m "feat(simulador): agregar datos de 12 casos y 6 comorbilidades"
```

---

### Task 2: Patient generator — `generatePatient`

**Files:**
- Modify: `js/simulador.js` (append after the `SIM_COMORBILIDADES` block, before the
  `module.exports` guard)
- Modify: `tests/simulador.test.js` (append)

**Interfaces:**
- Consumes: `SIM_CASES`, `SIM_COMORBILIDADES` (Task 1).
- Produces: `pickRandomItem(arr, rng)`, `pickRandomInt(minInclusive, maxInclusive, rng)`,
  `generatePatient(rng)` → `{ case, region, age, comorbidity, blocked }`. Tasks 3, 4, 7 consume
  `generatePatient` and the patient shape it returns.

- [ ] **Step 1: Write the failing test**

Append to `tests/simulador.test.js`:

```js
const { generatePatient } = require('../js/simulador.js');

function fakeRng(sequence) {
  let i = 0;
  return () => sequence[i++ % sequence.length];
}

test('generatePatient: rng en 0 elige el primer caso/región, edad mínima, sin comorbilidad', () => {
  const rng = fakeRng([0, 0, 0, 0.99]);
  const p = generatePatient(rng);
  assert.equal(p.case, SIM_CASES[0]);
  assert.equal(p.region, SIM_CASES[0].regions[0]);
  assert.equal(p.age, 18);
  assert.equal(p.comorbidity, null);
  assert.equal(p.blocked, false);
});

test('generatePatient: con roll < 0.4 asigna comorbilidad y calcula "blocked" correctamente', () => {
  const targetCaseIndex = SIM_CASES.findIndex(c => SIM_COMORBILIDADES[0].excludes.includes(c.agentBase));
  assert.ok(targetCaseIndex >= 0, 'fixture: debe existir un caso excluido por la primera comorbilidad');
  const caseRoll = (targetCaseIndex + 0.5) / SIM_CASES.length;
  const rng = fakeRng([caseRoll, 0, 0, 0.1, 0]);
  const p = generatePatient(rng);
  assert.equal(p.case, SIM_CASES[targetCaseIndex]);
  assert.equal(p.comorbidity, SIM_COMORBILIDADES[0]);
  assert.equal(p.blocked, true);
});

test('generatePatient: age siempre queda en [18,75]', () => {
  for (let i = 0; i < 50; i++) {
    const p = generatePatient(Math.random);
    assert.ok(p.age >= 18 && p.age <= 75);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/simulador.test.js`
Expected: FAIL — `generatePatient is not a function`

- [ ] **Step 3: Write the implementation**

Append to `js/simulador.js`, after `SIM_COMORBILIDADES` and before the `module.exports` guard:

```js
/* ===== SIMULADOR — GENERADOR DE PACIENTE ===== */
function pickRandomItem(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function pickRandomInt(minInclusive, maxInclusive, rng) {
  return Math.floor(rng() * (maxInclusive - minInclusive + 1)) + minInclusive;
}

function generatePatient(rng) {
  rng = rng || Math.random;
  const patientCase = pickRandomItem(SIM_CASES, rng);
  const region = pickRandomItem(patientCase.regions, rng);
  const age = pickRandomInt(18, 75, rng);
  let comorbidity = null;
  if (rng() < 0.4) {
    comorbidity = pickRandomItem(SIM_COMORBILIDADES, rng);
  }
  const blocked = !!(comorbidity && comorbidity.excludes.includes(patientCase.agentBase));
  return { case: patientCase, region, age, comorbidity, blocked };
}
```

Update the `module.exports` guard to also export the new functions:

```js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SIM_CASES, SIM_COMORBILIDADES, pickRandomItem, pickRandomInt, generatePatient };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/simulador.test.js`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add js/simulador.js tests/simulador.test.js
git commit -m "feat(simulador): agregar generatePatient con comorbilidad y bloqueo"
```

---

### Task 3: Choice-set construction — `pickDistractors`, `buildChoices`, `NONE_OPTION`

**Files:**
- Modify: `js/simulador.js` (append)
- Modify: `tests/simulador.test.js` (append)

**Interfaces:**
- Consumes: `SIM_CASES` (Task 1), patient shape `{ case, comorbidity, blocked }` (Task 2).
- Produces: `NONE_OPTION` (string constant), `pickDistractors(patientCase, rng)` → array of 3
  agent-name strings, `buildChoices(patient, rng)` → shuffled array of option strings. Tasks 4
  and 7 consume `NONE_OPTION` and `buildChoices`'s output shape (array of plain strings, one of
  which may equal `NONE_OPTION`).

- [ ] **Step 1: Write the failing test**

Append to `tests/simulador.test.js`:

```js
const { pickDistractors, buildChoices, NONE_OPTION } = require('../js/simulador.js');

test('pickDistractors: siempre devuelve 3 nombres que no son válidos para ese caso', () => {
  SIM_CASES.forEach(c => {
    const distractors = pickDistractors(c, Math.random);
    assert.equal(distractors.length, 3);
    distractors.forEach(name => {
      assert.notEqual(name, c.target.name);
      assert.ok(!c.validAgentNames.includes(name), `${c.id}: "${name}" en realidad es válido para este caso`);
    });
  });
});

test('buildChoices: sin comorbilidad -> objetivo + 3 distractores, sin "Ninguno"', () => {
  const patient = { case: SIM_CASES[0], comorbidity: null, blocked: false };
  const options = buildChoices(patient, Math.random);
  assert.equal(options.length, 4);
  assert.ok(options.includes(SIM_CASES[0].target.name));
  assert.ok(!options.includes(NONE_OPTION));
});

test('buildChoices: comorbilidad que bloquea -> sin objetivo, con "Ninguno" (4 opciones)', () => {
  const patient = { case: SIM_CASES[0], comorbidity: SIM_COMORBILIDADES[0], blocked: true };
  const options = buildChoices(patient, Math.random);
  assert.equal(options.length, 4);
  assert.ok(!options.includes(SIM_CASES[0].target.name));
  assert.ok(options.includes(NONE_OPTION));
});

test('buildChoices: comorbilidad presente que no bloquea -> objetivo + distractores + "Ninguno" (5)', () => {
  const patient = { case: SIM_CASES[0], comorbidity: SIM_COMORBILIDADES[0], blocked: false };
  const options = buildChoices(patient, Math.random);
  assert.equal(options.length, 5);
  assert.ok(options.includes(SIM_CASES[0].target.name));
  assert.ok(options.includes(NONE_OPTION));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/simulador.test.js`
Expected: FAIL — `pickDistractors is not a function`

- [ ] **Step 3: Write the implementation**

Append to `js/simulador.js`:

```js
/* ===== SIMULADOR — CONSTRUCCIÓN DE OPCIONES ===== */
const NONE_OPTION = 'Ninguno de estos — contraindicado, derivar o posponer';

function shuffle(arr, rng) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
  }
  return copy;
}

function pickDistractors(patientCase, rng) {
  const pool = SIM_CASES
    .map(c => c.target.name)
    .filter(name => name !== patientCase.target.name)
    .filter(name => !patientCase.validAgentNames.includes(name));
  return shuffle(pool, rng).slice(0, 3);
}

function buildChoices(patient, rng) {
  const distractors = pickDistractors(patient.case, rng);
  let options;
  if (patient.blocked) {
    options = distractors.concat([NONE_OPTION]);
  } else if (patient.comorbidity) {
    options = [patient.case.target.name].concat(distractors, [NONE_OPTION]);
  } else {
    options = [patient.case.target.name].concat(distractors);
  }
  return shuffle(options, rng);
}
```

Update the `module.exports` guard:

```js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SIM_CASES, SIM_COMORBILIDADES, pickRandomItem, pickRandomInt, generatePatient,
    NONE_OPTION, pickDistractors, buildChoices,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/simulador.test.js`
Expected: PASS (9 tests)

- [ ] **Step 5: Commit**

```bash
git add js/simulador.js tests/simulador.test.js
git commit -m "feat(simulador): agregar pickDistractors y buildChoices"
```

---

### Task 4: Step-1 validation — `findHomeCase`, `evaluateAgentChoice`

**Files:**
- Modify: `js/simulador.js` (append)
- Modify: `tests/simulador.test.js` (append)

**Interfaces:**
- Consumes: `SIM_CASES`, `NONE_OPTION` (Tasks 1, 3), patient shape `{ case, comorbidity,
  blocked }` (Task 2).
- Produces: `findHomeCase(agentName)` → case object or `null`, `evaluateAgentChoice(patient,
  chosen)` → `{ correct: boolean, advance: boolean, explanation: string }`. Task 7 consumes
  `evaluateAgentChoice`'s return shape directly to render step-1 feedback.

- [ ] **Step 1: Write the failing test**

Append to `tests/simulador.test.js`:

```js
const { findHomeCase, evaluateAgentChoice } = require('../js/simulador.js');

test('evaluateAgentChoice: elegir el objetivo sin bloqueo es correcto y avanza a sliders', () => {
  const patient = { case: SIM_CASES[0], comorbidity: null, blocked: false };
  const r = evaluateAgentChoice(patient, SIM_CASES[0].target.name);
  assert.equal(r.correct, true);
  assert.equal(r.advance, true);
  assert.equal(r.explanation, SIM_CASES[0].target.mech);
});

test('evaluateAgentChoice: elegir un distractor es incorrecto y cita el caso de origen', () => {
  const patient = { case: SIM_CASES[0], comorbidity: null, blocked: false };
  const distractorName = SIM_CASES[1].target.name;
  const r = evaluateAgentChoice(patient, distractorName);
  assert.equal(r.correct, false);
  assert.equal(r.advance, false);
  assert.ok(r.explanation.includes(SIM_CASES[1].phaseLabel));
});

test('evaluateAgentChoice: "Ninguno" es correcto cuando el caso está bloqueado', () => {
  const patient = { case: SIM_CASES[0], comorbidity: SIM_COMORBILIDADES[0], blocked: true };
  const r = evaluateAgentChoice(patient, NONE_OPTION);
  assert.equal(r.correct, true);
  assert.equal(r.advance, false);
  assert.ok(r.explanation.includes(SIM_COMORBILIDADES[0].label));
});

test('evaluateAgentChoice: "Ninguno" es incorrecto cuando no hay bloqueo', () => {
  const patient = { case: SIM_CASES[0], comorbidity: null, blocked: false };
  const r = evaluateAgentChoice(patient, NONE_OPTION);
  assert.equal(r.correct, false);
  assert.equal(r.advance, false);
});

test('findHomeCase: ubica el caso dueño de un agente objetivo, o null si no existe', () => {
  assert.equal(findHomeCase(SIM_CASES[3].target.name), SIM_CASES[3]);
  assert.equal(findHomeCase('Agente inexistente'), null);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/simulador.test.js`
Expected: FAIL — `evaluateAgentChoice is not a function`

- [ ] **Step 3: Write the implementation**

Append to `js/simulador.js`:

```js
/* ===== SIMULADOR — VALIDACIÓN PASO 1 (AGENTE) ===== */
function findHomeCase(agentName) {
  return SIM_CASES.find(c => c.target.name === agentName) || null;
}

function evaluateAgentChoice(patient, chosen) {
  const targetName = patient.case.target.name;

  if (chosen === NONE_OPTION) {
    if (patient.blocked) {
      return {
        correct: true, advance: false,
        explanation: `${patient.comorbidity.label} contraindica ${targetName} en este cuadro — corresponde derivar o posponer el agente físico.`,
      };
    }
    return {
      correct: false, advance: false,
      explanation: `${targetName} sí está indicado aquí: no hay contraindicación activa para este paciente.`,
    };
  }

  if (chosen === targetName && !patient.blocked) {
    return { correct: true, advance: true, explanation: patient.case.target.mech };
  }

  const home = findHomeCase(chosen);
  const homeDesc = home ? `${home.phaseLabel} — ${home.tissueLabel}` : 'otro cuadro clínico';
  return {
    correct: false, advance: false,
    explanation: `${chosen} es el agente de referencia para «${homeDesc}», no para este cuadro.`,
  };
}
```

Update the `module.exports` guard:

```js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SIM_CASES, SIM_COMORBILIDADES, pickRandomItem, pickRandomInt, generatePatient,
    NONE_OPTION, pickDistractors, buildChoices, findHomeCase, evaluateAgentChoice,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/simulador.test.js`
Expected: PASS (14 tests)

- [ ] **Step 5: Commit**

```bash
git add js/simulador.js tests/simulador.test.js
git commit -m "feat(simulador): agregar evaluateAgentChoice y findHomeCase"
```

---

### Task 5: Step-2 validation — `evaluateSliders`

**Files:**
- Modify: `js/simulador.js` (append)
- Modify: `tests/simulador.test.js` (append)

**Interfaces:**
- Consumes: `target.sliders` shape from `SIM_CASES[*].target` (Task 1).
- Produces: `evaluateSliders(target, values)` → `{ results: [{label, unit, value, ok, validMin,
  validMax}], allOk: boolean }`. Task 8 consumes this return shape directly to render step-3
  feedback.

- [ ] **Step 1: Write the failing test**

Append to `tests/simulador.test.js`:

```js
const { evaluateSliders } = require('../js/simulador.js');

test('evaluateSliders: todos los valores dentro de rango -> allOk true', () => {
  const target = SIM_CASES[0].target;
  const midValues = target.sliders.map(s => (s.validMin + s.validMax) / 2);
  const r = evaluateSliders(target, midValues);
  assert.equal(r.allOk, true);
  r.results.forEach(res => assert.equal(res.ok, true));
});

test('evaluateSliders: un valor fuera de rango marca solo ese parámetro como incorrecto', () => {
  const target = SIM_CASES[0].target;
  const values = target.sliders.map(s => s.validMin);
  values[0] = target.sliders[0].validMin - 10;
  const r = evaluateSliders(target, values);
  assert.equal(r.allOk, false);
  assert.equal(r.results[0].ok, false);
  assert.equal(r.results[1].ok, true);
});

test('evaluateSliders: los límites validMin/validMax cuentan como correctos', () => {
  const target = SIM_CASES[0].target;
  const values = target.sliders.map(s => s.validMax);
  const r = evaluateSliders(target, values);
  assert.equal(r.allOk, true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/simulador.test.js`
Expected: FAIL — `evaluateSliders is not a function`

- [ ] **Step 3: Write the implementation**

Append to `js/simulador.js`:

```js
/* ===== SIMULADOR — VALIDACIÓN PASO 2 (PARÁMETROS) ===== */
function evaluateSliders(target, values) {
  const results = target.sliders.map((s, i) => {
    const value = values[i];
    const ok = value >= s.validMin && value <= s.validMax;
    return { label: s.label, unit: s.unit, value, ok, validMin: s.validMin, validMax: s.validMax };
  });
  const allOk = results.every(r => r.ok);
  return { results, allOk };
}
```

Update the `module.exports` guard:

```js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SIM_CASES, SIM_COMORBILIDADES, pickRandomItem, pickRandomInt, generatePatient,
    NONE_OPTION, pickDistractors, buildChoices, findHomeCase, evaluateAgentChoice,
    evaluateSliders,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/simulador.test.js`
Expected: PASS (17 tests)

- [ ] **Step 5: Commit**

```bash
git add js/simulador.js tests/simulador.test.js
git commit -m "feat(simulador): agregar evaluateSliders"
```

---

### Task 6: Page scaffold in `index.html` (CSS, page div, nav item, script tag)

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: nothing from JS.
- Produces: `#sim-content` empty container in the DOM that Task 7 renders into, plus a working
  `showPage('sim', this)` nav entry (the existing generic `showPage()` in `js/app.js` already
  handles any `page-<id>`/nav-item pair — no changes to `showPage()` needed).

- [ ] **Step 1: Add the CSS block**

In `index.html`, find the end of the `/* ─── MODAL CENTRADO EN DESKTOP ─── */` block (the last
CSS block, right before the closing `</style>`), and insert this new block right after it, still
inside `<style>…</style>`:

```css

/* ─── SIMULADOR ─── */
.patient-badges { display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0 12px; }
.sim-slider-row { margin-bottom: 18px; }
.sim-slider-label { display: flex; justify-content: space-between; align-items: baseline; font-size: 12.5px; color: var(--text2); margin-bottom: 6px; }
.sim-slider-value { font-weight: 700; color: var(--accent2); }
input.sim-slider { width: 100%; accent-color: var(--accent2); }
.sim-param-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--border); font-size: 12.5px; color: var(--text); flex-wrap: wrap; }
.sim-param-row:last-of-type { border-bottom: none; }
.sim-param-range { font-size: 11px; color: var(--text3); white-space: nowrap; }
.opt-btn.correct { outline: 2px solid var(--green); }
.opt-btn.incorrect { outline: 2px solid var(--red); }
.opt-btn.disabled { pointer-events: none; opacity: .85; }
```

- [ ] **Step 2: Add the page div**

In `index.html`, find `<!-- PAGE: PRUEBAS FUNCIONALES -->` and its closing `</div>` (the last
`.page` div inside `.main`, right before the `</div>` that closes `.main`). Insert this new page
right after the "PRUEBAS FUNCIONALES" page div closes, still inside `.main`:

```html

  <!-- PAGE: SIMULADOR -->
  <div class="page" id="page-sim">
    <div class="section-eyebrow">Práctica clínica</div>
    <div class="section-title">Simulador de agentes físicos</div>
    <div class="section-sub">Se genera un paciente aleatorio: elige el agente físico indicado y ajusta sus parámetros de dosificación.</div>
    <div id="sim-content"></div>
  </div>
```

- [ ] **Step 3: Add the nav item**

In `index.html`, find the `<div class="nav-item" onclick="showPage('pruebas',this)">` block
(the last nav item) and insert this new nav item right after its closing `</div>`, still inside
`<nav class="bottom-nav">`:

```html
  <div class="nav-item" onclick="showPage('sim',this)">
    <span class="nav-icon"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="8" r="1.2" fill="currentColor" stroke="none"/><circle cx="8" cy="16" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg></span>
    <span class="nav-label">Simulador</span>
  </div>
```

- [ ] **Step 4: Add the script tag**

In `index.html`, find `<script src="js/app.js?v=2"></script>` and insert this line right before
it:

```html
<script src="js/simulador.js?v=1"></script>
```

- [ ] **Step 5: Verify manually**

Open `index.html` directly in a browser (double-click or `start index.html` on Windows). Confirm:
- A "Simulador" entry appears in the nav (sidebar on desktop width, hamburger menu on mobile
  width) and clicking it switches to an empty "Simulador de agentes físicos" page with no
  console errors (Task 7 will fill `#sim-content`).
- No other page's layout changed.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(simulador): agregar página, nav y estilos del simulador"
```

---

### Task 7: DOM layer, part 1 — patient card + step 1 (choose agent)

**Files:**
- Modify: `js/simulador.js` (append, after the `evaluateSliders` block and before the
  `module.exports` guard)

**Interfaces:**
- Consumes: `generatePatient`, `buildChoices`, `evaluateAgentChoice`, `NONE_OPTION` (Tasks 2-4);
  `#sim-content` div (Task 6).
- Produces: module-level state `simPatient`, `simChoices`, `simStep`, `simAgentFeedback`,
  `simSliderFeedback`; functions `buildSim()`, `newSimPatient()`, `renderSim()`,
  `renderPatientCard(container)`, `renderStep1(container)`, `handleAgentChoice(choice, grid)`.
  Task 8 consumes `simStep`/`simPatient`/`simAgentFeedback` and extends `renderSim()`'s dispatch
  with the `simStep === 2` and `else` (step 3) branches — write `renderSim()` in this task with
  all three branches already present, even though `renderStep2`/`renderStep3` don't exist yet
  (Task 7 stubs them as empty functions so `renderSim()` doesn't throw; Task 8 replaces the
  stubs).

- [ ] **Step 1: Write the implementation**

Append to `js/simulador.js`, after the `evaluateSliders` function and before the
`module.exports` guard:

```js
/* ===== SIMULADOR — CAPA DOM ===== */
let simPatient = null;
let simChoices = [];
let simStep = 1;
let simAgentFeedback = null;
let simSliderFeedback = null;

function renderPatientCard(container) {
  const card = document.createElement('div');
  card.className = 'question-card';

  const pill = document.createElement('div');
  pill.className = `phase-pill ${simPatient.case.phasePill}`;
  pill.innerHTML = `<span class="phase-dot"></span>${simPatient.case.phaseLabel}`;
  card.appendChild(pill);

  const badges = document.createElement('div');
  badges.className = 'patient-badges';
  [`${simPatient.age} años`, simPatient.region].forEach(txt => {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.style.borderColor = 'var(--border2)';
    tag.style.color = 'var(--text2)';
    tag.textContent = txt;
    badges.appendChild(tag);
  });
  if (simPatient.comorbidity) {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.style.borderColor = 'var(--red-border)';
    tag.style.color = 'var(--red)';
    tag.textContent = simPatient.comorbidity.label;
    badges.appendChild(tag);
  }
  card.appendChild(badges);

  const vignette = document.createElement('div');
  vignette.className = 'q-hint';
  vignette.textContent = `Paciente de ${simPatient.age} años con ${simPatient.case.tissueLabel} en ${simPatient.region}.`;
  card.appendChild(vignette);

  container.appendChild(card);
}

function renderStep1(container) {
  const wrap = document.createElement('div');
  wrap.className = 'question-card';

  const label = document.createElement('div');
  label.className = 'result-label';
  label.textContent = '¿Qué agente físico aplicarías?';
  wrap.appendChild(label);

  const grid = document.createElement('div');
  grid.className = 'opt-grid';
  simChoices.forEach(choice => {
    const b = document.createElement('button');
    b.className = 'opt-btn opt-blue';
    const dot = document.createElement('span'); dot.className = 'opt-dot'; b.appendChild(dot);
    b.appendChild(document.createTextNode(choice));
    b.onclick = () => handleAgentChoice(choice, grid);
    grid.appendChild(b);
  });
  wrap.appendChild(grid);
  container.appendChild(wrap);
}

function handleAgentChoice(choice, grid) {
  const result = evaluateAgentChoice(simPatient, choice);
  simAgentFeedback = result;

  const correctLabel = simPatient.blocked ? NONE_OPTION : simPatient.case.target.name;
  grid.querySelectorAll('.opt-btn').forEach(btn => {
    btn.onclick = null;
    btn.classList.add('disabled');
    const label = btn.textContent;
    if (label === correctLabel) btn.classList.add('correct');
    if (label === choice && !result.correct) btn.classList.add('incorrect');
  });

  const fb = document.createElement('div');
  fb.className = 'note-box';
  fb.innerHTML = `<strong>${result.correct ? '✅ Correcto.' : '❌ No es lo indicado.'}</strong> ${result.explanation}`;
  grid.parentElement.appendChild(fb);

  const btn = document.createElement('button');
  btn.className = 'restart-btn';
  if (result.advance) {
    btn.textContent = 'Continuar → ajustar parámetros';
    btn.onclick = () => { simStep = 2; renderSim(); };
  } else {
    btn.textContent = '↻ Siguiente paciente';
    btn.onclick = () => newSimPatient();
  }
  grid.parentElement.appendChild(btn);
}

function renderStep2(container) { /* implementado en la Tarea 8 */ }
function renderStep3(container) { /* implementado en la Tarea 8 */ }

function renderSim() {
  const c = document.getElementById('sim-content');
  c.innerHTML = '';
  renderPatientCard(c);
  if (simStep === 1) renderStep1(c);
  else if (simStep === 2) renderStep2(c);
  else renderStep3(c);
}

function newSimPatient() {
  simPatient = generatePatient(Math.random);
  simChoices = buildChoices(simPatient, Math.random);
  simAgentFeedback = null;
  simSliderFeedback = null;
  simStep = 1;
  renderSim();
}

function buildSim() {
  newSimPatient();
}
```

- [ ] **Step 2: Verify manually**

In `index.html`, temporarily add `<script>buildSim();</script>` right after the
`js/simulador.js` script tag (or just call `buildSim()` from the browser console after loading
the page — either works; if you add the temporary tag, remove it before committing since Task 9
wires this properly into `app.js`). Reload the page, go to "Simulador", and confirm:
- A patient card renders with age, region, phase pill, and a vignette sentence.
- 4 or 5 option buttons render below "¿Qué agente físico aplicarías?".
- Clicking an option disables all buttons, outlines the correct one green (and the wrong pick
  red if you picked wrong), shows an explanation box, and shows either "Continuar → ajustar
  parámetros" or "↻ Siguiente paciente".
- Reload a few times (regenerating via console `buildSim()`) until you see a patient with a
  comorbidity badge, and confirm "Ninguno de estos…" appears among the options in that case.

- [ ] **Step 3: Commit**

```bash
git add js/simulador.js
git commit -m "feat(simulador): render de tarjeta de paciente y paso 1 (elegir agente)"
```

---

### Task 8: DOM layer, part 2 — step 2 (sliders) + step 3 (result)

**Files:**
- Modify: `js/simulador.js` (replace the `renderStep2`/`renderStep3` stubs from Task 7)

**Interfaces:**
- Consumes: `evaluateSliders` (Task 5); `simPatient`, `simStep`, `simAgentFeedback`,
  `simSliderFeedback`, `renderSim()` (Task 7).
- Produces: `randomSliderStart(slider, rng)`; fully working `renderStep2`/`renderStep3`;
  module-level `simSliderValues`.

- [ ] **Step 1: Write the implementation**

In `js/simulador.js`, replace the two stub functions from Task 7:

```js
function renderStep2(container) { /* implementado en la Tarea 8 */ }
function renderStep3(container) { /* implementado en la Tarea 8 */ }
```

with:

```js
let simSliderValues = [];

function randomSliderStart(slider, rng) {
  const steps = Math.round((slider.max - slider.min) / slider.step);
  const stepIndex = Math.floor(rng() * (steps + 1));
  const raw = slider.min + stepIndex * slider.step;
  return Math.round(raw * 100) / 100;
}

function renderStep2(container) {
  const target = simPatient.case.target;
  simSliderValues = target.sliders.map(s => randomSliderStart(s, Math.random));

  const wrap = document.createElement('div');
  wrap.className = 'question-card';

  const title = document.createElement('div');
  title.className = 'q-title';
  title.textContent = `Ajustar parámetros — ${target.name}`;
  wrap.appendChild(title);

  target.sliders.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'sim-slider-row';

    const labelRow = document.createElement('div');
    labelRow.className = 'sim-slider-label';
    const nameSpan = document.createElement('span');
    nameSpan.textContent = s.label;
    const valSpan = document.createElement('span');
    valSpan.className = 'sim-slider-value';
    valSpan.textContent = `${simSliderValues[i]} ${s.unit}`;
    labelRow.appendChild(nameSpan);
    labelRow.appendChild(valSpan);

    const input = document.createElement('input');
    input.type = 'range';
    input.className = 'sim-slider';
    input.min = s.min; input.max = s.max; input.step = s.step;
    input.value = simSliderValues[i];
    input.oninput = () => {
      simSliderValues[i] = parseFloat(input.value);
      valSpan.textContent = `${simSliderValues[i]} ${s.unit}`;
    };

    row.appendChild(labelRow);
    row.appendChild(input);
    wrap.appendChild(row);
  });

  const applyBtn = document.createElement('button');
  applyBtn.className = 'restart-btn';
  applyBtn.textContent = 'Aplicar tratamiento';
  applyBtn.onclick = () => {
    simSliderFeedback = evaluateSliders(target, simSliderValues);
    simStep = 3;
    renderSim();
  };
  wrap.appendChild(applyBtn);
  container.appendChild(wrap);
}

function renderStep3(container) {
  const wrap = document.createElement('div');
  wrap.className = 'question-card';

  if (!simSliderFeedback) {
    const fb = document.createElement('div');
    fb.className = 'note-box';
    fb.innerHTML = `<strong>${simAgentFeedback.correct ? '✅' : '❌'}</strong> ${simAgentFeedback.explanation}`;
    wrap.appendChild(fb);
  } else {
    const verdict = document.createElement('div');
    verdict.className = `phase-pill ${simSliderFeedback.allOk ? 'pill-green' : 'pill-red'}`;
    verdict.innerHTML = `<span class="phase-dot"></span>${simSliderFeedback.allOk ? 'Tratamiento correcto' : 'Parámetros a revisar'}`;
    wrap.appendChild(verdict);

    simSliderFeedback.results.forEach(r => {
      const row = document.createElement('div');
      row.className = 'sim-param-row';
      row.innerHTML = `<span>${r.ok ? '✅' : '❌'} ${r.label}: <strong>${r.value} ${r.unit}</strong></span><span class="sim-param-range">rango válido: ${r.validMin}–${r.validMax} ${r.unit}</span>`;
      wrap.appendChild(row);
    });

    const mech = document.createElement('div');
    mech.className = 'note-box';
    mech.innerHTML = simPatient.case.target.mech;
    wrap.appendChild(mech);
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = 'restart-btn';
  nextBtn.textContent = '↻ Siguiente paciente';
  nextBtn.onclick = () => newSimPatient();
  wrap.appendChild(nextBtn);
  container.appendChild(wrap);
}
```

- [ ] **Step 2: Verify manually**

Reload the page (still calling `buildSim()` from the console, or via the temporary tag from
Task 7). Generate patients until you get one without a blocking comorbidity, pick the correct
agent, and confirm:
- "Continuar → ajustar parámetros" leads to a slider screen titled `Ajustar parámetros — <agent
  name>`, with 2 or 3 sliders, each showing a live value+unit that updates while dragging.
- Clicking "Aplicar tratamiento" shows a green "Tratamiento correcto" or red "Parámetros a
  revisar" pill, a ✅/❌ row per parameter with its valid range, the agent's mechanism text, and
  a "↻ Siguiente paciente" button.
- Deliberately drag a slider outside its valid range before applying, and confirm that specific
  row shows ❌ while the others still show ✅ (mirrors the `evaluateSliders` unit tests).
- "↻ Siguiente paciente" generates a new patient and returns to step 1.

- [ ] **Step 3: Commit**

```bash
git add js/simulador.js
git commit -m "feat(simulador): render de paso 2 (sliders) y paso 3 (resultado)"
```

---

### Task 9: Wire into `app.js` init and final QA pass

**Files:**
- Modify: `js/app.js:1038-1044` (the `/* ===== INIT ===== */` block)

**Interfaces:**
- Consumes: `buildSim()` (Task 7).
- Produces: the simulator now initializes automatically on page load, like every other section.

- [ ] **Step 1: Add `buildSim()` to the init block**

In `js/app.js`, find:

```js
/* ===== INIT ===== */
renderFlow('start');
buildRef();
buildMech();
buildDolor();
buildTime();
buildKine();
buildPharma();
```

and change it to:

```js
/* ===== INIT ===== */
renderFlow('start');
buildRef();
buildMech();
buildDolor();
buildTime();
buildKine();
buildPharma();
buildSim();
```

If you added a temporary `<script>buildSim();</script>` tag in `index.html` during Task 7's
manual verification, remove it now — `app.js` calls `buildSim()` on load going forward.

- [ ] **Step 2: Run the full automated test suite one more time**

Run: `node --test tests/simulador.test.js`
Expected: PASS (17 tests, unchanged — this task only touches DOM wiring)

- [ ] **Step 3: Full manual QA pass (spec §9)**

Open `index.html` in a browser and, on the "Simulador" tab (reached via the nav, not the
console):

1. Generate ≥15 patients (using "↻ Siguiente paciente" / "Nuevo paciente") and confirm all 12
   cases appear over enough tries, with varied regions/ages, and a comorbidity badge shows up
   roughly 4 times in 10.
2. For a patient with a blocking comorbidity, confirm "Ninguno de estos…" is the option
   outlined green as correct, and that choosing it does **not** lead to a sliders step.
3. For a patient without a comorbidity, choose the correct agent and confirm the sliders'
   ✅/❌ verdicts match the valid ranges from the Task 1 data table.
4. Deliberately choose a distractor and confirm the explanation names a real, different phase/
   tissue (not a generic message).
5. Resize the browser to ~400px width (or use dev-tools device emulation) and confirm the
   patient card, option buttons, and sliders have no horizontal scroll and are usable with touch
   — the sidebar should collapse to the hamburger menu exactly as it does on every other page.

- [ ] **Step 4: Commit**

```bash
git add js/app.js
git commit -m "feat(simulador): inicializar el simulador en el arranque de la app"
```
