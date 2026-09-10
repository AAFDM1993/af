const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
  AGENT_CATALOG, SIM_CASES, SIM_COMORBILIDADES,
  pickRandomItem, pickRandomInt, survivingAgents, generatePatient,
  NONE_OPTION, shuffle, findHomeCase, evaluateAgentChoice, evaluateSliders,
} = require('../js/simulador.js');

function fakeRng(sequence) {
  let i = 0;
  return () => sequence[i++ % sequence.length];
}

/* ===== DATOS ===== */

test('AGENT_CATALOG has 13 unique agents', () => {
  assert.equal(AGENT_CATALOG.length, 13);
  const ids = new Set(AGENT_CATALOG.map(a => a.id));
  assert.equal(ids.size, 13, 'todos los ids deben ser únicos');
  AGENT_CATALOG.forEach(a => {
    assert.ok(a.id && a.name && a.icon && a.color);
  });
});

test('SIM_CASES has 12 well-formed cases with agents keyed by agentBase', () => {
  assert.equal(SIM_CASES.length, 12);
  const catalogIds = new Set(AGENT_CATALOG.map(a => a.id));
  const ids = new Set();
  SIM_CASES.forEach(c => {
    assert.ok(c.id && !ids.has(c.id), `id duplicado o vacío: ${c.id}`);
    ids.add(c.id);
    assert.ok(c.phaseLabel && c.phasePill && c.tissueLabel);
    assert.ok(Array.isArray(c.regions) && c.regions.length >= 3);
    assert.ok(Array.isArray(c.agents) && c.agents.length >= 2, `${c.id}: debe tener al menos 2 agentes`);
    c.agents.forEach(a => {
      assert.ok(catalogIds.has(a.agentBase), `${c.id}: agentBase desconocido "${a.agentBase}"`);
      assert.ok(a.name && a.mech);
      assert.ok(a.sliders.length >= 1 && a.sliders.length <= 3, `${c.id}/${a.name}: debe tener 1-3 sliders`);
      a.sliders.forEach(s => {
        assert.ok(s.min <= s.validMin && s.validMin <= s.validMax && s.validMax <= s.max,
          `${c.id}/${a.name}/${s.label}: el rango de control debe contener el rango válido`);
      });
    });
  });
});

test('every catalog agent is valid in at least one case', () => {
  AGENT_CATALOG.forEach(cat => {
    const used = SIM_CASES.some(c => c.agents.some(a => a.agentBase === cat.id));
    assert.ok(used, `${cat.id} (${cat.name}) nunca aparece como agente válido en ningún caso`);
  });
});

test('SIM_COMORBILIDADES has exactly 6 entries referencing known agent bases', () => {
  const catalogIds = new Set(AGENT_CATALOG.map(a => a.id));
  assert.equal(SIM_COMORBILIDADES.length, 6);
  SIM_COMORBILIDADES.forEach(m => {
    assert.ok(m.id && m.label);
    assert.ok(Array.isArray(m.excludes) && m.excludes.length >= 1);
    m.excludes.forEach(base => assert.ok(catalogIds.has(base), `${m.id}: base desconocida "${base}"`));
  });
});

/* ===== survivingAgents / generatePatient ===== */

test('survivingAgents: sin comorbilidad devuelve todos los agentes del caso', () => {
  const c = SIM_CASES[0];
  assert.deepEqual(survivingAgents(c, null), c.agents);
});

test('survivingAgents: con comorbilidad filtra solo los agentes excluidos, no todos', () => {
  const c = SIM_CASES[0]; // ag_dolor: tens, us, laser, mag, diad
  const metal = SIM_COMORBILIDADES.find(m => m.id === 'metal'); // excludes inter, us
  const surviving = survivingAgents(c, metal);
  assert.equal(surviving.length, 4);
  assert.ok(!surviving.some(a => a.agentBase === 'us'));
  assert.ok(surviving.some(a => a.agentBase === 'tens'));
});

test('generatePatient: rng en 0 elige el primer caso/región, edad mínima, sin comorbilidad', () => {
  const rng = fakeRng([0, 0, 0, 0.99]);
  const p = generatePatient(rng);
  assert.equal(p.case, SIM_CASES[0]);
  assert.equal(p.region, SIM_CASES[0].regions[0]);
  assert.equal(p.age, 18);
  assert.equal(p.comorbidity, null);
  assert.equal(p.blocked, false);
});

test('generatePatient: blocked es true solo cuando la comorbilidad excluye TODOS los agentes del caso', () => {
  // ag_espasmo (índice 2): tens, us, mag, laser — los 4 están en excludes de "neoplasia"
  const caseIndex = SIM_CASES.findIndex(c => c.id === 'ag_espasmo');
  const comorbIndex = SIM_COMORBILIDADES.findIndex(m => m.id === 'neoplasia');
  const caseRoll = (caseIndex + 0.5) / SIM_CASES.length;
  const comorbRoll = (comorbIndex + 0.5) / SIM_COMORBILIDADES.length;
  const rng = fakeRng([caseRoll, 0, 0, 0.1, comorbRoll]);
  const p = generatePatient(rng);
  assert.equal(p.case.id, 'ag_espasmo');
  assert.equal(p.comorbidity.id, 'neoplasia');
  assert.equal(p.blocked, true);
});

