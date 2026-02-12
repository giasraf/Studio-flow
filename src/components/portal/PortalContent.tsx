'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Music,
  Calendar,
  CreditCard,
  Headphones,
  Clock,
  MessageSquare,
  Play,
} from 'lucide-react';
import { mockSongs, mockSessions, mockPayments, stageLabels } from '@/lib/mock-data';
import { formatCurrency, formatDate, formatTime, cn } from '@/lib/utils';

const currentClient = {
  id: 'client-1',
  name: 'דניאל לוי',
};

const stageProgress: Record<string, number> = {
  SKETCH: 12.5,
  PRODUCTION: 25,
  RECORDING: 37.5,
  EDITING: 50,
  MIXING: 62.5,
  MIX_REVISIONS: 75,
  MASTERING: 87.5,
  DELIVERED: 100,
};

const stageDotColors: Record<string, string> = {
  SKETCH: 'bg-violet-400',
  PRODUCTION: 'bg-blue-400',
  RECORDING: 'bg-orange-400',
  EDITING: 'bg-yellow-400',
  MIXING: 'bg-cyan-400',
  MIX_REVISIONS: 'bg-teal-400',
  MASTERING: 'bg-pink-400',
  DELIVERED: 'bg-green-400',
};

export function PortalContent() {
  const t = useTranslations();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<'songs' | 'sessions' | 'payments'>('songs');

  const mySongs = mockSongs.filter((s) => s.clientId === currentClient.id);
  const mySessions = mockSessions.filter((s) => s.clientName === currentClient.name || s.songId === 'song-1' || s.songId === 'song-2');
  const myPayments = mockPayments.filter((p) => p.clientId === currentClient.id);

  const upcomingSession = mySessions
    .filter((s) => s.status === 'CONFIRMED' && !s.isProducerOnly)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="bg-background border border-border rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center text-foreground text-lg font-semibold">
            {currentClient.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {t('portal.welcome')}, {currentClient.name}
            </h1>
            <p className="text-[13px] text-muted mt-0.5">Studio Flow Portal</p>
          </div>
        </div>

        {upcomingSession && (
          <div className="mt-4 bg-surface border border-border rounded-lg p-3.5 flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted" />
            <div>
              <p className="text-[13px] font-medium">{t('portal.upcomingSession')}</p>
              <p className="text-[12px] text-muted">
                {upcomingSession.title} · {formatDate(upcomingSession.startTime, locale)} · {formatTime(upcomingSession.startTime, locale)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 border-b border-border pb-px">
        {[
          { key: 'songs', label: t('portal.mySongs'), icon: Music },
          { key: 'sessions', label: t('portal.mySessions'), icon: Calendar },
          { key: 'payments', label: t('portal.myPayments'), icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium transition-colors border-b-2 -mb-px',
                activeTab === tab.key
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted hover:text-foreground'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'songs' && (
        <div className="space-y-3">
          {mySongs.map((song) => {
            const progress = stageProgress[song.stage] || 0;
            const stageLabel = locale === 'he' ? stageLabels[song.stage].he : stageLabels[song.stage].en;

            return (
              <div key={song.id} className="bg-background border border-border rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[15px] font-semibold">{song.title}</h3>
                    <p className="text-[12px] text-muted mt-0.5">
                      {song.genre} · {song.bpm} BPM · {song.key}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-muted">
                    <span className={cn('w-2 h-2 rounded-full', stageDotColors[song.stage])} />
                    {stageLabel}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] text-muted mb-1.5">
                    <span>{t('projects.stage')}: {stageLabel}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-hover rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground rounded-full transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between mt-2">
                    {Object.keys(stageProgress).map((stage) => {
                      const isCompleted = stageProgress[stage] <= progress;
                      const isCurrent = stage === song.stage;
                      return (
                        <div
                          key={stage}
                          className={cn(
                            'w-1.5 h-1.5 rounded-full transition-colors',
                            isCompleted ? 'bg-foreground' : 'bg-border',
                            isCurrent && 'ring-2 ring-foreground/30 ring-offset-1 ring-offset-background'
                          )}
                          title={locale === 'he' ? stageLabels[stage].he : stageLabels[stage].en}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 text-[11px] text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {song.sessionCount} {t('projects.sessions')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {t('projects.lastUpdated')}: {formatDate(song.lastUpdated, locale)}
                  </span>
                </div>

                <div className="flex gap-2 mt-3">
                  <button className="flex items-center gap-1.5 border border-border hover:bg-surface-hover rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors">
                    <Play className="w-3.5 h-3.5" />
                    {t('portal.listenToMix')}
                  </button>
                  <button className="flex items-center gap-1.5 border border-border hover:bg-surface-hover rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {t('portal.leaveFeedback')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="space-y-2">
          {mySessions
            .filter((s) => !s.isProducerOnly)
            .map((session) => (
              <div key={session.id} className="bg-background border border-border rounded-lg p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center">
                    <Headphones className="w-4 h-4 text-muted" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[13px]">{session.title}</h4>
                    <p className="text-[12px] text-muted">
                      {formatDate(session.startTime, locale)} · {formatTime(session.startTime, locale)} - {formatTime(session.endTime, locale)}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  'text-[11px] px-2 py-0.5 rounded-full font-medium',
                  session.status === 'CONFIRMED' ? 'bg-green-50 text-green-700' :
                  session.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                )}>
                  {session.status === 'CONFIRMED' ? t('calendar.confirmed') : t('calendar.pendingApproval')}
                </span>
              </div>
            ))}

          <button className="w-full border border-dashed border-border rounded-lg p-4 text-center text-[13px] text-muted hover:text-foreground hover:border-foreground/30 transition-colors">
            <Calendar className="w-4 h-4 mx-auto mb-1" />
            {t('portal.bookSession')}
          </button>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <p className="text-xl font-semibold text-green-700">
                {formatCurrency(myPayments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0))}
              </p>
              <p className="text-[12px] text-muted mt-1">{t('payments.paid')}</p>
            </div>
            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <p className="text-xl font-semibold text-amber-600">
                {formatCurrency(myPayments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0))}
              </p>
              <p className="text-[12px] text-muted mt-1">{t('payments.pending')}</p>
            </div>
          </div>

          {myPayments.map((payment) => (
            <div key={payment.id} className="bg-background border border-border rounded-lg p-3.5 flex items-center justify-between">
              <div>
                <p className="font-medium text-[13px]">{payment.projectName}</p>
                <p className="text-[12px] text-muted mt-0.5">
                  {payment.installmentNum && payment.totalInstallments
                    ? t('payments.installmentOf', { num: payment.installmentNum, total: payment.totalInstallments })
                    : ''
                  }
                </p>
                <p className="text-[11px] text-muted">
                  {payment.paidAt
                    ? `${t('payments.paidAt')}: ${formatDate(payment.paidAt, locale)}`
                    : `${t('payments.dueDate')}: ${formatDate(payment.dueDate, locale)}`
                  }
                </p>
              </div>
              <div className="text-end">
                <p className="font-semibold text-[14px]">{formatCurrency(payment.amount)}</p>
                <span className={cn(
                  'text-[11px] px-2 py-0.5 rounded-full font-medium',
                  payment.status === 'PAID' ? 'bg-green-50 text-green-700' :
                  payment.status === 'OVERDUE' ? 'bg-red-50 text-red-700' :
                  'bg-yellow-50 text-yellow-700'
                )}>
                  {payment.status === 'PAID' ? t('payments.paid') :
                   payment.status === 'OVERDUE' ? t('payments.overdue') :
                   t('payments.pending')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
