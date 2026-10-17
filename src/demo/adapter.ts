// Local, synchronous demonstration adapter. No network, storage or timers.
import { CONVERSATIONS, DECISIONS, DEMO_AS_OF, EVENTS, MARKS, PLANS } from './data';
import type { DecisionPage, DemoDashboard, DemoPlan, DemoPortfolio, DemoPosition, EventPage, Replay, ReplaySummary } from './types';

export const PAGE_SIZE = 20;
const round2 = (n: number) => Math.round(n * 100) / 100;
const etDay = (iso: string) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));
const unique = (v: string[]) => Array.from(new Set(v)).sort();

export function totalPages(total: number, pageSize: number) { return Math.max(1, Math.ceil(total / Math.max(1, pageSize))); }
export function pageRange(total: number, page: number, pageSize: number) {
  return total === 0 ? { from: 0, to: 0 } : { from: (page - 1) * pageSize + 1, to: Math.min(total, page * pageSize) };
}
function paginate<T>(rows: T[], page: number) {
  const p = Math.min(Math.max(1, Math.floor(page) || 1), totalPages(rows.length, PAGE_SIZE));
  return { items: rows.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE), total: rows.length, page: p, pageSize: PAGE_SIZE, asOf: DEMO_AS_OF };
}

export interface DecisionQuery { page: number; symbol?: string; decision?: string; date?: string }
export function getDecisions(q: DecisionQuery): DecisionPage {
  const rows = DECISIONS.filter((d) => (!q.symbol || d.symbol === q.symbol) && (!q.decision || d.decision === q.decision) && (!q.date || etDay(d.completedAt) === q.date));
  return { ...paginate(rows, q.page), symbols: unique(DECISIONS.map((d) => d.symbol)), decisionTypes: unique(DECISIONS.map((d) => d.decision)) };
}

export interface EventQuery { page: number; symbol?: string; eventType?: string; date?: string }
export function getEvents(q: EventQuery): EventPage {
  const rows = EVENTS.filter((e) => (!q.symbol || e.symbol === q.symbol) && (!q.eventType || e.kind === q.eventType) && (!q.date || etDay(e.at) === q.date));
  return { ...paginate(rows, q.page), symbols: unique(EVENTS.map((e) => e.symbol)), eventTypes: unique(EVENTS.map((e) => e.kind)) };
}

export function getPlans(): { plans: DemoPlan[]; asOf: string } {
  return { plans: [...PLANS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), asOf: DEMO_AS_OF };
}

export function getPositions(): DemoPosition[] {
  return PLANS.filter((p) => p.status === 'ENTERED' && p.simulatedFillPrice != null && p.executedQuantity != null).map((p) => {
    const fill = p.simulatedFillPrice!, qty = p.executedQuantity!, mark = MARKS[p.symbol];
    const pnl = round2((p.direction === 'LONG' ? mark - fill : fill - mark) * qty);
    return {
      positionId: `demo-pos-${p.symbol.toLowerCase()}`, symbol: p.symbol, direction: p.direction, quantity: qty, fillPrice: fill, observedPrice: mark,
      unrealizedPnl: pnl, unrealizedPnlPercent: round2((pnl / (fill * qty)) * 100), stopLoss: p.stopLoss, takeProfit: p.takeProfit,
      priceAsOf: DEMO_AS_OF, priceSource: 'synthetic fixture mark',
    };
  });
}

export function getPortfolio(): DemoPortfolio {
  const start = 100000;
  const positions = getPositions();
  const realized = round2(PLANS.filter((p) => p.closedPrice != null).reduce((s, p) => s + (p.direction === 'LONG' ? p.closedPrice! - p.simulatedFillPrice! : p.simulatedFillPrice! - p.closedPrice!) * p.executedQuantity!, 0));
  const unrealized = round2(positions.reduce((s, p) => s + p.unrealizedPnl, 0));
  const gross = round2(positions.reduce((s, p) => s + p.observedPrice * p.quantity, 0));
  const cash = round2(start + realized + positions.reduce((s, p) => s + (p.direction === 'LONG' ? -1 : 1) * p.fillPrice * p.quantity, 0));
  const equity = round2(start + realized + unrealized);
  return { label: 'Synthetic validation portfolio. Not a brokerage account.', accountEquity: equity, cash, buyingPower: round2(equity * 2 - gross), realizedPnl: realized, unrealizedPnl: unrealized, grossExposure: gross, openPositionCount: positions.length };
}

export function getDashboard(): DemoDashboard {
  const trading = EVENTS.filter((e) => e.kind !== 'ENTRY_EVALUATION_REJECTED');
  return {
    asOf: DEMO_AS_OF, portfolio: getPortfolio(), positions: getPositions(),
    telemetry: {
      accountingDate: '2025-06-11', illustrativeRequestCount: 41, illustrativeReservationCount: 1, providerCalls: 0, networkDataRequests: 0,
      rows: [
        { label: 'Illustrative provider A spend', value: 4.1875, hint: 'Fictional figure' },
        { label: 'Illustrative provider A reservations', value: 0.42, hint: 'Fictional figure' },
        { label: 'Illustrative all-provider spend', value: 6.3125, hint: 'Fictional figure' },
        { label: 'Illustrative all-provider reservations', value: 0.42 },
        { label: 'Illustrative daily allowance', value: 25, hint: 'Fictional UTC-day allowance' },
        { label: 'Illustrative remaining allowance', value: 18.2675, hint: 'Allowance less spend and reservations' },
      ],
    },
    latestDecisionAt: DECISIONS[0].completedAt, latestTradingAt: trading[0].at,
    decisions: DECISIONS.slice(0, 5), tradingEvents: trading.slice(0, 8),
    entryRejections: EVENTS.filter((e) => e.kind === 'ENTRY_EVALUATION_REJECTED').slice(0, 8),
  };
}

export function listConversations(): ReplaySummary[] { return CONVERSATIONS.map((c) => c.summary); }
export function getConversation(id: string): Replay | null { return CONVERSATIONS.find((c) => c.summary.id === id) ?? null; }
