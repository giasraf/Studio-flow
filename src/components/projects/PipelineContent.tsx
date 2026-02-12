'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  GitBranch,
  Music,
  User,
  Clock,
  MoreVertical,
  Plus,
  List,
  LayoutGrid,
} from 'lucide-react';
import { songStages, stageLabels } from '@/lib/mock-data';
import type { SongStage } from '@/lib/mock-data';
import { useSongs } from '@/hooks/useStore';
import { updateSongStage } from '@/lib/store';
import { cn } from '@/lib/utils';

const stageColors: Record<string, string> = {
  SKETCH: 'border-t-purple-500',
  PRODUCTION: 'border-t-blue-500',
  RECORDING: 'border-t-orange-500',
  EDITING: 'border-t-yellow-500',
  MIXING: 'border-t-cyan-500',
  MIX_REVISIONS: 'border-t-teal-500',
  MASTERING: 'border-t-pink-500',
  DELIVERED: 'border-t-green-500',
};

const stageBgColors: Record<string, string> = {
  SKETCH: 'bg-purple-500/10',
  PRODUCTION: 'bg-blue-500/10',
  RECORDING: 'bg-orange-500/10',
  EDITING: 'bg-yellow-500/10',
  MIXING: 'bg-cyan-500/10',
  MIX_REVISIONS: 'bg-teal-500/10',
  MASTERING: 'bg-pink-500/10',
  DELIVERED: 'bg-green-500/10',
};

const stageDotColors: Record<string, string> = {
  SKETCH: 'bg-purple-500',
  PRODUCTION: 'bg-blue-500',
  RECORDING: 'bg-orange-500',
  EDITING: 'bg-yellow-500',
  MIXING: 'bg-cyan-500',
  MIX_REVISIONS: 'bg-teal-500',
  MASTERING: 'bg-pink-500',
  DELIVERED: 'bg-green-500',
};

export function PipelineContent() {
  const t = useTranslations();
  const locale = useLocale();
  const [view, setView] = useState<'pipeline' | 'list'>('pipeline');
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
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-accent" />
            {t('pipeline.title')}
          </h1>
          <p className="text-sm text-muted mt-1">{t('pipeline.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-surface border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setView('pipeline')}
              className={cn(
                'p-2 transition-colors',
                view === 'pipeline' ? 'bg-accent/15 text-accent' : 'text-muted hover:text-foreground'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn(
                'p-2 transition-colors',
                view === 'list' ? 'bg-accent/15 text-accent' : 'text-muted hover:text-foreground'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            {t('projects.addSong')}
          </button>
        </div>
      </div>

      {view === 'pipeline' ? (
        /* Pipeline View (Kanban) */
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {songStages.map((stage) => {
            const songs = songsByStage[stage];
            const label = locale === 'he' ? stageLabels[stage].he : stageLabels[stage].en;

            return (
              <div
                key={stage}
                className={cn(
                  'flex-shrink-0 w-64 md:w-auto md:flex-1 pipeline-column'
                )}
              >
                {/* Column header */}
                <div className={cn('rounded-t-xl p-3 border-t-4', stageColors[stage], stageBgColors[stage])}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2.5 h-2.5 rounded-full', stageDotColors[stage])} />
                      <span className="text-sm font-semibold">{label}</span>
                    </div>
                    <span className="text-xs text-muted bg-background/50 px-2 py-0.5 rounded-full">
                      {songs.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-2 mt-2">
                  {songs.map((song) => (
                    <div
                      key={song.id}
                      className="glass rounded-xl p-4 hover:border-accent/30 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{song.title}</h3>
                          <p className="text-xs text-muted mt-1 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {song.clientName}
                          </p>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-surface-hover transition-all">
                          <MoreVertical className="w-4 h-4 text-muted" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mt-3">
                        {song.genre && (
                          <span className="text-xs bg-surface px-2 py-0.5 rounded">
                            {song.genre}
                          </span>
                        )}
                        {song.bpm && (
                          <span className="text-xs text-muted">{song.bpm} BPM</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {song.sessionCount} {t('projects.sessions')}
                        </span>
                        {song.key && (
                          <span className="bg-accent/10 text-accent px-1.5 py-0.5 rounded text-xs font-mono">
                            {song.key}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {songs.length === 0 && (
                    <div className="border border-dashed border-border rounded-xl p-6 text-center">
                      <Music className="w-6 h-6 text-muted mx-auto mb-2" />
                      <p className="text-xs text-muted">{t('common.noResults')}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-start p-4 text-xs font-semibold text-muted">{t('projects.songs')}</th>
                <th className="text-start p-4 text-xs font-semibold text-muted">{t('clients.title')}</th>
                <th className="text-start p-4 text-xs font-semibold text-muted">{t('projects.stage')}</th>
                <th className="text-start p-4 text-xs font-semibold text-muted">{t('projects.genre')}</th>
                <th className="text-start p-4 text-xs font-semibold text-muted">{t('projects.sessions')}</th>
                <th className="text-start p-4 text-xs font-semibold text-muted">{t('projects.bpm')}</th>
              </tr>
            </thead>
            <tbody>
              {allSongs.map((song) => (
                <tr
                  key={song.id}
                  className="border-b border-border hover:bg-surface-hover cursor-pointer transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium">{song.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted">{song.clientName}</td>
                  <td className="p-4">
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-lg font-medium inline-flex items-center gap-1',
                      stageBgColors[song.stage]
                    )}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', stageDotColors[song.stage])} />
                      {locale === 'he' ? stageLabels[song.stage].he : stageLabels[song.stage].en}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted">{song.genre}</td>
                  <td className="p-4 text-sm text-muted">{song.sessionCount}</td>
                  <td className="p-4 text-sm text-muted">{song.bpm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
