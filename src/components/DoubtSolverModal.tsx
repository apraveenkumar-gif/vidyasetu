import React, { useState, useEffect } from 'react';
import { Language, DoubtMessage, UserProfile } from '../types';
import { t } from '../data/translations';
import { sounds } from '../services/audio';
import { isEffectivelyOnline, getNetworkMode, queueOfflineItem } from '../services/storage';
import { 
  X, 
  Send, 
  Volume2, 
  Sparkles, 
  HardDrive, 
  Wifi, 
  Bot, 
  User, 
  Loader2,
  Lightbulb,
  Radio
} from 'lucide-react';

interface DoubtSolverModalProps {
  language: Language;
  user: UserProfile;
  onClose: () => void;
}

export const DoubtSolverModal: React.FC<DoubtSolverModalProps> = ({
  language,
  user,
  onClose,
}) => {
  const [messages, setMessages] = useState<DoubtMessage[]>([
    {
      id: 'm-intro',
      sender: 'ai',
      text:
        language === 'te'
          ? 'నమస్కారం! నేను విద్యా మిత్రను. గణితం, సైన్స్ లేదా ఇంగ్లీషులో మీకు ఏ సందేహం ఉన్నా అడగండి. గ్రామాల్లో మనం చూసే ఉదాహరణలతో సులభంగా వివరిస్తాను!'
          : language === 'hi'
          ? 'नमस्ते! मैं विद्या मित्र हूँ। गणित, विज्ञान या अंग्रेज़ी में आपका जो भी प्रश्न हो, पूछिए। गाँव के रोज़मर्रा के उदाहरणों से आसानी से समझाऊँगा!'
          : 'Namaste! I am Vidya Mitra, your learning buddy. Ask any doubt in Math, Science, or English. I explain everything using relatable village examples and stories!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const networkMode = getNetworkMode();
  const online = isEffectivelyOnline();

  const suggestedDoubts = [
    {
      en: 'Why do we use fractions to divide chapatis or mangoes?',
      te: 'రొట్టెలు లేదా మామిడి పండ్లను పంచుకోవడానికి భిన్నాలు ఎందుకు వాడతాం?',
      hi: 'रोटी या आम बाँटने के लिए हम भिन्न क्यों इस्तेमाल करते हैं?',
    },
    {
      en: 'How does a green leaf cook food using sunlight?',
      te: 'ఆకు సూర్యరశ్మిని ఉపయోగించి ఆహారం ఎలా తయారుచేస్తుంది?',
      hi: 'हरी पत्ती धूप से भोजन कैसे बनाती है?',
    },
    {
      en: 'Why does drawing water with a well pulley feel so light?',
      te: 'బావి కప్పీతో నీటి బకెట్ లాగడం ఎందుకు అంత తేలికగా ఉంటుంది?',
      hi: 'कुएँ की घिरनी से पानी खींचना इतना आसान क्यों लगता है?',
    },
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || isLoading) return;

    sounds.playClick();
    const studentMsg: DoubtMessage = {
      id: 'usr_' + Date.now(),
      sender: 'student',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      if (online && networkMode === 'online') {
        // Try calling server-side Gemini API endpoint
        const response = await fetch('/api/gemini/doubt-solver', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: textToSend,
            language: language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English',
            grade: user.grade,
            subject: 'General Science and Math',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          sounds.playCorrect();
          const aiMsg: DoubtMessage = {
            id: 'ai_' + Date.now(),
            sender: 'ai',
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOfflineSource: data.fallback || false,
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsLoading(false);
          return;
        }
      }

      // Offline or network simulated fallback
      await new Promise((r) => setTimeout(r, 600)); // natural tactile delay
      sounds.playCorrect();
      const offlineReply = getOfflineDoubtReply(textToSend, language);
      const aiMsg: DoubtMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: offlineReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOfflineSource: true,
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Queue doubt for teacher dashboard sync
      queueOfflineItem({
        type: 'student_doubt',
        studentId: user.id,
        query: textToSend,
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      // Fallback on catch
      const offlineReply = getOfflineDoubtReply(textToSend, language);
      const aiMsg: DoubtMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: offlineReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOfflineSource: true,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    sounds.playClick();
    sounds.speak(text, language);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-500 to-orange-500 px-6 py-4 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center text-xl shadow-xs">
              🐘
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg tracking-tight font-['Outfit']">
                  Vidya Mitra AI
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-xs flex items-center gap-1">
                  {online && networkMode === 'online' ? (
                    <>
                      <Wifi className="w-2.5 h-2.5" />
                      <span>Gemini 3.8 Flash Online</span>
                    </>
                  ) : (
                    <>
                      <HardDrive className="w-2.5 h-2.5" />
                      <span>Offline Village Wisdom Bank</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-[11px] text-amber-100 mt-0.5">
                Culturally grounded tutor for rural students ages 8–14
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-stone-50/50">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-sm shrink-0 mt-1 shadow-xs">
                    🐘
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 shadow-xs ${
                    isAi
                      ? 'bg-white border border-stone-200 text-stone-800'
                      : 'bg-amber-600 text-white font-medium rounded-br-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  <div className="flex items-center justify-between text-[10px] pt-1 opacity-75">
                    <span>{msg.timestamp}</span>
                    {isAi && (
                      <div className="flex items-center gap-2">
                        {msg.isOfflineSource && (
                          <span className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-mono">
                            Offline Knowledge
                          </span>
                        )}
                        <button
                          onClick={() => handleSpeak(msg.text)}
                          className="hover:text-amber-800 p-0.5 cursor-pointer"
                          title="Listen aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm shrink-0 mt-1 shadow-xs">
                    👦🏽
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-stone-500 text-xs italic">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm">
                🐘
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>Vidya Mitra is crafting a village story for you...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-stone-100 overflow-x-auto flex gap-2">
          {suggestedDoubts.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug[language])}
              className="text-[11px] font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Lightbulb className="w-3 h-3 text-amber-600" />
              <span>{sug[language]}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-stone-200 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('askDoubtsPrompt', language)}
            className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Rich offline village wisdom bank when no internet
function getOfflineDoubtReply(query: string, lang: Language): string {
  const q = query.toLowerCase();

  if (lang === 'te') {
    if (q.includes('భిన్నం') || q.includes('fraction') || q.includes('రొట్టె') || q.includes('chapati')) {
      return `🌟 **భిన్నాలు (Fractions) - సులభమైన వివరణ:**
ఒక పూర్తి వస్తువును సమాన ముక్కలుగా పంచుకోవడమే భిన్నం!

🌾 **గ్రామీణ ఉదాహరణ:**
మీ ఇంట్లో అమ్మ చేసిన వేడి రొట్టెను నువ్వు, నీ చెల్లి ఇద్దరూ పంచుకోవాలనుకుంటే 2 సమ భాగాలు చేస్తారు. నీకు వచ్చే ముక్క 1/2 (సగం). నలుగురు స్నేహితులు పంచుకుంటే ఒక్కొక్కరికి 1/4 (పావు) వస్తుంది!

💡 **చిట్కా:** లవము (Numerator) పైన ఉంటుంది, హారము (Denominator) కింద ఉంటుంది!`;
    }
    if (q.includes('ఆకు') || q.includes('photosynthesis') || q.includes('కిరణజన్య') || q.includes('ఎండ')) {
      return `🌟 **కిరణజన్య సంయోగక్రియ (Photosynthesis):**
ఆకు మొక్కల యొక్క చిన్న వంటగది!

🌾 **గ్రామీణ ఉదాహరణ:**
పొయ్యిలో మంటలా సూర్యుని ఎండ పనిచేస్తుంది. బావి నీటిని వేర్లు పైకి లాగుతాయి. గాలిలోని కార్బన్ డయాక్సైడ్ కలిసి పచ్చని ఆకులో ఆహారాన్ని (గ్లూకోజ్) తయారుచేస్తాయి. అదే సమయంలో మనకి ప్రాణవాయువు (ఆక్సిజన్) ఇస్తాయి!`;
    }
    return `🌟 **విద్యా మిత్ర సలహా:**
నీ ప్రశ్న చాలా మంచిది! గ్రామీణ వాతావరణంలో లెక్కలు, సైన్స్ ప్రతీ రోజూ మన కళ్లెదుటే జరుగుతాయి. పాఠాలలోని ప్రయోగశాలను చూసి సులభంగా అర్థం చేసుకోవచ్చు!`;
  }

  if (lang === 'hi') {
    if (q.includes('भिन्न') || q.includes('fraction') || q.includes('रोटी')) {
      return `🌟 **भिन्न (Fractions) - सरल समझ:**
पूरी चीज़ के बराबर हिस्से करना ही भिन्न है!

🌾 **गाँव का उदाहरण:**
दादी ने बनाई गोल रोटी। दो भाइयों ने बराबर बाँटी तो हर एक को मिली 1/2 (आधी) रोटी। अगर 4 दोस्तों में बाँटी तो 1/4 (चौथाई)!

💡 **याद रखें:** अंश ऊपर रहता है और हर नीचे!`;
    }
    return `🌟 **विद्या मित्र उत्तर:**
आपका सवाल बहुत अच्छा है! गाँव के खेतों, कुएँ और बाज़ार में विज्ञान और गणित हर पल मौजूद हैं। अभ्यास करते रहिए!`;
  }

  return `🌟 **Understanding through Village Life:**
Everything in science and math can be understood by looking at our daily village routine!
🌾 **Everyday Story:**
- Dividing rotis or measuring bags of rice teaches fractions and decimals.
- Drawing water with a well pulley teaches simple machines and gravity.
- Sunlight on green leaves explains photosynthesis.
Keep asking questions—curiosity is the true seed of knowledge!`;
}
