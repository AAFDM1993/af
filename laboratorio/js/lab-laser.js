/* Módulo Láser del Laboratorio (migrado del simulador de proyección). */
LabCore.register({
  id: 'laser',
  title: 'Láser',
  css: `:host{--brown:#8A1F1F;--brown2:#B34747;--cream:#FBF6F0;--ink:#2B1B10;--line:#D9C7B6;--ok:#2E7D4F;--warn:#C77700;--bad:#B3261E;--blue:#1F5F8B}
*{box-sizing:border-box}
.lab{margin:0;background:var(--cream);color:var(--ink);font-family:Cambria,Georgia,serif;font-size:20px}
header{background:var(--brown);color:#fff;padding:12px 24px;display:flex;align-items:baseline;gap:18px;flex-wrap:wrap}
header h1{margin:0;font-size:28px}
header span{opacity:.85;font-size:17px}
.animbtn{margin-left:auto;font:inherit;font-size:16px;font-weight:bold;padding:6px 14px;border:2px solid #fff;border-radius:8px;background:transparent;color:#fff;cursor:pointer}
.animbtn:hover{background:rgba(255,255,255,.2)}
.cw{position:relative}
.cw canvas.ov{position:absolute;left:0;top:0;pointer-events:none;background:transparent}
.safety{background:#FFF1C9;border-bottom:3px solid #C77700;padding:8px 24px;font-size:17px;font-weight:bold;color:#5A3A00}
nav{display:flex;gap:6px;padding:10px 24px 0;border-bottom:3px solid var(--brown);flex-wrap:wrap}
nav button{font:inherit;font-weight:bold;padding:10px 22px;border:2px solid var(--brown);border-bottom:none;background:#fff;color:var(--brown);border-radius:10px 10px 0 0;cursor:pointer;transition:background .2s,color .2s}
nav button:hover{background:#F6E1E1}
nav button.on{background:var(--brown);color:#fff}
main{padding:16px 24px}
.tab{display:none}.tab.on{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:20px;animation:aparece .3s ease}
@keyframes aparece{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media(max-width:1000px){.tab.on{grid-template-columns:minmax(0,1fr)}}
.card{background:#fff;border:2px solid var(--line);border-radius:12px;padding:14px 16px;min-width:0}
.card+.card{margin-top:14px}
h2{margin:0 0 8px;color:var(--brown);font-size:24px}
canvas{width:100%;height:auto;display:block;background:#fff;border-radius:8px}
.row{display:flex;align-items:center;gap:12px;margin:10px 0;flex-wrap:wrap}
.row label{min-width:150px;font-weight:bold}
.seg{display:inline-flex;flex-wrap:wrap;max-width:100%;border:2px solid var(--brown);border-radius:8px;overflow:hidden}
.seg button{font:inherit;padding:6px 14px;border:none;background:#fff;color:var(--brown);cursor:pointer;border-right:1px solid var(--line);transition:background .2s,color .2s}
.seg button:hover{background:#F6E1E1}
.seg button:last-child{border-right:none}
.seg button.on{background:var(--brown);color:#fff;font-weight:bold}
input[type=range]{flex:1;min-width:160px;height:32px;accent-color:var(--brown)}
select{font:inherit;padding:6px 10px;border:2px solid var(--brown);border-radius:8px;background:#fff;color:var(--ink);max-width:100%}
.val{min-width:110px;font-weight:bold;color:var(--brown);font-size:22px}
.out{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px 14px;font-size:21px}
.out div:nth-child(odd){color:#5a4636}
.out div:nth-child(even){font-weight:bold;color:var(--brown);text-align:right}
.badge{display:inline-block;padding:6px 14px;border-radius:20px;color:#fff;font-weight:bold;font-size:20px;transition:background .3s}
.note{font-size:16px;color:#6b5848;margin-top:8px}
.warn{background:#FDE7E4;border:2px solid var(--bad);color:#7A1812;border-radius:8px;padding:8px 12px;margin-top:10px;font-size:18px;font-weight:bold}
.warn[hidden]{display:none}
.case{margin:0 0 10px;font-size:19px;line-height:1.35}
.reveal{font:inherit;font-weight:bold;padding:8px 18px;border:2px solid var(--brown);border-radius:8px;background:#fff;color:var(--brown);cursor:pointer;transition:background .2s,color .2s}
.reveal:hover{background:var(--brown);color:#fff}
table.ref{width:100%;border-collapse:collapse;font-size:18px;margin-top:6px}
table.ref th,table.ref td{border:1px solid var(--line);padding:5px 8px;text-align:left}
table.ref th{background:#F6E1E1;color:var(--brown)}
table.ref tr.hl td{background:#FFE9A8;font-weight:bold}
.zone{position:relative;height:30px;border-radius:8px;overflow:hidden;display:flex;margin:12px 0 4px;border:2px solid var(--line)}
.zone i{display:block;height:100%}
.zone b{position:absolute;top:-2px;bottom:-2px;width:4px;background:#2B1B10;transition:left .3s}
ol.chain{list-style:none;counter-reset:s;margin:0;padding:0}
ol.chain li{counter-increment:s;position:relative;margin:0 0 8px;padding:8px 12px 8px 46px;background:#FBF1EA;border:2px solid var(--line);border-radius:10px;font-size:19px;line-height:1.35}
ol.chain li::before{content:counter(s);position:absolute;left:10px;top:8px;width:26px;height:26px;border-radius:50%;background:var(--brown);color:#fff;font-weight:bold;text-align:center;line-height:26px;font-size:16px}
ul.case li{margin-bottom:4px}
.zlab{display:flex;justify-content:space-between;font-size:15px;color:#6b5848}
@media(max-width:640px){.lab{font-size:18px}main{padding:12px}header,nav,.safety{padding-left:12px;padding-right:12px}.row label{min-width:0;width:100%}.out{font-size:19px}}`,
  html: `<header><h1>Láser terapéutico</h1><span>Agentes Físicos · Simulador didáctico para proyección · 830 nm de referencia, 200 mW de potencia de referencia</span><button id="animBtn" class="animbtn" type="button">Pausar animación</button></header>
<div class="safety">Seguridad: gafas de protección para paciente y terapeuta · no apuntar a los ojos · evitar superficies reflectantes en la sala</div>
<nav id="nav">
<button class="on" data-t="t1">1 · Penetración y absorción</button>
<button data-t="t2">2 · Dosis</button>
<button data-t="t3">3 · Continuo y pulsado</button>
<button data-t="t4">4 · Caso clínico</button>
<button data-t="t5">5 · Respuesta del tejido</button>
<button data-t="t6">6 · Técnicas y laterodispersión</button>
<button data-t="t7">7 · Teoría</button>
</nav>
<main>

<!-- TAB 1 -->
<section class="tab on" id="t1">
<div class="card"><canvas id="c1" width="760" height="670" aria-label="Corte de tejido con dos sondas láser y sus haces"></canvas></div>
<div>
<div class="card">
<h2>Controles</h2>
<div class="row"><label>Longitud de onda</label><div class="seg" id="nm1"></div></div>
<div class="row"><label>Grasa subcutánea</label><input type="range" id="fat1" min="0" max="20" step="1" value="5"><span class="val" id="fat1v">5 mm</span></div>
<div class="row"><label>Profundidad</label><input type="range" id="d1" min="0" max="40" step="0.5" value="10"><span class="val" id="d1v">10 mm</span></div>
</div>
<div class="card">
<h2>Lecturas</h2>
<div class="out">
<div id="l1a">Luz restante</div><div id="r1a">—</div>
<div id="l1b">Luz restante (referencia)</div><div id="r1b">—</div>
<div>Profundidad con 10 % de luz, longitud elegida</div><div id="r1c">—</div>
<div>Profundidad con 10 % de luz, referencia</div><div id="r1d">—</div>
</div>
<p class="note">Valores didácticos aproximados: las fuentes varían. Referencia de la clase: He-Ne 632,8 nm ≈ 8 mm; As-Ga 904 nm ≈ 2–3 cm. El infrarrojo es invisible: se dibuja en violeta.</p>
</div>
</div>
</section>

<!-- TAB 2 -->
<section class="tab" id="t2">
<div class="card">
<h2>Qué llega al tejido blanco</h2>
<div class="out">
<div>Energía total</div><div id="r2a">—</div>
<div id="l2b">Tiempo de aplicación (200 mW)</div><div id="r2b">—</div>
<div>Dosis en superficie</div><div id="r2c">—</div>
<div>Luz que llega al tejido blanco</div><div id="r2d">—</div>
<div>Dosis en el tejido blanco</div><div id="r2e">—</div>
</div>
<div class="zone" id="zone2"></div>
<div class="zlab"><span>0</span><span id="zmax2">12 J/cm²</span></div>
<div style="margin-top:8px"><span class="badge" id="verd2">—</span></div>
<div class="warn" id="warn2" hidden>Aplicación de más de 30 minutos: poco práctica con esta potencia. Reduzca la dosis o el área, o suba la potencia.</div>
<canvas id="c2" width="760" height="320" style="margin-top:14px" aria-label="Dosis en función de la profundidad"></canvas>
</div>
<div>
<div class="card">
<h2>Controles</h2>
<div class="row"><label>Objetivo</label><select id="goal2"></select></div>
<div class="row"><label>Dosis</label><input type="range" id="dose2" min="0.1" max="99" step="0.1" value="4"><span class="val" id="dose2v">4.0 J/cm²</span></div>
<div class="row"><label>Potencia</label><input type="range" id="pow2" min="35" max="200" step="5" value="200"><span class="val" id="pow2v">200 mW</span></div>
<div class="row"><label>Área tratada</label><input type="range" id="area2" min="1" max="50" step="1" value="10"><span class="val" id="area2v">10 cm²</span></div>
<div class="row"><label>Tiempo</label><input type="range" id="time2" min="1" max="1800" step="1" value="200"><span class="val" id="time2v">3 min 20 s</span></div>
<p class="note" style="margin-top:0">Dosis = potencia × tiempo ÷ área. Mueva la dosis, la potencia o el área y el tiempo se recalcula; mueva el tiempo y se recalcula la dosis (el control llega a 30 min).</p>
<div class="row"><label>Profundidad del blanco</label><input type="range" id="depth2" min="0" max="40" step="0.5" value="8"><span class="val" id="depth2v">8 mm</span></div>
<div class="row"><label>Grasa subcutánea</label><input type="range" id="fat2" min="0" max="20" step="1" value="5"><span class="val" id="fat2v">5 mm</span></div>
</div>
<div class="card">
<h2>Dosis de la clase</h2>
<table class="ref" id="tbl2"></table>
<p class="note">Criterio clínico de la clase (J/cm² aplicados). No es un límite de la física. Con 830 nm (valores de referencia).</p>
</div>
</div>
</section>

<!-- TAB 3 -->
<section class="tab" id="t3">
<div class="card">
<h2>Potencia y tiempo</h2>
<canvas id="c3" width="760" height="330" style="margin-bottom:12px" aria-label="Forma de onda: potencia frente al tiempo"></canvas>
<div class="out">
<div>Potencia pico</div><div id="r3a">—</div>
<div>Potencia media</div><div id="r3b">—</div>
<div>Energía por pulso</div><div id="r3c">—</div>
<div>Tiempo con este modo</div><div id="r3d">—</div>
<div>Tiempo en continuo (misma dosis)</div><div id="r3e">—</div>
</div>
<p class="note" style="font-size:18px">Lo que sí dice la física: en pulsado la potencia media es la pico × ciclo de trabajo, así que con la misma dosis el tiempo se alarga. Que cada frecuencia de pulso "elija" un efecto (dolor, regeneración, inflamación) no está demostrado.</p>
<h2 style="margin-top:14px">Frecuencias de la clase</h2>
<table class="ref" id="tbl3"></table>
<p class="note">Criterio clínico orientativo, evidencia limitada.</p>
</div>
<div>
<div class="card">
<h2>Controles</h2>
<div class="row"><label>Modo</label><div class="seg" id="mode3"><button data-v="continuo" class="on">Continuo</button><button data-v="pulsado">Pulsado</button></div></div>
<div class="row"><label>Frecuencia</label><input type="range" id="hz3" min="0" max="10000" step="50" value="1000"><span class="val" id="hz3v">1000 Hz</span></div>
<div class="row"><label>Ciclo de trabajo</label><input type="range" id="duty3" min="10" max="90" step="10" value="50"><span class="val" id="duty3v">50 %</span></div>
<div class="row"><label>Dosis</label><input type="range" id="dose3" min="0.1" max="99" step="0.1" value="4"><span class="val" id="dose3v">4.0 J/cm²</span></div>
<div class="row"><label>Área tratada</label><input type="range" id="area3" min="1" max="50" step="1" value="10"><span class="val" id="area3v">10 cm²</span></div>
<p class="note">Con frecuencia 0 Hz la emisión es continua.</p>
</div>
</div>
</section>

<!-- TAB 4 -->
<section class="tab" id="t4">
<div class="card">
<h2>Caso clínico</h2>
<div class="row"><label>Caso</label><select id="case4"></select></div>
<p class="case" id="text4"></p>
<p class="note" id="meta4"></p>
<canvas id="c4" width="760" height="400" style="margin:6px 0 12px" aria-label="Región corporal del caso y corte en el punto de aplicación"></canvas>
<button class="reveal" id="rev4">Revelar evaluación</button>
<div id="res4" hidden style="margin-top:12px">
<span class="badge" id="verd4">—</span>
<div class="out" style="margin-top:10px">
<div>Dosis de la clase para el objetivo</div><div id="r4a">—</div>
<div>Luz que llega al blanco (830 nm)</div><div id="r4b">—</div>
</div>
<ul id="msg4" style="font-size:19px;line-height:1.4"></ul>
</div>
</div>
<div class="card">
<h2>Parámetros</h2>
<div class="row"><label>Dosis</label><input type="range" id="dose4" min="0.1" max="20" step="0.1" value="3"><span class="val" id="dose4v">3.0 J/cm²</span></div>
<div class="row"><label>Modo</label><div class="seg" id="mode4"><button data-v="continuo" class="on">Continuo</button><button data-v="pulsado">Pulsado</button></div></div>
<div class="row"><label>Frecuencia</label><input type="range" id="hz4" min="0" max="10000" step="50" value="0"><span class="val" id="hz4v">0 Hz</span></div>
<div class="row"><label>Técnica</label><div class="seg" id="method4"><button data-v="punteado" class="on">Punteado</button><button data-v="barrido">Barrido</button><button data-v="pincelado">Pincelado</button><button data-v="bano">Baño</button></div></div>
</div>
</section>

<!-- TAB 5 -->
<section class="tab" id="t5">
<div class="card">
<h2>Respuesta bifásica (Arndt-Schulz)</h2>
<canvas id="c5a" width="760" height="300"></canvas>
<h2 style="margin-top:14px">Qué le pasa a la célula</h2>
<canvas id="c5b" width="760" height="320"></canvas>
</div>
<div>
<div class="card">
<h2>Controles</h2>
<div class="row"><label>Objetivo</label><select id="goal5"></select></div>
<div class="row"><label>Dosis aplicada</label><input type="range" id="dose5" min="0" max="100" step="1" value="53"><span class="val" id="dose5v">—</span></div>
<div class="row"><label>Profundidad del tejido</label><input type="range" id="depth5" min="0" max="40" step="0.5" value="0"><span class="val" id="depth5v">0.0 mm</span></div>
<div class="row"><label>Grasa subcutánea</label><input type="range" id="fat5" min="0" max="20" step="1" value="5"><span class="val" id="fat5v">5 mm</span></div>
<p class="note">La dosis usa escala logarítmica (0,1 a 99 J/cm²). Baje al tejido profundo: lo que es sobredosis en la piel puede ser infradosis en el blanco.</p>
</div>
<div class="card">
<h2>Lecturas</h2>
<div class="out">
<div>Dosis en superficie</div><div id="r5a">—</div>
<div>Luz que llega a este tejido (830 nm)</div><div id="r5b">—</div>
<div>Dosis en este tejido</div><div id="r5c">—</div>
<div>Respuesta</div><div id="r5e">—</div>
</div>
<div style="margin-top:8px"><span class="badge" id="verd5">—</span></div>
<ul id="eff5" style="font-size:19px;line-height:1.4;margin:10px 0 0;padding-left:22px"></ul>
<p class="note">Modelo conceptual bifásico. Se describe sobre todo en estudios in vitro y animales; la ventana exacta en humanos es debatida. Aquí se usa el rango de dosis de la clase como ventana a nivel celular.</p>
</div>
</div>
</section>

<!-- TAB 6 -->
<section class="tab" id="t6">
<div class="card">
<h2>Técnica de aplicación</h2>
<canvas id="c6a" width="760" height="380"></canvas>
<h2 style="margin-top:14px">Laterodispersión</h2>
<canvas id="c6b" width="760" height="420"></canvas>
</div>
<div>
<div class="card">
<h2>Técnicas de aplicación</h2>
<div class="seg" id="tec6"></div>
<div id="tec6info" style="margin-top:10px"></div>
<p class="note">Piel limpia y desgrasada en todas las técnicas. La clase detalla la técnica puntual; el resto es descripción clínica habitual, de orientación.</p>
</div>
<div class="card">
<h2>Laterodispersión</h2>
<p class="case"><b>Qué es.</b> Al chocar con el tejido, los fotones cambian de dirección (scattering). Muchos rebotan hacia los lados: la zona que recibe luz es mayor que el diámetro del haz, y algunos fotones vuelven a salir por la superficie.</p>
<div class="row"><label>Longitud de onda</label><div class="seg" id="nm6"></div></div>
<div class="row"><label>Diámetro del haz</label><input type="range" id="spot6" min="2" max="20" step="1" value="8"><span class="val" id="spot6v">8 mm</span></div>
<div class="row"><label>Grasa subcutánea</label><input type="range" id="fat6" min="0" max="20" step="1" value="5"><span class="val" id="fat6v">5 mm</span></div>
<div class="row"><label>Efecto indirecto</label><div class="seg" id="ind6"><button data-v="0" class="on">Ocultar</button><button data-v="1">Mostrar</button></div></div>
<div class="out">
<div>Energía absorbida en el tejido</div><div id="r6a">—</div>
<div>Energía que sale por la superficie</div><div id="r6b">—</div>
<div>Luz restante a 10 mm</div><div id="r6c">—</div>
</div>
<p class="note">Simulación didáctica: cada punto es un paquete de luz que cambia de dirección al azar y pierde intensidad al avanzar (más tenue = menos luz). Los porcentajes cambian un poco mientras corre. Efecto indirecto (clase: microcirculación y efecto sistémico): no viajan fotones por la sangre, sino mediadores liberados por la célula (vasodilatación, factores de crecimiento) que llevan el efecto a zonas vecinas.</p>
</div>
</div>
</section>

<!-- TAB 7 -->
<section class="tab" id="t7">
<div>
<div class="card">
<h2>Cómo actúa la luz: fotobiomodulación</h2>
<p class="case">Los fotones de 600–900 nm son absorbidos por <b>cromóforos</b>, sobre todo la <b>citocromo c oxidasa</b> de la mitocondria. Resultado: más ATP, un pequeño aumento de especies reactivas de oxígeno, liberación de óxido nítrico (vasodilatación) y cambios del calcio intracelular. Estas señales activan factores de transcripción (NF-κB, AP-1) y cambian la expresión de genes. Con estas dosis el efecto es <b>fotoquímico, no térmico</b>.</p>
<p class="case">Todos los efectos salen de esa misma cascada; lo que cambia es el <b>tejido blanco</b> y la <b>dosis</b>. Elija un efecto:</p>
<div class="seg" id="eff7"></div>
<div id="eff7info" style="margin-top:12px"></div>
</div>
<div class="card">
<h2>Dosis y respuesta bifásica</h2>
<p class="case">Arndt-Schulz: poca luz no estimula, una dosis adecuada estimula y demasiada inhibe. Por eso cada efecto tiene su ventana de dosis (pestaña 2) y la dosis que importa es la que llega al blanco, no la de la piel (pestaña 5).</p>
</div>
</div>
<div>
<div class="card">
<h2>Modo pulsado: cuándo y por qué</h2>
<p class="case"><b>Qué hace.</b> El haz se enciende y apaga. La <b>frecuencia</b> son los pulsos por segundo; el <b>ciclo de trabajo</b> es el porcentaje de cada periodo en que está encendido. Potencia media = pico × ciclo. Se supone que el pico se mantiene en 200 mW (potencia de referencia): pulsar no da más potencia, da menos potencia media.</p>
<p class="case"><b>Cuándo usarlo.</b></p>
<ul class="case" style="padding-left:22px">
<li>Zona aguda, inflamada o con dolor al calor: el tiempo apagado deja disipar el calor y se evita acumularlo.</li>
<li>Piel oscura, tatuajes o mucho pigmento (la melanina absorbe más luz y se calienta).</li>
<li>Zonas superficiales y delgadas (hueso cercano, tendones, cara, dedos) con poca capacidad de disipar calor.</li>
<li>Cuando se quiere aplicar a una potencia media baja con una dosis precisa.</li>
</ul>
<p class="case"><b>Cuándo preferir el continuo.</b> Tejido profundo o grande y dosis altas: el continuo entrega la dosis más rápido (potencia media = pico).</p>
<h2 style="margin-top:14px">Ciclo de trabajo</h2>
<p class="case">Ciclo bajo = potencia media baja, menos calor, <b>tiempo mucho mayor</b>. Ciclo alto = se acerca al continuo, tiempos cortos. Ejemplo con la misma dosis (4 J/cm² sobre 10 cm², 40 J):</p>
<table class="ref" id="tbl7d"></table>
<h2 style="margin-top:14px">Frecuencia</h2>
<table class="ref" id="tbl7f"></table>
<p class="note">Qué es sólido: la media = pico × ciclo y que el apagado reduce el calor. Qué no está demostrado: que una frecuencia concreta "elija" un efecto (dolor, regeneración, inflamación). Es el criterio clínico de la clase, de orientación; lo que decide el efecto es sobre todo la <b>dosis</b> que llega al blanco. Rangos habituales de referencia: 0–10 000 Hz, ciclo 10–90 %.</p>
</div>
</div>
</section>

</main>`,
  init: function (root) {
var raf=0,dead=false;
var C=LaserCore,D=C.DEVICE;
var $=function(id){return root.getElementById(id)};
function nmTxt(n){return String(n).replace('.',',')}
function fx(v,n){return Number(v).toFixed(n).replace('.',',')}
function seg(id,cb){var el=$(id);el.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;[].forEach.call(el.children,function(x){x.classList.remove('on')});b.classList.add('on');cb(b.getAttribute('data-v'))})}
function slider(id,fmt,cb){var el=$(id);function f(){$(id+'v').textContent=fmt(+el.value);cb()}el.addEventListener('input',f);$(id+'v').textContent=fmt(+el.value)}
$('nav').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;[].forEach.call(this.children,function(x){x.classList.remove('on')});b.classList.add('on');[].forEach.call(root.querySelectorAll('.tab'),function(t){t.classList.remove('on')});$(b.getAttribute('data-t')).classList.add('on');draw1();draw5()});

