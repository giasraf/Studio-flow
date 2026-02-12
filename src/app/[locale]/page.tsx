import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { UpcomingSessions } from '@/components/dashboard/UpcomingSessions';
import { RevenueOverview } from '@/components/dashboard/RevenueOverview';
import { ActiveSongs } from '@/components/dashboard/ActiveSongs';
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
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t('welcome')}</h1>
          <p className="text-muted text-sm mt-1">{t('overview')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions - Takes 2 columns */}
        <div className="lg:col-span-2">
          <UpcomingSessions />
        </div>

        {/* Payment Alerts */}
        <div>
          <PaymentAlerts />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Songs */}
        <div className="lg:col-span-2">
          <ActiveSongs />
        </div>

        {/* Revenue Overview */}
        <div>
          <RevenueOverview />
        </div>
      </div>
    </div>
  );
}
