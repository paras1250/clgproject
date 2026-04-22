import { useState } from 'react';
import { useChatbot } from './ChatbotContext';

const FunctionalChatInput = ({ onSendMessage, isLoading, botId }) => {
    const [message, setMessage] = useState('');
    const { themeColor } = useChatbot();

    const handleSend = () => {
        if (!message.trim() || isLoading) return;
        onSendMessage(message);
        setMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="border-t border-white/[0.06] bg-[#121826] rounded-b-2xl">
            <div className="p-4">
                <div className="flex items-center gap-2 bg-[#0A0F1C] border border-white/[0.06] rounded-full px-4 py-2">
                    <button className="text-[#64748B] hover:text-[#F1F5F9] transition-colors disabled:opacity-50" disabled={isLoading}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>
                    <input
                        type="text"
                        placeholder={isLoading ? "Thinking..." : "Type here"}
                        className="flex-1 bg-transparent outline-none text-sm text-[#F1F5F9] placeholder-[#64748B] text-left font-inter"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    <button
                        className="hover:scale-110 transition-transform disabled:opacity-50"
                        onClick={handleSend}
                        disabled={isLoading || !message.trim()}
                        style={{ color: themeColor }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="px-4 pb-3 text-center">
                <p className="text-[10px] text-[#64748B] font-inter">
                    This chat is recorded. By chatting, you agree to the{' '}
                    <a href="#" className="text-[#00F5D4] hover:underline">
                        AI Terms
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};

export default FunctionalChatInput;
