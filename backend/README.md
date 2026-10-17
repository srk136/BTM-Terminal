# Deterministic Risk Engine V1

This is a policy-parameterized extraction of the pure
`evaluateRiskEngineV1` function from BTM-Core's `risk-engine-v1.ts`, not an unrelated
mock or a rewrite of the proprietary scanner.

## What was retained

- LONG/SHORT result direction and explicit NO_TRADE rejection.
- Positive finite equity/prices; finite nonnegative buying power and exposure;
  integer position counts; coherent empty/nonempty account state.
- Required candidate-symbol gross exposure for nonempty accounts.
- Daily-loss and position-count rejection boundaries.
- Absolute entry-to-invalidation distance.
- Whole-share quantity equal to the minimum of risk budget, remaining symbol
  exposure allowance, buying power, and gross-leverage headroom.
- Approved quantity, actual dollar risk, notional, resulting gross exposure and
  leverage, and explanatory rejection reasons.

The math and decision ordering are retained. No currency-rounding changes or
new trading decisions were introduced.

## What was separated

Private hardcoded policy constants became a required `RiskPolicy` argument:

| Field | Units / validation |
| --- | --- |
| `maxRiskFraction` | Fraction of equity available for risk; greater than zero, at most one |
| `maxSymbolValueFraction` | Fraction of equity allowed in one symbol; greater than zero, at most one |
| `maxTotalLeverage` | Positive finite gross exposure/equity multiple |
| `dailyLossLimitFraction` | Fraction of equity; greater than zero, at most one |
| `maxOpenPositions` | Positive safe integer |

No default policy is exported. Example values are fictional settings and do not
document BTM-Core's production thresholds. This public configuration boundary
adds explicit policy validation; invalid/missing policy throws `RangeError`.
With valid policy matching the private evaluator, the retained evaluation
semantics are checked separately for parity. Public tests require no Core access.

## Build, test, and execute

From the repository root:

```sh
npm ci
npm run test:risk
npm run build:risk
node backend/example.mjs
```

The build emits an importable ESM JavaScript module and TypeScript declarations
in `dist-risk/`. The library has no runtime dependencies and performs no I/O.
The example supplies a fictional account and explicitly illustrative policy.

## Important scope and caller responsibilities

This is an account-limit and position-size evaluator, not the entire trading
approval system. It does **not** validate market-data freshness, entry confirmation,
direction-versus-stop geometry, target-based reward/risk, live brokerage state,
authorization receipts, session ownership, durable approval claims, or execution.
Those are separate responsibilities in BTM-Core and are not released here.

The typed input contract assumes candidate/account objects and a valid decision
enum. Untrusted JSON needs schema validation before calling it. Returned fields
may retain invalid numeric inputs on rejection; callers must validate/sanitize
them before serializing results. Do not interpret a rejected result's numeric
fields as usable account data.

The function sizes using the supplied proposal and snapshot; it does not reserve
capital, persist approval, reevaluate a later observed entry price, or send orders.
The position cap is checked before sizing and is not a concurrency control.
Symbol names, account snapshots, stale-data checks, and policy suitability remain
the caller's responsibility.

No strategy, specialist prompt, signal generation, production policy, private
database connection, actual trade record, or broker adapter is included.
