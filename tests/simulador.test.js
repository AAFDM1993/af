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
