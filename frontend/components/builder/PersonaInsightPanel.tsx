import React from 'react';
import { useChatbot } from '../chatbot-customization/ChatbotContext';

interface PersonaInsightPanelProps {
    botName: string;
    botDescription?: string;
    avatar?: string; // Optional - will use context if not provided
    systemPrompt?: string;
    documentsCount: number;
    trainingTextLength?: number;
}

export default function PersonaInsightPanel({
    botName,
    botDescription,
    avatar: avatarProp,
    systemPrompt,
    documentsCount,
    trainingTextLength = 0
}: PersonaInsightPanelProps) {
    // Get avatar from ChatbotContext - this is the user-selected avatar
    const { selectedAvatar } = useChatbot();

    // Use context avatar (user-selected) if available, otherwise fall back to prop
    const avatar = selectedAvatar || avatarProp || '';

    // Calculate index health based on available data
    const calculateIndexHealth = () => {
        if (documentsCount === 0 && trainingTextLength === 0) return 0;
        if (documentsCount > 0 && trainingTextLength > 500) return 98;
        if (documentsCount > 0 || trainingTextLength > 200) return 85;
        return 70;
    };

    const indexHealth = calculateIndexHealth();
    const isImageAvatar = avatar && (avatar.startsWith('/') || avatar.startsWith('http'));

    return (
        <div className="w-full h-auto lg:h-full border-b lg:border-r border-white/[0.04] p-6 space-y-6 overflow-y-auto">
            {/* Persona Insight Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                <svg className="w-5 h-5 text-[#00F5D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="font-sora font-bold text-[#F1F5F9]">Persona Insight</h3>
            </div>

            {/* Active Identity */}
            <div>
                <p className="text-xs font-medium text-[#CBD5E1] uppercase tracking-wider mb-3 font-inter">Active Identity</p>
                <div className="premium-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                        {/* Display avatar - handle both emoji and image */}
                        {isImageAvatar ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border-2 border-[#00F5D4]/20 flex-shrink-0">
                                <img src={avatar} alt={botName} className="w-full h-full object-cover" />
                            </div>
                        ) : avatar ? (
                            <div className="w-12 h-12 bg-gradient-to-br from-[#00F5D4] to-[#3A86FF] rounded-full flex items-center justify-center text-xl font-bold text-[#0A0F1C] shadow-sm border-2 border-[#00F5D4]/20 flex-shrink-0">
                                {avatar}
                            </div>
                        ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-[#00F5D4] to-[#3A86FF] rounded-full flex items-center justify-center text-xl font-bold text-[#0A0F1C] shadow-sm border-2 border-[#00F5D4]/20 flex-shrink-0">
                                {avatar}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-sora font-bold text-[#F1F5F9] truncate">{botName}</p>
                            <p className="text-xs text-[#94A3B8]">Online • Replies instantly</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Instructions */}
            <div>
                <p className="text-xs font-medium text-[#CBD5E1] uppercase tracking-wider mb-3 font-inter">System Instructions</p>
                <div className="bg-[#121826] rounded-xl p-4">
                    <div className="space-y-2 text-xs text-[#94A3B8]">
                        <p>
                            <span className="font-semibold">Core Directive:</span> {systemPrompt || 'You are a helpful AI assistant.'}
                        </p>
                        {botDescription && (
                            <p>
                                <span className="font-semibold">Context:</span> {botDescription}
                            </p>
                        )}
                        <p>
                            <span className="font-semibold">Constraints:</span> Professional and approachable tone.
                        </p>
                    </div>
                </div>
            </div>

            {/* Knowledge Base Stats */}
            <div>
                <p className="text-xs font-medium text-[#CBD5E1] uppercase tracking-wider mb-3 font-inter">Knowledge Base Stats</p>
                <div className="space-y-2">
                    <div className="flex items-center justify-between bg-[#121826] rounded-xl p-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#00F5D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-[#CBD5E1] font-inter">Documents</span>
                        </div>
                        <span className="text-lg font-bold text-[#00F5D4]">{documentsCount}</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#121826] rounded-xl p-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-sm text-[#CBD5E1] font-inter">Index Health</span>
                        </div>
                        <span className={`text-lg font-bold ${indexHealth >= 90 ? 'text-[#10B981]' : indexHealth >= 70 ? 'text-[#F59E0B]' : 'text-orange-600'}`}>
                            {indexHealth}%
                        </span>
                    </div>
                    {trainingTextLength > 0 && (
                        <div className="flex items-center justify-between bg-[#121826] rounded-xl p-4">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#3A86FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm text-[#CBD5E1] font-inter">Text Data</span>
                            </div>
                            <span className="text-lg font-bold text-[#3A86FF]">{Math.round(trainingTextLength / 100) / 10}K</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
