/* ===== SIMULADOR — CATÁLOGO DE AGENTES ===== */
const AGENT_CATALOG = [
  { id:'tens',    name:'TENS',                               icon:'⚡', color:'c-blue' },
  { id:'inter',   name:'Interferencial',                      icon:'〜', color:'c-green' },
  { id:'us',      name:'Ultrasonido terapéutico',             icon:'◎', color:'c-amber' },
  { id:'tc',      name:'Terapia combinada',                   icon:'⊕', color:'c-purple' },
  { id:'mag',     name:'Magnetoterapia',                      icon:'⊛', color:'c-coral' },
  { id:'laser',   name:'Laser 830 nm (LLLT)',                 icon:'✦', color:'c-pink' },
  { id:'rusa',    name:'Corrientes rusas (EMS)',               icon:'⚙', color:'c-purple' },
  { id:'oc',      name:'Ondas de choque radiales',            icon:'◉', color:'c-teal' },
  { id:'galv',    name:'Corriente galvánica',                 icon:'⚗', color:'c-gold' },
  { id:'diad',    name:'Corrientes diadinámica (Bernard)',    icon:'〰', color:'c-red' },
  { id:'ondah',   name:'Onda H (H-Wave Therapy)',             icon:'〜', color:'c-indigo' },
  { id:'hvpc',    name:'Alto voltaje (HVPC)',                 icon:'⚡', color:'c-orange' },
  { id:'trabert', name:'Corriente de Träbert (2/5)',          icon:'◻', color:'c-lime' },
];

