# Diseño: Expansión del módulo de Pruebas Funcionales
**Fecha:** 2026-05-14  
**Proyecto:** Agentes Físicos — Guía Clínica  
**Estado:** Aprobado por el usuario

---

## Objetivo

Ampliar `pruebas.js` con ~40 pruebas adicionales: 2–3 nuevas por cada uno de los 8 segmentos existentes, y 4 segmentos completamente nuevos. Sin cambios en `app.js` ni `index.html` — el renderizador ya itera dinámicamente.

---

## Enfoque: Expansión de datos pura (Opción A)

Solo se modifica `js/pruebas.js`:
- Nuevas entradas en `PRUEBAS_DATA[segmento]` para segmentos existentes
- Nuevos objetos en `PRUEBAS_SEGMENTOS[]` + nuevas claves en `PRUEBAS_DATA` para segmentos nuevos

---

## Pruebas a agregar — Segmentos existentes

### Columna Cervical (+3)
| Test | Color | Objetivo |
|------|-------|----------|
| Test de Jackson | red | Detectar compresión radicular con el cuello en rotación |
| Shoulder Abduction Relief Sign | blue | Confirmar radiculopatía C5–C6 (alivio elevando el brazo) |
| Test de Flexión-Rotación Cervical | amber | Evaluar movilidad de C1–C2 en flexión cervical máxima |

### Hombro (+3)
| Test | Color | Objetivo |
|------|-------|----------|
| Drop Arm Test | red | Detectar rotura completa del supraespinoso |
| Test de Gerber (Lift-off) | blue | Evaluar integridad del músculo subescapular |
| Cross-Body Adduction Test | amber | Detectar patología de la articulación acromioclavicular |

### Codo (+3)
| Test | Color | Objetivo |
|------|-------|----------|
| Test de Mill | red | Confirmar epicondilitis lateral mediante estiramiento en extensión |
| Test de Maudsley (Dedo Medio) | amber | Detectar epicondilitis lateral / compromiso del ECRB |
| Elbow Flexion Test | purple | Detectar neuropatía del nervio cubital en el canal epitroclear |

### Muñeca y Mano (+3)
| Test | Color | Objetivo |
|------|-------|----------|
| Test de Grind (CMC del Pulgar) | red | Detectar rizartrosis (artrosis trapecio-metacarpiana) |
| Test de Watson | blue | Detectar inestabilidad escafolunar |
| Test de Bunnel-Littler | amber | Evaluar contractura de músculos intrínsecos de la mano |

### Columna Lumbar (+3)
| Test | Color | Objetivo |
|------|-------|----------|
| Test de Kemp | amber | Detectar patología de faceta articular lumbar |
| Test de Adams (Forward Bend) | blue | Diferenciar escoliosis estructural de funcional |
| Prone Instability Test | purple | Detectar inestabilidad segmentaria lumbar |

### Cadera (+3)
| Test | Color | Objetivo |
|------|-------|----------|
| Test de Stinchfield | red | Detectar conflicto coxofemoral o patología intraarticular |
| Log Roll Test | blue | Evaluar patología intraarticular (sinovitis, cuerpos libres) |
| Scour Test | amber | Detectar artritis o desgaste articular de la cadera |

### Rodilla (+3)
| Test | Color | Objetivo |
|------|-------|----------|
| Test de Pivot Shift | red | Evaluar insuficiencia funcional del LCA en carga |
| Test de Thessaly | amber | Detectar lesión meniscal en condiciones de carga (más sensible que McMurray) |
| Patellar Tap (Golpe rotuliano) | blue | Detectar derrame articular de la rodilla |

### Tobillo y Pie (+3)
| Test | Color | Objetivo |
|------|-------|----------|
| Squeeze Test | red | Detectar lesión de la sindesmosis tibioperonea |
| Cotton Test | amber | Evaluar inestabilidad de la mortaja tibioastragalina |
| Bump Test (Percusión) | blue | Sospechar fractura por estrés en tibia o pie |

---

## Pruebas a agregar — Segmentos nuevos

### Columna Torácica
**Icono:** 🟫 · **ID:** `columna-toracica`

| Test | Color | Objetivo |
|------|-------|----------|
| PA Spring Test (Springing) | amber | Evaluar movilidad segmentaria torácica (PA movilización) |
| Test de Adam (Inclinación anterior) | blue | Detectar escoliosis torácica estructural (giba costal) |
| Test de Schober Torácico | teal | Cuantificar rango de flexión de la columna torácica |
| Slump Test Torácico | red | Evaluar contribución torácica a la tensión neural del sistema nervioso central |

### Articulación Temporomandibular (ATM)
**Icono:** 🦷 · **ID:** `atm`

| Test | Color | Objetivo |
|------|-------|----------|
| Medición de Apertura Bucal | amber | Cuantificar el rango de apertura (normal ≥ 40 mm) |
| Test de Deflexión / Desviación Mandibular | blue | Detectar asimetría muscular o bloqueo discal unilateral |
| Test de Carga Articular (Compresión ATM) | red | Reproducir dolor intraarticular (cóndilo, disco) |
| Test de Distracción ATM | teal | Diferenciar dolor muscular de dolor articular intraarticular |

### Tensión Neural Periférica (ULTT / LLTT)
**Icono:** ⚡ · **ID:** `tension-neural`

| Test | Color | Objetivo |
|------|-------|----------|
| ULTT 2a — Nervio Mediano (escápula deprimida) | blue | Evaluar tensión del nervio mediano con añadido de depresión escapular |
| ULTT 2b — Nervio Radial | amber | Evaluar tensión del nervio radial y sus ramas |
| ULTT 3 — Nervio Cubital | purple | Evaluar tensión del nervio cubital en su recorrido medial |
| LLTT Femoral (Prone Knee Bend) | red | Evaluar tensión del nervio femoral (L2–L4) en decúbito prono |

### Pie y Arco Plantar
**Icono:** 🦶 · **ID:** `pie-arco`

| Test | Color | Objetivo |
|------|-------|----------|
| Jack's Test (Windlass pasivo) | amber | Evaluar integridad del mecanismo de windlass y la fascia plantar |
| Navicular Drop Test | blue | Cuantificar la pronación dinámica del pie (caída del escafoides) |
| Single Leg Heel Rise | red | Evaluar fuerza del tríceps sural y la integridad del tendón de Aquiles |
| Too Many Toes Sign | teal | Detectar colapso pronatorio / valgo del retropié en carga |

---

## Resumen de volumen

| | Antes | Nuevas | Total |
|--|-------|--------|-------|
| Segmentos | 8 | +4 | 12 |
| Pruebas | 42 | +40 | ~82 |

---

## Criterios de éxito

- [ ] Todos los segmentos existentes muestran las pruebas nuevas al buscar por nombre de segmento
- [ ] Los 4 segmentos nuevos aparecen en los resultados de búsqueda y renderizan correctamente
- [ ] Los pasos de cada prueba son clínicamente correctos y coherentes con el estilo del resto del módulo
- [ ] No se modifica `app.js` ni `index.html`
- [ ] El buscador encuentra las pruebas nuevas por nombre y por segmento
