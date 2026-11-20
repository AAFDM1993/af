const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../js/laser-core.js');


test('el núcleo carga', () => assert.equal(typeof C, 'object'));

test('dosis, energía y tiempo', () => {
  assert.equal(C.totalEnergyJ(4, 10), 40);
  assert.equal(C.treatmentTimeS(4, 10, 200), 200);
  assert.equal(C.treatmentTimeS(99, 50, 200), 24750);
  assert.equal(C.treatmentTimeS(0, 50, 200), 0);
  assert.ok(Math.abs(C.treatmentTimeS(0.1, 1, 200) - 0.5) < 1e-9);
});

test('potencia media y energía por pulso', () => {
  assert.equal(C.avgPowerMW(200, 50, 1000), 100);
  assert.equal(C.avgPowerMW(200, 10, 5000), 20);
  assert.equal(C.avgPowerMW(200, 90, 0), 200);
  assert.equal(C.energyPerPulseMJ(200, 50, 1000), 0.1);
  assert.equal(C.energyPerPulseMJ(200, 50, 0), null);
  const t10 = C.treatmentTimeS(4, 10, C.avgPowerMW(200, 10, 1000));
  const t90 = C.treatmentTimeS(4, 10, C.avgPowerMW(200, 90, 1000));
  assert.ok(Math.abs(t10 / t90 - 9) < 1e-9);
});

test('formatDuration', () => {
  assert.equal(C.formatDuration(45), '45 s');
  assert.equal(C.formatDuration(200), '3 min 20 s');
  assert.equal(C.formatDuration(3600), '1 h');
  assert.equal(C.formatDuration(24750), '6 h 52 min 30 s');
  assert.equal(C.formatDuration(0), '0 s');
});

test('atenuación por capas', () => {
  const th = { piel: 2, grasa: 5 };
  assert.equal(C.fractionRemaining(830, 0, th), 1);
  for (const nm of C.WAVELENGTHS) {
    let prev = 1;
    for (const d of [5, 10, 20]) {
      const f = C.fractionRemaining(nm, d, th);
      assert.ok(f < prev && f > 0, nm + ' @' + d);
      prev = f;
    }
  }
  assert.ok(C.fractionRemaining(830, 10, th) > C.fractionRemaining(632.8, 10, th));
  const deep = C.fractionRemaining(830, 100, th);
  assert.ok(deep >= 0 && deep < 1 && !Number.isNaN(deep));
  assert.equal(C.doseAtDepth(4, 0.25), 1);
  assert.throws(() => C.fractionRemaining(700, 5, th));
});

test('clasificación de dosis', () => {
  assert.equal(C.classifyDose(1.9, 'antialgico'), 'infradosis');
  assert.equal(C.classifyDose(2, 'antialgico'), 'ventana');
  assert.equal(C.classifyDose(4, 'antialgico'), 'ventana');
  assert.equal(C.classifyDose(4.1, 'antialgico'), 'sobredosis');
});

test('frecuencia según la clase', () => {
  const e = C.classFrequencyEffect;
  assert.equal(e(499), 'sin rango'); assert.equal(e(500), 'dolor'); assert.equal(e(3999), 'dolor');
  assert.equal(e(4000), 'regeneracion'); assert.equal(e(4999), 'regeneracion');
  assert.equal(e(5000), 'inflamacion'); assert.equal(e(10000), 'inflamacion');
});

test('caso clínico', () => {
  const c = C.CASES.find(x => x.objetivo === 'antialgico');
  assert.ok(c && C.CASES.length === 4);
  assert.deepEqual(C.CASES.map(x => x.objetivo).sort(), ['antialgico', 'antiinflamatorio', 'circulatorio', 'regenerativo']);
  const p = d => ({ doseJcm2: d, mode: 'continuo', hz: 0, method: 'punteado' });
  assert.equal(C.evaluateCase(c, p(1)).dosisVeredicto, 'infradosis');
  assert.equal(C.evaluateCase(c, p(3)).dosisVeredicto, 'ventana');
  assert.equal(C.evaluateCase(c, p(8)).dosisVeredicto, 'sobredosis');
  const r = C.evaluateCase(c, p(3));
  assert.ok(r.fraccionEnBlanco > 0 && r.fraccionEnBlanco < 1);
  assert.ok(r.mensajes.length >= 1);
});

test('respuesta bifásica del tejido', () => {
  const R = C.tissueResponse, near = (a, b) => Math.abs(a - b) < 1e-9;
  assert.ok(near(R(Math.sqrt(8), 'antialgico'), 1));      // pico en el centro geométrico de la ventana 2–4
  assert.ok(near(R(2, 'antialgico'), 0.5));               // bordes de la ventana: 50 % del máximo
  assert.ok(near(R(4, 'antialgico'), 0.5));
  assert.ok(R(0.1, 'antialgico') >= 0 && R(0.1, 'antialgico') < 0.05); // infradosis: casi sin efecto
  assert.ok(R(8, 'antialgico') < 0);                      // sobredosis: por debajo de no tratar
  assert.ok(R(99, 'antialgico') < R(8, 'antialgico'));    // más dosis, más inhibición
  for (const g of Object.keys(C.CLASS_DOSE)) {
    const [lo, hi] = C.CLASS_DOSE[g];
    assert.ok(R(Math.sqrt(lo * hi), g) > R(lo / 3, g) && R(Math.sqrt(lo * hi), g) > R(hi * 3, g), g);
  }
});

test('técnicas de aplicación', () => {
  assert.deepEqual(C.TECHNIQUES.map(t => t.id), ['punteado', 'barrido', 'pincelado', 'bano']);
  for (const t of C.TECHNIQUES) {
    assert.ok(t.nombre && t.como && t.indicaciones && t.nota, t.id);
  }
  const big = C.CASES.find(x => x.areaCm2 >= 10);
  const base = { doseJcm2: 3, mode: 'continuo', hz: 0 };
  assert.ok(C.evaluateCase(big, { ...base, method: 'punteado' }).mensajes.some(m => m.includes('barrido')));
  assert.ok(!C.evaluateCase(big, { ...base, method: 'barrido' }).mensajes.some(m => m.includes('varios puntos')));
  assert.ok(C.evaluateCase(big, { ...base, method: 'bano' }).mensajes.some(m => m.includes('distancia')));
});

test('dosis a partir del tiempo y potencia variable', () => {
  assert.equal(C.DEVICE.powerMinMW, 35);
  assert.ok(Math.abs(C.doseFromTime(200, 10, 200) - 4) < 1e-9);
  assert.ok(Math.abs(C.doseFromTime(100, 10, 100) - 1) < 1e-9);
  const t = C.treatmentTimeS(4, 10, 35);
  assert.ok(Math.abs(C.doseFromTime(t, 10, 35) - 4) < 1e-9);
  assert.equal(C.doseFromTime(10, 0, 200), 0);
});

test('ningún texto de CASES ni TECHNIQUES menciona equipo ni marca', () => {
  const strings = [];
  (function walk(o) { if (typeof o === 'string') strings.push(o); else if (o && typeof o === 'object') Object.values(o).forEach(walk); })([C.CASES, C.TECHNIQUES]);
  assert.ok(strings.length > 10);
  assert.deepEqual(strings.filter(s => new RegExp(['equi' + 'po', 'B' + 'TL', 'pant' + 'alla'].join('|'), 'i').test(s)), []);
});
