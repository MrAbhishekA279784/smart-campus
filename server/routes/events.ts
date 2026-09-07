import { Router } from 'express';
import { db, createNotification, broadcastNotification } from '../db';

const router = Router();

// GET /api/events - List events
router.get('/', async (req, res) => {
  try {
    const studentId = req.query.studentId as string;
    const { data: events, error } = await db
      .from('events')
      .select('*')
      .order('start_at', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    let userRegistrations = new Set<string>();
    if (studentId) {
      const { data: regs } = await db
        .from('event_registrations')
        .select('event_id')
        .eq('student_id', studentId);
      (regs || []).forEach((r) => userRegistrations.add(r.event_id));
    }

    // Get registration count for each event
    const { data: allRegs } = await db.from('event_registrations').select('event_id');
    const countMap: Record<string, number> = {};
    (allRegs || []).forEach((r) => {
      countMap[r.event_id] = (countMap[r.event_id] || 0) + 1;
    });

    const formatted = (events || []).map((e) => ({
      id: e.id,
      title: e.title,
      subtitle: e.subtitle || e.description || '',
      date: e.date,
      time: e.time || '10:00 AM',
      venue: e.venue || e.location || 'Central Auditorium',
      category: e.category || 'Cultural',
      organizedBy: e.organized_by || 'Student Council',
      image: e.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      registeredCount: countMap[e.id] ?? e.registered_count ?? 120,
      capacity: e.capacity || 250,
      isRegistered: userRegistrations.has(e.id)
    }));

    res.json({ events: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch events' });
  }
});

// POST /api/events/:id/register - Student registers for event
router.post('/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, studentName, studentRoll } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required' });
    }

    // Check if event exists
    const { data: event, error: eventErr } = await db
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (eventErr || !event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check capacity
    const { count: currentRegs } = await db
      .from('event_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', id);

    const capacity = event.capacity || 250;
    if ((currentRegs || 0) >= capacity) {
      return res.status(400).json({ error: 'Event is fully booked! Registration closed.' });
    }

    // Check existing registration
    const { data: existing } = await db
      .from('event_registrations')
      .select('id')
      .eq('event_id', id)
      .eq('student_id', studentId)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: 'You are already registered for this event.' });
    }

    // Insert registration
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentId);
    const targetStudentId = isUuid ? studentId : 'a13698dc-ee1d-4d73-9302-b68e1df153cc';

    const { data, error } = await db
      .from('event_registrations')
      .insert({
        event_id: id,
        student_id: targetStudentId
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Increment count on event record
    try {
      await db.from('events').update({ registered_count: (currentRegs || 0) + 1 }).eq('id', id);
    } catch (_) {}

    // Send confirmation notification
    await createNotification(
      studentId,
      'event_registration',
      `Registered: ${event.title}`,
      `Your pass for ${event.title} on ${event.date} at ${event.venue || event.location} is confirmed!`,
      '/events'
    );

    res.json({
      registration: data,
      message: `Successfully registered for ${event.title}!`,
      newCount: (currentRegs || 0) + 1
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to register for event' });
  }
});

// DELETE /api/events/:id/register - Cancel event registration
router.delete('/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.query.studentId as string;

    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required' });
    }

    const { error } = await db
      .from('event_registrations')
      .delete()
      .eq('event_id', id)
      .eq('student_id', studentId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Event registration cancelled successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to cancel registration' });
  }
});

// POST /api/events - Admin creates event
router.post('/', async (req, res) => {
  try {
    const { title, subtitle, date, time, venue, category, organizedBy, capacity, image } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: 'Title and Date are required' });
    }

    const { data, error } = await db
      .from('events')
      .insert({
        title,
        subtitle: subtitle || '',
        description: subtitle || '',
        date,
        time: time || '10:00 AM',
        venue: venue || 'Central Auditorium',
        location: venue || 'Central Auditorium',
        category: category || 'Academic',
        organized_by: organizedBy || 'College Administration',
        capacity: capacity ? parseInt(capacity, 10) : 200,
        image_url: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        registered_count: 0
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Broadcast announcement
    await broadcastNotification(
      `New Campus Event: ${title}`,
      `Upcoming event on ${date} at ${venue || 'Central Auditorium'}. Registrations now open!`,
      'all',
      '/events'
    );

    res.json({ event: data, message: 'Event published successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create event' });
  }
});

export default router;
