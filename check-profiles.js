// Check staff_profiles and auth.users
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://vqxdsmlrksqyncjvnekh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxeGRzbWxya3NxeW5janZuZWtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUyODAxMywiZXhwIjoyMDgzMTA0MDEzfQ.TuHCMEJ35CIXuNrOrO4hm7iWfQYXQ40ngMHld3XDaP0'
);

async function check() {
  console.log('=== Checking Staff Profiles ===\n');
  
  const { data: profiles, error: profileError } = await supabase
    .from('staff_profiles')
    .select('*');
  
  if (profileError) {
    console.error('Error fetching profiles:', profileError);
  } else {
    console.log(`Found ${profiles.length} profiles:`);
    profiles.forEach(p => {
      console.log(`  - ${p.full_name} (${p.email}) [ID: ${p.id}]`);
    });
  }

  console.log('\n=== Checking Events with Creator Info ===\n');
  
  const { data: events, error: eventError } = await supabase
    .from('events')
    .select(`*, staff_profiles (full_name)`);
  
  if (eventError) {
    console.error('Error fetching events:', eventError);
  } else {
    events.forEach(e => {
      const creatorName = e.staff_profiles?.full_name || 'NOT FOUND';
      console.log(`Event: ${e.title}`);
      console.log(`  created_by: ${e.created_by || 'NULL'}`);
      console.log(`  creator name: ${creatorName}\n`);
    });
  }
}

check().then(() => process.exit(0));
