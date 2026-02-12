/**
 * AI Chatbot Embed Loader
 * Dynamically loads the chatbot widget onto the page
 */

(function() {
  'use strict';

  // Get configuration from script tag data attributes
  var scriptTag = document.currentScript || document.querySelector('script[data-embed-code]');
  if (!scriptTag) return;

  var config = {
    botId: scriptTag.getAttribute('data-bot-id'),
    embedCode: scriptTag.getAttribute('data-embed-code'),
    backendUrl: scriptTag.getAttribute('data-backend-url') || 'http://localhost:5000',
    frontendUrl: scriptTag.getAttribute('data-frontend-url') || 'http://localhost:3000',
    theme: scriptTag.getAttribute('data-theme') || 'default',
    position: scriptTag.getAttribute('data-position') || 'bottom-right',
    width: scriptTag.getAttribute('data-width') || '380',
    height: scriptTag.getAttribute('data-height') || '600',
    color: scriptTag.getAttribute('data-color') || '#8b5cf6',
    avatar: scriptTag.getAttribute('data-avatar') || '🤖',
    greeting: scriptTag.getAttribute('data-greeting') || 'Hi! How can I help you today?',
    language: scriptTag.getAttribute('data-language') || 'auto'
  };

  // Detect browser language for multi-language support
  if (config.language === 'auto') {
    var browserLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
    config.detectedLanguage = browserLang;
  }

  // Create widget container
  var widgetContainer = document.createElement('div');
  widgetContainer.id = 'ai-chatbot-widget-container';
  widgetContainer.style.cssText = getPositionStyles(config.position);

  // Create toggle button
  var toggleButton = document.createElement('button');
  toggleButton.id = 'ai-chatbot-toggle';
  toggleButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  toggleButton.style.cssText = getToggleButtonStyles(config.theme, config.color);
  toggleButton.onclick = function() {
    widgetContainer.classList.toggle('chatbot-open');
    if (widgetContainer.classList.contains('chatbot-open')) {
      loadChatWidget(config, widgetContainer);
    }
  };

  widgetContainer.appendChild(toggleButton);
  document.body.appendChild(widgetContainer);

  // Load chat widget when opened
  function loadChatWidget(config, container) {
    if (container.querySelector('.chatbot-widget')) return; // Already loaded

    var widget = document.createElement('div');
    widget.className = 'chatbot-widget';
    widget.innerHTML = getChatWidgetHTML(config);
    container.appendChild(widget);

    // Initialize chat functionality
    initChat(config, widget);
  }

    function initChat(config, widget) {
    var messagesContainer = widget.querySelector('.chatbot-messages');
    var inputField = widget.querySelector('.chatbot-input');
    var sendButton = widget.querySelector('.chatbot-send');
    var sessionId = null;
    
    // Show greeting message if available
    if (config.greeting && config.greeting.trim()) {
      setTimeout(function() {
        addMessage(config.greeting, 'assistant');
      }, 500);
    }

    function addMessage(content, role) {
      var messageDiv = document.createElement('div');
      messageDiv.className = 'chatbot-message chatbot-message-' + role;
      messageDiv.innerHTML = '<div class="chatbot-message-content">' + escapeHtml(content) + '</div>';
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showLoading() {
      var loadingDiv = document.createElement('div');
      loadingDiv.className = 'chatbot-message chatbot-message-assistant chatbot-loading';
      loadingDiv.innerHTML = '<div class="chatbot-message-content">Thinking... <span class="chatbot-typing"></span></div>';
      messagesContainer.appendChild(loadingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return loadingDiv;
    }

    function removeLoading(loadingDiv) {
      if (loadingDiv && loadingDiv.parentNode) {
        loadingDiv.parentNode.removeChild(loadingDiv);
      }
    }

    function sendMessage() {
      var message = inputField.value.trim();
      if (!message) return;

      inputField.disabled = true;
      sendButton.disabled = true;
      addMessage(message, 'user');
      inputField.value = '';

      var loadingDiv = showLoading();

      // Send to backend
      fetch(config.backendUrl + '/api/bots/embed/' + config.embedCode + '/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          sessionId: sessionId
        })
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        removeLoading(loadingDiv);
        if (data.sessionId) {
          sessionId = data.sessionId;
        }
        if (data.response) {
          addMessage(data.response, 'assistant');
        } else {
          addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
        }
      })
      .catch(function(error) {
        removeLoading(loadingDiv);
        addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
        console.error('Chat error:', error);
      })
      .finally(function() {
        inputField.disabled = false;
        sendButton.disabled = false;
        inputField.focus();
      });
    }

    sendButton.onclick = sendMessage;
    inputField.onkeypress = function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };
  }

  function getChatWidgetHTML(config) {
    // Get placeholder text based on language
    var placeholderText = getPlaceholderText(config.language || config.detectedLanguage || 'en');
    
    return `
      <div class="chatbot-header">
        <div class="chatbot-header-content">
          <div class="chatbot-avatar">${escapeHtml(config.avatar)}</div>
          <div class="chatbot-title">Chat Assistant</div>
        </div>
      </div>
      <div class="chatbot-messages"></div>
      <div class="chatbot-input-container">
        <input type="text" class="chatbot-input" placeholder="${placeholderText}">
        <button class="chatbot-send">Send</button>
      </div>
      <style>
        ${getWidgetStyles(config.theme, config.color, config.width, config.height)}
      </style>
    `;
  }

  function getPlaceholderText(lang) {
    var placeholders = {
      'en': 'Type your message...',
      'es': 'Escribe tu mensaje...',
      'fr': 'Tapez votre message...',
      'de': 'Geben Sie Ihre Nachricht ein...',
      'it': 'Digita il tuo messaggio...',
      'pt': 'Digite sua mensagem...',
      'zh': '输入您的消息...',
      'ja': 'メッセージを入力...',
      'ko': '메시지를 입력하세요...',
      'ar': 'اكتب رسالتك...',
      'hi': 'अपना संदेश टाइप करें...',
      'ru': 'Введите ваше сообщение...'
    };
    return placeholders[lang] || placeholders['en'];
  }

  function getWidgetStyles(theme, customColor, width, height) {
    var primaryColor = customColor || (theme === 'dark' ? '#7c3aed' : '#8b5cf6');
    var bgColor = theme === 'dark' ? '#1f2937' : '#ffffff';
    var textColor = theme === 'dark' ? '#ffffff' : '#111827';
    var widgetWidth = width || '380';
    var widgetHeight = height || '600';

    return `
      #ai-chatbot-widget-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        position: fixed;
        z-index: 999999;
      }
      #ai-chatbot-toggle {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, ${primaryColor}, #a855f7);
        color: white;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s, box-shadow 0.3s;
      }
      #ai-chatbot-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      }
      .chatbot-widget {
        position: absolute;
        bottom: 70px;
        right: 0;
        width: ${widgetWidth}px;
        max-width: 90vw;
        height: ${widgetHeight}px;
        max-height: 90vh;
        background: ${bgColor};
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s, transform 0.3s;
      }
      .chatbot-open .chatbot-widget {
        opacity: 1;
        transform: translateY(0);
      }
      .chatbot-header {
        background: linear-gradient(135deg, ${primaryColor}, #a855f7);
        color: white;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .chatbot-header-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .chatbot-avatar {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        user-select: none;
      }
      .chatbot-title {
        font-weight: 600;
        font-size: 16px;
      }
      .chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background: ${theme === 'dark' ? '#111827' : '#f9fafb'};
      }
      .chatbot-message {
        margin-bottom: 16px;
        display: flex;
      }
      .chatbot-message-user {
        justify-content: flex-end;
      }
      .chatbot-message-assistant {
        justify-content: flex-start;
      }
      .chatbot-message-content {
        max-width: 75%;
        padding: 12px 16px;
        border-radius: 12px;
        word-wrap: break-word;
      }
      .chatbot-message-user .chatbot-message-content {
        background: linear-gradient(135deg, ${primaryColor}, #a855f7);
        color: white;
      }
      .chatbot-message-assistant .chatbot-message-content {
        background: ${bgColor};
        color: ${textColor};
        border: 1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'};
      }
      .chatbot-input-container {
        display: flex;
        gap: 8px;
        padding: 16px;
        border-top: 1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'};
        background: ${bgColor};
      }
      .chatbot-input {
        flex: 1;
        padding: 12px 16px;
        border: 2px solid ${theme === 'dark' ? '#374151' : '#d1d5db'};
        border-radius: 24px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.3s;
        background: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
        color: ${textColor};
      }
      .chatbot-input:focus {
        border-color: ${primaryColor};
      }
      .chatbot-send {
        padding: 12px 24px;
        background: linear-gradient(135deg, ${primaryColor}, #a855f7);
        color: white;
        border: none;
        border-radius: 24px;
        cursor: pointer;
        font-weight: 600;
        transition: transform 0.2s, opacity 0.2s;
      }
      .chatbot-send:hover:not(:disabled) {
        transform: scale(1.05);
      }
      .chatbot-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .chatbot-typing {
        display: inline-block;
      }
      .chatbot-typing::after {
        content: '...';
        animation: typing 1.5s infinite;
      }
      @keyframes typing {
        0%, 20% { content: '.'; }
        40% { content: '..'; }
        60%, 100% { content: '...'; }
      }
    `;
  }

  function getPositionStyles(position) {
    var styles = {
      'bottom-right': 'bottom: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;',
      'top-right': 'top: 20px; right: 20px;',
      'top-left': 'top: 20px; left: 20px;'
    };
    return styles[position] || styles['bottom-right'];
  }

  function getToggleButtonStyles(theme, customColor) {
    var primaryColor = customColor || (theme === 'dark' ? '#7c3aed' : '#8b5cf6');
    return 'width: 60px; height: 60px; border-radius: 50%; border: none; background: linear-gradient(135deg, ' + primaryColor + ', ' + adjustColor(primaryColor, 10) + '); color: white; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); display: flex; align-items: center; justify-content: center; z-index: 999999;';
  }

  function adjustColor(color, percent) {
    // Simple color adjustment - lighten/darken
    var num = parseInt(color.replace('#', ''), 16);
    var amt = Math.round(2.55 * percent);
    var R = (num >> 16) + amt;
    var G = (num >> 8 & 0x00FF) + amt;
    var B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();

