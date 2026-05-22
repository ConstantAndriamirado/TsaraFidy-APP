import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth'
import { query } from '@/lib/db'
import { randomUUID } from 'crypto'

const ensureCandidatePosteColumn = async () => {
  await query(`ALTER TABLE candidates ADD COLUMN IF NOT EXISTS poste_id UUID REFERENCES postes(id) ON DELETE SET NULL`)
}

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await query(
      `SELECT c.*, p.titre AS poste_titre,
        COALESCE(c.position_applied, p.titre) AS position_applied
       FROM candidates c
       LEFT JOIN postes p ON c.poste_id = p.id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [userId],
    )

    const normalizeSkills = (skills: any) => {
      if (!skills) return []
      if (Array.isArray(skills)) return skills
      if (typeof skills === 'string') {
        try {
          const parsed = JSON.parse(skills)
          if (Array.isArray(parsed)) return parsed
        } catch (e) {
          // not JSON, fallthrough to comma-split
        }
        return skills.split(',').map((s) => s.trim()).filter(Boolean)
      }
      return []
    }

    const rows = (result.rows || []).map((r: any) => ({
      ...r,
      skills: normalizeSkills(r.skills),
    }))

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching candidates:', error)
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = randomUUID()

  const body = await request.json()

  const {
    first_name,
    last_name,
    email,
    phone,
    position_applied,
    poste_id,
    skills,
    experience_years,
    education,
    status,
    notes,
    rating,
  } = body

  try {
    const result = await query(
      `INSERT INTO candidates (id, user_id, first_name, last_name, email, phone, position_applied, poste_id, skills, experience_years, education, status, notes, rating)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [
        id,
        userId,
        first_name,
        last_name,
        email,
        phone,
        position_applied,
        poste_id || null,
        skills || null,
        experience_years || null,
        education || null,
        status || 'new',
        notes || null,
        rating || 0,
      ],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    if (error?.code === '42703') {
      console.warn('Candidate poste_id column missing, adding it now')
      await ensureCandidatePosteColumn()
      const retryResult = await query(
        `INSERT INTO candidates (id, user_id, first_name, last_name, email, phone, position_applied, poste_id, skills, experience_years, education, status, notes, rating)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         RETURNING *`,
        [
          id,
          userId,
          first_name,
          last_name,
          email,
          phone,
          position_applied,
          poste_id || null,
          skills || null,
          experience_years || null,
          education || null,
          status || 'new',
          notes || null,
          rating || 0,
        ],
      )
      return NextResponse.json(retryResult.rows[0], { status: 201 })
    }
    console.error('Error creating candidate:', error)
    return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 })
  }
}
