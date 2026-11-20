/* Módulo fototerapia (infrarrojo y ultravioleta) del Laboratorio. */
(function () {
  var K = LabKit, U = K.ui, F = FotoCore;
  var X0 = 30, W = 540, LMIN = 100, LMAX = 15000, LR = Math.log(LMAX / LMIN);
  function xOf(nm) { return X0 + Math.log(nm / LMIN) / LR * W; }
  function nmOf(v) { return Math.round(LMIN * Math.exp(LR * v / 1000)); }
  function nmTxt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  function bandOf(nm) {
    var u = F.uvBand(nm), r = F.irBand(nm);
    if (u) return u;
    if (r) return r;
    if (nm > 400 && nm < 760) return 'Visible';
    return null;
  }
  /* Espectro en degradé continuo (escala logarítmica), rótulos alternados sin solaparse y marca de la longitud de onda actual. */
  var uid = 0;
  function spectrum(nm) {
    var id = 'ft' + (++uid), bT = 92, bB = 142;
    var segs = [[100, 280, 'UV-C', 1], [280, 315, 'UV-B', 0], [315, 400, 'UV-A', 1], [400, 760, 'Visible', 1], [760, 1500, 'IR-A', 0], [1500, 3000, 'IR-B', 1], [3000, 15000, 'IR-C', 0]];
    var stops = [[100, '#2E1A57'], [280, '#4B2A7A'], [315, '#6B3FA0'], [400, '#8F5FD0'], [430, '#5B3CFF'], [480, '#2F6FFF'], [530, '#2EB86B'], [580, '#F2D43A'], [620, '#FF8A2F'], [700, '#E8302A'], [760, '#B8231E'], [1500, '#C4532E'], [3000, '#D98A4E'], [15000, '#EBC9A2']];
    var s = '<svg viewBox="0 0 600 270" role="img" aria-label="Espectro de 100 a 15000 nm">';
    s += '<defs><linearGradient id="' + id + 'g" gradientUnits="userSpaceOnUse" x1="' + X0 + '" x2="' + (X0 + W) + '" y1="0" y2="0">' +
      stops.map(function (p) { return '<stop offset="' + ((xOf(p[0]) - X0) / W).toFixed(4) + '" stop-color="' + p[1] + '"/>'; }).join('') + '</linearGradient></defs>';
    s += '<rect width="600" height="270" fill="#fff"/>';
    /* grupos */
    function group(a, b, t) {
      var x1 = xOf(a) + 2, x2 = xOf(b) - 2;
      return '<path d="M' + x1 + ' 62 V54 H' + x2 + ' V62" fill="none" stroke="#6b5848" stroke-width="1.5"/><text x="' + ((x1 + x2) / 2) + '" y="48" text-anchor="middle" font-size="15" font-weight="bold" fill="#2B1B10">' + t + '</text>';
    }
    s += group(100, 400, 'Ultravioleta') + group(760, 15000, 'Infrarrojo');
    var bandNow = bandOf(nm), labs = '';
    s += '<rect x="' + X0 + '" y="' + bT + '" width="' + W + '" height="' + (bB - bT) + '" rx="8" fill="url(#' + id + 'g)"/>';
    segs.forEach(function (g) {
      var x1 = xOf(g[0]), x2 = xOf(g[1]), xc = (x1 + x2) / 2, up = g[3], on = bandNow === g[2];
      if (g[0] > 100) s += '<line x1="' + x1 + '" y1="' + bT + '" x2="' + x1 + '" y2="' + bB + '" stroke="#fff" stroke-width="2"/>';
      var ly = up ? bT - 8 : bB + 20;
      if (x2 - x1 < 40) s += '<line x1="' + xc + '" y1="' + (up ? bT : bB) + '" x2="' + xc + '" y2="' + (up ? bT - 4 : bB + 5) + '" stroke="#2B1B10" stroke-width="1.5"/>';
      labs += '<text x="' + xc + '" y="' + ly + '" text-anchor="middle" font-size="15" font-weight="bold" stroke="#fff" stroke-width="4" paint-order="stroke" fill="' + (on ? '#B3261E' : '#2B1B10') + '"' + (on ? ' text-decoration="underline"' : '') + '>' + g[2] + '</text>';
    });
    [100, 280, 400, 760, 1500, 3000, 15000].forEach(function (t) {
      var xt = xOf(t);
      s += '<line x1="' + xt + '" y1="' + (bB + 26) + '" x2="' + xt + '" y2="' + (bB + 32) + '" stroke="#6b5848" stroke-width="1.5"/><text x="' + Math.min(578, Math.max(18, xt)) + '" y="' + (bB + 48) + '" text-anchor="middle" font-size="14" fill="#6b5848">' + nmTxt(t) + '</text>';
    });
    /* marca de la longitud de onda actual */
    var mx = xOf(nm), lab = nmTxt(nm) + ' nm', lw = lab.length * 10 + 16, lx = Math.min(600 - 6 - lw / 2, Math.max(6 + lw / 2, mx));
    s += '<rect x="' + (lx - lw / 2) + '" y="6" width="' + lw + '" height="28" rx="6" fill="#2B1B10"/><text x="' + lx + '" y="26" text-anchor="middle" font-size="18" font-weight="bold" fill="#fff">' + lab + '</text>';
    s += '<line x1="' + mx + '" y1="34" x2="' + mx + '" y2="' + (bB + 4) + '" stroke="#2B1B10" stroke-width="3"/><circle cx="' + mx + '" cy="' + ((bT + bB) / 2) + '" r="7" fill="#fff" stroke="#2B1B10" stroke-width="3"/>' + labs;
    /* sentido de la energía */
    s += '<line x1="' + (X0 + 10) + '" y1="226" x2="' + (X0 + W - 10) + '" y2="226" stroke="#6b5848" stroke-width="2"/><polygon points="' + X0 + ',226 ' + (X0 + 12) + ',220 ' + (X0 + 12) + ',232" fill="#6b5848"/><polygon points="' + (X0 + W) + ',226 ' + (X0 + W - 12) + ',220 ' + (X0 + W - 12) + ',232" fill="#6b5848"/>';
    s += '<text x="' + (X0 + 18) + '" y="218" font-size="14" fill="#2B1B10">mayor frecuencia y energía</text><text x="' + (X0 + W - 18) + '" y="218" text-anchor="end" font-size="14" fill="#2B1B10">mayor longitud de onda</text>';
    s += '<text x="300" y="256" text-anchor="middle" font-size="14" font-style="italic" fill="#6b5848">Longitud de onda en nm, escala logarítmica.</text>';
    return s + '</svg>';
  }

  /* Tira de Rollier sobre el antebrazo: cuatro hendiduras expuestas con tiempos crecientes. */
  function strip() {
    var tints = ['#F6D3C6', '#F0B3A2', '#E58E7A', '#D4614F'];
    var s = '<svg viewBox="0 0 560 226" role="img" aria-label="Tira del test de Rollier">';
    s += '<rect width="560" height="226" fill="#fff"/>';
    s += '<rect x="6" y="44" width="548" height="108" rx="40" fill="#EDC7AE" stroke="#C99A80" stroke-width="2"/><text x="20" y="38" font-size="15" fill="#6b5848">Antebrazo (zona poco sensible)</text>';
    s += '<rect x="34" y="58" width="492" height="80" rx="6" fill="#EFE3CE" stroke="#8a6a46" stroke-width="2"/>';
    F.ROLLIER.forEach(function (t, i) {
      var x = 54 + i * 120;
      s += '<rect x="' + x + '" y="66" width="92" height="38" rx="4" fill="' + tints[i] + '" stroke="#8a6a46" stroke-width="1.5"/>';
      s += '<text x="' + (x + 46) + '" y="127" text-anchor="middle" font-size="17" font-weight="bold" fill="#3b2a18">' + (t < 60 ? t + ' s' : (t / 60) + ' min') + '</text>';
    });
    s += '<path d="M148 164 L132 96" stroke="#2B1B10" stroke-width="1.5" fill="none"/><circle cx="132" cy="94" r="3" fill="#2B1B10"/>';
    s += '<text x="152" y="174" font-size="16" fill="#2B1B10"><tspan font-weight="bold">Lectura a las 8 h:</tspan> la hendidura con</text><text x="152" y="194" font-size="16" fill="#2B1B10">eritema rosa pálido marca 1 MED</text>';
    s += '<text x="280" y="218" text-anchor="middle" font-size="14" font-style="italic" fill="#6b5848">Esquema didáctico: el tono de cada hendidura es un ejemplo.</text>';
    return s + '</svg>';
  }

  var T1 =
    '<div class="card"><div id="ftspec"></div><div class="row"><label>Longitud de onda</label><input type="range" id="ftnm" min="0" max="1000" step="1" value="500"><span class="val" id="ftnmv" style="min-width:110px"></span></div><div id="ftband"></div><p id="fttxt"></p></div>' +
    '<div><div class="card"><h2>Radiación infrarroja</h2><p>Calor radiante, seco y superficial, sin contacto. Mayor longitud de onda que la luz visible. El sol es la principal fuente natural (59 % de su emisión).</p>' +
    '<ul class="l"><li><b>Luminosos (proximales):</b> lámparas de filamento de tungsteno o carbono, 760–1 500 nm.</li><li><b>No luminosos (distales):</b> elemento incandescente al aire, 1 500–15 000 nm; tardan en calentar.</li></ul>' +
    '<p class="note" id="ftnota"></p></div>' +
    '<div class="card"><h2>Absorción y penetración</h2><p>La absorción convierte la radiación en calor: a mayor longitud de onda, mayor absorción. A menor longitud de onda, mayor penetración.</p>' +
    '<p>El infrarrojo produce efecto radiante calórico; el ultravioleta, efecto fotoquímico.</p></div></div>';

  var T2 =
    '<div class="card"><h2>Sesión de infrarrojo</h2>' +
    '<div class="row"><label>Intensidad</label><div class="seg" id="ftpir"><button data-v="0.5" class="on">0,5 pirón</button><button data-v="1">1 pirón</button><button data-v="1.5">1,5 pirón</button></div></div>' +
    '<p id="ftpirn" class="note"></p>' +
    '<div class="row"><label>Duración</label><input type="range" id="ftmin" min="0" max="45" step="1" value="15"><span class="val" id="ftminv"></span></div>' +
    '<div class="row"><label>Distancia</label><div class="seg" id="ftdist"><button data-v="30">30 cm</button><button data-v="60" class="on">60 cm</button><button data-v="90">90 cm</button></div></div>' +
    '<div class="row"><label>Lentes al paciente</label><label class="chk" style="min-width:0"><input type="checkbox" id="ftgl" checked> sí</label></div>' +
    '<div class="row"><label>Piel seca, sin crema</label><label class="chk" style="min-width:0"><input type="checkbox" id="ftdry" checked> sí</label></div>' +
    '<div id="ftverd"></div><div class="res" id="ftmsg"></div></div>' +
    '<div><div class="card"><h2>Efectos según la duración</h2><ul class="l" id="fteff"></ul></div>' +
    '<div class="card"><h2>Respuestas visibles</h2><ol class="l"><li>Enrojecimiento uniforme leve.</li><li>Puntos rojizos y zonas blancas.</li><li>Coloración rojiza uniforme intensa.</li></ol>' +
    '<p class="note">Efectos fisiológicos: eritema, ↑ temperatura, ↑ flujo sanguíneo y oxigenación, sudoración. Pasadas 1 h cede el eritema.</p></div></div>';

  var T3 =
    '<div class="card"><h2>Bandas ultravioleta</h2><div id="ftuv"></div><p class="note">Efectos biológicos: eritema, estimulación de la mitosis, acción bactericida, síntesis de vitamina D3 y depósito de calcio, pigmentación; acción carcinogénica (daña el ADN).</p>' +
    '<h2>Test de Rollier</h2><div id="ftroll"></div><p class="note">Se irradia una zona poco sensible (antebrazo): a las 8 h la hendidura con eritema rosa pálido marca 1 MED, el umbral de sensibilidad.</p></div>' +
    '<div><div class="card"><h2>Dosis en MED</h2>' +
    '<div class="row"><label>Dosis</label><input type="range" id="ftmed" min="0" max="12" step="0.5" value="1"><span class="val" id="ftmedv"></span></div><p id="ftgrade"><b></b></p>' +
    '<div class="row"><label>N.º de sesión</label><input type="range" id="ftses" min="1" max="25" step="1" value="1"><span class="val" id="ftsesv"></span></div>' +
    '<div class="row"><label>Duración</label><input type="range" id="ftumin" min="0" max="40" step="1" value="20"><span class="val" id="ftuminv"></span></div>' +
    '<div class="row"><label>Ojos protegidos</label><label class="chk" style="min-width:0"><input type="checkbox" id="fteyes" checked> sí</label></div>' +
    '<div class="row"><label>MED de la fuente conocido</label><label class="chk" style="min-width:0"><input type="checkbox" id="ftmedk" checked> sí</label></div>' +
    '<div id="ftuverd"></div><div class="res" id="ftumsg"></div></div>' +
    '<div class="card"><h2>Criterios</h2><ul class="l"><li>1.ª sesión: 1 MED; luego se aumenta de forma progresiva.</li><li>Cambiar la distancia de la lámpara hasta 1 m.</li><li>Sesiones diarias o alternas: máximo 20 y descanso de 6 semanas.</li><li>Puede formarse un "callo luminoso" que hace la piel inmune tras muchas sesiones.</li></ul></div></div>';

  var T4 =
    '<div class="card"><h2>Infrarrojo</h2><ul class="l" id="ftindir"></ul><div id="ftchkir"></div></div>' +
    '<div class="card"><h2>Ultravioleta</h2><ul class="l" id="ftinduv"></ul><div id="ftchkuv"></div></div>';

  var T5 = '<div class="card" style="grid-column:1/-1"><h2>Caso clínico</h2><div id="ftcases"></div></div>';

  var def = U.build({
    id: 'fototerapia', title: 'Fototerapia', subtitle: 'Infrarrojo y ultravioleta · modelo didáctico para proyección', accent: '#9A6A00',
    tabs: [
      { title: 'Espectro', html: T1, init: function (root) {
        function upd(v) {
          var nm = nmOf(v), b = bandOf(nm);
          root.getElementById('ftspec').innerHTML = spectrum(nm);
          root.getElementById('ftnmv').textContent = nmTxt(nm) + ' nm';
          var bb = root.getElementById('ftband'); bb.innerHTML = '';
          var info = F.BANDS[b];
          bb.appendChild(U.el('span', 'badge ' + (b && b.indexOf('UV') === 0 ? 'bad' : 'ok'), b ? (b + (info ? ' · ' + info.rango : '')) : 'Fuera del espectro tratado'));
          root.getElementById('fttxt').textContent = info ? info.texto : (b === 'Visible' ? 'Luz visible: la región del espectro que percibe el ojo.' : 'Fuera de las bandas de uso terapéutico de la clase.');
        }
        U.slider(root, 'ftnm', function (v) { return nmTxt(nmOf(v)) + ' nm'; }, upd);
        root.getElementById('ftnota').textContent = F.TEXTS.uvRango + ' ' + F.TEXTS.irNota;
        upd(500);
      } },
      { title: 'Infrarrojo: dosis y técnica', html: T2, init: function (root) {
        var pir = 0.5, dist = 60;
        function upd() {
          var mins = +root.getElementById('ftmin').value, p = F.pironLevel(pir);
          root.getElementById('ftpirn').textContent = p.nota;
          var r = F.evaluateIR({ distanceCm: dist, minutes: mins, glasses: root.getElementById('ftgl').checked, skinDry: root.getElementById('ftdry').checked });
          var level = r.veredicto === 'ok' ? (p.nivel === 'intolerable' ? 'bad' : 'ok') : 'warn';
          U.badge(root.getElementById('ftverd'), level, p.nivel === 'intolerable' ? 'Calor intolerable' : (r.veredicto === 'ok' ? 'Adecuada' : 'Ajustar'));
          var box = root.getElementById('ftmsg'); box.innerHTML = '';
          r.mensajes.forEach(function (t) { box.appendChild(U.el('p', '', t)); });
          var ul = root.getElementById('fteff'); ul.innerHTML = '';
          var e = F.irEffects(mins);
          if (!e.length) ul.appendChild(U.el('li', '', 'Aún no se alcanza ningún efecto terapéutico (desde 10 min).'));
          e.forEach(function (t) { ul.appendChild(U.el('li', '', t)); });
        }
        U.seg(root.getElementById('ftpir'), function (v) { pir = +v; upd(); });
        U.seg(root.getElementById('ftdist'), function (v) { dist = +v; upd(); });
        U.slider(root, 'ftmin', function (v) { return v + ' min'; }, upd);
        root.getElementById('ftgl').addEventListener('change', upd);
        root.getElementById('ftdry').addEventListener('change', upd);
        upd();
      } },
      { title: 'Ultravioleta', html: T3, init: function (root) {
        var box = root.getElementById('ftuv');
        ['UV-A', 'UV-B', 'UV-C'].forEach(function (b) {
          var p = U.el('p'); p.appendChild(U.el('b', '', b + ' (' + F.BANDS[b].rango + '): ')); p.appendChild(document.createTextNode(F.BANDS[b].texto)); box.appendChild(p);
        });
        root.getElementById('ftroll').innerHTML = strip();
        function upd() {
          var med = +root.getElementById('ftmed').value, g = F.erythemaGrade(med);
          root.getElementById('ftgrade').firstChild.textContent = g.nombre;
          var r = F.evaluateUV({ med: med, sessions: +root.getElementById('ftses').value, minutes: +root.getElementById('ftumin').value, eyesProtected: root.getElementById('fteyes').checked, medKnown: root.getElementById('ftmedk').checked });
          U.badge(root.getElementById('ftuverd'), r.veredicto === 'ok' ? 'ok' : (r.veredicto === 'riesgo' ? 'bad' : 'warn'), r.veredicto === 'ok' ? 'Adecuada' : (r.veredicto === 'riesgo' ? 'Riesgo' : 'Ajustar'));
          var m = root.getElementById('ftumsg'); m.innerHTML = '';
          r.mensajes.forEach(function (t) { m.appendChild(U.el('p', '', t)); });
        }
        U.slider(root, 'ftmed', function (v) { return K.fx(v, 1) + ' MED'; }, upd);
        U.slider(root, 'ftses', function (v) { return v + ''; }, upd);
        U.slider(root, 'ftumin', function (v) { return v + ' min'; }, upd);
        root.getElementById('fteyes').addEventListener('change', upd);
        root.getElementById('ftmedk').addEventListener('change', upd);
        upd();
      } },
      { title: 'Seguridad', html: T4, init: function (root) {
        F.INDICATIONS_IR.forEach(function (t) { root.getElementById('ftindir').appendChild(U.el('li', '', t)); });
        F.INDICATIONS_UV.forEach(function (t) { root.getElementById('ftinduv').appendChild(U.el('li', '', t)); });
        U.checker(root, 'ftchkir', F.CONDITIONS_IR);
        U.checker(root, 'ftchkuv', F.CONDITIONS_UV);
      } },
      { title: 'Caso clínico', html: T5, init: function (root) {
        U.cases(root, 'ftcases', F.CASES, {
          apto: { label: '¿Es apto/a?', type: 'select', options: [['si', 'Sí'], ['no', 'No']] },
          distanceCm: { label: 'Distancia de la lámpara', type: 'number', unit: 'cm' },
          minutes: { label: 'Duración', type: 'number', unit: 'min' },
          med: { label: 'Dosis inicial', type: 'number', step: 0.5, unit: 'MED' }
        });
      } }
    ]
  });
  LabCore.register(def);
})();
