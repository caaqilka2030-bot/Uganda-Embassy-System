import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StaffUser, UserRole } from '../../types';
import {
  UserCheck,
  Plus,
  Shield,
  CheckCircle,
  AlertCircle,
  Lock,
  UserX,
  Search,
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { staffUsers, addStaffUser, updateStaffUserStatus, currentStaff } = useApp();

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('consular_officer');
  const [newDepartment, setNewDepartment] = useState('Consular & Legal Affairs');

  const filteredStaff = staffUsers.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.includes(q);
  });

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    addStaffUser({
      name: newName,
      email: newEmail,
      role: newRole,
      department: newDepartment,
      status: 'active',
    });

    setNewName('');
    setNewEmail('');
    setShowAddModal(false);
  };

  const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
    master: 'Super Admin / Ambassador’s office. Full system access, fees, users, settings, and audits.',
    consular_officer: 'Reviews applications, requests more info, approves or rejects, adds internal notes.',
    verification_officer: 'Checks documents, identity authenticity, and biometric matching.',
    finance_officer: 'Sees payments, verifies bank transfer slips, manages refunds, reconciles revenue.',
    reception: 'Front desk, checks in appointments, captures biometrics, handles citizen collections.',
    auditor: 'Read-only access to audit trails, performance metrics, and financial reports.',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#C9A227] text-[#0B2545] mb-1">
            Master User Security Control
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
            Staff Accounts & Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-slate-500">
            Provision embassy officer logins, assign granular departmental authorities, and manage security suspensions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-[#4189DD] hover:bg-[#3476c5] text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Account</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-[#0B2545] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">Staff Member</th>
                <th className="py-3 px-4 font-semibold">Email & Login ID</th>
                <th className="py-3 px-4 font-semibold">Assigned Role</th>
                <th className="py-3 px-4 font-semibold">Department</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStaff.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                    {user.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                      {user.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {user.department}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        user.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {user.role !== 'master' ? (
                      <button
                        onClick={() =>
                          updateStaffUserStatus(
                            user.id,
                            user.status === 'active' ? 'suspended' : 'active'
                          )
                        }
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                          user.status === 'active'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40'
                        }`}
                      >
                        {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Protected Super Admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Responsibilities Reference Card */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
        <h3 className="font-serif font-bold text-sm text-[#0B2545] dark:text-white">
          Consular Mission Role Permissions Reference
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(Object.keys(ROLE_DESCRIPTIONS) as UserRole[]).map((r) => (
            <div key={r} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-[#0B2545] dark:text-[#4189DD] capitalize">
                {r.replace(/_/g, ' ')}
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                {ROLE_DESCRIPTIONS[r]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleCreateStaff}
            className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-300 dark:border-slate-800 max-w-md w-full space-y-4 text-xs"
          >
            <h3 className="font-serif font-bold text-base text-[#0B2545] dark:text-white">
              Provision New Consular Staff Account
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Farhan Abdi Mire"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">Email Address (Login) *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="officer@embassy.demo"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">Role & Permission Level *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  <option value="consular_officer">Consular Officer</option>
                  <option value="verification_officer">Verification Officer</option>
                  <option value="finance_officer">Finance Officer</option>
                  <option value="reception">Reception / Front Desk</option>
                  <option value="auditor">Auditor / Viewer</option>
                  <option value="master">Master User (Super Admin)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">Department / Section *</label>
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#4189DD] hover:bg-[#3476c5] text-white font-bold rounded"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
