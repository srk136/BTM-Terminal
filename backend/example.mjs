import { evaluateRiskEngineV1 } from '../dist-risk/risk-engine-v1.js';

// Illustrative settings only; these are not BTM-Core's confidential limits.
const policy = {
  maxRiskFraction: 0.007,
  maxSymbolValueFraction: 0.18,
  maxTotalLeverage: 1.6,
  dailyLossLimitFraction: 0.025,
  maxOpenPositions: 6,
};
const input = {
  candidate: { symbol: 'DEMO', decision: 'LONG', entryPrice: 50, invalidationPrice: 48 },
  account: {
    accountEquity: 20_000, buyingPower: 20_000, currentGrossExposure: 2_000,
    currentSymbolExposure: 500, openPositionCount: 1, dailyPnL: 0,
  },
};
console.log('Local deterministic risk evaluation. Fictional inputs; no orders or network calls.');
console.log(evaluateRiskEngineV1(input, policy));
