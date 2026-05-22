import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { hashPassword, createSessionToken, setAuthCookie } from '@/lib/auth'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body
    console.log('[API] auth/signup request', { email })

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const userId = randomUUID()

    await query(
      'INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)',
      [userId, email.toLowerCase(), passwordHash],
    )

    await query(
      `INSERT INTO profiles (id, user_id, full_name, company_name, language, subscription_tier)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [randomUUID(), userId, null, null, 'fr', 'free'],
    )

    const token = createSessionToken(userId)
    await setAuthCookie(token)

    console.log('[API] auth/signup success', { userId })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
