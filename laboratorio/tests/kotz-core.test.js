const test = require('node:test');
const assert = require('node:assert/strict');
const Z = require('../js/kotz-core.js');
const H = require('./helpers.js');

test('burstHzFor: 20 Hz tónicas y 100 Hz fásicas', () => {
  assert.equal(Z.CARRIER_HZ, 2500);
  assert.equal(Z.burstHzFor('tonica'), 20);
  assert.equal(Z.burstHzFor('fasica'), 100);
  assert.throws(() => Z.burstHzFor('zzz'));
});

test('carrierCyclesPerBurst', () => {
  assert.equal(Z.carrierCyclesPerBurst(20, 50), 62.5);
  assert.equal(Z.carrierCyclesPerBurst(100, 50), 12.5);
  assert.equal(Z.carrierCyclesPerBurst(0, 50), 0);
});

test('evaluateKotz: la ráfaga debe ser la de la fibra y el ciclo entre 1 y 99 %', () => {
  assert.equal(Z.evaluateKotz({ fiber: 'tonica', burstHz: 20, dutyPct: 50 }).veredicto, 'ok');
  assert.equal(Z.evaluateKotz({ fiber: 'fasica', burstHz: 100, dutyPct: 50 }).veredicto, 'ok');
  assert.equal(Z.evaluateKotz({ fiber: 'tonica', burstHz: 100, dutyPct: 50 }).veredicto, 'ajustar');
  assert.equal(Z.evaluateKotz({ fiber: 'tonica', burstHz: 20, dutyPct: 0 }).veredicto, 'ajustar');
  assert.equal(Z.evaluateKotz({ fiber: 'tonica', burstHz: 20, dutyPct: 100 }).veredicto, 'ajustar');
  assert.equal(Z.evaluateKotz({ fiber: 'tonica', burstHz: 20, dutyPct: 1 }).veredicto, 'ok');
  assert.equal(Z.evaluateKotz({ fiber: 'tonica', burstHz: 20, dutyPct: 99 }).veredicto, 'ok');
});

test('datos de la clase, condiciones y casos', () => {
  assert.ok(Z.NOTES.length >= 4);
  H.assertConditions(Z.CONDITIONS, { contra: 12 });
  H.assertCases(Z.CASES, 2);
});
