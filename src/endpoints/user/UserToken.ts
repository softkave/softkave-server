import jwt from "jsonwebtoken";
import { IUser } from "../../mongo/user";
import { userConstants } from "./constants";
import { LoginAgainError } from "./errors";

const JWT_SECRET = process.env.JWT_SECRET;

export interface IUserTokenSubject {
  id: string;
  email: string;
  changePasswordHistory: number[];
}

export interface IBaseUserTokenData {
  version: number;
  sub: IUserTokenSubject;
  iat: number;
  aud: string[];
  exp?: number;
}

export interface INewUserTokenParameters {
  user: IUser;
  audience: string[];
  additionalData?: any;
  expires?: number;
}

export default class UserToken {
  public static newToken(p: INewUserTokenParameters) {
    const subject: IUserTokenSubject = {
      id: p.user.customId,
      email: p.user.email,
      changePasswordHistory: p.user.changePasswordHistory,
      ...p.additionalData
    };

    return jwt.sign(
      {
        sub: subject,
        aud: p.audience || [],
        version: userConstants.currentTokenVersion,
        exp: p.expires ? p.expires / 1000 : undefined
      },
      JWT_SECRET
    );
  }

  public static decodeToken(token: string): IBaseUserTokenData {
    const tokenData = jwt.verify(token, JWT_SECRET, {
      ignoreExpiration: true
    }) as IBaseUserTokenData;

    UserToken.checkVersion(tokenData);
    return tokenData;
  }

  public static containsAudience(tokenData: IBaseUserTokenData, aud: string) {
    UserToken.checkVersion(tokenData);
    const audience = tokenData.aud;
    return !!audience.find(nextAud => nextAud === "*" || nextAud === aud);
  }

  public static checkVersion(tokenData: IBaseUserTokenData) {
    if (!tokenData.version) {
      throw new LoginAgainError();
    }
  }
}
