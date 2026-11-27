// HomeLedger data: the sample household, its budgets, bills, goals and
// transactions. Everything here is invented sample content written for this
// site; the household, the people and the figures are fictional.

export const HOUSEHOLD = {
  name: 'The Rivera Household',
  members: ['Mara Rivera', 'Dev Rivera', 'June Rivera', 'Theo Rivera'],
  home: 'Maple Street, 3 bedrooms',
  currency: 'USD',
  months: ['2026-10', '2026-11', '2026-12'],
  currentMonth: '2026-11',
};

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#1d4d3b', icon: '⌂' },
  { id: 'groceries', label: 'Groceries', color: '#5b8c5a', icon: '◍' },
  { id: 'transport', label: 'Transport', color: '#e8a33d', icon: '➤' },
  { id: 'utilities', label: 'Utilities', color: '#4a7fa5', icon: '⚡' },
  { id: 'dining', label: 'Dining Out', color: '#c96f4a', icon: '✦' },
  { id: 'kids', label: 'Kids & School', color: '#8a6fb8', icon: '✎' },
  { id: 'health', label: 'Health', color: '#3d8b7a', icon: '+' },
  { id: 'fun', label: 'Fun & Treats', color: '#d97b9c', icon: '♪' },
  { id: 'other', label: 'Everything Else', color: '#8a8a7a', icon: '•' },
];

export const MONTHLY_BUDGETS = {
  housing: 1450,
  groceries: 640,
  transport: 310,
  utilities: 265,
  dining: 220,
  kids: 280,
  health: 150,
  fun: 180,
  other: 120,
};

export const INCOME_SOURCES = [
  { id: 'salary-mara', label: "Mara's salary — Northside Clinic", amount: 2950, day: 1 },
  { id: 'salary-dev', label: "Dev's salary — Harbor Logistics", amount: 1900, day: 15 },
  { id: 'freelance', label: 'Weekend repair jobs', amount: 420, day: 20 },
];

// Recurring bills. `day` is the day of the month the bill is due.
export const BILLS = [
  { id: 'rent', label: 'Rent — Maple Street house', amount: 1450, day: 3, category: 'housing', autopay: true },
  { id: 'electric', label: 'City Power & Light', amount: 118, day: 8, category: 'utilities', autopay: true },
  { id: 'water', label: 'Water & sewer', amount: 64, day: 10, category: 'utilities', autopay: false },
  { id: 'internet', label: 'Fiber internet 500 Mbps', amount: 59, day: 12, category: 'utilities', autopay: true },
  { id: 'phones', label: 'Family mobile plan (4 lines)', amount: 112, day: 15, category: 'utilities', autopay: true },
  { id: 'car', label: 'Car payment — 2021 hatchback', amount: 286, day: 18, category: 'transport', autopay: true },
  { id: 'insurance', label: 'Home + car insurance', amount: 174, day: 21, category: 'housing', autopay: false },
  { id: 'school', label: 'June & Theo school lunch plan', amount: 96, day: 5, category: 'kids', autopay: false },
  { id: 'gym', label: 'Neighborhood gym (family)', amount: 48, day: 25, category: 'health', autopay: false },
  { id: 'streaming', label: 'Streaming bundle', amount: 24, day: 28, category: 'fun', autopay: true },
];

export const GOALS = [
  { id: 'emergency', label: 'Emergency cushion — 3 months of bills', target: 9000, saved: 6120, note: '$180 a month, every payday' },
  { id: 'caravan', label: 'Summer caravan trip to the coast', target: 2400, saved: 1480, note: 'Leave 12 July 2027 — 8 nights' },
  { id: 'roof', label: 'New roof before the rainy season', target: 5200, saved: 2340, note: 'Quotes in: $4,800 – $5,600' },
  { id: 'bike', label: "Theo's birthday bike", target: 320, saved: 275, note: 'Birthday is 14 December' },
];

