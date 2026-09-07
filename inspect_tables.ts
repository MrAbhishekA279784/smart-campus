import { supabase } from './src/lib/supabase';

async function listAllTables() {
  // Let's test standard table name variations
  const candidates = [
    'profiles', 'users', 'students', 'student_profiles', 'faculty', 'faculty_profiles',
    'issues', 'campus_issues', 'complaints',
    'lost_found', 'lost_found_items',
    'canteen_menu', 'canteen_items', 'menu_items',
    'canteen_orders', 'orders', 'canteen_order_items', 'order_items',
    'books', 'library_books', 'library_requests', 'library_loans', 'loans',
    'assignments', 'assignment_submissions', 'submissions',
    'timetable', 'schedules', 'class_schedule',
    'attendance', 'attendance_records',
    'events', 'event_registrations', 'registrations',
    'campus_nodes', 'campus_edges', 'rooms', 'buildings',
    'notifications', 'announcements'
  ];

  for (const c of candidates) {
    const { data, error } = await supabase.from(c).select('*').limit(1);
    if (!error) {
      console.log(`✅ Table '${c}' EXISTS! Sample keys:`, data && data.length ? Object.keys(data[0]) : '(empty)');
    } else if (!error.message.includes('Could not find the table')) {
      console.log(`⚠️ Table '${c}' EXISTS (error: ${error.message})`);
    }
  }
}

listAllTables();
