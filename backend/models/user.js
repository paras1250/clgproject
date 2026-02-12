const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false // Optional for OAuth
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  provider: {
    type: String,
    default: 'email'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    alias: 'created_at' // Alias for backward compatibility if needed, though usually virtuals handle response mapping
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      delete ret.password; // Don't return password
      return ret;
    }
  },
  toObject: { virtuals: true },
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // snake_case timestamps to match Supabase
});

// Pre-save hook for password hashing
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password.trim(), salt);
  } catch (error) {
    throw error;
  }
});

// Static methods to match existing API interface

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Override findById to match signature if needed, but Mongoose findById is fine.
// Existing: static async findById(id)
// Mongoose: Model.findById(id) - Compatible.

userSchema.statics.comparePassword = async function (candidatePassword, userPassword) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.statics.createOAuth = async function (userData) {
  const user = new this({
    email: userData.email,
    name: userData.name,
    password: null,
    provider: userData.provider || 'email'
  });
  return user.save();
};

const User = mongoose.model('User', userSchema);
module.exports = User;
