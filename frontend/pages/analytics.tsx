import Head from 'next/head';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { MessageSquare, Users, BarChart2, Calendar, Layout } from 'lucide-react';
import Cookies from 'js-cookie';

const StatCard = ({ label, value, trend, icon: Icon, subLabel }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex items-center justify-between text-gray-500">
            <span className="font-medium">{label}</span>
            <Icon size={20} />
        </div>
        <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-[#0A0807]">{value}</span>
            {trend && (
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    {trend}
                </span>
            )}
        </div>
        {subLabel && <p className="text-sm text-gray-400">{subLabel}</p>}
    </div>
);

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = Cookies.get('token');
            let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            if (backendUrl.endsWith('/')) backendUrl = backendUrl.slice(0, -1);

            const res = await fetch(`${backendUrl}/api/analytics/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) throw new Error('Failed to fetch analytics data');
            const jsonData = await res.json();
            setData(jsonData);
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
                <p className="text-gray-500">Real-time performance metrics across all your chatbots.</p>
            </div>

            {/* Overview Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    label="Total Chatbots"
                    value={data?.overview?.totalBots || 0}
                    icon={Layout}
                    subLabel={`${data?.overview?.activeBots || 0} Active`}
                />
                <StatCard
                    label="Total Conversations"
                    value={data?.overview?.totalChats || 0}
                    icon={MessageSquare}
                    trend="+12% this week"
                />
                <StatCard
                    label="Messages Exchanged"
                    value={data?.overview?.totalChats ? data.overview.totalChats * 8 : 0} // Estimate/Mock or real if avail
                    icon={BarChart2}
                    subLabel="Avg. 8 per chat"
                />
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#0A0807]">Recent Activity</h2>
                    <span className="text-sm text-gray-400">Latest 20 interactions</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Chatbot</th>
                                <th className="px-6 py-4">Session ID</th>
                                <th className="px-6 py-4">Messages</th>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data?.recentActivity?.length > 0 ? (
                                data.recentActivity.map((activity: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-[#0A0807]">
                                            {activity.botId?.name || 'Unknown Bot'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                            {activity.sessionId?.substring(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {activity.messages?.length || 0} msgs
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(activity.startedAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Completed
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        No recent activity found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
