import Link from 'next/link';
import { useRouter } from 'next/router';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: '📊' },
        { href: '/bots', label: 'My Chatbots', icon: '🤖' },
        { href: '/analytics', label: 'Analytics', icon: '📈' },
        { href: '/settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#1E293B] border-r border-white/10 hidden md:block">
                <div className="p-6">
                    <Link href="/" className="block">
                        <div className="flex items-center gap-2">
                            <img src="/assets/conversio-logo.png" alt="Conversio AI" className="w-8 h-8 object-contain" />
                            <span className="font-bold text-xl text-[#F8FAFC]">Conversio AI</span>
                        </div>
                    </Link>
                </div>
                <nav className="p-4 space-y-1">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2.5 rounded-lg font-medium transition-colors ${router.pathname === item.href || (item.href !== '/dashboard' && router.pathname.startsWith(item.href))
                                    ? 'bg-[#3B82F6] text-white'
                                    : 'text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden bg-[#1E293B] border-b border-white/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/assets/conversio-logo.png" alt="Conversio AI" className="w-8 h-8 object-contain" />
                    <span className="font-bold text-xl text-[#F8FAFC]">Conversio AI</span>
                </div>
                <button className="text-[#94A3B8] hover:text-[#F8FAFC]">Menu</button>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
