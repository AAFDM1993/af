const assert = require('node:assert/strict');
const K = require('../js/lab-kit.js');
const BAD = new RegExp(['equi' + 'po', '(?<![a-záéíóú])mar' + 'cas?(?![a-záéíóú])', 'B' + 'TL'].join('|'), 'i');

/* Tabla de condiciones: ids únicos, campos completos y n contraindicaciones. */
function assertConditions(table, o) {
  const ids = table.map(c => c.id);
  assert.equal(new Set(ids).size, ids.length, 'ids repetidos');
  for (const c of table) assert.ok(c.label && c.nivel && c.por, c.id);
  assert.equal(table.filter(c => c.nivel === 'contra').length, o.contra);
  assert.equal(K.checkConditions(table, []).bloqueado, false);
  const first = table.find(c => c.nivel === 'contra');
  assert.equal(K.checkConditions(table, [first.id]).bloqueado, true);
}

/* Casos: n casos y cada uno acepta su propia respuesta correcta. */
function assertCases(cases, n) {
  assert.equal(cases.length, n);
  for (const c of cases) {
    assert.ok(c.titulo && c.texto && c.respuesta && c.spec && c.spec.apto, c.id);
    const a = {};
    for (const f of Object.keys(c.spec)) a[f] = c.spec[f].any ? c.spec[f].any[0] : (c.spec[f].min !== undefined ? c.spec[f].min : c.spec[f].max);
    const g = K.gradeCase(c.spec, a);
    assert.equal(g.puntos, g.total, c.id);
    assert.ok(!BAD.test(c.texto + c.respuesta), c.id);
  }
}

module.exports = { assertConditions, assertCases };
