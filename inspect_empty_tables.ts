import { db } from './server/db';

async function checkEmpty() {
  const emptyTables = [
    'lost_found_items', 'library_requests', 'assignment_submissions',
    'event_registrations', 'notifications'
  ];

  const colsToTest: Record<string, string[]> = {
    lost_found_items: ['id', 'item_name', 'title', 'type', 'category', 'description', 'location', 'reported_by', 'status', 'contact_name', 'claimed_by', 'created_at'],
    library_requests: ['id', 'student_id', 'title', 'author', 'request_type', 'status', 'notes', 'created_at'],
    assignment_submissions: ['id', 'assignment_id', 'student_id', 'file_url', 'notes', 'marks', 'feedback', 'graded_by', 'submitted_at', 'created_at'],
    event_registrations: ['id', 'event_id', 'student_id', 'student_name', 'roll_number', 'created_at'],
    notifications: ['id', 'user_id', 'notification_type', 'type', 'title', 'message', 'action_url', 'is_read', 'created_at']
  };

  for (const t of emptyTables) {
    const valid: string[] = [];
    for (const c of colsToTest[t]) {
      const { error } = await db.from(t).select(c).limit(1);
      if (!error) valid.push(c);
    }
    console.log(`Table '${t}' valid columns:`, valid.join(', '));
  }
}

checkEmpty();
