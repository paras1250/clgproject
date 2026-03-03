import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {
    LayoutDashboard, Bot, BarChart3, Wrench, Settings, CreditCard,
    Search, Bell, ChevronDown, LogOut, Menu, X, Sparkles, ChevronRight,
    User
} from 'lucide-react';

/* ─── Types ─── */
interface NavItem {
    href: string;
    label: string;
    icon: any;
}

/* ─── Constants ─── */
const primaryNav: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/bots', label: 'Bots', icon: Bot },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/builder', label: 'Builder', icon: Wrench },
    { href: '/settings', label: 'Settings', icon: Settings },
];

/* ─── Component ─── */
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [recentBots, setRecentBots] = useState<any[]>([]);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        try {
            const userStr = Cookies.get('user');
            if (userStr) setUser(JSON.parse(userStr));
        } catch { }

        const fetchBots = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) return;
                let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                if (backendUrl.endsWith('/')) backendUrl = backendUrl.slice(0, -1);
                const res = await fetch(`${backendUrl}/api/bots/list`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
                if (res.ok) {
                    const data = await res.json();
                    setRecentBots((data.bots || data || []).slice(0, 4));
                }
            } catch { }
        };
        fetchBots();
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        router.push('/login');
    };

    const isActive = (href: string) => {
        if (href === '/dashboard') return router.pathname === '/dashboard';
        return router.pathname.startsWith(href);
    };

    const userInitial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';

    /* ─── Sidebar Content ─── */
    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-5 pt-6 pb-4">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <img src="/assets/conversio-logo.png" alt="Conversio AI" className="w-8 h-8 object-contain" />
                    <span className="font-sora font-bold text-lg text-[#F1F5F9] tracking-tight">Conversio AI</span>
                </Link>
            </div>

            {/* Primary Navigation */}
            <nav className="px-3 mt-2 space-y-0.5 flex-1">
                {primaryNav.map(item => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`sidebar-nav-item ${active ? 'sidebar-nav-item-active' : ''}`}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}

                {/* Divider */}
                <div className="!my-4 border-t border-white/[0.06]" />

                {/* My Bots Section */}
                <div className="px-2 mb-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">My Bots</span>
                        <Link href="/builder" onClick={() => setSidebarOpen(false)} className="text-[#64748B] hover:text-[#00F5D4] transition-colors">
                            <Sparkles size={13} />
                        </Link>
                    </div>
                </div>

                {recentBots.length > 0 ? (
                    recentBots.map((bot: any) => (
                        <Link
                            key={bot._id || bot.id}
                            href={`/edit-bot?id=${bot._id || bot.id}`}
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/[0.04] transition-all group"
                        >
                            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#00F5D4]/20 to-[#3A86FF]/15 flex items-center justify-center text-[9px] font-bold text-[#00F5D4]">
                                {bot.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <span className="truncate flex-1">{bot.name}</span>
                            <ChevronRight size={12} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                        </Link>
                    ))
                ) : (
                    <p className="text-xs text-[#64748B] px-3 py-2">No bots yet</p>
                )}
            </nav>

            {/* Upgrade Card */}
            <div className="px-4 mb-4">
                <Link
                    href="/pricing"
                    onClick={() => setSidebarOpen(false)}
                    className="block p-3.5 rounded-xl bg-gradient-to-br from-[#00F5D4]/8 to-[#3A86FF]/6 border border-[#00F5D4]/15 hover:border-[#00F5D4]/30 transition-all group"
                >
                    <div className="flex items-center gap-2 mb-1.5">
                        <CreditCard size={15} className="text-[#00F5D4]" />
                        <span className="text-xs font-bold text-[#F1F5F9]">Upgrade to Pro</span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                        Unlock unlimited bots, analytics & priority support.
                    </p>
                </Link>
            </div>

            {/* User Profile */}
            <div className="px-3 pb-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-3 px-2 py-3 mt-2 rounded-lg hover:bg-white/[0.04] transition-all cursor-pointer group"
                    onClick={() => setProfileOpen(!profileOpen)}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F5D4] to-[#3A86FF] flex items-center justify-center text-[#0A0F1C] text-xs font-bold flex-shrink-0">
                        {userInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#F1F5F9] truncate">{user?.name || 'User'}</p>
                        <p className="text-[11px] text-[#64748B] truncate">{user?.email || ''}</p>
                    </div>
                    <ChevronDown size={14} className={`text-[#64748B] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </div>

                {profileOpen && (
                    <div className="mx-2 mb-1 rounded-lg bg-[#0A0F1C] border border-white/[0.08] overflow-hidden animate-fade-in">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                        >
                            <LogOut size={15} />
                            <span>Sign out</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0A0F1C] flex">
            {/* ─── Desktop Sidebar ─── */}
            <aside className="hidden lg:flex flex-col w-[260px] bg-[#0F1629] border-r border-white/[0.06] fixed inset-y-0 left-0 z-30">
                <SidebarContent />
            </aside>

            {/* ─── Mobile Sidebar Overlay ─── */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute top-0 left-0 bottom-0 w-[280px] bg-[#0F1629] border-r border-white/[0.06] animate-fade-in">
                        <div className="absolute right-3 top-3 z-10">
                            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#94A3B8]">
                                <X size={20} />
                            </button>
                        </div>
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* ─── Main Area ─── */}
            <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
                {/* ─── Top Header ─── */}
                <header className="sticky top-0 z-20 bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/[0.06]">
                    <div className="flex items-center justify-between h-14 px-4 lg:px-6">
                        {/* Left */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors text-[#94A3B8]"
                            >
                                <Menu size={20} />
                            </button>
                            <div className="flex items-center gap-2 text-sm font-medium text-[#F1F5F9] cursor-default">
                                <span className="w-5 h-5 rounded bg-gradient-to-br from-[#00F5D4] to-[#3A86FF] flex items-center justify-center text-[9px] font-bold text-[#0A0F1C]">
                                    {userInitial}
                                </span>
                                <span className="hidden sm:inline font-inter">My Workspace</span>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-1.5">
                            <Link href="/pricing" className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#00F5D4] to-[#3A86FF] text-[#0A0F1C] text-xs font-bold hover:shadow-lg hover:shadow-[#00F5D4]/20 transition-all mr-1">
                                <Sparkles size={12} />
                                UPGRADE
                            </Link>
                            <button className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-[#94A3B8] hover:text-[#F1F5F9]">
                                <Search size={18} />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-[#94A3B8] hover:text-[#F1F5F9] relative">
                                <Bell size={18} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00F5D4] rounded-full"></span>
                            </button>
                            <Link href="/settings" className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-[#94A3B8] hover:text-[#F1F5F9]">
                                <Settings size={18} />
                            </Link>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F5D4] to-[#3A86FF] flex items-center justify-center text-[#0A0F1C] text-xs font-bold ml-1 cursor-pointer">
                                {userInitial}
                            </div>
                        </div>
                    </div>
                </header>

                {/* ─── Page Content ─── */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
