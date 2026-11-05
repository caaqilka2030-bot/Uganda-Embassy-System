import React from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_STAFF_USERS } from '../../constants/initialData';
import { StaffUser, UserRole } from '../../types';
import {
  LayoutDashboard,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  CreditCard,
  Calendar,
  Award,
  BarChart3,
  Sliders,
  UserCheck,
  Bell,
  History,
  Settings,
  LogOut,
  Moon,
  Sun,
  Shield,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    adminTab,
    setAdminTab,
    currentStaff,
    loginAsStaff,
    logoutStaff,
    isDarkMode,
    toggleDarkMode,
    setCurrentView,
    applications,
  } = useApp();

  const isMaster = currentStaff?.role === 'master';
  const role = currentStaff?.role || 'consular_officer';

  // Count pending & in review applications for badge indicators
  const pendingCount = applications.filter(
    (a) => a.status === 'submitted' || a.status === 'under_review' || a.status === 'payment_pending'
  ).length;

  const awaitingPaymentCount = applications.filter((a) => a.payment.status === 'awaiting_verification').length;

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'All Applications', icon: FileText, count: applications.length },
    { id: 'pending', label: 'Pending & Review', icon: Clock, count: pendingCount },
    { id: 'approved', label: 'Approved Queue', icon: CheckCircle2 },
    { id: 'rejected', label: 'Rejected / On Hold', icon: XCircle },
    { id: 'issuance', label: 'Document Issuance', icon: Award },
    { id: 'appointments', label: 'Appointments Calendar', icon: Calendar },
    { id: 'payments', label: 'Payments & Revenue', icon: CreditCard, count: awaitingPaymentCount },
    { id: 'customers', label: 'Citizen Directory', icon: Users },
    { id: 'reports', label: 'Reports & Exports', icon: BarChart3 },
    // Master Only
    ...(isMaster
      ? [
          { id: 'fees_management', label: 'Services & Fees', icon: Sliders },
          { id: 'users', label: 'Staff & Roles', icon: UserCheck },
          { id: 'notifications', label: 'Messages & Templates', icon: Bell },
          { id: 'audit_log', label: 'Audit Trail', icon: History },
          { id: 'settings', label: 'System Settings', icon: Settings },
        ]
      : []),
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8F6F0] text-slate-900'}`}>
      {/* Top Demo Helper Bar: Switch Roles Instantaneously for Testing */}
      <div className="bg-[#07192F] text-white px-4 py-1.5 text-xs border-b border-white/10 flex flex-wrap items-center justify-between gap-2 z-30">
        <div className="flex items-center gap-2">
          <span className="text-[#C9A227] font-bold uppercase tracking-wider text-[10px]">
            Demo Role Switcher:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {INITIAL_STAFF_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => loginAsStaff(user)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                  currentStaff?.id === user.id
                    ? 'bg-[#4189DD] text-white font-bold'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {user.role.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('home')}
            className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[#0B2545] text-slate-300 flex flex-col justify-between shrink-0 border-r border-[#C9A227]/30 shadow-md">
          {/* Brand header */}
          <div className="p-4 border-b border-white/10 flex items-center gap-3">
            <img
              src="/public/assets/aistudio/Astaanta_dalka_cd5ae664.jfif"
              alt="Coat of arms"
              referrerPolicy="no-referrer"
              className="w-10 h-10 object-contain drop-shadow"
            />
            <div>
              <h2 className="font-serif font-bold text-sm text-white leading-tight">
                Consular Back Office
              </h2>
              <span className="text-[10px] text-[#C9A227] font-semibold">
                Embassy of Somalia · Kampala
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#4189DD] text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#C9A227]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                        isActive ? 'bg-white text-[#0B2545]' : 'bg-white/15 text-white'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User profile & Dark Mode toggle footer */}
          <div className="p-4 border-t border-white/10 space-y-3 bg-[#07192F]">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white leading-snug truncate max-w-[140px]">
                  {currentStaff?.name || 'Consular Staff'}
                </p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#C9A227] text-[#0B2545]">
                  {currentStaff?.role.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Dark mode switch */}
              <button
                onClick={toggleDarkMode}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={logoutStaff}
              className="w-full py-1.5 px-3 text-xs text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-rose-800/40"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Portal</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