/* ---------- TAB 1 ---------- */
var nm1=D.defaultNm;
(function(){var el=$('nm1');C.WAVELENGTHS.forEach(function(n){var b=document.createElement('button');b.setAttribute('data-v',n);b.textContent=nmTxt(n)+' nm';if(n===nm1)b.className='on';el.appendChild(b)})})();
function refNm(){return nm1===632.8?904:632.8}
/* ---------- utilidades de dibujo ---------- */
var FONT='Cambria,Georgia,serif';
function hidpi(c,W,H){var S=2;if(c._w!==W||c._h!==H){c.width=W*S;c.height=H*S;c._w=W;c._h=H}var g=c.getContext('2d');g.setTransform(S,0,0,S,0,0);return g}
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function txt(g,s,x,y,font,col,align,halo){g.font=font;g.textAlign=align||'left';if(halo){g.lineJoin='round';g.lineWidth=4;g.strokeStyle=halo;g.strokeText(s,x,y)}g.fillStyle=col;g.fillText(s,x,y)}
function rnd(i){var s=Math.sin(i*12.9898+78.233)*43758.5453;return s-Math.floor(s)}
function isVis(n){return n<700}
function beamColor(n){return isVis(n)?'222,24,24':'132,52,212'}
function beamHot(n){return isVis(n)?'255,214,200':'232,214,255'}
/* dispersión lateral (cualitativa): el rojo se dispersa más que el infrarrojo */
function scatterK(n){return n<650?1.9:(n<700?1.7:1.25)}
/* capas de tejido con textura; devuelve nada, solo dibuja */
function tissue(g,x0,x1,top,pm,maxD,fat,deepName,deepCol){
 var L=[{a:0,b:0.4,c:'#C98A70'},{a:0.4,b:2,c:'#EFC2AC'},{a:2,b:2+fat,c:'#F8E7B4'},{a:2+fat,b:maxD,c:deepCol||'#D08A74'}];
 L.forEach(function(l,i){if(l.b<=l.a)return;var y0=top+l.a*pm,h=(l.b-l.a)*pm;g.fillStyle=l.c;g.fillRect(x0,y0,x1-x0,h);
  g.save();g.beginPath();g.rect(x0,y0,x1-x0,h);g.clip();
  if(i===1){g.strokeStyle='rgba(176,96,72,0.28)';g.lineWidth=1;for(var k=0;k<3;k++){var yy=y0+h*(k+1)/4;g.beginPath();for(var x=x0;x<=x1;x+=8)g.lineTo(x,yy+Math.sin(x/11+k*2)*1.6);g.stroke()}}
  if(i===2){g.strokeStyle='rgba(190,150,60,0.45)';g.fillStyle='rgba(255,250,225,0.55)';g.lineWidth=1;var r=Math.max(4,Math.min(9,pm*0.7));
   for(var yy=y0+r*0.6,row=0;yy<y0+h+r;yy+=r*1.7,row++)for(var x=x0+(row%2?r:0);x<x1+r;x+=r*2.1){var j=rnd(x*3+yy);g.beginPath();g.ellipse(x+j*3,yy,r*(0.85+j*0.25),r*0.75,0,0,6.283);g.fill();g.stroke()}}
  if(i===3){g.strokeStyle='rgba(110,36,26,0.16)';g.lineWidth=1;for(var yy=y0+4;yy<y0+h;yy+=6){g.beginPath();g.moveTo(x0,yy+rnd(yy)*1.5);g.lineTo(x1,yy+rnd(yy+7)*1.5);g.stroke()}
   g.strokeStyle='rgba(90,24,18,0.24)';g.lineWidth=1.5;for(var yy2=y0+18;yy2<y0+h;yy2+=26){g.beginPath();g.moveTo(x0,yy2);g.lineTo(x1,yy2+2);g.stroke()}}
  g.restore()});
 g.fillStyle='rgba(120,60,40,0.55)';g.fillRect(x0,top,x1-x0,1.5)}
