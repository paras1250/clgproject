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
        <div className="w-full h-full bg-[#1E293B] border-r border-white/10 p-5 space-y-5 overflow-y-auto">
            {/* Persona Insight Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="font-bold text-[#F8FAFC]">Persona Insight</h3>
            </div>

            {/* Active Identity */}
            <div>
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-3">Active Identity</p>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                        {/* Display avatar - handle both emoji and image */}
                        {isImageAvatar ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border-2 border-blue-200 flex-shrink-0">
                                <img src={avatar} alt={botName} className="w-full h-full object-cover" />
                            </div>
                        ) : avatar ? (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-sm border-2 border-blue-200 flex-shrink-0">
                                {avatar}
                            </div>
                        ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-sm border-2 border-blue-200 flex-shrink-0">
                                {avatar}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#F8FAFC] truncate">{botName}</p>
                            <p className="text-xs text-[#94A3B8]">Online • Replies instantly</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Instructions */}
            <div>
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-3">System Instructions</p>
                <div className="bg-[#0F172A] rounded-lg p-3 border border-white/10 hover:border-white/10 transition-colors">
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
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-3">Knowledge Base Stats</p>
                <div className="space-y-2">
                    <div className="flex items-center justify-between bg-[#1E293B] rounded-lg p-3 border border-white/10 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-[#94A3B8]">Documents</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">{documentsCount}</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#1E293B] rounded-lg p-3 border border-white/10 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-sm text-[#94A3B8]">Index Health</span>
                        </div>
                        <span className={`text-lg font-bold ${indexHealth >= 90 ? 'text-[#10B981]' : indexHealth >= 70 ? 'text-[#F59E0B]' : 'text-orange-600'}`}>
                            {indexHealth}%
                        </span>
                    </div>
                    {trainingTextLength > 0 && (
                        <div className="flex items-center justify-between bg-[#1E293B] rounded-lg p-3 border border-white/10 hover:shadow-sm transition-shadow">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm text-[#94A3B8]">Text Data</span>
                            </div>
                            <span className="text-lg font-bold text-purple-600">{Math.round(trainingTextLength / 100) / 10}K</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
