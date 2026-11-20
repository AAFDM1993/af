const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../js/electro-core.js');
const H = require('./helpers.js');
const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e;
const at = (w, t) => w.v[w.t.findIndex(x => near(x, t, 1e-9))];

test('periodMs, freqFromPulsePause y dutyPct, incluso con ceros', () => {
  assert.equal(E.periodMs(100), 10);
  assert.equal(E.periodMs(0), null);
  assert.ok(near(E.freqFromPulsePause(2, 5), 142.857, 0.01));
  assert.equal(E.freqFromPulsePause(10, 0), 100);
  assert.equal(E.freqFromPulsePause(0, 0), 0);
  assert.equal(E.dutyPct(10, 10), 50);
  assert.equal(E.dutyPct(10, 0), 100);
  assert.equal(E.dutyPct(0, 0), 0);
});

test('rectWave mono: pulso de 2 ms y pausa de 5 ms', () => {
  const w = E.rectWave({ phase: 'mono', pulseMs: 2, pauseMs: 5 }, 14, 0.5);
  assert.equal(at(w, 0), 1); assert.equal(at(w, 1.5), 1);
  assert.equal(at(w, 2), 0); assert.equal(at(w, 6.5), 0);
  assert.equal(at(w, 7), 1);
});

test('rectWave bi-sym: +1, luego −1 y luego pausa', () => {
  const s = E.rectWave({ phase: 'bi-sym', pulseMs: 2, pauseMs: 5 }, 14, 0.5);
  assert.equal(at(s, 0), 1); assert.equal(at(s, 2), -1); assert.equal(at(s, 4), 0);
});

test('rectWave bi-asym: carga positiva y negativa equilibradas en un ciclo', () => {
  const w = E.rectWave({ phase: 'bi-asym', pulseMs: 2, pauseMs: 0 }, 7, 0.01);
  let pos = 0, neg = 0;
  w.v.forEach(v => { if (v > 0) pos += v * 0.01; else neg += v * 0.01; });
  assert.ok(near(pos + neg, 0, 0.02));
});

test('rectWave y halfSineWave con pausa 0 no producen NaN', () => {
  const w = E.rectWave({ phase: 'mono', pulseMs: 2, pauseMs: 0 }, 10, 0.5);
  assert.ok(w.v.every(v => !isNaN(v)));
  const h = E.halfSineWave({ pulseMs: 10, pauseMs: 0 }, 30, 0.5);
  assert.ok(h.v.every(v => !isNaN(v)));
  const z = E.rectWave({ phase: 'mono', pulseMs: 0, pauseMs: 0 }, 10, 0.5);
  assert.ok(z.v.every(v => !isNaN(v)));
});

test('halfSineWave: MF (10/10) y DF (10/0)', () => {
  const mf = E.halfSineWave({ pulseMs: 10, pauseMs: 10 }, 40, 0.5);
  assert.ok(near(at(mf, 5), 1)); assert.equal(at(mf, 15), 0);
  const df = E.halfSineWave({ pulseMs: 10, pauseMs: 0 }, 40, 0.5);
  assert.ok(near(at(df, 15), 1));
});

test('expWave: sube de forma monótona y cae a 0 en la pausa', () => {
  const w = E.expWave({ pulseMs: 5, pauseMs: 5, tauMs: 2 }, 10, 0.1);
  assert.equal(at(w, 0), 0);
  for (let i = 1; i < 50; i++) assert.ok(w.v[i] > w.v[i - 1], 'i=' + i);
  assert.ok(at(w, 4.9) > 0.98);
  assert.equal(at(w, 7), 0);
});

test('diadSequence: MF, DF, CP, LP y RS', () => {
  const cp = E.diadSequence('CP', 4000);
  assert.deepEqual(cp.map(s => s.type), ['MF', 'DF', 'MF', 'DF']);
  assert.ok(cp.every(s => s.endMs - s.startMs === 1000));
  const lp = E.diadSequence('LP', 20000, 8000);
  assert.deepEqual(lp.map(s => [s.type, s.startMs, s.endMs]), [['MF', 0, 8000], ['MF+DF', 8000, 16000], ['MF', 16000, 20000]]);
  assert.deepEqual(E.diadSequence('RS', 3000).map(s => s.type), ['MF', 'pausa', 'MF']);
  assert.deepEqual(E.diadSequence('MF', 500), [{ type: 'MF', startMs: 0, endMs: 500 }]);
});

test('gatedTrain y pulsesPerBurst', () => {
  const on = E.gatedTrain({ burstHz: 20, dutyPct: 50, windowMs: 100 }).filter(s => s.on);
  assert.deepEqual(on.map(s => [s.startMs, s.endMs]), [[0, 25], [50, 75]]);
  assert.equal(E.pulsesPerBurst(2500, 20, 50), 62.5);
  assert.equal(E.pulsesPerBurst(2500, 100, 50), 12.5);
  assert.deepEqual(E.gatedTrain({ burstHz: 0, dutyPct: 50, windowMs: 100 }), []);
});

test('twinPeakTimes: 2 picos por onda completa', () => {
  assert.equal(E.twinPeakTimes(2, 1000).length, 4);
  assert.equal(E.twinPeakTimes(150, 1000).length, 300);
  assert.equal(E.twinPeakTimes(0, 1000).length, 0);
});

test('interferencial: batido, envolvente y acotación', () => {
  assert.equal(E.beatHz(4000, 4100), 100);
  assert.equal(E.beatHz(4000, 4000), 0);
  assert.ok(near(E.envelope(4000, 4100, 0), 2));
  assert.ok(near(E.envelope(4000, 4100, 1 / 200), 0));
  assert.ok(near(E.envelope(4000, 4000, 0.01), 2));
  for (let t = 0; t <= 0.05; t += 1e-5) {
    assert.ok(Math.abs(E.interferentialAt(4000, 4100, t)) <= E.envelope(4000, 4100, t) + 1e-9, 't=' + t);
  }
});

test('GENERAL_CONDITIONS y GENERAL_NOTES', () => {
  H.assertConditions(E.GENERAL_CONDITIONS, { contra: 12 });
  assert.ok(E.GENERAL_NOTES.length >= 6);
});
