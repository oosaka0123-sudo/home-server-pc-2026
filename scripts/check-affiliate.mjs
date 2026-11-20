import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const pcDir = path.resolve('src/data/pcs');
const runtimePath = path.join(dist, 'valuecommerce.runtime.json');
const errors = [];

if (!fs.existsSync(runtimePath)) {
  errors.push('Missing dist/valuecommerce.runtime.json');
} else {
  const runtime = JSON.parse(fs.readFileSync(runtimePath, 'utf8'));
  if (runtime.enabled !== true) errors.push('ValueCommerce runtime must be enabled');
  if (!/^\d+$/.test(String(runtime.pid ?? ''))) errors.push('ValueCommerce runtime PID must be numeric');
}

const pcFiles = fs.readdirSync(pcDir).filter((name) => name.endsWith('.json'));
for (const file of pcFiles) {
  const pc = JSON.parse(fs.readFileSync(path.join(pcDir, file), 'utf8'));
  if (typeof pc.yahooQuery !== 'string' || !pc.yahooQuery.trim()) {
    errors.push(`${file}: yahooQuery is required for every main PC`);
    continue;
  }

  const htmlPath = path.join(dist, 'pcs', pc.slug, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    errors.push(`${file}: built detail page missing for ${pc.slug}`);
    continue;
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const expectedHref = `https://shopping.yahoo.co.jp/search?p=${encodeURIComponent(pc.yahooQuery)}`;
  if (!html.includes('data-affiliate-box')) errors.push(`${file}: affiliate box missing`);
  if (!html.includes('data-linkswitch-cta')) errors.push(`${file}: LinkSwitch CTA marker missing`);
  if (!html.includes('class="pr-label"')) errors.push(`${file}: PR disclosure missing`);
  if (!html.includes('rel="sponsored nofollow noopener"')) errors.push(`${file}: sponsored link rel missing`);
  if (!html.includes(expectedHref.replaceAll('&', '&amp;')) && !html.includes(expectedHref)) {
    errors.push(`${file}: Yahoo! Shopping URL missing or does not match yahooQuery`);
  }
}

if (errors.length) {
  for (const error of errors) console.error('ERROR', error);
  process.exit(1);
}

console.log(`Affiliate QA passed: LinkSwitch runtime enabled and ${pcFiles.length} PC detail pages have PR-marked Yahoo! Shopping CTAs`);
