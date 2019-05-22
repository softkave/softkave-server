const { connection } = require("./connection");
const MongoModel = require("./MongoModel");

const schema = {
  customId: { type: String, index: true },
  from: {
    type: {
      userId: String,
      name: {
        type: String
      },
      blockId: {
        type: String
      },
      blockName: {
        type: String
      },
      blockType: {
        type: String
      }
    },
    index: true
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
  body: String,
  readAt: Number,
  to: {
    type: {
      email: {
        type: String
      },
      userId: String
    },
    index: true
  },
  expiresAt: Number,
  type: {
    type: String
  },

  // status: pending | revoked | accepted | rejected | expired
  statusHistory: [
    {
      status: {
        type: String
      },
      date: Number
    }
  ],
  sentEmailHistory: [
    {
      date: Number
    }
  ],
  root: {
    type: String
  }
};

const notificationModel = new MongoModel({
  connection,
  rawSchema: schema,
  modelName: "notification",
  collectionName: "notifications"
});

module.exports = notificationModel;