test('generatePatient: age siempre queda en [18,75]', () => {
  for (let i = 0; i < 50; i++) {
    const p = generatePatient(Math.random);
    assert.ok(p.age >= 18 && p.age <= 75);
  }
});

/* ===== shuffle ===== */

test('shuffle: devuelve una permutación del mismo arreglo, sin mutar el original', () => {
  const original = AGENT_CATALOG.slice();
  const copy = AGENT_CATALOG.slice();
  const shuffled = shuffle(copy, Math.random);
  assert.deepEqual(copy, original, 'no debe mutar el arreglo pasado');
  assert.equal(shuffled.length, original.length);
  assert.deepEqual([...shuffled].sort((a, b) => a.id.localeCompare(b.id)),
    [...original].sort((a, b) => a.id.localeCompare(b.id)));
});

/* ===== findHomeCase ===== */

test('findHomeCase: ubica el caso dueño de un agentBase exclusivo, o null si no existe', () => {
  const home = findHomeCase('oc'); // Ondas de choque solo aparece en tend_cr
  assert.equal(home.id, 'tend_cr');
  assert.equal(findHomeCase('agente-inexistente'), null);
});

/* ===== evaluateAgentChoice ===== */

test('evaluateAgentChoice: elegir un agente válido y no bloqueado es correcto y avanza', () => {
  const patient = { case: SIM_CASES[0], comorbidity: null, blocked: false }; // ag_dolor
  const r = evaluateAgentChoice(patient, 'tens');
  assert.equal(r.correct, true);
  assert.equal(r.advance, true);
  assert.equal(r.agent.agentBase, 'tens');
  assert.equal(r.explanation, SIM_CASES[0].agents.find(a => a.agentBase === 'tens').mech);
});

test('evaluateAgentChoice: agente válido para el caso pero excluido por la comorbilidad del paciente', () => {
  const metal = SIM_COMORBILIDADES.find(m => m.id === 'metal');
  const patient = { case: SIM_CASES[0], comorbidity: metal, blocked: false }; // ag_dolor, us excluido por metal
  const r = evaluateAgentChoice(patient, 'us');
  assert.equal(r.correct, false);
  assert.equal(r.advance, false);
  assert.ok(r.explanation.includes('US pulsado 1:4'));
  assert.ok(r.explanation.includes(metal.label));
});

test('evaluateAgentChoice: agente no válido para este caso cita el caso de origen', () => {
  const patient = { case: SIM_CASES[0], comorbidity: null, blocked: false }; // ag_dolor
  const r = evaluateAgentChoice(patient, 'oc'); // solo válido en tend_cr
  assert.equal(r.correct, false);
  assert.ok(r.explanation.includes(SIM_CASES[11].phaseLabel));
});

test('evaluateAgentChoice: "Ninguno" es correcto cuando el caso está bloqueado', () => {
  const neoplasia = SIM_COMORBILIDADES.find(m => m.id === 'neoplasia');
  const patient = { case: SIM_CASES[2], comorbidity: neoplasia, blocked: true }; // ag_espasmo
  const r = evaluateAgentChoice(patient, NONE_OPTION);
  assert.equal(r.correct, true);
  assert.equal(r.advance, false);
  assert.ok(r.explanation.includes(neoplasia.label));
});

test('evaluateAgentChoice: "Ninguno" es incorrecto cuando no hay bloqueo', () => {
  const patient = { case: SIM_CASES[0], comorbidity: null, blocked: false };
  const r = evaluateAgentChoice(patient, NONE_OPTION);
  assert.equal(r.correct, false);
  assert.equal(r.advance, false);
});

/* ===== evaluateSliders ===== */

test('evaluateSliders: todos los valores dentro de rango -> allOk true', () => {
  const agent = SIM_CASES[0].agents[0]; // TENS convencional
  const midValues = agent.sliders.map(s => (s.validMin + s.validMax) / 2);
  const r = evaluateSliders(agent, midValues);
  assert.equal(r.allOk, true);
  r.results.forEach(res => assert.equal(res.ok, true));
});

test('evaluateSliders: un valor fuera de rango marca solo ese parámetro como incorrecto', () => {
  const agent = SIM_CASES[0].agents[0];
  const values = agent.sliders.map(s => s.validMin);
  values[0] = agent.sliders[0].validMin - 10;
  const r = evaluateSliders(agent, values);
  assert.equal(r.allOk, false);
  assert.equal(r.results[0].ok, false);
  assert.equal(r.results[1].ok, true);
});

test('evaluateSliders: los límites validMin/validMax cuentan como correctos', () => {
  const agent = SIM_CASES[0].agents[0];
  const values = agent.sliders.map(s => s.validMax);
  const r = evaluateSliders(agent, values);
  assert.equal(r.allOk, true);
});
