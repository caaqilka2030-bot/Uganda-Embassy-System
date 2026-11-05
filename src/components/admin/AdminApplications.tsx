import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConsularApplication, ApplicationStatus, StaffUser } from '../../types';
import { OfficialReceiptModal } from '../common/OfficialReceiptModal';
import { ApprovalCertificateModal } from '../common/ApprovalCertificateModal';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  UserCheck,
  Sparkles,
  Printer,
  Shield,
  FileText,
  MessageSquare,
  DollarSign,
  ChevronRight,
  X,
  ExternalLink,
  Lock,
} from 'lucide-react';

export const AdminApplications: React.FC<{ filterStatus?: string }> = ({ filterStatus }) => {
  const {
    applications,
    staffUsers,
    currentStaff,
    updateApplicationStatus,
    assignApplicationOfficer,
    addApplicationNote,
    setApplicationCustomFee,
    runAiDocPrecheck,
    settings,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(filterStatus || 'all');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState('all');

  const [selectedApp, setSelectedApp] = useState<ConsularApplication | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [infoRequestText, setInfoRequestText] = useState('');

  // Custom fee setting state
  const [customFeeUsd, setCustomFeeUsd] = useState<number>(60);

  // Modals
  const [showReceipt, setShowReceipt] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const filteredApps = applications.filter((app) => {
    if (selectedStatusFilter !== 'all' && app.status !== selectedStatusFilter) return false;
    if (selectedServiceFilter !== 'all' && app.serviceId !== selectedServiceFilter) return false;
    if (selectedPaymentFilter !== 'all' && app.payment.status !== selectedPaymentFilter) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      app.referenceNumber.toLowerCase().includes(q) ||
      app.applicant.fullName.toLowerCase().includes(q) ||
      app.applicant.passportOrIdNumber.toLowerCase().includes(q) ||
      app.applicant.phone.includes(q)
    );
  });

  const handleAssign = (officer: StaffUser) => {
    if (!selectedApp) return;
    assignApplicationOfficer(selectedApp.id, officer.id, officer.name);
    setSelectedApp({ ...selectedApp, assignedOfficerId: officer.id, assignedOfficerName: officer.name });
    setAssignModalOpen(false);
  };

  const handleApprove = () => {
    if (!selectedApp) return;
    // Check payment restriction rule: no approval unless paid or verified
    if (selectedApp.payment.status !== 'paid') {
      alert('Cannot approve application: Consular payment has not been marked as Paid or Verified.');
      return;
    }
    updateApplicationStatus(selectedApp.id, 'approved', 'Consular approval granted. Ready for document print & stamping.');
    setSelectedApp({ ...selectedApp, status: 'approved' });
  };

  const handleReject = () => {
    if (!selectedApp || !rejectReason.trim()) return;
    updateApplicationStatus(selectedApp.id, 'rejected', rejectReason);
    setSelectedApp({ ...selectedApp, status: 'rejected', rejectionReason: rejectReason });
    setRejectModalOpen(false);
    setRejectReason('');
  };

  const handleRequestInfo = () => {
    if (!selectedApp || !infoRequestText.trim()) return;
    updateApplicationStatus(selectedApp.id, 'more_info_needed', infoRequestText);
    setSelectedApp({ ...selectedApp, status: 'more_info_needed', infoRequestMessage: infoRequestText });
    setInfoModalOpen(false);
    setInfoRequestText('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !noteContent.trim()) return;
    addApplicationNote(selectedApp.id, noteContent, true);
    setNoteContent('');
    // refresh drawer state
    const updated = applications.find((a) => a.id === selectedApp.id);
    if (updated) setSelectedApp(updated);
  };

  const handleSetCustomFee = () => {
    if (!selectedApp) return;
    setApplicationCustomFee(selectedApp.id, customFeeUsd);
    // refresh drawer
    const updated = applications.find((a) => a.id === selectedApp.id);
    if (updated) setSelectedApp(updated);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
            Consular Applications Registry
          </h1>
          <p className="text-xs text-slate-500">
            Search, vet, inspect, and approve citizen and diplomatic consular dossiers.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Search Input */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference, name, ID..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#4189DD]"
            />
          </div>

          {/* Service filter */}
          <div>
            <select
              value={selectedServiceFilter}
              onChange={(e) => setSelectedServiceFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Services</option>
              <option value="passport">Passport</option>
              <option value="nira">National ID (NIRA)</option>
              <option value="power_of_attorney">Power of Attorney</option>
              <option value="education">Education Attestation</option>
              <option value="birth_certificate">Birth Certificate</option>
              <option value="go_home">Go Home Travel</option>
              <option value="death_certificate">Death Certificate</option>
              <option value="visa">Visa</option>
              <option value="cid_clearance">C.I.D Clearance</option>
              <option value="renunciation">Renunciation</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="more_info_needed">More Info Needed</option>
              <option value="approved">Approved</option>
              <option value="ready_for_collection">Ready for Collection</option>
              <option value="collected">Collected</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div>
            <select
              value={selectedPaymentFilter}
              onChange={(e) => setSelectedPaymentFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid & Verified</option>
              <option value="awaiting_verification">Bank Proof Uploaded</option>
              <option value="unpaid">Unpaid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-[#0B2545] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">Ref Number</th>
                <th className="py-3 px-4 font-semibold">Applicant</th>
                <th className="py-3 px-4 font-semibold">Service</th>
                <th className="py-3 px-4 font-semibold">Submission Date</th>
                <th className="py-3 px-4 font-semibold">Assigned Officer</th>
                <th className="py-3 px-4 font-semibold">Payment</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApps.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0B2545] dark:text-[#4189DD]">
                    {app.referenceNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{app.applicant.fullName}</p>
                    <span className="text-[11px] font-mono text-slate-400">{app.applicant.passportOrIdNumber || 'N/A'}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {app.serviceId.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {app.submittedAt}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {app.assignedOfficerName || <span className="text-amber-500 italic">Unassigned</span>}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        app.payment.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : app.payment.status === 'awaiting_verification'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {app.payment.status.replace(/_/g, ' ')} (${app.payment.totalAmount})
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                        app.status === 'approved' || app.status === 'ready_for_collection' || app.status === 'collected'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : app.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          : app.status === 'under_review'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                      }`}
                    >
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApp(app);
                      }}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-[#4189DD] hover:text-white rounded text-slate-700 dark:text-slate-300 font-semibold transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer (Modal) for Selected Application */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 border-l border-slate-300 dark:border-slate-800 flex flex-col justify-between">
            {/* Top Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Application Dossier
                  </span>
                  <h2 className="font-mono text-xl font-bold text-[#0B2545] dark:text-white">
                    {selectedApp.referenceNumber}
                  </h2>
                  <p className="text-xs text-slate-500 capitalize">
                    {selectedApp.serviceId.replace(/_/g, ' ')} · Submitted on {selectedApp.submittedAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowReceipt(true)}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                    title="Print Receipt"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Status Action Buttons Ribbon */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Status: <strong className="text-[#0B2545] dark:text-white capitalize">{selectedApp.status.replace(/_/g, ' ')}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setAssignModalOpen(true)}
                    className="px-2.5 py-1 text-xs bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded font-medium hover:bg-slate-100 transition-colors"
                  >
                    Assign Officer
                  </button>
                  <button
                    onClick={() => setInfoModalOpen(true)}
                    className="px-2.5 py-1 text-xs bg-amber-500 text-white rounded font-medium hover:bg-amber-600 transition-colors"
                  >
                    Request Info
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-3 py-1 text-xs bg-[#2E6B3F] hover:bg-[#255833] text-white font-bold rounded transition-colors shadow-2xs"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setRejectModalOpen(true)}
                    className="px-2.5 py-1 text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium rounded transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Special Custom Fee Setting Box if Fee is Pending */}
              {selectedApp.payment.status === 'unpaid' && !selectedApp.payment.isCustomFeeConfirmedByAdmin && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-300 dark:border-amber-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    <span>Consular Action Required: Fee Confirmation</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-snug">
                    This service is listed as "Fee to be confirmed". Review the applicant's request and specify the official fee to unlock the citizen payment gateway.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Set Fee ($ USD):</span>
                    <input
                      type="number"
                      value={customFeeUsd}
                      onChange={(e) => setCustomFeeUsd(Number(e.target.value))}
                      className="w-24 p-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs font-mono font-bold"
                    />
                    <button
                      onClick={handleSetCustomFee}
                      className="px-3 py-1.5 bg-[#0B2545] text-[#C9A227] hover:bg-black font-semibold rounded text-xs transition-colors"
                    >
                      Confirm Fee & Unlock Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Applicant Dossier Data */}
              <div className="space-y-3 text-xs">
                <h3 className="font-serif font-bold text-sm text-[#0B2545] dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
                  Applicant Core Information
                </h3>
                <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Full Name:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedApp.applicant.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Mother's Name:</span>
                    <span className="text-slate-700 dark:text-slate-300">{selectedApp.applicant.motherName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Date of Birth / Place:</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {selectedApp.applicant.dob} · {selectedApp.applicant.placeOfBirth}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phone & WhatsApp:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{selectedApp.applicant.phone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px]">Uganda Physical Address:</span>
                    <span className="text-slate-700 dark:text-slate-300">{selectedApp.applicant.addressInUganda}</span>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents & AI Pre-check Trigger */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1">
                  <h3 className="font-serif font-bold text-sm text-[#0B2545] dark:text-white">
                    Uploaded Supporting Documents
                  </h3>
                  <span className="text-[10px] text-slate-400">Powered by Gemini AI Pre-Check</span>
                </div>

                <div className="space-y-2.5">
                  {selectedApp.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#4189DD]" />
                          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                            {doc.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => runAiDocPrecheck(selectedApp.id, doc.id)}
                            className="px-2.5 py-1 bg-[#4189DD]/10 hover:bg-[#4189DD]/20 text-[#4189DD] font-semibold rounded text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-[#C9A227]" />
                            <span>AI Pre-Check</span>
                          </button>
                        </div>
                      </div>

                      {/* AI Precheck Results Card */}
                      {doc.aiPreCheck && (
                        <div className="mt-2 p-2.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              Verification Score: {doc.aiPreCheck.confidenceScore}% ({doc.aiPreCheck.status})
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300">{doc.aiPreCheck.summary}</p>
                          <p className="text-slate-500 dark:text-slate-400 italic">
                            Officer Guidance: {doc.aiPreCheck.recommendationForOfficer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes and Audit Timeline */}
              <div className="space-y-3 text-xs">
                <h3 className="font-serif font-bold text-sm text-[#0B2545] dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
                  Internal Officer Notes
                </h3>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Add an internal note or observation..."
                    className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#0B2545] hover:bg-black text-white text-xs font-semibold rounded-lg"
                  >
                    Add Note
                  </button>
                </form>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedApp.notes.map((note) => (
                    <div key={note.id} className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-[11px] space-y-0.5">
                      <div className="flex justify-between text-slate-500">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{note.authorName}</span>
                        <span>{note.createdAt}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => setShowCertificate(true)}
                className="px-3 py-2 bg-[#C9A227] hover:bg-[#b59120] text-[#0B2545] font-bold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Approval Certificate</span>
              </button>

              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-semibold"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-300 dark:border-slate-800 shadow-xl max-w-sm w-full space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-[#0B2545] dark:text-white">
              Assign Application to Consular Officer
            </h3>
            <div className="space-y-2">
              {staffUsers
                .filter((u) => u.status === 'active')
                .map((officer) => (
                  <button
                    key={officer.id}
                    onClick={() => handleAssign(officer)}
                    className="w-full p-2.5 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{officer.name}</p>
                      <span className="text-[10px] text-slate-500 capitalize">{officer.role.replace(/_/g, ' ')}</span>
                    </div>
                    <UserCheck className="w-4 h-4 text-[#4189DD]" />
                  </button>
                ))}
            </div>
            <button
              onClick={() => setAssignModalOpen(false)}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-300 dark:border-slate-800 shadow-xl max-w-md w-full space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-rose-700">
              Reject Consular Application
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Specify the legal or consular ground for rejecting this application. This note will be recorded in the applicant's official notification.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Mismatched birth certificate records, missing Ministry of Foreign Affairs stamp..."
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Info Modal */}
      {infoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-300 dark:border-slate-800 shadow-xl max-w-md w-full space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-[#0B2545] dark:text-white">
              Request Additional Documents from Applicant
            </h3>
            <textarea
              rows={3}
              value={infoRequestText}
              onChange={(e) => setInfoRequestText(e.target.value)}
              placeholder="Specify the missing or blurry documents needed..."
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setInfoModalOpen(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestInfo}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showReceipt && selectedApp && (
        <OfficialReceiptModal
          application={selectedApp}
          onClose={() => setShowReceipt(false)}
        />
      )}

      {showCertificate && selectedApp && (
        <ApprovalCertificateModal
          application={selectedApp}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};
