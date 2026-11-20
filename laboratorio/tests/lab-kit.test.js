const test = require('node:test');
const assert = require('node:assert/strict');
const K = require('../js/lab-kit.js');

test('fx: coma decimal y valores no numéricos', () => {
  assert.equal(K.fx(1.5, 1), '1,5');
  assert.equal(K.fx(0, 0), '0');
  assert.equal(K.fx(NaN, 1), '–');
  assert.equal(K.fx(null, 1), '–');
});

test('band: bordes inclusivos de la ventana', () => {
  assert.equal(K.band(1.9, 2, 4), 'bajo');
  assert.equal(K.band(2, 2, 4), 'ventana');
  assert.equal(K.band(4, 2, 4), 'ventana');
  assert.equal(K.band(4.1, 2, 4), 'alto');
});

const TABLE = [
  { id: 'a', label: 'A', nivel: 'contra', por: 'pa' },
  { id: 'b', label: 'B', nivel: 'precaucion', por: 'pb' },
  { id: 'c', label: 'C', nivel: 'contra', por: 'pc' }
];

test('checkConditions: lista vacía no bloquea', () => {
  const r = K.checkConditions(TABLE, []);
  assert.equal(r.bloqueado, false);
  assert.deepEqual(r.contra, []);
  assert.deepEqual(r.precaucion, []);
});

test('checkConditions: solo precaución no bloquea', () => {
  const r = K.checkConditions(TABLE, ['b']);
  assert.equal(r.bloqueado, false);
  assert.equal(r.precaucion.length, 1);
});

test('checkConditions: una contraindicación junto a una precaución bloquea', () => {
  const r = K.checkConditions(TABLE, ['b', 'a']);
  assert.equal(r.bloqueado, true);
  assert.equal(r.contra.length, 1);
  assert.equal(r.precaucion.length, 1);
});

test('checkConditions: ids desconocidos se ignoran', () => {
  const r = K.checkConditions(TABLE, ['zzz']);
  assert.equal(r.bloqueado, false);
});

test('gradeCase: todo correcto, todo incorrecto y límites', () => {
  const spec = { t: { min: 8, max: 15 }, m: { any: ['a', 'b'] } };
  assert.equal(K.gradeCase(spec, { t: 8, m: 'b' }).puntos, 2);
  assert.equal(K.gradeCase(spec, { t: 15, m: 'a' }).puntos, 2);
  const bad = K.gradeCase(spec, { t: 7.9, m: 'c' });
  assert.equal(bad.puntos, 0);
  assert.equal(bad.total, 2);
});

test('gradeCase: campo ausente, vacío o NaN cuenta como incorrecto sin lanzar', () => {
  const spec = { t: { min: 8, max: 15 }, m: { any: ['a'] } };
  assert.equal(K.gradeCase(spec, { t: 10 }).campos.m, false);
  assert.equal(K.gradeCase(spec, { t: NaN, m: '' }).campos.t, false);
  assert.equal(K.gradeCase(spec, {}).puntos, 0);
});
