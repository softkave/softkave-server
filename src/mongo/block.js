const mongoose = require("mongoose");
const { connection } = require("./connection");
const { makeModel } = require("./makeModel");
const { dataSchema } = require("./arbitrary-data");

const blockCollaboratorsDataSchema = {
  userId: mongoose.Schema.Types.ObjectId,
  data: dataSchema
};

const blockAclSchema = {
  action: String,
  level: Number
};

const blockRolesSchema = {
  label: String,
  level: Number
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
  owner: { type: mongoose.SchemaTypes.ObjectId, index: true },
  parents: { type: [mongoose.SchemaTypes.ObjectId], index: true },
  data: [dataSchema],
  createdBy: { type: mongoose.SchemaTypes.ObjectId, index: true },
  collaborators: { type: [blockCollaboratorsDataSchema], index: true },
  acl: { type: [blockAclSchema], index: true },
  roles: { type: [blockRolesSchema], index: true },
  priority: String
};

module.exports = makeModel(connection, blockSchema, "block", "blocks");
