'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
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
  Globe,
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
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-[240px] h-screen bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5">
        <Link href={'/' as any} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <Headphones className="w-4 h-4 text-black" />
          </div>
          <span className="text-[16px] font-extrabold tracking-tight text-white">Studio Flow</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
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
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors',
                isActive
                  ? 'bg-surface-hover text-white'
                  : 'text-muted hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{t(item.key)}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-surface-hover">
          <Link
            href={'/portal' as any}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors',
              pathname.startsWith('/portal')
                ? 'bg-surface-hover text-white'
                : 'text-muted hover:text-white'
            )}
          >
            <ExternalLink className="w-5 h-5 flex-shrink-0" />
            <span>{t('portal')}</span>
          </Link>
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 space-y-0.5">
        <Link
          href={'/settings' as any}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors',
            pathname.startsWith('/settings')
              ? 'bg-surface-hover text-white'
              : 'text-muted hover:text-white'
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span>{t('settings')}</span>
        </Link>
        <button
          onClick={() => router.replace(pathname, { locale: locale === 'he' ? 'en' : 'he' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium text-muted hover:text-white transition-colors w-full"
        >
          <Globe className="w-5 h-5 flex-shrink-0" />
          <span>{locale === 'he' ? 'English' : 'עברית'}</span>
        </button>
      </div>
    </aside>
  );
}
