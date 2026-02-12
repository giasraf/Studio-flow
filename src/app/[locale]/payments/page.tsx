import { setRequestLocale } from 'next-intl/server';
import { PaymentsContent } from '@/components/payments/PaymentsContent';

export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PaymentsContent />;
}
