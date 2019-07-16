import signup from "./signup";
import login from "./login";
import changePassword from "./changePassword";
import forgotPassword from "./forgotPassword";
import userExists from "./userExists";
import updateUser from "./updateUser";
import getCollaborationRequests from "./getCollaborationRequests";
import respondToCollaborationRequest from "./respondToCollaborationRequest";
import updateCollaborationRequest from "./updateCollaborationRequest";
import changePasswordWithToken from "./changePasswordWithToken";
import getUserData from "./getUserData";
import userSchema from "./schema";
import {
  wrapGraphQLOperation,
  insertUserCredentials,
  insertChangePasswordCredentials
} from "../utils";

class UserOperations {
  constructor(staticParams) {
    const middlewares = [insertUserCredentials];

    this.userExists = wrapGraphQLOperation(userExists, staticParams);
    this.signup = wrapGraphQLOperation(signup, staticParams);
    this.login = wrapGraphQLOperation(login, staticParams);
    this.forgotPassword = wrapGraphQLOperation(forgotPassword, staticParams);
    this.changePassword = wrapGraphQLOperation(
      changePassword,
      staticParams,
      middlewares
    );

    this.updateUser = wrapGraphQLOperation(
      updateUser,
      staticParams,
      middlewares
    );

    this.changePasswordWithToken = wrapGraphQLOperation(
      changePasswordWithToken,
      staticParams,
      [insertChangePasswordCredentials]
    );
    this.updateCollaborationRequest = wrapGraphQLOperation(
      updateCollaborationRequest,
      staticParams,
      middlewares
    );

    this.respondToCollaborationRequest = wrapGraphQLOperation(
      respondToCollaborationRequest,
      staticParams,
      middlewares
    );

    this.getCollaborationRequests = wrapGraphQLOperation(
      getCollaborationRequests,
      staticParams,
      middlewares
    );

    this.getUserData = wrapGraphQLOperation(
      getUserData,
      staticParams,
      middlewares
    );
  }
}

module.exports = {
  UserOperations,
  userSchema
};
export {};
