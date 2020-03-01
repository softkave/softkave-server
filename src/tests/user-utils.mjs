import { getDataFromObject } from "./utils";
import {
  changePasswordMutation,
  changePasswordWithTokenMutation,
  forgotPasswordMutation,
  getCollaborationRequestsQuery,
  getSessionDetailsQuery,
  getUserDataQuery,
  respondToCollaborationRequestMutation,
  updateCollaborationRequestMutation,
  updateUserMutation,
  userExistsQuery,
  userLoginMutation,
  userSignupMutation
} from "./user-schema";
import { query } from "./utils";

export async function signup(user) {
  const userFields = ["name", "password", "email", "color"];

  const result = await query({
    query: userSignupMutation,
    variables: { user: getDataFromObject(user, userFields) },
    path: "data.user.signup"
  });

  return result;
}

export async function login(email, password) {
  const result = await query({
    query: userLoginMutation,
    variables: { email, password },
    path: "data.user.login"
  });

  return result;
}

export function updateUser(user, token) {
  const updateUserFields = ["name", "lastNotificationCheckTime"];

  return query({
    token,
    query: updateUserMutation,
    variables: { user: getDataFromObject(user, updateUserFields) },
    path: "data.user.updateUser"
  });
}

export async function changePassword(password, token) {
  const result = await query({
    token,
    query: changePasswordMutation,
    variables: { password },
    path: "data.user.changePassword"
  });

  return result;
}

export function forgotPassword(email) {
  return query({
    query: forgotPasswordMutation,
    variables: { email },
    path: "data.user.forgotPassword"
  });
}

export function userExists(email) {
  return query({
    query: userExistsQuery,
    variables: { email },
    path: "data.user.userExists"
  });
}

export function updateCollaborationRequest(request, data, token) {
  const updateRequestFields = ["readAt"];

  return query({
    token,
    query: updateCollaborationRequestMutation,
    variables: {
      customId: request.customId,
      data: getDataFromObject(data, updateRequestFields)
    },
    path: "data.user.updateCollaborationRequest"
  });
}

export function changePasswordWithToken(password, token) {
  return query({
    token,
    query: changePasswordWithTokenMutation,
    variables: {
      password
    },
    path: "data.user.changePasswordWithToken"
  });
}

export function respondToCollaborationRequest(request, response, token) {
  return query({
    token,
    query: respondToCollaborationRequestMutation,
    variables: { response, customId: request.customId },
    path: "data.user.respondToCollaborationRequest"
  });
}

export function getCollaborationRequests(token) {
  return query({
    token,
    query: getCollaborationRequestsQuery,
    variables: {},
    path: "data.user.getCollaborationRequests"
  });
}

export function getSessionDetails(token) {
  return query({
    token,
    query: getSessionDetailsQuery,
    variables: {},
    path: "data.user.getSessionDetails"
  });
}

export function getUserData(token) {
  return query({
    token,
    query: getUserDataQuery,
    variables: {},
    path: "data.user.getUserData"
  });
}
