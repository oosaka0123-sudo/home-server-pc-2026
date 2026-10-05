import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const base = '/home-server-pc-2026/';
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(dist);

const missing = new Set();
let checked = 0;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const values = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const value of values) {
    if (!value.startsWith(base)) continue;
    const clean = decodeURIComponent(value.split('#')[0].split('?')[0]);
    const rel = clean.slice(base.length);
    if (!rel) {
      checked++;
      if (!fs.existsSync(path.join(dist, 'index.html'))) missing.add(value);
      continue;
    }
    const direct = path.join(dist, rel);
    const index = path.join(dist, rel, 'index.html');
    checked++;
    if (!fs.existsSync(direct) && !fs.existsSync(index)) missing.add(value);
  }
}

if (missing.size) {
  for (const value of missing) console.error('BROKEN', value);
  process.exit(1);
}
console.log(`Internal link check passed: ${checked} references across ${htmlFiles.length} HTML files`);
