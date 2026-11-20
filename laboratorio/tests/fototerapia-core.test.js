const test = require('node:test');
const assert = require('node:assert/strict');
const F = require('../js/fototerapia-core.js');
const K = require('../js/lab-kit.js');

test('irBand: IR-A 760–1500, IR-B hasta 3000, IR-C hasta 15000', () => {
  assert.equal(F.irBand(760), 'IR-A');
  assert.equal(F.irBand(1500), 'IR-A');
  assert.equal(F.irBand(1501), 'IR-B');
  assert.equal(F.irBand(3000), 'IR-B');
  assert.equal(F.irBand(3001), 'IR-C');
  assert.equal(F.irBand(15000), 'IR-C');
  assert.equal(F.irBand(759), null);
  assert.equal(F.irBand(15001), null);
});

test('uvBand: UV-A 315–400, UV-B 280–315, UV-C 100–280', () => {
  assert.equal(F.uvBand(400), 'UV-A');
  assert.equal(F.uvBand(315), 'UV-A');
  assert.equal(F.uvBand(314.9), 'UV-B');
  assert.equal(F.uvBand(280), 'UV-B');
  assert.equal(F.uvBand(279.9), 'UV-C');
  assert.equal(F.uvBand(100), 'UV-C');
  assert.equal(F.uvBand(99), null);
  assert.equal(F.uvBand(401), null);
});

test('pironLevel: 0,5 moderado, 1 intenso, 1,5 intolerable', () => {
  assert.equal(F.pironLevel(0.5).nivel, 'moderado');
  assert.deepEqual(F.pironLevel(0.5).minutos, [10, 30]);
  assert.equal(F.pironLevel(0.9).nivel, 'moderado');
  assert.equal(F.pironLevel(1).nivel, 'intenso');
  assert.deepEqual(F.pironLevel(1).minutos, [30, 45]);
  assert.equal(F.pironLevel(1.4).nivel, 'intenso');
  assert.equal(F.pironLevel(1.5).nivel, 'intolerable');
  assert.equal(F.pironLevel(1.5).minutos, null);
  assert.equal(F.pironLevel(2).nivel, 'intolerable');
});

test('irEffects: efectos según los minutos de la clase', () => {
  assert.deepEqual(F.irEffects(0), []);
  assert.deepEqual(F.irEffects(9), []);
  const e10 = F.irEffects(10).join('|');
  assert.ok(/Analgésico/.test(e10) && /Descontracturante/.test(e10) && !/Antiinflamatorio/.test(e10));
  const e30 = F.irEffects(30).join('|');
  assert.ok(/Antiinflamatorio/.test(e30) && /Sedativo/.test(e30));
});

test('evaluateIR: 60 cm, gafas y piel seca', () => {
  assert.equal(F.evaluateIR({ distanceCm: 60, minutes: 15, glasses: true, skinDry: true }).veredicto, 'ok');
  assert.equal(F.evaluateIR({ distanceCm: 30, minutes: 15, glasses: true, skinDry: true }).veredicto, 'ajustar');
  assert.equal(F.evaluateIR({ distanceCm: 60, minutes: 15, glasses: false, skinDry: true }).veredicto, 'ajustar');
  assert.equal(F.evaluateIR({ distanceCm: 60, minutes: 15, glasses: true, skinDry: false }).veredicto, 'ajustar');
  const r = F.evaluateIR({ distanceCm: 0, minutes: 0, glasses: true, skinDry: true });
  assert.ok(r.mensajes.every(m => !/NaN/.test(m)));
});

test('erythemaGrade: bordes de 1, 2,5, 5 y 10 MED', () => {
  assert.equal(F.erythemaGrade(0.5).grado, 0);
  assert.equal(F.erythemaGrade(1).grado, 1);
  assert.equal(F.erythemaGrade(2.49).grado, 1);
  assert.equal(F.erythemaGrade(2.5).grado, 2);
  assert.equal(F.erythemaGrade(4.9).grado, 2);
  assert.equal(F.erythemaGrade(5).grado, 3);
  assert.equal(F.erythemaGrade(9.9).grado, 3);
  assert.equal(F.erythemaGrade(10).grado, 4);
  assert.equal(F.erythemaGrade(0).grado, 0);
});

test('evaluateUV: protección ocular, MED conocido, 1 MED al inicio, 30 min y 20 sesiones', () => {
  const ok = { med: 1, sessions: 1, minutes: 20, eyesProtected: true, medKnown: true };
  assert.equal(F.evaluateUV(ok).veredicto, 'ok');
  assert.equal(F.evaluateUV({ ...ok, eyesProtected: false }).veredicto, 'riesgo');
  assert.equal(F.evaluateUV({ ...ok, medKnown: false }).veredicto, 'riesgo');
  assert.equal(F.evaluateUV({ ...ok, med: 2 }).veredicto, 'ajustar');
  assert.equal(F.evaluateUV({ ...ok, sessions: 5, med: 2 }).veredicto, 'ok');
  assert.equal(F.evaluateUV({ ...ok, minutes: 31 }).veredicto, 'ajustar');
  assert.equal(F.evaluateUV({ ...ok, minutes: 30 }).veredicto, 'ok');
  assert.equal(F.evaluateUV({ ...ok, sessions: 21 }).veredicto, 'ajustar');
  assert.equal(F.evaluateUV({ ...ok, sessions: 20 }).veredicto, 'ok');
});

test('ROLLIER: 30 s, 1, 2 y 4 minutos', () => {
  assert.deepEqual(F.ROLLIER, [30, 60, 120, 240]);
});

test('CONDITIONS_IR y CONDITIONS_UV: ids únicos y contraindicaciones de la clase', () => {
  for (const t of [F.CONDITIONS_IR, F.CONDITIONS_UV]) {
    const ids = t.map(c => c.id);
    assert.equal(new Set(ids).size, ids.length);
  }
  assert.equal(F.CONDITIONS_IR.filter(c => c.nivel === 'contra').length, 8);
  assert.ok(F.CONDITIONS_IR.some(c => c.nivel === 'precaucion'));
  assert.equal(F.CONDITIONS_UV.filter(c => c.nivel === 'contra').length, 12);
  assert.equal(K.checkConditions(F.CONDITIONS_UV, ['lupus']).bloqueado, true);
  assert.equal(K.checkConditions(F.CONDITIONS_IR, ['fiebre']).bloqueado, true);
});

test('CASES: 4 casos, cada uno acepta su propia respuesta correcta', () => {
  assert.equal(F.CASES.length, 4);
  assert.equal(F.CASES.filter(c => c.tipo === 'ir').length, 2);
  assert.equal(F.CASES.filter(c => c.tipo === 'uv').length, 2);
  for (const c of F.CASES) {
    assert.ok(c.titulo && c.texto && c.respuesta && c.spec.apto, c.id);
    const a = {};
    for (const f of Object.keys(c.spec)) a[f] = c.spec[f].any ? c.spec[f].any[0] : c.spec[f].min;
    const g = K.gradeCase(c.spec, a);
    assert.equal(g.puntos, g.total, c.id);
  }
});

test('ningún texto repite los errores del PDF (UV de 400 a 1000 nm; IR-A con menor penetración)', () => {
  const all = JSON.stringify([F.CASES, F.CONDITIONS_IR, F.CONDITIONS_UV, F.TEXTS || {}]);
  assert.ok(!/400\s*(a|–|-)\s*1000/.test(all));
  assert.ok(!/equipo|marca/i.test(all));
});
