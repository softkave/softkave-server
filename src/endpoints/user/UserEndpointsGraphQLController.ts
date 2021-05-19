import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import changePassword from "./changePassword/changePassword";
import changePasswordWithToken from "./changePasswordWithToken/changePasswordWithToken";
import { getChangePasswordWithTokenContext } from "./changePasswordWithToken/context";
import ForgotPasswordContext from "./forgotPassword/context";
import forgotPassword from "./forgotPassword/forgotPassword";
import getUserData from "./getUserData/getUserData";
import getUserNotifications from "../notifications/getUserNotifications/getUserNotifications";
import login from "./login/login";
import respondToCollaborationRequest from "./respondToCollaborationRequest/respondToCollaborationRequest";
import { getSignupContext } from "./signup/context";
import signup from "./signup/signup";
import updateUser from "./updateUser/updateUser";
import userExists from "./userExists/userExists";
import { getUpdateUserEndpointContext } from "./updateUser/context";

export default class UserEndpointsGraphQLController {
    public signup(data, req) {
        return wrapEndpoint(data, req, async () =>
            signup(
                getSignupContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public changePassword(data, req) {
        return wrapEndpoint(data, req, async () =>
            changePassword(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public changePasswordWithToken(data, req) {
        return wrapEndpoint(data, req, async () =>
            changePasswordWithToken(
                getChangePasswordWithTokenContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public forgotPassword(data, req) {
        return wrapEndpoint(data, req, async () =>
            forgotPassword(
                new ForgotPasswordContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getUserData(data, req) {
        return wrapEndpoint(data, req, async () =>
            getUserData(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public login(data, req) {
        return wrapEndpoint(data, req, async () =>
            login(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public respondToCollaborationRequest(data, req) {
        return wrapEndpoint(data, req, async () =>
            respondToCollaborationRequest(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public updateUser(data, req) {
        return wrapEndpoint(data, req, async () =>
            updateUser(
                getUpdateUserEndpointContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public userExists(data, req) {
        return wrapEndpoint(data, req, async () =>
            userExists(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getUserNotifications(data, req) {
        return wrapEndpoint(data, req, async () =>
            getUserNotifications(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }
}

export const getUserEndpointsGraphQLController = makeSingletonFunc(
    () => new UserEndpointsGraphQLController()
);
