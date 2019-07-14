const MongoModel = require("./MongoModel");

const notificationFromSchema = {
  userId: String,
  name: String,
  blockId: String,
  blockName: String,
  blockType: String
};

const notificationToSchema = {
  email: String,
  userId: String
};

const notificationStatusHistorySchema = {
  status: String,
  date: Number
};

const notificationSentEmailHistorySchema = {
  date: Number
};

const schema = {
  customId: { type: String, unique: true },
  from: {
    type: notificationFromSchema,
    index: true
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
  body: String,
  readAt: Number,
  to: {
    type: notificationToSchema,
    index: true
  },
  expiresAt: Number,
  type: String,

  // status: pending | revoked | accepted | rejected | expired
  statusHistory: [notificationStatusHistorySchema],
  sentEmailHistory: [notificationSentEmailHistorySchema],
  root: String
};

const modelName = "notification";
const collectionName = "notifications";

class NotificationModel extends MongoModel {
  constructor({ connection }) {
    super({
      connection,
      modelName,
      collectionName,
      rawSchema: schema
    });
  }
}

module.exports = NotificationModel;
export {};
