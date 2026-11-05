import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../constants/translations';
import { ConsularApplication } from '../../types';
import { OfficialReceiptModal } from '../common/OfficialReceiptModal';
import { ApprovalCertificateModal } from '../common/ApprovalCertificateModal';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Printer,
  Shield,
  Download,
  ArrowRight,
  User,
  CreditCard,
  Building,
} from 'lucide-react';

export const TrackApplicationPage: React.FC = () => {
  const { language, applications, setCurrentView } = useApp();
  const t = translations[language];

  const [refInput, setRefInput] = useState('');
  const [idInput, setIdInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedApp, setMatchedApp] = useState<ConsularApplication | null>(null);

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!refInput.trim()) return;

    setSearched(true);
    const cleanedRef = refInput.trim().toUpperCase();
    const cleanedId = idInput.trim().toLowerCase();

    const found = applications.find((app) => {
      const matchRef = app.referenceNumber.toUpperCase() === cleanedRef;
      if (!cleanedId) return matchRef;
      const matchId =
        app.applicant.passportOrIdNumber.toLowerCase() === cleanedId ||
        app.applicant.phone.includes(cleanedId);
      return matchRef || matchId;
    });

    setMatchedApp(found || null);
  };

  const quickFill = (ref: string, id: string) => {
    setRefInput(ref);
    setIdInput(id);
    const found = applications.find((a) => a.referenceNumber === ref);
    setMatchedApp(found || null);
    setSearched(true);
  };

  const STAGES = [
    { key: 'submitted', label: 'Submitted' },
    { key: 'payment_verified', label: 'Fee Verified' },
    { key: 'under_review', label: 'Consular Review' },
    { key: 'approved', label: 'Approved' },
    { key: 'ready_for_collection', label: 'Ready for Collection' },
    { key: 'collected', label: 'Collected' },
  ];

  const getStageIndex = (status: string) => {
    if (status === 'draft' || status === 'submitted') return 0;
    if (status === 'payment_verified') return 1;
    if (status === 'under_review' || status === 'more_info_needed') return 2;
    if (status === 'approved' || status === 'printed') return 3;
    if (status === 'ready_for_collection') return 4;
    if (status === 'collected') return 5;
    return 1;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#C9A227] uppercase tracking-widest">
          {language === 'so' ? 'Xaqiijinta Xaaladda' : 'Live Status Tracking'}
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#0B2545]">
          {language === 'so' ? 'La Soco Codsigaaga Qunsuliyadda' : 'Track Your Consular Application'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Enter your official reference number (e.g. SEK-2026-000101) to verify live consular progress, appointment schedules, and download receipts.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="sm:col-span-3 space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Application Reference Number *
            </label>
            <input
              type="text"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              placeholder="e.g. SEK-2026-000101"
              required
              className="w-full text-xs font-mono uppercase px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4189DD] text-slate-900"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Passport or ID Number (Optional)
            </label>
            <input
              type="text"
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
              placeholder="e.g. P01982736"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4189DD] text-slate-900"
            />
          </div>

          <div className="sm:col-span-5 pt-1">
            <button
              type="submit"
              className="w-full py-3 bg-[#4189DD] hover:bg-[#3476c5] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Track Application Now</span>
            </button>
          </div>
        </form>

        {/* Quick Demo Fillers for Testing */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="font-medium text-slate-600">Sample Reference Numbers:</span>
          <button
            onClick={() => quickFill('SEK-2026-000101', 'P01982736')}
            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-[#0B2545] rounded font-mono border border-slate-200 cursor-pointer"
          >
            SEK-2026-000101 (Passport - Approved)
          </button>
          <button
            onClick={() => quickFill('SEK-2026-000102', 'P02239104')}
            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-[#0B2545] rounded font-mono border border-slate-200 cursor-pointer"
          >
            SEK-2026-000102 (Wakaalad - Review)
          </button>
          <button
            onClick={() => quickFill('SEK-2026-000103', 'P00892110')}
            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-[#0B2545] rounded font-mono border border-slate-200 cursor-pointer"
          >
            SEK-2026-000103 (Birth Cert - Ready)
          </button>
        </div>
      </div>

      {/* Results View */}
      {searched && (
        <>
          {matchedApp ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Application Top Summary Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Reference Code
                    </span>
                    <h2 className="font-mono text-2xl font-bold text-[#0B2545]">
                      {matchedApp.referenceNumber}
                    </h2>
                    <p className="text-xs text-slate-600 capitalize">
                      Service: <span className="font-semibold text-slate-900">{matchedApp.serviceId.replace(/_/g, ' ')}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setShowReceiptModal(true)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Official Receipt</span>
                    </button>

                    {(matchedApp.status === 'approved' || matchedApp.status === 'ready_for_collection' || matchedApp.status === 'collected') && (
                      <button
                        onClick={() => setShowCertModal(true)}
                        className="px-3 py-2 bg-[#C9A227] hover:bg-[#b59120] text-[#0B2545] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Approval Certificate</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="py-4">
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                    {STAGES.map((stage, idx) => {
                      const currentIdx = getStageIndex(matchedApp.status);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={stage.key} className="flex flex-col items-center space-y-2 relative">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                              isCompleted
                                ? 'bg-[#2E6B3F] text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[11px] font-medium leading-tight ${
                              isCurrent
                                ? 'text-[#0B2545] font-bold'
                                : isCompleted
                                ? 'text-slate-700'
                                : 'text-slate-400'
                            }`}
                          >
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Applicant & Appointment Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>Applicant Information:</span>
                    </span>
                    <p className="font-bold text-slate-900">{matchedApp.applicant.fullName}</p>
                    <p className="text-slate-600 font-mono">ID: {matchedApp.applicant.passportOrIdNumber || 'N/A'}</p>
                    <p className="text-slate-500">{matchedApp.applicant.phone}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Payment Status:</span>
                    </span>
                    <p className="font-bold text-[#0B2545]">
                      {matchedApp.payment.status.toUpperCase()} ({matchedApp.payment.currency} ${matchedApp.payment.totalAmount})
                    </p>
                    <p className="text-slate-600">Method: {matchedApp.payment.method?.replace(/_/g, ' ') || 'Pending'}</p>
                    <p className="font-mono text-slate-500">Ref: {matchedApp.payment.transactionReference || 'N/A'}</p>
                  </div>

                  <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200 space-y-1">
                    <span className="text-amber-900 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Biometrics / Embassy Visit:</span>
                    </span>
                    {matchedApp.appointment ? (
                      <>
                        <p className="font-bold text-slate-900">
                          {matchedApp.appointment.date} at {matchedApp.appointment.time}
                        </p>
                        <p className="text-slate-600">
                          Room: {matchedApp.appointment.counter || 'Window 1'}
                        </p>
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          Slot Confirmed
                        </span>
                      </>
                    ) : (
                      <p className="text-slate-500 italic">No appointment booked yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Timeline History */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-[#0B2545] border-b border-slate-100 pb-2">
                  Consular Processing Timeline
                </h3>

                <div className="space-y-4 text-xs pl-2">
                  {matchedApp.timeline.map((event, idx) => (
                    <div key={event.id || idx} className="flex items-start gap-3 relative">
                      <div className="w-3 h-3 rounded-full bg-[#4189DD] mt-1 shrink-0 ring-4 ring-[#4189DD]/20" />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{event.title}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500 font-mono text-[11px]">{event.timestamp}</span>
                        </div>
                        <p className="text-slate-600">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-3 shadow-sm">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-slate-900">
                No Application Found with that Reference
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Please double-check the reference number on your submission email or SMS (e.g. SEK-2026-XXXXXX). You can also click one of the sample numbers above.
              </p>
            </div>
          )}
        </>
      )}

      {/* Receipts and Certificate Modals */}
      {showReceiptModal && matchedApp && (
        <OfficialReceiptModal
          application={matchedApp}
          onClose={() => setShowReceiptModal(false)}
        />
      )}

      {showCertModal && matchedApp && (
        <ApprovalCertificateModal
          application={matchedApp}
          onClose={() => setShowCertModal(false)}
        />
      )}
    </div>
  );
};
