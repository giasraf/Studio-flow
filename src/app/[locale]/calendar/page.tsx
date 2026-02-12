import { setRequestLocale } from 'next-intl/server';
import { CalendarContent } from '@/components/calendar/CalendarContent';

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CalendarContent />;
}
