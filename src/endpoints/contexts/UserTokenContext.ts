import jwt from "jsonwebtoken";
import { ClientType } from "../../models/system";
import { IClient } from "../../mongo/client";
import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDateString } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import RequestData from "../RequestData";
import { JWTEndpoints } from "../types";
import { CredentialsExpiredError } from "../user/errors";
import { fireAndForgetPromise, wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

export const CURRENT_USER_TOKEN_VERSION = 5;

export interface IGeneralTokenSubject {
    id: string;
}

export interface IUserTokenSubject extends IGeneralTokenSubject {}

export interface IBaseTokenData<
    Sub extends IGeneralTokenSubject = IGeneralTokenSubject
> {
    version: number;
    sub: Sub;
    iat: number;
    aud: string[];
    exp?: number;
}

export type IUserTokenData = IBaseTokenData<IUserTokenSubject>;

export interface IUserTokenContext {
    newUserToken: (
        ctx: IBaseContext,
        reqData: RequestData,
        params: INewUserTokenParameters
    ) => Promise<string>;
    newToken: (ctx: IBaseContext, params: INewTokenParameters) => string;
    decodeToken: (
        ctx: IBaseContext,
        token: string
    ) => Promise<IBaseTokenData<IGeneralTokenSubject>>;
    containsAudience: (
        ctx: IBaseContext,
        tokenData: IBaseTokenData<IGeneralTokenSubject>,
        inputAud: JWTEndpoints
    ) => boolean;
}

export interface INewUserTokenParameters {
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

class UserTokenContext implements IUserTokenContext {
    newUserToken = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            reqData: RequestData,
            params: INewUserTokenParameters
        ) => {
            ctx.session.assertUser(ctx, reqData);

            const tokenId = getNewId();
            const clientId = reqData.clientId || getNewId();
            const payload: Omit<IUserTokenData, "iat"> = {
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

            let clientPromise: Promise<IClient> | IClient = reqData.client;

            if (!reqData.clientId) {
                clientPromise = ctx.client.saveClient(ctx, {
                    clientId,
                    customId: getNewId(),
                    createdAt: getDateString(),
                    clientType: ClientType.Browser,
                    users: [
                        {
                            tokenId,
                            userId: reqData.user.customId,
                            muteChatNotifications: false,
                        },
                    ],
                });
            } else {
                await ctx.token.deleteTokenByUserAndClientId(
                    ctx,
                    reqData.clientId,
                    reqData.user.customId
                );
            }

            const tokenPromise = ctx.token.saveToken(ctx, {
                clientId,
                customId: tokenId,
                audience: params.audience,
                issuedAt: getDateString(),
                userId: reqData.user.customId,
                version: CURRENT_USER_TOKEN_VERSION,
                expires: params.expires,
                meta: params.meta,
            });

            const [client, token] = await Promise.all([
                clientPromise,
                tokenPromise,
            ]);

            reqData.client = client;
            reqData.clientId = clientId;
            reqData.tokenData = token;

            return jwt.sign(payload, ctx.appVariables.jwtSecret);
        }
    );

    newToken = wrapFireAndThrowError(
        (ctx: IBaseContext, params: INewTokenParameters) => {
            const tokenId = getNewId();

            // iat is assigned by the jwt library
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
                    meta: params.meta,
                })
            );

            return jwt.sign(payload, ctx.appVariables.jwtSecret);
        }
    );

    decodeToken = wrapFireAndThrowError(
        async (ctx: IBaseContext, token: string) => {
            const tokenData = jwt.verify(
                token,
                ctx.appVariables.jwtSecret
            ) as IBaseTokenData<IGeneralTokenSubject>;

            if (tokenData.version < CURRENT_USER_TOKEN_VERSION) {
                throw new CredentialsExpiredError();
            }

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
