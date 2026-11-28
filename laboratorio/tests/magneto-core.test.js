const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../js/magneto-core.js');
const H = require('./helpers.js');
const near = (a, b, e) => Math.abs(a - b) <= (e || 1e-9);

test('conversión Gauss–Tesla', () => {
  assert.equal(M.GAUSS_PER_TESLA, 10000);
  assert.equal(M.gaussToTesla(10000), 1);
  assert.equal(M.teslaToGauss(3), 30000);
  assert.ok(near(M.gaussToTesla(100), 0.01));
});

test('fieldAtDepth: solenoide uniforme y plano decae', () => {
  assert.equal(M.fieldAtDepth('solenoide', 0, 60), 60);
  assert.equal(M.fieldAtDepth('solenoide', 10, 60), 60);
  assert.equal(M.fieldAtDepth('plano', 0, 60), 60);
  assert.equal(M.fieldAtDepth('plano', 15, 60), 0);
  assert.ok(near(M.fieldAtDepth('plano', 7.5, 60), 15));
  assert.equal(M.fieldAtDepth('plano', -3, 60), 60);
  assert.equal(M.fieldAtDepth('plano', 40, 60), 0);
  assert.equal(M.fieldAtDepth('solenoide', 40, 60), 60);
  assert.throws(() => M.fieldAtDepth('zzz', 1, 1));
});

test('polos: N miorrelajante, S analgésico y antiinflamatorio', () => {
  assert.equal(M.poleEffect('N'), 'miorrelajante');
  assert.equal(M.poleEffect('S'), 'analgesico-antiinflamatorio');
  assert.throws(() => M.poleEffect('X'));
});

test('profileFor: <50 ataque, >50 analgésico, 50 sin perfil', () => {
  assert.equal(M.profileFor(30), 'ataque');
  assert.equal(M.profileFor(49), 'ataque');
  assert.equal(M.profileFor(50), null);
  assert.equal(M.profileFor(51), 'analgesico');
  assert.equal(M.profileFor(100), 'analgesico');
});

test('PATHOLOGIES: 16 filas con los valores de la clase', () => {
  const P = M.PATHOLOGIES;
  assert.equal(P.length, 16);
  assert.equal(new Set(P.map(p => p.id)).size, 16);
  const by = id => P.find(p => p.id === id);
  assert.deepEqual(by('epicondilitis').gauss, [40, 60]);
  assert.equal(by('epicondilitis').minutes, 15);
  assert.equal(by('epicondilitis').sesiones, '2-dia');
  assert.deepEqual(by('celulitis').gauss, [80, 200]);
  assert.equal(by('osteomielitis').sesiones, '2-dia');
  assert.deepEqual(by('raquialgias').gauss, [20, 40]);
  assert.equal(by('fracturas').minutes, null);
  assert.equal(by('osteoporosis').minutes, null);
  assert.equal(P.filter(p => p.maxDevice).length, 2);
  assert.ok(by('artropatias-degenerativas').maxDevice && by('retardo-consolidacion').maxDevice);
});

