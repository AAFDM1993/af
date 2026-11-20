const test = require('node:test');
const assert = require('node:assert/strict');
const U = require('../js/us-core.js');
const near = (a, b, e = 0.01) => Math.abs(a - b) < e;

test('remaining: 100 % en superficie y 10 dB dejan 10 %', () => {
  assert.equal(U.remaining(0, 1, 0.5), 100);
  assert.ok(near(U.remaining(10, 1, 1), 10));
});

test('remaining: a mayor frecuencia o profundidad, menos energía', () => {
  assert.ok(U.remaining(3, 3, 1) < U.remaining(3, 1, 1));
  assert.ok(U.remaining(6, 1, 1) < U.remaining(3, 1, 1));
});

test('halfValueLayerCm: 3,01 cm a 1 MHz y 1,0033 cm a 3 MHz con α = 1', () => {
  assert.ok(near(U.halfValueLayerCm(1, 1), 3.01));
  assert.ok(near(U.halfValueLayerCm(3, 1), 1.0033));
});

test('halfValueLayerCm: a esa profundidad queda ~50 %', () => {
  assert.ok(near(U.remaining(U.halfValueLayerCm(1, 1.0), 1, 1.0), 50, 0.1));
});

test('phaseLabel: fases y bordes', () => {
  assert.equal(U.phaseLabel(0.5), 'Aguda (0,3–0,8)');
  assert.equal(U.phaseLabel(0.8), 'Subaguda (0,8–1,2)');
  assert.equal(U.phaseLabel(1.0), 'Subaguda (0,8–1,2)');
  assert.equal(U.phaseLabel(1.2), 'Crónica (1,2–3)');
  assert.equal(U.phaseLabel(2), 'Crónica (1,2–3)');
});

test('cavitationIndex: referencia, 3 MHz pulsado y sin intensidad', () => {
  assert.equal(U.cavitationIndex(1, 1, 1), 1);
  assert.ok(near(U.cavitationIndex(1, 0.2, 3), 0.07, 1e-9));
  assert.equal(U.cavitationIndex(0, 1, 1), 0);
});
