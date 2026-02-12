'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Upload,
  FileAudio,
  User,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { mockSongs } from '@/lib/mock-data';
import { formatDate, cn } from '@/lib/utils';
import { AudioPlayer } from '@/components/audio/AudioPlayer';

interface MockFile {
  id: string;
  songId: string;
  songTitle: string;
  clientName: string;
  name: string;
  type: string;
  version: number;
  duration: number;
  createdAt: string;
  commentCount: number;
}

const mockFiles: MockFile[] = [
  {
    id: 'file-1',
    songId: 'song-1',
    songTitle: 'לילה בתל אביב',
    clientName: 'דניאל לוי',
    name: 'לילה בתל אביב - Mix V3',
    type: 'MIX',
    version: 3,
    duration: 210,
    createdAt: '2026-02-08',
    commentCount: 4,
  },
  {
    id: 'file-2',
    songId: 'song-1',
    songTitle: 'לילה בתל אביב',
    clientName: 'דניאל לוי',
    name: 'לילה בתל אביב - Mix V2',
    type: 'MIX_REVISION',
    version: 2,
    duration: 208,
    createdAt: '2026-02-05',
    commentCount: 6,
  },
  {
    id: 'file-3',
    songId: 'song-1',
    songTitle: 'לילה בתל אביב',
    clientName: 'דניאל לוי',
    name: 'לילה בתל אביב - Vocals Edited',
    type: 'VOCAL_EDITED',
    version: 1,
    duration: 195,
    createdAt: '2026-02-03',
    commentCount: 0,
  },
  {
    id: 'file-4',
    songId: 'song-3',
    songTitle: 'רוח חופשית',
    clientName: 'מיכל כהן',
    name: 'רוח חופשית - Production V2',
    type: 'PRODUCTION',
    version: 2,
    duration: 240,
    createdAt: '2026-02-05',
    commentCount: 2,
  },
  {
    id: 'file-5',
    songId: 'song-7',
    songTitle: 'עוד יום',
    clientName: 'מיכל כהן',
    name: 'עוד יום - Master',
    type: 'MASTER',
    version: 1,
    duration: 220,
    createdAt: '2026-02-03',
    commentCount: 1,
  },
  {
    id: 'file-6',
    songId: 'song-2',
    songTitle: 'בוקר חדש',
    clientName: 'דניאל לוי',
    name: 'בוקר חדש - Sketch V1',
    type: 'SKETCH',
    version: 1,
    duration: 180,
    createdAt: '2026-02-06',
    commentCount: 0,
  },
];

const typeDotColors: Record<string, string> = {
  SKETCH: 'bg-violet-400',
  PRODUCTION: 'bg-blue-400',
  VOCAL_RAW: 'bg-orange-400',
  VOCAL_EDITED: 'bg-yellow-400',
  MIX: 'bg-cyan-400',
  MIX_REVISION: 'bg-teal-400',
  MASTER: 'bg-pink-400',
  REFERENCE: 'bg-gray-400',
};

export function FilesContent() {
  const t = useTranslations();
  const locale = useLocale();
  const [selectedFile, setSelectedFile] = useState<MockFile | null>(null);
  const [filterSong, setFilterSong] = useState<string>('all');

  const filtered = filterSong === 'all'
    ? mockFiles
    : mockFiles.filter((f) => f.songId === filterSong);

  const songOptions = [...new Map(mockFiles.map((f) => [f.songId, { id: f.songId, title: f.songTitle }])).values()];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{t('files.title')}</h1>
          <p className="text-[13px] text-muted mt-1">{locale === 'he' ? 'ניהול קבצי אודיו ומיקסים' : 'Manage audio files and mixes'}</p>
        </div>
        <button className="flex items-center gap-1.5 bg-foreground hover:bg-foreground/90 text-background rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors">
          <Upload className="w-3.5 h-3.5" />
          {t('files.upload')}
        </button>
      </div>

      {/* Filter by song */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterSong('all')}
          className={cn(
            'px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors whitespace-nowrap',
            filterSong === 'all'
              ? 'bg-foreground text-background'
              : 'text-muted hover:text-foreground hover:bg-surface-hover'
          )}
        >
          {t('common.all')}
        </button>
        {songOptions.map((song) => (
          <button
            key={song.id}
            onClick={() => setFilterSong(song.id)}
            className={cn(
              'px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors whitespace-nowrap',
              filterSong === song.id
                ? 'bg-foreground text-background'
                : 'text-muted hover:text-foreground hover:bg-surface-hover'
            )}
          >
            {song.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File List */}
        <div className="space-y-2">
          {filtered.map((file) => (
            <div
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className={cn(
                'bg-background border rounded-lg p-3.5 cursor-pointer transition-all duration-150',
                selectedFile?.id === file.id
                  ? 'border-foreground'
                  : 'border-border hover:border-foreground/30'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center flex-shrink-0">
                  <FileAudio className="w-4 h-4 text-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[13px] truncate">{file.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                      <span className={cn('w-1.5 h-1.5 rounded-full', typeDotColors[file.type])} />
                      {t(`files.typeLabels.${file.type}` as any)}
                    </span>
                    <span className="text-[11px] text-muted">V{file.version}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {file.clientName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(file.createdAt, locale)}
                    </span>
                    {file.commentCount > 0 && (
                      <span className="flex items-center gap-1 text-amber-600">
                        <MessageSquare className="w-3 h-3" />
                        {file.commentCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Audio Player */}
        <div>
          {selectedFile ? (
            <AudioPlayer
              title={selectedFile.songTitle}
              artist={selectedFile.clientName}
              version={selectedFile.version}
              duration={selectedFile.duration}
            />
          ) : (
            <div className="border border-dashed border-border rounded-xl p-12 text-center">
              <FileAudio className="w-10 h-10 text-muted/40 mx-auto mb-2" />
              <p className="text-[13px] text-muted">{locale === 'he' ? 'בחר קובץ כדי להאזין' : 'Select a file to listen'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
