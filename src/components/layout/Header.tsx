'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Search, Globe, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLangMenu(false);
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
    <header className="h-12 bg-background border-b border-border flex items-center justify-between px-4 md:px-6">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={t('common.search') + '...'}
            className={cn(
              'w-full bg-surface border rounded-lg ps-9 pe-3 py-1.5 text-[13px] placeholder:text-muted focus:outline-none transition-colors',
              searchFocused ? 'border-accent' : 'border-border'
            )}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Language Switcher */}
      <div className="relative ms-3">
        <button
          onClick={() => setShowLangMenu(!showLangMenu)}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-surface-hover transition-colors text-[13px] text-muted"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="uppercase font-medium">{locale}</span>
        </button>

        {showLangMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
            <div className="absolute end-0 top-full mt-1 w-36 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-scale-in">
              <div className="p-1">
                <button
                  onClick={() => switchLocale('he')}
                  className={cn(
                    'w-full flex items-center gap-2 text-start px-2.5 py-2 text-[13px] rounded-md hover:bg-surface-hover transition-colors',
                    locale === 'he' && 'text-accent font-medium'
                  )}
                >
                  עברית
                </button>
                <button
                  onClick={() => switchLocale('en')}
                  className={cn(
                    'w-full flex items-center gap-2 text-start px-2.5 py-2 text-[13px] rounded-md hover:bg-surface-hover transition-colors',
                    locale === 'en' && 'text-accent font-medium'
                  )}
                >
                  English
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
