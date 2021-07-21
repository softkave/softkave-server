import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import changePasswordWithToken from "./changePasswordWithToken/changePasswordWithToken";
import { getChangePasswordWithTokenContext } from "./changePasswordWithToken/context";
import ForganizationotPasswordContext from "./forganizationotPassword/context";
import forganizationotPassword from "./forganizationotPassword/forganizationotPassword";
import getUserData from "./getUserData/getUserData";
import login from "./login/login";
import { getSignupContext } from "./signup/context";
import signup from "./signup/signup";
import updateUser from "./updateUser/updateUser";
import userExists from "./userExists/userExists";
import changePasswordWithCurrentPassword from "./changePasswordWithCurrentPassword/handler";
import { getChangePasswordWithCurrentPasswordContext } from "./changePasswordWithCurrentPassword/context";

export default class UserEndpointsGraphQLController {
    public signup(data, req) {
        return wrapEndpoint(data, req, async () =>
            // @ts-ignore
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
            changePasswordWithCurrentPassword(
                getChangePasswordWithCurrentPasswordContext(),
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

    public forganizationotPassword(data, req) {
        return wrapEndpoint(data, req, async () =>
            forganizationotPassword(
                new ForganizationotPasswordContext(),
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

    public updateUser(data, req) {
        return wrapEndpoint(data, req, async () =>
            updateUser(
                getBaseContext(),
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
}

export const getUserEndpointsGraphQLController = makeSingletonFunc(
    () => new UserEndpointsGraphQLController()
);
