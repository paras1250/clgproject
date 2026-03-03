import React from 'react';

interface ChecklistItem {
    label: string;
    sublabel: string;
    completed: boolean;
}

interface DeploymentChecklistProps {
    documentsCount: number;
    isCustomized: boolean;
    isTested: boolean;
}

export default function DeploymentChecklist({
    documentsCount,
    isCustomized,
    isTested
}: DeploymentChecklistProps) {
    const checklistItems: ChecklistItem[] = [
        {
            label: 'Knowledge Base Trained',
            sublabel: `${documentsCount} documents processed`,
            completed: documentsCount > 0
        },
        {
            label: 'Appearance Customized',
            sublabel: 'Brand colors applied',
            completed: isCustomized
        },
        {
            label: 'Agent Tested',
            sublabel: 'Simulated conversations passed',
            completed: isTested
        },
        {
            label: 'Embed Code Installed',
            sublabel: 'Waiting for detection...',
            completed: false
        }
    ];

    return (
        <div className="space-y-3">
            {/* Go Live Checklist */}
            <div className="premium-card accent-top p-5">
                <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <h3 className="font-sora font-bold text-[#F1F5F9]">Go Live Checklist</h3>
                </div>

                <div className="space-y-2">
                    {checklistItems.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-3 p-3 rounded-xl ${item.completed
                                ? 'bg-[#10B981]/10'
                                : 'bg-[#0F1629]'
                                }`}
                        >
                            <div className="flex-shrink-0 mt-0.5">
                                {item.completed ? (
                                    <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-[#0F1629] flex items-center justify-center">
                                        <div className="w-2 h-2 bg-[#64748B] rounded-full animate-pulse" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold font-inter ${item.completed ? 'text-[#10B981]' : 'text-[#94A3B8]'}`}>
                                    {item.label}
                                </p>
                                <p className={`text-[10px] sm:text-xs font-inter ${item.completed ? 'text-[#10B981]/70' : 'text-[#94A3B8]'}`}>
                                    {item.sublabel}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Need Help Deploying */}
            <div className="premium-card p-5">
                <h3 className="font-sora font-bold text-[#F1F5F9] mb-2">Need help deploying?</h3>
                <p className="text-sm text-[#94A3B8] font-inter mb-4">
                    Our experts can handle the installation for you.
                </p>
                <button className="w-full bg-gradient-to-r from-[#00F5D4] to-[#3A86FF] text-[#0A0F1C] px-4 py-2.5 rounded-xl font-semibold text-xs hover:shadow-lg hover:shadow-[#00F5D4]/15 transition-all flex items-center justify-center gap-2 font-inter btn-hover-scale">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Contact Support
                </button>
            </div>

            {/* Deployment Stats */}
            <div className="premium-card p-5 text-center">
                <h3 className="font-sora font-bold text-[#F1F5F9] mb-2 text-sm">Deployment Ready</h3>
                <div className="flex items-center justify-center py-2">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#10B981]/10 rounded-full mb-2">
                            <svg className="w-6 h-6 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-sm font-semibold text-[#94A3B8]">Deployment Ready</p>
                        <p className="text-xs text-[#94A3B8] mt-1">Your chatbot is built successfully</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
