import jwt from "jsonwebtoken";
import { IUser } from "../../mongo/user";
import { JWTEndpoints } from "../types";
import { InvalidCredentialsError, LoginAgainError } from "./errors";

export const CURRENT_USER_TOKEN_VERSION = 4;

export interface IUserTokenSubject {
    id: string;
    email: string;
    td?: string; // passwordLastChangedAt
    clientId?: string;
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
    audience: JWTEndpoints[];
    clientId?: string;
    additionalData?: any;
    expires?: number;
}

export default class UserToken {
    public static newUserTokenData(p: INewUserTokenParameters) {
        const subject: IUserTokenSubject = {
            id: p.user.customId,
            email: p.user.email,
            td: p.user.passwordLastChangedAt,
            clientId: p.clientId,
            ...p.additionalData,
        };

        const payload: Omit<IBaseUserTokenData, "iat"> = {
            sub: subject,
            aud: p.audience || [],
            version: CURRENT_USER_TOKEN_VERSION,
        };

        if (p.expires) {
            // @ts-ignore
            payload.exp = p.expires / 1000; // exp is in seconds
        }

        return payload;
    }

    public static newToken(p: INewUserTokenParameters) {
        const payload = UserToken.newUserTokenData(p);
        return jwt.sign(payload, process.env.JWT_SECRET);
    }

    public static decodeToken(token: string): IBaseUserTokenData {
        const tokenData = jwt.verify(
            token,
            process.env.JWT_SECRET
        ) as IBaseUserTokenData;

        UserToken.checkVersion(tokenData);
        return tokenData;
    }

    public static containsAudience(
        tokenData: IBaseUserTokenData,
        aud: JWTEndpoints,
        checkClientId = true
    ) {
        UserToken.checkVersion(tokenData);
        const audience = tokenData.aud;
        const hasAudience = !!audience.find(
            (nextAud) => nextAud === JWTEndpoints.Universal || nextAud === aud
        );

        if (hasAudience && checkClientId && !tokenData.sub.clientId) {
            throw new InvalidCredentialsError();
        }

        return hasAudience;
    }

    public static checkVersion(tokenData: IBaseUserTokenData) {
        if (
            !tokenData.version ||
            tokenData.version !== CURRENT_USER_TOKEN_VERSION
        ) {
            throw new LoginAgainError();
        }
    }

    public static getPasswordLastChangedAt(tokenData: IBaseUserTokenData) {
        return tokenData.sub.td;
    }

    public static getClientId(tokenData: IBaseUserTokenData) {
        return tokenData.sub.clientId;
    }
}
