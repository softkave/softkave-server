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
const validation_1 = require("./validation");
function updateCollaborationRequest({ customId, data, user, notificationModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        customId = validation_utils_1.validators.validateUUID(customId);
        data = validation_1.validateCollaborationRequest(data);
        const notification = yield notificationModel.model
            .findOneAndUpdate({
            customId,
            "to.email": user.email
        }, data, {
            fields: "customId"
        })
            .lean()
            .exec();
        if (!!!notification) {
            throw notificationError_1.default.requestDoesNotExist;
        }
    });
}
exports.default = updateCollaborationRequest;
//# sourceMappingURL=updateCollaborationRequest.js.map