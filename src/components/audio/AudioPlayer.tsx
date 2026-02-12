'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  MessageSquare,
  Send,
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: number; // seconds
  resolved: boolean;
  createdAt: string;
}

interface AudioPlayerProps {
  title: string;
  artist?: string;
  version?: number;
  duration?: number; // seconds
}

const mockComments: Comment[] = [
  {
    id: 'c1',
    author: 'דניאל לוי',
    content: 'הגיטרה חזקה מדי פה, אפשר להוריד קצת?',
    timestamp: 45,
    resolved: false,
    createdAt: '2026-02-10',
  },
  {
    id: 'c2',
    author: 'דניאל לוי',
    content: 'אוהב את הקיק פה! מושלם',
    timestamp: 82,
    resolved: false,
    createdAt: '2026-02-10',
  },
  {
    id: 'c3',
    author: 'דניאל לוי',
    content: 'הווקאל צריך להיות יותר קדימה במיקס',
    timestamp: 120,
    resolved: true,
    createdAt: '2026-02-09',
  },
  {
    id: 'c4',
    author: 'דניאל לוי',
    content: 'הברידג\' מרגיש ריק, אולי להוסיף פאד?',
    timestamp: 156,
    resolved: false,
    createdAt: '2026-02-10',
  },
];

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AudioPlayer({
  title = 'לילה בתל אביב',
  artist = 'דניאל לוי',
  version = 3,
  duration = 210,
}: AudioPlayerProps) {
  const t = useTranslations();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(mockComments);
  const [hoveredComment, setHoveredComment] = useState<string | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Simulate playback
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setCurrentTime(percentage * duration);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `c${Date.now()}`,
      author: 'מפיק',
      content: newComment,
      timestamp: currentTime,
      resolved: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setComments([...comments, comment]);
    setNewComment('');
    setShowCommentInput(false);
  };

  const toggleResolve = (id: string) => {
    setComments(
      comments.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c))
    );
  };

  // Generate waveform bars
  const waveformBars = Array.from({ length: 100 }, (_, i) => {
    const seed = Math.sin(i * 0.5) * 0.5 + Math.sin(i * 0.3) * 0.3 + Math.sin(i * 0.7) * 0.2;
    return 20 + Math.abs(seed) * 80;
  });

  const progress = (currentTime / duration) * 100;

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted">
              {artist} • {t('files.version')} {version}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-lg">
              {t('files.typeLabels.MIX')}
            </span>
            <span className="text-xs text-muted">
              {comments.filter((c) => !c.resolved).length} {t('files.comments')}
            </span>
          </div>
        </div>
      </div>

      {/* Waveform */}
      <div className="px-5 py-4">
        <div
          ref={progressRef}
          className="relative h-24 cursor-pointer waveform-container"
          onClick={handleProgressClick}
        >
          {/* Waveform bars */}
          <div className="flex items-center h-full gap-[2px]">
            {waveformBars.map((height, i) => {
              const barProgress = (i / waveformBars.length) * 100;
              const isPast = barProgress <= progress;
              return (
                <div
                  key={i}
                  className={cn(
                    'flex-1 rounded-full transition-colors duration-100',
                    isPast ? 'bg-accent' : 'bg-border'
                  )}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>

          {/* Comment markers */}
          {comments.map((comment) => {
            const position = (comment.timestamp / duration) * 100;
            return (
              <div
                key={comment.id}
                className="absolute top-0 h-full flex flex-col items-center z-10"
                style={{ left: `${position}%` }}
                onMouseEnter={() => setHoveredComment(comment.id)}
                onMouseLeave={() => setHoveredComment(null)}
              >
                <div
                  className={cn(
                    'w-0.5 h-full',
                    comment.resolved ? 'bg-success/50' : 'bg-warning/70'
                  )}
                />
                <div
                  className={cn(
                    'absolute -top-1 w-3 h-3 rounded-full border-2 border-background',
                    comment.resolved ? 'bg-success' : 'bg-warning'
                  )}
                />

                {/* Tooltip */}
                {hoveredComment === comment.id && (
                  <div className="absolute top-full mt-2 bg-surface border border-border rounded-xl p-3 shadow-xl z-50 w-48 animate-fade-in">
                    <p className="text-xs font-medium">{comment.author}</p>
                    <p className="text-xs text-muted mt-1">{comment.content}</p>
                    <p className="text-[10px] text-muted mt-2">
                      {formatTimestamp(comment.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Playhead */}
          <div
            className="absolute top-0 h-full w-0.5 bg-foreground z-20 pointer-events-none"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Time display */}
        <div className="flex items-center justify-between text-xs text-muted mt-2">
          <span>{formatTimestamp(currentTime)}</span>
          <span>{formatTimestamp(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
            className="p-2 rounded-xl hover:bg-surface-hover transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-accent hover:bg-accent-hover flex items-center justify-center transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ms-0.5" />
            )}
          </button>

          <button
            onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
            className="p-2 rounded-xl hover:bg-surface-hover transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl hover:bg-surface-hover transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-muted" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setShowCommentInput(!showCommentInput)}
            className={cn(
              'flex items-center gap-1 px-3 py-2 rounded-xl text-sm transition-colors',
              showCommentInput
                ? 'bg-accent/15 text-accent'
                : 'bg-surface border border-border hover:bg-surface-hover'
            )}
          >
            <MessageSquare className="w-4 h-4" />
            {t('files.addComment')}
          </button>
        </div>
      </div>

      {/* Comment Input */}
      {showCommentInput && (
        <div className="px-5 pb-4 animate-fade-in">
          <div className="flex gap-2">
            <div className="text-xs text-accent bg-accent/10 px-2 py-1 rounded-lg whitespace-nowrap">
              {formatTimestamp(currentTime)}
            </div>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder={t('files.addComment') + '...'}
              className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
              autoFocus
            />
            <button
              onClick={handleAddComment}
              className="p-2 bg-accent hover:bg-accent-hover rounded-xl transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="border-t border-border">
        <div className="p-5">
          <h4 className="text-sm font-semibold mb-3">
            {t('files.comments')} ({comments.length})
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {comments
              .sort((a, b) => a.timestamp - b.timestamp)
              .map((comment) => (
                <div
                  key={comment.id}
                  onClick={() => setCurrentTime(comment.timestamp)}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors',
                    comment.resolved
                      ? 'bg-surface/50 opacity-60'
                      : 'bg-background/50 hover:bg-surface-hover'
                  )}
                >
                  <span className="text-xs font-mono bg-accent/10 text-accent px-2 py-1 rounded-lg whitespace-nowrap">
                    {formatTimestamp(comment.timestamp)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{comment.author}</span>
                      {comment.resolved && (
                        <span className="text-[10px] text-success flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          {t('files.resolved')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted mt-0.5">{comment.content}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleResolve(comment.id);
                    }}
                    className={cn(
                      'p-1 rounded-lg transition-colors flex-shrink-0',
                      comment.resolved
                        ? 'text-success hover:bg-success/10'
                        : 'text-muted hover:bg-surface-hover'
                    )}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
