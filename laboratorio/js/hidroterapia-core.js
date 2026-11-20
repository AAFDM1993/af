/* Núcleo de hidroterapia. Datos: Clase 5, Hidroterapia. */
var HidroCore = (function () {
  var K = (typeof LabKit !== 'undefined') ? LabKit : require('./lab-kit.js');

  var MODALITIES = [
    { id: 'hubbard', nombre: 'Tanque de Hubbard', alcance: 'total', tempMinC: 35, tempMaxC: 37, minutos: [20, 20],
      nota: 'Tanque de acero inoxidable en forma de mariposa, 1 514 L de agua a 36 °C en promedio (la clase no da rango: se tolera 35–37 °C). Llenado 30 min, terapia 20 min, evacuación 7 min; 4 o 5 pacientes por llenado; desinfección con sablón. Turbina directa: relajante muscular y analgésica; indirecta: espasticidad y dolor exacerbado. Movilizaciones libres, activas, asistidas y pasivas.' },
    { id: 'piscina', nombre: 'Piscina terapéutica', alcance: 'total', tempMinC: 35, tempMaxC: 36, minutos: null,
      nota: 'Aplicación total de 35 a 36 °C: ejercicio acuático con flotabilidad (menor carga articular) y resistencia del agua.' },
    { id: 'whirlpool', nombre: 'Whirlpool caliente', alcance: 'parcial', tempMinC: 38, tempMaxC: 39, minutos: null,
      nota: 'Aplicación parcial de 38 a 39 °C: facilita el movimiento y los ejercicios en estados subagudos y crónicos y el estiramiento de contracturas (aplicación previa o simultánea).' },
    { id: 'whirlpool-frio', nombre: 'Whirlpool frío', alcance: 'parcial', tempMinC: null, tempMaxC: null, minutos: null,
      nota: 'Agua fría: modula el dolor y la inflamación en esguinces y distensiones. La clase no da su temperatura.' },
    { id: 'sauna', nombre: 'Sauna', alcance: 'total', tempMinC: 45, tempMaxC: 50, minutos: [30, 30],
      nota: 'Aire seco a 45–50 °C (a nivel del techo 80–100 °C). Su conductividad térmica es 20 veces menor que la del vapor de agua. Efectos terapéuticos después de 30 min.' },
    { id: 'turco', nombre: 'Baño turco (romano)', alcance: 'total', tempMinC: 38, tempMaxC: 45, minutos: [30, 30],
      nota: 'Baño a vapor de 38 a 45 °C (10–15 min) intercalado con baños fríos (ducha española de 1 min, mejora la vasodilatación profunda). Promedio 30 min; admite esencias naturales (eucalipto, rosas, lavanda).' },
    { id: 'afusion', nombre: 'Afusiones', alcance: 'parcial', tempMinC: null, tempMaxC: null, minutos: [10, 15],
      nota: 'Vertido de agua sobre el cuerpo, sin presión, con tubo de goma o sistema mecánico; 10 a 15 min.' },
    { id: 'ablucion', nombre: 'Abluciones', alcance: 'parcial', tempMinC: null, tempMaxC: null, minutos: [3, 5],
      nota: 'Esponja o paño frío que no debe calentarse; 3 a 5 min (total 10–15 min). Indicado en estados febriles y de ansiedad.' },
    { id: 'contraste', nombre: 'Baño de contraste', alcance: 'parcial', tempMinC: null, tempMaxC: null, minutos: null,
      nota: 'Alterna agua fría y caliente; la clase no da tiempos ni temperaturas.' }
  ];

  function getModality(id) {
    var m = MODALITIES.filter(function (x) { return x.id === id; })[0];
    if (!m) throw new Error('modalidad desconocida: ' + id);
    return m;
  }
  function checkTemperature(id, tempC) {
    var m = getModality(id);
    if (m.tempMinC === null) throw new Error('la clase no da temperatura para: ' + id);
    var b = K.band(tempC, m.tempMinC, m.tempMaxC);
    return b === 'ventana' ? 'ok' : b;
  }

  function thermalEffect(kind) {
    if (kind === 'frio') return { vaso: 'Vasoconstricción', flujo: 'Disminuye el flujo sanguíneo', metabolismo: 'Disminuye el metabolismo', accion: 'Estimulación' };
    if (kind === 'caliente') return { vaso: 'Vasodilatación', flujo: 'Aumenta el flujo sanguíneo', metabolismo: 'Aumenta el metabolismo', accion: 'Sedación' };
    throw new Error('tipo desconocido: ' + kind);
  }

  var PROPERTIES = [
    { id: 'disolvente', nombre: 'Disolvente', texto: 'Ayuda a eliminar contaminantes o material necrótico disolviéndolos.' },
    { id: 'resistencia', nombre: 'Resistencia', texto: 'La viscosidad opone resistencia al movimiento: efecto asistido o resistido.' },
    { id: 'presion', nombre: 'Presión hidrostática', texto: 'Presión del líquido sobre el cuerpo sumergido: comprime miembros y ayuda a manejar el edema.' },
    { id: 'flotabilidad', nombre: 'Flotabilidad', texto: 'Empuje hacia arriba, opuesto a la gravedad: reduce la carga corporal y el estrés y la coaptación articulares.' },
    { id: 'calor', nombre: 'Calor específico y conductividad térmica', texto: 'Transfiere calor por conducción y convección.' }
  ];

  var INDICATIONS = [
    { id: 'esguince-agudo', label: 'Esguince o distensión (modulación del dolor y la inflamación)', modalities: ['whirlpool-frio'] },
    { id: 'facilitacion-movimiento', label: 'Facilitación del movimiento y ejercicios en estado subagudo o crónico', modalities: ['whirlpool', 'piscina'] },
    { id: 'contractura-estiramiento', label: 'Estiramiento de contracturas', modalities: ['whirlpool'] },
    { id: 'espasticidad', label: 'Espasticidad, hemiplejía, lesión medular', modalities: ['hubbard'] },
    { id: 'politraumatizado', label: 'Politraumatizados', modalities: ['hubbard'] },
    { id: 'artritis-remision', label: 'Artritis reumatoide en remisión, osteoartrosis', modalities: ['sauna', 'piscina'] },
    { id: 'fibromialgia', label: 'Fibromialgia, estrés, osteoporosis general', modalities: ['sauna'] },
    { id: 'fiebre', label: 'Estado febril o ansiedad', modalities: ['ablucion'] },
    { id: 'limpieza-herida', label: 'Cuidado de heridas (limpieza mecánica con agua)', modalities: ['whirlpool'] }
  ];

  function evaluateModality(p) {
    var ind = INDICATIONS.filter(function (i) { return i.id === p.indication; })[0];
    if (!ind) throw new Error('indicación desconocida: ' + p.indication);
    getModality(p.modality);
    if (ind.modalities.indexOf(p.modality) > -1) return { veredicto: 'adecuada', mensaje: 'La clase asocia esta indicación con esa modalidad.' };
    return { veredicto: 'revisar', mensaje: 'La clase asocia esta indicación con: ' + ind.modalities.map(function (id) { return getModality(id).nombre; }).join(', ') + '.' };
  }

  var CONDITIONS = [
    { id: 'inflamacion-aguda', label: 'Condiciones inflamatorias agudas', nivel: 'contra', por: 'aumenta la presión intravascular y el edema' },
    { id: 'hiperpirexia', label: 'Hiperpirexia', nivel: 'contra', por: 'aumenta la temperatura del tejido' },
    { id: 'neoplasia', label: 'Neoplasias malignas', nivel: 'contra', por: 'puede propagarse con el flujo sanguíneo' },
    { id: 'sangrado', label: 'Sangrado activo', nivel: 'contra', por: 'prolonga el flujo sanguíneo arterial' },
    { id: 'cardiaca', label: 'Disfunción cardíaca', nivel: 'contra', por: 'no puede adaptarse a la homeostasis térmica' },
    { id: 'respiratoria', label: 'Disfunción respiratoria', nivel: 'contra', por: 'no resiste la presión hidrostática ni el calor' },
    { id: 'sensacion-termica', label: 'Pérdida de la sensación térmica', nivel: 'contra', por: 'no siente si el agua está demasiado caliente o fría' },
    { id: 'vascular', label: 'Enfermedad vascular periférica', nivel: 'contra', por: 'no puede satisfacer la demanda metabólica' },
    { id: 'rayos-x', label: 'Terapia con rayos X', nivel: 'contra', por: 'no puede satisfacer la demanda metabólica' },
    { id: 'ulceras-venosas', label: 'Úlceras venosas', nivel: 'contra', por: 'puede promover la congestión venosa' },
    { id: 'ar-aguda', label: 'Artritis reumatoide aguda', nivel: 'contra', por: 'el calor está contraindicado' },
    { id: 'infeccion-superficial', label: 'Infecciones superficiales', nivel: 'contra', por: 'contaminación cruzada' },
    { id: 'deposiciones', label: 'Deposiciones descontroladas', nivel: 'contra', por: 'contamina el agua' },
    { id: 'eccema', label: 'Eccema atópico u otras condiciones dermatológicas', nivel: 'contra', por: 'se exacerba' },
    { id: 'epilepsia-severa', label: 'Epilepsia severa (inmersión de cuerpo completo)', nivel: 'contra', por: 'riesgo de ahogamiento' },
    { id: 'hubbard-esfinteres', label: 'Hubbard: pérdida de control de esfínteres', nivel: 'contra', por: 'contraindicación específica del tanque' },
    { id: 'hubbard-heridas', label: 'Hubbard: heridas, fístulas o micosis', nivel: 'contra', por: 'contraindicación específica del tanque' },
    { id: 'hubbard-cv', label: 'Hubbard: enfermedad cardiovascular, hipertensión o epilepsia no controladas', nivel: 'contra', por: 'contraindicación específica del tanque' },
    { id: 'hubbard-infeccion', label: 'Hubbard: proceso infeccioso de ojo, oído o vías respiratorias', nivel: 'contra', por: 'contraindicación específica del tanque' },
    { id: 'hubbard-general', label: 'Hubbard: mal estado general o psicosis activa', nivel: 'contra', por: 'contraindicación específica del tanque' }
  ];

  var CASES = [
    { id: 'esguince', titulo: 'Esguince agudo de tobillo',
      texto: 'Hombre de 22 años con esguince de tobillo de 1 día de evolución: dolor, edema y calor local. Sensibilidad térmica normal, sin contraindicaciones. Se busca modular el dolor y la inflamación con agua. ¿Es apto y qué modalidad elige?',
      spec: { apto: { any: ['si'] }, modality: { any: ['whirlpool-frio'] } },
      respuesta: 'Apto. Esguince con dolor e inflamación: whirlpool frío (modulación del dolor y de la inflamación).' },
    { id: 'hemiplejia', titulo: 'Hemiplejia con espasticidad',
      texto: 'Mujer de 58 años con hemiplejia derecha y espasticidad del miembro inferior, estable, con control de esfínteres y sin heridas. Se requiere un tratamiento de cuerpo completo. ¿Es apta, qué modalidad elige y a qué temperatura?',
      spec: { apto: { any: ['si'] }, modality: { any: ['hubbard'] }, tempC: { min: 35, max: 37 } },
      respuesta: 'Apta. Tanque de Hubbard a unos 36 °C (aplicación total), 20 min de terapia, con turbina indirecta para espasticidad y dolor exacerbado, y movilizaciones.' },
    { id: 'epilepsia', titulo: 'Fibromialgia con epilepsia severa',
      texto: 'Mujer de 45 años con fibromialgia y estrés. Tiene epilepsia severa con crisis frecuentes. Se propone un tratamiento con inmersión de cuerpo completo. ¿Es apta?',
      spec: { apto: { any: ['no'] } },
      respuesta: 'No. La epilepsia severa es una contraindicación de la inmersión de cuerpo completo por riesgo de ahogamiento, aunque la fibromialgia sea una indicación.' }
  ];

  return { MODALITIES: MODALITIES, getModality: getModality, checkTemperature: checkTemperature, thermalEffect: thermalEffect, PROPERTIES: PROPERTIES,
    INDICATIONS: INDICATIONS, evaluateModality: evaluateModality, CONDITIONS: CONDITIONS, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = HidroCore;
