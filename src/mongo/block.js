const mongoose = require("mongoose");
const { connection } = require("./connection");
const makeModel = require("./makeModel");

const blockTaskCollaboratorsDataSchema = {
  userId: String,
  completedAt: Number,
  assignedAt: Number,
  assignedBy: String
};

const blockSchema = {
  customId: { type: String, index: true },
  name: {
    type: String,
    index: true
  },
  description: {
    type: String
  },
  expectedEndAt: Number,
  createdAt: {
    type: Number,
    default: Date.now
  },
  color: {
    type: String
  },
  updatedAt: Number,
  type: {
    type: String,
    index: true
  },
  parents: {
    type: [
      {
        type: String
      }
    ],
    index: true
  },
  createdBy: {
    type: String,
    index: true
  },
  taskCollaborators: {
    type: [blockTaskCollaboratorsDataSchema],
    index: true
  },
  priority: {
    type: String
  }
};

module.exports = makeModel(connection, blockSchema, "block", "blocks");
