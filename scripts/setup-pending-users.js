const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setup() {
  try {
    console.log('1. Creating pending_users table...');
    const createTableSql = `
      create table if not exists public.pending_users (
        id serial primary key,
        email text not null unique,
        full_name text,
        status text not null default 'pending',
        created_at timestamptz not null default now()
      );
    `;
    
    const { error: tableError } = await supabase.rpc('query', { sql: createTableSql });
    if (tableError && !tableError.message.includes('already exists')) {
      console.log('   (Table may already exist, continuing...)');
    } else {
      console.log('   ✓ pending_users table created/verified');
    }

    console.log('2. Updating staff_profiles roles to super_admin...');
    const { data: updated, error: updateError } = await supabase
      .from('staff_profiles')
      .update({ role: 'super_admin' })
      .in('email', ['samuel.gyasi@um6p.ma', 'Maha.Kabbaj@um6p.ma']);

    if (updateError) {
      console.error('   Error updating roles:', updateError);
    } else {
      console.log('   ✓ Updated roles');
    }

    console.log('3. Checking current staff_profiles...');
    const { data: profiles, error: fetchError } = await supabase
      .from('staff_profiles')
      .select('id, email, full_name, role, is_approved')
      .in('email', ['samuel.gyasi@um6p.ma', 'Maha.Kabbaj@um6p.ma']);

    if (fetchError) {
      console.error('   Error fetching profiles:', fetchError);
    } else {
      console.log('   Current profiles:');
      console.log(JSON.stringify(profiles, null, 2));
    }

    console.log('\n✓ Setup complete!');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

setup();
