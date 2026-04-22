import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import DashboardLayout from '../components/DashboardLayout';
import { Plus, Paperclip, ArrowUp, MoreHorizontal, ArrowRight, Sparkles, Zap, Globe, BarChart3, Bot } from 'lucide-react';
import { botsAPI } from '../lib/api';

/* ─── Bot Card ─── */
const BotCard = ({ bot }: { bot: any }) => {
    const initial = bot.name?.charAt(0)?.toUpperCase() || '?';
    const updated = bot.updatedAt
        ? new Date(bot.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'Recently';

    // Avatar logic: Handle both emojis and URLs
    const botAvatar = bot.widgetCustomization?.avatar || bot.widgetCustomization?.widgetAvatar;
    const isImageUrl = botAvatar && (
        botAvatar.startsWith('/') || 
        botAvatar.startsWith('http') || 
        botAvatar.includes('.') || 
        botAvatar.length > 5
    );

    return (
        <div className="premium-card p-5 flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00F5D4]/20 to-[#3A86FF]/10 flex items-center justify-center text-lg font-black text-[#00F5D4] border border-[#00F5D4]/20 shadow-inner group-hover:scale-110 transition-transform overflow-hidden">
                    {botAvatar ? (
                        isImageUrl ? (
                            <img src={botAvatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xl">{botAvatar}</span>
                        )
                    ) : (
                        initial
                    )}
                </div>
                <button className="p-2 rounded-xl text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/[0.06] transition-all">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            <div className="flex-1 min-w-0">
                <Link href={`/edit-bot?id=${bot._id || bot.id}`} className="block">
                    <h3 className="font-sora font-bold text-[#F1F5F9] text-base truncate mb-1 group-hover:text-[#00F5D4] transition-colors tracking-tight">
                        {bot.name}
                    </h3>
                </Link>
                {bot.description ? (
                    <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed font-inter">{bot.description}</p>
                ) : (
                    <p className="text-xs text-[#64748B] italic font-inter">No description provided</p>
                )}
            </div>

            <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${bot.isActive !== false ? 'bg-[#10B981]' : 'bg-[#64748B]'}`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${bot.isActive !== false ? 'bg-[#10B981]' : 'bg-[#64748B]'}`}></span>
                    </div>
                    <span className="text-[11px] font-bold text-[#F1F5F9] uppercase tracking-wider">{bot.isActive !== false ? 'Active' : 'Inactive'}</span>
                </div>
                <span className="text-[10px] font-medium text-[#64748B]">{updated}</span>
            </div>
        </div>
    );
};

/* ─── Create Card ─── */
const CreateNewCard = () => (
    <Link href="/builder" className="premium-card p-5 flex flex-col items-center justify-center gap-3 min-h-[180px] border-dashed !border-white/[0.1] hover:!border-[#00F5D4]/40 group hover:-translate-y-1 transition-all duration-300 bg-white/[0.01]">
        <div className="w-14 h-14 rounded-2xl bg-[#00F5D4]/10 border border-[#00F5D4]/20 flex items-center justify-center text-[#00F5D4] group-hover:scale-110 group-hover:bg-[#00F5D4]/20 transition-all shadow-lg shadow-[#00F5D4]/5">
            <Plus size={28} strokeWidth={2.5} />
        </div>
        <div className="text-center">
            <span className="block text-sm font-bold text-[#F1F5F9] group-hover:text-[#00F5D4] transition-colors">Create Chatbot</span>
            <span className="text-[10px] text-[#64748B]">Start from scratch</span>
        </div>
    </Link>
);

/* ─── Quick Action ─── */
const QuickAction = ({ icon: Icon, label, color, href }: any) => (
    <Link href={href || '/builder'} className="premium-card px-5 py-4 flex items-center gap-4 group hover:bg-white/[0.04] transition-all">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${color}`}>
            <Icon size={20} />
        </div>
        <span className="text-sm font-bold text-[#F1F5F9] tracking-tight">{label}</span>
        <ArrowRight size={14} className="ml-auto text-[#64748B] group-hover:text-[#F1F5F9] group-hover:translate-x-1 transition-all" />
    </Link>
);

/* ─── Dashboard Page ─── */
export default function Dashboard() {
    const router = useRouter();
    const [bots, setBots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const data = await botsAPI.list().catch(() => ({ bots: [] }));
                setBots(data.bots || []);
            } catch (error) {
                console.error('Failed to fetch bots:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handlePromptSubmit = () => {
        if (prompt.trim()) {
            router.push(`/builder?prompt=${encodeURIComponent(prompt.trim())}`);
        } else {
            router.push('/builder');
        }
    };

    if (loading) return (
        <DashboardLayout>
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#00F5D4]/20 border-t-[#00F5D4] rounded-full animate-spin" />
                    <span className="text-sm font-medium text-[#64748B] tracking-widest uppercase">Initializing Workspace</span>
                </div>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <Head>
                <title>Dashboard - Conversio AI</title>
            </Head>

            <div className="animate-fade-in space-y-12">
                {/* ─── Hero Heading ─── */}
                <div className="text-center space-y-3 pt-4">
                    <h1 className="font-sora text-3xl md:text-4xl lg:text-5xl font-black text-[#F1F5F9] tracking-tight">
                        What will you <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] to-[#3A86FF]">build</span> today?
                    </h1>
                    <p className="text-base text-[#94A3B8] font-inter max-w-xl mx-auto leading-relaxed">
                        The most powerful way to build, deploy, and manage custom AI agents for your business.
                    </p>
                </div>

                {/* ─── Prompt Input ─── */}
                <div className="max-w-3xl mx-auto">
                    <div className="bg-[#121826]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-2 shadow-2xl shadow-[#00F5D4]/5 group focus-within:border-[#00F5D4]/40 transition-all">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe a chatbot you would like to create (e.g., 'A support bot for a bakery')..."
                            rows={3}
                            className="w-full bg-transparent px-6 py-4 text-base text-[#F1F5F9] placeholder:text-[#64748B] resize-none focus:outline-none font-inter"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handlePromptSubmit();
                                }
                            }}
                        />
                        <div className="flex items-center justify-between px-4 pb-3">
                            <div className="flex items-center gap-2">
                                <button className="p-2.5 rounded-xl text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/[0.06] transition-all">
                                    <Paperclip size={20} />
                                </button>
                                <button className="p-2.5 rounded-xl text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/[0.06] transition-all">
                                    <Zap size={20} />
                                </button>
                            </div>
                            <button
                                onClick={handlePromptSubmit}
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#00F5D4] hover:bg-[#00D9C0] text-[#0A0F1C] font-black text-sm transition-all shadow-lg shadow-[#00F5D4]/20 hover:shadow-[#00F5D4]/40 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <span>GENERATE</span>
                                <ArrowUp size={18} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ─── Recent Bots ─── */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-[#00F5D4] rounded-full" />
                            <h2 className="font-sora text-xl font-bold text-[#F1F5F9] tracking-tight">Recent Projects</h2>
                        </div>
                        {bots.length > 0 && (
                            <Link href="/bots" className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-bold text-[#F1F5F9] hover:bg-white/[0.08] flex items-center gap-2 transition-all">
                                View all <ArrowRight size={14} />
                            </Link>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <CreateNewCard />
                        {bots.slice(0, 7).map((bot: any) => (
                            <BotCard key={bot._id || bot.id} bot={bot} />
                        ))}
                    </div>

                    {bots.length === 0 && (
                        <div className="mt-6 text-center py-16 bg-[#121826]/40 border-2 border-dashed border-white/[0.06] rounded-3xl">
                            <Bot className="w-12 h-12 text-[#64748B] mx-auto mb-4 opacity-20" />
                            <p className="text-sm font-medium text-[#64748B] font-inter">No bots yet. Describe your idea above to begin.</p>
                        </div>
                    )}
                </section>

                {/* ─── Quick Actions ─── */}
                <section className="pb-10">
                    <h2 className="font-sora text-xl font-bold text-[#F1F5F9] mb-6 tracking-tight flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#3A86FF] rounded-full" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <QuickAction icon={Sparkles} label="New Assistant" color="bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/20 shadow-[0_0_15px_rgba(0,245,212,0.1)]" href="/builder" />
                        <QuickAction icon={Globe} label="Deploy Channel" color="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" href="/bots" />
                        <QuickAction icon={BarChart3} label="View Analytics" color="bg-[#3A86FF]/10 text-[#3A86FF] border border-[#3A86FF]/20 shadow-[0_0_15px_rgba(58,134,255,0.1)]" href="/analytics" />
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}
