import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../constants/translations';
import { ServiceId } from '../../types';
import {
  Calculator,
  Search,
  CheckCircle,
  HelpCircle,
  Info,
  DollarSign,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const FeesPage: React.FC = () => {
  const { language, setCurrentView, services, settings } = useApp();
  const t = translations[language];

  const [search, setSearch] = useState('');
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'UGX'>('USD');

  // Interactive Fee Calculator State
  const [calcServiceId, setCalcServiceId] = useState<ServiceId>('passport');
  const [calcApplicantAge, setCalcApplicantAge] = useState<'adult' | 'minor'>('adult');
  const [calcExpress, setCalcExpress] = useState(false);
  const [calcCopies, setCalcCopies] = useState(1);

  const selectedService = services.find((s) => s.id === calcServiceId);

  const calculateTotal = () => {
    if (!selectedService) return { usd: 0, ugx: 0, pending: false };

    if (selectedService.isFeePending && selectedService.feeUsd === null && selectedService.feeUgx === null) {
      return { usd: 0, ugx: 0, pending: true };
    }

    let baseUsd = selectedService.feeUsd || 0;
    let baseUgx = selectedService.feeUgx || 0;

    if (selectedService.id === 'birth_certificate') {
      baseUsd = calcApplicantAge === 'minor' ? 50 : 100;
      baseUgx = Math.round(baseUsd * settings.exchangeRateUsdToUgx);
    } else if (baseUsd > 0 && baseUgx === 0) {
      baseUgx = Math.round(baseUsd * settings.exchangeRateUsdToUgx);
    } else if (baseUgx > 0 && baseUsd === 0) {
      baseUsd = Math.round(baseUgx / settings.exchangeRateUsdToUgx);
    }

    const expressUsd = calcExpress && settings.allowExpressProcessing ? settings.expressProcessingSurchargeUsd : 0;
    const expressUgx = expressUsd * settings.exchangeRateUsdToUgx;

    const totalUsd = (baseUsd * calcCopies) + expressUsd;
    const totalUgx = (baseUgx * calcCopies) + expressUgx;

    return { usd: totalUsd, ugx: totalUgx, pending: false };
  };

  const calcResult = calculateTotal();

  const filteredServices = services
    .filter((s) => s.isEnabled)
    .filter((s) => {
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return s.titleEn.toLowerCase().includes(term) || s.titleSo.toLowerCase().includes(term);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#C9A227] uppercase tracking-widest">
          {language === 'so' ? 'Tariifada Rasmiga ah' : 'Government Tariffs'}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B2545]">
          {language === 'so' ? 'Qiimaha & Khidmadaha Qunsuliyadda' : 'Consular Fees & Currency Exchange'}
        </h1>
        <p className="text-sm text-slate-600">
          Official tariff sheet of the Embassy of the Federal Republic of Somalia in Kampala, Uganda. Support for both United States Dollars (USD) and Ugandan Shillings (UGX).
        </p>
      </div>

      {/* 2-Column Section: Searchable Tariff Table (Left) + Interactive Calculator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Searchable Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={language === 'so' ? 'Raadi khidmad...' : 'Search fee schedule...'}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4189DD]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Display:</span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setCurrencyMode('USD')}
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    currencyMode === 'USD' ? 'bg-[#0B2545] text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrencyMode('UGX')}
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    currencyMode === 'UGX' ? 'bg-[#0B2545] text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  UGX (Sh.)
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-[#0B2545] text-white">
                <tr>
                  <th className="py-3 px-4 font-semibold">Service Name</th>
                  <th className="py-3 px-4 font-semibold text-right">USD Amount</th>
                  <th className="py-3 px-4 font-semibold text-right">UGX Amount</th>
                  <th className="py-3 px-4 font-semibold">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredServices.map((service, index) => (
                  <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div>{language === 'so' ? service.titleSo : service.titleEn}</div>
                      <span className="text-[11px] text-slate-400 capitalize">{service.category}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-right text-slate-800">
                      {service.id === 'birth_certificate'
                        ? 'Child $50 / Adult $100'
                        : service.feeUsd !== null
                        ? `$${service.feeUsd}`
                        : 'To be confirmed'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-right text-slate-700">
                      {service.feeUgx
                        ? `UGX ${service.feeUgx.toLocaleString()}`
                        : service.feeUsd !== null
                        ? `UGX ${(service.feeUsd * settings.exchangeRateUsdToUgx).toLocaleString()}`
                        : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {service.isFeePending ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          Pending confirmation
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Standard tariff
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#4189DD] shrink-0 mt-0.5" />
            <p>
              <strong>Notice regarding Pending Fees:</strong> As indicated on the official Chancery service register, fees for National ID (USD), Education attestation (USD), Death registration, and Entry Visas are subject to case-by-case consular confirmation by the Ambassador's desk prior to payment execution.
            </p>
          </div>
        </div>

        {/* Right Col: Interactive Fee Calculator */}
        <div className="bg-white rounded-xl border border-[#C9A227]/40 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Calculator className="w-5 h-5 text-[#C9A227]" />
            <h3 className="font-serif text-lg font-bold text-[#0B2545]">
              {language === 'so' ? 'Xisaabiyaha Khidmadda' : 'Fee Estimator'}
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Service Select */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Select Consular Service:</label>
              <select
                value={calcServiceId}
                onChange={(e) => setCalcServiceId(e.target.value as ServiceId)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#4189DD] text-slate-800"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {language === 'so' ? s.titleSo : s.titleEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Special Category for Birth Certificate */}
            {calcServiceId === 'birth_certificate' && (
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Applicant Age Group:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCalcApplicantAge('minor')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold ${
                      calcApplicantAge === 'minor'
                        ? 'bg-[#0B2545] text-white border-[#0B2545]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Child under 18 ($50)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcApplicantAge('adult')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold ${
                      calcApplicantAge === 'adult'
                        ? 'bg-[#0B2545] text-white border-[#0B2545]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Adult 18+ ($100)
                  </button>
                </div>
              </div>
            )}

            {/* Copies */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Number of Documents / Copies:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={calcCopies}
                onChange={(e) => setCalcCopies(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            {/* Express Processing Surcharge Toggle */}
            {settings.allowExpressProcessing && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0B2545] block">Priority Express Processing</span>
                  <span className="text-[11px] text-slate-600">
                    +$50 USD surcharge (24-48 hr fast-track)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={calcExpress}
                  onChange={(e) => setCalcExpress(e.target.checked)}
                  className="w-4 h-4 text-[#4189DD] rounded"
                />
              </div>
            )}
          </div>

          {/* Calculator Output Display */}
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 border border-slate-800">
            <span className="text-[10px] text-[#C9A227] uppercase font-bold tracking-wider block">
              Estimated Total Consular Tariff
            </span>
            {calcResult.pending ? (
              <div className="text-amber-400 font-semibold text-sm">
                Fee to be confirmed by Consular Desk
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold font-mono text-white">
                  ${calcResult.usd.toFixed(2)} <span className="text-xs font-normal text-slate-400">USD</span>
                </div>
                <div className="text-sm font-mono text-[#C9A227]">
                  UGX {calcResult.ugx.toLocaleString()}
                </div>
              </div>
            )}
            <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-800">
              Exchange rate: 1 USD = {settings.exchangeRateUsdToUgx.toLocaleString()} UGX
            </p>
          </div>

          <button
            onClick={() => setCurrentView('apply')}
            className="w-full py-3 bg-[#4189DD] hover:bg-[#3476c5] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Proceed to Apply with this Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
