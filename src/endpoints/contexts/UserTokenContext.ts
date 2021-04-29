import jwt from "jsonwebtoken";
import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { ServerError } from "../../utilities/errors";
import { getDateString } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import RequestData from "../RequestData";
import { JWTEndpoints } from "../types";
import { CredentialsExpiredError, LoginAgainError } from "../user/errors";
import { fireAndForgetPromise, wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

export const CURRENT_USER_TOKEN_VERSION = 5;

export interface IGeneralTokenSubject {
    id: string;
}

export interface IUserTokenSubject extends IGeneralTokenSubject {
    clientId: string;
}

export interface IBaseTokenData<
    Sub extends IGeneralTokenSubject = IGeneralTokenSubject
> {
    version: number;
    sub: Sub;
    iat: number;
    aud: string[];
    exp?: number;
}

export interface IDecodedTokenData<
    Sub extends IGeneralTokenSubject = IGeneralTokenSubject
> extends IBaseTokenData<Sub> {
    meta?: Record<string, string | number | boolean | null>;
    userId?: string;
}

export type IUserTokenData = IBaseTokenData<IUserTokenSubject>;

export interface IDecodedUserTokenData
    extends IDecodedTokenData<IUserTokenSubject> {
    userId: string;
}

export interface INewUserTokenParameters {
    user: IUser;
    audience: JWTEndpoints[];
    expires?: number;
    meta?: Record<string, string | number | boolean | null>;
}

export interface INewTokenParameters {
    audience: JWTEndpoints[];
    expires?: number;
    meta?: Record<string, string | number | boolean | null>;
    user?: IUser;
}

export interface IUserTokenContext {
    newUserToken: (
        ctx: IBaseContext,
        params: INewUserTokenParameters
    ) => string;
    newToken: (ctx: IBaseContext, params: INewTokenParameters) => string;
    getUserToken: (
        ctx: IBaseContext,
        reqData: RequestData,
        params: INewUserTokenParameters
    ) => Promise<string>;
    decodeUserToken: (
        ctx: IBaseContext,
        token: string
    ) => Promise<IDecodedUserTokenData>;
    completeDecodeUserToken: (
        ctx: IBaseContext,
        tokenData: IUserTokenData
    ) => Promise<IDecodedUserTokenData>;
    decodeToken: (
        ctx: IBaseContext,
        token: string
    ) => Promise<IDecodedTokenData<IGeneralTokenSubject>>;
    containsAudience: (
        ctx: IBaseContext,
        tokenData: IDecodedTokenData<IGeneralTokenSubject>,
        inputAud: JWTEndpoints
    ) => boolean;
}

class UserTokenContext implements IUserTokenContext {
    newUserToken = wrapFireAndThrowError(
        (ctx: IBaseContext, params: INewUserTokenParameters) => {
            const tokenId = getNewId();
            const clientId = getNewId();
            const payload: Omit<IUserTokenData, "iat"> = {
                aud: params.audience || [],
                version: CURRENT_USER_TOKEN_VERSION,
                sub: {
                    clientId,
                    id: tokenId,
                },
            };

            if (params.expires) {
                // @ts-ignore
                payload.exp = p.expires / 1000; // exp is in seconds
            }

            fireAndForgetPromise(
                ctx.client.saveClient(ctx, {
                    customId: clientId,
                    createdAt: getDateString(),
                    userId: params.user.customId,
                })
            );

            fireAndForgetPromise(
                ctx.token.saveToken(ctx, {
                    customId: tokenId,
                    audience: params.audience,
                    issuedAt: getDateString(),
                    userId: params.user.customId,
                    version: CURRENT_USER_TOKEN_VERSION,
                    expires: params.expires,
                    isActive: true,
                    meta: params.meta,
                })
            );

            return jwt.sign(payload, ctx.appVariables.jwtSecret);
        }
    );

    newToken = wrapFireAndThrowError(
        (ctx: IBaseContext, params: INewTokenParameters) => {
            const tokenId = getNewId();
            const payload: Omit<IBaseTokenData<IGeneralTokenSubject>, "iat"> = {
                aud: params.audience || [],
                version: CURRENT_USER_TOKEN_VERSION,
                sub: {
                    id: tokenId,
                },
            };

            if (params.expires) {
                // @ts-ignore
                payload.exp = p.expires / 1000; // exp is in seconds
            }

            fireAndForgetPromise(
                ctx.token.saveToken(ctx, {
                    customId: tokenId,
                    audience: params.audience,
                    issuedAt: getDateString(),
                    userId: params.user?.customId,
                    version: CURRENT_USER_TOKEN_VERSION,
                    expires: params.expires,
                    isActive: true,
                    meta: params.meta,
                })
            );

            return jwt.sign(payload, ctx.appVariables.jwtSecret);
        }
    );

    getUserToken = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            reqData: RequestData<any, IDecodedUserTokenData>,
            params: INewUserTokenParameters
        ) => {
            if (
                !reqData.tokenData ||
                !reqData.clientId ||
                reqData.tokenData.version < CURRENT_USER_TOKEN_VERSION
            ) {
                return ctx.userToken.newUserToken(ctx, params);
            }

            const [client, token] = await Promise.all([
                ctx.client.getClientById(ctx, reqData.clientId),
                ctx.token.getTokenById(ctx, reqData.tokenData.sub.id),
            ]);

            if (!client || !token || !token.isActive) {
                return ctx.userToken.newUserToken(ctx, params);
            }

            const payload: Omit<IUserTokenData, "iat"> = {
                aud: params.audience || [],
                version: CURRENT_USER_TOKEN_VERSION,
                sub: {
                    clientId: reqData.tokenData.sub.clientId,
                    id: reqData.tokenData.sub.id,
                },
            };

            if (params.expires) {
                // @ts-ignore
                payload.exp = p.expires / 1000; // exp is in seconds
            }

            return jwt.sign(payload, ctx.appVariables.jwtSecret);
        }
    );

    decodeUserToken = wrapFireAndThrowError(
        async (ctx: IBaseContext, token: string) => {
            const tokenData = jwt.verify(
                token,
                ctx.appVariables.jwtSecret
            ) as IDecodedUserTokenData;

            if (tokenData.version < CURRENT_USER_TOKEN_VERSION) {
                throw new LoginAgainError();
            }

            return ctx.userToken.completeDecodeUserToken(ctx, tokenData);
        }
    );

    completeDecodeUserToken = wrapFireAndThrowError(
        async (ctx: IBaseContext, tokenData: IUserTokenData) => {
            const decodedData: IDecodedUserTokenData = {
                ...tokenData,
                userId: "", // TODO: this is a hack! Can we find a better way?
            };

            const [client, dbToken] = await Promise.all([
                ctx.client.assertGetClientById(ctx, decodedData.sub.clientId),
                ctx.token.assertGetTokenById(ctx, decodedData.sub.id),
            ]);

            if (!dbToken.isActive) {
                throw new CredentialsExpiredError();
            }

            decodedData.meta = dbToken.meta;
            decodedData.userId = dbToken.userId;

            if (!decodedData.userId) {
                console.log(`token: ${dbToken.customId} exists with no userId`);
                throw new ServerError();
            }

            return decodedData;
        }
    );

    decodeToken = wrapFireAndThrowError(
        async (ctx: IBaseContext, token: string) => {
            const tokenData = jwt.verify(
                token,
                ctx.appVariables.jwtSecret
            ) as IDecodedTokenData<IGeneralTokenSubject>;

            if (tokenData.version < CURRENT_USER_TOKEN_VERSION) {
                throw new LoginAgainError();
            }

            const dbToken = await ctx.token.assertGetTokenById(
                ctx,
                tokenData.sub.id
            );

            if (!dbToken.isActive) {
                throw new CredentialsExpiredError();
            }

            tokenData.meta = dbToken.meta;
            tokenData.userId = dbToken.userId;
            return tokenData;
        }
    );

    containsAudience = wrapFireAndThrowError(
        (
            ctx: IBaseContext,
            tokenData: IBaseTokenData<any>,
            inputAud: JWTEndpoints
        ) => {
            const audience = tokenData.aud;
            const hasAudience = !!audience.find(
                (nextAud) =>
                    nextAud === JWTEndpoints.Universal || nextAud === inputAud
            );

            return hasAudience;
        }
    );
}

export const getUserTokenContext = makeSingletonFunc(
    () => new UserTokenContext()
);
