/* Módulo Ultrasonido del Laboratorio (migrado del simulador de proyección). */
LabCore.register({
  id: 'ultrasonido',
  title: 'Ultrasonido',
  css: `:host{--brown:#7A3D12;--brown2:#A8602D;--cream:#FBF6F0;--ink:#2B1B10;--line:#D9C7B6;--ok:#2E7D4F;--warn:#C77700;--bad:#B3261E;--blue:#1F5F8B}
*{box-sizing:border-box}
.lab{margin:0;background:var(--cream);color:var(--ink);font-family:Cambria,Georgia,serif;font-size:20px}
header{background:var(--brown);color:#fff;padding:12px 24px;display:flex;align-items:baseline;gap:18px;flex-wrap:wrap}
header h1{margin:0;font-size:28px}
header span{opacity:.85;font-size:17px}
nav{display:flex;gap:6px;padding:10px 24px 0;border-bottom:3px solid var(--brown);flex-wrap:wrap}
nav button{font:inherit;font-weight:bold;padding:10px 22px;border:2px solid var(--brown);border-bottom:none;background:#fff;color:var(--brown);border-radius:10px 10px 0 0;cursor:pointer;transition:background .2s,color .2s}
nav button:hover{background:#F3E6DA}
nav button.on{background:var(--brown);color:#fff}
main{padding:16px 24px}
.tab{display:none}.tab.on{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:20px;animation:aparece .3s ease}
@keyframes aparece{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media(max-width:1000px){.tab.on{grid-template-columns:minmax(0,1fr)}}
.card{background:#fff;border:2px solid var(--line);border-radius:12px;padding:14px 16px;min-width:0}
h2{margin:0 0 8px;color:var(--brown);font-size:24px}
canvas{width:100%;height:auto;display:block;background:#fff;border-radius:8px}
.row{display:flex;align-items:center;gap:12px;margin:10px 0;flex-wrap:wrap}
.row label{min-width:150px;font-weight:bold}
.seg{display:inline-flex;flex-wrap:wrap;max-width:100%;border:2px solid var(--brown);border-radius:8px;overflow:hidden}
.seg button{font:inherit;padding:6px 16px;border:none;background:#fff;color:var(--brown);cursor:pointer;border-right:1px solid var(--line);transition:background .2s,color .2s}
.seg button:hover{background:#F3E6DA}
.seg button:last-child{border-right:none}
.seg button.on{background:var(--brown);color:#fff;font-weight:bold}
input[type=range]{flex:1;min-width:160px;height:32px;accent-color:var(--brown)}
.val{min-width:110px;font-weight:bold;color:var(--brown);font-size:22px}
.out{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px 14px;font-size:22px}
.out div:nth-child(odd){color:#5a4636}
.out div:nth-child(even){font-weight:bold;color:var(--brown);text-align:right}
.badge{display:inline-block;padding:6px 14px;border-radius:20px;color:#fff;font-weight:bold;font-size:20px;transition:background .3s}
.note{font-size:16px;color:#6b5848;margin-top:8px}
.big{font-size:26px}
.case{margin:0 0 10px;font-size:19px;line-height:1.35}
.reveal{font:inherit;font-weight:bold;padding:8px 18px;border:2px solid var(--brown);border-radius:8px;background:#fff;color:var(--brown);cursor:pointer;transition:background .2s,color .2s}
.reveal:hover{background:var(--brown);color:#fff}
#prop4 .out{font-size:19px}
.meter{display:grid;grid-template-columns:170px minmax(0,1fr) 60px;gap:10px;align-items:center;margin:8px 0;font-size:19px}
.bar{height:16px;background:#EFE4D8;border-radius:8px;overflow:hidden}
.bar i{display:block;height:100%;width:0;background:var(--brown2);transition:width .4s}
.meter b{color:var(--brown);text-align:right}
@media(max-width:640px){.lab{font-size:18px}main{padding:12px}header,nav{padding-left:12px;padding-right:12px}.row label{min-width:0;width:100%}.out{font-size:19px}}`,
  html: `<header><h1>Ultrasonido terapéutico</h1><span>Agentes Físicos · Simulador didáctico para proyección</span></header>
<nav id="nav">
<button class="on" data-t="t1">1 · Penetración</button>
<button data-t="t2">2 · Cavitación</button>
<button data-t="t3">3 · Continuo y pulsátil</button>
<button data-t="t4">4 · Caso: lesión muscular aguda</button>
</nav>
<main>

<!-- TAB 1 -->
<section class="tab on" id="t1">
<div class="card">
<canvas id="c1" width="760" height="580"></canvas>
</div>
<div>
<div class="card">
<h2>Controles</h2>
<div class="row"><label>Frecuencia</label><div class="seg" id="f1"><button data-v="1" class="on">1 MHz</button><button data-v="3">3 MHz</button></div></div>
<div class="row"><label>Tejido</label><div class="seg" id="tis"><button data-v="muscle" class="on">Músculo</button><button data-v="fat">Grasa</button><button data-v="tendon">Tendón</button></div></div>
<div class="row"><label>Profundidad</label><input type="range" id="depth" min="0" max="8" step="0.1" value="2"><span class="val" id="depthv">2.0 cm</span></div>
</div>
<div class="card" style="margin-top:14px">
<h2>Lecturas</h2>
<div class="out">
<div>Capa de hemirreducción (mitad de intensidad), 1 MHz</div><div id="hvl1">—</div>
<div>Capa de hemirreducción, 3 MHz</div><div id="hvl3">—</div>
<div>Intensidad restante a esa profundidad, 1 MHz</div><div id="rem1">—</div>
<div>Intensidad restante a esa profundidad, 3 MHz</div><div id="rem3">—</div>
</div>
<p class="note">Valores didácticos aproximados: las fuentes varían (en músculo, 2,3–4 cm a 1 MHz y 1–2,5 cm a 3 MHz). Hueso: absorbe y refleja casi todo en superficie (riesgo de dolor perióstico).</p>
</div>
</div>
</section>

<!-- TAB 2 -->
<section class="tab" id="t2">
<div class="card">
<canvas id="c2" width="760" height="580"></canvas>
</div>
<div>
<div class="card">
<h2>Controles</h2>
<div class="row"><label>Intensidad</label><input type="range" id="i2" min="0.1" max="3" step="0.1" value="0.8"><span class="val" id="i2v">0.8 W/cm²</span></div>
<div class="row"><label>Frecuencia</label><div class="seg" id="f2"><button data-v="1" class="on">1 MHz</button><button data-v="3">3 MHz</button></div></div>
<div class="row"><label>Modo</label><div class="seg" id="m2"><button data-v="1">Continuo</button><button data-v="0.5">Pulsado 50 %</button><button data-v="0.2" class="on">Pulsado 20 %</button></div></div>
<div class="row"><label>Cabezal</label><div class="seg" id="h2"><button data-v="move" class="on">En movimiento</button><button data-v="still">Quieto</button></div></div>
</div>
<div class="card" style="margin-top:14px">
<h2>Lectura</h2>
<div class="out"><div>Índice relativo de cavitación</div><div id="idx">—</div></div>
<p style="margin:12px 0"><span class="badge" id="cat">—</span></p>
<p class="note" id="catx"></p>
<p class="note">Modelo cualitativo (índice = intensidad × ciclo de trabajo × factor de frecuencia; 3 MHz pesa 0,35 frente a 1 MHz). En tejido normal la cavitación inestable es improbable a dosis terapéuticas; se muestra con fines ilustrativos.</p>
</div>
</div>
</section>

<!-- TAB 3 -->
<section class="tab" id="t3">
<div class="card">
<canvas id="c3" width="760" height="560"></canvas>
<div class="note">Arriba: tres periodos de 10 ms (pulso a 100 Hz). Altura = intensidad de pico; línea punteada = intensidad media (SATA). Abajo: efecto en el tejido.</div>
<p class="big" style="margin:10px 0 0">Efecto predominante: <b id="eff" style="color:var(--brown)">—</b></p>
</div>
<div>
<div class="card">
<h2>Controles</h2>
<div class="row"><label>Intensidad</label><input type="range" id="i3" min="0.1" max="3" step="0.1" value="1"><span class="val" id="i3v">1.0 W/cm²</span></div>
<div class="row"><label>Ciclo de trabajo</label><div class="seg" id="d3"><button data-v="1">100 %</button><button data-v="0.5">50 %</button><button data-v="0.2" class="on">20 %</button><button data-v="0.1">10 %</button></div></div>
<div class="row"><label>Cabezal</label><div class="seg" id="a3"><button data-v="1">1 cm²</button><button data-v="5" class="on">5 cm²</button></div></div>
<div class="row"><label>Tiempo</label><input type="range" id="t3r" min="1" max="20" step="1" value="8"><span class="val" id="t3v">8 min</span></div>
</div>
<div class="card" style="margin-top:14px">
<h2>Calculadora de dosis</h2>
<div class="out">
<div>Intensidad media (SATA) = I × ciclo</div><div id="sata">—</div>
<div>Potencia de pico = I × cabezal</div><div id="pp">—</div>
<div>Potencia media</div><div id="pm">—</div>
<div>Energía total (potencia media × tiempo)</div><div id="en">—</div>
<div>Rango de dosis por intensidad (clase)</div><div id="ph">—</div>
</div>
<p class="note">La energía depende de la potencia media y del tiempo, no solo de la intensidad que muestra el aparato.</p>
</div>
</div>
</section>

<!-- TAB 4 -->
<section class="tab" id="t4">
<div class="card">
<canvas id="c4" width="760" height="620"></canvas>
<div class="note">Esquema didáctico simplificado y cualitativo. Arriba: lesión, haz y calor. Abajo izquierda: efecto celular del estímulo mecánico. Abajo derecha: respuesta vascular. Las cifras son aproximadas.</div>
</div>
<div>
<div class="card">
<h2>Caso clínico</h2>
<p class="case"><b>Paciente:</b> futbolista aficionado, 24 años. Tirón brusco al esprintar, con dolor en la cara posterior del muslo derecho.</p>
<p class="case"><b>Evaluación (36 h después):</b> edema leve y equimosis incipiente sobre el bíceps femoral. EVA 3/10 en reposo y 6/10 al estirar. Flexión de rodilla resistida dolorosa.</p>
<p class="case" style="margin-bottom:0"><b>Impresión:</b> distensión grado II en <b>fase inflamatoria aguda</b>. ¿Qué modo e intensidad usaría hoy?</p>
</div>
<div class="card" style="margin-top:14px">
<h2>Controles</h2>
<div class="row"><label>Modo</label><div class="seg" id="m4"><button data-v="p20" class="on">Pulsátil 20 %</button><button data-v="p50">Pulsátil 50 %</button><button data-v="c">Continuo</button></div></div>
<div class="row"><label>Intensidad</label><input type="range" id="i4" min="0.1" max="3" step="0.1" value="0.5"><span class="val" id="i4v">0.5 W/cm²</span></div>
<div class="row"><button class="reveal" id="pr1" type="button">Dosis recomendada</button><button class="reveal" id="pr2" type="button">Error: continuo, intensidad alta</button></div>
<div class="out" style="margin-top:10px">
<div>Intensidad media (SATA)</div><div id="sata4">—</div>
<div>Calentamiento estimado</div><div id="dt4">—</div>
</div>
<div class="meter"><span>Sangrado y edema</span><div class="bar"><i id="bb4"></i></div><b id="bv4">—</b></div>
<div class="meter"><span>Estímulo celular</span><div class="bar"><i id="bm4"></i></div><b id="mv4">—</b></div>
<p style="margin:12px 0 6px"><span class="badge" id="vd4">—</span></p>
<p class="case" id="x4a" style="margin-bottom:6px"></p>
<p class="case" id="x4b" style="margin-bottom:6px"></p>
<p class="case" id="x4c" style="margin-bottom:0"></p>
</div>
<div class="card" style="margin-top:14px">
<button class="reveal" id="rv4" type="button">Mostrar propuesta de tratamiento</button>
<div id="prop4" style="display:none;margin-top:10px">
<div class="out">
<div>Modo y frecuencia</div><div>Pulsátil 20 %, 1 MHz</div>
<div>Intensidad</div><div>0,5 W/cm²</div>
<div>SATA</div><div>0,1 W/cm²</div>
<div>Cabezal / tiempo</div><div>5 cm² en movimiento, 5 min</div>
<div>Energía (0,1 × 5 × 300 s)</div><div>150 J</div>
</div>
<p class="note">Una vez al día los primeros días, sin calor ni molestia. El continuo se reserva para la fase subaguda o crónica.</p>
</div>
</div>
</div>
</section>

</main>`,
  init: function (root) {
var raf=0,dead=false;
var $=function(id){return root.getElementById(id)};
function seg(id,cb){var el=$(id);el.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;[].forEach.call(el.children,function(x){x.classList.remove('on')});b.classList.add('on');cb(b.getAttribute('data-v'))})}
root.getElementById('nav').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;[].forEach.call(this.children,function(x){x.classList.remove('on')});b.classList.add('on');[].forEach.call(root.querySelectorAll('.tab'),function(t){t.classList.remove('on')});$(b.getAttribute('data-t')).classList.add('on');draw1();draw3();if(typeof draw4==='function')draw4()});

