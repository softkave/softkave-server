import { PermissionDeniedError } from "../endpoints/errors";
import { userEndpoints } from "../endpoints/user/constants";
import {
  InvalidCredentialsError,
  LoginAgainError
} from "../endpoints/user/errors";
import UserToken from "../endpoints/user/UserToken";
import { IUser } from "../mongo/user";
import UserModel from "../mongo/user/UserModel";
import { IServerRequest } from "../utilities/types";

export interface IGetUserFromRequestParamters {
  req: IServerRequest;
  userModel: UserModel;
  audience?: string;
  required?: boolean;
}

async function getUserFromRequest({
  req,
  userModel,
  required,
  audience = userEndpoints.login
}: IGetUserFromRequestParamters) {
  if (req.fullUserData) {
    return req.fullUserData;
  }

  if (!req.user || !UserToken.containsAudience(req.user, audience)) {
    if (required) {
      throw new InvalidCredentialsError();
    }
  }

  const userTokenData = req.user;
  let user: IUser = null;
  const query = {
    customId: userTokenData.sub.id
  };

  user = await userModel.model.findOne(query).exec();

  if (!user) {
    throw new PermissionDeniedError();
  }

  req.fullUserData = user;

  if (Array.isArray(user.changePasswordHistory)) {
    if (Array.isArray(userTokenData.sub.changePasswordHistory)) {
      user.changePasswordHistory.forEach((time: number, index: number) => {
        if (time !== userTokenData.sub.changePasswordHistory[index]) {
          throw new LoginAgainError();
        }
      });
    } else {
      throw new LoginAgainError();
    }
  }

  return user;
}

export default getUserFromRequest;
