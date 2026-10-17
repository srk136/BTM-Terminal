import { LineChart, MessagesSquare, Layers, Globe2, ShieldCheck, ChevronRight, ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

const SPECIALISTS: { id: string; name: string; desc: string; icon: ReactNode }[] = [
  { id: 'THESIS', name: 'Market Thesis', desc: 'Fundamental view of the opportunity.', icon: <LineChart size={16} /> },
  { id: 'CROWD_FLOW', name: 'Sentiment & Flow', desc: 'Crowd positioning and order flow.', icon: <MessagesSquare size={16} /> },
  { id: 'BOOK_STRUCTURE', name: 'Market Structure', desc: 'Book liquidity and quotes.', icon: <Layers size={16} /> },
  { id: 'EXTERNAL_STATE', name: 'External Context', desc: 'Macroeconomic and outside conditions.', icon: <Globe2 size={16} /> },
];

export function IntelligenceProcess() {
  return <section className="ops-card reveal p-4 md:p-5" data-testid="panel-analysts">
    <div className="eyebrow">How BTM decides (illustrated)</div>
    <h2 className="mt-1 text-lg font-semibold tracking-tight">Independent intelligence. Unified decisions.</h2>
    <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">This diagram shows the interface concept: independent analyses, structured debate, then rule-based validation. In this public demo the conversations are hand-written fiction and no models run.</p>
    <div className="mt-4 flex flex-col items-stretch gap-2 lg:flex-row lg:items-stretch">
      <ul className="grid flex-[4] grid-cols-1 gap-2 min-[360px]:grid-cols-2 lg:grid-cols-4">
        {SPECIALISTS.map((r) => <li key={r.id} className="border border-border bg-[#151b24] p-3" data-testid={`role-${r.id}`}>
          <div className="flex items-center gap-2 text-primary">{r.icon}<span className="text-sm font-semibold text-foreground">{r.name}</span></div>
          <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{r.desc}</p>
        </li>)}
      </ul>
      <div className="flex items-center justify-center text-primary/70" aria-hidden="true"><ChevronRight size={18} className="hidden lg:block" /><ChevronDown size={18} className="lg:hidden" /></div>
      <div className="flex flex-[1.4] items-start gap-3 border-l-2 border-primary/60 bg-primary/5 p-3" data-testid="role-FINAL_TRADE_SYNTHESIS">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-primary" />
        <div>
          <div className="text-sm font-semibold">Trade Synthesis &amp; Risk Validation</div>
          <p className="mt-1.5 text-xs leading-5 text-muted-foreground">Synthesis weighs the analyses. Rule-based validation then checks the result; it is not an AI approval.</p>
        </div>
      </div>
    </div>
  </section>;
}
