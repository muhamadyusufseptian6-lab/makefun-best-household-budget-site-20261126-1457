// HomeLedger charts: small hand-rolled SVG charts. No library, no network —
// just arcs and bars drawn from the numbers the page already has.

export function money(n) {
  const sign = n < 0 ? '-' : '';
  return `${sign}$${Math.abs(Math.round(n)).toLocaleString('en-US')}`;
}

export function moneyCents(n) {
  return `$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function polar(cx, cy, r, degrees) {
  const rad = ((degrees - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const [sx, sy] = polar(cx, cy, r, startDeg);
  const [ex, ey] = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}

// A donut of spending by category. `parts` is [{label, value, color}].
export function donutChart(parts, size = 220) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  if (total <= 0) {
    return `<svg class="donut" viewBox="0 0 ${size} ${size}" role="img" aria-label="No spending yet"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e8e2d4" stroke-width="26"/><text x="${cx}" y="${cy}" text-anchor="middle" class="donut-center-label">No spending</text></svg>`;
  }
  let angle = 0;
  const arcs = parts
    .filter((p) => p.value > 0)
    .map((p) => {
      const sweep = (p.value / total) * 360;
      const start = angle;
      angle += sweep;
      const end = angle;
      // A hair of gap between slices so the chart reads at a glance.
      const gap = sweep > 4 ? 1.2 : 0;
      const d = arcPath(cx, cy, r, start + gap, Math.max(end - gap, start + 0.1));
      return `<path d="${d}" fill="none" stroke="${p.color}" stroke-width="26" stroke-linecap="butt"><title>${p.label}: ${money(p.value)}</title></path>`;
    })
    .join('');
  return `<svg class="donut" viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category, ${money(total)} in total">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#efe9db" stroke-width="26"/>
    ${arcs}
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="donut-center-amount">${money(total)}</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-center-label">spent in ${parts.monthLabel || 'the month'}</text>
  </svg>`;
}

// A horizontal bar row for one budget line: spent vs budget.
export function budgetBar(spent, budget, color) {
  const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const over = spent > budget;
  const cls = over ? 'bar-fill over' : 'bar-fill';
  return `<div class="bar-track" role="img" aria-label="${pct}% of budget used">
    <div class="${cls}" style="width:${pct}%;background:${color}"></div>
  </div>
  <div class="bar-numbers"><span>${money(spent)} of ${money(budget)}</span><span class="${over ? 'over-text' : ''}">${over ? `${money(spent - budget)} over` : `${pct}% used`}</span></div>`;
}

// A slim progress bar for a savings goal.
export function goalBar(saved, target) {
  const pct = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;
  return `<div class="bar-track slim" role="img" aria-label="${pct}% of goal saved">
    <div class="bar-fill" style="width:${pct}%"></div>
  </div>
  <div class="bar-numbers"><span>${money(saved)} saved</span><span>${pct}% of ${money(target)}</span></div>`;
}
