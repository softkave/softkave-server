"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestError_1 = __importDefault(require("../../utils/RequestError"));
const utils_1 = require("../../utils/utils");
const accessControlCheck_1 = __importDefault(require("./accessControlCheck"));
const actions_1 = require("./actions");
const blockError_1 = require("./blockError");
const constants_1 = require("./constants");
const getBlocksAccessControlData_1 = __importDefault(require("./getBlocksAccessControlData"));
const validation_1 = require("./validation");
// TODO: define types
function indexRoles(roles) {
    return utils_1.indexArray(roles, {
        indexer: (role) => role.roleName,
        reducer: (role, arr, index) => ({ role, index })
    });
}
function getAccessControlUpdateWithRole(bulkAccessControlUpdates, role, newRole) {
    bulkAccessControlUpdates.push({
        updateMany: {
            filter: {
                permittedRoles: role.roleName
            },
            update: {
                "permittedRoles.$": newRole.roleName
            }
        }
    });
}
function getUserUpdateWithRole(bulkUserUpdates, role, newRole) {
    bulkUserUpdates.push({
        updateMany: {
            filter: {
                roles: {
                    $elemMatch: { roleName: role.roleName, orgId: role.orgId }
                }
            },
            update: {
                "roles.$": newRole
            }
        }
    });
}
function getBulkWriteUpdates(existingRoles, indexedRoles, roles, bulkUserUpdates, bulkAccessControlUpdates) {
    existingRoles.forEach((role, index) => {
        if (!indexedRoles[role.roleName]) {
            const newRole = index < roles.length ? roles[index] : roles[roles.length - 1];
            getUserUpdateWithRole(bulkUserUpdates, role, newRole);
            getAccessControlUpdateWithRole(bulkAccessControlUpdates, role, newRole);
        }
    });
}
function updateRoles({ block, user, roles, accessControlModel, userModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (block.type !== constants_1.blockConstants.blockTypes.org) {
            throw new RequestError_1.default(blockError_1.blockErrorFields.invalidOperation, blockError_1.blockErrorMessages.accessControlOnTypeOtherThanOrg);
        }
        validation_1.validateRoleNameArray(roles);
        yield accessControlCheck_1.default({
            user,
            block,
            accessControlModel,
            actionName: actions_1.blockActionsMap.UPDATE_ROLES
        });
        const existingRoles = yield getBlocksAccessControlData_1.default({
            block,
            user,
            accessControlModel
        });
        const indexedRoles = indexRoles(roles);
        // TODO: define type
        const bulkUserUpdates = [];
        const bulkAccessControlUpdates = [];
        /**
         * when a user is removed from an org, send a removed error, and show a notification modal,
         * prompt the user to respond, then remove or delete org from UI
         *
         * same when the user's access is revoked from some features
         *
         * maybe query or poll for role changes, or every query returns latest role data,
         * so that the UI can respond, or use websockets
         */
        getBulkWriteUpdates(existingRoles, indexedRoles, roles, bulkUserUpdates, bulkAccessControlUpdates);
        block.roles = roles.map(role => {
            return {
                roleName: role,
                createdAt: Date.now(),
                createdBy: user.customId
            };
        });
        yield block.save();
        if (bulkUserUpdates.length > 0) {
            yield userModel.model.bulkWrite(bulkUserUpdates);
            yield accessControlModel.model.bulkWrite(bulkAccessControlUpdates);
        }
    });
}
exports.default = updateRoles;
//# sourceMappingURL=updateRoles.js.map