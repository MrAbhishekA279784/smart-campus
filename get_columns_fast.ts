import { db } from './server/db';

async function getFast() {
  const tables = [
    'profiles', 'campus_issues', 'lost_found_items', 'canteen_items',
    'canteen_orders', 'canteen_order_items', 'library_books',
    'library_requests', 'library_loans', 'assignments', 'assignment_submissions',
    'timetable', 'attendance', 'events', 'event_registrations',
    'campus_nodes', 'campus_edges', 'rooms', 'buildings',
    'notifications', 'announcements'
  ];

  for (const t of tables) {
    const { data, error } = await db.from(t).select('*').limit(0);
    if (error) {
      console.log(`Table '${t}' select error:`, error.message);
    } else {
      console.log(`Table '${t}' SELECT OK`);
    }
  }
}

getFast();
