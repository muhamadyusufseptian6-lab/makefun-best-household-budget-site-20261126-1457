// HomeLedger views: one renderer per page. Each renderer takes the state
// and returns HTML; main.js wires the buttons afterwards.

import { CATEGORIES, HOUSEHOLD, INCOME_SOURCES, BILLS, TIPS } from './data.js';
import { money, donutChart, budgetBar, goalBar } from './charts.js';

export function monthLabel(month) {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function categoryOf(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

export function monthTransactions(state, month) {
  return state.transactions
    .filter((t) => t.month === month)
    .sort((a, b) => b.day - a.day || b.id.localeCompare(a.id));
}

export function monthTotals(state, month) {
  const txs = state.transactions.filter((t) => t.month === month);
  const income = txs.filter((t) => t.kind === 'in').reduce((s, t) => s + t.amount, 0);
  const spent = txs.filter((t) => t.kind === 'out').reduce((s, t) => s + t.amount, 0);
  return { income, spent, left: income - spent, rate: income > 0 ? Math.round(((income - spent) / income) * 100) : 0 };
}

export function spentByCategory(state, month) {
  const out = {};
  for (const t of state.transactions) {
    if (t.month === month && t.kind === 'out') out[t.category] = (out[t.category] || 0) + t.amount;
  }
  return out;
}

function monthNav(state) {
  const idx = HOUSEHOLD.months.indexOf(state.month);
  const prev = HOUSEHOLD.months[idx - 1];
  const next = HOUSEHOLD.months[idx + 1];
  return `<div class="month-nav">
    <button class="month-btn" data-action="month" data-month="${prev || ''}" ${prev ? '' : 'disabled'} aria-label="Previous month">‹ Prev</button>
    <span class="month-current">${monthLabel(state.month)}</span>
    <button class="month-btn" data-action="month" data-month="${next || ''}" ${next ? '' : 'disabled'} aria-label="Next month">Next ›</button>
  </div>`;
}

function txRow(t) {
  const cat = categoryOf(t.category);
  const sign = t.kind === 'in' ? '+' : '−';
  const cls = t.kind === 'in' ? 'amount in' : 'amount out';
  return `<li class="tx-row">
    <span class="tx-day">${t.day}</span>
    <span class="tx-cat" style="background:${cat.color}" title="${esc(cat.label)}">${cat.icon}</span>
    <span class="tx-label">${esc(t.label)}<small>${esc(cat.label)}</small></span>
    <span class="${cls}">${sign}${money(t.amount)}</span>
    <button class="tx-del" data-action="delete-tx" data-id="${t.id}" aria-label="Delete ${esc(t.label)}">×</button>
  </li>`;
}

function addTxForm(state) {
  const options = CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join('');
  return `<form class="add-form" id="add-tx-form">
    <h3>Add a transaction</h3>
    <label>What was it?
      <input type="text" name="label" required maxlength="80" placeholder="e.g. Weekly shop — GreenMart">
    </label>
    <div class="form-row">
      <label>Amount ($)
        <input type="number" name="amount" required min="0.01" step="0.01" placeholder="42.50">
      </label>
      <label>Day of month
        <input type="number" name="day" required min="1" max="31" value="27">
      </label>
    </div>
    <div class="form-row">
      <label>Category
        <select name="category">${options}</select>
      </label>
      <label>Type
        <select name="kind"><option value="out">Spending</option><option value="in">Income</option></select>
      </label>
    </div>
    <button type="submit" class="btn primary">Add to ${monthLabel(state.month)}</button>
  </form>`;
}

export function renderDashboard(state) {
  const m = state.month;
  const totals = monthTotals(state, m);
  const byCat = spentByCategory(state, m);
  const parts = CATEGORIES.map((c) => ({ ...c, value: byCat[c.id] || 0 })).filter((p) => p.value > 0);
  parts.sort((a, b) => b.value - a.value);
  const donutParts = parts.map((p) => ({ label: p.label, value: p.value, color: p.color }));
  donutParts.monthLabel = monthLabel(m);
  const budgetTotal = Object.values(state.budgets).reduce((s, v) => s + v, 0);
  const topCats = parts.slice(0, 5);
  const recent = monthTransactions(state, m).slice(0, 6);
  const paid = new Set(state.paidBills[m] || []);
  const upcoming = BILLS.filter((b) => !paid.has(b.id))
    .sort((a, b) => a.day - b.day)
    .slice(0, 4);
  const goalsTotal = state.goals.reduce((s, g) => s + g.saved, 0);
  const goalsTarget = state.goals.reduce((s, g) => s + g.target, 0);

  return `
  <section class="hero">
    <div>
      <p class="eyebrow">${esc(HOUSEHOLD.name)} · ${esc(HOUSEHOLD.home)}</p>
      <h1>Every dollar has a job<br>before the month begins.</h1>
      <p class="lede">HomeLedger keeps one household's whole budget in one place: what comes in,
      what goes out, which bills are due, and what is left for the things that matter.
      No accounts, no fees, no cloud — your numbers stay on your own device.</p>
      <div class="hero-actions">
        <a class="btn primary" href="#/transactions">Add a transaction</a>
        <a class="btn" href="#/planner">Check the plan</a>
      </div>
    </div>
    <div class="hero-card">
      <p class="card-label">${monthLabel(m)} at a glance</p>
      ${donutChart(donutParts)}
      <ul class="legend">${topCats.map((p) => `<li><span class="dot" style="background:${p.color}"></span>${p.label}<b>${money(p.value)}</b></li>`).join('')}</ul>
    </div>
  </section>

  ${monthNav(state)}

  <section class="stat-grid" aria-label="Month summary">
    <div class="stat"><span class="stat-label">Money in</span><span class="stat-value">${money(totals.income)}</span><span class="stat-note">${INCOME_SOURCES.length} paydays + side jobs</span></div>
    <div class="stat"><span class="stat-label">Money out</span><span class="stat-value">${money(totals.spent)}</span><span class="stat-note">of ${money(budgetTotal)} planned</span></div>
    <div class="stat highlight"><span class="stat-label">Left to save &amp; spend</span><span class="stat-value">${money(totals.left)}</span><span class="stat-note">${totals.rate}% of income kept</span></div>
    <div class="stat"><span class="stat-label">Savings goals</span><span class="stat-value">${money(goalsTotal)}</span><span class="stat-note">of ${money(goalsTarget)} target</span></div>
  </section>

  <div class="two-col">
    <section class="panel">
      <div class="panel-head"><h2>Where the money went</h2><a href="#/planner">Full plan →</a></div>
      ${topCats.map((p) => `<div class="budget-line"><div class="budget-line-head"><span><span class="dot" style="background:${p.color}"></span>${p.label}</span><span>${money(p.value)}</span></div>${budgetBar(p.value, state.budgets[p.id], p.color)}</div>`).join('') || '<p class="empty">No spending recorded this month yet.</p>'}
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Bills still to pay</h2><a href="#/bills">All bills →</a></div>
      <ul class="bill-list compact">
        ${upcoming.map((b) => `<li><span class="bill-day">Due ${b.day}</span><span class="bill-label">${esc(b.label)}</span><b>${money(b.amount)}</b><button class="btn small" data-action="pay-bill" data-id="${b.id}">Mark paid</button></li>`).join('') || '<li class="empty">Every bill this month is paid. Nice work.</li>'}
      </ul>
      <div class="panel-head"><h2>Latest spending</h2><a href="#/transactions">All transactions →</a></div>
      <ul class="tx-list">${recent.map(txRow).join('')}</ul>
    </section>
  </div>

  <section class="panel tip-panel">
    <h2>How the Riveras stay on track</h2>
    <p>Three habits do most of the work: <b>one weekly shop</b> instead of five small trips,
    <b>the 24-hour rule</b> for anything over $40, and <b>payday savings</b> — $180 moves to the
    emergency cushion the morning the salary lands, before the spending starts.
    <a href="#/insights">Read the full guide →</a></p>
  </section>`;
}

export function renderTransactions(state) {
  const m = state.month;
  const txs = monthTransactions(state, m);
  const totals = monthTotals(state, m);
  const filter = state.filter || 'all';
  const shown = filter === 'all' ? txs : txs.filter((t) => t.category === filter || (filter === 'in' && t.kind === 'in'));
  const chips = [{ id: 'all', label: 'All' }, { id: 'in', label: 'Income' }, ...CATEGORIES]
    .map((c) => `<button class="chip${filter === c.id ? ' active' : ''}" data-action="filter" data-filter="${c.id}">${c.label}</button>`)
    .join('');
  return `
  <section class="page-head">
    <div><p class="eyebrow">Transactions</p><h1>Every dollar, in writing.</h1>
    <p class="lede">${monthLabel(m)}: ${txs.length} entries, ${money(totals.income)} in and ${money(totals.spent)} out. Tap a chip to filter, × to remove an entry.</p></div>
  </section>
  ${monthNav(state)}
  <div class="two-col wide-left">
    <section class="panel">
      <div class="chips" role="group" aria-label="Filter transactions">${chips}</div>
      <ul class="tx-list full">${shown.map(txRow).join('') || '<li class="empty">Nothing matches this filter yet.</li>'}</ul>
    </section>
    <div>${addTxForm(state)}
    <section class="panel small-panel">
      <h3>Income this month</h3>
      <ul class="plain-list">${INCOME_SOURCES.map((s) => `<li><span>${esc(s.label)}</span><b>${money(s.amount)}</b><small>day ${s.day}</small></li>`).join('')}</ul>
      <p class="fineprint">Income lines are part of the sample data. Add your own with the form — pick “Income” as the type.</p>
    </section></div>
  </div>`;
}

export function renderPlanner(state) {
  const m = state.month;
  const byCat = spentByCategory(state, m);
  const budgetTotal = Object.values(state.budgets).reduce((s, v) => s + v, 0);
  const spentTotal = Object.values(byCat).reduce((s, v) => s + v, 0);
  const rows = CATEGORIES.map((c) => {
    const spent = byCat[c.id] || 0;
    const budget = state.budgets[c.id];
    return `<div class="plan-card">
      <div class="plan-head"><span class="tx-cat big" style="background:${c.color}">${c.icon}</span>
      <div><h3>${c.label}</h3><p class="fineprint">${planNote(c.id)}</p></div>
      <span class="plan-budget"><label>Monthly budget $<input type="number" min="0" step="5" value="${budget}" data-action-input="budget" data-id="${c.id}" aria-label="${c.label} monthly budget"></label></span></div>
      ${budgetBar(spent, budget, c.color)}
    </div>`;
  }).join('');
  return `
  <section class="page-head">
    <div><p class="eyebrow">Budget planner</p><h1>The plan before the spending.</h1>
    <p class="lede">Set a monthly limit for each part of household life, then watch the bars fill up as the month goes on.
    Tap a budget number to change it — the plan saves on your device.</p></div>
  </section>
  ${monthNav(state)}
  <section class="stat-grid three">
    <div class="stat"><span class="stat-label">Planned for ${monthLabel(m)}</span><span class="stat-value">${money(budgetTotal)}</span><span class="stat-note">across ${CATEGORIES.length} categories</span></div>
    <div class="stat"><span class="stat-label">Spent so far</span><span class="stat-value">${money(spentTotal)}</span><span class="stat-note">${Math.round((spentTotal / budgetTotal) * 100)}% of the plan</span></div>
    <div class="stat highlight"><span class="stat-label">Still in the plan</span><span class="stat-value">${money(Math.max(0, budgetTotal - spentTotal))}</span><span class="stat-note">${budgetTotal - spentTotal < 0 ? `${money(spentTotal - budgetTotal)} over plan` : 'to spend or save'}</span></div>
  </section>
  <section class="plan-grid">${rows}</section>
  <section class="panel tip-panel">
    <h2>A plan that survives contact with real life</h2>
    <p>Start from last month's real spending, not from a wish. Give groceries and transport a little slack,
    keep one “Everything Else” pot for the surprises, and move money between pots when life happens —
    a plan you can bend is a plan you will keep. <a href="#/insights">See what last month taught us →</a></p>
  </section>`;
}

function planNote(id) {
  return {
    housing: 'Rent, insurance and the roof over four heads.',
    groceries: 'One big weekly shop, plus the Saturday market.',
    transport: 'Petrol, bus passes and the car payment.',
    utilities: 'Power, water, internet and four phone lines.',
    dining: 'Pizza Fridays and the odd takeaway — capped on purpose.',
    kids: 'Lunches, shoes, boots and school trips.',
    health: 'Pharmacy, dentist and the family gym.',
    fun: 'Cinema nights, the tree, the small joys.',
    other: 'Gifts and the things nobody plans for.',
  }[id] || '';
}

export function renderBills(state) {
  const m = state.month;
  const paid = new Set(state.paidBills[m] || []);
  const total = BILLS.reduce((s, b) => s + b.amount, 0);
  const paidTotal = BILLS.filter((b) => paid.has(b.id)).reduce((s, b) => s + b.amount, 0);
  const rows = [...BILLS].sort((a, b) => a.day - b.day).map((b) => {
    const isPaid = paid.has(b.id);
    const cat = categoryOf(b.category);
    return `<li class="bill-row${isPaid ? ' paid' : ''}">
      <span class="bill-day big">Day ${b.day}</span>
      <span class="tx-cat" style="background:${cat.color}">${cat.icon}</span>
      <span class="bill-label">${esc(b.label)}<small>${esc(cat.label)}${b.autopay ? ' · autopay on' : ' · pay by hand'}</small></span>
      <b>${money(b.amount)}</b>
      ${isPaid ? '<span class="paid-tag">✓ Paid</span>' : `<button class="btn small" data-action="pay-bill" data-id="${b.id}">Mark paid</button>`}
    </li>`;
  }).join('');
  return `
  <section class="page-head">
    <div><p class="eyebrow">Bills</p><h1>Nothing due sneaks past.</h1>
    <p class="lede">Every recurring bill for ${monthLabel(m)}, in due-date order. Mark each one paid as it goes out —
    autopay bills are marked for you in the sample month.</p></div>
  </section>
  ${monthNav(state)}
  <section class="stat-grid three">
    <div class="stat"><span class="stat-label">Bills this month</span><span class="stat-value">${money(total)}</span><span class="stat-note">${BILLS.length} recurring bills</span></div>
    <div class="stat"><span class="stat-label">Already paid</span><span class="stat-value">${money(paidTotal)}</span><span class="stat-note">${paid.size} of ${BILLS.length} bills</span></div>
    <div class="stat highlight"><span class="stat-label">Still to pay</span><span class="stat-value">${money(total - paidTotal)}</span><span class="stat-note">${BILLS.length - paid.size} bills left</span></div>
  </section>
  <section class="panel"><ul class="bill-list full">${rows}</ul>
  <p class="fineprint">Bills repeat every month on the same day. When a new month starts, the paid marks reset and the list starts fresh.</p></section>`;
}

export function renderGoals(state) {
  const savedTotal = state.goals.reduce((s, g) => s + g.saved, 0);
  const targetTotal = state.goals.reduce((s, g) => s + g.target, 0);
  const cards = state.goals.map((g) => `<article class="goal-card">
    <h3>${esc(g.label)}</h3>
    <p class="fineprint">${esc(g.note)}</p>
    ${goalBar(g.saved, g.target)}
    <div class="goal-actions">
      <button class="btn small" data-action="goal-add" data-id="${g.id}" data-amount="25">+ $25</button>
      <button class="btn small" data-action="goal-add" data-id="${g.id}" data-amount="50">+ $50</button>
      <button class="btn small" data-action="goal-add" data-id="${g.id}" data-amount="100">+ $100</button>
    </div>
  </article>`).join('');
  return `
  <section class="page-head">
    <div><p class="eyebrow">Savings goals</p><h1>Saving for something, not just saving.</h1>
    <p class="lede">A goal with a name and a date gets saved for. Tap a button to add to a goal — the bars move straight away.</p></div>
  </section>
  <section class="stat-grid three">
    <div class="stat"><span class="stat-label">Saved across all goals</span><span class="stat-value">${money(savedTotal)}</span><span class="stat-note">${state.goals.length} goals on the go</span></div>
    <div class="stat"><span class="stat-label">Combined target</span><span class="stat-value">${money(targetTotal)}</span><span class="stat-note">${Math.round((savedTotal / targetTotal) * 100)}% of the way there</span></div>
    <div class="stat highlight"><span class="stat-label">Still to save</span><span class="stat-value">${money(targetTotal - savedTotal)}</span><span class="stat-note">at $180 a month, about ${Math.ceil((targetTotal - savedTotal) / 180)} months</span></div>
  </section>
  <section class="goal-grid">${cards}</section>
  <section class="panel tip-panel">
    <h2>Why the emergency cushion comes first</h2>
    <p>Three months of bills — $9,000 for this household — means a broken car or a lost shift never becomes a debt.
    The Riveras fund it first, then the trip, then the roof. <a href="#/insights">How the numbers add up →</a></p>
  </section>`;
}

export function renderInsights(state) {
  const m = state.month;
  const totals = monthTotals(state, m);
  const byCat = spentByCategory(state, m);
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  const topCat = top ? categoryOf(top[0]) : null;
  const daysIn = new Date(Number(m.slice(0, 4)), Number(m.slice(5, 7)), 0).getDate();
  const daily = totals.spent / 27; // 27 days of November data so far
  const projected = totals.spent + daily * (daysIn - 27);
  const groceryShare = Math.round(((byCat.groceries || 0) / Math.max(1, totals.spent)) * 100);
  const insightCards = [
    {
      title: `${topCat ? topCat.label : 'Spending'} is the biggest slice`,
      body: top ? `${money(top[1])} of ${money(totals.spent)} — about ${Math.round((top[1] / totals.spent) * 100)}% of everything the household spent in ${monthLabel(m)}. ${top[0] === 'housing' ? 'Rent is fixed, so the lever is everywhere else.' : 'One category always leads; the trick is knowing which one before the month ends.'}` : 'No spending recorded yet.',
    },
    {
      title: `About ${money(daily)} a day`,
      body: `At the current pace the month closes near ${money(projected)}. That is ${projected > totals.income ? 'more than the income — the plan needs a trim' : 'inside the income, with room to save'}.`,
    },
    {
      title: `Groceries are ${groceryShare}% of spending`,
      body: 'For a family of four that is normal — food is the biggest flexible cost after rent. The weekly shop at GreenMart is $128–$156 a time; the market stall on Saturdays is the cheapest fresh food in the week.',
    },
    {
      title: 'Autopay does the remembering',
      body: 'Six bills pay themselves. The four paid by hand — water, insurance, school lunches and the gym — are the ones that used to slip. They now sit at the top of the Bills page in due-date order.',
    },
  ];
  return `
  <section class="page-head">
    <div><p class="eyebrow">Insights &amp; guide</p><h1>What the numbers are saying.</h1>
    <p class="lede">HomeLedger reads the month back to you — the biggest slice, the daily pace, and the habits that actually move the total.</p></div>
  </section>
  ${monthNav(state)}
  <section class="insight-grid">
    ${insightCards.map((c) => `<article class="insight-card"><h3>${esc(c.title)}</h3><p>${esc(c.body)}</p></article>`).join('')}
  </section>
  <section class="panel">
    <div class="panel-head"><h2>Five habits that keep a household budget working</h2></div>
    <ol class="tips-list">
      ${TIPS.map((t) => `<li><b>${esc(t.title)}</b><p>${esc(t.body)}</p></li>`).join('')}
    </ol>
  </section>
  <section class="panel tip-panel">
    <h2>Start your own month</h2>
    <p>Everything on this site runs on the sample Rivera household. Add your own transactions, set your own budgets,
    and press <b>Reset demo data</b> in the footer any time to start the sample month again. Your numbers never leave this browser.</p>
  </section>`;
}

export const VIEWS = {
  dashboard: renderDashboard,
  transactions: renderTransactions,
  planner: renderPlanner,
  bills: renderBills,
  goals: renderGoals,
  insights: renderInsights,
};

export const NAV = [
  ['dashboard', 'Dashboard', '#/'],
  ['transactions', 'Transactions', '#/transactions'],
  ['planner', 'Planner', '#/planner'],
  ['bills', 'Bills', '#/bills'],
  ['goals', 'Goals', '#/goals'],
  ['insights', 'Insights', '#/insights'],
];