test('evaluateProtocol', () => {
  const ok = { pathology: 'epicondilitis', applicator: 'plano', pole: 'S', hz: 30, gauss: 50, minutes: 15 };
  assert.equal(M.evaluateProtocol(ok).veredicto, 'ok');
  assert.equal(M.evaluateProtocol({ pathology: 'raquialgias', applicator: 'plano', pole: 'N', hz: 70, gauss: 50, minutes: 15 }).veredicto, 'ajustar');
  assert.equal(M.evaluateProtocol({ pathology: 'raquialgias', applicator: 'plano', pole: 'N', hz: 70, gauss: 30, minutes: 15 }).veredicto, 'ok');
  assert.equal(M.evaluateProtocol(Object.assign({}, ok, { gauss: 0 })).veredicto, 'no');
  assert.equal(M.evaluateProtocol(Object.assign({}, ok, { gauss: 250 })).veredicto, 'no');
  assert.equal(M.evaluateProtocol(Object.assign({}, ok, { minutes: 0 })).veredicto, 'no');
  assert.equal(M.evaluateProtocol(Object.assign({}, ok, { pathology: 'zzz' })).veredicto, 'no');
  const f50 = M.evaluateProtocol(Object.assign({}, ok, { hz: 50 }));
  assert.equal(f50.veredicto, 'ajustar');
  assert.ok(f50.mensajes.some(m => /50 Hz/.test(m)));
  assert.equal(M.evaluateProtocol({ pathology: 'cefaleas', applicator: 'plano', pole: 'N', hz: 70, gauss: 18, minutes: 15 }).veredicto, 'ajustar');
  assert.equal(M.evaluateProtocol({ pathology: 'cefaleas', applicator: 'plano', pole: 'S', hz: 70, gauss: 18, minutes: 15 }).veredicto, 'ok');
  assert.equal(M.evaluateProtocol(Object.assign({}, ok, { applicator: 'solenoide' })).veredicto, 'ok');
  assert.ok(M.evaluateProtocol(Object.assign({}, ok, { applicator: 'solenoide' })).mensajes.length > 0);
  assert.equal(M.evaluateProtocol({ pathology: 'retardo-consolidacion', applicator: 'solenoide', pole: 'S', hz: 30, gauss: 120, minutes: 20 }).veredicto, 'ok');
});

test('condiciones, notas y casos', () => {
  H.assertConditions(M.CONDITIONS, { contra: 7 });
  assert.ok(M.NOTES.length >= 5);
  assert.ok(/3 T/.test(M.HIGH_INTENSITY_NOTE));
  H.assertCases(M.CASES, 4);
  assert.deepEqual(M.CASES[0].spec.gauss, { min: 30, max: 50 });
});

test('TISSUES: 6 tejidos de la clase con mecanismo, efecto y patologías válidas', () => {
  assert.equal(M.TISSUES.length, 6);
  assert.equal(new Set(M.TISSUES.map(t => t.id)).size, 6);
  const ids = M.PATHOLOGIES.map(p => p.id);
  for (const t of M.TISSUES) {
    assert.ok(t.nombre && t.efecto && t.pasos.length >= 3, t.id);
    assert.ok(t.usos.length >= 2 && t.usos.every(u => ids.includes(u)), t.id);
    assert.ok(t.polo === null || t.polo === 'N' || t.polo === 'S', t.id);
  }
  const by = id => M.TISSUES.find(t => t.id === id);
  assert.equal(by('musculo').polo, 'N');
  assert.equal(by('nervio').polo, 'S');
  assert.ok(by('hueso').usos.includes('fracturas'));
  assert.ok(/osteobl/i.test(by('hueso').pasos.join(' ')));
  assert.ok(/colágeno/i.test(by('conectivo').pasos.join(' ')));
  assert.ok(/sodio/i.test(by('membrana').pasos.join(' ')));
});

test('LAYERS y layerAt: capas didácticas del miembro (15 cm)', () => {
  assert.equal(M.LAYERS[0].id, 'piel');
  assert.equal(M.LAYERS[M.LAYERS.length - 1].to, 15);
  for (let i = 1; i < M.LAYERS.length; i++) assert.equal(M.LAYERS[i].from, M.LAYERS[i - 1].to);
  assert.equal(M.layerAt(0).id, 'piel');
  assert.equal(M.layerAt(1).id, 'grasa');
  assert.equal(M.layerAt(4).id, 'musculo');
  assert.equal(M.layerAt(7).id, 'hueso');
  assert.equal(M.layerAt(12).id, 'musculo');
  assert.equal(M.layerAt(-2).id, 'piel');
  assert.equal(M.layerAt(99).id, 'musculo');
});

