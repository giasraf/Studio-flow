'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import {
  Bell,
  Search,
  Globe,
  Plus,
  ChevronDown,
  UserPlus,
  Music,
  Calendar,
  X,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  // Close menus on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLangMenu(false);
        setShowQuickActions(false);
        setSearchFocused(false);
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as any });
    setShowLangMenu(false);
  };

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6">
      {/* Search */}
      <div className={cn('flex-1 max-w-md transition-all duration-200', searchFocused && 'max-w-lg')}>
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={t('common.search') + '...'}
            className={cn(
              'w-full bg-background border rounded-xl ps-10 pe-4 py-2 text-sm placeholder:text-muted focus:outline-none transition-all duration-200',
              searchFocused ? 'border-accent shadow-[0_0_0_1px_rgba(139,92,246,0.3)]' : 'border-border'
            )}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 ms-4">
        {/* Quick Add */}
        <div className="relative">
          <button
            onClick={() => { setShowQuickActions(!showQuickActions); setShowLangMenu(false); }}
            className={cn(
              'flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200',
              showQuickActions
                ? 'bg-accent text-white shadow-lg shadow-accent/25'
                : 'bg-accent hover:bg-accent-hover text-white'
            )}
          >
            <Plus className={cn('w-4 h-4 transition-transform duration-200', showQuickActions && 'rotate-45')} />
            <span className="hidden sm:inline">{t('common.add')}</span>
          </button>

          {showQuickActions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowQuickActions(false)} />
              <div className="absolute end-0 top-full mt-2 w-52 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-scale-in">
                <div className="p-1">
                  <button className="w-full flex items-center gap-3 text-start px-3 py-2.5 text-sm rounded-lg hover:bg-surface-hover transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <UserPlus className="w-4 h-4 text-blue-400" />
                    </div>
                    {t('dashboard.newClient')}
                  </button>
                  <button className="w-full flex items-center gap-3 text-start px-3 py-2.5 text-sm rounded-lg hover:bg-surface-hover transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Music className="w-4 h-4 text-accent" />
                    </div>
                    {t('dashboard.newProject')}
                  </button>
                  <button className="w-full flex items-center gap-3 text-start px-3 py-2.5 text-sm rounded-lg hover:bg-surface-hover transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-400" />
                    </div>
                    {t('dashboard.newSession')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-surface-hover transition-colors">
          <Bell className="w-5 h-5 text-muted" />
          <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-surface" />
        </button>

        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => { setShowLangMenu(!showLangMenu); setShowQuickActions(false); }}
            className="flex items-center gap-1 p-2.5 rounded-xl hover:bg-surface-hover transition-colors"
          >
            <Globe className="w-5 h-5 text-muted" />
            <span className="text-xs text-muted uppercase font-medium">{locale}</span>
          </button>

          {showLangMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
              <div className="absolute end-0 top-full mt-2 w-40 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-scale-in">
                <div className="p-1">
                  <button
                    onClick={() => switchLocale('he')}
                    className={cn(
                      'w-full flex items-center gap-3 text-start px-3 py-2.5 text-sm rounded-lg hover:bg-surface-hover transition-colors',
                      locale === 'he' && 'text-accent font-medium bg-accent/5'
                    )}
                  >
                    <span className="text-lg">🇮🇱</span>
                    עברית
                  </button>
                  <button
                    onClick={() => switchLocale('en')}
                    className={cn(
                      'w-full flex items-center gap-3 text-start px-3 py-2.5 text-sm rounded-lg hover:bg-surface-hover transition-colors',
                      locale === 'en' && 'text-accent font-medium bg-accent/5'
                    )}
                  >
                    <span className="text-lg">🇺🇸</span>
                    English
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
