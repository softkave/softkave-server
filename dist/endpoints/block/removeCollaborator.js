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
const v4_1 = __importDefault(require("uuid/v4"));
const validation_utils_1 = require("../../utils/validation-utils");
const constants_1 = require("../notification/constants");
const deleteOrgIDFromUser_1 = __importDefault(require("../user/deleteOrgIDFromUser"));
const userError_1 = __importDefault(require("../user/userError"));
const accessControlCheck_1 = __importDefault(require("./accessControlCheck"));
const actions_1 = require("./actions");
function removeCollaborator({ block, collaborator, user, notificationModel, accessControlModel, userModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        collaborator = validation_utils_1.validators.validateUUID(collaborator);
        const ownerBlock = block;
        yield accessControlCheck_1.default({
            user,
            block,
            accessControlModel,
            actionName: actions_1.blockActionsMap.REMOVE_COLLABORATOR
        });
        const fetchedCollaborator = yield userModel.model
            .findOne({
            customId: collaborator
        })
            .exec();
        if (!fetchedCollaborator) {
            throw userError_1.default.collaboratorDoesNotExist;
        }
        yield deleteOrgIDFromUser_1.default({ user, id: block.customId });
        sendNotification();
        function sendNotification() {
            return __awaiter(this, void 0, void 0, function* () {
                const notification = new notificationModel.model({
                    customId: v4_1.default(),
                    from: {
                        userId: user.customId,
                        name: user.name,
                        blockId: ownerBlock.customId,
                        blockName: ownerBlock.name,
                        blockType: ownerBlock.type
                    },
                    createdAt: Date.now(),
                    body: `
        Hi ${fetchedCollaborator.name}, we're sorry to inform you that you have been removed from ${ownerBlock.name}. Goodluck!
      `,
                    to: {
                        email: fetchedCollaborator.email,
                        userId: fetchedCollaborator.customId
                    },
                    type: constants_1.notificationConstants.notificationTypes.removeCollaborator
                });
                notification.save().catch((error) => {
                    // For debugging purposes
                    console.error(error);
                });
            });
        }
    });
}
exports.default = removeCollaborator;
//# sourceMappingURL=removeCollaborator.js.map