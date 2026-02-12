const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Bot = require('../models/bot');
const ChatLog = require('../models/chatlog');
const authMiddleware = require('../middleware/auth');
const axios = require('axios');
const { sanitizeString, sanitizeRequestBody } = require('../utils/sanitize');
const { ErrorResponses } = require('../utils/errors');
const { processDocumentsForBot, getRelevantContext } = require('../utils/documentProcessor');
const { sendNotificationIfEnabled } = require('../utils/emailService');
const { botCreationLimiter, chatLimiter, uploadLimiter } = require('../middleware/rateLimit');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 5, // Maximum 5 files at once
    fieldSize: 50 * 1024 * 1024, // 50MB limit for form fields (training text)
    fields: 20, // Maximum number of non-file fields
    fieldNameSize: 100 // Maximum field name size
  },
  fileFilter: (req, file, cb) => {
    // Strict MIME type checking with extension validation
    const allowedMimeTypes = {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    };

    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    // Check if MIME type is allowed
    if (allowedMimeTypes[mime]) {
      // Verify extension matches MIME type
      if (allowedMimeTypes[mime].includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error(`File extension ${ext} does not match MIME type ${mime}`));
      }
    } else {
      cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
    }
  }
});

// Create a new chatbot
router.post('/create', authMiddleware, botCreationLimiter, uploadLimiter, upload.array('documents', 5), async (req, res) => {
  try {
    // Log request info in development
    console.log('📝 Bot creation request user:', req.user);
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Bot creation request:', {
        hasFiles: !!req.files && req.files.length > 0,
        fileCount: req.files ? req.files.length : 0,
        bodyKeys: Object.keys(req.body),
        trainingTextLength: req.body.trainingText ? req.body.trainingText.length : 0
      });
    }

    // Sanitize input
    const sanitizedBody = sanitizeRequestBody(req.body, ['documents']);
    let { name, description, modelName, trainingText, systemPrompt } = sanitizedBody;

    // Sanitize name and description
    name = sanitizeString(name);
    description = description ? sanitizeString(description) : '';
    modelName = modelName ? sanitizeString(modelName) : 'llama-3.3-70b-versatile';
    trainingText = trainingText ? sanitizeString(trainingText) : '';

    if (!name || name.length < 2) {
      return ErrorResponses.VALIDATION_ERROR(res, 'Bot name is required and must be at least 2 characters long');
    }

    if (name.length > 100) {
      return ErrorResponses.VALIDATION_ERROR(res, 'Bot name must be less than 100 characters');
    }

    // Validate training data - must have at least text or files
    const hasTrainingText = trainingText && trainingText.trim().length > 0;
    const hasFiles = req.files && req.files.length > 0;

    if (!hasTrainingText && !hasFiles) {
      return ErrorResponses.VALIDATION_ERROR(res, 'Please provide training data: add training text or upload documents');
    }

    // Generate unique embed code
    const embedCode = generateEmbedCode();

    const documents = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      uploadDate: new Date().toISOString()
    })) : [];

    // Prepare document_contents array with training text if provided
    // Chunk training text for better retrieval (optimized for large text)
    const documentContents = [];
    if (hasTrainingText) {
      const { chunkDocumentContent } = require('../utils/documentProcessor');
      const trimmedText = trainingText.trim();

      // For very large text (>5000 chars), skip chunking during creation to speed up
      // Chunks will be generated on-the-fly when needed
      const chunks = trimmedText.length > 5000
        ? [] // Defer chunking for very large text
        : await chunkDocumentContent(trimmedText);

      if (process.env.NODE_ENV === 'development') {
        console.log(`📝 Processing training text: ${trimmedText.length} chars, ${chunks.length} chunks`);
      }

      documentContents.push({
        type: 'text',
        content: trimmedText,
        chunks: chunks, // Pre-chunk for faster retrieval (or empty for large text)
        uploadDate: new Date().toISOString()
      });
    }

    // Add timeout wrapper for database operations
    const createBotWithTimeout = async () => {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Database operation timeout: Bot creation took too long. Please check your database connection and try again.'));
        }, 30000); // 30 second timeout for database operations
      });

      const createPromise = Bot.create({
        user: req.user.id,
        name,
        description,
        documents,
        document_contents: documentContents.length > 0 ? documentContents : undefined,
        model_name: modelName || 'llama-3.3-70b-versatile',
        embed_code: embedCode,
        system_prompt: systemPrompt ? sanitizeString(systemPrompt) : undefined
      });

      return Promise.race([createPromise, timeoutPromise]);
    };

    const bot = await createBotWithTimeout();

    // Process documents asynchronously (don't wait)
    if (req.files && req.files.length > 0) {
      processDocumentsForBot(bot.id, req.files)
        .then(results => {
          console.log(`✅ Document processing completed for new bot ${bot.id}: ${results.length} documents processed`);
        })
        .catch(err => {
          console.error(`❌ Error processing documents for new bot ${bot.id}:`, err);
          console.error('   Bot was created but documents may not be processed yet.');
        });
    }

    res.status(201).json({
      message: 'Chatbot created successfully',
      bot: {
        id: bot.id,
        name: bot.name,
        embedCode: bot.embed_code,
        createdAt: bot.created_at
      }
    });
  } catch (error) {
    console.error('Bot creation error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack?.substring(0, 500)
    });

    // Provide more specific error messages
    let errorMessage = 'Failed to create chatbot. Please try again.';
    let statusCode = 500;

    // Check for specific error types
    if (error.code === '23505') {
      // Unique constraint violation (duplicate embed code - very rare)
      errorMessage = 'A chatbot with this configuration already exists. Please try again.';
      statusCode = 409;
    } else if (error.code === '23502') {
      // Not null constraint violation
      errorMessage = 'Missing required fields. Please check your input and try again.';
      statusCode = 422;
    } else if (error.code === '42703' || error.code === 'MIGRATION_REQUIRED') {
      // Column doesn't exist (schema issue) - needs migration
      errorMessage = 'Database migration required. Please run the migration script to add missing columns.';
      console.error('Schema error - column missing:', error.message);
      console.error('Run: backend/add-columns-migration.sql in Supabase SQL Editor');
      statusCode = 503; // Service Unavailable
    } else if (error.message) {
      // Use error message if available
      errorMessage = `Error: ${error.message}`;
    }

    // In development, include more details
    if (process.env.NODE_ENV === 'development') {
      return res.status(statusCode).json({
        error: errorMessage,
        details: error.message || error.toString(),
        code: error.code
      });
    }

    return res.status(statusCode).json({
      error: errorMessage
    });
  }
});

