'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  CreditCard,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Send,
  Filter,
  TrendingUp,
} from 'lucide-react';
import { usePayments } from '@/hooks/useStore';
import { markPaymentPaid } from '@/lib/store';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

type FilterStatus = 'all' | 'PENDING' | 'PAID' | 'OVERDUE';

export function PaymentsContent() {
  const t = useTranslations();
  const locale = useLocale();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const payments = usePayments();

  const filtered = filter === 'all'
    ? payments
    : payments.filter((p) => p.status === filter);

  const totalPaid = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = payments
    .filter((p) => p.status === 'OVERDUE')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-accent" />
          {t('payments.title')}
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 glow-success">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{formatCurrency(totalPaid)}</p>
              <p className="text-xs text-muted">{t('payments.paid')}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 glow-warning">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{formatCurrency(totalPending)}</p>
              <p className="text-xs text-muted">{t('payments.pending')}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 glow-danger">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-2xl font-bold text-danger">{formatCurrency(totalOverdue)}</p>
              <p className="text-xs text-muted">{t('payments.overdue')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'PENDING', 'PAID', 'OVERDUE'] as FilterStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              filter === status
                ? 'bg-accent/15 text-accent'
                : 'bg-surface border border-border text-muted hover:text-foreground'
            )}
          >
            {status === 'all' ? t('common.all') :
             status === 'PAID' ? t('payments.paid') :
             status === 'OVERDUE' ? t('payments.overdue') :
             t('payments.pending')}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-start p-4 text-xs font-semibold text-muted">{t('clients.title')}</th>
              <th className="text-start p-4 text-xs font-semibold text-muted">{t('projects.title')}</th>
              <th className="text-start p-4 text-xs font-semibold text-muted">{t('payments.amount')}</th>
              <th className="text-start p-4 text-xs font-semibold text-muted hidden sm:table-cell">{t('payments.dueDate')}</th>
              <th className="text-start p-4 text-xs font-semibold text-muted">Status</th>
              <th className="text-start p-4 text-xs font-semibold text-muted"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-border hover:bg-surface-hover transition-colors"
              >
                <td className="p-4 text-sm font-medium">{payment.clientName}</td>
                <td className="p-4">
                  <div>
                    <p className="text-sm">{payment.projectName}</p>
                    {payment.installmentNum && (
                      <p className="text-xs text-muted">
                        {t('payments.installmentOf', {
                          num: payment.installmentNum,
                          total: payment.totalInstallments,
                        })}
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-4 text-sm font-bold">{formatCurrency(payment.amount)}</td>
                <td className="p-4 text-sm text-muted hidden sm:table-cell">
                  {formatDate(payment.dueDate, locale)}
                </td>
                <td className="p-4">
                  <span className={cn(
                    'text-xs px-2.5 py-1 rounded-full font-medium',
                    payment.status === 'PAID' ? 'bg-green-500/20 text-green-400' :
                    payment.status === 'OVERDUE' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  )}>
                    {payment.status === 'PAID' ? t('payments.paid') :
                     payment.status === 'OVERDUE' ? t('payments.overdue') :
                     t('payments.pending')}
                  </span>
                </td>
                <td className="p-4">
                  {payment.status !== 'PAID' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => markPaymentPaid(payment.id)}
                        className="text-xs bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {t('payments.markAsPaid')}
                      </button>
                      <button className="text-xs border border-border hover:bg-surface-hover px-3 py-1.5 rounded-lg transition-colors">
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
