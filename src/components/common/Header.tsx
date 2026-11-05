import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../constants/translations';
import { Shield, User, Globe, ChevronDown, Bell, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    currentView,
    setCurrentView,
    currentStaff,
    currentCitizen,
    logoutStaff,
    logoutCitizen,
    settings,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const t = translations[language];

  return (
    <header className="sticky top-0 z-50 bg-[#0B2545] text-white shadow-md border-b border-[#C9A227]/30">
      {/* Optional Embassy Broadcast Announcement Bar */}
      {settings.isAnnouncementActive && settings.announcementText && (
        <div className="bg-[#07192F] text-xs py-1.5 px-4 text-[#F8F6F0]/90 border-b border-white/10 flex items-center justify-between">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-center truncate">
            <span className="font-semibold text-[#C9A227] tracking-wider shrink-0 uppercase text-[10px]">
              {language === 'so' ? 'Ogeysiis Rasmi ah' : 'Embassy Notice'}
            </span>
            <span className="text-white/60">·</span>
            <span className="truncate">{settings.announcementText}</span>
          </div>
        </div>
      )}

      {/* Main Top Navigation conforming to Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark & Coat of Arms Emblem */}
        <div
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3.5 cursor-pointer whitespace-nowrap shrink-0 group"
        >
          <img
            src="/public/assets/aistudio/Astaanta_dalka_cd5ae664.jfif"
            alt="Emblem of the Federal Republic of Somalia"
            referrerPolicy="no-referrer"
            className="w-12 h-12 object-contain filter drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-[#F8F6F0] leading-tight">
              {language === 'so' ? 'Safaaradda Soomaaliya' : 'Somali Embassy'}
            </span>
            <span className="text-[11px] font-sans font-medium text-[#C9A227] tracking-wide">
              {language === 'so' ? 'Kampala, Uganda · Adeegyada Qunsuliyadda' : 'Kampala, Uganda · Consular Services'}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-line, quiet hover states) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-200">
          <button
            onClick={() => setCurrentView('home')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-1 border-b-2 ${
              currentView === 'home'
                ? 'text-white border-[#C9A227] font-semibold'
                : 'text-slate-300 border-transparent hover:border-white/30'
            }`}
          >
            {t.home}
          </button>
          <button
            onClick={() => setCurrentView('services')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-1 border-b-2 ${
              currentView === 'services'
                ? 'text-white border-[#C9A227] font-semibold'
                : 'text-slate-300 border-transparent hover:border-white/30'
            }`}
          >
            {t.services}
          </button>
          <button
            onClick={() => setCurrentView('fees')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-1 border-b-2 ${
              currentView === 'fees'
                ? 'text-white border-[#C9A227] font-semibold'
                : 'text-slate-300 border-transparent hover:border-white/30'
            }`}
          >
            {t.fees}
          </button>
          <button
            onClick={() => setCurrentView('track')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-1 border-b-2 ${
              currentView === 'track'
                ? 'text-white border-[#C9A227] font-semibold'
                : 'text-slate-300 border-transparent hover:border-white/30'
            }`}
          >
            {t.track}
          </button>
        </nav>

        {/* Zone 3: Language Toggle, Staff Portal / Citizen Session, and Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Bilingual Switch */}
          <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/15">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                language === 'en'
                  ? 'bg-[#4189DD] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('so')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                language === 'so'
                  ? 'bg-[#4189DD] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              SO
            </button>
          </div>

          {/* Staff Back Office Portal Trigger */}
          <button
            onClick={() => setCurrentView('admin')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
              currentView === 'admin'
                ? 'bg-[#C9A227] text-[#0B2545] border-[#C9A227] font-semibold shadow-sm'
                : 'bg-white/5 border-white/20 text-slate-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>{currentStaff ? `${currentStaff.role.replace(/_/g, ' ')}` : t.staffLogin}</span>
          </button>

          {/* Primary Action Button: Apply Online */}
          <button
            onClick={() => setCurrentView('apply')}
            className="px-4 py-2 text-xs md:text-sm font-semibold text-white bg-[#4189DD] hover:bg-[#3476c5] active:bg-[#2b64a8] rounded-lg transition-all shadow-md shadow-[#4189DD]/20 hover:shadow-lg whitespace-nowrap"
          >
            {t.applyNow}
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#07192F] border-b border-white/10 px-4 pt-3 pb-5 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-left ${currentView === 'home' ? 'bg-[#4189DD] text-white' : 'text-slate-200 bg-white/5'}`}
            >
              {t.home}
            </button>
            <button
              onClick={() => {
                setCurrentView('services');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-left ${currentView === 'services' ? 'bg-[#4189DD] text-white' : 'text-slate-200 bg-white/5'}`}
            >
              {t.services}
            </button>
            <button
              onClick={() => {
                setCurrentView('fees');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-left ${currentView === 'fees' ? 'bg-[#4189DD] text-white' : 'text-slate-200 bg-white/5'}`}
            >
              {t.fees}
            </button>
            <button
              onClick={() => {
                setCurrentView('track');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-left ${currentView === 'track' ? 'bg-[#4189DD] text-white' : 'text-slate-200 bg-white/5'}`}
            >
              {t.track}
            </button>
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentView('admin');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-medium text-[#C9A227] p-2 bg-white/5 rounded-lg"
            >
              <Shield className="w-4 h-4" />
              <span>{t.staffLogin}</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('apply');
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#4189DD] rounded-lg"
            >
              {t.applyNow}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
