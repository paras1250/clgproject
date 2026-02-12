import React from 'react';
import { useChatbot } from './ChatbotContext';

const PersonaSection = () => {
    const { systemPrompt, setSystemPrompt } = useChatbot();

    return (
        <div className="px-6 py-6 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Bot Persona / System Prompt
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructions
                    </label>
                    <textarea
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                        placeholder="You are a helpful customer support assistant for RocketAI..."
                    />
                    <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                        Define how your chatbot should behave. You can give it a name, role, tone, and specific rules.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PersonaSection;
