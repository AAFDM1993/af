/* ===== FLOW ENGINE ===== */
let flowHistory = [];
let flowLabels = [];

function renderFlow(nodeId) {
  const c = document.getElementById('flow-content');
  c.innerHTML = '';
  if (nodeId === 'start') { flowHistory=[]; flowLabels=[]; renderQ(FLOW_START, c); return; }
  const node = FLOW_NODES[nodeId];
  if (!node) return;
  node.result ? renderResult(node, c) : renderQ(node, c);
}

function renderQ(node, c) {
  if (flowLabels.length > 0) {
    const bc = document.createElement('div');
    bc.className = 'breadcrumb';
    flowLabels.forEach((l,i) => {
      if (i > 0) { const s = document.createElement('span'); s.className='bc-sep'; s.textContent='›'; bc.appendChild(s); }
      const it = document.createElement('span');
      it.className = i === flowLabels.length-1 ? 'bc-current' : 'bc-item';
      it.textContent = l;
      bc.appendChild(it);
    });
    c.appendChild(bc);
  }
  const card = document.createElement('div'); card.className = 'question-card';
  const step = document.createElement('div'); step.className = 'q-step'; step.textContent = node.step||''; card.appendChild(step);
  const qt = document.createElement('div'); qt.className = 'q-title'; qt.textContent = node.q; card.appendChild(qt);
  if (node.hint) { const qh = document.createElement('div'); qh.className = 'q-hint'; qh.textContent = node.hint; card.appendChild(qh); }
  const og = document.createElement('div'); og.className = 'opt-grid';
  node.opts.forEach(opt => {
    const b = document.createElement('button'); b.className = `opt-btn ${opt.c}`;
    const dot = document.createElement('span'); dot.className='opt-dot'; b.appendChild(dot);
    const txt = document.createTextNode(opt.l); b.appendChild(txt);
    b.onclick = () => { flowHistory.push(opt.n); flowLabels.push(opt.l); renderFlow(opt.n); };
    og.appendChild(b);
  });
  card.appendChild(og);
  c.appendChild(card);
  if (flowLabels.length > 0) {
    const rb = document.createElement('button'); rb.className='restart-btn';
    rb.innerHTML = '↩ Reiniciar flujograma';
    rb.onclick = () => renderFlow('start');
    c.appendChild(rb);
  }
}

function renderResult(node, c) {
  if (flowLabels.length > 0) {
    const bc = document.createElement('div'); bc.className='breadcrumb';
    flowLabels.forEach((l,i) => {
      if (i>0){const s=document.createElement('span');s.className='bc-sep';s.textContent='›';bc.appendChild(s);}
      const it=document.createElement('span');it.className='bc-item';it.textContent=l;bc.appendChild(it);
    });
    c.appendChild(bc);
  }
  const pill = document.createElement('div');
  pill.className = `phase-pill ${node.phase.p}`;
  pill.innerHTML = `<span class="phase-dot"></span>${node.phase.l}`;
  c.appendChild(pill);

  const rl = document.createElement('div'); rl.className='result-label'; rl.textContent='Agentes físicos recomendados'; c.appendChild(rl);
  const grid = document.createElement('div'); grid.className='agents-grid';
  node.agents.forEach(a => {
    const card = document.createElement('div');
    card.className = `agent-card ${a.c}`;
    card.innerHTML = `<div class="ac-name">${a.name}</div><div class="ac-params">${a.params}</div><span class="ac-effect">${a.effect}</span>`;
    card.onclick = () => openModal(a);
    grid.appendChild(card);
  });
  c.appendChild(grid);
  if (node.note) { const nb=document.createElement('div');nb.className='note-box';nb.innerHTML=node.note;c.appendChild(nb); }

  if (node.kinesio) {
    const uid = 'k_'+Math.random().toString(36).slice(2,7);
    const ksec = document.createElement('div'); ksec.className='kinesio-section';
    const khdr = document.createElement('div'); khdr.className='kinesio-header';
    khdr.innerHTML = `<div class="kinesio-icon"><svg viewBox="0 0 24 24"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg></div>
      <span class="kinesio-label">Kinesioterapia recomendada</span>`;
    ksec.appendChild(khdr);

    const ktabs = document.createElement('div'); ktabs.className='kinesio-tabs';
    const kpanels = document.createElement('div');

    node.kinesio.tabs.forEach((tab,ti) => {
      const tabId = uid+'_'+ti;
      const kt = document.createElement('button'); kt.className='ktab'+(ti===0?' active':'');
      kt.textContent = tab.label;
      kt.onclick = () => {
        ktabs.querySelectorAll('.ktab').forEach(x=>x.classList.remove('active'));
        kpanels.querySelectorAll('.kinesio-panel').forEach(x=>x.classList.remove('open'));
        kt.classList.add('active');
        document.getElementById(tabId).classList.add('open');
      };
      ktabs.appendChild(kt);

      const kp = document.createElement('div');
      kp.className='kinesio-panel'+(ti===0?' open':'');
      kp.id = tabId;

      tab.progs.forEach((prog, pi) => {
        if (pi>0) { const div=document.createElement('div'); div.className='kprog-divider'; kp.appendChild(div); }
        const row = document.createElement('div'); row.className='kprog-row';
        const wk = document.createElement('div'); wk.className='kprog-week'; wk.textContent=prog.week;
        const body = document.createElement('div'); body.className='kprog-body';
        const title = document.createElement('div'); title.className='kprog-title'; title.textContent=prog.title;
        const detail = document.createElement('div'); detail.className='kprog-detail'; detail.textContent=prog.detail;
        const ptags = document.createElement('div'); ptags.className='kprog-params';
        (prog.params||[]).forEach(p=>{ const s=document.createElement('span');s.className='kp-tag';s.textContent=p;ptags.appendChild(s); });
        body.appendChild(title); body.appendChild(detail); body.appendChild(ptags);
        if (prog.ref) {
          const rb2 = document.createElement('div'); rb2.className='kref-box';
          rb2.innerHTML=`<span class="kref-icon">📖</span><span class="kref-text">${prog.ref}</span>`;
          body.appendChild(rb2);
        }
        row.appendChild(wk); row.appendChild(body);
        kp.appendChild(row);
      });
      kpanels.appendChild(kp);
    });

    ksec.appendChild(ktabs);
    ksec.appendChild(kpanels);
    c.appendChild(ksec);
  }

  const rb=document.createElement('button');rb.className='restart-btn';rb.innerHTML='↩ Reiniciar flujograma';rb.onclick=()=>renderFlow('start');c.appendChild(rb);
}

