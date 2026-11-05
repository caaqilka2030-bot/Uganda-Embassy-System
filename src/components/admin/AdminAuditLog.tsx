import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  History,
  Search,
  Shield,
  Download,
  Filter,
  Clock,
  User,
} from 'lucide-react';

export const AdminAuditLog: React.FC = () => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const filteredLogs = auditLogs.filter((log) => {
    if (filterAction !== 'all' && !log.action.includes(filterAction)) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.actorName.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  });

  const exportAuditCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'Actor Name', 'Role', 'Action Code', 'Details', 'IP Address'];
    const rows = auditLogs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.actorName}"`,
      l.actorRole,
      l.action,
      `"${l.details.replace(/"/g, '""')}"`,
      l.ipAddress || 'Internal',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `somali_embassy_security_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
            Diplomatic Mission Security Audit Trail
          </h1>
          <p className="text-xs text-slate-500">
            Immutable log of all consular logins, fee updates, application approvals, and document collections.
          </p>
        </div>

        <button
          onClick={exportAuditCSV}
          className="px-3.5 py-2 bg-slate-800 hover:bg-black text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by actor, action, or details..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Action:</span>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Actions</option>
            <option value="LOGIN">Staff Logins</option>
            <option value="APPROVED">Approvals</option>
            <option value="FEE">Fee Updates</option>
            <option value="PAYMENT">Payments</option>
            <option value="COLLECTION">Collections</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-[#0B2545] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Actor</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Action Code</th>
                <th className="py-3 px-4 font-semibold">Event Description</th>
                <th className="py-3 px-4 font-semibold">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 font-mono text-[11px]">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white font-sans">
                    {log.actorName}
                  </td>
                  <td className="py-3 px-4 uppercase text-slate-500 text-[10px]">
                    {log.actorRole}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#0B2545] dark:text-[#4189DD] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700 dark:text-slate-300">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {log.ipAddress || '192.168.10.1'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
