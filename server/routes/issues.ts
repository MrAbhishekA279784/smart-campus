import { Router } from 'express';
import { db, createNotification, broadcastNotification } from '../db';

const router = Router();

// GET /api/issues - List campus issues
router.get('/', async (req, res) => {
  try {
    const studentId = req.query.studentId as string;
    const status = req.query.status as string;
    const category = req.query.category as string;

    let query = db.from('campus_issues').select('*').order('created_at', { ascending: false });

    if (studentId) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentId);
      if (isUuid) {
        query = query.eq('reported_by', studentId);
      }
    }
    if (status && status !== 'ALL') {
      query = query.eq('status', status);
    }
    if (category && category !== 'ALL') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ issues: data || [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch campus issues' });
  }
});

// POST /api/issues - Student files a campus issue / complaint
router.post('/', async (req, res) => {
  try {
    const { studentId, studentName, title, description, category, location, priority } = req.body;

    if (!title || !category || !location) {
      return res.status(400).json({ error: 'Title, category, and location are required' });
    }

    // Get count to generate ticket number like #SC-1024
    const { count } = await db.from('campus_issues').select('id', { count: 'exact', head: true });
    const ticketNumber = `SC-${1020 + (count || 0) + 1}`;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentId);
    const targetReporter = isUuid ? studentId : 'a13698dc-ee1d-4d73-9302-b68e1df153cc';

    const newIssue = {
      ticket_id: ticketNumber,
      reported_by: targetReporter,
      title,
      description: description || '',
      category,
      priority: priority || 'Medium',
      status: 'REPORTED',
      created_at: new Date().toISOString()
    };

    const { data, error } = await db.from('campus_issues').insert(newIssue).select().single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Log to issue_updates
    try {
      await db.from('issue_updates').insert({
        issue_id: data.id,
        status: 'REPORTED',
        updated_by: studentName || 'Abhishek Gupta',
        note: 'Issue reported by student',
        created_at: new Date().toISOString()
      });
    } catch (_) {}

    // Notify admins
    const { data: admins } = await db.from('profiles').select('id').eq('role', 'admin');
    if (admins) {
      for (const a of admins) {
        await createNotification(
          a.id,
          'issue_reported',
          `New Campus Issue #${ticketNumber}`,
          `${category} issue at ${location}: "${title}". Reported by ${studentName || 'Student'}.`,
          '/admin'
        );
      }
    }

    // Notify the student of ticket creation
    if (studentId) {
      await createNotification(
        studentId,
        'issue_created',
        `Ticket #${ticketNumber} Created`,
        `Your complaint regarding "${title}" has been registered. Our facilities team will review it shortly.`,
        '/issues'
      );
    }

    res.json({
      issue: data,
      message: `Issue ticket #${ticketNumber} created successfully.`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to file issue' });
  }
});

// PATCH /api/issues/:id/status - Admin updates status / assigns staff / resolves issue
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, resolutionNote, updatedBy } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updates: Record<string, any> = {
      status,
      updated_at: new Date().toISOString()
    };
    if (assignedTo !== undefined) updates.assigned_to = assignedTo;
    if (resolutionNote !== undefined) updates.resolution_note = resolutionNote;

    const { data, error } = await db
      .from('campus_issues')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Log update
    try {
      await db.from('issue_updates').insert({
        issue_id: id,
        status,
        updated_by: updatedBy || 'Campus Administrator',
        note: resolutionNote || `Status updated to ${status}${assignedTo ? ` (Assigned to ${assignedTo})` : ''}`,
        created_at: new Date().toISOString()
      });
    } catch (_) {}

    // Notify student
    if (data.student_id) {
      const ticket = data.ticket_number || `#SC-${data.id.slice(0, 5)}`;
      await createNotification(
        data.student_id,
        'issue_status_change',
        `Issue ${ticket} Status: ${status}`,
        `Your complaint "${data.title}" is now ${status}.${resolutionNote ? ` Note: ${resolutionNote}` : ''}`,
        '/issues'
      );
    }

    res.json({
      issue: data,
      message: `Issue status updated to ${status}`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update issue status' });
  }
});

// GET /api/issues/:id/updates - Issue audit history
router.get('/:id/updates', async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await db
      .from('issue_updates')
      .select('*')
      .eq('issue_id', id)
      .order('created_at', { ascending: true });

    res.json({ updates: data || [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch issue updates' });
  }
});

export default router;
