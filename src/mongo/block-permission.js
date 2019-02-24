const mongoose = require("mongoose");
const { historySchema } = require("./utils");

const blockPermissionSchema = {
  role: String,
  level: Number,
  type: String,
  blockId: mongoose.Schema.Types.ObjectId
  // history: [historySchema],
  // parentBlockId: mongoose.Schema.Types.ObjectId
};

module.exports = {
  blockPermissionSchema
};
