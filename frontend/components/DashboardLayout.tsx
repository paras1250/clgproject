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
    const [searchOpen, setSearchOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSearchOpen(false);
                setNotificationsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const userInitial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';

    /* ─── Sidebar Content ─── */
    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-5 pt-4 pb-2">
                <Link href="/" className="flex items-center group">
                    <img src="/assets/conversio-logo-text.svg" alt="Conversio AI" style={{ height: '45px', width: 'auto' }} />
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
                            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#00F5D4]/20 to-[#3A86FF]/15 flex items-center justify-center text-[9px] font-bold text-[#00F5D4] overflow-hidden">
                                {(() => {
                                    const avatar = bot.widgetCustomization?.avatar || bot.avatar;
                                    const isImageUrl = avatar && (
                                        avatar.startsWith('/') || 
                                        avatar.startsWith('http') || 
                                        avatar.includes('.') || 
                                        avatar.length > 5
                                    );
                                    
                                    if (avatar) {
                                        return isImageUrl ? (
                                            <img src={avatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[12px]">{avatar}</span>
                                        );
                                    }
                                    return bot.name?.charAt(0)?.toUpperCase() || '?';
                                })()}
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
        <div className="min-h-screen bg-[#0A0F1C] flex selection:bg-[#00F5D4]/30 selection:text-[#00F5D4]">
            {/* ─── Desktop Sidebar ─── */}
            <aside className="hidden lg:flex flex-col w-[260px] bg-[#0F1629] border-r border-white/[0.06] fixed inset-y-0 left-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.3)]">
                <SidebarContent />
            </aside>

            {/* ─── Mobile Sidebar Overlay ─── */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute top-0 left-0 bottom-0 w-[280px] bg-[#0F1629] border-r border-white/[0.06] animate-fade-in shadow-2xl">
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
                <header className="sticky top-0 z-20 bg-[#0A0F1C]/70 backdrop-blur-xl border-b border-white/[0.04]">
                    <div className="flex items-center justify-between h-16 px-4 lg:px-8">
                        {/* Left */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors text-[#94A3B8]"
                            >
                                <Menu size={22} />
                            </button>
                            <div className="flex items-center gap-2.5 text-sm font-semibold text-[#F1F5F9] cursor-default bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.05]">
                                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#00F5D4] to-[#3A86FF] flex items-center justify-center text-[9px] font-black text-[#0A0F1C]">
                                    {userInitial}
                                </span>
                                <span className="hidden sm:inline font-sora tracking-wide">My Workspace</span>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-2">
                            <Link href="/pricing" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#00F5D4] to-[#3A86FF] text-[#0A0F1C] text-xs font-black hover:shadow-[0_0_20px_rgba(0,245,212,0.3)] transition-all mr-2 uppercase tracking-wider">
                                <Sparkles size={14} />
                                UPGRADE
                            </Link>
                            <div className="h-6 w-[1px] bg-white/[0.06] mx-2 hidden sm:block"></div>
                            
                            {/* Search Button */}
                            <div className="relative">
                                <button 
                                    onClick={() => setSearchOpen(true)}
                                    className="p-2.5 rounded-xl hover:bg-white/[0.06] transition-all text-[#94A3B8] hover:text-[#F1F5F9] hover:scale-105 active:scale-95"
                                >
                                    <Search size={19} />
                                </button>
                            </div>

                            {/* Notifications Button */}
                            <div className="relative">
                                <button 
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className={`p-2.5 rounded-xl transition-all relative hover:scale-105 active:scale-95 ${notificationsOpen ? 'bg-white/10 text-[#F1F5F9]' : 'text-[#94A3B8] hover:bg-white/[0.06] hover:text-[#F1F5F9]'}`}
                                >
                                    <Bell size={19} />
                                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#00F5D4] rounded-full ring-2 ring-[#0A0F1C]"></span>
                                </button>

                                {/* Notifications Dropdown */}
                                {notificationsOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                                        <div className="absolute right-0 mt-3 w-80 bg-[#121826] border border-white/[0.08] rounded-2xl shadow-2xl z-50 animate-fade-in overflow-hidden">
                                            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                                                <h3 className="font-sora font-bold text-[#F1F5F9] text-sm">Notifications</h3>
                                                <span className="text-[10px] font-bold text-[#00F5D4] bg-[#00F5D4]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">3 New</span>
                                            </div>
                                            <div className="max-h-[400px] overflow-y-auto">
                                                {[
                                                    { title: 'Bot Created', desc: 'Bot "Support Hero" was successfully trained.', time: '2m ago', icon: Bot, color: 'text-[#00F5D4] bg-[#00F5D4]/10' },
                                                    { title: 'New Message', desc: 'A user started a conversation with your bot.', time: '1h ago', icon: Bell, color: 'text-[#3A86FF] bg-[#3A86FF]/10' },
                                                    { title: 'System Update', desc: 'v2.4.0 is now live with Gemini 1.5 support.', time: '5h ago', icon: Sparkles, color: 'text-purple-400 bg-purple-400/10' },
                                                ].map((item, i) => (
                                                    <div key={i} className="px-5 py-4 hover:bg-white/[0.02] transition-colors border-b border-white/[0.04] last:border-0 cursor-pointer group">
                                                        <div className="flex gap-4">
                                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                                                                <item.icon size={16} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <p className="text-sm font-bold text-[#F1F5F9] group-hover:text-[#00F5D4] transition-colors">{item.title}</p>
                                                                    <span className="text-[10px] text-[#64748B]">{item.time}</span>
                                                                </div>
                                                                <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">{item.desc}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <Link href="/notifications" className="block text-center py-3 bg-white/[0.02] text-[11px] font-bold text-[#64748B] hover:text-[#F1F5F9] transition-colors border-t border-white/[0.06]">
                                                View all notifications
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                            <Link href="/settings" className="p-2.5 rounded-xl hover:bg-white/[0.06] transition-all text-[#94A3B8] hover:text-[#F1F5F9] hover:scale-105 active:scale-95">
                                <Settings size={19} />
                            </Link>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00F5D4] to-[#3A86FF] flex items-center justify-center text-[#0A0F1C] text-xs font-black ml-2 cursor-pointer shadow-lg shadow-[#00F5D4]/10 hover:scale-105 transition-transform ring-2 ring-white/10">
                                {userInitial}
                            </div>
                        </div>
                    </div>
                </header>

                {/* ─── Page Content ─── */}
                <main className="flex-1 p-4 lg:p-10 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>

                {/* ─── Search Overlay ─── */}
                {searchOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                        <div className="absolute inset-0 bg-[#0A0F1C]/80 backdrop-blur-sm animate-fade-in" onClick={() => setSearchOpen(false)} />
                        <div className="w-full max-w-2xl bg-[#121826] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden animate-slide-up z-10">
                            <div className="p-4 border-b border-white/[0.06] flex items-center gap-4">
                                <Search className="text-[#00F5D4]" size={22} />
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search bots, analytics, or settings..." 
                                    className="flex-1 bg-transparent border-none outline-none text-[#F1F5F9] text-lg font-inter"
                                />
                                <button onClick={() => setSearchOpen(false)} className="p-2 rounded-xl hover:bg-white/5 text-[#64748B] transition-all">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-4 max-h-[60vh] overflow-y-auto">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-3 px-2">Suggestions</p>
                                    {[
                                        { label: 'My Chatbots', icon: Bot, href: '/bots' },
                                        { label: 'Create New Bot', icon: Sparkles, href: '/builder' },
                                        { label: 'Analytics Dashboard', icon: BarChart3, href: '/analytics' },
                                        { label: 'Account Settings', icon: Settings, href: '/settings' },
                                    ].map((item, i) => (
                                        <Link 
                                            key={i} 
                                            href={item.href}
                                            onClick={() => setSearchOpen(false)}
                                            className="flex items-center justify-between p-3 rounded-xl hover:bg-[#00F5D4]/10 group transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-[#64748B] group-hover:text-[#00F5D4] transition-colors">
                                                    <item.icon size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-[#94A3B8] group-hover:text-[#F1F5F9] transition-colors">{item.label}</span>
                                            </div>
                                            <ChevronRight size={14} className="text-[#64748B] group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="px-6 py-3 bg-[#0A0F1C]/40 flex items-center justify-between border-t border-white/[0.04]">
                                <p className="text-[10px] text-[#64748B] font-inter">Press <kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10">Esc</kbd> to close</p>
                                <p className="text-[10px] text-[#64748B] font-inter">Tip: Use natural language search</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardLayout;