/* ===== MODAL ===== */
function openModal(agent) {
  document.getElementById('modal-inner').innerHTML = `
    <div class="modal-title">${agent.name}</div>
    <div class="modal-sub">${agent.effect}</div>
    <div class="modal-params"><strong style="display:block;margin-bottom:6px;color:var(--text);">Parámetros</strong>${agent.params}</div>
    <div class="modal-effect" style="color:var(--text2);font-size:13px;line-height:1.65;"><strong style="color:var(--text);">Mecanismo</strong><br>${agent.mech||'Ver sección Mecanismos para más detalle.'}</div>`;
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal(e) {
  if (!e || e.target === document.getElementById('modal-overlay')) {
    document.getElementById('modal-overlay').classList.remove('open');
  }
}

/* ===== CALCULADORA US ===== */
function buildUSDosageCalc(panel) {
  const uid = 'usc' + Math.random().toString(36).slice(2, 7);

  const wrap = document.createElement('div');
  wrap.style.cssText = 'margin-top:20px;margin-bottom:14px;';

  const lbl = document.createElement('div');
  lbl.style.cssText = 'font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;';
  lbl.textContent = '🧮 Calculadora de dosificación';
  wrap.appendChild(lbl);

  const card = document.createElement('div');
  card.style.cssText = 'background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius-lg);padding:18px;';

  // Fórmula explicativa
  card.innerHTML = `
    <div style="background:rgba(79,158,247,0.07);border:1px solid rgba(79,158,247,0.2);border-radius:var(--radius-sm);padding:12px 14px;margin-bottom:16px;font-size:12px;color:var(--text2);line-height:1.8;">
      <strong style="color:var(--accent2);">Fórmula:</strong>
      T (min) = <strong style="color:var(--text);">Dosis (J/cm²) × Área (cm²)</strong> ÷ [I (W/cm²) × Ciclo × ERA (cm²) × 60]
      <br><span style="font-size:11px;color:var(--text3);">
        Continuo → Ciclo = 1.0 &nbsp;·&nbsp; Pulsado 1:1 (50%) → 0.5 &nbsp;·&nbsp; Pulsado 1:4 (20%) → 0.2
        <br>Dosis en tejido diana: Aguda 8–20 J/cm² · Subaguda 30–60 J/cm² · Crónica 60–120 J/cm²
      </span>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text3);margin-bottom:5px;">Frecuencia</div>
        <select id="${uid}-freq" style="width:100%;padding:8px 10px;border-radius:var(--radius-sm);background:var(--surface2);border:1px solid var(--border2);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;">
          <option value="1">1 MHz — profundo (3–5 cm)</option>
          <option value="3">3 MHz — superficial (1–2 cm)</option>
        </select>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text3);margin-bottom:5px;">Modo / Ciclo de trabajo</div>
        <select id="${uid}-dc" style="width:100%;padding:8px 10px;border-radius:var(--radius-sm);background:var(--surface2);border:1px solid var(--border2);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;">
          <option value="1.0">Continuo 100%</option>
          <option value="0.5">Pulsado 1:1 — 50%</option>
          <option value="0.2" selected>Pulsado 1:4 — 20%</option>
        </select>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text3);margin-bottom:5px;">Intensidad aplicada (W/cm²)</div>
        <input type="number" id="${uid}-int" value="0.5" min="0.1" max="3.0" step="0.1"
          style="width:100%;padding:8px 10px;border-radius:var(--radius-sm);background:var(--surface2);border:1px solid var(--border2);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;">
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text3);margin-bottom:5px;">ERA del cabezal (cm²)</div>
        <input type="number" id="${uid}-era" value="5" min="1" max="15" step="0.5"
          style="width:100%;padding:8px 10px;border-radius:var(--radius-sm);background:var(--surface2);border:1px solid var(--border2);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;">
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text3);margin-bottom:5px;">Área de tratamiento (cm²)</div>
        <input type="number" id="${uid}-area" value="20" min="1" max="300" step="1"
          style="width:100%;padding:8px 10px;border-radius:var(--radius-sm);background:var(--surface2);border:1px solid var(--border2);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;">
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text3);margin-bottom:5px;">Dosis objetivo en tejido (J/cm²)</div>
        <input type="number" id="${uid}-dose" value="12" min="1" max="200" step="1"
          style="width:100%;padding:8px 10px;border-radius:var(--radius-sm);background:var(--surface2);border:1px solid var(--border2);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;">
      </div>
    </div>

    <!-- Resultado -->
    <div id="${uid}-res" style="background:rgba(0,194,178,0.07);border:1px solid rgba(0,194,178,0.22);border-radius:var(--radius-md);padding:14px 16px;margin-bottom:16px;">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px;">
        <div style="text-align:center;">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:3px;">Tiempo sesión</div>
          <div id="${uid}-tmin" style="font-size:22px;font-weight:700;color:var(--accent);font-family:'DM Serif Display',serif;">—</div>
          <div style="font-size:10px;color:var(--text3);">min</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:3px;">I-SATA efectiva</div>
          <div id="${uid}-sata" style="font-size:22px;font-weight:700;color:var(--amber);font-family:'DM Serif Display',serif;">—</div>
          <div style="font-size:10px;color:var(--text3);">W/cm²</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:3px;">Energía total</div>
          <div id="${uid}-etot" style="font-size:22px;font-weight:700;color:var(--accent2);font-family:'DM Serif Display',serif;">—</div>
          <div style="font-size:10px;color:var(--text3);">J</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:3px;">Pases ERA</div>
          <div id="${uid}-pases" style="font-size:22px;font-weight:700;color:var(--purple);font-family:'DM Serif Display',serif;">—</div>
          <div style="font-size:10px;color:var(--text3);">pasadas</div>
        </div>
      </div>
      <div id="${uid}-interp" style="font-size:11.5px;color:var(--text2);border-top:1px solid rgba(0,194,178,0.15);padding-top:10px;line-height:1.65;"></div>
    </div>

    <!-- Tabla de referencia -->
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:8px;">📋 Tabla de protocolos clínicos (ERA 5 cm² · Área 20 cm²)</div>
    <div class="table-wrap">
      <table class="param-table">
        <thead><tr><th>Fase</th><th>Modo · Ciclo</th><th>Intensidad</th><th>I-SATA</th><th>Dosis diana</th><th>Tiempo calculado</th><th>Efecto</th></tr></thead>
        <tbody>
          <tr>
            <td><span class="mode-badge c-red" style="background:var(--red-bg);border:1px solid var(--red-border);color:var(--red)">Aguda</span></td>
            <td>Pulsado 1:4 · 20%</td>
            <td class="param-val">0.3–0.8 W/cm²</td>
            <td class="param-val" id="${uid}-sata1">—</td>
            <td class="param-val">8–20 J/cm²</td>
            <td class="param-val" id="${uid}-t1">—</td>
            <td class="param-effect">Bioestimulación sin calor</td>
          </tr>
          <tr>
            <td><span class="mode-badge c-amber" style="background:var(--amber-bg);border:1px solid var(--amber-border);color:var(--amber)">Subaguda</span></td>
            <td>Pulsado 1:1 · 50%</td>
            <td class="param-val">0.5–1.0 W/cm²</td>
            <td class="param-val" id="${uid}-sata2">—</td>
            <td class="param-val">30–60 J/cm²</td>
            <td class="param-val" id="${uid}-t2">—</td>
            <td class="param-effect">Mecánico + leve calor</td>
          </tr>
          <tr>
            <td><span class="mode-badge c-green" style="background:var(--green-bg);border:1px solid var(--green-border);color:var(--green)">Crónica</span></td>
            <td>Continuo · 100%</td>
            <td class="param-val">0.8–2.0 W/cm²</td>
            <td class="param-val" id="${uid}-sata3">—</td>
            <td class="param-val">60–120 J/cm²</td>
            <td class="param-val" id="${uid}-t3">—</td>
            <td class="param-effect">Calor profundo, elongación</td>
          </tr>
          <tr>
            <td><span class="mode-badge c-teal" style="background:var(--teal-bg);border:1px solid var(--teal-border);color:var(--teal)">Tendinopatía</span></td>
            <td>Pulsado 1:1 · 50%</td>
            <td class="param-val">0.5–1.5 W/cm²</td>
            <td class="param-val" id="${uid}-sata4">—</td>
            <td class="param-val">30–60 J/cm²</td>
            <td class="param-val" id="${uid}-t4">—</td>
            <td class="param-effect">Estimulación tenocitos</td>
          </tr>
          <tr>
            <td><span class="mode-badge c-blue" style="background:var(--blue-bg);border:1px solid var(--blue-border);color:var(--blue)">Cartílago</span></td>
            <td>Pulsado 1:4 · 20%</td>
            <td class="param-val">0.5–1.5 W/cm²</td>
            <td class="param-val" id="${uid}-sata5">—</td>
            <td class="param-val">8–20 J/cm²</td>
            <td class="param-val" id="${uid}-t5">—</td>
            <td class="param-effect">Condrogénesis, sin calor</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div style="font-size:10px;color:var(--text3);margin-top:5px;">* Tiempos con valores medios de intensidad y dosis para ERA=5 cm² y área=20 cm²</div>`;

  wrap.appendChild(card);
  panel.appendChild(wrap);

  function calcTime(dose, area, intensity, dc, era) {
    if (!intensity || !dc || !era || !area || !dose) return null;
    return (dose * area) / (intensity * dc * era * 60);
  }

  function update() {
    const freq  = parseFloat(document.getElementById(uid+'-freq').value);
    const dc    = parseFloat(document.getElementById(uid+'-dc').value);
    const int_  = parseFloat(document.getElementById(uid+'-int').value);
    const era   = parseFloat(document.getElementById(uid+'-era').value);
    const area  = parseFloat(document.getElementById(uid+'-area').value);
    const dose  = parseFloat(document.getElementById(uid+'-dose').value);

    if ([freq, dc, int_, era, area, dose].some(v => isNaN(v) || v <= 0)) return;

    const iSata  = int_ * dc;
    const tMin   = calcTime(dose, area, int_, dc, era);
    const tSec   = tMin * 60;
    const eTotal = iSata * era * tSec;
    const pases  = area / era;

    document.getElementById(uid+'-tmin').textContent  = tMin.toFixed(1);
    document.getElementById(uid+'-sata').textContent  = iSata.toFixed(2);
    document.getElementById(uid+'-etot').textContent  = eTotal.toFixed(0);
    document.getElementById(uid+'-pases').textContent = pases.toFixed(1);

    const modeLabel = dc === 1.0 ? 'continuo (100%)' : `pulsado ${Math.round(dc*100)}%`;
    let interp = `${freq} MHz · modo <strong style="color:var(--text)">${modeLabel}</strong> · ${int_} W/cm² → I-SATA <strong style="color:var(--amber)">${iSata.toFixed(2)} W/cm²</strong>. `;
    interp += `Para alcanzar <strong style="color:var(--text)">${dose} J/cm²</strong> en ${area} cm² con ERA ${era} cm²: `;
    interp += `<strong style="color:var(--accent)">${tMin.toFixed(1)} min de sesión</strong> (${Math.round(tSec)} s), ${pases.toFixed(1)} pasadas sobre el área.`;
    if (tMin > 15)  interp += ' <span style="color:var(--amber)">⚠ Sesión larga — aumentar intensidad o reducir área por sesión.</span>';
    if (tMin < 2)   interp += ' <span style="color:var(--blue)">⚠ Sesión muy corta — verificar que la dosis es adecuada para la fase.</span>';
    if (dc === 1.0 && int_ > 1.5) interp += ' <span style="color:var(--red)">⚠ Continuo alta intensidad — verificar ausencia de contraindicaciones térmicas.</span>';
    document.getElementById(uid+'-interp').innerHTML = interp;

    // Tabla de referencia con ERA=5, área=20
    const refEra = 5, refArea = 20;
    const rows = [
      { dc:0.2, i:0.55, dose:12  },
      { dc:0.5, i:0.75, dose:40  },
      { dc:1.0, i:1.4,  dose:80  },
      { dc:0.5, i:1.0,  dose:40  },
      { dc:0.2, i:0.8,  dose:12  },
    ];
    rows.forEach((r, idx) => {
      const n = idx + 1;
      const t = calcTime(r.dose, refArea, r.i, r.dc, refEra);
      const sata = r.i * r.dc;
      document.getElementById(uid+'-t'    + n).textContent = t ? t.toFixed(1) + ' min' : '—';
      document.getElementById(uid+'-sata' + n).textContent = sata.toFixed(2) + ' W/cm²';
    });
  }

  ['freq','dc','int','era','area','dose'].forEach(k => {
    const el = document.getElementById(uid+'-'+k);
    if (el) { el.addEventListener('input', update); el.addEventListener('change', update); }
  });

  update();
}

/* ===== REFERENCIA ===== */
function buildRef() {
  const tabs = document.getElementById('ref-tabs');
  const cont = document.getElementById('ref-content');
  REF_AGENTS.forEach((a,i) => {
    const t = document.createElement('button');
    t.className = 'ref-tab' + (i===0?' active':'');
    t.textContent = a.icon + ' ' + a.name;
    t.onclick = () => {
      document.querySelectorAll('.ref-tab').forEach(x=>x.classList.remove('active'));
      document.querySelectorAll('.ref-panel').forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      document.getElementById('ref-panel-'+a.id).classList.add('active');
    };
    tabs.appendChild(t);

    const p = document.createElement('div');
    p.className = 'ref-panel' + (i===0?' active':'');
    p.id = 'ref-panel-'+a.id;

    // Header
    const hdr = document.createElement('div'); hdr.className='ref-agent-header';
    hdr.innerHTML = `<div class="agent-icon ${a.color}" style="background:var(--${a.color.split('-')[1]}-bg);border:1px solid var(--${a.color.split('-')[1]}-border);font-size:18px;">${a.icon}</div>
      <div><div class="ref-agent-name">${a.name}</div><div class="ref-agent-sub">${a.sub}</div>
      <div class="ref-agent-tags">${a.tags.map(t=>`<span class="tag ${t.c}" style="background:var(--${t.c.split('-')[1]}-bg);border-color:var(--${t.c.split('-')[1]}-border);color:var(--${t.c.split('-')[1]})">${t.l}</span>`).join('')}</div></div>`;
    p.appendChild(hdr);

    // Mecanismo de acción
    if (a.mecanismo) {
      const mechDiv = document.createElement('div');
      mechDiv.style.cssText = 'margin-bottom:14px;';
      mechDiv.innerHTML = `
        <div style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">⚗ Mecanismo de acción</div>
        <div class="mech-body" style="background:var(--surface);border:1px solid var(--border2);border-radius:12px;padding:14px 16px;">${a.mecanismo}</div>`;
      p.appendChild(mechDiv);
    }

    // Indicaciones clínicas
    if (a.indicaciones && a.indicaciones.length > 0) {
      const indDiv = document.createElement('div');
      indDiv.style.cssText = 'margin-bottom:14px;';
      const colorKey = a.color.split('-')[1];
      const indHTML = a.indicaciones.map(ind => `
        <div style="padding:10px 14px;border-bottom:1px solid var(--border);display:flex;gap:10px;align-items:flex-start;">
          <span style="color:var(--${colorKey});font-size:13px;flex-shrink:0;margin-top:1px;">▸</span>
          <div>
            <div style="font-size:12px;font-weight:600;color:var(--text);margin-bottom:3px;">${ind.tit}</div>
            <div style="font-size:12px;color:var(--text2);line-height:1.6;">${ind.det}</div>
          </div>
        </div>`).join('');
      indDiv.innerHTML = `
        <div style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">🎯 Indicaciones clínicas</div>
        <div style="background:var(--surface);border:1px solid var(--border2);border-radius:12px;overflow:hidden;">${indHTML}</div>`;
      p.appendChild(indDiv);
    }

    // Tabla de parámetros
    const tblLabel = document.createElement('div');
    tblLabel.style.cssText = 'font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;';
    tblLabel.textContent = '⚡ Parámetros y modos de aplicación';
    p.appendChild(tblLabel);

    const tbl = document.createElement('table'); tbl.className='param-table';
    tbl.innerHTML = `<thead><tr><th>Modo</th><th>Frecuencia / Parámetro</th><th>Dosis / Intensidad</th><th>Tiempo / Sesiones</th><th>Efecto clínico</th></tr></thead>`;
    const tbody = document.createElement('tbody');
    a.params.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td><span class="mode-badge ${row.mc}" style="background:var(--${row.mc.split('-')[1]}-bg);border:1px solid var(--${row.mc.split('-')[1]}-border);color:var(--${row.mc.split('-')[1]})">${row.mode}</span></td>
        <td class="param-val">${row.freq}</td>
        <td class="param-val">${row.int}</td>
        <td>${row.time}</td>
        <td class="param-effect">${row.effect}</td>`;
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
    const tblWrap = document.createElement('div'); tblWrap.className = 'table-wrap';
    tblWrap.appendChild(tbl);
    p.appendChild(tblWrap);

    // Tabla de frecuencias adicionales (PRF / portadora / ancho de pulso / pulsado)
    if (a.freq_extra && a.freq_extra.length > 0) {
      const fxDiv = document.createElement('div');
      fxDiv.style.cssText = 'margin-bottom:14px;';

      const fxLabel = document.createElement('div');
      fxLabel.style.cssText = 'font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;margin-top:18px;';
      fxLabel.textContent = a.freq_extra_label || '📡 Parámetros de frecuencia';
      fxDiv.appendChild(fxLabel);

      if (a.freq_extra_intro) {
        const introBox = document.createElement('div');
        introBox.className = 'note-box';
        introBox.style.cssText = 'margin-bottom:10px;font-size:12px;';
        introBox.innerHTML = a.freq_extra_intro;
        fxDiv.appendChild(introBox);
      }

      const fxTbl = document.createElement('table');
      fxTbl.className = 'param-table';
      fxTbl.innerHTML = `<thead><tr><th>Valor</th><th>Fibra / Efecto dominante</th><th>Descripción clínica</th><th>Indicación principal</th></tr></thead>`;
      const fxBody = document.createElement('tbody');
      a.freq_extra.forEach(row => {
        const tr = document.createElement('tr');
        const colKey = row.mc.split('-')[1];
        tr.innerHTML = `
          <td><span class="mode-badge ${row.mc}" style="background:var(--${colKey}-bg);border:1px solid var(--${colKey}-border);color:var(--${colKey});white-space:nowrap;">${row.val}</span></td>
          <td style="font-weight:600;color:var(--text);font-size:12px;">${row.fibra}</td>
          <td style="font-size:11.5px;color:var(--text2);line-height:1.6;">${row.desc}</td>
          <td style="font-size:11px;color:var(--accent);font-weight:500;">${row.uso}</td>`;
        fxBody.appendChild(tr);
      });
      fxTbl.appendChild(fxBody);
      const fxWrap = document.createElement('div'); fxWrap.className = 'table-wrap';
      fxWrap.appendChild(fxTbl);
      fxDiv.appendChild(fxWrap);
      p.appendChild(fxDiv);
    }

    // Calculadora de dosificación (US)
    if (a.dosage_calculator) buildUSDosageCalc(p);

    // Técnica (si existe)
    if (a.tecnica) {
      const tecDiv = document.createElement('div');
      tecDiv.style.cssText = 'margin-bottom:14px;';
      tecDiv.innerHTML = `
        <div style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">🖐 Técnica de aplicación</div>
        <div class="note-box">${a.tecnica}</div>`;
      p.appendChild(tecDiv);
    }

    // Evidencia científica
    if (a.evidencia) {
      const evDiv = document.createElement('div');
      evDiv.style.cssText = 'margin-bottom:14px;';
      evDiv.innerHTML = `
        <div style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">📖 Evidencia científica clave</div>
        <div class="note-box" style="border-left-color:var(--accent);font-size:11.5px;">${a.evidencia}</div>`;
      p.appendChild(evDiv);
    }

    // Contraindicaciones
    const cb = document.createElement('div'); cb.className='contra-box';
    cb.innerHTML = `<div class="contra-title">⚠ Contraindicaciones principales</div>${a.contra}`;
    p.appendChild(cb);
    cont.appendChild(p);
  });
}

/* ===== MECANISMOS ===== */
function buildMech() {
  const c = document.getElementById('mech-content');
  const colors = ['c-blue','c-green','c-amber','c-pink','c-purple','c-coral','c-teal'];
  MECHS.forEach((m,i) => {
    const card = document.createElement('div'); card.className='mech-card';
    const hdr = document.createElement('div'); hdr.className='mech-header';
    const num = document.createElement('div');
    num.className = 'mech-num';
    const col = colors[i%colors.length];
    const colKey = col.split('-')[1];
    num.style.background = `var(--${colKey}-bg)`;
    num.style.color = `var(--${colKey})`;
    num.style.border = `1px solid var(--${colKey}-border)`;
    num.textContent = m.num;
    const name = document.createElement('div'); name.className='mech-name'; name.textContent=m.name;
    hdr.appendChild(num); hdr.appendChild(name);
    const body = document.createElement('div'); body.className='mech-body'; body.innerHTML=m.body;
    card.appendChild(hdr); card.appendChild(body);
    c.appendChild(card);
  });
}

function buildTime() {
  const tabs = document.getElementById('tissue-tabs');
  const cont = document.getElementById('tissue-content');
  const phaseColors = { red:['red','red'], amber:['amber','amber'], green:['green','green'], blue:['blue','blue'] };
  const agentColors = { blue:'blue', amber:'amber', pink:'pink', coral:'coral', green:'green', purple:'purple', teal:'teal', red:'red' };

  TISSUES.forEach((t,i) => {
    const tab = document.createElement('button');
    tab.className = 'tissue-tab' + (i===0?' active':'');
    tab.textContent = t.icon + ' ' + t.name;
    tab.onclick = () => {
      document.querySelectorAll('.tissue-tab').forEach(x=>x.classList.remove('active'));
      document.querySelectorAll('.tissue-panel').forEach(x=>x.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tissue-panel-'+t.id).classList.add('active');
    };
    tabs.appendChild(tab);

    const panel = document.createElement('div');
    panel.className = 'tissue-panel' + (i===0?' active':'');
    panel.id = 'tissue-panel-'+t.id;

    const hdr = document.createElement('div'); hdr.className='tissue-header';
    const iconEl = document.createElement('div');
    iconEl.className = 'tissue-icon';
    iconEl.style.background = `var(--${t.color}-bg)`;
    iconEl.style.border = `1px solid var(--${t.color}-border)`;
    iconEl.textContent = t.icon;
    const info = document.createElement('div');
    info.innerHTML = `<div class="tissue-name">${t.name}</div><div class="tissue-desc">${t.desc}</div>
      <div class="tissue-timing">${t.timingPills.map(p=>`<span class="timing-pill" style="background:var(--${p.c}-bg);border-color:var(--${p.c}-border);color:var(--${p.c})">${p.l}</span>`).join('')}</div>`;
    hdr.appendChild(iconEl); hdr.appendChild(info);
    panel.appendChild(hdr);

    const barDiv = document.createElement('div'); barDiv.className='timeline-bar';
    t.phases.forEach(ph => {
      const seg = document.createElement('div'); seg.className='tbar-seg';
      seg.style.flex='1';
      seg.style.background = `var(--${ph.color})`;
      seg.style.opacity = '0.5';
      barDiv.appendChild(seg);
    });
    panel.appendChild(barDiv);

    t.phases.forEach(ph => {
      const block = document.createElement('div'); block.className='phase-block';
      block.style.borderLeftColor = `var(--${ph.color})`;
      const bh = document.createElement('div'); bh.className='phase-block-header';
      const bt = document.createElement('div'); bt.className='phase-block-title'; bt.textContent=ph.name;
      const btime = document.createElement('div'); btime.className='phase-block-time';
      btime.style.background=`var(--${ph.color}-bg)`;
      btime.style.borderColor=`var(--${ph.color}-border)`;
      btime.style.color=`var(--${ph.color})`;
      btime.textContent=ph.time;
      bh.appendChild(bt); bh.appendChild(btime);
      const bb = document.createElement('div'); bb.className='phase-block-body'; bb.innerHTML='<p>'+ph.body+'</p>';
      block.appendChild(bh); block.appendChild(bb);
      if (ph.agents && ph.agents.length) {
        const pa = document.createElement('div'); pa.className='phase-block-agents';
        const pl = document.createElement('div'); pl.className='phase-agents-label'; pl.textContent='Agentes físicos recomendados';
        const ptags = document.createElement('div'); ptags.className='phase-agent-tags';
        ph.agents.forEach(a => {
          const span = document.createElement('span'); span.className='pat';
          span.style.background=`var(--${a.c}-bg)`;
          span.style.borderColor=`var(--${a.c}-border)`;
          span.style.color=`var(--${a.c})`;
          span.textContent=a.l;
          ptags.appendChild(span);
        });
        pa.appendChild(pl); pa.appendChild(ptags);
        block.appendChild(pa);
      }
      panel.appendChild(block);
    });

    if (t.note) {
      const tn = document.createElement('div'); tn.className='tissue-note'; tn.innerHTML=t.note;
      panel.appendChild(tn);
    }
    cont.appendChild(panel);
  });
}

function buildKine() {
  const tabs = document.getElementById('kp-cat-tabs');
  const cont = document.getElementById('kp-content');
  KINE_CATS.forEach((cat, ci) => {
    const tab = document.createElement('button');
    tab.className = 'kp-cat-tab' + (ci===0?' active':'');
    tab.textContent = cat.icon + ' ' + cat.label;
    tab.onclick = () => {
      document.querySelectorAll('.kp-cat-tab').forEach(x=>x.classList.remove('active'));
      document.querySelectorAll('.kp-cat-panel').forEach(x=>x.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('kp-panel-'+cat.id).classList.add('active');
    };
    tabs.appendChild(tab);

    const panel = document.createElement('div');
    panel.className = 'kp-cat-panel' + (ci===0?' active':'');
    panel.id = 'kp-panel-'+cat.id;

    const techs = KINE_TECHS[cat.id] || [];
    techs.forEach((tech, ti) => {
      const card = document.createElement('div'); card.className='kt-card';
      const hdr = document.createElement('div'); hdr.className='kt-card-header';
      hdr.innerHTML = `
        <div class="kt-badge" style="background:var(--${cat.color}-bg);border:1px solid var(--${cat.color}-border)">${cat.icon}</div>
        <div style="flex:1;min-width:0">
          <div class="kt-card-title">${tech.title}</div>
          <div class="kt-card-sub">${tech.sub}</div>
        </div>
        <span class="kt-chevron">▼</span>`;
      hdr.onclick = () => {
        const body = card.querySelector('.kt-card-body');
        const chev = hdr.querySelector('.kt-chevron');
        const isOpen = body.classList.contains('open');
        body.classList.toggle('open', !isOpen);
        chev.style.transform = isOpen ? '' : 'rotate(180deg)';
      };
      card.appendChild(hdr);

      const body = document.createElement('div'); body.className='kt-card-body';
      let html = `<div class="kt-desc">${tech.desc}</div><div class="kt-phases">`;
      tech.phases.forEach(ph => {
        html += `<div class="kt-phase ${ph.col}">
          <div class="kt-phase-row">
            <span class="kt-phase-name">${ph.phase}</span>
            <span class="kt-phase-pill ${ph.pill}" style="background:var(--${ph.col.includes('red')?'red':ph.col.includes('amber')?'amber':'green'}-bg);color:var(--${ph.col.includes('red')?'red':ph.col.includes('amber')?'amber':'green'})"></span>
          </div>
          <div class="kt-phase-detail">${ph.detail}</div>
          <div class="kt-phase-params">${(ph.params||[]).map(p=>`<span class="kt-param">${p}</span>`).join('')}</div>
        </div>`;
      });
      html += `</div>`;
      if (tech.ref) {
        html += `<div class="kt-ref"><span class="kt-ref-icon">📖</span><span class="kt-ref-text">${tech.ref}</span></div>`;
      }
      body.innerHTML = html;
      card.appendChild(body);
      panel.appendChild(card);
    });
    cont.appendChild(panel);
  });
}
function buildPharma() {
  const tabs = document.getElementById('pharma-cat-tabs');
  const cont = document.getElementById('pharma-content');
  PHARMA_CATS.forEach((cat, ci) => {
    const tab = document.createElement('button');
    tab.className = 'pharma-cat-tab' + (ci === 0 ? ' active' : '');
    tab.textContent = cat.icon + ' ' + cat.label;
    tab.onclick = () => {
      document.querySelectorAll('.pharma-cat-tab').forEach(x => x.classList.remove('active'));
      document.querySelectorAll('.pharma-cat-panel').forEach(x => x.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('pharma-panel-' + cat.id).classList.add('active');
    };
    tabs.appendChild(tab);

    const panel = document.createElement('div');
    panel.className = 'pharma-cat-panel' + (ci === 0 ? ' active' : '');
    panel.id = 'pharma-panel-' + cat.id;

    const drugs = PHARMA_DRUGS[cat.id] || [];
    drugs.forEach(drug => {
      const card = document.createElement('div'); card.className = 'drug-card';
      const hdr = document.createElement('div'); hdr.className = 'drug-card-header';
      hdr.innerHTML = `
        <div class="drug-badge" style="background:var(--${drug.color}-bg);border:1px solid var(--${drug.color}-border)">${drug.icon}</div>
        <div style="flex:1;min-width:0">
          <div class="drug-name">${drug.name}</div>
          <div class="drug-generic">${drug.generic}</div>
          <div class="drug-phase-pills">${drug.phases.map(p=>`<span class="drug-phase-pill" style="background:var(--${p.c}-bg);border-color:var(--${p.c}-border);color:var(--${p.c})">${p.l}</span>`).join('')}</div>
        </div>
        <span class="drug-chevron">▼</span>`;
      hdr.onclick = () => {
        const body = card.querySelector('.drug-card-body');
        const chev = hdr.querySelector('.drug-chevron');
        const isOpen = body.classList.contains('open');
        body.classList.toggle('open', !isOpen);
        chev.style.transform = isOpen ? '' : 'rotate(180deg)';
      };
      card.appendChild(hdr);

      const body = document.createElement('div'); body.className = 'drug-card-body';
      body.innerHTML = `
        <div class="drug-duration" style="background:var(--${drug.color}-bg);border:1px solid var(--${drug.color}-border);color:var(--${drug.color})">⏱ ${drug.duration}</div>
        <div class="drug-mech">🔬 <strong>Mecanismo:</strong> ${drug.mechanism}</div>
        <div class="table-wrap"><table class="drug-dose-table">
          <thead><tr><th>Vía</th><th>Dosis</th><th>Frecuencia</th><th>Máximo</th></tr></thead>
          <tbody>${drug.doses.map(d=>`<tr><td class="dose-val">${d.route}</td><td class="dose-val">${d.dose}</td><td>${d.freq}</td><td>${d.max}</td></tr>`).join('')}</tbody>
        </table></div>
        <div class="drug-interaction">
          <div class="drug-interaction-title">⚕ Interacción con fisioterapia</div>
          <div class="drug-interaction-body">${drug.ftInteraction}</div>
        </div>
        <div class="drug-contra">
          <div class="drug-contra-title">⚠ Contraindicaciones</div>
          <div class="drug-contra-body">${drug.contra}</div>
        </div>
        <div class="drug-note">${drug.note}</div>`;
      card.appendChild(body);
      panel.appendChild(card);
    });
    cont.appendChild(panel);
  });
}

/* ===== PRUEBAS FUNCIONALES ===== */
function buildPruebas() {
  const searchInput = document.getElementById('pruebas-search');
  const resultArea  = document.getElementById('pruebas-result');

  function colorClass(c) {
    const map = {
      red:'c-red', amber:'c-amber', blue:'c-blue', green:'c-green',
      purple:'c-purple', teal:'c-teal', coral:'c-coral', pink:'c-pink', gray:'c-gray'
    };
    return map[c] || 'c-gray';
  }

  function renderCard(p, seg) {
    const colKey = p.color;
    const card = document.createElement('div');
    card.style.cssText = `background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius-lg);margin-bottom:12px;overflow:hidden;transition:border-color .2s;`;

    const hdr = document.createElement('div');
    hdr.style.cssText = `display:flex;align-items:center;gap:12px;padding:14px 18px;cursor:pointer;user-select:none;`;
    hdr.innerHTML = `
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:17px;background:var(--${colKey}-bg);border:1px solid var(--${colKey}-border);">${seg.icon}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text3);margin-bottom:3px;">${seg.label}</div>
        <div style="font-family:'DM Serif Display',serif;font-size:15px;color:var(--text);margin-bottom:2px;">${p.nombre}</div>
        <div style="font-size:11px;color:var(--text3);line-height:1.4;">${p.objetivo}</div>
      </div>
      <span class="prueba-chevron" style="font-size:11px;color:var(--text3);transition:transform .2s;flex-shrink:0;">▼</span>`;

    const body = document.createElement('div');
    body.style.cssText = `display:none;border-top:1px solid var(--border);padding:16px 18px 18px;`;

    const objBox = document.createElement('div');
    objBox.style.cssText = `background:var(--${colKey}-bg);border:1px solid var(--${colKey}-border);border-radius:var(--radius-sm);padding:10px 13px;margin-bottom:14px;`;
    objBox.innerHTML = `<div style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--${colKey});margin-bottom:4px;">🎯 Para qué sirve</div>
      <div style="font-size:12.5px;color:var(--text);line-height:1.65;">${p.objetivo}</div>`;
    body.appendChild(objBox);

    const stepsLabel = document.createElement('div');
    stepsLabel.style.cssText = `font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:10px;`;
    stepsLabel.textContent = '🖐 Cómo se realiza';
    body.appendChild(stepsLabel);

    const ol = document.createElement('ol');
    ol.style.cssText = `padding-left:0;list-style:none;display:flex;flex-direction:column;gap:8px;`;
    p.pasos.forEach((paso, i) => {
      const li = document.createElement('li');
      li.style.cssText = `display:flex;gap:10px;align-items:flex-start;`;
      li.innerHTML = `
        <span style="flex-shrink:0;width:22px;height:22px;border-radius:50%;background:var(--${colKey}-bg);border:1px solid var(--${colKey}-border);color:var(--${colKey});font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;">${i+1}</span>
        <span style="font-size:12.5px;color:var(--text2);line-height:1.65;padding-top:2px;">${paso}</span>`;
      ol.appendChild(li);
    });
    body.appendChild(ol);

    hdr.onclick = () => {
      const isOpen = body.style.display === 'block';
      body.style.display = isOpen ? 'none' : 'block';
      hdr.querySelector('.prueba-chevron').style.transform = isOpen ? '' : 'rotate(180deg)';
    };

    card.appendChild(hdr);
    card.appendChild(body);
    return card;
  }

  function renderPruebas(query) {
    resultArea.innerHTML = '';
    const q = query.trim().toLowerCase();

    if (!q) {
      resultArea.innerHTML = `<div style="color:var(--text3);font-size:13px;padding:18px 0;text-align:center;">Escribe un segmento (ej: <em>rodilla</em>) o el nombre de una prueba.</div>`;
      return;
    }

    let total = 0;
    PRUEBAS_SEGMENTOS.forEach(seg => {
      // coincide si el query está en el nombre del segmento O en el nombre de la prueba
      const segMatch = seg.label.toLowerCase().includes(q);
      const pruebas = (PRUEBAS_DATA[seg.id] || []).filter(p =>
        segMatch || p.nombre.toLowerCase().includes(q)
      );
      if (pruebas.length === 0) return;

      // encabezado de segmento
      const secHeader = document.createElement('div');
      secHeader.style.cssText = `display:flex;align-items:center;gap:8px;margin:18px 0 10px;`;
      secHeader.innerHTML = `
        <span style="font-size:18px;">${seg.icon}</span>
        <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text3);">${seg.label}</span>
        <span style="font-size:10px;color:var(--text3);margin-left:auto;">${pruebas.length} prueba${pruebas.length>1?'s':''}</span>`;
      resultArea.appendChild(secHeader);

      pruebas.forEach(p => resultArea.appendChild(renderCard(p, seg)));
      total += pruebas.length;
    });

    if (total === 0) {
      resultArea.innerHTML = `<div style="color:var(--text3);font-size:13px;padding:18px 0;text-align:center;">No se encontraron resultados para "<strong style="color:var(--text2);">${query.trim()}</strong>".</div>`;
    }
  }

  searchInput.addEventListener('input', () => renderPruebas(searchInput.value));

  // Estado inicial
  renderPruebas('');
}

function toggleSidebar() {
  const nav = document.querySelector('.bottom-nav');
  const overlay = document.getElementById('sidebar-overlay');
  nav.classList.toggle('open');
  overlay.classList.toggle('open');
}

function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  el.classList.add('active');
  window.scrollTo(0,0);
  // cerrar sidebar en mobile al navegar
  if (window.innerWidth < 769) {
    document.querySelector('.bottom-nav').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('open');
  }
}

/* ===== VÍAS DEL DOLOR ===== */
function buildDolor() {
  const c = document.getElementById('dolor-content');

  // Barra de progreso anatómica
  const bar = document.createElement('div'); bar.className = 'dolor-pathway';
  DOLOR_PATHWAY.forEach((node, i) => {
    const nodeEl = document.createElement('div'); nodeEl.className = 'dolor-pathway-node';
    const dot = document.createElement('div'); dot.className = 'dolor-pathway-dot';
    dot.style.background = `var(--${node.color})`;
    dot.style.boxShadow = `0 0 6px var(--${node.color})`;
    const label = document.createElement('div'); label.className = 'dolor-pathway-label';
    label.textContent = node.label;
    nodeEl.appendChild(dot); nodeEl.appendChild(label);
    bar.appendChild(nodeEl);
    if (i < DOLOR_PATHWAY.length - 1) {
      const line = document.createElement('div'); line.className = 'dolor-pathway-line';
      bar.appendChild(line);
    }
  });
  c.appendChild(bar);

  // Bloques accordion por nivel
  DOLOR_NIVELES.forEach(nivel => {
    const card = document.createElement('div'); card.className = 'nivel-card';

    // Header del accordion
    const hdr = document.createElement('div'); hdr.className = 'nivel-card-header';
    const num = document.createElement('div'); num.className = 'nivel-num';
    num.style.background = `var(--${nivel.color}-bg)`;
    num.style.color = `var(--${nivel.color})`;
    num.style.border = `1px solid var(--${nivel.color}-border)`;
    num.textContent = nivel.num;
    const title = document.createElement('div'); title.className = 'nivel-title';
    title.textContent = nivel.name;
    const chev = document.createElement('span'); chev.className = 'nivel-chevron';
    chev.textContent = '▼';
    hdr.appendChild(num); hdr.appendChild(title); hdr.appendChild(chev);

    // Body del accordion
    const body = document.createElement('div'); body.className = 'nivel-card-body';

    // Párrafo introductorio
    const intro = document.createElement('div');
    intro.className = 'mech-body'; intro.style.marginBottom = '16px';
    intro.innerHTML = nivel.intro;
    body.appendChild(intro);

    // ── Bloque 1: vías ascendentes ──────────────────────────────
    if (nivel.id === 'ascendente') {
      const tblLabel = document.createElement('div');
      tblLabel.style.cssText = 'font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;';
      tblLabel.textContent = '🔬 Tipos de fibras nociceptivas';
      body.appendChild(tblLabel);

      const tblWrap = document.createElement('div'); tblWrap.className = 'table-wrap';
      const tbl = document.createElement('table'); tbl.className = 'param-table';
      tbl.innerHTML = `<thead><tr><th>Fibra</th><th>Diámetro</th><th>Mielina</th><th>Velocidad</th><th>Tipo de dolor</th><th>Estímulo</th></tr></thead>`;
      const tbody = document.createElement('tbody');
      DOLOR_FIBRAS.forEach(f => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><span class="mode-badge" style="background:var(--${f.color}-bg);border:1px solid var(--${f.color}-border);color:var(--${f.color})">${f.fibra}</span></td>
          <td class="param-val">${f.diametro}</td>
          <td>${f.mielina}</td>
          <td class="param-val">${f.velocidad}</td>
          <td>${f.tipo}</td>
          <td style="font-size:11px;">${f.estimulo}</td>`;
        tbody.appendChild(tr);
      });
      tbl.appendChild(tbody);
      tblWrap.appendChild(tbl);
      body.appendChild(tblWrap);

      const recLabel = document.createElement('div');
      recLabel.style.cssText = 'font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);margin:14px 0 8px;';
      recLabel.textContent = '🧠 Recorrido ascendente';
      const recBox = document.createElement('div'); recBox.className = 'note-box';
      recBox.innerHTML = nivel.recorrido;
      body.appendChild(recLabel); body.appendChild(recBox);

    // ── Bloque 2: analgesia medular ─────────────────────────────
    } else if (nivel.id === 'medular') {
      nivel.mecanismos.forEach(mec => {
        const mecBox = document.createElement('div'); mecBox.className = 'mec-box';
        const mecTitle = document.createElement('div'); mecTitle.className = 'mec-box-title';
        mecTitle.textContent = mec.name;
        if (mec.ref) {
          const ref = document.createElement('span');
          ref.style.cssText = 'font-size:10px;color:var(--text3);font-family:"Plus Jakarta Sans",sans-serif;font-weight:400;margin-left:8px;';
          ref.textContent = mec.ref;
          mecTitle.appendChild(ref);
        }
        const mecBody = document.createElement('div'); mecBody.className = 'mec-box-body';
        mecBody.innerHTML = mec.body;
        mecBox.appendChild(mecTitle); mecBox.appendChild(mecBody);
        body.appendChild(mecBox);
      });

    // ── Bloque 3: analgesia supramedular ────────────────────────
    } else if (nivel.id === 'supramedular') {
      nivel.centros.forEach(centro => {
        const cc = document.createElement('div'); cc.className = 'centro-card';
        const ch = document.createElement('div'); ch.className = 'centro-header';
        const cnum = document.createElement('div'); cnum.className = 'centro-num';
        cnum.style.background = `var(--${centro.color}-bg)`;
        cnum.style.color = `var(--${centro.color})`;
        cnum.style.border = `1px solid var(--${centro.color}-border)`;
        cnum.textContent = centro.letra;
        const cname = document.createElement('div'); cname.className = 'centro-name';
        cname.textContent = centro.name;
        ch.appendChild(cnum); ch.appendChild(cname);
        const cb = document.createElement('div'); cb.className = 'centro-body';
        cb.innerHTML = centro.body;
        cc.appendChild(ch); cc.appendChild(cb);

        if (centro.agentes && centro.agentes.length) {
          const pa = document.createElement('div');
          pa.style.cssText = 'margin-top:10px;padding-top:10px;border-top:1px solid var(--border);';
          const pl = document.createElement('div');
          pl.style.cssText = 'font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:7px;';
          pl.textContent = 'Agentes físicos en este nivel';
          const ptags = document.createElement('div'); ptags.className = 'phase-agent-tags';
          centro.agentes.forEach(a => {
            const colKey = a.c.split('-')[1];
            const span = document.createElement('span'); span.className = 'pat';
            span.style.background = `var(--${colKey}-bg)`;
            span.style.borderColor = `var(--${colKey}-border)`;
            span.style.color = `var(--${colKey})`;
            span.textContent = a.name;
            ptags.appendChild(span);
          });
          pa.appendChild(pl); pa.appendChild(ptags);
          cc.appendChild(pa);
        }
        body.appendChild(cc);
      });
    }

    // Panel de agentes del nivel completo (bloques 2 y 3)
    if (nivel.agentes && nivel.agentes.length) {
      const pa = document.createElement('div'); pa.className = 'phase-block-agents';
      pa.style.marginTop = '16px';
      const pl = document.createElement('div'); pl.className = 'phase-agents-label';
      pl.textContent = 'Agentes físicos en este nivel';
      const ptags = document.createElement('div'); ptags.className = 'phase-agent-tags';
      nivel.agentes.forEach(a => {
        const colKey = a.c.split('-')[1];
        const span = document.createElement('span'); span.className = 'pat';
        span.style.background = `var(--${colKey}-bg)`;
        span.style.borderColor = `var(--${colKey}-border)`;
        span.style.color = `var(--${colKey})`;
        span.textContent = a.name;
        ptags.appendChild(span);
      });
      pa.appendChild(pl); pa.appendChild(ptags);
      body.appendChild(pa);
    }

    // Toggle accordion
    hdr.onclick = () => {
      const isOpen = body.classList.contains('open');
      body.classList.toggle('open', !isOpen);
      chev.style.transform = isOpen ? '' : 'rotate(180deg)';
    };

    card.appendChild(hdr); card.appendChild(body);
    c.appendChild(card);
  });
}

/* ===== INIT ===== */
renderFlow('start');
buildRef();
buildMech();
buildDolor();
buildTime();
buildKine();
buildPharma();
buildPruebas();
