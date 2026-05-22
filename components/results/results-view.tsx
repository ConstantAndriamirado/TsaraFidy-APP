'use client'

import { useMemo } from 'react'
import useSWR from 'swr'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Filter, Download } from 'lucide-react'

interface Candidate {
  id: string
  first_name: string
  last_name: string
  email: string
  position_applied: string
  experience_years: number
  rating: number
  status: string
  skills: string[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ResultsView() {
  const { data: candidates } = useSWR<Candidate[]>('/api/candidates', fetcher)

  // Calculate rankings based on rating and experience
  const rankedCandidates = useMemo(() => {
    if (!candidates) return []

    return candidates
      .filter((c) => c.status !== 'rejected')
      .map((c) => ({
        ...c,
        score: (c.rating * 20 + c.experience_years * 5) / 100,
      }))
      .sort((a, b) => b.score - a.score)
      .map((c, i) => ({
        ...c,
        rank: i + 1,
      }))
  }, [candidates])

  const stats = useMemo(() => {
    if (!candidates) return { total: 0, active: 0, shortlisted: 0, rejected: 0 }
    return {
      total: candidates.length,
      active: candidates.filter((c) => c.status === 'new' || c.status === 'in_review').length,
      shortlisted: candidates.filter((c) => c.status === 'shortlisted').length,
      rejected: candidates.filter((c) => c.status === 'rejected').length,
    }
  }, [candidates])

  const handleExport = () => {
    const csv = [
      ['Classement', 'Nom', 'Email', 'Poste', 'Score', 'Expérience', 'Statut'],
      ...rankedCandidates.map((c) => [
        c.rank,
        `${c.first_name} ${c.last_name}`,
        c.email,
        c.position_applied,
        c.score.toFixed(2),
        `${c.experience_years} ans`,
        c.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resultats-candidates-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Résultats du classement</h2>
          <p className="text-muted-foreground mt-1">Consultez les candidats classés par pertinence</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.total}</div>
              <p className="text-sm text-muted-foreground mt-1">Total candidats</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{stats.active}</div>
              <p className="text-sm text-muted-foreground mt-1">En cours</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.shortlisted}</div>
              <p className="text-sm text-muted-foreground mt-1">Présélectionnés</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-destructive">{stats.rejected}</div>
              <p className="text-sm text-muted-foreground mt-1">Rejetés</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ranked Candidates */}
      <div className="space-y-4">
        {rankedCandidates.length === 0 ? (
          <Card className="border border-border">
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">Aucun candidat à afficher</p>
            </CardContent>
          </Card>
        ) : (
          rankedCandidates.map((candidate) => (
            <Card key={candidate.id} className="border border-border hover:border-primary/50 transition">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold">
                        #{candidate.rank}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {candidate.first_name} {candidate.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{candidate.email}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Poste: </span>
                        <span className="font-medium">{candidate.position_applied}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expérience: </span>
                        <span className="font-medium">{candidate.experience_years} ans</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Statut: </span>
                        <span className="font-medium capitalize">
                          {candidate.status === 'in_review' ? 'En examen' : candidate.status}
                        </span>
                      </div>
                    </div>
                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {candidate.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-primary">{candidate.score.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground mt-1">Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
