import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await query(
      'SELECT * FROM postes WHERE id = $1 AND user_id = $2',
      [id, userId],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Poste not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching poste:', error)
    return NextResponse.json({ error: 'Failed to fetch poste' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { titre, description, departement, salaire_min, salaire_max } = body

    const result = await query(
      `UPDATE postes SET titre = $1, description = $2, departement = $3, salaire_min = $4, salaire_max = $5, updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [titre, description || null, departement || null, salaire_min || null, salaire_max || null, id, userId],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Poste not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating poste:', error)
    return NextResponse.json({ error: 'Failed to update poste' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await query('DELETE FROM postes WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Poste not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting poste:', error)
    return NextResponse.json({ error: 'Failed to delete poste' }, { status: 500 })
  }
}
