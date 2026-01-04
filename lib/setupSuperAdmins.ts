import { getSupabaseAdmin } from '@/lib/supabaseClient';

export async function setupSuperAdminsTable() {
  const supabaseAdmin = getSupabaseAdmin();

  try {
    // First, try to create the table via raw SQL
    const { error: createError } = await supabaseAdmin.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS super_admins (
          id BIGINT PRIMARY KEY DEFAULT nextval('super_admins_id_seq'::regclass),
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          role TEXT DEFAULT 'super_admin',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        CREATE SEQUENCE IF NOT EXISTS super_admins_id_seq START 1;
      `
    });

    // If RPC doesn't work, just insert directly (table might already exist)
    // Insert 2 super admins
    const { error: insertError } = await supabaseAdmin.from('super_admins').upsert(
      [
        { name: 'Admin User 1', email: 'admin1@scintranet.edu', role: 'super_admin' },
        { name: 'Admin User 2', email: 'admin2@scintranet.edu', role: 'super_admin' }
      ],
      { onConflict: 'email' }
    );

    if (insertError) {
      console.error('Insert error:', insertError);
      return { success: false, error: insertError.message };
    }

    return { success: true, message: 'Super admins setup complete' };
  } catch (error) {
    console.error('Setup error:', error);
    return { success: false, error: String(error) };
  }
}
