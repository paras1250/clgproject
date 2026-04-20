import React from 'react';
import { useChatbot } from './ChatbotContext';

const PersonaSection = () => {
    const { systemPrompt, setSystemPrompt } = useChatbot();

    return (
        <div className="px-6 py-6 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-[#F1F5F9] font-sora uppercase tracking-wider mb-4">
                Bot Persona / System Prompt
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[#CBD5E1] font-inter mb-2">
                        Instructions
                    </label>
                    <textarea
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        className="w-full h-32 px-3 py-2 bg-[#121826] border border-white/[0.1] text-[#F1F5F9] rounded-lg focus:ring-2 focus:ring-[#00F5D4] focus:border-transparent resize-none text-sm font-inter placeholder-[#64748B]"
                        placeholder="You are a helpful customer support assistant for RocketAI..."
                    />
                    <p className="mt-2 text-xs text-[#64748B] font-inter leading-relaxed">
                        Define how your chatbot should behave. You can give it a name, role, tone, and specific rules.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PersonaSection;
