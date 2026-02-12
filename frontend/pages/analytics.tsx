import Head from 'next/head';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { BarChart3, Users, MessageCircle, Clock, TrendingUp } from 'lucide-react';
import Cookies from 'js-cookie';

const StatCard = ({ label, value, trend, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">{label}</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color || 'bg-gray-100'}`}>
                <Icon size={20} className="text-white" />
            </div>
        </div>
        <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-[#0A0807]">{value}</span>
            {trend && (
                <span className={`text-sm font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                    <TrendingUp size={14} />
                    {trend}
                </span>
            )}
        </div>
    </div>
);

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState<any>(null);
    const [bots, setBots] = useState<any[]>([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = Cookies.get('token');
            let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            if (backendUrl.endsWith('/')) backendUrl = backendUrl.slice(0, -1);

            const [analyticsRes, botsRes] = await Promise.all([
                fetch(`${backendUrl}/api/analytics/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                }),
                fetch(`${backendUrl}/api/bots/list`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                })
            ]);

            if (!analyticsRes.ok) throw new Error('Failed to fetch analytics data');

            const analyticsData = await analyticsRes.json();
            setData(analyticsData);

            if (botsRes.ok) {
                const botsData = await botsRes.json();
                setBots(botsData.bots || botsData || []);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="animate-spin w-8 h-8 border-2 border-[#0A0807] border-t-transparent rounded-full"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={fetchAnalytics} className="text-[#0A0807] underline font-medium">Try Again</button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Head>
                <title>Analytics - Conversio AI</title>
            </Head>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#0A0807]">Analytics Dashboard</h1>
                <p className="text-gray-500">Monitor performance across all your chatbots.</p>
            </div>

            {/* 2x2 Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                    label="Total Bots"
                    value={data?.overview?.totalBots || 0}
                    trend="+12.5%"
                    icon={BarChart3}
                    color="bg-blue-500"
                />
                <StatCard
                    label="Active Users"
                    value={data?.overview?.activeBots || 0}
                    trend="+8.2%"
                    icon={Users}
                    color="bg-green-500"
                />
                <StatCard
                    label="Total Messages"
                    value={data?.overview?.totalChats || 0}
                    trend="+24.5%"
                    icon={MessageCircle}
                    color="bg-purple-500"
                />
                <StatCard
                    label="Avg Response Time"
                    value="1.2s"
                    trend="-5.1%"
                    icon={Clock}
                    color="bg-orange-500"
                />
            </div>

            {/* Top Performing Bots */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-[#0A0807]">Top Performing Bots</h2>
                    <p className="text-sm text-gray-400">Ranked by conversation count</p>
                </div>

                <div className="divide-y divide-gray-100">
                    {bots.length > 0 ? (
                        bots.slice(0, 5).map((bot: any, idx: number) => (
                            <div key={bot._id || bot.id || idx} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                        {bot.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#0A0807]">{bot.name}</p>
                                        <p className="text-sm text-gray-400">
                                            {bot.isActive ? 'Active' : 'Inactive'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#0A0807]">{bot.conversationCount || 0}</p>
                                    <p className="text-xs text-gray-400">conversations</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-6 py-12 text-center text-gray-400">
                            <MessageCircle size={32} className="mx-auto mb-3 text-gray-300" />
                            <p>No chatbots created yet.</p>
                            <p className="text-sm mt-1">Create your first bot to see analytics here.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
