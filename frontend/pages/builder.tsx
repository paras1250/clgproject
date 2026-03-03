import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppHeader from '@/components/AppHeader';
import FileUploader from '@/components/FileUploader';
import ChatbotPreview from '@/components/ChatbotPreview';
import Cookies from 'js-cookie';
import { botsAPI } from '@/lib/api';
import type { Bot } from '@/types/api';
import { showToast } from '@/components/Toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import OfflineDetector from '@/components/OfflineDetector';
import { ChatbotProvider, useChatbot } from '@/components/chatbot-customization/ChatbotContext.jsx';
import CustomizationPanel from '@/components/chatbot-customization/CustomizationPanel.jsx';
import ChatbotPreviewCustom from '@/components/chatbot-customization/ChatbotPreview.jsx';
import FunctionalChatbotPreview from '@/components/chatbot-customization/FunctionalChatbotPreview';
import Step4Controls from '@/components/chatbot-customization/Step4Controls.jsx';
import StepProgressBar from '@/components/builder/StepProgressBar';
import TrainingStatusPanel from '@/components/builder/TrainingStatusPanel';
import PersonaInsightPanel from '@/components/builder/PersonaInsightPanel';
import TestingSuitePanel from '@/components/builder/TestingSuitePanel';
import DeploymentChecklist from '@/components/builder/DeploymentChecklist';
import BuilderFooter from '@/components/builder/BuilderFooter';

