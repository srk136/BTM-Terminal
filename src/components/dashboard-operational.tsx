import type { ReactNode } from 'react';
import { Link } from 'wouter';
import type { DemoDashboard } from '@/demo/types';
import { TradeActivityRow, Tag } from '@/components/trade-activity-row';
import { AiDecisionRow } from '@/components/ai-decision-row';
import { formatEt } from '@/lib/utils';

function Panel({ title, eyebrow, testId, children }: { title: string; eyebrow: string; testId: string; children: ReactNode }) {
  return <section className="ops-card reveal p-4 md:p-5" data-testid={testId}>
    <div className="eyebrow">{eyebrow}</div><h2 className="mt-1 text-lg font-semibold">{title}</h2>
    <div className="mt-4">{children}</div>
  </section>;
}
const money = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const pnl = (value: number) => `${value > 0 ? '+' : value < 0 ? '-' : ''}${money(Math.abs(value))}`;
const tone = (value: number) => value === 0 ? 'text-foreground' : value > 0 ? 'text-[#4cd694]' : 'text-[#f0716f]';

export function DashboardSystemStatus({ data }: { data: DemoDashboard }) {
  return <Panel testId="panel-system-posture" eyebrow="Demo posture" title="System Status">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div><div className="eyebrow">Mode</div><div className="mt-2"><Tag value="SYNTHETIC DEMO" tone="amber" testId="text-trading-mode" /></div><p className="mt-2 text-xs text-muted-foreground">Fictional paper-style records. Not a brokerage account and not real trading.</p></div>
      <div><div className="eyebrow">Data source</div><div className="mt-2"><Tag value="BUNDLED LOCAL FIXTURE" tone="cyan" testId="status-api" /></div><p className="mt-2 text-xs leading-5 text-muted-foreground">Read from static data shipped with this build. No API or network data calls are made.</p></div>
      <div><div className="eyebrow">Runner status</div><div className="mt-2"><Tag value="NOT APPLICABLE" testId="status-runner" /></div><p className="mt-2 text-xs leading-5 text-muted-foreground">No runner, monitor or scheduler exists in this demo. Nothing is being watched.</p></div>
      <div><div className="eyebrow">AI analysis</div><div className="mt-2"><Tag value="NONE RUNNING" testId="status-ai-analysis" /></div><p className="mt-2 text-xs leading-5 text-muted-foreground">No AI models are called. Provider and model labels are illustrative.</p></div>
      <div><div className="eyebrow">Latest synthetic activity</div><div className="mono mt-2 text-sm" data-testid="text-last-activity">{formatEt(data.latestTradingAt)}</div><p className="mt-2 text-xs leading-5 text-muted-foreground">Fixed fictional timestamps; they do not advance.</p></div>
      <div><div className="eyebrow">Synthetic records as of</div><div className="mono mt-2 text-sm" data-testid="text-as-of">{formatEt(data.asOf)}</div><p className="mt-2 text-xs leading-5 text-muted-foreground">Not market-data freshness. Refresh re-reads the same local fixture.</p></div>
    </div>
  </Panel>;
}

