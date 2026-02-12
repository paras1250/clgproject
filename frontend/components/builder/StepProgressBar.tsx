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
        <div className="mb-6 glass-panel rounded-xl p-4 transform transition-all hover:scale-[1.002] duration-500">
            <div className="flex items-center justify-between relative px-4">
                {/* Progress Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200/30 -z-10 rounded-full overflow-hidden transform -translate-y-1/2 mx-12">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />
                </div>

                {steps.map((step) => (
                    <div key={step.number} className="flex flex-col items-center flex-1 relative z-10 group cursor-default">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${currentStep >= step.number
                                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md shadow-blue-500/30 border-white/20 scale-105'
                                : 'bg-white/80 text-gray-400 border-white/50 backdrop-blur-sm'
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
                        <div className="mt-2 text-center transition-all duration-300">
                            <p className={`text-xs font-bold leading-tight ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'}`}>
                                {step.title}
                            </p>
                            <p className={`text-[10px] mt-0.5 transition-colors leading-tight ${currentStep >= step.number ? 'text-blue-600 font-medium' : 'text-gray-400/70'}`}>
                                {step.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
