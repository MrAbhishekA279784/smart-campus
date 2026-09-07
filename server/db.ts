import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gqeplhjtkggsohbwmqhx.supabase.co';
const SUPABASE_SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZXBsaGp0a2dnc29oYndtcWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODc1NTUzMSwiZXhwIjoyMTA0MzMxNTMxfQ.moJxzzEwphZ-MAvl6O6CCPGNgcf07Qc4zI4vcCgrHm0';

export const db: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

/**
 * Dispatches a persistent notification to a user in the database.
 */
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  actionUrl: string = '/notifications'
) {
  try {
    const { error } = await db.from('notifications').insert({
      user_id: userId,
      notification_type: type,
      title,
      message,
      action_url: actionUrl,
      is_read: false
    });
    if (error) {
      console.warn('Failed to insert notification:', error.message);
    }
  } catch (e) {
    console.warn('Error creating notification:', e);
  }
}

/**
 * Dispatches a broadcast notification to all active profiles matching a role or everyone.
 */
export async function broadcastNotification(
  title: string,
  message: string,
  targetRole?: string,
  actionUrl: string = '/notifications'
) {
  try {
    let query = db.from('profiles').select('id');
    if (targetRole && targetRole !== 'all') {
      query = query.eq('role', targetRole);
    }
    const { data: users } = await query;
    if (users && users.length > 0) {
      const records = users.map((u) => ({
        user_id: u.id,
        notification_type: 'announcement',
        title,
        message,
        action_url: actionUrl,
        is_read: false
      }));
      await db.from('notifications').insert(records);
    }
  } catch (e) {
    console.warn('Broadcast notification error:', e);
  }
}
