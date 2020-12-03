import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import getUserNotifications from "../notifications/getUserNotifications/getUserNotifications";
import markNotificationRead from "../notifications/markNotificationRead/markNotificationRead";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import changePassword from "./changePassword/changePassword";
import changePasswordWithToken from "./changePasswordWithToken/changePasswordWithToken";
import { getChangePasswordWithTokenContext } from "./changePasswordWithToken/context";
import ForgotPasswordContext from "./forgotPassword/context";
import forgotPassword from "./forgotPassword/forgotPassword";
import getChangePasswordTokenData from "./getChangePasswordTokenData/getChangePasswordTokenData";
import getUserData from "./getUserData/getUserData";
import login from "./login/login";
import respondToCollaborationRequest from "./respondToCollaborationRequest/respondToCollaborationRequest";
import { getSignupContext } from "./signup/context";
import signup from "./signup/signup";
import updateUser from "./updateUser/updateUser";
import userExists from "./userExists/userExists";

export default class UserEndpointsGraphQLController {
    public signup(data, req) {
        return wrapEndpoint(data, req, () =>
            signup(
                getSignupContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public changePassword(data, req) {
        return wrapEndpoint(data, req, () =>
            changePassword(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public changePasswordWithToken(data, req) {
        return wrapEndpoint(data, req, () =>
            changePasswordWithToken(
                getChangePasswordWithTokenContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public forgotPassword(data, req) {
        return wrapEndpoint(data, req, () =>
            forgotPassword(
                new ForgotPasswordContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public getChangePasswordTokenData(data, req) {
        return wrapEndpoint(data, req, () =>
            getChangePasswordTokenData(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public getUserData(data, req) {
        return wrapEndpoint(data, req, () =>
            getUserData(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public login(data, req) {
        return wrapEndpoint(data, req, () =>
            login(getBaseContext(), RequestData.fromExpressRequest(req, data))
        );
    }

    public respondToCollaborationRequest(data, req) {
        return wrapEndpoint(data, req, () =>
            respondToCollaborationRequest(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public updateUser(data, req) {
        return wrapEndpoint(data, req, () =>
            updateUser(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public userExists(data, req) {
        return wrapEndpoint(data, req, () =>
            userExists(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }
}

export const getUserEndpointsGraphQLController = makeSingletonFunc(
    () => new UserEndpointsGraphQLController()
);
