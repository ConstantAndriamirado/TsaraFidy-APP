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

export default function SignUpPage() {
  const t = useTranslations()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    console.log('Sign-up page: submit', { locale, email })

    if (password !== repeatPassword) {
      console.warn('Sign-up page: password mismatch')
      setError(t('auth.password_mismatch'))
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      console.warn('Sign-up page: password too short')
      setError(t('auth.password_too_short'))
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        console.error('Sign-up page: server returned error', { status: response.status, data })
        throw new Error(data.error || t('common.error'))
      }

      console.log('Sign-up page: success, redirecting to dashboard', locale)
      window.location.assign(`/${locale}/dashboard`)
    } catch (error: unknown) {
      console.error('Sign-up page: error', error)
      setError(error instanceof Error ? error.message : t('common.error'))
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
              <CardTitle className="text-2xl">{t('auth.create_account')}</CardTitle>
              <CardDescription>
                {t('auth.create_account')} to start managing candidates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
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
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password">{t('auth.confirm_password')}</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t('common.loading') : t('auth.create_account')}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  {t('auth.already_have_account')}{' '}
                  <Link
                    href={`/${locale}/auth/login`}
                    className="text-primary underline underline-offset-4 hover:text-primary/90"
                  >
                    {t('auth.sign_in')}
                  </Link>
                </div>
                <div className="mt-4 text-center text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Sign-up page: navigate to Accueil', locale)
                      router.push(`/${locale}`)
                    }}
                    className="text-primary underline underline-offset-4 hover:text-primary/90"
                  >
                    Accueil
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
