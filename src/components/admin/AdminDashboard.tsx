import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { applications, settings, setAdminTab, setSelectedApplication, auditLogs } = useApp();

  // Metrics
  const totalApps = applications.length;
  const pendingApps = applications.filter((a) => a.status === 'submitted' || a.status === 'payment_pending').length;
  const reviewApps = applications.filter((a) => a.status === 'under_review' || a.status === 'more_info_needed').length;
  const approvedApps = applications.filter((a) => a.status === 'approved' || a.status === 'printed' || a.status === 'ready_for_collection').length;
  const rejectedApps = applications.filter((a) => a.status === 'rejected').length;

  const revenueUsd = applications
    .filter((a) => a.payment.status === 'paid')
    .reduce((acc, a) => acc + (a.payment.totalAmount || 0), 0);

  const revenueUgx = applications
    .filter((a) => a.payment.status === 'paid')
    .reduce((acc, a) => acc + (a.payment.amountInUgx || a.payment.totalAmount * settings.exchangeRateUsdToUgx), 0);

  const appointmentsToday = applications.filter((a) => a.appointment && a.appointment.date === '2026-11-05').length;

  // Overdue SLA alerts: older than 7 days
  const overdueApps = applications.filter((a) => {
    return a.status !== 'collected' && a.status !== 'rejected' && a.slaDeadline < '2026-11-06';
  });

  // Services distribution
  const serviceDistribution: Record<string, number> = {};
  applications.forEach((a) => {
    serviceDistribution[a.serviceId] = (serviceDistribution[a.serviceId] || 0) + 1;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Overdue SLA Alert if any */}
      {overdueApps.length > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">
                {overdueApps.length} Consular Applications Approaching or Exceeding 7-Day SLA Limit
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Requires priority biometric enrollment or ministerial stamp review.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAdminTab('pending')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shrink-0 transition-colors"
          >
            View Queue
          </button>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Dossiers</span>
            <FileText className="w-4 h-4 text-[#4189DD]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#0B2545] dark:text-white">
            {totalApps}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18% this month</span>
          </span>
        </div>

        {/* Pending & In Review */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>In Processing Queue</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">
            {pendingApps + reviewApps}
          </div>
          <span className="text-[11px] text-slate-500">
            {pendingApps} payment · {reviewApps} review
          </span>
        </div>

        {/* Approved */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Approved & Issued</span>
            <CheckCircle2 className="w-4 h-4 text-[#2E6B3F]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#2E6B3F] dark:text-emerald-400">
            {approvedApps}
          </div>
          <span className="text-[11px] text-slate-500">Ready for collection</span>
        </div>

        {/* Revenue */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Consular Revenue</span>
            <DollarSign className="w-4 h-4 text-[#C9A227]" />
          </div>
          <div className="font-mono text-xl font-bold text-[#0B2545] dark:text-white">
            ${revenueUsd.toLocaleString()} <span className="text-xs font-normal text-slate-400">USD</span>
          </div>
          <p className="text-[11px] font-mono text-[#C9A227] truncate">
            UGX {revenueUgx.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts & Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Services Breakdown Visual Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-[#0B2545] dark:text-white">
                Applications by Consular Service
              </h3>
              <p className="text-xs text-slate-500">Distribution across active citizen categories</p>
            </div>
            <span className="text-xs font-mono text-[#4189DD] font-semibold">
              30-Day Window
            </span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(serviceDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([serviceId, count]) => {
                const percentage = Math.round((count / totalApps) * 100);

                return (
                  <div key={serviceId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">
                        {serviceId.replace(/_/g, ' ')}
                      </span>
                      <span className="font-mono text-slate-500">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-[#4189DD] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right Col: Quick Status Summary & Appointments Today */}
        <div className="space-y-6">
          {/* Appointments Today widget */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[#0B2545] dark:text-white">
                Today's Biometrics
              </h3>
              <Calendar className="w-4 h-4 text-[#C9A227]" />
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Scheduled Slots</span>
                <p className="font-mono text-2xl font-bold text-[#0B2545] dark:text-white">
                  {appointmentsToday || 8}
                </p>
              </div>
              <button
                onClick={() => setAdminTab('appointments')}
                className="text-xs font-semibold text-[#4189DD] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <p>• Room 1 (Passports): 5 citizens</p>
              <p>• Room 2 (NIRA Biometrics): 3 citizens</p>
              <p>• Counter 1 (Notary / Wakaalad): 2 appointments</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#0B2545] dark:text-white">
              Expedited Workflows
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setAdminTab('pending')}
                className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-200 text-left cursor-pointer"
              >
                Review Applications
              </button>
              <button
                onClick={() => setAdminTab('payments')}
                className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-200 text-left cursor-pointer"
              >
                Verify Bank Slips
              </button>
              <button
                onClick={() => setAdminTab('issuance')}
                className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-200 text-left cursor-pointer"
              >
                Dispatch Stamped
              </button>
              <button
                onClick={() => setAdminTab('reports')}
                className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-200 text-left cursor-pointer"
              >
                Export Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#4189DD]" />
            <h3 className="font-serif text-base font-bold text-[#0B2545] dark:text-white">
              Live Consular Activity Log
            </h3>
          </div>
          <span className="text-xs text-slate-400">Real-time diplomatic audit trail</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {auditLogs.slice(0, 6).map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded mr-2">
                  {log.action}
                </span>
                <span className="text-slate-600 dark:text-slate-300">{log.details}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 shrink-0 text-[11px]">
                <span className="font-medium text-slate-700 dark:text-slate-300">{log.actorName}</span>
                <span>·</span>
                <span className="font-mono">{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
