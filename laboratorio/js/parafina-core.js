/* Núcleo de parafina. Datos: Clase 2, Termoterapia superficial (baño de parafina). */
var ParafinaCore = (function () {
  var CONST = { meltC: 54.5, bathMinC: 42, bathMaxC: 52, mixWaxParts: 7, mixOilParts: 1, layersMin: 7, layersMax: 10,
    dipSec: 10, pauseSec: 10, minutesMin: 10, minutesMax: 15, changeMonths: 6 };

  function layerBuildSeconds(layers) {
    if (!(layers > 0)) return 0;
    return layers * CONST.dipSec + (layers - 1) * CONST.pauseSec;
  }

  function evaluateApplication(p) {
    var m = [], v = 'ok';
    function bump(level) { if (level === 'riesgo' || v === 'ok') v = level; }
    if (p.method === 'inmersion') {
      if (p.bathC > CONST.bathMaxC) { bump('riesgo'); m.push('Baño por encima de 52 °C: riesgo de quemadura. La mezcla (cera y aceite mineral 7:1) se mantiene líquida entre 42 y 52 °C.'); }
      else if (p.bathC < CONST.bathMinC) { bump('ajustar'); m.push('Baño por debajo de 42 °C: la parafina se solidifica y no forma bien las capas.'); }
    }
    if (p.layers < CONST.layersMin || p.layers > CONST.layersMax) {
      bump('ajustar'); m.push('Forme entre 7 y 10 capas, con una pausa de 10 s entre capa y capa.');
    }
    if (p.minutes < CONST.minutesMin || p.minutes > CONST.minutesMax) {
      bump('ajustar'); m.push('La aplicación dura entre 10 y 15 minutos.');
    }
    if (p.wrapped === false) { bump('ajustar'); m.push('Envuelva en una bolsa de plástico y cubra con toalla o guante para retener el calor.'); }
    if (v === 'ok') m.push('Aplicación adecuada: ' + p.layers + ' capas, ' + p.minutes + ' min, envuelta para retener el calor.');
    return { veredicto: v, mensajes: m };
  }

  var CONDITIONS = [
    { id: 'herida', label: 'Heridas', nivel: 'contra', por: 'la parafina caliente sobre una lesión abierta' },
    { id: 'febril', label: 'Estado febril', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'sensibilidad', label: 'Trastorno de la sensibilidad', nivel: 'contra', por: 'no percibe el exceso de calor' },
    { id: 'circulacion', label: 'Trastorno de la circulación', nivel: 'contra', por: 'no disipa el calor' },
    { id: 'sinovitis', label: 'Sinovitis aguda o subaguda', nivel: 'contra', por: 'el calor aumenta la inflamación' },
    { id: 'neoplasia', label: 'Neoplasias', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'inflamacion', label: 'Inflamación aguda', nivel: 'contra', por: 'el calor aumenta la inflamación' },
    { id: 'hongos', label: 'Hongos en la zona', nivel: 'precaucion', por: 'la preparación exige inspeccionar la piel: no debe haber heridas ni hongos' }
  ];

  var INDICATIONS = ['Contracturas', 'Rigidez articular', 'Secuela de fracturas de mano', 'Dedo en gatillo',
    'Síndrome de túnel del carpo', 'Artrosis de mano', 'Afecciones reumáticas crónicas en fase de remisión'];

  var CASES = [
    { id: 'artrosis', titulo: 'Artrosis de mano',
      texto: 'Mujer de 64 años con artrosis de ambas manos y rigidez matinal de los dedos. Piel íntegra, sin hongos, sensibilidad y circulación normales, sin inflamación aguda. Se aplicará parafina en la mano. ¿Es apta, con qué método, cuántas capas y cuántos minutos?',
      spec: { apto: { any: ['si'] }, method: { any: ['inmersion'] }, layers: { min: 7, max: 10 }, minutes: { min: 10, max: 15 } },
      respuesta: 'Apta (artrosis de mano). Inmersión: mano relajada y sin moverse, 7 a 10 capas con pausa de 10 s, envolver en bolsa y toalla, 10 a 15 min. Al final, retirar la parafina, inspeccionar la piel, movilizar y lavar.' },
    { id: 'gatillo-herida', titulo: 'Dedo en gatillo con herida',
      texto: 'Hombre de 50 años con dedo en gatillo. Presenta una herida abierta en la palma, de una caída hace 2 días. ¿Aplicaría parafina?',
      spec: { apto: { any: ['no'] } },
      respuesta: 'No. El dedo en gatillo es una indicación, pero las heridas son una contraindicación: primero debe cerrar. Se elige otra técnica.' },
    { id: 'hombro', titulo: 'Rigidez de hombro',
      texto: 'Mujer de 55 años con rigidez y contractura del hombro, en fase subaguda tardía, piel íntegra y sensibilidad normal. No se puede sumergir el hombro. ¿Es apta, con qué método, cuántas capas y cuántos minutos?',
      spec: { apto: { any: ['si'] }, method: { any: ['pincelado'] }, layers: { min: 7, max: 10 }, minutes: { min: 10, max: 15 } },
      respuesta: 'Apta (contractura, rigidez). Como no hay inmersión posible (hombro, columna), pincelado: untar con brocha 10 s, esperar la capa y repetir 7 a 10 veces, cubrir con plástico y toalla, 10 a 15 min.' }
  ];

  return { CONST: CONST, layerBuildSeconds: layerBuildSeconds, evaluateApplication: evaluateApplication, CONDITIONS: CONDITIONS, INDICATIONS: INDICATIONS, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = ParafinaCore;