/* ===== SIMULADOR — DATOS ===== */
const SIM_CASES = [
  { id:'ag_dolor', phaseLabel:'Aguda — dolor e inflamación', phasePill:'pill-red',
    tissueLabel:'dolor agudo con inflamación',
    regions:['tobillo','rodilla','zona lumbar','hombro'],
    agents:[
      { agentBase:'tens', name:'TENS convencional',
        mech:'Activa fibras A-β que bloquean la transmisión del dolor a nivel medular (Gate Control).',
        sliders:[
          { label:'Frecuencia', unit:'Hz', min:0, max:250, step:5, validMin:80, validMax:150 },
          { label:'Ancho de pulso', unit:'µs', min:0, max:400, step:10, validMin:50, validMax:80 },
          { label:'Duración', unit:'min', min:0, max:60, step:5, validMin:20, validMax:30 },
        ]},
      { agentBase:'us', name:'US pulsado 1:4',
        mech:'Efecto mecánico sin calor: cavitación estable y microcorrientes de fluido que estimulan la reparación celular.',
        sliders:[
          { label:'Intensidad', unit:'W/cm²', min:0, max:2, step:0.1, validMin:0.3, validMax:0.8 },
          { label:'Duración', unit:'min', min:0, max:15, step:1, validMin:5, validMax:8 },
        ]},
      { agentBase:'laser', name:'Laser 830 nm',
        mech:'Absorción en citocromo c oxidasa: aumenta ATP, modula mediadores inflamatorios sin efecto térmico.',
        sliders:[
          { label:'Dosis', unit:'J/cm²', min:0, max:6, step:0.5, validMin:1, validMax:3 },
          { label:'Tiempo por punto', unit:'s', min:0, max:90, step:5, validMin:30, validMax:60 },
        ]},
      { agentBase:'mag', name:'Magnetoterapia',
        mech:'Microcorrientes inducidas que reducen prostaglandinas e interleucinas proinflamatorias.',
        sliders:[
          { label:'Frecuencia', unit:'Hz', min:0, max:50, step:1, validMin:10, validMax:25 },
          { label:'Intensidad', unit:'Gauss', min:0, max:60, step:5, validMin:10, validMax:30 },
          { label:'Duración', unit:'min', min:0, max:45, step:5, validMin:20, validMax:30 },
        ]},
      { agentBase:'diad', name:'Diadinámica DF',
        mech:'La onda completa rectificada a 100 Hz activa fibras Aβ inhibiendo la transmisión nociceptiva en el asta posterior medular.',
        sliders:[
          { label:'Frecuencia', unit:'Hz', min:0, max:150, step:5, validMin:95, validMax:105 },
          { label:'Duración', unit:'min', min:0, max:10, step:1, validMin:2, validMax:3 },
        ]},
    ]},

  { id:'ag_edema', phaseLabel:'Aguda — edema prominente', phasePill:'pill-red',
    tissueLabel:'edema postraumático agudo',
    regions:['tobillo','rodilla','mano','pie'],
    agents:[
      { agentBase:'inter', name:'Interferencial 25–50 Hz',
        mech:'Efecto simpaticolítico: vasodilatación y mejora del retorno venoso y linfático.',
        sliders:[
          { label:'AMF', unit:'Hz', min:0, max:150, step:5, validMin:25, validMax:50 },
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:15, validMax:20 },
        ]},
      { agentBase:'mag', name:'Magnetoterapia',
        mech:'Microcorrientes inducidas que mejoran la permeabilidad capilar y reducen el exudado inflamatorio.',
        sliders:[
          { label:'Frecuencia', unit:'Hz', min:0, max:50, step:1, validMin:10, validMax:25 },
          { label:'Intensidad', unit:'Gauss', min:0, max:40, step:5, validMin:5, validMax:20 },
          { label:'Duración', unit:'min', min:0, max:45, step:5, validMin:20, validMax:30 },
        ]},
      { agentBase:'tens', name:'TENS convencional',
        mech:'Bloqueo de la transmisión del dolor por Gate Control a nivel medular.',
        sliders:[
          { label:'Frecuencia', unit:'Hz', min:0, max:150, step:5, validMin:80, validMax:100 },
          { label:'Ancho de pulso', unit:'µs', min:0, max:100, step:5, validMin:45, validMax:55 },
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:18, validMax:22 },
        ]},
      { agentBase:'laser', name:'Laser 830 nm',
        mech:'Reduce la síntesis de prostaglandinas E2 y modula la actividad de macrófagos en el sitio de inflamación.',
        sliders:[
          { label:'Dosis', unit:'J/cm²', min:0, max:4, step:0.25, validMin:1, validMax:2 },
          { label:'Tiempo por punto', unit:'s', min:0, max:60, step:2, validMin:28, validMax:32 },
        ]},
      { agentBase:'hvpc', name:'Alto voltaje (cátodo)',
        mech:'El electrodo negativo repele las proteínas cargadas negativamente del espacio intersticial, reduciendo la presión osmótica del edema postraumático.',
        sliders:[
          { label:'Frecuencia', unit:'pps', min:0, max:200, step:5, validMin:110, validMax:130 },
          { label:'Duración', unit:'min', min:0, max:45, step:5, validMin:20, validMax:30 },
        ]},
    ]},

  { id:'ag_espasmo', phaseLabel:'Aguda — espasmo muscular', phasePill:'pill-red',
    tissueLabel:'espasmo muscular agudo',
    regions:['zona lumbar','cuello','gemelo','trapecio'],
    agents:[
      { agentBase:'tens', name:'TENS Burst',
        mech:'Combina Gate Control y liberación endorfínica: reduce el tono muscular por vía refleja espinal.',
        sliders:[
          { label:'Frecuencia de ráfaga', unit:'Hz', min:0, max:20, step:1, validMin:2, validMax:4 },
          { label:'Ancho de pulso', unit:'µs', min:0, max:400, step:10, validMin:100, validMax:200 },
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:18, validMax:22 },
        ]},
      { agentBase:'us', name:'US pulsado 1:4',
        mech:'La cavitación estable actúa sobre las terminaciones nerviosas reduciendo la hiperexcitabilidad del huso muscular.',
        sliders:[
          { label:'Intensidad', unit:'W/cm²', min:0, max:2, step:0.1, validMin:0.4, validMax:0.6 },
          { label:'Duración', unit:'min', min:0, max:15, step:1, validMin:5, validMax:8 },
        ]},
      { agentBase:'mag', name:'Magnetoterapia 50–100 Hz',
        mech:'Las frecuencias altas inducen microcorrientes con efecto inhibitorio sobre la placa motora.',
        sliders:[
          { label:'Frecuencia', unit:'Hz', min:0, max:150, step:5, validMin:50, validMax:100 },
          { label:'Intensidad', unit:'Gauss', min:0, max:80, step:5, validMin:20, validMax:50 },
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:18, validMax:22 },
        ]},
      { agentBase:'laser', name:'Laser 830 nm',
        mech:'Inhibe la transmisión en fibras nociceptivas C y A-δ, reduciendo el arco reflejo de espasmo.',
        sliders:[
          { label:'Dosis', unit:'J/cm²', min:0, max:6, step:0.5, validMin:2, validMax:3 },
          { label:'Tiempo por punto', unit:'s', min:0, max:90, step:5, validMin:30, validMax:60 },
        ]},
    ]},

  { id:'sub_dolor', phaseLabel:'Subaguda — dolor residual', phasePill:'pill-amber',
    tissueLabel:'dolor residual subagudo',
    regions:['hombro','rodilla','zona lumbar','cadera'],
    agents:[
      { agentBase:'tens', name:'TENS acupuntural',
        mech:'Estimula la liberación de β-endorfinas y encefalinas en el asta posterior medular y a nivel sistémico.',
        sliders:[
          { label:'Frecuencia', unit:'Hz', min:0, max:30, step:1, validMin:2, validMax:10 },
          { label:'Ancho de pulso', unit:'µs', min:0, max:400, step:10, validMin:200, validMax:300 },
          { label:'Duración', unit:'min', min:0, max:60, step:5, validMin:20, validMax:30 },
        ]},
      { agentBase:'inter', name:'Interferencial 80–100 Hz',
        mech:'Penetración profunda sin resistencia cutánea: activa Gate Control y vasodilatación simpaticolítica simultáneamente.',
        sliders:[
          { label:'AMF', unit:'Hz', min:0, max:150, step:5, validMin:80, validMax:100 },
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:18, validMax:22 },
        ]},
      { agentBase:'laser', name:'Laser 830 nm',
        mech:'830 nm tiene absorción máxima en citocromo c oxidasa. Aumenta ATP, inhibe COX-2 y activa factores de crecimiento.',
        sliders:[
          { label:'Dosis', unit:'J/cm²', min:0, max:8, step:0.5, validMin:3, validMax:5 },
          { label:'Tiempo por punto', unit:'s', min:0, max:90, step:5, validMin:55, validMax:65 },
        ]},
      { agentBase:'tc', name:'Terapia combinada',
        mech:'El US aumenta la permeabilidad de membrana potenciando la respuesta neuronal al TENS de baja frecuencia.',
        sliders:[
          { label:'Duración', unit:'min', min:0, max:30, step:1, validMin:12, validMax:15 },
        ]},
      { agentBase:'diad', name:'Diadinámica CP',
        mech:'La alternancia MF/DF evita la acomodación nerviosa combinando Gate Control (DF 100 Hz) con efecto sedante (MF 50 Hz).',
        sliders:[
          { label:'Duración', unit:'min', min:0, max:15, step:1, validMin:4, validMax:6 },
        ]},
      { agentBase:'trabert', name:'Träbert (corriente 2/5)',
        mech:'El ancho de pulso de 2 ms activa fibras Aβ y A-δ produciendo un hormigueo profundo e intenso con analgesia de 1–3 h post-sesión.',
        sliders:[
          { label:'Intensidad', unit:'mA', min:0, max:100, step:5, validMin:30, validMax:60 },
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:15, validMax:20 },
        ]},
    ]},

  { id:'sub_cicatriz', phaseLabel:'Subaguda — cicatrización', phasePill:'pill-amber',
    tissueLabel:'tejido en fase de cicatrización',
    regions:['antebrazo','pierna','abdomen','muslo'],
    agents:[
      { agentBase:'us', name:'US pulsado 1:1',
        mech:'La cavitación estable y las microcorrientes de fluido estimulan directamente los fibroblastos, aumentando la síntesis de colágeno tipo I.',
        sliders:[
          { label:'Intensidad', unit:'W/cm²', min:0, max:3, step:0.1, validMin:0.5, validMax:1 },
          { label:'Duración', unit:'min', min:0, max:20, step:1, validMin:5, validMax:8 },
        ]},
      { agentBase:'laser', name:'Laser 830 nm',
        mech:'Activa TGF-β1 y VEGF, aumenta la proliferación de fibroblastos y mejora la organización del colágeno neoformado.',
        sliders:[
          { label:'Dosis', unit:'J/cm²', min:0, max:10, step:0.5, validMin:3, validMax:6 },
          { label:'Tiempo por zona', unit:'s', min:0, max:120, step:5, validMin:60, validMax:90 },
        ]},
      { agentBase:'mag', name:'Magnetoterapia 10–25 Hz',
        mech:'Las microcorrientes inducidas activan osteoblastos y fibroblastos, acelerando la fase proliferativa de la cicatrización.',
        sliders:[
          { label:'Frecuencia', unit:'Hz', min:0, max:50, step:1, validMin:10, validMax:25 },
          { label:'Intensidad', unit:'Gauss', min:0, max:50, step:5, validMin:10, validMax:30 },
          { label:'Duración', unit:'min', min:0, max:45, step:5, validMin:20, validMax:30 },
        ]},
      { agentBase:'tc', name:'Terapia combinada',
        mech:'Sinergia entre el efecto mecánico del US y el analgésico de la corriente eléctrica.',
        sliders:[
          { label:'Duración', unit:'min', min:0, max:20, step:1, validMin:8, validMax:12 },
        ]},
      { agentBase:'hvpc', name:'Alto voltaje (cátodo→ánodo)',
        mech:'Imita la corriente de lesión bioeléctrica endógena estimulando la migración de fibroblastos y queratinocitos hacia el lecho de la herida.',
        sliders:[
          { label:'Duración', unit:'min', min:0, max:90, step:5, validMin:45, validMax:60 },
        ]},
      { agentBase:'galv', name:'Galvánica (iontoforesis)',
        mech:'El campo eléctrico introduce iones medicinales por electromigración con concentración local 3–5× mayor que la aplicación tópica.',
        sliders:[
          { label:'Intensidad', unit:'mA/cm²', min:0, max:0.2, step:0.01, validMin:0.05, validMax:0.1 },
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:18, validMax:22 },
        ]},
    ]},

  { id:'sub_edema', phaseLabel:'Subaguda — edema crónico', phasePill:'pill-amber',
    tissueLabel:'edema subagudo persistente',
    regions:['tobillo','rodilla','muñeca','mano'],
    agents:[
      { agentBase:'mag', name:'Magnetoterapia 25–50 Hz',
        mech:'Incrementa la velocidad de flujo capilar y reduce la viscosidad sanguínea por efecto electromagnético.',
        sliders:[
          { label:'Frecuencia', unit:'Hz', min:0, max:100, step:5, validMin:25, validMax:50 },
          { label:'Intensidad', unit:'Gauss', min:0, max:150, step:5, validMin:20, validMax:80 },
          { label:'Duración', unit:'min', min:0, max:45, step:5, validMin:20, validMax:30 },
        ]},
      { agentBase:'inter', name:'Interferencial 25–50 Hz',
        mech:'La contracción muscular rítmica actúa como bomba periférica mejorando el retorno venoso y linfático.',
        sliders:[
          { label:'AMF', unit:'Hz', min:0, max:100, step:5, validMin:25, validMax:50 },
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:18, validMax:22 },
        ]},
      { agentBase:'us', name:'US pulsado 1:4',
        mech:'El micromasaje tisular facilita la reabsorción de proteínas plasmáticas acumuladas en el intersticio.',
        sliders:[
          { label:'Intensidad', unit:'W/cm²', min:0, max:2, step:0.1, validMin:0.5, validMax:1 },
          { label:'Duración', unit:'min', min:0, max:15, step:1, validMin:5, validMax:8 },
        ]},
      { agentBase:'laser', name:'Laser 830 nm',
        mech:'Activa la motilidad de los vasos linfáticos y reduce la producción de mediadores inflamatorios proedematosos.',
        sliders:[
          { label:'Dosis', unit:'J/cm²', min:0, max:8, step:0.5, validMin:2, validMax:4 },
          { label:'Tiempo por zona', unit:'s', min:0, max:90, step:5, validMin:30, validMax:60 },
        ]},
      { agentBase:'diad', name:'Diadinámica LP',
        mech:'La estimulación muscular rítmica del modo LP actúa como bomba periférica que facilita el retorno venoso y linfático del edema subagudo.',
        sliders:[
          { label:'Duración', unit:'min', min:0, max:15, step:1, validMin:5, validMax:8 },
        ]},
    ]},

  { id:'sub_fuerza', phaseLabel:'Subaguda — recuperación de fuerza', phasePill:'pill-amber',
    tissueLabel:'debilidad muscular por desuso',
    regions:['cuádriceps','hombro','gemelo','isquiotibiales'],
    agents:[
      { agentBase:'rusa', name:'Corrientes rusas',
        mech:'La media frecuencia (2500 Hz) supera la resistencia cutánea sin dolor; las ráfagas a 50 Hz generan contracción tetánica fuerte, estimulando fibras tipo II.',
        sliders:[
          { label:'Frecuencia de ráfaga', unit:'Hz', min:0, max:100, step:5, validMin:45, validMax:55 },
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:10, validMax:20 },
        ]},
      { agentBase:'tens', name:'TENS Burst / EMS',
        mech:'Activa selectivamente unidades motoras, previniendo la atrofia por desuso cuando el paciente no puede contraer voluntariamente.',
        sliders:[
          { label:'Frecuencia', unit:'Hz', min:0, max:120, step:5, validMin:50, validMax:80 },
          { label:'Ancho de pulso', unit:'µs', min:0, max:400, step:10, validMin:200, validMax:300 },
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:15, validMax:20 },
        ]},
      { agentBase:'us', name:'US continuo previo',
        mech:'El calor profundo aumenta la extensibilidad del tejido conectivo y la velocidad de conducción nerviosa, preparando el músculo para el ejercicio.',
        sliders:[
          { label:'Intensidad', unit:'W/cm²', min:0, max:2, step:0.1, validMin:0.5, validMax:1 },
          { label:'Duración', unit:'min', min:0, max:10, step:1, validMin:4, validMax:6 },
        ]},
      { agentBase:'laser', name:'Laser 830 nm',
        mech:'Reduce el daño oxidativo post-ejercicio, disminuye el lactato intramuscular y acelera la resíntesis de ATP.',
        sliders:[
          { label:'Dosis', unit:'J/cm²', min:0, max:8, step:0.5, validMin:3, validMax:5 },
          { label:'Tiempo por zona', unit:'s', min:0, max:90, step:5, validMin:55, validMax:65 },
        ]},
    ]},

  { id:'cr_articular', phaseLabel:'Crónica — articular / hueso', phasePill:'pill-green',
    tissueLabel:'afección articular crónica',
    regions:['rodilla','cadera','hombro','mano'],
    agents:[
      { agentBase:'mag', name:'Magnetoterapia 1–25 Hz',
        mech:'Estimula osteoblastos y activa la síntesis de colágeno óseo.',
        sliders:[
          { label:'Frecuencia', unit:'Hz', min:0, max:50, step:1, validMin:1, validMax:25 },
          { label:'Intensidad', unit:'Gauss', min:0, max:150, step:5, validMin:10, validMax:100 },
          { label:'Duración', unit:'min', min:0, max:45, step:5, validMin:20, validMax:30 },
        ]},
      { agentBase:'us', name:'US continuo',
        mech:'El calor profundo (3–5 cm) aumenta la extensibilidad del colágeno cápsular y la velocidad de conducción nerviosa articular.',
        sliders:[
          { label:'Intensidad', unit:'W/cm²', min:0, max:3, step:0.1, validMin:1, validMax:2 },
          { label:'Duración', unit:'min', min:0, max:20, step:1, validMin:8, validMax:10 },
        ]},
      { agentBase:'inter', name:'Interferencial 0–100 Hz',
        mech:'La frecuencia variable evita la acomodación nerviosa y combina efectos analgésicos de alta y baja frecuencia en profundidad.',
        sliders:[
          { label:'Frecuencia (barrido)', unit:'Hz', min:0, max:150, step:5, validMin:0, validMax:100 },
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:18, validMax:22 },
        ]},
      { agentBase:'laser', name:'Laser 830 nm',
        mech:'A 830 nm la penetración alcanza 3–5 cm, activando los condrocitos articulares y reduciendo la síntesis de metaloproteasas degradativas.',
        sliders:[
          { label:'Dosis', unit:'J/cm²', min:0, max:12, step:0.5, validMin:5, validMax:8 },
          { label:'Tiempo por punto', unit:'s', min:0, max:120, step:5, validMin:85, validMax:95 },
        ]},
      { agentBase:'diad', name:'Diadinámica CP/LP',
        mech:'CP evita la acomodación nerviosa combinando efectos sedante y analgésico. LP añade estimulación trófica articular con componente galvánico mayor.',
        sliders:[
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:15, validMax:20 },
        ]},
      { agentBase:'trabert', name:'Träbert',
        mech:'Los pulsos de 2 ms activan fibras articulares profundas (A-δ), produciendo analgesia en estructuras articulares profundas.',
        sliders:[
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:15, validMax:20 },
        ]},
    ]},

  { id:'cr_muscular', phaseLabel:'Crónica — músculo / tejido blando', phasePill:'pill-green',
    tissueLabel:'fibrosis muscular crónica',
    regions:['isquiotibiales','trapecio','gemelo','zona lumbar'],
    agents:[
      { agentBase:'rusa', name:'Corrientes rusas',
        mech:'Estándar para recuperación de fuerza post-inmovilización. La media frecuencia permite reclutar fibras rápidas (tipo II) sin dolor cutáneo.',
        sliders:[
          { label:'Frecuencia de ráfaga', unit:'Hz', min:0, max:100, step:5, validMin:45, validMax:55 },
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:15, validMax:20 },
        ]},
      { agentBase:'us', name:'US continuo',
        mech:'El calor profundo aumenta la distensibilidad del tejido conectivo. Aplicar antes del estiramiento para maximizar el alargamiento permanente.',
        sliders:[
          { label:'Intensidad', unit:'W/cm²', min:0, max:3, step:0.1, validMin:1, validMax:2 },
          { label:'Duración', unit:'min', min:0, max:15, step:1, validMin:7, validMax:9 },
        ]},
      { agentBase:'tens', name:'TENS acupuntural',
        mech:'Estimula la producción de β-endorfinas y dinorfinas en el SNC, con efecto analgésico prolongado de 4–6 horas post-sesión.',
        sliders:[
          { label:'Frecuencia', unit:'Hz', min:0, max:30, step:1, validMin:2, validMax:10 },
          { label:'Ancho de pulso', unit:'µs', min:0, max:400, step:10, validMin:200, validMax:300 },
          { label:'Duración', unit:'min', min:0, max:60, step:5, validMin:20, validMax:30 },
        ]},
      { agentBase:'laser', name:'Laser 830 nm',
        mech:'Inhibe la activación de miofibroblastos y reduce la producción de TGF-β1, previniendo la fibrosis muscular crónica.',
        sliders:[
          { label:'Dosis', unit:'J/cm²', min:0, max:10, step:0.5, validMin:4, validMax:6 },
          { label:'Tiempo por zona', unit:'s', min:0, max:150, step:5, validMin:60, validMax:90 },
        ]},
      { agentBase:'diad', name:'Diadinámica RS',
        mech:'El modo RS genera contracciones musculares rítmicas intensas similares a EMS para reeducación muscular y mantenimiento del trofismo.',
        sliders:[
          { label:'Duración', unit:'min', min:0, max:20, step:1, validMin:5, validMax:10 },
        ]},
      { agentBase:'trabert', name:'Träbert',
        mech:'El ancho de pulso de 2 ms activa fibras profundas del músculo generando analgesia duradera sin producir contracción muscular visible.',
        sliders:[
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:15, validMax:20 },
        ]},
    ]},

  { id:'cr_neuro', phaseLabel:'Crónica — dolor neuropático / punto gatillo', phasePill:'pill-blue',
    tissueLabel:'dolor neuropático / punto gatillo miofascial',
    regions:['trapecio superior','glúteo','cervical','antebrazo'],
    agents:[
      { agentBase:'tens', name:'TENS acupuntural',
        mech:'Activa el sistema opioide endógeno a nivel medular y supramedular, eficaz en dolor neuropático cuando fallan otras modalidades.',
        sliders:[
          { label:'Frecuencia', unit:'Hz', min:0, max:15, step:1, validMin:2, validMax:4 },
          { label:'Ancho de pulso', unit:'µs', min:0, max:400, step:10, validMin:250, validMax:300 },
          { label:'Duración', unit:'min', min:0, max:60, step:5, validMin:20, validMax:30 },
        ]},
      { agentBase:'laser', name:'Laser 830 nm sobre PG',
        mech:'A 830 nm penetra 3–5 cm en músculo: reduce la actividad eléctrica del PG, normaliza el potencial de placa motora sin punción.',
        sliders:[
          { label:'Dosis', unit:'J/punto', min:0, max:4, step:0.25, validMin:0.5, validMax:2 },
          { label:'Tiempo por punto', unit:'s', min:0, max:60, step:2, validMin:20, validMax:30 },
        ]},
      { agentBase:'inter', name:'Interferencial 1–10 Hz',
        mech:'Similar al TENS acupuntural pero con mayor penetración tisular para estructuras profundas.',
        sliders:[
          { label:'AMF', unit:'Hz', min:0, max:30, step:1, validMin:1, validMax:10 },
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:15, validMax:20 },
        ]},
      { agentBase:'mag', name:'Magnetoterapia 10–25 Hz',
        mech:'Regula los canales de sodio y calcio en fibras nerviosas lesionadas, reduciendo la hiperexcitabilidad neuropática.',
        sliders:[
          { label:'Frecuencia', unit:'Hz', min:0, max:50, step:1, validMin:10, validMax:25 },
          { label:'Intensidad', unit:'Gauss', min:0, max:50, step:5, validMin:10, validMax:30 },
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:18, validMax:22 },
        ]},
      { agentBase:'ondah', name:'Onda H',
        mech:'La forma de onda exponencial activa fibras neuropáticas dañadas con menor densidad de corriente; la baja frecuencia libera opioides endógenos y activa BDNF/NGF para recuperación axonal.',
        sliders:[
          { label:'Frecuencia', unit:'Hz', min:0, max:30, step:1, validMin:2, validMax:10 },
          { label:'Duración', unit:'min', min:0, max:60, step:5, validMin:30, validMax:45 },
        ]},
      { agentBase:'trabert', name:'Träbert',
        mech:'Electrodo activo sobre el trayecto del nervio doloroso. El ancho de pulso de 2 ms inhibe la hiperexcitabilidad neuropática de fibras A-δ.',
        sliders:[
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:15, validMax:20 },
        ]},
      { agentBase:'galv', name:'Galvánica (trofismo axonal)',
        mech:'La corriente catódica activa la bomba Na⁺/K⁺-ATPasa mejorando la nutrición axonal y la velocidad de conducción nerviosa periférica.',
        sliders:[
          { label:'Intensidad', unit:'mA/cm²', min:0, max:0.2, step:0.01, validMin:0.05, validMax:0.1 },
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:15, validMax:20 },
        ]},
    ]},

  { id:'tend_sub', phaseLabel:'Tendinopatía subaguda-crónica', phasePill:'pill-amber',
    tissueLabel:'tendinopatía subaguda-crónica',
    regions:['tendón de Aquiles','manguito rotador','tendón rotuliano','epicóndilo'],
    agents:[
      { agentBase:'us', name:'US continuo/pulsado',
        mech:'El US mejora la organización de las fibras de colágeno durante la fase reparativa del tendón.',
        sliders:[
          { label:'Intensidad', unit:'W/cm²', min:0, max:3, step:0.1, validMin:0.5, validMax:1.5 },
          { label:'Duración', unit:'min', min:0, max:15, step:1, validMin:5, validMax:8 },
        ]},
      { agentBase:'laser', name:'Laser 830 nm',
        mech:'830 nm tiene alta absorción en colágeno tipo I. Activa la proliferación de tenocitos y mejora la síntesis de colágeno estructurado.',
        sliders:[
          { label:'Dosis', unit:'J/cm²', min:0, max:10, step:0.5, validMin:4, validMax:6 },
          { label:'Tiempo por zona', unit:'s', min:0, max:120, step:5, validMin:60, validMax:90 },
        ]},
      { agentBase:'tc', name:'Terapia combinada',
        mech:'Sinergia: el US prepara el tejido y el TENS controla el dolor durante la recuperación funcional.',
        sliders:[
          { label:'Duración', unit:'min', min:0, max:25, step:1, validMin:10, validMax:12 },
        ]},
      { agentBase:'inter', name:'Interferencial 80 Hz',
        mech:'Alta frecuencia interferencial activa Gate Control en profundidad, apropiado para tendones profundos (aquiles, manguito rotador).',
        sliders:[
          { label:'AMF', unit:'Hz', min:0, max:150, step:5, validMin:75, validMax:85 },
          { label:'Duración', unit:'min', min:0, max:40, step:5, validMin:15, validMax:20 },
        ]},
    ]},

  { id:'tend_cr', phaseLabel:'Tendinopatía crónica refractaria', phasePill:'pill-red',
    tissueLabel:'tendinopatía crónica refractaria (>3 meses)',
    regions:['tendón de Aquiles','tendón rotuliano','fascia plantar','epicóndilo'],
    agents:[
      { agentBase:'oc', name:'Ondas de choque radiales',
        mech:'Generan microtraumatismo controlado que reinicia la cascada de reparación: estimulan VEGF, IGF-1 y TGF-β1. Rompen calcificaciones por ondas de presión.',
        sliders:[
          { label:'Presión', unit:'bar', min:0, max:6, step:0.5, validMin:1.5, validMax:4 },
          { label:'Frecuencia', unit:'Hz', min:0, max:25, step:1, validMin:8, validMax:15 },
          { label:'Nº de impactos', unit:'impactos', min:0, max:3000, step:100, validMin:1500, validMax:2500 },
        ]},
      { agentBase:'laser', name:'Laser 830 nm',
        mech:'Dosis altas en pulsado para máxima penetración en tendones profundos. Combinar con ondas de choque potencia el efecto regenerador.',
        sliders:[
          { label:'Dosis', unit:'J/cm²', min:0, max:15, step:0.5, validMin:6, validMax:10 },
          { label:'Tiempo por zona', unit:'s', min:0, max:150, step:5, validMin:90, validMax:120 },
        ]},
      { agentBase:'us', name:'US continuo',
        mech:'El calor profundo desnaturaliza las proteínas anormales del tendón degenerativo, favoreciendo su reabsorción y reorganización.',
        sliders:[
          { label:'Intensidad', unit:'W/cm²', min:0, max:3, step:0.1, validMin:1.5, validMax:2 },
          { label:'Duración', unit:'min', min:0, max:20, step:1, validMin:8, validMax:10 },
        ]},
      { agentBase:'mag', name:'Magnetoterapia',
        mech:'Estimula la proliferación de tenocitos y la síntesis de proteoglicanos de la matriz extracelular tendinosa.',
        sliders:[
          { label:'Frecuencia', unit:'Hz', min:0, max:50, step:1, validMin:10, validMax:25 },
          { label:'Intensidad', unit:'Gauss', min:0, max:100, step:5, validMin:30, validMax:80 },
          { label:'Duración', unit:'min', min:0, max:45, step:5, validMin:20, validMax:30 },
        ]},
    ]},
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

