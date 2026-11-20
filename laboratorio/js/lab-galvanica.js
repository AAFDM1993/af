/* Módulo galvánica y Trabert del Laboratorio. */
(function () {
  var K = LabKit, U = K.ui, G = GalvanicaCore, E = ElectroCore;

  var T1 =
    '<div class="card"><div class="seg" id="gvkind"><button data-v="galv" class="on">Corriente galvánica</button><button data-v="trab">Trabert</button></div><div id="gvwave" style="margin-top:10px"></div><p id="gvread"></p></div>' +
    '<div><div class="card" id="gvtrab" hidden><h2>Parámetros de Trabert</h2>' +
    '<div class="row"><label>Pulso</label><input type="range" id="gvp" min="0.5" max="12" step="0.5" value="2"><span class="val" id="gvpv"></span></div>' +
    '<div class="row"><label>Pausa</label><input type="range" id="gvq" min="0" max="10" step="0.5" value="5"><span class="val" id="gvqv"></span></div>' +
    '<ul class="l"><li>Vasodilatador, analgésico (SNP) y sedativo (SNC).</li><li>Sensación desagradable, con cansancio al final.</li><li>El pulso rectangular puede llegar hasta 10 ms (límite del pulso farádico).</li></ul></div>' +
    '<div class="card" id="gvgalv"><h2>Efectos polares</h2><div id="gvpolar"></div><p class="note">Las corrientes directas dejan una carga neta en los tejidos. Aplicada con voltaje constante es garantía de quemadura: la galvánica se aplica con corriente constante.</p></div></div>';

  var T2 =
    '<div class="card"><h2>Galvánica</h2>' +
    '<div class="row"><label>Área del electrodo</label><input type="range" id="gvarea" min="4" max="100" step="1" value="48"><span class="val" id="gvareav" style="min-width:80px"></span></div>' +
    '<div class="row"><label>Intensidad</label><input type="range" id="gvma" min="0" max="20" step="0.1" value="6"><span class="val" id="gvmav"></span></div>' +
    '<div class="row"><label>Duración</label><input type="range" id="gvmin" min="0" max="30" step="1" value="15"><span class="val" id="gvminv"></span></div>' +
    '<p id="gvrange" class="note"></p><div id="gvv"></div><div class="res" id="gvm"></div>' +
    '<div class="row"><label>Fármaco (iontoforesis)</label><select id="gvdrug"></select></div><p id="gvdrugr"></p></div>' +
    '<div class="card"><h2>Trabert</h2>' +
    '<div class="row"><label>Pulso</label><input type="range" id="gvtp" min="0.5" max="14" step="0.5" value="2"><span class="val" id="gvtpv"></span></div>' +
    '<div class="row"><label>Pausa</label><input type="range" id="gvtq" min="0" max="10" step="0.5" value="5"><span class="val" id="gvtqv"></span></div>' +
    '<div class="row"><label>Intensidad</label><input type="range" id="gvtma" min="0" max="15" step="0.5" value="8"><span class="val" id="gvtmav"></span></div>' +
    '<div class="row"><label>Duración</label><input type="range" id="gvtmin" min="0" max="15" step="1" value="10"><span class="val" id="gvtminv"></span></div>' +
    '<div class="row"><label>Polaridad invertida a los 5 min</label><label class="chk" style="min-width:0"><input type="checkbox" id="gvinv" checked> sí</label></div>' +
    '<div id="gvtv"></div><div class="res" id="gvtm"></div>' +
    '<p class="note">Técnica: cátodo en la zona de dolor y ánodo cerrando el circuito; bipolar paravertebral si el dolor es lumbar. Galvánica: electrodos de carbono con algodón mojado (o autoadhesivos), coplanar o contraplanar, sesiones diarias hasta 20.</p></div>';

  var def = U.build({
    id: 'galvanica', title: 'Galvánica y Trabert', subtitle: 'Corriente continua y corriente de Trabert · modelo didáctico para proyección', accent: '#7A3E9D',
    tabs: [
      { title: 'Forma de onda y efectos', html: T1, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, kind = 'galv';
        function polar() {
          var box = $('gvpolar'); box.innerHTML = '';
          ['catodo', 'anodo'].forEach(function (p) {
            var e = G.polarEffect(p), d = U.el('p'); d.appendChild(U.el('b', '', e.polaridad + ': ')); d.appendChild(document.createTextNode(e.reaccion + '. ' + e.atrae + '.')); box.appendChild(d);
          });
        }
        function draw() {
          var p = +$('gvp').value, q = +$('gvq').value;
          $('gvtrab').hidden = kind !== 'trab'; $('gvgalv').hidden = kind !== 'galv';
          if (kind === 'galv') {
            LabWave.line($('gvwave'), { t: [0, 10], v: [1, 1] }, { windowMs: 10, title: 'Corriente continua (galvánica)', annotate: { amp: 'Intensidad constante' }, note: 'Un solo sentido: sin pulsos ni pausas' });
            $('gvread').textContent = 'La intensidad es constante: 0,1 a 0,2 mA por cm² de electrodo, 15 a 20 min.';
          } else {
            var win = Math.max(6, 3 * (p + q)), w = E.rectWave({ phase: 'mono', pulseMs: p, pauseMs: q }, win, win / 500);
            LabWave.line($('gvwave'), w, { windowMs: win, title: 'Corriente de Trabert (pulso rectangular)',
              annotate: { pulse: p, pause: q, period: q > 0 ? p + q : 0, pulseText: 'Pulso ' + K.fx(p, 1) + ' ms', pauseText: 'Pausa ' + K.fx(q, 1) + ' ms', periodText: 'Periodo ' + K.fx(p + q, 1) + ' ms · ' + K.fx(G.trabertFreq(p, q), 0) + ' Hz' } });
            $('gvread').textContent = 'Frecuencia = 1000 ÷ (pulso + pausa) = ' + K.fx(G.trabertFreq(p, q), 0) + ' Hz · ciclo de trabajo ' + K.fx(E.dutyPct(p, q), 0) + ' %.';
          }
        }
        polar();
        U.seg($('gvkind'), function (v) { kind = v; draw(); });
        U.slider(root, 'gvp', function (v) { return K.fx(v, 1) + ' ms'; }, draw);
        U.slider(root, 'gvq', function (v) { return K.fx(v, 1) + ' ms'; }, draw);
        draw();
      } },
      { title: 'Dosis y técnica', html: T2, init: function (root) {
        var $ = function (id) { return root.getElementById(id); };
        function g() {
          var a = +$('gvarea').value, r = G.galvanicRange(a);
          $('gvrange').textContent = 'Para este electrodo la clase admite de ' + K.fx(r.minMA, 1) + ' a ' + K.fx(r.maxMA, 1) + ' mA (0,1–0,2 mA/cm²).';
          U.verdict($('gvv'), $('gvm'), G.evaluateGalvanic({ areaCm2: a, mA: +$('gvma').value, minutes: +$('gvmin').value }), { ok: 'Adecuada', ajustar: 'Ajustar', riesgo: 'Riesgo de quemadura' });
        }
        function t() {
          U.verdict($('gvtv'), $('gvtm'), G.evaluateTrabert({ pulseMs: +$('gvtp').value, pauseMs: +$('gvtq').value, mA: +$('gvtma').value, minutes: +$('gvtmin').value, inverted: $('gvinv').checked }), { ok: 'Adecuada', ajustar: 'Ajustar', riesgo: 'Riesgo' });
        }
        U.slider(root, 'gvarea', function (v) { return v + ' cm²'; }, g);
        U.slider(root, 'gvma', function (v) { return K.fx(v, 1) + ' mA'; }, g);
        U.slider(root, 'gvmin', function (v) { return v + ' min'; }, g);
        U.slider(root, 'gvtp', function (v) { return K.fx(v, 1) + ' ms'; }, t);
        U.slider(root, 'gvtq', function (v) { return K.fx(v, 1) + ' ms'; }, t);
        U.slider(root, 'gvtma', function (v) { return K.fx(v, 1) + ' mA'; }, t);
        U.slider(root, 'gvtmin', function (v) { return v + ' min'; }, t);
        $('gvinv').addEventListener('change', t);
        var sel = $('gvdrug');
        [['lidocaína', 'Lidocaína (anestésico)'], ['novocaína', 'Novocaína (anestésico)'], ['xilocaína', 'Xilocaína (anestésico)'], ['piroxicam', 'Piroxicam (antiinflamatorio)'], ['ibuprofeno', 'Ibuprofeno (antiinflamatorio)'], ['diclofenaco', 'Diclofenaco (antiinflamatorio)']].forEach(function (d) { var o = U.el('option', '', d[1]); o.value = d[0]; sel.appendChild(o); });
        function drug() {
          var p = G.drugPole(sel.value), neg = p === 'catodo';
          $('gvdrugr').textContent = 'Fármaco con iones ' + (neg ? 'negativos (−)' : 'positivos (+)') + ': se coloca bajo el ' + (neg ? 'cátodo (negativo), que lo repele hacia el tejido.' : 'ánodo (positivo), que lo repele hacia el tejido.');
        }
        sel.addEventListener('change', drug); drug(); g(); t();
      } },
      { title: 'Seguridad', html: U.safeHtml('gv'), init: function (root) { U.fill(root.getElementById('gvind'), G.INDICATIONS); U.checker(root, 'gvchk', G.CONDITIONS); } },
      { title: 'Caso clínico', html: U.caseHtml('gv'), init: function (root) {
        U.cases(root, 'gvcases', G.CASES, {
          apto: { label: '¿Es apto/a?', type: 'select', options: [['si', 'Sí'], ['no', 'No']] },
          current: { label: 'Corriente', type: 'select', options: [['galvanica', 'Galvánica'], ['trabert', 'Trabert']] },
          mA: { label: 'Intensidad', type: 'number', step: 0.1, unit: 'mA' },
          minutes: { label: 'Duración', type: 'number', unit: 'min' }
        });
      } }
    ]
  });
  LabCore.register(def);
})();
