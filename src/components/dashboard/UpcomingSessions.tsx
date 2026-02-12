'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Calendar, Clock, User, Headphones, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockSessions } from '@/lib/mock-data';
import { formatDate, formatTime, cn } from '@/lib/utils';

const sessionTypeColors: Record<string, string> = {
  SKETCH: 'border-s-purple-500',
  PRODUCTION: 'border-s-blue-500',
  RECORDING: 'border-s-orange-500',
  EDITING: 'border-s-yellow-500',
  MIXING: 'border-s-cyan-500',
  MIX_REVISION: 'border-s-teal-500',
  MASTERING: 'border-s-pink-500',
};

export function UpcomingSessions() {
  const t = useTranslations();
  const locale = useLocale();

  const upcomingSessions = mockSessions
    .filter((s) => s.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent" />
          {t('dashboard.upcomingSessions')}
        </h2>
        <span className="text-sm text-muted">{upcomingSessions.length} {t('calendar.thisWeek')}</span>
      </div>

      <div className="space-y-3">
        {upcomingSessions.map((session) => (
          <div
            key={session.id}
            className={cn(
              'border-s-4 rounded-xl bg-background/50 p-4 hover:bg-surface-hover transition-colors cursor-pointer',
              sessionTypeColors[session.type] || 'border-s-gray-500'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm">{session.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(session.startTime, locale)} - {formatTime(session.endTime, locale)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(session.startTime, locale)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {session.isProducerOnly ? (
                  <span className="flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-1 rounded-lg">
                    <Headphones className="w-3 h-3" />
                    {t('calendar.producerOnly')}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs bg-info/10 text-info px-2 py-1 rounded-lg">
                    <User className="w-3 h-3" />
                    {session.clientName}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
