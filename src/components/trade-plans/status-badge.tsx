import { labelize } from '@/lib/utils';

export function StatusBadge({ value, testId }: { value: string | null; testId?: string }) {
  const key = (value ?? '').toUpperCase();
  const tone = key === 'EXPIRED' ? 'border-[#70572d] bg-[#382c19] text-[#efbd68]' : key.includes('ENTERED') || key.includes('OPEN') || key.includes('ACTIVE') ? 'border-[#356d63] bg-[#17342f] text-[#63d4bb]' : 'border-[#424e87] bg-[#232949] text-[#a6b4f4]';
  return <span className={`inline-flex items-center border px-2 py-1 text-[10px] font-semibold tracking-[.12em] ${tone}`} data-testid={testId}>{labelize(value).toUpperCase()}</span>;
}
