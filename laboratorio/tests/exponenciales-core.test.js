const test = require('node:test');
const assert = require('node:assert/strict');
const X = require('../js/exponenciales-core.js');
const H = require('./helpers.js');

test('selectiveStim: acomodación del nervio y respuesta del denervado', () => {
  assert.equal(X.selectiveStim('nervio-normal').acomoda, true);
  assert.equal(X.selectiveStim('denervado').acomoda, false);
  assert.equal(X.selectiveStim('fibra-lisa').acomoda, false);
  assert.ok(X.selectiveStim('denervado').respuesta.length > 10);
  assert.throws(() => X.selectiveStim('zzz'));
});

test('evaluateExp: pulso en ms y pausa mayor que el pulso', () => {
  assert.equal(X.evaluateExp({ pulseMs: 10, pauseMs: 50 }).veredicto, 'ok');
  assert.equal(X.evaluateExp({ pulseMs: 10, pauseMs: 10 }).veredicto, 'ajustar');
  assert.equal(X.evaluateExp({ pulseMs: 10, pauseMs: 5 }).veredicto, 'ajustar');
  const z = X.evaluateExp({ pulseMs: 0, pauseMs: 0 });
  assert.equal(z.veredicto, 'ajustar');
  assert.ok(z.mensajes.every(m => !/NaN/.test(m)));
});

test('datos de la clase: conceptos, efectos y casos', () => {
  assert.ok(X.CONCEPTS.length >= 5);
  assert.ok(X.EFFECTS.length >= 3);
  H.assertConditions(X.CONDITIONS, { contra: 12 });
  H.assertCases(X.CASES, 2);
});