/* haz láser: núcleo colimado + halo de dispersión; intensidad = fracción restante del núcleo */
function laserBeam(g,cx,top,pm,maxD,n,th){
 var col=beamColor(n),hot=beamHot(n),k=scatterK(n),cw=Math.max(3,0.32*pm),y,d,f,w,a,gr;
 /* brillo con corrección perceptiva (f^0,4–0,6): monótono con la fracción restante, legible a distancia */
 for(y=0;y<maxD*pm;y+=2){d=y/pm;f=C.fractionRemaining(n,d,th);if(f<0.002)break;
  w=cw+(0.3+k*d*0.16)*pm;a=Math.min(0.6,0.6*Math.pow(f,0.4));
  gr=g.createLinearGradient(cx-w,0,cx+w,0);
  gr.addColorStop(0,'rgba('+col+',0)');gr.addColorStop(0.22,'rgba('+col+','+(a*0.18).toFixed(3)+')');gr.addColorStop(0.42,'rgba('+col+','+(a*0.6).toFixed(3)+')');
  gr.addColorStop(0.5,'rgba('+col+','+a.toFixed(3)+')');gr.addColorStop(0.58,'rgba('+col+','+(a*0.6).toFixed(3)+')');gr.addColorStop(0.78,'rgba('+col+','+(a*0.18).toFixed(3)+')');gr.addColorStop(1,'rgba('+col+',0)');
  g.fillStyle=gr;g.fillRect(cx-w,top+y,2*w,2);
  var ca=Math.min(1,0.98*Math.pow(f,0.6));
  g.fillStyle='rgba('+col+','+ca.toFixed(3)+')';g.fillRect(cx-cw,top+y,2*cw,2);
  g.fillStyle='rgba('+hot+','+(ca*0.95).toFixed(3)+')';g.fillRect(cx-cw*0.35,top+y,cw*0.7,2)}
 gr=g.createRadialGradient(cx,top,0,cx,top,cw*5);gr.addColorStop(0,'rgba('+hot+',0.9)');gr.addColorStop(0.35,'rgba('+col+',0.45)');gr.addColorStop(1,'rgba('+col+',0)');
 g.fillStyle=gr;g.beginPath();g.arc(cx,top,cw*5,0,6.283);g.fill()}
/* sonda de diodo único (lápiz), punta en contacto con la piel en (cx,tip) */
function laserProbe(g,cx,tip,n,s,cableDir){
 g.save();g.translate(cx,tip);g.scale(s,s);var col=beamColor(n),gr;
 g.strokeStyle='#3A3A3A';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(0,-122);g.bezierCurveTo(0,-150,cableDir*30,-140,cableDir*60,-170);g.stroke();
 gr=g.createLinearGradient(-22,0,22,0);gr.addColorStop(0,'#2A2E33');gr.addColorStop(0.35,'#7D858F');gr.addColorStop(0.55,'#9AA2AC');gr.addColorStop(1,'#25292D');
 g.fillStyle=gr;rr(g,-22,-124,44,88,9);g.fill();
 g.strokeStyle='rgba(0,0,0,0.35)';g.lineWidth=1.2;[-112,-106,-100].forEach(function(y){g.beginPath();g.moveTo(-21,y);g.lineTo(21,y);g.stroke()});
 g.fillStyle='#FFB300';g.beginPath();g.arc(0,-88,4,0,6.283);g.fill();g.strokeStyle='#5A3A00';g.lineWidth=1;g.stroke();
 g.save();g.translate(4,-56);g.rotate(-Math.PI/2);g.fillStyle='#fff';g.font='bold 11px '+FONT;g.textAlign='center';g.fillText(nmTxt(n)+' nm',0,0);g.restore();
 gr=g.createLinearGradient(-22,0,22,0);gr.addColorStop(0,'#7F8790');gr.addColorStop(0.45,'#E4E8EC');gr.addColorStop(1,'#6C747C');
 g.fillStyle=gr;g.beginPath();g.moveTo(-22,-36);g.lineTo(22,-36);g.lineTo(11,-7);g.lineTo(-11,-7);g.closePath();g.fill();g.strokeStyle='rgba(0,0,0,0.3)';g.stroke();
 g.fillStyle='#2B2B2B';g.fillRect(-11,-7,22,4);
 gr=g.createLinearGradient(-9,0,9,0);gr.addColorStop(0,'rgba('+col+',0.75)');gr.addColorStop(0.5,'rgba('+beamHot(n)+',1)');gr.addColorStop(1,'rgba('+col+',0.75)');
 g.fillStyle=gr;g.fillRect(-9,-3,18,3);
 g.restore()}

function draw1(){
 var W=760,H=670,g=hidpi($('c1'),W,H);
 var fat=+$('fat1').value,dep=+$('d1').value,th={piel:2,grasa:fat},ref=refNm();
 var top=150,pm=11,x0=16,x1=744,maxD=40;
 g.fillStyle='#FBF6F0';g.fillRect(0,0,W,H);
 tissue(g,x0,x1,top,pm,maxD,fat);
 laserBeam(g,250,top,pm,maxD,nm1,th);laserBeam(g,520,top,pm,maxD,ref,th);
 laserProbe(g,250,top,nm1,1,-1);laserProbe(g,520,top,ref,1,1);
 /* etiquetas de longitud de onda */
 function wl(n,x,al,isRef){var v=isVis(n);
  txt(g,nmTxt(n)+' nm',x,64,'bold 22px '+FONT,'#2B1B10',al);
  txt(g,v?'rojo visible':'infrarrojo: invisible',x,86,'bold 15px '+FONT,v?'rgb(190,20,20)':'rgb(110,40,180)',al);
  if(isRef)txt(g,'(referencia)',x,106,'15px '+FONT,'#6b5848',al)}
 wl(nm1,212,'right',false);wl(ref,558,'left',true);
 /* partes de la sonda (solo en la primera) */
 g.strokeStyle='#6b5848';g.lineWidth=1.2;
 g.beginPath();g.moveTo(274,top-92);g.lineTo(300,top-92);g.stroke();txt(g,'Sonda de diodo',304,top-87,'bold 15px '+FONT,'#2B1B10');
 g.beginPath();g.moveTo(261,top-5);g.lineTo(300,top-22);g.stroke();txt(g,'Ventana de salida',304,top-24,'bold 15px '+FONT,'#2B1B10');
 txt(g,'(en contacto con la piel)',304,top-8,'13px '+FONT,'#6b5848');
 /* nombres de capas */
 var H1='rgba(255,255,255,0.75)';
 txt(g,'Epidermis',x0+2,top-6,'bold 14px '+FONT,'#5A2E1C','left');
 g.strokeStyle='#5A2E1C';g.lineWidth=1;g.beginPath();g.moveTo(x0+30,top-3);g.lineTo(x0+30,top+2);g.stroke();
 txt(g,'Dermis (piel: 2 mm fija)',x0+6,top+18,'bold 13px '+FONT,'#4A2416','left',H1);
 if(fat>0){var hf=fat*pm,fs=hf>=16?14:(hf>=11?11:0);if(fs)txt(g,'Hipodermis (grasa) · '+fat+' mm',x0+6,top+2*pm+Math.min(hf-3,fs+4)-(hf>=16?1:1),'bold '+fs+'px '+FONT,'#5A4210','left',H1)}
 txt(g,'Músculo'+(fat===0?' (sin grasa)':''),x0+6,top+(2+fat)*pm+18,'bold 15px '+FONT,'#fff','left','rgba(90,24,18,0.6)');
 /* línea de profundidad y marcadores */
 var yy=top+dep*pm;g.strokeStyle='#2B1B10';g.lineWidth=2;g.setLineDash([8,6]);g.beginPath();g.moveTo(x0,yy);g.lineTo(x1,yy);g.stroke();g.setLineDash([]);
 [[nm1,250],[ref,520]].forEach(function(p){var fr=C.fractionRemaining(p[0],dep,th);
  g.fillStyle='rgba(255,255,255,0.95)';rr(g,p[1]-46,yy-32,92,26,6);g.fill();g.strokeStyle='#8A1F1F';g.lineWidth=2;g.stroke();
  txt(g,fx(fr*100,fr<0.1?1:0)+' %',p[1],yy-13,'bold 18px '+FONT,'#8A1F1F','center')});
 for(var mm=0;mm<=40;mm+=5){var ty=top+mm*pm;g.fillStyle='#2B1B10';g.fillRect(x1-6,ty-0.75,6,1.5);txt(g,mm+' mm',x1-10,ty+(mm===0?15:5),'15px '+FONT,'#2B1B10','right',H1)}
 /* leyenda */
 var ly=top+maxD*pm+24;
 g.fillStyle='rgb(222,24,24)';rr(g,x0,ly-11,28,12,3);g.fill();txt(g,'Rojo visible: 632,8 y 685 nm',x0+38,ly,'bold 15px '+FONT,'#2B1B10');
 g.fillStyle='rgb(132,52,212)';rr(g,x0,ly+11,28,12,3);g.fill();txt(g,'Infrarrojo: 810, 830 y 904 nm. Invisible al ojo: se dibuja en violeta',x0+38,ly+22,'bold 15px '+FONT,'#2B1B10');
 txt(g,'Núcleo brillante = haz colimado · halo = dispersión en el tejido · intensidad = luz restante',x0,ly+45,'14px '+FONT,'#6b5848');
 var f1=C.fractionRemaining(nm1,dep,th),f2=C.fractionRemaining(ref,dep,th);
 $('l1a').textContent='Luz restante a '+fx(dep,1)+' mm, '+nmTxt(nm1)+' nm';$('r1a').textContent=fx(f1*100,f1<0.1?1:0)+' %';
 $('l1b').textContent='Luz restante a '+fx(dep,1)+' mm, '+nmTxt(ref)+' nm';$('r1b').textContent=fx(f2*100,f2<0.1?1:0)+' %';
 $('r1c').textContent=fx(C.depthForFraction(nm1,0.1,th),1)+' mm';$('r1d').textContent=fx(C.depthForFraction(ref,0.1,th),1)+' mm'}
seg('nm1',function(v){nm1=+v;draw1()});
slider('fat1',function(v){return v+' mm'},draw1);slider('d1',function(v){return fx(v,1)+' mm'},draw1);

/* ---------- TAB 2 ---------- */
var goalSel=$('goal2');Object.keys(C.CLASS_DOSE).forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=C.GOAL_NAMES[k]+' ('+C.CLASS_DOSE[k][0]+'–'+C.CLASS_DOSE[k][1]+' J/cm²)';goalSel.appendChild(o)});
(function(){var t='<tr><th>Objetivo</th><th>J/cm²</th></tr>';Object.keys(C.CLASS_DOSE).forEach(function(k){t+='<tr data-g="'+k+'"><td>'+C.GOAL_NAMES[k]+'</td><td>'+C.CLASS_DOSE[k][0]+' a '+C.CLASS_DOSE[k][1]+'</td></tr>'});$('tbl2').innerHTML=t})();
var VCOL={infradosis:'#C77700',ventana:'#2E7D4F',sobredosis:'#B3261E'},VTXT={infradosis:'Infradosis',ventana:'Ventana terapéutica',sobredosis:'Sobredosis'};
function calc2(){
 var dose=dose2,area=+$('area2').value,pw=+$('pow2').value,dep=+$('depth2').value,fat=+$('fat2').value,goal=goalSel.value,r=C.CLASS_DOSE[goal];
 var t=C.treatmentTimeS(dose,area,pw),fr=C.fractionRemaining(D.defaultNm,dep,{piel:2,grasa:fat}),dt=C.doseAtDepth(dose,fr);
 if(!fromTime2){$('time2').value=Math.min(1800,Math.max(1,Math.round(t)));$('time2v').textContent=C.formatDuration(t)}
 $('l2b').textContent='Tiempo de aplicación ('+pw+' mW)';
 $('r2a').textContent=fx(C.totalEnergyJ(dose,area),1)+' J';$('r2b').textContent=C.formatDuration(t);$('r2c').textContent=fx(dose,dose<10?2:1)+' J/cm²';
 $('r2d').textContent=fx(fr*100,fr<0.1?1:0)+' %';$('r2e').textContent=fx(dt,2)+' J/cm²';
 var mx=Math.max(12,Math.ceil(r[1]*2)),p=function(v){return(v/mx*100)+'%'};
 $('zone2').innerHTML='<i style="width:'+p(r[0])+';background:#F3D9A0"></i><i style="width:'+p(r[1]-r[0])+';background:#9AD3AE"></i><i style="width:'+p(mx-r[1])+';background:#F0B0AA"></i><b style="left:calc('+p(Math.min(dose,mx))+' - 2px)"></b>';
 $('zmax2').textContent=mx+' J/cm²'+(dose>mx?' (dosis fuera de escala)':'');
 var v=C.classifyDose(dose,goal);$('verd2').textContent=VTXT[v]+' (dosis aplicada, criterio de la clase)';$('verd2').style.background=VCOL[v];
 $('warn2').hidden=!(t>1800);
 [].forEach.call($('tbl2').querySelectorAll('tr[data-g]'),function(tr){tr.className=tr.getAttribute('data-g')===goal?'hl':''});
 draw2(dose,dep,fat,dt)}
