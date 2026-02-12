import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { UpcomingSessions } from '@/components/dashboard/UpcomingSessions';
import { PaymentAlerts } from '@/components/dashboard/PaymentAlerts';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DashboardContent />;
}

function DashboardContent() {
  const t = useTranslations('dashboard');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{t('welcome')}</h1>
        <p className="text-muted text-[13px] mt-1">{t('overview')}</p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <UpcomingSessions />
        </div>
        <div className="lg:col-span-2">
          <PaymentAlerts />
        </div>
      </div>
    </div>
  );
}
