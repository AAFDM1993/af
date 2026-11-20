/* Núcleo de microcorrientes (MES). Datos: Clase 7. */
var MicroCore = (function () {
  var E = (typeof ElectroCore !== 'undefined') ? ElectroCore : require('./electro-core.js');

  function evaluateMicro(p) {
    var m = [], v = 'ok';
    if (!(p.pulseUs >= 1 && p.pulseUs <= 500)) { v = 'ajustar'; m.push('Ancho de pulso de 1 a 500 microsegundos.'); }
    if (!(p.hz >= 0 && p.hz <= 1000)) { v = 'ajustar'; m.push('Frecuencia de 0 a 1 000 Hz.'); }
    if (p.objective === 'ulcera') {
      if (p.minutes !== 120) { v = 'ajustar'; m.push('Úlceras: 2 horas, 2 veces al día.'); }
    } else if (p.minutes < 10 || p.minutes > 20) { v = 'ajustar'; m.push('De 10 a 20 min según la patología.'); }
    if (v === 'ok') m.push('Parámetros adecuados. La aplicación es subsensorial: el paciente casi no percibe la corriente y no hay riesgo de lesión.');
    return { veredicto: v, mensajes: m };
  }

  var EFFECTS = ['Regeneración de los tejidos y de las heridas', 'Aumento de la síntesis de proteínas', 'Incrementa el ATP mitocondrial hasta un 500 %',
    'Estimula el sistema nervioso autónomo (flujo simpático)', 'Empleado en el insomnio', 'Vasodilatación'];
  var INDICATIONS = ['Tratamiento del dolor', 'Drenaje linfático y edema', 'Regeneración de tejidos contráctiles', 'Liberación de adherencias y cicatrices retráctiles',
    'Tendinitis', 'Lesión de nervios periféricos', 'Aumenta la circulación y la producción de colágeno', 'Puntos gatillo', 'Disminuye los espasmos musculares',
    'Hipotrofia muscular (estimula los procesos metabólicos)', 'Cicatrización, úlceras y heridas', 'Desensibilización de los tejidos previa a la movilización'];
  var NOTES = [
    'Las células producen corrientes de este tipo al intercambiar iones con su medio.',
    'Estimulación pulsada dosificada en microamperios: carga insuficiente para excitar las fibras nerviosas periféricas, por eso es subsensorial.',
    'Sin efecto galvánico, de pulso corto y poca carga bajo la piel; tolera más intensidad. Monofásica positiva o negativa (se invierte la polaridad) o bifásica rectangular.',
    'Electrodos sobre la zona a tratar o un aplicador para zonas pequeñas. Aplicación coplanar.',
    'La clase da la intensidad en miliamperios en dos láminas y en microamperios en otras: el módulo usa microamperios y no rotula una cifra.'
  ];

  var CONDITIONS = E.GENERAL_CONDITIONS;

  var CASES = [
    { id: 'ulcera', titulo: 'Úlcera por presión',
      texto: 'Hombre de 75 años con una úlcera por presión sacra en cicatrización, sin infección activa ni otras contraindicaciones de la lista. Se aplicará microcorriente con el objetivo de la cicatrización. ¿Es apto y cuántos minutos por sesión?',
      spec: { apto: { any: ['si'] }, minutes: { min: 120, max: 120 } },
      respuesta: 'Apto (cicatrización, úlceras y heridas). Úlceras: 2 horas por aplicación, 2 veces al día, con aplicación subsensorial.' },
    { id: 'marcapasos', titulo: 'Tendinitis con marcapasos',
      texto: 'Mujer de 66 años con tendinitis del hombro, portadora de marcapasos. Se plantea microcorriente por ser subsensorial. ¿Es apta?',
      spec: { apto: { any: ['no'] } },
      respuesta: 'No. El marcapasos es una contraindicación aun con corrientes subsensoriales (relativa según la zona): la corriente puede interferir con el dispositivo.' }
  ];

  return { evaluateMicro: evaluateMicro, EFFECTS: EFFECTS, INDICATIONS: INDICATIONS, NOTES: NOTES, CONDITIONS: CONDITIONS, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = MicroCore;
