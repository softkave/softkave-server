import { PermissionDeniedError } from "../endpoints/errors";
import { userJWTEndpoints } from "../endpoints/user/constants";
import {
  InvalidCredentialsError,
  LoginAgainError,
} from "../endpoints/user/errors";
import UserToken from "../endpoints/user/UserToken";
import { IUser, IUserModel } from "../mongo/user";
import { IServerRequest } from "../utilities/types";

export interface IGetUserFromRequestParamters {
  req: IServerRequest;
  userModel: IUserModel;
  audience?: string;
  required?: boolean;
}

async function getUserFromRequest({
  req,
  userModel,
  required,
  audience = userJWTEndpoints.login,
}: IGetUserFromRequestParamters) {
  if (req.userData) {
    return req.userData;
  }

  if (!req.user || !UserToken.containsAudience(req.user, audience)) {
    if (required) {
      throw new InvalidCredentialsError();
    }
  }

  const userTokenData = req.user;
  let user: IUser = null;
  const query = {
    customId: userTokenData.sub.id,
  };

  user = await userModel.model.findOne(query).exec();

  if (!user) {
    throw new PermissionDeniedError();
  }

  req.userData = user;

  if (user.passwordLastChangedAt !== userTokenData.sub.passwordLastChangedAt) {
    throw new LoginAgainError();
  }

  return user;
}

export default getUserFromRequest;
