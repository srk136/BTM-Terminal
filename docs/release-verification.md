# Public backend release verification

**Verified October 17, 2026**, in an isolated checkout of the public repository.
BTM-Core, its Terminal, Railway services, databases, and trading processes were
not modified for this release. No market-data, AI, broker, or Telegram calls were
made. Package installation and authorized GitHub access were the only external
services needed for these checks.

## Current release

| Check | Result |
| --- | --- |
| Clean `npm ci --ignore-scripts` outside the private monorepo | PASS |
| `npm test` | **52 passed** across three test files |
| Risk Engine portion of that suite | **41 passed**; independently selectable with `npm run test:risk` |
| Existing public interface/data portion | **11 passed** |
| `npm run build` | PASS: strict TypeScript checking, Vite frontend build, and ESM/declaration backend build |
| `npm run example:risk` | PASS: imports the compiled module and evaluates fictional input locally |
| Public frontend bundle | Unchanged from the previously verified interface build |
| Extraction comparison with the private evaluator | **1,000 synthetic cases matched**, including 112 approvals and 888 rejections |

Tests exercised LONG/SHORT sizing, risk constraints, symbol exposure, buying power,
gross leverage, whole-share flooring, NO_TRADE, inclusive daily-loss and position
limits, malformed prices/account state, empty-account exposure handling, missing
and invalid policy, determinism, and non-mutation.

The private-source comparison supplied the private policy in process memory only.
It compared complete result objects, including rejection reasons, against the
original evaluator. No private policy configuration, candidate/account snapshots,
or comparison harness that imports BTM-Core is included in this repository.
All comparison inputs were newly generated synthetic cases—not saved trading data.

The independently runnable public suite uses its own illustrative policy.
Source comparison establishes extraction fidelity for the exercised cases; it
is not a formal proof, broker integration test, strategy evaluation, or safety
certification.

## Earlier implementation evidence referenced in the README

- A read-only October 17 review of a completed October 15 specialist run confirmed
  17 saved debate/synthesis events and saved Anthropic/Claude attribution for all
  four specialists. Only aggregate evidence is described here; messages and private
  record identifiers are not released.
- October 17 private Terminal/replay verification passed 33 focused offline tests,
  both API and frontend TypeScript checks, endpoint checks, and desktop/mobile
  preview inspection.
- The initial public interface export passed 11 focused tests, independent
  installation/build, and desktop/mobile visual inspection on October 17.

Those checks do not imply that all private regression suites pass or that every
historical conversation has complete messages/attribution. They do not establish
current production health or resolve earlier live-market diagnostic gaps.

## Publication boundary

Only README/documentation, standalone build configuration, and the public
policy-parameterized risk component/tests/example are changed in this release.
No dependency versions or private frontend files are changed.

Excluded: private risk thresholds, scanner/strategy logic, prompts, broker adapters,
session authorization secrets, production connection strings, runtime logs,
database backups, saved market/trading records, compiled output, and `node_modules`.
