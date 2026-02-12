import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { MessageSquare, TrendingUp, Plus, ArrowRight, Settings, BarChart2 } from 'lucide-react';

// Inline simple components for restoration speed
const StatCard = ({ label, value, trend, icon: Icon }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex items-center justify-between text-gray-500">
            <span className="font-medium">{label}</span>
            <Icon size={20} />
        </div>
        <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-[#0A0807]">{value}</span>
            {trend && <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">{trend}</span>}
        </div>
    </div>
);

const RecentBotItem = ({ bot }: any) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0A0807] to-gray-700 text-white flex items-center justify-center font-bold">
                {bot.avatar ? bot.avatar : bot.name.charAt(0)}
            </div>
            <div>
                <h3 className="font-semibold text-gray-900">{bot.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={`w-2 h-2 rounded-full ${bot.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    {bot.isActive ? 'Active' : 'Inactive'}
                </div>
            </div>
        </div>
        <Link href={`/edit-bot?id=${bot.id}`} className="p-2 text-gray-400 hover:text-[#0A0807] hover:bg-gray-50 rounded-lg transition-all">
            <Settings size={18} />
        </Link>
    </div>
);

export default function Dashboard() {
    // Mock data for initial restoration
    const [stats, setStats] = useState({ totalBots: 0, activeBots: 0, totalChats: 0 });
    const [recentBots, setRecentBots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data
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
                <div className="animate-spin w-8 h-8 border-2 border-[#0A0807] border-t-transparent rounded-full"></div>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <Head>
                <title>Dashboard - Noupe</title>
            </Head>

            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0A0807]">Welcome Back! 👋</h1>
                    <p className="text-gray-500">Here's what's happening with your bots today.</p>
                </div>
                <Link href="/builder" className="bg-[#0A0807] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
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
                        <h2 className="text-lg font-bold text-gray-900">Recent Bots</h2>
                        <Link href="/bots" className="text-sm font-medium text-[#0A0807] hover:underline flex items-center gap-1">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentBots.length > 0 ? (
                            recentBots.map(bot => <RecentBotItem key={bot.id} bot={bot} />)
                        ) : (
                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-500">No chatbots yet. Create one to get started!</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
                    <div className="grid gap-4">
                        <Link href="/bots" className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MessageSquare size={20} />
                            </div>
                            <span className="font-semibold text-gray-700">My Chatbots</span>
                        </Link>
                        <Link href="/analytics" className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BarChart2 size={20} />
                            </div>
                            <span className="font-semibold text-gray-700">Analytics</span>
                        </Link>
                        <Link href="/settings" className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Settings size={20} />
                            </div>
                            <span className="font-semibold text-gray-700">Settings</span>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
