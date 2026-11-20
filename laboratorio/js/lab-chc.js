/* Módulo CHC (compresas húmedo-calientes) del Laboratorio. */
(function () {
  var K = LabKit, U = K.ui, C = CHCCore;

  /* Corte esquemático: compresa sobre las toallas, piel, tejido subcutáneo y músculo, con flechas de calor en degradé. */
  var uid = 0;
  function svg(n) {
    var id = 'chc' + (++uid), X0 = 44, X1 = 430, LX = 448, SKIN = 150, TH = 18;
    var yTow = SKIN - n * TH, yCmp = yTow - 52;
    var heat = n < 2 ? 1 : (n === 2 ? 0.7 : 0.35);
    var s = '<svg viewBox="0 0 600 410" role="img" aria-label="Corte del tejido bajo una compresa con ' + n + ' toallas">';
    s += '<defs>' +
      '<pattern id="' + id + 'c" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#C9A27A"/><rect x="2" y="2" width="18" height="18" rx="6" fill="#D6B38E" stroke="#A9825B" stroke-width="1.2"/></pattern>' +
      '<pattern id="' + id + 't" width="8" height="6" patternUnits="userSpaceOnUse"><rect width="8" height="6" fill="#EAF1F8"/><circle cx="4" cy="3" r="1.6" fill="none" stroke="#9FBCD9" stroke-width="1"/></pattern>' +
      '<pattern id="' + id + 's" width="24" height="12" patternUnits="userSpaceOnUse"><rect width="24" height="12" fill="#EBBBA5"/><path d="M0 4 Q6 0 12 4 T24 4" fill="none" stroke="#D9967D" stroke-width="1.2"/></pattern>' +
      '<pattern id="' + id + 'f" width="22" height="18" patternUnits="userSpaceOnUse"><rect width="22" height="18" fill="#F7E6B2"/><circle cx="6" cy="6" r="5" fill="none" stroke="#E0C47A" stroke-width="1.2"/><circle cx="17" cy="13" r="5" fill="none" stroke="#E0C47A" stroke-width="1.2"/></pattern>' +
      '<pattern id="' + id + 'm" width="40" height="9" patternUnits="userSpaceOnUse"><rect width="40" height="9" fill="#A9533F"/><path d="M0 4.5 H40" stroke="#93432F" stroke-width="2"/><path d="M14 0 V9" stroke="#93432F" stroke-width="1"/></pattern>' +
      '<linearGradient id="' + id + 'h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0391B"/><stop offset="0.6" stop-color="#F08A2C"/><stop offset="1" stop-color="#F6B84A" stop-opacity="0.15"/></linearGradient>' +
      '</defs><rect width="600" height="410" fill="#fff"/>' +
      '<text x="' + ((X0 + X1) / 2) + '" y="24" text-anchor="middle" font-size="19" font-weight="bold" fill="#2B1B10">Corte del tejido bajo la compresa</text>';
    /* compresa y toallas */
    s += '<rect x="' + X0 + '" y="' + yCmp + '" width="' + (X1 - X0) + '" height="52" rx="10" fill="url(#' + id + 'c)" stroke="#8a6a46" stroke-width="2"/>';
    s += '<text x="' + ((X0 + X1) / 2) + '" y="' + (yCmp + 33) + '" text-anchor="middle" font-size="18" font-weight="bold" fill="#3b2a18" stroke="#F3E3CF" stroke-width="4" paint-order="stroke">Compresa húmedo-caliente (≈ 1 cm)</text>';
    for (var i = 0; i < n; i++) s += '<rect x="' + X0 + '" y="' + (yTow + i * TH) + '" width="' + (X1 - X0) + '" height="' + TH + '" rx="3" fill="url(#' + id + 't)" stroke="#6F93B8" stroke-width="1.5"/>';
    /* tejidos */
    s += '<rect x="' + X0 + '" y="' + SKIN + '" width="' + (X1 - X0) + '" height="34" fill="url(#' + id + 's)"/>';
    s += '<rect x="' + X0 + '" y="' + (SKIN + 34) + '" width="' + (X1 - X0) + '" height="66" fill="url(#' + id + 'f)"/>';
    s += '<rect x="' + X0 + '" y="' + (SKIN + 100) + '" width="' + (X1 - X0) + '" height="96" fill="url(#' + id + 'm)"/>';
    if (n < 2) s += '<rect x="' + (X0 + 1) + '" y="' + (SKIN + 1) + '" width="' + (X1 - X0 - 2) + '" height="32" fill="#E0391B" fill-opacity="0.28" stroke="#B3261E" stroke-width="2.5" stroke-dasharray="7 4"/>';
    /* vaso sanguíneo en el subcutáneo: más ancho cuanto más calor llega (cualitativo) */
    var vh = 8 + 10 * heat, vy = SKIN + 67;
    s += '<rect x="' + X0 + '" y="' + (vy - vh / 2 - 2) + '" width="' + (X1 - X0) + '" height="' + (vh + 4) + '" rx="' + (vh / 2 + 2) + '" fill="#B9473F"/><rect x="' + X0 + '" y="' + (vy - vh / 2) + '" width="' + (X1 - X0) + '" height="' + vh + '" rx="' + (vh / 2) + '" fill="#D8574C"/>';
    s += '<rect x="' + X0 + '" y="' + yCmp + '" width="' + (X1 - X0) + '" height="' + (SKIN + 196 - yCmp) + '" rx="10" fill="none" stroke="#8a6a46" stroke-width="2"/>';
    /* flechas de calor en degradé: intensidad según las capas */
    var y1 = yCmp + 50, y2 = SKIN + 70 + 60 * heat;
    for (var a = 0; a < 4; a++) {
      var x = 92 + a * 96, w = 7 + 7 * heat;
      s += '<g opacity="' + (0.35 + 0.65 * heat).toFixed(2) + '"><path d="M' + (x - w / 2) + ' ' + y1 + ' H' + (x + w / 2) + ' V' + (y2 - 16) + ' H' + (x + w) + ' L' + x + ' ' + y2 + ' L' + (x - w) + ' ' + (y2 - 16) + ' H' + (x - w / 2) + ' Z" fill="url(#' + id + 'h)" stroke="#fff" stroke-width="1.5"/></g>';
    }
    s += '<text x="' + (X1 - 10) + '" y="' + (SKIN + 178) + '" text-anchor="end" font-size="17" font-weight="bold" fill="#fff" stroke="#7A3424" stroke-width="3" paint-order="stroke">↑ temperatura, vasodilatación</text>';
    /* indicador de profundidad */
    s += '<line x1="22" y1="' + (SKIN + 4) + '" x2="22" y2="' + (SKIN + 186) + '" stroke="#6b5848" stroke-width="2"/><polygon points="16,' + (SKIN + 180) + ' 28,' + (SKIN + 180) + ' 22,' + (SKIN + 194) + '" fill="#6b5848"/>';
    s += '<text x="15" y="' + (SKIN + 95) + '" text-anchor="middle" font-size="15" fill="#6b5848" transform="rotate(-90 15 ' + (SKIN + 95) + ')">Profundidad</text>';
    /* rótulos con líneas guía */
    function tag(y, yl, t, col, bold) {
      return '<line x1="' + (X1 - 6) + '" y1="' + yl + '" x2="' + (LX - 4) + '" y2="' + y + '" stroke="#6b5848" stroke-width="1.5"/><circle cx="' + (X1 - 6) + '" cy="' + yl + '" r="3" fill="#6b5848"/>' +
        '<text x="' + LX + '" y="' + (y + 5) + '" font-size="16"' + (bold ? ' font-weight="bold"' : '') + ' fill="' + (col || '#2B1B10') + '">' + t + '</text>';
    }
    s += tag(yCmp + 14, yCmp + 26, 'Compresa', '#6b4a22', true);
    if (n) s += tag(Math.max(yTow + n * TH / 2, yCmp + 40), yTow + n * TH / 2, n + (n === 1 ? ' toalla' : ' toallas'), '#3b5a7a', true);
    else s += '<text x="' + LX + '" y="' + (SKIN - 2) + '" font-size="16" font-weight="bold" fill="#B3261E">Sin toallas</text>';
    s += tag(SKIN + 17, SKIN + 17, 'Piel');
    s += tag(SKIN + 44, SKIN + 44, 'Tejido subcutáneo');
    s += tag(vy + 16, vy, 'Vaso: vasodilatación');
    s += tag(SKIN + 140, SKIN + 140, 'Músculo');
    var msg = n < 2 ? 'Riesgo de quemadura: envuelva con 2 toallas' : (n === 2 ? 'Protección adecuada (2 toallas)' : 'Más capas: llega menos calor (modelo didáctico)');
    var col = n < 2 ? '#B3261E' : (n === 2 ? '#2E7D4F' : '#A35F00');
    s += '<text x="300" y="' + (SKIN + 232) + '" text-anchor="middle" font-size="20" font-weight="bold" fill="' + col + '">' + msg + '</text>';
    s += '<text x="300" y="' + (SKIN + 254) + '" text-anchor="middle" font-size="14" font-style="italic" fill="#6b5848">Esquema didáctico: grosor de las flechas y del vaso cualitativo</text>';
    return s + '</svg>';
  }

  var T1 =
    '<div class="card"><div id="chcsvg"></div><p class="note">Dibujo esquemático. La clase indica envolver la compresa con 2 toallas en su totalidad; el efecto del número de capas sobre el calor es cualitativo.</p></div>' +
    '<div><div class="card"><h2>Toallas bajo la compresa</h2><div class="row"><div class="seg" id="chctow"><button data-v="0">0</button><button data-v="1">1</button><button data-v="2" class="on">2</button><button data-v="3">3</button></div></div></div>' +
    '<div class="card"><h2>Efectos del calor</h2>' +
    '<div class="flow"><span>↑ temperatura</span><i>→</i><span>vasodilatación</span><i>→</i><span>↑ oxigenación y nutrición</span></div>' +
    '<ul class="l"><li>Elimina ácido láctico y acelera la regeneración; aumenta la sudoración.</li><li><b>Analgésico:</b> teoría de la compuerta y más encefalinas y betaendorfinas.</li><li>Aumenta la extensibilidad del colágeno y reduce el espasmo y la isquemia.</li></ul>' +
    '<h2>Conducción nerviosa</h2><div class="row"><label>Aumento de temperatura</label><input type="range" id="chcdt" min="0" max="10" step="1" value="3"><span class="val" id="chcdtv"></span></div>' +
    '<p>Velocidad de conducción: <b id="chcgain"></b> más rápida (2 m/s por cada 1 °C).</p>' +
    '<p class="note">Disminuye la fuerza y la resistencia muscular durante los primeros 30 min; entre 30 min y 2 h vuelve a la normalidad.</p></div></div>';

  var T2 =
    '<div class="card"><h2>Sesión</h2>' +
    '<div class="row"><label>Toallas</label><div class="seg" id="chctow2"><button data-v="0">0</button><button data-v="1">1</button><button data-v="2" class="on">2</button><button data-v="3">3</button></div></div>' +
    '<div class="row"><label>Duración</label><input type="range" id="chcmin" min="0" max="20" step="1" value="10"><span class="val" id="chcminv"></span></div>' +
    '<div class="row"><label>Piel revisada a los 30"–1 min</label><label class="chk" style="min-width:0"><input type="checkbox" id="chcskin" checked> sí</label></div>' +
    '<div id="chcverd"></div><div class="res" id="chcmsg"></div></div>' +
    '<div class="card"><h2>Técnica</h2><ul class="l"><li>Compresero (tanque con termostato): 70–76 °C.</li><li>Sacar la compresa de las orejillas y dejar escurrir antes de envolver.</li><li>Envolverla con 2 toallas en su totalidad.</li><li>Duración promedio: 10 min.</li><li>A los 30"–1 min verificar la piel; si quema, secar la sudoración. Verificar el eritema y evaluar la sensibilidad.</li></ul>' +
    '<p class="note">Variables que modifican la respuesta: sexo, edad, piel, sensibilidad y masa corporal.</p></div>';

  var T3 =
    '<div class="card"><h2>Indicaciones</h2><ul class="l" id="chcind"></ul><p class="note">La CHC ayuda mejor a los tejidos blandos; la parafina, a las articulaciones.</p></div>' +
    '<div class="card"><h2>¿Se puede aplicar?</h2><div id="chcchk"></div></div>';

  var T4 = '<div class="card" style="grid-column:1/-1"><h2>Caso clínico</h2><div id="chccases"></div></div>';

  var def = U.build({
    id: 'chc', title: 'Compresas húmedo-calientes (CHC)', subtitle: 'Termoterapia superficial · modelo didáctico para proyección', accent: '#A8431E',
    tabs: [
      { title: 'Qué pasa en el tejido', html: T1, init: function (root) {
        var box = root.getElementById('chcsvg'); box.innerHTML = svg(2);
        U.seg(root.getElementById('chctow'), function (v) { box.innerHTML = svg(+v); });
        U.slider(root, 'chcdt', function (v) { return v + ' °C'; }, function (v) { root.getElementById('chcgain').textContent = C.conductionGainMS(v) + ' m/s'; });
        root.getElementById('chcgain').textContent = C.conductionGainMS(3) + ' m/s';
      } },
      { title: 'Dosis y técnica', html: T2, init: function (root) {
        var tow = 2;
        function upd() {
          var mins = +root.getElementById('chcmin').value, skin = root.getElementById('chcskin').checked;
          var r = C.evaluateSession({ towels: tow, minutes: mins, skinChecked: skin });
          U.badge(root.getElementById('chcverd'), r.veredicto === 'ok' ? 'ok' : (r.veredicto === 'riesgo' ? 'bad' : 'warn'),
            r.veredicto === 'ok' ? 'Adecuada' : (r.veredicto === 'riesgo' ? 'Riesgo de quemadura' : 'Tiempo insuficiente'));
          var m = root.getElementById('chcmsg'); m.innerHTML = '';
          r.mensajes.forEach(function (t) { m.appendChild(U.el('p', '', t)); });
        }
        U.seg(root.getElementById('chctow2'), function (v) { tow = +v; upd(); });
        U.slider(root, 'chcmin', function (v) { return v + ' min'; }, upd);
        root.getElementById('chcskin').addEventListener('change', upd);
        upd();
      } },
      { title: 'Seguridad', html: T3, init: function (root) {
        var ul = root.getElementById('chcind');
        C.INDICATIONS.forEach(function (t) { ul.appendChild(U.el('li', '', t)); });
        U.checker(root, 'chcchk', C.CONDITIONS);
      } },
      { title: 'Caso clínico', html: T4, init: function (root) {
        U.cases(root, 'chccases', C.CASES, {
          apto: { label: '¿Es apta?', type: 'select', options: [['si', 'Sí'], ['no', 'No']] },
          towels: { label: 'Toallas', type: 'number', unit: 'toallas' },
          minutes: { label: 'Duración', type: 'number', unit: 'min' }
        });
      } }
    ]
  });
  LabCore.register(def);
})();
