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
    p.appendChild(tbl);

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
      fxDiv.appendChild(fxTbl);
      p.appendChild(fxDiv);
    }

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
        <table class="drug-dose-table">
          <thead><tr><th>Vía</th><th>Dosis</th><th>Frecuencia</th><th>Máximo</th></tr></thead>
          <tbody>${drug.doses.map(d=>`<tr><td class="dose-val">${d.route}</td><td class="dose-val">${d.dose}</td><td>${d.freq}</td><td>${d.max}</td></tr>`).join('')}</tbody>
        </table>
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

function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  el.classList.add('active');
  window.scrollTo(0,0);
}

/* ===== INIT ===== */
renderFlow('start');
buildRef();
buildMech();
buildTime();
buildKine();
buildPharma();
