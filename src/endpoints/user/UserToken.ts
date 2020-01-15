import jwt from "jsonwebtoken";
import { IUser } from "../../mongo/user";
import { userConstants } from "./constants";

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
}

export interface INewUserTokenParameters {
  user: IUser;
  audience: string[];
  additionalData?: any;
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
        version: userConstants.currentTokenVersion
      },
      JWT_SECRET
    );
  }

  public static decodeToken(token: string): IBaseUserTokenData {
    return jwt.verify(token, JWT_SECRET, {
      ignoreExpiration: true
    }) as IBaseUserTokenData;
  }

  public static containsAudience(tokenData: IBaseUserTokenData, aud: string) {
    const audience = tokenData.aud;
    return !!audience.find(nextAud => nextAud === "*" || nextAud === aud);
  }
}
