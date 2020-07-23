import moment from "moment";
import { PermissionDeniedError } from "../endpoints/errors";
import {
  InvalidCredentialsError,
  LoginAgainError,
} from "../endpoints/user/errors";
import UserToken from "../endpoints/user/UserToken";
import { JWTEndpoints } from "../endpoints/utils";
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
  audience = JWTEndpoints.Login,
}: IGetUserFromRequestParamters) {
  // TODO: not using cached data on multiple requests
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
  const userPasswordLastChangedAt = moment(user.passwordLastChangedAt);
  const tokenDataPasswordLastChangedAt = moment(
    userTokenData.sub.passwordLastChangedAt
  );

  if (
    !userTokenData.sub.passwordLastChangedAt ||
    !user.passwordLastChangedAt ||
    userPasswordLastChangedAt > tokenDataPasswordLastChangedAt
  ) {
    throw new LoginAgainError();
  }

  return user;
}

export default getUserFromRequest;
