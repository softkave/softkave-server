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
const constants_1 = require("./constants");
function canReadBlock({ block, user }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (user.rootBlockId === block.customId) {
            return true;
        }
        let orgID = null;
        if (block.type === constants_1.blockConstants.blockTypes.org) {
            orgID = block.customId;
        }
        else if (Array.isArray(block.parents) && block.parents.length > 0) {
            orgID = block.parents[0];
        }
        if (orgID) {
            if (user.orgs.indexOf(orgID) !== -1) {
                return true;
            }
        }
        throw userError_1.default.permissionDenied;
    });
}
exports.default = canReadBlock;
//# sourceMappingURL=canReadBlock.js.map