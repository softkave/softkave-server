import moment from "moment";
import { IServerRequest } from "../endpoints/contexts/types";
import { PermissionDeniedError } from "../endpoints/errors";
import {
  InvalidCredentialsError,
  LoginAgainError,
} from "../endpoints/user/errors";
import UserToken, { IBaseUserTokenData } from "../endpoints/user/UserToken";
import { JWTEndpoints } from "../endpoints/utils";
import { IUser, IUserModel } from "../mongo/user";
import logger from "../utilities/logger";
import { resolveJWTError } from "./handleErrors";

export interface IGetUserFromRequestParamters {
  req: IServerRequest;
  userModel: IUserModel;
  audience?: JWTEndpoints;
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

  const user = await validateUserTokenData(
    req.user,
    userModel,
    required,
    audience
  );

  req.userData = user;
  return user;
}

export async function validateUserTokenData(
  tokenData: IBaseUserTokenData,
  userModel: IUserModel,
  required: boolean = true,
  audience = JWTEndpoints.Login
) {
  if (!tokenData || !UserToken.containsAudience(tokenData, audience)) {
    if (required) {
      throw new InvalidCredentialsError();
    }
  }

  let user: IUser = null;
  const query = {
    customId: tokenData.sub.id,
  };

  user = await userModel.model.findOne(query).exec();

  if (!user) {
    throw new PermissionDeniedError();
  }

  const userPasswordLastChangedAt = moment(user.passwordLastChangedAt);
  const tokenDataPasswordLastChangedAt = moment(
    tokenData.sub.passwordLastChangedAt
  );

  if (
    !tokenData.sub.passwordLastChangedAt ||
    !user.passwordLastChangedAt ||
    userPasswordLastChangedAt > tokenDataPasswordLastChangedAt
  ) {
    throw new LoginAgainError();
  }

  return user;
}

export async function validateUserToken(
  token: string,
  userModel: IUserModel,
  required: boolean = true,
  audience = JWTEndpoints.Login
) {
  try {
    const tokenData = UserToken.decodeToken(token);

    return validateUserTokenData(tokenData, userModel, required, audience);
  } catch (error) {
    logger.error(error);
    const JWTError = resolveJWTError(error);

    if (JWTError) {
      throw JWTError;
    }

    throw new PermissionDeniedError();
  }
}

export default getUserFromRequest;
