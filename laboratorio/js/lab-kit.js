/* Kit común del Laboratorio: lógica pura (fx, band, checkConditions, gradeCase) y ayudantes de pantalla. */
var LabKit = (function () {
  /* ---------- lógica pura ---------- */
  function fx(n, dec) {
    if (n === null || n === undefined || typeof n !== 'number' || isNaN(n)) return '–';
    return n.toFixed(dec).replace('.', ',');
  }
  function band(value, lo, hi) { return value < lo ? 'bajo' : (value > hi ? 'alto' : 'ventana'); }

  function checkConditions(table, selectedIds) {
    var contra = [], precaucion = [];
    table.forEach(function (e) {
      if (selectedIds.indexOf(e.id) < 0) return;
      (e.nivel === 'contra' ? contra : precaucion).push(e);
    });
    return { bloqueado: contra.length > 0, contra: contra, precaucion: precaucion };
  }

  function fieldOk(rule, v) {
    if (v === undefined || v === null || v === '' || (typeof v === 'number' && isNaN(v))) return false;
    if (rule.any) return rule.any.indexOf(v) > -1;
    var n = typeof v === 'number' ? v : parseFloat(v);
    if (isNaN(n)) return false;
    return (rule.min === undefined || n >= rule.min) && (rule.max === undefined || n <= rule.max);
  }
  function gradeCase(spec, answer) {
    var campos = {}, puntos = 0, total = 0;
    Object.keys(spec).forEach(function (f) {
      total++;
      campos[f] = fieldOk(spec[f], answer ? answer[f] : undefined);
      if (campos[f]) puntos++;
    });
    return { puntos: puntos, total: total, campos: campos };
  }

  /* ---------- pantalla (solo navegador) ---------- */
  var BASE_CSS =
    ':host{--ink:#2B1B10;--cream:#FBF6F0;--line:#D9C7B6;--ok:#2E7D4F;--warn:#C77700;--bad:#B3261E;--muted:#6b5848;display:block;color:var(--ink);font-family:Cambria,Georgia,serif;font-size:20px}' +
    '.lab{background:var(--cream);min-height:60vh}' +
    '.mh{background:var(--accent);color:#fff;padding:12px 24px;display:flex;align-items:baseline;gap:18px;flex-wrap:wrap}' +
    '.mh h1{margin:0;font-size:28px}.mh span{font-size:18px;opacity:.92}' +
    'nav.tabs{display:flex;gap:6px;padding:10px 24px 0;border-bottom:3px solid var(--accent);flex-wrap:wrap}' +
    'nav.tabs button{font:inherit;font-size:19px;padding:8px 16px;border:2px solid var(--line);border-bottom:0;border-radius:10px 10px 0 0;background:#fff;color:var(--ink);cursor:pointer}' +
    'nav.tabs button.on{background:var(--accent);border-color:var(--accent);color:#fff;font-weight:bold}' +
    'main{padding:16px 24px 28px}' +
    'section.tab{display:none;grid-template-columns:minmax(300px,1.15fr) minmax(280px,1fr);gap:18px;align-items:start}' +
    'section.tab.on{display:grid}' +
    '.card{background:#fff;border:2px solid var(--line);border-radius:12px;padding:12px 16px;margin-bottom:14px}' +
    '.card h2{margin:0 0 8px;font-size:22px;color:var(--accent)}' +
    '.card p{margin:6px 0;line-height:1.4}' +
    '.row{display:flex;align-items:center;gap:12px;margin:10px 0;flex-wrap:wrap}.row label{min-width:150px;font-weight:bold}' +
    '.row input[type=range]{flex:1;min-width:140px;accent-color:var(--accent)}.row .val{font-weight:bold;min-width:70px;text-align:right}' +
    '.seg{display:inline-flex;flex-wrap:wrap;border:2px solid var(--accent);border-radius:10px;overflow:hidden}' +
    '.seg button{font:inherit;font-size:18px;padding:6px 14px;border:0;background:#fff;color:var(--accent);cursor:pointer}' +
    '.seg button.on{background:var(--accent);color:#fff;font-weight:bold}' +
    'select,input[type=number]{font:inherit;font-size:19px;padding:5px 8px;border:2px solid var(--line);border-radius:8px;max-width:100%}' +
    'button.act{font:inherit;font-size:19px;padding:8px 18px;border:0;border-radius:10px;background:var(--accent);color:#fff;cursor:pointer;margin:4px 8px 4px 0}' +
    'button.act.alt{background:#fff;color:var(--accent);border:2px solid var(--accent)}' +
    '.badge{display:inline-block;padding:4px 14px;border-radius:999px;color:#fff;font-weight:bold}' +
    '.ok{background:var(--ok)}.warn{background:var(--warn)}.bad{background:var(--bad)}' +
    '.note{font-size:16px;color:var(--muted)}' +
    '.chk{display:block;margin:4px 0;font-size:19px}.chk input{margin-right:8px;transform:scale(1.2)}' +
    '.res{margin-top:10px;padding:10px 14px;border-radius:10px;border:2px solid var(--line);background:#FBF1EA}' +
    '.res.bad{background:#FBE3E0;border-color:var(--bad);color:var(--ink)}.res.ok{background:#E3F2E8;border-color:var(--ok);color:var(--ink)}.res.warn{background:#FFF1D6;border-color:var(--warn);color:var(--ink)}' +
    'ul.l{margin:6px 0;padding-left:22px}ul.l li{margin:4px 0;line-height:1.35}' +
    '.flow{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0}.flow span{background:#FBF1EA;border:2px solid var(--line);border-radius:10px;padding:4px 10px;font-size:18px}.flow i{font-style:normal;color:var(--accent);font-weight:bold}' +
    'svg{max-width:100%;height:auto;display:block}' +
    '[hidden]{display:none!important}' +
    '@media(max-width:820px){section.tab.on{grid-template-columns:1fr}.mh,nav.tabs,main{padding-left:12px;padding-right:12px}}';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function tabs(root) {
    var btns = [].slice.call(root.querySelectorAll('nav.tabs button'));
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.classList.toggle('on', x === b); });
        [].forEach.call(root.querySelectorAll('section.tab'), function (s) {
          s.classList.toggle('on', s.id === b.getAttribute('data-t'));
        });
      });
    });
  }
  function seg(box, cb) {
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || !box.contains(b)) return;
      [].forEach.call(box.children, function (x) { x.classList.toggle('on', x === b); });
      cb(b.getAttribute('data-v'));
    });
  }
  function slider(root, id, fmt, cb) {
    var inp = root.getElementById(id), out = root.getElementById(id + 'v');
    function f() { out.textContent = fmt(+inp.value); if (cb) cb(+inp.value); }
    inp.addEventListener('input', f);
    out.textContent = fmt(+inp.value);
  }
  function reveal(btn, panel) {
    panel.hidden = true;
    btn.addEventListener('click', function () {
      panel.hidden = !panel.hidden;
      btn.textContent = panel.hidden ? 'Revelar respuesta' : 'Ocultar respuesta';
    });
  }
  function badge(box, nivel, text) {
    box.innerHTML = '';
    box.appendChild(el('span', 'badge ' + nivel, text));
  }
  /* Comprobador de condiciones del paciente sobre una tabla de LabKit.checkConditions. */
  function checker(root, id, table) {
    var box = root.getElementById(id), res = el('div', 'res');
    var list = el('div');
    table.forEach(function (e) {
      var lab = el('label', 'chk'), inp = document.createElement('input');
      inp.type = 'checkbox'; inp.setAttribute('data-id', e.id);
      lab.appendChild(inp); lab.appendChild(document.createTextNode(e.label + (e.nivel === 'precaucion' ? ' (precaución)' : '')));
      list.appendChild(lab);
    });
    box.appendChild(list); box.appendChild(res);
    function upd() {
      var sel = [].map.call(list.querySelectorAll('input:checked'), function (i) { return i.getAttribute('data-id'); });
      var r = checkConditions(table, sel);
      res.innerHTML = '';
      if (!sel.length) { res.className = 'res'; res.textContent = 'Marque las condiciones que presenta el paciente.'; return; }
      if (r.bloqueado) {
        res.className = 'res bad';
        res.appendChild(el('b', '', 'NO aplicar: contraindicado.'));
        var u = el('ul', 'l');
        r.contra.forEach(function (e) { u.appendChild(el('li', '', e.label + (e.por ? ' — ' + e.por : ''))); });
        res.appendChild(u);
      } else {
        res.className = 'res warn';
        res.appendChild(el('b', '', 'Sin contraindicación absoluta; extreme precauciones:'));
        var u2 = el('ul', 'l');
        r.precaucion.forEach(function (e) { u2.appendChild(el('li', '', e.label + (e.por ? ' — ' + e.por : ''))); });
        res.appendChild(u2);
      }
    }
    list.addEventListener('change', upd); upd();
  }
  /* Casos clínicos: fields = {campo:{label, type:'select'|'number', options:[[valor,rótulo]], unit}}. */
  function cases(root, id, list, fields) {
    var box = root.getElementById(id);
    var sel = document.createElement('select');
    list.forEach(function (c, i) { var o = el('option', '', c.titulo); o.value = i; sel.appendChild(o); });
    var txt = el('p'), form = el('div'), res = el('div', 'res'), ans = el('div', 'res'), inputs = {}, rows = {};
    box.appendChild(sel); box.appendChild(txt); box.appendChild(form);
    Object.keys(fields).forEach(function (f) {
      var d = fields[f], row = el('div', 'row'), inp;
      row.appendChild(el('label', '', d.label));
      if (d.type === 'select') {
        inp = document.createElement('select');
        var o0 = el('option', '', '— elegir —'); o0.value = ''; inp.appendChild(o0);
        d.options.forEach(function (p) { var o = el('option', '', p[1]); o.value = p[0]; inp.appendChild(o); });
      } else { inp = document.createElement('input'); inp.type = 'number'; inp.step = d.step || 1; inp.min = 0; }
      inputs[f] = inp; rows[f] = row; row.appendChild(inp);
      if (d.unit) row.appendChild(el('span', 'note', d.unit));
      form.appendChild(row);
    });
    var go = el('button', 'act', 'Evaluar'), rv = el('button', 'act alt', 'Revelar respuesta');
    box.appendChild(go); box.appendChild(rv); box.appendChild(res); box.appendChild(ans);
    function cur() { return list[+sel.value]; }
    function show() { txt.textContent = cur().texto; Object.keys(fields).forEach(function (f) { rows[f].hidden = !(f in cur().spec); }); res.className = 'res'; res.textContent = ''; res.hidden = true; ans.hidden = true; rv.textContent = 'Revelar respuesta'; }
    sel.addEventListener('change', show);
    go.addEventListener('click', function () {
      var a = {};
      Object.keys(fields).forEach(function (f) { var v = inputs[f].value; a[f] = fields[f].type === 'number' ? (v === '' ? NaN : parseFloat(v)) : v; });
      var g = gradeCase(cur().spec, a);
      res.hidden = false; res.className = 'res ' + (g.puntos === g.total ? 'ok' : (g.puntos ? 'warn' : 'bad'));
      res.innerHTML = '';
      res.appendChild(el('b', '', g.puntos + ' de ' + g.total + ' correctos'));
      var u = el('ul', 'l');
      Object.keys(fields).filter(function (f) { return f in g.campos; }).forEach(function (f) { u.appendChild(el('li', '', (g.campos[f] ? '✔ ' : '✘ ') + fields[f].label)); });
      res.appendChild(u);
    });
    rv.addEventListener('click', function () {
      ans.hidden = !ans.hidden; rv.textContent = ans.hidden ? 'Revelar respuesta' : 'Ocultar respuesta';
      ans.textContent = cur().respuesta;
    });
    show();
  }
  /* Arma la definición de un módulo: encabezado, pestañas y secciones. */
  function build(o) {
    var nav = '', secs = '';
    o.tabs.forEach(function (t, i) {
      nav += '<button type="button" data-t="t' + (i + 1) + '"' + (i ? '' : ' class="on"') + '>' + (i + 1) + ' · ' + t.title + '</button>';
      secs += '<section class="tab' + (i ? '' : ' on') + '" id="t' + (i + 1) + '">' + t.html + '</section>';
    });
    return {
      id: o.id, title: o.title,
      css: ':host{--accent:' + o.accent + '}' + BASE_CSS + (o.css || ''),
      html: '<header class="mh"><h1>' + o.title + '</h1><span>' + (o.subtitle || '') + '</span></header><nav class="tabs">' + nav + '</nav><main>' + secs + '</main>',
      init: function (root) {
        tabs(root);
        var hs = [];
        o.tabs.forEach(function (t) { if (t.init) { var h = t.init(root); if (h && h.destroy) hs.push(h); } });
        return { destroy: function () { hs.forEach(function (h) { h.destroy(); }); } };
      }
    };
  }

  function fill(ul, items) { ul.innerHTML = ''; items.forEach(function (t) { ul.appendChild(el('li', '', t)); }); }
  function verdict(badgeBox, msgBox, r, labels) {
    var lv = r.veredicto === 'ok' ? 'ok' : (r.veredicto === 'ajustar' ? 'warn' : 'bad');
    badge(badgeBox, lv, (labels && labels[r.veredicto]) || r.veredicto);
    msgBox.innerHTML = '';
    r.mensajes.forEach(function (t) { msgBox.appendChild(el('p', '', t)); });
  }
  function safeHtml(p) {
    return '<div class="card"><h2>Indicaciones</h2><ul class="l" id="' + p + 'ind"></ul></div><div class="card"><h2>¿Se puede aplicar?</h2><div id="' + p + 'chk"></div></div>';
  }
  function caseHtml(p) { return '<div class="card" style="grid-column:1/-1"><h2>Caso clínico</h2><div id="' + p + 'cases"></div></div>'; }
  return { fx: fx, band: band, checkConditions: checkConditions, gradeCase: gradeCase,
    BASE_CSS: BASE_CSS, ui: { el: el, tabs: tabs, seg: seg, slider: slider, reveal: reveal, badge: badge, checker: checker, cases: cases, build: build, fill: fill, verdict: verdict, safeHtml: safeHtml, caseHtml: caseHtml } };
})();
if (typeof module !== 'undefined') module.exports = LabKit;
