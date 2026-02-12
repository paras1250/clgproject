const express = require('express');
const router = express.Router();
const Bot = require('../models/bot');
const ChatLog = require('../models/chatlog');
const authMiddleware = require('../middleware/auth');
const { ErrorResponses } = require('../utils/errors');

// Get analytics for a specific bot
router.get('/bot/:botId', authMiddleware, async (req, res) => {
  try {
    const { botId } = req.params;
    
    // Verify bot ownership
    const bot = await Bot.findByIdAndUserId(botId, req.user.id);
    if (!bot) {
      return ErrorResponses.NOT_FOUND(res, 'Bot not found');
    }
    
    // Get chat statistics
    const totalChats = await ChatLog.countByBotId(botId);
    const chatLogs = await ChatLog.findByBotId(botId);
    
    // Get recent chats
    const recentChats = chatLogs.slice(0, 10).map(log => ({
      sessionId: log.session_id,
      messages: log.messages || [],
      startedAt: log.started_at
    }));
    
    // Get total messages
    const totalMessages = chatLogs.reduce((sum, log) => sum + (log.messages?.length || 0), 0);
    
    // Get feedback statistics
    const feedbackStats = {
      total: 0,
      averageRating: 0,
      ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
    
    chatLogs.forEach(log => {
      if (log.feedback && log.feedback.rating) {
        feedbackStats.total++;
        feedbackStats.ratings[log.feedback.rating]++;
      }
    });
    
    if (feedbackStats.total > 0) {
      const totalRating = chatLogs.reduce((sum, log) => {
        return sum + (log.feedback?.rating || 0);
      }, 0);
      feedbackStats.averageRating = totalRating / feedbackStats.total;
    }
    
    res.json({
      bot: {
        name: bot.name,
        createdAt: bot.created_at
      },
      statistics: {
        totalChats,
        totalMessages,
        recentChats,
        feedback: feedbackStats
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

// Get all analytics for user's bots
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const bots = await Bot.findByUserId(req.user.id);
    const botIds = bots.map(bot => bot.id);
    
    const totalChats = await ChatLog.countByBotIds(botIds);
    const totalBots = bots.length;
    
    // Get recent activity
    const recentChats = await ChatLog.findRecentByBotIds(botIds, 20);
    
    // Format recent activity with bot names
    const recentActivity = recentChats.map(chat => {
      const bot = bots.find(b => b.id === chat.bot_id);
      return {
        botId: {
          name: bot?.name || 'Unknown Bot'
        },
        sessionId: chat.session_id,
        messages: chat.messages || [],
        startedAt: chat.started_at
      };
    });
    
    res.json({
      overview: {
        totalBots,
        totalChats,
        activeBots: bots.filter(bot => bot.is_active).length
      },
      recentActivity,
      bots: bots.map(bot => ({
        id: bot.id,
        name: bot.name,
        isActive: bot.is_active
      }))
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
