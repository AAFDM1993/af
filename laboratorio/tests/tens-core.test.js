const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../js/tens-core.js');
const H = require('./helpers.js');

test('MODES: los cuatro modos de la clase', () => {
  assert.deepEqual(T.MODES.map(m => m.id), ['convencional', 'acupuntura', 'breve', 'burst']);
  assert.ok(T.MODES.every(m => m.nombre && m.intensidad && m.usos));
});

test('modeForObjective', () => {
  assert.equal(T.modeForObjective('agudo'), 'convencional');
  assert.equal(T.modeForObjective('cronico'), 'acupuntura');
  assert.equal(T.modeForObjective('doloroso'), 'breve');
  assert.equal(T.modeForObjective('neuromuscular'), 'burst');
  assert.throws(() => T.modeForObjective('zzz'));
});

test('evaluateTens convencional: 80–120 Hz, ancho menor de 150 µs, 15–30 min', () => {
  const o = { mode: 'convencional', hz: 100, pulseUs: 100, minutes: 20 };
  assert.equal(T.evaluateTens(o).veredicto, 'ok');
  assert.equal(T.evaluateTens({ ...o, hz: 80 }).veredicto, 'ok');
  assert.equal(T.evaluateTens({ ...o, hz: 120 }).veredicto, 'ok');
  assert.equal(T.evaluateTens({ ...o, hz: 121 }).veredicto, 'ajustar');
  assert.equal(T.evaluateTens({ ...o, hz: 79 }).veredicto, 'ajustar');
  assert.equal(T.evaluateTens({ ...o, pulseUs: 149 }).veredicto, 'ok');
  assert.equal(T.evaluateTens({ ...o, pulseUs: 150 }).veredicto, 'ajustar');
  assert.equal(T.evaluateTens({ ...o, minutes: 14 }).veredicto, 'ajustar');
  assert.equal(T.evaluateTens({ ...o, minutes: 31 }).veredicto, 'ajustar');
});

test('evaluateTens acupuntura: 1–20 Hz y ancho mayor de 200 µs', () => {
  const o = { mode: 'acupuntura', hz: 2, pulseUs: 250, minutes: 30 };
  assert.equal(T.evaluateTens(o).veredicto, 'ok');
  assert.equal(T.evaluateTens({ ...o, pulseUs: 200 }).veredicto, 'ajustar');
  assert.equal(T.evaluateTens({ ...o, pulseUs: 201 }).veredicto, 'ok');
  assert.equal(T.evaluateTens({ ...o, hz: 21 }).veredicto, 'ajustar');
  assert.equal(T.evaluateTens({ ...o, hz: 0 }).veredicto, 'ajustar');
});

test('evaluateTens: modo desconocido lanza', () => {
  assert.throws(() => T.evaluateTens({ mode: 'zzz', hz: 1, pulseUs: 1, minutes: 1 }));
});

test('conductionTimeMs y FIBERS', () => {
  assert.equal(T.conductionTimeMs(1, 50), 20);
  assert.equal(T.conductionTimeMs(1, 1), 1000);
  assert.equal(T.conductionTimeMs(1, 0), null);
  assert.ok(T.FIBERS.Abeta[0] > T.FIBERS.Adelta[1] && T.FIBERS.Adelta[0] > T.FIBERS.C[1]);
});

test('TYPES, PLACEMENTS, CONDITIONS y CASES', () => {
  assert.equal(T.TYPES.length, 3);
  assert.equal(T.PLACEMENTS.length, 4);
  assert.ok(T.OTHER_REFS.length >= 3);
  H.assertConditions(T.CONDITIONS, { contra: 12 });
  H.assertCases(T.CASES, 3);
});
