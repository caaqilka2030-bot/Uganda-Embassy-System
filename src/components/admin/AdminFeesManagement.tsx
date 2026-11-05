import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EmbassyService, ServiceId } from '../../types';
import {
  Sliders,
  DollarSign,
  Save,
  Check,
  Info,
  Building,
  Image as ImageIcon,
  Zap,
} from 'lucide-react';

export const AdminFeesManagement: React.FC = () => {
  const { services, updateServiceFee, toggleServiceEnabled, settings, updateSettings, showToast } = useApp();

  const [exchangeRateInput, setExchangeRateInput] = useState(settings.exchangeRateUsdToUgx);
  const [expressSurchargeInput, setExpressSurchargeInput] = useState(settings.expressProcessingSurchargeUsd);
  const [showFeeSheetModal, setShowFeeSheetModal] = useState(false);

  // Local state for editing fees in table
  const [editableServices, setEditableServices] = useState<EmbassyService[]>(services);

  const handleFeeChange = (id: ServiceId, field: 'feeUsd' | 'feeUgx' | 'isFeePending', value: any) => {
    setEditableServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSaveServiceFee = (service: EmbassyService) => {
    updateServiceFee(service.id, service.feeUsd, service.feeUgx, service.isFeePending);
  };

  const handleSaveGlobalRates = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      exchangeRateUsdToUgx: exchangeRateInput,
      expressProcessingSurchargeUsd: expressSurchargeInput,
    });
    showToast('success', 'Exchange rate and surcharge updated successfully');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#C9A227] text-[#0B2545] mb-1">
            Master User Restricted Configuration
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
            Services Tariff & Currency Exchange Management
          </h1>
          <p className="text-xs text-slate-500">
            Set official consular tariffs (USD & UGX), exchange conversion rates, and toggle optional services.
          </p>
        </div>

        {/* View Original Hand-written Fee Register */}
        <button
          onClick={() => setShowFeeSheetModal(true)}
          className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-[#4189DD] text-slate-800 dark:text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ImageIcon className="w-4 h-4 text-[#C9A227]" />
          <span>View Handwritten Fee Sheet</span>
        </button>
      </div>

      {/* Global Currency & Fast-Track Controls */}
      <form
        onSubmit={handleSaveGlobalRates}
        className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4"
      >
        <h3 className="font-serif font-bold text-base text-[#0B2545] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
          Global Financial Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">
              USD to UGX Exchange Rate:
            </label>
            <div className="flex items-center">
              <span className="p-2 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-700 rounded-l text-slate-500">
                1 USD =
              </span>
              <input
                type="number"
                value={exchangeRateInput}
                onChange={(e) => setExchangeRateInput(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-r font-mono font-bold"
              />
            </div>
            <span className="text-[10px] text-slate-400">Used for automatic conversion</span>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">
              Priority Express Surcharge ($ USD):
            </label>
            <input
              type="number"
              value={expressSurchargeInput}
              onChange={(e) => setExpressSurchargeInput(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold"
            />
            <span className="text-[10px] text-slate-400">Fast-track service fee option</span>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#0B2545] hover:bg-black text-[#C9A227] font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Financial Rates</span>
            </button>
          </div>
        </div>
      </form>

      {/* Services Fee Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#0B2545] dark:text-white">
            Individual Service Tariffs
          </h3>
          <span className="text-xs text-slate-400">Master User Real-Time Editing</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-[#0B2545] text-white">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">USD Fee</th>
                <th className="py-3 px-4">UGX Fee</th>
                <th className="py-3 px-4">Fee Pending Rule</th>
                <th className="py-3 px-4">Enabled Status</th>
                <th className="py-3 px-4 text-right">Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {editableServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {service.titleEn}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 capitalize">
                    {service.category}
                  </td>
                  <td className="py-3.5 px-4">
                    <input
                      type="number"
                      value={service.feeUsd ?? ''}
                      placeholder="Pending"
                      onChange={(e) =>
                        handleFeeChange(
                          service.id,
                          'feeUsd',
                          e.target.value === '' ? null : Number(e.target.value)
                        )
                      }
                      className="w-24 p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <input
                      type="number"
                      value={service.feeUgx ?? ''}
                      placeholder="Auto"
                      onChange={(e) =>
                        handleFeeChange(
                          service.id,
                          'feeUgx',
                          e.target.value === '' ? null : Number(e.target.value)
                        )
                      }
                      className="w-28 p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={service.isFeePending}
                        onChange={(e) =>
                          handleFeeChange(service.id, 'isFeePending', e.target.checked)
                        }
                        className="w-3.5 h-3.5 text-[#4189DD] rounded"
                      />
                      <span className="text-[11px] text-slate-600 dark:text-slate-300">
                        Pending review
                      </span>
                    </label>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleServiceEnabled(service.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        service.isEnabled
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {service.isEnabled ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleSaveServiceFee(service)}
                      className="px-3 py-1 bg-[#4189DD] hover:bg-[#3476c5] text-white rounded font-semibold text-xs cursor-pointer shadow-2xs"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal with Uploaded Handwritten Fee Register Image */}
      {showFeeSheetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-300 dark:border-slate-800 max-w-2xl w-full space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="font-serif font-bold text-base text-[#0B2545] dark:text-white">
                Official Embassy Service Fees Register (Original Record)
              </h3>
              <button
                onClick={() => setShowFeeSheetModal(false)}
                className="text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden max-h-[480px] overflow-y-auto">
              <img
                src="/public/assets/aistudio/Embassy_Service_Fees_structure_d932316b.jpeg"
                alt="Handwritten Embassy Service fees structure notebook"
                referrerPolicy="no-referrer"
                className="w-full object-contain"
              />
            </div>

            <p className="text-[11px] text-slate-500">
              Note: This uploaded register serves as the baseline consular tariff record for Kampala mission operations.
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setShowFeeSheetModal(false)}
                className="px-4 py-1.5 bg-[#0B2545] text-white font-semibold rounded text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
