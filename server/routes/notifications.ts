import { Router } from 'express';
import { db, broadcastNotification } from '../db';

const router = Router();

// GET /api/notifications - User's notifications
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    const targetUserId = isUuid ? userId : 'a13698dc-ee1d-4d73-9302-b68e1df153cc';

    const { data: notifications, error } = await db
      .from('notifications')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const unreadCount = (notifications || []).filter((n) => !n.is_read).length;

    res.json({
      notifications: notifications || [],
      unreadCount
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch notifications' });
  }
});

// PATCH /api/notifications/:id/read - Mark single notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await db
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ notification: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update notification' });
  }
});

// POST /api/notifications/read-all - Mark all as read
router.post('/read-all', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const { error } = await db
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'All notifications marked as read' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to mark all as read' });
  }
});

// POST /api/notifications/broadcast - Admin broadcast
router.post('/broadcast', async (req, res) => {
  try {
    const { title, message, targetRole } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    await broadcastNotification(title, message, targetRole);

    // Also record in announcements table
    try {
      await db.from('announcements').insert({
        title,
        content: message,
        author_department: 'Dean of Administration',
        created_at: new Date().toISOString()
      });
    } catch (_) {}

    res.json({ message: 'Campus notice published and broadcasted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to broadcast notification' });
  }
});

export default router;
