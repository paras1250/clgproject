const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
  bot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bot',
    required: true
  },
  bot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot' },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [{
    role: { type: String, enum: ['user', 'assistant', 'system'] },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  session_id: {
    type: String,
    required: true,
    unique: true,
    alias: 'sessionId'
  },
  feedback: {
    rating: Number, // 1-5
    comment: String
  },
  started_at: {
    type: Date,
    default: Date.now,
    alias: 'startedAt'
  },
  endedAt: Date
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true },
  timestamps: { createdAt: 'started_at', updatedAt: 'updated_at' }
});

chatLogSchema.pre('save', function () {
  if (this.bot && !this.bot_id) this.bot_id = this.bot;
  if (this.bot_id && !this.bot) this.bot = this.bot_id;
  if (this.user && !this.user_id) this.user_id = this.user;
  if (this.user_id && !this.user) this.user = this.user_id;
});

// Static methods

chatLogSchema.statics.createLog = async function (chatData) {
  return this.create({
    bot: chatData.botId, // Required field
    bot_id: chatData.botId,
    user_id: chatData.userId,
    messages: chatData.messages,
    session_id: chatData.sessionId,
    feedback: chatData.feedback
  });
};

chatLogSchema.statics.findByBotId = function (botId, limit = 50, offset = 0) {
  return this.find({ bot_id: botId })
    .sort({ started_at: -1 })
    .skip(offset)
    .limit(limit);
};

chatLogSchema.statics.findByBotIdAndSessionId = function (botId, sessionId) {
  return this.findOne({ bot_id: botId, session_id: sessionId });
};

chatLogSchema.statics.updateMessages = function (id, messages) {
  return this.findByIdAndUpdate(
    id,
    { $set: { messages } },
    { new: true }
  );
};

chatLogSchema.statics.countByBotId = function (botId) {
  return this.countDocuments({ bot_id: botId });
};

chatLogSchema.statics.countByBotIds = function (botIds) {
  return this.countDocuments({ bot_id: { $in: botIds } });
};

chatLogSchema.statics.findRecentByBotIds = function (botIds, limit = 20) {
  return this.find({ bot_id: { $in: botIds } })
    .sort({ started_at: -1 })
    .limit(limit);
};

chatLogSchema.statics.deleteBySessionId = async function (sessionId) {
  const res = await this.deleteOne({ session_id: sessionId });
  return res.deletedCount > 0;
};

// The upsert logic helper
chatLogSchema.statics.upsertBySessionId = async function (chatData) {
  const existing = await this.findOne({
    bot_id: chatData.botId,
    session_id: chatData.sessionId
  });

  if (existing) {
    const updatedMessages = [...(existing.messages || []), ...(chatData.messages || [])];
    existing.messages = updatedMessages;
    return existing.save();
  } else {
    return this.createLog(chatData);
  }
};

const ChatLog = mongoose.model('ChatLog', chatLogSchema);
module.exports = ChatLog;
