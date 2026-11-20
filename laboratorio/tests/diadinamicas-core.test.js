const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('../js/diadinamicas-core.js');
const E = require('../js/electro-core.js');
const H = require('./helpers.js');

test('CURRENTS: las cinco corrientes y su frecuencia', () => {
  assert.deepEqual(D.CURRENTS.map(c => c.id), ['MF', 'DF', 'CP', 'LP', 'RS']);
  const mf = D.CURRENTS.find(c => c.id === 'MF'), df = D.CURRENTS.find(c => c.id === 'DF');
  assert.equal(E.freqFromPulsePause(mf.pulseMs, mf.pauseMs), 50);
  assert.equal(E.freqFromPulsePause(df.pulseMs, df.pauseMs), 100);
  assert.ok(D.CURRENTS.every(c => c.efecto && c.sensacion && c.indicacion));
});

test('suggestCurrent: objetivo → corriente de la clase', () => {
  assert.equal(D.suggestCurrent('miogelosis'), 'MF');
  assert.equal(D.suggestCurrent('cadena-simpatica'), 'DF');
  assert.equal(D.suggestCurrent('mialgia'), 'LP');
  assert.equal(D.suggestCurrent('edema'), 'CP');
  assert.equal(D.suggestCurrent('hipotrofia'), 'RS');
  assert.throws(() => D.suggestCurrent('zzz'));
});

test('evaluateDiad: base DF de 3 a 5 min y hasta 20 sesiones', () => {
  const o = { current: 'MF', baseMin: 3, sessions: 12, phase: 'subaguda' };
  assert.equal(D.evaluateDiad(o).veredicto, 'ok');
  assert.equal(D.evaluateDiad({ ...o, baseMin: 5 }).veredicto, 'ok');
  assert.equal(D.evaluateDiad({ ...o, baseMin: 2 }).veredicto, 'ajustar');
  assert.equal(D.evaluateDiad({ ...o, baseMin: 6 }).veredicto, 'ajustar');
  assert.equal(D.evaluateDiad({ ...o, sessions: 20 }).veredicto, 'ok');
  assert.equal(D.evaluateDiad({ ...o, sessions: 21 }).veredicto, 'ajustar');
  assert.ok(D.evaluateDiad({ ...o, phase: 'aguda' }).mensajes.some(m => /diari/i.test(m)));
});

test('TECHNIQUES, COMBINED, CONDITIONS y CASES', () => {
  assert.equal(D.TECHNIQUES.length, 5);
  assert.ok(D.TECHNIQUES.every(t => t.nombre && t.como && typeof t.invierte === 'boolean'));
  assert.equal(D.COMBINED.length, 2);
  H.assertConditions(D.CONDITIONS, { contra: 12 });
  H.assertCases(D.CASES, 3);
});
