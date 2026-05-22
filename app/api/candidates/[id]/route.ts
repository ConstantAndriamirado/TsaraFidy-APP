import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth'
import { query } from '@/lib/db'

const ensureCandidatePosteColumn = async () => {
  await query(`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS poste_id UUID REFERENCES postes(id) ON DELETE SET NULL`)
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await query(
      `SELECT c.*, p.titre AS poste_titre,
        COALESCE(c.position_applied, p.titre) AS position_applied
       FROM candidates c
       LEFT JOIN postes p ON c.poste_id = p.id
       WHERE c.id = $1 AND c.user_id = $2`,
      [id, userId],
    )

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching candidate:', error)
    return NextResponse.json({ error: 'Failed to fetch candidate' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  try {
    const result = await query(
      `UPDATE candidates SET
         first_name = $1, last_name = $2, email = $3, phone = $4,
         position_applied = $5, poste_id = $6, skills = $7, experience_years = $8,
         education = $9, status = $10, notes = $11, rating = $12, updated_at = NOW()
       WHERE id = $13 AND user_id = $14 RETURNING *`,
      [
        body.first_name,
        body.last_name,
        body.email,
        body.phone,
        body.position_applied,
        body.poste_id || null,
        body.skills || null,
        body.experience_years || null,
        body.education || null,
        body.status || 'new',
        body.notes || null,
        body.rating || 0,
        id,
        userId,
      ],
    )

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    if (error?.code === '42703') {
      console.warn('Candidate poste_id column missing, adding it now')
      await ensureCandidatePosteColumn()
      const retryResult = await query(
        `UPDATE candidates SET
           first_name = $1, last_name = $2, email = $3, phone = $4,
           position_applied = $5, poste_id = $6, skills = $7, experience_years = $8,
           education = $9, status = $10, notes = $11, rating = $12, updated_at = NOW()
         WHERE id = $13 AND user_id = $14 RETURNING *`,
        [
          body.first_name,
          body.last_name,
          body.email,
          body.phone,
          body.position_applied,
          body.poste_id || null,
          body.skills || null,
          body.experience_years || null,
          body.education || null,
          body.status || 'new',
          body.notes || null,
          body.rating || 0,
          id,
          userId,
        ],
      )

      if (!retryResult.rows || retryResult.rows.length === 0) {
        return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
      }
      return NextResponse.json(retryResult.rows[0])
    }
    console.error('Error updating candidate:', error)
    return NextResponse.json({ error: 'Failed to update candidate' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await query('DELETE FROM candidates WHERE id = $1 AND user_id = $2', [id, userId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting candidate:', error)
    return NextResponse.json({ error: 'Failed to delete candidate' }, { status: 500 })
  }
}
