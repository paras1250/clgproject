import React from 'react';

interface Step {
    number: number;
    title: string;
    desc: string;
}

interface StepProgressBarProps {
    steps: Step[];
    currentStep: number;
}

export default function StepProgressBar({ steps, currentStep }: StepProgressBarProps) {
    return (
        <div className="mb-8 glass-panel rounded-2xl p-5 hover-lift max-w-5xl mx-auto">
            <div className="flex items-center justify-between relative px-4">
                {/* Progress Line */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200/50 mx-16">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />
                </div>

                {steps.map((step) => (
                    <div key={step.number} className="flex flex-col items-center flex-1 relative z-10">
                        <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentStep >= step.number
                                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                                : 'bg-white/80 text-gray-400 border-2 border-gray-200/60 backdrop-blur-sm'
                                }`}
                        >
                            {currentStep > step.number ? (
                                <svg className="w-4 h-4 animate-scale-in" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                step.number
                            )}
                        </div>
                        <div className="mt-2.5 text-center">
                            <p className={`text-sm font-bold leading-tight ${currentStep >= step.number ? 'text-gray-800' : 'text-gray-400'}`}>
                                {step.title}
                            </p>
                            <p className={`text-xs mt-0.5 ${currentStep >= step.number ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
                                {step.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
