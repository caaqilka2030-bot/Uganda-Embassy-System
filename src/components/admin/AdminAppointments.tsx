import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Check,
  Building,
} from 'lucide-react';

export const AdminAppointments: React.FC = () => {
  const { applications, checkInAppointment, bookAppointment } = useApp();

  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-11-06');
  const [rescheduleAppId, setRescheduleAppId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('2026-11-10');
  const [newTime, setNewTime] = useState('11:00 AM');

  // Filter apps that have an appointment
  const scheduledApps = applications.filter((app) => app.appointment);

  const filteredApps = scheduledApps.filter((app) => {
    if (!app.appointment) return false;
    if (selectedDate && app.appointment.date !== selectedDate) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      app.referenceNumber.toLowerCase().includes(q) ||
      app.applicant.fullName.toLowerCase().includes(q)
    );
  });

  const handleReschedule = () => {
    if (!rescheduleAppId) return;
    bookAppointment(rescheduleAppId, newDate, newTime, 'Consular Desk');
    setRescheduleAppId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#0B2545] dark:text-white">
          Consular Biometrics & Appointments Calendar
        </h1>
        <p className="text-xs text-slate-500">
          Daily attendance queue, front desk check-in, and biometric enrollment schedules.
        </p>
      </div>

      {/* Date Switcher Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#4189DD]" />
          <span className="font-semibold text-slate-700 dark:text-slate-200">Select Date:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['2026-11-05', '2026-11-06', '2026-11-09', '2026-11-10', '2026-11-11'].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-colors ${
                  selectedDate === d
                    ? 'bg-[#0B2545] text-[#C9A227] font-bold shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search citizen or ref..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Appointment Slots Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-[#0B2545] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">Time Slot</th>
                <th className="py-3 px-4 font-semibold">Applicant Name</th>
                <th className="py-3 px-4 font-semibold">Ref Number</th>
                <th className="py-3 px-4 font-semibold">Consular Service</th>
                <th className="py-3 px-4 font-semibold">Counter / Room</th>
                <th className="py-3 px-4 font-semibold">Check-In Status</th>
                <th className="py-3 px-4 font-semibold text-right">Reception Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => {
                  const apt = app.appointment!;
                  const isCheckedIn = apt.status === 'checked_in';

                  return (
                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0B2545] dark:text-[#4189DD]">
                        {apt.time}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {app.applicant.fullName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {app.referenceNumber}
                      </td>
                      <td className="py-3.5 px-4 capitalize text-slate-700 dark:text-slate-300">
                        {app.serviceId.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                        {apt.counter || 'Room 1 (Biometrics)'}
                      </td>
                      <td className="py-3.5 px-4">
                        {isCheckedIn ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                            <Check className="w-3 h-3" />
                            <span>Arrived at {apt.checkedInAt || 'Reception'}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Scheduled</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isCheckedIn && (
                            <button
                              onClick={() => checkInAppointment(app.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] transition-colors"
                            >
                              Check-In
                            </button>
                          )}
                          <button
                            onClick={() => setRescheduleAppId(app.id)}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded text-[11px] font-medium"
                          >
                            Reschedule
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    No appointments booked for {selectedDate}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleAppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-300 dark:border-slate-800 max-w-sm w-full space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-[#0B2545] dark:text-white">
              Reschedule Consular Appointment
            </h3>
            <div className="space-y-2">
              <label className="block text-slate-700 dark:text-slate-300 font-semibold">New Date:</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-slate-700 dark:text-slate-300 font-semibold">New Time Slot:</label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
              >
                <option value="09:30 AM">09:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="01:30 PM">01:30 PM</option>
                <option value="02:30 PM">02:30 PM</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRescheduleAppId(null)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="px-4 py-1.5 bg-[#4189DD] hover:bg-[#3476c5] text-white font-bold rounded"
              >
                Save New Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
