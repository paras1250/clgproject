import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../components/DashboardLayout';
import { BarChart3, Users, MessageCircle, Clock, TrendingUp, Star, ChevronRight, Bot, HelpCircle } from 'lucide-react';
import { analyticsAPI, botsAPI } from '../lib/api';

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, color }: any) => (
    <div className="bg-[#121826] p-6 rounded-2xl border border-white/[0.06] flex flex-col gap-4 hover:border-white/10 transition-colors">
        <div className="flex items-center justify-between">
            <span className="text-[#94A3B8] font-medium font-inter text-sm">{label}</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color || 'bg-white/5'}`}>
                <Icon size={20} className="text-white" />
            </div>
        </div>
        <div>
            <span className="text-3xl font-bold text-[#F1F5F9] font-sora">{value}</span>
            {sub && <p className="text-xs text-[#64748B] mt-1 font-inter">{sub}</p>}
        </div>
    </div>
);

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }: { className?: string }) => (
    <div className={`animate-pulse bg-white/[0.05] rounded-xl ${className}`} />
);

// ─── Star Rating ─────────────────────────────────────────────────────────────
const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={14} className={i <= Math.round(rating) ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#334155]'} />
        ))}
        <span className="ml-1.5 text-sm text-[#94A3B8] font-inter">{rating.toFixed(1)}</span>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Analytics() {
    const router = useRouter();

    const [bots, setBots] = useState<any[]>([]);
    const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

    const [dashData, setDashData] = useState<any>(null);
    const [botData, setBotData] = useState<any>(null);

    const [loadingBots, setLoadingBots] = useState(true);
    const [loadingStats, setLoadingStats] = useState(false);
    const [error, setError] = useState('');

    // ── FAQ state ─────────────────────────────────────────────────────────────
    type DateRange = '7d' | '30d' | '90d' | 'all';
    const [dateRange, setDateRange] = useState<DateRange>('30d');
    const [faqData, setFaqData] = useState<{ text: string; count: number }[]>([]);
    const [loadingFAQ, setLoadingFAQ] = useState(false);

    const getDateBounds = (range: DateRange): { from?: string; to?: string } => {
        if (range === 'all') return {};
        const to = new Date();
        const from = new Date();
        const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
        from.setDate(from.getDate() - days);
        return { from: from.toISOString(), to: to.toISOString() };
    };

    // ── Fetch bot list on mount ───────────────────────────────────────────────
    useEffect(() => {
        const init = async () => {
            try {
                const [botsRes, dashRes] = await Promise.all([
                    botsAPI.list(),
                    analyticsAPI.getDashboard(),
                ]);
                const botList = botsRes.bots || botsRes || [];
                setBots(botList);
                setDashData(dashRes);

                // Honour ?botId= query param
                const paramId = router.query.botId as string | undefined;
                if (paramId && botList.find((b: any) => (b._id || b.id) === paramId)) {
                    setSelectedBotId(paramId);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load analytics');
            } finally {
                setLoadingBots(false);
            }
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Fetch per-bot stats whenever selection changes ────────────────────────
    useEffect(() => {
        if (!selectedBotId) { setBotData(null); return; }

        const fetchBotStats = async () => {
            setLoadingStats(true);
            setBotData(null);
            try {
                const data = await analyticsAPI.getBotAnalytics(selectedBotId);
                setBotData(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load bot analytics');
            } finally {
                setLoadingStats(false);
            }
        };
        fetchBotStats();
    }, [selectedBotId]);

    // ── Fetch FAQ whenever botId or dateRange changes ────────────────────────
    useEffect(() => {
        if (!selectedBotId) { setFaqData([]); return; }
        const fetchFAQ = async () => {
            setLoadingFAQ(true);
            try {
                const { from, to } = getDateBounds(dateRange);
                const data = await analyticsAPI.getBotFAQ(selectedBotId, from, to);
                setFaqData(data?.questions || []);
            } catch {
                setFaqData([]);
            } finally {
                setLoadingFAQ(false);
            }
        };
        fetchFAQ();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBotId, dateRange]);

    // ── Bot selector handler ──────────────────────────────────────────────────
    const selectBot = (id: string | null) => {
        setSelectedBotId(id);
        setError('');
        const url = id ? `/analytics?botId=${id}` : '/analytics';
        router.replace(url, undefined, { shallow: true });
    };

    const selectedBot = bots.find(b => (b._id || b.id) === selectedBotId);

    // ── Stats derived from botData ────────────────────────────────────────────
    const stats = botData?.statistics;
    const feedbackRating: number = stats?.feedback?.averageRating || 0;
    const feedbackCount: number = stats?.feedback?.total || 0;

    // ── Format date ───────────────────────────────────────────────────────────
    const fmtDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <DashboardLayout>
            <Head><title>Analytics – Conversio AI</title></Head>

            {/* ── Page header ── */}
            <div className="mb-6">
                <h1 className="font-sora text-2xl font-bold text-[#F1F5F9]">Analytics</h1>
                <p className="text-[#94A3B8] font-inter text-sm mt-1">
                    {selectedBot ? `Viewing stats for "${selectedBot.name}"` : 'Overview across all your chatbots'}
                </p>
            </div>

            {/* ── Bot selector ── */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
                {/* All Bots pill */}
                <button
                    onClick={() => selectBot(null)}
                    className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold font-inter transition-all border ${!selectedBotId
                        ? 'bg-[#00F5D4] text-[#0A0F1C] border-transparent shadow-lg shadow-[#00F5D4]/20'
                        : 'bg-white/5 text-[#94A3B8] border-white/[0.06] hover:bg-white/10 hover:text-[#F1F5F9]'
                        }`}
                >
                    <BarChart3 size={14} />
                    All Bots
                </button>

                {loadingBots ? (
                    [1, 2, 3].map(i => <Skeleton key={i} className="shrink-0 h-9 w-28" />)
                ) : (
                    bots.map(bot => {
                        const id = bot._id || bot.id;
                        const active = selectedBotId === id;
                        return (
                            <button
                                key={id}
                                onClick={() => selectBot(id)}
                                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold font-inter transition-all border ${active
                                    ? 'bg-[#00F5D4] text-[#0A0F1C] border-transparent shadow-lg shadow-[#00F5D4]/20'
                                    : 'bg-white/5 text-[#94A3B8] border-white/[0.06] hover:bg-white/10 hover:text-[#F1F5F9]'
                                    }`}
                            >
                                <Bot size={14} />
                                {bot.name}
                                {bot.isActive && !active && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] ml-0.5" />
                                )}
                            </button>
                        );
                    })
                )}
            </div>

            {/* ── Error banner ── */}
            {error && (
                <div className="mb-6 px-4 py-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-[#EF4444] text-sm font-inter">
                    {error}
                </div>
            )}

            {/* ══════════════════════════════════════════════
                ALL BOTS VIEW
            ══════════════════════════════════════════════ */}
            {!selectedBotId && (
                <>
                    {/* Overview stat cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            label="Total Bots"
                            value={dashData?.overview?.totalBots ?? '—'}
                            icon={BarChart3}
                            color="bg-[#00F5D4]/20"
                        />
                        <StatCard
                            label="Active Bots"
                            value={dashData?.overview?.activeBots ?? '—'}
                            icon={Users}
                            color="bg-[#10B981]/20"
                        />
                        <StatCard
                            label="Total Conversations"
                            value={dashData?.overview?.totalChats ?? '—'}
                            icon={MessageCircle}
                            color="bg-[#3A86FF]/20"
                        />
                        <StatCard
                            label="Avg Response Time"
                            value="1.2s"
                            icon={Clock}
                            color="bg-[#F59E0B]/20"
                        />
                    </div>

                    {/* Top bots table */}
                    <div className="bg-[#121826] rounded-2xl border border-white/[0.06] overflow-hidden">
                        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
                            <div>
                                <h2 className="font-sora text-base font-bold text-[#F1F5F9]">Top Performing Bots</h2>
                                <p className="text-xs text-[#64748B] mt-0.5 font-inter">Ranked by conversation count</p>
                            </div>
                        </div>
                        <div className="divide-y divide-white/[0.04]">
                            {bots.length > 0 ? (
                                [...bots]
                                    .sort((a, b) => (b.conversationCount || 0) - (a.conversationCount || 0))
                                    .slice(0, 8)
                                    .map((bot: any, idx: number) => (
                                        <div
                                            key={bot._id || bot.id || idx}
                                            className="flex items-center justify-between px-6 py-4 hover:bg-[#182034] transition-colors cursor-pointer group"
                                            onClick={() => selectBot(bot._id || bot.id)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00F5D4] to-[#3A86FF] flex items-center justify-center text-[#0A0F1C] font-bold text-sm shrink-0">
                                                    {bot.name?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[#F1F5F9] font-inter text-sm">{bot.name}</p>
                                                    <p className="text-xs text-[#64748B] font-inter flex items-center gap-1.5">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${bot.isActive ? 'bg-[#10B981]' : 'bg-[#475569]'}`} />
                                                        {bot.isActive ? 'Active' : 'Inactive'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="font-bold text-[#F1F5F9] font-sora text-sm">{bot.conversationCount || 0}</p>
                                                    <p className="text-xs text-[#64748B] font-inter">conversations</p>
                                                </div>
                                                <ChevronRight size={16} className="text-[#475569] group-hover:text-[#00F5D4] transition-colors" />
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <div className="px-6 py-16 text-center text-[#64748B]">
                                    <MessageCircle size={32} className="mx-auto mb-3 opacity-40" />
                                    <p className="font-inter text-sm">No chatbots created yet.</p>
                                    <p className="text-xs mt-1 font-inter">Create your first bot to see analytics here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* ══════════════════════════════════════════════
                PER-BOT VIEW
            ══════════════════════════════════════════════ */}
            {selectedBotId && (
                <>
                    {/* Stat cards */}
                    {loadingStats ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-36" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <StatCard
                                label="Total Conversations"
                                value={stats?.totalChats ?? '—'}
                                icon={MessageCircle}
                                color="bg-[#00F5D4]/20"
                            />
                            <StatCard
                                label="Total Messages"
                                value={stats?.totalMessages ?? '—'}
                                icon={BarChart3}
                                color="bg-[#3A86FF]/20"
                            />
                            <StatCard
                                label="Feedback Rating"
                                value={feedbackRating > 0 ? feedbackRating.toFixed(1) : '—'}
                                sub={feedbackCount > 0 ? `from ${feedbackCount} review${feedbackCount > 1 ? 's' : ''}` : 'No feedback yet'}
                                icon={Star}
                                color="bg-[#F59E0B]/20"
                            />
                            <StatCard
                                label="Avg Messages/Chat"
                                value={stats?.totalChats
                                    ? Math.round((stats.totalMessages || 0) / stats.totalChats)
                                    : '—'}
                                sub="messages per session"
                                icon={TrendingUp}
                                color="bg-[#10B981]/20"
                            />
                        </div>
                    )}

                    {/* Feedback breakdown */}
                    {!loadingStats && feedbackCount > 0 && (
                        <div className="bg-[#121826] rounded-2xl border border-white/[0.06] p-6 mb-6">
                            <h2 className="font-sora text-base font-bold text-[#F1F5F9] mb-4">Feedback Breakdown</h2>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-4xl font-bold font-sora text-[#F1F5F9]">
                                    {feedbackRating.toFixed(1)}
                                </span>
                                <div>
                                    <StarRating rating={feedbackRating} />
                                    <p className="text-xs text-[#64748B] mt-1 font-inter">{feedbackCount} review{feedbackCount > 1 ? 's' : ''}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                {[5, 4, 3, 2, 1].map(star => {
                                    const count = stats?.feedback?.ratings?.[star] || 0;
                                    const pct = feedbackCount > 0 ? Math.round((count / feedbackCount) * 100) : 0;
                                    return (
                                        <div key={star} className="flex items-center gap-3 text-sm">
                                            <span className="text-[#94A3B8] font-inter w-4">{star}</span>
                                            <Star size={12} className="text-[#F59E0B] fill-[#F59E0B] shrink-0" />
                                            <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[#F59E0B] to-[#F97316] rounded-full transition-all duration-500"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <span className="text-[#64748B] font-inter w-8 text-right">{pct}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── Top Questions ── */}
                    <div className="bg-[#121826] rounded-2xl border border-white/[0.06] overflow-hidden mb-6">
                        <div className="p-6 border-b border-white/[0.06]">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <h2 className="font-sora text-base font-bold text-[#F1F5F9] flex items-center gap-2">
                                        <HelpCircle size={16} className="text-[#00F5D4]" />
                                        Top Questions
                                    </h2>
                                    <p className="text-xs text-[#64748B] mt-0.5 font-inter">Most frequently asked by users</p>
                                </div>
                                {/* Date range pills */}
                                <div className="flex items-center gap-1.5">
                                    {(['7d', '30d', '90d', 'all'] as const).map(r => (
                                        <button
                                            key={r}
                                            onClick={() => setDateRange(r)}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold font-inter transition-all ${dateRange === r
                                                    ? 'bg-[#00F5D4] text-[#0A0F1C]'
                                                    : 'bg-white/5 text-[#94A3B8] hover:bg-white/10'
                                                }`}
                                        >
                                            {r === '7d' ? 'Last 7d' : r === '30d' ? 'Last 30d' : r === '90d' ? 'Last 90d' : 'All Time'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {loadingFAQ ? (
                            <div className="p-6 flex flex-col gap-3">
                                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12" />)}
                            </div>
                        ) : faqData.length > 0 ? (
                            <div className="divide-y divide-white/[0.04]">
                                {faqData.map((q, idx) => {
                                    const maxCount = faqData[0]?.count || 1;
                                    const pct = Math.round((q.count / maxCount) * 100);
                                    return (
                                        <div key={idx} className="px-6 py-3.5 flex items-center gap-4 hover:bg-[#182034] transition-colors">
                                            {/* Rank */}
                                            <span className="text-xs font-bold font-sora text-[#475569] w-5 shrink-0 text-right">{idx + 1}</span>
                                            {/* Question + bar */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-[#E2E8F0] font-inter capitalize truncate mb-1.5">{q.text}</p>
                                                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-[#00F5D4] to-[#3A86FF] transition-all duration-500"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                            {/* Count badge */}
                                            <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#00F5D4]/10 text-[#00F5D4] text-xs font-bold font-sora">
                                                ×{q.count}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="px-6 py-14 text-center">
                                <HelpCircle size={32} className="mx-auto mb-3 text-[#334155]" />
                                <p className="text-sm text-[#64748B] font-inter">No questions found for this period.</p>
                                <p className="text-xs text-[#475569] mt-1 font-inter">Try selecting a wider date range.</p>
                            </div>
                        )}
                    </div>

                    {/* Recent conversations */}
                    <div className="bg-[#121826] rounded-2xl border border-white/[0.06] overflow-hidden">
                        <div className="p-6 border-b border-white/[0.06]">
                            <h2 className="font-sora text-base font-bold text-[#F1F5F9]">Recent Conversations</h2>
                            <p className="text-xs text-[#64748B] mt-0.5 font-inter">Latest sessions for this bot</p>
                        </div>

                        {loadingStats ? (
                            <div className="p-6 flex flex-col gap-3">
                                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14" />)}
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.04]">
                                {(stats?.recentChats || []).length > 0 ? (
                                    stats.recentChats.map((chat: any, idx: number) => (
                                        <div key={chat.sessionId || idx} className="flex items-center justify-between px-6 py-4 hover:bg-[#182034] transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#0A0F1C] border border-white/[0.06] flex items-center justify-center">
                                                    <MessageCircle size={14} className="text-[#00F5D4]" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-[#F1F5F9] font-inter">
                                                        Session #{(chat.sessionId || '').toString().slice(-8)}
                                                    </p>
                                                    <p className="text-xs text-[#64748B] font-inter">
                                                        {chat.startedAt ? fmtDate(chat.startedAt) : '—'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-[#F1F5F9] font-sora">
                                                    {chat.messages?.length || 0}
                                                </p>
                                                <p className="text-xs text-[#64748B] font-inter">messages</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-16 text-center text-[#64748B]">
                                        <MessageCircle size={32} className="mx-auto mb-3 opacity-40" />
                                        <p className="font-inter text-sm">No conversations yet.</p>
                                        <p className="text-xs mt-1 font-inter">Conversations will appear here once users start chatting.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}
