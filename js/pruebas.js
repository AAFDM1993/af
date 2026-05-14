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
  { id: 'columna-toracica', label: 'Columna Torácica', icon: '🟫' },
  { id: 'atm', label: 'Articulación Temporomandibular', icon: '🦷' },
  { id: 'tension-neural', label: 'Tensión Neural', icon: '⚡' },
  { id: 'pie-arco', label: 'Pie y Arco Plantar', icon: '🦶' },
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
    {
      nombre: 'Test de Jackson',
      color: 'red',
      objetivo: 'Detectar compresión radicular cervical con el cuello en rotación lateral.',
      pasos: [
        'Paciente sentado, cuello en posición neutra.',
        'Rota e inclina la cabeza hacia el lado sintomático.',
        'Aplica compresión axial suave sobre el vértex.',
        'Positivo: reproduce dolor o parestesias en el brazo ipsilateral (más específico que Spurling).',
      ],
    },
    {
      nombre: 'Shoulder Abduction Relief Sign',
      color: 'blue',
      objetivo: 'Confirmar radiculopatía cervical C5–C6 (alivio al elevar el brazo).',
      pasos: [
        'Paciente sentado o de pie con dolor en el brazo.',
        'Pide que coloque la mano del lado sintomático sobre la cabeza (abducción de hombro).',
        'Positivo: alivio del dolor o las parestesias al elevar el brazo — reduce tensión sobre la raíz cervical.',
      ],
    },
    {
      nombre: 'Test de Flexión-Rotación Cervical',
      color: 'amber',
      objetivo: 'Evaluar movilidad del segmento C1–C2 en cefalea cervicogénica.',
      pasos: [
        'Paciente en decúbito supino.',
        'Lleva el cuello a flexión máxima (mentón al pecho) para bloquear los segmentos subaxiales.',
        'Rota la cabeza hacia cada lado y mide el rango disponible.',
        'Normal: ~44° de rotación. Positivo: < 32° o asimetría > 10° sugiere disfunción C1–C2.',
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
    {
      nombre: 'Drop Arm Test',
      color: 'red',
      objetivo: 'Detectar rotura completa del manguito rotador (supraespinoso).',
      pasos: [
        'Paciente de pie o sentado.',
        'Abduce pasivamente el brazo a 90°.',
        'Pide que baje el brazo de forma lenta y controlada.',
        'Positivo: el brazo cae bruscamente o el paciente no puede sostenerlo — indica rotura completa del supraespinoso.',
      ],
    },
    {
      nombre: 'Test de Gerber (Lift-off)',
      color: 'blue',
      objetivo: 'Evaluar integridad del músculo subescapular.',
      pasos: [
        'Paciente de pie, coloca el dorso de la mano en la región lumbar.',
        'Pide que despegue la mano de la espalda empujando hacia atrás contra resistencia.',
        'Positivo: incapacidad de mantener la mano separada de la espalda — indica debilidad o rotura del subescapular.',
      ],
    },
    {
      nombre: 'Cross-Body Adduction Test',
      color: 'amber',
      objetivo: 'Detectar patología de la articulación acromioclavicular (AC).',
      pasos: [
        'Paciente sentado.',
        'Flexiona el hombro a 90° con el codo extendido.',
        'Aduce horizontalmente el brazo hacia el hombro contralateral.',
        'Positivo: dolor localizado en la articulación acromioclavicular.',
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
    {
      nombre: 'Test de Mill',
      color: 'red',
      objetivo: 'Confirmar epicondilitis lateral mediante estiramiento pasivo del ECRB.',
      pasos: [
        'Paciente sentado, hombro en posición neutra.',
        'Prona el antebrazo y flexiona la muñeca pasivamente.',
        'Extiende el codo de forma simultánea.',
        'Positivo: dolor reproducido en el epicóndilo lateral.',
      ],
    },
    {
      nombre: 'Test de Maudsley (Dedo Medio)',
      color: 'amber',
      objetivo: 'Detectar epicondilitis lateral por compromiso del ECRB.',
      pasos: [
        'Paciente sentado, codo extendido.',
        'Extiende el dedo medio del paciente contra resistencia aplicada en la falange distal.',
        'Positivo: dolor en el epicóndilo lateral.',
      ],
    },
    {
      nombre: 'Elbow Flexion Test',
      color: 'purple',
      objetivo: 'Detectar neuropatía del nervio cubital en el canal epitroclear.',
      pasos: [
        'Paciente de pie o sentado.',
        'Flexiona el codo al máximo con el antebrazo supinado y la muñeca en extensión.',
        'Mantiene la posición durante 3–5 minutos.',
        'Positivo: parestesias o entumecimiento en el 4.° y 5.° dedo.',
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
    {
      nombre: 'Test de Grind (CMC del Pulgar)',
      color: 'red',
      objetivo: 'Detectar rizartrosis (artrosis de la articulación trapecio-metacarpiana).',
      pasos: [
        'Paciente con el antebrazo en posición neutra.',
        'Estabiliza el carpo con una mano.',
        'Con la otra, aplica compresión axial sobre el 1.er metacarpiano y realiza movimientos de rotación (grinding).',
        'Positivo: dolor, crepitación o bloqueo en la base del pulgar.',
      ],
    },
    {
      nombre: 'Test de Watson (Escafoide)',
      color: 'blue',
      objetivo: 'Detectar inestabilidad escafolunar.',
      pasos: [
        'Paciente con la mano del lado a evaluar frente a ti.',
        'Coloca tu pulgar sobre el polo distal del escafoide (cara palmar).',
        'Desvía la muñeca de cubital a radial mientras mantienes presión sobre el escafoide.',
        'Positivo: clic palpable o dolor dorsal sobre el escafoide — indica inestabilidad escafolunar.',
      ],
    },
    {
      nombre: 'Test de Bunnel-Littler',
      color: 'amber',
      objetivo: 'Evaluar contractura de los músculos intrínsecos de la mano.',
      pasos: [
        'Paciente con la mano en reposo.',
        'Extiende la articulación MCF del dedo a evaluar.',
        'Intenta flexionar pasivamente la articulación IFP.',
        'Luego flexiona la MCF y repite la flexión IFP.',
        'Positivo intrínseco: IFP no flexiona con MCF extendida pero sí con MCF flexionada. Positivo cápsula: IFP no flexiona en ninguna posición.',
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
    {
      nombre: 'Test de Kemp',
      color: 'amber',
      objetivo: 'Detectar patología de la faceta articular lumbar o foraminal.',
      pasos: [
        'Paciente de pie.',
        'Pide que extienda, rote e incline lateralmente el tronco hacia el lado sintomático (posición cuadrante posterior).',
        'Positivo: dolor local o irradiado en la región glútea o muslo ipsilateral.',
      ],
    },
    {
      nombre: 'Test de Adams (Inclinación Anterior)',
      color: 'blue',
      objetivo: 'Diferenciar escoliosis estructural de escoliosis funcional (postural).',
      pasos: [
        'Paciente de pie, examina desde atrás.',
        'Pide que se incline hacia adelante con las rodillas extendidas y las manos juntas.',
        'Observa la columna y la caja torácica.',
        'Positivo estructural: giba costal o prominencia paravertebral que persiste en flexión.',
        'Negativo funcional: la asimetría desaparece al flexionar.',
      ],
    },
    {
      nombre: 'Prone Instability Test',
      color: 'purple',
      objetivo: 'Detectar inestabilidad segmentaria lumbar.',
      pasos: [
        'Paciente en decúbito prono, parte inferior colgando sobre el borde de la camilla (pies en el suelo).',
        'Aplica presión posteroanterior (PA) sobre las apófisis espinosas y registra si hay dolor.',
        'Luego pide que levante los pies del suelo (activa los extensores) y repite la presión PA.',
        'Positivo: dolor con pies apoyados que desaparece al activar los extensores lumbares.',
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
    {
      nombre: 'Test de Stinchfield',
      color: 'red',
      objetivo: 'Detectar conflicto coxofemoral o patología intraarticular de la cadera.',
      pasos: [
        'Paciente en decúbito supino.',
        'Flexiona la cadera a 30–45° con la rodilla extendida.',
        'Aplica resistencia hacia abajo mientras el paciente mantiene la posición.',
        'Positivo: dolor en la ingle — sugiere patología intraarticular (pinzamiento, labrum, artrosis).',
      ],
    },
    {
      nombre: 'Log Roll Test',
      color: 'blue',
      objetivo: 'Evaluar patología intraarticular de la cadera con baja carga articular.',
      pasos: [
        'Paciente en decúbito supino, cadera en extensión.',
        'Rota pasivamente la cadera hacia la rotación interna y externa, rodando la extremidad como un tronco.',
        'No apliques fuerza, solo permite el movimiento libre.',
        'Positivo: dolor en la ingle ante la rotación — alta especificidad para patología intraarticular.',
      ],
    },
    {
      nombre: 'Scour Test',
      color: 'amber',
      objetivo: 'Detectar artrosis o patología degenerativa de la articulación coxofemoral.',
      pasos: [
        'Paciente en decúbito supino.',
        'Flexiona la cadera y la rodilla a 90°.',
        'Aplica compresión axial a través del fémur y realiza un movimiento circular (adducción → abducción en arco).',
        'Positivo: dolor, crepitación o limitación del arco — indica patología articular coxofemoral.',
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
    {
      nombre: 'Test de Pivot Shift',
      color: 'red',
      objetivo: 'Evaluar la insuficiencia funcional del LCA en carga.',
      pasos: [
        'Paciente en decúbito supino.',
        'Extiende la rodilla completamente, aplica valgo y rotación interna de la tibia.',
        'Flexiona lentamente la rodilla mientras mantienes el valgo y la rotación interna.',
        'Positivo: subluxación y reducción repentina de la tibia al llegar a 20–40° de flexión (sensación de "salto" o clic) — indica insuficiencia del LCA.',
      ],
    },
    {
      nombre: 'Test de Thessaly',
      color: 'amber',
      objetivo: 'Detectar lesión meniscal en condiciones de carga (mayor sensibilidad que McMurray).',
      pasos: [
        'Paciente de pie sobre la pierna a evaluar, rodilla en 20° de flexión.',
        'Ayuda al paciente a mantener el equilibrio tomándolo de las manos.',
        'Pide que realice rotaciones internas y externas del tronco sobre el fémur fijo (torque de rodilla).',
        'Positivo: dolor o sensación de bloqueo en la interlínea articular medial o lateral.',
      ],
    },
    {
      nombre: 'Patellar Tap (Golpe Rotuliano)',
      color: 'blue',
      objetivo: 'Detectar derrame articular de la rodilla.',
      pasos: [
        'Paciente en decúbito supino, rodilla extendida y relajada.',
        'Con una mano, comprime el fondo de saco suprapatelar hacia distal para desplazar el líquido.',
        'Con el dedo índice de la otra mano, presiona la rótula bruscamente hacia el fémur.',
        'Positivo: sensación de choque o rebote ("tecla de piano") — indica derrame articular.',
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
    {
      nombre: 'Squeeze Test (Sindesmosis)',
      color: 'red',
      objetivo: 'Detectar lesión de la sindesmosis tibioperonea distal.',
      pasos: [
        'Paciente sentado o en decúbito supino.',
        'Comprime la tibia y el peroné juntos a nivel medio de la pierna (zona proximal a la sindesmosis).',
        'Positivo: dolor en la sindesmosis distal (cara anterior del tobillo entre los maléolos).',
      ],
    },
    {
      nombre: 'Cotton Test',
      color: 'amber',
      objetivo: 'Evaluar inestabilidad de la mortaja tibioastragalina (diástasis).',
      pasos: [
        'Paciente en decúbito supino, tobillo en posición neutra.',
        'Estabiliza la tibia y el peroné con una mano proximal.',
        'Con la otra mano, desplaza el astrágalo lateralmente dentro de la mortaja.',
        'Positivo: traslación lateral excesiva del astrágalo — indica ruptura de la sindesmosis o lesión ligamentosa grave.',
      ],
    },
    {
      nombre: 'Bump Test (Percusión)',
      color: 'blue',
      objetivo: 'Sospechar fractura por estrés en tibia o pie.',
      pasos: [
        'Paciente sentado o en decúbito supino.',
        'Percute el talón con el puño cerrado (golpe en el eje del miembro).',
        'Alternativa: percute directamente el hueso sospechoso con el dedo.',
        'Positivo: dolor localizado en el foco de posible fractura por estrés — indica necesidad de imagen (Rx o RMN).',
      ],
    },
  ],

  'columna-toracica': [
    {
      nombre: 'PA Spring Test (Springing Torácico)',
      color: 'amber',
      objetivo: 'Evaluar movilidad segmentaria de la columna torácica.',
      pasos: [
        'Paciente en decúbito prono.',
        'Coloca el talón de la mano sobre la apófisis espinosa del segmento a evaluar.',
        'Aplica presión posteroanterior (PA) rítmica y progresiva.',
        'Positivo: hipomobilidad, rigidez o dolor localizado — indica disfunción del segmento torácico.',
      ],
    },
    {
      nombre: 'Test de Adam (Inclinación Anterior Torácica)',
      color: 'blue',
      objetivo: 'Detectar escoliosis torácica estructural mediante observación de la giba costal.',
      pasos: [
        'Paciente de pie, examina desde atrás.',
        'Pide que se incline hacia adelante con las rodillas extendidas y las palmas juntas.',
        'Observa la simetría de la caja torácica.',
        'Positivo estructural: giba costal unilateral que persiste en flexión — indica rotación vertebral y escoliosis estructural.',
      ],
    },
    {
      nombre: 'Test de Schober Torácico',
      color: 'teal',
      objetivo: 'Cuantificar el rango de flexión de la columna torácica.',
      pasos: [
        'Paciente de pie. Marca T1 y T12 con un lápiz dermográfico.',
        'Mide la distancia entre las dos marcas en posición neutra.',
        'Pide que se incline al máximo hacia adelante y vuelve a medir.',
        'Positivo (hipomobilidad): incremento < 2.5 cm entre las marcas en flexión.',
      ],
    },
    {
      nombre: 'Slump Test Torácico',
      color: 'red',
      objetivo: 'Evaluar la contribución torácica a la tensión del sistema nervioso central.',
      pasos: [
        'Paciente sentado al borde de la camilla.',
        'Flexiona el tronco y la cabeza (mentón al pecho, cifosis global).',
        'Extiende la rodilla del lado sintomático y dorsiflexiona el pie.',
        'Positivo: reproducción de síntomas dorsales o en la extremidad que se alivian al extender el cuello.',
      ],
    },
  ],

  'atm': [
    {
      nombre: 'Medición de Apertura Bucal',
      color: 'amber',
      objetivo: 'Cuantificar el rango de apertura mandibular (normal ≥ 40 mm).',
      pasos: [
        'Paciente sentado, cabeza en posición neutra.',
        'Pide que abra la boca al máximo.',
        'Mide la distancia interincisal con una regla milimetrada.',
        'Normal: ≥ 40 mm. Reducido: 25–39 mm. Muy limitado: < 25 mm.',
      ],
    },
    {
      nombre: 'Test de Deflexión / Desviación Mandibular',
      color: 'blue',
      objetivo: 'Detectar asimetría muscular o bloqueo discal unilateral de la ATM.',
      pasos: [
        'Paciente sentado, observa de frente.',
        'Pide que abra y cierre la boca lentamente.',
        'Observa la trayectoria del mentón.',
        'Deflexión: la mandíbula se desvía hacia un lado al final de la apertura y no regresa — sugiere bloqueo discal ipsilateral.',
        'Desviación en S: regresa a la línea media — sugiere hipomobilidad muscular unilateral corregible.',
      ],
    },
    {
      nombre: 'Test de Carga Articular ATM (Compresión)',
      color: 'red',
      objetivo: 'Reproducir dolor intraarticular (cóndilo o disco) de la ATM.',
      pasos: [
        'Paciente sentado.',
        'Coloca ambos pulgares debajo del mentón y los dedos índices sobre el ángulo mandibular.',
        'Aplica presión hacia superior y posterior (compresión del cóndilo contra la fosa articular).',
        'Positivo: dolor preauricular o en la ATM — indica patología intraarticular.',
      ],
    },
    {
      nombre: 'Test de Distracción ATM',
      color: 'teal',
      objetivo: 'Diferenciar dolor muscular de dolor articular intraarticular de la ATM.',
      pasos: [
        'Paciente sentado con la boca ligeramente abierta.',
        'Coloca ambos pulgares sobre los molares inferiores del lado a evaluar.',
        'Aplica tracción hacia inferior y anterior (distracción del cóndilo).',
        'Positivo articular: alivio del dolor en distracción — sugiere patología intraarticular. Positivo muscular: no cambia o aumenta.',
      ],
    },
  ],

  'tension-neural': [
    {
      nombre: 'ULTT 2a — Nervio Mediano (Depresión Escapular)',
      color: 'blue',
      objetivo: 'Evaluar la tensión del nervio mediano con sesgo de depresión escapular.',
      pasos: [
        'Paciente en decúbito supino.',
        'Deprime activamente la escápula (alejándola del cuello).',
        'Abduce el hombro a 110°, extiende el codo, supina el antebrazo.',
        'Extiende la muñeca y los dedos.',
        'Añade inclinación cervical contralateral para aumentar la tensión.',
        'Positivo: reproduce síntomas en el territorio del nervio mediano (palma, 1.°–3.° dedo) que cambian con el movimiento del cuello.',
      ],
    },
    {
      nombre: 'ULTT 2b — Nervio Radial',
      color: 'amber',
      objetivo: 'Evaluar la tensión del nervio radial y sus ramas.',
      pasos: [
        'Paciente en decúbito supino.',
        'Deprime la escápula.',
        'Extiende el codo, prona el antebrazo, flexiona la muñeca y los dedos.',
        'Abduce el hombro hasta reproducir síntomas.',
        'Añade inclinación cervical contralateral.',
        'Positivo: reproduce síntomas en el territorio radial (cara dorsal del antebrazo y mano) sensibles a la posición cervical.',
      ],
    },
    {
      nombre: 'ULTT 3 — Nervio Cubital',
      color: 'purple',
      objetivo: 'Evaluar la tensión del nervio cubital en su recorrido medial.',
      pasos: [
        'Paciente en decúbito supino.',
        'Deprime la escápula.',
        'Extiende la muñeca y los dedos, supina el antebrazo.',
        'Flexiona el codo al máximo (posición de cubital).',
        'Abduce el hombro hasta reproducir síntomas.',
        'Positivo: reproduce síntomas en el territorio cubital (borde medial del antebrazo, 4.° y 5.° dedo) sensibles al movimiento cervical.',
      ],
    },
    {
      nombre: 'LLTT Femoral (Prone Knee Bend)',
      color: 'red',
      objetivo: 'Evaluar la tensión del nervio femoral (L2–L4).',
      pasos: [
        'Paciente en decúbito prono.',
        'Flexiona pasivamente la rodilla del lado a evaluar llevando el talón al glúteo.',
        'Añade extensión de cadera para aumentar la tensión neural.',
        'Positivo: dolor o parestesias en la cara anterior del muslo — indica irritación del nervio femoral.',
        'Nota: evita este test en pacientes con hernia discal lumbar alta documentada y síntomas graves.',
      ],
    },
  ],

  'pie-arco': [
    {
      nombre: "Jack's Test (Windlass Pasivo)",
      color: 'amber',
      objetivo: 'Evaluar la integridad del mecanismo de windlass y la fascia plantar.',
      pasos: [
        'Paciente en bipedestación o en decúbito supino.',
        'Extiende pasivamente el primer dedo del pie (dorsiflexión de la articulación MTF).',
        'Observa la elevación del arco longitudinal medial.',
        "Positivo: no se eleva el arco — indica fallo del mecanismo de windlass, pie plano flexible o insuficiencia de la fascia plantar.",
      ],
    },
    {
      nombre: 'Navicular Drop Test',
      color: 'blue',
      objetivo: 'Cuantificar la pronación dinámica del pie (descenso del escafoides).',
      pasos: [
        'Paciente sentado sin carga, pie en posición subtalar neutra.',
        'Marca la posición del tubérculo del escafoides con un lápiz dermográfico.',
        'Mide la altura del escafoides al suelo.',
        'Pide que se ponga de pie y vuelve a medir.',
        'Positivo (pronación excesiva): descenso > 10 mm — indica hiperpronación.',
      ],
    },
    {
      nombre: 'Single Leg Heel Rise',
      color: 'red',
      objetivo: 'Evaluar la fuerza del tríceps sural y la integridad funcional del tendón de Aquiles.',
      pasos: [
        'Paciente de pie sobre la pierna a evaluar, mano apoyada en la pared para el equilibrio.',
        'Pide que realice elevaciones sobre la punta del pie de forma repetida.',
        'Normal: ≥ 25 repeticiones simétricas con supinación del pie al final del movimiento.',
        'Positivo: < 25 repeticiones, dolor, o imposibilidad de supinar el pie — indica debilidad del tríceps sural o tendinopatía de Aquiles.',
      ],
    },
    {
      nombre: 'Too Many Toes Sign',
      color: 'teal',
      objetivo: 'Detectar colapso pronatorio o valgo del retropié en carga.',
      pasos: [
        'Examina al paciente de pie, de espaldas a ti.',
        'Observa la cantidad de dedos visibles al lateral del tobillo.',
        'Normal: se visualizan el 4.° y 5.° dedo (o solo el 5.°).',
        'Positivo: se ven 3 o más dedos por fuera del tobillo — indica abducción del antepié y valgo del retropié (pie plano adquirido del adulto).',
      ],
    },
  ],
};
