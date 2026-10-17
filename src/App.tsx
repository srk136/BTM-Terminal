import { useState, type ReactNode } from 'react';
import { Activity as ActivityIcon, Bot, Gauge, GitBranch, Menu, PanelLeftClose, PanelLeftOpen, ListChecks, X } from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { ErrorBoundary } from '@/components/error-boundary';
import { DemoBanner } from '@/components/demo-banner';
import { TerminalBrand } from '@/components/terminal-brand';
import NotFound from '@/pages/not-found';
import TradePlansPage from '@/pages/trade-plans';
import AiDecisionsPage from '@/pages/ai-decisions';
import TradeActivityPage from '@/pages/trade-activity';
import ConversationReplayPage from '@/pages/conversation-replay';
import CommandCenterPage from '@/pages/command-center';

type Key = 'overview' | 'replay' | 'plans' | 'decisions' | 'activity';
const TITLES: Record<Key, string> = { overview: 'Command Center', decisions: 'AI Decisions', activity: 'Trade Activity', plans: 'Active Trade Plans', replay: 'Conversation Replay' };

function Shell({ children, active }: { children: ReactNode; active: Key }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = (href: string, label: string, icon: ReactNode, key: Key) => (
    <Link href={href} onClick={() => setMobileOpen(false)} className={`group flex min-h-11 items-center gap-3 border-l-2 px-3 py-2.5 text-xs font-medium transition-colors ${active === key ? 'border-primary bg-primary/10 text-primary' : 'border-transparent text-[#89919e] hover:bg-[#1c222c] hover:text-[#e9e5da]'} ${collapsed ? 'justify-center px-2' : ''}`} data-testid={`link-${key}`}>
      {icon}<span className={collapsed ? 'hidden' : 'block'}>{label}</span>
    </Link>
  );
  const links = <>{nav('/', 'Command Center', <Gauge size={15} />, 'overview')}{nav('/ai-decisions', 'AI Decisions', <Bot size={15} />, 'decisions')}{nav('/trade-activity', 'Trade Activity', <ActivityIcon size={15} />, 'activity')}{nav('/trade-plans', 'Active Trade Plans', <ListChecks size={15} />, 'plans')}{nav('/conversations', 'Conversation Replay', <GitBranch size={15} />, 'replay')}</>;
  return <div className="ops-shell ops-grid ops-noise flex" data-testid="app-shell">
    <aside className={`${collapsed ? 'w-[66px]' : 'w-[238px]'} fixed inset-y-0 left-0 z-40 hidden border-r border-[#252c38] bg-[#11161e] transition-all md:flex md:flex-col`} data-testid="sidebar">
      <div className={`flex h-[72px] items-center border-b border-[#252c38] ${collapsed ? 'justify-center' : 'justify-between px-4'}`}>
        <TerminalBrand compact={collapsed} />
        {!collapsed ? <button onClick={() => setCollapsed(true)} aria-label="Collapse sidebar" className="text-[#77818d] hover:text-[#ebc36f]" data-testid="button-collapse-sidebar"><PanelLeftClose size={16} /></button> : null}
      </div>
      {collapsed ? <button onClick={() => setCollapsed(false)} aria-label="Expand sidebar" className="mx-auto mt-4 text-[#77818d] hover:text-[#ebc36f]" data-testid="button-expand-sidebar"><PanelLeftOpen size={16} /></button> : null}
      <nav className="mt-7 space-y-1">{links}</nav>
      <div className={`mt-auto border-t border-[#252c38] p-4 ${collapsed ? 'px-2' : ''}`}>
        <div className={`flex items-center gap-2 text-[10px] font-semibold tracking-[.14em] text-[#efbd68] ${collapsed ? 'justify-center' : ''}`}><span className="h-1.5 w-1.5 rounded-full bg-[#efbd68]" />{collapsed ? null : 'SYNTHETIC DEMO'}</div>
        {!collapsed ? <p className="mt-2 text-[10px] leading-4 text-[#697482]">Read-only view of fictional paper-simulation records bundled with this build.</p> : null}
      </div>
    </aside>
    {mobileOpen ? <div className="fixed inset-0 z-50 bg-[#0c1117]/80 md:hidden" onClick={() => setMobileOpen(false)}><aside className="h-full w-[250px] border-r border-[#252c38] bg-[#11161e] p-4" onClick={(event) => event.stopPropagation()}><div className="mb-8 flex items-center justify-between"><TerminalBrand /><button className="flex h-11 w-11 items-center justify-center" aria-label="Close menu" onClick={() => setMobileOpen(false)} data-testid="button-close-menu"><X size={18} /></button></div><nav className="space-y-1">{links}</nav></aside></div> : null}
    <main className={`min-w-0 flex-1 ${collapsed ? 'md:ml-[66px]' : 'md:ml-[238px]'}`}>
      <DemoBanner />
      <header className="sticky top-8 z-30 flex h-[72px] items-center border-b border-[#252c38] bg-[#11161e]/95 px-4 backdrop-blur md:px-8"><div className="flex items-center gap-3"><button className="flex h-11 w-11 items-center justify-center text-[#abb2bc] md:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)} data-testid="button-open-menu"><Menu size={19} /></button><div><div className="eyebrow">BTM Terminal / synthetic public demo</div><div className="mt-1 text-sm font-semibold text-[#e8e2d4]">{TITLES[active]}</div></div></div></header>
      <div className="mx-auto max-w-[1480px] p-4 md:p-8">{children}</div>
    </main>
  </div>;
}

const route = (active: Key, page: ReactNode) => () => <Shell active={active}>{page}</Shell>;
const Overview = route('overview', <CommandCenterPage />);
const Replay = route('replay', <ConversationReplayPage />);
const Plans = route('plans', <TradePlansPage />);
const Decisions = route('decisions', <AiDecisionsPage />);
const Activity = route('activity', <TradeActivityPage />);
const Missing = () => <div className="ops-shell p-6"><DemoBanner /><div className="p-6"><NotFound /></div></div>;

function Routes() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch>
    <Route path="/" component={Overview} />
    <Route path="/conversations" component={Replay} />
    <Route path="/conversations/:conversationId" component={Replay} />
    <Route path="/ai-decisions" component={Decisions} />
    <Route path="/trade-activity" component={Activity} />
    <Route path="/trade-plans" component={Plans} />
    <Route path="/trade-plans/:planId" component={Plans} />
    <Route component={Missing} />
  </Switch></ErrorBoundary>;
}

function App() {
  return <WouterRouter hook={useHashLocation}><Routes /></WouterRouter>;
}

export default App;
