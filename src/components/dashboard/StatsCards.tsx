'use client';

import { useTranslations } from 'next-intl';
import {
  DollarSign,
  Users,
  Music,
  Calendar,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { mockStats } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

export function StatsCards() {
  const t = useTranslations('dashboard');
  const stats = mockStats;

  const cards = [
    {
      label: t('monthlyRevenue'),
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
      glowClass: 'glow-success',
    },
    {
      label: t('pendingPayments'),
      value: formatCurrency(stats.pendingPayments),
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      glowClass: 'glow-warning',
    },
    {
      label: t('activeClients'),
      value: stats.activeClients.toString(),
      icon: Users,
      color: 'text-info',
      bgColor: 'bg-info/10',
      glowClass: '',
    },
    {
      label: t('activeSongs'),
      value: stats.activeSongs.toString(),
      icon: Music,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      glowClass: '',
    },
    {
      label: t('sessionsThisWeek'),
      value: stats.sessionsThisWeek.toString(),
      icon: Calendar,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      glowClass: '',
    },
    {
      label: t('avgRevenuePerSong'),
      value: formatCurrency(stats.avgRevenuePerSong),
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      glowClass: '',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`glass rounded-2xl p-4 stagger-item cursor-pointer hover:scale-[1.02] transition-transform duration-200 ${card.glowClass}`}
          >
            <div className={`w-10 h-10 rounded-xl ${card.bgColor} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-xl font-bold tracking-tight">{card.value}</p>
            <p className="text-xs text-muted mt-1 leading-relaxed">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}
