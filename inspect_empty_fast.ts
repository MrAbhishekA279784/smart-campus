import { db } from './server/db';

async function checkEmpty() {
  const emptyTables = [
    'lost_found_items', 'library_requests', 'assignment_submissions',
    'event_registrations', 'notifications'
  ];

  for (const t of emptyTables) {
    const { data, error } = await db.from(t).select('*').limit(0);
    if (error) {
      console.log(`Table '${t}' select error:`, error.message);
    } else {
      console.log(`Table '${t}' SELECT OK`);
    }
  }
}

checkEmpty();
