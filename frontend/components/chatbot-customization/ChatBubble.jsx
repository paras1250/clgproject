import { useChatbot } from './ChatbotContext';

const ChatBubble = ({ message, isUser = false }) => {
    const { themeColor } = useChatbot();

    return (
        <div className={`flex items-start gap-2 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`rounded-2xl px-4 py-3 max-w-[280px] text-left font-inter ${isUser
                        ? 'rounded-br-sm text-white shadow-lg shadow-black/5'
                        : 'bg-[#0A0F1C] border border-white/[0.06] rounded-tl-sm text-[#F1F5F9]'
                    }`}
                style={isUser ? { backgroundColor: themeColor } : {}}
            >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default ChatBubble;
