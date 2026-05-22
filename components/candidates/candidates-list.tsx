'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Edit2, Trash2, Mail, Phone } from 'lucide-react';

interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  position_applied?: string;
  skills?: string[];
  experience_years?: number;
  status: string;
  rating: number;
  created_at: string;
}

interface CandidatesListProps {
  candidates: Candidate[];
  loading: boolean;
  onEdit: (candidate: Candidate) => void;
  onDelete: (id: string) => void;
}

export default function CandidatesList({
  candidates,
  loading,
  onEdit,
  onDelete,
}: CandidatesListProps) {
  const t = useTranslations();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <Card className="border border-border">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">{t('candidates.no_candidates')}</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'in_review':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'shortlisted':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
      case 'rejected':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {candidates.map((candidate) => (
        <Card key={candidate.id} className="border border-border hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">
                    {candidate.first_name} {candidate.last_name}
                  </h3>
                  <Badge className={`${getStatusColor(candidate.status)} border-0`}>
                    {candidate.status}
                  </Badge>
                  {candidate.rating > 0 && (
                    <div className="flex gap-1">
                      {Array.from({ length: candidate.rating }).map((_, i) => (
                        <span key={i} className="text-lg">⭐</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {candidate.email}
                  </div>
                  {candidate.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {candidate.phone}
                    </div>
                  )}
                </div>

                {candidate.position_applied && (
                  <p className="text-sm mb-2">
                    <span className="font-medium">Poste:</span> {candidate.position_applied}
                  </p>
                )}

                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}

                {candidate.experience_years && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Experience:</span> {candidate.experience_years} years
                  </p>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(candidate)}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(candidate.id)}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
