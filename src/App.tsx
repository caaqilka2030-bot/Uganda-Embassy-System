import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/public/LandingPage';
import { ServicesPage } from './components/public/ServicesPage';
import { FeesPage } from './components/public/FeesPage';
import { TrackApplicationPage } from './components/public/TrackApplicationPage';
import { ApplicationWizard } from './components/application/ApplicationWizard';
import { EmbassyAssistant } from './components/ai/EmbassyAssistant';
import { ToastContainer } from './components/common/ToastContainer';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminApplications } from './components/admin/AdminApplications';
import { AdminPayments } from './components/admin/AdminPayments';
import { AdminAppointments } from './components/admin/AdminAppointments';
import { AdminIssuance } from './components/admin/AdminIssuance';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminReports } from './components/admin/AdminReports';
import { AdminFeesManagement } from './components/admin/AdminFeesManagement';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminAuditLog } from './components/admin/AdminAuditLog';
import { AdminSettings } from './components/admin/AdminSettings';

const MainRouter: React.FC = () => {
  const { currentView, adminTab } = useApp();

  if (currentView === 'admin') {
    return (
      <AdminLayout>
        {adminTab === 'dashboard' && <AdminDashboard />}
        {adminTab === 'applications' && <AdminApplications />}
        {adminTab === 'pending' && <AdminApplications filterStatus="under_review" />}
        {adminTab === 'approved' && <AdminApplications filterStatus="approved" />}
        {adminTab === 'rejected' && <AdminApplications filterStatus="rejected" />}
        {adminTab === 'issuance' && <AdminIssuance />}
        {adminTab === 'appointments' && <AdminAppointments />}
        {adminTab === 'payments' && <AdminPayments />}
        {adminTab === 'customers' && <AdminCustomers />}
        {adminTab === 'reports' && <AdminReports />}
        {adminTab === 'fees_management' && <AdminFeesManagement />}
        {adminTab === 'users' && <AdminUsers />}
        {adminTab === 'notifications' && <AdminSettings />}
        {adminTab === 'audit_log' && <AdminAuditLog />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0]">
      <Header />
      <main className="flex-1">
        {currentView === 'home' && <LandingPage />}
        {currentView === 'services' && <ServicesPage />}
        {currentView === 'fees' && <FeesPage />}
        {currentView === 'track' && <TrackApplicationPage />}
        {currentView === 'apply' && <ApplicationWizard />}
      </main>
      <Footer />
      <EmbassyAssistant />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <ToastContainer />
      <MainRouter />
    </AppProvider>
  );
}
