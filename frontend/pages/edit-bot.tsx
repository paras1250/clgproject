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

export default function EditBot() {
  const router = useRouter();
  const { id } = router.query;
  const [botData, setBotData] = useState({
    name: '',
    description: '',
    modelName: 'google/flan-t5-large',
    embedTheme: 'default',
    embedPosition: 'bottom-right',
    greetingMessage: 'Hi! How can I help you today?',
    widgetWidth: '380',
    widgetHeight: '600',
    widgetColor: '#8b5cf6',
    widgetAvatar: '',
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
    type: 'warning'
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);

    if (id) {
      loadBot();
    }
  }, [router, id]);

  const loadBot = async () => {
    try {
      setIsLoadingBot(true);
      const response = await botsAPI.get(id as string);
      const bot = response.bot;

      const widgetCustom = bot.widgetCustomization || {};
      const notificationSettings = bot.notificationSettings || {};

      setBotData({
        name: bot.name || '',
        description: bot.description || '',
        modelName: bot.modelName || 'google/flan-t5-large',
        embedTheme: bot.embedSettings?.theme || 'default',
        embedPosition: bot.embedSettings?.position || 'bottom-right',
        greetingMessage: bot.greetingMessage || 'Hi! How can I help you today?',
        widgetWidth: widgetCustom.width || '380',
        widgetHeight: widgetCustom.height || '600',
        widgetColor: widgetCustom.primaryColor || '#8b5cf6',
        widgetAvatar: widgetCustom.avatar || '',
        emailNotifications: notificationSettings.emailNotifications || false,
        emailAddress: notificationSettings.emailAddress || '',
        systemPrompt: bot.system_prompt || bot.systemPrompt || 'You are a helpful AI assistant.',
      });

      if (bot.documents) {
        setExistingDocuments(bot.documents);
      }

      // Load existing training text from document_contents
      if (bot.document_contents && Array.isArray(bot.document_contents)) {
        const textTraining = bot.document_contents.find((dc: any) => dc.type === 'text');
        if (textTraining && textTraining.content) {
          setTrainingText(textTraining.content);
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
    // Only update training data (text and documents)
    if (!trainingText.trim() && uploadedFiles.length === 0) {
      showToast('Please add training text or upload documents to train the chatbot', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();

      // Add training text if provided
      if (trainingText && trainingText.trim()) {
        formData.append('trainingText', trainingText.trim());
      }

      // Add files if provided
      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => {
          formData.append('documents', file);
        });
      }

      await botsAPI.update(id as string, formData);
      showToast('Chatbot training data updated successfully! 🎉', 'success');

      // Reload bot data to refresh training data viewer
      if (id) {
        const bot = await botsAPI.get(id as string);
        setTrainingText('');
        setUploadedFiles([]);
        // Reload existing documents
        if (bot.bot && bot.bot.documents) {
          setExistingDocuments(bot.bot.documents);
        }
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

    if (botData.name.length > 100) {
      showToast('Bot name must be less than 100 characters', 'error');
      return;
    }

    // Validate email if notifications are enabled
    if (botData.emailNotifications) {
      if (!botData.emailAddress || !botData.emailAddress.trim()) {
        showToast('Please enter an email address for notifications', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(botData.emailAddress.trim())) {
        showToast('Please enter a valid email address', 'error');
        return;
      }
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
      formData.append('emailNotifications', botData.emailNotifications.toString());
      if (botData.emailAddress) {
        formData.append('emailAddress', botData.emailAddress);
      }

      if (botData.systemPrompt) {
        formData.append('systemPrompt', botData.systemPrompt);
      }

      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => {
          formData.append('documents', file);
        });
      }

      // Add training text if provided
      if (trainingText && trainingText.trim()) {
        formData.append('trainingText', trainingText.trim());
      }

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
      message: `Are you sure you want to delete "${docName}"? This action cannot be undone and the document will be removed from your chatbot's training data.`,
      type: 'danger',
      onConfirm: () => {
        setExistingDocuments(existingDocuments.filter((_, i) => i !== index));
        showToast('Document removed successfully', 'success');
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  if (!isAuthenticated) {
    return <LoadingSpinner fullScreen text="Authenticating..." />;
  }

  if (isLoadingBot) {
    return (
      <>
        <AppHeader title="Edit Chatbot" breadcrumb="Dashboard / Edit Chatbot" />
        <LoadingSpinner fullScreen text="Loading bot..." />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Chatbot - Conversio AI</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-40 right-20 w-96 h-96 gradient-ocean rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 left-20 w-80 h-80 gradient-premium rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        <div className="relative z-10">
          <AppHeader title="Edit Chatbot" breadcrumb="Dashboard / Edit Chatbot" />
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          <div className="mb-10 animate-fade-in">
            <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-premium bg-clip-text text-transparent mb-3 tracking-tight">
              Customize Your Chatbot
            </h1>
            <p className="text-xl text-[#94A3B8] font-semibold">
              Configure appearance, behavior, and advanced settings ✨
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Customization */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Settings */}
              <div className="glass rounded-2xl border-2 border-white/50 p-8 shadow-lift animate-fade-in">
                <h2 className="text-2xl font-extrabold text-[#F8FAFC] mb-6 flex items-center gap-3">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Basic Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-base font-extrabold text-[#F8FAFC] mb-3">
                      Bot Name <span className="text-red-600 text-xl">*</span>
                    </label>
                    <input
                      type="text"
                      value={botData.name}
                      onChange={(e) => setBotData({ ...botData, name: e.target.value })}
                      className="w-full border-2 border-white/10 bg-[#1E293B] rounded-xl px-5 py-4 text-base font-medium text-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
                      placeholder="My Customer Support Bot"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-base font-extrabold text-[#F8FAFC] mb-3">
                      Description <span className="text-[#94A3B8] text-sm font-semibold">(Optional)</span>
                    </label>
                    <textarea
                      value={botData.description}
                      onChange={(e) => setBotData({ ...botData, description: e.target.value })}
                      rows={4}
                      className="w-full border-2 border-white/10 bg-[#1E293B] rounded-xl px-5 py-4 text-base font-medium text-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all resize-none shadow-sm"
                      placeholder="A helpful chatbot for customer support..."
                    />
                  </div>

                  <div>
                    <label className="block text-base font-extrabold text-[#F8FAFC] mb-3">
                      AI Model
                    </label>
                    <select
                      value={botData.modelName}
                      onChange={(e) => setBotData({ ...botData, modelName: e.target.value })}
                      className="w-full border-2 border-white/10 bg-[#1E293B] rounded-xl px-5 py-4 text-base font-medium text-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
                    >
                      <optgroup label="Google Gemini (Recommended)">
                        <option value="gemini-pro">Gemini Pro</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</option>
                      </optgroup>
                      <optgroup label="Hugging Face Models">
                        <option value="google/flan-t5-large">Google FLAN-T5 Large</option>
                        <option value="gpt2">GPT-2</option>
                        <option value="EleutherAI/gpt-neo-1.3B">GPT-Neo 1.3B</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>

              {/* Customization Sections */}
              <div className="glass rounded-2xl border-2 border-white/50 p-8 shadow-lift animate-fade-in">
                <h2 className="text-2xl font-extrabold text-[#F8FAFC] mb-6 flex items-center gap-3">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Widget Customization
                </h2>

                {/* First Message */}
                <CollapsibleSection
                  title="First Message"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  }
                  defaultOpen={true}
                >
                  <div className="mt-4">
                    <textarea
                      value={botData.greetingMessage}
                      onChange={(e) => setBotData({ ...botData, greetingMessage: e.target.value })}
                      rows={3}
                      className="w-full border-2 border-white/10 bg-[#1E293B] rounded-xl px-5 py-3 text-base font-medium text-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all resize-none shadow-sm"
                      placeholder="Hi! How can I help you today?"
                    />
                    <p className="text-sm text-[#94A3B8] mt-3 font-semibold">This message appears when users first open the chatbot</p>
                  </div>
                </CollapsibleSection>

                {/* Color */}
                <CollapsibleSection
                  title="Color"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  }
                  defaultOpen={true}
                >
                  <div className="mt-4">
                    <label className="block text-sm font-extrabold text-[#F8FAFC] mb-3">
                      Primary Color
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="color"
                        value={botData.widgetColor}
                        onChange={(e) => setBotData({ ...botData, widgetColor: e.target.value })}
                        className="h-14 w-24 border-2 border-white/10 rounded-xl cursor-pointer shadow-sm"
                      />
                      <input
                        type="text"
                        value={botData.widgetColor}
                        onChange={(e) => setBotData({ ...botData, widgetColor: e.target.value })}
                        className="flex-1 border-2 border-white/10 bg-[#1E293B] rounded-xl px-5 py-3 text-base font-medium text-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
                        placeholder="#8b5cf6"
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Size */}
                <CollapsibleSection
                  title="Size"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  }
                >
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-extrabold text-[#F8FAFC] mb-3">
                        Width (px)
                      </label>
                      <input
                        type="number"
                        value={botData.widgetWidth}
                        onChange={(e) => setBotData({ ...botData, widgetWidth: e.target.value })}
                        min="300"
                        max="600"
                        className="w-full border-2 border-white/10 bg-[#1E293B] rounded-xl px-5 py-3 text-base font-medium text-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-extrabold text-[#F8FAFC] mb-3">
                        Height (px)
                      </label>
                      <input
                        type="number"
                        value={botData.widgetHeight}
                        onChange={(e) => setBotData({ ...botData, widgetHeight: e.target.value })}
                        min="400"
                        max="800"
                        className="w-full border-2 border-white/10 bg-[#1E293B] rounded-xl px-5 py-3 text-base font-medium text-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Alignment */}
                <CollapsibleSection
                  title="Position & Theme"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  }
                >
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-extrabold text-[#F8FAFC] mb-3">
                        Position
                      </label>
                      <select
                        value={botData.embedPosition}
                        onChange={(e) => setBotData({ ...botData, embedPosition: e.target.value })}
                        className="w-full border-2 border-white/10 bg-[#1E293B] rounded-xl px-5 py-3 text-base font-medium text-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
                      >
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="top-left">Top Left</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-extrabold text-[#F8FAFC] mb-3">
                        Theme
                      </label>
                      <select
                        value={botData.embedTheme}
                        onChange={(e) => setBotData({ ...botData, embedTheme: e.target.value })}
                        className="w-full border-2 border-white/10 bg-[#1E293B] rounded-xl px-5 py-3 text-base font-medium text-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
                      >
                        <option value="default">Light Theme</option>
                        <option value="dark">Dark Theme</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-extrabold text-[#F8FAFC] mb-3">
                        Avatar
                      </label>
                      <input
                        type="text"
                        value={botData.widgetAvatar}
                        onChange={(e) => setBotData({ ...botData, widgetAvatar: e.target.value })}
                        maxLength={2}
                        className="w-full border-2 border-white/10 bg-[#1E293B] rounded-xl px-5 py-3 text-base text-center text-2xl font-medium text-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
                        placeholder="😊"
                      />
                      <p className="text-sm text-[#94A3B8] mt-2 font-semibold">Emoji or text (1-2 characters)</p>
                    </div>
                  </div>
                </CollapsibleSection>
              </div>

              {/* Email Notifications */}
              <div className="glass rounded-2xl border-2 border-white/50 p-8 shadow-lift animate-fade-in">
                <h2 className="text-2xl font-extrabold text-[#F8FAFC] mb-6 flex items-center gap-3">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notifications
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 cursor-pointer bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all">
                    <input
                      type="checkbox"
                      checked={botData.emailNotifications}
                      onChange={(e) => setBotData({ ...botData, emailNotifications: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-base font-extrabold text-[#F8FAFC]">
                      Receive email notifications for new conversations
                    </span>
                  </label>
                  {botData.emailNotifications && (
                    <div className="animate-fade-in">
                      <label className="block text-sm font-extrabold text-[#F8FAFC] mb-3">
                        Email Address <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        value={botData.emailAddress}
                        onChange={(e) => setBotData({ ...botData, emailAddress: e.target.value })}
                        className="w-full border-2 border-white/10 bg-[#1E293B] rounded-xl px-5 py-3 text-base font-medium text-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
                        placeholder="you@example.com"
                        required
                      />
                      <p className="text-xs text-[#94A3B8] mt-2 font-semibold">We'll send you an email when someone starts a new conversation</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Training Data Section */}
              <div className="glass rounded-2xl border-2 border-white/50 p-8 shadow-lift animate-fade-in">
                <h2 className="text-2xl font-extrabold text-[#F8FAFC] mb-6 flex items-center gap-3">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Training Data
                </h2>

                {/* Training Text Section */}
                <div className="mb-8">
                  <label className="block text-base font-extrabold text-[#F8FAFC] mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Training Text <span className="text-[#94A3B8] text-sm">(Edit your bot's knowledge)</span>
                  </label>
                  <textarea
                    value={trainingText}
                    onChange={(e) => setTrainingText(e.target.value)}
                    rows={10}
                    className="w-full border-2 border-blue-300/50 bg-[#1E293B] rounded-xl px-6 py-4 text-[#F8FAFC] text-base font-medium focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all resize-none shadow-sm"
                    placeholder="Enter or edit the training text for your chatbot...

Example:
- Product information
- FAQs and answers  
- Company policies
- Service descriptions
- Contact information
- Any knowledge your bot should have"
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Update training data to improve responses</span>
                    </div>
                    <span className={`text-sm font-bold ${trainingText.length >= 50 ? 'text-green-600' : trainingText.length > 0 ? 'text-yellow-600' : 'text-[#94A3B8]'}`}>
                      {trainingText.length} characters
                    </span>
                  </div>
                </div>

                <div className="border-t-2 border-white/10 pt-6 mb-6">
                  <h3 className="text-lg font-extrabold text-[#F8FAFC] mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Training Documents
                  </h3>
                  {existingDocuments.length > 0 && (
                    <div className="mb-6 space-y-3">
                      {existingDocuments.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl px-5 py-3 shadow-sm"
                        >
                          <span className="text-base text-[#F8FAFC] font-bold">{doc.originalName || doc.filename}</span>
                          <button
                            onClick={() => removeDocument(index, doc.originalName || doc.filename)}
                            className="text-red-600 hover:text-red-800 text-sm font-bold px-4 py-2 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 border-2 border-transparent hover:border-red-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <FileUploader
                    onFilesSelected={handleFilesSelected}
                    uploadedFiles={uploadedFiles}
                    onFileRemove={(index) => {
                      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                    }}
                  />
                </div>
              </div>

              {/* View Training Data Section */}
              {id && (
                <div className="glass rounded-2xl border-2 border-white/50 p-8 shadow-lift animate-fade-in">
                  <h2 className="text-2xl font-extrabold text-[#F8FAFC] mb-6 flex items-center gap-3">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Training Data
                  </h2>
                  <p className="text-[#94A3B8] mb-4">
                    See all the training data (text and documents) that your chatbot is using to generate responses.
                  </p>
                  <TrainingDataViewer botId={id as string} />
                </div>
              )}

              {/* Training Action Button */}
              {(trainingText.trim() || uploadedFiles.length > 0) && (
                <div className="mb-6 animate-fade-in">
                  <button
                    onClick={handleTrainChatbot}
                    disabled={isLoading}
                    className="w-full gradient-premium text-white px-6 py-4 rounded-xl hover:shadow-glow-premium transition-all disabled:opacity-50 disabled:cursor-not-allowed font-extrabold text-base shadow-lift hover-lift flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    {isLoading ? 'Training...' : 'Train Chatbot'}
                  </button>
                  <p className="text-xs text-[#94A3B8] mt-2 text-center">
                    Click to update only the training data (text and documents)
                  </p>
                </div>
              )}

              <div className="flex gap-4 animate-fade-in flex-wrap">
                <button
                  onClick={handleUpdateBot}
                  disabled={isLoading || !botData.name || botData.name.trim().length < 2}
                  className="flex-1 gradient-premium text-white px-6 py-4 rounded-xl hover:shadow-glow-premium transition-all disabled:opacity-50 disabled:cursor-not-allowed font-extrabold text-base shadow-lift hover-lift"
                >
                  {isLoading ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-4 border-2 border-white/10 text-[#94A3B8] rounded-xl hover:bg-[#0F172A] transition-colors font-extrabold text-base hover:border-gray-400 hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this bot? This action cannot be undone.')) {
                      try {
                        setIsLoading(true);
                        await botsAPI.delete(id as string);
                        showToast('Bot deleted successfully', 'success');
                        router.push('/dashboard');
                      } catch (error) {
                        console.error('Failed to delete bot:', error);
                        showToast('Failed to delete bot', 'error');
                        setIsLoading(false);
                      }
                    }
                  }}
                  disabled={isLoading}
                  className="px-6 py-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-extrabold text-base border-2 border-transparent hover:border-red-200"
                >
                  Delete Bot
                </button>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl border-2 border-white/50 p-6 sticky top-24 shadow-lift animate-fade-in">
                <h3 className="text-xl font-extrabold text-[#F8FAFC] mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Live Preview
                </h3>
                <div className="flex justify-center">
                  <ChatbotWidgetPreview
                    greeting={botData.greetingMessage}
                    avatar={botData.widgetAvatar}
                    color={botData.widgetColor}
                    width={botData.widgetWidth}
                    height={botData.widgetHeight}
                    theme={botData.embedTheme}
                  />
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
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
      <OfflineDetector />
    </>
  );
}
