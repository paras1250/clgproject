import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    type = 'danger'
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1E293B] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full flex-shrink-0 ${type === 'danger' ? 'bg-red-100 text-[#F43F5E]' :
                                type === 'warning' ? 'bg-yellow-100 text-[#F59E0B]' :
                                    'bg-blue-100 text-blue-600'
                            }`}>
                            <AlertTriangle size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">{title}</h3>
                            <p className="text-[#94A3B8] text-sm leading-relaxed">{message}</p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="text-[#64748B] hover:text-[#94A3B8] transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="bg-[#0F172A] px-6 py-4 flex items-center justify-end gap-3 border-t border-white/5">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-[#94A3B8] font-semibold hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all ${type === 'danger' ? 'bg-red-600 hover:bg-red-700' :
                                type === 'warning' ? 'bg-[#F59E0B]/100 hover:bg-yellow-600 text-white' :
                                    'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
