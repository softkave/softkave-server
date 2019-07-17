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
const utils_1 = require("../../utils/utils");
const getRole_1 = __importDefault(require("../block/getRole"));
const getUser_1 = __importDefault(require("../user/getUser"));
const utils_2 = require("../user/utils");
const accessControlCheck_1 = __importDefault(require("./accessControlCheck"));
const actions_1 = require("./actions");
const blockError_1 = __importDefault(require("./blockError"));
const utils_3 = require("./utils");
const validation_1 = require("./validation");
function assignRole({ block, collaborator, user, roleName, accessControlModel, userModel, assignedBySystem }) {
    return __awaiter(this, void 0, void 0, function* () {
        const fetchedCollaborator = yield getUser_1.default({
            collaborator,
            userModel,
            required: true
        });
        if (!assignedBySystem) {
            yield accessControlCheck_1.default({
                user,
                block,
                accessControlModel,
                actionName: actions_1.blockActionsMap.ASSIGN_ROLE
            });
        }
        validation_1.validateRoleName(roleName);
        const orgId = utils_3.getRootParentID(block);
        // to check if role exists
        yield getRole_1.default({
            block,
            accessControlModel,
            roleName,
            required: true
        });
        const currentRole = utils_2.findRole(fetchedCollaborator, orgId);
        const newRole = {
            roleName,
            orgId,
            assignedAt: Date.now(),
            assignedBy: assignedBySystem ? "system" : user.customId
        };
        fetchedCollaborator.roles = utils_1.update(fetchedCollaborator.roles, currentRole, newRole, blockError_1.default.roleDoesNotExist, utils_2.findRoleIndex);
        fetchedCollaborator.markModified("roles");
        yield fetchedCollaborator.save();
    });
}
exports.default = assignRole;
//# sourceMappingURL=assignRole.js.map