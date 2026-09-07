import { supabase } from './src/lib/supabase';

async function inspect() {
  const tables = [
    'profiles', 'students', 'faculty', 'campus_issues', 'lost_found_items', 
    'canteen_menu', 'canteen_orders', 'canteen_order_items', 
    'library_books', 'library_requests', 'library_loans',
    'assignments', 'assignment_submissions', 'timetable', 'attendance_records',
    'events', 'event_registrations', 'campus_nodes', 'campus_edges', 'notifications'
  ];

  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`Table '${t}': Error (${error.message})`);
    } else if (data && data.length > 0) {
      console.log(`Table '${t}' columns:`, Object.keys(data[0]));
    } else {
      // Try inserting dummy or selecting column metadata via RPC or REST
      console.log(`Table '${t}' exists but empty (rows = 0)`);
    }
  }
}

inspect();
