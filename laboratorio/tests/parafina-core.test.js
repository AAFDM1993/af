const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../js/parafina-core.js');
const K = require('../js/lab-kit.js');

test('layerBuildSeconds: 10 s por inmersión y 10 s de pausa entre capas', () => {
  assert.equal(P.layerBuildSeconds(7), 130);
  assert.equal(P.layerBuildSeconds(10), 190);
  assert.equal(P.layerBuildSeconds(1), 10);
  assert.equal(P.layerBuildSeconds(0), 0);
  assert.equal(P.layerBuildSeconds(-3), 0);
});

const OK = { method: 'inmersion', layers: 8, minutes: 12, bathC: 47, wrapped: true };

test('evaluateApplication: aplicación correcta', () => {
  assert.equal(P.evaluateApplication(OK).veredicto, 'ok');
});

test('evaluateApplication: baño 42–52 °C con bordes inclusivos', () => {
  assert.equal(P.evaluateApplication({ ...OK, bathC: 42 }).veredicto, 'ok');
  assert.equal(P.evaluateApplication({ ...OK, bathC: 52 }).veredicto, 'ok');
  assert.equal(P.evaluateApplication({ ...OK, bathC: 53 }).veredicto, 'riesgo');
  assert.equal(P.evaluateApplication({ ...OK, bathC: 41.9 }).veredicto, 'ajustar');
});

test('evaluateApplication: capas 7–10 y minutos 10–15', () => {
  assert.equal(P.evaluateApplication({ ...OK, layers: 7 }).veredicto, 'ok');
  assert.equal(P.evaluateApplication({ ...OK, layers: 10 }).veredicto, 'ok');
  assert.equal(P.evaluateApplication({ ...OK, layers: 6 }).veredicto, 'ajustar');
  assert.equal(P.evaluateApplication({ ...OK, layers: 11 }).veredicto, 'ajustar');
  assert.equal(P.evaluateApplication({ ...OK, minutes: 10 }).veredicto, 'ok');
  assert.equal(P.evaluateApplication({ ...OK, minutes: 15 }).veredicto, 'ok');
  assert.equal(P.evaluateApplication({ ...OK, minutes: 9 }).veredicto, 'ajustar');
  assert.equal(P.evaluateApplication({ ...OK, minutes: 16 }).veredicto, 'ajustar');
});

test('evaluateApplication: sin envolver hay que ajustar; el pincelado ignora la temperatura del baño', () => {
  assert.equal(P.evaluateApplication({ ...OK, wrapped: false }).veredicto, 'ajustar');
  assert.equal(P.evaluateApplication({ ...OK, method: 'pincelado', bathC: 99 }).veredicto, 'ok');
});

test('evaluateApplication: valores en cero no producen NaN', () => {
  const r = P.evaluateApplication({ method: 'inmersion', layers: 0, minutes: 0, bathC: 0, wrapped: true });
  assert.ok(['ajustar', 'riesgo'].includes(r.veredicto));
  assert.ok(r.mensajes.every(m => !/NaN/.test(m)));
});

test('CONDITIONS: 7 contraindicaciones únicas y una precaución', () => {
  const ids = P.CONDITIONS.map(c => c.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(P.CONDITIONS.filter(c => c.nivel === 'contra').length, 7);
  assert.ok(P.CONDITIONS.some(c => c.nivel === 'precaucion'));
  assert.equal(K.checkConditions(P.CONDITIONS, ['herida']).bloqueado, true);
  assert.equal(P.INDICATIONS.length, 7);
});

test('CASES: 3 casos, cada uno acepta su propia respuesta correcta', () => {
  assert.equal(P.CASES.length, 3);
  for (const c of P.CASES) {
    assert.ok(c.titulo && c.texto && c.respuesta && c.spec.apto, c.id);
    const a = {};
    for (const f of Object.keys(c.spec)) a[f] = c.spec[f].any ? c.spec[f].any[0] : c.spec[f].min;
    const g = K.gradeCase(c.spec, a);
    assert.equal(g.puntos, g.total, c.id);
    assert.ok(!/equipo|marca/i.test(c.texto + c.respuesta), c.id);
  }
});
