const {
  connection
} = require("./connection");
const makeModel = require("./makeModel");
const mongoose = require("mongoose");

const userRoleSchema = {
  role: {
    type: String,
    trim: true,
    lowercase: true
  },
  blockId: {
    type: String,
    trim: true
  },
  hierarchy: Number,
  assignedBy: mongoose.Schema.Types.ObjectId,
  assignedAt: Number,
  type: {
    type: String,
    trim: true,
    lowercase: true
  }
};

const userSchema = {
  name: {
    type: String,
    trim: true,
    // lowercase: true
  },
  email: {
    type: String,
    unique: true,
    index: true,
    trim: true,
    lowercase: true
  },
  hash: {
    type: String,
    index: true
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
  forgotPasswordHistory: [Number],
  changePasswordHistory: [Number],
  lastNotificationCheckTime: Number,
  roles: {
    type: [userRoleSchema],
    index: true
  }
};

let userModel = makeModel(connection, userSchema, "user", "users");
module.exports = userModel;