import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseClient';

export async function POST() {
  try {
    // Events
    const events = [
      { id: 1, title: 'Annual Research Symposium', date: '2026-02-15', time: '09:00:00', location: 'Main Auditorium', organizer: 'Dr. Smith', attendees: 45, category: 'Academic' },
      { id: 2, title: 'Staff Development Workshop', date: '2026-01-20', time: '14:00:00', location: 'Room 301', organizer: 'HR Department', attendees: 20, category: 'Professional Development' },
      { id: 3, title: 'Student Orientation', date: '2026-02-01', time: '10:00:00', location: 'Campus Center', organizer: 'Admin Office', attendees: 150, category: 'Student Affairs' }
    ];

    // Communications
    const communications = [
      { id: 1, title: 'New Curriculum Changes for 2026', author: 'Dean Johnson', date: '2026-01-02', category: 'Academic', priority: 'high', content: 'Important updates to the collective intelligence curriculum...' },
      { id: 2, title: 'Campus Facility Maintenance Schedule', author: 'Facilities Team', date: '2025-12-28', category: 'Operations', priority: 'medium', content: 'Scheduled maintenance for building renovations...' },
      { id: 3, title: 'Research Grant Opportunities', author: 'Research Office', date: '2026-01-03', category: 'Research', priority: 'high', content: 'New funding opportunities available for faculty...' }
    ];

    // Internships
    const internships = [
      { id: 1, company: 'Tech Innovations Inc.', position: 'AI Research Intern', student: 'Emma Wilson', supervisor: 'Prof. Davis', start_date: '2026-01-15', end_date: '2026-06-15', status: 'active' },
      { id: 2, company: 'Global Consulting Group', position: 'Strategy Analyst Intern', student: 'Michael Chen', supervisor: 'Dr. Brown', start_date: '2026-02-01', end_date: '2026-07-01', status: 'pending' },
      { id: 3, company: 'Data Systems Corp', position: 'Data Science Intern', student: 'Sarah Johnson', supervisor: 'Prof. Martinez', start_date: '2025-09-01', end_date: '2025-12-20', status: 'completed' }
    ];

    // Campaigns
    const campaigns = [
      { id: 1, name: 'Social Media Outreach', platform: 'Instagram/LinkedIn', budget: 15000, spent: 8500, leads: 453, status: 'active', start_date: '2025-11-01', end_date: '2026-03-31' },
      { id: 2, name: 'University Fair Tour', platform: 'In-Person Events', budget: 25000, spent: 18000, leads: 287, status: 'active', start_date: '2025-12-01', end_date: '2026-02-28' },
      { id: 3, name: 'Email Campaign - STEM Focus', platform: 'Email Marketing', budget: 8000, spent: 8000, leads: 312, status: 'completed', start_date: '2025-10-15', end_date: '2025-12-15' },
      { id: 4, name: 'Webinar Series', platform: 'Online Events', budget: 10000, spent: 4200, leads: 195, status: 'active', start_date: '2026-01-01', end_date: '2026-04-30' }
    ];

    // Milestones (campaign_id optional/null)
    const milestones = [
      { id: 1, campaign_id: null, title: 'Reach 1000 Applications', target_date: '2025-12-31', completed: true },
      { id: 2, campaign_id: null, title: 'Complete University Fair Tour', target_date: '2026-02-28', completed: false },
      { id: 3, campaign_id: null, title: 'Send 400 Acceptance Letters', target_date: '2026-03-15', completed: false },
      { id: 4, campaign_id: null, title: '300 Confirmed Enrollments', target_date: '2026-05-01', completed: false }
    ];

    const admissionsMetrics = [{ id: 1, total_applicants: 1247, target_applicants: 1500, accepted_students: 342, target_acceptance: 400, confirmed_enrollments: 156, target_enrollments: 300 }];

    const superAdmins = [
      { id: 1, name: 'Admin User 1', email: 'admin1@scintranet.edu', role: 'super_admin', created_at: new Date().toISOString() },
      { id: 2, name: 'Admin User 2', email: 'admin2@scintranet.edu', role: 'super_admin', created_at: new Date().toISOString() }
    ];

    // Upsert data
    const supabaseAdmin = getSupabaseAdmin();

    const res1 = await supabaseAdmin.from('events').upsert(events, { onConflict: 'id' });
    if (res1.error) throw res1.error;

    const res2 = await supabaseAdmin.from('communications').upsert(communications, { onConflict: 'id' });
    if (res2.error) throw res2.error;

    const res3 = await supabaseAdmin.from('internships').upsert(internships, { onConflict: 'id' });
    if (res3.error) throw res3.error;

    const res4 = await supabaseAdmin.from('campaigns').upsert(campaigns, { onConflict: 'id' });
    if (res4.error) throw res4.error;

    const res5 = await supabaseAdmin.from('milestones').upsert(milestones, { onConflict: 'id' });
    if (res5.error) throw res5.error;

    const res6 = await supabaseAdmin.from('admissions_metrics').upsert(admissionsMetrics, { onConflict: 'id' });
    if (res6.error) throw res6.error;

    const res7 = await supabaseAdmin.from('super_admins').upsert(superAdmins, { onConflict: 'id' });
    if (res7.error) throw res7.error;

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
}
