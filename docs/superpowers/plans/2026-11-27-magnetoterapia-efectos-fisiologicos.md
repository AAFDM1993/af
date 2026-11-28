# Magnetoterapia: efectos fisiológicos con bibliografía Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Agregar en «Polaridad y efectos» un bloque «Para profundizar (bibliografía)» por tejido y un cuadro resumen de evidencia, sin tocar el contenido de la clase.

**Architecture:** Datos en `magneto-core.js` (`EVIDENCE_LEVELS`, `EVIDENCE`, `POLARITY_EVIDENCE`) probados con `node --test`; `lab-magneto.js` solo los pinta.

**Tech Stack:** JS puro, scripts clásicos, `node --test`.

**Spec:** `docs/superpowers/specs/2026-11-27-magnetoterapia-efectos-fisiologicos-design.md`

## Global Constraints
- Texto de la clase intacto y rotulado «Clase»; no cambiar dosis, protocolos, casos ni animaciones.
- Niveles exactos: Moderada, Baja o contradictoria, Preclínica, No se encontró.
- Cada fuente se abre y comprueba antes de citarla; sin nombres de personas ni marcas; fuentes por revista o repositorio, año y enlace `https`.
- No extrapolar de otra modalidad sin decirlo; no presentar hallazgos en células como efecto clínico.
- El módulo no carga nada externo.

## Review Focus
- Fuente que no confirma la frase: se descarta o se corrige la frase.
- Tejido sin fuente verificable: nivel «No se encontró» y se dice que es en la búsqueda hecha.
- Enlaces: abren en pestaña nueva con `rel="noopener noreferrer"`.
- Cambiar de tejido deja el bloque del tejido correcto.
- 360 px: el cuadro se desplaza dentro de su caja.

### Task 1: Comprobar fuentes
- [ ] Abrir cada URL del diseño y anotar título, año, qué estudió (células, animales, personas), resultado y límites. Descartar las que no se puedan abrir.

### Task 2: Datos en el núcleo
**Files:** Modify `laboratorio/js/magneto-core.js`; Test `laboratorio/tests/magneto-core.test.js`
**Interfaces (Produces):** `EVIDENCE_LEVELS: {moderada, baja, preclinica, 'no-encontrada': string}`; `EVIDENCE: {[tissueId]: {nivel, resumen, mecanismo: string[], hallazgos: {texto, enQuien}[], fuentes: {titulo, origen, url}[]}}` para los 6 ids de `TISSUES`; `POLARITY_EVIDENCE` con la misma forma sin `mecanismo` obligatorio.
- [ ] Prueba que falla: cada id de `TISSUES` tiene entrada; `nivel` en `EVIDENCE_LEVELS`; `resumen` no vacío; salvo `no-encontrada`, al menos una fuente y un hallazgo; toda `url` empieza por `https://`; `enQuien` ∈ {células, animales, personas}; `preclinica` no tiene hallazgos en personas.
- [ ] Implementar, correr `node --test tests/*.test.js`, commit.

### Task 3: Interfaz
**Files:** Modify `laboratorio/js/lab-magneto.js`
- [ ] En `info()`: rótulo «Clase» y un `<details>` «Para profundizar (bibliografía)» con nivel, mecanismo, hallazgos y fuentes.
- [ ] Tarjeta «Qué dice la evidencia» bajo el resumen: Tejido | Dice la clase | Evidencia | En una frase, más la fila de polaridad con sus fuentes.
- [ ] Verificar en Chrome sin interfaz a 1280 y 360 px (6 tejidos, enlaces, sin errores), suite en verde, commit.