function survivingAgents(patientCase, comorbidity) {
  if (!comorbidity) return patientCase.agents;
  return patientCase.agents.filter(a => !comorbidity.excludes.includes(a.agentBase));
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
  const blocked = survivingAgents(patientCase, comorbidity).length === 0;
  return { case: patientCase, region, age, comorbidity, blocked };
}

/* ===== SIMULADOR — UTILIDADES ===== */
const NONE_OPTION = 'Ninguno de estos — contraindicado, derivar o posponer';

function shuffle(arr, rng) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
  }
  return copy;
}

/* ===== SIMULADOR — VALIDACIÓN PASO 1 (AGENTE) ===== */
function findHomeCase(agentBase) {
  return SIM_CASES.find(c => c.agents.some(a => a.agentBase === agentBase)) || null;
}

function evaluateAgentChoice(patient, chosenBase) {
  const agents = patient.case.agents;
  const validNamesText = agents.map(a => a.name).join(' / ');

  if (chosenBase === NONE_OPTION) {
    if (patient.blocked) {
      return {
        correct: true, advance: false,
        explanation: `${patient.comorbidity.label} contraindica todos los agentes indicados para este cuadro (${validNamesText}) — corresponde derivar o posponer.`,
      };
    }
    return {
      correct: false, advance: false,
      explanation: patient.comorbidity
        ? `Sí hay opciones indicadas aquí (${validNamesText}): ${patient.comorbidity.label} no las contraindica a todas.`
        : `Sí hay opciones indicadas aquí (${validNamesText}): no hay contraindicación activa para este paciente.`,
    };
  }

  const match = agents.find(a => a.agentBase === chosenBase);
  if (match) {
    const excluded = !!(patient.comorbidity && patient.comorbidity.excludes.includes(match.agentBase));
    if (!excluded) {
      return { correct: true, advance: true, agent: match, explanation: match.mech };
    }
    return {
      correct: false, advance: false,
      explanation: `${match.name} sería un agente indicado para este cuadro, pero ${patient.comorbidity.label} lo contraindica específicamente — elegí otra opción válida, o «Ninguno» si ninguna sobrevive.`,
    };
  }

  const home = findHomeCase(chosenBase);
  const homeAgent = home ? home.agents.find(a => a.agentBase === chosenBase) : null;
  const catalogEntry = AGENT_CATALOG.find(a => a.id === chosenBase);
  const chosenName = homeAgent ? homeAgent.name : (catalogEntry ? catalogEntry.name : chosenBase);
  const explanation = home
    ? `${chosenName} es el agente de referencia para «${home.phaseLabel} — ${home.tissueLabel}», no para este cuadro.`
    : `${chosenName} no es una opción indicada para este cuadro clínico.`;
  return { correct: false, advance: false, explanation };
}

