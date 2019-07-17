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
const accessControlCheck_1 = __importDefault(require("./accessControlCheck"));
const actions_1 = require("./actions");
const blockError_1 = require("./blockError");
const constants_1 = require("./constants");
const validation_1 = require("./validation");
function updateAccessControlData({ block, user, accessControlData, accessControlModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (block.type !== constants_1.blockConstants.blockTypes.org) {
            throw new RequestError_1.default(blockError_1.blockErrorFields.invalidOperation, blockError_1.blockErrorMessages.accessControlOnTypeOtherThanOrg);
        }
        // TODO: validate if the permitted roles exist in the block
        validation_1.validateAccessControlArray(accessControlData);
        yield accessControlCheck_1.default({
            user,
            block,
            accessControlModel,
            actionName: actions_1.blockActionsMap.UPDATE_ROLES
        });
        /**
         * TODO: when a user is removed from an org, send a removed error, and show a notification modal,
         * prompt the user to respond, then remove or delete org from UI
         *
         * same when the user's access is revoked from some features
         *
         * maybe query or poll for role changes, or every query returns latest role data,
         * so that the UI can respond, or use websockets
         */
        yield accessControlModel.model.deleteMany({ orgId: block.customId }).exec();
        yield accessControlModel.model.insertMany(accessControlData);
    });
}
exports.default = updateAccessControlData;
//# sourceMappingURL=updateAccessControlData.js.map