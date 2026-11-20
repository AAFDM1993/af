const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('../js/alto-voltaje-core.js');
const H = require('./helpers.js');

test('peaksPerSecond: 2 PPS son 4 picos', () => {
  assert.equal(A.peaksPerSecond(2), 4);
  assert.equal(A.peaksPerSecond(0), 0);
});

test('classifyHz: 1–80 estimulante, 81–150 analgésica', () => {
  assert.equal(A.classifyHz(1), 'estimulante');
  assert.equal(A.classifyHz(80), 'estimulante');
  assert.equal(A.classifyHz(81), 'analgesica');
  assert.equal(A.classifyHz(150), 'analgesica');
  assert.equal(A.classifyHz(151), null);
  assert.equal(A.classifyHz(0), null);
});

test('evaluateHV: dolor agudo (50–120 Hz, 20 min) y crónico (2–15 Hz, 10 min)', () => {
  const ag = { objective: 'agudo', hz: 100, minutes: 20, volts: 150 };
  assert.equal(A.evaluateHV(ag).veredicto, 'ok');
  assert.equal(A.evaluateHV({ ...ag, hz: 120 }).veredicto, 'ok');
  assert.equal(A.evaluateHV({ ...ag, hz: 121 }).veredicto, 'ajustar');
  assert.equal(A.evaluateHV({ ...ag, hz: 49 }).veredicto, 'ajustar');
  assert.equal(A.evaluateHV({ ...ag, minutes: 15 }).veredicto, 'ajustar');
  const cr = { objective: 'cronico', hz: 2, minutes: 10, volts: 150 };
  assert.equal(A.evaluateHV(cr).veredicto, 'ok');
  assert.equal(A.evaluateHV({ ...cr, hz: 15 }).veredicto, 'ok');
  assert.equal(A.evaluateHV({ ...cr, hz: 16 }).veredicto, 'ajustar');
  assert.equal(A.evaluateHV({ ...ag, volts: 101 }).veredicto, 'ok');
  assert.equal(A.evaluateHV({ ...ag, volts: 100 }).veredicto, 'ajustar');
});

test('CONDITIONS, INDICATIONS y CASES', () => {
  H.assertConditions(A.CONDITIONS, { contra: 12 });
  assert.ok(A.EFFECTS.length >= 5);
  H.assertCases(A.CASES, 3);
  assert.ok(!/8 ?ms|300 ?ms|2 ?A\b/.test(JSON.stringify([A.CASES, A.EFFECTS, A.NOTES])));
});
