import { AlertTriangle, ArrowLeft, CircleHelp, FileSearch, GitBranch, LockKeyhole } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { getConversation, listConversations } from '@/demo/adapter';
import { usePageTitle } from '@/demo/use-demo-read';
import type { Replay, ReplayMessage, ReplaySummary } from '@/demo/types';
import { labelize } from '@/lib/utils';

export { labelize };
export function fmtEastern(value?: string | null) {
  if (!value) return 'Not recorded';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Not recorded';
  return `${new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(d)} ET`;
}
const replayHref = (id: string) => `/conversations/${encodeURIComponent(id)}`;
function attributionText(m: Pick<ReplayMessage, 'provider' | 'model'>) {
  const p = m.provider?.trim(), mo = m.model?.trim();
  if (!p && !mo) return 'Not recorded';
  return [p, mo].filter(Boolean).join(' / ');
}

function MessageCard({ message, index }: { message: ReplayMessage; index: number }) {
  const colors: Record<string, string> = { THESIS: '#d99c42', CROWD_FLOW: '#53c5b3', BOOK_STRUCTURE: '#8e9df2', EXTERNAL_STATE: '#d77f99' };
  const color = colors[message.sender] ?? '#d99c42';
  return <article className="relative pl-9 reveal" style={{ animationDelay: `${Math.min(index * 40, 320)}ms` }} data-testid={`message-${message.id}`}>
    <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center border" style={{ borderColor: `${color}66`, backgroundColor: `${color}12`, color }}><span className="font-mono text-[9px]">{message.sender.slice(0, 2)}</span></div>
    <div className="absolute left-[11px] top-7 bottom-[-22px] w-px bg-[#303846]" />
    <div className="ops-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mono text-[10px] font-semibold tracking-[.08em]" style={{ color }}>{message.sender}</span>
          <span className="text-[#56616e]">→</span>
          <span className="mono text-[9px] text-[#737d89]">{message.recipient ?? 'ROOM'}</span>
          <span className="border border-[#323b48] px-1.5 py-0.5 text-[9px] uppercase tracking-[.08em] text-[#9ca5ae]">{labelize(message.type)}</span>
        </div>
        <span className="mono text-[10px] text-[#6f7b88]" data-testid={`text-time-${message.id}`}>#{String(message.sequence).padStart(2, '0')} / {fmtEastern(message.createdAt)}</span>
      </div>
      <h3 className="mt-3 text-sm font-semibold text-[#eae5da]">{message.summary}</h3>
      <p className="mt-2 max-w-3xl whitespace-pre-wrap break-words text-xs leading-5 text-[#adb4bc]" data-testid={`text-body-${message.id}`}>{message.body}</p>
      <div className="mt-3 font-mono text-[9px] uppercase text-[#7d8894]" data-testid={`text-model-${message.id}`}>Label (illustrative): {attributionText(message)}</div>
      {message.attributionNote ? <div className="mt-1 text-[10px] leading-4 text-[#7d8894]">{message.attributionNote}</div> : null}
      {message.supersedesMessageId ? <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#d6aa5d]"><GitBranch size={12} /> Revises message {message.supersedesMessageId}</div> : null}
      {message.evidenceIds.length > 0 ? <div className="mt-3 flex flex-wrap items-center gap-2 border border-[#303946] bg-[#171d26] p-2" data-testid={`evidence-ids-${message.id}`}><FileSearch size={12} className="text-[#d0b06e]" /><span className="text-[10px] text-[#d0b06e]">Demo evidence IDs</span>{message.evidenceIds.map((e) => <span key={e} className="mono text-[9px] text-[#9ca5af]">{e}</span>)}</div> : null}
    </div>
  </article>;
}

function Selector({ runs, selectedId }: { runs: ReplaySummary[]; selectedId?: string }) {
  return <section className="ops-card p-5" data-testid="panel-replay-selector">
    <div className="eyebrow">Demo conversations, newest first</div>
    <div className="mt-4 max-h-80 space-y-2 overflow-y-auto lg:max-h-[65vh]">{runs.map((r) => <Link key={r.id} href={replayHref(r.id)} className={`block border px-3 py-2 ${r.id === selectedId ? 'border-primary bg-primary/10' : 'border-[#303946] hover:bg-[#1c222c]'}`} data-testid={`link-run-${r.id}`}>
      <div className="flex items-center justify-between gap-2"><span className="mono text-[11px] font-semibold text-[#e4dccb]">{r.symbol ?? 'No symbol'}</span><span className="mono text-[9px] text-[#7f8995]">{labelize(r.decision)}</span></div>
      <div className="mono mt-1 text-[9px] text-[#7f8995]">{fmtEastern(r.startedAt)} / {r.messageCount} msgs</div>
      <div className="mono mt-1 break-all text-[9px] text-[#626e7b]">{r.id}</div>
    </Link>)}</div>
  </section>;
}

function ReplayDetail({ replay }: { replay: Replay }) {
  const s = replay.summary;
  const rows: [string, string][] = [['Status', labelize(s.status)], ['Phase', labelize(s.phase)], ['Decision', labelize(s.decision)], ['Source', labelize(s.source)], ['Started', fmtEastern(s.startedAt)], ['Updated', fmtEastern(s.updatedAt)]];
  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
    <main>
      <div className="mb-4 flex items-center justify-between border-y border-[#252d39] py-3"><div className="flex items-center gap-2"><span className="status-dot bg-[#d99c42]" /><span className="eyebrow">Synthetic demo messages</span></div><div className="mono text-[10px] text-[#727d89]">{replay.messages.length} of {s.messageCount} messages</div></div>
      <div className="space-y-5">{replay.messages.map((m, i) => <MessageCard key={m.id} message={m} index={i} />)}</div>
    </main>
    <aside className="space-y-4">
      <section className="ops-card p-5" data-testid="panel-replay-summary"><div className="eyebrow">Run ledger</div><div className="mt-4 space-y-4">{rows.map(([l, v]) => <div className="flex items-center justify-between gap-3 border-b border-[#292f3a] pb-3 last:border-0 last:pb-0" key={l}><span className="text-xs text-[#828c98]">{l}</span><span className="mono text-right text-[10px] text-[#e4dccb]">{v}</span></div>)}</div></section>
      <section className="ops-card p-5" data-testid="panel-replay-coverage"><div className="eyebrow">Coverage</div><p className="mt-3 text-xs leading-5 text-[#adb4bc]">{s.coverageNote}</p>{replay.notes.map((n, i) => <p key={i} className="mt-2 text-[11px] leading-4 text-[#87919e]">{n}</p>)}</section>
      <section className="border border-[#70572d] bg-[#2b2419] p-5" data-testid="panel-replay-note"><div className="flex items-center gap-2 text-[#efbd68]"><CircleHelp size={15} /><span className="eyebrow text-[#efbd68]">Read this carefully</span></div><p className="mt-3 text-xs leading-5 text-[#b5aa8d]">Synthetic demo only. These conversations were written by hand for illustration. No AI provider or model was called, and provider and model labels are placeholders.</p></section>
    </aside>
  </div>;
}

export default function ConversationReplayPage() {
  usePageTitle('Conversation Replay');
  const params = useParams<{ conversationId?: string }>();
  const runs = listConversations();
  const explicit = params.conversationId;
  const selectedId = explicit ?? runs[0]?.id;
  const replay = selectedId ? getConversation(selectedId) : null;
  const summary = replay?.summary;

  return <div>
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="reveal"><Link href="/" className="mb-4 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[.12em] text-[#8f99a5] hover:text-primary" data-testid="link-back-overview"><ArrowLeft size={13} /> BACK TO COMMAND CENTER</Link>
        <div className="eyebrow">Conversation replay{summary ? ` / ${summary.opportunityId}` : ''}</div>
        <div className="mt-2 flex flex-wrap items-center gap-3"><h1 className="text-3xl font-semibold tracking-[-.04em] text-[#f0eadc]">{summary ? (summary.symbol ?? 'No symbol') : 'Demo conversations'}</h1>{summary ? <span className="mono break-all text-[11px] text-[#7f8995]" data-testid="text-run-id">{summary.id}</span> : null}</div>
        <p className="mt-2 max-w-2xl text-sm text-[#87919e]">Read-only replay of hand-written, fictional conversations. Select a conversation to view it.</p></div>
      <div className="reveal reveal-1 border border-[#356d63] bg-[#17342f] px-4 py-3"><div className="eyebrow text-[#63d4bb]">Safety boundary</div><div className="mt-1 flex items-center gap-2 text-xs font-semibold text-[#b7eedf]"><LockKeyhole size={13} /> SYNTHETIC / NO EXECUTION</div></div>
    </div>
    <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
      <div><Selector runs={runs} selectedId={selectedId} /></div>
      <div className="min-w-0">{replay ? <ReplayDetail replay={replay} /> : <div className="border border-[#713a39] bg-[#2d1c20] p-6 text-sm text-[#f5aaa0]" data-testid="error-replay"><div className="flex items-center gap-2"><AlertTriangle size={14} />This demo conversation does not exist.</div>{runs[0] ? <Link href={replayHref(runs[0].id)} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-2" data-testid="button-retry-replay">Open the first demo conversation</Link> : null}</div>}</div>
    </div>
  </div>;
}
