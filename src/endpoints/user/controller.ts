import { IEndpointControllerProps } from "../controller";
import { wrapEndpoint } from "../utils";
import changePassword from "./changePassword/changePassword";
import ChangePasswordContext from "./changePassword/context";
import changePasswordWithToken from "./changePasswordWithToken/changePasswordWithToken";
import ChangePasswordWithTokenContext from "./changePasswordWithToken/context";
import ForgotPasswordContext from "./forgotPassword/context";
import forgotPassword from "./forgotPassword/forgotPassword";
import GetChangePasswordTokenDataContext from "./getChangePasswordTokenData/context";
import getChangePasswordTokenData from "./getChangePasswordTokenData/getChangePasswordTokenData";
import GetCollaborationRequestsContext from "./getCollaborationRequests/context";
import getCollaborationRequests from "./getCollaborationRequests/getCollaborationRequests";
import GetSessionDetailsContext from "./getSessionDetails/context";
import getSessionDetails from "./getSessionDetails/getSessionDetails";
import GetUserDataContext from "./getUserData/context";
import getUserData from "./getUserData/getUserData";
import LoginContext from "./login/context";
import login from "./login/login";
import RespondToCollaborationRequestContext from "./respondToCollaborationRequest/context";
import respondToCollaborationRequest from "./respondToCollaborationRequest/respondToCollaborationRequest";
import SignupContext from "./signup/context";
import signup from "./signup/signup";
import UpdateCollaborationRequestContext from "./updateCollaborationRequest/context";
import updateCollaborationRequest from "./updateCollaborationRequest/updateCollaborationRequest";
import UpdateUserContext from "./updateUser/context";
import updateUser from "./updateUser/updateUser";
import UserExistsContext from "./userExists/context";
import userExists from "./userExists/userExists";

export default class UserController {
  protected props: IEndpointControllerProps;

  constructor(props: IEndpointControllerProps) {
    this.props = props;
  }

  public signup(data, req) {
    return wrapEndpoint(data, req, () =>
      signup(
        new SignupContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public changePassword(data, req) {
    return wrapEndpoint(data, req, () =>
      changePassword(
        new ChangePasswordContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public changePasswordWithToken(data, req) {
    return wrapEndpoint(data, req, () =>
      changePasswordWithToken(
        new ChangePasswordWithTokenContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public forgotPassword(data, req) {
    return wrapEndpoint(data, req, () =>
      forgotPassword(
        new ForgotPasswordContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public getChangePasswordTokenData(data, req) {
    return wrapEndpoint(data, req, () =>
      getChangePasswordTokenData(
        new GetChangePasswordTokenDataContext({
          req,
          ...this.props
        })
      )
    );
  }

  public getCollaborationRequests(data, req) {
    return wrapEndpoint(data, req, () =>
      getCollaborationRequests(
        new GetCollaborationRequestsContext({
          req,
          ...this.props
        })
      )
    );
  }

  public getSessionDetails(data, req) {
    return wrapEndpoint(data, req, () =>
      getSessionDetails(
        new GetSessionDetailsContext({
          req,
          ...this.props
        })
      )
    );
  }

  public getUserData(data, req) {
    return wrapEndpoint(data, req, () =>
      getUserData(
        new GetUserDataContext({
          req,
          ...this.props
        })
      )
    );
  }

  public login(data, req) {
    return wrapEndpoint(data, req, () =>
      login(
        new LoginContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public respondToCollaborationRequest(data, req) {
    return wrapEndpoint(data, req, () =>
      respondToCollaborationRequest(
        new RespondToCollaborationRequestContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public updateCollaborationRequest(data, req) {
    return wrapEndpoint(data, req, () =>
      updateCollaborationRequest(
        new UpdateCollaborationRequestContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public updateUser(data, req) {
    return wrapEndpoint(data, req, () =>
      updateUser(
        new UpdateUserContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public userExists(data, req) {
    return wrapEndpoint(data, req, () =>
      userExists(
        new UserExistsContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }
}
