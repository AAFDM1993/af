/* Núcleo del Laboratorio de Agentes Físicos: registro, ruteo y montaje de módulos. */
var LabCore = (function () {
  var GROUPS = [
    { id: 'calor-frio', title: 'Calor y frío', agents: [
      { id: 'chc', title: 'CHC' },
      { id: 'parafina', title: 'Parafina' },
      { id: 'crioterapia', title: 'Crioterapia' }] },
    { id: 'luz-agua', title: 'Luz y agua', agents: [
      { id: 'fototerapia', title: 'Fototerapia' },
      { id: 'hidroterapia', title: 'Hidroterapia' }] },
    { id: 'ultrasonido-laser', title: 'Ultrasonido y láser', agents: [
      { id: 'ultrasonido', title: 'Ultrasonido' },
      { id: 'laser', title: 'Láser' }] },
    { id: 'electroterapia', title: 'Electroterapia', agents: [
      { id: 'analgesia', title: '¿Cómo quita el dolor?' },
      { id: 'galvanica', title: 'Galvánica y Trabert' },
      { id: 'diadinamicas', title: 'Diadinámicas' },
      { id: 'alto-voltaje', title: 'Alto voltaje (CPAV)' },
      { id: 'microcorrientes', title: 'Microcorrientes' },
      { id: 'exponenciales', title: 'Exponenciales' },
      { id: 'vms', title: 'VMS' },
      { id: 'tens', title: 'TENS' },
      { id: 'ems', title: 'EMS' },
      { id: 'interferencial', title: 'Interferencial' },
      { id: 'kotz', title: 'Kotz' }] }
  ];

  var defs = {}, order = [];

  function register(def) {
    if (Object.prototype.hasOwnProperty.call(defs, def.id)) throw new Error('Módulo ya registrado: ' + def.id);
    defs[def.id] = def;
    order.push(def.id);
  }
  function registered() { return order.slice(); }
  function getDef(id) { return Object.prototype.hasOwnProperty.call(defs, id) ? defs[id] : undefined; }

  function portadaGroups(registeredIds) {
    return GROUPS.map(function (g) {
      return { id: g.id, title: g.title, agents: g.agents.map(function (a) {
        return { id: a.id, title: a.title, ready: registeredIds.indexOf(a.id) > -1 };
      }) };
    });
  }

  function parseHash(hash, knownIds) {
    var id = String(hash || '').replace(/^#/, '');
    return id && knownIds.indexOf(id) > -1 ? id : null;
  }

  function createController(mountFn) {
    var cur = null, handle = null;
    function drop() {
      if (handle && handle.destroy) handle.destroy();
      handle = null; cur = null;
    }
    return {
      open: function (id) {
        drop();
        var h = mountFn(id);
        if (!h) return false;
        handle = h; cur = id;
        return true;
      },
      close: drop,
      current: function () { return cur; }
    };
  }

  /* Solo navegador: monta un módulo en un Shadow DOM (aísla IDs y CSS). */
  function mountInShadow(hostEl, def) {
    var root = hostEl.attachShadow({ mode: 'open' });
    var st = document.createElement('style');
    st.textContent = def.css || '';
    var wrap = document.createElement('div');
    wrap.className = 'lab';
    wrap.innerHTML = def.html || '';
    root.appendChild(st);
    root.appendChild(wrap);
    var inner = def.init ? def.init(root) : null;
    return {
      destroy: function () {
        if (inner && inner.destroy) inner.destroy();
        root.innerHTML = '';
      }
    };
  }

  return { GROUPS: GROUPS, register: register, registered: registered, getDef: getDef,
    portadaGroups: portadaGroups, parseHash: parseHash, createController: createController,
    mountInShadow: mountInShadow };
})();
if (typeof module !== 'undefined') module.exports = LabCore;