test('TISSUES: nivel, resultado clínico y dosis desde la tabla de la clase', () => {
  const NIV = ['Bioquímico', 'Bioquímico y celular', 'Órganos y sistemas'];
  for (const t of M.TISSUES) {
    assert.ok(NIV.includes(t.nivel), t.id);
    assert.ok(t.clinico && t.clinico.length > 20, t.id);
    assert.ok(t.dato === null || t.dato.length > 10, t.id);
  }
  assert.equal(M.TISSUES.find(t => t.id === 'hueso').nivel, 'Bioquímico');
  assert.equal(M.TISSUES.find(t => t.id === 'vasos').nivel, 'Órganos y sistemas');
  const rows = M.tissueDoses('hueso');
  assert.equal(rows.length, 3);
  const fx = rows.find(r => r.id === 'fracturas');
  assert.equal(fx.gauss, '30 – 50 G');
  assert.equal(fx.minutes, 'varía');
  assert.equal(fx.sesiones, 'diarias');
  const rc = rows.find(r => r.id === 'retardo-consolidacion');
  assert.equal(rc.gauss, 'Máximo del equipo');
  assert.equal(rc.minutes, '20 min');
  assert.equal(M.tissueDoses('nervio').find(r => r.id === 'lesiones-nerviosas').sesiones, '3 por semana');
  assert.deepEqual(M.tissueDoses('zzz'), []);
});

test('visualHz acota y mapea', () => {
  assert.equal(M.visualHz(1), 0.5);
  assert.equal(M.visualHz(100), 3);
  assert.equal(M.visualHz(0), 0.5);
  assert.equal(M.visualHz(1000), 3);
  assert.equal(M.visualHz(NaN), 0.5);
  assert.ok(near(M.visualHz(50.5), 1.75));
});

test('fieldStrength', () => {
  assert.equal(M.fieldStrength(0), 0);
  assert.equal(M.fieldStrength(200), 1);
  assert.equal(M.fieldStrength(500), 1);
  assert.equal(M.fieldStrength(-5), 0);
  assert.ok(near(M.fieldStrength(100), 0.5));
});

test('fieldPhase es periódica y acotada', () => {
  assert.equal(M.fieldPhase(0, 30, 1), 0);
  [1e9, 123456789, 7].forEach((t) => { const p = M.fieldPhase(t, 30, 1); assert.ok(p >= 0 && p < 1); });
  assert.equal(M.fieldPhase(5000, 30, -2), 0);
  assert.ok(near(M.fieldPhase(1000, 1, 1), 0.5));
});

test('wavePoint por forma', () => {
  assert.ok(near(M.wavePoint('sinusoidal', 0.25), 1));
  assert.ok(near(M.wavePoint('sinusoidal', 0.75), -1));
  assert.equal(M.wavePoint('rectangular', 0.1), 1);
  assert.equal(M.wavePoint('rectangular', 0.6), -1);
  assert.ok(near(M.wavePoint('tres-cuartos', 0.25), 1));
  assert.equal(M.wavePoint('tres-cuartos', 0.9), 0);
  assert.throws(() => M.wavePoint('zzz', 0));
  assert.ok(near(M.wavePoint('sinusoidal', 1.25), M.wavePoint('sinusoidal', 0.25)));
});

test('sweepPosition triangular', () => {
  assert.equal(M.sweepPosition(0, 4000).x, 0);
  assert.equal(M.sweepPosition(2000, 4000).x, 1);
  assert.equal(M.sweepPosition(4000, 4000).x, 0);
  assert.equal(M.sweepPosition(0, 4000).index, 0);
  assert.equal(M.sweepPosition(2000, 4000).index, 4);
});

test('THEORY completo', () => {
  const T = M.THEORY;
  assert.deepEqual(T.sustancias.map((s) => s.id), ['diamagneticas', 'paramagneticas', 'ferromagneticas']);
  assert.equal(T.posiciones.length, 5);
  assert.equal(T.posiciones[0], 'pie');
  assert.equal(T.posiciones[4], 'cabeza y cuello');
  assert.deepEqual(T.formasOnda.map((f) => f.id), ['sinusoidal', 'rectangular', 'tres-cuartos']);
  assert.ok(T.tecnica.fijo && T.tecnica.barrido);
  const strs = [].concat(T.concepto, T.unidades, T.partes.consola, T.partes.solenoide, T.partes.camilla, T.polos.N, T.polos.S,
    T.sustancias.map((s) => [s.nombre, s.susceptibilidad, s.comportamiento, s.ejemplos]).reduce((a, b) => a.concat(b), []));
  strs.forEach((s) => assert.ok(typeof s === 'string' && s.trim().length > 0));
});

