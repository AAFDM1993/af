/* Núcleo de corrientes diadinámicas. Datos: Clase 7. */
var DiadCore = (function () {
  var E = (typeof ElectroCore !== 'undefined') ? ElectroCore : require('./electro-core.js');

  var CURRENTS = [
    { id: 'MF', nombre: 'Monofásica fija (MF)', pulseMs: 10, pauseMs: 10, hz: 50, efecto: 'Estimulante, regenerador celular, trófico; aumenta la circulación',
      sensacion: 'Fuerte y penetrante; es difícil producir analgesia', indicacion: 'Miogelosis y fortalecimiento del tejido conjuntivo' },
    { id: 'DF', nombre: 'Difásica fija (DF)', pulseMs: 10, pauseMs: 0, hz: 100, efecto: 'Analgesia y vasodilatación',
      sensacion: 'Cosquilleo; hay efecto de acomodación y aparece el acostumbramiento', indicacion: 'Cadena simpática (C5–D7 / D10–L5) y sobre la circulación' },
    { id: 'CP', nombre: 'Modulada en corto período (CP)', pulseMs: 10, pauseMs: 10, hz: 50, efecto: 'Analgésico y vasodilatador',
      sensacion: 'MF: fuerte vibración; DF: suave temblor', indicacion: 'Reabsorción de edemas y celulitis; vasotrófica en trastornos circulatorios (5 min)' },
    { id: 'LP', nombre: 'Modulada en largo período (LP)', pulseMs: 10, pauseMs: 10, hz: 50, efecto: 'Efecto circulante; aumenta la permeabilidad celular; actúa sobre la sensibilidad cutánea',
      sensacion: 'La fase dura 6, 8 o 10 s; la MF base se alterna con DF sobrepuesta, lo que evita la acomodación', indicacion: 'Mialgias y lumbociatalgias' },
    { id: 'RS', nombre: 'Ritmo sincopado (RS)', pulseMs: 10, pauseMs: 10, hz: 50, efecto: 'Trófico, estimulante y fortalecedor en músculos denervados',
      sensacion: '1 s de MF y 1 s de pausa (evita la fatiga y mejora la recuperación muscular)', indicacion: 'Hipotrofias musculares y potenciación de músculos normales' }
  ];

  var OBJECTIVE = { miogelosis: 'MF', 'cadena-simpatica': 'DF', mialgia: 'LP', edema: 'CP', hipotrofia: 'RS' };
  function suggestCurrent(objective) {
    if (!Object.prototype.hasOwnProperty.call(OBJECTIVE, objective)) throw new Error('objetivo desconocido: ' + objective);
    return OBJECTIVE[objective];
  }

  function evaluateDiad(p) {
    var m = [], v = 'ok';
    if (p.baseMin < 3 || p.baseMin > 5) { v = 'ajustar'; m.push('Inicie siempre con una base DF de 3 a 5 min para desensibilizar.'); }
    if (p.sessions > 20) { v = 'ajustar'; m.push('En general máximo 20 sesiones y luego descanso; la clase recomienda 12 a 15.'); }
    else if (p.sessions > 15) m.push('Más de 15 sesiones: la clase recomienda 12 a 15 (máximo general 20).');
    var ph = { aguda: 'Fase aguda: sesiones diarias.', subaguda: 'Fase subaguda: sesiones diarias o interdiarias, según la disminución de los síntomas.', cronica: 'Fase crónica: 2 o 3 veces por semana.' }[p.phase];
    if (ph) m.push(ph);
    if (v === 'ok') m.push('Base y número de sesiones adecuados. Parta de una base galvánica previa de 2–3 mA y suba la intensidad.');
    return { veredicto: v, mensajes: m };
  }

  var TECHNIQUES = [
    { id: 'punto', nombre: 'Punto doloroso (monopolar)', como: 'Electrodo negativo más pequeño, activo, sobre el punto doloroso o el punto motor; el positivo a 2–3 cm.', invierte: false },
    { id: 'tronco', nombre: 'Tronco nervioso', como: 'Positivo sobre la raíz nerviosa (proximal); negativo distal, donde el nervio se hace superficial.', invierte: false },
    { id: 'paravertebral', nombre: 'Paravertebral (bipolar)', como: 'Electrodos a ambos lados de la columna cerrando la zona de dolor entre ellos.', invierte: true },
    { id: 'vasotrofica', nombre: 'Vasotrófica', como: 'Electrodos grandes, positivo proximal y negativo distal, longitudinal al vaso afectado, en CP por 5 min.', invierte: false },
    { id: 'transregional', nombre: 'Transregional o transversal', como: 'Electrodos grandes sobre las articulaciones: interna-externa o anterior-posterior.', invierte: true }
  ];
  var COMBINED = [
    { id: 'df-cp', nombre: 'DF 1 min + CP 5 min', indicacion: 'Enfermedades crónicas degenerativas: coxartrosis, gonartrosis' },
    { id: 'df-lp', nombre: 'DF 2 min + LP 4 min', indicacion: 'Mialgias' }
  ];

  var CONDITIONS = E.GENERAL_CONDITIONS;

  var CASES = [
    { id: 'lumbociatalgia', titulo: 'Lumbociatalgia con mialgia',
      texto: 'Mujer de 40 años con lumbociatalgia y mialgia de la musculatura paravertebral en fase subaguda. Sin contraindicaciones. ¿Es apta, qué corriente elige y cuántos minutos de base DF aplica al inicio?',
      spec: { apto: { any: ['si'] }, current: { any: ['LP'] }, baseMin: { min: 3, max: 5 } },
      respuesta: 'Apta. Mialgias y lumbociatalgias: LP (modulada en largo período). Se inicia con base DF de 3 a 5 min; combinada, DF 2 min + LP 4 min. Sesiones diarias o interdiarias en la fase subaguda.' },
    { id: 'hipotrofia', titulo: 'Hipotrofia por inmovilización',
      texto: 'Hombre de 35 años, retirada de yeso del miembro inferior hace una semana, con hipotrofia del cuádriceps. Piel íntegra, sensibilidad normal, sin contraindicaciones. ¿Es apto, qué corriente elige y cuántos minutos de base DF aplica?',
      spec: { apto: { any: ['si'] }, current: { any: ['RS'] }, baseMin: { min: 3, max: 5 } },
      respuesta: 'Apto. Hipotrofias musculares: ritmo sincopado (1 s de MF y 1 s de pausa), efecto trófico y fortalecedor. Base DF de 3 a 5 min al inicio.' },
    { id: 'marcapasos', titulo: 'Dolor de hombro con marcapasos',
      texto: 'Hombre de 68 años con dolor de hombro, portador de marcapasos desde hace 3 años. Se plantean diadinámicas sobre el hombro. ¿Es apto?',
      spec: { apto: { any: ['no'] } },
      respuesta: 'No. El marcapasos es una contraindicación (relativa según la zona): la corriente puede interferir con el dispositivo.' }
  ];

  return { CURRENTS: CURRENTS, suggestCurrent: suggestCurrent, evaluateDiad: evaluateDiad, TECHNIQUES: TECHNIQUES, COMBINED: COMBINED, CONDITIONS: CONDITIONS, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = DiadCore;
