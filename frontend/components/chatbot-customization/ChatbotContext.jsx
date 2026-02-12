import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const ChatbotContext = createContext();

export const useChatbot = () => {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error('useChatbot must be used within ChatbotProvider');
    }
    return context;
};

export const ChatbotProvider = ({ children, botId }) => {
    const [selectedAvatar, setSelectedAvatar] = useState('/avatars/avatar1.png');
    const [firstMessage, setFirstMessage] = useState(
        "Hi there! 👋 I'm Noupe, I'm here to help. How can I assist you today? I can provide you with information on enjoying videos and music you love, uploading original content, and sharing it with friends, family, and the world on YouTube. Feel free to ask me anything!"
    );
    const [themeColor, setThemeColor] = useState('#EF4444'); // Default red
    const [widgetSize, setWidgetSize] = useState('medium'); // small, medium, large
    const [alignment, setAlignment] = useState('bottom-right'); // bottom-left, bottom-right
    const [isMinimized, setIsMinimized] = useState(false); // Minimize state
    const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant.'); // New System Prompt state

    // Load saved customizations from database when botId is provided
    useEffect(() => {
        const loadCustomizations = async () => {
            if (!botId) return;

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
                    console.log('ChatbotProvider loaded customizations:', botData);

                    // Apply saved customizations
                    if (botData.widget_customization) {
                        const wc = botData.widget_customization;
                        if (wc.avatar) setSelectedAvatar(wc.avatar);
                        if (wc.primaryColor) setThemeColor(wc.primaryColor);
                        if (wc.widgetSize) setWidgetSize(wc.widgetSize);
                        if (wc.alignment) setAlignment(wc.alignment);
                    }
                    if (botData.greeting_message) {
                        setFirstMessage(botData.greeting_message);
                    }
                    if (botData.system_prompt) {
                        setSystemPrompt(botData.system_prompt);
                    }
                }
            } catch (error) {
                console.error('Error loading customizations:', error);
            }
        };

        loadCustomizations();
    }, [botId]);

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
        systemPrompt,
        setSystemPrompt,
    };

    return (
        <ChatbotContext.Provider value={value}>
            {children}
        </ChatbotContext.Provider>
    );
};

