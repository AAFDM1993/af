/* Módulo EMS del Laboratorio. */
(function () {
  var K = LabKit, U = K.ui, M = EmsCore, E = ElectroCore;

  var T1 =
    '<div class="card"><div class="seg" id="emfib"><button data-v="fasica" class="on">Fásica (rápida)</button><button data-v="tonica">Tónica (lenta)</button></div><div id="emwave" style="margin-top:10px"></div><p id="emread"></p>' +
    '<div class="row"><label>Frecuencia</label><input type="range" id="emhz" min="1" max="150" step="1" value="60"><span class="val" id="emhzv" style="min-width:80px"></span></div>' +
    '<div class="row"><label>Duración de pulso</label><input type="range" id="emp" min="50" max="400" step="10" value="200"><span class="val" id="empv" style="min-width:90px"></span></div></div>' +
    '<div><div class="card"><h2>Contracción y reposo (ráfagas)</h2><div id="emburst"></div><div class="row"><label>Tiempo de contracción</label><input type="range" id="emduty" min="10" max="90" step="10" value="50"><span class="val" id="emdutyv"></span></div><p class="note">Esquema didáctico: la clase pide respetar el periodo de recuperación entre ráfagas (fatiga o tetanización) pero no da el cociente contracción/reposo.</p></div>' +
    '<div class="card"><h2>Efectos</h2><ul class="l" id="emeff"></ul></div></div>';

  var T2 =
    '<div class="card"><h2>Aplicación</h2><div class="row"><label>Fibra</label><div class="seg" id="emfib2"><button data-v="fasica" class="on">Fásica (40–80 Hz)</button><button data-v="tonica">Tónica (5–20 Hz)</button></div></div>' +
    '<div class="row"><label>Frecuencia</label><input type="range" id="emhz2" min="0" max="150" step="1" value="60"><span class="val" id="emhz2v" style="min-width:80px"></span></div>' +
    '<div class="row"><label>Duración de pulso</label><input type="range" id="emp2" min="50" max="400" step="10" value="200"><span class="val" id="emp2v" style="min-width:90px"></span></div>' +
    '<div class="row"><label>Tiempo</label><input type="range" id="emmin" min="0" max="30" step="1" value="15"><span class="val" id="emminv"></span></div>' +
    '<p class="note" id="emfhz"></p><div id="emverd"></div><div class="res" id="emmsg"></div></div>' +
    '<div><div class="card"><h2>Protocolos</h2><ul class="l" id="emprot"></ul></div><div class="card"><h2>Formas de estimulación motora</h2><ul class="l" id="emforms"></ul></div></div>';

  var def = U.build({
    id: 'ems', title: 'EMS', subtitle: 'Estimulación eléctrica muscular · modelo didáctico para proyección', accent: '#6B4FA0',
    tabs: [
      { title: 'Forma de onda y efectos', html: T1, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, fib = 'fasica';
        function draw() {
          var hz = +$('emhz').value, us = +$('emp').value, p = us / 1000, per = 1000 / hz, q = Math.max(0, per - p), win = Math.min(3 * (p + q), 10 * p);
          LabWave.line($('emwave'), E.rectWave({ phase: 'mono', pulseMs: p, pauseMs: q }, win, win / 500), { windowMs: win, title: 'Pulso rectangular (acercamiento) · ' + hz + ' Hz',
            annotate: { pulse: p, pause: q, period: per, pulseText: 'Pulso ' + us + ' µs', pauseText: 'Pausa ' + K.fx(q, q < 100 ? 1 : 0) + ' ms', periodText: 'Periodo ' + K.fx(per, per < 100 ? 1 : 0) + ' ms' } });
          burst();
          var f = M.fiberFromHz(hz);
          $('emread').textContent = 'Pulsos de ' + us + ' µs a ' + hz + ' Hz. ' + (f.length ? 'Frecuencia de fibras ' + (f[0] === 'tonica' ? 'tónicas (5–20 Hz).' : 'fásicas (40–80 Hz).') : 'Frecuencia fuera de los rangos tónico y fásico de la clase.');
        }
        function burst() {
          var d = +$('emduty').value;
          LabWave.bands($('emburst'), E.gatedTrain({ burstHz: 0.5, dutyPct: d, windowMs: 6000 }), { windowMs: 6000, title: 'Contracción (' + d + ' %) y reposo', labels: { on: 'Contracción', off: 'Reposo' }, inner: { kind: 'pulse', hz: +$('emhz').value }, note: 'Esquema didáctico' });
        }
        U.seg($('emfib'), function (v) { fib = v; var h = v === 'fasica' ? 60 : 10; $('emhz').value = h; $('emhzv').textContent = h + ' Hz'; draw(); });
        U.slider(root, 'emhz', function (v) { return v + ' Hz'; }, draw);
        U.slider(root, 'emp', function (v) { return v + ' µs'; }, draw);
        U.slider(root, 'emduty', function (v) { return v + ' %'; }, burst);
        U.fill($('emeff'), M.EFFECTS); draw();
      } },
      { title: 'Dosis y técnica', html: T2, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, fib = 'fasica';
        function upd() {
          var hz = +$('emhz2').value, f = M.fiberFromHz(hz);
          $('emfhz').textContent = f.length ? 'Esta frecuencia corresponde a fibras ' + f.map(function (x) { return x === 'tonica' ? 'tónicas' : 'fásicas'; }).join(' y ') + '.' : 'Esta frecuencia no corresponde a un rango de fibra de la clase.';
          U.verdict($('emverd'), $('emmsg'), M.evaluateEms({ fiber: fib, hz: hz, pulseUs: +$('emp2').value, minutes: +$('emmin').value }), { ok: 'Adecuada', ajustar: 'Ajustar' });
        }
        U.seg($('emfib2'), function (v) { fib = v; upd(); });
        U.slider(root, 'emhz2', function (v) { return v + ' Hz'; }, upd);
        U.slider(root, 'emp2', function (v) { return v + ' µs'; }, upd);
        U.slider(root, 'emmin', function (v) { return v + ' min'; }, upd);
        var ul = $('emprot'); ul.innerHTML = '';
        M.PROTOCOLS.forEach(function (p) { var li = U.el('li'); li.appendChild(U.el('b', '', p.nombre + ': ')); li.appendChild(document.createTextNode(p.parametros)); ul.appendChild(li); });
        var f = $('emforms'); f.innerHTML = '';
        M.FORMS.forEach(function (p) { var li = U.el('li'); li.appendChild(U.el('b', '', p.nombre + ': ')); li.appendChild(document.createTextNode(p.como)); f.appendChild(li); });
        upd();
      } },
      { title: 'Seguridad', html: U.safeHtml('em'), init: function (root) {
        U.fill(root.getElementById('emind'), ['Prevención de la hipotrofia por desuso', 'Fortalecimiento muscular', 'Favorece la circulación sanguínea', 'Electrostretching', 'Estimulación muscular en parálisis centrales', 'Dolor crónico']);
        U.checker(root, 'emchk', M.CONDITIONS);
      } },
      { title: 'Caso clínico', html: U.caseHtml('em'), init: function (root) {
        U.cases(root, 'emcases', M.CASES, {
          apto: { label: '¿Es apto/a?', type: 'select', options: [['si', 'Sí'], ['no', 'No']] },
          fiber: { label: 'Fibra', type: 'select', options: [['fasica', 'Fásica (rápida)'], ['tonica', 'Tónica (lenta)']] },
          hz: { label: 'Frecuencia', type: 'number', unit: 'Hz' },
          minutes: { label: 'Tiempo', type: 'number', unit: 'min' }
        });
      } }
    ]
  });
  LabCore.register(def);
})();
