/* Núcleo de TENS. Datos: Clase 8 (tablas de las diapositivas 12 y 13 como referencia principal). */
var TensCore = (function () {
  var E = (typeof ElectroCore !== 'undefined') ? ElectroCore : require('./electro-core.js');

  var MODES = [
    { id: 'convencional', nombre: 'Convencional (alta frecuencia, sensorial)', hz: [80, 120], pulse: { min: 0, max: 150, maxExcl: true }, pulseTxt: 'menos de 150 µs', minutos: [15, 30],
      intensidad: 'Sensorial (hormigueo), submotora', modulacion: 'Teoría de la compuerta', inicio: 'Rápido (menos de 30 min)', duracionEfecto: 'Corto (30 min a 2 h)', usos: 'Dolor agudo. Sesiones de 15–30 min, 1 o 2 veces al día.' },
    { id: 'acupuntura', nombre: 'Acupuntura (baja frecuencia, motor)', hz: [1, 20], pulse: { min: 200, minExcl: true, max: Infinity }, pulseTxt: 'más de 200 µs', minutos: [30, 30],
      intensidad: 'Sensorial con contracciones musculares rítmicas', modulacion: 'Supraespinal (betaendorfinas y encefalinas)', inicio: 'Lento (30–120 min)', duracionEfecto: 'Larga (6–7 h)', usos: 'Dolor crónico, fortalecimiento y radiculopatías.' },
    { id: 'breve', nombre: 'Breve e intenso', hz: [80, 120], pulse: { min: 150, minExcl: true, max: Infinity }, pulseTxt: 'más de 150 µs', minutos: [15, 15],
      intensidad: 'Sensorial con contracciones no rítmicas', modulacion: 'Supraespinal (betaendorfinas y encefalinas)', inicio: 'Rápido (menos de 30 min)', duracionEfecto: 'Larga', usos: 'Procedimiento doloroso.' },
    { id: 'burst', nombre: 'Burst (ráfagas)', hz: [50, 100], pulse: { min: 100, max: 200 }, pulseTxt: '100–200 µs', minutos: [20, 30],
      intensidad: 'Sensorial con contracciones musculares rítmicas fuertes', modulacion: 'Supraespinal (betaendorfinas y encefalinas)', inicio: 'Lento (30–120 min)', duracionEfecto: 'Larga (6–7 h)', usos: 'Dolor neuromuscular crónico.' }
  ];

  var OBJ = { agudo: 'convencional', cronico: 'acupuntura', doloroso: 'breve', neuromuscular: 'burst' };
  function modeForObjective(o) {
    if (!Object.prototype.hasOwnProperty.call(OBJ, o)) throw new Error('objetivo desconocido: ' + o);
    return OBJ[o];
  }

  function pulseOk(r, v) {
    var lo = r.min === undefined ? 0 : r.min, hi = r.max === undefined ? Infinity : r.max;
    return (r.minExcl ? v > lo : v >= lo) && (r.maxExcl ? v < hi : v <= hi);
  }
  function evaluateTens(p) {
    var md = MODES.filter(function (x) { return x.id === p.mode; })[0];
    if (!md) throw new Error('modo desconocido: ' + p.mode);
    var m = [], v = 'ok';
    if (p.hz < md.hz[0] || p.hz > md.hz[1]) { v = 'ajustar'; m.push('Frecuencia de ' + md.hz[0] + ' a ' + md.hz[1] + ' Hz para este modo.'); }
    if (!pulseOk(md.pulse, p.pulseUs)) { v = 'ajustar'; m.push('Duración de pulso: ' + md.pulseTxt + '.'); }
    if (p.minutes < md.minutos[0] || p.minutes > md.minutos[1]) { v = 'ajustar'; m.push('Tiempo de tratamiento: ' + (md.minutos[0] === md.minutos[1] ? md.minutos[0] : md.minutos[0] + ' a ' + md.minutos[1]) + ' min.'); }
    if (v === 'ok') m.push('Parámetros adecuados. ' + md.intensidad + '. Efecto: ' + md.inicio.toLowerCase() + ' y ' + md.duracionEfecto.toLowerCase() + '.');
    return { veredicto: v, mensajes: m };
  }

  function conductionTimeMs(distanceM, vMS) { return vMS > 0 ? distanceM / vMS * 1000 : null; }
  var FIBERS = { C: [1, 2], Adelta: [20, 25], Abeta: [50, 70] };

  var TYPES = [
    { nombre: 'Monofásico', texto: 'Onda rectangular con componente galvánico; se debe alternar entre + y −. Útil para estimular músculos denervados.' },
    { nombre: 'Bifásico asimétrico', texto: 'Sin efecto galvánico; prevalece el estímulo positivo y no hay acomodación. Útil en estimulación y fortalecimiento.' },
    { nombre: 'Bifásico simétrico', texto: 'Sin efecto galvánico y sin prevalencia entre electrodos; existe efecto de acomodación. Útil para lograr analgesia.' }
  ];
  var PLACEMENTS = [
    { nombre: 'Arriba – abajo', texto: 'Coplanar bipolar.' },
    { nombre: 'Delante – atrás', texto: 'Contraplanar bipolar.' },
    { nombre: 'Paralelos', texto: 'Coplanar bipolar.' },
    { nombre: 'Cruzada', texto: 'Coplanar tetrapolar.' }
  ];
  var TECHNIQUES = [
    'Cátodo por encima del dolor y ánodo cerrando el circuito, hacia donde irradia el dolor (convencional).',
    'Técnica del dermatoma: analgesia refleja previa de 2 a 3 min en las raíces nerviosas relacionadas con el punto de dolor; luego se trata la zona local.',
    'Técnica de trayecto del nervio: 4 electrodos siguiendo el recorrido del nervio.',
    'Hiperestesia (aumento doloroso de la sensibilidad) e hipoestesia (disminución): ajuste la intensidad con el paciente.'
  ];
  var OTHER_REFS = [
    'Diapositiva 11 (resumen): alta frecuencia 60–100 Hz y 60–100 µs; baja frecuencia 2–4 Hz y 150–250 µs; breve, pulso de 300–1 000 µs.',
    'Diapositiva 14 (convencional): 50–150 Hz, 20–40 µs, hasta 100 mA; analgesia a los 2–5 min, puede durar hasta 1 h.',
    'Diapositivas 16–17 (acupuntura): 1–4 Hz, 15–25 µs, más de 100 mA; analgesia desde los 15–20 min y luego dura horas.',
    'Diapositiva 19 (breve e intensa): 50–150 Hz, 50–150 µs, más de 100 mA; procesos agudos y puntos gatillo.',
    'Diapositiva 21 (alta frecuencia): más de 100 Hz, 30 µs o más, 100 mA, 10 min.'
  ];

  var CONDITIONS = E.GENERAL_CONDITIONS;

  var CASES = [
    { id: 'agudo', titulo: 'Dolor agudo cervical',
      texto: 'Mujer de 33 años con dolor cervical agudo desde ayer, sin contraindicaciones. Se busca analgesia rápida con la teoría de la compuerta. ¿Es apta, qué modo de TENS elige, a cuántos Hz y durante cuántos minutos?',
      spec: { apto: { any: ['si'] }, mode: { any: ['convencional'] }, hz: { min: 80, max: 120 }, minutes: { min: 15, max: 30 } },
      respuesta: 'Apta. TENS convencional (alta frecuencia, sensorial): 80–120 Hz, pulso menor de 150 µs, hormigueo sin contracción, 15–30 min, 1 o 2 veces al día; efecto rápido y corto.' },
    { id: 'cronico', titulo: 'Dolor crónico con radiculopatía',
      texto: 'Hombre de 55 años con dolor crónico lumbar y radiculopatía desde hace 6 meses, sin contraindicaciones. Se busca un efecto analgésico prolongado mediante endorfinas. ¿Es apto, qué modo de TENS elige, a cuántos Hz y durante cuántos minutos?',
      spec: { apto: { any: ['si'] }, mode: { any: ['acupuntura'] }, hz: { min: 1, max: 20 }, minutes: { min: 30, max: 30 } },
      respuesta: 'Apto. TENS tipo acupuntura (baja frecuencia): 1–20 Hz, pulso mayor de 200 µs, contracciones rítmicas con fondo parestésico, 30 min; analgesia lenta (30–120 min) y larga (6–7 h) por endorfinas.' },
    { id: 'marcapasos', titulo: 'Dolor de hombro con marcapasos',
      texto: 'Hombre de 72 años con hombro doloroso, portador de marcapasos. Se plantea TENS convencional. ¿Es apto?',
      spec: { apto: { any: ['no'] } },
      respuesta: 'No. El marcapasos es una contraindicación (relativa según la zona): se debe evitar o consultar antes.' }
  ];

  return { MODES: MODES, modeForObjective: modeForObjective, evaluateTens: evaluateTens, conductionTimeMs: conductionTimeMs, FIBERS: FIBERS, TYPES: TYPES,
    PLACEMENTS: PLACEMENTS, TECHNIQUES: TECHNIQUES, OTHER_REFS: OTHER_REFS, CONDITIONS: CONDITIONS, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = TensCore;
