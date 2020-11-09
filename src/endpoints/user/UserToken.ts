import jwt from "jsonwebtoken";
import { IUser } from "../../mongo/user";
import { LoginAgainError } from "./errors";

const CURRENT_TOKEN_VERSION = 4;
const GENERAL_AUDIENCE = "*";

export interface IUserTokenSubject {
    id: string;
    email: string;
    td?: string; // passwordLastChangedAt
    cl?: string; // clientId
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
    clientId?: string;
    additionalData?: any;
    expires?: number;
}

export default class UserToken {
    public static newToken(p: INewUserTokenParameters) {
        const subject: IUserTokenSubject = {
            id: p.user.customId,
            email: p.user.email,
            plca: p.user.passwordLastChangedAt,
            cl: p.clientId,
            ...p.additionalData,
        };

        const payload: object = {
            sub: subject,
            aud: p.audience || [],
            version: CURRENT_TOKEN_VERSION,
        };

        if (p.expires) {
            // @ts-ignore
            payload.exp = p.expires / 1000; // exp is in seconds
        }

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

    public static containsAudience(tokenData: IBaseUserTokenData, aud: string) {
        UserToken.checkVersion(tokenData);
        const audience = tokenData.aud;
        return !!audience.find(
            (nextAud) => nextAud === GENERAL_AUDIENCE || nextAud === aud
        );
    }

    public static checkVersion(tokenData: IBaseUserTokenData) {
        if (!tokenData.version || tokenData.version !== CURRENT_TOKEN_VERSION) {
            throw new LoginAgainError();
        }
    }

    public static getPasswordLastChangedAt(tokenData: IBaseUserTokenData) {
        return tokenData.sub.td;
    }

    public static getClientId(tokenData: IBaseUserTokenData) {
        return tokenData.sub.cl;
    }
}
