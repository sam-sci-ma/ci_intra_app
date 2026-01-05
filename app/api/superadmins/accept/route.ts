import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body?.id;
    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });

    // Use Service Role key for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // 1. Get pending user details
    const { data: pendingUser, error: fetchError } = await supabaseAdmin
      .from('pending_users')
      .select('id, email, full_name, password_hash')
      .eq('id', id)
      .single();

    if (fetchError || !pendingUser) {
      return NextResponse.json({ message: 'Pending user not found' }, { status: 404 });
    }

    // 2. Create auth user with the stored password
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: pendingUser.email,
      password: pendingUser.password_hash,
      email_confirm: true
    });

    if (authError) {
      return NextResponse.json({ message: `Auth error: ${authError.message}` }, { status: 500 });
    }

    if (!authData.user) {
      return NextResponse.json({ message: 'Failed to create auth user' }, { status: 500 });
    }

    // 3. Create staff_profile linked to the new auth user
    const { error: profileError } = await supabaseAdmin
      .from('staff_profiles')
      .insert({
        id: authData.user.id,
        email: pendingUser.email,
        full_name: pendingUser.full_name,
        role: 'staff',
        is_approved: true
      });

    if (profileError) {
      return NextResponse.json({ message: `Profile error: ${profileError.message}` }, { status: 500 });
    }

    // 4. Mark pending user as accepted
    const { error: updateError } = await supabaseAdmin
      .from('pending_users')
      .update({ status: 'accepted' })
      .eq('id', id);

    if (updateError) {
      console.warn('Warning: could not mark as accepted, but user was created', updateError);
    }

    return NextResponse.json({
      message: 'User accepted and auth account created',
      userId: authData.user.id,
      email: pendingUser.email
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}
