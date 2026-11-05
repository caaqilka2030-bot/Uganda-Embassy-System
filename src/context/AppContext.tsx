import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  StaffUser,
  CitizenUser,
  EmbassyService,
  ConsularApplication,
  SystemSettings,
  AuditLogEntry,
  PaymentTransaction,
  ApplicationStatus,
  PaymentStatus,
  PaymentMethod,
  ServiceId,
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_STAFF_USERS,
  INITIAL_CITIZENS,
  INITIAL_APPLICATIONS,
  INITIAL_SETTINGS,
  INITIAL_AUDIT_LOGS,
} from '../constants/initialData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;

  // View & Routing
  currentView: 'home' | 'services' | 'fees' | 'track' | 'apply' | 'admin' | 'citizen_portal';
  setCurrentView: (view: 'home' | 'services' | 'fees' | 'track' | 'apply' | 'admin' | 'citizen_portal') => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;

  // Auth
  currentStaff: StaffUser | null;
  currentCitizen: CitizenUser | null;
  loginAsStaff: (user: StaffUser) => void;
  logoutStaff: () => void;
  loginAsCitizen: (citizen: CitizenUser) => void;
  logoutCitizen: () => void;

  // Services & Fees
  services: EmbassyService[];
  updateServiceFee: (serviceId: ServiceId, feeUsd: number | null, feeUgx: number | null, isPending: boolean) => void;
  toggleServiceEnabled: (serviceId: ServiceId) => void;

  // Applications
  applications: ConsularApplication[];
  selectedApplication: ConsularApplication | null;
  setSelectedApplication: (app: ConsularApplication | null) => void;
  submitApplication: (appData: Omit<ConsularApplication, 'id' | 'referenceNumber' | 'submittedAt' | 'updatedAt' | 'timeline' | 'notes' | 'slaDeadline'>) => ConsularApplication;
  updateApplicationStatus: (id: string, status: ApplicationStatus, notes?: string) => void;
  assignApplicationOfficer: (id: string, officerId: string, officerName: string) => void;
  addApplicationNote: (id: string, content: string, isInternalOnly?: boolean) => void;
  confirmPayment: (applicationId: string, method: PaymentMethod, reference?: string) => void;
  verifyBankTransfer: (applicationId: string, approved: boolean, reason?: string) => void;
  setApplicationCustomFee: (applicationId: string, feeUsd: number, feeUgx?: number) => void;
  bookAppointment: (applicationId: string, date: string, time: string, counter?: string) => void;
  checkInAppointment: (applicationId: string) => void;
  markDocumentPrinted: (applicationId: string) => void;
  markDocumentReady: (applicationId: string) => void;
  markDocumentCollected: (applicationId: string, collectorName: string, collectorId: string, signature: string) => void;
  runAiDocPrecheck: (applicationId: string, docId: string) => Promise<void>;

  // Drafts
  currentDraft: any | null;
  saveDraft: (data: any) => void;
  clearDraft: () => void;

  // Citizens
  citizens: CitizenUser[];
  toggleFlagCitizen: (citizenId: string, reason?: string) => void;

  // Settings
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;

  // Staff users (Master only)
  staffUsers: StaffUser[];
  addStaffUser: (user: Omit<StaffUser, 'id'>) => void;
  updateStaffUserStatus: (id: string, status: 'active' | 'suspended') => void;

  // Audit Logs & Toasts
  auditLogs: AuditLogEntry[];
  logAudit: (action: string, details: string) => void;
  toasts: Toast[];
  showToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: 'somali_embassy_lang',
  DARK_MODE: 'somali_embassy_dark_mode',
  SERVICES: 'somali_embassy_services',
  APPLICATIONS: 'somali_embassy_applications',
  SETTINGS: 'somali_embassy_settings',
  STAFF_USERS: 'somali_embassy_staff_users',
  CITIZENS: 'somali_embassy_citizens',
  AUDIT: 'somali_embassy_audit_logs',
  DRAFT: 'somali_embassy_draft',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'en';
  });

  const [isDarkMode, setIsDarkModeState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
  });

  const [currentView, setCurrentView] = useState<'home' | 'services' | 'fees' | 'track' | 'apply' | 'admin' | 'citizen_portal'>('home');
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  const [currentStaff, setCurrentStaff] = useState<StaffUser | null>(INITIAL_STAFF_USERS[0]); // default to master for immediate testing
  const [currentCitizen, setCurrentCitizen] = useState<CitizenUser | null>(INITIAL_CITIZENS[0]);

  const [services, setServices] = useState<EmbassyService[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [applications, setApplications] = useState<ConsularApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [selectedApplication, setSelectedApplication] = useState<ConsularApplication | null>(null);

  const [settings, setSettingsState] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF_USERS);
    return saved ? JSON.parse(saved) : INITIAL_STAFF_USERS;
  });

  const [citizens, setCitizens] = useState<CitizenUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CITIZENS);
    return saved ? JSON.parse(saved) : INITIAL_CITIZENS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [currentDraft, setCurrentDraft] = useState<any | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DRAFT);
    return saved ? JSON.parse(saved) : null;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF_USERS, JSON.stringify(staffUsers));
  }, [staffUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CITIZENS, JSON.stringify(citizens));
  }, [citizens]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleDarkMode = () => {
    setIsDarkModeState((prev) => !prev);
  };

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAudit = (action: string, details: string) => {
    const newEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actorName: currentStaff ? currentStaff.name : currentCitizen ? currentCitizen.fullName : 'System / Citizen',
      actorRole: currentStaff ? currentStaff.role : 'citizen',
      action,
      details,
      ipAddress: '192.168.10.' + Math.floor(Math.random() * 50 + 1),
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const loginAsStaff = (user: StaffUser) => {
    setCurrentStaff(user);
    logAudit('STAFF_LOGIN', `Logged into consular portal as ${user.name} (${user.role})`);
    showToast('info', `Signed in as ${user.name}`);
  };

  const logoutStaff = () => {
    if (currentStaff) {
      logAudit('STAFF_LOGOUT', `Logged out: ${currentStaff.name}`);
    }
    setCurrentStaff(null);
    setCurrentView('home');
    showToast('info', 'Logged out from staff portal');
  };

  const loginAsCitizen = (citizen: CitizenUser) => {
    setCurrentCitizen(citizen);
    showToast('success', `Welcome, ${citizen.fullName}`);
  };

  const logoutCitizen = () => {
    setCurrentCitizen(null);
    showToast('info', 'Citizen logged out');
  };

  const updateServiceFee = (serviceId: ServiceId, feeUsd: number | null, feeUgx: number | null, isPending: boolean) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, feeUsd, feeUgx, isFeePending: isPending } : s))
    );
    logAudit('FEE_UPDATE', `Updated fee for service: ${serviceId}. USD: ${feeUsd ?? 'Pending'}, UGX: ${feeUgx ?? 'N/A'}`);
    showToast('success', 'Service fee updated successfully');
  };

  const toggleServiceEnabled = (serviceId: ServiceId) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, isEnabled: !s.isEnabled } : s))
    );
    showToast('info', `Service status toggled`);
  };

  const submitApplication = (
    appData: Omit<ConsularApplication, 'id' | 'referenceNumber' | 'submittedAt' | 'updatedAt' | 'timeline' | 'notes' | 'slaDeadline'>
  ): ConsularApplication => {
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Auto reference number SEK-2026-XXXXXX
    const count = applications.length + 101;
    const refNum = `SEK-2026-${String(count).padStart(6, '0')}`;

    const newApp: ConsularApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      referenceNumber: refNum,
      submittedAt: timestamp,
      updatedAt: timestamp,
      slaDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: [],
      timeline: [
        {
          id: `t-${Date.now()}-1`,
          status: 'submitted',
          title: 'Application Submitted Online',
          description: `Application received for ${appData.serviceId.replace(/_/g, ' ')}. Reference assigned.`,
          timestamp,
          actor: appData.applicant.fullName,
        },
      ],
    };

    if (appData.payment.status === 'paid') {
      newApp.timeline.push({
        id: `t-${Date.now()}-2`,
        status: 'payment_verified',
        title: 'Payment Confirmed',
        description: `Payment of ${appData.payment.currency} ${appData.payment.totalAmount} confirmed via ${appData.payment.method?.replace(/_/g, ' ')}.`,
        timestamp,
        actor: 'System Payment Gateway',
      });
    }

    setApplications((prev) => [newApp, ...prev]);
    logAudit('NEW_APPLICATION', `New submission: ${refNum} for ${newApp.applicant.fullName}`);
    clearDraft();
    return newApp;
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus, notes?: string) => {
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        const newTimelineEvent = {
          id: `t-${Date.now()}`,
          status,
          title: `Status updated to ${status.replace(/_/g, ' ').toUpperCase()}`,
          description: notes || `Application transitioned to ${status.replace(/_/g, ' ')}.`,
          timestamp,
          actor: currentStaff ? currentStaff.name : 'Consular Desk',
        };

        const updatedApp = {
          ...app,
          status,
          updatedAt: timestamp,
          timeline: [newTimelineEvent, ...app.timeline],
          rejectionReason: status === 'rejected' ? notes : app.rejectionReason,
          infoRequestMessage: status === 'more_info_needed' ? notes : app.infoRequestMessage,
        };

        if (status === 'printed' && !updatedApp.issuance?.printedAt) {
          updatedApp.issuance = {
            ...updatedApp.issuance,
            printedAt: timestamp,
            printedBy: currentStaff?.name || 'Officer',
          };
        }
        if (status === 'ready_for_collection' && !updatedApp.issuance?.readyAt) {
          updatedApp.issuance = {
            ...updatedApp.issuance,
            readyAt: timestamp,
          };
        }

        return updatedApp;
      })
    );

    logAudit('STATUS_CHANGE', `Application ${id} status changed to ${status}`);
    showToast('success', `Status updated to ${status.replace(/_/g, ' ')}`);
  };

  const assignApplicationOfficer = (id: string, officerId: string, officerName: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, assignedOfficerId: officerId, assignedOfficerName: officerName } : app))
    );
    logAudit('OFFICER_ASSIGNED', `Assigned application ${id} to ${officerName}`);
    showToast('info', `Assigned to ${officerName}`);
  };

  const addApplicationNote = (id: string, content: string, isInternalOnly: boolean = true) => {
    const timestamp = new Date().toLocaleString();
    const newNote = {
      id: `note-${Date.now()}`,
      authorName: currentStaff?.name || 'Consular Staff',
      authorRole: currentStaff?.role || 'consular_officer',
      content,
      createdAt: timestamp,
      isInternalOnly,
    };

    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, notes: [newNote, ...app.notes] } : app))
    );
    showToast('success', 'Note added to application');
  };

  const confirmPayment = (applicationId: string, method: PaymentMethod, reference?: string) => {
    const timestamp = new Date().toLocaleString();
    const txRef = reference || `TX-${Date.now().toString().slice(-6)}`;
    const recNo = `REC-SEK-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;
        return {
          ...app,
          status: 'under_review',
          payment: {
            ...app.payment,
            status: 'paid',
            method,
            transactionReference: txRef,
            paidAt: timestamp,
            receiptNumber: recNo,
          },
          timeline: [
            {
              id: `t-${Date.now()}`,
              status: 'payment_verified',
              title: 'Fee Payment Verified',
              description: `Paid via ${method.replace(/_/g, ' ')}. Reference: ${txRef}. Receipt #${recNo} generated.`,
              timestamp,
              actor: currentStaff?.name || 'Payment Gateway',
            },
            ...app.timeline,
          ],
        };
      })
    );
    logAudit('PAYMENT_CONFIRMED', `Payment confirmed for application ${applicationId} (${method})`);
    showToast('success', 'Payment verified successfully');
  };

  const verifyBankTransfer = (applicationId: string, approved: boolean, reason?: string) => {
    if (approved) {
      confirmPayment(applicationId, 'bank_transfer', `STANBIC-VERIFIED-${Date.now().toString().slice(-4)}`);
    } else {
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== applicationId) return app;
          return {
            ...app,
            payment: { ...app.payment, status: 'failed' },
            timeline: [
              {
                id: `t-${Date.now()}`,
                status: 'payment_pending',
                title: 'Bank Transfer Proof Declined',
                description: reason || 'Bank transfer could not be verified on the embassy account statement.',
                timestamp: new Date().toLocaleString(),
                actor: currentStaff?.name || 'Finance Officer',
              },
              ...app.timeline,
            ],
          };
        })
      );
      showToast('warning', 'Bank proof marked as invalid');
    }
  };

  const setApplicationCustomFee = (applicationId: string, feeUsd: number, feeUgx?: number) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;
        return {
          ...app,
          status: 'payment_pending',
          payment: {
            ...app.payment,
            serviceFee: feeUsd,
            totalAmount: feeUsd + (app.payment.expressFee || 0),
            amountInUgx: feeUgx || Math.round(feeUsd * settings.exchangeRateUsdToUgx),
            isCustomFeeConfirmedByAdmin: true,
          },
          timeline: [
            {
              id: `t-${Date.now()}`,
              status: 'payment_pending',
              title: 'Consular Fee Confirmed by Embassy',
              description: `Consular desk established official service fee: $${feeUsd} USD. Citizen notified to complete payment.`,
              timestamp: new Date().toLocaleString(),
              actor: currentStaff?.name || 'Consular Desk',
            },
            ...app.timeline,
          ],
        };
      })
    );
    logAudit('CUSTOM_FEE_SET', `Custom fee of $${feeUsd} set for application ${applicationId}`);
    showToast('success', `Fee confirmed at $${feeUsd} USD. Application ready for payment.`);
  };

  const bookAppointment = (applicationId: string, date: string, time: string, counter?: string) => {
    const aptSlot = {
      id: `apt-${Date.now()}`,
      applicationId,
      citizenName: 'Citizen',
      serviceId: 'passport' as ServiceId,
      date,
      time,
      status: 'booked' as const,
      counter: counter || 'Consular Window 1',
    };

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;
        return {
          ...app,
          appointment: {
            ...aptSlot,
            citizenName: app.applicant.fullName,
            serviceId: app.serviceId,
          },
          timeline: [
            {
              id: `t-${Date.now()}`,
              status: app.status,
              title: 'Biometrics Appointment Booked',
              description: `Appointment confirmed for ${date} at ${time} (${counter || 'Consular Desk'}).`,
              timestamp: new Date().toLocaleString(),
              actor: 'Citizen',
            },
            ...app.timeline,
          ],
        };
      })
    );
    logAudit('APPOINTMENT_BOOKED', `Appointment for ${applicationId} booked for ${date} at ${time}`);
    showToast('success', `Appointment booked for ${date} at ${time}`);
  };

  const checkInAppointment = (applicationId: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId || !app.appointment) return app;
        return {
          ...app,
          appointment: {
            ...app.appointment,
            status: 'checked_in',
            checkedInAt: timestamp,
          },
          timeline: [
            {
              id: `t-${Date.now()}`,
              status: app.status,
              title: 'Citizen Checked-In at Reception',
              description: `Front desk verified presence at ${timestamp}. Biometrics queue assigned.`,
              timestamp: new Date().toLocaleString(),
              actor: currentStaff?.name || 'Reception',
            },
            ...app.timeline,
          ],
        };
      })
    );
    showToast('info', 'Citizen checked in at reception');
  };

  const markDocumentPrinted = (applicationId: string) => {
    updateApplicationStatus(applicationId, 'printed', 'Consular certificate or passport print queue finalized.');
  };

  const markDocumentReady = (applicationId: string) => {
    updateApplicationStatus(applicationId, 'ready_for_collection', 'Stamped document ready at consular collection counter.');
  };

  const markDocumentCollected = (
    applicationId: string,
    collectorName: string,
    collectorId: string,
    signature: string
  ) => {
    const timestamp = new Date().toLocaleString();
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;
        return {
          ...app,
          status: 'collected',
          issuance: {
            ...app.issuance,
            collectedAt: timestamp,
            collectedBy: collectorName,
            collectorIdNumber: collectorId,
            collectorSignature: signature,
          },
          timeline: [
            {
              id: `t-${Date.now()}`,
              status: 'collected',
              title: 'Document Collected by Citizen',
              description: `Handed over to ${collectorName} (ID: ${collectorId}). Signature captured.`,
              timestamp,
              actor: currentStaff?.name || 'Collection Desk',
            },
            ...app.timeline,
          ],
        };
      })
    );
    logAudit('COLLECTION_COMPLETED', `Document for ${applicationId} handed to ${collectorName}`);
    showToast('success', 'Document marked as collected!');
  };

  const runAiDocPrecheck = async (applicationId: string, docId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;
    const doc = app.documents.find((d) => d.id === docId);
    if (!doc) return;

    try {
      showToast('info', `Running AI pre-check on ${doc.name}...`);
      const response = await fetch('/api/gemini/doc-precheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: app.serviceId,
          applicantName: app.applicant.fullName,
          applicantDob: app.applicant.dob,
          applicantId: app.applicant.passportOrIdNumber,
          documentName: doc.name,
          documentType: doc.type,
        }),
      });

      const result = await response.json();

      setApplications((prev) =>
        prev.map((a) => {
          if (a.id !== applicationId) return a;
          return {
            ...a,
            documents: a.documents.map((d) => (d.id === docId ? { ...d, aiPreCheck: result, verified: result.status === 'APPROVED' } : d)),
          };
        })
      );

      logAudit('AI_PRECHECK_RUN', `AI precheck completed for ${doc.name} on ${app.referenceNumber}: ${result.status}`);
      showToast(result.status === 'APPROVED' ? 'success' : 'warning', `AI Precheck: ${result.status.replace(/_/g, ' ')} (${result.confidenceScore}%)`);
    } catch (err) {
      console.error('AI Precheck failed:', err);
      showToast('error', 'AI Precheck service unavailable');
    }
  };

  const saveDraft = (data: any) => {
    setCurrentDraft(data);
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(data));
    showToast('info', 'Application draft saved');
  };

  const clearDraft = () => {
    setCurrentDraft(null);
    localStorage.removeItem(STORAGE_KEYS.DRAFT);
  };

  const toggleFlagCitizen = (citizenId: string, reason?: string) => {
    setCitizens((prev) =>
      prev.map((c) => {
        if (c.id !== citizenId) return c;
        const newFlag = !c.isFlagged;
        return {
          ...c,
          isFlagged: newFlag,
          flagReason: newFlag ? reason || 'Security watch / consular attention requested' : undefined,
        };
      })
    );
    showToast('info', 'Citizen flag status updated');
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...newSettings }));
    logAudit('SETTINGS_UPDATE', 'System parameters updated by Master admin');
    showToast('success', 'Settings updated');
  };

  const addStaffUser = (userData: Omit<StaffUser, 'id'>) => {
    const newUser: StaffUser = {
      ...userData,
      id: `staff-${Date.now()}`,
    };
    setStaffUsers((prev) => [...prev, newUser]);
    logAudit('USER_CREATED', `Created new staff account: ${newUser.name} (${newUser.role})`);
    showToast('success', `Staff account created for ${newUser.name}`);
  };

  const updateStaffUserStatus = (id: string, status: 'active' | 'suspended') => {
    setStaffUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status } : u))
    );
    logAudit('USER_STATUS_CHANGE', `Staff account ${id} marked as ${status}`);
    showToast('info', `Account status set to ${status}`);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        isDarkMode,
        setIsDarkMode: setIsDarkModeState,
        toggleDarkMode,
        currentView,
        setCurrentView,
        adminTab,
        setAdminTab,
        currentStaff,
        currentCitizen,
        loginAsStaff,
        logoutStaff,
        loginAsCitizen,
        logoutCitizen,
        services,
        updateServiceFee,
        toggleServiceEnabled,
        applications,
        selectedApplication,
        setSelectedApplication,
        submitApplication,
        updateApplicationStatus,
        assignApplicationOfficer,
        addApplicationNote,
        confirmPayment,
        verifyBankTransfer,
        setApplicationCustomFee,
        bookAppointment,
        checkInAppointment,
        markDocumentPrinted,
        markDocumentReady,
        markDocumentCollected,
        runAiDocPrecheck,
        currentDraft,
        saveDraft,
        clearDraft,
        citizens,
        toggleFlagCitizen,
        settings,
        updateSettings,
        staffUsers,
        addStaffUser,
        updateStaffUserStatus,
        auditLogs,
        logAudit,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
