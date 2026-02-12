import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import FileUploader from '@/components/FileUploader';
import ChatbotPreview from '@/components/ChatbotPreview';
import Cookies from 'js-cookie';
import { botsAPI } from '@/lib/api';
import type { Bot } from '@/types/api';
import { showToast } from '@/components/Toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import SessionWarning from '@/components/SessionWarning';
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
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
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
          <h3 className="text-lg font-bold text-gray-900">{botName}</h3>
          <p className="text-sm text-gray-600">Online • Replies instantly</p>
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

      <div className="min-h-screen bg-gradient-premium-bg relative overflow-hidden font-sans">
        {/* Animated floating background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/15 rounded-full blur-[120px] animate-float-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-cyan-400/10 rounded-full blur-[100px] animate-float-slow" style={{ animationDelay: '4s' }}></div>
        </div>
        <div className="relative z-10">
          <Navbar />
        </div>

        <main className="px-6 py-6 relative z-10">
          {/* Header */}
          <div className="mb-8 animate-fade-in text-center">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
              Build Your AI Workforce
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
              Create, train, and deploy intelligent agents in minutes.
            </p>
          </div>

          {/* Progress Steps */}
          <StepProgressBar steps={steps} currentStep={currentStep} />

          {/* Step Content */}
          <div className="w-full max-w-[1600px] mx-auto animate-fade-in-up transition-all duration-500 pb-24">

            {/* Step 1: Create & Train Agent - Two Panel Layout */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
                {/* Left Column - Configuration (7 cols) */}
                <div className="lg:col-span-7 space-y-4">

                  {/* Identity Card */}
                  <div className="glass-panel rounded-2xl p-6 hover-lift">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 animate-glow">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">Agent Identity</h2>
                        <p className="text-sm text-gray-500 font-medium">Define your agent's persona and role</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Agent Name</label>
                        <input
                          type="text"
                          value={botData.name}
                          onChange={(e) => setBotData({ ...botData, name: e.target.value })}
                          className="glass-input w-full px-4 py-2.5 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none transition-all text-sm font-medium"
                          placeholder="e.g., Sales Helper"
                          maxLength={100}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Role Description</label>
                        <textarea
                          value={botData.description}
                          onChange={(e) => setBotData({ ...botData, description: e.target.value })}
                          rows={2}
                          className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none transition-all text-sm min-h-[80px]"
                          placeholder="Briefly describe what this agent does..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Knowledge Base Card */}
                  <div className="glass-panel rounded-2xl p-6 hover-lift">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 animate-glow">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">Knowledge Base</h2>
                        <p className="text-sm text-gray-500 font-medium">Train your agent with your own data</p>
                      </div>
                    </div>

                    {/* Knowledge Source Selection */}
                    <div className="mb-4 p-1 bg-white/50 backdrop-blur-sm rounded-xl inline-flex border border-white/60 shadow-sm">
                      <button
                        onClick={() => setTrainingMethod('text')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${trainingMethod === 'text'
                          ? 'bg-white text-primary-600 shadow-md'
                          : 'text-gray-500 hover:text-gray-800'
                          }`}
                      >
                        Raw Text
                      </button>
                      <button
                        onClick={() => setTrainingMethod('files')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${trainingMethod === 'files'
                          ? 'bg-white text-primary-600 shadow-md'
                          : 'text-gray-500 hover:text-gray-800'
                          }`}
                      >
                        Documents
                      </button>
                      <button
                        onClick={() => setTrainingMethod('both')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${trainingMethod === 'both'
                          ? 'bg-white text-primary-600 shadow-md'
                          : 'text-gray-500 hover:text-gray-800'
                          }`}
                      >
                        Both
                      </button>
                    </div>

                    {/* Text Training Area */}
                    {(trainingMethod === 'text' || trainingMethod === 'both') && (
                      <div className="mb-4">
                        <textarea
                          value={trainingText}
                          onChange={(e) => setTrainingText(e.target.value)}
                          disabled={isLoading}
                          rows={8}
                          className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none transition-all font-mono text-sm leading-relaxed"
                          placeholder={`Paste your training data here...`}
                        />
                        <div className="mt-2 flex items-center justify-between text-xs px-1">
                          <span className="text-gray-500 font-medium">Markdown Supported</span>
                          <span className={`font-bold ${trainingText.length >= 50 ? 'text-green-600' : 'text-gray-400'}`}>
                            {trainingText.length} characters
                          </span>
                        </div>
                      </div>
                    )}

                    {/* File Upload Area */}
                    {(trainingMethod === 'files' || trainingMethod === 'both') && (
                      <div className="mb-4">
                        <FileUploader
                          onFilesSelected={handleFilesSelected}
                          uploadedFiles={uploadedFiles}
                          onFileRemove={handleRemoveFile}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Status & Actions (5 cols) */}
                <div className="lg:col-span-5 space-y-3">
                  {/* Status Panel */}
                  <div className="sticky top-4 space-y-3">
                    <TrainingStatusPanel
                      trainingMethod={trainingMethod}
                      uploadedFilesCount={uploadedFiles.length}
                      trainingTextLength={trainingText.length}
                      isTraining={isLoading}
                    />

                    {/* Create Button */}
                  </div>
                </div>
                <BuilderFooter
                  onNext={handleNextStep}
                  nextLabel="Create & Train Agent"
                  showBack={false}
                  isNextDisabled={!botData.name || botData.name.trim().length < 2}
                  isLoading={isLoading}
                  loadingText={loadingMessage || "Creating Agent..."}
                />
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
                    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
                      {/* Header with Avatar - uses ChatbotContext */}
                      <ChatAvatarHeader
                        botName={createdBot.name}
                      />
                      {/* Chat Area */}
                      <div className="flex-1 p-6 flex items-center justify-center overflow-hidden">
                        <FunctionalChatbotPreview ref={chatRef} botId={createdBot.id} />
                      </div>

                      {/* Suggested Prompts - Now Functional */}
                      <div className="bg-white border-t border-gray-200 px-6 py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => chatRef.current?.sendMessage("What are your pricing options?")}
                            className="text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-700 px-3 py-1.5 rounded-full text-gray-700 transition-all hover:shadow-sm"
                          >
                            Ask about pricing
                          </button>
                          <button
                            onClick={() => chatRef.current?.sendMessage("What are your support hours?")}
                            className="text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-700 px-3 py-1.5 rounded-full text-gray-700 transition-all hover:shadow-sm"
                          >
                            Support hours
                          </button>
                          <button
                            onClick={() => chatRef.current?.sendMessage("How do I integrate this with my website?")}
                            className="text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-700 px-3 py-1.5 rounded-full text-gray-700 transition-all hover:shadow-sm"
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
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            🎉 Success! Your chatbot <span className="text-blue-700">{createdBot.name}</span> is ready!
                          </h3>
                          <p className="text-sm text-gray-600">
                            Copy the embed code below and paste it into your website's HTML to activate your AI assistant.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Embed Code Section */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Embed Code</h3>
                          <p className="text-sm text-gray-600">One-line script to add to your website</p>
                        </div>
                        <button
                          onClick={copyEmbedCode}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy Code
                        </button>
                      </div>
                      {isGeneratingScript ? (
                        <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                          <div className="flex items-center gap-3">
                            <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-sm font-semibold text-gray-700">Generating embed code...</span>
                          </div>
                        </div>
                      ) : embedCode ? (
                        <div className="relative">
                          <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
                            <code className="text-green-400 font-mono text-sm whitespace-pre-wrap break-words">{embedCode}</code>
                          </div>
                          <button
                            onClick={copyEmbedCode}
                            className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Code
                          </button>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                          <p className="text-sm text-gray-600">Generating your embed code...</p>
                        </div>
                      )}
                    </div>

                    {/* Installation Guide */}
                    <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Installation Guide
                      </h4>
                      <ol className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                          <span className="font-bold text-blue-600">1.</span>
                          <span>Copy the embed code above using the "Copy Code" button</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold text-blue-600">2.</span>
                          <span>
                            Paste it just before the closing <code className="bg-blue-200 px-1.5 py-0.5 rounded text-xs font-mono">&lt;/body&gt;</code> tag in your website's HTML
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold text-blue-600">3.</span>
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
      <SessionWarning />
      <OfflineDetector />
    </>
  );
}