function draw2(dose,dep,fat,dt){
 var W=760,H=320,g=hidpi($('c2'),W,H),L=74,R=736,T=56,B=270,maxD=40,th={piel:2,grasa:fat};
 var ym=dose<=1?Math.ceil(dose*10)/10*1.15:Math.ceil(dose*1.15);if(ym<=0)ym=1;
 var X=function(d){return L+(R-L)*d/maxD},Y=function(v){return B-(B-T)*v/ym};
 g.fillStyle='#fff';g.fillRect(0,0,W,H);
 txt(g,'Dosis según la profundidad (830 nm, valores de referencia)',L-58,24,'bold 18px '+FONT,'#8A1F1F');
 [[0,2,'#F6D8C8','Piel'],[2,2+fat,'#FBEFC8','Grasa'],[2+fat,maxD,'#F1D2C9','Músculo']].forEach(function(b){if(b[1]<=b[0])return;g.fillStyle=b[2];g.fillRect(X(b[0]),T,X(b[1])-X(b[0]),B-T);
  if(X(b[1])-X(b[0])>34)txt(g,b[3],X(b[0])+4,T+16,'bold 13px '+FONT,'#6b5848')});
 g.strokeStyle='#D9C7B6';g.lineWidth=1;g.fillStyle='#2B1B10';
 for(var i=0;i<=4;i++){var v=ym*i/4,y=Y(v);g.beginPath();g.moveTo(L,y);g.lineTo(R,y);g.stroke();txt(g,fx(v,ym<4?1:0),L-8,y+5,'14px '+FONT,'#2B1B10','right')}
 for(var d=0;d<=maxD;d+=5)txt(g,d+'',X(d),B+18,'14px '+FONT,'#2B1B10','center');
 txt(g,'profundidad (mm)',(L+R)/2,B+40,'14px '+FONT,'#6b5848','center');
 g.save();g.translate(18,(T+B)/2);g.rotate(-Math.PI/2);txt(g,'J/cm²',0,0,'14px '+FONT,'#6b5848','center');g.restore();
 g.strokeStyle='#2B1B10';g.lineWidth=1.5;g.beginPath();g.moveTo(L,T);g.lineTo(L,B);g.lineTo(R,B);g.stroke();
 g.beginPath();for(var x=0;x<=maxD;x+=0.25){var yy=Y(C.doseAtDepth(dose,C.fractionRemaining(D.defaultNm,x,th)));x?g.lineTo(X(x),yy):g.moveTo(X(x),yy)}
 g.lineTo(X(maxD),B);g.lineTo(X(0),B);g.closePath();g.fillStyle='rgba(132,52,212,0.16)';g.fill();
 g.beginPath();for(x=0;x<=maxD;x+=0.25){yy=Y(C.doseAtDepth(dose,C.fractionRemaining(D.defaultNm,x,th)));x?g.lineTo(X(x),yy):g.moveTo(X(x),yy)}
 g.strokeStyle='rgb(132,52,212)';g.lineWidth=3;g.stroke();
 g.setLineDash([6,5]);g.strokeStyle='#2B1B10';g.lineWidth=1.5;g.beginPath();g.moveTo(X(dep),T);g.lineTo(X(dep),B);g.stroke();g.setLineDash([]);
 function dot(x,y,c){g.fillStyle=c;g.beginPath();g.arc(x,y,7,0,6.283);g.fill();g.strokeStyle='#fff';g.lineWidth=2;g.stroke()}
 dot(X(0),Y(dose),'#8A1F1F');txt(g,'Superficie: '+fx(dose,1)+' J/cm²',X(0)+12,Y(dose)+5,'bold 15px '+FONT,'#8A1F1F','left','rgba(255,255,255,0.85)');
 var tx=X(dep),right=tx>R-230,ty=Math.min(B-12,Math.max(tx<L+260?T+64:T+40,Y(dt)-12));
 dot(tx,Y(dt),'#2E7D4F');txt(g,'Blanco a '+fx(dep,1)+' mm: '+fx(dt,2)+' J/cm²',tx+(right?-12:12),ty,'bold 15px '+FONT,'#1F5A38',right?'right':'left','rgba(255,255,255,0.85)')}
goalSel.addEventListener('change',calc2);
var dose2=+$('dose2').value,fromTime2=false;
slider('dose2',function(v){return fx(v,1)+' J/cm²'},function(){dose2=+$('dose2').value;calc2()});
slider('pow2',function(v){return v+' mW'},calc2);
slider('time2',function(v){return C.formatDuration(v)},function(){
 var d=C.doseFromTime(+$('time2').value,+$('area2').value,+$('pow2').value);
 dose2=Math.min(D.doseMax,Math.max(D.doseMin,d));
 $('dose2').value=dose2;$('dose2v').textContent=fx(dose2,1)+' J/cm²';
 fromTime2=true;calc2();fromTime2=false});
slider('area2',function(v){return v+' cm²'},calc2);slider('depth2',function(v){return fx(v,1)+' mm'},calc2);slider('fat2',function(v){return v+' mm'},calc2);

/* ---------- TAB 3 ---------- */
var mode3='continuo';
(function(){var t='<tr><th>Frecuencia</th><th>Asociación en la clase</th></tr>';[['500 – 3999 Hz','dolor','Dolor'],['4000 – 4999 Hz','regeneracion','Regeneración'],['5000 – 10 000 Hz','inflamacion','Inflamación']].forEach(function(r){t+='<tr data-e="'+r[1]+'"><td>'+r[0]+'</td><td>'+r[2]+'</td></tr>'});$('tbl3').innerHTML=t})();
function calc3(){
 var hz=mode3==='pulsado'?+$('hz3').value:0,duty=+$('duty3').value,dose=+$('dose3').value,area=+$('area3').value;
 var pm=C.avgPowerMW(D.powerMW,duty,hz),ep=C.energyPerPulseMJ(D.powerMW,duty,hz);
 $('r3a').textContent=D.powerMW+' mW';$('r3b').textContent=fx(pm,1)+' mW';$('r3c').textContent=ep===null?'— (continuo)':fx(ep,3)+' mJ';
 $('r3d').textContent=C.formatDuration(C.treatmentTimeS(dose,area,pm));$('r3e').textContent=C.formatDuration(C.treatmentTimeS(dose,area,D.powerMW));
 var e=hz>0?C.classFrequencyEffect(hz):'sin rango';
 [].forEach.call($('tbl3').querySelectorAll('tr[data-e]'),function(tr){tr.className=tr.getAttribute('data-e')===e?'hl':''});
 draw3(hz,duty,pm)}
function fTime(s){var u=s>=1?['s',1]:(s>=1e-3?['ms',1e3]:['µs',1e6]),v=s*u[1],t=v>=100?v.toFixed(0):(v>=10?v.toFixed(1):v.toFixed(2));
 t=t.indexOf('.')>-1?t.replace(/0+$/,'').replace(/\.$/,''):t;return t.replace('.',',')+' '+u[0]}
function draw3(hz,duty,pmw){
 var W=760,H=330,g=hidpi($('c3'),W,H),L=78,R=740,T=70,B=270,PM=D.powerMW,ym=250,N=4,col='132,52,212';
 var Y=function(p){return B-(B-T)*p/ym};
 g.fillStyle='#fff';g.fillRect(0,0,W,H);
 var pul=hz>0,Tp=pul?1/hz:0,win=pul?N*Tp:0,X=function(t){return L+(R-L)*t/win};
 txt(g,pul?'Pulsado: '+hz+' Hz, ciclo de trabajo '+duty+' %':'Continuo: emisión constante',L-60,24,'bold 18px '+FONT,'#8A1F1F');
 txt(g,pul?'Ventana ampliada: '+N+' pulsos = '+fTime(win):'Ventana ampliada (esquemática)',R,24,'15px '+FONT,'#6b5848','right');
 g.strokeStyle='#E6D8CA';g.lineWidth=1;[0,50,100,150,200].forEach(function(p){g.beginPath();g.moveTo(L,Y(p));g.lineTo(R,Y(p));g.stroke();txt(g,p+'',L-8,Y(p)+5,'14px '+FONT,'#2B1B10','right')});
 g.save();g.translate(20,(T+B)/2);g.rotate(-Math.PI/2);txt(g,'Potencia (mW)',0,0,'14px '+FONT,'#6b5848','center');g.restore();
 g.beginPath();
 if(!pul){g.moveTo(L,B);g.lineTo(L,Y(PM));g.lineTo(R,Y(PM));g.lineTo(R,B)}
 else{g.moveTo(L,B);for(var i=0;i<N;i++){var a=X(i*Tp),b=X((i+duty/100)*Tp);g.lineTo(a,B);g.lineTo(a,Y(PM));g.lineTo(b,Y(PM));g.lineTo(b,B)}g.lineTo(R,B)}
 g.fillStyle='rgba('+col+',0.2)';g.fill();g.strokeStyle='rgb('+col+')';g.lineWidth=3;g.lineJoin='miter';g.stroke();
 g.strokeStyle='#2B1B10';g.lineWidth=1.5;g.beginPath();g.moveTo(L,T-10);g.lineTo(L,B);g.lineTo(R,B);g.stroke();
 /* potencia media */
 var ya=Y(pmw);g.strokeStyle='#2E7D4F';g.lineWidth=2.5;g.setLineDash([10,6]);g.beginPath();g.moveTo(L,ya);g.lineTo(R,ya);g.stroke();g.setLineDash([]);
 var lab='Potencia media = '+fx(pmw,pmw%1?1:0)+' mW'+(pul?'':' (= pico)');
 g.font='bold 15px '+FONT;var lw=g.measureText(lab).width,lx=R-lw-10,lyy=pul?ya-8:ya+22;
 g.fillStyle='rgba(255,255,255,0.92)';rr(g,lx-6,lyy-15,lw+12,21,5);g.fill();txt(g,lab,lx,lyy,'bold 15px '+FONT,'#1F5A38');
 if(pul){
  var yA=Y(228);
  function dim(a,b,s){g.strokeStyle='#2B1B10';g.lineWidth=1.3;g.beginPath();g.moveTo(a,yA);g.lineTo(b,yA);[a,b].forEach(function(x){g.moveTo(x,yA-6);g.lineTo(x,yA+6)});g.stroke();
   g.font='bold 14px '+FONT;var w=g.measureText(s).width,c=Math.max(L+w/2,Math.min(R-w/2,(a+b)/2));txt(g,s,c,yA-9,'bold 14px '+FONT,'#2B1B10','center')}
  dim(X(0),X(Tp),'Periodo = '+fTime(Tp));
  dim(X(2*Tp),X((2+duty/100)*Tp),'Encendido = '+fTime(Tp*duty/100));
  txt(g,'Pico 200 mW',X(1*Tp)+4,Y(PM)+18,'bold 14px '+FONT,'rgb(100,30,170)','left','rgba(255,255,255,0.85)');
  for(i=0;i<=N;i++)txt(g,fTime(i*Tp).replace(/^0 \S+$/,'0'),X(i*Tp),B+20,'14px '+FONT,'#2B1B10',i===0?'left':(i===N?'right':'center'));
  txt(g,'Cada pulso: 200 mW encendido y 0 mW apagado. El área de cada pulso es la energía por pulso.',L-60,B+48,'14px '+FONT,'#6b5848')}
 else{txt(g,'Pico 200 mW',L+10,Y(PM)-10,'bold 14px '+FONT,'rgb(100,30,170)');
  txt(g,'tiempo →',R,B+20,'14px '+FONT,'#2B1B10','right');
  txt(g,'El láser emite sin interrupción: potencia pico y media iguales.',L-60,B+48,'14px '+FONT,'#6b5848')}}
seg('mode3',function(v){mode3=v;calc3()});
slider('hz3',function(v){return v+' Hz'},calc3);slider('duty3',function(v){return v+' %'},calc3);slider('dose3',function(v){return fx(v,1)+' J/cm²'},calc3);slider('area3',function(v){return v+' cm²'},calc3);

