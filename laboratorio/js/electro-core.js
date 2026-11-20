/* Núcleo eléctrico: matemática pura de ondas y contraindicaciones generales de electroterapia. */
var ElectroCore = (function () {
  function periodMs(hz) { return hz > 0 ? 1000 / hz : null; }
  function freqFromPulsePause(pulseMs, pauseMs) { var s = pulseMs + pauseMs; return s > 0 ? 1000 / s : 0; }
  function dutyPct(pulseMs, pauseMs) { var s = pulseMs + pauseMs; return s > 0 ? 100 * pulseMs / s : 0; }

  function phaseIn(t, period) { return t - Math.floor(t / period + 1e-9) * period; }
  function sample(windowMs, stepMs, fn) {
    var t = [], v = [], n = Math.floor(windowMs / stepMs + 1e-9);
    for (var i = 0; i <= n; i++) { var x = i * stepMs; t.push(x); v.push(fn(x)); }
    return { t: t, v: v };
  }

  function rectWave(o, windowMs, stepMs) {
    var p = o.pulseMs, q = o.pauseMs, period, fn;
    if (o.phase === 'bi-sym') period = 2 * p + q;
    else if (o.phase === 'bi-asym') period = 3.5 * p + q;
    else period = p + q;
    if (!(period > 0)) return sample(windowMs, stepMs, function () { return 0; });
    fn = function (t) {
      var ph = phaseIn(t, period);
      if (o.phase === 'bi-sym') return ph < p ? 1 : (ph < 2 * p ? -1 : 0);
      if (o.phase === 'bi-asym') return ph < p ? 1 : (ph < 3.5 * p ? -0.4 : 0);
      return ph < p ? 1 : 0;
    };
    return sample(windowMs, stepMs, fn);
  }

  function halfSineWave(o, windowMs, stepMs) {
    var period = o.pulseMs + o.pauseMs;
    return sample(windowMs, stepMs, function (t) {
      if (!(period > 0) || !(o.pulseMs > 0)) return 0;
      var ph = phaseIn(t, period);
      return ph < o.pulseMs ? Math.sin(Math.PI * ph / o.pulseMs) : 0;
    });
  }

  function expWave(o, windowMs, stepMs) {
    var period = o.pulseMs + o.pauseMs, den = 1 - Math.exp(-o.pulseMs / o.tauMs);
    return sample(windowMs, stepMs, function (t) {
      if (!(period > 0) || !(o.pulseMs > 0) || !(o.tauMs > 0)) return 0;
      var ph = phaseIn(t, period);
      return ph < o.pulseMs ? (1 - Math.exp(-ph / o.tauMs)) / den : 0;
    });
  }

  function alternate(types, lengths, windowMs) {
    var out = [], t = 0, i = 0;
    while (t < windowMs) {
      var end = Math.min(windowMs, t + lengths[i % lengths.length]);
      out.push({ type: types[i % types.length], startMs: t, endMs: end });
      t = end; i++;
    }
    return out;
  }
  function diadSequence(kind, windowMs, phaseMs) {
    var ph = phaseMs || 8000;
    if (!(windowMs > 0)) return [];
    if (kind === 'MF' || kind === 'DF') return [{ type: kind, startMs: 0, endMs: windowMs }];
    if (kind === 'CP') return alternate(['MF', 'DF'], [1000, 1000], windowMs);
    if (kind === 'LP') return alternate(['MF', 'MF+DF'], [ph, ph], windowMs);
    if (kind === 'RS') return alternate(['MF', 'pausa'], [1000, 1000], windowMs);
    throw new Error('corriente desconocida: ' + kind);
  }

  function gatedTrain(o) {
    if (!(o.burstHz > 0) || !(o.windowMs > 0)) return [];
    var per = 1000 / o.burstHz, on = per * o.dutyPct / 100, out = [];
    for (var s = 0; s < o.windowMs - 1e-9; s += per) {
      var e1 = Math.min(o.windowMs, s + on), e2 = Math.min(o.windowMs, s + per);
      if (e1 > s) out.push({ startMs: s, endMs: e1, on: true });
      if (e2 > e1) out.push({ startMs: e1, endMs: e2, on: false });
    }
    return out;
  }
  function pulsesPerBurst(innerHz, burstHz, dutyPct) { return burstHz > 0 ? innerHz * (dutyPct / 100) / burstHz : 0; }

  function twinPeakTimes(pps, windowMs, gapMs) {
    var gap = gapMs === undefined ? 1 : gapMs, out = [];
    if (!(pps > 0)) return out;
    for (var k = 0; ; k++) {
      var t = k * 1000 / pps;
      if (t >= windowMs) break;
      out.push(t);
      if (t + gap < windowMs) out.push(t + gap);
    }
    return out;
  }

  function beatHz(f1, f2) { return Math.abs(f1 - f2); }
  function interferentialAt(f1, f2, tSec) { return Math.sin(2 * Math.PI * f1 * tSec) + Math.sin(2 * Math.PI * f2 * tSec); }
  function envelope(f1, f2, tSec) { return Math.abs(2 * Math.cos(Math.PI * (f1 - f2) * tSec)); }

  var GENERAL_CONDITIONS = [
    { id: 'marcapasos', label: 'Marcapasos', nivel: 'contra', por: 'la corriente puede interferir con el dispositivo (relativa según la zona)' },
    { id: 'cardiopatia', label: 'Cardiopatías', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'seno-carotideo', label: 'Zona del seno carotídeo', nivel: 'contra', por: 'puede alterar la frecuencia y la presión' },
    { id: 'laringe', label: 'Zona de la laringe', nivel: 'contra', por: 'riesgo de espasmo' },
    { id: 'mucosas', label: 'Mucosas', nivel: 'contra', por: 'no se estimulan' },
    { id: 'hipersensibilidad', label: 'Hipersensibilidad cutánea', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'tromboflebitis', label: 'Zonas de tromboflebitis', nivel: 'contra', por: 'riesgo de desprender un trombo' },
    { id: 'heridas', label: 'Heridas o hematomas recientes', nivel: 'contra', por: 'la piel pierde su barrera y la corriente se concentra: riesgo de quemadura' },
    { id: 'embarazo', label: 'Embarazo', nivel: 'contra', por: 'no se establece la seguridad sobre el feto' },
    { id: 'isquemia', label: 'Zonas isquémicas', nivel: 'contra', por: 'poco aporte de sangre para disipar los efectos de la corriente' },
    { id: 'epilepsia', label: 'Epilepsia', nivel: 'contra', por: 'el estímulo puede desencadenar una crisis' },
    { id: 'anestesia', label: 'Zonas de anestesia', nivel: 'contra', por: 'no percibe el ardor de alerta: quemadura sin aviso' }
  ];
  var GENERAL_NOTES = [
    'Electrodos autoadhesivos: duran 20–30 sesiones; desecharlos si no se adhieren o tienen hongos.',
    'Limpiar la zona con alcohol; no usar cremas previamente (tapan los poros).',
    'Evitar la entrada de aire al estuche de los electrodos; son personales.',
    'Comunicar al paciente lo que va a sentir.',
    'Verificar la intensidad al cabo de unos minutos.',
    'Evaluar la piel al comienzo y al final (enrojecimiento) y prevenir quemaduras.',
    'Inspeccionar cables y accesorios: puerto de entrada, trayecto del cable y pines.'
  ];

  return { periodMs: periodMs, freqFromPulsePause: freqFromPulsePause, dutyPct: dutyPct, rectWave: rectWave, halfSineWave: halfSineWave,
    expWave: expWave, diadSequence: diadSequence, gatedTrain: gatedTrain, pulsesPerBurst: pulsesPerBurst, twinPeakTimes: twinPeakTimes,
    beatHz: beatHz, interferentialAt: interferentialAt, envelope: envelope, GENERAL_CONDITIONS: GENERAL_CONDITIONS, GENERAL_NOTES: GENERAL_NOTES };
})();
if (typeof module !== 'undefined') module.exports = ElectroCore;
