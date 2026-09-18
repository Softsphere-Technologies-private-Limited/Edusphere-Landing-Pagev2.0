import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, CheckCheck, Sparkles, Loader2, User, Bot, ExternalLink, Headset } from 'lucide-react';
import { EduSphereLogo } from './EduSphereLogo';

interface ChatMessage {
  id: string;
  role: 'ai' | 'user' | 'system';
  text: string;
  time: string;
}

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  
  const phoneNumber = '+91 8742935355';
  const cleanPhone = '918742935355';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'ai',
      text: "Hello! 👋 I am EduSphere AI Assistant. Ask me anything about our Smart School ERP features, AI Biometric Attendance, GPS Bus Tracking, or Demo Booking!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      scrollToBottom();
    }
  }, [isOpen, messages, isLoading]);

  // Construct transcript summary for WhatsApp
  const generateWhatsAppTranscript = () => {
    let summaryText = `Hello EduSphere Team! 👋\nI was conversing with the EduSphere AI Chatbot on your website and would like to speak with a human support agent.\n\n--- 📋 CHAT TRANSCRIPT ---`;

    messages.forEach((m) => {
      if (m.role === 'user') {
        summaryText += `\n• User: ${m.text}`;
      } else if (m.role === 'ai') {
        summaryText += `\n• AI Assistant: ${m.text}`;
      }
    });

    summaryText += `\n---------------------------\nPlease connect me to a live representative.`;

    return summaryText;
  };

  // Route to WhatsApp with conversation transcript
  const handleTransferToWhatsApp = () => {
    const transcript = generateWhatsAppTranscript();
    const encoded = encodeURIComponent(transcript);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;

    // Append system message
    const transferNotice: ChatMessage = {
      id: `sys-${Date.now()}`,
      role: 'system',
      text: "💬 Opening WhatsApp with your chat history attached for our live support team...",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, transferNotice]);

    window.open(whatsappUrl, '_blank');
  };

  // Handle AI Chat Submit
  const handleSendMessage = async (customText?: string) => {
    const queryText = (customText || inputValue).trim();
    if (!queryText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!customText) setInputValue('');
    setIsLoading(true);

    try {
      // Map messages for Gemini server API
      const apiPayload = newMessages
        .filter((m) => m.role === 'user' || m.role === 'ai')
        .map((m) => ({
          role: m.role === 'user' ? ('user' as const) : ('model' as const),
          text: m.text,
        }));

      const res = await fetch('/api/whatsapp-ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiPayload }),
      });

      const data = await res.json();
      const aiReply = data.reply || "I'm happy to help! For complete details or custom quotes, feel free to connect with our human team on WhatsApp.";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If prompt suggests human transfer or keyword detected, suggest WhatsApp button
      const lowerQuery = queryText.toLowerCase();
      if (
        data.shouldTransferToHuman ||
        lowerQuery.includes('human') ||
        lowerQuery.includes('agent') ||
        lowerQuery.includes('person') ||
        lowerQuery.includes('call') ||
        lowerQuery.includes('whatsapp') ||
        lowerQuery.includes('talk') ||
        lowerQuery.includes('contact')
      ) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `sys-suggest-${Date.now()}`,
              role: 'system',
              text: "Need direct human assistance? Click 'Connect with Human Agent' below to transfer your chat thread directly to our WhatsApp support team!",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }, 600);
      }
    } catch (err) {
      console.error('[AI Chat Error]', err);
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'ai',
        text: "I am temporarily offline. Please click the button below to connect directly with our human support agent on WhatsApp!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "🏫 School ERP Modules",
    "🚌 GPS Transport System",
    "💰 Fee & Receipt Automation",
    "📱 Parent Mobile App",
    "👨‍💼 Talk to Human Agent",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* POPUP CHAT CARD */}
      {isOpen && (
        <div className="mb-4 w-84 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 flex flex-col max-h-[580px] h-[520px]">
          {/* Card Header */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-bold shadow-inner">
                  <EduSphereLogo size="sm" showText={false} />
                </div>
                {/* Online Pulse */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>EduSphere AI Assistant</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono-code font-extrabold flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-400" /> AI LIVE
                  </span>
                </div>

              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleTransferToWhatsApp}
                title="Transfer chat to WhatsApp Human Agent"
                className="p-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Headset className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Human Agent</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                aria-label="Close Chat Widget"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CHAT MESSAGES BODY */}
          <div className="p-3.5 space-y-3 bg-slate-950/70 overflow-y-auto flex-1 text-xs custom-scrollbar">
            <div className="text-[10px] font-mono-code text-center text-slate-500 my-0.5">
              AI CHATBOT ACTIVE • AGENT CONTEXT TRANSFER ENABLED
            </div>

            {messages.map((m) => (
              <React.Fragment key={m.id}>
                {m.role === 'ai' && (
                  <div className="flex items-start gap-2 max-w-[88%] animate-in fade-in slide-in-from-left-2 duration-200">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 text-slate-200 space-y-1 relative shadow">
                      <div className="font-bold text-emerald-400 text-[10px] flex items-center justify-between gap-2">
                        <span>EduSphere AI</span>
                        <span className="text-[9px] text-slate-500 font-normal">{m.time}</span>
                      </div>
                      <p className="leading-relaxed text-slate-300 text-[11px] whitespace-pre-wrap">{m.text}</p>
                    </div>
                  </div>
                )}

                {m.role === 'user' && (
                  <div className="flex items-start justify-end gap-2 max-w-[88%] ml-auto animate-in fade-in slide-in-from-right-2 duration-200">
                    <div className="p-3 rounded-2xl rounded-tr-none bg-emerald-600 text-slate-950 font-medium space-y-1 relative shadow-md shadow-emerald-950/20">
                      <div className="font-bold text-slate-950 text-[10px] flex items-center justify-between gap-2">
                        <span>You</span>
                        <span className="text-[9px] text-slate-900/70">{m.time}</span>
                      </div>
                      <p className="leading-relaxed text-[11px] whitespace-pre-wrap">{m.text}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}

                {m.role === 'system' && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-[11px] text-center space-y-1.5 my-1">
                    <p className="font-medium leading-tight">{m.text}</p>
                    <button
                      onClick={handleTransferToWhatsApp}
                      className="w-full py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[10px] rounded-lg flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3 fill-slate-950" />
                      <span>Open WhatsApp with Chat History</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </button>
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* AI Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-[11px] p-2 bg-slate-900/80 rounded-xl w-fit border border-slate-800">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span className="font-mono-code text-[10px]">EduSphere AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPT SUGGESTIONS */}
          <div className="px-3 py-1.5 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (prompt.includes('Human Agent')) {
                    handleTransferToWhatsApp();
                  } else {
                    handleSendMessage(prompt);
                  }
                }}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-slate-700/80 text-[10px] text-slate-300 hover:text-emerald-300 transition cursor-pointer shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* ESCALATE TO WHATSAPP AGENT BUTTON */}
          <div className="p-2 bg-slate-900/90 border-t border-slate-800/60 shrink-0">
            <button
              onClick={handleTransferToWhatsApp}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-2 transition cursor-pointer group"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Route Chat History to WhatsApp Support</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
            </button>
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask AI or type a question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none transition font-sans placeholder:text-slate-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 rounded-xl font-bold transition flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* FLOATING TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_10px_30px_rgba(0,200,150,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
        aria-label="WhatsApp AI Chatbot Widget"
      >
        {/* Glow Ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping pointer-events-none" />

        {/* Unread Badge */}
        {!isOpen && hasUnread && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-slate-950 shadow animate-bounce">
            1
          </span>
        )}

        {isOpen ? (
          <X className="w-6 h-6 stroke-[2.5]" />
        ) : (
          <MessageSquare className="w-6 h-6 fill-slate-950 stroke-[2]" />
        )}
      </button>
    </div>
  );
};
