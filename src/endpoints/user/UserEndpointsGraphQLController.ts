import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
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

export default class UserEndpointsGraphQLController {
    public static signup(data, req) {
        return wrapEndpoint(data, req, () =>
            signup(
                getSignupContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static changePassword(data, req) {
        return wrapEndpoint(data, req, () =>
            changePassword(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static changePasswordWithToken(data, req) {
        return wrapEndpoint(data, req, () =>
            changePasswordWithToken(
                getChangePasswordWithTokenContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static forgotPassword(data, req) {
        return wrapEndpoint(data, req, () =>
            forgotPassword(
                new ForgotPasswordContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static getChangePasswordTokenData(data, req) {
        return wrapEndpoint(data, req, () =>
            getChangePasswordTokenData(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static getUserNotifications(data, req) {
        return wrapEndpoint(data, req, () =>
            getUserNotifications(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static getUserData(data, req) {
        return wrapEndpoint(data, req, () =>
            getUserData(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static login(data, req) {
        return wrapEndpoint(data, req, () =>
            login(getBaseContext(), RequestData.fromExpressRequest(req, data))
        );
    }

    public static respondToCollaborationRequest(data, req) {
        return wrapEndpoint(data, req, () =>
            respondToCollaborationRequest(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static markNotificationRead(data, req) {
        return wrapEndpoint(data, req, () =>
            markNotificationRead(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static updateUser(data, req) {
        return wrapEndpoint(data, req, () =>
            updateUser(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static userExists(data, req) {
        return wrapEndpoint(data, req, () =>
            userExists(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }
}
