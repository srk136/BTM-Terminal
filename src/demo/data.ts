// Newly authored SYNTHETIC data. Every ticker, price, plan and message is fictional.
import type { DemoDecision, DemoEvent, DemoPlan, DecisionValue, Direction, Replay, ReplayMessage } from './types';

export const DEMO_AS_OF = '2025-06-11T19:40:00Z';
const round2 = (n: number) => Math.round(n * 100) / 100;
const rr = (d: Direction, entry: number, stop: number, tp: number) =>
  round2(d === 'LONG' ? (tp - entry) / (entry - stop) : (entry - tp) / (stop - entry));
const iso = (ms: number) => new Date(ms).toISOString().replace('.000Z', 'Z');
const plus = (t: string, minutes: number) => iso(new Date(t).getTime() + minutes * 60000);

type PlanSeed = Omit<DemoPlan, 'plannedRewardRisk' | 'confirmation' | 'triggerType'> & { triggerType?: string };
function plan(s: PlanSeed): DemoPlan {
  const triggerType = s.triggerType ?? (s.direction === 'LONG' ? 'CLOSE_ABOVE' : 'CLOSE_BELOW');
  return {
    ...s, triggerType,
    plannedRewardRisk: rr(s.direction, s.plannedEntryPrice, s.stopLoss, s.takeProfit),
    confirmation: `Fifteen-minute candle closes ${s.direction === 'LONG' ? 'above' : 'below'} ${s.triggerPrice.toFixed(2)} (synthetic rule)`,
  };
}

