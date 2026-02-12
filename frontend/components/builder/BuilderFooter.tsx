import React from 'react';

interface BuilderFooterProps {
    onBack?: () => void;
    onNext?: () => void;
    nextLabel?: string;
    backLabel?: string;
    isNextDisabled?: boolean;
    isLoading?: boolean;
    loadingText?: string;
    showBack?: boolean;
}

export default function BuilderFooter({
    onBack,
    onNext,
    nextLabel = 'Next Step',
    backLabel = 'Back',
    isNextDisabled = false,
    isLoading = false,
    loadingText = 'Processing...',
    showBack = true
}: BuilderFooterProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 p-4 z-50 flex justify-between items-center animate-fade-in-up">
            <div className="max-w-[1600px] mx-auto w-full flex justify-between items-center px-6">
                {showBack && onBack ? (
                    <button
                        onClick={onBack}
                        disabled={isLoading}
                        className="text-gray-600 hover:text-gray-900 font-medium px-6 py-2.5 rounded-xl hover:bg-gray-100 transition-all border border-gray-300 flex items-center gap-2 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {backLabel}
                    </button>
                ) : (
                    <div></div> // Spacer
                )}

                {onNext && (
                    <button
                        onClick={onNext}
                        disabled={isNextDisabled || isLoading}
                        className="bg-gradient-premium hover:shadow-lg hover:shadow-primary-500/30 text-white rounded-xl px-8 py-3 font-bold text-base transition-all transform hover:-translate-y-0.5 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden min-w-[200px]"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {loadingText}
                            </>
                        ) : (
                            <>
                                <span className="relative z-10">{nextLabel}</span>
                                <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
