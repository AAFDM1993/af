const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../js/ems-core.js');
const H = require('./helpers.js');

test('evaluateEms: 150–300 µs, 15–20 min y frecuencia según la fibra', () => {
  const o = { fiber: 'fasica', hz: 60, pulseUs: 200, minutes: 15 };
  assert.equal(M.evaluateEms(o).veredicto, 'ok');
  assert.equal(M.evaluateEms({ ...o, hz: 40 }).veredicto, 'ok');
  assert.equal(M.evaluateEms({ ...o, hz: 80 }).veredicto, 'ok');
  assert.equal(M.evaluateEms({ ...o, hz: 39 }).veredicto, 'ajustar');
  assert.equal(M.evaluateEms({ fiber: 'tonica', hz: 10, pulseUs: 200, minutes: 15 }).veredicto, 'ok');
  assert.equal(M.evaluateEms({ fiber: 'tonica', hz: 30, pulseUs: 200, minutes: 15 }).veredicto, 'ajustar');
  assert.equal(M.evaluateEms({ ...o, pulseUs: 149 }).veredicto, 'ajustar');
  assert.equal(M.evaluateEms({ ...o, pulseUs: 150 }).veredicto, 'ok');
  assert.equal(M.evaluateEms({ ...o, pulseUs: 300 }).veredicto, 'ok');
  assert.equal(M.evaluateEms({ ...o, pulseUs: 301 }).veredicto, 'ajustar');
  assert.equal(M.evaluateEms({ ...o, minutes: 14 }).veredicto, 'ajustar');
  assert.equal(M.evaluateEms({ ...o, minutes: 20 }).veredicto, 'ok');
  assert.equal(M.evaluateEms({ ...o, minutes: 21 }).veredicto, 'ajustar');
});

test('fiberFromHz devuelve todas las coincidencias', () => {
  assert.deepEqual(M.fiberFromHz(10), ['tonica']);
  assert.deepEqual(M.fiberFromHz(60), ['fasica']);
  assert.deepEqual(M.fiberFromHz(30), []);
  assert.deepEqual(M.fiberFromHz(5), ['tonica']);
  assert.deepEqual(M.fiberFromHz(20), ['tonica']);
});

test('PROTOCOLS, FORMS, EFFECTS, CONDITIONS y CASES', () => {
  assert.ok(M.PROTOCOLS.length >= 3);
  assert.ok(M.PROTOCOLS.every(p => p.nombre && p.parametros));
  assert.equal(M.FORMS.length, 4);
  assert.ok(M.EFFECTS.length >= 3);
  H.assertConditions(M.CONDITIONS, { contra: 12 });
  H.assertCases(M.CASES, 3);
});
