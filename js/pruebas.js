/* ===== PRUEBAS FUNCIONALES ===== */
const PRUEBAS_SEGMENTOS = [
  { id: 'columna-cervical', label: 'Columna Cervical', icon: '🔵' },
  { id: 'hombro',           label: 'Hombro',           icon: '🟣' },
  { id: 'codo',             label: 'Codo',             icon: '🟠' },
  { id: 'muneca-mano',      label: 'Muñeca y Mano',    icon: '🟡' },
  { id: 'columna-lumbar',   label: 'Columna Lumbar',   icon: '🔴' },
  { id: 'cadera',           label: 'Cadera',           icon: '🟤' },
  { id: 'rodilla',          label: 'Rodilla',          icon: '🟢' },
  { id: 'tobillo-pie',      label: 'Tobillo y Pie',    icon: '⚪' },
];

const PRUEBAS_DATA = {
  'columna-cervical': [
    {
      nombre: 'Test de Spurling',
      color: 'red',
      objetivo: 'Detectar compresión radicular cervical o foraminal.',
      pasos: [
        'Paciente sentado, cuello en posición neutra.',
        'Inclina la cabeza hacia el lado sintomático.',
        'Aplica compresión axial suave sobre el vértex.',
        'Positivo: reproduce dolor o parestesias en el brazo ipsilateral.',
      ],
    },
    {
      nombre: 'Test de Distracción Cervical',
      color: 'blue',
      objetivo: 'Evaluar si la tracción alivia síntomas radiculares.',
      pasos: [
        'Paciente en decúbito supino.',
        'Toma la cabeza con ambas manos bajo el occipucio y el mentón.',
        'Aplica tracción axial suave (≈ 7–10 kg).',
        'Positivo: alivio del dolor o parestesias en el brazo.',
      ],
    },
    {
      nombre: 'Test de Lhermitte',
      color: 'amber',
      objetivo: 'Detectar irritación medular cervical (mielopatía).',
      pasos: [
        'Paciente sentado con cuello en posición neutra.',
        'Flexiona pasivamente el cuello hacia el pecho.',
        'Positivo: sensación eléctrica que baja por la columna o extremidades.',
      ],
    },
    {
      nombre: 'Test de Valsalva Cervical',
      color: 'purple',
      objetivo: 'Detectar lesiones que aumentan la presión intratecal (hernia, tumor).',
      pasos: [
        'Paciente sentado.',
        'Pide que realice una maniobra de Valsalva (pujar como si fuera al baño).',
        'Positivo: aumento del dolor cervical o irradiación al brazo.',
      ],
    },
    {
      nombre: 'Test de Rotación Cervical (ULTT1)',
      color: 'teal',
      objetivo: 'Evaluar movilidad y síntomas con tensión neural del nervio mediano.',
      pasos: [
        'Paciente en decúbito supino.',
        'Deprime el hombro, abduce el brazo a 90°, extiende el codo.',
        'Supina el antebrazo, extiende la muñeca y los dedos.',
        'Inclina la cabeza contralateral para añadir tensión neural.',
        'Positivo: reproduce síntomas en el territorio del nervio mediano.',
      ],
    },
  ],

  'hombro': [
    {
      nombre: 'Test de Neer',
      color: 'amber',
      objetivo: 'Detectar síndrome de pinzamiento subacromial.',
      pasos: [
        'Paciente sentado, brazo relajado.',
        'Estabiliza la escápula con una mano.',
        'Eleva pasivamente el brazo en flexión con el codo extendido.',
        'Positivo: dolor en el arco de 70°–120° de flexión.',
      ],
    },
    {
      nombre: 'Test de Hawkins-Kennedy',
      color: 'amber',
      objetivo: 'Detectar pinzamiento del supraespinoso bajo el arco coracoacromial.',
      pasos: [
        'Paciente sentado.',
        'Flexiona el hombro a 90° con el codo a 90°.',
        'Rota internamente el hombro de forma pasiva.',
        'Positivo: dolor en la región subacromial.',
      ],
    },
    {
      nombre: 'Test de Jobe (Empty Can)',
      color: 'red',
      objetivo: 'Evaluar integridad del músculo supraespinoso.',
      pasos: [
        'Paciente de pie o sentado.',
        'Abduce el brazo a 90° en el plano de la escápula (30° anterior).',
        'Rota internamente el hombro (pulgar hacia abajo, "lata vacía").',
        'Aplica resistencia hacia abajo mientras el paciente mantiene la posición.',
        'Positivo: debilidad o dolor reproduce síntomas del supraespinoso.',
      ],
    },
    {
      nombre: 'Test de Apprehension (Inestabilidad Anterior)',
      color: 'blue',
      objetivo: 'Detectar inestabilidad glenohumeral anterior.',
      pasos: [
        'Paciente en decúbito supino.',
        'Abduce el hombro a 90° y flexiona el codo a 90°.',
        'Rota externamente el hombro de forma progresiva.',
        'Positivo: sensación de aprensión o miedo a la luxación.',
      ],
    },
    {
      nombre: 'Test de Speed',
      color: 'teal',
      objetivo: 'Evaluar el tendón de la porción larga del bíceps.',
      pasos: [
        'Paciente de pie, codo extendido, antebrazo supinado.',
        'Flexiona el hombro a 60°.',
        'Aplica resistencia a la flexión del hombro.',
        'Positivo: dolor en el surco bicipital.',
      ],
    },
    {
      nombre: 'Test de O\'Brien (SLAP)',
      color: 'purple',
      objetivo: 'Detectar lesiones del labrum superior (SLAP).',
      pasos: [
        'Paciente de pie, flexiona el hombro a 90°, aducción de 10–15°.',
        'Rota internamente el brazo (pulgar hacia abajo).',
        'Aplica resistencia hacia abajo.',
        'Luego repite con el brazo en rotación externa (palma arriba).',
        'Positivo: dolor o clic en rotación interna que desaparece en rotación externa.',
      ],
    },
  ],

  'codo': [
    {
      nombre: 'Test de Cozen (Epicondilitis Lateral)',
      color: 'red',
      objetivo: 'Detectar epicondilitis lateral (codo de tenista).',
      pasos: [
        'Paciente sentado, codo en ligera flexión.',
        'Estabiliza el codo con una mano.',
        'Pide al paciente que extienda la muñeca con el puño cerrado.',
        'Aplica resistencia a la extensión de la muñeca.',
        'Positivo: dolor en el epicóndilo lateral.',
      ],
    },
    {
      nombre: 'Test de Golfer (Epicondilitis Medial)',
      color: 'amber',
      objetivo: 'Detectar epicondilitis medial (codo de golfista).',
      pasos: [
        'Paciente sentado, codo extendido.',
        'Supina el antebrazo y extiende la muñeca pasivamente.',
        'Positivo: dolor en el epicóndilo medial.',
      ],
    },
    {
      nombre: 'Test de Valgus Stress',
      color: 'blue',
      objetivo: 'Evaluar integridad del ligamento colateral medial.',
      pasos: [
        'Paciente sentado, codo en 20–30° de flexión.',
        'Estabiliza el húmero distal.',
        'Aplica fuerza en valgo sobre el codo.',
        'Positivo: dolor medial o apertura articular.',
      ],
    },
    {
      nombre: 'Test de Tinel en Codo',
      color: 'purple',
      objetivo: 'Detectar neuropatía del nervio cubital en el canal epitroclear.',
      pasos: [
        'Paciente sentado, codo en 90° de flexión.',
        'Percute suavemente el surco epitroclear (cara medial del codo).',
        'Positivo: parestesias o descarga eléctrica hacia el 4.° y 5.° dedo.',
      ],
    },
  ],

  'muneca-mano': [
    {
      nombre: 'Test de Phalen',
      color: 'amber',
      objetivo: 'Detectar síndrome del túnel carpiano.',
      pasos: [
        'Paciente sentado.',
        'Flexiona ambas muñecas al máximo y mantiene las dorsos de las manos juntos.',
        'Mantiene la posición durante 60 segundos.',
        'Positivo: parestesias en el territorio del nervio mediano (1.°–3.° dedo y mitad radial del 4.°).',
      ],
    },
    {
      nombre: 'Test de Tinel en Muñeca',
      color: 'blue',
      objetivo: 'Detectar síndrome del túnel carpiano.',
      pasos: [
        'Paciente con la muñeca en posición neutra.',
        'Percute suavemente sobre el retináculo flexor (cara palmar de la muñeca).',
        'Positivo: parestesias en el territorio del nervio mediano.',
      ],
    },
    {
      nombre: 'Test de Finkelstein',
      color: 'red',
      objetivo: 'Detectar tenosinovitis de De Quervain.',
      pasos: [
        'Paciente cierra el pulgar dentro del puño.',
        'Desvía la muñeca hacia el lado cubital (desviación cubital pasiva).',
        'Positivo: dolor agudo en la tabaquera anatómica y proceso estiloideo radial.',
      ],
    },
    {
      nombre: 'Test de Allen',
      color: 'teal',
      objetivo: 'Evaluar la permeabilidad de las arterias radial y cubital.',
      pasos: [
        'Paciente cierra el puño con fuerza.',
        'Comprime simultáneamente las arterias radial y cubital.',
        'Pide que abra la mano (palma pálida).',
        'Libera una arteria y observa el retorno del color.',
        'Positivo (patológico): retorno lento (> 5 s) o ausente indica oclusión.',
      ],
    },
  ],

  'columna-lumbar': [
    {
      nombre: 'Test de Lasègue (SLR)',
      color: 'red',
      objetivo: 'Detectar irritación radicular lumbar (L4–S1) por hernia discal.',
      pasos: [
        'Paciente en decúbito supino.',
        'Eleva la pierna extendida de forma pasiva.',
        'Positivo: dolor irradiado por debajo de la rodilla antes de los 70° de elevación.',
        'Nota: el dolor solo en la zona lumbar no es positivo.',
      ],
    },
    {
      nombre: 'Test de Bragard',
      color: 'red',
      objetivo: 'Confirmar irritación radicular (complementa Lasègue).',
      pasos: [
        'Realiza el test de Lasègue hasta el ángulo de dolor.',
        'Baja ligeramente la pierna hasta que desaparezca el dolor.',
        'Dorsiflexiona el pie pasivamente.',
        'Positivo: reaparece el dolor irradiado.',
      ],
    },
    {
      nombre: 'Test de Slump',
      color: 'amber',
      objetivo: 'Evaluar tensión neural del sistema nervioso central y periférico.',
      pasos: [
        'Paciente sentado al borde de la camilla.',
        'Flexiona el tronco y el cuello (mentón al pecho).',
        'Extiende la rodilla del lado sintomático.',
        'Dorsiflexiona el pie.',
        'Positivo: reproduce síntomas neurales que se alivian al extender el cuello.',
      ],
    },
    {
      nombre: 'Test de Patrick (FABER)',
      color: 'blue',
      objetivo: 'Diferenciar patología de cadera vs. sacroilíaca.',
      pasos: [
        'Paciente en decúbito supino.',
        'Coloca el tobillo del lado a evaluar sobre la rodilla contralateral (posición en "4").',
        'Aplica presión suave hacia abajo sobre la rodilla flexionada.',
        'Positivo: dolor en la ingle (cadera) o en la región sacroilíaca.',
      ],
    },
    {
      nombre: 'Test de Gaenslen',
      color: 'purple',
      objetivo: 'Detectar disfunción de la articulación sacroilíaca.',
      pasos: [
        'Paciente en decúbito supino, cerca del borde de la camilla.',
        'Flexiona la cadera y rodilla del lado sano hacia el pecho.',
        'Deja caer la pierna del lado a evaluar fuera de la camilla (extensión de cadera).',
        'Positivo: dolor en la región sacroilíaca ipsilateral.',
      ],
    },
    {
      nombre: 'Test de Waddell',
      color: 'gray',
      objetivo: 'Identificar signos no orgánicos en dolor lumbar crónico.',
      pasos: [
        'Evalúa 5 categorías: sensibilidad superficial, simulación, distracción, distribución regional, reacción exagerada.',
        'Aplica presión suave en la cabeza (no debería causar dolor lumbar).',
        'Realiza rotación del tronco en bloque (hombros y pelvis juntos).',
        'Positivo: ≥ 3 de 5 signos sugieren componente no orgánico.',
      ],
    },
  ],

  'cadera': [
    {
      nombre: 'Test de Thomas',
      color: 'amber',
      objetivo: 'Detectar contractura en flexión de la cadera (psoas ilíaco).',
      pasos: [
        'Paciente en decúbito supino.',
        'Flexiona ambas caderas al máximo para aplanar la lordosis lumbar.',
        'Extiende lentamente la pierna a evaluar.',
        'Positivo: la pierna no llega a la camilla o la pelvis se inclina anteriormente.',
      ],
    },
    {
      nombre: 'Test de Ober',
      color: 'blue',
      objetivo: 'Detectar contractura de la cintilla iliotibial (TFL/IT band).',
      pasos: [
        'Paciente en decúbito lateral, lado sano abajo.',
        'Flexiona la rodilla del lado a evaluar a 90°.',
        'Abduce y extiende la cadera, luego suelta la pierna.',
        'Positivo: la pierna no cae a la posición neutra (queda en abducción).',
      ],
    },
    {
      nombre: 'Test de FABER (Patrick)',
      color: 'teal',
      objetivo: 'Evaluar patología de cadera, sacroilíaca o ingle.',
      pasos: [
        'Paciente en decúbito supino.',
        'Coloca el tobillo sobre la rodilla contralateral (posición en "4").',
        'Aplica presión suave sobre la rodilla flexionada.',
        'Positivo: dolor en la ingle (cadera) o región sacroilíaca.',
      ],
    },
    {
      nombre: 'Test de Trendelenburg',
      color: 'red',
      objetivo: 'Evaluar la fuerza del glúteo medio.',
      pasos: [
        'Paciente de pie, de espaldas al evaluador.',
        'Pide que levante una pierna (apoyo monopodal).',
        'Observa la pelvis desde atrás.',
        'Positivo: la pelvis cae hacia el lado de la pierna elevada (glúteo medio débil en el lado de apoyo).',
      ],
    },
    {
      nombre: 'Test de FADIR (Pinzamiento Femoroacetabular)',
      color: 'purple',
      objetivo: 'Detectar pinzamiento femoroacetabular (FAI).',
      pasos: [
        'Paciente en decúbito supino.',
        'Flexiona la cadera a 90°, luego aduce y rota internamente.',
        'Positivo: dolor en la ingle o región anterior de la cadera.',
      ],
    },
  ],

  'rodilla': [
    {
      nombre: 'Test de Lachman',
      color: 'red',
      objetivo: 'Detectar rotura del ligamento cruzado anterior (LCA).',
      pasos: [
        'Paciente en decúbito supino, rodilla en 20–30° de flexión.',
        'Estabiliza el fémur distal con una mano.',
        'Con la otra mano, desplaza la tibia hacia anterior.',
        'Positivo: traslación anterior excesiva o ausencia de tope firme.',
      ],
    },
    {
      nombre: 'Test del Cajón Anterior',
      color: 'red',
      objetivo: 'Evaluar integridad del LCA.',
      pasos: [
        'Paciente en decúbito supino, rodilla a 90° de flexión.',
        'Siéntate sobre el pie del paciente para estabilizarlo.',
        'Toma la tibia proximal con ambas manos y desplaza hacia anterior.',
        'Positivo: traslación anterior > 5 mm respecto al lado sano.',
      ],
    },
    {
      nombre: 'Test de McMurray',
      color: 'amber',
      objetivo: 'Detectar lesión meniscal (medial o lateral).',
      pasos: [
        'Paciente en decúbito supino.',
        'Flexiona la rodilla al máximo.',
        'Para menisco medial: rota externamente la tibia y extiende la rodilla.',
        'Para menisco lateral: rota internamente la tibia y extiende la rodilla.',
        'Positivo: clic palpable o dolor en la interlínea articular.',
      ],
    },
    {
      nombre: 'Test de Apley (Compresión)',
      color: 'amber',
      objetivo: 'Diferenciar lesión meniscal de ligamentosa.',
      pasos: [
        'Paciente en decúbito prono, rodilla a 90° de flexión.',
        'Aplica compresión axial sobre el talón mientras rotas la tibia.',
        'Luego aplica tracción y repite la rotación.',
        'Positivo compresión: dolor meniscal. Positivo tracción: dolor ligamentoso.',
      ],
    },
    {
      nombre: 'Test de Valgus/Varus Stress',
      color: 'blue',
      objetivo: 'Evaluar integridad de los ligamentos colaterales.',
      pasos: [
        'Paciente en decúbito supino, rodilla en 0° y 30° de flexión.',
        'Estabiliza el fémur distal.',
        'Aplica fuerza en valgo (LCM) o varo (LCL) sobre la rodilla.',
        'Positivo: apertura articular o dolor en la interlínea medial/lateral.',
      ],
    },
    {
      nombre: 'Test de Clarke (Patela)',
      color: 'teal',
      objetivo: 'Detectar síndrome femoropatelar.',
      pasos: [
        'Paciente en decúbito supino, rodilla extendida.',
        'Aplica presión suave sobre el polo superior de la rótula.',
        'Pide al paciente que contraiga el cuádriceps.',
        'Positivo: dolor retropatelar o incapacidad de mantener la contracción.',
      ],
    },
  ],

  'tobillo-pie': [
    {
      nombre: 'Test de Cajón Anterior de Tobillo',
      color: 'red',
      objetivo: 'Detectar rotura del ligamento peroneoastragalino anterior (LPAA).',
      pasos: [
        'Paciente sentado con el pie colgando o en decúbito supino.',
        'Estabiliza la tibia distal con una mano.',
        'Con la otra mano, desplaza el talón hacia anterior.',
        'Positivo: traslación anterior excesiva o "signo del hachazo" (depresión anterior).',
      ],
    },
    {
      nombre: 'Test de Inversión Forzada (Talar Tilt)',
      color: 'amber',
      objetivo: 'Evaluar el ligamento calcaneoperoneo (LCP).',
      pasos: [
        'Paciente en decúbito supino, tobillo en posición neutra.',
        'Estabiliza la tibia distal.',
        'Aplica inversión forzada del retropié.',
        'Positivo: apertura articular excesiva o dolor en el ligamento lateral.',
      ],
    },
    {
      nombre: 'Test de Thompson',
      color: 'red',
      objetivo: 'Detectar rotura del tendón de Aquiles.',
      pasos: [
        'Paciente en decúbito prono, pie fuera de la camilla.',
        'Comprime el vientre muscular del tríceps sural.',
        'Positivo: ausencia de flexión plantar del pie (rotura completa).',
      ],
    },
    {
      nombre: 'Test de Mulder (Neuroma de Morton)',
      color: 'purple',
      objetivo: 'Detectar neuroma de Morton en el antepié.',
      pasos: [
        'Paciente en decúbito supino.',
        'Comprime el antepié lateralmente con una mano.',
        'Con el otro pulgar, aplica presión en el espacio interdigital (3.°–4.° más frecuente).',
        'Positivo: clic palpable y dolor o parestesias en los dedos adyacentes.',
      ],
    },
    {
      nombre: 'Test de Windlass (Fascitis Plantar)',
      color: 'amber',
      objetivo: 'Evaluar la tensión de la fascia plantar.',
      pasos: [
        'Paciente de pie o en decúbito supino.',
        'Extiende pasivamente el primer dedo del pie (dorsiflexión).',
        'Positivo: dolor en la inserción de la fascia plantar en el calcáneo.',
      ],
    },
    {
      nombre: 'Test de Ottawa (Fractura)',
      color: 'gray',
      objetivo: 'Determinar necesidad de radiografía en esguince de tobillo.',
      pasos: [
        'Palpa el maléolo posterior lateral (6 cm proximales).',
        'Palpa el maléolo posterior medial (6 cm proximales).',
        'Evalúa la capacidad de dar 4 pasos.',
        'Palpa la base del 5.° metatarsiano y el navicular.',
        'Positivo: dolor en zonas palpadas O incapacidad de cargar peso → indicación de Rx.',
      ],
    },
  ],
};
