# Expansión de Pruebas Funcionales — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar ~40 pruebas nuevas a `js/pruebas.js`: 3 por cada uno de los 8 segmentos existentes y 4 segmentos completamente nuevos.

**Architecture:** Solo se modifica `js/pruebas.js`. El renderizador en `buildPruebas()` (app.js) itera dinámicamente sobre `PRUEBAS_SEGMENTOS` y `PRUEBAS_DATA`, así que cualquier adición aparece automáticamente sin tocar `app.js` ni `index.html`.

**Tech Stack:** Vanilla JS, sin bundler, sin framework de tests. Verificación manual en el navegador.

---

## Archivos

| Acción | Archivo | Descripción |
|--------|---------|-------------|
| Modificar | `js/pruebas.js` | Único archivo a cambiar — agregar entradas a arrays y objetos existentes |

---

### Task 1: Ampliar Columna Cervical, Hombro y Codo

**Files:**
- Modify: `js/pruebas.js`

- [ ] **Paso 1: Abrir `js/pruebas.js` y localizar el cierre del array de `columna-cervical`**

Busca la línea que dice `},` justo antes de `'hombro':`. Inserta las 3 entradas nuevas **antes** de esa línea de cierre:

```js
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
```

- [ ] **Paso 2: Insertar 3 pruebas nuevas en `hombro`**

Busca la línea de cierre del array `hombro` (antes de `'codo':`). Inserta antes de ella:

```js
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
```

- [ ] **Paso 3: Insertar 3 pruebas nuevas en `codo`**

Busca la línea de cierre del array `codo` (antes de `'muneca-mano':`). Inserta antes de ella:

```js
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
```

- [ ] **Paso 4: Verificar en el navegador**

Abre `index.html` en el navegador (o refresca si ya está abierto). Ve a la sección **Pruebas funcionales**. Busca:
- `cervical` → debe mostrar 8 pruebas (5 originales + 3 nuevas)
- `hombro` → debe mostrar 9 pruebas
- `codo` → debe mostrar 7 pruebas
- Busca `jackson` → debe encontrar "Test de Jackson"
- Busca `lift-off` → debe encontrar "Test de Gerber"

- [ ] **Paso 5: Commit**

```bash
git add js/pruebas.js
git commit -m "feat: agregar pruebas a cervical, hombro y codo"
```

---

### Task 2: Ampliar Muñeca/Mano, Columna Lumbar y Cadera

**Files:**
- Modify: `js/pruebas.js`

- [ ] **Paso 1: Insertar 3 pruebas nuevas en `muneca-mano`**

Busca la línea de cierre del array `muneca-mano` (antes de `'columna-lumbar':`). Inserta antes de ella:

```js
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
```

- [ ] **Paso 2: Insertar 3 pruebas nuevas en `columna-lumbar`**

Busca la línea de cierre del array `columna-lumbar` (antes de `'cadera':`). Inserta antes de ella:

```js
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
```

- [ ] **Paso 3: Insertar 3 pruebas nuevas en `cadera`**

Busca la línea de cierre del array `cadera` (antes de `'rodilla':`). Inserta antes de ella:

```js
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
```

- [ ] **Paso 4: Verificar en el navegador**

Busca:
- `muñeca` → debe mostrar 7 pruebas
- `lumbar` → debe mostrar 9 pruebas
- `cadera` → debe mostrar 8 pruebas
- Busca `kemp` → debe encontrar "Test de Kemp"
- Busca `grind` → debe encontrar "Test de Grind"

- [ ] **Paso 5: Commit**

```bash
git add js/pruebas.js
git commit -m "feat: agregar pruebas a muñeca, lumbar y cadera"
```

---

### Task 3: Ampliar Rodilla y Tobillo/Pie

**Files:**
- Modify: `js/pruebas.js`

- [ ] **Paso 1: Insertar 3 pruebas nuevas en `rodilla`**

Busca la línea de cierre del array `rodilla` (antes de `'tobillo-pie':`). Inserta antes de ella:

```js
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
```

- [ ] **Paso 2: Insertar 3 pruebas nuevas en `tobillo-pie`**

Busca la línea de cierre del array `tobillo-pie` (antes del cierre del objeto `PRUEBAS_DATA`). Inserta antes de ella:

```js
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
```

- [ ] **Paso 3: Verificar en el navegador**

Busca:
- `rodilla` → debe mostrar 9 pruebas
- `tobillo` → debe mostrar 9 pruebas
- Busca `pivot` → debe encontrar "Test de Pivot Shift"
- Busca `squeeze` → debe encontrar "Squeeze Test"

- [ ] **Paso 4: Commit**

```bash
git add js/pruebas.js
git commit -m "feat: agregar pruebas a rodilla y tobillo/pie"
```

---

### Task 4: Nuevo segmento — Columna Torácica

**Files:**
- Modify: `js/pruebas.js`

- [ ] **Paso 1: Agregar entrada en `PRUEBAS_SEGMENTOS`**

