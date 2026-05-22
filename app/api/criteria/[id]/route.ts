import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth'
import { query } from '@/lib/db'

const ensureCriteriaPosteColumn = async () => {
  await query(`ALTER TABLE criteria ADD COLUMN IF NOT EXISTS poste_id UUID REFERENCES postes(id) ON DELETE CASCADE`)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  let body: any = {}

  try {
    body = await request.json()
    const { name, criteria_type, weight } = body

    const result = await query(
      `UPDATE criteria SET name = $1, criteria_type = $2, weight = $3, poste_id = $4, updated_at = NOW()
       WHERE id = $5 AND user_id = $6 RETURNING *`,
      [name, criteria_type, weight, body.poste_id || null, id, userId],
    )

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ error: 'Criteria not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    if (error?.code === '42703') {
      console.warn('Criteria poste_id column missing, adding it now')
      await ensureCriteriaPosteColumn()
      const result = await query(
        `UPDATE criteria SET name = $1, criteria_type = $2, weight = $3, poste_id = $4, updated_at = NOW()
         WHERE id = $5 AND user_id = $6 RETURNING *`,
        [body.name, body.criteria_type, body.weight, body.poste_id || null, id, userId],
      )

      if (!result.rows || result.rows.length === 0) {
        return NextResponse.json({ error: 'Criteria not found' }, { status: 404 })
      }
      return NextResponse.json(result.rows[0])
    }
    console.error('Error updating criteria:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update criteria' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const result = await query('DELETE FROM criteria WHERE id = $1 AND user_id = $2', [
      id,
      userId,
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting criteria:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete criteria' },
      { status: 500 },
    )
  }
}
