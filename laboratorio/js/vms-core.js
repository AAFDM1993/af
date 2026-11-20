/* Núcleo de VMS (vibratory motor stimulation). Datos: Clase 7. */
var VmsCore = (function () {
  var E = (typeof ElectroCore !== 'undefined') ? ElectroCore : require('./electro-core.js');

  /* Según la clase 7: tejido muscular tónico (contracción lenta) 1–200 Hz; fásico (contracción rápida) 40–80 Hz. */
  function fiberTarget(hz) {
    if (!(hz >= 1 && hz <= 200)) return null;
    return hz >= 40 && hz <= 80 ? 'ambas' : 'tonica';
  }

  function evaluateVms(p) {
    var m = [], v = 'ok', ok;
    if (p.fiber === 'fasica') { ok = p.hz >= 40 && p.hz <= 80; if (!ok) m.push('Para fibras fásicas (contracción rápida) la clase indica 40–80 Hz.'); }
    else { ok = p.hz >= 1 && p.hz <= 200; if (!ok) m.push('Para fibras tónicas (contracción lenta) la clase indica 1–200 Hz.'); }
    if (!ok) v = 'ajustar';
    else m.push('Frecuencia adecuada para fibras ' + (p.fiber === 'fasica' ? 'fásicas' : 'tónicas') + (p.mode === 'burst' ? ', aplicada en ráfagas.' : ', en forma continua.'));
    return { veredicto: v, mensajes: m };
  }

  var NOTES = [
    'Uso: fortalecimiento de los vientres musculares.',
    'Corriente estimulante de pulso rectangular, bifásica simétrica, continua o aplicada en ráfagas (burst).',
    'La piel ofrece baja resistencia (impedancia) y se usan intensidades altas.',
    'Tejido muscular tónico: contracción lenta, frecuencia de 1 a 200 Hz. Tejido muscular fásico: contracción rápida, 40–80 Hz.',
    'La clase da la duración de pulso como "100 ms": es un dato dudoso para un pulso de este tipo, por eso el módulo no lo rotula.'
  ];

  var CONDITIONS = E.GENERAL_CONDITIONS;

  var CASES = [
    { id: 'cuadriceps', titulo: 'Debilidad del cuádriceps',
      texto: 'Hombre de 30 años con debilidad del cuádriceps tras una inmovilización. Piel íntegra, sin contraindicaciones. Se busca fortalecer el vientre muscular, de contracción rápida, con VMS. ¿Es apto, sobre qué tipo de fibra actúa y a qué frecuencia (Hz)?',
      spec: { apto: { any: ['si'] }, fiber: { any: ['fasica'] }, hz: { min: 40, max: 80 } },
      respuesta: 'Apto. Fibras fásicas (contracción rápida): 40–80 Hz, corriente bifásica simétrica rectangular aplicada en ráfagas, con intensidad alta.' },
    { id: 'marcapasos', titulo: 'Fortalecimiento con marcapasos',
      texto: 'Mujer de 62 años con debilidad de los glúteos y portadora de marcapasos. Se propone VMS para fortalecer. ¿Es apta?',
      spec: { apto: { any: ['no'] } },
      respuesta: 'No. El marcapasos es una contraindicación (relativa según la zona): la corriente puede interferir con el dispositivo.' }
  ];

  return { fiberTarget: fiberTarget, evaluateVms: evaluateVms, NOTES: NOTES, CONDITIONS: CONDITIONS, CASES: CASES };
})();
if (typeof module !== 'undefined') module.exports = VmsCore;
