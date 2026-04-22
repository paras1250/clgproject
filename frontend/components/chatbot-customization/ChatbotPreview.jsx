import { useChatbot } from './ChatbotContext';
import ChatHeader from './ChatHeader';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';

const ChatbotPreview = () => {
    const { firstMessage, widgetSize, alignment, isMinimized, setIsMinimized, selectedAvatar, themeColor } = useChatbot();

    // Size configurations
    const sizeConfig = {
        small: {
            width: 'w-[320px]',
            minHeight: 'min-h-[250px]',
            maxHeight: 'max-h-[350px]',
        },
        medium: {
            width: 'w-[360px]',
            minHeight: 'min-h-[300px]',
            maxHeight: 'max-h-[400px]',
        },
        large: {
            width: 'w-[420px]',
            minHeight: 'min-h-[350px]',
            maxHeight: 'max-h-[500px]',
        },
    };

    const currentSize = sizeConfig[widgetSize];

    // ANCHOR-ONLY positioning - only changes widget position, NOT internal UI
    const positionClass = alignment === 'bottom-left' ? 'left-8' : 'right-8';

    const handleLauncherClick = () => {
        setIsMinimized(false);
    };

    return (
        <div className="flex-1 h-screen bg-[#0A0F1C] relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
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
            fixed inset-0 z-50 flex flex-col sm:absolute sm:inset-auto sm:bottom-8 sm:transition-all sm:duration-500
            ${alignment === 'bottom-left' ? 'sm:left-8' : 'sm:right-8'}
            w-full sm:${currentSize.width}
          `}
                >
                    <div className="bg-[#121826] border-none sm:border border-white/[0.06] rounded-none sm:rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
                        <ChatHeader />

                        <div className={`flex-1 p-4 overflow-y-auto custom-scrollbar`}>
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
