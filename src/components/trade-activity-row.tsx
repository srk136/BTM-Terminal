import { Link } from 'wouter';
import type { DemoEvent } from '@/demo/types';
import { formatEt, outcomeLabel, planHref } from '@/lib/utils';

const dash = (v: string | number | null | undefined) => v == null || v === '' ? 'Not recorded' : String(v);
export function Tag({ value, tone = 'muted', testId }: { value: string; tone?: 'cyan' | 'amber' | 'muted'; testId: string }) {
  const tones = { cyan: 'border-primary/50 bg-primary/10 text-primary', amber: 'border-[#70572d] bg-[#382c19] text-[#efbd68]', muted: 'border-border bg-secondary text-muted-foreground' };
  return <span className={`inline-flex min-h-[28px] w-fit max-w-full items-center border px-2.5 text-[11px] font-semibold tracking-[.1em] ${tones[tone]}`} data-testid={testId}>{value}</span>;
}

export function TradeActivityRow({ e, id }: { e: DemoEvent; id: string }) {
  const rows: [string, string | number | null][] = [['Raw outcome', e.kind], ['Plan', e.planId], ['Direction', e.direction], ['Plan persisted status', e.persistedStatus], ['Plan effective status', e.effectiveStatus], ['Validation step', e.validationStep], ['Code', e.code], ['Phase', e.phase], ['Observed price', e.observedPrice], ['Observed at', e.observedAt ? formatEt(e.observedAt) : null], ['Confirmation', e.confirmation], ['Reward/risk', e.rewardRisk], ['Candle at', e.candleAt ? formatEt(e.candleAt) : null], ['Candle close', e.candleClose], ['Trigger', e.triggerPrice], ['Stop', e.stop], ['Target', e.target]];
  const rd = e.derived ? null : e.recordedDetails;
  return <li className={`border bg-[#151b24] p-3 ${e.derived ? 'border-[#70572d]' : 'border-primary/40'}`} data-testid={id}>
    <div className="flex flex-wrap items-center gap-2"><span className="mono text-sm font-semibold">{e.symbol}</span><Tag value={outcomeLabel(e.kind)} tone={e.derived ? 'amber' : 'cyan'} testId={`${id}-kind`} /><Tag value={e.derived ? 'DERIVED, NOT A RECORDED EVENT' : 'SYNTHETIC EVENT'} tone={e.derived ? 'amber' : 'muted'} testId={`${id}-origin`} /><span className="mono text-xs text-muted-foreground">{formatEt(e.at)}</span></div>
    <p className="mt-2 text-xs leading-5 text-muted-foreground">{e.reason ?? 'No reason recorded.'}</p>
    <p className="mt-2 text-xs text-muted-foreground" data-testid={`${id}-plan-status`}>Plan status now: persisted {dash(e.persistedStatus)} / effective {dash(e.effectiveStatus)}. This is the plan state, not the state at event time.</p>
    <Link href={planHref(e.planId)} className="mt-2 inline-block break-all text-xs text-primary underline" data-testid={`${id}-plan-link`}>View plan {e.planId}</Link>
    <details className="mt-2 text-xs"><summary className="cursor-pointer text-primary">Details</summary><dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">{rows.map(([k, v]) => <div key={k} className="contents"><dt className="text-muted-foreground">{k}</dt><dd className="mono break-all">{dash(v)}</dd></div>)}</dl>
      {rd ? <div className="mt-3" data-testid={`${id}-recorded-details`}><div className="eyebrow">Synthetic record details</div><pre className="mono mt-1 whitespace-pre-wrap break-words border border-border bg-secondary p-2 text-[11px] leading-5">{JSON.stringify(rd, null, 2)}</pre></div> : null}
    </details>
  </li>;
}
