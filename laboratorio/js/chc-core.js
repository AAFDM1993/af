/* Núcleo de CHC (compresas húmedo-calientes). Datos: Clase 2, Termoterapia superficial. */
var CHCCore = (function () {
  var CONST = { tankMinC: 70, tankMaxC: 76, towels: 2, avgMin: 10, minEffectiveMin: 8, skinCheckSec: [30, 60], msPerDegree: 2 };

  function conductionGainMS(deltaC) { return CONST.msPerDegree * deltaC; }

  function evaluateSession(p) {
    var m = [], v = 'ok';
    if (p.towels < CONST.towels) {
      v = 'riesgo';
      m.push('Envuelva la compresa con 2 toallas en su totalidad: con menos capas puede quemar la piel.');
    } else if (p.minutes < CONST.minEffectiveMin) {
      v = 'insuficiente';
      m.push('La clase indica aplicar más de 8 minutos (promedio 10 min); con menos tiempo el efecto es insuficiente.');
    }
    if (p.skinChecked === false) m.push('Verifique el estado de la piel a los 30" – 1 min: eritema, sensibilidad y, si quema, seque la sudoración.');
    if (v === 'ok') m.push('Técnica adecuada: compresa escurrida, 2 toallas y ' + CONST.avgMin + ' min en promedio.');
    return { veredicto: v, mensajes: m };
  }

  var CONDITIONS = [
    { id: 'fiebre', label: 'Fiebre o estado agudo', nivel: 'contra', por: 'el calor agrava el cuadro agudo' },
    { id: 'infeccion', label: 'Infecciones', nivel: 'contra', por: 'el calor favorece la proliferación' },
    { id: 'piel-sensible', label: 'Piel sensible', nivel: 'contra', por: 'riesgo de quemadura' },
    { id: 'piel-alterada', label: 'Alteraciones en la piel', nivel: 'contra', por: 'riesgo de lesión y de infección' },
    { id: 'gestante', label: 'Gestantes', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'varices', label: 'Varices y tromboflebitis', nivel: 'contra', por: 'la vasodilatación empeora el cuadro venoso' },
    { id: 'tumor', label: 'Tumores', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'sensibilidad', label: 'Alteración de la sensibilidad', nivel: 'precaucion', por: 'el paciente puede no sentir que se quema; evalúe sensibilidad y revise la piel' },
    { id: 'edad-extrema', label: 'Niño o adulto mayor', nivel: 'precaucion', por: 'la edad, el sexo, la piel y la masa corporal modifican la tolerancia' }
  ];

  var INDICATIONS = ['Método preparatorio y de adaptación a otros tratamientos', 'Problemas de partes blandas', 'Lesiones deportivas', 'Problemas osteoarticulares', 'Algias en general', 'Postinmovilización'];

  var CASES = [
    { id: 'lumbalgia', titulo: 'Lumbalgia por contractura',
      texto: 'Mujer de 38 años, oficinista, con contractura de la musculatura paravertebral lumbar desde hace una semana. Sin fiebre, piel íntegra y sensibilidad conservada. Se aplicará una compresa húmeda caliente antes del ejercicio terapéutico. ¿Es apta y con qué técnica?',
      spec: { apto: { any: ['si'] }, towels: { min: 2, max: 2 }, minutes: { min: 8, max: 15 } },
      respuesta: 'Apta (partes blandas, método preparatorio). Compresa escurrida y envuelta en 2 toallas, unos 10 min (más de 8), revisando la piel a los 30"–1 min.' },
    { id: 'febril', titulo: 'Dolor cervical con fiebre',
      texto: 'Hombre de 45 años con dolor cervical desde hace 2 días y temperatura de 38,5 °C, malestar general. Pide "calor en el cuello". ¿Aplicaría una compresa húmeda caliente?',
      spec: { apto: { any: ['no'] } },
      respuesta: 'No. Fiebre y estado agudo son contraindicaciones de la clase: se difiere la termoterapia y se deriva para evaluación.' },
    { id: 'rodilla', titulo: 'Rigidez de rodilla tras inmovilización',
      texto: 'Mujer de 60 años, retirada del yeso de la pierna hace 3 días por una fractura consolidada. Rodilla rígida, piel íntegra, sin varices ni tromboflebitis. Se busca preparar el tejido para la movilización. ¿Es apta y con qué técnica?',
      spec: { apto: { any: ['si'] }, towels: { min: 2, max: 2 }, minutes: { min: 8, max: 15 } },
      respuesta: 'Apta (postinmovilización, preparación previa a otros tratamientos). 2 toallas, unos 10 min, controlando la piel a los 30"–1 min por la edad.' }
  ];

  return { CONST: CONST, conductionGainMS: conductionGainMS, evaluateSession: evaluateSession, CONDITIONS: CONDITIONS, INDICATIONS: INDICATIONS, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = CHCCore;
