# Magnetoterapia: efectos fisiológicos en los tejidos (diseño)

Fecha: 2026-11-27. Módulo: `laboratorio/js/magneto-core.js` y `lab-magneto.js`.

## Intención
Explicar mejor qué produce el campo en cada tejido. La clase (láminas 10–12) lo dice en frases cortas. El docente eligió (2026-11-27) **clase más bibliografía, separadas**, y autorizó usar internet. Esto cambia, solo para este bloque, la regla anterior de «la clase como única fuente».

## Metas
- El texto de la clase queda intacto y rotulado «Clase».
- En «Polaridad y efectos», cada uno de los 6 tejidos gana un bloque «Para profundizar (bibliografía)»: mecanismo propuesto en pasos cortos, qué se ha visto y en quién (células, animales, personas), nivel de evidencia y fuentes con enlace.
- Un cuadro resumen: tejido, afirmación de la clase, nivel de evidencia y lectura en una frase. Incluye una fila para la polaridad N/S.
- Niveles (criterio del módulo): **Moderada** (revisión de ensayos en personas), **Baja o contradictoria**, **Preclínica** (células o animales), **No se encontró** (en la búsqueda hecha; no significa que no exista).

## No metas / antimetas
- No corregir ni borrar afirmaciones de la clase; si la bibliografía discrepa, se dice en el bloque externo.
- No cambiar dosis, protocolos, casos ni animaciones.
- Antimetas: cifras sin fuente abierta y comprobada; extrapolar de otra modalidad (estimulación magnética periférica, radiofrecuencia pulsada, imanes estáticos) sin decirlo; presentar un hallazgo en células como efecto clínico.

## Primer panorama de la búsqueda (a comprobar fuente por fuente)
| Tejido | Nivel provisional |
|---|---|
| Hueso (retardo de consolidación, fracturas) | Baja o contradictoria: Cochrane CD008471 no concluyente; metaanálisis 2020 favorable |
| Dolor (artrosis) | Moderada: Cochrane CD003523 |
| Membrana e inflamación (adenosina A2A, calcio/óxido nítrico) | Preclínica |
| Tendón, ligamento, piel | Preclínica (fibroblastos en cultivo) |
| Músculo y espasticidad | Baja; parte es de estimulación magnética periférica |
| Vasos | Baja: estudios pilotos pequeños y contradictorios |
| Edema | Baja o no encontrada para campo magnético pulsado |
| Nervio (regeneración) | Preclínica |
| Polaridad N/S | No se encontró comparación; imanes estáticos sin efecto en dolor (CMAJ 2007), y eso es otra modalidad |

## Approaches
1. **Elegida (criterio mío):** bloque plegable dentro de la ficha de cada tejido y cuadro resumen en la misma pestaña. Lo externo queda junto a lo de la clase y se abre solo cuando el docente quiere.
2. Pestaña nueva «Evidencia»: separación más clara, pero obliga a saltar entre pestañas al explicar un tejido.
3. Documento aparte: no toca el simulador, pero el alumno que explora no lo ve.

## Restricciones
- Scripts clásicos, sin internet para funcionar; los enlaces son texto con `href` y el módulo no carga nada externo.
- Texto parafraseado, en español, sin nombres de personas ni marcas (prueba `no-brands.test.js`): las fuentes se citan por revista o repositorio, año y enlace.
- Cada fuente se abre y se comprueba antes de citarla; la que no se pueda abrir o no diga lo afirmado, se descarta.
- Datos en el núcleo (`EVIDENCE`), con pruebas: todo tejido tiene entrada, nivel válido y, salvo «No se encontró», al menos una fuente `https`.

## A criterio del constructor
Redacción, estilo del bloque plegable y orden de las fuentes.
