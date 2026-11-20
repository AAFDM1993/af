const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../js/crioterapia-core.js');
const K = require('../js/lab-kit.js');

test('vascularResponse: franjas de la clase con sus bordes', () => {
  assert.equal(C.vascularResponse(0), 'sin-estimulo');
  assert.equal(C.vascularResponse(4.9), 'sin-estimulo');
  assert.equal(C.vascularResponse(5), 'vasoconstriccion-superficial');
  assert.equal(C.vascularResponse(7.9), 'vasoconstriccion-superficial');
  assert.equal(C.vascularResponse(8), 'vasoconstriccion-profunda');
  assert.equal(C.vascularResponse(15), 'vasoconstriccion-profunda');
  assert.equal(C.vascularResponse(15.1), 'vasodilatacion-refleja');
});

test('sensitivityTest: ampolla, eritema y sin respuesta', () => {
  assert.equal(C.sensitivityTest({ blister: true, erythemaAt5min: false }), 'positiva');
  assert.equal(C.sensitivityTest({ blister: true, erythemaAt5min: true }), 'positiva');
  assert.equal(C.sensitivityTest({ blister: false, erythemaAt5min: true }), 'negativa');
  assert.equal(C.sensitivityTest({ blister: false, erythemaAt5min: false }), 'no-concluyente');
});

test('METHODS: 5 métodos con ids únicos y tipo conducción o convección', () => {
  const ids = C.METHODS.map(m => m.id);
  assert.deepEqual(ids, ['bolsa-hielo', 'cold-pack', 'toalla-fria', 'criomasaje', 'spray']);
  assert.ok(C.METHODS.every(m => ['conduccion', 'conveccion'].includes(m.tipo)));
  assert.equal(C.METHODS.find(m => m.id === 'spray').tipo, 'conveccion');
});

const OK = { method: 'cold-pack', minutes: 12, cyanosis: false, sensitivityTested: true };

test('evaluateApplication: aplicación correcta y rango del método', () => {
  assert.equal(C.evaluateApplication(OK).veredicto, 'ok');
  assert.equal(C.evaluateApplication({ ...OK, minutes: 9 }).veredicto, 'ajustar');
  assert.equal(C.evaluateApplication({ ...OK, minutes: 16 }).veredicto, 'ajustar');
});

test('evaluateApplication: criomasaje 5 y 10 min son los bordes', () => {
  const m = { ...OK, method: 'criomasaje' };
  assert.equal(C.evaluateApplication({ ...m, minutes: 5 }).veredicto, 'ok');
  assert.equal(C.evaluateApplication({ ...m, minutes: 10 }).veredicto, 'ok');
  assert.equal(C.evaluateApplication({ ...m, minutes: 4.9 }).veredicto, 'ajustar');
  assert.equal(C.evaluateApplication({ ...m, minutes: 10.1 }).veredicto, 'ajustar');
});

test('evaluateApplication: la cianosis interrumpe aunque el tiempo sea correcto', () => {
  assert.equal(C.evaluateApplication({ ...OK, cyanosis: true }).veredicto, 'interrumpir');
});

test('evaluateApplication: el spray no exige minutos; sin test de sensibilidad solo avisa', () => {
  assert.equal(C.evaluateApplication({ method: 'spray', minutes: 0, cyanosis: false, sensitivityTested: true }).veredicto, 'ok');
  const r = C.evaluateApplication({ ...OK, sensitivityTested: false });
  assert.equal(r.veredicto, 'ok');
  assert.ok(r.mensajes.length >= 1);
});

test('evaluateApplication: método desconocido lanza', () => {
  assert.throws(() => C.evaluateApplication({ ...OK, method: 'zzz' }));
});

test('CONDITIONS: 6 contraindicaciones únicas', () => {
  const ids = C.CONDITIONS.map(c => c.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(C.CONDITIONS.filter(c => c.nivel === 'contra').length, 6);
  assert.equal(K.checkConditions(C.CONDITIONS, ['raynaud']).bloqueado, true);
  assert.ok(C.INDICATIONS.length >= 5);
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
