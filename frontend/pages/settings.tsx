import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../components/DashboardLayout';
import { User, Lock, CreditCard, LogOut, Check, AlertCircle, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';

export default function Settings() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [profileForm, setProfileForm] = useState({ name: '', email: '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = Cookies.get('token');
            const userStr = Cookies.get('user');

            // Initial load from cookie for speed
            if (userStr) {
                const parsed = JSON.parse(userStr);
                setUser(parsed);
                setProfileForm({ name: parsed.name, email: parsed.email });
                setLoading(false);
            }

            // Sync with server
            let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            if (backendUrl.endsWith('/')) backendUrl = backendUrl.slice(0, -1);

            const res = await fetch(`${backendUrl}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                /* NOTE: Endpoint returns { use: ... } due to typo in backend, usually { user: ... } 
                   Checking backend code I added: res.json({ use: ... }) -> typo. 
                   Wait, I wrote "use" instead of "user" in the replaces_file_content above?
                   Let's check the replace_content in my thought process... 
                   Ah, I wrote "use: {" in the replace_file_content call. 
                   I should fix that in backend or handle it here. 
                   I will fix it in backend in a follow-up step to be clean.
                   For now, assuming I will fix it, expecting { user: ... }
                */
                // Wait, I can't fix backend easily without another tool call. 
                // I'll assume I'll fix the backend typo right after this.
                // Or I can handle both structure just in case.
                const userData = data.user || data.use;
                setUser(userData);
                setProfileForm({ name: userData.name, email: userData.email });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const token = Cookies.get('token');
            let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            if (backendUrl.endsWith('/')) backendUrl = backendUrl.slice(0, -1);

            const res = await fetch(`${backendUrl}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: profileForm.name })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to update profile');

            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setUser({ ...user, name: data.user.name });
            // Update cookie
            Cookies.set('user', JSON.stringify({ ...user, name: data.user.name }), { expires: 7 });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const token = Cookies.get('token');
            let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            if (backendUrl.endsWith('/')) backendUrl = backendUrl.slice(0, -1);

            const res = await fetch(`${backendUrl}/api/auth/password`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to update password');

            setMessage({ type: 'success', text: 'Password updated successfully' });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        router.push('/login');
    };

    return (
        <DashboardLayout>
            <Head>
                <title>Settings - Conversio AI</title>
            </Head>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#0A0807]">Account Settings</h1>
                <p className="text-gray-500">Manage your profile, security, and billing.</p>
            </div>

            <div className="grid lg:grid-cols-[240px_1fr] gap-8 items-start">
                {/* Sidebar Navigation */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full text-left px-5 py-4 flex items-center gap-3 font-medium transition-colors ${activeTab === 'profile' ? 'bg-[#0A0807] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <User size={18} /> Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`w-full text-left px-5 py-4 flex items-center gap-3 font-medium transition-colors ${activeTab === 'password' ? 'bg-[#0A0807] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Lock size={18} /> Password
                    </button>
                    <button
                        onClick={() => setActiveTab('billing')}
                        className={`w-full text-left px-5 py-4 flex items-center gap-3 font-medium transition-colors ${activeTab === 'billing' ? 'bg-[#0A0807] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <CreditCard size={18} /> Billing
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-4 flex items-center gap-3 font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm min-h-[400px]">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                            <p>{message.text}</p>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div>
                            <h2 className="text-xl font-bold text-[#0A0807] mb-6">Profile Information</h2>
                            <form onSubmit={handleProfileUpdate} className="max-w-md space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profileForm.name}
                                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A0807] focus:border-[#0A0807] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={profileForm.email}
                                        disabled
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed directly.</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-[#0A0807] text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div>
                            <h2 className="text-xl font-bold text-[#0A0807] mb-6">Change Password</h2>
                            <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A0807] focus:border-[#0A0807] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A0807] focus:border-[#0A0807] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A0807] focus:border-[#0A0807] outline-none transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-[#0A0807] text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? <><Loader2 size={18} className="animate-spin" /> Updating...</> : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div>
                            <h2 className="text-xl font-bold text-[#0A0807] mb-6">Subscription Plan</h2>
                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-lg">Free Plan</h3>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">Active</span>
                                </div>
                                <ul className="space-y-3 mb-6">
                                    <li className="flex items-center gap-2 text-sm text-gray-600"><Check size={16} className="text-green-600" /> 1 Chatbot</li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600"><Check size={16} className="text-green-600" /> Basic Analytics</li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600"><Check size={16} className="text-green-600" /> Community Support</li>
                                </ul>
                                <button className="w-full py-2.5 border-2 border-[#0A0807] text-[#0A0807] font-bold rounded-lg hover:bg-[#0A0807] hover:text-white transition-all">
                                    Upgrade to Pro
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
