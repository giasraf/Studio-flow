'use client';

import { useTranslations, useLocale } from 'next-intl';
import { CreditCard, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { mockPayments } from '@/lib/mock-data';
import { formatCurrency, formatDate, getPaymentStatusColor, cn } from '@/lib/utils';

export function PaymentAlerts() {
  const t = useTranslations('payments');
  const locale = useLocale();

  const pendingPayments = mockPayments.filter(
    (p) => p.status === 'PENDING' || p.status === 'OVERDUE'
  );

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-warning" />
        {t('title')}
      </h2>

      <div className="space-y-3">
        {pendingPayments.map((payment) => (
          <div
            key={payment.id}
            className={cn(
              'bg-background/50 rounded-xl p-4 border-s-4',
              payment.status === 'OVERDUE' ? 'border-s-danger' : 'border-s-warning'
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">{payment.clientName}</p>
                <p className="text-xs text-muted mt-0.5">{payment.projectName}</p>
              </div>
              <span className="font-bold text-sm">{formatCurrency(payment.amount)}</span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className={cn('text-xs px-2 py-0.5 rounded-full', getPaymentStatusColor(payment.status))}>
                {payment.status === 'OVERDUE' ? t('overdue') : t('pending')}
              </span>
              <span className="text-xs text-muted">
                {t('dueDate')}: {formatDate(payment.dueDate, locale)}
              </span>
            </div>

            {payment.installmentNum && (
              <p className="text-xs text-muted mt-2">
                {t('installmentOf', {
                  num: payment.installmentNum,
                  total: payment.totalInstallments,
                })}
              </p>
            )}

            <div className="flex gap-2 mt-3">
              <button className="flex-1 text-xs bg-accent hover:bg-accent-hover text-white rounded-lg py-1.5 transition-colors">
                {t('markAsPaid')}
              </button>
              <button className="flex-1 text-xs border border-border hover:bg-surface-hover rounded-lg py-1.5 transition-colors">
                {t('sendReminder')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
