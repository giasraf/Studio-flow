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

const navItems = [
  { key: 'dashboard', href: '/', icon: LayoutDashboard },
  { key: 'clients', href: '/clients', icon: Users },
  { key: 'pipeline', href: '/projects', icon: GitBranch },
  { key: 'calendar', href: '/calendar', icon: Calendar },
  { key: 'payments', href: '/payments', icon: CreditCard },
  { key: 'files', href: '/files', icon: FolderOpen },
];

export function Sidebar() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <aside className="w-56 h-screen bg-background border-e border-border flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5">
        <Link href={'/' as any} className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <Headphones className="w-4 h-4 text-white" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">Studio Flow</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={item.href as any}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] transition-colors',
                isActive
                  ? 'bg-surface-hover text-foreground font-medium'
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{t(item.key)}</span>
            </Link>
          );
        })}

        <div className="pt-3 mt-3 border-t border-border">
          <Link
            href={'/portal' as any}
            className={cn(
              'flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] transition-colors',
              pathname.startsWith('/portal')
                ? 'bg-surface-hover text-foreground font-medium'
                : 'text-muted hover:text-foreground hover:bg-surface-hover'
            )}
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            <span>{t('portal')}</span>
          </Link>
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-border">
        <Link
          href={'/settings' as any}
          className={cn(
            'flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] transition-colors',
            pathname.startsWith('/settings')
              ? 'bg-surface-hover text-foreground font-medium'
              : 'text-muted hover:text-foreground hover:bg-surface-hover'
          )}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span>{t('settings')}</span>
        </Link>
      </div>
    </aside>
  );
}
