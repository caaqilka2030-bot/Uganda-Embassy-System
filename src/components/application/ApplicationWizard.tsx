import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../constants/translations';
import {
  ServiceId,
  ConsularApplication,
  UploadedDocument,
  PaymentMethod,
} from '../../types';
import { QRCodeView } from '../common/QRCodeView';
import { OfficialReceiptModal } from '../common/OfficialReceiptModal';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Upload,
  Calendar,
  CreditCard,
  FileText,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Printer,
  Shield,
  Smartphone,
  Building,
  User,
  Zap,
} from 'lucide-react';

export const ApplicationWizard: React.FC = () => {
  const {
    language,
    services,
    settings,
    submitApplication,
    saveDraft,
    currentDraft,
    clearDraft,
    setCurrentView,
    bookAppointment,
  } = useApp();

  const t = translations[language];

  // Steps: 1: Service, 2: Applicant Details, 3: Service Questions, 4: Uploads, 5: Review & Declaration, 6: Payment, 7: Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceId>('passport');

  // Common applicant fields
  const [applicant, setApplicant] = useState({
    fullName: '',
    motherName: '',
    dob: '1995-01-01',
    placeOfBirth: 'Mogadishu',
    gender: 'male' as 'male' | 'female' | 'other',
    maritalStatus: 'single' as 'single' | 'married' | 'divorced' | 'widowed',
    nationality: 'Somali',
    clan: '',
    phone: '',
    email: '',
    addressInUganda: '',
    passportOrIdNumber: '',
    occupation: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    applyingFor: 'self' as 'self' | 'behalf',
    behalfDetails: {
      relationship: '',
      authorizationNote: '',
    },
    preferredLanguage: language,
  });

  // Service specific questions
  const [serviceData, setServiceData] = useState<Record<string, any>>({
    // Passport
    passportCategory: 'renewal',
    passportType: 'ordinary_32',
    previousPassportNumber: '',
    heightCm: '175',
    eyeColor: 'Brown',
    niraNumber: '',
    residencyStatus: 'work_permit',
    // Power of attorney
    attorneyType: 'General Representation',
    agentFullName: '',
    agentIdNumber: '',
    agentRelationship: '',
    agentPhone: '',
    grantPurpose: '',
    propertyLocation: '',
    witness1Name: '',
    witness1Id: '',
    witness2Name: '',
    witness2Id: '',
    // Birth cert
    childFullName: '',
    childDob: '2026-01-01',
    childPlaceOfBirth: 'Kampala Hospital',
    fatherFullName: '',
    fatherPassport: '',
    motherFullName: '',
    motherPassport: '',
    // Go home
    goHomeReason: 'lost_documents',
    intendedTravelDate: '2026-11-20',
    destinationCity: 'Mogadishu',
    airline: '',
    sponsorInSomalia: '',
    // Education
    educationType: 'Certificate attestation',
    institutionName: '',
    degreeLevel: 'Bachelor',
    graduationYear: '2023',
    destinationCountry: 'Uganda',
    // Visa
    visaType: 'Business',
    intendedArrivalDate: '2026-12-01',
    durationDays: 30,
    hostInSomalia: '',
    hotelProof: '',
  });

  // Documents
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [declarationAgreed, setDeclarationAgreed] = useState(false);

  // Payment
  const [expressProcessing, setExpressProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn_momo');
  const [momoNumber, setMomoNumber] = useState('');
  const [bankProofFile, setBankProofFile] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Submitted application record
  const [createdApplication, setCreatedApplication] = useState<ConsularApplication | null>(null);

  // Appointment Slot Booking (Step 7)
  const [selectedDate, setSelectedDate] = useState('2026-11-09');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Load from draft if available
  useEffect(() => {
    if (currentDraft) {
      if (currentDraft.selectedServiceId) setSelectedServiceId(currentDraft.selectedServiceId);
      if (currentDraft.applicant) setApplicant(currentDraft.applicant);
      if (currentDraft.serviceData) setServiceData(currentDraft.serviceData);
      if (currentDraft.currentStep) setCurrentStep(currentDraft.currentStep);
    }
  }, []);

  // Autosave draft on changes
  const handleSaveDraft = () => {
    saveDraft({
      currentStep,
      selectedServiceId,
      applicant,
      serviceData,
    });
  };

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];

  // Fee calculation (auto age based for birth certificate)
  const calculateFee = () => {
    let serviceFee = selectedService.feeUsd || 0;

    if (selectedService.id === 'birth_certificate') {
      const birthYear = new Date(applicant.dob).getFullYear();
      const currentYear = 2026;
      const isMinor = currentYear - birthYear < 18;
      serviceFee = isMinor ? 50 : 100;
    }

    const expressFee = expressProcessing && settings.allowExpressProcessing ? settings.expressProcessingSurchargeUsd : 0;
    const totalAmount = serviceFee + expressFee;
    const totalAmountUgx = (selectedService.feeUgx || serviceFee * settings.exchangeRateUsdToUgx) + (expressFee * settings.exchangeRateUsdToUgx);

    return {
      serviceFee,
      expressFee,
      totalAmount,
      totalAmountUgx,
      isPending: selectedService.isFeePending,
    };
  };

  const feeSummary = calculateFee();

  // Handle mock file upload
  const handleFileUpload = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc: UploadedDocument = {
      id: `doc-${Date.now()}-${Math.random().toString().slice(2, 6)}`,
      name: `${docName} (${file.name})`,
      type: file.type || 'image/jpeg',
      size: file.size,
      url: '/public/assets/aistudio/HQ_new_1_843fa025.png',
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verified: true,
    };

    setDocuments((prev) => [...prev.filter((d) => !d.name.startsWith(docName)), newDoc]);
  };

  // Submission handler
  const handleFinalSubmit = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      const isPaid = paymentMethod !== 'pay_at_embassy' && paymentMethod !== 'bank_transfer';
      const isBankPending = paymentMethod === 'bank_transfer';

      const app = submitApplication({
        serviceId: selectedServiceId,
        status: isPaid ? 'under_review' : isBankPending ? 'under_review' : 'payment_pending',
        applicant,
        serviceData,
        documents: documents.length > 0 ? documents : [
          {
            id: `doc-default-${Date.now()}`,
            name: 'Applicant_Verified_Credentials.pdf',
            type: 'application/pdf',
            size: 1540000,
            url: '/public/assets/aistudio/HQ_new_1_843fa025.png',
            uploadedAt: new Date().toLocaleString(),
            verified: true,
          },
        ],
        payment: {
          status: isPaid ? 'paid' : isBankPending ? 'awaiting_verification' : 'unpaid',
          method: paymentMethod,
          currency: 'USD',
          serviceFee: feeSummary.serviceFee,
          expressFee: feeSummary.expressFee,
          totalAmount: feeSummary.totalAmount,
          amountInUgx: feeSummary.totalAmountUgx,
          paidAt: isPaid ? new Date().toLocaleString() : undefined,
          transactionReference: `${paymentMethod.toUpperCase()}-SEK-${Math.floor(100000 + Math.random() * 900000)}`,
          receiptNumber: `REC-SEK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        },
      });

      setCreatedApplication(app);
      setIsProcessingPayment(false);
      setCurrentStep(7);
    }, 1200);
  };

  const handleBookSlot = () => {
    if (!createdApplication) return;
    bookAppointment(createdApplication.id, selectedDate, selectedTime, 'Consular Biometrics Desk 2');
    setAppointmentBooked(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Step Stepper Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {[
            { step: 1, label: '1. Service' },
            { step: 2, label: '2. Applicant' },
            { step: 3, label: '3. Details' },
            { step: 4, label: '4. Documents' },
            { step: 5, label: '5. Review' },
            { step: 6, label: '6. Payment' },
            { step: 7, label: '7. Receipt & Slot' },
          ].map((s) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;

            return (
              <div
                key={s.step}
                className={`flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                  isCurrent
                    ? 'bg-[#0B2545] text-white shadow-2xs'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-400 bg-slate-50'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Select Service */}
      {currentStep === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2545]">
              Step 1: Choose Consular Service
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select the official government service you are applying for. Fees and required uploads will configure automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services
              .filter((s) => s.isEnabled)
              .map((service) => {
                const isSelected = selectedServiceId === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-[#4189DD] bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <h3 className="font-serif font-bold text-sm text-[#0B2545]">
                          {language === 'so' ? service.titleSo : service.titleEn}
                        </h3>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#4189DD] shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {language === 'so' ? service.descriptionSo : service.descriptionEn}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">{service.processingTime}</span>
                      <span className="font-bold text-[#0B2545]">
                        {service.id === 'birth_certificate'
                          ? '$50 child / $100 adult'
                          : service.feeUsd !== null
                          ? `$${service.feeUsd} USD`
                          : 'Fee pending review'}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentView('home')}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleSaveDraft();
                setCurrentStep(2);
              }}
              className="px-6 py-2.5 bg-[#4189DD] hover:bg-[#3476c5] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Common Applicant Details */}
      {currentStep === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2545]">
                Step 2: Applicant Personal Details
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Standard questions mandatory for all consular records. Must match your official documents.
              </p>
            </div>
            <button
              onClick={handleSaveDraft}
              className="text-xs font-medium text-[#4189DD] hover:underline cursor-pointer"
            >
              {t.saveDraft}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Full Name */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700 block">
                {t.fullName} *
              </label>
              <input
                type="text"
                required
                value={applicant.fullName}
                onChange={(e) => setApplicant({ ...applicant, fullName: e.target.value })}
                placeholder="e.g. Mohamed Ahmed Nur"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#4189DD]"
              />
            </div>

            {/* Mother's Name */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">{t.motherName} *</label>
              <input
                type="text"
                required
                value={applicant.motherName}
                onChange={(e) => setApplicant({ ...applicant, motherName: e.target.value })}
                placeholder="e.g. Halima Warsame Ali"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">{t.dob} *</label>
              <input
                type="date"
                required
                value={applicant.dob}
                onChange={(e) => setApplicant({ ...applicant, dob: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            {/* Place of Birth */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">{t.placeOfBirth} *</label>
              <input
                type="text"
                required
                value={applicant.placeOfBirth}
                onChange={(e) => setApplicant({ ...applicant, placeOfBirth: e.target.value })}
                placeholder="e.g. Mogadishu / Hargeisa / Garowe"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">{t.gender} *</label>
              <select
                value={applicant.gender}
                onChange={(e) => setApplicant({ ...applicant, gender: e.target.value as any })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Marital Status */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">{t.maritalStatus} *</label>
              <select
                value={applicant.maritalStatus}
                onChange={(e) => setApplicant({ ...applicant, maritalStatus: e.target.value as any })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>

            {/* Clan / Community (Optional) */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">{t.clan}</label>
              <input
                type="text"
                value={applicant.clan}
                onChange={(e) => setApplicant({ ...applicant, clan: e.target.value })}
                placeholder="Optional civil record attribute"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            {/* Phone (WhatsApp) */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">{t.phone} *</label>
              <input
                type="tel"
                required
                value={applicant.phone}
                onChange={(e) => setApplicant({ ...applicant, phone: e.target.value })}
                placeholder="+256 700 000 000"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">{t.email} *</label>
              <input
                type="email"
                required
                value={applicant.email}
                onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                placeholder="applicant@gmail.com"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            {/* Address in Uganda */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700 block">{t.addressInUganda} *</label>
              <input
                type="text"
                required
                value={applicant.addressInUganda}
                onChange={(e) => setApplicant({ ...applicant, addressInUganda: e.target.value })}
                placeholder="e.g. Kisenyi, Mengo / Kansanga / Ntinda, Kampala"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            {/* Passport or ID if any */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Existing Passport / NIRA ID Number</label>
              <input
                type="text"
                value={applicant.passportOrIdNumber}
                onChange={(e) => setApplicant({ ...applicant, passportOrIdNumber: e.target.value })}
                placeholder="e.g. P01982736"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono uppercase"
              />
            </div>

            {/* Occupation */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">{t.occupation}</label>
              <input
                type="text"
                value={applicant.occupation}
                onChange={(e) => setApplicant({ ...applicant, occupation: e.target.value })}
                placeholder="e.g. Student / Business / Healthcare"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            {/* Emergency Contact */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <h4 className="font-bold text-slate-800 mb-2">Emergency Relative / Contact</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={applicant.emergencyContact.name}
                  onChange={(e) =>
                    setApplicant({
                      ...applicant,
                      emergencyContact: { ...applicant.emergencyContact, name: e.target.value },
                    })
                  }
                  className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g. Brother, Parent)"
                  value={applicant.emergencyContact.relationship}
                  onChange={(e) =>
                    setApplicant({
                      ...applicant,
                      emergencyContact: { ...applicant.emergencyContact, relationship: e.target.value },
                    })
                  }
                  className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Contact Phone"
                  value={applicant.emergencyContact.phone}
                  onChange={(e) =>
                    setApplicant({
                      ...applicant,
                      emergencyContact: { ...applicant.emergencyContact, phone: e.target.value },
                    })
                  }
                  className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.previous}</span>
            </button>
            <button
              onClick={() => {
                if (!applicant.fullName || !applicant.phone) {
                  alert('Please enter your full name and phone number to continue.');
                  return;
                }
                handleSaveDraft();
                setCurrentStep(3);
              }}
              className="px-6 py-2.5 bg-[#4189DD] hover:bg-[#3476c5] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Service-Specific Questions */}
      {currentStep === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2545]">
                Step 3: Service-Specific Questionnaire
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Specific technical parameters for {selectedService.titleEn}.
              </p>
            </div>
            <button
              onClick={handleSaveDraft}
              className="text-xs font-medium text-[#4189DD] hover:underline cursor-pointer"
            >
              {t.saveDraft}
            </button>
          </div>

          {/* Conditional Forms by Service */}
          <div className="space-y-4 text-xs">
            {selectedServiceId === 'passport' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Passport Application Type *</label>
                  <select
                    value={serviceData.passportCategory}
                    onChange={(e) => setServiceData({ ...serviceData, passportCategory: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="new">First Time / New E-Passport</option>
                    <option value="renewal">Standard Renewal (Expired)</option>
                    <option value="lost">Replacement for Lost Passport</option>
                    <option value="damaged">Replacement for Damaged / Full Pages</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Booklet Size *</label>
                  <select
                    value={serviceData.passportType}
                    onChange={(e) => setServiceData({ ...serviceData, passportType: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="ordinary_32">Ordinary Standard (32 Pages)</option>
                    <option value="ordinary_48">Ordinary Frequent Traveler (48 Pages)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Height (in Centimeters)</label>
                  <input
                    type="number"
                    value={serviceData.heightCm}
                    onChange={(e) => setServiceData({ ...serviceData, heightCm: e.target.value })}
                    placeholder="e.g. 175"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Eye Color</label>
                  <input
                    type="text"
                    value={serviceData.eyeColor}
                    onChange={(e) => setServiceData({ ...serviceData, eyeColor: e.target.value })}
                    placeholder="e.g. Brown / Black"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Previous Passport Number (if renewing)</label>
                  <input
                    type="text"
                    value={serviceData.previousPassportNumber}
                    onChange={(e) => setServiceData({ ...serviceData, previousPassportNumber: e.target.value })}
                    placeholder="e.g. P01982736"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Residency Status in Uganda *</label>
                  <select
                    value={serviceData.residencyStatus}
                    onChange={(e) => setServiceData({ ...serviceData, residencyStatus: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="work_permit">Ugandan Work Permit (Class G/A)</option>
                    <option value="student_pass">Ugandan Student Pass / KIU / Makerere</option>
                    <option value="visitor_visa">Visitor / Special Pass</option>
                    <option value="refugee_unhcr">UNHCR / OPM Refugee Mandate Card</option>
                    <option value="dependent">Dependent / Family Residency</option>
                  </select>
                </div>
              </div>
            )}

            {selectedServiceId === 'power_of_attorney' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                  <strong>Important Notice:</strong> Grantor must personally sign in the presence of the Consular Officer with two witnesses.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Power of Attorney Type *</label>
                    <select
                      value={serviceData.attorneyType}
                      onChange={(e) => setServiceData({ ...serviceData, attorneyType: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      <option value="Property">Real Estate & Land Management</option>
                      <option value="General">General Legal Representation</option>
                      <option value="Financial">Banking & Financial Transactions</option>
                      <option value="Vehicle">Vehicle Sale & Registration Transfer</option>
                      <option value="Commercial">Business Operations & Contracts</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Attorney / Agent Full Name *</label>
                    <input
                      type="text"
                      required
                      value={serviceData.agentFullName}
                      onChange={(e) => setServiceData({ ...serviceData, agentFullName: e.target.value })}
                      placeholder="Full Name of Person Receiving Powers"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Agent Passport or Somali ID *</label>
                    <input
                      type="text"
                      value={serviceData.agentIdNumber}
                      onChange={(e) => setServiceData({ ...serviceData, agentIdNumber: e.target.value })}
                      placeholder="e.g. P09981273"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono uppercase"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Agent Phone / WhatsApp in Somalia *</label>
                    <input
                      type="tel"
                      value={serviceData.agentPhone}
                      onChange={(e) => setServiceData({ ...serviceData, agentPhone: e.target.value })}
                      placeholder="+252 61..."
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-semibold text-slate-700 block">Scope & Purpose of Wakaalad *</label>
                    <textarea
                      rows={2}
                      value={serviceData.grantPurpose}
                      onChange={(e) => setServiceData({ ...serviceData, grantPurpose: e.target.value })}
                      placeholder="Detail the exact authorities granted (e.g. Selling plot 42 in Hodan District, Mogadishu)..."
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedServiceId === 'birth_certificate' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Child's Full Name (if registering child) *</label>
                    <input
                      type="text"
                      value={serviceData.childFullName}
                      onChange={(e) => setServiceData({ ...serviceData, childFullName: e.target.value })}
                      placeholder="Full Name as per hospital record"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Hospital / Birth Clinic in Uganda *</label>
                    <input
                      type="text"
                      value={serviceData.childPlaceOfBirth}
                      onChange={(e) => setServiceData({ ...serviceData, childPlaceOfBirth: e.target.value })}
                      placeholder="e.g. Kampala International Hospital, Nsambya"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Father's Full Name & Passport</label>
                    <input
                      type="text"
                      value={serviceData.fatherFullName}
                      onChange={(e) => setServiceData({ ...serviceData, fatherFullName: e.target.value })}
                      placeholder="Father's Name & Passport No."
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Mother's Full Name & Passport</label>
                    <input
                      type="text"
                      value={serviceData.motherFullName}
                      onChange={(e) => setServiceData({ ...serviceData, motherFullName: e.target.value })}
                      placeholder="Mother's Name & Passport No."
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Other services default general fields */}
            {selectedServiceId !== 'passport' && selectedServiceId !== 'power_of_attorney' && selectedServiceId !== 'birth_certificate' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700 block">Specific Purpose & Details for {selectedService.titleEn} *</label>
                  <textarea
                    rows={3}
                    value={serviceData.generalPurpose || ''}
                    onChange={(e) => setServiceData({ ...serviceData, generalPurpose: e.target.value })}
                    placeholder="Provide additional background, destinations, or references..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.previous}</span>
            </button>
            <button
              onClick={() => {
                handleSaveDraft();
                setCurrentStep(4);
              }}
              className="px-6 py-2.5 bg-[#4189DD] hover:bg-[#3476c5] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Upload Required Documents */}
      {currentStep === 4 && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2545]">
                Step 4: Supporting Document Upload
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Upload clear PDF or JPG scans. Maximum file size: 10MB per document.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {documents.length} Uploaded
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {selectedService.requiredDocuments.map((docTitle, idx) => {
              const uploaded = documents.find((d) => d.name.startsWith(docTitle));

              return (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-900">{docTitle}</p>
                    <p className="text-[11px] text-slate-500">
                      {uploaded ? `Attached: ${uploaded.name}` : 'Mandatory consular verification requirement'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {uploaded ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                        <Check className="w-3.5 h-3.5" />
                        <span>Ready</span>
                      </span>
                    ) : null}

                    <label className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-medium rounded-lg text-xs cursor-pointer shadow-2xs flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#4189DD]" />
                      <span>{uploaded ? 'Replace' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={(e) => handleFileUpload(docTitle, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.previous}</span>
            </button>
            <button
              onClick={() => {
                handleSaveDraft();
                setCurrentStep(5);
              }}
              className="px-6 py-2.5 bg-[#4189DD] hover:bg-[#3476c5] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Review & Sworn Declaration */}
      {currentStep === 5 && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2545]">
              Step 5: Review & Legal Declaration
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verify all details before locking submission. Inaccurate data may delay or reject your application.
            </p>
          </div>

          {/* Dossier Review Card */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-500">Service:</span>
                <p className="font-bold text-[#0B2545]">{selectedService.titleEn}</p>
              </div>
              <div>
                <span className="text-slate-500">Applicant:</span>
                <p className="font-bold text-slate-900">{applicant.fullName}</p>
              </div>
              <div>
                <span className="text-slate-500">Mother's Name:</span>
                <p className="font-medium text-slate-800">{applicant.motherName}</p>
              </div>
              <div>
                <span className="text-slate-500">Date of Birth:</span>
                <p className="font-medium text-slate-800">{applicant.dob}</p>
              </div>
              <div>
                <span className="text-slate-500">Phone (WhatsApp):</span>
                <p className="font-medium text-slate-800">{applicant.phone}</p>
              </div>
              <div>
                <span className="text-slate-500">Address in Uganda:</span>
                <p className="font-medium text-slate-800">{applicant.addressInUganda}</p>
              </div>
            </div>
          </div>

          {/* Electronic Declaration Checkbox */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="declaration"
                checked={declarationAgreed}
                onChange={(e) => setDeclarationAgreed(e.target.checked)}
                className="w-4 h-4 text-[#4189DD] rounded mt-0.5"
              />
              <label htmlFor="declaration" className="leading-relaxed cursor-pointer font-medium">
                I solemnly declare under penalty of perjury under the laws of the Federal Republic of Somalia and the Republic of Uganda that all information, photographs, and supporting credentials provided in this application are genuine, true, and correct. I understand that fraudulent submissions will result in immediate cancellation, biometric forfeiture, and legal reporting.
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.previous}</span>
            </button>
            <button
              disabled={!declarationAgreed}
              onClick={() => {
                handleSaveDraft();
                setCurrentStep(6);
              }}
              className="px-6 py-2.5 bg-[#4189DD] hover:bg-[#3476c5] disabled:opacity-40 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Proceed to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Fee Summary & Payment Gateway */}
      {currentStep === 6 && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2545]">
              Step 6: Consular Fee Payment
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your payment method. Fees are collected by the Embassy before scheduling your biometric appointment.
            </p>
          </div>

          {/* Financial Summary */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span>Official Consular Fee ({selectedService.titleEn}):</span>
              <span className="font-mono font-bold text-slate-900">${feeSummary.serviceFee.toFixed(2)} USD</span>
            </div>

            {settings.allowExpressProcessing && (
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="express"
                    checked={expressProcessing}
                    onChange={(e) => setExpressProcessing(e.target.checked)}
                    className="w-4 h-4 text-[#4189DD] rounded"
                  />
                  <label htmlFor="express" className="cursor-pointer font-semibold text-slate-800">
                    Priority Express Fast-Track Surcharge (+${settings.expressProcessingSurchargeUsd} USD)
                  </label>
                </div>
                <span className="font-mono text-slate-700">
                  {expressProcessing ? `+$${settings.expressProcessingSurchargeUsd}.00` : '$0.00'}
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-[#0B2545]">
              <span>Total Payable Amount:</span>
              <div className="text-right">
                <span className="font-mono text-base">${feeSummary.totalAmount.toFixed(2)} USD</span>
                <span className="block text-[11px] font-mono text-slate-500">
                  UGX {feeSummary.totalAmountUgx.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 text-xs">
            <label className="font-bold text-slate-800 block">Choose Payment Gateway:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'mtn_momo', name: 'MTN Mobile Money Uganda', icon: Smartphone, tag: 'Instant' },
                { id: 'airtel_money', name: 'Airtel Money Uganda', icon: Smartphone, tag: 'Instant' },
                { id: 'card', name: 'Visa / Mastercard', icon: CreditCard, tag: 'Instant' },
                { id: 'bank_transfer', name: 'Stanbic Bank Transfer', icon: Building, tag: 'Proof Upload' },
                { id: 'pay_at_embassy', name: 'Pay at Chancery Counter', icon: Building, tag: 'Unpaid Slot' },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#4189DD] bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-[#0B2545]" />
                      <div>
                        <p className="font-bold text-slate-900">{m.name}</p>
                        <span className="text-[10px] text-slate-400">{m.tag}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#4189DD]" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Method Input Details */}
          {(paymentMethod === 'mtn_momo' || paymentMethod === 'airtel_money') && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <label className="font-semibold text-slate-800 block">
                Enter {paymentMethod === 'mtn_momo' ? 'MTN' : 'Airtel'} Phone Number for Payment Prompt:
              </label>
              <input
                type="tel"
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
                placeholder="+256 7..."
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg"
              />
              <p className="text-[11px] text-slate-500">
                A prompt will appear on your phone to authorize the consular transaction.
              </p>
            </div>
          )}

          {paymentMethod === 'bank_transfer' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <p className="font-semibold text-slate-900">Stanbic Bank Embassy Official Account Details:</p>
              <p className="font-mono text-slate-700">Account Name: Embassy of Somalia Consular Revenue</p>
              <p className="font-mono text-slate-700">Account No: 9030018290192 (Stanbic Forest Mall)</p>
              <div className="pt-2">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Upload Bank Deposit Receipt:
                </label>
                <input
                  type="file"
                  onChange={() => setBankProofFile('uploaded_deposit.pdf')}
                  className="text-xs"
                />
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(5)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.previous}</span>
            </button>
            <button
              disabled={isProcessingPayment}
              onClick={handleFinalSubmit}
              className="px-8 py-3 bg-[#4189DD] hover:bg-[#3476c5] disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Embassy Transaction...</span>
                </>
              ) : (
                <>
                  <span>Pay & Submit Application</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: Confirmation & Biometric Appointment Scheduler */}
      {currentStep === 7 && createdApplication && (
        <div className="bg-white p-6 sm:p-10 rounded-xl border border-slate-200 shadow-md space-y-8 animate-in fade-in">
          {/* Success Banner */}
          <div className="text-center space-y-2 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545]">
              Application Successfully Registered!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Your application has been received by the Consular Desk at Plot 46 Nakasero Road, Kampala.
            </p>
          </div>

          {/* Reference Card with QR */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Official Consular Reference Number
              </span>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#0B2545]">
                {createdApplication.referenceNumber}
              </div>
              <p className="text-xs text-slate-600">
                Payment Status: <strong className="text-emerald-700 font-bold">{createdApplication.payment.status.toUpperCase()}</strong>
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setShowReceiptModal(true)}
                  className="px-4 py-2 bg-[#0B2545] hover:bg-[#123661] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Download Official PDF Receipt</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <QRCodeView value={`https://somaliembassy.ug/verify/${createdApplication.referenceNumber}`} size={110} />
              <span className="text-[10px] font-mono text-slate-500 mt-1">Verification QR Code</span>
            </div>
          </div>

          {/* Biometrics Appointment Booking Slot Picker */}
          <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-200 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#4189DD]" />
              <h3 className="font-serif text-lg font-bold text-[#0B2545]">
                {appointmentBooked ? 'Appointment Confirmed!' : 'Book Your Embassy Biometrics Slot'}
              </h3>
            </div>

            {appointmentBooked ? (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-bold">Biometrics Slot Booked for: {selectedDate} at {selectedTime}</p>
                <p>Location: Consular Section, Plot 46 Nakasero Road, Kampala.</p>
                <p>Please bring your printed receipt and original documents.</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600">
                  Select a convenient morning or afternoon time slot between Monday and Friday (9:00 AM – 3:00 PM).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Select Date:</label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="2026-11-09">Monday, 09 Nov 2026</option>
                      <option value="2026-11-10">Tuesday, 10 Nov 2026</option>
                      <option value="2026-11-11">Wednesday, 11 Nov 2026</option>
                      <option value="2026-11-12">Thursday, 12 Nov 2026</option>
                      <option value="2026-11-13">Friday, 13 Nov 2026</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Select Time Slot:</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="09:15 AM">09:15 AM (Morning Batch 1)</option>
                      <option value="10:00 AM">10:00 AM (Morning Batch 2)</option>
                      <option value="11:30 AM">11:30 AM (Morning Batch 3)</option>
                      <option value="01:15 PM">01:15 PM (Afternoon Batch 1)</option>
                      <option value="02:30 PM">02:30 PM (Afternoon Batch 2)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleBookSlot}
                  className="px-6 py-2.5 bg-[#4189DD] hover:bg-[#3476c5] text-white font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Confirm Appointment Slot
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentView('track')}
              className="text-xs font-semibold text-[#4189DD] hover:underline cursor-pointer"
            >
              Go to Live Tracking Page
            </button>
            <button
              onClick={() => {
                setCurrentStep(1);
                setCreatedApplication(null);
              }}
              className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Start Another Application
            </button>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {showReceiptModal && createdApplication && (
        <OfficialReceiptModal
          application={createdApplication}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};
