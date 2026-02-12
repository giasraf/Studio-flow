'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  FolderOpen,
  Upload,
  Music,
  FileAudio,
  User,
  Clock,
  Download,
  Play,
  MessageSquare,
} from 'lucide-react';
import { mockSongs, stageLabels } from '@/lib/mock-data';
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

const typeColors: Record<string, string> = {
  SKETCH: 'bg-purple-500/20 text-purple-400',
  PRODUCTION: 'bg-blue-500/20 text-blue-400',
  VOCAL_RAW: 'bg-orange-500/20 text-orange-400',
  VOCAL_EDITED: 'bg-yellow-500/20 text-yellow-400',
  MIX: 'bg-cyan-500/20 text-cyan-400',
  MIX_REVISION: 'bg-teal-500/20 text-teal-400',
  MASTER: 'bg-pink-500/20 text-pink-400',
  REFERENCE: 'bg-gray-500/20 text-gray-400',
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
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-accent" />
            {t('files.title')}
          </h1>
        </div>
        <button className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors">
          <Upload className="w-4 h-4" />
          {t('files.upload')}
        </button>
      </div>

      {/* Filter by song */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterSong('all')}
          className={cn(
            'px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap',
            filterSong === 'all'
              ? 'bg-accent/15 text-accent'
              : 'bg-surface border border-border text-muted hover:text-foreground'
          )}
        >
          {t('common.all')}
        </button>
        {songOptions.map((song) => (
          <button
            key={song.id}
            onClick={() => setFilterSong(song.id)}
            className={cn(
              'px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap',
              filterSong === song.id
                ? 'bg-accent/15 text-accent'
                : 'bg-surface border border-border text-muted hover:text-foreground'
            )}
          >
            {song.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File List */}
        <div className="space-y-3">
          {filtered.map((file) => (
            <div
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className={cn(
                'glass rounded-xl p-4 cursor-pointer transition-all duration-200',
                selectedFile?.id === file.id
                  ? 'border-accent glow-accent'
                  : 'hover:border-border-light'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <FileAudio className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{file.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn('text-xs px-2 py-0.5 rounded-lg', typeColors[file.type])}>
                      {t(`files.typeLabels.${file.type}` as any)}
                    </span>
                    <span className="text-xs text-muted">V{file.version}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {file.clientName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(file.createdAt, locale)}
                    </span>
                    {file.commentCount > 0 && (
                      <span className="flex items-center gap-1 text-warning">
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
            <div className="glass rounded-2xl p-12 text-center">
              <FileAudio className="w-12 h-12 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted">בחר קובץ כדי להאזין</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
