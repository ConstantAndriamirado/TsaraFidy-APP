#!/usr/bin/env node
const fs = require('fs');
const { Pool } = require('pg');

const connectionStrings = [
  process.env.DATABASE_URL,
  'postgres://postgres:postgres@localhost:5432/TsaraFidy',
  'postgres://:@localhost:5432/TsaraFidy', // empty password
  'postgres://postgres:@localhost:5432/TsaraFidy',
  'postgresql://postgres@localhost:5432/TsaraFidy',
  'postgresql://localhost:5432/TsaraFidy',
];

async function initializeDatabase() {
  let pool;
  let lastError;

  for (const connectionString of connectionStrings) {
    if (!connectionString) continue;

    try {
      console.log(`Attempting connection with: ${connectionString.replace(/\/\/.*:.*@/, '//**:**@')}`);
      pool = new Pool({ connectionString });
      
      // Test connection
      const res = await pool.query('SELECT 1');
      console.log('✓ Connection successful');
      break;
    } catch (error) {
      lastError = error;
      console.log(`✗ Failed: ${error.message}`);
      if (pool) {
        await pool.end();
        pool = null;
      }
    }
  }

  if (!pool) {
    console.error('\nFailed to connect to database with any configuration');
    process.exit(1);
  }

  try {
    console.log('\nInitializing database...');
    const sql = fs.readFileSync('./db-setup.sql', 'utf8');
    
    await pool.query(sql);
    await pool.query("ALTER TABLE candidates ADD COLUMN IF NOT EXISTS poste_id UUID REFERENCES postes(id) ON DELETE SET NULL")
    await pool.query("ALTER TABLE criteria ADD COLUMN IF NOT EXISTS poste_id UUID REFERENCES postes(id) ON DELETE CASCADE")
    
    console.log('✓ Database initialized successfully');
    console.log('\nTest user created:');
    console.log('  Email: test@example.com');
    console.log('  Password: password123');
    console.log('\nSample data inserted:');
    console.log('  - 3 candidates');
    console.log('  - 4 criteria');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
