'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import {
  LayoutDashboard,
  Users,
  Music,
  GitBranch,
  Calendar,
  CreditCard,
  FolderOpen,
  Settings,
  Headphones,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { key: 'dashboard', href: '/', icon: LayoutDashboard },
  { key: 'clients', href: '/clients', icon: Users },
  { key: 'projects', href: '/projects', icon: Music },
  { key: 'pipeline', href: '/projects?view=pipeline', icon: GitBranch },
  { key: 'calendar', href: '/calendar', icon: Calendar },
  { key: 'payments', href: '/payments', icon: CreditCard },
  { key: 'files', href: '/files', icon: FolderOpen },
  { key: 'settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <aside className="w-64 h-screen bg-surface border-e border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Headphones className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">Studio Flow</h1>
            <p className="text-xs text-muted">Producer Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
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
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200',
                isActive
                  ? 'bg-accent/15 text-accent font-medium glow-accent'
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{t(item.key)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-medium text-accent">
            SF
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Studio Flow</p>
            <p className="text-xs text-muted truncate">Producer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
