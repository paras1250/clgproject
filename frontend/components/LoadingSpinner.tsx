
interface LoadingSpinnerProps {
    fullScreen?: boolean;
    text?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function LoadingSpinner({ fullScreen = false, text, size = 'md', className = '' }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    };

    const spinner = (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div className={`${sizeClasses[size]} rounded-full border-gray-200 border-t-[#0A0807] animate-spin`}></div>
            {text && <p className="text-gray-500 font-medium animate-pulse">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {spinner}
            </div>
        );
    }

    return spinner;
}
