import {
  insertChangePasswordCredentials,
  insertUserCredentials,
  wrapGraphQLOperation
} from "../utils";
import changePassword from "./changePassword";
import changePasswordWithToken from "./changePasswordWithToken";
import forgotPassword from "./forgotPassword";
import getChangePasswordTokenData from "./getChangePasswordTokenData";
import getCollaborationRequests from "./getCollaborationRequests";
import getSessionDetails from "./getSessionDetails";
import getUserData from "./getUserData";
import login from "./login";
import respondToCollaborationRequest from "./respondToCollaborationRequest";
import userSchema from "./schema";
import signup from "./signup";
import updateCollaborationRequest from "./updateCollaborationRequest";
import updateUser from "./updateUser";
import userExists from "./userExists";

// TODO: define all any types
class UserOperations {
  public userExists: any;
  public signup: any;
  public login: any;
  public forgotPassword: any;
  public changePassword: any;
  public updateUser: any;
  public changePasswordWithToken: any;
  public updateCollaborationRequest: any;
  public respondToCollaborationRequest: any;
  public getCollaborationRequests: any;
  public getUserData: any;
  public getChangePasswordTokenData: any;
  public getSessionDetails: any;

  constructor(staticParams: any) {
    const middlewares = [insertUserCredentials];

    this.userExists = wrapGraphQLOperation(userExists, staticParams);
    this.signup = wrapGraphQLOperation(signup, staticParams);
    this.login = wrapGraphQLOperation(login, staticParams);
    this.forgotPassword = wrapGraphQLOperation(forgotPassword, staticParams);
    this.changePassword = wrapGraphQLOperation(
      changePassword,
      staticParams,
      middlewares
    );

    this.updateUser = wrapGraphQLOperation(
      updateUser,
      staticParams,
      middlewares
    );

    this.changePasswordWithToken = wrapGraphQLOperation(
      changePasswordWithToken,
      staticParams,
      [insertChangePasswordCredentials]
    );
    this.updateCollaborationRequest = wrapGraphQLOperation(
      updateCollaborationRequest,
      staticParams,
      middlewares
    );

    this.respondToCollaborationRequest = wrapGraphQLOperation(
      respondToCollaborationRequest,
      staticParams,
      middlewares
    );

    this.getCollaborationRequests = wrapGraphQLOperation(
      getCollaborationRequests,
      staticParams,
      middlewares
    );

    this.getUserData = wrapGraphQLOperation(
      getUserData,
      staticParams,
      middlewares
    );

    this.getChangePasswordTokenData = wrapGraphQLOperation(
      getChangePasswordTokenData,
      staticParams
    );

    this.getSessionDetails = wrapGraphQLOperation(
      getSessionDetails,
      staticParams,
      middlewares
    );
  }
}

export { UserOperations, userSchema };
