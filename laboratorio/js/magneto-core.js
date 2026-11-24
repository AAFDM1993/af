/* Núcleo de magnetoterapia (baja frecuencia). Datos: clase de Magnetoterapia. Modelo de campo didáctico. */
var MagnetoCore = (function () {
  var GAUSS_PER_TESLA = 10000;
  var DEVICE = { hzMin: 1, hzMax: 100, gaussMin: 1, gaussMax: 100, gaussAbsMax: 200, penetrationCm: [5, 15] };
  var PEN_MAX_CM = 15;

  function gaussToTesla(g) { return g / GAUSS_PER_TESLA; }
  function teslaToGauss(t) { return t * GAUSS_PER_TESLA; }

  /* Solenoide: campo uniforme dentro de la bobina. Plano: pierde energía al ganar profundidad (modelo didáctico). */
  function fieldAtDepth(applicator, depthCm, surfaceGauss) {
    if (applicator !== 'solenoide' && applicator !== 'plano') throw new Error('aplicador desconocido: ' + applicator);
    var d = Math.min(Math.max(depthCm, 0), PEN_MAX_CM);
    if (applicator === 'solenoide') return surfaceGauss;
    var f = 1 - d / PEN_MAX_CM;
    return surfaceGauss * f * f;
  }

  var POLES = { N: 'miorrelajante', S: 'analgesico-antiinflamatorio' };
  function poleEffect(pole) {
    if (!Object.prototype.hasOwnProperty.call(POLES, pole)) throw new Error('polo desconocido: ' + pole);
    return POLES[pole];
  }

  function profileFor(hz) { return hz < 50 ? 'ataque' : (hz > 50 ? 'analgesico' : null); }
  var PROFILES = {
    ataque: { nombre: 'De ataque', hz: 'menos de 50 Hz', gauss: [40, 100], minutes: [20, 30], sesiones: 'una o dos veces por día', serie: '5 a 10 sesiones (traumas leves)',
      efecto: 'antiedematoso y de reparación tisular' },
    analgesico: { nombre: 'Analgésico y miorrelajante', hz: 'más de 50 Hz', gauss: [0, 40], minutes: [30, 60], sesiones: '3 veces por semana', serie: '2 o 3 series de 20 sesiones, con descanso de 2 semanas entre series',
      efecto: 'analgésico, miorrelajante y mejora del flujo vascular' }
  };

  function P(id, nombre, lo, hi, maxDevice, minutes, sesiones, perfil, aplicador, polo) {
    return { id: id, nombre: nombre, gauss: [lo, hi], maxDevice: maxDevice, minutes: minutes, sesiones: sesiones, perfil: perfil, aplicador: aplicador, polo: polo };
  }
  /* Tabla de la clase. «Máximo» = máximo del equipo (supuesto: 100–200 G). Perfil, aplicador y polo: criterio del módulo. */
  var PATHOLOGIES = [
    P('artropatias-agudas', 'Artropatías agudas', 40, 60, false, 20, 'diarias', 'ataque', 'solenoide', 'S'),
    P('artropatias-degenerativas', 'Artropatías degenerativas', 100, 200, true, 20, 'diarias', 'ataque', 'solenoide', 'S'),
    P('bursitis', 'Bursitis', 60, 80, false, 20, 'diarias', 'ataque', 'plano', 'S'),
    P('epicondilitis', 'Epicondilitis', 40, 60, false, 15, '2-dia', 'ataque', 'plano', 'S'),
    P('celulitis', 'Celulitis', 80, 200, false, 15, 'diarias', 'ataque', 'plano', 'S'),
    P('trasplantes', 'Trasplantes cutáneos', 20, 70, false, 20, 'diarias', 'ataque', 'plano', 'S'),
    P('retardo-consolidacion', 'Retardo de consolidación', 100, 200, true, 20, 'diarias', 'ataque', 'solenoide', 'S'),
    P('lesiones-nerviosas', 'Lesiones nerviosas', 40, 60, false, 15, '3-sem', 'ataque', 'solenoide', 'S'),
    P('osteoporosis', 'Osteoporosis', 60, 80, false, null, 'diarias', 'ataque', 'plano', 'S'),
    P('fracturas', 'Fracturas recientes', 30, 50, false, null, 'diarias', 'ataque', 'solenoide', 'S'),
    P('desgarros', 'Desgarros musculares', 40, 60, false, 20, '3-sem', 'ataque', 'solenoide', 'S'),
    P('psoriasis', 'Psoriasis', 20, 40, false, 20, '3-sem', 'analgesico', 'plano', 'S'),
    P('cefaleas', 'Cefaleas', 15, 20, false, 15, 'diarias', 'analgesico', 'plano', 'S'),
    P('raquialgias', 'Raquialgias', 20, 40, false, 15, 'diarias', 'analgesico', 'plano', 'N'),
    P('osteomielitis', 'Osteomielitis', 30, 60, false, 20, '2-dia', 'ataque', 'solenoide', 'S'),
    P('arteriopatias', 'Arteriopatías', 30, 70, false, 20, '3-sem', 'ataque', 'solenoide', 'S')
  ];
  var SESIONES_TXT = { 'diarias': 'diarias', '2-dia': '2 al día', '3-sem': '3 por semana' };
  var APLIC_TXT = { solenoide: 'solenoide', plano: 'plano' };

  function evaluateProtocol(p) {
    var path = PATHOLOGIES.filter(function (x) { return x.id === p.pathology; })[0];
    if (!path) return { veredicto: 'no', mensajes: ['Elija una patología de la tabla.'] };
    if (!(p.gauss >= DEVICE.gaussMin && p.gauss <= DEVICE.gaussAbsMax)) return { veredicto: 'no', mensajes: ['La intensidad debe estar entre ' + DEVICE.gaussMin + ' y ' + DEVICE.gaussAbsMax + ' G.'] };
    if (!(p.minutes > 0)) return { veredicto: 'no', mensajes: ['El tiempo debe ser mayor que 0 min.'] };
    var m = [], ajustar = false;
    if (p.gauss < path.gauss[0] || p.gauss > path.gauss[1]) { ajustar = true; m.push('Para ' + path.nombre.toLowerCase() + ' la clase indica ' + path.gauss[0] + '–' + path.gauss[1] + ' G' + (path.maxDevice ? ' (máximo del equipo)' : '') + '.'); }
    if (path.minutes !== null && Math.abs(p.minutes - path.minutes) > 5) { ajustar = true; m.push('La clase indica unos ' + path.minutes + ' min.'); }
    var prof = profileFor(p.hz);
    if (prof === null) { ajustar = true; m.push('Con 50 Hz no queda definido el perfil: use menos de 50 Hz (de ataque) o más de 50 Hz (analgésico).'); }
    else if (prof !== path.perfil) { ajustar = true; m.push('Esta patología se trata con el perfil ' + (path.perfil === 'ataque' ? 'de ataque (menos de 50 Hz)' : 'analgésico (más de 50 Hz)') + '.'); }
    if (p.pole !== path.polo) { ajustar = true; m.push('Polo ' + path.polo + ': ' + (path.polo === 'N' ? 'miorrelajante' : 'analgésico y antiinflamatorio') + '.'); }
    if (p.applicator !== path.aplicador) m.push('Aviso: lo habitual es el aplicador ' + APLIC_TXT[path.aplicador] + ' (criterio del módulo, la clase no lo especifica).');
    if (!ajustar) m.unshift('Protocolo adecuado según la clase. Sesiones: ' + SESIONES_TXT[path.sesiones] + '.');
    return { veredicto: ajustar ? 'ajustar' : 'ok', mensajes: m };
  }

  var CONDITIONS = [
    { id: 'marcapasos', label: 'Marcapasos', nivel: 'contra', por: 'el campo puede interferir con el dispositivo' },
    { id: 'embarazo', label: 'Embarazo', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'viral', label: 'Enfermedad viral', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'micosis', label: 'Micosis', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'hipotension', label: 'Hipotensión', nivel: 'contra', por: 'la clase la contraindica' },
    { id: 'hemorragia', label: 'Herida hemorrágica', nivel: 'contra', por: 'la vasodilatación puede aumentar el sangrado' },
    { id: 'tumor', label: 'Tumores', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'implante', label: 'Placas o implantes metálicos', nivel: 'precaucion', por: 'contraindicación relativa: evaluar la patología' },
    { id: 'objetos', label: 'Objetos metálicos personales', nivel: 'precaucion', por: 'retirarlos antes de aplicar' }
  ];

  var NOTES = [
    'Aplicación de campos magnéticos artificiales sobre la zona afectada, controlando la frecuencia o la intensidad.',
    'El campo se induce con corriente eléctrica (cables) o con imanes (imanterapia). Se mide en gauss o tesla: 1 T = 10 000 G.',
    'El solenoide da un campo uniforme y más profundo; el aplicador plano es más superficial y pierde energía al ganar profundidad. Penetración de 5 a 15 cm según el aplicador.',
    'Polo norte: miorrelajante. Polo sur: analgésico y antiinflamatorio. El magnetismo fluye de sur a norte.',
    'Parámetros: frecuencia de 1 a 100 Hz (algunos con 50 Hz fija), intensidad de 1 a 100 G (puede llegar a 200), campos pulsados; fijo para patología local y barrido para patología global.',
    'Se aplica con ropa, vendas o yeso. Sabor amargo u hormigueo: bajar la intensidad. No se percibe nada durante la sesión.',
    'Tenga cuidado al incorporarse: a veces hay somnolencia.'
  ];
  var HIGH_INTENSITY_NOTE = 'Magnetoterapia de alta intensidad (solo informativa, no se simula): terapia inductiva de alta energía con campo de hasta 3 T (600 veces más que un imán de barra común), paquetes de ondas de 100 a 8 000 Hz, penetración de 7 a 12 cm, 10 a 20 minutos por zona y ciclos de 10 a 15 sesiones, 3 a 5 veces por semana.';

  /* Capas didácticas del miembro (profundidad en cm); el espesor real varía con la zona. */
  var LAYERS = [
    { id: 'piel', nombre: 'Piel', from: 0, to: 0.5 },
    { id: 'grasa', nombre: 'Grasa', from: 0.5, to: 2 },
    { id: 'musculo', nombre: 'Músculo', from: 2, to: 6 },
    { id: 'hueso', nombre: 'Hueso', from: 6, to: 8 },
    { id: 'musculo', nombre: 'Músculo', from: 8, to: 15 }
  ];
  function layerAt(depthCm) {
    var d = Math.min(Math.max(depthCm, 0), PEN_MAX_CM);
    for (var i = 0; i < LAYERS.length; i++) if (d < LAYERS[i].to) return LAYERS[i];
    return LAYERS[LAYERS.length - 1];
  }

  /* Efectos por tejido (nivel bioquímico, celular y de órganos de la clase). usos = ids de PATHOLOGIES. */
  var TISSUES = [
    { id: 'hueso', nombre: 'Hueso', polo: null, nivel: 'Bioquímico', clinico: 'Las fracturas y los retardos de consolidación consolidan antes y, en la osteoporosis, se estimula la formación de hueso (la clase menciona también el metabolismo del calcio en los huesos).', dato: 'Las fracturas sanan en la mitad del tiempo normal.',
      pasos: ['Campo magnético', 'Induce corrientes endógenas muy débiles (efecto piezoeléctrico)', 'Estimula a los osteoblastos', 'Más matriz ósea y mayor solubilidad de sustancias en el agua'],
      efecto: 'Acelera la consolidación de fracturas y la regeneración en la osteoporosis.', usos: ['fracturas', 'retardo-consolidacion', 'osteoporosis'] },
    { id: 'membrana', nombre: 'Membrana celular y edema', polo: 'S', nivel: 'Bioquímico y celular', clinico: 'Baja la hinchazón y la inflamación de la zona lesionada; en la clase, el efecto antiinflamatorio es poco y ayuda a regular la presión del líquido.', dato: null,
      pasos: ['Campo magnético', 'Actúa sobre los iones de la membrana (sodio, potasio y calcio)', 'Ayuda a expulsar el sodio y permeabiliza la membrana', 'Sale el líquido retenido y se normaliza el potencial de membrana'],
      efecto: 'Disminuye el edema y estabiliza las células alteradas por la inflamación o la lesión.', usos: ['artropatias-agudas', 'bursitis', 'desgarros'] },
    { id: 'conectivo', nombre: 'Tendón, ligamento y piel', polo: null, nivel: 'Bioquímico', clinico: 'Tendones, ligamentos y heridas reparan mejor; la piel cicatriza y, según la clase, se previene su envejecimiento.', dato: 'Las heridas y las quemaduras sanan en la mitad del tiempo normal.',
      pasos: ['Campo magnético', 'Activa a los fibroblastos', 'Aumenta la síntesis de colágeno', 'Se reparan las fibras'],
      efecto: 'Repara tendones y ligamentos y favorece la cicatrización de tejidos blandos.', usos: ['epicondilitis', 'trasplantes', 'desgarros'] },
    { id: 'musculo', nombre: 'Músculo', polo: 'N', nivel: 'Órganos y sistemas', clinico: 'Disminuyen la contractura y la tensión muscular, con relajación orgánica general, sobre todo en cuadros de estrés.', dato: null,
      pasos: ['Campo magnético', 'Regula el tono del sistema nervioso autónomo', 'Relaja la fibra lisa (antiedematoso) y la estriada (descontracturante)'],
      efecto: 'Relajación muscular y general; el polo N es el miorrelajante.', usos: ['raquialgias', 'desgarros'] },
    { id: 'vasos', nombre: 'Vasos sanguíneos', polo: null, nivel: 'Órganos y sistemas', clinico: 'La zona se oxigena y se limpia mejor, sin sensación de calor.', dato: null,
      pasos: ['Campo magnético', 'Leve vasodilatación e hiperemia, sin calentar los tejidos', 'Sube la presión parcial de oxígeno en el tejido', 'Mejor aporte de nutrientes y drenaje de desechos y metabolitos tóxicos'],
      efecto: 'Mejora la circulación local sin efecto térmico.', usos: ['arteriopatias', 'celulitis'] },
    { id: 'nervio', nombre: 'Nervio y dolor', polo: 'S', nivel: 'Órganos y sistemas', clinico: 'El dolor baja de forma discreta y, con la técnica de barrido, hay relajación general por las endorfinas.', dato: 'Al comienzo a veces aumenta la molestia; otras veces el dolor se reduce hasta un 50 %.',
      pasos: ['Campo magnético', 'Regula la presión hidrostática intracapilar y reduce el edema', 'Eleva el umbral de excitación de los receptores sensitivos', 'Menor percepción del dolor; más endorfinas con la técnica de barrido'],
      efecto: 'Efecto analgésico discreto y relajación general (sobre todo en el estrés).', usos: ['cefaleas', 'lesiones-nerviosas'] }
  ];

  /* Filas de dosis (de la tabla de la clase) de las patologías que usa un tejido. */
  function tissueDoses(tissueId) {
    var t = TISSUES.filter(function (x) { return x.id === tissueId; })[0];
    if (!t) return [];
    return t.usos.map(function (u) {
      var p = PATHOLOGIES.filter(function (x) { return x.id === u; })[0];
      return { id: p.id, nombre: p.nombre, gauss: p.maxDevice ? 'Máximo del equipo' : p.gauss[0] + ' – ' + p.gauss[1] + ' G',
        minutes: p.minutes === null ? 'varía' : p.minutes + ' min', sesiones: SESIONES_TXT[p.sesiones] };
    });
  }

  var CASES = [
    { id: 'fractura', titulo: 'Fractura de metatarsianos con yeso',
      texto: 'Mujer de 58 años con fractura del cuello del 3.º y 4.º metatarsiano (20 de noviembre), manejo conservador con bota de yeso por 1 mes. Sin otras condiciones. Se plantea magnetoterapia como parte de la consolidación. ¿Es apta? Indique aplicador, polo, intensidad (G) y tiempo (min).',
      spec: { apto: { any: ['si'] }, applicator: { any: ['solenoide'] }, pole: { any: ['S'] }, gauss: { min: 30, max: 50 }, minutes: { min: 15, max: 30 } },
      respuesta: 'Apta (la magnetoterapia se aplica a través del yeso). Aplicador solenoide para el pie, polo S, fracturas recientes 30–50 G, perfil de ataque (menos de 50 Hz), 20 min, sesiones diarias.' },
    { id: 'epicondilitis', titulo: 'Epicondilitis en un tenista',
      texto: 'Hombre de 35 años con dolor en la cara externa del codo de 3 semanas. Sin contraindicaciones. ¿Es apto? Indique aplicador, polo, intensidad (G) y tiempo (min).',
      spec: { apto: { any: ['si'] }, applicator: { any: ['plano'] }, pole: { any: ['S'] }, gauss: { min: 40, max: 60 }, minutes: { min: 10, max: 20 } },
      respuesta: 'Apto. Aplicador plano (zona superficial), polo S (analgésico y antiinflamatorio), epicondilitis 40–60 G, 15 min, 2 al día.' },
    { id: 'raquialgia', titulo: 'Raquialgia por estrés',
      texto: 'Mujer de 42 años con dolor y contractura lumbar asociados a estrés laboral. Sin contraindicaciones. ¿Es apta? Indique aplicador, polo, intensidad (G) y tiempo (min).',
      spec: { apto: { any: ['si'] }, applicator: { any: ['plano'] }, pole: { any: ['N'] }, gauss: { min: 20, max: 40 }, minutes: { min: 10, max: 20 } },
      respuesta: 'Apta. Aplicador plano sobre la región lumbar, polo N (miorrelajante), raquialgias 20–40 G, 15 min, perfil analgésico (más de 50 Hz).' },
    { id: 'marcapasos', titulo: 'Bursitis en una persona con marcapasos',
      texto: 'Hombre de 66 años con bursitis de hombro que usa marcapasos. Se plantea magnetoterapia con aplicador plano. ¿Es apto?',
      spec: { apto: { any: ['no'] } },
      respuesta: 'No. El marcapasos es contraindicación de la magnetoterapia: el campo puede interferir con el dispositivo.' }
  ];

  /* ---- Animación: funciones puras (el dibujo vive en lab-magneto-anim.js) ---- */
  function num(v, d) { return typeof v === 'number' && isFinite(v) ? v : d; }
  function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }
  /* Ciclos por segundo visibles: 1 Hz -> 0,5 y 100 Hz -> 3,0 (lineal). */
  function visualHz(hz) { var h = clamp(num(hz, 1), DEVICE.hzMin, DEVICE.hzMax); return 0.5 + 2.5 * (h - 1) / 99; }
  function fieldStrength(gauss) { return clamp(num(gauss, 0), 0, DEVICE.gaussAbsMax) / DEVICE.gaussAbsMax; }
  function fieldPhase(tMs, hz, speed) {
    var c = (num(tMs, 0) / 1000) * visualHz(hz) * clamp(num(speed, 1), 0, 4);
    return c - Math.floor(c);
  }
  /* Tres cuartos: la clase solo nombra la forma; criterio didáctico: seno que se corta en el último cuarto del ciclo. */
  function wavePoint(shape, phase) {
    var f = phase - Math.floor(phase);
    if (shape === 'sinusoidal') return Math.sin(2 * Math.PI * f);
    if (shape === 'rectangular') return f < 0.5 ? 1 : -1;
    if (shape === 'tres-cuartos') return f < 0.75 ? Math.sin(2 * Math.PI * f) : 0;
    throw new Error('forma de onda desconocida: ' + shape);
  }
  function sweepPosition(tMs, periodMs) {
    var f = (tMs / periodMs) - Math.floor(tMs / periodMs), x = f < 0.5 ? f * 2 : 2 - f * 2;
    return { x: x, index: Math.round(x * (THEORY.posiciones.length - 1)) };
  }

  /* Marco teórico: contenido de las láminas de la clase (sin correcciones externas). */
  var THEORY = {
    concepto: [
      'Aplicación de campos magnéticos artificiales sobre la zona del cuerpo humano aquejada de una disfunción o trauma, controlando la frecuencia o la intensidad de estos campos.',
      'El campo magnético se induce de dos formas: a través de la corriente eléctrica (cables) y con imanes (imanterapia).',
      'Según su transmisión es conversivo.',
      'Penetración de 5 a 15 cm según el equipo, el solenoide es más profundo y uniforme; el aplicador plano o placa es más superficial y, al ir ganando profundidad, pierde energía.'
    ],
    unidades: [
      'Inducción magnética: susceptibilidad de los cuerpos al ser sometidos a campos magnéticos.',
      'Unidad: gauss (1975); hoy, en el Sistema Internacional, el tesla.',
      '1 tesla = 10 000 gauss (1 gauss = 10⁻⁴ tesla).'
    ],
    sustancias: [
      { id: 'diamagneticas', nombre: 'Diamagnéticas', susceptibilidad: 'Susceptibilidad magnética negativa.',
        comportamiento: 'Se imantan poco al ser sometidas al campo magnético y son repelidas por él.', ejemplos: 'En la membrana celular. Otros: bismuto, cobre, antimonio.' },
      { id: 'paramagneticas', nombre: 'Paramagnéticas', susceptibilidad: 'Susceptibilidad magnética positiva.',
        comportamiento: 'Son atraídas por los campos magnéticos; su permeabilidad magnética tiene una intensidad igual a la del campo.', ejemplos: 'En el cuerpo humano. Otros: aluminio, platino, sodio.' },
      { id: 'ferromagneticas', nombre: 'Ferromagnéticas', susceptibilidad: 'Susceptibilidad magnética grande.',
        comportamiento: 'Se imantan tanto dentro del cuerpo como fuera.', ejemplos: 'El hierro, que está en la hemoglobina. Otros, en menor proporción: níquel y cobalto.' }
    ],
    polos: {
      N: 'Polo norte: miorrelajante.',
      S: 'Polo sur: analgésico y antiinflamatorio. El magnetismo fluye de sur a norte.'
    },
    partes: {
      consola: [
        'Frecuencia entre 1 y 100 Hz; algunas unidades presentan frecuencia fija de 50 Hz.',
        'Se pueden variar la frecuencia, la intensidad y el tiempo de aplicación (según la patología).',
        'Forma de aplicación: fijo (patología local) o barrido (patología global).',
        'Tiene 2 canales independientes.',
        'Forma de la onda que se aplica: sinusoidal, rectangular o en «tres cuartos».'
      ],
      solenoide: [
        'Cuando se necesitan campos magnéticos intensos se usan los producidos por conductores enrollados que forman una bobina larga con muchas espiras circulares en su interior.',
        'El campo magnético es uniforme; es de material plástico para facilitar la limpieza y en él se introduce la zona a tratar.',
        'Pequeños, de 15 a 20 cm. Grandes, de 60 cm, para hacer barrido de cuerpo entero.'
      ],
      camilla: ['La camilla es la tercera parte del equipo, junto con la consola y el solenoide.']
    },
    formasOnda: [
      { id: 'sinusoidal', nombre: 'Sinusoidal' },
      { id: 'rectangular', nombre: 'Rectangular' },
      { id: 'tres-cuartos', nombre: 'En «tres cuartos»' }
    ],
    posiciones: ['pie', 'rodilla', 'cadera', 'dorsal baja', 'cabeza y cuello'],
    tecnica: { fijo: 'Fijo, para patologías locales.', barrido: 'Barrido, para patologías globales (efecto de relajación general). Existen 5 posiciones: pie, rodilla, cadera, dorsal baja, cabeza y cuello.' }
  };

  return { GAUSS_PER_TESLA: GAUSS_PER_TESLA, DEVICE: DEVICE, gaussToTesla: gaussToTesla, teslaToGauss: teslaToGauss, fieldAtDepth: fieldAtDepth,
    POLES: POLES, poleEffect: poleEffect, profileFor: profileFor, PROFILES: PROFILES, PATHOLOGIES: PATHOLOGIES, evaluateProtocol: evaluateProtocol,
    CONDITIONS: CONDITIONS, visualHz: visualHz, fieldStrength: fieldStrength, fieldPhase: fieldPhase, wavePoint: wavePoint, sweepPosition: sweepPosition, THEORY: THEORY, LAYERS: LAYERS, layerAt: layerAt, TISSUES: TISSUES, tissueDoses: tissueDoses, NOTES: NOTES, HIGH_INTENSITY_NOTE: HIGH_INTENSITY_NOTE, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = MagnetoCore;
