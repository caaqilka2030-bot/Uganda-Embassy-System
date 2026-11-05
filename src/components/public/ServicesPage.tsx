import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../constants/translations';
import { EmbassyService } from '../../types';
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
  Check,
  Clock,
  ArrowRight,
  Search,
  Filter,
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

export const ServicesPage: React.FC = () => {
  const { language, setCurrentView, services, settings } = useApp();
  const t = translations[language];

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredServices = services
    .filter((s) => s.isEnabled)
    .filter((s) => {
      if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return (
        s.titleEn.toLowerCase().includes(term) ||
        s.titleSo.toLowerCase().includes(term) ||
        s.descriptionEn.toLowerCase().includes(term)
      );
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#C9A227] uppercase tracking-widest">
          {language === 'so' ? 'Buug-yaraha Adeegyada Qunsuliyadda' : 'Consular & Legal Service Catalog'}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B2545]">
          {language === 'so' ? 'Dhammaan Adeegyada Safaaradda' : 'Consular Services & Requirements'}
        </h1>
        <p className="text-sm text-slate-600">
          {language === 'so'
            ? 'Akhri shuruudaha dukumeentiyada, muddada, iyo khidmadda ka hor inta aadan bilaabin codsigaaga.'
            : 'Review mandatory supporting documentation, processing SLAs, and official embassy consular tariffs before beginning your application.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'so' ? 'Raadi adeeg...' : 'Search services...'}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4189DD]"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', labelEn: 'All Services', labelSo: 'Dhammaan' },
            { id: 'identity', labelEn: 'Identity & Passports', labelSo: 'Aqoonsiga' },
            { id: 'legal', labelEn: 'Legal & Wakaalad', labelSo: 'Sharciga' },
            { id: 'records', labelEn: 'Civil Records', labelSo: 'Diiwaanka' },
            { id: 'travel', labelEn: 'Visas & Travel', labelSo: 'Socdaalka' },
            { id: 'optional', labelEn: 'CID & Extras', labelSo: 'Dheeraad' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0B2545] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'so' ? cat.labelSo : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Services Cards List */}
      <div className="space-y-6">
        {filteredServices.map((service) => {
          const Icon = SERVICE_ICONS[service.iconName] || BookOpen;

          return (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-[#4189DD]/40 transition-all p-6 sm:p-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Details and Requirements */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0B2545]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-bold text-[#0B2545]">
                        {language === 'so' ? service.titleSo : service.titleEn}
                      </h2>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="capitalize">{service.category}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{service.processingTime}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {language === 'so' ? service.descriptionSo : service.descriptionEn}
                  </p>

                  {/* Requirements Checklist */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                      {language === 'so' ? 'Dukumeentiyada Loo Baahan Yahay:' : 'Required Supporting Documents:'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {service.requiredDocuments.map((doc, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-700 bg-slate-50 p-2 rounded border border-slate-200/80">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {service.id === 'power_of_attorney' && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                      <strong>Diplomatic Notice:</strong> The grantor must appear in person before the Consular Officer with an original valid Somali Passport and two adult Somali witnesses.
                    </div>
                  )}
                </div>

                {/* Right Col: Fee summary & CTA */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      {language === 'so' ? 'Khidmadda Rasmiga ah' : 'Standard Consular Fee'}
                    </span>
                    {service.id === 'birth_certificate' ? (
                      <div>
                        <div className="text-xl font-bold font-mono text-[#0B2545]">
                          $50 <span className="text-xs text-slate-600">Child (&lt;18)</span>
                        </div>
                        <div className="text-xl font-bold font-mono text-[#0B2545]">
                          $100 <span className="text-xs text-slate-600">Adult (18+)</span>
                        </div>
                      </div>
                    ) : service.feeUsd !== null ? (
                      <div className="text-2xl font-bold font-mono text-[#0B2545]">
                        ${service.feeUsd} <span className="text-xs font-normal text-slate-500">USD</span>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-amber-100/70 border border-amber-300 rounded text-xs font-semibold text-amber-900">
                        {t.feeToBeConfirmed}
                      </div>
                    )}

                    {service.feeUgx ? (
                      <p className="text-xs font-mono text-slate-600">
                        Fixed Tariff: UGX {service.feeUgx.toLocaleString()}
                      </p>
                    ) : service.feeUsd !== null ? (
                      <p className="text-xs font-mono text-slate-500">
                        Approx: UGX {(service.feeUsd * settings.exchangeRateUsdToUgx).toLocaleString()}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setCurrentView('apply')}
                      className="w-full py-2.5 bg-[#4189DD] hover:bg-[#3476c5] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{language === 'so' ? 'Bilaaw Codsiga' : 'Start Application'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-[10px] text-center text-slate-500">
                      Auto reference number & QR receipt generated upon submission.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
