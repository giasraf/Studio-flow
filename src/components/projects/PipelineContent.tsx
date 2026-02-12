'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, List, LayoutGrid, ChevronDown } from 'lucide-react';
import { songStages, stageLabels } from '@/lib/mock-data';
import type { SongStage } from '@/lib/mock-data';
import { useSongs, useClients } from '@/hooks/useStore';
import { addSong, updateSongStage } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [stageMenuId, setStageMenuId] = useState<string | null>(null);
  const [newSong, setNewSong] = useState({ title: '', clientId: '', genre: '', bpm: '', key: '' });
  const allSongs = useSongs();
  const clients = useClients();

  const handleAddSong = () => {
    if (!newSong.title || !newSong.clientId) return;
    const client = clients.find((c) => c.id === newSong.clientId);
    addSong({
      projectId: `project-${Date.now()}`,
      clientId: newSong.clientId,
      clientName: client?.name || '',
      title: newSong.title,
      genre: newSong.genre || undefined,
      bpm: newSong.bpm ? parseInt(newSong.bpm) : undefined,
      key: newSong.key || undefined,
    });
    setNewSong({ title: '', clientId: '', genre: '', bpm: '', key: '' });
    setShowAddModal(false);
  };

  const handleStageChange = (songId: string, newStage: string) => {
    updateSongStage(songId, newStage);
    setStageMenuId(null);
  };

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
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-foreground hover:bg-foreground/90 text-background rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('projects.addSong')}
          </button>
        </div>
      </div>

      {view === 'list' ? (
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
                  className="border-b border-border last:border-0 hover:bg-surface transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-medium">{song.title}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted">{song.clientName}</td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={() => setStageMenuId(stageMenuId === song.id ? null : song.id)}
                        className="inline-flex items-center gap-1.5 text-[12px] text-muted hover:text-foreground transition-colors"
                      >
                        <span className={cn('w-2 h-2 rounded-full', stageDotColors[song.stage])} />
                        {locale === 'he' ? stageLabels[song.stage].he : stageLabels[song.stage].en}
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {stageMenuId === song.id && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setStageMenuId(null)} />
                          <div className="absolute start-0 top-full mt-1 w-40 bg-background border border-border rounded-lg shadow-lg z-40 p-1 animate-scale-in">
                            {songStages.map((stage) => (
                              <button
                                key={stage}
                                onClick={() => handleStageChange(song.id, stage)}
                                className={cn(
                                  'w-full flex items-center gap-2 text-start px-2.5 py-1.5 text-[12px] rounded-md hover:bg-surface-hover transition-colors',
                                  song.stage === stage && 'font-medium text-foreground'
                                )}
                              >
                                <span className={cn('w-2 h-2 rounded-full', stageDotColors[stage])} />
                                {locale === 'he' ? stageLabels[stage].he : stageLabels[stage].en}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted hidden md:table-cell">{song.genre}</td>
                  <td className="px-4 py-3 text-[13px] text-muted hidden md:table-cell">{song.sessionCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
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
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Song Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={t('projects.addSong')}>
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-muted mb-1.5">{t('projects.songs')}</label>
            <input
              type="text"
              value={newSong.title}
              onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-foreground transition-colors"
              placeholder={locale === 'he' ? 'שם השיר' : 'Song name'}
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted mb-1.5">{t('clients.title')}</label>
            <select
              value={newSong.clientId}
              onChange={(e) => setNewSong({ ...newSong, clientId: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-foreground transition-colors"
            >
              <option value="">{locale === 'he' ? 'בחר לקוח' : 'Select client'}</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-muted mb-1.5">{t('projects.genre')}</label>
              <input
                type="text"
                value={newSong.genre}
                onChange={(e) => setNewSong({ ...newSong, genre: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-foreground transition-colors"
                placeholder="Pop"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-muted mb-1.5">BPM</label>
              <input
                type="number"
                value={newSong.bpm}
                onChange={(e) => setNewSong({ ...newSong, bpm: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-foreground transition-colors"
                placeholder="120"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-muted mb-1.5">Key</label>
              <input
                type="text"
                value={newSong.key}
                onChange={(e) => setNewSong({ ...newSong, key: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-foreground transition-colors"
                placeholder="Am"
              />
            </div>
          </div>
          <button
            onClick={handleAddSong}
            disabled={!newSong.title || !newSong.clientId}
            className="w-full bg-foreground hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed text-background rounded-lg py-2 text-[13px] font-medium transition-colors"
          >
            {t('projects.addSong')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
