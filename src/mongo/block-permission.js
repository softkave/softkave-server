const mongoose = require("mongoose");

const blockPermissionSchema = {
  role: String,
  level: Number,
  assignedAt: Number,
  assignedBy: mongoose.Schema.Types.ObjectId,
  type: String,
  blockId: mongoose.Schema.Types.ObjectId
};

module.exports = {
  blockPermissionSchema
};
