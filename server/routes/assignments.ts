import { Router } from 'express';
import { db, createNotification } from '../db';

const router = Router();

// GET /api/assignments - List assignments
router.get('/', async (req, res) => {
  try {
    const studentId = req.query.studentId as string;
    const { data: assignments, error } = await db
      .from('assignments')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // If studentId provided, attach submission status
    let submissionsMap: Record<string, any> = {};
    if (studentId) {
      const { data: submissions } = await db
        .from('assignment_submissions')
        .select('*')
        .eq('student_id', studentId);

      (submissions || []).forEach((s) => {
        submissionsMap[s.assignment_id] = s;
      });
    }

    const formatted = (assignments || []).map((a) => {
      const sub = submissionsMap[a.id];
      return {
        id: a.id,
        title: a.title,
        subject: a.subject,
        faculty: a.faculty_name || 'Prof. Rajesh Sharma',
        dueDate: a.due_date,
        totalMarks: a.total_marks || 20,
        description: a.description,
        isSubmitted: !!sub,
        submission: sub || null,
        marksObtained: sub?.marks_obtained ?? null,
        status: sub ? (sub.marks_obtained !== null ? 'Graded' : 'Submitted') : 'Pending'
      };
    });

    res.json({ assignments: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch assignments' });
  }
});

// POST /api/assignments - Faculty creates assignment
router.post('/', async (req, res) => {
  try {
    const { title, subject, dueDate, totalMarks, description, facultyName, facultyId } = req.body;
    if (!title || !subject || !dueDate) {
      return res.status(400).json({ error: 'Title, subject, and due date are required' });
    }

    const { data, error } = await db
      .from('assignments')
      .insert({
        title,
        description: description || '',
        due_date: dueDate,
        max_marks: totalMarks ? parseInt(totalMarks, 10) : 20,
        faculty_id: facultyId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(facultyId) ? facultyId : '8a8b13d6-4444-4222-8111-a88888888888'
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Notify students
    const { data: students } = await db.from('profiles').select('id').eq('role', 'student');
    if (students) {
      for (const s of students) {
        await createNotification(
          s.id,
          'assignment_new',
          `New Assignment: ${title}`,
          `${subject} assignment has been posted. Due date: ${dueDate}.`,
          '/assignments'
        );
      }
    }

    res.json({ assignment: data, message: 'Assignment created successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create assignment' });
  }
});

// POST /api/assignments/:id/submit - Student submits assignment
router.post('/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, fileUrl, notes, studentName } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required' });
    }

    // Check if assignment exists
    const { data: assignment } = await db.from('assignments').select('*').eq('id', id).single();
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Insert or update submission
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentId);
    const targetStudentId = isUuid ? studentId : 'a13698dc-ee1d-4d73-9302-b68e1df153cc';

    const { data, error } = await db
      .from('assignment_submissions')
      .upsert({
        assignment_id: id,
        student_id: targetStudentId,
        file_url: fileUrl || 'https://sathaye.ac.in/submissions/assignment_doc.pdf',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Notify student
    await createNotification(
      studentId,
      'assignment_submitted',
      `Submitted: ${assignment.title}`,
      `Your submission for ${assignment.subject} has been recorded successfully.`
    );

    res.json({ submission: data, message: 'Assignment submitted successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit assignment' });
  }
});

// GET /api/assignments/:id/submissions - Faculty views submissions
router.get('/:id/submissions', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await db
      .from('assignment_submissions')
      .select('*')
      .eq('assignment_id', id)
      .order('submitted_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ submissions: data || [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch submissions' });
  }
});

// POST /api/assignments/submissions/:id/grade - Faculty grades submission
router.post('/submissions/:id/grade', async (req, res) => {
  try {
    const { id } = req.params;
    const { marks, feedback, facultyName } = req.body;

    if (marks === undefined || marks === null) {
      return res.status(400).json({ error: 'Marks are required' });
    }

    const { data, error } = await db
      .from('assignment_submissions')
      .update({
        marks: parseInt(marks, 10),
        feedback: feedback || 'Well done'
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Notify the student
    if (data.student_id) {
      await createNotification(
        data.student_id,
        'assignment_graded',
        'Assignment Graded',
        `Your submission has been graded. Marks: ${marks}. Feedback: ${feedback || 'Good effort.'}`
      );
    }

    res.json({ submission: data, message: 'Grading saved successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to grade submission' });
  }
});

export default router;
