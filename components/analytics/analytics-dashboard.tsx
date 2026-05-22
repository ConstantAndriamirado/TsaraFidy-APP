'use client'

import { useMemo } from 'react'
import useSWR from 'swr'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp } from 'lucide-react'

interface Candidate {
  id: string
  first_name: string
  last_name: string
  status: string
  rating: number
  experience_years: number
  created_at: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function AnalyticsDashboard() {
  const { data: candidates } = useSWR<Candidate[]>('/api/candidates', fetcher)

  const stats = useMemo(() => {
    if (!candidates) return null

    const statusCounts = candidates.reduce(
      (acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const avgRating = candidates.length > 0 ? 
      (candidates.reduce((sum, c) => sum + c.rating, 0) / candidates.length).toFixed(1) : 
      '0'

    const avgExperience = candidates.length > 0 ? 
      (candidates.reduce((sum, c) => sum + c.experience_years, 0) / candidates.length).toFixed(1) : 
      '0'

    // Group by experience level
    const experienceGroups = {
      'Junior (0-2 ans)': candidates.filter((c) => c.experience_years <= 2).length,
      'Confirmé (3-5 ans)': candidates.filter((c) => c.experience_years > 2 && c.experience_years <= 5).length,
      'Senior (6+ ans)': candidates.filter((c) => c.experience_years > 5).length,
    }

    return {
      total: candidates.length,
      statusCounts,
      avgRating,
      avgExperience,
      experienceGroups,
    }
  }, [candidates])

  const statusChartData = useMemo(() => {
    if (!stats) return []
    return Object.entries(stats.statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }))
  }, [stats])

  const experienceChartData = useMemo(() => {
    if (!stats) return []
    return Object.entries(stats.experienceGroups).map(([level, count]) => ({
      name: level,
      value: count,
    }))
  }, [stats])

  const COLORS = ['#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f3e8ff']

  if (!stats)
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics Recrutement</h2>
        <p className="text-muted-foreground mt-1">Analysez vos données de recrutement</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border border-border">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total candidats</p>
              <div className="text-3xl font-bold text-primary">{stats.total}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Note moyenne</p>
              <div className="text-3xl font-bold text-primary">{stats.avgRating}/5</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Expérience moyenne</p>
              <div className="text-3xl font-bold text-primary">{stats.avgExperience} ans</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Taux finalisation</p>
              <div className="text-3xl font-bold text-primary">
                {stats.total > 0 ? ((stats.statusCounts['shortlisted'] || 0) / stats.total * 100).toFixed(0) : 0}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-lg">Répartition par statut</CardTitle>
          </CardHeader>
          <CardContent>
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name} (${entry.value})`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">Aucune donnée</p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-lg">Expérience des candidats</CardTitle>
          </CardHeader>
          <CardContent>
            {experienceChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={experienceChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#a78bfa" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">Aucune donnée</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
