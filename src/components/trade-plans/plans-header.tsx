import { RefreshCw } from 'lucide-react';

export function PlansHeader({ asOf, count, onRefresh, refreshing }: { asOf: string; count: number; onRefresh: () => void; refreshing: boolean }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="min-w-0">
        <div className="eyebrow">Synthetic validation portfolio / demo plans</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] text-[#f0eadc] md:text-4xl">Active trade plans</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#87919e]">Fictional paper-trading plan records and the synthesis rationale written for each demo plan. All plans are listed, including expired ones. This page shows no market prices.</p>
      </div>
      <div className="flex items-end gap-3">
        <div className="text-left md:text-right">
          <div className="eyebrow">Fixture as of</div>
          <div className="mono mt-1 text-[11px] text-[#b4bbc4]" data-testid="text-as-of">{asOf}</div>
          <div className="mono mt-0.5 text-[11px] text-[#7d8793]" data-testid="text-plan-count">{count} {count === 1 ? 'plan' : 'plans'}</div>
        </div>
        <button onClick={onRefresh} disabled={refreshing} aria-label="Reload demo plans" className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#303744] bg-[#191f28] text-[#a6afb9] transition-colors hover:border-[#70572d] hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-60" data-testid="button-refresh-plans"><RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /></button>
      </div>
    </div>
  );
}
