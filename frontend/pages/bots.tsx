import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { MessageSquare, Plus, Settings } from 'lucide-react';

const BotCard = ({ bot }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between gap-6">
        <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0A0807] to-gray-700 text-white flex items-center justify-center font-bold text-xl">
                {bot.avatar ? bot.avatar : bot.name.charAt(0)}
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${bot.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {bot.isActive ? 'Active' : 'Inactive'}
            </div>
        </div>

        <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{bot.name}</h3>
            <p className="text-gray-500 text-sm line-clamp-2">{bot.description || 'No description provided.'}</p>
        </div>

        <div className="flex items-center gap-2 mt-auto">
            <Link href={`/edit-bot?id=${bot.id}`} className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <Settings size={16} />
                Configure
            </Link>
        </div>
    </div>
);

export default function Bots() {
    const [bots, setBots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data
        setTimeout(() => {
            setBots([
                { id: '1', name: 'Customer Support', isActive: true, avatar: '🎧', description: 'Handles general customer inquiries and support tickets.' },
                { id: '2', name: 'Sales Assistant', isActive: true, avatar: '💼', description: 'Helps customers find products and generate leads.' },
                { id: '3', name: 'Internal HR', isActive: false, avatar: '👥', description: 'Answers employee questions about policies and benefits.' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <DashboardLayout>
            <Head>
                <title>My Chatbots - Noupe</title>
            </Head>

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#0A0807]">My Chatbots</h1>
                    <p className="text-gray-500">Manage and monitor all your AI agents.</p>
                </div>
                <Link href="/builder" className="bg-[#0A0807] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
                    <Plus size={18} />
                    <span>Create New Bot</span>
                </Link>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : bots.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bots.map(bot => <BotCard key={bot.id} bot={bot} />)}

                    <Link href="/builder" className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-[#0A0807] hover:bg-gray-100 transition-all cursor-pointer min-h-[250px] group">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:text-[#0A0807] transition-colors">
                            <Plus size={24} />
                        </div>
                        <span className="font-semibold text-gray-500 group-hover:text-[#0A0807]">Create New Bot</span>
                    </Link>
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <MessageSquare size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No chatbots yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">Create your first AI chatbot to start engaging with your visitors automatically.</p>
                    <Link href="/builder" className="bg-[#0A0807] text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-all">
                        <Plus size={18} />
                        Create Your First Bot
                    </Link>
                </div>
            )}
        </DashboardLayout>
    );
}
