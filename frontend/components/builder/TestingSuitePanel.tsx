import React, { useState } from 'react';

interface TestingSuitePanelProps {
    onTestPrompt?: (prompt: string) => void;
    onProceedToEmbed?: () => void;
}

export default function TestingSuitePanel({ onTestPrompt, onProceedToEmbed }: TestingSuitePanelProps) {
    const [showDebugLog, setShowDebugLog] = useState(false);

    const quickTestPrompts = [
        "Who are you?",
        "I have a problem",
        "What is your pricing?"
    ];

    return (
        <div className="w-80 bg-[#0F1629] border-l border-white/[0.04] p-6 space-y-6 overflow-y-auto">
            {/* Ready to Launch */}
            <div className="bg-gradient-to-br from-[#00F5D4] to-[#3A86FF] rounded-xl p-5 text-[#0A0F1C] shadow-lg">
                <h3 className="font-sora font-bold text-lg mb-2">Ready to Launch?</h3>
                <p className="text-sm text-[#0A0F1C]/70 mb-4">
                    Your bot looks great! Move to the final step to get your embed code.
                </p>
                <button
                    onClick={onProceedToEmbed}
                    className="w-full bg-[#0A0F1C] text-[#00F5D4] px-4 py-3 rounded-xl font-semibold text-sm hover:bg-[#121826] transition-all flex items-center justify-center gap-2 font-inter btn-hover-scale"
                >
                    Looks Good! Get Code
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>
            </div>

            {/* Testing Suite */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-[#00F5D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <h3 className="font-sora font-bold text-[#F1F5F9]">Testing Suite</h3>
                </div>

                {/* Site Context Toggle */}
                <div className="bg-[#121826] rounded-xl p-4 mb-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#CBD5E1] font-inter">Site Context</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-[#64748B] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00F5D4]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#121826] after:border-white/[0.06] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00F5D4]"></div>
                        </label>
                    </div>
                    <p className="text-xs text-[#94A3B8]">Preview as overlay</p>
                </div>

                {/* Quick Test Prompts */}
                <div>
                    <p className="text-xs font-medium text-[#CBD5E1] uppercase tracking-wider mb-3 font-inter">Quick Test Prompts</p>
                    <div className="space-y-2">
                        {quickTestPrompts.map((prompt, index) => (
                            <button
                                key={index}
                                onClick={() => onTestPrompt?.(prompt)}
                                className="w-full text-left bg-[#121826] rounded-xl p-4 hover:bg-[#182034] transition-all group btn-hover-scale"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#94A3B8] group-hover:text-[#00F5D4] font-inter">{prompt}</span>
                                    <svg className="w-4 h-4 text-[#64748B] group-hover:text-[#00F5D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Debug Log */}
            <div>
                <button
                    onClick={() => setShowDebugLog(!showDebugLog)}
                    className="flex items-center justify-between w-full text-left mb-2"
                >
                    <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">Show Debug Log</span>
                    <svg
                        className={`w-4 h-4 text-[#64748B] transition-transform ${showDebugLog ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {showDebugLog && (
                    <div className="bg-gray-900 rounded-lg p-3 text-xs font-mono text-green-400 max-h-48 overflow-y-auto">
                        <div className="space-y-1">
                            <p>[INFO] Bot initialized successfully</p>
                            <p>[INFO] Knowledge base loaded: 12 documents</p>
                            <p>[INFO] Customization applied</p>
                            <p>[INFO] Ready for testing</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
