'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import {
  LayoutDashboard,
  Users,
  GitBranch,
  Calendar,
  CreditCard,
  FolderOpen,
  Settings,
  Headphones,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNav = [
  { key: 'dashboard', href: '/', icon: LayoutDashboard },
  { key: 'clients', href: '/clients', icon: Users },
  { key: 'pipeline', href: '/projects', icon: GitBranch },
  { key: 'calendar', href: '/calendar', icon: Calendar },
];

const manageNav = [
  { key: 'payments', href: '/payments', icon: CreditCard },
  { key: 'files', href: '/files', icon: FolderOpen },
];

export function Sidebar() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const renderLink = (item: { key: string; href: string; icon: any }) => {
    const isActive =
      item.href === '/'
        ? pathname === '/'
        : pathname.startsWith(item.href.split('?')[0]);
    const Icon = item.icon;

    return (
      <Link
        key={item.key}
        href={item.href as any}
        className={cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 group',
          isActive
            ? 'bg-accent/15 text-accent font-medium glow-accent'
            : 'text-muted hover:text-foreground hover:bg-surface-hover'
        )}
      >
        <Icon className={cn(
          'w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
          isActive && 'scale-110'
        )} />
        <span>{t(item.key)}</span>
        {isActive && (
          <div className="ms-auto w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
        )}
      </Link>
    );
  };

  return (
    <aside className="w-64 h-screen bg-surface border-e border-border flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link href={'/' as any} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <Headphones className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">Studio Flow</h1>
            <p className="text-[11px] text-muted">Producer Hub</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
        <div className="space-y-1">
          {mainNav.map(renderLink)}
        </div>

        {/* Management section */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted/60 font-semibold px-4 mb-2">
            {t('payments')} & {t('files')}
          </p>
          <div className="space-y-1">
            {manageNav.map(renderLink)}
          </div>
        </div>

        {/* Client Portal link */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted/60 font-semibold px-4 mb-2">
            {t('portal')}
          </p>
          <Link
            href={'/portal' as any}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200',
              pathname.startsWith('/portal')
                ? 'bg-accent/15 text-accent font-medium'
                : 'text-muted hover:text-foreground hover:bg-surface-hover'
            )}
          >
            <ExternalLink className="w-5 h-5 flex-shrink-0" />
            <span>{t('portal')}</span>
          </Link>
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-border space-y-1">
        <Link
          href={'/settings' as any}
          className={cn(
            'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200',
            pathname.startsWith('/settings')
              ? 'bg-accent/15 text-accent font-medium'
              : 'text-muted hover:text-foreground hover:bg-surface-hover'
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span>{t('settings')}</span>
        </Link>
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
            SF
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Studio Flow</p>
            <p className="text-[11px] text-muted truncate">Producer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
