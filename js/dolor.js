/* ===== VÍAS DEL DOLOR DATA ===== */

const DOLOR_PATHWAY = [
  { label: 'Nociceptor', color: 'red' },
  { label: 'Fibras\nC · A-δ · A-β', color: 'red' },
  { label: 'Asta\nposterior', color: 'amber' },
  { label: 'Tracto\nEST', color: 'blue' },
  { label: 'Tálamo\n(VPL)', color: 'purple' },
  { label: 'Corteza\nS1 / S2', color: 'purple' },
];

const DOLOR_FIBRAS = [
  {
    fibra: 'C',
    diametro: '0.2–1.5 µm',
    mielina: 'No',
    velocidad: '0.5–2 m/s',
    tipo: 'Quemante, difuso, tardío, crónico',
    estimulo: 'Calor nocivo (>45°C), presión sostenida, estímulos químicos (H⁺, bradicinina)',
    color: 'red',
  },
  {
    fibra: 'A-δ',
    diametro: '2–5 µm',
    mielina: 'Sí (fina)',
    velocidad: '5–30 m/s',
    tipo: 'Agudo, punzante, localizado, primario',
    estimulo: 'Pinchazo, frío intenso (<15°C), presión mecánica aguda',
    color: 'amber',
  },
  {
    fibra: 'A-β',
    diametro: '6–12 µm',
    mielina: 'Sí (gruesa)',
    velocidad: '30–70 m/s',
    tipo: 'No nociceptiva en condición normal',
    estimulo: 'Tacto suave, vibración, presión leve',
    color: 'blue',
  },
];