export function DashboardPortfolioRisk({ data }: { data: DemoDashboard }) {
  const p = data.portfolio;
  const cell = (label: string, children: ReactNode) => <div className="border border-border bg-[#151b24] p-4"><div className="eyebrow">{label}</div>{children}</div>;
  const val = (amount: number, id: string, signed = false) => <div className={`mono mt-3 text-lg ${signed ? tone(amount) : 'text-foreground'}`} data-testid={id}>{signed ? pnl(amount) : money(amount)}</div>;
  return <Panel testId="panel-portfolio-risk" eyebrow="Synthetic paper portfolio" title="Portfolio & Risk">
    <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3">
      {cell('Account equity', val(p.accountEquity, 'portfolio-account-equity'))}
      {cell('Cash', <>{val(p.cash, 'portfolio-cash')}<p className="mt-2 text-xs leading-5 text-muted-foreground">Includes fictional short proceeds.</p></>)}
      {cell('Buying power', <>{val(p.buyingPower, 'portfolio-buying-power')}<p className="mt-2 text-xs leading-5 text-muted-foreground">Simplified demo formula: 2x equity less gross exposure.</p></>)}
      {cell('Profit and loss', <><div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-2"><span className="text-xs text-muted-foreground">Realized</span>{val(p.realizedPnl, 'portfolio-realized-pnl', true)}</div><div className="flex flex-wrap items-baseline justify-between gap-x-2"><span className="text-xs text-muted-foreground">Unrealized</span>{val(p.unrealizedPnl, 'portfolio-unrealized-pnl', true)}</div></>)}
      {cell('Position exposure', <><p className="mt-2 text-xs text-muted-foreground">Gross position exposure</p>{val(p.grossExposure, 'portfolio-gross-exposure')}<p className="mt-2 text-sm" data-testid="portfolio-position-count">Open-position count: {p.openPositionCount}</p></>)}
      {cell('Market quotes', <><div className="mt-3 text-sm text-muted-foreground" data-testid="unavailable-market-quotes">Not reported</div><p className="mt-2 text-xs leading-5 text-muted-foreground">No quote feed exists in this demo. Marks are fixed fictional values.</p></>)}
    </div>
    <p className="mt-4 border-l-2 border-primary/60 bg-primary/5 px-3 py-2 text-xs leading-5 text-muted-foreground" data-testid="note-portfolio-source">{p.label} Starting capital of $100,000.00 is fictional; all figures reconcile to the synthetic plans and positions.</p>
  </Panel>;
}

export function DashboardActivityPanel({ data }: { data: DemoDashboard }) {
  return <Panel testId="panel-operational-activity" eyebrow="Synthetic records" title="Operational Activity">
    <div className="grid gap-3 sm:grid-cols-3">
      <div><div className="eyebrow">Latest synthetic AI decision</div><div className="mono mt-1 text-sm" data-testid="text-latest-decision-at">{formatEt(data.latestDecisionAt)}</div></div>
      <div><div className="eyebrow">Latest synthetic trading event</div><div className="mono mt-1 text-sm" data-testid="text-latest-trading-at">{formatEt(data.latestTradingAt)}</div></div>
      <div><div className="eyebrow">Fixture as of</div><div className="mono mt-1 text-sm" data-testid="text-activity-as-of">{formatEt(data.asOf)}</div></div>
    </div>
    <ul className="mt-3 space-y-1 text-xs text-muted-foreground" data-testid="activity-notes"><li>Every record below is fictional demonstration data.</li></ul>
    <h3 className="mt-5 text-base font-semibold">Recent AI Decisions</h3>
    <ul className="mt-2 space-y-2">{data.decisions.map((d) => <AiDecisionRow key={d.runId} d={d} noPlanText="No plan approved." />)}</ul>
    <Link href="/ai-decisions" className="mt-3 inline-block text-xs text-primary underline" data-testid="link-view-all-ai-decisions">View All AI Decisions</Link>
    <h3 className="mt-5 text-base font-semibold">Recent trading events</h3>
    <ul className="mt-2 space-y-2">{data.tradingEvents.slice(0, 5).map((e) => <TradeActivityRow key={e.id} e={e} id={`trading-${e.id}`} />)}</ul>
    <Link href="/trade-activity" className="mt-3 inline-block text-xs text-primary underline" data-testid="link-view-all-trade-activity">View All Trade Activity</Link>
    <h3 className="mt-5 text-base font-semibold">Entry rejection diagnostics</h3>
    <p className="mt-1 text-xs text-muted-foreground">A rejection is not terminal; the plan may remain eligible.</p>
    <ul className="mt-2 space-y-2">{data.entryRejections.slice(0, 5).map((e) => <TradeActivityRow key={e.id} e={e} id={`rejection-${e.id}`} />)}</ul>
    {data.entryRejections.length > 5 && <details className="mt-2" data-testid="more-rejection"><summary className="cursor-pointer text-xs text-primary">Show {data.entryRejections.length - 5} more records</summary><ul className="mt-2 space-y-2">{data.entryRejections.slice(5).map((e) => <TradeActivityRow key={e.id} e={e} id={`rejection-${e.id}`} />)}</ul></details>}
  </Panel>;
}

const usd = (v: number) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
export function DashboardModelAttribution({ data }: { data: DemoDashboard }) {
  const t = data.telemetry;
  return <Panel testId="panel-ai-usage" eyebrow="Demo telemetry" title="Model Attribution / Cost Governor (Illustrative)">
    <p className="mb-3 border-l-2 border-[#70572d] bg-[#382c19]/40 px-3 py-2 text-xs leading-5 text-[#efbd68]" data-testid="note-ai-usage-scope">Illustrative only. No AI calls are made, no provider is connected, and every figure and label below is fictional. Actual provider calls: {t.providerCalls}. Network data requests: {t.networkDataRequests}.</p>
    <dl className="mb-3 grid grid-cols-1 gap-x-4 gap-y-1 text-xs min-[420px]:grid-cols-3" data-testid="row-ai-usage-meta">
      <div><dt className="eyebrow">Fictional accounting date</dt><dd className="mono mt-1" data-testid="text-ai-utc-date">{t.accountingDate}</dd></div>
      <div><dt className="eyebrow">Illustrative request count</dt><dd className="mono mt-1" data-testid="text-ai-requests">{t.illustrativeRequestCount}</dd></div>
      <div><dt className="eyebrow">Illustrative reservations</dt><dd className="mono mt-1" data-testid="text-ai-older-reservations">{t.illustrativeReservationCount}</dd></div>
    </dl>
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
      {t.rows.map((r) => <div key={r.label} className="border border-border bg-[#151b24] p-3"><div className="eyebrow">{r.label}</div><div className="mono mt-2 text-sm">{usd(r.value)}</div>{r.hint && <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{r.hint}</p>}</div>)}
    </div>
  </Panel>;
}
