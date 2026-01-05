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

async function upsertSuperAdmins() {
  try {
    console.log('Upserting super_admins...');
    const { data, error } = await supabase
      .from('super_admins')
      .upsert([
        { email: 'samuel.gyasi@um6p.ma', full_name: 'Samuel Gyasi', role: 'super_admin' },
        { email: 'Maha.Kabbaj@um6p.ma', full_name: 'Maha Kabbaj', role: 'super_admin' }
      ], { onConflict: 'email' });

    if (error) {
      console.error('Error upserting:', error);
      process.exit(1);
    }

    console.log('✓ Successfully upserted super_admins:');
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

upsertSuperAdmins();
