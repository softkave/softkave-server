const { connection } = require("./connection");
const makeModel = require("./makeModel");
const mongoose = require("mongoose");

const schema = {
  from: {
    userId: mongoose.SchemaTypes.ObjectId,
    name: String,
    blockId: { type: String, index: true },
    blockName: String,
    blockType: String
  },
  createdAt: { type: Number, default: Date.now },
  body: String,
  readAt: Number,
  to: {
    email: { type: String, index: true },
    userId: mongoose.SchemaTypes.ObjectId
  },
  // response: String,
  // respondedAt: Number,
  // permission: [blockPermissionSchema],
  // updatedAt: Number,
  // status: String, // Pending | Revoked | Accepted | Rejected | Expired
  expiresAt: Number,
  type: String,
  statusHistory: [{ status: String, date: Number }],
  sentEmailHistory: [{ date: Number }],
  thread: [{ id: mongoose.SchemaTypes.ObjectId }]
};

const collaborationRequestModel = makeModel(
  connection,
  schema,
  "notification",
  "notifications"
);

module.exports = collaborationRequestModel;
