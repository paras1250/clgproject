import { useState } from 'react';
import { useChatbot } from './ChatbotContext';

const FirstMessageSection = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { firstMessage, setFirstMessage } = useChatbot();
    const maxLength = 300;

    const handleChange = (e) => {
        const value = e.target.value;
        if (value.length <= maxLength) {
            setFirstMessage(value);
        }
    };

    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="font-semibold text-gray-800">First Message</span>
                </div>
                <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isExpanded && (
                <div className="px-6 pb-6">
                    <textarea
                        value={firstMessage}
                        onChange={handleChange}
                        placeholder="Enter your first message..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-chat-pink focus:border-transparent"
                        rows={4}
                    />
                    <div className="mt-2 text-sm text-gray-500 text-right">
                        {firstMessage.length} / {maxLength}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FirstMessageSection;
