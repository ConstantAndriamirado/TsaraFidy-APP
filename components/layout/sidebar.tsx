'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Sliders,
  Sparkles,
  BarChart3,
  TrendingUp,
  Briefcase,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  locale: string;
}

export default function Sidebar({ locale }: SidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();

  const navItems = [
    {
      href: `/${locale}/dashboard`,
      icon: LayoutDashboard,
      label: t('navigation.home'),
    },
    {
      href: `/${locale}/dashboard/candidates`,
      icon: Users,
      label: t('navigation.candidates'),
    },
    {
      href: `/${locale}/dashboard/postes`,
      icon: Briefcase,
      label: t('navigation.postes'),
    },
    {
      href: `/${locale}/dashboard/criteria`,
      icon: Sliders,
      label: t('navigation.criteria'),
    },
    {
      href: `/${locale}/dashboard/optimization`,
      icon: Sparkles,
      label: t('navigation.optimization'),
    },
    {
      href: `/${locale}/dashboard/results`,
      icon: BarChart3,
      label: t('navigation.results'),
    },
    {
      href: `/${locale}/dashboard/analytics`,
      icon: TrendingUp,
      label: t('navigation.analytics'),
    },
    {
      href: `/${locale}/dashboard/settings`,
      icon: Settings,
      label: t('navigation.settings'),
    },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card text-foreground hidden md:flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
            T
          </div>
          <h1 className="text-xl font-bold">TsaraFIDY</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isHome = item.href === `/${locale}/dashboard`
          const isActive = isHome
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium',
                isActive
                  ? 'bg-primary/20 text-primary border-l-2 border-primary'
                  : 'text-muted-foreground hover:bg-muted/50'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border text-sm text-muted-foreground">
        <p>© 2026 TsaraFIDY</p>
      </div>
    </aside>
  );
}
