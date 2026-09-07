import { db } from './server/db';

async function testMore() {
  const tables = [
    'profiles', 'campus_issues', 'lost_found_items', 'canteen_items',
    'canteen_order_items', 'library_books', 'library_requests',
    'assignments', 'assignment_submissions', 'event_registrations',
    'notifications', 'announcements'
  ];

  for (const t of tables) {
    const { data } = await db.from(t).select('*').limit(1);
    console.log(`${t}:`, data?.[0] ? Object.keys(data[0]) : "empty");
  }
}

testMore();
