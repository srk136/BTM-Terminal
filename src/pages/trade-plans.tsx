import { useEffect } from 'react';
import { FileX2 } from 'lucide-react';
import { useParams } from 'wouter';
import { PlanCard } from '@/components/trade-plans/plan-card';
import { PlansHeader } from '@/components/trade-plans/plans-header';
import { getPlans } from '@/demo/adapter';
import { useDemoRead, usePageTitle } from '@/demo/use-demo-read';
import { formatEt } from '@/lib/utils';

export default function TradePlansPage() {
  usePageTitle('Active Trade Plans');
  const params = useParams<{ planId?: string }>();
  const selected = params.planId;
  const { data, refreshing, refresh } = useDemoRead(getPlans, []);
  useEffect(() => {
    if (!selected) return;
    const el = document.getElementById(`plan-${encodeURIComponent(selected)}`);
    if (el) el.scrollIntoView({ block: 'start' });
  }, [selected]);
  return (
    <div data-testid="page-trade-plans">
      <PlansHeader asOf={formatEt(data.asOf)} count={data.plans.length} onRefresh={refresh} refreshing={refreshing} />
      {data.plans.length === 0 ? <div className="ops-card flex flex-col items-center p-8 text-center" data-testid="empty-state"><FileX2 size={26} className="mb-3 text-[#65717e]" /><h2 className="text-lg font-semibold">No demo trade plans</h2></div> : <div className="space-y-5">{data.plans.map((plan) => <PlanCard key={plan.planId} plan={plan} highlighted={plan.planId === selected} />)}</div>}
    </div>
  );
}
