import { setRequestLocale } from 'next-intl/server';
import { PipelineContent } from '@/components/projects/PipelineContent';

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PipelineContent />;
}
