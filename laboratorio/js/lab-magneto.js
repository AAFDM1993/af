/* Módulo Magnetoterapia del Laboratorio. */
(function () {
  var K = LabKit, U = K.ui, M = MagnetoCore;
  var SES = { 'diarias': 'diarias', '2-dia': '2 al día', '3-sem': '3 por semana' };

  function slider(id, label, min, max, step, val) {
    return '<div class="row"><label>' + label + '</label><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"><span class="val" id="' + id + 'v" style="min-width:90px"></span></div>';
  }
  function segHtml(id, items, on) {
    return '<div class="seg" id="' + id + '">' + items.map(function (i) { return '<button type="button" data-v="' + i[0] + '"' + (i[0] === on ? ' class="on"' : '') + '>' + i[1] + '</button>'; }).join('') + '</div>';
  }
  var APL = [['solenoide', 'Solenoide'], ['plano', 'Plano']];
  var POL = [['N', 'Polo N'], ['S', 'Polo S']];

  var T0 =
    '<div class="card"><h2>Concepto</h2><ul class="l" id="mgtconc"></ul></div>' +
    '<div class="card"><h2>Campo y unidades</h2><ul class="l" id="mgtuni"></ul><p id="mgtun2" style="font-weight:bold"></p></div>' +
    '<div class="card" style="grid-column:1/-1"><h2>Tipos de sustancias frente al campo</h2><div id="mgtsus" style="display:flex;gap:14px;flex-wrap:wrap"></div></div>' +
    '<div class="card"><h2>Efecto de los polos</h2><div class="res warn" id="mgtpn"></div><div class="res ok" id="mgtps"></div></div>' +
    '<div class="card"><h2>Las partes del equipo</h2><h4>Consola</h4><ul class="l" id="mgtcon"></ul><h4>Solenoide</h4><ul class="l" id="mgtsol"></ul><h4>Camilla</h4><ul class="l" id="mgtcam"></ul></div>' +
    '<div class="card" style="grid-column:1/-1"><h2>Forma de la onda de la consola</h2><div class="row"><label>Forma</label><div class="seg" id="mgtshape"></div></div>' +
    '<div class="row"><label>Frecuencia</label><input type="range" id="mgtwhz" min="1" max="100" step="1" value="30"><span class="val" id="mgtwhzv" style="min-width:90px"></span></div><div id="mgtwave"></div></div>' +
    '<div class="card" style="grid-column:1/-1"><h2>Técnica: fijo y barrido</h2><p id="mgttec" style="font-weight:bold"></p><div id="mgtsweep"></div></div>' +
    '<div class="card" style="grid-column:1/-1"><h2>Alta intensidad (solo informativa)</h2><p id="mgthi"></p></div>';

  var T1 =
    '<div class="card" style="grid-column:1/-1"><h2>Los dos aplicadores con la misma intensidad</h2>' +
    slider('mgag', 'Intensidad en la piel', 1, 200, 1, 60) + slider('mgah', 'Frecuencia', 1, 100, 1, 30) +
    '<p class="note">Cambie la intensidad y la frecuencia y observe cómo se mueve el campo. En el modo Exploración puede arrastrar la sonda naranja para leer los gauss a cada profundidad.</p>' +
    '<div style="display:flex;gap:18px;flex-wrap:wrap"><div style="flex:1 1 400px;min-width:min(300px,100%)"><h3 style="margin:4px 0">Solenoide</h3><p style="font-weight:bold">Rodea la zona y llega parejo a todas las capas.</p><div id="mgsol"></div></div>' +
    '<div style="flex:1 1 400px;min-width:min(300px,100%)"><h3 style="margin:4px 0">Plano</h3><p style="font-weight:bold">Se apoya en la piel y se debilita al profundizar.</p><div id="mgpla"></div></div></div></div>' +
    '<div class="card" style="grid-column:1/-1"><h2>Cuántos gauss llegan a cada capa (con la intensidad elegida arriba)</h2><div id="mgtabd" style="overflow-x:auto"></div></div>' +
    '<div class="card"><h2>Cómo leer el dibujo</h2><ul class="l" id="mgleer"></ul></div>' +
    '<div class="card"><h2>¿Cuál uso?</h2><ul class="l" id="mgaplnotes"></ul></div>' +
    '<div class="card" style="grid-column:1/-1"><h2>Datos de la clase</h2><ul class="l" id="mgnotes"></ul></div>';

  var T2 =
    '<div class="card"><h2>Polaridad</h2><div class="row"><label>Polo</label>' + segHtml('mgpol', POL, 'N') + '</div>' +
    '<div class="res" id="mgpoleres"></div>' +
    '<p class="note">El efecto por polo es el de la clase. Revise el sticker de cada aplicador antes de usarlo.</p></div>' +
    '<div class="card"><h2>Gauss y tesla</h2>' + slider('mgg', 'Intensidad', 0, 200, 1, 100) + '<p id="mgtes"></p><p class="note">1 T = 10 000 G.</p></div>' +
    '<div class="card" style="grid-column:1/-1"><h2>Qué hace el campo en cada tejido</h2><p class="note">Toque un tejido del esquema o elíjalo en la lista: el tejido elegido se anima paso a paso. Esquema didáctico con los efectos de la clase.</p>' +
    '<div class="seg" id="mgtis">' + MagnetoCore.TISSUES.map(function (t, i) { return '<button type="button" data-v="' + t.id + '"' + (i ? '' : ' class="on"') + '>' + t.nombre + '</button>'; }).join('') + '</div>' +
    '<div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:12px"><div id="mgtscene" style="flex:1.6 1 560px;min-width:280px"></div><div id="mgtinfo" style="flex:1 1 320px"></div></div></div>' +
    '<div class="card" style="grid-column:1/-1"><h2>Resumen: qué mejora el campo en cada tejido</h2><p class="note">Toque una fila para ver ese tejido arriba.</p><div id="mgresumen" style="overflow-x:auto"></div></div>';

  var T3 =
    '<div class="card"><h2>Perfiles de la clase</h2><div class="row"><label>Frecuencia</label><input type="range" id="mgf" min="1" max="100" step="1" value="30"><span class="val" id="mgfv" style="min-width:90px"></span></div><div id="mgprof"></div><div id="mgpwave" style="margin-top:10px"></div></div>' +
    '<div><div class="card"><h2>Perfil de ataque</h2><ul class="l" id="mgpa"></ul></div><div class="card"><h2>Perfil analgésico y miorrelajante</h2><ul class="l" id="mgpb"></ul></div>' +
    '<div class="card"><h2>Alta intensidad</h2><p id="mghi"></p></div></div>';

  var T4 =
    '<div class="card"><h2>Protocolo</h2><div class="row"><label>Patología</label><select id="mgpat"></select></div>' +
    '<div class="row"><label>Aplicador</label>' + segHtml('mgapl2', APL, 'solenoide') + '</div>' +
    '<div class="row"><label>Polo</label>' + segHtml('mgpol2', POL, 'S') + '</div>' +
    slider('mgf2', 'Frecuencia', 1, 100, 1, 30) + slider('mgg2', 'Intensidad', 0, 200, 1, 50) + slider('mgt2', 'Tiempo', 0, 60, 1, 20) +
    '<div id="mgverd"></div><div class="res" id="mgmsg"></div></div>' +
    '<div class="card"><h2>Tabla de la clase</h2><div id="mgtab" style="overflow-x:auto"></div>' +
    '<p class="note">La clase da la frecuencia por perfil (menos o más de 50 Hz), no por patología: asignar un perfil a cada patología es criterio del módulo.</p></div>' +
    '<div class="card" style="grid-column:1/-1"><h2>¿Por qué elegir frecuencias e intensidades bajas o altas?</h2><p id="mgwhyr" style="font-weight:bold"></p><div id="mgwhy" style="overflow-x:auto"></div>' +
    '<p class="note">Se resalta el perfil de la patología elegida arriba. Con 50 Hz exactos la clase no define perfil.</p></div>';

  var def = U.build({
    id: 'magneto', title: 'Magnetoterapia', subtitle: 'Campo magnético de baja frecuencia · solenoide y plano · modelo didáctico para proyección', accent: '#5B3A8C',
    css: 'table{border-collapse:collapse;width:100%;font-size:17px}th,td{border:1px solid var(--line);padding:4px 8px;text-align:left}th{background:#EFE7F7}tr.on td{background:#FFF1D6;font-weight:bold}' +
      'h3.tt{margin:0 0 8px;font-size:24px;color:var(--accent)}' +
      'td.pcol,th.pcol{background:#FFF1D6;font-weight:bold}' +
      '@media(max-width:820px){section.tab.on{grid-template-columns:minmax(0,1fr)}.card{min-width:0}.row{flex-wrap:wrap}.row input[type=range]{min-width:0;flex:1 1 140px}#mgtinfo,#mgtscene{flex:1 1 100% !important;min-width:0 !important}}' +
      'h4{margin:12px 0 4px;font-size:19px;color:var(--accent)}' +
      'tr.on td{background:#FFF1D6;font-weight:bold}' +
      'ol.steps{list-style:none;margin:6px 0 10px;padding:0;counter-reset:p}' +
      'ol.steps li{counter-increment:p;position:relative;margin:0 0 22px;padding:8px 12px 8px 50px;background:#FBF1EA;border:2px solid var(--line);border-radius:10px;font-size:19px;line-height:1.3}' +
      'ol.steps li::before{content:counter(p);position:absolute;left:10px;top:50%;transform:translateY(-50%);width:30px;height:30px;border-radius:50%;background:var(--accent);color:#fff;font-weight:bold;text-align:center;line-height:30px;font-size:18px}' +
      'ol.steps li:not(:last-child)::after{content:"\\2193";position:absolute;left:50%;bottom:-23px;color:var(--accent);font-weight:bold;font-size:20px;line-height:20px}' +
      'ol.steps li:first-child{background:#EFE7F7;border-color:var(--accent);font-weight:bold}',
    tabs: [
      { title: 'Marco teórico', html: T0, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, TH = M.THEORY, shape = 'sinusoidal', hz = 30, wv = null, sw = null;
        if (window.MagnetoAnim) MagnetoAnim.setMode('proyeccion'); /* el conmutador siempre arranca en Proyección */
        U.fill($('mgtconc'), TH.concepto); U.fill($('mgtuni'), TH.unidades);
        $('mgtun2').textContent = 'Ejemplo: 100 G = ' + K.fx(M.gaussToTesla(100), 3) + ' T.';
        TH.sustancias.forEach(function (x) {
          var c = U.el('div', 'res'); c.style.flex = '1 1 260px';
          c.appendChild(U.el('h3', 'tt', x.nombre)); c.appendChild(U.el('p', '', x.susceptibilidad)); c.appendChild(U.el('p', '', x.comportamiento)); c.appendChild(U.el('p', 'note', x.ejemplos));
          $('mgtsus').appendChild(c);
        });
        $('mgtpn').textContent = TH.polos.N; $('mgtps').textContent = TH.polos.S;
        U.fill($('mgtcon'), TH.partes.consola); U.fill($('mgtsol'), TH.partes.solenoide); U.fill($('mgtcam'), TH.partes.camilla);
        $('mgttec').textContent = TH.tecnica.fijo + ' ' + TH.tecnica.barrido; $('mgthi').textContent = M.HIGH_INTENSITY_NOTE;
        $('mgtshape').innerHTML = TH.formasOnda.map(function (f, i) { return '<button type="button" data-v="' + f.id + '"' + (i ? '' : ' class="on"') + '>' + f.nombre + '</button>'; }).join('');
        if (window.MagnetoAnim) {
          wv = MagnetoAnim.wave($('mgtwave'), { shape: shape, hz: hz }); sw = MagnetoAnim.sweep($('mgtsweep'), {});
        }
        U.seg($('mgtshape'), function (v) { shape = v; if (wv) wv.update({ shape: v }); });
        var hd = root.querySelector('header.mh');
        if (hd && window.MagnetoAnim) {
          var mb = U.el('div', 'seg'); mb.id = 'mgmode'; mb.style.marginLeft = 'auto';
          mb.setAttribute('role', 'group'); mb.setAttribute('aria-label', 'Modo de los esquemas');
          mb.innerHTML = '<button type="button" data-v="proyeccion" class="on">Proyección</button><button type="button" data-v="exploracion">Exploración</button>';
          hd.style.display = 'flex'; hd.style.alignItems = 'center'; hd.style.gap = '16px'; hd.style.flexWrap = 'wrap'; hd.appendChild(mb);
          U.seg(mb, function (v) { MagnetoAnim.setMode(v); });
        }
        U.slider(root, 'mgtwhz', function (v) { hz = v; if (wv) wv.update({ hz: v }); return v + ' Hz'; });
        return { destroy: function () { if (wv) wv.destroy(); if (sw) sw.destroy(); wv = sw = null; } };
      } },
      { title: 'Campo y aplicador', html: T1, init: function (root) {
        var $ = function (id) { return root.getElementById(id); };
        var gA = 60, hA = 30, sol = null, pla = null;
        if (window.MagnetoAnim) {
          sol = MagnetoAnim.scheme($('mgsol'), { applicator: 'solenoide', gauss: gA, hz: hA });
          pla = MagnetoAnim.scheme($('mgpla'), { applicator: 'plano', gauss: gA, hz: hA });
        }
        U.slider(root, 'mgah', function (v) { hA = v; if (sol) { sol.update({ hz: v }); pla.update({ hz: v }); } return v + ' Hz'; });
        function tabla() {
          var ds = [0, 1, 4, 7, 10, 15], th = '<table><tr><th></th>', rs = '<tr><th>Solenoide</th>', rp = '<tr><th>Plano</th>';
          ds.forEach(function (x) {
            th += '<th>' + K.fx(x, 0) + ' cm (' + M.layerAt(x).nombre.toLowerCase() + ')</th>';
            rs += '<td>' + K.fx(M.fieldAtDepth('solenoide', x, gA), 0) + ' G</td>'; rp += '<td>' + K.fx(M.fieldAtDepth('plano', x, gA), 0) + ' G</td>';
          });
          $('mgtabd').innerHTML = th + '</tr>' + rs + '</tr>' + rp + '</tr></table>';
        }
        U.slider(root, 'mgag', function (v) { gA = v; if (sol) { sol.update({ gauss: v }); pla.update({ gauss: v }); } return v + ' G'; }, tabla);
        tabla();
        U.fill($('mgleer'), ['Cada dibujo es un corte del miembro: arriba la piel y, hacia abajo, grasa, músculo y hueso (espesores didácticos, de 0 a 15 cm).', 'Las líneas moradas son el campo magnético y se mueven de S a N: más rápido con más hercios y más gruesas con más gauss. En el solenoide son paralelas; en el plano son arcos que salen de la placa: gruesos arriba y tenues abajo.', 'Las barras de la derecha muestran cuántos gauss llegan a cada centímetro de profundidad.', 'El hueso está marcado con borde naranja discontinuo a 7 cm. En el modo Exploración, arrastre la sonda naranja (o use las flechas del teclado) para leer los gauss y la capa a cada profundidad.']);
        U.fill($('mgaplnotes'), ['Solenoide: la zona se introduce en la bobina (pie, muñeca, rodilla). Llega parejo y más profundo.', 'Plano: se apoya sobre la zona (lumbar, hombro). Es superficial: pierde energía al profundizar.', 'La clase da una penetración de 5 a 15 cm según el aplicador. En el dibujo el plano llega a 0 a los 15 cm (modelo didáctico).']);
        U.fill($('mgnotes'), M.NOTES);
        return { destroy: function () { if (sol) sol.destroy(); if (pla) pla.destroy(); sol = pla = null; } };
      } },
      { title: 'Polaridad y efectos', html: T2, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, sel = M.TISSUES[0].id;
        function pole(v) {
          var b = $('mgpoleres'); b.className = 'res ' + (v === 'N' ? 'warn' : 'ok'); b.innerHTML = '';
          b.appendChild(U.el('b', '', v === 'N' ? 'Polo norte: miorrelajante.' : 'Polo sur: analgésico y antiinflamatorio.'));
          b.appendChild(U.el('p', '', v === 'N' ? 'Útil en contracturas y tensión muscular.' : 'Útil cuando domina el dolor o la inflamación.'));
        }
        U.seg($('mgpol'), pole); pole('N');
        U.slider(root, 'mgg', function (v) { $('mgtes').textContent = K.fx(v, 0) + ' G = ' + K.fx(M.gaussToTesla(v), 4) + ' T'; return v + ' G'; });

        /* Escena animada: seis viñetas de tejidos (lab-magneto-anim.js). */
        var tis = window.MagnetoAnim ? MagnetoAnim.tissue($('mgtscene'), { tissueId: sel }) : null;
        if (tis) $('mgtscene').addEventListener('tissue-select', function (e) { sel = e.detail; upd(); });
        function info() {
          var t = M.TISSUES.filter(function (x) { return x.id === sel; })[0], b = $('mgtinfo');
          b.innerHTML = ''; b.appendChild(U.el('h3', 'tt', t.nombre));
          b.appendChild(U.el('p', 'note', 'Nivel de acción (clase): ' + t.nivel));
          b.appendChild(U.el('h4', '', 'Qué le pasa al tejido'));
          var ol = U.el('ol', 'steps');
          t.pasos.forEach(function (p) { ol.appendChild(U.el('li', '', p)); });
          b.appendChild(ol);
          var r = U.el('div', 'res ok'); r.appendChild(U.el('b', '', 'Efecto en el tejido: ')); r.appendChild(document.createTextNode(t.efecto)); b.appendChild(r);
          var c = U.el('div', 'res'); c.appendChild(U.el('b', '', 'Qué se nota en el paciente: ')); c.appendChild(document.createTextNode(t.clinico)); b.appendChild(c);
          if (t.dato) b.appendChild(U.el('p', 'note', 'Dato de la clase: ' + t.dato));
          b.appendChild(U.el('h4', '', 'Cuánto y cada cuánto (tabla de la clase)'));
          var h = '<table><tr><th>Patología</th><th>Intensidad</th><th>Tiempo</th><th>Sesiones</th></tr>';
          M.tissueDoses(t.id).forEach(function (d) { h += '<tr><td>' + d.nombre + '</td><td>' + d.gauss + '</td><td>' + d.minutes + '</td><td>' + d.sesiones + '</td></tr>'; });
          var box = U.el('div'); box.style.overflowX = 'auto'; box.innerHTML = h + '</table>'; b.appendChild(box);
          if (t.polo) b.appendChild(U.el('p', 'note', 'Polo habitual: ' + t.polo + ' (' + (t.polo === 'N' ? 'miorrelajante' : 'analgésico y antiinflamatorio') + ').'));
        }
        function resumen() {
          var h = '<table><tr><th>Tejido</th><th>Nivel</th><th>Qué cambia</th><th>Qué se nota</th><th>Se usa en</th></tr>';
          M.TISSUES.forEach(function (t) {
            var nm = t.usos.map(function (u) { return M.PATHOLOGIES.filter(function (x) { return x.id === u; })[0].nombre.toLowerCase(); }).join(', ');
            h += '<tr data-t="' + t.id + '" style="cursor:pointer"' + (t.id === sel ? ' class="on"' : '') + '><td>' + t.nombre + '</td><td>' + t.nivel + '</td><td>' + t.pasos[t.pasos.length - 1] + '</td><td>' + t.clinico + '</td><td>' + nm + '</td></tr>';
          });
          $('mgresumen').innerHTML = h + '</table>';
        }
        function upd() {
          if (tis) tis.setTissue(sel); info(); resumen();
          [].forEach.call($('mgtis').children, function (x) { x.classList.toggle('on', x.getAttribute('data-v') === sel); });
        }
        U.seg($('mgtis'), function (v) { sel = v; upd(); });
        $('mgresumen').addEventListener('click', function (e) { var n = e.target.closest ? e.target.closest('tr[data-t]') : null; if (n) { sel = n.getAttribute('data-t'); upd(); } });
        upd();
        return { destroy: function () { if (tis) tis.destroy(); tis = null; } };
      } },
      { title: 'Protocolo', html: T3, init: function (root) {
        var $ = function (id) { return root.getElementById(id); };
        function prof(hz) {
          var p = M.profileFor(hz), b = $('mgprof'); b.innerHTML = '';
          if (!p) { U.badge(b, 'warn', 'Con 50 Hz no hay perfil: elija menos o más de 50 Hz'); return; }
          var d = M.PROFILES[p];
          U.badge(b, 'ok', d.nombre); b.appendChild(U.el('p', '', 'Efecto: ' + d.efecto + '. Intensidad ' + d.gauss[0] + '–' + d.gauss[1] + ' G, ' + d.minutes[0] + '–' + d.minutes[1] + ' min, ' + d.sesiones + '; ' + d.serie + '.'));
        }
        var pw = window.MagnetoAnim ? MagnetoAnim.wave($('mgpwave'), { shape: 'sinusoidal', hz: 30 }) : null;
        U.slider(root, 'mgf', function (v) { prof(v); if (pw) pw.update({ hz: v }); return v + ' Hz'; });
        [['mgpa', 'ataque'], ['mgpb', 'analgesico']].forEach(function (x) {
          var d = M.PROFILES[x[1]];
          U.fill($(x[0]), ['Frecuencia: ' + d.hz, 'Intensidad: ' + d.gauss[0] + '–' + d.gauss[1] + ' G', 'Tiempo: ' + d.minutes[0] + '–' + d.minutes[1] + ' min', 'Sesiones: ' + d.sesiones, 'Series: ' + d.serie, 'Predomina: ' + d.efecto]);
        });
        $('mghi').textContent = M.HIGH_INTENSITY_NOTE;
        return { destroy: function () { if (pw) pw.destroy(); pw = null; } };
      } },
      { title: 'Patologías', html: T4, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, apl = 'solenoide', pol = 'S';
        M.PATHOLOGIES.forEach(function (p) { var o = U.el('option', '', p.nombre); o.value = p.id; $('mgpat').appendChild(o); });
        function table() {
          var cur = $('mgpat').value, h = '<table><tr><th>Patología</th><th>Frecuencia</th><th>Gauss</th><th>Tiempo</th><th>Sesiones</th></tr>';
          M.PATHOLOGIES.forEach(function (p) {
            h += '<tr' + (p.id === cur ? ' class="on"' : '') + '><td>' + p.nombre + '</td><td>' + M.frequencyText(p.id) + '</td><td>' + (p.maxDevice ? 'Máximo' : p.gauss[0] + ' – ' + p.gauss[1]) + '</td><td>' + (p.minutes === null ? 'varía' : p.minutes + ' min') + '</td><td>' + SES[p.sesiones] + '</td></tr>';
          });
          $('mgtab').innerHTML = h + '</table>';
        }
        function why() {
          var W = M.WHY_PROFILES, cur = M.PATHOLOGIES.filter(function (x) { return x.id === $('mgpat').value; })[0], on = cur ? cur.perfil : '';
          $('mgwhyr').textContent = W.regla;
          var rows = [['Frecuencia', 'frecuencia'], ['Intensidad', 'intensidad'], ['Qué predomina', 'predomina'], ['Cuándo', 'cuando'], ['Tiempo', 'tiempo'], ['Sesiones y series', 'sesiones']];
          var h = '<table><tr><th></th>' + W.columnas.map(function (c) { return '<th' + (c.perfil === on ? ' class="pcol"' : '') + '>' + c.titulo + '</th>'; }).join('') + '</tr>';
          rows.forEach(function (r) { h += '<tr><th>' + r[0] + '</th>' + W.columnas.map(function (c) { return '<td' + (c.perfil === on ? ' class="pcol"' : '') + '>' + c[r[1]] + '</td>'; }).join('') + '</tr>'; });
          $('mgwhy').innerHTML = h + '</table>';
        }
        function upd() {
          table(); why();
          U.verdict($('mgverd'), $('mgmsg'), M.evaluateProtocol({ pathology: $('mgpat').value, applicator: apl, pole: pol, hz: +$('mgf2').value, gauss: +$('mgg2').value, minutes: +$('mgt2').value }), { ok: 'Adecuado', ajustar: 'Ajustar', no: 'No válido' });
        }
        $('mgpat').addEventListener('change', upd);
        U.seg($('mgapl2'), function (v) { apl = v; upd(); }); U.seg($('mgpol2'), function (v) { pol = v; upd(); });
        U.slider(root, 'mgf2', function (v) { return v + ' Hz'; }, upd); U.slider(root, 'mgg2', function (v) { return v + ' G'; }, upd); U.slider(root, 'mgt2', function (v) { return v + ' min'; }, upd);
        upd();
      } },
      { title: 'Seguridad', html: U.safeHtml('mg'), init: function (root) {
        U.fill(root.getElementById('mgind'), ['Procesos reumáticos, trastornos de la osificación, traumatología y medicina deportiva', 'Patología vascular periférica, cirugía, neurología, quemados y asma']);
        U.checker(root, 'mgchk', M.CONDITIONS);
      } },
      { title: 'Caso clínico', html: U.caseHtml('mg'), init: function (root) {
        U.cases(root, 'mgcases', M.CASES, {
          apto: { label: '¿Es apto/a?', type: 'select', options: [['si', 'Sí'], ['no', 'No']] },
          applicator: { label: 'Aplicador', type: 'select', options: [['solenoide', 'Solenoide'], ['plano', 'Plano']] },
          pole: { label: 'Polo', type: 'select', options: [['N', 'Norte'], ['S', 'Sur']] },
          gauss: { label: 'Intensidad', type: 'number', unit: 'G' },
          minutes: { label: 'Tiempo', type: 'number', unit: 'min' }
        });
      } }
    ]
  });
  LabCore.register(def);
})();
