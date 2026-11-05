import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConsularApplication } from '../../types';
import {
  Award,
  CheckCircle2,
  Printer,
  UserCheck,
  Search,
  Filter,
  Shield,
  FileCheck2,
  Clock,
} from 'lucide-react';

export const AdminIssuance: React.FC = () => {
  const {
    applications,
    markDocumentPrinted,
    markDocumentReady,
    markDocumentCollected,
  } = useApp();

  const [search, setSearch] = useState('');
  const [collectorApp, setCollectorApp] = useState<ConsularApplication | null>(null);
  const [collectorName, setCollectorName] = useState('');
  const [collectorId, setCollectorId] = useState('');
  const [signatureText, setSignatureText] = useState('');

  // Apps that are approved, printed, ready_for_collection, or collected
  const issuanceApps = applications.filter((app) =>
    ['approved', 'printed', 'ready_for_collection', 'collected'].includes(app.status)
  );

  const filteredApps = issuanceApps.filter((app) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      app.referenceNumber.toLowerCase().includes(q) ||
      app.applicant.fullName.toLowerCase().includes(q) ||
      app.applicant.passportOrIdNumber.toLowerCase().includes(q)
    );
  });

  const handleOpenCollectorModal = (app: ConsularApplication) => {
    setCollectorApp(app);
    setCollectorName(app.applicant.fullName);
    setCollectorId(app.applicant.passportOrIdNumber || '');
    setSignatureText(app.applicant.fullName);
  };

  const handleConfirmCollection = () => {
    if (!collectorApp || !collectorName.trim() || !collectorId.trim()) return;
    markDocumentCollected(collectorApp.id, collectorName, collectorId, signatureText);
    setCollectorApp(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
          Document Issuance & Citizen Collection Pipeline
        </h1>
        <p className="text-xs text-slate-500">
          Track official document printing, consular wax stamping, front-counter dispatch, and collector ID verification.
        </p>
      </div>

      {/* 3 Pipeline Stages Metric */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500">1. Approved (Needs Printing)</span>
          <p className="font-mono text-2xl font-bold text-amber-600">
            {applications.filter((a) => a.status === 'approved').length} Dossiers
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500">2. Printed (Awaiting Stamp / Counter)</span>
          <p className="font-mono text-2xl font-bold text-blue-600">
            {applications.filter((a) => a.status === 'printed').length} Documents
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500">3. Ready for Citizen Pickup</span>
          <p className="font-mono text-2xl font-bold text-[#2E6B3F]">
            {applications.filter((a) => a.status === 'ready_for_collection').length} At Front Counter
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collector name, ref, or ID..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-[#0B2545] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">Ref Number</th>
                <th className="py-3 px-4 font-semibold">Citizen Name</th>
                <th className="py-3 px-4 font-semibold">Service Type</th>
                <th className="py-3 px-4 font-semibold">Issuance Stage</th>
                <th className="py-3 px-4 font-semibold">Collector Verification</th>
                <th className="py-3 px-4 font-semibold text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0B2545] dark:text-[#4189DD]">
                    {app.referenceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {app.applicant.fullName}
                  </td>
                  <td className="py-3.5 px-4 capitalize text-slate-700 dark:text-slate-300">
                    {app.serviceId.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-semibold text-[10px] capitalize ${
                        app.status === 'collected'
                          ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          : app.status === 'ready_for_collection'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : app.status === 'printed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {app.issuance?.collectedBy ? (
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {app.issuance.collectedBy}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          ID: {app.issuance.collectorIdNumber} · {app.issuance.collectedAt}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Pending pickup</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {app.status === 'approved' && (
                        <button
                          onClick={() => markDocumentPrinted(app.id)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-[11px] transition-colors"
                        >
                          Mark Printed
                        </button>
                      )}

                      {app.status === 'printed' && (
                        <button
                          onClick={() => markDocumentReady(app.id)}
                          className="px-2.5 py-1 bg-[#2E6B3F] hover:bg-[#255833] text-white rounded font-semibold text-[11px] transition-colors"
                        >
                          Send to Front Counter
                        </button>
                      )}

                      {app.status === 'ready_for_collection' && (
                        <button
                          onClick={() => handleOpenCollectorModal(app)}
                          className="px-3 py-1 bg-[#0B2545] hover:bg-black text-[#C9A227] rounded font-bold text-[11px] transition-colors shadow-2xs"
                        >
                          Verify & Hand Over
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hand Over / Collection Verification Modal */}
      {collectorApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-300 dark:border-slate-800 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-[#0B2545] dark:text-white">
              Capture Document Handover & Signature
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Verify original identification of the recipient before handing over the sealed consular document.
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Collector Full Name *
                </label>
                <input
                  type="text"
                  value={collectorName}
                  onChange={(e) => setCollectorName(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Collector Passport / National ID Number *
                </label>
                <input
                  type="text"
                  value={collectorId}
                  onChange={(e) => setCollectorId(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Digital E-Signature / Acknowledgement:
                </label>
                <input
                  type="text"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  placeholder="Collector typed signature"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-serif italic"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setCollectorApp(null)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCollection}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
              >
                Confirm Handover & Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
