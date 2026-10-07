export type Pc = {
  slug: string;
  name: string;
  maker: string;
  condition: string;
  cpu: string;
  cores: number;
  threads: number;
  memoryGb: number;
  storageGb: number;
  lan: string;
  wifi: string;
  display4k60: string;
  bodyPriceJpy: number | null;
  extrasJpy: number | null;
  totalJpy: number | null;
  powerIdleW: number | null;
  powerLoadW: number | null;
  budgetStatus: 'within' | 'over' | 'research';
  dataStatus: 'measured' | 'mixed' | 'shop' | 'research';
  checkedAt: string;
  sourceLabel: string;
  note: string;
};

const modules = import.meta.glob('../data/pcs/*.json', { eager: true, import: 'default' }) as Record<string, Pc>;

export const pcs = Object.values(modules).sort((a, b) => {
  const rank = (value: Pc['budgetStatus']) => value === 'within' ? 0 : value === 'research' ? 1 : 2;
  return rank(a.budgetStatus) - rank(b.budgetStatus) || (a.totalJpy ?? 999999) - (b.totalJpy ?? 999999);
});

export const formatYen = (value: number | null) =>
  value === null ? '調査中' : new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(value);

export const budgetLabel = (status: Pc['budgetStatus']) =>
  status === 'within' ? '10万円以内' : status === 'over' ? '予算超過・参考' : '価格調査中';

export const dataLabel = (status: Pc['dataStatus']) =>
  status === 'measured' ? '実測' : status === 'mixed' ? '一部実測/確認値' : status === 'shop' ? '販売情報' : '調査中';
