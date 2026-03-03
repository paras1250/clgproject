import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import DashboardLayout from '../components/DashboardLayout';
import { MessageSquare, Plus, Settings } from 'lucide-react';
import { botsAPI } from '../lib/api';

const BotCard = ({ bot }: any) => (
    <div className="bg-[#121826] p-6 rounded-2xl border border-white/[0.06] hover:border-white/[0.1] transition-all flex flex-col justify-between gap-6">
        <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00F5D4] to-[#3A86FF] text-[#0A0F1C] flex items-center justify-center font-bold text-xl">
                {bot.avatar ? bot.avatar : bot.name.charAt(0)}
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${bot.isActive ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-white/5 text-[#64748B]'}`}>
                {bot.isActive ? 'Active' : 'Inactive'}
            </div>
        </div>

        <div>
            <h3 className="font-sora text-lg font-bold text-[#F1F5F9] mb-1">{bot.name}</h3>
            <p className="text-[#94A3B8] text-sm line-clamp-2 font-inter">{bot.description || 'No description provided.'}</p>
        </div>

        <div className="flex items-center gap-2 mt-auto">
            <Link href={`/edit-bot?id=${bot.id}`} className="flex-1 bg-white/5 border border-white/[0.08] text-[#F1F5F9] py-2.5 rounded-xl font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2 font-inter">
                <Settings size={16} />
                Configure
            </Link>
        </div>
    </div>
);

export default function Bots() {
    const router = useRouter();
    const [bots, setBots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBots = async () => {
            const token = Cookies.get('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const data = await botsAPI.list();
                setBots(data.bots || []);
            } catch (error) {
                console.error('Failed to fetch bots:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBots();
    }, [router]);

    return (
        <DashboardLayout>
            <Head>
                <title>My Chatbots - Conversio AI</title>
            </Head>

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="font-sora text-2xl font-bold text-[#F1F5F9]">My Chatbots</h1>
                    <p className="text-[#94A3B8] font-inter">Manage and monitor all your AI agents.</p>
                </div>
                <Link href="/builder" className="bg-[#00F5D4] text-[#0A0F1C] px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-[#00D9C0] transition-all shadow-lg shadow-[#00F5D4]/15 font-inter tracking-wide">
                    <Plus size={18} />
                    <span>Create New Bot</span>
                </Link>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-[#121826] rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : bots.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bots.map(bot => <BotCard key={bot.id} bot={bot} />)}

                    <Link href="/builder" className="bg-[#121826]/50 border-2 border-dashed border-white/[0.06] rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-[#00F5D4]/30 hover:bg-[#121826] transition-all cursor-pointer min-h-[250px] group">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-[#64748B] group-hover:text-[#00F5D4] transition-colors">
                            <Plus size={24} />
                        </div>
                        <span className="font-semibold text-[#94A3B8] group-hover:text-[#00F5D4] font-inter">Create New Bot</span>
                    </Link>
                </div>
            ) : (
                <div className="text-center py-24 bg-[#121826] rounded-2xl border border-dashed border-white/[0.06]">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[#64748B]">
                        <MessageSquare size={32} />
                    </div>
                    <h3 className="font-sora text-lg font-bold text-[#F1F5F9] mb-2">No chatbots yet</h3>
                    <p className="text-[#94A3B8] mb-6 max-w-sm mx-auto font-inter">Create your first AI chatbot to start engaging with your visitors automatically.</p>
                    <Link href="/builder" className="bg-[#00F5D4] text-[#0A0F1C] px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-[#00D9C0] transition-all shadow-lg shadow-[#00F5D4]/15 font-inter tracking-wide">
                        <Plus size={18} />
                        Create Your First Bot
                    </Link>
                </div>
            )}
        </DashboardLayout>
    );
}
