'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Music,
  DollarSign,
  Calendar,
  AlertCircle,
  ChevronDown,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import { mockClients, mockSongs, mockPayments } from '@/lib/mock-data';
import { formatCurrency, formatDate, getInitials, cn } from '@/lib/utils';

type SortBy = 'name' | 'totalPaid' | 'totalOwed' | 'lastSession';
type FilterBy = 'all' | 'active' | 'owes' | 'needsFollowUp';

export function ClientsContent() {
  const t = useTranslations();
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const filteredClients = mockClients
    .filter((client) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          client.name.toLowerCase().includes(q) ||
          client.email.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .filter((client) => {
      switch (filterBy) {
        case 'active':
          return client.activeProjects > 0;
        case 'owes':
          return client.totalOwed > 0;
        case 'needsFollowUp':
          if (!client.lastSession) return true;
          const daysSince = Math.floor(
            (Date.now() - new Date(client.lastSession).getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysSince > 7;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'totalPaid':
          return b.totalPaid - a.totalPaid;
        case 'totalOwed':
          return b.totalOwed - a.totalOwed;
        case 'lastSession':
          return (
            new Date(b.lastSession || 0).getTime() -
            new Date(a.lastSession || 0).getTime()
          );
        default:
          return a.name.localeCompare(b.name, locale);
      }
    });

  const selected = selectedClient
    ? mockClients.find((c) => c.id === selectedClient)
    : null;

  const clientSongs = selected
    ? mockSongs.filter((s) => s.clientId === selected.id)
    : [];

  const clientPayments = selected
    ? mockPayments.filter((p) => p.clientId === selected.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-accent" />
            {t('clients.title')}
          </h1>
          <p className="text-sm text-muted mt-1">
            {mockClients.length} {t('clients.title')}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          {t('clients.addClient')}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder={t('common.search') + '...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl ps-10 pe-4 py-2.5 text-sm placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'owes', 'needsFollowUp'] as FilterBy[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterBy(filter)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap',
                filterBy === filter
                  ? 'bg-accent/15 text-accent'
                  : 'bg-surface border border-border text-muted hover:text-foreground'
              )}
            >
              {filter === 'all' && t('common.all')}
              {filter === 'active' && t('common.active')}
              {filter === 'owes' && t('clients.totalOwed')}
              {filter === 'needsFollowUp' && t('clients.needsFollowUp')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredClients.map((client) => {
            const daysSinceSession = client.lastSession
              ? Math.floor(
                  (Date.now() - new Date(client.lastSession).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : null;
            const needsFollowUp = daysSinceSession !== null && daysSinceSession > 7;

            return (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client.id)}
                className={cn(
                  'glass rounded-2xl p-5 cursor-pointer transition-all duration-200',
                  selectedClient === client.id
                    ? 'border-accent glow-accent'
                    : 'hover:border-border-light'
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold flex-shrink-0">
                    {getInitials(client.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{client.name}</h3>
                      {needsFollowUp && (
                        <span className="flex items-center gap-1 text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          {t('clients.needsFollowUp')}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {client.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {client.email}
                      </span>
                      {client.source && (
                        <span className="bg-surface px-2 py-0.5 rounded text-xs">
                          {client.source}
                        </span>
                      )}
                    </div>

                    {/* Stats row */}
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-success" />
                        <span className="text-xs">
                          <span className="text-success font-medium">{formatCurrency(client.totalPaid)}</span>
                          <span className="text-muted"> {t('clients.totalPaid')}</span>
                        </span>
                      </div>
                      {client.totalOwed > 0 && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-warning" />
                          <span className="text-xs">
                            <span className="text-warning font-medium">{formatCurrency(client.totalOwed)}</span>
                            <span className="text-muted"> {t('clients.totalOwed')}</span>
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Music className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs text-muted">
                          {client.activeProjects} {t('clients.activeProjects')} / {client.projectCount} {t('clients.projects')}
                        </span>
                      </div>
                      {client.lastSession && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-muted" />
                          <span className="text-xs text-muted">
                            {t('clients.lastSession')}: {formatDate(client.lastSession, locale)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Client Detail Panel */}
        <div>
          {selected ? (
            <div className="glass rounded-2xl p-6 sticky top-4 space-y-6">
              {/* Client header */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xl font-bold mx-auto">
                  {getInitials(selected.name)}
                </div>
                <h2 className="text-lg font-bold mt-3">{selected.name}</h2>
                <p className="text-sm text-muted">{selected.email}</p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-success">{formatCurrency(selected.totalPaid)}</p>
                  <p className="text-xs text-muted">{t('clients.totalPaid')}</p>
                </div>
                <div className="bg-background/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-warning">{formatCurrency(selected.totalOwed)}</p>
                  <p className="text-xs text-muted">{t('clients.totalOwed')}</p>
                </div>
              </div>

              {/* Client songs */}
              {clientSongs.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">{t('projects.songs')}</h3>
                  <div className="space-y-2">
                    {clientSongs.map((song) => (
                      <div key={song.id} className="bg-background/50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{song.title}</p>
                          <p className="text-xs text-muted">{song.genre}</p>
                        </div>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', getStageColor(song.stage))}>
                          {song.stage === 'SKETCH' ? 'סקיצה' : song.stage === 'PRODUCTION' ? 'הפקה' : song.stage === 'RECORDING' ? 'הקלטה' : song.stage === 'MIXING' ? 'מיקס' : song.stage === 'MIX_REVISIONS' ? 'תיקוני מיקס' : song.stage === 'MASTERING' ? 'מאסטרינג' : song.stage === 'DELIVERED' ? 'נמסר' : song.stage}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Client payments */}
              {clientPayments.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">{t('clients.paymentHistory')}</h3>
                  <div className="space-y-2">
                    {clientPayments.map((payment) => (
                      <div key={payment.id} className="bg-background/50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{formatCurrency(payment.amount)}</p>
                          <p className="text-xs text-muted">{payment.projectName}</p>
                        </div>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', getPaymentStatusColor(payment.status))}>
                          {payment.status === 'PAID' ? t('paid') : payment.status === 'OVERDUE' ? t('overdue') : t('pending')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-accent hover:bg-accent-hover text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
                  {t('dashboard.newSession')}
                </button>
                <button className="flex-1 border border-border hover:bg-surface-hover rounded-xl py-2.5 text-sm font-medium transition-colors">
                  {t('clients.followUp')}
                </button>
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl p-8 text-center">
              <Users className="w-12 h-12 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted">{t('clients.clientDetails')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getStageColor(stage: string): string {
  const colors: Record<string, string> = {
    SKETCH: 'bg-purple-500/20 text-purple-400',
    PRODUCTION: 'bg-blue-500/20 text-blue-400',
    RECORDING: 'bg-orange-500/20 text-orange-400',
    EDITING: 'bg-yellow-500/20 text-yellow-400',
    MIXING: 'bg-cyan-500/20 text-cyan-400',
    MIX_REVISIONS: 'bg-teal-500/20 text-teal-400',
    MASTERING: 'bg-pink-500/20 text-pink-400',
    DELIVERED: 'bg-green-500/20 text-green-400',
  };
  return colors[stage] || 'bg-gray-500/20 text-gray-400';
}

function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    PAID: 'bg-green-500/20 text-green-400',
    OVERDUE: 'bg-red-500/20 text-red-400',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-400';
}
