import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Calendar as CalendarIcon,
  MoreVertical,
  FileText,
  BookOpen,
  FolderDown,
  GraduationCap,
  Award,
  Download,
  X,
  Upload,
  CheckCircle2,
  ExternalLink,
  Eye
} from 'lucide-react';
import { MOBILE_SCHEDULE } from '../../data/mockData';

interface MobileAcademicsProps {
  onBack: () => void;
}

export const MobileAcademics: React.FC<MobileAcademicsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'Timetable' | 'Assignments' | 'Exams' | 'Results'>('Timetable');
  const [activeDay, setActiveDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'>('Tue');

  // Interactive Modals
  const [modalResource, setModalResource] = useState<{ title: string; type: string; items: { name: string; size: string; link: string }[] } | null>(null);
  const [submitAssignment, setSubmitAssignment] = useState<{ id: string; subject: string; title: string } | null>(null);
  const [submittedIds, setSubmittedIds] = useState<Record<string, boolean>>({});
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState('');
  const [showHallTicket, setShowHallTicket] = useState(false);
  const [showTimetablePdf, setShowTimetablePdf] = useState(false);

  const tabs = ['Timetable', 'Assignments', 'Exams', 'Results'] as const;
  const days = [
    { day: 'Mon', date: '25' },
    { day: 'Tue', date: '26' },
    { day: 'Wed', date: '27' },
    { day: 'Thu', date: '28' },
    { day: 'Fri', date: '29' },
  ] as const;

  const openResourceModal = (type: string, title: string) => {
    let items = [
      { name: 'Unit 1 & 2 Complete Lecture Notes.pdf', size: '2.4 MB', link: '#' },
      { name: 'Data Structures Quick Revision Sheet.pdf', size: '1.1 MB', link: '#' },
      { name: 'Sathaye Autonomous Syllabus 2026.pdf', size: '850 KB', link: '#' },
    ];
    if (type === 'Syllabus') {
      items = [
        { name: 'FY BSC CS Semester I & II Detailed Syllabus.pdf', size: '1.8 MB', link: '#' },
        { name: 'Elective Subject Options 2026.pdf', size: '620 KB', link: '#' },
      ];
    } else if (type === 'Previous Papers') {
      items = [
        { name: 'Data Structures Oct 2025 Semester Paper.pdf', size: '3.1 MB', link: '#' },
        { name: 'DBMS Model Question Paper with Solutions.pdf', size: '2.9 MB', link: '#' },
      ];
    } else if (type === 'Study Material') {
      items = [
        { name: 'C++ STL Reference Guide for Labs.pdf', size: '4.2 MB', link: '#' },
        { name: 'Database Normalization Walkthrough.pdf', size: '1.5 MB', link: '#' },
      ];
    }
    setModalResource({ title, type, items });
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitAssignment) return;
    setSubmittedIds((prev) => ({ ...prev, [submitAssignment.id]: true }));
    setSubmissionSuccess('Assignment submitted successfully!');
    setTimeout(() => {
      setSubmitAssignment(null);
      setSubmissionSuccess('');
      setSubmissionUrl('');
    }, 1200);
  };

  return (
    <div id="mobile-academics-screen" className="pb-24 pt-2 bg-[#f8fafc] min-h-screen">
      {/* 1. Header Bar */}
      <div className="px-4 py-2 flex items-center justify-between bg-white border-b border-slate-200/80 sticky top-0 z-20">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-slate-900">Academics</h2>
        <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="px-4 py-3 bg-white border-b border-slate-200/60">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'Timetable' && (
        <div className="p-4 space-y-4">
          {/* Week Date Selector */}
          <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2 flex-1 justify-between pr-2">
              {days.map((item) => {
                const isSelected = activeDay === item.day;
                return (
                  <button
                    key={item.day}
                    onClick={() => setActiveDay(item.day as any)}
                    className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <span className="text-[11px] opacity-80 leading-none">{item.day}</span>
                    <span className="text-sm mt-1 leading-none">{item.date}</span>
                  </button>
                );
              })}
            </div>

            {/* Calendar Icon Button */}
            <div className="pl-2 border-l border-slate-200">
              <button
                onClick={() => setShowTimetablePdf(true)}
                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 text-blue-600 flex items-center justify-center"
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Classes Timeline list */}
          <div className="space-y-3 relative">
            <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-slate-200 pointer-events-none" />

            {MOBILE_SCHEDULE.map((cls) => {
              const isNow = cls.isNow;

              return (
                <div key={cls.id} className="relative flex items-start gap-3 pl-0">
                  <div className="relative z-10 mt-1.5 shrink-0">
                    {isNow ? (
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-300 ring-4 ring-white" />
                    )}
                  </div>

                  <div className="flex-1 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-400">
                          {cls.startTime} – {cls.endTime}
                        </span>
                        {isNow && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                            Now
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 mt-1">{cls.subject}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {cls.room} <span className="text-slate-300">|</span> {cls.building}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 mt-1">{cls.faculty}</p>
                    </div>

                    <button
                      onClick={() => openResourceModal('Notes', `${cls.subject} Resources`)}
                      className="text-slate-400 hover:text-blue-600 p-1"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View Full Timetable Button */}
          <button
            onClick={() => setShowTimetablePdf(true)}
            className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs text-center border border-blue-200/60 transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>View Full Semester Timetable</span>
          </button>

          {/* Study Resources Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xs text-slate-900">Study Resources</h3>
              <button
                onClick={() => openResourceModal('Study Material', 'All Campus Study Repositories')}
                className="text-[11px] font-semibold text-blue-600"
              >
                See All
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <button
                onClick={() => openResourceModal('Notes', 'Lecture Notes & Slides')}
                className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col items-center active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-slate-700">Notes</span>
              </button>

              <button
                onClick={() => openResourceModal('Syllabus', 'Course Syllabus Breakdown')}
                className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col items-center active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-slate-700">Syllabus</span>
              </button>

              <button
                onClick={() => openResourceModal('Previous Papers', 'Previous Year Question Papers')}
                className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col items-center active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5">
                  <FolderDown className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-slate-700">Previous Papers</span>
              </button>

              <button
                onClick={() => openResourceModal('Study Material', 'Digital Books & Question Banks')}
                className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col items-center active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-slate-700">Study Material</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'Assignments' && (
        <div className="p-4 space-y-3">
          {/* Assignment 1 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                Due in 2 days
              </span>
              <span className="text-xs text-slate-400">Data Structures</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 mt-2">Binary Search Tree Implementation</h4>
            <p className="text-xs text-slate-500 mt-1">Submit clean C++ code with complexity documentation.</p>
            {submittedIds['asgn-1'] ? (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Submitted on Time</span>
              </div>
            ) : (
              <button
                onClick={() => setSubmitAssignment({ id: 'asgn-1', subject: 'Data Structures', title: 'Binary Search Tree Implementation' })}
                className="mt-3 w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-blue-700 active:scale-95 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Submission</span>
              </button>
            )}
          </div>

          {/* Assignment 2 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Due in 5 days
              </span>
              <span className="text-xs text-slate-400">Environmental Science</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 mt-2">Urban Solid Waste Case Study</h4>
            <p className="text-xs text-slate-500 mt-1">Field observation summary report for Mumbai suburbs.</p>
            {submittedIds['asgn-2'] ? (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Submitted on Time</span>
              </div>
            ) : (
              <button
                onClick={() => setSubmitAssignment({ id: 'asgn-2', subject: 'Environmental Science', title: 'Urban Solid Waste Case Study' })}
                className="mt-3 w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-blue-700 active:scale-95 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Submission</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Exams Tab */}
      {activeTab === 'Exams' && (
        <div className="p-4 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900">Mid-Semester Examinations 2026</h4>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">Official</span>
            </div>
            <p className="text-xs text-slate-500">Commencing 18th October 2026 across A & B Wings.</p>
            
            <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100 space-y-2">
              <p className="text-xs font-bold text-blue-900">Hall Ticket #ST-2026-8812</p>
              <p className="text-[11px] text-blue-700">Seating: Room 204 | Seat #34 | Center: Sathaye Campus</p>
              <button
                onClick={() => setShowHallTicket(true)}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View & Download Hall Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'Results' && (
        <div className="p-4 space-y-3">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 block">SGPA: 9.42</span>
              <p className="text-xs font-semibold text-emerald-600 mt-0.5">Semester II • First Class with Distinction</p>
            </div>

            <div className="border-t border-slate-100 pt-3 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="font-medium text-slate-700">Data Structures & Algo</span>
                <span className="font-bold text-slate-900">94/100 (O)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="font-medium text-slate-700">Database Management</span>
                <span className="font-bold text-slate-900">88/100 (A+)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="font-medium text-slate-700">Operating Systems</span>
                <span className="font-bold text-slate-900">92/100 (O)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium text-slate-700">Environmental Studies</span>
                <span className="font-bold text-slate-900">85/100 (A+)</span>
              </div>
            </div>

            <button
              onClick={() => alert('Official Grade Card downloaded as PDF!')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official Grade Card</span>
            </button>
          </div>
        </div>
      )}

      {/* RESOURCE MODAL */}
      {modalResource && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">{modalResource.title}</h3>
              <button
                onClick={() => setModalResource(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {modalResource.items.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                    <span className="text-[10px] text-slate-400">{item.size} • Sathaye CS Dept</span>
                  </div>
                  <button
                    onClick={() => alert(`Downloading ${item.name}...`)}
                    className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ASSIGNMENT UPLOAD MODAL */}
      {submitAssignment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase">{submitAssignment.subject}</span>
                <h3 className="font-bold text-sm text-slate-900">{submitAssignment.title}</h3>
              </div>
              <button
                onClick={() => setSubmitAssignment(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submissionSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-2xl text-center">
                {submissionSuccess}
              </div>
            ) : (
              <form onSubmit={handleAssignmentSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">GitHub / Google Drive Link</label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/student/assignment"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-700">Attach Document / Zip</p>
                  <p className="text-[10px] text-slate-400">PDF, ZIP, CPP up to 25MB</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Confirm & Submit Assignment
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* HALL TICKET MODAL */}
      {showHallTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Official Hall Ticket</h3>
              <button
                onClick={() => setShowHallTicket(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 text-xs">
              <p className="text-[10px] uppercase font-bold text-blue-400">Sathaye College Autonomous Exam Cell</p>
              <h4 className="font-bold text-sm text-white">Abhishek Gupta</h4>
              <p className="text-slate-300">Roll No: 241023 | PRN: 202401640098</p>
              <p className="text-slate-300">Exam Center: Main Auditorium, Floor 1</p>
            </div>

            <button
              onClick={() => {
                alert('Hall Ticket PDF generated and downloaded!');
                setShowHallTicket(false);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Printable PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* TIMETABLE PDF MODAL */}
      {showTimetablePdf && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Academic Timetable 2026</h3>
              <button
                onClick={() => setShowTimetablePdf(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-blue-50 text-blue-900 rounded-2xl text-xs space-y-1">
              <p className="font-bold">B.Sc Computer Science - Semester II</p>
              <p className="text-[11px] text-blue-700">Valid from August 2026 to November 2026</p>
            </div>

            <button
              onClick={() => {
                alert('Full Timetable PDF downloaded!');
                setShowTimetablePdf(false);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Schedule to Device</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
