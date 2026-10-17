// Self-contained public types for the synthetic demonstration dataset.

export type Direction = 'LONG' | 'SHORT';
export type DecisionValue = 'LONG' | 'SHORT' | 'NO_TRADE';

export interface DemoPlan {
  planId: string;
  symbol: string;
  direction: Direction;
  status: string;
  persistedStatus: string;
  statusNote: string;
  plannedEntryPrice: number;
  stopLoss: number;
  takeProfit: number;
  approvedQuantity: number;
  triggerType: string;
  triggerPrice: number;
  plannedRewardRisk: number;
  confirmation: string;
  createdAt: string;
  expiresAt: string;
  holdingHorizon: string;
  simulatedFillPrice: number | null;
  executedQuantity: number | null;
  executedAt: string | null;
  closedPrice: number | null;
  closedAt: string | null;
  tradeThesis: string;
  supportingReasons: string[];
  risks: string[];
}

export interface DemoDecision {
  runId: string;
  symbol: string;
  decision: DecisionValue;
  completedAt: string;
  reasoning: string;
  approvedPlanId: string | null;
}

export interface DemoEvent {
  id: string;
  kind: string;
  at: string;
  symbol: string;
  planId: string;
  direction: Direction;
  persistedStatus: string;
  effectiveStatus: string;
  validationStep: string | null;
  code: string | null;
  phase: string | null;
  observedPrice: number | null;
  observedAt: string | null;
  confirmation: string | null;
  rewardRisk: number | null;
  candleAt: string | null;
  candleClose: number | null;
  triggerPrice: number | null;
  stop: number | null;
  target: number | null;
  reason: string | null;
  derived: boolean;
  recordedDetails: Record<string, string | number | null> | null;
}

export interface DemoPosition {
  positionId: string;
  symbol: string;
  direction: Direction;
  quantity: number;
  fillPrice: number;
  observedPrice: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  stopLoss: number;
  takeProfit: number;
  priceAsOf: string;
  priceSource: string;
}

export interface DemoPortfolio {
  label: string;
  accountEquity: number;
  cash: number;
  buyingPower: number;
  realizedPnl: number;
  unrealizedPnl: number;
  grossExposure: number;
  openPositionCount: number;
}

export interface DemoModelTelemetry {
  accountingDate: string;
  illustrativeRequestCount: number;
  illustrativeReservationCount: number;
  rows: { label: string; value: number; hint?: string }[];
  providerCalls: number;
  networkDataRequests: number;
}

export interface DemoDashboard {
  asOf: string;
  portfolio: DemoPortfolio;
  positions: DemoPosition[];
  telemetry: DemoModelTelemetry;
  latestDecisionAt: string;
  latestTradingAt: string;
  decisions: DemoDecision[];
  tradingEvents: DemoEvent[];
  entryRejections: DemoEvent[];
}

export interface PageResult<T> { items: T[]; total: number; page: number; pageSize: number; asOf: string }
export interface DecisionPage extends PageResult<DemoDecision> { symbols: string[]; decisionTypes: string[] }
export interface EventPage extends PageResult<DemoEvent> { symbols: string[]; eventTypes: string[] }

export interface ReplayMessage {
  id: string;
  sequence: number;
  sender: string;
  recipient: string | null;
  type: string;
  summary: string;
  body: string;
  createdAt: string;
  provider: string | null;
  model: string | null;
  attributionNote: string | null;
  supersedesMessageId: string | null;
  evidenceIds: string[];
}

export interface ReplaySummary {
  id: string;
  opportunityId: string;
  symbol: string | null;
  status: string;
  phase: string;
  decision: string | null;
  source: string;
  startedAt: string;
  updatedAt: string;
  messageCount: number;
  coverageNote: string;
}

export interface Replay { summary: ReplaySummary; messages: ReplayMessage[]; notes: string[] }
