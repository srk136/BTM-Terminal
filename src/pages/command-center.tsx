import { RefreshCw } from 'lucide-react';
import { DashboardActivityPanel, DashboardSystemStatus, DashboardPortfolioRisk, DashboardModelAttribution } from '@/components/dashboard-operational';
import { OpenPositions } from '@/components/open-positions';
import { IntelligenceProcess } from '@/components/intelligence-process';
import { BrandLogo } from '@/components/terminal-brand';
import { getDashboard } from '@/demo/adapter';
import { useDemoRead, usePageTitle } from '@/demo/use-demo-read';

export default function CommandCenterPage() {
  usePageTitle('Command Center');
  const { data, refreshing, refresh } = useDemoRead(getDashboard, []);
  return <div data-testid="page-command-center">
    <div className="mb-6 flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-end">
      <div className="reveal"><div className="flex items-center gap-2"><BrandLogo size={28} className="md:hidden" /><div className="eyebrow">BTM Terminal / Command Center</div></div><h1 className="mt-2 text-3xl font-semibold tracking-[-.03em] md:text-4xl">Beat The Market</h1>
        <div className="mt-4 max-w-3xl border-l-2 border-primary/60 pl-4"><h2 className="text-lg font-semibold tracking-tight md:text-xl">A read-only research terminal, shown with synthetic data.</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">This public build demonstrates the BTM Terminal interface: portfolio, positions, decisions, trade activity, plans and conversation replay. Every record is fictional, nothing is monitored live, and no AI models or trades are involved.</p></div></div>
      <button onClick={refresh} disabled={refreshing} className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-border bg-secondary px-4 text-xs font-semibold tracking-[.1em] text-foreground hover:border-primary hover:text-primary disabled:opacity-60" data-testid="button-refresh-command-center"><RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />RELOAD DEMO DATA</button>
    </div>
    <div className="space-y-5">
      <DashboardPortfolioRisk data={data} />
      <OpenPositions positions={data.positions} />
      <IntelligenceProcess />
      <DashboardSystemStatus data={data} />
      <DashboardModelAttribution data={data} />
      <DashboardActivityPanel data={data} />
    </div>
  </div>;
}
