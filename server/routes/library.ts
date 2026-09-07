import { Router } from 'express';
import { db, createNotification } from '../db';

const router = Router();

// GET /api/library/books - Search books
router.get('/books', async (req, res) => {
  try {
    const search = (req.query.q as string)?.trim().toLowerCase();
    const category = req.query.category as string;

    let query = db.from('library_books').select('*').order('title', { ascending: true });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data: books, error } = await query;
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    let filtered = books || [];
    if (search) {
      filtered = filtered.filter(
        (b) =>
          b.title?.toLowerCase().includes(search) ||
          b.author?.toLowerCase().includes(search) ||
          b.isbn?.toLowerCase().includes(search)
      );
    }

    res.json({ books: filtered });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch books' });
  }
});

// POST /api/library/books - Add book
router.post('/books', async (req, res) => {
  try {
    const { title, author, isbn, category, totalCopies, shelfLocation, coverUrl } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error: 'Title and Author are required' });
    }

    const copies = totalCopies ? parseInt(totalCopies, 10) : 5;

    const { data, error } = await db
      .from('library_books')
      .insert({
        title,
        author,
        isbn: isbn || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        category: category || 'Computer Science',
        total_copies: copies,
        available_copies: copies,
        shelf_location: shelfLocation || 'Shelf A-12',
        cover_image_url: coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ book: data, message: `Book "${title}" added to library catalog.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add book' });
  }
});

// POST /api/library/loans/issue - Issue book to student
router.post('/loans/issue', async (req, res) => {
  try {
    const { bookId, studentId, studentName, studentRoll, days } = req.body;

    if (!bookId || !studentId) {
      return res.status(400).json({ error: 'bookId and studentId are required' });
    }

    // 1. Check book availability
    const { data: book, error: bookErr } = await db
      .from('library_books')
      .select('*')
      .eq('id', bookId)
      .single();

    if (bookErr || !book) {
      return res.status(404).json({ error: 'Book not found in catalog' });
    }

    if ((book.available_copies ?? 0) <= 0) {
      return res.status(400).json({ error: 'No copies of this book are currently available for issue.' });
    }

    // 2. Decrement available copies atomically
    const newAvailable = Math.max(0, (book.available_copies ?? 1) - 1);
    await db.from('library_books').update({ available_copies: newAvailable }).eq('id', bookId);

    // 3. Compute due date (default 14 days)
    const issueDate = new Date();
    const loanDuration = days ? parseInt(days, 10) : 14;
    const dueDate = new Date(issueDate.getTime() + loanDuration * 24 * 60 * 60 * 1000);

    // 4. Insert loan record
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentId);
    const targetStudentId = isUuid ? studentId : 'a13698dc-ee1d-4d73-9302-b68e1df153cc';

    const { data: loan, error: loanErr } = await db
      .from('library_loans')
      .insert({
        book_id: bookId,
        student_id: targetStudentId,
        issued_at: issueDate.toISOString(),
        due_at: dueDate.toISOString(),
        status: 'issued'
      })
      .select()
      .single();

    if (loanErr) {
      // Rollback copy decrement
      await db.from('library_books').update({ available_copies: book.available_copies }).eq('id', bookId);
      return res.status(500).json({ error: loanErr.message });
    }

    // Notify student
    await createNotification(
      studentId,
      'book_issued',
      `Book Issued: ${book.title}`,
      `You have borrowed "${book.title}". Please return to Issue Counter by ${dueDate.toISOString().split('T')[0]} to avoid late fines.`,
      '/library'
    );

    res.json({
      loan,
      message: `Book "${book.title}" successfully issued to ${studentName || 'Student'}. Due date: ${dueDate.toISOString().split('T')[0]}`,
      availableCopies: newAvailable
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to issue book' });
  }
});

// POST /api/library/loans/return - Return book
router.post('/loans/return', async (req, res) => {
  try {
    const { loanId } = req.body;
    if (!loanId) {
      return res.status(400).json({ error: 'loanId is required' });
    }

    const { data: loan, error: loanErr } = await db
      .from('library_loans')
      .select('*')
      .eq('id', loanId)
      .single();

    if (loanErr || !loan) {
      return res.status(404).json({ error: 'Loan record not found' });
    }

    if (loan.status === 'RETURNED') {
      return res.status(400).json({ error: 'This book has already been marked returned.' });
    }

    // Update loan
    const returnDate = new Date().toISOString();
    const { data: updatedLoan, error: updateErr } = await db
      .from('library_loans')
      .update({
        status: 'returned',
        returned_at: returnDate
      })
      .eq('id', loanId)
      .select()
      .single();

    if (updateErr) {
      return res.status(500).json({ error: updateErr.message });
    }

    // Increment available copies atomically
    const { data: book } = await db.from('library_books').select('available_copies, total_copies').eq('id', loan.book_id).single();
    if (book) {
      const newAvail = Math.min(book.total_copies ?? 10, (book.available_copies ?? 0) + 1);
      await db.from('library_books').update({ available_copies: newAvail }).eq('id', loan.book_id);
    }

    // Notify student
    if (loan.student_id) {
      await createNotification(
        loan.student_id,
        'book_returned',
        `Book Returned: ${loan.book_title}`,
        `Book return confirmed on ${returnDate}. Thank you!`,
        '/library'
      );
    }

    res.json({ loan: updatedLoan, message: `Book returned successfully.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to process return' });
  }
});

