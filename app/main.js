// HomeLedger boot + router: hash routes for the six pages, one delegated
// click handler for every control, and the add-transaction form.

import { loadState, saveState, resetState, HOUSEHOLD } from './data.js';
import { VIEWS, NAV, monthLabel } from './views.js';

const app = document.getElementById('app');
const nav = document.getElementById('main-nav');
let state = loadState();

function route() {
  const hash = window.location.hash || '#/';
  const name = hash.replace(/^#\/?/, '').split('/')[0] || 'dashboard';
  return VIEWS[name] ? name : 'dashboard';
}

function render() {
  const name = route();
  nav.innerHTML = NAV.map(([id, label, href]) =>
    `<a href="${href}" class="${id === name ? 'active' : ''}" ${id === name ? 'aria-current="page"' : ''}>${label}</a>`,
  ).join('');
  app.innerHTML = VIEWS[name](state);
  window.scrollTo(0, 0);
}

function rerender() {
  saveState(state);
  render();
}

document.addEventListener('click', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;

  if (action === 'month') {
    const month = el.dataset.month;
    if (month && HOUSEHOLD.months.includes(month)) {
      state.month = month;
      rerender();
    }
    return;
  }

  if (action === 'filter') {
    state.filter = el.dataset.filter;
    render();
    return;
  }

  if (action === 'pay-bill') {
    const month = state.month;
    const paid = new Set(state.paidBills[month] || []);
    paid.add(el.dataset.id);
    state.paidBills[month] = [...paid];
    rerender();
    return;
  }

  if (action === 'delete-tx') {
    state.transactions = state.transactions.filter((t) => t.id !== el.dataset.id);
    rerender();
    return;
  }

  if (action === 'goal-add') {
    const goal = state.goals.find((g) => g.id === el.dataset.id);
    if (goal) {
      goal.saved = Math.min(goal.target, goal.saved + Number(el.dataset.amount));
      rerender();
    }
    return;
  }

  if (action === 'reset-demo') {
    state = resetState();
    rerender();
  }
});

// Budget inputs save on change; the number in the box is the new budget.
document.addEventListener('change', (event) => {
  const el = event.target.closest('[data-action-input="budget"]');
  if (!el) return;
  const value = Math.max(0, Math.round(Number(el.value) || 0));
  state.budgets[el.dataset.id] = value;
  rerender();
});

// The add-transaction form is re-created on every render, so listen on the
// document and match the form by id.
document.addEventListener('submit', (event) => {
  if (event.target.id !== 'add-tx-form') return;
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const label = String(data.get('label') || '').trim();
  const amount = Number(data.get('amount'));
  const day = Math.min(31, Math.max(1, Number(data.get('day')) || 1));
  const category = String(data.get('category') || 'other');
  const kind = data.get('kind') === 'in' ? 'in' : 'out';
  if (!label || !(amount > 0)) return;
  state.transactions.push({
    id: `u${Date.now()}`,
    month: state.month,
    day,
    label,
    category,
    amount: Math.round(amount * 100) / 100,
    kind,
  });
  saveState(state);
  window.location.hash = '#/transactions';
  render();
});

window.addEventListener('hashchange', render);

document.getElementById('year').textContent = String(new Date().getFullYear());
render();
