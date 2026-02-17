import React from 'react';

interface TrainingStatusPanelProps {
    trainingMethod: 'text' | 'files' | 'both';
    uploadedFilesCount: number;
    trainingTextLength: number;
    isTraining: boolean;
}

export default function TrainingStatusPanel({
    trainingMethod,
    uploadedFilesCount,
    trainingTextLength,
    isTraining
}: TrainingStatusPanelProps) {
    const hasText = trainingTextLength > 0;
    const hasFiles = uploadedFilesCount > 0;

    return (
        <div className="w-full space-y-4">
            {/* Knowledge Source - Compact */}
            <div className="glass-panel rounded-xl p-3 relative overflow-hidden group hover-lift">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 48">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="font-bold text-[#F8FAFC] text-sm">Knowledge Source</h3>
                    </div>
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded capitalize border border-primary-100">{trainingMethod}</span>
                </div>
            </div>

            {/* Ingestion Status - Compact Version */}
            <div className="glass-panel rounded-xl p-3 relative overflow-hidden group hover-lift">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${isTraining ? 'bg-blue-500 animate-pulse' : hasText || hasFiles ? 'bg-[#10B981]/100' : 'bg-gray-300'}`} />
                        <h3 className="font-bold text-[#F8FAFC] text-sm">Ingestion Status</h3>
                    </div>

                    {isTraining ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-xs font-semibold text-blue-600">Processing...</span>
                        </div>
                    ) : hasText || hasFiles ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#10B981]/10 rounded text-green-700">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-xs font-bold">Ready</span>
                        </div>
                    ) : (
                        <span className="text-xs text-[#64748B] font-medium">Waiting for data</span>
                    )}
                </div>
            </div>

            {/* Detected Capabilities - Compact */}
            <div className="glass-panel rounded-xl p-3 hover-lift">
                <h3 className="font-bold text-[#94A3B8] mb-2 text-xs uppercase tracking-wider">Detected Capabilities</h3>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <svg className={`w-5 h-5 ${hasText || hasFiles ? 'text-[#10B981]' : 'text-[#64748B]'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className={`text-sm ${hasText || hasFiles ? 'text-[#94A3B8] font-medium' : 'text-[#64748B]'}`}>Basic Conversation</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className={`w-5 h-5 ${uploadedFilesCount > 0 ? 'text-[#10B981]' : 'text-[#64748B]'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className={`text-sm ${uploadedFilesCount > 0 ? 'text-[#94A3B8] font-medium' : 'text-[#64748B]'}`}>Document Knowledge</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#64748B]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-[#64748B]">Advanced Reasoning</span>
                    </div>
                </div>
                <p className="text-xs text-[#94A3B8] mt-3">Add more data to unlock capabilities</p>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
                <h3 className="font-bold text-[#F8FAFC] mb-4">Training Data Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#1E293B] rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">{uploadedFilesCount}</div>
                        <div className="text-xs text-[#94A3B8] mt-1">Documents</div>
                    </div>
                    <div className="bg-[#1E293B] rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">{Math.round(trainingTextLength / 100) * 100}</div>
                        <div className="text-xs text-[#94A3B8] mt-1">Characters</div>
                    </div>
                </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="text-sm font-semibold text-blue-900">Pro Tip</p>
                        <p className="text-xs text-blue-700 mt-1">
                            Structured data like "Q: [question] A: [answer]" produces more accurate results.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
