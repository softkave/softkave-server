const mongoose = require("mongoose");
const {
  connection
} = require("./connection");
const makeModel = require("./makeModel");

const blockTaskCollaboratorsDataSchema = {
  userId: mongoose.Schema.Types.ObjectId,
  completedAt: Number,
  assignedAt: Number,
  assignedBy: mongoose.Schema.Types.ObjectId,
  expectedEndAt: Number
};

const blockAclSchema = {
  action: {
    type: String,
    trim: true
  },
  roles: [{
    type: String,
    trim: true,
    lowercase: true
  }]
};

const blockRoleSchema = {
  role: {
    type: {
      type: String,
      trim: true,
      lowercase: true
    },
    index: true
  },
  hierarchy: Number
};

const blockSchema = {
  name: {
    type: String,
    trim: true,
    index: true,
    lowercase: true
  },
  description: {
    type: String
  },
  expectedEndAt: Number,
  // completedAt: Number,
  createdAt: {
    type: Number,
    default: Date.now
  },
  color: {
    type: String,
    trim: true,
    lowercase: true
  },
  updatedAt: Number,
  type: {
    type: String,
    index: true,
    trim: true,
    lowercase: true
  },
  parents: {
    type: [{
      type: String,
      trim: true
    }],
    index: true
  },
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    index: true
  },
  taskCollaborators: {
    type: [blockTaskCollaboratorsDataSchema],
    index: true
  },
  acl: {
    type: [blockAclSchema],
    index: true
  },
  roles: {
    type: [blockRoleSchema],
    index: true
  },
  priority: {
    type: String,
    trim: true,
    lowercase: true
  }
};

module.exports = makeModel(connection, blockSchema, "block", "blocks");