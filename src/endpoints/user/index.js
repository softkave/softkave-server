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
    const insertFuncs = [insertUserCredentials];

    this.userExists = wrapGraphQLOperation(userExists, staticParams);
    this.signup = wrapGraphQLOperation(signup, staticParams);
    this.login = wrapGraphQLOperation(login, staticParams);
    this.forgotPassword = wrapGraphQLOperation(forgotPassword, staticParams);
    this.changePassword = wrapGraphQLOperation(
      changePassword,
      staticParams,
      insertFuncs
    );
    this.updateUser = wrapGraphQLOperation(
      updateUser,
      staticParams,
      insertFuncs
    );
    this.changePasswordWithToken = wrapGraphQLOperation(
      changePasswordWithToken,
      staticParams,
      [insertChangePasswordCredentials]
    );
    this.updateCollaborationRequest = wrapGraphQLOperation(
      updateCollaborationRequest,
      staticParams,
      insertFuncs
    );
    this.respondToCollaborationRequest = wrapGraphQLOperation(
      respondToCollaborationRequest,
      staticParams,
      insertFuncs,
      insertFuncs
    );
    this.getCollaborationRequests = wrapGraphQLOperation(
      getCollaborationRequests,
      staticParams,
      insertFuncs
    );
    this.getUserData = wrapGraphQLOperation(
      getUserData,
      staticParams,
      insertFuncs
    );
  }
}

module.exports = {
  UserOperations,
  userSchema
};