/* ---------- TAB 7 (teoría) ---------- */
var EFF7=[
 {id:'antialgico',n:'Analgesia',goal:'antialgico',
  pasos:['Luz absorbida en la terminación nerviosa y la mitocondria','Se hiperpolariza la membrana y se frena el transporte axonal: baja la conducción en fibras Aδ y C (dolor)','Sube la liberación de β-endorfinas y baja la bradicinina y la PGE₂ que sensibilizan al nociceptor','Menos edema y menos isquemia local: menos dolor mecánico y químico'],
  nota:'Efecto rápido, muchas veces dentro de la sesión. Evidencia moderada y dependiente de la dosis.'},
 {id:'antiinflamatorio',n:'Antiinflamatorio',goal:'antiinflamatorio',
  pasos:['Luz absorbida por mitocondrias de células inflamatorias y endotelio','Baja la expresión de COX-2, IL-1β, TNF-α e IL-6; baja la PGE₂','Vasodilatación y más drenaje linfático por óxido nítrico','Menos edema, menos infiltrado y resolución más rápida de la inflamación'],
  nota:'Dosis en la parte baja: la sobredosis puede perder el efecto (respuesta bifásica).'},
 {id:'regenerativo',n:'Regeneración',goal:'regenerativo',
  pasos:['Más ATP y más señal de crecimiento en fibroblastos y queratinocitos','Proliferación y migración celular; síntesis de colágeno','Angiogénesis (VEGF) y mejor irrigación del lecho de la herida','Cierre de herida, remodelado de la cicatriz y reparación de tendón o músculo'],
  nota:'Requiere dosis algo mayor y varias sesiones. El tejido blanco suele ser superficial.'},
 {id:'circulatorio',n:'Bioestimulación',goal:'circulatorio',
  pasos:['Luz absorbida por la mitocondria: sube el metabolismo celular y el ATP','Liberación de óxido nítrico: vasodilatación y mejor microcirculación','Mejor aporte de oxígeno y retirada de metabolitos','Efecto indirecto: mediadores liberados por la célula actúan en zonas vecinas y sobre el sistema'],
  nota:'Es el efecto de base sobre el que se apoyan los otros tres.'}
];
(function(){
 var el=$('eff7');
 EFF7.forEach(function(e,i){var b=document.createElement('button');b.setAttribute('data-v',i);b.textContent=e.n;if(!i)b.className='on';el.appendChild(b)});
 function show(i){var e=EFF7[i],r=C.CLASS_DOSE[e.goal],h='<ol class="chain">';
  e.pasos.forEach(function(p){h+='<li>'+p+'</li>'});
  h+='</ol><div style="margin-top:8px"><span class="badge" style="background:#2E7D4F">Dosis de la clase: '+r[0]+' a '+r[1]+' J/cm²</span></div><p class="note" style="font-size:17px">'+e.nota+'</p>';
  $('eff7info').innerHTML=h}
 seg('eff7',function(v){show(+v)});show(0);
 var t='<tr><th>Ciclo</th><th>Potencia media</th><th>Tiempo (40 J)</th></tr>';
 [100,90,50,25,10].forEach(function(d){var pm=C.avgPowerMW(D.powerMW,d,d===100?0:1000);t+='<tr><td>'+(d===100?'Continuo':d+' %')+'</td><td>'+fx(pm,0)+' mW</td><td>'+C.formatDuration(C.treatmentTimeS(4,10,pm))+'</td></tr>'});
 $('tbl7d').innerHTML=t;
 var f='<tr><th>Frecuencia</th><th>Periodo</th><th>Asociación en la clase</th></tr>';
 [['500 – 3999 Hz','2 ms – 0,25 ms','Dolor'],['4000 – 4999 Hz','0,25 ms – 0,2 ms','Regeneración'],['5000 – 10 000 Hz','0,2 ms – 0,1 ms','Inflamación']].forEach(function(r){f+='<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>'});
 $('tbl7f').innerHTML=f})();

/* ---------- TAB 4 ---------- */
var mode4='continuo',method4='punteado',case4=$('case4');
C.CASES.forEach(function(c,i){var o=document.createElement('option');o.value=i;o.textContent=c.titulo;case4.appendChild(o)});
function showCase(){var c=C.CASES[+case4.value];$('text4').textContent=c.texto;$('meta4').textContent='Área tratada: '+c.areaCm2+' cm² · Tejido blanco a '+c.profundidadMm+' mm de profundidad · Referencia: 830 nm, 200 mW.';$('res4').hidden=true;draw4(c)}
var SKIN='#EBC0A2',SKIN_D='#B98466';
function limb(g,pts,w){g.lineCap='round';g.lineJoin='round';g.beginPath();pts.forEach(function(p,i){i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])});g.strokeStyle=SKIN_D;g.lineWidth=w+5;g.stroke();g.strokeStyle=SKIN;g.lineWidth=w;g.stroke()}
function shape(g,draw){g.beginPath();draw();g.fillStyle=SKIN;g.fill();g.strokeStyle=SKIN_D;g.lineWidth=2.5;g.stroke()}
function appPoint(g,x,y){var gr=g.createRadialGradient(x,y,0,x,y,26);gr.addColorStop(0,'rgba(232,214,255,0.95)');gr.addColorStop(0.3,'rgba(132,52,212,0.6)');gr.addColorStop(1,'rgba(132,52,212,0)');
 g.fillStyle=gr;g.beginPath();g.arc(x,y,26,0,6.283);g.fill();g.strokeStyle='rgb(100,30,170)';g.lineWidth=2;g.beginPath();g.arc(x,y,9,0,6.283);g.stroke();g.fillStyle='#fff';g.beginPath();g.arc(x,y,3.5,0,6.283);g.fill()}
function areaMark(g,x,y,rx,ry,rot){g.save();g.setLineDash([6,4]);g.strokeStyle='rgb(100,30,170)';g.lineWidth=2;g.beginPath();g.ellipse(x,y,rx,ry,rot||0,0,6.283);g.stroke();g.restore()}
function leader(g,x1,y1,x2,y2,s,al){g.strokeStyle='#2B1B10';g.lineWidth=1.3;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();txt(g,s,x2+(al==='right'?-4:4),y2+5,'bold 15px '+FONT,'#2B1B10',al||'left','rgba(255,255,255,0.85)')}
function draw4(c){
 var W=760,H=400,g=hidpi($('c4'),W,H);g.fillStyle='#fff';g.fillRect(0,0,W,H);
 g.fillStyle='#FBF6F0';rr(g,8,8,392,384,10);g.fill();
 if(c.id==='epicondilitis'){
  txt(g,'Codo derecho · vista lateral',20,32,'bold 17px '+FONT,'#8A1F1F');
  shape(g,function(){g.moveTo(8,70);g.lineTo(70,70);g.quadraticCurveTo(92,170,80,392);g.lineTo(8,392);g.closePath()});
  limb(g,[[62,110],[186,262]],62);limb(g,[[186,262],[340,226]],50);
  shape(g,function(){g.ellipse(362,220,30,20,-0.25,0,6.283)});
  g.strokeStyle=SKIN_D;g.lineWidth=2;[0,1,2].forEach(function(k){g.beginPath();g.moveTo(372+k*3,207+k*7);g.lineTo(392,203+k*8);g.stroke()});
  g.setLineDash([3,5]);g.strokeStyle='rgba(138,31,31,0.55)';g.lineWidth=2.5;g.beginPath();g.moveTo(198,250);g.quadraticCurveTo(260,232,330,222);g.stroke();g.setLineDash([]);
  txt(g,'tendones extensores',262,212,'italic 14px '+FONT,'#8A1F1F','center','rgba(255,255,255,0.8)');
  g.fillStyle='rgba(185,132,102,0.55)';g.beginPath();g.arc(190,258,9,0,6.283);g.fill();
  areaMark(g,200,256,46,30,-0.2);appPoint(g,190,258);
  leader(g,178,272,120,330,'Epicóndilo lateral','left');
 }else if(c.id==='herida'){
  txt(g,'Pierna · vista anterior',20,32,'bold 17px '+FONT,'#8A1F1F');
  shape(g,function(){g.moveTo(140,44);g.lineTo(262,44);g.quadraticCurveTo(262,120,250,150);g.quadraticCurveTo(262,200,244,300);g.lineTo(236,340);g.quadraticCurveTo(290,350,300,372);g.quadraticCurveTo(250,388,200,380);g.lineTo(196,340);g.lineTo(178,300);g.quadraticCurveTo(152,210,160,150);g.quadraticCurveTo(140,120,140,44);g.closePath()});
  g.strokeStyle=SKIN_D;g.lineWidth=2;g.beginPath();g.ellipse(205,142,22,18,0,0,6.283);g.stroke();txt(g,'rodilla',205,112,'italic 13px '+FONT,'#6b5848','center');
  areaMark(g,214,240,30,52,0);
  g.strokeStyle='#B3261E';g.lineWidth=3.5;g.lineCap='round';g.beginPath();g.moveTo(212,206);g.quadraticCurveTo(218,240,214,276);g.stroke();
  g.fillStyle='#8A1F1F';for(var k=0;k<6;k++){var yy=212+k*12.5;g.beginPath();g.arc(207+(k%2)*0.5,yy,1.8,0,6.283);g.arc(222,yy,1.8,0,6.283);g.fill()}
  appPoint(g,215,240);
  leader(g,246,226,296,190,'Herida suturada','left');leader(g,244,276,290,300,'Área ≈ '+c.areaCm2+' cm²','left');
 }else if(c.id==='gemelos'){
  txt(g,'Pierna derecha · vista posterior',20,32,'bold 17px '+FONT,'#8A1F1F');
  shape(g,function(){g.moveTo(150,44);g.lineTo(262,44);g.quadraticCurveTo(268,120,262,150);g.quadraticCurveTo(300,230,246,310);g.lineTo(240,346);g.quadraticCurveTo(290,356,300,376);g.quadraticCurveTo(250,390,200,382);g.lineTo(196,346);g.lineTo(168,310);g.quadraticCurveTo(120,230,156,150);g.quadraticCurveTo(144,120,150,44);g.closePath()});
  g.fillStyle='rgba(196,106,85,0.45)';g.beginPath();g.ellipse(206,214,40,66,0,0,6.283);g.fill();
  g.strokeStyle=SKIN_D;g.lineWidth=2;g.setLineDash([3,5]);g.beginPath();g.moveTo(206,150);g.lineTo(206,290);g.stroke();g.setLineDash([]);
  txt(g,'hueco poplíteo',206,112,'italic 13px '+FONT,'#6b5848','center');
  areaMark(g,206,212,48,58,0);appPoint(g,206,212);
  leader(g,250,180,296,150,'Gemelos','left');leader(g,252,250,296,276,'Área ≈ '+c.areaCm2+' cm²','left');
 }else{
  txt(g,'Cuello y hombros · vista posterior',20,32,'bold 17px '+FONT,'#8A1F1F');
  shape(g,function(){g.moveTo(24,392);g.quadraticCurveTo(26,250,70,226);g.quadraticCurveTo(150,196,180,178);g.lineTo(180,150);g.lineTo(228,150);g.lineTo(228,178);g.quadraticCurveTo(258,196,338,226);g.quadraticCurveTo(382,250,384,392);g.closePath()});
  shape(g,function(){g.ellipse(204,108,46,56,0,0,6.283)});
  g.fillStyle='#5A3A28';g.beginPath();g.ellipse(204,92,48,44,0,Math.PI,2*Math.PI);g.lineTo(250,110);g.quadraticCurveTo(204,128,158,110);g.closePath();g.fill();
  g.fillStyle='rgba(196,106,85,0.45)';g.beginPath();g.moveTo(184,152);g.lineTo(184,250);g.quadraticCurveTo(130,236,84,226);g.quadraticCurveTo(150,198,184,176);g.closePath();g.fill();
  g.setLineDash([2,6]);g.strokeStyle=SKIN_D;g.lineWidth=3;g.beginPath();g.moveTo(204,166);g.lineTo(204,392);g.stroke();g.setLineDash([]);
  areaMark(g,140,214,48,22,-0.25);appPoint(g,140,214);
  leader(g,120,232,96,300,'Trapecio superior izquierdo','left');
  txt(g,'IZQ',22,382,'bold 15px '+FONT,'#6b5848');txt(g,'DER',386,382,'bold 15px '+FONT,'#6b5848','right');
 }
 /* corte esquemático en el punto */
 var sx0=420,sx1=744,top=92,maxD=Math.max(15,c.profundidadMm+6),pm=(380-top)/maxD,th={piel:2,grasa:c.grasaMm},cx=652;
 var deep={epicondilitis:['Tendón extensor','#E3D3C2'],herida:['Músculo','#C46A55'],cervicalgia:['Músculo trapecio','#C46A55'],gemelos:['Músculo gastrocnemio','#C46A55']}[c.id];
 txt(g,'Corte en el punto',sx0,28,'bold 17px '+FONT,'#8A1F1F');txt(g,'830 nm · sonda en contacto',sx0,50,'15px '+FONT,'#6b5848');
 tissue(g,sx0,sx1,top,pm,maxD,c.grasaMm,deep[0],deep[1]);
 if(c.id==='epicondilitis'){g.strokeStyle='rgba(150,120,90,0.35)';g.lineWidth=1;for(var yy2=top+(2+c.grasaMm)*pm+5;yy2<380;yy2+=6){g.beginPath();g.moveTo(sx0,yy2);g.lineTo(sx1,yy2);g.stroke()}}
 laserBeam(g,cx,top,pm,maxD,830,th);laserProbe(g,cx,top,830,0.62,1);
 var H2='rgba(255,255,255,0.8)';
 txt(g,'Piel 2 mm',sx0+6,top+Math.min(2*pm-4,20),'bold 14px '+FONT,'#4A2416','left',H2);
 if(c.grasaMm>0)txt(g,'Grasa '+c.grasaMm+' mm',sx0+6,top+2*pm+Math.min(c.grasaMm*pm-4,20),'bold 14px '+FONT,'#5A4210','left',H2);
 var dly=top+(2+c.grasaMm)*pm+20;if(Math.abs(dly-(top+c.profundidadMm*pm))<26)dly=370;
 txt(g,deep[0],sx0+6,dly,'bold 14px '+FONT,'#4A2416','left',H2);
 var ty=top+c.profundidadMm*pm;g.strokeStyle='#2B1B10';g.lineWidth=1.8;g.setLineDash([7,5]);g.beginPath();g.moveTo(sx0,ty);g.lineTo(sx1,ty);g.stroke();g.setLineDash([]);
 g.strokeStyle='#FFD54A';g.lineWidth=4;g.beginPath();g.arc(cx,ty,10,0,6.283);g.stroke();g.strokeStyle='#2B1B10';g.lineWidth=1.5;g.beginPath();g.arc(cx,ty,10,0,6.283);g.moveTo(cx-16,ty);g.lineTo(cx+16,ty);g.moveTo(cx,ty-16);g.lineTo(cx,ty+16);g.stroke();
 var lab='Blanco: '+c.profundidadMm+' mm';g.font='bold 15px '+FONT;var lw=g.measureText(lab).width,bx=cx-24-lw-14,by=ty-30;
 g.fillStyle='rgba(255,255,255,0.95)';rr(g,bx,by,lw+14,24,6);g.fill();g.strokeStyle='#8A1F1F';g.lineWidth=2;g.stroke();txt(g,lab,bx+7,by+17,'bold 15px '+FONT,'#8A1F1F');
 g.strokeStyle='#D9C7B6';g.lineWidth=2;g.strokeRect(sx0,top,sx1-sx0,380-top)}
