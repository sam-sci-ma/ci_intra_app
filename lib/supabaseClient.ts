import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side privileged operations, provide a getter that creates the admin
// client at runtime. This avoids bundling the service role key into the client
// bundle and prevents createClient from throwing during client-side module evaluation.
export function getSupabaseAdmin() {
	const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!serviceRole) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required on the server');
	return createClient(supabaseUrl, serviceRole);
}

export default supabase;
