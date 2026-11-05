import React from 'react';
import { ConsularApplication } from '../../types';
import { QRCodeView } from './QRCodeView';
import { X, Printer, Download, CheckCircle2, Shield } from 'lucide-react';

interface OfficialReceiptModalProps {
  application: ConsularApplication;
  onClose: () => void;
}

export const OfficialReceiptModal: React.FC<OfficialReceiptModalProps> = ({ application, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const { applicant, payment, appointment, referenceNumber, serviceId, submittedAt } = application;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden border border-slate-300 relative print:border-none print:shadow-none print:m-0 print:max-w-full">
        {/* Modal Action Controls (Hidden on Print) */}
        <div className="no-print bg-[#0B2545] text-white px-6 py-3 flex items-center justify-between border-b border-[#C9A227]/30">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#C9A227]" />
            <span className="font-semibold text-sm">Official Consular Payment Receipt & Acknowledgment Slip</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4189DD] hover:bg-[#3476c5] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div className="p-8 sm:p-10 space-y-6 bg-white relative">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
            <img
              src="/public/assets/aistudio/Astaanta_dalka_cd5ae664.jfif"
              alt="Watermark"
              referrerPolicy="no-referrer"
              className="w-80 h-80 object-contain filter grayscale"
            />
          </div>

          {/* Header with Coat of Arms */}
          <div className="text-center space-y-2 border-b-2 border-[#0B2545] pb-5">
            <div className="flex justify-center">
              <img
                src="/public/assets/aistudio/Astaanta_dalka_cd5ae664.jfif"
                alt="Coat of Arms of the Federal Republic of Somalia"
                referrerPolicy="no-referrer"
                className="w-20 h-20 object-contain drop-shadow"
              />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#0B2545] uppercase">
              Embassy of the Federal Republic of Somalia
            </h2>
            <p className="text-xs font-medium tracking-wider text-slate-600 uppercase">
              Kampala, Uganda · Consular & Civil Registration Bureau
            </p>
            <div className="pt-1 flex items-center justify-center gap-2 text-[11px] font-mono text-[#0B2545]">
              <span>PLOT 46, NAKASERO ROAD, KAMPALA</span>
              <span>·</span>
              <span>TEL: +256 414 256 098</span>
            </div>
          </div>

          {/* Reference & QR Code Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                Consular Reference Number
              </span>
              <div className="font-mono text-xl sm:text-2xl font-bold text-[#0B2545] tracking-wide">
                {referenceNumber}
              </div>
              <p className="text-xs text-slate-600">
                Issued on: <span className="font-medium text-slate-800">{submittedAt}</span>
              </p>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Payment Status: {payment.status.toUpperCase()}</span>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-center">
              <QRCodeView value={`https://somaliembassy.ug/verify/${referenceNumber}`} size={96} />
              <span className="text-[10px] font-mono text-slate-500 mt-1">Scan to Verify</span>
            </div>
          </div>

          {/* Applicant & Service Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Applicant Full Name:</span>
              <p className="font-semibold text-slate-900 text-sm">{applicant.fullName}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Passport / National ID:</span>
              <p className="font-mono font-semibold text-slate-900">{applicant.passportOrIdNumber || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Date of Birth / Gender:</span>
              <p className="font-medium text-slate-800">{applicant.dob} ({applicant.gender})</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Phone / WhatsApp:</span>
              <p className="font-medium text-slate-800">{applicant.phone}</p>
            </div>
            <div className="col-span-2 space-y-1">
              <span className="text-slate-500 font-medium">Consular Service Requested:</span>
              <p className="font-semibold text-[#0B2545] text-sm uppercase">
                {serviceId.replace(/_/g, ' ')}
              </p>
            </div>
          </div>

          {/* Itemized Financial Fee Breakdown */}
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#0B2545] text-white">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Service Description</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Fee (USD)</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Fee (UGX Equivalent)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    Official Embassy Consular Fee ({serviceId.replace(/_/g, ' ')})
                  </td>
                  <td className="py-2.5 px-4 font-mono text-right text-slate-800">
                    ${payment.serviceFee.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-right text-slate-800">
                    UGX {(payment.amountInUgx || payment.serviceFee * 3850).toLocaleString()}
                  </td>
                </tr>
                {payment.expressFee > 0 && (
                  <tr>
                    <td className="py-2 px-4 text-slate-600">Priority Express Consular Surcharge</td>
                    <td className="py-2 px-4 font-mono text-right text-slate-600">
                      ${payment.expressFee.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 font-mono text-right text-slate-600">
                      UGX {(payment.expressFee * 3850).toLocaleString()}
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold text-slate-900">
                  <td className="py-3 px-4 text-[#0B2545]">TOTAL AMOUNT RECEIVED</td>
                  <td className="py-3 px-4 font-mono text-right text-[#0B2545] text-sm">
                    ${payment.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-mono text-right text-[#0B2545] text-sm">
                    UGX {((payment.amountInUgx || payment.totalAmount * 3850)).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment & Appointment Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-semibold text-slate-700">Payment Verification:</span>
              <p className="text-slate-600">Method: <span className="font-medium text-slate-900">{payment.method?.replace(/_/g, ' ').toUpperCase() || 'Verified'}</span></p>
              <p className="font-mono text-slate-600">Tx Ref: {payment.transactionReference || 'MOMO-CONFIRMED'}</p>
              <p className="font-mono text-slate-600">Receipt No: {payment.receiptNumber || 'REC-SEK-2026'}</p>
            </div>

            <div className="p-3 bg-amber-50/60 rounded border border-amber-200 space-y-1">
              <span className="font-semibold text-amber-900">Biometrics / Collection Appointment:</span>
              {appointment ? (
                <>
                  <p className="text-slate-800">Date: <span className="font-bold">{appointment.date}</span></p>
                  <p className="text-slate-800">Time: <span className="font-bold">{appointment.time}</span></p>
                  <p className="text-slate-700">Counter: <span className="font-medium">{appointment.counter || 'Window 1'}</span></p>
                </>
              ) : (
                <p className="text-slate-600 italic">No specific slot selected yet. Please book via portal.</p>
              )}
            </div>
          </div>

          {/* Instructions & Consular Seal Box */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] text-slate-500">
            <div className="space-y-1 max-w-sm">
              <p className="font-semibold text-slate-700">Important Instructions:</p>
              <p>1. Present this printed slip along with your original valid documents at Embassy Reception.</p>
              <p>2. Arrive at least 15 minutes before your scheduled appointment time.</p>
              <p>3. Biometrics and photograph capture will occur in the Consular Wing.</p>
            </div>

            {/* Official Stamp Marker */}
            <div className="w-36 h-24 border-2 border-dashed border-[#0B2545]/40 rounded-lg flex flex-col items-center justify-center text-center p-2">
              <span className="text-[9px] font-bold text-[#0B2545] uppercase tracking-wider">
                Official Embassy Stamp & Officer Signature
              </span>
              <span className="text-[8px] text-slate-400 mt-1">Federal Republic of Somalia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
