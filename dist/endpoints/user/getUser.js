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
const validation_utils_1 = require("../../utils/validation-utils");
const userError_1 = __importDefault(require("./userError"));
function getUser({ collaborator, userModel, required }) {
    return __awaiter(this, void 0, void 0, function* () {
        collaborator = validation_utils_1.validators.validateUUID(collaborator);
        const query = {
            customId: collaborator
        };
        const fetchedCollaborator = yield userModel.model.findOne(query).exec();
        if (!fetchedCollaborator && required) {
            throw userError_1.default.collaboratorDoesNotExist;
        }
        return fetchedCollaborator;
    });
}
exports.default = getUser;
//# sourceMappingURL=getUser.js.map