import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  GraduationCap,
  FileText,
  CreditCard,
  Bell,
  ShieldCheck,
  BarChart3,
  Settings,
  Search,
  CheckCircle2,
  Clock,
  LogOut,
  AlertCircle,
  Check,
  Send,
  ChevronRight,
  BookOpen,
  Wrench,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CURRENT_ADMIN } from '../../data/mockData';
import { api } from '../../lib/api';
import { AdminCampusMapOccupancy } from './AdminCampusMapOccupancy';
import { AdminTimetableEngine } from './AdminTimetableEngine';
import { AdminAuditLogs } from './AdminAuditLogs';

interface ApprovalItem {
  id: string;
  type: string;
  applicant: string;
  info: string;
  date: string;
  status: 'PENDING' | 'APPROVED';
}

export const AdminDesktopDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'issues' | 'notices' | 'finance'>('overview');

  // Real live metrics
  const [metrics, setMetrics] = useState({
    totalStudents: 3850,
    totalFaculty: 142,
    attendancePercent: 88.4,
    pendingApprovals: 9,
    openComplaints: 0,
    upcomingEvents: 3
  });

  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    { id: 'app-1', type: 'Bonafide Certificate', applicant: 'Abhishek Gupta', info: 'FY B.Sc. IT • Passport verification', date: 'Today, 10:15 AM', status: 'PENDING' },
    { id: 'app-2', type: 'Medical Leave', applicant: 'Priya Kulkarni', info: 'TY B.Sc. CS • 3 Days Medical', date: 'Today, 09:30 AM', status: 'PENDING' },
    { id: 'app-3', type: 'Faculty Duty Leave', applicant: 'Dr. R. Mehta', info: 'CS Dept • National AI Conference', date: 'Yesterday', status: 'PENDING' },
    { id: 'app-4', type: 'Library Budget Clearance', applicant: 'Sneha Lokhande', info: 'Book Procurement FY 26-27', date: '24 Aug 2026', status: 'PENDING' }
  ]);

  // Notice Broadcast
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  // Campus Issues / Facilities
  const [campusIssues, setCampusIssues] = useState<any[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('Campus Electrician Desk');
  const [isUpdatingIssue, setIsUpdatingIssue] = useState(false);

  // Users Directory
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('student');
  const [newUserCourse, setNewUserCourse] = useState('FY B.Sc. IT');

  const loadData = () => {
    api.admin.getDashboard().then((res) => {
      if (res?.metrics) setMetrics(res.metrics as any);
    }).catch(console.warn);

    api.admin.getAnnouncements().then((res) => {
      if (res?.announcements) setAnnouncements(res.announcements);
    }).catch(console.warn);

    api.issues.list().then((res) => {
      if (res?.issues) setCampusIssues(res.issues);
    }).catch(console.warn);

    api.admin.getUsers(userRoleFilter).then((res) => {
      if (res?.users) setUsersList(res.users);
    }).catch(console.warn);
  };

  useEffect(() => {
    loadData();
  }, [userRoleFilter]);

  const handleApprove = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'APPROVED' } : a))
    );
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    setIsBroadcasting(true);
    try {
      await api.notifications.broadcast({
        title: broadcastTitle,
        message: broadcastMessage
      });
      setBroadcastSent(true);
      setBroadcastTitle('');
      setBroadcastMessage('');
      loadData();
      setTimeout(() => setBroadcastSent(false), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to broadcast notice');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleUpdateIssueStatus = async (status: string) => {
    if (!selectedIssue) return;
    setIsUpdatingIssue(true);
    try {
      await api.issues.updateStatus(selectedIssue.id, {
        status,
        assignedTo: assignedStaff,
        resolutionNote,
        updatedBy: 'Dean of Administration'
      });
      alert(`Issue #${selectedIssue.ticket_number} marked ${status}! Student has been notified.`);
      setSelectedIssue(null);
      setResolutionNote('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update issue');
    } finally {
      setIsUpdatingIssue(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    try {
      await api.admin.createUser({
        fullName: newUserName,
        email: newUserEmail,
        role: newUserRole,
        course: newUserCourse,
        rollNumber: `2410${Math.floor(10 + Math.random() * 90)}`
      });
      alert(`User ${newUserName} successfully added!`);
      setShowAddUserModal(false);
      setNewUserName('');
      setNewUserEmail('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create user');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex">
      {/* Left Sidebar matching admin.png */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 tracking-tight leading-tight">Smart Sathaye Campus</h2>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider">ADMIN COMMAND CENTER</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'overview', label: 'College Overview', icon: Building2 },
              { id: 'map', label: 'Campus Map & Occupancy', icon: BarChart3 },
              { id: 'timetable', label: 'Timetable Creator & Engine', icon: Clock },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'issues', label: 'Campus Grievances & AC/IT', icon: Wrench },
              { id: 'notices', label: 'Notices & Broadcasts', icon: Bell },
              { id: 'finance', label: 'Fee Collection & Finance', icon: CreditCard },
              { id: 'audit', label: 'System Audit Logs', icon: ShieldCheck }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
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

        {/* Bottom MLK Quote */}
        <div className="p-4 border-t border-slate-100">
          <div className="rounded-2xl bg-gradient-to-b from-indigo-50/70 to-slate-100 p-3.5 border border-indigo-100 mb-3">
            <p className="text-[11px] italic text-slate-700 font-serif leading-snug">
              “The function of education is to teach one to think intensively and critically.”
            </p>
            <p className="text-[10px] font-semibold text-indigo-700 mt-1.5">— Martin Luther King Jr.</p>
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

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="relative w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search student profiles, faculty IDs, circulars..."
              className="w-full pl-10 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 px-1 py-0.2 bg-rose-500 text-[9px] font-bold text-white rounded-full">
                {campusIssues.filter((i) => i.status !== 'RESOLVED').length}
              </span>
            </button>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-700 text-white font-bold flex items-center justify-center text-xs">
                SD
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{CURRENT_ADMIN.name}</p>
                <p className="text-[10px] text-slate-500">{CURRENT_ADMIN.designation}</p>
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
                Good Morning, Dean Deshpande! <span className="text-2xl">👋</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Autonomous College Administration & Facilities Oversight</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">Tuesday, 26 August 2026</p>
                <p className="text-[11px] text-indigo-700 font-bold">Academic Year 2026-27 • NAAC A+</p>
              </div>

              <div className="max-w-xs bg-indigo-50/80 border border-indigo-200/80 rounded-xl p-2.5 hidden lg:block">
                <p className="text-[11px] italic text-indigo-950 font-serif leading-tight">
                  “Leadership and learning are indispensable to each other.”
                </p>
                <p className="text-[10px] text-indigo-700 font-semibold mt-0.5">— John F. Kennedy</p>
              </div>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Enrolled Students</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.totalStudents.toLocaleString()}</h3>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">Active verified accounts</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Teaching Faculty</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.totalFaculty}</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Full-time & Visiting</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Average Attendance</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.attendancePercent}%</h3>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">Healthy campus engagement</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Open Grievances / Issues</p>
                <h3 className="text-2xl font-black text-rose-600 mt-1">{campusIssues.filter((i) => i.status !== 'RESOLVED').length}</h3>
                <p className="text-[11px] text-rose-600 font-bold mt-1">AC, plumbing & IT tickets</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* VIEW 1: OVERVIEW */}
          {activeSection === 'overview' && (
            <>
              {/* Departmental Table */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Departmental Academic Performance</h3>
                    <p className="text-[11px] text-slate-500">Overview of student enrollment and staff distribution</p>
                  </div>
                  <button className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer">
                    Full Academic Report →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px]">
                        <th className="pb-3 pl-2">Department Name</th>
                        <th className="pb-3">Head of Department</th>
                        <th className="pb-3">Total Students</th>
                        <th className="pb-3">Faculty Count</th>
                        <th className="pb-3">Avg. Attendance</th>
                        <th className="pb-3 pr-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { dept: 'Computer Science & IT', hod: 'Dr. R. Mehta', students: '480', faculty: '18', att: '89.2%' },
                        { dept: 'Commerce & Accountancy', hod: 'Prof. A. Joshi', students: '1,240', faculty: '36', att: '87.5%' },
                        { dept: 'Science & Physics', hod: 'Dr. V. Kulkarni', students: '620', faculty: '24', att: '91.0%' },
                        { dept: 'Arts & Humanities', hod: 'Dr. S. Gadgil', students: '780', faculty: '28', att: '86.4%' },
                        { dept: 'Management Studies (BMS)', hod: 'Prof. N. Patil', students: '350', faculty: '14', att: '88.0%' }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 pl-2 font-bold text-slate-900">{row.dept}</td>
                          <td className="py-3 text-slate-700">{row.hod}</td>
                          <td className="py-3 font-semibold text-slate-800">{row.students}</td>
                          <td className="py-3 text-slate-600">{row.faculty}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px] font-bold">
                              {row.att}
                            </span>
                          </td>
                          <td className="py-3 pr-2 text-right">
                            <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3 Columns: Approvals Queue, Notice Broadcast, Finance */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Approvals */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Pending Approvals</h3>
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full">
                      {approvals.filter((a) => a.status === 'PENDING').length} Actionable
                    </span>
                  </div>

                  <div className="space-y-3">
                    {approvals.map((app) => (
                      <div key={app.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{app.type}</span>
                          <span className="text-[10px] text-slate-400">{app.date}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-700">{app.applicant}</p>
                        <p className="text-[10px] text-slate-500">{app.info}</p>

                        {app.status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <Check className="w-3.5 h-3.5" /> Approved
                          </span>
                        ) : (
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => handleApprove(app.id)}
                              className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
                            >
                              Approve
                            </button>
                            <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100 cursor-pointer">
                              Review
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Broadcast notice */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Publish Campus Notice</h3>

                  <form onSubmit={handleSendBroadcast} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Notice Title..."
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <textarea
                      rows={3}
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      placeholder="Draft announcement to all students & staff..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                    />

                    <button
                      type="submit"
                      disabled={isBroadcasting}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isBroadcasting ? 'Broadcasting...' : 'Broadcast Notice'}</span>
                    </button>
                  </form>

                  {broadcastSent && (
                    <p className="text-xs font-bold text-emerald-600 p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                      Notice successfully broadcasted to all campus portals!
                    </p>
                  )}
                </div>

                {/* Fee Health */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Fee Collection Overview</h3>
                    <span className="text-xs font-semibold text-slate-400">FY 2026-27</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                      <span className="text-[11px] font-semibold text-emerald-800">Total Fees Collected</span>
                      <h4 className="text-xl font-black text-emerald-950 mt-0.5">₹4.82 Crores</h4>
                      <p className="text-[10px] text-emerald-700 font-bold mt-1">88% of target achieved</p>
                    </div>

                    <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl">
                      <span className="text-[11px] font-semibold text-rose-800">Outstanding Fees Pending</span>
                      <h4 className="text-xl font-black text-rose-950 mt-0.5">₹65.4 Lakhs</h4>
                      <p className="text-[10px] text-rose-700 font-bold mt-1">428 installment reminders sent</p>
                    </div>

                    <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl">
                      <span className="text-[11px] font-semibold text-indigo-800">Scholarships Disbursed</span>
                      <h4 className="text-xl font-black text-indigo-950 mt-0.5">₹24.8 Lakhs</h4>
                      <p className="text-[10px] text-indigo-700 font-bold mt-1">112 meritorious students</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* VIEW 2: CAMPUS ISSUES & GRIEVANCES MANAGEMENT */}
          {activeSection === 'issues' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Campus Facilities & Grievance Tickets</h2>
                  <p className="text-xs text-slate-500">Live tickets filed by students for AC, fans, plumbing, and IT equipment</p>
                </div>
                <button
                  onClick={loadData}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Refresh Tickets
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Ticket #</th>
                      <th className="p-3">Title & Location</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Reported By</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {campusIssues.map((iss) => (
                      <tr key={iss.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-blue-600">#{iss.ticket_number || 'SC-1024'}</td>
                        <td className="p-3">
                          <p className="font-bold text-slate-900">{iss.title}</p>
                          <p className="text-[11px] text-slate-500">📍 {iss.location}</p>
                        </td>
                        <td className="p-3 font-medium">{iss.category}</td>
                        <td className="p-3 text-slate-600">{iss.student_name || 'Student'}</td>
                        <td className="p-3">
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
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedIssue(iss);
                              setResolutionNote(iss.resolution_notes || '');
                            }}
                            className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs cursor-pointer"
                          >
                            Manage Ticket
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Issue Management Modal */}
              {selectedIssue && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900">Manage Ticket #{selectedIssue.ticket_number}</h3>
                    <div className="p-3 rounded-xl bg-slate-50 text-xs space-y-1">
                      <p><span className="font-bold text-slate-700">Issue:</span> {selectedIssue.title}</p>
                      <p><span className="font-bold text-slate-700">Location:</span> {selectedIssue.location}</p>
                      <p><span className="font-bold text-slate-700">Category:</span> {selectedIssue.category}</p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Assign Maintenance Team</label>
                      <select
                        value={assignedStaff}
                        onChange={(e) => setAssignedStaff(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                      >
                        <option value="Campus Electrician Desk">Campus Electrician Desk</option>
                        <option value="HVAC & AC Service Unit">HVAC & AC Service Unit</option>
                        <option value="Cleanliness & Sanitation Staff">Cleanliness & Sanitation Staff</option>
                        <option value="IT Hardware & Projectors Wing">IT Hardware & Projectors Wing</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Resolution / Progress Notes</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Technician deployed, replacement capacitor installed..."
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedIssue(null)}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
                      >
                        Close
                      </button>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={isUpdatingIssue}
                          onClick={() => handleUpdateIssueStatus('IN_PROGRESS')}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                        >
                          Mark In Progress
                        </button>
                        <button
                          type="button"
                          disabled={isUpdatingIssue}
                          onClick={() => handleUpdateIssueStatus('RESOLVED')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                        >
                          Mark Resolved ✓
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: USER MANAGEMENT */}
          {activeSection === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">User Registry</h2>
                  <p className="text-xs text-slate-500">Students, faculty members, and campus administrative staff</p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add New User</span>
                </button>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                {['all', 'student', 'faculty', 'admin', 'canteen_staff', 'library_staff'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      userRoleFilter === r
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Users table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Department / Course</th>
                      <th className="p-3">Roll / ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{u.full_name || u.name}</td>
                        <td className="p-3 text-slate-600">{u.email}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold capitalize">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3">{u.course || u.department || 'N/A'}</td>
                        <td className="p-3 font-mono text-slate-500">{u.roll_number || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add User Modal */}
              {showAddUserModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <form onSubmit={handleCreateUser} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900">Add New User</h3>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">College Email</label>
                      <input
                        type="email"
                        required
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Role</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Administrator</option>
                        <option value="canteen_staff">Canteen Staff</option>
                        <option value="library_staff">Library Staff</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Course / Dept</label>
                      <input
                        type="text"
                        value={newUserCourse}
                        onChange={(e) => setNewUserCourse(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddUserModal(false)}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs cursor-pointer"
                      >
                        Save User
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* VIEW: CAMPUS MAP & OCCUPANCY */}
          {activeSection === 'map' && <AdminCampusMapOccupancy />}

          {/* VIEW: TIMETABLE ENGINE */}
          {activeSection === 'timetable' && <AdminTimetableEngine />}

          {/* VIEW: SYSTEM AUDIT LOGS */}
          {activeSection === 'audit' && <AdminAuditLogs />}
        </main>
      </div>
    </div>
  );
};
