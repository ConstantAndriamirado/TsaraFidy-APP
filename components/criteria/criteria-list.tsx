'use client'

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Plus, Edit2 } from 'lucide-react'

interface Criterion {
  id: string
  name: string
  criteria_type: string
  weight: number
  poste_id?: string
  created_at: string
}

interface Poste {
  id: string
  titre: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function CriteriaList() {
  const t = useTranslations()
  const { data: criteria, isLoading } = useSWR<Criterion[]>('/api/criteria', fetcher)
  const { data: postes = [] } = useSWR<Poste[]>('/api/postes', fetcher)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [criteriaType, setCriteriaType] = useState('skill')
  const [weight, setWeight] = useState(1)

  const formatDisplayWeight = (w: number | undefined | null) => {
    if (w === undefined || w === null) return '0'
    // convert 0-10 scale to 0-1 display, trim trailing zeros
    const v = Number((w / 10).toFixed(2))
    return String(v)
  }
  const [posteId, setPosteId] = useState('')

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/criteria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          criteria_type: criteriaType,
          weight,
          poste_id: posteId || null,
        }),
      })
      if (response.ok) {
        setName('')
        setCriteriaType('skill')
        setWeight(1)
        setPosteId('')
        setIsAdding(false)
        mutate('/api/criteria')
      }
    } catch (error) {
      console.error('Error adding criteria:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/criteria/${id}`, { method: 'DELETE' })
      if (response.ok) {
        mutate('/api/criteria')
      }
    } catch (error) {
      console.error('Error deleting criteria:', error)
    }
  }

  const criteriaTypes = [
    { value: 'skill', label: 'Compétence technique' },
    { value: 'experience', label: 'Expérience' },
    { value: 'education', label: 'Éducation' },
    { value: 'language', label: 'Langue' },
    { value: 'behavior', label: 'Aptitude comportementale' },
    { value: 'motivation', label: 'Motivation' },
    { value: 'relationnel', label: 'Relationnel' },
    { value: 'autonomie', label: 'Autonomie' },
    { value: 'organisation', label: 'Organisation' },
    { value: 'other', label: 'Autre' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('navigation.criteria')}</h2>
          <p className="text-muted-foreground mt-1">Définissez les critères d&apos;évaluation des candidats</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un critère
        </Button>
      </div>

      {isAdding && (
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Nouveau critère</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom du critère</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Aptitude relationnelle"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="poste">Poste associé</Label>
                <Select value={posteId} onValueChange={(value) => setPosteId(value === 'no-poste' ? '' : value)}>
                  <SelectTrigger title="Poste associé">
                    <SelectValue placeholder="Sélectionner un poste" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-poste">Aucun poste spécifique</SelectItem>
                    {postes.map((poste) => (
                      <SelectItem key={poste.id} value={poste.id}>
                        {poste.titre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={criteriaType}
                  onChange={(e) => setCriteriaType(e.target.value)}
                  aria-label={t('criteria.type') || 'Type de critère'}
                  title={t('criteria.type') || 'Type de critère'}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {criteriaTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight">Poids ({formatDisplayWeight(weight)})</Label>
                <input
                  id="weight"
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  className="w-full"
                  placeholder="Poids du critère (0-10)"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Ajouter</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false)
                    setName('')
                    setCriteriaType('skill')
                    setWeight(1)
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : criteria && criteria.length > 0 ? (
          criteria.map((criterion) => (
            <Card key={criterion.id} className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <h3 className="font-semibold text-lg">{criterion.name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Type: {criteriaTypes.find((t) => t.value === criterion.criteria_type)?.label}</span>
                      <span>Poids: {formatDisplayWeight(criterion.weight)}</span>
                      {criterion.poste_id && (
                        <span>Poste: {postes.find((poste) => poste.id === criterion.poste_id)?.titre || '—'}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(criterion.id)}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded"
                    aria-label={t('criteria.delete') || 'Supprimer critère'}
                    title={t('criteria.delete') || 'Supprimer critère'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border border-border">
            <CardContent className="pt-6 text-center text-muted-foreground">
              Aucun critère défini. Commencez par ajouter vos premiers critères d&apos;évaluation.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
