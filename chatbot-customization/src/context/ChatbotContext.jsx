import { createContext, useContext, useState } from 'react';

const ChatbotContext = createContext();

export const useChatbot = () => {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error('useChatbot must be used within ChatbotProvider');
    }
    return context;
};

export const ChatbotProvider = ({ children }) => {
    const [selectedAvatar, setSelectedAvatar] = useState('/avatars/avatar1.png');
    const [firstMessage, setFirstMessage] = useState(
        "Hi there! 👋 I'm Noupe, I'm here to help. How can I assist you today? I can provide you with information on enjoying videos and music you love, uploading original content, and sharing it with friends, family, and the world on YouTube. Feel free to ask me anything!"
    );
    const [themeColor, setThemeColor] = useState('#EF4444'); // Default red
    const [widgetSize, setWidgetSize] = useState('medium'); // small, medium, large
    const [alignment, setAlignment] = useState('bottom-right'); // bottom-left, bottom-right
    const [isMinimized, setIsMinimized] = useState(false); // Minimize state

    const value = {
        selectedAvatar,
        setSelectedAvatar,
        firstMessage,
        setFirstMessage,
        themeColor,
        setThemeColor,
        widgetSize,
        setWidgetSize,
        alignment,
        setAlignment,
        isMinimized,
        setIsMinimized,
    };

    return (
        <ChatbotContext.Provider value={value}>
            {children}
        </ChatbotContext.Provider>
    );
};
