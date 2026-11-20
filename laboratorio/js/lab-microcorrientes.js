/* Módulo microcorrientes del Laboratorio. */
(function () {
  var K = LabKit, U = K.ui, M = MicroCore, E = ElectroCore;

  var T1 =
    '<div class="card"><div id="mcwave"></div><p id="mcread"></p>' +
    '<div class="row"><label>Ancho de pulso</label><input type="range" id="mcp" min="1" max="600" step="1" value="100"><span class="val" id="mcpv" style="min-width:90px"></span></div>' +
    '<div class="row"><label>Frecuencia</label><input type="range" id="mchz" min="0" max="1000" step="1" value="100"><span class="val" id="mchzv" style="min-width:90px"></span></div></div>' +
    '<div><div class="card"><h2>Efectos fisiológicos</h2><ul class="l" id="mceff"></ul></div><div class="card"><h2>Características</h2><ul class="l" id="mcnotes"></ul></div></div>';

  var T2 =
    '<div class="card"><h2>Aplicación</h2><div class="row"><label>Objetivo</label><div class="seg" id="mcobj"><button data-v="general" class="on">General</button><button data-v="ulcera">Úlcera</button></div></div>' +
    '<div class="row"><label>Ancho de pulso</label><input type="range" id="mcp2" min="0" max="600" step="1" value="100"><span class="val" id="mcp2v" style="min-width:90px"></span></div>' +
    '<div class="row"><label>Frecuencia</label><input type="range" id="mchz2" min="0" max="1100" step="1" value="100"><span class="val" id="mchz2v" style="min-width:90px"></span></div>' +
    '<div class="row"><label>Duración</label><input type="range" id="mcmin" min="0" max="130" step="1" value="15"><span class="val" id="mcminv" style="min-width:90px"></span></div>' +
    '<div id="mcverd"></div><div class="res" id="mcmsg"></div></div>' +
    '<div class="card"><h2>Técnica</h2><ul class="l"><li>Electrodos sobre la zona a tratar, o un aplicador para zonas pequeñas.</li><li>Aplicación coplanar; forma de pulso monofásica o bifásica rectangular.</li><li>De 10 a 20 min según la patología; en úlceras, 2 horas, 2 veces al día.</li><li>La aplicación es subsensorial: se dosifica en microamperios y casi no se percibe.</li></ul></div>';

  var def = U.build({
    id: 'microcorrientes', title: 'Microcorrientes (MES)', subtitle: 'Microelectroestimulación subsensorial · modelo didáctico para proyección', accent: '#2E7D6B',
    tabs: [
      { title: 'Forma de onda y efectos', html: T1, init: function (root) {
        var $ = function (id) { return root.getElementById(id); };
        function draw() {
          var us = +$('mcp').value, hz = +$('mchz').value, p = us / 1000;
          if (hz <= 0) {
            LabWave.line($('mcwave'), { t: [0, 10], v: [1, 1] }, { windowMs: 10, title: 'Frecuencia 0 Hz: corriente continua', annotate: { amp: 'Intensidad constante' } });
            $('mcread').textContent = 'Con 0 Hz no hay pulsos: es corriente continua.';
            return;
          }
          var q = Math.max(0, 1000 / hz - 2 * p), win = Math.min(3 * (2 * p + q), 10 * 2 * p), w = E.rectWave({ phase: 'bi-sym', pulseMs: p, pauseMs: q }, win, win / 500);
          var per = 2 * p + q; /* periodo dibujado (si 2 pulsos no caben en 1000 ÷ Hz, la pausa queda en 0) */
          LabWave.line($('mcwave'), w, { windowMs: win, title: 'Pulso bifásico rectangular (acercamiento)',
            annotate: { pulse: p, phases: 2, pause: q, period: per, pulseText: 'Pulso ' + us + ' µs', pauseText: 'Pausa ' + K.fx(q, q < 1 ? 2 : (q < 100 ? 1 : 0)) + ' ms', periodText: 'Periodo ' + K.fx(per, per < 10 ? 2 : (per < 100 ? 1 : 0)) + ' ms' + (q > 0 ? ' · ' + hz + ' Hz' : '') } });
          $('mcread').textContent = 'Pulsos de ' + us + ' µs a ' + hz + ' Hz (periodo ' + K.fx(1000 / hz, 2) + ' ms). La escala se acerca al pulso: la pausa se recorta.';
        }
        U.slider(root, 'mcp', function (v) { return v + ' µs'; }, draw);
        U.slider(root, 'mchz', function (v) { return v + ' Hz'; }, draw);
        draw(); U.fill($('mceff'), M.EFFECTS); U.fill($('mcnotes'), M.NOTES);
      } },
      { title: 'Dosis y técnica', html: T2, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, obj = 'general';
        function upd() {
          U.verdict($('mcverd'), $('mcmsg'), M.evaluateMicro({ pulseUs: +$('mcp2').value, hz: +$('mchz2').value, minutes: +$('mcmin').value, objective: obj }), { ok: 'Adecuada', ajustar: 'Ajustar' });
        }
        U.seg($('mcobj'), function (v) { obj = v; upd(); });
        U.slider(root, 'mcp2', function (v) { return v + ' µs'; }, upd);
        U.slider(root, 'mchz2', function (v) { return v + ' Hz'; }, upd);
        U.slider(root, 'mcmin', function (v) { return v + ' min'; }, upd);
        upd();
      } },
      { title: 'Seguridad', html: U.safeHtml('mc'), init: function (root) { U.fill(root.getElementById('mcind'), M.INDICATIONS); U.checker(root, 'mcchk', M.CONDITIONS); } },
      { title: 'Caso clínico', html: U.caseHtml('mc'), init: function (root) {
        U.cases(root, 'mccases', M.CASES, {
          apto: { label: '¿Es apto/a?', type: 'select', options: [['si', 'Sí'], ['no', 'No']] },
          minutes: { label: 'Duración por aplicación', type: 'number', unit: 'min' }
        });
      } }
    ]
  });
  LabCore.register(def);
})();
