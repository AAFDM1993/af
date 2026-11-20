/* Núcleo de fototerapia (infrarrojo y ultravioleta). Datos: Clase 4, Fototerapia. */
var FotoCore = (function () {
  function irBand(nm) {
    if (nm >= 760 && nm <= 1500) return 'IR-A';
    if (nm > 1500 && nm <= 3000) return 'IR-B';
    if (nm > 3000 && nm <= 15000) return 'IR-C';
    return null;
  }
  function uvBand(nm) {
    if (nm >= 315 && nm <= 400) return 'UV-A';
    if (nm >= 280 && nm < 315) return 'UV-B';
    if (nm >= 100 && nm < 280) return 'UV-C';
    return null;
  }

  var BANDS = {
    'IR-A': { rango: '760–1 500 nm', texto: 'Mayor penetración y menor absorción: llega a capilares y fibras nerviosas. Es la banda de las lámparas luminosas (filamento de tungsteno o carbono).' },
    'IR-B': { rango: '1 500–3 000 nm', texto: 'Menor penetración y mayor absorción: el calentamiento queda a nivel de la piel.' },
    'IR-C': { rango: '3 000–15 000 nm', texto: 'Se usa en la esterilización de equipos.' },
    'UV-A': { rango: '315–400 nm', texto: 'Escaso poder biológico y energético, mayor penetración. Útil en psoriasis y bronceado; produce eritema y redistribuye la melanina.' },
    'UV-B': { rango: '280–315 nm', texto: 'Mayor eficacia biológica y penetración intermedia (epidermis y algo de dermis). Útil en raquitismo, osteomalacia y problemas óseos.' },
    'UV-C': { rango: '100–280 nm', texto: 'Se produce artificialmente; poca penetración, la más nociva y energética. Bactericida: micosis, úlceras y esterilización de salas e instrumentos.' }
  };
  var TEXTS = {
    uvRango: 'La radiación ultravioleta abarca de 100 a 400 nm; el infrarrojo, de 760 a 15 000 nm. Regla de la clase: a menor longitud de onda, mayor penetración; a mayor longitud de onda, mayor absorción.',
    irNota: 'Dentro del infrarrojo, la banda A (760–1 500 nm) es la de mayor penetración, aunque la clase la nombra "luminosa" y le atribuye 5–10 mm frente a 2–3 cm del infrarrojo no luminoso. Ver NOTAS_DIFERENCIAS.'
  };

  function pironLevel(p) {
    if (p >= 1.5) return { nivel: 'intolerable', minutos: null, nota: 'Sensación muy fuerte de calor, en el límite de la tolerancia; eritema intenso y sudoración.' };
    if (p >= 1) return { nivel: 'intenso', minutos: [30, 45], nota: 'Calor intenso (1 pirón): sensación mayor pero tolerable, con sudoración; efectos de activación en 30 a 45 min.' };
    return { nivel: 'moderado', minutos: [10, 30], nota: 'Calor moderado (0,5 pirón): sensación ligera y agradable, efecto analgésico, 10 a 30 min.' };
  }

  var IR_EFFECTS = [
    { min: 10, texto: 'Analgésico en SNP (10 a 30 min sobre terminaciones nerviosas sensitivas)' },
    { min: 10, texto: 'Descontracturante del músculo estriado (10 a 15 min)' },
    { min: 20, texto: 'Antiinflamatorio en procesos subagudos y crónicos (20 a 30 min)' },
    { min: 30, texto: 'Sedativo en SNC (30 min)' }
  ];
  function irEffects(minutes) {
    return IR_EFFECTS.filter(function (e) { return minutes >= e.min; }).map(function (e) { return e.texto; });
  }

  function evaluateIR(p) {
    var m = [], v = 'ok';
    if (p.distanceCm !== 60) { v = 'ajustar'; m.push('Ubique el foco emisor a 60 cm de la piel, con la lámpara perpendicular a la zona.'); }
    if (!p.glasses) { v = 'ajustar'; m.push('Proteja los ojos del paciente con lentes (precaución por cataratas).'); }
    if (!p.skinDry) { v = 'ajustar'; m.push('La piel debe estar seca y sin crema: la crema refleja la radiación.'); }
    if (v === 'ok') m.push('Técnica adecuada. El tiempo depende del efecto buscado.');
    return { veredicto: v, mensajes: m };
  }

  var GRADES = [
    { min: 10, grado: 4, nombre: '4.º grado (10 MED): eritema severo con ampollas' },
    { min: 5, grado: 3, nombre: '3.er grado (5 MED): eritema moderado, latencia de 2 h, edema y descamación marcada' },
    { min: 2.5, grado: 2, nombre: '2.º grado (2,5 MED): eritema leve, latencia de 6 h, dura 2 a 4 días con descamación' },
    { min: 1, grado: 1, nombre: '1.er grado (1 MED): eritema mínimo a las 8 horas, rosa pálido' }
  ];
  function erythemaGrade(med) {
    for (var i = 0; i < GRADES.length; i++) if (med >= GRADES[i].min) return { grado: GRADES[i].grado, nombre: GRADES[i].nombre };
    return { grado: 0, nombre: 'Sin eritema (menos de 1 MED)' };
  }

  function evaluateUV(p) {
    var m = [], v = 'ok';
    if (!p.eyesProtected) { v = 'riesgo'; m.push('Proteja siempre los ojos del paciente.'); }
    if (!p.medKnown) { v = 'riesgo'; m.push('Conozca el MED de la fuente (test de Rollier) antes de dosificar.'); }
    if (v !== 'riesgo') {
      if (p.sessions === 1 && p.med > 1) { v = 'ajustar'; m.push('En la primera sesión se usa 1 MED.'); }
      if (p.minutes > 30) { v = 'ajustar'; m.push('Empiece con 1 MED durante 30 min como máximo.'); }
      if (p.sessions > 20) { v = 'ajustar'; m.push('Máximo 20 sesiones; luego descanso de 6 semanas.'); }
    }
    if (v === 'ok') m.push('Dosificación adecuada. Mida el tiempo y la distancia a la piel y proteja cicatrices, piel atrófica y zonas genitales.');
    return { veredicto: v, mensajes: m };
  }

  var ROLLIER = [30, 60, 120, 240];

  var CONDITIONS_IR = [
    { id: 'cardio', label: 'Enfermedades cardiovasculares', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'fiebre', label: 'Inflamación aguda y fiebre', nivel: 'contra', por: 'el calor agrava el cuadro' },
    { id: 'hemorragia', label: 'Hemorragias activas', nivel: 'contra', por: 'la vasodilatación favorece el sangrado' },
    { id: 'tbc', label: 'Tuberculosis activa', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'varices', label: 'Várices', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'tromboflebitis', label: 'Tromboflebitis', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'gestante', label: 'Gestantes', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'menstruacion', label: 'Proceso menstrual', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'sensibilidad', label: 'Trastorno de la sensibilidad o de la circulación', nivel: 'precaucion', por: 'puede no percibir el calor: vigile la piel y evite quemaduras' }
  ];
  var CONDITIONS_UV = [
    { id: 'lupus', label: 'Lupus eritematoso sistémico', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'albinismo', label: 'Albinismo', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'herpes', label: 'Erupciones por herpes simple', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'tbc-pulmonar', label: 'TBC pulmonar activa', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'cardiopatia', label: 'Cardiopatías descompensadas', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'arterioesclerosis', label: 'Arterioesclerosis avanzada', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'ca-piel', label: 'Carcinomas de piel', nivel: 'contra', por: 'acción carcinogénica: daña la cadena de ADN' },
    { id: 'cicatrices', label: 'Cicatrices hipertróficas y queloides', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'ulcera-gd', label: 'Úlceras gastroduodenales', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'rosacea', label: 'Rosácea', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'dermopatia-luz', label: 'Dermopatías por luz', nivel: 'contra', por: 'contraindicación de la clase' },
    { id: 'sarcoide', label: 'Sarcoide', nivel: 'contra', por: 'contraindicación de la clase' }
  ];
  var INDICATIONS_IR = ['Patologías musculoesqueléticas subagudas y crónicas', 'Patologías osteoarticulares subagudas y crónicas', 'Procesos reumáticos en fase de remisión', 'Enfermedad oclusiva arterial periférica (según la clase)'];
  var INDICATIONS_UV = ['Raquitismo', 'Osteomalacia', 'Anemias', 'Acné quístico y acné vulgar', 'Psoriasis', 'TBC focalizada (laringe, nariz, huesos y articulaciones)', 'Úlceras y heridas'];

  var CASES = [
    { id: 'rodilla-ir', tipo: 'ir', titulo: 'Gonartrosis subaguda (infrarrojo)',
      texto: 'Mujer de 62 años con gonartrosis en fase subaguda y rigidez. Piel íntegra y seca, sensibilidad normal, sin fiebre ni várices. Se usará una lámpara infrarroja con efecto antiinflamatorio. ¿Es apta, a qué distancia y cuántos minutos?',
      spec: { apto: { any: ['si'] }, distanceCm: { min: 60, max: 60 }, minutes: { min: 20, max: 30 } },
      respuesta: 'Apta (patología osteoarticular subaguda). Lámpara perpendicular a 60 cm, paciente con lentes, piel seca sin crema; 20 a 30 min para el efecto antiinflamatorio.' },
    { id: 'fiebre-ir', tipo: 'ir', titulo: 'Lumbalgia con fiebre (infrarrojo)',
      texto: 'Hombre de 30 años con lumbalgia aguda, fiebre de 38,2 °C y dolor intenso desde ayer. Pide "calor con la lámpara". ¿La aplicaría?',
      spec: { apto: { any: ['no'] } },
      respuesta: 'No. Inflamación aguda y fiebre son contraindicaciones del infrarrojo.' },
    { id: 'psoriasis-uv', tipo: 'uv', titulo: 'Psoriasis (ultravioleta)',
      texto: 'Mujer de 40 años con psoriasis en placas. Sin lupus, albinismo, herpes ni carcinomas de piel. Se conoce el MED de la fuente y se protegerán los ojos. Es la primera sesión. ¿Es apta y con cuántos MED se inicia?',
      spec: { apto: { any: ['si'] }, med: { min: 1, max: 1 } },
      respuesta: 'Apta (psoriasis). Primera sesión con 1 MED, ojos protegidos, hasta 20 sesiones y luego 6 semanas de descanso.' },
    { id: 'lupus-uv', tipo: 'uv', titulo: 'Acné en paciente con lupus (ultravioleta)',
      texto: 'Mujer de 28 años con acné vulgar y diagnóstico de lupus eritematoso sistémico. Solicita ultravioleta. ¿Es apta?',
      spec: { apto: { any: ['no'] } },
      respuesta: 'No. El lupus eritematoso sistémico es una contraindicación del ultravioleta, aunque el acné sea una indicación.' }
  ];

  return { irBand: irBand, uvBand: uvBand, BANDS: BANDS, TEXTS: TEXTS, pironLevel: pironLevel, irEffects: irEffects, evaluateIR: evaluateIR,
    erythemaGrade: erythemaGrade, evaluateUV: evaluateUV, ROLLIER: ROLLIER, CONDITIONS_IR: CONDITIONS_IR, CONDITIONS_UV: CONDITIONS_UV,
    INDICATIONS_IR: INDICATIONS_IR, INDICATIONS_UV: INDICATIONS_UV, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = FotoCore;
