const test = require('node:test');
const assert = require('node:assert/strict');
const V = require('../js/vms-core.js');
const H = require('./helpers.js');

test('fiberTarget: tónico 1–200 Hz, fásico 40–80 Hz y su solape', () => {
  assert.equal(V.fiberTarget(1), 'tonica');
  assert.equal(V.fiberTarget(39), 'tonica');
  assert.equal(V.fiberTarget(40), 'ambas');
  assert.equal(V.fiberTarget(80), 'ambas');
  assert.equal(V.fiberTarget(81), 'tonica');
  assert.equal(V.fiberTarget(200), 'tonica');
  assert.equal(V.fiberTarget(0), null);
  assert.equal(V.fiberTarget(201), null);
});

test('evaluateVms: la frecuencia debe servir a la fibra elegida', () => {
  assert.equal(V.evaluateVms({ hz: 60, mode: 'burst', fiber: 'fasica' }).veredicto, 'ok');
  assert.equal(V.evaluateVms({ hz: 20, mode: 'burst', fiber: 'fasica' }).veredicto, 'ajustar');
  assert.equal(V.evaluateVms({ hz: 20, mode: 'continuo', fiber: 'tonica' }).veredicto, 'ok');
  assert.equal(V.evaluateVms({ hz: 250, mode: 'continuo', fiber: 'tonica' }).veredicto, 'ajustar');
  assert.equal(V.evaluateVms({ hz: 0, mode: 'continuo', fiber: 'tonica' }).veredicto, 'ajustar');
});

test('datos de la clase y casos', () => {
  assert.ok(V.NOTES.length >= 4);
  H.assertConditions(V.CONDITIONS, { contra: 12 });
  H.assertCases(V.CASES, 2);
});
