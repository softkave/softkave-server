import { getBaseContext } from "../contexts/BaseContext";
import { wrapEndpoint } from "../utils";
import changePassword from "./changePassword/changePassword";
import changePasswordWithToken from "./changePasswordWithToken/changePasswordWithToken";
import { getChangePasswordWithTokenContext } from "./changePasswordWithToken/context";
import ForgotPasswordContext from "./forgotPassword/context";
import forgotPassword from "./forgotPassword/forgotPassword";
import getChangePasswordTokenData from "./getChangePasswordTokenData/getChangePasswordTokenData";
import getUserData from "./getUserData/getUserData";
import getUserNotifications from "./getUserNotifications/getUserNotifications";
import login from "./login/login";
import markNotificationRead from "./markNotificationRead/markNotificationRead";
import respondToCollaborationRequest from "./respondToCollaborationRequest/respondToCollaborationRequest";
import { getSignupContext } from "./signup/context";
import signup from "./signup/signup";
import updateUser from "./updateUser/updateUser";
import userExists from "./userExists/userExists";

export default class UserController {
  public signup(data, req) {
    return wrapEndpoint(data, req, () =>
      signup(getSignupContext(), { req, data })
    );
  }

  public changePassword(data, req) {
    return wrapEndpoint(data, req, () =>
      changePassword(getBaseContext(), { req, data })
    );
  }

  public changePasswordWithToken(data, req) {
    return wrapEndpoint(data, req, () =>
      changePasswordWithToken(getChangePasswordWithTokenContext(), {
        req,
        data,
      })
    );
  }

  public forgotPassword(data, req) {
    return wrapEndpoint(data, req, () =>
      forgotPassword(new ForgotPasswordContext(), { req, data })
    );
  }

  public getChangePasswordTokenData(data, req) {
    return wrapEndpoint(data, req, () =>
      getChangePasswordTokenData(getBaseContext(), { req, data })
    );
  }

  public getUserNotifications(data, req) {
    return wrapEndpoint(data, req, () =>
      getUserNotifications(getBaseContext(), { req, data })
    );
  }

  public getUserData(data, req) {
    return wrapEndpoint(data, req, () =>
      getUserData(getBaseContext(), { req, data })
    );
  }

  public login(data, req) {
    return wrapEndpoint(data, req, () =>
      login(getBaseContext(), { req, data })
    );
  }

  public respondToCollaborationRequest(data, req) {
    return wrapEndpoint(data, req, () =>
      respondToCollaborationRequest(getBaseContext(), { req, data })
    );
  }

  public markNotificationRead(data, req) {
    return wrapEndpoint(data, req, () =>
      markNotificationRead(getBaseContext(), { req, data })
    );
  }

  public updateUser(data, req) {
    return wrapEndpoint(data, req, () =>
      updateUser(getBaseContext(), { data, req })
    );
  }

  public userExists(data, req) {
    return wrapEndpoint(data, req, () =>
      userExists(getBaseContext(), { req, data })
    );
  }
}

const controller: UserController = new UserController();

export function getUserController() {
  return controller;
}
