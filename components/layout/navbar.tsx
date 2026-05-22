'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { UserSession } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings } from 'lucide-react';
import { signOut } from '@/app/[locale]/auth/actions';
import { ThemeSwitcher } from './theme-switcher';

interface NavbarProps {
  locale: string;
  user: UserSession;
}

export default function Navbar({ locale, user }: NavbarProps) {
  const t = useTranslations();
  const userEmail = user?.email || 'User';

  return (
    <nav className="border-b border-border bg-card px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-foreground">TsaraFIDY</h2>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full w-10 h-10 p-0">
              {userEmail.charAt(0).toUpperCase()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{userEmail}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href={`/${locale}/dashboard/settings`} className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {t('common.settings')}
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action={signOut}>
                <button className="w-full text-left flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  {t('common.logout')}
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