/* ===== SIMULADOR — VALIDACIÓN PASO 2 (PARÁMETROS) ===== */
function evaluateSliders(agent, values) {
  const results = agent.sliders.map((s, i) => {
    const value = values[i];
    const ok = value >= s.validMin && value <= s.validMax;
    return { label: s.label, unit: s.unit, value, ok, validMin: s.validMin, validMax: s.validMax };
  });
  const allOk = results.every(r => r.ok);
  return { results, allOk };
}

/* ===== SIMULADOR — CAPA DOM ===== */
let simPatient = null;
let simChoices = [];
let simChosenAgent = null;
let simStep = 1;
let simAgentFeedback = null;
let simSliderFeedback = null;

function renderPatientCard(container) {
  const card = document.createElement('div');
  card.className = 'question-card';

  const pill = document.createElement('div');
  pill.className = `phase-pill ${simPatient.case.phasePill}`;
  pill.innerHTML = `<span class="phase-dot"></span>${simPatient.case.phaseLabel}`;
  card.appendChild(pill);

  const badges = document.createElement('div');
  badges.className = 'patient-badges';
  const regionTag = document.createElement('span');
  regionTag.className = 'tag';
  regionTag.style.borderColor = 'var(--border2)';
  regionTag.style.color = 'var(--text2)';
  regionTag.textContent = simPatient.region;
  badges.appendChild(regionTag);
  if (simPatient.comorbidity) {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.style.borderColor = 'var(--red-border)';
    tag.style.color = 'var(--red)';
    tag.textContent = simPatient.comorbidity.label;
    badges.appendChild(tag);
  }
  card.appendChild(badges);

  const vignette = document.createElement('div');
  vignette.className = 'q-hint';
  vignette.textContent = `Paciente de ${simPatient.age} años con ${simPatient.case.tissueLabel} en ${simPatient.region}.`;
  card.appendChild(vignette);

  container.appendChild(card);
}

