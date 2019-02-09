const signup = require("./signup");
const login = require("./login");
const changePassword = require("./change-password");
const forgotPassword = require("./forgot-password");
const userExists = require("./user-exists");
const updateUser = require("./update-user");
const { wrapField } = require("../utils");
const userSchema = require("./schema");
const getCollaborationRequests = require("./getCollaborationRequests");
const respondToCollaborationRequest = require("./respondToCollaborationRequest");
const updateCollaborationRequest = require("./updateCollaborationRequest");
const changePasswordWithToken = require("./changePasswordWithToken");

const userHandlerGraphql = {
  userExists: wrapField(userExists),
  signup: wrapField(signup),
  login: wrapField(login),
  forgotPassword: wrapField(forgotPassword),
  changePassword: wrapField(changePassword),
  updateUser: wrapField(updateUser),
  changePasswordWithToken: wrapField(changePasswordWithToken),
  collaborationRequest: {
    updateCollaborationRequest: wrapField(updateCollaborationRequest),
    respondToCollaborationRequest: wrapField(respondToCollaborationRequest),
    getCollaborationRequests: wrapField(getCollaborationRequests)
  }
};

module.exports = {
  userHandlerGraphql,
  userSchema
};
