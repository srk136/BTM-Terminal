# BTM — Beat The Market

**An actively developed multi-agent trading research and internal paper-trading platform.**

BTM combines external market data, four Claude specialists, structured debate,
deterministic risk validation, and auditable simulated execution. The Terminal
makes decisions, trade plans, execution activity, portfolio state, and historical
specialist conversations available for review.

BTM is currently in **internal paper validation**. It is not a verified profitable
trading product. External Alpaca paper-brokerage execution and real-money trading
are future milestones—not capabilities claimed by this release.

## What is public, and what stays private?

| Repository | Purpose |
| --- | --- |
| **BTM-Core — private** | The operating backend, market integrations, proprietary scanner and strategies, specialist prompts, session authorization, execution orchestration, persistence, and private configuration. |
| **BTM-Terminal — this repository** | A standalone version of the real Terminal interface and selected reusable backend components, beginning with the deterministic Risk Engine V1 extraction. |

The standalone frontend uses **synthetic display data** and does not connect to
private BTM services. That disclosure applies to the public interface's bundled
dataset, not to BTM-Core's market-data integrations or implemented trading workflow.
The public Risk Engine is executable validation code, not a simulated API response.

## The system behind the Terminal

```text
External market data → opportunity scanner → four Claude specialists
                                             ↓ structured debate
                                saved events + synthesis + AI decisions
                                             ↓
                                deterministic risk validation
                                             ↓
                                    approved ARMED plans
                                             ↓
                              internal simulated entry/exit handling
                                             ↓
                              portfolio accounting + audit history
                                             ↓
                                        BTM Terminal
```

- **Market data and opportunity scanning:** private adapters retrieve real external
  market data, including Alpaca trades/bars. The scanner evaluates opportunities
  before requesting AI analysis. Proprietary qualification logic is not included here.
- **Four specialists:** the current Simplified V1 routes Thesis, Crowd/Flow,
  Book/Structure, and External State analysis through Anthropic/Claude. Initial
  positions, challenges, responses, final positions, and synthesis are persisted.
  Other provider interfaces in Core should not be confused with the current
  four-specialist configuration.
- **Persistent decisions and conversations:** saved analyses include NO_TRADE
  outcomes. Replay uses persisted messages and recorded attribution rather than
  reconstructing a conversation from its final decision.
- **Deterministic risk:** account-state checks and position sizing constrain
  proposals independently of an AI recommendation. Additional plan/entry guards,
  approvals, expiration, and execution checks remain in Core.
- **Internal paper execution:** approved plans can be monitored for confirmation;
  simulated entries/exits update positions, realized/unrealized P&L, and audit
  records. This internal ledger is distinct from placing orders with Alpaca.
- **Operations:** authorization receipts and PostgreSQL-backed ownership guard
  sessions; the AI Cost Governor accounts for usage/reservations. Deterministic
  monitoring is separated from permission to perform new paid AI analysis.
- **Railway infrastructure:** the private deployment architecture uses Railway
  for API/database hosting and supporting processes. The API includes Telegram
  integration; the standalone authorized runner has a separate entry point.
  Production builds, static Terminal serving, and database startup checks are
  implemented. This release does not independently attest live Railway uptime,
  active service configuration, or a currently authorized trading session.

## Development status and verification

Evidence below is deliberately scoped. An offline pass is not proof of live-market
execution quality, unattended restart recovery, profitability, or production uptime.
Private source, saved records, and diagnostic payloads are not redistributed.

| Date | Evidence | What it establishes |
| --- | --- | --- |
| October 15, 2026; reviewed October 17 | A completed saved specialist run contained 17 timestamped events: four initial positions, four challenges, four responses, four final positions, and one synthesis. Saved attribution identified Anthropic/Claude for all four specialists. | Persisted multi-agent exchanges and attribution exist in Core; no conversation contents, symbols, prices, or private identifiers are included here. |
| October 17, 2026 | Private Terminal/replay verification passed 33 focused offline tests, API and frontend TypeScript checks, read-only endpoint checks, and desktop/mobile preview checks. | The implemented history/replay surfaces were verified against saved data in development—not every Core behavior or live deployment. |
| October 17, 2026 | Initial standalone frontend passed clean installation outside the monorepo, production build/type checking, 11 focused tests, and desktop/mobile visual checks. | The public interface runs independently of Core. |
| October 17, 2026 | This release's build, Risk Engine suite, complete public suite, and extraction parity check are recorded in [release verification](docs/release-verification.md). | Reproducible public checks plus a separately described private-source comparison. |

