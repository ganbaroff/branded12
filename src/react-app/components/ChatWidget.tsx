import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { translations } from '@/react-app/data/content';
import { toast } from '@/react-app/lib/toast';
import { getUTMParams } from '@/react-app/lib/utm';
import { getEngagementMetrics } from '@/react-app/lib/engagement';
import { WHATSAPP_NUMBER } from '@/react-app/data/content';

export default function ChatWidget() {
  const { language } = useLanguage();
  const t = translations[language];
  const chat = t.chat;
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'welcome' | 'form' | 'sent'>('welcome');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    try {
      // Get UTM parameters and engagement metrics
      const utmParams = getUTMParams();
      const engagement = getEngagementMetrics();
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: null, // Phone optional for chat widget
          company: null,
          selectedServices: [],
          selectedPackage: null,
          budget: null,
          goals: message,
          deadline: null,
          additionalInfo: 'From chat widget',
          engagement,
          ...utmParams
        })
      });

      if (response.ok) {
        setStep('sent');
        setTimeout(() => {
          setIsOpen(false);
          setStep('welcome');
          setName('');
          setEmail('');
          setMessage('');
        }, 3000);
      } else {
        toast.error(
          language === 'az' 
            ? 'Xəta baş verdi. Yenidən cəhd edin.'
            : language === 'ru'
            ? 'Произошла ошибка. Попробуйте еще раз.'
            : 'An error occurred. Please try again.'
        );
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error(
        language === 'az' 
          ? 'Xəta baş verdi. Yenidən cəhd edin.'
          : language === 'ru'
          ? 'Произошла ошибка. Попробуйте еще раз.'
          : 'An error occurred. Please try again.'
      );
    } finally {
      setSending(false);
    }
  };

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}`;

  return (
    <>
      {/* Chat Button with "Live chat" label */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-[#FF4D00] rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-offset-2 focus:ring-offset-[#0F0F0F]"
          aria-label={chat.liveChatLabel}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          )}
        </button>
        <span className="text-white/90 text-xs font-medium whitespace-nowrap hidden sm:block">
          {chat.liveChatLabel}
        </span>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 sm:w-96 bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF4D00] to-[#ff6b2c] p-4">
            <h3 className="text-white font-bold text-lg">B2Brand</h3>
            <p className="text-white/90 text-sm">{chat.headerSubtitle}</p>
          </div>

          {/* Content */}
          <div className="p-4 h-80 flex flex-col">
            {step === 'welcome' && (
              <div className="flex-1 flex flex-col">
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <p className="text-white text-sm leading-relaxed">
                    {chat.welcomeMessage}
                  </p>
                </div>
                <div className="mt-auto">
                  <button
                    onClick={() => setStep('form')}
                    className="w-full bg-[#FF4D00] text-white py-3 rounded-lg font-semibold hover:bg-[#ff6b2c] transition-colors"
                  >
                    {chat.ctaGetConsultation}
                  </button>
                </div>
              </div>
            )}

            {step === 'form' && (
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="flex-1 space-y-3 overflow-y-auto">
                  <div>
                    <input
                      type="text"
                      placeholder={chat.placeholderName}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:border-[#FF4D00] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder={chat.placeholderEmail}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:border-[#FF4D00] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder={chat.placeholderMessage}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={4}
                      className="w-full px-4 py-2 bg-[#0F0F0F] border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:border-[#FF4D00] focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-[#FF4D00] text-white py-3 rounded-lg font-semibold hover:bg-[#ff6b2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                  {sending ? (
                    chat.sending
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {chat.ctaSend}
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 'sent' && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold mb-2">{chat.thankYou}</p>
                  <p className="text-gray-400 text-sm mb-3">{chat.weWillContact}</p>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-[#FF4D00] hover:underline font-medium"
                  >
                    {chat.continueOnWhatsApp}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
