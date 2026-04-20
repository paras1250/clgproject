import { useState } from 'react';
import { useChatbot } from './ChatbotContext';

const SizeSection = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { widgetSize, setWidgetSize } = useChatbot();

    const sizes = [
        { value: 'small', label: 'Small', description: 'Compact widget' },
        { value: 'medium', label: 'Medium', description: 'Default size' },
        { value: 'large', label: 'Large', description: 'Spacious widget' },
    ];

    return (
        <div className="border-b border-white/[0.06]">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#121826] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#00F5D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span className="font-semibold text-[#F1F5F9] font-inter">Size</span>
                </div>
                <svg
                    className={`w-5 h-5 text-[#64748B] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
                                        ? 'bg-[#00F5D4]/10 border-2 border-[#00F5D4] text-[#00F5D4]'
                                        : 'bg-[#121826] border-2 border-white/[0.06] text-[#CBD5E1] hover:border-white/[0.2]'
                                    }
                `}
                            >
                                <div className="font-semibold font-inter">{size.label}</div>
                                <div className="text-sm opacity-75 font-inter mt-0.5">{size.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SizeSection;