export const PLANS: DemoPlan[] = [
  plan({
    planId: 'demo-plan-krnl-0610', symbol: 'KRNL', direction: 'LONG', status: 'ENTERED', persistedStatus: 'ENTERED',
    statusNote: 'Simulated entry recorded in the synthetic ledger.', plannedEntryPrice: 84.2, stopLoss: 81.9, takeProfit: 89.9,
    approvedQuantity: 120, triggerPrice: 84.2, createdAt: '2025-06-10T14:12:00Z', expiresAt: '2025-06-12T20:00:00Z',
    holdingHorizon: '2 to 4 sessions', simulatedFillPrice: 84.2, executedQuantity: 120, executedAt: '2025-06-10T15:47:00Z', closedPrice: null, closedAt: null,
    tradeThesis: 'Fictional example: KRNL consolidates beneath a prior swing high while the invented sector index firms. The demo plan waits for a confirmed close above the trigger before simulating an entry.',
    supportingReasons: ['Demo narrative: tightening range over five sessions.', 'Demo narrative: invented sector breadth improving.', 'Reward/risk above the demo minimum of 2.0.'],
    risks: ['Illustrative gap risk around a fictional earnings date.', 'Thin synthetic liquidity in the final hour.'],
  }),
  plan({
    planId: 'demo-plan-vltr-0610', symbol: 'VLTR', direction: 'SHORT', status: 'ENTERED', persistedStatus: 'ENTERED',
    statusNote: 'Simulated entry recorded in the synthetic ledger.', plannedEntryPrice: 212.4, stopLoss: 216.6, takeProfit: 203.1,
    approvedQuantity: 60, triggerPrice: 212.4, createdAt: '2025-06-10T16:25:00Z', expiresAt: '2025-06-12T20:00:00Z',
    holdingHorizon: '1 to 3 sessions', simulatedFillPrice: 212.4, executedQuantity: 60, executedAt: '2025-06-11T13:58:00Z', closedPrice: null, closedAt: null,
    tradeThesis: 'Fictional example: VLTR fails to hold a rebound and rolls beneath a demo support level. The plan is a short that triggers only on a confirmed close below the level.',
    supportingReasons: ['Demo narrative: lower high formed on rising invented volume.', 'Demo narrative: relative weakness versus the fictional peer group.'],
    risks: ['Short squeeze risk is illustrated by a wide synthetic stop.', 'Plan assumes no fictional news catalyst before expiry.'],
  }),
  plan({
    planId: 'demo-plan-orbx-0611', symbol: 'ORBX', direction: 'LONG', status: 'ARMED', persistedStatus: 'ARMED',
    statusNote: 'Armed and waiting; entry evaluations have been rejected so far.', plannedEntryPrice: 37.5, stopLoss: 36.1, takeProfit: 40.6,
    approvedQuantity: 250, triggerPrice: 37.5, createdAt: '2025-06-11T14:30:00Z', expiresAt: '2025-06-12T20:00:00Z',
    holdingHorizon: '1 to 2 sessions', simulatedFillPrice: null, executedQuantity: null, executedAt: null, closedPrice: null, closedAt: null,
    tradeThesis: 'Fictional example: ORBX probes a demo resistance level from below. The plan stays armed, and rejections are expected until a candle closes through the trigger.',
    supportingReasons: ['Demo narrative: repeated tests of the same level.', 'Demo narrative: contracting pullbacks.'],
    risks: ['Repeated rejections may indicate a failed breakout.', 'Synthetic spread widens near the close.'],
  }),
  plan({
    planId: 'demo-plan-hlio-0609', symbol: 'HLIO', direction: 'LONG', status: 'EXPIRED', persistedStatus: 'ARMED',
    statusNote: 'Expiry time passed with no recorded entry.', plannedEntryPrice: 142, stopLoss: 138.4, takeProfit: 149.5,
    approvedQuantity: 80, triggerPrice: 142, createdAt: '2025-06-09T15:05:00Z', expiresAt: '2025-06-10T20:00:00Z',
    holdingHorizon: '1 session', simulatedFillPrice: null, executedQuantity: null, executedAt: null, closedPrice: null, closedAt: null,
    tradeThesis: 'Fictional example: HLIO attempts a recovery, but the demo trigger is never confirmed before the plan lapses.',
    supportingReasons: ['Demo narrative: early session strength.', 'Demo narrative: modest reward/risk.'],
    risks: ['Short expiry window leaves little room for confirmation.'],
  }),
  plan({
    planId: 'demo-plan-mrdn-0609', symbol: 'MRDN', direction: 'SHORT', status: 'CLOSED', persistedStatus: 'CLOSED',
    statusNote: 'Simulated position closed profitably before the take-profit level.', plannedEntryPrice: 58, stopLoss: 59.6, takeProfit: 54.8,
    approvedQuantity: 40, triggerPrice: 58, createdAt: '2025-06-09T13:40:00Z', expiresAt: '2025-06-11T20:00:00Z',
    holdingHorizon: '1 to 2 sessions', simulatedFillPrice: 58, executedQuantity: 40, executedAt: '2025-06-09T14:22:00Z', closedPrice: 55.6, closedAt: '2025-06-10T17:10:00Z',
    tradeThesis: 'Fictional example: MRDN loses a demo moving-average shelf. The short was entered after confirmation and closed after a partial move to target.',
    supportingReasons: ['Demo narrative: failed retest of the shelf.', 'Demo narrative: weak invented sector tape.'],
    risks: ['Fictional policy headline could reverse the move.'],
  }),
  plan({
    planId: 'demo-plan-qtza-0611', symbol: 'QTZA', direction: 'LONG', status: 'ARMED', persistedStatus: 'ARMED',
    statusNote: 'Armed and waiting for confirmation.', plannedEntryPrice: 19.8, stopLoss: 18.95, takeProfit: 21.9,
    approvedQuantity: 400, triggerPrice: 19.8, createdAt: '2025-06-11T17:05:00Z', expiresAt: '2025-06-13T20:00:00Z',
    holdingHorizon: '2 to 3 sessions', simulatedFillPrice: null, executedQuantity: null, executedAt: null, closedPrice: null, closedAt: null,
    tradeThesis: 'Fictional example: QTZA bases near a demo floor with falling volatility. Armed for a close above the trigger.',
    supportingReasons: ['Demo narrative: base holds for six sessions.', 'Demo narrative: volatility compression.'],
    risks: ['Low-priced names may gap through the stop in this illustration.', 'Sector rotation is invented but plausible.'],
  }),
];

export const MARKS: Record<string, number> = { KRNL: 85.35, VLTR: 210.9 };
const planBy = (sym: string) => PLANS.find((p) => p.symbol === sym)!;

