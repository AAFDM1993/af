/* Módulo hidroterapia del Laboratorio. */
(function () {
  var K = LabKit, U = K.ui, H = HidroCore;
  var WITH_TEMP = H.MODALITIES.filter(function (m) { return m.tempMinC !== null; });
  var T0 = 30, T1X = 55, X0 = 190, W = 420;
  function x(t) { return X0 + (t - T0) / (T1X - T0) * W; }

  /* Termómetro horizontal (columna hasta la temperatura elegida) y, debajo, el rango de la clase para cada modalidad. */
  var uid = 0;
  function thermometer(sel, temp) {
    var id = 'hd' + (++uid), rowH = 40, yT = 66, y0 = 128, tc = Math.max(T0, Math.min(T1X, temp)), mx = x(tc);
    var h = y0 + WITH_TEMP.length * rowH + 44;
    var s = '<svg viewBox="0 0 640 ' + h + '" role="img" aria-label="Termómetro y rangos de temperatura por modalidad">';
    s += '<defs><linearGradient id="' + id + 'g" gradientUnits="userSpaceOnUse" x1="' + X0 + '" x2="' + (X0 + W) + '" y1="0" y2="0"><stop offset="0" stop-color="#2F7FC1"/><stop offset="0.35" stop-color="#7FB7A8"/><stop offset="0.6" stop-color="#E8A23A"/><stop offset="1" stop-color="#C0392B"/></linearGradient></defs>';
    s += '<rect width="640" height="' + h + '" fill="#fff"/>';
    /* termómetro */
    var bx = X0 - 26;
    s += '<rect x="' + (bx) + '" y="' + (yT - 11) + '" width="' + (W + 40) + '" height="22" rx="11" fill="#F3F6F8" stroke="#8FA3B0" stroke-width="2"/>';
    s += '<circle cx="' + bx + '" cy="' + yT + '" r="20" fill="#F3F6F8" stroke="#8FA3B0" stroke-width="2"/>';
    s += '<rect x="' + bx + '" y="' + (yT - 6) + '" width="' + (mx - bx) + '" height="12" rx="6" fill="url(#' + id + 'g)"/>';
    s += '<circle cx="' + bx + '" cy="' + yT + '" r="14" fill="#2F7FC1"/>';
    for (var t = T0; t <= T1X; t++) {
      var major = t % 5 === 0;
      s += '<line x1="' + x(t) + '" y1="' + (yT + 13) + '" x2="' + x(t) + '" y2="' + (yT + (major ? 24 : 18)) + '" stroke="#6b5848" stroke-width="' + (major ? 2 : 1) + '"/>';
      if (major) s += '<text x="' + x(t) + '" y="' + (yT + 42) + '" text-anchor="middle" font-size="15" fill="#6b5848">' + t + '</text>';
    }
    s += '<text x="' + Math.min(640 - 46, Math.max(X0, mx)) + '" y="' + (yT - 22) + '" text-anchor="middle" font-size="19" font-weight="bold" fill="#B3261E">' + LabKit.fx(temp, temp % 1 ? 1 : 0) + ' °C</text>';
    s += '<text x="20" y="' + (yT + 6) + '" font-size="15" font-weight="bold" fill="#2B1B10">Agua o aire</text>';
    /* rangos por modalidad */
    s += '<line x1="' + mx + '" y1="' + (yT + 6) + '" x2="' + mx + '" y2="' + (y0 + WITH_TEMP.length * rowH) + '" stroke="#B3261E" stroke-width="2.5" stroke-dasharray="6 4"/>';
    WITH_TEMP.forEach(function (m, i) {
      var y = y0 + i * rowH, on = m.id === sel, inR = temp >= m.tempMinC && temp <= m.tempMaxC;
      var xa = x(m.tempMinC), xb = x(m.tempMaxC), lab = m.tempMinC + '–' + m.tempMaxC + ' °C';
      if (on) s += '<rect x="8" y="' + (y + 1) + '" width="624" height="' + (rowH - 4) + '" rx="8" fill="#E4F1F4"/>';
      s += '<text x="' + (X0 - 12) + '" y="' + (y + 24) + '" text-anchor="end" font-size="16" font-weight="' + (on ? 'bold' : 'normal') + '" fill="#2B1B10">' + m.nombre.split(' (')[0] + '</text>';
      s += '<rect x="' + X0 + '" y="' + (y + 9) + '" width="' + W + '" height="20" rx="10" fill="#EEF3F7"/>';
      s += '<rect x="' + xa + '" y="' + (y + 7) + '" width="' + (xb - xa) + '" height="24" rx="6" fill="' + (on ? '#1F7A8C' : '#8EBFCB') + '"/>';
      if (xb - xa > 74) s += '<text x="' + ((xa + xb) / 2) + '" y="' + (y + 25) + '" text-anchor="middle" font-size="15" font-weight="bold" fill="#fff">' + lab + '</text>';
      else s += '<text x="' + (xb + 8) + '" y="' + (y + 25) + '" font-size="15" font-weight="bold" fill="' + (on ? '#145866' : '#4F7480') + '">' + lab + '</text>';
      if (on && inR) s += '<circle cx="' + mx + '" cy="' + (y + 19) + '" r="7" fill="#2E7D4F" stroke="#fff" stroke-width="2"/>';
    });
    s += '<text x="' + (X0 + W / 2) + '" y="' + (h - 12) + '" text-anchor="middle" font-size="15" fill="#6b5848">Temperatura del agua o del aire (°C) · rangos de la clase</text>';
    return s + '</svg>';
  }

  var T1 =
    '<div class="card"><h2>Efecto térmico</h2><div class="seg" id="hdkind"><button data-v="frio" class="on">Agua fría</button><button data-v="caliente">Agua caliente</button></div>' +
    '<div class="flow" id="hdflow" style="margin-top:12px"></div><p class="note">Efecto mecánico: impacto del agua sobre el cuerpo (espray, ducha, fricción, whirlpool). Efecto químico: agua ingerida o irrigada en una cavidad.</p></div>' +
    '<div><div class="card"><h2>Propiedades físicas del agua</h2><ul class="l" id="hdprop"></ul></div>' +
    '<div class="card"><h2>Teoría de la ingravidez</h2><p>El cuerpo sumergido elimina la gravedad, que ocupa el 90 % de la actividad del SNC (dolor de columna, pelvis, miembros inferiores y contracturas). Al flotar se libera energía que beneficia zonas extensas del sistema nervioso.</p>' +
    '<p class="note">Objetivo de la hidroterapia: mejorar la circulación; la sangre aporta nutrientes y retira desechos de los tejidos.</p></div></div>';

  var T2 =
    '<div class="card"><h2>Modalidad</h2><div class="seg" id="hdmod"></div>' +
    '<div id="hdtrow"><div class="row"><label>Temperatura</label><input type="range" id="hdtemp" min="30" max="55" step="0.5" value="36"><span class="val" id="hdtempv" style="min-width:80px"></span></div><div id="hdsvg"></div></div>' +
    '<div id="hdverd" style="margin-top:8px"></div></div>' +
    '<div class="card"><h2 id="hdtitle"></h2><p id="hdnota"></p><p class="note" id="hdmin"></p></div>';

  var T3 =
    '<div class="card"><h2>¿Qué modalidad corresponde?</h2><div class="row"><label>Indicación</label><select id="hdind"></select></div>' +
    '<div class="row"><label>Modalidad</label><select id="hdmod2"></select></div><div id="hdev"></div><div class="res" id="hdevm"></div></div>' +
    '<div class="card"><h2>¿Se puede aplicar?</h2><div id="hdchk"></div></div>';

  var T4 = '<div class="card" style="grid-column:1/-1"><h2>Caso clínico</h2><div id="hdcases"></div></div>';

  var def = U.build({
    id: 'hidroterapia', title: 'Hidroterapia', subtitle: 'Aplicación del agua con fines terapéuticos · modelo didáctico para proyección', accent: '#1F7A8C',
    tabs: [
      { title: 'Qué pasa en el tejido', html: T1, init: function (root) {
        function show(kind) {
          var e = H.thermalEffect(kind), f = root.getElementById('hdflow'); f.innerHTML = '';
          [e.vaso, e.flujo, e.metabolismo, e.accion].forEach(function (t, i) { if (i) f.appendChild(U.el('i', '', '→')); f.appendChild(U.el('span', '', t)); });
        }
        U.seg(root.getElementById('hdkind'), show); show('frio');
        var ul = root.getElementById('hdprop');
        H.PROPERTIES.forEach(function (p) { var li = U.el('li'); li.appendChild(U.el('b', '', p.nombre + ': ')); li.appendChild(document.createTextNode(p.texto)); ul.appendChild(li); });
      } },
      { title: 'Temperatura y modalidad', html: T2, init: function (root) {
        var sel = 'hubbard', seg = root.getElementById('hdmod');
        H.MODALITIES.forEach(function (m) { var b = U.el('button', m.id === sel ? 'on' : '', m.nombre); b.setAttribute('data-v', m.id); seg.appendChild(b); });
        function upd() {
          var m = H.getModality(sel), temp = +root.getElementById('hdtemp').value, has = m.tempMinC !== null;
          root.getElementById('hdtrow').hidden = !has;
          root.getElementById('hdtitle').textContent = m.nombre + (m.alcance === 'total' ? ' (aplicación total)' : ' (aplicación parcial)');
          root.getElementById('hdnota').textContent = m.nota;
          root.getElementById('hdmin').textContent = m.minutos ? ('Tiempo: ' + (m.minutos[0] === m.minutos[1] ? m.minutos[0] : m.minutos[0] + ' a ' + m.minutos[1]) + ' min') : 'La clase no indica un tiempo para esta modalidad.';
          var v = root.getElementById('hdverd'); v.innerHTML = '';
          if (has) {
            root.getElementById('hdsvg').innerHTML = thermometer(sel, temp);
            var r = H.checkTemperature(sel, temp);
            U.badge(v, r === 'ok' ? 'ok' : 'warn', r === 'ok' ? 'Temperatura dentro del rango de la clase' : (r === 'bajo' ? 'Por debajo del rango' : 'Por encima del rango'));
          }
        }
        U.seg(seg, function (v) { sel = v; upd(); });
        U.slider(root, 'hdtemp', function (v) { return K.fx(v, 1) + ' °C'; }, upd);
        upd();
      } },
      { title: 'Seguridad', html: T3, init: function (root) {
        var si = root.getElementById('hdind'), sm = root.getElementById('hdmod2');
        H.INDICATIONS.forEach(function (i) { var o = U.el('option', '', i.label); o.value = i.id; si.appendChild(o); });
        H.MODALITIES.forEach(function (m) { var o = U.el('option', '', m.nombre); o.value = m.id; sm.appendChild(o); });
        function upd() {
          var r = H.evaluateModality({ modality: sm.value, indication: si.value });
          U.badge(root.getElementById('hdev'), r.veredicto === 'adecuada' ? 'ok' : 'warn', r.veredicto === 'adecuada' ? 'Adecuada' : 'Revisar');
          root.getElementById('hdevm').textContent = r.mensaje;
        }
        si.addEventListener('change', upd); sm.addEventListener('change', upd); upd();
        U.checker(root, 'hdchk', H.CONDITIONS);
      } },
      { title: 'Caso clínico', html: T4, init: function (root) {
        U.cases(root, 'hdcases', H.CASES, {
          apto: { label: '¿Es apto/a?', type: 'select', options: [['si', 'Sí'], ['no', 'No']] },
          modality: { label: 'Modalidad', type: 'select', options: H.MODALITIES.map(function (m) { return [m.id, m.nombre]; }) },
          tempC: { label: 'Temperatura', type: 'number', step: 0.5, unit: '°C' }
        });
      } }
    ]
  });
  LabCore.register(def);
})();
