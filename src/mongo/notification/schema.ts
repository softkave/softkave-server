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

const notificationSchema = {
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

export default notificationSchema;
export {
  notificationFromSchema,
  notificationToSchema,
  notificationSentEmailHistorySchema,
  notificationStatusHistorySchema
};
