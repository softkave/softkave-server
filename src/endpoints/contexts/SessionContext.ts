import { IClient } from "../../mongo/client";
import { IToken } from "../../mongo/token";
import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { ServerError } from "../../utilities/errors";
import RequestData from "../RequestData";
import { IIncomingSocketEventPacket } from "../socket/types";
import { JWTEndpoints } from "../types";
import { InvalidCredentialsError } from "../user/errors";
import { IBaseContext } from "./BaseContext";

export interface ISessionContext {
    getUser: (
        ctx: IBaseContext,
        data: RequestData,
        required?: boolean,
        audience?: JWTEndpoints
    ) => Promise<IUser>;
    assertUser: (
        ctx: IBaseContext,
        data: RequestData,
        audience?: JWTEndpoints
    ) => Promise<boolean>;
    tryGetUser: (
        ctx: IBaseContext,
        data: RequestData,
        audience?: JWTEndpoints
    ) => Promise<IUser | undefined>;
    getExpressSession: (
        ctx: IBaseContext,
        data: RequestData,
        required?: boolean,
        audience?: JWTEndpoints
    ) => Promise<{ user: IUser; client: IClient; token: IToken }>;
    getSocketSession: (
        ctx: IBaseContext,
        data: RequestData,
        required?: boolean,
        audience?: JWTEndpoints
    ) => Promise<{ user: IUser; client: IClient; token: IToken }>;
    getSession: (
        ctx: IBaseContext,
        data: RequestData,
        required?: boolean,
        audience?: JWTEndpoints
    ) => Promise<{ user: IUser; client: IClient; token: IToken }>;
}

export default class SessionContext implements ISessionContext {
    private static async __getUser(
        ctx: IBaseContext,
        data: RequestData,
        required: boolean = true,
        audience = JWTEndpoints.Login
    ): Promise<IUser | undefined> {
        if (data.user) {
            return data.user;
        }

        if (data.req) {
            const { user } = await ctx.session.getExpressSession(
                ctx,
                data,
                required,
                audience
            );

            return user;
        } else if (data.socket) {
            const { user } = await ctx.session.getSocketSession(
                ctx,
                data,
                required,
                audience
            );

            return user;
        }

        throw new ServerError();
    }

    public async getSession(
        ctx: IBaseContext,
        reqData: RequestData,
        required: boolean = true,
        audience = JWTEndpoints.Login
    ) {
        const incomingTokenData = reqData.incomingTokenData;

        if (
            !incomingTokenData ||
            !ctx.userToken.containsAudience(ctx, incomingTokenData, audience)
        ) {
            if (required) {
                throw new InvalidCredentialsError();
            } else {
                return;
            }
        }

        const token =
            reqData.tokenData ||
            (await ctx.token.assertGetTokenById(ctx, incomingTokenData.sub.id));

        const [client, user] = await Promise.all([
            reqData.client ||
                ctx.client.assertGetClientById(ctx, token.clientId),
            reqData.user || ctx.user.assertGetUserById(ctx, token.userId),
        ]);

        if (token.userId !== client.userId) {
            throw new InvalidCredentialsError();
        }

        reqData.user = user;
        reqData.client = client;
        reqData.tokenData = token;

        return { token, user, client };
    }

    public async getExpressSession(
        ctx: IBaseContext,
        data: RequestData,
        required: boolean = true,
        audience = JWTEndpoints.Login
    ) {
        if (!data.req) {
            throw new ServerError();
        }

        return ctx.session.getSession(ctx, data, required, audience);
    }

    public async getSocketSession(
        ctx: IBaseContext,
        data: RequestData<IIncomingSocketEventPacket<any>>,
        required: boolean = true,
        audience = JWTEndpoints.Login
    ) {
        if (!data.socket) {
            throw new ServerError();
        }

        return ctx.session.getSession(ctx, data, required, audience);
    }

    public async getUser(
        ctx: IBaseContext,
        data: RequestData,
        required: boolean = true,
        audience = JWTEndpoints.Login
    ) {
        return SessionContext.__getUser(ctx, data, required, audience);
    }

    public async assertUser(
        ctx: IBaseContext,
        data: RequestData,
        audience = JWTEndpoints.Login
    ) {
        return !!SessionContext.__getUser(ctx, data, true, audience);
    }

    public async tryGetUser(
        ctx: IBaseContext,
        data: RequestData,
        audience = JWTEndpoints.Login
    ) {
        return SessionContext.__getUser(ctx, data, false, audience);
    }
}

export const getSessionContext = makeSingletonFunc(() => new SessionContext());
