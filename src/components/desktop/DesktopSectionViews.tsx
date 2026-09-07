import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Utensils,
  Award,
  Bell,
  User,
  Star,
  Plus,
  Minus,
  Bookmark,
  FileText,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Send,
  MapPin,
  HelpCircle,
  Filter,
  Check,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DesktopNavSection, StudentProfile } from '../../types';
import { api } from '../../lib/api';
import { DemoPaymentModal } from '../common/DemoPaymentModal';
import { useAuth } from '../../context/AuthContext';

interface DesktopSectionViewsProps {
  section: DesktopNavSection;
  student: StudentProfile;
  onBackToDashboard: () => void;
  onOpenDigitalId: () => void;
}

export const DesktopSectionViews: React.FC<DesktopSectionViewsProps> = ({
  section,
  student,
  onBackToDashboard,
  onOpenDigitalId,
}) => {
  const { user } = useAuth();
  const studentId = user?.id || 'db49e49e-6575-47ce-8c4e-77fbe86c5284';
  const studentName = user?.name || 'Abhishek Gupta';

  // Sub-section states
  const [activeTab, setActiveTab] = useState<string>('overview');

  // ==========================================
  // 1. TIMETABLE & ACADEMICS
  // ==========================================
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [timetable, setTimetable] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoadingAcademics, setIsLoadingAcademics] = useState(false);

  useEffect(() => {
    if (section === 'timetable' || section === 'academics') {
      setIsLoadingAcademics(true);
      Promise.all([
        api.academics.getTimetable(selectedDay),
        api.academics.getMaterials()
      ])
        .then(([ttRes, matRes]) => {
          setTimetable(ttRes.timetable || []);
          setMaterials(matRes.materials || []);
        })
        .catch(console.warn)
        .finally(() => setIsLoadingAcademics(false));
    }
  }, [section, selectedDay]);

  // ==========================================
  // 2. ATTENDANCE VIEW
  // ==========================================
  const [attendanceData, setAttendanceData] = useState<{
    summary: { totalClasses: number; presentCount: number; absentCount: number; percentage: number };
    subjectBreakdown: Record<string, { present: number; total: number }>;
    recentRecords: any[];
  } | null>(null);

  useEffect(() => {
    if (section === 'attendance') {
      api.academics.getAttendance(studentId)
        .then(setAttendanceData)
        .catch(console.warn);
    }
  }, [section, studentId]);

  // ==========================================
  // 3. ASSIGNMENTS VIEW
  // ==========================================
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAssignments = () => {
    api.assignments.list(studentId)
      .then((res) => setAssignments(res.assignments || []))
      .catch(console.warn);
  };

  useEffect(() => {
    if (section === 'assignments') {
      loadAssignments();
    }
  }, [section, studentId]);

  const handleSubmitAssignment = async (assignmentId: string) => {
    if (!submissionUrl.trim() && !submissionNote.trim()) {
      alert('Please enter a submission URL or notes');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.assignments.submit(assignmentId, {
        studentId,
        studentName,
        fileUrl: submissionUrl,
        notes: submissionNote
      });
      alert('Assignment submitted successfully!');
      setSubmittingAssignmentId(null);
      setSubmissionNote('');
      setSubmissionUrl('');
      loadAssignments();
    } catch (err: any) {
      alert(err.message || 'Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // 4. EVENTS VIEW
  // ==========================================
  const [events, setEvents] = useState<any[]>([]);
  const [eventFilter, setEventFilter] = useState('All');
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

  const loadEvents = () => {
    api.events.list(studentId)
      .then((res) => setEvents(res.events || []))
      .catch(console.warn);
  };

  useEffect(() => {
    if (section === 'events') {
      loadEvents();
    }
  }, [section, studentId]);

  const handleRegisterEvent = async (event: any) => {
    setLoadingEventId(event.id);
    try {
      if (event.isRegistered) {
        await api.events.cancel(event.id, studentId);
      } else {
        await api.events.register(event.id, {
          studentId,
          studentName,
          studentRoll: '241023'
        });
      }
      loadEvents();
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setLoadingEventId(null);
    }
  };

  // ==========================================
  // 5. SMART CANTEEN VIEW
  // ==========================================
  const [canteenMenu, setCanteenMenu] = useState<any[]>([]);
  const [canteenCategory, setCanteenCategory] = useState('All');
  const [canteenCart, setCanteenCart] = useState<Record<string, number>>({});
  const [studentOrders, setStudentOrders] = useState<any[]>([]);
  const [activeOrderToken, setActiveOrderToken] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const loadCanteen = () => {
    api.canteen.getMenu(canteenCategory)
      .then((res) => setCanteenMenu(res.menu || []))
      .catch(console.warn);

    api.canteen.getStudentOrders(studentId)
      .then((res) => setStudentOrders(res.orders || []))
      .catch(console.warn);
  };

  useEffect(() => {
    if (section === 'canteen') {
      loadCanteen();
    }
  }, [section, canteenCategory, studentId]);

  const updateCart = (itemId: string, delta: number) => {
    setCanteenCart((prev) => {
      const current = prev[itemId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const cartTotal = Object.entries(canteenCart).reduce((sum: number, [itemId, qty]: [string, any]) => {
    const item = canteenMenu.find((m) => m.id === itemId);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const desktopCartItemsList = Object.entries(canteenCart).map(([itemId, qty]) => {
    const item = canteenMenu.find((m) => m.id === itemId);
    return {
      id: itemId,
      name: item?.name || 'Canteen Item',
      price: item?.price || 0,
      quantity: qty as number,
    };
  });

  const handleConfirmDesktopOrder = async (payMethod: string): Promise<string | number> => {
    const items = Object.entries(canteenCart).map(([itemId, quantity]) => ({ itemId, quantity: quantity as number }));
    const res = await api.canteen.placeOrder({
      studentId,
      studentName,
      items,
      paymentMethod: payMethod
    });
    setActiveOrderToken(res.tokenNumber);
    setCanteenCart({});
    loadCanteen();
    return res.tokenNumber;
  };

  // ==========================================
  // 6. CENTRAL LIBRARY VIEW
  // ==========================================
  const [books, setBooks] = useState<any[]>([]);
  const [bookQuery, setBookQuery] = useState('');
  const [bookCategory, setBookCategory] = useState('All');
  const [myLoans, setMyLoans] = useState<any[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqAuthor, setReqAuthor] = useState('');
  const [reqType, setReqType] = useState<'procurement' | 'complaint'>('procurement');
  const [reqNotes, setReqNotes] = useState('');

  const loadLibrary = () => {
    api.library.getBooks(bookQuery, bookCategory)
      .then((res) => setBooks(res.books || []))
      .catch(console.warn);

    api.library.getStudentLoans(studentId)
      .then((res) => setMyLoans(res.loans || []))
      .catch(console.warn);
  };

  useEffect(() => {
    if (section === 'library') {
      loadLibrary();
    }
  }, [section, bookCategory, studentId]);

  const handleSearchBooks = (e: React.FormEvent) => {
    e.preventDefault();
    loadLibrary();
  };

  const handleReserveBook = async (book: any) => {
    if ((book.available_copies ?? 0) <= 0) {
      alert('Sorry, no copies currently available.');
      return;
    }
    try {
      await api.library.issueBook({
        bookId: book.id,
        studentId,
        studentName,
        studentRoll: '241023'
      });
      alert(`Book "${book.title}" issued! Please collect from the Issue Desk.`);
      loadLibrary();
    } catch (err: any) {
      alert(err.message || 'Failed to reserve book');
    }
  };

  const handleSubmitLibraryRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim()) return;

    try {
      await api.library.submitRequest({
        studentId,
        studentName,
        title: reqTitle,
        author: reqAuthor,
        type: reqType,
        notes: reqNotes
      });
      alert('Your request has been submitted to the Library Committee.');
      setShowRequestModal(false);
      setReqTitle('');
      setReqAuthor('');
      setReqNotes('');
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    }
  };

  // ==========================================
  // 7. COMPLAINTS & CAMPUS ISSUES
  // ==========================================
  const [issues, setIssues] = useState<any[]>([]);
  const [issueTitle, setIssueTitle] = useState('');
  const [issueCategory, setIssueCategory] = useState('AC & Cooling');
  const [issueLocation, setIssueLocation] = useState('Room 204, Main Building');
  const [issueDescription, setIssueDescription] = useState('');
  const [isFilingIssue, setIsFilingIssue] = useState(false);

  const loadIssues = () => {
    api.issues.list({ studentId })
      .then((res) => setIssues(res.issues || []))
      .catch(console.warn);
  };

  useEffect(() => {
    if (section === 'report-issue') {
      loadIssues();
    }
  }, [section, studentId]);

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim()) return;

    setIsFilingIssue(true);
    try {
      const res = await api.issues.create({
        studentId,
        studentName,
        title: issueTitle,
        category: issueCategory,
        location: issueLocation,
        description: issueDescription,
        priority: 'MEDIUM'
      });
      alert(`Issue #${res.issue?.ticket_number || 'SC-1024'} filed successfully! Admin has been notified.`);
      setIssueTitle('');
      setIssueDescription('');
      loadIssues();
    } catch (err: any) {
      alert(err.message || 'Failed to file complaint');
    } finally {
      setIsFilingIssue(false);
    }
  };

  // ==========================================
  // 8. LOST & FOUND
  // ==========================================
  const [lostFoundItems, setLostFoundItems] = useState<any[]>([]);
  const [lfType, setLfType] = useState('all');
  const [showLfModal, setShowLfModal] = useState(false);
  const [lfTitle, setLfTitle] = useState('');
  const [lfCategory, setLfCategory] = useState('Electronics');
  const [lfLocation, setLfLocation] = useState('IT Block Lab 3');
  const [lfDescription, setLfDescription] = useState('');
  const [lfItemType, setLfItemType] = useState<'lost' | 'found'>('lost');

  const loadLostFound = () => {
    api.lostFound.list(lfType)
      .then((res) => setLostFoundItems(res.items || []))
      .catch(console.warn);
  };

  useEffect(() => {
    if (section === 'lost-found') {
      loadLostFound();
    }
  }, [section, lfType]);

  const handleReportLostFound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lfTitle.trim()) return;

    try {
      const res = await api.lostFound.report({
        title: lfTitle,
        category: lfCategory,
        location: lfLocation,
        description: lfDescription,
        type: lfItemType,
        reporterId: studentId,
        reporterName: studentName
      });
      alert(res.message || 'Item reported successfully!');
      setShowLfModal(false);
      setLfTitle('');
      setLfDescription('');
      loadLostFound();
    } catch (err: any) {
      alert(err.message || 'Failed to report item');
    }
  };

  // ==========================================
  // 9. NOTIFICATIONS VIEW
  // ==========================================
  const [notifications, setNotifications] = useState<any[]>([]);

  const loadNotifications = () => {
    api.notifications.list(studentId)
      .then((res) => setNotifications(res.notifications || []))
      .catch(console.warn);
  };

  useEffect(() => {
    if (section === 'notifications') {
      loadNotifications();
    }
  }, [section, studentId]);

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead(studentId);
      loadNotifications();
    } catch (err) {
      console.warn(err);
    }
  };

  // ==========================================
  // SECTION RENDER ROUTING
  // ==========================================

  // --- 1. TIMETABLE & ACADEMICS ---
  if (section === 'timetable' || section === 'academics') {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {section === 'timetable' ? 'Official College Timetable' : 'Academics & Study Materials'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              FY B.Sc. IT • Semester I • Sathaye College (Autonomous), Vile Parle
            </p>
          </div>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            ← Back to Overview
          </button>
        </div>

        {/* Day selector pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDay === day
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Schedule list */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Schedule for {selectedDay}</h3>
            <span className="text-xs text-slate-400 font-medium">Real-time room availability</span>
          </div>

          {timetable.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No lectures scheduled for {selectedDay}. Enjoy your study break!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">Course / Subject</th>
                    <th className="p-3">Faculty</th>
                    <th className="p-3">Room & Block</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {timetable.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-semibold text-slate-900">
                        {item.start_time?.slice(0, 5)} – {item.end_time?.slice(0, 5)}
                      </td>
                      <td className="p-3 font-bold text-slate-900">{item.subject}</td>
                      <td className="p-3">{item.faculty_name}</td>
                      <td className="p-3">
                        Room {item.room_number} <span className="text-slate-300">|</span> {item.building_name}
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold border border-blue-200">
                          Confirmed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Study Materials section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base mb-4">Course Notes & Practical Manuals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {materials.map((mat) => (
              <div key={mat.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{mat.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{mat.subject} • {mat.uploaded_by}</p>
                  <a
                    href={mat.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 mt-2"
                  >
                    <span>Download PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 2. ATTENDANCE ---
  if (section === 'attendance') {
    const summary = attendanceData?.summary || { totalClasses: 27, presentCount: 24, absentCount: 3, percentage: 89 };
    const breakdown = attendanceData?.subjectBreakdown || {
      'Data Structures': { present: 14, total: 15 },
      'Database Management Systems': { present: 11, total: 12 },
      'Applied Mathematics': { present: 9, total: 10 },
      'Computer Networks': { present: 8, total: 10 }
    };

    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Attendance Record</h1>
            <p className="text-xs text-slate-500 mt-1">Official registry maintained by faculty & automated RFID desks</p>
          </div>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            ← Back to Overview
          </button>
        </div>

        {/* Overall Meter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full border-8 border-emerald-500 flex items-center justify-center shrink-0">
              <span className="text-2xl font-extrabold text-slate-900">{summary.percentage}%</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Overall Attendance</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-0.5">Compliant (&gt; 75% threshold)</p>
              <p className="text-xs text-slate-400 mt-2">
                {summary.presentCount} of {summary.totalClasses} lectures attended
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500">Lectures Attended</span>
            <div className="text-3xl font-extrabold text-slate-900">{summary.presentCount}</div>
            <span className="text-xs text-slate-400">Total sessions held: {summary.totalClasses}</span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500">Excused / Absent</span>
            <div className="text-3xl font-extrabold text-rose-500">{summary.absentCount}</div>
            <span className="text-xs text-slate-400">Allowed unexcused: 6</span>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base mb-5">Subject-Wise Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(breakdown).map(([subject, stats]: [string, any]) => {
              const pct = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 100;
              return (
                <div key={subject} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{subject}</h4>
                      <p className="text-xs text-slate-500">{stats.present} / {stats.total} sessions</p>
                    </div>
                    <span className={`text-sm font-extrabold ${pct >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- 3. ASSIGNMENTS ---
  if (section === 'assignments') {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Coursework & Assignments</h1>
            <p className="text-xs text-slate-500 mt-1">Submit practical tasks, view faculty evaluations and grades</p>
          </div>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            ← Back to Overview
          </button>
        </div>

        {/* Assignments list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((assign) => (
            <div
              key={assign.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                    {assign.subject}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Due: {assign.due_date}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 mt-3">{assign.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{assign.description}</p>
              </div>

              {/* Status & Action */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {assign.isSubmitted ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{assign.marks ? `Graded: ${assign.marks}/${assign.total_marks || 20}` : 'Submitted (Under Review)'}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-rose-500 font-bold">Pending Submission</span>
                  )}
                </div>

                {!assign.isSubmitted && (
                  <button
                    onClick={() => setSubmittingAssignmentId(assign.id)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Submit Work
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submission Modal */}
        {submittingAssignmentId && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Submit Assignment</h3>
              <p className="text-xs text-slate-500">Provide GitHub repo link, Google Drive link, or write your solution notes below.</p>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Project / File URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/yourname/data-structures-lab"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Submission Notes & Implementation Details</label>
                <textarea
                  rows={4}
                  placeholder="Briefly describe your approach and results..."
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setSubmittingAssignmentId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmitAssignment(submittingAssignmentId)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm Submission'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- 4. EVENTS ---
  if (section === 'events') {
    const categories = ['All', 'Cultural', 'Technical', 'Sports', 'Academic'];
    const filteredEvents = eventFilter === 'All' ? events : events.filter((e) => e.category === eventFilter);

    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Campus Events & Festivals</h1>
            <p className="text-xs text-slate-500 mt-1">Official registrations for cultural, academic and sports fests</p>
          </div>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            ← Back to Overview
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setEventFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                eventFilter === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const isReg = evt.isRegistered;
            const isLoading = loadingEventId === evt.id;

            return (
              <div
                key={evt.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="relative h-44">
                  <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                    {evt.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{evt.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{evt.subtitle}</p>
                    <div className="mt-3 space-y-1 text-xs text-slate-600 font-medium">
                      <p>📅 {evt.date} • {evt.time || '10:00 AM'}</p>
                      <p>📍 {evt.venue}</p>
                      <p className="text-[11px] text-slate-400">Organized by {evt.organizedBy}</p>
                    </div>

                    {/* Capacity status */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span>Delegates Registered</span>
                        <span className="font-bold">{evt.registeredCount} / {evt.capacity}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${Math.min(100, (evt.registeredCount / evt.capacity) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={isLoading}
                    onClick={() => handleRegisterEvent(evt)}
                    className={`mt-5 w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer ${
                      isReg
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isLoading ? 'Processing...' : isReg ? 'Cancel Registration' : 'Register for Pass'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- 5. CANTEEN ---
  if (section === 'canteen') {
    const categories = ['All', 'South Indian', 'Meals & Thali', 'Snacks', 'Beverages'];
    const filteredMenu = canteenCategory === 'All' ? canteenMenu : canteenMenu.filter((m) => m.category === canteenCategory);

    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sathaye College Smart Canteen</h1>
            <p className="text-xs text-slate-500 mt-1">Order ahead, skip the line & track live preparation status</p>
          </div>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            ← Back to Overview
          </button>
        </div>

        {/* Live Active Order Token Notice */}
        {activeOrderToken && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                #
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Active Order Token: {activeOrderToken}</h4>
                <p className="text-xs text-blue-700 mt-0.5">Please check the display screen near Counter 1.</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs">
              Preparing
            </span>
          </div>
        )}

        {/* Category filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCanteenCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  canteenCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cart Counter */}
          {Object.keys(canteenCart).length > 0 && (
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-800">
                {Object.values(canteenCart).reduce((a: number, b: number) => a + b, 0)} items | ₹{cartTotal}
              </span>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1"
              >
                <span>Checkout & Pay</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item) => {
            const countInCart = canteenCart[item.id] || 0;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm p-4 flex gap-4 items-center justify-between"
              >
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{item.name}</h4>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">₹ {item.price}</p>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-800">{item.rating}</span>
                    <span>({item.ratingCount})</span>
                  </div>
                </div>

                {countInCart === 0 ? (
                  <button
                    disabled={!item.isAvailable}
                    onClick={() => updateCart(item.id, 1)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs cursor-pointer ${
                      item.isAvailable
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {item.isAvailable ? 'Add +' : 'Sold Out'}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => updateCart(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-slate-900 px-1">{countInCart}</span>
                    <button
                      onClick={() => updateCart(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs hover:bg-blue-700 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Past Orders table */}
        {studentOrders.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-4">My Orders History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Token</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {studentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-blue-600">#{ord.token_number}</td>
                      <td className="p-3 font-medium">{ord.items_summary}</td>
                      <td className="p-3 font-bold text-slate-900">₹ {ord.total_amount}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            ord.status === 'READY'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ord.status === 'PREPARING'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : ord.status === 'COMPLETED'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{ord.created_at?.split('T')[1]?.slice(0, 5) || 'Recent'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Demo Payment Modal */}
        <DemoPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          items={desktopCartItemsList}
          totalAmount={cartTotal}
          studentId={studentId}
          studentName={studentName}
          onConfirmOrder={handleConfirmDesktopOrder}
        />
      </div>
    );
  }

  // --- 6. LIBRARY ---
  if (section === 'library') {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sathaye Central Library</h1>
            <p className="text-xs text-slate-500 mt-1">Catalog search, book borrowing, renewals and procurement requests</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              + Request Book / Issue Desk
            </button>
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              ← Back to Overview
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchBooks} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by book title, author, or ISBN..."
              value={bookQuery}
              onChange={(e) => setBookQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            Search Catalog
          </button>
        </form>

        {/* My Active Loans */}
        {myLoans.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-3">My Borrowed Books</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myLoans.map((loan) => (
                <div key={loan.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{loan.book_title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Due: {loan.due_date}</p>
                    {loan.isOverdue && (
                      <span className="text-[10px] font-bold text-rose-600 block mt-1">⚠️ Overdue! Please return to avoid fine.</span>
                    )}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold">
                    {loan.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Books Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <img
                src={book.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
                alt={book.title}
                className="w-16 h-22 rounded-lg object-cover shadow-2xs shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-900 leading-snug truncate">{book.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{book.author}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Shelf: {book.shelf_location || 'A-12'}</p>
                <span className="text-xs font-semibold text-emerald-600 mt-1 block">
                  Available ({book.available_copies ?? 3} copies)
                </span>
                <button
                  disabled={(book.available_copies ?? 0) <= 0}
                  onClick={() => handleReserveBook(book)}
                  className={`mt-2.5 px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                    (book.available_copies ?? 0) > 0
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {(book.available_copies ?? 0) > 0 ? 'Borrow Copy' : 'Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Procurement / Complaint Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <form onSubmit={handleSubmitLibraryRequest} className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Library Book Request / Desk Help</h3>
              <p className="text-xs text-slate-500">Request the library committee to procure new research books or report missing copies.</p>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="reqType"
                    checked={reqType === 'procurement'}
                    onChange={() => setReqType('procurement')}
                  />
                  <span>Book Procurement</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="reqType"
                    checked={reqType === 'complaint'}
                    onChange={() => setReqType('complaint')}
                  />
                  <span>Library Complaint</span>
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Book Title / Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clean Architecture by Robert C. Martin"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Author / Edition</label>
                <input
                  type="text"
                  placeholder="e.g. Pearson 2nd Edition"
                  value={reqAuthor}
                  onChange={(e) => setReqAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notes / Justification</label>
                <textarea
                  rows={3}
                  placeholder="Required for final year project research..."
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Submit to Librarian
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // --- 7. COMPLAINTS & CAMPUS ISSUES ---
  if (section === 'report-issue') {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Campus Facilities & Grievances</h1>
            <p className="text-xs text-slate-500 mt-1">
              Direct ticket tracking with the Dean of Administration & Facilities Maintenance Team
            </p>
          </div>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            ← Back to Overview
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Issue Form */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Report New Issue</h3>
            <p className="text-xs text-slate-500">Report broken AC, projector faults, plumbing issues, or cleanliness problems.</p>

            <form onSubmit={handleReportIssue} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC 2 not cooling in Room 204"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={issueCategory}
                  onChange={(e) => setIssueCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="AC & Cooling">AC & Cooling</option>
                  <option value="Electrical">Electrical & Fans</option>
                  <option value="Cleanliness">Hygiene & Cleanliness</option>
                  <option value="Plumbing & Water">Plumbing & Water Coolers</option>
                  <option value="IT & Hardware">Projectors & IT Hardware</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Building 2nd Floor, Room 204"
                  value={issueLocation}
                  onChange={(e) => setIssueLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Provide any specific details..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isFilingIssue}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                {isFilingIssue ? 'Submitting...' : 'Submit Grievance Ticket'}
              </button>
            </form>
          </div>

          {/* Issues Ticket List */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-4">Tracked Campus Tickets</h3>

            {issues.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                No active complaints filed by you. Everything looks clean and operational!
              </div>
            ) : (
              <div className="space-y-4">
                {issues.map((iss) => (
                  <div key={iss.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600">
                          #{iss.ticket_number || 'SC-1024'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold">
                          {iss.category}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          iss.status === 'RESOLVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : iss.status === 'IN_PROGRESS'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {iss.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">{iss.title}</h4>
                    <p className="text-xs text-slate-500">📍 {iss.location}</p>

                    {iss.resolution_notes && (
                      <div className="mt-2 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-800">
                        <span className="font-bold">Maintenance Update:</span> {iss.resolution_notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- 8. LOST & FOUND ---
  if (section === 'lost-found') {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lost & Found Portal</h1>
            <p className="text-xs text-slate-500 mt-1">Smart cross-matching with security desk at Gymkhana & Library</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLfModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              + Report Lost / Found Item
            </button>
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              ← Back to Overview
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          {['all', 'lost', 'found'].map((t) => (
            <button
              key={t}
              onClick={() => setLfType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                lfType === t
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t} Items
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lostFoundItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                    item.type === 'lost' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {item.type}
                </span>
                <span className="text-[11px] text-slate-400">{item.category}</span>
              </div>

              <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
              <p className="text-xs text-slate-400">📍 Found/Lost at: {item.location}</p>

              {item.status === 'OPEN' && (
                <button
                  onClick={async () => {
                    const proof = prompt('Enter proof of ownership details for security verification:');
                    if (!proof) return;
                    try {
                      await api.lostFound.claim(item.id, { claimantId: studentId, claimantName: studentName, proofDetails: proof });
                      alert('Claim submitted! Please verify with Gymkhana Security Desk.');
                      loadLostFound();
                    } catch (e: any) {
                      alert(e.message || 'Claim failed');
                    }
                  }}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  Claim This Item
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Report Modal */}
        {showLfModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <form onSubmit={handleReportLostFound} className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Report Item</h3>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="lftype"
                    checked={lfItemType === 'lost'}
                    onChange={() => setLfItemType('lost')}
                  />
                  <span>I Lost Something</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="lftype"
                    checked={lfItemType === 'found'}
                    onChange={() => setLfItemType('found')}
                  />
                  <span>I Found Something</span>
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blue HP Scientific Calculator"
                  value={lfTitle}
                  onChange={(e) => setLfTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={lfCategory}
                  onChange={(e) => setLfCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Electronics">Electronics & Gadgets</option>
                  <option value="ID Cards & Wallets">ID Cards & Wallets</option>
                  <option value="Books & Notes">Books & Notes</option>
                  <option value="Personal Items">Bottles & Accessories</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IT Block Lab 3, Row 2"
                  value={lfLocation}
                  onChange={(e) => setLfLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Any identifying markers, stickers, or brand..."
                  value={lfDescription}
                  onChange={(e) => setLfDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLfModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // --- 9. NOTIFICATIONS & CIRCULARS ---
  if (section === 'notifications') {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications & Notices</h1>
            <p className="text-xs text-slate-500 mt-1">Official circulars, reminders, and order alerts</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllRead}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Mark All as Read
            </button>
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              ← Back to Overview
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              All caught up! No unread notifications.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  n.is_read ? 'bg-white border-slate-200/80 text-slate-600' : 'bg-blue-50/50 border-blue-200 text-slate-900'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  n.is_read ? 'bg-slate-100 text-slate-500' : 'bg-blue-600 text-white shadow-xs'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                    {n.created_at?.split('T')[0]} • {n.created_at?.split('T')[1]?.slice(0, 5)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="p-8 max-w-3xl mx-auto text-center py-16 space-y-4">
      <h2 className="text-xl font-bold text-slate-900 capitalize">{section} Section</h2>
      <p className="text-sm text-slate-500">Connected to Sathaye College Student Portal backend.</p>
      <button
        onClick={onBackToDashboard}
        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm cursor-pointer"
      >
        Return to Dashboard
      </button>
    </div>
  );
};
