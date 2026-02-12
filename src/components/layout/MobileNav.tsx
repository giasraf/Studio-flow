'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import {
  LayoutDashboard,
  Users,
  Music,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { key: 'dashboard', href: '/', icon: LayoutDashboard },
  { key: 'clients', href: '/clients', icon: Users },
  { key: 'projects', href: '/projects', icon: Music },
  { key: 'calendar', href: '/calendar', icon: Calendar },
  { key: 'payments', href: '/payments', icon: CreditCard },
];

export function MobileNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-surface border-t border-border mobile-safe-bottom z-50">
      <div className="flex items-center justify-around py-2">
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
                'flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors',
                isActive ? 'text-accent' : 'text-muted'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{t(item.key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