/* ---------- utilidades de dibujo ---------- */
var S=2,FONT='Cambria,Georgia,serif',TAU=Math.PI*2;
function ctx(c,W,H){if(c._W!==W||c._H!==H){c.width=W*S;c.height=H*S;c._W=W;c._H=H}var g=c.getContext('2d');g.setTransform(S,0,0,S,0,0);g.textBaseline='alphabetic';g.globalAlpha=1;g.setLineDash([]);return g}
function F(s,b){return (b?'bold ':'')+s+'px '+FONT}
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
// etiqueta con fondo: (x,y) = línea base del texto
function tag(g,t,x,y,o){o=o||{};var s=o.size||16;g.font=F(s,o.bold);var w=g.measureText(t).width,p=6,al=o.align||'left',bx=al==='center'?x-w/2:(al==='right'?x-w:x);
 if(o.bg!=='none'){g.fillStyle=o.bg||'rgba(255,255,255,0.92)';rr(g,bx-p,y-s*0.82-4,w+2*p,s*1.08+8,6);g.fill();if(o.border){g.strokeStyle=o.border;g.lineWidth=2;g.stroke()}}
 g.fillStyle=o.color||'#2B1B10';g.textAlign=al;g.fillText(t,x,y);return w}
// bloque de varias líneas con fondo (primera línea en negrita)
function tagLines(g,lines,x,y,o){o=o||{};var s=o.size||16,lh=s+3,w=0;lines.forEach(function(t,i){g.font=F(s,i===0);w=Math.max(w,g.measureText(t).width)});
 g.fillStyle=o.bg||'rgba(255,255,255,0.93)';rr(g,x-6,y-s-2,w+12,lh*lines.length+8,6);g.fill();if(o.border){g.strokeStyle=o.border;g.lineWidth=2;g.stroke()}
 lines.forEach(function(t,i){g.font=F(s,i===0);g.fillStyle=i===0?(o.color||'#2B1B10'):'#2B1B10';g.textAlign='left';g.fillText(t,x,y+i*lh)})}
function arrowHead(g,x,y,ang,s,col){g.fillStyle=col;g.beginPath();g.moveTo(x,y);g.lineTo(x-s*Math.cos(ang-0.45),y-s*Math.sin(ang-0.45));g.lineTo(x-s*Math.cos(ang+0.45),y-s*Math.sin(ang+0.45));g.closePath();g.fill()}
function arrow(g,x1,y1,x2,y2,col,lw){g.strokeStyle=col;g.lineWidth=lw;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();arrowHead(g,x2,y2,Math.atan2(y2-y1,x2-x1),lw*3+6,col)}
// cabezal con cristal piezoeléctrico (alto total 72 px desde y)
function head(g,cx,y,w,f){
 var hw=w*0.42;g.fillStyle='#4A2208';rr(g,cx-hw/2,y,hw,20,5);g.fill();
 var bg=g.createLinearGradient(0,y+16,0,y+58);bg.addColorStop(0,'#A25A28');bg.addColorStop(1,'#6B3410');g.fillStyle=bg;rr(g,cx-w/2,y+16,w,42,9);g.fill();
 g.fillStyle='#fff';g.font=F(16,1);g.textAlign='center';g.fillText('Cabezal '+f+' MHz',cx,y+43);
 g.fillStyle='#3A2418';g.fillRect(cx-w/2+3,y+56,w-6,11);
 g.fillStyle='#F2C14E';g.fillRect(cx-w/2+11,y+58,w-22,7);
 g.strokeStyle='#A8760B';g.lineWidth=1;g.beginPath();for(var x=cx-w/2+13;x<cx+w/2-11;x+=6){g.moveTo(x,y+65);g.lineTo(x+5,y+58)}g.stroke();
 var mg=g.createLinearGradient(0,y+66,0,y+72);mg.addColorStop(0,'#D9DDE1');mg.addColorStop(1,'#8E959C');g.fillStyle=mg;g.fillRect(cx-w/2-3,y+66,w+6,6)}

