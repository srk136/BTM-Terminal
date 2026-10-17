import type { ReactNode } from 'react';
import { NOT_RECORDED } from '@/lib/utils';

export function Field({ label, value, mono = true, testId }: { label: string; value: ReactNode; mono?: boolean; testId?: string }) {
  const missing = value === NOT_RECORDED;
  return (
    <div className="min-w-0">
      <dt className="eyebrow">{label}</dt>
      <dd className={`mt-1 break-words text-sm ${mono ? 'mono' : ''} ${missing ? 'text-[#7d8793]' : 'text-[#eee9dc]'}`} data-testid={testId}>{value}</dd>
    </div>
  );
}

export function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="border-t border-[#292f3a] pt-4">
      <h3 className="eyebrow text-[#c9a661]">{title}</h3>
      {note ? <p className="mt-1 text-xs leading-5 text-[#8a94a0]">{note}</p> : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}
