"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userRoleSchema = {
    roleName: String,
    orgId: String,
    assignedAt: Number,
    assignedBy: String
};
exports.userRoleSchema = userRoleSchema;
const userSchema = {
    customId: { type: String, unique: true },
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    hash: {
        type: String,
        index: true
    },
    createdAt: {
        type: Number,
        default: Date.now
    },
    forgotPasswordHistory: [Number],
    changePasswordHistory: [Number],
    lastNotificationCheckTime: Number,
    rootBlockId: String,
    orgs: [String],
    color: String,
    roles: [userRoleSchema]
};
exports.default = userSchema;
//# sourceMappingURL=schema.js.map