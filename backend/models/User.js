'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },

    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either user or admin',
      },
      default: 'user',
    },

    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.isActive;
        return ret;
      },
    },
  }
);

userSchema.index({ email: 1, isActive: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase().trim() })
    .select('+passwordHash +isActive');
};

module.exports = mongoose.model('User', userSchema);