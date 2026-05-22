-- Create schemas and tables for TsaraFidy

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  company_name VARCHAR(255),
  language VARCHAR(10) DEFAULT 'fr',
  subscription_tier VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Postes table
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
);

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  poste_id UUID REFERENCES postes(id) ON DELETE SET NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  position_applied VARCHAR(255),
  skills TEXT,
  experience_years INTEGER,
  education VARCHAR(255),
  status VARCHAR(50) DEFAULT 'new',
  notes TEXT,
  rating INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criteria table
CREATE TABLE IF NOT EXISTS criteria (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  poste_id UUID REFERENCES postes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  criteria_type VARCHAR(50) DEFAULT 'skill',
  weight DECIMAL(10, 2) DEFAULT 1.0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_candidates_poste_id ON candidates(poste_id);
CREATE INDEX IF NOT EXISTS idx_criteria_user_id ON criteria(user_id);
CREATE INDEX IF NOT EXISTS idx_criteria_poste_id ON criteria(poste_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_postes_user_id ON postes(user_id);


-- Create a test user with email 'test@example.com' and password 'password123'
-- The hash below is for 'password123'
INSERT INTO users (id, email, password_hash) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', '$2a$10$WcNcO4uifDpFgpv8c0ezyuBm.tweiqfQht2g6ik5JghjXwURDZapG')
ON CONFLICT (email) DO NOTHING;

-- Create profile for test user
INSERT INTO profiles (id, user_id, full_name, company_name, language, subscription_tier)
VALUES ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Test User', 'Test Company', 'fr', 'free')
ON CONFLICT DO NOTHING;

-- Add some sample candidates
INSERT INTO candidates (id, user_id, first_name, last_name, email, phone, position_applied, skills, experience_years, education, status, rating)
VALUES 
  ('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Jean', 'Dupont', 'jean@example.com', '+33612345678', 'Développeur', 'JavaScript,React,Node.js', 5, 'Bac+5', 'new', 4),
  ('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Marie', 'Martin', 'marie@example.com', '+33687654321', 'Designer', 'Figma,UI/UX,Photoshop', 3, 'Bac+4', 'shortlisted', 5),
  ('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Pierre', 'Bernard', 'pierre@example.com', '+33698765432', 'Product Manager', 'Agile,Leadership,Analytics', 7, 'Bac+5', 'in_review', 4)
ON CONFLICT DO NOTHING;

-- Add sample criteria
INSERT INTO criteria (id, user_id, name, criteria_type, weight)
VALUES 
  ('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Experience', 'skill', 2.0),
  ('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Technical Skills', 'skill', 3.0),
  ('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Communication', 'soft', 1.5),
  ('850e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Leadership', 'soft', 2.0)
ON CONFLICT DO NOTHING;