function evalCase(){var c=C.CASES[+case4.value],hz=mode4==='pulsado'?+$('hz4').value:0;
 var r=C.evaluateCase(c,{doseJcm2:+$('dose4').value,mode:mode4,hz:hz,method:method4}),k=C.CLASS_DOSE[c.objetivo];
 $('verd4').textContent=VTXT[r.dosisVeredicto];$('verd4').style.background=VCOL[r.dosisVeredicto];
 $('r4a').textContent=C.GOAL_NAMES[c.objetivo]+': '+k[0]+'–'+k[1]+' J/cm²';$('r4b').textContent=fx(r.fraccionEnBlanco*100,r.fraccionEnBlanco<0.1?1:0)+' %';
 $('msg4').innerHTML=r.mensajes.map(function(m){return'<li>'+m+'</li>'}).join('');$('res4').hidden=false}
case4.addEventListener('change',showCase);$('rev4').addEventListener('click',evalCase);
seg('mode4',function(v){mode4=v;$('res4').hidden=true});seg('method4',function(v){method4=v;$('res4').hidden=true});
slider('dose4',function(v){return fx(v,1)+' J/cm²'},function(){$('res4').hidden=true});slider('hz4',function(v){return v+' Hz'},function(){$('res4').hidden=true});

/* ---------- TAB 5 ---------- */
var goal5=$('goal5');Object.keys(C.CLASS_DOSE).forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=C.GOAL_NAMES[k]+' ('+C.CLASS_DOSE[k][0]+'–'+C.CLASS_DOSE[k][1]+' J/cm²)';goal5.appendChild(o)});
function dose5(v){return Math.round(0.1*Math.pow(990,v/100)*100)/100}
function fd5(d){return fx(d,d<10?2:1)+' J/cm²'}
function c2d(c,W,H){var S=2;if(c._s!==1){c.width=W*S;c.height=H*S;c._s=1}var g=c.getContext('2d');g.setTransform(S,0,0,S,0,0);g.setLineDash([]);return g}
var SERIF='Cambria,Georgia,serif';
function cell(g,x0,y0,w,h,st,active,title,sub,leg){
 var i,cx=x0+w/2,cy=y0+172,rx=88,ry=62;
 g.fillStyle=active?'#FFF7E0':'#fff';g.fillRect(x0,y0,w,h);g.strokeStyle=active?'#8A1F1F':'#D9C7B6';g.lineWidth=active?4:2;g.strokeRect(x0,y0,w,h);
 g.textAlign='center';g.fillStyle='#2B1B10';g.font='bold 18px '+SERIF;g.fillText(title,cx,y0+26);g.font='14px '+SERIF;g.fillStyle='#6b5848';g.fillText(sub,cx,y0+46);
 var n=[2,6,12][st];g.strokeStyle='rgba(150,40,200,0.85)';g.fillStyle='rgba(150,40,200,0.85)';g.lineWidth=1.6;
 for(i=0;i<n;i++){var px=cx-rx+(i+0.5)*(2*rx/n),ya=y0+62,yb=cy-ry-6;g.beginPath();g.moveTo(px,ya);g.lineTo(px,yb);g.stroke();g.beginPath();g.moveTo(px,yb+6);g.lineTo(px-4,yb-2);g.lineTo(px+4,yb-2);g.closePath();g.fill()}
 g.fillStyle='#FBE9E1';g.strokeStyle=st===2?'#B3261E':'#B07A68';g.lineWidth=3;g.beginPath();g.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);g.fill();g.stroke();
 g.fillStyle='#D9C7E8';g.strokeStyle='#8E7AA8';g.lineWidth=2;g.beginPath();g.ellipse(cx-30,cy-6,24,20,0,0,Math.PI*2);g.fill();g.stroke();
 var mp=[[38,-22,0.5],[50,16,-0.4],[-50,30,0.3],[6,36,0.1],[-58,-30,-0.5]],mc=['#C8B8B2','#F0A92C','#8B3A2A'][st],mr=st===2?[21,13]:[17,9];
 mp.forEach(function(m){g.save();if(st===1){g.shadowColor='#FFC857';g.shadowBlur=16}g.fillStyle=mc;g.strokeStyle='#6B3410';g.lineWidth=2;g.beginPath();g.ellipse(cx+m[0],cy+m[1],mr[0],mr[1],m[2],0,Math.PI*2);g.fill();g.stroke();g.restore();
  g.save();g.translate(cx+m[0],cy+m[1]);g.rotate(m[2]);g.strokeStyle='rgba(107,52,16,0.7)';g.lineWidth=1.3;for(var k=-1;k<=1;k++){g.beginPath();g.moveTo(k*7,-mr[1]+3);g.lineTo(k*7+3,0);g.lineTo(k*7,mr[1]-3);g.stroke()}g.restore()});
 var na=[1,7,2][st],ap=[[-14,52],[22,50],[60,-2],[-20,12],[-76,6],[70,34],[-2,-44]];
 for(i=0;i<na;i++){g.fillStyle='#F2C14E';g.strokeStyle='#A8760B';g.lineWidth=1.5;g.beginPath();g.arc(cx+ap[i][0],cy+ap[i][1],5.5,0,Math.PI*2);g.fill();g.stroke()}
 if(st===2){g.strokeStyle='rgba(179,38,30,0.8)';g.lineWidth=2.5;for(i=-1;i<=1;i++){g.beginPath();for(var yy=0;yy<=22;yy+=2){var xx=cx+i*34+4*Math.sin(yy/3);yy?g.lineTo(xx,cy-ry-10-yy):g.moveTo(xx,cy-ry-10)}g.stroke()}}
 g.fillStyle='#2B1B10';g.font='bold 14px '+SERIF;g.textAlign='center';g.fillText(leg,cx,y0+h-12)}
function draw5(){
 var goal=goal5.value,r=C.CLASS_DOSE[goal],ds=dose5(+$('dose5').value),dep=+$('depth5').value,fat=+$('fat5').value,i;
 var fr=C.fractionRemaining(D.defaultNm,dep,{piel:2,grasa:fat}),dt=C.doseAtDepth(ds,fr),z=C.classifyDose(dt,goal),rs=C.tissueResponse(dt,goal),inh=z==='sobredosis'&&rs<0;
 $('dose5v').textContent=fd5(ds);$('depth5v').textContent=fx(dep,1)+' mm';$('fat5v').textContent=fat+' mm';
 $('r5a').textContent=fd5(ds);$('r5b').textContent=fx(fr*100,fr<0.1?1:0)+' %';$('r5c').textContent=fd5(dt);
 $('r5e').textContent=rs<0?'Inhibición (bajo no tratar)':fx(rs*100,0)+' % del máximo';
 $('verd5').textContent=inh?'Sobredosis: inhibición':VTXT[z];$('verd5').style.background=VCOL[z];
 var eff={infradosis:['Pocos fotones son absorbidos por las mitocondrias (citocromo c oxidasa).','Sin cambio medible en la producción de ATP: el tejido responde casi como sin tratar.','No hay daño; el riesgo es perder la sesión. Si el blanco es profundo, revise la dosis que realmente llega.'],
  ventana:['La luz se absorbe en la mitocondria (citocromo c oxidasa) y aumenta el ATP.','Cambia la señalización celular y las especies reactivas de oxígeno, en niveles bajos.','Efectos esperados según la clase: analgesia, menos inflamación, más actividad de fibroblastos y mejor microcirculación.'],
  sobre:['La respuesta ya empieza a bajar: más energía no suma efecto.','El modelo de Arndt-Schulz describe pérdida del estímulo por encima de la ventana.'],
  inh:['La respuesta cae por debajo de no tratar: inhibición (efecto bifásico).','Con dosis altas puede aparecer calentamiento local y molestia: suspender ante calor o dolor.','Más dosis no es mejor: revise tiempo, área y potencia.']};
 var key=z==='infradosis'?'infradosis':z==='ventana'?'ventana':(inh?'inh':'sobre');
 $('eff5').innerHTML=eff[key].map(function(t){return'<li>'+t+'</li>'}).join('');
 // curva
 var g=c2d($('c5a'),760,300),X0=78,X1=744,Y0=22,Y1=250,l0=Math.log10(0.1),l1=Math.log10(99),ym=1.1,yn=-1.3;
 function px(d){return X0+(Math.log10(Math.max(0.1,Math.min(99,d)))-l0)/(l1-l0)*(X1-X0)}
 function py(v){return Y0+(ym-v)/(ym-yn)*(Y1-Y0)}
 g.fillStyle='#fff';g.fillRect(0,0,760,300);
 g.fillStyle='#F3D9A0';g.fillRect(X0,Y0,px(r[0])-X0,Y1-Y0);g.fillStyle='#BFE3CB';g.fillRect(px(r[0]),Y0,px(r[1])-px(r[0]),Y1-Y0);g.fillStyle='#F4C3BD';g.fillRect(px(r[1]),Y0,X1-px(r[1]),Y1-Y0);
 g.fillStyle='#2B1B10';g.font='bold 14px '+SERIF;g.textAlign='center';g.fillText('Infradosis',(X0+px(r[0]))/2,Y0+16);g.fillText('Ventana',(px(r[0])+px(r[1]))/2,Y0+16);g.fillText('Sobredosis',(px(r[1])+X1)/2,Y0+16);
 g.strokeStyle='#2B1B10';g.lineWidth=1.5;g.beginPath();g.moveTo(X0,py(0));g.lineTo(X1,py(0));g.stroke();
 g.strokeStyle='#8A1F1F';g.lineWidth=4;g.beginPath();for(i=0;i<=240;i++){var d=Math.pow(10,l0+(l1-l0)*i/240),x=px(d),y=py(C.tissueResponse(d,goal));i?g.lineTo(x,y):g.moveTo(x,y)}g.stroke();
 g.font='bold 13px '+SERIF;g.textAlign='right';g.fillStyle='#2B1B10';g.fillText('Estímulo',X0-6,py(0.8)+4);g.fillText('Sin efecto',X0-6,py(0)+4);g.fillText('Inhibición',X0-6,py(-0.9)+4);
 g.textAlign='center';g.font='13px '+SERIF;[0.1,1,10,99].forEach(function(t){g.fillText(String(t).replace('.',','),px(t),Y1+16)});g.fillText('Dosis en el tejido (J/cm², escala logarítmica)',(X0+X1)/2,Y1+36);
 function dot(d,filled,lab,below){var x=px(d),y=py(C.tissueResponse(d,goal));g.fillStyle=filled?VCOL[z]:'#fff';g.strokeStyle=filled?'#2B1B10':'#6b5848';g.lineWidth=3;g.beginPath();g.arc(x,y,9,0,Math.PI*2);g.fill();g.stroke();
  g.font='bold 14px '+SERIF;var tw=g.measureText(lab).width,right=x+tw+30<X1,lx=right?x+16+tw/2:x-16-tw/2,ly=y+5+(below?26:0);g.fillStyle='rgba(255,255,255,0.93)';g.fillRect(lx-tw/2-4,ly-14,tw+8,19);g.fillStyle='#2B1B10';g.textAlign='center';g.fillText(lab,lx,ly)}
 if(Math.abs(Math.log10(ds)-Math.log10(dt))>0.02)dot(ds,false,'piel: '+fd5(ds),true);
 dot(dt,true,'tejido: '+fd5(dt),false);
 // células
 var g2=c2d($('c5b'),760,320),act=z==='infradosis'?0:(z==='ventana'?1:2);g2.fillStyle='#fff';g2.fillRect(0,0,760,320);
 cell(g2,6,6,240,308,0,act===0,'Infradosis','pocos fotones absorbidos','ATP sin cambio');
 cell(g2,260,6,240,308,1,act===1,'Ventana terapéutica','bioestimulación','ATP aumenta');
 cell(g2,514,6,240,308,2,act===2,'Sobredosis','saturación e inhibición','Respuesta inhibida y calor');
}
goal5.addEventListener('change',draw5);['dose5','depth5','fat5'].forEach(function(id){$(id).addEventListener('input',draw5)});
/* ---------- ANIMACIÓN (capas transparentes sobre los gráficos) ---------- */
var anim={playing:!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches),last:0,t:0,T3:0};
function overlay(id,W,H){var base=$(id),w=document.createElement('div');w.className='cw';base.parentNode.insertBefore(w,base);w.appendChild(base);var o=document.createElement('canvas');o.className='ov';o.setAttribute('aria-hidden','true');o.width=W*2;o.height=H*2;w.appendChild(o);return o}
function ogc(o,W,H){var g=o.getContext('2d');g.setTransform(2,0,0,2,0,0);g.clearRect(0,0,W,H);return g}
function dot(g,x,y,col,a){g.fillStyle='rgba('+col+','+(0.3*a)+')';g.beginPath();g.arc(x,y,6,0,6.283);g.fill();g.fillStyle='rgba('+col+','+(0.95*a)+')';g.beginPath();g.arc(x,y,3.2,0,6.283);g.fill();g.fillStyle='rgba(255,255,255,'+a+')';g.beginPath();g.arc(x,y,1.4,0,6.283);g.fill()}
function flashes(g,list,dt){for(var i=list.length-1;i>=0;i--){var f=list[i];f.t+=dt;var k=1-f.t/0.5;if(k<=0){list.splice(i,1);continue}
 if(f.c===1){g.fillStyle='rgba(255,214,74,'+(0.8*k)+')';g.beginPath();g.arc(f.x,f.y,3+f.t*40,0,6.283);g.fill()}
 else{g.strokeStyle=(f.c===2?'rgba(255,214,74,':'rgba(255,255,255,')+k+')';g.lineWidth=f.c===2?3:2;g.beginPath();g.arc(f.x,f.y,4+f.t*(f.c===2?60:30),0,6.283);g.stroke()}}
 if(list.length>140)list.splice(0,list.length-140)}
