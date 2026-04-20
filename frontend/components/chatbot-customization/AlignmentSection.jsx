import { useState } from 'react';
import { useChatbot } from './ChatbotContext';

const AlignmentSection = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { alignment, setAlignment } = useChatbot();

    const alignments = [
        { value: 'bottom-right', label: 'Bottom Right' },
        { value: 'bottom-left', label: 'Bottom Left' },
    ];

    return (
        <div className="border-b border-white/[0.06]">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#121826] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#00F5D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span className="font-semibold text-[#F1F5F9] font-inter">Alignment</span>
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
                    <div className="grid grid-cols-2 gap-3">
                        {alignments.map((align) => (
                            <button
                                key={align.value}
                                onClick={() => setAlignment(align.value)}
                                className={`
                  px-4 py-3 rounded-lg text-center transition-all duration-200 font-medium font-inter
                  ${alignment === align.value
                                        ? 'bg-[#00F5D4] text-[#0A0F1C] shadow-lg shadow-[#00F5D4]/20'
                                        : 'bg-[#121826] text-[#CBD5E1] hover:bg-white/[0.06]'
                                    }
                `}
                            >
                                {align.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlignmentSection;