// ---------- events ----------
function ev(id: string, kind: string, at: string, p: DemoPlan, extra: Partial<DemoEvent> = {}): DemoEvent {
  return {
    id, kind, at, symbol: p.symbol, planId: p.planId, direction: p.direction, persistedStatus: p.persistedStatus, effectiveStatus: p.status,
    validationStep: null, code: null, phase: null, observedPrice: null, observedAt: null, confirmation: p.confirmation, rewardRisk: p.plannedRewardRisk,
    candleAt: null, candleClose: null, triggerPrice: p.triggerPrice, stop: p.stopLoss, target: p.takeProfit, reason: null, derived: false, recordedDetails: null, ...extra,
  };
}
const REJECT_CODES: [string, string, string][] = [
  ['CANDLE_CLOSE_BELOW_TRIGGER', 'confirmation', 'Candle closed on the wrong side of the trigger.'],
  ['CONFIRMATION_NOT_MET', 'confirmation', 'Confirmation rule was not satisfied on this candle.'],
  ['REWARD_RISK_BELOW_MINIMUM', 'risk_check', 'Reward/risk at the observed price fell below the demo minimum.'],
  ['SPREAD_TOO_WIDE', 'liquidity_check', 'Synthetic spread exceeded the demo limit.'],
];
function rejection(id: string, p: DemoPlan, at: string, n: number, close: number): DemoEvent {
  const [code, step, why] = REJECT_CODES[n % REJECT_CODES.length];
  return ev(id, 'ENTRY_EVALUATION_REJECTED', at, p, {
    code, validationStep: step, phase: 'ENTRY_EVALUATION', observedPrice: close, observedAt: at, candleAt: plus(at, -1), candleClose: close,
    reason: `${why} Rejection is not terminal; the plan may remain eligible.`,
    recordedDetails: { code, candleClose: close, triggerPrice: p.triggerPrice, note: 'synthetic record' },
  });
}

const krnl = planBy('KRNL'), vltr = planBy('VLTR'), orbx = planBy('ORBX'), hlio = planBy('HLIO'), mrdn = planBy('MRDN'), qtza = planBy('QTZA');
const orbxCloses = [37.12, 37.31, 37.44, 37.28, 37.46, 37.39];
const hlioCloses = [141.2, 141.65, 141.8, 141.4];

