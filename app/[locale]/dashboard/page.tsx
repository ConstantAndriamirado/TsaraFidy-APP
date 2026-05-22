'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardStats from '@/components/dashboard/dashboard-stats';

export default function DashboardPage() {
  const t = useTranslations();

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-balance">{t('dashboard.welcome')}</h1>
        <p className="text-muted-foreground mt-2">{t('dashboard.subtitle')}</p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>{t('dashboard.recent_activity')}</CardTitle>
            <CardDescription>{t('dashboard.recent_activity_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{t('dashboard.no_activity')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle>{t('dashboard.subscription')}</CardTitle>
            <CardDescription>{t('dashboard.subscription_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('dashboard.plan')}</span>
                <span className="font-semibold">{t('dashboard.plan_free')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('dashboard.candidates_used')}</span>
                <span className="font-semibold">
                  <span className="candidates-count">0</span>/50
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
