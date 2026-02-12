import { useChatbot } from './ChatbotContext';

const ChatBubble = ({ message, isUser = false }) => {
    const { themeColor } = useChatbot();

    return (
        <div className={`flex items-start gap-2 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`rounded-2xl px-4 py-3 max-w-[280px] text-left ${isUser
                        ? 'rounded-br-sm text-white'
                        : 'bg-gray-100 rounded-tl-sm text-gray-800'
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
