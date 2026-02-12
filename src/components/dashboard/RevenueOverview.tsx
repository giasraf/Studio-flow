'use client';

import { useTranslations } from 'next-intl';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { useStats } from '@/hooks/useStore';
import { formatCurrency } from '@/lib/utils';

export function RevenueOverview() {
  const t = useTranslations('dashboard');
  const stats = useStats();

  const revenueItems = [
    {
      label: t('totalRevenue'),
      value: formatCurrency(stats.totalRevenue),
      trend: '+12%',
      up: true,
    },
    {
      label: t('monthlyRevenue'),
      value: formatCurrency(stats.monthlyRevenue),
      trend: '+8%',
      up: true,
    },
    {
      label: t('avgSessionsPerSong'),
      value: stats.avgSessionsPerSong.toFixed(1),
      trend: '-0.3',
      up: false,
    },
    {
      label: t('completedSongs'),
      value: stats.completedSongs.toString(),
      trend: '',
      up: true,
    },
  ];

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-success" />
        {t('totalRevenue')}
      </h2>

      <div className="space-y-4">
        {revenueItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <span className="text-sm text-muted">{item.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{item.value}</span>
              {item.trend && (
                <span
                  className={cn(
                    'flex items-center text-xs',
                    item.up ? 'text-success' : 'text-danger'
                  )}
                >
                  {item.up ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {item.trend}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Simple Bar Chart Placeholder */}
      <div className="mt-6">
        <p className="text-xs text-muted mb-3">{t('sessionsThisMonth')}</p>
        <div className="flex items-end gap-1 h-24">
          {[40, 65, 35, 80, 55, 90, 45, 70, 60, 85, 50, 75].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-accent/20 rounded-t-sm hover:bg-accent/40 transition-colors cursor-pointer"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
