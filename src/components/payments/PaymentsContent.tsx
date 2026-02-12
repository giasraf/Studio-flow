'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
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
        <h1 className="text-xl font-semibold tracking-tight">
          {t('payments.title')}
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-background border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
              <p className="text-[12px] text-muted">{t('payments.paid')}</p>
            </div>
          </div>
        </div>
        <div className="bg-background border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalPending)}</p>
              <p className="text-[12px] text-muted">{t('payments.pending')}</p>
            </div>
          </div>
        </div>
        <div className="bg-background border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOverdue)}</p>
              <p className="text-[12px] text-muted">{t('payments.overdue')}</p>
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
              'px-4 py-2 rounded-xl text-[12px] font-medium transition-colors',
              filter === status
                ? 'bg-foreground text-background'
                : 'bg-background border border-border text-muted hover:text-foreground'
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
      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-start p-4 text-[12px] font-semibold text-muted">{t('clients.title')}</th>
              <th className="text-start p-4 text-[12px] font-semibold text-muted">{t('projects.title')}</th>
              <th className="text-start p-4 text-[12px] font-semibold text-muted">{t('payments.amount')}</th>
              <th className="text-start p-4 text-[12px] font-semibold text-muted hidden sm:table-cell">{t('payments.dueDate')}</th>
              <th className="text-start p-4 text-[12px] font-semibold text-muted">Status</th>
              <th className="text-start p-4 text-[12px] font-semibold text-muted"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-border hover:bg-surface-hover transition-colors"
              >
                <td className="p-4 text-[13px] font-medium">{payment.clientName}</td>
                <td className="p-4">
                  <div>
                    <p className="text-[13px]">{payment.projectName}</p>
                    {payment.installmentNum && (
                      <p className="text-[12px] text-muted">
                        {t('payments.installmentOf', {
                          num: payment.installmentNum,
                          total: payment.totalInstallments,
                        })}
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-4 text-[13px] font-bold">{formatCurrency(payment.amount)}</td>
                <td className="p-4 text-[13px] text-muted hidden sm:table-cell">
                  {formatDate(payment.dueDate, locale)}
                </td>
                <td className="p-4">
                  <span className={cn(
                    'text-[12px] px-2.5 py-1 rounded-full font-medium',
                    payment.status === 'PAID' ? 'bg-green-50 text-green-600' :
                    payment.status === 'OVERDUE' ? 'bg-red-50 text-red-600' :
                    'bg-amber-50 text-amber-600'
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
                        className="text-[12px] bg-foreground text-background hover:opacity-90 px-3 py-1.5 rounded-lg transition-opacity"
                      >
                        {t('payments.markAsPaid')}
                      </button>
                      <button className="text-[12px] border border-border hover:bg-surface-hover px-3 py-1.5 rounded-lg transition-colors">
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
