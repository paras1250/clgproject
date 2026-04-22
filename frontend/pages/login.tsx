import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';

export default function Login() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            if (token) {
                router.push('/dashboard');
            }
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Authentication failed');

            const Cookies = (await import('js-cookie')).default;
            Cookies.set('token', data.token, { expires: 7 });
            Cookies.set('user', JSON.stringify(data.user), { expires: 7 });

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C] p-4">
            <Head>
                <title>{isLogin ? 'Login' : 'Sign Up'} - Conversio AI</title>
            </Head>

            <div className="w-full max-w-md bg-[#121826] rounded-3xl shadow-xl p-6 sm:p-8 border border-white/[0.06]">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center mb-6">
                        <img src="/assets/conversio-logo-text.svg" alt="Conversio AI" style={{ height: '55px', width: 'auto' }} />
                    </Link>
                    <h1 className="font-sora text-2xl font-bold text-[#F1F5F9]">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
                    <p className="text-[#94A3B8] mt-2 font-inter">{isLogin ? 'Enter your details to access your bots' : 'Start building AI chatbots in minutes'}</p>
                </div>

                {error && (
                    <div className="bg-[#EF4444]/10 text-[#EF4444] p-3 rounded-lg mb-6 text-sm font-medium border border-[#EF4444]/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-[#94A3B8] mb-1 font-inter">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-[#0A0F1C] border border-white/[0.08] text-[#F1F5F9] placeholder-[#64748B] focus:border-[#00F5D4] focus:ring-1 focus:ring-[#00F5D4]/30 outline-none transition-all font-inter"
                                placeholder="John Doe"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-[#94A3B8] mb-1 font-inter">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-[#0A0F1C] border border-white/[0.08] text-[#F1F5F9] placeholder-[#64748B] focus:border-[#00F5D4] focus:ring-1 focus:ring-[#00F5D4]/30 outline-none transition-all font-inter"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#94A3B8] mb-1 font-inter">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength={6}
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-[#0A0F1C] border border-white/[0.08] text-[#F1F5F9] placeholder-[#64748B] focus:border-[#00F5D4] focus:ring-1 focus:ring-[#00F5D4]/30 outline-none transition-all font-inter"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00F5D4] text-[#0A0F1C] py-3.5 rounded-xl font-semibold hover:bg-[#00D9C0] transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-[#00F5D4]/15 font-inter tracking-wide"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/[0.06]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#121826] text-[#64748B] font-inter">Or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="w-full bg-white/5 text-[#F1F5F9] border border-white/[0.08] py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-3 relative font-inter"
                    onClick={() => window.location.href = '/api/auth/google'}
                >
                    <img src="/assets/google.svg" alt="Google" className="w-5 h-5 absolute left-6" />
                    <span>Google</span>
                </button>

                <div className="mt-8 text-center text-sm font-inter">
                    <span className="text-[#64748B]">{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 font-semibold text-[#00F5D4] hover:text-[#00D9C0] transition-colors"
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