// Get all bots for a user
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const bots = await Bot.findByUserId(req.user.id);

    // Format response
    const formattedBots = bots.map(bot => ({
      id: bot.id,
      name: bot.name,
      description: bot.description,
      createdAt: bot.created_at,
      isActive: bot.is_active,
      embedCode: bot.embed_code
    }));

    res.json({ bots: formattedBots });
  } catch (error) {
    console.error('Bot list error:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

// ============================================================================
// IFRAME-BASED EMBED SYSTEM
// ============================================================================

// Public endpoint: Serve standalone chatbot widget HTML page (for iframe embedding)
router.get('/:id/widget', async (req, res) => {
  try {
    const botId = req.params.id;

    // Get bot details (public endpoint, no auth required)
    // Updated to use Mongoose model instead of Supabase
    const bot = await Bot.findById(botId);

    if (!bot || !bot.is_active) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Chatbot Not Found</title></head>
        <body style="font-family: sans-serif; padding: 20px; text-align: center;">
          <h2>Chatbot not found or inactive</h2>
        </body>
        </html>
      `);
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const widgetCustomization = bot.widget_customization || {};
    const primaryColor = widgetCustomization.primaryColor || '#8b5cf6';

    // Convert avatar path to absolute URL for external websites
    let avatarUrl = widgetCustomization.avatar || '🤖';
    if (avatarUrl.startsWith('/avatars/')) {
      // Convert relative path to absolute URL
      avatarUrl = `${backendUrl}${avatarUrl}`;
    }
    const greetingMessage = bot.greeting_message || 'Hi! How can I help you today?';
    const width = widgetCustomization.width || '380';
    const height = widgetCustomization.height || '600';
    const botName = bot.name || 'AI Assistant';

    // Generate complete standalone HTML page for the widget
    const widgetHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${botName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: transparent;
      height: 100vh;
      overflow: hidden;
    }
    
    .chatbot-container {
      display: flex;
      flex-direction: column;
      width: ${width}px;
      max-width: 100%;
      height: ${height}px;
      max-height: 100vh;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    }
    
    .chatbot-header {
      background: ${primaryColor};
      color: white;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-shrink: 0;
      border-radius: 16px 16px 0 0;
    }
    
    .chatbot-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-center: center;
      font-size: 20px;
      overflow: hidden;
      border: 2px solid white;
    }
    
    .chatbot-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .chatbot-title {
      font-weight: 600;
      font-size: 16px;
    }
    
    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }
    
    .close-btn:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #f9fafb;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .message {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 12px;
      word-wrap: break-word;
      animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .message-bot {
      align-self: flex-start;
      background: #f3f4f6;
      color: #374151;
      border-radius: 16px;
      border-top-left-radius: 4px;
    }
    
    .message-user {
      align-self: flex-end;
      background: ${primaryColor};
      color: white;
      border-radius: 16px;
      border-bottom-right-radius: 4px;
    }
    
    .message-typing {
      display: flex;
      gap: 4px;
      padding: 16px;
    }
    
    .typing-dot {
      width: 8px;
      height: 8px;
      background: #9ca3af;
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-8px); }
    }
    
    .chatbot-input-area {
      padding: 16px;
      background: white;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }
    
    .chatbot-input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 24px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    
    .chatbot-input:focus {
      border-color: ${primaryColor};
    }
    
    .chatbot-send {
      padding: 12px 20px;
      background: linear-gradient(135deg, ${primaryColor}, ${adjustColorForWidget(primaryColor, 15)});
      color: white;
      border: none;
      border-radius: 24px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, opacity 0.2s;
    }
    
    .chatbot-send:hover:not(:disabled) {
      transform: scale(1.05);
    }
    
    .chatbot-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .error-message {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }
  </style>
</head>
<body>
  <div class="chatbot-container">
    <div class="chatbot-header">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div class="chatbot-avatar">${avatarUrl.startsWith('http') ? `<img src="${avatarUrl}" alt="Avatar" />` : avatarUrl}</div>
        <div class="chatbot-title">${botName}</div>
      </div>
      <button class="close-btn" onclick="parent.postMessage('closeChatbot', '*')" aria-label="Close chat">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    
    <div class="chatbot-messages" id="messages">
      <div class="message message-bot">${escapeHtmlForWidget(greetingMessage)}</div>
    </div>
    
    <!-- ChatInput component structure -->
    <div style="border-top: 1px solid #e5e7eb; background: white; border-radius: 0 0 16px 16px;">
      <div style="padding: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; background: #f3f4f6; border-radius: 9999px; padding: 8px 16px; ">
          <button style="color: #6b7280; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;" onmouseover="this.style.color='#374151'" onmouseout="this.style.color='#6b7280'">
            <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
            </svg>
          </button>
          <input type="text" id="messageInput" placeholder="Type here" autocomplete="off" style="flex: 1; background: transparent; outline: none; font-size: 14px; color: #1f2937; border: none;" />
          <button id="sendButton" style="color: #6b7280; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;" onmouseover="this.style.color='#374151'" onmouseout="this.style.color='#6b7280'">
            <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </div>
      </div>
      <div style="padding: 0 16px 12px; text-align: center;">
        <p style="font-size: 12px; color: #6b7280;">
          This chat is recorded. By chatting, you agree to the <a href="#" style="color: #2563eb; text-decoration: none;">AI Terms</a>.
        </p>
      </div>
    </div>
  </div>

  <script>
    (function() {
      var config = {
        backendUrl: '${backendUrl}',
        embedCode: '${bot.embed_code}',
        botId: '${botId}'
      };
      
      var messagesDiv = document.getElementById('messages');
      var inputField = document.getElementById('messageInput');
      var sendButton = document.getElementById('sendButton');
      var sessionId = null;
      
      function addMessage(content, isUser) {
        var div = document.createElement('div');
        div.className = 'message ' + (isUser ? 'message-user' : 'message-bot');
        div.textContent = content;
        messagesDiv.appendChild(div);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
      
      function showTyping() {
        var div = document.createElement('div');
        div.className = 'message message-bot message-typing';
        div.id = 'typing-indicator';
        div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        messagesDiv.appendChild(div);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
      
      function hideTyping() {
        var typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
      }
      
      function sendMessage() {
        var message = inputField.value.trim();
        if (!message) return;
        
        addMessage(message, true);
        inputField.value = '';
        inputField.disabled = true;
        sendButton.disabled = true;
        showTyping();
        
        fetch(config.backendUrl + '/api/bots/embed/' + config.embedCode + '/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: message, sessionId: sessionId })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
          hideTyping();
          if (data.sessionId) sessionId = data.sessionId;
          addMessage(data.response || 'Sorry, I could not process that.', false);
        })
        .catch(function(err) {
          hideTyping();
          console.error('Chat error:', err);
          var div = document.createElement('div');
          div.className = 'message message-bot error-message';
          div.textContent = 'Sorry, there was an error. Please try again.';
          messagesDiv.appendChild(div);
        })
        .finally(function() {
          inputField.disabled = false;
          sendButton.disabled = false;
          inputField.focus();
        });
      }
      
      sendButton.onclick = sendMessage;
      inputField.onkeypress = function(e) {
        if (e.key === 'Enter') sendMessage();
      };
      
      // Focus input on load
      inputField.focus();
    })();
  </script>
</body>
</html>
`;

    // Set headers for iframe embedding
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.removeHeader('Content-Security-Policy');
    res.send(widgetHTML);

  } catch (error) {
    console.error('Widget page error:', error);
    res.status(500).send('Error loading widget');
  }
});

// Public endpoint: Generate iframe-based embed loader script
router.get('/:id/embed.js', async (req, res) => {
  try {
    const botId = req.params.id;

    // Get bot details (public endpoint)
    // Updated to use Mongoose model instead of Supabase
    // We need to check is_active as well
    const bot = await Bot.findOne({ _id: botId, is_active: true });

    if (!bot) {
      res.setHeader('Content-Type', 'application/javascript');
      return res.send(`console.error('[Chatbot] Bot not found or inactive');`);
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const widgetCustomization = bot.widget_customization || {};
    const primaryColor = widgetCustomization.primaryColor || '#8b5cf6';
    const position = widgetCustomization.position || 'bottom-right';
    const width = widgetCustomization.width || '380';
    const height = widgetCustomization.height || '600';

    // Get avatar and convert to absolute URL
    let avatarUrl = widgetCustomization.avatar || '🤖';
    if (avatarUrl.startsWith('/avatars/')) {
      avatarUrl = `${backendUrl}${avatarUrl}`;
    }
    const botName = bot.name || 'Assistant';

    // Calculate position styles
    const positionStyles = {
      'bottom-right': 'bottom: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;',
      'top-right': 'top: 20px; right: 20px;',
      'top-left': 'top: 20px; left: 20px;'
    };
    const posStyle = positionStyles[position] || positionStyles['bottom-right'];

    // Calculate button position (same corner as widget)
    const buttonPosStyle = posStyle;

    // Generate the iframe-based loader script
    const loaderScript = `
(function() {
  'use strict';
  
  // Configuration
  var config = {
    botId: '${botId}',
    widgetUrl: '${backendUrl}/api/bots/${botId}/widget',
    primaryColor: '${primaryColor}',
    width: ${parseInt(width)},
    height: ${parseInt(height)},
    avatarUrl: '${avatarUrl}',
    botName: '${botName}'
  };
  
  // Wait for DOM to be ready
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }
  
  ready(function() {
    // Prevent duplicate initialization
    if (document.getElementById('ai-chatbot-widget-' + config.botId)) {
      console.log('[Chatbot] Already initialized');
      return;
    }
    
    var isOpen = false;
    
    // Create toggle button with avatar (matches preview exactly)
    var toggleBtn = document.createElement('button');
    toggleBtn.id = 'ai-chatbot-toggle-' + config.botId;
    toggleBtn.setAttribute('aria-label', 'Open chat');
    
    // Use avatar image instead of SVG icon
    var avatarImg = document.createElement('img');
    avatarImg.src = config.avatarUrl;
    avatarImg.alt = 'Open chat';
    avatarImg.style.cssText = 'width: 100%; height: 100%; border-radius: 50%; object-fit: cover;';
    toggleBtn.appendChild(avatarImg);
    
    // Match preview styling: 64px, solid color, white border
    toggleBtn.style.cssText = 'position: fixed; ${buttonPosStyle} z-index: 2147483646; width: 64px; height: 64px; border-radius: 50%; border: 4px solid ${primaryColor}; background: ${primaryColor}; cursor: pointer; box-shadow: 0 8px 30px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; padding: 0; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s;';
    
    toggleBtn.onmouseover = function() { 
      this.style.transform = 'scale(1.1)'; 
      this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'; 
    };
    toggleBtn.onmouseout = function() { 
      this.style.transform = 'scale(1)'; 
      this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; 
    };
    
    // Create iframe container
    var iframe = document.createElement('iframe');
    iframe.id = 'ai-chatbot-widget-' + config.botId;
    iframe.src = config.widgetUrl;
    iframe.setAttribute('allow', 'microphone');
    iframe.style.cssText = 'position: fixed; ${posStyle.replace(/20px/g, '90px')} z-index: 2147483647; width: ' + config.width + 'px; height: ' + config.height + 'px; border: none; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.2); display: none; max-width: calc(100vw - 40px); max-height: calc(100vh - 110px);';
    
    // Toggle functionality - hide launcher when chat is open
    toggleBtn.onclick = function() {
      isOpen = !isOpen;
      iframe.style.display = isOpen ? 'block' : 'none';
      toggleBtn.style.display = isOpen ? 'none' : 'flex';
      toggleBtn.setAttribute('aria-label', isOpen ? 'Close chat' : 'Open chat');
    };
    
    // Listen for close message from iframe widget
    window.addEventListener('message', function(e) {
      if (e.data === 'closeChatbot') {
        isOpen = false;
        iframe.style.display = 'none';
        toggleBtn.style.display = 'flex';
      }
    });
    
    // Append to body
    document.body.appendChild(toggleBtn);
    document.body.appendChild(iframe);
    
    console.log('[Chatbot] Widget initialized successfully');
  });
  
  // Color adjustment helper
  function adjustColor(color, percent) {
    var num = parseInt(color.replace('#', ''), 16);
    var amt = Math.round(2.55 * percent);
    var R = Math.min(255, Math.max(0, (num >> 16) + amt));
    var G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
    var B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  }
})();
`;

    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.send(loaderScript);

  } catch (error) {
    console.error('Embed script error:', error);
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`console.error('[Chatbot] Failed to load: ${error.message}');`);
  }
});

// Helper functions for widget HTML generation
function adjustColorForWidget(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function escapeHtmlForWidget(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// ============================================================================
// END IFRAME-BASED EMBED SYSTEM
// ============================================================================

// Public chat endpoint for embedded bots (no authentication required, uses embed code)
router.post('/embed/:embedCode/chat', async (req, res) => {
  try {
    const embedCode = req.params.embedCode;

    // Sanitize input
    const sanitizedBody = sanitizeRequestBody(req.body);
    let { message, sessionId } = sanitizedBody;

    // Sanitize message
    message = sanitizeString(message);
    sessionId = sessionId ? sanitizeString(sessionId) : undefined;

    if (!message || message.trim().length === 0) {
      return ErrorResponses.BAD_REQUEST(res, 'Message is required');
    }

    if (message.length > 5000) {
      return ErrorResponses.VALIDATION_ERROR(res, 'Message must be less than 5000 characters');
    }

    // Find bot by embed code
    const bot = await Bot.findOne({
      embed_code: embedCode,
      is_active: true
    });

    if (!bot) {
      return ErrorResponses.NOT_FOUND(res, 'Bot not found or inactive');
    }

    // Get relevant context from documents if available
    let context = null;
    let enhancedMessage = message;
    let hasTrainingData = false;

    // Log bot data in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🤖 Embed chat request for bot:', {
        botId: bot.id,
        hasDocumentContents: !!bot.document_contents,
        documentContentsLength: bot.document_contents ? bot.document_contents.length : 0
      });
    }

    if (bot.document_contents && bot.document_contents.length > 0) {
      hasTrainingData = true;

      // First try to get relevant chunks
      try {
        context = await getRelevantContext(bot.id, message);
      } catch (error) {
        console.error('Error getting relevant context (embed):', error);
        context = null; // Fall through to use fallback
      }

      if (context) {
        // For Gemini: Use system instruction format
        // For Hugging Face: Use enhanced message format
        enhancedMessage = {
          systemInstruction: `You are an AI assistant for the "${bot.name}" chatbot.

This chatbot is described as: "${bot.description || 'A helpful assistant'}".

Your task is to answer questions *only* using the context below.

CRITICAL RULES:
1. You MUST answer using ONLY the information from the context provided below
2. If the answer cannot be found in the context, you MUST say: "I'm sorry, I don't have enough information to answer that."
3. Do NOT use any external knowledge, general knowledge, or assumptions
4. Do NOT make up information that is not in the context
5. Be polite, clear, and concise
6. If the question is about something not in the context, acknowledge it immediately

Here is the context:

---

${context}

---`,
          userMessage: message
        };
      } else {
        // If no context found but training data exists, use ALL training data (text + documents)
        const allTrainingContent = [];

        bot.document_contents.forEach(doc => {
          // Include training text
          if (doc.type === 'text' && doc.content) {
            allTrainingContent.push(doc.content);
          }
          // Include uploaded documents content
          else if (doc.content && !doc.type) {
            allTrainingContent.push(doc.content);
          }
          // Fallback: if document has chunks but no full content, use first chunk
          else if (doc.chunks && doc.chunks.length > 0) {
            allTrainingContent.push(doc.chunks[0]);
          }
        });

        const allTrainingText = allTrainingContent.join('\n\n');

        if (allTrainingText && allTrainingText.trim().length > 0) {
          // Use first 3000 chars to ensure we fit in prompt (increased from 2000)
          const trainingDataToUse = allTrainingText.substring(0, 3000);

          // For Gemini: Use system instruction format
          // For Hugging Face: Use enhanced message format
          enhancedMessage = {
            systemInstruction: `You are an AI assistant for the "${bot.name}" chatbot.

This chatbot is described as: "${bot.description || 'A helpful assistant'}".

Your task is to answer questions *only* using the context below.

CRITICAL RULES:
1. You MUST answer using ONLY the information from the context provided below
2. If the answer cannot be found in the context, you MUST say: "I'm sorry, I don't have enough information to answer that."
3. Do NOT use any external knowledge, general knowledge, or assumptions
4. Do NOT make up information that is not in the context
5. Be polite, clear, and concise
6. If the question is about something not in the context, acknowledge it immediately

Here is the context:

---

${trainingDataToUse}

---`,
            userMessage: message
          };
        }
      }

      // Log in development to verify training data is being sent
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Training data being used (embed):', {
          hasTrainingData: true,
          contextLength: context ? context.length : 0,
          hasSystemInstruction: typeof enhancedMessage === 'object' && !!enhancedMessage.systemInstruction,
          messageLength: typeof enhancedMessage === 'object' ? enhancedMessage.userMessage?.length : (typeof enhancedMessage === 'string' ? enhancedMessage.length : 0)
        });
      }
    } else {
      // Log if no training data
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️  No training data found for bot (embed):', bot.id);
      }
    }

    // Ensure we have training data in the message if it exists
    if (hasTrainingData && (typeof enhancedMessage === 'string' || (typeof enhancedMessage === 'object' && !enhancedMessage.systemInstruction))) {
      console.warn('⚠️  Training data exists but was not included in message (embed)! This should not happen.');
      // Force use of training data
      const allTrainingContent = [];
      bot.document_contents.forEach(doc => {
        if (doc.type === 'text' && doc.content) {
          allTrainingContent.push(doc.content);
        } else if (doc.content) {
          allTrainingContent.push(doc.content);
        } else if (doc.chunks && doc.chunks.length > 0) {
          allTrainingContent.push(doc.chunks.join(' '));
        }
      });
      if (allTrainingContent.length > 0) {
        const trainingDataToUse = allTrainingContent.join('\n\n').substring(0, 3000);
        enhancedMessage = {
          systemInstruction: `You are an AI assistant for the "${bot.name}" chatbot.

This chatbot is described as: "${bot.description || 'A helpful assistant'}".

Your task is to answer questions *only* using the context below.

CRITICAL RULES:
1. You MUST answer using ONLY the information from the context provided below
2. If the answer cannot be found in the context, you MUST say: "I'm sorry, I don't have enough information to answer that."
3. Do NOT use any external knowledge, general knowledge, or assumptions
4. Do NOT make up information that is not in the context
5. Be polite, clear, and concise
6. If the question is about something not in the context, acknowledge it immediately

Here is the context:

---

${trainingDataToUse}

---`,
          userMessage: message
        };
      }
    }

    // Call AI model API (Hugging Face or Gemini)
    const modelName = bot.model_name || bot.modelName || 'google/flan-t5-large';

    // Prepare message format based on model type
    let messageToSend = enhancedMessage;
    let systemInstruction = bot.system_prompt || 'You are a helpful AI assistant.';

    if (typeof enhancedMessage === 'object' && enhancedMessage.systemInstruction) {
      // Gemini format: separate system instruction and user message
      systemInstruction = enhancedMessage.systemInstruction;
      messageToSend = enhancedMessage.userMessage;
    } else if (typeof enhancedMessage === 'string' && isGeminiModel(modelName)) {
      // If it's still a string but Gemini model, convert it
      const contextMatch = enhancedMessage.match(/TRAINING DATA:\s*([\s\S]*?)(?:\n\nUSER QUESTION|$)/);
      if (contextMatch) {
        systemInstruction = `You are an AI assistant for the "${bot.name}" chatbot.

This chatbot is described as: "${bot.description || 'A helpful assistant'}".

Your task is to answer questions *only* using the context below.

CRITICAL RULES:
1. You MUST answer using ONLY the information from the context provided below
2. If the answer cannot be found in the context, you MUST say: "I'm sorry, I don't have enough information to answer that."
3. Do NOT use any external knowledge, general knowledge, or assumptions
4. Do NOT make up information that is not in the context
5. Be polite, clear, and concise
6. If the question is about something not in the context, acknowledge it immediately

Here is the context:

---

${contextMatch[1].trim()}

---`;
        messageToSend = message;
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('📤 Sending to AI model (embed):', {
        model: modelName,
        hasSystemInstruction: !!systemInstruction,
        messageLength: typeof messageToSend === 'string' ? messageToSend.length : 0,
        hasTrainingData: hasTrainingData
      });
    }

    const aiResponse = await callAIModelAPI(modelName, messageToSend, systemInstruction);

    // Send email notification if enabled (async, don't wait)
    sendNotificationIfEnabled(bot, message, aiResponse).catch(err => {
      console.error('Error sending notification:', err);
    });

    // Get or create chat log - use upsert to avoid race conditions
    const sessionIdToUse = sessionId || `embed_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get existing chat log if sessionId provided
    let chatLog = sessionId ? await ChatLog.findByBotIdAndSessionId(bot.id, sessionIdToUse) : null;

    const newMessages = [
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }
    ];

    if (chatLog) {
      // Update existing chat log atomically
      const updatedMessages = [...(chatLog.messages || []), ...newMessages];
      chatLog = await ChatLog.updateMessages(chatLog.id, updatedMessages);
    } else {
      // Create new chat log for embedded bot (no userId required)
      chatLog = await ChatLog.upsertBySessionId({
        botId: bot.id,
        userId: null, // Embedded bots don't require user authentication
        sessionId: sessionIdToUse,
        messages: newMessages
      });
    }

    // Include information about training data used (embed endpoint)
    const responseData = {
      response: aiResponse,
      sessionId: chatLog.session_id,
      trainingDataUsed: hasTrainingData ? {
        hasData: true,
        dataSource: context ? 'relevant_chunks' : 'all_training_data',
        dataLength: context ? context.length : (bot.document_contents ?
          bot.document_contents.reduce((sum, doc) => sum + (doc.content ? doc.content.length : 0), 0) : 0)
      } : {
        hasData: false,
        message: 'No training data available for this bot'
      }
    };

    res.json(responseData);
  } catch (error) {
    // Log to file since we can't see terminal
    try {
      const fs = require('fs');
      const path = require('path');
      const logFile = path.join(__dirname, '..', 'debug-errors.log');
      const timestamp = new Date().toISOString();
      const logEntry = `\n[${timestamp}] ERROR: ${error.message}\nStack: ${error.stack}\n`;
      fs.appendFileSync(logFile, logEntry);

      if (error.response) {
        fs.appendFileSync(logFile, `API Response: ${JSON.stringify(error.response.data)}\n`);
      }
    } catch (logErr) {
      console.error('Failed to write log file:', logErr);
    }

    console.error('❌ Embed chat error:', error);
    console.error('Stack trace:', error.stack);

    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }

    // Return error response with detailed info for debugging
    const errorMessage = error.message || 'Unknown error';
    const errorDetail = error.response ? JSON.stringify(error.response.data) : '';

    const errorResponse = {
      response: `⚠️ SYSTEM ERROR: ${errorMessage}\n\n${errorDetail ? 'Details: ' + errorDetail : ''}\n\nPlease check your API keys and server logs.`,
      sessionId: null,
      error: errorMessage,
      trainingDataUsed: {
        hasData: false,
        message: 'Error occurred: ' + errorMessage
      }
    };

    return res.status(500).json(errorResponse);
  }
});

// New public endpoint to serve embed.js file (no authentication required)
router.get('/:id/embed.js', async (req, res) => {
  try {
    const botId = req.params.id;

    // Get bot details (no authentication required for public embed)
    const { data: bot, error } = await require('../lib/supabase')
      .from('bots')
      .select('*')
      .eq('id', botId)
      .eq('is_active', true)
      .single();

    if (error || !bot) {
      // Return error as JavaScript comment
      res.setHeader('Content-Type', 'application/javascript');
      return res.send(`console.error('Chatbot not found or inactive');`);
    }

    // Get URLs from environment or use defaults
    let backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

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

    // Get bot customization settings from Step 4
    const widgetCustomization = bot.widget_customization || {};
    const greetingMessage = widgetCustomization.greetingMessage || bot.greeting_message || 'Hi! How can I help you today!';
    const embedCode = bot.embed_code;
    const avatar = widgetCustomization.avatar || '🤖';
    const primaryColor = widgetCustomization.themeColor || widgetCustomization.primaryColor || '#8b5cf6';
    const position = widgetCustomization.alignment || widgetCustomization.position || 'bottom-right';
    const widgetSize = widgetCustomization.widgetSize || 'medium';

    // Map widget size to dimensions
    const sizeMap = {
      small: { width: '320', height: '400' },
      medium: { width: '380', height: '500' },
      large: { width: '440', height: '600' }
    };
    const dimensions = sizeMap[widgetSize] || sizeMap.medium;

    // Generate complete embed JavaScript that creates and displays the chatbot widget
    const embedScript = `
(function() {
  // Chatbot configuration
  var config = {
    botId: '${botId}',
    embedCode: '${embedCode}',
    backendUrl: '${backendUrl}',
    primaryColor: '${primaryColor}',
    avatar: '${avatar.replace(/'/g, "\\'")}',
    greetingMessage: '${greetingMessage.replace(/'/g, "\\'")}',
    position: '${position}',
    width: '${dimensions.width}',
    height: '${dimensions.height}'
  };

  // Create chatbot widget
  function createChatWidget() {
    // Create container
    var container = document.createElement('div');
    container.id = 'ai-chatbot-widget-' + config.botId;
    container.style.cssText = 'position: fixed; z-index: 9999; ' + 
      (config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;') +
      (config.position.includes('right') ? 'right: 20px;' : 'left: 20px;');
    
    // Create widget HTML
    container.innerHTML = \`
      <div id="chatbot-minimized" style="display: block;">
        <button onclick="window.toggleChatbot()" style="
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: \${config.primaryColor};
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          font-size: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">\${config.avatar}</button>
      </div>
      <div id="chatbot-expanded" style="
        display: none;
        width: \${config.width}px;
        height: \${config.height}px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        flex-direction: column;
        overflow: hidden;
      ">
        <div style="
          background: \${config.primaryColor};
          color: white;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 24px;">\${config.avatar}</span>
            <span style="font-weight: bold;">AI Assistant</span>
          </div>
          <button onclick="window.toggleChatbot()" style="
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 24px;
          ">✕</button>
        </div>
        <div id="chatbot-messages" style="
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #f9fafb;
        ">
          <div style="
            background: white;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          ">\${config.greetingMessage}</div>
        </div>
        <div style="
          padding: 16px;
          border-top: 1px solid #e5e7eb;
          background: white;
        ">
          <div style="display: flex; gap: 8px;">
            <input id="chatbot-input" type="text" placeholder="Type your message..." style="
              flex: 1;
              padding: 12px;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              outline: none;
            " />
            <button onclick="window.sendChatMessage()" style="
              background: \${config.primaryColor};
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: bold;
            ">Send</button>
          </div>
        </div>
      </div>
    \`;
    
    document.body.appendChild(container);
  }

  // Toggle chatbot visibility
  window.toggleChatbot = function() {
    var minimized = document.getElementById('chatbot-minimized');
    var expanded = document.getElementById('chatbot-expanded');
    if (minimized.style.display === 'none') {
      minimized.style.display = 'block';
      expanded.style.display = 'none';
    } else {
      minimized.style.display = 'none';
      expanded.style.display = 'flex';
    }
  };

  // Send chat message
  window.sendChatMessage = function() {
    var input = document.getElementById('chatbot-input');
    var message = input.value.trim();
    if (!message) return;

    // Add user message to chat
    var messagesDiv = document.getElementById('chatbot-messages');
    var userMsg = document.createElement('div');
    userMsg.style.cssText = 'background: ' + config.primaryColor + '; color: white; padding: 12px; border-radius: 8px; margin-bottom: 12px; margin-left: 20%; text-align: right;';
    userMsg.textContent = message;
    messagesDiv.appendChild(userMsg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    input.value = '';

    // Send to backend
    fetch(config.backendUrl + '/api/bots/embed/' + config.embedCode + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: message,
        sessionId: window.chatbotSessionId || null
      })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      // Store session ID
      if (data.sessionId) {
        window.chatbotSessionId = data.sessionId;
      }
      
      // Add bot response
      var botMsg = document.createElement('div');
      botMsg.style.cssText = 'background: white; padding: 12px; border-radius: 8px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);';
      botMsg.textContent = data.response;
      messagesDiv.appendChild(botMsg);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    })
    .catch(function(error) {
      console.error('Chat error:', error);
      var errorMsg = document.createElement('div');
      errorMsg.style.cssText = 'background: #fee; color: #c00; padding: 12px; border-radius: 8px; margin-bottom: 12px;';
      errorMsg.textContent = 'Sorry, there was an error. Please try again.';
      messagesDiv.appendChild(errorMsg);
    });
  };

  // Handle Enter key in input
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      var input = document.getElementById('chatbot-input');
      if (input) {
        input.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            window.sendChatMessage();
          }
        });
      }
    }, 100);
  });

  // Initialize widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatWidget);
  } else {
    createChatWidget();
  }
})();
`;

    // Add CORS headers to allow embedding from any domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.send(embedScript);
  } catch (error) {
    console.error('Embed.js generation error:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`console.error('Failed to load chatbot: ${error.message}');`);
  }
});



