import type { ReactNode } from 'react';
import type { DemoPosition } from '@/demo/types';
import { formatEt, formatPrice, formatQuantity } from '@/lib/utils';

function signed(value: number, digits: number, prefix = ''): string {
  const rounded = Number(value.toFixed(digits));
  const sign = rounded > 0 ? '+' : rounded < 0 ? '-' : '';
  return `${sign}${prefix}${Math.abs(rounded).toFixed(digits).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}
const tone = (v: number) => (Number(v.toFixed(2)) > 0 ? 'text-[#4cd694]' : Number(v.toFixed(2)) < 0 ? 'text-[#f0716f]' : 'text-muted-foreground');

function Field({ label, children, testId }: { label: string; children: ReactNode; testId?: string }) {
  return <div className="min-w-0"><div className="eyebrow">{label}</div><div className="mono mt-1 break-words text-sm" data-testid={testId}>{children}</div></div>;
}

function Card({ p }: { p: DemoPosition }) {
  const id = p.positionId;
  return <article className="border border-border bg-[#151b24] p-4" data-testid={`position-${id}`}>
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2"><h3 className="text-lg font-semibold" data-testid={`position-symbol-${id}`}>{p.symbol}</h3>
        <span className={`border px-2 py-0.5 text-[11px] font-semibold tracking-[.1em] ${p.direction === 'LONG' ? 'border-primary/50 bg-primary/10 text-primary' : 'border-[#70572d] bg-[#382c19] text-[#efbd68]'}`} data-testid={`position-direction-${id}`}>{p.direction}</span></div>
      <span className="border border-[#70572d] px-2 py-0.5 text-[11px] font-semibold tracking-[.1em] text-[#efbd68]" data-testid={`position-freshness-${id}`}>SYNTHETIC MARK</span>
    </div>
    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-4">
      <Field label="Shares" testId={`position-quantity-${id}`}>{formatQuantity(p.quantity)}</Field>
      <Field label="Fill price (synthetic)" testId={`position-fill-${id}`}>{formatPrice(p.fillPrice)}</Field>
      <Field label="Demo mark" testId={`position-price-${id}`}>{formatPrice(p.observedPrice)}</Field>
      <Field label="Unrealized P&L"><span className={`font-semibold ${tone(p.unrealizedPnl)}`} data-testid={`pnl-${id}`}>{signed(p.unrealizedPnl, 2, '$')}</span>{' '}<span className={tone(p.unrealizedPnlPercent)} data-testid={`pnl-percent-${id}`}>({signed(p.unrealizedPnlPercent, 2)}%)</span></Field>
      <Field label="Stop-loss" testId={`position-stop-${id}`}>{formatPrice(p.stopLoss)}</Field>
      <Field label="Take-profit" testId={`position-target-${id}`}>{formatPrice(p.takeProfit)}</Field>
      <div className="col-span-2 min-w-0"><div className="eyebrow">Mark timestamp / source</div>
        <div className="mono mt-1 break-words text-xs text-muted-foreground" data-testid={`position-price-time-${id}`}>{formatEt(p.priceAsOf)} · {p.priceSource}</div></div>
    </div>
  </article>;
}

export function OpenPositions({ positions }: { positions: DemoPosition[] }) {
  return <section className="ops-card reveal p-4 md:p-5" data-testid="panel-open-positions">
    <div><div className="eyebrow">Simulated holdings</div><h2 className="mt-1 text-lg font-semibold">Open Positions</h2></div>
    <div className="mt-4">
      {positions.length === 0
        ? <div className="border border-border bg-[#151b24] p-4 text-sm text-muted-foreground" data-testid="empty-positions">No open simulated positions</div>
        : <div className="grid gap-3 lg:grid-cols-2">{positions.map((p) => <Card key={p.positionId} p={p} />)}</div>}
    </div>
    <p className="mt-4 border-l-2 border-primary/60 bg-primary/5 px-3 py-2 text-xs leading-5 text-muted-foreground" data-testid="note-positions-readonly">Synthetic demonstration positions. Marks are fixed fictional values, not market quotes. Nothing here is updated live and no orders can be placed.</p>
  </section>;
}
