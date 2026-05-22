import { NextResponse } from 'next/server'
import { verifyPassword, createSessionToken, setAuthCookie } from '@/lib/auth'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body
    console.log('[API] auth/login request', { email })

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const result = await query(
      'SELECT id, password_hash FROM users WHERE email = $1',
      [email.toLowerCase()],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const user = result.rows[0]
    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = createSessionToken(user.id)
    await setAuthCookie(token)

    console.log('[API] auth/login success', { userId: user.id })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Failed to sign in' }, { status: 500 })
  }
}
