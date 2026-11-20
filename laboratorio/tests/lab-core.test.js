const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../js/lab-core.js');

test('GROUPS: 4 grupos, 18 agentes, ids únicos', () => {
  assert.equal(C.GROUPS.length, 4);
  const ids = C.GROUPS.flatMap(g => g.agents.map(a => a.id));
  assert.equal(ids.length, 18);
  assert.equal(new Set(ids).size, 18);
});

test('portadaGroups([]): todos ready:false', () => {
  const all = C.portadaGroups([]).flatMap(g => g.agents);
  assert.equal(all.length, 18);
  assert.ok(all.every(a => a.ready === false));
});

test('portadaGroups(["laser"]): solo láser queda ready', () => {
  const ready = C.portadaGroups(['laser']).flatMap(g => g.agents).filter(a => a.ready);
  assert.deepEqual(ready.map(a => a.id), ['laser']);
});

test('parseHash: id conocido, desconocido, vacío y solo #', () => {
  assert.equal(C.parseHash('#laser', ['laser']), 'laser');
  assert.equal(C.parseHash('#zzz', ['laser']), null);
  assert.equal(C.parseHash('', ['laser']), null);
  assert.equal(C.parseHash('#', ['laser']), null);
});

test('register: repetir un id lanza; registered() conserva el orden', () => {
  C.register({ id: '__t1', title: 'a', css: '', html: '' });
  C.register({ id: '__t2', title: 'b', css: '', html: '' });
  assert.throws(() => C.register({ id: '__t1', title: 'x', css: '', html: '' }));
  const r = C.registered();
  assert.ok(r.indexOf('__t1') > -1 && r.indexOf('__t1') < r.indexOf('__t2'));
  assert.equal(C.getDef('__t2').title, 'b');
  assert.equal(C.getDef('nada'), undefined);
});

function fakeMount(log) {
  return id => {
    if (id === 'zzz') return null;
    log.push('mount ' + id);
    return { destroy() { log.push('destroy ' + id); } };
  };
}

test('controlador: abrir, cambiar y cerrar destruye lo anterior', () => {
  const log = [], c = C.createController(fakeMount(log));
  assert.equal(c.open('a'), true);
  assert.equal(c.current(), 'a');
  assert.equal(c.open('b'), true);
  assert.deepEqual(log, ['mount a', 'destroy a', 'mount b']);
  c.close();
  assert.equal(c.current(), null);
  assert.deepEqual(log.slice(3), ['destroy b']);
});

test('controlador: id desconocido devuelve false, destruye lo anterior y deja la portada', () => {
  const log = [], c = C.createController(fakeMount(log));
  c.open('a');
  assert.equal(c.open('zzz'), false);
  assert.equal(c.current(), null);
  assert.deepEqual(log, ['mount a', 'destroy a']);
});

test('controlador: reabrir el mismo id no acumula montajes', () => {
  const log = [], c = C.createController(fakeMount(log));
  c.open('a'); c.open('a');
  assert.deepEqual(log, ['mount a', 'destroy a', 'mount a']);
});
