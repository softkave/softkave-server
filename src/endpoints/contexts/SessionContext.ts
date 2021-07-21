import { IClient } from "../../mongo/client";
import { IToken } from "../../mongo/token";
import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { clientConstants } from "../client/constants";
import { InvalidRequestError } from "../errors";
import RequestData from "../RequestData";
import { JWTEndpoint } from "../types";
import { InvalidCredentialsError, LoginAgainError } from "../user/errors";
import { tryCatch, wrapFireAndThrowError } from "../utils";
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
    public getIncomingTokenData = wrapFireAndThrowError(
        (ctx: IBaseContext, data: RequestData) => {
            if (data.incomingTokenData) {
                return data.incomingTokenData;
            }

            throw new InvalidRequestError();
        }
    );

    public getTokenData = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            data: RequestData,
            audience?: JWTEndpoint
        ) => {
            if (data.tokenData) {
                return data.tokenData;
            }

            const incomingTokenData = await ctx.session.getIncomingTokenData(
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

    public getClient = wrapFireAndThrowError(
        async (ctx: IBaseContext, data: RequestData) => {
            if (data.client) {
                return data.client;
            }

            const tokenData = await ctx.session.tryGetTokenData(ctx, data);
            const clientId = data.clientId;

            if (clientId) {
                if (tokenData && clientId !== tokenData.clientId) {
                    throw new InvalidCredentialsError();
                }
            } else {
                throw new LoginAgainError();
            }

            const client = await ctx.client.assertGetClientById(ctx, clientId);
            data.client = client;
            return client;
        }
    );

    public tryGetTokenData = wrapFireAndThrowError(
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

    public tryGetClient = wrapFireAndThrowError(
        async (ctx: IBaseContext, data: RequestData) => {
            return await tryCatch(() => ctx.session.getClient(ctx, data));
        }
    );

    public tryGetUser = wrapFireAndThrowError(
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

    public getUser = wrapFireAndThrowError(
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

    public assertUser = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            data: RequestData,
            audience?: JWTEndpoint
        ) => {
            return !!(await ctx.session.getUser(ctx, data, audience));
        }
    );

    public assertClient = wrapFireAndThrowError(
        async (ctx: IBaseContext, data: RequestData) => {
            return !!(await ctx.session.getClient(ctx, data));
        }
    );
}

export const getSessionContext = makeSingletonFunc(() => new SessionContext());
