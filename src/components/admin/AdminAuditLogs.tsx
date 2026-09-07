import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, Search, UserCheck, Calendar, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const loadLogs = () => {
    setLoading(true);
    api.admin.getAuditLogs()
      .then((res) => {
        setLogs(res.auditLogs || []);
      })
      .catch((err) => {
        console.warn('Failed to load audit logs:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      log.action?.toLowerCase().includes(term) ||
      log.adminName?.toLowerCase().includes(term) ||
      log.details?.toLowerCase().includes(term) ||
      log.ipAddress?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
              SECURITY AUDIT & COMPLIANCE
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">System Audit Logs</h2>
          <p className="text-xs text-slate-500">
            Immutable system operation record for user management, room maintenance, and timetable publishing.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Logs</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter logs by admin name, action, or details..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th className="p-3">Timestamp</th>
              <th className="p-3">Administrator</th>
              <th className="p-3">Action</th>
              <th className="p-3">Details</th>
              <th className="p-3">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="p-3 font-bold text-indigo-900">{log.adminName}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 font-mono font-bold text-[10px] text-slate-800">
                    {log.action}
                  </span>
                </td>
                <td className="p-3 text-slate-600 max-w-xs truncate">{log.details}</td>
                <td className="p-3 font-mono text-[10px] text-slate-400">{log.ipAddress || '127.0.0.1'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
