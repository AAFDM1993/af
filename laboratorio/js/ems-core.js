/* Núcleo de EMS (estimulación eléctrica muscular). Datos: Clase 8 y tens-ems.pdf. */
var EmsCore = (function () {
  var E = (typeof ElectroCore !== 'undefined') ? ElectroCore : require('./electro-core.js');

  var RANGES = { tonica: [5, 20], fasica: [40, 80] };
  function fiberFromHz(hz) {
    var out = [];
    if (hz >= RANGES.tonica[0] && hz <= RANGES.tonica[1]) out.push('tonica');
    if (hz >= RANGES.fasica[0] && hz <= RANGES.fasica[1]) out.push('fasica');
    return out;
  }

  function evaluateEms(p) {
    var r = RANGES[p.fiber], m = [], v = 'ok';
    if (!r) throw new Error('fibra desconocida: ' + p.fiber);
    if (p.hz < r[0] || p.hz > r[1]) { v = 'ajustar'; m.push('Fibras ' + (p.fiber === 'tonica' ? 'tónicas' : 'fásicas') + ': ' + r[0] + ' a ' + r[1] + ' Hz.'); }
    if (p.pulseUs < 150 || p.pulseUs > 300) { v = 'ajustar'; m.push('Duración de pulso de 150 a 300 µs (rectangular).'); }
    if (p.minutes < 15 || p.minutes > 20) { v = 'ajustar'; m.push('De 15 a 20 min, según la fuerza muscular del paciente.'); }
    if (v === 'ok') m.push('Parámetros adecuados. Tenga en cuenta el periodo de recuperación entre ráfagas (fatiga o tetanización).');
    return { veredicto: v, mensajes: m };
  }

  var PROTOCOLS = [
    { nombre: 'Estimulación muscular', parametros: 'Efecto excitomotor en músculos no denervados para aumentar el trofismo. Dos canales sincronizados; considerar el tamaño del músculo y la cadena muscular. Tónicos 5–20 Hz; fásicos 40–80 Hz; respetar el periodo de recuperación entre ráfagas.' },
    { nombre: 'Electrostretching', parametros: 'Agonista (músculo acortado) y antagonista (normal). Burst: 5–15 Hz, 220–250 µs, intensidad hasta provocar el estiramiento. Modulada: 30–40 Hz, 220–250 µs.' },
    { nombre: 'Dolor crónico', parametros: 'Cátodo en el punto gatillo o la zona dolorosa; ánodo en la zona de menor dolor; electrodos a 5 cm como mínimo; 20 Hz, 200–400 µs, intensidad media sin incomodar, 10–15 min. Si aparece dolor, bajar la intensidad sin interrumpir. Si la evolución es mala: tronco nervioso, 100 Hz, 30–100 µs.' }
  ];
  var FORMS = [
    { nombre: 'Puntos motores', como: 'Electrodo pasivo en el origen y activo en el punto motor.' },
    { nombre: 'Radicular', como: 'Electrodo dispersivo sobre el tronco nervioso y cátodo en el músculo a estimular.' },
    { nombre: 'Vientres musculares', como: 'Electrodo positivo en la zona superior y negativo en la inferior.' },
    { nombre: 'Origen e inserción', como: 'Electrodo negro en el origen y rojo en la inserción.' }
  ];
  var EFFECTS = ['Despolarización selectiva de fibras motoras y descarga del potencial de acción', 'Efecto secundario: vasodilatación',
    'Prevención de la hipotrofia por desuso', 'Fortalecimiento muscular', 'Favorece la circulación sanguínea'];

  var CONDITIONS = E.GENERAL_CONDITIONS;

  var CASES = [
    { id: 'cuadriceps', titulo: 'Hipotrofia por desuso del cuádriceps',
      texto: 'Mujer de 40 años con hipotrofia del cuádriceps tras 4 semanas de inmovilización. Sin contraindicaciones. Se busca fortalecer un músculo de contracción rápida con EMS. ¿Es apta, sobre qué fibra trabaja, a cuántos Hz y durante cuántos minutos?',
      spec: { apto: { any: ['si'] }, fiber: { any: ['fasica'] }, hz: { min: 40, max: 80 }, minutes: { min: 15, max: 20 } },
      respuesta: 'Apta (prevención de hipotrofia por desuso). Fibras fásicas: 40–80 Hz, pulso rectangular de 150–300 µs, 15–20 min según su fuerza, con dos canales sincronizados.' },
    { id: 'postural', titulo: 'Fortalecimiento de un músculo postural',
      texto: 'Hombre de 45 años con debilidad de la musculatura paravertebral (postural, de contracción lenta). Sin contraindicaciones. ¿Es apto, sobre qué fibra trabaja, a cuántos Hz y durante cuántos minutos?',
      spec: { apto: { any: ['si'] }, fiber: { any: ['tonica'] }, hz: { min: 5, max: 20 }, minutes: { min: 15, max: 20 } },
      respuesta: 'Apto. Tejido muscular tónico: 5–20 Hz, pulso de 150–300 µs, 15–20 min, considerando el periodo de recuperación entre ráfagas.' },
    { id: 'marcapasos', titulo: 'Fortalecimiento con marcapasos',
      texto: 'Hombre de 70 años con debilidad de los muslos, portador de marcapasos. Se propone EMS. ¿Es apto?',
      spec: { apto: { any: ['no'] } },
      respuesta: 'No. El marcapasos es una contraindicación (relativa según la zona) y las cardiopatías también lo son.' }
  ];

  return { evaluateEms: evaluateEms, fiberFromHz: fiberFromHz, PROTOCOLS: PROTOCOLS, FORMS: FORMS, EFFECTS: EFFECTS, CONDITIONS: CONDITIONS, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = EmsCore;
