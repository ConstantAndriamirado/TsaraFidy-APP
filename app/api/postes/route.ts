import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth'
import { query } from '@/lib/db'
import { randomUUID } from 'crypto'

const createPostesTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS postes (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      titre VARCHAR(255) NOT NULL,
      description TEXT,
      departement VARCHAR(255),
      salaire_min INTEGER,
      salaire_max INTEGER,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `)
}

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await query(
      'SELECT * FROM postes WHERE user_id = $1 ORDER BY created_at DESC',
      [userId],
    )
    return NextResponse.json(result.rows || [])
  } catch (error: any) {
    if (error?.code === '42P01') {
      console.warn('Postes table missing, creating it on demand')
      await createPostesTable()
      return NextResponse.json([])
    }
    console.error('Error fetching postes:', error)
    return NextResponse.json({ error: 'Failed to fetch postes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const id = randomUUID()
  const { titre, description, departement, salaire_min, salaire_max } = body

  if (!titre) {
    return NextResponse.json({ error: 'Titre is required' }, { status: 400 })
  }

  try {
    const result = await query(
      `INSERT INTO postes (id, user_id, titre, description, departement, salaire_min, salaire_max)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, userId, titre, description || null, departement || null, salaire_min || null, salaire_max || null],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    if (error?.code === '42P01') {
      console.warn('Postes table missing, creating it on demand')
      await createPostesTable()
      const retryResult = await query(
        `INSERT INTO postes (id, user_id, titre, description, departement, salaire_min, salaire_max)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [id, userId, titre, description || null, departement || null, salaire_min || null, salaire_max || null],
      )
      return NextResponse.json(retryResult.rows[0], { status: 201 })
    }
    console.error('Error creating poste:', error)
    return NextResponse.json({ error: 'Failed to create poste' }, { status: 500 })
  }
}