// Component that uses ChatbotContext to display the user-selected avatar
const ChatAvatarHeader = ({ botName }: { botName: string }) => {
  const { selectedAvatar } = useChatbot();
  const isImageAvatar = selectedAvatar && (selectedAvatar.startsWith('/') || selectedAvatar.startsWith('http'));

  return (
    <div className="bg-[#1E293B] border-b border-white/10 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        {isImageAvatar ? (
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border-2 border-blue-200">
            <img src={selectedAvatar} alt={botName} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl shadow-sm border-2 border-blue-200 font-bold text-white">
            {selectedAvatar}
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-[#F8FAFC]">{botName}</h3>
          <p className="text-sm text-[#94A3B8]">Online • Replies instantly</p>
        </div>
      </div>
    </div>
  );
};


export default function Builder() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [botData, setBotData] = useState({
    name: '',
    description: '',
    modelName: 'google/flan-t5-large',
  });
  const [trainingText, setTrainingText] = useState('');
  const [trainingMethod, setTrainingMethod] = useState<'text' | 'files' | 'both'>('text');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [createdBot, setCreatedBot] = useState<Bot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [embedCode, setEmbedCode] = useState('');
  const [embedSettings, setEmbedSettings] = useState({
    theme: 'default',
    position: 'bottom-right'
  });
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [creationAborted, setCreationAborted] = useState(false);
  const [showKnowledgeSidebar, setShowKnowledgeSidebar] = useState(false);

  // Ref for chat component to enable sending messages from quick prompts
  const chatRef = useRef<any>(null);

  // Customization settings state
  const [customization, setCustomization] = useState({
    avatar: '',
    greetingMessage: 'Hi! How can I help you today?',
    themeColor: '#8b5cf6',
    widgetSize: 'medium',
    alignment: 'bottom-right'
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  // Generate embed script when entering step 4 (Get Code)
  useEffect(() => {
    const generateEmbedScript = async () => {
      if (currentStep === 4 && createdBot && !embedCode) {
        setIsGeneratingScript(true);
        try {
          // Generate simple single-line embed script
          let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

          // Fix potential double protocol issues
          if (backendUrl.startsWith('http://https://')) {
            backendUrl = backendUrl.replace('http://https://', 'https://');
          } else if (backendUrl.startsWith('http://http://')) {
            backendUrl = backendUrl.replace('http://http://', 'http://');
          }

          // Remove trailing slash if present
          if (backendUrl.endsWith('/')) {
            backendUrl = backendUrl.slice(0, -1);
          }

          const simpleScript = `<script src='${backendUrl}/api/bots/${createdBot.id}/embed.js'></script>`;
          setEmbedCode(simpleScript);
        } catch (error: any) {
          console.error('Failed to generate embed script:', error);
          showToast('Failed to generate embed script. Please try again.', 'error');
        } finally {
          setIsGeneratingScript(false);
        }
      }
    };

    generateEmbedScript();
  }, [currentStep, createdBot, embedSettings]);

  // Load saved customization when entering Step 3
  useEffect(() => {
    const loadSavedCustomization = async () => {
      if (currentStep === 3 && createdBot) {
        try {
          let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          if (backendUrl.endsWith('/')) {
            backendUrl = backendUrl.slice(0, -1);
          }

          const response = await fetch(`${backendUrl}/api/bots/${createdBot.id}`, {
            headers: {
              'Authorization': `Bearer ${Cookies.get('token')}`
            }
          });

          if (response.ok) {
            const botData = await response.json();
            // Update customization state with saved data
            if (botData.widget_customization) {
              const wc = botData.widget_customization;
              setCustomization({
                avatar: wc.avatar || '',
                greetingMessage: botData.greeting_message || 'Hi! How can I help you today?',
                themeColor: wc.primaryColor || '#8b5cf6',
                widgetSize: wc.widgetSize || 'medium',
                alignment: wc.alignment || 'bottom-right'
              });
            }
          }
        } catch (error) {
          console.error('Error loading saved customization:', error);
        }
      }
    };

    loadSavedCustomization();
  }, [currentStep, createdBot]);

  // Function to save customization settings to database before proceeding to Step 3 (Test)
  const saveCustomizationAndProceed = async (customizationData: any) => {
    if (!createdBot) return;

    try {
      setLoadingMessage('Saving customization settings...');

      let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // Fix potential double protocol issues
      if (backendUrl.startsWith('http://https://')) {
        backendUrl = backendUrl.replace('http://https://', 'https://');
      } else if (backendUrl.startsWith('http://http://')) {
        backendUrl = backendUrl.replace('http://http://', 'http://');
      }

      // Remove trailing slash if present
      if (backendUrl.endsWith('/')) {
        backendUrl = backendUrl.slice(0, -1);
      }

      console.log('Saving customization:', {
        botId: createdBot.id,
        url: `${backendUrl}/api/bots/${createdBot.id}`,
        customizationData,
        hasToken: !!Cookies.get('token')
      });

      const response = await fetch(`${backendUrl}/api/bots/${createdBot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({
          widget_customization: customizationData,
          greeting_message: customizationData.greetingMessage,
          system_prompt: customizationData.systemPrompt || 'You are a helpful AI assistant.'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Customization save failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.error || 'Failed to save customization');
      }

      setLoadingMessage('');
      setCurrentStep(3); // Go to Test Agent step
    } catch (error: any) {
      console.error('Error saving customization:', error);
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        botId: createdBot?.id
      });
      setLoadingMessage('');
      showToast('Failed to save customization settings. Please try again.', 'error');
    }
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);

      // Validate file sizes
      const oversizedFiles = fileArray.filter(f => f.size > 10 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        showToast(`File "${oversizedFiles[0].name}" exceeds 10MB limit`, 'error');
        return;
      }

      // Check total number of files
      if (uploadedFiles.length + fileArray.length > 5) {
        showToast('Maximum 5 files allowed', 'error');
        return;
      }

      setUploadedFiles((prev) => [...prev, ...fileArray]);
      showToast(`${fileArray.length} file(s) added successfully`, 'success');
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    showToast('File removed', 'success');
  };

  const validateStep1 = () => {
    if (!botData.name || botData.name.trim().length < 2) {
      showToast('Please enter an agent name (at least 2 characters)', 'error');
      return false;
    }

    if (botData.name.length > 100) {
      showToast('Agent name must be less than 100 characters', 'error');
      return false;
    }

    // Training data is optional, but warn if completely empty
    const hasText = trainingText && trainingText.trim().length > 0;
    const hasFiles = uploadedFiles.length > 0;

    if (!hasText && !hasFiles) {
      showToast('Note: No training data provided. Agent will use general knowledge only.', 'warning');
    }

    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        handleCreateBot(); // Create bot immediately in Step 1
      }
    }
  };

  const handleCreateBot = async () => {
    setIsLoading(true);
    setCreationAborted(false);

    try {
      setLoadingMessage('Creating your chatbot...');

      const formData = new FormData();
      formData.append('name', botData.name.trim());
      formData.append('description', botData.description.trim());
      formData.append('modelName', botData.modelName);

      // Add training text if provided
      if (trainingText && trainingText.trim()) {
        formData.append('trainingText', trainingText.trim());
      }

      // Add files if provided
      if (uploadedFiles.length > 0) {
        setLoadingMessage('Uploading and processing documents...');
        uploadedFiles.forEach((file) => {
          formData.append('documents', file);
        });
      }

      setLoadingMessage('Setting up AI model...');

      // Create with timeout
      const createPromise = botsAPI.create(formData);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          if (!creationAborted) {
            reject(new Error('Request timeout: Bot creation took too long. Please check your internet connection and try again.'));
          }
        }, 120000); // 2 minutes timeout
      });

      const response = await Promise.race([createPromise, timeoutPromise]) as any;

      if (creationAborted) {
        return;
      }

      setCreatedBot(response.bot);

      if (uploadedFiles.length > 0 || trainingText.trim()) {
        setLoadingMessage('Training your chatbot with provided data...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (!creationAborted) {
        showToast('🎉 Agent created successfully!', 'success');
        setLoadingMessage('');
        setCurrentStep(2); // Go to Customize step
      }
    } catch (error: any) {
      if (creationAborted) {
        showToast('Bot creation cancelled', 'info');
        return;
      }

      const errorMessage = error.response?.data?.error || error.message || 'Failed to create bot. Please try again.';
      showToast(errorMessage, 'error');
      setLoadingMessage('');
    } finally {
      setIsLoading(false);
      setCreationAborted(false);
    }
  };

  const handleCancelCreation = () => {
    setCreationAborted(true);
    setIsLoading(false);
    setLoadingMessage('');
    showToast('Bot creation cancelled', 'info');
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    showToast('✓ Embed code copied to clipboard!', 'success');
  };

  if (!isAuthenticated) {
    return <LoadingSpinner fullScreen text="Authenticating..." />;
  }

  const steps = [
    { number: 1, title: 'Create & Train', desc: 'Name & Knowledge' },
    { number: 2, title: 'Customize', desc: 'Design Look' },
    { number: 3, title: 'Test Agent', desc: 'Try It Out' },
    { number: 4, title: 'Get Code', desc: 'Embed on Site' },
  ];

  return (
    <>
      <Head>
        <title>Edit Chatbot - Conversio AI</title>
      </Head>

      <div className="min-h-screen bg-[#0A0F1C] relative overflow-hidden font-sans">
        {/* Animated floating background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00F5D4]/[0.04] rounded-full blur-[120px] animate-float-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#3A86FF]/[0.04] rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-[#00F5D4]/[0.02] rounded-full blur-[100px] animate-float-slow" style={{ animationDelay: '4s' }}></div>
        </div>
        <div className="relative z-10">
          <AppHeader title="Chat Builder" breadcrumb="Dashboard / Builder" />
        </div>

        <main className="px-6 py-6 relative z-10">
          {/* Header */}
          <div className="mb-8 animate-fade-in text-center">
            <h1 className="font-sora text-3xl font-bold text-[#F1F5F9] mb-2 tracking-tight">
              Build Your AI Workforce
            </h1>
            <p className="text-base text-[#94A3B8] font-inter max-w-2xl mx-auto">
              Create, train, and deploy intelligent agents in minutes.
            </p>
          </div>

          {/* Progress Steps */}
          <StepProgressBar steps={steps} currentStep={currentStep} />

          {/* Step Content */}
          <div className="w-full max-w-[1600px] mx-auto animate-fade-in-up transition-all duration-500 pb-24">

            {/* Step 1: Create & Train Agent - Two Panel Layout */}
            {currentStep === 1 && (
              <div className="flex-1 flex flex-col items-center px-6 pt-6 min-h-[calc(100vh-220px)]">
                <div className="w-full max-w-[1150px] mx-auto px-2">

                  {/* Main Prompt Card */}
                  <div
                    className="bg-[#121826] rounded-[20px] p-10 shadow-[0_10px_30px_rgba(0,0,0,0.4)] animate-fade-in-up"
                    style={{ animationDelay: '200ms' }}
                  >

                    {/* Section 1 — Agent Name */}
                    <div className="mb-5">
                      <label className="block text-xs font-medium text-[#94A3B8] mb-2 font-inter tracking-wide uppercase">Chatbot Name</label>
                      <input
                        type="text"
                        value={botData.name}
                        onChange={(e) => setBotData({ ...botData, name: e.target.value })}
                        className="w-full bg-[#0F1629] text-[#F1F5F9] text-sm font-medium font-inter placeholder-[#64748B] focus:outline-none rounded-xl h-12 px-4 transition-all focus:shadow-[0_0_0_2px_rgba(0,245,212,0.3)]"
                        placeholder="e.g., Sales Helper, Support Bot, FAQ Agent..."
                        maxLength={100}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Section 2 — Agent Description */}
                    <div className="mb-6">
                      <label className="block text-xs font-medium text-[#94A3B8] mb-2 font-inter tracking-wide uppercase">What should this chatbot do?</label>
                      <textarea
                        value={botData.description}
                        onChange={(e) => setBotData({ ...botData, description: e.target.value })}
                        rows={3}
                        disabled={isLoading}
                        className="w-full bg-[#0F1629] text-[#F1F5F9] text-sm font-inter placeholder-[#64748B] focus:outline-none rounded-xl px-4 py-3.5 resize-none leading-relaxed transition-all focus:shadow-[0_0_0_2px_rgba(0,245,212,0.3)]"
                        placeholder="Describe its role, personality, and what it should help users with..."
                      />
                    </div>

                    {/* Divider — stronger separation before training */}
                    <div className="border-t border-white/[0.06] mb-8 mt-2"></div>

                    {/* Section 3 — Training Data (Primary Workspace) */}
                    <div className="bg-[#0B1120] rounded-2xl p-6 border border-white/[0.06] shadow-[inset_0_1px_0_rgba(0,245,212,0.04)]">
                      {/* Training method toggle */}
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-semibold text-[#E2E8F0] font-inter tracking-wide">
                          Training Data
                          <span className="ml-2 text-[10px] font-normal text-[#00F5D4]/60">— feed knowledge to your AI</span>
                        </label>
                        <div className="p-0.5 bg-[#0A0F1C] rounded-lg inline-flex">
                          <button
                            onClick={() => setTrainingMethod('text')}
                            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all duration-200 font-inter ${trainingMethod === 'text'
                              ? 'bg-[#00F5D4] text-[#0A0F1C] shadow-sm'
                              : 'text-[#64748B] hover:text-[#94A3B8]'
                              }`}
                          >
                            Text
                          </button>
                          <button
                            onClick={() => setTrainingMethod('files')}
                            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all duration-200 font-inter ${trainingMethod === 'files'
                              ? 'bg-[#00F5D4] text-[#0A0F1C] shadow-sm'
                              : 'text-[#64748B] hover:text-[#94A3B8]'
                              }`}
                          >
                            Upload
                          </button>
                          <button
                            onClick={() => setTrainingMethod('both')}
                            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all duration-200 font-inter ${trainingMethod === 'both'
                              ? 'bg-[#00F5D4] text-[#0A0F1C] shadow-sm'
                              : 'text-[#64748B] hover:text-[#94A3B8]'
                              }`}
                          >
                            Both
                          </button>
                        </div>
                      </div>

                      {/* Training text area */}
                      {(trainingMethod === 'text' || trainingMethod === 'both') && (
                        <div className="bg-[#0F1629] rounded-xl p-[18px] mb-3 border border-white/[0.04]">
                          <textarea
                            value={trainingText}
                            onChange={(e) => setTrainingText(e.target.value)}
                            disabled={isLoading}
                            rows={8}
                            className="w-full bg-transparent text-[#F1F5F9] text-sm font-inter placeholder-[#64748B] focus:outline-none resize-none min-h-[220px] max-h-[400px] leading-relaxed"
                            placeholder="Paste training content, FAQs, product info, or any knowledge your AI should know..."
                          />
                          <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                            <span className="text-[10px] text-[#64748B] font-inter">Supports markdown</span>
                            <span className={`text-[10px] font-semibold font-inter ${trainingText.length >= 50 ? 'text-[#10B981]' : 'text-[#64748B]'}`}>
                              {trainingText.length} chars
                            </span>
                          </div>
                        </div>
                      )}

                      {/* File upload area */}
                      {(trainingMethod === 'files' || trainingMethod === 'both') && (
                        <div className="mb-3">
                          <FileUploader
                            onFilesSelected={handleFilesSelected}
                            uploadedFiles={uploadedFiles}
                            onFileRemove={handleRemoveFile}
                          />
                        </div>
                      )}

                      {/* Bottom Action Bar */}
                      <div className="flex items-center justify-between pt-3">
                        {/* Left — file picker shortcut + badges */}
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            id="quickFileInput"
                            className="hidden"
                            multiple
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) => handleFilesSelected(e.target.files)}
                          />
                          <button
                            onClick={() => document.getElementById('quickFileInput')?.click()}
                            className="flex items-center gap-1.5 text-[#64748B] hover:text-[#00F5D4] transition-colors duration-200 text-xs font-inter"
                            title="Attach files"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span>Attach</span>
                          </button>

                          {/* Inline badges */}
                          {uploadedFiles.length > 0 && (
                            <span className="text-[10px] bg-[#00F5D4]/10 text-[#00F5D4] px-2 py-0.5 rounded-full font-medium font-inter">
                              {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        {/* Right — Send Button */}
                        <button
                          onClick={handleNextStep}
                          disabled={!botData.name || botData.name.trim().length < 2 || isLoading}
                          className="w-11 h-11 rounded-full bg-[#00F5D4] hover:bg-[#00D9C0] text-[#0A0F1C] flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed btn-hover-scale shadow-lg shadow-[#00F5D4]/20"
                        >
                          {isLoading ? (
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Loading Message */}
                  {isLoading && loadingMessage && (
                    <div className="text-center mt-4 animate-fade-in">
                      <p className="text-sm text-[#00F5D4] font-medium font-inter">{loadingMessage}</p>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <p className="text-center text-xs text-[#64748B] mt-5 font-inter animate-fade-in" style={{ animationDelay: '300ms' }}>
                    AI can make mistakes. Please verify important information.
                  </p>
                </div>
              </div>
            )}



            {/* Step 2: Customize Agent */}
            {
              currentStep === 2 && createdBot && (
                <div className="h-screen overflow-hidden">
                  {/* Original Dashboard - Exact Copy */}
                  <ChatbotProvider botId={createdBot.id}>
                    <div className="relative h-full">
                      {/* New Controls Component inside Provider */}
                      <Step4Controls
                        onBack={() => setCurrentStep(1)}
                        onSave={saveCustomizationAndProceed}
                      />

                      <div className="flex h-screen overflow-hidden">
                        <CustomizationPanel />
                        <ChatbotPreviewCustom />
                      </div>
                    </div>
                  </ChatbotProvider>
                </div>
              )
            }

            {/* Step 3: Test Agent - Three Panel Layout */}
            {
              currentStep === 3 && createdBot && (
                <div className="h-[700px] flex">
                  <ChatbotProvider botId={createdBot.id}>
                    {/* Left Panel - Persona Insight */}
                    <div className="w-80">
                      <PersonaInsightPanel
                        botName={createdBot.name}
                        botDescription={createdBot.description}
                        avatar={customization.avatar}
                        systemPrompt={(createdBot as any).system_prompt || 'You are a helpful AI assistant.'}
                        documentsCount={uploadedFiles.length}
                        trainingTextLength={trainingText.length}
                      />
                    </div>

                    {/* Center Panel - Chat Preview */}
                    <div className="flex-1 flex flex-col bg-[#0A0F1C]">
                      {/* Header with Avatar - uses ChatbotContext */}
                      <ChatAvatarHeader
                        botName={createdBot.name}
                      />
                      {/* Chat Area */}
                      <div className="flex-1 p-6 flex items-center justify-center overflow-hidden">
                        <FunctionalChatbotPreview ref={chatRef} botId={createdBot.id} />
                      </div>

                      {/* Suggested Prompts - Now Functional */}
                      <div className="bg-[#121826] border-t border-white/[0.06] px-6 py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => chatRef.current?.sendMessage("What are your pricing options?")}
                            className="text-xs bg-white/5 hover:bg-[#00F5D4]/10 hover:text-[#00F5D4] px-3 py-1.5 rounded-full text-[#94A3B8] transition-all font-inter"
                          >
                            Ask about pricing
                          </button>
                          <button
                            onClick={() => chatRef.current?.sendMessage("What are your support hours?")}
                            className="text-xs bg-white/5 hover:bg-[#00F5D4]/10 hover:text-[#00F5D4] px-3 py-1.5 rounded-full text-[#94A3B8] transition-all font-inter"
                          >
                            Support hours
                          </button>
                          <button
                            onClick={() => chatRef.current?.sendMessage("How do I integrate this with my website?")}
                            className="text-xs bg-white/5 hover:bg-[#00F5D4]/10 hover:text-[#00F5D4] px-3 py-1.5 rounded-full text-[#94A3B8] transition-all font-inter"
                          >
                            Integration help
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel - Testing Suite */}
                    <TestingSuitePanel
                      onTestPrompt={(prompt) => chatRef.current?.sendMessage(prompt)}
                      onProceedToEmbed={() => setCurrentStep(4)}
                    />
                  </ChatbotProvider>
                </div>
              )
            }

            {/* Step 4: Get Code - Two Panel Layout */}
            {
              currentStep === 4 && createdBot && (
                <div className="flex gap-8 p-8 min-h-[600px] mb-20">
                  {/* Left Panel - Code & Installation */}
                  <div className="flex-1 space-y-6 max-w-5xl">
                    {/* Success Message */}
                    <div className="bg-[#121826] rounded-xl p-6 border border-[#00F5D4]/20 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#00F5D4] to-[#3A86FF] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <svg className="w-6 h-6 text-[#0A0F1C]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-sora text-xl font-bold text-[#F1F5F9] mb-2">
                            🎉 Success! Your chatbot <span className="text-[#00F5D4]">{createdBot.name}</span> is ready!
                          </h3>
                          <p className="text-sm text-[#94A3B8] font-inter">
                            Copy the embed code below and paste it into your website's HTML to activate your AI assistant.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Embed Code Section */}
                    <div className="bg-[#121826] rounded-xl p-6 border border-white/[0.06] shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-sora text-lg font-bold text-[#F1F5F9]">Embed Code</h3>
                          <p className="text-sm text-[#94A3B8] font-inter">One-line script to add to your website</p>
                        </div>
                        <button
                          onClick={copyEmbedCode}
                          className="px-4 py-2 bg-gradient-to-r from-[#00F5D4] to-[#3A86FF] text-[#0A0F1C] rounded-lg hover:shadow-lg hover:shadow-[#00F5D4]/15 transition-all font-semibold text-sm flex items-center gap-2 font-inter"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy Code
                        </button>
                      </div>
                      {isGeneratingScript ? (
                        <div className="bg-white/5 rounded-lg p-8 flex items-center justify-center">
                          <div className="flex items-center gap-3">
                            <svg className="animate-spin h-6 w-6 text-[#00F5D4]" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-sm font-semibold text-[#94A3B8]">Generating embed code...</span>
                          </div>
                        </div>
                      ) : embedCode ? (
                        <div className="relative">
                          <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
                            <code className="text-green-400 font-mono text-sm whitespace-pre-wrap break-words">{embedCode}</code>
                          </div>
                          <button
                            onClick={copyEmbedCode}
                            className="absolute top-3 right-3 bg-[#00F5D4] hover:bg-[#00D9C0] text-[#0A0F1C] px-4 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-2 font-inter"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Code
                          </button>
                        </div>
                      ) : (
                        <div className="bg-[#0A0F1C] rounded-lg p-8 text-center">
                          <p className="text-sm text-[#94A3B8]">Generating your embed code...</p>
                        </div>
                      )}
                    </div>

                    {/* Installation Guide */}
                    <div className="bg-[#121826] rounded-lg p-5 border border-white/[0.06]">
                      <h4 className="font-sora font-bold text-[#F1F5F9] mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#00F5D4]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Installation Guide
                      </h4>
                      <ol className="space-y-2 text-sm text-[#94A3B8] font-inter">
                        <li className="flex gap-2">
                          <span className="font-bold text-[#00F5D4]">1.</span>
                          <span>Copy the embed code above using the "Copy Code" button</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold text-[#00F5D4]">2.</span>
                          <span>
                            Paste it just before the closing <code className="bg-[#00F5D4]/10 text-[#00F5D4] px-1.5 py-0.5 rounded text-xs font-mono">&lt;/body&gt;</code> tag in your website's HTML
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold text-[#00F5D4]">3.</span>
                          <span>Save and publish your website - the chatbot will appear automatically!</span>
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Right Panel - Deployment Checklist */}
                  <div className="w-[420px] flex-shrink-0">
                    <DeploymentChecklist
                      documentsCount={uploadedFiles.length}
                      isCustomized={true}
                      isTested={true}
                    />
                  </div>

                  <BuilderFooter
                    onBack={() => setCurrentStep(3)}
                    onNext={() => router.push('/dashboard')}
                    nextLabel="Go to Dashboard"
                    backLabel="Back to Test"
                  />
                </div>
              )
            }
          </div >
        </main >
      </div >
      <OfflineDetector />
    </>
  );
}
