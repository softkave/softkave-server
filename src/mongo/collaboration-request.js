const { connection } = require("./connection");
const makeModel = require("./makeModel");
const mongoose = require("mongoose");
const { blockPermissionSchema } = require("./block-permission");

const schema = {
  from: {
    userId: mongoose.SchemaTypes.ObjectId,
    name: String,
    blockId: { type: mongoose.Schema.Types.ObjectId, index: true },
    blockName: String
  },
  createdAt: { type: Number, default: Date.now },
  body: String,
  readAt: Number,
  to: {
    email: { type: String, index: true }
  },
  response: String,
  respondedAt: Number,
  permission: [blockPermissionSchema]
};

const collaborationRequestModel = makeModel(
  connection,
  schema,
  "collaboration-request",
  "collaboration-requests"
);

module.exports = collaborationRequestModel;