test('sweepPosition: periodo no válido no da NaN', () => {
  [0, -5, NaN].forEach((p) => { const r = M.sweepPosition(1000, p); assert.equal(r.x, 0); assert.equal(r.index, 0); });
});

test('sweepPosition: el índice sigue las paradas reales (no igualmente espaciadas)', () => {
  const stops = [0, 0.2655, 0.5364, 0.7491, 1];
  assert.equal(M.sweepPosition(0, 4000, stops).index, 0);
  assert.equal(M.sweepPosition(1500, 4000, stops).x, 0.75);
  assert.equal(M.sweepPosition(1500, 4000, stops).index, 3);
  assert.equal(M.sweepPosition(750, 4000, stops).x, 0.375);
  assert.equal(M.sweepPosition(750, 4000, stops).index, 1);
  assert.equal(M.sweepPosition(2000, 4000, stops).index, 4);
});

test('frecuencia por patología según su perfil', () => {
  assert.equal(M.frequencyText('bursitis'), 'Menos de 50 Hz');
  assert.equal(M.frequencyText('cefaleas'), 'Más de 50 Hz');
  assert.equal(M.frequencyText('raquialgias'), 'Más de 50 Hz');
  M.PATHOLOGIES.forEach((p) => assert.ok(/50 Hz/.test(M.frequencyText(p.id))));
  assert.throws(() => M.frequencyText('zzz'));
});

test('WHY_PROFILES compara frecuencias e intensidades bajas y altas con datos de PROFILES', () => {
  const W = M.WHY_PROFILES;
  assert.deepEqual(W.columnas.map((c) => c.perfil), ['ataque', 'analgesico']);
  W.columnas.forEach((c) => {
    const d = M.PROFILES[c.perfil];
    assert.equal(c.frecuencia.indexOf(d.hz) >= 0, true);
    assert.ok(c.intensidad.indexOf(String(d.gauss[0])) >= 0 && c.intensidad.indexOf(String(d.gauss[1])) >= 0);
    assert.ok(c.predomina && c.cuando && c.tiempo && c.sesiones);
  });
  assert.ok(W.regla.length > 0);
});

function revisaEvidencia(e) {
  assert.ok(M.EVIDENCE_LEVELS[e.nivel], 'nivel ' + e.nivel);
  assert.ok(e.resumen && e.resumen.trim());
  if (e.nivel !== 'no-encontrada') { assert.ok(e.fuentes.length >= 1); assert.ok(e.hallazgos.length >= 1); }
  e.fuentes.forEach((f) => { assert.ok(f.titulo && f.origen); assert.ok(f.url.indexOf('https://') === 0); });
  e.hallazgos.forEach((h) => {
    assert.ok(h.texto);
    assert.ok(['células', 'animales', 'personas'].indexOf(h.enQuien) >= 0);
    if (e.nivel === 'preclinica') assert.notEqual(h.enQuien, 'personas');
  });
}

test('EVIDENCE: niveles exactos y una entrada válida por tejido', () => {
  assert.deepEqual(M.EVIDENCE_LEVELS, { moderada: 'Moderada', baja: 'Baja o contradictoria', preclinica: 'Preclínica', 'no-encontrada': 'No se encontró' });
  assert.deepEqual(Object.keys(M.EVIDENCE).sort(), M.TISSUES.map((t) => t.id).sort());
  M.TISSUES.forEach((t) => { revisaEvidencia(M.EVIDENCE[t.id]); assert.ok(M.EVIDENCE[t.id].mecanismo.length >= 1); });
  revisaEvidencia(M.POLARITY_EVIDENCE);
});
