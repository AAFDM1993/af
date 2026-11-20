/* Módulo interferencial del Laboratorio. */
(function () {
  var K = LabKit, U = K.ui, I = InterferencialCore;

  var T1 =
    '<div class="card"><div id="ifwave"></div><p id="ifread"></p>' +
    '<div class="row"><label>Segunda corriente</label><input type="range" id="ifamf" min="0" max="250" step="1" value="100"><span class="val" id="ifamfv" style="min-width:110px"></span></div>' +
    '<div class="row"><label>Profundidad de modulación</label><input type="range" id="ifdep" min="0" max="100" step="5" value="100"><span class="val" id="ifdepv" style="min-width:70px"></span></div>' +
    '<h2>Objetivos de esta AMF</h2><ul class="l" id="ifobj"></ul></div>' +
    '<div><div class="card"><h2>Efectos físicos</h2><ul class="l" id="ifphys"></ul></div><div class="card"><h2>Efectos fisiológicos</h2><ul class="l" id="ifeff"></ul></div></div>';

  var T2 =
    '<div class="card"><h2>Aplicación</h2>' +
    '<div class="row"><label>Fase</label><div class="seg" id="iffase"><button data-v="aguda" class="on">Aguda</button><button data-v="subaguda">Subaguda</button><button data-v="cronica">Crónica</button></div></div>' +
    '<div class="row"><label>Dosis</label><div class="seg" id="ifdose"><button data-v="mitis" class="on">Mitis (mínima)</button><button data-v="obvia">Obvia (normal)</button><button data-v="fortis">Fortis (tolerable)</button></div></div>' +
    '<div class="row"><label>AMF</label><input type="range" id="ifamf2" min="0" max="260" step="1" value="100"><span class="val" id="ifamf2v" style="min-width:80px"></span></div>' +
    '<div class="row"><label>Duración</label><input type="range" id="ifmin" min="0" max="20" step="1" value="10"><span class="val" id="ifminv"></span></div>' +
    '<div class="row"><label>Profundidad de modulación</label><input type="range" id="ifdep2" min="0" max="110" step="5" value="100"><span class="val" id="ifdep2v" style="min-width:70px"></span></div>' +
    '<div id="ifverd"></div><div class="res" id="ifmsg"></div></div>' +
    '<div><div class="card"><h2>Tipos de aplicación</h2><ul class="l" id="iftypes"></ul></div><div class="card"><h2>Características</h2><ul class="l" id="ifnotes"></ul></div></div>';

  var def = U.build({
    id: 'interferencial', title: 'Corriente interferencial', subtitle: 'Mediana frecuencia · modelo didáctico para proyección', accent: '#2F6B4F',
    tabs: [
      { title: 'Forma de onda y efectos', html: T1, init: function (root) {
        var $ = function (id) { return root.getElementById(id); };
        function draw() {
          var amf = +$('ifamf').value, dep = +$('ifdep').value / 100, f2 = I.secondFreq(amf), win = amf > 0 ? Math.min(3000, Math.max(30, 3000 / amf)) : 30;
          LabWave.envelope($('ifwave'), I.CARRIER_HZ, f2, win, { depth: dep, carriers: true, title: 'Corriente interferencial · AMF ' + amf + ' Hz' });
          $('ifread').textContent = 'Corriente 1: ' + I.CARRIER_HZ + ' Hz · corriente 2: ' + f2 + ' Hz · AMF = diferencia = ' + I.amfFromFreqs(I.CARRIER_HZ, f2) + ' Hz.' + (amf === 0 ? ' Con dos corrientes iguales no hay batido.' : '');
          var o = I.objectivesForAmf(amf);
          U.fill($('ifobj'), o.length ? o : [amf === 0 ? 'Sin batido: no hay modulación' : 'Fuera de las tablas de la clase']);
        }
        U.slider(root, 'ifamf', function (v) { return (4000 + v) + ' Hz'; }, draw);
        U.slider(root, 'ifdep', function (v) { return v + ' %'; }, draw);
        var ul = $('ifphys'); ul.innerHTML = '';
        I.PHYSICS.forEach(function (p) { var li = U.el('li'); li.appendChild(U.el('b', '', p.nombre + ': ')); li.appendChild(document.createTextNode(p.texto)); ul.appendChild(li); });
        U.fill($('ifeff'), I.EFFECTS); draw();
      } },
      { title: 'Dosis y técnica', html: T2, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, fase = 'aguda', dose = 'mitis';
        function upd() { U.verdict($('ifverd'), $('ifmsg'), I.evaluateIF({ amfHz: +$('ifamf2').value, phase: fase, dose: dose, minutes: +$('ifmin').value, depthPct: +$('ifdep2').value }), { ok: 'Adecuada', ajustar: 'Ajustar' }); }
        U.seg($('iffase'), function (v) { fase = v; upd(); });
        U.seg($('ifdose'), function (v) { dose = v; upd(); });
        U.slider(root, 'ifamf2', function (v) { return v + ' Hz'; }, upd);
        U.slider(root, 'ifmin', function (v) { return v + ' min'; }, upd);
        U.slider(root, 'ifdep2', function (v) { return v + ' %'; }, upd);
        var ul = $('iftypes'); ul.innerHTML = '';
        I.TYPES.forEach(function (t) { var li = U.el('li'); li.appendChild(U.el('b', '', t.nombre + ': ')); li.appendChild(document.createTextNode(t.texto)); ul.appendChild(li); });
        U.fill($('ifnotes'), I.NOTES); upd();
      } },
      { title: 'Seguridad', html: U.safeHtml('if'), init: function (root) { U.fill(root.getElementById('ifind'), I.INDICATIONS); U.checker(root, 'ifchk', I.CONDITIONS); } },
      { title: 'Caso clínico', html: U.caseHtml('if'), init: function (root) {
        U.cases(root, 'ifcases', I.CASES, {
          apto: { label: '¿Es apto/a?', type: 'select', options: [['si', 'Sí'], ['no', 'No']] },
          amfHz: { label: 'AMF', type: 'number', unit: 'Hz' },
          dose: { label: 'Dosis', type: 'select', options: [['mitis', 'Mitis (mínima)'], ['obvia', 'Obvia (normal)'], ['fortis', 'Fortis (tolerable)']] },
          minutes: { label: 'Duración', type: 'number', unit: 'min' }
        });
      } }
    ]
  });
  LabCore.register(def);
})();
