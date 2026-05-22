'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import useSWR from 'swr';

interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  poste_id?: string;
  position_applied?: string;
  skills?: string[];
  experience_years?: number;
  education?: string;
  status: string;
  rating: number;
  notes?: string;
}

interface Poste {
  id: string;
  titre: string;
}

interface CandidateFormProps {
  candidate?: Candidate | null;
  onClose: () => void;
  onSuccess: () => void;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error || 'Failed to fetch postes')
  }
  return data
}

export default function CandidateForm({ candidate, onClose, onSuccess }: CandidateFormProps) {
  const t = useTranslations();
  const { data } = useSWR('/api/postes', fetcher);
  const postes = Array.isArray(data) ? data : []
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    first_name: candidate?.first_name || '',
    last_name: candidate?.last_name || '',
    email: candidate?.email || '',
    phone: candidate?.phone || '',
    poste_id: candidate?.poste_id || '',
    position_applied: candidate?.position_applied || '',
    skills: candidate?.skills || [],
    experience_years: candidate?.experience_years || '',
    education: candidate?.education || '',
    status: candidate?.status || 'new',
    rating: candidate?.rating || 0,
    notes: candidate?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedPoste = postes.find((poste: Poste) => poste.id === formData.poste_id)
      const payload = {
        ...formData,
        position_applied: selectedPoste?.titre || formData.position_applied || '',
      }

      const url = candidate
        ? `/api/candidates/${candidate.id}`
        : '/api/candidates';

      const method = candidate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save candidate');

      onSuccess();
    } catch (error) {
      console.error('Error saving candidate:', error);
      alert('Impossible d\'enregistrer le candidat');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <Card className="border border-border mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>
            {candidate ? t('candidates.edit_candidate') : t('candidates.add_candidate')}
          </CardTitle>
          <CardDescription>
            {candidate ? 'Mettre à jour les informations du candidat' : 'Ajouter un nouveau candidat à votre base'}
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label={t('common.close') || 'Fermer'} title={t('common.close') || 'Fermer'}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">{t('candidates.first_name')}</label>
              <Input
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="Jean"
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t('candidates.last_name')}</label>
              <Input
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="RAKOTO"
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t('postes.title')}</label>
              <Select value={formData.poste_id} onValueChange={(value) => setFormData({ ...formData, poste_id: value })}>
                <SelectTrigger aria-label={t('postes.title') || 'Poste'} title={t('postes.title') || 'Poste'}>
                  <SelectValue placeholder="Sélectionner un poste..." />
                </SelectTrigger>
                <SelectContent>
                  {postes.map((poste: Poste) => (
                    <SelectItem key={poste.id} value={poste.id}>
                      {poste.titre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">{t('candidates.email')}</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jean@exemple.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t('candidates.phone')}</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+261 34 567 890"
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t('candidates.experience')}</label>
              <Input
                type="number"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                placeholder="5"
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t('candidates.education')}</label>
              <Select value={formData.education} onValueChange={(value) => setFormData({ ...formData, education: value })}>
                <SelectTrigger aria-label={t('candidates.education') || 'Éducation'} title={t('candidates.education') || 'Éducation'}>
                  <SelectValue placeholder="Sélectionner le niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CEPE">CEPE</SelectItem>
                  <SelectItem value="BEPC">BEPC</SelectItem>
                  <SelectItem value="BACC">BACC</SelectItem>
                  <SelectItem value="L1">L1</SelectItem>
                  <SelectItem value="L2">L2</SelectItem>
                  <SelectItem value="L3">L3</SelectItem>
                  <SelectItem value="L3 sans LICENCE">L3 sans LICENCE</SelectItem>
                  <SelectItem value="LICENCE">LICENCE</SelectItem>
                  <SelectItem value="M1">M1</SelectItem>
                  <SelectItem value="M2">M2</SelectItem>
                  <SelectItem value="M2 sans MASTER">M2 sans MASTER</SelectItem>
                  <SelectItem value="MASTER">MASTER</SelectItem>
                  <SelectItem value="D1">D1</SelectItem>
                  <SelectItem value="D2">D2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">{t('candidates.status')}</label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger aria-label={t('candidates.status') || 'Statut'} title={t('candidates.status') || 'Statut'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">{t('candidates.new')}</SelectItem>
                  <SelectItem value="in_review">{t('candidates.in_review')}</SelectItem>
                  <SelectItem value="shortlisted">{t('candidates.shortlisted')}</SelectItem>
                  <SelectItem value="rejected">{t('candidates.rejected')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">{t('candidates.rating')}</label>
              <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}>
                <SelectTrigger aria-label={t('candidates.rating') || 'Note'} title={t('candidates.rating') || 'Note'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No Rating</SelectItem>
                  <SelectItem value="1">⭐</SelectItem>
                  <SelectItem value="2">⭐⭐</SelectItem>
                  <SelectItem value="3">⭐⭐⭐</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐</SelectItem>
                  <SelectItem value="5">⭐⭐⭐⭐⭐</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">{t('candidates.skills')}</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Ajouter une compétence et appuyer sur Entrée"
              />
              <Button type="button" variant="outline" onClick={addSkill}>
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="hover:opacity-70"
                    aria-label={t('candidates.remove_skill') || `Supprimer la compétence ${skill}`}
                    title={t('candidates.remove_skill') || `Supprimer la compétence ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">{t('candidates.notes')}</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes supplémentaires sur le candidat..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              {t('buttons.cancel')}
            </Button>
            <Button disabled={loading}>
              {loading ? t('common.loading') : candidate ? t('buttons.update_candidate') : t('buttons.save_candidate')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
