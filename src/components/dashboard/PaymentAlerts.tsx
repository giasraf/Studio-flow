'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePayments } from '@/hooks/useStore';
import { markPaymentPaid } from '@/lib/store';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

export function PaymentAlerts() {
  const t = useTranslations('payments');
  const locale = useLocale();
  const payments = usePayments();

  const pendingPayments = payments.filter(
    (p) => p.status === 'PENDING' || p.status === 'OVERDUE'
  );

  if (pendingPayments.length === 0) return null;

  return (
    <div>
      <h2 className="text-[15px] font-semibold mb-4">{t('title')}</h2>

      <div className="space-y-2">
        {pendingPayments.map((payment) => (
          <div
            key={payment.id}
            className="bg-background border border-border rounded-xl p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-[13px]">{payment.clientName}</p>
                <p className="text-[12px] text-muted mt-0.5">{payment.projectName}</p>
              </div>
              <span className="font-semibold text-[13px]">{formatCurrency(payment.amount)}</span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className={cn(
                'text-[11px] px-2 py-0.5 rounded-full font-medium',
                payment.status === 'OVERDUE'
                  ? 'bg-red-50 text-danger'
                  : 'bg-amber-50 text-warning'
              )}>
                {payment.status === 'OVERDUE' ? t('overdue') : t('pending')}
              </span>
              <span className="text-[12px] text-muted">
                {formatDate(payment.dueDate, locale)}
              </span>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => markPaymentPaid(payment.id)}
                className="flex-1 text-[12px] bg-foreground hover:bg-foreground/90 text-background rounded-lg py-1.5 font-medium transition-colors"
              >
                {t('markAsPaid')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
