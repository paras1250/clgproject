const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    // removed alias 'user_id' to avoid conflict with explicit user_id field
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Explicit field to match Supabase column name exactly for easier migration
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  // Legacy simpler docs list
  documents: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }],
  // Full training data with embeddings
  document_contents: [{
    filename: String,
    originalName: String,
    content: String,
    processedAt: Date,
    chunks: [{
      text: String,
      embedding: [Number]
    }]
  }],
  model_name: {
    type: String,
    default: 'google/flan-t5-large',
    alias: 'modelName'
  },
  is_active: {
    type: Boolean,
    default: true,
    alias: 'isActive'
  },
  embed_code: {
    type: String,
    unique: true,
    required: true,
    alias: 'embedCode'
  },
  system_prompt: {
    type: String,
    default: 'You are a helpful AI assistant.',
    alias: 'systemPrompt'
  },
  greeting_message: {
    type: String,
    default: 'Hi! How can I help you today?'
  },
  widget_customization: {
    avatar: { type: String, default: '/avatars/avatar1.png' },
    greetingMessage: { type: String },
    primaryColor: { type: String, default: '#8b5cf6' },
    themeColor: { type: String },
    position: { type: String, default: 'bottom-right' },
    alignment: { type: String },
    width: { type: String, default: '380' },
    height: { type: String, default: '600' },
    widgetSize: { type: String, default: 'medium' }
  }

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
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Middleware to sync camelCase to snake_case fields if needed
// Middleware to sync camelCase to snake_case fields if needed
botSchema.pre('save', function () {
  // Ensure user_id is set if user is set (or vice versa)
  if (this.user && !this.user_id) this.user_id = this.user;
  if (this.user_id && !this.user) this.user = this.user_id;
});

// Static methods to match API

botSchema.statics.findByUserId = function (userId) {
  return this.find({ user_id: userId }).sort({ created_at: -1 });
};

botSchema.statics.findByIdAndUserId = function (id, userId) {
  return this.findOne({ _id: id, user_id: userId });
};

// Override create to handle the wrapping/mapping if needed
// Supabase: Bot.create(botData)
// botData has: userId, name, embedCode, etc.
// We need to map camelCase inputs to snake_case schema fields if schema uses snake_case
botSchema.statics.createBot = async function (botData) {
  return this.create({
    user_id: botData.userId,
    name: botData.name,
    description: botData.description,
    documents: botData.documents,
    document_contents: botData.documentContents,
    model_name: botData.modelName,
    is_active: botData.isActive,
    embed_code: botData.embedCode,
    system_prompt: botData.systemPrompt
  });
};

// Aliasing delete for compatibility
botSchema.statics.delete = async function (id) {
  const res = await this.deleteOne({ _id: id });
  return res.deletedCount > 0;
};

// Aliasing update
botSchema.statics.updateBot = async function (id, userId, updateData) {
  // Map camelCase to snake_case for the update
  const payload = {};
  if (updateData.name) payload.name = updateData.name;
  if (updateData.description !== undefined) payload.description = updateData.description;
  if (updateData.isActive !== undefined) payload.is_active = updateData.isActive;
  if (updateData.systemPrompt) payload.system_prompt = updateData.systemPrompt;
  if (updateData.modelName) payload.model_name = updateData.modelName;
  if (updateData.documents) payload.documents = updateData.documents;
  if (updateData.documentContents) payload.document_contents = updateData.documentContents;

  return this.findOneAndUpdate(
    { _id: id, user_id: userId },
    { $set: payload },
    { new: true }
  );
};

const Bot = mongoose.model('Bot', botSchema);
module.exports = Bot;
