'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import {
  Bell,
  Search,
  Globe,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as any });
    setShowLangMenu(false);
  };

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder={t('common.search') + '...'}
            className="w-full bg-background border border-border rounded-xl ps-10 pe-4 py-2 text-sm placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Quick Add */}
        <div className="relative">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex items-center gap-1 bg-accent hover:bg-accent-hover text-white rounded-xl px-3 py-2 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('common.add')}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showQuickActions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowQuickActions(false)} />
              <div className="absolute end-0 top-full mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                <button className="w-full text-start px-4 py-3 text-sm hover:bg-surface-hover transition-colors">
                  {t('dashboard.newClient')}
                </button>
                <button className="w-full text-start px-4 py-3 text-sm hover:bg-surface-hover transition-colors">
                  {t('dashboard.newProject')}
                </button>
                <button className="w-full text-start px-4 py-3 text-sm hover:bg-surface-hover transition-colors">
                  {t('dashboard.newSession')}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-surface-hover transition-colors">
          <Bell className="w-5 h-5 text-muted" />
          <span className="absolute top-1 end-1 w-2 h-2 bg-danger rounded-full" />
        </button>

        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1 p-2 rounded-xl hover:bg-surface-hover transition-colors"
          >
            <Globe className="w-5 h-5 text-muted" />
            <span className="text-xs text-muted uppercase">{locale}</span>
          </button>

          {showLangMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
              <div className="absolute end-0 top-full mt-2 w-36 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                <button
                  onClick={() => switchLocale('he')}
                  className={cn(
                    'w-full text-start px-4 py-3 text-sm hover:bg-surface-hover transition-colors',
                    locale === 'he' && 'text-accent font-medium'
                  )}
                >
                  עברית
                </button>
                <button
                  onClick={() => switchLocale('en')}
                  className={cn(
                    'w-full text-start px-4 py-3 text-sm hover:bg-surface-hover transition-colors',
                    locale === 'en' && 'text-accent font-medium'
                  )}
                >
                  English
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
