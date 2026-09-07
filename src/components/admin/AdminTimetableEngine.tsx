import React, { useState } from 'react';
import { Calendar, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Send, Layers, Clock } from 'lucide-react';
import { api } from '../../lib/api';

export const AdminTimetableEngine: React.FC = () => {
  const [academicYear, setAcademicYear] = useState<string>('2025-2026');
  const [semester, setSemester] = useState<string>('EVEN');
  const [courses, setCourses] = useState<string>('B.Sc. IT, B.Sc. CS, B.Com, B.A.');
  const [workingDays, setWorkingDays] = useState<string>('Monday, Tuesday, Wednesday, Thursday, Friday, Saturday');
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [generatedDraft, setGeneratedDraft] = useState<any | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const res = await api.admin.generateTimetable({
        academicYear,
        semester,
        courses: courses.split(',').map((c) => c.trim()),
        workingDays: workingDays.split(',').map((d) => d.trim())
      });

      setGeneratedDraft(res.draft);
      setStatusMessage(`Timetable generated successfully with ${res.draft.totalSlotsCount} clash-free slots across ${res.draft.allocatedRoomsCount} rooms!`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate timetable');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedDraft) return;

    setIsPublishing(true);
    setErrorMessage(null);

    try {
      const res = await api.admin.publishTimetable({
        draftId: generatedDraft.draftId,
        slots: generatedDraft.slots
      });

      setStatusMessage(`🎉 Timetable published live! ${res.publishedSlotsCount} class slots are now active across student and faculty portals.`);
      setGeneratedDraft(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to publish timetable');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
            AUTOMATED SCHEDULING ENGINE
          </span>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Conflict Detection & Room Allocation
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Academic Timetable Creator & Engine</h2>
        <p className="text-xs text-slate-500">
          Generate conflict-free master schedules for all departments, assign available classrooms automatically, and publish changes directly to live student & faculty views.
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-800 font-bold">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Generator Configuration Form */}
      <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Academic Year</label>
          <input
            type="text"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Semester Cycle</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
          >
            <option value="EVEN">EVEN Semesters (II, IV, VI)</option>
            <option value="ODD">ODD Semesters (I, III, V)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Target Academic Courses (Comma Separated)</label>
          <input
            type="text"
            value={courses}
            onChange={(e) => setCourses(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Working Days</label>
          <input
            type="text"
            value={workingDays}
            onChange={(e) => setWorkingDays(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
          />
        </div>

        <div className="md:col-span-2 flex justify-end pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating & Resolving Room Conflicts...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Master Timetable Draft</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Draft Preview Table */}
      {generatedDraft && (
        <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Generated Draft Timetable Preview</h3>
              <p className="text-xs text-slate-500">Review allocated classes before publishing live to student/faculty portals.</p>
            </div>

            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isPublishing ? 'Publishing to Database...' : 'Publish Live to Database'}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Day</th>
                  <th className="p-3">Time Slot</th>
                  <th className="p-3">Course / Div</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Assigned Faculty</th>
                  <th className="p-3">Allocated Room</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {generatedDraft.slots?.map((slot: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{slot.day}</td>
                    <td className="p-3 font-mono text-slate-600">{slot.startTime} - {slot.endTime}</td>
                    <td className="p-3 font-bold text-indigo-700">{slot.course} ({slot.division})</td>
                    <td className="p-3 font-semibold">{slot.subject}</td>
                    <td className="p-3 text-slate-600">{slot.faculty}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                        Room {slot.roomNumber} ({slot.floor})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
