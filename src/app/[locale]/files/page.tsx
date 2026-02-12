import { setRequestLocale } from 'next-intl/server';
import { FilesContent } from '@/components/files/FilesContent';

export default async function FilesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FilesContent />;
}
