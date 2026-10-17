import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { AiDecisionRow } from '@/components/ai-decision-row';
import { getDecisions, pageRange, totalPages } from '@/demo/adapter';
import { useDemoRead, usePageTitle } from '@/demo/use-demo-read';
import { formatEt } from '@/lib/utils';

type Filters = { symbol: string; decision: string; date: string };
const none: Filters = { symbol: '', decision: '', date: '' };
const selectCls = 'min-h-[44px] w-full border border-border bg-secondary px-3 text-xs text-foreground';
const pageBtn = 'inline-flex min-h-[44px] items-center justify-center border border-border bg-secondary px-4 text-xs font-semibold tracking-[.1em] text-foreground hover:border-primary hover:text-primary disabled:opacity-50';

export default function AiDecisionsPage() {
  usePageTitle('AI Decisions');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>(none);
  const { data, refreshing, refresh } = useDemoRead(() => getDecisions({ page, symbol: filters.symbol, decision: filters.decision, date: /^\d{4}-\d{2}-\d{2}$/.test(filters.date) ? filters.date : '' }), [page, filters]);
  const setFilter = (key: keyof Filters, value: string) => { setFilters((f) => ({ ...f, [key]: value })); setPage(1); };
  const pages = totalPages(data.total, data.pageSize);
  const range = pageRange(data.total, data.page, data.pageSize);
  const filtered = Boolean(filters.symbol || filters.decision || filters.date);

  return <div data-testid="page-ai-decisions">
    <div className="mb-6 flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-end">
      <div className="reveal"><div className="eyebrow">BTM Terminal / AI Decisions</div><h1 className="mt-2 text-3xl font-semibold tracking-[-.03em] md:text-4xl">AI Decisions</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Synthetic decision history, including NO TRADE, newest first. These are fictional examples; no AI model produced them. Times are Eastern Time.</p></div>
      <button onClick={refresh} disabled={refreshing} className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-border bg-secondary px-4 text-xs font-semibold tracking-[.1em] text-foreground hover:border-primary hover:text-primary disabled:opacity-60" data-testid="button-refresh-ai-decisions"><RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />RELOAD DEMO DATA</button>
    </div>
    <section className="ops-card reveal p-4 md:p-5" data-testid="panel-ai-decisions">
      <div className="grid grid-cols-1 gap-3 min-[560px]:grid-cols-3" data-testid="filters-ai-decisions">
        <label className="block"><span className="eyebrow">Symbol</span><select className={`${selectCls} mt-1`} value={filters.symbol} onChange={(e) => setFilter('symbol', e.target.value)} data-testid="select-symbol"><option value="">All symbols</option>{data.symbols.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
        <label className="block"><span className="eyebrow">Decision</span><select className={`${selectCls} mt-1`} value={filters.decision} onChange={(e) => setFilter('decision', e.target.value)} data-testid="select-decision"><option value="">All decisions</option>{data.decisionTypes.map((s) => <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>)}</select></label>
        <label className="block"><span className="eyebrow">Date (ET)</span><input type="date" className={`${selectCls} mt-1`} value={filters.date} onChange={(e) => setFilter('date', e.target.value)} data-testid="input-date" /></label>
      </div>
      {filtered && <button className="mt-3 text-xs text-primary underline" onClick={() => { setFilters(none); setPage(1); }} data-testid="button-clear-filters">Clear filters</button>}
      <div className="mt-4">
        <div className="mono mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"><span data-testid="text-ai-decisions-range">{data.total === 0 ? '0 decisions' : `Showing ${range.from}-${range.to} of ${data.total}`}</span><span data-testid="text-ai-decisions-as-of">Synthetic fixture as of {formatEt(data.asOf)}</span></div>
        {data.items.length ? <ul className="space-y-2" data-testid="list-ai-decisions">{data.items.map((d) => <AiDecisionRow key={d.runId} d={d} noPlanText="No plan approved." />)}</ul> : <p className="border border-border bg-[#151b24] p-6 text-center text-sm text-muted-foreground" data-testid="empty-ai-decisions">{filtered ? 'No AI decisions match these filters.' : 'No decisions available.'}</p>}
        <div className="mt-4 flex items-center justify-between gap-3" data-testid="pagination-ai-decisions">
          <button className={pageBtn} disabled={data.page <= 1} onClick={() => setPage(Math.max(1, data.page - 1))} data-testid="button-prev-page">PREVIOUS</button>
          <span className="mono text-xs text-muted-foreground" data-testid="text-page">Page {data.page} of {pages}</span>
          <button className={pageBtn} disabled={data.page >= pages} onClick={() => setPage(data.page + 1)} data-testid="button-next-page">NEXT</button>
        </div>
      </div>
    </section>
  </div>;
}
