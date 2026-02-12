import { useState } from 'react';
import { useChatbot } from '../context/ChatbotContext';

const SizeSection = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { widgetSize, setWidgetSize } = useChatbot();

    const sizes = [
        { value: 'small', label: 'Small', description: 'Compact widget' },
        { value: 'medium', label: 'Medium', description: 'Default size' },
        { value: 'large', label: 'Large', description: 'Spacious widget' },
    ];

    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span className="font-semibold text-gray-800">Size</span>
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
                    <div className="space-y-2">
                        {sizes.map((size) => (
                            <button
                                key={size.value}
                                onClick={() => setWidgetSize(size.value)}
                                className={`
                  w-full px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${widgetSize === size.value
                                        ? 'bg-pink-50 border-2 border-pink-500 text-pink-900'
                                        : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                                    }
                `}
                            >
                                <div className="font-semibold">{size.label}</div>
                                <div className="text-sm opacity-75">{size.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SizeSection;
