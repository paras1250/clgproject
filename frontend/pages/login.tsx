import { useState } from 'react';
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
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-4">
            <Head>
                <title>{isLogin ? 'Login' : 'Sign Up'} - Conversio AI</title>
            </Head>

            <div className="w-full max-w-md bg-[#1E293B] rounded-3xl shadow-xl p-8 border border-white/10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <img src="/assets/conversio-logo.png" alt="Conversio AI" className="w-10 h-10 object-contain" />
                        <span className="font-bold text-2xl text-[#F8FAFC]">Conversio AI</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-[#F8FAFC]">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
                    <p className="text-[#94A3B8] mt-2">{isLogin ? 'Enter your details to access your bots' : 'Start building AI chatbots in minutes'}</p>
                </div>

                {error && (
                    <div className="bg-[#F43F5E]/10 text-[#F43F5E] p-3 rounded-lg mb-6 text-sm font-medium border border-[#F43F5E]/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-[#94A3B8] mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-white/10 text-[#F8FAFC] placeholder-[#64748B] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-[#94A3B8] mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-white/10 text-[#F8FAFC] placeholder-[#64748B] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#94A3B8] mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength={6}
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-white/10 text-[#F8FAFC] placeholder-[#64748B] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#3B82F6] text-white py-3.5 rounded-xl font-semibold hover:bg-[#2563EB] transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-500/25"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#1E293B] text-[#64748B]">Or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="w-full bg-white/5 text-[#F8FAFC] border border-white/10 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-3 relative"
                    onClick={() => window.location.href = '/api/auth/google'}
                >
                    <img src="/assets/google.svg" alt="Google" className="w-5 h-5 absolute left-6" />
                    <span>Google</span>
                </button>

                <div className="mt-8 text-center text-sm">
                    <span className="text-[#64748B]">{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 font-semibold text-[#3B82F6] hover:text-[#22D3EE] transition-colors"
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
