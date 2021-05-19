import { IClientUserView } from "../../mongo/client";
import { IToken } from "../../mongo/token";
import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { clientConstants } from "../client/constants";
import { clientToClientUserView } from "../client/utils";
import { InvalidRequestError } from "../errors";
import RequestData from "../RequestData";
import { JWTEndpoint } from "../types";
import { InvalidCredentialsError, LoginAgainError } from "../user/errors";
import { tryCatch, wrapFireAndDontThrow } from "../utils";
import { IBaseContext } from "./BaseContext";
import { IBaseTokenData } from "./TokenContext";

export interface ISessionContext {
    getIncomingTokenData: (
        ctx: IBaseContext,
        data: RequestData
    ) => IBaseTokenData;
    getTokenData: (
        ctx: IBaseContext,
        data: RequestData,
        audience?: JWTEndpoint
    ) => Promise<IToken>;
    getClient: (
        ctx: IBaseContext,
        data: RequestData
    ) => Promise<IClientUserView>;
    getUser: (
        ctx: IBaseContext,
        data: RequestData,
        audience?: JWTEndpoint
    ) => Promise<IUser>;
    tryGetUser: (
        ctx: IBaseContext,
        data: RequestData,
        audience?: JWTEndpoint
    ) => Promise<IUser | null>;
    tryGetTokenData: (
        ctx: IBaseContext,
        data: RequestData,
        audience?: JWTEndpoint
    ) => Promise<IToken | null>;
    tryGetClient: (
        ctx: IBaseContext,
        data: RequestData
    ) => Promise<IClientUserView | null>;
    assertUser: (
        ctx: IBaseContext,
        data: RequestData,
        audience?: JWTEndpoint
    ) => Promise<boolean>;
    assertClient: (ctx: IBaseContext, data: RequestData) => Promise<boolean>;
}

export default class SessionContext implements ISessionContext {
    public getIncomingTokenData = wrapFireAndDontThrow(
        (ctx: IBaseContext, data: RequestData) => {
            if (data.incomingTokenData) {
                return data.incomingTokenData;
            }

            let incomingTokenData: IBaseTokenData | null = null;

            if (data.req) {
                incomingTokenData = data.req.user;
            } else if (data.incomingSocketData) {
                const tokenString = data.incomingSocketData.token;
                incomingTokenData = ctx.token.decodeToken(ctx, tokenString);
            }

            if (!incomingTokenData) {
                throw new InvalidRequestError();
            }

            data.incomingTokenData = incomingTokenData;
            return incomingTokenData;
        }
    );

    public getTokenData = wrapFireAndDontThrow(
        async (
            ctx: IBaseContext,
            data: RequestData,
            audience?: JWTEndpoint
        ) => {
            if (data.tokenData) {
                return data.tokenData;
            }

            const incomingTokenData = ctx.session.getIncomingTokenData(
                ctx,
                data
            );

            const tokenData = await ctx.token.assertGetTokenById(
                ctx,
                incomingTokenData.sub.id
            );

            if (audience) {
                ctx.token.containsAudience(ctx, tokenData, audience);
            }

            data.tokenData = tokenData;
            return tokenData;
        }
    );

    public getClient = wrapFireAndDontThrow(
        async (ctx: IBaseContext, data: RequestData) => {
            if (data.client) {
                return data.client;
            }

            const tokenData = await ctx.session.getTokenData(ctx, data);
            let clientId = "";

            if (data.req) {
                clientId = data.req.headers[
                    clientConstants.clientIdHeaderKey
                ] as string;
            } else if (data.incomingSocketData) {
                clientId = data.incomingSocketData.clientId;
            }

            if (clientId) {
                if (clientId !== tokenData.clientId) {
                    throw new InvalidCredentialsError();
                }
            } else {
                throw new LoginAgainError();
            }

            // if (!clientId) {
            //     throw new LoginAgainError();
            // }

            const client = await ctx.client.assertGetClientById(ctx, clientId);
            const clientUserView = clientToClientUserView(
                client,
                tokenData.userId
            );

            data.client = clientUserView;
            return clientUserView;
        }
    );

    public tryGetTokenData = wrapFireAndDontThrow(
        async (
            ctx: IBaseContext,
            data: RequestData,
            audience?: JWTEndpoint
        ) => {
            return await tryCatch(() =>
                ctx.session.getTokenData(ctx, data, audience)
            );
        }
    );

    public tryGetClient = wrapFireAndDontThrow(
        async (ctx: IBaseContext, data: RequestData) => {
            return await tryCatch(() => ctx.session.getClient(ctx, data));
        }
    );

    public tryGetUser = wrapFireAndDontThrow(
        async (
            ctx: IBaseContext,
            data: RequestData,
            audience?: JWTEndpoint
        ) => {
            return await tryCatch(() =>
                ctx.session.getUser(ctx, data, audience)
            );
        }
    );

    public getUser = wrapFireAndDontThrow(
        async (
            ctx: IBaseContext,
            data: RequestData,
            audience?: JWTEndpoint
        ) => {
            const tokenData = await ctx.session.getTokenData(
                ctx,
                data,
                audience
            );

            await ctx.session.getClient(ctx, data);
            const user = await ctx.user.assertGetUserById(
                ctx,
                tokenData.userId
            );

            data.user = user;
            return user;
        }
    );

    public assertUser = wrapFireAndDontThrow(
        async (
            ctx: IBaseContext,
            data: RequestData,
            audience?: JWTEndpoint
        ) => {
            return !!(await ctx.session.getUser(ctx, data, audience));
        }
    );

    public assertClient = wrapFireAndDontThrow(
        async (ctx: IBaseContext, data: RequestData) => {
            return !!(await ctx.session.getClient(ctx, data));
        }
    );
}

export const getSessionContext = makeSingletonFunc(() => new SessionContext());