function newPh(span){return{d:-Math.random()*span,u:Math.random(),x:(Math.random()-0.5)*40,vx:0}}
function resetPh(p){p.d=-Math.random()*1.5;p.u=Math.random();p.x=(Math.random()-0.5)*40;p.vx=0}
/* haces: cada fotón baja, se dispersa y se absorbe según la luz restante (misma función del cálculo) */
function flyPhotons(list,nm,th,dt,o){var vis=isVis(nm),sc=vis?70:45,speed=o.speed||14,gate=o.gate!==false;
 list.forEach(function(p){var pd=p.d;if(p.d>0||gate)p.d+=speed*dt;
  if(p.d>0){p.vx+=(Math.random()-0.5)*sc*dt*(0.5+p.d/12);p.vx*=0.96;p.x+=p.vx*dt;var lim=26+p.d*1.2;p.x=Math.max(-lim,Math.min(lim,p.x));
   if(o.mark!==undefined&&pd<=o.mark&&p.d>o.mark)o.fl.push({x:o.cx+p.x,y:o.top+o.mark*o.pm,t:0,c:o.markC||0});
   if(p.d>o.maxD||C.fractionRemaining(nm,p.d,th)<p.u){o.fl.push({x:o.cx+p.x,y:o.top+Math.min(p.d,o.maxD)*o.pm,t:0,c:1});resetPh(p)}}})}
function drawPhotons(g,list,nm,o){var col=isVis(nm)?'255,70,70':'190,110,255';list.forEach(function(p){if(p.d>0)dot(g,o.cx+p.x,o.top+p.d*o.pm,col,1)})}
function emitGlow(g,cx,cy,r){var pulse=0.5+0.5*Math.sin(anim.t*6),gr=g.createRadialGradient(cx,cy,0,cx,cy,r+6*pulse);gr.addColorStop(0,'rgba(255,255,255,0.9)');gr.addColorStop(0.4,'rgba(190,110,255,0.55)');gr.addColorStop(1,'rgba(190,110,255,0)');g.fillStyle=gr;g.beginPath();g.arc(cx,cy,r+6*pulse,0,6.283);g.fill()}

/* pestaña 1 */
var ov1=overlay('c1',760,670),P1=[[],[]],F1=[];for(var qi=0;qi<36;qi++){P1[0].push(newPh(40));P1[1].push(newPh(40))}
function anim1(dt){var g=ogc(ov1,760,670),th={piel:2,grasa:+$('fat1').value},dep=+$('d1').value,nms=[nm1,refNm()],cxs=[250,520];
 nms.forEach(function(n,b){var o={cx:cxs[b],top:150,pm:11,maxD:40,mark:dep,fl:F1};flyPhotons(P1[b],n,th,dt,o);emitGlow(g,cxs[b],150,18)});
 nms.forEach(function(n,b){drawPhotons(g,P1[b],n,{cx:cxs[b],top:150,pm:11})});flashes(g,F1,dt)}

/* pestaña 3: cursor que recorre la forma de onda */
var ov3=overlay('c3',760,330);
function anim3(dt){var g=ogc(ov3,760,330),L=78,R=740,T=70,B=270,N=4,hz=mode3==='pulsado'?+$('hz3').value:0,duty=+$('duty3').value;
 anim.T3+=dt;var fr=(anim.T3%5)/5,x=L+(R-L)*fr,on=true;if(hz>0){on=((fr*N)%1)<duty/100}
 var y=on?B-(B-T)*200/250:B;
 g.strokeStyle='rgba(100,30,170,0.7)';g.lineWidth=2;g.setLineDash([5,5]);g.beginPath();g.moveTo(x,T-8);g.lineTo(x,B);g.stroke();g.setLineDash([]);
 if(on)emitGlow(g,x,y,14);g.fillStyle=on?'#8434D4':'#8A8A8A';g.strokeStyle='#fff';g.lineWidth=2.5;g.beginPath();g.arc(x,y,7,0,6.283);g.fill();g.stroke();
 g.fillStyle=on?'#2E9E5B':'#B5B0AA';g.strokeStyle='#2B1B10';g.lineWidth=1.5;g.beginPath();g.arc(R-160,50,9,0,6.283);g.fill();g.stroke();
 g.fillStyle='#2B1B10';g.font='bold 15px '+FONT;g.textAlign='left';g.fillText(on?'Láser ENCENDIDO':'Láser apagado',R-144,56)}

/* pestaña 4: sonda sobre la región y fotones en el corte */
var ov4=overlay('c4',760,400),P4=[],F4=[];for(qi=0;qi<26;qi++)P4.push(newPh(15));
var APP4={epicondilitis:[190,258],herida:[215,240],cervicalgia:[140,214],gemelos:[206,212]};
function anim4(dt){var g=ogc(ov4,760,400),c=C.CASES[+case4.value],maxD=Math.max(15,c.profundidadMm+6),pm=(380-92)/maxD,hz=mode4==='pulsado'?+$('hz4').value:0,
 gate=hz>0?(anim.t%1)<0.5:true,o={cx:652,top:92,pm:pm,maxD:maxD,mark:c.profundidadMm,markC:2,fl:F4,gate:gate,speed:14};
 flyPhotons(P4,830,{piel:2,grasa:c.grasaMm},dt,o);drawPhotons(g,P4,830,o);flashes(g,F4,dt);
 var a=APP4[c.id];if(gate){var k=(anim.t*1.2)%1;g.strokeStyle='rgba(132,52,212,'+(0.8*(1-k))+')';g.lineWidth=3;g.beginPath();g.arc(a[0],a[1],10+k*26,0,6.283);g.stroke()}
 g.fillStyle=gate?'#6A1FA8':'#6b5848';g.font='bold 14px '+FONT;g.textAlign='left';g.fillText(hz>0?(gate?'Pulso encendido':'Pulso apagado (cámara lenta)'):'Emisión continua',420,72)}

/* pestaña 5: fotones que llegan a la mitocondria; ATP o calor según la zona */
var ov5=overlay('c5b',760,320),P5=[],F5=[],ATP5=[],PX5=[6,260,514],MI5=[[38,-22],[50,16],[-50,30],[6,36],[-58,-30]],NP5=[2,6,12];
NP5.forEach(function(n,s){for(var i=0;i<n;i++)P5.push({s:s,x0:PX5[s]+120-88+(i+0.5)*(176/n),m:Math.floor(Math.random()*5),t:-Math.random()*1.5,dur:0.9+Math.random()*0.3})});
function anim5(dt){var g=ogc(ov5,760,320),cyy=178;
 for(var s=0;s<3;s++){var cx=PX5[s]+120;
  if(s===1)MI5.forEach(function(m,k){var a=0.22*(0.5+0.5*Math.sin(anim.t*4+k));g.fillStyle='rgba(255,200,70,'+a+')';g.beginPath();g.arc(cx+m[0],cyy+m[1],24,0,6.283);g.fill()});
  if(s===2){g.lineWidth=2.5;for(var i=-1;i<=1;i+=2){g.strokeStyle='rgba(179,38,30,'+(0.4+0.4*Math.sin(anim.t*5+i))+')';g.beginPath();for(var yy=0;yy<=34;yy+=2){var xx=cx+i*17+5*Math.sin(yy/3-anim.t*8);yy?g.lineTo(xx,100-yy):g.moveTo(xx,100)}g.stroke()}}}
 P5.forEach(function(p){p.t+=dt;if(p.t<0)return;var k=p.t/p.dur,cx=PX5[p.s]+120,tx=cx+MI5[p.m][0],ty=cyy+MI5[p.m][1];
  if(k>=1){F5.push({x:tx,y:ty,t:0,c:1,s:p.s});if(p.s===1)ATP5.push({x:tx,y:ty,t:0});
   p.t=-(p.s===0?1.2+Math.random():(p.s===1?0.2+Math.random()*0.6:Math.random()*0.2));p.m=Math.floor(Math.random()*5);return}
  dot(g,p.x0+(tx-p.x0)*k,68+(ty-68)*k,'190,110,255',1)});
 for(var j=F5.length-1;j>=0;j--){var f=F5[j];f.t+=dt;var kk=1-f.t/0.5;if(kk<=0){F5.splice(j,1);continue}
  g.fillStyle=(f.s===0?'rgba(210,190,180,':(f.s===1?'rgba(255,214,74,':'rgba(210,40,30,'))+(0.8*kk)+')';g.beginPath();g.arc(f.x,f.y,3+f.t*(f.s===0?18:36),0,6.283);g.fill()}
 for(j=ATP5.length-1;j>=0;j--){var a=ATP5[j];a.t+=dt;var ka=1-a.t/1.1;if(ka<=0){ATP5.splice(j,1);continue}
  g.fillStyle='rgba(242,193,78,'+ka+')';g.strokeStyle='rgba(168,118,11,'+ka+')';g.lineWidth=1.5;g.beginPath();g.arc(a.x+8,a.y-a.t*26,5.5,0,6.283);g.fill();g.stroke()}
 if(F5.length>80)F5.splice(0,F5.length-80)}

/* ---------- pestaña 6: técnicas de aplicación y laterodispersión ---------- */
var tec6=C.TECHNIQUES[0].id,tt6=0,nm6=D.defaultNm,ind6=0;
(function(){var el=$('tec6');C.TECHNIQUES.forEach(function(t,i){var b=document.createElement('button');b.setAttribute('data-v',t.id);b.textContent=t.nombre.split(' (')[0];if(!i)b.className='on';el.appendChild(b)});
 var e2=$('nm6');C.WAVELENGTHS.forEach(function(n){var b=document.createElement('button');b.setAttribute('data-v',n);b.textContent=nmTxt(n);if(n===nm6)b.className='on';e2.appendChild(b)})})();
function info6(){var t=C.TECHNIQUES.filter(function(x){return x.id===tec6})[0];
 $('tec6info').innerHTML='<p class="case"><b>'+t.nombre+'.</b></p><p class="case"><b>Cómo se hace.</b> '+t.como+'</p><p class="case"><b>Indicaciones.</b> '+t.indicaciones+'</p><p class="note" style="font-size:17px">'+t.nota+'</p>'}
seg('tec6',function(v){tec6=v;tt6=0;info6()});info6();
function pathLen(pts){var L=[0];for(var i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));return L}
var RAS=[],PIN=[],PTS6=[[160,190],[200,176],[242,190],[172,226],[212,236],[252,224]];
(function(){var y,dir=1;for(y=125;y<=285;y+=32,dir=-dir){if(dir>0){RAS.push([110,y]);RAS.push([290,y])}else{RAS.push([290,y]);RAS.push([110,y])}}
 var x,k=0;for(x=90;x<=310;x+=11,k++)PIN.push([x,205+(k%2?16:-16)])})();
