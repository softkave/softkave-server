"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessControlSchema = {
    orgId: { type: String, unique: true },
    actionName: { type: String, index: true },
    permittedRoles: { type: [String], index: true }
};
exports.default = accessControlSchema;
//# sourceMappingURL=schema.js.map