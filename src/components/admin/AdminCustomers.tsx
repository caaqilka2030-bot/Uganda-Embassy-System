import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CitizenUser } from '../../types';
import {
  Users,
  Search,
  Flag,
  ShieldAlert,
  Phone,
  Mail,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { citizens, applications, toggleFlagCitizen } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCitizen, setSelectedCitizen] = useState<CitizenUser | null>(null);
  const [flagReasonInput, setFlagReasonInput] = useState('');
  const [showFlagModal, setShowFlagModal] = useState(false);

  const filteredCitizens = citizens.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      (c.passportOrId && c.passportOrId.toLowerCase().includes(q)) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const citizenApps = selectedCitizen
    ? applications.filter(
        (a) =>
          a.applicant.fullName.toLowerCase() === selectedCitizen.fullName.toLowerCase() ||
          a.applicant.passportOrIdNumber === selectedCitizen.passportOrId
      )
    : [];

  const handleToggleFlag = () => {
    if (!selectedCitizen) return;
    toggleFlagCitizen(selectedCitizen.id, flagReasonInput);
    setShowFlagModal(false);
    setFlagReasonInput('');
    // refresh
    setSelectedCitizen({
      ...selectedCitizen,
      isFlagged: !selectedCitizen.isFlagged,
      flagReason: !selectedCitizen.isFlagged ? flagReasonInput : undefined,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
          Citizen Registry & Diaspora Records
        </h1>
        <p className="text-xs text-slate-500">
          Directory of registered Somali citizens in Uganda, dossier history, and consular security flags.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search citizen name, phone, passport..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
        </div>
        <span className="text-xs font-mono text-slate-400">
          {filteredCitizens.length} Citizens Enrolled
        </span>
      </div>

      {/* Citizens Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-[#0B2545] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">Citizen Name</th>
                <th className="py-3 px-4 font-semibold">Passport / NIRA ID</th>
                <th className="py-3 px-4 font-semibold">Contact Phone</th>
                <th className="py-3 px-4 font-semibold">Current Residence in Uganda</th>
                <th className="py-3 px-4 font-semibold">Registered</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCitizens.map((citizen) => (
                <tr
                  key={citizen.id}
                  onClick={() => setSelectedCitizen(citizen)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {citizen.fullName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                    {citizen.passportOrId || 'Pending'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                    {citizen.phone}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {citizen.addressInUganda}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">
                    {citizen.registeredAt}
                  </td>
                  <td className="py-3.5 px-4">
                    {citizen.isFlagged ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <ShieldAlert className="w-3 h-3 text-rose-600" />
                        <span>Security Flagged</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        Clear / Verified
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCitizen(citizen);
                      }}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-[#4189DD] hover:text-white rounded font-semibold text-[11px] transition-colors"
                    >
                      Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Citizen History Drawer */}
      {selectedCitizen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 border-l border-slate-300 dark:border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#0B2545] dark:text-white">
                    {selectedCitizen.fullName}
                  </h2>
                  <p className="text-xs text-slate-500">Citizen Dossier & Application History</p>
                </div>
                <button
                  onClick={() => setSelectedCitizen(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded"
                >
                  ✕
                </button>
              </div>

              {/* Core Attributes */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <p><span className="text-slate-400">Phone:</span> {selectedCitizen.phone}</p>
                  <p><span className="text-slate-400">Email:</span> {selectedCitizen.email}</p>
                  <p><span className="text-slate-400">ID / Passport:</span> {selectedCitizen.passportOrId || 'N/A'}</p>
                  <p><span className="text-slate-400">Nationality:</span> {selectedCitizen.nationality}</p>
                  <div className="col-span-2">
                    <span className="text-slate-400">Uganda Address:</span> {selectedCitizen.addressInUganda}
                  </div>
                </div>

                {selectedCitizen.isFlagged && (
                  <div className="mt-2 p-2 bg-rose-50 dark:bg-rose-950/60 rounded border border-rose-300 text-rose-800 dark:text-rose-200 text-xs">
                    <strong>Flag Reason:</strong> {selectedCitizen.flagReason || 'Consular investigation watch'}
                  </div>
                )}
              </div>

              {/* History of Applications */}
              <div className="space-y-3 text-xs">
                <h3 className="font-serif font-bold text-sm text-[#0B2545] dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
                  Applications Filed ({citizenApps.length})
                </h3>

                {citizenApps.length > 0 ? (
                  <div className="space-y-2">
                    {citizenApps.map((app) => (
                      <div
                        key={app.id}
                        className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-mono font-bold text-[#0B2545] dark:text-[#4189DD]">
                            {app.referenceNumber}
                          </p>
                          <span className="text-slate-500 capitalize">{app.serviceId.replace(/_/g, ' ')}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300">
                            {app.status.replace(/_/g, ' ')}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-mono">{app.submittedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No past applications recorded in system.</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => setShowFlagModal(true)}
                className={`px-3 py-2 rounded-lg font-bold transition-colors ${
                  selectedCitizen.isFlagged
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                {selectedCitizen.isFlagged ? 'Remove Security Flag' : 'Flag Citizen Record'}
              </button>

              <button
                onClick={() => setSelectedCitizen(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flag Modal */}
      {showFlagModal && selectedCitizen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-300 dark:border-slate-800 max-w-sm w-full space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-rose-700">
              {selectedCitizen.isFlagged ? 'Clear Security Flag' : 'Flag Citizen Record'}
            </h3>
            {!selectedCitizen.isFlagged && (
              <textarea
                rows={3}
                value={flagReasonInput}
                onChange={(e) => setFlagReasonInput(e.target.value)}
                placeholder="Reason for flagging (e.g. fraudulent document suspicion, judicial warrant)..."
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
              />
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowFlagModal(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleFlag}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
