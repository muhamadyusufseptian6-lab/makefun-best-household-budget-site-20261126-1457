# HomeLedger — Household Budget, Kept in One Place

[![Competition](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/muhamadyusufseptian6-lab/makefun-best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/muhamadyusufseptian6-lab/makefun-best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)

**HomeLedger** is a household budget site built around one question: *can a family
see its whole money life — income, spending, bills, plan, and savings — in one
place, and act on it in seconds?* It follows the Rivera family of four through
October–December 2026 across six pages, each one a working tool rather than a
mockup: budgets can be edited, bills can be marked paid, goals take real
contributions, and transactions can be added and deleted. It runs entirely
offline from its own static files, on a desktop and on a phone, with no network
request, no account, and no fee. Every figure on the site is invented sample
data, written for this site; the household is fictional.

## What the site does

Six pages, every one reached from the top navigation, every control doing what
it says — and every change saved in the browser, so the site remembers it:

- **Dashboard** — the month at a glance: a hand-drawn SVG donut of spending by
  category, money in / money out / money left / savings rate, the biggest budget
  lines, bills still to pay, and the latest transactions.
- **Transactions** — every entry for the month (58 across October–December 2026),
  filterable by category or income, with a working add form and per-entry delete.
  Entries save in the browser, so the site remembers what you added.
- **Planner** — a monthly budget for each of 9 categories ($3,615 planned for
  November), with progress bars that fill as the month goes on and budget amounts
  you can tap to change. Over-budget lines turn terracotta and say so.
- **Bills** — all 10 recurring bills in due-date order ($2,431 a month), with
  autopay marked and a “Mark paid” button that sticks.
- **Goals** — 4 savings goals ($16,920 combined target, $10,215 saved), with
  +$25 / +$50 / +$100 buttons that move the bars straight away.
- **Insights** — what the numbers say: biggest slice, daily pace, projected
  month-end, plus five habits that keep a household budget working.

Switch months (October / November / December 2026) from any page — the figures,
bills and transactions follow. **Reset demo data** in the footer restores the
sample month at any time.

## How it is built

- `app/` — the site as static files, no build step: `index.html`, `style.css`,
  and four ES modules with one clear job each:
  - `data.js` — the sample household, budgets, bills, goals, transactions and tips,
    plus the localStorage store
  - `charts.js` — the hand-rolled SVG donut, budget bars and goal bars
  - `views.js` — one renderer per page
  - `main.js` — hash router, delegated controls, and the add-transaction form
- `main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
  to the output directory and writes `dossier.json` with `buildDossier` from
  `vendor/makefun-frontend.ts` (the kit's copy, unchanged).
- No library, no framework, no font or image loaded over the network — system
  fonts and inline SVG only. First load: 6 files, about 50 KiB raw.

## Run it

Serve `app/` with any static server and open `index.html`, for example:

```sh
python3 -m http.server 8080 --directory app
```

then open http://localhost:8080 — or open `app/index.html` directly in a browser.

To build the hand-in output:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Screenshots

Four real renders of the site's own code, in `screenshots/`: the dashboard
(cover), the planner, the transactions page, and the dashboard at phone size
(390 × 844).

## License

MIT — see [LICENSE](LICENSE).

---

Built for the make.fun bounty “Make the best household budget site”. If you join
make.fun, use referral code **515temp1**.
