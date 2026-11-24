/* Esquemas animados de magnetoterapia: corte del miembro (campo y sonda), tejidos, formas de onda y barrido.
   Modelo didáctico: el movimiento está ralentizado para que se vea; no es una medida real.
   Interfaz: MagnetoAnim.setMode, .mode, .scheme, .tissue, .wave, .sweep, .stopAll. */
var MagnetoAnim = (function () {
  'use strict';
  var K = LabKit, U = K.ui, M = MagnetoCore, NS = 'http://www.w3.org/2000/svg';
  var VIO = '#5B3A8C', NAR = '#C77700', NAR_D = '#8A4F00', INK = '#2B1B10', MUTED = '#4a3a2e', LINE = '#6b5848';
  var COL = { piel: '#E8B58F', grasa: '#F6E3A1', musculo: '#D98A7E', hueso: '#EDE6D6' };
  var SPEEDS = [0.25, 0.5, 1, 2];
  var SHAPES = ['sinusoidal', 'rectangular', 'tres-cuartos'];
  var seq = 0, live = [];
  var api = { mode: 'proyeccion' };

  var CSS =
    '.mga{width:100%;max-width:100%;min-width:0}' +
    '.mga-stage svg{display:block;width:100%;height:auto;max-width:100%}' +
    '.mga-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:8px}' +
    '.mga-play{font:inherit;font-size:20px;font-weight:bold;min-height:48px;min-width:160px;padding:8px 20px;border:0;border-radius:12px;background:' + VIO + ';color:#fff;cursor:pointer}' +
    '.mga-play:focus-visible,.mga-speed button:focus-visible{outline:3px solid ' + NAR + ';outline-offset:2px}' +
    '.mga-lbl{font-size:16px;font-weight:bold;color:' + VIO + '}' +
    '.mga-speed{display:inline-flex;border:2px solid ' + VIO + ';border-radius:10px;overflow:hidden}' +
    '.mga-speed button{font:inherit;font-size:18px;min-height:44px;min-width:56px;padding:4px 10px;border:0;background:#fff;color:' + VIO + ';cursor:pointer}' +
    '.mga-speed button+button{border-left:2px solid ' + VIO + '}' +
    '.mga-speed button[aria-pressed="true"]{background:' + VIO + ';color:#fff;font-weight:bold}' +
    '.mga-hint{font-size:16px;color:' + MUTED + '}' +
    '.mga-tag{margin-left:auto;font-size:16px;font-weight:bold;color:' + VIO + ';border:2px dashed ' + VIO + ';border-radius:999px;padding:2px 12px;white-space:nowrap}' +
    '.mga-probe{outline:none}.mga-probe:focus .mga-ring{stroke:' + INK + ';stroke-width:5}' +
    '.mga-vig{outline:none}.mga-vig:focus-visible .mga-vfoc{stroke:' + INK + ';stroke-width:6}';

  /* ---------- ayudantes ---------- */
  function num(v, d) { if (typeof v === 'string' && v.trim() !== '') v = +v; return typeof v === 'number' && isFinite(v) ? v : d; }
  function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }
  function gClamp(g) { return clamp(num(g, 0), 0, M.DEVICE.gaussAbsMax); }
  function hzClamp(h) { return clamp(num(h, M.DEVICE.hzMin), M.DEVICE.hzMin, M.DEVICE.hzMax); }
  function ease(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
  function fxHz(h) { return K.fx(h, h % 1 ? 1 : 0); }
  function n1(v) { return (+v).toFixed(1); }
  function n2(v) { return (+v).toFixed(2); }
  function reduced() {
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  }
  function uid(k) { seq++; return 'mga' + k + seq; }
  function mk(tag, at, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in at) if (Object.prototype.hasOwnProperty.call(at, k)) e.setAttribute(k, at[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function grp(parent, inner) { var g = mk('g', {}, parent); g.innerHTML = inner; return g; }
  function T(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" font-size="' + (o.fs || 16) + '"' + (o.a ? ' text-anchor="' + o.a + '"' : '') + (o.b ? ' font-weight="bold"' : '') +
      (o.r ? ' data-r="' + o.r + '"' : '') + ' fill="' + (o.c || INK) + '">' + s + '</text>';
  }
  function q(root, r) { return root.querySelector('[data-r="' + r + '"]'); }
  function qa(root, r) { return [].slice.call(root.querySelectorAll('[data-r="' + r + '"]')); }
  function speedTxt(s) { return String(s).replace('.', ',') + '×'; }
  function translate(e, x, y) { e.setAttribute('transform', 'translate(' + n1(x) + ' ' + n1(y) + ')'); }

  /* ---------- controlador común: un requestAnimationFrame por pieza ---------- */
  function makePiece(el, h) {
    el.innerHTML = '';
    var wrap = document.createElement('div'); wrap.className = 'mga';
    wrap.innerHTML = '<style>' + CSS + '</style>';
    var stage = U.el('div', 'mga-stage'), bar = U.el('div', 'mga-bar');
    wrap.appendChild(stage); wrap.appendChild(bar); el.appendChild(wrap);
    var p = { stage: stage, bar: bar, playing: !reduced(), speed: 1, raf: 0, last: 0, dead: false, seen: wrap.isConnected !== false, btn: null };

    function frame(now) {
      p.raf = 0;
      if (p.dead) return;
      if (wrap.isConnected === false) { if (p.seen) p.destroy(); return; } /* sacado del DOM: no deja bucles huérfanos */
      p.seen = true;
      /* pestaña oculta (display:none): no se calcula ni se dibuja nada */
      if (wrap.getClientRects().length === 0) { p.last = 0; if (p.playing) p.raf = requestAnimationFrame(frame); return; }
      var dt = p.last ? clamp(now - p.last, 0, 100) : 0;
      p.last = now;
      h.tick(dt * p.speed);
      h.render();
      if (p.playing) p.raf = requestAnimationFrame(frame);
    }
    function syncBtn() {
      if (!p.btn) return;
      p.btn.textContent = p.playing ? '❚❚  Pausar' : '▶︎  Reproducir';
      p.btn.setAttribute('aria-label', p.playing ? 'Pausar la animación' : 'Reproducir la animación');
    }
    p.play = function () {
      if (p.dead) return;
      p.playing = true; p.last = 0;
      if (!p.raf) p.raf = requestAnimationFrame(frame);
      syncBtn();
    };
    p.pause = function () {
      p.playing = false;
      if (p.raf) cancelAnimationFrame(p.raf);
      p.raf = 0; syncBtn();
    };
    p.redraw = function () { if (!p.dead) h.render(); };
    p.controls = function () {
      if (p.dead) return;
      var expl = api.mode === 'exploracion';
      if (!expl) p.speed = 1;
      bar.innerHTML = '';
      var b = U.el('button', 'mga-play'); b.type = 'button';
      b.addEventListener('click', function () { if (p.playing) p.pause(); else p.play(); });
      bar.appendChild(b); p.btn = b;
      if (expl) {
        bar.appendChild(U.el('span', 'mga-lbl', 'Velocidad'));
        var g = U.el('div', 'mga-speed'); g.setAttribute('role', 'group'); g.setAttribute('aria-label', 'Velocidad de la animación');
        SPEEDS.forEach(function (s) {
          var sb = U.el('button', '', speedTxt(s)); sb.type = 'button';
          sb.setAttribute('aria-pressed', String(s === p.speed));
          sb.addEventListener('click', function () {
            p.speed = s;
            [].forEach.call(g.children, function (x) { x.setAttribute('aria-pressed', String(x === sb)); });
          });
          g.appendChild(sb);
        });
        bar.appendChild(g);
        if (h.hint) bar.appendChild(U.el('span', 'mga-hint', h.hint));
      }
      bar.appendChild(U.el('span', 'mga-tag', 'Esquema didáctico'));
      syncBtn();
      if (h.onMode) h.onMode(api.mode);
    };
    p.start = function () {
      p.controls();
      p.redraw(); /* primer cuadro correcto, también en pausa */
      if (p.playing) { p.playing = false; p.play(); } else syncBtn();
    };
    p.destroy = function () {
      if (p.dead) return;
      p.dead = true;
      if (p.raf) cancelAnimationFrame(p.raf);
      p.raf = 0;
      if (h.destroy) h.destroy();
      var i = live.indexOf(p); if (i > -1) live.splice(i, 1);
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    };
    live.push(p);
    return p;
  }

  /* =====================================================================
     1. Corte del miembro con el aplicador: campo que fluye de S a N y sonda.
     ===================================================================== */
  function scheme(el, o) {
    o = o || {};
    var apl = o.applicator === 'plano' ? 'plano' : 'solenoide', sol = apl === 'solenoide';
    var g = gClamp(o.gauss === undefined ? 60 : o.gauss), hz = hzClamp(o.hz === undefined ? 30 : o.hz);
    var X0 = 96, X1 = 372, Y0 = 78, PX = 18, BONE = 7, DMAX = M.DEVICE.penetrationCm[1], YB = Y0 + DMAX * PX, cx = (X0 + X1) / 2;
    var MX = 452, MW = 88, NL = 7, NCH = 3, LX0 = X0 + 12, LX1 = X1 - 14;
    var ARCS = [1.5, 3, 4.6, 6.5, 8.8, 11.5, 14.4];
    var id = uid('s'), phase = 0, depth = BONE, drag = null, interactive = false, chOp = 1, chSc = 1, R = {};
    var p = makePiece(el, { tick: tick, render: render, onMode: onMode, hint: 'Arrastre la sonda naranja o use las flechas ↑ ↓' });

    function lineY(i) { return Y0 + PX + i * 2.1 * PX; }
    function build() {
      var mkr = id + '-arr', clip = id + '-clip', s = '', i, y;
      s += '<svg viewBox="0 0 600 456" role="group" data-r="svg">';
      s += '<defs><marker id="' + mkr + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10z" fill="' + VIO + '"/></marker>' +
        '<clipPath id="' + clip + '"><rect x="' + X0 + '" y="' + Y0 + '" width="' + (X1 - X0) + '" height="' + (DMAX * PX) + '"/></clipPath></defs>';
      /* capas del corte (0 a 15 cm) */
      M.LAYERS.forEach(function (L) {
        var y1 = Y0 + L.from * PX, h = (L.to - L.from) * PX;
        s += '<rect x="' + X0 + '" y="' + y1 + '" width="' + (X1 - X0) + '" height="' + h + '" fill="' + COL[L.id] + '"/>';
        s += T(X0 - 8, L.id === 'piel' ? y1 + 11 : (L.id === 'grasa' ? y1 + 30 : y1 + h / 2 + 6), L.nombre, { a: 'end', fs: 16, b: L.id === 'hueso' });
      });
      s += '<rect x="' + X0 + '" y="' + (Y0 + 6 * PX) + '" width="' + (X1 - X0) + '" height="' + (2 * PX) + '" fill="none" stroke="' + NAR + '" stroke-width="3" stroke-dasharray="8 5"/>';
      s += '<rect x="' + X0 + '" y="' + Y0 + '" width="' + (X1 - X0) + '" height="' + (DMAX * PX) + '" fill="none" stroke="' + LINE + '" stroke-width="2"/>';
      s += '<rect data-r="slice" x="' + X0 + '" y="' + Y0 + '" width="' + (X1 - X0) + '" height="' + (DMAX * PX) + '" fill="transparent"/>';
      if (sol) {
        /* bobina en corte: espiras arriba (salen) y abajo (entran) */
        [[Y0 - 30, 'o'], [YB + 6, 'x']].forEach(function (r) {
          s += '<rect x="' + (X0 - 4) + '" y="' + r[0] + '" width="' + (X1 - X0 + 8) + '" height="24" rx="12" fill="#E9E1F3" stroke="' + VIO + '" stroke-width="2"/>';
          for (i = 0; i < 10; i++) {
            var wx = X0 + 14 + i * ((X1 - X0 - 28) / 9), wy = r[0] + 12;
            s += '<circle cx="' + wx + '" cy="' + wy + '" r="8" fill="#fff" stroke="' + VIO + '" stroke-width="2.5"/>' +
              (r[1] === 'o' ? '<circle cx="' + wx + '" cy="' + wy + '" r="2.6" fill="' + VIO + '"/>' : '<path d="M' + (wx - 4) + ' ' + (wy - 4) + 'L' + (wx + 4) + ' ' + (wy + 4) + 'M' + (wx + 4) + ' ' + (wy - 4) + 'L' + (wx - 4) + ' ' + (wy + 4) + '" stroke="' + VIO + '" stroke-width="2.2"/>');
          }
        });
        s += T(X0 - 4, Y0 - 40, 'Bobina alrededor de la zona (espiras en corte)', { fs: 16, b: true, c: VIO });
        s += '<g pointer-events="none">';
        for (i = 0; i < NL; i++) {
          y = lineY(i);
          s += '<line data-r="fl" x1="' + LX0 + '" y1="' + y + '" x2="' + LX1 + '" y2="' + y + '" stroke="' + VIO + '" stroke-width="3.5" marker-end="url(#' + mkr + ')"/>';
          for (var c = 0; c < NCH; c++) s += '<path data-r="ch" d="M-7 -7L7 0L-7 7z" fill="' + VIO + '"/>';
        }
        s += '</g>';
        [[X0 - 22, 'S'], [X1 + 22, 'N']].forEach(function (q2) {
          s += '<circle cx="' + q2[0] + '" cy="' + (Y0 - 18) + '" r="14" fill="' + VIO + '"/>' + T(q2[0], Y0 - 12, q2[1], { a: 'middle', fs: 17, b: true, c: '#fff' });
        });
      } else {
        /* placa sobre la piel con sus polos; arcos que salen de S y vuelven por N */
        s += '<rect x="' + (cx - 128) + '" y="' + (Y0 - 30) + '" width="256" height="28" rx="6" fill="' + VIO + '"/>' + T(cx, Y0 - 10, 'placa sobre la piel', { a: 'middle', fs: 16, b: true, c: '#fff' });
        [[cx - 112, 'S'], [cx + 112, 'N']].forEach(function (q2) {
          s += '<circle cx="' + q2[0] + '" cy="' + (Y0 - 16) + '" r="11" fill="#fff"/>' + T(q2[0], Y0 - 10, q2[1], { a: 'middle', fs: 16, b: true, c: VIO });
        });
        s += T(X0 - 4, Y0 - 40, 'Placa apoyada en la piel', { fs: 16, b: true, c: VIO });
        s += '<g clip-path="url(#' + clip + ')" pointer-events="none">';
        ARCS.forEach(function (d, k) {
          var a = 22 + k * 17, ry = d * PX;
          s += '<path data-r="arc" d="M' + (cx - a) + ' ' + Y0 + 'A' + a + ' ' + ry + ' 0 0 0 ' + (cx + a) + ' ' + Y0 + '" fill="none" stroke="' + VIO + '" stroke-linecap="round" stroke-dasharray="16 10"/>';
        });
        s += '</g>';
        s += '<line x1="' + X0 + '" y1="' + YB + '" x2="' + X1 + '" y2="' + YB + '" stroke="' + INK + '" stroke-width="3" stroke-dasharray="10 6"/>';
        s += T(cx, YB + 24, 'A 15 cm ya no llega campo (0 G)', { a: 'middle', fs: 16, b: true });
      }
      s += T(cx, YB + 52, '', { a: 'middle', fs: 16, b: true, c: VIO, r: 'cap' });
      /* medidor: gauss que llegan a cada cm (escala fija de 0 a 200 G) */
      s += T(MX + MW / 2, Y0 - 40, 'Llega', { a: 'middle', fs: 16, b: true });
      s += T(MX + MW / 2, Y0 - 20, '(G por cm)', { a: 'middle', fs: 16, c: MUTED });
      s += '<line x1="' + (MX - 1) + '" y1="' + (Y0 - 8) + '" x2="' + (MX - 1) + '" y2="' + (YB + 8) + '" stroke="' + LINE + '" stroke-width="1.5"/>';
      for (i = 0; i <= DMAX; i++) {
        var yy = Y0 + i * PX, bone = i === BONE;
        s += '<rect data-r="bar" x="' + MX + '" y="' + (yy - 6) + '" width="0" height="12" fill="' + (bone ? NAR : VIO) + '"' + (bone ? ' stroke="' + INK + '" stroke-width="1.5"' : '') + '/>';
        if (i === 0 || i === BONE || i === DMAX) {
          s += T(MX - 20, yy + 5, i + ' cm', { a: 'end', fs: 16, b: bone });
          s += T(MX + 6, yy + 5, '', { fs: 16, b: true, c: bone ? NAR_D : INK, r: 'bl' + i });
        }
      }
      s += '<line x1="' + X1 + '" y1="' + (Y0 + BONE * PX) + '" x2="' + (MX - 60) + '" y2="' + (Y0 + BONE * PX) + '" stroke="' + NAR + '" stroke-width="2.5" stroke-dasharray="5 4"/>';
      s += '<rect x="' + (X0 + 2) + '" y="' + (YB + 66) + '" width="' + (MX + MW - X0 + 40) + '" height="34" rx="8" fill="#FFF1D6" stroke="' + NAR + '" stroke-width="2.5"/>';
      s += T((X0 + MX + MW + 42) / 2, YB + 89, '', { a: 'middle', fs: 17, b: true, r: 'sign' });
      /* sonda: línea a la profundidad elegida, asa a la derecha y lectura */
      s += '<g class="mga-probe" data-r="probe" aria-orientation="vertical" aria-valuemin="0" aria-valuemax="' + DMAX + '" aria-label="Sonda: profundidad en el corte">';
      s += '<rect data-r="hit" x="' + X0 + '" y="-40" width="' + (X1 - X0 + 6) + '" height="80" fill="transparent"/>';
      s += '<line x1="' + X0 + '" y1="0" x2="' + X1 + '" y2="0" stroke="' + NAR + '" stroke-width="4" stroke-dasharray="12 6" pointer-events="none"/>';
      s += '<line x1="' + X1 + '" y1="0" x2="' + (MX - 16) + '" y2="0" stroke="' + NAR + '" stroke-width="2" stroke-dasharray="3 4" pointer-events="none"/>';
      s += '<path d="M' + (MX - 16) + ' -7L' + (MX - 4) + ' 0L' + (MX - 16) + ' 7z" fill="' + NAR + '" stroke="' + INK + '" stroke-width="1"/>';
      s += '<circle class="mga-ring" cx="' + (X1 - 18) + '" cy="0" r="21" fill="' + NAR + '" stroke="#fff" stroke-width="3"/>';
      s += '<path d="M' + (X1 - 18) + ' -9L' + (X1 - 13) + ' -3H' + (X1 - 23) + 'z M' + (X1 - 18) + ' 9L' + (X1 - 13) + ' 3H' + (X1 - 23) + 'z" fill="#fff" pointer-events="none"/>';
      s += '<g data-r="ptag" pointer-events="none"><rect x="' + (cx - 118) + '" y="-36" width="236" height="27" rx="7" fill="#fff" fill-opacity="0.94" stroke="' + NAR + '" stroke-width="2.5"/>' +
        T(cx, -16, '', { a: 'middle', fs: 17, b: true, r: 'ptxt' }) + '</g>';
      s += '</g></svg>';
      p.stage.innerHTML = s;
      R.svg = q(p.stage, 'svg'); R.slice = q(p.stage, 'slice'); R.probe = q(p.stage, 'probe'); R.hit = q(p.stage, 'hit');
      R.ptag = q(p.stage, 'ptag'); R.ptxt = q(p.stage, 'ptxt'); R.cap = q(p.stage, 'cap'); R.sign = q(p.stage, 'sign');
      R.fl = qa(p.stage, 'fl'); R.ch = qa(p.stage, 'ch'); R.arc = qa(p.stage, 'arc'); R.bar = qa(p.stage, 'bar');
      R.bl = [0, BONE, DMAX].map(function (i) { return { i: i, el: q(p.stage, 'bl' + i) }; });
      wire();
    }

    function yToDepth(clientY) {
      var m = R.svg.getScreenCTM && R.svg.getScreenCTM();
      if (!m) return depth;
      var pt = R.svg.createSVGPoint(); pt.x = 0; pt.y = clientY;
      var y = pt.matrixTransform(m.inverse()).y;
      return Math.round(clamp((y - Y0) / PX, 0, DMAX) * 10) / 10;
    }
    function wire() {
      R.svg.addEventListener('pointerdown', function (e) {
        if (!interactive || (e.button !== undefined && e.button > 0)) return;
        var onProbe = R.probe.contains(e.target);
        if (!onProbe && e.target !== R.slice) return;
        drag = e.pointerId;
        try { R.svg.setPointerCapture(e.pointerId); } catch (x) { /* sin captura */ }
        setDepth(yToDepth(e.clientY));
        if (onProbe) e.preventDefault();
        if (R.probe.focus) { try { R.probe.focus({ preventScroll: true }); } catch (x2) { R.probe.focus(); } }
      });
      R.svg.addEventListener('pointermove', function (e) {
        if (drag === null || drag !== e.pointerId) return;
        setDepth(yToDepth(e.clientY)); e.preventDefault();
      });
      /* Chrome no aplica touch-action a los hijos de un SVG: se frena el desplazamiento solo si el dedo empieza sobre la sonda. */
      R.svg.addEventListener('touchstart', function (e) {
        if (interactive && R.probe.contains(e.target) && e.cancelable) e.preventDefault();
      }, { passive: false });
      function end(e) { if (drag === e.pointerId) drag = null; }
      R.svg.addEventListener('pointerup', end);
      R.svg.addEventListener('pointercancel', end);
      R.probe.addEventListener('keydown', function (e) {
        if (!interactive) return;
        var d = { ArrowUp: -0.5, ArrowLeft: -0.5, ArrowDown: 0.5, ArrowRight: 0.5, PageUp: -2, PageDown: 2 }[e.key];
        if (e.key === 'Home') setDepth(0); else if (e.key === 'End') setDepth(DMAX);
        else if (d !== undefined) setDepth(Math.round((depth + d) * 2) / 2);
        else return;
        e.preventDefault();
      });
    }
    function setDepth(d) { depth = clamp(num(d, BONE), 0, DMAX); probe(); aria(); }
    function probe() {
      var gi = M.fieldAtDepth(apl, depth, g), txt = K.fx(depth, 1) + ' cm · ' + M.layerAt(depth).nombre + ' · ' + K.fx(gi, 0) + ' G';
      translate(R.probe, 0, Y0 + depth * PX);
      translate(R.ptag, 0, depth < 2 ? 46 : 0);
      R.ptxt.textContent = txt;
      R.probe.setAttribute('aria-valuenow', n1(depth));
      R.probe.setAttribute('aria-valuetext', txt);
    }
    function aria() {
      var gBone = M.fieldAtDepth(apl, BONE, g), gp = M.fieldAtDepth(apl, depth, g);
      R.svg.setAttribute('aria-label', (sol
        ? 'Solenoide: la zona está dentro de la bobina; el campo fluye de S a N en líneas paralelas y llega parejo a todas las capas.'
        : 'Aplicador plano: la placa se apoya en la piel; el campo sale en arcos de S a N que se debilitan al profundizar; a 15 cm ya no llega.') +
        ' Intensidad en la piel: ' + K.fx(g, 0) + ' G. Frecuencia: ' + fxHz(hz) + ' Hz. Al hueso, a 7 cm, llegan ' + K.fx(gBone, 0) + ' G.' +
        ' Sonda a ' + K.fx(depth, 1) + ' cm (' + M.layerAt(depth).nombre.toLowerCase() + '): ' + K.fx(gp, 0) + ' G.');
    }
    /* Lo que depende de gauss y Hz (no cambia en cada cuadro). */
    function style() {
      var v = Math.sqrt(M.fieldStrength(g)), i;
      if (sol) {
        var sw = 1.5 + 4.5 * v;
        chOp = 0.15 + 0.85 * v; chSc = 0.7 + 0.5 * v;
        R.fl.forEach(function (l) { l.setAttribute('stroke-width', n2(sw)); l.setAttribute('stroke-opacity', n2(chOp)); });
      } else {
        R.arc.forEach(function (a, k) {
          var va = Math.sqrt(M.fieldStrength(M.fieldAtDepth('plano', ARCS[k], g)));
          a.setAttribute('stroke-width', n2(1.5 + 4.5 * va));
          a.setAttribute('stroke-opacity', n2(0.12 + 0.88 * va));
        });
      }
      for (i = 0; i <= DMAX; i++) R.bar[i].setAttribute('width', n1(M.fieldStrength(M.fieldAtDepth(apl, i, g)) * MW));
      R.bl.forEach(function (b) {
        var gi = M.fieldAtDepth(apl, b.i, g);
        b.el.setAttribute('x', n1(MX + M.fieldStrength(gi) * MW + 6));
        b.el.textContent = K.fx(gi, 0) + ' G';
      });
      R.cap.textContent = (sol ? 'Campo de S a N, parejo' : 'Arcos de S a N, más tenues al bajar') + ' · ' + K.fx(g, 0) + ' G · ' + fxHz(hz) + ' Hz' + (g === 0 ? ' (sin campo)' : '');
      R.sign.textContent = 'Al hueso (7 cm) llegan ' + K.fx(M.fieldAtDepth(apl, BONE, g), 0) + ' G de los ' + K.fx(g, 0) + ' G de la piel';
      probe(); aria();
    }
    function tick(dt) { phase = (phase + M.fieldPhase(dt, hz, 1)) % 1; }
    function render() {
      if (sol) {
        var L = LX1 - LX0 - 18;
        R.ch.forEach(function (c, j) {
          var i = Math.floor(j / NCH), f = (phase + (j % NCH) / NCH) % 1;
          c.setAttribute('transform', 'translate(' + n1(LX0 + 6 + f * L) + ' ' + n1(lineY(i)) + ') scale(' + n2(chSc) + ')');
          c.setAttribute('opacity', n2(chOp * Math.min(1, f * 6, (1 - f) * 6)));
        });
      } else {
        var off = n1(-phase * 26);
        R.arc.forEach(function (a) { a.setAttribute('stroke-dashoffset', off); });
      }
    }
    function onMode(m) {
      interactive = m === 'exploracion';
      if (interactive) {
        R.probe.setAttribute('tabindex', '0'); R.probe.setAttribute('role', 'slider'); R.probe.removeAttribute('aria-disabled');
        R.probe.style.cursor = 'grab'; R.probe.style.touchAction = 'none'; R.slice.style.cursor = 'crosshair';
      } else {
        R.probe.removeAttribute('tabindex'); R.probe.removeAttribute('role'); R.probe.setAttribute('aria-disabled', 'true');
        R.probe.style.cursor = ''; R.probe.style.touchAction = ''; R.slice.style.cursor = '';
        drag = null;
      }
    }

    build(); style(); p.start();
    return {
      update: function (u) {
        if (p.dead || !u) return;
        if (u.gauss !== undefined) g = gClamp(u.gauss);
        if (u.hz !== undefined) hz = hzClamp(u.hz);
        style(); p.redraw();
      },
      destroy: p.destroy
    };
  }

  /* =====================================================================
     2. Seis viñetas de tejidos; el seleccionado se anima paso a paso.
     ===================================================================== */
  var VW = 222, VH = 214, VD = 170, GX = 6, GAP = 6, GY = 56, STEP = 2600, HOLD = 1800;
  var SHORT = { hueso: 'Hueso', membrana: 'Membrana y edema', conectivo: 'Tendón, ligamento, piel', musculo: 'Músculo', vasos: 'Vasos sanguíneos', nervio: 'Nervio y dolor' };
  function tx(x, y, s, fs, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" font-size="' + fs + '" text-anchor="' + (o.a || 'middle') + '"' + (o.b ? ' font-weight="bold"' : '') + ' fill="' + (o.c || INK) + '">' + s + '</text>';
  }
  function tag(x, y, s, w) {
    return '<rect x="' + (x - w / 2) + '" y="' + (y - 15) + '" width="' + w + '" height="21" rx="5" fill="#fff" fill-opacity="0.92" stroke="' + LINE + '" stroke-width="1"/>' + tx(x, y, s, 15, { b: true });
  }
  function ion(x, y, s, fill) {
    return '<rect x="' + (x - 21) + '" y="' + (y - 13) + '" width="42" height="26" rx="13" fill="' + fill + '" stroke="' + INK + '" stroke-width="1.5"/>' + tx(x, y + 5, s, 15, { b: true, c: fill === '#fff' ? INK : '#fff' });
  }
  function drop(x, y) {
    return '<path d="M' + x + ' ' + (y - 14) + ' Q' + (x + 10) + ' ' + (y + 1) + ' ' + x + ' ' + (y + 8) + ' Q' + (x - 10) + ' ' + (y + 1) + ' ' + x + ' ' + (y - 14) + 'z" fill="#2F7FC1" stroke="' + INK + '" stroke-width="1"/>';
  }
  function fiberPath(i) {
    var p = 'M0 ' + (18 + i * 22);
    for (var j = 0; j < 11; j++) p += ' q10 ' + (j % 2 ? 6 : -6) + ' 20 0';
    return p;
  }
  /* Dibujo de cada viñeta (copiado del esquema estático). a = true omite lo que luego se anima. m = id del marcador de flecha. */
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
    membrana: function (m, a) {
      var s = '<rect width="' + VW + '" height="' + VD + '" fill="#DCEBF5"/>';
      if (a) return s; /* el rótulo lo pone la animación, encima de la célula */
      s += '<ellipse cx="124" cy="86" rx="64" ry="54" fill="#FFE8D9" stroke="' + VIO + '" stroke-width="8"/><ellipse cx="124" cy="86" rx="64" ry="54" fill="none" stroke="#fff" stroke-width="1.5"/>';
      s += ion(118, 70, 'K⁺', '#2E7D4F') + ion(148, 108, 'Ca²⁺', '#1F5F99');
      s += '<path d="M92 92 L44 112" stroke="' + INK + '" stroke-width="3" marker-end="url(#' + m + ')"/><path d="M96 60 L44 40" stroke="' + INK + '" stroke-width="3" marker-end="url(#' + m + ')"/>';
      s += ion(26, 34, 'Na⁺', '#C77700') + ion(26, 118, 'Na⁺', '#C77700');
      [[206, 30], [210, 74], [206, 118]].forEach(function (d) { s += drop(d[0], d[1]); });
      return s + tag(111, 160, 'sale Na⁺: menos edema', 176);
    },
    conectivo: function (m, a) {
      var s = '<rect width="' + VW + '" height="' + VD + '" fill="#F5EFE3"/>', i;
      if (!a) {
        for (i = 0; i < 6; i++) s += '<path d="' + fiberPath(i) + '" fill="none" stroke="#C9A66B" stroke-width="6" stroke-linecap="round"/>';
        [[52, 40], [150, 62], [92, 106]].forEach(function (c) { s += '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="24" ry="7" fill="#7A4E9C" stroke="' + INK + '" stroke-width="1"/><ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="6" ry="4" fill="#E9D8F5"/>'; });
      }
      return s + tag(64, 156, 'colágeno', 96) + tag(166, 156, 'fibroblasto', 104);
    },
    musculo: function (m, a) {
      var s = '<rect width="' + VW + '" height="' + VD + '" fill="#F4D3CC"/>', i, x;
      if (!a) {
        for (i = 0; i < 4; i++) {
          var y = 10 + i * 34;
          s += '<rect x="4" y="' + y + '" width="214" height="28" rx="14" fill="#D98A7E" stroke="#8E3B30" stroke-width="1.5"/>';
          for (x = 16; x < 210; x += 7) s += '<line x1="' + x + '" y1="' + (y + 4) + '" x2="' + x + '" y2="' + (y + 24) + '" stroke="#8E3B30" stroke-width="1.4"/>';
          s += '<ellipse cx="' + (40 + i * 44) + '" cy="' + (y + 5) + '" rx="8" ry="3" fill="#4A1E18"/>';
        }
      }
      return s + tag(111, 160, 'fibras musculares', 150);
    },
    vasos: function (m, a) {
      var s = '<rect width="' + VW + '" height="' + VD + '" fill="#FBEDEA"/>';
      if (!a) {
        s += '<rect x="-10" y="34" width="242" height="88" rx="10" fill="#F6C3BD" stroke="#8E1B16" stroke-width="9"/>';
        [[24, 62], [62, 92], [98, 58], [132, 96], [168, 64], [200, 94], [80, 76], [150, 80]].forEach(function (c) {
          s += '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="13" ry="8" fill="#C62828" stroke="#6E0F0B" stroke-width="1"/><ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="5" ry="3" fill="#E57373"/>';
        });
        s += '<path d="M150 22 H200" stroke="' + INK + '" stroke-width="3" marker-end="url(#' + m + ')"/>' + tx(124, 27, 'flujo', 15, { b: true });
      } else {
        s += '<path d="M150 12 H200" stroke="' + INK + '" stroke-width="3" marker-end="url(#' + m + ')"/>' + tx(124, 17, 'flujo', 15, { b: true });
      }
      return s + tag(111, 156, 'glóbulos rojos', 130);
    },
    nervio: function (m, a) {
      var s = '<rect width="' + VW + '" height="' + VD + '" fill="#FFF8E1"/>', i;
      s += '<rect x="186" y="0" width="36" height="' + VD + '" fill="#E8B58F"/>' + '<text x="204" y="20" font-size="14" text-anchor="middle" fill="' + INK + '" font-weight="bold">piel</text>';
      if (!a) {
        s += '<line x1="0" y1="80" x2="150" y2="80" stroke="#7A5A00" stroke-width="3"/>';
        for (i = 0; i < 5; i++) s += '<rect x="' + (4 + i * 29) + '" y="70" width="24" height="20" rx="9" fill="#E0B400" stroke="#7A5A00" stroke-width="1.5"/>';
        [26, 19, 12].forEach(function (r) { s += '<ellipse cx="168" cy="80" rx="' + r + '" ry="' + (r * 0.7) + '" fill="#FFE27A" stroke="#7A5A00" stroke-width="2"/>'; });
        s += '<line x1="150" y1="80" x2="172" y2="80" stroke="#7A5A00" stroke-width="3"/>';
      }
      return s + tag(60, 124, 'nervio', 76) + tag(160, 132, 'receptor', 96);
    }
  };
  /* Animación del tejido seleccionado. Cada función crea sus piezas en g y devuelve f(t, P, dt):
     t = ms dentro del ciclo, P(k) = avance del paso k (0 antes, 1 después), dt = ms del cuadro. */
  var ANIM = {
    hueso: function (g) {
      var rings = [[58, 58], [158, 52]].map(function (o) {
        return mk('circle', { cx: o[0], cy: o[1], r: 44, fill: 'none', stroke: '#E0B400', 'stroke-width': 3.5, 'stroke-dasharray': '7 7', opacity: 0 }, g);
      });
      var mat = [], glow = [], i;
      for (i = 0; i < 7; i++) {
        mat.push(mk('rect', { x: 8 + i * 31, y: 104, width: 22, height: 0, rx: 4, fill: '#CDB78A', stroke: '#8B5E34', 'stroke-width': 1 }, g));
        glow.push(mk('rect', { x: 3 + i * 31, y: 103, width: 32, height: 26, rx: 9, fill: 'none', stroke: '#FFB300', 'stroke-width': 4, opacity: 0 }, g));
      }
      return function (t, P) {
        var e1 = ease(P(1)), e2 = ease(P(2)), e3 = ease(P(3));
        rings.forEach(function (r, k) { r.setAttribute('opacity', n2(0.95 * e1)); r.setAttribute('stroke-dashoffset', n1(-t / 40 + k * 5)); });
        glow.forEach(function (c, k) { c.setAttribute('opacity', n2(e2 * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t / 260 - k * 0.8))))); });
        mat.forEach(function (r, k) { var h = 14 * clamp(e3 * 1.4 - k * 0.06, 0, 1); r.setAttribute('height', n1(h)); r.setAttribute('y', n1(104 - h)); });
      };
    },
    membrana: function (g, m) {
      var cell = mk('ellipse', { cx: 124, cy: 86, rx: 72, ry: 62, fill: '#FFE8D9', stroke: VIO, 'stroke-width': 8 }, g);
      var cell2 = mk('ellipse', { cx: 124, cy: 86, rx: 72, ry: 62, fill: 'none', stroke: '#fff', 'stroke-width': 1.5 }, g);
      var arr = grp(g, '<path d="M92 92 L44 112" stroke="' + INK + '" stroke-width="3" marker-end="url(#' + m + ')"/><path d="M96 60 L44 40" stroke="' + INK + '" stroke-width="3" marker-end="url(#' + m + ')"/>');
      var kk = grp(g, ion(0, 0, 'K⁺', '#2E7D4F')), ca = grp(g, ion(0, 0, 'Ca²⁺', '#1F5F99'));
      var NA = [[[160, 66], [26, 34]], [[100, 104], [26, 118]]];
      var na = NA.map(function () { return grp(g, ion(0, 0, 'Na⁺', '#C77700')); });
      var DR = [[206, 30], [210, 74], [206, 118]];
      var dr = DR.map(function () { return grp(g, drop(0, 0)); });
      grp(g, tag(111, 160, 'sale Na⁺: menos edema', 176));
      return function (t, P) {
        var e1 = ease(P(1)), e2 = ease(P(2)), e3 = ease(P(3)), j = 2.5 * e1 * (1 - e2 * 0.6);
        [cell, cell2].forEach(function (c) { c.setAttribute('rx', n1(72 - 8 * e3)); c.setAttribute('ry', n1(62 - 8 * e3)); });
        arr.setAttribute('opacity', n2(e2));
        translate(kk, 118 + j * Math.sin(t / 90), 70 + j * Math.cos(t / 110));
        translate(ca, 148 + j * Math.cos(t / 100), 108 + j * Math.sin(t / 80));
        na.forEach(function (n, k) {
          var a = NA[k][0], b = NA[k][1], jj = 2.5 * e1 * (1 - e2);
          translate(n, a[0] + (b[0] - a[0]) * e2 + jj * Math.sin(t / 70 + k), a[1] + (b[1] - a[1]) * e2 + jj * Math.cos(t / 85 + k));
        });
        dr.forEach(function (d, k) {
          translate(d, 166 + (DR[k][0] - 166) * e3, DR[k][1]);
          d.setAttribute('opacity', n2(0.55 + 0.45 * e3));
        });
      };
    },
    conectivo: function (g) {
      var fib = [], fb = [], strands = [], i;
      var C = [[52, 40], [150, 62], [92, 106]];
      for (i = 0; i < 6; i++) fib.push(mk('path', { d: fiberPath(i), fill: 'none', stroke: '#C9A66B', 'stroke-width': 6, 'stroke-linecap': 'round' }, g));
      C.forEach(function (c) {
        fb.push(mk('ellipse', { cx: c[0], cy: c[1], rx: 31, ry: 13, fill: 'none', stroke: '#E0B400', 'stroke-width': 4, opacity: 0 }, g));
        grp(g, '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="24" ry="7" fill="#7A4E9C" stroke="' + INK + '" stroke-width="1"/><ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="6" ry="4" fill="#E9D8F5"/>');
        for (var k = 0; k < 2; k++) strands.push({ c: c, k: k, el: mk('line', { x1: 0, y1: 0, x2: 12, y2: 0, stroke: '#A77F3A', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0 }, g) });
      });
      return function (t, P) {
        var e1 = ease(P(1)), e2 = P(2), e3 = ease(P(3));
        fib.forEach(function (f, k) { var a = 30 + (k * 53) % 130, gap = 34 * (1 - e3); f.setAttribute('stroke-dasharray', a + ' ' + n1(gap) + ' 999'); });
        fb.forEach(function (e, k) { e.setAttribute('opacity', n2(e1 * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t / 240 + k))))); });
        strands.forEach(function (s, k) {
          var f = ((t / 1100) + k * 0.37) % 1, dir = s.k ? 1 : -1, x = s.c[0] + dir * (28 + 34 * f);
          s.el.setAttribute('transform', 'translate(' + n1(x - 6) + ' ' + s.c[1] + ')');
          s.el.setAttribute('opacity', n2((e2 > 0 ? ease(e2) : 0) * (1 - f) * (1 - 0.6 * e3)));
        });
      };
    },
    musculo: function (g) {
      var fibers = [], i;
      var nerve = mk('line', { x1: 0, y1: 5, x2: VW, y2: 5, stroke: '#B58900', 'stroke-width': 2.5, opacity: 0 }, g);
      var dot = mk('circle', { cx: 0, cy: 5, r: 5, fill: '#FFD54F', stroke: '#7A5A00', 'stroke-width': 1.5, opacity: 0 }, g);
      for (i = 0; i < 4; i++) {
        var y = 10 + i * 34, fg = mk('g', {}, g);
        fibers.push({ g: fg, y: y,
          r: mk('rect', { x: 4, y: y, width: 214, height: 28, rx: 14, fill: '#D98A7E', stroke: '#8E3B30', 'stroke-width': 1.5 }, fg),
          s: mk('path', { d: '', stroke: '#8E3B30', 'stroke-width': 1.4, fill: 'none' }, fg) });
        mk('ellipse', { cx: 40 + i * 44, cy: y + 5, rx: 8, ry: 3, fill: '#4A1E18' }, fg);
      }
      var lastSp = -1;
      return function (t, P) {
        var e1 = P(1), e2 = ease(P(2)), sp = 4.5 + 4 * e2, w = 196 + 18 * e2;
        nerve.setAttribute('opacity', n2(ease(e1) * 0.9));
        dot.setAttribute('cx', n1(((t / 6) % (VW + 20)) - 10)); dot.setAttribute('opacity', n2(ease(e1)));
        if (Math.abs(sp - lastSp) > 0.02) {
          lastSp = sp;
          fibers.forEach(function (f) {
            var d = '';
            for (var x = 14; x < 4 + w - 8; x += sp) d += 'M' + n1(x) + ' ' + (f.y + 4) + 'V' + (f.y + 24);
            f.s.setAttribute('d', d); f.r.setAttribute('width', n1(w));
          });
        }
        fibers.forEach(function (f, k) { translate(f.g, 0, (1 - e2) * 1.1 * Math.sin(t / 45 + k * 1.7)); });
      };
    },
    vasos: function (g) {
      var wall = mk('rect', { x: -10, y: 34, width: 242, height: 88, rx: 10, fill: '#F6C3BD', stroke: '#8E1B16', 'stroke-width': 9 }, g);
      var RB = [[24, 62], [62, 92], [98, 58], [132, 96], [168, 64], [200, 94], [80, 76], [150, 80]];
      var rbc = RB.map(function () { return grp(g, '<ellipse cx="0" cy="0" rx="13" ry="8" fill="#C62828" stroke="#6E0F0B" stroke-width="1"/><ellipse cx="0" cy="0" rx="5" ry="3" fill="#E57373"/>'); });
      var o2 = [0, 1, 2, 3].map(function (k) { return mk('circle', { cx: 30 + k * 52, cy: 28, r: 6, fill: '#8EC5F0', stroke: '#1F5F99', 'stroke-width': 1.5, opacity: 0 }, g); });
      var nut = [0, 1, 2].map(function (k) { return mk('circle', { cx: 40 + k * 70, cy: 128, r: 5, fill: '#2E7D4F', opacity: 0 }, g); });
      var was = [0, 1, 2].map(function (k) { return mk('rect', { x: 70 + k * 70, y: 128, width: 9, height: 9, rx: 2, fill: '#6D4C2F', opacity: 0 }, g); });
      var dist = 0;
      return function (t, P, dt) {
        var e1 = ease(P(1)), e2 = ease(P(2)), e3 = ease(P(3)), dil = 6 * e1;
        wall.setAttribute('y', n1(34 - dil)); wall.setAttribute('height', n1(88 + 2 * dil));
        dist += (dt || 0) / 1000 * (26 + 44 * e1);
        rbc.forEach(function (r, k) {
          var x = ((RB[k][0] + 14 + dist) % 252) - 14, y = 76 + (RB[k][1] - 76) * (1 + 0.12 * e1);
          translate(r, x, y);
        });
        o2.forEach(function (c, k) {
          var f = ((t / 1500) + k * 0.27) % 1;
          c.setAttribute('cy', n1(26 - dil - 22 * f)); c.setAttribute('opacity', n2(e2 * (1 - f)));
        });
        nut.forEach(function (c, k) {
          var f = ((t / 1300) + k * 0.33) % 1;
          c.setAttribute('cy', n1(124 + dil + 14 * f)); c.setAttribute('opacity', n2(e3 * (1 - f)));
        });
        was.forEach(function (c, k) {
          var f = ((t / 1300) + k * 0.33 + 0.15) % 1;
          c.setAttribute('y', n1(136 + dil - 14 * f)); c.setAttribute('opacity', n2(e3 * (1 - f)));
        });
      };
    },
    nervio: function (g) {
      mk('line', { x1: 0, y1: 80, x2: 150, y2: 80, stroke: '#7A5A00', 'stroke-width': 3 }, g);
      var seg = [], i;
      for (i = 0; i < 5; i++) seg.push(mk('rect', { x: 4 + i * 29, y: 70, width: 24, height: 20, rx: 9, fill: '#E0B400', stroke: '#7A5A00', 'stroke-width': 1.5 }, g));
      var rec = [26, 19, 12].map(function (r) { return mk('ellipse', { cx: 168, cy: 80, rx: r, ry: r * 0.7, fill: '#FFE27A', stroke: '#7A5A00', 'stroke-width': 2 }, g); });
      mk('line', { x1: 150, y1: 80, x2: 172, y2: 80, stroke: '#7A5A00', 'stroke-width': 3 }, g);
      var edema = [[150, 40], [176, 44], [128, 106]].map(function (d) { return mk('circle', { cx: d[0], cy: d[1], r: 7, fill: '#2F7FC1', stroke: INK, 'stroke-width': 1 }, g); });
      var endo = [[30, 46], [70, 40], [110, 50], [140, 36]].map(function (d) { return mk('circle', { cx: d[0], cy: d[1], r: 6, fill: '#2E7D4F', stroke: '#fff', 'stroke-width': 1.5, opacity: 0 }, g); });
      var imp = mk('circle', { cx: 168, cy: 80, r: 8, fill: '#B3261E', stroke: '#fff', 'stroke-width': 2 }, g);
      return function (t, P) {
        var e1 = ease(P(1)), e2 = ease(P(2)), e3 = ease(P(3));
        edema.forEach(function (c) { c.setAttribute('r', n1(7 * (1 - e1))); c.setAttribute('opacity', n2(1 - e1)); });
        rec[0].setAttribute('stroke-width', n1(2 + 5 * e2)); rec[0].setAttribute('stroke', e2 > 0.05 ? NAR : '#7A5A00');
        var f = (t % 1500) / 1500, reach = 1 - 0.55 * e2 - 0.3 * e3, x = 168 - 168 * reach * f;
        var op = clamp(1 - (1 - reach) * f * f * 1.6, 0, 1);
        imp.setAttribute('cx', n1(x)); imp.setAttribute('opacity', n2(op));
        rec[2].setAttribute('fill', f < 0.12 ? '#FF8A65' : '#FFE27A');
        seg.forEach(function (s, k) { var a = 4 + k * 29; s.setAttribute('fill', op > 0.2 && x >= a - 4 && x <= a + 28 ? '#FFF176' : '#E0B400'); });
        endo.forEach(function (c, k) { c.setAttribute('opacity', n2(e3)); translate(c, 3 * Math.sin(t / 400 + k), 3 * Math.cos(t / 500 + k)); });
      };
    }
  };
  function wrapText(s, max) {
    var words = s.split(' '), lines = [''];
    words.forEach(function (w) {
      var l = lines[lines.length - 1];
      if (l && (l + ' ' + w).length > max && lines.length < 2) lines.push(w);
      else lines[lines.length - 1] = l ? l + ' ' + w : w;
    });
    return lines;
  }

  function tissue(el, o) {
    o = o || {};
    function find(tid) { return M.TISSUES.filter(function (x) { return x.id === tid; })[0]; }
    var cur = find(o.tissueId) || M.TISSUES[0];
    var id = uid('t'), t = 0, fph = 0, lastDt = 0, shown = -1, upd = null, R = {};
    var p = makePiece(el, { tick: tick, render: render });
    function total() { return cur.pasos.length * STEP + HOLD; }
    function build() {
      var mkr = id + '-tarr', fmk = id + '-farr', s = '';
      s += '<svg viewBox="0 0 690 556" role="group" data-r="svg">';
      s += '<defs><marker id="' + mkr + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="' + INK + '"/></marker>' +
        '<marker id="' + fmk + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10z" fill="' + VIO + '"/></marker></defs>';
      s += '<line x1="8" y1="24" x2="70" y2="24" stroke="' + VIO + '" stroke-width="4" stroke-dasharray="14 8" marker-end="url(#' + fmk + ')"/>' + tx(80, 30, 'Campo magnético: atraviesa todos los tejidos (no los calienta)', 18, { a: 'start', b: true, c: VIO });
      M.TISSUES.forEach(function (ti, k) {
        var on = ti.id === cur.id, x = GX + (k % 3) * (VW + GAP), y = GY + Math.floor(k / 3) * (VH + GAP), cid = id + '-vc-' + ti.id;
        s += '<g class="mga-vig" data-t="' + ti.id + '" tabindex="0" role="button" aria-pressed="' + on + '" aria-label="' + ti.nombre + '" style="cursor:pointer" transform="translate(' + x + ' ' + y + ')">';
        s += '<clipPath id="' + cid + '"><rect width="' + VW + '" height="' + VD + '" rx="10"/></clipPath>';
        s += '<g clip-path="url(#' + cid + ')"' + (on ? ' data-r="vin"' : '') + '>' + DRAW[ti.id](mkr, on) + '</g>';
        if (on) s += '<rect data-r="flash" width="' + VW + '" height="' + VD + '" rx="10" fill="' + VIO + '" opacity="0" pointer-events="none"/>';
        s += '<clipPath id="' + cid + 'b"><rect width="' + VW + '" height="' + VH + '" rx="10"/></clipPath><rect y="' + VD + '" width="' + VW + '" height="' + (VH - VD) + '" fill="' + (on ? VIO : '#fff') + '" clip-path="url(#' + cid + 'b)"/>';
        s += tx(VW / 2, VD + 29, (on ? '▶︎ ' : '') + SHORT[ti.id], 17, { b: true, c: on ? '#fff' : INK });
        s += '<rect class="mga-vfoc" x="' + (on ? 3 : 1) + '" y="' + (on ? 3 : 1) + '" width="' + (VW - (on ? 6 : 2)) + '" height="' + (VH - (on ? 6 : 2)) + '" rx="10" fill="none" stroke="' + (on ? NAR : LINE) + '" stroke-width="' + (on ? 6 : 2) + '"/>';
        s += '</g>';
      });
      s += '<g pointer-events="none">';
      [GY + 46, GY + 100, GY + VH + GAP + 46, GY + VH + GAP + 100].forEach(function (yy) {
        s += '<line data-r="fline" x1="2" y1="' + yy + '" x2="686" y2="' + yy + '" stroke="' + VIO + '" stroke-width="3.5" stroke-opacity="0.55" stroke-dasharray="14 8" marker-end="url(#' + fmk + ')"/>';
      });
      s += '</g>';
      s += '<rect x="4" y="494" width="682" height="58" rx="10" fill="#EFE7F7" stroke="' + VIO + '" stroke-width="2"/>';
      s += T(16, 518, '', { fs: 17, b: true, c: VIO, r: 'cap1' }) + T(16, 542, '', { fs: 17, b: true, r: 'cap2' });
      s += '</svg>';
      p.stage.innerHTML = s;
      R.svg = q(p.stage, 'svg'); R.flash = q(p.stage, 'flash'); R.cap1 = q(p.stage, 'cap1'); R.cap2 = q(p.stage, 'cap2');
      R.fl = qa(p.stage, 'fline');
      upd = ANIM[cur.id](q(p.stage, 'vin'), mkr);
      shown = -1;
      R.svg.addEventListener('click', function (e) {
        var n = e.target.closest ? e.target.closest('[data-t]') : null;
        if (n) pick(n.getAttribute('data-t'));
      });
      R.svg.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var n = e.target.closest ? e.target.closest('[data-t]') : null;
        if (n) { e.preventDefault(); pick(n.getAttribute('data-t'), true); }
      });
    }
    function pick(tid, kb) {
      el.dispatchEvent(new CustomEvent('tissue-select', { detail: tid }));
      setTissue(tid);
      if (kb) { var n = R.svg.querySelector('[data-t="' + tid + '"]'); if (n && n.focus) n.focus(); }
    }
    function setTissue(tid) {
      var nt = find(tid);
      if (!nt || p.dead || nt.id === cur.id) return;
      cur = nt;
      t = p.playing ? 0 : total() - HOLD / 2;
      build(); p.redraw();
    }
    function tick(dt) {
      lastDt += dt;
      t += dt; if (t >= total()) t = t % total();
      fph = (fph + dt / 1000 * 1.2) % 1;
    }
    function render() {
      var n = cur.pasos.length, step = Math.min(n - 1, Math.floor(t / STEP));
      var P = function (k) { return clamp(t / STEP - k, 0, 1); };
      upd(t, P, lastDt); lastDt = 0;
      R.flash.setAttribute('opacity', n2(step === 0 ? 0.22 * Math.sin(Math.PI * P(0)) : 0));
      var off = n1(-fph * 44);
      R.fl.forEach(function (l) { l.setAttribute('stroke-dashoffset', off); });
      if (step !== shown) {
        shown = step;
        var lines = wrapText('Paso ' + (step + 1) + ' de ' + n + ': ' + cur.pasos[step] + '.', 74);
        R.cap1.textContent = lines[0]; R.cap2.textContent = lines[1] || '';
        R.svg.setAttribute('aria-label', 'Seis tejidos ampliados atravesados por el campo magnético. Seleccionado: ' + cur.nombre + '. Paso ' + (step + 1) + ' de ' + n + ': ' + cur.pasos[step] + '.');
      }
    }
    if (!p.playing) t = total() - HOLD / 2; /* en pausa: cuadro final con todos los efectos */
    build(); p.start();
    return { setTissue: setTissue, destroy: p.destroy };
  }

  /* =====================================================================
     3. Forma de onda en vivo.
     ===================================================================== */
  function validShape(s) { return SHAPES.indexOf(s) > -1 ? s : 'sinusoidal'; }
  function shapeName(s) { var f = M.THEORY.formasOnda.filter(function (x) { return x.id === s; })[0]; return f ? f.nombre : s; }
  function wave(el, o) {
    o = o || {};
    var shape = validShape(o.shape), hz = hzClamp(o.hz === undefined ? 30 : o.hz), phase = 0, R = {}, N = 200;
    var PX0 = 70, PX1 = 470, MID = 118, A = 66, GX0 = 512, GW = 40;
    var p = makePiece(el, { tick: tick, render: render });
    function build() {
      var s = '<svg viewBox="0 0 600 244" role="img" data-r="svg">';
      s += '<rect x="' + PX0 + '" y="' + (MID - A - 12) + '" width="' + (PX1 - PX0) + '" height="' + (2 * A + 24) + '" rx="8" fill="#FBF6F0" stroke="#D9C7B6" stroke-width="1.5"/>';
      s += '<line x1="' + PX0 + '" y1="' + (MID - A) + '" x2="' + PX1 + '" y2="' + (MID - A) + '" stroke="#D9C7B6" stroke-width="1.5" stroke-dasharray="6 5"/>';
      s += '<line x1="' + PX0 + '" y1="' + (MID + A) + '" x2="' + PX1 + '" y2="' + (MID + A) + '" stroke="#D9C7B6" stroke-width="1.5" stroke-dasharray="6 5"/>';
      s += '<line x1="' + PX0 + '" y1="' + MID + '" x2="' + PX1 + '" y2="' + MID + '" stroke="' + LINE + '" stroke-width="2"/>';
      s += T(PX0 - 10, MID - A + 7, '+', { a: 'end', fs: 22, b: true }) + T(PX0 - 10, MID + 6, '0', { a: 'end', fs: 18, b: true }) + T(PX0 - 10, MID + A + 7, '−', { a: 'end', fs: 22, b: true });
      s += T(PX1, MID + A + 32, 'tiempo →', { a: 'end', fs: 16, c: MUTED });
      s += '<polyline data-r="tr" fill="none" stroke="' + VIO + '" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" points=""/>';
      s += '<circle data-r="hd" cx="' + PX1 + '" cy="' + MID + '" r="8" fill="' + NAR + '" stroke="' + INK + '" stroke-width="1.5"/>';
      s += T(16, 32, '', { fs: 20, b: true, c: VIO, r: 'ttl' });
      s += T(GX0 + GW / 2, 32, 'campo ahora', { a: 'middle', fs: 16, b: true });
      s += '<rect x="' + GX0 + '" y="' + (MID - A) + '" width="' + GW + '" height="' + (2 * A) + '" rx="6" fill="#fff" stroke="' + LINE + '" stroke-width="2"/>';
      s += '<rect data-r="gf" x="' + (GX0 + 3) + '" y="' + MID + '" width="' + (GW - 6) + '" height="0" fill="' + VIO + '"/>';
      s += '<line x1="' + (GX0 - 4) + '" y1="' + MID + '" x2="' + (GX0 + GW + 4) + '" y2="' + MID + '" stroke="' + INK + '" stroke-width="2"/>';
      s += T(16, 234, '', { fs: 16, c: MUTED, r: 'nt' });
      s += '</svg>';
      p.stage.innerHTML = s;
      R.svg = q(p.stage, 'svg'); R.tr = q(p.stage, 'tr'); R.hd = q(p.stage, 'hd'); R.gf = q(p.stage, 'gf'); R.ttl = q(p.stage, 'ttl'); R.nt = q(p.stage, 'nt');
    }
    function style() {
      R.ttl.textContent = shapeName(shape) + ' · ' + fxHz(hz) + ' Hz';
      R.nt.textContent = 'Animación ralentizada: ' + fxHz(hz) + ' Hz se muestran a ' + K.fx(M.visualHz(hz), 1) + ' ciclos por segundo.';
      R.svg.setAttribute('aria-label', 'Forma de onda ' + shapeName(shape).toLowerCase() + ' a ' + fxHz(hz) + ' Hz. La animación está ralentizada: se ven ' + K.fx(M.visualHz(hz), 1) + ' ciclos por segundo.');
    }
    function tick(dt) { phase = (phase + M.fieldPhase(dt, hz, 1)) % 1; }
    function render() {
      var pts = [], i, v;
      for (i = 0; i <= N; i++) {
        v = M.wavePoint(shape, phase - (N - i) / N * 2);
        pts.push(n1(PX0 + (PX1 - PX0) * i / N) + ',' + n1(MID - A * v));
      }
      R.tr.setAttribute('points', pts.join(' '));
      v = M.wavePoint(shape, phase);
      R.hd.setAttribute('cy', n1(MID - A * v));
      R.gf.setAttribute('y', n1(v >= 0 ? MID - A * v : MID));
      R.gf.setAttribute('height', n1(Math.abs(A * v)));
      R.gf.setAttribute('fill', v >= 0 ? VIO : NAR);
    }
    build(); style(); p.start();
    return {
      update: function (u) {
        if (p.dead || !u) return;
        if (u.shape !== undefined) shape = validShape(u.shape);
        if (u.hz !== undefined) hz = hzClamp(u.hz);
        style(); p.redraw();
      },
      destroy: p.destroy
    };
  }

  /* =====================================================================
     4. Barrido (solenoide grande recorriendo el cuerpo) frente a fijo.
     ===================================================================== */
  function sweep(el) {
    var id = uid('b'), t = 0, PERIOD = 12000, idx = -1, R = {};
    var XS = [50, 196, 345, 462, 600], NAMES = M.THEORY.posiciones, OYB = 226;
    var p = makePiece(el, { tick: tick, render: render });
    function body(oy) {
      var sk = '#E8B58F', st = '#8E5B3A', s = '';
      s += '<rect x="24" y="' + (oy + 152) + '" width="640" height="12" rx="4" fill="#B9A58C"/>';
      s += '<line x1="60" y1="' + (oy + 164) + '" x2="60" y2="' + (oy + 176) + '" stroke="#8C7860" stroke-width="5"/><line x1="628" y1="' + (oy + 164) + '" x2="628" y2="' + (oy + 176) + '" stroke="#8C7860" stroke-width="5"/>';
      s += '<rect x="52" y="' + (oy + 112) + '" width="296" height="38" rx="17" fill="' + sk + '" stroke="' + st + '" stroke-width="2"/>';
      s += '<rect x="40" y="' + (oy + 82) + '" width="22" height="66" rx="10" fill="' + sk + '" stroke="' + st + '" stroke-width="2"/>';
      s += '<rect x="330" y="' + (oy + 96) + '" width="228" height="54" rx="24" fill="' + sk + '" stroke="' + st + '" stroke-width="2"/>';
      s += '<rect x="552" y="' + (oy + 110) + '" width="28" height="28" fill="' + sk + '" stroke="' + st + '" stroke-width="2"/>';
      s += '<circle cx="610" cy="' + (oy + 120) + '" r="30" fill="' + sk + '" stroke="' + st + '" stroke-width="2"/>';
      XS.forEach(function (x) { s += '<line x1="' + x + '" y1="' + (oy + 152) + '" x2="' + x + '" y2="' + (oy + 164) + '" stroke="' + INK + '" stroke-width="2.5"/>'; });
      return s;
    }
    function labels(oy, on, r) {
      var s = '';
      XS.forEach(function (x, k) {
        var w = NAMES[k].length * 9 + 22;
        s += '<g' + (r ? ' data-r="' + r + '"' : '') + '><rect x="' + (x - w / 2) + '" y="' + (oy + 182) + '" width="' + w + '" height="26" rx="13" fill="' + (k === on ? VIO : 'none') + '"/>' +
          T(x, oy + 201, NAMES[k], { a: 'middle', fs: 17, b: k === on, c: k === on ? '#fff' : INK }) + '</g>';
      });
      return s;
    }
    function coil(h, w, oy, mkr) {
      var s = '<rect x="' + (-w / 2) + '" y="' + (oy + 120 - h / 2) + '" width="' + w + '" height="' + h + '" rx="14" fill="' + VIO + '" fill-opacity="0.16" stroke="' + VIO + '" stroke-width="5"/>';
      [-w / 4, 0, w / 4].forEach(function (x) { s += '<line x1="' + x + '" y1="' + (oy + 148 - h / 2) + '" x2="' + x + '" y2="' + (oy + 114 + h / 2) + '" stroke="' + VIO + '" stroke-width="2" stroke-opacity="0.5"/>'; });
      s += '<line x1="' + (-w / 2 + 6) + '" y1="' + (oy + 120) + '" x2="' + (w / 2 - 4) + '" y2="' + (oy + 120) + '" stroke="' + VIO + '" stroke-width="3.5" marker-end="url(#' + mkr + ')"/>';
      s += T(-w / 4, oy + 142 - h / 2, 'S', { a: 'middle', fs: 16, b: true, c: VIO }) + T(w / 4, oy + 142 - h / 2, 'N', { a: 'middle', fs: 16, b: true, c: VIO });
      return s;
    }
    function build() {
      var mkr = id + '-arr', tmk = id + '-trk', s = '';
      s += '<svg viewBox="0 0 690 440" role="img" data-r="svg">';
      s += '<defs><marker id="' + mkr + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10z" fill="' + VIO + '"/></marker>' +
        '<marker id="' + tmk + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#9C86BF"/></marker></defs>';
      /* panel barrido */
      s += '<rect x="2" y="2" width="686" height="214" rx="12" fill="#F6F1FB" stroke="' + VIO + '" stroke-width="2"/>';
      s += T(16, 28, 'Barrido (patología global): el solenoide grande recorre el cuerpo', { fs: 18, b: true, c: VIO });
      var mid = (XS[0] + XS[4]) / 2;
      s += '<line x1="' + mid + '" y1="44" x2="' + (XS[4] - 6) + '" y2="44" stroke="#9C86BF" stroke-width="3" stroke-dasharray="8 6" marker-end="url(#' + tmk + ')"/>';
      s += '<line x1="' + mid + '" y1="44" x2="' + (XS[0] + 6) + '" y2="44" stroke="#9C86BF" stroke-width="3" stroke-dasharray="8 6" marker-end="url(#' + tmk + ')"/>';
      s += body(0);
      s += '<g data-r="ring">' + coil(122, 54, 0, mkr) + '</g>';
      s += labels(0, -1, 'pos');
      /* panel fijo (estático) */
      s += '<rect x="2" y="' + OYB + '" width="686" height="212" rx="12" fill="#FBF6F0" stroke="' + LINE + '" stroke-width="2"/>';
      s += T(16, OYB + 26, 'Fijo (patología local): el solenoide se queda en una zona', { fs: 18, b: true, c: INK });
      s += body(OYB - 12);
      s += '<g transform="translate(' + XS[1] + ' 0)">' + coil(80, 38, OYB - 12, mkr) + '</g>';
      s += labels(OYB - 14, 1);
      s += '</svg>';
      p.stage.innerHTML = s;
      R.svg = q(p.stage, 'svg'); R.ring = q(p.stage, 'ring'); R.pos = qa(p.stage, 'pos');
      idx = -1;
    }
    function tick(dt) { t = (t + dt) % PERIOD; }
    function render() {
      var sp = M.sweepPosition(t, PERIOD), x = XS[0] + sp.x * (XS[4] - XS[0]);
      translate(R.ring, x, 0);
      if (sp.index !== idx) {
        idx = sp.index;
        R.pos.forEach(function (g, k) {
          var on = k === idx, txt = g.querySelector('text');
          g.querySelector('rect').setAttribute('fill', on ? VIO : 'none');
          txt.setAttribute('fill', on ? '#fff' : INK);
          if (on) txt.setAttribute('font-weight', 'bold'); else txt.removeAttribute('font-weight');
        });
        R.svg.setAttribute('aria-label', 'Barrido: el solenoide grande recorre las 5 posiciones (' + NAMES.join(', ') + '); ahora está en ' + NAMES[idx] +
          '. Fijo: el solenoide se queda en una sola zona, la ' + NAMES[1] + '.');
      }
    }
    build(); p.start();
    return { destroy: p.destroy };
  }

  /* ---------- modo y limpieza ---------- */
  function setMode(m) {
    api.mode = m === 'exploracion' ? 'exploracion' : 'proyeccion';
    live.slice().forEach(function (p) { p.controls(); });
  }
  function stopAll() {
    live.slice().forEach(function (p) { p.destroy(); });
    live.length = 0;
  }

  api.setMode = setMode;
  api.scheme = scheme;
  api.tissue = tissue;
  api.wave = wave;
  api.sweep = sweep;
  api.stopAll = stopAll;
  return api;
})();
