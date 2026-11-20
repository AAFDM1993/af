/* Módulo parafina del Laboratorio. */
(function () {
  var K = LabKit, U = K.ui, P = ParafinaCore;

  /* Mano (vista dorsal, dedos separados) sumergida por encima de la muñeca; las capas forman un guante y se ven en un corte ampliado. */
  var uid = 0;
  var FING = [[158, 228, 142, 318, 24], [186, 234, 182, 344, 25], [214, 234, 222, 334, 24], [240, 226, 260, 298, 21]];
  var THUMB = [[152, 148], [118, 190], [100, 234]], THW = 27;
  function handParts(extra, col, op) {
    var g = '<g' + (op !== undefined ? ' opacity="' + op + '"' : '') + '><g fill="' + col + '"' + (extra > 0 ? ' stroke="' + col + '" stroke-width="' + extra + '" stroke-linejoin="round"' : '') + '>' +
      '<path d="M156 18 L162 118 L238 118 L244 18 Z"/>' +
      '<path d="M162 114 C144 134 138 178 140 218 Q140 238 160 240 L242 238 Q260 236 260 218 C262 178 254 134 238 114 Z"/></g>' +
      '<g fill="none" stroke="' + col + '" stroke-linecap="round" stroke-linejoin="round">';
    FING.forEach(function (f) { g += '<line x1="' + f[0] + '" y1="' + f[1] + '" x2="' + f[2] + '" y2="' + f[3] + '" stroke-width="' + (f[4] + extra) + '"/>'; });
    g += '<polyline points="' + THUMB.map(function (p) { return p.join(','); }).join(' ') + '" stroke-width="' + (THW + extra) + '"/>';
    return g + '</g></g>';
  }
  function handDetails() {
    var s = '';
    FING.forEach(function (f) {
      var dx = f[2] - f[0], dy = f[3] - f[1], len = Math.sqrt(dx * dx + dy * dy), ux = dx / len, uy = dy / len, w = f[4];
      [0.42, 0.7].forEach(function (t) {
        var cx = f[0] + dx * t, cy = f[1] + dy * t;
        s += '<line x1="' + (cx - uy * w * 0.3).toFixed(1) + '" y1="' + (cy + ux * w * 0.3).toFixed(1) + '" x2="' + (cx + uy * w * 0.3).toFixed(1) + '" y2="' + (cy - ux * w * 0.3).toFixed(1) + '" stroke="#C48A74" stroke-width="1.6" stroke-linecap="round"/>';
      });
      var ang = Math.atan2(dy, dx) * 180 / Math.PI;
      s += '<ellipse cx="' + (f[0] + dx * 0.97).toFixed(1) + '" cy="' + (f[1] + dy * 0.97).toFixed(1) + '" rx="' + (w * 0.34).toFixed(1) + '" ry="' + (w * 0.27).toFixed(1) + '" transform="rotate(' + ang.toFixed(1) + ' ' + (f[0] + dx * 0.97).toFixed(1) + ' ' + (f[1] + dy * 0.97).toFixed(1) + ')" fill="#F7DED3" stroke="#C48A74" stroke-width="1.2"/>';
    });
    s += '<path d="M170 230 Q186 238 200 234 Q216 238 234 228" fill="none" stroke="#C48A74" stroke-width="1.4"/>';
    return s;
  }
  function hand(layers) {
    var id = 'pf' + (++uid), lvl = 110, rim = 4 + layers * 2.6;
    var s = '<svg viewBox="0 0 600 410" role="img" aria-label="Mano con ' + layers + ' capas de parafina">';
    s += '<defs><clipPath id="' + id + 'g"><rect x="0" y="' + lvl + '" width="600" height="' + (420 - lvl) + '"/></clipPath>' +
      '<linearGradient id="' + id + 'l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A6" stop-opacity="0.3"/><stop offset="1" stop-color="#F5CE62" stop-opacity="0.42"/></linearGradient></defs>';
    s += '<rect width="600" height="410" fill="#fff"/>';
    /* tanque */
    s += '<rect x="40" y="92" width="320" height="310" rx="18" fill="#FFF8E4" stroke="#B39A62" stroke-width="2.5"/>';
    /* mano: guante de parafina (bandas alternas = capas), contorno y piel */
    s += '<g>';
    if (layers) {
      s += '<g clip-path="url(#' + id + 'g)">' + handParts(rim + 3, '#9C8558');
      for (var k = layers; k >= 1; k--) s += handParts(4 + k * 2.6, k % 2 ? '#FFFDF7' : '#DCCBA6');
      s += '</g>';
    }
    s += handParts(3, '#B47C68') + handParts(0, '#EDBFA6') + handDetails();
    if (layers) s += '<g clip-path="url(#' + id + 'g)">' + handParts(0, '#FBF6EC', (0.15 + 0.04 * layers).toFixed(2)) + '</g>';
    s += '</g>';
    /* líquido por encima de la muñeca */
    s += '<rect x="42" y="' + lvl + '" width="316" height="' + (400 - lvl) + '" rx="2" fill="url(#' + id + 'l)"/>';
    s += '<path d="M42 ' + lvl + ' q20 -5 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t36 0" fill="none" stroke="#C9A43E" stroke-width="2.5"/>';
    s += '<line x1="150" y1="118" x2="250" y2="118" stroke="#6b5848" stroke-width="1.5" stroke-dasharray="5 4"/>';
    s += '<text x="200" y="392" text-anchor="middle" font-size="17" font-weight="bold" fill="#5a4320" stroke="#FFF3CC" stroke-width="4" paint-order="stroke">Baño de parafina líquida (42–52 °C)</text>';
    /* rótulos con líneas guía */
    function tag(x1, y1, x2, y2, lines, bold, col) {
      var t = '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#6b5848" stroke-width="1.5"/><circle cx="' + x1 + '" cy="' + y1 + '" r="3" fill="#6b5848"/>';
      lines.forEach(function (l, i) { t += '<text x="' + (x2 + 6) + '" y="' + (y2 + 5 + i * 19) + '" font-size="16"' + (bold ? ' font-weight="bold"' : '') + ' fill="' + (col || '#2B1B10') + '">' + l + '</text>'; });
      return t;
    }
    s += '<text x="488" y="34" text-anchor="middle" font-size="21" font-weight="bold" fill="#3b2a18">' + (layers ? layers + (layers === 1 ? ' capa' : ' capas') : 'Mano sin parafina') + '</text>';
    s += tag(340, lvl, 378, 72, ['Nivel del baño:', 'sobre la muñeca'], true, '#7A5A10');
    s += tag(250, 118, 378, 124, ['Muñeca'], false);
    s += tag(222, 300, 378, 176, ['Dedos separados', 'y relajados'], false);
    /* corte ampliado de las capas */
    s += '<rect x="384" y="228" width="208" height="176" rx="10" fill="#FBF6F0" stroke="#D9C7B6" stroke-width="2"/>';
    s += '<text x="488" y="250" text-anchor="middle" font-size="15" font-weight="bold" fill="#2B1B10">Corte ampliado</text>';
    s += '<rect x="398" y="370" width="100" height="24" fill="#EBBBA5" stroke="#C48A74"/><text x="506" y="388" font-size="15" fill="#2B1B10">Piel</text>';
    for (var j = 0; j < layers; j++) s += '<rect x="398" y="' + (361 - j * 9) + '" width="100" height="9" fill="' + (j % 2 ? '#DCCBA6' : '#FFFDF7') + '" stroke="#9C8558" stroke-width="0.8"/>';
    if (layers) {
      var mid = 370 - layers * 4.5;
      s += '<text x="506" y="' + (mid + 5) + '" font-size="15" font-weight="bold" fill="#7A5A10">' + layers + (layers === 1 ? ' capa' : ' capas') + '</text>';
      s += '<text x="488" y="270" text-anchor="middle" font-size="14" fill="#6b5848">calor → piel por conducción</text>';
    } else s += '<text x="448" y="330" text-anchor="middle" font-size="15" fill="#6b5848">sin capas</text>';
    return s + '</svg>';
  }

  var T1 =
    '<div class="card"><div id="pfsvg"></div></div>' +
    '<div><div class="card"><h2>Inmersiones</h2><div class="row"><label>Capas</label><input type="range" id="pflay" min="0" max="10" step="1" value="0"><span class="val" id="pflayv"></span></div>' +
    '<p>Tiempo para formar las capas: <b id="pftime"></b> (10 s por inmersión y 10 s de pausa entre capas).</p>' +
    '<p class="note">Primera inmersión por encima de la muñeca durante 10 s; luego repetir de 7 a 10 veces. La mano va relajada, con los dedos separados y sin moverse: si la capa se agrieta, la parafina quema la piel.</p></div>' +
    '<div class="card"><h2>La parafina</h2><ul class="l"><li>Cera de parafina (blanca, inodora, sólida) con aceite mineral en proporción 7:1.</li><li>Punto de fusión ≈ 54,5 °C; con el aceite queda líquida entre 42 y 52 °C.</li><li>Transfiere el calor por <b>conducción</b>: alto contenido calórico, tarda en enfriarse; su conductividad térmica y calor específico son bajos.</li><li>Ayuda sobre todo a las <b>articulaciones</b>.</li></ul></div></div>';

  var T2 =
    '<div class="card"><h2>Aplicación</h2>' +
    '<div class="row"><label>Método</label><div class="seg" id="pfmet"><button data-v="inmersion" class="on">Inmersión</button><button data-v="pincelado">Pincelado</button></div></div>' +
    '<div class="row"><label>Capas</label><input type="range" id="pflay2" min="0" max="12" step="1" value="8"><span class="val" id="pflay2v"></span></div>' +
    '<div class="row"><label>Duración</label><input type="range" id="pfmin" min="0" max="20" step="1" value="12"><span class="val" id="pfminv"></span></div>' +
    '<div class="row" id="pfbathrow"><label>Temperatura del baño</label><input type="range" id="pfbath" min="30" max="60" step="1" value="47"><span class="val" id="pfbathv"></span></div>' +
    '<div class="row"><label>Envuelta (bolsa y toalla)</label><label class="chk" style="min-width:0"><input type="checkbox" id="pfwrap" checked> sí</label></div>' +
    '<div id="pfverd"></div><div class="res" id="pfmsg"></div></div>' +
    '<div><div class="card"><h2>Preparación</h2><ul class="l"><li>Limpiar la zona con agua y jabón; frotar con alcohol para retirar el jabón.</li><li>Inspeccionar: sin heridas ni hongos.</li><li>Retirar metales; posición cómoda y zona relajada.</li></ul></div>' +
    '<div class="card"><h2>Al terminar</h2><ul class="l"><li>Retirar toalla y bolsa; quitar la parafina sólida y devolverla al tanque.</li><li>Inspeccionar la piel, masajear y movilizar para ganar rango articular; lavar con agua y jabón.</li><li>Contenedor de unos 3 kg de parafina, con termostato; cambiarla a los 6 meses y cuidar la limpieza.</li></ul></div></div>';

  var T3 =
    '<div class="card"><h2>Indicaciones</h2><ul class="l" id="pfind"></ul></div>' +
    '<div class="card"><h2>¿Se puede aplicar?</h2><div id="pfchk"></div></div>';

  var T4 = '<div class="card" style="grid-column:1/-1"><h2>Caso clínico</h2><div id="pfcases"></div></div>';

  var def = U.build({
    id: 'parafina', title: 'Parafina', subtitle: 'Termoterapia superficial por conducción · modelo didáctico para proyección', accent: '#8A5A00',
    tabs: [
      { title: 'Qué pasa en el tejido', html: T1, init: function (root) {
        var box = root.getElementById('pfsvg'); box.innerHTML = hand(0);
        U.slider(root, 'pflay', function (v) { return v + ''; }, function (v) { box.innerHTML = hand(v); root.getElementById('pftime').textContent = P.layerBuildSeconds(v) + ' s'; });
        root.getElementById('pftime').textContent = '0 s';
      } },
      { title: 'Dosis y técnica', html: T2, init: function (root) {
        var method = 'inmersion';
        function upd() {
          var r = P.evaluateApplication({ method: method, layers: +root.getElementById('pflay2').value, minutes: +root.getElementById('pfmin').value, bathC: +root.getElementById('pfbath').value, wrapped: root.getElementById('pfwrap').checked });
          root.getElementById('pfbathrow').hidden = method !== 'inmersion';
          U.badge(root.getElementById('pfverd'), r.veredicto === 'ok' ? 'ok' : (r.veredicto === 'riesgo' ? 'bad' : 'warn'),
            r.veredicto === 'ok' ? 'Adecuada' : (r.veredicto === 'riesgo' ? 'Riesgo de quemadura' : 'Ajustar'));
          var m = root.getElementById('pfmsg'); m.innerHTML = '';
          r.mensajes.forEach(function (t) { m.appendChild(U.el('p', '', t)); });
        }
        U.seg(root.getElementById('pfmet'), function (v) { method = v; upd(); });
        U.slider(root, 'pflay2', function (v) { return v + ''; }, upd);
        U.slider(root, 'pfmin', function (v) { return v + ' min'; }, upd);
        U.slider(root, 'pfbath', function (v) { return v + ' °C'; }, upd);
        root.getElementById('pfwrap').addEventListener('change', upd);
        upd();
      } },
      { title: 'Seguridad', html: T3, init: function (root) {
        var ul = root.getElementById('pfind');
        P.INDICATIONS.forEach(function (t) { ul.appendChild(U.el('li', '', t)); });
        U.checker(root, 'pfchk', P.CONDITIONS);
      } },
      { title: 'Caso clínico', html: T4, init: function (root) {
        U.cases(root, 'pfcases', P.CASES, {
          apto: { label: '¿Es apta?', type: 'select', options: [['si', 'Sí'], ['no', 'No']] },
          method: { label: 'Método', type: 'select', options: [['inmersion', 'Inmersión'], ['pincelado', 'Pincelado']] },
          layers: { label: 'Capas', type: 'number', unit: 'capas' },
          minutes: { label: 'Duración', type: 'number', unit: 'min' }
        });
      } }
    ]
  });
  LabCore.register(def);
})();
