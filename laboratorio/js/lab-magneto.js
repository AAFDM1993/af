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

  var T1 =
    '<div class="card" style="grid-column:1/-1"><h2>Los dos aplicadores, con la misma intensidad (60 G en la piel)</h2>' +
    '<div style="display:flex;gap:18px;flex-wrap:wrap"><div style="flex:1 1 400px;min-width:300px"><h3 style="margin:4px 0">Solenoide</h3><p style="font-weight:bold">Rodea la zona y llega parejo a todas las capas.</p><div id="mgsol"></div></div>' +
    '<div style="flex:1 1 400px;min-width:300px"><h3 style="margin:4px 0">Plano</h3><p style="font-weight:bold">Se apoya en la piel y se debilita al profundizar.</p><div id="mgpla"></div></div></div></div>' +
    '<div class="card" style="grid-column:1/-1"><h2>Cuántos gauss llegan a cada capa</h2><div id="mgtabd" style="overflow-x:auto"></div></div>' +
    '<div class="card"><h2>Cómo leer el dibujo</h2><ul class="l" id="mgleer"></ul></div>' +
    '<div class="card"><h2>¿Cuál uso?</h2><ul class="l" id="mgaplnotes"></ul></div>' +
    '<div class="card" style="grid-column:1/-1"><h2>Datos de la clase</h2><ul class="l" id="mgnotes"></ul></div>';

  var T2 =
    '<div class="card"><h2>Polaridad</h2><div class="row"><label>Polo</label>' + segHtml('mgpol', POL, 'N') + '</div>' +
    '<div class="res" id="mgpoleres"></div>' +
    '<p class="note">El efecto por polo es el de la clase. Revise el sticker de cada aplicador antes de usarlo.</p></div>' +
    '<div class="card"><h2>Gauss y tesla</h2>' + slider('mgg', 'Intensidad', 0, 200, 1, 100) + '<p id="mgtes"></p><p class="note">1 T = 10 000 G.</p></div>' +
    '<div class="card" style="grid-column:1/-1"><h2>Qué hace el campo en cada tejido</h2><p class="note">Toque un tejido del esquema o elíjalo en la lista. Esquema didáctico con los efectos de la clase.</p>' +
    '<div class="seg" id="mgtis">' + MagnetoCore.TISSUES.map(function (t, i) { return '<button type="button" data-v="' + t.id + '"' + (i ? '' : ' class="on"') + '>' + t.nombre + '</button>'; }).join('') + '</div>' +
    '<div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:12px"><div id="mgtscene" style="flex:1.6 1 560px;min-width:280px"></div><div id="mgtinfo" style="flex:1 1 320px"></div></div></div>' +
    '<div class="card" style="grid-column:1/-1"><h2>Resumen: qué mejora el campo en cada tejido</h2><p class="note">Toque una fila para ver ese tejido arriba.</p><div id="mgresumen" style="overflow-x:auto"></div></div>';

  var T3 =
    '<div class="card"><h2>Perfiles de la clase</h2><div class="row"><label>Frecuencia</label><input type="range" id="mgf" min="1" max="100" step="1" value="30"><span class="val" id="mgfv" style="min-width:90px"></span></div><div id="mgprof"></div></div>' +
    '<div><div class="card"><h2>Perfil de ataque</h2><ul class="l" id="mgpa"></ul></div><div class="card"><h2>Perfil analgésico y miorrelajante</h2><ul class="l" id="mgpb"></ul></div>' +
    '<div class="card"><h2>Alta intensidad</h2><p id="mghi"></p></div></div>';

  var T4 =
    '<div class="card"><h2>Protocolo</h2><div class="row"><label>Patología</label><select id="mgpat"></select></div>' +
    '<div class="row"><label>Aplicador</label>' + segHtml('mgapl2', APL, 'solenoide') + '</div>' +
    '<div class="row"><label>Polo</label>' + segHtml('mgpol2', POL, 'S') + '</div>' +
    slider('mgf2', 'Frecuencia', 1, 100, 1, 30) + slider('mgg2', 'Intensidad', 0, 200, 1, 50) + slider('mgt2', 'Tiempo', 0, 60, 1, 20) +
    '<div id="mgverd"></div><div class="res" id="mgmsg"></div></div>' +
    '<div class="card"><h2>Tabla de la clase</h2><div id="mgtab" style="overflow-x:auto"></div></div>';

  var def = U.build({
    id: 'magneto', title: 'Magnetoterapia', subtitle: 'Campo magnético de baja frecuencia · solenoide y plano · modelo didáctico para proyección', accent: '#5B3A8C',
    css: 'table{border-collapse:collapse;width:100%;font-size:17px}th,td{border:1px solid var(--line);padding:4px 8px;text-align:left}th{background:#EFE7F7}tr.on td{background:#FFF1D6;font-weight:bold}' +
      'h3.tt{margin:0 0 8px;font-size:24px;color:var(--accent)}' +
      'h4{margin:12px 0 4px;font-size:19px;color:var(--accent)}' +
      'tr.on td{background:#FFF1D6;font-weight:bold}' +
      'ol.steps{list-style:none;margin:6px 0 10px;padding:0;counter-reset:p}' +
      'ol.steps li{counter-increment:p;position:relative;margin:0 0 22px;padding:8px 12px 8px 50px;background:#FBF1EA;border:2px solid var(--line);border-radius:10px;font-size:19px;line-height:1.3}' +
      'ol.steps li::before{content:counter(p);position:absolute;left:10px;top:50%;transform:translateY(-50%);width:30px;height:30px;border-radius:50%;background:var(--accent);color:#fff;font-weight:bold;text-align:center;line-height:30px;font-size:18px}' +
      'ol.steps li:not(:last-child)::after{content:"\\2193";position:absolute;left:50%;bottom:-23px;color:var(--accent);font-weight:bold;font-size:20px;line-height:20px}' +
      'ol.steps li:first-child{background:#EFE7F7;border-color:var(--accent);font-weight:bold}',
    tabs: [
      { title: 'Campo y aplicador', html: T1, init: function (root) {
        var $ = function (id) { return root.getElementById(id); };
        var COL = { piel: '#E8B58F', grasa: '#F6E3A1', musculo: '#D98A7E', hueso: '#EDE6D6' };
        /* Corte del miembro: profundidad hacia abajo (0 a 15 cm). A la derecha, barras con los gauss que llegan a cada cm. */
        var X0 = 96, X1 = 372, Y0 = 78, PX = 18, SUR = 60, BONE = 7, DMAX = 15, YB = Y0 + DMAX * PX;
        var MX = 452, MW = 88, VIO = '#5B3A8C', NAR = '#C77700', INK = '#2B1B10';
        function T(x, y, s, o) {
          o = o || {};
          return '<text x="' + x + '" y="' + y + '" font-size="' + (o.fs || 16) + '"' + (o.a ? ' text-anchor="' + o.a + '"' : '') + (o.b ? ' font-weight="bold"' : '') + ' fill="' + (o.c || INK) + '">' + s + '</text>';
        }
        function scheme(apl) {
          var sol = apl === 'solenoide', i, y, cx = (X0 + X1) / 2, mk = 'mgarr-' + apl, clip = 'mgclip-' + apl;
          var gBone = M.fieldAtDepth(apl, BONE, SUR);
          var svg = '<svg viewBox="0 0 600 456" role="img" aria-label="' + (sol
            ? 'Solenoide: la zona está dentro de la bobina; el campo va de S a N en líneas paralelas y llega parejo a todas las capas. Al hueso, a 7 cm, llegan ' + K.fx(gBone, 0) + ' G.'
            : 'Aplicador plano: la placa se apoya en la piel; el campo sale en arcos que se debilitan al profundizar. Al hueso, a 7 cm, llegan ' + K.fx(gBone, 0) + ' G y a 15 cm ya no llega campo.') + '">';
          svg += '<defs><marker id="' + mk + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="' + VIO + '"/></marker>' +
            '<clipPath id="' + clip + '"><rect x="' + X0 + '" y="' + Y0 + '" width="' + (X1 - X0) + '" height="' + (DMAX * PX) + '"/></clipPath></defs>';
          /* capas */
          M.LAYERS.forEach(function (L) {
            var y1 = Y0 + L.from * PX, h = (L.to - L.from) * PX;
            svg += '<rect x="' + X0 + '" y="' + y1 + '" width="' + (X1 - X0) + '" height="' + h + '" fill="' + COL[L.id] + '"/>';
            svg += T(X0 - 8, L.id === 'piel' ? y1 + 11 : (L.id === 'grasa' ? y1 + 30 : y1 + h / 2 + 6), L.nombre, { a: 'end', fs: 16, b: L.id === 'hueso' });
          });
          /* hueso resaltado */
          svg += '<rect x="' + X0 + '" y="' + (Y0 + 6 * PX) + '" width="' + (X1 - X0) + '" height="' + (2 * PX) + '" fill="none" stroke="' + NAR + '" stroke-width="3" stroke-dasharray="8 5"/>';
          svg += '<rect x="' + X0 + '" y="' + Y0 + '" width="' + (X1 - X0) + '" height="' + (DMAX * PX) + '" fill="none" stroke="#6b5848" stroke-width="2"/>';
          if (sol) {
            /* bobina en corte: espiras arriba (salen, punto) y abajo (entran, cruz); la zona queda dentro */
            [[Y0 - 30, 'o'], [YB + 6, 'x']].forEach(function (r) {
              svg += '<rect x="' + (X0 - 4) + '" y="' + r[0] + '" width="' + (X1 - X0 + 8) + '" height="24" rx="12" fill="#E9E1F3" stroke="' + VIO + '" stroke-width="2"/>';
              for (i = 0; i < 10; i++) {
                var wx = X0 + 14 + i * ((X1 - X0 - 28) / 9), wy = r[0] + 12;
                svg += '<circle cx="' + wx + '" cy="' + wy + '" r="8" fill="#fff" stroke="' + VIO + '" stroke-width="2.5"/>' +
                  (r[1] === 'o' ? '<circle cx="' + wx + '" cy="' + wy + '" r="2.6" fill="' + VIO + '"/>' : '<path d="M' + (wx - 4) + ' ' + (wy - 4) + 'L' + (wx + 4) + ' ' + (wy + 4) + 'M' + (wx + 4) + ' ' + (wy - 4) + 'L' + (wx - 4) + ' ' + (wy + 4) + '" stroke="' + VIO + '" stroke-width="2.2"/>');
              }
            });
            svg += T(X0 - 4, Y0 - 40, 'Bobina alrededor de la zona (espiras en corte)', { fs: 16, b: true, c: VIO });
            for (i = 0; i < 7; i++) {
              y = Y0 + 1 * PX + i * 2.1 * PX;
              svg += '<line x1="' + (X0 + 10) + '" y1="' + y + '" x2="' + (X1 - 12) + '" y2="' + y + '" stroke="' + VIO + '" stroke-width="3.5" marker-end="url(#' + mk + ')"/>';
              svg += '<path d="M' + (cx - 6) + ' ' + (y - 6) + 'L' + (cx + 6) + ' ' + y + 'L' + (cx - 6) + ' ' + (y + 6) + 'z" fill="' + VIO + '"/>';
            }
            /* polos en los extremos de la bobina */
            [[X0 - 22, 'S'], [X1 + 22, 'N']].forEach(function (p) {
              svg += '<circle cx="' + p[0] + '" cy="' + (Y0 - 18) + '" r="14" fill="' + VIO + '"/>' + T(p[0], Y0 - 12, p[1], { a: 'middle', fs: 17, b: true, c: '#fff' });
            });
            svg += T(cx, YB + 52, 'Campo de S a N: líneas paralelas, igual de fuertes', { a: 'middle', fs: 16, b: true, c: VIO });
          } else {
            /* placa apoyada en la piel; arcos que salen de la placa y vuelven a ella */
            svg += '<rect x="' + (cx - 128) + '" y="' + (Y0 - 30) + '" width="256" height="28" rx="6" fill="' + VIO + '"/>' + T(cx, Y0 - 10, 'placa sobre la piel', { a: 'middle', fs: 16, b: true, c: '#fff' });
            svg += T(X0 - 4, Y0 - 40, 'Placa apoyada en la piel', { fs: 16, b: true, c: VIO });
            svg += '<g clip-path="url(#' + clip + ')">';
            [1.5, 3, 4.6, 6.5, 8.8, 11.5, 14.4].forEach(function (d, k) {
              var f = M.fieldAtDepth(apl, d, SUR) / SUR, a = 22 + k * 17, ry = d * PX;
              var p = 'M' + (cx - a) + ' ' + Y0 + 'A' + a + ' ' + ry + ' 0 0 0 ' + (cx + a) + ' ' + Y0;
              svg += '<path d="' + p + '" fill="none" stroke="' + VIO + '" stroke-width="' + (1.5 + 3.5 * f).toFixed(2) + '" stroke-opacity="' + (0.2 + 0.8 * f).toFixed(2) + '"' + (f < 0.12 ? ' stroke-dasharray="6 5"' : '') + '/>';
            });
            svg += '</g>';
            svg += '<line x1="' + X0 + '" y1="' + YB + '" x2="' + X1 + '" y2="' + YB + '" stroke="' + INK + '" stroke-width="3" stroke-dasharray="10 6"/>';
            svg += T(cx, YB + 24, 'A 15 cm ya no llega campo (0 G)', { a: 'middle', fs: 16, b: true });
            svg += T(cx, YB + 52, 'Arcos: gruesos arriba, tenues abajo', { a: 'middle', fs: 16, b: true, c: VIO });
          }
          /* medidor: gauss que llegan a cada profundidad */
          svg += T(MX + MW / 2, Y0 - 40, 'Llega', { a: 'middle', fs: 16, b: true });
          svg += T(MX + MW / 2, Y0 - 20, '(G por cm)', { a: 'middle', fs: 14, c: '#4a3a2e' });
          svg += '<line x1="' + (MX - 1) + '" y1="' + (Y0 - 8) + '" x2="' + (MX - 1) + '" y2="' + (YB + 8) + '" stroke="#6b5848" stroke-width="1.5"/>';
          for (i = 0; i <= DMAX; i++) {
            var g = M.fieldAtDepth(apl, i, SUR), yy = Y0 + i * PX, bone = i === BONE;
            svg += '<rect x="' + MX + '" y="' + (yy - 6) + '" width="' + Math.max(g / SUR * MW, 0).toFixed(1) + '" height="12" fill="' + (bone ? NAR : VIO) + '"' + (bone ? ' stroke="' + INK + '" stroke-width="1.5"' : '') + '/>';
            if (i === 0 || i === BONE || i === DMAX) {
              svg += T(MX - 8, yy + 5, i + ' cm', { a: 'end', fs: 15, b: bone });
              svg += T(MX + Math.max(g / SUR * MW, 0) + 6, yy + 5, K.fx(g, 0) + ' G', { fs: 16, b: true, c: bone ? '#8A4F00' : INK });
            }
          }
          /* línea guía del hueso al medidor */
          svg += '<line x1="' + X1 + '" y1="' + (Y0 + BONE * PX) + '" x2="' + (MX - 46) + '" y2="' + (Y0 + BONE * PX) + '" stroke="' + NAR + '" stroke-width="2.5" stroke-dasharray="5 4"/>';
          /* letrero */
          svg += '<rect x="' + (X0 + 2) + '" y="' + (YB + 66) + '" width="' + (MX + MW - X0 + 40) + '" height="34" rx="8" fill="#FFF1D6" stroke="' + NAR + '" stroke-width="2.5"/>';
          svg += T((X0 + MX + MW + 42) / 2, YB + 89, 'Al hueso (7 cm) llegan ' + K.fx(gBone, 0) + ' G de los ' + SUR + ' G de la piel', { a: 'middle', fs: 17, b: true });
          return svg + '</svg>';
        }
        $('mgsol').innerHTML = scheme('solenoide');
        $('mgpla').innerHTML = scheme('plano');
        var ds = [0, 1, 4, 7, 10, 15], th = '<table><tr><th></th>', rs = '<tr><th>Solenoide</th>', rp = '<tr><th>Plano</th>';
        ds.forEach(function (x) {
          th += '<th>' + K.fx(x, 0) + ' cm (' + M.layerAt(x).nombre.toLowerCase() + ')</th>';
          rs += '<td>' + K.fx(M.fieldAtDepth('solenoide', x, SUR), 0) + ' G</td>'; rp += '<td>' + K.fx(M.fieldAtDepth('plano', x, SUR), 0) + ' G</td>';
        });
        $('mgtabd').innerHTML = th + '</tr>' + rs + '</tr>' + rp + '</tr></table>';
        U.fill($('mgleer'), ['Cada dibujo es un corte del miembro: arriba la piel y, hacia abajo, grasa, músculo y hueso (espesores didácticos, de 0 a 15 cm).', 'Las líneas moradas son el campo magnético. En el solenoide son paralelas y van de S a N; en el plano son arcos que salen de la placa: gruesos arriba y tenues abajo.', 'Las barras de la derecha muestran cuántos gauss llegan a cada centímetro de profundidad.', 'El hueso está marcado con borde naranja discontinuo a 7 cm; el letrero dice cuántos gauss le llegan.']);
        U.fill($('mgaplnotes'), ['Solenoide: la zona se introduce en la bobina (pie, muñeca, rodilla). Llega parejo y más profundo.', 'Plano: se apoya sobre la zona (lumbar, hombro). Es superficial: pierde energía al profundizar.', 'La clase da una penetración de 5 a 15 cm según el aplicador. En el dibujo el plano llega a 0 a los 15 cm (modelo didáctico).']);
        U.fill($('mgnotes'), M.NOTES);
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

        /* Escena: seis viñetas ampliadas (una por tejido) atravesadas por las líneas del campo. */
        var VW = 222, VH = 214, VD = 170, GX = 6, GAP = 6, GY = 56;
        var SHORT = { hueso: 'Hueso', membrana: 'Membrana y edema', conectivo: 'Tendón, ligamento, piel', musculo: 'Músculo', vasos: 'Vasos sanguíneos', nervio: 'Nervio y dolor' };
        var INK = '#2B1B10', VIO = '#5B3A8C';
        function tx(x, y, s, fs, o) {
          o = o || {};
          return '<text x="' + x + '" y="' + y + '" font-size="' + fs + '" text-anchor="' + (o.a || 'middle') + '"' + (o.b ? ' font-weight="bold"' : '') + ' fill="' + (o.c || INK) + '">' + s + '</text>';
        }
        function tag(x, y, s, w) { /* rótulo con fondo blanco */
          return '<rect x="' + (x - w / 2) + '" y="' + (y - 15) + '" width="' + w + '" height="21" rx="5" fill="#fff" fill-opacity="0.92" stroke="#6b5848" stroke-width="1"/>' + tx(x, y, s, 15, { b: true });
        }
        function ion(x, y, s, fill) {
          return '<rect x="' + (x - 21) + '" y="' + (y - 13) + '" width="42" height="26" rx="13" fill="' + fill + '" stroke="' + INK + '" stroke-width="1.5"/>' + tx(x, y + 5, s, 15, { b: true, c: fill === '#fff' ? INK : '#fff' });
        }
        var DRAW = {
          hueso: function () {
            var s = '<rect width="' + VW + '" height="' + VD + '" fill="#EDE6D6"/>', i;
            [[58, 58], [158, 52]].forEach(function (o) {
              [36, 26, 16].forEach(function (r) { s += '<circle cx="' + o[0] + '" cy="' + o[1] + '" r="' + r + '" fill="none" stroke="#B59A6A" stroke-width="3"/>'; });
              s += '<circle cx="' + o[0] + '" cy="' + o[1] + '" r="6" fill="#B3261E" fill-opacity="0.7"/>';
            });
            s += '<path d="M0 104 H' + VW + ' V' + VD + ' H0z" fill="#F7EFD9"/>';
            for (i = 0; i < 7; i++) s += '<rect x="' + (6 + i * 31) + '" y="106" width="26" height="20" rx="6" fill="#8B5E34" stroke="' + INK + '" stroke-width="1"/><circle cx="' + (19 + i * 31) + '" cy="116" r="5" fill="#F3E3C8"/>';
            return s + tag(111, 152, 'osteoblastos', 120);
          },
          membrana: function () {
            var s = '<rect width="' + VW + '" height="' + VD + '" fill="#DCEBF5"/>';
            s += '<ellipse cx="124" cy="86" rx="64" ry="54" fill="#FFE8D9" stroke="' + VIO + '" stroke-width="8"/><ellipse cx="124" cy="86" rx="64" ry="54" fill="none" stroke="#fff" stroke-width="1.5"/>';
            s += ion(118, 70, 'K⁺', '#2E7D4F') + ion(148, 108, 'Ca²⁺', '#1F5F99');
            /* sodio saliendo */
            s += '<path d="M92 92 L44 112" stroke="' + INK + '" stroke-width="3" marker-end="url(#mgtarr)"/><path d="M96 60 L44 40" stroke="' + INK + '" stroke-width="3" marker-end="url(#mgtarr)"/>';
            s += ion(26, 34, 'Na⁺', '#C77700') + ion(26, 118, 'Na⁺', '#C77700');
            /* líquido que sale */
            [[206, 30], [210, 74], [206, 118]].forEach(function (d) { s += '<path d="M' + d[0] + ' ' + (d[1] - 14) + ' Q' + (d[0] + 10) + ' ' + (d[1] + 1) + ' ' + d[0] + ' ' + (d[1] + 8) + ' Q' + (d[0] - 10) + ' ' + (d[1] + 1) + ' ' + d[0] + ' ' + (d[1] - 14) + 'z" fill="#2F7FC1" stroke="' + INK + '" stroke-width="1"/>'; });
            return s + tag(111, 160, 'sale Na⁺: menos edema', 176);
          },
          conectivo: function () {
            var s = '<rect width="' + VW + '" height="' + VD + '" fill="#F5EFE3"/>', i, j, p;
            for (i = 0; i < 6; i++) {
              p = 'M0 ' + (18 + i * 22);
              for (j = 0; j < 11; j++) p += ' q10 ' + (j % 2 ? 6 : -6) + ' 20 0';
              s += '<path d="' + p + '" fill="none" stroke="#C9A66B" stroke-width="6" stroke-linecap="round"/>';
            }
            [[52, 40], [150, 62], [92, 106]].forEach(function (c) { s += '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="24" ry="7" fill="#7A4E9C" stroke="' + INK + '" stroke-width="1"/><ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="6" ry="4" fill="#E9D8F5"/>'; });
            return s + tag(64, 156, 'colágeno', 96) + tag(166, 156, 'fibroblasto', 104);
          },
          musculo: function () {
            var s = '<rect width="' + VW + '" height="' + VD + '" fill="#F4D3CC"/>', i, x;
            for (i = 0; i < 4; i++) {
              var y = 10 + i * 34;
              s += '<rect x="4" y="' + y + '" width="214" height="28" rx="14" fill="#D98A7E" stroke="#8E3B30" stroke-width="1.5"/>';
              for (x = 16; x < 210; x += 7) s += '<line x1="' + x + '" y1="' + (y + 4) + '" x2="' + x + '" y2="' + (y + 24) + '" stroke="#8E3B30" stroke-width="1.4"/>';
              s += '<ellipse cx="' + (40 + i * 44) + '" cy="' + (y + 5) + '" rx="8" ry="3" fill="#4A1E18"/>';
            }
            return s + tag(111, 160, 'fibras musculares', 150);
          },
          vasos: function () {
            var s = '<rect width="' + VW + '" height="' + VD + '" fill="#FBEDEA"/>';
            s += '<rect x="-10" y="34" width="242" height="88" rx="10" fill="#F6C3BD" stroke="#8E1B16" stroke-width="9"/>';
            [[24, 62], [62, 92], [98, 58], [132, 96], [168, 64], [200, 94], [80, 76], [150, 80]].forEach(function (c) {
              s += '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="13" ry="8" fill="#C62828" stroke="#6E0F0B" stroke-width="1"/><ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="5" ry="3" fill="#E57373"/>';
            });
            s += '<path d="M150 22 H200" stroke="' + INK + '" stroke-width="3" marker-end="url(#mgtarr)"/>' + tx(124, 27, 'flujo', 15, { b: true });
            return s + tag(111, 156, 'glóbulos rojos', 130);
          },
          nervio: function () {
            var s = '<rect width="' + VW + '" height="' + VD + '" fill="#FFF8E1"/>', i;
            s += '<rect x="186" y="0" width="36" height="' + VD + '" fill="#E8B58F"/>' + '<text x="204" y="20" font-size="14" text-anchor="middle" fill="' + INK + '" font-weight="bold">piel</text>';
            s += '<line x1="0" y1="80" x2="150" y2="80" stroke="#7A5A00" stroke-width="3"/>';
            for (i = 0; i < 5; i++) s += '<rect x="' + (4 + i * 29) + '" y="70" width="24" height="20" rx="9" fill="#E0B400" stroke="#7A5A00" stroke-width="1.5"/>';
            /* receptor sensitivo (corpúsculo en capas) */
            [26, 19, 12].forEach(function (r) { s += '<ellipse cx="168" cy="80" rx="' + r + '" ry="' + (r * 0.7) + '" fill="#FFE27A" stroke="#7A5A00" stroke-width="2"/>'; });
            s += '<line x1="150" y1="80" x2="172" y2="80" stroke="#7A5A00" stroke-width="3"/>';
            return s + tag(60, 124, 'nervio', 76) + tag(160, 132, 'receptor', 96);
          }
        };
        function scene() {
          var s = '<svg viewBox="0 0 690 500" role="img" aria-label="Seis tejidos ampliados atravesados por el campo magnético. Seleccionado: ' + SHORT[sel] + '.">', i;
          s += '<defs><marker id="mgtarr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="' + INK + '"/></marker>' +
            '<marker id="mgfarr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10z" fill="' + VIO + '"/></marker></defs>';
          s += '<line x1="8" y1="24" x2="70" y2="24" stroke="' + VIO + '" stroke-width="4" stroke-dasharray="14 8" marker-end="url(#mgfarr)"/>' + tx(80, 30, 'Campo magnético: atraviesa todos los tejidos (no los calienta)', 18, { a: 'start', b: true, c: VIO });
          M.TISSUES.forEach(function (t, k) {
            var on = t.id === sel, x = GX + (k % 3) * (VW + GAP), y = GY + Math.floor(k / 3) * (VH + GAP), cid = 'mgvc-' + t.id;
            s += '<g data-t="' + t.id + '" style="cursor:pointer" transform="translate(' + x + ' ' + y + ')">';
            s += '<clipPath id="' + cid + '"><rect width="' + VW + '" height="' + VD + '" rx="10"/></clipPath>';
            s += '<g clip-path="url(#' + cid + ')">' + DRAW[t.id]() + '</g>';
            s += '<clipPath id="' + cid + 'b"><rect width="' + VW + '" height="' + VH + '" rx="10"/></clipPath><rect y="' + VD + '" width="' + VW + '" height="' + (VH - VD) + '" fill="' + (on ? VIO : '#fff') + '" clip-path="url(#' + cid + 'b)"/>';
            s += tx(VW / 2, VD + 29, (on ? '▶ ' : '') + SHORT[t.id], 17, { b: true, c: on ? '#fff' : INK });
            s += '<rect x="' + (on ? 3 : 1) + '" y="' + (on ? 3 : 1) + '" width="' + (VW - (on ? 6 : 2)) + '" height="' + (VH - (on ? 6 : 2)) + '" rx="10" fill="none" stroke="' + (on ? '#C77700' : '#6b5848') + '" stroke-width="' + (on ? 6 : 2) + '"/>';
            s += '</g>';
          });
          /* líneas del campo encima de todo, sin capturar clics */
          s += '<g pointer-events="none">';
          [GY + 46, GY + 100, GY + VH + GAP + 46, GY + VH + GAP + 100].forEach(function (yy) {
            s += '<line x1="2" y1="' + yy + '" x2="686" y2="' + yy + '" stroke="' + VIO + '" stroke-width="3.5" stroke-opacity="0.55" stroke-dasharray="14 8" marker-end="url(#mgfarr)"/>';
          });
          s += '</g>';
          return s + '</svg>';
        }
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
          $('mgtscene').innerHTML = scene(); info(); resumen();
          [].forEach.call($('mgtis').children, function (x) { x.classList.toggle('on', x.getAttribute('data-v') === sel); });
        }
        U.seg($('mgtis'), function (v) { sel = v; upd(); });
        $('mgtscene').addEventListener('click', function (e) { var n = e.target.closest ? e.target.closest('g[data-t]') : null; if (n) { sel = n.getAttribute('data-t'); upd(); } });
        $('mgresumen').addEventListener('click', function (e) { var n = e.target.closest ? e.target.closest('tr[data-t]') : null; if (n) { sel = n.getAttribute('data-t'); upd(); } });
        upd();
      } },
      { title: 'Protocolo', html: T3, init: function (root) {
        var $ = function (id) { return root.getElementById(id); };
        function prof(hz) {
          var p = M.profileFor(hz), b = $('mgprof'); b.innerHTML = '';
          if (!p) { U.badge(b, 'warn', 'Con 50 Hz no hay perfil: elija menos o más de 50 Hz'); return; }
          var d = M.PROFILES[p];
          U.badge(b, 'ok', d.nombre); b.appendChild(U.el('p', '', 'Efecto: ' + d.efecto + '. Intensidad ' + d.gauss[0] + '–' + d.gauss[1] + ' G, ' + d.minutes[0] + '–' + d.minutes[1] + ' min, ' + d.sesiones + '; ' + d.serie + '.'));
        }
        U.slider(root, 'mgf', function (v) { prof(v); return v + ' Hz'; });
        [['mgpa', 'ataque'], ['mgpb', 'analgesico']].forEach(function (x) {
          var d = M.PROFILES[x[1]];
          U.fill($(x[0]), ['Frecuencia: ' + d.hz, 'Intensidad: ' + d.gauss[0] + '–' + d.gauss[1] + ' G', 'Tiempo: ' + d.minutes[0] + '–' + d.minutes[1] + ' min', 'Sesiones: ' + d.sesiones, 'Series: ' + d.serie, 'Predomina: ' + d.efecto]);
        });
        $('mghi').textContent = M.HIGH_INTENSITY_NOTE;
      } },
      { title: 'Patologías', html: T4, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, apl = 'solenoide', pol = 'S';
        M.PATHOLOGIES.forEach(function (p) { var o = U.el('option', '', p.nombre); o.value = p.id; $('mgpat').appendChild(o); });
        function table() {
          var cur = $('mgpat').value, h = '<table><tr><th>Patología</th><th>Gauss</th><th>Tiempo</th><th>Sesiones</th></tr>';
          M.PATHOLOGIES.forEach(function (p) {
            h += '<tr' + (p.id === cur ? ' class="on"' : '') + '><td>' + p.nombre + '</td><td>' + (p.maxDevice ? 'Máximo' : p.gauss[0] + ' – ' + p.gauss[1]) + '</td><td>' + (p.minutes === null ? 'varía' : p.minutes + ' min') + '</td><td>' + SES[p.sesiones] + '</td></tr>';
          });
          $('mgtab').innerHTML = h + '</table>';
        }
        function upd() {
          table();
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
