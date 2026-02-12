import { useChatbot } from '../context/ChatbotContext';
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
        <div className="flex-1 h-screen bg-gray-50 relative">
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
            border-4 border-white
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
            absolute bottom-8 transition-all duration-500
            ${positionClass}
            ${currentSize.width}
          `}
                >
                    <div className="bg-white rounded-2xl shadow-xl">
                        <ChatHeader />

                        <div className={`p-4 ${currentSize.minHeight} ${currentSize.maxHeight} overflow-y-auto`}>
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
