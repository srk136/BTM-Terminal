export function DemoBanner() {
  return <div className="sticky top-0 z-40 flex min-h-8 items-center justify-center gap-2 border-b border-[#70572d] bg-[#2b2419] px-3 py-1 text-center" role="note" data-testid="banner-synthetic-demo">
    <span className="status-dot bg-[#efbd68]" />
    <span className="mono text-[10px] font-semibold tracking-[.14em] text-[#efbd68]">SYNTHETIC DEMO</span>
    <span className="hidden text-[10px] text-[#b5aa8d] sm:inline">All data is fictional and bundled locally. No live monitoring, no real trades, no AI calls.</span>
  </div>;
}
