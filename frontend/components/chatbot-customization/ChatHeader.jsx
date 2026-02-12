import { useChatbot } from './ChatbotContext';

const ChatHeader = () => {
    const { selectedAvatar, themeColor, setIsMinimized } = useChatbot();

    const handleClose = () => {
        setIsMinimized(true);
    };

    // Header layout: [Avatar] Assistant Title ... [X]
    return (
        <div
            className="px-4 py-3 flex items-center justify-between rounded-t-2xl transition-colors duration-300"
            style={{ backgroundColor: themeColor }}
        >
            <div className="flex items-center gap-3">
                <img
                    src={selectedAvatar}
                    alt="Assistant"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
                <span className="text-white font-semibold">Assistant</span>
            </div>

            <button
                onClick={handleClose}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default ChatHeader;