// Get embed script endpoint
router.get('/:id/embed-script', authMiddleware, async (req, res) => {
  try {
    const botId = req.params.id;
    const { theme = 'default', position = 'bottom-right' } = req.query;

    // Get bot details and verify ownership
    const bot = await Bot.findByIdAndUserId(botId, req.user.id);
    if (!bot) {
      return ErrorResponses.NOT_FOUND(res, 'Bot not found');
    }

    // Get URLs from environment or use defaults
    const frontendUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

    // Get bot customization settings
    const widgetCustomization = bot.widget_customization || {};
    const greetingMessage = bot.greeting_message || 'Hi! How can I help you today?';

    // Generate embed script with all customization options
    const embedScript = `(function() {
  var script = document.createElement('script');
  script.src = '${frontendUrl}/embed-loader.js';
  script.setAttribute('data-bot-id', '${bot.id}');
  script.setAttribute('data-embed-code', '${bot.embed_code}');
  script.setAttribute('data-backend-url', '${backendUrl}');
  script.setAttribute('data-frontend-url', '${frontendUrl}');
  script.setAttribute('data-theme', '${theme}');
  script.setAttribute('data-position', '${position}');
  script.setAttribute('data-width', '${widgetCustomization.width || '380'}');
  script.setAttribute('data-height', '${widgetCustomization.height || '600'}');
  script.setAttribute('data-color', '${widgetCustomization.primaryColor || '#8b5cf6'}');
  script.setAttribute('data-avatar', '${(widgetCustomization.avatar || '🤖').replace(/'/g, "\\'")}');
  script.setAttribute('data-greeting', '${greetingMessage.replace(/'/g, "\\'")}');
  script.async = true;
  if (document.head) {
    document.head.appendChild(script);
  } else if (document.body) {
    document.body.appendChild(script);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      document.head.appendChild(script);
    });
  }
})();`;

    res.setHeader('Content-Type', 'application/javascript');
    res.send(embedScript);
  } catch (error) {
    console.error('Embed script generation error:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

// Chat endpoint with Hugging Face integration (must come before /:id route)
router.post('/:id/chat', chatLimiter, authMiddleware, async (req, res) => {
  try {
    const botId = req.params.id;

    // Sanitize input
    const sanitizedBody = sanitizeRequestBody(req.body);
    let { message, sessionId } = sanitizedBody;

    // Sanitize message
    message = sanitizeString(message);
    sessionId = sessionId ? sanitizeString(sessionId) : undefined;

    if (!message || message.trim().length === 0) {
      return ErrorResponses.BAD_REQUEST(res, 'Message is required');
    }

    if (message.length > 5000) {
      return ErrorResponses.VALIDATION_ERROR(res, 'Message must be less than 5000 characters');
    }

    // Get bot details and verify ownership
    const bot = await Bot.findByIdAndUserId(botId, req.user.id);
    if (!bot) {
      return ErrorResponses.NOT_FOUND(res, 'Bot not found');
    }

    // Get relevant context from documents if available
    let context = null;
    let enhancedMessage = message;
    let hasTrainingData = false;

    // Log bot data in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🤖 Chat request for bot:', {
        botId,
        hasDocumentContents: !!bot.document_contents,
        documentContentsLength: bot.document_contents ? bot.document_contents.length : 0,
        documentContentsTypes: bot.document_contents ? bot.document_contents.map(doc => doc.type || 'document') : []
      });
    }

    if (bot.document_contents && bot.document_contents.length > 0) {
      hasTrainingData = true;

      // First try to get relevant chunks
      try {
        context = await getRelevantContext(botId, message);
      } catch (error) {
        console.error('Error getting relevant context:', error);
        context = null; // Fall through to use fallback
      }

      if (context) {
        // For Gemini: Use system instruction format
        // For Hugging Face: Use enhanced message format
        enhancedMessage = {
          systemInstruction: `You are an AI assistant for the "${bot.name}" chatbot.

This chatbot is described as: "${bot.description || 'A helpful assistant'}".

Your task is to answer questions *only* using the context below.

CRITICAL RULES:
1. You MUST answer using ONLY the information from the context provided below
2. If the answer cannot be found in the context, you MUST say: "I'm sorry, I don't have enough information to answer that."
3. Do NOT use any external knowledge, general knowledge, or assumptions
4. Do NOT make up information that is not in the context
5. Be polite, clear, and concise
6. If the question is about something not in the context, acknowledge it immediately

Here is the context:

---

${context}

---`,
          userMessage: message
        };
      } else {
        // If no context found but training data exists, use ALL training data (text + documents)
        const allTrainingContent = [];

        bot.document_contents.forEach(doc => {
          // Include training text
          if (doc.type === 'text' && doc.content) {
            allTrainingContent.push(doc.content);
          }
          // Include uploaded documents content
          else if (doc.content && !doc.type) {
            allTrainingContent.push(doc.content);
          }
          // Fallback: if document has chunks but no full content, use first chunk
          else if (doc.chunks && doc.chunks.length > 0) {
            allTrainingContent.push(doc.chunks[0]);
          }
        });

        const allTrainingText = allTrainingContent.join('\n\n');

        if (allTrainingText && allTrainingText.trim().length > 0) {
          // Use first 3000 chars to ensure we fit in prompt (increased from 2000)
          const trainingDataToUse = allTrainingText.substring(0, 3000);

          // For Gemini: Use system instruction format
          // For Hugging Face: Use enhanced message format
          enhancedMessage = {
            systemInstruction: `You are an AI assistant for the "${bot.name}" chatbot.

This chatbot is described as: "${bot.description || 'A helpful assistant'}".

Your task is to answer questions *only* using the context below.

CRITICAL RULES:
1. You MUST answer using ONLY the information from the context provided below
2. If the answer cannot be found in the context, you MUST say: "I'm sorry, I don't have enough information to answer that."
3. Do NOT use any external knowledge, general knowledge, or assumptions
4. Do NOT make up information that is not in the context
5. Be polite, clear, and concise
6. If the question is about something not in the context, acknowledge it immediately

Here is the context:

---

${trainingDataToUse}

---`,
            userMessage: message
          };
        }
      }

      // Log in development to verify training data is being sent
      if (process.env.NODE_ENV === 'development') {
        const preview = typeof enhancedMessage === 'object'
          ? (enhancedMessage.systemInstruction?.substring(0, 200) || 'Object format')
          : (typeof enhancedMessage === 'string' ? enhancedMessage.substring(0, 200) : 'Unknown format');

        console.log('📊 Training data being used:', {
          hasTrainingData: true,
          contextLength: context ? context.length : 0,
          hasSystemInstruction: typeof enhancedMessage === 'object' && !!enhancedMessage.systemInstruction,
          messageLength: typeof enhancedMessage === 'object' ? enhancedMessage.userMessage?.length : (typeof enhancedMessage === 'string' ? enhancedMessage.length : 0),
          preview: preview + '...'
        });
      }
    } else {
      // Log if no training data
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️  No training data found for bot:', botId);
        console.log('   Bot data keys:', Object.keys(bot));
        console.log('   document_contents:', bot.document_contents);
      }
    }

    // Ensure we have training data in the message if it exists
    // Check if enhancedMessage is a string and doesn't contain training data
    const hasTrainingDataInMessage = typeof enhancedMessage === 'string'
      ? enhancedMessage.includes('TRAINING DATA:')
      : (typeof enhancedMessage === 'object' && enhancedMessage.systemInstruction);

    if (hasTrainingData && !hasTrainingDataInMessage) {
      console.warn('⚠️  Training data exists but was not included in message! This should not happen.');
      // Force use of training data
      const allTrainingContent = [];
      bot.document_contents.forEach(doc => {
        if (doc.type === 'text' && doc.content) {
          allTrainingContent.push(doc.content);
        } else if (doc.content) {
          allTrainingContent.push(doc.content);
        } else if (doc.chunks && doc.chunks.length > 0) {
          allTrainingContent.push(doc.chunks.join(' '));
        }
      });
      if (allTrainingContent.length > 0) {
        const trainingDataToUse = allTrainingContent.join('\n\n').substring(0, 3000);
        enhancedMessage = `IMPORTANT: You are a chatbot assistant. Answer the user's question using ONLY the information provided below. Do NOT use any knowledge outside of this data. If the answer is not in the data, say "I don't have that information in my training data."

TRAINING DATA:
${trainingDataToUse}

USER QUESTION: ${message}

ANSWER (use ONLY the training data above):`;
      }
    }

    // Call AI model API (Hugging Face or Gemini)
    const modelName = bot.model_name || bot.modelName || 'google/flan-t5-large';

    // Prepare message format based on model type
    let messageToSend = enhancedMessage;
    let systemInstruction = null;

    if (typeof enhancedMessage === 'object' && enhancedMessage.systemInstruction) {
      // Gemini format: separate system instruction and user message
      systemInstruction = enhancedMessage.systemInstruction;
      messageToSend = enhancedMessage.userMessage;
    } else if (typeof enhancedMessage === 'string' && isGeminiModel(modelName)) {
      // If it's still a string but Gemini model, convert it
      // Extract context from enhanced message if it exists
      const contextMatch = enhancedMessage.match(/TRAINING DATA:\s*([\s\S]*?)(?:\n\nUSER QUESTION|$)/);
      if (contextMatch) {
        systemInstruction = `You are an AI assistant for the "${bot.name}" chatbot.

This chatbot is described as: "${bot.description || 'A helpful assistant'}".

Your task is to answer questions *only* using the context below.

CRITICAL RULES:
1. You MUST answer using ONLY the information from the context provided below
2. If the answer cannot be found in the context, you MUST say: "I'm sorry, I don't have enough information to answer that."
3. Do NOT use any external knowledge, general knowledge, or assumptions
4. Do NOT make up information that is not in the context
5. Be polite, clear, and concise
6. If the question is about something not in the context, acknowledge it immediately

Here is the context:

---

${contextMatch[1].trim()}

---`;
        messageToSend = message;
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('📤 Sending to AI model:', {
        model: modelName,
        hasSystemInstruction: !!systemInstruction,
        messageLength: typeof messageToSend === 'string' ? messageToSend.length : 0,
        hasTrainingData: hasTrainingData,
        messagePreview: typeof messageToSend === 'string' ? messageToSend.substring(0, 300) : 'Object format'
      });
    }

    const aiResponse = await callAIModelAPI(modelName, messageToSend, systemInstruction);

    // Send email notification if enabled (async, don't wait)
    sendNotificationIfEnabled(bot, message, aiResponse).catch(err => {
      console.error('Error sending notification:', err);
    });

    // Get or create chat log - use upsert to avoid race conditions
    const sessionIdToUse = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get existing chat log if sessionId provided
    let chatLog = sessionId ? await ChatLog.findByBotIdAndSessionId(botId, sessionIdToUse) : null;

    const newMessages = [
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }
    ];

    if (chatLog) {
      // Update existing chat log atomically
      const updatedMessages = [...(chatLog.messages || []), ...newMessages];
      chatLog = await ChatLog.updateMessages(chatLog.id, updatedMessages);

      // Update userId if needed
      if (!chatLog.user_id) {
        const supabase = require('../lib/supabase');
        await supabase
          .from('chat_logs')
          .update({ user_id: req.user.id })
          .eq('id', chatLog.id);
      }
    } else {
      // Use upsert for new chat log to handle potential race conditions
      chatLog = await ChatLog.upsertBySessionId({
        botId,
        userId: req.user.id,
        sessionId: sessionIdToUse,
        messages: newMessages
      });
    }

    // Include information about training data used
    const responseData = {
      response: aiResponse,
      sessionId: chatLog.session_id,
      trainingDataUsed: hasTrainingData ? {
        hasData: true,
        dataSource: context ? 'relevant_chunks' : 'all_training_data',
        dataLength: context ? context.length : (bot.document_contents ?
          bot.document_contents.reduce((sum, doc) => sum + (doc.content ? doc.content.length : 0), 0) : 0)
      } : {
        hasData: false,
        message: 'No training data available for this bot'
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error('Chat error:', error);

    // Return error response with training data info
    const errorResponse = {
      response: `I'm sorry, I encountered an error while processing your request. ${error.message || 'Please try again later.'}`,
      sessionId: null,
      error: error.message || 'Unknown error',
      trainingDataUsed: {
        hasData: false,
        message: 'Error occurred before training data check: ' + (error.message || 'Unknown error')
      },
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack,
        validationErrors: error.errors // Mongoose validation errors
      } : undefined
    };

    return res.status(500).json(errorResponse);
  }
});

// Update bot settings
router.put('/:id', authMiddleware, upload.array('documents', 5), async (req, res) => {
  try {
    const botId = req.params.id;

    // Sanitize input
    const sanitizedBody = sanitizeRequestBody(req.body, ['documents']);
    let { name, description, modelName, embedTheme, embedPosition, trainingText } = sanitizedBody;

    // Get bot and verify ownership
    const bot = await Bot.findByIdAndUserId(botId, req.user.id);
    if (!bot) {
      return ErrorResponses.NOT_FOUND(res, 'Bot not found');
    }

    // Build update object
    const updateData = {};

    if (name !== undefined) {
      name = sanitizeString(name);
      if (name && name.length >= 2 && name.length <= 100) {
        updateData.name = name;
      } else if (name) {
        return ErrorResponses.VALIDATION_ERROR(res, 'Bot name must be between 2 and 100 characters');
      }
    }

    if (description !== undefined) {
      updateData.description = description ? sanitizeString(description) : null;
    }

    if (modelName !== undefined) {
      updateData.model_name = sanitizeString(modelName) || 'llama-3.3-70b-versatile';
    }

    // Handle document updates
    if (req.body.documentsToRemove) {
      // Remove specified documents
      const documentsToRemove = JSON.parse(req.body.documentsToRemove);
      const existingDocuments = bot.documents || [];
      updateData.documents = existingDocuments.filter((doc, index) => !documentsToRemove.includes(index));

      // Also remove from document_contents
      if (bot.document_contents) {
        const existingContents = bot.document_contents || [];
        updateData.document_contents = existingContents.filter((doc, index) => !documentsToRemove.includes(index));
      }
    }

    // Handle training text update
    if (trainingText !== undefined) {
      trainingText = sanitizeString(trainingText);
      const documentContents = bot.document_contents || [];

      // Remove existing text training
      const filteredContents = documentContents.filter((dc) => dc.type !== 'text');

      // Add new training text if provided (with chunks)
      if (trainingText && trainingText.trim().length > 0) {
        const { chunkDocumentContent } = require('../utils/documentProcessor');
        // Now returns chunks with embeddings, so we must await it
        const chunks = await chunkDocumentContent(trainingText.trim());
        filteredContents.push({
          type: 'text',
          content: trainingText.trim(),
          chunks: chunks, // Contains { text, embedding } objects
          uploadDate: new Date().toISOString()
        });
      }

      updateData.document_contents = filteredContents;
    }

    // Handle new document uploads
    if (req.files && req.files.length > 0) {
      const newDocuments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        uploadDate: new Date().toISOString()
      }));

      // Merge with existing documents
      const existingDocuments = updateData.documents || bot.documents || [];
      updateData.documents = [...existingDocuments, ...newDocuments];

      // Process new documents for content extraction
      // We process asynchronously but log errors properly
      processDocumentsForBot(botId, req.files)
        .then(results => {
          console.log(`✅ Document processing completed for bot ${botId}: ${results.length} documents processed`);
        })
        .catch(err => {
          console.error(`❌ Error processing documents for bot ${botId}:`, err);
          console.error('   This may affect chatbot responses. Check backend logs for details.');
        });
    }

    // Store embed settings in a JSONB field (create embed_settings column if needed)
    if (embedTheme !== undefined || embedPosition !== undefined) {
      const embedSettings = bot.embed_settings || {};
      if (embedTheme !== undefined) {
        embedSettings.theme = sanitizeString(embedTheme) || 'default';
      }
      if (embedPosition !== undefined) {
        embedSettings.position = sanitizeString(embedPosition) || 'bottom-right';
      }

      updateData.embed_settings = embedSettings;
    }

    if (req.body.systemPrompt !== undefined) {
      updateData.system_prompt = sanitizeString(req.body.systemPrompt);
    }

    // Handle custom greeting message - sync to both locations
    if (req.body.greeting_message !== undefined) {
      const greetingMsg = sanitizeString(req.body.greeting_message) || 'Hi! How can I help you today?';
      updateData.greeting_message = greetingMsg;

      // Also update in widget_customization for consistency
      if (!updateData.widget_customization) {
        updateData.widget_customization = bot.widget_customization || {};
      }
      updateData.widget_customization.greetingMessage = greetingMsg;
    }

    // Handle widget customization - accept full object or individual fields
    if (req.body.widget_customization) {
      // Frontend sends complete widget_customization object
      updateData.widget_customization = req.body.widget_customization;

      // Sync greeting_message if provided in widget_customization
      if (req.body.widget_customization.greetingMessage) {
        updateData.greeting_message = req.body.widget_customization.greetingMessage;
      }
    } else if (req.body.widgetWidth !== undefined || req.body.widgetHeight !== undefined ||
      req.body.widgetColor !== undefined || req.body.widgetAvatar !== undefined) {
      // Legacy: individual fields
      const widgetCustomization = bot.widget_customization || {};
      if (req.body.widgetWidth !== undefined) {
        widgetCustomization.width = sanitizeString(req.body.widgetWidth) || '380';
      }
      if (req.body.widgetHeight !== undefined) {
        widgetCustomization.height = sanitizeString(req.body.widgetHeight) || '600';
      }
      if (req.body.widgetColor !== undefined) {
        widgetCustomization.primaryColor = sanitizeString(req.body.widgetColor) || '#8b5cf6';
      }
      if (req.body.widgetAvatar !== undefined) {
        widgetCustomization.avatar = sanitizeString(req.body.widgetAvatar) || '🤖';
      }
      updateData.widget_customization = widgetCustomization;
    }


    // Handle notification settings
    if (req.body.emailNotifications !== undefined || req.body.emailAddress !== undefined) {
      const notificationSettings = bot.notification_settings || {};
      if (req.body.emailNotifications !== undefined) {
        notificationSettings.emailNotifications = req.body.emailNotifications === 'true' || req.body.emailNotifications === true;
      }
      if (req.body.emailAddress !== undefined) {
        const email = sanitizeString(req.body.emailAddress);
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          notificationSettings.emailAddress = email;
        }
      }
      updateData.notification_settings = notificationSettings;
    }

    // Update bot using findOneAndUpdate directly
    const updatedBot = await Bot.findOneAndUpdate(
      { _id: botId, user_id: req.user.id },
      { $set: updateData },
      { new: true }
    );

    if (!updatedBot) {
      return ErrorResponses.NOT_FOUND(res, 'Bot not found');
    }

    res.json({
      message: 'Bot updated successfully',
      bot: {
        id: updatedBot.id,
        name: updatedBot.name,
        description: updatedBot.description,
        embedCode: updatedBot.embed_code,
        createdAt: updatedBot.created_at,
        isActive: updatedBot.is_active,
        modelName: updatedBot.model_name,
        embedSettings: updatedBot.embed_settings
      }
    });
  } catch (error) {
    console.error('Bot update error:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

// Get training data for a bot
router.get('/:id/training-data', authMiddleware, async (req, res) => {
  try {
    const bot = await Bot.findByIdAndUserId(req.params.id, req.user.id);
    if (!bot) {
      return ErrorResponses.NOT_FOUND(res, 'Bot not found');
    }

    // Format training data for display
    const trainingData = {
      textTraining: [],
      documents: [],
      totalItems: 0,
      totalContentLength: 0
    };

    if (bot.document_contents && Array.isArray(bot.document_contents)) {
      bot.document_contents.forEach((doc, index) => {
        const item = {
          id: index,
          type: doc.type || 'document',
          filename: doc.originalName || doc.filename || 'Unknown',
          contentLength: doc.content ? doc.content.length : 0,
          chunksCount: doc.chunks ? (Array.isArray(doc.chunks) ? doc.chunks.length : 0) : 0,
          content: doc.content ? doc.content.substring(0, 500) : '', // Preview only
          fullContent: doc.content || '', // Include full content
          processedAt: doc.processedAt || doc.uploadDate || null
        };

        if (doc.type === 'text') {
          trainingData.textTraining.push(item);
        } else {
          trainingData.documents.push(item);
        }

        trainingData.totalContentLength += item.contentLength;
      });

      trainingData.totalItems = bot.document_contents.length;
    }

    res.json({ trainingData });
  } catch (error) {
    console.error('Training data get error:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

// Get single bot details (must come after all specific routes)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const bot = await Bot.findByIdAndUserId(req.params.id, req.user.id);
    if (!bot) {
      return ErrorResponses.NOT_FOUND(res, 'Bot not found');
    }

    // Format document_contents summary
    const trainingDataSummary = {
      totalItems: 0,
      textItems: 0,
      documentItems: 0,
      totalContentLength: 0
    };

    if (bot.document_contents && Array.isArray(bot.document_contents)) {
      bot.document_contents.forEach(doc => {
        trainingDataSummary.totalItems++;
        if (doc.type === 'text') {
          trainingDataSummary.textItems++;
        } else {
          trainingDataSummary.documentItems++;
        }
        if (doc.content) {
          trainingDataSummary.totalContentLength += doc.content.length;
        }
      });
    }

    res.json({
      bot: {
        id: bot.id,
        name: bot.name,
        description: bot.description,
        embedCode: bot.embed_code,
        createdAt: bot.created_at,
        isActive: bot.is_active,
        modelName: bot.model_name,
        documents: bot.documents || [],
        embedSettings: bot.embed_settings || { theme: 'default', position: 'bottom-right' },
        greetingMessage: bot.greeting_message,
        widgetCustomization: bot.widget_customization,
        notificationSettings: bot.notification_settings,
        trainingDataSummary
      }
    });
  } catch (error) {
    console.error('Bot get error:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

// Validate API keys at module load
if (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY) {
  console.warn('⚠️  WARNING: No AI API keys found. Please set either GROQ_API_KEY or GEMINI_API_KEY in your .env file.');
}

// Helper function to determine if model is Gemini or Hugging Face
function isGeminiModel(modelName) {
  return modelName && (
    modelName.startsWith('gemini') ||
    modelName.startsWith('google/gemini') ||
    modelName.toLowerCase().includes('gemini')
  );
}

// Unified function to call AI model API (Gemini or Groq)
async function callAIModelAPI(modelName, message, systemInstruction = null) {
  // If explicitly Gemini model, use Gemini
  if (isGeminiModel(modelName)) {
    // Check if we should block Gemini based on user preference "not gemini key" for chatbots
    // However, if they explicitly selected a Gemini model in settings, we should probably respect that or warn.
    // For now, I will assume "no gemini for default/fallback", but explicit selection works.
    return await callGeminiAPI(modelName, message, systemInstruction);
  }

  // Default to Groq for everything else (replacing Hugging Face)
  return await callGroqAPI(modelName, message, systemInstruction);
}

// Helper function to call Google Gemini API
async function callGeminiAPI(modelName, message, systemInstruction = null) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.');
    }

    // Extract model version - Use actually available models
    // Available models: gemini-2.0-flash, gemini-2.5-flash, gemini-flash-latest, gemini-pro-latest
    let modelVersion = 'gemini-2.0-flash'; // Default to stable, widely available model
    let apiVersion = 'v1beta'; // v1beta supports systemInstruction for newer models

    if (modelName.includes('gemini-1.5') || modelName.includes('gemini-2.5')) {
      if (modelName.includes('flash')) {
        modelVersion = 'gemini-2.0-flash'; // Use stable 2.0-flash
      } else if (modelName.includes('pro')) {
        modelVersion = 'gemini-2.0-flash'; // Use flash as default (faster)
      } else {
        modelVersion = 'gemini-2.0-flash';
      }
    } else if (modelName.includes('gemini-pro') || modelName.includes('gemini')) {
      // Map to available model (gemini-pro doesn't exist, use gemini-2.0-flash)
      modelVersion = 'gemini-2.0-flash';
      if (process.env.NODE_ENV === 'development') {
        console.log('ℹ️  Mapping gemini-pro to gemini-2.0-flash (available model)');
      }
    }

    // Build request payload
    const requestPayload = {
      contents: [{
        parts: [{
          text: message
        }]
      }],
      generationConfig: {
        temperature: 0.1, // Lower temperature for more focused, context-based responses
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    // Add system instruction if provided
    // v1beta supports systemInstruction for newer models
    if (systemInstruction) {
      // Try systemInstruction parameter first (for gemini-2.0+)
      requestPayload.systemInstruction = {
        parts: [{
          text: systemInstruction
        }]
      };
    }

    // Log the prompt being sent in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🤖 Sending to Gemini API:', {
        model: modelVersion,
        apiVersion: apiVersion,
        hasSystemInstruction: !!systemInstruction,
        messageLength: message.length,
        messagePreview: message.substring(0, 300) + '...'
      });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelVersion}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(
      apiUrl,
      requestPayload,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      }
    );

    // Extract response text from Gemini API response
    let aiResponseText = null;

    // Check for safety ratings blocking response
    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const candidate = response.data.candidates[0];

      // Check if response was blocked by safety filters
      if (candidate.safetyRatings) {
        const blocked = candidate.safetyRatings.some(rating =>
          rating.blocked === true || rating.probability === 'HIGH'
        );
        if (blocked) {
          console.warn('⚠️  Response blocked by safety filters');
        }
      }

      // Check finish reason
      if (candidate.finishReason === 'SAFETY') {
        console.warn('⚠️  Response blocked due to safety concerns');
        return "I apologize, but I cannot provide a response due to safety filters. Please rephrase your question.";
      }

      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        aiResponseText = candidate.content.parts[0].text;
      }

      // Check if finish reason indicates no content
      if (!aiResponseText && candidate.finishReason) {
        console.warn(`⚠️  No content returned, finishReason: ${candidate.finishReason}`);
      }
    } else {
      console.warn('⚠️  No candidates in Gemini API response');
      if (process.env.NODE_ENV === 'development') {
        console.warn('Response data:', JSON.stringify(response.data, null, 2));
      }
    }

    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Gemini Response received:', {
        hasResponse: !!aiResponseText,
        responseLength: aiResponseText ? aiResponseText.length : 0,
        responsePreview: aiResponseText ? aiResponseText.substring(0, 200) : 'No response'
      });
    }

    if (!aiResponseText || aiResponseText.trim().length === 0) {
      return "I'm sorry, I don't have enough information to answer that.";
    }

    // Clean up response - remove any generic fallback phrases
    let cleanedResponse = aiResponseText.trim();

    // If response seems too generic or doesn't acknowledge context, return don't know message
    const genericPhrases = [
      "i apologize, but i encountered an error",
      "i'm sorry, but i encountered an error",
      "i apologize, but i could not generate",
      "i'm sorry, but i could not generate"
    ];

    if (genericPhrases.some(phrase => cleanedResponse.toLowerCase().includes(phrase))) {
      return "I'm sorry, I don't have enough information to answer that.";
    }

    return cleanedResponse;
  } catch (error) {
    // Enhanced error logging
    console.error('\n❌ Gemini API error occurred:');
    console.error('Error message:', error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error statusText:', error.response?.statusText);

    if (error.response?.data) {
      console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
    }

    if (error.response?.data?.error) {
      const apiError = error.response.data.error;
      console.error('API Error details:', {
        code: apiError.code,
        message: apiError.message,
        status: apiError.status
      });
    }

    // Check for specific error types and provide helpful messages
    if (!process.env.GEMINI_API_KEY) {
      console.error('⚠️  GEMINI_API_KEY is not set in environment variables!');
      return 'I apologize, but the AI service is not properly configured. Please contact support.';
    }

    if (error.message && error.message.includes('API key')) {
      return 'I apologize, but the AI service is not properly configured. Please contact support.';
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      const errorDetail = error.response?.data?.error?.message || 'Authentication failed';
      console.error(`🔑 Authentication error: ${errorDetail}`);
      return `I apologize, but there was an authentication error with the AI service: ${errorDetail}. Please check your Gemini API key.`;
    } else if (error.response?.status === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    } else if (error.response?.status === 400) {
      const errorMsg = error.response?.data?.error?.message || error.response?.data?.error?.message || 'Invalid request';
      console.error(`📝 Bad request error: ${errorMsg}`);

      // If it's a safety filter issue, provide helpful message
      if (errorMsg.includes('safety') || errorMsg.includes('blocked')) {
        return "I apologize, but the response was blocked by safety filters. Please rephrase your question.";
      }

      return `I apologize, but there was an error with the request: ${errorMsg}`;
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.error('🌐 Connection error:', error.code);
      return 'Unable to connect to AI service. Please try again later.';
    } else if (error.response?.status === 503) {
      return 'The AI service is temporarily unavailable. Please try again later.';
    }

    // Log full error for debugging (always log, not just in development)
    console.error('Full error object:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack?.substring(0, 500)
    });

    // Return a more informative error message
    const errorDetail = error.response?.data?.error?.message || error.message || 'Unknown error';
    return `I apologize, but I encountered an error while processing your request: ${errorDetail}`;
  }
}

