'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Clock, User, Headphones } from 'lucide-react';
import { useSessions } from '@/hooks/useStore';
import { formatDate, formatTime, cn } from '@/lib/utils';

export function UpcomingSessions() {
  const t = useTranslations();
  const locale = useLocale();
  const sessions = useSessions();

  const upcomingSessions = sessions
    .filter((s) => s.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <div>
      <h2 className="text-[15px] font-semibold mb-4">{t('dashboard.upcomingSessions')}</h2>

      <div className="space-y-2">
        {upcomingSessions.map((session) => (
          <div
            key={session.id}
            className="bg-background border border-border rounded-xl p-4 hover:border-border-light transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-[13px]">{session.title}</h3>
                <div className="flex items-center gap-3 mt-1.5 text-[12px] text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(session.startTime, locale)} - {formatTime(session.endTime, locale)}
                  </span>
                  <span>{formatDate(session.startTime, locale)}</span>
                </div>
              </div>
              <span className="text-[12px] text-muted">
                {session.isProducerOnly ? (
                  <span className="flex items-center gap-1">
                    <Headphones className="w-3 h-3" />
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {session.clientName}
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}

        {upcomingSessions.length === 0 && (
          <p className="text-[13px] text-muted py-8 text-center">{t('calendar.noSessions')}</p>
        )}
      </div>
    </div>
  );
}
