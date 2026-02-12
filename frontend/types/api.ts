// API Response Types

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Bot {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  isActive: boolean;
  embedCode?: string;
  modelName?: string;
  documents?: Array<{
    filename: string;
    originalName: string;
    uploadDate: string;
  }>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatLog {
  id: string;
  botId: string;
  sessionId: string;
  messages: ChatMessage[];
  startedAt: string;
  feedback?: {
    rating: number;
    comment?: string;
  };
}

export interface ChatResponse {
  response: string;
  sessionId: string;
}

export interface AnalyticsOverview {
  totalBots: number;
  totalChats: number;
  activeBots: number;
}

export interface FeedbackStats {
  total: number;
  averageRating: number;
  ratings: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface BotAnalytics {
  bot: {
    name: string;
    createdAt: string;
  };
  statistics: {
    totalChats: number;
    totalMessages: number;
    recentChats: Array<{
      sessionId: string;
      messages: ChatMessage[];
      startedAt: string;
    }>;
    feedback: FeedbackStats;
  };
}

export interface DashboardAnalytics {
  overview: AnalyticsOverview;
  recentActivity: Array<{
    botId: {
      name: string;
    };
    sessionId: string;
    messages: ChatMessage[];
    startedAt: string;
  }>;
  bots: Array<{
    id: string;
    name: string;
    isActive: boolean;
  }>;
}

export interface ApiError {
  error: string;
  details?: string;
}