/* ---------- TAB 1 ---------- */
var ALPHA={muscle:1.0,fat:0.5,tendon:3.5}; // dB/cm/MHz didactico
var TN={muscle:'músculo',fat:'grasa',tendon:'tendón'};
var f1=1,tis='muscle',depth=2;
function rem(d,f,a){return USCore.remaining(d,f,a)}
function hvl(f,a){return USCore.halfValueLayerCm(f,a)}
var LAY=[{n:'Piel',t:'skin',a:0,b:0.25,c:'#E6B39B'},{n:'Grasa subcutánea',k:'fat',t:'fat',a:0.25,b:1.3,c:'#F6E4AC'},{n:'Músculo',k:'muscle',t:'muscle',a:1.3,b:6.4,c:'#C9715B'},{n:'Tendón',k:'tendon',t:'tendon',a:6.4,b:8,c:'#EFE6D6'}];
function texture(g,t,x0,y1,x1,y2){var x,y,i,first;
 if(t==='fat'){g.strokeStyle='rgba(185,145,55,0.6)';g.lineWidth=1.2;for(y=y1+7,i=0;y<y2+8;y+=14,i++)for(x=x0+(i%2?9:0);x<x1+10;x+=18){g.beginPath();g.ellipse(x,y,8.5,6.5,0,0,TAU);g.stroke()}}
 if(t==='muscle'){for(y=y1+3,i=0;y<y2;y+=6,i++){g.strokeStyle=i%5===0?'rgba(105,32,22,0.5)':'rgba(120,45,30,0.25)';g.lineWidth=i%5===0?1.6:1;g.beginPath();first=true;for(x=x0;x<=x1+10;x+=10){var yy=y+1.6*Math.sin(x/23+i);if(first){g.moveTo(x,yy);first=false}else g.lineTo(x,yy)}g.stroke()}}
 if(t==='tendon'){g.strokeStyle='rgba(140,112,78,0.5)';g.lineWidth=1;for(y=y1+2;y<y2;y+=3.5){g.beginPath();first=true;for(x=x0;x<=x1+12;x+=12){var y3=y+0.9*Math.sin(x/9);if(first){g.moveTo(x,y3);first=false}else g.lineTo(x,y3)}g.stroke()}}
 if(t==='skin'){g.fillStyle='rgba(150,80,60,0.35)';for(x=x0+4;x<x1;x+=11){g.fillRect(x,y1+3+(x%3),2,2)}}}
function draw1(){
 var c=$('c1'),W=760,H=580,g=ctx(c,W,H),a=ALPHA[tis];
 var x0=16,x1=356,top=96,bot=476,pxcm=(bot-top)/8,cx=238,y,d,r,hw;
 g.fillStyle='#FBF6F0';g.fillRect(0,0,W,H);
 // capas anatómicas
 LAY.forEach(function(L){var y1=top+L.a*pxcm,y2=top+L.b*pxcm;g.save();g.beginPath();g.rect(x0,y1,x1-x0,y2-y1);g.clip();g.fillStyle=L.c;g.fillRect(x0,y1,x1-x0,y2-y1);texture(g,L.t,x0,y1,x1,y2);g.restore();
  g.strokeStyle='rgba(43,27,16,0.4)';g.lineWidth=1;g.beginPath();g.moveTo(x0,y2);g.lineTo(x1,y2);g.stroke()});
 // hueso (fondo, fuera de la escala de cálculo)
 var bh=58;g.fillStyle='#ECE2CC';g.fillRect(x0,bot,x1-x0,bh);g.fillStyle='#D8C6A2';
 for(var bi=0;bi<26;bi++){var bxx=x0+10+(bi*53)%(x1-x0-20),byy=bot+16+(bi*17)%(bh-20);g.beginPath();g.ellipse(bxx,byy,7+(bi%3)*2,4+(bi%2)*2,(bi%4)*0.6,0,TAU);g.fill()}
 g.fillStyle='#FAF6EC';g.fillRect(x0,bot,x1-x0,9);g.strokeStyle='#8B5A2B';g.lineWidth=2.5;g.beginPath();g.moveTo(x0,bot);g.lineTo(x1,bot);g.stroke();
 // gel
 g.fillStyle='#CFE9F3';g.fillRect(x0,top-18,x1-x0,18);g.strokeStyle='#8CC3DA';g.lineWidth=1;g.strokeRect(x0+0.5,top-18,x1-x0-1,18);
 g.fillStyle='#1F5F8B';g.font=F(16,1);g.textAlign='left';g.fillText('Gel',x0+6,top-4);
 // haz: diverge y se atenúa según la frecuencia elegida
 var kd=f1==1?4.5:2.2,hw0=58;function hwd(dd){return hw0+dd*kd}
 for(y=top;y<bot;y+=2){d=(y-top)/pxcm;r=rem(d,f1,a)/100;hw=hwd(d);
  g.fillStyle='rgba(255,204,58,'+(0.05+0.85*r).toFixed(3)+')';g.fillRect(cx-hw,y,2*hw,2.2);
  g.fillStyle='rgba(255,250,215,'+(0.5*r).toFixed(3)+')';g.fillRect(cx-hw*0.45,y,hw*0.9,2.2)}
 var lam=f1==1?16:7;
 for(y=top+lam;y<bot;y+=lam){d=(y-top)/pxcm;r=rem(d,f1,a)/100;if(r<0.02)break;hw=hwd(d);g.strokeStyle='rgba(122,61,18,'+(0.75*r).toFixed(3)+')';g.lineWidth=1.6;g.beginPath();g.moveTo(cx-hw,y);g.quadraticCurveTo(cx,y+5,cx+hw,y);g.stroke()}
 g.setLineDash([7,5]);g.strokeStyle='rgba(122,61,18,0.85)';g.lineWidth=2;g.beginPath();g.moveTo(cx-hw0,top);g.lineTo(cx-hwd(8),bot);g.moveTo(cx+hw0,top);g.lineTo(cx+hwd(8),bot);g.stroke();g.setLineDash([]);
 // hueso: lo que llega se absorbe y refleja en la superficie
 var r8=rem(8,f1,a)/100;g.fillStyle='rgba(230,80,20,'+(0.2+0.8*r8).toFixed(3)+')';g.fillRect(cx-hwd(8),bot-3,2*hwd(8),6);
 [-1,0,1].forEach(function(k){arrow(g,cx+k*42,bot-6,cx+k*52,bot-34,'rgba(179,38,30,'+(0.4+0.6*r8).toFixed(3)+')',2.5)});
 // marcas 50 % y 10 % sobre el haz
 var dh=hvl(f1,a),d10=10/(a*f1);
 [[dh,'50 % (CHR)'],[d10,'10 %']].forEach(function(m){if(m[0]>8)return;var ym=top+m[0]*pxcm;g.strokeStyle='#2B1B10';g.lineWidth=1.5;g.setLineDash([4,3]);g.beginPath();g.moveTo(cx-hwd(m[0]),ym);g.lineTo(cx+hwd(m[0]),ym);g.stroke();g.setLineDash([]);tag(g,m[1],cx,ym-6,{align:'center',size:16,bold:1,bg:'rgba(255,255,255,0.85)'})});
 // cabezal
 head(g,cx,6,150,f1);
 g.strokeStyle='#2B1B10';g.lineWidth=1.5;g.beginPath();g.moveTo(cx+hw0+8,top-34);g.lineTo(cx+hw0+30,top-48);g.stroke();
 g.fillStyle='#2B1B10';g.font=F(16);g.textAlign='left';g.fillText('cristal',cx+hw0+34,top-58);g.fillText('piezoeléctrico',cx+hw0+34,top-40);
 // rótulos de capas
 LAY.forEach(function(L){var sel=L.k===tis,ym=L.t==='skin'?top+13:top+(L.a+L.b)/2*pxcm+6;tag(g,L.n,x0+8,ym,{bold:1,size:16,bg:sel?'#7A3D12':'rgba(255,255,255,0.9)',color:sel?'#fff':'#2B1B10'})});
 tag(g,'Hueso: refleja y absorbe casi todo',x0+8,bot+27,{bold:1,size:16});
 tag(g,'en superficie → dolor perióstico',x0+8,bot+50,{size:16,color:'#B3261E',bold:1});
 // escala de profundidad
 g.fillStyle='#2B1B10';g.font=F(16);g.textAlign='left';g.strokeStyle='#5a4636';g.lineWidth=1.5;
 for(var k=0;k<=8;k++){y=top+k*pxcm;g.beginPath();g.moveTo(x1,y);g.lineTo(x1+7,y);g.stroke();g.fillText(k+' cm',x1+10,y+5)}
 // marcador de profundidad
 var ym=top+depth*pxcm;g.strokeStyle='#1F5F8B';g.lineWidth=3;g.beginPath();g.moveTo(x0,ym);g.lineTo(x1+8,ym);g.stroke();
 g.fillStyle='#1F5F8B';g.beginPath();g.arc(cx,ym,5,0,TAU);g.fill();
 tag(g,depth.toFixed(1)+' cm · '+rem(depth,f1,a).toFixed(0)+' %',x1-8,depth<0.6?ym+24:ym-9,{align:'right',bold:1,size:18,color:'#fff',bg:'#1F5F8B'});
 // gráfica % vs profundidad
 var gx=468,gw=272,gy=76,gh=354;
 g.fillStyle='#2B1B10';g.font=F(18,1);g.textAlign='center';g.fillText('% de intensidad vs profundidad',gx+gw/2,28);
 g.font=F(16);g.fillText('en '+TN[tis]+' (α = '+a.toFixed(1)+' dB/cm/MHz)',gx+gw/2,52);
 g.fillStyle='#fff';g.fillRect(gx,gy,gw,gh);
 g.font=F(16);g.textAlign='right';
 [0,25,50,75,100].forEach(function(p){var yy=gy+gh-(p/100)*gh;g.strokeStyle=p===50?'#B9A28C':'#EEE5DC';g.lineWidth=p===50?1.5:1;g.setLineDash(p===50?[6,4]:[]);g.beginPath();g.moveTo(gx,yy);g.lineTo(gx+gw,yy);g.stroke();g.setLineDash([]);g.fillStyle='#2B1B10';g.fillText(p+'%',gx-6,yy+5)});
 g.textAlign='center';for(var dx=0;dx<=8;dx++){var xx=gx+dx/8*gw;g.strokeStyle='#EEE5DC';g.lineWidth=1;g.beginPath();g.moveTo(xx,gy);g.lineTo(xx,gy+gh);g.stroke();if(dx%2===0){g.fillStyle='#2B1B10';g.fillText(dx,xx,gy+gh+20)}}
 g.fillText('Profundidad (cm)',gx+gw/2,gy+gh+42);
 g.strokeStyle='#2B1B10';g.lineWidth=2;g.strokeRect(gx,gy,gw,gh);
 var COL={1:'#2E7D4F',3:'#B3261E'},FILL={1:'rgba(46,125,79,0.10)',3:'rgba(179,38,30,0.10)'};
 function px(dd){return gx+dd/8*gw}function py(p){return gy+gh-(p/100)*gh}
 (f1==1?[3,1]:[1,3]).forEach(function(f){var sel=f==f1;
  if(sel){g.fillStyle=FILL[f];g.beginPath();g.moveTo(px(0),py(0));for(var i=0;i<=80;i++)g.lineTo(px(i/10),py(rem(i/10,f,a)));g.lineTo(px(8),py(0));g.closePath();g.fill()}
  g.strokeStyle=COL[f];g.lineWidth=sel?5:3;g.globalAlpha=sel?1:0.6;g.beginPath();for(var j=0;j<=80;j++){var X=px(j/10),Y=py(rem(j/10,f,a));if(j===0)g.moveTo(X,Y);else g.lineTo(X,Y)}g.stroke();g.globalAlpha=1});
 // marcador de profundidad en la gráfica
 var xd=px(depth);g.strokeStyle='#1F5F8B';g.lineWidth=2;g.setLineDash([5,4]);g.beginPath();g.moveTo(xd,gy);g.lineTo(xd,gy+gh);g.stroke();g.setLineDash([]);
 [1,3].forEach(function(f){g.fillStyle='#1F5F8B';g.strokeStyle=COL[f];g.lineWidth=3;g.beginPath();g.arc(xd,py(rem(depth,f,a)),5,0,TAU);g.fill();g.stroke()});
 // capas de hemirreducción sobre la curva
 [1,3].forEach(function(f){var h=hvl(f,a);if(h>8)return;var X=px(h),Y=py(50);
  g.strokeStyle=COL[f];g.lineWidth=1.5;g.setLineDash([4,3]);g.beginPath();g.moveTo(X,Y);g.lineTo(X,gy+gh);g.stroke();g.setLineDash([]);
  g.fillStyle=COL[f];g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.arc(X,Y,7,0,TAU);g.fill();g.stroke();
  var t='CHR '+h.toFixed(1)+' cm',ty=f==1?Y-14:Y+28;g.font=F(16,1);var tw=g.measureText(t).width,right=X+12+tw>gx+gw-4;
  tag(g,t,right?X-12:X+12,ty,{bold:1,color:COL[f],align:right?'right':'left'})});
 // leyenda
 var ly=508,lx=gx;[[1,'1 MHz'],[3,'3 MHz']].forEach(function(p){g.strokeStyle=COL[p[0]];g.lineWidth=p[0]==f1?5:3;g.beginPath();g.moveTo(lx,ly-6);g.lineTo(lx+26,ly-6);g.stroke();g.fillStyle=COL[p[0]];g.font=F(16,p[0]==f1);g.textAlign='left';g.fillText(p[1],lx+32,ly);lx+=96});
 g.fillStyle='#2B1B10';g.beginPath();g.arc(lx+6,ly-6,6,0,TAU);g.fill();g.font=F(16);g.fillText('CHR = 50 %',lx+18,ly);
 g.fillStyle='#5a4636';g.font=F(16);g.textAlign='left';g.fillText('Haz y lecturas: medio homogéneo del tejido resaltado. CHR = capa de hemirreducción.',x0,566);
 $('hvl1').textContent=hvl(1,a).toFixed(1)+' cm';$('hvl3').textContent=hvl(3,a).toFixed(1)+' cm';
 $('rem1').textContent=rem(depth,1,a).toFixed(0)+' %';$('rem3').textContent=rem(depth,3,a).toFixed(0)+' %';
 $('depthv').textContent=depth.toFixed(1)+' cm';
}
seg('f1',function(v){f1=+v;draw1()});seg('tis',function(v){tis=v;draw1()});
$('depth').addEventListener('input',function(){depth=+this.value;draw1()});

