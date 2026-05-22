'use client';

import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageCircle, UserCheck, XCircle } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DashboardStats() {
  const t = useTranslations();
  const { data, isLoading } = useSWR('/api/candidates', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 5000, // Refresh every 5 seconds
  });

  const candidates = Array.isArray(data) ? data : data?.candidates || [];
  const total = candidates.length;
  const newCount = candidates.filter((c: any) => (c.status || '').toLowerCase() === 'new').length;
  const shortlisted = candidates.filter((c: any) => (c.status || '').toLowerCase() === 'shortlisted').length;
  const rejected = candidates.filter((c: any) => (c.status || '').toLowerCase() === 'rejected').length;

  const stats = [
    {
      title: t('dashboard.total_candidates'),
      value: isLoading ? '-' : total.toString(),
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: t('dashboard.new_candidates'),
      value: isLoading ? '-' : newCount.toString(),
      icon: MessageCircle,
      color: 'text-violet-500',
    },
    {
      title: t('dashboard.shortlisted'),
      value: isLoading ? '-' : shortlisted.toString(),
      icon: UserCheck,
      color: 'text-emerald-500',
    },
    {
      title: t('dashboard.rejected'),
      value: isLoading ? '-' : rejected.toString(),
      icon: XCircle,
      color: 'text-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
