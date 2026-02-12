import { setRequestLocale } from 'next-intl/server';
import { ClientsContent } from '@/components/clients/ClientsContent';

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ClientsContent />;
}
