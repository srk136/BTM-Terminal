import { describe, expect, it } from 'vitest';
import { CONVERSATIONS, DECISIONS, EVENTS, PLANS } from './data';
import { getConversation, getDecisions, getEvents, getPortfolio, getPositions, listConversations } from './adapter';

describe('synthetic dataset consistency', () => {
  it('links every approved decision and event to an existing plan', () => {
    const ids = new Set(PLANS.map((p) => p.planId));
    DECISIONS.filter((d) => d.approvedPlanId).forEach((d) => expect(ids.has(d.approvedPlanId!)).toBe(true));
    EVENTS.forEach((e) => expect(ids.has(e.planId)).toBe(true));
  });
  it('paginates decisions and events across more than one page', () => {
    expect(getDecisions({ page: 1 }).items).toHaveLength(20);
    expect(getDecisions({ page: 2 }).items.length).toBeGreaterThan(0);
    expect(getEvents({ page: 2 }).items.length).toBeGreaterThan(0);
  });
  it('filters by symbol and decision', () => {
    expect(getDecisions({ page: 1, symbol: 'KRNL' }).items.every((d) => d.symbol === 'KRNL')).toBe(true);
    expect(getEvents({ page: 1, eventType: 'ARMED' }).items.every((e) => e.kind === 'ARMED')).toBe(true);
  });
  it('portfolio reconciles with positions', () => {
    const p = getPortfolio();
    expect(getPositions()).toHaveLength(p.openPositionCount);
    expect(p.accountEquity).toBeCloseTo(100000 + p.realizedPnl + p.unrealizedPnl, 2);
  });
  it('conversations are selectable and labelled as hand-written demo text', () => {
    expect(listConversations().length).toBe(CONVERSATIONS.length);
    const c = getConversation(CONVERSATIONS[0].summary.id)!;
    expect(c.messages.every((m) => m.provider === 'synthetic-demo')).toBe(true);
    expect(getConversation('missing')).toBeNull();
  });
});
