import { defaultLocale } from '@/i18n.config'
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.redirect(`/${defaultLocale}/auth/login`)
}
