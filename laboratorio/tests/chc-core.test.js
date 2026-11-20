const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../js/chc-core.js');
const K = require('../js/lab-kit.js');

test('conductionGainMS: 2 m/s por cada °C', () => {
  assert.equal(C.conductionGainMS(1), 2);
  assert.equal(C.conductionGainMS(5), 10);
  assert.equal(C.conductionGainMS(0), 0);
});

test('evaluateSession: sesión correcta', () => {
  const r = C.evaluateSession({ towels: 2, minutes: 10, skinChecked: true });
  assert.equal(r.veredicto, 'ok');
});

test('evaluateSession: menos de 2 toallas es riesgo de quemadura', () => {
  assert.equal(C.evaluateSession({ towels: 1, minutes: 10, skinChecked: true }).veredicto, 'riesgo');
  assert.equal(C.evaluateSession({ towels: 0, minutes: 10, skinChecked: true }).veredicto, 'riesgo');
});

test('evaluateSession: 8 min es el borde; 7,9 es insuficiente', () => {
  assert.equal(C.evaluateSession({ towels: 2, minutes: 8, skinChecked: true }).veredicto, 'ok');
  assert.equal(C.evaluateSession({ towels: 2, minutes: 7.9, skinChecked: true }).veredicto, 'insuficiente');
});

test('evaluateSession: 0 minutos no produce NaN ni lanza', () => {
  const r = C.evaluateSession({ towels: 2, minutes: 0, skinChecked: true });
  assert.equal(r.veredicto, 'insuficiente');
  assert.ok(r.mensajes.every(m => typeof m === 'string' && !/NaN/.test(m)));
});

test('evaluateSession: sin revisar la piel avisa pero no cambia el veredicto', () => {
  const r = C.evaluateSession({ towels: 2, minutes: 10, skinChecked: false });
  assert.equal(r.veredicto, 'ok');
  assert.ok(r.mensajes.length >= 1);
});

test('CONDITIONS: 7 contraindicaciones únicas y precauciones de sensibilidad', () => {
  const ids = C.CONDITIONS.map(c => c.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(C.CONDITIONS.filter(c => c.nivel === 'contra').length, 7);
  assert.ok(C.CONDITIONS.some(c => c.nivel === 'precaucion'));
  assert.equal(K.checkConditions(C.CONDITIONS, ['fiebre']).bloqueado, true);
});

test('CASES: 3 casos, cada uno acepta su propia respuesta correcta', () => {
  assert.equal(C.CASES.length, 3);
  for (const c of C.CASES) {
    assert.ok(c.titulo && c.texto && c.respuesta && c.spec.apto, c.id);
    const a = {};
    for (const f of Object.keys(c.spec)) a[f] = c.spec[f].any ? c.spec[f].any[0] : c.spec[f].min;
    const g = K.gradeCase(c.spec, a);
    assert.equal(g.puntos, g.total, c.id);
    assert.ok(!/equipo|marca/i.test(c.texto + c.respuesta), c.id);
  }
});
