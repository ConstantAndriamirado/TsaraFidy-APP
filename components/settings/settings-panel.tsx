'use client'

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, LogOut, Lock } from 'lucide-react'

interface Profile {
  id: string
  email: string
  full_name: string
  company_name: string
  language: string
  subscription_tier: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function SettingsPanel() {
  const t = useTranslations()
  const router = useRouter()
  const { data: profile } = useSWR<Profile>('/api/profile', fetcher)
  
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [language, setLanguage] = useState('fr')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setCompanyName(profile.company_name || '')
      setLanguage(profile.language || 'fr')
    }
  }, [profile])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage('')

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          company_name: companyName,
          language,
        }),
      })

      if (response.ok) {
        setSaveMessage('Profil mis à jour avec succès')
        mutate('/api/profile')
        setTimeout(() => setSaveMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      setSaveMessage('Erreur lors de la mise à jour')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    })
    router.push('/fr/auth/login')
  }

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'pt', name: 'Português' },
    { code: 'ar', name: 'العربية' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Paramètres du compte</h2>
        <p className="text-muted-foreground mt-1">Gérez vos paramètres personnels et préférences</p>
      </div>

      {/* Profile Section */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Informations du profil</CardTitle>
          <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile?.email || ''}
                disabled
                className="opacity-50"
              />
              <p className="text-xs text-muted-foreground">Votre email de connexion (non modifiable)</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="RAKOTO Jean"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Mon Entreprise"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="language">Langue préférée</Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                title={t('settings.language') || 'Langue préférée'}
                aria-label={t('settings.language') || 'Langue préférée'}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {saveMessage && (
              <div className="p-3 bg-primary/10 text-primary rounded-md text-sm">
                {saveMessage}
              </div>
            )}

            <Button type="submit" disabled={isSaving} className="w-full gap-2">
              <Save className="w-4 h-4" />
              {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Subscription Section */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Abonnement</CardTitle>
          <CardDescription>Gérez votre plan d&apos;abonnement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold capitalize">{profile?.subscription_tier || 'free'} Plan</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.subscription_tier === 'free'
                      ? 'Jusqu&apos;à 50 candidats'
                      : 'Candidats illimités'}
                  </p>
                </div>
                <Button variant="outline">Upgrade</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Sécurité
          </CardTitle>
          <CardDescription>Gérez votre sécurité et vos sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Mot de passe</h3>
            <Button variant="outline" className="w-full">
              Changer le mot de passe
            </Button>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Sessions actives</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Vous êtes connecté sur cet appareil
            </p>
            <Button onClick={handleLogout} variant="destructive" className="w-full gap-2">
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Zone de danger</CardTitle>
          <CardDescription>Actions irréversibles</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="w-full">
            Supprimer le compte
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
