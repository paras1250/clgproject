import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

interface AppHeaderProps {
    title?: string;
    breadcrumb?: string;
}

export default function AppHeader({ title = 'Chat Builder', breadcrumb }: AppHeaderProps) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch { }
        }

        const fetchUser = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) return;

                let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                if (backendUrl.endsWith('/')) backendUrl = backendUrl.slice(0, -1);

                const res = await fetch(`${backendUrl}/api/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user || data);
                }
            } catch (err) {
                console.error('Failed to fetch user:', err);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        router.push('/login');
    };

    const userInitial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?';

    return (
        <header className="bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
            <div className="px-6 py-3 flex items-center justify-between">
                {/* Left: Logo + Title/Breadcrumb */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2.5 group">
                        <img
                            src="/assets/conversio-logo.png"
                            alt="Conversio AI"
                            className="w-8 h-8 object-contain"
                        />
                        <span className="font-bold text-lg text-[#F8FAFC] hidden sm:inline">Conversio</span>
                    </Link>

                    <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>

                    {breadcrumb ? (
                        <div className="flex items-center gap-1.5 text-sm">
                            {breadcrumb.split(' / ').map((segment, i, arr) => (
                                <span key={i} className="flex items-center gap-1.5">
                                    {i > 0 && (
                                        <svg className="w-3.5 h-3.5 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                    <span className={i === arr.length - 1
                                        ? 'font-semibold text-[#F8FAFC]'
                                        : 'text-[#64748B] hover:text-[#94A3B8] cursor-pointer'
                                    }>
                                        {segment}
                                    </span>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span className="font-semibold text-[#F8FAFC] text-sm">{title}</span>
                    )}
                </div>

                {/* Right: User area */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="hidden md:flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-[#F8FAFC] font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Dashboard
                    </Link>

                    <Link
                        href="/bots"
                        className="hidden md:flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-[#F8FAFC] font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        My Bots
                    </Link>

                    {/* Upgrade Button */}
                    <Link
                        href="/pricing"
                        className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm hover:shadow-md"
                    >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                        </svg>
                        Upgrade
                    </Link>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-6 bg-white/10"></div>

                    {/* User dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#22D3EE] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {userInitial}
                            </div>
                            <span className="hidden sm:inline text-sm font-semibold text-[#F8FAFC] max-w-[120px] truncate">
                                {user?.name || 'User'}
                            </span>
                            <svg className={`w-4 h-4 text-[#64748B] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-[#1E293B] rounded-xl shadow-lg border border-white/10 py-1.5 z-50 animate-fade-in">
                                <div className="px-4 py-3 border-b border-white/10">
                                    <p className="text-sm font-semibold text-[#F8FAFC] truncate">{user?.name || 'User'}</p>
                                    <p className="text-xs text-[#64748B] truncate">{user?.email || ''}</p>
                                </div>

                                <div className="py-1">
                                    {[
                                        { href: '/dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                                        { href: '/bots', label: 'My Chatbots', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
                                        { href: '/analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                                        { href: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
                                    ].map(item => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC] transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                            </svg>
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>

                                <div className="border-t border-white/10 py-1">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#F43F5E] hover:bg-[#F43F5E]/10 transition-colors w-full text-left"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
