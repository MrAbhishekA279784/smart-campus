import { supabase } from './src/lib/supabase';

async function audit() {
  console.log("=== SUPABASE DATABASE TABLE AUDIT ===");
  const tables = [
    'profiles', 'students', 'faculty', 'campus_issues', 'lost_found_items', 
    'canteen_menu', 'canteen_orders', 'canteen_order_items', 
    'library_books', 'library_requests', 'library_loans',
    'assignments', 'assignment_submissions', 'timetable', 'attendance_records',
    'events', 'event_registrations', 'campus_nodes', 'campus_edges', 'notifications'
  ];

  for (const t of tables) {
    const { data, error, count } = await supabase.from(t).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`Table '${t}': ❌ ERROR (${error.message})`);
    } else {
      console.log(`Table '${t}': ✅ EXISTS (rows: ${count})`);
    }
  }
}

audit();
