const signup = require("./signup");
const login = require("./login");
const changePassword = require("./changePassword");
const forgotPassword = require("./forgotPassword");
const userExists = require("./userExists");
const updateUser = require("./updateUser");
const getCollaborationRequests = require("./getCollaborationRequests");
const respondToCollaborationRequest = require("./respondToCollaborationRequest");
const updateCollaborationRequest = require("./updateCollaborationRequest");
const changePasswordWithToken = require("./changePasswordWithToken");
const getUserData = require("./getUserData");
const userSchema = require("./schema");
const {
  wrapGraphQLOperation,
  insertUserCredentials,
  insertChangePasswordCredentials
} = require("../utils");

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
