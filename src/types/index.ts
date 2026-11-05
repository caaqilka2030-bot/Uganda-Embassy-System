export type Language = 'en' | 'so';

export type UserRole =
  | 'master'
  | 'consular_officer'
  | 'verification_officer'
  | 'finance_officer'
  | 'reception'
  | 'auditor';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  status: 'active' | 'suspended';
  lastLogin?: string;
}

export interface CitizenUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passportOrId?: string;
  nationality: string;
  addressInUganda: string;
  registeredAt: string;
  isFlagged?: boolean;
  flagReason?: string;
}

export type ServiceId =
  | 'passport'
  | 'nira'
  | 'power_of_attorney'
  | 'education'
  | 'birth_certificate'
  | 'go_home'
  | 'death_certificate'
  | 'visa'
  | 'cid_clearance'
  | 'renunciation';

export interface EmbassyService {
  id: ServiceId;
  titleEn: string;
  titleSo: string;
  descriptionEn: string;
  descriptionSo: string;
  category: 'identity' | 'legal' | 'travel' | 'records' | 'optional';
  feeUsd: number | null; // null means 'Fee to be confirmed'
  feeUgx: number | null; // null means not set or uses exchange
  isFeePending: boolean;
  processingTime: string;
  requiredDocuments: string[];
  isEnabled: boolean;
  iconName: string;
}

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'payment_pending'
  | 'payment_verified'
  | 'under_review'
  | 'more_info_needed'
  | 'approved'
  | 'printed'
  | 'ready_for_collection'
  | 'collected'
  | 'rejected'
  | 'cancelled';

export type PaymentStatus =
  | 'unpaid'
  | 'awaiting_verification' // bank transfer proof uploaded
  | 'paid'
  | 'failed'
  | 'refunded';

export type PaymentMethod =
  | 'mtn_momo'
  | 'airtel_money'
  | 'card'
  | 'bank_transfer'
  | 'pay_at_embassy';

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  verified?: boolean;
  aiPreCheck?: {
    status: 'APPROVED' | 'FLAGGED_FOR_REVIEW' | 'REJECTED_NEEDS_REUPLOAD';
    confidenceScore: number;
    summary: string;
    checks: Array<{ name: string; passed: boolean; details: string }>;
    recommendationForOfficer: string;
  };
}

export interface ApplicationNote {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
  isInternalOnly: boolean;
}

export interface ApplicationTimelineEvent {
  id: string;
  status: ApplicationStatus;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface AppointmentSlot {
  id: string;
  applicationId: string;
  citizenName: string;
  serviceId: ServiceId;
  date: string; // YYYY-MM-DD
  time: string; // e.g. 09:30 AM
  status: 'booked' | 'checked_in' | 'completed' | 'no_show' | 'rescheduled';
  counter?: string;
  checkedInAt?: string;
}

export interface ConsularApplication {
  id: string;
  referenceNumber: string; // e.g. SEK-2026-000123
  serviceId: ServiceId;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  slaDeadline: string; // 7 days or configurable
  isOverdue?: boolean;

  // Applicant info
  applicant: {
    fullName: string;
    motherName: string;
    dob: string;
    placeOfBirth: string;
    gender: 'male' | 'female' | 'other';
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    nationality: string;
    clan?: string;
    phone: string;
    email: string;
    addressInUganda: string;
    passportOrIdNumber: string;
    occupation: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
    applyingFor: 'self' | 'behalf';
    behalfDetails?: {
      relationship: string;
      authorizationNote: string;
    };
    preferredLanguage: Language;
  };

  // Service specific questions
  serviceData: Record<string, any>;

  // Uploaded docs
  documents: UploadedDocument[];

  // Payment
  payment: {
    status: PaymentStatus;
    method?: PaymentMethod;
    currency: 'USD' | 'UGX';
    serviceFee: number;
    expressFee: number;
    totalAmount: number;
    amountInUgx?: number;
    paidAt?: string;
    transactionReference?: string;
    bankProofUrl?: string;
    isCustomFeeConfirmedByAdmin?: boolean;
    receiptNumber?: string;
  };

  // Appointment
  appointment?: AppointmentSlot;

  // Back office assignment & workflow
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  notes: ApplicationNote[];
  timeline: ApplicationTimelineEvent[];
  rejectionReason?: string;
  infoRequestMessage?: string;

  // Collection
  issuance?: {
    printedAt?: string;
    printedBy?: string;
    readyAt?: string;
    collectedAt?: string;
    collectedBy?: string;
    collectorIdNumber?: string;
    collectorSignature?: string;
  };
}

export interface PaymentTransaction {
  id: string;
  referenceNumber: string;
  applicationId: string;
  applicantName: string;
  serviceTitle: string;
  amount: number;
  currency: 'USD' | 'UGX';
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  bankProofUrl?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  details: string;
  ipAddress?: string;
}

export interface SystemSettings {
  exchangeRateUsdToUgx: number; // e.g. 3850
  expressProcessingSurchargeUsd: number; // e.g. 50
  allowExpressProcessing: boolean;
  unpaidApplicationExpiryDays: number; // 7
  dailyAppointmentSlotLimit: number; // 30
  workingDays: number[]; // [1,2,3,4,5] (Mon-Fri)
  workingHours: {
    start: string; // "09:00"
    end: string; // "15:00"
  };
  slotDurationMinutes: number; // 15
  holidays: string[]; // YYYY-MM-DD
  announcementText: string;
  isAnnouncementActive: boolean;
}
