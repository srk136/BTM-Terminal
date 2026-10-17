/**
 * Policy-parameterized extraction of BTM-Core's deterministic Risk Engine V1.
 * No strategy, market-data access, persistence, execution, or default policy.
 */
export type RiskEngineV1Decision = "LONG" | "SHORT" | "NO_TRADE";

export type RiskEngineV1Input = {
  candidate: {
    decision: RiskEngineV1Decision;
    symbol: string;
    entryPrice: number;
    invalidationPrice: number;
  };
  account: {
    accountEquity: number;
    buyingPower: number;
    currentGrossExposure: number;
    /** Gross exposure in the candidate symbol, required for nonempty accounts. */
    currentSymbolExposure?: number;
    openPositionCount: number;
    dailyPnL: number;
  };
};

/** All values must be supplied by the caller; no private BTM limits are included. */
export type RiskPolicy = Readonly<{
  maxRiskFraction: number;
  maxSymbolValueFraction: number;
  maxTotalLeverage: number;
  dailyLossLimitFraction: number;
  maxOpenPositions: number;
}>;

export type RiskEngineV1Result = {
  status: "APPROVED" | "REJECTED";
  reason: string;
  symbol: string;
  direction: RiskEngineV1Decision;
  approvedQuantity: number;
  entryPrice: number;
  invalidationPrice: number;
  stopDistance: number;
  maximumDollarRisk: number;
  actualDollarRisk: number;
  positionNotional: number;
  resultingGrossExposure: number;
  resultingLeverage: number;
};

export function evaluateRiskEngineV1(
  input: RiskEngineV1Input,
  policy: RiskPolicy,
): RiskEngineV1Result {
  assertRiskPolicy(policy);
  const { candidate, account } = input;
  const maximumDollarRisk = account.accountEquity * policy.maxRiskFraction;
  const base = {
    symbol: candidate.symbol,
    direction: candidate.decision,
    approvedQuantity: 0,
    entryPrice: candidate.entryPrice,
    invalidationPrice: candidate.invalidationPrice,
    stopDistance: 0,
    maximumDollarRisk,
    actualDollarRisk: 0,
    positionNotional: 0,
    resultingGrossExposure: account.currentGrossExposure,
    resultingLeverage:
      account.accountEquity > 0
        ? account.currentGrossExposure / account.accountEquity
        : 0,
  };

  if (candidate.decision === "NO_TRADE") {
    return rejected(base, "NO_TRADE candidates cannot be approved");
  }

  const symbolExposure = account.currentSymbolExposure ??
    (account.openPositionCount === 0 && account.currentGrossExposure === 0 ? 0 : NaN);
  if (!isPositiveFinite(account.accountEquity) ||
    ![account.buyingPower, account.currentGrossExposure, symbolExposure].every(n => Number.isFinite(n) && n >= 0) ||
    !Number.isSafeInteger(account.openPositionCount) || account.openPositionCount < 0 ||
    ((account.openPositionCount === 0) !== (account.currentGrossExposure === 0)) ||
    !Number.isFinite(account.dailyPnL) || symbolExposure > account.currentGrossExposure + 1e-8) {
    return rejected(base, "Missing or invalid account/symbol exposure state");
  }

  if (
    !isPositiveFinite(candidate.entryPrice) ||
    !isPositiveFinite(candidate.invalidationPrice) ||
    candidate.entryPrice === candidate.invalidationPrice
  ) {
    return rejected(base, "Entry and invalidation prices must be positive, finite, and different");
  }

  const stopDistance = Math.abs(candidate.entryPrice - candidate.invalidationPrice);
  const withStop = { ...base, stopDistance };

  if (account.dailyPnL <= -(account.accountEquity * policy.dailyLossLimitFraction)) {
    return rejected(withStop, "Daily loss limit reached");
  }

  if (account.openPositionCount >= policy.maxOpenPositions) {
    return rejected(withStop, "Maximum open positions reached");
  }

  const riskBasedQuantity = Math.floor(maximumDollarRisk / stopDistance);
  const symbolCapQuantity = Math.floor(
    Math.max(0, account.accountEquity * policy.maxSymbolValueFraction - symbolExposure) /
      candidate.entryPrice,
  );
  const buyingPowerQuantity = Math.floor(account.buyingPower / candidate.entryPrice);
  const remainingLeverageRoom = Math.max(
    0,
    account.accountEquity * policy.maxTotalLeverage - account.currentGrossExposure,
  );
  const leverageQuantity = Math.floor(remainingLeverageRoom / candidate.entryPrice);
  const approvedQuantity = Math.min(
    riskBasedQuantity,
    symbolCapQuantity,
    buyingPowerQuantity,
    leverageQuantity,
  );

  if (approvedQuantity < 1) {
    return rejected(withStop, "Risk limits allow less than one share");
  }

  const actualDollarRisk = approvedQuantity * stopDistance;
  const positionNotional = approvedQuantity * candidate.entryPrice;
  const resultingGrossExposure = account.currentGrossExposure + positionNotional;

  return {
    status: "APPROVED",
    reason: "APPROVED",
    symbol: candidate.symbol,
    direction: candidate.decision,
    approvedQuantity,
    entryPrice: candidate.entryPrice,
    invalidationPrice: candidate.invalidationPrice,
    stopDistance,
    maximumDollarRisk,
    actualDollarRisk,
    positionNotional,
    resultingGrossExposure,
    resultingLeverage: resultingGrossExposure / account.accountEquity,
  };
}

function rejected(
  result: Omit<RiskEngineV1Result, "status" | "reason">,
  reason: string,
): RiskEngineV1Result {
  return { status: "REJECTED", reason, ...result };
}

function isPositiveFinite(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

/** Public configuration boundary; malformed policy fails explicitly, never defaults. */
function assertRiskPolicy(policy: RiskPolicy): void {
  if (!policy ||
    ![policy.maxRiskFraction, policy.maxSymbolValueFraction, policy.dailyLossLimitFraction]
      .every(n => isPositiveFinite(n) && n <= 1) ||
    !isPositiveFinite(policy.maxTotalLeverage) ||
    !Number.isSafeInteger(policy.maxOpenPositions) || policy.maxOpenPositions < 1) {
    throw new RangeError("A complete, valid explicit risk policy is required");
  }
}
