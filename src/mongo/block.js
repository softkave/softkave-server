const mongoose = require("mongoose");
const { connection } = require("./connection");
const makeModel = require("./makeModel");
const { historySchema } = require("./utils");

const blockTaskCollaboratorsDataSchema = {
  userId: mongoose.Schema.Types.ObjectId,
  // data: dataSchema,
  completedAt: Number,
  assignedAt: Number,
  assignedBy: mongoose.Schema.Types.ObjectId,
  expectedEndAt: Number
};

const blockAclSchema = {
  action: String,
  level: Number,
  history: [historySchema]
};

const blockRoleSchema = {
  label: String,
  level: Number,
  history: [historySchema]
};

const blockSchema = {
  name: {
    type: String,
    trim: true,
    index: true
  },
  description: { type: String, trim: true },
  expectedEndAt: Number,
  completedAt: Number,
  createdAt: { type: Number, default: Date.now },
  color: String,
  updatedAt: Number,
  type: { type: String, index: true },
  // owner: { type: mongoose.SchemaTypes.ObjectId, index: true },
  parents: { type: [String], index: true },
  // data: [dataSchema],
  createdBy: { type: mongoose.SchemaTypes.ObjectId, index: true },
  taskCollaborators: { type: [blockTaskCollaboratorsDataSchema], index: true },
  acl: { type: [blockAclSchema], index: true },
  roles: { type: [blockRoleSchema], index: true },
  priority: String
};

module.exports = makeModel(connection, blockSchema, "block", "blocks");
