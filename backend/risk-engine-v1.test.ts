import { describe, expect, it } from 'vitest';
import { evaluateRiskEngineV1, type RiskEngineV1Input, type RiskPolicy } from './risk-engine-v1';

// Deliberately illustrative policy, NOT BTM-Core's confidential configuration.
const policy: RiskPolicy = Object.freeze({
  maxRiskFraction: 0.007,
  maxSymbolValueFraction: 0.18,
  maxTotalLeverage: 1.6,
  dailyLossLimitFraction: 0.025,
  maxOpenPositions: 6,
});
const input: RiskEngineV1Input = {
  candidate: { symbol: 'DEMO', decision: 'LONG', entryPrice: 50, invalidationPrice: 48 },
  account: {
    accountEquity: 20_000, buyingPower: 20_000, currentGrossExposure: 2_000,
    currentSymbolExposure: 500, openPositionCount: 1, dailyPnL: 0,
  },
};
function evaluate(
  candidate: Partial<RiskEngineV1Input['candidate']> = {},
  account: Partial<RiskEngineV1Input['account']> = {},
  overrides: Partial<RiskPolicy> = {},
) {
  return evaluateRiskEngineV1({
    candidate: { ...input.candidate, ...candidate },
    account: { ...input.account, ...account },
  }, { ...policy, ...overrides });
}

describe('extracted deterministic Risk Engine V1', () => {
  it.each(['LONG', 'SHORT'] as const)('approves a %s proposal with complete sizing output', (decision) => {
    const result = evaluate({ decision, invalidationPrice: decision === 'LONG' ? 48 : 52 });
    expect(result).toMatchObject({
      status: 'APPROVED', direction: decision, approvedQuantity: 62,
      maximumDollarRisk: 140, actualDollarRisk: 124, positionNotional: 3100,
      resultingGrossExposure: 5100, resultingLeverage: 0.255,
    });
  });
  it('sizes by dollar risk when it is the tightest constraint', () => {
    const result = evaluate({ invalidationPrice: 40 });
    expect(result.approvedQuantity).toBe(14);
    expect(result.actualDollarRisk).toBe(140);
  });
  it('subtracts existing candidate-symbol exposure from symbol headroom', () => {
    expect(evaluate({}, { currentSymbolExposure: 1900 }).approvedQuantity).toBe(34);
  });
  it('limits quantity to available buying power and floors whole shares', () => {
    expect(evaluate({}, { buyingPower: 129 }).approvedQuantity).toBe(2);
  });
  it('limits resulting gross leverage', () => {
    const result = evaluate({}, { currentGrossExposure: 31_850 });
    expect(result.approvedQuantity).toBe(3);
    expect(result.resultingLeverage).toBe(1.6);
  });
  it('rejects NO_TRADE', () => {
    expect(evaluate({ decision: 'NO_TRADE' })).toMatchObject({ status: 'REJECTED', approvedQuantity: 0 });
  });
  it('rejects at the inclusive daily-loss boundary, but not just above it', () => {
    expect(evaluate({}, { dailyPnL: -500 }).reason).toBe('Daily loss limit reached');
    expect(evaluate({}, { dailyPnL: -499 }).status).toBe('APPROVED');
  });
  it('rejects when the open-position cap is reached', () => {
    expect(evaluate({}, { openPositionCount: 6 }).reason).toBe('Maximum open positions reached');
  });
  it.each([50, 0, -1, NaN, Infinity])('rejects invalid invalidation price %s', (invalidationPrice) => {
    expect(evaluate({ invalidationPrice }).reason)
      .toBe('Entry and invalidation prices must be positive, finite, and different');
  });
  it.each([0, -1, NaN, Infinity])('rejects invalid entry price %s', (entryPrice) => {
    expect(evaluate({ entryPrice }).status).toBe('REJECTED');
  });
  it.each([
    { accountEquity: 0 }, { accountEquity: NaN }, { buyingPower: -1 },
    { currentGrossExposure: -1 }, { currentSymbolExposure: undefined },
    { currentSymbolExposure: 2001 }, { openPositionCount: 0 },
    { openPositionCount: 1.5 }, { dailyPnL: Infinity },
  ])('rejects inconsistent or incomplete account state %#', (account) => {
    expect(evaluate({}, account).reason).toBe('Missing or invalid account/symbol exposure state');
  });
  it('allows omitted symbol exposure only for an empty account', () => {
    expect(evaluate({}, {
      currentGrossExposure: 0, openPositionCount: 0, currentSymbolExposure: undefined,
    }).status).toBe('APPROVED');
  });
  it.each([
    { buyingPower: 0 }, { currentSymbolExposure: 2000, currentGrossExposure: 2000 },
    { currentGrossExposure: 32000 },
  ])('rejects exhausted headroom %#', (account) => {
    const overrides = 'currentSymbolExposure' in account ? { maxSymbolValueFraction: 0.1 } : {};
    expect(evaluate({}, account, overrides)).toMatchObject({
      status: 'REJECTED', reason: 'Risk limits allow less than one share', approvedQuantity: 0,
    });
  });
  it('rejects when risk permits less than one whole share', () => {
    expect(evaluate({ invalidationPrice: 500 }).status).toBe('REJECTED');
  });
  it('uses the supplied policy rather than a hidden default', () => {
    expect(evaluate({}, {}, { maxRiskFraction: 0.001 }).approvedQuantity).toBe(10);
  });
  it.each([
    { maxRiskFraction: NaN }, { maxRiskFraction: 0 }, { maxSymbolValueFraction: 2 },
    { maxTotalLeverage: Infinity }, { dailyLossLimitFraction: -1 }, { maxOpenPositions: 2.5 },
  ])('fails explicitly on invalid policy %#', (overrides) => {
    expect(() => evaluate({}, {}, overrides)).toThrow(RangeError);
  });
  it('does not silently supply a missing policy', () => {
    expect(() => evaluateRiskEngineV1(input, undefined as unknown as RiskPolicy)).toThrow(RangeError);
  });
  it('is deterministic and does not mutate inputs or policy', () => {
    const copy = structuredClone(input);
    expect(evaluateRiskEngineV1(input, policy)).toEqual(evaluateRiskEngineV1(input, policy));
    expect(input).toEqual(copy);
  });
});
