import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminSidebar() {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
    },
    {
      name: 'Chatbots',
      href: '/admin/bots',
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    }
  ];

  return (
    <aside className="w-64 bg-[#121826] border-r border-white/[0.06] min-h-[calc(100vh-65px)] flex flex-col">
      <div className="p-6">
        <h2 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-4">Admin Controls</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-inter ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#00F5D4]/10 to-transparent text-[#00F5D4] font-semibold border border-[#00F5D4]/20' 
                    : 'text-[#94A3B8] hover:bg-white/5 hover:text-[#F1F5F9]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} />
                </svg>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-white/[0.06]">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Main App
        </Link>
      </div>
    </aside>
  );
}
