import Link from 'next/link';
import { useRouter } from 'next/router';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 hidden md:block">
                <div className="p-6">
                    <Link href="/" className="block">
                        <div className="flex items-center gap-2">
                            <img src="/assets/conversio-logo.png" alt="Conversio AI" className="w-8 h-8 object-contain" />
                            <span className="font-bold text-xl text-[#0A0807]">Conversio AI</span>
                        </div>
                    </Link>
                </div>
                <nav className="p-4 space-y-1">
                    <Link href="/dashboard" className={`block px-4 py-2.5 rounded-lg font-medium transition-colors ${router.pathname === '/dashboard' ? 'bg-[#0A0807] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                        Dashboard
                    </Link>
                    <Link href="/bots" className={`block px-4 py-2.5 rounded-lg font-medium transition-colors ${router.pathname.startsWith('/bots') ? 'bg-[#0A0807] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                        My Chatbots
                    </Link>
                    <Link href="/analytics" className={`block px-4 py-2.5 rounded-lg font-medium transition-colors ${router.pathname === '/analytics' ? 'bg-[#0A0807] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                        Analytics
                    </Link>
                    <Link href="/settings" className={`block px-4 py-2.5 rounded-lg font-medium transition-colors ${router.pathname === '/settings' ? 'bg-[#0A0807] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                        Settings
                    </Link>
                </nav>
            </aside>

            {/* Mobile Header (simplified) */}
            <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/assets/conversio-logo.png" alt="Conversio AI" className="w-8 h-8 object-contain" />
                    <span className="font-bold text-xl text-[#0A0807]">Conversio AI</span>
                </div>
                <button className="text-gray-500">Menu</button>
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
