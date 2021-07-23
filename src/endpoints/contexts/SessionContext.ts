import { IClient } from "../../mongo/client";
import { IToken } from "../../mongo/token";
import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { InvalidRequestError } from "../errors";
import RequestData from "../RequestData";
import { JWTEndpoint } from "../types";
import { InvalidCredentialsError, LoginAgainError } from "../user/errors";
import { tryCatch, wrapFireAndThrowErrorAsync } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface ISessionContext {
    getTokenData: (
        ctx: IBaseContext,
        data: RequestData,
        audience?: JWTEndpoint
    ) => Promise<IToken>;
    getClient: (ctx: IBaseContext, data: RequestData) => Promise<IClient>;
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
    ) => Promise<IClient | null>;
    assertUser: (
        ctx: IBaseContext,
        data: RequestData,
        audience?: JWTEndpoint
    ) => Promise<boolean>;
    assertClient: (ctx: IBaseContext, data: RequestData) => Promise<boolean>;
}

export default class SessionContext implements ISessionContext {
    public tryGetTokenData = wrapFireAndThrowErrorAsync(
        async (
            ctx: IBaseContext,
            data: RequestData,
            audience?: JWTEndpoint
        ) => {
            if (data.tokenData) {
                return data.tokenData;
            }

            const incomingTokenData = data.incomingTokenData;

            if (!incomingTokenData) {
                return null;
            }

            const tokenData = await ctx.token.getTokenById(
                ctx,
                incomingTokenData.sub.id
            );

            if (!tokenData) {
                return null;
            }

            if (audience) {
                ctx.token.containsAudience(ctx, tokenData, audience);
            }

            data.tokenData = tokenData;
            return tokenData;
        }
    );

    public getTokenData = wrapFireAndThrowErrorAsync(
        async (
            ctx: IBaseContext,
            data: RequestData,
            audience?: JWTEndpoint
        ) => {
            const tokenData = await ctx.session.tryGetTokenData(
                ctx,
                data,
                audience
            );

            if (!tokenData) {
                throw new InvalidRequestError();
            }

            return tokenData;
        }
    );

    public tryGetClient = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, data: RequestData) => {
            if (data.client) {
                return data.client;
            }

            const tokenData = await ctx.session.tryGetTokenData(ctx, data);
            const clientId = data.clientId;

            if (!clientId) {
                return null;
            }

            if (tokenData && clientId !== tokenData.clientId) {
                throw new InvalidCredentialsError();
            }

            const client = await ctx.client.getClientById(ctx, clientId);

            if (!client) {
                return null;
            }

            data.client = client;
            return client;
        }
    );

    public getClient = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, data: RequestData) => {
            if (data.client) {
                return data.client;
            }

            const tokenData = await ctx.session.tryGetTokenData(ctx, data);
            const clientId = data.clientId;

            if (!clientId) {
                throw new LoginAgainError();
            }

            if (tokenData && clientId !== tokenData.clientId) {
                throw new InvalidCredentialsError();
            }

            const client = await ctx.client.assertGetClientById(ctx, clientId);
            data.client = client;
            return client;
        }
    );

    public tryGetUser = wrapFireAndThrowErrorAsync(
        async (
            ctx: IBaseContext,
            data: RequestData,
            audience?: JWTEndpoint
        ) => {
            if (data.user) {
                return data.user;
            }

            const tokenData = await ctx.session.tryGetTokenData(
                ctx,
                data,
                audience
            );

            if (!tokenData) {
                return null;
            }

            const user = await ctx.user.getUserById(ctx, tokenData.userId);

            if (!user) {
                return null;
            }

            data.user = user;
            return user;
        }
    );

    public getUser = wrapFireAndThrowErrorAsync(
        async (
            ctx: IBaseContext,
            data: RequestData,
            audience?: JWTEndpoint
        ) => {
            if (data.user) {
                return data.user;
            }

            const tokenData = await ctx.session.getTokenData(
                ctx,
                data,
                audience
            );

            // await ctx.session.getClient(ctx, data);
            const user = await ctx.user.assertGetUserById(
                ctx,
                tokenData.userId
            );

            data.user = user;
            return user;
        }
    );

    public assertUser = wrapFireAndThrowErrorAsync(
        async (
            ctx: IBaseContext,
            data: RequestData,
            audience?: JWTEndpoint
        ) => {
            return !!(await ctx.session.getUser(ctx, data, audience));
        }
    );

    public assertClient = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, data: RequestData) => {
            return !!(await ctx.session.getClient(ctx, data));
        }
    );
}

export const getSessionContext = makeSingletonFunc(() => new SessionContext());
