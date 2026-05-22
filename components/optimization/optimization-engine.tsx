'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Zap, CheckCircle } from 'lucide-react'
import { optimizeCandidates, type Candidate as GPCandidate } from '@/lib/goal-programming'

interface Candidate {
  id: string
  first_name: string
  last_name: string
  email: string
  position_applied: string
  poste_id?: string
  experience_years: number
  rating: number
  status: string
}

interface Poste {
  id: string
  titre: string
}

interface OptimizationResult {
  candidates: (Candidate & { finalScore: number; rank: number })[]
  totalCandidates: number
  timestamp: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function OptimizationEngine() {
  const t = useTranslations()
  const { data: candidates } = useSWR<Candidate[]>('/api/candidates', fetcher)
  const { data: postes = [] } = useSWR<Poste[]>('/api/postes', fetcher)
  const [selectedPoste, setSelectedPoste] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult | null>(null)

  const handleRunOptimization = async () => {
    setIsRunning(true)
    try {
      if (candidates && candidates.length > 0) {
        const filteredCandidates = selectedPoste
          ? candidates.filter((c) => c.poste_id === selectedPoste)
          : candidates

        const gpCandidates: GPCandidate[] = filteredCandidates.map(c => ({
          id: c.id,
          first_name: c.first_name,
          last_name: c.last_name,
          experience_years: c.experience_years,
          rating: c.rating,
          status: c.status,
        }))
        
        const scores = optimizeCandidates(gpCandidates)
        
        const ranked = scores.map(score => ({
          ...filteredCandidates.find(c => c.id === score.candidate.id)!,
          finalScore: Math.round(score.finalScore * 100) / 100,
          rank: score.rank,
        }))

        const result: OptimizationResult = {
          candidates: ranked,
          totalCandidates: ranked.length,
          timestamp: new Date().toISOString(),
        }

        setOptimizationResults(result)
      }
    } catch (error) {
      console.error('Optimization error:', error)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Moteur d'optimisation</h2>
          <p className="text-muted-foreground mt-1">Optimisez la sélection des candidats selon les critères</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={selectedPoste} onValueChange={(value) => setSelectedPoste(value === 'all-postes' ? '' : value)}>
            <SelectTrigger title="Sélectionner un poste pour l'optimisation">
              <SelectValue placeholder="Choisir un poste" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-postes">Tous les postes</SelectItem>
              {postes.map((poste) => (
                <SelectItem key={poste.id} value={poste.id}>
                  {poste.titre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleRunOptimization}
            disabled={isRunning || !candidates || candidates.length === 0}
            className="gap-2"
          >
            <Zap className="w-4 h-4" />
            {isRunning ? 'Optimisation en cours...' : 'Lancer l\'optimisation'}
          </Button>
        </div>
      </div>

      {!optimizationResults ? (
        <Card className="border border-border">
          <CardContent className="pt-6 text-center py-12">
            <div className="text-muted-foreground">
              {candidates && candidates.length === 0 ? (
                <p>Ajoutez des candidats pour exécuter l'optimisation</p>
              ) : (
                <p>Cliquez sur le bouton ci-dessus pour lancer l'optimisation</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="border border-border bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">
                  Optimisation complétée - {optimizationResults.totalCandidates} candidats analysés
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {optimizationResults.candidates.slice(0, 10).map((candidate) => (
              <Card key={candidate.id} className="border border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-primary">#{candidate.rank}</span>
                        <div>
                          <h3 className="font-semibold">
                            {candidate.first_name} {candidate.last_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{candidate.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-4 text-sm">
                        <span>Position: {candidate.position_applied}</span>
                        <span>Expérience: {candidate.experience_years} ans</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{candidate.finalScore}</div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
