import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  trainingDataUsed?: {
    hasData: boolean;
    dataLength?: number;
    source?: string;
  };
  error?: string;
}

interface ChatbotPreviewProps {
  botId: string;
  botName: string;
}

const ChatbotPreview = ({ botId, botName }: ChatbotPreviewProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();

  // Customization state
  const [customization, setCustomization] = useState<any>({
    avatar: '',
    primaryColor: '#8b5cf6',
    greetingMessage: 'Hi! How can I help you today?'
  });

  // Fetch bot customizations
  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        if (backendUrl.endsWith('/')) {
          backendUrl = backendUrl.slice(0, -1);
        }

        const response = await fetch(`${backendUrl}/api/bots/${botId}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        });

        if (response.ok) {
          const botData = await response.json();
          console.log('Fetched bot customizations:', botData);

          // Apply customizations
          if (botData.widget_customization) {
            setCustomization({
              avatar: botData.widget_customization.avatar || '',
              primaryColor: botData.widget_customization.primaryColor || '#8b5cf6',
              greetingMessage: botData.greeting_message || 'Hi! How can I help you today?'
            });
          } else if (botData.greeting_message) {
            setCustomization((prev: any) => ({
              ...prev,
              greetingMessage: botData.greeting_message
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching customizations:', error);
      }
    };

    if (botId) {
      fetchCustomizations();
    }
  }, [botId]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { botsAPI } = await import('@/lib/api');
      const response = await botsAPI.chat(botId, userMessage.content, sessionId);

      if (response.sessionId) {
        setSessionId(response.sessionId);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response || 'Sorry, I did not receive a response. Please check if your chatbot has training data.',
        trainingDataUsed: response.trainingDataUsed || { hasData: false }
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorDetails = error.response?.data?.error || error.message || 'Unknown error';
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorDetails}. Please check:
- Your chatbot has training data (text or documents)
- The AI model API key is configured correctly
- The backend server is running`,
        error: errorDetails
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl h-[650px] flex flex-col border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="text-white p-6 rounded-t-2xl shadow-lg" style={{ background: customization.primaryColor }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 text-2xl">
              {customization.avatar}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">{botName}</h3>
              <p className="text-sm text-white/90 font-semibold">AI Assistant • Always ready to help</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-white font-bold">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 ? (
          <div className="text-center mt-24 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-2xl font-extrabold mb-3 text-gray-900">Start a conversation!</p>
            <p className="text-base text-gray-600 font-semibold">{customization.greetingMessage}</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex animate-slide-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div
                className={`max-w-xs lg:max-w-md px-5 py-3.5 rounded-2xl shadow-md transition-all hover:shadow-lg ${msg.role === 'user'
                  ? 'text-white rounded-br-sm'
                  : msg.error
                    ? 'bg-red-50 text-red-900 border-2 border-red-200 rounded-bl-sm'
                    : 'bg-white text-gray-900 border-2 border-gray-200 rounded-bl-sm'
                  }`}
                style={msg.role === 'user' ? { background: customization.primaryColor } : {}}
              >
                <p className="whitespace-pre-wrap leading-relaxed font-medium text-base">{msg.content}</p>

                <span className={`text-xs mt-2 block font-semibold ${msg.role === 'user' ? 'text-purple-100' : 'text-gray-500'}`}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start animate-slide-in">
            <div className="bg-white text-gray-900 max-w-xs lg:max-w-md px-5 py-4 rounded-2xl rounded-bl-sm border-2 border-gray-200 shadow-md">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-gray-700 font-bold">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t-2 border-gray-200 bg-white p-5">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type your message here..."
            className="flex-1 border-2 border-gray-300 bg-white rounded-xl px-5 py-4 text-gray-900 text-base font-medium placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all shadow-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputMessage.trim()}
            className="text-white px-6 py-4 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-md font-bold"
            style={{ background: customization.primaryColor }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPreview;
