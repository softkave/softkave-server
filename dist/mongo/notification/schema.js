"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notificationFromSchema = {
    userId: String,
    name: String,
    blockId: String,
    blockName: String,
    blockType: String
};
exports.notificationFromSchema = notificationFromSchema;
const notificationToSchema = {
    email: String,
    userId: String
};
exports.notificationToSchema = notificationToSchema;
const notificationStatusHistorySchema = {
    status: String,
    date: Number
};
exports.notificationStatusHistorySchema = notificationStatusHistorySchema;
const notificationSentEmailHistorySchema = {
    date: Number
};
exports.notificationSentEmailHistorySchema = notificationSentEmailHistorySchema;
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
exports.default = notificationSchema;
//# sourceMappingURL=schema.js.map