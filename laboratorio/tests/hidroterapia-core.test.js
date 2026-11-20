const test = require('node:test');
const assert = require('node:assert/strict');
const H = require('../js/hidroterapia-core.js');
const K = require('../js/lab-kit.js');

test('MODALITIES: ids únicos y las modalidades de la clase', () => {
  const ids = H.MODALITIES.map(m => m.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ['hubbard', 'piscina', 'whirlpool', 'whirlpool-frio', 'sauna', 'turco', 'afusion', 'ablucion', 'contraste']) {
    assert.ok(ids.includes(id), id);
  }
});

test('checkTemperature: whirlpool 38–39 °C con bordes inclusivos', () => {
  assert.equal(H.checkTemperature('whirlpool', 38), 'ok');
  assert.equal(H.checkTemperature('whirlpool', 39), 'ok');
  assert.equal(H.checkTemperature('whirlpool', 37.9), 'bajo');
  assert.equal(H.checkTemperature('whirlpool', 39.1), 'alto');
});

test('checkTemperature: piscina 35–36, sauna 45–50, turco 38–45, hubbard 35–37', () => {
  assert.equal(H.checkTemperature('piscina', 35), 'ok');
  assert.equal(H.checkTemperature('piscina', 36), 'ok');
  assert.equal(H.checkTemperature('piscina', 36.1), 'alto');
  assert.equal(H.checkTemperature('sauna', 45), 'ok');
  assert.equal(H.checkTemperature('sauna', 50), 'ok');
  assert.equal(H.checkTemperature('sauna', 44), 'bajo');
  assert.equal(H.checkTemperature('turco', 38), 'ok');
  assert.equal(H.checkTemperature('turco', 45), 'ok');
  assert.equal(H.checkTemperature('turco', 46), 'alto');
  assert.equal(H.checkTemperature('hubbard', 36), 'ok');
  assert.equal(H.checkTemperature('hubbard', 40), 'alto');
});

test('checkTemperature: sin rango en la clase o id desconocido lanza', () => {
  assert.throws(() => H.checkTemperature('whirlpool-frio', 10));
  assert.throws(() => H.checkTemperature('ablucion', 10));
  assert.throws(() => H.checkTemperature('zzz', 36));
});

test('thermalEffect: frío vasoconstricción y caliente vasodilatación', () => {
  const f = H.thermalEffect('frio'), c = H.thermalEffect('caliente');
  assert.ok(/constricción/.test(f.vaso) && /dilatación/.test(c.vaso));
  assert.ok(/estimulación/i.test(f.accion) && /sedación/i.test(c.accion));
  assert.throws(() => H.thermalEffect('tibio'));
});

test('evaluateModality: modalidad adecuada o a revisar', () => {
  assert.equal(H.evaluateModality({ modality: 'whirlpool-frio', indication: 'esguince-agudo' }).veredicto, 'adecuada');
  assert.equal(H.evaluateModality({ modality: 'sauna', indication: 'esguince-agudo' }).veredicto, 'revisar');
  assert.equal(H.evaluateModality({ modality: 'hubbard', indication: 'espasticidad' }).veredicto, 'adecuada');
  assert.equal(H.evaluateModality({ modality: 'ablucion', indication: 'fiebre' }).veredicto, 'adecuada');
  assert.throws(() => H.evaluateModality({ modality: 'sauna', indication: 'zzz' }));
});

test('INDICATIONS y PROPERTIES con los datos de la clase', () => {
  const ids = H.INDICATIONS.map(i => i.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(H.INDICATIONS.every(i => i.modalities.every(m => H.MODALITIES.some(x => x.id === m))));
  assert.equal(H.PROPERTIES.length, 5);
});

test('CONDITIONS: ids únicos, todas contraindicaciones, y una vacía no bloquea', () => {
  const ids = H.CONDITIONS.map(c => c.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(H.CONDITIONS.every(c => c.nivel === 'contra'));
  assert.equal(K.checkConditions(H.CONDITIONS, ['epilepsia-severa']).bloqueado, true);
  assert.equal(K.checkConditions(H.CONDITIONS, []).bloqueado, false);
});

test('CASES: 3 casos, cada uno acepta su propia respuesta correcta', () => {
  assert.equal(H.CASES.length, 3);
  for (const c of H.CASES) {
    assert.ok(c.titulo && c.texto && c.respuesta && c.spec.apto, c.id);
    const a = {};
    for (const f of Object.keys(c.spec)) a[f] = c.spec[f].any ? c.spec[f].any[0] : c.spec[f].min;
    const g = K.gradeCase(c.spec, a);
    assert.equal(g.puntos, g.total, c.id);
    assert.ok(!/equipo|marca/i.test(c.texto + c.respuesta), c.id);
  }
});
