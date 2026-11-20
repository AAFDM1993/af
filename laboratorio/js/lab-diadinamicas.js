/* Módulo diadinámicas del Laboratorio. */
(function () {
  var K = LabKit, U = K.ui, D = DiadCore, E = ElectroCore;
  var OBJ = [['miogelosis', 'Miogelosis o tejido conjuntivo'], ['cadena-simpatica', 'Cadena simpática y circulación'], ['mialgia', 'Mialgias y lumbociatalgias'], ['edema', 'Edema o celulitis'], ['hipotrofia', 'Hipotrofia muscular']];

  var T1 =
    '<div class="card"><div class="seg" id="ddcur"></div><div id="ddwave" style="margin-top:10px"></div><div class="row" id="ddphrow" hidden><label>Duración de la fase</label><div class="seg" id="ddph"><button data-v="6000">6 s</button><button data-v="8000" class="on">8 s</button><button data-v="10000">10 s</button></div></div></div>' +
    '<div class="card"><h2 id="ddname"></h2><ul class="l" id="ddinfo"></ul><p class="note">Se obtienen por rectificación de una corriente alterna y su posterior modulación: son sinusoidales, interrumpidas y moduladas. Se inicia siempre con una base DF para desensibilizar.</p></div>';

  var T2 =
    '<div class="card"><h2>¿Qué corriente elijo?</h2><div class="row"><label>Objetivo</label><select id="ddobj"></select></div><p id="ddsug"></p>' +
    '<h2>Sesión</h2>' +
    '<div class="row"><label>Base DF</label><input type="range" id="ddbase" min="0" max="8" step="1" value="4"><span class="val" id="ddbasev"></span></div>' +
    '<div class="row"><label>N.º de sesiones</label><input type="range" id="ddses" min="1" max="25" step="1" value="12"><span class="val" id="ddsesv"></span></div>' +
    '<div class="row"><label>Fase</label><div class="seg" id="ddfase"><button data-v="aguda">Aguda</button><button data-v="subaguda" class="on">Subaguda</button><button data-v="cronica">Crónica</button></div></div>' +
    '<div id="ddv"></div><div class="res" id="ddm"></div></div>' +
    '<div><div class="card"><h2>Técnica de aplicación</h2><ul class="l" id="ddtec"></ul></div>' +
    '<div class="card"><h2>Combinadas</h2><ul class="l" id="ddcomb"></ul><p class="note">Base galvánica previa de 2–3 mA y luego subir la intensidad. Tiempo corto: 3 min con polaridad positiva y 3 min con negativa; con 3 zonas, 3, 2 y 1 min. Máximo 12–15 sesiones (en general 20) y descanso.</p></div></div>';

  var def = U.build({
    id: 'diadinamicas', title: 'Corrientes diadinámicas', subtitle: 'MF · DF · CP · LP · RS · modelo didáctico para proyección', accent: '#B23A48',
    tabs: [
      { title: 'Forma de onda y efectos', html: T1, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, cur = 'MF', phase = 8000, seg = $('ddcur');
        D.CURRENTS.forEach(function (c) { var b = U.el('button', c.id === cur ? 'on' : '', c.id); b.setAttribute('data-v', c.id); seg.appendChild(b); });
        function draw() {
          var c = D.CURRENTS.filter(function (x) { return x.id === cur; })[0];
          $('ddphrow').hidden = cur !== 'LP';
          if (cur === 'MF' || cur === 'DF') {
            var w = E.halfSineWave({ pulseMs: c.pulseMs, pauseMs: c.pauseMs }, 60, 0.2);
            var ann = cur === 'MF'
              ? { pulse: c.pulseMs, pause: c.pauseMs, period: c.pulseMs + c.pauseMs, pulseText: 'Semionda ' + c.pulseMs + ' ms', pauseText: 'Pausa ' + c.pauseMs + ' ms', periodText: 'Periodo ' + (c.pulseMs + c.pauseMs) + ' ms · ' + c.hz + ' Hz' }
              : { pulse: c.pulseMs, pulseText: 'Semionda ' + c.pulseMs + ' ms, sin pausa · ' + c.hz + ' Hz' };
            LabWave.line($('ddwave'), w, { windowMs: 60, title: c.nombre + ' · ' + c.hz + ' Hz', annotate: ann, note: cur === 'MF' ? 'Rectificación de media onda' : 'Rectificación de onda completa' });
          } else {
            var win = cur === 'LP' ? 4 * phase : 4000, seq = E.diadSequence(cur, win, phase), first = seq.length ? seq[0].endMs - seq[0].startMs : 0;
            var lab = 'MF', second = cur === 'CP' ? 'DF' : (cur === 'LP' ? 'MF+DF' : 'pausa');
            LabWave.bands($('ddwave'), seq, { windowMs: win, title: c.nombre, unit: 'ms', inner: { kind: 'diad' },
              annotate: { first: first, firstText: lab + ' ' + K.fx(first / 1000, 0) + ' s', cycle: 2 * first, cycleText: 'Ciclo: ' + lab + ' ' + K.fx(first / 1000, 0) + ' s + ' + second + ' ' + K.fx(first / 1000, 0) + ' s' } });
          }
          $('ddname').textContent = c.nombre;
          U.fill($('ddinfo'), ['Efecto: ' + c.efecto, 'Sensación: ' + c.sensacion, 'Indicación: ' + c.indicacion].concat(c.pauseMs === 0 || cur === 'MF' ? ['Pulso ' + c.pulseMs + ' ms, pausa ' + c.pauseMs + ' ms, ' + K.fx(E.freqFromPulsePause(c.pulseMs, c.pauseMs), 0) + ' Hz.'] : []));
        }
        U.seg(seg, function (v) { cur = v; draw(); });
        U.seg($('ddph'), function (v) { phase = +v; draw(); });
        draw();
      } },
      { title: 'Dosis y técnica', html: T2, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, fase = 'subaguda', obj = $('ddobj');
        OBJ.forEach(function (o) { var e = U.el('option', '', o[1]); e.value = o[0]; obj.appendChild(e); });
        function sug() {
          var id = D.suggestCurrent(obj.value), c = D.CURRENTS.filter(function (x) { return x.id === id; })[0];
          $('ddsug').textContent = 'Corriente indicada: ' + c.nombre + '. ' + c.indicacion + '.';
        }
        function ses() {
          var cur = D.suggestCurrent(obj.value);
          U.verdict($('ddv'), $('ddm'), D.evaluateDiad({ current: cur, baseMin: +$('ddbase').value, sessions: +$('ddses').value, phase: fase }), { ok: 'Adecuada', ajustar: 'Ajustar' });
        }
        obj.addEventListener('change', function () { sug(); ses(); });
        U.seg($('ddfase'), function (v) { fase = v; ses(); });
        U.slider(root, 'ddbase', function (v) { return v + ' min'; }, ses);
        U.slider(root, 'ddses', function (v) { return v + ''; }, ses);
        var ul = $('ddtec'); ul.innerHTML = '';
        D.TECHNIQUES.forEach(function (t) { var li = U.el('li'); li.appendChild(U.el('b', '', t.nombre + ': ')); li.appendChild(document.createTextNode(t.como + (t.invierte ? ' Se invierte la polaridad a la mitad del tratamiento.' : ' No se invierte la polaridad.'))); ul.appendChild(li); });
        U.fill($('ddcomb'), D.COMBINED.map(function (c) { return c.nombre + ': ' + c.indicacion; }));
        sug(); ses();
      } },
      { title: 'Seguridad', html: U.safeHtml('dd'), init: function (root) {
        U.fill(root.getElementById('ddind'), D.CURRENTS.map(function (c) { return c.id + ': ' + c.indicacion; }));
        U.checker(root, 'ddchk', D.CONDITIONS);
      } },
      { title: 'Caso clínico', html: U.caseHtml('dd'), init: function (root) {
        U.cases(root, 'ddcases', D.CASES, {
          apto: { label: '¿Es apto/a?', type: 'select', options: [['si', 'Sí'], ['no', 'No']] },
          current: { label: 'Corriente', type: 'select', options: D.CURRENTS.map(function (c) { return [c.id, c.nombre]; }) },
          baseMin: { label: 'Base DF inicial', type: 'number', unit: 'min' }
        });
      } }
    ]
  });
  LabCore.register(def);
})();
