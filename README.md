# BTM Terminal - Public Synthetic Demo

A standalone, read-only build of the BTM Terminal interface. Every record shown
(portfolio, positions, AI decisions, trade activity, trade plans, conversations)
is fictional and authored locally in `src/demo/data.ts`. A persistent
SYNTHETIC DEMO banner is shown on every page.

Pages: Command Center, AI Decisions, Trade Activity, Active Trade Plans
(with plan details and deep links), Conversation Replay (selectable conversations).

## Commands

Requires Node.js 22.12+ (22.x) or Node.js 24+. No environment variables or
BTM-Core workspace packages are required.

```
npm ci
npm run dev       # local dev server, http://localhost:5173
npm run build     # type-check, then production build into dist/
npm run preview   # serve the built output, http://localhost:4173
npm test          # focused consistency tests for the synthetic dataset
```

`package-lock.json` pins the standalone dependency tree. Run these commands
from this directory, or copy this directory alone to a separate location first.

## Routing

Uses hash routing (`#/ai-decisions`, `#/trade-plans/<plan-id>`), and the build uses a relative base, so it can be hosted statically with no rewrite rules.

## Illustrative labels

Provider and model labels (for example `synthetic-demo / hand-written-fixture`) and all cost figures are illustrative placeholders. No AI calls are made and no AI provider is connected; conversation text is hand-written fiction.

## What this is not

- No network data calls, API proxy, database, credentials or environment secrets.
- No scanners, prompts, specialist output, execution engine, risk engine or market algorithms.
- No live monitoring, no AI provider usage, no real trades or real market prices.
- Tickers, prices, plans and conversation text are invented and illustrative.
- No workspace/catalog dependencies, parent tsconfig, or private API schemas.
- Fonts are bundled through npm (`@fontsource`); nothing is fetched from a CDN at runtime.

## Layout

- `src/demo/` - public types, synthetic dataset, local adapter, small read hook
- `src/components/`, `src/pages/` - presentation code
- `src/assets/brand/` - logo and banner images
