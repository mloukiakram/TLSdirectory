-- ============================================
-- TLSdirectory Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================

-- Executives (General Manager, HR Manager, etc.)
CREATE TABLE IF NOT EXISTS executives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  telegram TEXT,
  location TEXT,
  position INT DEFAULT 0
);

-- Office locations
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  map_url TEXT,
  position INT DEFAULT 0
);

-- Units within locations
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'unit',
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  supervisor_name TEXT,
  supervisor_role TEXT,
  supervisor_telegram TEXT,
  position INT DEFAULT 0
);

-- Teams within units
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  position INT DEFAULT 0
);

-- Members within teams
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  telegram TEXT,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  position INT DEFAULT 0
);

-- Admin config (stores admin password)
CREATE TABLE IF NOT EXISTS admin_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- ============================================
-- Row Level Security: allow full access via anon key
-- ============================================
ALTER TABLE executives ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access" ON executives FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON locations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON units FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON admin_config FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- Insert admin password
-- ============================================
INSERT INTO admin_config (key, value)
VALUES ('admin_password', 'tls-admin26')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
