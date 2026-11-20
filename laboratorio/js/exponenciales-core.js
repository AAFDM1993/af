/* Núcleo de corrientes exponenciales. Datos: Clase 7 (parámetros de las corrientes variables y exponenciales). */
var ExponencialesCore = (function () {
  var E = (typeof ElectroCore !== 'undefined') ? ElectroCore : require('./electro-core.js');

  var TISSUES = {
    'nervio-normal': { respuesta: 'El nervio normal se acomoda a la pendiente lenta del pulso exponencial: necesita más intensidad y el músculo sano no se contrae.', acomoda: true },
    denervado: { respuesta: 'La fibra denervada pierde su capacidad de acomodación (coeficiente cercano a 1): se estimula primero que las fibras sanas y se contrae.', acomoda: false },
    'fibra-lisa': { respuesta: 'La musculatura lisa visceral y arterial responde sin provocar la contracción de los músculos normales: útil en trastornos circulatorios por fallas del sistema neurovegetativo.', acomoda: false }
  };
  function selectiveStim(tissue) {
    if (!Object.prototype.hasOwnProperty.call(TISSUES, tissue)) throw new Error('tejido desconocido: ' + tissue);
    return TISSUES[tissue];
  }

  function evaluateExp(p) {
    var m = [], v = 'ok';
    if (!(p.pulseMs > 0)) { v = 'ajustar'; m.push('El pulso se mide en milisegundos y debe ser mayor que cero.'); }
    if (!(p.pauseMs > p.pulseMs)) { v = 'ajustar'; m.push('La pausa entre estímulos debe ser mayor que el pulso.'); }
    if (v === 'ok') m.push('Pulso exponencial en ms con pausa mayor: la pendiente lenta aprovecha la acomodación del nervio.');
    return { veredicto: v, mensajes: m };
  }

  var CONCEPTS = [
    { nombre: 'Reobase', texto: 'Intensidad capaz de conseguir una respuesta motora mínima (respuesta umbral) con pulsos rectangulares de 1 000 ms.' },
    { nombre: 'Cronaxia', texto: 'Tiempo de pulso necesario para que una intensidad doble de la reobase produzca el efecto motor mínimo.' },
    { nombre: 'Pendiente', texto: 'Velocidad con que se alcanza la máxima intensidad. Un pulso es menos eficaz cuanto menor es su pendiente, porque la fibra se acomoda.' },
    { nombre: 'Ley del todo o nada', texto: 'Una neurona o una fibra muscular responde por completo o no responde: no hay impulso parcial ni contracción parcial de una fibra.' },
    { nombre: 'Denervación', texto: 'Pérdida de la inervación por una lesión; las fibras denervadas pierden la acomodación.' },
    { nombre: 'Potencial de acción', texto: 'Cambios del potencial de membrana que se propagan por la superficie de las células excitables.' }
  ];
  var EFFECTS = [
    'Musculatura lisa: trastornos circulatorios por fallas del sistema neurovegetativo.',
    'Fibra lisa y estriada: trastorno circulatorio de tipo arterial.',
    'Musculatura estriada: contracciones fuertes, mejora el flujo sanguíneo; útil en músculos denervados y edemas.'
  ];

  var CONDITIONS = E.GENERAL_CONDITIONS;

  var CASES = [
    { id: 'denervado', titulo: 'Parálisis periférica',
      texto: 'Hombre de 28 años con una lesión del nervio periférico del antebrazo y músculos denervados. Piel íntegra, sin contraindicaciones. Se busca contraer selectivamente el músculo denervado sin activar los músculos sanos. ¿Es apto y sobre qué tejido actúa la corriente exponencial?',
      spec: { apto: { any: ['si'] }, tissue: { any: ['denervado'] } },
      respuesta: 'Apto. La corriente exponencial aprovecha la acomodación del nervio y estimula selectivamente el músculo denervado, que perdió esa capacidad.' },
    { id: 'circulatorio', titulo: 'Trastorno circulatorio arterial',
      texto: 'Mujer de 58 años con un trastorno circulatorio arterial leve por falla del sistema neurovegetativo, sin zonas isquémicas ni otras contraindicaciones. ¿Es apta y sobre qué tejido actúa la corriente exponencial?',
      spec: { apto: { any: ['si'] }, tissue: { any: ['fibra-lisa'] } },
      respuesta: 'Apta. La corriente exponencial estimula la fibra lisa (visceral y arterial) sin provocar la contracción de los músculos normales.' }
  ];

  return { selectiveStim: selectiveStim, evaluateExp: evaluateExp, CONCEPTS: CONCEPTS, EFFECTS: EFFECTS, CONDITIONS: CONDITIONS, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = ExponencialesCore;
