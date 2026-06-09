import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import AppHeader from '@/components/AppHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { adminAPI } from '@/lib/api';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/LoadingSpinner';
import { showToast } from '@/components/Toast';

/* ─── helpers ─────────────────────────────────────────────────────────── */
function formatBytes(bytes: number | null | undefined) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function typeLabel(type: string | null | undefined) {
  if (!type) return 'text';
  if (type.includes('pdf')) return 'PDF';
  if (type.includes('word') || type.includes('docx')) return 'Word';
  if (type.includes('plain') || type.includes('txt')) return 'TXT';
  return type.split('/').pop()?.toUpperCase() ?? 'File';
}

/* ─── Training Data Modal ─────────────────────────────────────────────── */
interface TrainingSource {
  filename: string;
  originalName: string;
  processedAt?: string;
  chunkCount: number | null;
  preview: string | null;
  type?: string;
  size?: number;
}

interface TrainingModalProps {
  botId: string;
  botName: string;
  onClose: () => void;
}

function TrainingDataModal({ botId, botName, onClose }: TrainingModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getBotTrainingData(botId)
      .then(setData)
      .catch(() => showToast('Failed to load training data', 'error'))
      .finally(() => setLoading(false));
  }, [botId]);

  const allSources: TrainingSource[] = data
    ? [...(data.trainingData || []), ...(data.legacyDocs || [])]
    : [];

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)' }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white/[0.08] overflow-hidden"
        style={{ background: '#111827' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-7 py-5 border-b border-white/[0.07]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#00F5D4] mb-1">
              Training Data
            </p>
            <h2 className="text-xl font-bold text-white font-sora leading-tight">
              {botName}
            </h2>
            {data && (
              <p className="text-sm text-[#64748B] mt-1">
                {allSources.length} training source{allSources.length !== 1 ? 's' : ''}
                {data.bot?.owner?.email ? ` · owned by ${data.bot.owner.email}` : ''}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-white transition-colors ml-4 mt-0.5"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* System Prompt pill */}
        {data?.bot?.system_prompt && (
          <div className="px-7 py-3 border-b border-white/[0.07] bg-white/[0.02]">
            <p className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold mb-1">
              System Prompt
            </p>
            <p className="text-sm text-[#CBD5E1] line-clamp-2 leading-relaxed">
              {data.bot.system_prompt}
            </p>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-5 space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-[#00F5D4] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && allSources.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-[#64748B] font-medium">No training data found</p>
              <p className="text-xs text-[#475569] mt-1">This bot hasn't been trained on any documents yet.</p>
            </div>
          )}

          {!loading &&
            allSources.map((src, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-5 hover:border-[#00F5D4]/20 transition-colors"
              >
                {/* Source header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* File icon */}
                    <div className="w-9 h-9 rounded-lg bg-[#00F5D4]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#00F5D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {src.originalName || src.filename}
                      </p>
                      {src.processedAt && (
                        <p className="text-xs text-[#64748B] mt-0.5">
                          Processed {new Date(src.processedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {src.type && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">
                        {typeLabel(src.type)}
                      </span>
                    )}
                    {src.size != null && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] text-[#94A3B8]">
                        {formatBytes(src.size)}
                      </span>
                    )}
                    {src.chunkCount != null && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
                        {src.chunkCount} chunk{src.chunkCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content preview */}
                {src.preview && (
                  <div className="mt-3 pt-3 border-t border-white/[0.05]">
                    <p className="text-[10px] uppercase tracking-widest text-[#475569] font-semibold mb-1.5">
                      Content Preview
                    </p>
                    <div className="text-xs text-[#94A3B8] leading-relaxed font-mono bg-black/20 p-3 rounded-lg max-h-64 overflow-y-auto whitespace-pre-wrap break-words">
                      {src.preview}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-white/[0.07] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-[#94A3B8] hover:text-white bg-white/[0.05] hover:bg-white/[0.08] rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────── */
export default function AdminBots() {
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [trainingModal, setTrainingModal] = useState<{ id: string; name: string } | null>(null);
  const router = useRouter();

  const fetchBots = useCallback(async () => {
    try {
      const data = await adminAPI.getBots();
      setBots(data.bots || []);
    } catch (error) {
      console.error('Failed to fetch bots', error);
      showToast('Failed to load chatbots', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  const handleDeleteBot = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${name}"?\n\nThis will permanently delete the chatbot and all its chat history.`
      )
    )
      return;

    setDeletingId(id);
    try {
      await adminAPI.deleteBot(id);
      setBots((prev) => prev.filter((b) => (b._id || b.id) !== id));
      showToast(`"${name}" deleted successfully`, 'success');
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to delete chatbot', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading Chatbots..." />;

  return (
    <>
      <Head>
        <title>Manage Chatbots - Admin</title>
      </Head>

      <div className="min-h-screen bg-[#0A0F1C] font-sans">
        <AppHeader title="Admin Panel" breadcrumb="Admin / Chatbots" />

        <div className="flex">
          <AdminSidebar />

          <main className="flex-1 p-8">
            {/* Page title */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold font-sora text-white">Global Chatbots</h1>
                <p className="text-sm text-[#64748B] mt-1">
                  {bots.length} chatbot{bots.length !== 1 ? 's' : ''} across the platform
                </p>
              </div>
              <div className="text-xs text-[#475569] bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 font-mono">
                {bots.length} total
              </div>
            </div>

            {/* Table */}
            <div className="bg-[#121826] rounded-2xl border border-white/[0.06] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#94A3B8]">
                  <thead className="text-xs uppercase bg-white/[0.02] border-b border-white/[0.06] text-[#F1F5F9]">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Bot Name</th>
                      <th className="px-6 py-4 font-semibold">Model</th>
                      <th className="px-6 py-4 font-semibold">Owner</th>
                      <th className="px-6 py-4 font-semibold">Created</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bots.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-2 text-[#64748B]">
                            <svg className="w-10 h-10 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <p className="font-medium">No chatbots found</p>
                            <p className="text-xs text-[#475569]">No bots have been created on this platform yet.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      bots.map((bot) => {
                        const botId = bot._id || bot.id;
                        const isDeleting = deletingId === botId;
                        return (
                          <tr
                            key={botId}
                            className={`border-b border-white/[0.06] transition-colors ${
                              isDeleting ? 'opacity-40 pointer-events-none' : 'hover:bg-white/[0.02]'
                            }`}
                          >
                            {/* Name */}
                            <td className="px-6 py-4 font-semibold text-white">
                              {bot.name}
                            </td>

                            {/* Model */}
                            <td className="px-6 py-4">
                              <span className="text-xs text-[#00F5D4] bg-[#00F5D4]/10 px-2 py-1 rounded font-mono">
                                {bot.model_name || 'default'}
                              </span>
                            </td>

                            {/* Owner */}
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-white font-medium text-xs">
                                  {bot.user_id?.name || 'Unknown'}
                                </p>
                                <p className="text-[#64748B] text-xs mt-0.5">
                                  {bot.user_id?.email || ''}
                                </p>
                              </div>
                            </td>

                            {/* Created */}
                            <td className="px-6 py-4 text-xs">
                              {new Date(bot.created_at || bot.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                                  bot.is_active
                                    ? 'bg-[#00F5D4]/10 text-[#00F5D4]'
                                    : 'bg-[#EF4444]/10 text-[#EF4444]'
                                }`}
                              >
                                {bot.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-3">
                                {/* View Training Data */}
                                <button
                                  id={`view-training-${botId}`}
                                  onClick={() => setTrainingModal({ id: botId, name: bot.name })}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-[#00F5D4] hover:text-white bg-[#00F5D4]/10 hover:bg-[#00F5D4]/20 px-3 py-1.5 rounded-lg transition-all"
                                  title="View training data"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Training
                                </button>

                                {/* Delete */}
                                <button
                                  id={`delete-bot-${botId}`}
                                  onClick={() => handleDeleteBot(botId, bot.name)}
                                  disabled={isDeleting}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-[#EF4444] hover:text-white bg-[#EF4444]/10 hover:bg-[#EF4444]/20 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                                  title="Delete this bot"
                                >
                                  {isDeleting ? (
                                    <div className="w-3.5 h-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  )}
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Training Data Modal */}
      {trainingModal && (
        <TrainingDataModal
          botId={trainingModal.id}
          botName={trainingModal.name}
          onClose={() => setTrainingModal(null)}
        />
      )}
    </>
  );
}
