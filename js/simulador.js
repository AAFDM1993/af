/* ===== SIMULADOR — DATOS ===== */
const SIM_CASES = [
  { id:'ag_dolor', phaseLabel:'Aguda — dolor e inflamación', phasePill:'pill-red',
    tissueLabel:'dolor agudo con inflamación',
    regions:['tobillo','rodilla','zona lumbar','hombro'],
    validAgentNames:['TENS convencional','US pulsado 1:4','Laser 830 nm','Magnetoterapia','Diadinámica DF'],
    agentBase:'tens',
    target:{ name:'TENS convencional',
      mech:'Activa fibras A-β que bloquean la transmisión del dolor a nivel medular (Gate Control).',
      sliders:[
        { label:'Frecuencia', unit:'Hz', min:0, max:250, step:5, validMin:80, validMax:150 },
        { label:'Ancho de pulso', unit:'µs', min:0, max:400, step:10, validMin:50, validMax:80 },
        { label:'Duración', unit:'min', min:0, max:60, step:5, validMin:20, validMax:30 },
      ]}},

  { id:'ag_edema', phaseLabel:'Aguda — edema prominente', phasePill:'pill-red',
    tissueLabel:'edema postraumático agudo',
    regions:['tobillo','rodilla','mano','pie'],
    validAgentNames:['Interferencial 25–50 Hz','Magnetoterapia','TENS convencional','Laser 830 nm','Alto voltaje (cátodo)'],
    agentBase:'inter',
    target:{ name:'Interferencial 25–50 Hz',
      mech:'Efecto simpaticolítico: vasodilatación y mejora del retorno venoso y linfático.',
      sliders:[
        { label:'AMF', unit:'Hz', min:0, max:150, step:5, validMin:25, validMax:50 },
        { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:15, validMax:20 },
      ]}},

  { id:'ag_espasmo', phaseLabel:'Aguda — espasmo muscular', phasePill:'pill-red',
    tissueLabel:'espasmo muscular agudo',
    regions:['zona lumbar','cuello','gemelo','trapecio'],
    validAgentNames:['TENS Burst','US pulsado 1:4','Magnetoterapia 50–100 Hz','Laser 830 nm'],
    agentBase:'tens',
    target:{ name:'TENS Burst',
      mech:'Combina Gate Control y liberación endorfínica: reduce el tono muscular por vía refleja espinal.',
      sliders:[
        { label:'Frecuencia de ráfaga', unit:'Hz', min:0, max:20, step:1, validMin:2, validMax:4 },
        { label:'Ancho de pulso', unit:'µs', min:0, max:400, step:10, validMin:100, validMax:200 },
        { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:18, validMax:22 },
      ]}},

  { id:'sub_dolor', phaseLabel:'Subaguda — dolor residual', phasePill:'pill-amber',
    tissueLabel:'dolor residual subagudo',
    regions:['hombro','rodilla','zona lumbar','cadera'],
    validAgentNames:['TENS acupuntural','Interferencial 80–100 Hz','Laser 830 nm','Terapia combinada','Diadinámica CP','Träbert (corriente 2/5)'],
    agentBase:'tens',
    target:{ name:'TENS acupuntural',
      mech:'Estimula la liberación de β-endorfinas y encefalinas en el asta posterior medular y a nivel sistémico.',
      sliders:[
        { label:'Frecuencia', unit:'Hz', min:0, max:30, step:1, validMin:2, validMax:10 },
        { label:'Ancho de pulso', unit:'µs', min:0, max:400, step:10, validMin:200, validMax:300 },
        { label:'Duración', unit:'min', min:0, max:60, step:5, validMin:20, validMax:30 },
      ]}},

  { id:'sub_cicatriz', phaseLabel:'Subaguda — cicatrización', phasePill:'pill-amber',
    tissueLabel:'tejido en fase de cicatrización',
    regions:['antebrazo','pierna','abdomen','muslo'],
    validAgentNames:['US pulsado 1:1','Laser 830 nm','Magnetoterapia 10–25 Hz','Terapia combinada','Alto voltaje (cátodo→ánodo)','Galvánica (iontoforesis)'],
    agentBase:'us',
    target:{ name:'US pulsado 1:1',
      mech:'La cavitación estable y las microcorrientes de fluido estimulan directamente los fibroblastos, aumentando la síntesis de colágeno tipo I.',
      sliders:[
        { label:'Intensidad', unit:'W/cm²', min:0, max:3, step:0.1, validMin:0.5, validMax:1 },
        { label:'Duración', unit:'min', min:0, max:20, step:1, validMin:5, validMax:8 },
      ]}},

  { id:'sub_edema', phaseLabel:'Subaguda — edema crónico', phasePill:'pill-amber',
    tissueLabel:'edema subagudo persistente',
    regions:['tobillo','rodilla','muñeca','mano'],
    validAgentNames:['Interferencial 25–50 Hz','Magnetoterapia 25–50 Hz','US pulsado 1:4','Laser 830 nm','Diadinámica LP'],
    agentBase:'mag',
    target:{ name:'Magnetoterapia 25–50 Hz',
      mech:'Incrementa la velocidad de flujo capilar y reduce la viscosidad sanguínea por efecto electromagnético.',
      sliders:[
        { label:'Frecuencia', unit:'Hz', min:0, max:100, step:5, validMin:25, validMax:50 },
        { label:'Intensidad', unit:'Gauss', min:0, max:150, step:5, validMin:20, validMax:80 },
        { label:'Duración', unit:'min', min:0, max:45, step:5, validMin:20, validMax:30 },
      ]}},

  { id:'sub_fuerza', phaseLabel:'Subaguda — recuperación de fuerza', phasePill:'pill-amber',
    tissueLabel:'debilidad muscular por desuso',
    regions:['cuádriceps','hombro','gemelo','isquiotibiales'],
    validAgentNames:['Corrientes rusas','TENS Burst / EMS','US continuo previo','Laser 830 nm','VMS'],
    agentBase:'rusa',
    target:{ name:'Corrientes rusas',
      mech:'La media frecuencia (2500 Hz) supera la resistencia cutánea sin dolor; las ráfagas a 50 Hz generan contracción tetánica fuerte, estimulando fibras tipo II.',
      sliders:[
        { label:'Frecuencia de ráfaga', unit:'Hz', min:0, max:100, step:5, validMin:45, validMax:55 },
        { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:10, validMax:20 },
      ]}},

  { id:'cr_articular', phaseLabel:'Crónica — articular / hueso', phasePill:'pill-green',
    tissueLabel:'afección articular crónica',
    regions:['rodilla','cadera','hombro','mano'],
    validAgentNames:['Magnetoterapia 1–25 Hz','US continuo','Interferencial 0–100 Hz','Laser 830 nm','Diadinámica CP/LP','Träbert'],
    agentBase:'mag',
    target:{ name:'Magnetoterapia 1–25 Hz',
      mech:'Estimula osteoblastos y activa la síntesis de colágeno óseo.',
      sliders:[
        { label:'Frecuencia', unit:'Hz', min:0, max:50, step:1, validMin:1, validMax:25 },
        { label:'Intensidad', unit:'Gauss', min:0, max:150, step:5, validMin:10, validMax:100 },
        { label:'Duración', unit:'min', min:0, max:45, step:5, validMin:20, validMax:30 },
      ]}},

  { id:'cr_muscular', phaseLabel:'Crónica — músculo / tejido blando', phasePill:'pill-green',
    tissueLabel:'fibrosis muscular crónica',
    regions:['isquiotibiales','trapecio','gemelo','zona lumbar'],
    validAgentNames:['Corrientes rusas','US continuo','TENS acupuntural','Laser 830 nm','Diadinámica RS','Träbert'],
    agentBase:'laser',
    target:{ name:'Laser 830 nm',
      mech:'Inhibe la activación de miofibroblastos y reduce la producción de TGF-β1, previniendo la fibrosis muscular crónica.',
      sliders:[
        { label:'Dosis', unit:'J/cm²', min:0, max:10, step:0.5, validMin:4, validMax:6 },
        { label:'Tiempo por zona', unit:'s', min:0, max:150, step:5, validMin:60, validMax:90 },
      ]}},

  { id:'cr_neuro', phaseLabel:'Crónica — dolor neuropático / punto gatillo', phasePill:'pill-blue',
    tissueLabel:'dolor neuropático / punto gatillo miofascial',
    regions:['trapecio superior','glúteo','cervical','antebrazo'],
    validAgentNames:['TENS acupuntural','Laser 830 nm sobre PG','Interferencial 1–10 Hz','Magnetoterapia 10–25 Hz','Onda H','Träbert','Galvánica (trofismo axonal)'],
    agentBase:'ondah',
    target:{ name:'Onda H',
      mech:'La forma de onda exponencial activa fibras neuropáticas dañadas con menor densidad de corriente; la baja frecuencia libera opioides endógenos.',
      sliders:[
        { label:'Frecuencia', unit:'Hz', min:0, max:30, step:1, validMin:2, validMax:10 },
        { label:'Duración', unit:'min', min:0, max:60, step:5, validMin:30, validMax:45 },
      ]}},

  { id:'tend_sub', phaseLabel:'Tendinopatía subaguda-crónica', phasePill:'pill-amber',
    tissueLabel:'tendinopatía subaguda-crónica',
    regions:['tendón de Aquiles','manguito rotador','tendón rotuliano','epicóndilo'],
    validAgentNames:['US continuo/pulsado','Laser 830 nm','Terapia combinada','Interferencial 80 Hz'],
    agentBase:'inter',
    target:{ name:'Interferencial 80 Hz',
      mech:'Alta frecuencia interferencial activa Gate Control en profundidad, apropiado para tendones profundos.',
      sliders:[
        { label:'AMF', unit:'Hz', min:0, max:150, step:5, validMin:75, validMax:85 },
        { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:15, validMax:20 },
      ]}},

  { id:'tend_cr', phaseLabel:'Tendinopatía crónica refractaria', phasePill:'pill-red',
    tissueLabel:'tendinopatía crónica refractaria (>3 meses)',
    regions:['tendón de Aquiles','tendón rotuliano','fascia plantar','epicóndilo'],
    validAgentNames:['Ondas de choque radiales','Laser 830 nm','US continuo','Magnetoterapia'],
    agentBase:'oc',
    target:{ name:'Ondas de choque radiales',
      mech:'Generan microtraumatismo controlado que reinicia la cascada de reparación: estimulan VEGF, IGF-1 y TGF-β1.',
      sliders:[
        { label:'Presión', unit:'bar', min:0, max:6, step:0.5, validMin:1.5, validMax:4 },
        { label:'Frecuencia', unit:'Hz', min:0, max:25, step:1, validMin:8, validMax:15 },
        { label:'Nº de impactos', unit:'impactos', min:0, max:3000, step:100, validMin:1500, validMax:2500 },
      ]}},
];

