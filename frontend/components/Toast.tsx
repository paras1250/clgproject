import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

// Simple event emitter for toast
const toastEvents = {
    listeners: [] as ((toast: ToastMessage) => void)[],
    emit(message: string, type: ToastType) {
        const id = Math.random().toString(36).substring(2, 9);
        const toast = { id, message, type };
        this.listeners.forEach(listener => listener(toast));
    },
    subscribe(listener: (toast: ToastMessage) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
};

export const showToast = (message: string, type: ToastType = 'info') => {
    toastEvents.emit(message, type);
};

export const ToastContainer = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        return toastEvents.subscribe((toast) => {
            setToasts(prev => [...prev, toast]);
            // Auto-dismiss
            setTimeout(() => {
                removeToast(toast.id);
            }, 5000);
        });
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto flex items-start gap-3 min-w-[300px] max-w-sm p-4 rounded-xl shadow-lg border animate-in slide-in-from-right-10 transition-all ${toast.type === 'success' ? 'bg-white border-green-100 text-gray-800' :
                            toast.type === 'error' ? 'bg-white border-red-100 text-gray-800' :
                                toast.type === 'warning' ? 'bg-white border-yellow-100 text-gray-800' :
                                    'bg-white border-blue-100 text-gray-800'
                        }`}
                >
                    <div className={`mt-0.5 ${toast.type === 'success' ? 'text-green-500' :
                            toast.type === 'error' ? 'text-red-500' :
                                toast.type === 'warning' ? 'text-yellow-500' :
                                    'text-blue-500'
                        }`}>
                        {toast.type === 'success' && <CheckCircle size={18} />}
                        {toast.type === 'error' && <AlertCircle size={18} />}
                        {toast.type === 'warning' && <AlertTriangle size={18} />}
                        {toast.type === 'info' && <Info size={18} />}
                    </div>
                    <p className="text-sm font-medium flex-1">{toast.message}</p>
                    <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};
