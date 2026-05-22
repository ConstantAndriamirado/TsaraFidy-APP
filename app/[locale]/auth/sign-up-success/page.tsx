'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function SignUpSuccessPage() {
  const t = useTranslations()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <Card className="border border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>
                We sent a confirmation link to your email. Please click the link to verify your account.
              </CardDescription>
              <Button
                onClick={() => {
                  console.log('Sign-up success page: navigate to login', locale)
                  router.push(`/${locale}/auth/login`)
                }}
                className="w-full mt-4"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
