/* Núcleo de corriente galvánica y Trabert. Datos: Clase 6 y práctica 6 (galvánica y Trabert). */
var GalvanicaCore = (function () {
  var E = (typeof ElectroCore !== 'undefined') ? ElectroCore : require('./electro-core.js');

  function galvanicRange(areaCm2) { return { minMA: 0.1 * areaCm2, maxMA: 0.2 * areaCm2 }; }

  function evaluateGalvanic(p) {
    var r = galvanicRange(p.areaCm2), m = [], v = 'ok';
    if (p.mA > r.maxMA + 1e-9) { v = 'riesgo'; m.push('Por encima de 0,2 mA/cm²: riesgo de quemadura química.'); }
    else if (p.mA < r.minMA - 1e-9) { v = 'ajustar'; m.push('Por debajo de 0,1 mA/cm²: dosis insuficiente.'); }
    if (p.minutes < 15 || p.minutes > 20) { if (v === 'ok') v = 'ajustar'; m.push('La aplicación dura de 15 a 20 min (sesiones diarias, hasta 20).'); }
    if (v === 'ok') m.push('Densidad de corriente adecuada: entre ' + r.minMA.toFixed(1).replace('.', ',') + ' y ' + r.maxMA.toFixed(1).replace('.', ',') + ' mA para este electrodo.');
    return { veredicto: v, mensajes: m };
  }

  function polarEffect(pole) {
    if (pole === 'catodo') return { polaridad: 'Negativo (cátodo, rojo)', reaccion: 'Reacción alcalina', atrae: 'Atrae cationes (iones positivos) y repele aniones' };
    if (pole === 'anodo') return { polaridad: 'Positivo (ánodo, negro)', reaccion: 'Reacción ácida', atrae: 'Atrae aniones (iones negativos) y repele cationes' };
    throw new Error('polo desconocido: ' + pole);
  }

  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  var NEG = ['lidocaina', 'novocaina', 'xilocaina'], POS = ['piroxicam', 'ibuprofeno', 'diclofenaco'];
  function drugPole(drug) {
    var d = norm(drug);
    if (NEG.indexOf(d) > -1) return 'catodo';
    if (POS.indexOf(d) > -1) return 'anodo';
    return null;
  }

  function trabertFreq(pulseMs, pauseMs) { return E.freqFromPulsePause(pulseMs, pauseMs); }

  function evaluateTrabert(p) {
    var m = [], v = 'ok';
    if (p.mA > 10) { v = 'riesgo'; m.push('Más de 10 mA: riesgo de quemadura y de dolor intenso; reduzca la intensidad.'); }
    if (p.pulseMs > 10) { if (v === 'ok') v = 'ajustar'; m.push('El pulso no debe pasar de 10 ms (límite del pulso farádico).'); }
    if (p.minutes !== 10) { if (v === 'ok') v = 'ajustar'; m.push('La aplicación dura 10 min.'); }
    if (p.inverted === false && p.minutes === 10) m.push('Si el dolor es difuso, hay que invertir la polaridad a los 5 min.');
    m.push('Frecuencia resultante: ' + Math.round(trabertFreq(p.pulseMs, p.pauseMs)) + ' Hz. Al acomodarse el paciente (hacia los 5 min) reajuste la intensidad.');
    return { veredicto: v, mensajes: m };
  }

  var CONDITIONS = E.GENERAL_CONDITIONS.concat([
    { id: 'alergia-farmaco', label: 'Alergia o sensibilidad al fármaco (solo iontoforesis)', nivel: 'contra', por: 'el fármaco penetra por la piel y puede provocar una reacción' }
  ]);

  var INDICATIONS = ['Lesiones inflamatorias locales', 'Neuralgia postherpética', 'Dolores crónicos', 'Anestésico local (iontoforesis)',
    'Miositis osificante traumática', 'Neuropatías periféricas por atrapamiento'];

  var CASES = [
    { id: 'galv-codo', titulo: 'Tendinitis crónica de codo (galvánica)',
      texto: 'Mujer de 45 años con dolor crónico en el codo por una tendinitis. Piel íntegra, sensibilidad normal, sin marcapasos ni embarazo. Se usará corriente galvánica con un electrodo de carbono de 6 × 8 cm sobre algodón mojado. ¿Es apta, qué corriente aplica, cuántos mA y cuántos minutos?',
      spec: { apto: { any: ['si'] }, current: { any: ['galvanica'] }, mA: { min: 4.8, max: 9.6 }, minutes: { min: 15, max: 20 } },
      respuesta: 'Apta (dolores crónicos). Galvánica con 0,1 a 0,2 mA/cm²: el electrodo de 48 cm² admite de 4,8 a 9,6 mA, durante 15 a 20 min, sesiones diarias hasta 20.' },
    { id: 'trabert-lumbar', titulo: 'Lumbalgia difusa (Trabert)',
      texto: 'Hombre de 52 años con dolor lumbar difuso paravertebral desde hace 2 semanas. Sin contraindicaciones. Se plantea Trabert con técnica bipolar paravertebral. ¿Es apto, qué corriente aplica, hasta cuántos mA y cuántos minutos?',
      spec: { apto: { any: ['si'] }, current: { any: ['trabert'] }, mA: { max: 10 }, minutes: { min: 10, max: 10 } },
      respuesta: 'Apto. Trabert (pulso de 2 ms, pausa de 5 ms, unos 143 Hz), cátodo en la zona de dolor, hasta 10 mA, 10 min, con inversión de la polaridad a los 5 min por ser un dolor difuso.' },
    { id: 'tromboflebitis', titulo: 'Dolor de pantorrilla con tromboflebitis',
      texto: 'Mujer de 60 años con dolor en la pantorrilla derecha. Tiene una tromboflebitis en esa zona confirmada por su médico. Se propone Trabert. ¿Es apta?',
      spec: { apto: { any: ['no'] } },
      respuesta: 'No. Las zonas de tromboflebitis son una contraindicación: el estímulo eléctrico y la vasodilatación empeoran la zona y hay riesgo de desprender un trombo.' }
  ];

  return { galvanicRange: galvanicRange, evaluateGalvanic: evaluateGalvanic, polarEffect: polarEffect, drugPole: drugPole, trabertFreq: trabertFreq,
    evaluateTrabert: evaluateTrabert, CONDITIONS: CONDITIONS, INDICATIONS: INDICATIONS, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = GalvanicaCore;
