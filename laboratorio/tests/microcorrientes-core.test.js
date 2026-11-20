const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../js/microcorrientes-core.js');
const H = require('./helpers.js');

test('evaluateMicro: ancho 1–500 µs, frecuencia 0–1000 Hz, 10–20 min', () => {
  const o = { pulseUs: 1, hz: 0, minutes: 10, objective: 'general' };
  assert.equal(M.evaluateMicro(o).veredicto, 'ok');
  assert.equal(M.evaluateMicro({ ...o, pulseUs: 500, hz: 1000, minutes: 20 }).veredicto, 'ok');
  assert.equal(M.evaluateMicro({ ...o, pulseUs: 501 }).veredicto, 'ajustar');
  assert.equal(M.evaluateMicro({ ...o, pulseUs: 0 }).veredicto, 'ajustar');
  assert.equal(M.evaluateMicro({ ...o, hz: 1001 }).veredicto, 'ajustar');
  assert.equal(M.evaluateMicro({ ...o, minutes: 21 }).veredicto, 'ajustar');
  assert.equal(M.evaluateMicro({ ...o, minutes: 9 }).veredicto, 'ajustar');
});

test('evaluateMicro: úlcera 120 min', () => {
  const o = { pulseUs: 100, hz: 100, minutes: 120, objective: 'ulcera' };
  assert.equal(M.evaluateMicro(o).veredicto, 'ok');
  assert.equal(M.evaluateMicro({ ...o, minutes: 20 }).veredicto, 'ajustar');
});

test('datos de la clase: efectos, indicaciones y casos', () => {
  assert.ok(M.EFFECTS.length >= 5);
  assert.ok(M.INDICATIONS.length >= 10);
  H.assertConditions(M.CONDITIONS, { contra: 12 });
  H.assertCases(M.CASES, 2);
  assert.ok(!/41 ?mA|1.100 ?mA/.test(JSON.stringify([M.EFFECTS, M.NOTES, M.CASES])));
});
