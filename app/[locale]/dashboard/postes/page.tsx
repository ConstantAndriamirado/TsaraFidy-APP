'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit2, Plus } from 'lucide-react'
import useSWR from 'swr'

interface Poste {
  id: string
  titre: string
  description?: string
  departement?: string
  salaire_min?: number
  salaire_max?: number
  created_at: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error || 'Failed to fetch postes')
  }
  return data
}

export default function PostesPage() {
  const t = useTranslations()
  const { data: postes = [], error, mutate } = useSWR('/api/postes', fetcher)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    departement: '',
    salaire_min: '',
    salaire_max: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/postes/${editingId}` : '/api/postes'
      const payload = {
        ...formData,
        salaire_min: formData.salaire_min ? parseInt(formData.salaire_min) : null,
        salaire_max: formData.salaire_max ? parseInt(formData.salaire_max) : null,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        mutate()
        setFormData({ titre: '', description: '', departement: '', salaire_min: '', salaire_max: '' })
        setShowForm(false)
        setEditingId(null)
      }
    } catch (error) {
      console.error('Error saving poste:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (poste: Poste) => {
    setFormData({
      titre: poste.titre,
      description: poste.description || '',
      departement: poste.departement || '',
      salaire_min: poste.salaire_min?.toString() || '',
      salaire_max: poste.salaire_max?.toString() || '',
    })
    setEditingId(poste.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm(t('postes.confirm_delete'))) {
      try {
        await fetch(`/api/postes/${id}`, { method: 'DELETE', credentials: 'include' })
        mutate()
      } catch (error) {
        console.error('Error deleting poste:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('postes.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('postes.add_poste')}</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ titre: '', description: '', departement: '', salaire_min: '', salaire_max: '' }); }}>
          <Plus className="w-4 h-4 mr-2" />
          {t('postes.add_poste')}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? t('postes.edit_poste') : t('postes.add_poste')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="titre">{t('postes.titre')}</Label>
                <Input
                  id="titre"
                  required
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  placeholder="Ex: Développeur Senior"
                />
              </div>

              <div>
                <Label htmlFor="description">{t('postes.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du poste"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departement">{t('postes.departement')}</Label>
                  <Input
                    id="departement"
                    value={formData.departement}
                    onChange={(e) => setFormData({ ...formData, departement: e.target.value })}
                    placeholder="Ex: IT"
                  />
                </div>

                <div>
                  <Label htmlFor="salaire_min">{t('postes.salaire_min')}</Label>
                  <Input
                    id="salaire_min"
                    type="number"
                    value={formData.salaire_min}
                    onChange={(e) => setFormData({ ...formData, salaire_min: e.target.value })}
                    placeholder="Ex: 30000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="salaire_max">{t('postes.salaire_max')}</Label>
                <Input
                  id="salaire_max"
                  type="number"
                  value={formData.salaire_max}
                  onChange={(e) => setFormData({ ...formData, salaire_max: e.target.value })}
                  placeholder="Ex: 50000"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }} disabled={loading}>
                  {t('buttons.cancel')}
                </Button>
                <Button disabled={loading}>
                  {loading ? t('common.loading') : editingId ? t('buttons.update') : t('buttons.add')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {error ? (
          <Card className="text-center py-8">
            <p className="text-destructive">{error.message}</p>
          </Card>
        ) : postes.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-muted-foreground">{t('postes.no_postes')}</p>
          </Card>
        ) : (
          postes.map((poste: Poste) => (
            <Card key={poste.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{poste.titre}</CardTitle>
                    {poste.departement && <Badge className="mt-2">{poste.departement}</Badge>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(poste)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(poste.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {poste.description && <p className="text-sm text-muted-foreground">{poste.description}</p>}
                {(poste.salaire_min || poste.salaire_max) && (
                  <p className="text-sm font-medium">
                    Salaire: {poste.salaire_min || 'N/A'} - {poste.salaire_max || 'N/A'} FMG
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
