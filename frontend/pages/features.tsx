import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { Sparkles, Zap, Shield, Globe, BarChart3, MessageSquare, Code, Cpu, Layers } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }: any) => (
    <div 
        className="premium-card p-8 group hover:-translate-y-2 transition-all duration-500 animate-fade-in"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="w-14 h-14 rounded-2xl bg-[#00F5D4]/10 border border-[#00F5D4]/20 flex items-center justify-center text-[#00F5D4] mb-6 group-hover:scale-110 group-hover:bg-[#00F5D4]/20 transition-all shadow-lg shadow-[#00F5D4]/5">
            <Icon size={28} strokeWidth={2.5} />
        </div>
        <h3 className="font-sora text-xl font-bold text-[#F1F5F9] mb-4 group-hover:text-[#00F5D4] transition-colors">{title}</h3>
        <p className="text-[#94A3B8] leading-relaxed font-inter text-sm">{description}</p>
    </div>
);

export default function Features() {
    const features = [
        {
            icon: Cpu,
            title: "Advanced AI Engine",
            description: "Powered by Gemini 1.5 and FLAN-T5, our bots understand context, intent, and complex queries with human-like precision.",
            delay: 100
        },
        {
            icon: MessageSquare,
            title: "Natural Conversations",
            description: "Engage your visitors with fluid, non-robotic dialogue that adapts to their tone and specific needs in real-time.",
            delay: 200
        },
        {
            icon: Code,
            title: "One-Line Integration",
            description: "Deploy your chatbot to any website in seconds. Just copy a single line of script and you're live. No coding required.",
            delay: 300
        },
        {
            icon: Shield,
            title: "Private & Secure",
            description: "Your training data is encrypted and never shared. We prioritize your business privacy and data sovereignty.",
            delay: 400
        },
        {
            icon: BarChart3,
            title: "Deep Analytics",
            description: "Track user engagement, conversion rates, and sentiment analysis. Understand exactly what your customers want.",
            delay: 500
        },
        {
            icon: Globe,
            title: "Multi-Language Support",
            description: "Our AI agents can communicate in over 50 languages, breaking down barriers for your global customer base.",
            delay: 600
        }
    ];

    return (
        <div className="min-h-screen bg-[#0A0F1C] font-inter selection:bg-[#00F5D4]/30 selection:text-[#00F5D4]">
            <Head>
                <title>Features - Conversio AI</title>
                <meta name="description" content="Discover the powerful features of Conversio AI Chatbot Builder." />
            </Head>

            <Navbar />

            <main className="relative pt-20 pb-32 overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00F5D4]/5 rounded-full blur-[120px] -z-10 animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#3A86FF]/5 rounded-full blur-[120px] -z-10" />

                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero Section */}
                    <div className="text-center max-w-3xl mx-auto mb-24">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00F5D4]/10 border border-[#00F5D4]/20 text-[#00F5D4] text-xs font-black uppercase tracking-widest mb-6 animate-bounce-slow">
                            <Sparkles size={14} />
                            Platform Capabilities
                        </div>
                        <h1 className="font-sora text-4xl md:text-6xl font-black text-[#F1F5F9] mb-6 tracking-tight leading-tight">
                            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] to-[#3A86FF]">automate</span> support.
                        </h1>
                        <p className="text-lg text-[#94A3B8] leading-relaxed">
                            Stop answering the same questions every day. Build a custom AI agent trained on your own data that handles everything from FAQs to lead generation.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <FeatureCard key={i} {...f} />
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-32 p-12 rounded-[40px] bg-gradient-to-br from-[#121826] to-[#0A0F1C] border border-white/[0.06] relative overflow-hidden text-center">
                        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.02]" />
                        <div className="relative z-10">
                            <h2 className="font-sora text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-6">Ready to see it in action?</h2>
                            <p className="text-[#94A3B8] mb-10 max-w-xl mx-auto">Join 2,000+ businesses using Conversio AI to scale their customer operations without increasing headcount.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/login" className="px-8 py-4 rounded-2xl bg-[#00F5D4] text-[#0A0F1C] font-black hover:bg-[#00D9C0] transition-all shadow-xl shadow-[#00F5D4]/20 hover:shadow-[#00F5D4]/40 hover:-translate-y-1">
                                    Start Building Now
                                </Link>
                                <Link href="/pricing" className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[#F1F5F9] font-bold hover:bg-white/10 transition-all">
                                    View Pricing
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-white/[0.04]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:row items-center justify-between gap-6 text-[#64748B] text-sm">
                    <p>© 2026 Conversio AI. All rights reserved.</p>
                    <div className="flex items-center gap-8">
                        <a href="#" className="hover:text-[#F1F5F9] transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-[#F1F5F9] transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-[#F1F5F9] transition-colors">Contact Us</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
