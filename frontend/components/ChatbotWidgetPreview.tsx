import { useEffect, useState } from 'react';

interface ChatbotWidgetPreviewProps {
  greeting?: string;
  avatar?: string;
  color?: string;
  width?: string;
  height?: string;
  theme?: string;
}

export default function ChatbotWidgetPreview({
  greeting = 'Hi! How can I help you today?',
  avatar = '🤖',
  color = '#8b5cf6',
  width = '380',
  height = '600',
  theme = 'default'
}: ChatbotWidgetPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const bgColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#ffffff' : '#111827';
  const headerBg = color;

  return (
    <div className="relative" style={{ width: `${parseInt(width) + 40}px` }}>
      <div className="absolute bottom-0 right-0">
        {/* Toggle Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110"
            style={{ background: `linear-gradient(135deg, ${color}, ${adjustColor(color, 10)})` }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        )}

        {/* Chat Widget */}
        {isOpen && (
          <div
            className="rounded-lg shadow-2xl overflow-hidden flex flex-col"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              backgroundColor: bgColor,
              maxHeight: '90vh',
              maxWidth: '90vw'
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center justify-between text-white"
              style={{ background: `linear-gradient(135deg, ${headerBg}, ${adjustColor(headerBg, 10)})` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                  {avatar}
                </div>
                <span className="font-semibold">Chat Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb' }}>
              <div className="flex justify-start mb-4">
                <div
                  className="max-w-xs px-4 py-2 rounded-lg rounded-bl-none"
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb'
                  }}
                >
                  <p className="text-sm">{greeting}</p>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="px-4 py-3 border-t flex gap-2" style={{ borderColor: theme === 'dark' ? '#374151' : '#e5e7eb', backgroundColor: bgColor }}>
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-full border text-sm focus:outline-none focus:ring-2"
                style={{
                  borderColor: theme === 'dark' ? '#374151' : '#d1d5db',
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  color: textColor
                }}
              />
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: `linear-gradient(135deg, ${color}, ${adjustColor(color, 10)})` }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function adjustColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

