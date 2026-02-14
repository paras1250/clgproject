import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppHeader from '@/components/AppHeader';
import Cookies from 'js-cookie';
import api, { botsAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { showToast } from '@/components/Toast';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface Conversation {
    id: string;
    sessionId: string;
    messages: Message[];
    startedAt: string;
}

export default function BotHistory() {
    const router = useRouter();
    const { id } = router.query;
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [botName, setBotName] = useState('');

    useEffect(() => {
        if (id) {
            loadHistory();
            loadBotDetails();
        }
    }, [id]);

    const loadBotDetails = async () => {
        try {
            const res = await api.get(`/api/bots/${id}`);
            setBotName(res.data.bot.name);
        } catch (err) {
            console.error(err);
        }
    };

    const loadHistory = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/bots/${id}/conversations?limit=50`);
            setConversations(res.data.conversations);
            if (res.data.conversations.length > 0) {
                setSelectedConversation(res.data.conversations[0]);
            }
        } catch (err) {
            showToast('Failed to load history', 'error');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <>
            <Head>
                <title>Chat History - {botName}</title>
            </Head>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <AppHeader title="Chat History" breadcrumb="Dashboard / Chat History" />

                <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 py-8 gap-6 h-[calc(100vh-80px)]">
                    {/* Sidebar List */}
                    <div className="w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="font-bold text-gray-700">Conversations ({conversations.length})</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {conversations.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No conversations yet</div>
                            ) : (
                                conversations.map((conv: any) => (
                                    <div
                                        key={conv.id}
                                        onClick={() => setSelectedConversation(conv)}
                                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${selectedConversation?.id === conv.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                                    >
                                        <div className="font-semibold text-gray-800 text-sm truncate">
                                            Session: {conv.sessionId.substring(0, 8)}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {formatDate(conv.startedAt)}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {conv.messages.length} messages
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Detail View */}
                    <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
                        {selectedConversation ? (
                            <>
                                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-700">
                                        Session Detail: {selectedConversation.sessionId}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-500">
                                            {formatDate(selectedConversation.startedAt)}
                                        </span>
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (window.confirm('Delete this conversation? This cannot be undone.')) {
                                                    try {
                                                        await botsAPI.deleteConversation(id as string, selectedConversation.sessionId);
                                                        // Remove from local list
                                                        const updatedList = conversations.filter((c: any) => c.sessionId !== selectedConversation.sessionId);
                                                        setConversations(updatedList); // This will need to be typed properly or cast
                                                        setSelectedConversation(null);
                                                    } catch (err) {
                                                        console.error('Failed to delete conversation:', err);
                                                        alert('Failed to delete conversation');
                                                    }
                                                }
                                            }}
                                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                                            title="Delete Conversation"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                                    {selectedConversation.messages.map((msg: any, idx: number) => (
                                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${msg.role === 'user'
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                                }`}>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400">
                                Select a conversation to view details
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
