'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Music, User, Clock, Plus, List, LayoutGrid } from 'lucide-react';
import { songStages, stageLabels } from '@/lib/mock-data';
import type { SongStage } from '@/lib/mock-data';
import { useSongs } from '@/hooks/useStore';
import { cn } from '@/lib/utils';

const stageDotColors: Record<string, string> = {
  SKETCH: 'bg-violet-400',
  PRODUCTION: 'bg-blue-400',
  RECORDING: 'bg-orange-400',
  EDITING: 'bg-yellow-400',
  MIXING: 'bg-cyan-400',
  MIX_REVISIONS: 'bg-teal-400',
  MASTERING: 'bg-pink-400',
  DELIVERED: 'bg-green-400',
};

export function PipelineContent() {
  const t = useTranslations();
  const locale = useLocale();
  const [view, setView] = useState<'pipeline' | 'list'>('list');
  const allSongs = useSongs();

  const songsByStage = songStages.reduce(
    (acc, stage) => {
      acc[stage] = allSongs.filter((s) => s.stage === stage);
      return acc;
    },
    {} as Record<SongStage, typeof allSongs>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{t('pipeline.title')}</h1>
          <p className="text-[13px] text-muted mt-1">{t('pipeline.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setView('list')}
              className={cn(
                'p-1.5 transition-colors',
                view === 'list' ? 'bg-surface-hover text-foreground' : 'text-muted hover:text-foreground'
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('pipeline')}
              className={cn(
                'p-1.5 transition-colors',
                view === 'pipeline' ? 'bg-surface-hover text-foreground' : 'text-muted hover:text-foreground'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-1.5 bg-foreground hover:bg-foreground/90 text-background rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors">
            <Plus className="w-3.5 h-3.5" />
            {t('projects.addSong')}
          </button>
        </div>
      </div>

      {view === 'list' ? (
        /* List View - Default */
        <div className="bg-background border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-start px-4 py-3 text-[12px] font-medium text-muted">{t('projects.songs')}</th>
                <th className="text-start px-4 py-3 text-[12px] font-medium text-muted">{t('clients.title')}</th>
                <th className="text-start px-4 py-3 text-[12px] font-medium text-muted">{t('projects.stage')}</th>
                <th className="text-start px-4 py-3 text-[12px] font-medium text-muted hidden md:table-cell">{t('projects.genre')}</th>
                <th className="text-start px-4 py-3 text-[12px] font-medium text-muted hidden md:table-cell">{t('projects.sessions')}</th>
              </tr>
            </thead>
            <tbody>
              {allSongs.map((song) => (
                <tr
                  key={song.id}
                  className="border-b border-border last:border-0 hover:bg-surface transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-medium">{song.title}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted">{song.clientName}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-muted">
                      <span className={cn('w-2 h-2 rounded-full', stageDotColors[song.stage])} />
                      {locale === 'he' ? stageLabels[song.stage].he : stageLabels[song.stage].en}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted hidden md:table-cell">{song.genre}</td>
                  <td className="px-4 py-3 text-[13px] text-muted hidden md:table-cell">{song.sessionCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Pipeline View (Kanban) */
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {songStages.map((stage) => {
            const songs = songsByStage[stage];
            const label = locale === 'he' ? stageLabels[stage].he : stageLabels[stage].en;

            return (
              <div key={stage} className="flex-shrink-0 w-56 md:w-auto md:flex-1 pipeline-column">
                <div className="flex items-center gap-2 px-1 mb-2">
                  <span className={cn('w-2 h-2 rounded-full', stageDotColors[stage])} />
                  <span className="text-[12px] font-medium text-muted">{label}</span>
                  <span className="text-[11px] text-muted/60">{songs.length}</span>
                </div>

                <div className="space-y-2">
                  {songs.map((song) => (
                    <div
                      key={song.id}
                      className="bg-background border border-border rounded-lg p-3 hover:border-border-light transition-colors cursor-pointer"
                    >
                      <h3 className="font-medium text-[13px]">{song.title}</h3>
                      <p className="text-[12px] text-muted mt-1">{song.clientName}</p>
                      {song.genre && (
                        <p className="text-[11px] text-muted mt-2">{song.genre}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
