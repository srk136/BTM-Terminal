import { Link } from 'wouter';
import type { DemoDecision } from '@/demo/types';
import { formatEt, planHref } from '@/lib/utils';

export function Reasoning({ text }: { text: string | null }) {
  if (!text) return <p className="mt-2 text-xs leading-5 text-muted-foreground">No reasoning recorded.</p>;
  if (text.length <= 220) return <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>;
  return <><p className="mt-2 text-xs leading-5 text-muted-foreground">{text.slice(0, 200).trimEnd()}...</p><details className="mt-1 text-xs"><summary className="cursor-pointer text-primary">Full demo reasoning</summary><p className="mt-1 whitespace-pre-wrap leading-5 text-muted-foreground">{text}</p></details></>;
}

export function AiDecisionRow({ d, noPlanText }: { d: DemoDecision; noPlanText: string }) {
  const tone = d.decision === 'NO_TRADE' ? 'border-[#70572d] bg-[#382c19] text-[#efbd68]' : 'border-primary/50 bg-primary/10 text-primary';
  return <li className="border border-primary/40 bg-[#151b24] p-3" data-testid={`decision-${d.runId}`}>
    <div className="flex flex-wrap items-center gap-2"><span className="mono text-sm font-semibold">{d.symbol}</span><span className={`inline-flex min-h-[28px] w-fit max-w-full items-center border px-2.5 text-[11px] font-semibold tracking-[.1em] ${tone}`} data-testid={`decision-${d.runId}-value`}>{d.decision.replaceAll('_', ' ')}</span><span className="mono text-xs text-muted-foreground">{formatEt(d.completedAt)}</span><span className="mono text-[10px] tracking-[.1em] text-[#efbd68]">SYNTHETIC</span></div>
    <Reasoning text={d.reasoning} />
    {d.approvedPlanId ? <Link href={planHref(d.approvedPlanId)} className="mt-2 inline-block break-all text-xs text-primary underline" data-testid={`link-plan-${d.runId}`}>View approved plan {d.approvedPlanId}</Link> : <p className="mt-2 text-xs text-muted-foreground" data-testid={`plan-assoc-${d.runId}`}>{noPlanText}</p>}
  </li>;
}
