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
const userError_1 = __importDefault(require("../user/userError"));
const utils_1 = require("../user/utils");
const actions_1 = require("./actions");
const canReadBlock_1 = __importDefault(require("./canReadBlock"));
const utils_2 = require("./utils");
function accessControlCheckUsingRole({ user, accessControlModel, CRUDActionName, actionName, block }) {
    return __awaiter(this, void 0, void 0, function* () {
        actionName = actionName || `${CRUDActionName}_${block.type}`;
        actionName = actionName.toUpperCase();
        const orgId = utils_2.getRootParentID(block) || block.customId;
        const userRole = utils_1.findRole(user, orgId);
        let permit = false;
        if (userRole) {
            if (actionName === actions_1.blockActionsMap.READ_ORG) {
                permit = true;
            }
            else {
                const query = {
                    actionName,
                    orgId,
                    permittedRoles: userRole.roleName
                };
                permit = !!(yield accessControlModel.model
                    .findOne(query, "_id")
                    .lean()
                    .exec());
            }
        }
        if (!permit) {
            throw userError_1.default.permissionDenied;
        }
        return permit;
    });
}
function accessControlCheckUsingOrgs({ user, block }) {
    return canReadBlock_1.default({ block, user });
}
function accessControlCheck(params) {
    return __awaiter(this, void 0, void 0, function* () {
        if (utils_1.userRoleIsUpgraded(params.user)) {
            return accessControlCheckUsingRole(params);
        }
        else {
            return accessControlCheckUsingOrgs(params);
        }
    });
}
exports.default = accessControlCheck;
//# sourceMappingURL=accessControlCheck.js.map