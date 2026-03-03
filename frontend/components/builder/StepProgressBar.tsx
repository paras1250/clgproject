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
        <div className="mb-8 premium-card p-5 max-w-5xl mx-auto">
            <div className="flex items-center justify-between relative px-4">
                {/* Progress Line */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10 mx-16">
                    <div
                        className="h-full bg-gradient-to-r from-[#00F5D4] to-[#3A86FF] transition-all duration-700 ease-out shadow-[0_0_8px_rgba(0,245,212,0.3)]"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />
                </div>

                {steps.map((step) => (
                    <div key={step.number} className="flex flex-col items-center flex-1 relative z-10">
                        <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 btn-hover-scale ${currentStep >= step.number
                                ? 'bg-gradient-to-br from-[#00F5D4] to-[#3A86FF] text-[#0A0F1C] shadow-lg shadow-[#00F5D4]/20 scale-110'
                                : 'bg-[#0F1629] text-[#64748B]'
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
                            <p className={`text-sm font-semibold leading-tight font-sora ${currentStep >= step.number ? 'text-[#F1F5F9]' : 'text-[#64748B]'}`}>
                                {step.title}
                            </p>
                            <p className={`text-xs mt-0.5 font-inter ${currentStep >= step.number ? 'text-[#00F5D4] font-medium' : 'text-[#64748B]'}`}>
                                {step.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
