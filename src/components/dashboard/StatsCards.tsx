'use client';

import { useTranslations } from 'next-intl';
import { useStats } from '@/hooks/useStore';
import { formatCurrency } from '@/lib/utils';

export function StatsCards() {
  const t = useTranslations('dashboard');
  const stats = useStats();

  const cards = [
    { label: t('monthlyRevenue'), value: formatCurrency(stats.monthlyRevenue) },
    { label: t('activeClients'), value: stats.activeClients.toString() },
    { label: t('sessionsThisWeek'), value: stats.sessionsThisWeek.toString() },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-card rounded-lg p-5">
          <p className="text-2xl font-bold tracking-tight">{card.value}</p>
          <p className="text-[13px] text-muted mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
