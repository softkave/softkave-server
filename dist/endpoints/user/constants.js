"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userConstants = {
    minNameLength: 1,
    maxNameLength: 300,
    minPasswordLength: 5,
    maxPasswordLength: 20
};
exports.userConstants = userConstants;
const userFieldNames = {
    customId: "customId",
    name: "name",
    email: "email",
    hash: "hash",
    createdAt: "createdAt",
    forgotPasswordHistory: "forgotPasswordHistory",
    changePasswordHistory: "changePasswordHistory",
    lastNotificationCheckTime: "lastNotificationCheckTime",
    rootBlockId: "rootBlockId",
    orgs: "orgs",
    color: "color"
};
exports.userFieldNames = userFieldNames;
//# sourceMappingURL=constants.js.map