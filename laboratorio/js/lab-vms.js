/* Módulo VMS del Laboratorio. */
(function () {
  var K = LabKit, U = K.ui, V = VmsCore, E = ElectroCore;

  var T1 =
    '<div class="card"><div class="seg" id="vmmode"><button data-v="continuo" class="on">Continuo</button><button data-v="burst">Burst (ráfagas)</button></div><div id="vmwave" style="margin-top:10px"></div><p id="vmread"></p>' +
    '<div class="row"><label>Frecuencia</label><input type="range" id="vmhz" min="1" max="200" step="1" value="60"><span class="val" id="vmhzv" style="min-width:80px"></span></div>' +
    '<div class="row" id="vmbrow" hidden><label>Ráfagas por segundo</label><input type="range" id="vmb" min="1" max="10" step="1" value="2"><span class="val" id="vmbv" style="min-width:80px"></span></div></div>' +
    '<div><div class="card"><h2>Qué es</h2><ul class="l" id="vmnotes"></ul></div></div>';

  var T2 =
    '<div class="card"><h2>Aplicación</h2><div class="row"><label>Fibra</label><div class="seg" id="vmfib"><button data-v="fasica" class="on">Fásica (rápida)</button><button data-v="tonica">Tónica (lenta)</button></div></div>' +
    '<div class="row"><label>Frecuencia</label><input type="range" id="vmhz2" min="0" max="220" step="1" value="60"><span class="val" id="vmhz2v" style="min-width:80px"></span></div>' +
    '<div class="row"><label>Modo</label><div class="seg" id="vmmode2"><button data-v="continuo">Continuo</button><button data-v="burst" class="on">Burst</button></div></div>' +
    '<div id="vmverd"></div><div class="res" id="vmmsg"></div></div>' +
    '<div class="card"><h2>Fibras</h2><ul class="l"><li><b>Tónicas (contracción lenta):</b> 1–200 Hz según la clase 7.</li><li><b>Fásicas (contracción rápida):</b> 40–80 Hz.</li><li>La tetanización se alcanza a distinta frecuencia según la clase: 20–30 Hz (tónicas) y 50–150 Hz (fásicas) en la clase 7; 5–20 y 40–80 Hz en la clase 8.</li></ul></div>';

  var def = U.build({
    id: 'vms', title: 'VMS', subtitle: 'Vibratory motor stimulation · modelo didáctico para proyección', accent: '#3F6B9D',
    tabs: [
      { title: 'Forma de onda y efectos', html: T1, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, mode = 'continuo';
        function draw() {
          var hz = +$('vmhz').value, per = 1000 / hz, p = 0.2 * per, t = V.fiberTarget(hz);
          $('vmbrow').hidden = mode !== 'burst';
          if (mode === 'continuo') {
            LabWave.line($('vmwave'), E.rectWave({ phase: 'bi-sym', pulseMs: p, pauseMs: per - 2 * p }, 4 * per, per / 100), { windowMs: 4 * per, title: 'Pulsos rectangulares bifásicos simétricos · ' + hz + ' Hz',
              annotate: { period: per, periodText: 'Periodo ' + K.fx(per, per < 10 ? 2 : (per < 100 ? 1 : 0)) + ' ms (1000 ÷ ' + hz + ' Hz)' }, note: 'Esquema didáctico: el ancho de fase no es un dato de la clase' });
          } else {
            var b = +$('vmb').value;
            LabWave.bands($('vmwave'), E.gatedTrain({ burstHz: b, dutyPct: 50, windowMs: 3000 }), { windowMs: 3000, title: 'Ráfagas (' + b + ' por s) con ' + hz + ' Hz dentro de cada ráfaga',
              inner: { kind: 'biphasic', hz: hz }, annotate: { cycle: 1000 / b, cycleText: '1 ráfaga cada ' + K.fx(1000 / b, 0) + ' ms' }, note: 'Ráfaga/reposo 50 %: esquema didáctico' });
          }
          $('vmread').textContent = (t === 'ambas' ? 'Esta frecuencia sirve a fibras tónicas y fásicas.' : (t === 'tonica' ? 'Frecuencia de fibras tónicas (contracción lenta).' : 'Frecuencia fuera del rango de la clase.')) + ' Dibujo esquemático.';
        }
        U.seg($('vmmode'), function (v) { mode = v; draw(); });
        U.slider(root, 'vmhz', function (v) { return v + ' Hz'; }, draw);
        U.slider(root, 'vmb', function (v) { return v + ''; }, draw);
        U.fill($('vmnotes'), V.NOTES); draw();
      } },
      { title: 'Dosis y técnica', html: T2, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, fib = 'fasica', mode = 'burst';
        function upd() { U.verdict($('vmverd'), $('vmmsg'), V.evaluateVms({ hz: +$('vmhz2').value, mode: mode, fiber: fib }), { ok: 'Adecuada', ajustar: 'Ajustar' }); }
        U.seg($('vmfib'), function (v) { fib = v; upd(); });
        U.seg($('vmmode2'), function (v) { mode = v; upd(); });
        U.slider(root, 'vmhz2', function (v) { return v + ' Hz'; }, upd);
        upd();
      } },
      { title: 'Seguridad', html: U.safeHtml('vm'), init: function (root) { U.fill(root.getElementById('vmind'), ['Fortalecimiento de vientres musculares']); U.checker(root, 'vmchk', V.CONDITIONS); } },
      { title: 'Caso clínico', html: U.caseHtml('vm'), init: function (root) {
        U.cases(root, 'vmcases', V.CASES, {
          apto: { label: '¿Es apto/a?', type: 'select', options: [['si', 'Sí'], ['no', 'No']] },
          fiber: { label: 'Fibra', type: 'select', options: [['fasica', 'Fásica (rápida)'], ['tonica', 'Tónica (lenta)']] },
          hz: { label: 'Frecuencia', type: 'number', unit: 'Hz' }
        });
      } }
    ]
  });
  LabCore.register(def);
})();