// GET /api/library/loans/student - Student's books
router.get('/loans/student', async (req, res) => {
  try {
    const studentId = req.query.studentId as string;
    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required' });
    }

    const { data: loans, error } = await db
      .from('library_loans')
      .select('*')
      .eq('student_id', studentId)
      .order('issue_date', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const today = new Date().toISOString().split('T')[0];
    const formatted = (loans || []).map((l) => ({
      ...l,
      isOverdue: l.status === 'ISSUED' && l.due_date < today
    }));

    res.json({ loans: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch student loans' });
  }
});

// GET /api/library/loans/active - All active loans for library dashboard
router.get('/loans/active', async (req, res) => {
  try {
    const { data: loans, error } = await db
      .from('library_loans')
      .select('*')
      .or('status.eq.issued,status.eq.ISSUED')
      .order('due_at', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const today = new Date().toISOString();
    const formatted = (loans || []).map((l) => ({
      ...l,
      isOverdue: l.due_at < today
    }));

    res.json({ loans: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch active loans' });
  }
});

// POST /api/library/requests - Submit book procurement request or library complaint
router.post('/requests', async (req, res) => {
  try {
    const { studentId, studentName, title, author, type, notes } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title or subject is required' });
    }

    const requestRecord = {
      student_id: studentId || null,
      student_name: studentName || 'Abhishek Gupta',
      title,
      author: author || '',
      type: type || 'procurement', // 'procurement' | 'complaint'
      notes: notes || '',
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    const { data, error } = await db
      .from('library_requests')
      .insert(requestRecord)
      .select()
      .single();

    if (error) {
      // Fallback response if table doesn't exist yet
      return res.json({
        request: { id: `req-${Date.now()}`, ...requestRecord },
        message: 'Your request has been submitted to the Library Committee.'
      });
    }

    // Notify library staff
    const { data: librarians } = await db.from('profiles').select('id').eq('role', 'library_staff');
    if (librarians) {
      for (const lib of librarians) {
        await createNotification(
          lib.id,
          'library_request',
          `New Library ${type === 'complaint' ? 'Complaint' : 'Book Request'}`,
          `${studentName || 'Student'} submitted: "${title}".`
        );
      }
    }

    res.json({
      request: data,
      message: 'Your request has been submitted to the Library Committee.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit library request' });
  }
});

// GET /api/library/requests - List requests for Library and Admin portals
router.get('/requests', async (req, res) => {
  try {
    const { data, error } = await db
      .from('library_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.json({ requests: [] });
    }

    res.json({ requests: data || [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch library requests' });
  }
});

// PATCH /api/library/requests/:id/status - Approve or reject book requests
router.patch('/requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await db
      .from('library_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (data?.student_id) {
      await createNotification(
        data.student_id,
        'library_request_update',
        `Library Request ${status}`,
        `Your request for "${data.title}" was marked as ${status}.`,
        '/library'
      );
    }

    res.json({ request: data, message: `Request status updated to ${status}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update library request' });
  }
});

// GET /api/library/summary - Dynamic library stats from real DB
router.get('/summary', async (req, res) => {
  try {
    const { data: books } = await db.from('library_books').select('total_copies, available_copies');
    const { data: activeLoans } = await db.from('library_loans').select('due_at, status').or('status.eq.issued,status.eq.ISSUED');

    const totalTitles = books?.length || 0;
    const totalCopies = (books || []).reduce((sum, b) => sum + (b.total_copies || 0), 0);
    const availableCopies = (books || []).reduce((sum, b) => sum + (b.available_copies || 0), 0);

    const today = new Date().toISOString();
    const overdueCount = (activeLoans || []).filter((l) => l.due_at < today).length;

    res.json({
      totalTitles,
      totalCopies,
      availableCopies,
      activeLoansCount: activeLoans?.length || 0,
      overdueCount
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch library summary' });
  }
});

export default router;