const SIM_COMORBILIDADES = [
  { id:'marcapasos', label:'Marcapasos / dispositivo electrónico implantado',
    excludes:['tens','inter','us','mag','rusa','ondah'] },
  { id:'embarazo', label:'Embarazo (zona tratada abdominal/lumbar/pélvica)',
    excludes:['tens','inter','us','mag','laser','rusa','oc','ondah'] },
  { id:'metal', label:'Implante metálico en la zona tratada',
    excludes:['inter','us'] },
  { id:'trombosis', label:'Trombosis venosa activa / TVP',
    excludes:['tens','inter','us','rusa','ondah','oc'] },
  { id:'piel', label:'Piel lesionada / herida abierta en la zona',
    excludes:['tens','us'] },
  { id:'neoplasia', label:'Neoplasia activa en la zona tratada',
    excludes:['tens','inter','us','mag','laser','rusa','oc','ondah'] },
];

/* ===== SIMULADOR — GENERADOR DE PACIENTE ===== */
function pickRandomItem(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function pickRandomInt(minInclusive, maxInclusive, rng) {
  return Math.floor(rng() * (maxInclusive - minInclusive + 1)) + minInclusive;
}

function generatePatient(rng) {
  rng = rng || Math.random;
  const patientCase = pickRandomItem(SIM_CASES, rng);
  const region = pickRandomItem(patientCase.regions, rng);
  const age = pickRandomInt(18, 75, rng);
  let comorbidity = null;
  if (rng() < 0.4) {
    comorbidity = pickRandomItem(SIM_COMORBILIDADES, rng);
  }
  const blocked = !!(comorbidity && comorbidity.excludes.includes(patientCase.agentBase));
  return { case: patientCase, region, age, comorbidity, blocked };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SIM_CASES, SIM_COMORBILIDADES, pickRandomItem, pickRandomInt, generatePatient };
}
