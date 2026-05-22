import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './i18n.config'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

const protectedPaths = locales.map(
  (locale) => `/${locale}/dashboard`
)

function isProtectedPath(pathname: string) {
  return protectedPaths.some((prefix) =>
    pathname.startsWith(prefix)
  )
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Ignore static files
  if (
    pathname.includes('.') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  // Root redirect
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}`, request.url)
    )
  }

  const token =
    request.cookies.get('tsara_fidy_token')?.value

  console.log('[proxy]', {
    pathname,
    hasToken: Boolean(token),
  })

  // Protect dashboard
  if (isProtectedPath(pathname) && !token) {
    const locale =
      pathname.split('/')[1] || defaultLocale

    return NextResponse.redirect(
      new URL(`/${locale}/auth/login`, request.url)
    )
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}