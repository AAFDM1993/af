/* Núcleo de corriente pulsada de alto voltaje (CPAV). Datos: Clase 7. */
var AltoVoltajeCore = (function () {
  var E = (typeof ElectroCore !== 'undefined') ? ElectroCore : require('./electro-core.js');

  function peaksPerSecond(pps) { return pps > 0 ? pps * 2 : 0; }
  function classifyHz(hz) {
    if (hz >= 1 && hz <= 80) return 'estimulante';
    if (hz > 80 && hz <= 150) return 'analgesica';
    return null;
  }

  function evaluateHV(p) {
    var m = [], v = 'ok';
    if (p.objective === 'agudo') {
      if (p.hz < 50 || p.hz > 120) { v = 'ajustar'; m.push('Dolor agudo: frecuencia de 50 a 120 Hz.'); }
      if (p.minutes !== 20) { v = 'ajustar'; m.push('Dolor agudo: 20 minutos, ciclo continuo, electrodos sobre la zona dolorosa.'); }
    } else {
      if (p.hz < 2 || p.hz > 15) { v = 'ajustar'; m.push('Dolor crónico: frecuencia de 2 a 15 Hz.'); }
      if (p.minutes !== 10) { v = 'ajustar'; m.push('Dolor crónico: 10 minutos, con el electrodo activo más pequeño sobre la zona de dolor.'); }
    }
    if (!(p.volts > 100)) { v = 'ajustar'; m.push('El voltaje terapéutico es mayor de 100 V.'); }
    if (v === 'ok') m.push('Parámetros adecuados. La sensación es agradable y no se forman efectos térmicos ni químicos en el tejido.');
    return { veredicto: v, mensajes: m };
  }

  var EFFECTS = ['Antiinflamatorio', 'Analgésico', 'Aumenta la circulación', 'Reabsorbe edemas', 'Vasodilatador'];
  var NOTES = [
    'Corriente monofásica de doble pico, de forma fija que no se puede variar, con una rampa de subida rápida y pausa larga.',
    'Un solo pico de corta duración no puede estimular los axones; los impulsos muy cortos van seguidos de intervalos largos.',
    'Voltaje terapéutico mayor de 100 V; la resistencia de la piel es baja y resulta cómoda.',
    '1–80 Hz estimulante; 80–150 Hz analgésica. La frecuencia se mide en pulsaciones por segundo (PPS): 2 PPS son 2 ondas completas por segundo, es decir 4 picos.',
    'Polaridad positiva o negativa sobre el tejido favorece la regeneración de células insensibles (heridas abiertas y úlceras por presión).',
    'Tiempo de aplicación: 10 a 20 min.'
  ];

  var CONDITIONS = E.GENERAL_CONDITIONS;

  var CASES = [
    { id: 'agudo', titulo: 'Dolor agudo de espalda',
      texto: 'Hombre de 30 años con dolor agudo en la espalda tras un esfuerzo ayer. Sin contraindicaciones. Se aplicará alto voltaje con ciclo continuo sobre la zona dolorosa. ¿Es apto, a qué frecuencia (Hz) y cuántos minutos?',
      spec: { apto: { any: ['si'] }, hz: { min: 50, max: 120 }, minutes: { min: 20, max: 20 } },
      respuesta: 'Apto. Dolor agudo: ciclo continuo, polaridad positiva o negativa, 50 a 120 Hz, 20 minutos con los electrodos en la zona dolorosa.' },
    { id: 'cronico', titulo: 'Dolor crónico de hombro',
      texto: 'Mujer de 55 años con dolor crónico de hombro desde hace 8 meses. Sin contraindicaciones. Se usará alto voltaje con el electrodo activo más pequeño sobre la zona de dolor. ¿Es apta, a qué frecuencia (Hz) y cuántos minutos?',
      spec: { apto: { any: ['si'] }, hz: { min: 2, max: 15 }, minutes: { min: 10, max: 10 } },
      respuesta: 'Apta. Dolor crónico: ciclo continuo, 2 a 15 Hz, 10 minutos, electrodo activo más pequeño en la zona de dolor.' },
    { id: 'marcapasos', titulo: 'Contractura con marcapasos',
      texto: 'Hombre de 70 años con una contractura cervical aguda, portador de marcapasos. Se propone alto voltaje. ¿Es apto?',
      spec: { apto: { any: ['no'] } },
      respuesta: 'No. El marcapasos es una contraindicación (relativa según la zona) y la zona cervical queda cerca del seno carotídeo.' }
  ];

  return { peaksPerSecond: peaksPerSecond, classifyHz: classifyHz, evaluateHV: evaluateHV, EFFECTS: EFFECTS, NOTES: NOTES, CONDITIONS: CONDITIONS, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = AltoVoltajeCore;
