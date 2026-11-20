const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const SELF = path.join(__dirname, 'no-brands.test.js');
const BAD = /BTL|Premium|4110|Chattanooga|Ibramed|Intelect|Sonopuls|Enraf|Gymna|pantalla del equipo|Equipo:/i;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === 'node_modules' ? [] : walk(p);
    return /\.(js|css|html|md)$/.test(e.name) && p !== SELF ? [p] : [];
  });
}

test('ningún archivo de laboratorio menciona marcas ni equipos específicos', () => {
  const hits = [];
  for (const f of walk(ROOT)) {
    fs.readFileSync(f, 'utf8').split(/\r?\n/).forEach((l, i) => {
      if (BAD.test(l)) hits.push(path.relative(ROOT, f) + ':' + (i + 1) + ' ' + l.trim().slice(0, 80));
    });
  }
  assert.deepEqual(hits, []);
});
