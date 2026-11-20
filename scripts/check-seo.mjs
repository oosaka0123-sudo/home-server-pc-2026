import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const errors = [];
const mustExist = [
  'robots.txt',
  'sitemap-index.xml',
  'BingSiteAuth.xml',
  'google10b52f5d3ce8d9fd.html',
  'og-default.png'
];

for (const rel of mustExist) {
  if (!fs.existsSync(path.join(dist, rel))) errors.push(`Missing SEO asset: dist/${rel}`);
}

const robotsPath = path.join(dist, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!robots.includes('Sitemap: https://oosaka0123-sudo.github.io/home-server-pc-2026/sitemap-index.xml')) {
    errors.push('robots.txt sitemap URL is incorrect');
  }
}

const sitemapPath = path.join(dist, 'sitemap-index.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  if (!sitemap.includes('https://oosaka0123-sudo.github.io/home-server-pc-2026/')) {
    errors.push('sitemap-index.xml does not contain the production base URL');
  }
}

const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(dist);

for (const file of htmlFiles) {
  const rel = path.relative(dist, file).replaceAll('\\\\', '/');
  if (/^google[0-9a-f]+\.html$/i.test(rel)) continue;
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('<link rel="canonical"')) errors.push(`${path.relative(dist,file)}: canonical missing`);
  if (!html.includes('application/ld+json')) errors.push(`${path.relative(dist,file)}: structured data missing`);
  if (!html.includes('property="og:title"')) errors.push(`${path.relative(dist,file)}: og:title missing`);
  if (!html.includes('name="twitter:card"')) errors.push(`${path.relative(dist,file)}: twitter card missing`);
}

if (errors.length) {
  for (const error of errors) console.error('ERROR', error);
  process.exit(1);
}
console.log(`SEO QA passed: ${htmlFiles.length} HTML pages + verification/sitemap assets`);
