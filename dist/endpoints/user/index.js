"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const changePassword_1 = __importDefault(require("./changePassword"));
const changePasswordWithToken_1 = __importDefault(require("./changePasswordWithToken"));
const forgotPassword_1 = __importDefault(require("./forgotPassword"));
const getCollaborationRequests_1 = __importDefault(require("./getCollaborationRequests"));
const getUserData_1 = __importDefault(require("./getUserData"));
const login_1 = __importDefault(require("./login"));
const respondToCollaborationRequest_1 = __importDefault(require("./respondToCollaborationRequest"));
const schema_1 = __importDefault(require("./schema"));
exports.userSchema = schema_1.default;
const signup_1 = __importDefault(require("./signup"));
const updateCollaborationRequest_1 = __importDefault(require("./updateCollaborationRequest"));
const updateUser_1 = __importDefault(require("./updateUser"));
const userExists_1 = __importDefault(require("./userExists"));
// TODO: define all any types
class UserOperations {
    constructor(staticParams) {
        const middlewares = [utils_1.insertUserCredentials];
        this.userExists = utils_1.wrapGraphQLOperation(userExists_1.default, staticParams);
        this.signup = utils_1.wrapGraphQLOperation(signup_1.default, staticParams);
        this.login = utils_1.wrapGraphQLOperation(login_1.default, staticParams);
        this.forgotPassword = utils_1.wrapGraphQLOperation(forgotPassword_1.default, staticParams);
        this.changePassword = utils_1.wrapGraphQLOperation(changePassword_1.default, staticParams, middlewares);
        this.updateUser = utils_1.wrapGraphQLOperation(updateUser_1.default, staticParams, middlewares);
        this.changePasswordWithToken = utils_1.wrapGraphQLOperation(changePasswordWithToken_1.default, staticParams, [utils_1.insertChangePasswordCredentials]);
        this.updateCollaborationRequest = utils_1.wrapGraphQLOperation(updateCollaborationRequest_1.default, staticParams, middlewares);
        this.respondToCollaborationRequest = utils_1.wrapGraphQLOperation(respondToCollaborationRequest_1.default, staticParams, middlewares);
        this.getCollaborationRequests = utils_1.wrapGraphQLOperation(getCollaborationRequests_1.default, staticParams, middlewares);
        this.getUserData = utils_1.wrapGraphQLOperation(getUserData_1.default, staticParams, middlewares);
    }
}
exports.UserOperations = UserOperations;
//# sourceMappingURL=index.js.map