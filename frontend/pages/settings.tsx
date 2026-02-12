import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../components/DashboardLayout';
import { User, Key, Copy, Check, AlertTriangle, Settings as SettingsIcon, LogOut } from 'lucide-react';
import Cookies from 'js-cookie';

export default function Settings() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [apiKey, setApiKey] = useState('');
    const [copied, setCopied] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [showRegenerateWarning, setShowRegenerateWarning] = useState(false);

    useEffect(() => {
        loadUserSettings();
    }, []);

    const loadUserSettings = async () => {
        try {
            const token = Cookies.get('token');
            const userStr = Cookies.get('user');

            if (userStr) {
                const parsed = JSON.parse(userStr);
                setUser(parsed);
                setApiKey(parsed.apiKey || 'sk-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
            }

            let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            if (backendUrl.endsWith('/')) backendUrl = backendUrl.slice(0, -1);

            const res = await fetch(`${backendUrl}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                const userData = data.user || data;
                setUser(userData);
                if (userData.apiKey) setApiKey(userData.apiKey);
            }
        } catch (err) {
            console.error('Failed to load user settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const copyApiKey = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const regenerateApiKey = async () => {
        setRegenerating(true);
        try {
            const token = Cookies.get('token');
            let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            if (backendUrl.endsWith('/')) backendUrl = backendUrl.slice(0, -1);

            const res = await fetch(`${backendUrl}/api/user/regenerate-key`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setApiKey(data.apiKey || 'sk-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
            }
        } catch (err) {
            console.error('Failed to regenerate API key:', err);
        } finally {
            setRegenerating(false);
            setShowRegenerateWarning(false);
        }
    };

    const maskApiKey = (key: string) => {
        if (!key || key.length < 12) return key;
        return key.substring(0, 7) + '••••••••••••••••' + key.substring(key.length - 4);
    };

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        router.push('/login');
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="animate-spin w-8 h-8 border-2 border-[#0A0807] border-t-transparent rounded-full"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Head>
                <title>Settings - Conversio AI</title>
            </Head>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#0A0807]">Settings</h1>
                <p className="text-gray-500">Manage your account and preferences.</p>
            </div>

            <div className="max-w-2xl space-y-6">
                {/* Account Information */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <User size={20} className="text-gray-600" />
                        </div>
                        <h2 className="text-lg font-bold text-[#0A0807]">Account Information</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500 block mb-1">Email</label>
                            <p className="text-[#0A0807] font-medium">{user?.email || 'Not available'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 block mb-1">Name</label>
                            <p className="text-[#0A0807] font-medium">{user?.name || 'Not set'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 block mb-1">Account Created</label>
                            <p className="text-[#0A0807] font-medium">
                                {user?.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })
                                    : 'Not available'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* API Key Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <Key size={20} className="text-gray-600" />
                        </div>
                        <h2 className="text-lg font-bold text-[#0A0807]">API Key</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono text-sm text-gray-600 overflow-hidden">
                                {maskApiKey(apiKey)}
                            </div>
                            <button
                                onClick={copyApiKey}
                                className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-medium"
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} className="text-green-500" />
                                        <span className="text-green-600">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {showRegenerateWarning ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-amber-800 mb-1">
                                            Are you sure you want to regenerate your API key?
                                        </p>
                                        <p className="text-sm text-amber-700 mb-3">
                                            Your current key will stop working immediately. Any integrations using the old key will need to be updated.
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={regenerateApiKey}
                                                disabled={regenerating}
                                                className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                                            >
                                                {regenerating ? 'Regenerating...' : 'Yes, Regenerate'}
                                            </button>
                                            <button
                                                onClick={() => setShowRegenerateWarning(false)}
                                                className="px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowRegenerateWarning(true)}
                                className="text-sm text-gray-500 hover:text-[#0A0807] font-medium transition-colors"
                            >
                                Regenerate API Key
                            </button>
                        )}
                    </div>
                </div>

                {/* Logout */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                                <LogOut size={20} className="text-red-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-[#0A0807]">Logout</h2>
                                <p className="text-sm text-gray-500">Sign out of your account</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2.5 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
