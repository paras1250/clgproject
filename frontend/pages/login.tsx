import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Loader2, Eye, EyeOff, Check, X } from 'lucide-react';

export default function Login() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            if (token) {
                router.push('/dashboard');
            }
        }
    }, [router]);

    // Reset confirm password when switching modes
    useEffect(() => {
        setConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setError('');
    }, [isLogin]);

    // Password strength checks
    const pwd = formData.password;
    const checks = {
        length:    pwd.length >= 8,
        uppercase: /[A-Z]/.test(pwd),
        lowercase: /[a-z]/.test(pwd),
        number:    /[0-9]/.test(pwd),
    };
    const allChecksPassed = Object.values(checks).every(Boolean);

    const attemptRequest = async (endpoint: string): Promise<Response> => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25000);
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                signal: controller.signal,
            });
            clearTimeout(timeout);
            return res;
        } catch (err: any) {
            clearTimeout(timeout);
            throw err;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Client-side confirm password check
        if (!isLogin && formData.password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Client-side password strength check on signup
        if (!isLogin && !allChecksPassed) {
            setError('Password does not meet the requirements below.');
            return;
        }

        setLoading(true);
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            let res: Response;
            try {
                res = await attemptRequest(endpoint);
            } catch (firstErr: any) {
                // Server might be waking up (Render free tier cold start) — retry once
                setError('⏳ Server is waking up, retrying in 5 seconds...');
                await new Promise(r => setTimeout(r, 5000));
                setError('');
                res = await attemptRequest(endpoint);
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || 'Authentication failed. Please try again.');

            const Cookies = (await import('js-cookie')).default;
            Cookies.set('token', data.token, { expires: 7 });
            Cookies.set('user', JSON.stringify(data.user), { expires: 7 });

            router.push('/dashboard');
        } catch (err: any) {
            if (err.name === 'AbortError') {
                setError('Request timed out. The server may be waking up — please try again.');
            } else {
                setError(err.message || 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const inputClass = "w-full px-4 py-3 rounded-xl bg-[#0A0F1C] border border-white/[0.08] text-[#F1F5F9] placeholder-[#64748B] focus:border-[#00F5D4] focus:ring-1 focus:ring-[#00F5D4]/30 outline-none transition-all font-inter";

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
                    {/* Full Name — signup only */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-[#94A3B8] mb-1 font-inter">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="John Doe"
                            />
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-[#94A3B8] mb-1 font-inter">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-[#94A3B8] mb-1 font-inter">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                required
                                minLength={8}
                                value={formData.password}
                                onChange={handleChange}
                                className={`${inputClass} pr-12`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Password requirements — signup only, shown when typing */}
                        {!isLogin && formData.password.length > 0 && (
                            <div className="mt-2 space-y-1">
                                <PasswordRule met={checks.length}    label="At least 8 characters" />
                                <PasswordRule met={checks.uppercase} label="One uppercase letter (A–Z)" />
                                <PasswordRule met={checks.lowercase} label="One lowercase letter (a–z)" />
                                <PasswordRule met={checks.number}    label="One number (0–9)" />
                            </div>
                        )}
                    </div>

                    {/* Confirm Password — signup only */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-[#94A3B8] mb-1 font-inter">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className={`${inputClass} pr-12 ${
                                        confirmPassword.length > 0
                                            ? confirmPassword === formData.password
                                                ? 'border-[#10B981] focus:border-[#10B981] focus:ring-[#10B981]/30'
                                                : 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/30'
                                            : ''
                                    }`}
                                    placeholder="Re-enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {confirmPassword.length > 0 && confirmPassword !== formData.password && (
                                <p className="text-xs text-[#EF4444] mt-1 font-inter">Passwords do not match</p>
                            )}
                            {confirmPassword.length > 0 && confirmPassword === formData.password && (
                                <p className="text-xs text-[#10B981] mt-1 font-inter">✓ Passwords match</p>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00F5D4] text-[#0A0F1C] py-3.5 rounded-xl font-semibold hover:bg-[#00D9C0] transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-[#00F5D4]/15 font-inter tracking-wide mt-2"
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

// Small helper component for password requirement rows
function PasswordRule({ met, label }: { met: boolean; label: string }) {
    return (
        <div className="flex items-center gap-2">
            {met
                ? <Check size={13} className="text-[#10B981] flex-shrink-0" />
                : <X size={13} className="text-[#EF4444] flex-shrink-0" />
            }
            <span className={`text-xs font-inter ${met ? 'text-[#10B981]' : 'text-[#64748B]'}`}>{label}</span>
        </div>
    );
}
