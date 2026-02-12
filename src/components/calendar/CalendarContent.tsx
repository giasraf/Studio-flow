'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Calendar,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Headphones,
  X,
} from 'lucide-react';
import { useSessions, useClients, useSongs } from '@/hooks/useStore';
import { addSession } from '@/lib/store';
import { formatTime, cn } from '@/lib/utils';

const DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_HE = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const sessionTypeColors: Record<string, string> = {
  SKETCH: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  PRODUCTION: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  RECORDING: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  EDITING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  MIXING: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  MIX_REVISION: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  MASTERING: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  CONSULTATION: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export function CalendarContent() {
  const t = useTranslations();
  const locale = useLocale();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 11)); // Feb 2026
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState('');
  const [bookingClientId, setBookingClientId] = useState('');
  const [bookingSongId, setBookingSongId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00');
  const [bookingDuration, setBookingDuration] = useState('180');

  const sessions = useSessions();
  const clients = useClients();
  const allSongs = useSongs();

  const handleBookSession = () => {
    if (!bookingType || !bookingDate || !bookingTime) return;
    const client = clients.find((c) => c.id === bookingClientId);
    const song = allSongs.find((s) => s.id === bookingSongId);
    const dur = parseInt(bookingDuration);
    const startTime = `${bookingDate}T${bookingTime}:00`;
    const endHour = parseInt(bookingTime.split(':')[0]) + Math.floor(dur / 60);
    const endMin = parseInt(bookingTime.split(':')[1]) + (dur % 60);
    const endTime = `${bookingDate}T${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00`;
    const stageLabel = bookingType.charAt(0) + bookingType.slice(1).toLowerCase();
    addSession({
      songId: bookingSongId || undefined,
      songTitle: song?.title || '',
      clientName: client?.name || '',
      type: bookingType,
      title: `${stageLabel} - ${song?.title || client?.name || ''}`,
      startTime,
      endTime,
      duration: dur,
      isProducerOnly: !bookingClientId,
    });
    setBookingType('');
    setBookingClientId('');
    setBookingSongId('');
    setBookingDate('');
    setBookingTime('10:00');
    setBookingDuration('180');
  };

  const days = locale === 'he' ? DAYS_HE : DAYS_EN;
  const months = locale === 'he' ? MONTHS_HE : MONTHS_EN;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = useMemo(() => {
    const result: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) result.push(null);
    for (let i = 1; i <= daysInMonth; i++) result.push(i);
    return result;
  }, [firstDay, daysInMonth]);

  const getSessionsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return sessions.filter((s) => s.startTime.startsWith(dateStr));
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const todaySessions = selectedDate
    ? sessions.filter((s) => s.startTime.startsWith(selectedDate))
    : sessions.filter((s) => {
        const today = `${year}-${String(month + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        return s.startTime.startsWith(today);
      });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-accent" />
            {t('calendar.title')}
          </h1>
        </div>
        <button
          onClick={() => setShowBookingForm(true)}
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('calendar.bookSession')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          {/* Month navigation - arrows follow logical direction (ChevronRight=forward, ChevronLeft=back) */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-surface-hover transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h2 className="text-lg font-semibold">{months[month]} {year}</h2>
              <button
                onClick={() => setCurrentDate(new Date(2026, 1, 11))}
                className="text-xs text-accent hover:text-accent-hover transition-colors mt-0.5"
              >
                {t('calendar.today')}
              </button>
            </div>
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-surface-hover transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-muted py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const sessions = getSessionsForDay(day);
              const isToday = day === 11 && month === 1; // Feb 11
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={cn(
                    'aspect-square rounded-xl p-1 cursor-pointer transition-all duration-200 flex flex-col',
                    isToday && 'ring-2 ring-accent',
                    isSelected && 'bg-accent/10',
                    !isSelected && 'hover:bg-surface-hover'
                  )}
                >
                  <span className={cn(
                    'text-xs font-medium text-center',
                    isToday ? 'text-accent font-bold' : 'text-foreground'
                  )}>
                    {day}
                  </span>
                  <div className="flex-1 flex flex-col gap-0.5 mt-0.5 overflow-hidden">
                    {sessions.slice(0, 2).map((s) => (
                      <div
                        key={s.id}
                        className={cn(
                          'text-[9px] px-1 py-0.5 rounded truncate',
                          sessionTypeColors[s.type]
                        )}
                      >
                        {s.title.substring(0, 15)}
                      </div>
                    ))}
                    {sessions.length > 2 && (
                      <span className="text-[9px] text-muted text-center">
                        +{sessions.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day Detail / Sessions List */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4">
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString(locale === 'he' ? 'he-IL' : 'en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })
                : t('calendar.today')}
            </h3>

            <div className="space-y-3">
              {todaySessions.length > 0 ? (
                todaySessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      'rounded-xl p-4 border',
                      sessionTypeColors[session.type]
                    )}
                  >
                    <h4 className="font-medium text-sm">{session.title}</h4>
                    <div className="flex items-center gap-3 mt-2 text-xs opacity-80">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(session.startTime, locale)} - {formatTime(session.endTime, locale)}
                      </span>
                      <span>{session.duration} {t('calendar.minutes')}</span>
                    </div>
                    {session.isProducerOnly ? (
                      <p className="text-xs mt-2 flex items-center gap-1 opacity-70">
                        <Headphones className="w-3 h-3" />
                        {t('calendar.producerOnly')}
                      </p>
                    ) : (
                      <p className="text-xs mt-2 flex items-center gap-1 opacity-70">
                        <User className="w-3 h-3" />
                        {session.clientName}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted text-center py-8">{t('calendar.noSessions')}</p>
              )}
            </div>
          </div>

          {/* Quick Book */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4">{t('calendar.bookSession')}</h3>
            <div className="space-y-3">
              <select
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">{t('calendar.sessionType')}</option>
                <option value="SKETCH">{t('calendar.sessionTypes.SKETCH')}</option>
                <option value="PRODUCTION">{t('calendar.sessionTypes.PRODUCTION')}</option>
                <option value="RECORDING">{t('calendar.sessionTypes.RECORDING')}</option>
                <option value="MIXING">{t('calendar.sessionTypes.MIXING')}</option>
                <option value="MASTERING">{t('calendar.sessionTypes.MASTERING')}</option>
              </select>

              <select
                value={bookingClientId}
                onChange={(e) => setBookingClientId(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">{t('clients.title')}</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={bookingSongId}
                onChange={(e) => setBookingSongId(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">{t('projects.songs')}</option>
                {allSongs.map((s) => (
                  <option key={s.id} value={s.id}>{s.title} - {s.clientName}</option>
                ))}
              </select>

              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
              />

              <div className="flex gap-2">
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                />
                <select
                  value={bookingDuration}
                  onChange={(e) => setBookingDuration(e.target.value)}
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                >
                  <option value="120">2 {t('calendar.hours')}</option>
                  <option value="180">3 {t('calendar.hours')}</option>
                  <option value="240">4 {t('calendar.hours')}</option>
                </select>
              </div>

              <button
                onClick={handleBookSession}
                disabled={!bookingType || !bookingDate}
                className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
              >
                {t('calendar.bookSession')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
