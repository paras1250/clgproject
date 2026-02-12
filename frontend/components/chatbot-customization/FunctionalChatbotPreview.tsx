import { useState, forwardRef, useImperativeHandle } from 'react';
import { useChatbot } from './ChatbotContext';
import ChatHeader from './ChatHeader';
import ChatBubble from './ChatBubble';
import FunctionalChatInput from './FunctionalChatInput';
import Cookies from 'js-cookie';

interface FunctionalChatbotPreviewProps {
    botId: string;
}

const FunctionalChatbotPreview = forwardRef<any, FunctionalChatbotPreviewProps>(({ botId }, ref) => {
    const { firstMessage, selectedAvatar, themeColor, isMinimized, setIsMinimized } = useChatbot();
    const [messages, setMessages] = useState<any[]>([{ role: 'assistant', content: firstMessage }]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | undefined>(undefined);

    const handleSendMessage = async (message: string) => {
        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: message }]);
        setIsLoading(true);

        try {
            let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            if (backendUrl.endsWith('/')) {
                backendUrl = backendUrl.slice(0, -1);
            }

            const response = await fetch(`${backendUrl}/api/bots/${botId}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                },
                body: JSON.stringify({
                    message,
                    sessionId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();

            // Update session ID if provided
            if (data.sessionId) {
                setSessionId(data.sessionId);
            }

            // Add assistant response
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response || 'Sorry, I could not generate a response.'
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Expose sendMessage to parent components
    useImperativeHandle(ref, () => ({
        sendMessage: handleSendMessage
    }));

    const handleLauncherClick = () => {
        setIsMinimized(false);
    };

    // Show floating launcher when minimized
    if (isMinimized) {
        return (
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={handleLauncherClick}
                    className="w-16 h-16 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border-4 border-white"
                    style={{ backgroundColor: themeColor }}
                >
                    <img
                        src={selectedAvatar}
                        alt="Open chat"
                        className="w-full h-full rounded-full object-cover"
                    />
                </button>
            </div>
        );
    }

    // Show full chatbot when expanded
    return (
        <div className="w-full max-w-2xl mx-auto h-full flex flex-col">
            <div className="bg-white rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">
                <ChatHeader />

                <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-gray-50/50">
                    {messages.map((msg, idx) => (
                        <ChatBubble key={idx} message={msg.content} isUser={msg.role === 'user'} />
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-2xl px-4 py-2">
                                <div className="flex space-x-1.5">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <FunctionalChatInput
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    botId={botId}
                />
            </div>
        </div>
    );
});

FunctionalChatbotPreview.displayName = 'FunctionalChatbotPreview';

export default FunctionalChatbotPreview;

