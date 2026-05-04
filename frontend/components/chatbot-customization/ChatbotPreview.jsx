import { useChatbot } from './ChatbotContext';
import ChatHeader from './ChatHeader';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';

const ChatbotPreview = () => {
    const { firstMessage, widgetSize, alignment, isMinimized, setIsMinimized, selectedAvatar, themeColor } = useChatbot();

    // Size configurations - using explicit width and height
    const sizeConfig = {
        small: {
            width: 'w-[320px]',
            height: 'h-[450px]',
        },
        medium: {
            width: 'w-[400px]',
            height: 'h-[550px]',
        },
        large: {
            width: 'w-[480px]',
            height: 'h-[650px]',
        },
    };

    const currentSize = sizeConfig[widgetSize] || sizeConfig.medium;

    // Positioning
    const positionClass = alignment === 'bottom-left' ? 'left-8' : 'right-8';

    const handleLauncherClick = () => {
        setIsMinimized(false);
    };

    return (
        <div className="flex-1 min-h-[700px] bg-[#0A0F1C] relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] rounded-r-3xl overflow-hidden flex items-center justify-center">
            {isMinimized ? (
                // Minimized state: Floating circular avatar launcher
                <button
                    onClick={handleLauncherClick}
                    className={`
            absolute bottom-8 transition-all duration-500
            ${positionClass}
            w-16 h-16 rounded-full shadow-2xl
            hover:scale-110 active:scale-95
            flex items-center justify-center
            border-4 border-[#0A0F1C]
          `}
                    style={{ backgroundColor: themeColor }}
                >
                    <img
                        src={selectedAvatar}
                        alt="Open chat"
                        className="w-full h-full rounded-full object-cover"
                    />
                </button>
            ) : (
                // Expanded state: Full chatbot widget
                <div
                    className={`
            absolute bottom-8 transition-all duration-500 z-50 flex flex-col
            ${positionClass}
            ${currentSize.width} ${currentSize.height}
          `}
                >
                    <div className="bg-[#121826] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full animate-fade-in-up">
                        <ChatHeader />

                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-[#0A0F1C]/30">
                            <ChatBubble message={firstMessage} />
                        </div>

                        <ChatInput />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotPreview;
