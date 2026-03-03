import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import DashboardLayout from '../components/DashboardLayout';
import { Plus, Paperclip, ArrowUp, MoreHorizontal, ArrowRight, Sparkles, Zap, Globe } from 'lucide-react';
import { botsAPI } from '../lib/api';

/* ─── Bot Card ─── */
const BotCard = ({ bot }: { bot: any }) => {
    const initial = bot.name?.charAt(0)?.toUpperCase() || '?';
    const updated = bot.updatedAt
        ? new Date(bot.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'Recently';

    return (
        <div className="dashboard-card p-4 flex flex-col gap-3 group">
            <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F5D4]/15 to-[#3A86FF]/10 flex items-center justify-center text-sm font-bold text-[#00F5D4] border border-[#00F5D4]/15">
                    {initial}
                </div>
                <button className="p-1.5 rounded-lg text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            <div className="flex-1 min-w-0">
                <Link href={`/edit-bot?id=${bot._id || bot.id}`} className="block">
                    <h3 className="font-sora font-semibold text-[#F1F5F9] text-sm truncate mb-0.5 hover:text-[#00F5D4] transition-colors">
                        {bot.name}
                    </h3>
                </Link>
                {bot.description && (
                    <p className="text-xs text-[#64748B] line-clamp-2">{bot.description}</p>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${bot.isActive !== false ? 'bg-[#10B981]' : 'bg-[#64748B]'}`} />
                    <span className="text-[11px] text-[#94A3B8]">{bot.isActive !== false ? 'Active' : 'Inactive'}</span>
                </div>
                <span className="text-[11px] text-[#64748B]">{updated}</span>
            </div>
        </div>
    );
};

/* ─── Create Card ─── */
const CreateNewCard = () => (
    <Link href="/builder" className="dashboard-card p-4 flex flex-col items-center justify-center gap-2 min-h-[140px] border-dashed !border-white/[0.08] hover:!border-[#00F5D4]/25 group">
        <div className="w-10 h-10 rounded-xl bg-[#00F5D4]/8 flex items-center justify-center text-[#00F5D4] group-hover:scale-110 transition-transform">
            <Plus size={20} />
        </div>
        <span className="text-sm font-semibold text-[#94A3B8] group-hover:text-[#F1F5F9] transition-colors">Create new</span>
    </Link>
);

/* ─── Quick Action ─── */
const QuickAction = ({ icon: Icon, label, color, href }: any) => (
    <Link href={href || '/builder'} className="dashboard-card px-4 py-3 flex items-center gap-2.5 group">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
            <Icon size={16} />
        </div>
        <span className="text-sm font-medium text-[#F1F5F9]">{label}</span>
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
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin w-8 h-8 border-2 border-[#00F5D4] border-t-transparent rounded-full" />
                    <span className="text-sm text-[#64748B]">Loading workspace...</span>
                </div>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <Head>
                <title>Dashboard - Conversio AI</title>
            </Head>

            <div className="animate-fade-in">
                {/* ─── Hero Heading ─── */}
                <div className="text-center pt-4 pb-6 lg:pt-8 lg:pb-8">
                    <h1 className="font-sora text-2xl md:text-3xl font-bold text-[#F1F5F9] mb-1.5 tracking-tight">
                        What are you building today?
                    </h1>
                    <p className="text-sm text-[#64748B] font-inter">
                        Describe a chatbot or start a new project with AI.
                    </p>
                </div>

                {/* ─── Prompt Input ─── */}
                <div className="max-w-2xl mx-auto mb-10">
                    <div className="prompt-input p-1.5">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe a chatbot you would like to create..."
                            rows={2}
                            className="w-full bg-transparent px-4 py-3 text-sm text-[#F1F5F9] placeholder:text-[#64748B] resize-none focus:outline-none font-inter"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handlePromptSubmit();
                                }
                            }}
                        />
                        <div className="flex items-center justify-between px-3 pb-2">
                            <div className="flex items-center gap-1">
                                <button className="p-2 rounded-lg text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/[0.06] transition-all">
                                    <Paperclip size={16} />
                                </button>
                            </div>
                            <button
                                onClick={handlePromptSubmit}
                                className="w-8 h-8 rounded-full bg-[#00F5D4] hover:bg-[#00D9C0] text-[#0A0F1C] flex items-center justify-center transition-all shadow-lg shadow-[#00F5D4]/15 hover:shadow-[#00F5D4]/25"
                            >
                                <ArrowUp size={16} />
                            </button>
                        </div>
                    </div>
                    <p className="text-[11px] text-[#64748B] text-center mt-2 font-inter">AI can make mistakes. Please verify important information.</p>
                </div>

                {/* ─── Recent Bots ─── */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-sora text-lg font-bold text-[#F1F5F9]">Recent Bots</h2>
                        {bots.length > 0 && (
                            <Link href="/bots" className="text-xs font-medium text-[#00F5D4] hover:text-[#00D9C0] flex items-center gap-1 transition-colors">
                                View all <ArrowRight size={12} />
                            </Link>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        <CreateNewCard />
                        {bots.slice(0, 7).map((bot: any) => (
                            <BotCard key={bot._id || bot.id} bot={bot} />
                        ))}
                    </div>

                    {bots.length === 0 && (
                        <div className="mt-4 text-center py-8 dashboard-card border-dashed !border-white/[0.06]">
                            <p className="text-sm text-[#64748B]">No bots yet. Create your first chatbot to get started!</p>
                        </div>
                    )}
                </div>

                {/* ─── Quick Actions ─── */}
                <div className="mb-8">
                    <h2 className="font-sora text-lg font-bold text-[#F1F5F9] mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <QuickAction icon={Sparkles} label="Generate" color="bg-[#00F5D4]/10 text-[#00F5D4]" href="/builder" />
                        <QuickAction icon={Globe} label="Deploy" color="bg-[#10B981]/10 text-[#10B981]" href="/bots" />
                        <QuickAction icon={Zap} label="Analyze" color="bg-[#3A86FF]/10 text-[#3A86FF]" href="/analytics" />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