/* ---------- TAB 2 ---------- */
var f2=1,dc2=0.2,i2=0.8,still=false,bubbles=[];
function idx(){return USCore.cavitationIndex(i2,dc2,f2)}
function upd2(){var x=idx();$('i2v').textContent=i2.toFixed(1)+' W/cm²';$('idx').textContent=(Math.round(x*100+1e-6)/100).toFixed(2);
 var b=$('cat'),t=$('catx');
 if(x<0.1){b.textContent='Mínima';b.style.background='#1F5F8B';t.textContent='Predomina el micromasaje: compresión y expansión del tejido.'}
 else if(x<=1.0){b.textContent='Cavitación estable';b.style.background='#2E7D4F';t.textContent='Burbujas que oscilan sin colapsar y generan microcorrientes acústicas: efecto buscado.'}
 else{b.textContent='Riesgo de cavitación inestable';b.style.background='#B3261E';t.textContent='Burbujas que crecen y colapsan. Baja la intensidad, pasa a pulsado o usa 3 MHz.'}}
function newBubble(){return {x:160+Math.random()*460,y:175+Math.random()*310,r:9+Math.random()*5,p:Math.random()*TAU}}
function spawn(){var x=idx(),n=x<0.1?3:Math.min(36,Math.round(8+x*14));while(bubbles.length<n)bubbles.push(newBubble());while(bubbles.length>n)bubbles.pop()}
function burst(g,x,y,R,al){g.save();g.globalAlpha=al;var gr=g.createRadialGradient(x,y,0,x,y,R);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(0.35,'rgba(255,214,79,0.95)');gr.addColorStop(1,'rgba(255,140,0,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,R,0,TAU);g.fill();
 g.strokeStyle='#D9480F';g.lineWidth=2.5;g.beginPath();for(var i=0;i<12;i++){var an=i*TAU/12;g.moveTo(x+Math.cos(an)*R*0.45,y+Math.sin(an)*R*0.45);g.lineTo(x+Math.cos(an)*R*1.1,y+Math.sin(an)*R*1.1)}g.stroke();
 g.fillStyle='#1F5F8B';for(var j=0;j<6;j++){var a2=j*TAU/6+0.3;g.beginPath();g.arc(x+Math.cos(a2)*R*0.8,y+Math.sin(a2)*R*0.8,2.5,0,TAU);g.fill()}g.restore()}
function drawBubble(g,b,ts,inb,unstable,minimal){
 var r=b.r*(minimal?0.75:1);
 if(unstable&&inb){var ph=((ts/1000)*0.7+b.p/TAU)%1;if(b.lp!==undefined&&ph<b.lp&&b.hw){b.y=175+Math.random()*310;b.x=b.hx+(Math.random()*2-1)*b.hw(b.y)*0.85}b.lp=ph;
  if(ph>0.72){var q=(ph-0.72)/0.28;burst(g,b.x,b.y,16+q*30,1-q*0.5);return}
  r=b.r*(1+1.6*ph)*(1+0.08*Math.sin(ts/40+b.p))}
 else if(inb)r=r*(1+(minimal?0.12:0.3)*Math.sin(ts/110+b.p));
 g.globalAlpha=inb?1:0.35;
 var gr=g.createRadialGradient(b.x-r*0.35,b.y-r*0.35,r*0.1,b.x,b.y,r);gr.addColorStop(0,'#FFFFFF');gr.addColorStop(0.45,'#A9D8F0');gr.addColorStop(1,'#3E86B8');
 g.fillStyle=gr;g.beginPath();g.arc(b.x,b.y,r,0,TAU);g.fill();g.strokeStyle='#1F5F8B';g.lineWidth=2.5;g.stroke();
 if(inb&&!unstable&&!minimal){var R=r+9,st=ts/450+b.p;g.strokeStyle='#2E7D4F';g.lineWidth=2.5;
  for(var j=0;j<2;j++){var a0=st+j*Math.PI,a1=a0+1.9;g.beginPath();g.arc(b.x,b.y,R,a0,a1);g.stroke();arrowHead(g,b.x+R*Math.cos(a1),b.y+R*Math.sin(a1),a1+Math.PI/2,9,'#2E7D4F')}}
 g.globalAlpha=1}
function render2(ts){
 var c=$('c2'),W=760,H=580,g=ctx(c,W,H),x=idx(),unstable=x>1.0,minimal=x<0.1,y,i;
 var skin=112,bot=516,hx=still?380:380+150*Math.sin(ts/1100);
 g.fillStyle='#FBF6F0';g.fillRect(0,0,W,H);
 // tejido
 var tg=g.createLinearGradient(0,skin,0,bot);tg.addColorStop(0,'#EBC6B2');tg.addColorStop(1,'#D69A84');g.fillStyle=tg;g.fillRect(0,skin,W,bot-skin);
 g.strokeStyle='rgba(120,45,30,0.13)';g.lineWidth=1;for(y=skin+10;y<bot;y+=9){g.beginPath();g.moveTo(0,y);for(var xx=20;xx<=W;xx+=20)g.lineTo(xx,y+1.5*Math.sin(xx/30+y));g.stroke()}
 g.fillStyle='#E0A58C';g.fillRect(0,skin,W,5);
 g.fillStyle='#CFE9F3';g.fillRect(0,skin-16,W,16);
 // geometría del haz: zona cercana (Fresnel) y lejana (Fraunhofer)
 var yN=f2==1?300:400,hw0=62;
 function hwAt(yy){return yy<yN?hw0-5*Math.sin(Math.PI*(yy-skin)/(yN-skin)):hw0+(yy-yN)*0.45}
 function beamPath(){g.beginPath();g.moveTo(hx-hw0,skin);for(var yy=skin;yy<bot;yy+=8)g.lineTo(hx-hwAt(yy),yy);g.lineTo(hx-hwAt(bot),bot);g.lineTo(hx+hwAt(bot),bot);for(yy=bot-((bot-skin)%8||8);yy>=skin;yy-=8)g.lineTo(hx+hwAt(yy),yy);g.closePath()}
 g.save();beamPath();g.clip();
 g.fillStyle='rgba(31,95,139,0.12)';g.fillRect(0,skin,W,bot-skin);
 // campo de compresiones (oscuro) y expansiones (claro)
 var lam=f2==1?34:16,k=TAU/lam,att=f2==1?0.0016:0.0045,Lp=170,w=ts*0.006;
 for(y=skin;y<bot;y+=2){var dz=y-skin,env=Math.exp(-att*dz),on=true;if(dc2<1){var pos=((dz-ts*0.09)%Lp+Lp)%Lp;on=pos<Lp*dc2}
  if(!on)continue;var v=still?Math.sin(k*dz)*Math.cos(w):Math.sin(k*dz-w);
  g.fillStyle=v>0?'rgba(110,50,15,'+(0.5*v*env).toFixed(3)+')':'rgba(255,255,255,'+(-0.65*v*env).toFixed(3)+')';g.fillRect(hx-170,y,340,2)}
 // zona cercana irregular
 [[-30,150,18],[25,190,13],[-8,240,15],[36,268,11],[-42,214,10],[12,140,11],[30,128,9]].forEach(function(bl){var by=skin+(bl[1]-skin)/(300-skin)*(yN-skin),R=bl[2]*(1+0.15*Math.sin(ts/300+bl[0]));var gr=g.createRadialGradient(hx+bl[0],by,0,hx+bl[0],by,R);gr.addColorStop(0,'rgba(255,200,70,0.55)');gr.addColorStop(1,'rgba(255,200,70,0)');g.fillStyle=gr;g.beginPath();g.arc(hx+bl[0],by,R,0,TAU);g.fill()});
 // cabezal quieto: ondas estacionarias -> puntos calientes
 if(still){var n=0;for(y=skin+lam/4;y<bot;y+=lam*2,n++){var envh=Math.exp(-att*(y-skin)),al=Math.min(1,(0.7+Math.min(0.3,x*0.25))*(0.4+0.6*envh)*(0.8+0.2*Math.sin(ts/200+n)));
   (y<yN?[-34,0,34]:[-22,22]).forEach(function(o){var R=y<yN?17:20,gr=g.createRadialGradient(hx+o,y,0,hx+o,y,R);gr.addColorStop(0,'rgba(215,25,15,'+al.toFixed(3)+')');gr.addColorStop(0.45,'rgba(240,80,20,'+(al*0.6).toFixed(3)+')');gr.addColorStop(1,'rgba(240,80,20,0)');g.fillStyle=gr;g.beginPath();g.ellipse(hx+o,y,R,R*0.7,0,0,TAU);g.fill()})}}
 g.restore();
 g.setLineDash([7,5]);g.strokeStyle='rgba(31,95,139,0.9)';g.lineWidth=2;beamPath();g.stroke();
 g.strokeStyle='rgba(43,27,16,0.7)';g.beginPath();g.moveTo(hx-hwAt(yN)-14,yN);g.lineTo(hx+hwAt(yN)+14,yN);g.stroke();g.setLineDash([]);
 // burbujas
 spawn();bubbles.forEach(function(b){b.hx=hx;b.hw=hwAt;var inb=Math.abs(b.x-hx)<hwAt(b.y)-4;drawBubble(g,b,ts,inb,unstable,minimal)});
 // rótulos de zonas
 g.strokeStyle='#2B1B10';g.lineWidth=2;g.beginPath();g.moveTo(140,skin+6);g.lineTo(146,skin+6);g.lineTo(146,yN-4);g.lineTo(140,yN-4);g.moveTo(140,yN+4);g.lineTo(146,yN+4);g.lineTo(146,bot-6);g.lineTo(140,bot-6);g.stroke();
 tagLines(g,['Zona cercana','(Fresnel):','irregular,','puntos','calientes'],12,skin+(yN-skin)/2-30,{color:'#C77700'});
 tagLines(g,['Zona lejana','(Fraunhofer):','diverge y es','más uniforme'],12,yN+(bot-yN)/2-20,{color:'#1F5F8B'});
 // leyenda
 g.fillStyle='rgba(255,255,255,0.95)';rr(g,8,6,140,82,8);g.fill();g.strokeStyle='#D9C7B6';g.lineWidth=1.5;g.stroke();
 g.fillStyle='#6E320F';g.fillRect(16,16,18,14);g.fillStyle='#fff';g.fillRect(16,40,18,14);g.strokeStyle='#999';g.lineWidth=1;g.strokeRect(16,40,18,14);
 g.fillStyle='#A9D8F0';g.beginPath();g.arc(25,71,8,0,TAU);g.fill();g.strokeStyle='#1F5F8B';g.lineWidth=2;g.stroke();
 g.fillStyle='#2B1B10';g.font=F(16);g.textAlign='left';g.fillText('compresión',42,28);g.fillText('expansión',42,52);g.fillText('burbuja',42,77);
 // cabezal
 head(g,hx,24,140,f2);
 if(!still){arrow(g,hx+20,14,hx+64,14,'#7A3D12',3);arrow(g,hx-20,14,hx-64,14,'#7A3D12',3)}
 // franja inferior de estado
 g.fillStyle='#fff';g.fillRect(0,bot,W,H-bot);g.strokeStyle='#D9C7B6';g.lineWidth=2;g.beginPath();g.moveTo(0,bot);g.lineTo(W,bot);g.stroke();
 g.font=F(18,1);g.textAlign='left';
 g.fillStyle=unstable?'#B3261E':(minimal?'#1F5F8B':'#2E7D4F');
 g.fillText(unstable?'Cavitación inestable (ilustrativa): burbujas que crecen y colapsan':(minimal?'Índice mínimo: casi sin burbujas, predomina el micromasaje':'Cavitación estable: burbujas que oscilan y generan microcorrientes'),14,bot+26);
 g.fillStyle=still?'#B3261E':'#2E7D4F';
 g.fillText(still?'Cabezal quieto: ondas estacionarias → puntos calientes':'Cabezal en movimiento: reparte la energía, evita puntos calientes',14,bot+53);
}
$('i2').addEventListener('input',function(){i2=+this.value;upd2()});
seg('f2',function(v){f2=+v;upd2()});seg('m2',function(v){dc2=+v;upd2()});seg('h2',function(v){still=(v=='still')});
upd2();

/* ---------- TAB 3 ---------- */
var i3=1,dc3=0.2,a3=5,tm=8,mAmp=0;
function phase(i){return USCore.phaseLabel(i)}
function fm(v){return String(Math.round(v*10)/10)}
function upd3(){var s=i3*dc3;
 $('i3v').textContent=i3.toFixed(1)+' W/cm²';$('t3v').textContent=tm+' min';
 $('sata').textContent=s.toFixed(2)+' W/cm²';$('pp').textContent=(i3*a3).toFixed(1)+' W';$('pm').textContent=(s*a3).toFixed(2)+' W';$('en').textContent=Math.round(s*a3*tm*60)+' J';$('ph').textContent=phase(i3);
 var e=dc3==1?'térmico y mecánico':(s<0.5?'mecánico (no térmico)':'mecánico; puede calentar (SATA alto)');$('eff').textContent=e}
function render3(ts){
 var c=$('c3'),W=760,H=560,g=ctx(c,W,H),s=i3*dc3,p,y,v;
 g.fillStyle='#fff';g.fillRect(0,0,W,H);
 var L=84,R=740,T=60,B=262,sc=(B-T)/3,pw=(R-L)/3;
 // rejilla y eje Y
 g.font=F(16);g.textAlign='right';
 for(v=0;v<=3;v++){y=B-v*sc;g.strokeStyle='#EEE5DC';g.lineWidth=1;g.beginPath();g.moveTo(L,y);g.lineTo(R,y);g.stroke();g.fillStyle='#2B1B10';g.fillText(v,L-10,y+5)}
 g.save();g.translate(26,(T+B)/2);g.rotate(-Math.PI/2);g.textAlign='center';g.font=F(16,1);g.fillStyle='#2B1B10';g.fillText('Intensidad (W/cm²)',0,0);g.restore();
 // emisión y pausa
 for(p=0;p<3;p++){var xs=L+p*pw,we=pw*dc3;
  if(dc3<1){g.save();g.beginPath();g.rect(xs+we,T,pw-we,B-T);g.clip();g.fillStyle='#F6F1EC';g.fillRect(xs+we,T,pw-we,B-T);g.strokeStyle='#E3D6C9';g.lineWidth=1;g.beginPath();for(var hx=xs+we-(B-T);hx<xs+pw;hx+=12){g.moveTo(hx,B);g.lineTo(hx+(B-T),T)}g.stroke();g.restore()}
  var bg=g.createLinearGradient(0,B-i3*sc,0,B);bg.addColorStop(0,'#C27A42');bg.addColorStop(1,'#A8602D');g.fillStyle=bg;g.fillRect(xs,B-i3*sc,we,i3*sc);g.strokeStyle='#7A3D12';g.lineWidth=1.5;g.strokeRect(xs,B-i3*sc,we,i3*sc);
  if(p>0){g.strokeStyle='#B9A28C';g.lineWidth=1.5;g.setLineDash([4,4]);g.beginPath();g.moveTo(xs,T-6);g.lineTo(xs,B);g.stroke();g.setLineDash([])}}
 g.strokeStyle='#2B1B10';g.lineWidth=2;g.beginPath();g.moveTo(L,T-10);g.lineTo(L,B);g.lineTo(R+4,B);g.stroke();
 g.fillStyle='#2B1B10';g.font=F(16);g.textAlign='center';
 for(p=0;p<=3;p++){var xt=L+p*pw;g.beginPath();g.moveTo(xt,B);g.lineTo(xt,B+6);g.stroke();g.fillText(p*10,xt,B+23)}
 g.font=F(16,1);g.textAlign='right';g.fillText('tiempo (ms)',R,B+44);
 // periodo
 var bx1=L+2*pw+4,bx2=R-4;g.strokeStyle='#5a4636';g.lineWidth=1.5;g.beginPath();g.moveTo(bx1,46);g.lineTo(bx1,40);g.lineTo(bx2,40);g.lineTo(bx2,46);g.stroke();
 g.fillStyle='#5a4636';g.font=F(16);g.textAlign='center';g.fillText('1 periodo = 10 ms (100 Hz)',(bx1+bx2)/2,32);
 // línea SATA
 var ys=B-s*sc;g.strokeStyle='#1F5F8B';g.lineWidth=3;g.setLineDash([9,6]);g.beginPath();g.moveTo(L,ys);g.lineTo(R,ys);g.stroke();g.setLineDash([]);
 // rótulos de emisión y pausa (primer periodo)
 var ye=B-i3*sc-10;
 if(dc3<1){tag(g,'emisión '+fm(10*dc3)+' ms',L+2,ye,{bold:1,color:'#7A3D12'});tag(g,'pausa '+fm(10*(1-dc3))+' ms',L+pw*dc3+pw*(1-dc3)/2,T+(B-T)*0.42,{align:'center',bold:1,color:'#5a4636'})}
 else tag(g,'emisión continua (sin pausa)',L+8,ye,{bold:1,color:'#7A3D12'});
 tag(g,'pico '+i3.toFixed(1)+' W/cm²',L+pw+(dc3<1?2:60),ye,{color:'#7A3D12'});
 tag(g,'SATA = '+s.toFixed(2)+' W/cm²',R-6,ys<T+30?ys+24:ys-8,{align:'right',bold:1,color:'#1F5F8B'});
 // ---- efecto en el tejido ----
 var y0=316;g.strokeStyle='#D9C7B6';g.lineWidth=2;g.beginPath();g.moveTo(10,y0);g.lineTo(W-10,y0);g.stroke();
 g.font=F(18,1);g.fillStyle='#7A3D12';g.textAlign='left';g.fillText('Efecto en el tejido',20,y0+26);
 g.fillStyle='#6E320F';g.fillRect(470,y0+12,16,16);g.fillStyle='#fff';g.fillRect(600,y0+12,16,16);g.strokeStyle='#999';g.lineWidth=1;g.strokeRect(600,y0+12,16,16);
 g.fillStyle='#2B1B10';g.font=F(16);g.fillText('compresión',492,y0+26);g.fillText('expansión',622,y0+26);
 var cont=dc3==1,h=cont?Math.max(0.2,Math.min(1,s/2.5)):(s<0.5?0:Math.min(1,s/2.5));
 var py=y0+40,ph=198,P1=20,P2=390,PW=350;
 // panel térmico
 g.fillStyle=h>0?'#FFF8F2':'#F7F4F1';rr(g,P1,py,PW,ph,10);g.fill();
 g.strokeStyle=cont?'#B3261E':(h>0?'#C77700':'#D9C7B6');g.lineWidth=h>0?3:2;g.setLineDash(!cont&&h>0?[8,5]:[]);g.stroke();g.setLineDash([]);
 g.font=F(17,1);g.fillStyle=h>0?'#B3261E':'#8a7a6c';g.textAlign='left';g.fillText('Térmico: fricción → calor',P1+12,py+24);
 var tx=P1+12,ty=py+36,tw=270,th=116;
 g.save();rr(g,tx,ty,tw,th,6);g.clip();g.fillStyle='#EBC6B2';g.fillRect(tx,ty,tw,th);
 g.strokeStyle='rgba(120,45,30,0.18)';g.lineWidth=1;for(y=ty+6;y<ty+th;y+=8){g.beginPath();g.moveTo(tx,y);for(var xx=tx+15;xx<=tx+tw;xx+=15)g.lineTo(xx,y+1.2*Math.sin(xx/20+y));g.stroke()}
 if(h>0){var hg=g.createRadialGradient(tx+tw/2,ty+th*0.35,5,tx+tw/2,ty+th*0.35,tw*0.7);hg.addColorStop(0,'rgba(225,45,15,'+(0.85*h).toFixed(3)+')');hg.addColorStop(0.5,'rgba(255,150,30,'+(0.55*h).toFixed(3)+')');hg.addColorStop(1,'rgba(255,200,60,'+(0.15*h).toFixed(3)+')');g.fillStyle=hg;g.fillRect(tx,ty,tw,th);
  g.strokeStyle='rgba(255,255,255,'+(0.35+0.5*h).toFixed(3)+')';g.lineWidth=2.5;for(var q=0;q<5;q++){var qx=tx+35+q*50;g.beginPath();for(var k2=0;k2<=20;k2++){var yy2=ty+th-8-k2*5,xx2=qx+5*Math.sin(k2*0.7-ts/220+q);if(k2===0)g.moveTo(xx2,yy2);else g.lineTo(xx2,yy2)}g.stroke()}}
 g.restore();g.strokeStyle='#B9A28C';g.lineWidth=1.5;rr(g,tx,ty,tw,th,6);g.stroke();
 // termómetro
 var mx=tx+tw+30,mt=ty+2,mb=ty+th-14;g.fillStyle='#fff';rr(g,mx-8,mt,16,mb-mt+4,8);g.fill();g.strokeStyle='#5a4636';g.lineWidth=2;g.stroke();
 var lvl=(mb-mt-6)*h;g.fillStyle='#D62E1F';g.fillRect(mx-4,mb-lvl,8,lvl+4);g.beginPath();g.arc(mx,mb+8,11,0,TAU);g.fill();g.strokeStyle='#5a4636';g.stroke();
 g.font=F(16,1);g.fillStyle=cont?'#B3261E':(h>0?'#C77700':'#5a4636');g.textAlign='left';
 g.fillText(cont?'Continuo: calienta (SATA '+s.toFixed(2)+')':(h>0?'Pulsado, SATA alto: puede calentar':'Pulsado, SATA bajo: sin calor apreciable'),P1+12,py+ph-14);
 // panel mecánico (micromasaje)
 var Pp=2000,onNow=cont||((ts%Pp)/Pp<dc3);mAmp+=((onNow?1:0)-mAmp)*0.3;
 g.fillStyle='#FFF8F2';rr(g,P2,py,PW,ph,10);g.fill();g.strokeStyle='#7A3D12';g.lineWidth=3;g.stroke();
 g.font=F(17,1);g.fillStyle='#7A3D12';g.textAlign='left';g.fillText('Mecánico: compresión y expansión',P2+12,py+24);
 var mx0=P2+12,my0=py+36,mw=326,mh=116,lamm=44;
 g.save();rr(g,mx0,my0,mw,mh,6);g.clip();g.fillStyle='#EBC6B2';g.fillRect(mx0,my0,mw,mh);
 for(y=my0;y<my0+mh;y+=2){var cv=-Math.cos(TAU*(y-my0)/lamm-ts/130)*mAmp;g.fillStyle=cv>0?'rgba(110,50,15,'+(0.42*cv).toFixed(3)+')':'rgba(255,255,255,'+(-0.6*cv).toFixed(3)+')';g.fillRect(mx0,y,mw,2)}
 g.fillStyle='#6E320F';for(var ci=0;ci<14;ci++)for(var cj=0;cj<6;cj++){var x0p=mx0+14+ci*(mw-28)/13,y0p=my0+10+cj*(mh-20)/5,dyp=6*mAmp*Math.sin(TAU*(y0p-my0)/lamm-ts/130);g.beginPath();g.arc(x0p,y0p+dyp,3.4,0,TAU);g.fill()}
 g.restore();g.strokeStyle='#B9A28C';g.lineWidth=1.5;rr(g,mx0,my0,mw,mh,6);g.stroke();
 tag(g,onNow?'emitiendo':'pausa',mx0+mw-8,my0+22,{align:'right',bold:1,color:onNow?'#fff':'#5a4636',bg:onNow?'#C77700':'rgba(255,255,255,0.92)'});
 g.font=F(16,1);g.fillStyle='#7A3D12';g.textAlign='left';
 g.fillText(cont?'También presente en continuo':(h>0?'Micromasaje (con algo de calor)':'Pulsado: micromasaje sin calor'),P2+12,py+ph-14);
}
function draw3(){upd3();render3(performance.now())}
$('i3').addEventListener('input',function(){i3=+this.value;draw3()});
$('t3r').addEventListener('input',function(){tm=+this.value;draw3()});
seg('d3',function(v){dc3=+v;draw3()});seg('a3',function(v){a3=+v;draw3()});

/* ---------- TAB 4: caso clínico dinámico ---------- */
var md4='p20',I4=0.5,tg4={},st4={hem:1,ed:0.5,B:0,M:0.5,T:0.5},bl4=[],ca4=[],gr4=[],lk4=[],rb4=[];
(function(){for(var i=0;i<9;i++)rb4.push({x:400+i*38,o:(i%3-1)*0.45})})();
function cp(v){return Math.max(0,Math.min(1,v))}
function calc4(){var d=md4==='c'?1:(md4==='p50'?0.5:0.2),s=I4*d,dT=3.5*s,B=cp((dT-0.5)/2.5),m=md4==='c'?0.5*cp(I4/0.5):cp(I4/0.5);
 return {d:d,s:s,T:dT,B:B,M:m,hem:Math.max(0.55,1+0.9*B-0.35*m*(1-B)),ed:Math.max(0.1,Math.min(1.1,0.45+0.6*B-0.35*m*(1-B)))}}
function upd4(){var q=tg4=calc4(),pc=function(v){return Math.round(v*100)+' %'};
 $('i4v').textContent=I4.toFixed(1)+' W/cm²';$('sata4').textContent=q.s.toFixed(2)+' W/cm²';$('dt4').textContent='+'+q.T.toFixed(1)+' °C';
 $('bb4').style.width=pc(q.B);$('bv4').textContent=pc(q.B);$('bm4').style.width=pc(q.M);$('mv4').textContent=pc(q.M);
 var v=$('vd4');
 if(q.B>0.35){v.textContent='Riesgo: más sangrado y edema';v.style.background='#B3261E'}
 else if(q.B>0.1){v.textContent='Precaución: calentamiento en fase aguda';v.style.background='#C77700'}
 else if(q.M>=0.5){v.textContent='Dosis adecuada para fase aguda';v.style.background='#2E7D4F'}
 else{v.textContent='Dosis baja: poco estímulo celular';v.style.background='#6b5848'}
 $('x4a').innerHTML='<b>Físico:</b> '+(q.T<0.5?'casi sin calor (+'+q.T.toFixed(1)+' °C), predomina el efecto mecánico (microstreaming y cavitación estable).':(q.T<2?'calentamiento leve (+'+q.T.toFixed(1)+' °C) sumado al efecto mecánico.':'calentamiento marcado (+'+q.T.toFixed(1)+' °C), predomina el efecto térmico.'));
 $('x4b').innerHTML='<b>Celular:</b> '+(q.M<0.3?'estímulo insuficiente, entra poco Ca²⁺ y hay poca activación celular.':(q.M<0.7?'entrada moderada de Ca²⁺ y activación parcial de mastocitos y fibroblastos'+(md4==='c'?'; el calor acelera el metabolismo.':'.'):'entra Ca²⁺, se activan mastocitos y fibroblastos y aumenta el colágeno nuevo.'));
 $('x4c').innerHTML='<b>Tisular:</b> '+(q.B>0.6?'vasodilatación intensa y capilares más permeables: el hematoma crece y aumenta el edema.':(q.B>0.2?'vasodilatación moderada: riesgo de más sangrado y edema.':'el hematoma y el edema se reabsorben y la reparación avanza hacia la fase proliferativa.'))}
function fiber4(g,lx,ly,h){var i;g.strokeStyle='#F5E9DD';g.lineWidth=2.4;for(i=-1;i<=1;i+=2){g.beginPath();g.moveTo(lx+i*(34*h+4),ly-16);g.lineTo(lx+i*(28*h+4),ly-6);g.lineTo(lx+i*(36*h+4),ly+3);g.lineTo(lx+i*(28*h+4),ly+13);g.stroke()}}
function render4(ts){
 var c=$('c4'),W=760,H=620,g=ctx(c,W,H),t=ts/1000,i,k,q=tg4,s=st4,cx=380,skin=96,lx=380,ly=205;
 ['hem','ed','B','M','T'].forEach(function(n){s[n]+=(q[n]-s[n])*0.05});
 g.fillStyle='#fff';g.fillRect(0,0,W,H);
 head(g,cx,24,150,1);
 g.fillStyle='#E6B39B';g.fillRect(0,skin,W,14);g.fillStyle='#C9715B';g.fillRect(0,110,W,190);
 g.save();g.beginPath();g.rect(0,110,W,190);g.clip();texture(g,'muscle',0,110,W-10,300);
 if(s.T>0.05){var hg=g.createRadialGradient(cx,190,10,cx,190,300);hg.addColorStop(0,'rgba(255,170,40,'+(cp(s.T/4)*0.85)+')');hg.addColorStop(1,'rgba(255,120,0,0)');g.fillStyle=hg;g.fillRect(0,110,W,190)}
 // ondas
 var col=md4==='c'?'255,110,0':'31,95,139',al=0.25+0.5*cp(I4/3),v=90;g.lineWidth=3;
 for(k=0;k<28;k++){var r=(k*8+v*t)%224+4,te=t-r/v,fr=te*0.8-Math.floor(te*0.8);if(q.d<1&&fr>=q.d)continue;
  g.strokeStyle='rgba('+col+','+al+')';g.beginPath();g.arc(cx,skin,r+14,Math.PI/2-0.42,Math.PI/2+0.42);g.stroke()}
 // lesion
 var h=s.hem;g.fillStyle='rgba(95,15,15,0.88)';g.beginPath();g.ellipse(lx,ly,30*h,18*h,0.15,0,TAU);g.fill();
 g.fillStyle='rgba(55,5,5,0.9)';g.beginPath();g.ellipse(lx+3,ly+1,15*h,8*h,0.15,0,TAU);g.fill();fiber4(g,lx,ly,h);
 var n=Math.round(s.ed*18);g.fillStyle='rgba(130,200,240,0.95)';for(i=0;i<n;i++){var a=i/18*TAU+0.3;g.beginPath();g.arc(lx+Math.cos(a)*(50*h+(i%2)*12),ly+Math.sin(a)*(30*h+(i%2)*8),3.4,0,TAU);g.fill()}
 if(Math.random()<s.B*0.45&&bl4.length<80){var ag=Math.random()*TAU;bl4.push({x:lx+Math.cos(ag)*26*h,y:ly+Math.sin(ag)*15*h,vx:Math.cos(ag)*0.7,vy:Math.sin(ag)*0.5,l:1})}
 for(i=bl4.length-1;i>=0;i--){var b=bl4[i];b.x+=b.vx;b.y+=b.vy;b.l-=0.012;if(b.l<=0||b.y>296||b.y<112){bl4.splice(i,1);continue}g.fillStyle='rgba(120,10,10,'+b.l+')';g.beginPath();g.arc(b.x,b.y,3.6,0,TAU);g.fill()}
 g.restore();
 g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.moveTo(lx-100,ly+4);g.lineTo(lx-40*h-6,ly+4);g.stroke();
 tag(g,'Hematoma',lx-104,ly+10,{size:16,align:'right'});tag(g,'Edema',lx+150,ly-26,{size:16});
 tag(g,'Músculo',12,290,{size:16});
 tagLines(g,['Temperatura del tejido','+'+s.T.toFixed(1)+' °C'],548,44,{size:16,border:s.T>2?'#B3261E':'#D9C7B6',color:s.T>2?'#B3261E':'#7A3D12'});
 // paneles inferiores
 var py=320,ph=290;g.strokeStyle='#D9C7B6';g.lineWidth=2;rr(g,10,py,360,ph,10);g.stroke();rr(g,390,py,360,ph,10);g.stroke();
 tag(g,'Vista celular',24,py+28,{size:19,bold:1,bg:'none',color:'#7A3D12'});tag(g,'Vaso sanguíneo',404,py+28,{size:19,bold:1,bg:'none',color:'#7A3D12'});
 // --- celular ---
 g.fillStyle='#D8C3E8';g.strokeStyle='#7a5a96';g.lineWidth=2;g.beginPath();g.arc(55,400,22,0,TAU);g.fill();g.stroke();
 g.fillStyle='#7a5a96';for(i=0;i<7;i++){g.beginPath();g.arc(55+Math.cos(i)*10,400+Math.sin(i*1.7)*10,2.6,0,TAU);g.fill()}
 tag(g,'Mastocito',84,405,{size:15,bg:'none'});
 if(Math.random()<s.M*0.1&&gr4.length<30){var ga=Math.random()*TAU;gr4.push({x:55+Math.cos(ga)*22,y:400+Math.sin(ga)*22,vx:Math.cos(ga)*0.9,vy:Math.sin(ga)*0.9,l:1})}
 for(i=gr4.length-1;i>=0;i--){var p=gr4[i];p.x+=p.vx;p.y+=p.vy;p.l-=0.015;if(p.l<=0){gr4.splice(i,1);continue}g.fillStyle='rgba(122,90,150,'+p.l+')';g.beginPath();g.arc(p.x,p.y,3,0,TAU);g.fill()}
 g.fillStyle='#F6EBC8';g.strokeStyle='#A8760B';g.lineWidth=4;rr(g,30,452,320,92,18);g.fill();g.stroke();
 g.fillStyle='#C9A7D9';g.strokeStyle='#7a5a96';g.lineWidth=2;g.beginPath();g.ellipse(190,505,52,24,0,0,TAU);g.fill();g.stroke();
 tag(g,'Fibroblasto',190,474,{size:15,bg:'none',align:'center'});
 var chx=[90,150,230,290];g.fillStyle='#1F5F8B';chx.forEach(function(x){g.fillRect(x-8,448,16,8)});
 if(Math.random()<s.M*0.3&&ca4.length<40)ca4.push({x:chx[Math.floor(Math.random()*4)],y:372,l:1});
 for(i=ca4.length-1;i>=0;i--){var o=ca4[i];o.y+=1.4+1.4*s.M;if(o.y>456){o.x+=(190-o.x)*0.012;o.l-=0.025}if(o.l<=0||o.y>540){ca4.splice(i,1);continue}g.fillStyle='rgba(31,95,139,'+o.l+')';g.beginPath();g.arc(o.x,o.y,4.5,0,TAU);g.fill()}
 tag(g,'Ca²⁺',350,380,{size:16,align:'right',bg:'none',color:'#1F5F8B',bold:1});
 g.strokeStyle='#8C704E';g.lineWidth=2.4;for(k=0;k<3;k++){var L=Math.max(6,280*s.M),y0=562+k*12;g.beginPath();for(i=0;i<=L;i+=8){var yy=y0+2.2*Math.sin(i/9+k);if(i===0)g.moveTo(34+i,yy);else g.lineTo(34+i,yy)}g.stroke()}
 tag(g,'Colágeno nuevo',350,600,{size:15,align:'right',bg:'none',color:'#6b5848'});
 // --- vaso ---
 var hh=14+22*s.B,vy=480;g.fillStyle='#F9C9C2';g.fillRect(400,vy-hh,340,hh*2);
 g.strokeStyle='#B3261E';g.lineWidth=4;if(s.B>0.3)g.setLineDash([16,10]);g.beginPath();g.moveTo(400,vy-hh);g.lineTo(740,vy-hh);g.moveTo(400,vy+hh);g.lineTo(740,vy+hh);g.stroke();g.setLineDash([]);
 rb4.forEach(function(r){r.x+=0.8+2.4*s.B;if(r.x>735)r.x=405;g.fillStyle='#B3261E';g.beginPath();g.ellipse(r.x,vy+r.o*hh,8,5,0,0,TAU);g.fill()});
 if(s.B>0.3&&Math.random()<(s.B-0.3)*0.7&&lk4.length<70){var sg=Math.random()<0.5?-1:1;lk4.push({x:420+Math.random()*300,y:vy+sg*hh,vy:sg*(0.4+Math.random()*0.7),l:1})}
 for(i=lk4.length-1;i>=0;i--){var e=lk4[i];e.y+=e.vy;e.l-=0.01;if(e.l<=0){lk4.splice(i,1);continue}g.fillStyle='rgba(150,12,12,'+e.l+')';g.beginPath();g.arc(e.x,e.y,3.8,0,TAU);g.fill()}
 var nd=Math.round(s.ed*14);g.fillStyle='rgba(120,190,235,0.9)';for(i=0;i<nd;i++){var dx=410+(i*53)%320,dy=(i%2?vy+hh+30+(i%3)*18:vy-hh-30-(i%3)*18)+Math.sin(t*2+i)*2;g.beginPath();g.arc(dx,dy,3.6,0,TAU);g.fill()}
 tag(g,'Capilar: '+(s.B>0.55?'muy dilatado':(s.B>0.2?'dilatado':'calibre normal')),740,py+58,{size:15,align:'right',bg:'none'});
 tag(g,s.B>0.3?'Sale sangre: crece el hematoma':'Sin fuga de sangre',404,600,{size:15,bg:'none',color:s.B>0.3?'#B3261E':'#2E7D4F',bold:1});
}
function draw4(){upd4();render4(performance.now())}
function setMode4(v){md4=v;[].forEach.call($('m4').children,function(x){x.classList.toggle('on',x.getAttribute('data-v')===v)});draw4()}
seg('m4',function(v){md4=v;draw4()});
$('i4').addEventListener('input',function(){I4=+this.value;draw4()});
$('pr1').addEventListener('click',function(){I4=0.5;$('i4').value=0.5;setMode4('p20')});
$('pr2').addEventListener('click',function(){I4=1.5;$('i4').value=1.5;setMode4('c')});
$('rv4').addEventListener('click',function(){var p=$('prop4'),o=p.style.display==='none';p.style.display=o?'block':'none';this.textContent=o?'Ocultar propuesta de tratamiento':'Mostrar propuesta de tratamiento'});

/* ---------- animación ---------- */
function frame(ts){if($('t2').classList.contains('on'))render2(ts);if($('t3').classList.contains('on'))render3(ts);if($('t4').classList.contains('on'))render4(ts);if(!dead)raf=requestAnimationFrame(frame)}
draw1();draw3();draw4();raf=requestAnimationFrame(frame);
return {destroy:function(){dead=true;cancelAnimationFrame(raf)}};
  }
});
