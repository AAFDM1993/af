/* Núcleo de cálculo del ultrasonido terapéutico (valores didácticos). */
var USCore = (function () {
  /* % de intensidad que queda a depth cm, con atenuación alpha (dB/cm/MHz) a freq MHz. */
  function remaining(depthCm, freqMHz, alphaDbCmMHz) {
    return 100 * Math.pow(10, -alphaDbCmMHz * freqMHz * depthCm / 10);
  }
  /* Profundidad (cm) a la que queda el 50 % (3,01 dB de atenuación). */
  function halfValueLayerCm(freqMHz, alphaDbCmMHz) {
    return 3.01 / (alphaDbCmMHz * freqMHz);
  }
  function phaseLabel(intensityWcm2) {
    return intensityWcm2 < 0.8 ? 'Aguda (0,3–0,8)' : (intensityWcm2 < 1.2 ? 'Subaguda (0,8–1,2)' : 'Crónica (1,2–3)');
  }
  /* Índice didáctico de cavitación: intensidad × ciclo, y 3 MHz pesa 0,35 respecto de 1 MHz. */
  function cavitationIndex(intensityWcm2, dutyCycle, freqMHz) {
    return intensityWcm2 * dutyCycle * (freqMHz == 1 ? 1 : 0.35);
  }
  return { remaining: remaining, halfValueLayerCm: halfValueLayerCm, phaseLabel: phaseLabel, cavitationIndex: cavitationIndex };
})();
if (typeof module !== 'undefined') module.exports = USCore;
