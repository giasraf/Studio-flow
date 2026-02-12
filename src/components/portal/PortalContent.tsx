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
  FileAudio,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Download,
  Star,
} from 'lucide-react';
import { mockSongs, mockSessions, mockPayments, stageLabels } from '@/lib/mock-data';
import { formatCurrency, formatDate, formatTime, cn } from '@/lib/utils';

// Simulate a logged-in client
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
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-2xl font-bold">
            {currentClient.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {t('portal.welcome')}, {currentClient.name}
            </h1>
            <p className="text-muted text-sm mt-1">Studio Flow Portal</p>
          </div>
        </div>

        {/* Upcoming Session Banner */}
        {upcomingSession && (
          <div className="mt-6 bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">{t('portal.upcomingSession')}</p>
                <p className="text-xs text-muted">
                  {upcomingSession.title} • {formatDate(upcomingSession.startTime, locale)} • {formatTime(upcomingSession.startTime, locale)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
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
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === tab.key
                  ? 'bg-accent/15 text-accent'
                  : 'bg-surface border border-border text-muted hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'songs' && (
        <div className="space-y-4">
          {mySongs.map((song) => {
            const progress = stageProgress[song.stage] || 0;
            const stageLabel = locale === 'he' ? stageLabels[song.stage].he : stageLabels[song.stage].en;

            return (
              <div key={song.id} className="glass rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Music className="w-5 h-5 text-accent" />
                      {song.title}
                    </h3>
                    <p className="text-sm text-muted mt-1">
                      {song.genre} • {song.bpm} BPM • {song.key}
                    </p>
                  </div>
                  <span className="text-sm font-medium bg-accent/10 text-accent px-3 py-1 rounded-lg">
                    {stageLabel}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted mb-2">
                    <span>{t('projects.stage')}: {stageLabel}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-cyan-400 rounded-full transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Stage Steps */}
                  <div className="flex justify-between mt-2">
                    {Object.keys(stageProgress).map((stage) => {
                      const isCompleted = stageProgress[stage] <= progress;
                      const isCurrent = stage === song.stage;
                      return (
                        <div
                          key={stage}
                          className={cn(
                            'w-2 h-2 rounded-full transition-colors',
                            isCompleted ? 'bg-accent' : 'bg-border',
                            isCurrent && 'ring-2 ring-accent/50 ring-offset-1 ring-offset-background'
                          )}
                          title={locale === 'he' ? stageLabels[stage].he : stageLabels[stage].en}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Song Stats */}
                <div className="flex items-center gap-4 mt-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {song.sessionCount} {t('projects.sessions')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {t('projects.lastUpdated')}: {formatDate(song.lastUpdated, locale)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button className="flex items-center gap-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-xl px-4 py-2 text-sm transition-colors">
                    <Play className="w-4 h-4" />
                    {t('portal.listenToMix')}
                  </button>
                  <button className="flex items-center gap-2 bg-surface hover:bg-surface-hover border border-border rounded-xl px-4 py-2 text-sm transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    {t('portal.leaveFeedback')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="space-y-3">
          {mySessions
            .filter((s) => !s.isProducerOnly)
            .map((session) => (
              <div key={session.id} className="glass rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{session.title}</h4>
                    <p className="text-xs text-muted">
                      {formatDate(session.startTime, locale)} • {formatTime(session.startTime, locale)} - {formatTime(session.endTime, locale)}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  'text-xs px-2 py-1 rounded-lg',
                  session.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                  session.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                )}>
                  {session.status === 'CONFIRMED' ? t('calendar.confirmed') : t('calendar.pendingApproval')}
                </span>
              </div>
            ))}

          <button className="w-full glass rounded-xl p-4 text-center text-sm text-accent hover:bg-accent/5 transition-colors">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            {t('portal.bookSession')}
          </button>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-3">
          {/* Payment Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-success">
                {formatCurrency(myPayments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0))}
              </p>
              <p className="text-xs text-muted mt-1">{t('payments.paid')}</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-warning">
                {formatCurrency(myPayments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0))}
              </p>
              <p className="text-xs text-muted mt-1">{t('payments.pending')}</p>
            </div>
          </div>

          {/* Payment List */}
          {myPayments.map((payment) => (
            <div key={payment.id} className="glass rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{payment.projectName}</p>
                <p className="text-xs text-muted mt-0.5">
                  {payment.installmentNum && payment.totalInstallments
                    ? t('payments.installmentOf', { num: payment.installmentNum, total: payment.totalInstallments })
                    : ''
                  }
                </p>
                <p className="text-xs text-muted">
                  {payment.paidAt
                    ? `${t('payments.paidAt')}: ${formatDate(payment.paidAt, locale)}`
                    : `${t('payments.dueDate')}: ${formatDate(payment.dueDate, locale)}`
                  }
                </p>
              </div>
              <div className="text-end">
                <p className="font-bold">{formatCurrency(payment.amount)}</p>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  payment.status === 'PAID' ? 'bg-green-500/20 text-green-400' :
                  payment.status === 'OVERDUE' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
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