function renderStep1(container) {
  const wrap = document.createElement('div');
  wrap.className = 'question-card';

  const title = document.createElement('div');
  title.className = 'q-title';
  title.textContent = '¿Qué agente físico aplicarías?';
  wrap.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'agents-grid';
  simChoices.forEach(choice => {
    const isNone = choice === NONE_OPTION;
    const card = document.createElement('div');
    card.className = isNone ? 'agent-card c-gray' : `agent-card ${choice.color}`;
    card.innerHTML = isNone
      ? `<div class="ac-name">${NONE_OPTION}</div>`
      : `<div class="ac-name">${choice.icon} ${choice.name}</div>`;
    card.onclick = () => handleAgentChoice(isNone ? NONE_OPTION : choice.id, card, grid);
    grid.appendChild(card);
  });
  wrap.appendChild(grid);
  container.appendChild(wrap);
}

function handleAgentChoice(chosenBase, card, grid) {
  const result = evaluateAgentChoice(simPatient, chosenBase);
  simAgentFeedback = result;
  simChosenAgent = result.agent || null;

  grid.querySelectorAll('.agent-card').forEach(c => {
    c.onclick = null;
    c.classList.add('disabled');
  });
  card.classList.add(result.correct ? 'correct' : 'incorrect');

  const fb = document.createElement('div');
  fb.className = 'note-box';
  fb.style.marginTop = '14px';
  fb.innerHTML = `<strong>${result.correct ? '✅ Correcto.' : '❌ No es lo indicado.'}</strong> ${result.explanation}`;
  grid.parentElement.appendChild(fb);

  const btn = document.createElement('button');
  btn.className = 'restart-btn';
  if (result.advance) {
    btn.textContent = 'Continuar → ajustar parámetros';
    btn.onclick = () => { simStep = 2; renderSim(); };
  } else {
    btn.textContent = '↻ Siguiente paciente';
    btn.onclick = () => newSimPatient();
  }
  grid.parentElement.appendChild(btn);
}