### Implemented

- External market-data adapters and opportunity scanning in Core.
- Four-specialist Claude analysis, structured debate, synthesis, and saved history.
- Deterministic risk validation, ARMED plans, internal simulated execution,
  portfolio accounting, entry diagnostics, and execution audit history.
- Command Center, AI Decisions, Trade Activity, Active Trade Plans, and real-data
  Conversation Replay in the private Terminal.
- Production build/serving paths and session/database safety controls.
- Public standalone interface plus the reusable Risk Engine extraction below.

### Current validation stage

Controlled internal-paper sessions and focused offline regression testing.
Market-data freshness, scanner diagnostics, authorization/restart behavior, and
operational reliability remain explicit validation concerns. A documented October
15 investigation could reproduce invalid/stale/future observations offline but
could not prove the cause of that session's generic warnings. This README does
not turn that incomplete investigation into a resolved live-data claim.

### Future milestones

- Additional authorized end-to-end internal-paper validation and reliability evidence.
- Alpaca **paper-brokerage order execution**, reconciliation, and recovery validation.
- Further reusable public backend releases, without disclosing proprietary policy.
- Any real-money integration only after separate approval, safety review, and testing.

## Run the public project locally

Requires Node.js **22.12+ (22.x) or 24+**. No API keys, database, Core checkout, or
environment variables are needed.

```sh
npm ci
npm run dev            # Terminal frontend: http://localhost:5173
npm test               # all public frontend/data and Risk Engine tests
npm run test:risk      # only the independent Risk Engine suite
npm run build          # type checking + frontend build + Risk Engine JS/types
npm run example:risk   # execute the compiled Risk Engine on fictional inputs
npm run preview        # serve the frontend production build
```

Frontend output: `dist/`. Backend library output: `dist-risk/`.
Hash routing supports static hosting without application-server rewrite rules.
Fonts and demonstration data are bundled locally; the demo makes no market,
broker, AI-provider, or private API requests.

## First public backend component: Risk Engine V1

[`backend/risk-engine-v1.ts`](backend/risk-engine-v1.ts) is extracted from the
actual pure evaluator in BTM-Core, with its deterministic account validation,
whole-share sizing, minimum-headroom calculation, and result/rejection structure
preserved. It handles LONG/SHORT proposals, NO_TRADE rejection, account/exposure
consistency, daily-loss and open-position limits, and sizing constrained by
dollar risk, per-symbol exposure, buying power, and gross leverage.

**Private thresholds are not shipped.** All five policy values are mandatory
caller inputs. The example and tests use explicitly illustrative settings.
Malformed policy fails explicitly instead of falling back to BTM's configuration.

```js
// After npm run build:risk; supply your own explicit policy and account snapshot.
import { evaluateRiskEngineV1 } from './dist-risk/risk-engine-v1.js';

const result = evaluateRiskEngineV1(proposalAndAccount, yourPolicy);
```

See the [standalone example](backend/example.mjs) and
[extraction/boundary documentation](backend/README.md) for complete runnable usage
and limitations. An APPROVED result here is a sizing result—not permission to place
an order or a substitute for Core's downstream execution authorization.

## Repository layout

```text
backend/       Reusable Risk Engine source, tests, build config, example, and notes
docs/          Release verification and evidence boundaries
src/pages/     The five Terminal pages
src/components/ Reusable interface components
src/demo/      Local demonstration adapter, public types, and fictional display data
src/assets/    Official supplied BTM artwork
```

Private strategies, scanner rules, AI prompts, production policy, credentials,
actual trading records, broker execution, and private infrastructure configuration
are not part of this repository. Dependencies retain their respective licenses;
the BTM brand assets are supplied project artwork, not a grant of trademark rights.

This is research software, not investment advice, and no returns are promised.
