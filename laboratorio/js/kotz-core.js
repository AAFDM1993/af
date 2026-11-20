/* Núcleo de corriente de Kotz (2 500 Hz). Datos: Clase 9. */
var KotzCore = (function () {
  var E = (typeof ElectroCore !== 'undefined') ? ElectroCore : require('./electro-core.js');

  var CARRIER_HZ = 2500;
  function burstHzFor(fiber) {
    if (fiber === 'tonica') return 20;
    if (fiber === 'fasica') return 100;
    throw new Error('fibra desconocida: ' + fiber);
  }
  function carrierCyclesPerBurst(burstHz, dutyPct) { return E.pulsesPerBurst(CARRIER_HZ, burstHz, dutyPct); }

  function evaluateKotz(p) {
    var m = [], v = 'ok', want = burstHzFor(p.fiber);
    if (p.burstHz !== want) { v = 'ajustar'; m.push('Para fibras ' + (p.fiber === 'tonica' ? 'tónicas' : 'fásicas') + ' la clase indica ' + want + ' Hz.'); }
    if (!(p.dutyPct >= 1 && p.dutyPct <= 99)) { v = 'ajustar'; m.push('El ciclo ráfaga/reposo debe estar entre 1 y 99 %: con 0 % no hay estímulo y con 100 % la corriente es continua (la clase no da el valor).'); }
    if (v === 'ok') m.push('Cada ráfaga contiene unos ' + (Math.round(carrierCyclesPerBurst(p.burstHz, p.dutyPct) * 10) / 10) + ' ciclos de la corriente de 2 500 Hz.');
    return { veredicto: v, mensajes: m };
  }

  var NOTES = [
    'Expuesta por Kotz, que usó corrientes de 2 500 Hz para el fortalecimiento muscular.',
    'Se emite en forma de trenes o paquetes de impulsos.',
    'Es alterna, bifásica, de estado variable, con impulsos rectangulares, simétricos, equilibrados e ininterrumpidos; pertenece a las corrientes de mediana frecuencia.',
    'Para estimular las fibras tónicas: 20 Hz. Para estimular las fibras fásicas: 100 Hz (frecuencia de las ráfagas).',
    'La clase no da el ciclo entre ráfaga y reposo: el módulo lo deja libre como modelo didáctico.'
  ];

  var CONDITIONS = E.GENERAL_CONDITIONS;

  var CASES = [
    { id: 'fasica', titulo: 'Fortalecimiento de fibras fásicas',
      texto: 'Hombre de 29 años, deportista, con pérdida de fuerza del cuádriceps tras una lesión. Sin contraindicaciones. Se busca fortalecer las fibras fásicas con corriente de Kotz. ¿Es apto, sobre qué fibra actúa y cuál es la frecuencia de las ráfagas (Hz)?',
      spec: { apto: { any: ['si'] }, fiber: { any: ['fasica'] }, burstHz: { min: 100, max: 100 } },
      respuesta: 'Apto. Kotz: portadora de 2 500 Hz en ráfagas; las fibras fásicas se estimulan con ráfagas de 100 Hz (las tónicas, con 20 Hz).' },
    { id: 'marcapasos', titulo: 'Fortalecimiento con marcapasos',
      texto: 'Mujer de 67 años con debilidad de los glúteos y marcapasos. Se plantea Kotz por ser de mediana frecuencia. ¿Es apta?',
      spec: { apto: { any: ['no'] } },
      respuesta: 'No. El marcapasos es una contraindicación (relativa según la zona): la corriente puede interferir con el dispositivo.' }
  ];

  return { CARRIER_HZ: CARRIER_HZ, burstHzFor: burstHzFor, carrierCyclesPerBurst: carrierCyclesPerBurst, evaluateKotz: evaluateKotz, NOTES: NOTES, CONDITIONS: CONDITIONS, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = KotzCore;
