import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from './db'

const AUTH_COOKIE_NAME = 'tsara_fidy_token'
const JWT_SECRET = process.env.JWT_SECRET ?? 'replace-me-with-a-strong-secret'
const JWT_MAX_AGE = 60 * 60 * 24 * 7

export interface UserSession {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  language: string
  subscription_tier: string
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function createSessionToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifySessionToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: JWT_MAX_AGE,
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  })
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(AUTH_COOKIE_NAME)?.value
  if (!cookie) return null

  try {
    const payload = verifySessionToken(cookie)
    const result = await query(
      `
      SELECT 
        users.id,
        users.email,
        profiles.full_name,
        profiles.company_name,
        profiles.language,
        profiles.subscription_tier
      FROM users
      LEFT JOIN profiles
        ON profiles.user_id = users.id
      WHERE users.id = $1
      `,
      [payload.userId],
    )

    if (!result.rows.length) {
      return null
    }

    return result.rows[0] as UserSession
  } catch (error) {
    console.error('[AUTH ERROR]', error)
    return null
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(AUTH_COOKIE_NAME)?.value
  if (!cookie) return null

  try {
    const payload = verifySessionToken(cookie)
    return payload.userId
  } catch {
    return null
  }
}