const DOLOR_NIVELES = [
  {
    id: 'ascendente',
    num: '01',
    color: 'red',
    name: 'Vías ascendentes del dolor',
    intro: 'La señal nociceptiva se origina en los <span class="mech-highlight">nociceptores periféricos</span> (terminaciones libres de fibras C y A-δ). Ante un estímulo nocivo —térmico, mecánico o químico— se generan potenciales de acción que viajan por el nervio periférico hacia el asta posterior de la médula espinal. Las fibras A-β, aunque no nociceptivas en condición normal, son clave en la modulación de la señal dolorosa.',
    recorrido: 'Las fibras primarias hacen sinapsis en el <strong>asta posterior</strong> (láminas I, II y V de Rexed). Desde ahí, las neuronas de segundo orden <strong>decusan al lado contralateral</strong> y ascienden por el <strong>tracto espinotalámico lateral (TETAL)</strong> hacia el <strong>tálamo (núcleo ventral posterolateral, VPL)</strong>. Las neuronas talámicas proyectan a la <strong>corteza somatosensorial primaria (S1)</strong> —componente sensitivo-discriminativo— y a la corteza cingulada anterior e ínsula —componente afectivo-emocional.',
    agentes: [],
  },
  {
    id: 'medular',
    num: '02',
    color: 'blue',
    name: 'Analgesia medular',
    intro: 'La médula espinal no es un simple cable transmisor: es el primer punto de <span class="mech-highlight">modulación activa</span> del dolor. Dos mecanismos principales operan en el asta posterior para reducir la señal nociceptiva antes de que alcance los centros superiores.',
    mecanismos: [
      {
        id: 'compuerta',
        name: 'Teoría de la compuerta (Gate Control)',
        ref: 'Melzack & Wall, Science 1965',
        body: 'Las fibras <span class="mech-highlight">A-β</span> de gran diámetro, al ser activadas por estímulos táctiles o vibratorios, excitan <strong>interneuronas inhibitorias</strong> en la sustancia gelatinosa de Rolando (SGR, lámina II del asta posterior). Estas interneuronas liberan <strong>GABA y glicina</strong>, hiperpolarizando las <strong>células de transmisión (células T)</strong> e impidiendo que la señal dolorosa de fibras C y A-δ sea retransmitida hacia el encéfalo. Cuanta mayor actividad A-β → más "cerrada" la compuerta → menor dolor percibido.',
      },
      {
        id: 'opioide',
        name: 'Sistema opioide espinal',
        ref: null,
        body: 'Los <strong>receptores opioides</strong> <span class="mech-highlight">μ (mu), δ (delta) y κ (kappa)</span> se expresan densamente en las láminas I y II del asta posterior. Las <strong>encefalinas y dinorfinas</strong> —opioides endógenos liberados por interneuronas espinales— producen:<br><br>• <strong>Inhibición presináptica:</strong> reducen la liberación de glutamato y sustancia P desde el terminal de la fibra C<br>• <strong>Inhibición postsináptica:</strong> hiperpolarización de la célula T, reduciendo su excitabilidad<br><br>Las corrientes de <span class="mech-highlight">baja frecuencia (2–10 Hz)</span> activan fibras Aα motoras, generando potenciales que promueven la liberación de β-endorfinas y encefalinas a nivel espinal.',
      },
    ],
    agentes: [
      { name: 'TENS Convencional 80–150 Hz', c: 'c-blue' },
      { name: 'TENS Acupuntural 2–10 Hz', c: 'c-blue' },
      { name: 'Interferencial AMF 80–100 Hz', c: 'c-green' },
      { name: 'TENS Burst (mixto)', c: 'c-blue' },
      { name: 'Interferencial Barrido 0–100 Hz', c: 'c-green' },
    ],
  },
  {
    id: 'supramedular',
    num: '03',
    color: 'purple',
    name: 'Analgesia supramedular',
    intro: 'El encéfalo ejerce un control <span class="mech-highlight">descendente activo</span> sobre la transmisión del dolor en la médula. Este sistema inhibitorio descendente, activado por agentes físicos y por el propio sistema endógeno, es tan potente como la modulación medular y explica la analgesia prolongada post-sesión.',
    centros: [
      {
        id: 'pag',
        letra: 'A',
        color: 'purple',
        name: 'Sustancia Gris Periacueductal (PAG)',
        body: 'Localizada en el mesencéfalo rodeando el acueducto de Silvio. Es el <strong>centro de control descendente del dolor</strong> por excelencia. Contiene la mayor densidad de receptores opioides μ del SNC. Cuando se activa —por TENS de baja frecuencia, opiáceos, estrés o expectativas positivas— inicia una cascada inhibitoria coordinada que alcanza la médula espinal.<br><br>Proyecta hacia el <span class="mech-highlight">Núcleo del Rafe Magnus</span> (vía serotoninérgica) y el <span class="mech-highlight">Locus Coeruleus</span> (vía noradrenérgica), que a su vez inhiben el asta posterior.',
        agentes: [
          { name: 'TENS Acupuntural 2–10 Hz', c: 'c-blue' },
          { name: 'Interferencial AMF 1–10 Hz', c: 'c-green' },
        ],
      },
      {
        id: 'rafe',
        letra: 'B',
        color: 'pink',
        name: 'Núcleo del Rafe Magnus (NRM)',
        body: 'Localizado en el tronco del encéfalo (bulbo). Principal fuente de <strong>serotonina (5-HT)</strong> de la vía inhibitoria descendente. Recibe señales de la PAG y proyecta axones que descienden por el <strong>funículo dorsolateral</strong> hasta el asta posterior.<br><br>La 5-HT liberada en el asta posterior:<br>• Activa interneuronas encefalinérgicas → inhibición opioide local<br>• Inhibe directamente neuronas de proyección nociceptiva<br>• Modula la excitabilidad general del asta posterior',
        agentes: [
          { name: 'TENS Baja frecuencia', c: 'c-blue' },
          { name: 'Ejercicio terapéutico (indirecto)', c: 'c-green' },
        ],
      },
      {
        id: 'lc',
        letra: 'C',
        color: 'teal',
        name: 'Locus Coeruleus (LC)',
        body: 'Núcleo pontino. Principal fuente de <strong>noradrenalina (NA)</strong> descendente. Proyecta axones noradrenérgicos al asta posterior donde la NA actúa sobre receptores <span class="mech-highlight">α2-adrenérgicos</span>, produciendo:<br><br>• Hiperpolarización de neuronas nociceptivas de proyección<br>• Activación de interneuronas inhibitorias GABAérgicas<br>• Reducción de la liberación de sustancia P<br><br>El LC también recibe señales de la PAG y de la amígdala, conectando estados emocionales con la modulación del dolor.',
        agentes: [
          { name: 'TENS Baja frecuencia', c: 'c-blue' },
          { name: 'Magnetoterapia (evidencia emergente)', c: 'c-coral' },
        ],
      },
      {
        id: 'limbico',
        letra: 'D',
        color: 'amber',
        name: 'Sistema límbico / Corteza prefrontal',
        body: 'La percepción del dolor tiene un componente <strong>afectivo-motivacional</strong> mediado por la corteza cingulada anterior (CCA) y la ínsula, y un componente <strong>cognitivo-evaluativo</strong> mediado por la corteza prefrontal dorsolateral (CPFDL).<br><br>La CPFDL ejerce un control <span class="mech-highlight">top-down</span> sobre la PAG: expectativas positivas y educación en neurociencia del dolor (PNE) potencian la inhibición descendente.<br><br>En <strong>dolor crónico</strong>: la sensibilización central produce cambios en CCA e ínsula → catastrofismo, hiperalgesia, alodinia. Los agentes físicos con efecto ansiolítico/sedante reducen esta amplificación central.',
        agentes: [
          { name: 'Calor superficial', c: 'c-amber' },
          { name: 'TENS Baja frecuencia', c: 'c-blue' },
          { name: 'Placebo activo (expectativa)', c: 'c-gray' },
        ],
      },
    ],
    agentes: [
      { name: 'TENS Acupuntural 2–10 Hz', c: 'c-blue' },
      { name: 'Interferencial AMF 1–10 Hz', c: 'c-green' },
      { name: 'Calor superficial', c: 'c-amber' },
      { name: 'Magnetoterapia', c: 'c-coral' },
    ],
  },
];
