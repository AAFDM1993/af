/* Módulo corrientes exponenciales del Laboratorio. */
(function () {
  var K = LabKit, U = K.ui, X = ExponencialesCore, E = ElectroCore;

  var T1 =
    '<div class="card"><div id="exwave"></div><p id="exread"></p>' +
    '<div class="row"><label>Pulso</label><input type="range" id="exp" min="1" max="50" step="1" value="10"><span class="val" id="expv" style="min-width:80px"></span></div>' +
    '<div class="row"><label>Pausa</label><input type="range" id="exq" min="1" max="200" step="1" value="50"><span class="val" id="exqv" style="min-width:80px"></span></div>' +
    '<div class="row"><label>Constante de tiempo</label><input type="range" id="ext" min="0.5" max="20" step="0.5" value="4"><span class="val" id="extv" style="min-width:80px"></span></div>' +
    '<p class="note">La constante de tiempo es didáctica: controla qué tan lenta es la subida (la pendiente).</p></div>' +
    '<div><div class="card"><h2>Conceptos de la clase</h2><ul class="l" id="exconc"></ul></div><div class="card"><h2>Efectos</h2><ul class="l" id="exeff"></ul></div></div>';

  var T2 =
    '<div class="card"><h2>¿Qué tejido responde?</h2><div class="seg" id="extis"><button data-v="nervio-normal" class="on">Nervio y músculo normales</button><button data-v="denervado">Músculo denervado</button><button data-v="fibra-lisa">Fibra lisa</button></div>' +
    '<div id="exacom" style="margin-top:10px"></div><p id="exresp"></p></div>' +
    '<div class="card"><h2>Parámetros</h2><div class="row"><label>Pulso</label><input type="range" id="exp2" min="0" max="50" step="1" value="10"><span class="val" id="exp2v" style="min-width:80px"></span></div>' +
    '<div class="row"><label>Pausa</label><input type="range" id="exq2" min="0" max="200" step="1" value="50"><span class="val" id="exq2v" style="min-width:80px"></span></div>' +
    '<div id="exv"></div><div class="res" id="exm"></div>' +
    '<p class="note">Corriente estimulante, de pulso en milisegundos y pausa mayor entre los estímulos. Necesita más intensidad para estimular el nervio que la fibra muscular.</p></div>';

  var def = U.build({
    id: 'exponenciales', title: 'Corrientes exponenciales', subtitle: 'Estimulación selectiva · modelo didáctico para proyección', accent: '#8C5A14',
    tabs: [
      { title: 'Forma de onda y efectos', html: T1, init: function (root) {
        var $ = function (id) { return root.getElementById(id); };
        function draw() {
          var p = +$('exp').value, q = +$('exq').value, t = +$('ext').value, win = Math.min(400, 3 * (p + q));
          LabWave.line($('exwave'), E.expWave({ pulseMs: p, pauseMs: q, tauMs: t }, win, win / 500), { windowMs: win, title: 'Pulso exponencial (subida progresiva)',
            annotate: { pulse: p, pause: q, period: p + q, pulseText: 'Pulso ' + p + ' ms', pauseText: 'Pausa ' + q + ' ms', periodText: 'Periodo ' + (p + q) + ' ms · ' + K.fx(E.freqFromPulsePause(p, q), 1) + ' Hz' },
            note: 'Constante de tiempo ' + K.fx(t, 1) + ' ms (didáctica): pendiente de la subida' });
          $('exread').textContent = 'Pulso ' + p + ' ms, pausa ' + q + ' ms: frecuencia ' + K.fx(E.freqFromPulsePause(p, q), 1) + ' Hz.';
        }
        ['exp', 'exq'].forEach(function (id) { U.slider(root, id, function (v) { return v + ' ms'; }, draw); });
        U.slider(root, 'ext', function (v) { return K.fx(v, 1) + ' ms'; }, draw);
        draw();
        var ul = $('exconc'); ul.innerHTML = '';
        X.CONCEPTS.forEach(function (c) { var li = U.el('li'); li.appendChild(U.el('b', '', c.nombre + ': ')); li.appendChild(document.createTextNode(c.texto)); ul.appendChild(li); });
        U.fill($('exeff'), X.EFFECTS);
      } },
      { title: 'Dosis y técnica', html: T2, init: function (root) {
        var $ = function (id) { return root.getElementById(id); };
        function tis(v) { var r = X.selectiveStim(v); U.badge($('exacom'), r.acomoda ? 'warn' : 'ok', r.acomoda ? 'Se acomoda: no responde' : 'No se acomoda: responde'); $('exresp').textContent = r.respuesta; }
        function par() { U.verdict($('exv'), $('exm'), X.evaluateExp({ pulseMs: +$('exp2').value, pauseMs: +$('exq2').value }), { ok: 'Adecuada', ajustar: 'Ajustar' }); }
        U.seg($('extis'), tis);
        U.slider(root, 'exp2', function (v) { return v + ' ms'; }, par);
        U.slider(root, 'exq2', function (v) { return v + ' ms'; }, par);
        tis('nervio-normal'); par();
      } },
      { title: 'Seguridad', html: U.safeHtml('ex'), init: function (root) {
        U.fill(root.getElementById('exind'), ['Músculos denervados', 'Trastornos circulatorios por fallas del sistema neurovegetativo', 'Trastorno circulatorio de tipo arterial', 'Edemas']);
        U.checker(root, 'exchk', X.CONDITIONS);
      } },
      { title: 'Caso clínico', html: U.caseHtml('ex'), init: function (root) {
        U.cases(root, 'excases', X.CASES, {
          apto: { label: '¿Es apto/a?', type: 'select', options: [['si', 'Sí'], ['no', 'No']] },
          tissue: { label: 'Tejido sobre el que actúa', type: 'select', options: [['nervio-normal', 'Nervio y músculo normales'], ['denervado', 'Músculo denervado'], ['fibra-lisa', 'Fibra lisa']] }
        });
      } }
    ]
  });
  LabCore.register(def);
})();
