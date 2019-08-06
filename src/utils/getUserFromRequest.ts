import { Request } from "express";

import userError from "../endpoints/user/userError";
import UserModel from "../mongo/user/UserModel";
import jwtConstants from "./jwtConstants";

// TODO: define all any types
// TODO: define all possible actions in one file
export interface IGetUserFromRequestParamters {
  req: Request & any;
  userModel: UserModel;
  domain?: string;
}

async function getUserFromRequest({
  req,
  userModel,
  domain = jwtConstants.domains.login
}: IGetUserFromRequestParamters) {
  if (req.fetchedUser) {
    return req.fetchedUser;
  }

  if (!req.user || !req.user.customId || req.user.domain !== domain) {
    throw userError.invalidCredentials;
  }

  const userTokenData = req.user;
  let user = null;
  const query = {
    customId: userTokenData.customId
  };

  // TODO: transform _id to id in all db fetch
  user = await userModel.model.findOne(query).exec();

  if (!user) {
    throw userError.permissionDenied;
  }

  req.user = user;
  req.fetchedUser = user;

  if (Array.isArray(user.changePasswordHistory)) {
    if (Array.isArray(userTokenData.changePasswordHistory)) {
      user.changePasswordHistory.forEach((time: number, index: number) => {
        if (time !== userTokenData.changePasswordHistory[index]) {
          throw userError.loginAgain;
        }
      });
    } else {
      throw userError.loginAgain;
    }
  }

  return user;
}

export default getUserFromRequest;
