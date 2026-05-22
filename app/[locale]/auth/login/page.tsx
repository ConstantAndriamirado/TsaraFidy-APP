'use client'

import { useTranslations } from 'next-intl'
import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function LoginPage() {
  const t = useTranslations()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    console.log('Login page: submit', { locale, email })

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        console.error('Login page: server returned error', { status: response.status, data })
        throw new Error(data.error || t('auth.invalid_credentials'))
      }

      console.log('Login page: success, redirecting to dashboard', locale)
      window.location.assign(`/${locale}/dashboard`)
    } catch (error: unknown) {
      console.error('Login page: error', error)
      setError(error instanceof Error ? error.message : t('auth.invalid_credentials'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-2xl">{t('auth.sign_in')}</CardTitle>
              <CardDescription>
                {t('auth.sign_in')} to your TsaraFIDY account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jean@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t('common.loading') : t('auth.sign_in')}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  {t('auth.no_account')}{' '}
                  <Link
                    href={`/${locale}/auth/sign-up`}
                    className="text-primary underline underline-offset-4 hover:text-primary/90"
                  >
                    {t('auth.create_account')}
                  </Link>
                </div>                <div className="mt-4 text-center text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Login page: navigate to Accueil', locale)
                      router.push(`/${locale}`)
                    }}
                    className="text-primary underline underline-offset-4 hover:text-primary/90"
                  >
                    Accueil
                  </button>
                </div>              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
