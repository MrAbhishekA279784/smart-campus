import React, { useState } from 'react';
import {
  Home,
  Calendar,
  Users,
  FileText,
  BookOpen,
  User,
  Bell,
  Search,
  CheckCircle,
  Clock,
  Download,
  Plus,
  ArrowLeft,
  ChevronRight,
  LogOut,
  Settings,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CURRENT_FACULTY } from '../../data/mockData';

export const FacultyMobileDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'timetable' | 'students' | 'assignments' | 'resources' | 'profile'>('home');
  const [selectedDay, setSelectedDay] = useState('Tue');
  const [activeDivision, setActiveDivision] = useState('TY B.Sc. IT (Div A)');
  const [attendanceRecorded, setAttendanceRecorded] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col justify-between shadow-2xl relative border-x border-slate-200">
      
      {/* Dynamic Content based on activeTab */}
      <div className="flex-1 overflow-y-auto pb-20">
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="p-4 space-y-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">Smart Sathey Campus</h3>
                  <p className="text-[9px] font-semibold text-slate-400">SATHAYE COLLEGE, MUMBAI</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                </button>
                <img
                  src={CURRENT_FACULTY.avatarUrl}
                  alt={CURRENT_FACULTY.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
              </div>
            </div>

            {/* Greeting */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Good Morning, Dr. Mehta! 👋
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">Inspire. Educate. Empower.</p>
              </div>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-xl border border-blue-100">
                Tue, 26 Aug
              </span>
            </div>

            {/* Quote banner */}
            <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
              <p className="text-xs italic text-slate-700 font-serif leading-relaxed">
                “Education is not preparation for life; education is life itself.”
              </p>
              <p className="text-[10px] font-semibold text-slate-400 mt-1">— John Dewey</p>
            </div>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">42</h3>
                  <p className="text-[10px] font-medium text-slate-500">Students</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">4</h3>
                  <p className="text-[10px] font-medium text-slate-500">Classes Today</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">7</h3>
                  <p className="text-[10px] font-medium text-slate-500">Pending Evals</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">78%</h3>
                  <p className="text-[10px] font-medium text-slate-500">Avg. Score</p>
                </div>
              </div>
            </div>

            {/* Today's Schedule Card */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">Today's Schedule</h3>
                <button
                  onClick={() => setActiveTab('timetable')}
                  className="text-[11px] text-blue-600 font-semibold cursor-pointer"
                >
                  View All →
                </button>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-900">09:00 – 10:00 AM</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-full">
                    Ongoing
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Data Structures</h4>
                  <p className="text-[10px] text-slate-500">TY B.Sc. IT (Div A) • Room 204</p>
                </div>
                <button
                  onClick={() => setAttendanceRecorded(!attendanceRecorded)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  {attendanceRecorded ? '✓ Attendance Recorded (38/42)' : 'Mark Attendance'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TIMETABLE */}
        {activeTab === 'timetable' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between pt-1">
              <h2 className="text-base font-bold text-slate-900">My Timetable</h2>
              <span className="text-xs font-semibold text-blue-600">Aug 2026</span>
            </div>

            {/* Day Selector */}
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {[
                { day: 'Mon', date: '24' },
                { day: 'Tue', date: '26' },
                { day: 'Wed', date: '27' },
                { day: 'Thu', date: '28' },
                { day: 'Fri', date: '29' }
              ].map((d) => (
                <button
                  key={d.day}
                  onClick={() => setSelectedDay(d.day)}
                  className={`py-2 rounded-xl flex flex-col items-center transition-all cursor-pointer ${
                    selectedDay === d.day
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-[10px]">{d.day}</span>
                  <span className="text-xs">{d.date}</span>
                </button>
              ))}
            </div>

            {/* Timetable List */}
            <div className="space-y-2.5">
              {[
                { time: '09:00 – 10:00 AM', name: 'Data Structures', classGroup: 'TY B.Sc. IT (Div A)', room: 'Room 204 | Main Building', status: 'Ongoing', color: 'bg-emerald-100 text-emerald-800' },
                { time: '10:15 – 11:15 AM', name: 'Object Oriented Programming', classGroup: 'SY B.Sc. IT (Div B)', room: 'Room 301 | IT Block', status: 'Upcoming', color: 'bg-blue-100 text-blue-800' },
                { time: '12:30 – 01:30 PM', name: 'Database Management Systems', classGroup: 'TY B.Sc. IT (Div A)', room: 'Room 204 | Main Building', status: 'Upcoming', color: 'bg-slate-100 text-slate-700' },
                { time: '02:00 – 03:00 PM', name: 'Seminar / Faculty Meeting', classGroup: 'Computer Science Dept', room: 'Seminar Hall', status: 'Upcoming', color: 'bg-slate-100 text-slate-700' }
              ].map((slot, i) => (
                <div key={i} className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{slot.time}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${slot.color}`}>
                      {slot.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{slot.name}</h4>
                  <p className="text-[11px] text-slate-500">{slot.classGroup}</p>
                  <p className="text-[10px] text-slate-400">{slot.room}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STUDENTS */}
        {activeTab === 'students' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between pt-1">
              <h2 className="text-base font-bold text-slate-900">My Students</h2>
              <Search className="w-4 h-4 text-slate-400" />
            </div>

            {/* Division Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {['TY B.Sc. IT (Div A)', 'SY B.Sc. IT (Div B)', 'TY CS'].map((div) => (
                <button
                  key={div}
                  onClick={() => setActiveDivision(div)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
                    activeDivision === div
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {div}
                </button>
              ))}
            </div>

            {/* Summary strip */}
            <div className="grid grid-cols-3 gap-2 p-2.5 bg-white rounded-2xl border border-slate-200 text-center">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Total</p>
                <p className="text-sm font-black text-slate-800">42</p>
              </div>
              <div>
                <p className="text-[10px] text-emerald-600 font-semibold">Present</p>
                <p className="text-sm font-black text-emerald-600">38</p>
              </div>
              <div>
                <p className="text-[10px] text-rose-600 font-semibold">Absent</p>
                <p className="text-sm font-black text-rose-600">4</p>
              </div>
            </div>

            {/* Students List */}
            <div className="space-y-2">
              {[
                { name: 'Aarav Sharma', roll: '244101', status: 'Present', pct: '85%' },
                { name: 'Priya Kulkarni', roll: '244102', status: 'Present', pct: '92%' },
                { name: 'Rohan Mehta', roll: '244103', status: 'Present', pct: '78%' },
                { name: 'Sneha Klitre', roll: '244104', status: 'Absent', pct: '-' },
                { name: 'Vishal Patil', roll: '244105', status: 'Present', pct: '88%' },
                { name: 'Isha Nair', roll: '244106', status: 'Present', pct: '91%' }
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                      {s.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                      <p className="text-[10px] text-slate-500">
                        {s.roll} •{' '}
                        <span className={s.status === 'Present' ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                          {s.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{s.pct}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between pt-1">
              <h2 className="text-base font-bold text-slate-900">Assignments</h2>
              <button className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center cursor-pointer">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Linked List Implementation', class: 'TY B.Sc. IT (Div A)', submitted: '12/42', due: '29 Aug 2026', left: '3 days left', color: 'bg-rose-50 text-rose-700' },
                { title: 'Database Mini Project', class: 'TY B.Sc. IT (Div A)', submitted: '5/42', due: '5 Sep 2026', left: '10 days left', color: 'bg-amber-50 text-amber-700' },
                { title: 'OOPs Assignment 1', class: 'SY B.Sc. IT (Div B)', submitted: '18/38', due: '7 Sep 2026', left: '12 days left', color: 'bg-blue-50 text-blue-700' },
                { title: 'Class Test – Unit 2', class: 'TY B.Sc. IT (Div A)', submitted: '0/42', due: '10 Sep 2026', left: '17 days left', color: 'bg-purple-50 text-purple-700' }
              ].map((assn, i) => (
                <div key={i} className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{assn.title}</h4>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${assn.color}`}>
                      {assn.left}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{assn.class}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>Due: {assn.due}</span>
                    <span className="font-bold text-slate-700">{assn.submitted} Submitted</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: RESOURCES */}
        {activeTab === 'resources' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between pt-1">
              <h2 className="text-base font-bold text-slate-900">Study Materials</h2>
              <Search className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-2.5">
              {[
                { title: 'Data Structures – Unit 1 Notes', type: 'PDF • 2.4 MB', date: '25 Aug 2026' },
                { title: 'OOPs – Concepts & Practice', type: 'PPT • 5.1 MB', date: '22 Aug 2026' },
                { title: 'DBMS – ER Diagrams Reference', type: 'PDF • 1.8 MB', date: '20 Aug 2026' },
                { title: 'Operating Systems – Full Notes', type: 'PDF • 3.2 MB', date: '18 Aug 2026' },
                { title: 'Previous Year Question Papers', type: 'ZIP • 12.4 MB', date: '15 Aug 2026' }
              ].map((mat, i) => (
                <div key={i} className="p-3 bg-white rounded-xl border border-slate-200/90 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{mat.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{mat.type} • {mat.date}</p>
                  </div>
                  <button className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PROFILE */}
        {activeTab === 'profile' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between pt-1">
              <h2 className="text-base font-bold text-slate-900">My Profile</h2>
              <Settings className="w-4 h-4 text-slate-400" />
            </div>

            <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col items-center text-center space-y-3">
              <img
                src={CURRENT_FACULTY.avatarUrl}
                alt={CURRENT_FACULTY.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-sm"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{CURRENT_FACULTY.name}</h3>
                <p className="text-xs text-blue-600 font-semibold">{CURRENT_FACULTY.designation}</p>
                <p className="text-[11px] text-slate-500">{CURRENT_FACULTY.department}</p>
              </div>

              <div className="w-full pt-3 border-t border-slate-100 text-left space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Employee ID</span>
                  <p className="font-semibold text-slate-800">{CURRENT_FACULTY.employeeId}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Email</span>
                  <p className="font-semibold text-slate-800">{CURRENT_FACULTY.email}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Subjects Handled</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {CURRENT_FACULTY.subjects.map((sub) => (
                      <span key={sub} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full py-2.5 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Navigation matching fac_phone.png */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around z-30">
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'timetable', label: 'Timetable', icon: Calendar },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'assignments', label: 'Assignments', icon: FileText },
          { id: 'resources', label: 'Resources', icon: BookOpen },
          { id: 'profile', label: 'Profile', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
};
