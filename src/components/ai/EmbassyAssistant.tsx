import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, X, Send, Bot, User, Sparkles, Volume2, Shield } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const EmbassyAssistant: React.FC = () => {
  const { language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text:
        language === 'so'
          ? 'Kusoo dhawaaw Kaaliyaha Rasmiga ah ee Safaaradda Soomaaliya ee Kampala. Waxaad i weydiin kartaa shuruudaha adeegyada, lacagaha, iyo habka ballamaha. Sideen kuu caawiyaa maanta?'
          : 'Welcome to the official Somali Embassy Consular Assistant for Kampala, Uganda. Ask me anything about consular requirements, fees, appointment slots, or legal procedures in English or Somali.',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Suggested prompts
  const suggestions =
    language === 'so'
      ? [
          'Immisa waaye lacagta Baasaboorka?',
          'Shuruudaha Wakaaladda (Power of Attorney)?',
          'Lacagta Shahaadada Dhalashada carruurta?',
          'Xaggee safaaraddu ku taallaa Kampala?',
        ]
      : [
          'How much is the Somali passport fee?',
          'Requirements for Power of Attorney (Wakaalad)?',
          'Birth Certificate fee for a child under 18?',
          'Where is the Embassy located and opening hours?',
        ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language,
        }),
      });

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.reply || (language === 'so' ? 'Waan ka xumahay, cilad ayaa dhacday.' : 'Apologies, could not process query.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 2}`,
        sender: 'assistant',
        text:
          language === 'so'
            ? 'Xogta Safaaradda: Baasaboorku waa $170 + UGX 150,000. Wakaaladdu waa $200. Shahaadada dhalashada carruurtu waa $50. Safaaraddu waxay ku taallaa Plot 46 Nakasero Road, furan 9:00 AM - 3:00 PM.'
            : 'Consular Quick Info: Passport fee is $170 USD + UGX 150,000. Power of Attorney is $200 USD. Child birth certificate is $50 USD. The Embassy is open Mon–Fri 9:00 AM – 3:00 PM at Plot 46 Nakasero Road, Kampala.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'so' ? 'so-SO' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#0B2545] text-white p-3.5 rounded-full shadow-2xl border-2 border-[#C9A227] hover:bg-[#123661] active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
          aria-label="Open Embassy Assistant"
        >
          <img
            src="/public/assets/aistudio/Astaanta_dalka_cd5ae664.jfif"
            alt="Somali Coat of Arms"
            referrerPolicy="no-referrer"
            className="w-7 h-7 object-contain"
          />
          <span className="hidden md:inline-block text-xs font-semibold pr-1 text-[#F8F6F0]">
            {language === 'so' ? 'Kaaliyaha Safaaradda (AI)' : 'Embassy Assistant'}
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      )}

      {/* Chat Dialog Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#0B2545] text-white p-4 flex items-center justify-between border-b border-[#C9A227]/40">
            <div className="flex items-center gap-3">
              <img
                src="/public/assets/aistudio/Astaanta_dalka_cd5ae664.jfif"
                alt="Emblem"
                referrerPolicy="no-referrer"
                className="w-9 h-9 object-contain"
              />
              <div>
                <h3 className="font-serif text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{language === 'so' ? 'Kaaliyaha Safaaradda' : 'Embassy AI Assistant'}</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                </h3>
                <p className="text-[10px] text-[#C9A227]">
                  {language === 'so' ? 'Qunsuliyadda Kampala · 24/7 Toos ah' : 'Consular Section · Nakasero, Kampala'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8F6F0]/60 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#0B2545] text-[#C9A227] flex items-center justify-center shrink-0 border border-[#C9A227]/30">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-[#4189DD] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                  <div
                    className={`mt-1.5 flex items-center justify-between text-[10px] ${
                      m.sender === 'user' ? 'text-white/70' : 'text-slate-400'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {m.sender === 'assistant' && (
                      <button
                        onClick={() => speakText(m.text)}
                        className="hover:text-slate-700 ml-2 cursor-pointer p-0.5 rounded"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#4189DD] text-white flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs py-2">
                <div className="w-2 h-2 rounded-full bg-[#4189DD] animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-[#4189DD] animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-[#4189DD] animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-[11px] text-slate-500 italic ml-1">
                  {language === 'so' ? 'Kaaliyaha ayaa baaraya shuruucda...' : 'Consulting consular records...'}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-white border-t border-slate-200">
            <p className="text-[10px] text-slate-500 font-medium mb-1.5">
              {language === 'so' ? 'Su’aalaha inta badan la isweydiiyo:' : 'Frequently Asked:'}
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full shrink-0 transition-colors border border-slate-200 cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'so'
                  ? 'Weydii su’aal ku saabsan adeegyada...'
                  : 'Type your consular question here...'
              }
              className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4189DD] text-slate-900"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-[#4189DD] hover:bg-[#3476c5] disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