// Transactions: [month, day, label, category, amount, kind]
// kind is 'out' (spending) or 'in' (income). Amounts are dollars.
const RAW_TRANSACTIONS = [
  // ---- November 2026 ----
  ['2026-11', 1, "Mara's salary — Northside Clinic", 'other', 2950, 'in'],
  ['2026-11', 1, 'Saturday market — vegetables & fruit', 'groceries', 86, 'out'],
  ['2026-11', 2, 'Corner Bakery — bread & rolls', 'groceries', 18, 'out'],
  ['2026-11', 3, 'Rent — Maple Street house', 'housing', 1450, 'out'],
  ['2026-11', 3, 'Weekly shop — GreenMart', 'groceries', 142, 'out'],
  ['2026-11', 4, 'Petrol — Harbor Fuels', 'transport', 52, 'out'],
  ['2026-11', 5, 'School lunch plan — June & Theo', 'kids', 96, 'out'],
  ['2026-11', 6, 'Pizza night — Luigis', 'dining', 34, 'out'],
  ['2026-11', 7, 'Weekly shop — GreenMart', 'groceries', 128, 'out'],
  ['2026-11', 8, 'City Power & Light', 'utilities', 118, 'out'],
  ['2026-11', 9, 'June new school shoes', 'kids', 58, 'out'],
  ['2026-11', 10, 'Water & sewer', 'utilities', 64, 'out'],
  ['2026-11', 11, 'Pharmacy — cough syrup & plasters', 'health', 27, 'out'],
  ['2026-11', 12, 'Fiber internet 500 Mbps', 'utilities', 59, 'out'],
  ['2026-11', 13, 'Takeaway tacos — Friday treat', 'dining', 41, 'out'],
  ['2026-11', 14, 'Weekly shop — GreenMart', 'groceries', 156, 'out'],
  ['2026-11', 15, "Dev's salary — Harbor Logistics", 'other', 1900, 'in'],
  ['2026-11', 15, 'Family mobile plan (4 lines)', 'utilities', 112, 'out'],
  ['2026-11', 16, 'Bus passes — Mara & Dev', 'transport', 64, 'out'],
  ['2026-11', 17, 'Theo football boots', 'kids', 46, 'out'],
  ['2026-11', 18, 'Car payment — 2021 hatchback', 'transport', 286, 'out'],
  ['2026-11', 19, 'Cinema — family film night', 'fun', 52, 'out'],
  ['2026-11', 20, 'Weekend repair jobs', 'other', 420, 'in'],
  ['2026-11', 20, 'Weekly shop — GreenMart', 'groceries', 134, 'out'],
  ['2026-11', 21, 'Home + car insurance', 'housing', 174, 'out'],
  ['2026-11', 22, 'Dentist check-up — Dev', 'health', 85, 'out'],
  ['2026-11', 23, 'Petrol — Harbor Fuels', 'transport', 48, 'out'],
  ['2026-11', 24, 'Birthday gift — Aunt Rosa', 'other', 35, 'out'],
  ['2026-11', 25, 'Neighborhood gym (family)', 'health', 48, 'out'],
  ['2026-11', 26, 'Thanksgiving groceries — turkey & trimmings', 'groceries', 74, 'out'],
  ['2026-11', 27, 'Black Friday — winter coats for the kids', 'kids', 119, 'out'],
  // ---- October 2026 ----
  ['2026-10', 1, "Mara's salary — Northside Clinic", 'other', 2950, 'in'],
  ['2026-10', 2, 'Weekly shop — GreenMart', 'groceries', 138, 'out'],
  ['2026-10', 3, 'Rent — Maple Street house', 'housing', 1450, 'out'],
  ['2026-10', 5, 'School lunch plan — June & Theo', 'kids', 96, 'out'],
  ['2026-10', 8, 'City Power & Light', 'utilities', 121, 'out'],
  ['2026-10', 9, 'Weekly shop — GreenMart', 'groceries', 147, 'out'],
  ['2026-10', 10, 'Water & sewer', 'utilities', 61, 'out'],
  ['2026-10', 12, 'Fiber internet 500 Mbps', 'utilities', 59, 'out'],
  ['2026-10', 13, 'Halloween pumpkins & sweets', 'fun', 38, 'out'],
  ['2026-10', 15, "Dev's salary — Harbor Logistics", 'other', 1900, 'in'],
  ['2026-10', 15, 'Family mobile plan (4 lines)', 'utilities', 112, 'out'],
  ['2026-10', 16, 'Weekly shop — GreenMart', 'groceries', 151, 'out'],
  ['2026-10', 18, 'Car payment — 2021 hatchback', 'transport', 286, 'out'],
  ['2026-10', 20, 'Weekend repair jobs', 'other', 385, 'in'],
  ['2026-10', 21, 'Home + car insurance', 'housing', 174, 'out'],
  ['2026-10', 23, 'Weekly shop — GreenMart', 'groceries', 129, 'out'],
  ['2026-10', 24, 'Petrol — Harbor Fuels', 'transport', 55, 'out'],
  ['2026-10', 25, 'Neighborhood gym (family)', 'health', 48, 'out'],
  ['2026-10', 27, 'School trip — June science museum', 'kids', 42, 'out'],
  ['2026-10', 30, 'Takeaway — end of month pizza', 'dining', 36, 'out'],
  // ---- December 2026 (planned so far) ----
  ['2026-12', 1, "Mara's salary — Northside Clinic", 'other', 2950, 'in'],
  ['2026-12', 3, 'Rent — Maple Street house', 'housing', 1450, 'out'],
  ['2026-12', 5, 'School lunch plan — June & Theo', 'kids', 96, 'out'],
  ['2026-12', 8, 'City Power & Light', 'utilities', 118, 'out'],
  ['2026-12', 10, 'Christmas tree & lights', 'fun', 64, 'out'],
  ['2026-12', 14, "Theo's birthday bike — balance", 'kids', 275, 'out'],
  ['2026-12', 15, "Dev's salary — Harbor Logistics", 'other', 1900, 'in'],
];

