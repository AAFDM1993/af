/* Módulo Kotz del Laboratorio. */
(function () {
  var K = LabKit, U = K.ui, Z = KotzCore, E = ElectroCore;

  var T1 =
    '<div class="card"><div class="seg" id="kzfib"><button data-v="tonica" class="on">Fibras tónicas (20 Hz)</button><button data-v="fasica">Fibras fásicas (100 Hz)</button></div>' +
    '<div id="kzburst" style="margin-top:10px"></div><div id="kzcar"></div><p id="kzread"></p>' +
    '<div class="row"><label>Tiempo de ráfaga</label><input type="range" id="kzduty" min="10" max="90" step="10" value="50"><span class="val" id="kzdutyv"></span></div>' +
    '<p class="note">La clase no da el ciclo ráfaga/reposo: el 50 % es un esquema didáctico.</p></div>' +
    '<div><div class="card"><h2>La corriente de Kotz</h2><ul class="l" id="kznotes"></ul></div></div>';

  var T2 =
    '<div class="card"><h2>Aplicación</h2><div class="row"><label>Fibra</label><div class="seg" id="kzfib2"><button data-v="tonica" class="on">Tónica</button><button data-v="fasica">Fásica</button></div></div>' +
    '<div class="row"><label>Frecuencia de ráfagas</label><input type="range" id="kzb" min="0" max="150" step="1" value="20"><span class="val" id="kzbv" style="min-width:80px"></span></div>' +
    '<div class="row"><label>Tiempo de ráfaga</label><input type="range" id="kzd" min="0" max="100" step="1" value="50"><span class="val" id="kzdv"></span></div>' +
    '<div id="kzverd"></div><div class="res" id="kzmsg"></div></div>' +
    '<div class="card"><h2>Comparación</h2><ul class="l"><li>Portadora: 2 500 Hz (periodo 0,4 ms).</li><li>Ráfagas de 20 Hz: fibras tónicas (contracción lenta, resistentes a la fatiga).</li><li>Ráfagas de 100 Hz: fibras fásicas (contracción rápida).</li><li>Es una corriente de mediana frecuencia: menor resistencia de la piel y mayor profundidad que las de baja frecuencia.</li></ul></div>';

  var def = U.build({
    id: 'kotz', title: 'Corriente de Kotz', subtitle: 'Mediana frecuencia de 2 500 Hz en ráfagas · modelo didáctico para proyección', accent: '#9A4D2E',
    tabs: [
      { title: 'Forma de onda y efectos', html: T1, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, fib = 'tonica';
        function draw() {
          var b = Z.burstHzFor(fib), d = +$('kzduty').value, win = 3000 / b;
          LabWave.bands($('kzburst'), E.gatedTrain({ burstHz: b, dutyPct: d, windowMs: win }), { windowMs: win, title: 'Ráfagas de ' + b + ' Hz (tren de impulsos)',
            inner: { kind: 'square', hz: Z.CARRIER_HZ }, annotate: { cycle: 1000 / b, cycleText: '1 ráfaga cada ' + K.fx(1000 / b, 0) + ' ms (' + b + ' Hz)' } });
          LabWave.line($('kzcar'), E.rectWave({ phase: 'bi-sym', pulseMs: 0.2, pauseMs: 0 }, 2, 0.01), { windowMs: 2, title: 'Dentro de la ráfaga: portadora de 2 500 Hz',
            annotate: { period: 0.4, periodText: 'Periodo 0,4 ms (2 500 Hz)', pulse: 0.2, pulseText: 'Fase 0,2 ms' } });
          $('kzread').textContent = 'Con ráfagas de ' + b + ' Hz y ' + d + ' % de tiempo encendido, cada ráfaga contiene unos ' + K.fx(Z.carrierCyclesPerBurst(b, d), 1) + ' ciclos de la portadora.';
        }
        U.seg($('kzfib'), function (v) { fib = v; draw(); });
        U.slider(root, 'kzduty', function (v) { return v + ' %'; }, draw);
        U.fill($('kznotes'), Z.NOTES); draw();
      } },
      { title: 'Dosis y técnica', html: T2, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, fib = 'tonica';
        function upd() { U.verdict($('kzverd'), $('kzmsg'), Z.evaluateKotz({ fiber: fib, burstHz: +$('kzb').value, dutyPct: +$('kzd').value }), { ok: 'Adecuada', ajustar: 'Ajustar' }); }
        U.seg($('kzfib2'), function (v) { fib = v; upd(); });
        U.slider(root, 'kzb', function (v) { return v + ' Hz'; }, upd);
        U.slider(root, 'kzd', function (v) { return v + ' %'; }, upd);
        upd();
      } },
      { title: 'Seguridad', html: U.safeHtml('kz'), init: function (root) { U.fill(root.getElementById('kzind'), ['Fortalecimiento muscular']); U.checker(root, 'kzchk', Z.CONDITIONS); } },
      { title: 'Caso clínico', html: U.caseHtml('kz'), init: function (root) {
        U.cases(root, 'kzcases', Z.CASES, {
          apto: { label: '¿Es apto/a?', type: 'select', options: [['si', 'Sí'], ['no', 'No']] },
          fiber: { label: 'Fibra', type: 'select', options: [['tonica', 'Tónica (lenta)'], ['fasica', 'Fásica (rápida)']] },
          burstHz: { label: 'Frecuencia de ráfagas', type: 'number', unit: 'Hz' }
        });
      } }
    ]
  });
  LabCore.register(def);
})();
