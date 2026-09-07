import { db } from './server/db';

async function getColumns() {
  const tables = [
    'profiles', 'campus_issues', 'lost_found_items', 'canteen_items',
    'canteen_orders', 'canteen_order_items', 'library_books',
    'library_requests', 'library_loans', 'assignments', 'assignment_submissions',
    'timetable', 'attendance', 'events', 'event_registrations',
    'campus_nodes', 'campus_edges', 'rooms', 'buildings',
    'notifications', 'announcements'
  ];

  for (const t of tables) {
    // Try inserting a record with default values or empty object to catch column list from error or success
    const { data, error } = await db.rpc('get_columns_for_table', { table_name: t });
    if (error) {
      // Let's test standard column candidates by selecting them
      const commonCols = [
        'id', 'created_at', 'updated_at', 'email', 'full_name', 'name', 'role',
        'student_id', 'faculty_id', 'user_id', 'title', 'description', 'category',
        'status', 'priority', 'location', 'type', 'item_name', 'price', 'is_available',
        'available', 'stock', 'image_url', 'isbn', 'author', 'total_copies',
        'available_copies', 'due_date', 'due_at', 'return_date', 'borrowed_at',
        'subject', 'course', 'day_of_week', 'day', 'start_time', 'end_time', 'room',
        'building', 'date', 'event_date', 'event_id', 'ticket_id', 'ticket_number',
        'marks', 'max_marks', 'feedback', 'file_url', 'notes', 'total_amount',
        'payment_method', 'payment_status', 'token_number', 'is_read', 'notification_type'
      ];
      const validCols: string[] = [];
      for (const col of commonCols) {
        const { error: colErr } = await db.from(t).select(col).limit(1);
        if (!colErr) validCols.push(col);
      }
      console.log(`Table '${t}' valid columns:`, validCols.join(', '));
    } else {
      console.log(`Table '${t}' RPC columns:`, data);
    }
  }
}

getColumns();
