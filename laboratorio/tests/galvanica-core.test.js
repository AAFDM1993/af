const test = require('node:test');
const assert = require('node:assert/strict');
const G = require('../js/galvanica-core.js');
const H = require('./helpers.js');
const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e;

test('galvanicRange: 0,1 a 0,2 mA/cm² (electrodo de 6×8 cm)', () => {
  const r = G.galvanicRange(48);
  assert.ok(near(r.minMA, 4.8) && near(r.maxMA, 9.6));
  const z = G.galvanicRange(0);
  assert.equal(z.minMA, 0); assert.equal(z.maxMA, 0);
});

test('evaluateGalvanic: dosis, quemadura y minutos', () => {
  const o = { areaCm2: 48, mA: 4.8, minutes: 15 };
  assert.equal(G.evaluateGalvanic(o).veredicto, 'ok');
  assert.equal(G.evaluateGalvanic({ ...o, mA: 9.6 }).veredicto, 'ok');
  assert.equal(G.evaluateGalvanic({ ...o, mA: 9.7 }).veredicto, 'riesgo');
  assert.equal(G.evaluateGalvanic({ ...o, mA: 4.7 }).veredicto, 'ajustar');
  assert.equal(G.evaluateGalvanic({ ...o, minutes: 20 }).veredicto, 'ok');
  assert.equal(G.evaluateGalvanic({ ...o, minutes: 14 }).veredicto, 'ajustar');
  assert.equal(G.evaluateGalvanic({ ...o, minutes: 21 }).veredicto, 'ajustar');
});

test('trabertFreq: 1000/(pulso+pausa)', () => {
  assert.ok(near(G.trabertFreq(2, 5), 142.857, 0.01));
  assert.equal(G.trabertFreq(2, 0), 500);
  assert.equal(G.trabertFreq(0, 0), 0);
});

test('evaluateTrabert: pulso farádico, intensidad y tiempo', () => {
  const o = { pulseMs: 2, pauseMs: 5, mA: 10, minutes: 10, inverted: true };
  assert.equal(G.evaluateTrabert(o).veredicto, 'ok');
  assert.equal(G.evaluateTrabert({ ...o, pulseMs: 10 }).veredicto, 'ok');
  assert.equal(G.evaluateTrabert({ ...o, pulseMs: 11 }).veredicto, 'ajustar');
  assert.equal(G.evaluateTrabert({ ...o, mA: 11 }).veredicto, 'riesgo');
  assert.equal(G.evaluateTrabert({ ...o, minutes: 12 }).veredicto, 'ajustar');
  const r = G.evaluateTrabert({ ...o, inverted: false });
  assert.ok(r.mensajes.some(m => /invert/i.test(m)));
});

test('drugPole y polarEffect', () => {
  assert.equal(G.drugPole('lidocaína'), 'catodo');
  assert.equal(G.drugPole('Xilocaina'), 'catodo');
  assert.equal(G.drugPole('ibuprofeno'), 'anodo');
  assert.equal(G.drugPole('diclofenaco'), 'anodo');
  assert.equal(G.drugPole('agua'), null);
  assert.ok(/alcalina/.test(G.polarEffect('catodo').reaccion));
  assert.ok(/ácida/.test(G.polarEffect('anodo').reaccion));
  assert.throws(() => G.polarEffect('zzz'));
});

test('CONDITIONS, INDICATIONS y CASES', () => {
  H.assertConditions(G.CONDITIONS, { contra: 13 });
  assert.equal(G.INDICATIONS.length, 6);
  H.assertCases(G.CASES, 3);
});
