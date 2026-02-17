import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Logo = () => (
    <div className="flex items-center gap-2 cursor-pointer">
        <img src="/assets/conversio-full-logo.png" alt="Conversio AI" className="h-8 w-auto" />
    </div>
);

export default function Navbar() {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="px-6 md:px-12 py-6 flex justify-between items-center bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
            <Link href="/">
                <Logo />
            </Link>

            <div className="hidden md:flex items-center gap-8">
                <nav className="flex items-center gap-8">
                    {["Features", "Pricing", "Blog"].map(item => (
                        <Link key={item} href="#" className="text-[#94A3B8] hover:text-[#F8FAFC] font-medium transition-colors">
                            {item}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-[#F8FAFC] font-semibold hover:text-[#3B82F6] transition-colors">Log In</Link>
                    <Link href="/login" className="bg-[#3B82F6] text-white px-5 py-2.5 rounded-full font-medium hover:bg-[#2563EB] transition-all shadow-lg shadow-blue-500/25">
                        Get Started
                    </Link>
                </div>
            </div>

            {/* Mobile Menu Icon */}
            <button className="md:hidden text-[#F8FAFC]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
        </header>
    );
}
