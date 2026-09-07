import { db } from './server/db';

async function probeColumns(tableName: string) {
  // Let's force an error by selecting non_existent_col to get column hints, or select * on empty insert
  const { data, error } = await db.from(tableName).select('*').limit(1);
  if (error) {
    console.log(`Table '${tableName}' error:`, error.message);
    return;
  }
  // Let's attempt an insert with an empty object or invalid type to inspect schema
  const { error: insErr } = await db.from(tableName).insert([{ invalid_col_test_123: true }]);
  if (insErr) {
    console.log(`Table '${tableName}' schema hint:`, insErr.message);
  }
}

async function runAll() {
  const tables = [
    'profiles', 'campus_issues', 'lost_found_items', 'canteen_items',
    'canteen_orders', 'canteen_order_items', 'library_books',
    'library_requests', 'library_loans', 'assignments', 'assignment_submissions',
    'timetable', 'attendance', 'events', 'event_registrations',
    'campus_nodes', 'campus_edges', 'rooms', 'buildings',
    'notifications', 'announcements'
  ];

  for (const t of tables) {
    await probeColumns(t);
  }
}

runAll();
