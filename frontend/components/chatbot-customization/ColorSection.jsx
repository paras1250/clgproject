import { useState } from 'react';
import { useChatbot } from './ChatbotContext';

const ColorSection = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { themeColor, setThemeColor } = useChatbot();

    const presetColors = [
        { name: 'Red', value: '#EF4444' },
        { name: 'Pink', value: '#EC4899' },
        { name: 'Purple', value: '#A855F7' },
        { name: 'Blue', value: '#3B82F6' },
        { name: 'Green', value: '#10B981' },
        { name: 'Orange', value: '#F97316' },
        { name: 'Teal', value: '#14B8A6' },
        { name: 'Indigo', value: '#6366F1' },
    ];

    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <span className="font-semibold text-gray-800">Color</span>
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
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Chat Header Color
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                        {presetColors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => setThemeColor(color.value)}
                                className={`
                  w-full h-12 rounded-lg transition-all duration-200
                  ${themeColor === color.value ? 'ring-4 ring-offset-2 ring-gray-400 scale-105' : 'hover:scale-105'}
                `}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                            />
                        ))}
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Custom Color
                        </label>
                        <input
                            type="color"
                            value={themeColor}
                            onChange={(e) => setThemeColor(e.target.value)}
                            className="w-full h-12 rounded-lg cursor-pointer"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorSection;
