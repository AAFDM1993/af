/* Módulo "¿Cómo quita el dolor?" del Laboratorio: escena animada de la compuerta medular y las endorfinas. */
(function () {
  var K = LabKit, U = K.ui, A = AnalgesiaCore;

  /* ---------- escena ---------- */
  /* Tramo A: de la piel a la terminal (botón sináptico) en el asta posterior. Tramo B: de la terminal, a través de la compuerta, a la célula T y al cerebro. */
  var PATHS = {
    C: 'M84 452 C84 372 170 340 300 334 S520 332 628 332',
    Adelta: 'M112 450 C112 352 210 296 330 290 S520 290 628 290',
    Abeta: 'M300 452 C300 350 360 250 460 236 S520 232 541 232',
    BC: 'M628 332 C660 330 690 322 722 312 L760 296 L760 128 L736 104',
    BD: 'M628 290 C660 292 690 300 722 312 L760 296 L760 128 L736 104',
    axon: 'M722 312 L760 296 L760 128 L736 104'
  };
  var COLORS = { C: '#B5532A', Adelta: '#C98A12', Abeta: '#2F6FB0', dolor: '#E8590C', corriente: '#1F6FEB', endo: '#2E9E5B', sp: '#F2C200' };
  var BRAIN_D = 'M592 80 C577 50 602 18 642 20 C657 6 697 6 714 18 C747 12 777 35 770 62 C784 82 762 108 734 104 C717 116 682 114 668 104 C642 112 607 104 592 80 Z';
  var RCP = { Adelta: [619, 280], C: [619, 322] };
  var BOUTON = { Adelta: [628, 290], C: [628, 332] };
  var METER_X = { bajo: 416, medio: 466, alto: 516 };
  var GATE_ROT = { abierta: 90, parcial: 45, cerrada: 0 };
  var GATE_INFO = {
    abierta: ['Compuerta: abierta', 'Pasa toda la señal de dolor', 'g'],
    parcial: ['Compuerta: a medias', 'Pasa parte de la señal de dolor', 'a'],
    cerrada: ['Compuerta: cerrada', 'La interneurona frena a la célula T', 'r'],
    endo: ['Compuerta: abierta', 'Endorfinas frenan la sustancia P', 'a']
  };
  var MOUTH = { bajo: 'M-12 6 Q0 18 12 6', medio: 'M-11 10 L11 10', alto: 'M-12 15 Q0 3 12 15' };

  function rays() {
    return [150, 180, 210, -30, 0, 30, -145, -35].map(function (a) {
      var c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
      return '<line x1="' + (680 + 102 * c).toFixed(1) + '" y1="' + (62 + 56 * s).toFixed(1) + '" x2="' + (680 + 116 * c).toFixed(1) + '" y2="' + (62 + 70 * s).toFixed(1) + '"/>';
    }).join('');
  }

  function fiber(key, d, w) {
    /* w: grosor de la vaina (0 = sin mielina) */
    var out = '<g data-r="f' + key + '"><path class="under" stroke-width="' + (w ? w + 10 : 14) + '" d="' + d + '"/>';
    if (w) out += '<path class="sheath2" stroke-width="' + (w + 2.5) + '" d="' + d + '"/><path class="sheath" stroke-width="' + w + '" d="' + d + '"/>';
    return out + '<path class="fib" data-r="p' + key + '" stroke="' + COLORS[{ C: 'C', D: 'Adelta', A: 'Abeta' }[key]] + '" stroke-width="' + (w ? 3.5 : 3) + '" d="' + d + '"/></g>';
  }

  function bouton(f) {
    var b = BOUTON[f], col = COLORS[f], rc = RCP[f];
    return '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="11" fill="#fff" stroke="' + col + '" stroke-width="3"/>' +
      '<circle cx="' + (b[0] - 3) + '" cy="' + (b[1] - 2) + '" r="2.4" fill="' + COLORS.sp + '" stroke="#9a7a00" stroke-width=".6"/>' +
      '<circle cx="' + (b[0] + 3) + '" cy="' + (b[1] + 3) + '" r="2.4" fill="' + COLORS.sp + '" stroke="#9a7a00" stroke-width=".6"/>' +
      '<circle cx="' + (b[0] + 4) + '" cy="' + (b[1] - 4) + '" r="2.4" fill="' + COLORS.sp + '" stroke="#9a7a00" stroke-width=".6"/>' +
      '<path class="rcp" d="M' + (rc[0] - 4) + ' ' + (rc[1] - 4) + ' L' + rc[0] + ' ' + rc[1] + ' L' + (rc[0] + 4) + ' ' + (rc[1] - 4) + '" />' +
      /* ✕ rojo: la sustancia P no sale de la terminal cuando actúan las endorfinas */
      '<path class="spx" d="M' + (b[0] + 14) + ' ' + (b[1] - 5) + ' l9 9 m0 -9 l-9 9" />';
  }

  /* § se reemplaza por un sufijo único: hay dos escenas en el mismo documento y los id de patrones no deben chocar. */
  var SVG =
    '<svg viewBox="0 0 800 500" role="img" aria-label="Esquema didáctico de la compuerta medular: cómo la corriente disminuye el dolor">' +
    '<style>.t{font-family:Cambria,Georgia,serif;fill:#2B1B10;paint-order:stroke;stroke:#fff;stroke-width:4px;stroke-linejoin:round}.sm{font-size:15px}.md{font-size:17px}.lg{font-size:19px;font-weight:bold}.b{font-weight:bold}' +
    '.fib{fill:none;stroke-linecap:round}.sheath{fill:none;stroke:#F6E9C2;stroke-linecap:butt;stroke-dasharray:20 4}.sheath2{fill:none;stroke:#B89B52;stroke-linecap:butt;stroke-dasharray:20 4}' +
    '.under{fill:none;stroke:#1F6FEB;stroke-opacity:.3;stroke-linecap:round;opacity:0;transition:opacity .5s}g.on>.under{opacity:1}' +
    '.field{opacity:0;transition:opacity .6s}g.cur>.field{opacity:1}.fieldarc{fill:none;stroke:#1F6FEB;stroke-width:3;stroke-dasharray:8 7;stroke-linecap:round}' +
    '.leaf{transition:transform .8s cubic-bezier(.4,1.5,.5,1)}.lock{opacity:0;transition:opacity .5s}g.closed>.lock{opacity:1}' +
    '.inh{opacity:.25;transition:opacity .5s}g.inhon>.inh{opacity:1}' +
    '.rcp{fill:none;stroke:#8a8a8a;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;transition:stroke .5s}g.endo>.rcp{stroke:#2E9E5B;stroke-width:3.5}' +
    '.spx{fill:none;stroke:#D32F2F;stroke-width:3;stroke-linecap:round;opacity:0;transition:opacity .5s}g.endo>.spx{opacity:1}g.endo~g .inh{opacity:0}' +
    '.lamp{fill:#555;opacity:.22;transition:opacity .4s,fill .4s}.mseg{opacity:.45;transition:opacity .4s}.mseg.cur{opacity:1}.segbox{fill:none;stroke:#2B1B10;stroke-width:3;opacity:0;transition:opacity .4s}.mseg.cur+.segbox{opacity:1}' +
    '.ind,.face{transition:transform .5s ease}.facec{transition:fill .5s}.ray{stroke:#E8590C;stroke-width:4;stroke-linecap:round}' +
    '@media (prefers-reduced-motion: reduce){.under,.field,.leaf,.lock,.inh,.rcp,.spx,.lamp,.mseg,.segbox,.ind,.face,.facec{transition:none}}</style>' +
    '<defs>' +
    '<pattern id="epi§" width="9" height="7" patternUnits="userSpaceOnUse"><rect x=".5" y=".5" width="8" height="6" rx="2" fill="none" stroke="#B9785A" stroke-width="1"/></pattern>' +
    '<pattern id="der§" width="28" height="12" patternUnits="userSpaceOnUse"><path d="M0 6 C7 0 14 12 21 6 S28 3 28 6" fill="none" stroke="#D9A182" stroke-width="1.4"/></pattern>' +
    '<pattern id="fat§" width="20" height="16" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="5" fill="#FBEFCF" stroke="#E2C47E"/><circle cx="16" cy="13" r="4.5" fill="#FBEFCF" stroke="#E2C47E"/></pattern>' +
    '<pattern id="str§" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#fff"/><rect width="5" height="10" fill="#C62828"/></pattern>' +
    '<radialGradient id="fg§" cx="300" cy="420" r="150" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1F6FEB" stop-opacity=".42"/><stop offset=".55" stop-color="#1F6FEB" stop-opacity=".16"/><stop offset="1" stop-color="#1F6FEB" stop-opacity="0"/></radialGradient>' +
    '<clipPath id="sk§"><rect x="0" y="410" width="450" height="90"/></clipPath>' +
    '</defs>' +
    '<rect width="800" height="500" fill="#fff"/>' +
    /* piel en capas */
    '<rect x="0" y="410" width="450" height="14" fill="#D49A79"/><rect x="0" y="410" width="450" height="14" fill="url(#epi§)"/>' +
    '<rect x="0" y="424" width="450" height="44" fill="#EFC6AD"/><rect x="0" y="424" width="450" height="44" fill="url(#der§)"/>' +
    '<rect x="0" y="468" width="450" height="32" fill="#F5E3BC"/><rect x="0" y="468" width="450" height="32" fill="url(#fat§)"/>' +
    '<line x1="0" y1="410" x2="450" y2="410" stroke="#A8644A" stroke-width="2"/>' +
    /* campo eléctrico */
    '<g data-r="elec"><g class="field" clip-path="url(#sk§)"><ellipse cx="300" cy="430" rx="160" ry="80" fill="url(#fg§)"/>' +
    '<path class="fieldarc" d="M244 412 C254 466 346 466 356 412"/><path class="fieldarc" d="M220 412 C232 494 368 494 380 412"/></g>' +
    /* electrodos */
    '<rect x="196" y="408" width="66" height="4" fill="#9CC9F0"/><rect x="196" y="395" width="66" height="14" rx="4" fill="#B3261E"/><circle cx="229" cy="393" r="4" fill="#777"/>' +
    '<text class="t md b" x="229" y="408" text-anchor="middle" style="fill:#fff;stroke:none">−</text>' +
    '<rect x="338" y="408" width="66" height="4" fill="#9CC9F0"/><rect x="338" y="395" width="66" height="14" rx="4" fill="#3B3B3B"/><circle cx="371" cy="393" r="4" fill="#777"/>' +
    '<text class="t md b" x="371" y="408" text-anchor="middle" style="fill:#fff;stroke:none">+</text>' +
    '<text class="t sm" x="229" y="384" text-anchor="middle">Cátodo (−)</text><text class="t sm" x="371" y="384" text-anchor="middle">Ánodo (+)</text></g>' +
    /* lesión y receptores */
    '<path d="M98 428 L106 438 L120 434 L114 447 L124 456 L109 457 L104 469 L96 458 L82 462 L87 449 L76 440 L91 438 Z" fill="#E23B2E" opacity=".85"/>' +
    '<path d="M94 440 L101 449 L97 449 L103 459" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<g fill="none" stroke-width="2" stroke-linecap="round"><path d="M84 452 L76 462 M84 452 L84 466 M84 452 L93 463" stroke="' + COLORS.C + '"/><path d="M112 450 L104 461 M112 450 L120 461" stroke="' + COLORS.Adelta + '"/></g>' +
    '<ellipse cx="300" cy="458" rx="7" ry="10" fill="#DCE8F6" stroke="' + COLORS.Abeta + '" stroke-width="2"/><ellipse cx="300" cy="458" rx="3.5" ry="5.5" fill="none" stroke="' + COLORS.Abeta + '" stroke-width="1.5"/>' +
    '<text class="t sm" x="12" y="494">Lesión (nociceptores)</text><text class="t md b" x="444" y="494" text-anchor="end">Piel</text>' +
    /* médula */
    '<rect x="455" y="178" width="330" height="214" rx="28" fill="#F8ECF1" stroke="#C99AAE" stroke-width="2"/>' +
    '<rect x="468" y="192" width="304" height="186" rx="24" fill="#EDD8E2"/>' +
    '<rect x="476" y="199" width="272" height="62" rx="26" fill="#FBF1CF" stroke="#D9BA62" stroke-width="1.5" stroke-dasharray="5 4"/>' +
    '<text class="t md b" x="458" y="168">Médula espinal · asta posterior</text>' +
    '<text class="t sm" x="706" y="226" text-anchor="middle">Sustancia</text><text class="t sm" x="706" y="244" text-anchor="middle">gelatinosa</text>' +
    /* fibras */
    fiber('C', PATHS.C, 0) + fiber('D', PATHS.Adelta, 9) + fiber('A', PATHS.Abeta, 13) +
    '<text class="t lg" x="70" y="404" text-anchor="end" style="fill:' + COLORS.C + '">C</text>' +
    '<text class="t lg" x="126" y="402" style="fill:' + COLORS.Adelta + '">Aδ</text>' +
    '<text class="t lg" x="291" y="366" text-anchor="end" style="fill:' + COLORS.Abeta + '">Aβ</text>' +
    /* trayectos invisibles del tramo B */
    '<path data-r="pBC" fill="none" stroke="none" d="' + PATHS.BC + '"/><path data-r="pBD" fill="none" stroke="none" d="' + PATHS.BD + '"/>' +
    /* célula T y su axón al cerebro */
    '<path class="fib" stroke="#7A5C6B" stroke-width="4" d="' + PATHS.axon + '"/><path d="M752 160 L760 145 L768 160 Z" fill="#7A5C6B"/>' +
    '<g stroke="#7A5C6B" stroke-width="3" stroke-linecap="round"><line x1="722" y1="312" x2="700" y2="290"/><line x1="722" y1="312" x2="698" y2="334"/><line x1="722" y1="312" x2="728" y2="344"/></g>' +
    '<circle cx="722" cy="312" r="22" fill="#D5AEC2" stroke="#7A5C6B" stroke-width="2.5"/><text class="t lg" x="722" y="319" text-anchor="middle" style="stroke:none">T</text>' +
    '<text class="t sm" x="748" y="370" text-anchor="middle">Célula T</text>' +
    /* terminales (botones sinápticos) con vesículas de sustancia P y receptores */
    '<g data-r="rcp">' + bouton('Adelta') + bouton('C') + '</g>' +
    /* interneurona inhibitoria */
    '<g stroke="#3B6B3B" stroke-width="3" stroke-linecap="round"><line x1="562" y1="231" x2="548" y2="210"/><line x1="562" y1="231" x2="580" y2="208"/><line x1="562" y1="231" x2="584" y2="246"/></g>' +
    '<circle data-r="inter" cx="562" cy="231" r="15" fill="#6BA36B" stroke="#3B6B3B" stroke-width="2.5"/>' +
    '<circle cx="541" cy="232" r="7" fill="#fff" stroke="' + COLORS.Abeta + '" stroke-width="3"/>' +
    '<text class="t sm" x="446" y="206" text-anchor="end">Interneurona</text><text class="t sm" x="446" y="224" text-anchor="end">inhibitoria</text>' +
    '<line x1="450" y1="212" x2="546" y2="222" stroke="#3B6B3B" stroke-width="1.5" stroke-dasharray="3 3"/>' +
    /* flecha de inhibición ⊣ hacia la compuerta */
    '<g data-r="inhG"><g class="inh"><path data-r="inhP" d="M576 240 Q614 256 646 258" fill="none" stroke="#2E7D32" stroke-width="4" stroke-linecap="round"/>' +
    '<line x1="649" y1="248" x2="649" y2="268" stroke="#2E7D32" stroke-width="5" stroke-linecap="round"/>' +
    '<text class="t sm b" x="598" y="278" text-anchor="middle" style="fill:#2E7D32">inhibe</text></g></g>' +
    /* compuerta con bisagras */
    '<g data-r="gate">' +
    '<rect class="leaf" data-r="leafT" x="657" y="262" width="10" height="49" rx="3" fill="url(#str§)" stroke="#5a1a1a" stroke-width="1.5" style="transform-origin:662px 262px"/>' +
    '<rect class="leaf" data-r="leafB" x="657" y="311" width="10" height="49" rx="3" fill="url(#str§)" stroke="#5a1a1a" stroke-width="1.5" style="transform-origin:662px 360px"/>' +
    '<rect x="652" y="255" width="20" height="5" rx="2" fill="#4a4a4a"/><rect x="652" y="362" width="20" height="5" rx="2" fill="#4a4a4a"/>' +
    '<circle cx="662" cy="262" r="5" fill="#333"/><circle cx="662" cy="360" r="5" fill="#333"/>' +
    '<g class="lock" transform="translate(662 311) scale(1.4)"><path d="M-5 -2 V-7 A5 5 0 0 1 5 -7 V-2" fill="none" stroke="#333" stroke-width="2.5"/><rect x="-7.5" y="-2" width="15" height="12" rx="2" fill="#F2B705" stroke="#333" stroke-width="1.5"/></g>' +
    '<text class="t sm b" x="662" y="388" text-anchor="middle">Compuerta</text></g>' +
    /* cerebro */
    '<g data-r="brainG"><g class="ray" data-r="rays" style="opacity:0">' + rays() + '</g>' +
    '<path data-r="brain" d="' + BRAIN_D + '" fill="#F6D3BD" stroke="#B5532A" stroke-width="2.5"/>' +
    '<g fill="none" stroke="#C98466" stroke-width="2" stroke-linecap="round"><path d="M612 66 C626 52 646 74 662 58"/><path d="M632 38 C642 28 660 32 664 44"/><path d="M684 34 C698 24 714 44 734 32"/><path d="M692 84 C706 72 726 90 748 76"/><path d="M606 90 C620 84 636 96 650 88"/><path d="M738 54 C748 46 758 56 762 64"/></g>' +
    '<text class="t lg" x="680" y="69" text-anchor="middle">Cerebro</text></g>' +
    /* medidor de dolor */
    '<text class="t md b" x="318" y="30">Dolor percibido</text><text class="t sm" x="318" y="48" style="fill:#555">(modelo didáctico)</text>' +
    '<g class="face" data-r="face" style="transform:translate(346px,95px)"><circle class="facec" data-r="faceC" r="25" fill="#7CC48B" stroke="#2B1B10" stroke-width="2"/>' +
    '<circle cx="-8" cy="-6" r="3" fill="#2B1B10"/><circle cx="8" cy="-6" r="3" fill="#2B1B10"/><path data-r="mouth" d="' + MOUTH.bajo + '" fill="none" stroke="#2B1B10" stroke-width="3" stroke-linecap="round"/></g>' +
    '<rect class="mseg" data-r="mbajo" x="392" y="80" width="48" height="22" rx="4" fill="#7CC48B"/><rect class="segbox" x="392" y="80" width="48" height="22" rx="4"/>' +
    '<rect class="mseg" data-r="mmedio" x="442" y="80" width="48" height="22" rx="4" fill="#F4C542"/><rect class="segbox" x="442" y="80" width="48" height="22" rx="4"/>' +
    '<rect class="mseg" data-r="malto" x="492" y="80" width="48" height="22" rx="4" fill="#E8665A"/><rect class="segbox" x="492" y="80" width="48" height="22" rx="4"/>' +
    '<path class="ind" data-r="ind" d="M-9 -12 L9 -12 L0 -2 Z" fill="#2B1B10" style="transform:translate(416px,78px)"/>' +
    '<text class="t sm" x="416" y="122" text-anchor="middle">Bajo</text><text class="t sm" x="466" y="122" text-anchor="middle">Medio</text><text class="t sm" x="516" y="122" text-anchor="middle">Alto</text>' +
    /* leyenda */
    '<g transform="translate(14 30)"><text class="t md b" x="0" y="0">Fibras y señales</text>' +
    '<line x1="0" y1="20" x2="36" y2="20" stroke="' + COLORS.C + '" stroke-width="3"/><text class="t sm" x="44" y="25">C (1–2 m/s): dolor lento</text>' +
    '<line x1="0" y1="42" x2="36" y2="42" stroke="#B89B52" stroke-width="11" stroke-dasharray="15 3"/><line x1="0" y1="42" x2="36" y2="42" stroke="#F6E9C2" stroke-width="8.5" stroke-dasharray="15 3"/><line x1="0" y1="42" x2="36" y2="42" stroke="' + COLORS.Adelta + '" stroke-width="3"/><text class="t sm" x="44" y="47">Aδ (20–25 m/s): dolor rápido</text>' +
    '<line x1="0" y1="64" x2="36" y2="64" stroke="#B89B52" stroke-width="13" stroke-dasharray="15 3"/><line x1="0" y1="64" x2="36" y2="64" stroke="#F6E9C2" stroke-width="10.5" stroke-dasharray="15 3"/><line x1="0" y1="64" x2="36" y2="64" stroke="' + COLORS.Abeta + '" stroke-width="3.5"/><text class="t sm" x="44" y="69">Aβ (50–70 m/s): tacto, hormigueo</text>' +
    '<circle cx="18" cy="88" r="7" fill="' + COLORS.dolor + '" stroke="#fff" stroke-width="1.5"/><text class="t sm" x="44" y="93">señal de dolor</text>' +
    '<circle cx="18" cy="110" r="6" fill="' + COLORS.corriente + '"/><text class="t sm" x="44" y="115">señal de la corriente</text>' +
    '<g data-r="legEndo"><circle cx="18" cy="132" r="5" fill="' + COLORS.endo + '"/><text class="t sm" x="44" y="137">endorfinas y encefalinas</text>' +
    '<circle cx="18" cy="154" r="4.5" fill="' + COLORS.sp + '" stroke="#9a7a00"/><text class="t sm" x="44" y="159">sustancia P</text></g></g>' +
    /* panel de estado de la compuerta */
    '<rect x="456" y="404" width="330" height="66" rx="10" fill="#fff" stroke="#D8C9CF" stroke-width="2"/>' +
    '<rect x="466" y="411" width="26" height="52" rx="7" fill="#2f2f2f"/>' +
    '<circle class="lamp" data-r="lr" cx="479" cy="423" r="6.5"/><circle class="lamp" data-r="la" cx="479" cy="437" r="6.5"/><circle class="lamp" data-r="lg" cx="479" cy="451" r="6.5"/>' +
    '<text class="t md b" data-r="gateTxt" x="504" y="432"></text><text class="t sm" data-r="gateTxt2" x="504" y="456"></text>' +
    '<g data-r="pulses"></g><g data-r="dots"></g>' +
    '<text class="t sm" x="788" y="494" text-anchor="end" style="fill:#555">Esquema didáctico</text>' +
    '</svg>';

  var SPEED_REF = 600, C_MS = 8000;
  function speed(f) { return SPEED_REF / (A.animDuration(f, C_MS) / 1000); }
  var NS = 'http://www.w3.org/2000/svg', UID = 0;
  var LAMP = { r: '#E53935', a: '#FFB300', g: '#43A047' };

  function mk(tag, at, parent) {
    var el = document.createElementNS(NS, tag);
    for (var k in at) el.setAttribute(k, at[k]);
    if (parent) parent.appendChild(el);
    return el;
  }

  function makeScene(container, opts) {
    opts = opts || {};
    container.innerHTML = SVG.replace(/§/g, '-an' + (++UID));
    var svg = container.querySelector('svg');
    function r(n) { return svg.querySelector('[data-r="' + n + '"]'); }
    var pulsesG = r('pulses'), dotsG = r('dots');
    var paths = { C: r('pC'), Adelta: r('pD'), Abeta: r('pA') }, pathsB = { C: r('pBC'), Adelta: r('pBD') };
    var len = { C: paths.C.getTotalLength(), Adelta: paths.Adelta.getTotalLength(), Abeta: paths.Abeta.getTotalLength() };
    var lenB = { C: pathsB.C.getTotalLength(), Adelta: pathsB.Adelta.getTotalLength() };
    var arcs = svg.querySelectorAll('.fieldarc'), brainG = r('brainG'), brain = r('brain'), raysG = r('rays'), inter = r('inter'), inhP = r('inhP');
    var S = null, stats = { brain: 0, blocked: 0, inter: 0 }, pulses = [], dots = [], emitters = [], counters = { C: 0, Adelta: 0 }, glow = 0, interGlow = 0, dotAcc = 0, flowT = 0, nextRcp = 0, shown = { glow: -1, inter: -1 };
    var playing = !opts.startPaused, dead = false, raf = 0, last = 0;

    function setState(st) {
      var nivel = st.nivel || 'sin-corriente', hz = st.hz === undefined ? 100 : st.hz;
      S = { corriente: st.corriente === undefined ? nivel !== 'sin-corriente' : st.corriente, nivel: nivel, hz: hz,
        compuerta: st.compuerta || A.gateState(nivel, hz), endorfinas: st.endorfinas === undefined ? A.endorphins(hz, nivel) : st.endorfinas,
        dolor: st.dolor || A.painPerceived(nivel, hz) };
      clearAll(); paint(); seed(); visuals(0);
    }

    function clearAll() {
      pulses.forEach(function (p) { if (p.el.parentNode) p.el.parentNode.removeChild(p.el); }); pulses = [];
      dots.forEach(function (d) { if (d.el.parentNode) d.el.parentNode.removeChild(d.el); }); dots = [];
      counters = { C: 0, Adelta: 0 }; glow = 0; interGlow = 0; dotAcc = 0; nextRcp = 0; stats = { brain: 0, blocked: 0, inter: 0 };
    }

    function paint() {
      var act = S.corriente ? A.activeFibers(S.nivel) : [];
      r('fC').classList.toggle('on', act.indexOf('C') > -1);
      r('fD').classList.toggle('on', act.indexOf('Adelta') > -1);
      r('fA').classList.toggle('on', act.indexOf('Abeta') > -1);
      r('elec').classList.toggle('cur', S.corriente);
      /* compuerta: las hojas giran sobre sus bisagras (0° cerrada, 45° a medias, 90° abierta) */
      var rot = GATE_ROT[S.compuerta];
      r('leafT').style.transform = 'rotate(' + (-rot) + 'deg)'; r('leafB').style.transform = 'rotate(' + rot + 'deg)';
      r('gate').classList.toggle('closed', S.compuerta === 'cerrada');
      /* la interneurona cierra la compuerta: la flecha ⊣ se enciende cuando actúa */
      r('inhG').classList.toggle('inhon', S.corriente && !S.endorfinas && S.compuerta !== 'abierta');
      r('rcp').classList.toggle('endo', !!S.endorfinas);
      var info = GATE_INFO[S.endorfinas ? 'endo' : S.compuerta];
      r('gateTxt').textContent = info[0]; r('gateTxt2').textContent = info[1];
      r('gateTxt2').style.fill = S.endorfinas ? '#2E7D32' : '#2B1B10';
      ['r', 'a', 'g'].forEach(function (k) { var l = r('l' + k), on = info[2] === k; l.style.fill = on ? LAMP[k] : '#555'; l.style.opacity = on ? 1 : 0.22; });
      r('legEndo').style.opacity = S.endorfinas ? 1 : 0.4;
      /* medidor */
      ['bajo', 'medio', 'alto'].forEach(function (k) { r('m' + k).classList.toggle('cur', S.dolor === k); });
      r('ind').style.transform = 'translate(' + METER_X[S.dolor] + 'px,78px)';
      r('faceC').setAttribute('fill', { bajo: '#7CC48B', medio: '#F4C542', alto: '#E8665A' }[S.dolor]);
      r('mouth').setAttribute('d', MOUTH[S.dolor]);
      emitters = [{ f: 'C', kind: 'dolor', period: 2.6, acc: 0 }, { f: 'Adelta', kind: 'dolor', period: 1.2, acc: 0.4 }];
      act.forEach(function (f) { emitters.push({ f: f, kind: 'corriente', period: { Abeta: 0.7, Adelta: 1.5, C: 2.9 }[f], acc: 0.15 }); });
    }

    function seed() {
      /* mismo orden de siembra que siempre (los contadores de la compuerta dependen de él); posiciones repartidas para que la imagen en pausa se entienda */
      spawn('Adelta', 'dolor', len.Adelta * 0.55); spawn('C', 'dolor', len.C * 0.2); spawn('C', 'dolor', len.C * 0.7);
      if (S.corriente) spawn('Abeta', 'corriente', len.Abeta * 0.6);
      if (S.endorfinas) {
        [1.15, 0.8, 1.05, 0.45].forEach(function (t) { addDot(t); });
        addSP('Adelta', true, 0.35); addSP('C', true, 0.6);
      }
    }

    function passRule(f) {
      var n = counters[f]++;
      if (S.endorfinas) return n % 3 === 0;
      if (S.compuerta === 'cerrada') return false;
      if (S.compuerta === 'parcial') return n % 2 === 0;
      return true;
    }

    function spawn(f, kind, s0) {
      var col = kind === 'dolor' ? COLORS.dolor : COLORS.corriente, rr = kind === 'dolor' ? 7 : 6;
      var g = mk('g', {}, pulsesG);
      var p = { f: f, kind: kind, seg: 'A', s: s0 || 0, el: g, fade: 0,
        halo: mk('circle', { r: rr * 1.9, fill: col, opacity: 0.22 }, g),
        t2: mk('circle', { r: rr * 0.45, fill: col, opacity: 0.3 }, g),
        t1: mk('circle', { r: rr * 0.7, fill: col, opacity: 0.5 }, g),
        core: mk('circle', { r: rr, fill: col, stroke: '#fff', 'stroke-width': 1.5 }, g) };
      p.passes = f === 'Abeta' ? true : passRule(f);
      pulses.push(p); place(p);
    }

    function setXY(el, pt) { el.setAttribute('cx', pt.x.toFixed(1)); el.setAttribute('cy', pt.y.toFixed(1)); }

    function place(p) {
      var path = p.seg === 'A' ? paths[p.f] : pathsB[p.f], L = p.seg === 'A' ? len[p.f] : lenB[p.f], s = Math.min(p.s, L);
      var pt = path.getPointAtLength(s);
      setXY(p.core, pt); setXY(p.halo, pt);
      setXY(p.t1, path.getPointAtLength(Math.max(0, s - 11)));
      setXY(p.t2, path.getPointAtLength(Math.max(0, s - 22)));
    }

    function drop(p) { if (p.el.parentNode) p.el.parentNode.removeChild(p.el); p.dead = true; }

    function step(dt) {
      emitters.forEach(function (e) { e.acc += dt; while (e.acc >= e.period) { e.acc -= e.period; spawn(e.f, e.kind, 0); } });
      pulses.forEach(function (p) {
        if (p.fade > 0) {
          p.fade -= dt; var k = Math.max(0, p.fade / 0.6);
          p.el.setAttribute('opacity', k.toFixed(2)); p.halo.setAttribute('r', (16 - 6 * k).toFixed(1));
          if (p.fade <= 0) drop(p); return;
        }
        p.s += speed(p.f) * dt;
        if (p.seg === 'A' && p.s >= len[p.f]) {
          if (p.f === 'Abeta') { interGlow = 1; stats.inter++; drop(p); return; }
          if (p.passes) { p.seg = 'B'; p.s -= len[p.f]; addSP(p.f, false, 0); }
          else { p.s = len[p.f]; p.fade = 0.6; stats.blocked++; if (S.endorfinas) addSP(p.f, true, 0); }
        } else if (p.seg === 'B' && p.s >= lenB[p.f]) { glow = 1; stats.brain++; drop(p); return; }
        place(p);
      });
      pulses = pulses.filter(function (p) { return !p.dead; });
      if (S.endorfinas) {
        dotAcc += dt;
        while (dotAcc >= 0.3) { dotAcc -= 0.3; addDot(0); }
      }
      dots.forEach(function (d) { d.t += dt / d.dur; moveDot(d); });
      dots = dots.filter(function (d) { return !d.dead; });
      glow = Math.max(0, glow - dt * 1.4); interGlow = Math.max(0, interGlow - dt * 2);
      flowT += dt;
      visuals(dt);
    }

    function visuals() {
      if (S.corriente) for (var i = 0; i < arcs.length; i++) arcs[i].style.strokeDashoffset = (-(flowT * 30) % 30).toFixed(1);
      var g = Math.round(glow * 50) / 50;
      if (g !== shown.glow) {
        shown.glow = g;
        /* el cerebro "late" y se enciende cuando llega una señal de dolor */
        var sc = 1 + 0.07 * Math.sin(Math.PI * g) + 0.03 * g;
        brainG.setAttribute('transform', g > 0 ? 'translate(680 62) scale(' + sc.toFixed(3) + ') translate(-680 -62)' : '');
        brain.style.fill = g > 0 ? 'rgb(' + Math.round(246 - 6 * g) + ',' + Math.round(211 - 101 * g) + ',' + Math.round(189 - 149 * g) + ')' : '#F6D3BD';
        raysG.style.opacity = g.toFixed(2);
      }
      var ig = Math.round(interGlow * 20) / 20;
      if (ig !== shown.inter) {
        shown.inter = ig;
        inter.style.fill = ig > 0 ? '#A6E89A' : '#6BA36B';
        inter.setAttribute('r', (15 + 3 * ig).toFixed(1));
        inhP.setAttribute('stroke-width', (4 + 3 * ig).toFixed(1));
      }
    }

    /* endorfinas: salen de la interneurona y se unen a los receptores de las terminales */
    function addDot(t0) {
      var el = mk('circle', { r: 5, fill: COLORS.endo, stroke: '#fff', 'stroke-width': 1 }, dotsG), a = Math.random() * 6.283;
      var f = (nextRcp++ % 2) ? 'C' : 'Adelta', tg = RCP[f];
      var d = { type: 'endo', el: el, t: t0 || 0, dur: 1.6, ph: Math.random() * 6, x0: 562 + Math.cos(a) * 16, y0: 231 + Math.sin(a) * 16,
        x1: tg[0] - 3 + Math.random() * 6, y1: tg[1] - 7 - Math.random() * 3 };
      dots.push(d); moveDot(d);
    }

    /* sustancia P: cruza hacia la célula T, o queda frenada en la terminal cuando actúan las endorfinas */
    function addSP(f, blocked, t0) {
      var b = BOUTON[f];
      for (var i = 0; i < 2; i++) {
        var el = mk('circle', { r: 4, fill: COLORS.sp, stroke: '#8a6d00', 'stroke-width': 1 }, dotsG);
        var d = { type: blocked ? 'spx' : 'sp', el: el, t: t0 || 0, dur: blocked ? 1.1 : 0.7, ph: Math.random() * 6,
          x0: b[0] + 8, y0: b[1] - 4 + i * 8, x1: blocked ? b[0] + 18 : 700, y1: blocked ? b[1] - 5 + i * 10 : 306 + i * 10 };
        dots.push(d); moveDot(d);
      }
    }

    function moveDot(d) {
      var k = Math.min(1, d.t), x, y, op;
      if (d.type === 'endo') {
        var w = 5 * (1 - k);
        x = d.x0 + (d.x1 - d.x0) * k + Math.sin(d.t * 9 + d.ph) * w; y = d.y0 + (d.y1 - d.y0) * k + Math.cos(d.t * 7 + d.ph) * w;
        op = d.t < 0.1 ? d.t * 10 : (d.t > 1 ? Math.max(0, 1 - (d.t - 1) / 0.4) : 1);
        if (d.t >= 1.4) d.dead = true;
      } else if (d.type === 'sp') {
        x = d.x0 + (d.x1 - d.x0) * k; y = d.y0 + (d.y1 - d.y0) * k; op = k > 0.75 ? (1 - k) * 4 : 1;
        if (d.t >= 1) d.dead = true;
      } else {
        var e = Math.min(1, k * 2.5);
        x = d.x0 + (d.x1 - d.x0) * e + Math.sin(d.t * 30 + d.ph) * 1.5; y = d.y0 + (d.y1 - d.y0) * e; op = k > 0.6 ? (1 - k) * 2.5 : 1;
        if (d.t >= 1) d.dead = true;
      }
      if (d.dead) { if (d.el.parentNode) d.el.parentNode.removeChild(d.el); return; }
      d.el.setAttribute('cx', x.toFixed(1)); d.el.setAttribute('cy', y.toFixed(1)); d.el.setAttribute('opacity', op.toFixed(2));
    }

    function frame(now) {
      if (dead) return;
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
      if (playing && S) step(dt);
      raf = requestAnimationFrame(frame);
    }

    setState(opts.state || { nivel: 'sin-corriente' });
    raf = requestAnimationFrame(frame);

    return {
      setState: setState,
      play: function () { playing = true; },
      pause: function () { playing = false; },
      isPlaying: function () { return playing; },
      pulseCount: function () { return pulses.length + dots.length; },
      tick: function (dt) { if (S) step(dt); },
      stats: function () { return { brain: stats.brain, blocked: stats.blocked, inter: stats.inter }; },
      destroy: function () { dead = true; cancelAnimationFrame(raf); container.innerHTML = ''; }
    };
  }

  /* ---------- módulo ---------- */
  var LEVEL_BTNS = A.LEVELS.map(function (l) { return '<button data-v="' + l + '"' + (l === 'debil' ? ' class="on"' : '') + '>' + A.LEVEL_LABELS[l] + '</button>'; }).join('');

  var T1 =
    '<div class="card" style="grid-column:1/-1"><div class="scene" id="rcsc"></div>' +
    '<div class="row" style="justify-content:center"><button class="act alt" id="rcprev" type="button">← Anterior</button><span class="val" id="rcnum" style="min-width:110px;text-align:center"></span><button class="act" id="rcnext" type="button">Siguiente →</button><button class="act alt" id="rcpause" type="button">Pausar animación</button></div>' +
    '<h2 id="rctit" style="margin-top:6px"></h2><p id="rctxt" style="font-size:21px"></p></div>';

  var T2 =
    '<div class="card" style="grid-column:1/-1"><div class="scene" id="ptsc"></div></div>' +
    '<div class="card"><h2>Controles</h2>' +
    '<div class="row"><label>Modo</label><div class="seg" id="ptmode"><button data-v="100" class="on">Convencional (100 Hz)</button><button data-v="2">Baja frecuencia (2 Hz)</button></div></div>' +
    '<div class="row"><label>Frecuencia</label><input type="range" id="pthz" min="0" max="150" step="1" value="100"><span class="val" id="pthzv" style="min-width:80px"></span></div>' +
    '<div class="row"><label>Intensidad</label><div class="seg" id="ptlev">' + LEVEL_BTNS + '</div></div>' +
    '<div class="row"><button class="act alt" id="ptpause" type="button">Pausar animación</button></div>' +
    '<p class="note">Esquema didáctico: la clase no da miliamperios para cada umbral, por eso la intensidad es cualitativa.</p></div>' +
    '<div class="card"><h2>Qué pasa</h2><ul class="l"><li><b>Fibras activadas por la corriente:</b> <span id="ptfib"></span></li><li><b>Compuerta:</b> <span id="ptgate"></span></li><li><b>Endorfinas:</b> <span id="ptendo"></span></li><li><b>Dolor percibido:</b> <span id="ptpain"></span></li><li><b>Efecto:</b> <span id="pteff"></span></li></ul><div class="res warn" id="ptwarn" hidden></div></div>';

  var def = U.build({
    id: 'analgesia', title: '¿Cómo quita el dolor la corriente?', subtitle: 'Compuerta medular y endorfinas · esquema dinámico para proyección', accent: '#B5532A',
    css: '.scene{max-width:1100px;margin:0 auto}.scene svg{display:block;width:100%;height:auto;max-height:68vh;margin:0 auto}',
    tabs: [
      { title: 'Recorrido', html: T1, init: function (root) {
        var $ = function (id) { return root.getElementById(id); };
        var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
        var an = root.__an = { reduce: reduce, c1: { user: reduce, visible: true, scene: null }, c2: { user: reduce, visible: false, scene: null } };
        function refresh(c) { if (!c.scene) return; if (c.user || !c.visible) c.scene.pause(); else c.scene.play(); }
        an.refresh = refresh;
        an.c1.scene = makeScene($('rcsc'), { startPaused: reduce, state: A.STEPS[0].estado });
        var i = 0;
        function show() {
          var st = A.STEPS[i];
          $('rctit').textContent = st.titulo; $('rctxt').textContent = st.texto; $('rcnum').textContent = 'Paso ' + (i + 1) + ' de ' + A.STEPS.length;
          $('rcprev').disabled = i === 0; $('rcnext').disabled = i === A.STEPS.length - 1;
          an.c1.scene.setState(st.estado);
        }
        $('rcprev').addEventListener('click', function () { if (i > 0) { i--; show(); } });
        $('rcnext').addEventListener('click', function () { if (i < A.STEPS.length - 1) { i++; show(); } });
        $('rcpause').textContent = reduce ? 'Reanudar animación' : 'Pausar animación';
        $('rcpause').addEventListener('click', function () { an.c1.user = !an.c1.user; this.textContent = an.c1.user ? 'Reanudar animación' : 'Pausar animación'; refresh(an.c1); });
        [].forEach.call(root.querySelectorAll('nav.tabs button'), function (b) {
          b.addEventListener('click', function () {
            var t = b.getAttribute('data-t');
            an.c1.visible = t === 't1'; an.c2.visible = t === 't2'; refresh(an.c1); refresh(an.c2);
          });
        });
        show(); refresh(an.c1);
        return { destroy: function () { an.c1.scene.destroy(); } };
      } },
      { title: 'Pruébalo tú', html: T2, init: function (root) {
        var $ = function (id) { return root.getElementById(id); }, an = root.__an;
        an.c2.scene = makeScene($('ptsc'), { startPaused: true, state: { nivel: 'debil', hz: 100 } });
        var nivel = 'debil';
        var NAMES = { Abeta: 'Aβ', Adelta: 'Aδ', C: 'C' };
        function syncMode(hz) {
          [].forEach.call($('ptmode').children, function (b) { b.classList.toggle('on', +b.getAttribute('data-v') === hz); });
        }
        function upd() {
          var hz = +$('pthz').value, mode = A.modeFor(hz), act = nivel === 'sin-corriente' ? [] : A.activeFibers(nivel), gate = A.gateState(nivel, hz), endo = A.endorphins(hz, nivel), pain = A.painPerceived(nivel, hz), ons = A.onset(mode), w = A.warning(nivel);
          an.c2.scene.setState({ nivel: nivel, hz: hz });
          $('ptfib').textContent = act.length ? act.map(function (f) { return NAMES[f]; }).join(', ') : 'ninguna';
          $('ptgate').textContent = nivel === 'sin-corriente' ? 'abierta (no hay corriente)' : ({ abierta: 'abierta', parcial: 'a medias', cerrada: 'cerrada' }[gate] + (mode === 'acupuntura' ? ' (aquí actúan las endorfinas, no la compuerta)' : ''));
          $('ptendo').textContent = endo ? 'sí: se liberan endorfinas y encefalinas y se bloquea la sustancia P' : 'no';
          $('ptpain').textContent = pain;
          $('pteff').textContent = nivel === 'sin-corriente' ? 'sin corriente no hay efecto' : (ons ? ('inicio ' + ons.inicio + ' · dura ' + ons.duracion) : 'frecuencia fuera de las tablas de la clase (convencional 80–120 Hz; baja frecuencia 1–20 Hz): el efecto no está garantizado');
          $('ptwarn').hidden = !w; $('ptwarn').textContent = w || '';
        }
        U.seg($('ptmode'), function (v) { $('pthz').value = v; $('pthzv').textContent = v + ' Hz'; upd(); });
        U.slider(root, 'pthz', function (v) { return v + ' Hz'; }, function (v) { syncMode(v); upd(); });
        U.seg($('ptlev'), function (v) { nivel = v; upd(); });
        $('ptpause').textContent = an.reduce ? 'Reanudar animación' : 'Pausar animación';
        $('ptpause').addEventListener('click', function () { an.c2.user = !an.c2.user; this.textContent = an.c2.user ? 'Reanudar animación' : 'Pausar animación'; an.refresh(an.c2); });
        upd(); an.refresh(an.c2);
        return { destroy: function () { an.c2.scene.destroy(); } };
      } },
      { title: 'Preguntas', html: U.caseHtml('an'), init: function (root) {
        U.cases(root, 'ancases', A.CASES, { resp: { label: '¿Cuál es la explicación?', type: 'select', options: A.OPTIONS } });
      } }
    ]
  });
  LabCore.register(def);
})();
