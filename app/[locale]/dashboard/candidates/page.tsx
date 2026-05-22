'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import CandidatesList from '@/components/candidates/candidates-list';
import CandidateForm from '@/components/candidates/candidate-form';

interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  position_applied?: string;
  poste_id?: string;
  skills?: string[];
  experience_years?: number;
  education?: string;
  status: string;
  rating: number;
  notes?: string;
  created_at: string;
}

interface Poste {
  id: string;
  titre: string;
}

export default function CandidatesPage() {
  const t = useTranslations();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [postes, setPostes] = useState<Poste[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoste, setSelectedPoste] = useState('');
  const [sortByPoste, setSortByPoste] = useState(false);

  useEffect(() => {
    fetchPostes();
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/candidates');
      if (!response.ok) throw new Error('Failed to fetch candidates');
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostes = async () => {
    try {
      const response = await fetch('/api/postes');
      if (!response.ok) throw new Error('Failed to fetch postes');
      const data = await response.json();
      setPostes(data);
    } catch (error) {
      console.error('Error fetching postes:', error);
    }
  };

  const filteredCandidates = candidates
    .filter((candidate) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (!selectedPoste || candidate.poste_id === selectedPoste) &&
        (candidate.first_name.toLowerCase().includes(searchLower) ||
          candidate.last_name.toLowerCase().includes(searchLower) ||
          candidate.email.toLowerCase().includes(searchLower) ||
          (candidate.position_applied || '').toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      if (!sortByPoste) return 0;
      return (a.position_applied || '').localeCompare(b.position_applied || '');
    });

  const handleDelete = async (id: string) => {
    if (!confirm(t('candidates.confirm_delete'))) return;

    try {
      const response = await fetch(`/api/candidates/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete candidate');
      setCandidates(candidates.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCandidate(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchCandidates();
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('candidates.title')}</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your candidates</p>
        </div>
        <Button
          onClick={() => {
            setEditingCandidate(null);
            setShowForm(true);
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('candidates.add_candidate')}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 items-end">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('candidates.search_candidates')}
        />
        <Select value={selectedPoste} onValueChange={(value) => setSelectedPoste(value === 'all-postes' ? '' : value)}>
          <SelectTrigger title={t('candidates.filter_by_poste') || 'Filtrer par poste'}>
            <SelectValue placeholder={t('candidates.filter_by_poste') || 'Filtrer par poste'} />
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
        <Select value={sortByPoste ? 'poste' : 'default'} onValueChange={(value) => setSortByPoste(value === 'poste')}>
          <SelectTrigger title={t('candidates.sort_by') || 'Trier par'}>
            <SelectValue placeholder={t('candidates.sort_by') || 'Trier par'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Par défaut</SelectItem>
            <SelectItem value="poste">Poste demandé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showForm && (
        <CandidateForm
          candidate={editingCandidate}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      <CandidatesList
        candidates={candidates}
        loading={loading}
        onEdit={(candidate) => {
          setEditingCandidate(candidate);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
