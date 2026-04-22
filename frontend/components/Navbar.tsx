import Link from 'next/link';
import { useState } from 'react';

const Logo = () => (
    <div className="flex items-center cursor-pointer">
        <img src="/assets/conversio-logo-text.svg" alt="Conversio AI" style={{ height: '58px', width: 'auto' }} />
    </div>
);

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="px-6 md:px-12 py-6 flex justify-between items-center bg-[#0A0F1C]/90 backdrop-blur-md border-b border-white/[0.06] sticky top-0 z-50">
            <Link href="/">
                <Logo />
            </Link>

            <div className="hidden md:flex items-center gap-8">
                <nav className="flex items-center gap-8">
                    {[
                        { label: "Features", href: "/features" },
                        { label: "Pricing", href: "/pricing" },
                        { label: "Blog", href: "/blog" }
                    ].map(item => (
                        <Link key={item.label} href={item.href} className="text-[#94A3B8] hover:text-[#F1F5F9] font-medium transition-colors font-inter">
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-[#F1F5F9] font-semibold hover:text-[#00F5D4] transition-colors font-inter">
                        Log In
                    </Link>
                    <Link href="/login" className="bg-[#00F5D4] text-[#0A0F1C] px-5 py-2.5 rounded-full font-semibold hover:bg-[#00D9C0] transition-all shadow-lg shadow-[#00F5D4]/15 font-inter tracking-wide">
                        Get Started
                    </Link>
                </div>
            </div>

            {/* Mobile Menu Icon */}
            <button className="md:hidden text-[#F1F5F9] z-50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                )}
            </button>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-[#0A0F1C] z-40 flex flex-col items-center justify-center gap-8 animate-fade-in">
                    <nav className="flex flex-col items-center gap-8">
                        {[
                            { label: "Features", href: "/features" },
                            { label: "Pricing", href: "/pricing" },
                            { label: "Blog", href: "/blog" }
                        ].map(item => (
                            <Link 
                                key={item.label} 
                                href={item.href} 
                                className="text-2xl text-[#94A3B8] hover:text-[#F1F5F9] font-bold font-sora"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex flex-col items-center gap-6 mt-4">
                        <Link 
                            href="/login" 
                            className="text-xl text-[#F1F5F9] font-semibold"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Log In
                        </Link>
                        <Link 
                            href="/login" 
                            className="bg-[#00F5D4] text-[#0A0F1C] px-10 py-4 rounded-full font-bold text-xl"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
