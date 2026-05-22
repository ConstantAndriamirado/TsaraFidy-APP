import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth'
import { query } from '@/lib/db'
import { randomUUID } from 'crypto'

const ensureCriteriaPosteColumn = async () => {
  await query(`ALTER TABLE criteria ADD COLUMN IF NOT EXISTS poste_id UUID REFERENCES postes(id) ON DELETE CASCADE`)
}

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await query(
      'SELECT * FROM criteria WHERE user_id = $1 ORDER BY created_at DESC',
      [userId],
    )
    return NextResponse.json(result.rows || [])
  } catch (error) {
    console.error('Error fetching criteria:', error)
    return NextResponse.json({ error: 'Failed to fetch criteria' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, criteria_type, weight } = body

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const id = randomUUID()
  try {
    const result = await query(
      `INSERT INTO criteria (id, user_id, name, criteria_type, weight, poste_id, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6, NOW(), NOW())
       RETURNING *`,
      [id, userId, name, criteria_type || 'skill', weight ?? 1.0, body.poste_id || null],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    if (error?.code === '42703') {
      console.warn('Criteria poste_id column missing, adding it now')
      await ensureCriteriaPosteColumn()
      const result = await query(
        `INSERT INTO criteria (id, user_id, name, criteria_type, weight, poste_id, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6, NOW(), NOW())
         RETURNING *`,
        [id, userId, name, criteria_type || 'skill', weight ?? 1.0, body.poste_id || null],
      )
      return NextResponse.json(result.rows[0], { status: 201 })
    }
    console.error('Error creating criteria:', error)
    return NextResponse.json({ error: 'Failed to create criteria' }, { status: 500 })
  }
}