var RASL=pathLen(RAS),PINL=pathLen(PIN);
function along(pts,L,s){var i=1;while(i<pts.length-1&&L[i]<s)i++;var a=pts[i-1],b=pts[i],k=Math.max(0,Math.min(1,(s-L[i-1])/((L[i]-L[i-1])||1)));return[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,i]}
function trail6(g,pts,L,s,w){var e=along(pts,L,s);g.strokeStyle='rgba(132,52,212,0.3)';g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(var i=1;i<e[2];i++)g.lineTo(pts[i][0],pts[i][1]);g.lineTo(e[0],e[1]);g.stroke()}
function spot6(g,x,y,r,a){var gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,'+a+')');gr.addColorStop(0.35,'rgba(160,80,230,'+(0.75*a)+')');gr.addColorStop(1,'rgba(132,52,212,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,6.283);g.fill()}
function anim6a(dt){var g=hidpi($('c6a'),760,380),tec=tec6,bx=200,by=205,on=true,r=14,i;tt6+=dt;
 g.fillStyle='#fff';g.fillRect(0,0,760,380);g.fillStyle='#FBF6F0';g.fillRect(8,8,384,368);g.fillRect(400,8,352,368);
 txt(g,'Vista superior',20,32,'bold 17px '+FONT,'#8A1F1F');txt(g,'Vista lateral',412,32,'bold 17px '+FONT,'#8A1F1F');
 g.fillStyle=SKIN;rr(g,16,44,368,320,14);g.fill();g.strokeStyle=SKIN_D;g.lineWidth=2.5;g.stroke();
 g.save();g.setLineDash([6,4]);g.strokeStyle='#8A1F1F';g.lineWidth=2;g.fillStyle='rgba(179,38,30,0.2)';var lab='';
 if(tec==='punteado'){g.beginPath();g.ellipse(206,205,66,44,0,0,6.283);g.fill();g.stroke();lab='zona dolorosa (puntos gatillo)'}
 else if(tec==='barrido'){g.beginPath();g.rect(100,112,200,184);g.fill();g.stroke();lab='área a tratar'}
 else if(tec==='pincelado'){g.setLineDash([]);g.strokeStyle='#B3261E';g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(90,205);g.lineTo(310,205);g.stroke();lab='herida o cicatriz lineal'}
 else{g.beginPath();g.ellipse(200,205,120,78,0,0,6.283);g.fill();g.stroke();lab='lesión extensa o dolorosa al contacto'}
 g.restore();txt(g,lab,200,336,'bold 15px '+FONT,'#8A1F1F','center','rgba(255,255,255,0.8)');
 if(tec==='punteado'){var n=PTS6.length,dw=1.3,cyc=(n+1)*dw,t=tt6%cyc,idx=Math.floor(t/dw);on=idx<n;
  for(i=0;i<Math.min(idx,n);i++){g.fillStyle='rgba(132,52,212,0.35)';g.beginPath();g.arc(PTS6[i][0],PTS6[i][1],14,0,6.283);g.fill();g.strokeStyle='rgb(100,30,170)';g.lineWidth=2;g.stroke()}
  if(on){bx=PTS6[idx][0];by=PTS6[idx][1];txt(g,'Punto '+(idx+1)+' de '+n,200,60,'bold 16px '+FONT,'#4A2416','center','rgba(255,255,255,0.85)')}
  else{bx=PTS6[n-1][0];by=PTS6[n-1][1]}}
 else if(tec==='barrido'||tec==='pincelado'){var pts=tec==='barrido'?RAS:PIN,L=tec==='barrido'?RASL:PINL,sp=tec==='barrido'?85:60,tot=L[L.length-1],s=(tt6*sp)%(tot+sp*1.5);on=s<=tot;s=Math.min(s,tot);
  trail6(g,pts,L,s,tec==='barrido'?26:24);var e=along(pts,L,s);bx=e[0];by=e[1];r=tec==='barrido'?13:11}
 else{r=126+6*Math.sin(tt6*3);spot6(g,200,205,r,0.55);bx=200;by=205}
 if(on)spot6(g,bx,by,tec==='bano'?20:r+8,1);
 /* vista lateral */
 var sx=Math.max(430,Math.min(722,420+(bx-10)/380*300+(by-205)*0.5)),tipY=tec==='bano'?196:288,sk=296;
 g.fillStyle=SKIN;g.fillRect(412,sk,328,56);g.fillStyle='#D9A58A';g.fillRect(412,sk,328,5);g.strokeStyle=SKIN_D;g.lineWidth=2;g.strokeRect(412,sk,328,56);
 txt(g,'Piel',420,sk+30,'bold 14px '+FONT,'#4A2416','left');
 if(on){var w0=tec==='bano'?150:28,a0=tec==='bano'?0.2:0.5,gr=g.createLinearGradient(0,tipY,0,sk+64);gr.addColorStop(0,'rgba(160,80,230,'+(a0*1.5)+')');gr.addColorStop(1,'rgba(132,52,212,0)');
  g.fillStyle=gr;g.beginPath();g.moveTo(sx-6,tipY);g.lineTo(sx-w0/2,sk);g.lineTo(sx-w0/2*0.8,sk+56);g.lineTo(sx+w0/2*0.8,sk+56);g.lineTo(sx+w0/2,sk);g.lineTo(sx+6,tipY);g.closePath();g.fill()}
 g.fillStyle='#3A3A3A';rr(g,sx-18,tipY-100,36,86,8);g.fill();g.fillStyle='#8E959C';g.fillRect(sx-14,tipY-16,28,12);g.fillStyle=on?'#C9A6F2':'#555';g.fillRect(sx-9,tipY-4,18,4);
 g.fillStyle='#F2C14E';g.beginPath();g.arc(sx,tipY-70,3.5,0,6.283);g.fill();
 g.strokeStyle='#3A3A3A';g.lineWidth=4;g.beginPath();g.moveTo(sx,tipY-100);g.quadraticCurveTo(sx,tipY-130,sx+30,tipY-150);g.stroke();
 if(tec==='bano'){g.strokeStyle='#2B1B10';g.lineWidth=1.5;g.setLineDash([5,4]);g.beginPath();g.moveTo(sx+44,tipY);g.lineTo(sx+44,sk);g.stroke();g.setLineDash([]);txt(g,'distancia',sx+50,(tipY+sk)/2+5,'bold 14px '+FONT,'#2B1B10','left','rgba(255,255,255,0.85)')}
 txt(g,tec==='bano'?'Sin contacto':'Perpendicular, en contacto',416,58,'bold 15px '+FONT,'#2B1B10','left');
 txt(g,tec==='bano'?'Irradiancia en la piel: baja (haz abierto)':'Irradiancia en la piel: alta (haz concentrado)',412+176,372,'bold 14px '+FONT,'#6A1FA8','center')}
/* laterodispersión: cada fotón avanza, cambia de dirección al azar, se absorbe o vuelve a salir */
var PH6=[],AB6=[],EX6=[],MED6=[],cnt6={a:0,e:0},qk;
function rn6(){return(Math.random()+Math.random()+Math.random()-1.5)*1.4}
for(qk=0;qk<70;qk++)PH6.push({on:false,delay:Math.random()*2,x:0,y:0,a:0,w:1,h:[]});
for(qk=0;qk<16;qk++)MED6.push({x:Math.random()*700});
function reset6(){cnt6.a=0;cnt6.e=0;AB6.length=0;EX6.length=0}
seg('nm6',function(v){nm6=+v;reset6()});seg('ind6',function(v){ind6=+v});
slider('spot6',function(v){return v+' mm'},reset6);slider('fat6',function(v){return v+' mm'},reset6);
function anim6b(dt){var g=hidpi($('c6b'),760,420),pm=14,top=70,cx=380,spot=+$('spot6').value,fat=+$('fat6').value,th={piel:2,grasa:fat},nm=nm6,k=C.PENETRATION_MM[nm],i;
 g.fillStyle='#FBF6F0';g.fillRect(0,0,760,420);tissue(g,16,744,top,pm,24,fat);
 PH6.forEach(function(p){
  if(!p.on){p.delay-=dt;if(p.delay>0)return;p.on=true;p.x=(Math.random()-0.5)*spot;p.y=0;p.a=rn6()*0.05;p.w=1;p.h=[]}
  var rem=18*dt;
  while(rem>0&&p.on){var st=Math.min(0.5,rem);rem-=st;var lk=p.y<2?k.piel:(p.y<2+fat?k.grasa:k.musculo);
   if(Math.random()<st/(lk*0.3))p.a=p.a*0.2+rn6()*1.5;
   p.x+=Math.sin(p.a)*st;p.y+=Math.cos(p.a)*st;
   var w1=C.fractionRemaining(nm,Math.max(0,p.y),th),loss=Math.max(0,p.w-w1);p.w=Math.min(p.w,w1);
   if(Math.random()<loss*8)AB6.push({x:p.x,y:Math.min(p.y,24),t:0});
   if(p.y<0){EX6.push({x:p.x,t:0,w:p.w});cnt6.e+=p.w;cnt6.a+=1-p.w;p.on=false;p.delay=Math.random()*0.4;break}
   if(p.y>24||p.w<0.05){cnt6.a+=1;p.on=false;p.delay=Math.random()*0.4;break}}
  if(p.on){p.h.push([p.x,p.y]);if(p.h.length>7)p.h.shift()}});
 if(cnt6.a+cnt6.e>3000){cnt6.a*=0.5;cnt6.e*=0.5}
 /* haz y emisor */
 var hw=spot*pm/2;g.strokeStyle='#2B1B10';g.lineWidth=1.5;g.setLineDash([7,5]);g.beginPath();g.moveTo(cx-hw,top-4);g.lineTo(cx-hw,top+24*pm);g.moveTo(cx+hw,top-4);g.lineTo(cx+hw,top+24*pm);g.stroke();g.setLineDash([]);
 g.fillStyle='#4A4A4A';g.fillRect(cx-hw,top-14,hw*2,10);emitGlow(g,cx,top-9,Math.max(16,hw));
 txt(g,'Ancho del haz: '+spot+' mm',cx,28,'bold 16px '+FONT,'#2B1B10','center');txt(g,'Línea discontinua = límite del haz',cx,48,'14px '+FONT,'#6b5848','center');
 /* efecto indirecto */
 if(ind6===1){var vy=top+Math.min(22,2+fat+6)*pm;g.strokeStyle='#A83232';g.lineWidth=12;g.lineCap='round';g.beginPath();g.moveTo(24,vy);g.lineTo(736,vy);g.stroke();g.strokeStyle='#E57373';g.lineWidth=6;g.beginPath();g.moveTo(24,vy);g.lineTo(736,vy);g.stroke();
  MED6.forEach(function(m){m.x+=70*dt;if(m.x>730)m.x=cx-hw+Math.random()*hw*2;g.fillStyle='#FFD54A';g.strokeStyle='#A8760B';g.lineWidth=1.5;g.beginPath();g.arc(m.x,vy,5,0,6.283);g.fill();g.stroke()});
  var gl=0.25+0.15*Math.sin(tt6*3+anim.t*3);g.fillStyle='rgba(255,213,74,'+gl+')';g.beginPath();g.arc(690,vy,34,0,6.283);g.fill();
  txt(g,'Mediadores por la microcirculación: efecto indirecto',24,vy-12,'bold 14px '+FONT,'#5A1A1A','left','rgba(255,255,255,0.85)');txt(g,'zona vecina',690,vy+44,'bold 14px '+FONT,'#5A4210','center','rgba(255,255,255,0.85)')}
 /* absorciones, salidas y fotones */
 for(i=AB6.length-1;i>=0;i--){var a=AB6[i];a.t+=dt;var ka=1-a.t/3;if(ka<=0){AB6.splice(i,1);continue}g.fillStyle='rgba(255,224,102,'+(0.9*ka)+')';g.beginPath();g.arc(cx+a.x*pm,top+a.y*pm,2.6,0,6.283);g.fill()}
 if(AB6.length>500)AB6.splice(0,AB6.length-500);
 for(i=EX6.length-1;i>=0;i--){var x=EX6[i];x.t+=dt;var kx=1-x.t/0.6;if(kx<=0){EX6.splice(i,1);continue}g.strokeStyle='rgba(255,255,255,'+kx+')';g.lineWidth=2.5;g.beginPath();g.arc(cx+x.x*pm,top,4+x.t*34,Math.PI,2*Math.PI);g.stroke()}
 var col=isVis(nm)?'255,70,70':'190,110,255';
 PH6.forEach(function(p){if(!p.on)return;var al=0.35+0.65*p.w;g.strokeStyle='rgba('+col+','+(0.5*al)+')';g.lineWidth=2;g.beginPath();p.h.forEach(function(q,j){j?g.lineTo(cx+q[0]*pm,top+q[1]*pm):g.moveTo(cx+q[0]*pm,top+q[1]*pm)});g.stroke();dot(g,cx+p.x*pm,top+p.y*pm,col,al)});
 txt(g,'La luz se abre hacia los lados y parte vuelve a salir',736,top+12*pm,'bold 14px '+FONT,'#2B1B10','right','rgba(255,255,255,0.8)');
 var tot=cnt6.a+cnt6.e||1;$('r6a').textContent=fx(cnt6.a/tot*100,0)+' %';$('r6b').textContent=fx(cnt6.e/tot*100,0)+' %';
 var f10=C.fractionRemaining(nm,10,th);$('r6c').textContent=fx(f10*100,f10<0.1?1:0)+' %'}
function anim6(dt){anim6a(dt);anim6b(dt)}
function frame(now){var dt=anim.last?Math.min(0.05,(now-anim.last)/1000):0;anim.last=now;if(!anim.playing)dt=0;anim.t+=dt;
 if($('t1').classList.contains('on'))anim1(dt);else if($('t3').classList.contains('on'))anim3(dt);else if($('t4').classList.contains('on'))anim4(dt);else if($('t5').classList.contains('on'))anim5(dt);else if($('t6').classList.contains('on'))anim6(dt);
 if(!dead)raf=requestAnimationFrame(frame)}
$('animBtn').textContent=anim.playing?'Pausar animación':'Reanudar animación';
$('animBtn').addEventListener('click',function(){anim.playing=!anim.playing;this.textContent=anim.playing?'Pausar animación':'Reanudar animación'});
raf=requestAnimationFrame(frame);
showCase();calc2();calc3();draw1();draw5();
return {destroy:function(){dead=true;cancelAnimationFrame(raf)}};
  }
});
