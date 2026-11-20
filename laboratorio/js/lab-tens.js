/* Módulo TENS del Laboratorio. */
(function () {
  var K = LabKit, U = K.ui, T = TensCore, E = ElectroCore;
  var START = { convencional: [100, 100], acupuntura: [2, 250], breve: [100, 200], burst: [70, 150] };

  /* Compuerta medular: cada fibra dibujada según su tipo, una barra con su tiempo de llegada (cálculo de TensCore) y la médula a la derecha. */
  function fibersSvg(distM) {
    var names = [['Abeta', 'Aβ', '50–70 m/s', 60, 'cierra la compuerta'], ['Adelta', 'Aδ', '20–25 m/s', 22.5, 'señal dolorosa'], ['C', 'C', '1–2 m/s', 1.5, 'señal dolorosa']], tmax = T.conductionTimeMs(distM, 1.5);
    var X1 = 176, GX = 548, BMAX = 250, s = '<svg viewBox="0 0 640 352" role="img" aria-label="Compuerta medular y tiempo de llegada por tipo de fibra"><rect width="640" height="352" fill="#fff"/>';
    s += '<text x="320" y="26" text-anchor="middle" font-size="19" font-weight="bold" fill="#2B1B10">Llegada de la señal a ' + K.fx(distM, 1) + ' m (velocidad media)</text>';
    s += '<text x="' + X1 + '" y="52" font-size="14" fill="#6b5848">Estímulo en la piel →</text><text x="' + (GX + 40) + '" y="52" text-anchor="middle" font-size="14" fill="#6b5848">Médula</text>';
    /* médula con la compuerta */
    s += '<rect x="' + GX + '" y="60" width="80" height="252" rx="14" style="fill:var(--accent,#1F3F6B)" fill-opacity="0.12" stroke="#9fb3c2" stroke-width="2"/>';
    s += '<text x="' + (GX + 46) + '" y="186" text-anchor="middle" font-size="16" font-weight="bold" style="fill:var(--accent,#1F3F6B)" transform="rotate(-90 ' + (GX + 46) + ' 186)">Compuerta medular</text>';
    names.forEach(function (n, i) {
      var t = T.conductionTimeMs(distM, n[3]), w = Math.max(4, BMAX * t / tmax), y = 66 + i * 82, fy = y + 18;
      s += '<text x="14" y="' + (y + 22) + '" font-size="20" font-weight="bold" fill="#2B1B10">Fibras ' + n[1] + '</text>';
      s += '<text x="14" y="' + (y + 43) + '" font-size="15" fill="#2B1B10">' + n[2] + '</text><text x="14" y="' + (y + 62) + '" font-size="14" fill="#6b5848">' + n[4] + '</text>';
      /* la fibra: axón con vainas (Aβ gruesas, Aδ finas) o fibra fina sin vainas (C) */
      var axW = n[0] === 'Abeta' ? 4 : (n[0] === 'Adelta' ? 3 : 2);
      s += '<line x1="' + X1 + '" y1="' + fy + '" x2="' + GX + '" y2="' + fy + '" stroke="#5a4636" stroke-width="' + axW + '"/>';
      if (n[0] !== 'C') {
        var bw = n[0] === 'Abeta' ? 30 : 22, bh = n[0] === 'Abeta' ? 16 : 10;
        for (var bx = X1 + 6; bx + bw < GX - 4; bx += bw + 8) s += '<rect x="' + bx + '" y="' + (fy - bh / 2) + '" width="' + bw + '" height="' + bh + '" rx="' + (bh / 2) + '" fill="#F1E3C8" stroke="#B89B6A" stroke-width="1.2"/>';
      }
      /* barra del tiempo de llegada */
      s += '<rect x="' + X1 + '" y="' + (y + 34) + '" width="' + w.toFixed(1) + '" height="22" rx="5" style="fill:var(--accent,#1F3F6B)"/>';
      s += '<text x="' + (X1 + w + 8).toFixed(1) + '" y="' + (y + 51) + '" font-size="17" font-weight="bold" fill="#2B1B10">' + K.fx(t, t < 100 ? 1 : 0) + ' ms</text>';
      s += '<text x="' + (GX - 8) + '" y="' + (y + 51) + '" text-anchor="end" font-size="14" font-weight="bold" fill="#6b5848">' + (i + 1) + '.º</text>';
      /* entrada a la médula: Aβ cierra; Aδ y C encuentran la compuerta cerrada */
      if (i === 0) s += '<polygon points="' + (GX + 14) + ',' + fy + ' ' + (GX + 2) + ',' + (fy - 7) + ' ' + (GX + 2) + ',' + (fy + 7) + '" fill="#2E7D4F"/>';
      else s += '<rect x="' + (GX - 2) + '" y="' + (fy - 14) + '" width="7" height="28" rx="2" fill="#B3261E"/>';
    });
    s += '<text x="320" y="338" text-anchor="middle" font-size="15" fill="#2B1B10">Aβ llega primero y cierra la compuerta: la señal dolorosa de Aδ y C pasa menos.</text>';
    return s + '</svg>';
  }

  var T1 =
    '<div class="card"><div class="seg" id="tnmode"></div><div id="tnwave" style="margin-top:10px"></div><p id="tnread"></p>' +
    '<div class="row"><label>Frecuencia</label><input type="range" id="tnhz" min="1" max="150" step="1" value="100"><span class="val" id="tnhzv" style="min-width:80px"></span></div>' +
    '<div class="row"><label>Duración de pulso</label><input type="range" id="tnp" min="10" max="400" step="5" value="100"><span class="val" id="tnpv" style="min-width:90px"></span></div></div>' +
    '<div><div class="card"><h2 id="tnname"></h2><ul class="l" id="tninfo"></ul></div>' +
    '<div class="card"><h2>Teoría de la compuerta</h2><div id="tnfib"></div><div class="row"><label>Distancia</label><input type="range" id="tnd" min="0.2" max="1.5" step="0.1" value="1"><span class="val" id="tndv"></span></div>' +
    '<p class="note">Las fibras Aβ, más rápidas, llegan primero y cierran la compuerta medular: la señal dolorosa de las fibras C y Aδ pasa menos. Con 1–2 Hz se estimula la producción de endorfinas.</p></div></div>';

  var T2 =
    '<div class="card"><h2>Aplicación</h2><div class="seg" id="tnmode2"></div>' +
    '<div class="row"><label>Frecuencia</label><input type="range" id="tnhz2" min="0" max="150" step="1" value="100"><span class="val" id="tnhz2v" style="min-width:80px"></span></div>' +
    '<div class="row"><label>Duración de pulso</label><input type="range" id="tnp2" min="0" max="400" step="5" value="100"><span class="val" id="tnp2v" style="min-width:90px"></span></div>' +
    '<div class="row"><label>Tiempo</label><input type="range" id="tnmin" min="0" max="40" step="1" value="20"><span class="val" id="tnminv"></span></div>' +
    '<div id="tnverd"></div><div class="res" id="tnmsg"></div></div>' +
    '<div><div class="card"><h2>Tipos de TENS</h2><ul class="l" id="tntypes"></ul></div><div class="card"><h2>Colocación y técnica</h2><ul class="l" id="tnplace"></ul><ul class="l" id="tntec"></ul></div>' +
    '<div class="card"><h2>Otras referencias de la clase</h2><p class="note">La clase da cifras distintas según la diapositiva; el módulo usa las tablas de las diapositivas 12 y 13.</p><ul class="l" id="tnref"></ul></div></div>';

  var def = U.build({
    id: 'tens', title: 'TENS', subtitle: 'Estimulación eléctrica nerviosa transcutánea · modelo didáctico para proyección', accent: '#1F6F8B',
    tabs: [
      { title: 'Forma de onda y efectos', html: T1, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, mode = 'convencional', seg = $('tnmode');
        T.MODES.forEach(function (m) { var b = U.el('button', m.id === mode ? 'on' : '', m.nombre.split(' (')[0]); b.setAttribute('data-v', m.id); seg.appendChild(b); });
        function draw() {
          var md = T.MODES.filter(function (x) { return x.id === mode; })[0], hz = +$('tnhz').value, us = +$('tnp').value, p = us / 1000, per = 1000 / hz;
          if (mode === 'burst') {
            LabWave.bands($('tnwave'), E.gatedTrain({ burstHz: 2, dutyPct: 50, windowMs: 2000 }), { windowMs: 2000, title: 'TENS burst: trenes de impulsos (esquema)', inner: { kind: 'biphasic', hz: hz }, labels: { on: 'Tren', off: 'Pausa' }, note: 'Duración de los trenes: esquema didáctico' });
            $('tnread').textContent = 'Dentro de cada tren: ' + hz + ' Hz y pulsos de ' + us + ' µs. Los trenes se dibujan de forma esquemática.';
          } else {
            var q = Math.max(0, per - 2 * p), win = Math.min(3 * (2 * p + q), 10 * 2 * p);
            LabWave.line($('tnwave'), E.rectWave({ phase: 'bi-sym', pulseMs: p, pauseMs: q }, win, win / 500), { windowMs: win, title: 'Pulso bifásico simétrico (acercamiento) · ' + hz + ' Hz',
              annotate: { pulse: p, phases: 2, pause: q, period: per, pulseText: 'Pulso ' + us + ' µs', pauseText: 'Pausa ' + K.fx(q, q < 1 ? 2 : (q < 100 ? 1 : 0)) + ' ms', periodText: 'Periodo ' + K.fx(per, per < 100 ? 1 : 0) + ' ms' } });
            $('tnread').textContent = 'Pulsos de ' + us + ' µs a ' + hz + ' Hz (periodo ' + K.fx(per, 1) + ' ms). La escala se acerca al pulso.';
          }
          $('tnname').textContent = md.nombre;
          U.fill($('tninfo'), ['Frecuencia: ' + md.hz[0] + '–' + md.hz[1] + ' Hz · pulso: ' + md.pulseTxt, 'Intensidad: ' + md.intensidad, 'Modulación del dolor: ' + md.modulacion, 'Efecto: ' + md.inicio + '; dura: ' + md.duracionEfecto.toLowerCase(), 'Usos: ' + md.usos]);
        }
        U.seg(seg, function (v) { mode = v; $('tnhz').value = START[v][0]; $('tnp').value = START[v][1]; $('tnhzv').textContent = START[v][0] + ' Hz'; $('tnpv').textContent = START[v][1] + ' µs'; draw(); });
        U.slider(root, 'tnhz', function (v) { return v + ' Hz'; }, draw);
        U.slider(root, 'tnp', function (v) { return v + ' µs'; }, draw);
        U.slider(root, 'tnd', function (v) { return K.fx(v, 1) + ' m'; }, function (v) { $('tnfib').innerHTML = fibersSvg(v); });
        $('tnfib').innerHTML = fibersSvg(1); draw();
      } },
      { title: 'Dosis y técnica', html: T2, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, mode = 'convencional', seg = $('tnmode2');
        T.MODES.forEach(function (m) { var b = U.el('button', m.id === mode ? 'on' : '', m.nombre.split(' (')[0]); b.setAttribute('data-v', m.id); seg.appendChild(b); });
        function upd() { U.verdict($('tnverd'), $('tnmsg'), T.evaluateTens({ mode: mode, hz: +$('tnhz2').value, pulseUs: +$('tnp2').value, minutes: +$('tnmin').value }), { ok: 'Adecuada', ajustar: 'Ajustar' }); }
        U.seg(seg, function (v) { mode = v; upd(); });
        U.slider(root, 'tnhz2', function (v) { return v + ' Hz'; }, upd);
        U.slider(root, 'tnp2', function (v) { return v + ' µs'; }, upd);
        U.slider(root, 'tnmin', function (v) { return v + ' min'; }, upd);
        var ul = $('tntypes'); ul.innerHTML = '';
        T.TYPES.forEach(function (t) { var li = U.el('li'); li.appendChild(U.el('b', '', t.nombre + ': ')); li.appendChild(document.createTextNode(t.texto)); ul.appendChild(li); });
        U.fill($('tnplace'), T.PLACEMENTS.map(function (p) { return p.nombre + ': ' + p.texto; })); U.fill($('tntec'), T.TECHNIQUES); U.fill($('tnref'), T.OTHER_REFS);
        upd();
      } },
      { title: 'Seguridad', html: U.safeHtml('tn'), init: function (root) {
        U.fill(root.getElementById('tnind'), ['Algias vertebrales', 'Neuralgias', 'Hombro doloroso', 'Dolor tumoral', 'Síndrome de dolor regional complejo', 'Cicatrices dolorosas', 'Miembro fantasma y muñón doloroso', 'Dolores traumáticos: esguinces, tendinitis, contracturas', 'Pseudoartrosis y retardo de consolidación']);
        U.checker(root, 'tnchk', T.CONDITIONS);
      } },
      { title: 'Caso clínico', html: U.caseHtml('tn'), init: function (root) {
        U.cases(root, 'tncases', T.CASES, {
          apto: { label: '¿Es apto/a?', type: 'select', options: [['si', 'Sí'], ['no', 'No']] },
          mode: { label: 'Modo', type: 'select', options: T.MODES.map(function (m) { return [m.id, m.nombre.split(' (')[0]]; }) },
          hz: { label: 'Frecuencia', type: 'number', unit: 'Hz' },
          minutes: { label: 'Tiempo', type: 'number', unit: 'min' }
        });
      } }
    ]
  });
  LabCore.register(def);
})();
