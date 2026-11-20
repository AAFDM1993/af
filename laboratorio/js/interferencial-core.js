/* Núcleo de corriente interferencial. Datos: Clase 9 (interferenciales y Kotz). */
var InterferencialCore = (function () {
  var E = (typeof ElectroCore !== 'undefined') ? ElectroCore : require('./electro-core.js');

  var CARRIER_HZ = 4000;
  function secondFreq(amfHz) {
    if (!(amfHz >= 0 && amfHz <= 250)) throw new Error('la AMF va de 0 a 250 Hz (segunda corriente de 4001 a 4250 Hz)');
    return CARRIER_HZ + amfHz;
  }
  function amfFromFreqs(f1, f2) { return E.beatHz(f1, f2); }

  var TABLE = [
    { lo: 1, hi: 10, texto: 'Fortalecimiento muscular' },
    { lo: 10, hi: 25, texto: 'Problemas de circulación venosa periférica y de congestión' },
    { lo: 25, hi: 50, texto: 'Reforzamiento muscular durante el ejercicio' },
    { lo: 50, hi: 100, texto: 'Dolor crónico y subagudo' },
    { lo: 80, hi: 100, texto: 'Dolor subagudo' },
    { lo: 100, hi: 160, texto: 'Dolor agudo' },
    { lo: 1, hi: 100, texto: 'Baño de contraste eléctrico' }
  ];
  function objectivesForAmf(amfHz) {
    return TABLE.filter(function (r) { return amfHz >= r.lo && amfHz <= r.hi; }).map(function (r) { return r.texto; });
  }

  function evaluateIF(p) {
    var m = [], v = 'ok';
    if (p.amfHz === 0) { v = 'ajustar'; m.push('Con AMF 0 Hz las dos corrientes son iguales: sin batido no hay interferencia ni modulación.'); }
    else if (!(p.amfHz > 0 && p.amfHz <= 250)) { v = 'ajustar'; m.push('La AMF va de 1 a 250 Hz (segunda corriente de 4 001 a 4 250 Hz).'); }
    if (!(p.depthPct >= 0 && p.depthPct <= 100)) { v = 'ajustar'; m.push('La profundidad de modulación va de 0 a 100 %.'); }
    if (p.minutes < 10 || p.minutes > 15) { v = 'ajustar'; m.push('La duración es de 10 a 15 min.'); }
    if (p.phase === 'aguda') {
      if (p.dose !== 'mitis') { v = 'ajustar'; m.push('En casos agudos: dosis baja (mitis, sensación mínima) y menos tiempo.'); }
    } else if (p.dose === 'mitis') { v = 'ajustar'; m.push('En casos subagudos o crónicos: sensación normal (obvia) a apenas tolerable (fortis), con más tiempo.'); }
    if (v === 'ok') m.push('Parámetros adecuados. La amplitud la determina el paciente según el objetivo del terapeuta.');
    return { veredicto: v, mensajes: m };
  }

  var PHYSICS = [
    { nombre: 'Efecto Gildemeister', texto: 'Tras un número de ciclos (tiempo efectivo) se llega al umbral y se despolariza la fibra nerviosa. A mayor intensidad, menor tiempo efectivo. La mitad negativa del ciclo hipopolariza más la membrana que la positiva: es el principio de sumación.' },
    { nombre: 'Inhibición de Wedensky', texto: 'Con corriente alterna de mediana frecuencia continua el músculo se contrae cada vez menos hasta no contraerse (fatiga de la placa motora terminal). Se previene interrumpiendo la corriente después de cada despolarización.' }
  ];
  var EFFECTS = ['Despolarización de las fibras nerviosas periféricas sensitivas y motoras, sobre todo las A-beta, mielinizadas y de mayor tamaño',
    'Analgésico: estimulación de fibras A-beta (compuerta)', 'Antiinflamatorio: incremento de la microcirculación', 'Regenerativo: activa la regeneración tisular',
    'Antiedematoso: reabsorción de líquidos', 'Contracción de fibras musculares normales o parcialmente inervadas', 'Transforma la energía eléctrica en térmica (efecto Joule)'];
  var TYPES = [
    { nombre: 'Bipolar', texto: 'Dos electrodos; útil para zonas pequeñas.' },
    { nombre: 'Tetrapolar (estático o dinámico)', texto: 'Cuatro electrodos cruzados; útil para zonas amplias. El espectro (barrido de la AMF) evita la acomodación de los nervios.' }
  ];
  var INDICATIONS = ['Contracturas musculares', 'Procesos reumatológicos', 'Contusiones', 'Esguinces y luxaciones', 'Bursitis y tendinopatías', 'Atrofia muscular', 'Neuralgias'];
  var NOTES = [
    'Corriente variable e interrumpida, alterna con modulaciones sinusoidales, de mediana frecuencia (1 000 a 100 000 Hz).',
    'Menor resistencia de la piel: entra con facilidad y llega a 3–5 cm; si se aumenta mucho la profundidad, disminuyen sus efectos fisiológicos.',
    'Dos corrientes alternas que interactúan: una fija de 4 000 Hz y otra ajustable de 4 001 a 4 250 Hz; la diferencia es la frecuencia de modulación de la amplitud (AMF).',
    'Dosis: mitis (sensación mínima), obvia (sensación normal) y fortis (apenas tolerable). Duración de 10 a 15 min.'
  ];

  var CONDITIONS = E.GENERAL_CONDITIONS;

  var CASES = [
    { id: 'esguince-agudo', titulo: 'Esguince agudo de tobillo',
      texto: 'Hombre de 26 años con esguince de tobillo de 2 días, dolor agudo y edema. Sin contraindicaciones. Se aplicará interferencial tetrapolar. ¿Es apto, con qué AMF (Hz), qué dosis y cuántos minutos?',
      spec: { apto: { any: ['si'] }, amfHz: { min: 100, max: 160 }, dose: { any: ['mitis'] }, minutes: { min: 10, max: 15 } },
      respuesta: 'Apto. Dolor agudo: AMF de 100 a 160 Hz, dosis baja (mitis) y poco tiempo (10 a 15 min); la sensación debe ser mínima.' },
    { id: 'lumbalgia-cronica', titulo: 'Lumbalgia crónica',
      texto: 'Mujer de 50 años con lumbalgia crónica desde hace un año. Sin contraindicaciones. Se aplicará interferencial tetrapolar. ¿Es apta, con qué AMF (Hz), qué dosis y cuántos minutos?',
      spec: { apto: { any: ['si'] }, amfHz: { min: 50, max: 100 }, dose: { any: ['obvia', 'fortis'] }, minutes: { min: 10, max: 15 } },
      respuesta: 'Apta. Dolor crónico y subagudo: AMF de 50 a 100 Hz, sensación normal (obvia) a apenas tolerable (fortis), 10 a 15 min, con mayor tiempo que en la fase aguda.' },
    { id: 'marcapasos', titulo: 'Contractura con marcapasos',
      texto: 'Hombre de 74 años con contractura cervical, portador de marcapasos. Se propone interferencial por ser de mediana frecuencia. ¿Es apto?',
      spec: { apto: { any: ['no'] } },
      respuesta: 'No. El marcapasos es una contraindicación (relativa según la zona) y la zona cervical se acerca al seno carotídeo.' }
  ];

  return { CARRIER_HZ: CARRIER_HZ, secondFreq: secondFreq, amfFromFreqs: amfFromFreqs, objectivesForAmf: objectivesForAmf, evaluateIF: evaluateIF,
    PHYSICS: PHYSICS, EFFECTS: EFFECTS, TYPES: TYPES, INDICATIONS: INDICATIONS, NOTES: NOTES, CONDITIONS: CONDITIONS, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = InterferencialCore;
