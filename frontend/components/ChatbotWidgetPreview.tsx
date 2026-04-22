import { useEffect, useState, useRef } from 'react';
import { botsAPI } from '@/lib/api';

interface ChatbotWidgetPreviewProps {
  botId?: string;
  greeting?: string;
  avatar?: string;
  color?: string;
  width?: string;
  height?: string;
  theme?: string;
  widgetSize?: string;
  initiallyOpen?: boolean;
}

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatbotWidgetPreview({
  botId,
  greeting = 'Hi! How can I help you today?',
  avatar = '🤖',
  color = '#00F5D4',
  width = '380',
  height = '600',
  theme = 'default',
  widgetSize = 'medium',
  initiallyOpen = false
}: ChatbotWidgetPreviewProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize messages with greeting
  useEffect(() => {
    setMessages([{
      text: greeting,
      isUser: false,
      timestamp: new Date()
    }]);
  }, [greeting]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    // Add user message to UI
    setMessages(prev => [...prev, {
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    }]);

    setIsTyping(true);

    try {
      if (botId) {
        // Real chat if botId is provided
        const response = await botsAPI.chat(botId, userMessage);
        setMessages(prev => [...prev, {
          text: response.response || response.reply || "I'm sorry, I couldn't process that.",
          isUser: false,
          timestamp: new Date()
        }]);
      } else {
        // Mock response if no botId
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: "This is a live preview. Once saved, I will answer based on your training data!",
            isUser: false,
            timestamp: new Date()
          }]);
          setIsTyping(false);
        }, 1000);
        return;
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "Error connecting to bot. Please check your connection.",
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Size configurations
  const sizeConfig: Record<string, any> = {
    small: { width: '320px', maxHeight: '350px' },
    medium: { width: '360px', maxHeight: '450px' },
    large: { width: '420px', maxHeight: '550px' },
  };

  const currentSize = sizeConfig[widgetSize] || sizeConfig.medium;
  const displayWidth = widgetSize ? currentSize.width : `${width}px`;
  const displayHeight = widgetSize ? currentSize.maxHeight : `${height}px`;

  const isImageUrl = avatar && (
    avatar.startsWith('/') || 
    avatar.startsWith('http') || 
    avatar.includes('.') || 
    avatar.length > 5
  );

  return (
    <div className="relative w-full flex flex-col items-center">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 border-4 border-[#0A0F1C] group relative z-10"
          style={{ backgroundColor: color }}
        >
          <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-full">
            {isImageUrl ? (
              <img src={avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl group-hover:rotate-12 transition-transform">{avatar}</span>
            )}
          </div>
        </button>
      )}

      {isOpen && (
        <div
          className="rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-white/[0.08] animate-fade-in w-full transition-all duration-300"
          style={{
            height: displayHeight,
            width: displayWidth,
            backgroundColor: theme === 'dark' ? '#121826' : '#ffffff',
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3.5 flex items-center justify-between text-white shadow-lg relative z-10"
            style={{ backgroundColor: color }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/20 shadow-inner shrink-0">
                {isImageUrl ? (
                  <img src={avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">{avatar}</span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-sora font-bold text-sm truncate">Assistant</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-[9px] font-bold opacity-80 uppercase tracking-widest">Live Preview</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" 
            style={{ backgroundColor: theme === 'dark' ? '#0A0F1C' : '#F9FAFB' }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                    msg.isUser 
                    ? 'rounded-br-none text-white' 
                    : (theme === 'dark' ? 'bg-[#121826] border-white/[0.05] text-[#F1F5F9] rounded-tl-none border' : 'bg-white border-black/[0.05] text-[#1e293b] rounded-tl-none border')
                  }`}
                  style={msg.isUser ? { backgroundColor: color } : {}}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-pulse">
                <div className={`px-4 py-3 rounded-2xl rounded-tl-none border ${theme === 'dark' ? 'bg-[#121826] border-white/[0.05]' : 'bg-white border-black/[0.05]'}`}>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#64748B] animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#64748B] animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#64748B] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSendMessage}
            className="px-4 pt-4 pb-3 border-t border-white/[0.05]" 
            style={{ backgroundColor: theme === 'dark' ? '#121826' : '#ffffff' }}
          >
            <div className="flex items-center gap-2 bg-[#0A0F1C]/40 border border-white/[0.1] rounded-full px-4 py-2 focus-within:border-[#00F5D4]/40 transition-all">
              <button type="button" className="text-[#64748B] hover:text-[#00F5D4] transition-colors shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none text-sm focus:outline-none py-1 text-[#F1F5F9] placeholder:text-[#64748B]"
                disabled={isTyping}
              />
              <button 
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className={`transition-colors shrink-0 ${inputText.trim() && !isTyping ? 'text-[#00F5D4]' : 'text-[#64748B]'}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
            <div className="mt-2.5 text-center">
              <p className="text-[10px] text-[#64748B] font-medium tracking-tight">
                This chat is recorded. <span className="text-[#00F5D4] hover:underline cursor-pointer">AI Terms</span>
              </p>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
