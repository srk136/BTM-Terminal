export const NOT_RECORDED = 'Not recorded';

const etFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
export function formatEt(value: string | null | undefined): string {
  if (!value) return NOT_RECORDED;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return NOT_RECORDED;
  return `${etFormatter.format(date)} ET`;
}
const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 4 });
export function formatPrice(value: number | null | undefined): string {
  return value == null || !Number.isFinite(value) ? NOT_RECORDED : priceFormatter.format(value);
}
export function formatQuantity(value: number | null | undefined): string {
  return value == null || !Number.isFinite(value) ? NOT_RECORDED : new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value);
}
export function formatRatio(value: number | null | undefined): string {
  return value == null || !Number.isFinite(value) ? NOT_RECORDED : `${value.toFixed(2)} : 1`;
}
export function formatText(value: string | null | undefined): string {
  return value && value.trim() ? value : NOT_RECORDED;
}
export function labelize(value: string | null | undefined): string {
  return value && value.trim() ? value.replaceAll('_', ' ') : NOT_RECORDED;
}
export function outcomeLabel(kind: string): string {
  const labels: Record<string, string> = {
    ARMED: 'ARMED', PAPER_ENTRY_OPENED: 'ENTERED', PAPER_POSITION_CLOSED: 'EXITED', EXPIRED: 'EXPIRED', ARMED_PLAN_EXPIRED: 'EXPIRED',
    ENTRY_EVALUATION_REJECTED: 'ENTRY REJECTED', PAPER_ENTRY_CLAIMED: 'ENTRY CLAIMED', PAPER_POSITION_UPDATED: 'POSITION UPDATED',
  };
  return labels[kind] ?? kind.replaceAll('_', ' ');
}
export const planHref = (id: string) => `/trade-plans/${encodeURIComponent(id)}`;
