import type { DemoPlan } from '@/demo/types';
import { Field, Section } from './field';
import { StatusBadge } from './status-badge';
import { NOT_RECORDED, formatEt, formatPrice, formatQuantity, formatRatio, formatText, labelize } from '@/lib/utils';

function ReasonList({ items, empty, testId }: { items: string[]; empty: string; testId: string }) {
  if (!items.length) return <p className="text-sm text-[#7d8793]" data-testid={testId}>{empty}</p>;
  return (
    <ul className="space-y-2" data-testid={testId}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-6 text-[#cfd2d6]">
          <span className="mono mt-0.5 shrink-0 text-[11px] text-[#7d8793]">{String(i + 1).padStart(2, '0')}</span>
          <span className="min-w-0 break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PlanCard({ plan, highlighted }: { plan: DemoPlan; highlighted?: boolean }) {
  const inferredExpired = plan.status === 'EXPIRED' && plan.persistedStatus !== 'EXPIRED';
  const hasFill = plan.simulatedFillPrice != null || plan.executedQuantity != null || plan.executedAt != null;
  return (
    <article id={`plan-${encodeURIComponent(plan.planId)}`} className={`ops-card scroll-mt-28 p-4 md:p-6 ${highlighted ? 'border-primary' : ''}`} data-testid={`card-plan-${plan.planId}`}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="eyebrow break-all">Plan {plan.planId}</div>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-2xl font-semibold tracking-tight" data-testid={`text-symbol-${plan.planId}`}>{plan.symbol}</h2>
            <span className="mono text-sm text-[#d9a956]" data-testid={`text-direction-${plan.planId}`}>{labelize(plan.direction)}</span>
            <span className="mono text-[10px] tracking-[.1em] text-[#efbd68]">SYNTHETIC</span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <div className="eyebrow">Status</div>
          <StatusBadge value={plan.status} testId={`status-plan-${plan.planId}`} />
        </div>
      </header>

      <div className="mt-4 space-y-1 border-l-2 border-[#66542e] bg-[#28241b] px-3 py-2 text-xs leading-5 text-[#b1a98f]" data-testid={`text-status-detail-${plan.planId}`}>
        <div><span className="text-[#8f8870]">Persisted status:</span> <span className="mono">{labelize(plan.persistedStatus)}</span></div>
        <div><span className="text-[#8f8870]">Status note:</span> {formatText(plan.statusNote)}</div>
        {inferredExpired ? <div data-testid={`text-expired-explainer-${plan.planId}`}>Expired is inferred when this page is read, from the expiry time and no recorded entry. It is not a stored status; the persisted status above is unchanged.</div> : null}
      </div>

      <div className="mt-5 space-y-5">
        <Section title="Planned levels" note="Fictional planning values. These are not market quotes.">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4">
            <Field label="Planned entry" value={formatPrice(plan.plannedEntryPrice)} />
            <Field label="Stop loss" value={formatPrice(plan.stopLoss)} />
            <Field label="Take profit" value={formatPrice(plan.takeProfit)} />
            <Field label="Approved quantity" value={formatQuantity(plan.approvedQuantity)} />
            <Field label="Trigger type" value={labelize(plan.triggerType)} />
            <Field label="Trigger price" value={formatPrice(plan.triggerPrice)} />
            <div className="col-span-2">
              <Field label="Reward/risk (calculated from planned levels)" value={formatRatio(plan.plannedRewardRisk)} testId={`text-rr-${plan.planId}`} />
            </div>
            <div className="col-span-2 md:col-span-4"><Field label="Confirmation rule" value={formatText(plan.confirmation)} mono={false} /></div>
          </dl>
        </Section>

        <Section title="Timing (America/New_York, ET)">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Created" value={formatEt(plan.createdAt)} />
            <Field label="Expires" value={formatEt(plan.expiresAt)} />
            <Field label="Holding horizon" value={formatText(plan.holdingHorizon)} mono={false} />
          </dl>
        </Section>

        <Section title="Simulated fill" note="Recorded separately from the plan. Reward/risk above never uses it.">
          {hasFill ? (
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3" data-testid={`fill-${plan.planId}`}>
              <Field label="Simulated fill price" value={formatPrice(plan.simulatedFillPrice)} />
              <Field label="Executed quantity" value={formatQuantity(plan.executedQuantity)} />
              <Field label="Executed at" value={formatEt(plan.executedAt)} />
              {plan.closedPrice != null ? <><Field label="Simulated exit price" value={formatPrice(plan.closedPrice)} /><Field label="Closed at" value={formatEt(plan.closedAt)} /></> : null}
            </dl>
          ) : <p className="text-sm text-[#9aa3ad]" data-testid={`fill-none-${plan.planId}`}>No simulated fill</p>}
        </Section>

        <Section title="Synthesis rationale (demo text)">
          <div className="space-y-5">
            <div>
              <div className="eyebrow">Trade thesis</div>
              <p className="mt-2 max-w-prose break-words text-[15px] leading-7 text-[#e3dfd3]" data-testid={`text-thesis-${plan.planId}`}>{plan.tradeThesis.trim() ? plan.tradeThesis : NOT_RECORDED}</p>
            </div>
            <div>
              <div className="eyebrow">Supporting reasons</div>
              <div className="mt-2 max-w-prose"><ReasonList items={plan.supportingReasons} empty={NOT_RECORDED} testId={`list-reasons-${plan.planId}`} /></div>
            </div>
            <div>
              <div className="eyebrow">Risks</div>
              <div className="mt-2 max-w-prose"><ReasonList items={plan.risks} empty={NOT_RECORDED} testId={`list-risks-${plan.planId}`} /></div>
            </div>
          </div>
        </Section>
      </div>
    </article>
  );
}
