import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficialReceiptModal } from '../common/OfficialReceiptModal';
import { ConsularApplication } from '../../types';
import {
  CreditCard,
  DollarSign,
  Search,
  CheckCircle2,
  Clock,
  Building,
  Smartphone,
  Printer,
  Download,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { applications, verifyBankTransfer, settings } = useApp();

  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [selectedReceiptApp, setSelectedReceiptApp] = useState<ConsularApplication | null>(null);
  const [bankProofModalApp, setBankProofModalApp] = useState<ConsularApplication | null>(null);

  // Revenue totals
  const totalRevenueUsd = applications
    .filter((a) => a.payment.status === 'paid')
    .reduce((acc, a) => acc + (a.payment.totalAmount || 0), 0);

  const awaitingProofCount = applications.filter((a) => a.payment.status === 'awaiting_verification').length;

  const filteredApps = applications.filter((a) => {
    if (filterMethod !== 'all' && a.payment.method !== filterMethod) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.referenceNumber.toLowerCase().includes(q) ||
      a.applicant.fullName.toLowerCase().includes(q) ||
      (a.payment.transactionReference && a.payment.transactionReference.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
          Consular Financial Transactions & Revenue
        </h1>
        <p className="text-xs text-slate-500">
          Manage Mobile Money, Visa/Mastercard, and Stanbic Bank transfer reconciliations.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500">Total Collected Revenue (USD)</span>
          <p className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ${totalRevenueUsd.toLocaleString()} USD
          </p>
          <span className="text-[11px] text-slate-400 font-mono">
            UGX {(totalRevenueUsd * settings.exchangeRateUsdToUgx).toLocaleString()}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500">Awaiting Bank Verification</span>
          <p className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400">
            {awaitingProofCount} Slips
          </p>
          <span className="text-[11px] text-slate-400">Stanbic Bank Embassy Account</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500">Official Exchange Rate Peg</span>
          <p className="font-mono text-2xl font-bold text-[#C9A227]">
            3,850 UGX / $1
          </p>
          <span className="text-[11px] text-slate-400">Master-Authorized Rate</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction ref, applicant, receipt..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500">Method:</span>
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Methods</option>
            <option value="mtn_momo">MTN Mobile Money</option>
            <option value="airtel_money">Airtel Money</option>
            <option value="card">Visa / Mastercard</option>
            <option value="bank_transfer">Stanbic Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-[#0B2545] text-white">
              <tr>
                <th className="py-3 px-4">Receipt / Ref</th>
                <th className="py-3 px-4">Citizen Name</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Amount (USD)</th>
                <th className="py-3 px-4">Amount (UGX)</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {app.payment.receiptNumber || app.referenceNumber}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      Tx: {app.payment.transactionReference || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {app.applicant.fullName}
                  </td>
                  <td className="py-3 px-4 capitalize text-slate-600 dark:text-slate-400">
                    {app.serviceId.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    ${app.payment.totalAmount}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                    UGX {((app.payment.amountInUgx || app.payment.totalAmount * settings.exchangeRateUsdToUgx)).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 capitalize text-slate-700 dark:text-slate-300">
                    {app.payment.method?.replace(/_/g, ' ') || 'Pending'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        app.payment.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : app.payment.status === 'awaiting_verification'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {app.payment.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {app.payment.status === 'awaiting_verification' && (
                        <button
                          onClick={() => setBankProofModalApp(app)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-[11px]"
                        >
                          Verify Slip
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedReceiptApp(app)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Reprint Official Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Proof Verification Modal */}
      {bankProofModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-300 dark:border-slate-800 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-[#0B2545] dark:text-white">
              Verify Stanbic Bank Transfer Deposit Slip
            </h3>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-1">
              <p>Applicant: <strong>{bankProofModalApp.applicant.fullName}</strong></p>
              <p>Dossier: <strong>{bankProofModalApp.referenceNumber}</strong></p>
              <p>Expected Amount: <strong>${bankProofModalApp.payment.totalAmount} USD</strong></p>
            </div>

            <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center bg-slate-100 dark:bg-slate-800">
              <FileText className="w-8 h-8 text-blue-500 mx-auto mb-1" />
              <span className="font-bold text-slate-800 dark:text-slate-200">Stanbic_Bank_Deposit_Slip.pdf</span>
              <p className="text-[10px] text-slate-500 mt-1">Verified on Embassy Stanbic Online Banking Portal</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  verifyBankTransfer(bankProofModalApp.id, false, 'Deposit slip details not found on Stanbic statement.');
                  setBankProofModalApp(null);
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded"
              >
                Decline Slip
              </button>
              <button
                onClick={() => {
                  verifyBankTransfer(bankProofModalApp.id, true);
                  setBankProofModalApp(null);
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
              >
                Approve & Mark Paid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceiptApp && (
        <OfficialReceiptModal
          application={selectedReceiptApp}
          onClose={() => setSelectedReceiptApp(null)}
        />
      )}
    </div>
  );
};
