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
const accessControlCheck_1 = __importDefault(require("./accessControlCheck"));
const actions_1 = require("./actions");
const constants_1 = require("./constants");
function toggleTask({ block, data, blockModel, user, accessControlModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield accessControlCheck_1.default({
            user,
            block,
            accessControlModel,
            actionName: actions_1.blockActionsMap.TOGGLE_TASK
        });
        yield blockModel.model.updateOne({
            customId: block.customId,
            type: constants_1.blockConstants.blockTypes.task,
            taskCollaborators: {
                $elemMatch: {
                    userId: user.customId
                }
            }
        }, {
            "taskCollaborators.$.completedAt": data ? Date.now() : null
        }, {
            fields: "customId"
        });
    });
}
exports.default = toggleTask;
//# sourceMappingURL=toggleTask.js.map