// Helper function to call Groq API
async function callGroqAPI(modelName, message, systemInstruction = null) {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('Groq API key is not configured. Please set GROQ_API_KEY in your .env file.');
    }

    // Default to Llama 3.3 70B if model name is from HF or generic
    let groqModel = modelName;
    if (!modelName || modelName.includes('/') || modelName === 'google/flan-t5-large' || modelName === 'llama3-70b-8192') {
      groqModel = 'llama-3.3-70b-versatile';
    }

    // Prepare messages array
    const messages = [];

    // Add system instruction if present
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }

    // Add user message
    messages.push({ role: 'user', content: message });

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('⚡ Sending to Groq API:', {
        model: groqModel,
        messagesCount: messages.length,
        messagePreview: message.substring(0, 100) + '...'
      });
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: groqModel,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    // Extract response
    const aiResponseText = response.data.choices[0]?.message?.content;

    if (!aiResponseText) {
      throw new Error('No content in Groq response');
    }

    return aiResponseText;

  } catch (error) {
    console.error('Groq API error:', error.response?.data || error.message);

    // Provide specific error messages
    if (error.response?.status === 401) {
      return 'Authentication failed with Groq API. Please check your API key.';
    } else if (error.response?.status === 429) {
      return 'Groq API rate limit exceeded. Please try again later.';
    }

    return 'I apologize, but I encountered an error with the AI service.';
  }
}

