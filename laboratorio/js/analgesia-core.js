/* Núcleo de "¿Cómo quita el dolor la corriente?". Datos: Clase 6 y Clase 8 (compuerta, endorfinas, intensidades). */
var AnalgesiaCore = (function () {
  var FIBERS = {
    Abeta: { nombre: 'Aβ', vMS: [50, 70] },
    Adelta: { nombre: 'Aδ', vMS: [20, 25] },
    C: { nombre: 'C', vMS: [1, 2] }
  };
  var LEVELS = ['sin-corriente', 'debil', 'intensa', 'muy-intensa'];
  var LEVEL_LABELS = { 'sin-corriente': 'Sin corriente', debil: 'Débil (hormigueo)', intensa: 'Intensa', 'muy-intensa': 'Muy intensa' };

  function activeFibers(level) {
    if (level === 'sin-corriente') return [];
    if (level === 'debil') return ['Abeta'];
    if (level === 'intensa') return ['Abeta', 'Adelta'];
    if (level === 'muy-intensa') return ['Abeta', 'Adelta', 'C'];
    throw new Error('nivel desconocido: ' + level);
  }

  function modeFor(hz) {
    if (hz >= 80 && hz <= 120) return 'convencional';
    if (hz >= 1 && hz <= 20) return 'acupuntura';
    return null;
  }

  function gateState(level, hz) {
    if (modeFor(hz) !== 'convencional') return 'abierta';
    if (level === 'debil') return 'cerrada';
    if (level === 'intensa') return 'parcial';
    return 'abierta';
  }

  function endorphins(hz, level) { return modeFor(hz) === 'acupuntura' && level !== 'sin-corriente'; }

  function painPerceived(level, hz) {
    if (level === 'sin-corriente' || level === 'muy-intensa') return 'alto';
    if (level === 'intensa') return 'medio';
    return modeFor(hz) === null ? 'medio' : 'bajo';
  }

  function onset(mode) {
    if (mode === 'convencional') return { inicio: '2 a 5 min', duracion: 'hasta 1 h' };
    if (mode === 'acupuntura') return { inicio: '30 a 120 min', duracion: '6 a 7 h' };
    return null;
  }

  function warning(level) {
    if (level === 'intensa') return 'Se activan también fibras Aδ: dolor agudo que dura poco.';
    if (level === 'muy-intensa') return 'Se activan fibras C: dolor intenso y difuso. Baje la intensidad.';
    return null;
  }

  var MID = { Abeta: 60, Adelta: 22.5, C: 1.5 };
  function animDuration(fiber, cDurationMs) { return cDurationMs * MID.C / MID[fiber]; }

  var STEPS = [
    { id: 'dolor', titulo: 'Dolor sin corriente',
      texto: 'Una lesión activa los nociceptores. Las fibras C (1–2 m/s) y Aδ (20–25 m/s) llevan la señal al asta posterior de la médula, a la célula de transmisión (T), y de allí al cerebro: se percibe dolor.',
      estado: { corriente: false, nivel: 'sin-corriente', hz: 100, compuerta: 'abierta', endorfinas: false, dolor: 'alto' } },
    { id: 'entra', titulo: 'Entra la corriente',
      texto: 'Los electrodos envían pulsos eléctricos a través de la piel. Con intensidad débil (hormigueo) la corriente despolariza solo las fibras Aβ y Aα, las más gruesas y mielinizadas.',
      estado: { corriente: true, nivel: 'debil', hz: 100, compuerta: 'abierta', endorfinas: false, dolor: 'alto' } },
    { id: 'abeta', titulo: 'Las fibras Aβ llegan primero',
      texto: 'Las fibras Aβ conducen a 50–70 m/s, mucho más rápido que las Aδ y las C. Su señal llega a la médula antes que la señal del dolor.',
      estado: { corriente: true, nivel: 'debil', hz: 100, compuerta: 'abierta', endorfinas: false, dolor: 'alto' } },
    { id: 'compuerta', titulo: 'La compuerta se cierra',
      texto: 'Las Aβ activan una interneurona inhibitoria de la sustancia gelatinosa que frena a la célula T: la compuerta se cierra y pasa menos señal de dolor al cerebro. La analgesia aparece a los 2–5 min y puede durar hasta 1 h.',
      estado: { corriente: true, nivel: 'debil', hz: 100, compuerta: 'cerrada', endorfinas: false, dolor: 'bajo' } },
    { id: 'endorfinas', titulo: 'Con baja frecuencia: endorfinas',
      texto: 'Con frecuencias muy bajas (1–2 Hz en la clase; 1–20 Hz en el TENS tipo acupuntura) el estímulo hace que el cuerpo libere endorfinas y encefalinas, que bloquean la sustancia P. El efecto es lento (30–120 min) y largo (6–7 h).',
      estado: { corriente: true, nivel: 'debil', hz: 2, compuerta: 'abierta', endorfinas: true, dolor: 'bajo' } }
  ];

  var OPTIONS = [
    ['a', 'Se activaron también las fibras Aδ y C'],
    ['b', 'Conviene baja frecuencia (1–20 Hz)'],
    ['c', 'Las fibras Aβ son más rápidas y activan la célula que cierra la compuerta'],
    ['d', 'Se agotaron las endorfinas']
  ];
  var CASES = [
    { id: 'sube-intensidad', titulo: 'Subí la intensidad y duele más',
      texto: 'Una paciente con dolor lumbar recibe TENS convencional y al principio siente un hormigueo agradable. Al subir mucho la intensidad dice que ahora siente un dolor agudo y luego un dolor difuso. ¿Qué explica el cambio?',
      spec: { resp: { any: ['a'] } },
      respuesta: 'Con intensidad débil solo se activan las Aβ. Al subirla se activan las Aδ (dolor agudo que dura poco) y luego las C (dolor intenso y difuso): se pierde la analgesia. Hay que quedarse en la sensación de hormigueo.' },
    { id: 'efecto-prolongado', titulo: 'Necesita analgesia de varias horas',
      texto: 'Un paciente con dolor crónico necesita un efecto analgésico que dure varias horas, aunque tarde en aparecer. ¿Qué conviene?',
      spec: { resp: { any: ['b'] } },
      respuesta: 'La baja frecuencia (1–20 Hz, TENS tipo acupuntura) libera endorfinas y encefalinas: el efecto tarda 30–120 min pero dura 6–7 h. La alta frecuencia actúa por la compuerta, rápido (2–5 min) y por menos tiempo.' },
    { id: 'por-que-compuerta', titulo: '¿Por qué un hormigueo quita el dolor?',
      texto: 'Un alumno pregunta por qué un hormigueo suave disminuye el dolor de una zona lesionada. ¿Cuál es la explicación?',
      spec: { resp: { any: ['c'] } },
      respuesta: 'Las fibras Aβ conducen a 50–70 m/s y llegan primero a la médula; activan una interneurona inhibitoria que frena a la célula T. La compuerta se cierra y pasa menos señal de las fibras C y Aδ.' }
  ];

  return { FIBERS: FIBERS, LEVELS: LEVELS, LEVEL_LABELS: LEVEL_LABELS, activeFibers: activeFibers, modeFor: modeFor, gateState: gateState, endorphins: endorphins,
    painPerceived: painPerceived, onset: onset, warning: warning, animDuration: animDuration, STEPS: STEPS, OPTIONS: OPTIONS, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = AnalgesiaCore;
