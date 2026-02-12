import { setRequestLocale } from 'next-intl/server';
import { PortalContent } from '@/components/portal/PortalContent';

export default async function PortalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PortalContent />;
}
