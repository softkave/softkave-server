import jwt from "jsonwebtoken";
import { IUser } from "../../mongo/user";
import { userConstants } from "./constants";
import { LoginAgainError } from "./errors";

export interface IUserTokenSubject {
  id: string;
  email: string;
  passwordLastChangedAt: string;
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
      passwordLastChangedAt: p.user.passwordLastChangedAt,
      ...p.additionalData,
    };

    const payload: object = {
      sub: subject,
      aud: p.audience || [],
      version: userConstants.currentTokenVersion,
    };

    if (p.expires) {
      // @ts-ignore
      payload.exp = p.expires / 1000; // exp is in seconds
    }

    return jwt.sign(payload, process.env.JWT_SECRET);
  }

  public static decodeToken(token: string): IBaseUserTokenData {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    }) as IBaseUserTokenData;

    UserToken.checkVersion(tokenData);
    return tokenData;
  }

  public static containsAudience(tokenData: IBaseUserTokenData, aud: string) {
    UserToken.checkVersion(tokenData);
    const audience = tokenData.aud;
    return !!audience.find((nextAud) => nextAud === "*" || nextAud === aud);
  }

  public static checkVersion(tokenData: IBaseUserTokenData) {
    if (
      !tokenData.version ||
      tokenData.version !== userConstants.currentTokenVersion
    ) {
      throw new LoginAgainError();
    }
  }
}
