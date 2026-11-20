/* Núcleo de cálculo del láser terapéutico (valores de referencia didácticos). */
var LaserCore = (function () {
  const DEVICE = { powerMW: 200, powerMinMW: 35, doseMin: 0.1, doseMax: 99, areaMin: 1, areaMax: 50, hzMax: 10000, dutyMin: 10, dutyMax: 90, defaultNm: 830 };
  const WAVELENGTHS = [632.8, 685, 810, 830, 904];
  const PENETRATION_MM = {
    632.8: { piel: 1.2, grasa: 2.5, musculo: 2.0 },
    685:   { piel: 1.6, grasa: 3.0, musculo: 2.5 },
    810:   { piel: 2.6, grasa: 4.5, musculo: 3.8 },
    830:   { piel: 2.8, grasa: 4.8, musculo: 4.0 },
    904:   { piel: 3.0, grasa: 5.2, musculo: 4.4 }
  };
  const CLASS_DOSE = { antialgico: [2, 4], antiinflamatorio: [1, 3], regenerativo: [3, 6], circulatorio: [1, 3] };
  const GOAL_NAMES = { antialgico: 'Antiálgico', antiinflamatorio: 'Antiinflamatorio', regenerativo: 'Regenerativo', circulatorio: 'Circulatorio' };

  function totalEnergyJ(dose, area) { return dose * area; }
  function treatmentTimeS(dose, area, avgMW) { return (dose <= 0 || area <= 0) ? 0 : dose * area / (avgMW / 1000); }
  function doseFromTime(timeS, area, avgMW) { return area <= 0 ? 0 : timeS * (avgMW / 1000) / area; }
  function avgPowerMW(peakMW, dutyPct, hz) { return hz === 0 ? peakMW : peakMW * dutyPct / 100; }
  function energyPerPulseMJ(peakMW, dutyPct, hz) { return hz === 0 ? null : peakMW * (dutyPct / 100) / hz; }
  function formatDuration(s) {
    s = Math.round(s);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60, p = [];
    if (h) p.push(h + ' h'); if (m) p.push(m + ' min'); if (r || !p.length) p.push(r + ' s');
    return p.join(' ');
  }
  function fractionRemaining(nm, depthMm, th) {
    const k = PENETRATION_MM[nm];
    if (!k) throw new Error('longitud de onda no soportada: ' + nm);
    const d = Math.max(0, depthMm);
    const piel = Math.min(d, th.piel);
    const grasa = Math.min(Math.max(d - th.piel, 0), th.grasa);
    const musc = Math.max(d - th.piel - th.grasa, 0);
    return Math.exp(-(piel / k.piel + grasa / k.grasa + musc / k.musculo));
  }
  function depthForFraction(nm, frac, th) {
    for (let d = 0; d <= 200; d += 0.1) if (fractionRemaining(nm, d, th) <= frac) return Math.round(d * 10) / 10;
    return 200;
  }
  function doseAtDepth(surface, fraction) { return surface * fraction; }
  function classifyDose(dose, goal) {
    const r = CLASS_DOSE[goal];
    return dose < r[0] ? 'infradosis' : (dose <= r[1] ? 'ventana' : 'sobredosis');
  }
  function classFrequencyEffect(hz) {
    if (hz < 500) return 'sin rango';
    if (hz < 4000) return 'dolor';
    if (hz < 5000) return 'regeneracion';
    return 'inflamacion';
  }
  // Modelo didáctico bifásico (Arndt-Schulz): campana de estímulo en escala logarítmica con 50 % del máximo
  // en los bordes de la ventana de la clase, menos una inhibición que crece por encima de la ventana.
  function tissueResponse(dose, goal) {
    const lo = CLASS_DOSE[goal][0], hi = CLASS_DOSE[goal][1];
    const m = Math.sqrt(lo * hi), s = 0.5 * Math.log(hi / lo) / Math.sqrt(Math.LN2);
    const bell = Math.exp(-Math.pow(Math.log(dose / m) / s, 2));
    const inh = dose > hi ? 1.2 * Math.min(1, Math.log(dose / hi) / Math.log(8)) : 0;
    return bell - inh;
  }
  // Técnicas de aplicación. El PDF de la clase solo detalla la puntual; el resto es descripción clínica habitual (confirmar con el docente).
  const TECHNIQUES = [
    { id: 'punteado', nombre: 'Punteado (puntual)',
      como: 'Sonda perpendicular y en contacto con la piel, punto por punto. La dosis se calcula por punto.',
      indicaciones: 'Puntos dolorosos y locales, puntos gatillo, inserciones tendinosas y puntos de acupuntura (laserpuntura).',
      nota: 'Sirve para zonas pequeñas: si el área es grande hacen falta muchos puntos y conviene pasar a barrido.' },
    { id: 'barrido', nombre: 'Barrido',
      como: 'La sonda se desplaza despacio y a velocidad uniforme sobre toda el área, en líneas paralelas, sin dejar zonas sin cubrir.',
      indicaciones: 'Áreas extensas: vientre muscular, contracturas amplias, cicatrices, zonas con edema o hematoma.',
      nota: 'La dosis se reparte por cm² del área total: si la velocidad cambia, la dosis deja de ser uniforme.' },
    { id: 'pincelado', nombre: 'Pincelado',
      como: 'Movimientos cortos de ida y vuelta, como pintando, siguiendo la línea o el borde de la lesión.',
      indicaciones: 'Lesiones lineales o superficiales: incisiones, cicatrices lineales y bordes de herida.',
      nota: 'Mantenga la sonda perpendicular y un ritmo constante para que cada tramo reciba lo mismo.' },
    { id: 'bano', nombre: 'Baño',
      como: 'La sonda queda quieta a cierta distancia de la piel, sin contacto: el haz se abre y cubre un área mayor.',
      indicaciones: 'Zonas dolorosas al contacto o que no deben presionarse, y lesiones superficiales extensas.',
      nota: 'Al alejar la sonda la dosis por cm² baja (ley del cuadrado de la distancia): hay que compensar con más tiempo.' }
  ];
  const CASES = [
    { id: 'epicondilitis', objetivo: 'antiinflamatorio', areaCm2: 8, profundidadMm: 6, grasaMm: 3,
      titulo: 'Epicondilitis lateral subaguda',
      texto: 'Mujer de 42 años, secretaria. Dolor en la cara externa del codo derecho hace 3 semanas, que aumenta al tomar el teclado y el mouse. Palpación dolorosa en el epicóndilo, sin edema evidente. Parametrice el láser para reducir la inflamación.' },
    { id: 'herida', objetivo: 'regenerativo', areaCm2: 10, profundidadMm: 2, grasaMm: 0,
      titulo: 'Herida cutánea en cicatrización',
      texto: 'Hombre de 35 años con herida quirúrgica suturada en la cara anterior de la pierna, retirada de puntos hace 2 días. Borde limpio, sin signos de infección. Parametrice el láser para favorecer la cicatrización.' },
    { id: 'cervicalgia', objetivo: 'antialgico', areaCm2: 15, profundidadMm: 12, grasaMm: 5,
      titulo: 'Cervicalgia por contractura',
      texto: 'Mujer de 50 años, docente. Dolor y contractura del trapecio superior izquierdo hace 5 días, con limitación dolorosa a la inclinación contralateral. Parametrice el láser para aliviar el dolor.' },
    { id: 'gemelos', objetivo: 'circulatorio', areaCm2: 20, profundidadMm: 15, grasaMm: 4,
      titulo: 'Fatiga y contractura de gemelos',
      texto: 'Hombre de 28 años, corredor aficionado. Pesadez y contractura de ambos gemelos tras una competencia hace 2 días, sin dolor agudo ni signos de trombosis. Parametrice el láser para mejorar la microcirculación del músculo.' }
  ];
  function evaluateCase(caso, p) {
    const th = { piel: 2, grasa: caso.grasaMm };
    const fr = fractionRemaining(DEVICE.defaultNm, caso.profundidadMm, th);
    const v = classifyDose(p.doseJcm2, caso.objetivo), r = CLASS_DOSE[caso.objetivo];
    const rango = r[0] + '–' + r[1] + ' J/cm²', m = [];
    if (v === 'infradosis') m.push('Dosis por debajo del rango de la clase (' + rango + '): efecto probablemente insuficiente.');
    else if (v === 'ventana') m.push('Dosis dentro del rango de la clase (' + rango + ').');
    else m.push('Dosis por encima del rango de la clase (' + rango + '): más no es mejor, el efecto bifásico puede inhibir la respuesta.');
    if (fr < 0.1) m.push('Solo llega ' + Math.round(fr * 100) + ' % de la luz al tejido blanco: es un blanco profundo para 830 nm. Verifique el contacto con la piel y la técnica (varios puntos o barrido) antes de pensar en cambiar la dosis.');
    if (p.mode === 'pulsado' && p.hz > 0) {
      const e = classFrequencyEffect(p.hz), lab = { dolor: 'dolor', regeneracion: 'regeneración', inflamacion: 'inflamación', 'sin rango': 'ningún rango' }[e];
      m.push('Con ' + p.hz + ' Hz la clase lo asocia con ' + lab + ' (criterio orientativo, evidencia limitada).');
    }
    if (caso.areaCm2 >= 10 && p.method === 'punteado') m.push('Área de ' + caso.areaCm2 + ' cm²: con punteado use varios puntos o cambie a barrido.');
    if (p.method === 'bano') m.push('Con baño la sonda está a distancia: la dosis por cm² baja, ajuste el tiempo para compensar.');
    return { dosisVeredicto: v, fraccionEnBlanco: fr, mensajes: m };
  }
  return { DEVICE, WAVELENGTHS, PENETRATION_MM, CLASS_DOSE, GOAL_NAMES, CASES, totalEnergyJ, treatmentTimeS, doseFromTime, avgPowerMW, energyPerPulseMJ, formatDuration, fractionRemaining, depthForFraction, doseAtDepth, classifyDose, classFrequencyEffect, tissueResponse, TECHNIQUES, evaluateCase };
})();
if (typeof module !== 'undefined') module.exports = LaserCore;
