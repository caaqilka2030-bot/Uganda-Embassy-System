import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Clock,
  Calendar,
  Bell,
  Save,
  Shield,
  Building,
  Mail,
  Smartphone,
  Lock,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, showToast } = useApp();

  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(settings.isAnnouncementActive);
  const [workingStart, setWorkingStart] = useState(settings.workingHours.start);
  const [workingEnd, setWorkingEnd] = useState(settings.workingHours.end);
  const [dailySlotLimit, setDailySlotLimit] = useState(settings.dailyAppointmentSlotLimit);
  const [unpaidExpiryDays, setUnpaidExpiryDays] = useState(settings.unpaidApplicationExpiryDays);

  // Editable Notification Templates
  const [smsTemplate, setSmsTemplate] = useState(
    'Embassy of Somalia Kampala: Your consular application {ref} is approved. Your appointment is scheduled for {date} at {time}. Nakasero HQ.'
  );

  const [emailTemplate, setEmailTemplate] = useState(
    'Dear {applicant_name},\n\nWe are pleased to inform you that your application for {service_name} (Ref: {ref}) has been processed and approved by the Consular Desk of the Embassy of the Federal Republic of Somalia in Kampala, Uganda.\n\nPlease attend your biometrics appointment or collect your document at Plot 46 Nakasero Road.\n\nSincerely,\nConsular Section'
  );

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      announcementText,
      isAnnouncementActive,
      dailyAppointmentSlotLimit: dailySlotLimit,
      unpaidApplicationExpiryDays: unpaidExpiryDays,
      workingHours: {
        start: workingStart,
        end: workingEnd,
      },
    });
    showToast('success', 'Embassy settings and broadcast notice saved');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
          Chancery Operational Settings & Communication Templates
        </h1>
        <p className="text-xs text-slate-500">
          Configure working hours, public broadcast alerts, biometrics capacity, and automated applicant SMS/Email templates.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* 1. Public Announcement Broadcast Bar */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#C9A227]" />
              <h3 className="font-serif font-bold text-base text-[#0B2545] dark:text-white">
                Public Site Broadcast Announcement Bar
              </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isAnnouncementActive}
                onChange={(e) => setIsAnnouncementActive(e.target.checked)}
                className="w-4 h-4 text-[#4189DD] rounded"
              />
              <span>Display on Top Header</span>
            </label>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">
              Announcement Message:
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
            <span className="text-[10px] text-slate-400">
              Displayed in gold banner across the public landing and service pages.
            </span>
          </div>
        </div>

        {/* 2. Consular Hours & Appointment Capacity */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#0B2545] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Chancery Operating Hours & Capacity Limits
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Opening Time:
              </label>
              <input
                type="text"
                value={workingStart}
                onChange={(e) => setWorkingStart(e.target.value)}
                placeholder="09:00"
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Closing Time:
              </label>
              <input
                type="text"
                value={workingEnd}
                onChange={(e) => setWorkingEnd(e.target.value)}
                placeholder="15:00"
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Max Daily Slots:
              </label>
              <input
                type="number"
                value={dailySlotLimit}
                onChange={(e) => setDailySlotLimit(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Unpaid Expiry (Days):
              </label>
              <input
                type="number"
                value={unpaidExpiryDays}
                onChange={(e) => setUnpaidExpiryDays(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* 3. Notification & Messaging Templates */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#0B2545] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Automated SMS & Email Notification Templates
          </h3>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#4189DD]" />
                <span>SMS Status Notification Template:</span>
              </label>
              <textarea
                rows={2}
                value={smsTemplate}
                onChange={(e) => setSmsTemplate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#4189DD]" />
                <span>Official Consular Approval Email Template:</span>
              </label>
              <textarea
                rows={4}
                value={emailTemplate}
                onChange={(e) => setEmailTemplate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#4189DD] hover:bg-[#3476c5] text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Embassy Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
