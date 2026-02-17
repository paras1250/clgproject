import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Component Definitions
const Logo = () => (
    <Link href="/" className="flex items-center gap-2 cursor-pointer relative z-10">
        <img src="/assets/conversio-logo.png" alt="Conversio AI" className="w-9 h-9 object-contain" />
        <span className="font-bold text-xl text-[#F8FAFC]">Conversio</span>
    </Link>
);

const BackgroundClouds = () => (
    <div className="absolute top-0 left-0 w-full h-[130%] pointer-events-none -z-10 overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 2269 954" fill="none" preserveAspectRatio="xMidYMid slice">
            <g className="noupe-cloud-1">
                <rect x="1561" y="444" width="328" height="316" rx="158" fill="#FEE4D4" filter="blur(72px)"></rect>
            </g>
            <g className="noupe-cloud-2" opacity="0.7">
                <rect x="1628" y="683.685" width="514" height="207" rx="103.5" transform="rotate(-36.0777 1628 683.685)" fill="#FFB6C5" filter="blur(72px)"></rect>
            </g>
            <g className="noupe-cloud-3" opacity="0.8">
                <rect x="144" y="215" width="353" height="307" rx="130" fill="#FDC6D1" filter="blur(72px)"></rect>
            </g>
        </svg>
    </div>
);

