const mongoose = require("mongoose");
// const { historySchema } = require("./utils");

const blockPermissionSchema = {
  role: String,
  level: Number,
  type: String,
  blockId: mongoose.Schema.Types.ObjectId,
  assignedBy: String,
  assignedAt: Number
  // history: [historySchema],
  // parentBlockId: mongoose.Schema.Types.ObjectId
};

module.exports = {
  blockPermissionSchema
};
