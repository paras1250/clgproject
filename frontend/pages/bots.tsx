import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import DashboardLayout from '../components/DashboardLayout';
import { MessageSquare, Plus, Settings, BarChart3 } from 'lucide-react';
import { botsAPI } from '../lib/api';

const BotCard = ({ bot }: any) => (
    <div className="premium-card p-6 flex flex-col gap-6 group hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-start justify-between">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00F5D4]/20 to-[#3A86FF]/10 flex items-center justify-center text-xl font-black text-[#00F5D4] border border-[#00F5D4]/20 shadow-inner group-hover:scale-110 transition-transform overflow-hidden">
                {(() => {
                    const avatar = bot.widgetCustomization?.avatar || bot.avatar;
                    const isImageUrl = avatar && (
                        avatar.startsWith('/') || 
                        avatar.startsWith('http') || 
                        avatar.includes('.') || 
                        avatar.length > 5
                    );
                    
                    if (avatar) {
                        return isImageUrl ? (
                            <img src={avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl">{avatar}</span>
                        );
                    }
                    return bot.name.charAt(0).toUpperCase();
                })()}
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${bot.isActive !== false ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'bg-white/5 text-[#64748B] border border-white/10'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${bot.isActive !== false ? 'bg-[#10B981] animate-pulse' : 'bg-[#64748B]'}`} />
                {bot.isActive !== false ? 'Active' : 'Inactive'}
            </div>
        </div>

        <div className="flex-1">
            <h3 className="font-sora text-xl font-bold text-[#F1F5F9] mb-2 group-hover:text-[#00F5D4] transition-colors">{bot.name}</h3>
            <p className="text-[#94A3B8] text-sm line-clamp-2 leading-relaxed font-inter">{bot.description || 'No description provided.'}</p>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
            <Link href={`/edit-bot?id=${bot._id || bot.id}`} className="flex-1 bg-white/[0.03] border border-white/[0.08] text-[#F1F5F9] py-2.5 rounded-xl text-sm font-bold hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 font-inter">
                <Settings size={16} />
                Configure
            </Link>
            <Link href={`/analytics?id=${bot._id || bot.id}`} className="p-2.5 rounded-xl bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/20 hover:bg-[#00F5D4]/20 transition-all">
                <BarChart3 size={18} />
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

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-sora text-2xl font-bold text-[#F1F5F9]">My Chatbots</h1>
                    <p className="text-[#94A3B8] font-inter text-sm">Manage and monitor all your AI agents.</p>
                </div>
                <Link href="/builder" className="w-full sm:w-auto bg-[#00F5D4] text-[#0A0F1C] px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#00D9C0] transition-all shadow-lg shadow-[#00F5D4]/15 font-inter tracking-wide text-sm">
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
