/* Dibujo SVG de ondas para los módulos de electroterapia (solo navegador).
   Firmas públicas: line(el, series, o), bands(el, segs, o), peaks(el, times, windowMs, o), envelope(el, f1, f2, windowMs, o).
   Parámetros opcionales comunes: o.title, o.unit ('ms' por defecto), o.windowMs, o.note (rótulo inferior, p. ej. "Esquema didáctico").
   line   · o.annotate = {start, pulse, phases, pause, pauseStart, period, amp, pulseText, pauseText, periodText} (en la unidad del eje).
   bands  · o.inner = {kind:'diad'|'pulse'|'biphasic'|'sine', hz}; o.labels = {on, off}; o.annotate = {first, firstText, cycle, cycleText}.
   peaks  · o.annotate = {pairText, period, periodText}.
   envelope · o.carriers = true dibuja además el acercamiento a las dos corrientes y la cota del periodo del batido. */
var LabWave = (function () {
  var W = 640, L = 64, R = 22, INK = '#2B1B10', MUTED = '#6b5848', GRID = '#EEE5DA', AXIS = '#7a6656', FRAME = '#E4D6C8';
  var ACC = 'var(--accent,#1F3F6B)', uid = 0;

  /* ---------- utilidades ---------- */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function n1(v) { return Math.round(v * 10) / 10; }
  function fmt(n) { return String(Math.round(n * 100) / 100).replace('.', ','); }
  function tw(s, size, bold) { return String(s).length * size * (bold ? 0.56 : 0.5); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function niceStep(span) {
    var raw = span / 6, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
    return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p;
  }
  function text(x, y, s, o) {
    o = o || {};
    var size = o.size || 15;
    return '<text x="' + n1(x) + '" y="' + n1(y) + '" font-size="' + size + '"' + (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') +
      (o.bold ? ' font-weight="bold"' : '') + (o.italic ? ' font-style="italic"' : '') +
      (o.halo === false ? '' : ' stroke="#fff" stroke-width="4" stroke-linejoin="round" paint-order="stroke"') +
      (o.style ? ' style="' + o.style + '"' : ' fill="' + (o.fill || INK) + '"') +
      (o.rotate ? ' transform="rotate(' + o.rotate + ' ' + n1(x) + ' ' + n1(y) + ')"' : '') + '>' + esc(s) + '</text>';
  }
  function ln(x1, y1, x2, y2, stroke, w, extra) {
    return '<line x1="' + n1(x1) + '" y1="' + n1(y1) + '" x2="' + n1(x2) + '" y2="' + n1(y2) + '" stroke="' + stroke + '" stroke-width="' + (w || 1) + '"' + (extra || '') + '/>';
  }
  function open(title, h) {
    var size = title && tw(title, 19, true) > W - 40 ? 17 : 19;
    return '<svg viewBox="0 0 ' + W + ' ' + h + '" role="img" aria-label="' + esc(title || 'Forma de onda') + '">' +
      '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (h - 2) + '" rx="10" fill="#fff" stroke="' + FRAME + '" stroke-width="2"/>' +
      (title ? text(W / 2, 27, title, { size: size, bold: true, anchor: 'middle', halo: false }) : '');
  }
  function put(el, s) { el.innerHTML = s + '</svg>'; }

  /* Eje de tiempo con rejilla vertical suave; pasa a segundos si la ventana es larga. */
  function timeAxis(windowMs, unit, yB, gridTop, h, x0, x1) {
    x0 = x0 === undefined ? L : x0; x1 = x1 === undefined ? W - R : x1;
    var u = unit || 'ms', k = 1, s = '';
    if (u === 'ms' && windowMs >= 2000) { u = 's'; k = 1000; }
    var span = windowMs / k, step = niceStep(span), dec = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
    for (var i = 0; i * step <= span + 1e-9; i++) {
      var t = i * step, x = x0 + t / span * (x1 - x0);
      if (i) s += ln(x, gridTop, x, yB, GRID, 1);
      s += ln(x, yB, x, yB + 6, AXIS, 1.5) + text(x, yB + 23, t.toFixed(dec).replace('.', ','), { size: 15, anchor: 'middle', fill: MUTED, halo: false });
    }
    s += ln(x0, yB, x1, yB, AXIS, 2);
    if (h) s += text(x1, h - 10, 'Tiempo (' + u + ')', { size: 15, anchor: 'end', fill: MUTED, halo: false });
    return s;
  }
  function yAxis(top, yB, label) {
    return ln(L, top - 6, L, yB, AXIS, 2) + text(20, (top + yB) / 2, label || 'Intensidad', { size: 15, anchor: 'middle', fill: MUTED, halo: false, rotate: -90 });
  }
  function note(h, s) { return s ? text(L, h - 10, s, { size: 14, italic: true, fill: MUTED, halo: false }) : ''; }

  /* Punta de flecha con la punta en (x, y); d = 1 derecha, -1 izquierda, 2 abajo, -2 arriba. */
  function arrow(x, y, d, color) {
    var p;
    if (d === 1 || d === -1) p = [x, y, x - d * 9, y - 4.5, x - d * 9, y + 4.5];
    else { var v = d > 0 ? 1 : -1; p = [x, y, x - 4.5, y - v * 9, x + 4.5, y - v * 9]; }
    return '<polygon points="' + p.map(n1).join(' ') + '" fill="' + color + '"/>';
  }

  /* Cota horizontal (llave dimensional) entre x1 y x2 a la altura y. o.extTo: y hasta donde bajan las líneas de referencia; o.clip: el extremo derecho sale de la ventana. */
  function dimH(x1, x2, y, label, o) {
    o = o || {};
    var col = o.color || INK, s = '', w = x2 - x1, inside = w >= 26, size = 15, lab = label + (o.clip ? ' →' : '');
    if (o.extTo !== undefined) {
      s += ln(x1, y - 7, x1, o.extTo, col, 1, ' stroke-dasharray="3 3" opacity="0.7"');
      if (!o.clip) s += ln(x2, y - 7, x2, o.extTo, col, 1, ' stroke-dasharray="3 3" opacity="0.7"');
    }
    s += ln(x1, y, x2, y, col, 1.8);
    if (inside) { s += arrow(x1, y, -1, col); if (!o.clip) s += arrow(x2, y, 1, col); }
    else { s += ln(x1 - 16, y, x1, y, col, 1.8) + ln(x2, y, x2 + 16, y, col, 1.8) + arrow(x1, y, 1, col) + arrow(x2, y, -1, col); }
    var lw = tw(lab, size, true), lx = (x1 + x2) / 2, ly = y - 7, anchor = 'middle';
    if (o.stack && lw + 10 > w && lab.indexOf(' ') > 0) {
      var sp = lab.indexOf(' '), l1 = lab.slice(0, sp), l2 = lab.slice(sp + 1);
      if (Math.max(tw(l1, size, true), tw(l2, size, true)) + 6 <= w) {
        return s + text(lx, y - 25, l1, { size: size, bold: true, fill: col, anchor: 'middle' }) + text(lx, y - 7, l2, { size: size, bold: true, fill: col, anchor: 'middle' });
      }
    }
    if (lw + 10 > w) {
      var gap = inside ? 8 : 22;
      if (x2 + gap + lw < W - 8) { lx = x2 + gap; anchor = 'start'; ly = y + 5; }
      else if (x1 - gap - lw > L) { lx = x1 - gap; anchor = 'end'; ly = y + 5; }
    }
    if (anchor === 'middle') lx = clamp(lx, L + lw / 2 + 2, W - 8 - lw / 2);
    return s + text(lx, ly, lab, { size: size, bold: true, fill: col, anchor: anchor });
  }
  /* Cota vertical (amplitud). */
  function dimV(x, y1, y2, label, col) {
    col = col || INK;
    var lw = tw(label, 15, true), right = x + 10 + lw < W - 8;
    return ln(x, y1, x, y2, col, 1.8) + arrow(x, y1, -2, col) + arrow(x, y2, 2, col) +
      text(right ? x + 10 : x - 10, (y1 + y2) / 2 + 5, label, { size: 15, bold: true, fill: col, anchor: right ? 'start' : 'end' });
  }

  /* ---------- line: onda muestreada con relleno, polaridad y cotas ---------- */
  function line(el, series, o) {
    o = o || {};
    var a = o.annotate || null, unit = o.unit || 'ms';
    var windowMs = o.windowMs || series.t[series.t.length - 1] || 1, lo = 0, hi = 0, i;
    for (i = 0; i < series.v.length; i++) { if (series.v[i] < lo) lo = series.v[i]; if (series.v[i] > hi) hi = series.v[i]; }
    if (hi === lo) hi = 1;
    var top = 56, yPeriod, yPulse;
    if (a && a.period > 0) { yPeriod = top + 4; top += 36; }
    if (a && a.pulse > 0) { yPulse = top + 4; top += 36; }
    if (a) top += 8;
    var h = top + 214, yB = h - 52, yLow = lo < 0 ? yB - 10 : yB;
    function px(t) { return L + t / windowMs * (W - L - R); }
    function py(v) { return top + (hi - v) / (hi - lo) * (yLow - top); }
    var s = open(o.title, h), y0 = py(0);
    /* rejilla horizontal en pasos de 0,5 */
    for (var g = Math.ceil(lo * 2) / 2; g <= hi + 1e-9; g += 0.5) if (Math.abs(g) > 1e-9) s += ln(L, py(g), W - R, py(g), GRID, 1);
    s += timeAxis(windowMs, unit, yB, top - 6, h) + yAxis(top, yB);
    if (lo < 0) s += ln(L, y0, W - R, y0, '#b9aa9a', 1.5, ' stroke-dasharray="5 4"');
    s += text(L - 8, y0 + 5, '0', { size: 15, anchor: 'end', fill: MUTED, halo: false });
    if (lo < 0 && hi > 0) {
      s += '<circle cx="' + (L - 22) + '" cy="' + n1(py(hi * 0.7)) + '" r="11" style="fill:' + ACC + '"/>' + text(L - 22, py(hi * 0.7) + 6, '+', { size: 19, bold: true, anchor: 'middle', fill: '#fff', halo: false });
      s += '<circle cx="' + (L - 22) + '" cy="' + n1(py(lo * 0.7)) + '" r="11" fill="#fff" style="stroke:' + ACC + '" stroke-width="2.5"/>' + text(L - 22, py(lo * 0.7) + 6, '−', { size: 19, bold: true, anchor: 'middle', style: 'fill:' + ACC, halo: false });
    }
    var d = '';
    for (i = 0; i < series.t.length; i++) d += (i ? 'L' : 'M') + px(Math.min(series.t[i], windowMs)).toFixed(1) + ' ' + py(series.v[i]).toFixed(1);
    var tl = px(Math.min(series.t[series.t.length - 1], windowMs)), tf = px(series.t[0]);
    s += '<path d="' + d + 'L' + tl.toFixed(1) + ' ' + y0.toFixed(1) + 'L' + tf.toFixed(1) + ' ' + y0.toFixed(1) + 'Z" style="fill:' + ACC + '" fill-opacity="0.16" stroke="none"/>';
    s += '<path d="' + d + '" fill="none" style="stroke:' + ACC + '" stroke-width="3" stroke-linejoin="round"/>';
    if (a) {
      var st = a.start || 0, xEnd = W - R, yTop = py(hi);
      if (a.period > 0) {
        var pe = px(st + a.period);
        s += dimH(px(st), Math.min(pe, xEnd), yPeriod, a.periodText || ('Periodo ' + fmt(a.period) + ' ' + unit), { extTo: yTop, clip: pe > xEnd + 0.5 });
      }
      if (a.pulse > 0) {
        s += dimH(px(st), px(st + a.pulse), yPulse, a.pulseText || ('Pulso ' + fmt(a.pulse) + ' ' + unit), { extTo: yTop });
      }
      if (a.pause > 0) {
        var ps = a.pauseStart !== undefined ? a.pauseStart : st + a.pulse * (a.phases || 1), x1 = px(ps), x2 = px(ps + a.pause);
        if (x1 < xEnd - 20) s += dimH(x1, Math.min(x2, xEnd), y0 - 24, a.pauseText || ('Pausa ' + fmt(a.pause) + ' ' + unit), { extTo: y0, clip: x2 > xEnd + 0.5, color: MUTED, stack: true });
      }
      if (a.amp) {
        var xa = a.ampAt !== undefined ? px(a.ampAt) : W - R - 40;
        s += dimV(xa, py(hi), y0, a.amp);
      }
    }
    s += note(h, o.note);
    put(el, s);
  }

  /* ---------- bands: tramos (diadinámicas, ráfagas) con el tren de pulsos dentro ---------- */
  var COLORS = { MF: '#C4521F', DF: '#1F6E7C', 'MF+DF': '#7A4DB3', pausa: '#76675A', on: null, off: '#76675A' };
  var NAMES = { MF: 'MF', DF: 'DF', 'MF+DF': 'MF+DF', pausa: 'pausa' };

  function humps(x1, x2, base, top, period, pulseFrac, ampFn) {
    var d = '', n = Math.max(1, Math.floor((x2 - x1) / period + 1e-6));
    for (var k = 0; k < n; k++) {
      var a = x1 + k * period, w = period * pulseFrac, amp = (ampFn ? ampFn(k / Math.max(1, n - 1)) : 1) * (base - top);
      d += 'M' + n1(a) + ' ' + n1(base) + 'C' + n1(a + w * 0.36) + ' ' + n1(base - 1.33 * amp) + ' ' + n1(a + w * 0.64) + ' ' + n1(base - 1.33 * amp) + ' ' + n1(a + w) + ' ' + n1(base);
    }
    return d;
  }
  function innerTrain(kind, type, x1, x2, base, top, spacing) {
    var d = '', k, n, mid = (base + top) / 2;
    if (kind === 'diad') {
      if (type === 'pausa' || type === 'off') return 'M' + n1(x1 + 2) + ' ' + n1(base) + 'L' + n1(x2 - 2) + ' ' + n1(base);
      if (type === 'DF') return humps(x1 + 2, x2 - 2, base, top, spacing / 2, 1);
      if (type === 'MF') return humps(x1 + 2, x2 - 2, base, top, spacing, 0.5);
      /* MF+DF: semiondas MF con la DF intercalada de amplitud modulada */
      return humps(x1 + 2, x2 - 2, base, top, spacing, 0.5) +
        humps(x1 + 2 + spacing / 2, x2 - 2, base, top, spacing, 0.5, function (f) { return 0.25 + 0.65 * Math.sin(Math.PI * f); });
    }
    if (type === 'off') return 'M' + n1(x1 + 2) + ' ' + n1(kind === 'pulse' ? base : mid) + 'L' + n1(x2 - 2) + ' ' + n1(kind === 'pulse' ? base : mid);
    n = Math.max(1, Math.floor((x2 - x1 - 4) / spacing));
    var pw = Math.max(1.4, Math.min(3, spacing * 0.22)), off = (x2 - x1 - n * spacing) / 2;
    for (k = 0; k < n; k++) {
      var x = x1 + off + k * spacing + spacing * 0.3;
      if (kind === 'pulse') d += 'M' + n1(x) + ' ' + n1(base) + 'V' + n1(top) + 'H' + n1(x + pw) + 'V' + n1(base);
      else if (kind === 'biphasic') d += 'M' + n1(x) + ' ' + n1(mid) + 'V' + n1(top) + 'H' + n1(x + pw) + 'V' + n1(base) + 'H' + n1(x + 2 * pw) + 'V' + n1(mid);
    }
    if (kind === 'square') {
      var xq = x1 + 2, up = true;
      d = 'M' + n1(xq) + ' ' + n1(mid) + 'V' + n1(top);
      while (xq + spacing / 2 < x2 - 2) { xq += spacing / 2; up = !up; d += 'H' + n1(xq) + 'V' + n1(up ? top : base); }
      return d + 'H' + n1(x2 - 2) + 'V' + n1(mid);
    }
    if (kind === 'sine') {
      var xs = x1 + 2, xe = x2 - 2, steps = Math.max(8, Math.round((xe - xs) / 1.5));
      for (k = 0; k <= steps; k++) {
        var xx = xs + (xe - xs) * k / steps;
        d += (k ? 'L' : 'M') + n1(xx) + ' ' + n1(mid - Math.sin(2 * Math.PI * (xx - xs) / spacing) * (mid - top));
      }
      return d;
    }
    return kind === 'pulse' ? 'M' + n1(x1 + 2) + ' ' + n1(base) + 'H' + n1(x2 - 2) + d : 'M' + n1(x1 + 2) + ' ' + n1(mid) + 'H' + n1(x2 - 2) + d;
  }

  function bands(el, segs, o) {
    o = o || {};
    var windowMs = o.windowMs || (segs.length ? segs[segs.length - 1].endMs : 1), colors = o.colors || COLORS, a = o.annotate || null, inner = o.inner || null;
    var labels = o.labels || { on: 'Ráfaga', off: 'Reposo' }, unit = o.unit || 'ms';
    function px(t) { return L + t / windowMs * (W - L - R); }
    /* geometría horizontal y decisión de rótulos (no depende de la altura) */
    var items = segs.map(function (g) {
      var key = g.type !== undefined ? g.type : (g.on ? 'on' : 'off'), x1 = px(g.startMs), x2 = px(g.endMs);
      var name = g.type !== undefined ? (NAMES[key] || key) : labels[key];
      return { g: g, key: key, x1: x1, x2: x2, name: name, fits: name && (x2 - x1) >= tw(name, 15, true) + 10 };
    });
    var legend = [], seen = {};
    items.forEach(function (it) { if (it.name && !seen[it.key]) { seen[it.key] = 1; legend.push(it); } });
    var needLegend = items.some(function (it) { return it.name && !it.fits; });
    /* tren interno: espaciado real si cabe; si no, esquemático */
    var schematic = false, spacing = 10;
    if (inner) {
      var onIt = items.filter(function (it) { return it.key !== 'off' && it.key !== 'pausa'; })[0];
      var realHz = inner.kind === 'diad' ? 50 : inner.hz;
      if (onIt && realHz > 0) {
        var realPx = (W - L - R) / (windowMs * realHz / 1000);
        var minPx = inner.kind === 'diad' ? 12 : (inner.kind === 'sine' || inner.kind === 'square' ? 6 : 7);
        if (realPx >= minPx) spacing = realPx; else { spacing = minPx + 2; schematic = true; }
      }
    }
    var top = 56, yCycle, yFirst;
    if (a && a.cycle > 0) { yCycle = top + 6; top += 34; }
    if (a && a.first > 0) { yFirst = top + 6; top += 34; }
    var notes = [o.note, schematic ? 'Pulsos internos esquemáticos (no a escala)' : ''].filter(Boolean).join(' · ');
    var legendW = 0;
    legend.forEach(function (it) { legendW += 34 + tw(it.name, 15, true); });
    var rowW = (needLegend ? legendW : 0) + (notes ? tw(notes, 14) : 0);
    var extraRow = notes && (needLegend || L + rowW > W - R - 110) ? 22 : 0;
    var h = top + 196 + extraRow, yB = h - 52 - extraRow, bTop = top + 4, bBot = yB - 4;
    var s = open(o.title, h) + timeAxis(windowMs, unit, yB, top, h - extraRow);
    items.forEach(function (it) {
      var col = it.key === 'on' ? null : (colors[it.key] || '#999'), fillSt = col ? ' fill="' + col + '"' : ' style="fill:' + ACC + '"';
      var w = Math.max(0.5, it.x2 - it.x1), quiet = it.key === 'off' || it.key === 'pausa';
      s += '<rect x="' + n1(it.x1) + '" y="' + n1(bTop) + '" width="' + n1(w) + '" height="' + n1(bBot - bTop) + '"' + fillSt + ' fill-opacity="' + (quiet ? 0.1 : 0.16) + '" stroke="#fff" stroke-width="2"/>';
      s += '<rect x="' + n1(it.x1) + '" y="' + n1(bTop) + '" width="' + n1(w) + '" height="6"' + fillSt + ' fill-opacity="' + (quiet ? 0.35 : 0.9) + '" stroke="#fff" stroke-width="1"/>';
      var waveTop = bTop + (it.fits ? 36 : 16), base = bBot - 10;
      var strokeSt = col ? ' stroke="' + col + '"' : ' style="stroke:' + ACC + '"';
      if (inner) s += '<path d="' + innerTrain(inner.kind, it.key, it.x1, it.x2, base, waveTop, spacing) + '" fill="none"' + strokeSt + ' stroke-width="' + (inner.kind === 'sine' || inner.kind === 'square' ? 1.6 : 2) + '" stroke-linejoin="round"/>';
      else if (!quiet) s += '<rect x="' + n1(it.x1 + 1) + '" y="' + n1(waveTop) + '" width="' + n1(Math.max(0.5, w - 2)) + '" height="' + n1(base - waveTop) + '"' + fillSt + ' fill-opacity="0.75"/>';
      if (it.fits) s += text((it.x1 + it.x2) / 2, bTop + 26, it.name, { size: 15, bold: true, anchor: 'middle', fill: col || undefined, style: col ? undefined : 'fill:' + ACC });
    });
    if (a) {
      var g0 = segs.length ? segs[0].startMs : 0;
      if (a.cycle > 0) { var ce = px(g0 + a.cycle); s += dimH(px(g0), Math.min(ce, W - R), yCycle, a.cycleText || ('Ciclo ' + fmt(a.cycle) + ' ' + unit), { extTo: bTop, clip: ce > W - R + 0.5 }); }
      if (a.first > 0) s += dimH(px(g0), px(g0 + a.first), yFirst, a.firstText || fmt(a.first) + ' ' + unit, { extTo: bTop });
    }
    /* pie: leyenda (si algún rótulo no cupo) y nota */
    var fy = h - 10 - extraRow, fx = L;
    if (needLegend) {
      legend.forEach(function (it) {
        var col = it.key === 'on' ? null : (colors[it.key] || '#999');
        s += '<rect x="' + n1(fx) + '" y="' + (fy - 12) + '" width="14" height="14" rx="3"' + (col ? ' fill="' + col + '"' : ' style="fill:' + ACC + '"') + '/>';
        s += text(fx + 20, fy, it.name, { size: 15, bold: true, halo: false });
        fx += 34 + tw(it.name, 15, true);
      });
    }
    if (notes) s += text(extraRow ? L : fx, h - 10, notes, { size: 14, italic: true, fill: MUTED, halo: false });
    put(el, s);
  }

  /* ---------- peaks: dobles picos (alto voltaje) ---------- */
  function peaks(el, times, windowMs, o) {
    o = o || {};
    var a = o.annotate || null, dense = times.length > 120, top = 60, yPer, yPair;
    if (a && a.period > 0 && !dense) { yPer = top + 4; top += 34; }
    if (a && a.pairText && !dense) { yPair = top + 4; top += 34; }
    var h = top + 196, yB = h - 52;
    function px(t) { return L + t / windowMs * (W - L - R); }
    var s = open(o.title, h) + timeAxis(windowMs, o.unit || 'ms', yB, top, h) + yAxis(top + 6, yB, 'Voltaje');
    var gapPx = times.length > 1 ? px(times[1]) - px(times[0]) : 20, wSp = clamp(gapPx * 0.8, 3, 9);
    if (dense) {
      times.forEach(function (t) { var x = px(t); s += ln(x, yB, x, top + 10, ACC, 1.2).replace('stroke="' + ACC + '"', 'style="stroke:' + ACC + '"'); });
    } else {
      var d = '';
      times.forEach(function (t) {
        var x = px(t);
        d += 'M' + n1(x) + ' ' + yB + 'L' + n1(x + 0.8) + ' ' + (top + 10) + 'C' + n1(x + wSp * 0.25) + ' ' + n1(top + 60) + ' ' + n1(x + wSp * 0.5) + ' ' + n1(yB - 12) + ' ' + n1(x + wSp) + ' ' + yB + 'Z';
      });
      s += '<path d="' + d + '" style="fill:' + ACC + ';stroke:' + ACC + '" fill-opacity="0.3" stroke-width="2" stroke-linejoin="round"/>';
      if (a && times.length > 1) {
        if (a.pairText) {
          var b1 = px(times[0]) - 3, b2 = px(times[1]) + wSp + 3, by = yPair;
          s += '<path d="M' + n1(b1) + ' ' + (by + 10) + 'V' + by + 'H' + n1(b2) + 'V' + (by + 10) + '" fill="none" stroke="' + INK + '" stroke-width="2"/>';
          var lw = tw(a.pairText, 15, true), right = b2 + 8 + lw < W - 8;
          s += text(right ? b2 + 8 : (b1 + b2) / 2, right ? by + 5 : by - 6, a.pairText, { size: 15, bold: true, anchor: right ? 'start' : 'middle' });
        }
        if (a.period > 0) { var pe = px(times[0] + a.period); s += dimH(px(times[0]), Math.min(pe, W - R), yPer, a.periodText || ('Periodo ' + fmt(a.period) + ' ms'), { extTo: top + 10, clip: pe > W - R + 0.5 }); }
      }
    }
    s += note(h, o.note);
    put(el, s);
  }

  /* ---------- envelope: interferencial (portadoras, suma y envolvente) ---------- */
  function envelope(el, f1, f2, windowMs, o) {
    o = o || {};
    var dep = o.depth === undefined ? 1 : o.depth, beat = Math.abs(f1 - f2), sec = windowMs / 1000, carriers = !!o.carriers, i, N;
    var aTop = 0, aBot = 0, h, bTitle, bTop, yB;
    if (carriers) { aTop = 74; aBot = 168; bTitle = 266; bTop = 300; h = 530; }
    else { bTitle = 0; bTop = 78; h = 300; }
    yB = h - 52;
    var s = open(o.title, h), col2 = '#A9480A';
    if (carriers) {
      /* A · acercamiento a las dos corrientes de mediana frecuencia */
      var zMs = 1.25, zA = (aBot - aTop) / 2 - 4, zMid = (aTop + aBot) / 2, yA = aBot + 8;
      s += text(L, 54, 'A · Acercamiento (' + fmt(zMs) + ' ms): las dos corrientes que se cruzan', { size: 15, bold: true, halo: false });
      s += ln(L, zMid, W - R, zMid, '#b9aa9a', 1, ' stroke-dasharray="5 4"');
      [[f1, 'stroke:' + ACC, ''], [f2, 'stroke:' + col2, ' stroke-dasharray="7 4"']].forEach(function (c) {
        var d = '';
        N = 320;
        for (i = 0; i <= N; i++) {
          var t = zMs / 1000 * i / N, x = L + i / N * (W - L - R);
          d += (i ? 'L' : 'M') + n1(x) + ' ' + n1(zMid - Math.sin(2 * Math.PI * c[0] * t) * zA);
        }
        s += '<path d="' + d + '" fill="none" style="' + c[1] + '" stroke-width="2.5"' + c[2] + '/>';
      });
      s += timeAxis(zMs, 'ms', yA, aTop, 0) + ln(L, aTop - 4, L, yA, AXIS, 2);
      /* leyenda de las portadoras */
      var lg = 'Corriente 1 · ' + f1 + ' Hz', lg2 = 'Corriente 2 · ' + f2 + ' Hz', lx2 = L + 60 + tw(lg, 15, true);
      s += ln(L + 10, yA + 44, L + 40, yA + 44, ACC, 3).replace('stroke="' + ACC + '"', 'style="stroke:' + ACC + '"') + text(L + 46, yA + 49, lg, { size: 15, bold: true, halo: false });
      s += ln(lx2, yA + 44, lx2 + 30, yA + 44, col2, 3, ' stroke-dasharray="7 4"') + text(lx2 + 36, yA + 49, lg2, { size: 15, bold: true, fill: col2, halo: false });
      s += ln(24, bTitle - 24, W - 24, bTitle - 24, FRAME, 2);
      s += text(L, bTitle, 'B · Resultado: corriente modulada en amplitud (' + fmt(windowMs) + ' ms)', { size: 15, bold: true, halo: false });
    }
    /* B · envolvente (y portadora real dentro si es visible a esta escala) */
    var yCota = bTop + 4, eTop = bTop + (beat > 0 ? 36 : 22), mid = (eTop + yB - 6) / 2, amp = (yB - 6 - eTop) / 2;
    function env(t) { return (1 - dep) + dep * Math.abs(Math.cos(Math.PI * (f1 - f2) * t)); }
    var top = '', bot = '';
    N = 400;
    for (i = 0; i <= N; i++) {
      var t = sec * i / N, e = env(t), x = L + i / N * (W - L - R);
      top += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + (mid - e * amp).toFixed(1);
      bot = 'L' + x.toFixed(1) + ' ' + (mid + e * amp).toFixed(1) + bot;
    }
    s += timeAxis(windowMs, o.unit || 'ms', yB, eTop - 4, h) + yAxis(eTop, yB);
    s += '<path d="' + top + bot + 'Z" style="fill:' + ACC + '" fill-opacity="0.14" stroke="none"/>';
    var fc = (f1 + f2) / 2, cycles = fc * sec;
    if (cycles <= 320) {
      var d = '', M = Math.max(600, Math.round(cycles * 10));
      for (i = 0; i <= M; i++) {
        var tt = sec * i / M, xx = L + i / M * (W - L - R);
        d += (i ? 'L' : 'M') + xx.toFixed(1) + ' ' + (mid - Math.sin(2 * Math.PI * fc * tt) * env(tt) * amp).toFixed(1);
      }
      s += '<path d="' + d + '" fill="none" style="stroke:' + ACC + '" stroke-width="1" opacity="0.55"/>';
    }
    s += '<path d="' + top + '" fill="none" style="stroke:' + ACC + '" stroke-width="3"/>';
    s += '<path d="' + bot.replace(/^L/, 'M') + '" fill="none" style="stroke:' + ACC + '" stroke-width="3" opacity="0.6"/>';
    s += ln(L, mid, W - R, mid, '#b9aa9a', 1, ' stroke-dasharray="5 4"');
    if (beat > 0) {
      var perMs = 1000 / beat, t1 = perMs / 2, t2 = t1 + perMs;
      if (t2 <= windowMs) {
        var x1 = L + t1 / windowMs * (W - L - R), x2 = L + t2 / windowMs * (W - L - R);
        s += dimH(x1, x2, yCota, 'Periodo del batido = 1 ÷ AMF = ' + fmt(perMs) + ' ms', { extTo: mid - (1 - dep) * amp });
      }
    } else {
      s += text(W / 2, bTop + 2, 'Sin batido: la amplitud no cambia', { size: 15, bold: true, anchor: 'middle', fill: MUTED });
    }
    var nt = [o.note, cycles > 320 ? 'La portadora es demasiado rápida para verse a esta escala: se dibuja solo la envolvente' : ''].filter(Boolean).join(' · ');
    if (nt) s += text(L, h - 10, nt.length > 70 ? 'Portadora no visible a esta escala: solo envolvente' : nt, { size: 14, italic: true, fill: MUTED, halo: false });
    put(el, s);
  }

  return { line: line, bands: bands, peaks: peaks, envelope: envelope };
})();
