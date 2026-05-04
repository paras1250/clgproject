const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Bot = require('../models/bot');
const ChatLog = require('../models/chatlog');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminAuth');
const { ErrorResponses } = require('../utils/errors');

// All admin routes require both authentication and admin role
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/stats - Global platform statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBots = await Bot.countDocuments();
    const totalChats = await ChatLog.countDocuments();
    
    // Get bots created in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newBots = await Bot.countDocuments({ created_at: { $gte: sevenDaysAgo } });

    res.json({
      totalUsers,
      totalBots,
      totalChats,
      newBotsLast7Days: newBots
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

// GET /api/admin/users - List all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ created_at: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Admin get users error:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

// DELETE /api/admin/users/:id - Delete a user and all their data
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own admin account' });
    }

    // 1. Find all bots owned by user
    const userBots = await Bot.find({ user_id: userId });
    const botIds = userBots.map(bot => bot._id);

    // 2. Delete all chat logs for those bots
    if (botIds.length > 0) {
      await ChatLog.deleteMany({ bot_id: { $in: botIds } });
    }

    // 3. Delete all bots
    await Bot.deleteMany({ user_id: userId });

    // 4. Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

// GET /api/admin/bots - List all bots globally
router.get('/bots', async (req, res) => {
  try {
    // Populate user to get the owner's email/name
    const bots = await Bot.find()
      .populate('user_id', 'name email')
      .sort({ created_at: -1 });
    
    res.json({ bots });
  } catch (error) {
    console.error('Admin get bots error:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

module.exports = router;