export const SAMPLE_TRANSACTIONS = RAW_TRANSACTIONS.map(
  ([month, day, label, category, amount, kind], i) => ({
    id: `t${i + 1}`,
    month,
    day,
    label,
    category,
    amount,
    kind,
  }),
);

export const TIPS = [
  {
    title: 'Groceries: shop the list, not the aisles',
    body: 'The Riveras spend $640 a month on groceries. A written list and one big weekly shop instead of five small trips saves most families about $60 a month — the small trips are where the extras sneak in.',
  },
  {
    title: 'The 24-hour rule for treats',
    body: 'Anything over $40 that is not a bill waits a day. Half the time nobody wants it the next morning. The Riveras use it for toys, gadgets and sale clothes.',
  },
  {
    title: 'Pay yourself on payday',
    body: 'Move the savings the morning the salary lands, before the spending starts. The Riveras move $180 to the emergency cushion on the 1st of every month — it is a bill, not a leftover.',
  },
  {
    title: 'One streaming bundle, not four',
    body: 'Four separate subscriptions quietly add up to more than $50 a month. The Riveras keep one $24 bundle and rotate the others one month at a time.',
  },
  {
    title: 'Check the autopay dates',
    body: 'Six of the household bills are on autopay. Check the dates once a month so a big bill never lands the day before payday.',
  },
];

// ---- tiny store: localStorage, with the sample data as the starting point ----
const STORAGE_KEY = 'homeledger-state-v1';

export function defaultState() {
  return {
    month: HOUSEHOLD.currentMonth,
    transactions: SAMPLE_TRANSACTIONS,
    budgets: { ...MONTHLY_BUDGETS },
    paidBills: { '2026-11': ['rent', 'electric', 'water', 'internet', 'school'] },
    goals: GOALS.map((g) => ({ ...g })),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return defaultState();
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable: the site still works for this visit.
  }
}

export function resetState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to remove.
  }
  return defaultState();
}
