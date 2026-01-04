import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseClient';

export async function POST() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    // Try to insert the super admins
    // If the table doesn't exist, it will fail, but we'll handle that
    const { data, error } = await supabaseAdmin.from('super_admins').upsert(
      [
        { id: 1, name: 'Admin User 1', email: 'admin1@scintranet.edu', role: 'super_admin' },
        { id: 2, name: 'Admin User 2', email: 'admin2@scintranet.edu', role: 'super_admin' }
      ],
      { onConflict: 'id' }
    );

    if (error) {
      // Table might not exist, return helpful error
      return NextResponse.json({ 
        ok: false, 
        error: error.message,
        message: 'Please create the super_admins table in Supabase first' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      ok: true, 
      message: '2 super admins created successfully',
      data 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
}
