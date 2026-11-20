/* Módulo crioterapia del Laboratorio. */
(function () {
  var K = LabKit, U = K.ui, C = CrioCore;
  var NAMES = { 'sin-estimulo': 'Sin estímulo frío mínimo (se requieren al menos 5 min)', 'vasoconstriccion-superficial': 'Vasoconstricción superficial (5–8 min)',
    'vasoconstriccion-profunda': 'Vasoconstricción profunda (8–15 min)', 'vasodilatacion-refleja': 'Posible vasodilatación refleja (más de 15 min)' };

  /* Línea de tiempo con los tiempos de la clase y un icono del vaso (corte transversal) para cada respuesta. */
  var uid = 0;
  function vessel(cx, cy, lumen, on) {
    var wall = 7, r = lumen + wall;
    return '<g opacity="' + (on ? 1 : 0.5) + '"><circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 3) + '" fill="#F4E1DA"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#E3A79C" stroke="#9E3B32" stroke-width="2"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + lumen + '" fill="#C0392B"/>' +
      '<circle cx="' + (cx - lumen * 0.35) + '" cy="' + (cy - lumen * 0.35) + '" r="' + Math.max(1.5, lumen * 0.22) + '" fill="#fff" opacity="0.5"/></g>';
  }
  function timeline(min) {
    var id = 'cr' + (++uid), px = 30, x0 = 20, bT = 150, bB = 222, cur = C.vascularResponse(min);
    var s = '<svg viewBox="0 0 640 330" role="img" aria-label="Línea de tiempo de la respuesta vascular al frío">';
    s += '<defs><linearGradient id="' + id + 'g" x1="0" x2="1"><stop offset="0" stop-color="#ECE7DF"/><stop offset="0.25" stop-color="#ECE7DF"/><stop offset="0.27" stop-color="#C9E0F2"/><stop offset="0.4" stop-color="#A9CDEB"/><stop offset="0.42" stop-color="#86B6DE"/><stop offset="0.74" stop-color="#5E9BD0"/><stop offset="0.76" stop-color="#F6D3B6"/><stop offset="1" stop-color="#F0B48C"/></linearGradient></defs>';
    s += '<rect width="640" height="330" fill="#fff"/>';
    var zones = [[0, 5, 'Sin estímulo', 'sin-estimulo', 15, 'normal'], [5, 8, 'Superficial', 'vasoconstriccion-superficial', 9, 'se estrecha'],
      [8, 15, 'Profunda', 'vasoconstriccion-profunda', 5, 'se estrecha más'], [15, 20, 'Refleja', 'vasodilatacion-refleja', 19, 'se ensancha']];
    s += '<rect x="' + x0 + '" y="' + bT + '" width="' + (20 * px) + '" height="' + (bB - bT) + '" rx="8" fill="url(#' + id + 'g)"/>';
    zones.forEach(function (z) {
      var xa = x0 + z[0] * px, xb = x0 + z[1] * px, xc = (xa + xb) / 2, on = z[3] === cur;
      if (z[0]) s += '<line x1="' + xa + '" y1="' + bT + '" x2="' + xa + '" y2="' + bB + '" stroke="#fff" stroke-width="3"/>';
      if (on) s += '<rect x="' + (xa + 2) + '" y="' + (bT + 2) + '" width="' + (xb - xa - 4) + '" height="' + (bB - bT - 4) + '" rx="6" fill="none" stroke="#1F3F6B" stroke-width="3"/>';
      s += '<text x="' + xc + '" y="' + (bT + 42) + '" text-anchor="middle" font-size="16" font-weight="bold" fill="#2B1B10" stroke="#fff" stroke-width="3" paint-order="stroke">' + z[2] + '</text>';
      s += vessel(xc, 84, z[4], on);
      s += '<text x="' + xc + '" y="134" text-anchor="middle" font-size="15"' + (on ? ' font-weight="bold"' : '') + ' fill="' + (on ? '#1F3F6B' : '#6b5848') + '">' + z[5] + '</text>';
    });
    [0, 5, 8, 15, 20].forEach(function (t) {
      var x = x0 + t * px;
      s += '<line x1="' + x + '" y1="' + bB + '" x2="' + x + '" y2="' + (bB + 10) + '" stroke="#2B1B10" stroke-width="2"/><text x="' + Math.min(612, Math.max(30, x)) + '" y="' + (bB + 30) + '" text-anchor="middle" font-size="16" fill="#2B1B10">' + t + ' min</text>';
    });
    var mx = x0 + Math.min(20, min) * px;
    s += '<line x1="' + mx + '" y1="' + (bT - 8) + '" x2="' + mx + '" y2="' + (bT + 22) + '" stroke="#1F3F6B" stroke-width="4"/><line x1="' + mx + '" y1="' + (bB - 18) + '" x2="' + mx + '" y2="' + (bB + 6) + '" stroke="#1F3F6B" stroke-width="4"/><polygon points="' + (mx - 9) + ',' + (bT - 14) + ' ' + (mx + 9) + ',' + (bT - 14) + ' ' + mx + ',' + bT + '" fill="#1F3F6B"/>';
    s += '<text x="320" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="#1F3F6B">' + min + ' min de aplicación' + (min > 20 ? ' (fuera de escala)' : '') + '</text>';
    s += '<text x="320" y="' + (bB + 62) + '" text-anchor="middle" font-size="15" fill="#2B1B10">Vaso en corte: luz roja más pequeña = vasoconstricción; más grande = vasodilatación.</text>';
    s += '<text x="320" y="' + (bB + 84) + '" text-anchor="middle" font-size="14" font-style="italic" fill="#6b5848">Esquema didáctico con los tiempos de la clase; el tamaño del vaso es cualitativo.</text>';
    return s + '</svg>';
  }

  var T1 =
    '<div class="card"><div id="crsvg"></div><div class="row"><label>Tiempo</label><input type="range" id="crmin" min="0" max="20" step="1" value="10"><span class="val" id="crminv"></span></div><div id="crresp"></div></div>' +
    '<div><div class="card"><h2>Respuesta del organismo</h2>' +
    '<div class="flow"><span>↓ temperatura</span><i>→</i><span>vasoconstricción</span><i>→</i><span>↓ flujo y ↓ metabolismo</span></div>' +
    '<ul class="l"><li>Menos oxigenación, palidez y menor descarga de histamina y prostaglandinas.</li><li>Aumenta la viscosidad del tejido y del colágeno.</li><li>Disminuye la velocidad de conducción y sube el umbral del dolor (bloqueo de fibras A delta; reduce las fibras C).</li><li>A nivel medular estimula las fibras A beta: compuerta del dolor.</li></ul></div>' +
    '<div class="card"><h2>Efectos terapéuticos</h2><ul class="l"><li>Analgésico, antiinflamatorio y antiedematoso; sedativo y antiespasmódico.</li><li>Estímulos breves excitan y facilitan la actividad muscular; los prolongados e intensos la debilitan.</li><li>El estímulo frío mínimo dura 5 min. La piel y el músculo absorben más el frío por su contenido de agua.</li></ul></div></div>';

  var T2 =
    '<div class="card"><h2>Método</h2><div class="seg" id="crmet"></div><p id="crnota" class="note" style="margin-top:10px"></p>' +
    '<div class="row"><label>Duración</label><input type="range" id="crmin2" min="0" max="25" step="1" value="12"><span class="val" id="crmin2v"></span></div>' +
    '<div class="row"><label>Piel cianótica</label><label class="chk" style="min-width:0"><input type="checkbox" id="crcian"> sí</label></div>' +
    '<div class="row"><label>Test de sensibilidad hecho</label><label class="chk" style="min-width:0"><input type="checkbox" id="crsens" checked> sí</label></div>' +
    '<div id="crverd"></div><div class="res" id="crmsg"></div></div>' +
    '<div><div class="card"><h2>Test de sensibilidad</h2><p>Masaje con un cubito de hielo en una zona pequeña durante 3 min; a los 5 min debe aparecer eritema. Si tras otros 5 min aparece una ampolla, la prueba es positiva.</p>' +
    '<label class="chk"><input type="checkbox" id="crblis"> Apareció ampolla</label><label class="chk"><input type="checkbox" id="crery"> Eritema a los 5 min</label><div class="res" id="crtest"></div></div>' +
    '<div class="card"><h2>Criomasaje</h2><ul class="l"><li><b>Circular:</b> dolores locales.</li><li><b>Transversal (criociriax):</b> estructuras engrosadas.</li><li><b>Longitudinal:</b> acortamientos musculares.</li><li><b>Criocinética (criostretching):</b> más rango articular con elongación muscular.</li></ul></div>' +
    '<p class="note">Etapas progresivas de sensación: frío intenso, quemazón, dolor y analgesia.</p></div>';

  var T3 =
    '<div class="card"><h2>Indicaciones</h2><ul class="l" id="crind"></ul></div>' +
    '<div class="card"><h2>¿Se puede aplicar?</h2><div id="crchk"></div></div>';

  var T4 = '<div class="card" style="grid-column:1/-1"><h2>Caso clínico</h2><div id="crcases"></div></div>';

  var def = U.build({
    id: 'crioterapia', title: 'Crioterapia', subtitle: 'Aplicación de frío con fines terapéuticos · modelo didáctico para proyección', accent: '#1F5F8B',
    tabs: [
      { title: 'Qué pasa en el tejido', html: T1, init: function (root) {
        function upd(v) {
          root.getElementById('crsvg').innerHTML = timeline(v);
          var r = root.getElementById('crresp'); r.innerHTML = '';
          r.appendChild(U.el('span', 'badge ' + (C.vascularResponse(v) === 'vasodilatacion-refleja' ? 'warn' : 'ok'), NAMES[C.vascularResponse(v)]));
        }
        U.slider(root, 'crmin', function (v) { return v + ' min'; }, upd);
        upd(10);
      } },
      { title: 'Dosis y técnica', html: T2, init: function (root) {
        var method = 'cold-pack', seg = root.getElementById('crmet');
        C.METHODS.forEach(function (m) { var b = U.el('button', m.id === method ? 'on' : '', m.nombre); b.setAttribute('data-v', m.id); seg.appendChild(b); });
        function upd() {
          var m = C.METHODS.filter(function (x) { return x.id === method; })[0];
          root.getElementById('crnota').textContent = (m.tipo === 'conduccion' ? 'Conducción. ' : 'Convección. ') + m.nota;
          var r = C.evaluateApplication({ method: method, minutes: +root.getElementById('crmin2').value, cyanosis: root.getElementById('crcian').checked, sensitivityTested: root.getElementById('crsens').checked });
          U.badge(root.getElementById('crverd'), r.veredicto === 'ok' ? 'ok' : (r.veredicto === 'interrumpir' ? 'bad' : 'warn'), r.veredicto === 'ok' ? 'Adecuada' : (r.veredicto === 'interrumpir' ? 'Interrumpir' : 'Ajustar'));
          var box = root.getElementById('crmsg'); box.innerHTML = '';
          r.mensajes.forEach(function (t) { box.appendChild(U.el('p', '', t)); });
        }
        U.seg(seg, function (v) { method = v; upd(); });
        U.slider(root, 'crmin2', function (v) { return v + ' min'; }, upd);
        root.getElementById('crcian').addEventListener('change', upd);
        root.getElementById('crsens').addEventListener('change', upd);
        function test() {
          var r = C.sensitivityTest({ blister: root.getElementById('crblis').checked, erythemaAt5min: root.getElementById('crery').checked });
          root.getElementById('crtest').textContent = r === 'positiva' ? 'Positiva: hipersensibilidad al frío; no aplicar.' : (r === 'negativa' ? 'Negativa: tolera el frío.' : 'No concluyente: repita o no aplique.');
        }
        root.getElementById('crblis').addEventListener('change', test);
        root.getElementById('crery').addEventListener('change', test);
        test(); upd();
      } },
      { title: 'Seguridad', html: T3, init: function (root) {
        var ul = root.getElementById('crind');
        C.INDICATIONS.forEach(function (t) { ul.appendChild(U.el('li', '', t)); });
        U.checker(root, 'crchk', C.CONDITIONS);
      } },
      { title: 'Caso clínico', html: T4, init: function (root) {
        U.cases(root, 'crcases', C.CASES, {
          apto: { label: '¿Es apto/a?', type: 'select', options: [['si', 'Sí'], ['no', 'No']] },
          method: { label: 'Método', type: 'select', options: C.METHODS.map(function (m) { return [m.id, m.nombre]; }) },
          minutes: { label: 'Duración', type: 'number', unit: 'min' }
        });
      } }
    ]
  });
  LabCore.register(def);
})();
