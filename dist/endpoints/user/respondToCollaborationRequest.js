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
const addOrgIDToUser_1 = __importDefault(require("./addOrgIDToUser"));
const validation_1 = require("./validation");
function respondToCollaborationRequest({ customId, response, notificationModel, user, blockModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        customId = validation_utils_1.validators.validateUUID(customId);
        response = validation_1.validateCollaborationRequestResponse(response);
        const request = yield notificationModel.model
            .findOneAndUpdate({
            customId,
            "to.email": user.email,
            "statusHistory.status": {
                $not: {
                    $in: [
                        constants_1.notificationConstants.collaborationRequestStatusTypes.accepted,
                        constants_1.notificationConstants.collaborationRequestStatusTypes.declined,
                        constants_1.notificationConstants.collaborationRequestStatusTypes.revoked
                    ]
                }
            }
        }, {
            $push: {
                statusHistory: {
                    status: response,
                    date: Date.now()
                }
            }
        }, {
            fields: "customId from"
        })
            .lean()
            .exec();
        if (!!!request) {
            throw notificationError_1.default.requestDoesNotExist;
        }
        if (response === constants_1.notificationConstants.collaborationRequestStatusTypes.accepted) {
            const block = yield blockModel.model
                .findOne({ customId: request.from.blockId })
                .lean()
                .exec();
            yield addOrgIDToUser_1.default({ user, ID: block.customId });
            return { block };
        }
    });
}
exports.default = respondToCollaborationRequest;
//# sourceMappingURL=respondToCollaborationRequest.js.map