Localiza el cierre del array `PRUEBAS_SEGMENTOS` (línea `];` después de tobillo-pie). Inserta la nueva entrada **antes** del `];`:

```js
  { id: 'columna-toracica', label: 'Columna Torácica', icon: '🟫' },
```

- [ ] **Paso 2: Agregar clave `'columna-toracica'` en `PRUEBAS_DATA`**

Localiza el cierre del objeto `PRUEBAS_DATA` (última `};` del archivo). Inserta **antes** de ese cierre:

```js
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
```

- [ ] **Paso 3: Verificar en el navegador**

Busca:
- `torácica` → debe mostrar la sección "Columna Torácica" con 4 pruebas
- `springing` → debe encontrar "PA Spring Test"
- `schober` → debe encontrar "Test de Schober Torácico"

- [ ] **Paso 4: Commit**

```bash
git add js/pruebas.js
git commit -m "feat: agregar segmento columna torácica con 4 pruebas"
```

---

### Task 5: Nuevo segmento — Articulación Temporomandibular (ATM)

**Files:**
- Modify: `js/pruebas.js`

- [ ] **Paso 1: Agregar entrada en `PRUEBAS_SEGMENTOS`**

Inserta **antes** del `];` de `PRUEBAS_SEGMENTOS`:

```js
  { id: 'atm', label: 'Articulación Temporomandibular', icon: '🦷' },
```

- [ ] **Paso 2: Agregar clave `'atm'` en `PRUEBAS_DATA`**

Inserta **antes** del cierre `};` final de `PRUEBAS_DATA`:

```js
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
```

- [ ] **Paso 3: Verificar en el navegador**

Busca:
- `temporomandibular` → debe mostrar la sección "Articulación Temporomandibular" con 4 pruebas
- `apertura` → debe encontrar "Medición de Apertura Bucal"
- `distracción` → debe encontrar "Test de Distracción ATM"

- [ ] **Paso 4: Commit**

```bash
git add js/pruebas.js
git commit -m "feat: agregar segmento ATM con 4 pruebas"
```

---

### Task 6: Nuevo segmento — Tensión Neural (ULTT / LLTT)

**Files:**
- Modify: `js/pruebas.js`

- [ ] **Paso 1: Agregar entrada en `PRUEBAS_SEGMENTOS`**

Inserta **antes** del `];` de `PRUEBAS_SEGMENTOS`:

```js
  { id: 'tension-neural', label: 'Tensión Neural', icon: '⚡' },
```

- [ ] **Paso 2: Agregar clave `'tension-neural'` en `PRUEBAS_DATA`**

Inserta **antes** del cierre `};` final de `PRUEBAS_DATA`:

```js
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
```

- [ ] **Paso 3: Verificar en el navegador**

Busca:
- `tensión neural` → debe mostrar la sección "Tensión Neural" con 4 pruebas
- `ultt` → debe mostrar las 3 pruebas ULTT
- `femoral` → debe encontrar "LLTT Femoral"

- [ ] **Paso 4: Commit**

```bash
git add js/pruebas.js
git commit -m "feat: agregar segmento tensión neural (ULTT/LLTT) con 4 pruebas"
```

---

### Task 7: Nuevo segmento — Pie y Arco Plantar

**Files:**
- Modify: `js/pruebas.js`

- [ ] **Paso 1: Agregar entrada en `PRUEBAS_SEGMENTOS`**

Inserta **antes** del `];` de `PRUEBAS_SEGMENTOS`:

```js
  { id: 'pie-arco', label: 'Pie y Arco Plantar', icon: '🦶' },
```

- [ ] **Paso 2: Agregar clave `'pie-arco'` en `PRUEBAS_DATA`**

Inserta **antes** del cierre `};` final de `PRUEBAS_DATA`:

```js
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
```

- [ ] **Paso 3: Verificar en el navegador**

Busca:
- `pie` → debe mostrar las secciones "Tobillo y Pie" (9) y "Pie y Arco Plantar" (4)
- `navicular` → debe encontrar "Navicular Drop Test"
- `jack` → debe encontrar "Jack's Test"
- `heel rise` → debe encontrar "Single Leg Heel Rise"

- [ ] **Paso 4: Commit**

```bash
git add js/pruebas.js
git commit -m "feat: agregar segmento pie y arco plantar con 4 pruebas"
```

---

## Estado final esperado

| Segmento | Antes | Después |
|----------|-------|---------|
| Columna Cervical | 5 | 8 |
| Hombro | 6 | 9 |
| Codo | 4 | 7 |
| Muñeca y Mano | 4 | 7 |
| Columna Lumbar | 6 | 9 |
| Cadera | 5 | 8 |
| Rodilla | 6 | 9 |
| Tobillo y Pie | 6 | 9 |
| Columna Torácica | 0 | 4 |
| ATM | 0 | 4 |
| Tensión Neural | 0 | 4 |
| Pie y Arco Plantar | 0 | 4 |
| **Total** | **42** | **82** |