export const EVENTS: DemoEvent[] = [
  ev('demo-evt-001', 'ARMED', plus(krnl.createdAt, 4), krnl, { phase: 'ARMING', reason: 'Plan armed after the synthetic validation step passed.' }),
  rejection('demo-evt-002', krnl, '2025-06-10T14:45:00Z', 0, 83.9),
  rejection('demo-evt-003', krnl, '2025-06-10T15:15:00Z', 2, 84.35),
  ev('demo-evt-004', 'PAPER_ENTRY_CLAIMED', '2025-06-10T15:46:00Z', krnl, { phase: 'ENTRY', reason: 'Entry claimed for simulated execution.' }),
  ev('demo-evt-005', 'PAPER_ENTRY_OPENED', krnl.executedAt!, krnl, { phase: 'ENTRY', observedPrice: 84.2, observedAt: krnl.executedAt, reason: 'Simulated entry opened at 84.20 for 120 shares.' }),
  ev('demo-evt-006', 'ARMED', plus(vltr.createdAt, 3), vltr, { phase: 'ARMING', reason: 'Plan armed after the synthetic validation step passed.' }),
  ev('demo-evt-007', 'PAPER_ENTRY_OPENED', vltr.executedAt!, vltr, { phase: 'ENTRY', observedPrice: 212.4, observedAt: vltr.executedAt, reason: 'Simulated short entry opened at 212.40 for 60 shares.' }),
  ev('demo-evt-008', 'ARMED', plus(orbx.createdAt, 5), orbx, { phase: 'ARMING', reason: 'Plan armed after the synthetic validation step passed.' }),
  ...orbxCloses.map((c, i) => rejection(`demo-evt-01${i}`, orbx, plus('2025-06-11T14:45:00Z', i * 30), i, c)),
  ev('demo-evt-020', 'ARMED', plus(hlio.createdAt, 4), hlio, { phase: 'ARMING', reason: 'Plan armed after the synthetic validation step passed.' }),
  ...hlioCloses.map((c, i) => rejection(`demo-evt-02${i + 1}`, hlio, plus('2025-06-09T15:30:00Z', i * 45), i + 1, c)),
  ev('demo-evt-030', 'ARMED_PLAN_EXPIRED', hlio.expiresAt, hlio, { derived: true, phase: 'EXPIRY', reason: 'Derived when read: expiry time passed with no recorded entry.' }),
  ev('demo-evt-031', 'ARMED', plus(mrdn.createdAt, 3), mrdn, { phase: 'ARMING', reason: 'Plan armed after the synthetic validation step passed.' }),
  ev('demo-evt-032', 'PAPER_ENTRY_OPENED', mrdn.executedAt!, mrdn, { phase: 'ENTRY', observedPrice: 58, observedAt: mrdn.executedAt, reason: 'Simulated short entry opened at 58.00 for 40 shares.' }),
  ev('demo-evt-033', 'PAPER_POSITION_UPDATED', '2025-06-09T19:30:00Z', mrdn, { phase: 'MANAGEMENT', observedPrice: 56.9, observedAt: '2025-06-09T19:30:00Z', reason: 'Synthetic mark updated; stop and target unchanged.' }),
  ev('demo-evt-034', 'PAPER_POSITION_CLOSED', mrdn.closedAt!, mrdn, { phase: 'EXIT', observedPrice: 55.6, observedAt: mrdn.closedAt, reason: 'Simulated close at 55.60, realized +96.00 on 40 shares.' }),
  ev('demo-evt-035', 'ARMED', plus(qtza.createdAt, 4), qtza, { phase: 'ARMING', reason: 'Plan armed after the synthetic validation step passed.' }),
  rejection('demo-evt-036', qtza, '2025-06-11T17:30:00Z', 1, 19.62),
  rejection('demo-evt-037', qtza, '2025-06-11T18:00:00Z', 3, 19.71),
].sort((a, b) => b.at.localeCompare(a.at));

// ---------- decisions ----------
const dec = (runId: string, symbol: string, decision: DecisionValue, completedAt: string, reasoning: string, approvedPlanId: string | null): DemoDecision =>
  ({ runId, symbol, decision, completedAt, reasoning, approvedPlanId });

const authored: DemoDecision[] = [
  dec('demo-run-krnl-0610', 'KRNL', 'LONG', krnl.createdAt, 'Synthetic example. The invented analyses agreed on a constructive setup with defined risk, and the demo rule set validated size and levels. A plan was written to wait for confirmation above the trigger rather than chase the current price.', krnl.planId),
  dec('demo-run-vltr-0610', 'VLTR', 'SHORT', vltr.createdAt, 'Synthetic example. Weak relative behavior and a failed rebound supported a short plan. The demo validation accepted the stop distance and quantity.', vltr.planId),
  dec('demo-run-orbx-0611', 'ORBX', 'LONG', orbx.createdAt, 'Synthetic example. Repeated tests of a resistance level with shrinking pullbacks. Armed with a strict close-above confirmation.', orbx.planId),
  dec('demo-run-hlio-0609', 'HLIO', 'LONG', hlio.createdAt, 'Synthetic example. Modest setup with a short expiry window; approved with low conviction.', hlio.planId),
  dec('demo-run-mrdn-0609', 'MRDN', 'SHORT', mrdn.createdAt, 'Synthetic example. Failed retest of a support shelf with weak sector context. Short plan approved.', mrdn.planId),
  dec('demo-run-qtza-0611', 'QTZA', 'LONG', qtza.createdAt, 'Synthetic example. Base near a floor with compressing volatility; approved with a conservative stop.', qtza.planId),
  dec('demo-run-taln-0611', 'TALN', 'NO_TRADE', '2025-06-11T15:20:00Z', 'Synthetic example. The invented analyses disagreed on direction and the book looked thin, so no plan was written.', null),
];

