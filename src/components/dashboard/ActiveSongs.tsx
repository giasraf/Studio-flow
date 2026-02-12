'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Music, User, Clock } from 'lucide-react';
import { mockSongs, stageLabels } from '@/lib/mock-data';
import { getStageColor, formatDate, cn } from '@/lib/utils';
import type { SongStage } from '@/lib/mock-data';

const stageOrder: SongStage[] = [
  'SKETCH', 'PRODUCTION', 'RECORDING', 'EDITING',
  'MIXING', 'MIX_REVISIONS', 'MASTERING', 'DELIVERED',
];

export function ActiveSongs() {
  const t = useTranslations();
  const locale = useLocale();

  const activeSongs = mockSongs
    .filter((s) => s.stage !== 'DELIVERED')
    .sort((a, b) => stageOrder.indexOf(b.stage) - stageOrder.indexOf(a.stage));

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Music className="w-5 h-5 text-accent" />
          {t('dashboard.activeSongs')}
        </h2>
        <span className="text-sm text-muted">{activeSongs.length} {t('common.active')}</span>
      </div>

      <div className="space-y-3">
        {activeSongs.map((song) => {
          const stageLabel = stageLabels[song.stage];
          const progress = ((stageOrder.indexOf(song.stage) + 1) / stageOrder.length) * 100;

          return (
            <div
              key={song.id}
              className="bg-background/50 rounded-xl p-4 hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-sm">{song.title}</h3>
                  <p className="text-xs text-muted flex items-center gap-1 mt-1">
                    <User className="w-3 h-3" />
                    {song.clientName}
                  </p>
                </div>
                <span className={cn('text-xs px-2 py-1 rounded-lg font-medium', getStageColor(song.stage))}>
                  {locale === 'he' ? stageLabel.he : stageLabel.en}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted mb-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {song.sessionCount} {t('projects.sessions')}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
