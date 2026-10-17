import { btmLogo } from '@/assets/brand';

export function BrandLogo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return <img src={btmLogo} width={size} height={size} alt="BTM Terminal logo" data-testid="img-btm-logo" className={`shrink-0 object-contain ${className}`} style={{ width: size, height: size }} />;
}

export function TerminalBrand({ compact = false }: { compact?: boolean }) {
  if (compact) return <BrandLogo size={36} />;
  return <div className="flex items-center gap-3">
    <BrandLogo size={40} />
    <div>
      <div className="font-semibold tracking-[.06em] text-[#ece7d9]">BTM Terminal</div>
      <div className="mt-0.5 text-[11px] tracking-[.08em] text-[#8a95a3]">Beat The Market</div>
    </div>
  </div>;
}