const FILL_SYMBOLS = ['BRXN', 'TALN', 'SOLV', 'ENVY', 'KRNL', 'VLTR', 'ORBX', 'HLIO', 'MRDN', 'QTZA'];
const NO_TRADE_TEXT = [
  'Synthetic example. Mixed views across the invented analyses; conviction stayed below the demo threshold.',
  'Synthetic example. Setup was attractive but the demo reward/risk estimate fell short of the minimum.',
  'Synthetic example. Fictional macro calendar risk made the holding window unattractive.',
  'Synthetic example. Illustrative liquidity checks flagged a wide spread; no plan written.',
  'Synthetic example. Price was already extended from the demo trigger zone; waiting was preferred.',
  'Synthetic example. Crowd positioning looked one-sided in the fixture, so the idea was skipped.',
  'Synthetic example. Structure and thesis conflicted; the debate did not converge.',
  'Synthetic example. Recent invented news reduced confidence in the entry timing.',
];
const REJECTED_TRADE_TEXT = [
  'Synthetic example. A directional view was proposed, but the demo risk rules rejected the position size, so no plan was approved.',
  'Synthetic example. A directional view was proposed; the demo validation failed on stop distance, so no plan was approved.',
];
const fillers: DemoDecision[] = Array.from({ length: 28 }, (_, i) => {
  const at = iso(new Date('2025-06-11T19:10:00Z').getTime() - (i + 1) * 173 * 60000);
  const sym = FILL_SYMBOLS[(i * 3 + 1) % FILL_SYMBOLS.length];
  const tradeish = i % 9 === 4;
  const value: DecisionValue = tradeish ? (i % 2 ? 'LONG' : 'SHORT') : 'NO_TRADE';
  return dec(`demo-run-${sym.toLowerCase()}-f${String(i + 1).padStart(2, '0')}`, sym, value, at, tradeish ? REJECTED_TRADE_TEXT[i % 2] : NO_TRADE_TEXT[i % NO_TRADE_TEXT.length], null);
});
export const DECISIONS: DemoDecision[] = [...authored, ...fillers].sort((a, b) => b.completedAt.localeCompare(a.completedAt));

