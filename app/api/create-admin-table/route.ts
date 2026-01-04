import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'To create 2 super admins, please run this SQL in your Supabase SQL Editor:',
    sql: `
-- Create super_admins table
CREATE TABLE IF NOT EXISTS super_admins (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'super_admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert 2 super admins
INSERT INTO super_admins (name, email, role) 
VALUES 
  ('Admin User 1', 'admin1@scintranet.edu', 'super_admin'),
  ('Admin User 2', 'admin2@scintranet.edu', 'super_admin')
ON CONFLICT (email) DO NOTHING;
    `
  });
}
