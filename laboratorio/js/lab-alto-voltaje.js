/* Módulo alto voltaje (CPAV) del Laboratorio. */
(function () {
  var K = LabKit, U = K.ui, A = AltoVoltajeCore, E = ElectroCore;

  var T1 =
    '<div class="card"><div id="avwave"></div><div class="row"><label>Pulsaciones por segundo</label><input type="range" id="avpps" min="1" max="150" step="1" value="4"><span class="val" id="avppsv" style="min-width:90px"></span></div><p id="avread"></p></div>' +
    '<div><div class="card"><h2>Efectos fisiológicos</h2><ul class="l" id="aveff"></ul></div><div class="card"><h2>Características</h2><ul class="l" id="avnotes"></ul></div></div>';

  var T2 =
    '<div class="card"><h2>Aplicación</h2><div class="row"><label>Dolor</label><div class="seg" id="avobj"><button data-v="agudo" class="on">Agudo</button><button data-v="cronico">Crónico</button></div></div>' +
    '<div class="row"><label>Frecuencia</label><input type="range" id="avhz" min="1" max="150" step="1" value="100"><span class="val" id="avhzv" style="min-width:80px"></span></div>' +
    '<div class="row"><label>Duración</label><input type="range" id="avmin" min="0" max="25" step="1" value="20"><span class="val" id="avminv"></span></div>' +
    '<div class="row"><label>Voltaje</label><input type="range" id="avv" min="50" max="500" step="10" value="150"><span class="val" id="avvv" style="min-width:80px"></span></div>' +
    '<div id="avverd"></div><div class="res" id="avmsg"></div></div>' +
    '<div class="card"><h2>Técnica</h2><ul class="l"><li><b>Dolor agudo:</b> ciclo continuo, polaridad positiva o negativa, 50–120 Hz, 20 min, electrodos sobre la zona dolorosa.</li><li><b>Dolor crónico:</b> ciclo continuo, polaridad positiva o negativa, 2–15 Hz, 10 min, electrodo activo más pequeño sobre la zona de dolor.</li><li>Heridas abiertas y úlceras por presión: polaridad positiva o negativa sobre el tejido.</li><li>Sensación agradable; no forma efectos térmicos ni químicos en el tejido.</li></ul>' +
    '<p class="note">La clase da la duración de los picos y la amplitud en milisegundos y la intensidad como "500 V = 2 A"; esos datos no son coherentes (los picos duran microsegundos y la corriente depende de la resistencia), por eso el módulo no los rotula.</p></div>';

  var def = U.build({
    id: 'alto-voltaje', title: 'Alto voltaje (CPAV)', subtitle: 'Corriente pulsada de alto voltaje · modelo didáctico para proyección', accent: '#C2570C',
    tabs: [
      { title: 'Forma de onda y efectos', html: T1, init: function (root) {
        var $ = function (id) { return root.getElementById(id); };
        function draw(pps) {
          LabWave.peaks($('avwave'), E.twinPeakTimes(pps, 1000, Math.min(20, 300 / pps)), 1000, { title: 'Dobles picos en 1 segundo (' + pps + ' PPS)',
            annotate: { pairText: '1 onda = 2 picos', period: 1000 / pps, periodText: '1 onda cada ' + K.fx(1000 / pps, 1000 / pps < 10 ? 1 : 0) + ' ms' }, note: 'Esquema didáctico: separación de los picos exagerada' });
          var band = A.classifyHz(pps);
          $('avread').textContent = pps + ' PPS = ' + pps + ' ondas completas por segundo = ' + A.peaksPerSecond(pps) + ' picos. ' + (band === 'estimulante' ? 'Banda estimulante (1–80 Hz).' : (band === 'analgesica' ? 'Banda analgésica (80–150 Hz).' : '') + ' Dibujo esquemático: los dos picos de cada onda se separan más de lo real para poder verlos.');
        }
        U.slider(root, 'avpps', function (v) { return v + ' PPS'; }, draw);
        draw(4);
        U.fill($('aveff'), A.EFFECTS); U.fill($('avnotes'), A.NOTES);
      } },
      { title: 'Dosis y técnica', html: T2, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, obj = 'agudo';
        function upd() {
          U.verdict($('avverd'), $('avmsg'), A.evaluateHV({ objective: obj, hz: +$('avhz').value, minutes: +$('avmin').value, volts: +$('avv').value }), { ok: 'Adecuada', ajustar: 'Ajustar' });
        }
        U.seg($('avobj'), function (v) { obj = v; upd(); });
        U.slider(root, 'avhz', function (v) { return v + ' Hz'; }, upd);
        U.slider(root, 'avmin', function (v) { return v + ' min'; }, upd);
        U.slider(root, 'avv', function (v) { return v + ' V'; }, upd);
        upd();
      } },
      { title: 'Seguridad', html: U.safeHtml('av'), init: function (root) {
        U.fill(root.getElementById('avind'), ['Dolor agudo y dolor crónico', 'Inflamación', 'Edemas', 'Heridas abiertas y úlceras por presión', 'Aumento de la circulación']);
        U.checker(root, 'avchk', A.CONDITIONS);
      } },
      { title: 'Caso clínico', html: U.caseHtml('av'), init: function (root) {
        U.cases(root, 'avcases', A.CASES, {
          apto: { label: '¿Es apto/a?', type: 'select', options: [['si', 'Sí'], ['no', 'No']] },
          hz: { label: 'Frecuencia', type: 'number', unit: 'Hz' },
          minutes: { label: 'Duración', type: 'number', unit: 'min' }
        });
      } }
    ]
  });
  LabCore.register(def);
})();
