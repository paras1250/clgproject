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

            // Assuming the API sets a cookie or returns a token we handle here
            // For now, just redirect
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
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4">
            <Head>
                <title>{isLogin ? 'Login' : 'Sign Up'} - Conversio AI</title>
            </Head>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <img src="/assets/conversio-logo.png" alt="Conversio AI" className="w-10 h-10 object-contain" />
                        <span className="font-bold text-2xl text-[#0A0807]">Conversio AI</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
                    <p className="text-gray-500 mt-2">{isLogin ? 'Enter your details to access your bots' : 'Start building AI chatbots in minutes'}</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0A0807] focus:ring-1 focus:ring-[#0A0807] outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0A0807] focus:ring-1 focus:ring-[#0A0807] outline-none transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength={6}
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0A0807] focus:ring-1 focus:ring-[#0A0807] outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0A0807] text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="w-full bg-white text-gray-700 border border-gray-200 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-3 relative"
                    onClick={() => window.location.href = '/api/auth/google'}
                >
                    <img src="/assets/google.svg" alt="Google" className="w-5 h-5 absolute left-6" />
                    <span>Google</span>
                </button>

                <div className="mt-8 text-center text-sm">
                    <span className="text-gray-500">{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 font-semibold text-[#0A0807] hover:underline"
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