// ---------- conversations ----------
type Msg = [sender: string, recipient: string, type: string, summary: string, body: string, evidence?: string[], revises?: number];
const NOTE = 'Hand-written demo text. No AI provider or model produced this message.';
function conv(id: string, sym: string, pl: DemoPlan | null, decision: string, startedAt: string, msgs: Msg[], coverage: string): Replay {
  const messages: ReplayMessage[] = msgs.map((m, n) => ({
    id: `${id}-m${n + 1}`, sequence: n + 1, sender: m[0], recipient: m[1], type: m[2], summary: m[3], body: m[4],
    createdAt: plus(startedAt, n * 2.5), provider: 'synthetic-demo', model: 'hand-written-fixture', attributionNote: NOTE,
    supersedesMessageId: m[6] ? `${id}-m${m[6]}` : null, evidenceIds: m[5] ?? [],
  }));
  return {
    summary: { id, opportunityId: id.replace('conv', 'opp'), symbol: sym, status: 'COMPLETED', phase: pl ? 'PLAN_WRITTEN' : 'CLOSED_NO_PLAN', decision, source: 'synthetic_demo_fixture', startedAt, updatedAt: messages[messages.length - 1].createdAt, messageCount: messages.length, coverageNote: coverage },
    messages, notes: ['All messages are fictional demonstration text. Roles mirror the interface layout only.'],
  };
}
const cov = 'Complete demo transcript; every message in this fictional run is shown.';
export const CONVERSATIONS: Replay[] = [
  conv('demo-conv-orbx-0611', 'ORBX', orbx, 'LONG', '2025-06-11T14:12:00Z', [
    ['THESIS', 'ROOM', 'ANALYSIS', 'Resistance probe with contracting pullbacks', 'In this fictional case ORBX has tested the same level three times and each pullback is shallower than the last. The idea is a breakout attempt, valid only if a candle closes through the trigger.', ['demo-evd-orbx-01']],
    ['CROWD_FLOW', 'ROOM', 'ANALYSIS', 'Positioning looks balanced, not crowded', 'The invented flow summary shows neither heavy chasing nor heavy fading. That leaves room for a move without a crowded unwind risk.', ['demo-evd-orbx-02']],
    ['BOOK_STRUCTURE', 'THESIS', 'CHALLENGE', 'Spread widens into the close', 'The fixture book thins late in the session. Any entry should require a closed candle, not an intrabar poke.', ['demo-evd-orbx-03']],
    ['EXTERNAL_STATE', 'ROOM', 'ANALYSIS', 'No scheduled catalyst in the window', 'The fictional calendar has nothing scheduled before expiry, which keeps the holding window clean.', []],
    ['SYNTHESIS', 'ROOM', 'FINAL_SYNTHESIS', 'Arm a confirmation-gated long', 'Combined demo view: modest conviction, defined stop, strict confirmation. A plan is written and armed; nothing is entered until confirmation.', []],
  ], cov),
  conv('demo-conv-krnl-0610', 'KRNL', krnl, 'LONG', '2025-06-10T13:55:00Z', [
    ['THESIS', 'ROOM', 'ANALYSIS', 'Range compression under a swing high', 'The fictional KRNL chart narrows beneath a prior high. A close above it would put the demo plan in motion.', ['demo-evd-krnl-01']],
    ['CROWD_FLOW', 'ROOM', 'ANALYSIS', 'Interest is building quietly', 'Invented flow metrics rise without a spike, which the fixture treats as orderly accumulation.', ['demo-evd-krnl-02']],
    ['BOOK_STRUCTURE', 'ROOM', 'ANALYSIS', 'Depth is adequate for the planned size', 'The synthetic book can absorb 120 shares with negligible impact.', ['demo-evd-krnl-03']],
    ['BOOK_STRUCTURE', 'ROOM', 'REVISION', 'Revised: depth thins above the trigger', 'Correcting the earlier note: depth is adequate at the trigger but thinner two levels higher, so the target should not be stretched.', ['demo-evd-krnl-03'], 3],
    ['SYNTHESIS', 'ROOM', 'FINAL_SYNTHESIS', 'Long with defined risk', 'The demo debate converges on a long with a stop below the range and a target short of the thin zone. Plan size passes the demo validation rules.', []],
  ], cov),
  conv('demo-conv-vltr-0610', 'VLTR', vltr, 'SHORT', '2025-06-10T16:08:00Z', [
    ['THESIS', 'ROOM', 'ANALYSIS', 'Failed rebound beneath support', 'The fictional price bounced and stalled beneath a former floor, forming a lower high.', ['demo-evd-vltr-01']],
    ['CROWD_FLOW', 'ROOM', 'CHALLENGE', 'Short interest is already elevated', 'The invented positioning gauge warns that a squeeze could hurt. This argues for a wider stop and smaller size.', ['demo-evd-vltr-02']],
    ['EXTERNAL_STATE', 'ROOM', 'ANALYSIS', 'Peer group is soft', 'Fictional peers are also weak, which supports a relative-weakness reading.', []],
    ['SYNTHESIS', 'ROOM', 'FINAL_SYNTHESIS', 'Short, reduced size', 'Direction accepted, size reduced to respect squeeze risk. The plan arms and waits for a close below the trigger.', []],
  ], cov),
  conv('demo-conv-taln-0611', 'TALN', null, 'NO_TRADE', '2025-06-11T15:04:00Z', [
    ['THESIS', 'ROOM', 'ANALYSIS', 'Slight bullish lean', 'The fixture chart leans bullish but without a clear level to define risk.', ['demo-evd-taln-01']],
    ['CROWD_FLOW', 'ROOM', 'CHALLENGE', 'Flow disagrees with the thesis', 'Invented flow turns negative late in the window, contradicting the lean.', ['demo-evd-taln-02']],
    ['BOOK_STRUCTURE', 'ROOM', 'ANALYSIS', 'Book is thin', 'Synthetic depth is too light to support the planned size cleanly.', []],
    ['SYNTHESIS', 'ROOM', 'FINAL_SYNTHESIS', 'No trade', 'Views conflict and liquidity is poor. The demo run closes without a plan, which is a valid outcome.', []],
  ], cov),
].sort((a, b) => b.summary.startedAt.localeCompare(a.summary.startedAt));
