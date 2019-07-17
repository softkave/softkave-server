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
const notificationError_1 = require("../../utils/notificationError");
const RequestError_1 = __importDefault(require("../../utils/RequestError"));
const constants_1 = require("../notification/constants");
const accessControlCheck_1 = __importDefault(require("./accessControlCheck"));
const actions_1 = require("./actions");
const sendCollabRequestEmail_1 = __importDefault(require("./sendCollabRequestEmail"));
const validation_1 = require("./validation");
// TODO:  define all any types
function isRequestAccepted(request) {
    if (Array.isArray(request.statusHistory)) {
        return !!request.statusHistory.find((status) => {
            return (status.status ===
                constants_1.notificationConstants.collaborationRequestStatusTypes.accepted);
        });
    }
    return false;
}
function addCollaborator({ block, collaborators, user, notificationModel, accessControlModel }) {
    return __awaiter(this, void 0, void 0, function* () {
        collaborators = validation_1.validateAddCollaboratorCollaborators(collaborators);
        yield accessControlCheck_1.default({
            user,
            block,
            accessControlModel,
            actionName: actions_1.blockActionsMap.ADD_COLLABORATOR
        });
        const collaboratorsEmailArr = collaborators.map((collaborator) => {
            return collaborator.email.toLowerCase();
        });
        const existingCollabReqQuery = {
            "to.email": {
                $in: collaboratorsEmailArr
            },
            "from.blockId": block.customId
        };
        const existingCollaborationRequests = yield notificationModel.model
            .find(existingCollabReqQuery, "to.email createdAt")
            .lean()
            .exec();
        if (existingCollaborationRequests.length > 0) {
            const errors = existingCollaborationRequests.map((request) => {
                if (isRequestAccepted(request)) {
                    return new RequestError_1.default(`${notificationError_1.notificationErrorFields.sendingRequestToAnExistingCollaborator}.${request.to.email}`, notificationError_1.notificationErrorMessages.sendingRequestToAnExistingCollaborator);
                }
                else {
                    return new RequestError_1.default(`${notificationError_1.notificationErrorFields.requestHasBeenSentBefore}.${request.to.email}`, notificationError_1.notificationErrorMessages.requestHasBeenSentBefore);
                }
            });
            throw errors;
        }
        const collaborationRequests = collaborators.map((request) => {
            const notificationBody = request.body ||
                `
      You have been invited by ${user.name} to collaborate in ${block.name}.
    `;
            return {
                customId: request.customId,
                from: {
                    userId: user.customId,
                    name: user.name,
                    blockId: block.customId,
                    blockName: block.name
                },
                createdAt: Date.now(),
                body: notificationBody,
                to: {
                    email: request.email.toLowerCase()
                },
                type: constants_1.notificationConstants.notificationTypes.collaborationRequest,
                expiresAt: request.expiresAt || null,
                statusHistory: [
                    {
                        status: constants_1.notificationConstants.collaborationRequestStatusTypes.pending,
                        date: Date.now()
                    }
                ]
            };
        });
        yield notificationModel.model.insertMany(collaborationRequests);
        // TODO: maybe deffer sending email till end of day
        sendEmails(collaborationRequests);
        function sendEmails(collaborationRequestsParam) {
            const emailPromises = collaborationRequestsParam.map((request) => {
                return sendCollabRequestEmail_1.default({
                    email: request.to.email,
                    userName: user.name,
                    blockName: block.name,
                    message: request.body,
                    expires: request.expiresAt
                });
            });
            // TODO: Resend collaboration requests that have not been sent or that failed
            emailPromises.forEach((promise, index) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield promise;
                    const request = collaborationRequestsParam[index];
                    notificationModel
                        .newModel()
                        .updateOne({
                        customId: request.customId
                    }, {
                        $push: {
                            sentEmailHistory: {
                                date: Date.now()
                            }
                        }
                    })
                        .exec();
                }
                catch (error) {
                    console.error(error);
                }
            }));
        }
    });
}
exports.default = addCollaborator;
//# sourceMappingURL=addCollaborators.js.map