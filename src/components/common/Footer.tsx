import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../constants/translations';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setCurrentView, currentStaff, loginAsStaff } = useApp();
  const t = translations[language];

  return (
    <footer className="bg-[#0B2545] text-slate-300 border-t border-[#C9A227]/40 relative overflow-hidden">
      {/* Subtle large Somali coat of arms watermark in background */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-5 w-96 h-96 -mr-16 -mb-16">
        <img
          src="/public/assets/aistudio/Astaanta_dalka_cd5ae664.jfif"
          alt="Watermark"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain filter grayscale"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Mission Identity & Coat of Arms */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/public/assets/aistudio/Astaanta_dalka_cd5ae664.jfif"
                alt="Coat of Arms of Somalia"
                referrerPolicy="no-referrer"
                className="w-14 h-14 object-contain filter drop-shadow"
              />
              <div>
                <h4 className="font-serif text-lg font-bold text-white leading-snug">
                  {language === 'so'
                    ? 'Safaaradda Soomaaliya'
                    : 'Embassy of Somalia'}
                </h4>
                <p className="text-xs text-[#C9A227] font-medium">
                  {language === 'so' ? 'Kampala, Jamhuuriyadda Uganda' : 'Kampala, Republic of Uganda'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'so'
                ? 'Albaabka rasmiga ah ee adeegyada qunsuliyadda ee Jamhuuriyadda Federaalka Soomaaliya. Bixi khidmadda, qabso ballan, oo hal mar ka soo qaado safaaradda.'
                : 'The official digital consular portal for the Federal Republic of Somalia in Uganda. Apply online, complete certified payments, and visit once for biometrics and issuance.'}
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#C9A227] font-medium bg-white/5 px-2.5 py-1 rounded border border-[#C9A227]/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                {language === 'so' ? 'Nidaam Diblomaasiyadeed oo Sugan' : 'Official Consular Government Portal'}
              </span>
            </div>
          </div>

          {/* Quick Consular Links */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-white tracking-wide uppercase mb-4 text-[#C9A227]">
              {language === 'so' ? 'Adeegyada Muhiimka ah' : 'Key Services'}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('services')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'so' ? 'Baasaboorka E-Passport' : 'Somali Biometric E-Passport'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('services')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'so' ? 'Kaarka Aqoonsiga NIRA' : 'National ID Card (NIRA)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('services')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'so' ? 'Wakaaladda Rasmiga ah (Power of Attorney)' : 'Power of Attorney (Wakaalad)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('services')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'so' ? 'Shahaadooyinka Dhalashada & Dhimashada' : 'Birth & Death Civil Certificates'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('services')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'so' ? 'Warqadda Socdaalka Go Home' : 'Emergency Return (Go Home) Document'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('services')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'so' ? 'Fiisada Soomaaliya (Somalia Visa)' : 'Entry Visa to Somalia'}
                </button>
              </li>
            </ul>
          </div>

          {/* Consular Location & Timings */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-white tracking-wide uppercase mb-4 text-[#C9A227]">
              {language === 'so' ? 'Goobta & Saacadaha' : 'Location & Hours'}
            </h5>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#4189DD] shrink-0 mt-0.5" />
                <span>
                  Plot 46, Nakasero Road, Nakasero Hill, Kampala, Uganda.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">
                    {language === 'so' ? 'Isniin – Jimce:' : 'Monday – Friday:'}
                  </p>
                  <p>9:00 AM – 3:00 PM (Appointments only)</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'so' ? 'Sabti, Axad & Ciidaha: Waa Xiran Tahay' : 'Weekends & Public Holidays: Closed'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Emergency Support */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-white tracking-wide uppercase mb-4 text-[#C9A227]">
              {language === 'so' ? 'Xiriirka & Kaalmada' : 'Contact & Assistance'}
            </h5>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#2E6B3F] shrink-0" />
                <span>+256 414 256 098 / +256 772 120 450</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#4189DD] shrink-0" />
                <span>consular@somaliembassy.ug</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('track')}
                  className="w-full text-center px-3 py-2 bg-white/10 hover:bg-white/15 text-white font-medium rounded-lg text-xs transition-colors border border-white/20"
                >
                  {t.track}
                </button>
              </div>
              <div className="pt-1">
                <button
                  onClick={() => setCurrentView('admin')}
                  className="text-[11px] text-[#C9A227] hover:underline flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === 'so' ? 'Galaangalka Qunsuliyadda (Shaqaalaha)' : 'Consular Staff Secure Login'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Government Disclaimers */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <p>{t.copyright}</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-200 cursor-pointer">Privacy & Data Protection Notice</span>
            <span>·</span>
            <span className="hover:text-slate-200 cursor-pointer">Terms of Consular Service</span>
            <span>·</span>
            <span className="text-[#C9A227]">MFA Somalia Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
