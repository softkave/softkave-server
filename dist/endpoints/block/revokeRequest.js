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
const notificationError_1 = __importDefault(require("../../utils/notificationError"));
const validation_utils_1 = require("../../utils/validation-utils");
const constants_1 = require("../notification/constants");
const accessControlCheck_1 = __importDefault(require("./accessControlCheck"));
const actions_1 = require("./actions");
function revokeRequest({ request, block, notificationModel, user, accessControlModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        request = validation_utils_1.validators.validateUUID(request);
        yield accessControlCheck_1.default({
            user,
            block,
            accessControlModel,
            actionName: actions_1.blockActionsMap.REVOKE_COLLABORATION_REQUEST
        });
        const notification = yield notificationModel.model
            .findOneAndUpdate({
            ["customId"]: request,
            "from.blockId": block.customId,
            "statusHistory.status": {
                $not: {
                    $in: [
                        constants_1.notificationConstants.collaborationRequestStatusTypes.accepted,
                        constants_1.notificationConstants.collaborationRequestStatusTypes.declined
                    ]
                }
            }
        }, {
            $push: {
                statusHistory: {
                    status: constants_1.notificationConstants.collaborationRequestStatusTypes.revoked,
                    date: Date.now()
                }
            }
        }, {
            fields: "customId"
        })
            .lean()
            .exec();
        if (!notification) {
            throw notificationError_1.default.requestHasBeenSentBefore;
        }
    });
}
exports.default = revokeRequest;
//# sourceMappingURL=revokeRequest.js.map