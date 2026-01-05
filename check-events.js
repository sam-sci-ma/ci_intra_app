// Quick script to check events in Supabase
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://vqxdsmlrksqyncjvnekh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxeGRzbWxya3NxeW5janZuZWtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUyODAxMywiZXhwIjoyMDgzMTA0MDEzfQ.TuHCMEJ35CIXuNrOrO4hm7iWfQYXQ40ngMHld3XDaP0' // Using service role to bypass RLS
);

async function checkEvents() {
  console.log('Checking events table with admin privileges...\n');
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${data.length} events in database:\n`);
  data.forEach((event, i) => {
    console.log(`${i + 1}. ${event.title} - ${event.date}`);
    console.log(`   Created by: ${event.created_by || 'N/A'}`);
    console.log(`   ID: ${event.id}\n`);
  });

  if (data.length === 0) {
    console.log('No events found. The table is empty.');
  }
}

checkEvents().then(() => process.exit(0));