let simSliderValues = [];

function randomSliderStart(slider, rng) {
  const steps = Math.round((slider.max - slider.min) / slider.step);
  const stepIndex = Math.floor(rng() * (steps + 1));
  const raw = slider.min + stepIndex * slider.step;
  return Math.round(raw * 100) / 100;
}

function renderStep2(container) {
  const agent = simChosenAgent;
  simSliderValues = agent.sliders.map(s => randomSliderStart(s, Math.random));

  const wrap = document.createElement('div');
  wrap.className = 'question-card';

  const title = document.createElement('div');
  title.className = 'q-title';
  title.textContent = `Ajustar parámetros — ${agent.name}`;
  wrap.appendChild(title);

  agent.sliders.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'sim-slider-row';

    const labelRow = document.createElement('div');
    labelRow.className = 'sim-slider-label';
    const nameSpan = document.createElement('span');
    nameSpan.textContent = s.label;
    const valSpan = document.createElement('span');
    valSpan.className = 'sim-slider-value';
    valSpan.textContent = `${simSliderValues[i]} ${s.unit}`;
    labelRow.appendChild(nameSpan);
    labelRow.appendChild(valSpan);

    const input = document.createElement('input');
    input.type = 'range';
    input.className = 'sim-slider';
    input.min = s.min; input.max = s.max; input.step = s.step;
    input.value = simSliderValues[i];
    input.oninput = () => {
      simSliderValues[i] = parseFloat(input.value);
      valSpan.textContent = `${simSliderValues[i]} ${s.unit}`;
    };

    row.appendChild(labelRow);
    row.appendChild(input);
    wrap.appendChild(row);
  });

  const applyBtn = document.createElement('button');
  applyBtn.className = 'restart-btn';
  applyBtn.textContent = 'Aplicar tratamiento';
  applyBtn.onclick = () => {
    simSliderFeedback = evaluateSliders(agent, simSliderValues);
    simStep = 3;
    renderSim();
  };
  wrap.appendChild(applyBtn);
  container.appendChild(wrap);
}

