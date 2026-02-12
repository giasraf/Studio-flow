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
import { useClients, useSongs, usePayments } from '@/hooks/useStore';
import { addClient } from '@/lib/store';
import { formatCurrency, formatDate, getInitials, cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';

type SortBy = 'name' | 'totalPaid' | 'totalOwed' | 'lastSession';
type FilterBy = 'all' | 'active' | 'owes' | 'needsFollowUp';

export function ClientsContent() {
  const t = useTranslations();
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', source: '' });

  const clients = useClients();
  const songs = useSongs();
  const payments = usePayments();

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) return;
    addClient(newClient);
    setNewClient({ name: '', email: '', phone: '', source: '' });
    setShowAddModal(false);
  };

  const filteredClients = clients
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
    ? clients.find((c) => c.id === selectedClient)
    : null;

  const clientSongs = selected
    ? songs.filter((s) => s.clientId === selected.id)
    : [];

  const clientPayments = selected
    ? payments.filter((p) => p.clientId === selected.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {t('clients.title')}
          </h1>
          <p className="text-[12px] text-muted mt-1">
            {clients.length} {t('clients.title')}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-foreground text-background rounded-lg px-3 py-1.5 text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
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
            className="w-full bg-surface border border-border rounded-lg ps-10 pe-4 py-2 text-[13px] placeholder:text-muted focus:outline-none focus:border-foreground transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'owes', 'needsFollowUp'] as FilterBy[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterBy(filter)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors whitespace-nowrap',
                filterBy === filter
                  ? 'bg-foreground text-background'
                  : 'bg-surface border border-border text-muted hover:text-foreground hover:border-foreground/20'
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
                  'bg-background border border-border rounded-xl p-4 cursor-pointer transition-all',
                  selectedClient === client.id
                    ? 'border-foreground shadow-sm'
                    : 'hover:border-foreground/30 hover:shadow-sm'
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-foreground text-[13px] font-medium flex-shrink-0">
                    {getInitials(client.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[13px] font-semibold">{client.name}</h3>
                      {needsFollowUp && (
                        <span className="flex items-center gap-1 text-[11px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          {t('clients.needsFollowUp')}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[12px] text-muted">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {client.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {client.email}
                      </span>
                      {client.source && (
                        <span className="bg-surface px-2 py-0.5 rounded text-[11px] border border-border">
                          {client.source}
                        </span>
                      )}
                    </div>

                    {/* Stats row */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-muted" />
                        <span className="text-[12px]">
                          <span className="text-foreground font-medium">{formatCurrency(client.totalPaid)}</span>
                          <span className="text-muted"> {t('clients.totalPaid')}</span>
                        </span>
                      </div>
                      {client.totalOwed > 0 && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-muted" />
                          <span className="text-[12px]">
                            <span className="text-orange-600 font-medium">{formatCurrency(client.totalOwed)}</span>
                            <span className="text-muted"> {t('clients.totalOwed')}</span>
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Music className="w-3.5 h-3.5 text-muted" />
                        <span className="text-[12px] text-muted">
                          {client.activeProjects} {t('clients.activeProjects')} / {client.projectCount} {t('clients.projects')}
                        </span>
                      </div>
                      {client.lastSession && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-muted" />
                          <span className="text-[12px] text-muted">
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
            <div className="bg-background border border-border rounded-xl p-6 sticky top-4 space-y-6">
              {/* Client header */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-foreground text-lg font-semibold mx-auto">
                  {getInitials(selected.name)}
                </div>
                <h2 className="text-[15px] font-semibold mt-3">{selected.name}</h2>
                <p className="text-[12px] text-muted">{selected.email}</p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface border border-border rounded-lg p-3 text-center">
                  <p className="text-[15px] font-semibold text-foreground">{formatCurrency(selected.totalPaid)}</p>
                  <p className="text-[11px] text-muted mt-0.5">{t('clients.totalPaid')}</p>
                </div>
                <div className="bg-surface border border-border rounded-lg p-3 text-center">
                  <p className="text-[15px] font-semibold text-orange-600">{formatCurrency(selected.totalOwed)}</p>
                  <p className="text-[11px] text-muted mt-0.5">{t('clients.totalOwed')}</p>
                </div>
              </div>

              {/* Client songs */}
              {clientSongs.length > 0 && (
                <div>
                  <h3 className="text-[12px] font-semibold mb-3">{t('projects.songs')}</h3>
                  <div className="space-y-2">
                    {clientSongs.map((song) => (
                      <div key={song.id} className="bg-surface border border-border rounded-lg p-3 flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-medium truncate">{song.title}</p>
                          <p className="text-[11px] text-muted">{song.genre}</p>
                        </div>
                        <span className={cn('text-[11px] px-2 py-0.5 rounded-full ml-2 flex-shrink-0', getStageColor(song.stage))}>
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
                  <h3 className="text-[12px] font-semibold mb-3">{t('clients.paymentHistory')}</h3>
                  <div className="space-y-2">
                    {clientPayments.map((payment) => (
                      <div key={payment.id} className="bg-surface border border-border rounded-lg p-3 flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-medium">{formatCurrency(payment.amount)}</p>
                          <p className="text-[11px] text-muted truncate">{payment.projectName}</p>
                        </div>
                        <span className={cn('text-[11px] px-2 py-0.5 rounded-full ml-2 flex-shrink-0', getPaymentStatusColor(payment.status))}>
                          {payment.status === 'PAID' ? t('paid') : payment.status === 'OVERDUE' ? t('overdue') : t('pending')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-foreground text-background rounded-lg py-2 text-[13px] font-medium hover:opacity-90 transition-opacity">
                  {t('dashboard.newSession')}
                </button>
                <button className="flex-1 border border-border rounded-lg py-2 text-[13px] font-medium hover:bg-surface transition-colors">
                  {t('clients.followUp')}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-background border border-border rounded-xl p-8 text-center">
              <Users className="w-12 h-12 text-muted mx-auto mb-3" />
              <p className="text-[13px] text-muted">{t('clients.clientDetails')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Client Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={t('clients.addClient')}>
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium mb-1.5">{t('common.name')}</label>
            <input
              type="text"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-foreground transition-colors"
              placeholder={locale === 'he' ? 'שם מלא' : 'Full name'}
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1.5">{t('common.email')}</label>
            <input
              type="email"
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-foreground transition-colors"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1.5">{t('common.phone')}</label>
            <input
              type="tel"
              value={newClient.phone}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-foreground transition-colors"
              placeholder="054-1234567"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1.5">{locale === 'he' ? 'מקור' : 'Source'}</label>
            <input
              type="text"
              value={newClient.source}
              onChange={(e) => setNewClient({ ...newClient, source: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-foreground transition-colors"
              placeholder={locale === 'he' ? 'המלצה, אינסטגרם...' : 'Referral, Instagram...'}
            />
          </div>
          <button
            onClick={handleAddClient}
            disabled={!newClient.name || !newClient.email}
            className="w-full bg-foreground disabled:opacity-50 disabled:cursor-not-allowed text-background rounded-lg py-2 text-[13px] font-medium hover:opacity-90 transition-opacity"
          >
            {t('clients.addClient')}
          </button>
        </div>
      </Modal>
    </div>
  );
}

function getStageColor(stage: string): string {
  const colors: Record<string, string> = {
    SKETCH: 'bg-purple-50 text-purple-600 border border-purple-200',
    PRODUCTION: 'bg-blue-50 text-blue-600 border border-blue-200',
    RECORDING: 'bg-orange-50 text-orange-600 border border-orange-200',
    EDITING: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
    MIXING: 'bg-cyan-50 text-cyan-600 border border-cyan-200',
    MIX_REVISIONS: 'bg-teal-50 text-teal-600 border border-teal-200',
    MASTERING: 'bg-pink-50 text-pink-600 border border-pink-200',
    DELIVERED: 'bg-green-50 text-green-600 border border-green-200',
  };
  return colors[stage] || 'bg-gray-50 text-gray-600 border border-gray-200';
}

function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
    PAID: 'bg-green-50 text-green-600 border border-green-200',
    OVERDUE: 'bg-red-50 text-red-600 border border-red-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-600 border border-gray-200';
}