// Helper function to generate embed code
function generateEmbedCode() {
  return 'bot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get conversation history for a bot
router.get('/:id/conversations', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    // Verify bot ownership
    const bot = await Bot.findByIdAndUserId(id, req.user.id);
    if (!bot) {
      return ErrorResponses.NOT_FOUND(res, 'Bot not found');
    }

    const conversations = await ChatLog.findByBotId(id, parseInt(limit), parseInt(offset));

    res.json({
      conversations: conversations.map(chat => ({
        id: chat.id,
        sessionId: chat.session_id,
        messages: chat.messages || [],
        startedAt: chat.started_at,
        endedAt: chat.ended_at,
        feedback: chat.feedback
      }))
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

// Delete a specific conversation session
router.delete('/:id/conversations/:sessionId', authMiddleware, async (req, res) => {
  try {
    const { id, sessionId } = req.params;

    // Verify bot ownership
    const bot = await Bot.findByIdAndUserId(id, req.user.id);
    if (!bot) {
      return ErrorResponses.NOT_FOUND(res, 'Bot not found');
    }

    // Delete chat log
    await ChatLog.deleteBySessionId(sessionId);
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});



// Delete a bot
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify bot ownership
    const bot = await Bot.findByIdAndUserId(id, req.user.id);
    if (!bot) {
      return ErrorResponses.NOT_FOUND(res, 'Bot not found');
    }

    await Bot.delete(id);
    res.json({ message: 'Bot deleted successfully' });
  } catch (error) {
    console.error('Error deleting bot:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

module.exports = router;
