const test = require('node:test');
const assert = require('node:assert/strict');
const I = require('../js/interferencial-core.js');
const H = require('./helpers.js');
const has = (arr, re) => arr.some(x => re.test(x));

test('secondFreq y amfFromFreqs', () => {
  assert.equal(I.CARRIER_HZ, 4000);
  assert.equal(I.secondFreq(100), 4100);
  assert.equal(I.secondFreq(0), 4000);
  assert.equal(I.secondFreq(250), 4250);
  assert.throws(() => I.secondFreq(251));
  assert.throws(() => I.secondFreq(-1));
  assert.equal(I.amfFromFreqs(4000, 4100), 100);
  assert.equal(I.amfFromFreqs(4100, 4000), 100);
});

test('objectivesForAmf devuelve todas las coincidencias de la tabla', () => {
  const a5 = I.objectivesForAmf(5);
  assert.ok(has(a5, /fortalecimiento/i) && has(a5, /contraste/i));
  const a10 = I.objectivesForAmf(10);
  assert.ok(has(a10, /fortalecimiento/i) && has(a10, /circulaci/i));
  const a90 = I.objectivesForAmf(90);
  assert.equal(a90.length, 3);
  assert.ok(has(a90, /cr.nico y subagudo/i) && has(a90, /^dolor subagudo/i) && has(a90, /contraste/i));
  const a100 = I.objectivesForAmf(100);
  assert.equal(a100.length, 4);
  assert.ok(has(a100, /dolor agudo/i));
  assert.deepEqual(I.objectivesForAmf(200), []);
});

const OK = { amfHz: 100, phase: 'aguda', dose: 'mitis', minutes: 10, depthPct: 100 };

test('evaluateIF: tiempo 10–15 min y dosis según la fase', () => {
  assert.equal(I.evaluateIF(OK).veredicto, 'ok');
  assert.equal(I.evaluateIF({ ...OK, dose: 'fortis' }).veredicto, 'ajustar');
  assert.equal(I.evaluateIF({ ...OK, minutes: 9 }).veredicto, 'ajustar');
  assert.equal(I.evaluateIF({ ...OK, minutes: 15 }).veredicto, 'ok');
  assert.equal(I.evaluateIF({ ...OK, minutes: 16 }).veredicto, 'ajustar');
  const cr = { ...OK, phase: 'cronica', dose: 'obvia', minutes: 15, amfHz: 70 };
  assert.equal(I.evaluateIF(cr).veredicto, 'ok');
  assert.equal(I.evaluateIF({ ...cr, dose: 'fortis' }).veredicto, 'ok');
  assert.equal(I.evaluateIF({ ...cr, dose: 'mitis' }).veredicto, 'ajustar');
});

test('evaluateIF: sin batido (AMF 0) y profundidad de modulación fuera de 0–100', () => {
  const r = I.evaluateIF({ ...OK, amfHz: 0 });
  assert.equal(r.veredicto, 'ajustar');
  assert.ok(r.mensajes.some(m => /sin batido/i.test(m)));
  assert.ok(r.mensajes.every(m => !/NaN/.test(m)));
  assert.equal(I.evaluateIF({ ...OK, depthPct: 101 }).veredicto, 'ajustar');
  assert.equal(I.evaluateIF({ ...OK, depthPct: 0 }).veredicto, 'ok');
});

test('datos de la clase, condiciones y casos', () => {
  assert.ok(I.PHYSICS.length >= 2);
  assert.ok(I.EFFECTS.length >= 4);
  assert.equal(I.TYPES.length, 2);
  assert.ok(I.INDICATIONS.length >= 7);
  H.assertConditions(I.CONDITIONS, { contra: 12 });
  H.assertCases(I.CASES, 3);
});
