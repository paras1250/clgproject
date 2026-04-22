import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppHeader from '@/components/AppHeader';
import FileUploader from '@/components/FileUploader';
import Cookies from 'js-cookie';
import { botsAPI } from '@/lib/api';
import { showToast } from '@/components/Toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import CollapsibleSection from '@/components/CollapsibleSection';
import ChatbotWidgetPreview from '@/components/ChatbotWidgetPreview';
import ConfirmDialog from '@/components/ConfirmDialog';
import OfflineDetector from '@/components/OfflineDetector';
import TrainingDataViewer from '@/components/TrainingDataViewer';
import { Sparkles, Layout, Palette, Database, Settings as SettingsIcon, BrainCircuit, Activity, ChevronRight, Save, LogOut } from 'lucide-react';

export default function EditBot() {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState('general');
  const [botData, setBotData] = useState({
    name: '',
    description: '',
    modelName: 'google/flan-t5-large',
    embedTheme: 'default',
    embedPosition: 'bottom-right',
    greetingMessage: 'Hi! How can I help you today?',
    widgetWidth: '380',
    widgetHeight: '600',
    widgetColor: '#00F5D4',
    widgetAvatar: '',
    widgetSize: 'medium',
    emailNotifications: false,
    emailAddress: '',
    systemPrompt: 'You are a helpful AI assistant.',
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<any[]>([]);
  const [trainingText, setTrainingText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBot, setIsLoadingBot] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    type: 'info'
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    if (id && isAuthenticated) {
      loadBot();
    }
  }, [id, isAuthenticated]);

  const loadBot = async () => {
    try {
      setIsLoadingBot(true);
      const data = await botsAPI.get(id as string);
      if (data.bot) {
        const bot = data.bot;
        const widget = bot.widgetCustomization || {};
        const embed = bot.embedSettings || {};
        const notify = bot.notificationSettings || {};

        setBotData({
          name: bot.name || '',
          description: bot.description || '',
          modelName: bot.modelName || 'google/flan-t5-large',
          embedTheme: embed.theme || 'default',
          embedPosition: embed.position || 'bottom-right',
          greetingMessage: bot.greetingMessage || 'Hi! How can I help you today?',
          widgetWidth: widget.width || '380',
          widgetHeight: widget.height || '600',
          widgetColor: widget.primaryColor || '#00F5D4',
          widgetAvatar: widget.avatar || '',
          widgetSize: widget.widgetSize || 'medium',
          emailNotifications: notify.emailNotifications || false,
          emailAddress: notify.emailAddress || '',
          systemPrompt: bot.systemPrompt || 'You are a helpful AI assistant.',
        });

        if (bot.documents) {
          setExistingDocuments(bot.documents);
        }

        if (bot.trainingDataSummary && bot.trainingDataSummary.totalItems > 0) {
            // Need to fetch full training data if not in summary
            try {
                const trainingData = await botsAPI.getTrainingData(id as string);
                if (trainingData.trainingData && trainingData.trainingData.textTraining) {
                    const textContent = trainingData.trainingData.textTraining.map((t: any) => t.fullContent).join('\n\n');
                    setTrainingText(textContent);
                }
            } catch (e) {
                console.error("Failed to load full training data", e);
            }
        }
      }
    } catch (error: any) {
      console.error('Error loading bot:', error);
      showToast('Failed to load bot. Please try again.', 'error');
      router.push('/dashboard');
    } finally {
      setIsLoadingBot(false);
    }
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...fileArray]);
    }
  };

  const handleTrainChatbot = async () => {
    if (!trainingText.trim() && uploadedFiles.length === 0) {
      showToast('Please add training text or upload documents to train the chatbot', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      if (trainingText && trainingText.trim()) {
        formData.append('trainingText', trainingText.trim());
      }
      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => {
          formData.append('documents', file);
        });
      }

      await botsAPI.update(id as string, formData);
      showToast('Chatbot training data updated successfully! 🎉', 'success');

      // Reset local file selection
      setUploadedFiles([]);
      
      // Reload documents
      const data = await botsAPI.get(id as string);
      if (data.bot && data.bot.documents) {
        setExistingDocuments(data.bot.documents);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update training data. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBot = async () => {
    if (!botData.name || botData.name.trim().length < 2) {
      showToast('Please enter a bot name (at least 2 characters)', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', botData.name.trim());
      formData.append('description', botData.description.trim());
      formData.append('modelName', botData.modelName);
      formData.append('embedTheme', botData.embedTheme);
      formData.append('embedPosition', botData.embedPosition);
      formData.append('greetingMessage', botData.greetingMessage);
      formData.append('widgetWidth', botData.widgetWidth);
      formData.append('widgetHeight', botData.widgetHeight);
      formData.append('widgetColor', botData.widgetColor);
      formData.append('widgetAvatar', botData.widgetAvatar);
      formData.append('widgetSize', botData.widgetSize);
      formData.append('emailNotifications', botData.emailNotifications.toString());
      if (botData.emailAddress) formData.append('emailAddress', botData.emailAddress);
      if (botData.systemPrompt) formData.append('systemPrompt', botData.systemPrompt);

      await botsAPI.update(id as string, formData);
      showToast('Bot updated successfully! 🎉', 'success');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update bot. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const removeDocument = (index: number, docName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Document',
      message: `Are you sure you want to delete "${docName}"?`,
      type: 'danger',
      onConfirm: async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('documentsToRemove', JSON.stringify([index]));
            await botsAPI.update(id as string, formData);
            setExistingDocuments(existingDocuments.filter((_, i) => i !== index));
            showToast('Document removed successfully', 'success');
        } catch (e) {
            showToast('Failed to remove document', 'error');
        } finally {
            setIsLoading(false);
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Layout size={18} /> },
    { id: 'knowledge', label: 'Knowledge', icon: <BrainCircuit size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
  ];

  if (!isAuthenticated) return <LoadingSpinner fullScreen text="Authenticating..." />;
  if (isLoadingBot) return <LoadingSpinner fullScreen text="Loading bot data..." />;

  return (
    <>
      <Head>
        <title>Edit Bot | Conversio AI</title>
      </Head>

      <div className="min-h-screen bg-[#0A0F1C] flex flex-col font-inter">
        <AppHeader title="Bot Dashboard" breadcrumb={`Edit / ${botData.name || 'Bot'}`} />

        <main className="flex-1 flex flex-col max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
             <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00F5D4]/20 to-[#3A86FF]/20 flex items-center justify-center text-2xl border border-white/5 shadow-lg shrink-0 overflow-hidden">
                   {botData.widgetAvatar && (
                     botData.widgetAvatar.startsWith('/') || 
                     botData.widgetAvatar.startsWith('http') || 
                     botData.widgetAvatar.includes('.') || 
                     botData.widgetAvatar.length > 5
                   ) ? (
                     <img src={botData.widgetAvatar} alt="" className="w-full h-full object-cover" />
                   ) : (
                     botData.widgetAvatar || '🤖'
                   )}
                </div>
                <div className="min-w-0">
                   <h1 className="font-sora text-3xl font-black text-white tracking-tight truncate">{botData.name}</h1>
                   <p className="text-[#64748B] text-xs font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-pulse" />
                      Configuration Active
                   </p>
                </div>
             </div>
             <div className="flex items-center gap-3 shrink-0">
                <button
                   onClick={() => router.push('/dashboard')}
                   className="px-5 py-2.5 rounded-xl border border-white/5 text-[#94A3B8] font-bold text-sm hover:bg-white/5 transition-all flex items-center gap-2"
                >
                   <LogOut size={16} />
                   Exit
                </button>
                <button
                   onClick={handleUpdateBot}
                   disabled={isLoading}
                   className="px-6 py-2.5 rounded-xl bg-[#00F5D4] text-[#0A0F1C] font-black text-sm hover:bg-[#00D9C0] transition-all shadow-lg shadow-[#00F5D4]/20 flex items-center gap-2"
                >
                   {isLoading ? 'SAVING...' : <><Save size={16} /> SAVE CHANGES</>}
                </button>
             </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
            {/* Main Content Area */}
            <div className="lg:col-span-8 flex flex-col gap-6 h-full">
              {/* Tab Navigation */}
              <nav className="flex items-center gap-2 bg-[#121826]/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 shadow-sm sticky top-0 z-20">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#1e2536] text-[#00F5D4] shadow-lg border border-white/10'
                        : 'text-[#64748B] hover:text-[#94A3B8] hover:bg-white/5'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Scrollable Form Content */}
              <div className="flex-1 bg-[#121826] rounded-3xl border border-white/5 shadow-xl p-8 overflow-y-auto custom-scrollbar animate-slide-up relative">
                {activeTab === 'general' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                            <Layout size={24} />
                        </div>
                        <div>
                            <h3 className="font-sora text-xl font-bold text-white">General Information</h3>
                            <p className="text-sm text-[#64748B]">Define your bot's core identity and AI model.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-widest mb-2">Bot Identity</label>
                          <input
                            type="text"
                            value={botData.name}
                            onChange={(e) => setBotData({ ...botData, name: e.target.value })}
                            className="w-full bg-[#0A0F1C]/60 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#00F5D4]/40 outline-none transition-all font-medium"
                            placeholder="e.g. Support Hero"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-widest mb-2">Short Description</label>
                          <textarea
                            value={botData.description}
                            onChange={(e) => setBotData({ ...botData, description: e.target.value })}
                            className="w-full bg-[#0A0F1C]/60 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#00F5D4]/40 outline-none transition-all font-medium h-32 resize-none"
                            placeholder="What is the purpose of this bot?"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-widest mb-2">AI Model Engine</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {[
                                  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'Fast & Accurate' },
                                  { id: 'gemini-pro', name: 'Gemini Pro', desc: 'Highly Intelligent' },
                                  { id: 'google/flan-t5-large', name: 'FLAN-T5', desc: 'Lite & Stable' }
                              ].map(model => (
                                  <button
                                      key={model.id}
                                      onClick={() => setBotData({ ...botData, modelName: model.id })}
                                      className={`p-4 rounded-2xl border text-left transition-all ${
                                          botData.modelName === model.id 
                                          ? 'bg-[#00F5D4]/5 border-[#00F5D4] text-[#00F5D4]' 
                                          : 'bg-[#0A0F1C]/40 border-white/5 text-[#64748B] hover:border-white/10'
                                      }`}
                                  >
                                      <p className="font-bold text-sm">{model.name}</p>
                                      <p className="text-[10px] uppercase tracking-wider opacity-60 mt-1">{model.desc}</p>
                                  </button>
                              ))}
                          </div>
                        </div>
                    </div>
                  </div>
                )}

                {activeTab === 'knowledge' && (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                                <BrainCircuit size={24} />
                            </div>
                            <div>
                                <h3 className="font-sora text-xl font-bold text-white">Brain & Knowledge</h3>
                                <p className="text-sm text-[#64748B]">Provide the data your bot uses to answer questions.</p>
                            </div>
                        </div>
                        {(trainingText.trim() || uploadedFiles.length > 0) && (
                            <button
                               onClick={handleTrainChatbot}
                               className="px-5 py-2.5 bg-[#00F5D4] text-[#0A0F1C] rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#00D9C0] transition-all shadow-lg shadow-[#00F5D4]/10"
                            >
                               {isLoading ? 'Training...' : 'UPDATE BRAIN'}
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 gap-8">
                        <div className="p-6 bg-[#0A0F1C]/40 border border-white/5 rounded-2xl">
                          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-widest mb-4 flex items-center gap-2 text-[#00F5D4]">
                             <Database size={14} />
                             Text-Based Knowledge
                          </label>
                          <textarea
                            value={trainingText}
                            onChange={(e) => setTrainingText(e.target.value)}
                            className="w-full bg-[#0A0F1C]/60 border border-white/10 rounded-2xl px-6 py-4 text-[#F1F5F9] focus:border-[#00F5D4]/40 outline-none transition-all font-inter text-sm h-[250px] leading-relaxed custom-scrollbar"
                            placeholder="Paste documentation, FAQs, or any text information here..."
                          />
                        </div>

                        <div>
                           <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-widest mb-4">Document Training (PDF, DOCX, TXT)</label>
                           <FileUploader
                             onFilesSelected={handleFilesSelected}
                             uploadedFiles={uploadedFiles}
                             onFileRemove={(index) => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                           />
                        </div>

                        {existingDocuments.length > 0 && (
                           <div className="pt-6 border-t border-white/5">
                              <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-widest mb-4 flex items-center gap-2">
                                  <Activity size={14} className="text-blue-500" />
                                  Already Trained Documents
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {existingDocuments.map((doc, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-4 bg-[#0A0F1C]/40 border border-white/10 rounded-xl group hover:border-blue-500/30 transition-all">
                                     <div className="flex items-center gap-3 truncate">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        </div>
                                        <span className="text-sm font-medium text-[#94A3B8] truncate">{doc.originalName || doc.filename}</span>
                                     </div>
                                     <button onClick={() => removeDocument(idx, doc.originalName || doc.filename)} className="p-2 text-[#EF4444] opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-lg transition-all">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                     </button>
                                  </div>
                                ))}
                              </div>
                           </div>
                        )}

                        <div className="pt-10 border-t border-white/5">
                           <div className="flex items-center justify-between mb-6">
                               <h4 className="font-sora text-lg font-bold text-white">Advanced Knowledge View</h4>
                               <span className="text-[10px] font-black bg-white/5 px-2 py-1 rounded text-[#64748B] uppercase tracking-widest">Expert Mode</span>
                           </div>
                           <TrainingDataViewer botId={id as string} />
                        </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500 border border-teal-500/20">
                            <Palette size={24} />
                        </div>
                        <div>
                            <h3 className="font-sora text-xl font-bold text-white">Interface Design</h3>
                            <p className="text-sm text-[#64748B]">Customize how your chatbot looks and feels to users.</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                           <div className="p-6 bg-[#0A0F1C]/40 border border-white/5 rounded-2xl">
                              <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-widest mb-4">Brand Accent Color</label>
                              <div className="flex items-center gap-6">
                                 <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white/10 shadow-xl relative group">
                                    <input
                                      type="color"
                                      value={botData.widgetColor}
                                      onChange={(e) => setBotData({ ...botData, widgetColor: e.target.value })}
                                      className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                                    />
                                 </div>
                                 <div className="flex-1 space-y-2">
                                    <input
                                      type="text"
                                      value={botData.widgetColor}
                                      onChange={(e) => setBotData({ ...botData, widgetColor: e.target.value })}
                                      className="w-full bg-[#0A0F1C]/60 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm uppercase focus:border-[#00F5D4]/40 outline-none"
                                    />
                                    <p className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider">Hex Color Code</p>
                                 </div>
                              </div>
                           </div>

                           <div className="p-6 bg-[#0A0F1C]/40 border border-white/5 rounded-2xl">
                              <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-widest mb-3">Bot Avatar (Emoji or Image URL)</label>
                              <input
                                type="text"
                                value={botData.widgetAvatar}
                                onChange={(e) => setBotData({ ...botData, widgetAvatar: e.target.value })}
                                className="w-full bg-[#0A0F1C]/60 border border-white/10 rounded-xl px-5 py-4 text-white font-medium focus:border-[#00F5D4]/40 outline-none"
                                placeholder="e.g. 🤖 or https://example.com/logo.png"
                              />
                           </div>

                           <div className="p-6 bg-[#0A0F1C]/40 border border-white/5 rounded-2xl">
                              <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-widest mb-4">Widget Dimensions</label>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                     <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider mb-2">Width (px)</p>
                                     <input
                                       type="number"
                                       value={botData.widgetWidth}
                                       onChange={(e) => setBotData({ ...botData, widgetWidth: e.target.value })}
                                       className="w-full bg-[#0A0F1C]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00F5D4]/40 outline-none"
                                     />
                                  </div>
                                  <div>
                                     <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider mb-2">Height (px)</p>
                                     <input
                                       type="number"
                                       value={botData.widgetHeight}
                                       onChange={(e) => setBotData({ ...botData, widgetHeight: e.target.value })}
                                       className="w-full bg-[#0A0F1C]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00F5D4]/40 outline-none"
                                     />
                                  </div>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-8">
                           <div className="p-6 bg-[#0A0F1C]/40 border border-white/5 rounded-2xl">
                              <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-widest mb-3">Greeting Message</label>
                              <textarea
                                value={botData.greetingMessage}
                                onChange={(e) => setBotData({ ...botData, greetingMessage: e.target.value })}
                                className="w-full bg-[#0A0F1C]/60 border border-white/10 rounded-xl px-5 py-4 text-white h-[100px] resize-none text-sm leading-relaxed focus:border-[#00F5D4]/40 outline-none"
                                placeholder="Hi! I'm your AI assistant. How can I help?"
                              />
                           </div>

                           <div className="p-6 bg-[#0A0F1C]/40 border border-white/5 rounded-2xl">
                              <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-widest mb-4">Size & Position</label>
                              <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-3">
                                      {['small', 'medium', 'large'].map((size) => (
                                          <button
                                              key={size}
                                              onClick={() => setBotData({ ...botData, widgetSize: size })}
                                              className={`py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                                  botData.widgetSize === size ? 'bg-[#00F5D4] text-[#0A0F1C] border-[#00F5D4]' : 'bg-transparent text-[#64748B] border-white/5 hover:bg-white/5'
                                              }`}
                                          >
                                              {size}
                                          </button>
                                      ))}
                                  </div>
                                  <select
                                    value={botData.embedPosition}
                                    onChange={(e) => setBotData({ ...botData, embedPosition: e.target.value })}
                                    className="w-full bg-[#0A0F1C]/60 border border-white/10 rounded-xl px-5 py-4 text-white appearance-none focus:border-[#00F5D4]/40 outline-none cursor-pointer"
                                  >
                                     <option value="bottom-right">📍 Bottom Right</option>
                                     <option value="bottom-left">📍 Bottom Left</option>
                                  </select>
                              </div>
                           </div>

                           <div className="p-6 bg-[#0A0F1C]/40 border border-white/5 rounded-2xl">
                              <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-widest mb-4">Base UI Theme</label>
                              <div className="flex gap-3">
                                 {['default', 'dark'].map((t) => (
                                    <button
                                       key={t}
                                       onClick={() => setBotData({ ...botData, embedTheme: t })}
                                       className={`flex-1 py-3 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all ${
                                          botData.embedTheme === t ? 'bg-[#00F5D4]/10 text-[#00F5D4] border-[#00F5D4]/40 shadow-[0_0_20px_rgba(0,245,212,0.1)]' : 'bg-transparent text-[#64748B] border-white/5 hover:bg-white/5'
                                       }`}
                                    >
                                       {t === 'default' ? 'Light' : 'Dark'}
                                    </button>
                                 ))}
                              </div>
                           </div>
                        </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                            <SettingsIcon size={24} />
                        </div>
                        <div>
                            <h3 className="font-sora text-xl font-bold text-white">System Settings</h3>
                            <p className="text-sm text-[#64748B]">Advanced configurations for bot behavior and notifications.</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="p-6 bg-[#0A0F1C]/40 border border-white/5 rounded-2xl">
                          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-widest mb-4">System Instructions (Prompt Engineering)</label>
                          <textarea
                            value={botData.systemPrompt}
                            onChange={(e) => setBotData({ ...botData, systemPrompt: e.target.value })}
                            className="w-full bg-[#0A0F1C]/60 border border-white/10 rounded-2xl px-6 py-5 text-[#94A3B8] h-40 font-mono text-xs leading-relaxed focus:border-[#00F5D4]/40 outline-none custom-scrollbar"
                            placeholder="Example: You are a professional support agent for X Corp. Your tone should be friendly..."
                          />
                        </div>

                        <div className="p-8 border border-white/5 bg-[#121826] rounded-3xl space-y-6">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${botData.emailNotifications ? 'bg-[#00F5D4]/10 text-[#00F5D4]' : 'bg-white/5 text-[#64748B]'}`}>
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                  </div>
                                  <div>
                                     <h4 className="font-bold text-white text-sm">Lead Capture Notifications</h4>
                                     <p className="text-[11px] text-[#64748B] mt-0.5">Receive an email whenever a user interacts with your bot.</p>
                                  </div>
                              </div>
                              <button
                                 onClick={() => setBotData({ ...botData, emailNotifications: !botData.emailNotifications })}
                                 className={`w-14 h-7 rounded-full transition-all relative ${botData.emailNotifications ? 'bg-[#00F5D4]' : 'bg-white/10 border border-white/5'}`}
                              >
                                 <div className={`absolute top-1 w-5 h-5 rounded-full transition-all shadow-md ${botData.emailNotifications ? 'left-8 bg-[#0A0F1C]' : 'left-1 bg-[#64748B]'}`} />
                              </button>
                           </div>
                           
                           {botData.emailNotifications && (
                              <div className="animate-fade-in pl-14">
                                  <input
                                    type="email"
                                    value={botData.emailAddress}
                                    onChange={(e) => setBotData({ ...botData, emailAddress: e.target.value })}
                                    className="w-full bg-[#0A0F1C]/60 border border-white/10 rounded-xl px-5 py-3.5 text-white text-sm focus:border-[#00F5D4]/40 outline-none"
                                    placeholder="your-email@company.com"
                                  />
                              </div>
                           )}
                        </div>

                        <div className="pt-10 border-t border-white/10">
                           <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
                              <div className="text-center sm:text-left">
                                 <p className="text-sm font-bold text-white">Permanently Delete Chatbot</p>
                                 <p className="text-[11px] text-red-400/60 mt-1 max-w-sm">This action cannot be undone. All training data, chat history, and settings will be wiped from our servers.</p>
                              </div>
                              <button
                                 onClick={async () => {
                                    setConfirmDialog({
                                        isOpen: true,
                                        title: 'Delete Chatbot',
                                        message: 'Are you absolutely sure? This will permanently remove all bot data and training history.',
                                        type: 'danger',
                                        onConfirm: async () => {
                                            try {
                                                setIsLoading(true);
                                                await botsAPI.delete(id as string);
                                                showToast('Bot deleted successfully', 'success');
                                                router.push('/dashboard');
                                            } catch (error) {
                                                showToast('Failed to delete bot', 'error');
                                                setIsLoading(false);
                                                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                                            }
                                        }
                                    });
                                 }}
                                 className="px-6 py-3 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                              >
                                 Delete Bot
                              </button>
                           </div>
                        </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Preview Area */}
            <div className="lg:col-span-4 h-full">
              <div className="sticky top-6 flex flex-col gap-6">
                 <div className="bg-[#121826] rounded-3xl border border-white/5 p-8 shadow-xl relative overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="font-sora text-lg font-bold text-white flex items-center gap-3">
                          <div className="w-1.5 h-6 bg-[#00F5D4] rounded-full shadow-[0_0_15px_rgba(0,245,212,0.5)]" />
                          Live Preview
                       </h3>
                       <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00F5D4]/10 border border-[#00F5D4]/20">
                          <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-pulse" />
                          <span className="text-[#00F5D4] text-[10px] font-black uppercase tracking-widest">Real-time</span>
                       </div>
                    </div>
                    
                    {/* The Actual Widget Preview */}
                    <div className="flex-1 flex flex-col items-center justify-center py-10 bg-[#0A0F1C]/40 rounded-3xl border border-white/5 relative min-h-[500px]">
                      <ChatbotWidgetPreview
                        botId={id as string}
                        greeting={botData.greetingMessage}
                        avatar={botData.widgetAvatar}
                        color={botData.widgetColor}
                        width={botData.widgetWidth}
                        height={botData.widgetHeight}
                        theme={botData.embedTheme}
                        widgetSize={botData.widgetSize}
                        initiallyOpen={true}
                      />
                      
                      {/* Grid background overlay for the preview area */}
                      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                    </div>

                    <div className="mt-8 space-y-4">
                       <div className="flex items-center justify-between text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em]">
                          <span>Configuration Confidence</span>
                          <span className="text-[#00F5D4]">Optimal</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#00F5D4] via-[#3A86FF] to-[#00F5D4] bg-[length:200%_100%] animate-gradient-shift w-full" />
                       </div>
                    </div>
                 </div>

                 <div className="p-6 border border-[#3A86FF]/20 bg-gradient-to-br from-[#121826] to-[#0A0F1C] rounded-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                           <Sparkles size={16} className="text-[#3A86FF]" />
                           Quick Tip
                        </h4>
                        <p className="text-[#94A3B8] text-xs leading-relaxed font-medium">
                           The preview on the left is **interactive**. Use the **Appearance** tab to adjust colors, sizes, and themes to match your brand's unique identity.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#3A86FF]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-[#3A86FF]/10 transition-all duration-700" />
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
      <OfflineDetector />

      <style jsx global>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-shift {
          animation: gradient-shift 3s ease infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.12);
        }
      `}</style>
    </>
  );
}
