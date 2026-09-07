import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  FileText,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Upload,
  Clock,
  ChevronRight,
  Bell,
  Sun,
  Search,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Settings,
  LogOut,
  FolderOpen,
  Plus,
  Send,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CURRENT_FACULTY } from '../../data/mockData';
import { api } from '../../lib/api';

export const FacultyDesktopDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const facultyId = user?.id || 'fa101111-2222-3333-4444-555566667777';
  const facultyName = user?.name || 'Dr. R. Mehta';

  const [activeSection, setActiveSection] = useState<'dashboard' | 'timetable' | 'attendance' | 'assignments' | 'materials'>('dashboard');
  const [selectedClass, setSelectedClass] = useState('Data Structures');

  // Timetable
  const [scheduleList, setScheduleList] = useState<any[]>([]);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  // Assignments & Submissions
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignSubject, setNewAssignSubject] = useState('Data Structures');
  const [newAssignDesc, setNewAssignDesc] = useState('');
  const [newAssignDueDate, setNewAssignDueDate] = useState('');
  const [newAssignMarks, setNewAssignMarks] = useState(20);

  // Grading
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
  const [gradeMarks, setGradeMarks] = useState<number>(18);
  const [gradeFeedback, setGradeFeedback] = useState('');

  // Study Materials
  const [materials, setMaterials] = useState<any[]>([]);
  const [showUploadMaterialModal, setShowUploadMaterialModal] = useState(false);
  const [matTitle, setMatTitle] = useState('');
  const [matSubject, setMatSubject] = useState('Data Structures');
  const [matFileUrl, setMatFileUrl] = useState('');

  const loadFacultyData = () => {
    api.faculty.getSchedule(facultyId).then((res) => {
      if (res?.schedule) setScheduleList(res.schedule);
    }).catch(console.warn);

    api.assignments.list().then((res) => {
      if (res?.assignments) setAssignments(res.assignments);
    }).catch(console.warn);

    api.academics.getMaterials().then((res) => {
      if (res?.materials) setMaterials(res.materials);
    }).catch(console.warn);
  };

  useEffect(() => {
    loadFacultyData();
  }, [facultyId]);

  const loadSubmissions = (assignId: string) => {
    api.faculty.getSubmissions(assignId).then((res) => {
      if (res?.submissions) setSubmissions(res.submissions);
    }).catch(console.warn);
  };

  const handleSelectAssignment = (assign: any) => {
    setSelectedAssignment(assign);
    loadSubmissions(assign.id);
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignTitle.trim()) return;

    try {
      await api.faculty.createAssignment({
        title: newAssignTitle,
        subject: newAssignSubject,
        description: newAssignDesc,
        dueDate: newAssignDueDate || '2026-09-15',
        totalMarks: Number(newAssignMarks) || 20,
        facultyId,
        facultyName
      });
      alert('Assignment published successfully to student portals!');
      setShowCreateAssignmentModal(false);
      setNewAssignTitle('');
      setNewAssignDesc('');
      loadFacultyData();
    } catch (err: any) {
      alert(err.message || 'Failed to create assignment');
    }
  };

  const handleGradeSubmission = async (subId: string) => {
    try {
      await api.faculty.gradeSubmission(subId, {
        marks: Number(gradeMarks),
        feedback: gradeFeedback,
        gradedBy: facultyName
      });
      alert('Marks and feedback recorded successfully!');
      setGradingSubmissionId(null);
      if (selectedAssignment) loadSubmissions(selectedAssignment.id);
    } catch (err: any) {
      alert(err.message || 'Failed to record grade');
    }
  };

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim()) return;

    try {
      await api.faculty.uploadMaterial({
        title: matTitle,
        subject: matSubject,
        fileUrl: matFileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: facultyName
      });
      alert('Study material uploaded and shared with students!');
      setShowUploadMaterialModal(false);
      setMatTitle('');
      setMatFileUrl('');
      loadFacultyData();
    } catch (err: any) {
      alert(err.message || 'Failed to upload material');
    }
  };

  const handleRecordClassAttendance = async () => {
    try {
      await api.faculty.recordAttendance({
        courseId: 'DATA_STRUCTURES',
        date: new Date().toISOString().split('T')[0],
        records: [
          { studentId: 'db49e49e-6575-47ce-8c4e-77fbe86c5284', status: 'PRESENT' }
        ]
      });
      setAttendanceMarked(true);
      alert('Class attendance recorded and synced to central database!');
    } catch (err: any) {
      alert(err.message || 'Failed to record attendance');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex">
      {/* Left Sidebar matching fac_desktop.png */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 tracking-tight leading-tight">Smart Sathaye Campus</h2>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider">FACULTY PORTAL</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Faculty Dashboard', icon: GraduationCap },
              { id: 'timetable', label: 'My Timetable', icon: Calendar },
              { id: 'attendance', label: 'Attendance Desk', icon: CheckCircle2 },
              { id: 'assignments', label: 'Assignments & Grading', icon: FileText },
              { id: 'materials', label: 'Study Materials & Notes', icon: BookOpen }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom sketch & quote card */}
        <div className="p-4 border-t border-slate-100">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 p-3.5 border border-slate-200/80 mb-3">
            <p className="text-[11px] italic text-slate-600 font-serif leading-snug">
              “Teachers plant seeds of knowledge that grow forever.”
            </p>
            <p className="text-[10px] font-semibold text-slate-400 mt-1.5">— Sathaye College</p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="relative w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students, subjects, submissions..."
              className="w-full pl-10 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <img
                src={CURRENT_FACULTY.avatarUrl}
                alt={CURRENT_FACULTY.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div className="text-left leading-tight hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{CURRENT_FACULTY.name}</p>
                <p className="text-[10px] text-slate-500">{CURRENT_FACULTY.department}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Welcome Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                Good Morning, {CURRENT_FACULTY.name}! <span className="text-2xl">👋</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Faculty Academic Suite • Autonomous Sathaye College</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">Tuesday, 26 August 2026</p>
                <p className="text-[11px] text-slate-500 font-medium">Semester I • Computer Science & IT</p>
              </div>

              <div className="max-w-xs bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 hidden lg:block">
                <p className="text-[11px] italic text-emerald-950 font-serif leading-tight">
                  “Education is not preparation for life; education is life itself.”
                </p>
                <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">— John Dewey</p>
              </div>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Students Taught</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">42</h3>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">TY B.Sc. IT (Div A)</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Lectures Scheduled</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{scheduleList.length || 4}</h3>
                <p className="text-[11px] text-blue-600 font-semibold mt-1">Room 204 & Lab 3</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Active Courseworks</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{assignments.length}</h3>
                <button
                  onClick={() => setActiveSection('assignments')}
                  className="text-[11px] text-rose-600 font-semibold hover:underline mt-1 cursor-pointer"
                >
                  Grade Submissions →
                </button>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Average Class Score</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">78%</h3>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">↑ +5% over Mid-Term</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* VIEW: DASHBOARD OVERVIEW */}
          {activeSection === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Schedule & Attendance */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Today's Schedule</h3>
                  <button
                    onClick={() => setActiveSection('timetable')}
                    className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    Full Timetable →
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="bg-blue-50/70 border border-blue-200/90 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-900">09:00 – 10:00 AM</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        Ongoing
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Data Structures & Algorithms</h4>
                      <p className="text-[11px] text-slate-500">TY B.Sc. IT (Div A)</p>
                      <p className="text-[10px] text-slate-400">Room 204 | Main Building</p>
                    </div>
                    <button
                      onClick={handleRecordClassAttendance}
                      className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        attendanceMarked
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      {attendanceMarked ? '✓ Attendance Recorded (40/42 Present)' : 'Take Class Attendance'}
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">10:15 – 11:15 AM</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Upcoming</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">Advanced Java & OOP Lab</h4>
                    <p className="text-[11px] text-slate-500">SY B.Sc. IT (Lab 3)</p>
                  </div>
                </div>
              </div>

              {/* My Classes */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">My Subject Classes</h3>
                <div className="space-y-2.5">
                  {[
                    { code: 'DS', name: 'Data Structures', classGroup: 'TY B.Sc. IT (Div A)', count: 42, color: 'bg-blue-100 text-blue-700' },
                    { code: 'OOP', name: 'Object Oriented Programming', classGroup: 'SY B.Sc. IT (Div B)', count: 38, color: 'bg-purple-100 text-purple-700' },
                    { code: 'DB', name: 'Database Systems', classGroup: 'TY B.Sc. IT (Div A)', count: 40, color: 'bg-emerald-100 text-emerald-700' }
                  ].map((cls) => (
                    <div
                      key={cls.code}
                      onClick={() => setSelectedClass(cls.name)}
                      className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50 flex items-center justify-between transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${cls.color}`}>
                          {cls.code}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{cls.name}</h4>
                          <p className="text-[11px] text-slate-500">{cls.classGroup}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-600">{cls.count} Students</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Academic Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowCreateAssignmentModal(true)}
                    className="p-3 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-left transition-all cursor-pointer"
                  >
                    <Plus className="w-5 h-5 text-blue-600 mb-1" />
                    <p className="text-xs font-bold text-slate-900">New Assignment</p>
                    <p className="text-[10px] text-slate-500">Publish task to portal</p>
                  </button>

                  <button
                    onClick={() => setShowUploadMaterialModal(true)}
                    className="p-3 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-left transition-all cursor-pointer"
                  >
                    <Upload className="w-5 h-5 text-emerald-600 mb-1" />
                    <p className="text-xs font-bold text-slate-900">Upload Notes</p>
                    <p className="text-[10px] text-slate-500">Share PDF/slides</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ASSIGNMENTS & EVALUATION */}
          {activeSection === 'assignments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Assignment Desk & Submissions Evaluation</h2>
                  <p className="text-xs text-slate-500">Review student solutions, award marks, and provide constructive evaluation feedback</p>
                </div>
                <button
                  onClick={() => setShowCreateAssignmentModal(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Assignment</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Assignments list */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Coursework List</h3>
                  <div className="space-y-2">
                    {assignments.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => handleSelectAssignment(a)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          selectedAssignment?.id === a.id
                            ? 'border-blue-500 bg-blue-50/50'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-blue-600">{a.subject}</span>
                          <span className="text-[10px] text-slate-400">Due: {a.due_date}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">{a.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Total Marks: {a.total_marks || 20}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Submissions evaluation */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
                  {selectedAssignment ? (
                    <>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <h3 className="font-bold text-base text-slate-900">{selectedAssignment.title}</h3>
                          <p className="text-xs text-slate-500">{selectedAssignment.subject} • Due {selectedAssignment.due_date}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                          {submissions.length} Submissions
                        </span>
                      </div>

                      {submissions.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-xs">
                          No student submissions yet for this coursework.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {submissions.map((sub) => (
                            <div key={sub.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-slate-900">{sub.student_name || 'Student'}</span>
                                {sub.marks !== null ? (
                                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                                    Graded: {sub.marks}/{selectedAssignment.total_marks || 20}
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                                    Needs Grading
                                  </span>
                                )}
                              </div>

                              {sub.file_url && (
                                <p className="text-xs text-blue-600 font-mono">
                                  🔗 <a href={sub.file_url} target="_blank" rel="noreferrer" className="hover:underline">{sub.file_url}</a>
                                </p>
                              )}
                              {sub.notes && (
                                <p className="text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">
                                  "{sub.notes}"
                                </p>
                              )}

                              {sub.feedback && (
                                <p className="text-[11px] text-emerald-700 font-medium">
                                  Feedback: {sub.feedback}
                                </p>
                              )}

                              {gradingSubmissionId === sub.id ? (
                                <div className="pt-2 border-t border-slate-200 space-y-2">
                                  <div className="flex gap-3">
                                    <div className="w-32">
                                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Marks (out of {selectedAssignment.total_marks || 20})</label>
                                      <input
                                        type="number"
                                        value={gradeMarks}
                                        onChange={(e) => setGradeMarks(Number(e.target.value))}
                                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Feedback</label>
                                      <input
                                        type="text"
                                        value={gradeFeedback}
                                        onChange={(e) => setGradeFeedback(e.target.value)}
                                        placeholder="e.g. Clean solution, optimize binary search tree..."
                                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => setGradingSubmissionId(null)}
                                      className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleGradeSubmission(sub.id)}
                                      className="px-3.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                                    >
                                      Submit Grade
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setGradingSubmissionId(sub.id);
                                    setGradeMarks(sub.marks || 18);
                                    setGradeFeedback(sub.feedback || '');
                                  }}
                                  className="mt-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs cursor-pointer"
                                >
                                  {sub.marks !== null ? 'Update Grade & Feedback' : 'Grade Submission'}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-16 text-center text-slate-400 text-xs">
                      Select an assignment on the left to review student submissions.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: STUDY MATERIALS */}
          {activeSection === 'materials' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Study Materials & Notes Repository</h2>
                  <p className="text-xs text-slate-500">Official syllabus notes, lab manuals, and sample question banks for students</p>
                </div>
                <button
                  onClick={() => setShowUploadMaterialModal(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload New Material</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materials.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{m.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{m.subject}</p>
                      <a
                        href={m.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 mt-2"
                      >
                        <span>View Resource</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: TIMETABLE */}
          {activeSection === 'timetable' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">My Teaching Timetable</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Time</th>
                      <th className="p-3">Course / Subject</th>
                      <th className="p-3">Class & Section</th>
                      <th className="p-3">Room & Block</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scheduleList.map((slot, idx) => (
                      <tr key={slot.id || idx} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {slot.start_time?.slice(0, 5)} – {slot.end_time?.slice(0, 5)}
                        </td>
                        <td className="p-3 font-bold text-blue-600">{slot.subject}</td>
                        <td className="p-3">{slot.class_name || 'TY B.Sc. IT'}</td>
                        <td className="p-3">Room {slot.room_number || '204'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Create Assignment Modal */}
          {showCreateAssignmentModal && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <form onSubmit={handleCreateAssignment} className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Publish New Assignment</h3>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={newAssignSubject}
                    onChange={(e) => setNewAssignSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Data Structures">Data Structures</option>
                    <option value="Object Oriented Programming">Object Oriented Programming</option>
                    <option value="Database Management Systems">Database Management Systems</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Assignment Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Implement AVL Tree with Rotations"
                    value={newAssignTitle}
                    onChange={(e) => setNewAssignTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newAssignDueDate}
                    onChange={(e) => setNewAssignDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={newAssignMarks}
                    onChange={(e) => setNewAssignMarks(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Task Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="Provide detailed instructions and evaluation rubrics..."
                    value={newAssignDesc}
                    onChange={(e) => setNewAssignDesc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateAssignmentModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Publish Coursework
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Upload Material Modal */}
          {showUploadMaterialModal && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <form onSubmit={handleUploadMaterial} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Upload Study Material</h3>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={matSubject}
                    onChange={(e) => setMatSubject(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Resource Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unit 3: Graph Algorithms Notes"
                    value={matTitle}
                    onChange={(e) => setMatTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Document Link / Drive URL</label>
                  <input
                    type="text"
                    placeholder="https://drive.google.com/..."
                    value={matFileUrl}
                    onChange={(e) => setMatFileUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadMaterialModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Upload Document
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
