const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('../js/analgesia-core.js');
const K = require('../js/lab-kit.js');
const BAD = new RegExp(['equi' + 'po', '(?<![a-záéíóú])mar' + 'cas?(?![a-záéíóú])'].join('|'), 'i');
const near = (a, b, e) => Math.abs(a - b) <= e;

test('FIBERS: velocidades de la clase', () => {
  assert.deepEqual(A.FIBERS.C.vMS, [1, 2]);
  assert.deepEqual(A.FIBERS.Adelta.vMS, [20, 25]);
  assert.deepEqual(A.FIBERS.Abeta.vMS, [50, 70]);
  assert.deepEqual(A.LEVELS, ['sin-corriente', 'debil', 'intensa', 'muy-intensa']);
});

test('activeFibers por nivel de intensidad', () => {
  assert.deepEqual(A.activeFibers('sin-corriente'), []);
  assert.deepEqual(A.activeFibers('debil'), ['Abeta']);
  assert.deepEqual(A.activeFibers('intensa'), ['Abeta', 'Adelta']);
  assert.deepEqual(A.activeFibers('muy-intensa'), ['Abeta', 'Adelta', 'C']);
  assert.throws(() => A.activeFibers('zzz'));
});

test('modeFor: convencional 80–120 Hz, acupuntura 1–20 Hz', () => {
  assert.equal(A.modeFor(100), 'convencional');
  assert.equal(A.modeFor(80), 'convencional');
  assert.equal(A.modeFor(120), 'convencional');
  assert.equal(A.modeFor(79), null);
  assert.equal(A.modeFor(121), null);
  assert.equal(A.modeFor(1), 'acupuntura');
  assert.equal(A.modeFor(20), 'acupuntura');
  assert.equal(A.modeFor(0), null);
  assert.equal(A.modeFor(21), null);
});

test('gateState', () => {
  assert.equal(A.gateState('sin-corriente', 100), 'abierta');
  assert.equal(A.gateState('debil', 100), 'cerrada');
  assert.equal(A.gateState('intensa', 100), 'parcial');
  assert.equal(A.gateState('muy-intensa', 100), 'abierta');
  assert.equal(A.gateState('debil', 2), 'abierta');
  assert.equal(A.gateState('debil', 50), 'abierta');
  assert.equal(A.gateState('debil', 0), 'abierta');
});

test('endorphins', () => {
  assert.equal(A.endorphins(2, 'debil'), true);
  assert.equal(A.endorphins(2, 'sin-corriente'), false);
  assert.equal(A.endorphins(100, 'debil'), false);
});

test('painPerceived, incluso con frecuencias fuera de las tablas', () => {
  assert.equal(A.painPerceived('sin-corriente', 100), 'alto');
  assert.equal(A.painPerceived('debil', 100), 'bajo');
  assert.equal(A.painPerceived('debil', 2), 'bajo');
  assert.equal(A.painPerceived('intensa', 100), 'medio');
  assert.equal(A.painPerceived('muy-intensa', 100), 'alto');
  assert.equal(A.painPerceived('debil', 50), 'medio');
  assert.equal(A.painPerceived('debil', 0), 'medio');
});

test('onset y warning', () => {
  assert.ok(/2 a 5 min/.test(A.onset('convencional').inicio));
  assert.ok(/30 a 120 min/.test(A.onset('acupuntura').inicio) && /6 a 7 h/.test(A.onset('acupuntura').duracion));
  assert.equal(A.onset(null), null);
  assert.equal(A.warning('debil'), null);
  assert.equal(A.warning('sin-corriente'), null);
  assert.ok(/fibras C/.test(A.warning('muy-intensa')));
  assert.ok(/Aδ/.test(A.warning('intensa')));
});

test('animDuration: proporción de las velocidades', () => {
  assert.equal(A.animDuration('C', 4000), 4000);
  assert.equal(A.animDuration('Abeta', 4000), 100);
  assert.ok(near(A.animDuration('Adelta', 4000), 266.67, 0.01));
  assert.ok(A.animDuration('C', 4000) > A.animDuration('Adelta', 4000) && A.animDuration('Adelta', 4000) > A.animDuration('Abeta', 4000));
});

test('STEPS: 5 pasos con su estado', () => {
  assert.equal(A.STEPS.length, 5);
  assert.equal(new Set(A.STEPS.map(s => s.id)).size, 5);
  assert.equal(A.STEPS[0].estado.corriente, false);
  assert.equal(A.STEPS[0].estado.dolor, 'alto');
  assert.equal(A.STEPS[3].estado.compuerta, 'cerrada');
  assert.equal(A.STEPS[3].estado.dolor, 'bajo');
  assert.equal(A.STEPS[4].estado.endorfinas, true);
  assert.equal(A.STEPS[4].estado.hz, 2);
  for (const s of A.STEPS) {
    assert.ok(s.titulo && s.texto, s.id);
    assert.ok(!BAD.test(s.titulo + s.texto), s.id);
  }
});

test('CASES: 3 preguntas con una opción correcta cada una', () => {
  assert.equal(A.CASES.length, 3);
  assert.equal(A.OPTIONS.length, 4);
  const keys = A.OPTIONS.map(o => o[0]);
  for (const c of A.CASES) {
    assert.ok(c.titulo && c.texto && c.respuesta, c.id);
    assert.ok(keys.includes(c.spec.resp.any[0]), c.id);
    assert.ok(!BAD.test(c.texto + c.respuesta), c.id);
    const ok = K.gradeCase(c.spec, { resp: c.spec.resp.any[0] });
    assert.equal(ok.puntos, ok.total);
    const wrong = keys.find(k => k !== c.spec.resp.any[0]);
    assert.equal(K.gradeCase(c.spec, { resp: wrong }).puntos, 0);
  }
  assert.deepEqual(A.CASES.map(c => c.spec.resp.any[0]), ['a', 'b', 'c']);
});