function renderStep3(container) {
  const wrap = document.createElement('div');
  wrap.className = 'question-card';

  if (!simSliderFeedback) {
    const fb = document.createElement('div');
    fb.className = 'note-box';
    fb.innerHTML = `<strong>${simAgentFeedback.correct ? '✅' : '❌'}</strong> ${simAgentFeedback.explanation}`;
    wrap.appendChild(fb);
  } else {
    const verdict = document.createElement('div');
    verdict.className = `phase-pill ${simSliderFeedback.allOk ? 'pill-green' : 'pill-red'}`;
    verdict.innerHTML = `<span class="phase-dot"></span>${simSliderFeedback.allOk ? 'Tratamiento correcto' : 'Parámetros a revisar'}`;
    wrap.appendChild(verdict);

    simSliderFeedback.results.forEach(r => {
      const row = document.createElement('div');
      row.className = 'sim-param-row';
      row.innerHTML = `<span>${r.ok ? '✅' : '❌'} ${r.label}: <strong>${r.value} ${r.unit}</strong></span><span class="sim-param-range">rango válido: ${r.validMin}–${r.validMax} ${r.unit}</span>`;
      wrap.appendChild(row);
    });

    const mech = document.createElement('div');
    mech.className = 'note-box';
    mech.innerHTML = simChosenAgent.mech;
    wrap.appendChild(mech);
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = 'restart-btn';
  nextBtn.textContent = '↻ Siguiente paciente';
  nextBtn.onclick = () => newSimPatient();
  wrap.appendChild(nextBtn);
  container.appendChild(wrap);
}

function renderSim() {
  const c = document.getElementById('sim-content');
  c.innerHTML = '';
  renderPatientCard(c);
  if (simStep === 1) renderStep1(c);
  else if (simStep === 2) renderStep2(c);
  else renderStep3(c);
}

function newSimPatient() {
  simPatient = generatePatient(Math.random);
  simChoices = shuffle(AGENT_CATALOG, Math.random);
  if (simPatient.comorbidity) simChoices = simChoices.concat([NONE_OPTION]);
  simChosenAgent = null;
  simAgentFeedback = null;
  simSliderFeedback = null;
  simStep = 1;
  renderSim();
}

function buildSim() {
  newSimPatient();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AGENT_CATALOG, SIM_CASES, SIM_COMORBILIDADES,
    pickRandomItem, pickRandomInt, survivingAgents, generatePatient,
    NONE_OPTION, shuffle, findHomeCase, evaluateAgentChoice, evaluateSliders,
  };
}
