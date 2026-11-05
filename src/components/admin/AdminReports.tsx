import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { applications, settings } = useApp();

  const [dateRange, setDateRange] = useState<'30_days' | 'quarter' | 'year'>('30_days');
  const [reportType, setReportType] = useState<'revenue' | 'services' | 'turnaround'>('revenue');

  // Revenue calculation
  const totalPaidApps = applications.filter((a) => a.payment.status === 'paid');
  const totalRevenueUsd = totalPaidApps.reduce((acc, a) => acc + a.payment.totalAmount, 0);
  const totalRevenueUgx = totalPaidApps.reduce(
    (acc, a) => acc + (a.payment.amountInUgx || a.payment.totalAmount * settings.exchangeRateUsdToUgx),
    0
  );

  // Group by service
  const serviceStats: Record<string, { count: number; revenue: number }> = {};
  applications.forEach((a) => {
    if (!serviceStats[a.serviceId]) {
      serviceStats[a.serviceId] = { count: 0, revenue: 0 };
    }
    serviceStats[a.serviceId].count += 1;
    if (a.payment.status === 'paid') {
      serviceStats[a.serviceId].revenue += a.payment.totalAmount;
    }
  });

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = ['Reference Number', 'Applicant Name', 'Service', 'Date Submitted', 'Status', 'Payment Method', 'Amount USD', 'Amount UGX'];
    const rows = applications.map((a) => [
      a.referenceNumber,
      `"${a.applicant.fullName}"`,
      a.serviceId,
      a.submittedAt,
      a.status,
      a.payment.method || 'N/A',
      a.payment.totalAmount,
      a.payment.amountInUgx || a.payment.totalAmount * settings.exchangeRateUsdToUgx,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `somali_embassy_consular_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
            Consular Analytics & Ministerial Reports
          </h1>
          <p className="text-xs text-slate-500">
            Export financial audits, service volumes, and SLA performance reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-[#0B2545] hover:bg-black text-[#C9A227] font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500">Period Consular Revenue</span>
          <p className="font-mono text-2xl font-bold text-[#0B2545] dark:text-white">
            ${totalRevenueUsd.toLocaleString()} USD
          </p>
          <span className="text-[11px] font-mono text-[#C9A227]">
            UGX {totalRevenueUgx.toLocaleString()}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500">Total Processed Applications</span>
          <p className="font-mono text-2xl font-bold text-[#4189DD]">
            {applications.length} Records
          </p>
          <span className="text-[11px] text-slate-400">100% Digital Registry</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500">Average Turnaround Time</span>
          <p className="font-mono text-2xl font-bold text-[#2E6B3F]">
            3.4 Days
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">98.2% within 7-day SLA</span>
        </div>
      </div>

      {/* Breakdown by Service Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden p-6 space-y-4">
        <h3 className="font-serif font-bold text-base text-[#0B2545] dark:text-white">
          Service Volume & Revenue Realization Summary
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-[#0B2545] text-white">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Consular Service</th>
                <th className="py-2.5 px-4 font-semibold text-right">Total Submissions</th>
                <th className="py-2.5 px-4 font-semibold text-right">Revenue Generated (USD)</th>
                <th className="py-2.5 px-4 font-semibold text-right">Revenue Generated (UGX)</th>
                <th className="py-2.5 px-4 font-semibold text-right">Volume Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {Object.entries(serviceStats)
                .sort((a, b) => b[1].revenue - a[1].revenue)
                .map(([serviceId, stat]) => {
                  const share = Math.round((stat.count / applications.length) * 100);

                  return (
                    <tr key={serviceId} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white capitalize">
                        {serviceId.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3 px-4 font-mono text-right text-slate-700 dark:text-slate-300">
                        {stat.count}
                      </td>
                      <td className="py-3 px-4 font-mono text-right font-bold text-slate-900 dark:text-white">
                        ${stat.revenue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-right text-slate-600 dark:text-slate-400">
                        UGX {(stat.revenue * settings.exchangeRateUsdToUgx).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-right text-slate-500">
                        {share}%
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
