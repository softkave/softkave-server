import makeSingletonFn from "../../utilities/createSingletonFunc";
import { wrapEndpointREST } from "../utils";
import changePasswordWithToken from "./changePasswordWithToken/changePasswordWithToken";
import { getChangePasswordWithTokenContext } from "./changePasswordWithToken/context";
import getUserData from "./getUserData/getUserData";
import login from "./login/login";
import signup from "./signup/signup";
import updateUser from "./updateUser/updateUser";
import userExists from "./userExists/userExists";
import changePasswordWithCurrentPassword from "./changePasswordWithCurrentPassword/handler";
import { getChangePasswordWithCurrentPasswordContext } from "./changePasswordWithCurrentPassword/context";
import ForgotPasswordContext from "./forgotPassword/context";
import forgotPassword from "./forgotPassword/forgotPassword";

export default class UserEndpointsGraphQLController {
    public signup = wrapEndpointREST(signup);
    public changePassword = wrapEndpointREST(
        changePasswordWithCurrentPassword,
        getChangePasswordWithCurrentPasswordContext()
    );
    public changePasswordWithToken = wrapEndpointREST(
        changePasswordWithToken,
        getChangePasswordWithTokenContext()
    );
    public forgotPassword = wrapEndpointREST(
        forgotPassword,
        new ForgotPasswordContext()
    );
    public getUserData = wrapEndpointREST(getUserData);
    public login = wrapEndpointREST(login);
    public updateUser = wrapEndpointREST(updateUser);
    public userExists = wrapEndpointREST(userExists);
}

export const getUserEndpointsGraphQLController = makeSingletonFn(
    () => new UserEndpointsGraphQLController()
);
