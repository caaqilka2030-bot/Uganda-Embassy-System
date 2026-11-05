import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../constants/translations';
import {
  BookOpen,
  CreditCard,
  FileCheck2,
  GraduationCap,
  Baby,
  PlaneTakeoff,
  HeartHandshake,
  Compass,
  ShieldCheck,
  UserMinus,
  ArrowRight,
  Clock,
  Shield,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Building2,
  Calendar,
  Smartphone,
  MapPin,
  Lock,
} from 'lucide-react';

const SERVICE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  BookOpen,
  CreditCard,
  FileCheck2,
  GraduationCap,
  Baby,
  PlaneTakeoff,
  HeartHandshake,
  Compass,
  ShieldCheck,
  UserMinus,
};

export const LandingPage: React.FC = () => {
  const { language, setCurrentView, services, settings, setSelectedApplication } = useApp();
  const t = translations[language];

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'UGX'>('USD');

  const faqs =
    language === 'so'
      ? [
          {
            q: 'Intee in le’eg ayay qaadaneysaa bixinta Baasaboorku?',
            a: 'Baasaboorka cusub ama cusboonaysiinta caadiga ah waxay qaadataa 10 ilaa 14 maalmood oo shaqo ah ka dib marka laguu qaado faraha iyo sawirka.',
          },
          {
            q: 'Wakaaladda qof ma ii saxiixi karaa mise anaa imanaya?',
            a: 'Qofka bixinaya Wakaaladda (Grantor) waa inuu shakhsi ahaan yimaadaa Safaaradda isagoo wata baasaboorkiisa asalka ah iyo labo marqaati oo Soomaali ah oo wata baasaboorro sax ah.',
          },
          {
            q: 'Haddii lacagtu tahay "Fee to be confirmed" maxaan sameeyaa?',
            a: 'Waxaad buuxin kartaa codsigaaga adiga oo aan wax lacag ah bixin. Saraakiisha Qunsuliyadda ayaa dib u eegaya foomkaaga, kadibna kuusoo diraya qiimaha rasmiga ah si aad u bixiso.',
          },
          {
            q: 'Hababkee ayaan ku bixin karaa lacagta khidmadda?',
            a: 'Waxaad si nabad ah ugu bixin kartaa MTN Mobile Money, Airtel Money, Visa/Mastercard, ama Xawaalad bangi oo toos ah.',
          },
          {
            q: 'Ma ku imaan karaa safaaradda ballan la’aan?',
            a: 'Maya. Si loo ilaaliyo nidaamka loona yareeyo safafka, dhammaan muwaadiniintu waa inay ballan rasmi ah kasoo qabsadaan barta internet-ka ka hor inta aysan imaan Nakasero.',
          },
        ]
      : [
          {
            q: 'How long does the biometric passport processing take?',
            a: 'Normal biometric E-Passport issuance and renewal typically requires 10 to 14 working days following your in-person biometric capture at the Nakasero consular wing.',
          },
          {
            q: 'Must the grantor appear in person for Power of Attorney (Wakaalad)?',
            a: 'Yes. Under Somali diplomatic law, the grantor must personally appear before the Consular Officer with their original Somali passport and two adult Somali witnesses with valid identification.',
          },
          {
            q: 'What happens if a service fee shows "Fee to be confirmed"?',
            a: 'You can complete and submit your application with all required documents. The consular officer will review your specific case (e.g. visa type or attestation scope) and confirm the official fee, after which payment is unlocked in your portal.',
          },
          {
            q: 'What payment methods are supported on the portal?',
            a: 'We accept MTN Mobile Money, Airtel Money, Visa/Mastercard, and direct Bank Transfer to the official Embassy collection account at Stanbic Bank Uganda.',
          },
          {
            q: 'Can I visit the Embassy without an appointment?',
            a: 'No. To ensure zero waiting queues and dignified consular service, all citizens must hold an automated appointment reference before visiting Plot 46 Nakasero Road.',
          },
        ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section with Embassy Building Photo & Deep Navy Gradient */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden border-b border-[#C9A227]/40">
        {/* Background Image: Nakasero Embassy Building */}
        <div className="absolute inset-0 z-0">
          <img
            src="/public/assets/aistudio/HQ_new_1_843fa025.png"
            alt="Embassy of Somalia Building in Nakasero, Kampala"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform scale-105"
          />
          {/* Deep Navy Overlay (70% - 85% opacity) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/95 via-[#0B2545]/85 to-[#07192F]/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[#0B2545]/60" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
          {/* Diplomatic Mission Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-[#C9A227]/50 backdrop-blur-md shadow-lg">
            <img
              src="/public/assets/aistudio/Astaanta_dalka_cd5ae664.jfif"
              alt="Coat of arms"
              referrerPolicy="no-referrer"
              className="w-5 h-5 object-contain"
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F8F6F0]">
              {language === 'so'
                ? 'Safaaradda Jamhuuriyadda Federaalka Soomaaliya · Kampala'
                : 'Embassy of the Federal Republic of Somalia · Kampala'}
            </span>
          </div>

          {/* Primary Diplomatic Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-md">
            {t.heroHeadline}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed">
            {t.heroSubhead}
          </p>

          {/* Dual Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => setCurrentView('apply')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#4189DD] hover:bg-[#3476c5] active:bg-[#2b64a8] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#4189DD]/30 flex items-center justify-center gap-2 text-sm cursor-pointer group"
            >
              <span>{t.heroApplyBtn}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => setCurrentView('track')}
              className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 active:bg-white/5 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm transition-all text-sm cursor-pointer"
            >
              {t.heroTrackBtn}
            </button>
          </div>

          {/* Key Assurance Indicators */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left border-t border-white/15">
            <div className="flex items-center gap-2.5 p-2 bg-white/5 rounded-lg border border-white/10">
              <Clock className="w-4 h-4 text-[#C9A227] shrink-0" />
              <div className="text-[11px] leading-tight">
                <p className="font-bold text-white">{language === 'so' ? 'Hal Mar Booqo' : 'Visit Once'}</p>
                <p className="text-slate-300">{language === 'so' ? 'Faraha & Qaadashada' : 'Biometrics & Pickup'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-2 bg-white/5 rounded-lg border border-white/10">
              <Smartphone className="w-4 h-4 text-[#4189DD] shrink-0" />
              <div className="text-[11px] leading-tight">
                <p className="font-bold text-white">Mobile Money</p>
                <p className="text-slate-300">MTN & Airtel MoMo</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-2 bg-white/5 rounded-lg border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#2E6B3F] shrink-0" />
              <div className="text-[11px] leading-tight">
                <p className="font-bold text-white">{language === 'so' ? 'QR Rasiid' : 'QR Receipts'}</p>
                <p className="text-slate-300">{language === 'so' ? 'Xaqiijin Toos ah' : 'Digital Verification'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-2 bg-white/5 rounded-lg border border-white/10">
              <Building2 className="w-4 h-4 text-[#C9A227] shrink-0" />
              <div className="text-[11px] leading-tight">
                <p className="font-bold text-white">Nakasero HQ</p>
                <p className="text-slate-300">Plot 46 Nakasero Rd</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works: 4-Step Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-[#C9A227] uppercase tracking-widest">
            {language === 'so' ? 'Habka Fudud' : 'Streamlined Procedure'}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545]">
            {t.howItWorks}
          </h2>
          <p className="text-sm text-slate-600">
            {t.howItWorksSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#0B2545] text-[#C9A227] font-serif font-bold text-lg flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-serif text-base font-bold text-[#0B2545] mb-2">
              {t.step1Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#0B2545] text-[#C9A227] font-serif font-bold text-lg flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-serif text-base font-bold text-[#0B2545] mb-2">
              {t.step2Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#0B2545] text-[#C9A227] font-serif font-bold text-lg flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-serif text-base font-bold text-[#0B2545] mb-2">
              {t.step3Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.step3Desc}
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#0B2545] text-[#C9A227] font-serif font-bold text-lg flex items-center justify-center mb-4">
              4
            </div>
            <h3 className="font-serif text-base font-bold text-[#0B2545] mb-2">
              {t.step4Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.step4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Consular Services Grid (8 Core + 2 Optional) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#C9A227] uppercase tracking-widest">
              {language === 'so' ? 'Adeegyada Safaaradda' : 'Official Embassy Catalog'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545] mt-1">
              {t.servicesHeader}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {t.servicesSubtitle}
            </p>
          </div>
          <button
            onClick={() => setCurrentView('services')}
            className="text-xs font-semibold text-[#4189DD] hover:text-[#0B2545] flex items-center gap-1 transition-colors"
          >
            <span>{language === 'so' ? 'Eeg Dhammaan Adeegyada' : 'View Full Service Catalog'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services
            .filter((s) => s.isEnabled)
            .map((service) => {
              const IconComponent = SERVICE_ICONS[service.iconName] || BookOpen;

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0B2545] group-hover:bg-[#0B2545] group-hover:text-[#C9A227] transition-colors">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        {service.id === 'birth_certificate' ? (
                          <div className="text-xs">
                            <span className="font-bold text-[#0B2545]">$50 child</span>
                            <span className="text-slate-400"> / </span>
                            <span className="font-bold text-[#0B2545]">$100 adult</span>
                          </div>
                        ) : service.feeUsd !== null ? (
                          <div className="text-base font-bold text-[#0B2545] font-mono">
                            ${service.feeUsd} <span className="text-xs font-normal text-slate-500">USD</span>
                          </div>
                        ) : (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded">
                            {t.feeToBeConfirmed}
                          </span>
                        )}

                        {service.feeUgx && (
                          <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                            UGX {service.feeUgx.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#0B2545]">
                      {language === 'so' ? service.titleSo : service.titleEn}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {language === 'so' ? service.descriptionSo : service.descriptionEn}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{service.processingTime}</span>
                    </div>
                    <button
                      onClick={() => setCurrentView('apply')}
                      className="text-xs font-semibold text-[#4189DD] hover:text-[#0B2545] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>{language === 'so' ? 'Codso' : 'Apply'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* 4. Interactive Consular Fee Schedule & Conversion Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider">
                {language === 'so' ? 'Jadwalka Rasmiga ah ee Lacagaha' : 'Official Consular Tariff'}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2545] mt-1">
                {language === 'so' ? 'Lacagaha Adeegyada Safaaradda (USD & UGX)' : 'Embassy Service Fees Schedule'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Exchange Peg: 1 USD = {settings.exchangeRateUsdToUgx.toLocaleString()} UGX · Approved by the Ambassador’s Office
              </p>
            </div>

            {/* Currency Mode Segmented Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setCurrencyMode('USD')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  currencyMode === 'USD'
                    ? 'bg-[#0B2545] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrencyMode('UGX')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  currencyMode === 'UGX'
                    ? 'bg-[#0B2545] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                UGX (Sh.)
              </button>
            </div>
          </div>

          {/* Fee Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">{language === 'so' ? 'Adeegga' : 'Service'}</th>
                  <th className="py-3 px-4">USD ($)</th>
                  <th className="py-3 px-4">UG. Sh. (UGX)</th>
                  <th className="py-3 px-4">{language === 'so' ? 'Xaaladda Khidmadda' : 'Fee Status'}</th>
                  <th className="py-3 px-4 text-right">{language === 'so' ? 'Tallaabo' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((service, index) => {
                  return (
                    <tr key={service.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">{index + 1}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {language === 'so' ? service.titleSo : service.titleEn}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                        {service.id === 'birth_certificate'
                          ? 'Child $50 / Adult $100'
                          : service.feeUsd !== null
                          ? `$${service.feeUsd}`
                          : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {service.feeUgx
                          ? `UGX ${service.feeUgx.toLocaleString()}`
                          : service.feeUsd !== null
                          ? `UGX ${(service.feeUsd * settings.exchangeRateUsdToUgx).toLocaleString()}`
                          : '—'}
                      </td>
                      <td className="py-3 px-4">
                        {service.isFeePending ? (
                          <span className="inline-flex items-center text-[11px] text-amber-700 font-medium">
                            {language === 'so' ? 'Safaaradda ayaa xaqiijinaysa' : 'Fee confirmed upon review'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] text-emerald-700 font-medium">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {language === 'so' ? 'Toos ah' : 'Standardized fee'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setCurrentView('apply')}
                          className="px-3 py-1.5 text-xs font-semibold text-[#4189DD] hover:bg-[#4189DD]/10 rounded transition-colors"
                        >
                          {language === 'so' ? 'Codso' : 'Apply Now'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-[#C9A227] uppercase tracking-widest">
            {language === 'so' ? 'Su’aalaha Badan' : 'Citizen Help & FAQ'}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2545]">
            {language === 'so' ? 'Waxyaabaha Muhiimka ah ee La Isweydiiyo' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-[#0B2545] cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Consular Chancery Location & Operating Hours */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B2545] text-white rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 sm:p-12 space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider">
                {language === 'so' ? 'Goobta Safaaradda' : 'Chancery & Consular Wing'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Plot 46, Nakasero Road, Kampala
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Located on Nakasero Hill in central Kampala, the consular chancery processes biometrics, official identity documents, notarial powers of attorney, and diplomatic visas.
              </p>
            </div>

            <div className="space-y-3 text-xs border-t border-white/10 pt-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#C9A227]" />
                <span>Monday to Friday: 9:00 AM – 3:00 PM</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#4189DD]" />
                <span>Nakasero, P.O. Box 2736, Kampala, Uganda</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>All biometric visits require a confirmed digital appointment slip</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentView('apply')}
                className="px-6 py-3 bg-[#C9A227] hover:bg-[#b59120] text-[#0B2545] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                {language === 'so' ? 'Bilaaw Codsigaaga Hadda' : 'Start Your Online Application'}
              </button>
            </div>
          </div>

          <div className="relative min-h-[300px] bg-slate-800">
            <img
              src="/public/assets/aistudio/HQ_new_1_843fa025.png"
              alt="Somali Embassy Kampala exterior"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545] via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </section>
    </div>
  );
};
