/* Núcleo de crioterapia. Datos: Crioterapia.pdf (clase de crioterapia). */
var CrioCore = (function () {
  var METHODS = [
    { id: 'bolsa-hielo', nombre: 'Bolsa de hielo', tipo: 'conduccion', minMin: 15, maxMin: 20,
      nota: 'Hielo picado en bolsa de plástico, directo sobre la piel y fijada con toalla o venda elástica. 15 min; 20 min si hay abundante tejido subcutáneo o gran masa muscular. Enfriamiento de mayor intensidad y duración.' },
    { id: 'cold-pack', nombre: 'Paquete frío (cold pack)', tipo: 'conduccion', minMin: 10, maxMin: 15,
      nota: 'Gel de silicato, moldeable y flexible, enfriado a −12 / −18 °C. Se coloca sobre toalla; 10 a 15 min.' },
    { id: 'toalla-fria', nombre: 'Toallas o paños fríos', tipo: 'conduccion', minMin: 10, maxMin: 15,
      nota: 'Toallas gruesas en hielo picado con agua, escurridas. El enfriamiento es muy superficial: cambiar la toalla cada 4 o 5 min.' },
    { id: 'criomasaje', nombre: 'Criomasaje', tipo: 'conduccion', minMin: 5, maxMin: 10,
      nota: 'Masaje con hielo, 5 a 10 min, con movimientos lentos y enérgicos. La temperatura alcanzada no debe ser menor de −15 °C. Para zonas pequeñas y poco profundas, sin relieves óseos. Si la piel se pone cianótica, interrumpir.' },
    { id: 'spray', nombre: 'Aerosol refrigerante (spray)', tipo: 'conveccion', minMin: null, maxMin: null,
      nota: '3 a 4 barridos siguiendo las fibras musculares, con el recipiente inclinado 45°. Penetra 3–4 mm en la piel. Útil en puntos gatillo y contracturas; cuidar la inhalación y los ojos.' }
  ];

  function vascularResponse(minutes) {
    if (minutes < 5) return 'sin-estimulo';
    if (minutes < 8) return 'vasoconstriccion-superficial';
    if (minutes <= 15) return 'vasoconstriccion-profunda';
    return 'vasodilatacion-refleja';
  }

  /* Test de sensibilidad: masaje con hielo 3 min; eritema a los 5 min es normal; ampolla tras otros 5 min = positiva. */
  function sensitivityTest(o) {
    if (o.blister) return 'positiva';
    return o.erythemaAt5min ? 'negativa' : 'no-concluyente';
  }

  function evaluateApplication(p) {
    var met = METHODS.filter(function (m) { return m.id === p.method; })[0];
    if (!met) throw new Error('método desconocido: ' + p.method);
    var m = [], v = 'ok';
    if (p.cyanosis) { v = 'interrumpir'; m.push('Piel cianótica: interrumpa el tratamiento.'); }
    else if (met.minMin !== null && (p.minutes < met.minMin || p.minutes > met.maxMin)) {
      v = 'ajustar'; m.push('Con ' + met.nombre.toLowerCase() + ' la clase indica ' + met.minMin + ' a ' + met.maxMin + ' minutos.');
    }
    if (p.sensitivityTested === false) m.push('Haga antes el test de sensibilidad (masaje con hielo 3 min; a los 5 min debe aparecer eritema).');
    if (v === 'ok') m.push('Aplicación adecuada para ' + met.nombre.toLowerCase() + '.');
    return { veredicto: v, mensajes: m };
  }

  var CONDITIONS = [
    { id: 'raynaud', label: 'Trastornos vasculares periféricos o síndrome de Raynaud', nivel: 'contra', por: 'el frío agrava el vasoespasmo' },
    { id: 'hipersensibilidad', label: 'Hipersensibilidad al frío o pérdida de la sensibilidad', nivel: 'contra', por: 'riesgo de lesión por frío sin percibirlo' },
    { id: 'buerger', label: 'Tromboflebitis obliterante (Buerger) o circulación arterial afectada', nivel: 'contra', por: 'la vasoconstricción compromete la irrigación' },
    { id: 'vasoespasmo', label: 'Afecciones con vasoespasmos', nivel: 'contra', por: 'el frío los desencadena' },
    { id: 'urticaria', label: 'Urticaria al frío', nivel: 'contra', por: 'reacción alérgica al estímulo frío' },
    { id: 'arterioesclerosis', label: 'Arterioesclerosis', nivel: 'contra', por: 'contraindicación de la clase' }
  ];

  var INDICATIONS = ['Procesos inflamatorios y dolorosos agudos', 'Afecciones que cursan con dolor y prurito',
    'Quemaduras y patologías donde el aumento de temperatura es la característica principal',
    'Afecciones que cursan con espasticidad', 'Cuadros postraumáticos agudos'];

  var CASES = [
    { id: 'esguince', titulo: 'Esguince agudo de tobillo',
      texto: 'Hombre de 24 años, futbolista. Esguince de tobillo hace 6 horas con dolor, edema y aumento de la temperatura local. Sensibilidad normal, sin antecedentes vasculares. Se usará una bolsa de hielo sobre el tobillo. ¿Es apto, con qué método y cuántos minutos?',
      spec: { apto: { any: ['si'] }, method: { any: ['bolsa-hielo'] }, minutes: { min: 15, max: 20 } },
      respuesta: 'Apto (cuadro postraumático agudo). Bolsa de hielo picado en bolsa de plástico, fijada con venda, 15 min (hasta 20 si hay mucho tejido). Vigilar frío intenso, quemazón, dolor y analgesia.' },
    { id: 'raynaud', titulo: 'Dolor de mano con Raynaud',
      texto: 'Mujer de 35 años con dolor en la mano tras un golpe. Tiene diagnóstico de síndrome de Raynaud: los dedos se ponen blancos y azulados con el frío. ¿Aplicaría hielo?',
      spec: { apto: { any: ['no'] } },
      respuesta: 'No. El síndrome de Raynaud y los vasoespasmos son contraindicaciones de la crioterapia: el frío agrava la vasoconstricción.' },
    { id: 'criomasaje', titulo: 'Dolor local en el epicóndilo',
      texto: 'Mujer de 40 años con dolor localizado en el epicóndilo, zona pequeña y poco profunda, tras un esfuerzo hace 3 días. Sensibilidad normal. Se busca analgesia local con hielo. ¿Es apta, con qué método y cuántos minutos?',
      spec: { apto: { any: ['si'] }, method: { any: ['criomasaje'] }, minutes: { min: 5, max: 10 } },
      respuesta: 'Apta. Criomasaje circular (dolores locales) de 5 a 10 min, con la temperatura no menor de −15 °C, vigilando que la piel no se ponga cianótica.' }
  ];

  return { METHODS: METHODS, vascularResponse: vascularResponse, sensitivityTest: sensitivityTest, evaluateApplication: evaluateApplication,
    CONDITIONS: CONDITIONS, INDICATIONS: INDICATIONS, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = CrioCore;
