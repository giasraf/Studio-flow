'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Headphones,
} from 'lucide-react';
import { useSessions, useClients, useSongs } from '@/hooks/useStore';
import { addSession } from '@/lib/store';
import { formatTime, cn } from '@/lib/utils';

const DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_HE = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Subtle dot colors for session types
const sessionTypeDotColors: Record<string, string> = {
  SKETCH: 'bg-purple-500',
  PRODUCTION: 'bg-blue-500',
  RECORDING: 'bg-orange-500',
  EDITING: 'bg-yellow-500',
  MIXING: 'bg-cyan-500',
  MIX_REVISION: 'bg-teal-500',
  MASTERING: 'bg-pink-500',
  CONSULTATION: 'bg-gray-500',
};

// Very subtle tints for session cards
const sessionTypeCardColors: Record<string, string> = {
  SKETCH: 'bg-purple-50 border-purple-200',
  PRODUCTION: 'bg-blue-50 border-blue-200',
  RECORDING: 'bg-orange-50 border-orange-200',
  EDITING: 'bg-yellow-50 border-yellow-200',
  MIXING: 'bg-cyan-50 border-cyan-200',
  MIX_REVISION: 'bg-teal-50 border-teal-200',
  MASTERING: 'bg-pink-50 border-pink-200',
  CONSULTATION: 'bg-gray-50 border-gray-200',
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
        <h1 className="text-xl font-semibold tracking-tight">
          {t('calendar.title')}
        </h1>
        <button
          onClick={() => setShowBookingForm(true)}
          className="flex items-center gap-2 bg-foreground text-background hover:opacity-90 rounded-lg px-4 py-2.5 text-[13px] font-medium transition-opacity"
        >
          <Plus className="w-4 h-4" />
          {t('calendar.bookSession')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-background border border-border rounded-xl p-5">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
            <div className="text-center">
              <h2 className="text-[15px] font-semibold tracking-tight">{months[month]} {year}</h2>
              <button
                onClick={() => setCurrentDate(new Date(2026, 1, 11))}
                className="text-[12px] text-gray-500 hover:text-foreground transition-colors mt-0.5"
              >
                {t('calendar.today')}
              </button>
            </div>
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center text-[12px] font-medium text-gray-500 py-2">
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
                    'aspect-square rounded-lg p-2 cursor-pointer transition-colors flex flex-col',
                    isToday && 'ring-1 ring-gray-900',
                    isSelected && 'bg-gray-50',
                    !isSelected && 'hover:bg-gray-50'
                  )}
                >
                  <span className={cn(
                    'text-[13px] font-medium text-center',
                    isToday ? 'font-semibold' : ''
                  )}>
                    {day}
                  </span>
                  <div className="flex-1 flex items-center justify-center gap-1 mt-1">
                    {sessions.slice(0, 3).map((s) => (
                      <div
                        key={s.id}
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          sessionTypeDotColors[s.type]
                        )}
                      />
                    ))}
                    {sessions.length > 3 && (
                      <span className="text-[10px] text-gray-500 ml-0.5">
                        +{sessions.length - 3}
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
          <div className="bg-background border border-border rounded-xl p-5">
            <h3 className="font-semibold text-[13px] mb-4">
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
                      'rounded-lg p-3 border',
                      sessionTypeCardColors[session.type]
                    )}
                  >
                    <h4 className="font-medium text-[13px]">{session.title}</h4>
                    <div className="flex items-center gap-3 mt-2 text-[12px] text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(session.startTime, locale)} - {formatTime(session.endTime, locale)}
                      </span>
                      <span>{session.duration} {t('calendar.minutes')}</span>
                    </div>
                    {session.isProducerOnly ? (
                      <p className="text-[12px] mt-2 flex items-center gap-1 text-gray-600">
                        <Headphones className="w-3 h-3" />
                        {t('calendar.producerOnly')}
                      </p>
                    ) : (
                      <p className="text-[12px] mt-2 flex items-center gap-1 text-gray-600">
                        <User className="w-3 h-3" />
                        {session.clientName}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-gray-500 text-center py-8">{t('calendar.noSessions')}</p>
              )}
            </div>
          </div>

          {/* Quick Book */}
          <div className="bg-background border border-border rounded-xl p-5">
            <h3 className="font-semibold text-[13px] mb-4">{t('calendar.bookSession')}</h3>
            <div className="space-y-3">
              <select
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
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
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
              >
                <option value="">{t('clients.title')}</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={bookingSongId}
                onChange={(e) => setBookingSongId(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
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
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
              />

              <div className="flex gap-2">
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
                />
                <select
                  value={bookingDuration}
                  onChange={(e) => setBookingDuration(e.target.value)}
                  className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
                >
                  <option value="120">2 {t('calendar.hours')}</option>
                  <option value="180">3 {t('calendar.hours')}</option>
                  <option value="240">4 {t('calendar.hours')}</option>
                </select>
              </div>

              <button
                onClick={handleBookSession}
                disabled={!bookingType || !bookingDate}
                className="w-full bg-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-background rounded-lg py-2.5 text-[13px] font-medium transition-opacity"
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
