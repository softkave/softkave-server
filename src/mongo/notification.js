const {
  connection
} = require("./connection");
const makeModel = require("./makeModel");
const mongoose = require("mongoose");

const schema = {
  from: {
    type: {
      userId: mongoose.SchemaTypes.ObjectId,
      name: {
        type: String,
        trim: true
      },
      blockId: {
        type: String,
        trim: true
      },
      blockName: {
        type: String,
        trim: true,
        lowercase: true
      },
      blockType: {
        type: String,
        trim: true,
        lowercase: true
      }
    },
    index: true
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
  body: String,
  readAt: Number,
  to: {
    type: {
      email: {
        type: String,
        trim: true,
        lowercase: true
      },
      userId: mongoose.SchemaTypes.ObjectId
    },
    index: true
  },
  // response: String,
  // respondedAt: Number,
  // role: [blockRoleSchema],
  // updatedAt: Number,
  // status: String, // Pending | Revoked | Accepted | Rejected | Expired
  expiresAt: Number,
  type: {
    type: String,
    trim: true,
    lowercase: true,
  },
  statusHistory: [{
    status: {
      type: String,
      trim: true,
      lowercase: true,
    },
    date: Number
  }],
  sentEmailHistory: [{
    date: Number
  }],
  root: {
    type: String,
    trim: true
  }
};

const notificationModel = makeModel(
  connection,
  schema,
  "notification",
  "notifications"
);

module.exports = notificationModel;