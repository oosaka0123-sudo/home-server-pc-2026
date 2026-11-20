import fs from 'node:fs';
import path from 'node:path';

const pcDir = path.resolve('src/data/pcs');
const publicDir = path.resolve('public');
const files = fs.readdirSync(pcDir).filter((name) => name.endsWith('.json'));
const allowedBudget = new Set(['within', 'over', 'research']);
const allowedData = new Set(['measured', 'mixed', 'shop', 'research']);
const allowedImageKind = new Set(['manufacturer', 'original']);
const required = ['slug','name','maker','condition','cpu','cores','threads','memoryGb','storageGb','lan','wifi','display4k60','budgetStatus','dataStatus','checkedAt','sourceLabel','note','image','imageAlt','imageCredit','imageSourceUrl','imageCheckedAt','imageKind','yahooQuery'];
const slugs = new Set();
const errors = [];
const warnings = [];

function validateLocalImage(owner, image, checkedAt, kind, sourceUrl) {
  if (typeof image !== 'string' || !/^images\/.+\.(?:jpe?g|png|webp|avif)$/i.test(image)) {
    errors.push(`${owner}: image must be a local public/images path`);
    return;
  }
  const imagePath = path.join(publicDir, image);
  if (!fs.existsSync(imagePath)) {
    errors.push(`${owner}: image file not found: public/${image}`);
  } else if (fs.statSync(imagePath).size < 1000) {
    errors.push(`${owner}: image file is unexpectedly small: public/${image}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkedAt ?? '')) errors.push(`${owner}: imageCheckedAt must be YYYY-MM-DD`);
  if (!allowedImageKind.has(kind)) errors.push(`${owner}: invalid imageKind`);
  if (!/^https:\/\//.test(sourceUrl ?? '')) errors.push(`${owner}: imageSourceUrl must use https`);
}

for (const file of files) {
  const pc = JSON.parse(fs.readFileSync(path.join(pcDir, file), 'utf8'));
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
  validateLocalImage(file, pc.image, pc.imageCheckedAt, pc.imageKind, pc.imageSourceUrl);
  if (typeof pc.yahooQuery !== 'string' || !pc.yahooQuery.trim()) {
    errors.push(`${file}: yahooQuery is required and must be non-empty`);
  }

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

const usedLaptopPath = path.resolve('src/data/used-laptops.json');
const usedLaptops = JSON.parse(fs.readFileSync(usedLaptopPath, 'utf8'));
if (!Array.isArray(usedLaptops) || usedLaptops.length === 0) {
  errors.push('used-laptops.json: at least one candidate is required');
} else {
  for (const laptop of usedLaptops) {
    const owner = `used-laptops.json: ${laptop.name ?? 'unnamed'}`;
    for (const key of ['name','image','imageAlt','imageCredit','imageSourceUrl','imageCheckedAt','imageKind','cpu','memory','role','note']) {
      if (laptop[key] === undefined || laptop[key] === '') errors.push(`${owner}: missing ${key}`);
    }
    validateLocalImage(owner, laptop.image, laptop.imageCheckedAt, laptop.imageKind, laptop.imageSourceUrl);
  }
}

for (const warning of warnings) console.warn('WARN', warning);
if (errors.length) {
  for (const error of errors) console.error('ERROR', error);
  process.exit(1);
}
console.log(`PC data validation passed: ${files.length} main PCs + ${usedLaptops.length} used laptops, ${warnings.length} warning(s)`);
