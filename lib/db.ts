import { Pool } from 'pg'

const connectionString =
  process.env.DATABASE_URL ??
  'postgres://postgres:postgres@localhost:5432/TsaraFidy'

export const pool = new Pool({
  connectionString,
})

export async function query(text: string, params: unknown[] = []) {
  return pool.query(text, params)
}
