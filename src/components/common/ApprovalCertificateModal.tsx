import React from 'react';
import { ConsularApplication } from '../../types';
import { QRCodeView } from './QRCodeView';
import { X, Printer, Shield, CheckCircle } from 'lucide-react';

interface ApprovalCertificateModalProps {
  application: ConsularApplication;
  onClose: () => void;
}

export const ApprovalCertificateModal: React.FC<ApprovalCertificateModalProps> = ({
  application,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const { applicant, referenceNumber, serviceId, updatedAt, assignedOfficerName } = application;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden border border-amber-300 relative print:border-none print:shadow-none print:m-0 print:max-w-full">
        {/* Controls */}
        <div className="no-print bg-[#0B2545] text-white px-6 py-3 flex items-center justify-between border-b border-[#C9A227]/30">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#C9A227]" />
            <span className="font-semibold text-sm">Official Consular Certificate / Approval Notice</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4189DD] hover:bg-[#3476c5] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Sheet with Gold Border & Coat of Arms */}
        <div className="p-10 bg-[#FAF9F5] border-8 border-double border-[#C9A227]/50 relative m-4 rounded-lg">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
            <img
              src="/public/assets/aistudio/Astaanta_dalka_cd5ae664.jfif"
              alt="Watermark"
              referrerPolicy="no-referrer"
              className="w-96 h-96 object-contain filter grayscale"
            />
          </div>

          {/* Diplomatic Header */}
          <div className="text-center space-y-2 border-b-2 border-[#C9A227] pb-6">
            <div className="flex justify-center">
              <img
                src="/public/assets/aistudio/Astaanta_dalka_cd5ae664.jfif"
                alt="Coat of Arms of the Federal Republic of Somalia"
                referrerPolicy="no-referrer"
                className="w-24 h-24 object-contain filter drop-shadow-md"
              />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0B2545] uppercase">
              Embassy of the Federal Republic of Somalia
            </h1>
            <p className="font-serif text-sm italic text-[#C9A227] font-semibold">
              Mission Diplomatique à Kampala · Republic of Uganda
            </p>
            <p className="text-[11px] font-mono tracking-widest text-slate-600 uppercase">
              Department of Consular & Legal Affairs
            </p>
          </div>

          {/* Certificate Title */}
          <div className="py-6 text-center space-y-2">
            <span className="text-xs font-bold text-[#0B2545] uppercase tracking-widest bg-amber-100/60 px-3 py-1 rounded border border-amber-300">
              Official Consular Attestation & Approval
            </span>
            <div className="font-mono text-xs text-slate-500 mt-2">
              CERTIFICATE DISPATCH NO: <span className="font-bold text-slate-900">{referenceNumber}</span>
            </div>
          </div>

          {/* Formal Body Text */}
          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-4 px-2">
            <p>
              This is to officially certify that the Consular Section of the Embassy of the Federal Republic of Somalia in Kampala, Uganda, has formally examined and vetted the application and supporting credentials submitted by:
            </p>

            <div className="bg-white p-4 rounded-lg border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Applicant Name:</span>
                <span className="font-bold text-[#0B2545] text-sm">{applicant.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Passport / National ID:</span>
                <span className="font-mono font-semibold text-slate-900">{applicant.passportOrIdNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Nationality / Origin:</span>
                <span className="font-medium text-slate-800">{applicant.nationality} · {applicant.placeOfBirth}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Service Endorsed:</span>
                <span className="font-semibold text-[#0B2545] uppercase">{serviceId.replace(/_/g, ' ')}</span>
              </div>
            </div>

            <p>
              All biometric parameters, civil registers, and background verifications have been duly finalized in strict compliance with the Diplomatic and Consular Regulations of the Federal Republic of Somalia.
            </p>
            <p>
              The subject document is authenticated and cleared for official legal presentation, international transit, and ministerial recognition.
            </p>
          </div>

          {/* Endorsement and Signatures */}
          <div className="mt-8 pt-6 border-t border-slate-300 flex items-end justify-between px-2">
            <div className="flex flex-col items-center">
              <QRCodeView value={`https://somaliembassy.ug/verify/${referenceNumber}`} size={84} />
              <span className="text-[9px] font-mono text-slate-500 mt-1">Digital Seal Validated</span>
            </div>

            <div className="text-center space-y-1">
              <div className="w-40 border-b border-slate-800 pb-1">
                <span className="font-serif italic text-sm text-[#0B2545] font-semibold">
                  {assignedOfficerName || 'Farhan Abdi Mire'}
                </span>
              </div>
              <p className="text-[11px] font-bold text-[#0B2545]">Consular Affairs Officer</p>
              <p className="text-[9px] text-slate-500">For the Ambassador</p>
              <p className="text-[9px] font-mono text-slate-400">Date: {updatedAt}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
