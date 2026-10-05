import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('src/data/pcs');
const files = fs.readdirSync(dir).filter((name) => name.endsWith('.json'));
const allowedBudget = new Set(['within', 'over', 'research']);
const allowedData = new Set(['measured', 'mixed', 'shop', 'research']);
const required = ['slug','name','maker','condition','cpu','cores','threads','memoryGb','storageGb','lan','wifi','display4k60','budgetStatus','dataStatus','checkedAt','sourceLabel','note'];
const slugs = new Set();
const errors = [];
const warnings = [];

for (const file of files) {
  const pc = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  for (const key of required) {
    if (pc[key] === undefined || pc[key] === '') errors.push(`${file}: missing ${key}`);
  }
  if (slugs.has(pc.slug)) errors.push(`${file}: duplicate slug ${pc.slug}`);
  slugs.add(pc.slug);
  if (!allowedBudget.has(pc.budgetStatus)) errors.push(`${file}: invalid budgetStatus`);
  if (!allowedData.has(pc.dataStatus)) errors.push(`${file}: invalid dataStatus`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(pc.checkedAt)) errors.push(`${file}: checkedAt must be YYYY-MM-DD`);
  if (!Number.isInteger(pc.cores) || pc.cores < 8) errors.push(`${file}: cores must be >= 8`);
  if (!Number.isInteger(pc.threads) || pc.threads < pc.cores) errors.push(`${file}: invalid threads`);
  if (pc.memoryGb < 32) warnings.push(`${file}: memory below 32GB recommendation`);
  if (pc.storageGb < 512) errors.push(`${file}: storage below 512GB baseline`);
  if (pc.powerIdleW !== null && pc.powerIdleW <= 0) errors.push(`${file}: invalid powerIdleW`);
  if (pc.powerLoadW !== null && pc.powerLoadW <= 0) errors.push(`${file}: invalid powerLoadW`);

  if ([pc.bodyPriceJpy, pc.extrasJpy, pc.totalJpy].every(Number.isFinite)) {
    if (pc.bodyPriceJpy + pc.extrasJpy !== pc.totalJpy) errors.push(`${file}: totalJpy must equal bodyPriceJpy + extrasJpy`);
  }
  if (pc.budgetStatus === 'within' && !(Number.isFinite(pc.totalJpy) && pc.totalJpy <= 100000)) {
    errors.push(`${file}: within requires totalJpy <= 100000`);
  }
  if (pc.budgetStatus === 'over' && !(Number.isFinite(pc.totalJpy) && pc.totalJpy > 100000)) {
    errors.push(`${file}: over requires totalJpy > 100000`);
  }
  if (pc.budgetStatus === 'research') warnings.push(`${file}: research entry remains incomplete`);
}

for (const warning of warnings) console.warn('WARN', warning);
if (errors.length) {
  for (const error of errors) console.error('ERROR', error);
  process.exit(1);
}
console.log(`PC data validation passed: ${files.length} files, ${warnings.length} warning(s)`);
