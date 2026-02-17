import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { MessageSquare, TrendingUp, Plus, ArrowRight, Settings, BarChart2 } from 'lucide-react';

const StatCard = ({ label, value, trend, icon: Icon }: any) => (
    <div className="bg-[#1E293B] p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
        <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="font-medium">{label}</span>
            <Icon size={20} />
        </div>
        <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-[#F8FAFC]">{value}</span>
            {trend && <span className="text-[#10B981] text-sm font-medium bg-[#10B981]/10 px-2 py-1 rounded-full">{trend}</span>}
        </div>
    </div>
);

const RecentBotItem = ({ bot }: any) => (
    <div className="flex items-center justify-between p-4 bg-[#1E293B] rounded-xl border border-white/10 hover:border-white/20 transition-all">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#22D3EE] text-white flex items-center justify-center font-bold">
                {bot.avatar ? bot.avatar : bot.name.charAt(0)}
            </div>
            <div>
                <h3 className="font-semibold text-[#F8FAFC]">{bot.name}</h3>
                <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                    <span className={`w-2 h-2 rounded-full ${bot.isActive ? 'bg-[#10B981]' : 'bg-[#64748B]'}`}></span>
                    {bot.isActive ? 'Active' : 'Inactive'}
                </div>
            </div>
        </div>
        <Link href={`/edit-bot?id=${bot.id}`} className="p-2 text-[#64748B] hover:text-[#3B82F6] hover:bg-white/5 rounded-lg transition-all">
            <Settings size={18} />
        </Link>
    </div>
);

export default function Dashboard() {
    const [stats, setStats] = useState({ totalBots: 0, activeBots: 0, totalChats: 0 });
    const [recentBots, setRecentBots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setStats({ totalBots: 3, activeBots: 2, totalChats: 1240 });
            setRecentBots([
                { id: '1', name: 'Customer Support', isActive: true, avatar: '🎧' },
                { id: '2', name: 'Sales Assistant', isActive: true, avatar: '💼' },
                { id: '3', name: 'Internal HR', isActive: false, avatar: '👥' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return (
        <DashboardLayout>
            <div className="flex items-center justify-center h-[80vh]">
                <div className="animate-spin w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full"></div>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <Head>
                <title>Dashboard - Conversio AI</title>
            </Head>

            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#F8FAFC]">Welcome Back! 👋</h1>
                    <p className="text-[#94A3B8]">Here's what's happening with your bots today.</p>
                </div>
                <Link href="/builder" className="bg-[#3B82F6] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-[#2563EB] transition-all shadow-lg shadow-blue-500/20">
                    <Plus size={18} />
                    <span>Create New Bot</span>
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <StatCard label="Total Bots" value={stats.totalBots} icon={MessageSquare} />
                <StatCard label="Active Bots" value={stats.activeBots} trend="+12.5%" icon={TrendingUp} />
                <StatCard label="Total Conversations" value={stats.totalChats} trend="+5.2%" icon={BarChart2} />
            </div>

            <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[#F8FAFC]">Recent Bots</h2>
                        <Link href="/bots" className="text-sm font-medium text-[#3B82F6] hover:text-[#22D3EE] flex items-center gap-1 transition-colors">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentBots.length > 0 ? (
                            recentBots.map(bot => <RecentBotItem key={bot.id} bot={bot} />)
                        ) : (
                            <div className="text-center py-12 bg-[#1E293B] rounded-2xl border border-dashed border-white/10">
                                <p className="text-[#94A3B8]">No chatbots yet. Create one to get started!</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-[#F8FAFC]">Quick Actions</h2>
                    <div className="grid gap-4">
                        <Link href="/bots" className="p-4 bg-[#1E293B] border border-white/10 rounded-xl hover:border-white/20 transition-all flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-[#3B82F6]/10 text-[#3B82F6] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MessageSquare size={20} />
                            </div>
                            <span className="font-semibold text-[#F8FAFC]">My Chatbots</span>
                        </Link>
                        <Link href="/analytics" className="p-4 bg-[#1E293B] border border-white/10 rounded-xl hover:border-white/20 transition-all flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-[#22D3EE]/10 text-[#22D3EE] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BarChart2 size={20} />
                            </div>
                            <span className="font-semibold text-[#F8FAFC]">Analytics</span>
                        </Link>
                        <Link href="/settings" className="p-4 bg-[#1E293B] border border-white/10 rounded-xl hover:border-white/20 transition-all flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-white/5 text-[#94A3B8] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Settings size={20} />
                            </div>
                            <span className="font-semibold text-[#F8FAFC]">Settings</span>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