const ChatbotMockup = () => (
    <div className="relative w-full max-w-[800px] perspective-1000">

        {/* Soft Background Glow — anchored behind browser */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 blur-[100px] -z-20 rounded-full pointer-events-none" />

        {/* ══════════════════════════════════════════════
           Browser Window Container (Relative, NO overflow hidden)
           This holds the chrome bar and the image naturally.
           ══════════════════════════════════════════════ */}
        <div className="relative rounded-xl bg-[#0F172A] shadow-2xl shadow-black/60 border border-white/10 ring-1 ring-white/5 z-10 transition-transform duration-500 hover:scale-[1.01] hover:rotate-1">

            {/* Browser Chrome Bar */}
            <div className="bg-[#1E293B] px-4 py-3 flex items-center gap-3 border-b border-white/10 rounded-t-xl">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></div>
                </div>
                {/* Simulated URL bar */}
                <div className="flex-1 mx-4">
                    <div className="bg-[#0F172A] rounded-md px-3 py-1.5 text-xs text-[#64748B] flex items-center gap-2 font-mono border border-white/5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        yourwebsite.com
                    </div>
                </div>
            </div>

            {/* Main Website Image — Natural Scale (w-full, h-auto), No object-fit, No Clipping */}
            <img
                src="/assets/website_mockup_bg_user.png"
                alt="Website preview"
                className="w-full h-auto rounded-b-xl opacity-90 block"
            />
            {/* Gradient Overlay at bottom to fade image slightly if needed, or remove for full clarity */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0F172A] to-transparent opacity-40 pointer-events-none rounded-b-xl" />
        </div>


        {/* ══════════════════════════════════════════════
           Floating Chat Widget (Absolute, Overlapping)
           Positioned relative to the main `relative` wrapper
           Allowing it to extend OUTSIDE the browser frame
           ══════════════════════════════════════════════ */}
        <div className="absolute -bottom-12 -right-8 md:-right-16 w-[280px] md:w-[320px] z-30 filter drop-shadow-2xl animate-float-slow">
            <div className="bg-[#1E293B] rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.8)] flex flex-col">
                {/* Chat header */}
                <div className="bg-[#1E293B] px-4 py-3 flex items-center gap-3 border-b border-white/10">
                    <img src="/assets/ai_agent_avatar.png" className="w-8 h-8 rounded-full bg-[#0F172A] p-0.5 object-cover ring-2 ring-blue-500/20" alt="AI Agent" />
                    <div>
                        <span className="text-sm font-semibold text-[#F8FAFC] block leading-tight">AI Assistant</span>
                        <span className="text-[10px] text-green-400 flex items-center gap-1 font-medium"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online</span>
                    </div>
                    <svg className="ml-auto w-4 h-4 text-[#64748B] cursor-pointer hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>

                {/* Chat body */}
                <div className="p-4 bg-[#0F172A]/95 backdrop-blur-sm flex flex-col gap-3 min-h-[300px]">
                    {/* User question 1 */}
                    <div className="chat-user-1 self-end bg-[#3B82F6] px-3.5 py-2 rounded-2xl rounded-tr-sm max-w-[85%] shadow-lg shadow-blue-900/20">
                        <p className="text-white text-xs leading-relaxed font-medium">What do you offer on the menu?</p>
                    </div>

                    {/* AI message 1 */}
                    <div className="chat-msg-1 flex flex-col gap-1 items-start">
                        <div className="bg-[#1E293B] p-3 rounded-2xl rounded-tl-sm shadow-md border border-white/5 max-w-[92%]">
                            <p className="chat-text text-[#E2E8F0] text-xs leading-relaxed">
                                Hello! 🍕 This pizzeria offers a variety of <strong className="text-white font-semibold">pizzas, pastas, salads, and desserts.</strong>
                            </p>
                        </div>
                        <span className="chat-label text-[9px] font-bold text-[#3B82F6] uppercase tracking-wider ml-1">Conversio AI Answered</span>
                    </div>

                    {/* User question 2 */}
                    <div className="chat-user-2 self-end bg-[#3B82F6] px-3.5 py-2 rounded-2xl rounded-tr-sm max-w-[85%] shadow-lg shadow-blue-900/20">
                        <p className="text-white text-xs leading-relaxed font-medium">Do you have vegetarian options?</p>
                    </div>

                    {/* AI message 2 */}
                    <div className="chat-msg-2 flex flex-col gap-1 items-start">
                        <div className="bg-[#1E293B] p-3 rounded-2xl rounded-tl-sm shadow-md border border-white/5 max-w-[92%]">
                            <p className="chat-text text-[#E2E8F0] text-xs leading-relaxed">
                                Yes, absolutely! 🥦 We offer vegetarian pizzas, pastas with seasonal veggies, and fresh salads.
                            </p>
                        </div>
                        <span className="chat-label text-[9px] font-bold text-[#3B82F6] uppercase tracking-wider ml-1">Conversio AI Answered</span>
                    </div>
                </div>
            </div>
        </div>


        {/* ══════════════════════════════════════════════
           Notification Badge (Absolute, Floating)
           Positioned relative to the wrapper, separate from browser
           ══════════════════════════════════════════════ */}
        <div className="absolute -top-12 md:-top-16 -right-4 md:-right-12 z-40 animate-float">
            <div className="relative group cursor-pointer">
                <div className="bg-gradient-to-r from-[#D200D3] to-[#F472B6] text-white px-5 py-2.5 rounded-full shadow-lg shadow-purple-500/40 flex items-center gap-2.5 transform rotate-2 group-hover:scale-105 group-hover:-rotate-1 transition-all duration-300 ring-4 ring-[#D200D3]/10">
                    <span className="bg-white/20 p-1 rounded-full"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9l4 4V20h3c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14h-3v3l-3-3H4V6h16v12z" /></svg></span>
                    <span className="font-bold text-xs whitespace-nowrap tracking-wide">You have 1 new conversation!</span>
                    {/* Badge Pointer */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#D200D3] rotate-45 rounded-sm"></div>
                </div>

                {/* Curved arrow graphic pointing to widget */}
                <svg className="absolute top-10 -left-12 w-20 h-20 text-[#D200D3] -rotate-12 pointer-events-none hidden md:block opacity-80" viewBox="0 0 100 100" fill="none">
                    <path d="M10,10 Q40,50 80,80" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#arrowhead-float)" />
                    <defs>
                        <marker id="arrowhead-float" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                        </marker>
                    </defs>
                </svg>
            </div>
        </div>

    </div>
);

const FeatureCard = ({ title, description, image, fullWidth, bgClass = "bg-[#1E293B]" }: { title: string; description: string; image: string; fullWidth?: boolean; bgClass?: string }) => (
    <div className={`relative group overflow-hidden rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center gap-10 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 border border-white/5 hover:border-white/10 ${bgClass} ${fullWidth ? 'md:col-span-2' : ''}`}>

        {/* Hover Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="max-w-2xl px-4 relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-[#F8FAFC] tracking-tight">{title}</h3>
            <p className="text-[#94A3B8] text-lg md:text-xl leading-relaxed">{description}</p>
        </div>
        <div className="w-full relative z-10">
            <img src={`/assets/${image}`} alt={title} className="w-full h-auto rounded-3xl shadow-xl border border-white/5 transition-transform duration-500 group-hover:scale-[1.02]" />
        </div>
    </div>
);

const Hero = () => (
    <section className="relative px-6 md:px-20 py-10 md:py-24 max-w-[1400px] mx-auto min-h-[85vh] flex items-center">
        <BackgroundClouds />

        <div className="grid lg:grid-cols-[1.1fr_1.3fr] gap-12 items-center w-full">
            <div className="text-left animate-in fade-in slide-in-from-left-8 duration-700 relative">
                <h1 className="text-5xl md:text-[5.5rem] noupe-semibold leading-[1.05] tracking-tight mb-8 text-[#F8FAFC] font-bold">
                    AI Chatbot for your site
                </h1>
                <p className="text-xl md:text-2xl text-[#94A3B8] noupe-medium leading-relaxed mb-12 max-w-xl">
                    Conversio AI chatbot instantly learns from your website and uses that knowledge to answer visitor questions — automatically.
                </p>

                <div className="flex flex-col gap-4 max-w-md relative">
                    <Link href="/login" className="noupe-button noupe-button-google py-4 px-6 text-xl relative group bg-[#1E293B] border border-white/10 rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center">
                        <span className="absolute left-4 bg-[#1E293B] p-1 rounded-full">
                            <img src="/assets/google.svg" width="22" alt="Google" />
                        </span>
                        <span className="flex items-center gap-2 font-semibold">
                            Sign Up with Google
                            <svg className="w-6 h-6 pt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M14.707 6.293a1 1 0 1 0-1.414 1.414L16.586 11H5a1 1 0 1 0 0 2h11.586l-3.293 3.293a1 1 0 0 0 1.414 1.414l5-5a1 1 0 0 0 0-1.414l-5-5Z" /></svg>
                        </span>
                    </Link>

                    <Link href="/login" className="noupe-button noupe-button-primary py-4 px-6 text-xl group bg-[#3B82F6] text-white rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center">
                        <span className="flex items-center gap-3 font-semibold">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M1 7.52V18a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V7.52l-9.28 6.496a3 3 0 0 1-3.44 0L1 7.521Zm21.881-2.358A3.001 3.001 0 0 0 20 3H4a3.001 3.001 0 0 0-2.881 2.162l10.308 7.216a1 1 0 0 0 1.146 0l10.308-7.216Z" /></svg>
                            Sign Up with an email
                            <svg className="w-6 h-6 pt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M14.707 6.293a1 1 0 1 0-1.414 1.414L16.586 11H5a1 1 0 1 0 0 2h11.586l-3.293 3.293a1 1 0 0 0 1.414 1.414l5-5a1 1 0 0 0 0-1.414l-5-5Z" /></svg>
                        </span>
                    </Link>
                </div>

                {/* Curved Arrow pointing to button */}
                <div className="absolute -bottom-16 left-32 hidden md:block">
                    <svg className="w-24 h-24 text-[#D200D3] rotate-12" viewBox="0 0 100 100" fill="none">
                        <path d="M80,10 Q50,50 20,40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrowhead2)" />
                        <defs>
                            <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                            </marker>
                        </defs>
                    </svg>
                </div>

                <p className="mt-8 text-[#94A3B8] font-semibold text-sm">It's free. No credit card required.</p>
            </div>

            <div className="flex justify-center lg:justify-end animate-in fade-in zoom-in-95 duration-1000">
                <ChatbotMockup />
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="relative bg-[#0B1120] text-white py-24 px-6 overflow-hidden">
        {/* Top Gradient Border */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/50 to-transparent"></div>

        {/* Background Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#3B82F6]/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12 text-center relative z-10">
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                {["Terms & Conditions", "Privacy Policy", "About Us", "Contact Us", "Pricing", "Embed Guide"].map(item => (
                    <Link key={item} href="#" className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors font-medium text-sm tracking-wide">{item}</Link>
                ))}
            </div>

            <div className="w-12 h-[2px] bg-[#1E293B] rounded-full"></div>

            <div className="max-w-3xl text-sm leading-relaxed text-[#64748B]">
                <span className="font-semibold text-[#F8FAFC]">Conversio AI</span> is a <Link href="#" className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors relative group">
                    free AI chatbot builder
                    <span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-[#3B82F6] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link> that creates AI chatbots in minutes, trusted by businesses worldwide. <br />
                &copy; {new Date().getFullYear()} Conversio AI. All rights reserved.
            </div>
        </div>
    </footer>
);

export default function LandingPage() {
    return (
        <div className="min-h-screen selection:bg-[#D200D3]/20 font-sans">
            <Head>
                <title>Conversio AI - Build Your AI Chatbot</title>
                <meta name="description" content="Build your own AI chatbot in minutes." />
            </Head>

            <header className="px-6 md:px-12 py-8 flex justify-between items-center relative md:sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/5">
                <Logo />
                <div className="flex items-center gap-6">
                    <nav className="hidden lg:flex items-center gap-10 mr-4">
                        {["Solutions", "Blog", "Pricing"].map(item => (
                            <Link key={item} href={item === "Pricing" ? "/pricing" : "#"} className="noupe-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-lg font-medium">{item}</Link>
                        ))}
                        <Link href="/login" className="noupe-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-lg font-medium">Login</Link>
                    </nav>
                    <Link href="/login" className="noupe-button noupe-button-primary px-6 py-3 text-md hidden md:flex bg-[#3B82F6] text-white rounded-full hover:bg-[#2563EB] hover:shadow-lg hover:shadow-blue-500/25 transition-all font-semibold">Sign Up for Free</Link>
                    <div className="w-10 h-10 bg-white/10 rounded-full md:flex hidden flex-col items-center justify-center gap-0.5 cursor-pointer hover:bg-white/20 transition-all">
                        <div className="w-4 h-[1px] bg-[#F8FAFC]"></div>
                        <div className="w-4 h-[1px] bg-[#F8FAFC] my-[1px]"></div>
                        <div className="w-4 h-[1px] bg-[#F8FAFC]"></div>
                    </div>
                </div>
            </header>

            <Hero />

            {/* ══════════════════════════════════════════════
               FEATURES SECTION
               ══════════════════════════════════════════════ */}
            <section className="bg-[#111827] text-white py-32 px-6 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 center w-full h-[500px] bg-gradient-to-b from-[#0F172A] to-transparent opacity-50 pointer-events-none" />

                <div className="max-w-[1100px] mx-auto text-center mb-20 relative z-10">
                    <h2 className="text-5xl md:text-[5rem] font-bold leading-[1.05] mb-6 text-[#F8FAFC] tracking-tight">
                        Key features that <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D200D3] to-[#F472B6] italic font-normal">power</span> your business
                    </h2>
                    <p className="text-xl md:text-2xl text-[#94A3B8] max-w-3xl mx-auto leading-relaxed">
                        Conversio is packed with customer service–ready features designed to reduce support workload while improving customer experience.
                    </p>
                </div>

                <div className="max-w-[1300px] mx-auto grid gap-8 md:grid-cols-2">
                    <FeatureCard
                        title="Learns from your website content"
                        description="Conversio reads your public pages and builds an answer base automatically."
                        image="noupe_learn_website_content.png"
                        fullWidth
                    />
                    <FeatureCard
                        title="Instant setup, no coding"
                        description="Grab your embed code and drop it into your site. That's all Conversio needs to get to work."
                        image="noupe_embed_setup.png"
                    />
                    <FeatureCard
                        title="Knowledge Base"
                        description="Train Conversio with your own content. Add documents and Q&A so your Conversio can answer with your knowledge."
                        image="noupe_knowledge_base.png"
                    />
                    <FeatureCard
                        title="Customization Options"
                        description="Make Conversio fit your site. Adjust size, alignment, color and avatar for a seamless look."
                        image="noupe_custom_branding.png"
                    />
                    <FeatureCard
                        title="Custom First Message"
                        description="Set a custom first message that greets visitors in your tone. Make Conversio’s first impression feel just like your own."
                        image="noupe_custom_first_message.png"
                    />
                    <FeatureCard
                        title="Get conversations"
                        description="Every conversation is sent to your inbox in real time. See what customers ask and follow up fast."
                        image="noupe_conversation_mail.png"
                        bgClass="bg-[#10B981]/[0.05] border-green-500/10 hover:border-green-500/20"
                    />
                    <FeatureCard
                        title="Multi-Language support"
                        description="Conversio detects each visitor's language and answers automatically."
                        image="noupe_multi_language_support.png"
                        bgClass="bg-[#F43F5E]/[0.05] border-rose-500/10 hover:border-rose-500/20"
                    />
                </div>
            </section>

            {/* ══════════════════════════════════════════════
               BENEFITS / WHY LOVE SECTION
               ══════════════════════════════════════════════ */}
            <section className="py-32 px-6 max-w-[1200px] mx-auto text-center">
                <h2 className="text-4xl md:text-6xl font-bold mb-16 tracking-tight">
                    Why you will <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D200D3] to-[#F472B6] italic font-normal">love Conversio</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {[
                        { text: "Launches in minutes — no code, no training", icon: "rocket" },
                        { text: "Works in every language, on any website", icon: "globe" },
                        { text: "Sends conversations directly to your inbox", icon: "mail" },
                        { text: "100% free until 2026", icon: "gift" }
                    ].map((item, idx) => (
                        <div key={idx} className="group bg-[#1E293B] p-8 rounded-[2rem] flex items-center gap-6 shadow-sm hover:shadow-xl hover:shadow-purple-900/10 hover:-translate-y-1 transition-all duration-300 text-left border border-white/5 hover:border-purple-500/20">
                            <div className="w-16 h-16 bg-[#F3E6F5] rounded-2xl flex items-center justify-center shrink-0 text-[#D200D3] group-hover:scale-110 transition-transform duration-300">
                                {item.icon === "rocket" && <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>}
                                {item.icon === "globe" && <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>}
                                {item.icon === "mail" && <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>}
                                {item.icon === "gift" && <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15h-2v-2h2v2zm0-4h-2v-2h2v2zm-4 4H8v-2h8v2zm0-4H8v-2h8v2zm-8 4H4v-2h2v2zm0-4H4v-2h2v2zm-6-6v-2h16v2H2z" /></svg>}
                            </div>
                            <span className="text-xl font-bold text-[#F8FAFC] tracking-tight">{item.text}</span>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
